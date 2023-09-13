import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalAlert = ({
    show,
    onHide,
    title = "No title provided to modal!",
    body = "No body provided to modal!",
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <Button variant="close" aria-label="Close" onClick={onHide}/>
            </Modal.Header>
            <Modal.Body>
                <hr />
                <p>{body}</p>
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
