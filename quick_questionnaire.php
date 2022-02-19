<?php
/*
Plugin Name: Quick Questionnaire
Version: 2.2
Description: Create simple questionnaires directly in the editor
Author: Michiel van Eerd
Author URI: http://www.michielvaneerd.nl
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

define('MY_QQ_PLUGIN_NAME', 'Quick Questionnaire');
define('MY_QQ_POST_TYPE', 'quick-questionnaire');

if (!defined('QQ_ALL_POSTS')) {
  define('QQ_ALL_POSTS', false);
}

// Add these JS vars to admin HTML so we can see these values inside the block build/index.js file
// and enable/disable the block if necessary
add_action('admin_head', function() {
  global $post;
  if (!empty($post)) {
    $allPosts = QQ_ALL_POSTS ? 'true' : 'false';
    echo "<script>window.qq_my_post_type = '" . $post->post_type . "'; window.qq_all_posts = $allPosts;</script>";
  }
});

function qq_register_my_content_types() {

  register_post_type(MY_QQ_POST_TYPE, array(
    'labels' => array(
      'name' => MY_QQ_PLUGIN_NAME,
      'singular_name' => MY_QQ_PLUGIN_NAME
    ),
    //'rewrite' => array('slug' => 'quick-questionnaires'),
    'public' => true,
    'has_archive' => true,
    'show_in_rest' => true,
    // Note that 'custom-fields' is necessary, because otherwise
    // this post type doesn't allow meta in panel
    // https://github.com/WordPress/gutenberg/issues/17018
    'supports' => ['title', 'editor', 'custom-fields']
  ));

  // register_post_meta(MY_QQ_POST_TYPE,
  //   '_qq_enable_show_btn', [
  //     'show_in_rest' => true,
  //     'single' => true,
  //     'type' => 'string',
  //     'auth_callback' => function() {
  //       return current_user_can('edit_posts');
  //     }
  // ]);

  register_block_type(__DIR__);

}


/*
Enqueue the plugin CSS and Javascript only when looking
at a single questionnaire.
*/
function qq_add_plugin_scripts() {

  if (is_singular() && (QQ_ALL_POSTS || get_post_type() === MY_QQ_POST_TYPE)) {

    wp_enqueue_script('qq', plugin_dir_url(__FILE__) . 'js/qq.js', null, '1.0.0', true);
    wp_enqueue_style('qq_style', plugin_dir_url(__FILE__) . 'css/qq.css');
    
    wp_localize_script('qq', 'my_ajax_obj', array(
      'ajax_url' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('qq_check'),
      'L' => array(
        'show' => 'Show',
        'check' => 'Check',
        'reset' => 'Reset'
      )
    ));
  }

}

function qq_show_shared($post_id, $list_id = null) {
  $showButtons = json_decode(get_post_meta($post_id, '_qq_enable_show_btn', true), true);
  if (empty($showButtons) || !in_array($list_id, $showButtons)) {
    return false;
  }
  $goodAnswers = json_decode(get_post_meta($post_id, '_qq_good_answers', true), true);
  if (empty($list_id)) {
    return $goodAnswers;
  }
  return $goodAnswers[$list_id];
}

/*
Callback that is called from AJAX to show good answers.
*/
function qq_show() {

  check_ajax_referer('qq_check');
  
  $post_id = $_POST['post_id'];
  $list_id = $_POST['list'];

  $result = qq_show_shared($post_id, $list_id);
  if (!$result) {
    wp_send_json_error();
  }
  wp_send_json($result);

}

/**
 * Shared by both AJAX and POST from API.
 */
function qq_check_shared($post_id, $postedAnswers) {
  $goodAnswers = json_decode(get_post_meta($post_id, '_qq_good_answers', true), true);
  $results = array();

  foreach ($postedAnswers as $listId => $postedListAnswers) {
    if (!array_key_exists($listId, $goodAnswers)) {
      continue;
    }
    foreach ($goodAnswers[$listId] as $questionId => $goodAnswerInfo) {

      if (!array_key_exists($questionId, $postedListAnswers)) {
        $results[$questionId] = false;
        continue;
      }
      $goodAnswer = $goodAnswerInfo['answers'];
      $type = $goodAnswerInfo['type'];

      $results[$questionId] = false;
      if (is_array($goodAnswer)) {
        if (empty($goodAnswer) && $postedListAnswers[$questionId] === '') {
          $results[$questionId] = true;
        } elseif ($type === 'text' && is_string($postedListAnswers[$questionId])) {
          if (in_array($postedListAnswers[$questionId], $goodAnswer)) {
            $results[$questionId] = true;
          }
        } elseif ($type === 'itext' && is_string($postedListAnswers[$questionId])) {
          $goodAnswerLowerCase = array_map(function($a) {
            return strtolower($a);
          }, $goodAnswer);
          if (in_array(strtolower($postedListAnswers[$questionId]), $goodAnswerLowerCase)) {
            $results[$questionId] = true;
          }
        } elseif (count($goodAnswer) == count($postedListAnswers[$questionId])) {
          $results[$questionId] = true;
          foreach ($goodAnswer as $ga) {
            if (!in_array($ga, $postedListAnswers[$questionId])) {
              $results[$questionId] = false;
              break;
            }
          }
        }
      } else {
        $results[$questionId] = preg_match($goodAnswer, $postedListAnswers[$questionId]);
      }
    }

  }
  return $results;
}

/*
Callback that is called from AJAX to check for good answers.
*/
function qq_check() {
  
  check_ajax_referer('qq_check');

  $post_id = $_POST['post_id'];
  $postedAnswers = json_decode(stripslashes($_POST['answers']), true); // listId => object(questionId => answer|answers)

  $results = qq_check_shared($post_id, $postedAnswers);
  wp_send_json($results);

}

/*
Helper function to get innerHTML of DOMNode.
*/
function qq_DOMinnerHTML(DOMNode $element) { 
  $innerHTML = ''; 
  $children  = $element->childNodes;
  foreach ($children as $child) {
    // Uses saveXML instead of saveHTML because the IMG tags are getting closed correctly
    //$innerHTML .= utf8_decode($element->ownerDocument->saveXML($child));
    $innerHTML .= $element->ownerDocument->saveXML($child);
  }
  return $innerHTML; 
}

/*
Callback to filter the content only for this specific post types.
This getting called both when in single mode as well when looping
through multiple posts.
*/
function qq_filter_the_content($content) {

  // When saving this post from the admin backend we don't apply this filter.
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    return $content;
  }

  if (QQ_ALL_POSTS || get_post_type() === MY_QQ_POST_TYPE) {

    $post_id = get_the_ID();

    $parsedContent = get_post_meta($post_id, '_qq_content', true);

    if (!empty($parsedContent)) {
      if (is_singular()) {
        $answers2send = get_post_meta($post_id, '_qq_possible_answers', true);
        if (empty($answers2send)) {
          $answers2send = '{}';
        }
        $showButton = get_post_meta($post_id, '_qq_enable_show_btn', true) === 'Y'
          ? 'true' : 'false';
        return $parsedContent . '<script>var QQ_POST_ID = ' . $post_id . '; var QQ_ANSWERS = ' . $answers2send . '; var QQ_SHOW_BUTTON = ' . $showButton . ';</script>';
      }
      return $parsedContent;
    }
    
  }
  return $content;
}

function qq_json_encode($value) {
  return json_encode($value, JSON_UNESCAPED_UNICODE);
}

function qq_save_post($post_id, $post, $update) {

  $separator = defined('QQ_SEPARATOR') ? QQ_SEPARATOR : '|';
  
  // $update is false on first save for new posts, maybe then we can have a shortcut?
  //if (!$update) return;

  $content = apply_filters('the_content', get_post_field('post_content', $post_id));

  $showButtons = [];
  $goodAnswers = array(); // listid => array(listItemId => string|array) (only good answers)
  $answers2send = array(); // to send to client.
  $content2save = '';
  $listId = 0;
  $doc = new DOMDocument('1.0', 'UTF-8');
  // Hack to make sure we load this as UTF-8, otherwise it gets loaded as ISO-8859-1
  // Now we will have 2 XML tags...
  // See: https://stackoverflow.com/questions/8218230/php-domdocument-loadhtml-not-encoding-utf-8-correctly
  if ($doc->loadHTML('<?xml encoding="UTF-8">' . $content)) {
  //if ($doc->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'))) {
    $xpath = new DOMXPath($doc);
    $lists = $xpath->query("//ol[contains(@class, 'quick-questionnaire-enabled')] | //ul[contains(@class, 'quick-questionnaire-enabled')]");
    $listItemId = 0;
    foreach ($lists as $list) {
      $listId += 1;
      //$listId = $list->getAttribute('data-qq-id');
      $list->setAttribute('data-qq-id', $listId);
      $listItems = $list->getElementsByTagName('li');
      if ($list->hasAttribute('data-qq-show-button')) {
        $showButtons[] = $listId;
      }
      $expressionFound = false;
      $classNames = [];
      if (!empty($list->getAttribute('class'))) $classNames[] = $list->getAttribute('class');
      foreach ($listItems as $listItem) {
        $innerHTML = qq_DOMinnerHTML($listItem);
        $matches = null;
        if (preg_match("/{(reg|text|itext|radio|checkbox){([^}]+)}}/", $innerHTML, $matches)) {
          $answerType = $matches[1]; // empty or filled
          $answers = trim($matches[2]);
          $listItemId += 1;
          if (!$expressionFound) {
            $expressionFound = true;
            $classNames[] = 'qq-list';
            $goodAnswers[$listId] = array();
          }
          $innerHTML = str_replace($matches[0], '', $innerHTML);
          $possibleAnswers = null;
          switch ($answerType) {
            case 'reg':
              // Keep regular expression
              $possibleAnswers = $answers;
            break;
            default:
              // So also the text answer type!
              $possibleAnswers = array_map('trim', explode($separator, $answers));
            break;
          }
          
          $listItem->setAttribute('data-qq-item-id', $listItemId);
          if ($answerType === 'reg') {
            $goodAnswers[$listId][$listItemId] = array(
              'type' => $answerType,
              'answers' => $possibleAnswers // string reg
            );
            $answers2send[$listItemId] = array(
              'options' => array(
                'type' => 'reg'
              )
            );
          } else {
            $answers2send[$listItemId] = array(
              'answers' => array(),
              'options' => array(
                'type' => $answerType
              )
            );
            $goodAnswers[$listId][$listItemId] = array(
              'type' => $answerType,
              'answers' => array()
            );
            foreach ($possibleAnswers as $possibleAnswer) {
              if (strpos($possibleAnswer, '*') !== false || in_array($answerType, ['text', 'itext'])) {
                $possibleAnswer = trim(str_replace('*', '', $possibleAnswer));
                $goodAnswers[$listId][$listItemId]['answers'][] = $possibleAnswer;
              }
              if (!in_array($answerType, ['text', 'itext'])) {
                $answers2send[$listItemId]['answers'][] = $possibleAnswer;
              }
            }
          }
          $fragment = $doc->createDocumentFragment();
          $fragment->appendXML(trim($innerHTML));
          $newListItemInnerHTMLNode = $doc->importNode($fragment, true);
          $newListItem = $listItem->cloneNode(false);
          $newListItem->appendChild($newListItemInnerHTMLNode);
          $list->replaceChild($newListItem, $listItem);
        }
      }
      $list->setAttribute('class', implode(' ', $classNames));
    }
    $bodies = $doc->getElementsByTagName('body');
    if ($bodies->length > 0) {
      $body = $bodies->item(0);
      $div = $doc->createElement('div');
      while ($body->hasChildNodes()) {
        $div->appendChild($body->firstChild);
      }
      $content2save = $doc->saveXML($div);
    }
  }

  update_post_meta($post_id, '_qq_content', $content2save);
  update_post_meta($post_id, '_qq_good_answers', qq_json_encode($goodAnswers));
  update_post_meta($post_id, '_qq_possible_answers', qq_json_encode($answers2send));
  update_post_meta($post_id, '_qq_enable_show_btn', qq_json_encode($showButtons));

}

function qq_activation() {
  qq_register_my_content_types();
  flush_rewrite_rules();
}

function qq_deactivation() {
  unregister_post_type(MY_QQ_POST_TYPE);
  flush_rewrite_rules();
}

// Disable wptexturize for this post type
// Because ellipsis gets f*cked up with utf8_decode...
function qq_run_wptexturize($run_texturize) {
  global $post;
  if (!empty($post)) {
    if (QQ_ALL_POSTS) return false;
    return $post->post_type !== MY_QQ_POST_TYPE;
  }
  return true;
}
add_filter('run_wptexturize', 'qq_run_wptexturize');

add_action('rest_api_init', function() {

  // Adding answers array to default WP endpoint of this post type
  register_rest_field(MY_QQ_POST_TYPE, 'qq_answers', array(
    'get_callback' => function($object) {
      return json_decode(get_post_meta($object['id'], '_qq_possible_answers', true));
    }
  ));

  register_rest_field(MY_QQ_POST_TYPE, 'qq_correct_answers', array(
    'get_callback' => function($object) {
      if (get_post_meta($object['id'], '_qq_enable_show_btn', true) === 'Y') {
        return json_decode(get_post_meta($object['id'], '_qq_good_answers', true));
      } else {
        return false;
      }
    }
  ));

  // POST endpoint - client sends given answers and server sends back results
  register_rest_route('qq/v1', '/' . MY_QQ_POST_TYPE . '/(?<id>\d+)', array(
    array(
      'methods' => WP_REST_Server::CREATABLE,
      'callback' => function(WP_REST_Request $request) {
        // Caller has to set application/json in order to get the body as json params!
        $postedAnswers = $request->get_json_params();
        $post_id = $request['id'];
        $results = qq_check_shared($post_id, $postedAnswers);
        return rest_ensure_response($results);
      }
    ),
    // This one is not needed anymore, because we now send the correct answers
    // in the default WP queries.
    array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => function(WP_REST_Request $request) {
        $post_id = $request['id'];
        $results = qq_show_shared($post_id);
        if (!$results) {
          $response = new WP_REST_Response(array('error' => 'No permission to show correct answers'));
          $response->set_status(403);
          return rest_ensure_response($response);
        }
        return rest_ensure_response($results);
      }
    )
    
  ));

  // GET endpoint - client wants to get correct answers (can be ON/OFF per post)
  // This one is not needed anymore, because we now send the correct answers
  // in the default WP queries.
  register_rest_route('qq/v1', '/' . MY_QQ_POST_TYPE . '/(?<id>\d+)/(?<listid>\d+)', array(
    'methods' => WP_REST_Server::READABLE,
    'callback' => function(WP_REST_Request $request) {
      $post_id = $request['id'];
      $list_id = $request['listid'];
      $results = qq_show_shared($post_id, $list_id);
      if (!$results) {
        $response = new WP_REST_Response(array('error' => 'No permission to show correct answers'));
        $response->set_status(403);
        return rest_ensure_response($response);
      }
      return rest_ensure_response($results);
    },
    // 'permission_callback' => function() {
    //   return current_user_can('edit_others_posts');
    // }
  ));

});

add_action('init', 'qq_register_my_content_types');
add_action('wp_enqueue_scripts', 'qq_add_plugin_scripts');
add_filter('the_content', 'qq_filter_the_content');
add_filter('the_excerpt', 'qq_filter_the_content');
add_action('wp_ajax_nopriv_qq_check', 'qq_check');
add_action('wp_ajax_qq_check', 'qq_check');
add_action('wp_ajax_nopriv_qq_show', 'qq_show');
add_action('wp_ajax_qq_show', 'qq_show');
if (QQ_ALL_POSTS) {
  add_action('save_post', 'qq_save_post', 10, 3);
} else {
  add_action('save_post_' . MY_QQ_POST_TYPE, 'qq_save_post', 10, 3);
}

// add_action('enqueue_block_editor_assets', function() {
//   if (QQ_ALL_POSTS || get_post_type() === MY_QQ_POST_TYPE) {
//     $script_assets = require(plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
//     wp_enqueue_script(
//       'quick-questionnaire-gutenberg',
//       plugin_dir_url( __FILE__ ) . 'build/index.js',
//       $script_assets['dependencies'],
//       $script_assets['version']
//     );
//     wp_enqueue_style(
//       'quick-questionnaire-gutenberg',
//       plugin_dir_url( __FILE__ ) . 'css/qq-editor.css',
//       null,
//       $script_assets['version']
//     );
//   }
// });

register_activation_hook(__FILE__, 'qq_activation');
register_deactivation_hook(__FILE__, 'qq_deactivation');

