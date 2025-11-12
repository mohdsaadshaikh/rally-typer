/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from "react";
import { SERVER_URL } from "@/constants/site";
import Cookies from "universal-cookie";

const AuthContext = createContext({
  isAuth: false,
});

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("auth.session-token");

  useEffect(() => {
    async function getAuth() {
      try {
        const res = await fetch(`${SERVER_URL}/session`, {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.error) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    }
    getAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
