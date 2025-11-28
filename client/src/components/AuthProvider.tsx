import { ReactNode } from "react";
import { useAuth } from "../lib/auth";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    useAuth(); // Now called inside a component
    return <>{children}</>;
};
