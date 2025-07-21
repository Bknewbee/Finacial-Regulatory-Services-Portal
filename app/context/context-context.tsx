"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isAdmin: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        login: () => setIsAdmin(true),
        logout: () => setIsAdmin(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
