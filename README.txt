1. Movie Database
2. N/A
3. 
    Server is running on an OpenStack instance. It can be run locally but requires a MongoDB database named "test".

    Connect to OpenStack instance:
    1. ssh -L 9999:localhost:5000 student@134.117.128.136 (password is 'test123')
    2. // (should already be done) check that client/.env points to localhost:9999

    Run server locally (assuming database 'test' exists):
    1. cd server
    2. npm i 
    3. cd init
    4. node initdatabase // NOTE: will take several minutes!!! please be patient :D
    5. cd ..
    6. node server.js

    Start React app:
    1. cd client
    2. npm i
    3. (if running locally) set REACT_APP_API_URL=http://localhost:5000 in .env file
    4. npm start

    *** if OpenStack server is not running, repeat same steps in run server locally ***

4/5.

SERVER-SIDE

│   server.js
│
├───data
│       movie-data.json
│       small-movie-data.json
│       user-data.json
│
├───init
│       initdatabase.js
│       insertMovies.js
│       insertReviews.js
│       insertUsers.js
│
├───models
│       Movie.js
│       People.js
│       Review.js
│       User.js
│
├───routes
│       movieroutes.js
│       peopleroutes.js
│       reviewroutes.js
│       userroutes.js
│
└───utils
        follow.js


    server.js
    - Express server

    init
    - initdatabase.js is wrapper that calls the other files
    - insertMovie.js inserts each movie from data/movie-data.json into the database "test", creating Movie and People documents, which have a many-to-many relationship.
        - Movie has Director, Writer, Actor
        - Person has Movies and FrequentCollaborators
    - insertUsers.js inserts each User from data/user-data.json and with every user follow each other. 
    - insertReviews.js creates randomly generated Reviews for the 100 most recent movies,  modifies the rating of each movie
        - Review has Movie and User

    models
    - database schemas

    routes
    - get Movie, User, People by id
    - get Movie by title, genre, year, minrating
    - get Recommended Movies by id
    - get Genres
    - get People by id
    - get People by name
    - get Reviews by user id or movie id



CLIENT-SIDE
 - everything dynamically generated from data received from server or Youtube
 - searchbar
 - links between pages (Movies, People, User)

    
Things that are not done:

- User sign in was not integrated, so Profile page has been disabled. Authentication has not been fully implemented. 
- POST movie/review/name endpoint not integrated in client, but should work as the code is used in server/init/initdatabase.js
- user movie recommendation based on MoviesWatched
- follow/unfollow/notification
- movie filter 
- edge case where movie has multiple directors
- error handling if api call fails