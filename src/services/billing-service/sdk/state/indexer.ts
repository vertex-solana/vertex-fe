import { PublicKey } from "@solana/web3.js";
import { Program } from "anchor-v31";
import BN from "bn.js";
import { VertexProgram } from "../idl/vertex_program";

export interface IIndexer {
  owner: PublicKey;
  bump: number;
  indexerId: BN;
  pricePerGbLamports: BN;
  rentLamports: BN;
}

export class Indexer {
  state?: IIndexer;
  address: PublicKey;

  constructor(address: PublicKey) {
    this.address = address;
  }

  async getTotalSol(program: Program<VertexProgram>): Promise<number> {
    const indexerInfo = await program.provider.connection.getAccountInfo(
      this.address
    );
    if (!indexerInfo) return 0;

    const indexer = program.coder.accounts.decode(
      "indexer",
      indexerInfo.data
    ) as IIndexer;

    return (
      (indexerInfo.lamports - indexer.rentLamports.toNumber()) / Math.pow(10, 9)
    );
  }
}
