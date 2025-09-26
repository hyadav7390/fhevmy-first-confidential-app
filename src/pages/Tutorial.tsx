import { useState } from "react";
import TutorialStep from "@/components/TutorialStep";
import {
  Code2,
  Shield,
  Settings,
  Monitor,
  Wallet,
  Rocket,
} from "lucide-react";
import StepOnePlainContract from "./tutorial/steps/StepOnePlainContract";
import StepTwoFheUpgrade from "./tutorial/steps/StepTwoFheUpgrade";
import StepThreeHardhatConfig from "./tutorial/steps/StepThreeHardhatConfig";
import StepFourReactFrontend from "./tutorial/steps/StepFourReactFrontend";
import StepFiveWalletIntegration from "./tutorial/steps/StepFiveWalletIntegration";
import StepSixShipIt from "./tutorial/steps/StepSixShipIt";

const steps = [
  {
    title: "Create a Plain Solidity Contract",
    description:
      "Lay the groundwork with a vanilla Hardhat project and a simple counter contract so the FHE-specific changes are easy to follow.",
    icon: Code2,
    Component: StepOnePlainContract,
  },
  {
    title: "Convert the Counter to FHEVM",
    description:
      "Swap unsigned integers for encrypted types, refactor reads and writes, and understand the encryption → computation → re-encryption loop.",
    icon: Shield,
    Component: StepTwoFheUpgrade,
  },
  {
    title: "Configure Hardhat for FHEVM",
    description:
      "Tune the Hardhat toolchain for Zama's devnet, manage environment secrets, and create a reproducible deployment script.",
    icon: Settings,
    Component: StepThreeHardhatConfig,
  },
  {
    title: "Build the React Frontend",
    description:
      "Scaffold a Vite + TypeScript UI, wire in Tailwind, and prepare client helpers for encryption and decryption.",
    icon: Monitor,
    Component: StepFourReactFrontend,
  },
  {
    title: "Add Wallet Connectivity with Wagmi",
    description:
      "Use Wagmi to connect wallets, encrypt inputs on the client, call the contract, and decrypt results safely.",
    icon: Wallet,
    Component: StepFiveWalletIntegration,
  },
  {
    title: "Ship Your Confidential dApp",
    description:
      "Glue the providers together, point the frontend at your deployed contract, and run through final launch checks.",
    icon: Rocket,
    Component: StepSixShipIt,
  },
] as const;

const Tutorial = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = steps.length;
  const { title, description, Component, icon: Icon } = steps[stepIndex];

  const handlePrevious = stepIndex > 0 ? () => setStepIndex((value) => value - 1) : undefined;
  const handleNext = stepIndex < totalSteps - 1 ? () => setStepIndex((value) => value + 1) : undefined;

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="container mx-auto px-6">
        <TutorialStep
          title={title}
          description={description}
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isCompleted={stepIndex === totalSteps - 1}
          icon={<Icon className="h-6 w-6" />}
        >
          <Component />
        </TutorialStep>
      </div>
    </div>
  );
};

export default Tutorial;
