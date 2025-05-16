# XionBuilderKit
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
