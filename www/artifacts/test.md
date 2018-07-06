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

# Add Habit
- new modal should open with the following:
	- `Target` dropdown
	- text entry field
    - submit and cancel button
	- if `Target` is `Reach` then additional input fields should be shown
- the modal should close upon clicking outside
- clicking cancel should close the modal
- Clicking submit on empty data should stay on the modal
- clicking submit should add a new row with all data cleared
- pressing enter should also add the habit
- new habit should be saved on exit
- duplicate habit names should not be allowed
- new habit change in data should be saved to cloud
- selected `Target` should reflect in the cloud data. Test for each `Target`.
- try to add a very long habit name
- All data before today should be disabled

# Edit habit
- click randomly and check if selection and de-selection of habit works. 
- toolbar buttons should only be visible when a habit is selected.
- in the modal, all values should be prefilled 
    - Habit name
    - habit frequency if applicable
- `Update` label on top should be visible instead of 'Add'.
- update value and click cancel. should go to main page without any changes.
- clicking update, habit name and other data should change
- only changing the Target without changing Name should be allowed
- update without changing anything should have no impact
- all bars should have the previous values
- restarting the app should retain the updated habit
- select habit and wait for periodic cloud sync. GUI state should be as before.
- try to edit a habit name to very long name
- Habit `entry` date should not be affected

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
    - there should be values between min and max
    - there should be one value greater than max
    - there should be one value smaller than min
- if data is edited for date older than `entry` date of habit, the `entry` field should be updated

# Data bar chart
- upon changing the value in modal, the bar should display according height
    - test by chosing lower value
    - test by chosing higher value
- randonly enter previous data. check how the `bar chart` changes.
    
# Target sign colors
- randonly enter previous data. check how the target sign color change.
    - For good progress green light should be shown
    - For slow progress yellow light should be shown
    - for negative progress red light should be shown
- target sign colors should be computed starting from data `entry` date only

# Habit move up/down
- arrow visibility
    - only down arrow should be visible for the first habit
    - only up arrow should be visible for the last habit
    - for all other habits, both arrows should be visible
    - for a single habit, no arrow should be visible
- All previous data should be intact
- the row should still be selected after movement, and further movement should be possible
- selection and de-selection should work after moving
- check if habit `target` is still intact after movement
- data `entry` date should be unaffected

# Statistics
- clicking outside or close button should close the modal
- verify the chart for a habit
- select different habits and check if chart is shown for the selected one
- change any data for a habit and see if reflected in chart
- change `number of days` and see if the chart changes
- height of same data may vary due to range selected. e.g. max data before 7 days.
- check the min, max and avg for the above
- statistics should be computed starting from the data `entry` date

# sync data to server
- Disable internet and check all the above functionality still works.
- upon resuming internet, updated local data should be uploaded to cloud.
- reset RAM data, local storage and cloud storage individually. check if the table is re-constructible.
- sync should happen at app start
- server data should be identical to local data
- any changes in the main page (as previous tests) should be reflected in another device

# reset condition
- reset all data and check if all the above features work correctly
- data `Entry` field should be present for new habit

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
- upon submit feedback success message is displayed
- data should be available online (https://api.myjson.com/bins/15kbim)

# Feedback Reader
- add a new message, it should be visible in the reader
- clicking email button should work

# Exit App (test in emulator)
- clicking the exit button should exit
- clicking the back button on main page also should exit the app
- clicking back in other pages should not exit app

# About page (test in emulator)
- close button should close modal
- clicking outside should close modal
- version number is proper
- email developer working
- github link working
- license accordion
- Thanks link:
    - are all links included. check css and js links.
    - are links working upon click


