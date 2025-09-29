import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { getCookieJarContract, buildEncryptedCookies, ensureFhevmInstance } from "../lib/fhevm";

const COOKIE_TOTAL_QUERY_KEY = ["cookie-total"] as const;

export function useCookieJar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  const addCookies = useMutation({
    mutationFn: async (amount: number) => {
      if (!address || !isConnected) throw new Error("Connect a wallet first");
      const contract = await getCookieJarContract();
      const { handle, inputProof } = await buildEncryptedCookies(amount, address);
      return contract.addCookies(handle, inputProof);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: COOKIE_TOTAL_QUERY_KEY });
    },
  });

  const totalQuery = useQuery({
    queryKey: COOKIE_TOTAL_QUERY_KEY,
    enabled: false,
    queryFn: async () => {
      const contract = await getCookieJarContract();
      const encryptedHandle = await contract.encryptedTotal();
      const handleHex = ethers.hexlify(encryptedHandle);
      const fhe = await ensureFhevmInstance();
      const decrypted = await fhe.publicDecrypt([handleHex]);
      const total = decrypted[handleHex];
      if (total === undefined) {
        throw new Error("Unable to decrypt cookie jar");
      }
      return Number(total);
    },
  });

  return {
    isConnected,
    address,
    connect,
    connectors,
    isConnecting: isPending,
    connectError,
    disconnect,
    addCookies,
    totalQuery,
  };
}
