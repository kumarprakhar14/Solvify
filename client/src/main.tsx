import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { fetchInterceptor } from "./lib/fetchInterceptor";
import { AuthProvider } from "./components/AuthProvider";

fetchInterceptor();

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Provider>
);
