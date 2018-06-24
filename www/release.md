# My Release
- update version number in const.js
- enable sync
- reset sync duration
- set const.js to point to MASTER Json id. reset local data.
- cordova run browser
- cordova run android emulator
- deploy to test web server. (take a screenshot of the old one)
- push and set release tag in git

# Official Release
- disable sync
- screen size test
    - small screens
        - all habit names are visible properly
        - at least one data column should be visible
        - toolbar all icons should be visible in one line
        - settings page is displayed properly
        - all modals are displayed properly
    - medium screen (owned by me)
        - at least 5 data columns should be visible
    - large screen
        - all modals are displayed properly
        - other pages form is displayed properly
