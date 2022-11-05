import "./App.css";

import { Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import GuildPage from "./pages/GuildPage";
import HandleDiscord from "./utils/HandleDiscord";
import HomePage from "./pages/HomePage";
import Loading from "./components/Loading";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import { useUser } from "./context/user.context";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loading />;

  return (
    <div>
      <Navbar />

      <div className="flex w-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/discord" element={<HandleDiscord />} />

          <Route
            path="/dashboard"
            element={
              user ? <DashboardPage /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/guild/:guildId"
            element={
              user?.discord ? (
                <GuildPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/signup"
            element={
              !user ? <SignupPage /> : <Navigate to="/profile" replace />
            }
          />

          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/profile" replace />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
