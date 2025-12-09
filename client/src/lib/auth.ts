import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "../store/authSlice";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Rename to follow custom hook convention
export const useAuth = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                dispatch(login({ user: data.user, accessToken: data.accessToken }));

            } catch (error) {
                console.log("An error occurred: ", error);
            }
        }
        initAuth();
    }, [dispatch]); // Add dispatch to dependencies
}