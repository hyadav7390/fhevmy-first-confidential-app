import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/FeatureCard";
import { 
  Shield, 
  Code2, 
  Zap, 
  Lock, 
  Rocket, 
  ChevronRight, 
  Users, 
  BookOpen,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encryption.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Confidential Computing Made Simple</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Build Your First{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent animate-glow">
                Confidential dApp
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn FHEVM (Fully Homomorphic Encryption Virtual Machine) through a comprehensive, 
              step-by-step tutorial. Build secure applications where computation happens on encrypted data.
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

      {/* What is FHEVM Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What is FHEVM?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              FHEVM (Fully Homomorphic Encryption Virtual Machine) is Zama's groundbreaking technology 
              that enables smart contracts to perform computations on encrypted data without ever 
              decrypting it. This means you can build applications that are private by design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Privacy-First"
              description="Compute on encrypted data without revealing sensitive information. Your data stays private throughout the entire process."
              accent
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="No Compromise"
              description="Get full computational power while maintaining privacy. No trade-offs between security and functionality."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Developer Friendly"
              description="Use familiar Solidity syntax with built-in encryption types. Easy to learn, powerful to use."
            />
          </div>

          <Card className="bg-gradient-card border-card-border overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Why Choose FHEVM?
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Complete privacy for sensitive data and computations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Layers className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Seamless integration with existing Ethereum infrastructure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Growing ecosystem of privacy-focused applications</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="bg-code-bg border border-code-border rounded-lg p-4">
                    <div className="text-sm font-mono text-foreground">
                      <div className="text-accent">// Encrypted computation</div>
                      <div className="text-muted-foreground">euint32 result = encryptedA</div>
                      <div className="text-muted-foreground ml-4">.add(encryptedB);</div>
                      <div className="text-accent mt-2">// Data stays private!</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tutorial Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What You'll Learn
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive tutorial takes you from Solidity basics to deploying 
              your first confidential application on FHEVM.
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {tutorialSteps.map((step, index) => (
              <Card 
                key={index}
                className="bg-gradient-card border-card-border hover:border-primary/30 transition-all duration-300 hover:shadow-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-full w-8 h-8 flex items-center justify-center text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                    <div className="text-muted-foreground">
                      {step.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

const tutorialSteps = [
  {
    title: "Plain Solidity Contract",
    description: "Start with a simple smart contract using regular Solidity syntax and understand the basics.",
    icon: <Code2 className="h-5 w-5" />
  },
  {
    title: "Convert to FHEVM",
    description: "Transform your contract to use encrypted types and learn about confidential computing.",
    icon: <Lock className="h-5 w-5" />
  },
  {
    title: "Hardhat Setup",
    description: "Configure your development environment with Hardhat for FHEVM compilation and deployment.",
    icon: <Layers className="h-5 w-5" />
  },
  {
    title: "React Frontend",
    description: "Build a clean, modern React application to interact with your smart contract.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    title: "Wallet Integration",
    description: "Connect wallets using wagmi and enable users to interact with your dApp seamlessly.",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Full Integration",
    description: "Bring everything together and deploy your complete confidential application.",
    icon: <Rocket className="h-5 w-5" />
  }
];

export default Home;