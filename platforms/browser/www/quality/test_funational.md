# Data format change
- check if local/server data is updated with the new/modified entries with default values.
- Check how data version change work without internet.

# Data validation checks
- local data
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
- selecting Target should reflect in the cloud data

# update habit
- click randomly and check if selection and de-selection of habit works. 
- delete and update button should only be visible when a habit is selected.
- habit name and other data should be prefilled 
- 'Update' label on top should be visible instead of 'Add'.
- clicking cancel should go to main page
- clicking update, habit name and other data should change
- only changing the Target without changing Name should be allowed
- update without changing anything should have no impact
- all bars should have the previous values
- restarting the app should retain the updated habit
- select habit and wait for cloud sync. GUI state should as before.

# delete habit
- confirmation dialog before delete
    - cancel delete should work
    - delete should actually delete the habit and update the table
- after deleting the button should disappear and no habit should be selected
- upon closing and opening the app, the deleted habit should not re-appear

# Edit Data Modal
- Clicking in every cell should open the modal
- clicking cancel should go to main page without doing anything
- the modal should close upon clicking outside
- The date and habit should correspond to the cell clicked
- the prefilled values in the buttons should be displayed
- in the textbox only number should be allowed to enter
- Clicking submit/enter on invalid data should stay on the modal
- Clicking submit/enter should submit the number entered in textbox
- After submit the following should be reflected in data:
    - Improve/Reduce
    - Reach_times_days
- clicking pre-filled data buttons:
    - fill the textbox with the data
    - submit
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 21 days data
    - 3 months data
    - 1 year data
    
# Data bar
- upon changing the value in modal, the bar should display according height
    - test by chosing lower value
    - test by chosing higher value
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 21 days data
    - 3 months data
    - 1 year data
    
# Target sign colors
- progress should be based on :
    - last 7 days average compared to last 21 days average
    - for less than 7 days: today's value compared to average of all days
    - for "Reach" check average of 21 days
- For good progress green light should be shown
- For slow progress yellow light should be shown
- for negative progress red light should be shown
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 21 days data
    - 3 months data
    - 1 year data

# sync data to server (check in browser)
- The app should work perfectly without any internet connection
- reset RAM data, local storage and cloud storage individually. check if the table is re-constructible.
- reset all three storages. table should become empty.
- sync should happen at app start
- sync should happen every timeout.
- sync should refresh the table
- closing and reopening the app, should retain the data
- server data should be identical to local data
- any changes in the main page (as previous tests) should be reflected in the server file.
- any changes in the main page (as previous tests) should be reflected in another device
- check if sync happens when the window is minimized (on device)
- run the app without internet connection. closing and opening should retain the data.
- deactivate internet in between running app. close and reopen without internet. data should be intact
- deactivate internet in between running app. close and reopen with internet. data should be intact.
- abrupt closing of app
- data tampering on server 

# First time open (reset condition)
- reset only local data, cloud data intact. Upon loading, the table should be loaded with cloud data.
- reset local data and cloud data. empty table should be displayed.
- adding a new habit should be possible without any errors
