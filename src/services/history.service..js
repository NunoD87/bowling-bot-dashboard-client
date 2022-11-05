import axios from "axios";

class HistoryService {
  constructor() {
    this.api = axios.create({
      baseURL:
        `${process.env.REACT_APP_SERVER_URL}/api/history` ||
        "http://localhost:5005/api/history",
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) config.headers = { Authorization: `Bearer ${token}` };

      return config;
    });
  }

  getHistory(guildId) {
    return this.api.get(`/${guildId}`);
  }
}

const historyService = new HistoryService();

export default historyService;
