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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post("http://localhost:8085/login", {
        email,
        password,
      });
      const token = loginResponse.data.token;
      sessionStorage.setItem("jwt", token);

      // Fetch username from token
      const usernameResponse = await axios.get(`http://localhost:8085/username/${token}`);
      const username = usernameResponse.data;

      // Fetch user details to get userId
      const userResponse = await axios.get(`http://localhost:8085/users/name/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.userId;
      sessionStorage.setItem("userId", userId);

      toast.success("Login successful!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
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
            <Button color="primary" type="submit" block>
              Login
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;