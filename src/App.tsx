"use client";
import { useState } from "react";
import XionLogin from "./components/XionLogin";

export default function Page(): JSX.Element {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnect = (address: string) => {
    console.log("Connected with address:", address);
    setConnectedAddress(address);
  };

  const handleDisconnect = () => {
    console.log("Disconnected");
    setConnectedAddress(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-800/50 p-8 shadow-lg backdrop-blur-sm">
        <div className="mb-2 text-center">
          <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            XION SDK DEMO
          </h1>
          <p className="text-gray-400">Demonstrating the XionLogin component</p>
        </div>

        {connectedAddress && (
          <div className="mt-1 rounded-lg bg-gray-900/50 p-4">
            <code className="m-1 block rounded bg-black/30 p-2 text-xs text-blue-300 font-mono break-all">
              {connectedAddress}
            </code>
          </div>
        )}

        {/* Using the XionLogin component with various props */}
        <XionLogin
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          className="my-4"
        />
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Powered by Burnt Labs</p>
        </div>
      </div>
    </main>
  );
}
