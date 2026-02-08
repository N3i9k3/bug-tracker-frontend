import axios from "axios";
import { API_URL } from "../config"; // ✅ import live backend URL

// use live backend URL
const API = `${API_URL}/comments`;

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
