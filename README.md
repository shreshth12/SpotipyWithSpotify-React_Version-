#Spotify Web Application - Project Milestone 3

* APIs used : Genius, SpotifyWebAPI, fetch
* Libraries used : spotipy, json, sys, re, lyricsgenius, render_template, url_for, random, flask_login, wtforms, SQLAlchemy, react, bootstrap
*Frameworks used : Flask
*Programming languages used : Python, HTML, CSS, Javascript

[Heroku URL for milestone-1:](https://radiant-harbor-14713.herokuapp.com)

[Heroku URL for milestone-2:](https://nameless-dawn-00696.herokuapp.com/login)

Heroku URL for milestone-3: NOT REQUIRED

# A LITTLE BIT ABOUT THE APP :- 
This is a web application built using Flask framework for backend and react for the frontend. It uses Spotify's Web API to fetch top tracks for added artists of a particular user, their spotify song links displayed and a 30-second clip to hear the music. You can also check out the lyrics of the music, which is fetched using Genius API. You can make your own account and login to save favourite artists. It uses SQLAlchemy to translate python code to communicate with sql/postgresQL databases. 


# HOW YOU CAN CLONE THIS APP :-
Simply fork/clone the app and in order to run it, you need the spotify and Genius API credentials. You can get by creating your developer account on their websites. 

*Spotify -> https://developer.spotify.com/dashboard/login
*Genius -> https://genius.com/api-clients

Once you generate these credentials, create a file named .env in the same directory you cloned this app to. Paste your credentials like this :- 
*SPOTIFY_CLIENT_ID = "YOUR_CLIENT_ID"
*SPOTIFY_CLIENT_SECRET = "YOUR_SECRET_ID"
*GENIUS_AUTH_TOKEN = 'YOUR_GENIUS_TOKEN'

Also add a secret key like this : SECRET_KEY = 'the random string'

Save your files, make sure you have all the packages and libraries installed from requirements.txt and now you can run the app from application.py

# SOME TECHNICAL ISSUES THAT I ENCOUNTERED WITH THIS APPLICATION :-
## Milestone - 1
* Some of the songs had "()" in their name, for example : Don’t Go (with Justin Bieber & Don Toliver) and when I passed this whole name into the genius API, it could not get its lyrics. My way to solve this problem was using a python library re which removes "(EVERTHING_IN_IT)" which gives just the song's name and not the version. This solved my problem and then I could fetch song's lyrics.

* I was having all of my code in a single file and everytime I get any error with the API or want to debug, I had to scroll through a lot of code and use print statments tons of time. The best way to solve this was to create a new file called functions.py and give every get request its own function name. Now, running these all functions one by one in a different file like application.py would pin point the exact function which is causing error.

* The third technical issue that I faced was that the Genius API was not returning me any data upon usage and would give an error 403, saying I do not have the permissions. After a lot of googling I found out that my API would hit "Not a Robot" section of the Genius page and that would block me from accessing it. My way around with this issue was using developer specific API calls that basically do not need high level access and through that I can finally fetch links for lyrics.

## Milestone - 2
* Validation of the forms is not easy. I wanted this application to have username and password both as validations but doing it the standard if else statement way would be very complicated and would look very cluttered. I found out a library called wtforms which does all the validations with just one like of code for each field in a HTML form.

* One of the issues with my project was to figure out how to know if a value like username or an artist is already added to the database. wtforms has a very neat way of doing this. You can make a small function inside the forms python file which does these kinds of validation checks and if any error arries, it will throw an exception and not add it to database. 

* Not sure if it counts as a technical problem but since I had all my code in single file, it was super hard to debug if any kind of issue occurs. made separete files for everything. Example - a forms.py file for wtforms, routes.py file for all the rounting, functions.py file for all the spotify functions. This made the debugging very easy.

## Milestone - 3
* First technical issue was to convert my existing flask code in a way that it sends data to react's app.js file instead of using jinja. I was able to get this done by using blueprints library from python and pointing the template and static folders to the ones react created when doing npm run build.

* Second technical issue that I faced was how do I pass flask's flash or error messages to react to render on the webpage. I used fetch api to grab a json data from flask when submit button was pressed. This data would contain a list of artist ids those were not valid and hence I could display them on the main page if found.

* Third technical issue that I faced was how to store a list of artist ids before sending it back to the server and then again updating it based off if the id was valid or not. I resolved this by using react's state management. I created a state which stored artists ids and it sent it to the flask server when final submit button was pressed. Then fetch API was used to grab only those artist IDs which were valid and using that I updated my state again.

# EXISTING PROBLEMS WITH THE PAGE :-

Not sure if it a problem but it can be called a design flaw, I do not have any dedicated logout button on the page and hence you have to go to the url bar and add /logout to logout a user. Apart from this, this project is mostly good to go with a small exception being, It looks good when viewed on a PC or MAC but when you open it on a mobile phone, it doesn't have the appropriate layout. Also when you shink the webpage, the contents gets cluttered.

# MY PLANS FOR IMPROVEMENT :-
My first plan is to use jquery to dynamically scale the webpage when it is shinked on a PC/MAC or on a phone. My second plan is to add a separate template to display lyrics, instead of redirecting users to Genius page to view them. And debug why the app is not able to fetch artist's picture when hosted on heroku. Finally my third plan is to show artist's names instead of their IDs for better user readablity. 

# WHAT PART DO YOU FEEL MOST COMFORTABLE AND LEAST COMFORTABLE WITH :-
I feel most comfortable with the flask or the backend part of the project since I have had experience building webpages with flask before. React was completely new to me and so was javascript so it had a larger learning curve.

# Flask and `create-react-app`

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Run Application
1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8080/' (or whichever port you're using)

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`
