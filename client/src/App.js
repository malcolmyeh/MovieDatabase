import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavLink,
  Container,
  Form,
  Button,
  FormControl,
  Nav,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/context";
import { useFields } from "./libs/hooks";
import { formatLink } from "./libs/linkutils";
import socketIOClient from "socket.io-client";

import ButterToast, { Cinnamon } from "butter-toast";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isContributor, setIsContributor] = useState(false);

  async function loadSession() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/session`
      );
      if (res.data.session) {
        // console.log("res.data.session:", res.data);
        userHasAuthenticated(true);
        setUsername(res.data.username);
        setUserId(res.data.userId);
        if (res.data.isContributor === "Contributor") setIsContributor(true);
        else setIsContributor(false);
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    loadSession();
    var socket = socketIOClient(`${process.env.REACT_APP_API_URL}`);
    console.log("Socket listening to room:", userId);
    socket.on(userId, (data) => {
      console.log("Socket ON");
      ButterToast.raise({
        content: (
          <Cinnamon.Crisp
            scheme={Cinnamon.Crisp.SCHEME_BLUE}
            content={() => <div>{data.body}</div>}
            title={data.name}
          />
        ),
        timeout: Infinity,
      });
    });

    return () => {
      console.log("Socket DISCONNECT");
      socket.disconnect();
    };
    //
  }, [isAuthenticated, userId]);

  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    searchTerm: "",
  });

  async function handleLogout() {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`
    );
    console.log(res);
    userHasAuthenticated(false);
    setIsContributor(false);
    setUsername("");
    setUserId("");
    history.push("/");
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (fields.searchTerm !== "") {
      const term = fields.searchTerm;
      history.push(`/search?q=${formatLink(term)}`);
    } else {
      alert("Search cannot be empty. ");
    }
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Movie Database
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink as={Link} to="/genres">
              Genres
            </NavLink>
            {isContributor ? (
              <>
                <NavLink as={Link} to="/add-movie">
                  Add Movie
                </NavLink>
                <NavLink as={Link} to="/add-name">
                  Add Name
                </NavLink>
              </>
            ) : (
              <></>
            )}
            {isAuthenticated ? (
              <>
                <NavLink disabled={false} as={Link} to={`/profile/${userId}`}>
                  Profile
                </NavLink>
                <NavLink onClick={handleLogout}>Log Out</NavLink>
              </>
            ) : (
              <>
                <NavLink as={Link} to="/signup">
                  Sign Up
                </NavLink>
                <NavLink as={Link} to="/login">
                  Log In
                </NavLink>
              </>
            )}
          </Nav>
          <Form inline onSubmit={handleSearchSubmit}>
            <FormControl
              className="mr-sm-2"
              id="searchTerm"
              autoFocus
              value={fields.searchTerm}
              onChange={handleFieldChange}
              placeholder="Search"
            />
            <Button type="submit" variant="outline-primary">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container style={{ marginBottom: "30px" }}>
        <ButterToast as={Link} position={{ vertical: 0, horizontal: 0 }} />
        <AppContext.Provider
          value={{
            isAuthenticated,
            userHasAuthenticated,
            username,
            setUsername,
            userId,
            setUserId,
            isContributor,
            setIsContributor,
          }}
        >
          <Routes />
        </AppContext.Provider>
      </Container>
    </>
  );
}

export default App;
