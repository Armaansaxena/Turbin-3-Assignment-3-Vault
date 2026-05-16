pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
declare_id!("2Dc34vT9QRePpZ2eFtCDBv6sJoWLUTmDrxTpasHcxo5y");
pub use instructions::*;
pub use state::*;

#[program]
pub mod vault {
    use super::*;

    //initialize the vault
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)
    }

    // deposit funds
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()>{
        ctx.accounts.deposit(amount)
    }

    // withdraw funds
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()>{
        ctx.accounts.withdraw(amount)
    }

    // close
    pub fn close(ctx: Context<Close>) -> Result<()>{
        ctx.accounts.close()
    }

}

