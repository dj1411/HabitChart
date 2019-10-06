cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-nativeclicksound.nativeclick",
      "file": "plugins/cordova-plugin-nativeclicksound/www/nativeclick.js",
      "pluginId": "cordova-plugin-nativeclicksound",
      "clobbers": [
        "nativeclick"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-nativeclicksound": "0.0.4",
    "cordova-plugin-vibration": "3.1.1"
  };
});