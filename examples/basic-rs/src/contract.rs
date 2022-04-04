#![no_std]
use sdk::Map;
use sdk::Object;
use sdk::Val;
use sdk::OrAbort;
use stellar_contract_sdk as sdk;

const ACCOUNTS_FUNDED_KEY: Val = Val::from_u32(1);

// Init sets up the contract initial state. It must be called once before any
// other function of the contract is called.
#[no_mangle]
pub fn init() {
    if !Val::is_void(&sdk::store_get(ACCOUNTS_FUNDED_KEY)) {
        return;
    }
    let m: Map<Object, bool> = Map::new();
    sdk::store_set(ACCOUNTS_FUNDED_KEY, m.into());
}

// Fund accepts an account, creates it with some native asset, and stores
// it in the list of accounts created by friendbot.
#[no_mangle]
pub fn fund(acc: Val) -> Val {
    let mut accounts: Map<Object, bool> = Map::try_from(sdk::store_get(ACCOUNTS_FUNDED_KEY).as_object()).or_abort();
    accounts = accounts.put(acc.as_object(), true);
    sdk::store_set(ACCOUNTS_FUNDED_KEY, Val::from(accounts));
    sdk::create_account(Val::from_void(), acc, Val::from_u63(1000))
}

// Was created by friendbot returns if the given account was created by
// friendbot.
#[no_mangle]
pub fn was_created_by_fund(acc: Val) -> Val {
    let acc_obj = acc.as_object();
    let accounts: Map<Object, bool> = Map::try_from(sdk::store_get(ACCOUNTS_FUNDED_KEY).as_object()).or_abort();
    if accounts.has(acc_obj) && accounts.get(acc_obj) {
        return Val::from(true);
    }
    Val::from(false)
}

// Trust asset changes an account so that it trusts an asset, enabling the
// account to hold the asset.
#[no_mangle]
pub fn trust_asset(acc: Val, asset: Val) -> Val {
    sdk::create_trustline(acc, asset)
}

// Payment from src to dst of asset.
#[no_mangle]
pub fn payment(src_acc_id: Val, dst_acc_id: Val, asset: Val, amount: Val) -> Val {
    sdk::pay(src_acc_id, dst_acc_id, asset, amount)
}
