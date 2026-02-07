import axios from "axios";

// use full backend URL
const API = "http://localhost:5000/api/comments";

// GET comments for a ticket
export const fetchComments = async (ticketId, token) => {
  const res = await axios.get(`${API}/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// POST new comment
export const addComment = async (data, token) => {
  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
