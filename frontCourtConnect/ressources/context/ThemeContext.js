import React, { createContext, useContext, useState } from "react";
import { themes } from "../constants/color";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("dark");
  const toggleTheme = () =>
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export { ThemeContext };
