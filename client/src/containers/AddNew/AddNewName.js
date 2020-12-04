import React, { useState } from "react";
import { Container, Form, FormControl, Col, Row, Card } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function AddNewName() {
  const { isContributor, isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    name: "",
  });
  function validateForm() {
    for (const field in fields) {
      if (field.length === 0) return false;
    }
    return true;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const newName = {
      name: fields.name,
    };
    try {
      const res = await axios.post(
        `
      ${process.env.REACT_APP_API_URL}/api/people`,
        newName
      );
      console.log(res.data);
      setIsLoading(false);
      history.push("/");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }
  function renderForm() {
    return (
      <Card>
        <Card.Header>
          <h1>Add Name</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {Object.keys(fields).map((property) => {
              return (
                <Form.Group as={Row} key={property}>
                  <Form.Label column sm={2}>
                    {property.charAt(0).toUpperCase() + property.slice(1)}
                  </Form.Label>
                  <Col sm={10}>
                    <FormControl
                      id={property}
                      value={fields[`${property}`]}
                      onChange={handleFieldChange}
                    />
                  </Col>
                </Form.Group>
              );
            })}
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              disabled={!validateForm()}
            >
              Add
            </LoadingButton>
          </Form>
        </Card.Body>
      </Card>
    );
  }
  return (
    <Container>
      {isContributor && isAuthenticated ? (
        renderForm()
      ) : (
        <h1>You are not a contributing user. </h1>
      )}
    </Container>
  );
}
