package val

import (
	"fmt"
	"regexp"
	"strconv"
)

func Parse(s string) (Val, error) {
	r := regexp.MustCompile(`\A([a-z0-9]+)\((\d+)\)\z`)
	values := r.FindStringSubmatch(s)
	if len(values) < 3 {
		return 0, fmt.Errorf("%q invalid val format", s)
	}
	typ := values[1]
	val := values[2]
	switch typ {
	case "u63":
		i, err := strconv.ParseUint(val, 10, 63)
		if err != nil {
			return 0, fmt.Errorf("%q invalid u63", s)
		}
		return FromU63(i)
	case "u32":
		i, err := strconv.ParseUint(val, 10, 32)
		if err != nil {
			return 0, fmt.Errorf("%q invalid u32", s)
		}
		return FromU32(uint32(i)), nil
	case "i32":
		i, err := strconv.ParseUint(val, 10, 32)
		if err != nil {
			return 0, fmt.Errorf("%q invalid i32", s)
		}
		return FromI32(int32(i)), nil
	case "unknown":
		i, err := strconv.ParseUint(val, 10, 64)
		if err != nil {
			return 0, fmt.Errorf("%q invalid unknown", s)
		}
		return Val(i), nil
	}
	return 0, fmt.Errorf("%q unknown val", s)
}

func (v Val) String() string {
	if i, err := ToU63(v); err == nil {
		return fmt.Sprintf("u63(%d)", i)
	}
	if i, err := ToI32(v); err == nil {
		return fmt.Sprintf("i32(%d)", i)
	}
	if i, err := ToU32(v); err == nil {
		return fmt.Sprintf("u32(%d)", i)
	}
	return fmt.Sprintf("unknown(%d)", uint64(v))
}

func (v Val) MarshalText() ([]byte, error) {
	return []byte(v.String()), nil
}

func (v *Val) UnmarshalText(b []byte) (err error) {
	*v, err = Parse(string(b))
	return
}
