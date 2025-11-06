import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ProfileProvider } from "./context/ProfileContext.tsx";
import { StrictMode } from "react";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { TourProvider } from "./context/TourContext.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <TourProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </TourProvider>
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
);
