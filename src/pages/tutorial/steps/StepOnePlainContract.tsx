import { Code2, TestTubes, ClipboardList } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepOnePlainContract = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Scaffold the Cookie Jar Workspace
        </h3>
        <p className="text-muted-foreground">
          Before we hide numbers behind homomorphic encryption, we’ll rehearse the entire flow with plain integers. Think of
          this step as setting the stage for our “Secret Cookie Jar” dApp: a friendly Hardhat workspace, TypeScript support, and a
          deliberately tiny contract that we can later encrypt without changing the public API.
        </p>
        <p className="text-sm text-muted-foreground">
          Use Node.js 22 or newer for the Hardhat toolchain. If you manage Node with nvm, run <code>nvm install 22</code> followed by
          <code>nvm use 22</code> before continuing.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`mkdir secret-cookie-jar && cd secret-cookie-jar
npm init -y
npm install --save-dev hardhat@2.26.0 @nomicfoundation/hardhat-toolbox@6.1.0 typescript@5.4.5 ts-node@10.9.2 @types/node@20.11.30`}
        />
        <p className="text-sm text-muted-foreground space-y-2">
          <span className="block">
            Pinning the versions keeps Hardhat 2.x happy and avoids peer-dependency drama. We skip the interactive
            <code> hardhat init</code> command so the folder remains lean.
          </span>
          <span className="block">
            Next, wire up TypeScript by hand. The configs below mirror what the template would have produced, minus the
            boilerplate we don’t need.
          </span>
        </p>
        <CodeBlock
          title="hardhat.config.ts"
          language="typescript"
          code={`import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};

export default config;`}
        />
        <p className="text-sm text-muted-foreground">
          Create <code>hardhat.config.ts</code> first so editors instantly see a file that the TypeScript configuration can
          include. Once the config is in place, add the <code>tsconfig.json</code> below.
        </p>
        <CodeBlock title="tsconfig.json" language="json" code={`{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "types": ["node", "hardhat"]
  },
  "include": [
    "hardhat.config.ts",
    "scripts/**/*.ts",
    "tasks/**/*.ts",
    "test/**/*.ts"
  ],
  "exclude": ["node_modules"]
}`} />
        <p className="text-sm text-muted-foreground">
          Matching the Solidity pragma (0.8.24) keeps Hardhat happy, and the optimizer settings transfer cleanly to the encrypted
          version we’ll build later. In Step&nbsp;3 we’ll extend this with Sepolia network settings and environment variables.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Bake a Plain Cookie Jar Contract
        </h3>
        <p className="text-muted-foreground">
          The non-encrypted version keeps things playful: every baker can drop 1–5 cookies into the jar, and anyone can trigger a
          reveal that shouts the total.
        </p>
        <CodeBlock
          title="contracts/CookieJar.sol"
          language="solidity"
          code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CookieJar {
    uint32 private totalCookies;

    event CookiesAdded(address indexed baker, uint32 amount, uint32 previousTotal, uint32 newTotal);
    event JarRevealed(address indexed caller, uint32 totalCookies);

    function addCookies(uint32 amount) external {
        require(amount > 0 && amount <= 5, "add between 1 and 5 cookies");
        uint32 previousTotal = totalCookies;
        totalCookies = previousTotal + amount;
        emit CookiesAdded(msg.sender, amount, previousTotal, totalCookies);
    }

    function revealTotal() external returns (uint32) {
        emit JarRevealed(msg.sender, totalCookies);
        return totalCookies;
    }

    function currentTotal() external view returns (uint32) {
        return totalCookies;
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
          Quick tests keep the upcoming FHE refactor honest. Drop the snippet into
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">test/CookieJar.ts</code> and run Hardhat — TypeScript tests
          work out of the box.
        </p>
        <CodeBlock
          title="test/CookieJar.ts"
          language="typescript"
          code={`import { expect } from "chai";
import { ethers } from "hardhat";

describe("CookieJar", () => {
  it("collects cookies and reveals the total", async () => {
    const [baker] = await ethers.getSigners();
    const CookieJar = await ethers.getContractFactory("CookieJar");
    const jar = await CookieJar.deploy();
    await jar.waitForDeployment();

    expect(await jar.currentTotal()).to.equal(0);

    await expect(jar.addCookies(2))
      .to.emit(jar, "CookiesAdded")
      .withArgs(baker.address, 2, 0, 2);

    await expect(jar.addCookies(3))
      .to.emit(jar, "CookiesAdded")
      .withArgs(baker.address, 3, 2, 5);

    expect(await jar.revealTotal.staticCall()).to.equal(5);
    await expect(jar.revealTotal())
      .to.emit(jar, "JarRevealed")
      .withArgs(baker.address, 5);
  });
});
`}
        />
        <CodeBlock title="Run the tests" language="bash" code={`npx hardhat test`} />
      </section>

      <Card className="bg-success/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-base text-success">✅ Outcome</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>The foundation is ready for encryption:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Cookie jar events narrate who contributed and how the total changed</li>
            <li>A reveal path we can later swap for relayer-powered decryption</li>
            <li>Lean Hardhat tooling wired for TypeScript</li>
            <li>A regression suite you can run after every FHE iteration</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOnePlainContract;
