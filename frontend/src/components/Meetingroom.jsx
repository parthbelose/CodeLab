import {
  ChakraProvider,
  Box,
  Heading,
  Grid,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import { FiCopy, FiUsers } from "react-icons/fi";
import CodeEditor from "./CodeEditor";
import OutputScreen from "./OutputScreen";
import InputScreen from "./InputScreen";
import LanguageSelect from "./LanguageSelect";
import ProblemStatement from "./ProblemStatement";
import WhiteBoard from "./WhiteBoard";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Call from "./Call";

function Meetingroom() {
  const { roomId } = useParams();
  const location = useLocation();
  const { username } = location.state || {};
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [problem, setProblem] = useState("");
  const [isWhiteBoardVisible, setIsWhiteBoardVisible] = useState(true);
  const [isProblemStatementVisible, setIsProblemStatementVisible] =
    useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const socket = useSocket();

  const handleUserChange = useCallback(({ users }) => {
    setUsers(users);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("code_update", setCode);
      socket.on("problem_update", setProblem);
      socket.on("current_users", handleUserChange);
      socket.on("user_joined", handleUserChange);
      socket.on("user_left", handleUserChange);
    }

    return () => {
      if (socket) {
        socket.emit("leave_room", { roomId, username });
        socket.off("code_update");
        socket.off("problem_update");
        socket.off("current_users");
        socket.off("user_joined");
        socket.off("user_left");
      }
    };
  }, [socket, handleUserChange, roomId, username]);
  const handleJoinRoom = () => {
    if (socket && username && roomId) {
      socket.emit("join_room", { roomId, username });
      setHasJoined(true);
    } else {
      console.error("Username or roomId is missing or socket is unavailable");
    }
  };

  const handleDisconnect = () => {
    if (socket && username && roomId) {
      socket.emit("leave_room", { roomId, username });
      setHasJoined(false);
      navigate("/");
    }
  };

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      if (socket) {
        socket.emit("code_update", { roomId, code: newCode });
      }
    },
    [roomId, socket]
  );

  const handleProblemChange = useCallback(
    (newProblem) => {
      setProblem(newProblem);
      if (socket) {
        socket.emit("problem_update", { roomId, problem: newProblem });
      }
    },
    [roomId, socket]
  );

  const runCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/editor/executecode",
        { code, language, input }
      );
      setOutput(response.data.stdout);
    } catch (error) {
      console.error(error);
      setOutput("Error executing code");
    }
  };

  const generateCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/editor/generateCode",
        { problem, code }
      );
      handleCodeChange(response.data.code);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const copyToClipboard = () => {
    let currentPath = window.location.href;
    currentPath = currentPath.split("/");
    currentPath = currentPath[currentPath.length - 1];
    navigator.clipboard.writeText(currentPath);
    alert("Meeting link copied!");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = `code.${getFileExtension(language)}`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getFileExtension = (lang) => {
    switch (lang) {
      case "javascript":
        return "js";
      case "python":
        return "py";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "txt";
    }
  };

  return (
    <ChakraProvider>
      <Box bg="black" color="white" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading color="#FFF">CodeLab</Heading>
          <Flex align="center">
            <Box mr={3} color="#E5E5E5">
              User: {username}
            </Box>
            <Box color="#E5E5E5">RoomId: {roomId}</Box>
            <Tooltip
              label="Copy collaboration link"
              aria-label="Copy collaboration link"
            >
              <IconButton
                icon={<FiCopy />}
                size="sm"
                ml={3}
                onClick={copyToClipboard}
                bg="#14213D"
                color="white"
                _hover={{ bg: "#FCA311" }}
              />
            </Tooltip>
          </Flex>
        </Flex>

        {hasJoined ? (
          <Flex justify="space-between" mb={6} align="center">
            <Menu>
              <MenuButton
                as={Button}
                bg="#14213D"
                rightIcon={<FiUsers />}
                _hover={{ bg: "#FCA311" }}
              >
                Current Users
              </MenuButton>
              <MenuList bg="#E5E5E5" color="black">
                {users.map((user) => (
                  <MenuItem
                    key={user.id}
                    _hover={{ bg: "#FCA311", color: "white" }}
                  >
                    {user.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Button
              bg="#FCA311"
              color="white"
              onClick={handleDisconnect}
              _hover={{ bg: "#14213D" }}
            >
              Leave Session
            </Button>
          </Flex>
        ) : (
          <Flex justify="center" mb={6} align="center">
            <Button
              bg="#14213D"
              color="white"
              onClick={handleJoinRoom}
              _hover={{ bg: "#FCA311" }}
            >
              Join Room
            </Button>
          </Flex>
        )}

        {hasJoined && (
          <>
            <Call roomId={roomId} username={username} />
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
              <Box bg="#14213D" p={6} borderRadius="lg" shadow="md">
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading size="md" color="#FFF">
                    Problem Statement
                  </Heading>
                  <Button
                    size="sm"
                    bg="#FCA311"
                    color="white"
                    onClick={() =>
                      setIsProblemStatementVisible(!isProblemStatementVisible)
                    }
                    _hover={{ bg: "#14213D" }}
                  >
                    {isProblemStatementVisible ? "Minimize" : "Show"}
                  </Button>
                </Flex>
                {isProblemStatementVisible && (
                  <ProblemStatement
                    problem={problem}
                    setProblem={handleProblemChange}
                  />
                )}
              </Box>

              <Box bg="#14213D" p={6} borderRadius="lg" shadow="md">
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading size="md" color="#FFF">
                    Whiteboard
                  </Heading>
                  <Button
                    size="sm"
                    bg="#FCA311"
                    color="white"
                    onClick={() => setIsWhiteBoardVisible(!isWhiteBoardVisible)}
                    _hover={{ bg: "#14213D" }}
                  >
                    {isWhiteBoardVisible ? "Minimize" : "Show"}
                  </Button>
                </Flex>
                {isWhiteBoardVisible && <WhiteBoard roomId={roomId} />}
              </Box>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <Box bg="#14213D" p={6} borderRadius="lg" shadow="md">
                <Heading size="md" mb={2} color="#FFF">
                  Code Editor
                </Heading>
                <LanguageSelect
                  selectedLanguage={language}
                  setLanguage={setLanguage}
                />
                <CodeEditor
                  language={language}
                  code={code}
                  setCode={handleCodeChange}
                />
                <Flex justify="space-between" mt={4}>
                  <Button
                    bg="#FCA311"
                    color="white"
                    onClick={runCode}
                    _hover={{ bg: "#14213D" }}
                    shadow="md"
                  >
                    Run Code
                  </Button>
                  <Button
                    bg="#14213D"
                    color="white"
                    onClick={generateCode}
                    _hover={{ bg: "#FCA311" }}
                    shadow="md"
                  >
                    Generate Code
                  </Button>
                  <Button
                    bg="#E5E5E5"
                    color="black"
                    onClick={handleDownload}
                    _hover={{ bg: "#FCA311", color: "white" }}
                    shadow="md"
                  >
                    Download Code
                  </Button>
                </Flex>
              </Box>

              <Box bg="#14213D" p={6} borderRadius="lg" shadow="md">
                <Heading size="md" mb={2} color="#FFF">
                  Input
                </Heading>
                <InputScreen input={input} setInput={setInput} />
                <Heading size="md" mt={6} mb={2} color="#FFF">
                  Output
                </Heading>
                <OutputScreen output={output} />
              </Box>
            </Grid>
          </>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default Meetingroom;
