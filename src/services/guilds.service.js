import axios from "axios";

class GuildsService {
  constructor() {
    this.api = axios.create({
      baseURL:
        process.env.REACT_APP_SERVER_URL || "http://localhost:5005/api/guild",
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) config.headers = { Authorization: `Bearer ${token}` };

      return config;
    });
  }

  getGuilds() {
    return this.api.get("/all");
  }

  getGuild(guildId) {
    return this.api.get(`/${guildId}`);
  }
}

const guildsService = new GuildsService();

export default guildsService;
