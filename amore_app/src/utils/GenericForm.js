import { useState, useEffect } from "react";
import { Form, Button, Row, Image } from "react-bootstrap";
import GenericFormGroup from "./GenericFormGroup";
import ModalAlert from "./ModalAlert";

const GenericForm = ({
    formData,
    setFormData,
    handleSubmit,
    submitName,
    cancel = null,
}) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidForm, setIsValidForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");

    // Validating all form
    useEffect(() => {
        const isValid = Object.values(formData).every((val) => val);
        if (formData.password)
            return setIsValidForm(
                isValid && formData.password === confirmPassword
            );
        setIsValidForm(isValid);
    }, [formData, confirmPassword]);

    // Handle formData change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "picture") return HandleImageChange(e);
        if (name === "confirmPassword") return setConfirmPassword(value);
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle image change
    const HandleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        // Checking if file is valid
        if (!file) return;
        if (!fileIsImage(file) || !fileIsLessThan5MB(file)) {
            setShowModal(true);
            e.target.value = "";
            return;
        }
        // Converting image to base64 string
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;
            setFormData((prevData) => ({
                ...prevData,
                [name]: base64Data,
            }));
        };
        reader.readAsDataURL(file);
    };
    const fileIsLessThan5MB = (file) => {
        if (file.size / 1024 / 1024 > 5) {
            setModalTitle("File too large!");
            setModalBody("Please upload a file smaller than 5MB");
            return false;
        } else return true;
    };
    const fileIsImage = (file) => {
        if (!file.type.includes("image/")) {
            setModalTitle("Invalid file type!");
            setModalBody("Please upload an image file");
            return false;
        } else return true;
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
                {cancel && (
                    <Button
                        style={{ margin: "2vw", width: "150px" }}
                        variant="danger"
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                )}
            </Row>
            <ModalAlert
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalTitle}
                body={modalBody}
            />
        </Form>
    );
};

export default GenericForm;
