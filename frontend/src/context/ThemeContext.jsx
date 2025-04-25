import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();  

export const ThemeProvider = ({ children }) => {

    const [theme ,setTheme] = useState( () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "dark";
        }
        return "light";
    });

    useEffect ( () =>{
        const root = document.documentElement;
        if (theme === 'dark'){
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);