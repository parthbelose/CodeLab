import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import CodelabConsole from "./CodelabConsole";
import { useSocket } from "../context/SocketProvider"; // Import the Socket context
import { getToken, createMeeting } from "./API";

function Home() {
  const navigate = useNavigate();
  const socket = useSocket(); // Access the socket instance from context
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinRoomID, setJoinRoomID] = useState("");
  const [username, setUsername] = useState("");

  const handleCreateRoom = async () => {
    const authToken = getToken();
    if (username.trim()) {
      if (socket) {
        const roomID = await createMeeting(authToken); // Generate a unique room ID
        // console.log(roomID);
        socket.emit("create_room", { roomId: roomID, username }, () => {
          // Callback on successful room creation
          navigate(`/precall`, { state: { roomId: roomID, username } });
        });
      } else {
        alert("Socket is not connected. Please try again.");
      }
    } else {
      alert("Please enter your username before creating a room");
    }
  };

  const handleJoinRoom = () => {
    setIsJoinModalOpen(true);
  };

  const handleJoinSubmit = () => {
    if (joinRoomID.trim() && username.trim()) {
      // Navigate to the meeting room with the provided Room ID and username
      socket.emit("join_room", { roomId: joinRoomID, username }, () => {
        // console.log("request sent");
        navigate("/precall", { state: { roomId: joinRoomID, username } });
        setIsJoinModalOpen(false);
      });
    } else {
      alert("Please enter both a valid room ID and username");
    }
  };

  return (
    <div className="home-container">
      <div className="animated-background"></div>

      <Container className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <CodelabConsole />
          <p className="sub-title">Collaborate and code in real-time</p>
        </motion.div>

        <Row className="justify-content-center mt-4">
          <Col md={6} lg={4}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Form.Group controlId="formUsername">
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="username-input"
                />
              </Form.Group>
            </motion.div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="primary"
                onClick={handleCreateRoom}
                className="btn-styled"
              >
                Create Room
              </Button>
            </motion.div>
          </Col>
          <Col xs="auto">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline-light"
                onClick={handleJoinRoom}
                className="btn-styled"
              >
                Join Room
              </Button>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Modal
        show={isJoinModalOpen}
        onHide={() => setIsJoinModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Join a Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRoomID">
              <Form.Label>Enter Room ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room ID"
                value={joinRoomID}
                onChange={(e) => setJoinRoomID(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formUsernameModal" className="mt-3">
              <Form.Label>Enter Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsJoinModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoinSubmit}>
            Join Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
