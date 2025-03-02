import { createBrowserRouter } from "react-router-dom";

import ChatPage from "@pages/ChatPage";
import LoginPage from "@pages/LoginPage";
import Layout from "@components/Layout";
// import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
]);

export default router;
