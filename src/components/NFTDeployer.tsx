"use client";
import { useState } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

export interface NFTDeployerProps {
  /**
   * Code ID for the CW721 contract on the network
   */
  codeId: string;
  /**
   * Optional callback after successful contract deployment
   */
  onSuccess?: (contractAddress: string) => void;
  /**
   * Optional callback on deployment failure
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
}

export const NFTDeployer = ({
  codeId = "1164", // Default to the code ID provided
  onSuccess,
  onError,
  className = "",
  style,
}: NFTDeployerProps): JSX.Element => {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // State variables
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  
  // Form state
  const [contractName, setContractName] = useState<string>("My Test NFT Collection");
  const [symbol, setSymbol] = useState<string>("TEST");
  
  // Function to deploy a new NFT contract
  const deployContract = async () => {
    if (!account?.bech32Address || !client) {
      setDeployError("Please connect your wallet first.");
      return;
    }

    if (!contractName || !symbol) {
      setDeployError("Please fill in all required fields.");
      return;
    }

    setIsDeploying(true);
    setDeployError(null);
    setDeploySuccess(false);
    
    try {
      // Instantiate message for CW721 contract
      const instantiateMsg = {
        name: contractName,
        symbol: symbol,
        minter: account.bech32Address,
      };

      console.log("Instantiating contract with message:", instantiateMsg);
      
      // Instantiate the contract
      const result = await client.instantiate(
        account.bech32Address, 
        parseInt(codeId), 
        instantiateMsg, 
        `${contractName} - ${symbol}`, // Label
        "auto", 
        { admin: account.bech32Address } // Set the connected wallet as the admin
      );

      console.log("Contract deployment result:", result);
      
      // Extract the contract address from the result
      const newContractAddress = result.contractAddress;
      setContractAddress(newContractAddress);
      setDeploySuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(newContractAddress);
      }
    } catch (error) {
      console.error("Error deploying contract:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to deploy contract. Please try again.";
      setDeployError(errorMessage);
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsDeploying(false);
    }
  };

  if (!account?.bech32Address) {
    return (
      <div className={`nft-deployer-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-gray-800/50 text-center">
          <p className="text-gray-400 mb-4">Please connect your wallet to deploy a contract</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`nft-deployer-container ${className}`} style={style}>
      <div className="p-6 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Deploy Your Own NFT Contract</h3>
        
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/40 rounded-md">
          <p className="text-xs text-gray-300 mb-1">
            <span className="text-green-300">Tip:</span> Deploy your own NFT contract to gain minting privileges.
            This will deploy a new CW721 contract using code ID {codeId}.
          </p>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-400 mb-1">Collection Name</label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="My NFT Collection"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="NFT"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {deploySuccess && contractAddress && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-md">
            <p className="text-green-300 font-medium">NFT contract deployed successfully!</p>
            <p className="text-gray-400 text-sm mt-1">Contract Address: </p>
            <p className="text-blue-300 font-mono text-xs break-all">{contractAddress}</p>
            <p className="text-gray-400 text-xs mt-2">You are the owner of this contract and can mint NFTs on it.</p>
          </div>
        )}
        
        {deployError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
            <p className="text-red-300">{deployError}</p>
          </div>
        )}

        <Button
          fullWidth
          onClick={deployContract}
          disabled={isDeploying}
          structure="base"
          className="mt-2 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all hover:shadow-md hover:shadow-blue-500/20"
        >
          {isDeploying ? (
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
              DEPLOYING...
            </span>
          ) : (
            <span className="font-medium">DEPLOY CONTRACT</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NFTDeployer;
