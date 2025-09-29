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
          Point the frontend at the deployed contract and confirm the providers are in place. In
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">frontend/.env</code> replace the placeholder jar address with
          the value printed by <code>scripts/deploy.ts</code>.
        </p>
        <CodeBlock
          title="frontend/.env"
          language="bash"
          code={`# keep the existing relayer + rpc endpoints
VITE_COOKIE_JAR_ADDRESS=0xYourDeployedJarAddress`}
        />
        <p className="text-muted-foreground text-sm">
          The rest of the variables you set in Step 4 stay the same. Update the address alone whenever you redeploy.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Build the Cookie Jar Screen
        </h3>
        <p className="text-muted-foreground">
          Drop in the final UI. It consumes <code>useCookieJar</code>, keeps contributions private, and lets bakers decrypt the jar
          on demand. Replace <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/App.tsx</code> with the snippet below.
        </p>
        <CodeBlock
          title="src/App.tsx"
          language="tsx"
          code={`import { useState } from "react";
import { useCookieJar } from "./hooks/useCookieJar";

const MAX_RENDERED_COOKIES = 60;

export default function App() {
  const [cookies, setCookies] = useState(3);
  const {
    isConnected,
    address,
    connect,
    connectors,
    isConnecting,
    connectError,
    disconnect,
    addCookies,
    totalQuery,
  } = useCookieJar();

  const handleConnect = async () => {
    const connector =
      connectors.find((item) => item.id === "metaMask" && item.ready) ??
      connectors.find((item) => item.ready) ??
      connectors[0];

    if (!connector) return;

    await connect({ connector });
  };

  const revealedTotal = totalQuery.data ?? null;
  const jarDisplay = revealedTotal
    ? "🍪".repeat(Math.min(revealedTotal, MAX_RENDERED_COOKIES)).concat(revealedTotal > MAX_RENDERED_COOKIES ? " …" : "")
    : "🔒";

  return (
    <div className="min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5">Secret Cookie Jar</h1>
          <p className="text-secondary">
            Everyone drops cookies into the jar, but only the grand reveal shows how many treats the crew collected.
          </p>
        </header>

        <div className="card bg-secondary bg-opacity-25 border border-secondary-subtle shadow-sm">
          <div className="card-body p-4">
            {!isConnected ? (
              <div className="text-center">
                <p className="mb-3">Connect a wallet to add your encrypted cookies.</p>
                <button className="btn btn-primary" onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? "Connecting…" : "Connect Wallet"}
                </button>
                {!connectors.some((connector) => connector.ready) && (
                  <p className="text-danger small mt-3">
                    MetaMask extension not detected. Install it or open the app in a MetaMask-enabled browser.
                  </p>
                )}
                {connectError && (
                  <p className="text-danger small mt-3">{connectError.message}</p>
                )}
              </div>
            ) : (
              <div className="row g-4">
                <div className="col-12 d-flex justify-content-between align-items-center text-secondary">
                  <span>Wallet</span>
                  <span className="fw-semibold">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
                </div>

                <div className="col-12">
                  <div className="bg-dark rounded py-4 text-center border border-secondary-subtle">
                    <p className="text-secondary mb-2">Cookie jar status</p>
                    <div className="fs-1" aria-live="polite">
                      {jarDisplay}
                    </div>
                    {revealedTotal !== null ? (
                      <p className="mt-3 text-success fw-semibold">
                        🍪 Total cookies collected: {revealedTotal}
                      </p>
                    ) : (
                      <p className="mt-3 text-secondary">
                        Nobody knows the total yet — contributions stay secret until you reveal them.
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-6 d-flex gap-2 align-items-center">
                  <label className="form-label mb-0 text-secondary" htmlFor="cookie-input">
                    Your cookies
                  </label>
                  <input
                    id="cookie-input"
                    value={cookies}
                    min={1}
                    max={5}
                    type="number"
                    onChange={(event) => setCookies(Number(event.target.value))}
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="col-md-6 d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => addCookies.mutate(cookies)}
                    disabled={addCookies.isPending || cookies < 1 || cookies > 5}
                  >
                    {addCookies.isPending ? "Dropping cookies…" : "Add cookies"}
                  </button>
                  {(addCookies.isError || totalQuery.isError) && (
                    <p className="text-danger small mb-0">
                      {(addCookies.error || totalQuery.error)?.message || "Something went wrong"}
                    </p>
                  )}
                </div>

                <div className="col-12 d-flex gap-2">
                  <button
                    className="btn btn-outline-light flex-grow-1"
                    onClick={() => totalQuery.refetch()}
                    disabled={totalQuery.isFetching}
                  >
                    {totalQuery.isFetching ? "Decrypting jar…" : "Reveal total cookies"}
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => disconnect()}>
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-secondary small mt-4">
          Each drop stays private thanks to homomorphic encryption. Only the final reveal uncovers the cookie bounty.
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
              <li>Run <code>npm run lint</code>, <code>npm run build</code>, and <code>npx hardhat test</code> to make sure both workspaces are healthy before redeploying.</li>
              <li>Start the UI with <code>npm run dev</code> in <code>frontend/</code> and open <code>http://localhost:5173</code>.</li>
              <li>Fund the deploying wallet on Sepolia (bridge or faucet) before testing writes.</li>
              <li>Keep the Hardhat project handy—redeploy whenever you tweak the contract, then update <code>VITE_COOKIE_JAR_ADDRESS</code>.</li>
              <li>Share your build in the <a className="text-accent hover:underline" href="https://discord.gg/zama" target="_blank" rel="noreferrer">Zama Discord</a> and inspire the next batch of encrypted party games.</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-sm text-center">
          Congratulations—you now have a sugary secret keeper that only reveals the final cookie haul when the crew agrees. Add
          seasonal themes, batch reveals, or encrypted leaderboards to keep the fun going.
        </p>

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
