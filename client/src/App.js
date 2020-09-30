import React, { useState } from 'react';
import { Navbar, NavLink, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/context";
function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(true); // todo: default should be false
  const [username, setUsername] = useState("test-user"); // todo: default should be false
  console.log("username: ", username);
  const history = useHistory();

  function handleLogout() { // does this need to make any call to server?
    userHasAuthenticated(false);
    setUsername("");
    history.push("/");
  }
  return (
    <>
      <Navbar bg="light">
        {isAuthenticated ?
          <>
            <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
            <NavLink as={Link} to="/">Home</NavLink>
            <NavLink as={Link} to="/search">Search</NavLink>
            <NavLink as={Link} to="/genres">Genres</NavLink>
            <NavLink as={Link} to={`/profile/${username}`}>Profile</NavLink>
            <NavLink onClick={handleLogout}>Log Out</NavLink>
          </> :
          <>
            <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
            <NavLink as={Link} to="/">Home</NavLink>
            <NavLink as={Link} to="/search">Search</NavLink>
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
