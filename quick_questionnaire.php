<?php
/*
Plugin Name: Easy Exercise
Version: 1.18
Description: Create simple exercises directly in the editor
Text Domain: easy_exercise
Author: Michiel van Eerd
Author URI: http://www.michielvaneerd.nl
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
*/

function easy_exercise_register_my_content_types() {

  register_post_type('easy_exercise', array(
    'labels' => array(
      'name' => __('Easy Exercise', 'easy_exercise'),
      'singular_name' => __('Easy Exercise', 'easy_exercise'),
      'add_new_item' => __('Add New Easy Exercise', 'easy_exercise'),
      'edit_item' => __('Edit Easy Exercise', 'easy_exercise'),
    ),
    'rewrite' => array('slug' => 'easy_exercises'),
    'public' => true,
    'has_archive' => true,
    'show_in_rest' => true
  ));

}


/*
Enqueue the plugin CSS and Javascript only when looking
at a single questionnaire.
*/
function easy_exercise_add_plugin_scripts() {

  if (is_single() && get_post_type() === 'easy_exercise') {

    wp_enqueue_script('easy_exercise', plugin_dir_url(__FILE__) . 'js/easy_exercise.js', array('jquery'), '1.0.0', true);
    wp_enqueue_style('easy_exercise_style', plugin_dir_url(__FILE__) . 'css/easy_exercise.css');
    
    wp_localize_script('easy_exercise', 'my_ajax_obj', array(
      'ajax_url' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('easy_exercise_check'),
      'L' => array(
        'show' => __('Show', 'easy_exercise'),
        'check' => __('Check', 'easy_exercise'),
        'reset' => __('Reset', 'easy_exercise'),
      )
    ));
  }

}

function easy_exercise_show_shared($post_id, $list_id = null) {
  if (get_post_meta($post_id, '_qq_enable_show_btn', true) !== 'Y') {
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
function easy_exercise_show() {

  check_ajax_referer('easy_exercise_check');
  
  $post_id = $_POST['post_id'];
  $list_id = $_POST['list'];

  $result = easy_exercise_show_shared($post_id, $list_id);
  if (!$result) {
    wp_send_json_error();
  }
  wp_send_json($result);

}

/**
 * Shared by both AJAX and POST from API.
 */
function easy_exercise_check_shared($post_id, $postedAnswers) {
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
function easy_exercise_check() {
  
  check_ajax_referer('easy_exercise_check');

  $post_id = $_POST['post_id'];
  $postedAnswers = json_decode(stripslashes($_POST['answers']), true); // listId => object(questionId => answer|answers)

  $results = easy_exercise_check_shared($post_id, $postedAnswers);
  wp_send_json($results);

}

/*
Helper function to get innerHTML of DOMNode.
*/
function easy_exercise_DOMinnerHTML(DOMNode $element) { 
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
function easy_exercise_filter_the_content($content) {

  // When saving this post from the admin backend we don't apply this filter.
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    return $content;
  }

  if (get_post_type() === 'easy_exercise') {

    $post_id = get_the_ID();

    $parsedContent = get_post_meta($post_id, '_qq_content', true);

    if (is_single()) {
      $answers2send = get_post_meta($post_id, '_qq_possible_answers', true);
      
      $showButton = get_post_meta($post_id, '_qq_enable_show_btn', true) === 'Y'
        ? 'true' : 'false';
      return $parsedContent . '<script>var EASY_EXERCISE_POST_ID = ' . $post_id . '; var EASY_EXERCISE_ANSWERS = ' . $answers2send . '; var EASY_EXERCISE_SHOW_BUTTON = ' . $showButton . ';</script>';
    }

    return $parsedContent;

  }
  return $content;
}

function easy_exercise_meta_box_html($post) {
  $value = get_post_meta($post->ID, '_qq_enable_show_btn', true);
  ?>
  <label><input type="checkbox"
    <?php checked($value, 'Y'); ?>
    name="qq_enable_show_btn" value="Y"> <?php _e('Enable show button', 'easy_exercise'); ?></label>
  <?php
}

function easy_exercise_add_meta_boxes() {
  add_meta_box('easy_exercise_meta_box', __('Easy Exercise Settings', 'easy_exercise'),
    'easy_exercise_meta_box_html', 'easy_exercise', 'side');
}

function easy_exercise_json_encode($value) {
  return json_encode($value, JSON_UNESCAPED_UNICODE);
}

function easy_exercise_save_post($post_id, $post, $update) {
  
  // $update is false on first save for new posts, maybe then we can have a shortcut?
  //if (!$update) return;

  $content = apply_filters('the_content', get_post_field('post_content', $post_id));

  $goodAnswers = array(); // listid => array(listItemId => string|array) (only good answers)
  $answers2send = array(); // to send to client.
  $content2save = '';
  $doc = new DOMDocument('1.0', 'UTF-8');
  // Hack to make sure we load this as UTF-8, otherwise it gets loaded as ISO-8859-1
  // Now we will have 2 XML tags...
  // See: https://stackoverflow.com/questions/8218230/php-domdocument-loadhtml-not-encoding-utf-8-correctly
  if ($doc->loadHTML('<?xml encoding="UTF-8">' . $content)) {
  //if ($doc->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'))) {
    $xpath = new DOMXPath($doc);
    $lists = $xpath->query('//ol | //ul');
    $listId = 0;
    $listItemId = 0;
    foreach ($lists as $list) {
      $listItems = $list->getElementsByTagName('li');
      $expressionFound = false;
      foreach ($listItems as $listItem) {
        $innerHTML = easy_exercise_DOMinnerHTML($listItem);
        $matches = null;
        if (preg_match("/{(reg|text|radio|checkbox){([^}]+)}}/", $innerHTML, $matches)) {
          $answerType = $matches[1]; // empty or filled
          $answers = trim($matches[2]);
          $listItemId += 1;
          if (!$expressionFound) {
            $expressionFound = true;
            $listId += 1;
            $list->setAttribute('data-easy_exercise-list-id', $listId);
            $list->setAttribute('class', 'easy_exercise-list');
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
              $possibleAnswers = array_map('trim', explode('|', $answers));
            break;
          }
          
          $listItem->setAttribute('data-easy_exercise-item-id', $listItemId);
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
              if (strpos($possibleAnswer, '*') !== false || $answerType === 'text') {
                $possibleAnswer = trim(str_replace('*', '', $possibleAnswer));
                $goodAnswers[$listId][$listItemId]['answers'][] = $possibleAnswer;
              }
              if ($answerType !== 'text') {
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
  update_post_meta($post_id, '_qq_good_answers', easy_exercise_json_encode($goodAnswers));
  update_post_meta($post_id, '_qq_possible_answers', easy_exercise_json_encode($answers2send));

  if (!empty($_POST['qq_enable_show_btn'])) {
    update_post_meta($post_id, '_qq_enable_show_btn', 'Y');
  } else {
    delete_post_meta($post_id, '_qq_enable_show_btn');
  }

}

function easy_exercise_activation() {
  easy_exercise_register_my_content_types();
  flush_rewrite_rules();
}

function easy_exercise_deactivation() {
  unregister_post_type('easy_exercise');
  flush_rewrite_rules();
}

function easy_exercise_load_plugin_textdomain() {
  load_plugin_textdomain('easy_exercise', FALSE,
    basename(dirname(__FILE__)) . '/languages/');
}
add_action('plugins_loaded', 'easy_exercise_load_plugin_textdomain');

// Disable wptexturize for this post type
// Because ellipsis gets f*cked up with utf8_decode...
function easy_exercise_run_wptexturize($run_texturize) {
  global $post;
  if (!empty($post)) {
    return $post->post_type !== 'easy_exercise';
  }
  return true;
}
add_filter('run_wptexturize', 'easy_exercise_run_wptexturize');

add_action('rest_api_init', function() {

  // Adding answers array to default WP endpoint of easy_exercise
  register_rest_field('easy_exercise', 'qq_answers', array(
    'get_callback' => function($object) {
      return json_decode(get_post_meta($object['id'], '_qq_possible_answers', true));
    }
  ));

  register_rest_field('easy_exercise', 'qq_correct_answers', array(
    'get_callback' => function($object) {
      if (get_post_meta($object['id'], '_qq_enable_show_btn', true) === 'Y') {
        return json_decode(get_post_meta($object['id'], '_qq_good_answers', true));
      } else {
        return false;
      }
    }
  ));

  // POST endpoint - client sends given answers and server sends back results
  register_rest_route('qq/v1', '/easy_exercise/(?<id>\d+)', array(
    array(
      'methods' => WP_REST_Server::CREATABLE,
      'callback' => function(WP_REST_Request $request) {
        // Caller has to set application/json in order to get the body as json params!
        $postedAnswers = $request->get_json_params();
        $post_id = $request['id'];
        $results = easy_exercise_check_shared($post_id, $postedAnswers);
        return rest_ensure_response($results);
      }
    ),
    // This one is not needed anymore, because we now send the correct answers
    // in the default WP queries.
    array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => function(WP_REST_Request $request) {
        $post_id = $request['id'];
        $results = easy_exercise_show_shared($post_id);
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
  register_rest_route('qq/v1', '/easy_exercise/(?<id>\d+)/(?<listid>\d+)', array(
    'methods' => WP_REST_Server::READABLE,
    'callback' => function(WP_REST_Request $request) {
      $post_id = $request['id'];
      $list_id = $request['listid'];
      $results = easy_exercise_show_shared($post_id, $list_id);
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

add_action('init', 'easy_exercise_register_my_content_types');
add_action('wp_enqueue_scripts', 'easy_exercise_add_plugin_scripts');
add_filter('the_content', 'easy_exercise_filter_the_content');
add_filter('the_excerpt', 'easy_exercise_filter_the_content');
add_action('wp_ajax_nopriv_easy_exercise_check', 'easy_exercise_check');
add_action('wp_ajax_easy_exercise_check', 'easy_exercise_check');
add_action('wp_ajax_nopriv_easy_exercise_show', 'easy_exercise_show');
add_action('wp_ajax_easy_exercise_show', 'easy_exercise_show');
add_action('add_meta_boxes', 'easy_exercise_add_meta_boxes');
add_action('save_post_easy_exercise', 'easy_exercise_save_post', 10, 3);

register_activation_hook(__FILE__, 'easy_exercise_activation');
register_deactivation_hook(__FILE__, 'easy_exercise_deactivation');
