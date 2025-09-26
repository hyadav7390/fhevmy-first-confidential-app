import { Shield, GitBranch, Workflow } from "lucide-react";
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
          Replace unsigned integers with their encrypted equivalents. The
          <code className="bg-code-bg px-1 py-0.5 rounded text-accent">fhevm</code> package ships the TFHE helpers that
          mirror the standard Solidity arithmetic we just wrote.
        </p>
        <CodeBlock title="Terminal" language="bash" code={`npm install fhevm`} />
        <p className="text-sm text-muted-foreground">
          The dependency adds encrypted numeric types (for example <code>euint32</code>) and math utilities such as
          <code>TFHE.add</code>. They feel familiar once you see them side by side with their plaintext cousins.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-accent" />
          Rewrite the Counter with Encrypted State
        </h3>
        <p className="text-muted-foreground">
          Swap the plain counter for an FHE-enabled one. Notice how every interaction either converts incoming bytes to
          encrypted values or exposes ciphertext back to the caller.
        </p>
        <CodeBlock
          title="contracts/EncryptedCounter.sol"
          language="solidity"
          code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";

contract EncryptedCounter {
    euint32 private value;

    event CounterIncremented(address indexed caller);
    event CounterUpdated(address indexed caller, bytes encryptedDelta);

    constructor() {
        value = TFHE.asEuint32(0);
        TFHE.allow(value, address(this));
    }

    function increment() external {
        value = TFHE.add(value, TFHE.asEuint32(1));
        TFHE.allow(value, address(this));
        emit CounterIncremented(msg.sender);
    }

    function add(bytes calldata encryptedDelta) external {
        euint32 delta = TFHE.asEuint32(encryptedDelta);
        value = TFHE.add(value, delta);
        TFHE.allow(value, address(this));
        emit CounterUpdated(msg.sender, encryptedDelta);
    }

    function viewCounter(bytes32 publicKey, bytes calldata signature)
        external
        view
        returns (bytes memory)
    {
        return TFHE.reencryptEuint32(value, publicKey, signature);
    }

    function compare(bytes calldata encryptedThreshold) external view returns (ebool) {
        euint32 threshold = TFHE.asEuint32(encryptedThreshold);
        return TFHE.gt(value, threshold);
    }
}
`}
        />
        <p className="text-sm text-muted-foreground">
          The <code>viewCounter</code> function never reveals the raw number. Instead it re-encrypts the latest state under a
          user-provided key so only that user can decrypt it off-chain. The <code>signature</code> parameter should be produced by
          the client with the re-encryption key provided by Zama's key management service, mirroring the official quick-start flow.
        </p>
      </section>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base text-accent flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Encryption → Computation → Re-encryption
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Encryption:</strong> Frontend encrypts inputs with <code>fhevmjs</code> before calling <code>add</code>.</li>
            <li><strong>Computation:</strong> Functions use <code>TFHE.add</code> or <code>TFHE.gt</code> directly on encrypted types.</li>
            <li><strong>Re-encryption:</strong> Callers run <code>viewCounter</code> with their public key to receive a ciphertext they can decrypt locally.</li>
          </ul>
          <p>
            You can repeat the test suite from Step 1 after swapping the imports. Focus on behavioural parity: the public API
            is unchanged, only the data representation differs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwoFheUpgrade;
