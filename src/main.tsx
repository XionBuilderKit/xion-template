import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import NFTCheckPage from "./pages/NFTCheckPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AbstraxionProvider } from "@burnt-labs/abstraxion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/nft-check",
    element: <NFTCheckPage />,
  },
]);

const treasuryConfig = {
  treasury: "xion13qc9v7t9l5qrxpt9xzydkx0d8jev9avfc8clx7w94dyqvpguvtusfsjhm7",
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
  restUrl: "https://api.xion-testnet-2.burnt.com/",
};

createRoot(document.getElementById("root")!).render(
  <AbstraxionProvider config={treasuryConfig}>
    <RouterProvider router={router} />
  </AbstraxionProvider>
);
