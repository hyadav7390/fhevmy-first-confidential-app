import { Monitor, Palette, PlugZap, Puzzle, Trophy } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepFourReactFrontend = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Bootstrap a Vite + TypeScript Frontend
        </h3>
        <p className="text-muted-foreground">
          Time to give the cookie jar a face. We keep the React app in a sibling <code className="bg-code-bg px-1 py-0.5 rounded text-accent">frontend</code>
          folder so contract code and UI code stay decoupled.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={String.raw`mkdir ../frontend && cd ../frontend
# scaffold the Vite + TS workspace (press Enter through the prompts)
npm create vite@latest . -- --template react-ts
# install the default React runtime deps declared in package.json
npm install
# add the relayer SDK + data plumbing + Bootstrap styling
npm install @zama-fhe/relayer-sdk ethers @tanstack/react-query bootstrap
# polyfill node globals that the relayer SDK expects
npm install --save-dev buffer process stream-browserify util`}
        />
        <p className="text-sm text-muted-foreground space-y-1">
          <span className="block">
            <code>@zama-fhe/relayer-sdk</code> replaces the deprecated <code>fhevmjs</code> package and ships the relayer-aware
            WebAssembly runtime.
          </span>
          <span className="block">
            The extra dev dependencies expose browser-friendly versions of Node globals (<code>Buffer</code>, <code>process</code>, streams,
            utilities) that the SDK expects under the hood.
          </span>
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Wire Bootstrap, Providers, and Polyfills
        </h3>
        <p className="text-muted-foreground">
          Import Bootstrap once at the root, layer Wagmi/React Query so every component can talk to wallets and cached state, and
          shim the Node globals before rendering. Replace <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/main.tsx</code>
          with the snippet below.
        </p>
        <CodeBlock
          title="src/main.tsx"
          language="typescript"
          code={`import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import process from "process";
import { Buffer } from "buffer";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { wagmiConfig } from "./lib/wagmi";

const queryClient = new QueryClient();

if (typeof window !== "undefined") {
  Object.assign(window, { process, Buffer });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
`}
        />
        <p className="text-sm text-muted-foreground">
          The shims keep the relayer SDK happy in browsers; everything else is standard Vite + React wiring. We’ll drop the cookie
          jar UI in Step&nbsp;6. For now, the app will complain about a missing <code>./lib/wagmi</code> module—we add it next.
        </p>
        <CodeBlock
          title="vite.config.ts"
          language="typescript"
          code={`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const crossOriginHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "fetch-retry": "fetch-retry/index.js",
      stream: "stream-browserify",
      buffer: "buffer",
      util: "util/",
      process: "process/browser",
    },
  },
  optimizeDeps: {
    exclude: ["@zama-fhe/relayer-sdk/web"],
    include: ["keccak", "bigint-buffer", "stream", "buffer", "util", "process/browser"],
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  worker: {
    format: "es",
  },
  server: {
    headers: crossOriginHeaders,
  },
  preview: {
    headers: crossOriginHeaders,
  },
});
`}
        />
        <p className="text-sm text-muted-foreground">
          Cross-origin isolation headers allow WebAssembly threads and the aliases/polyfills make the browser build feel enough
          like Node for the relayer SDK. Restart <code>npm run dev</code> after editing this file.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-primary" />
          Frontend Environment Variables
        </h3>
        <p className="text-muted-foreground">
          Create a <code className="bg-code-bg px-1 py-0.5 rounded text-accent">.env</code> file in the frontend folder. These values
          point to Zama’s Sepolia infrastructure; swap them if you deploy the fhEVM stack elsewhere.
        </p>
        <CodeBlock
          title="frontend/.env"
          language="bash"
          code={`VITE_TARGET_CHAIN_ID=11155111
VITE_GATEWAY_CHAIN_ID=55815
VITE_RPC_URL=https://sepolia.gateway.tenderly.co
VITE_RELAYER_URL=https://relayer.testnet.zama.cloud
VITE_ACL_CONTRACT_ADDRESS=0x687820221192C5B662b25367F70076A37bc79b6c
VITE_KMS_CONTRACT_ADDRESS=0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC
VITE_INPUT_VERIFIER_CONTRACT_ADDRESS=0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4
VITE_DECRYPTION_ORACLE_ADDRESS=0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1
VITE_INPUT_VERIFICATION_CONTRACT_ADDRESS=0x7048C39f048125eDa9d678AEbaDfB22F7900a29F
VITE_COOKIE_JAR_ADDRESS=0xYourContractAddress`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <PlugZap className="h-5 w-5 text-primary" />
          Client Helpers for Encryption
        </h3>
        <p className="text-muted-foreground">
          The helper below initialises the relayer SDK, validates configuration, and exposes a small API for encrypted writes and
          decrypting the jar total. Save it as <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/lib/fhevm.ts</code>.
        </p>
        <CodeBlock
          title="src/lib/fhevm.ts"
          language="typescript"
          code={String.raw`import { initSDK, createInstance, type FhevmInstance } from "@zama-fhe/relayer-sdk/web";
import { BrowserProvider, Contract, ethers, type Eip1193Provider } from "ethers";

const TARGET_CHAIN_ID = Number(import.meta.env.VITE_TARGET_CHAIN_ID ?? 11155111);
const GATEWAY_CHAIN_ID = Number(import.meta.env.VITE_GATEWAY_CHAIN_ID ?? 55815);
const COOKIE_JAR_ADDRESS = import.meta.env.VITE_COOKIE_JAR_ADDRESS || "0xYourContractAddress";
const ACL_CONTRACT_ADDRESS = import.meta.env.VITE_ACL_CONTRACT_ADDRESS ?? "";
const KMS_CONTRACT_ADDRESS = import.meta.env.VITE_KMS_CONTRACT_ADDRESS ?? "";
const INPUT_VERIFIER_CONTRACT_ADDRESS = import.meta.env.VITE_INPUT_VERIFIER_CONTRACT_ADDRESS ?? "";
const INPUT_VERIFICATION_CONTRACT_ADDRESS = import.meta.env.VITE_INPUT_VERIFICATION_CONTRACT_ADDRESS ?? "";
const DECRYPTION_ORACLE_ADDRESS = import.meta.env.VITE_DECRYPTION_ORACLE_ADDRESS ?? "";
const RELAYER_URL = import.meta.env.VITE_RELAYER_URL ?? "";
const RPC_URL = import.meta.env.VITE_RPC_URL ?? "";

const ABI = [
  "function addCookies(bytes32 encryptedAmount, bytes inputProof)",
  "function encryptedTotal() view returns (uint256)",
  "function revealTotal() returns (uint32)",
];

let instance: FhevmInstance | null = null;

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

function ensureConfigured() {
  if (!ethers.isAddress(ACL_CONTRACT_ADDRESS)) {
    throw new Error("Set VITE_ACL_CONTRACT_ADDRESS to a valid contract address in your frontend .env");
  }
  if (!ethers.isAddress(KMS_CONTRACT_ADDRESS)) {
    throw new Error("Set VITE_KMS_CONTRACT_ADDRESS to a valid contract address in your frontend .env");
  }
  if (!ethers.isAddress(INPUT_VERIFIER_CONTRACT_ADDRESS)) {
    throw new Error("Set VITE_INPUT_VERIFIER_CONTRACT_ADDRESS to a valid contract address in your frontend .env");
  }
  if (!ethers.isAddress(INPUT_VERIFICATION_CONTRACT_ADDRESS)) {
    throw new Error("Set VITE_INPUT_VERIFICATION_CONTRACT_ADDRESS to a valid contract address in your frontend .env");
  }
  if (!ethers.isAddress(DECRYPTION_ORACLE_ADDRESS)) {
    throw new Error("Set VITE_DECRYPTION_ORACLE_ADDRESS to a valid contract address in your frontend .env");
  }
  if (!RELAYER_URL) {
    throw new Error("Set VITE_RELAYER_URL to the fhEVM relayer URL provided by Zama");
  }
  if (!RPC_URL) {
    throw new Error("Set VITE_RPC_URL to an RPC endpoint");
  }
}

export async function ensureFhevmInstance(): Promise<FhevmInstance> {
  if (instance) return instance;

  ensureConfigured();

  await initSDK();
  instance = await createInstance({
    aclContractAddress: ACL_CONTRACT_ADDRESS,
    kmsContractAddress: KMS_CONTRACT_ADDRESS,
    inputVerifierContractAddress: INPUT_VERIFIER_CONTRACT_ADDRESS,
    verifyingContractAddressDecryption: DECRYPTION_ORACLE_ADDRESS,
    verifyingContractAddressInputVerification: INPUT_VERIFICATION_CONTRACT_ADDRESS,
    gatewayChainId: GATEWAY_CHAIN_ID,
    chainId: TARGET_CHAIN_ID,
    relayerUrl: RELAYER_URL,
    network: RPC_URL,
  });

  return instance;
}

export async function getCookieJarContract() {
  const ethereum = window.ethereum;
  if (!ethereum) {
    throw new Error("A browser wallet is required");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return new Contract(COOKIE_JAR_ADDRESS, ABI, signer);
}

export async function buildEncryptedCookies(amount: number, userAddress: string) {
  const fhe = await ensureFhevmInstance();
  const zkInput = fhe.createEncryptedInput(COOKIE_JAR_ADDRESS, userAddress);
  const { handles, inputProof } = await zkInput.add32(amount).encrypt();
  return { handle: ethers.hexlify(handles[0]), inputProof: ethers.hexlify(inputProof) } as const;
}

export {};
`}
        />
        <p className="text-sm text-muted-foreground">
          We’ll consume this helper in Step&nbsp;5 to submit cookies and in Step&nbsp;6 to decrypt the final haul.
        </p>
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Ready for Wallet UX
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            At this point you have:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>A Bootstrap-powered React shell in its own workspace</li>
            <li>Environment variables pointing at Zama’s Sepolia infrastructure</li>
            <li>A relayer helper that encrypts inputs and decrypts the jar total</li>
          </ul>
          <p>
            Step&nbsp;5 adds Wagmi hooks so bakers can connect wallets, drop cookies, and trigger the big reveal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFourReactFrontend;
