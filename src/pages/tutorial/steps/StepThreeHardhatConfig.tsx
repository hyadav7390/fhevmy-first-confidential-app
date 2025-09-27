import { Settings, ServerCog, FileCog, AlertCircle, MapPin } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepThreeHardhatConfig = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Configure Hardhat for FHEVM
        </h3>
        <p className="text-muted-foreground">
          A regular Hardhat config works, but the FHEVM compiler target and gas defaults need a tweak. For now we point the
          deployment at <strong>Base Sepolia</strong>, a public L2 testnet with reliable infrastructure. Swap the endpoints back to
          Zama’s network when it becomes available.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install fhevm
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify dotenv`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ServerCog className="h-5 w-5 text-primary" />
          Hardhat Configuration File
        </h3>
        <p className="text-muted-foreground">
          Save the configuration below as <code className="bg-code-bg px-1 py-0.5 rounded text-accent">hardhat.config.ts</code>.
          The Cancun EVM target is required by the current FHEVM toolchain even when you deploy to Base Sepolia.
        </p>
        <CodeBlock
          title="hardhat.config.ts"
          language="typescript"
          code={`import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.drpc.org";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      chainId: 84532,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: 10_000_000,
      gasPrice: 1_000_000_000,
    },
    hardhat: {
      chainId: 31337,
      gas: 10_000_000,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  mocha: {
    timeout: 120_000,
  },
};

export default config;
`}
        />
        <Card className="bg-card/60 border-card-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Why Base Sepolia?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Base Sepolia mirrors the JSON-RPC surface area you’ll use on FHEVM networks while giving you faucet access and
              reliable explorers today. The contract, scripts, and encoding stay identical when you later point at a Zama RPC.
            </p>
            <p>
              Once Zama provides public endpoints, replace <code>BASE_SEPOLIA_RPC_URL</code> and <code>chainId</code> with the
              official values—everything else remains the same.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileCog className="h-5 w-5 text-primary" />
          Environment Variables and Deployment Script
        </h3>
        <p className="text-muted-foreground">
          Call your RPC endpoint and private key from a <code className="bg-code-bg px-1 py-0.5 rounded text-accent">.env</code>
          file. Only a single funded account is required for the tutorial.
        </p>
        <CodeBlock
          title=".env"
          language="bash"
          code={`PRIVATE_KEY=replace_with_private_key_without_0x
BASE_SEPOLIA_RPC_URL=https://base-sepolia.drpc.org
BASESCAN_API_KEY=optional_if_you_want_verification`}
        />
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            Never commit the <code>.env</code> file—add it to <code>.gitignore</code> immediately.
          </CardContent>
        </Card>
        <p className="text-muted-foreground">
          Upgrade the default deploy script to log helpful diagnostics. Save this as
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">scripts/deploy.ts</code>.
        </p>
        <CodeBlock
          title="scripts/deploy.ts"
          language="typescript"
          code={`import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  const Factory = await ethers.getContractFactory("EncryptedCounter");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("EncryptedCounter deployed at:", await contract.getAddress());
  console.log("Transaction hash:", contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`}
        />
        <CodeBlock title="Compile & deploy" language="bash" code={`npx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia`} />
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">✅ Ready for the Frontend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>At this point you have:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Contracts compiling against the FHEVM toolchain</li>
            <li>A reproducible deployment script targeting Base Sepolia</li>
            <li>Environment settings isolated from version control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThreeHardhatConfig;
