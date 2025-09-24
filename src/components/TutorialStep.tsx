import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface TutorialStepProps {
  title: string;
  description: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  isCompleted?: boolean;
}

const TutorialStep = ({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isCompleted = false
}: TutorialStepProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold
            ${isCompleted 
              ? 'bg-success/10 border-success text-success' 
              : 'bg-primary/10 border-primary text-primary'
            }
          `}>
            {isCompleted ? <CheckCircle className="h-6 w-6" /> : currentStep}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Step Content */}
      <Card className="bg-gradient-card border-card-border shadow-card mb-8">
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={!onPrevious}
          className="border-primary/20 hover:border-primary hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${i < currentStep 
                  ? 'bg-accent' 
                  : i === currentStep - 1 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }
              `}
            />
          ))}
        </div>

        <Button
          onClick={onNext}
          disabled={!onNext}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TutorialStep;