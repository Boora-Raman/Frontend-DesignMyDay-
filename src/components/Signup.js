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
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
    if (image) formData.append("image", image);

    try {
      await axios.post("http://13.53.163.51:8085/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
        <Card style={{ maxWidth: "400px", width: "100%" }}>
          <CardBody className="p-5">
            <CardTitle tag="h4" className="text-center text-primary fw-bold mb-4">
              Sign Up
            </CardTitle>
            <Form onSubmit={handleSignup}>
              <FormGroup>
                <Label for="name" className="fw-semibold">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="email" className="fw-semibold">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password" className="fw-semibold">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="image" className="fw-semibold">Profile Image</Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </FormGroup>
              <Button color="primary" block className="mt-3">
                Register
              </Button>
            </Form>
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default Signup;