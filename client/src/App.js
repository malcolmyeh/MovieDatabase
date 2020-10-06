import React, { useState } from "react";
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

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(true); // todo: default should be false
  const [username, setUsername] = useState("test-user"); // todo: default should be empty
  const [isContributor, setIsContributor] = useState(false);
  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    searchTerm: "",
  });

  function handleLogout() {
    // does this need to make any call to server? delete session?
    userHasAuthenticated(false);
    setUsername("");
    history.push("/");
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (fields.searchTerm !== "") {
      console.log("searching for ", fields.searchTerm, "...");
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
              <NavLink as={Link} to={`/profile/${username}`}>
                Profile
              </NavLink>
              <NavLink onClick={handleLogout}>Log Out</NavLink>
            </>
          ) : (
            <>
              {" "}
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
      </Navbar>
      <Container style={{ marginBottom: "30px" }}>
        <AppContext.Provider
          value={{
            isAuthenticated,
            userHasAuthenticated,
            username,
            setUsername,
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
