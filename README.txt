1. Movie Database
2. N/A
3. 
    - React frontend framework
    - Automated testing of Mongoose Schemas and API integration
        - npm test (from MovieDatabase/server)
    - Basic IMDB Webscraper (WIP)
        - searches for imdbID
        - gets movie data from imdbID
        - works with movie, series, episode
        - not implemented with server yet
            - need to update POST to be able to take input from scraper or directly interact via Mongoose
            - need to automate/crawl
4. 
    PassportJS middleware for authentication:
        - encapsulates authentication flow which increases maintainability for rest of the server
        - Although only the local strategy has been used for this checkin, it is easy to integrated with other OAuth providers like Google and Facebook, which has become an increasingly popular method of user authentication for web applications
        - Session support is built into PassportJS middleware and integrates with Mongoose and MongoDB, which where sessions are stored

    Combining Log In/Signup
        - Apart from password comfirmation (entering same password twice), which can be handled very easily on the frontend, there is very little difference between the sign in flow of log in and sign up, so I chose to combine the functionality into a single route and PassportJS authenticate call. 

    React framework over Template Engine such as Pug or EJS
        - MVC pattern utilizing RESTful API
            - server is only responsible for sending JSON data while the frontend will parse it for a view
            - clearer distinction between responsibility of client and server
        - The movie database has a lot of dynamic pages (~10,000 movies, ~26,000,000 people and potentially many users) and within those pages, components can update (follow/unfollow, add/remove review, add movie, etc), which makes client side rendering faster and more maintainable as it scales
        - reusability of functional components leads to less redundant code, especially if there are only minor differences in specific use cases
    
    Setting Many-To-Many relationships in database 
        - Importing movie data from JSON to MongoDB can be done with a single call insertMany() which is very fast. Instead, I chose to loop through each movie, checking if each person already exists, creating them if they don't exist, and linking everything together via ObjectId. This causes the initdabase.js to take several minutes instead of a few seconds
        - _id is the primary key which is indexed. Since MongoDB uses self-balancing tree indexes, searching for a particular _id will be O(log n) and θ(log n). Thus it is faster to search for a document by its _id rather than another field like its Name or Title
            - The application will hundreds of searches for every interacting user, so it is important to make sure that querying the database is as fast as possible
            - the initialization cost is negligeable as it should only be run once (as the server is being deployed into production)
        
5. 
    IP address: 134.117.128.136
    username: student
    password: test123
6. 
    Connect to Openstack instance and start server:

    1. ssh -L 9999:localhost:5000 student@134.117.128.136
    2(probably not needed). sudo ./init.sh
        Note: This process loads the movie data into MongoDB, creating many-to-many relationships for each movie and will take several minutes in OpenStack! Please be patient :D
    3. ./run.sh

    Start React app:

    1. cd client
    2. npm i
    3. npm start
    4. If the app cannot connect to server, check that REACT_APP_API_URL=http://localhost:9999 in .env file