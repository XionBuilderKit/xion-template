"use client";
import { useState, useEffect } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";

export interface XionLoginProps {
  /**
   * Optional custom button text for connect state
   */
  connectText?: string;
  /**
   * Optional custom button text for connected state
   */
  connectedText?: string;
  /**
   * Optional custom button text for disconnect button
   */
  disconnectText?: string;
  /**
   * Optional callback when user successfully connects
   */
  onConnect?: (address: string) => void;
  /**
   * Optional callback when user disconnects
   */
  onDisconnect?: () => void;
  /**
   * Optional classNames for the container
   */
  className?: string;
  /**
   * Show disconnect button when connected
   */
  showDisconnect?: boolean;
  /**
   * Show full address when connected
   */
  showAddress?: boolean;
  /**
   * Custom styles for the component
   */
  style?: React.CSSProperties;
}

export const XionLogin = ({
  connectText = "CONNECT WALLET",
  connectedText = "CONNECTED",
  disconnectText = "DISCONNECT",
  onConnect,
  onDisconnect,
  className = "",
  showDisconnect = true,
  showAddress = true,
  style,
}: XionLoginProps): JSX.Element => {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client, logout } = useAbstraxionSigningClient();

  // State variables
  const [loading, setLoading] = useState(false);
  const [, setShowModal] = useModal();

  // Handle connection callbacks
  useEffect(() => {
    if (account?.bech32Address && onConnect) {
      onConnect(account.bech32Address);
    }
  }, [account, onConnect]);

  // Handle disconnect
  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await logout?.();
      if (onDisconnect) onDisconnect();
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`xion-login-container ${className}`} style={style}>
      <div className="xion-button-container flex flex-col gap-2">
        <Button
          fullWidth
          onClick={() => setShowModal(true)}
          structure="base"
          className="transition-all hover:shadow-md hover:shadow-blue-500/20"
        >
          {account?.bech32Address ? (
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-medium">{connectedText}</span>
              {showAddress && (
                <span className="mt-1 text-xs truncate max-w-[240px]">
                  {account.bech32Address}
                </span>
              )}
            </div>
          ) : (
            <span className="font-medium">{connectText}</span>
          )}
        </Button>

        {client && logout && showDisconnect && (
          <Button
            disabled={loading}
            fullWidth
            onClick={handleDisconnect}
            structure="base"
            className="mt-4 border border-red-800 bg-red-900/70 text-white transition-all hover:bg-red-800 hover:shadow-md hover:shadow-red-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
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
                PROCESSING
              </span>
            ) : (
              disconnectText
            )}
          </Button>
        )}
      </div>

      <Abstraxion onClose={() => setShowModal(false)} />
    </div>
  );
};

export default XionLogin;
