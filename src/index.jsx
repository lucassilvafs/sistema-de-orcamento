import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Products from "./routes/Products";
import History from "./routes/FileHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "produtos",
    element: <Products/>,
  },
  {
    path: "historico",
    element: <History/>,
  },
])

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
