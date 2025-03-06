import { createHashRouter } from "react-router-dom";

import ChatPage from "@pages/ChatPage";
import LoginPage from "@pages/LoginPage";
import Layout from "@components/Layout";
import ErrorPage from "./pages/ErrorPage";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
