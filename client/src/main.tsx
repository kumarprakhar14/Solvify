import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { fetchInterceptor } from "./lib/fetchInterceptor";
import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google"

fetchInterceptor();

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
        </GoogleOAuthProvider>
    </Provider>
);
