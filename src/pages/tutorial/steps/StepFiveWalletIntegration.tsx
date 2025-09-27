import { Wallet, Link2, Lock } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepFiveWalletIntegration = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Install Wagmi and Viem
        </h3>
        <p className="text-muted-foreground">
          Wagmi wraps common wallet patterns so you can focus on the FHE pieces. Install it together with Viem (the
          underlying RPC client).
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install wagmi viem @wagmi/core @wagmi/connectors`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Wagmi Configuration
        </h3>
        <p className="text-muted-foreground">
          Create a small helper that registers Base Sepolia and exposes a shared configuration. Save this as
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/lib/wagmi.ts</code>. Keeping the setup in one place
          means you can later swap the chain definition for a Zama-managed RPC without touching the UI.
        </p>
        <CodeBlock
          title="src/lib/wagmi.ts"
          language="typescript"
          code={`import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const baseSepolia = {
  id: 84532,
  name: "Base Sepolia Testnet",
  network: "base-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://base-sepolia.drpc.org"] },
    public: { http: ["https://base-sepolia.drpc.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
  },
} as const;

export const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: "your-walletconnect-project-id" }),
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0]),
  },
});
`}
        />
        <p className="text-sm text-muted-foreground">
          Keeping both Sepolia and Base Sepolia in the list mirrors real-world setups where you might offer multiple networks
          during development. Wagmi takes care of surfacing them in the wallet modal.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Hook Contracts Into the UI
        </h3>
        <p className="text-muted-foreground">
          Wire up a typed React hook that takes care of encryption, contract writes, and re-encryption for reads. Place the
          code below in <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/hooks/useCounter.ts</code>.
          It uses the helpers from Step 4 and Wagmi for account state.
        </p>
        <CodeBlock
          title="src/hooks/useCounter.ts"
          language="typescript"
          code={`import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrowserProvider, ethers } from "ethers";
import {
  ensureFhevmInstance,
  decryptCiphertext,
  getCounterContract,
} from "../lib/fhevm";

const CONTRACT_ADDRESS = import.meta.env.VITE_COUNTER_ADDRESS || "0xYourContractAddress";

export function useCounter() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  const counterQuery = useQuery({
    queryKey: ["counter", address],
    enabled: Boolean(address && isConnected),
    queryFn: async () => {
      const fhe = await ensureFhevmInstance();
      const identity = fhe.getPublicKey();
      if (!identity) throw new Error("FHE public key not available yet");

      const contract = await getCounterContract();
      const provider = new BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const { domain, types, message } = fhe.createEIP712(
        ethers.hexlify(identity.publicKey),
        CONTRACT_ADDRESS,
        address
      );
      const signature = await signer.signTypedData(domain, types, message);
      const raw = await contract.viewCounter(identity.publicKeyId, signature);
      return decryptCiphertext(raw);
    },
  });

  const increment = useMutation({
    mutationFn: async () => {
      const contract = await getCounterContract();
      return contract.increment();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["counter"] }),
  });

  const addValue = useMutation({
    mutationFn: async (amount: number) => {
      const fhe = await ensureFhevmInstance();
      const contract = await getCounterContract();
      const zkInput = fhe.createEncryptedInput(CONTRACT_ADDRESS, address!);
      const { handles } = await zkInput.add32(amount).encrypt();
      return contract.add(ethers.hexlify(handles[0]));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["counter"] }),
  });

  return {
    isConnected,
    address,
    connect,
    connectors,
    isConnecting: isPending,
    disconnect,
    counterQuery,
    increment,
    addValue,
  };
}
`}
        />
        <p className="text-sm text-muted-foreground">
          The hook exposes mutations for incrementing with plaintext (+1) and for adding arbitrary encrypted values.
          Because decrypting requires a signature, we rely on the connected wallet to sign the EIP-712 payload.
          Convert the <code>publicKeyId</code> to a <code>bytes32</code> value exactly as described in the
          <a
            href="https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial"
            className="text-accent hover:underline ml-1"
            target="_blank"
            rel="noreferrer"
          >official quick-start</a> if your SDK version returns it as base64.
        </p>
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">Encryption Workflow Recap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Each user action now flows as follows:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Write:</strong> Build a ZK input with <code>createEncryptedInput</code>, encrypt client side, and send the ciphertext handle.</li>
            <li><strong>On-chain compute:</strong> The contract uses <code>TFHE.add</code> with the received handle.</li>
            <li><strong>Read:</strong> Request a re-encrypted snapshot via <code>viewCounter</code>, sign the typed data, decrypt locally.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFiveWalletIntegration;
