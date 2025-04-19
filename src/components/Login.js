import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8085/login", {
        name,
        password,
      });

      if (response.status === 200 && response.data.token) {
        toast.success(response.data.message || "Login successful");

        sessionStorage.setItem("jwt", response.data.token);
        sessionStorage.setItem("name", response.data.name);

        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials or server error");
    }
  };

  return (
    <Container style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <CardBody>
          <CardTitle tag="h4" className="fw-bold text-primary" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Login
          </CardTitle>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            <Button color="primary" block>
              Login
            </Button>

            <Row className="mt-3" style={{ marginTop: "1rem", justifyContent: "center" }}>
              <Col xs="auto">
                <a
                  href="/signup"
                  style={{ color: "#007bff", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Don’t have an account? Sign up
                </a>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
