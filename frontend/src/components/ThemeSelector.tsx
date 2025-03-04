import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState("light");

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      root.setAttribute("data-theme", systemTheme);
    } else {
      root.setAttribute("data-theme", theme);
    }
  };

  const handleChange = (newTheme: string) => {
    localStorage.setItem("data-theme", newTheme);
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("data-theme");

    if (localStorageTheme) {
      setCurrentTheme(localStorageTheme);
      applyTheme(localStorageTheme);
    } else {
      handleChange("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (localStorage.getItem("data-theme") === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

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
          className="cursor-pointer rounded-md p-2 outline-none hover:text-white hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("light")}
        >
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="cursor-pointer rounded-md p-2 outline-none hover:text-white hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("dark")}
        >
          Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="cursor-pointer rounded-md p-2 outline-none hover:text-white hover:bg-teal-500 dark:hover:bg-teal-700"
          onSelect={() => handleChange("system")}
        >
          System
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ThemeToggle;
