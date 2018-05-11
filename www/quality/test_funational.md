
# populate table
- When the app opens, the table should be filled with previous habits, dates, checkboxes

# Save changes in checkbox.
- Check a box. Reopen the application. See if the box is still checked.
- Uncheck a box. Reopen the application. See if the box is still checked

# Add Habit
- new modal should open with text entry field with an add and cancel button
- clicking cancel should go to main page
- clicking add should add a new row with all checkboxes unchecked
- pressing enter should also add the habit
- new habit should be saved on exit
- new row checkbox status should be saved

# update habit
- textbox should be prefilled. 
- 'Update' label should be visible instead of 'Add'.
- clicking cancel should go to main page
- clicking update, habit name should change
- all checkboxes should have the previous values
- restarting the app should retain the updated habit

# delete habit
- click randomly and check if selection and de-selection of habit works. 
- delete button should only be visible when a habit is selected.
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
- the prefilled values in the dropdown should be displayed as below:
    - The most recent value should be displayed
    - If the goal is to improve: 
        - values in order of increment should be displayed
        - there should be some data in the decrement phase also
    - If the goal is to reduce: 
        - values in order of decrement should be displayed
        - there should be some data in the increment phase also
- clicking pre-filled data should close the modal
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 1 month data
    - 3 months data
    - 1 year data
    
# Data bar
- The height of bar should be based on last 3 months data
- upon chaning the value in dropdown, the bar should display according height
    - test by chosing lower value
    - test by chosing higher value
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 1 month data
    - 3 months data
    - 1 year data
    
# Traffic light
- For good progress green light should be shown
- For slow progress orange light should be shown
- for negative progress red light should be shown
- test with different data sets
    - no data
    - 1 day data
    - 1 week data
    - 1 month data
    - 3 months data
    - 1 year data

# exit app
- pressing the back button at main page should quit the program
- pressing the exit button should quit the program

# sync data to server (check in browser)
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