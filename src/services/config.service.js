import axios from "axios";

class ConfigService {
  constructor() {
    this.api = axios.create({
      baseURL:
        process.env.REACT_APP_SERVER_URL || "http://localhost:5005/api/config",
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) config.headers = { Authorization: `Bearer ${token}` };

      return config;
    });
  }

  getConfig(guildId) {
    return this.api.get(`/${guildId}`);
  }

  setConfig(guildId, config) {
    return this.api.post(`/${guildId}`, config);
  }
}

const configService = new ConfigService();

export default configService;
