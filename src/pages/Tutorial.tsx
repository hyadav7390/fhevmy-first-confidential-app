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
                  Project Setup & Smart Contract
                </h3>
                <p className="text-muted-foreground mb-4">
                  Let's start by setting up a new project and creating a simple counter contract. This will help you understand the basics before we add encryption.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 1: Initialize Your Project</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Create a new directory for your project
mkdir fhevm-counter-dapp
cd fhevm-counter-dapp

# Initialize a new Node.js project
npm init -y

# Install Hardhat development framework
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat init`}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    When prompted, select "Create a JavaScript project" and follow the default options.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 2: Create the Counter Contract</h4>
                  <p className="text-muted-foreground mb-3">
                    Create a new file <code className="bg-code-bg px-1 py-0.5 rounded text-accent">contracts/Counter.sol</code> and add the following code:
                  </p>
                  <CodeBlock
                    title="contracts/Counter.sol"
                    language="solidity"
                    code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Counter
 * @dev A simple counter contract that demonstrates basic Solidity concepts
 * This will be converted to use FHEVM encrypted types in the next step
 */
contract Counter {
    // State variable to store the counter value
    uint32 private counter;
    
    // Event emitted when counter is incremented
    event CounterIncremented(uint32 newValue);
    event CounterAdded(uint32 addedValue, uint32 newTotal);
    
    /**
     * @dev Constructor sets the initial counter value to 0
     */
    constructor() {
        counter = 0;
    }
    
    /**
     * @dev Increments the counter by 1
     * Emits CounterIncremented event
     */
    function increment() public {
        counter = counter + 1;
        emit CounterIncremented(counter);
    }
    
    /**
     * @dev Returns the current counter value
     * @return The current counter value
     */
    function getCounter() public view returns (uint32) {
        return counter;
    }
    
    /**
     * @dev Adds a specific value to the counter
     * @param value The value to add to the counter
     */
    function addToCounter(uint32 value) public {
        require(value > 0, "Value must be greater than 0");
        uint32 oldValue = counter;
        counter = counter + value;
        emit CounterAdded(value, counter);
    }
    
    /**
     * @dev Resets the counter to 0 (for testing purposes)
     */
    function resetCounter() public {
        counter = 0;
        emit CounterIncremented(0);
    }
}`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Contract Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">State Storage:</strong>
                        <span className="text-muted-foreground"> Private counter variable</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Events:</strong>
                        <span className="text-muted-foreground"> Track state changes</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Input validation:</strong>
                        <span className="text-muted-foreground"> Require statements for safety</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Why uint32?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">FHEVM Support:</strong>
                        <span className="text-muted-foreground"> Direct mapping to euint32</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Efficiency:</strong>
                        <span className="text-muted-foreground"> Optimal for encryption operations</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Range:</strong>
                        <span className="text-muted-foreground"> 0 to 4,294,967,295</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Step 3: Test Your Contract</h4>
                <p className="text-muted-foreground mb-3">
                  Create a test to ensure your contract works correctly:
                </p>
                <CodeBlock
                  title="test/Counter.js"
                  language="javascript"
                  code={`const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.deployed();
  });

  it("Should start with counter at 0", async function () {
    expect(await counter.getCounter()).to.equal(0);
  });

  it("Should increment counter", async function () {
    await counter.increment();
    expect(await counter.getCounter()).to.equal(1);
  });

  it("Should add value to counter", async function () {
    await counter.addToCounter(5);
    expect(await counter.getCounter()).to.equal(5);
  });

  it("Should emit events", async function () {
    await expect(counter.increment())
      .to.emit(counter, "CounterIncremented")
      .withArgs(1);
  });
});`}
                />
                <div className="mt-3">
                  <CodeBlock
                    title="Run the test"
                    language="bash"
                    code={`npx hardhat test`}
                  />
                </div>
              </div>

              <Card className="bg-success/5 border-success/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">✅ What You've Accomplished</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Created a fully functional Solidity smart contract</li>
                        <li>• Implemented state management with proper data types</li>
                        <li>• Added event emission for frontend integration</li>
                        <li>• Created comprehensive tests to verify functionality</li>
                        <li>• Prepared the foundation for FHEVM encryption</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  Understanding FHEVM Encryption
                </h3>
                <p className="text-muted-foreground mb-4">
                  FHEVM (Fully Homomorphic Encryption Virtual Machine) allows you to perform computations on encrypted data without decrypting it. Let's see how this transforms our contract.
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 1: Install FHEVM Library</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Install the FHEVM library for your smart contracts
npm install fhevm

# The library provides encrypted data types and operations
# euint8, euint16, euint32, euint64, ebool, eaddress`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 2: Create the Encrypted Counter</h4>
                  <p className="text-muted-foreground mb-3">
                    Create <code className="bg-code-bg px-1 py-0.5 rounded text-accent">contracts/EncryptedCounter.sol</code>:
                  </p>
                  <CodeBlock
                    title="contracts/EncryptedCounter.sol"
                    language="solidity"
                    code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import TFHE library for encrypted operations
import "fhevm/lib/TFHE.sol";

/**
 * @title EncryptedCounter
 * @dev A counter contract using FHEVM encrypted types
 * Demonstrates confidential on-chain computations
 */
contract EncryptedCounter {
    // Encrypted 32-bit integer instead of regular uint32
    euint32 private counter;
    
    // Owner address for access control
    address public owner;
    
    // Events for tracking operations (values remain encrypted)
    event CounterIncremented(address indexed user);
    event CounterAdded(address indexed user);
    event CounterDecrypted(address indexed user);
    
    /**
     * @dev Constructor initializes encrypted counter to 0
     */
    constructor() {
        // Convert plaintext 0 to encrypted euint32
        counter = TFHE.asEuint32(0);
        
        // Grant permission for this contract to access the encrypted value
        TFHE.allow(counter, address(this));
        
        // Set contract deployer as owner
        owner = msg.sender;
    }
    
    /**
     * @dev Increments the encrypted counter by 1
     * All operations happen on encrypted data
     */
    function increment() public {
        // Create encrypted value of 1
        euint32 one = TFHE.asEuint32(1);
        
        // Perform encrypted addition: counter = counter + 1
        counter = TFHE.add(counter, one);
        
        // Allow this contract to access the new encrypted value
        TFHE.allow(counter, address(this));
        
        emit CounterIncremented(msg.sender);
    }
    
    /**
     * @dev Adds an encrypted value to the counter
     * @param encryptedValue Encrypted input from frontend
     */
    function addToCounter(bytes calldata encryptedValue) public {
        // Convert encrypted bytes to euint32
        euint32 value = TFHE.asEuint32(encryptedValue);
        
        // Perform encrypted addition
        counter = TFHE.add(counter, value);
        
        // Update permissions
        TFHE.allow(counter, address(this));
        
        emit CounterAdded(msg.sender);
    }
    
    /**
     * @dev Decrypts and returns the counter value
     * @param publicKey Public key for decryption
     * @param signature Signature for authorization
     * @return Encrypted bytes that can be decrypted on frontend
     */
    function getCounter(
        bytes32 publicKey, 
        bytes calldata signature
    ) public view returns (bytes memory) {
        // Verify the signature (simplified for tutorial)
        // In production, implement proper signature verification
        
        // Grant temporary permission for decryption
        TFHE.allowThis(counter);
        
        // Return encrypted result that frontend can decrypt
        return TFHE.decrypt(counter, publicKey);
    }
    
    /**
     * @dev Alternative: Get encrypted counter for computation
     * @return Encrypted counter value for further operations
     */
    function getEncryptedCounter() public view returns (euint32) {
        return counter;
    }
    
    /**
     * @dev Resets counter to 0 (only owner)
     */
    function resetCounter() public {
        require(msg.sender == owner, "Only owner can reset");
        
        counter = TFHE.asEuint32(0);
        TFHE.allow(counter, address(this));
    }
    
    /**
     * @dev Compare counter with a value (demonstrates encrypted comparison)
     * @param encryptedValue Value to compare against
     * @return Encrypted boolean result
     */
    function isCounterGreater(bytes calldata encryptedValue) 
        public 
        view 
        returns (ebool) 
    {
        euint32 value = TFHE.asEuint32(encryptedValue);
        return TFHE.gt(counter, value);
    }
}`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Key Transformations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-primary/20 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground mb-1">Data Types</div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">uint32</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">euint32</code>
                    </div>
                    <div className="border border-primary/20 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground mb-1">Operations</div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">a + b</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">TFHE.add(a, b)</code>
                    </div>
                    <div className="border border-primary/20 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground mb-1">Comparisons</div>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">a &gt; b</code>
                      <span className="text-sm text-muted-foreground mx-2">→</span>
                      <code className="bg-code-bg px-2 py-1 rounded text-accent text-sm">TFHE.gt(a, b)</code>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      TFHE Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">TFHE.asEuint32():</strong>
                      <span className="text-muted-foreground"> Convert plaintext to encrypted</span>
                    </div>
                    <div>
                      <strong className="text-foreground">TFHE.add():</strong>
                      <span className="text-muted-foreground"> Encrypted addition</span>
                    </div>
                    <div>
                      <strong className="text-foreground">TFHE.allow():</strong>
                      <span className="text-muted-foreground"> Grant access permissions</span>
                    </div>
                    <div>
                      <strong className="text-foreground">TFHE.decrypt():</strong>
                      <span className="text-muted-foreground"> Controlled decryption</span>
                    </div>
                    <div>
                      <strong className="text-foreground">TFHE.gt():</strong>
                      <span className="text-muted-foreground"> Encrypted comparison</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Step 3: Understanding the Encryption Flow</h4>
                <Card className="bg-gradient-card border-card-border">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-primary font-bold">1</span>
                        </div>
                        <h5 className="font-medium text-foreground mb-2">Frontend Encryption</h5>
                        <p className="text-sm text-muted-foreground">
                          User input is encrypted using fhevmjs before sending to contract
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-accent font-bold">2</span>
                        </div>
                        <h5 className="font-medium text-foreground mb-2">Encrypted Computation</h5>
                        <p className="text-sm text-muted-foreground">
                          Smart contract performs operations on encrypted data
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-success font-bold">3</span>
                        </div>
                        <h5 className="font-medium text-foreground mb-2">Controlled Decryption</h5>
                        <p className="text-sm text-muted-foreground">
                          Results are decrypted only when authorized and requested
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">🔒 Privacy Guarantees</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Data Privacy:</strong> Counter value never appears in plaintext on-chain</li>
                        <li>• <strong>Computation Privacy:</strong> Intermediate values remain encrypted</li>
                        <li>• <strong>Access Control:</strong> Only authorized parties can decrypt results</li>
                        <li>• <strong>Input Privacy:</strong> User inputs are encrypted before submission</li>
                        <li>• <strong>Pattern Privacy:</strong> Transaction patterns don't reveal values</li>
                      </ul>
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
                  Complete Hardhat Configuration
                </h3>
                <p className="text-muted-foreground mb-4">
                  Configure Hardhat specifically for FHEVM development with proper network settings, compilation options, and deployment scripts.
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 1: Install FHEVM Dependencies</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Install FHEVM core library
npm install fhevm

# Install Hardhat and essential plugins
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev dotenv

# Install additional utilities
npm install --save-dev @openzeppelin/contracts`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 2: Configure Hardhat Settings</h4>
                  <p className="text-muted-foreground mb-3">
                    Update your <code className="bg-code-bg px-1 py-0.5 rounded text-accent">hardhat.config.js</code> with FHEVM-specific settings:
                  </p>
                  <CodeBlock
                    title="hardhat.config.js"
                    language="javascript"
                    code={`require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      // FHEVM requires specific EVM version
      evmVersion: "cancun",
    },
  },
  networks: {
    // Zama's official devnet
    zama: {
      url: "https://devnet.zama.ai/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
      gasPrice: 1000000000, // 1 gwei
      // Increase gas limit for FHEVM operations
      gas: 10000000,
    },
    // Local FHEVM node (for development)
    localfhevm: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
      chainId: 31337,
      gas: 10000000,
    },
    // Hardhat network with FHEVM simulation
    hardhat: {
      chainId: 31337,
      gas: 10000000,
      gasPrice: 1000000000,
    },
  },
  // Contract verification settings
  etherscan: {
    apiKey: {
      zama: process.env.ZAMA_API_KEY || "dummy",
    },
    customChains: [
      {
        network: "zama",
        chainId: 8009,
        urls: {
          apiURL: "https://main.explorer.zama.ai/api",
          browserURL: "https://main.explorer.zama.ai",
        },
      },
    ],
  },
  // Gas reporting for optimization
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // Test configuration
  mocha: {
    timeout: 120000, // 2 minutes for FHEVM operations
  },
};`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 3: Environment Configuration</h4>
                  <CodeBlock
                    title=".env"
                    language="bash"
                    code={`# =================================
# FHEVM Tutorial Environment Setup
# =================================

# Wallet Configuration
PRIVATE_KEY=your_private_key_here_without_0x_prefix
MNEMONIC="your twelve word mnemonic phrase here"

# Network Configuration
ZAMA_DEVNET_URL=https://devnet.zama.ai/
ZAMA_API_KEY=your_zama_api_key_here

# Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Development Settings
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_key

# Security Note: Never commit this file to version control!
# Add .env to your .gitignore file`}
                  />
                  <Card className="bg-warning/5 border-warning/20 mt-3">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <strong>Security:</strong> Never commit your .env file. Add it to .gitignore immediately!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 4: Create Deployment Script</h4>
                  <CodeBlock
                    title="scripts/deploy.js"
                    language="javascript"
                    code={`const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting FHEVM contract deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  
  console.log("📝 Deployer address:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  
  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "| Chain ID:", network.chainId.toString());
  
  try {
    // Deploy the EncryptedCounter contract
    console.log("📦 Deploying EncryptedCounter contract...");
    const EncryptedCounter = await ethers.getContractFactory("EncryptedCounter");
    
    // Estimate deployment gas
    const deploymentData = EncryptedCounter.interface.encodeDeploy([]);
    const estimatedGas = await ethers.provider.estimateGas({
      data: deploymentData,
    });
    console.log("⛽ Estimated gas for deployment:", estimatedGas.toString());
    
    // Deploy with explicit gas settings for FHEVM
    const contract = await EncryptedCounter.deploy({
      gasLimit: 5000000, // Increased for FHEVM operations
    });
    
    console.log("⏳ Waiting for deployment transaction...");
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log("✅ EncryptedCounter deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🔗 Transaction hash:", contract.deploymentTransaction().hash);
    
    // Verify the deployment
    console.log("🔍 Verifying contract state...");
    const owner = await contract.owner();
    console.log("👤 Contract owner:", owner);
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      network: network.name,
      chainId: network.chainId.toString(),
      transactionHash: contract.deploymentTransaction().hash,
      blockNumber: contract.deploymentTransaction().blockNumber,
      timestamp: new Date().toISOString(),
    };
    
    console.log("💾 Deployment Summary:");
    console.table(deploymentInfo);
    
    // Instructions for next steps
    console.log("\\n🎉 Deployment Complete!");
    console.log("\\n📋 Next Steps:");
    console.log("1. Update your frontend with the contract address:", contractAddress);
    console.log("2. Fund your deployer wallet for transaction fees");
    console.log("3. Test the contract functions");
    
    return contractAddress;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Execute deployment
main()
  .then((address) => {
    console.log("\\n🏁 Deployment script completed successfully!");
    console.log("Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Deployment script failed:", error);
    process.exit(1);
  });`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 5: Test Compilation</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Compile your FHEVM contract
npx hardhat compile

# Expected output:
# Compiled 1 Solidity file successfully

# Run the deployment script
npx hardhat run scripts/deploy.js --network zama`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4 text-success" />
                      Zama Devnet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <div><strong>Chain ID:</strong> 8009</div>
                    <div><strong>RPC:</strong> devnet.zama.ai</div>
                    <div><strong>Explorer:</strong> main.explorer.zama.ai</div>
                    <div><strong>Purpose:</strong> Public testing</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary" />
                      Local FHEVM
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <div><strong>Chain ID:</strong> 31337</div>
                    <div><strong>RPC:</strong> localhost:8545</div>
                    <div><strong>Accounts:</strong> Pre-funded</div>
                    <div><strong>Purpose:</strong> Fast development</div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Gas Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <div><strong>Limit:</strong> 10M (FHEVM needs more)</div>
                    <div><strong>Price:</strong> 1 gwei</div>
                    <div><strong>EVM:</strong> Cancun version</div>
                    <div><strong>Timeout:</strong> 2 minutes</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-card border-card-border">
                <CardContent className="p-6">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    ✅ Configuration Checklist
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>FHEVM library installed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Hardhat toolbox configured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Network endpoints added</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Environment variables set</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Deployment script ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Gas settings optimized</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  Complete Frontend Development
                </h3>
                <p className="text-muted-foreground mb-4">
                  Build a professional React application with TypeScript, modern styling, and full FHEVM integration.
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 1: Initialize React Project</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Create a new React project with Vite and TypeScript
mkdir ../fhevm-frontend
cd ../fhevm-frontend

# Initialize with Vite for fast development
npm create vite@latest . -- --template react-ts

# Install base dependencies
npm install`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 2: Install Required Dependencies</h4>
                  <CodeBlock
                    title="Terminal"
                    language="bash"
                    code={`# Essential FHEVM and Web3 libraries
npm install fhevmjs ethers

# State management and data fetching
npm install @tanstack/react-query zustand

# UI and styling
npm install lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 3: Configure Tailwind CSS</h4>
                  <CodeBlock
                    title="tailwind.config.js"
                    language="javascript"
                    code={`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: {
          500: '#10b981',
          600: '#059669',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 4: Create Utility Functions</h4>
                  <CodeBlock
                    title="src/utils/fhevm.ts"
                    language="typescript"
                    code={`import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs';
import { BrowserProvider, Contract, ContractTransactionResponse } from 'ethers';

// Contract configuration
export const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || 'your-contract-address-here';
export const ZAMA_CHAIN_ID = 8009;

// Contract ABI for EncryptedCounter
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "encryptedValue", "type": "bytes"}],
    "name": "addToCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "publicKey", "type": "bytes32"},
      {"name": "signature", "type": "bytes"}
    ],
    "name": "getCounter",
    "outputs": [{"name": "", "type": "bytes"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Initialize FHEVM instance
export let fhevmInstance: FhevmInstance | null = null;

export async function initializeFhevm(): Promise<void> {
  try {
    await initFhevm();
    
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (Number(network.chainId) === ZAMA_CHAIN_ID) {
        fhevmInstance = await createInstance({
          chainId: ZAMA_CHAIN_ID,
          publicKeyOrAddress: CONTRACT_ADDRESS,
        });
        console.log('✅ FHEVM instance created successfully');
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize FHEVM:', error);
    throw error;
  }
}

// Get contract instance
export async function getContract() {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// Encrypt a number for the contract
export function encryptNumber(value: number): Uint8Array {
  if (!fhevmInstance) {
    throw new Error('FHEVM instance not initialized');
  }
  
  return fhevmInstance.encrypt32(value);
}

// Decrypt a value from the contract
export async function decryptValue(encryptedValue: string): Promise<number> {
  if (!fhevmInstance) {
    throw new Error('FHEVM instance not initialized');
  }
  
  return fhevmInstance.decrypt(CONTRACT_ADDRESS, encryptedValue);
}

// Check if user is connected to the correct network
export async function checkNetwork(): Promise<boolean> {
  if (!window.ethereum) return false;
  
  try {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return Number(network.chainId) === ZAMA_CHAIN_ID;
  } catch {
    return false;
  }
}

// Switch to Zama network
export async function switchToZamaNetwork(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: \`0x\${ZAMA_CHAIN_ID.toString(16)}\` }],
    });
  } catch (switchError: any) {
    // Network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: \`0x\${ZAMA_CHAIN_ID.toString(16)}\`,
          chainName: 'Zama Devnet',
          nativeCurrency: {
            name: 'ZAMA',
            symbol: 'ZAMA',
            decimals: 18,
          },
          rpcUrls: ['https://devnet.zama.ai/'],
          blockExplorerUrls: ['https://main.explorer.zama.ai/'],
        }],
      });
    } else {
      throw switchError;
    }
  }
}`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 5: Create React Hook for FHEVM</h4>
                  <CodeBlock
                    title="src/hooks/useFhevm.ts"
                    language="typescript"
                    code={`import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractTransactionResponse } from 'ethers';
import {
  initializeFhevm,
  getContract,
  encryptNumber,
  checkNetwork,
  switchToZamaNetwork,
  fhevmInstance,
  CONTRACT_ADDRESS,
} from '../utils/fhevm';

export function useFhevm() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Initialize FHEVM
  useEffect(() => {
    const init = async () => {
      try {
        await initializeFhevm();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize FHEVM:', error);
      }
    };

    init();
  }, []);

  // Check wallet connection
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          
          const isCorrectNetwork = await checkNetwork();
          if (!isCorrectNetwork) {
            console.warn('Please switch to Zama network');
          }
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);

        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) {
          await switchToZamaNetwork();
          await initializeFhevm(); // Re-initialize after network switch
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  // Increment counter mutation
  const incrementMutation = useMutation({
    mutationFn: async (): Promise<ContractTransactionResponse> => {
      const contract = await getContract();
      return contract.increment();
    },
    onSuccess: (tx) => {
      console.log('Increment transaction sent:', tx.hash);
      // Invalidate counter query to refetch
      queryClient.invalidateQueries({ queryKey: ['counter'] });
    },
    onError: (error) => {
      console.error('Increment failed:', error);
    },
  });

  // Add to counter mutation
  const addToCounterMutation = useMutation({
    mutationFn: async (value: number): Promise<ContractTransactionResponse> => {
      if (!fhevmInstance) {
        throw new Error('FHEVM not initialized');
      }
      
      const contract = await getContract();
      const encryptedValue = encryptNumber(value);
      return contract.addToCounter(encryptedValue);
    },
    onSuccess: (tx) => {
      console.log('Add to counter transaction sent:', tx.hash);
      queryClient.invalidateQueries({ queryKey: ['counter'] });
    },
    onError: (error) => {
      console.error('Add to counter failed:', error);
    },
  });

  return {
    // State
    isConnected,
    address,
    isInitialized,
    isCorrectNetwork: true, // Simplified for tutorial
    
    // Actions
    connectWallet,
    
    // Mutations
    increment: incrementMutation.mutate,
    addToCounter: addToCounterMutation.mutate,
    
    // Loading states
    isIncrementPending: incrementMutation.isPending,
    isAddPending: addToCounterMutation.isPending,
    
    // Errors
    incrementError: incrementMutation.error,
    addError: addToCounterMutation.error,
  };
}`}
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Step 6: Create the Main App Component</h4>
                  <CodeBlock
                    title="src/App.tsx"
                    language="typescript"
                    code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Shield, Wallet, Plus, RotateCcw, ExternalLink } from 'lucide-react';
import { useFhevm } from './hooks/useFhevm';
import './App.css';

const queryClient = new QueryClient();

function CounterApp() {
  const {
    isConnected,
    address,
    isInitialized,
    connectWallet,
    increment,
    addToCounter,
    isIncrementPending,
    isAddPending,
    incrementError,
    addError,
  } = useFhevm();

  const [customValue, setCustomValue] = useState(5);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing FHEVM...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <Shield className="w-16 h-16 text-blue-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            🔒 Confidential Counter
          </h1>
          <p className="text-blue-100 mb-6 leading-relaxed">
            A privacy-preserving decentralized application built with FHEVM. 
            Your data stays encrypted on-chain.
          </p>
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
          <p className="text-xs text-blue-200 mt-4">
            Make sure you're on Zama Devnet (Chain ID: 8009)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-blue-300" />
            Confidential Counter
          </h1>
          <p className="text-blue-100">Built with FHEVM for complete privacy</p>
        </div>

        {/* Wallet Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white">Connected</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <span className="text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <a
                href={\`https://main.explorer.zama.ai/address/\${address}\`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Counter Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6 text-center border border-white/20">
          <h2 className="text-xl text-blue-100 mb-4">Encrypted Counter Value</h2>
          <div className="text-6xl font-bold text-white mb-4 animate-pulse-slow">
            🔐
          </div>
          <p className="text-blue-200 text-sm">
            The actual value is encrypted and hidden on-chain
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => increment()}
            disabled={isIncrementPending}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isIncrementPending ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Increment (+1)
              </>
            )}
          </button>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(Number(e.target.value))}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:border-blue-400 focus:outline-none"
                placeholder="Enter value"
                min="1"
                max="1000"
              />
              <button
                onClick={() => addToCounter(customValue)}
                disabled={isAddPending || customValue <= 0}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAddPending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-blue-200">Add a custom encrypted value</p>
          </div>
        </div>

        {/* Error Display */}
        {(incrementError || addError) && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-100 text-sm">
              {incrementError?.message || addError?.message}
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-blue-300 text-sm font-medium mb-1">Privacy</div>
            <div className="text-white text-xs">Values encrypted on-chain</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-green-300 text-sm font-medium mb-1">Network</div>
            <div className="text-white text-xs">Zama Devnet (8009)</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-purple-300 text-sm font-medium mb-1">Technology</div>
            <div className="text-white text-xs">FHEVM + React</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App with providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CounterApp />
    </QueryClientProvider>
  );
}

export default App;`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-success" />
                      Frontend Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>✅ TypeScript for type safety</div>
                    <div>✅ React Query for state management</div>
                    <div>✅ Custom hooks for FHEVM integration</div>
                    <div>✅ Beautiful gradient UI design</div>
                    <div>✅ Responsive mobile-first layout</div>
                    <div>✅ Error handling and loading states</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      FHEVM Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>🔒 Client-side encryption</div>
                    <div>🔒 Automatic network detection</div>
                    <div>🔒 Secure key management</div>
                    <div>🔒 Privacy-preserving computations</div>
                    <div>🔒 Encrypted parameter handling</div>
                    <div>🔒 Controlled decryption flow</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-card border-card-border">
                <CardContent className="p-6">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Next Steps After Frontend Setup
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Replace CONTRACT_ADDRESS with your deployed contract</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Test all contract functions in the UI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full" />
                        <span>Verify encryption/decryption works</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span>Add environment variables for production</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span>Set up proper error handling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span>Optimize for mobile devices</span>
                      </div>
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
