# Assignment 3 – Anchor Vault (Turbin3 Pre-Builder)

This project is part of the Turbin3 Pre-Builder Assignment 1 focused on building a secure, decentralized escrow-like Vault program on Solana using the Anchor framework.

## Tasks Completed

* Implemented the vault smart contract from scratch using modern Anchor idioms.
* Created a modular architecture by isolating individual instruction handlers.
* Derived secure Program Derived Addresses (PDAs) for state management and asset escrowing.
* Utilized Cross-Program Invocations (CPI) to interface directly with the Solana System Program.
* Covered all core instructions (`initialize`, `deposit`, `withdraw`, `close`) with robust TypeScript integration tests.

## Tech Stack

* Solana
* Anchor Framework
* Rust
* TypeScript
* @coral-xyz/anchor
* @solana/web3.js

## Project Structure

```text
.
├── programs/
│   └── anchor-vault/
│       ├── Cargo.toml
│       └── src/
│           ├── instructions/     # Decoupled instruction handlers
│           │   ├── close.rs
│           │   ├── deposit.rs
│           │   ├── initialize.rs
│           │   └── withdraw.rs
│           ├── lib.rs            # Program entrypoint and routing
│           └── mod.rs            # Instruction module exports
├── tests/
│   └── vault.t.ts                # TypeScript unit & integration tests
├── Anchor.toml                  # Anchor configuration setup
└── README.md                    # Project documentation