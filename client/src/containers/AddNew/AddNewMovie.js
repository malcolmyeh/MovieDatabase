import React, { useState } from "react";
import { Container, Form, FormControl, Col, Row, Card } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import axios from "axios"

axios.defaults.withCredentials = true;

export default function AddNewMovie() {
  const { isContributor, isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    Title: "",
    Year: "",
    Rated: "",
    Released: "",
    Runtime: "",
    Genre: "",
    Director: "",
    Writer: "",
    Actors: "",
    Plot: "",
    Language: "",
    Country: "",
    Awards: "None",
    Poster: " ",
    Metascore: "N/A",
    imdbRating: "N/A",
    imdbVotes: "",
    imdbId: "",
    Type: "",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "",
  });

  function validateForm() {
    for (const field in fields) {
      if (field.length === 0) return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newMovie = fields;
    try {
      const res = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/people`,
        newMovie
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
          <h1>Add Movie</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {Object.keys(fields).map((property) => {
              return (
                <Form.Group as={Row} key={property}>
                  <Form.Label column sm={2}>
                    {property}
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
