import React, { useState } from "react";
import { Container, Form, FormControl, Col, Card } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Login() {
  const { userHasAuthenticated, setUsername, setUserId } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    username: "",
    password: "",
  });
  function validateForm() {
    return fields.username.length > 0 && fields.password.length > 0;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const newPost = {
      username: fields.username,
      password: fields.password,
    };
    try {
      const res = await axios.post(
        `
      ${process.env.REACT_APP_API_URL}/api/auth/signin`,
        newPost,
        { withCredentials: true }
      );
      console.log(res.data);
      userHasAuthenticated(true);
      setUsername(res.data.username);
      setUserId(res.data.userId);
      setIsLoading(false);
      history.push("/");
    } catch (e) {
      alert(e);
      console.error(e);
      setIsLoading(false);
    }
  }

  return (
    <Container style={{ position: "absolute", top: "30%" }}>
      <Card>
        <Card.Header>
          <h1>Log In</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Username</Form.Label>
                <FormControl
                  id="username"
                  autoFocus
                  value={fields.username}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <FormControl
                  id="password"
                  type="password"
                  value={fields.password}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form.Row>
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              disabled={!validateForm()}
            >
              Log In
            </LoadingButton>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
