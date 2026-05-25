import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useNotificationStore } from "./stores/notification.store";
import { useStore } from "zustand/react";

// Load les composants utiles
import { DefaultLayout } from "./components/display/DefaultLayout";
import { LoadingLayout } from "./components/display/LoadingLayout";
import { Toast } from "./components/ui/Toast";

// Load les pages du routage
import ConversationsPage from "./routes/ConversationsPage";

// Load les styles globaux
import "./App.css";
import LoadingPage from "./routes/LoadingPage";

function Build() {
  const { close, visible, message, color } = useStore(useNotificationStore);

  // CECI PERMET DE CHECKER S'IL Y A UNE NOTIFICATIONS ET AU BOUT D'UN
  // MOMENT LA RETIRE
  useEffect(() => {
    console.log("new-notification =>", message);
    setTimeout(() => {
      if (visible) {
        close();
      }
    }, 5000);
  }, [close, visible, message]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<ConversationsPage />} />
          </Route>
          <Route path="/loading" element={<LoadingLayout />}>
            <Route index element={<LoadingPage />} />
          </Route>
        </Routes>

        <div className="toast-bottom">
          {visible && (
            <div className="animate-notif">
              <Toast
                variant={color}
                onClose={close}
                message={message as string}
              />
            </div>
          )}
        </div>
      </BrowserRouter>
    </>
  );
}

export default Build;
