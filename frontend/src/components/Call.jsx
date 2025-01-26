import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { getToken, createMeeting } from "./API";
import ReactPlayer from "react-player";

const COLORS = {
  primary: "#FCA311",
  secondary: "#E5E5E5",
  dark: "#14213D",
};

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <Box display="flex" gap="4" mt="4">
      <Button
        bg={COLORS.primary}
        color="white"
        _hover={{ bg: "orange.400" }}
        onClick={() => leave()}
      >
        Leave
      </Button>
      <Button
        bg={COLORS.primary}
        color="white"
        _hover={{ bg: "orange.400" }}
        onClick={() => toggleMic()}
      >
        Toggle Mic
      </Button>
      <Button
        bg={COLORS.primary}
        color="white"
        _hover={{ bg: "orange.400" }}
        onClick={() => toggleWebcam()}
      >
        Toggle Webcam
      </Button>
    </Box>
  );
}

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("micRef.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <Box
      bg={useColorModeValue(COLORS.secondary, COLORS.dark)}
      p="4"
      borderRadius="md"
      boxShadow="lg"
      textAlign="center"
    >
      {webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          width="100%"
          height="100%"
          style={{ borderRadius: "8px" }}
        />
      ) : (
        <Box
          bg={COLORS.dark}
          color="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
          borderRadius="md"
        >
          Webcam Off
        </Box>
      )}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      <Text mt="2" fontSize="sm" fontWeight="bold" color={COLORS.dark}>
        {isLocal ? `${displayName} (You)` : displayName}
      </Text>
    </Box>
  );
}

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(false);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: onMeetingLeave,
  });

  return (
    <VStack spacing="6" bg={COLORS.secondary} p="8" borderRadius="lg">
      <Box textAlign="center">
        <Heading size="lg" color={COLORS.dark}>
          Meeting Room
        </Heading>
        <Text color={COLORS.dark}>Meeting ID: {meetingId}</Text>
      </Box>

      {joined ? (
        <>
          <Controls />
          <Grid
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap="4"
            w="100%"
          >
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </Grid>
        </>
      ) : (
        <Button
          size="lg"
          bg={COLORS.primary}
          color="white"
          _hover={{ bg: "orange.400" }}
          onClick={join}
        >
          Join Meeting
        </Button>
      )}
    </VStack>
  );
}

function Call({ roomId, username }) {
  const [meetingId, setMeetingId] = useState(roomId);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndMeeting = async () => {
      try {
        const token = await getToken(); // Fetch the auth token
        setAuthToken(token);

        // If roomId is null, create a new meeting
        if (!roomId) {
          const newMeetingId = await createMeeting({ token });
          setMeetingId(newMeetingId);
        }
      } catch (error) {
        console.error("Error fetching token or meeting ID:", error);
      }
    };

    fetchTokenAndMeeting();
  }, [roomId]);

  const onMeetingLeave = () => setMeetingId(null);

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: username,
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <Text>Loading...</Text>
  );
}

export default Call;
