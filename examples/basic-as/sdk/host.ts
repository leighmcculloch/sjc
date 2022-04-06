import { Val } from "./val.ts";

@external("x", "$_")
export declare function log_value(v: Val): Val;
@external("s", "$_")
export declare function store_set(k: Val, v: Val): void;
@external("s", "$0")
export declare function store_get(k: Val): Val;
@external("v", "$_")
export declare function vec_new(): Val;
@external("v", "$0")
export declare function vec_put(v: Val, i: Val, x: Val): Val;
@external("v", "$1")
export declare function vec_get(v: Val, i: Val): Val;
@external("v", "$2")
export declare function vec_del(v: Val, i: Val): Val;
@external("v", "$3")
export declare function vec_len(v: Val): Val;
@external("v", "$4")
export declare function vec_push(v: Val, x: Val): Val;
@external("v", "$5")
export declare function vec_pop(v: Val): Val;
@external("v", "$6")
export declare function vec_take(v: Val, n: Val): Val;
@external("v", "$7")
export declare function vec_drop(v: Val, n: Val): Val;
@external("v", "$8")
export declare function vec_front(v: Val): Val;
@external("v", "$9")
export declare function vec_back(v: Val): Val;
@external("v", "$A")
export declare function vec_insert(v: Val, i: Val, x: Val): Val;
@external("v", "$B")
export declare function vec_append(v1: Val, v2: Val): Val;
@external("m", "$_")
export declare function map_new(): Val;
@external("m", "$0")
export declare function map_put(m: Val, k: Val, v: Val): Val;
@external("m", "$1")
export declare function map_get(m: Val, k: Val): Val;
@external("m", "$2")
export declare function map_del(m: Val, k: Val): Val;
@external("m", "$3")
export declare function map_len(m: Val): Val;
@external("m", "$4")
export declare function map_keys(m: Val): Val;
@external("l", "$_")
export declare function create_account(srcAcc: Val, dstAcc: Val, startingBalance: Val): Val;
@external("l", "$0")
export declare function create_trustline(srcAcc: Val, asset: Val): Val;
@external("l", "$1")
export declare function get_balance(acc: Val, asset: Val): Val;
@external("o", "$_")
export declare function pay(src: Val, dst: Val, asset: Val, amount: Val): Val;
