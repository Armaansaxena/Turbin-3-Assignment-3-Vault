import {Commitment, LAMPORTS_PER_SOL, PublicKey, SystemProgram} from "@solana/web3.js"
import * as anchor from "@coral-xyz/anchor"
import { Vault } from "../target/types/vault";
import { expect } from "chai";
import { BN } from "bn.js";

const commitment: Commitment = "confirmed";

describe("anchor-vault", () => {
    const confirmTx = async (signature: string) => {
        const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
        await anchor.getProvider().connection.confirmTransaction(
            {
                signature,
                ...latestBlockhash
            },
            commitment
        );
    };

    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.vault as anchor.Program<Vault>;
    const user = provider.wallet.publicKey;

    const [vaultStatePda, stateBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("state"), user.toBuffer()],
        program.programId
    );

    const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), vaultStatePda.toBuffer()],
        program.programId
    );

    before(async () => {
        const sig = await provider.connection.requestAirdrop(user, 10 * LAMPORTS_PER_SOL);
        await confirmTx(sig);
    });

    it("Initialize the Vault", async () => {
        const tx = await program.methods.initialize().accountsStrict({
            user: user,
            vaultState: vaultStatePda,
            vault: vaultPda,
            systemProgram: SystemProgram.programId
        }).rpc();

        await confirmTx(tx);

        const vaultState = await program.account.vaultState.fetch(vaultStatePda);
        expect(vaultState.vaultBump).to.equal(vaultBump);
        expect(vaultState.stateBump).to.equal(stateBump);
    });

    it("Deposit 1 Sol into the vault", async () => {
        const depositAmount = 1 * LAMPORTS_PER_SOL;

        const initialVaultBalance = await provider.connection.getBalance(vaultPda);
        const initialUserBalance = await provider.connection.getBalance(user);

        const tx = await program.methods.deposit(new BN(depositAmount)).accountsStrict({
            user: user,
            vaultState: vaultStatePda,
            vault: vaultPda,
            systemProgram: SystemProgram.programId
        }).rpc();

        await confirmTx(tx);

        const finalVaultBalance = await provider.connection.getBalance(vaultPda);
        const finalUserBalance = await provider.connection.getBalance(user);

        expect(finalVaultBalance).to.equal(initialVaultBalance + depositAmount);
        expect(finalUserBalance).to.be.lessThan(initialUserBalance - depositAmount);
    });

    it("Withdraw 0.5 Sol from the vault", async () => {
        const withdrawAmount = 0.5 * LAMPORTS_PER_SOL;

        const initialVaultBalance = await provider.connection.getBalance(vaultPda);
        const initialUserBalance = await provider.connection.getBalance(user);

        const tx = await program.methods.withdraw(new BN(withdrawAmount)).accountsStrict({
            user: user,
            vaultState: vaultStatePda,
            vault: vaultPda,
            systemProgram: SystemProgram.programId
        }).rpc();

        await confirmTx(tx);

        const finalVaultBalance = await provider.connection.getBalance(vaultPda);
        const finalUserBalance = await provider.connection.getBalance(user);

        expect(finalVaultBalance).to.equal(initialVaultBalance - withdrawAmount);
        expect(finalUserBalance).to.be.greaterThan(initialUserBalance);
    });

    it("Close the vault and withdraw all the funds", async () => {
        const initialUserBalance = await provider.connection.getBalance(user);

        const tx = await program.methods.close().accountsStrict({
            user: user,
            vaultState: vaultStatePda,
            vault: vaultPda,
            systemProgram: SystemProgram.programId
        }).rpc();

        await confirmTx(tx);

        expect(await provider.connection.getBalance(vaultPda)).to.equal(0);

        const vaultStateInfo = await provider.connection.getAccountInfo(vaultStatePda);
        expect(vaultStateInfo).to.be.null;

        const finalUserBalance = await provider.connection.getBalance(user);
        expect(finalUserBalance).to.be.greaterThan(initialUserBalance);
    });
});