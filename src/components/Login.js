import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const Login = () => {
  const [email, setEmail] = useState("");  // <-- changed from 'name' to 'email'
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8085/login", {
        email,         // <-- sending email instead of name
        password,
      });

      console.log("Login response:", response.data);
      if (response.status === 200 && response.data.token) {
        toast.success(response.data.message || "Login successful");
        sessionStorage.setItem("jwt", response.data.token);
        sessionStorage.setItem("email", response.data.email || email); // <-- store email
        navigate("/profile");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials or server error";
      toast.error(message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
        <Card style={{ maxWidth: "400px", width: "100%" }}>
          <CardBody className="p-5">
            <CardTitle tag="h4" className="text-center text-primary fw-bold mb-4">
              Login
            </CardTitle>
            <Form onSubmit={handleLogin}>
              <FormGroup>
                <Label for="email" className="fw-semibold">Email</Label> {/* <-- changed Label */}
                <Input
                  type="email"   // <-- changed Input type
                  id="email"
                  placeholder="Enter your email"  // <-- changed placeholder
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password" className="fw-semibold">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <Button color="primary" block className="mt-3">
                Login
              </Button>
              <Row className="mt-3">
                <Col className="text-center">
                  <a
                    href="/signup"
                    className="text-primary text-decoration-none"
                  >
                    Don’t have an account? Sign up
                  </a>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default Login;
