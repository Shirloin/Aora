import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";
import { TUser } from "../types/user-type";

interface GlobalContextType {
    isLoggedIn: boolean;
    user: TUser | null;
    isLoading: boolean;
    setIsLoggedIn: (val: boolean) => void;
    setUser: (user: TUser | null) => void;
}

const GlobalContext = createContext<GlobalContextType>({
    isLoggedIn: false,
    isLoading: false,
    user: null,
    setIsLoggedIn: () => { },
    setUser: () => { }
});

export const useGlobalContext = () => useContext(GlobalContext)

export default function GlobalProvider({ children }: { children: ReactNode }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const res = await getCurrentUser();
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [])

    return (
        <GlobalContext.Provider value={{ isLoggedIn, user, isLoading, setIsLoggedIn, setUser }}>
            {children}
        </GlobalContext.Provider>
    )
}