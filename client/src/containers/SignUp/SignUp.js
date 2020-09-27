import React, { useState } from "react";
import { Container, Form, FormControl, Col, Card } from "react-bootstrap";
import { useFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFields({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();

    function validateForm() {
        return (
            fields.username.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            alert("Creating user...");
            console.log("Creating user ", fields.username, "...");
            // await create user (pass in "regular")
            // await login user
            userHasAuthenticated(true);
            setIsLoading(false);
            history.push("/");
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    return (
        <Container className="d-flex" style={{ height: "75vh", maxWidth: "50vw"}}>
            <Card className="col justify-content-center align-self-center">

                <Card.Header>
                    <h1>Sign Up</h1>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Username</Form.Label>
                                <FormControl
                                    id="username"
                                    onChange={handleFieldChange}
                                    value={fields.username}
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>

                                <Form.Label>Password</Form.Label>
                                <FormControl
                                    id="password"
                                    type="password"
                                    onChange={handleFieldChange}
                                    value={fields.password}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>

                                <Form.Label>Confirm Password</Form.Label>
                                <FormControl
                                    id="confirmPassword"
                                    type="password"
                                    onChange={handleFieldChange}
                                    value={fields.confirmPassword}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <LoadingButton
                                isLoading={isLoading}
                                type="submit"
                                disabled={!validateForm()}
                            > Sign Up
                </LoadingButton>
                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}