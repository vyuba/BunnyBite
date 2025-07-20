// ThemeProvider.js
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContext = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};
const ThemeContext = createContext<ThemeContext>(null);

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });

  // Apply theme to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = getSystemTheme();
    }
    // root.classList.remove("light", "dark");
    // root.classList.add(appliedTheme);
    root.setAttribute("data-theme", appliedTheme);
    const themeColor = document.querySelector("meta[name=theme-color]");
    if (themeColor) {
      themeColor.setAttribute("content", appliedTheme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const root = window.document.documentElement;
      //   root.classList.remove("light", "dark");
      //   root.classList.add(getSystemTheme());
      root.setAttribute("data-theme", getSystemTheme());
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
