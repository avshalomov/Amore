import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalAlert = ({
    show,
    onHide,
    title = "No title provided to modal!",
    body = "No body provided to modal!",
    addButton = null,
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>
                    {title?.length > 1 ? title : "No title provided to modal!"}
                </Modal.Title>
                <Button variant="close" aria-label="Close" onClick={onHide} />
            </Modal.Header>
            <Modal.Body>
                <hr />
                <p>{body?.length > 1 ? body : "No body provided to modal!"}</p>
                <hr />
            </Modal.Body>
            <Modal.Footer>
                {addButton && (
                    <Button
                        variant={
                            addButton.variant ? addButton.variant : "danger"
                        }
                        onClick={addButton.handleButton}
                    >
                        {addButton.text
                            ? addButton.text
                            : "No text provided to button!"}
                    </Button>
                )}
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAlert;
