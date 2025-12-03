use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sol_estate_platform {
    use super::*;
    pub fn list_property(
        ctx: Context<ListProperty>, 
        name: String, 
        location: String, 
        image_url: String, 
        price: u64, 
        total_shares: u64
    ) -> Result<()> {
        
        let property = &mut ctx.accounts.property;
        property.owner = ctx.accounts.owner.key();
        property.usdc_mint = ctx.accounts.usdc_mint.key();
        property.vault_account = ctx.accounts.vault_account.key();
        
        property.name = name;
        property.location = location;
        property.image_url = image_url;
        property.price = price;
        property.total_shares = total_shares;
        
        property.shares_sold = 0;
        property.total_rent_collected = 0;
        
        property.bump = ctx.bumps.property;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct ListProperty<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 500,
        seeds = [b"property", name.as_bytes()], 
        bump
    )]
    pub property: Account<'info, Property>,

   
    #[account(
        init,
        payer = owner,
        token::mint = usdc_mint,
        token::authority = property, 
        seeds = [b"vault", property.key().as_ref()],
        bump
    )]
    pub vault_account: Account<'info, TokenAccount>,

   
    pub usdc_mint: Account<'info, Mint>,

    
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
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