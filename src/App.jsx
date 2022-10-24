import "./App.css";

import { Route, Routes } from "react-router-dom";

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
  console.log("user-App :", user);

  if (isLoading) return <Loading />;

  return (
    <div className='App'>
      <Navbar />

      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route
          path='/profile'
          element={user ? <ProfilePage /> : <Navigate to='/login' />}
        />

        <Route
          path='/signup'
          element={!user ? <SignupPage /> : <Navigate to='/profile' replace />}
        />
        <Route
          path='/login'
          element={!user ? <LoginPage /> : <Navigate to='/profile' replace />}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
