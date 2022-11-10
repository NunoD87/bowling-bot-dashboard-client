import axios from "axios";

class GuildsService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api/guild`,
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

  getGuilds() {
    return this.api.get("/all");
  }
}

const guildsService = new GuildsService();

export default guildsService;
