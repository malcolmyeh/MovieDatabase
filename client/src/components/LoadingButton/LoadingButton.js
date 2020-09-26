import React from "react";
import { Button, Spinner } from "react-bootstrap";

export default function LoadingButton({
    isLoading,
    className = "",
    disabled = false,
    ...props
}) {
    return (
        <Button
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner as="span"
                animation="border"
                size="sm"
                role="status" />}
            {props.children}
        </Button>
    );
}