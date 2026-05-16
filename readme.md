# Turbin3 Anchor Vault Program

A secure Solana smart contract built with the Anchor framework that establishes a user-specific Vault utilizing Program Derived Addresses (PDAs). This project satisfies **Assignment 1 (Anchor Vault)** for the Turbin3 Builders Cohort.

## Overview

The Anchor Vault program enables a secure decentralized escrow-like mechanism where users can initialize a distinct vault state, deposit native SOL into a secure PDA, and withdraw their funds. The contract utilizes Cross-Program Invocations (CPI) to interface directly with the System Program.

### Core Instructions
* `initialize`: Sets up the global `VaultState` configuration and derives the secure Vault account PDA.
* `deposit`: Transports a requested amount of SOL from the user's wallet into the Vault account via CPI.
* `withdraw`: Safely transfers SOL back from the Vault account to the user's wallet, utilizing the program's PDA signer seeds.

---
## Program Structure
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
│   └── vault.t.ts               # TypeScript unit & integration tests
├── Anchor.toml                  # Anchor configuration setup
└── README.md                    # Project documentation