import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, Code2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-card-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-accent animate-glow" />
              <div className="absolute -inset-1 bg-accent/20 rounded-full blur-sm group-hover:bg-accent/30 transition-all duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FHEVM Tutorial</h1>
              <p className="text-xs text-muted-foreground">Learn Confidential Computing</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors hover:text-accent ${
                location.pathname === "/" ? "text-accent" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/tutorial"
              className={`text-sm transition-colors hover:text-accent ${
                location.pathname.startsWith("/tutorial") ? "text-accent" : "text-muted-foreground"
              }`}
            >
              Tutorial
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex border-primary/20 hover:border-primary hover:bg-primary/10"
            >
              <a 
                href="https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Code2 className="h-4 w-4" />
                Docs
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Link to="/tutorial" className="flex items-center gap-2">
                Start Tutorial
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;