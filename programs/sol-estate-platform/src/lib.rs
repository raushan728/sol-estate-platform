use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("7yJmwoLXxkcR7FakNNDLkueWPZ78xxJvgoWhmYC26Zgi");

#[program]
pub mod sol_estate_platform {
    use super::*;
    pub fn list_property(
        ctx: Context<ListProperty>,
        name: String,
        location: String,
        image_url: String,
        price: u64,
        total_shares: u64,
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
    pub fn buy_share(ctx: Context<BuyShare>, shares_amount: u64) -> Result<()> {
        let property = &mut ctx.accounts.property;
        let investment = &mut ctx.accounts.user_investment;

        let price_per_share = property.price.checked_div(property.total_shares).unwrap();
        let total_cost = price_per_share.checked_mul(shares_amount).unwrap();

        let transfer_instruction = Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        token::transfer(cpi_ctx, total_cost)?;
        property.shares_sold += shares_amount;

        if investment.shares_owned == 0 {
            investment.owner = ctx.accounts.buyer.key();
            investment.property = property.key();
            investment.total_claimed = 0;
            investment.bump = ctx.bumps.user_investment;
        }
        investment.shares_owned += shares_amount;

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
#[derive(Accounts)]
pub struct BuyShare<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = 8 + 100,
        seeds = [b"investment", property.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub user_investment: Account<'info, UserInvestment>,

    #[account(
        mut,
        seeds = [b"vault", property.key().as_ref()],
        bump
    )]
    pub vault_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_usdc_account.mint == property.usdc_mint,
        constraint = user_usdc_account.owner == buyer.key()
    )]
    pub user_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
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
