import { Form } from "react-bootstrap";

export const TextInput = ({
    label,
    name,
    value,
    maxLength,
    required,
    onChange,
}) => (
    <Form.Group controlId={name}>
        <Form.Label>
            <strong>{label}:</strong>
        </Form.Label>
        <Form.Control
            type="text"
            name={name}
            value={value}
            maxLength={maxLength}
            required={required}
            onChange={onChange}
        />
    </Form.Group>
);
