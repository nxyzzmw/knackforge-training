import { useContext, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

function Page() {
  const { theme, setTheme } = useContext(ThemeContext);
   useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={theme}>
      <p>Current theme: {theme}</p>

      <button
        onClick={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
      >
        Toggle Theme
      </button>
    </div>
  );
}

export default Page;
