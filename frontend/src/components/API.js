export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiMDMyOGZkZS0xYTdhLTQyOTAtOWEyZC00MWI3YjY2YTg0MjMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczMTY3ODc4NywiZXhwIjoxNzM0MjcwNzg3fQ.OulJQdDQ5iyMN17CBIybBS-5I7s7IL48DVr__TKMjhw";

// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};
