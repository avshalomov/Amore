import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalAlert = ({
    show,
    onHide,
    modalTitle = "Alert!",
    modalBody = "Something went wrong!",
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <hr />
                <p>{modalBody}</p>
                <hr />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAlert;
