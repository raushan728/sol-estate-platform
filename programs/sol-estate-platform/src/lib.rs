use anchor_lang::prelude::*;

declare_id!("7yJmwoLXxkcR7FakNNDLkueWPZ78xxJvgoWhmYC26Zgi");

#[program]
pub mod sol_estate_platform {
    use super::*;
}

#[account]
pub struct Property {
    pub owner: Pubkey,
    pub usdc_mint: Pubkey,
    pub vault_account: Pubkey,
    
    pub price: u64,
    pub total_shares: u64,
    pub shares_sold: u64,
    pub total_rent_collected: u64, 
    pub name: String,
    pub location: String,
    pub image_url: String,

    pub bump: u8,
}

#[account]
pub struct UserInvestment {
    pub owner: Pubkey,
    pub property: Pubkey,
    
    pub shares_owned: u64,
    pub total_claimed: u64,
    
    pub bump: u8,
}
