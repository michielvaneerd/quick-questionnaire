=== Easy Exercise ===
Contributors: michielve
Tags: exercise, practice, test
Requires at least: 3.0.1
Tested up to: 5.4.1
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create simple exercises directly in the editor.

== Description ==

Create simple exercises directly in the editor by putting the possible answer(s) in double brackets.
A exercise must be an ordered or unordened list.

The following types of answers are possible:

__Enter the correct answer in a textbox:__

The correct answer has to be entered in a textbox.

    <ul>
      <li>The capital of France is ...? {text{ Paris }}</li>
    </ul>

__Enter the correct answer in a textbox - multiple answers possible:__

The correct answer has to be entered in a textbox.

    <ul>
      <li>The capital of France or Italy is ...? {text{ Paris | Rome }}</li>
    </ul>


__Enter the correct answer in a textbox - regular expression:__

If you have some regular expression skills, you can also specify this:

    <ul>
      <li>The capital of France or Rome is ...? {reg{ /^(Paris|Rome)$/ }}</li>
    </ul>


__Check the correct answer in radio buttons:__

All possible answers are divided by |, the correct answer has to be marked with a \*.
The answers are displayed as radio boxes.

    <ul>
      <li>The capital of France? {radio{ Paris* | London | Berlin }}</li>
    </ul>

__Check all possible answers in checkboxes:__

Mark alle correct answers with a \*.
The answers are displayed as checkboxes.

    <ul>
      <li>Countries of Europe? {checkbox{ France* | Netherlands* | Canada }}</li>
    </ul>

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Click on the new menu item "Easy Exercise" to create easy exercises

== Frequently Asked Questions ==

= How can I change the look of the exercise? =

Just override the classes you see in the easy_exercise.css file.

== Screenshots ==

1. Single select radio boxes
2. Multiple select checkboxes
3. Text input boxes
4. Edit the exercise in the editor is simple

== Changelog ==

= 1.18 =
* Renamed to Easy Exercise everywhere
* Changed some CSS

= 1.17 =
* Fixed bug: check for empty global $post variable in run_wptexturize filter

= 1.16 =
* Adding correct answers to default rest API endpoint

= 1.15 =
* Possible to get correct answers of all lists from API

= 1.14 =
* Bug fixes

= 1.13 =
* Added API endpoints to get exercises, check answers and show good answers

= 1.12 =
* Wrap content inside DIV instead of BODY tag

= 1.11 =
* Flush rewrite rules after (de)activation
* Unregister post type after deactivation

= 1.10 =
* Now working without using PHP sessions

= 1.9 =
* Escape value attribute for radio and checkboxes

= 1.8 =
* JSON stringify on client and json_decode with stripslahes on server - this makes apostrof work

= 1.7 =
* Translation update

= 1.6 =
* Changed name to Easy Exercise

= 1.5 =
* Correctly handling of UTF-8
* Fix global wptexturize remove, now only for this post type

= 1.4 =
* Accented charachters
* Prevent three dots rewrite to ellipisis by removing wptexturize from the the_content filter

= 1.3 =
* Localization

= 1.2 =
* Remove tags and category taxonomies (you can set them with register_taxonomy_for_object_type later)

= 1.1 =
* Explicitly set type to text, radio, checkbox or reg.

= 1.0 =
* First release.
