import axios from "axios";
import { backendURL } from "../backendurl";
// Function to fetch token
export const getToken = async () => {
  const res = await axios.get(`${backendURL}/auth/authToken`);
  // console.log(res.data)
  return res.data.token;
};

// API call to create meeting
export const createMeeting = async ({ token }) => {
  // Wait for the token to be resolved
  const authToken = await getToken(); 
  // console.log(authToken);

  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  // Destructure roomId from the response
  const { roomId } = await res.json();
  // console.log(roomId);
  return roomId;
};
