
  import { createRoot } from "react-dom/client";
  import { GoogleOAuthProvider } from "@react-oauth/google";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { registerSW } from 'virtual:pwa-register';

  // Registrar o Service Worker para atualizações em background
  registerSW({ immediate: true });

  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "insira-seu-client-id-aqui.apps.googleusercontent.com"}>
      <App />
    </GoogleOAuthProvider>
  );
  