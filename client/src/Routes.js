import React from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "./containers/SignUp/SignUp";
import Login from "./containers/LogIn/LogIn";
import Home from "./containers/Home/Home";
import Movie from "./containers/Movie/Movie";
import Genres from "./containers/Genres/Genres";
import Genre from "./containers/Genres/Genre";
import Profile from "./containers/Profile/Profile";
import Search from "./containers/Search/Search";
import NotFound from "./containers/NotFound/NotFound";


// todo: /movie/:id


export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/movie">
                <Movie />
            </Route>
            <Route exact path="/genres">
                <Genres />
            </Route>
            <Route exact path="/profile/:id">
                <Profile/>
            </Route>
            <Route exact path="/genre/:id">
                <Genre/>
            </Route>
            <Route exact path="/search">
                <Search/>
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}