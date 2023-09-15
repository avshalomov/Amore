import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";

// Regex patterns for validation
const REGEX_MAP = {
    username: /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/,
    email: /^[a-zA-Z0-9._-]{1,25}@[a-zA-Z0-9.-]{1,15}\.[a-zA-Z]{2,8}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/,
    confirmPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/,
    productName: /^.{3,30}$/,
    description: /^.{3,50}$/,
    price: /^[0-9]+(\.[0-9]{1,2})?$/,
    category: /^.{1,20}$/,
    gender: /^(Male|Female|Unisex)$/,
    stockQuantity: /^[0-9]+$/,
    default: /^.*$/,
};
// Max lengths for validation
const MAX_LENGTH_MAP = {
    username: 20,
    email: 50,
    password: 50,
    confirmPassword: 50,
    productName: 30,
    description: 50,
    price: 10,
    category: 20,
    gender: 10,
    stockQuantity: 10,
    default: 50,
};
// Error messages for validation
const ERROR_MAP = {
    username: "Username must be 4-20 characters, start with a letter, and contain only letters, numbers, hyphens, or underscores.",
    email: "Email must be valid and less than 26 characters before the '@', and domain part less than 16 characters.",
    password: "Password must be 8-50 characters, contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    confirmPassword: "Passwords must match.",
    productName: "Product name must be between 3-30 characters.",
    description: "Description must be between 3-50 characters.",
    price: "Price must be a positive number, optionally with up to two decimal places.",
    category: "Category must be between 1-20 characters.",
    gender: "Gender must be either Male, Female, or Unisex.",
    stockQuantity: "Stock quantity must be a positive integer or zero.",
    default: "Invalid input.",
};

const GenericFormGroup = ({ name, value, onChange }) => {
    const [isValid, setIsValid] = useState(false);

    // Validate input on change
    useEffect(() => {
        if (name.toLowerCase() === "confirmpassword") {
            setIsValid(value === document.getElementById("password").value);
        } else {
            const regex = REGEX_MAP[name] || REGEX_MAP.default;
            setIsValid(regex.test(value));
        }
    }, [name, value]);

    // Determine field type
    const lowerCaseName = name.toLowerCase();
    const fieldType = lowerCaseName.includes("password")
        ? "password"
        : lowerCaseName.includes("email")
        ? "email"
        : lowerCaseName.includes("picture")
        ? "file"
        : "text";

    // Determine field label
    const fieldLabel =
        name
            .split(/(?=[A-Z])/)
            .join(" ")
            .charAt(0)
            .toUpperCase() +
        name
            .split(/(?=[A-Z])/)
            .join(" ")
            .slice(1)
            .toLowerCase();

    return (
        <Form.Group
            style={{
                margin: "2vw auto",
            }}
            controlId={name}
            as={Col}
            sm={12}
            md={6}
            lg={6}
        >
            <Form.Label>{fieldLabel}</Form.Label>
            <Form.Control
                type={fieldType}
                name={name}
                value={fieldType === "file" ? undefined : value}
                onChange={onChange}
                isInvalid={!isValid && value !== ""}
                maxLength={MAX_LENGTH_MAP[name] || MAX_LENGTH_MAP.default}
            />
            {!isValid && (
                <Form.Control.Feedback type="invalid">
                    {ERROR_MAP[name] || ERROR_MAP.default}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};

export default GenericFormGroup;
