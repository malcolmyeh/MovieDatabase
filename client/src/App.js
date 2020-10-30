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
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isContributor, setIsContributor] = useState(false);
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
      </Navbar>
      <Container style={{ marginBottom: "30px" }}>
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
