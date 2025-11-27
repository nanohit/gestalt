"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "123456789";
const STORAGE_KEY = "gestalt-admin-auth";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (isAdmin) {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [isAdmin]);

  const handleOpenLogin = useCallback(() => {
    setLogin(ADMIN_LOGIN);
    setPassword("");
    setLoginError("");
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsLoginModalOpen(false);
    setPassword("");
    setLoginError("");
  }, []);

  const handleLoginSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setIsLoginModalOpen(false);
        setPassword("");
        setLoginError("");
      } else {
        setLoginError("Неверный логин или пароль");
      }
    },
    [login, password],
  );

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return {
    isAdmin,
    isLoginModalOpen,
    login,
    password,
    loginError,
    setLogin,
    setPassword,
    handleOpenLogin,
    handleCloseLogin,
    handleLoginSubmit,
    handleLogout,
  };
}
