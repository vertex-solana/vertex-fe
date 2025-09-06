import { PublicKey } from "@solana/web3.js";
import { Program } from "anchor-v31";
import BN from "bn.js";
import { VertexProgram } from "../idl/vertex_program";
import { BILLING_PENDING, DEFAULT_INDEXER_ID } from "../common";

interface IReadDebt {
  indexerId: BN;
  bytesAccumulated: BN;
  pricePerGbLamports: BN;
}

export interface IUserVault {
  owner: PublicKey;
  bump: number;
  storageBytes: BN;
  storageBytesLastBilled: BN;
  readDebts: IReadDebt[];
  billingStatus: number | null;
  rentLamports: BN;
}

export class UserVault {
  state?: IUserVault;
  address: PublicKey;

  constructor(address: PublicKey) {
    this.address = address;
  }

  async load(program: Program<VertexProgram>): Promise<void> {
    this.state = await program.account.userVault.fetch(this.address);
  }

  async getTotalSol(program: Program<VertexProgram>): Promise<number> {
    const userVaultInfo = await program.provider.connection.getAccountInfo(
      this.address
    );
    if (!userVaultInfo) return 0;

    const userVault = program.coder.accounts.decode(
      "userVault",
      userVaultInfo.data
    ) as IUserVault;

    return (
      (userVaultInfo.lamports - userVault.rentLamports.toNumber()) /
      Math.pow(10, 9)
    );
  }

  isPendingBilling(): boolean {
    this.assertLoaded();

    return (
      this.state!.billingStatus != null &&
      this.state!.billingStatus === BILLING_PENDING
    );
  }

  private assertLoaded(): void {
    if (!this.state) throw new Error("UserVault state not loaded");
  }
}
