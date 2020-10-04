// import React, { useState } from "react";
// import { Container, Form, FormControl, Col, Card } from "react-bootstrap";
// import LoadingButton from "../../components/LoadingButton/LoadingButton";
// import { useHistory } from "react-router-dom";
// import { useFields } from "../../libs/hooks";

// export default function AddNewMovie() {
//     const [isLoading, setIsLoading] = useState(false);
//     const history = useHistory();
//     var [fields, handleFieldChange] = useFields({
//         Title: "",
//         Year: "",
//         Rated: "",
//         Released: "",
//         Runtime: "",
//         Genre: "",
//         Director: "",
//         Writer: "",
//         Actors: "",
//         Plot: "",
//         Language: "",
//         Country: "",
//         Awards: "",
//         Poster: "",
//         Ratings: [],
//         Metascore: "",
//         imdbRating: "",
//         imdbVotes: "",
//         imdbId: "",
//         Type: "",
//         DVD: "",
//         BoxOffice: "",
//         Production: "",
//         Website: ""
//     });
//     function validateForm() {
//         for (const field in fields){
//             if (field.length === 0)
//                 return false;
//         }
//         return true;
//     }
//     async function handleSubmit(event) {
//         event.preventDefault();
//         try {
//             alert("Logging in...");
//             console.log("Logging in  user ", fields.username, "...");
//             // await login user
//             userHasAuthenticated(true);
//             setUsername("test-user");
//             setIsLoading(false);
//             history.push("/");
//         } catch (e) {
//             console.error(e);
//             setIsLoading(false);
//         }
//     }

//     return (
//         <Container className="d-flex" style={{ height: "75vh", maxWidth: "50vw"}}>
//             <Card className="col justify-content-center align-self-center">
//                 <Card.Header>
//                     <h1>Log In</h1>
//                 </Card.Header>
//                 <Card.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Row>
//                             <Form.Group as={Col}>
//                                 <Form.Label>Username</Form.Label>
//                                 <FormControl
//                                     id="username"
//                                     autoFocus
//                                     value={fields.username}
//                                     onChange={handleFieldChange}
//                                 />
//                             </Form.Group>
//                             <Form.Group as={Col}>
//                                 <Form.Label>Password</Form.Label>
//                                 <FormControl
//                                     id="password"
//                                     type="password"
//                                     value={fields.password}
//                                     onChange={handleFieldChange}
//                                 />
//                             </Form.Group>
//                         </Form.Row>
//                         <LoadingButton
//                             isLoading={isLoading}
//                             type="submit"
//                             disabled={!validateForm()}
//                         > Log In
//                 </LoadingButton>
//                     </Form>
//                 </Card.Body>
//             </Card>
//         </Container>
//     )
// }
