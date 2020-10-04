import React from "react";
import { Spinner, Container, Row } from "react-bootstrap";

export default function Loading(text = "") {
  return (
    <Container>
      <Row>
        <Spinner animation="border" />
        <h3>{text !== "" ? `\xa0Loading ${text}...` : `\xa0Loading...`}</h3>
      </Row>
    </Container>
  );
}
