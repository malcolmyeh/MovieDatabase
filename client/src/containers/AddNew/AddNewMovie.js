import React, { useState } from "react";
import { Container, Form, FormControl, Col, Row, Card } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import { delay } from "../../libs/otherutils";

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
    Awards: "",
    Poster: "",
    Ratings: [],
    Metascore: "",
    imdbRating: "",
    imdbVotes: "",
    imdbId: "",
    Type: "",
    DVD: "",
    BoxOffice: "",
    Production: "",
    Website: "",
  });

  function validateForm() {
    for (const field in fields) {
      if (field.length === 0) return false;
    }
    return true;
  }

  async function verifyNames() {
    // todo: return bool
    const director = fields.Director;
    const writers = fields.Writer.split(", ");
    const actors = fields.Actors.split(", ");
    console.log("Verifying director ", director, "...");
    await delay(100);
    console.log(director, " verified. ");
    for (const writer of writers) {
      console.log("Verifying writer ", writer, "...");
      await delay(100);
      console.log(writer, " verified. ");
    }
    for (const actor of actors) {
      console.log("Verifying actor, ", actor, "...");
      await delay(100);
      console.log(actor, " verified. ");
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    await verifyNames();
    try {
      alert("Creating movie...");
      console.log("movie: ", fields);
      // await login user
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
              {" "}
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
