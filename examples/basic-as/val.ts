import * as host from "./host.ts";

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
const staticNativeAsset = 3;

type objectType = u8;
const objBox: objectType = 0;
const objVec: objectType = 1;
const objMap: objectType = 2;
const objU64: objectType = 3;
const objI64: objectType = 4;
const objString: objectType = 5;
const objBinary: objectType = 6;
// const objLedgerkey: objectType = 7;
// const objLedgerval: objectType = 8;
// const objOperation: objectType = 9;
// const objTransaction: objectType = 10;
const objAccountId: objectType = 11;
const objAsset: objectType = 12;

export function log(v: Val): void {
  host.log_value(v);
}

export function isU63(v: Val): bool {
  return (v & 1) == 0;
}

export function toU63(v: Val): u64 {
  assert(isU63(v));
  return v >> 1;
}

export function fromU63(i: u64): Val {
  assert((i >> 63) == 0);
  const v = (i << 1) as Val;
  return v;
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

function fromTagBody(t: tag, body: u64): Val {
  assert(body < (1 << 60));
  assert(t < 8);
  return (body << 4) | ((t << 1) as u64) | 1;
}

export function isI32(v: Val): bool {
  return hasTag(v, tagI32);
}

export function toI32(v: Val): i32 {
  assert(isI32(v));
  return getBody(v) as i32;
}

export function fromI32(i: i32): Val {
  return fromTagBody(tagI32, i as u32 as u64);
}

export function isU32(v: Val): bool {
  return hasTag(v, tagU32);
}

export function toU32(v: Val): u32 {
  assert(isU32(v));
  return getBody(v) as u32;
}

export function fromU32(i: u32): Val {
  return fromTagBody(tagU32, i as u64);
}

export function isVoid(v: Val): bool {
  return hasTag(v, tagStatic) && getBody(v) == staticVoid;
}

export function fromVoid(): Val {
  return fromTagBody(tagStatic, staticVoid);
}

export function isBool(v: Val): bool {
  return hasTag(v, tagStatic) &&
    (getBody(v) == staticTrue || getBody(v) == staticFalse);
}

export function isTrue(v: Val): bool {
  return hasTag(v, tagStatic) && getBody(v) == staticTrue;
}

export function isFalse(v: Val): bool {
  return hasTag(v, tagStatic) && getBody(v) == staticFalse;
}

export function toBool(v: Val): bool {
  assert(isBool(v));
  return getBody(v) == staticTrue;
}

export function fromBool(b: bool): Val {
  return fromTagBody(tagStatic, b ? staticTrue : staticFalse);
}

export function fromTrue(): Val {
  return fromTagBody(tagStatic, staticTrue);
}

export function fromFalse(): Val {
  return fromTagBody(tagStatic, staticFalse);
}

export function isNativeAsset(v: Val): bool {
  return hasTag(v, tagStatic) && getBody(v) == staticNativeAsset;
}

export function fromNativeAsset(): Val {
  return fromTagBody(tagStatic, staticNativeAsset);
}

export function isObject(v: Val): boolean {
  return hasTag(v, tagObject);
}

export function isObjectType(v: Val, o: objectType): boolean {
  return toObjectType(v) == o;
}

export function toObjectType(v: Val): objectType {
  assert(isObject(v));
  return getBody(v) as objectType;
}

export function toObjectId(v: Val): u32 {
  assert(isObject(v));
  return getBody(v) as u32;
}

export function fromObject(o: objectType, id: u32): Val {
  return fromTagBody(tagObject, (id << 8) | o);
}
