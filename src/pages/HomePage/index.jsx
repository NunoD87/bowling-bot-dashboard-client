import "./styles.css";

import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return navigate("/login");
}

export default HomePage;
