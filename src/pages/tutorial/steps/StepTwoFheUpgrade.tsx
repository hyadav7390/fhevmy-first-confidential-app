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
          Swap the plain counter for an FHE-enabled version. Every line below has a purpose: storing ciphertext, keeping
          permissions in sync, or returning data that only the caller can decrypt.
        </p>
        <CodeBlock
          title="contracts/EncryptedCounter.sol"
          language="solidity"
          code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";

contract EncryptedCounter {
    // 1. Ciphertext replaces the plaintext uint32 from Step 1
    euint32 private value;

    event CounterIncremented(address indexed caller);
    event CounterUpdated(address indexed caller, bytes encryptedDelta);

    constructor() {
        // 2. Initialise the ciphertext with TFHE helper + grant the contract read access
        value = TFHE.asEuint32(0);
        TFHE.allow(value, address(this));
    }

    function increment() external {
        // 3. Convert the literal 1 to ciphertext before adding
        value = TFHE.add(value, TFHE.asEuint32(1));
        TFHE.allow(value, address(this));
        emit CounterIncremented(msg.sender);
    }

    function add(bytes calldata encryptedDelta) external {
        // 4. Interpret calldata as an encrypted uint32 coming from the frontend
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
        // 5. Re-encrypt the current counter for the caller's public key
        return TFHE.reencryptEuint32(value, publicKey, signature);
    }

    function compare(bytes calldata encryptedThreshold) external view returns (ebool) {
        // 6. Even comparisons happen on encrypted inputs
        euint32 threshold = TFHE.asEuint32(encryptedThreshold);
        return TFHE.gt(value, threshold);
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
                <strong>Encrypted state:</strong> <code>euint32</code> is the encrypted twin of <code>uint32</code>. The TFHE helpers
                return fresh ciphertexts every time, so we immediately call <code>TFHE.allow</code> to whitelist the contract for
                future reads and writes.
              </p>
              <p>
                <strong>Math helpers:</strong> <code>TFHE.add</code> replaces the <code>+</code> operator. Constants such as <code>1</code>
                must be converted with <code>TFHE.asEuint32</code> before participating in arithmetic.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-card-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeySquare className="h-4 w-4 text-accent" />
                Inputs & Outputs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Encrypted calldata:</strong> the frontend encrypts user numbers into bytes. The contract interprets these bytes
                with <code>TFHE.asEuint32</code> so no plaintext ever appears on-chain.
              </p>
              <p>
                <strong>Controlled reads:</strong> <code>viewCounter</code> does not decrypt anything. Instead it uses
                <code>TFHE.reencryptEuint32</code> so only the caller—who supplied the matching public key and signature produced by the
                Zama re-encryption service—can recover the value client-side.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-muted/20 border-card-border">
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-accent mt-0.5" />
              <p>
                <strong>Comparisons and branching:</strong> <code>TFHE.gt</code> returns an <code>ebool</code>—an encrypted boolean.
                You can feed the result into other TFHE helpers (for example <code>TFHE.select</code>) to build larger privacy-preserving
                workflows without revealing interim states.
              </p>
            </div>
            <p>
              Run <code>npx hardhat test</code> again. Even though the assertions now decrypt the encrypted result, the contract API is
              unchanged, so your Step 1 tests should still pass. That parity is your safety net while iterating on FHE logic.
            </p>
          </CardContent>
        </Card>
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
