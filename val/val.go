package val

import (
	"fmt"
)

type Val uint64

type tag uint8

const (
	tagU32    tag = 0
	tagI32    tag = 1
	tagStatic tag = 2
	tagObject tag = 3
	tagSymbol tag = 4
	tagBitset tag = 5
	tagStatus tag = 6
)

const (
	staticVoid  = 0
	staticTrue  = 1
	staticFalse = 2
)

type ObjectType uint8

const (
	ObjectTypeBox         ObjectType = 0
	ObjectTypeVec         ObjectType = 1
	ObjectTypeMap         ObjectType = 2
	ObjectTypeU64         ObjectType = 3
	ObjectTypeI64         ObjectType = 4
	ObjectTypeString      ObjectType = 5
	ObjectTypeBinary      ObjectType = 6
	ObjectTypeLedgerkey   ObjectType = 7
	ObjectTypeLedgerval   ObjectType = 8
	ObjectTypeOperation   ObjectType = 9
	ObjectTypeTransaction ObjectType = 10
)

func IsU63(v Val) bool {
	return (v & 1) == 0
}

func ToU63(v Val) (uint64, error) {
	if !IsU63(v) {
		return 0, fmt.Errorf("val %#b is not U63", v)
	}
	return uint64(v) >> 1, nil
}

func FromU63(i uint64) (Val, error) {
	if (i >> 63) != 0 {
		return 0, fmt.Errorf("val tag %d is invalid", i)
	}
	return Val(i << 1), nil
}

func getTag(v Val) tag {
	return tag((v >> 1) & 7)
}

func hasTag(v Val, t tag) bool {
	return !IsU63(v) && getTag(v) == t
}

func getBody(v Val) uint64 {
	return uint64(v) >> 4
}

func fromTagBody(t tag, body uint64) (Val, error) {
	if !(body < (1 << 60)) {
		return 0, fmt.Errorf("val body %#b is U63", body)
	}
	if !(t < 8) {
		return 0, fmt.Errorf("val tag %d is invalid", t)
	}
	return Val((body << 4) | uint64(t<<1) | 1), nil
}

func IsU32(v Val) bool {
	return hasTag(v, tagU32)
}

func ToU32(v Val) (uint32, error) {
	if !IsU32(v) {
		return 0, fmt.Errorf("val %#b is not U32", v)
	}
	return uint32(getBody(v)), nil
}

func FromU32(i uint32) Val {
	v, err := fromTagBody(tagU32, uint64(i))
	if err != nil {
		panic(err)
	}
	return v
}

func IsI32(v Val) bool {
	return hasTag(v, tagI32)
}

func ToI32(v Val) (int32, error) {
	if !IsI32(v) {
		return 0, fmt.Errorf("val %#b is not I32", v)
	}
	return int32(uint32(getBody(v))), nil
}

func FromI32(i int32) Val {
	v, err := fromTagBody(tagI32, uint64(uint32(i)))
	if err != nil {
		panic(err)
	}
	return v
}

func IsVoid(v Val) bool {
	return hasTag(v, tagStatic) && getBody(v) == staticVoid
}

func Void() Val {
	v, err := fromTagBody(tagStatic, uint64(staticVoid))
	if err != nil {
		panic(err)
	}
	return v
}

func IsBool(v Val) bool {
	return hasTag(v, tagStatic) && (getBody(v) == staticTrue || getBody(v) == staticFalse)
}

func ToBool(v Val) (bool, error) {
	if !IsBool(v) {
		return false, fmt.Errorf("val %#b is not Bool", v)
	}
	return getBody(v) == staticTrue, nil
}

func FromBool(b bool) Val {
	s := staticFalse
	if b {
		s = staticTrue
	}
	v, err := fromTagBody(tagStatic, uint64(s))
	if err != nil {
		panic(err)
	}
	return v
}

func IsObject(v Val) bool {
	return hasTag(v, tagObject)
}

func IsObjectType(v Val, o ObjectType) bool {
	return IsObject(v) && ObjectType(getBody(v)) == o
}

func ToObject(v Val) (uint32, error) {
	if IsObject(v) {
		return 0, fmt.Errorf("val %d is not an object", v)
	}
	return uint32(getBody(v) >> 8), nil
}

func FromObject(o ObjectType, id uint32) Val {
	v, err := fromTagBody(tagObject, uint64(id<<8|uint32(o)))
	if err != nil {
		panic(err)
	}
	return v
}

func IsSymbol(v Val) bool {
	return hasTag(v, tagSymbol)
}

func IsBitset(v Val) bool {
	return hasTag(v, tagBitset)
}

func IsStatus(v Val) bool {
	return hasTag(v, tagStatus)
}
