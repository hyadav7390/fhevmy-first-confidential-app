import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TutorialStep from "@/components/TutorialStep";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code2, 
  Shield, 
  Settings, 
  Monitor, 
  Wallet, 
  Rocket,
  ExternalLink,
  AlertCircle
} from "lucide-react";

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TutorialStep
            title="Create a Plain Solidity Contract"
            description="We'll start by building a simple counter contract using standard Solidity. This will be our foundation before adding encryption."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Counter.sol
                </h3>
                <p className="text-muted-foreground mb-4">
                  First, let's create a simple counter contract that stores a value and allows incrementing it.
                </p>
                <CodeBlock
                  title="contracts/Counter.sol"
                  language="solidity"
                  code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint32 private counter;
    
    constructor() {
        counter = 0;
    }
    
    function increment() public {
        counter = counter + 1;
    }
    
    function getCounter() public view returns (uint32) {
        return counter;
    }
    
    function addToCounter(uint32 value) public {
        counter = counter + value;
    }`}
                />
              </div>

              <Card className="bg-muted/30 border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Understanding the Basics</h4>
                      <p className="text-sm text-muted-foreground">
                        This is a standard Solidity contract with a private counter variable. Notice how we use 
                        <code className="bg-code-bg px-1 py-0.5 rounded text-accent mx-1">uint32</code> which will 
                        be important when we convert to FHEVM's encrypted types.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h4 className="font-medium text-foreground mb-3">Key Concepts</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Private state:</strong> The counter value is stored privately in the contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Public functions:</strong> Methods to interact with the counter value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Type safety:</strong> Using uint32 for consistent data types</span>
                  </li>
                </ul>
              </div>
            </div>
          </TutorialStep>
        );

      case 2:
        return (
          <TutorialStep
            title="Convert to FHEVM"
            description="Now we'll transform our contract to use FHEVM's encrypted types. This enables confidential computation while maintaining the same functionality."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  EncryptedCounter.sol
                </h3>
                <p className="text-muted-foreground mb-4">
                  Here's the same contract converted to use FHEVM's encrypted types. Notice how similar it looks!
                </p>
                <CodeBlock
                  title="contracts/EncryptedCounter.sol"
                  language="solidity"
                  code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";

contract EncryptedCounter {
    euint32 private counter;
    
    constructor() {
        counter = TFHE.asEuint32(0);
        TFHE.allow(counter, address(this));
    }
    
    function increment() public {
        counter = TFHE.add(counter, TFHE.asEuint32(1));
    }
    
    function getCounter(bytes32 publicKey, bytes calldata signature) 
        public 
        view 
        returns (bytes memory) 
    {
        TFHE.allowThis(counter);
        return TFHE.decrypt(counter, publicKey);
    }
    
    function addToCounter(bytes calldata encryptedValue) public {
        euint32 value = TFHE.asEuint32(encryptedValue);
        counter = TFHE.add(counter, value);
    }`}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Key Changes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">uint32</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">euint32</code>
                      <p className="text-xs text-muted-foreground mt-1">Encrypted 32-bit integer</p>
                    </div>
                    <div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">+</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">TFHE.add()</code>
                      <p className="text-xs text-muted-foreground mt-1">Encrypted addition</p>
                    </div>
                    <div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">return value</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">TFHE.decrypt()</code>
                      <p className="text-xs text-muted-foreground mt-1">Controlled decryption</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Privacy Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span>Counter value stays encrypted on-chain</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span>Computations happen on encrypted data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span>Only authorized parties can decrypt</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/30 border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Important Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        The <code className="bg-code-bg px-1 py-0.5 rounded text-accent">TFHE.allow()</code> function 
                        grants permission for the contract to access the encrypted value. The 
                        <code className="bg-code-bg px-1 py-0.5 rounded text-accent mx-1">getCounter</code> function 
                        now requires a public key and signature for secure decryption.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TutorialStep>
        );

      case 3:
        return (
          <TutorialStep
            title="Configure Hardhat for FHEVM"
            description="Set up your development environment with Hardhat configured for FHEVM compilation and deployment."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Project Setup
                </h3>
                <p className="text-muted-foreground mb-4">
                  Let's set up a Hardhat project with FHEVM support. Start by initializing your project:
                </p>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`mkdir fhevm-tutorial
cd fhevm-tutorial
npm init -y
npm install --save-dev hardhat
npx hardhat init`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Install FHEVM Dependencies</h4>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`npm install fhevm
npm install --save-dev @nomicfoundation/hardhat-toolbox`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Configure Hardhat</h4>
                <p className="text-muted-foreground mb-4">
                  Update your <code className="bg-code-bg px-1 py-0.5 rounded text-accent">hardhat.config.js</code> file:
                </p>
                <CodeBlock
                  title="hardhat.config.js"
                  language="javascript"
                  code={`require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    zama: {
      url: "https://devnet.zama.ai/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
    },
    localfhevm: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
      chainId: 31337,
    },
  },
};`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Environment Variables</h4>
                <p className="text-muted-foreground mb-4">
                  Create a <code className="bg-code-bg px-1 py-0.5 rounded text-accent">.env</code> file:
                </p>
                <CodeBlock
                  title=".env"
                  language="bash"
                  code={`# Your private key for deployment (keep this secret!)
PRIVATE_KEY=your_private_key_here

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key`}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-success" />
                      Network Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div><strong className="text-foreground">Zama Devnet:</strong> Public testnet for development</div>
                    <div><strong className="text-foreground">Local FHEVM:</strong> Run locally for faster testing</div>
                    <div><strong className="text-foreground">Mainnet:</strong> Production deployment (coming soon)</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>✅ Hardhat configured for FHEVM</div>
                    <div>✅ Network endpoints set up</div>
                    <div>✅ Ready to compile and deploy</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TutorialStep>
        );

      case 4:
        return (
          <TutorialStep
            title="Create React Frontend"
            description="Build a modern React application that will serve as the user interface for your FHEVM dApp."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Frontend Setup
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create a React application with Vite for fast development:
                </p>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`cd ..
npm create vite@latest fhevm-frontend -- --template react-ts
cd fhevm-frontend
npm install`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Install Required Dependencies</h4>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`npm install fhevmjs ethers
npm install @tanstack/react-query
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Basic App Component</h4>
                <p className="text-muted-foreground mb-4">
                  Create a clean interface for interacting with your contract:
                </p>
                <CodeBlock
                  title="src/App.tsx"
                  language="typescript"
                  code={`import { useState, useEffect } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import { initFhevm, createInstance } from 'fhevmjs'

const CONTRACT_ADDRESS = 'your-contract-address-here'
const CONTRACT_ABI = [
  'function increment() public',
  'function getCounter(bytes32 publicKey, bytes calldata signature) public view returns (bytes memory)',
  'function addToCounter(bytes calldata encryptedValue) public'
]

function App() {
  const [counter, setCounter] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    initFhevm().then(() => {
      console.log('FHEVM initialized')
    })
  }, [])

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setConnected(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const incrementCounter = async () => {
    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      const tx = await contract.increment()
      await tx.wait()
      
      console.log('Counter incremented!')
    } catch (error) {
      console.error('Error incrementing counter:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          FHEVM Counter dApp
        </h1>
        
        {!connected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">Current Counter:</p>
              <p className="text-3xl font-bold">
                {counter !== null ? counter : '???'}
              </p>
            </div>
            
            <button
              onClick={incrementCounter}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Increment Counter'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App`}
                />
              </div>

              <Card className="bg-muted/30 border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Important Setup Notes</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Replace <code className="bg-code-bg px-1 py-0.5 rounded text-accent">CONTRACT_ADDRESS</code> with your deployed contract address</li>
                        <li>• The <code className="bg-code-bg px-1 py-0.5 rounded text-accent">fhevmjs</code> library handles encryption/decryption on the frontend</li>
                        <li>• Counter value will show as "???" initially due to encryption</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TutorialStep>
        );

      case 5:
        return (
          <TutorialStep
            title="Add Wallet Integration with Wagmi"
            description="Implement robust wallet connectivity using Wagmi for a professional Web3 user experience."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Wagmi Setup
                </h3>
                <p className="text-muted-foreground mb-4">
                  Install and configure Wagmi for professional wallet integration:
                </p>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`npm install wagmi viem @tanstack/react-query
npm install @wagmi/core @wagmi/connectors`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Configure Wagmi</h4>
                <p className="text-muted-foreground mb-4">
                  Set up your Wagmi configuration:
                </p>
                <CodeBlock
                  title="src/wagmi.ts"
                  language="typescript"
                  code={`import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// Define Zama testnet
const zamaTestnet = {
  id: 8009,
  name: 'Zama Devnet',
  network: 'zama',
  nativeCurrency: {
    decimals: 18,
    name: 'ZAMA',
    symbol: 'ZAMA',
  },
  rpcUrls: {
    public: { http: ['https://devnet.zama.ai/'] },
    default: { http: ['https://devnet.zama.ai/'] },
  },
  blockExplorers: {
    etherscan: { name: 'Zama Explorer', url: 'https://main.explorer.zama.ai' },
    default: { name: 'Zama Explorer', url: 'https://main.explorer.zama.ai' },
  },
}

export const config = createConfig({
  chains: [mainnet, sepolia, zamaTestnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ 
      projectId: 'your-walletconnect-project-id' 
    }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [zamaTestnet.id]: http(),
  },
})`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Update Main App</h4>
                <CodeBlock
                  title="src/main.tsx"
                  language="typescript"
                  code={`import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Enhanced App with Wagmi</h4>
                <CodeBlock
                  title="src/App.tsx"
                  language="typescript"
                  code={`import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { initFhevm, createInstance } from 'fhevmjs'

const CONTRACT_ADDRESS = '0x...' // Your contract address
const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'increment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // ... other ABI entries
] as const

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const [counter, setCounter] = useState<number | null>(null)

  useEffect(() => {
    initFhevm().then(() => {
      console.log('FHEVM initialized')
    })
  }, [])

  const handleIncrement = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'increment',
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Connect Your Wallet
          </h1>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FHEVM Counter</h1>
          <button
            onClick={() => disconnect()}
            className="text-red-500 hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">Encrypted Counter:</p>
            <p className="text-3xl font-bold">
              {counter !== null ? counter : '🔒'}
            </p>
          </div>
          
          <button
            onClick={handleIncrement}
            disabled={isPending || isConfirming}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isPending ? 'Signing...' : 
             isConfirming ? 'Confirming...' : 
             'Increment Counter'}
          </button>
          
          {isConfirmed && (
            <div className="text-green-600 text-center">
              Transaction confirmed!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App`}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-success" />
                      Wagmi Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>✅ Multi-wallet support</div>
                    <div>✅ Automatic transaction tracking</div>
                    <div>✅ Type-safe contract interactions</div>
                    <div>✅ Built-in loading states</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Security Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>🔒 Secure wallet connections</div>
                    <div>🔒 Transaction validation</div>
                    <div>🔒 Network verification</div>
                    <div>🔒 Error handling</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TutorialStep>
        );

      case 6:
        return (
          <TutorialStep
            title="Deploy Your Complete dApp"
            description="Bring everything together by deploying your smart contract and connecting it to your frontend for a fully functional confidential application."
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            isCompleted={true}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-success" />
                  Final Deployment
                </h3>
                <p className="text-muted-foreground mb-4">
                  Deploy your smart contract to Zama's testnet and connect everything together:
                </p>
                <CodeBlock
                  title="Terminal"
                  language="bash"
                  code={`# Deploy to Zama testnet
npx hardhat run scripts/deploy.js --network zama

# Note the contract address from deployment output
# Contract deployed to: 0x...`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Deployment Script</h4>
                <CodeBlock
                  title="scripts/deploy.js"
                  language="javascript"
                  code={`const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()
  
  console.log("Deploying contract with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  const EncryptedCounter = await ethers.getContractFactory("EncryptedCounter")
  const contract = await EncryptedCounter.deploy()
  
  await contract.deployed()
  
  console.log("EncryptedCounter deployed to:", contract.address)
  console.log("Transaction hash:", contract.deployTransaction.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })`}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Complete Integration</h4>
                <p className="text-muted-foreground mb-4">
                  Here's the final version with full FHEVM integration:
                </p>
                <CodeBlock
                  title="src/App.tsx (Final)"
                  language="typescript"
                  code={`import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from 'wagmi'
import { initFhevm, createInstance } from 'fhevmjs'

const CONTRACT_ADDRESS = '0x...' // Your deployed contract address

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract, isPending } = useWriteContract()
  
  const [fhevmInstance, setFhevmInstance] = useState(null)
  const [encryptedCounter, setEncryptedCounter] = useState(null)

  useEffect(() => {
    initFhevm().then(async () => {
      if (window.ethereum && isConnected) {
        const instance = await createInstance({ 
          chainId: 8009,
          publicKeyOrAddress: CONTRACT_ADDRESS 
        })
        setFhevmInstance(instance)
      }
    })
  }, [isConnected])

  const handleIncrement = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'increment',
    })
  }

  const addEncryptedValue = async () => {
    if (!fhevmInstance) return
    
    const encryptedAmount = fhevmInstance.encrypt32(5) // Encrypt the number 5
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'addToCounter',
      args: [encryptedAmount],
    })
  }

  // ... rest of component with enhanced UI

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔒 Confidential Counter
        </h1>
        
        {isConnected ? (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Encrypted Counter Value</p>
              <div className="text-4xl font-bold text-gray-800">
                🔐 Private
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Value is encrypted on-chain
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleIncrement}
                disabled={isPending}
                className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? '⏳' : '+1'}
              </button>
              
              <button
                onClick={addEncryptedValue}
                disabled={isPending || !fhevmInstance}
                className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? '⏳' : '+5'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => disconnect()}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">
              Connect your wallet to start using the confidential counter
            </p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App`}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-success" />
                      Deployed!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>✅ Smart contract on-chain</div>
                    <div>✅ Frontend connected</div>
                    <div>✅ Full confidentiality</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div>• Add more complex logic</div>
                    <div>• Implement access controls</div>
                    <div>• Build advanced UIs</div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-accent" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <a href="https://docs.zama.ai" className="text-accent hover:underline block">
                      📖 Full Documentation
                    </a>
                    <a href="https://github.com/zama-ai" className="text-accent hover:underline block">
                      💻 GitHub Examples
                    </a>
                    <a href="https://discord.gg/zama" className="text-accent hover:underline block">
                      💬 Discord Community
                    </a>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Congratulations! 🎉</h3>
                  <p className="mb-4">
                    You've successfully built and deployed your first confidential dApp using FHEVM. 
                    Your application can now perform private computations on encrypted data!
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      asChild 
                      variant="secondary"
                      className="bg-white/10 border-white/20 hover:bg-white/20"
                    >
                      <a href="https://docs.zama.ai" target="_blank" rel="noopener noreferrer">
                        Explore Advanced Features
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TutorialStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="container mx-auto px-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default Tutorial;
