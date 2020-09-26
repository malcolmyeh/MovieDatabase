import React, { useState } from "react";
import { Container, Form, FormControl } from "react-bootstrap";
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
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Label>Username</Form.Label>
                <FormControl
                    id="username"
                    onChange={handleFieldChange}
                    value={fields.username}
                    autoFocus
                />
                <Form.Label>Password</Form.Label>
                <FormControl
                    id="password"
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.password}
                />
                <Form.Label>Confirm Password</Form.Label>
                <FormControl
                    id="confirmPassword"
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.confirmPassword}
                />
                <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    disabled={!validateForm()}
                > Sign Up
                </LoadingButton>
            </Form>
        </Container>
    )
}