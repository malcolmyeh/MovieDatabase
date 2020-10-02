import React, { useState } from 'react';
import { Navbar, NavLink, Container, Form, Button, FormControl } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/context";
import { useFields } from "./libs/hooks";
import { formatLink } from "./libs/linkutils";
function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(true); // todo: default should be false
  const [username, setUsername] = useState("test-user"); // todo: default should be false

  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    searchTerm: ""
  });

  function handleLogout() { // does this need to make any call to server?
    userHasAuthenticated(false);
    setUsername("");
    history.push("/");
  }


  function handleSearchSubmit(event) {
    event.preventDefault();
    if (fields.searchTerm !== ""){
      console.log("searching for ", fields.searchTerm, "...")
      const term = fields.searchTerm;
      history.push(`/search?q=${formatLink(term)}`)
    } else {
      alert("Search cannot be empty. ");
    }
  }

  return (
    <>
      <Navbar bg="light">
        {isAuthenticated ?
          <>
            <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
            <NavLink as={Link} to="/">Home</NavLink>
            <Form inline onSubmit={handleSearchSubmit}>
              <FormControl
                id="searchTerm"
                autoFocus
                value={fields.searchTerm}
                onChange={handleFieldChange}
              />
              <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
            <NavLink as={Link} to="/genres">Genres</NavLink>
            <NavLink as={Link} to={`/profile/${username}`}>Profile</NavLink>
            <NavLink onClick={handleLogout}>Log Out</NavLink>
          </> :
          <>
            <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
            <NavLink as={Link} to="/">Home</NavLink>
            <Form inline onSubmit={handleSearchSubmit}>
              <FormControl
                id="searchTerm"
                autoFocus
                value={fields.searchTerm}
                onChange={handleFieldChange}
              />
              <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
            <Button variant="outline-primary">Search</Button>
            <NavLink as={Link} to="/genres">Genres</NavLink>
            <NavLink as={Link} to="/signup">Sign Up</NavLink>
            <NavLink as={Link} to="/login">Log In</NavLink>

          </>}
      </Navbar>
      <Container>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, username, setUsername }}>
          <Routes />
        </AppContext.Provider>
      </Container>

    </>
  );
}

export default App;
