import React from "react";
import { Spinner, Card } from "react-bootstrap";
import "./Loading.css";

const Loading = ({ text }) => (
  <Card className="loading-card">
    <hr />
    <Card.Body>
      <Card.Text>{text}</Card.Text>
    </Card.Body>
    <Spinner
      animation="grow"
      role="status"
      className="loading-spinner"
    ></Spinner>
    <Spinner
      animation="grow"
      role="status"
      className="loading-spinner"
    ></Spinner>
    <Spinner
      animation="grow"
      role="status"
      className="loading-spinner"
    ></Spinner>
    <hr />
  </Card>
);

export default Loading;
