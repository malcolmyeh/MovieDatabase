import React, { useState } from 'react';
import { Navbar, NavLink, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/context";
function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  function handleLogout() { // does this need to make any call to server?
    userHasAuthenticated(false);
    history.push("/");
  }
  return (
    <>
      <Navbar bg="light">
        {isAuthenticated?
        <>
          <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
          <NavLink as={Link} to="/">Home</NavLink>
          <NavLink as={Link} to="/profile">Profile</NavLink>
          <NavLink as={Link} to="/search">Search</NavLink>
          <NavLink as={Link} to="/categories">Categories</NavLink>
          <NavLink onClick={handleLogout}>Log Out</NavLink>
        </> :
        <>
          <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
          <NavLink as={Link} to="/">Home</NavLink>
          <NavLink as={Link} to="/search">Search</NavLink>
          <NavLink as={Link} to="/categories">Categories</NavLink>
          <NavLink as={Link} to="/signup">Sign Up</NavLink>
          <NavLink as={Link} to="/login">Log In</NavLink>
          
        </>}
      </Navbar>
      <Container>
      <AppContext.Provider value={{userHasAuthenticated}}>
        <Routes />
      </AppContext.Provider>
      </Container>
      
    </>
  );
}

export default App;
