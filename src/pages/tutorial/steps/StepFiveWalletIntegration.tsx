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
          Create a small helper that registers Sepolia and exposes a shared configuration. Save this as
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/lib/wagmi.ts</code>. Keeping the setup in one place
          means you can later swap the chain definition for a Zama-managed RPC without touching the UI.
        </p>
        <CodeBlock
          title="src/lib/wagmi.ts"
          language="typescript"
          code={`import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

const RPC_URL = import.meta.env.VITE_RPC_URL;
const sepoliaTransport = RPC_URL ? http(RPC_URL) : http();

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask({ shimDisconnect: true }),
    injected({ target: "metaMask" }),
  ],
  transports: {
    [sepolia.id]: sepoliaTransport,
  },
});
`}
        />
        <p className="text-sm text-muted-foreground">
          Target MetaMask explicitly so the injected connector doesn’t bounce users to Coinbase when multiple wallet
          extensions are installed. The generic injected fallback still allows other extensions to connect manually.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Hook Contracts Into the UI
        </h3>
        <p className="text-muted-foreground">
          Wire up a typed React hook that takes care of encryption, contract writes, and the “reveal” read path. Place the code
          below in <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/hooks/useCookieJar.ts</code>. It uses the
          helpers from Step 4 and Wagmi for account state.
        </p>
        <CodeBlock
          title="src/hooks/useCookieJar.ts"
          language="typescript"
          code={`import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { getCookieJarContract, buildEncryptedCookies, ensureFhevmInstance } from "../lib/fhevm";

const COOKIE_TOTAL_QUERY_KEY = ["cookie-total"] as const;

export function useCookieJar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  const addCookies = useMutation({
    mutationFn: async (amount: number) => {
      if (!address || !isConnected) throw new Error("Connect a wallet first");
      const contract = await getCookieJarContract();
      const { handle, inputProof } = await buildEncryptedCookies(amount, address);
      return contract.addCookies(handle, inputProof);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: COOKIE_TOTAL_QUERY_KEY });
    },
  });

  const totalQuery = useQuery({
    queryKey: COOKIE_TOTAL_QUERY_KEY,
    enabled: false,
    queryFn: async () => {
      const contract = await getCookieJarContract();
      const encryptedHandle = await contract.encryptedTotal();
      const handleHex = ethers.hexlify(encryptedHandle);
      const fhe = await ensureFhevmInstance();
      const decrypted = await fhe.publicDecrypt([handleHex]);
      const total = decrypted[handleHex];
      if (total === undefined) {
        throw new Error("Unable to decrypt cookie jar");
      }
      return Number(total);
    },
  });

  return {
    isConnected,
    address,
    connect,
    connectors,
    isConnecting: isPending,
    connectError,
    disconnect,
    addCookies,
    totalQuery,
  };
}
`}
        />
        <p className="text-sm text-muted-foreground">
          The hook exposes one mutation (<code>addCookies</code>) and one lazy query (<code>totalQuery</code>). Clearing the cached
          reveal after every contribution keeps the UI honest: the next “Reveal total” click will fetch a fresh, relayer-decrypted
          value.
        </p>
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">Encryption Workflow Recap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Each user action now flows as follows:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Write:</strong> Build a ZK input with <code>createEncryptedInput</code>, encrypt the cookie count, and send the handle + proof.</li>
            <li><strong>On-chain compute:</strong> The contract uses <code>TFHE.add</code> with the received <code>einput</code> to update the hidden jar.</li>
            <li><strong>Read:</strong> The lazy <code>totalQuery</code> asks the relayer for a public decryption of the encrypted total when bakers request the reveal.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFiveWalletIntegration;
