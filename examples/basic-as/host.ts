import { Val } from "./val.ts";

@external("env", "host__log_value")
export declare function log_value(v: Val): Val;
@external("env", "host__store_set")
export declare function store_set(k: Val, v: Val): void;
@external("env", "host__store_get")
export declare function store_get(k: Val): Val;

@external("env", "host__vec_new")
export declare function vec_new(): Val;
@external("env", "host__vec_put")
export declare function vec_put(v: Val, i: Val, x: Val): Val;
@external("env", "host__vec_get")
export declare function vec_get(v: Val, i: Val): Val;
@external("env", "host__vec_del")
export declare function vec_del(v: Val, i: Val): Val;
@external("env", "host__vec_len")
export declare function vec_len(v: Val): Val;
@external("env", "host__vec_push")
export declare function vec_push(v: Val, x: Val): Val;
@external("env", "host__vec_pop")
export declare function vec_pop(v: Val): Val;
@external("env", "host__vec_take")
export declare function vec_take(v: Val, n: Val): Val;
@external("env", "host__vec_drop")
export declare function vec_drop(v: Val, n: Val): Val;
@external("env", "host__vec_front")
export declare function vec_front(v: Val): Val;
@external("env", "host__vec_back")
export declare function vec_back(v: Val): Val;
@external("env", "host__vec_insert")
export declare function vec_insert(v: Val, i: Val, x: Val): Val;
@external("env", "host__vec_append")
export declare function vec_append(v1: Val, v2: Val): Val;

@external("env", "host__map_new")
export declare function map_new(): Val;
@external("env", "host__map_put")
export declare function map_put(m: Val, k: Val, v: Val): Val;
@external("env", "host__map_get")
export declare function map_get(m: Val, k: Val): Val;
@external("env", "host__map_del")
export declare function map_del(m: Val, k: Val): Val;
@external("env", "host__map_len")
export declare function map_len(m: Val): Val;
@external("env", "host__map_keys")
export declare function map_keys(m: Val): Val;

@external("env", "host__create_account")
export declare function create_account(srcAcc: Val, dstAcc: Val, startingBalance: Val): Val;
@external("env", "host__create_trustline")
export declare function create_trustline(srcAcc: Val, asset: Val): Val;
@external("env", "host__get_balance")
export declare function get_balance(acc: Val, asset: Val): Val;
@external("env", "host__pay")
export declare function pay(src: Val, dst: Val, asset: Val, amount: Val): Val;
