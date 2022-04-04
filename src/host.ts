import { Val } from "./val.ts";
import * as val from "./val.ts";
import { Account, Storage } from "./storage.ts";

export class Host {
  constructor(public storage: Storage) {}

  funcs(): Record<string, CallableFunction> {
    return {
      abort: (
        _message: number,
        _fileName: number,
        line: number,
        column: number,
      ) => {
        console.error("abort:", `line=${line}`, `col=${column}`);
      },

      host__log_value: (v: Val): Val => {
        console.error("log:", v);
        return val.fromVoid();
      },

      host__store_set: (k: Val, v: Val): void => {
        this.storage.storeSet(k, v);
      },

      host__store_get: (k: Val): Val => {
        const v = this.storage.storeGet(k);
        if (v === undefined) {
          return val.fromVoid();
        }
        return v;
      },

      host__vec_new: (): Val => {
        const v = this.storage.newObjectVal(val.objectTypeVec);
        this.storage.addVec(v, new Array<bigint>());
        return v;
      },
      host__vec_put: (v: Val, i: Val, x: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        const idx = Number(val.toU32(i));
        if (idx > vec.length) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec.slice(0, idx).concat([x], vec.slice(idx + 1));
        this.storage.addVec(newV, newVec);
        return newV;
      },
      host__vec_get: (v: Val, i: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        const idx = Number(val.toU32(i));
        if (idx > vec.length) {
          return val.fromStatus(0n);
        }
        return vec[idx];
      },
      host__vec_del: (v: Val, i: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        const idx = Number(val.toU32(i));
        if (idx > vec.length) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec.slice(0, idx).concat(vec.slice(idx + 1));
        this.storage.addVec(newV, newVec);
        return newV;
      },
      host__vec_len: (v: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        return val.fromU32(BigInt(vec.length));
      },
      host__vec_push: (v: Val, x: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec.concat(x);
        this.storage.addVec(newV, newVec);
        return newV;
      },
      host__vec_pop: (v: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined || vec.length == 0) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec.slice(0, vec.length - 1);
        this.storage.addVec(newV, newVec);
        return newV;
      },
      host__vec_take: (_v: Val, _n: Val): Val => {
        // TODO: What does this func do?
        return val.fromStatus(0n);
      },
      host__vec_drop: (_v: Val, _n: Val): Val => {
        // TODO: What does this func do?
        return val.fromStatus(0n);
      },
      host__vec_front: (v: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined || vec.length == 0) {
          return val.fromStatus(0n);
        }
        return vec[0];
      },
      host__vec_back: (v: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined || vec.length == 0) {
          return val.fromStatus(0n);
        }
        return vec[vec.length - 1];
      },
      host__vec_insert: (v: Val, i: Val, x: Val): Val => {
        const vec = this.storage.getVec(v);
        if (vec == undefined) {
          return val.fromStatus(0n);
        }
        const idx = Number(val.toU32(i));
        if (idx > vec.length) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec.slice(0, idx).concat([x], vec.slice(idx));
        this.storage.addVec(newV, newVec);
        return newV;
      },
      host__vec_append: (v1: Val, v2: Val): Val => {
        const vec1 = this.storage.getVec(v1);
        if (vec1 == undefined) {
          return val.fromStatus(0n);
        }
        const vec2 = this.storage.getVec(v2);
        if (vec2 == undefined) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeVec);
        const newVec = vec1.concat(vec2);
        this.storage.addVec(newV, newVec);
        return newV;
      },

      host__map_new: (): Val => {
        const v = this.storage.newObjectVal(val.objectTypeMap);
        this.storage.addMap(v, new Map<bigint, bigint>());
        return v;
      },
      host__map_put: (m: Val, k: Val, v: Val): Val => {
        const map = this.storage.getMap(m);
        if (map == undefined) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeMap);
        const newMap = new Map<bigint, bigint>(map);
        newMap.set(k, v);
        this.storage.addMap(newV, newMap);
        return newV;
      },
      host__map_get: (m: Val, k: Val): Val => {
        const map = this.storage.getMap(m);
        if (map == undefined) {
          return val.fromStatus(0n);
        }
        const v = map.get(k);
        if (v == undefined) {
          return val.fromStatus(0n);
        }
        return v;
      },
      host__map_del: (m: Val, k: Val): Val => {
        const map = this.storage.getMap(m);
        if (map == undefined) {
          return val.fromStatus(0n);
        }
        const newV = this.storage.newObjectVal(val.objectTypeMap);
        const newMap = new Map(map);
        newMap.delete(k);
        this.storage.addMap(newV, newMap);
        return newV;
      },
      host__map_len: (m: Val): Val => {
        const map = this.storage.getMap(m);
        if (map == undefined) {
          return val.fromStatus(0n);
        }
        const len = BigInt(map.size);
        return val.fromU32(len);
      },
      host__map_keys: (m: Val): Val => {
        const map = this.storage.getMap(m);
        if (map == undefined) {
          return val.fromStatus(0n);
        }
        const keys = [...map.keys()];
        const v = this.storage.newObjectVal(val.objectTypeMap);
        this.storage.addVec(v, keys);
        return v;
      },

      host__create_account: (
        srcAccId: Val,
        dstAccId: Val,
        startingBalanceVal: Val,
      ): Val => {
        if (
          !(val.isVoid(srcAccId) ||
            val.isObjectType(srcAccId, val.objectTypeAccountId))
        ) {
          return val.fromStatus(0n);
        }
        if (!val.isObjectType(dstAccId, val.objectTypeAccountId)) {
          return val.fromStatus(1n);
        }
        if (!val.isU63(startingBalanceVal)) {
          return val.fromStatus(2n);
        }
        const startingBalance = val.toU63(startingBalanceVal);
        let srcAcc: Account | undefined = undefined;
        if (!val.isVoid(srcAccId)) {
          srcAcc = this.storage.getAccount(srcAccId);
          if (!srcAcc) {
            return val.fromStatus(3n);
          }
        }
        if (this.storage.getAccount(dstAccId)) {
          return val.fromStatus(4n);
        }
        if (srcAcc) {
          if (srcAcc.nativeBalance < startingBalance) {
            return val.fromStatus(5n);
          }
          srcAcc.nativeBalance -= startingBalance;
        }
        const dstAcc = new Account();
        dstAcc.nativeBalance = startingBalance;
        this.storage.addAccount(dstAccId, dstAcc);
        return dstAccId;
      },

      host__create_trustline: (srcAccId: Val, asset: Val): Val => {
        if (!val.isObjectType(srcAccId, val.objectTypeAccountId)) {
          return val.fromStatus(0n);
        }
        if (!val.isObjectType(asset, val.objectTypeAsset)) {
          return val.fromStatus(1n);
        }
        const srcAcc = this.storage.getAccount(srcAccId);
        if (!srcAcc) {
          return val.fromStatus(2n);
        }
        if (srcAcc.trustlineBalances.has(asset)) {
          return val.fromStatus(3n);
        }
        srcAcc.trustlineBalances.set(asset, 0n);
        return val.fromVoid();
      },

      host__pay: (srcAccId: Val, dstAccId: Val, asset: Val, amountVal: Val): Val => {
        if (!val.isObjectType(srcAccId, val.objectTypeAccountId)) {
          return val.fromStatus(0n);
        }
        if (!val.isObjectType(dstAccId, val.objectTypeAccountId)) {
          return val.fromStatus(1n);
        }
        if (
          !(
            val.isNativeAsset(asset) ||
            val.isObjectType(asset, val.objectTypeAsset)
          )
        ) {
          return val.fromStatus(2n);
        }
        if (!val.isU63(amountVal)) {
          return val.fromStatus(3n);
        }
        if (!val.isU63(amountVal)) {
          return val.fromStatus(4n);
        }
        const amount = val.toU63(amountVal);
        const srcAcc = this.storage.getAccount(srcAccId);
        if (!srcAcc) {
          return val.fromStatus(5n);
        }
        const dstAcc = this.storage.getAccount(dstAccId);
        if (!dstAcc) {
          return val.fromStatus(6n);
        }
        const isNative = val.isNativeAsset(asset);
        let srcAccBal = isNative
          ? srcAcc.nativeBalance
          : srcAcc.trustlineBalances.get(asset);
        let dstAccBal = isNative
          ? dstAcc.nativeBalance
          : dstAcc.trustlineBalances.get(asset);
        const skipSrcCheck = !isNative &&
          this.storage.getAssetIssuerVal(asset) == srcAccId;
        if (!skipSrcCheck && srcAccBal == undefined) {
          return val.fromStatus(7n);
        }
        const skipDstCheck = !isNative &&
          this.storage.getAssetIssuerVal(asset) == dstAccId;
        if (!skipDstCheck && dstAccBal == undefined) {
          return val.fromStatus(7n);
        }
        if (srcAccBal != undefined) {
          if (srcAccBal < amount) {
            return val.fromStatus(8n);
          }
          srcAccBal -= amount;
        }
        if (dstAccBal != undefined) {
          dstAccBal += amount;
        }
        if (val.isNativeAsset(asset)) {
          if (srcAccBal != undefined) srcAcc.nativeBalance = srcAccBal;
          if (dstAccBal != undefined) dstAcc.nativeBalance = dstAccBal;
        } else {
          if (srcAccBal != undefined) {
            srcAcc.trustlineBalances.set(asset, srcAccBal);
          }
          if (dstAccBal != undefined) {
            dstAcc.trustlineBalances.set(asset, dstAccBal);
          }
        }
        return val.fromVoid();
      },
    };
  }
}
