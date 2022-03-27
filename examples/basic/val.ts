import * as hostfns from "./hostfns.ts";

export type Val = u64;

type tag = u8;

const tagU32: tag = 0;
const tagI32: tag = 1;
const tagStatic: tag = 2;
const tagObject: tag = 3;
const tagSymbol: tag = 4;
const tagBitset: tag = 5;
const tagStatus: tag = 6;

const staticVoid: u32 = 0;
const staticTrue: u32 = 1;
const staticFalse: u32 = 2;

const objBox: u16 = 0;
const objVec: u16 = 1;
const objMap: u16 = 2;
const objU64: u16 = 3;
const objI64: u16 = 4;
const objString: u16 = 5;
const objBinary: u16 = 6;
const objLedgerkey: u16 = 7;
const objLedgerval: u16 = 8;
const objOperation: u16 = 9;
const objTransaction: u16 = 10;

export function log(v: Val): void {
  hostfns.log_value(v);
}

export function isU63(v: Val): bool {
  return (v & 1) == 0;
}

function getTag(v: Val): tag {
  return ((v >> 1) & 7) as tag;
}

function hasTag(v: Val, t: tag): bool {
  return !isU63(v) && getTag(v) == t;
}

function getBody(v: Val): u64 {
  return v >> 4;
}

export function isI32(v: Val): bool {
  return hasTag(v, tagI32);
}

export function isU32(v: Val): bool {
  return hasTag(v, tagU32);
}

export function toU63(v: Val): u64 {
  assert(isU63(v));
  return v >> 1;
}

export function toI32(v: Val): i32 {
  assert(isI32(v));
  return getBody(v) as i32;
}

export function toU32(v: Val): u32 {
  assert(isU32(v));
  return getBody(v) as u32;
}

function fromTagBody(t: tag, body: u64): Val {
  assert(body < (1 << 60));
  assert(t < 8);
  return (body << 4) | ((t << 1) as u64) | 1;
}

export function fromU63(i: u64): Val {
  assert((i >> 63) == 0);
  const v = (i << 1) as Val;
  return v;
}

export function fromI32(i: i32): Val {
  return fromTagBody(tagI32, i as u32 as u64);
}

export function fromU32(i: u32): Val {
  return fromTagBody(tagU32, i as u64);
}
