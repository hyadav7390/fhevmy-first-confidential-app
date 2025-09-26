import { Settings, ServerCog, FileCog, AlertCircle } from "lucide-react";
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
          A regular Hardhat config works, but the FHEVM compiler target and gas defaults need a tweak. Install the helper
          plugins we rely on through the rest of the tutorial.
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
          The Cancun EVM target is required by the current FHEVM toolchain.
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

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    zama: {
      url: process.env.ZAMA_DEVNET_URL || "https://devnet.zama.ai/",
      chainId: 8009,
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
      zama: process.env.ZAMA_EXPLORER_API_KEY || "",
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
  mocha: {
    timeout: 120_000,
  },
};

export default config;
`}
        />
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
ZAMA_DEVNET_URL=https://devnet.zama.ai/
ZAMA_EXPLORER_API_KEY=optional_if_you_want_verification`}
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
npx hardhat run scripts/deploy.ts --network zama`} />
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">✅ Ready for the Frontend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>At this point you have:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Contracts compiling against the FHEVM toolchain</li>
            <li>A reproducible deployment script targeting Zama Devnet</li>
            <li>Environment settings isolated from version control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThreeHardhatConfig;
