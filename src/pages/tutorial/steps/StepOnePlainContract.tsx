import { Code2, TestTubes, ClipboardList } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepOnePlainContract = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Scaffold a Standard Hardhat Project
        </h3>
        <p className="text-muted-foreground">
          We start with an everyday Solidity setup so that new concepts can be layered on gradually. Use a
          fresh Hardhat workspace; the same folder will later evolve into your FHEVM build.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`mkdir confidential-counter && cd confidential-counter
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
echo "" > hardhat.config.js
npx hardhat init`}
        />
        <p className="text-sm text-muted-foreground">
          Accept the default answers when Hardhat asks about the project type. The toolbox plugin bundles
          ethers, chai, and helpful matchers so we can focus on the contract logic.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Build a Baseline Counter Contract
        </h3>
        <p className="text-muted-foreground">
          Create <code className="bg-code-bg px-1 py-0.5 rounded text-accent">contracts/Counter.sol</code> with a
          deliberately small API. Keeping the surface area narrow makes it obvious what changes once we
          introduce FHE-specific types.
        </p>
        <CodeBlock
          title="contracts/Counter.sol"
          language="solidity"
          code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint32 private value;

    event CounterIncremented(uint32 newValue);
    event CounterUpdated(uint32 delta, uint32 total);

    function increment() external {
        value += 1;
        emit CounterIncremented(value);
    }

    function add(uint32 delta) external {
        require(delta > 0, "value must be positive");
        value += delta;
        emit CounterUpdated(delta, value);
    }

    function current() external view returns (uint32) {
        return value;
    }
}
`}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <TestTubes className="h-5 w-5 text-primary" />
          Add a Lightweight Safety Net
        </h3>
        <p className="text-muted-foreground">
          Quick tests make the upcoming FHE refactor less scary. Drop the snippet into
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">test/Counter.ts</code> (Hardhat will happily run
          TypeScript tests).
        </p>
        <CodeBlock
          title="test/Counter.ts"
          language="typescript"
          code={`import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", () => {
  it("tracks increments and additions", async () => {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.waitForDeployment();

    expect(await counter.current()).to.equal(0);
    await counter.increment();
    expect(await counter.current()).to.equal(1);

    await counter.add(4);
    expect(await counter.current()).to.equal(5);
  });
});
`}
        />
        <CodeBlock title="Run the tests" language="bash" code={`npx hardhat test`} />
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">
            ✅ Outcome
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>You now understand the behaviour we are about to preserve under encryption:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Simple state changes and events for UI feedback</li>
            <li>Minimal read/write API to swap to encrypted types later</li>
            <li>A regression suite you can rerun after every migration step</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOnePlainContract;
