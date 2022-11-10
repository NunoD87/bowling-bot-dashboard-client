import axios from "axios";

class BotService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_BOT_API_URL}/fetch`,
    });

    this.api.interceptors.request.use((config) => {
      return this.setAuthorization(config);
    });
  }

  setAuthorization(config) {
    const token = process.env.REACT_APP_BOT_API_SECRET;
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    return config;
  }

  fetchGuild(guildId) {
    return this.api.get(`/guild/${guildId}`);
  }
}

const botService = new BotService();

export default botService;
