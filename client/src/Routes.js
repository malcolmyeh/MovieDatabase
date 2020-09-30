import React from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "./containers/SignUp/SignUp";
import Login from "./containers/LogIn/LogIn";
import Home from "./containers/Home/Home";
import Movie from "./containers/Movie/Movie";
import Genres from "./containers/Genres/Genres";
import Profile from "./containers/Profile/Profile";
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
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}