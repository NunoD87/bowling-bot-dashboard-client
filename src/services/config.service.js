import axios from "axios";

class ConfigService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api/config`,
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      return this.setAuthorization(config);
    });
  }

  setAuthorization(config) {
    const token = localStorage.getItem("token");
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    return config;
  }

  setConfig(guildId, config) {
    return this.api.post(`/${guildId}`, config);
  }

  getConfig(guildId) {
    return this.api.get(`/${guildId}`);
  }

  getHistory(guildId) {
    return this.api.get(`/${guildId}/history`);
  }
}

const configService = new ConfigService();

export default configService;
