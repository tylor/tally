This is a very simple Backbone app for iOS, based heavily on the example todos app.

![What tally looks
like](https://github.com/tylor/tally/raw/master/iphone.png)

Todo:

* add swipe to delete
* remove dependencies and minify (right now loading is slow because of all the external JS)
* try using Zepto (which has swipe support) instead of jQuery (currently raises an exception with a straight swap)
  * closed, but maybe related: https://github.com/documentcloud/backbone/issues/55

You will need:

* Backbone.js - http://documentcloud.github.com/backbone/
  * The Backbone localStorage example, backbone-localstorage.js
* Underscore - http://documentcloud.github.com/underscore/
* json2.js - https://github.com/douglascrockford/JSON-js
