import * as val from "./sdk/val.ts";
import * as host from "./sdk/host.ts";

const accountsFundedKey = val.fromU32(0x01);

// Init sets up the contract initial state. It must be called once before any
// other function of the contract is called.
export function init(): void {
  if (!val.isVoid(host.store_get(accountsFundedKey))) {
    return;
  }
  host.store_set(accountsFundedKey, host.map_new());
}

// Fund accepts an account, creates it with some native asset, and stores
// it in the list of accounts created by friendbot.
export function fund(acc: val.Val): val.Val {
  let accounts = host.store_get(accountsFundedKey);
  accounts = host.map_put(accounts, acc, val.fromBool(true));
  host.store_set(accountsFundedKey, accounts);
  return host.create_account(val.fromVoid(), acc, val.fromU63(1000));
}

// Was created by friendbot returns if the given account was created by
// friendbot.
export function was_created_by_fund(acc: val.Val): val.Val {
  const accounts = host.store_get(accountsFundedKey);
  const was = host.map_get(accounts, acc);
  if (val.isTrue(was)) {
    return val.fromTrue();
  }
  return val.fromFalse();
}

// Trust asset changes an account so that it trusts an asset, enabling the
// account to hold the asset.
export function trust_asset(acc: val.Val, asset: val.Val): val.Val {
  return host.create_trustline(acc, asset);
}

// Payment from src to dst of asset.
export function payment(
  srcAccId: val.Val,
  dstAccId: val.Val,
  asset: val.Val,
  amount: val.Val,
): val.Val {
  return host.pay(srcAccId, dstAccId, asset, amount);
}

// Get balance gets the balance of an account.
export function balance(accId: val.Val, asset: val.Val): val.Val {
  return host.get_balance(accId, asset);
}
