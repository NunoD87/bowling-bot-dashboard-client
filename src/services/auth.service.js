import axios from "axios";
class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/auth`,
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

  login(credentials) {
    return this.api.post("/login", credentials);
  }

  signup(data) {
    return this.api.post("/signup", data);
  }

  verify() {
    return this.api.get("/verify");
  }

  editAccount(data) {
    return this.api.post("/edit", data);
  }

  deleteAccount() {
    return this.api.delete("/delete");
  }

  connectDiscord(code) {
    return this.api.post("/discord", { code });
  }

  disconnectDiscord() {
    return this.api.delete("/discord");
  }
}

const authService = new AuthService();

export default authService;
