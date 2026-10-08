# Sol-Estate - Solana Program (Smart Contract)

This directory contains the on-chain logic for Sol-Estate, built using the [Anchor] framework on [Solana].

[Anchor]: https://www.anchor-lang.com/
[Solana]: https://solana.com/

## Prerequisites

- [Rust] toolchain
- [Solana CLI] v1.18+
- Anchor v0.32.1

[Rust]: https://www.rust-lang.org/
[Solana CLI]: https://docs.solanalabs.com/cli/install

## Quick Start

1. Build the Solana program:
   ```bash
   anchor build
   ```

2. Run the integration tests (ensure you run this from the project root):
   ```bash
   anchor test
   ```

## State & Accounts

The program relies on three core accounts to store real estate data on-chain:

- `Property`: Stores details about a specific real estate listing (price, location, total tokens, etc.).
- `Vault` (TokenAccount): An associated token account PDA owned by the program to hold the USDC collected from sales.
- `UserInvestment`: Tracks how many shares of a specific property a user owns.

## Instructions

- `list_property`: Initializes a new property listing, setting its metadata (price, shares, URI) and creating the associated USDC vault.
- `buy_share`: Transfers USDC from the user to the property's vault, and updates the user's fractional ownership balance in their `UserInvestment` account.

