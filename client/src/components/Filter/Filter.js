import React from "react";
import { Accordion, Card, Button, Row, Form } from "react-bootstrap";

export default function Filter(movies, setMovies) {
  function renderForm() {}
  return (
    <Row>
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Filter
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Not yet implemented</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Row>
  );
}
