"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

export interface NFTAccessProps {
  /**
   * NFT contract address
   */
  contractAddress: string;
  /**
   * NFT token ID to check for ownership
   */
  tokenId: string;
  /**
   * Content to show if user has the required NFT
   */
  children: ReactNode;
  /**
   * Optional custom message when access is denied
   */
  accessDeniedMessage?: string;
  /**
   * Optional callback when NFT ownership is verified
   */
  onAccessGranted?: () => void;
  /**
   * Optional callback when NFT ownership check fails
   */
  onAccessDenied?: () => void;
  /**
   * Optional classNames for the container
   */
  className?: string;
  /**
   * Custom styles for the component
   */
  style?: React.CSSProperties;
}

export const NFTAccess = ({
  contractAddress,
  tokenId,
  children,
  accessDeniedMessage = "You need to own the required NFT to access this content",
  onAccessGranted,
  onAccessDenied,
  className = "",
  style,
}: NFTAccessProps): JSX.Element => {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // State variables
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Request tracking to prevent duplicate requests
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestCacheRef = useRef<{
    contractAddress: string;
    tokenId: string;
    timestamp: number;
  } | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Skip if a request is already in progress
    if (requestInProgress) {
      console.log("Request already in progress, skipping...");
      return;
    }
    
    // Check cache to avoid duplicate requests for the same parameters
    const cache = requestCacheRef.current;
    const now = Date.now();
    if (
      cache && 
      cache.contractAddress === contractAddress && 
      cache.tokenId === tokenId && 
      now - cache.timestamp < 5000 // 5 second cache
    ) {
      console.log("Using cached result, skipping request...");
      return;
    }

    // Reset states when inputs change
    setIsLoading(true);
    setHasAccess(false);
    setError(null);
    
    // Mark request as started
    setRequestInProgress(true);

    // Debounce the request to prevent rapid consecutive calls
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }

    requestTimeoutRef.current = setTimeout(async () => {
      await checkNFTOwnership();
      
      // Update cache
      requestCacheRef.current = {
        contractAddress,
        tokenId,
        timestamp: Date.now()
      };
      
      // Mark request as complete
      setRequestInProgress(false);
    }, 500); // 500ms debounce
    
  }, [account, client, contractAddress, tokenId]);

  const checkNFTOwnership = async () => {
    if (!account?.bech32Address || !client) {
      setIsLoading(false);
      return;
    }

    try {
      // Query for NFT ownership using CW721 standard
      const query = {
        owner_of: {
          token_id: tokenId,
        },
      };
      
      let isOwner = false;
      
      try {
        console.log(`Querying NFT ownership for contract: ${contractAddress}, token: ${tokenId}`);
        const result = await client.queryContractSmart(contractAddress, query);
        isOwner = result?.owner === account.bech32Address;
        
        // Log successful ownership check
        console.log("NFT ownership check result:", {
          tokenExists: true,
          owner: result?.owner,
          currentAddress: account.bech32Address,
          isOwner
        });
        
      } catch (queryError: any) {
        // If the query fails, it might be because the token doesn't exist yet
        console.log("NFT query error:", queryError);
        
        // Check for specific error types
        if (queryError.message?.includes("not found")) {
          setError(`NFT with token ID ${tokenId} does not exist in this contract.`);
        } else if (queryError.message?.includes("contract")) {
          setError(`Invalid contract address or contract is not a CW721 NFT contract.`);
        } else {
          // Generic error handling
          setError("Failed to verify NFT ownership. The token may not exist.");
        }
        
        isOwner = false;
      }
      
      setHasAccess(isOwner);
      
      // Call appropriate callback
      if (isOwner && onAccessGranted) {
        onAccessGranted();
      } else if (!isOwner && onAccessDenied) {
        onAccessDenied();
      }
    } catch (err) {
      console.error("Error checking NFT ownership:", err);
      setError("Failed to verify NFT ownership. Please try again.");
      if (onAccessDenied) onAccessDenied();
    } finally {
      setIsLoading(false);
    }
  };

  if (!account?.bech32Address) {
    return (
      <div className={`nft-access-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-gray-800/50 text-center">
          <p className="text-gray-400 mb-4">Please connect your wallet to verify access</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`nft-access-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-gray-800/50 text-center">
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
            <p className="text-gray-400">Verifying NFT ownership...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`nft-access-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-red-900/30 border border-red-800 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-red-400 mx-auto mb-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-red-300 font-medium mb-2">Verification Error</p>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button
            fullWidth
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setTimeout(() => window.location.reload(), 500);
            }}
            structure="base"
            className="bg-red-700/50 hover:bg-red-700/70 transition-all hover:shadow-md hover:shadow-red-500/20"
          >
            <span className="font-medium">Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={`nft-access-container ${className}`} style={style}>
        <div className="p-6 rounded-lg bg-gray-800/50 text-center">
          <div className="flex flex-col items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-amber-500 mb-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V5a3 3 0 00-3-3 3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3V5a3 3 0 00-3-3 3 3 0 00-3 3v6h-2z" 
              />
            </svg>
            <p className="text-amber-300 font-medium mb-2">Access Restricted</p>
            <p className="text-gray-400">{accessDeniedMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // User has the required NFT, show the protected content
  return (
    <div className={`nft-access-container ${className}`} style={style}>
      {children}
    </div>
  );
};

export default NFTAccess;
