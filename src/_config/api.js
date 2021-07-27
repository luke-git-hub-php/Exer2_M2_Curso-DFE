import axios from "axios";

const api = axios.create({
    baseURL: "https://hn.algolia.com/api/v1/",
    headers: {
        "Content-type": "application/json"
    }
});

export default api;