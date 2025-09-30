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
          Drop in the final UI. It consumes <code className="bg-code-bg px-1 py-0.5 rounded text-accent">useCookieJar</code>, layers the Nebula Cookie Conservatory theme on top of
          Bootstrap, and lets bakers decrypt the jar on demand. Replace <code className="bg-code-bg px-1 py-0.5 rounded text-accent">src/App.tsx</code> with the snippet below.
        </p>
        <CodeBlock
          title="src/App.tsx"
          language="tsx"
          code={String.raw`import { useState } from "react";
import { useCookieJar } from "./hooks/useCookieJar";
import "./App.css";

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
    revealTotal,
  } = useCookieJar();

  const handleConnect = async () => {
    const connector =
      connectors.find((item) => item.id === "metaMask" && item.ready) ??
      connectors.find((item) => item.ready) ??
      connectors[0];

    if (!connector) return;

    await connect({ connector });
  };

  const connectorsReady = connectors.some((connector) => connector.ready);
  const revealedTotal = totalQuery.data ?? revealTotal.data ?? null;
  const jarDisplay = revealedTotal
    ? "🍪"
        .repeat(Math.min(revealedTotal, MAX_RENDERED_COOKIES))
        .concat(revealedTotal > MAX_RENDERED_COOKIES ? " …" : "")
    : "🔒";
  const revealButtonBusy = revealTotal.isPending || totalQuery.isFetching;
  const revealButtonLabel =
    revealedTotal === null ? "Reveal total cookies" : "Refresh revealed total";

  const handleReveal = () => {
    if (revealedTotal === null) {
      revealTotal.mutate();
      return;
    }

    totalQuery.refetch();
  };

  const revealError = revealTotal.error ?? totalQuery.error ?? null;

  return (
    <div className="app-shell position-relative overflow-hidden">
      <div className="floating-pip" aria-hidden="true" />
      <div className="floating-pip" aria-hidden="true" />

      <div className="container position-relative">
        <header className="text-center mb-5">
          <div className="badge-frosted d-inline-flex align-items-center gap-2 mb-3 text-uppercase">
            <span className="glow-ring" aria-hidden="true">
              🪐
            </span>
            <span className="fw-semibold">Secret Cookie Jar Mission</span>
          </div>
          <h1 className="fw-bold display-5 cookie-constellation">
            Nebula Cookie Conservatory
          </h1>
          <p className="helper-text max-width-md mx-auto">
            Drop encrypted treats into the communal vault and watch the constellation grow. Only a coordinated reveal will decode the stash for the whole expedition.
          </p>
        </header>

        <section className="halo-card halo-card--accent p-4 p-lg-5">
          {!isConnected ? (
            <div className="text-center d-flex flex-column align-items-center gap-4">
              <p className="helper-text max-width-md">
                Dock a wallet to join the crew and contribute homomorphically scrambled cookie crumbs. We will keep the total cloaked until the reveal.
              </p>
              <button
                className="btn-nebula"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Linking wallet…" : "Launch wallet link"}
              </button>
              <div className="sparkle-separator max-width-md mx-auto">
                <span>Supported connectors</span>
              </div>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {connectors.map((connector) => (
                  <span key={connector.uid} className="wallet-chip">
                    <span role="img" aria-hidden="true">
                      ✨
                    </span>
                    <span>{connector.name}</span>
                    {!connector.ready && <small>(unavailable)</small>}
                  </span>
                ))}
              </div>
              {!connectorsReady && (
                <p className="status-toast mb-0 max-width-md mx-auto">
                  MetaMask extension not detected. Install it or open the app in a MetaMask-enabled browser to start baking in orbit.
                </p>
              )}
              {connectError && (
                <p className="status-toast mb-0 max-width-md mx-auto">
                  {connectError.message}
                </p>
              )}
            </div>
          ) : (
            <div className="row g-4 g-lg-5">
              <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <span className="badge-frosted">Crew Access Granted</span>
                <span className="wallet-chip">
                  <span role="img" aria-hidden="true">
                    🔐
                  </span>
                  <span>Wallet</span>
                  <code>{address?.slice(0, 6)}…{address?.slice(-4)}</code>
                </span>
              </div>

              <div className="col-lg-5">
                <div className="halo-card p-4 h-100 d-flex flex-column align-items-center text-center gap-3">
                  <p className="helper-text mb-0">Cosmic jar telemetry</p>
                  <div className="cookie-orbit">
                    <span aria-live="polite">{jarDisplay}</span>
                  </div>
                  {revealedTotal !== null ? (
                    <p className="fw-semibold text-warning mb-0">
                      🍪 Total cookies decoded: {revealedTotal}
                    </p>
                  ) : (
                    <p className="helper-text mb-0">
                      Quantum crumbs remain encrypted. Trigger a reveal when the squad is ready.
                    </p>
                  )}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="d-grid gap-4 h-100">
                  <div className="halo-card p-4">
                    <p className="helper-text mb-3">
                      Set your payload of cookies to beam into the jar (1 - 5).
                    </p>
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center">
                      <label className="fw-semibold text-uppercase small" htmlFor="cookie-input">
                        Cookie payload
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
                    <button
                      className="btn-nebula mt-4 w-100 w-md-auto"
                      onClick={() => addCookies.mutate(cookies)}
                      disabled={addCookies.isPending || cookies < 1 || cookies > 5}
                    >
                      {addCookies.isPending ? "Sealing cookies…" : "Add encrypted cookies"}
                    </button>
                  </div>

                  <div className="d-flex flex-column flex-md-row gap-3">
                    <button
                      className="btn-outline-aurora flex-grow-1"
                      onClick={handleReveal}
                      disabled={revealButtonBusy}
                    >
                      {revealButtonBusy ? "Decrypting jar…" : revealButtonLabel}
                    </button>
                    <button
                      className="btn-outline-danger-aurora"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </button>
                  </div>

                  {(addCookies.isError || revealTotal.isError || totalQuery.isError) && (
                    <p className="status-toast mb-0">
                      {(addCookies.error || revealError)?.message || "Something went wrong"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="text-center helper-text small mt-5 max-width-md mx-auto">
          Fully homomorphic encryption keeps every drop cloaked. We only light up the constellation when you call for the grand reveal.
        </footer>
      </div>
    </div>
  );
}
`}
        />
        <p className="text-sm text-muted-foreground">
          The nebula skin lives in two style sheets—one for global variables and one for component-specific flourishes. Create them next.
        </p>
        <CodeBlock
          title="src/App.css"
          language="css"
          code={String.raw`.app-shell {
  padding-block: 4rem;
}

.glow-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(247, 185, 61, 0.18);
  box-shadow: 0 0 12px rgba(247, 185, 61, 0.25);
  color: var(--accent-strong);
}

.halo-card {
  background: var(--frosted-panel);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  backdrop-filter: blur(18px);
  box-shadow: 0 12px 36px rgba(5, 8, 26, 0.55);
}

.halo-card--accent {
  border: 1px solid rgba(247, 185, 61, 0.3);
  box-shadow: 0 16px 40px rgba(247, 185, 61, 0.25);
}

.badge-frosted {
  background: rgba(255, 255, 255, 0.08);
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-strong);
}

.cookie-constellation {
  font-size: clamp(1.8rem, 5vw, 3.2rem);
  letter-spacing: 0.05em;
  color: var(--text-strong);
  text-shadow: 0 10px 24px rgba(8, 10, 42, 0.6);
}

.cookie-orbit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(247, 185, 61, 0.25) 0%, rgba(14, 16, 43, 0.45) 70%);
  border-radius: 24px;
  padding: 2rem;
  min-height: 8rem;
  width: 100%;
  max-width: 28rem;
  margin-inline: auto;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 45px rgba(10, 12, 36, 0.4);
}

.cookie-orbit span {
  font-size: clamp(2.4rem, 7vw, 3.8rem);
}

.btn-nebula {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, #ffd479 75%, #ffe8ab 100%);
  border: none;
  color: #1b113a;
  font-weight: 700;
  padding: 0.8rem 1.6rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-nebula:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(247, 185, 61, 0.3);
}

.btn-nebula:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-aurora,
.btn-outline-danger-aurora {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-outline-aurora {
  border: 1px solid rgba(247, 245, 255, 0.45);
  background: rgba(255, 255, 255, 0.04);
  color: #f7f5ff;
  font-weight: 600;
}

.btn-outline-aurora:hover:not(:disabled) {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.btn-outline-aurora:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline-danger-aurora {
  border: 1px solid rgba(255, 95, 126, 0.45);
  background: rgba(255, 95, 126, 0.08);
  color: #ff8fa5;
  font-weight: 600;
}

.btn-outline-danger-aurora:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(255, 95, 126, 0.3);
}

.btn-outline-danger-aurora:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.floating-pip {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247, 185, 61, 0.35) 0%, rgba(247, 185, 61, 0.05) 70%, transparent 100%);
  filter: blur(0.5px);
  opacity: 0.7;
  animation: drift 18s linear infinite;
}

.floating-pip:nth-child(1) {
  top: 12%;
  left: 10%;
  animation-duration: 22s;
}

.floating-pip:nth-child(2) {
  bottom: 15%;
  right: 6%;
  animation-duration: 26s;
}

@keyframes drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(20px, -18px, 0) scale(1.05);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

.wallet-chip {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.95rem;
  color: var(--text-strong);
}

.wallet-chip code {
  font-family: "Source Code Pro", "Courier New", monospace;
  letter-spacing: 0.05em;
}

.helper-text {
  color: rgba(251, 249, 255, 0.82);
  font-size: 0.95rem;
}

.max-width-md {
  max-width: 38rem;
}

.sparkle-separator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 222, 140, 0.9);
}

.sparkle-separator::before,
.sparkle-separator::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(247, 185, 61, 0.6), transparent);
}

.status-toast {
  background: rgba(8, 11, 51, 0.85);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  color: #ffc3d2;
}
`}
        />
        <CodeBlock
          title="src/index.css"
          language="css"
          code={String.raw`:root {
  font-family: "Trebuchet MS", "Segoe UI", system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  font-weight: 400;
  color-scheme: dark;
  color: #f7f5ff;
  background-color: #060821;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --nebula-night: radial-gradient(circle at 20% 20%, #2a1f6b 0%, rgba(6, 8, 33, 0.35) 55%),
    radial-gradient(circle at 75% 10%, rgba(252, 191, 73, 0.35) 0%, rgba(6, 8, 33, 0.15) 45%),
    linear-gradient(160deg, #060821 0%, #120f3b 55%, #1f0f38 100%);
  --starlight: rgba(255, 255, 255, 0.12);
  --frosted-panel: rgba(14, 17, 56, 0.75);
  --accent: #f7b93d;
  --accent-soft: rgba(247, 185, 61, 0.2);
  --accent-strong: #ffde8c;
  --danger: #ff5f7e;
  --text-strong: #fbf9ff;
  --text-muted: rgba(247, 245, 255, 0.78);
}

a {
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--accent-strong);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: var(--nebula-night);
  display: block;
  color: var(--text-strong);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(1px 1px at 30% 20%, rgba(255, 255, 255, 0.35) 0, transparent 60%),
    radial-gradient(1px 1px at 60% 65%, rgba(255, 255, 255, 0.18) 0, transparent 55%),
    radial-gradient(1px 1px at 80% 30%, rgba(255, 255, 255, 0.22) 0, transparent 50%);
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
}

#root {
  min-height: 100vh;
}

input {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: inherit;
  padding: 0.65em 1em;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 0.25rem var(--accent-soft);
  outline: none;
}

.card,
.card-body {
  background: transparent;
}

.text-secondary {
  color: var(--text-muted) !important;
}

.text-warning {
  color: rgba(255, 230, 170, 0.92) !important;
}

small {
  color: var(--text-muted);
}

@media (max-width: 576px) {
  header .display-5 {
    font-size: 2.2rem;
  }
}
`}
        />
        <p className="text-sm text-muted-foreground">
          The <code>Reveal total cookies</code> button triggers the contract call the first time and switches to a lightweight decrypt once the jar is public, so repeat reveals never burn
          extra gas. The themed helpers keep foreground/backdrop contrast accessible even on low-brightness displays.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-success" />
          Final Checks
        </h3>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="text-sm text-muted-foreground space-y-2 pt-6">
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
