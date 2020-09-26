import React from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "./containers/SignUp/SignUp";
import Login from "./containers/LogIn/LogIn";
import Home from "./containers/Home/Home";

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
            </Switch>
    )
}