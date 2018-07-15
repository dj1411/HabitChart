# My Release
- enable sync
- set const.js to point to MASTER Json id. reset local data.
- deploy to test web server. (take a screenshot of the old one)
- cordova build android

# Official Release
- disable sync
- update version number in const.js and config.xml
- generate key (only first time)  
	`keytool -genkey -v -keystore android.keystore -alias android-app-key -keyalg RSA -keysize 2048 -validity 10000`
- sign the apk  
	`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore app-release-unsigned.apk android-app-key`
- optimize the apk  
	`zipalign -v 4 app-release-unsigned.apk app-release.apk`
- publish to play store
- push release tag in git
