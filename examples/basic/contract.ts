import * as val from "./val.ts";
import * as hostfns from "./hostfns.ts";

const storeKey = val.toU32(0x01);

export function init(): void {
  const vec = hostfns.vec_new();
  hostfns.store(storeKey, vec);
}

export function invoke(v: val.Val): val.Val {
  let vec = hostfns.load(storeKey);
  vec = hostfns.vec_push(vec, v);
  hostfns.store(storeKey, vec);
  let i = val.toU32(v) as u64;
  i /= 2;
  i += 4;
  const r = val.fromU63(i);
  return r;
}

export function view(v: val.Val): val.Val {
  const vec = hostfns.load(v);
  const len = hostfns.vec_len(vec);
  const last = val.fromU32(val.toU32(len) - 1);
  return hostfns.vec_get(v, last);
}
