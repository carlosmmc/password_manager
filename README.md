# 🔐 password manager 🔐

## Link reference
Here are links I have bookmarked for convenience:
* **Github repo** - https://github.com/carlosmmc/password_manager
* **GCP console** - https://console.cloud.google.com/home/dashboard?project=password-manager-osu&supportedpurview=project
* **Firebase console** - https://console.firebase.google.com/u/0/project/password-manager-osu/overview
* **Link to prod** - https://password-manager-osu.wl.r.appspot.com


## Github Repository Details
Welcome to the repo! This is a pretty standard setup, there are only two main things to note:
* **Branch Protection Rules** - I added a branch protection rule to ensure `main` is protected. You can find them in "Settings" > "Branches" > "Branch protection rule". We can change these as we develop, I just put something basic in place. The main things it does is:
    * Require a pull request with approvals
    * Prevent anyone from pushing directly to main
    * Require status checks to all be green before being able to merge into main
* **Linting** - I added a linting rule to ensure we have a consistent style throughout the project. I choose `pylint` and `black` for our python code. You can set these up in your local VSCode so that way it will tell you of any violations before even pushing up to our remote repo. A few notes:
    * You can find the linting rule in `.github/workflows/superlinter.yml`.
    * You can see the invocation of the rules in the "Actions" tab. If there are any failures it will be red, just look through the logs and see what it is complaining about.

## Project Structure
Below is a representation of our current file structure with explanations for each folder/file.
```
.
├── README.md             -> You're reading it!
└── backend               -> folder for our backend flask application. right now it's also technically our frontend since it serves rendered files to the browswer but that will change soon.
    ├── app.yaml          -> file which configures GCP app engine deploys. It's pretty simple right now and we likely won't need to add too much to it but it's quite important!
    ├── db                -> folder which houses helper code to connect to our different databases
    │   ├── __init__.py   -> just a blank python helper file so that the code in this folder can be imported elsewhere in the project
    │   ├── cloud_sql.py  -> contains logic to connect to our cloud sql database. it includes an example query and is split out into different methods.
    │   └── firebase.py   -> contains logic to connect to firebase.
    ├── index.yaml        -> file to declare indexes for firebase to create
    ├── main.py           -> the entry point into our application. this defines the routes the flask app has.
    ├── middleware        -> folder for middlewares, right now there's only auth but in the future we may want to add others like for logging and metrics
    │   ├── __init__.py   -> just a blank python helper file so that the code in this folder can be imported elsewhere in the project
    │   └── auth.py       -> this file is actually super neat (or at least I thought so). I created "middleware" for our flask app which authenticates every request. It runs before every request sent and will send back an error message if the user is not logged in. This allows for a nice separation between auth checks and business logic.
    ├── requirements.txt  -> this is the required python packages we need to run the project.
    ├── static            -> folder for static assets (just temporary until we have a separate frontend application)
    │   ├── script.js     -> a little bit of javascript, mainly dealing with google auth
    │   └── style.css     -> some light css styling to make things not too much of an eye sore in the interim
    └── templates
        └── index.html    -> template which gets customized with data to serve to the frontend
```

## Setting up things locally
This section guides you through setting up the project on your local machine. I have a mac and these instructions worked there but you may need to make some tweaks depending on your specific setup. Before starting, make sure you have Python3 installed.

1. **Clone the Repository**:
   * Use `git clone https://github.com/carlosmmc/password_manager.git` to pull the repo to your local machine.
2. **Navigate to the `backend` Folder**:
   * Change directory with `cd backend`.
3. **Setting Up a Python Virtual Environment**:
   * Virtual environments are crucial for managing package dependencies. If you're new to this, a quick online tutorial can be beneficial.
   * In the `backend` folder, initialize the environment: `python3 -m venv env`.
   * Activate the environment: `source env/bin/activate`.
   * Install required packages: `pip install -r requirements.txt`.
     * The `requirements.txt` file lists all necessary packages.
4. **🚨 Important Note for Updating Packages 🚨**:
   * If you add a new package, ensure the `requirements.txt` is updated:
     * Install the new package: `pip install PACKAGE_NAME`.
     * Update `requirements.txt`: `pip freeze > requirements.txt`.

Before running things you'll need to setup an .env file with all of the API keys. I'm going to send an encrypted file to the group which has this information so just make sure you have it stored in `backend/.env`.

After you all do all of that you should just be able to run the following command from the `backend` folder: `python main.py` and then navigate to local host 8080.

## Notes on GCP
This is my first time working with it but so far it has been pretty smooth. I'm sure there's going to be some kinks getting everything set up for all of us to be productive but I tried to frontload at least some of that friction by writing up this section. Here are a couple of quick notes:
* I added both of you all as editors on the project. This should give you all broad access to do everything you need to do but if you run into permission issues let me know and we can see how to fix it.
* If you haven't worked with GCP before I recommend doing one of the tutorials as it will walk you through a lot of helpful information and won't take too long. I followed this tutorial and in general thought it was excellent: https://cloud.google.com/appengine/docs/standard/python3/building-app.
* As a quick reference here are the commands we will all be using a lot (before you can run these I think you'll need to set up your local enviornment to be authorized to do this - i think these instructions will be relevant https://cloud.google.com/sdk/docs/initializing):
   * deploy an app -> `gcloud app deploy`
   * go to the app -> `gcloud app browse`

### Notes on firebase
This was super easy to setup and we're just using it for user auth. The one thing about it is right now for some reason the frontend doesn't let users with account sign back in. Like if you create an account you're good but if you sign out you can't sign back in lol. This makes testing a bit annoying while the bug is there but the workaround I've found is to go into the firebase admin console and then go to "Authentication" > "Users". You can delete a user account from here so that way you can create another acccount.

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
