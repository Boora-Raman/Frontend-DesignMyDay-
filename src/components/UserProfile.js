import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({ name: "", email: "", profileImagePath: "" });
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setNewName(response.data.name);
        setNewEmail(response.data.email);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user profile");
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUser();
    } else {
      toast.error("Please login to view profile");
    }
  }, [userId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user", JSON.stringify({ name: newName, email: newEmail, password: newPassword }));
    if (newProfileImage) {
      formData.append("image", newProfileImage);
    }

    try {
      await axios.put(`http://localhost:8085/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      setUser({ ...user, name: newName, email: newEmail, profileImagePath: newProfileImage ? URL.createObjectURL(newProfileImage) : user.profileImagePath });
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <h2 className="text-center mb-4">User Profile</h2>
          <Row>
            <Col md="4" className="text-center">
              <img
                src={user.profileImagePath ? `http://localhost:8085/api/images/${user.profileImagePath}` : "https://via.placeholder.com/150"}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "150px", height: "150px" }}
              />
            </Col>
            <Col md="8">
              <Form onSubmit={handleUpdate}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">New Password (optional)</Label>
                  <Input
                    type="password"
                    id="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="profileImage">Update Profile Image</Label>
                  <Input
                    type="file"
                    id="profileImage"
                    onChange={(e) => setNewProfileImage(e.target.files[0])}
                    accept="image/*"
                  />
                </FormGroup>
                <Button color="primary" type="submit" block>
                  Update Profile
                </Button>
              </Form>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default UserProfile;