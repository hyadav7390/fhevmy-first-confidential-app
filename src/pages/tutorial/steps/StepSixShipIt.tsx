import { Rocket, CheckCircle2, ListChecks } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StepSixShipIt = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Rocket className="h-5 w-5 text-success" />
          Wire Everything Together
        </h3>
        <p className="text-muted-foreground">
          Point the frontend at the deployed contract and mount providers once at the root of the app. Expose the
          contract address through an environment variable so you can swap networks without rebuilding.
        </p>
        <CodeBlock
          title=".env"
          language="bash"
          code={`VITE_COUNTER_ADDRESS=0xYourDeployedContract
VITE_TARGET_CHAIN_ID=84532`}
        />
        <CodeBlock
          title="src/main.tsx"
          language="typescript"
          code={`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { wagmiConfig } from "./lib/wagmi";

const queryClient = new QueryClient();

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
        <p className="text-muted-foreground">
          The providers are now layered as follows: Wagmi handles wallet state, React Query manages encrypted reads, and the
          UI components sit on top. With <code>VITE_TARGET_CHAIN_ID</code> set, you can redeploy to any compatible RPC and the
          frontend follows along without a rebuild.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Build the Counter Screen
        </h3>
        <p className="text-muted-foreground">
          The UI below consumes <code>useCounter</code>. It connects wallets, switches networks when required, and
          demonstrates both plaintext and encrypted interactions.
        </p>
        <CodeBlock
          title="src/App.tsx"
          language="tsx"
          code={`import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { useCounter } from "./hooks/useCounter";

export default function App() {
  const [custom, setCustom] = useState(5);
  const {
    isConnected,
    address,
    connect,
    connectors,
    isConnecting,
    disconnect,
    counterQuery,
    increment,
    addValue,
  } = useCounter();

  const handleConnect = async () => {
    const connector = connectors[0];
    await connect({ connector });
  };

  const counterValue = counterQuery.data ?? "🔒 confidential";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Confidential Counter</h1>
          <p className="text-muted-foreground">
            End-to-end encrypted arithmetic powered by Zama FHEVM, deployed to Base Sepolia for testing.
          </p>
        </header>

        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="p-6 space-y-6">
            {!isConnected ? (
              <div className="space-y-4 text-center">
                <p>Connect a wallet to start encrypting values.</p>
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Connected as</span>
                  <span className="font-mono">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-muted-foreground text-sm">Encrypted counter value</p>
                  <p className="text-4xl font-semibold">{counterValue}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button onClick={() => increment.mutate()} disabled={increment.isPending}>
                    {increment.isPending ? "Submitting…" : "Increment (+1)"}
                  </Button>
                  <div className="flex gap-2">
                    <input
                      value={custom}
                      min={1}
                      max={1000}
                      type="number"
                      onChange={(event) => setCustom(Number(event.target.value))}
                      className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                    />
                    <Button
                      onClick={() => addValue.mutate(custom)}
                      disabled={addValue.isPending || custom <= 0}
                      variant="secondary"
                    >
                      {addValue.isPending ? "Encrypting…" : "Add"}
                    </Button>
                  </div>
                </div>

                {(increment.isError || addValue.isError) && (
                  <p className="text-sm text-red-300">
                    {(increment.error || addValue.error)?.message || "Transaction failed"}
                  </p>
                )}

                <div className="text-right">
                  <Button variant="ghost" onClick={() => disconnect()} className="text-red-400 hover:text-red-200">
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground">
          Gas usage and transaction status are surfaced in the wallet. Expect higher gas than a vanilla counter because of
          the encrypted arithmetic.
        </footer>
      </div>
    </div>
  );
}
`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-success" />
          Final Checks
        </h3>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Run <code>npm run dev</code> in the frontend folder and open <code>http://localhost:5173</code>.</li>
              <li>Fund the deploying wallet on Base Sepolia (Bridge or faucet) before testing writes.</li>
              <li>Keep the Hardhat project handy—redeploy whenever you tweak the contract, then update <code>VITE_COUNTER_ADDRESS</code>.</li>
              <li>
                Share your build in the <a className="text-accent hover:underline" href="https://discord.gg/zama" target="_blank" rel="noreferrer">Zama Discord</a>
                and explore more complex encrypted state machines.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow">
            <a href="https://docs.zama.ai" target="_blank" rel="noreferrer">
              Continue with Advanced Patterns
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default StepSixShipIt;
