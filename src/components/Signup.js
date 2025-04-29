import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user", JSON.stringify({ name, email, password }));
    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      await axios.post("http://localhost:8085/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <h2 className="text-center mb-4">Signup</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="profileImage">Profile Image</Label>
              <Input
                type="file"
                id="profileImage"
                onChange={(e) => setProfileImage(e.target.files[0])}
                accept="image/*"
              />
            </FormGroup>
            <Button color="primary" type="submit" block>
              Signup
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Signup;