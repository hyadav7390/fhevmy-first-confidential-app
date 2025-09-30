import { Shield, GitBranch, Workflow, Binary, KeySquare, RefreshCw } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepTwoFheUpgrade = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          Install FHEVM Primitives
        </h3>
        <p className="text-muted-foreground">
          Zama’s toolchain lives in <code className="bg-code-bg px-1 py-0.5 rounded text-accent">@fhevm/solidity</code> and
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">encrypted-types</code>. These packages expose the
          <code>FHE</code> helpers and encrypted value types that mirror the plaintext contract from Step&nbsp;1.
        </p>
        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install @fhevm/solidity@0.8.0 @zama-fhe/oracle-solidity@0.1.0 encrypted-types@0.0.4`}
        />
        <p className="text-sm text-muted-foreground">
          The Solidity library ships the Sepolia config used by the relayer SDK, so contract and frontend always share the same
          ACL/KMS/coprocessor addresses.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-accent" />
          Rewrite the Jar with Encrypted State
        </h3>
        <p className="text-muted-foreground space-y-1">
          <span className="block">
            Replace the plain cookie jar with an FHE-enabled version. Every line wires the contract to Sepolia’s Zama
            infrastructure, stores ciphertext, or emits metadata the frontend can use without revealing contributions.
          </span>
          <span className="block">
            We keep emitting the encrypted handle for each contribution—frontends never learn who added how many cookies.
          </span>
        </p>
        <CodeBlock
          title="contracts/EncryptedCookieJar.sol"
          language="solidity"
          code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptedCookieJar is SepoliaConfig {
    euint32 private totalCookies;

    event CookiesAdded(address indexed baker, bytes32 encryptedAmountHandle);
    event JarUnlocked(address indexed caller);

    constructor() {
        totalCookies = FHE.asEuint32(0);
        FHE.allowThis(totalCookies);
    }

    function addCookies(externalEuint32 encryptedAmount, bytes calldata inputProof) external {
        euint32 amount = FHE.fromExternal(encryptedAmount, inputProof);
        totalCookies = FHE.add(totalCookies, amount);
        FHE.allowThis(totalCookies);
        FHE.allow(totalCookies, msg.sender);
        emit CookiesAdded(msg.sender, externalEuint32.unwrap(encryptedAmount));
    }

    function encryptedTotal() external view returns (bytes32) {
        return euint32.unwrap(totalCookies);
    }

    function revealTotal() external {
        totalCookies = FHE.makePubliclyDecryptable(totalCookies);
        emit JarUnlocked(msg.sender);
    }
}
`}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card/60 border-card-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Binary className="h-4 w-4 text-accent" />
                Storage & Arithmetic
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Encrypted cookies:</strong> <code>euint32</code> mirrors the plaintext <code>uint32</code> from Step&nbsp;1. Reusing <code>SepoliaConfig</code> keeps the on-chain ACL, executor, payment, and verifier addresses in sync with the frontend defaults.
                After every update we authorise both the contract (<code>FHE.allowThis</code>) and the caller (<code>FHE.allow</code>) so the relayer can process reveal requests later without running into “Invalid index” errors.
              </p>
              <p>
                <strong>No plaintext crumbs:</strong> Players submit encrypted handles + proofs. We log the handle for debugging, but
                there’s no way to recover the amount without the relayer’s decryption flow.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-card-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeySquare className="h-4 w-4 text-accent" />
                Reads & Reveals
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                The new <code>encryptedTotal()</code> view returns the ciphertext handle as a <code>bytes32</code>. The frontend will pass
                that handle to the relayer SDK for public decryption when it’s time to reveal the jar.
              </p>
              <p>
                Want to verify the jar on-chain before the reveal? Add additional encrypted comparisons using
                <code>FHE.gt</code>, <code>FHE.eq</code>, and friends—they behave just like in the baseline contract.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-muted/20 border-card-border">
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground pt-6">
            <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-accent mt-0.5" />
              <p>
                We’re still emitting events, but they now carry encrypted handles instead of cookie counts. The relayer will use
                those handles when a user requests a personalised or public decryption.
              </p>
            </div>
            <p>
              Run <code>npx hardhat test</code> again. The plaintext tests still work (hardhat compiles both contracts), and fresh
              encrypted logic hasn’t leaked any cookie counts.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base text-accent flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Encryption → Computation → Decryption
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Encryption:</strong> Each baker encrypts their cookie count client side.</li>
            <li><strong>Computation:</strong> The contract adds ciphertexts with <code>FHE.add</code>, keeping intermediate sums secret.</li>
            <li><strong>Decryption:</strong> Later we’ll call the relayer to decrypt <code>encryptedTotal()</code> for everyone.</li>
          </ul>
          <p>
            With the encrypted jar deployed and tested, Step&nbsp;3 will connect Hardhat to Sepolia so you can ship it to the
            FHE-enabled testnet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwoFheUpgrade;
