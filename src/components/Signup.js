// src/components/Signup.js
import React, { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      await axios.post("http://localhost:8085/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed!");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg rounded">
        <CardBody>
          <CardTitle tag="h3" className="text-center mb-4">
            Sign Up
          </CardTitle>
          <Form onSubmit={handleSignup}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                required
                value={user.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                required
                value={user.email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                required
                value={user.password}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </FormGroup>
            <Button color="success" block>
              Register
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Signup;
