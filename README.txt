1. 
    (not including sample json data)
    │   App.js // main file - contains navigation bar and app state
    │   index.css
    │   index.js
    │   Routes.js // handles routing to pages (and 404)
    │   serviceWorker.js
    │
    ├───components
    │   ├───Fade
    │   │       Fade.js // fade in effect
    │   │
    │   ├───Filter
    │   │       Filter.js // filter for movie lists (not yet implemented) 
    │   │
    │   ├───Loading
    │   │       Loading.js // loading spinner
    │   │
    │   ├───LoadingButton
    │   │       LoadingButton.js // button with loading spinner
    │   │       
    │   ├───MovieCard
    │   │       MovieCard.js // card with movie title and poster, links to movie page
    │   │
    │   └───Trailer
    │           Trailer.js // embeded youtube movie trailer
    │
    ├───containers
    │   ├───AddNew
    │   │       AddNewMovie.js // form to add new movie (contributing user only)
    │   │       AddNewName.js // form to add new name (contributing user only)
    │   │
    │   ├───Genres
    │   │       Genre.js // list of movies of a given genre
    │   │       Genres.js // list of genres
    │   │
    │   ├───Home
    │   │       Home.js // homepage - contains carousel of recommended movies and user feed (not yet implemented)
    │   │
    │   ├───LogIn
    │   │       LogIn.js
    │   │       
    │   ├───Movie
    │   │       Movie.js // template movie page - contains movie info, user reviews, recommended movies
    │   │
    │   ├───Name
    │   │       Name.js // template name page - contains list of movies and frequent collaborators
    │   │
    │   ├───NotFound
    │   │       NotFound.js // 404 page
    │   │
    │   ├───Profile
    │   │       Followers.js // user followers
    │   │       Following.js // names and other users that user follows
    │   │       MoviesWatched.js // movies watched by user
    │   │       Profile.js // template profile page - contains follow button, upgrade to contributing user
    │   │       Reviews.js // reviews by user
    │   │
    │   ├───Search
    │   │       Search.js // search - returns search results for movies, names (not yet implemented) and users (not yet implemented)
    │   │       
    │   └───SignUp
    │           SignUp.js
    │
    └───libs
            context.js // app context for authentication and user account details
            hooks.js // form field handling
            linkutils.js // formatting for links
            otherutils.js // contains a delay function (to mimic server calls)

2. Movie Database
3. N/A
4. 
    cd client
    npm i
    npm start
5. 
    All data (reviews, movie info, name info, MovieCard, Trailer, Followers, Following) are created dynamically from json.
    There is a simulated delay (/libs/otherutils.js) before loading the data. Loading component during delay and fade in to 
    improve user experience. 

    Links to genres, movies, names, users are generated dynamically.

    App.js
        - Navbar changes based on state
            - if user is authenticated
            - if user is a contributor
        - Log out button unauthenticates user
        - handles Searchbar and links to search page with query

    AddNewMovie.js
        - Form fields generated dynamically
        - disabled if user is not contributor

    Home.js
        - Stops current trailer video when changing carousel slide to prevent audio overlapping

    LogIn.js / SignUp.js
        - Changes authentication state

    Movie.js
        - add review and rating
            - average rating/num rating changes
        - will be relocated to server side
        - auto generate review and rating

    Name.js
        - follow/unfollow changes state

    Profile.js
        - see more/see less
        if own page
            - unfollow following names/profiles
            - delete reviews
            - change isContributor state
        else
            - follow/unfollow changes state

    Search.js
        - matches movies containing search query
            - this logic will be improved and relocated to server side
    