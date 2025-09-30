import { Settings, ServerCog, FileCog, AlertCircle, MapPin } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HARDHAT_CONFIG_CODE = [
  "import { HardhatUserConfig } from \"hardhat/config\";",
  "import \"@nomicfoundation/hardhat-toolbox\";",
  "import \"@nomicfoundation/hardhat-verify\";",
  "import dotenv from \"dotenv\";",
  "",
  "dotenv.config();",
  "",
  "const PRIVATE_KEY = process.env.PRIVATE_KEY || \"\";",
  "const NORMALISED_PRIVATE_KEY = PRIVATE_KEY",
  "  ? PRIVATE_KEY.startsWith(\"0x\")",
  "    ? PRIVATE_KEY",
  "    : `0x${PRIVATE_KEY}`",
  "  : \"\";",
  "const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || \"https://sepolia.gateway.tenderly.co\";",
  "",
  "const config: HardhatUserConfig = {",
  "  solidity: {",
  "    version: \"0.8.24\",",
  "    settings: {",
  "      optimizer: { enabled: true, runs: 200 },",
  "    },",
  "  },",
  "  networks: {",
  "    sepolia: {",
  "      url: SEPOLIA_RPC_URL,",
  "      chainId: 11155111,",
  "      accounts: NORMALISED_PRIVATE_KEY ? [NORMALISED_PRIVATE_KEY] : [],",
  "      gas: 10_000_000,",
  "    },",
  "    hardhat: {",
  "      chainId: 31337,",
  "      gas: 10_000_000,",
  "    },",
  "  },",
  "  etherscan: {",
  "    apiKey: {",
  "      sepolia: process.env.SEPOLIA_ETHERSCAN_API_KEY || \"\",",
  "    },",
  "  },",
  "  mocha: {",
  "    timeout: 120_000,",
  "  },",
  "};",
  "",
  "export default config;",
].join("\n");

const StepThreeHardhatConfig = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Configure Hardhat for FHEVM
        </h3>
        <p className="text-muted-foreground">
          A regular Hardhat config works. Since the <code>fhevm</code> Solidity libraries target <strong>^0.8.24</strong>, we’ll
          bump the Solidity version accordingly. For on-chain tests we deploy to Zama’s FHE-enabled <strong>Sepolia</strong>
          endpoint, which exposes the ACL, executor, payment, and verifier contracts required by the TFHE helpers.
        </p>
        <p className="text-sm text-muted-foreground">
          You already installed <code>@nomicfoundation/hardhat-toolbox</code> in Step 1. The commands below add the FHEVM library and
          Hardhat verify plugin we need for encryption-friendly contracts and optional explorer verification.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install --save-dev @nomicfoundation/hardhat-verify@2.1.1 dotenv@16.4.5`}
        />
        <p className="text-sm text-muted-foreground">
          Version <code>2.1.1</code> of the verify plugin is the latest release that still targets Hardhat&nbsp;2.26. Using the
          <code>3.x</code> series would force an upgrade to Hardhat&nbsp;3, which isn’t covered in this tutorial.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ServerCog className="h-5 w-5 text-primary" />
          Hardhat Configuration File
        </h3>
        <p className="text-muted-foreground">
          Replace the placeholder config from Step 1 with the version below. The key change is setting Solidity to 0.8.24 to
          match the <code>fhevm</code> library. Because Step&nbsp;2 swapped the constructor to use Zama’s Sepolia config helper,
          you’ll redeploy this contract after compiling so the chain version stays in sync with the frontend.
        </p>
        <CodeBlock title="hardhat.config.ts" language="typescript" code={HARDHAT_CONFIG_CODE} />
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
        <p className="text-sm text-muted-foreground">
          The config normalises the key, so you can paste it with or without the <code>0x</code> prefix. The deploy script now
          checks that a signer exists and reminds you to set <code>PRIVATE_KEY</code> if it is missing.
        </p>
        <CodeBlock
          title=".env"
          language="bash"
          code={`PRIVATE_KEY=replace_with_private_key (with or without 0x)
SEPOLIA_RPC_URL=https://sepolia.gateway.tenderly.co
SEPOLIA_ETHERSCAN_API_KEY=optional_if_you_want_verification`}
        />
        <Card className="bg-warning/5 border-warning/20 mt-2">
          <CardContent className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            Never commit the <code>.env</code> file—add it to <code>.gitignore</code> immediately.
          </CardContent>
        </Card>
        <p className="text-muted-foreground">
          Upgrade the default deploy script to log helpful diagnostics. Save this as
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">scripts/deploy.ts</code>. The script now checks for a
          configured signer so you immediately know if <code>PRIVATE_KEY</code> is missing.
        </p>
        <CodeBlock
          title="scripts/deploy.ts"
          language="typescript"
          code={`import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error(
      "No signer available. Set PRIVATE_KEY in your .env (with or without the 0x prefix) before deploying."
    );
  }

  const deployer = signers[0];
  const provider = deployer.provider;
  if (!provider) {
    throw new Error("No provider attached to the deployer. Check your network RPC configuration.");
  }

  console.log("Deploying with:", deployer.address);
  const balance = await provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  const Factory = await ethers.getContractFactory("EncryptedCookieJar");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("EncryptedCookieJar deployed at:", await contract.getAddress());
  console.log("Transaction hash:", contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`}
        />
        <CodeBlock title="Compile & deploy" language="bash" code={`npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia`} />
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">✅ Ready for the Frontend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>At this point you have:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Contracts compiling against the FHEVM toolchain</li>
            <li>A reproducible deployment script targeting Sepolia</li>
            <li>Environment settings isolated from version control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThreeHardhatConfig;
