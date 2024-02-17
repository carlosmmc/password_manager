## Backend README
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

Before running things you'll need to setup an .env file with all of the API keys in `/frontend`. It needs to have the following structure:

```
# firebase keys
FIREBASE_API_KEY="***"
FIREBASE_AUTH_DOMAIN="***"
FIREBASE_PROJECT_ID="***"
FIREBASE_STORAGE_BUCKET="***"
FIREBASE_MESSAGING_SENDER_ID="***"
FIREBASE_APP_ID="***"

# cloud sql keys
CLOUD_SQL_CONNECTION_NAME="***"
CLOUD_SQL_USER="***"
CLOUD_SQL_PASSWORD="***"
CLOUD_SQL_DATABASE_NAME="***"
```

After you all do all of that you should just be able to run the following command from the `backend` folder: `python main.py` and then navigate to local host 8080.