import axios from "axios";

const DEFAULT_BASE_URL = "https://jasminewaterflow.com:5000/";

const rawBaseURL = import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL;

export const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

export default axios.create({
  baseURL,
});
