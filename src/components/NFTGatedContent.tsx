"use client";
import { ReactNode, useState } from "react";
import NFTAccess from "./NFTAccess";

export interface NFTGatedContentProps {
  /**
   * NFT contract address to check ownership against
   */
  contractAddress: string;
  
  /**
   * NFT token ID to verify ownership
   */
  tokenId: string;
  
  /**
   * Content to render when the user owns the NFT
   */
  children: ReactNode;
  
  /**
   * Custom message to display when access is denied
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
   * Additional CSS classes to apply to the container
   */
  className?: string;
  
  /**
   * Optional custom loading message
   */
  loadingMessage?: string;
  
  /**
   * Whether to show a fallback UI when access is denied
   */
  showDeniedUI?: boolean;
  
  /**
   * Optional fallback content to render when access is denied
   */
  fallbackContent?: ReactNode;
}

/**
 * NFTGatedContent component
 * 
 * A wrapper component that verifies NFT ownership before displaying content.
 * This component uses the NFTAccess component internally but provides a cleaner API
 * and better control over the rendering process.
 * 
 * Example usage:
 * 
 * ```tsx
 * <NFTGatedContent 
 *   contractAddress="xion1..." 
 *   tokenId="1"
 *   accessDeniedMessage="You need to own this NFT to access premium content"
 * >
 *   <h1>Premium Content</h1>
 *   <p>This content is only accessible to NFT owners</p>
 * </NFTGatedContent>
 * ```
 */
const NFTGatedContent = ({
  contractAddress,
  tokenId,
  children,
  accessDeniedMessage = "You need to own the required NFT to access this content",
  onAccessGranted,
  onAccessDenied,
  className = "",
  loadingMessage = "Verifying NFT ownership...",
  showDeniedUI = true,
  fallbackContent,
}: NFTGatedContentProps): JSX.Element => {
  // Track if we want to show a loading state
  const [isCheckingAccess] = useState<boolean>(true);

  // Custom handler for access granted
  const handleAccessGranted = () => {
    console.log("NFT Access granted for token:", tokenId);
    if (onAccessGranted) onAccessGranted();
  };

  // Custom handler for access denied
  const handleAccessDenied = () => {
    console.log("NFT Access denied for token:", tokenId);
    if (onAccessDenied) onAccessDenied();
  };

  return (
    <div className={`nft-gated-content ${className}`}>
      <NFTAccess
        contractAddress={contractAddress}
        tokenId={tokenId}
        accessDeniedMessage={accessDeniedMessage}
        onAccessGranted={handleAccessGranted}
        onAccessDenied={handleAccessDenied}
        className=""
      >
        {/* Content that is shown when access is verified */}
        {children}
      </NFTAccess>
    </div>
  );
};

export default NFTGatedContent;
