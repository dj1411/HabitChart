# Data format change
- check if local/server data is updated with the new/modified entries with default values.
- Check how data version change work without internet.

# Data validation checks
- local storage data
    - Apply Break point at DataValidate()
    - do single step debugging
    - change values in debugger to check if each "return false" is executed
- cloud data
    - Apply Break point at DataValidate()
    - do single step debugging
    - change values in cloud to check if each "return false" is executed

# Save changes in bar
- Set value of an empty cell. Reopen the application. See if the value is still there.
- Change value of an existing cell with value. Reopen the application. See if the value is still there.

# Add Habit
- new modal should open with the following:
	- `Target` dropdown
	- if `Target` is `Reach` then additional input fields should be shown
	- text entry field
    - submit and cancel button
- the modal should close upon clicking outside
- clicking cancel should go to main page
- Clicking submit on empty data should stay on the modal
- clicking submit should add a new row with all data cleared
- pressing enter should also add the habit
- duplicate habit names should not be allowed
- new habit should be saved on exit
- new habit change in data should be saved to cloud
- selected `Target` should reflect in the cloud data. Test for each `Target`.

# update habit
- click randomly and check if selection and de-selection of habit works. 
- toolbar buttons should only be visible when a habit is selected.
- in the modal, habit name and other data should be prefilled 
- `Update` label on top should be visible instead of 'Add'.
- clicking cancel should go to main page
- clicking update, habit name and other data should change
- only changing the Target without changing Name should be allowed
- update without changing anything should have no impact
- all bars should have the previous values
- restarting the app should retain the updated habit
- select habit and wait for periodic cloud sync. GUI state should as before.

# delete habit
- confirmation dialog before delete
    - cancel should work
    - delete should actually delete the habit and update the table
- after deleting, the toolbar should disappear and no habit should be selected
- deleted habit should be deleted from cloud also
- upon closing and opening the app, the deleted habit should not re-appear

# Edit Data values
- Clicking in every cell should open the modal
- clicking cancel should go to main page without doing anything
- the modal should close upon clicking outside
- The date and habit name should correspond to the cell clicked
- the prefilled values in the `value buttons` should be displayed
- in the textbox only number should be allowed to enter
- Clicking submit/enter on invalid data should stay on the modal
- Clicking submit/enter should submit the number entered in textbox
- clicking pre-filled data buttons:
    - fill the textbox with the data
    - submit
- randonly enter previous data. check how the `value buttons` change.

# Data bar chart
- upon changing the value in modal, the bar should display according height
    - test by chosing lower value
    - test by chosing higher value
- randonly enter previous data. check how the bar chart changes.
    
# Target sign colors
- randonly enter previous data. check how the target sign color change.
    - For good progress green light should be shown
    - For slow progress yellow light should be shown
    - for negative progress red light should be shown

# Habit move up/down
- All previous data should be intact
- the row should still be selected after movement, and further movement should be possible
- selection and de-selection should work after moving

# sync data to server
- The app should work perfectly without any internet connection.
- upon resuming internet, updated local data should be uploaded to cloud.
- reset RAM data, local storage and cloud storage individually. check if the table is re-constructible.
- sync should happen at app start
- sync should happen every timeout.
- server data should be identical to local data
- any changes in the main page (as previous tests) should be reflected in another device
- check if sync works when the window is minimized (on device)
- deactivate internet in between running app. close and reopen without internet. data should be intact
- deactivate internet in between running app. close and reopen with internet. data should be intact.
- data tampering on server 

# settings
- clicking `settings` button should open the settings page
- clicking `back` on `settings` page should go back to main page
- clicking `save` should save all config data to local storage
- updated settings should be reflected
    - sidebar username should be changed
    - sync settings should be enabled only for jayanta and test user
    - test cloud data by disabling sync

# Feedback
- the form should be displayed properly
- back button should go the the previous page
- upon submit, data should be available online
- feedback success message is displayed

# Feedback Reader (change email to jayanta.dn@gmail.com)
- add a new message, it should be visible in the reader
- clicking email button should work

# Exit App
- clicking the exit button should exit:
    - from browser
    - from app
- from app: clicking the back button on main page also should exit the app
- from app: clicking back anywhere else should not exit app

# About page
- version number is proper
- email developer working
- github link working
- license accordion
- Thanks link:
    - are all links included. check css and js links.
    - are links working upon click

# My Release
- enable sync
- reset sync duration
- set config to point to MASTER Json id. reset local data.
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
