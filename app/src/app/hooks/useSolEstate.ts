import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../utils/constants";
import idl from "../idl/idl.json";

export function useSolEstate() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const getProgram = () => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    setProvider(provider);

    const idlObject = (idl as any).default ? (idl as any).default : idl;

    console.log("Current IDL:", idlObject);
    console.log("Program ID:", PROGRAM_ID.toString());

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const program = new Program(idlObject, provider);

      return program;
    } catch (e) {
      console.error("Program creation failed:", e);
      return null;
    }
  };

  return { getProgram, wallet };
}
