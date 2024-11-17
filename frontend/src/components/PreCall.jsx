import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Button,
  Text,
  Select,
} from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import {
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import { Constants, useMediaDevice } from "@videosdk.live/react-sdk";

const PreCall = () => {
  const navigate = useNavigate();
  const { requestPermission } = useMediaDevice();
  const { checkPermissions, getCameras, getMicrophones } = useMediaDevice();
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [hasVideoPermission, setHasVideoPermission] = useState(false);
  const [webcams, setWebcams] = useState([]);
  const [mics, setMics] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState("");
  const [selectedWebcamId, setSelectedWebcamId] = useState("");
  const [encoderConfig] = useState("h540p_w960p");
  const videoRef = useRef(null);
  const location = useLocation();
  const { roomId, username } = location.state || {};

  const checkMediaPermission = async () => {
    const audioPermission = await checkPermissions("audio");
    const videoPermission = await checkPermissions("video");
    setHasAudioPermission(audioPermission.get("audio"));
    setHasVideoPermission(videoPermission.get("video"));
  };

  const requestMediaPermission = async () => {
    try {
      const requestAudioVideoPermission = await requestPermission(
        Constants.permission.AUDIO_VIDEO
      );
      console.log(
        "request Audio and Video Permissions",
        requestAudioVideoPermission.get(Constants.permission.AUDIO),
        requestAudioVideoPermission.get(Constants.permission.VIDEO)
      );
      await checkPermissions("audio_video");
      console.log("tried getting permission");
      await checkMediaPermission();
    } catch (ex) {
      console.log("Error in requestPermission ", ex);
    }
  };

  const fetchMediaDevices = async () => {
    try {
      const availableWebcams = await getCameras();
      const availableMics = await getMicrophones();
      setWebcams(availableWebcams);
      setMics(availableMics);
    } catch (err) {
      console.error("Error fetching media devices", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert("Meeting link copied!");
  };

  const handleJoinRoom = () => {
    navigate(`/meetingroom/${roomId}`, { state: { username, roomId } });
  };

  const getMediaTracks = async () => {
    try {
      const customVideoStream = await createCameraVideoTrack({
        cameraId: selectedWebcamId,
        encoderConfig,
        optimizationMode: "motion",
        multiStream: false,
      });
      const videoTracks = customVideoStream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      if (videoTrack && videoRef.current) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
      }
    } catch (error) {
      console.error("Error in getting Video Track", error);
    }
  };

  useEffect(() => {
    checkMediaPermission();
    fetchMediaDevices();
  }, []);

  return (
    <ChakraProvider>
      <Box bg="black" color="white" p={8} minH="100vh">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading color="#FFF">CodeLab</Heading>
          <Flex align="center">
            <Text mr={4} color="#E5E5E5">
              User: {username}
            </Text>
            <Text color="#E5E5E5">Meeting ID: {roomId}</Text>
            <Tooltip label="Copy meeting link">
              <IconButton
                icon={<FiCopy />}
                size="sm"
                ml={4}
                onClick={copyToClipboard}
                bg="#14213D"
                color="white"
                _hover={{ bg: "#FCA311" }}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Box mb={8}>
          <Text fontSize="lg" color="#E5E5E5" mb={4}>
            Permissions:
          </Text>
          <Flex wrap="wrap" gap={4}>
            <Button
              colorScheme={hasAudioPermission ? "green" : "red"}
              onClick={requestMediaPermission}
            >
              {hasAudioPermission
                ? "Audio Permission Granted"
                : "Request Audio Permission"}
            </Button>
            <Button
              colorScheme={hasVideoPermission ? "green" : "red"}
              onClick={requestMediaPermission}
            >
              {hasVideoPermission
                ? "Video Permission Granted"
                : "Request Video Permission"}
            </Button>
          </Flex>
        </Box>

        <Box mb={8}>
          <Text fontSize="lg" color="#E5E5E5" mb={4}>
            Available Devices:
          </Text>
          <Flex direction="column" gap={4}>
            <Box>
              <Text mb={2}>Webcams:</Text>
              <Select
                placeholder="Select Webcam"
                value={selectedWebcamId}
                onChange={(e) => setSelectedWebcamId(e.target.value)}
              >
                {webcams.map((cam) => (
                  <option key={cam.deviceId} value={cam.deviceId}>
                    {cam.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text mb={2}>Microphones:</Text>
              <Select
                placeholder="Select Microphone"
                value={selectedMicId}
                onChange={(e) => setSelectedMicId(e.target.value)}
              >
                {mics.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap={6}>
          <Box
            borderWidth="1px"
            borderColor="#444"
            rounded="md"
            shadow="md"
            bg="#222"
            overflow="hidden"
            w="900px"
            h="600px"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Flex direction="column" gap={4}>
            <Button
              bg="#14213D"
              color="white"
              onClick={getMediaTracks}
              _hover={{ bg: "#FCA311" }}
              w="150px"
            >
              Test Devices
            </Button>
            <Button
              bg="#14213D"
              color="white"
              onClick={handleJoinRoom}
              _hover={{ bg: "#FCA311" }}
              w="150px"
            >
              Join Room
            </Button>
          </Flex>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default PreCall;
