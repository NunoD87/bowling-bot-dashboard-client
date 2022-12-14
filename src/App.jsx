import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import { useUser } from "./context/user.context";
import DashboardPage from "./pages/DashboardPage";
import GuildPage from "./pages/GuildPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import HandleDiscord from "./utils/HandleDiscord";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loading />;

  return (
    <div>
      <Navbar />

      <div className="flex w-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/discord" element={<HandleDiscord />} />

          <Route
            path="/dashboard"
            element={
              user ? <DashboardPage /> : <Navigate to="/login" replace />
            }
            disableScrollToTop
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
            disableScrollToTop
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
