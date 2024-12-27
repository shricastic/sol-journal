#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("BT189HihnPJAcjn35zr1gT9UXNeFuBDFZnRCUCiiMJRi");

#[program]
pub mod soljournal {
    use super::*;

    pub fn create_entry(
        ctx: Context<CreateJournalEntry>,
        title: String,
        message: String,
        )-> Result<()> {
        
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;

        Ok(()) 
    }

    pub fn update_entry(
        ctx: Context<UpdateJournalEntry>,
        _title: String,
        message: String
    )-> Result<()> {

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;

        Ok(())
    }

    pub fn delete_entry(
        _ctx: Context<CreateJournalEntry>,
        _title: String
    ) -> Result<()> {
        Ok(())
    }
    
}

#[derive(Accounts)]
#[instruction(
    title: String,
    message: String    
)]
pub struct CreateJournalEntry<'info>{
    #[account(
        init, 
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + JournalEntryState::INIT_SPACE,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(
    title: String,
)]
pub struct UpdateJournalEntry<'info>{
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + JournalEntryState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true,
    )]
    journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(
    title: String,
)]
pub struct DeleteJournalEntry<'info>{
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump, 
        close = owner, 
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}


#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
    pub owner: Pubkey,

    #[max_len(20)]
    pub title: String,
    
    #[max_len(200)]
    pub message: String,

    pub entry_id: u64,
}

