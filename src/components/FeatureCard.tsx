import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}

const FeatureCard = ({ icon, title, description, accent = false }: FeatureCardProps) => {
  return (
    <Card 
      className={`
        bg-gradient-card border-card-border hover:border-primary/30 
        transition-all duration-500 hover:shadow-card hover:-translate-y-1
        group relative overflow-hidden
        ${accent ? 'ring-1 ring-accent/20' : ''}
      `}
    >
      {accent && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-accent" />
      )}
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`
            p-3 rounded-xl border transition-all duration-300
            ${accent 
              ? 'bg-accent/10 border-accent/20 text-accent group-hover:shadow-accent' 
              : 'bg-primary/10 border-primary/20 text-primary group-hover:shadow-glow'
            }
          `}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;