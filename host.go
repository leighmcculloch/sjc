package main

import (
	"crypto/rand"
	"encoding/binary"
	"fmt"
	"os"

	"github.com/leighmcculloch/sjc/val"
	"github.com/stellar/go/keypair"
)

type Host struct {
	Ledger  Ledger
	Storage Storage
	Objects Objects
}

type Account struct {
	ID keypair.FromAddress
}

type Ledger struct {
	Accounts map[val.Val]Account
}

type Storage struct {
	Values map[val.Val]val.Val
}

type Objects struct {
	NextObjectID uint32
	Vecs         map[val.Val][]val.Val
	Maps         map[val.Val]map[val.Val]val.Val
}

func (o *Objects) AssignID() uint32 {
	id := o.NextObjectID
	o.NextObjectID++
	return id
}

func (o *Objects) AddVec(vec []val.Val) val.Val {
	id := o.AssignID()
	v := val.FromObject(val.ObjectTypeVec, id)
	if o.Vecs == nil {
		o.Vecs = map[val.Val][]val.Val{}
	}
	o.Vecs[v] = vec
	return v
}

func (o *Objects) GetVec(v val.Val) []val.Val {
	return o.Vecs[v]
}

func (o *Objects) AddMap(m map[val.Val]val.Val) val.Val {
	id := o.AssignID()
	v := val.FromObject(val.ObjectTypeMap, id)
	if o.Maps == nil {
		o.Maps = map[val.Val]map[val.Val]val.Val{}
	}
	o.Maps[v] = m
	return v
}

func (o *Objects) GetMap(v val.Val) map[val.Val]val.Val {
	return o.Maps[v]
}

func (h *Host) funcs() map[string]any {
	return map[string]any{
		"abort": func(message uint32, file uint32, line uint32, col uint32) {
			fmt.Printf("abort: message=%d file=%d line=%d col=%d\n", message, file, line, col)
			os.Exit(1)
		},

		"log_value": func(v val.Val) val.Val {
			fmt.Println("log:", v)
			return 0
		},

		"rand": func() uint64 {
			b := [8]byte{}
			_, err := rand.Read(b[:])
			if err != nil {
				panic(err)
			}
			u := binary.BigEndian.Uint64(b[:]) &^ (1 << 63)
			v, err := val.FromU63(u)
			if err != nil {
				panic(err)
			}
			return uint64(v)
		},

		"store": func(k val.Val, v val.Val) {
			if h.Storage.Values == nil {
				h.Storage.Values = map[val.Val]val.Val{}
			}
			h.Storage.Values[k] = v
		},
		"load": func(k val.Val) val.Val {
			return h.Storage.Values[k]
		},

		"map_new": func() val.Val {
			return 0
		},

		"map_put":  func(m val.Val, k val.Val, v val.Val) val.Val { return 0 },
		"map_get":  func(m val.Val, k val.Val) val.Val { return 0 },
		"map_del":  func(m val.Val, k val.Val) val.Val { return 0 },
		"map_len":  func(m val.Val) val.Val { return 0 },
		"map_keys": func(m val.Val) val.Val { return 0 },

		"vec_new": func() val.Val {
			vec := []val.Val{}
			v := h.Objects.AddVec(vec)
			return v
		},
		"vec_put": func(v val.Val, i val.Val, x val.Val) val.Val { return 0 },
		"vec_get": func(v val.Val, i val.Val) val.Val {
			vec := h.Objects.GetVec(v)
			idx, err := val.ToU32(i)
			if err != nil {
				panic(err)
			}
			return vec[idx]
		},
		"vec_del": func(v val.Val, i val.Val) val.Val { return 0 },
		"vec_len": func(v val.Val) val.Val {
			vec := h.Objects.GetVec(v)
			l := len(vec)
			return val.FromU32(uint32(l))
		},

		"vec_push":   func(v val.Val, x val.Val) val.Val {
			oldVec := h.Objects.GetVec(v)
			newVec := append(oldVec, x)
			newV := h.Objects.AddVec(newVec)
			return newV
		},
		"vec_pop":    func(v val.Val) val.Val { return 0 },
		"vec_take":   func(v val.Val, n val.Val) val.Val { return 0 },
		"vec_drop":   func(v val.Val, n val.Val) val.Val { return 0 },
		"vec_front":  func(v val.Val) val.Val { return 0 },
		"vec_back":   func(v val.Val) val.Val { return 0 },
		"vec_insert": func(v val.Val, i val.Val, x val.Val) val.Val { return 0 },
		"vec_append": func(v1 val.Val, v2 val.Val) val.Val { return 0 },

		"pay": func(src val.Val, dest val.Val, asset val.Val, amount val.Val) val.Val { return 0 },
	}
}
