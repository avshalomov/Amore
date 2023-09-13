import { useState, useEffect } from "react";
import { Form, Button, Row } from "react-bootstrap";
import GenericFormGroup from "./GenericFormGroup";

const GenericForm = ({ formData, setFormData, handleSubmit, submitName }) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidForm, setIsValidForm] = useState(false);

    // Validating all form
    useEffect(() => {
        const isValid = Object.values(formData).every((val) => val);
        if (formData.password) {
            setIsValidForm(isValid && formData.password === confirmPassword);
        } else setIsValidForm(isValid);
    }, [formData, confirmPassword]);

    // Handles formData changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "picture") {
            HandleImageChange(e);
            return;
        }
        if (name === "confirmPassword") {
            setConfirmPassword(value);
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle image change
    const HandleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (
            files.length === 1 &&
            file.type.includes("image/") &&
            file.size < 5 * 1024 * 1024
        ) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: base64Data,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="justify-content-between">
                {Object.keys(formData).map((key) => (
                    <GenericFormGroup
                        key={key}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                    />
                ))}
                {formData.password && (
                    <GenericFormGroup
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                )}
            </Row>
            <Row className="justify-content-center">
                <Button
                    style={{ margin: "2vw", width: "150px" }}
                    variant="warning"
                    type="submit"
                    disabled={!isValidForm}
                >
                    {submitName}
                </Button>
            </Row>
        </Form>
    );
};

export default GenericForm;
