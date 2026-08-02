"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const switchTheme = () => {
    switch (theme) {
      case "light": {
        setTheme("dark");
        return;
      }
      case "dark": {
        setTheme("light");
        return;
      }
      case "system": {
        setTheme(systemTheme === "light" ? "dark" : "light");
      }
    }
  };
  return (
    <button
      onClick={switchTheme}
      className="size-4 flex items-center justify-center relative rounded-md bg-neutral-200 dark:bg-neutral-800 p-3.5 cursor-pointer active:scale-[0.97] shadow-[inset_0_0_0_2px_hsl(0_0%_85%)] dark:shadow-[inset_0_0_0_2px_hsl(0_0%_20%)]"
    >
      <IconSun
        size={12}
        className="rotate-0 absolute scale-100 transition-all duration-200 dark:rotate-90 dark:scale-0"
      />
      <IconMoon
        size={12}
        className="rotate-90 absolute scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
};
