import React, { useState } from "react";
import { Container, Form, FormControl } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../../libs/hooks";
import { useAppContext } from "../../libs/context";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    var [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });
    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }
    async function handleSubmit(event){
        event.preventDefault();
        try {
            alert("Logging in...");
            console.log("Logging in  user ", fields.username, "...");
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
            <Form>
                <Form.Label>Username</Form.Label>
                <FormControl
                    id="username"
                    autoFocus
                    value={fields.username}
                    onChange={handleFieldChange}
                />
                <Form.Label>Password</Form.Label>
                <FormControl
                    id="password"
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
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