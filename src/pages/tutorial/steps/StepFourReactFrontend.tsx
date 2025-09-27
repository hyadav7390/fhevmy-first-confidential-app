import { Monitor, LayoutDashboard, PlugZap } from "lucide-react";
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
          Build the user interface in a separate <code className="bg-code-bg px-1 py-0.5 rounded text-accent">frontend</code>
          folder. Vite keeps local iterations snappy while Tailwind gives us a polished UI with minimal churn.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`mkdir ../frontend && cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
npm install fhevmjs ethers @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Hook Tailwind Into the Build
        </h3>
        <p className="text-muted-foreground">
          Update the Tailwind configuration to scan the <code>src</code> directory and extend a few colours used in the
          tutorial UI.
        </p>
        <CodeBlock
          title="tailwind.config.ts"
          language="typescript"
          code={`import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#10b981",
          foreground: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <PlugZap className="h-5 w-5 text-primary" />
          Client Helpers for Encryption
        </h3>
        <p className="text-muted-foreground">
          The frontend needs a small utility to initialise <code>fhevmjs</code>, encrypt numbers, and decrypt responses from
          the contract. Drop the helper below into <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/lib/fhevm.ts</code>.
          Notice how the chain ID comes from <code>VITE_TARGET_CHAIN_ID</code>, making it easy to point the same UI at Base
          Sepolia during development or at a Zama endpoint later.
        </p>
        <CodeBlock
          title="src/lib/fhevm.ts"
          language="typescript"
          code={`import { initFhevm, createInstance, type FhevmInstance } from "fhevmjs";
import { BrowserProvider, Contract } from "ethers";

const TARGET_CHAIN_ID = Number(import.meta.env.VITE_TARGET_CHAIN_ID ?? 84532);
const CONTRACT_ADDRESS = import.meta.env.VITE_COUNTER_ADDRESS || "0xYourContractAddress";

const ABI = [
  "function increment()",
  "function add(bytes encryptedDelta)",
  "function viewCounter(bytes32 publicKey, bytes signature) view returns (bytes)",
];

let instance: FhevmInstance | null = null;

export async function ensureFhevmInstance(): Promise<FhevmInstance> {
  if (instance) return instance;

  await initFhevm();
  instance = await createInstance({
    chainId: TARGET_CHAIN_ID,
    publicKeyOrAddress: CONTRACT_ADDRESS,
  });

  return instance;
}

export async function getCounterContract() {
  if (!window.ethereum) {
    throw new Error("A browser wallet is required");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function decryptCiphertext(payload: string) {
  const fhe = await ensureFhevmInstance();
  return fhe.decrypt(CONTRACT_ADDRESS, payload);
}
`}
        />
        <p className="text-sm text-muted-foreground">
          We will wire this helper into the React hooks in the next steps; keeping it isolated avoids sprinkling encryption
          logic across the UI.
        </p>
        <Card className="bg-card/60 border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Helper Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>ensureFhevmInstance:</strong> boots the WASM runtime once, caches the instance, and ties it to whichever
              chain ID you configured through <code>VITE_TARGET_CHAIN_ID</code>.
            </p>
            <p>
              <strong>getCounterContract:</strong> hides the provider/signing boilerplate so the rest of the app only deals with
              a typed <code>Contract</code> instance.
            </p>
            <p>
              <strong>decryptCiphertext:</strong> centralises decryption so components never call <code>fhevmjs</code> directly. That
              makes refactors—like switching to streaming decryptions—almost trivial.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">Next Up: Wallet UX</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            With Tailwind and <code>fhevmjs</code> scaffolded you can already render static UI states. Step 5 adds wallet
            connections and live contract calls using Wagmi so that the encryption helper above comes to life.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFourReactFrontend;
