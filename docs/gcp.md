## Notes on GCP
This was largely the teams first time working with GCP but overall it has been pretty smooth.
* For those new to GCP, we recommend doing one of the tutorials as it will walk you through a lot of helpful information and won't take too long. Many of us followed this tutorial and in general thought it was excellent: https://cloud.google.com/appengine/docs/standard/python3/building-app.
* As a quick reference here are the commands we will all be using a lot (before you can run these I think you'll need to set up your local enviornment to be authorized to do this - i think these instructions will be relevant https://cloud.google.com/sdk/docs/initializing):
   * **deploy an app** -> `gcloud app deploy`
   * **go to the app** -> `gcloud app browse`

### Notes on Cloud SQL
This took a bit of time to get set up properly so writing some notes that we can use for reference. As far as I can remember here were the steps I took to get things setup.

* Navigate to the SQL page.
* Create an instance -> I choose a very small cheap instance since it should be sufficient for what we need.
* Our instance is called `cloud-sql-password-manager-instance` (creative I know)
* As part of this I had to create an admin user/password. I wanted to create another user which our flask app could use so I set that up in the users tab. The username/password are stored in our .env file.
* Created a database within our instance called `prod`. This was from within the database tab.
* Next I loaded up the cloud shell and ran the following commands to create a table, add some dummy data and grant permission to the user.

```
# login - it will ask for a password!
gcloud sql connect cloud-sql-password-manager-instance --user=postgres

# list databases - this will show all the databases
\list

# connect to a database
\c prod

# create table
CREATE TABLE password_vault (
    entry_id UUID PRIMARY KEY,
    user_id VARCHAR(255),
    password VARCHAR(255),
    website VARCHAR(255)
);

# list table details - now we can list some details about the schema to make sure it got created correctly
\describe password_vault

# add some data to our new table
INSERT INTO password_vault (entry_id, user_id, password, website)
VALUES
(uuid_generate_v4(), 'carlmartin1020@gmail.com', 'password1', 'example1.com'),
(uuid_generate_v4(), 'carlmartin1020@gmail.com', 'password2', 'example2.com'),
(uuid_generate_v4(), 'carlmartin1020@gmail.com', 'password3', 'example3.com'),
(uuid_generate_v4(), 'carlmartin1020@gmail.com', 'password4', 'example4.com'),
(uuid_generate_v4(), 'carlmartin1020@gmail.com', 'password5', 'example5.com'),
(uuid_generate_v4(), 'wangzhim@oregonstate.edu', 'password1', 'example1.com'),
(uuid_generate_v4(), 'wangzhim@oregonstate.edu', 'password2', 'example2.com'),
(uuid_generate_v4(), 'wangzhim@oregonstate.edu', 'password3', 'example3.com'),
(uuid_generate_v4(), 'wangzhim@oregonstate.edu', 'password4', 'example4.com'),
(uuid_generate_v4(), 'wangzhim@oregonstate.edu', 'password5', 'example5.com'),
(uuid_generate_v4(), 'labyere@oregonstate.edu', 'password1', 'example1.com'),
(uuid_generate_v4(), 'labyere@oregonstate.edu', 'password2', 'example2.com'),
(uuid_generate_v4(), 'labyere@oregonstate.edu', 'password3', 'example3.com'),
(uuid_generate_v4(), 'labyere@oregonstate.edu', 'password4', 'example4.com'),
(uuid_generate_v4(), 'labyere@oregonstate.edu', 'password5', 'example5.com');

# you can query the table to ensure it went in correctly
SELECT * FROM password_vault

# grant access to the flask backend
GRANT prod.password_vault TO 'USERNAME_GOES_HERE';
```
