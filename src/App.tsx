"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import XionLogin from "./components/XionLogin";
import NFTGatedContent from "./components/NFTGatedContent";
import NFTMinter from "./components/NFTMinter";
import NFTDeployer from "./components/NFTDeployer";
import { Button } from "@burnt-labs/ui";

export default function Page(): JSX.Element {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  // Using the provided CW721 contract address
  const [nftContractAddress, setNftContractAddress] = useState<string>("xion1863vjkm2jgd6xe6gntr869y36g3md9kdex5h5hea5g79nxhxj9ms79tpxa");
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [showDeployer, setShowDeployer] = useState<boolean>(false);

  const handleConnect = (address: string) => {
    console.log("Connected with address:", address);
    setConnectedAddress(address);
  };

  const handleDisconnect = () => {
    console.log("Disconnected");
    setConnectedAddress(null);
    setMintedTokenId(null);
  };

  const handleMintSuccess = (tokenId: string) => {
    console.log("NFT minted successfully with token ID:", tokenId);
    setMintedTokenId(tokenId);
  };

  const handleDeploySuccess = (contractAddress: string) => {
    console.log("Contract deployed successfully at:", contractAddress);
    setNftContractAddress(contractAddress);
    setShowDeployer(false);
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

        {/* NFT Contract Deployer Section */}
        {connectedAddress && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
              Deploy Your Own Contract
            </h2>
            
            {!showDeployer ? (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">
                  Deploy your own NFT contract to have full minting privileges.
                </p>
                <Button
                  onClick={() => setShowDeployer(true)}
                  structure="base"
                  className="mb-3 bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 transition-all hover:shadow-md hover:shadow-green-500/20"
                >
                  <span className="font-medium">SHOW DEPLOYER</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => setShowDeployer(false)}
                  structure="base"
                  className="mb-3"
                >
                  <span className="font-medium">HIDE DEPLOYER</span>
                </Button>
                <NFTDeployer 
                  codeId="1164"
                  onSuccess={handleDeploySuccess}
                  className="mt-3"
                />
              </>
            )}
          </div>
        )}

        {/* NFT Minter Section */}
        {connectedAddress && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
              Mint a Test NFT
            </h2>
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Mint a test NFT to demonstrate the NFT-gated access functionality.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">NFT Contract Address</label>
              <input
                type="text"
                value={nftContractAddress}
                onChange={(e) => setNftContractAddress(e.target.value)}
                placeholder="Enter NFT contract address"
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                This should be a valid contract address that supports the CW721 NFT standard.
                <br />
                Default: CW721 contract (code ID: 1164) on Xion Testnet.
              </p>
              <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-300">
                <strong>Important:</strong> Only the contract owner or authorized accounts can mint NFTs.
                If you get an authorization error, deploy your own contract above or use one where you have minting privileges.
              </div>
            </div>
            
            <NFTMinter 
              contractAddress={nftContractAddress}
              onSuccess={handleMintSuccess}
              className="mt-3"
              metadata={{
                name: "Xion Access NFT",
                description: "This NFT grants access to exclusive content",
                image: "https://placekitten.com/400/400"
              }}
            />
          </div>
        )}

        {/* Link to NFT Check Page */}
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-600">
            Dedicated NFT Check Page
          </h2>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/50 to-teal-900/50 border border-blue-700/50 text-center">
            <p className="text-gray-300 mb-3">Try our dedicated page for checking access to NFT-gated content.</p>
            <Link to="/nft-check">
              <Button
                structure="base"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 transition-all hover:shadow-md hover:shadow-blue-500/20"
              >
                <span className="font-medium">GO TO NFT CHECK PAGE</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* NFT-gated content example */}
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            NFT-Gated Content Example
          </h2>
          
          <NFTGatedContent 
            contractAddress={nftContractAddress}
            tokenId={mintedTokenId || "1"}
            accessDeniedMessage={
              mintedTokenId 
                ? `You need to own the NFT with token ID ${mintedTokenId} to view this content` 
                : "Mint an NFT above to access this content"
            }
            className="mt-3"
          >
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Exclusive Content</h3>
              <p className="text-gray-300">This content is only visible to owners of the required NFT.</p>
              <p className="text-gray-300 mt-2">Congratulations on having access to this exclusive section!</p>
              
              {mintedTokenId && (
                <div className="mt-4 p-3 bg-black/30 rounded-md">
                  <p className="text-xs text-gray-400">Viewing content gated by NFT:</p>
                  <p className="text-sm font-mono text-blue-300">Token ID: {mintedTokenId}</p>
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
              )}
            </div>
          </NFTGatedContent>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Powered by Burnt Labs</p>
        </div>
      </div>
    </main>
  );
}
