import axios from "axios";

const api = axios.create({
    baseURL: "/search",
    //baseURL: "http://localhost:3001/search",
    timeout: 5000

});

export default api;
