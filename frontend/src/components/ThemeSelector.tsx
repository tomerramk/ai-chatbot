import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState("light");

  const setThemeFromSystemPreference = () => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setCurrentTheme(prefersDark ? "dark" : "light");
  };

  const handleChange = (newTheme: string) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("data-theme", newTheme);
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    // Set theme based on system preference or saved setting
    const localStorageTheme = localStorage.getItem("data-theme");
    const root = document.documentElement;
    const savedTheme = root.getAttribute("data-theme");

    if (localStorageTheme) {
      setCurrentTheme(localStorageTheme);
      root.setAttribute("data-theme", localStorageTheme);
    } else if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      setThemeFromSystemPreference();
    }

    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (currentTheme === "system") {
        setThemeFromSystemPreference();
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [currentTheme]);
  const getThemeIcon = () => {
    if (
      currentTheme === "dark" ||
      (currentTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      return <MoonIcon width="20" height="20" />;
    } else {
      return <SunIcon width="20" height="20" />;
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus: text-black dark:text-white flex cursor-pointer items-center justify-center rounded-md bg-teal-50 dark:bg-gray-700 p-2.5 outline-none hover:bg-content-50">
        {getThemeIcon()}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-10 ml-2 mt-1 w-28 overflow-hidden rounded-lg bg-teal-50 dark:bg-gray-800 text-black dark:text-white p-1.5 shadow-lg outline-none">
        <DropdownMenu.Item
          className="cursor-pointer rounded-md p-2 outline-none hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("light")}
        >
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="cursor-pointer rounded-md p-2 outline-none hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("dark")}
        >
          Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="cursor-pointer rounded-md p-2 outline-none hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("system")}
        >
          System
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ThemeToggle;
