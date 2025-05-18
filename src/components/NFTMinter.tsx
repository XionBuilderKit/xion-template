"use client";
import { useState } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

export interface NFTMinterProps {
  /**
   * NFT contract address to mint on
   */
  contractAddress: string;
  /**
   * Optional callback after successful minting
   */
  onSuccess?: (tokenId: string) => void;
  /**
   * Optional callback on mint failure
   */
  onError?: (error: Error) => void;
  /**
   * Optional classNames for the container
   */
  className?: string;
  /**
   * Custom styles for the component
   */
  style?: React.CSSProperties;
  /**
   * Optional custom NFT metadata
   */
  metadata?: {
    name: string;
    description: string;
    image?: string;
  };
}

export const NFTMinter = ({
  contractAddress,
  onSuccess,
  onError,
  className = "",
  style,
  metadata = {
    name: "Test NFT",
    description: "A test NFT for demonstration purposes",
    image: "https://placekitten.com/200/300" // Sample image URL
  }
}: NFTMinterProps): JSX.Element => {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // State variables
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [customTokenId, setCustomTokenId] = useState<string>("");

  // Function to mint a new NFT
  const mintNFT = async () => {
    if (!account?.bech32Address || !client) {
      setMintError("Please connect your wallet first.");
      return;
    }

    setIsMinting(true);
    setMintError(null);
    setMintSuccess(false);
    
    try {
      // The mint message structure for CW721 contract standard
      const tokenIdToUse = customTokenId || `nft-${Date.now()}`;
      
      const mintMsg = {
        mint: {
          token_id: tokenIdToUse,
          owner: account.bech32Address,
          token_uri: null,
          extension: metadata
        }
      };

      // Execute the mint message
      const result = await client.execute(
        account.bech32Address, 
        contractAddress, 
        mintMsg, 
        "auto", 
        "Mint NFT"
      );

      console.log("Mint result:", result);
      
      // If successful, set the token ID and success state
      setTokenId(tokenIdToUse);
      setMintSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(tokenIdToUse);
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      
      // Check for authz-related errors
      const errorMessage = error instanceof Error ? error.message : "Failed to mint NFT. Please try again.";
      
      if (errorMessage.includes("failed to get grant") || 
          errorMessage.includes("authorization not found") ||
          errorMessage.includes("authz")) {
        setMintError(
          "Authorization error: You don't have permission to mint on this contract. " +
          "This might be because you're not the contract owner or haven't been granted minting privileges. " +
          "Try using a different wallet or contract."
        );
      } else {
        setMintError(errorMessage);
      }
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsMinting(false);
    }
  };

  if (!account?.bech32Address) {
    return (
      <div className={`nft-minter-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-gray-800/50 text-center">
          <p className="text-gray-400 mb-4">Please connect your wallet to mint NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`nft-minter-container ${className}`} style={style}>
      <div className="p-6 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Mint an NFT</h3>
        
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/40 rounded-md">
          <p className="text-xs text-gray-300 mb-2">
            <span className="text-yellow-300">Note:</span> Only contract owners or authorized accounts can mint NFTs on CW721 contracts.
            If you get an authorization error, you'll need to deploy your own contract or use a contract where you have minting privileges.
          </p>
          <p className="text-xs text-blue-300 mb-1">
            Using CW721 NFT contract:<br />
            <span className="font-mono text-blue-300 text-xs break-all">{contractAddress}</span>
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Custom Token ID (optional)</label>
          <input
            type="text"
            value={customTokenId}
            onChange={(e) => setCustomTokenId(e.target.value)}
            placeholder="Leave blank for auto-generated ID"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {mintSuccess && tokenId && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-md">
            <p className="text-green-300 font-medium">NFT minted successfully!</p>
            <p className="text-gray-400 text-sm mt-1">Token ID: <span className="text-blue-300 font-mono">{tokenId}</span></p>
          </div>
        )}
        
        {mintError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
            <p className="text-red-300">{mintError}</p>
          </div>
        )}

        <Button
          fullWidth
          onClick={mintNFT}
          disabled={isMinting}
          structure="base"
          className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-md hover:shadow-blue-500/20"
        >
          {isMinting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
              MINTING...
            </span>
          ) : (
            <span className="font-medium">MINT NFT</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NFTMinter;
