"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import XionLogin from "../components/XionLogin";
import NFTGatedContent from "../components/NFTGatedContent";
import { Button } from "@burnt-labs/ui";

const NFTCheckPage = (): JSX.Element => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [nftContractAddress, setNftContractAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(false);
  const [checkComplete, setCheckComplete] = useState<boolean>(false);
  // Track if we're actually displaying the NFT check component
  const [showNFTAccessComponent, setShowNFTAccessComponent] = useState<boolean>(false);

  const handleConnect = (address: string) => {
    console.log("Connected with address:", address);
    setConnectedAddress(address);
  };

  const handleDisconnect = () => {
    console.log("Disconnected");
    setConnectedAddress(null);
    setCheckComplete(false);
    setShowNFTAccessComponent(false);
  };

  const handleCheckAccess = () => {
    if (!nftContractAddress || !tokenId) {
      alert("Please enter both contract address and token ID");
      return;
    }
    
    // First set loading state
    setIsCheckingAccess(true);
    
    // Then trigger the actual check by showing the component
    // This prevents multiple renders and API calls
    setCheckComplete(true);
    setShowNFTAccessComponent(true);
  };

  const handleAccessGranted = () => {
    console.log("Access granted!");
    setIsCheckingAccess(false);
  };

  const handleAccessDenied = () => {
    console.log("Access denied!");
    setIsCheckingAccess(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-800/50 p-8 shadow-lg backdrop-blur-sm">
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            NFT Access Check
          </h1>
          <p className="text-gray-400">Verify if you own a specific NFT to access exclusive content</p>
        </div>

        <div className="mt-4 mb-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {connectedAddress && (
          <div className="mt-1 rounded-lg bg-gray-900/50 p-4">
            <div className="text-xs text-gray-500 mb-1">Connected Address:</div>
            <code className="block rounded bg-black/30 p-2 text-xs text-blue-300 font-mono break-all">
              {connectedAddress}
            </code>
          </div>
        )}

        {/* Using the XionLogin component */}
        <XionLogin
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          className="my-4"
        />

        {/* NFT Check Form */}
        {connectedAddress && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
              Enter NFT Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">NFT Contract Address</label>
                <input
                  type="text"
                  value={nftContractAddress}
                  onChange={(e) => setNftContractAddress(e.target.value)}
                  placeholder="Enter NFT contract address"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This should be a valid contract address that supports the CW721 NFT standard.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Token ID</label>
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Enter token ID"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The specific token ID within the NFT contract.
                </p>
              </div>
              
              <Button
                onClick={handleCheckAccess}
                structure="base"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-md hover:shadow-blue-500/20"
                disabled={!nftContractAddress || !tokenId}
              >
                <span className="font-medium">CHECK ACCESS</span>
              </Button>
            </div>
          </div>
        )}

        {/* NFT-gated content example */}
        {checkComplete && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Access Verification Result
            </h2>
            
            {isCheckingAccess && !showNFTAccessComponent && (
              <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="h-8 w-8 animate-spin mb-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <p className="text-gray-400">Preparing to verify NFT ownership...</p>
                </div>
              </div>
            )}
            
            {showNFTAccessComponent && (
              <NFTGatedContent 
                contractAddress={nftContractAddress}
                tokenId={tokenId}
                accessDeniedMessage={`You do not own the NFT with token ID ${tokenId} from the provided contract.`}
                onAccessGranted={handleAccessGranted}
                onAccessDenied={handleAccessDenied}
                className="mt-3"
              >
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-green-400 mb-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-300 mb-2 text-center">Access Granted!</h3>
                  <p className="text-gray-300 text-center">You own the required NFT and have access to the exclusive content.</p>
                  
                  <div className="mt-4 p-3 bg-black/30 rounded-md">
                    <p className="text-xs text-gray-400">NFT Ownership Verified:</p>
                    <p className="text-sm font-mono text-blue-300">Token ID: {tokenId}</p>
                    <p className="text-sm font-mono text-blue-300 break-all">Contract: {nftContractAddress}</p>
                    <a 
                      href={`https://explorer.burnt.com/xion-testnet-2/contract/${nftContractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 inline-block"
                    >
                      View on Xion Explorer →
                    </a>
                  </div>
                </div>
              </NFTGatedContent>
            )}
          </div>
        )}
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Powered by Burnt Labs</p>
        </div>
      </div>
    </main>
  );
};

export default NFTCheckPage;
