// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "solvify:theme"; // localStorage key

export function ThemeProvider({ children, defaultTheme = "light" }) {
  // theme can be "light", "dark", or "system"
  const [themeChoice, setThemeChoice] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored || "system";
    } catch {
      return "system";
    }
  });

  // compute effective theme (light/dark) based on choice
  const getEffectiveFromChoice = (choice) => {
    if (choice === "light" || choice === "dark") return choice;
    // system case
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return defaultTheme;
  };

  const [effectiveTheme, setEffectiveTheme] = useState(() => getEffectiveFromChoice(themeChoice));

  // apply theme to document element and persist choice
  useEffect(() => {
    // set effectiveTheme
    const eff = getEffectiveFromChoice(themeChoice);
    setEffectiveTheme(eff);

    // persist user's explicit choice
    try {
      localStorage.setItem(THEME_KEY, themeChoice);
    } catch {}

    // apply to document: we use a data attribute so it's easy to target in CSS
    const root = document.documentElement;
    root.setAttribute("data-theme-choice", themeChoice); // useful for debugging
    // set class for styling: 'dark' or 'light' — this is compatible with Tailwind
    if (eff === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // If user chose "system", also react to changes in system preference
    let mq;
    const handleSystemChange = (e) => {
      if (themeChoice === "system") {
        const newEff = e.matches ? "dark" : "light";
        setEffectiveTheme(newEff);
        if (newEff === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };

    if (themeChoice === "system" && window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      // set initial already handled above; now listen
      if (mq.addEventListener) mq.addEventListener("change", handleSystemChange);
      else mq.addListener(handleSystemChange);
    }

    return () => {
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener("change", handleSystemChange);
        else mq.removeListener(handleSystemChange);
      }
    };
  }, [themeChoice, defaultTheme]);

  // API exposed to components
  const value = {
    themeChoice,                 // "light" | "dark" | "system"
    setThemeChoice,              // setter to persist user preference
    effectiveTheme,              // "light" or "dark" (what the app is currently using)
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
