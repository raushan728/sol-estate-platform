# Sol-Estate Platform

**Sol-Estate** is a decentralized Real World Asset (RWA) platform built on Solana using the Anchor Framework and Next.js. It allows users to invest in fractionalized real estate properties using USDC. The platform features an Admin Portal for listing properties, a Marketplace for viewing assets, and a User Dashboard for tracking portfolio performance.

---

## Table of Contents

- [Sol-Estate Platform](#sol-estate-platform)
  - [Introduction](#introduction)
  - [Key Features](#key-features)
- [System Architecture](#system-architecture)
  - [Account Structure & Relationships](#account-structure--relationships)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [1. Get Your Program ID](#1-get-your-program-id)
  - [2. Update the Smart Contract](#2-update-the-smart-contract)
  - [3. Update Anchor.toml](#3-update-anchortoml)
  - [4. Re-build the Program](#4-re-build-the-program)
  - [5. Deploy the Program](#5-deploy-the-program)
  - [6. Update Frontend Constants](#6-update-frontend-constants)
- [Wallet & Token Setup](#wallet--token-setup)
  - [1. Create Wallet](#1-create-wallet)
  - [2. Airdrop SOL](#2-airdrop-sol)
  - [3. Mint Fake USDC](#3-mint-fake-usdc)
- [Visual Walkthrough & Usage](#visual-walkthrough--usage)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Connect with Me](#connect-with-me)
- [License](#license)

---

## Introduction

Sol-Estate bridges the gap between traditional real estate and blockchain technology. By tokenizing properties on the Solana blockchain, we enable fractional ownership, increased liquidity, and transparent transaction history. This project demonstrates a full-stack Web3 application leveraging the high performance of Solana and the safety of the Anchor framework.

---

## Key Features

- **Admin Portal**: Secure interface for property owners/admins to list new real estate assets, specifying price, supply, and metadata.
- **Marketplace**: Public-facing gallery where users can browse listed properties and view details.
- **Fractional Investment**: Users can purchase fractional shares of properties using USDC.
- **User Dashboard**: Dedicated portfolio view for users to track their investments and asset performance.
- **Custom SPL Token Integration**: Fully functional implementation of SPL Token transactions (Fake USDC) with a dedicated faucet script.

---

## System Architecture

The platform architecture follows a standard dApp pattern on Solana:

1.  **Smart Contract (Program)**: Written in Rust using the Anchor Framework.
2.  **Frontend**: A Next.js 14 application using TypeScript and Tailwind CSS.
3.  **Blockchain Interaction**: The frontend communicates with the Solana cluster via `@solana/web3.js` and `@coral-xyz/anchor`.

### Account Structure & Relationships

We utilize **Program Derived Addresses (PDAs)** to securely manage state and relationships.

- **Property Account (`Property`)**: Stores details about a specific real estate listing (price, location, total tokens, etc.).
  - _Seeds_: `[b"property", owner_pubkey, property_id]`
- **Vault Account (`Vault`)**: An associated token account (PDA) owned by the program to hold the USDC collected from sales.
  - _Seeds_: `[b"vault", property_key]`
- **User Investment Account (`UserInvestment`)**: Tracks how many shares of a specific property a user owns.
  - _Seeds_: `[b"user-investment", property_key, user_pubkey]`

> [!NOTE]
> Using PDAs ensures deterministic addresses that cannot be manipulated by users, enforcing strict access control and data integrity.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v20+ recommended ([Download](https://nodejs.org/))
- **Rust & Cargo**: Latest stable version ([Download](https://rustup.rs/))
- **Solana CLI**: v1.18+ ([Guide](https://docs.solanalabs.com/cli/install))
- **Anchor Framework**: Latest version ([Guide](https://www.anchor-lang.com/docs/installation))
- **Yarn**: (`corepack enable` or `npm i -g yarn`)

---

## Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/raushan728/sol-estate-platform.git
   cd sol-estate-platform
   ```

2. **Install Backend Dependencies**
   ```bash
   yarn install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd app && yarn install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   _The application will be available at `http://localhost:3000`._

---

## Configuration

Proper configuration is essential for the program to interact correctly with the frontend.

### 1. Get Your Program ID
Run the following command to generate a new keypair if needed:
```bash
anchor keys sync
```

### 2. Update the Smart Contract
If not auto-updated, paste the new ID into `programs/sol-estate/src/lib.rs`:
```rust
declare_id!("YOUR_NEW_PROGRAM_ID");
```

### 3. Update Anchor.toml
Ensure the `[programs.devnet]` section in `Anchor.toml` matches your new ID.

### 4. Re-build the Program
```bash
anchor build
```

### 5. Deploy the Program
```bash
anchor deploy
```

### 6. Update Frontend Constants
1. Copy the updated `target/idl/sol_estate.json` to `app/src/app/idl/`.
2. Update the `PROGRAM_ID` in `app/src/app/utils/constants.ts` with your new address.

---

## Wallet & Token Setup

This project requires a wallet funded with SOL (for gas) and our custom Fake USDC (for transactions).

### 1. Create Wallet
```bash
solana-keygen new --outfile ~/.config/solana/id.json
solana config set --keypair ~/.config/solana/id.json
```

### 2. Airdrop SOL
Switch to Devnet and request SOL:
```bash
solana config set --url devnet
solana airdrop 2
```

### 3. Mint Fake USDC
We provided a script to mint Fake USDC tokens to your wallet.

1. **Edit Script**: Open `app/scripts/mint-usdc.js` and replace `USER_WALLET_ADDRESS` with your Public Key.
2. **Run Script**:
   ```bash
   cd app
   node scripts/mint-usdc.js
   ```

> [!IMPORTANT]
> The script will output a **New USDC Mint Address**. Copy this address! You will need it to configure the "USDC Mint Address" when listing properties in the **Admin Portal**.

---

## Visual Walkthrough & Usage

**Phase 1: Admin Listing** - The Admin Panel allows property owners to create new listings.
![Admin Listing](demo/localhost_3000_admin.png)

**Phase 2: Successful Listing** - Confirmation screen after successfully listing a real world asset.
![Listed successfully](demo/Listed%20successfully.png)

**Phase 3: Marketplace View** - Users browse available properties on the main marketplace feed.
![Marketplace View](demo/localhost_3000_.png)

**Phase 4: Investment Terminal** - Clicking on a property reveals detailed information and the investment interface.
![Investment Details](demo/localhost_3000_property_FLTkxfd33Tw9AhrvVXeSDJuUVky759qrAQw7h1btVQEL.png)

**Phase 5: Transaction & Payment** - Users confirm the transaction through their wallet provider.
![Transaction](demo/Investment.png)

**Phase 6: Portfolio Dashboard** - After investing, users can track their holdings.
![Dashboard](demo/localhost_3000_dashboard.png)

---

## Testing

Run the integration tests included in the repository:

```bash
anchor test
```
_This validates the core mechanics including property initialization and investment logic._

---

## Troubleshooting

> [!WARNING]
> **Common Error: "Account not found"**
> Ensure you have properly initialized the property before trying to invest in it. The Vault PDA must exist.

- **Transaction Simulation Failed:** Check if you have enough SOL for gas and enough Fake USDC.
- **Wallet Connection Error:** Verify you are on **Solana Devnet**.

---

## Contributing

Contributions are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## Connect with Me

If you have any questions or want to collaborate, feel free to reach out!

- **Email:** [raushankumarwork74@gmail.com](mailto:raushankumarwork74@gmail.com)
- **LinkedIn:** [Raushan Kumar](https://www.linkedin.com/in/raushan-kumar-807916390/)
- **Telegram:** [@raushan_singh_29](https://t.me/raushan_singh_29)

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
