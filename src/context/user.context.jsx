import { createContext, useContext, useEffect, useState } from "react";

import Loading from "../components/Loading";
import authService from "../services/auth.service";

const UserContext = createContext();

export default function UserWrapper({ children }) {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  function authenticate({ user, token }) {
    delete user.password;
    setUser(user);
    localStorage.setItem("token", token);
  }

  async function handleDiscord(code) {
    try {
      const { data } = await authService.connectDiscord(code);
      authenticate(data);
      return data;
    } catch (error) {
      return error;
    }
  }

  function logout() {
    setUser(undefined);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const result = await authService.verify();
        setUser(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <UserContext.Provider
      value={{ user, isLoading, authenticate, handleDiscord, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
