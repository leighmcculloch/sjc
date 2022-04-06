import * as val from "./sdk/val.ts";
import * as host from "./sdk/host.ts";

export function use_all_the_host_functions(): void {
  host.log_value(0);
  host.store_set(0, 0);
  host.store_get(0);
  host.vec_new();
  host.vec_put(0, 0, 0);
  host.vec_get(0, 0);
  host.vec_del(0, 0);
  host.vec_len(0);
  host.vec_push(0, 0);
  host.vec_pop(0);
  host.vec_take(0, 0);
  host.vec_drop(0, 0);
  host.vec_front(0);
  host.vec_back(0);
  host.vec_insert(0, 0, 0);
  host.vec_append(0, 0);
  host.map_new();
  host.map_put(0, 0, 0);
  host.map_get(0, 0);
  host.map_del(0, 0);
  host.map_len(0);
  host.map_keys(0);
  host.create_account(0, 0, 0);
  host.create_trustline(0, 0);
  host.get_balance(0, 0);
  host.pay(0, 0, 0, 0);
}

export function use_all_the_host_functions_2(): void {
  host.log_value(0);
  host.store_set(0, 0);
  host.store_get(0);
  host.vec_new();
  host.vec_put(0, 0, 0);
  host.vec_get(0, 0);
  host.vec_del(0, 0);
  host.vec_len(0);
  host.vec_push(0, 0);
  host.vec_pop(0);
  host.vec_take(0, 0);
  host.vec_drop(0, 0);
  host.vec_front(0);
  host.vec_back(0);
  host.vec_insert(0, 0, 0);
  host.vec_append(0, 0);
  host.map_new();
  host.map_put(0, 0, 0);
  host.map_get(0, 0);
  host.map_del(0, 0);
  host.map_len(0);
  host.map_keys(0);
  host.create_account(0, 0, 0);
  host.create_trustline(0, 0);
  host.get_balance(0, 0);
  host.pay(0, 0, 0, 0);
}
