import { Wallet, Link2, Lock } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepFiveWalletIntegration = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Confirm Wagmi Tooling
        </h3>
        <p className="text-muted-foreground">
          Step&nbsp;4 already pulled in Wagmi, Viem, and the connector packages. If you cloned an older workspace or skipped that install,
          run the command below before moving on.
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
          Review the Wagmi Helper
        </h3>
        <p className="text-muted-foreground">
          You created <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/lib/wagmi.ts</code> in Step&nbsp;4. If you
          tweak RPC endpoints or add more connectors later, update that helper and the rest of the app will pick it up
          automatically.
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
          code={String.raw`import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Contract, ethers } from "ethers";
import { getCookieJarContract, buildEncryptedCookies, ensureFhevmInstance } from "../lib/fhevm";
import { loadOrCreateSignature } from "../lib/decryptionSignature";

const COOKIE_TOTAL_QUERY_KEY = ["cookie-total"] as const;

async function decryptJarTotal(contract: Contract) {
  const fhe = await ensureFhevmInstance();
  const contractAddress = await contract.getAddress();
  const encryptedHandle = await contract.encryptedTotal();
  const handleHex = ethers.hexlify(encryptedHandle);
  const signer = contract.runner as ethers.Signer;

  const signature = await loadOrCreateSignature(fhe, contractAddress, signer);
  const decrypted = await fhe.userDecrypt(
    [{ handle: handleHex, contractAddress }],
    signature.privateKey,
    signature.publicKey,
    signature.signature,
    signature.contractAddresses,
    signature.userAddress,
    signature.startTimestamp,
    signature.durationDays
  );

  const total = decrypted[handleHex];
  if (total === undefined) {
    throw new Error("Unable to decrypt cookie jar");
  }

  return Number(total);
}

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
      if (!address || !isConnected) throw new Error("Connect a wallet first");
      const contract = await getCookieJarContract();
      return decryptJarTotal(contract);
    },
  });

  const revealTotal = useMutation({
    mutationFn: async () => {
      if (!address || !isConnected) throw new Error("Connect a wallet first");
      const contract = await getCookieJarContract();
      const tx = await contract.revealTotal();
      await tx.wait();
      return decryptJarTotal(contract);
    },
    onSuccess: (value) => {
      queryClient.setQueryData(COOKIE_TOTAL_QUERY_KEY, value);
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
    revealTotal,
  };
}
`}
        />
        <p className="text-sm text-muted-foreground space-y-1">
          <span className="block">
            <code>decryptJarTotal</code> centralises the signature handshake and relayer call so reads and reveals share exactly the
            same logic. The first reveal asks the user for an EIP-712 signature; subsequent decryptions reuse the cached value until it expires.
          </span>
          <span className="block">
            The lazy <code>totalQuery</code> stays disabled by default—call <code>totalQuery.refetch()</code> whenever you want to
            refresh an already revealed jar without sending another transaction.
          </span>
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
