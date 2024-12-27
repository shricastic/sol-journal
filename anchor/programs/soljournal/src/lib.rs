#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod soljournal {
    use super::*;

  pub fn close(_ctx: Context<CloseSoljournal>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.soljournal.count = ctx.accounts.soljournal.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.soljournal.count = ctx.accounts.soljournal.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSoljournal>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.soljournal.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSoljournal<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Soljournal::INIT_SPACE,
  payer = payer
  )]
  pub soljournal: Account<'info, Soljournal>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSoljournal<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub soljournal: Account<'info, Soljournal>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub soljournal: Account<'info, Soljournal>,
}

#[account]
#[derive(InitSpace)]
pub struct Soljournal {
  count: u8,
}
