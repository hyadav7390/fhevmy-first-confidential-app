import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeatureCard from "@/components/FeatureCard";
import {
  Shield,
  Code2,
  Lock,
  Rocket,
  ChevronRight,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  Cpu,
  Lightbulb,
  Monitor
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encryption.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Privacy on-chain, explained for humans</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Ship a Confidential dApp
              <span className="block bg-gradient-accent bg-clip-text text-transparent animate-glow">
                without touching heavy cryptography
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Zama’s FHEVM lets regular Solidity developers run computations on encrypted data. This tutorial breaks the
              flow down into friendly steps—no advanced maths, just the tooling you already know.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                <Link to="/tutorial" className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Start Tutorial
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/20 hover:border-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                <a
                  href="https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Read Docs
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Zama in Plain Words</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Zama builds the Fully Homomorphic Encryption Virtual Machine (FHEVM)—an EVM where you can keep inputs,
              state, and outputs encrypted end to end. Think of it as privacy mode for smart contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Data Stays Secret"
              description="Numbers and booleans are stored as ciphertext. Validators execute functions without learning the underlying values."
              accent
            />
            <FeatureCard
              icon={<Cpu className="h-6 w-6" />}
              title="Works Like Solidity"
              description="Use familiar contracts, events, and tooling. FHEVM exposes encrypted types that behave like their uint and bool cousins."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Ready for Builders"
              description="Hardhat, React, wagmi—everything fits. The tutorial shows exactly where FHE-specific bits slot into your workflow."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {privacyStages.map((stage, index) => (
              <Card key={stage.title} className="bg-gradient-card border-card-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    {stage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>{stage.description}</p>
                  <p className="text-xs uppercase tracking-wide text-primary">{stage.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What You Will Build</h2>
            <p className="text-lg text-muted-foreground">
              A confidential counter dApp: Solidity contract, Hardhat deployment, and a React dashboard that encrypts inputs
              and decrypts responses right in the browser.
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {tutorialSteps.map((step, index) => (
              <Card
                key={step.title}
                className="bg-gradient-card border-card-border hover:border-primary/30 transition-all duration-300 hover:shadow-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-full w-10 h-10 flex items-center justify-center text-primary font-semibold text-base">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {step.icon}
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                    <div className="text-muted-foreground hidden sm:block">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Built for Web3 Developers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>You only need basic Solidity and React skills. Every cryptography concept is introduced in plain language.</p>
                <p>Follow along at your own pace, copy snippets directly, and rerun the provided tests after each change.</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Prerequisites Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Node.js 22+ and npm (run <code>nvm use 22</code> before installing dependencies)</li>
                  <li>Hardhat familiarity (compile, deploy, run tests)</li>
                  <li>Browser wallet such as MetaMask</li>
                  <li>Optional: a funded account on Zama Devnet for live testing</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Link to="/tutorial" className="flex items-center gap-2">
                Start Your Journey
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const privacyStages = [
  {
    title: "Encrypt on the client",
    description: "Inputs are scrambled in the browser using Zama's relayer SDK before they touch the blockchain.",
    label: "Frontend",
  },
  {
    title: "Compute without peeking",
    description: "Contracts call TFHE helpers to add, compare, or reset values while everything stays encrypted.",
    label: "On-chain",
  },
  {
    title: "Decrypt with consent",
    description: "Users request a re-encrypted snapshot, sign a typed message, and decrypt the result locally.",
    label: "Frontend",
  },
];

const tutorialSteps = [
  {
    title: "Understand the baseline",
    description: "Start with a plain counter contract and tests so you know exactly what changes when FHE enters the chat.",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "Upgrade to encrypted types",
    description: "Replace uints with euints, add encrypted math, and keep events intact for UI feedback.",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    title: "Deploy with Hardhat",
    description: "Configure the FHEVM compiler target, manage secrets, and push to Zama Devnet.",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Build a React dashboard",
    description: "Create a clean Vite + Tailwind interface and helper utilities for encryption and decryption.",
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    title: "Connect wallets with Wagmi",
    description: "Guide users through encryption-aware reads and writes using the wagmi hooks you already know.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Ship the dApp",
    description: "Tie everything together, point to the deployed address, and celebrate your first confidential app.",
    icon: <Rocket className="h-5 w-5" />,
  },
];

export default Home;
