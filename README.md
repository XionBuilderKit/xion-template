# XionBuilderKit

## Contract Information

This demo uses a real CW721 NFT contract on the Xion testnet:
- Contract Address: `xion1863vjkm2jgd6xe6gntr869y36g3md9kdex5h5hea5g79nxhxj9ms79tpxa`
- Code ID: 1164
- RPC Node: `https://rpc.xion-testnet-2.burnt.com:443`

## NFTDeployer Component

The `NFTDeployer` component provides a user interface for deploying new CW721 NFT contracts on the Xion blockchain. This component can be used to create your own NFT contracts with minting privileges.

### Usage

```tsx
import { NFTDeployer } from './components/NFTDeployer';

function App() {
  const handleDeploySuccess = (contractAddress) => {
    console.log('Contract deployed with address:', contractAddress);
    // Your logic after successful deployment
  };

  return (
    <div>
      <h1>My Xion App</h1>
      
      {/* NFT Contract Deployment UI */}
      <NFTDeployer 
        codeId="1164"
        onSuccess={handleDeploySuccess}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `codeId` | string | "1164" | The code ID for the CW721 contract on the network |
| `onSuccess` | function | undefined | Callback function when contract is deployed successfully, receives contractAddress as parameter |
| `onError` | function | undefined | Callback function when contract deployment fails, receives error as parameter |
| `className` | string | "" | Additional CSS classes to apply to container |
| `style` | object | undefined | Custom inline styles for the component |

### Notes

- The component requires the user to be connected to their wallet before deploying
- The component shows a loading state during the deployment process
- Error handling is built-in to handle failed deployment operations
- You can customize the contract name and symbol before deployment
- The connected wallet address will be set as the minter and admin of the contract

## XionLogin Component

The `XionLogin` component provides a reusable wallet connection interface for interacting with the Xion blockchain. This component can be easily integrated into your application as part of an SDK.

### Installation

Make sure you have the required dependencies:

```bash
npm install @burnt-labs/abstraxion @burnt-labs/ui
# or
yarn add @burnt-labs/abstraxion @burnt-labs/ui
# or
bun add @burnt-labs/abstraxion @burnt-labs/ui
```

### Usage

```tsx
import { XionLogin } from './components/XionLogin';

function App() {
  const handleConnect = (address) => {
    console.log('Connected with address:', address);
    // Your logic after successful connection
  };

  const handleDisconnect = () => {
    console.log('Disconnected');
    // Your logic after disconnection
  };

  return (
    <div>
      <h1>My Xion App</h1>
      <XionLogin
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `connectText` | string | "CONNECT WALLET" | Custom text for the connect button |
| `connectedText` | string | "CONNECTED" | Custom text shown when connected |
| `disconnectText` | string | "DISCONNECT" | Custom text for the disconnect button |
| `onConnect` | function | undefined | Callback function when user connects, receives address as parameter |
| `onDisconnect` | function | undefined | Callback function when user disconnects |
| `className` | string | "" | Additional CSS classes to apply to container |
| `showDisconnect` | boolean | true | Whether to show the disconnect button |
| `showAddress` | boolean | true | Whether to show the full address when connected |
| `style` | object | undefined | Custom inline styles for the component |

### Styling

The component uses Tailwind CSS for styling with sensible defaults, but you can customize its appearance using the `className` and `style` props.

## NFTMinter Component

The `NFTMinter` component provides a user interface for minting NFTs on the Xion blockchain. This component can be used to create and test NFT-gated experiences.

### Usage

```tsx
import { NFTMinter } from './components/NFTMinter';

function App() {
  const handleMintSuccess = (tokenId) => {
    console.log('NFT minted with token ID:', tokenId);
    // Your logic after successful minting
  };

  return (
    <div>
      <h1>My Xion App</h1>
      
      {/* NFT Minting UI */}
      <NFTMinter 
        contractAddress="xion1863vjkm2jgd6xe6gntr869y36g3md9kdex5h5hea5g79nxhxj9ms79tpxa"
        onSuccess={handleMintSuccess}
        metadata={{
          name: "My Test NFT",
          description: "A test NFT for demonstration purposes",
          image: "https://example.com/my-nft-image.jpg"
        }}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contractAddress` | string | required | The address of the NFT contract to mint on |
| `onSuccess` | function | undefined | Callback function when NFT is minted successfully, receives tokenId as parameter |
| `onError` | function | undefined | Callback function when NFT minting fails, receives error as parameter |
| `className` | string | "" | Additional CSS classes to apply to container |
| `style` | object | undefined | Custom inline styles for the component |
| `metadata` | object | { name: "Test NFT", description: "A test NFT for demonstration purposes", image: "https://placekitten.com/200/300" } | Custom metadata for the NFT |

### Notes

- The component requires the user to be connected to their wallet before minting
- The component shows a loading state during the minting process
- Error handling is built-in to handle failed minting operations
- Users can specify a custom token ID or have one auto-generated

## NFTAccess Component

The `NFTAccess` component provides a way to restrict content access to users who own a specific NFT. This component can be used to create NFT-gated experiences in your application.

### Usage

```tsx
import { NFTAccess } from './components/NFTAccess';

function App() {
  return (
    <div>
      <h1>My Xion App</h1>
      
      {/* NFT-gated content */}
      <NFTAccess 
        contractAddress="xion1863vjkm2jgd6xe6gntr869y36g3md9kdex5h5hea5g79nxhxj9ms79tpxa" 
        tokenId="1"
        accessDeniedMessage="You need to own the special NFT to view this content"
      >
        <div>
          <h2>Exclusive Content</h2>
          <p>This content is only visible to owners of the required NFT.</p>
        </div>
      </NFTAccess>
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contractAddress` | string | required | The address of the NFT contract |
| `tokenId` | string | required | The ID of the NFT token to check for ownership |
| `children` | ReactNode | required | The content to display when the user has access |
| `accessDeniedMessage` | string | "You need to own the required NFT to access this content" | Custom message when access is denied |
| `onAccessGranted` | function | undefined | Callback function when NFT ownership is verified |
| `onAccessDenied` | function | undefined | Callback function when NFT ownership check fails |
| `className` | string | "" | Additional CSS classes to apply to container |
| `style` | object | undefined | Custom inline styles for the component |

### Notes

- The component requires the user to be connected to their wallet before checking NFT ownership
- The component will display a loading state while verifying ownership
- Error handling is built-in to handle failed ownership checks
