## Github Repository Details
Welcome to the repo! This is a pretty standard setup, there are only two main things to note:

* **Branch Protection Rules** - I added a branch protection rule to ensure `main` is protected. You can find them in "Settings" > "Branches" > "Branch protection rule". We can change these as we develop, I just put something basic in place. The main things it does is:
    * Require a pull request with approvals
    * Prevent anyone from pushing directly to main
    * Require status checks to all be green before being able to merge into main

* **Linting** - I added a linting rule to ensure we have a consistent style throughout the project. I choose `pylint` and `black` for our python code. You can set these up in your local VSCode so that way it will tell you of any violations before even pushing up to our remote repo. A few notes:
    * You can find the linting rule in `.github/workflows/superlinter.yml`.
    * You can see the invocation of the rules in the "Actions" tab. If there are any failures it will be red, just look through the logs and see what it is complaining about.