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