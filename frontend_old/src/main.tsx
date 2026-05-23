import React from "react";
import ReactDOM from "react-dom/client";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo";

const rpcUrl = import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC;

const config = getDefaultConfig({
  appName: "LexCrypt Demo",
  projectId,
  chains: [arbitrumSepolia],
  transports: rpcUrl ? { [arbitrumSepolia.id]: http(rpcUrl) } : undefined
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
