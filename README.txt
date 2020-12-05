Malcolm Yeh
101109829

Movie Database

Instructions and details are located in the Final Report PDF.

All required features have been implemented. 

Extensions included:
- React
- Interface Adapts to Varying Screen Sizes
- PassportJS
- SocketIO
- MongoDB/Mongoose
- Automated Backend Tests
- IMDB Web Scraper
- YouTube Trailer Integration

Movie Database
├───client -------------------------- React Frontend
│   ├───public ---------------------- Favicon/Logo
│   └───src
│       ├───App.js  ----------------- React App (navigation, search bar, session, SocketIO)
│       ├───components 
│       │   ├───Fade ---------------- Fade in component
│       │   ├───Loading ------------- Loading page
│       │   ├───LoadingButton ------- Button with spinner
│       │   ├───MovieCard ----------- Card with movie title, poster, year
│       │   └───Trailer ------------- Embeded YouTube trailer component
│       ├───containers
│       │   ├───AddNew -------------- Add new movie/new person
│       │   ├───Genres -------------- Movie genre list and individual genres
│       │   ├───Home ---------------- Landing page
│       │   ├───LogIn --------------- Log in
│       │   ├───Movie --------------- Main movie page
│       │   ├───Name ---------------- Director/Actor/Writer profile
│       │   ├───NotFound ------------ 404
│       │   ├───Profile ------------- User profile
│       │   ├───Search -------------- Search (Movies/People/Users)
│       │   └───SignUp -------------- Sign Up
│       └───libs --------------------
└───server -------------------------- NodeJS/Express Backend
    ├───server.js ------------------- Server entrypoint
    ├───data ------------------------ Sample movie, user, review data
    ├───init ------------------------ Scripts and functions to initialize database
    ├───models ---------------------- Mongoose Schemas for Movie, People, User, Reviews
    │   └───tests ------------------- Automated Schema tests
    ├───passport -------------------- PassportJS authentication
    ├───routes ---------------------- Express routes
    ├───tests ----------------------- Automated integration tests
    └───utils ----------------------- IMDB/YouTube webscrapers, follow function