export interface Storage {
  newObjectVal(o: ObjectType): Val;
  getAccountId(v: Val): string | undefined;
  getValFromAccountId(s: string): Val;
  getAssetCode(v: Val): string | undefined;
  getAssetIssuer(v: Val): string | undefined;
  getValFromAsset(code: string, issuerAccId: Val): Val;
}

export type Val = bigint;

type Tag = bigint;
const tagU32 = 0n;
const tagI32 = 1n;
const tagStatic = 2n;
const tagObject = 3n;
const tagSymbol = 4n;
const tagBitset = 5n;
const tagStatus = 6n;

const staticVoid = 0n;
const staticTrue = 1n;
const staticFalse = 2n;
const staticNativeAsset = 3n;

export type ObjectType = bigint;
export const objectTypeBox = 0n;
export const objectTypeVec = 1n;
export const objectTypeMap = 2n;
export const objectTypeU64 = 3n;
export const objectTypeI64 = 4n;
export const objectTypeString = 5n;
export const objectTypeBinary = 6n;
// export const objectTypeLedgerkey = 7n;
// export const objectTypeLedgerval = 8n;
// export const objectTypeOperation = 9n;
// export const objectTypeTransaction = 10n;
export const objectTypeAccountId = 11n;
export const objectTypeAsset = 12n;

//#region U63

export function isU63(v: Val): boolean {
  return (v & 1n) == 0n;
}

export function toU63(v: Val): bigint {
  if (!isU63(v)) {
    throw new Error("val not u63");
  }
  return BigInt.asUintN(63, v >> 1n);
}

export function fromU63(i: bigint): Val {
  if (!((i >> 63n) == 0n)) {
    throw new Error("bigint exceeds 63 bits");
  }
  return (i << 1n);
}

//#endregion U63

function getTag(v: Val): Tag {
  return BigInt.asUintN(8, (v >> 1n) & 7n);
}

function hasTag(v: Val, t: Tag): boolean {
  return !isU63(v) && getTag(v) == t;
}

function getBody(v: Val): bigint {
  return BigInt.asUintN(60, v >> 4n);
}

function fromTagBody(t: Tag, body: bigint): Val {
  if (!(body < (1n << 60n))) {
    throw new Error("body exceeds 60 bits");
  }
  if (!(t < 8n)) {
    throw new Error("tag exceeds 3 bits");
  }
  return (body << 4n) | (t << 1n) | 1n;
}

//#region U32

export function isU32(v: Val): boolean {
  return hasTag(v, tagU32);
}

export function toU32(v: Val): bigint {
  if (!isU32(v)) {
    throw new Error("val not u32");
  }
  return BigInt.asUintN(32, getBody(v));
}

export function fromU32(i: bigint): Val {
  return fromTagBody(tagU32, i);
}

//#endregion U32

//#region I32

export function isI32(v: Val): boolean {
  return hasTag(v, tagI32);
}

export function toI32(v: Val): bigint {
  if (!isI32(v)) {
    throw new Error("val not i32");
  }
  return BigInt.asIntN(32, getBody(v));
}

export function fromI32(i: bigint): Val {
  return fromTagBody(tagI32, i);
}

//#endregion I32

//#region Void

export function isVoid(v: Val): boolean {
  return hasTag(v, tagStatic) && getBody(v) == staticVoid;
}

export function fromVoid(): Val {
  return fromTagBody(tagStatic, staticVoid);
}

//#endregion Void

//#region Bool

export function isBool(v: Val): boolean {
  return hasTag(v, tagStatic) &&
    (getBody(v) == staticTrue || getBody(v) == staticFalse);
}

export function isTrue(v: Val): boolean {
  return hasTag(v, tagStatic) && getBody(v) == staticTrue;
}

export function isFalse(v: Val): boolean {
  return hasTag(v, tagStatic) && getBody(v) == staticFalse;
}

export function toBool(v: Val): boolean {
  if (!isBool(v)) {
    throw new Error("val not bool");
  }
  return getBody(v) == staticTrue;
}

export function fromBool(b: boolean): Val {
  return fromTagBody(tagStatic, b ? staticTrue : staticFalse);
}

//#endregion Bool

//#region NativeAsset

export function isNativeAsset(v: Val): boolean {
  return hasTag(v, tagStatic) && getBody(v) == staticNativeAsset;
}

export function fromNativeAsset(): Val {
  return fromTagBody(tagStatic, staticNativeAsset);
}

//#endregion Void

//#region Object

export function isObject(v: Val): boolean {
  return hasTag(v, tagObject);
}

export function isObjectType(v: Val, o: ObjectType): boolean {
  return isObject(v) && toObjectType(v) == o;
}

export function toObjectType(v: Val): ObjectType {
  if (!isObject(v)) {
    throw new Error("val not object");
  }
  return BigInt.asUintN(8, getBody(v));
}

export function toObjectId(v: Val): bigint {
  if (!isObject(v)) {
    throw new Error("val not object");
  }
  return BigInt.asUintN(32, getBody(v) >> 8n);
}

export function fromObject(o: ObjectType, id: bigint): Val {
  return fromTagBody(tagObject, (id << 8n) | o);
}

//#endregion Object

//#region Symbol

export function isSymbol(v: Val): boolean {
  return hasTag(v, tagSymbol);
}

//#endregion Symbol

//#region Bitset

export function isBitset(v: Val): boolean {
  return hasTag(v, tagBitset);
}

//#endregion Bitset

//#region Status

export function isStatus(v: Val): boolean {
  return hasTag(v, tagStatus);
}

export function toStatus(v: Val): bigint {
  if (!isStatus(v)) {
    throw new Error("val not status");
  }
  return BigInt.asUintN(32, getBody(v));
}

export function fromStatus(s: bigint): Val {
  return fromTagBody(tagStatus, s);
}

//#endregion Status

export function toString(v: Val, storage: Storage): string {
  if (isU63(v)) {
    return `u63:${toU63(v)}`;
  }
  if (isI32(v)) {
    return `i32:${toI32(v)}`;
  }
  if (isU32(v)) {
    return `u32:${toU32(v)}`;
  }
  if (isVoid(v)) {
    return `void`;
  }
  if (isBool(v)) {
    return `bool:${toBool(v)}`;
  }
  if (isNativeAsset(v)) {
    return `native`;
  }
  if (isStatus(v)) {
    return `status:${toStatus(v)}`;
  }
  if (isObject(v)) {
    if (isObjectType(v, objectTypeAccountId)) {
      const accId = storage.getAccountId(v);
      if (accId != undefined) {
        return `acc:${accId}`;
      }
    }
    if (isObjectType(v, objectTypeAsset)) {
      const code = storage.getAssetCode(v);
      const issuer = storage.getAssetCode(v);
      if (code && issuer) {
        return `asset:${code}:${issuer}`;
      }
    }
    return `obj:${toObjectType(v)}:${toObjectId(v)}`;
  }
  return `val:${v}`;
}

export function fromString(s: string, storage: Storage): bigint {
  const [type, value, ...remaining] = s.split(":");
  switch (type) {
    case "u63":
      return fromU63(BigInt(value));
    case "u32":
      return fromU32(BigInt(value));
    case "i32":
      return fromI32(BigInt(value));
    case "bool":
      return fromBool(Boolean(value));
    case "void":
      return fromVoid();
    case "native":
      return fromNativeAsset();
    case "acc":
      return storage.getValFromAccountId(value);
    case "asset": {
      const code = value;
      const issuer = remaining[0];
      if (!code || !issuer) {
        throw new Error(
          `asset ${s} invalid must be in format <code>:<issuer-account>`,
        );
      }
      const issuerAccId = storage.getValFromAccountId(issuer);
      return storage.getValFromAsset(code, issuerAccId);
    }
    case "obj": {
      const [objType, objId] = value.split(":", 2);
      return fromObject(BigInt(objType), BigInt(objId));
    }
    case "status":
      return fromStatus(BigInt(value));
    case "val":
      return BigInt(value);
    case undefined:
    default: {
      let b;
      try {
        b = BigInt(s);
      } catch {
        throw new Error(`unrecognized val ${s}`);
      }
      throw new Error(`unrecognized val ${s}, did you mean u63:${b}?`);
    }
  }
}
