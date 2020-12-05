import React, { useState } from "react";
import {
  Container,
  Form,
  FormControl,
  Col,
  Row,
  Card,
  Button,
} from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import { loremIpsum } from "lorem-ipsum";
import axios from "axios";

axios.defaults.withCredentials = true;

const ratedArr = [
  "APPROVED",
  "Approved",
  "G",
  "GP",
  "M",
  "M/PG",
  "N/A",
  "NC-17",
  "NOT RATED",
  "Not Rated",
  "PASSED",
  "PG",
  "PG-13",
  "Passed",
  "R",
  "TV-13",
  "TV-14",
  "TV-G",
  "TV-MA",
  "TV-PG",
  "TV-Y7",
  "UNRATED",
  "Unrated",
  "X",
];

const typeArr = ["episode", "movie", "series"];

const genreArr = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "News",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

export default function AddNewMovie() {
  const { isContributor, isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  var [fields, handleFieldChange] = useFields({
    Title: "Test",
    Year: "2020",
    Rated: "R",
    Released: "1 Jan 2020",
    Runtime: "100 min",
    Genre: "Action",
    Director: "",
    Writer: "",
    Actors: "",
    Plot: "Test",
    Language: "English",
    Country: "Canada",
    Awards: "None",
    Poster: "",
    Metascore: "N/A",
    imdbRating: "N/A",
    imdbId: "",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "Test",
  });

  function validateForm() {
    for (const field in fields) {
      if (field !== "Poster" && field.length === 0) return false;
    }
    return true;
  }

  function generateMovie() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    fields.Title = loremIpsum({ count: 1, units: "words" });
    fields.Country = loremIpsum({ count: 1, units: "words" });
    fields.imdbId = loremIpsum({ count: 1, units: "words" });
    fields.Production = loremIpsum({ count: 1, units: "words" });
    fields.Year = (Math.floor(Math.random() * 120) + 1900).toString();
    fields.Rated = ratedArr[Math.floor(Math.random() * ratedArr.length)];
    fields.Released = `${(
      "0" + (Math.floor(Math.random() * 12) + 1).toString()
    ).slice(-2)} ${months[Math.floor(Math.random() * months.length)]} ${(
      Math.floor(Math.random() * 120) + 1900
    ).toString()}`;
    fields.Runtime = `${Math.floor(Math.random() * 200).toString()} min`;
    fields.Genre = genreArr[Math.floor(Math.random() * genreArr.length)];
    fields.Director = "John Lasseter";
    fields.Writer = "Stephen J. Rivele, Christopher Wilkinson";
    fields.Actors = "Chris Evans, Tina Fey";
    fields.Plot = loremIpsum({ count: 1, units: "paragraph" });
    fields.Language = "English";
    fields.Type = "movie";
    fields.Metascore = Math.floor(Math.random() * 11).toString();
    handleSubmit();
  }

  function handleSubmitForm(event) {
    event.preventDefault();
    handleSubmit();
  }

  async function handleSubmit() {
    const newMovie = fields;
    if (newMovie.Poster === "")
      newMovie.Poster =
        "https://i.pinimg.com/originals/ae/9f/73/ae9f732d6094233e902ca2bfdc8e2a84.jpg";
    console.log(newMovie);
    try {
      const namesStr = newMovie.Director + "," + newMovie.Writer + "," + newMovie.Actors;
      // console.log(namesStr.replace(", ", ",").replace(" ,", ",").replace(", ", ","));
      const names = namesStr.replace(", ", ",").replace(" ,", ",").replace(", ", ",").split(",");
      for (const name of names){
        const res = await axios(
          `${process.env.REACT_APP_API_URL}/api/people?name=${name}`
        );
        if (res.data.length === 0)
          throw new Error(name+" does not exist!");
        console.log(name, "exists.", res);
      }
      const res = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/movies`,
        newMovie
      );
      console.log(res.data);
      setIsLoading(false);
      history.push("/");
    } catch (e) {
      console.error(e);
      alert(e)
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
          <Form onSubmit={handleSubmitForm}>
            <Button variant="danger" onClick={generateMovie}>
              Generate
            </Button>
            {Object.keys(fields).map((property) => {
              if (property === "Rated") {
                return (
                  <Form.Group as={Row} key={property}>
                    <Form.Label column sm={2}>
                      {property}
                    </Form.Label>
                    <Col sm={10}>
                      <FormControl
                        as="select"
                        id={property}
                        value={fields[`${property}`]}
                        onChange={handleFieldChange}
                      >
                        {ratedArr.map((rated) => (
                          <option key={rated}>{rated}</option>
                        ))}
                      </FormControl>
                    </Col>
                  </Form.Group>
                );
              } else if (property === "Type") {
                return (
                  <Form.Group as={Row} key={property}>
                    <Form.Label column sm={2}>
                      {property}
                    </Form.Label>
                    <Col sm={10}>
                      <FormControl
                        as="select"
                        id={property}
                        value={fields[`${property}`]}
                        onChange={handleFieldChange}
                      >
                        {typeArr.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </FormControl>
                    </Col>
                  </Form.Group>
                );
              } else {
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
              }
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
