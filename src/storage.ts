import { ObjectType, Val } from "./val.ts";
import * as val from "./val.ts";

export class Storage {
  private stored = new Map<bigint, bigint>();

  private nextObjectId = 0n;
  private vecs = new Map<bigint, bigint[]>();
  private maps = new Map<bigint, Map<bigint, bigint>>();
  private accountIds = new Map<bigint, string>();
  private accountIdVals = new Map<string, bigint>();
  private assets = new Map<bigint, string>();
  private assetVals = new Map<string, bigint>();
  private accounts = new Map<bigint, Account>();

  storeSet(k: Val, v: Val) {
    this.stored.set(k, v);
  }

  storeGet(k: Val): Val | undefined {
    return this.stored.get(k);
  }

  newObjectVal(o: ObjectType): Val {
    const id = this.nextObjectId;
    this.nextObjectId++;
    return val.fromObject(o, id);
  }

  addVec(v: Val, vec: bigint[]) {
    this.vecs.set(v, vec);
  }

  getVec(v: Val): bigint[] | undefined {
    return this.vecs.get(v);
  }

  addMap(v: Val, map: Map<bigint, bigint>) {
    this.maps.set(v, map);
  }

  getMap(v: Val): Map<bigint, bigint> | undefined {
    return this.maps.get(v);
  }

  getAccountId(v: Val): string | undefined {
    return this.accountIds.get(v);
  }

  getValFromAccountId(s: string): Val {
    const v = this.accountIdVals.get(s);
    if (v) {
      return v;
    }
    const vn = this.newObjectVal(val.objectTypeAccountId);
    this.accountIds.set(vn, s);
    this.accountIdVals.set(s, vn);
    return vn;
  }

  getAssetCode(v: Val): string | undefined {
    return this.assets.get(v)?.split(":", 1).at(0);
  }

  getAssetIssuer(v: Val): string | undefined {
    return this.assets.get(v)?.split(":", 2).at(1);
  }

  getAssetIssuerVal(v: Val): Val | undefined {
    const issuer = this.assets.get(v)?.split(":", 2).at(1);
    if (!issuer) {
      return undefined;
    }
    return this.getValFromAccountId(issuer);
  }

  getValFromAsset(code: string, issuerAccId: Val): Val {
    const issuer = this.getAccountId(issuerAccId) as string;
    const s = `${code}:${issuer}`;
    const v = this.assetVals.get(s);
    if (v) {
      return v;
    }
    const vn = this.newObjectVal(val.objectTypeAsset);
    this.assets.set(vn, s);
    this.assetVals.set(s, vn);
    return vn;
  }

  addAccount(v: Val, acc: Account) {
    this.accounts.set(v, acc);
  }

  getAccount(v: Val): Account | undefined {
    return this.accounts.get(v);
  }

  static fromObject(o: any): Storage {
    const s = new Storage();

    s.nextObjectId = BigInt(o.nextObjectId);

    for (const [k, v] of Object.entries(o.stored)) {
      s.stored.set(BigInt(k), BigInt(v as string));
    }

    for (const [k, v] of Object.entries(o.vecs)) {
      s.vecs.set(BigInt(k), (v as string[]).map((e) => BigInt(e)));
    }

    for (const [k, v] of Object.entries(o.maps)) {
      const m = new Map<bigint, bigint>();
      for (const [vk, vv] of Object.entries(v as Record<string, string>)) {
        m.set(BigInt(vk), BigInt(vv as string));
      }
      s.maps.set(BigInt(k), m);
    }

    for (const [k, v] of Object.entries(o.accountIds)) {
      s.accountIds.set(BigInt(k), v as string);
      s.accountIdVals.set(v as string, BigInt(k));
    }

    for (const [k, v] of Object.entries(o.assets)) {
      s.assets.set(BigInt(k), v as string);
      s.assetVals.set(v as string, BigInt(k));
    }

    for (const [k, v] of Object.entries(o.accounts)) {
      s.accounts.set(BigInt(k), Account.fromObject(v));
    }

    return s;
  }

  toJSON(): any {
    const stored: Record<string, string> = {};
    this.stored.forEach((v, k) => stored[k.toString()] = v.toString());

    const vecs: Record<string, string[]> = {};
    this.vecs.forEach((v, k) =>
      vecs[k.toString()] = v.map((e) => e.toString())
    );

    const maps: Record<string, Record<string, string>> = {};
    this.maps.forEach((v, k) => {
      const m: Record<string, string> = {};
      v.forEach((vv, vk) => m[vk.toString()] = vv.toString());
      maps[k.toString()] = m;
    });

    const accountIds: Record<string, string> = {};
    this.accountIds.forEach((v, k) => accountIds[k.toString()] = v);

    const assets: Record<string, string> = {};
    this.assets.forEach((v, k) => assets[k.toString()] = v);

    const accounts: Record<string, Account> = {};
    this.accounts.forEach((v, k) => accounts[k.toString()] = v);

    return {
      nextObjectId: this.nextObjectId.toString(),
      stored: stored,
      vecs: vecs,
      maps: maps,
      accountIds: accountIds,
      assets: assets,
      accounts: accounts,
    };
  }
}

export class Account {
  nativeBalance = 0n;
  trustlineBalances = new Map<Val, bigint>();

  static fromObject(o: any): Account {
    const a = new Account();
    a.nativeBalance = BigInt(o.nativeBalance);
    for (const [k, v] of Object.entries(o.trustlineBalances)) {
      a.trustlineBalances.set(BigInt(k), BigInt(v as string));
    }
    return a;
  }

  toJSON(): any {
    const trustlineBalances: Record<string, string> = {};
    this.trustlineBalances.forEach((v, k) =>
      trustlineBalances[k.toString()] = v.toString()
    );
    return {
      nativeBalance: this.nativeBalance.toString(),
      trustlineBalances: trustlineBalances,
    };
  }
}
