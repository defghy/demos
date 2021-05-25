function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function normalizeStyle(value) {
  if (isArray$6(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isObject$9(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$6(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$9(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray$6(a);
  bValidType = isArray$6(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$9(a);
  bValidType = isObject$9(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return val == null ? "" : isObject$9(val) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isMap$2(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet$2(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$9(val) && !isArray$6(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el2) => {
  const i = arr.indexOf(el2);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$c = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$c.call(val, key);
const isArray$6 = Array.isArray;
const isMap$2 = (val) => toTypeString(val) === "[object Map]";
const isSet$2 = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction$3 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol$2 = (val) => typeof val === "symbol";
const isObject$9 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$9(val) && isFunction$3(val.then) && isFunction$3(val.catch);
};
const objectToString$2 = Object.prototype.toString;
const toTypeString = (value) => objectToString$2.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn3) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn3(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber$2 = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function isEffect(fn3) {
  return fn3 && fn3._isEffect === true;
}
function effect$3(fn3, options = EMPTY_OBJ) {
  if (isEffect(fn3)) {
    fn3 = fn3.raw;
  }
  const effect2 = createReactiveEffect(fn3, options);
  if (!options.lazy) {
    effect2();
  }
  return effect2;
}
function stop(effect2) {
  if (effect2.active) {
    cleanup(effect2);
    if (effect2.options.onStop) {
      effect2.options.onStop();
    }
    effect2.active = false;
  }
}
let uid$2 = 0;
function createReactiveEffect(fn3, options) {
  const effect2 = function reactiveEffect() {
    if (!effect2.active) {
      return options.scheduler ? void 0 : fn3();
    }
    if (!effectStack.includes(effect2)) {
      cleanup(effect2);
      try {
        enableTracking();
        effectStack.push(effect2);
        activeEffect = effect2;
        return fn3();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect2.id = uid$2++;
  effect2.allowRecurse = !!options.allowRecurse;
  effect2._isEffect = true;
  effect2.active = true;
  effect2.raw = fn3;
  effect2.deps = [];
  effect2.options = options;
  return effect2;
}
function cleanup(effect2) {
  const {deps} = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type2, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger$1(target, type2, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect2) => {
        if (effect2 !== activeEffect || effect2.allowRecurse) {
          effects.add(effect2);
        }
      });
    }
  };
  if (type2 === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray$6(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type2) {
      case "add":
        if (!isArray$6(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap$2(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$6(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap$2(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap$2(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect2) => {
    if (effect2.options.scheduler) {
      effect2.options.scheduler(effect2);
    } else {
      effect2();
    }
  };
  effects.forEach(run);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol$2));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = {};
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  const method3 = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    const arr = toRaw(this);
    for (let i = 0, l = this.length; i < l; i++) {
      track(arr, "get", i + "");
    }
    const res = method3.apply(arr, args);
    if (res === -1 || res === false) {
      return method3.apply(arr, args.map(toRaw));
    } else {
      return res;
    }
  };
});
["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  const method3 = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    pauseTracking();
    const res = method3.apply(this, args);
    resetTracking();
    return res;
  };
});
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$6(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol$2(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject$9(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray$6(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$6(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger$1(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger$1(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger$1(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol$2(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray$6(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
const toReactive = (value) => isObject$9(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$9(value) ? readonly(value) : value;
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const {has: has2} = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger$1(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const {has: has2, get: get2} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger$1(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger$1(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const {has: has2, get: get2} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger$1(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger$1(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method3, isReadonly2, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap$2(rawTarget);
    const isPair = method3 === "entries" || method3 === Symbol.iterator && targetIsMap;
    const isKeyOnly = method3 === "keys" && targetIsMap;
    const innerIterator = target[method3](...args);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const {value, done} = innerIterator.next();
        return done ? {value, done} : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type2) {
  return function(...args) {
    return type2 === "delete" ? false : this;
  };
}
const mutableInstrumentations = {
  get(key) {
    return get$1(this, key);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
};
const shallowInstrumentations = {
  get(key) {
    return get$1(this, key, false, true);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, true)
};
const readonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, false)
};
const shallowReadonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, true)
};
const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
iteratorMethods.forEach((method3) => {
  mutableInstrumentations[method3] = createIterableMethod(method3, false, false);
  readonlyInstrumentations[method3] = createIterableMethod(method3, true, false);
  shallowInstrumentations[method3] = createIterableMethod(method3, false, true);
  shallowReadonlyInstrumentations[method3] = createIterableMethod(method3, true, true);
});
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, false)
};
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$9(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  return observed && toRaw(observed["__v_raw"]) || observed;
}
const convert = (val) => isObject$9(val) ? reactive(val) : val;
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value);
}
function shallowRef(value) {
  return createRef(value, true);
}
class RefImpl {
  constructor(_rawValue, _shallow = false) {
    this._rawValue = _rawValue;
    this._shallow = _shallow;
    this.__v_isRef = true;
    this._value = _shallow ? _rawValue : convert(_rawValue);
  }
  get value() {
    track(toRaw(this), "get", "value");
    return this._value;
  }
  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal;
      this._value = this._shallow ? newVal : convert(newVal);
      trigger$1(toRaw(this), "set", "value", newVal);
    }
  }
}
function createRef(rawValue, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object3) {
  const ret = isArray$6(object3) ? new Array(object3.length) : {};
  for (const key in object3) {
    ret[key] = toRef(object3, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object3, key) {
  return isRef(object3[key]) ? object3[key] : new ObjectRefImpl(object3, key);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2) {
    this._setter = _setter;
    this._dirty = true;
    this.__v_isRef = true;
    this.effect = effect$3(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger$1(toRaw(this), "set", "value");
        }
      }
    });
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if (self2._dirty) {
      self2._value = this.effect();
      self2._dirty = false;
    }
    track(self2, "get", "value");
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions) {
  let getter;
  let setter;
  if (isFunction$3(getterOrOptions)) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter, isFunction$3(getterOrOptions) || !getterOrOptions.set);
}
const stack = [];
function warn(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11, [
      msg + args.join(""),
      instance && instance.proxy,
      trace.map(({vnode}) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
      trace
    ]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({vnode, recurseCount}) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys2 = Object.keys(props);
  keys2.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys2.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$3(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn3, instance, type2, args) {
  let res;
  try {
    res = args ? fn3(...args) : fn3();
  } catch (err) {
    handleError(err, instance, type2);
  }
  return res;
}
function callWithAsyncErrorHandling(fn3, instance, type2, args) {
  if (isFunction$3(fn3)) {
    const res = callWithErrorHandling(fn3, instance, type2, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type2);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn3.length; i++) {
    values.push(callWithAsyncErrorHandling(fn3[i], instance, type2, args));
  }
  return values;
}
function handleError(err, instance, type2, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type2;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type2, contextVNode, throwInDev);
}
function logError(err, type2, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
const RECURSION_LIMIT = 100;
function nextTick(fn3) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn3 ? p2.then(this ? fn3.bind(this) : fn3) : p2;
}
function findInsertionIndex(job) {
  let start2 = flushIndex + 1;
  let end2 = queue.length;
  const jobId = getId(job);
  while (start2 < end2) {
    const middle = start2 + end2 >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < jobId ? start2 = middle + 1 : end2 = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    const pos = findInsertionIndex(job);
    if (pos > -1) {
      queue.splice(pos, 0, job);
    } else {
      queue.push(job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray$6(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue.sort((a, b) => getId(a) - getId(b));
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn3) {
  if (!seen.has(fn3)) {
    seen.set(fn3, 1);
  } else {
    const count = seen.get(fn3);
    if (count > RECURSION_LIMIT) {
      throw new Error(`Maximum recursive updates exceeded. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`);
    } else {
      seen.set(fn3, count + 1);
    }
  }
}
function emit(instance, event2, ...rawArgs) {
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event2.startsWith("update:");
  const modelArg = isModelListener2 && event2.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const {number: number3, trim} = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    } else if (number3) {
      args = rawArgs.map(toNumber$2);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event2)] || props[handlerName = toHandlerKey(camelize(event2))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event2))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      (instance.emitted = {})[handlerName] = true;
    } else if (instance.emitted[handlerName]) {
      return;
    }
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  if (!appContext.deopt && comp.__emits !== void 0) {
    return comp.__emits;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$3(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    return comp.__emits = null;
  }
  if (isArray$6(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  return comp.__emits = normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let isRenderingCompiledSlot = 0;
const setCompiledSlotRendering = (n) => isRenderingCompiledSlot += n;
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  let slot = slots[name];
  isRenderingCompiledSlot++;
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, {key: props.key || `_${name}`}, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  isRenderingCompiledSlot--;
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id2) {
  currentScopeId = id2;
}
function popScopeId() {
  currentScopeId = null;
}
const withScopeId = (_id) => withCtx;
function withCtx(fn3, ctx = currentRenderingInstance) {
  if (!ctx)
    return fn3;
  const renderFnWithContext = (...args) => {
    if (!isRenderingCompiledSlot) {
      openBlock(true);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn3(...args);
    setCurrentRenderingInstance(prevInstance);
    if (!isRenderingCompiledSlot) {
      closeBlock();
    }
    return res;
  };
  renderFnWithContext._c = true;
  return renderFnWithContext;
}
let accessedAttrs = false;
function markAttrsAccessed() {
  accessedAttrs = true;
}
function renderComponentRoot(instance) {
  const {type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render: render2, renderCache, data, setupState, ctx} = instance;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    let fallthroughAttrs;
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render2.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render3 = Component;
      if (false)
        ;
      result = normalizeVNode(render3.length > 1 ? render3(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit: emit2
      } : {attrs, slots, emit: emit2}) : render3(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
    let root2 = result;
    let setRoot = void 0;
    if (false)
      ;
    if (Component.inheritAttrs !== false && fallthroughAttrs) {
      const keys2 = Object.keys(fallthroughAttrs);
      const {shapeFlag} = root2;
      if (keys2.length) {
        if (shapeFlag & 1 || shapeFlag & 6) {
          if (propsOptions && keys2.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
          }
          root2 = cloneVNode(root2, fallthroughAttrs);
        } else if (false)
          ;
      }
    }
    if (vnode.dirs) {
      if (false)
        ;
      root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if (false)
        ;
      root2.transition = vnode.transition;
    }
    if (false)
      ;
    else {
      result = root2;
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getChildRoot = (vnode) => {
  const rawChildren = vnode.children;
  const dynamicChildren = vnode.dynamicChildren;
  const childRoot = filterSingleRoot(rawChildren);
  if (!childRoot) {
    return [vnode, void 0];
  }
  const index2 = rawChildren.indexOf(childRoot);
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
  const setRoot = (updatedRoot) => {
    rawChildren[index2] = updatedRoot;
    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot;
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
      }
    }
  };
  return [normalizeVNode(childRoot), setRoot];
};
function filterSingleRoot(children) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
const isElementRoot = (vnode) => {
  return vnode.shapeFlag & 6 || vnode.shapeFlag & 1 || vnode.type === Comment;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const {props: prevProps, children: prevChildren, component} = prevVNode;
  const {props: nextProps, children: nextChildren, patchFlag} = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({vnode, parent: parent2}, el2) {
  while (parent2 && parent2.subTree === vnode) {
    (vnode = parent2.vnode).el = el2;
    parent2 = parent2.parent;
  }
}
const isSuspense = (type2) => type2.__isSuspense;
function normalizeSuspenseChildren(vnode) {
  const {shapeFlag, children} = vnode;
  let content;
  let fallback;
  if (shapeFlag & 32) {
    content = normalizeSuspenseSlot(children.default);
    fallback = normalizeSuspenseSlot(children.fallback);
  } else {
    content = normalizeSuspenseSlot(children);
    fallback = normalizeVNode(null);
  }
  return {
    content,
    fallback
  };
}
function normalizeSuspenseSlot(s) {
  if (isFunction$3(s)) {
    s = s();
  }
  if (isArray$6(s)) {
    const singleChild = filterSingleRoot(s);
    s = singleChild;
  }
  return normalizeVNode(s);
}
function queueEffectWithSuspense(fn3, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$6(fn3)) {
      suspense.effects.push(...fn3);
    } else {
      suspense.effects.push(fn3);
    }
  } else {
    queuePostFlushCb(fn3);
  }
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {props, attrs, vnode: {patchFlag}} = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        const key = propsToUpdate[i];
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            attrs[key] = value;
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance);
          }
        } else {
          attrs[key] = value;
        }
      }
    }
  } else {
    setFullProps(instance, rawProps, props, attrs);
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawProps || EMPTY_OBJ, key, void 0, instance);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key)) {
          delete attrs[key];
        }
      }
    }
  }
  trigger$1(instance, "set", "$attrs");
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  if (rawProps) {
    for (const key in rawProps) {
      const value = rawProps[key];
      if (isReservedProp(key)) {
        continue;
      }
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        props[camelKey] = value;
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        attrs[key] = value;
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key], instance);
    }
  }
}
function resolvePropValue(options, props, key, value, instance) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction$3(defaultValue)) {
        const {propsDefaults} = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue(props);
          setCurrentInstance(null);
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (!hasOwn(props, key) && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  if (!appContext.deopt && comp.__props) {
    return comp.__props;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$3(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys2] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys2)
        needCastKeys.push(...keys2);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    return comp.__props = EMPTY_ARR;
  }
  if (isArray$6(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$6(opt) || isFunction$3(opt) ? {type: opt} : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  return comp.__props = [normalized, needCastKeys];
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type2, expectedTypes) {
  if (isArray$6(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type2));
  } else if (isFunction$3(expectedTypes)) {
    return isSameType(expectedTypes, type2) ? 0 : -1;
  }
  return -1;
}
function injectHook(type2, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type2] || (target[type2] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type2, args);
      setCurrentInstance(null);
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
const onErrorCaptured = (hook, target = currentInstance) => {
  injectHook("ec", hook, target);
};
function watchEffect(effect2, options) {
  return doWatch(effect2, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {immediate, deep, flush, onTrack, onTrigger} = EMPTY_OBJ, instance = currentInstance) {
  let getter;
  let forceTrigger = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = !!source._shallow;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$6(source)) {
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$3(s)) {
        return callWithErrorHandling(s, instance, 2, [
          instance && instance.proxy
        ]);
      } else
        ;
    });
  } else if (isFunction$3(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2, [
        instance && instance.proxy
      ]);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup2) {
          cleanup2();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onInvalidate]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup2;
  let onInvalidate = (fn3) => {
    cleanup2 = runner.options.onStop = () => {
      callWithErrorHandling(fn3, instance, 4);
    };
  };
  let oldValue = isArray$6(source) ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!runner.active) {
      return;
    }
    if (cb) {
      const newValue = runner();
      if (deep || forceTrigger || hasChanged(newValue, oldValue)) {
        if (cleanup2) {
          cleanup2();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onInvalidate
        ]);
        oldValue = newValue;
      }
    } else {
      runner();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const runner = effect$3(getter, {
    lazy: true,
    onTrack,
    onTrigger,
    scheduler
  });
  recordInstanceBoundEffect(runner, instance);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = runner();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(runner, instance && instance.suspense);
  } else {
    runner();
  }
  return () => {
    stop(runner);
    if (instance) {
      remove(instance.effects, runner);
    }
  };
}
function instanceWatch(source, cb, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? () => publicThis[source] : source.bind(publicThis);
  return doWatch(getter, cb.bind(publicThis), options, this);
}
function traverse(value, seen = new Set()) {
  if (!isObject$9(value) || seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray$6(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet$2(value) || isMap$2(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, {slots}) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      const rawProps = toRaw(props);
      const {mode} = rawProps;
      const child = children[0];
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const {getTransitionKey} = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el2, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el2._leaveCb = () => {
              earlyRemove();
              el2._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const {leavingVNodes} = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled} = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el2) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el2._leaveCb) {
        el2._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook(hook, [el2]);
    },
    enter(el2) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el2._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook(cancelHook, [el2]);
        } else {
          callHook(afterHook, [el2]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el2._enterCb = void 0;
      };
      if (hook) {
        hook(el2, done);
        if (hook.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    leave(el2, remove2) {
      const key2 = String(vnode.key);
      if (el2._enterCb) {
        el2._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook(onBeforeLeave, [el2]);
      let called = false;
      const done = el2._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook(onLeaveCancelled, [el2]);
        } else {
          callHook(onAfterLeave, [el2]);
        }
        el2._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        onLeave(el2, done);
        if (onLeave.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
    } else if (keepComment || child.type !== Comment) {
      ret.push(child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type2, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    hook();
  });
  injectHook(type2, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type2, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type2, target, keepAliveRoot) {
  const injected = injectHook(type2, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type2], injected);
  }, target);
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$6(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => withCtx((props) => {
  return normalizeSlotValue(rawSlot(props));
}, ctx);
const normalizeObjectSlots = (rawSlots, slots) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$3(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type2 = children._;
    if (type2) {
      instance.slots = children;
      def(children, "_", type2);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const {vnode, slots} = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type2 = children._;
    if (type2) {
      if (optimized && type2 === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type2 === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = {default: 1};
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction$3(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    const hook = binding.dir[name];
    if (hook) {
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
    }
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      isCustomElement: NO,
      errorHandler: void 0,
      warnHandler: void 0
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  };
}
let uid = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject$9(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$3(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction$3(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
            if (mixin.props || mixin.emits) {
              context.deopt = true;
            }
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function defineComponent(options) {
  return isFunction$3(options) ? {setup: options, name: options.name} : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const prodEffectOptions = {
  scheduler: queueJob,
  allowRecurse: true
};
const queuePostRenderEffect = queueEffectWithSuspense;
const setRef = (rawRef, oldRawRef, parentSuspense, vnode) => {
  if (isArray$6(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$6(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode));
    return;
  }
  let value;
  if (!vnode) {
    value = null;
  } else if (isAsyncWrapper(vnode)) {
    return;
  } else if (vnode.shapeFlag & 4) {
    value = vnode.component.exposed || vnode.component.proxy;
  } else {
    value = vnode.el;
  }
  const {i: owner, r: ref2} = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isString(ref2)) {
    const doSet = () => {
      refs[ref2] = value;
      if (hasOwn(setupState, ref2)) {
        setupState[ref2] = value;
      }
    };
    if (value) {
      doSet.id = -1;
      queuePostRenderEffect(doSet, parentSuspense);
    } else {
      doSet();
    }
  } else if (isRef(ref2)) {
    const doSet = () => {
      ref2.value = value;
    };
    if (value) {
      doSet.id = -1;
      queuePostRenderEffect(doSet, parentSuspense);
    } else {
      doSet();
    }
  } else if (isFunction$3(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else
    ;
};
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const {insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, forcePatchProp: hostForcePatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent} = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = false) => {
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const {type: type2, ref: ref2, shapeFlag} = n2;
    switch (type2) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type2.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type2.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el2 = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el2, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
  };
  const moveStaticNode = ({el: el2, anchor}, container, nextSibling) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostInsert(el2, container, nextSibling);
      el2 = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({el: el2, anchor}) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostRemove(el2);
      el2 = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el2;
    let vnodeHook;
    const {type: type2, props, shapeFlag, transition, patchFlag, dirs} = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el2 = vnode.el = hostCloneNode(vnode.el);
    } else {
      el2 = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el2, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el2, null, parentComponent, parentSuspense, isSVG && type2 !== "foreignObject", slotScopeIds, optimized || !!vnode.dynamicChildren);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (!isReservedProp(key)) {
            hostPatchProp(el2, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el2, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el2);
    }
    hostInsert(el2, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el2);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el2, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el2, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el2, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el2, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el2 = n2.el = n1.el;
    let {patchFlag, dynamicChildren, dirs} = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el2, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el2, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el2, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || hostForcePatchProp && hostForcePatchProp(el2, key)) {
              hostPatchProp(el2, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el2, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el2, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el2, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el2, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 6 || oldVNode.shapeFlag & 64 ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el2, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev || hostForcePatchProp && hostForcePatchProp(el2, key)) {
          hostPatchProp(el2, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el2, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let {patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds} = n2;
    if (patchFlag > 0) {
      optimized = true;
    }
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    setupComponent(instance);
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.component = n1.component;
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    instance.update = effect$3(function componentEffect() {
      if (!instance.isMounted) {
        let vnodeHook;
        const {el: el2, props} = initialVNode;
        const {bm, m, parent: parent2} = instance;
        if (bm) {
          invokeArrayFns(bm);
        }
        if (vnodeHook = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parent2, initialVNode);
        }
        const subTree = instance.subTree = renderComponentRoot(instance);
        if (el2 && hydrateNode) {
          hydrateNode(initialVNode.el, subTree, instance, parentSuspense, null);
        } else {
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (vnodeHook = props && props.onVnodeMounted) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => {
            invokeVNodeHook(vnodeHook, parent2, scopedInitialVNode);
          }, parentSuspense);
        }
        const {a} = instance;
        if (a && initialVNode.shapeFlag & 256) {
          queuePostRenderEffect(a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let {next, bu: bu2, u, parent: parent2, vnode} = instance;
        let originNext = next;
        let vnodeHook;
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu2) {
          invokeArrayFns(bu2);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent2, next, vnode);
        }
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => {
            invokeVNodeHook(vnodeHook, parent2, next, vnode);
          }, parentSuspense);
        }
      }
    }, prodEffectOptions);
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const {patchFlag, shapeFlag} = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const {el: el2, type: type2, transition, children, shapeFlag} = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type2.move(vnode, container, anchor, internals);
      return;
    }
    if (type2 === Fragment) {
      hostInsert(el2, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type2 === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el2);
        hostInsert(el2, container, anchor);
        queuePostRenderEffect(() => transition.enter(el2), parentSuspense);
      } else {
        const {leave, delayLeave, afterLeave} = transition;
        const remove3 = () => hostInsert(el2, container, anchor);
        const performLeave = () => {
          leave(el2, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el2, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el2, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {type: type2, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs} = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, null);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    let vnodeHook;
    if (vnodeHook = props && props.onVnodeBeforeUnmount) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type2 !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type2 === Fragment && (patchFlag & 128 || patchFlag & 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const {type: type2, el: el2, anchor, transition} = vnode;
    if (type2 === Fragment) {
      removeFragment(el2, anchor);
      return;
    }
    if (type2 === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el2);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const {leave, delayLeave} = transition;
      const performLeave = () => leave(el2, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end2) => {
    let next;
    while (cur !== end2) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end2);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const {bum, effects, update, subTree, um} = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    if (effects) {
      for (let i = 0; i < effects.length; i++) {
        stop(effects[i]);
      }
    }
    if (update) {
      stop(update);
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$6(ch1) && isArray$6(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) / 2 | 0;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type2) => type2.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const {mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: {insert, querySelector, createText, createComment}} = internals;
    const disabled = isTeleportDisabled(n2.props);
    const {shapeFlag, children} = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (n2.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, {um: unmount, o: {remove: hostRemove}}, doRemove) {
    const {shapeFlag, children, anchor, targetAnchor, target, props} = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          unmount(children[i], parentComponent, parentSuspense, true, optimized);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, {o: {insert}, m: move}, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const {el: el2, anchor, shapeFlag, children, props} = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el2, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {o: {nextSibling, parentNode, querySelector}}, hydrateChildren) {
  const target = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
      target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type2, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type2 === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type2] || Component[type2], name) || resolve(instance.appContext[type2], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
function createBlock(type2, props, children, patchFlag, dynamicProps) {
  const vnode = createVNode(type2, props, children, patchFlag, dynamicProps, true);
  vnode.dynamicChildren = currentBlock || EMPTY_ARR;
  closeBlock();
  if (currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({key}) => key != null ? key : null;
const normalizeRef = ({ref: ref2}) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction$3(ref2) ? {i: currentRenderingInstance, r: ref2} : ref2 : null;
};
const createVNode = _createVNode;
function _createVNode(type2, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type2 || type2 === NULL_DYNAMIC_COMPONENT) {
    type2 = Comment;
  }
  if (isVNode(type2)) {
    const cloned = cloneVNode(type2, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    return cloned;
  }
  if (isClassComponent(type2)) {
    type2 = type2.__vccOpts;
  }
  if (props) {
    if (isProxy(props) || InternalObjectKey in props) {
      props = extend({}, props);
    }
    let {class: klass, style} = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$9(style)) {
      if (isProxy(style) && !isArray$6(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type2) ? 1 : isSuspense(type2) ? 128 : isTeleport(type2) ? 64 : isObject$9(type2) ? 4 : isFunction$3(type2) ? 2 : 0;
  const vnode = {
    __v_isVNode: true,
    ["__v_skip"]: true,
    type: type2,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: null,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  normalizeChildren(vnode, children);
  if (shapeFlag & 128) {
    const {content, fallback} = normalizeSuspenseChildren(vnode);
    vnode.ssContent = content;
    vnode.ssFallback = fallback;
  }
  if (!isBlockNode && currentBlock && (patchFlag > 0 || shapeFlag & 6) && patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const {props, ref: ref2, patchFlag, children} = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  return {
    __v_isVNode: true,
    ["__v_skip"]: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$6(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$6(child)) {
    return createVNode(Fragment, null, child);
  } else if (typeof child === "object") {
    return child.el === null ? child : cloneVNode(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type2 = 0;
  const {shapeFlag} = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$6(children)) {
    type2 = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & 1 || shapeFlag & 64) {
      const slot = children.default;
      if (slot) {
        slot._c && setCompiledSlotRendering(1);
        normalizeChildren(vnode, slot());
        slot._c && setCompiledSlotRendering(-1);
      }
      return;
    } else {
      type2 = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.vnode.patchFlag & 1024) {
          children._ = 2;
          vnode.patchFlag |= 1024;
        } else {
          children._ = 1;
        }
      }
    }
  } else if (isFunction$3(children)) {
    children = {default: children, _ctx: currentRenderingInstance};
    type2 = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type2 = 16;
      children = [createTextVNode(children)];
    } else {
      type2 = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type2;
}
function mergeProps(...args) {
  const ret = extend({}, args[0]);
  for (let i = 1; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (existing !== incoming) {
          ret[key] = existing ? [].concat(existing, toMerge[key]) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$3(defaultValue) ? defaultValue() : defaultValue;
    } else
      ;
  }
}
let shouldCacheAccess = true;
function applyOptions(instance, options, deferredData = [], deferredWatch = [], deferredProvide = [], asMixin = false) {
  const {
    mixins,
    extends: extendsOptions,
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    components,
    directives,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    expose
  } = options;
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  const globalMixins = instance.appContext.mixins;
  if (asMixin && render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (!asMixin) {
    shouldCacheAccess = false;
    callSyncHook("beforeCreate", "bc", options, instance, globalMixins);
    shouldCacheAccess = true;
    applyMixins(instance, globalMixins, deferredData, deferredWatch, deferredProvide);
  }
  if (extendsOptions) {
    applyOptions(instance, extendsOptions, deferredData, deferredWatch, deferredProvide, true);
  }
  if (mixins) {
    applyMixins(instance, mixins, deferredData, deferredWatch, deferredProvide);
  }
  if (injectOptions) {
    if (isArray$6(injectOptions)) {
      for (let i = 0; i < injectOptions.length; i++) {
        const key = injectOptions[i];
        ctx[key] = inject(key);
      }
    } else {
      for (const key in injectOptions) {
        const opt = injectOptions[key];
        if (isObject$9(opt)) {
          ctx[key] = inject(opt.from || key, opt.default, true);
        } else {
          ctx[key] = inject(opt);
        }
      }
    }
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$3(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (!asMixin) {
    if (deferredData.length) {
      deferredData.forEach((dataFn) => resolveData(instance, dataFn, publicThis));
    }
    if (dataOptions) {
      resolveData(instance, dataOptions, publicThis);
    }
  } else if (dataOptions) {
    deferredData.push(dataOptions);
  }
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$3(opt) ? opt.bind(publicThis, publicThis) : isFunction$3(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$3(opt) && isFunction$3(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    deferredWatch.push(watchOptions);
  }
  if (!asMixin && deferredWatch.length) {
    deferredWatch.forEach((watchOptions2) => {
      for (const key in watchOptions2) {
        createWatcher(watchOptions2[key], ctx, publicThis, key);
      }
    });
  }
  if (provideOptions) {
    deferredProvide.push(provideOptions);
  }
  if (!asMixin && deferredProvide.length) {
    deferredProvide.forEach((provideOptions2) => {
      const provides = isFunction$3(provideOptions2) ? provideOptions2.call(publicThis) : provideOptions2;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    });
  }
  if (asMixin) {
    if (components) {
      extend(instance.components || (instance.components = extend({}, instance.type.components)), components);
    }
    if (directives) {
      extend(instance.directives || (instance.directives = extend({}, instance.type.directives)), directives);
    }
  }
  if (!asMixin) {
    callSyncHook("created", "c", options, instance, globalMixins);
  }
  if (beforeMount) {
    onBeforeMount(beforeMount.bind(publicThis));
  }
  if (mounted) {
    onMounted(mounted.bind(publicThis));
  }
  if (beforeUpdate) {
    onBeforeUpdate(beforeUpdate.bind(publicThis));
  }
  if (updated) {
    onUpdated(updated.bind(publicThis));
  }
  if (activated) {
    onActivated(activated.bind(publicThis));
  }
  if (deactivated) {
    onDeactivated(deactivated.bind(publicThis));
  }
  if (errorCaptured) {
    onErrorCaptured(errorCaptured.bind(publicThis));
  }
  if (renderTracked) {
    onRenderTracked(renderTracked.bind(publicThis));
  }
  if (renderTriggered) {
    onRenderTriggered(renderTriggered.bind(publicThis));
  }
  if (beforeUnmount) {
    onBeforeUnmount(beforeUnmount.bind(publicThis));
  }
  if (unmounted) {
    onUnmounted(unmounted.bind(publicThis));
  }
  if (isArray$6(expose)) {
    if (!asMixin) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = proxyRefs({}));
        expose.forEach((key) => {
          exposed[key] = toRef(publicThis, key);
        });
      } else if (!instance.exposed) {
        instance.exposed = EMPTY_OBJ;
      }
    }
  }
}
function callSyncHook(name, type2, options, instance, globalMixins) {
  for (let i = 0; i < globalMixins.length; i++) {
    callHookWithMixinAndExtends(name, type2, globalMixins[i], instance);
  }
  callHookWithMixinAndExtends(name, type2, options, instance);
}
function callHookWithMixinAndExtends(name, type2, options, instance) {
  const {extends: base, mixins} = options;
  const selfHook = options[name];
  if (base) {
    callHookWithMixinAndExtends(name, type2, base, instance);
  }
  if (mixins) {
    for (let i = 0; i < mixins.length; i++) {
      callHookWithMixinAndExtends(name, type2, mixins[i], instance);
    }
  }
  if (selfHook) {
    callWithAsyncErrorHandling(selfHook.bind(instance.proxy), instance, type2);
  }
}
function applyMixins(instance, mixins, deferredData, deferredWatch, deferredProvide) {
  for (let i = 0; i < mixins.length; i++) {
    applyOptions(instance, mixins[i], deferredData, deferredWatch, deferredProvide, true);
  }
}
function resolveData(instance, dataFn, publicThis) {
  shouldCacheAccess = false;
  const data = dataFn.call(publicThis, publicThis);
  shouldCacheAccess = true;
  if (!isObject$9(data))
    ;
  else if (instance.data === EMPTY_OBJ) {
    instance.data = reactive(data);
  } else {
    extend(instance.data, data);
  }
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction$3(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$3(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$9(raw)) {
    if (isArray$6(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$3(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$3(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function resolveMergedOptions(instance) {
  const raw = instance.type;
  const {__merged, mixins, extends: extendsOptions} = raw;
  if (__merged)
    return __merged;
  const globalMixins = instance.appContext.mixins;
  if (!globalMixins.length && !mixins && !extendsOptions)
    return raw;
  const options = {};
  globalMixins.forEach((m) => mergeOptions(options, m, instance));
  mergeOptions(options, raw, instance);
  return raw.__merged = options;
}
function mergeOptions(to2, from, instance) {
  const strats = instance.appContext.config.optionMergeStrategies;
  const {mixins, extends: extendsOptions} = from;
  extendsOptions && mergeOptions(to2, extendsOptions, instance);
  mixins && mixins.forEach((m) => mergeOptions(to2, m, instance));
  for (const key in from) {
    if (strats && hasOwn(strats, key)) {
      to2[key] = strats[key](to2[key], from[key], instance.proxy, key);
    } else {
      to2[key] = from[key];
    }
  }
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return i.exposed ? i.exposed : i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => () => queueJob(i.update),
  $nextTick: (i) => nextTick.bind(i.proxy),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({_: instance}, key) {
    const {ctx, setupState, data, props, accessCache, type: type2, appContext} = instance;
    if (key === "__v_skip") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 0:
            return setupState[key];
          case 1:
            return data[key];
          case 3:
            return ctx[key];
          case 2:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 0;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 1;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 2;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 3;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 4;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type2.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 3;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      return globalProperties[key];
    } else
      ;
  },
  set({_: instance}, key, value) {
    const {data, setupState, ctx} = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({_: {data, setupState, accessCache, ctx, appContext, propsOptions}}, key) {
    let normalizedProps;
    return accessCache[key] !== void 0 || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  }
};
const RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
  get(target, key) {
    if (key === Symbol.unscopables) {
      return;
    }
    return PublicInstanceProxyHandlers.get(target, key, target);
  },
  has(_, key) {
    const has2 = key[0] !== "_" && !isGloballyWhitelisted(key);
    return has2;
  }
});
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent2, suspense) {
  const type2 = vnode.type;
  const appContext = (parent2 ? parent2.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type: type2,
    parent: parent2,
    appContext,
    root: null,
    next: null,
    subTree: null,
    update: null,
    render: null,
    proxy: null,
    exposed: null,
    withProxy: null,
    effects: null,
    provides: parent2 ? parent2.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type2, appContext),
    emitsOptions: normalizeEmitsOptions(type2, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null
  };
  {
    instance.ctx = {_: instance};
  }
  instance.root = parent2 ? parent2.root : instance;
  instance.emit = emit.bind(null, instance);
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const {props, children} = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const {setup} = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    currentInstance = instance;
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    currentInstance = null;
    if (isPromise(setupResult)) {
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$3(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$9(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
    if (instance.render._rc) {
      instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
    }
  }
  {
    currentInstance = instance;
    pauseTracking();
    applyOptions(instance, Component);
    resetTracking();
    currentInstance = null;
  }
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = proxyRefs(exposed);
  };
  {
    return {
      attrs: instance.attrs,
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function recordInstanceBoundEffect(effect2, instance = currentInstance) {
  if (instance) {
    (instance.effects || (instance.effects = [])).push(effect2);
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component) {
  return isFunction$3(Component) ? Component.displayName || Component.name : Component.name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction$3(value) && "__vccOpts" in value;
}
function computed(getterOrOptions) {
  const c = computed$1(getterOrOptions);
  recordInstanceBoundEffect(c.effect);
  return c;
}
function h(type2, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$9(propsOrChildren) && !isArray$6(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type2, null, [propsOrChildren]);
      }
      return createVNode(type2, propsOrChildren);
    } else {
      return createVNode(type2, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type2, propsOrChildren, children);
  }
}
function renderList(source, renderItem) {
  let ret;
  if (isArray$6(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i);
    }
  } else if (isObject$9(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, renderItem);
    } else {
      const keys2 = Object.keys(source);
      ret = new Array(keys2.length);
      for (let i = 0, l = keys2.length; i < l; i++) {
        const key = keys2[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function toHandlers(obj) {
  const ret = {};
  for (const key in obj) {
    ret[toHandlerKey(key)] = obj[key];
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray$6(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.fn;
    }
  }
  return slots;
}
const version = "3.0.11";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
let tempContainer;
let tempSVGContainer;
const nodeOps = {
  insert: (child, parent2, anchor) => {
    parent2.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent2 = child.parentNode;
    if (parent2) {
      parent2.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is2, props) => {
    const el2 = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is2 ? {is: is2} : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el2.setAttribute("multiple", props.multiple);
    }
    return el2;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el2, text) => {
    el2.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el2, id2) {
    el2.setAttribute(id2, "");
  },
  cloneNode(el2) {
    const cloned = el2.cloneNode(true);
    if (`_value` in el2) {
      cloned._value = el2._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent2, anchor, isSVG) {
    const temp = isSVG ? tempSVGContainer || (tempSVGContainer = doc.createElementNS(svgNS, "svg")) : tempContainer || (tempContainer = doc.createElement("div"));
    temp.innerHTML = content;
    const first = temp.firstChild;
    let node = first;
    let last = node;
    while (node) {
      last = node;
      nodeOps.insert(node, parent2, anchor);
      node = temp.firstChild;
    }
    return [first, last];
  }
};
function patchClass(el2, value, isSVG) {
  if (value == null) {
    value = "";
  }
  if (isSVG) {
    el2.setAttribute("class", value);
  } else {
    const transitionClasses = el2._vtc;
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    el2.className = value;
  }
}
function patchStyle(el2, prev, next) {
  const style = el2.style;
  if (!next) {
    el2.removeAttribute("style");
  } else if (isString(next)) {
    if (prev !== next) {
      const current = style.display;
      style.cssText = next;
      if ("_vod" in el2) {
        style.display = current;
      }
    }
  } else {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$6(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el2, key, value, isSVG) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el2.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el2.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && value === false) {
      el2.removeAttribute(key);
    } else {
      el2.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el2, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el2[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el2.tagName !== "PROGRESS") {
    el2._value = value;
    const newValue = value == null ? "" : value;
    if (el2.value !== newValue) {
      el2.value = newValue;
    }
    return;
  }
  if (value === "" || value == null) {
    const type2 = typeof el2[key];
    if (value === "" && type2 === "boolean") {
      el2[key] = true;
      return;
    } else if (value == null && type2 === "string") {
      el2[key] = "";
      el2.removeAttribute(key);
      return;
    } else if (type2 === "number") {
      el2[key] = 0;
      el2.removeAttribute(key);
      return;
    }
  }
  try {
    el2[key] = value;
  } catch (e) {
  }
}
let _getNow = Date.now;
let skipTimestampCheck = false;
if (typeof window !== "undefined") {
  if (_getNow() > document.createEvent("Event").timeStamp) {
    _getNow = () => performance.now();
  }
  const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
  skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
}
let cachedNow = 0;
const p = Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener$1(el2, event2, handler, options) {
  el2.addEventListener(event2, handler, options);
}
function removeEventListener$1(el2, event2, handler, options) {
  el2.removeEventListener(event2, handler, options);
}
function patchEvent(el2, rawName, prevValue, nextValue, instance = null) {
  const invokers = el2._vei || (el2._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener$1(el2, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener$1(el2, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$6(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn3) => (e2) => !e2._stopped && fn3(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const forcePatchProp = (_, key) => key === "value";
const patchProp = (el2, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  switch (key) {
    case "class":
      patchClass(el2, nextValue, isSVG);
      break;
    case "style":
      patchStyle(el2, prevValue, nextValue);
      break;
    default:
      if (isOn(key)) {
        if (!isModelListener(key)) {
          patchEvent(el2, key, prevValue, nextValue, parentComponent);
        }
      } else if (shouldSetAsProp(el2, key, nextValue, isSVG)) {
        patchDOMProp(el2, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
      } else {
        if (key === "true-value") {
          el2._trueValue = nextValue;
        } else if (key === "false-value") {
          el2._falseValue = nextValue;
        }
        patchAttr(el2, key, nextValue, isSVG);
      }
      break;
  }
};
function shouldSetAsProp(el2, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML") {
      return true;
    }
    if (key in el2 && nativeOnRE.test(key) && isFunction$3(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el2.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el2.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el2;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, {slots}) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
function resolveTransitionProps(rawProps) {
  let {name = "v", type: type2, css = true, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to`} = rawProps;
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (!css) {
    return baseProps;
  }
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled} = baseProps;
  const finishEnter = (el2, isAppear, done) => {
    removeTransitionClass(el2, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el2, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el2, done) => {
    removeTransitionClass(el2, leaveToClass);
    removeTransitionClass(el2, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el2, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el2, isAppear, done);
      hook && hook(el2, resolve2);
      nextFrame(() => {
        removeTransitionClass(el2, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el2, isAppear ? appearToClass : enterToClass);
        if (!(hook && hook.length > 1)) {
          whenTransitionEnds(el2, type2, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el2) {
      onBeforeEnter && onBeforeEnter(el2);
      addTransitionClass(el2, enterFromClass);
      addTransitionClass(el2, enterActiveClass);
    },
    onBeforeAppear(el2) {
      onBeforeAppear && onBeforeAppear(el2);
      addTransitionClass(el2, appearFromClass);
      addTransitionClass(el2, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el2, done) {
      const resolve2 = () => finishLeave(el2, done);
      addTransitionClass(el2, leaveFromClass);
      forceReflow();
      addTransitionClass(el2, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el2, leaveFromClass);
        addTransitionClass(el2, leaveToClass);
        if (!(onLeave && onLeave.length > 1)) {
          whenTransitionEnds(el2, type2, leaveDuration, resolve2);
        }
      });
      onLeave && onLeave(el2, resolve2);
    },
    onEnterCancelled(el2) {
      finishEnter(el2, false);
      onEnterCancelled && onEnterCancelled(el2);
    },
    onAppearCancelled(el2) {
      finishEnter(el2, true);
      onAppearCancelled && onAppearCancelled(el2);
    },
    onLeaveCancelled(el2) {
      finishLeave(el2);
      onLeaveCancelled && onLeaveCancelled(el2);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$9(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber$2(val);
  return res;
}
function addTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.add(c));
  (el2._vtc || (el2._vtc = new Set())).add(cls);
}
function removeTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.remove(c));
  const {_vtc} = el2;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el2._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el2, expectedType, explicitTimeout, resolve2) {
  const id2 = el2._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id2 === el2._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const {type: type2, timeout, propCount} = getTransitionInfo(el2, expectedType);
  if (!type2) {
    return resolve2();
  }
  const endEvent = type2 + "end";
  let ended = 0;
  const end2 = () => {
    el2.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el2 && ++ended >= propCount) {
      end2();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end2();
    }
  }, timeout + 1);
  el2.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el2, expectedType) {
  const styles = window.getComputedStyle(el2);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type2 = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type2 = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type2 = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type2 = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type2 ? type2 === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type2 === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type: type2,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const positionMap = new WeakMap();
const newPositionMap = new WeakMap();
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, {slots}) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el2 = c.el;
        const style = el2.style;
        addTransitionClass(el2, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el2._moveCb = (e) => {
          if (e && e.target !== el2) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el2.removeEventListener("transitionend", cb);
            el2._moveCb = null;
            removeTransitionClass(el2, moveClass);
          }
        };
        el2.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      const tag = rawProps.tag || Fragment;
      prevChildren = children;
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el2 = c.el;
  if (el2._moveCb) {
    el2._moveCb();
  }
  if (el2._enterCb) {
    el2._enterCb();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el2, root2, moveClass) {
  const clone = el2.cloneNode();
  if (el2._vtc) {
    el2._vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root2.nodeType === 1 ? root2 : root2.parentNode;
  container.appendChild(clone);
  const {hasTransform} = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn3 = vnode.props["onUpdate:modelValue"];
  return isArray$6(fn3) ? (value) => invokeArrayFns(fn3, value) : fn3;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    trigger(target, "input");
  }
}
function trigger(el2, type2) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type2, true, true);
  el2.dispatchEvent(e);
}
const vModelText = {
  created(el2, {modifiers: {lazy, trim, number: number3}}, vnode) {
    el2._assign = getModelAssigner(vnode);
    const castToNumber = number3 || el2.type === "number";
    addEventListener$1(el2, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el2.value;
      if (trim) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = toNumber$2(domValue);
      }
      el2._assign(domValue);
    });
    if (trim) {
      addEventListener$1(el2, "change", () => {
        el2.value = el2.value.trim();
      });
    }
    if (!lazy) {
      addEventListener$1(el2, "compositionstart", onCompositionStart);
      addEventListener$1(el2, "compositionend", onCompositionEnd);
      addEventListener$1(el2, "change", onCompositionEnd);
    }
  },
  mounted(el2, {value}) {
    el2.value = value == null ? "" : value;
  },
  beforeUpdate(el2, {value, modifiers: {trim, number: number3}}, vnode) {
    el2._assign = getModelAssigner(vnode);
    if (el2.composing)
      return;
    if (document.activeElement === el2) {
      if (trim && el2.value.trim() === value) {
        return;
      }
      if ((number3 || el2.type === "number") && toNumber$2(el2.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el2.value !== newValue) {
      el2.value = newValue;
    }
  }
};
const vModelCheckbox = {
  created(el2, _, vnode) {
    el2._assign = getModelAssigner(vnode);
    addEventListener$1(el2, "change", () => {
      const modelValue = el2._modelValue;
      const elementValue = getValue$2(el2);
      const checked = el2.checked;
      const assign = el2._assign;
      if (isArray$6(modelValue)) {
        const index2 = looseIndexOf(modelValue, elementValue);
        const found = index2 !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index2, 1);
          assign(filtered);
        }
      } else if (isSet$2(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el2, checked));
      }
    });
  },
  mounted: setChecked,
  beforeUpdate(el2, binding, vnode) {
    el2._assign = getModelAssigner(vnode);
    setChecked(el2, binding, vnode);
  }
};
function setChecked(el2, {value, oldValue}, vnode) {
  el2._modelValue = value;
  if (isArray$6(value)) {
    el2.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet$2(value)) {
    el2.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el2.checked = looseEqual(value, getCheckboxValue(el2, true));
  }
}
const vModelRadio = {
  created(el2, {value}, vnode) {
    el2.checked = looseEqual(value, vnode.props.value);
    el2._assign = getModelAssigner(vnode);
    addEventListener$1(el2, "change", () => {
      el2._assign(getValue$2(el2));
    });
  },
  beforeUpdate(el2, {value, oldValue}, vnode) {
    el2._assign = getModelAssigner(vnode);
    if (value !== oldValue) {
      el2.checked = looseEqual(value, vnode.props.value);
    }
  }
};
function getValue$2(el2) {
  return "_value" in el2 ? el2._value : el2.value;
}
function getCheckboxValue(el2, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el2 ? el2[key] : checked;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn3, modifiers) => {
  return (event2, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event2, modifiers))
        return;
    }
    return fn3(event2, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn3, modifiers) => {
  return (event2) => {
    if (!("key" in event2))
      return;
    const eventKey = hyphenate(event2.key);
    if (!modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return;
    }
    return fn3(event2);
  };
};
const vShow = {
  beforeMount(el2, {value}, {transition}) {
    el2._vod = el2.style.display === "none" ? "" : el2.style.display;
    if (transition && value) {
      transition.beforeEnter(el2);
    } else {
      setDisplay(el2, value);
    }
  },
  mounted(el2, {value}, {transition}) {
    if (transition && value) {
      transition.enter(el2);
    }
  },
  updated(el2, {value, oldValue}, {transition}) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el2);
        setDisplay(el2, true);
        transition.enter(el2);
      } else {
        transition.leave(el2, () => {
          setDisplay(el2, false);
        });
      }
    } else {
      setDisplay(el2, value);
    }
  },
  beforeUnmount(el2, {value}) {
    setDisplay(el2, value);
  }
};
function setDisplay(el2, value) {
  el2.style.display = value ? el2._vod : "none";
}
const rendererOptions = extend({patchProp, forcePatchProp}, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const {mount} = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction$3(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var MapShim = function() {
  if (typeof Map !== "undefined") {
    return Map;
  }
  function getIndex(arr, key) {
    var result = -1;
    arr.some(function(entry, index2) {
      if (entry[0] === key) {
        result = index2;
        return true;
      }
      return false;
    });
    return result;
  }
  return function() {
    function class_1() {
      this.__entries__ = [];
    }
    Object.defineProperty(class_1.prototype, "size", {
      get: function() {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true
    });
    class_1.prototype.get = function(key) {
      var index2 = getIndex(this.__entries__, key);
      var entry = this.__entries__[index2];
      return entry && entry[1];
    };
    class_1.prototype.set = function(key, value) {
      var index2 = getIndex(this.__entries__, key);
      if (~index2) {
        this.__entries__[index2][1] = value;
      } else {
        this.__entries__.push([key, value]);
      }
    };
    class_1.prototype.delete = function(key) {
      var entries = this.__entries__;
      var index2 = getIndex(entries, key);
      if (~index2) {
        entries.splice(index2, 1);
      }
    };
    class_1.prototype.has = function(key) {
      return !!~getIndex(this.__entries__, key);
    };
    class_1.prototype.clear = function() {
      this.__entries__.splice(0);
    };
    class_1.prototype.forEach = function(callback, ctx) {
      if (ctx === void 0) {
        ctx = null;
      }
      for (var _i2 = 0, _a2 = this.__entries__; _i2 < _a2.length; _i2++) {
        var entry = _a2[_i2];
        callback.call(ctx, entry[1], entry[0]);
      }
    };
    return class_1;
  }();
}();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1 = function() {
  if (typeof global !== "undefined" && global.Math === Math) {
    return global;
  }
  if (typeof self !== "undefined" && self.Math === Math) {
    return self;
  }
  if (typeof window !== "undefined" && window.Math === Math) {
    return window;
  }
  return Function("return this")();
}();
var requestAnimationFrame$1 = function() {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame.bind(global$1);
  }
  return function(callback) {
    return setTimeout(function() {
      return callback(Date.now());
    }, 1e3 / 60);
  };
}();
var trailingTimeout = 2;
function throttle$1(callback, delay) {
  var leadingCall = false, trailingCall = false, lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
var ResizeObserverController = function() {
  function ResizeObserverController2() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY);
  }
  ResizeObserverController2.prototype.addObserver = function(observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    }
    if (!this.connected_) {
      this.connect_();
    }
  };
  ResizeObserverController2.prototype.removeObserver = function(observer) {
    var observers2 = this.observers_;
    var index2 = observers2.indexOf(observer);
    if (~index2) {
      observers2.splice(index2, 1);
    }
    if (!observers2.length && this.connected_) {
      this.disconnect_();
    }
  };
  ResizeObserverController2.prototype.refresh = function() {
    var changesDetected = this.updateObservers_();
    if (changesDetected) {
      this.refresh();
    }
  };
  ResizeObserverController2.prototype.updateObservers_ = function() {
    var activeObservers = this.observers_.filter(function(observer) {
      return observer.gatherActive(), observer.hasActive();
    });
    activeObservers.forEach(function(observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  ResizeObserverController2.prototype.connect_ = function() {
    if (!isBrowser || this.connected_) {
      return;
    }
    document.addEventListener("transitionend", this.onTransitionEnd_);
    window.addEventListener("resize", this.refresh);
    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener("DOMSubtreeModified", this.refresh);
      this.mutationEventsAdded_ = true;
    }
    this.connected_ = true;
  };
  ResizeObserverController2.prototype.disconnect_ = function() {
    if (!isBrowser || !this.connected_) {
      return;
    }
    document.removeEventListener("transitionend", this.onTransitionEnd_);
    window.removeEventListener("resize", this.refresh);
    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }
    if (this.mutationEventsAdded_) {
      document.removeEventListener("DOMSubtreeModified", this.refresh);
    }
    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  ResizeObserverController2.prototype.onTransitionEnd_ = function(_a2) {
    var _b = _a2.propertyName, propertyName = _b === void 0 ? "" : _b;
    var isReflowProperty = transitionKeys.some(function(key) {
      return !!~propertyName.indexOf(key);
    });
    if (isReflowProperty) {
      this.refresh();
    }
  };
  ResizeObserverController2.getInstance = function() {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController2();
    }
    return this.instance_;
  };
  ResizeObserverController2.instance_ = null;
  return ResizeObserverController2;
}();
var defineConfigurable = function(target, props) {
  for (var _i2 = 0, _a2 = Object.keys(props); _i2 < _a2.length; _i2++) {
    var key = _a2[_i2];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return target;
};
var getWindowOf = function(target) {
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
  return ownerGlobal || global$1;
};
var emptyRect = createRectInit(0, 0, 0, 0);
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i2 = 1; _i2 < arguments.length; _i2++) {
    positions[_i2 - 1] = arguments[_i2];
  }
  return positions.reduce(function(size2, position) {
    var value = styles["border-" + position + "-width"];
    return size2 + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i2 = 0, positions_1 = positions; _i2 < positions_1.length; _i2++) {
    var position = positions_1[_i2];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width), height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
var isSVGGraphicsElement = function() {
  if (typeof SVGGraphicsElement !== "undefined") {
    return function(target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  }
  return function(target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
  };
}();
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a2) {
  var x = _a2.x, y = _a2.y, width = _a2.width, height = _a2.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
function createRectInit(x, y, width, height) {
  return {x, y, width, height};
}
var ResizeObservation = function() {
  function ResizeObservation2(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  ResizeObservation2.prototype.isActive = function() {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  ResizeObservation2.prototype.broadcastRect = function() {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };
  return ResizeObservation2;
}();
var ResizeObserverEntry = function() {
  function ResizeObserverEntry2(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);
    defineConfigurable(this, {target, contentRect});
  }
  return ResizeObserverEntry2;
}();
var ResizeObserverSPI = function() {
  function ResizeObserverSPI2(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();
    if (typeof callback !== "function") {
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    }
    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  ResizeObserverSPI2.prototype.observe = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (observations.has(target)) {
      return;
    }
    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this);
    this.controller_.refresh();
  };
  ResizeObserverSPI2.prototype.unobserve = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (!observations.has(target)) {
      return;
    }
    observations.delete(target);
    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  ResizeObserverSPI2.prototype.disconnect = function() {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  ResizeObserverSPI2.prototype.gatherActive = function() {
    var _this = this;
    this.clearActive();
    this.observations_.forEach(function(observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  ResizeObserverSPI2.prototype.broadcastActive = function() {
    if (!this.hasActive()) {
      return;
    }
    var ctx = this.callbackCtx_;
    var entries = this.activeObservations_.map(function(observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  ResizeObserverSPI2.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  };
  ResizeObserverSPI2.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  };
  return ResizeObserverSPI2;
}();
var observers = typeof WeakMap !== "undefined" ? new WeakMap() : new MapShim();
var ResizeObserver = function() {
  function ResizeObserver2(callback) {
    if (!(this instanceof ResizeObserver2)) {
      throw new TypeError("Cannot call a class as a function.");
    }
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }
  return ResizeObserver2;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(method3) {
  ResizeObserver.prototype[method3] = function() {
    var _a2;
    return (_a2 = observers.get(this))[method3].apply(_a2, arguments);
  };
});
var index = function() {
  if (typeof global$1.ResizeObserver !== "undefined") {
    return global$1.ResizeObserver;
  }
  return ResizeObserver;
}();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function isObject$8(value) {
  var type2 = typeof value;
  return value != null && (type2 == "object" || type2 == "function");
}
var isObject_1 = isObject$8;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$9 = freeGlobal || freeSelf || Function("return this")();
var _root = root$9;
var root$8 = _root;
var now$1 = function() {
  return root$8.Date.now();
};
var now_1 = now$1;
var reWhitespace = /\s/;
function trimmedEndIndex$1(string2) {
  var index2 = string2.length;
  while (index2-- && reWhitespace.test(string2.charAt(index2))) {
  }
  return index2;
}
var _trimmedEndIndex = trimmedEndIndex$1;
var trimmedEndIndex = _trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim$1(string2) {
  return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
}
var _baseTrim = baseTrim$1;
var root$7 = _root;
var Symbol$6 = root$7.Symbol;
var _Symbol = Symbol$6;
var Symbol$5 = _Symbol;
var objectProto$e = Object.prototype;
var hasOwnProperty$b = objectProto$e.hasOwnProperty;
var nativeObjectToString$1 = objectProto$e.toString;
var symToStringTag$1 = Symbol$5 ? Symbol$5.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto$d = Object.prototype;
var nativeObjectToString = objectProto$d.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$4 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$4 ? Symbol$4.toStringTag : void 0;
function baseGetTag$5(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$5;
function isObjectLike$8(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$8;
var baseGetTag$4 = _baseGetTag, isObjectLike$7 = isObjectLike_1;
var symbolTag$3 = "[object Symbol]";
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike$7(value) && baseGetTag$4(value) == symbolTag$3;
}
var isSymbol_1 = isSymbol$1;
var baseTrim = _baseTrim, isObject$7 = isObject_1, isSymbol = isSymbol_1;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$7(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$7(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_1 = toNumber$1;
var isObject$6 = isObject_1, now = now_1, toNumber = toNumber_1;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax$1 = Math.max, nativeMin = Math.min;
function debounce$2(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$6(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax$1(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var debounce_1 = debounce$2;
var _populated = false;
var _ie, _firefox, _opera, _webkit, _chrome;
var _ie_real_version;
var _osx, _windows, _linux, _android;
var _win64;
var _iphone, _ipad, _native;
var _mobile;
function _populate() {
  if (_populated) {
    return;
  }
  _populated = true;
  var uas = navigator.userAgent;
  var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
  var os2 = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
  _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
  _ipad = /\b(iP[ao]d)/.exec(uas);
  _android = /Android/i.exec(uas);
  _native = /FBAN\/\w+;/i.exec(uas);
  _mobile = /Mobile/i.exec(uas);
  _win64 = !!/Win64/.exec(uas);
  if (agent) {
    _ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN;
    if (_ie && document && document.documentMode) {
      _ie = document.documentMode;
    }
    var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
    _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
    _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
    _opera = agent[3] ? parseFloat(agent[3]) : NaN;
    _webkit = agent[4] ? parseFloat(agent[4]) : NaN;
    if (_webkit) {
      agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
      _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
    } else {
      _chrome = NaN;
    }
  } else {
    _ie = _firefox = _opera = _chrome = _webkit = NaN;
  }
  if (os2) {
    if (os2[1]) {
      var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
      _osx = ver ? parseFloat(ver[1].replace("_", ".")) : true;
    } else {
      _osx = false;
    }
    _windows = !!os2[2];
    _linux = !!os2[3];
  } else {
    _osx = _windows = _linux = false;
  }
}
var UserAgent_DEPRECATED$1 = {
  ie: function() {
    return _populate() || _ie;
  },
  ieCompatibilityMode: function() {
    return _populate() || _ie_real_version > _ie;
  },
  ie64: function() {
    return UserAgent_DEPRECATED$1.ie() && _win64;
  },
  firefox: function() {
    return _populate() || _firefox;
  },
  opera: function() {
    return _populate() || _opera;
  },
  webkit: function() {
    return _populate() || _webkit;
  },
  safari: function() {
    return UserAgent_DEPRECATED$1.webkit();
  },
  chrome: function() {
    return _populate() || _chrome;
  },
  windows: function() {
    return _populate() || _windows;
  },
  osx: function() {
    return _populate() || _osx;
  },
  linux: function() {
    return _populate() || _linux;
  },
  iphone: function() {
    return _populate() || _iphone;
  },
  mobile: function() {
    return _populate() || (_iphone || _ipad || _android || _mobile);
  },
  nativeApp: function() {
    return _populate() || _native;
  },
  android: function() {
    return _populate() || _android;
  },
  ipad: function() {
    return _populate() || _ipad;
  }
};
var UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED$1;
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var ExecutionEnvironment$1 = {
  canUseDOM,
  canUseWorkers: typeof Worker !== "undefined",
  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
  canUseViewport: canUseDOM && !!window.screen,
  isInWorker: !canUseDOM
};
var ExecutionEnvironment_1 = ExecutionEnvironment$1;
var ExecutionEnvironment = ExecutionEnvironment_1;
var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true;
}
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported$1(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM || capture && !("addEventListener" in document)) {
    return false;
  }
  var eventName = "on" + eventNameSuffix;
  var isSupported = eventName in document;
  if (!isSupported) {
    var element = document.createElement("div");
    element.setAttribute(eventName, "return;");
    isSupported = typeof element[eventName] === "function";
  }
  if (!isSupported && useHasFeature && eventNameSuffix === "wheel") {
    isSupported = document.implementation.hasFeature("Events.wheel", "3.0");
  }
  return isSupported;
}
var isEventSupported_1 = isEventSupported$1;
var UserAgent_DEPRECATED = UserAgent_DEPRECATED_1;
var isEventSupported = isEventSupported_1;
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;
function normalizeWheel$1(event2) {
  var sX = 0, sY = 0, pX = 0, pY = 0;
  if ("detail" in event2) {
    sY = event2.detail;
  }
  if ("wheelDelta" in event2) {
    sY = -event2.wheelDelta / 120;
  }
  if ("wheelDeltaY" in event2) {
    sY = -event2.wheelDeltaY / 120;
  }
  if ("wheelDeltaX" in event2) {
    sX = -event2.wheelDeltaX / 120;
  }
  if ("axis" in event2 && event2.axis === event2.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }
  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;
  if ("deltaY" in event2) {
    pY = event2.deltaY;
  }
  if ("deltaX" in event2) {
    pX = event2.deltaX;
  }
  if ((pX || pY) && event2.deltaMode) {
    if (event2.deltaMode == 1) {
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }
  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1;
  }
  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1;
  }
  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY
  };
}
normalizeWheel$1.getEventType = function() {
  return UserAgent_DEPRECATED.firefox() ? "DOMMouseScroll" : isEventSupported("wheel") ? "wheel" : "mousewheel";
};
var normalizeWheel_1 = normalizeWheel$1;
var normalizeWheel = normalizeWheel_1;
function ae(n) {
  return {all: n = n || new Map(), on: function(t, e) {
    var i = n.get(t);
    i && i.push(e) || n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && i.splice(i.indexOf(e) >>> 0, 1);
  }, emit: function(t, e) {
    (n.get(t) || []).slice().map(function(n2) {
      n2(e);
    }), (n.get("*") || []).slice().map(function(n2) {
      n2(t, e);
    });
  }};
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent2, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent2.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent2.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle$1(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys2) {
  return keys2.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets;
  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === "function" ? roundOffsets(offsets) : offsets, _ref3$x = _ref3.x, x = _ref3$x === void 0 ? 0 : _ref3$x, _ref3$y = _ref3.y, y = _ref3$y === void 0 ? 0 : _ref3$y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle$1(offsetParent).position !== "static") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top) {
      sideY = bottom;
      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left) {
      sideX = right;
      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref4) {
  var state = _ref4.state, options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle$1(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function getVariation(placement) {
  return placement.split("-")[1];
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i3) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i3).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i2 = numberOfChecks; _i2 > 0; _i2--) {
      var _ret = _loop(_i2);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = popperOffsets2[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets2[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets2[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets2[mainAxis] + maxOffset - offsetModifierValue;
    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce$1(fn3) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve2) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve2(fn3());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(options2) {
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn3 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn3 === "function") {
            state = fn3({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce$1(function() {
        return new Promise(function(resolve2) {
          instance.forceUpdate();
          resolve2(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn3) {
        return fn3();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
var debounce = debounce_1, isObject$5 = isObject_1;
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject$5(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
var throttle_1 = throttle;
var dayjs_min = {exports: {}};
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = "millisecond", e = "second", n = "minute", r = "hour", i = "day", s = "week", u = "month", a = "quarter", o = "year", f = "date", h2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, c = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, d = {name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")}, $ = function(t2, e2, n2) {
      var r2 = String(t2);
      return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
    }, l = {s: $, z: function(t2) {
      var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
      return (e2 <= 0 ? "+" : "-") + $(r2, 2, "0") + ":" + $(i2, 2, "0");
    }, m: function t2(e2, n2) {
      if (e2.date() < n2.date())
        return -t2(n2, e2);
      var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, u), s2 = n2 - i2 < 0, a2 = e2.clone().add(r2 + (s2 ? -1 : 1), u);
      return +(-(r2 + (n2 - i2) / (s2 ? i2 - a2 : a2 - i2)) || 0);
    }, a: function(t2) {
      return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
    }, p: function(h3) {
      return {M: u, y: o, w: s, d: i, D: f, h: r, m: n, s: e, ms: t, Q: a}[h3] || String(h3 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t2) {
      return t2 === void 0;
    }}, y = "en", M = {};
    M[y] = d;
    var m = function(t2) {
      return t2 instanceof S;
    }, D = function(t2, e2, n2) {
      var r2;
      if (!t2)
        return y;
      if (typeof t2 == "string")
        M[t2] && (r2 = t2), e2 && (M[t2] = e2, r2 = t2);
      else {
        var i2 = t2.name;
        M[i2] = t2, r2 = i2;
      }
      return !n2 && r2 && (y = r2), r2 || !n2 && y;
    }, v = function(t2, e2) {
      if (m(t2))
        return t2.clone();
      var n2 = typeof e2 == "object" ? e2 : {};
      return n2.date = t2, n2.args = arguments, new S(n2);
    }, g = l;
    g.l = D, g.i = m, g.w = function(t2, e2) {
      return v(t2, {locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset});
    };
    var S = function() {
      function d2(t2) {
        this.$L = D(t2.locale, null, true), this.parse(t2);
      }
      var $2 = d2.prototype;
      return $2.parse = function(t2) {
        this.$d = function(t3) {
          var e2 = t3.date, n2 = t3.utc;
          if (e2 === null)
            return new Date(NaN);
          if (g.u(e2))
            return new Date();
          if (e2 instanceof Date)
            return new Date(e2);
          if (typeof e2 == "string" && !/Z$/i.test(e2)) {
            var r2 = e2.match(h2);
            if (r2) {
              var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
              return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
            }
          }
          return new Date(e2);
        }(t2), this.$x = t2.x || {}, this.init();
      }, $2.init = function() {
        var t2 = this.$d;
        this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
      }, $2.$utils = function() {
        return g;
      }, $2.isValid = function() {
        return !(this.$d.toString() === "Invalid Date");
      }, $2.isSame = function(t2, e2) {
        var n2 = v(t2);
        return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
      }, $2.isAfter = function(t2, e2) {
        return v(t2) < this.startOf(e2);
      }, $2.isBefore = function(t2, e2) {
        return this.endOf(e2) < v(t2);
      }, $2.$g = function(t2, e2, n2) {
        return g.u(t2) ? this[e2] : this.set(n2, t2);
      }, $2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, $2.valueOf = function() {
        return this.$d.getTime();
      }, $2.startOf = function(t2, a2) {
        var h3 = this, c2 = !!g.u(a2) || a2, d3 = g.p(t2), $3 = function(t3, e2) {
          var n2 = g.w(h3.$u ? Date.UTC(h3.$y, e2, t3) : new Date(h3.$y, e2, t3), h3);
          return c2 ? n2 : n2.endOf(i);
        }, l2 = function(t3, e2) {
          return g.w(h3.toDate()[t3].apply(h3.toDate("s"), (c2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e2)), h3);
        }, y2 = this.$W, M2 = this.$M, m2 = this.$D, D2 = "set" + (this.$u ? "UTC" : "");
        switch (d3) {
          case o:
            return c2 ? $3(1, 0) : $3(31, 11);
          case u:
            return c2 ? $3(1, M2) : $3(0, M2 + 1);
          case s:
            var v2 = this.$locale().weekStart || 0, S2 = (y2 < v2 ? y2 + 7 : y2) - v2;
            return $3(c2 ? m2 - S2 : m2 + (6 - S2), M2);
          case i:
          case f:
            return l2(D2 + "Hours", 0);
          case r:
            return l2(D2 + "Minutes", 1);
          case n:
            return l2(D2 + "Seconds", 2);
          case e:
            return l2(D2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, $2.endOf = function(t2) {
        return this.startOf(t2, false);
      }, $2.$set = function(s2, a2) {
        var h3, c2 = g.p(s2), d3 = "set" + (this.$u ? "UTC" : ""), $3 = (h3 = {}, h3[i] = d3 + "Date", h3[f] = d3 + "Date", h3[u] = d3 + "Month", h3[o] = d3 + "FullYear", h3[r] = d3 + "Hours", h3[n] = d3 + "Minutes", h3[e] = d3 + "Seconds", h3[t] = d3 + "Milliseconds", h3)[c2], l2 = c2 === i ? this.$D + (a2 - this.$W) : a2;
        if (c2 === u || c2 === o) {
          var y2 = this.clone().set(f, 1);
          y2.$d[$3](l2), y2.init(), this.$d = y2.set(f, Math.min(this.$D, y2.daysInMonth())).$d;
        } else
          $3 && this.$d[$3](l2);
        return this.init(), this;
      }, $2.set = function(t2, e2) {
        return this.clone().$set(t2, e2);
      }, $2.get = function(t2) {
        return this[g.p(t2)]();
      }, $2.add = function(t2, a2) {
        var f2, h3 = this;
        t2 = Number(t2);
        var c2 = g.p(a2), d3 = function(e2) {
          var n2 = v(h3);
          return g.w(n2.date(n2.date() + Math.round(e2 * t2)), h3);
        };
        if (c2 === u)
          return this.set(u, this.$M + t2);
        if (c2 === o)
          return this.set(o, this.$y + t2);
        if (c2 === i)
          return d3(1);
        if (c2 === s)
          return d3(7);
        var $3 = (f2 = {}, f2[n] = 6e4, f2[r] = 36e5, f2[e] = 1e3, f2)[c2] || 1, l2 = this.$d.getTime() + t2 * $3;
        return g.w(l2, this);
      }, $2.subtract = function(t2, e2) {
        return this.add(-1 * t2, e2);
      }, $2.format = function(t2) {
        var e2 = this;
        if (!this.isValid())
          return "Invalid Date";
        var n2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", r2 = g.z(this), i2 = this.$locale(), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = i2.weekdays, f2 = i2.months, h3 = function(t3, r3, i3, s3) {
          return t3 && (t3[r3] || t3(e2, n2)) || i3[r3].substr(0, s3);
        }, d3 = function(t3) {
          return g.s(s2 % 12 || 12, t3, "0");
        }, $3 = i2.meridiem || function(t3, e3, n3) {
          var r3 = t3 < 12 ? "AM" : "PM";
          return n3 ? r3.toLowerCase() : r3;
        }, l2 = {YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: g.s(a2 + 1, 2, "0"), MMM: h3(i2.monthsShort, a2, f2, 3), MMMM: h3(f2, a2), D: this.$D, DD: g.s(this.$D, 2, "0"), d: String(this.$W), dd: h3(i2.weekdaysMin, this.$W, o2, 2), ddd: h3(i2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: g.s(s2, 2, "0"), h: d3(1), hh: d3(2), a: $3(s2, u2, true), A: $3(s2, u2, false), m: String(u2), mm: g.s(u2, 2, "0"), s: String(this.$s), ss: g.s(this.$s, 2, "0"), SSS: g.s(this.$ms, 3, "0"), Z: r2};
        return n2.replace(c, function(t3, e3) {
          return e3 || l2[t3] || r2.replace(":", "");
        });
      }, $2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, $2.diff = function(t2, f2, h3) {
        var c2, d3 = g.p(f2), $3 = v(t2), l2 = 6e4 * ($3.utcOffset() - this.utcOffset()), y2 = this - $3, M2 = g.m(this, $3);
        return M2 = (c2 = {}, c2[o] = M2 / 12, c2[u] = M2, c2[a] = M2 / 3, c2[s] = (y2 - l2) / 6048e5, c2[i] = (y2 - l2) / 864e5, c2[r] = y2 / 36e5, c2[n] = y2 / 6e4, c2[e] = y2 / 1e3, c2)[d3] || y2, h3 ? M2 : g.a(M2);
      }, $2.daysInMonth = function() {
        return this.endOf(u).$D;
      }, $2.$locale = function() {
        return M[this.$L];
      }, $2.locale = function(t2, e2) {
        if (!t2)
          return this.$L;
        var n2 = this.clone(), r2 = D(t2, e2, true);
        return r2 && (n2.$L = r2), n2;
      }, $2.clone = function() {
        return g.w(this.$d, this);
      }, $2.toDate = function() {
        return new Date(this.valueOf());
      }, $2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, $2.toISOString = function() {
        return this.$d.toISOString();
      }, $2.toString = function() {
        return this.$d.toUTCString();
      }, d2;
    }(), p2 = S.prototype;
    return v.prototype = p2, [["$ms", t], ["$s", e], ["$m", n], ["$H", r], ["$W", i], ["$M", u], ["$y", o], ["$D", f]].forEach(function(t2) {
      p2[t2[1]] = function(e2) {
        return this.$g(e2, t2[0], t2[1]);
      };
    }), v.extend = function(t2, e2) {
      return t2.$i || (t2(e2, S, v), t2.$i = true), v;
    }, v.locale = D, v.isDayjs = m, v.unix = function(t2) {
      return v(1e3 * t2);
    }, v.en = M[y], v.Ls = M, v.p = {}, v;
  });
})(dayjs_min);
var ie = dayjs_min.exports;
var localeData = {exports: {}};
(function(module, exports) {
  !function(n, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(n, t, e) {
      var r = function(n2) {
        return n2 && (n2.indexOf ? n2 : n2.s);
      }, o = function(n2, t2, e2, o2, u2) {
        var a2 = n2.name ? n2 : n2.$locale(), i = r(a2[t2]), s = r(a2[e2]), d = i || s.map(function(n3) {
          return n3.substr(0, o2);
        });
        if (!u2)
          return d;
        var f = a2.weekStart;
        return d.map(function(n3, t3) {
          return d[(t3 + (f || 0)) % 7];
        });
      }, u = function() {
        return e.Ls[e.locale()];
      }, a = function(n2, t2) {
        return n2.formats[t2] || function(n3) {
          return n3.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(n4, t3, e2) {
            return t3 || e2.slice(1);
          });
        }(n2.formats[t2.toUpperCase()]);
      };
      t.prototype.localeData = function() {
        return function() {
          var n2 = this;
          return {months: function(t2) {
            return t2 ? t2.format("MMMM") : o(n2, "months");
          }, monthsShort: function(t2) {
            return t2 ? t2.format("MMM") : o(n2, "monthsShort", "months", 3);
          }, firstDayOfWeek: function() {
            return n2.$locale().weekStart || 0;
          }, weekdays: function(t2) {
            return t2 ? t2.format("dddd") : o(n2, "weekdays");
          }, weekdaysMin: function(t2) {
            return t2 ? t2.format("dd") : o(n2, "weekdaysMin", "weekdays", 2);
          }, weekdaysShort: function(t2) {
            return t2 ? t2.format("ddd") : o(n2, "weekdaysShort", "weekdays", 3);
          }, longDateFormat: function(t2) {
            return a(n2.$locale(), t2);
          }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal};
        }.bind(this)();
      }, e.localeData = function() {
        var n2 = u();
        return {firstDayOfWeek: function() {
          return n2.weekStart || 0;
        }, weekdays: function() {
          return e.weekdays();
        }, weekdaysShort: function() {
          return e.weekdaysShort();
        }, weekdaysMin: function() {
          return e.weekdaysMin();
        }, months: function() {
          return e.months();
        }, monthsShort: function() {
          return e.monthsShort();
        }, longDateFormat: function(t2) {
          return a(n2, t2);
        }, meridiem: n2.meridiem, ordinal: n2.ordinal};
      }, e.months = function() {
        return o(u(), "months");
      }, e.monthsShort = function() {
        return o(u(), "monthsShort", "months", 3);
      }, e.weekdays = function(n2) {
        return o(u(), "weekdays", null, null, n2);
      }, e.weekdaysShort = function(n2) {
        return o(u(), "weekdaysShort", "weekdays", 3, n2);
      }, e.weekdaysMin = function(n2) {
        return o(u(), "weekdaysMin", "weekdays", 2, n2);
      };
    };
  });
})(localeData);
var re = localeData.exports;
var customParseFormat = {exports: {}};
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = {LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A"}, e = function(e2, n2) {
      return e2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(e3, r2, i2) {
        var o2 = i2 && i2.toUpperCase();
        return r2 || n2[i2] || t[i2] || n2[o2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(t2, e4, n3) {
          return e4 || n3.slice(1);
        });
      });
    }, n = /(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, r = /\d\d/, i = /\d\d?/, o = /\d*[^\s\d-_:/()]+/, s = {};
    var a = function(t2) {
      return function(e2) {
        this[t2] = +e2;
      };
    }, f = [/[+-]\d\d:?(\d\d)?/, function(t2) {
      (this.zone || (this.zone = {})).offset = function(t3) {
        if (!t3)
          return 0;
        var e2 = t3.match(/([+-]|\d\d)/g), n2 = 60 * e2[1] + (+e2[2] || 0);
        return n2 === 0 ? 0 : e2[0] === "+" ? -n2 : n2;
      }(t2);
    }], u = function(t2) {
      var e2 = s[t2];
      return e2 && (e2.indexOf ? e2 : e2.s.concat(e2.f));
    }, h2 = function(t2, e2) {
      var n2, r2 = s.meridiem;
      if (r2) {
        for (var i2 = 1; i2 <= 24; i2 += 1)
          if (t2.indexOf(r2(i2, 0, e2)) > -1) {
            n2 = i2 > 12;
            break;
          }
      } else
        n2 = t2 === (e2 ? "pm" : "PM");
      return n2;
    }, d = {A: [o, function(t2) {
      this.afternoon = h2(t2, false);
    }], a: [o, function(t2) {
      this.afternoon = h2(t2, true);
    }], S: [/\d/, function(t2) {
      this.milliseconds = 100 * +t2;
    }], SS: [r, function(t2) {
      this.milliseconds = 10 * +t2;
    }], SSS: [/\d{3}/, function(t2) {
      this.milliseconds = +t2;
    }], s: [i, a("seconds")], ss: [i, a("seconds")], m: [i, a("minutes")], mm: [i, a("minutes")], H: [i, a("hours")], h: [i, a("hours")], HH: [i, a("hours")], hh: [i, a("hours")], D: [i, a("day")], DD: [r, a("day")], Do: [o, function(t2) {
      var e2 = s.ordinal, n2 = t2.match(/\d+/);
      if (this.day = n2[0], e2)
        for (var r2 = 1; r2 <= 31; r2 += 1)
          e2(r2).replace(/\[|\]/g, "") === t2 && (this.day = r2);
    }], M: [i, a("month")], MM: [r, a("month")], MMM: [o, function(t2) {
      var e2 = u("months"), n2 = (u("monthsShort") || e2.map(function(t3) {
        return t3.substr(0, 3);
      })).indexOf(t2) + 1;
      if (n2 < 1)
        throw new Error();
      this.month = n2 % 12 || n2;
    }], MMMM: [o, function(t2) {
      var e2 = u("months").indexOf(t2) + 1;
      if (e2 < 1)
        throw new Error();
      this.month = e2 % 12 || e2;
    }], Y: [/[+-]?\d+/, a("year")], YY: [r, function(t2) {
      t2 = +t2, this.year = t2 + (t2 > 68 ? 1900 : 2e3);
    }], YYYY: [/\d{4}/, a("year")], Z: f, ZZ: f};
    var c = function(t2, r2, i2) {
      try {
        var o2 = function(t3) {
          for (var r3 = (t3 = e(t3, s && s.formats)).match(n), i3 = r3.length, o3 = 0; o3 < i3; o3 += 1) {
            var a3 = r3[o3], f3 = d[a3], u3 = f3 && f3[0], h4 = f3 && f3[1];
            r3[o3] = h4 ? {regex: u3, parser: h4} : a3.replace(/^\[|\]$/g, "");
          }
          return function(t4) {
            for (var e2 = {}, n2 = 0, o4 = 0; n2 < i3; n2 += 1) {
              var s2 = r3[n2];
              if (typeof s2 == "string")
                o4 += s2.length;
              else {
                var a4 = s2.regex, f4 = s2.parser, u4 = t4.substr(o4), h5 = a4.exec(u4)[0];
                f4.call(e2, h5), t4 = t4.replace(h5, "");
              }
            }
            return function(t5) {
              var e3 = t5.afternoon;
              if (e3 !== void 0) {
                var n3 = t5.hours;
                e3 ? n3 < 12 && (t5.hours += 12) : n3 === 12 && (t5.hours = 0), delete t5.afternoon;
              }
            }(e2), e2;
          };
        }(r2)(t2), a2 = o2.year, f2 = o2.month, u2 = o2.day, h3 = o2.hours, c2 = o2.minutes, m = o2.seconds, l = o2.milliseconds, M = o2.zone, Y = new Date(), v = u2 || (a2 || f2 ? 1 : Y.getDate()), p2 = a2 || Y.getFullYear(), D = 0;
        a2 && !f2 || (D = f2 > 0 ? f2 - 1 : Y.getMonth());
        var y = h3 || 0, L = c2 || 0, g = m || 0, $ = l || 0;
        return M ? new Date(Date.UTC(p2, D, v, y, L, g, $ + 60 * M.offset * 1e3)) : i2 ? new Date(Date.UTC(p2, D, v, y, L, g, $)) : new Date(p2, D, v, y, L, g, $);
      } catch (t3) {
        return new Date("");
      }
    };
    return function(t2, e2, n2) {
      n2.p.customParseFormat = true;
      var r2 = e2.prototype, i2 = r2.parse;
      r2.parse = function(t3) {
        var e3 = t3.date, r3 = t3.utc, o2 = t3.args;
        this.$u = r3;
        var a2 = o2[1];
        if (typeof a2 == "string") {
          var f2 = o2[2] === true, u2 = o2[3] === true, h3 = f2 || u2, d2 = o2[2];
          u2 && (d2 = o2[2]), s = this.$locale(), !f2 && d2 && (s = n2.Ls[d2]), this.$d = c(e3, a2, r3), this.init(), d2 && d2 !== true && (this.$L = this.locale(d2).$L), h3 && e3 !== this.format(a2) && (this.$d = new Date("")), s = {};
        } else if (a2 instanceof Array)
          for (var m = a2.length, l = 1; l <= m; l += 1) {
            o2[1] = a2[l - 1];
            var M = n2.apply(this, o2);
            if (M.isValid()) {
              this.$d = M.$d, this.$L = M.$L, this.init();
              break;
            }
            l === m && (this.$d = new Date(""));
          }
        else
          i2.call(this, t3);
      };
    };
  });
})(customParseFormat);
var se = customParseFormat.exports;
function arrayPush$3(array3, values) {
  var index2 = -1, length = values.length, offset2 = array3.length;
  while (++index2 < length) {
    array3[offset2 + index2] = values[index2];
  }
  return array3;
}
var _arrayPush = arrayPush$3;
var baseGetTag$3 = _baseGetTag, isObjectLike$6 = isObjectLike_1;
var argsTag$3 = "[object Arguments]";
function baseIsArguments$1(value) {
  return isObjectLike$6(value) && baseGetTag$3(value) == argsTag$3;
}
var _baseIsArguments = baseIsArguments$1;
var baseIsArguments = _baseIsArguments, isObjectLike$5 = isObjectLike_1;
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;
var isArguments$2 = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike$5(value) && hasOwnProperty$a.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
var isArguments_1 = isArguments$2;
var isArray$5 = Array.isArray;
var isArray_1 = isArray$5;
var Symbol$3 = _Symbol, isArguments$1 = isArguments_1, isArray$4 = isArray_1;
var spreadableSymbol = Symbol$3 ? Symbol$3.isConcatSpreadable : void 0;
function isFlattenable$1(value) {
  return isArray$4(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var _isFlattenable = isFlattenable$1;
var arrayPush$2 = _arrayPush, isFlattenable = _isFlattenable;
function baseFlatten$1(array3, depth, predicate, isStrict, result) {
  var index2 = -1, length = array3.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index2 < length) {
    var value = array3[index2];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$2(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var _baseFlatten = baseFlatten$1;
function identity$2(value) {
  return value;
}
var identity_1 = identity$2;
function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply = apply$1;
var apply = _apply;
var nativeMax = Math.max;
function overRest$1(func, start2, transform) {
  start2 = nativeMax(start2 === void 0 ? func.length - 1 : start2, 0);
  return function() {
    var args = arguments, index2 = -1, length = nativeMax(args.length - start2, 0), array3 = Array(length);
    while (++index2 < length) {
      array3[index2] = args[start2 + index2];
    }
    index2 = -1;
    var otherArgs = Array(start2 + 1);
    while (++index2 < start2) {
      otherArgs[index2] = args[index2];
    }
    otherArgs[start2] = transform(array3);
    return apply(func, this, otherArgs);
  };
}
var _overRest = overRest$1;
function constant$1(value) {
  return function() {
    return value;
  };
}
var constant_1 = constant$1;
var baseGetTag$2 = _baseGetTag, isObject$4 = isObject_1;
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$2(value) {
  if (!isObject$4(value)) {
    return false;
  }
  var tag = baseGetTag$2(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$2;
var root$6 = _root;
var coreJsData$1 = root$6["__core-js_shared__"];
var _coreJsData = coreJsData$1;
var coreJsData = _coreJsData;
var maskSrcKey = function() {
  var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid2 ? "Symbol(src)_1." + uid2 : "";
}();
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked$1;
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$1 = isFunction_1, isMasked = _isMasked, isObject$3 = isObject_1, toSource$1 = _toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$b = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$9).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function baseIsNative$1(value) {
  if (!isObject$3(value) || isMasked(value)) {
    return false;
  }
  var pattern2 = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern2.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(object3, key) {
  return object3 == null ? void 0 : object3[key];
}
var _getValue = getValue$1;
var baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$7(object3, key) {
  var value = getValue(object3, key);
  return baseIsNative(value) ? value : void 0;
}
var _getNative = getNative$7;
var getNative$6 = _getNative;
var defineProperty$2 = function() {
  try {
    var func = getNative$6(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var _defineProperty = defineProperty$2;
var constant = constant_1, defineProperty$1 = _defineProperty, identity$1 = identity_1;
var baseSetToString$1 = !defineProperty$1 ? identity$1 : function(func, string2) {
  return defineProperty$1(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string2),
    "writable": true
  });
};
var _baseSetToString = baseSetToString$1;
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut$1(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var _shortOut = shortOut$1;
var baseSetToString = _baseSetToString, shortOut = _shortOut;
var setToString$1 = shortOut(baseSetToString);
var _setToString = setToString$1;
var identity = identity_1, overRest = _overRest, setToString = _setToString;
function baseRest$1(func, start2) {
  return setToString(overRest(func, start2, identity), func + "");
}
var _baseRest = baseRest$1;
var getNative$5 = _getNative;
var nativeCreate$4 = getNative$5(Object, "create");
var _nativeCreate = nativeCreate$4;
var nativeCreate$3 = _nativeCreate;
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}
var _hashClear = hashClear$1;
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete$1;
var nativeCreate$2 = _nativeCreate;
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$8.call(data, key) ? data[key] : void 0;
}
var _hashGet = hashGet$1;
var nativeCreate$1 = _nativeCreate;
var objectProto$9 = Object.prototype;
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$7.call(data, key);
}
var _hashHas = hashHas$1;
var nativeCreate = _nativeCreate;
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
var _hashSet = hashSet$1;
var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
function Hash$1(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash$1.prototype.clear = hashClear;
Hash$1.prototype["delete"] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;
var _Hash = Hash$1;
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear$1;
function eq$3(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$3;
var eq$2 = eq_1;
function assocIndexOf$4(array3, key) {
  var length = array3.length;
  while (length--) {
    if (eq$2(array3[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf$4;
var assocIndexOf$3 = _assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete$1(key) {
  var data = this.__data__, index2 = assocIndexOf$3(data, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index2 == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index2, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete$1;
var assocIndexOf$2 = _assocIndexOf;
function listCacheGet$1(key) {
  var data = this.__data__, index2 = assocIndexOf$2(data, key);
  return index2 < 0 ? void 0 : data[index2][1];
}
var _listCacheGet = listCacheGet$1;
var assocIndexOf$1 = _assocIndexOf;
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas$1;
var assocIndexOf = _assocIndexOf;
function listCacheSet$1(key, value) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  if (index2 < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index2][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet$1;
var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
function ListCache$4(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype["delete"] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;
var _ListCache = ListCache$4;
var getNative$4 = _getNative, root$5 = _root;
var Map$4 = getNative$4(root$5, "Map");
var _Map = Map$4;
var Hash = _Hash, ListCache$3 = _ListCache, Map$3 = _Map;
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$3 || ListCache$3)(),
    "string": new Hash()
  };
}
var _mapCacheClear = mapCacheClear$1;
function isKeyable$1(value) {
  var type2 = typeof value;
  return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable = isKeyable$1;
var isKeyable = _isKeyable;
function getMapData$4(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var _getMapData = getMapData$4;
var getMapData$3 = _getMapData;
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete$1;
var getMapData$2 = _getMapData;
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}
var _mapCacheGet = mapCacheGet$1;
var getMapData$1 = _getMapData;
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}
var _mapCacheHas = mapCacheHas$1;
var getMapData = _getMapData;
function mapCacheSet$1(key, value) {
  var data = getMapData(this, key), size2 = data.size;
  data.set(key, value);
  this.size += data.size == size2 ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet$1;
var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
function MapCache$2(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache$2.prototype.clear = mapCacheClear;
MapCache$2.prototype["delete"] = mapCacheDelete;
MapCache$2.prototype.get = mapCacheGet;
MapCache$2.prototype.has = mapCacheHas;
MapCache$2.prototype.set = mapCacheSet;
var _MapCache = MapCache$2;
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
var _setCacheAdd = setCacheAdd$1;
function setCacheHas$1(value) {
  return this.__data__.has(value);
}
var _setCacheHas = setCacheHas$1;
var MapCache$1 = _MapCache, setCacheAdd = _setCacheAdd, setCacheHas = _setCacheHas;
function SetCache$2(values) {
  var index2 = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache$1();
  while (++index2 < length) {
    this.add(values[index2]);
  }
}
SetCache$2.prototype.add = SetCache$2.prototype.push = setCacheAdd;
SetCache$2.prototype.has = setCacheHas;
var _SetCache = SetCache$2;
function baseFindIndex$1(array3, predicate, fromIndex, fromRight) {
  var length = array3.length, index2 = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index2-- : ++index2 < length) {
    if (predicate(array3[index2], index2, array3)) {
      return index2;
    }
  }
  return -1;
}
var _baseFindIndex = baseFindIndex$1;
function baseIsNaN$1(value) {
  return value !== value;
}
var _baseIsNaN = baseIsNaN$1;
function strictIndexOf$1(array3, value, fromIndex) {
  var index2 = fromIndex - 1, length = array3.length;
  while (++index2 < length) {
    if (array3[index2] === value) {
      return index2;
    }
  }
  return -1;
}
var _strictIndexOf = strictIndexOf$1;
var baseFindIndex = _baseFindIndex, baseIsNaN = _baseIsNaN, strictIndexOf = _strictIndexOf;
function baseIndexOf$1(array3, value, fromIndex) {
  return value === value ? strictIndexOf(array3, value, fromIndex) : baseFindIndex(array3, baseIsNaN, fromIndex);
}
var _baseIndexOf = baseIndexOf$1;
var baseIndexOf = _baseIndexOf;
function arrayIncludes$1(array3, value) {
  var length = array3 == null ? 0 : array3.length;
  return !!length && baseIndexOf(array3, value, 0) > -1;
}
var _arrayIncludes = arrayIncludes$1;
function arrayIncludesWith$1(array3, value, comparator) {
  var index2 = -1, length = array3 == null ? 0 : array3.length;
  while (++index2 < length) {
    if (comparator(value, array3[index2])) {
      return true;
    }
  }
  return false;
}
var _arrayIncludesWith = arrayIncludesWith$1;
function cacheHas$2(cache, key) {
  return cache.has(key);
}
var _cacheHas = cacheHas$2;
var getNative$3 = _getNative, root$4 = _root;
var Set$3 = getNative$3(root$4, "Set");
var _Set = Set$3;
function noop$1() {
}
var noop_1 = noop$1;
function setToArray$3(set2) {
  var index2 = -1, result = Array(set2.size);
  set2.forEach(function(value) {
    result[++index2] = value;
  });
  return result;
}
var _setToArray = setToArray$3;
var Set$2 = _Set, noop = noop_1, setToArray$2 = _setToArray;
var INFINITY = 1 / 0;
var createSet$1 = !(Set$2 && 1 / setToArray$2(new Set$2([, -0]))[1] == INFINITY) ? noop : function(values) {
  return new Set$2(values);
};
var _createSet = createSet$1;
var SetCache$1 = _SetCache, arrayIncludes = _arrayIncludes, arrayIncludesWith = _arrayIncludesWith, cacheHas$1 = _cacheHas, createSet = _createSet, setToArray$1 = _setToArray;
var LARGE_ARRAY_SIZE$1 = 200;
function baseUniq$1(array3, iteratee, comparator) {
  var index2 = -1, includes = arrayIncludes, length = array3.length, isCommon = true, result = [], seen = result;
  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE$1) {
    var set2 = iteratee ? null : createSet(array3);
    if (set2) {
      return setToArray$1(set2);
    }
    isCommon = false;
    includes = cacheHas$1;
    seen = new SetCache$1();
  } else {
    seen = iteratee ? [] : result;
  }
  outer:
    while (++index2 < length) {
      var value = array3[index2], computed2 = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed2 === computed2) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed2) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed2);
        }
        result.push(value);
      } else if (!includes(seen, computed2, comparator)) {
        if (seen !== result) {
          seen.push(computed2);
        }
        result.push(value);
      }
    }
  return result;
}
var _baseUniq = baseUniq$1;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength$2(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}
var isLength_1 = isLength$2;
var isFunction = isFunction_1, isLength$1 = isLength_1;
function isArrayLike$3(value) {
  return value != null && isLength$1(value.length) && !isFunction(value);
}
var isArrayLike_1 = isArrayLike$3;
var isArrayLike$2 = isArrayLike_1, isObjectLike$4 = isObjectLike_1;
function isArrayLikeObject$1(value) {
  return isObjectLike$4(value) && isArrayLike$2(value);
}
var isArrayLikeObject_1 = isArrayLikeObject$1;
var baseFlatten = _baseFlatten, baseRest = _baseRest, baseUniq = _baseUniq, isArrayLikeObject = isArrayLikeObject_1;
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
var union_1 = union;
var ListCache$2 = _ListCache;
function stackClear$1() {
  this.__data__ = new ListCache$2();
  this.size = 0;
}
var _stackClear = stackClear$1;
function stackDelete$1(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var _stackDelete = stackDelete$1;
function stackGet$1(key) {
  return this.__data__.get(key);
}
var _stackGet = stackGet$1;
function stackHas$1(key) {
  return this.__data__.has(key);
}
var _stackHas = stackHas$1;
var ListCache$1 = _ListCache, Map$2 = _Map, MapCache = _MapCache;
var LARGE_ARRAY_SIZE = 200;
function stackSet$1(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache$1) {
    var pairs = data.__data__;
    if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var _stackSet = stackSet$1;
var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
function Stack$2(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack$2.prototype.clear = stackClear;
Stack$2.prototype["delete"] = stackDelete;
Stack$2.prototype.get = stackGet;
Stack$2.prototype.has = stackHas;
Stack$2.prototype.set = stackSet;
var _Stack = Stack$2;
function arraySome$1(array3, predicate) {
  var index2 = -1, length = array3 == null ? 0 : array3.length;
  while (++index2 < length) {
    if (predicate(array3[index2], index2, array3)) {
      return true;
    }
  }
  return false;
}
var _arraySome = arraySome$1;
var SetCache = _SetCache, arraySome = _arraySome, cacheHas = _cacheHas;
var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function equalArrays$2(array3, other, bitmask, customizer, equalFunc, stack2) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array3.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack2.get(array3);
  var othStacked = stack2.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array3;
  }
  var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
  stack2.set(array3, other);
  stack2.set(other, array3);
  while (++index2 < arrLength) {
    var arrValue = array3[index2], othValue = other[index2];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index2, other, array3, stack2) : customizer(arrValue, othValue, index2, array3, other, stack2);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack2))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack2))) {
      result = false;
      break;
    }
  }
  stack2["delete"](array3);
  stack2["delete"](other);
  return result;
}
var _equalArrays = equalArrays$2;
var root$3 = _root;
var Uint8Array$2 = root$3.Uint8Array;
var _Uint8Array = Uint8Array$2;
function mapToArray$1(map) {
  var index2 = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index2] = [key, value];
  });
  return result;
}
var _mapToArray = mapToArray$1;
var Symbol$2 = _Symbol, Uint8Array$1 = _Uint8Array, eq$1 = eq_1, equalArrays$1 = _equalArrays, mapToArray = _mapToArray, setToArray = _setToArray;
var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
var boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]";
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function equalByTag$1(object3, other, tag, bitmask, customizer, equalFunc, stack2) {
  switch (tag) {
    case dataViewTag$4:
      if (object3.byteLength != other.byteLength || object3.byteOffset != other.byteOffset) {
        return false;
      }
      object3 = object3.buffer;
      other = other.buffer;
    case arrayBufferTag$3:
      if (object3.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object3), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      return eq$1(+object3, +other);
    case errorTag$2:
      return object3.name == other.name && object3.message == other.message;
    case regexpTag$3:
    case stringTag$3:
      return object3 == other + "";
    case mapTag$5:
      var convert2 = mapToArray;
    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
      convert2 || (convert2 = setToArray);
      if (object3.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack2.get(object3);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;
      stack2.set(object3, other);
      var result = equalArrays$1(convert2(object3), convert2(other), bitmask, customizer, equalFunc, stack2);
      stack2["delete"](object3);
      return result;
    case symbolTag$2:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object3) == symbolValueOf$1.call(other);
      }
  }
  return false;
}
var _equalByTag = equalByTag$1;
var arrayPush$1 = _arrayPush, isArray$3 = isArray_1;
function baseGetAllKeys$2(object3, keysFunc, symbolsFunc) {
  var result = keysFunc(object3);
  return isArray$3(object3) ? result : arrayPush$1(result, symbolsFunc(object3));
}
var _baseGetAllKeys = baseGetAllKeys$2;
function arrayFilter$1(array3, predicate) {
  var index2 = -1, length = array3 == null ? 0 : array3.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array3[index2];
    if (predicate(value, index2, array3)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var _arrayFilter = arrayFilter$1;
function stubArray$2() {
  return [];
}
var stubArray_1 = stubArray$2;
var arrayFilter = _arrayFilter, stubArray$1 = stubArray_1;
var objectProto$8 = Object.prototype;
var propertyIsEnumerable = objectProto$8.propertyIsEnumerable;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object3) {
  if (object3 == null) {
    return [];
  }
  object3 = Object(object3);
  return arrayFilter(nativeGetSymbols$1(object3), function(symbol) {
    return propertyIsEnumerable.call(object3, symbol);
  });
};
var _getSymbols = getSymbols$3;
function baseTimes$1(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var _baseTimes = baseTimes$1;
var isBuffer$3 = {exports: {}};
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
(function(module, exports) {
  var root2 = _root, stubFalse2 = stubFalse_1;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root2.Buffer : void 0;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse2;
  module.exports = isBuffer2;
})(isBuffer$3, isBuffer$3.exports);
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex$1(value, length) {
  var type2 = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type2 == "number" || type2 != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var _isIndex = isIndex$1;
var baseGetTag$1 = _baseGetTag, isLength = isLength_1, isObjectLike$3 = isObjectLike_1;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag$1 = "[object Function]", mapTag$4 = "[object Map]", numberTag$2 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$2 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$3 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] = typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$2] = typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray$1(value) {
  return isObjectLike$3(value) && isLength(value.length) && !!typedArrayTags[baseGetTag$1(value)];
}
var _baseIsTypedArray = baseIsTypedArray$1;
function baseUnary$3(func) {
  return function(value) {
    return func(value);
  };
}
var _baseUnary = baseUnary$3;
var _nodeUtil = {exports: {}};
(function(module, exports) {
  var freeGlobal2 = _freeGlobal;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      var types2 = freeModule && freeModule.require && freeModule.require("util").types;
      if (types2) {
        return types2;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  module.exports = nodeUtil2;
})(_nodeUtil, _nodeUtil.exports);
var baseIsTypedArray = _baseIsTypedArray, baseUnary$2 = _baseUnary, nodeUtil$2 = _nodeUtil.exports;
var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;
var isTypedArray$2 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray_1 = isTypedArray$2;
var baseTimes = _baseTimes, isArguments = isArguments_1, isArray$2 = isArray_1, isBuffer$2 = isBuffer$3.exports, isIndex = _isIndex, isTypedArray$1 = isTypedArray_1;
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var _arrayLikeKeys = arrayLikeKeys$2;
var objectProto$6 = Object.prototype;
function isPrototype$3(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$6;
  return value === proto;
}
var _isPrototype = isPrototype$3;
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg$2;
var overArg$1 = _overArg;
var nativeKeys$1 = overArg$1(Object.keys, Object);
var _nativeKeys = nativeKeys$1;
var isPrototype$2 = _isPrototype, nativeKeys = _nativeKeys;
var objectProto$5 = Object.prototype;
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
function baseKeys$1(object3) {
  if (!isPrototype$2(object3)) {
    return nativeKeys(object3);
  }
  var result = [];
  for (var key in Object(object3)) {
    if (hasOwnProperty$5.call(object3, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys$1;
var arrayLikeKeys$1 = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike$1 = isArrayLike_1;
function keys$3(object3) {
  return isArrayLike$1(object3) ? arrayLikeKeys$1(object3) : baseKeys(object3);
}
var keys_1 = keys$3;
var baseGetAllKeys$1 = _baseGetAllKeys, getSymbols$2 = _getSymbols, keys$2 = keys_1;
function getAllKeys$2(object3) {
  return baseGetAllKeys$1(object3, keys$2, getSymbols$2);
}
var _getAllKeys = getAllKeys$2;
var getAllKeys$1 = _getAllKeys;
var COMPARE_PARTIAL_FLAG$1 = 1;
var objectProto$4 = Object.prototype;
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
function equalObjects$1(object3, other, bitmask, customizer, equalFunc, stack2) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys$1(object3), objLength = objProps.length, othProps = getAllKeys$1(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index2 = objLength;
  while (index2--) {
    var key = objProps[index2];
    if (!(isPartial ? key in other : hasOwnProperty$4.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack2.get(object3);
  var othStacked = stack2.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object3;
  }
  var result = true;
  stack2.set(object3, other);
  stack2.set(other, object3);
  var skipCtor = isPartial;
  while (++index2 < objLength) {
    key = objProps[index2];
    var objValue = object3[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object3, stack2) : customizer(objValue, othValue, key, object3, other, stack2);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack2) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object3.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object3 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack2["delete"](object3);
  stack2["delete"](other);
  return result;
}
var _equalObjects = equalObjects$1;
var getNative$2 = _getNative, root$2 = _root;
var DataView$1 = getNative$2(root$2, "DataView");
var _DataView = DataView$1;
var getNative$1 = _getNative, root$1 = _root;
var Promise$2 = getNative$1(root$1, "Promise");
var _Promise = Promise$2;
var getNative = _getNative, root = _root;
var WeakMap$2 = getNative(root, "WeakMap");
var _WeakMap = WeakMap$2;
var DataView = _DataView, Map$1 = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap$1 = _WeakMap, baseGetTag = _baseGetTag, toSource = _toSource;
var mapTag$3 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$3 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$2 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
var getTag$4 = baseGetTag;
if (DataView && getTag$4(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map$1 && getTag$4(new Map$1()) != mapTag$3 || Promise$1 && getTag$4(Promise$1.resolve()) != promiseTag || Set$1 && getTag$4(new Set$1()) != setTag$3 || WeakMap$1 && getTag$4(new WeakMap$1()) != weakMapTag$1) {
  getTag$4 = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;
        case mapCtorString:
          return mapTag$3;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$3;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var _getTag = getTag$4;
var Stack$1 = _Stack, equalArrays = _equalArrays, equalByTag = _equalByTag, equalObjects = _equalObjects, getTag$3 = _getTag, isArray$1 = isArray_1, isBuffer$1 = isBuffer$3.exports, isTypedArray = isTypedArray_1;
var COMPARE_PARTIAL_FLAG = 1;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", objectTag$1 = "[object Object]";
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
function baseIsEqualDeep$1(object3, other, bitmask, customizer, equalFunc, stack2) {
  var objIsArr = isArray$1(object3), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag$1 : getTag$3(object3), othTag = othIsArr ? arrayTag$1 : getTag$3(other);
  objTag = objTag == argsTag$1 ? objectTag$1 : objTag;
  othTag = othTag == argsTag$1 ? objectTag$1 : othTag;
  var objIsObj = objTag == objectTag$1, othIsObj = othTag == objectTag$1, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer$1(object3)) {
    if (!isBuffer$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack2 || (stack2 = new Stack$1());
    return objIsArr || isTypedArray(object3) ? equalArrays(object3, other, bitmask, customizer, equalFunc, stack2) : equalByTag(object3, other, objTag, bitmask, customizer, equalFunc, stack2);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty$3.call(object3, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$3.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object3.value() : object3, othUnwrapped = othIsWrapped ? other.value() : other;
      stack2 || (stack2 = new Stack$1());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack2);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack2 || (stack2 = new Stack$1());
  return equalObjects(object3, other, bitmask, customizer, equalFunc, stack2);
}
var _baseIsEqualDeep = baseIsEqualDeep$1;
var baseIsEqualDeep = _baseIsEqualDeep, isObjectLike$2 = isObjectLike_1;
function baseIsEqual$1(value, other, bitmask, customizer, stack2) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike$2(value) && !isObjectLike$2(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$1, stack2);
}
var _baseIsEqual = baseIsEqual$1;
var baseIsEqual = _baseIsEqual;
function isEqual(value, other) {
  return baseIsEqual(value, other);
}
var isEqual_1 = isEqual;
var advancedFormat = {exports: {}};
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t, r) {
      var n = t.prototype, a = n.format;
      r.en.ordinal = function(e2) {
        var t2 = ["th", "st", "nd", "rd"], r2 = e2 % 100;
        return "[" + e2 + (t2[(r2 - 20) % 10] || t2[r2] || t2[0]) + "]";
      }, n.format = function(e2) {
        var t2 = this, r2 = this.$locale(), n2 = this.$utils(), s = (e2 || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(e3) {
          switch (e3) {
            case "Q":
              return Math.ceil((t2.$M + 1) / 3);
            case "Do":
              return r2.ordinal(t2.$D);
            case "gggg":
              return t2.weekYear();
            case "GGGG":
              return t2.isoWeekYear();
            case "wo":
              return r2.ordinal(t2.week(), "W");
            case "w":
            case "ww":
              return n2.s(t2.week(), e3 === "w" ? 1 : 2, "0");
            case "W":
            case "WW":
              return n2.s(t2.isoWeek(), e3 === "W" ? 1 : 2, "0");
            case "k":
            case "kk":
              return n2.s(String(t2.$H === 0 ? 24 : t2.$H), e3 === "k" ? 1 : 2, "0");
            case "X":
              return Math.floor(t2.$d.getTime() / 1e3);
            case "x":
              return t2.$d.getTime();
            case "z":
              return "[" + t2.offsetName() + "]";
            case "zzz":
              return "[" + t2.offsetName("long") + "]";
            default:
              return e3;
          }
        });
        return a.bind(this)(s);
      };
    };
  });
})(advancedFormat);
var ce = advancedFormat.exports;
var weekOfYear = {exports: {}};
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    var e = "week", t = "year";
    return function(i, n, r) {
      var f = n.prototype;
      f.week = function(i2) {
        if (i2 === void 0 && (i2 = null), i2 !== null)
          return this.add(7 * (i2 - this.week()), "day");
        var n2 = this.$locale().yearStart || 1;
        if (this.month() === 11 && this.date() > 25) {
          var f2 = r(this).startOf(t).add(1, t).date(n2), s = r(this).endOf(e);
          if (f2.isBefore(s))
            return 1;
        }
        var a = r(this).startOf(t).date(n2).startOf(e).subtract(1, "millisecond"), d = this.diff(a, e, true);
        return d < 0 ? r(this).startOf("week").week() : Math.ceil(d);
      }, f.weeks = function(e2) {
        return e2 === void 0 && (e2 = null), this.week(e2);
      };
    };
  });
})(weekOfYear);
var pe = weekOfYear.exports;
var weekYear = {exports: {}};
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      t.prototype.weekYear = function() {
        var e2 = this.month(), t2 = this.week(), n = this.year();
        return t2 === 1 && e2 === 11 ? n + 1 : e2 === 0 && t2 >= 52 ? n - 1 : n;
      };
    };
  });
})(weekYear);
var he = weekYear.exports;
var dayOfYear = {exports: {}};
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    return function(t, e) {
      e.prototype.dayOfYear = function(t2) {
        var e2 = Math.round((this.startOf("day") - this.startOf("year")) / 864e5) + 1;
        return t2 == null ? e2 : this.add(t2 - e2, "day");
      };
    };
  });
})(dayOfYear);
var ve = dayOfYear.exports;
var isSameOrAfter = {exports: {}};
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      t.prototype.isSameOrAfter = function(e2, t2) {
        return this.isSame(e2, t2) || this.isAfter(e2, t2);
      };
    };
  });
})(isSameOrAfter);
var me = isSameOrAfter.exports;
var isSameOrBefore = {exports: {}};
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      t.prototype.isSameOrBefore = function(e2, t2) {
        return this.isSame(e2, t2) || this.isBefore(e2, t2);
      };
    };
  });
})(isSameOrBefore);
var fe = isSameOrBefore.exports;
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p2) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf(o, p2);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn3) {
  return Function.toString.call(fn3).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
var formatRegExp = /%[sdj%]/g;
var warning = function warning2() {
};
if (typeof process !== "undefined" && process.env && false) {
  warning = function warning3(type2, errors) {
    if (typeof console !== "undefined" && console.warn) {
      if (errors.every(function(e) {
        return typeof e === "string";
      })) {
        console.warn(type2, errors);
      }
    }
  };
}
function convertFieldsError(errors) {
  if (!errors || !errors.length)
    return null;
  var fields = {};
  errors.forEach(function(error) {
    var field = error.field;
    fields[field] = fields[field] || [];
    fields[field].push(error);
  });
  return fields;
}
function format() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var i = 1;
  var f = args[0];
  var len = args.length;
  if (typeof f === "function") {
    return f.apply(null, args.slice(1));
  }
  if (typeof f === "string") {
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === "%%") {
        return "%";
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return "[Circular]";
          }
          break;
        default:
          return x;
      }
    });
    return str;
  }
  return f;
}
function isNativeStringType(type2) {
  return type2 === "string" || type2 === "url" || type2 === "hex" || type2 === "email" || type2 === "date" || type2 === "pattern";
}
function isEmptyValue(value, type2) {
  if (value === void 0 || value === null) {
    return true;
  }
  if (type2 === "array" && Array.isArray(value) && !value.length) {
    return true;
  }
  if (isNativeStringType(type2) && typeof value === "string" && !value) {
    return true;
  }
  return false;
}
function asyncParallelArray(arr, func, callback) {
  var results = [];
  var total = 0;
  var arrLength = arr.length;
  function count(errors) {
    results.push.apply(results, errors);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }
  arr.forEach(function(a) {
    func(a, count);
  });
}
function asyncSerialArray(arr, func, callback) {
  var index2 = 0;
  var arrLength = arr.length;
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    var original = index2;
    index2 = index2 + 1;
    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }
  next([]);
}
function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function(k) {
    ret.push.apply(ret, objArr[k]);
  });
  return ret;
}
var AsyncValidationError = /* @__PURE__ */ function(_Error) {
  _inheritsLoose(AsyncValidationError2, _Error);
  function AsyncValidationError2(errors, fields) {
    var _this;
    _this = _Error.call(this, "Async Validation Error") || this;
    _this.errors = errors;
    _this.fields = fields;
    return _this;
  }
  return AsyncValidationError2;
}(/* @__PURE__ */ _wrapNativeSuper(Error));
function asyncMap(objArr, option, func, callback) {
  if (option.first) {
    var _pending = new Promise(function(resolve2, reject) {
      var next = function next2(errors) {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve2();
      };
      var flattenArr = flattenObjArr(objArr);
      asyncSerialArray(flattenArr, func, next);
    });
    _pending["catch"](function(e) {
      return e;
    });
    return _pending;
  }
  var firstFields = option.firstFields || [];
  if (firstFields === true) {
    firstFields = Object.keys(objArr);
  }
  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];
  var pending = new Promise(function(resolve2, reject) {
    var next = function next2(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve2();
      }
    };
    if (!objArrKeys.length) {
      callback(results);
      resolve2();
    }
    objArrKeys.forEach(function(key) {
      var arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  });
  pending["catch"](function(e) {
    return e;
  });
  return pending;
}
function complementError(rule) {
  return function(oe) {
    if (oe && oe.message) {
      oe.field = oe.field || rule.fullField;
      return oe;
    }
    return {
      message: typeof oe === "function" ? oe() : oe,
      field: oe.field || rule.fullField
    };
  };
}
function deepMerge(target, source) {
  if (source) {
    for (var s in source) {
      if (source.hasOwnProperty(s)) {
        var value = source[s];
        if (typeof value === "object" && typeof target[s] === "object") {
          target[s] = _extends({}, target[s], value);
        } else {
          target[s] = value;
        }
      }
    }
  }
  return target;
}
function required(rule, value, source, errors, options, type2) {
  if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type2 || rule.type))) {
    errors.push(format(options.messages.required, rule.fullField));
  }
}
function whitespace(rule, value, source, errors, options) {
  if (/^\s+$/.test(value) || value === "") {
    errors.push(format(options.messages.whitespace, rule.fullField));
  }
}
var pattern = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", "i"),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var types = {
  integer: function integer(value) {
    return types.number(value) && parseInt(value, 10) === value;
  },
  "float": function float(value) {
    return types.number(value) && !types.integer(value);
  },
  array: function array(value) {
    return Array.isArray(value);
  },
  regexp: function regexp(value) {
    if (value instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(value);
    } catch (e) {
      return false;
    }
  },
  date: function date(value) {
    return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
  },
  number: function number(value) {
    if (isNaN(value)) {
      return false;
    }
    return typeof value === "number";
  },
  object: function object(value) {
    return typeof value === "object" && !types.array(value);
  },
  method: function method(value) {
    return typeof value === "function";
  },
  email: function email(value) {
    return typeof value === "string" && !!value.match(pattern.email) && value.length < 255;
  },
  url: function url(value) {
    return typeof value === "string" && !!value.match(pattern.url);
  },
  hex: function hex(value) {
    return typeof value === "string" && !!value.match(pattern.hex);
  }
};
function type(rule, value, source, errors, options) {
  if (rule.required && value === void 0) {
    required(rule, value, source, errors, options);
    return;
  }
  var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
  var ruleType = rule.type;
  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value)) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
  } else if (ruleType && typeof value !== rule.type) {
    errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
  }
}
function range(rule, value, source, errors, options) {
  var len = typeof rule.len === "number";
  var min2 = typeof rule.min === "number";
  var max2 = typeof rule.max === "number";
  var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var val = value;
  var key = null;
  var num = typeof value === "number";
  var str = typeof value === "string";
  var arr = Array.isArray(value);
  if (num) {
    key = "number";
  } else if (str) {
    key = "string";
  } else if (arr) {
    key = "array";
  }
  if (!key) {
    return false;
  }
  if (arr) {
    val = value.length;
  }
  if (str) {
    val = value.replace(spRegexp, "_").length;
  }
  if (len) {
    if (val !== rule.len) {
      errors.push(format(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min2 && !max2 && val < rule.min) {
    errors.push(format(options.messages[key].min, rule.fullField, rule.min));
  } else if (max2 && !min2 && val > rule.max) {
    errors.push(format(options.messages[key].max, rule.fullField, rule.max));
  } else if (min2 && max2 && (val < rule.min || val > rule.max)) {
    errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
  }
}
var ENUM = "enum";
function enumerable(rule, value, source, errors, options) {
  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
  if (rule[ENUM].indexOf(value) === -1) {
    errors.push(format(options.messages[ENUM], rule.fullField, rule[ENUM].join(", ")));
  }
}
function pattern$1(rule, value, source, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    } else if (typeof rule.pattern === "string") {
      var _pattern = new RegExp(rule.pattern);
      if (!_pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    }
  }
}
var rules = {
  required,
  whitespace,
  type,
  range,
  "enum": enumerable,
  pattern: pattern$1
};
function string(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, "string");
    if (!isEmptyValue(value, "string")) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
      rules.pattern(rule, value, source, errors, options);
      if (rule.whitespace === true) {
        rules.whitespace(rule, value, source, errors, options);
      }
    }
  }
  callback(errors);
}
function method2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function number2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (value === "") {
      value = void 0;
    }
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function _boolean(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function regexp2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value)) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function integer2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function floatFn(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function array2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if ((value === void 0 || value === null) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, "array");
    if (value !== void 0 && value !== null) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function object2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
var ENUM$1 = "enum";
function enumerable$1(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (value !== void 0) {
      rules[ENUM$1](rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function pattern$2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value, "string")) {
      rules.pattern(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function date2(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value, "date") && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
    if (!isEmptyValue(value, "date")) {
      var dateObject;
      if (value instanceof Date) {
        dateObject = value;
      } else {
        dateObject = new Date(value);
      }
      rules.type(rule, dateObject, source, errors, options);
      if (dateObject) {
        rules.range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
}
function required$1(rule, value, callback, source, options) {
  var errors = [];
  var type2 = Array.isArray(value) ? "array" : typeof value;
  rules.required(rule, value, source, errors, options, type2);
  callback(errors);
}
function type$1(rule, value, callback, source, options) {
  var ruleType = rule.type;
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value, ruleType) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options, ruleType);
    if (!isEmptyValue(value, ruleType)) {
      rules.type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}
function any(rule, value, callback, source, options) {
  var errors = [];
  var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate2) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }
    rules.required(rule, value, source, errors, options);
  }
  callback(errors);
}
var validators = {
  string,
  method: method2,
  number: number2,
  "boolean": _boolean,
  regexp: regexp2,
  integer: integer2,
  "float": floatFn,
  array: array2,
  object: object2,
  "enum": enumerable$1,
  pattern: pattern$2,
  date: date2,
  url: type$1,
  hex: type$1,
  email: type$1,
  required: required$1,
  any
};
function newMessages() {
  return {
    "default": "Validation error on field %s",
    required: "%s is required",
    "enum": "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      "boolean": "%s is not a %s",
      integer: "%s is not an %s",
      "float": "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone: function clone() {
      var cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}
var messages = newMessages();
function Schema(descriptor) {
  this.rules = null;
  this._messages = messages;
  this.define(descriptor);
}
Schema.prototype = {
  messages: function messages2(_messages) {
    if (_messages) {
      this._messages = deepMerge(newMessages(), _messages);
    }
    return this._messages;
  },
  define: function define(rules2) {
    if (!rules2) {
      throw new Error("Cannot configure a schema with no rules");
    }
    if (typeof rules2 !== "object" || Array.isArray(rules2)) {
      throw new Error("Rules must be an object");
    }
    this.rules = {};
    var z;
    var item;
    for (z in rules2) {
      if (rules2.hasOwnProperty(z)) {
        item = rules2[z];
        this.rules[z] = Array.isArray(item) ? item : [item];
      }
    }
  },
  validate: function validate(source_, o, oc2) {
    var _this = this;
    if (o === void 0) {
      o = {};
    }
    if (oc2 === void 0) {
      oc2 = function oc3() {
      };
    }
    var source = source_;
    var options = o;
    var callback = oc2;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback();
      }
      return Promise.resolve();
    }
    function complete(results) {
      var i;
      var errors = [];
      var fields = {};
      function add2(e) {
        if (Array.isArray(e)) {
          var _errors;
          errors = (_errors = errors).concat.apply(_errors, e);
        } else {
          errors.push(e);
        }
      }
      for (i = 0; i < results.length; i++) {
        add2(results[i]);
      }
      if (!errors.length) {
        errors = null;
        fields = null;
      } else {
        fields = convertFieldsError(errors);
      }
      callback(errors, fields);
    }
    if (options.messages) {
      var messages$1 = this.messages();
      if (messages$1 === messages) {
        messages$1 = newMessages();
      }
      deepMerge(messages$1, options.messages);
      options.messages = messages$1;
    } else {
      options.messages = this.messages();
    }
    var arr;
    var value;
    var series = {};
    var keys2 = options.keys || Object.keys(this.rules);
    keys2.forEach(function(z) {
      arr = _this.rules[z];
      value = source[z];
      arr.forEach(function(r) {
        var rule = r;
        if (typeof rule.transform === "function") {
          if (source === source_) {
            source = _extends({}, source);
          }
          value = source[z] = rule.transform(value);
        }
        if (typeof rule === "function") {
          rule = {
            validator: rule
          };
        } else {
          rule = _extends({}, rule);
        }
        rule.validator = _this.getValidationMethod(rule);
        rule.field = z;
        rule.fullField = rule.fullField || z;
        rule.type = _this.getType(rule);
        if (!rule.validator) {
          return;
        }
        series[z] = series[z] || [];
        series[z].push({
          rule,
          value,
          source,
          field: z
        });
      });
    });
    var errorFields = {};
    return asyncMap(series, options, function(data, doIt) {
      var rule = data.rule;
      var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
      deep = deep && (rule.required || !rule.required && data.value);
      rule.field = data.field;
      function addFullfield(key, schema) {
        return _extends({}, schema, {
          fullField: rule.fullField + "." + key
        });
      }
      function cb(e) {
        if (e === void 0) {
          e = [];
        }
        var errors = e;
        if (!Array.isArray(errors)) {
          errors = [errors];
        }
        if (!options.suppressWarning && errors.length) {
          Schema.warning("async-validator:", errors);
        }
        if (errors.length && rule.message !== void 0) {
          errors = [].concat(rule.message);
        }
        errors = errors.map(complementError(rule));
        if (options.first && errors.length) {
          errorFields[rule.field] = 1;
          return doIt(errors);
        }
        if (!deep) {
          doIt(errors);
        } else {
          if (rule.required && !data.value) {
            if (rule.message !== void 0) {
              errors = [].concat(rule.message).map(complementError(rule));
            } else if (options.error) {
              errors = [options.error(rule, format(options.messages.required, rule.field))];
            }
            return doIt(errors);
          }
          var fieldsSchema = {};
          if (rule.defaultField) {
            for (var k in data.value) {
              if (data.value.hasOwnProperty(k)) {
                fieldsSchema[k] = rule.defaultField;
              }
            }
          }
          fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
          for (var f in fieldsSchema) {
            if (fieldsSchema.hasOwnProperty(f)) {
              var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
              fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
            }
          }
          var schema = new Schema(fieldsSchema);
          schema.messages(options.messages);
          if (data.rule.options) {
            data.rule.options.messages = options.messages;
            data.rule.options.error = options.error;
          }
          schema.validate(data.value, data.rule.options || options, function(errs) {
            var finalErrors = [];
            if (errors && errors.length) {
              finalErrors.push.apply(finalErrors, errors);
            }
            if (errs && errs.length) {
              finalErrors.push.apply(finalErrors, errs);
            }
            doIt(finalErrors.length ? finalErrors : null);
          });
        }
      }
      var res;
      if (rule.asyncValidator) {
        res = rule.asyncValidator(rule, data.value, cb, data.source, options);
      } else if (rule.validator) {
        res = rule.validator(rule, data.value, cb, data.source, options);
        if (res === true) {
          cb();
        } else if (res === false) {
          cb(rule.message || rule.field + " fails");
        } else if (res instanceof Array) {
          cb(res);
        } else if (res instanceof Error) {
          cb(res.message);
        }
      }
      if (res && res.then) {
        res.then(function() {
          return cb();
        }, function(e) {
          return cb(e);
        });
      }
    }, function(results) {
      complete(results);
    });
  },
  getType: function getType2(rule) {
    if (rule.type === void 0 && rule.pattern instanceof RegExp) {
      rule.type = "pattern";
    }
    if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
      throw new Error(format("Unknown rule type %s", rule.type));
    }
    return rule.type || "string";
  },
  getValidationMethod: function getValidationMethod(rule) {
    if (typeof rule.validator === "function") {
      return rule.validator;
    }
    var keys2 = Object.keys(rule);
    var messageIndex = keys2.indexOf("message");
    if (messageIndex !== -1) {
      keys2.splice(messageIndex, 1);
    }
    if (keys2.length === 1 && keys2[0] === "required") {
      return validators.required;
    }
    return validators[this.getType(rule)] || false;
  }
};
Schema.register = function register(type2, validator) {
  if (typeof validator !== "function") {
    throw new Error("Cannot register a validator by type, validator is not a function");
  }
  validators[type2] = validator;
};
Schema.warning = warning;
Schema.messages = messages;
Schema.validators = validators;
function arrayEach$1(array3, iteratee) {
  var index2 = -1, length = array3 == null ? 0 : array3.length;
  while (++index2 < length) {
    if (iteratee(array3[index2], index2, array3) === false) {
      break;
    }
  }
  return array3;
}
var _arrayEach = arrayEach$1;
var defineProperty = _defineProperty;
function baseAssignValue$2(object3, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object3, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object3[key] = value;
  }
}
var _baseAssignValue = baseAssignValue$2;
var baseAssignValue$1 = _baseAssignValue, eq = eq_1;
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function assignValue$2(object3, key, value) {
  var objValue = object3[key];
  if (!(hasOwnProperty$2.call(object3, key) && eq(objValue, value)) || value === void 0 && !(key in object3)) {
    baseAssignValue$1(object3, key, value);
  }
}
var _assignValue = assignValue$2;
var assignValue$1 = _assignValue, baseAssignValue = _baseAssignValue;
function copyObject$4(source, props, object3, customizer) {
  var isNew = !object3;
  object3 || (object3 = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = customizer ? customizer(object3[key], source[key], key, object3, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object3, key, newValue);
    } else {
      assignValue$1(object3, key, newValue);
    }
  }
  return object3;
}
var _copyObject = copyObject$4;
var copyObject$3 = _copyObject, keys$1 = keys_1;
function baseAssign$1(object3, source) {
  return object3 && copyObject$3(source, keys$1(source), object3);
}
var _baseAssign = baseAssign$1;
function nativeKeysIn$1(object3) {
  var result = [];
  if (object3 != null) {
    for (var key in Object(object3)) {
      result.push(key);
    }
  }
  return result;
}
var _nativeKeysIn = nativeKeysIn$1;
var isObject$2 = isObject_1, isPrototype$1 = _isPrototype, nativeKeysIn = _nativeKeysIn;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function baseKeysIn$1(object3) {
  if (!isObject$2(object3)) {
    return nativeKeysIn(object3);
  }
  var isProto = isPrototype$1(object3), result = [];
  for (var key in object3) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$1.call(object3, key)))) {
      result.push(key);
    }
  }
  return result;
}
var _baseKeysIn = baseKeysIn$1;
var arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike = isArrayLike_1;
function keysIn$3(object3) {
  return isArrayLike(object3) ? arrayLikeKeys(object3, true) : baseKeysIn(object3);
}
var keysIn_1 = keysIn$3;
var copyObject$2 = _copyObject, keysIn$2 = keysIn_1;
function baseAssignIn$1(object3, source) {
  return object3 && copyObject$2(source, keysIn$2(source), object3);
}
var _baseAssignIn = baseAssignIn$1;
var _cloneBuffer = {exports: {}};
(function(module, exports) {
  var root2 = _root;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer2(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  module.exports = cloneBuffer2;
})(_cloneBuffer, _cloneBuffer.exports);
function copyArray$1(source, array3) {
  var index2 = -1, length = source.length;
  array3 || (array3 = Array(length));
  while (++index2 < length) {
    array3[index2] = source[index2];
  }
  return array3;
}
var _copyArray = copyArray$1;
var copyObject$1 = _copyObject, getSymbols$1 = _getSymbols;
function copySymbols$1(source, object3) {
  return copyObject$1(source, getSymbols$1(source), object3);
}
var _copySymbols = copySymbols$1;
var overArg = _overArg;
var getPrototype$2 = overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype$2;
var arrayPush = _arrayPush, getPrototype$1 = _getPrototype, getSymbols = _getSymbols, stubArray = stubArray_1;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object3) {
  var result = [];
  while (object3) {
    arrayPush(result, getSymbols(object3));
    object3 = getPrototype$1(object3);
  }
  return result;
};
var _getSymbolsIn = getSymbolsIn$2;
var copyObject = _copyObject, getSymbolsIn$1 = _getSymbolsIn;
function copySymbolsIn$1(source, object3) {
  return copyObject(source, getSymbolsIn$1(source), object3);
}
var _copySymbolsIn = copySymbolsIn$1;
var baseGetAllKeys = _baseGetAllKeys, getSymbolsIn = _getSymbolsIn, keysIn$1 = keysIn_1;
function getAllKeysIn$1(object3) {
  return baseGetAllKeys(object3, keysIn$1, getSymbolsIn);
}
var _getAllKeysIn = getAllKeysIn$1;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function initCloneArray$1(array3) {
  var length = array3.length, result = new array3.constructor(length);
  if (length && typeof array3[0] == "string" && hasOwnProperty.call(array3, "index")) {
    result.index = array3.index;
    result.input = array3.input;
  }
  return result;
}
var _initCloneArray = initCloneArray$1;
var Uint8Array = _Uint8Array;
function cloneArrayBuffer$3(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}
var _cloneArrayBuffer = cloneArrayBuffer$3;
var cloneArrayBuffer$2 = _cloneArrayBuffer;
function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$2(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var _cloneDataView = cloneDataView$1;
var reFlags = /\w*$/;
function cloneRegExp$1(regexp3) {
  var result = new regexp3.constructor(regexp3.source, reFlags.exec(regexp3));
  result.lastIndex = regexp3.lastIndex;
  return result;
}
var _cloneRegExp = cloneRegExp$1;
var Symbol$1 = _Symbol;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function cloneSymbol$1(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var _cloneSymbol = cloneSymbol$1;
var cloneArrayBuffer$1 = _cloneArrayBuffer;
function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var _cloneTypedArray = cloneTypedArray$1;
var cloneArrayBuffer = _cloneArrayBuffer, cloneDataView = _cloneDataView, cloneRegExp = _cloneRegExp, cloneSymbol = _cloneSymbol, cloneTypedArray = _cloneTypedArray;
var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag$1(object3, tag, isDeep) {
  var Ctor = object3.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object3);
    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object3);
    case dataViewTag$1:
      return cloneDataView(object3, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object3, isDeep);
    case mapTag$2:
      return new Ctor();
    case numberTag$1:
    case stringTag$1:
      return new Ctor(object3);
    case regexpTag$1:
      return cloneRegExp(object3);
    case setTag$2:
      return new Ctor();
    case symbolTag$1:
      return cloneSymbol(object3);
  }
}
var _initCloneByTag = initCloneByTag$1;
var isObject$1 = isObject_1;
var objectCreate = Object.create;
var baseCreate$1 = function() {
  function object3() {
  }
  return function(proto) {
    if (!isObject$1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object3.prototype = proto;
    var result = new object3();
    object3.prototype = void 0;
    return result;
  };
}();
var _baseCreate = baseCreate$1;
var baseCreate = _baseCreate, getPrototype = _getPrototype, isPrototype = _isPrototype;
function initCloneObject$1(object3) {
  return typeof object3.constructor == "function" && !isPrototype(object3) ? baseCreate(getPrototype(object3)) : {};
}
var _initCloneObject = initCloneObject$1;
var getTag$2 = _getTag, isObjectLike$1 = isObjectLike_1;
var mapTag$1 = "[object Map]";
function baseIsMap$1(value) {
  return isObjectLike$1(value) && getTag$2(value) == mapTag$1;
}
var _baseIsMap = baseIsMap$1;
var baseIsMap = _baseIsMap, baseUnary$1 = _baseUnary, nodeUtil$1 = _nodeUtil.exports;
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;
var isMap_1 = isMap$1;
var getTag$1 = _getTag, isObjectLike = isObjectLike_1;
var setTag$1 = "[object Set]";
function baseIsSet$1(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$1;
}
var _baseIsSet = baseIsSet$1;
var baseIsSet = _baseIsSet, baseUnary = _baseUnary, nodeUtil = _nodeUtil.exports;
var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
var isSet_1 = isSet$1;
var Stack = _Stack, arrayEach = _arrayEach, assignValue = _assignValue, baseAssign = _baseAssign, baseAssignIn = _baseAssignIn, cloneBuffer = _cloneBuffer.exports, copyArray = _copyArray, copySymbols = _copySymbols, copySymbolsIn = _copySymbolsIn, getAllKeys = _getAllKeys, getAllKeysIn = _getAllKeysIn, getTag = _getTag, initCloneArray = _initCloneArray, initCloneByTag = _initCloneByTag, initCloneObject = _initCloneObject, isArray = isArray_1, isBuffer = isBuffer$3.exports, isMap = isMap_1, isObject = isObject_1, isSet = isSet_1, keys = keys_1, keysIn = keysIn_1;
var CLONE_DEEP_FLAG$1 = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone$1(value, bitmask, customizer, key, object3, stack2) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG$1, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
  if (customizer) {
    result = object3 ? customizer(value, key, object3, stack2) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object3) {
      result = isFlat || isFunc ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object3 ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack2 || (stack2 = new Stack());
  var stacked = stack2.get(value);
  if (stacked) {
    return stacked;
  }
  stack2.set(value, result);
  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack2));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack2));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack2));
  });
  return result;
}
var _baseClone = baseClone$1;
var baseClone = _baseClone;
var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
var cloneDeep_1 = cloneDeep;
var ye = typeof window == "undefined";
const ke = () => {
}, Ce = Object.assign, xe = Object.prototype.hasOwnProperty, we = (e, t) => xe.call(e, t), _e = Array.isArray, Se = (e) => typeof e == "function", Ee = (e) => typeof e == "string", Me = (e) => e !== null && typeof e == "object", Te = (e) => Me(e) && Se(e.then) && Se(e.catch), Ne = Object.prototype.toString, De = (e) => Ne.call(e), Oe = (e) => De(e).slice(8, -1), Ie = (e) => {
  const t = Object.create(null);
  return (l) => t[l] || (t[l] = e(l));
}, Pe = /-(\w)/g, Ve = Ie((e) => e.replace(Pe, (e2, t) => t ? t.toUpperCase() : "")), Be = Ie((e) => e.charAt(0).toUpperCase() + e.slice(1));
class Ae extends Error {
  constructor(e) {
    super(e), this.name = "ElementPlusError";
  }
}
var Le = (e, t) => {
  throw new Ae(`[${e}] ${t}`);
};
const Fe = (e, t = "") => {
  let l = e;
  return t.split(".").map((e2) => {
    l = l == null ? void 0 : l[e2];
  }), l;
};
function $e(e, t, l) {
  let a = e;
  const n = (t = (t = t.replace(/\[(\w+)\]/g, ".$1")).replace(/^\./, "")).split(".");
  let o = 0;
  for (; o < n.length - 1 && (a || l); o++) {
    const e2 = n[o];
    if (!(e2 in a)) {
      if (l)
        throw new Error("please transfer a valid prop path to form item!");
      break;
    }
    a = a[e2];
  }
  return {o: a, k: n[o], v: a == null ? void 0 : a[n[o]]};
}
const Re = () => Math.floor(1e4 * Math.random()), He = (e) => e || e === 0 ? Array.isArray(e) ? e : [e] : [], We = (e) => typeof e == "boolean", je = (e) => typeof e == "number";
function Ke(e) {
  let t = false;
  return function(...l) {
    t || (t = true, window.requestAnimationFrame(() => {
      e.apply(this, l), t = false;
    }));
  };
}
const Ye = (e) => {
  clearTimeout(e.value), e.value = null;
};
function qe(e) {
  return Object.keys(e).map((t) => [t, e[t]]);
}
function Ue() {
  const t = getCurrentInstance();
  return "$ELEMENT" in t.proxy ? t.proxy.$ELEMENT : {};
}
const Ge = function(e, t) {
  return e.find(t);
};
function Xe(e) {
  return !!(!e && e !== 0 || _e(e) && !e.length || Me(e) && !Object.keys(e).length);
}
function Ze(e) {
  return e.reduce((e2, t) => {
    const l = Array.isArray(t) ? Ze(t) : t;
    return e2.concat(l);
  }, []);
}
function Qe(e) {
  return Array.from(new Set(e));
}
function Je(e) {
  return e.value;
}
function et(e) {
  return Ee(e) ? e : je(e) ? e + "px" : "";
}
const tt = function(e, t, l, a = false) {
  e && t && l && e.addEventListener(t, l, a);
}, lt = function(e, t, l, a = false) {
  e && t && l && e.removeEventListener(t, l, a);
};
function at(e, t) {
  if (!e || !t)
    return false;
  if (t.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  return e.classList ? e.classList.contains(t) : (" " + e.className + " ").indexOf(" " + t + " ") > -1;
}
function nt(e, t) {
  if (!e)
    return;
  let l = e.className;
  const a = (t || "").split(" ");
  for (let t2 = 0, n = a.length; t2 < n; t2++) {
    const n2 = a[t2];
    n2 && (e.classList ? e.classList.add(n2) : at(e, n2) || (l += " " + n2));
  }
  e.classList || (e.className = l);
}
function ot(e, t) {
  if (!e || !t)
    return;
  const l = t.split(" ");
  let a = " " + e.className + " ";
  for (let t2 = 0, n = l.length; t2 < n; t2++) {
    const n2 = l[t2];
    n2 && (e.classList ? e.classList.remove(n2) : at(e, n2) && (a = a.replace(" " + n2 + " ", " ")));
  }
  e.classList || (e.className = (a || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ""));
}
const it = function(e, t) {
  if (!ye) {
    if (!e || !t)
      return null;
    (t = Ve(t)) === "float" && (t = "cssFloat");
    try {
      const l = e.style[t];
      if (l)
        return l;
      const a = document.defaultView.getComputedStyle(e, "");
      return a ? a[t] : "";
    } catch (l) {
      return e.style[t];
    }
  }
}, rt = (e, t) => {
  if (ye)
    return;
  return it(e, t == null ? "overflow" : t ? "overflow-y" : "overflow-x").match(/(scroll|auto)/);
}, st = (e, t) => {
  if (ye)
    return;
  let l = e;
  for (; l; ) {
    if ([window, document, document.documentElement].includes(l))
      return window;
    if (rt(l, t))
      return l;
    l = l.parentNode;
  }
  return l;
}, ut = (e) => {
  let t = 0, l = e;
  for (; l; )
    t += l.offsetTop, l = l.offsetParent;
  return t;
}, dt = (e) => e.stopPropagation(), ct = function(e) {
  for (const t of e) {
    const e2 = t.target.__resizeListeners__ || [];
    e2.length && e2.forEach((e3) => {
      e3();
    });
  }
}, pt = function(e, t) {
  !ye && e && (e.__resizeListeners__ || (e.__resizeListeners__ = [], e.__ro__ = new index(ct), e.__ro__.observe(e)), e.__resizeListeners__.push(t));
}, ht = function(e, t) {
  e && e.__resizeListeners__ && (e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t), 1), e.__resizeListeners__.length || e.__ro__.disconnect());
};
var vt = defineComponent({name: "ElAffix", props: {zIndex: {type: Number, default: 100}, target: {type: String, default: ""}, offset: {type: Number, default: 0}, position: {type: String, default: "top"}}, emits: ["scroll", "change"], setup(e, {emit: t}) {
  const s = ref(null), u = ref(null), d = ref(null), c = reactive({fixed: false, height: 0, width: 0, scrollTop: 0, clientHeight: 0, transform: 0}), p2 = computed(() => ({height: c.fixed ? c.height + "px" : "", width: c.fixed ? c.width + "px" : ""})), h2 = computed(() => {
    if (!c.fixed)
      return;
    const t2 = e.offset ? e.offset + "px" : 0, l = c.transform ? `translateY(${c.transform}px)` : "";
    return {height: c.height + "px", width: c.width + "px", top: e.position === "top" ? t2 : "", bottom: e.position === "bottom" ? t2 : "", transform: l, zIndex: e.zIndex};
  }), v = () => {
    const t2 = u.value.getBoundingClientRect(), l = s.value.getBoundingClientRect();
    if (c.height = t2.height, c.width = t2.width, c.scrollTop = d.value === window ? document.documentElement.scrollTop : d.value.scrollTop, c.clientHeight = document.documentElement.clientHeight, e.position === "top")
      if (e.target) {
        const a = l.bottom - e.offset - c.height;
        c.fixed = e.offset > t2.top && l.bottom > 0, c.transform = a < 0 ? a : 0;
      } else
        c.fixed = e.offset > t2.top;
    else if (e.target) {
      const a = c.clientHeight - l.top - e.offset - c.height;
      c.fixed = c.clientHeight - e.offset < t2.bottom && c.clientHeight > l.top, c.transform = a < 0 ? -a : 0;
    } else
      c.fixed = c.clientHeight - e.offset < t2.bottom;
  }, m = () => {
    v(), t("scroll", {scrollTop: c.scrollTop, fixed: c.fixed});
  };
  return watch(() => c.fixed, () => {
    t("change", c.fixed);
  }), onMounted(() => {
    if (e.target) {
      if (s.value = document.querySelector(e.target), !s.value)
        throw new Error("target is not existed: " + e.target);
    } else
      s.value = document.documentElement;
    d.value = st(u.value), tt(d.value, "scroll", m), pt(u.value, v);
  }), onBeforeUnmount(() => {
    lt(d.value, "scroll", m), ht(u.value, v);
  }), {root: u, state: c, rootStyle: p2, affixStyle: h2};
}});
vt.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {ref: "root", class: "el-affix", style: e.rootStyle}, [createVNode("div", {class: {"el-affix--fixed": e.state.fixed}, style: e.affixStyle}, [renderSlot(e.$slots, "default")], 6)], 4);
}, vt.__file = "packages/affix/src/index.vue", vt.install = (e) => {
  e.component(vt.name, vt);
};
const mt = vt, ft = {success: "el-icon-success", warning: "el-icon-warning", error: "el-icon-error"};
var gt = defineComponent({name: "ElAlert", props: {title: {type: String, default: ""}, description: {type: String, default: ""}, type: {type: String, default: "info"}, closable: {type: Boolean, default: true}, closeText: {type: String, default: ""}, showIcon: Boolean, center: Boolean, effect: {type: String, default: "light", validator: (e) => ["light", "dark"].indexOf(e) > -1}}, emits: ["close"], setup(e, t) {
  const a = ref(true), o = computed(() => "el-alert--" + e.type), i = computed(() => ft[e.type] || "el-icon-info"), r = computed(() => e.description || t.slots.default ? "is-big" : ""), s = computed(() => e.description || t.slots.default ? "is-bold" : "");
  return {visible: a, typeClass: o, iconClass: i, isBigIcon: r, isBoldTitle: s, close: (e2) => {
    a.value = false, t.emit("close", e2);
  }};
}});
const bt = {class: "el-alert__content"}, yt = {key: 1, class: "el-alert__description"};
gt.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "el-alert-fade"}, {default: withCtx(() => [withDirectives(createVNode("div", {class: ["el-alert", [e.typeClass, e.center ? "is-center" : "", "is-" + e.effect]], role: "alert"}, [e.showIcon ? (openBlock(), createBlock("i", {key: 0, class: ["el-alert__icon", [e.iconClass, e.isBigIcon]]}, null, 2)) : createCommentVNode("v-if", true), createVNode("div", bt, [e.title || e.$slots.title ? (openBlock(), createBlock("span", {key: 0, class: ["el-alert__title", [e.isBoldTitle]]}, [renderSlot(e.$slots, "title", {}, () => [createTextVNode(toDisplayString(e.title), 1)])], 2)) : createCommentVNode("v-if", true), e.$slots.default || e.description ? (openBlock(), createBlock("p", yt, [renderSlot(e.$slots, "default", {}, () => [createTextVNode(toDisplayString(e.description), 1)])])) : createCommentVNode("v-if", true), e.closable ? (openBlock(), createBlock("i", {key: 2, class: ["el-alert__closebtn", {"is-customed": e.closeText !== "", "el-icon-close": e.closeText === ""}], onClick: t[1] || (t[1] = (...t2) => e.close && e.close(...t2))}, toDisplayString(e.closeText), 3)) : createCommentVNode("v-if", true)])], 2), [[vShow, e.visible]])]), _: 3});
}, gt.__file = "packages/alert/src/index.vue", gt.install = (e) => {
  e.component(gt.name, gt);
};
const kt = gt;
var Ct = defineComponent({name: "ElAside", props: {width: {type: String, default: "300px"}}});
Ct.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("aside", {class: "el-aside", style: {width: e.width}}, [renderSlot(e.$slots, "default")], 4);
}, Ct.__file = "packages/container/src/aside.vue", Ct.install = (e) => {
  e.component(Ct.name, Ct);
};
const xt = Ct, wt = ["class", "style"], _t = /^on[A-Z]/;
var St = (t = {}) => {
  const {excludeListeners: l = false, excludeKeys: n = []} = t, o = getCurrentInstance(), i = shallowRef({}), r = n.concat(wt);
  return o.attrs = reactive(o.attrs), watchEffect(() => {
    const e = qe(o.attrs).reduce((e2, [t2, a]) => (r.includes(t2) || l && _t.test(t2) || (e2[t2] = a), e2), {});
    i.value = e;
  }), i;
};
let Et;
function Mt() {
  if (ye)
    return 0;
  if (Et !== void 0)
    return Et;
  const e = document.createElement("div");
  e.className = "el-scrollbar__wrap", e.style.visibility = "hidden", e.style.width = "100px", e.style.position = "absolute", e.style.top = "-9999px", document.body.appendChild(e);
  const t = e.offsetWidth;
  e.style.overflow = "scroll";
  const l = document.createElement("div");
  l.style.width = "100%", e.appendChild(l);
  const a = l.offsetWidth;
  return e.parentNode.removeChild(e), Et = t - a, Et;
}
var Tt = (e) => {
  isRef(e) || Le("[useLockScreen]", "You need to pass a ref param to this function");
  let t = 0, l = false, a = "0", n = 0;
  onUnmounted(() => {
    i();
  });
  const i = () => {
    ot(document.body, "el-popup-parent--hidden"), l && (document.body.style.paddingRight = a);
  };
  watch(e, (e2) => {
    if (e2) {
      l = !at(document.body, "el-popup-parent--hidden"), l && (a = document.body.style.paddingRight, n = parseInt(it(document.body, "paddingRight"), 10)), t = Mt();
      const e3 = document.documentElement.clientHeight < document.body.scrollHeight, o = it(document.body, "overflowY");
      t > 0 && (e3 || o === "scroll") && l && (document.body.style.paddingRight = n + t + "px"), nt(document.body, "el-popup-parent--hidden");
    } else
      i();
  });
}, Nt = (e, t) => {
  let l;
  watch(() => e.value, (e2) => {
    var a, n;
    e2 ? (l = document.activeElement, isRef(t) && ((n = (a = t.value).focus) === null || n === void 0 || n.call(a))) : l.focus();
  });
};
const Dt = {tab: "Tab", enter: "Enter", space: "Space", left: "ArrowLeft", up: "ArrowUp", right: "ArrowRight", down: "ArrowDown", esc: "Escape", delete: "Delete", backspace: "Backspace"}, Ot = (e) => {
  return getComputedStyle(e).position !== "fixed" && e.offsetParent !== null;
}, It = (e) => Array.from(e.querySelectorAll('a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])')).filter(Pt).filter(Ot), Pt = (e) => {
  if (e.tabIndex > 0 || e.tabIndex === 0 && e.getAttribute("tabIndex") !== null)
    return true;
  if (e.disabled)
    return false;
  switch (e.nodeName) {
    case "A":
      return !!e.href && e.rel !== "ignore";
    case "INPUT":
      return !(e.type === "hidden" || e.type === "file");
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
}, Vt = function(e, t, ...l) {
  let a;
  a = t.includes("mouse") || t.includes("click") ? "MouseEvents" : t.includes("key") ? "KeyboardEvent" : "HTMLEvents";
  const n = document.createEvent(a);
  return n.initEvent(t, ...l), e.dispatchEvent(n), e;
}, Bt = [];
var At = (e, t) => {
  watch(() => t.value, (t2) => {
    t2 ? Bt.push(e) : Bt.splice(Bt.findIndex((t3) => t3 === e), 1);
  });
};
ye || tt(document, "keydown", (e) => {
  if (Bt.length !== 0 && e.code === Dt.esc) {
    e.stopPropagation();
    Bt[Bt.length - 1].handleClose();
  }
});
const Lt = new Map();
let zt;
function Ft(e, t) {
  let l = [];
  return Array.isArray(t.arg) ? l = t.arg : l.push(t.arg), function(a, n) {
    const o = t.instance.popperRef, i = a.target, r = n == null ? void 0 : n.target, s = !t || !t.instance, u = !i || !r, d = e.contains(i) || e.contains(r), c = e === i, p2 = l.length && l.some((e2) => e2 == null ? void 0 : e2.contains(i)) || l.length && l.includes(r), h2 = o && (o.contains(i) || o.contains(r));
    s || u || d || c || p2 || h2 || t.value();
  };
}
ye || (tt(document, "mousedown", (e) => zt = e), tt(document, "mouseup", (e) => {
  for (const {documentHandler: t} of Lt.values())
    t(e, zt);
}));
const $t = {beforeMount(e, t) {
  Lt.set(e, {documentHandler: Ft(e, t), bindingFn: t.value});
}, updated(e, t) {
  Lt.set(e, {documentHandler: Ft(e, t), bindingFn: t.value});
}, unmounted(e) {
  Lt.delete(e);
}};
var Rt = {beforeMount(e, t) {
  let l, a = null;
  const n = () => t.value && t.value(), o = () => {
    Date.now() - l < 100 && n(), clearInterval(a), a = null;
  };
  tt(e, "mousedown", (e2) => {
    e2.button === 0 && (l = Date.now(), function(e3, t2, l2) {
      const a2 = function(...n2) {
        l2 && l2.apply(this, n2), lt(e3, t2, a2);
      };
      tt(e3, t2, a2);
    }(document, "mouseup", o), clearInterval(a), a = setInterval(n, 100));
  });
}};
const Ht = [], Wt = (e) => {
  if (Ht.length === 0)
    return;
  const l = Ht[Ht.length - 1]["_trap-focus-children"];
  if (l.length > 0 && e.code === Dt.tab) {
    if (l.length === 1)
      return e.preventDefault(), void (document.activeElement !== l[0] && l[0].focus());
    const a = e.shiftKey, n = e.target === l[0], o = e.target === l[l.length - 1];
    if (n && a && (e.preventDefault(), l[l.length - 1].focus()), o && !a && (e.preventDefault(), l[0].focus()), false)
      ;
  }
}, jt = {beforeMount(e) {
  e["_trap-focus-children"] = It(e), Ht.push(e), Ht.length <= 1 && tt(document, "keydown", Wt);
}, updated(e) {
  nextTick(() => {
    e["_trap-focus-children"] = It(e);
  });
}, unmounted() {
  Ht.shift(), Ht.length === 0 && lt(document, "keydown", Wt);
}}, Kt = typeof navigator != "undefined" && navigator.userAgent.toLowerCase().indexOf("firefox") > -1, Yt = {beforeMount(e, t) {
  !function(e2, t2) {
    if (e2 && e2.addEventListener) {
      const l = function(e3) {
        const l2 = normalizeWheel(e3);
        t2 && t2.apply(this, [e3, l2]);
      };
      Kt ? e2.addEventListener("DOMMouseScroll", l) : e2.onmousewheel = l;
    }
  }(e, t.value);
}}, qt = "update:modelValue", Ut = {validating: "el-icon-loading", success: "el-icon-circle-check", error: "el-icon-circle-close"};
function Gt(e) {
  return /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(e);
}
const Xt = (e) => ["", "large", "medium", "small", "mini"].includes(e), Zt = "el.form.addField", Qt = "el.form.removeField";
var Jt = defineComponent({name: "ElForm", props: {model: Object, rules: Object, labelPosition: String, labelWidth: String, labelSuffix: {type: String, default: ""}, inline: Boolean, inlineMessage: Boolean, statusIcon: Boolean, showMessage: {type: Boolean, default: true}, size: String, disabled: Boolean, validateOnRuleChange: {type: Boolean, default: true}, hideRequiredAsterisk: {type: Boolean, default: false}}, emits: ["validate"], setup(e, {emit: t}) {
  const i = ae(), r = [];
  watch(() => e.rules, () => {
    r.forEach((e2) => {
      e2.removeValidateEvents(), e2.addValidateEvents();
    }), e.validateOnRuleChange && d(() => ({}));
  }), i.on(Zt, (e2) => {
    e2 && r.push(e2);
  }), i.on(Qt, (e2) => {
    e2.prop && r.splice(r.indexOf(e2), 1);
  });
  const s = () => {
    e.model ? r.forEach((e2) => {
      e2.resetField();
    }) : console.warn("[Element Warn][Form]model is required for resetFields to work.");
  }, u = (e2 = []) => {
    (e2.length ? typeof e2 == "string" ? r.filter((t2) => e2 === t2.prop) : r.filter((t2) => e2.indexOf(t2.prop) > -1) : r).forEach((e3) => {
      e3.clearValidate();
    });
  }, d = (t2) => {
    if (!e.model)
      return void console.warn("[Element Warn][Form]model is required for validate to work!");
    let l;
    typeof t2 != "function" && (l = new Promise((e2, l2) => {
      t2 = function(t3, a2) {
        t3 ? e2(true) : l2(a2);
      };
    })), r.length === 0 && t2(true);
    let a = true, n = 0, o = {};
    for (const e2 of r)
      e2.validate("", (e3, l2) => {
        e3 && (a = false), o = Object.assign(Object.assign({}, o), l2), ++n === r.length && t2(a, o);
      });
    return l;
  }, c = (e2, t2) => {
    e2 = [].concat(e2);
    const l = r.filter((t3) => e2.indexOf(t3.prop) !== -1);
    r.length ? l.forEach((e3) => {
      e3.validate("", t2);
    }) : console.warn("[Element Warn]please pass correct props!");
  }, p2 = reactive(Object.assign(Object.assign(Object.assign({formMitt: i}, toRefs(e)), {resetFields: s, clearValidate: u, validateField: c, emit: t}), function() {
    const e2 = ref([]);
    function t2(t3) {
      const l = e2.value.indexOf(t3);
      return l === -1 && console.warn("[Element Warn][ElementForm]unexpected width " + t3), l;
    }
    return {autoLabelWidth: computed(() => {
      if (!e2.value.length)
        return "0";
      const t3 = Math.max(...e2.value);
      return t3 ? t3 + "px" : "";
    }), registerLabelWidth: function(l, a) {
      if (l && a) {
        const n = t2(a);
        e2.value.splice(n, 1, l);
      } else
        l && e2.value.push(l);
    }, deregisterLabelWidth: function(l) {
      const a = t2(l);
      a > -1 && e2.value.splice(a, 1);
    }};
  }()));
  return provide("elForm", p2), {validate: d, resetFields: s, clearValidate: u, validateField: c};
}});
Jt.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("form", {class: ["el-form", [e.labelPosition ? "el-form--label-" + e.labelPosition : "", {"el-form--inline": e.inline}]]}, [renderSlot(e.$slots, "default")], 2);
}, Jt.__file = "packages/form/src/form.vue", Jt.install = (e) => {
  e.component(Jt.name, Jt);
};
const el = Jt;
let tl;
const ll = ["letter-spacing", "line-height", "padding-top", "padding-bottom", "font-family", "font-weight", "font-size", "text-rendering", "text-transform", "width", "text-indent", "padding-left", "padding-right", "border-width", "box-sizing"];
function al(e, t = 1, l = null) {
  var a;
  tl || (tl = document.createElement("textarea"), document.body.appendChild(tl));
  const {paddingSize: n, borderSize: o, boxSizing: i, contextStyle: r} = function(e2) {
    const t2 = window.getComputedStyle(e2), l2 = t2.getPropertyValue("box-sizing"), a2 = parseFloat(t2.getPropertyValue("padding-bottom")) + parseFloat(t2.getPropertyValue("padding-top")), n2 = parseFloat(t2.getPropertyValue("border-bottom-width")) + parseFloat(t2.getPropertyValue("border-top-width"));
    return {contextStyle: ll.map((e3) => `${e3}:${t2.getPropertyValue(e3)}`).join(";"), paddingSize: a2, borderSize: n2, boxSizing: l2};
  }(e);
  tl.setAttribute("style", r + ";\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important;\n"), tl.value = e.value || e.placeholder || "";
  let s = tl.scrollHeight;
  const u = {};
  i === "border-box" ? s += o : i === "content-box" && (s -= n), tl.value = "";
  const d = tl.scrollHeight - n;
  if (t !== null) {
    let e2 = d * t;
    i === "border-box" && (e2 = e2 + n + o), s = Math.max(e2, s), u.minHeight = e2 + "px";
  }
  if (l !== null) {
    let e2 = d * l;
    i === "border-box" && (e2 = e2 + n + o), s = Math.min(e2, s);
  }
  return u.height = s + "px", (a = tl.parentNode) === null || a === void 0 || a.removeChild(tl), tl = null, u;
}
const nl = {suffix: "append", prefix: "prepend"};
var ol = defineComponent({name: "ElInput", inheritAttrs: false, props: {modelValue: {type: [String, Number], default: ""}, type: {type: String, default: "text"}, size: {type: String, validator: Xt}, resize: {type: String, validator: (e) => ["none", "both", "horizontal", "vertical"].includes(e)}, autosize: {type: [Boolean, Object], default: false}, autocomplete: {type: String, default: "off", validator: (e) => ["on", "off"].includes(e)}, placeholder: {type: String}, form: {type: String, default: ""}, disabled: {type: Boolean, default: false}, readonly: {type: Boolean, default: false}, clearable: {type: Boolean, default: false}, showPassword: {type: Boolean, default: false}, showWordLimit: {type: Boolean, default: false}, suffixIcon: {type: String, default: ""}, prefixIcon: {type: String, default: ""}, label: {type: String}, tabindex: {type: String}, validateEvent: {type: Boolean, default: true}}, emits: [qt, "input", "change", "focus", "blur", "clear", "mouseleave", "mouseenter", "keydown"], setup(t, a) {
  const r = getCurrentInstance(), s = St(), u = Ue(), d = inject("elForm", {}), c = inject("elFormItem", {}), p2 = ref(null), h2 = ref(null), v = ref(false), m = ref(false), f = ref(false), g = ref(false), b = shallowRef({}), k = computed(() => p2.value || h2.value), C = computed(() => t.size || c.size || u.size), x = computed(() => d.statusIcon), _ = computed(() => c.validateState || ""), S = computed(() => Ut[_.value]), T = computed(() => Object.assign(Object.assign({}, b.value), {resize: t.resize})), N = computed(() => t.disabled || d.disabled), D = computed(() => t.modelValue === null || t.modelValue === void 0 ? "" : String(t.modelValue)), O = computed(() => a.attrs.maxlength), I = computed(() => t.clearable && !N.value && !t.readonly && D.value && (v.value || m.value)), P = computed(() => t.showPassword && !N.value && !t.readonly && (!!D.value || v.value)), V = computed(() => t.showWordLimit && a.attrs.maxlength && (t.type === "text" || t.type === "textarea") && !N.value && !t.readonly && !t.showPassword), B = computed(() => typeof t.modelValue == "number" ? String(t.modelValue).length : (t.modelValue || "").length), A = computed(() => V.value && B.value > O.value), L = () => {
    const {type: e, autosize: l} = t;
    if (!ye && e === "textarea")
      if (l) {
        const e2 = Me(l) ? l.minRows : void 0, t2 = Me(l) ? l.maxRows : void 0;
        b.value = al(h2.value, e2, t2);
      } else
        b.value = {minHeight: al(h2.value).minHeight};
  }, z = () => {
    const e = k.value;
    e && e.value !== D.value && (e.value = D.value);
  }, F = (e) => {
    const {el: t2} = r.vnode, l = Array.from(t2.querySelectorAll(".el-input__" + e)).find((e2) => e2.parentNode === t2);
    if (!l)
      return;
    const n = nl[e];
    a.slots[n] ? l.style.transform = `translateX(${e === "suffix" ? "-" : ""}${t2.querySelector(".el-input-group__" + n).offsetWidth}px)` : l.removeAttribute("style");
  }, $ = () => {
    F("prefix"), F("suffix");
  }, R = (e) => {
    const {value: t2} = e.target;
    f.value || t2 !== D.value && (a.emit(qt, t2), a.emit("input", t2), nextTick(z));
  }, H = () => {
    nextTick(() => {
      k.value.focus();
    });
  };
  watch(() => t.modelValue, (e) => {
    var l;
    nextTick(L), t.validateEvent && ((l = c.formItemMitt) === null || l === void 0 || l.emit("el.form.change", [e]));
  }), watch(D, () => {
    z();
  }), watch(() => t.type, () => {
    nextTick(() => {
      z(), L(), $();
    });
  }), onMounted(() => {
    z(), $(), nextTick(L);
  }), onUpdated(() => {
    nextTick($);
  });
  return {input: p2, textarea: h2, attrs: s, inputSize: C, validateState: _, validateIcon: S, textareaStyle: T, resizeTextarea: L, inputDisabled: N, showClear: I, showPwdVisible: P, isWordLimitVisible: V, upperLimit: O, textLength: B, hovering: m, inputExceed: A, passwordVisible: g, inputOrTextarea: k, handleInput: R, handleChange: (e) => {
    a.emit("change", e.target.value);
  }, handleFocus: (e) => {
    v.value = true, a.emit("focus", e);
  }, handleBlur: (e) => {
    var l;
    v.value = false, a.emit("blur", e), t.validateEvent && ((l = c.formItemMitt) === null || l === void 0 || l.emit("el.form.blur", [t.modelValue]));
  }, handleCompositionStart: () => {
    f.value = true;
  }, handleCompositionUpdate: (e) => {
    const t2 = e.target.value, l = t2[t2.length - 1] || "";
    f.value = !Gt(l);
  }, handleCompositionEnd: (e) => {
    f.value && (f.value = false, R(e));
  }, handlePasswordVisible: () => {
    g.value = !g.value, H();
  }, clear: () => {
    a.emit(qt, ""), a.emit("change", ""), a.emit("clear");
  }, select: () => {
    k.value.select();
  }, focus: H, blur: () => {
    k.value.blur();
  }, getSuffixVisible: () => a.slots.suffix || t.suffixIcon || I.value || t.showPassword || V.value || _.value && x.value, onMouseLeave: (e) => {
    m.value = false, a.emit("mouseleave", e);
  }, onMouseEnter: (e) => {
    m.value = true, a.emit("mouseenter", e);
  }, handleKeydown: (e) => {
    a.emit("keydown", e);
  }};
}});
const il = {key: 0, class: "el-input-group__prepend"}, rl = {key: 2, class: "el-input__prefix"}, sl = {key: 3, class: "el-input__suffix"}, ul = {class: "el-input__suffix-inner"}, dl = {key: 3, class: "el-input__count"}, cl = {class: "el-input__count-inner"}, pl = {key: 4, class: "el-input-group__append"}, hl = {key: 2, class: "el-input__count"};
ol.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: [e.type === "textarea" ? "el-textarea" : "el-input", e.inputSize ? "el-input--" + e.inputSize : "", {"is-disabled": e.inputDisabled, "is-exceed": e.inputExceed, "el-input-group": e.$slots.prepend || e.$slots.append, "el-input-group--append": e.$slots.append, "el-input-group--prepend": e.$slots.prepend, "el-input--prefix": e.$slots.prefix || e.prefixIcon, "el-input--suffix": e.$slots.suffix || e.suffixIcon || e.clearable || e.showPassword}, e.$attrs.class], style: e.$attrs.style, onMouseenter: t[20] || (t[20] = (...t2) => e.onMouseEnter && e.onMouseEnter(...t2)), onMouseleave: t[21] || (t[21] = (...t2) => e.onMouseLeave && e.onMouseLeave(...t2))}, [e.type !== "textarea" ? (openBlock(), createBlock(Fragment, {key: 0}, [createCommentVNode(" \u524D\u7F6E\u5143\u7D20 "), e.$slots.prepend ? (openBlock(), createBlock("div", il, [renderSlot(e.$slots, "prepend")])) : createCommentVNode("v-if", true), e.type !== "textarea" ? (openBlock(), createBlock("input", mergeProps({key: 1, ref: "input", class: "el-input__inner"}, e.attrs, {type: e.showPassword ? e.passwordVisible ? "text" : "password" : e.type, disabled: e.inputDisabled, readonly: e.readonly, autocomplete: e.autocomplete, tabindex: e.tabindex, "aria-label": e.label, placeholder: e.placeholder, onCompositionstart: t[1] || (t[1] = (...t2) => e.handleCompositionStart && e.handleCompositionStart(...t2)), onCompositionupdate: t[2] || (t[2] = (...t2) => e.handleCompositionUpdate && e.handleCompositionUpdate(...t2)), onCompositionend: t[3] || (t[3] = (...t2) => e.handleCompositionEnd && e.handleCompositionEnd(...t2)), onInput: t[4] || (t[4] = (...t2) => e.handleInput && e.handleInput(...t2)), onFocus: t[5] || (t[5] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onBlur: t[6] || (t[6] = (...t2) => e.handleBlur && e.handleBlur(...t2)), onChange: t[7] || (t[7] = (...t2) => e.handleChange && e.handleChange(...t2)), onKeydown: t[8] || (t[8] = (...t2) => e.handleKeydown && e.handleKeydown(...t2))}), null, 16, ["type", "disabled", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder"])) : createCommentVNode("v-if", true), createCommentVNode(" \u524D\u7F6E\u5185\u5BB9 "), e.$slots.prefix || e.prefixIcon ? (openBlock(), createBlock("span", rl, [renderSlot(e.$slots, "prefix"), e.prefixIcon ? (openBlock(), createBlock("i", {key: 0, class: ["el-input__icon", e.prefixIcon]}, null, 2)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createCommentVNode(" \u540E\u7F6E\u5185\u5BB9 "), e.getSuffixVisible() ? (openBlock(), createBlock("span", sl, [createVNode("span", ul, [e.showClear && e.showPwdVisible && e.isWordLimitVisible ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Fragment, {key: 0}, [renderSlot(e.$slots, "suffix"), e.suffixIcon ? (openBlock(), createBlock("i", {key: 0, class: ["el-input__icon", e.suffixIcon]}, null, 2)) : createCommentVNode("v-if", true)], 64)), e.showClear ? (openBlock(), createBlock("i", {key: 1, class: "el-input__icon el-icon-circle-close el-input__clear", onMousedown: t[9] || (t[9] = withModifiers(() => {
  }, ["prevent"])), onClick: t[10] || (t[10] = (...t2) => e.clear && e.clear(...t2))}, null, 32)) : createCommentVNode("v-if", true), e.showPwdVisible ? (openBlock(), createBlock("i", {key: 2, class: "el-input__icon el-icon-view el-input__clear", onClick: t[11] || (t[11] = (...t2) => e.handlePasswordVisible && e.handlePasswordVisible(...t2))})) : createCommentVNode("v-if", true), e.isWordLimitVisible ? (openBlock(), createBlock("span", dl, [createVNode("span", cl, toDisplayString(e.textLength) + "/" + toDisplayString(e.upperLimit), 1)])) : createCommentVNode("v-if", true)]), e.validateState ? (openBlock(), createBlock("i", {key: 0, class: ["el-input__icon", "el-input__validateIcon", e.validateIcon]}, null, 2)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createCommentVNode(" \u540E\u7F6E\u5143\u7D20 "), e.$slots.append ? (openBlock(), createBlock("div", pl, [renderSlot(e.$slots, "append")])) : createCommentVNode("v-if", true)], 64)) : (openBlock(), createBlock("textarea", mergeProps({key: 1, ref: "textarea", class: "el-textarea__inner"}, e.attrs, {tabindex: e.tabindex, disabled: e.inputDisabled, readonly: e.readonly, autocomplete: e.autocomplete, style: e.textareaStyle, "aria-label": e.label, placeholder: e.placeholder, onCompositionstart: t[12] || (t[12] = (...t2) => e.handleCompositionStart && e.handleCompositionStart(...t2)), onCompositionupdate: t[13] || (t[13] = (...t2) => e.handleCompositionUpdate && e.handleCompositionUpdate(...t2)), onCompositionend: t[14] || (t[14] = (...t2) => e.handleCompositionEnd && e.handleCompositionEnd(...t2)), onInput: t[15] || (t[15] = (...t2) => e.handleInput && e.handleInput(...t2)), onFocus: t[16] || (t[16] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onBlur: t[17] || (t[17] = (...t2) => e.handleBlur && e.handleBlur(...t2)), onChange: t[18] || (t[18] = (...t2) => e.handleChange && e.handleChange(...t2)), onKeydown: t[19] || (t[19] = (...t2) => e.handleKeydown && e.handleKeydown(...t2))}), "\n    ", 16, ["tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder"])), e.isWordLimitVisible && e.type === "textarea" ? (openBlock(), createBlock("span", hl, toDisplayString(e.textLength) + "/" + toDisplayString(e.upperLimit), 1)) : createCommentVNode("v-if", true)], 38);
}, ol.__file = "packages/input/src/index.vue", ol.install = (e) => {
  e.component(ol.name, ol);
};
const vl = ol, ml = {vertical: {offset: "offsetHeight", scroll: "scrollTop", scrollSize: "scrollHeight", size: "height", key: "vertical", axis: "Y", client: "clientY", direction: "top"}, horizontal: {offset: "offsetWidth", scroll: "scrollLeft", scrollSize: "scrollWidth", size: "width", key: "horizontal", axis: "X", client: "clientX", direction: "left"}};
var fl = defineComponent({name: "Bar", props: {vertical: Boolean, size: String, move: Number}, setup(e) {
  const t = ref(null), a = ref(null), o = inject("scrollbar", {}), s = inject("scrollbar-wrap", {}), u = computed(() => ml[e.vertical ? "vertical" : "horizontal"]), d = ref({}), c = ref(null), p2 = ref(null), h2 = ref(false);
  let v = null;
  const m = (e2) => {
    e2.stopImmediatePropagation(), c.value = true, tt(document, "mousemove", f), tt(document, "mouseup", g), v = document.onselectstart, document.onselectstart = () => false;
  }, f = (e2) => {
    if (c.value === false)
      return;
    const l = d.value[u.value.axis];
    if (!l)
      return;
    const n = 100 * (-1 * (t.value.getBoundingClientRect()[u.value.direction] - e2[u.value.client]) - (a.value[u.value.offset] - l)) / t.value[u.value.offset];
    s.value[u.value.scroll] = n * s.value[u.value.scrollSize] / 100;
  }, g = () => {
    c.value = false, d.value[u.value.axis] = 0, lt(document, "mousemove", f), document.onselectstart = v, p2.value && (h2.value = false);
  }, b = computed(() => function({move: e2, size: t2, bar: l}) {
    const a2 = {}, n = `translate${l.axis}(${e2}%)`;
    return a2[l.size] = t2, a2.transform = n, a2.msTransform = n, a2.webkitTransform = n, a2;
  }({size: e.size, move: e.move, bar: u.value})), y = () => {
    p2.value = false, h2.value = !!e.size;
  }, k = () => {
    p2.value = true, h2.value = c.value;
  };
  return onMounted(() => {
    tt(o.value, "mousemove", y), tt(o.value, "mouseleave", k);
  }), onBeforeUnmount(() => {
    lt(document, "mouseup", g), lt(o.value, "mousemove", y), lt(o.value, "mouseleave", k);
  }), {instance: t, thumb: a, bar: u, clickTrackHandler: (e2) => {
    const l = 100 * (Math.abs(e2.target.getBoundingClientRect()[u.value.direction] - e2[u.value.client]) - a.value[u.value.offset] / 2) / t.value[u.value.offset];
    s.value[u.value.scroll] = l * s.value[u.value.scrollSize] / 100;
  }, clickThumbHandler: (e2) => {
    e2.stopPropagation(), e2.ctrlKey || [1, 2].includes(e2.button) || (m(e2), d.value[u.value.axis] = e2.currentTarget[u.value.offset] - (e2[u.value.client] - e2.currentTarget.getBoundingClientRect()[u.value.direction]));
  }, thumbStyle: b, visible: h2};
}});
fl.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "el-scrollbar-fade"}, {default: withCtx(() => [withDirectives(createVNode("div", {ref: "instance", class: ["el-scrollbar__bar", "is-" + e.bar.key], onMousedown: t[2] || (t[2] = (...t2) => e.clickTrackHandler && e.clickTrackHandler(...t2))}, [createVNode("div", {ref: "thumb", class: "el-scrollbar__thumb", style: e.thumbStyle, onMousedown: t[1] || (t[1] = (...t2) => e.clickThumbHandler && e.clickThumbHandler(...t2))}, null, 36)], 34), [[vShow, e.visible]])]), _: 1});
}, fl.__file = "packages/scrollbar/src/bar.vue";
var gl = defineComponent({name: "ElScrollbar", components: {Bar: fl}, props: {height: {type: [String, Number], default: ""}, maxHeight: {type: [String, Number], default: ""}, native: {type: Boolean, default: false}, wrapStyle: {type: [String, Array], default: ""}, wrapClass: {type: [String, Array], default: ""}, viewClass: {type: [String, Array], default: ""}, viewStyle: {type: [String, Array], default: ""}, noresize: Boolean, tag: {type: String, default: "div"}}, emits: ["scroll"], setup(e, {emit: t}) {
  const a = ref("0"), o = ref("0"), s = ref(0), u = ref(0), d = ref(null), c = ref(null), p2 = ref(null);
  provide("scrollbar", d), provide("scrollbar-wrap", c);
  const h2 = () => {
    if (!c.value)
      return;
    const e2 = 100 * c.value.clientHeight / c.value.scrollHeight, t2 = 100 * c.value.clientWidth / c.value.scrollWidth;
    o.value = e2 < 100 ? e2 + "%" : "", a.value = t2 < 100 ? t2 + "%" : "";
  }, v = computed(() => {
    let t2 = e.wrapStyle;
    return _e(t2) ? (t2 = function(e2) {
      const t3 = {};
      for (let l = 0; l < e2.length; l++)
        e2[l] && Ce(t3, e2[l]);
      return t3;
    }(t2), t2.height = et(e.height), t2.maxHeight = et(e.maxHeight)) : Ee(t2) && (t2 += et(e.height) ? `height: ${et(e.height)};` : "", t2 += et(e.maxHeight) ? `max-height: ${et(e.maxHeight)};` : ""), t2;
  });
  return onMounted(() => {
    e.native || nextTick(h2), e.noresize || (pt(p2.value, h2), addEventListener("resize", h2));
  }), onBeforeUnmount(() => {
    e.noresize || (ht(p2.value, h2), removeEventListener("resize", h2));
  }), {moveX: s, moveY: u, sizeWidth: a, sizeHeight: o, style: v, scrollbar: d, wrap: c, resize: p2, update: h2, handleScroll: () => {
    c.value && (u.value = 100 * c.value.scrollTop / c.value.clientHeight, s.value = 100 * c.value.scrollLeft / c.value.clientWidth, t("scroll", {scrollLeft: s.value, scrollTop: u.value}));
  }};
}});
const bl = {ref: "scrollbar", class: "el-scrollbar"};
gl.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("bar");
  return openBlock(), createBlock("div", bl, [createVNode("div", {ref: "wrap", class: [e.wrapClass, "el-scrollbar__wrap", e.native ? "" : "el-scrollbar__wrap--hidden-default"], style: e.style, onScroll: t[1] || (t[1] = (...t2) => e.handleScroll && e.handleScroll(...t2))}, [(openBlock(), createBlock(resolveDynamicComponent(e.tag), {ref: "resize", class: ["el-scrollbar__view", e.viewClass], style: e.viewStyle}, {default: withCtx(() => [renderSlot(e.$slots, "default")]), _: 3}, 8, ["class", "style"]))], 38), e.native ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Fragment, {key: 0}, [createVNode(i, {move: e.moveX, size: e.sizeWidth}, null, 8, ["move", "size"]), createVNode(i, {vertical: "", move: e.moveY, size: e.sizeHeight}, null, 8, ["move", "size"])], 64))], 512);
}, gl.__file = "packages/scrollbar/src/index.vue", gl.install = (e) => {
  e.component(gl.name, gl);
};
const yl = gl;
var kl;
!function(e) {
  e[e.TEXT = 1] = "TEXT", e[e.CLASS = 2] = "CLASS", e[e.STYLE = 4] = "STYLE", e[e.PROPS = 8] = "PROPS", e[e.FULL_PROPS = 16] = "FULL_PROPS", e[e.HYDRATE_EVENTS = 32] = "HYDRATE_EVENTS", e[e.STABLE_FRAGMENT = 64] = "STABLE_FRAGMENT", e[e.KEYED_FRAGMENT = 128] = "KEYED_FRAGMENT", e[e.UNKEYED_FRAGMENT = 256] = "UNKEYED_FRAGMENT", e[e.NEED_PATCH = 512] = "NEED_PATCH", e[e.DYNAMIC_SLOTS = 1024] = "DYNAMIC_SLOTS", e[e.HOISTED = -1] = "HOISTED", e[e.BAIL = -2] = "BAIL";
}(kl || (kl = {}));
const Cl = (e) => e.type === Fragment, xl = (e) => e.type === Comment;
function wl(e, t) {
  if (!xl(e))
    return Cl(e) || ((e2) => e2.type === "template")(e) ? t > 0 ? _l(e.children, t - 1) : void 0 : e;
}
const _l = (e, t = 3) => Array.isArray(e) ? wl(e[0], t) : wl(e, t);
function Sl(e, t, l, a, n) {
  return openBlock(), createBlock(e, t, l, a, n);
}
let El = {};
const Ml = (e) => {
  e.preventDefault(), e.stopPropagation();
}, Tl = () => {
  Pl == null || Pl.doOnModalClick();
};
let Nl, Dl = false;
const Ol = function() {
  if (ye)
    return;
  let e = Pl.modalDom;
  return e ? Dl = true : (Dl = false, e = document.createElement("div"), Pl.modalDom = e, tt(e, "touchmove", Ml), tt(e, "click", Tl)), e;
}, Il = {}, Pl = {modalFade: true, modalDom: void 0, zIndex: Nl, getInstance: function(e) {
  return Il[e];
}, register: function(e, t) {
  e && t && (Il[e] = t);
}, deregister: function(e) {
  e && (Il[e] = null, delete Il[e]);
}, nextZIndex: function() {
  return ++Pl.zIndex;
}, modalStack: [], doOnModalClick: function() {
  const e = Pl.modalStack[Pl.modalStack.length - 1];
  if (!e)
    return;
  const t = Pl.getInstance(e.id);
  t && t.closeOnClickModal.value && t.close();
}, openModal: function(e, t, l, a, n) {
  if (ye)
    return;
  if (!e || t === void 0)
    return;
  this.modalFade = n;
  const o = this.modalStack;
  for (let t2 = 0, l2 = o.length; t2 < l2; t2++) {
    if (o[t2].id === e)
      return;
  }
  const i = Ol();
  if (nt(i, "v-modal"), this.modalFade && !Dl && nt(i, "v-modal-enter"), a) {
    a.trim().split(/\s+/).forEach((e2) => nt(i, e2));
  }
  setTimeout(() => {
    ot(i, "v-modal-enter");
  }, 200), l && l.parentNode && l.parentNode.nodeType !== 11 ? l.parentNode.appendChild(i) : document.body.appendChild(i), t && (i.style.zIndex = String(t)), i.tabIndex = 0, i.style.display = "", this.modalStack.push({id: e, zIndex: t, modalClass: a});
}, closeModal: function(e) {
  const t = this.modalStack, l = Ol();
  if (t.length > 0) {
    const a = t[t.length - 1];
    if (a.id === e) {
      if (a.modalClass) {
        a.modalClass.trim().split(/\s+/).forEach((e2) => ot(l, e2));
      }
      t.pop(), t.length > 0 && (l.style.zIndex = t[t.length - 1].zIndex);
    } else
      for (let l2 = t.length - 1; l2 >= 0; l2--)
        if (t[l2].id === e) {
          t.splice(l2, 1);
          break;
        }
  }
  t.length === 0 && (this.modalFade && nt(l, "v-modal-leave"), setTimeout(() => {
    t.length === 0 && (l.parentNode && l.parentNode.removeChild(l), l.style.display = "none", Pl.modalDom = void 0), ot(l, "v-modal-leave");
  }, 200));
}};
Object.defineProperty(Pl, "zIndex", {configurable: true, get: () => (Nl === void 0 && (Nl = El["zIndex"] || 2e3), Nl), set(e) {
  Nl = e;
}});
function Vl(e, t = []) {
  const {arrow: l, arrowOffset: a, offset: n, gpuAcceleration: o} = e, i = [{name: "offset", options: {offset: [0, n != null ? n : 12]}}, {name: "preventOverflow", options: {padding: {top: 2, bottom: 2, left: 5, right: 5}}}, {name: "flip", options: {padding: 5}}, {name: "computeStyles", options: {gpuAcceleration: o, adaptive: o}}];
  return l && i.push({name: "arrow", options: {element: l, padding: a != null ? a : 5}}), i.push(...t), i;
}
var Bl;
ye || tt(window, "keydown", function(e) {
  if (e.code === Dt.esc) {
    const e2 = function() {
      if (!ye && Pl.modalStack.length > 0) {
        const e3 = Pl.modalStack[Pl.modalStack.length - 1];
        if (!e3)
          return;
        return Pl.getInstance(e3.id);
      }
    }();
    e2 && e2.closeOnPressEscape.value && (e2.handleClose ? e2.handleClose() : e2.handleAction ? e2.handleAction("cancel") : e2.close());
  }
}), function(e) {
  e.DARK = "dark", e.LIGHT = "light";
}(Bl || (Bl = {}));
var Al = {arrowOffset: {type: Number, default: 5}, appendToBody: {type: Boolean, default: true}, autoClose: {type: Number, default: 0}, boundariesPadding: {type: Number, default: 0}, content: {type: String, default: ""}, class: {type: String, default: ""}, style: Object, hideAfter: {type: Number, default: 200}, cutoff: {type: Boolean, default: false}, disabled: {type: Boolean, default: false}, effect: {type: String, default: Bl.DARK}, enterable: {type: Boolean, default: true}, manualMode: {type: Boolean, default: false}, showAfter: {type: Number, default: 0}, offset: {type: Number, default: 12}, placement: {type: String, default: "bottom"}, popperClass: {type: String, default: ""}, pure: {type: Boolean, default: false}, popperOptions: {type: Object, default: () => null}, showArrow: {type: Boolean, default: true}, strategy: {type: String, default: "fixed"}, transition: {type: String, default: "el-fade-in-linear"}, trigger: {type: [String, Array], default: "hover"}, visible: {type: Boolean, default: void 0}, stopPopperMouseEvent: {type: Boolean, default: true}, gpuAcceleration: {type: Boolean, default: true}};
function Ll(e, {emit: t}) {
  const i = ref(null), r = ref(null), s = ref(null), u = "el-popper-" + Re();
  let d = null, c = null, p2 = null, h2 = false;
  const v = () => e.manualMode || e.trigger === "manual", m = ref({zIndex: Pl.nextZIndex()}), f = function(e2, t2) {
    return computed(() => {
      var l;
      return Object.assign(Object.assign({placement: e2.placement}, e2.popperOptions), {modifiers: Vl({arrow: t2.arrow.value, arrowOffset: e2.arrowOffset, offset: e2.offset, gpuAcceleration: e2.gpuAcceleration}, (l = e2.popperOptions) === null || l === void 0 ? void 0 : l.modifiers)});
    });
  }(e, {arrow: i}), g = reactive({visible: !!e.visible}), b = computed({get: () => !e.disabled && (We(e.visible) ? e.visible : g.visible), set(l) {
    v() || (We(e.visible) ? t("update:visible", l) : g.visible = l);
  }});
  function y() {
    e.autoClose > 0 && (p2 = window.setTimeout(() => {
      k();
    }, e.autoClose)), b.value = true;
  }
  function k() {
    b.value = false;
  }
  function C() {
    clearTimeout(c), clearTimeout(p2);
  }
  const x = () => {
    v() || e.disabled || (C(), e.showAfter === 0 ? y() : c = window.setTimeout(() => {
      y();
    }, e.showAfter));
  }, w = () => {
    v() || (C(), e.hideAfter > 0 ? p2 = window.setTimeout(() => {
      _();
    }, e.hideAfter) : _());
  }, _ = () => {
    k(), e.disabled && E(true);
  };
  function S() {
    if (!Je(b))
      return;
    const e2 = Je(r), t2 = Oe(e2).startsWith("HTML") ? e2 : e2.$el;
    d = createPopper(t2, Je(s), Je(f)), d.update();
  }
  function E(e2) {
    !d || Je(b) && !e2 || M();
  }
  function M() {
    var e2;
    (e2 = d == null ? void 0 : d.destroy) === null || e2 === void 0 || e2.call(d), d = null;
  }
  const T = {};
  if (!v()) {
    const t2 = () => {
      Je(b) ? w() : x();
    }, l = (e2) => {
      switch (e2.stopPropagation(), e2.type) {
        case "click":
          h2 ? h2 = false : t2();
          break;
        case "mouseenter":
          x();
          break;
        case "mouseleave":
          w();
          break;
        case "focus":
          h2 = true, x();
          break;
        case "blur":
          h2 = false, w();
      }
    }, a = {click: ["onClick"], hover: ["onMouseenter", "onMouseleave"], focus: ["onFocus", "onBlur"]}, n = (e2) => {
      a[e2].forEach((e3) => {
        T[e3] = l;
      });
    };
    _e(e.trigger) ? Object.values(e.trigger).forEach(n) : n(e.trigger);
  }
  return watch(f, (e2) => {
    d && (d.setOptions(e2), d.update());
  }), watch(b, function(e2) {
    e2 && (m.value.zIndex = Pl.nextZIndex(), S());
  }), {update: function() {
    Je(b) && (d ? d.update() : S());
  }, doDestroy: E, show: x, hide: w, onPopperMouseEnter: function() {
    e.enterable && e.trigger !== "click" && clearTimeout(p2);
  }, onPopperMouseLeave: function() {
    const {trigger: t2} = e;
    Ee(t2) && (t2 === "click" || t2 === "focus") || t2.length === 1 && (t2[0] === "click" || t2[0] === "focus") || w();
  }, onAfterEnter: () => {
    t("after-enter");
  }, onAfterLeave: () => {
    M(), t("after-leave");
  }, onBeforeEnter: () => {
    t("before-enter");
  }, onBeforeLeave: () => {
    t("before-leave");
  }, initializePopper: S, isManualMode: v, arrowRef: i, events: T, popperId: u, popperInstance: d, popperRef: s, popperStyle: m, triggerRef: r, visibility: b};
}
function zl(e, t) {
  const {effect: l, name: a, stopPopperMouseEvent: n, popperClass: o, popperStyle: i, popperRef: r, pure: s, popperId: u, visibility: c, onMouseenter: m, onMouseleave: f, onAfterEnter: g, onAfterLeave: y, onBeforeEnter: k, onBeforeLeave: C} = e, x = [o, "el-popper", "is-" + l, s ? "is-pure" : ""], w = n ? dt : ke;
  return createVNode(Transition, {name: a, onAfterEnter: g, onAfterLeave: y, onBeforeEnter: k, onBeforeLeave: C}, {default: withCtx(() => [withDirectives(createVNode("div", {"aria-hidden": String(!c), class: x, style: i != null ? i : {}, id: u, ref: r != null ? r : "popperRef", role: "tooltip", onMouseenter: m, onMouseleave: f, onClick: dt, onMousedown: w, onMouseup: w}, t, kl.CLASS | kl.STYLE | kl.PROPS | kl.HYDRATE_EVENTS, ["aria-hidden", "onMouseenter", "onMouseleave", "onMousedown", "onMouseup", "onClick", "id"]), [[vShow, c]])])}, kl.PROPS, ["name", "onAfterEnter", "onAfterLeave", "onBeforeEnter", "onBeforeLeave"]);
}
function Fl(e, t) {
  const l = _l(e, 1);
  return l || Le("renderTrigger", "trigger expects single rooted node"), cloneVNode(l, t, true);
}
function $l(e) {
  return e ? (openBlock(), createBlock("div", {ref: "arrowRef", class: "el-popper__arrow", "data-popper-arrow": ""}, null, kl.NEED_PATCH)) : (openBlock(), createBlock(Comment, null, ""));
}
var Rl = defineComponent({name: "ElPopper", props: Al, emits: ["update:visible", "after-enter", "after-leave", "before-enter", "before-leave"], setup(e, t) {
  t.slots.trigger || Le("ElPopper", "Trigger must be provided");
  const l = Ll(e, t), a = () => l.doDestroy(true);
  return onMounted(l.initializePopper), onBeforeUnmount(a), onActivated(l.initializePopper), onDeactivated(a), l;
}, render() {
  var e;
  const {$slots: t, appendToBody: l, class: a, style: n, effect: o, hide: i, onPopperMouseEnter: r, onPopperMouseLeave: s, onAfterEnter: u, onAfterLeave: p2, onBeforeEnter: h2, onBeforeLeave: m, popperClass: f, popperId: b, popperStyle: y, pure: k, showArrow: C, transition: x, visibility: w, stopPopperMouseEvent: _} = this, S = this.isManualMode(), E = $l(C), M = zl({effect: o, name: x, popperClass: f, popperId: b, popperStyle: y, pure: k, stopPopperMouseEvent: _, onMouseenter: r, onMouseleave: s, onAfterEnter: u, onAfterLeave: p2, onBeforeEnter: h2, onBeforeLeave: m, visibility: w}, [renderSlot(t, "default", {}, () => [toDisplayString(this.content)]), E]), N = (e = t.trigger) === null || e === void 0 ? void 0 : e.call(t), D = Object.assign({ariaDescribedby: b, class: a, style: n, ref: "triggerRef"}, this.events), O = S ? Fl(N, D) : withDirectives(Fl(N, D), [[$t, i]]);
  return Sl(Fragment, null, [O, createVNode(Teleport, {to: "body", disabled: !l}, [M], kl.PROPS, ["disabled"])]);
}});
Rl.__file = "packages/popper/src/index.vue", Rl.install = (e) => {
  e.component(Rl.name, Rl);
};
const Hl = Rl;
var Wl = defineComponent({name: "ElAutocomplete", components: {ElPopper: Hl, ElInput: vl, ElScrollbar: yl}, directives: {clickoutside: $t}, inheritAttrs: false, props: {valueKey: {type: String, default: "value"}, modelValue: {type: [String, Number], default: ""}, debounce: {type: Number, default: 300}, placement: {type: String, validator: (e) => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].includes(e), default: "bottom-start"}, fetchSuggestions: {type: Function, default: ke}, popperClass: {type: String, default: ""}, triggerOnFocus: {type: Boolean, default: true}, selectWhenUnmatched: {type: Boolean, default: false}, hideLoading: {type: Boolean, default: false}, popperAppendToBody: {type: Boolean, default: true}, highlightFirstItem: {type: Boolean, default: false}}, emits: [qt, "input", "change", "focus", "blur", "clear", "select"], setup(e, t) {
  const a = St(), r = ref([]), s = ref(-1), u = ref(""), d = ref(false), c = ref(false), p2 = ref(false), h2 = ref(null), v = ref(null), m = ref(null), f = computed(() => "el-autocomplete-" + Re()), g = computed(() => (_e(r.value) && r.value.length > 0 || p2.value) && d.value), b = computed(() => !e.hideLoading && p2.value), y = () => {
    nextTick(m.value.update);
  };
  watch(g, () => {
    u.value = h2.value.$el.offsetWidth + "px";
  }), onMounted(() => {
    h2.value.inputOrTextarea.setAttribute("role", "textbox"), h2.value.inputOrTextarea.setAttribute("aria-autocomplete", "list"), h2.value.inputOrTextarea.setAttribute("aria-controls", "id"), h2.value.inputOrTextarea.setAttribute("aria-activedescendant", `${f.value}-item-${s.value}`);
    const e2 = v.value.querySelector(".el-autocomplete-suggestion__list");
    e2.setAttribute("role", "listbox"), e2.setAttribute("id", f.value);
  }), onUpdated(y);
  const k = (t2) => {
    c.value || (p2.value = true, y(), e.fetchSuggestions(t2, (t3) => {
      p2.value = false, c.value || (_e(t3) ? (r.value = t3, s.value = e.highlightFirstItem ? 0 : -1) : Le("ElAutocomplete", "autocomplete suggestions must be an array"));
    }));
  }, C = debounce_1(k, e.debounce), x = (l) => {
    t.emit("input", l[e.valueKey]), t.emit(qt, l[e.valueKey]), t.emit("select", l), nextTick(() => {
      r.value = [], s.value = -1;
    });
  };
  return {attrs: a, suggestions: r, highlightedIndex: s, dropdownWidth: u, activated: d, suggestionDisabled: c, loading: p2, inputRef: h2, regionRef: v, popper: m, id: f, suggestionVisible: g, suggestionLoading: b, getData: k, handleInput: (l) => {
    if (t.emit("input", l), t.emit(qt, l), c.value = false, !e.triggerOnFocus && !l)
      return c.value = true, void (r.value = []);
    C(l);
  }, handleChange: (e2) => {
    t.emit("change", e2);
  }, handleFocus: (l) => {
    d.value = true, t.emit("focus", l), e.triggerOnFocus && C(e.modelValue);
  }, handleBlur: (e2) => {
    t.emit("blur", e2);
  }, handleClear: () => {
    d.value = false, t.emit(qt, ""), t.emit("clear");
  }, handleKeyEnter: () => {
    g.value && s.value >= 0 && s.value < r.value.length ? x(r.value[s.value]) : e.selectWhenUnmatched && (t.emit("select", {value: e.modelValue}), nextTick(() => {
      r.value = [], s.value = -1;
    }));
  }, close: () => {
    d.value = false;
  }, focus: () => {
    h2.value.focus();
  }, select: x, highlight: (e2) => {
    if (!g.value || p2.value)
      return;
    if (e2 < 0)
      return void (s.value = -1);
    e2 >= r.value.length && (e2 = r.value.length - 1);
    const t2 = v.value.querySelector(".el-autocomplete-suggestion__wrap"), l = t2.querySelectorAll(".el-autocomplete-suggestion__list li")[e2], a2 = t2.scrollTop, n = l.offsetTop;
    n + l.scrollHeight > a2 + t2.clientHeight && (t2.scrollTop += l.scrollHeight), n < a2 && (t2.scrollTop -= l.scrollHeight), s.value = e2, h2.value.inputOrTextarea.setAttribute("aria-activedescendant", `${f.value}-item-${s.value}`);
  }};
}});
const jl = {key: 0}, Kl = createVNode("i", {class: "el-icon-loading"}, null, -1);
Wl.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("el-scrollbar"), p2 = resolveComponent("el-popper"), m = resolveDirective("clickoutside");
  return openBlock(), createBlock(p2, {ref: "popper", visible: e.suggestionVisible, "onUpdate:visible": t[3] || (t[3] = (t2) => e.suggestionVisible = t2), placement: e.placement, "popper-class": "el-autocomplete__popper " + e.popperClass, "append-to-body": e.popperAppendToBody, pure: "", "manual-mode": "", effect: "light", trigger: "click", transition: "el-zoom-in-top", "gpu-acceleration": false}, {trigger: withCtx(() => [withDirectives(createVNode("div", {class: ["el-autocomplete", e.$attrs.class], style: e.$attrs.style, role: "combobox", "aria-haspopup": "listbox", "aria-expanded": e.suggestionVisible, "aria-owns": e.id}, [createVNode(i, mergeProps({ref: "inputRef"}, e.attrs, {"model-value": e.modelValue, onInput: e.handleInput, onChange: e.handleChange, onFocus: e.handleFocus, onBlur: e.handleBlur, onClear: e.handleClear, onKeydown: [t[1] || (t[1] = withKeys(withModifiers((t2) => e.highlight(e.highlightedIndex - 1), ["prevent"]), ["up"])), t[2] || (t[2] = withKeys(withModifiers((t2) => e.highlight(e.highlightedIndex + 1), ["prevent"]), ["down"])), withKeys(e.handleKeyEnter, ["enter"]), withKeys(e.close, ["tab"])]}), createSlots({_: 2}, [e.$slots.prepend ? {name: "prepend", fn: withCtx(() => [renderSlot(e.$slots, "prepend")])} : void 0, e.$slots.append ? {name: "append", fn: withCtx(() => [renderSlot(e.$slots, "append")])} : void 0, e.$slots.prefix ? {name: "prefix", fn: withCtx(() => [renderSlot(e.$slots, "prefix")])} : void 0, e.$slots.suffix ? {name: "suffix", fn: withCtx(() => [renderSlot(e.$slots, "suffix")])} : void 0]), 1040, ["model-value", "onInput", "onChange", "onFocus", "onBlur", "onClear", "onKeydown"])], 14, ["aria-expanded", "aria-owns"]), [[m, e.close]])]), default: withCtx(() => [createVNode("div", {ref: "regionRef", class: ["el-autocomplete-suggestion", e.suggestionLoading && "is-loading"], style: {width: e.dropdownWidth, outline: "none"}, role: "region"}, [createVNode(r, {tag: "ul", "wrap-class": "el-autocomplete-suggestion__wrap", "view-class": "el-autocomplete-suggestion__list"}, {default: withCtx(() => [e.suggestionLoading ? (openBlock(), createBlock("li", jl, [Kl])) : (openBlock(true), createBlock(Fragment, {key: 1}, renderList(e.suggestions, (t2, l2) => (openBlock(), createBlock("li", {id: `${e.id}-item-${l2}`, key: l2, class: {highlighted: e.highlightedIndex === l2}, role: "option", "aria-selected": e.highlightedIndex === l2, onClick: (l3) => e.select(t2)}, [renderSlot(e.$slots, "default", {item: t2}, () => [createTextVNode(toDisplayString(t2[e.valueKey]), 1)])], 10, ["id", "aria-selected", "onClick"]))), 128))]), _: 3})], 6)]), _: 1}, 8, ["visible", "placement", "popper-class", "append-to-body"]);
}, Wl.__file = "packages/autocomplete/src/index.vue", Wl.install = (e) => {
  e.component(Wl.name, Wl);
};
const Yl = Wl;
var ql = defineComponent({name: "ElAvatar", props: {size: {type: [Number, String], validator: (e) => typeof e == "string" ? ["large", "medium", "small"].includes(e) : typeof e == "number", default: "large"}, shape: {type: String, default: "circle", validator: (e) => ["circle", "square"].includes(e)}, icon: String, src: {type: String, default: ""}, alt: String, srcSet: String, fit: {type: String, default: "cover"}}, emits: ["error"], setup(e, {emit: t}) {
  const a = ref(false), i = toRef(e, "src");
  watch(i, () => {
    a.value = false;
  });
  const r = computed(() => {
    const {size: t2, icon: l, shape: a2} = e;
    let n = ["el-avatar"];
    return t2 && typeof t2 == "string" && n.push("el-avatar--" + t2), l && n.push("el-avatar--icon"), a2 && n.push("el-avatar--" + a2), n;
  }), s = computed(() => {
    const {size: t2} = e;
    return typeof t2 == "number" ? {height: t2 + "px", width: t2 + "px", lineHeight: t2 + "px"} : {};
  }), u = computed(() => ({objectFit: e.fit}));
  return {hasLoadError: a, avatarClass: r, sizeStyle: s, handleError: function(e2) {
    a.value = true, t("error", e2);
  }, fitStyle: u};
}});
ql.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("span", {class: e.avatarClass, style: e.sizeStyle}, [!e.src && !e.srcSet || e.hasLoadError ? e.icon ? (openBlock(), createBlock("i", {key: 1, class: e.icon}, null, 2)) : renderSlot(e.$slots, "default", {key: 2}) : (openBlock(), createBlock("img", {key: 0, src: e.src, alt: e.alt, srcset: e.srcSet, style: e.fitStyle, onError: t[1] || (t[1] = (...t2) => e.handleError && e.handleError(...t2))}, null, 44, ["src", "alt", "srcset"]))], 6);
}, ql.__file = "packages/avatar/src/index.vue", ql.install = (e) => {
  e.component(ql.name, ql);
};
const Ul = ql, Gl = (e) => Math.pow(e, 3);
var Xl = defineComponent({name: "ElBacktop", props: {visibilityHeight: {type: Number, default: 200}, target: {type: String, default: ""}, right: {type: Number, default: 40}, bottom: {type: Number, default: 40}}, emits: ["click"], setup(e, t) {
  const a = ref(null), o = ref(null), s = ref(false), u = computed(() => e.bottom + "px"), d = computed(() => e.right + "px"), c = () => {
    const e2 = Date.now(), t2 = a.value.scrollTop, l = window.requestAnimationFrame || ((e3) => setTimeout(e3, 16)), n = () => {
      const o2 = (Date.now() - e2) / 500;
      var i;
      o2 < 1 ? (a.value.scrollTop = t2 * (1 - ((i = o2) < 0.5 ? Gl(2 * i) / 2 : 1 - Gl(2 * (1 - i)) / 2)), l(n)) : a.value.scrollTop = 0;
    };
    l(n);
  }, p2 = throttle_1(() => {
    s.value = a.value.scrollTop >= e.visibilityHeight;
  }, 300);
  return onMounted(() => {
    if (o.value = document, a.value = document.documentElement, e.target) {
      if (a.value = document.querySelector(e.target), !a.value)
        throw new Error("target is not existed: " + e.target);
      o.value = a.value;
    }
    tt(o.value, "scroll", p2);
  }), onBeforeUnmount(() => {
    lt(o.value, "scroll", p2);
  }), {el: a, container: o, visible: s, styleBottom: u, styleRight: d, handleClick: (e2) => {
    c(), t.emit("click", e2);
  }};
}});
const Zl = createVNode("i", {class: "el-icon-caret-top"}, null, -1);
Xl.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "el-fade-in"}, {default: withCtx(() => [e.visible ? (openBlock(), createBlock("div", {key: 0, style: {right: e.styleRight, bottom: e.styleBottom}, class: "el-backtop", onClick: t[1] || (t[1] = withModifiers((...t2) => e.handleClick && e.handleClick(...t2), ["stop"]))}, [renderSlot(e.$slots, "default", {}, () => [Zl])], 4)) : createCommentVNode("v-if", true)]), _: 3});
}, Xl.__file = "packages/backtop/src/index.vue", Xl.install = (e) => {
  e.component(Xl.name, Xl);
};
const Ql = Xl;
var Jl = defineComponent({name: "ElBadge", props: {value: {type: [String, Number], default: ""}, max: {type: Number, default: 99}, isDot: Boolean, hidden: Boolean, type: {type: String, default: "primary", validator: (e) => ["primary", "success", "warning", "info", "danger"].includes(e)}}, setup: (e) => ({content: computed(() => {
  if (!e.isDot)
    return typeof e.value == "number" && typeof e.max == "number" && e.max < e.value ? e.max + "+" : e.value;
})})});
const ea = {class: "el-badge"};
Jl.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", ea, [renderSlot(e.$slots, "default"), createVNode(Transition, {name: "el-zoom-in-center"}, {default: withCtx(() => [withDirectives(createVNode("sup", {class: ["el-badge__content", ["el-badge__content--" + e.type, {"is-fixed": e.$slots.default, "is-dot": e.isDot}]], textContent: toDisplayString(e.content)}, null, 10, ["textContent"]), [[vShow, !e.hidden && (e.content || e.content === 0 || e.isDot)]])]), _: 1})]);
}, Jl.__file = "packages/badge/src/index.vue", Jl.install = (e) => {
  e.component(Jl.name, Jl);
};
const ta = Jl;
var la = defineComponent({name: "ElBreadcrumb", props: {separator: {type: String, default: "/"}, separatorClass: {type: String, default: ""}}, setup(e) {
  const t = ref(null);
  return provide("breadcrumb", e), onMounted(() => {
    const e2 = t.value.querySelectorAll(".el-breadcrumb__item");
    e2.length && e2[e2.length - 1].setAttribute("aria-current", "page");
  }), {breadcrumb: t};
}});
const aa = {ref: "breadcrumb", class: "el-breadcrumb", "aria-label": "Breadcrumb", role: "navigation"};
la.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", aa, [renderSlot(e.$slots, "default")], 512);
}, la.__file = "packages/breadcrumb/src/index.vue", la.install = (e) => {
  e.component(la.name, la);
};
const na = la;
var oa = defineComponent({name: "ElBreadcrumbItem", props: {to: {type: [String, Object], default: ""}, replace: {type: Boolean, default: false}}, setup(t) {
  const a = ref(null), n = inject("breadcrumb"), o = getCurrentInstance().appContext.config.globalProperties.$router;
  return onMounted(() => {
    a.value.setAttribute("role", "link"), a.value.addEventListener("click", () => {
      t.to && o && (t.replace ? o.replace(t.to) : o.push(t.to));
    });
  }), {link: a, separator: n == null ? void 0 : n.separator, separatorClass: n == null ? void 0 : n.separatorClass};
}});
const ia = {class: "el-breadcrumb__item"}, ra = {key: 1, class: "el-breadcrumb__separator", role: "presentation"};
oa.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("span", ia, [createVNode("span", {ref: "link", class: ["el-breadcrumb__inner", e.to ? "is-link" : ""], role: "link"}, [renderSlot(e.$slots, "default")], 2), e.separatorClass ? (openBlock(), createBlock("i", {key: 0, class: ["el-breadcrumb__separator", e.separatorClass]}, null, 2)) : (openBlock(), createBlock("span", ra, toDisplayString(e.separator), 1))]);
}, oa.__file = "packages/breadcrumb/src/item.vue", oa.install = (e) => {
  e.component(oa.name, oa);
};
const sa = oa;
var ua = defineComponent({name: "ElButton", props: {type: {type: String, default: "default", validator: (e) => ["default", "primary", "success", "warning", "info", "danger", "text"].includes(e)}, size: {type: String, validator: Xt}, icon: {type: String, default: ""}, nativeType: {type: String, default: "button", validator: (e) => ["button", "submit", "reset"].includes(e)}, loading: Boolean, disabled: Boolean, plain: Boolean, autofocus: Boolean, round: Boolean, circle: Boolean}, emits: ["click"], setup(e, {emit: t}) {
  const l = Ue(), a = inject("elForm", {}), o = inject("elFormItem", {});
  return {buttonSize: computed(() => e.size || o.size || l.size), buttonDisabled: computed(() => e.disabled || a.disabled), handleClick: (e2) => {
    t("click", e2);
  }};
}});
const da = {key: 0, class: "el-icon-loading"}, ca = {key: 2};
ua.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("button", {class: ["el-button", e.type ? "el-button--" + e.type : "", e.buttonSize ? "el-button--" + e.buttonSize : "", {"is-disabled": e.buttonDisabled, "is-loading": e.loading, "is-plain": e.plain, "is-round": e.round, "is-circle": e.circle}], disabled: e.buttonDisabled || e.loading, autofocus: e.autofocus, type: e.nativeType, onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, [e.loading ? (openBlock(), createBlock("i", da)) : createCommentVNode("v-if", true), e.icon && !e.loading ? (openBlock(), createBlock("i", {key: 1, class: e.icon}, null, 2)) : createCommentVNode("v-if", true), e.$slots.default ? (openBlock(), createBlock("span", ca, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true)], 10, ["disabled", "autofocus", "type"]);
}, ua.__file = "packages/button/src/button.vue", ua.install = (e) => {
  e.component(ua.name, ua);
};
const pa = ua;
var ha = defineComponent({name: "ElButtonGroup"});
const va = {class: "el-button-group"};
ha.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", va, [renderSlot(e.$slots, "default")]);
}, ha.__file = "packages/button/src/button-group.vue", ha.install = (e) => {
  e.component(ha.name, ha);
};
const ma = ha;
let fa = {name: "en", el: {colorpicker: {confirm: "OK", clear: "Clear"}, datepicker: {now: "Now", today: "Today", cancel: "Cancel", clear: "Clear", confirm: "OK", selectDate: "Select date", selectTime: "Select time", startDate: "Start Date", startTime: "Start Time", endDate: "End Date", endTime: "End Time", prevYear: "Previous Year", nextYear: "Next Year", prevMonth: "Previous Month", nextMonth: "Next Month", year: "", month1: "January", month2: "February", month3: "March", month4: "April", month5: "May", month6: "June", month7: "July", month8: "August", month9: "September", month10: "October", month11: "November", month12: "December", week: "week", weeks: {sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat"}, months: {jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun", jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec"}}, select: {loading: "Loading", noMatch: "No matching data", noData: "No data", placeholder: "Select"}, cascader: {noMatch: "No matching data", loading: "Loading", placeholder: "Select", noData: "No data"}, pagination: {goto: "Go to", pagesize: "/page", total: "Total {total}", pageClassifier: ""}, messagebox: {title: "Message", confirm: "OK", cancel: "Cancel", error: "Illegal input"}, upload: {deleteTip: "press delete to remove", delete: "Delete", preview: "Preview", continue: "Continue"}, table: {emptyText: "No Data", confirmFilter: "Confirm", resetFilter: "Reset", clearFilter: "All", sumText: "Sum"}, tree: {emptyText: "No Data"}, transfer: {noMatch: "No matching data", noData: "No data", titles: ["List 1", "List 2"], filterPlaceholder: "Enter keyword", noCheckedFormat: "{total} items", hasCheckedFormat: "{checked}/{total} checked"}, image: {error: "FAILED"}, pageHeader: {title: "Back"}, popconfirm: {confirmButtonText: "Yes", cancelButtonText: "No"}}}, ga = null;
function ba(e, t) {
  return e && t ? e.replace(/\{(\w+)\}/g, (e2, l) => t[l]) : e;
}
const ya = (...e) => {
  if (ga)
    return ga(...e);
  const [t, l] = e;
  let a;
  const n = t.split(".");
  let o = fa;
  for (let e2 = 0, t2 = n.length; e2 < t2; e2++) {
    if (a = o[n[e2]], e2 === t2 - 1)
      return ba(a, l);
    if (!a)
      return "";
    o = a;
  }
  return "";
}, ka = {date: "YYYY-MM-DD", week: "gggg[w]ww", year: "YYYY", month: "YYYY-MM", datetime: "YYYY-MM-DD HH:mm:ss", monthrange: "YYYY-MM", daterange: "YYYY-MM-DD", datetimerange: "YYYY-MM-DD HH:mm:ss"}, Ca = {name: {type: [Array, String], default: ""}, popperClass: {type: String, default: ""}, format: {type: String}, type: {type: String, default: ""}, clearable: {type: Boolean, default: true}, clearIcon: {type: String, default: "el-icon-circle-close"}, editable: {type: Boolean, default: true}, prefixIcon: {type: String, default: ""}, size: {type: String, validator: Xt}, readonly: {type: Boolean, default: false}, disabled: {type: Boolean, default: false}, placeholder: {type: String, default: ""}, popperOptions: {type: Object, default: () => ({})}, modelValue: {type: [Date, Array, String], default: ""}, rangeSeparator: {type: String, default: "-"}, startPlaceholder: String, endPlaceholder: String, defaultValue: {type: [Date, Array]}, defaultTime: {type: [Date, Array]}, isRange: {type: Boolean, default: false}, disabledHours: {type: Function}, disabledMinutes: {type: Function}, disabledSeconds: {type: Function}, disabledDate: {type: Function}, cellClassName: {type: Function}, shortcuts: {type: Array, default: () => []}, arrowControl: {type: Boolean, default: false}, validateEvent: {type: Boolean, default: true}, unlinkPanels: Boolean}, xa = function(e, t) {
  const l = e instanceof Date, a = t instanceof Date;
  return l && a ? e.getTime() === t.getTime() : !l && !a && e === t;
}, wa = function(e, t) {
  const l = e instanceof Array, a = t instanceof Array;
  return l && a ? e.length === t.length && e.every((e2, l2) => xa(e2, t[l2])) : !l && !a && xa(e, t);
};
var _a = defineComponent({name: "Picker", components: {ElInput: vl, ElPopper: Hl}, directives: {clickoutside: $t}, props: Ca, emits: ["update:modelValue", "change", "focus", "blur"], setup(e, t) {
  const a = Ue(), i = inject("elForm", {}), r = inject("elFormItem", {}), s = inject("ElPopperOptions", {}), u = ref(null), d = ref(false), c = ref(false), p2 = ref(null);
  watch(d, (l) => {
    var a2;
    l ? p2.value = e.modelValue : (O.value = null, nextTick(() => {
      h2(e.modelValue);
    }), t.emit("blur"), P(), e.validateEvent && ((a2 = r.formItemMitt) === null || a2 === void 0 || a2.emit("el.form.blur")));
  });
  const h2 = (l, a2) => {
    var n;
    !a2 && wa(l, p2.value) || (t.emit("change", l), e.validateEvent && ((n = r.formItemMitt) === null || n === void 0 || n.emit("el.form.change", l)));
  }, v = (l) => {
    wa(e.modelValue, l) || t.emit("update:modelValue", l);
  }, m = computed(() => {
    if (u.value.triggerRef) {
      const e2 = T.value ? u.value.triggerRef : u.value.triggerRef.$el;
      return [].slice.call(e2.querySelectorAll("input"));
    }
    return [];
  }), f = computed(() => e.disabled || i.disabled), g = computed(() => {
    let t2;
    return M.value ? L.value.getDefaultValue && (t2 = L.value.getDefaultValue()) : t2 = Array.isArray(e.modelValue) ? e.modelValue.map((e2) => ie(e2)) : ie(e.modelValue), L.value.getRangeAvaliableTime && (t2 = L.value.getRangeAvaliableTime(t2)), t2;
  }), b = computed(() => {
    if (!L.value.panelReady)
      return;
    const e2 = B(g.value);
    return Array.isArray(O.value) ? [O.value[0] || e2 && e2[0] || "", O.value[1] || e2 && e2[1] || ""] : O.value !== null ? O.value : !k.value && M.value || !d.value && M.value ? void 0 : e2 ? C.value ? e2.join(", ") : e2 : "";
  }), y = computed(() => e.type.indexOf("time") !== -1), k = computed(() => e.type.indexOf("time") === 0), C = computed(() => e.type === "dates"), x = computed(() => e.prefixIcon || (y.value ? "el-icon-time" : "el-icon-date")), _ = ref(false), M = computed(() => !e.modelValue || Array.isArray(e.modelValue) && !e.modelValue.length), T = computed(() => e.type.indexOf("range") > -1), N = computed(() => e.size || r.size || a.size), D = computed(() => {
    var e2;
    return (e2 = u.value) === null || e2 === void 0 ? void 0 : e2.popperRef;
  }), O = ref(null), I = () => {
    if (O.value) {
      const e2 = V(b.value);
      e2 && A(e2) && (v(Array.isArray(e2) ? e2.map((e3) => e3.toDate()) : e2.toDate()), O.value = null);
    }
    O.value === "" && (v(null), h2(null), O.value = null);
  }, P = () => {
    m.value.forEach((e2) => e2.blur());
  }, V = (e2) => e2 ? L.value.parseUserInput(e2) : null, B = (e2) => e2 ? L.value.formatToString(e2) : null, A = (e2) => L.value.isValidValue(e2), L = ref({});
  return provide("EP_PICKER_BASE", {props: e}), {elPopperOptions: s, isDatesPicker: C, handleEndChange: () => {
    const e2 = V(O.value && O.value[1]);
    if (e2 && e2.isValid()) {
      O.value = [b.value[0], B(e2)];
      const t2 = [g.value && g.value[0], e2];
      A(t2) && (v(t2), O.value = null);
    }
  }, handleStartChange: () => {
    const e2 = V(O.value && O.value[0]);
    if (e2 && e2.isValid()) {
      O.value = [B(e2), b.value[1]];
      const t2 = [e2, g.value && g.value[1]];
      A(t2) && (v(t2), O.value = null);
    }
  }, handleStartInput: (e2) => {
    O.value ? O.value = [e2.target.value, O.value[1]] : O.value = [e2.target.value, null];
  }, handleEndInput: (e2) => {
    O.value ? O.value = [O.value[0], e2.target.value] : O.value = [null, e2.target.value];
  }, onUserInput: (e2) => {
    O.value = e2;
  }, handleChange: I, handleKeydown: (e2) => {
    const t2 = e2.code;
    return t2 === Dt.esc ? (d.value = false, void e2.stopPropagation()) : t2 !== Dt.tab ? t2 === Dt.enter ? ((O.value === "" || A(V(b.value))) && (I(), d.value = false), void e2.stopPropagation()) : void (O.value ? e2.stopPropagation() : L.value.handleKeydown && L.value.handleKeydown(e2)) : void (T.value ? setTimeout(() => {
      m.value.indexOf(document.activeElement) === -1 && (d.value = false, P());
    }, 0) : (I(), d.value = false, e2.stopPropagation()));
  }, popperPaneRef: D, onClickOutside: () => {
    d.value && (d.value = false);
  }, pickerSize: N, isRangeInput: T, onMouseLeave: () => {
    _.value = false;
  }, onMouseEnter: () => {
    e.readonly || f.value || !M.value && e.clearable && (_.value = true);
  }, onClearIconClick: (t2) => {
    e.readonly || f.value || _.value && (t2.stopPropagation(), v(null), h2(null, true), _.value = false, d.value = false, L.value.handleClear && L.value.handleClear());
  }, showClose: _, triggerClass: x, onPick: (e2 = "", t2 = false) => {
    let l;
    d.value = t2, l = Array.isArray(e2) ? e2.map((e3) => e3.toDate()) : e2 ? e2.toDate() : e2, O.value = null, v(l);
  }, handleFocus: (l) => {
    e.readonly || f.value || (d.value = true, t.emit("focus", l));
  }, pickerVisible: d, pickerActualVisible: c, displayValue: b, parsedValue: g, setSelectionRange: (e2, t2, l) => {
    const a2 = m.value;
    a2.length && (l && l !== "min" ? l === "max" && (a2[1].setSelectionRange(e2, t2), a2[1].focus()) : (a2[0].setSelectionRange(e2, t2), a2[0].focus()));
  }, refPopper: u, pickerDisabled: f, onSetPickerOption: (e2) => {
    L.value[e2[0]] = e2[1], L.value.panelReady = true;
  }};
}});
const Sa = {class: "el-range-separator"};
_a.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("el-popper"), p2 = resolveDirective("clickoutside");
  return openBlock(), createBlock(r, mergeProps({ref: "refPopper", visible: e.pickerVisible, "onUpdate:visible": t[18] || (t[18] = (t2) => e.pickerVisible = t2), "manual-mode": "", effect: "light", pure: "", trigger: "click"}, e.$attrs, {"popper-class": "el-picker__popper " + e.popperClass, "popper-options": e.elPopperOptions, transition: "el-zoom-in-top", "gpu-acceleration": false, "stop-popper-mouse-event": false, "append-to-body": "", onBeforeEnter: t[19] || (t[19] = (t2) => e.pickerActualVisible = true), onAfterLeave: t[20] || (t[20] = (t2) => e.pickerActualVisible = false)}), {trigger: withCtx(() => [e.isRangeInput ? withDirectives((openBlock(), createBlock("div", {key: 1, class: ["el-date-editor el-range-editor el-input__inner", ["el-date-editor--" + e.type, e.pickerSize ? "el-range-editor--" + e.pickerSize : "", e.pickerDisabled ? "is-disabled" : "", e.pickerVisible ? "is-active" : ""]], onClick: t[10] || (t[10] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onMouseenter: t[11] || (t[11] = (...t2) => e.onMouseEnter && e.onMouseEnter(...t2)), onMouseleave: t[12] || (t[12] = (...t2) => e.onMouseLeave && e.onMouseLeave(...t2)), onKeydown: t[13] || (t[13] = (...t2) => e.handleKeydown && e.handleKeydown(...t2))}, [createVNode("i", {class: ["el-input__icon", "el-range__icon", e.triggerClass]}, null, 2), createVNode("input", {autocomplete: "off", name: e.name && e.name[0], placeholder: e.startPlaceholder, value: e.displayValue && e.displayValue[0], disabled: e.pickerDisabled, readonly: !e.editable || e.readonly, class: "el-range-input", onInput: t[3] || (t[3] = (...t2) => e.handleStartInput && e.handleStartInput(...t2)), onChange: t[4] || (t[4] = (...t2) => e.handleStartChange && e.handleStartChange(...t2)), onFocus: t[5] || (t[5] = (...t2) => e.handleFocus && e.handleFocus(...t2))}, null, 40, ["name", "placeholder", "value", "disabled", "readonly"]), renderSlot(e.$slots, "range-separator", {}, () => [createVNode("span", Sa, toDisplayString(e.rangeSeparator), 1)]), createVNode("input", {autocomplete: "off", name: e.name && e.name[1], placeholder: e.endPlaceholder, value: e.displayValue && e.displayValue[1], disabled: e.pickerDisabled, readonly: !e.editable || e.readonly, class: "el-range-input", onFocus: t[6] || (t[6] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onInput: t[7] || (t[7] = (...t2) => e.handleEndInput && e.handleEndInput(...t2)), onChange: t[8] || (t[8] = (...t2) => e.handleEndChange && e.handleEndChange(...t2))}, null, 40, ["name", "placeholder", "value", "disabled", "readonly"]), createVNode("i", {class: [[e.showClose ? "" + e.clearIcon : ""], "el-input__icon el-range__close-icon"], onClick: t[9] || (t[9] = (...t2) => e.onClearIconClick && e.onClearIconClick(...t2))}, null, 2)], 34)), [[p2, e.onClickOutside, e.popperPaneRef]]) : withDirectives((openBlock(), createBlock(i, {key: 0, "model-value": e.displayValue, name: e.name, size: e.pickerSize, disabled: e.pickerDisabled, placeholder: e.placeholder, class: ["el-date-editor", "el-date-editor--" + e.type], readonly: !e.editable || e.readonly || e.isDatesPicker || e.type === "week", onInput: e.onUserInput, onFocus: e.handleFocus, onKeydown: e.handleKeydown, onChange: e.handleChange, onMouseenter: e.onMouseEnter, onMouseleave: e.onMouseLeave}, {prefix: withCtx(() => [createVNode("i", {class: ["el-input__icon", e.triggerClass], onClick: t[1] || (t[1] = (...t2) => e.handleFocus && e.handleFocus(...t2))}, null, 2)]), suffix: withCtx(() => [createVNode("i", {class: ["el-input__icon", [e.showClose ? "" + e.clearIcon : ""]], onClick: t[2] || (t[2] = (...t2) => e.onClearIconClick && e.onClearIconClick(...t2))}, null, 2)]), _: 1}, 8, ["model-value", "name", "size", "disabled", "placeholder", "class", "readonly", "onInput", "onFocus", "onKeydown", "onChange", "onMouseenter", "onMouseleave"])), [[p2, e.onClickOutside, e.popperPaneRef]])]), default: withCtx(() => [renderSlot(e.$slots, "default", {visible: e.pickerVisible, actualVisible: e.pickerActualVisible, parsedValue: e.parsedValue, format: e.format, unlinkPanels: e.unlinkPanels, type: e.type, defaultValue: e.defaultValue, onPick: t[14] || (t[14] = (...t2) => e.onPick && e.onPick(...t2)), onSelectRange: t[15] || (t[15] = (...t2) => e.setSelectionRange && e.setSelectionRange(...t2)), onSetPickerOption: t[16] || (t[16] = (...t2) => e.onSetPickerOption && e.onSetPickerOption(...t2)), onMousedown: t[17] || (t[17] = withModifiers(() => {
  }, ["stop"]))})]), _: 1}, 16, ["visible", "popper-class", "popper-options"]);
}, _a.__file = "packages/time-picker/src/common/picker.vue";
const Ea = (e, t, l) => {
  const a = [], n = t && l();
  for (let t2 = 0; t2 < e; t2++)
    a[t2] = !!n && n.includes(t2);
  return a;
}, Ma = (e) => e.map((e2, t) => e2 || t).filter((e2) => e2 !== true), Ta = (e, t, l) => ({getHoursList: (t2, l2) => Ea(24, e, () => e(t2, l2)), getMinutesList: (e2, l2, a) => Ea(60, t, () => t(e2, l2, a)), getSecondsList: (e2, t2, a, n) => Ea(60, l, () => l(e2, t2, a, n))}), Na = (e, t, l) => {
  const {getHoursList: a, getMinutesList: n, getSecondsList: o} = Ta(e, t, l);
  return {getAvaliableHours: (e2, t2) => Ma(a(e2, t2)), getAvaliableMinutes: (e2, t2, l2) => Ma(n(e2, t2, l2)), getAvaliableSeconds: (e2, t2, l2, a2) => Ma(o(e2, t2, l2, a2))};
}, Da = (e) => {
  const t = ref(e.parsedValue);
  return watch(() => e.visible, (l) => {
    l || (t.value = e.parsedValue);
  }), t;
};
var Oa = defineComponent({directives: {repeatClick: Rt}, components: {ElScrollbar: yl}, props: {role: {type: String, required: true}, spinnerDate: {type: Object, required: true}, showSeconds: {type: Boolean, default: true}, arrowControl: Boolean, amPmMode: {type: String, default: ""}, disabledHours: {type: Function}, disabledMinutes: {type: Function}, disabledSeconds: {type: Function}}, emits: ["change", "select-range", "set-option"], setup(e, t) {
  let a = false;
  const r = debounce_1((e2) => {
    a = false, T(e2);
  }, 200), s = ref(null), u = ref(null), d = ref(null), c = ref(null), p2 = {hours: u, minutes: d, seconds: c}, h2 = computed(() => {
    const t2 = ["hours", "minutes", "seconds"];
    return e.showSeconds ? t2 : t2.slice(0, 2);
  }), v = computed(() => e.spinnerDate.hour()), m = computed(() => e.spinnerDate.minute()), f = computed(() => e.spinnerDate.second()), g = computed(() => ({hours: v, minutes: m, seconds: f})), b = computed(() => A(e.role)), y = computed(() => L(v.value, e.role)), k = computed(() => z(v.value, m.value, e.role)), C = computed(() => ({hours: b, minutes: y, seconds: k})), x = computed(() => {
    const e2 = v.value;
    return [e2 > 0 ? e2 - 1 : void 0, e2, e2 < 23 ? e2 + 1 : void 0];
  }), _ = computed(() => {
    const e2 = m.value;
    return [e2 > 0 ? e2 - 1 : void 0, e2, e2 < 59 ? e2 + 1 : void 0];
  }), S = computed(() => {
    const e2 = f.value;
    return [e2 > 0 ? e2 - 1 : void 0, e2, e2 < 59 ? e2 + 1 : void 0];
  }), E = computed(() => ({hours: x, minutes: _, seconds: S})), M = (e2) => {
    e2 === "hours" ? t.emit("select-range", 0, 2) : e2 === "minutes" ? t.emit("select-range", 3, 5) : e2 === "seconds" && t.emit("select-range", 6, 8), s.value = e2;
  }, T = (e2) => {
    D(e2, g.value[e2].value);
  }, N = () => {
    T("hours"), T("minutes"), T("seconds");
  }, D = (t2, l) => {
    if (e.arrowControl)
      return;
    const a2 = p2[t2];
    a2.value && (a2.value.$el.querySelector(".el-scrollbar__wrap").scrollTop = Math.max(0, l * O(t2)));
  }, O = (e2) => p2[e2].value.$el.querySelector("li").offsetHeight, I = (e2) => {
    s.value || M("hours");
    const t2 = s.value;
    let l = g.value[t2].value;
    const a2 = s.value === "hours" ? 24 : 60;
    l = (l + e2 + a2) % a2, P(t2, l), D(t2, l), nextTick(() => M(s.value));
  }, P = (l, a2) => {
    if (!C.value[l].value[a2])
      switch (l) {
        case "hours":
          t.emit("change", e.spinnerDate.hour(a2).minute(m.value).second(f.value));
          break;
        case "minutes":
          t.emit("change", e.spinnerDate.hour(v.value).minute(a2).second(f.value));
          break;
        case "seconds":
          t.emit("change", e.spinnerDate.hour(v.value).minute(m.value).second(a2));
      }
  }, V = (e2) => p2[e2].value.$el.offsetHeight, B = () => {
    const e2 = (e3) => {
      p2[e3].value && (p2[e3].value.$el.querySelector(".el-scrollbar__wrap").onscroll = () => {
        ((e4) => {
          a = true, r(e4);
          const t2 = Math.min(Math.round((p2[e4].value.$el.querySelector(".el-scrollbar__wrap").scrollTop - (0.5 * V(e4) - 10) / O(e4) + 3) / O(e4)), e4 === "hours" ? 23 : 59);
          P(e4, t2);
        })(e3);
      });
    };
    e2("hours"), e2("minutes"), e2("seconds");
  };
  onMounted(() => {
    nextTick(() => {
      !e.arrowControl && B(), N(), e.role === "start" && M("hours");
    });
  });
  t.emit("set-option", [e.role + "_scrollDown", I]), t.emit("set-option", [e.role + "_emitSelectRange", M]);
  const {getHoursList: A, getMinutesList: L, getSecondsList: z} = Ta(e.disabledHours, e.disabledMinutes, e.disabledSeconds);
  return watch(() => e.spinnerDate, () => {
    a || N();
  }), {getRefId: (e2) => `list${e2.charAt(0).toUpperCase() + e2.slice(1)}Ref`, spinnerItems: h2, currentScrollbar: s, hours: v, minutes: m, seconds: f, hoursList: b, minutesList: y, arrowHourList: x, arrowMinuteList: _, arrowSecondList: S, getAmPmFlag: (t2) => {
    if (!!!e.amPmMode)
      return "";
    let l = t2 < 12 ? " am" : " pm";
    return e.amPmMode === "A" && (l = l.toUpperCase()), l;
  }, emitSelectRange: M, adjustCurrentSpinner: T, typeItemHeight: O, listHoursRef: u, listMinutesRef: d, listSecondsRef: c, onIncreaseClick: () => {
    I(1);
  }, onDecreaseClick: () => {
    I(-1);
  }, handleClick: (e2, {value: t2, disabled: l}) => {
    l || (P(e2, t2), M(e2), D(e2, t2));
  }, secondsList: k, timePartsMap: g, arrowListMap: E, listMap: C};
}});
const Ia = {class: "el-time-spinner__arrow el-icon-arrow-up"}, Pa = {class: "el-time-spinner__arrow el-icon-arrow-down"}, Va = {class: "el-time-spinner__list"};
Oa.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-scrollbar"), r = resolveDirective("repeat-click");
  return openBlock(), createBlock("div", {class: ["el-time-spinner", {"has-seconds": e.showSeconds}]}, [e.arrowControl ? createCommentVNode("v-if", true) : (openBlock(true), createBlock(Fragment, {key: 0}, renderList(e.spinnerItems, (t2) => (openBlock(), createBlock(i, {key: t2, ref: e.getRefId(t2), class: "el-time-spinner__wrapper", "wrap-style": "max-height: inherit;", "view-class": "el-time-spinner__list", noresize: "", tag: "ul", onMouseenter: (l2) => e.emitSelectRange(t2), onMousemove: (l2) => e.adjustCurrentSpinner(t2)}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.listMap[t2].value, (l2, a2) => (openBlock(), createBlock("li", {key: a2, class: ["el-time-spinner__item", {active: a2 === e.timePartsMap[t2].value, disabled: l2}], onClick: (n2) => e.handleClick(t2, {value: a2, disabled: l2})}, [t2 === "hours" ? (openBlock(), createBlock(Fragment, {key: 0}, [createTextVNode(toDisplayString(("0" + (e.amPmMode ? a2 % 12 || 12 : a2)).slice(-2)) + toDisplayString(e.getAmPmFlag(a2)), 1)], 2112)) : (openBlock(), createBlock(Fragment, {key: 1}, [createTextVNode(toDisplayString(("0" + a2).slice(-2)), 1)], 2112))], 10, ["onClick"]))), 128))]), _: 2}, 1032, ["onMouseenter", "onMousemove"]))), 128)), e.arrowControl ? (openBlock(true), createBlock(Fragment, {key: 1}, renderList(e.spinnerItems, (t2) => (openBlock(), createBlock("div", {key: t2, class: "el-time-spinner__wrapper is-arrow", onMouseenter: (l2) => e.emitSelectRange(t2)}, [withDirectives(createVNode("i", Ia, null, 512), [[r, e.onDecreaseClick]]), withDirectives(createVNode("i", Pa, null, 512), [[r, e.onIncreaseClick]]), createVNode("ul", Va, [(openBlock(true), createBlock(Fragment, null, renderList(e.arrowListMap[t2].value, (l2, a2) => (openBlock(), createBlock("li", {key: a2, class: ["el-time-spinner__item", {active: l2 === e.timePartsMap[t2].value, disabled: e.listMap[t2].value[l2]}]}, toDisplayString(l2 === void 0 ? "" : ("0" + (e.amPmMode ? l2 % 12 || 12 : l2)).slice(-2) + e.getAmPmFlag(l2)), 3))), 128))])], 40, ["onMouseenter"]))), 128)) : createCommentVNode("v-if", true)], 2);
}, Oa.__file = "packages/time-picker/src/time-picker-com/basic-time-spinner.vue";
var Ba = defineComponent({components: {TimeSpinner: Oa}, props: {visible: Boolean, actualVisible: {type: Boolean, default: void 0}, datetimeRole: {type: String}, parsedValue: {type: [Object, String]}, format: {type: String, default: ""}}, emits: ["pick", "select-range", "set-picker-option"], setup(e, t) {
  const a = ref([0, 2]), o = Da(e), i = computed(() => e.actualVisible === void 0 ? "el-zoom-in-top" : ""), r = computed(() => e.format.includes("ss")), s = computed(() => e.format.includes("A") ? "A" : e.format.includes("a") ? "a" : ""), u = (t2) => {
    const l = {hour: g, minute: b, second: y};
    let a2 = t2;
    return ["hour", "minute", "second"].forEach((t3) => {
      if (l[t3]) {
        let n;
        const o2 = l[t3];
        n = t3 === "minute" ? o2(a2.hour(), e.datetimeRole) : t3 === "second" ? o2(a2.hour(), a2.minute(), e.datetimeRole) : o2(e.datetimeRole), n && n.length && !n.includes(a2[t3]()) && (a2 = a2[t3](n[0]));
      }
    }), a2;
  };
  t.emit("set-picker-option", ["isValidValue", (e2) => {
    const t2 = ie(e2), l = u(t2);
    return t2.isSame(l);
  }]), t.emit("set-picker-option", ["formatToString", (t2) => t2 ? t2.format(e.format) : null]), t.emit("set-picker-option", ["parseUserInput", (t2) => t2 ? ie(t2, e.format) : null]), t.emit("set-picker-option", ["handleKeydown", (e2) => {
    const t2 = e2.code;
    if (t2 === Dt.left || t2 === Dt.right) {
      return ((e3) => {
        const t3 = [0, 3].concat(r.value ? [6] : []), l = ["hours", "minutes"].concat(r.value ? ["seconds"] : []), n = (t3.indexOf(a.value[0]) + e3 + t3.length) % t3.length;
        d.start_emitSelectRange(l[n]);
      })(t2 === Dt.left ? -1 : 1), void e2.preventDefault();
    }
    if (t2 === Dt.up || t2 === Dt.down) {
      const l = t2 === Dt.up ? -1 : 1;
      return d.start_scrollDown(l), void e2.preventDefault();
    }
  }]), t.emit("set-picker-option", ["getRangeAvaliableTime", u]), t.emit("set-picker-option", ["getDefaultValue", () => ie(f)]);
  const d = {}, c = inject("EP_PICKER_BASE"), {arrowControl: p2, disabledHours: h2, disabledMinutes: v, disabledSeconds: m, defaultValue: f} = c.props, {getAvaliableHours: g, getAvaliableMinutes: b, getAvaliableSeconds: y} = Na(h2, v, m);
  return {transitionName: i, arrowControl: p2, onSetOption: (e2) => {
    d[e2[0]] = e2[1];
  }, t: ya, handleConfirm: (l = false, a2) => {
    a2 || t.emit("pick", e.parsedValue, l);
  }, handleChange: (l) => {
    if (!e.visible)
      return;
    const a2 = u(l).millisecond(0);
    t.emit("pick", a2, true);
  }, setSelectionRange: (e2, l) => {
    t.emit("select-range", e2, l), a.value = [e2, l];
  }, amPmMode: s, showSeconds: r, handleCancel: () => {
    t.emit("pick", o.value, false);
  }, disabledHours: h2, disabledMinutes: v, disabledSeconds: m};
}});
const Aa = {key: 0, class: "el-time-panel"}, La = {class: "el-time-panel__footer"};
Ba.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("time-spinner");
  return openBlock(), createBlock(Transition, {name: e.transitionName}, {default: withCtx(() => [e.actualVisible || e.visible ? (openBlock(), createBlock("div", Aa, [createVNode("div", {class: ["el-time-panel__content", {"has-seconds": e.showSeconds}]}, [createVNode(i, {ref: "spinner", role: e.datetimeRole || "start", "arrow-control": e.arrowControl, "show-seconds": e.showSeconds, "am-pm-mode": e.amPmMode, "spinner-date": e.parsedValue, "disabled-hours": e.disabledHours, "disabled-minutes": e.disabledMinutes, "disabled-seconds": e.disabledSeconds, onChange: e.handleChange, onSetOption: e.onSetOption, onSelectRange: e.setSelectionRange}, null, 8, ["role", "arrow-control", "show-seconds", "am-pm-mode", "spinner-date", "disabled-hours", "disabled-minutes", "disabled-seconds", "onChange", "onSetOption", "onSelectRange"])], 2), createVNode("div", La, [createVNode("button", {type: "button", class: "el-time-panel__btn cancel", onClick: t[1] || (t[1] = (...t2) => e.handleCancel && e.handleCancel(...t2))}, toDisplayString(e.t("el.datepicker.cancel")), 1), createVNode("button", {type: "button", class: "el-time-panel__btn confirm", onClick: t[2] || (t[2] = (t2) => e.handleConfirm())}, toDisplayString(e.t("el.datepicker.confirm")), 1)])])) : createCommentVNode("v-if", true)]), _: 1}, 8, ["name"]);
}, Ba.__file = "packages/time-picker/src/time-picker-com/panel-time-pick.vue";
const za = (e, t) => {
  const l = [];
  for (let a = e; a <= t; a++)
    l.push(a);
  return l;
};
var Fa = defineComponent({components: {TimeSpinner: Oa}, props: {visible: Boolean, actualVisible: Boolean, parsedValue: {type: [Array, String]}, format: {type: String, default: ""}}, emits: ["pick", "select-range", "set-picker-option"], setup(e, t) {
  const a = computed(() => e.parsedValue[0]), o = computed(() => e.parsedValue[1]), i = Da(e), r = computed(() => e.format.includes("ss")), s = computed(() => e.format.includes("A") ? "A" : e.format.includes("a") ? "a" : ""), u = ref([]), d = ref([]), c = (e2, l) => {
    t.emit("pick", [e2, l], true);
  }, p2 = computed(() => a.value > o.value), h2 = ref([0, 2]), v = computed(() => r.value ? 11 : 8), m = (e2, t2) => {
    const l = M ? M(e2) : [], n = e2 === "start", i2 = (t2 || (n ? o.value : a.value)).hour(), r2 = n ? za(i2 + 1, 23) : za(0, i2 - 1);
    return union_1(l, r2);
  }, f = (e2, t2, l) => {
    const n = T ? T(e2, t2) : [], i2 = t2 === "start", r2 = l || (i2 ? o.value : a.value);
    if (e2 !== r2.hour())
      return n;
    const s2 = r2.minute(), u2 = i2 ? za(s2 + 1, 59) : za(0, s2 - 1);
    return union_1(n, u2);
  }, g = (e2, t2, l, n) => {
    const i2 = N ? N(e2, t2, l) : [], r2 = l === "start", s2 = n || (r2 ? o.value : a.value), u2 = s2.hour(), d2 = s2.minute();
    if (e2 !== u2 || t2 !== d2)
      return i2;
    const c2 = s2.second(), p3 = r2 ? za(c2 + 1, 59) : za(0, c2 - 1);
    return union_1(i2, p3);
  }, b = (e2) => e2.map((t2, l) => x(e2[0], e2[1], l === 0 ? "start" : "end")), {getAvaliableHours: y, getAvaliableMinutes: k, getAvaliableSeconds: C} = Na(m, f, g), x = (e2, t2, l) => {
    const a2 = {hour: y, minute: k, second: C}, n = l === "start";
    let o2 = n ? e2 : t2;
    const i2 = n ? t2 : e2;
    return ["hour", "minute", "second"].forEach((e3) => {
      if (a2[e3]) {
        let t3;
        const r2 = a2[e3];
        if (t3 = e3 === "minute" ? r2(o2.hour(), l, i2) : e3 === "second" ? r2(o2.hour(), o2.minute(), l, i2) : r2(l, i2), t3 && t3.length && !t3.includes(o2[e3]())) {
          const l2 = n ? 0 : t3.length - 1;
          o2 = o2[e3](t3[l2]);
        }
      }
    }), o2;
  };
  t.emit("set-picker-option", ["formatToString", (t2) => t2 ? Array.isArray(t2) ? t2.map((t3) => t3.format(e.format)) : t2.format(e.format) : null]), t.emit("set-picker-option", ["parseUserInput", (t2) => t2 ? Array.isArray(t2) ? t2.map((t3) => ie(t3, e.format)) : ie(t2, e.format) : null]), t.emit("set-picker-option", ["isValidValue", (e2) => {
    const t2 = e2.map((e3) => ie(e3)), l = b(t2);
    return t2[0].isSame(l[0]) && t2[1].isSame(l[1]);
  }]), t.emit("set-picker-option", ["handleKeydown", (e2) => {
    const t2 = e2.code;
    if (t2 === Dt.left || t2 === Dt.right) {
      return ((e3) => {
        const t3 = r.value ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11], l = ["hours", "minutes"].concat(r.value ? ["seconds"] : []), a2 = (t3.indexOf(h2.value[0]) + e3 + t3.length) % t3.length, n = t3.length / 2;
        a2 < n ? w.start_emitSelectRange(l[a2]) : w.end_emitSelectRange(l[a2 - n]);
      })(t2 === Dt.left ? -1 : 1), void e2.preventDefault();
    }
    if (t2 === Dt.up || t2 === Dt.down) {
      const l = t2 === Dt.up ? -1 : 1, a2 = h2.value[0] < v.value ? "start" : "end";
      return w[a2 + "_scrollDown"](l), void e2.preventDefault();
    }
  }]), t.emit("set-picker-option", ["getDefaultValue", () => Array.isArray(D) ? D.map((e2) => ie(e2)) : [ie(D), ie(D).add(60, "m")]]), t.emit("set-picker-option", ["getRangeAvaliableTime", b]);
  const w = {}, _ = inject("EP_PICKER_BASE"), {arrowControl: S, disabledHours: M, disabledMinutes: T, disabledSeconds: N, defaultValue: D} = _.props;
  return {arrowControl: S, onSetOption: (e2) => {
    w[e2[0]] = e2[1];
  }, setMaxSelectionRange: (e2, l) => {
    t.emit("select-range", e2, l, "max"), h2.value = [e2 + v.value, l + v.value];
  }, setMinSelectionRange: (e2, l) => {
    t.emit("select-range", e2, l, "min"), h2.value = [e2, l];
  }, btnConfirmDisabled: p2, handleCancel: () => {
    t.emit("pick", i.value, null);
  }, handleConfirm: (e2 = false) => {
    t.emit("pick", [a.value, o.value], e2);
  }, t: ya, showSeconds: r, minDate: a, maxDate: o, amPmMode: s, handleMinChange: (e2) => {
    c(e2.millisecond(0), o.value);
  }, handleMaxChange: (e2) => {
    c(a.value, e2.millisecond(0));
  }, minSelectableRange: u, maxSelectableRange: d, disabledHours_: m, disabledMinutes_: f, disabledSeconds_: g};
}});
const $a = {key: 0, class: "el-time-range-picker el-picker-panel"}, Ra = {class: "el-time-range-picker__content"}, Ha = {class: "el-time-range-picker__cell"}, Wa = {class: "el-time-range-picker__header"}, ja = {class: "el-time-range-picker__cell"}, Ka = {class: "el-time-range-picker__header"}, Ya = {class: "el-time-panel__footer"};
Fa.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("time-spinner");
  return e.actualVisible ? (openBlock(), createBlock("div", $a, [createVNode("div", Ra, [createVNode("div", Ha, [createVNode("div", Wa, toDisplayString(e.t("el.datepicker.startTime")), 1), createVNode("div", {class: [{"has-seconds": e.showSeconds, "is-arrow": e.arrowControl}, "el-time-range-picker__body el-time-panel__content"]}, [createVNode(i, {ref: "minSpinner", role: "start", "show-seconds": e.showSeconds, "am-pm-mode": e.amPmMode, "arrow-control": e.arrowControl, "spinner-date": e.minDate, "disabled-hours": e.disabledHours_, "disabled-minutes": e.disabledMinutes_, "disabled-seconds": e.disabledSeconds_, onChange: e.handleMinChange, onSetOption: e.onSetOption, onSelectRange: e.setMinSelectionRange}, null, 8, ["show-seconds", "am-pm-mode", "arrow-control", "spinner-date", "disabled-hours", "disabled-minutes", "disabled-seconds", "onChange", "onSetOption", "onSelectRange"])], 2)]), createVNode("div", ja, [createVNode("div", Ka, toDisplayString(e.t("el.datepicker.endTime")), 1), createVNode("div", {class: [{"has-seconds": e.showSeconds, "is-arrow": e.arrowControl}, "el-time-range-picker__body el-time-panel__content"]}, [createVNode(i, {ref: "maxSpinner", role: "end", "show-seconds": e.showSeconds, "am-pm-mode": e.amPmMode, "arrow-control": e.arrowControl, "spinner-date": e.maxDate, "disabled-hours": e.disabledHours_, "disabled-minutes": e.disabledMinutes_, "disabled-seconds": e.disabledSeconds_, onChange: e.handleMaxChange, onSetOption: e.onSetOption, onSelectRange: e.setMaxSelectionRange}, null, 8, ["show-seconds", "am-pm-mode", "arrow-control", "spinner-date", "disabled-hours", "disabled-minutes", "disabled-seconds", "onChange", "onSetOption", "onSelectRange"])], 2)])]), createVNode("div", Ya, [createVNode("button", {type: "button", class: "el-time-panel__btn cancel", onClick: t[1] || (t[1] = (t2) => e.handleCancel())}, toDisplayString(e.t("el.datepicker.cancel")), 1), createVNode("button", {type: "button", class: "el-time-panel__btn confirm", disabled: e.btnConfirmDisabled, onClick: t[2] || (t[2] = (t2) => e.handleConfirm())}, toDisplayString(e.t("el.datepicker.confirm")), 9, ["disabled"])])])) : createCommentVNode("v-if", true);
}, Fa.__file = "packages/time-picker/src/time-picker-com/panel-time-range.vue", ie.extend(se);
var qa = defineComponent({name: "ElTimePicker", install: null, props: Object.assign(Object.assign({}, Ca), {isRange: {type: Boolean, default: false}}), emits: ["update:modelValue"], setup(e, t) {
  const a = ref(null), n = e.isRange ? "timerange" : "time", o = e.isRange ? Fa : Ba, i = Object.assign(Object.assign({}, e), {focus: () => {
    var e2;
    (e2 = a.value) === null || e2 === void 0 || e2.handleFocus();
  }});
  return provide("ElPopperOptions", e.popperOptions), t.expose(i), () => h(_a, Object.assign(Object.assign({format: "HH:mm:ss"}, e), {type: n, ref: a, "onUpdate:modelValue": (e2) => t.emit("update:modelValue", e2)}), {default: (e2) => h(o, e2)});
}});
const Ua = (e) => Array.from(Array(e).keys()), Ga = (e) => e.replace(/\W?m{1,2}|\W?ZZ/g, "").replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, "").trim(), Xa = (e) => e.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?Y{2,4}/g, "").trim(), Za = qa;
Za.install = (e) => {
  e.component(Za.name, Za);
}, ie.extend(re);
var Qa = defineComponent({props: {selectedDay: {type: Object}, range: {type: Array}, date: {type: Object}, hideHeader: {type: Boolean}}, emits: ["pick"], setup(e, t) {
  const a = ref(ie().localeData().weekdaysShort()), o = ie(), i = o.$locale().weekStart || 0, r = (t2, l) => {
    let a2;
    return a2 = l === "prev" ? e.date.startOf("month").subtract(1, "month").date(t2) : l === "next" ? e.date.startOf("month").add(1, "month").date(t2) : e.date.date(t2), a2;
  }, s = computed(() => e.range && e.range.length), u = computed(() => {
    let t2 = [];
    if (s.value) {
      const [l, a2] = e.range, n = Ua(a2.date() - l.date() + 1).map((e2, t3) => ({text: l.date() + t3, type: "current"}));
      let o2 = n.length % 7;
      o2 = o2 === 0 ? 0 : 7 - o2;
      const i2 = Ua(o2).map((e2, t3) => ({text: t3 + 1, type: "next"}));
      t2 = n.concat(i2);
    } else {
      const l = e.date.startOf("month").day() || 7;
      t2 = [...((e2, t3) => {
        const l2 = e2.subtract(1, "month").endOf("month").date();
        return Ua(t3).map((e3, a3) => l2 - (t3 - a3 - 1));
      })(e.date, l - i).map((e2) => ({text: e2, type: "prev"})), ...((e2) => {
        const t3 = e2.daysInMonth();
        return Ua(t3).map((e3, t4) => t4 + 1);
      })(e.date).map((e2) => ({text: e2, type: "current"}))];
      const a2 = Ua(42 - t2.length).map((e2, t3) => ({text: t3 + 1, type: "next"}));
      t2 = t2.concat(a2);
    }
    return ((e2) => Ua(e2.length / 7).map((t3, l) => {
      const a2 = 7 * l;
      return e2.slice(a2, a2 + 7);
    }))(t2);
  }), d = computed(() => {
    const e2 = i;
    return e2 === 0 ? a.value : a.value.slice(e2).concat(a.value.slice(0, e2));
  });
  return {isInRange: s, weekDays: d, rows: u, getCellClass: ({text: t2, type: l}) => {
    const a2 = [l];
    if (l === "current") {
      const n = r(t2, l);
      n.isSame(e.selectedDay, "day") && a2.push("is-selected"), n.isSame(o, "day") && a2.push("is-today");
    }
    return a2;
  }, pickDay: ({text: e2, type: l}) => {
    const a2 = r(e2, l);
    t.emit("pick", a2);
  }, getSlotData: ({text: t2, type: l}) => {
    const a2 = r(t2, l);
    return {isSelected: a2.isSame(e.selectedDay), type: l + "-month", day: a2.format("YYYY-MM-DD"), date: a2.toDate()};
  }};
}});
const Ja = {key: 0}, en = {class: "el-calendar-day"};
Qa.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("table", {class: {"el-calendar-table": true, "is-range": e.isInRange}, cellspacing: "0", cellpadding: "0"}, [e.hideHeader ? createCommentVNode("v-if", true) : (openBlock(), createBlock("thead", Ja, [(openBlock(true), createBlock(Fragment, null, renderList(e.weekDays, (e2) => (openBlock(), createBlock("th", {key: e2}, toDisplayString(e2), 1))), 128))])), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.rows, (t2, l2) => (openBlock(), createBlock("tr", {key: l2, class: {"el-calendar-table__row": true, "el-calendar-table__row--hide-border": l2 === 0 && e.hideHeader}}, [(openBlock(true), createBlock(Fragment, null, renderList(t2, (t3, l3) => (openBlock(), createBlock("td", {key: l3, class: e.getCellClass(t3), onClick: (l4) => e.pickDay(t3)}, [createVNode("div", en, [renderSlot(e.$slots, "dateCell", {data: e.getSlotData(t3)}, () => [createVNode("span", null, toDisplayString(t3.text), 1)])])], 10, ["onClick"]))), 128))], 2))), 128))])], 2);
}, Qa.__file = "packages/calendar/src/date-table.vue";
var tn = defineComponent({name: "ElCalendar", components: {DateTable: Qa, ElButton: pa, ElButtonGroup: ma}, props: {modelValue: {type: Date}, range: {type: Array, validator: (e) => !!Array.isArray(e) && (e.length === 2 && e.every((e2) => e2 instanceof Date))}}, emits: ["input", "update:modelValue"], setup(e, t) {
  const a = ref(null), o = ie(), i = computed(() => c.value.subtract(1, "month")), r = computed(() => ie(c.value).format("YYYY-MM")), s = computed(() => c.value.add(1, "month")), u = computed(() => {
    const e2 = "el.datepicker.month" + c.value.format("M");
    return `${c.value.year()} ${ya("el.datepicker.year")} ${ya(e2)}`;
  }), d = computed({get: () => e.modelValue ? c.value : a.value, set(e2) {
    a.value = e2;
    const l = e2.toDate();
    t.emit("input", l), t.emit("update:modelValue", l);
  }}), c = computed(() => e.modelValue ? ie(e.modelValue) : d.value ? d.value : p2.value.length ? p2.value[0][0] : o), p2 = computed(() => {
    if (!e.range)
      return [];
    const t2 = e.range.map((e2) => ie(e2)), [l, a2] = t2;
    if (l.isAfter(a2))
      return console.warn("[ElementCalendar]end time should be greater than start time"), [];
    if (l.isSame(a2, "month"))
      return [[l.startOf("week"), a2.endOf("week")]];
    {
      if (l.add(1, "month").month() !== a2.month())
        return console.warn("[ElementCalendar]start time and end time interval must not exceed two months"), [];
      const e2 = a2.startOf("month"), t3 = e2.startOf("week");
      let n = e2;
      return e2.isSame(t3, "month") || (n = e2.endOf("week").add(1, "day")), [[l.startOf("week"), l.endOf("month")], [n, a2.endOf("week")]];
    }
  }), h2 = (e2) => {
    d.value = e2;
  };
  return {selectedDay: a, curMonthDatePrefix: r, i18nDate: u, realSelectedDay: d, date: c, validatedRange: p2, pickDay: h2, selectDate: (e2) => {
    let t2;
    t2 = e2 === "prev-month" ? i.value : e2 === "next-month" ? s.value : o, t2.isSame(c.value, "day") || h2(t2);
  }, t: ya};
}});
const ln = {class: "el-calendar"}, an = {class: "el-calendar__header"}, nn = {class: "el-calendar__title"}, on = {key: 0, class: "el-calendar__button-group"}, rn = {key: 0, class: "el-calendar__body"}, sn = {key: 1, class: "el-calendar__body"};
tn.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-button"), r = resolveComponent("el-button-group"), p2 = resolveComponent("date-table");
  return openBlock(), createBlock("div", ln, [createVNode("div", an, [createVNode("div", nn, toDisplayString(e.i18nDate), 1), e.validatedRange.length === 0 ? (openBlock(), createBlock("div", on, [createVNode(r, null, {default: withCtx(() => [createVNode(i, {size: "mini", onClick: t[1] || (t[1] = (t2) => e.selectDate("prev-month"))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.prevMonth")), 1)]), _: 1}), createVNode(i, {size: "mini", onClick: t[2] || (t[2] = (t2) => e.selectDate("today"))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.today")), 1)]), _: 1}), createVNode(i, {size: "mini", onClick: t[3] || (t[3] = (t2) => e.selectDate("next-month"))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.nextMonth")), 1)]), _: 1})]), _: 1})])) : createCommentVNode("v-if", true)]), e.validatedRange.length === 0 ? (openBlock(), createBlock("div", rn, [createVNode(p2, {date: e.date, "selected-day": e.realSelectedDay, onPick: e.pickDay}, createSlots({_: 2}, [e.$slots.dateCell ? {name: "dateCell", fn: withCtx((t2) => [renderSlot(e.$slots, "dateCell", t2)])} : void 0]), 1032, ["date", "selected-day", "onPick"])])) : (openBlock(), createBlock("div", sn, [(openBlock(true), createBlock(Fragment, null, renderList(e.validatedRange, (t2, l2) => (openBlock(), createBlock(p2, {key: l2, date: t2[0], "selected-day": e.realSelectedDay, range: t2, "hide-header": l2 !== 0, onPick: e.pickDay}, createSlots({_: 2}, [e.$slots.dateCell ? {name: "dateCell", fn: withCtx((t3) => [renderSlot(e.$slots, "dateCell", t3)])} : void 0]), 1032, ["date", "selected-day", "range", "hide-header", "onPick"]))), 128))]))]);
}, tn.__file = "packages/calendar/src/index.vue", tn.install = (e) => {
  e.component(tn.name, tn);
};
const un = tn;
var dn = defineComponent({name: "ElCard", props: {header: {type: String, default: ""}, bodyStyle: {type: [String, Object, Array], default: ""}, shadow: {type: String, default: ""}}});
const cn = {key: 0, class: "el-card__header"};
dn.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-card", e.shadow ? "is-" + e.shadow + "-shadow" : "is-always-shadow"]}, [e.$slots.header || e.header ? (openBlock(), createBlock("div", cn, [renderSlot(e.$slots, "header", {}, () => [createTextVNode(toDisplayString(e.header), 1)])])) : createCommentVNode("v-if", true), createVNode("div", {class: "el-card__body", style: e.bodyStyle}, [renderSlot(e.$slots, "default")], 4)], 2);
}, dn.__file = "packages/card/src/index.vue", dn.install = (e) => {
  e.component(dn.name, dn);
};
const pn = dn;
var hn = defineComponent({name: "ElCarousel", props: {initialIndex: {type: Number, default: 0}, height: {type: String, default: ""}, trigger: {type: String, default: "hover"}, autoplay: {type: Boolean, default: true}, interval: {type: Number, default: 3e3}, indicatorPosition: {type: String, default: ""}, indicator: {type: Boolean, default: true}, arrow: {type: String, default: "hover"}, type: {type: String, default: ""}, loop: {type: Boolean, default: true}, direction: {type: String, default: "horizontal", validator: (e) => ["horizontal", "vertical"].includes(e)}, pauseOnHover: {type: Boolean, default: true}}, emits: ["change"], setup(e, {emit: t}) {
  const s = reactive({activeIndex: -1, containerWidth: 0, timer: null, hover: false}), u = ref(null), d = ref([]), c = ref(0), p2 = ref(0), h2 = computed(() => e.arrow !== "never" && e.direction !== "vertical"), v = computed(() => d.value.some((e2) => e2.label.toString().length > 0)), m = computed(() => {
    const t2 = ["el-carousel", "el-carousel--" + e.direction];
    return e.type === "card" && t2.push("el-carousel--card"), t2;
  }), f = computed(() => {
    const t2 = ["el-carousel__indicators", "el-carousel__indicators--" + e.direction];
    return v.value && t2.push("el-carousel__indicators--labels"), e.indicatorPosition !== "outside" && e.type !== "card" || t2.push("el-carousel__indicators--outside"), t2;
  }), g = throttle_1((e2) => {
    x(e2);
  }, 300, {trailing: true}), b = throttle_1((t2) => {
    !function(t3) {
      e.trigger === "hover" && t3 !== s.activeIndex && (s.activeIndex = t3);
    }(t2);
  }, 300);
  function y() {
    s.timer && (clearInterval(s.timer), s.timer = null);
  }
  function k() {
    e.interval <= 0 || !e.autoplay || s.timer || (s.timer = setInterval(() => C(), e.interval));
  }
  const C = () => {
    s.activeIndex < d.value.length - 1 ? s.activeIndex = s.activeIndex + 1 : e.loop && (s.activeIndex = 0);
  };
  function x(t2) {
    if (typeof t2 == "string") {
      const e2 = d.value.filter((e3) => e3.name === t2);
      e2.length > 0 && (t2 = d.value.indexOf(e2[0]));
    }
    if (t2 = Number(t2), isNaN(t2) || t2 !== Math.floor(t2))
      return void console.warn("[Element Warn][Carousel]index must be an integer.");
    let l = d.value.length;
    const a = s.activeIndex;
    s.activeIndex = t2 < 0 ? e.loop ? l - 1 : 0 : t2 >= l ? e.loop ? 0 : l - 1 : t2, a === s.activeIndex && _(a);
  }
  function _(e2) {
    d.value.forEach((t2, l) => {
      t2.translateItem(l, s.activeIndex, e2);
    });
  }
  function E() {
    x(s.activeIndex + 1);
  }
  return watch(() => s.activeIndex, (e2, l) => {
    _(l), l > -1 && t("change", e2, l);
  }), watch(() => e.autoplay, (e2) => {
    e2 ? k() : y();
  }), watch(() => e.loop, () => {
    x(s.activeIndex);
  }), onMounted(() => {
    nextTick(() => {
      pt(u.value, _), u.value && (c.value = u.value.offsetWidth, p2.value = u.value.offsetHeight), e.initialIndex < d.value.length && e.initialIndex >= 0 && (s.activeIndex = e.initialIndex), k();
    });
  }), onBeforeUnmount(() => {
    u.value && ht(u.value, _), y();
  }), provide("injectCarouselScope", {direction: e.direction, offsetWidth: c, offsetHeight: p2, type: e.type, items: d, loop: e.loop, addItem: function(e2) {
    d.value.push(e2);
  }, removeItem: function(e2) {
    const t2 = d.value.findIndex((t3) => t3.uid === e2);
    t2 !== -1 && (d.value.splice(t2, 1), s.activeIndex === t2 && E());
  }, setActiveItem: x}), {data: s, props: e, items: d, arrowDisplay: h2, carouselClasses: m, indicatorsClasses: f, hasLabel: v, handleMouseEnter: function() {
    s.hover = true, e.pauseOnHover && y();
  }, handleMouseLeave: function() {
    s.hover = false, k();
  }, handleIndicatorClick: function(e2) {
    s.activeIndex = e2;
  }, throttledArrowClick: g, throttledIndicatorHover: b, handleButtonEnter: function(t2) {
    e.direction !== "vertical" && d.value.forEach((e2, l) => {
      t2 === function(e3, t3) {
        const l2 = d.value.length;
        return t3 === l2 - 1 && e3.inStage && d.value[0].active || e3.inStage && d.value[t3 + 1] && d.value[t3 + 1].active ? "left" : !!(t3 === 0 && e3.inStage && d.value[l2 - 1].active || e3.inStage && d.value[t3 - 1] && d.value[t3 - 1].active) && "right";
      }(e2, l) && (e2.hover = true);
    });
  }, handleButtonLeave: function() {
    e.direction !== "vertical" && d.value.forEach((e2) => {
      e2.hover = false;
    });
  }, prev: function() {
    x(s.activeIndex - 1);
  }, next: E, setActiveItem: x, root: u};
}});
const vn = createVNode("i", {class: "el-icon-arrow-left"}, null, -1), mn = createVNode("i", {class: "el-icon-arrow-right"}, null, -1), fn2 = {class: "el-carousel__button"}, gn = {key: 0};
hn.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {ref: "root", class: e.carouselClasses, onMouseenter: t[7] || (t[7] = withModifiers((...t2) => e.handleMouseEnter && e.handleMouseEnter(...t2), ["stop"])), onMouseleave: t[8] || (t[8] = withModifiers((...t2) => e.handleMouseLeave && e.handleMouseLeave(...t2), ["stop"]))}, [createVNode("div", {class: "el-carousel__container", style: {height: e.height}}, [e.arrowDisplay ? (openBlock(), createBlock(Transition, {key: 0, name: "carousel-arrow-left"}, {default: withCtx(() => [withDirectives(createVNode("button", {type: "button", class: "el-carousel__arrow el-carousel__arrow--left", onMouseenter: t[1] || (t[1] = (t2) => e.handleButtonEnter("left")), onMouseleave: t[2] || (t[2] = (...t2) => e.handleButtonLeave && e.handleButtonLeave(...t2)), onClick: t[3] || (t[3] = withModifiers((t2) => e.throttledArrowClick(e.data.activeIndex - 1), ["stop"]))}, [vn], 544), [[vShow, (e.arrow === "always" || e.data.hover) && (e.props.loop || e.data.activeIndex > 0)]])]), _: 1})) : createCommentVNode("v-if", true), e.arrowDisplay ? (openBlock(), createBlock(Transition, {key: 1, name: "carousel-arrow-right"}, {default: withCtx(() => [withDirectives(createVNode("button", {type: "button", class: "el-carousel__arrow el-carousel__arrow--right", onMouseenter: t[4] || (t[4] = (t2) => e.handleButtonEnter("right")), onMouseleave: t[5] || (t[5] = (...t2) => e.handleButtonLeave && e.handleButtonLeave(...t2)), onClick: t[6] || (t[6] = withModifiers((t2) => e.throttledArrowClick(e.data.activeIndex + 1), ["stop"]))}, [mn], 544), [[vShow, (e.arrow === "always" || e.data.hover) && (e.props.loop || e.data.activeIndex < e.items.length - 1)]])]), _: 1})) : createCommentVNode("v-if", true), renderSlot(e.$slots, "default")], 4), e.indicatorPosition !== "none" ? (openBlock(), createBlock("ul", {key: 0, class: e.indicatorsClasses}, [(openBlock(true), createBlock(Fragment, null, renderList(e.items, (t2, l2) => (openBlock(), createBlock("li", {key: l2, class: ["el-carousel__indicator", "el-carousel__indicator--" + e.direction, {"is-active": l2 === e.data.activeIndex}], onMouseenter: (t3) => e.throttledIndicatorHover(l2), onClick: withModifiers((t3) => e.handleIndicatorClick(l2), ["stop"])}, [createVNode("button", fn2, [e.hasLabel ? (openBlock(), createBlock("span", gn, toDisplayString(t2.label), 1)) : createCommentVNode("v-if", true)])], 42, ["onMouseenter", "onClick"]))), 128))], 2)) : createCommentVNode("v-if", true)], 34);
}, hn.__file = "packages/carousel/src/main.vue", hn.install = (e) => {
  e.component(hn.name, hn);
};
const bn = hn;
var yn = defineComponent({name: "ElCarouselItem", props: {name: {type: String, default: ""}, label: {type: [String, Number], default: ""}}, setup(t) {
  const l = getCurrentInstance();
  l.uid;
  const o = reactive({hover: false, translate: 0, scale: 1, active: false, ready: false, inStage: false, animating: false}), r = inject("injectCarouselScope"), s = computed(() => r.direction), u = computed(() => function(e) {
    const t2 = ["ms-", "webkit-"];
    return ["transform", "transition", "animation"].forEach((l2) => {
      const a = e[l2];
      l2 && a && t2.forEach((t3) => {
        e[t3 + l2] = a;
      });
    }), e;
  }({transform: `${s.value === "vertical" ? "translateY" : "translateX"}(${o.translate}px) scale(${o.scale})`}));
  const d = (e, t2, l2) => {
    const a = r.type, n = r.items.value.length;
    if (a !== "card" && l2 !== void 0 && (o.animating = e === t2 || e === l2), e !== t2 && n > 2 && r.loop && (e = function(e2, t3, l3) {
      return t3 === 0 && e2 === l3 - 1 ? -1 : t3 === l3 - 1 && e2 === 0 ? l3 : e2 < t3 - 1 && t3 - e2 >= l3 / 2 ? l3 + 1 : e2 > t3 + 1 && e2 - t3 >= l3 / 2 ? -2 : e2;
    }(e, t2, n)), a === "card")
      s.value === "vertical" && console.warn("[Element Warn][Carousel]vertical direction is not supported in card mode"), o.inStage = Math.round(Math.abs(e - t2)) <= 1, o.active = e === t2, o.translate = function(e2, t3) {
        const l3 = r.offsetWidth.value;
        return o.inStage ? l3 * (1.17 * (e2 - t3) + 1) / 4 : e2 < t3 ? -1.83 * l3 / 4 : 3.83 * l3 / 4;
      }(e, t2), o.scale = o.active ? 1 : 0.83;
    else {
      o.active = e === t2;
      const l3 = s.value === "vertical";
      o.translate = function(e2, t3, l4) {
        return r[l4 ? "offsetHeight" : "offsetWidth"].value * (e2 - t3);
      }(e, t2, l3);
    }
    o.ready = true;
  };
  return onMounted(() => {
    r.addItem && r.addItem(Object.assign(Object.assign(Object.assign({uid: l.uid}, t), toRefs(o)), {translateItem: d}));
  }), onUnmounted(() => {
    r.removeItem && r.removeItem(l.uid);
  }), {data: o, itemStyle: u, translateItem: d, type: r.type, handleItemClick: function() {
    if (r && r.type === "card") {
      const e = r.items.value.map((e2) => e2.uid).indexOf(l.uid);
      r.setActiveItem(e);
    }
  }};
}});
const kn = {key: 0, class: "el-carousel__mask"};
yn.render = function(e, t, l, a, n, o) {
  return withDirectives((openBlock(), createBlock("div", {class: ["el-carousel__item", {"is-active": e.data.active, "el-carousel__item--card": e.type === "card", "is-in-stage": e.data.inStage, "is-hover": e.data.hover, "is-animating": e.data.animating}], style: e.itemStyle, onClick: t[1] || (t[1] = (...t2) => e.handleItemClick && e.handleItemClick(...t2))}, [e.type === "card" ? withDirectives((openBlock(), createBlock("div", kn, null, 512)), [[vShow, !e.data.active]]) : createCommentVNode("v-if", true), renderSlot(e.$slots, "default")], 6)), [[vShow, e.data.ready]]);
}, yn.__file = "packages/carousel/src/item.vue", yn.install = (e) => {
  e.component(yn.name, yn);
};
const Cn = yn, xn = () => {
  const e = Ue(), t = inject("elForm", {}), l = inject("elFormItem", {}), a = inject("CheckboxGroup", {}), o = computed(() => a && (a == null ? void 0 : a.name) === "ElCheckboxGroup"), i = computed(() => l.size);
  return {isGroup: o, checkboxGroup: a, elForm: t, ELEMENT: e, elFormItemSize: i, elFormItem: l};
}, wn = (t) => {
  const {model: a, isLimitExceeded: i} = ((t2) => {
    let a2 = false;
    const {emit: o} = getCurrentInstance(), {isGroup: i2, checkboxGroup: r2} = xn(), s2 = ref(false), u2 = computed(() => {
      var e;
      return r2 ? (e = r2.modelValue) === null || e === void 0 ? void 0 : e.value : t2.modelValue;
    });
    return {model: computed({get() {
      var e;
      return i2.value ? u2.value : (e = t2.modelValue) !== null && e !== void 0 ? e : a2;
    }, set(e) {
      var t3;
      i2.value && Array.isArray(e) ? (s2.value = false, r2.min !== void 0 && e.length < r2.min.value && (s2.value = true), r2.max !== void 0 && e.length > r2.max.value && (s2.value = true), s2.value === false && ((t3 = r2 == null ? void 0 : r2.changeEvent) === null || t3 === void 0 || t3.call(r2, e))) : (o(qt, e), a2 = e);
    }}), isLimitExceeded: s2};
  })(t), {focus: r, size: s, isChecked: u, checkboxSize: d} = ((e, {model: t2}) => {
    const {isGroup: a2, checkboxGroup: o, elFormItemSize: i2, ELEMENT: r2} = xn(), s2 = ref(false), u2 = computed(() => {
      var e2;
      return ((e2 = o == null ? void 0 : o.checkboxGroupSize) === null || e2 === void 0 ? void 0 : e2.value) || i2.value || r2.size;
    });
    return {isChecked: computed(() => {
      const l = t2.value;
      return De(l) === "[object Boolean]" ? l : Array.isArray(l) ? l.includes(e.label) : l != null ? l === e.trueLabel : void 0;
    }), focus: s2, size: u2, checkboxSize: computed(() => {
      var t3;
      const l = e.size || i2.value || r2.size;
      return a2.value && ((t3 = o == null ? void 0 : o.checkboxGroupSize) === null || t3 === void 0 ? void 0 : t3.value) || l;
    })};
  })(t, {model: a}), {isDisabled: c} = ((e, {model: t2, isChecked: l}) => {
    const {elForm: a2, isGroup: o, checkboxGroup: i2} = xn(), r2 = computed(() => {
      var e2, a3;
      const n = (e2 = i2.max) === null || e2 === void 0 ? void 0 : e2.value, o2 = (a3 = i2.min) === null || a3 === void 0 ? void 0 : a3.value;
      return !(!n && !o2) && t2.value.length >= n && !l.value || t2.value.length <= o2 && l.value;
    });
    return {isDisabled: computed(() => {
      var t3;
      const l2 = e.disabled || a2.disabled;
      return o.value ? ((t3 = i2.disabled) === null || t3 === void 0 ? void 0 : t3.value) || l2 || r2.value : e.disabled || a2.disabled;
    }), isLimitDisabled: r2};
  })(t, {model: a, isChecked: u}), {handleChange: p2} = ((t2, {isLimitExceeded: l}) => {
    const {elFormItem: a2} = xn(), {emit: n} = getCurrentInstance();
    return watch(() => t2.modelValue, (e) => {
      var t3;
      (t3 = a2.formItemMitt) === null || t3 === void 0 || t3.emit("el.form.change", [e]);
    }), {handleChange: function(e) {
      var a3, o;
      if (l.value)
        return;
      const i2 = e.target.checked ? (a3 = t2.trueLabel) === null || a3 === void 0 || a3 : (o = t2.falseLabel) !== null && o !== void 0 && o;
      n("change", i2, e);
    }};
  })(t, {isLimitExceeded: i});
  return ((e, {model: t2}) => {
    e.checked && (Array.isArray(t2.value) && !t2.value.includes(e.label) ? t2.value.push(e.label) : t2.value = e.trueLabel || true);
  })(t, {model: a}), {isChecked: u, isDisabled: c, checkboxSize: d, model: a, handleChange: p2, focus: r, size: s};
};
var _n = defineComponent({name: "ElCheckbox", props: {modelValue: {type: [Boolean, Number, String], default: () => {
}}, label: {type: [Boolean, Number, String]}, indeterminate: Boolean, disabled: Boolean, checked: Boolean, name: {type: String, default: void 0}, trueLabel: {type: [String, Number], default: void 0}, falseLabel: {type: [String, Number], default: void 0}, id: {type: String, default: void 0}, controls: {type: String, default: void 0}, border: Boolean, size: {type: String, validator: Xt}}, emits: [qt, "change"], setup: (e) => wn(e)});
const Sn = createVNode("span", {class: "el-checkbox__inner"}, null, -1), En = {key: 0, class: "el-checkbox__label"};
_n.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("label", {id: e.id, class: ["el-checkbox", [e.border && e.checkboxSize ? "el-checkbox--" + e.checkboxSize : "", {"is-disabled": e.isDisabled}, {"is-bordered": e.border}, {"is-checked": e.isChecked}]], "aria-controls": e.indeterminate ? e.controls : null}, [createVNode("span", {class: ["el-checkbox__input", {"is-disabled": e.isDisabled, "is-checked": e.isChecked, "is-indeterminate": e.indeterminate, "is-focus": e.focus}], tabindex: !!e.indeterminate && 0, role: !!e.indeterminate && "checkbox", "aria-checked": !!e.indeterminate && "mixed"}, [Sn, e.trueLabel || e.falseLabel ? withDirectives((openBlock(), createBlock("input", {key: 0, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.model = t2), checked: e.isChecked, class: "el-checkbox__original", type: "checkbox", "aria-hidden": e.indeterminate ? "true" : "false", name: e.name, disabled: e.isDisabled, "true-value": e.trueLabel, "false-value": e.falseLabel, onChange: t[2] || (t[2] = (...t2) => e.handleChange && e.handleChange(...t2)), onFocus: t[3] || (t[3] = (t2) => e.focus = true), onBlur: t[4] || (t[4] = (t2) => e.focus = false)}, null, 40, ["checked", "aria-hidden", "name", "disabled", "true-value", "false-value"])), [[vModelCheckbox, e.model]]) : withDirectives((openBlock(), createBlock("input", {key: 1, "onUpdate:modelValue": t[5] || (t[5] = (t2) => e.model = t2), class: "el-checkbox__original", type: "checkbox", "aria-hidden": e.indeterminate ? "true" : "false", disabled: e.isDisabled, value: e.label, name: e.name, onChange: t[6] || (t[6] = (...t2) => e.handleChange && e.handleChange(...t2)), onFocus: t[7] || (t[7] = (t2) => e.focus = true), onBlur: t[8] || (t[8] = (t2) => e.focus = false)}, null, 40, ["aria-hidden", "disabled", "value", "name"])), [[vModelCheckbox, e.model]])], 10, ["tabindex", "role", "aria-checked"]), e.$slots.default || e.label ? (openBlock(), createBlock("span", En, [renderSlot(e.$slots, "default"), e.$slots.default ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Fragment, {key: 0}, [createTextVNode(toDisplayString(e.label), 1)], 2112))])) : createCommentVNode("v-if", true)], 10, ["id", "aria-controls"]);
}, _n.__file = "packages/checkbox/src/checkbox.vue", _n.install = (e) => {
  e.component(_n.name, _n);
};
const Mn = _n, Tn = () => {
  const e = Ue(), t = inject("elForm", {}), a = inject("elFormItem", {}), o = inject("RadioGroup", {}), i = ref(false), r = computed(() => (o == null ? void 0 : o.name) === "ElRadioGroup"), s = computed(() => a.size || e.size);
  return {isGroup: r, focus: i, radioGroup: o, elForm: t, ELEMENT: e, elFormItemSize: s};
}, Nn = (e, {isGroup: t, radioGroup: l, elForm: a, model: o}) => {
  const i = computed(() => t.value ? l.disabled || e.disabled || a.disabled : e.disabled || a.disabled), r = computed(() => i.value || t.value && o.value !== e.label ? -1 : 0);
  return {isDisabled: i, tabIndex: r};
};
var Dn = defineComponent({name: "ElRadio", componentName: "ElRadio", props: {modelValue: {type: [String, Number, Boolean], default: ""}, label: {type: [String, Number, Boolean], default: ""}, disabled: Boolean, name: {type: String, default: ""}, border: Boolean, size: {type: String, validator: Xt}}, emits: [qt, "change"], setup(e, t) {
  const {isGroup: a, radioGroup: o, elFormItemSize: i, ELEMENT: r, focus: s, elForm: u} = Tn(), d = ref(), c = computed({get: () => a.value ? o.modelValue : e.modelValue, set(l) {
    a.value ? o.changeEvent(l) : t.emit(qt, l), d.value.checked = e.modelValue === e.label;
  }}), {tabIndex: p2, isDisabled: h2} = Nn(e, {isGroup: a, radioGroup: o, elForm: u, model: c}), v = computed(() => {
    const t2 = e.size || i.value || r.size;
    return a.value && o.radioGroupSize || t2;
  });
  return {focus: s, isGroup: a, isDisabled: h2, model: c, tabIndex: p2, radioSize: v, handleChange: function() {
    nextTick(() => {
      t.emit("change", c.value);
    });
  }, radioRef: d};
}});
const On = createVNode("span", {class: "el-radio__inner"}, null, -1);
Dn.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("label", {class: ["el-radio", {["el-radio--" + (e.radioSize || "")]: e.border && e.radioSize, "is-disabled": e.isDisabled, "is-focus": e.focus, "is-bordered": e.border, "is-checked": e.model === e.label}], role: "radio", "aria-checked": e.model === e.label, "aria-disabled": e.isDisabled, tabindex: e.tabIndex, onKeydown: t[6] || (t[6] = withKeys(withModifiers((t2) => e.model = e.isDisabled ? e.model : e.label, ["stop", "prevent"]), ["space"]))}, [createVNode("span", {class: ["el-radio__input", {"is-disabled": e.isDisabled, "is-checked": e.model === e.label}]}, [On, withDirectives(createVNode("input", {ref: "radioRef", "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.model = t2), class: "el-radio__original", value: e.label, type: "radio", "aria-hidden": "true", name: e.name, disabled: e.isDisabled, tabindex: "-1", onFocus: t[2] || (t[2] = (t2) => e.focus = true), onBlur: t[3] || (t[3] = (t2) => e.focus = false), onChange: t[4] || (t[4] = (...t2) => e.handleChange && e.handleChange(...t2))}, null, 40, ["value", "name", "disabled"]), [[vModelRadio, e.model]])], 2), createVNode("span", {class: "el-radio__label", onKeydown: t[5] || (t[5] = withModifiers(() => {
  }, ["stop"]))}, [renderSlot(e.$slots, "default", {}, () => [createTextVNode(toDisplayString(e.label), 1)])], 32)], 42, ["aria-checked", "aria-disabled", "tabindex"]);
}, Dn.__file = "packages/radio/src/radio.vue", Dn.install = (e) => {
  e.component(Dn.name, Dn);
};
const In = Dn;
var Pn;
!function(e) {
  e.CLICK = "click", e.HOVER = "hover";
}(Pn || (Pn = {}));
const Vn = Symbol();
var Bn = defineComponent({name: "ElCascaderNode", components: {ElCheckbox: Mn, ElRadio: In, NodeContent: {render() {
  const {node: e, panel: t} = this.$parent, {data: l, label: a} = e, {renderLabelFn: n} = t;
  return h("span", {class: "el-cascader-node__label"}, n ? n({node: e, data: l}) : a);
}}}, props: {node: {type: Object, required: true}, menuId: String}, emits: ["expand"], setup(e, {emit: t}) {
  const l = inject(Vn), a = computed(() => l.isHoverMenu), o = computed(() => l.config.multiple), i = computed(() => l.config.checkStrictly), r = computed(() => {
    var e2;
    return (e2 = l.checkedNodes[0]) === null || e2 === void 0 ? void 0 : e2.uid;
  }), s = computed(() => e.node.isDisabled), u = computed(() => e.node.isLeaf), d = computed(() => i.value && !u.value || !s.value), c = computed(() => h2(l.expandingNode)), p2 = computed(() => i.value && l.checkedNodes.some(h2)), h2 = (t2) => {
    var l2;
    const {level: a2, uid: n} = e.node;
    return ((l2 = t2 == null ? void 0 : t2.pathNodes[a2 - 1]) === null || l2 === void 0 ? void 0 : l2.uid) === n;
  }, v = () => {
    c.value || l.expandNode(e.node);
  }, m = () => {
    l.lazyLoad(e.node, () => {
      u.value || v();
    });
  }, f = () => {
    const {node: t2} = e;
    d.value && !t2.loading && (t2.loaded ? v() : m());
  }, g = (t2) => {
    e.node.loaded ? (((t3) => {
      const {node: a2} = e;
      t3 !== a2.checked && l.handleCheckChange(a2, t3);
    })(t2), !i.value && v()) : m();
  };
  return {panel: l, isHoverMenu: a, multiple: o, checkStrictly: i, checkedNodeId: r, isDisabled: s, isLeaf: u, expandable: d, inExpandingPath: c, inCheckedPath: p2, handleHoverExpand: (e2) => {
    a.value && (f(), !u.value && t("expand", e2));
  }, handleExpand: f, handleClick: () => {
    a.value && !u.value || (!u.value || s.value || i.value || o.value ? f() : g(true));
  }, handleCheck: g};
}});
const An = createVNode("span", null, null, -1), Ln = {key: 2, class: "el-icon-check el-cascader-node__prefix"}, zn = {key: 0, class: "el-icon-loading el-cascader-node__postfix"}, Fn = {key: 1, class: "el-icon-arrow-right el-cascader-node__postfix"};
Bn.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-checkbox"), r = resolveComponent("el-radio"), c = resolveComponent("node-content");
  return openBlock(), createBlock("li", {id: `${e.menuId}-${e.node.uid}`, role: "menuitem", "aria-haspopup": !e.isLeaf, "aria-owns": e.isLeaf ? null : e.menuId, "aria-expanded": e.inExpandingPath, tabindex: e.expandable ? -1 : null, class: ["el-cascader-node", e.checkStrictly && "is-selectable", e.inExpandingPath && "in-active-path", e.inCheckedPath && "in-checked-path", e.node.checked && "is-active", !e.expandable && "is-disabled"], onMouseenter: t[3] || (t[3] = (...t2) => e.handleHoverExpand && e.handleHoverExpand(...t2)), onFocus: t[4] || (t[4] = (...t2) => e.handleHoverExpand && e.handleHoverExpand(...t2)), onClick: t[5] || (t[5] = (...t2) => e.handleClick && e.handleClick(...t2))}, [createCommentVNode(" prefix "), e.multiple ? (openBlock(), createBlock(i, {key: 0, "model-value": e.node.checked, indeterminate: e.node.indeterminate, disabled: e.isDisabled, onClick: t[1] || (t[1] = withModifiers(() => {
  }, ["stop"])), "onUpdate:modelValue": e.handleCheck}, null, 8, ["model-value", "indeterminate", "disabled", "onUpdate:modelValue"])) : e.checkStrictly ? (openBlock(), createBlock(r, {key: 1, "model-value": e.checkedNodeId, label: e.node.uid, disabled: e.isDisabled, "onUpdate:modelValue": e.handleCheck, onClick: t[2] || (t[2] = withModifiers(() => {
  }, ["stop"]))}, {default: withCtx(() => [createCommentVNode("\n        Add an empty element to avoid render label,\n        do not use empty fragment here for https://github.com/vuejs/vue-next/pull/2485\n      "), An]), _: 1}, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])) : e.isLeaf && e.node.checked ? (openBlock(), createBlock("i", Ln)) : createCommentVNode("v-if", true), createCommentVNode(" content "), createVNode(c), createCommentVNode(" postfix "), e.isLeaf ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Fragment, {key: 3}, [e.node.loading ? (openBlock(), createBlock("i", zn)) : (openBlock(), createBlock("i", Fn))], 2112))], 42, ["id", "aria-haspopup", "aria-owns", "aria-expanded", "tabindex"]);
}, Bn.__file = "packages/cascader-panel/src/node.vue";
var $n = defineComponent({name: "ElCascaderMenu", components: {ElScrollbar: yl, ElCascaderNode: Bn}, props: {nodes: {type: Array, required: true}, index: {type: Number, required: true}}, setup(t) {
  const a = getCurrentInstance(), o = Re();
  let i = null, r = null;
  const s = inject(Vn), u = ref(null), d = computed(() => !t.nodes.length), c = computed(() => `cascader-menu-${o}-${t.index}`), p2 = () => {
    r && (clearTimeout(r), r = null);
  }, h2 = () => {
    u.value && (u.value.innerHTML = "", p2());
  };
  return {panel: s, hoverZone: u, isEmpty: d, menuId: c, t: ya, handleExpand: (e) => {
    i = e.target;
  }, handleMouseMove: (e) => {
    if (s.isHoverMenu && i && u.value)
      if (i.contains(e.target)) {
        p2();
        const t2 = a.vnode.el, {left: l} = t2.getBoundingClientRect(), {offsetWidth: n, offsetHeight: o2} = t2, r2 = e.clientX - l, s2 = i.offsetTop, d2 = s2 + i.offsetHeight;
        u.value.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${r2} ${s2} L${n} 0 V${s2} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${r2} ${d2} L${n} ${o2} V${d2} Z" />
        `;
      } else
        r || (r = window.setTimeout(h2, s.config.hoverThreshold));
  }, clearHoverZone: h2};
}});
const Rn = {key: 0, class: "el-cascader-menu__empty-text"}, Hn = {key: 1, ref: "hoverZone", class: "el-cascader-menu__hover-zone"};
$n.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-cascader-node"), r = resolveComponent("el-scrollbar");
  return openBlock(), createBlock(r, {id: e.menuId, tag: "ul", role: "menu", class: "el-cascader-menu", "wrap-class": "el-cascader-menu__wrap", "view-class": ["el-cascader-menu__list", e.isEmpty && "is-empty"], onMousemove: e.handleMouseMove, onMouseleave: e.clearHoverZone}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.nodes, (t2) => (openBlock(), createBlock(i, {key: t2.uid, node: t2, "menu-id": e.menuId, onExpand: e.handleExpand}, null, 8, ["node", "menu-id", "onExpand"]))), 128)), e.isEmpty ? (openBlock(), createBlock("div", Rn, toDisplayString(e.t("el.cascader.noData")), 1)) : e.panel.isHoverMenu ? (openBlock(), createBlock("svg", Hn, null, 512)) : createCommentVNode("v-if", true)]), _: 1}, 8, ["id", "view-class", "onMousemove", "onMouseleave"]);
}, $n.__file = "packages/cascader-panel/src/menu.vue";
let Wn = 0;
class jn {
  constructor(e, t, l, a = false) {
    this.data = e, this.config = t, this.parent = l, this.root = a, this.uid = Wn++, this.checked = false, this.indeterminate = false, this.loading = false;
    const {value: n, label: o, children: i} = t, r = e[i], s = ((e2) => {
      const t2 = [e2];
      let {parent: l2} = e2;
      for (; l2; )
        t2.unshift(l2), l2 = l2.parent;
      return t2;
    })(this);
    this.level = a ? 0 : l ? l.level + 1 : 1, this.value = e[n], this.label = e[o], this.pathNodes = s, this.pathValues = s.map((e2) => e2.value), this.pathLabels = s.map((e2) => e2.label), this.childrenData = r, this.children = (r || []).map((e2) => new jn(e2, t, this)), this.loaded = !t.lazy || this.isLeaf || !Xe(r);
  }
  get isDisabled() {
    const {data: e, parent: t, config: l} = this, {disabled: a, checkStrictly: n} = l;
    return (Se(a) ? a(e, this) : !!e[a]) || !n && (t == null ? void 0 : t.isDisabled);
  }
  get isLeaf() {
    const {data: e, config: t, childrenData: l, loaded: a} = this, {lazy: n, leaf: o} = t, i = Se(o) ? o(e, this) : e[o];
    return i === void 0 ? !(n && !a) && !Array.isArray(l) : !!i;
  }
  get valueByOption() {
    return this.config.emitPath ? this.pathValues : this.value;
  }
  appendChild(e) {
    const {childrenData: t, children: l} = this, a = new jn(e, this.config, this);
    return Array.isArray(t) ? t.push(e) : this.childrenData = [e], l.push(a), a;
  }
  calcText(e, t) {
    const l = e ? this.pathLabels.join(t) : this.label;
    return this.text = l, l;
  }
  broadcast(e, ...t) {
    const l = "onParent" + Be(e);
    this.children.forEach((a) => {
      a && (a.broadcast(e, ...t), a[l] && a[l](...t));
    });
  }
  emit(e, ...t) {
    const {parent: l} = this, a = "onChild" + Be(e);
    l && (l[a] && l[a](...t), l.emit(e, ...t));
  }
  onParentCheck(e) {
    this.isDisabled || this.setCheckState(e);
  }
  onChildCheck() {
    const {children: e} = this, t = e.filter((e2) => !e2.isDisabled), l = !!t.length && t.every((e2) => e2.checked);
    this.setCheckState(l);
  }
  setCheckState(e) {
    const t = this.children.length, l = this.children.reduce((e2, t2) => e2 + (t2.checked ? 1 : t2.indeterminate ? 0.5 : 0), 0);
    this.checked = this.loaded && this.children.every((e2) => e2.loaded && e2.checked) && e, this.indeterminate = this.loaded && l !== t && l > 0;
  }
  doCheck(e) {
    if (this.checked === e)
      return;
    const {checkStrictly: t, multiple: l} = this.config;
    t || !l ? this.checked = e : (this.broadcast("check", e), this.setCheckState(e), this.emit("check"));
  }
}
const Kn = (e, t) => e.reduce((e2, l) => (l.isLeaf ? e2.push(l) : (!t && e2.push(l), e2 = e2.concat(Kn(l.children, t))), e2), []);
class Yn {
  constructor(e, t) {
    this.config = t;
    const l = (e || []).map((e2) => new jn(e2, this.config));
    this.nodes = l, this.allNodes = Kn(l, false), this.leafNodes = Kn(l, true);
  }
  getNodes() {
    return this.nodes;
  }
  getFlattedNodes(e) {
    return e ? this.leafNodes : this.allNodes;
  }
  appendNode(e, t) {
    const l = t ? t.appendChild(e) : new jn(e, this.config);
    t || this.nodes.push(l), this.allNodes.push(l), l.isLeaf && this.leafNodes.push(l);
  }
  appendNodes(e, t) {
    e.forEach((e2) => this.appendNode(e2, t));
  }
  getNodeByValue(e, t = false) {
    if (!e && e !== 0)
      return null;
    return this.getFlattedNodes(t).filter((t2) => t2.value === e || isEqual_1(t2.pathValues, e))[0] || null;
  }
  getSameNode(e) {
    if (!e)
      return null;
    return this.getFlattedNodes(false).filter(({value: t, level: l}) => e.value === t && e.level === l)[0] || null;
  }
}
function qn(e, t) {
  if (ye)
    return;
  if (!t)
    return void (e.scrollTop = 0);
  const l = [];
  let a = t.offsetParent;
  for (; a !== null && e !== a && e.contains(a); )
    l.push(a), a = a.offsetParent;
  const n = t.offsetTop + l.reduce((e2, t2) => e2 + t2.offsetTop, 0), o = n + t.offsetHeight, i = e.scrollTop, r = i + e.clientHeight;
  n < i ? e.scrollTop = n : o > r && (e.scrollTop = o - e.clientHeight);
}
const Un = {modelValue: [Number, String, Array], options: {type: Array, default: () => []}, props: {type: Object, default: () => ({})}}, Gn = {expandTrigger: Pn.CLICK, multiple: false, checkStrictly: false, emitPath: true, lazy: false, lazyLoad: ke, value: "value", label: "label", children: "children", leaf: "leaf", disabled: "disabled", hoverThreshold: 500}, Xn = (e) => !e.getAttribute("aria-owns"), Zn = (e) => {
  if (!e)
    return 0;
  const t = e.id.split("-");
  return Number(t[t.length - 2]);
}, Qn = (e) => {
  e && (e.focus(), !Xn(e) && e.click());
};
var Jn = defineComponent({name: "ElCascaderPanel", components: {ElCascaderMenu: $n}, props: Object.assign(Object.assign({}, Un), {border: {type: Boolean, default: true}, renderLabel: Function}), emits: [qt, "change", "close", "expand-change"], setup(e, {emit: t, slots: r}) {
  let s = true, u = false;
  const d = ((e2) => computed(() => Object.assign(Object.assign({}, Gn), e2.props)))(e), c = ref(null), p2 = ref([]), h2 = ref(null), v = ref([]), m = ref(null), f = ref([]), g = computed(() => d.value.expandTrigger === Pn.HOVER), b = computed(() => e.renderLabel || r.default), y = (e2, t2) => {
    const l = d.value;
    (e2 = e2 || new jn({}, l, null, true)).loading = true;
    l.lazyLoad(e2, (l2) => {
      const a = e2.root ? null : e2;
      l2 && c.value.appendNodes(l2, a), e2.loading = false, e2.loaded = true, t2 && t2(l2);
    });
  }, k = (e2, l) => {
    var a;
    const {level: n} = e2, o = v.value.slice(0, n);
    let i;
    e2.isLeaf ? i = e2.pathNodes[n - 2] : (i = e2, o.push(e2.children)), ((a = m.value) === null || a === void 0 ? void 0 : a.uid) !== (i == null ? void 0 : i.uid) && (m.value = e2, v.value = o, !l && t("expand-change", (e2 == null ? void 0 : e2.pathValues) || []));
  }, C = (e2, l, a = true) => {
    const {checkStrictly: n, multiple: o} = d.value, i = f.value[0];
    u = true, !o && (i == null || i.doCheck(false)), e2.doCheck(l), E(), a && !o && !n && t("close");
  }, x = (e2) => c.value.getFlattedNodes(e2), _ = (e2) => x(e2).filter((e3) => e3.checked !== false), E = () => {
    var e2;
    const {checkStrictly: t2, multiple: l} = d.value, a = ((e3, t3) => {
      const l2 = t3.slice(0), a2 = l2.map((e4) => e4.uid), n2 = e3.reduce((e4, t4) => {
        const n3 = a2.indexOf(t4.uid);
        return n3 > -1 && (e4.push(t4), l2.splice(n3, 1), a2.splice(n3, 1)), e4;
      }, []);
      return n2.push(...l2), n2;
    })(f.value, _(!t2)), n = a.map((e3) => e3.valueByOption);
    f.value = a, h2.value = l ? n : (e2 = n[0]) !== null && e2 !== void 0 ? e2 : null;
  }, M = (t2 = false, l = false) => {
    const {modelValue: a} = e, {lazy: n, multiple: o, checkStrictly: i} = d.value, r2 = !i;
    if (s && !u && (l || !isEqual_1(a, h2.value)))
      if (n && !t2) {
        const e2 = Qe(Ze(He(a))).map((e3) => c.value.getNodeByValue(e3)).filter((e3) => !!e3 && !e3.loaded && !e3.loading);
        e2.length ? e2.forEach((e3) => {
          y(e3, () => M(false, l));
        }) : M(true, l);
      } else {
        const e2 = Qe((o ? He(a) : [a]).map((e3) => c.value.getNodeByValue(e3, r2)));
        T(e2, false), h2.value = a;
      }
  }, T = (e2, t2 = true) => {
    const {checkStrictly: l} = d.value, a = f.value, n = e2.filter((e3) => !!e3 && (l || e3.isLeaf)), o = c.value.getSameNode(m.value), i = t2 && o || n[0];
    i ? i.pathNodes.forEach((e3) => k(e3, true)) : m.value = null, a.forEach((e3) => e3.doCheck(false)), n.forEach((e3) => e3.doCheck(true)), f.value = n, nextTick(N);
  }, N = () => {
    ye || p2.value.forEach((e2) => {
      const t2 = e2 == null ? void 0 : e2.$el;
      if (t2) {
        qn(t2.querySelector(".el-scrollbar__wrap"), t2.querySelector(".el-cascader-node.is-active") || t2.querySelector(".el-cascader-node.in-active-path"));
      }
    });
  };
  return provide(Vn, reactive({config: d, expandingNode: m, checkedNodes: f, isHoverMenu: g, renderLabelFn: b, lazyLoad: y, expandNode: k, handleCheckChange: C})), watch([d, () => e.options], () => {
    const {options: t2} = e, l = d.value;
    u = false, c.value = new Yn(t2, l), v.value = [c.value.getNodes()], l.lazy && Xe(e.options) ? (s = false, y(null, () => {
      s = true, M(false, true);
    })) : M(false, true);
  }, {deep: true, immediate: true}), watch(() => e.modelValue, () => {
    u = false, M();
  }), watch(h2, (l) => {
    isEqual_1(l, e.modelValue) || (t(qt, l), t("change", l));
  }), onBeforeUpdate(() => p2.value = []), onMounted(() => !Xe(e.modelValue) && M()), {menuList: p2, menus: v, checkedNodes: f, handleKeyDown: (e2) => {
    const l = e2.target, {code: a} = e2;
    switch (a) {
      case Dt.up:
      case Dt.down:
        const e3 = a === Dt.up ? -1 : 1;
        Qn(((e4, t2) => {
          const {parentNode: l2} = e4;
          if (!l2)
            return null;
          const a2 = l2.querySelectorAll('.el-cascader-node[tabindex="-1"]');
          return a2[Array.prototype.indexOf.call(a2, e4) + t2] || null;
        })(l, e3));
        break;
      case Dt.left:
        const n = p2.value[Zn(l) - 1], o = n == null ? void 0 : n.$el.querySelector('.el-cascader-node[aria-expanded="true"]');
        Qn(o);
        break;
      case Dt.right:
        const i = p2.value[Zn(l) + 1], r2 = i == null ? void 0 : i.$el.querySelector('.el-cascader-node[tabindex="-1"]');
        Qn(r2);
        break;
      case Dt.enter:
        ((e4) => {
          if (!e4)
            return;
          const t2 = e4.querySelector("input");
          t2 ? t2.click() : Xn(e4) && e4.click();
        })(l);
        break;
      case Dt.esc:
      case Dt.tab:
        t("close");
    }
  }, handleCheckChange: C, getFlattedNodes: x, getCheckedNodes: _, clearCheckedNodes: () => {
    f.value.forEach((e2) => e2.doCheck(false)), E();
  }, calculateCheckedValue: E, scrollToExpandingNode: N};
}});
Jn.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-cascader-menu");
  return openBlock(), createBlock("div", {class: ["el-cascader-panel", e.border && "is-bordered"], onKeydown: t[1] || (t[1] = (...t2) => e.handleKeyDown && e.handleKeyDown(...t2))}, [(openBlock(true), createBlock(Fragment, null, renderList(e.menus, (t2, l2) => (openBlock(), createBlock(i, {key: l2, ref: (t3) => e.menuList[l2] = t3, index: l2, nodes: t2}, null, 8, ["index", "nodes"]))), 128))], 34);
}, Jn.__file = "packages/cascader-panel/src/index.vue", Jn.install = (e) => {
  e.component(Jn.name, Jn);
};
const eo = Jn;
var to = defineComponent({name: "ElTag", props: {closable: Boolean, type: {type: String, default: ""}, hit: Boolean, disableTransitions: Boolean, color: {type: String, default: ""}, size: {type: String, validator: Xt}, effect: {type: String, default: "light", validator: (e) => ["dark", "light", "plain"].indexOf(e) !== -1}}, emits: ["close", "click"], setup(e, t) {
  const l = Ue(), a = computed(() => e.size || l.size), o = computed(() => {
    const {type: t2, hit: l2, effect: n} = e;
    return ["el-tag", t2 ? "el-tag--" + t2 : "", a.value ? "el-tag--" + a.value : "", n ? "el-tag--" + n : "", l2 && "is-hit"];
  });
  return {tagSize: a, classes: o, handleClose: (e2) => {
    e2.stopPropagation(), t.emit("close", e2);
  }, handleClick: (e2) => {
    t.emit("click", e2);
  }};
}});
to.render = function(e, t, l, a, n, o) {
  return e.disableTransitions ? (openBlock(), createBlock(Transition, {key: 1, name: "el-zoom-in-center"}, {default: withCtx(() => [createVNode("span", {class: e.classes, style: {backgroundColor: e.color}, onClick: t[4] || (t[4] = (...t2) => e.handleClick && e.handleClick(...t2))}, [renderSlot(e.$slots, "default"), e.closable ? (openBlock(), createBlock("i", {key: 0, class: "el-tag__close el-icon-close", onClick: t[3] || (t[3] = (...t2) => e.handleClose && e.handleClose(...t2))})) : createCommentVNode("v-if", true)], 6)]), _: 3})) : (openBlock(), createBlock("span", {key: 0, class: e.classes, style: {backgroundColor: e.color}, onClick: t[2] || (t[2] = (...t2) => e.handleClick && e.handleClick(...t2))}, [renderSlot(e.$slots, "default"), e.closable ? (openBlock(), createBlock("i", {key: 0, class: "el-tag__close el-icon-close", onClick: t[1] || (t[1] = (...t2) => e.handleClose && e.handleClose(...t2))})) : createCommentVNode("v-if", true)], 6));
}, to.__file = "packages/tag/src/index.vue", to.install = (e) => {
  e.component(to.name, to);
};
const lo = to, ao = {medium: 36, small: 32, mini: 28}, no = {modifiers: [{name: "arrowPosition", enabled: true, phase: "main", fn: ({state: e}) => {
  const {modifiersData: t, elements: l} = e, {reference: a, arrow: n} = l;
  t.arrow.x = t.arrow.x - (a.clientWidth - n.clientWidth) / 2 + 35;
}, requires: ["arrow"]}]};
var oo = defineComponent({name: "ElCascader", components: {ElCascaderPanel: eo, ElInput: vl, ElPopper: Hl, ElScrollbar: yl, ElTag: lo}, directives: {Clickoutside: $t}, props: Object.assign(Object.assign({}, Un), {size: {type: String, validator: Xt}, placeholder: {type: String, default: () => ya("el.cascader.placeholder")}, disabled: Boolean, clearable: Boolean, filterable: Boolean, filterMethod: {type: Function, default: (e, t) => e.text.includes(t)}, separator: {type: String, default: " / "}, showAllLevels: {type: Boolean, default: true}, collapseTags: Boolean, debounce: {type: Number, default: 300}, beforeFilter: {type: Function, default: () => true}, popperClass: {type: String, default: ""}}), emits: [qt, "change", "focus", "blur", "visible-change", "expand-change", "remove-tag"], setup(e, {emit: t}) {
  let a = 0, s = 0;
  const u = Ue(), d = inject("elForm", {}), c = inject("elFormItem", {}), p2 = ref(null), h2 = ref(null), v = ref(null), m = ref(null), f = ref(null), g = ref(false), b = ref(false), y = ref(false), k = ref(""), C = ref(""), x = ref([]), _ = ref([]), S = computed(() => e.disabled || d.disabled), M = computed(() => e.size || c.size || u.size), T = computed(() => ["small", "mini"].includes(M.value) ? "mini" : "small"), N = computed(() => !!e.props.multiple), D = computed(() => !e.filterable || N.value), O = computed(() => N.value ? C.value : k.value), I = computed(() => {
    var e2;
    return ((e2 = m.value) === null || e2 === void 0 ? void 0 : e2.checkedNodes) || [];
  }), P = computed(() => !(!e.clearable || S.value || y.value || !b.value) && !!I.value.length), V = computed(() => {
    const {showAllLevels: t2, separator: l} = e, a2 = I.value;
    return a2.length ? N.value ? " " : a2[0].calcText(t2, l) : "";
  }), B = computed({get: () => e.modelValue, set(e2) {
    var l;
    t(qt, e2), t("change", e2), (l = c.formItemMitt) === null || l === void 0 || l.emit("el.form.change", [e2]);
  }}), A = computed(() => {
    var e2;
    return (e2 = p2.value) === null || e2 === void 0 ? void 0 : e2.popperRef;
  }), L = (l) => {
    if (!S.value && (l = l != null ? l : !g.value) !== g.value) {
      if (g.value = l, h2.value.input.setAttribute("aria-expanded", l), l)
        z(), nextTick(m.value.scrollToExpandingNode);
      else if (e.filterable) {
        const {value: e2} = V;
        k.value = e2, C.value = e2;
      }
      t("visible-change", l);
    }
  }, z = () => {
    nextTick(p2.value.update);
  }, F = () => {
    y.value = false;
  }, $ = (t2) => {
    const {showAllLevels: l, separator: a2} = e;
    return {node: t2, key: t2.uid, text: t2.calcText(l, a2), hitState: false, closable: !S.value && !t2.isDisabled};
  }, R = (e2) => {
    const {node: l} = e2;
    l.doCheck(false), m.value.calculateCheckedValue(), t("remove-tag", l.valueByOption);
  }, H = () => {
    const {filterMethod: t2, showAllLevels: l, separator: a2} = e, n = m.value.getFlattedNodes(!e.props.checkStrictly).filter((e2) => !e2.isDisabled && (e2.calcText(l, a2), t2(e2, O.value)));
    N.value && x.value.forEach((e2) => {
      e2.hitState = false;
    }), y.value = true, _.value = n, z();
  }, W = () => {
    var e2;
    let t2 = null;
    t2 = y.value && f.value ? f.value.$el.querySelector(".el-cascader__suggestion-item") : (e2 = m.value) === null || e2 === void 0 ? void 0 : e2.$el.querySelector('.el-cascader-node[tabindex="-1"]'), t2 && (t2.focus(), !y.value && t2.click());
  }, j = () => {
    var e2;
    const t2 = h2.value.input, l = v.value, n = (e2 = f.value) === null || e2 === void 0 ? void 0 : e2.$el;
    if (!ye && t2) {
      if (n) {
        n.querySelector(".el-cascader__suggestion-list").style.minWidth = t2.offsetWidth + "px";
      }
      if (l) {
        const {offsetHeight: e3} = l, n2 = Math.max(e3 + 6, a) + "px";
        t2.style.height = n2, z();
      }
    }
  }, K = debounce_1(() => {
    const {value: t2} = O;
    if (!t2)
      return;
    const l = e.beforeFilter(t2);
    Te(l) ? l.then(H).catch(() => {
    }) : l !== false ? H() : F();
  }, e.debounce);
  return watch(y, z), watch([I, S], () => {
    if (!N.value)
      return;
    const t2 = I.value, l = [];
    if (t2.length) {
      const [a2, ...n] = t2, o = n.length;
      l.push($(a2)), o && (e.collapseTags ? l.push({key: -1, text: "+ " + o, closable: false}) : n.forEach((e2) => l.push($(e2))));
    }
    x.value = l;
  }), watch(x, () => nextTick(j)), watch(V, (e2) => k.value = e2, {immediate: true}), onMounted(() => {
    const e2 = h2.value.$el;
    a = (e2 == null ? void 0 : e2.offsetHeight) || ao[M.value] || 40, pt(e2, j);
  }), onBeforeUnmount(() => {
    ht(h2.value.$el, j);
  }), {popperOptions: no, popper: p2, popperPaneRef: A, input: h2, tagWrapper: v, panel: m, suggestionPanel: f, popperVisible: g, inputHover: b, filtering: y, presentText: V, checkedValue: B, inputValue: k, searchInputValue: C, presentTags: x, suggestions: _, isDisabled: S, realSize: M, tagSize: T, multiple: N, readonly: D, clearBtnVisible: P, t: ya, togglePopperVisible: L, hideSuggestionPanel: F, deleteTag: R, focusFirstNode: W, getCheckedNodes: (e2) => m.value.getCheckedNodes(e2), handleExpandChange: (e2) => {
    z(), t("expand-change", e2);
  }, handleKeyDown: (e2) => {
    switch (e2.code) {
      case Dt.enter:
        L();
        break;
      case Dt.down:
        L(true), nextTick(W), event.preventDefault();
        break;
      case Dt.esc:
      case Dt.tab:
        L(false);
    }
  }, handleClear: () => {
    m.value.clearCheckedNodes(), L(false);
  }, handleSuggestionClick: (e2) => {
    const {checked: t2} = e2;
    N.value ? m.value.handleCheckChange(e2, !t2, false) : (!t2 && m.value.handleCheckChange(e2, true, false), L(false));
  }, handleDelete: () => {
    const e2 = x.value, t2 = e2[e2.length - 1];
    s = C.value ? 0 : s + 1, t2 && s && (t2.hitState ? R(t2) : t2.hitState = true);
  }, handleInput: (e2, t2) => {
    !g.value && L(true), (t2 == null ? void 0 : t2.isComposing) || (e2 ? K() : F());
  }};
}});
const io = {key: 0, ref: "tagWrapper", class: "el-cascader__tags"}, ro = {key: 0, class: "el-icon-check"}, so = {class: "el-cascader__empty-text"};
oo.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("el-tag"), p2 = resolveComponent("el-cascader-panel"), f = resolveComponent("el-scrollbar"), y = resolveComponent("el-popper"), k = resolveDirective("clickoutside");
  return openBlock(), createBlock(y, {ref: "popper", visible: e.popperVisible, "onUpdate:visible": t[16] || (t[16] = (t2) => e.popperVisible = t2), "manual-mode": "", placement: "bottom-start", "popper-class": "el-cascader__dropdown " + e.popperClass, "popper-options": e.popperOptions, "stop-popper-mouse-event": false, transition: "el-zoom-in-top", "gpu-acceleration": false, effect: "light", pure: "", onAfterLeave: e.hideSuggestionPanel}, {trigger: withCtx(() => [withDirectives(createVNode("div", {class: ["el-cascader", e.realSize && "el-cascader--" + e.realSize, {"is-disabled": e.isDisabled}], onClick: t[10] || (t[10] = () => e.togglePopperVisible(!e.readonly || void 0)), onKeydown: t[11] || (t[11] = (...t2) => e.handleKeyDown && e.handleKeyDown(...t2)), onMouseenter: t[12] || (t[12] = (t2) => e.inputHover = true), onMouseleave: t[13] || (t[13] = (t2) => e.inputHover = false)}, [createVNode(i, {ref: "input", modelValue: e.inputValue, "onUpdate:modelValue": t[3] || (t[3] = (t2) => e.inputValue = t2), modelModifiers: {trim: true}, placeholder: e.placeholder, readonly: e.readonly, disabled: e.isDisabled, "validate-event": false, size: e.realSize, class: {"is-focus": e.popperVisible}, onFocus: t[4] || (t[4] = (t2) => e.$emit("focus", t2)), onBlur: t[5] || (t[5] = (t2) => e.$emit("blur", t2)), onInput: e.handleInput}, {suffix: withCtx(() => [e.clearBtnVisible ? (openBlock(), createBlock("i", {key: "clear", class: "el-input__icon el-icon-circle-close", onClick: t[1] || (t[1] = withModifiers((...t2) => e.handleClear && e.handleClear(...t2), ["stop"]))})) : (openBlock(), createBlock("i", {key: "arrow-down", class: ["el-input__icon", "el-icon-arrow-down", e.popperVisible && "is-reverse"], onClick: t[2] || (t[2] = withModifiers((t2) => e.togglePopperVisible(), ["stop"]))}, null, 2))]), _: 1}, 8, ["modelValue", "placeholder", "readonly", "disabled", "size", "class", "onInput"]), e.multiple ? (openBlock(), createBlock("div", io, [(openBlock(true), createBlock(Fragment, null, renderList(e.presentTags, (t2) => (openBlock(), createBlock(r, {key: t2.key, type: "info", size: e.tagSize, hit: t2.hitState, closable: t2.closable, "disable-transitions": "", onClose: (l2) => e.deleteTag(t2)}, {default: withCtx(() => [createVNode("span", null, toDisplayString(t2.text), 1)]), _: 2}, 1032, ["size", "hit", "closable", "onClose"]))), 128)), e.filterable && !e.isDisabled ? withDirectives((openBlock(), createBlock("input", {key: 0, "onUpdate:modelValue": t[6] || (t[6] = (t2) => e.searchInputValue = t2), type: "text", class: "el-cascader__search-input", placeholder: e.presentText ? "" : e.placeholder, onInput: t[7] || (t[7] = (t2) => e.handleInput(e.searchInputValue, t2)), onClick: t[8] || (t[8] = withModifiers((t2) => e.togglePopperVisible(true), ["stop"])), onKeydown: t[9] || (t[9] = withKeys((...t2) => e.handleDelete && e.handleDelete(...t2), ["delete"]))}, null, 40, ["placeholder"])), [[vModelText, e.searchInputValue, void 0, {trim: true}]]) : createCommentVNode("v-if", true)], 512)) : createCommentVNode("v-if", true)], 34), [[k, () => e.togglePopperVisible(false), e.popperPaneRef]])]), default: withCtx(() => [withDirectives(createVNode(p2, {ref: "panel", modelValue: e.checkedValue, "onUpdate:modelValue": t[14] || (t[14] = (t2) => e.checkedValue = t2), options: e.options, props: e.props, border: false, "render-label": e.$slots.default, onExpandChange: e.handleExpandChange, onClose: t[15] || (t[15] = (t2) => e.togglePopperVisible(false))}, null, 8, ["modelValue", "options", "props", "render-label", "onExpandChange"]), [[vShow, !e.filtering]]), e.filterable ? withDirectives((openBlock(), createBlock(f, {key: 0, ref: "suggestionPanel", tag: "ul", class: "el-cascader__suggestion-panel", "view-class": "el-cascader__suggestion-list"}, {default: withCtx(() => [e.suggestions.length ? (openBlock(true), createBlock(Fragment, {key: 0}, renderList(e.suggestions, (t2) => (openBlock(), createBlock("li", {key: t2.uid, class: ["el-cascader__suggestion-item", t2.checked && "is-checked"], tabindex: -1, onClick: (l2) => e.handleSuggestionClick(t2)}, [createVNode("span", null, toDisplayString(t2.text), 1), t2.checked ? (openBlock(), createBlock("i", ro)) : createCommentVNode("v-if", true)], 10, ["onClick"]))), 128)) : renderSlot(e.$slots, "empty", {key: 1}, () => [createVNode("li", so, toDisplayString(e.t("el.cascader.noMatch")), 1)])]), _: 3}, 512)), [[vShow, e.filtering]]) : createCommentVNode("v-if", true)]), _: 1}, 8, ["visible", "popper-class", "popper-options", "onAfterLeave"]);
}, oo.__file = "packages/cascader/src/index.vue", oo.install = (e) => {
  e.component(oo.name, oo);
};
const uo = oo;
var co = defineComponent({name: "ElCheckboxButton", props: {modelValue: {type: [Boolean, Number, String], default: () => {
}}, label: {type: [Boolean, Number, String]}, indeterminate: Boolean, disabled: Boolean, checked: Boolean, name: {type: String, default: void 0}, trueLabel: {type: [String, Number], default: void 0}, falseLabel: {type: [String, Number], default: void 0}}, emits: [qt, "change"], setup(e) {
  const {focus: t, isChecked: l, isDisabled: a, size: o, model: i, handleChange: r} = wn(e), {checkboxGroup: s} = xn();
  return {focus: t, isChecked: l, isDisabled: a, model: i, handleChange: r, activeStyle: computed(() => {
    var e2, t2, l2, a2;
    const n = (t2 = (e2 = s == null ? void 0 : s.fill) === null || e2 === void 0 ? void 0 : e2.value) !== null && t2 !== void 0 ? t2 : "";
    return {backgroundColor: n, borderColor: n, color: (a2 = (l2 = s == null ? void 0 : s.textColor) === null || l2 === void 0 ? void 0 : l2.value) !== null && a2 !== void 0 ? a2 : "", boxShadow: n ? "-1px 0 0 0 " + n : null};
  }), size: o};
}});
co.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("label", {class: ["el-checkbox-button", [e.size ? "el-checkbox-button--" + e.size : "", {"is-disabled": e.isDisabled}, {"is-checked": e.isChecked}, {"is-focus": e.focus}]], role: "checkbox", "aria-checked": e.isChecked, "aria-disabled": e.isDisabled}, [e.trueLabel || e.falseLabel ? withDirectives((openBlock(), createBlock("input", {key: 0, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.model = t2), checked: e.isChecked, class: "el-checkbox-button__original", type: "checkbox", name: e.name, disabled: e.isDisabled, "true-value": e.trueLabel, "false-value": e.falseLabel, onChange: t[2] || (t[2] = (...t2) => e.handleChange && e.handleChange(...t2)), onFocus: t[3] || (t[3] = (t2) => e.focus = true), onBlur: t[4] || (t[4] = (t2) => e.focus = false)}, null, 40, ["checked", "name", "disabled", "true-value", "false-value"])), [[vModelCheckbox, e.model]]) : withDirectives((openBlock(), createBlock("input", {key: 1, "onUpdate:modelValue": t[5] || (t[5] = (t2) => e.model = t2), class: "el-checkbox-button__original", type: "checkbox", name: e.name, disabled: e.isDisabled, value: e.label, onChange: t[6] || (t[6] = (...t2) => e.handleChange && e.handleChange(...t2)), onFocus: t[7] || (t[7] = (t2) => e.focus = true), onBlur: t[8] || (t[8] = (t2) => e.focus = false)}, null, 40, ["name", "disabled", "value"])), [[vModelCheckbox, e.model]]), e.$slots.default || e.label ? (openBlock(), createBlock("span", {key: 2, class: "el-checkbox-button__inner", style: e.isChecked ? e.activeStyle : null}, [renderSlot(e.$slots, "default", {}, () => [createTextVNode(toDisplayString(e.label), 1)])], 4)) : createCommentVNode("v-if", true)], 10, ["aria-checked", "aria-disabled"]);
}, co.__file = "packages/checkbox/src/checkbox-button.vue", co.install = (e) => {
  e.component(co.name, co);
};
const po = co;
var ho = defineComponent({name: "ElCheckboxGroup", props: {modelValue: {type: [Object, Boolean, Array], default: () => {
}}, disabled: Boolean, min: {type: Number, default: void 0}, max: {type: Number, default: void 0}, size: {type: String, validator: Xt}, fill: {type: String, default: void 0}, textColor: {type: String, default: void 0}}, emits: [qt, "change"], setup(e, t) {
  const {elFormItem: l, elFormItemSize: a, ELEMENT: i} = xn(), r = computed(() => e.size || a.value || i.size), s = (e2) => {
    t.emit(qt, e2), nextTick(() => {
      t.emit("change", e2);
    });
  }, u = computed({get: () => e.modelValue, set(e2) {
    s(e2);
  }});
  provide("CheckboxGroup", Object.assign(Object.assign({name: "ElCheckboxGroup", modelValue: u}, toRefs(e)), {checkboxGroupSize: r, changeEvent: s})), watch(() => e.modelValue, (e2) => {
    var t2;
    (t2 = l.formItemMitt) === null || t2 === void 0 || t2.emit("el.form.change", [e2]);
  });
}});
const vo = {class: "el-checkbox-group", role: "group", "aria-label": "checkbox-group"};
ho.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", vo, [renderSlot(e.$slots, "default")]);
}, ho.__file = "packages/checkbox/src/checkbox-group.vue", ho.install = (e) => {
  e.component(ho.name, ho);
};
const mo = ho, fo = defineComponent({name: "ElCol", props: {tag: {type: String, default: "div"}, span: {type: Number, default: 24}, offset: {type: Number, default: 0}, pull: {type: Number, default: 0}, push: {type: Number, default: 0}, xs: {type: [Number, Object], default: () => ({})}, sm: {type: [Number, Object], default: () => ({})}, md: {type: [Number, Object], default: () => ({})}, lg: {type: [Number, Object], default: () => ({})}, xl: {type: [Number, Object], default: () => ({})}}, setup(e, {slots: t}) {
  const {gutter: l} = inject("ElRow", {gutter: {value: 0}}), a = computed(() => l.value ? {paddingLeft: l.value / 2 + "px", paddingRight: l.value / 2 + "px"} : {}), o = computed(() => {
    const t2 = [];
    ["span", "offset", "pull", "push"].forEach((l2) => {
      const a2 = e[l2];
      typeof a2 == "number" && a2 > 0 && t2.push(l2 !== "span" ? `el-col-${l2}-${e[l2]}` : "el-col-" + e[l2]);
    });
    return ["xs", "sm", "md", "lg", "xl"].forEach((l2) => {
      if (typeof e[l2] == "number")
        t2.push(`el-col-${l2}-${e[l2]}`);
      else if (typeof e[l2] == "object") {
        const a2 = e[l2];
        Object.keys(a2).forEach((e2) => {
          t2.push(e2 !== "span" ? `el-col-${l2}-${e2}-${a2[e2]}` : `el-col-${l2}-${a2[e2]}`);
        });
      }
    }), l.value && t2.push("is-guttered"), t2;
  });
  return () => {
    var l2;
    return h(e.tag, {class: ["el-col", o.value], style: a.value}, (l2 = t.default) === null || l2 === void 0 ? void 0 : l2.call(t));
  };
}});
fo.install = (e) => {
  e.component(fo.name, fo);
};
var go = defineComponent({name: "ElCollapse", props: {accordion: Boolean, modelValue: {type: [Array, String, Number], default: () => []}}, emits: [qt, "change"], setup(e, {emit: t}) {
  const a = ref([].concat(e.modelValue)), n = ae(), i = (l) => {
    a.value = [].concat(l);
    const n2 = e.accordion ? a.value[0] : a.value;
    t(qt, n2), t("change", n2);
  }, r = (t2) => {
    if (e.accordion)
      i(!a.value[0] && a.value[0] !== 0 || a.value[0] !== t2 ? t2 : "");
    else {
      let e2 = a.value.slice(0);
      const l = e2.indexOf(t2);
      l > -1 ? e2.splice(l, 1) : e2.push(t2), i(e2);
    }
  };
  return watch(() => e.modelValue, () => {
    a.value = [].concat(e.modelValue);
  }), n.on("item-click", r), onUnmounted(() => {
    n.all.clear();
  }), provide("collapse", {activeNames: a, collapseMitt: n}), {activeNames: a, setActiveNames: i, handleItemClick: r};
}});
const bo = {class: "el-collapse", role: "tablist", "aria-multiselectable": "true"};
go.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", bo, [renderSlot(e.$slots, "default")]);
}, go.__file = "packages/collapse/src/collapse.vue", go.install = (e) => {
  e.component(go.name, go);
};
const yo = go;
var ko = defineComponent({name: "ElCollapseTransition", setup: () => ({on: {beforeEnter(e) {
  nt(e, "collapse-transition"), e.dataset || (e.dataset = {}), e.dataset.oldPaddingTop = e.style.paddingTop, e.dataset.oldPaddingBottom = e.style.paddingBottom, e.style.height = "0", e.style.paddingTop = 0, e.style.paddingBottom = 0;
}, enter(e) {
  e.dataset.oldOverflow = e.style.overflow, e.scrollHeight !== 0 ? (e.style.height = e.scrollHeight + "px", e.style.paddingTop = e.dataset.oldPaddingTop, e.style.paddingBottom = e.dataset.oldPaddingBottom) : (e.style.height = "", e.style.paddingTop = e.dataset.oldPaddingTop, e.style.paddingBottom = e.dataset.oldPaddingBottom), e.style.overflow = "hidden";
}, afterEnter(e) {
  ot(e, "collapse-transition"), e.style.height = "", e.style.overflow = e.dataset.oldOverflow;
}, beforeLeave(e) {
  e.dataset || (e.dataset = {}), e.dataset.oldPaddingTop = e.style.paddingTop, e.dataset.oldPaddingBottom = e.style.paddingBottom, e.dataset.oldOverflow = e.style.overflow, e.style.height = e.scrollHeight + "px", e.style.overflow = "hidden";
}, leave(e) {
  e.scrollHeight !== 0 && (nt(e, "collapse-transition"), e.style.transitionProperty = "height", e.style.height = 0, e.style.paddingTop = 0, e.style.paddingBottom = 0);
}, afterLeave(e) {
  ot(e, "collapse-transition"), e.style.height = "", e.style.overflow = e.dataset.oldOverflow, e.style.paddingTop = e.dataset.oldPaddingTop, e.style.paddingBottom = e.dataset.oldPaddingBottom;
}}})});
ko.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, toHandlers(e.on), {default: withCtx(() => [renderSlot(e.$slots, "default")]), _: 3}, 16);
}, ko.__file = "packages/transition/collapse-transition/index.vue", ko.install = (e) => {
  e.component(ko.name, ko);
};
const Co = ko;
var xo = defineComponent({name: "ElCollapseItem", components: {ElCollapseTransition: Co}, props: {title: {type: String, default: ""}, name: {type: [String, Number], default: () => Re()}, disabled: Boolean}, setup(e) {
  const t = inject("collapse"), a = t == null ? void 0 : t.collapseMitt, o = ref({height: "auto", display: "block"}), i = ref(0), r = ref(false), s = ref(false), u = ref(Re());
  return {isActive: computed(() => (t == null ? void 0 : t.activeNames.value.indexOf(e.name)) > -1), contentWrapStyle: o, contentHeight: i, focusing: r, isClick: s, id: u, handleFocus: () => {
    setTimeout(() => {
      s.value ? s.value = false : r.value = true;
    }, 50);
  }, handleHeaderClick: () => {
    e.disabled || (a == null || a.emit("item-click", e.name), r.value = false, s.value = true);
  }, handleEnterClick: () => {
    a == null || a.emit("item-click", e.name);
  }, collapse: t};
}});
const wo = {class: "el-collapse-item__content"};
xo.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-collapse-transition");
  return openBlock(), createBlock("div", {class: ["el-collapse-item", {"is-active": e.isActive, "is-disabled": e.disabled}]}, [createVNode("div", {role: "tab", "aria-expanded": e.isActive, "aria-controls": "el-collapse-content-" + e.id, "aria-describedby": "el-collapse-content-" + e.id}, [createVNode("div", {id: "el-collapse-head-" + e.id, class: ["el-collapse-item__header", {focusing: e.focusing, "is-active": e.isActive}], role: "button", tabindex: e.disabled ? -1 : 0, onClick: t[1] || (t[1] = (...t2) => e.handleHeaderClick && e.handleHeaderClick(...t2)), onKeyup: t[2] || (t[2] = withKeys(withModifiers((...t2) => e.handleEnterClick && e.handleEnterClick(...t2), ["stop"]), ["space", "enter"])), onFocus: t[3] || (t[3] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onBlur: t[4] || (t[4] = (t2) => e.focusing = false)}, [renderSlot(e.$slots, "title", {}, () => [createTextVNode(toDisplayString(e.title), 1)]), createVNode("i", {class: ["el-collapse-item__arrow el-icon-arrow-right", {"is-active": e.isActive}]}, null, 2)], 42, ["id", "tabindex"])], 8, ["aria-expanded", "aria-controls", "aria-describedby"]), createVNode(i, null, {default: withCtx(() => [withDirectives(createVNode("div", {id: "el-collapse-content-" + e.id, class: "el-collapse-item__wrap", role: "tabpanel", "aria-hidden": !e.isActive, "aria-labelledby": "el-collapse-head-" + e.id}, [createVNode("div", wo, [renderSlot(e.$slots, "default")])], 8, ["id", "aria-hidden", "aria-labelledby"]), [[vShow, e.isActive]])]), _: 3})], 2);
}, xo.__file = "packages/collapse/src/collapse-item.vue", xo.install = (e) => {
  e.component(xo.name, xo);
};
const _o = xo, So = function(e, t, l) {
  return [e, t * l / ((e = (2 - t) * l) < 1 ? e : 2 - e) || 0, e / 2];
}, Eo = function(e, t) {
  var l;
  typeof (l = e) == "string" && l.indexOf(".") !== -1 && parseFloat(l) === 1 && (e = "100%");
  const a = function(e2) {
    return typeof e2 == "string" && e2.indexOf("%") !== -1;
  }(e);
  return e = Math.min(t, Math.max(0, parseFloat(e + ""))), a && (e = parseInt(e * t + "", 10) / 100), Math.abs(e - t) < 1e-6 ? 1 : e % t / parseFloat(t);
}, Mo = {10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F"}, To = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15}, No = function(e) {
  return e.length === 2 ? 16 * (To[e[0].toUpperCase()] || +e[0]) + (To[e[1].toUpperCase()] || +e[1]) : To[e[1].toUpperCase()] || +e[1];
}, Do = function(e, t, l) {
  e = Eo(e, 255), t = Eo(t, 255), l = Eo(l, 255);
  const a = Math.max(e, t, l), n = Math.min(e, t, l);
  let o;
  const i = a, r = a - n, s = a === 0 ? 0 : r / a;
  if (a === n)
    o = 0;
  else {
    switch (a) {
      case e:
        o = (t - l) / r + (t < l ? 6 : 0);
        break;
      case t:
        o = (l - e) / r + 2;
        break;
      case l:
        o = (e - t) / r + 4;
    }
    o /= 6;
  }
  return {h: 360 * o, s: 100 * s, v: 100 * i};
}, Oo = function(e, t, l) {
  e = 6 * Eo(e, 360), t = Eo(t, 100), l = Eo(l, 100);
  const a = Math.floor(e), n = e - a, o = l * (1 - t), i = l * (1 - n * t), r = l * (1 - (1 - n) * t), s = a % 6, u = [l, i, o, o, r, l][s], d = [r, l, l, i, o, o][s], c = [o, o, r, l, l, i][s];
  return {r: Math.round(255 * u), g: Math.round(255 * d), b: Math.round(255 * c)};
};
class Io {
  constructor(e) {
    this._hue = 0, this._saturation = 100, this._value = 100, this._alpha = 100, this.enableAlpha = false, this.format = "hex", this.value = "", e = e || {};
    for (const t in e)
      we(e, t) && (this[t] = e[t]);
    this.doOnChange();
  }
  set(e, t) {
    if (arguments.length !== 1 || typeof e != "object")
      this["_" + e] = t, this.doOnChange();
    else
      for (const t2 in e)
        we(e, t2) && this.set(t2, e[t2]);
  }
  get(e) {
    return this["_" + e];
  }
  toRgb() {
    return Oo(this._hue, this._saturation, this._value);
  }
  fromString(e) {
    if (!e)
      return this._hue = 0, this._saturation = 100, this._value = 100, void this.doOnChange();
    const t = (e2, t2, l) => {
      this._hue = Math.max(0, Math.min(360, e2)), this._saturation = Math.max(0, Math.min(100, t2)), this._value = Math.max(0, Math.min(100, l)), this.doOnChange();
    };
    if (e.indexOf("hsl") !== -1) {
      const l = e.replace(/hsla|hsl|\(|\)/gm, "").split(/\s|,/g).filter((e2) => e2 !== "").map((e2, t2) => t2 > 2 ? parseFloat(e2) : parseInt(e2, 10));
      if (l.length === 4 ? this._alpha = Math.floor(100 * parseFloat(l[3])) : l.length === 3 && (this._alpha = 100), l.length >= 3) {
        const {h: e2, s: a, v: n} = function(e3, t2, l2) {
          l2 /= 100;
          let a2 = t2 /= 100;
          const n2 = Math.max(l2, 0.01);
          return t2 *= (l2 *= 2) <= 1 ? l2 : 2 - l2, a2 *= n2 <= 1 ? n2 : 2 - n2, {h: e3, s: 100 * (l2 === 0 ? 2 * a2 / (n2 + a2) : 2 * t2 / (l2 + t2)), v: (l2 + t2) / 2 * 100};
        }(l[0], l[1], l[2]);
        t(e2, a, n);
      }
    } else if (e.indexOf("hsv") !== -1) {
      const l = e.replace(/hsva|hsv|\(|\)/gm, "").split(/\s|,/g).filter((e2) => e2 !== "").map((e2, t2) => t2 > 2 ? parseFloat(e2) : parseInt(e2, 10));
      l.length === 4 ? this._alpha = Math.floor(100 * parseFloat(l[3])) : l.length === 3 && (this._alpha = 100), l.length >= 3 && t(l[0], l[1], l[2]);
    } else if (e.indexOf("rgb") !== -1) {
      const l = e.replace(/rgba|rgb|\(|\)/gm, "").split(/\s|,/g).filter((e2) => e2 !== "").map((e2, t2) => t2 > 2 ? parseFloat(e2) : parseInt(e2, 10));
      if (l.length === 4 ? this._alpha = Math.floor(100 * parseFloat(l[3])) : l.length === 3 && (this._alpha = 100), l.length >= 3) {
        const {h: e2, s: a, v: n} = Do(l[0], l[1], l[2]);
        t(e2, a, n);
      }
    } else if (e.indexOf("#") !== -1) {
      const l = e.replace("#", "").trim();
      if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(l))
        return;
      let a, n, o;
      l.length === 3 ? (a = No(l[0] + l[0]), n = No(l[1] + l[1]), o = No(l[2] + l[2])) : l.length !== 6 && l.length !== 8 || (a = No(l.substring(0, 2)), n = No(l.substring(2, 4)), o = No(l.substring(4, 6))), l.length === 8 ? this._alpha = Math.floor(No(l.substring(6)) / 255 * 100) : l.length !== 3 && l.length !== 6 || (this._alpha = 100);
      const {h: i, s: r, v: s} = Do(a, n, o);
      t(i, r, s);
    }
  }
  compare(e) {
    return Math.abs(e._hue - this._hue) < 2 && Math.abs(e._saturation - this._saturation) < 1 && Math.abs(e._value - this._value) < 1 && Math.abs(e._alpha - this._alpha) < 1;
  }
  doOnChange() {
    const {_hue: e, _saturation: t, _value: l, _alpha: a, format: n} = this;
    if (this.enableAlpha)
      switch (n) {
        case "hsl": {
          const n2 = So(e, t / 100, l / 100);
          this.value = `hsla(${e}, ${Math.round(100 * n2[1])}%, ${Math.round(100 * n2[2])}%, ${a / 100})`;
          break;
        }
        case "hsv":
          this.value = `hsva(${e}, ${Math.round(t)}%, ${Math.round(l)}%, ${a / 100})`;
          break;
        default: {
          const {r: n2, g: o, b: i} = Oo(e, t, l);
          this.value = `rgba(${n2}, ${o}, ${i}, ${a / 100})`;
        }
      }
    else
      switch (n) {
        case "hsl": {
          const a2 = So(e, t / 100, l / 100);
          this.value = `hsl(${e}, ${Math.round(100 * a2[1])}%, ${Math.round(100 * a2[2])}%)`;
          break;
        }
        case "hsv":
          this.value = `hsv(${e}, ${Math.round(t)}%, ${Math.round(l)}%)`;
          break;
        case "rgb": {
          const {r: a2, g: n2, b: o} = Oo(e, t, l);
          this.value = `rgb(${a2}, ${n2}, ${o})`;
          break;
        }
        default:
          this.value = function({r: e2, g: t2, b: l2}) {
            const a2 = function(e3) {
              e3 = Math.min(Math.round(e3), 255);
              const t3 = Math.floor(e3 / 16), l3 = e3 % 16;
              return "" + (Mo[t3] || t3) + (Mo[l3] || l3);
            };
            return isNaN(e2) || isNaN(t2) || isNaN(l2) ? "" : "#" + a2(e2) + a2(t2) + a2(l2);
          }(Oo(e, t, l));
      }
  }
}
let Po = false;
function Vo(e, t) {
  if (ye)
    return;
  const l = function(e2) {
    var l2;
    (l2 = t.drag) === null || l2 === void 0 || l2.call(t, e2);
  }, a = function(e2) {
    var n;
    lt(document, "mousemove", l), lt(document, "mouseup", a), document.onselectstart = null, document.ondragstart = null, Po = false, (n = t.end) === null || n === void 0 || n.call(t, e2);
  };
  tt(e, "mousedown", function(e2) {
    var n;
    Po || (document.onselectstart = () => false, document.ondragstart = () => false, tt(document, "mousemove", l), tt(document, "mouseup", a), Po = true, (n = t.start) === null || n === void 0 || n.call(t, e2));
  });
}
var Bo = defineComponent({name: "ElSlPanel", props: {color: {type: Object, required: true}}, setup(t) {
  const a = getCurrentInstance(), r = ref(0), s = ref(0), u = ref("hsl(0, 100%, 50%)"), d = computed(() => ({hue: t.color.get("hue"), value: t.color.get("value")}));
  function c() {
    const e = t.color.get("saturation"), l = t.color.get("value"), n = a.vnode.el;
    let {clientWidth: o, clientHeight: i} = n;
    s.value = e * o / 100, r.value = (100 - l) * i / 100, u.value = "hsl(" + t.color.get("hue") + ", 100%, 50%)";
  }
  function p2(e) {
    const l = a.vnode.el.getBoundingClientRect();
    let n = e.clientX - l.left, o = e.clientY - l.top;
    n = Math.max(0, n), n = Math.min(n, l.width), o = Math.max(0, o), o = Math.min(o, l.height), s.value = n, r.value = o, t.color.set({saturation: n / l.width * 100, value: 100 - o / l.height * 100});
  }
  return watch(() => d.value, () => {
    c();
  }), onMounted(() => {
    Vo(a.vnode.el, {drag: (e) => {
      p2(e);
    }, end: (e) => {
      p2(e);
    }}), c();
  }), {cursorTop: r, cursorLeft: s, background: u, colorValue: d, handleDrag: p2, update: c};
}});
const Ao = createVNode("div", {class: "el-color-svpanel__white"}, null, -1), Lo = createVNode("div", {class: "el-color-svpanel__black"}, null, -1), zo = createVNode("div", null, null, -1);
Bo.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: "el-color-svpanel", style: {backgroundColor: e.background}}, [Ao, Lo, createVNode("div", {class: "el-color-svpanel__cursor", style: {top: e.cursorTop + "px", left: e.cursorLeft + "px"}}, [zo], 4)], 4);
}, Bo.__file = "packages/color-picker/src/components/sv-panel.vue";
var Fo = defineComponent({name: "ElColorHueSlider", props: {color: {type: Object, required: true}, vertical: Boolean}, setup(t) {
  const a = getCurrentInstance(), r = ref(null), s = ref(null), u = ref(0), d = ref(0), c = computed(() => t.color.get("hue"));
  function p2(e) {
    const l = a.vnode.el.getBoundingClientRect();
    let n;
    if (t.vertical) {
      let t2 = e.clientY - l.top;
      t2 = Math.min(t2, l.height - r.value.offsetHeight / 2), t2 = Math.max(r.value.offsetHeight / 2, t2), n = Math.round((t2 - r.value.offsetHeight / 2) / (l.height - r.value.offsetHeight) * 360);
    } else {
      let t2 = e.clientX - l.left;
      t2 = Math.min(t2, l.width - r.value.offsetWidth / 2), t2 = Math.max(r.value.offsetWidth / 2, t2), n = Math.round((t2 - r.value.offsetWidth / 2) / (l.width - r.value.offsetWidth) * 360);
    }
    t.color.set("hue", n);
  }
  function h2() {
    u.value = function() {
      const e = a.vnode.el;
      if (t.vertical)
        return 0;
      const l = t.color.get("hue");
      return e ? Math.round(l * (e.offsetWidth - r.value.offsetWidth / 2) / 360) : 0;
    }(), d.value = function() {
      const e = a.vnode.el;
      if (!t.vertical)
        return 0;
      const l = t.color.get("hue");
      return e ? Math.round(l * (e.offsetHeight - r.value.offsetHeight / 2) / 360) : 0;
    }();
  }
  return watch(() => c.value, () => {
    h2();
  }), onMounted(() => {
    const e = {drag: (e2) => {
      p2(e2);
    }, end: (e2) => {
      p2(e2);
    }};
    Vo(s.value, e), Vo(r.value, e), h2();
  }), {bar: s, thumb: r, thumbLeft: u, thumbTop: d, hueValue: c, handleClick: function(e) {
    e.target !== r.value && p2(e);
  }, update: h2};
}});
Fo.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-color-hue-slider", {"is-vertical": e.vertical}]}, [createVNode("div", {ref: "bar", class: "el-color-hue-slider__bar", onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, null, 512), createVNode("div", {ref: "thumb", class: "el-color-hue-slider__thumb", style: {left: e.thumbLeft + "px", top: e.thumbTop + "px"}}, null, 4)], 2);
}, Fo.__file = "packages/color-picker/src/components/hue-slider.vue";
var $o = defineComponent({name: "ElColorAlphaSlider", props: {color: {type: Object, required: true}, vertical: {type: Boolean, default: false}}, setup(t) {
  const a = getCurrentInstance(), n = ref(null), r = ref(null), s = ref(0), u = ref(0), d = ref(null);
  function c(e) {
    const l = a.vnode.el.getBoundingClientRect();
    if (t.vertical) {
      let a2 = e.clientY - l.top;
      a2 = Math.max(n.value.offsetHeight / 2, a2), a2 = Math.min(a2, l.height - n.value.offsetHeight / 2), t.color.set("alpha", Math.round((a2 - n.value.offsetHeight / 2) / (l.height - n.value.offsetHeight) * 100));
    } else {
      let a2 = e.clientX - l.left;
      a2 = Math.max(n.value.offsetWidth / 2, a2), a2 = Math.min(a2, l.width - n.value.offsetWidth / 2), t.color.set("alpha", Math.round((a2 - n.value.offsetWidth / 2) / (l.width - n.value.offsetWidth) * 100));
    }
  }
  function p2() {
    s.value = function() {
      if (t.vertical)
        return 0;
      const e = a.vnode.el, l = t.color.get("alpha");
      return e ? Math.round(l * (e.offsetWidth - n.value.offsetWidth / 2) / 100) : 0;
    }(), u.value = function() {
      const e = a.vnode.el;
      if (!t.vertical)
        return 0;
      const l = t.color.get("alpha");
      return e ? Math.round(l * (e.offsetHeight - n.value.offsetHeight / 2) / 100) : 0;
    }(), d.value = function() {
      if (t.color && t.color.value) {
        const {r: e, g: l, b: a2} = t.color.toRgb();
        return `linear-gradient(to right, rgba(${e}, ${l}, ${a2}, 0) 0%, rgba(${e}, ${l}, ${a2}, 1) 100%)`;
      }
      return null;
    }();
  }
  return watch(() => t.color.get("alpha"), () => {
    p2();
  }), watch(() => t.color.value, () => {
    p2();
  }), onMounted(() => {
    const e = {drag: (e2) => {
      c(e2);
    }, end: (e2) => {
      c(e2);
    }};
    Vo(r.value, e), Vo(n.value, e), p2();
  }), {thumb: n, bar: r, thumbLeft: s, thumbTop: u, background: d, handleClick: function(e) {
    e.target !== n.value && c(e);
  }, update: p2};
}});
$o.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-color-alpha-slider", {"is-vertical": e.vertical}]}, [createVNode("div", {ref: "bar", class: "el-color-alpha-slider__bar", style: {background: e.background}, onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, null, 4), createVNode("div", {ref: "thumb", class: "el-color-alpha-slider__thumb", style: {left: e.thumbLeft + "px", top: e.thumbTop + "px"}}, null, 4)], 2);
}, $o.__file = "packages/color-picker/src/components/alpha-slider.vue";
var Ro = defineComponent({props: {colors: {type: Array, required: true}, color: {type: Object, required: true}}, setup(e) {
  const {currentColor: t} = Ko(), a = ref(n(e.colors, e.color));
  function n(e2, t2) {
    return e2.map((e3) => {
      const l = new Io();
      return l.enableAlpha = true, l.format = "rgba", l.fromString(e3), l.selected = l.value === t2.value, l;
    });
  }
  return watch(() => t.value, (e2) => {
    const t2 = new Io();
    t2.fromString(e2), a.value.forEach((e3) => {
      e3.selected = t2.compare(e3);
    });
  }), watchEffect(() => {
    a.value = n(e.colors, e.color);
  }), {rgbaColors: a, handleSelect: function(t2) {
    e.color.fromString(e.colors[t2]);
  }};
}});
const Ho = {class: "el-color-predefine"}, Wo = {class: "el-color-predefine__colors"};
Ro.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", Ho, [createVNode("div", Wo, [(openBlock(true), createBlock(Fragment, null, renderList(e.rgbaColors, (t2, l2) => (openBlock(), createBlock("div", {key: e.colors[l2], class: ["el-color-predefine__color-selector", {selected: t2.selected, "is-alpha": t2._alpha < 100}], onClick: (t3) => e.handleSelect(l2)}, [createVNode("div", {style: {"background-color": t2.value}}, null, 4)], 10, ["onClick"]))), 128))])]);
}, Ro.__file = "packages/color-picker/src/components/predefine.vue";
const jo = Symbol(), Ko = () => inject(jo);
var Yo = defineComponent({name: "ElColorPicker", components: {ElPopper: Hl, ElInput: vl, SvPanel: Bo, HueSlider: Fo, AlphaSlider: $o, ElButton: pa, Predefine: Ro}, directives: {ClickOutside: $t}, props: {modelValue: String, showAlpha: Boolean, colorFormat: String, disabled: Boolean, size: {type: String, validator: Xt}, popperClass: String, predefine: Array}, emits: ["change", "active-change", qt], setup(e, {emit: t}) {
  const r = Ue(), s = inject("elForm", {}), u = inject("elFormItem", {}), d = ref(null), c = ref(null), p2 = ref(null), h2 = ref(null), v = reactive(new Io({enableAlpha: e.showAlpha, format: e.colorFormat})), m = ref(false), f = ref(false), g = ref(""), b = computed(() => e.modelValue || f.value ? function(e2, t2) {
    if (!(e2 instanceof Io))
      throw Error("color should be instance of _color Class");
    const {r: l, g: a, b: n} = e2.toRgb();
    return t2 ? `rgba(${l}, ${a}, ${n}, ${e2.get("alpha") / 100})` : `rgb(${l}, ${a}, ${n})`;
  }(v, e.showAlpha) : "transparent"), y = computed(() => e.size || u.size || r.size), k = computed(() => e.disabled || s.disabled), C = computed(() => e.modelValue || f.value ? v.value : "");
  watch(() => e.modelValue, (e2) => {
    e2 ? e2 && e2 !== v.value && v.fromString(e2) : f.value = false;
  }), watch(() => C.value, (e2) => {
    g.value = e2, t("active-change", e2);
  }), watch(() => v.value, () => {
    e.modelValue || f.value || (f.value = true);
  });
  const x = debounce_1(function(e2) {
    m.value = e2;
  }, 100);
  function _() {
    nextTick(() => {
      e.modelValue ? v.fromString(e.modelValue) : f.value = false;
    });
  }
  return onMounted(() => {
    e.modelValue && (v.fromString(e.modelValue), g.value = C.value);
  }), watch(() => m.value, () => {
    nextTick(() => {
      var e2, t2, l;
      (e2 = d.value) === null || e2 === void 0 || e2.update(), (t2 = c.value) === null || t2 === void 0 || t2.update(), (l = p2.value) === null || l === void 0 || l.update();
    });
  }), provide(jo, {currentColor: C}), {color: v, colorDisabled: k, colorSize: y, displayedColor: b, showPanelColor: f, showPicker: m, customInput: g, handleConfirm: function() {
    v.fromString(g.value);
  }, hide: function() {
    x(false), _();
  }, handleTrigger: function() {
    k.value || x(!m.value);
  }, clear: function() {
    var l;
    x(false), t(qt, null), t("change", null), e.modelValue !== null && ((l = u.formItemMitt) === null || l === void 0 || l.emit("el.form.change", null)), _();
  }, confirmValue: function() {
    var l;
    const a = v.value;
    t(qt, a), t("change", a), (l = u.formItemMitt) === null || l === void 0 || l.emit("el.form.change", a), x(false), nextTick(() => {
      const t2 = new Io({enableAlpha: e.showAlpha, format: e.colorFormat});
      t2.fromString(e.modelValue), v.compare(t2) || _();
    });
  }, t: ya, hue: d, svPanel: c, alpha: p2, popper: h2};
}});
const qo = {class: "el-color-dropdown__main-wrapper"}, Uo = {class: "el-color-dropdown__btns"}, Go = {class: "el-color-dropdown__value"}, Xo = {key: 0, class: "el-color-picker__mask"}, Zo = {key: 0, class: "el-color-picker__empty el-icon-close"}, Qo = {class: "el-color-picker__icon el-icon-arrow-down"};
Yo.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("hue-slider"), r = resolveComponent("sv-panel"), c = resolveComponent("alpha-slider"), p2 = resolveComponent("predefine"), y = resolveComponent("el-input"), k = resolveComponent("el-button"), C = resolveComponent("el-popper"), x = resolveDirective("click-outside");
  return openBlock(), createBlock(C, {ref: "popper", visible: e.showPicker, "onUpdate:visible": t[3] || (t[3] = (t2) => e.showPicker = t2), effect: "light", "manual-mode": "", trigger: "click", "show-arrow": false, offset: 0, transition: "el-zoom-in-top", "gpu-acceleration": false, "popper-class": "el-color-picker__panel el-color-dropdown " + e.popperClass, "stop-popper-mouse-event": false}, {default: withCtx(() => [withDirectives(createVNode("div", null, [createVNode("div", qo, [createVNode(i, {ref: "hue", class: "hue-slider", color: e.color, vertical: ""}, null, 8, ["color"]), createVNode(r, {ref: "svPanel", color: e.color}, null, 8, ["color"])]), e.showAlpha ? (openBlock(), createBlock(c, {key: 0, ref: "alpha", color: e.color}, null, 8, ["color"])) : createCommentVNode("v-if", true), e.predefine ? (openBlock(), createBlock(p2, {key: 1, ref: "predefine", color: e.color, colors: e.predefine}, null, 8, ["color", "colors"])) : createCommentVNode("v-if", true), createVNode("div", Uo, [createVNode("span", Go, [createVNode(y, {modelValue: e.customInput, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.customInput = t2), "validate-event": false, size: "mini", onKeyup: withKeys(e.handleConfirm, ["enter"]), onBlur: e.handleConfirm}, null, 8, ["modelValue", "onKeyup", "onBlur"])]), createVNode(k, {size: "mini", type: "text", class: "el-color-dropdown__link-btn", onClick: e.clear}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.colorpicker.clear")), 1)]), _: 1}, 8, ["onClick"]), createVNode(k, {plain: "", size: "mini", class: "el-color-dropdown__btn", onClick: e.confirmValue}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.colorpicker.confirm")), 1)]), _: 1}, 8, ["onClick"])])], 512), [[x, e.hide]])]), trigger: withCtx(() => [createVNode("div", {class: ["el-color-picker", e.colorDisabled ? "is-disabled" : "", e.colorSize ? "el-color-picker--" + e.colorSize : ""]}, [e.colorDisabled ? (openBlock(), createBlock("div", Xo)) : createCommentVNode("v-if", true), createVNode("div", {class: "el-color-picker__trigger", onClick: t[2] || (t[2] = (...t2) => e.handleTrigger && e.handleTrigger(...t2))}, [createVNode("span", {class: ["el-color-picker__color", {"is-alpha": e.showAlpha}]}, [createVNode("span", {class: "el-color-picker__color-inner", style: {backgroundColor: e.displayedColor}}, null, 4), e.modelValue || e.showPanelColor ? createCommentVNode("v-if", true) : (openBlock(), createBlock("span", Zo))], 2), withDirectives(createVNode("span", Qo, null, 512), [[vShow, e.modelValue || e.showPanelColor]])])], 2)]), _: 1}, 8, ["visible", "popper-class"]);
}, Yo.__file = "packages/color-picker/src/index.vue", Yo.install = (e) => {
  e.component(Yo.name, Yo);
};
const Jo = Yo;
var ei = defineComponent({name: "ElContainer", props: {direction: {type: String, default: ""}}, setup: (e, {slots: t}) => ({isVertical: computed(() => {
  if (e.direction === "vertical")
    return true;
  if (e.direction === "horizontal")
    return false;
  if (t && t.default) {
    return t.default().some((e2) => {
      const t2 = e2.type.name;
      return t2 === "ElHeader" || t2 === "ElFooter";
    });
  }
  return false;
})})});
ei.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("section", {class: ["el-container", {"is-vertical": e.isVertical}]}, [renderSlot(e.$slots, "default")], 2);
}, ei.__file = "packages/container/src/container.vue", ei.install = (e) => {
  e.component(ei.name, ei);
};
const ti = ei;
var li = defineComponent({props: {date: {type: Object}, minDate: {type: Object}, maxDate: {type: Object}, parsedValue: {type: [Object, Array]}, selectionMode: {type: String, default: "day"}, showWeekNumber: {type: Boolean, default: false}, disabledDate: {type: Function}, cellClassName: {type: Function}, rangeState: {type: Object, default: () => ({endDate: null, selecting: false})}}, emits: ["changerange", "pick", "select"], setup(e, t) {
  const a = ref(null), o = ref(null), i = ref([[], [], [], [], [], []]), r = e.date.$locale().weekStart || 7, s = e.date.locale("en").localeData().weekdaysShort().map((e2) => e2.toLowerCase()), u = computed(() => r > 3 ? 7 - r : -r), d = computed(() => {
    const t2 = e.date.startOf("month");
    return t2.subtract(t2.day() || 7, "day");
  }), c = computed(() => s.concat(s).slice(r, r + 7)), p2 = computed(() => {
    var t2;
    const l = e.date.startOf("month"), a2 = l.day() || 7, n = l.daysInMonth(), o2 = l.subtract(1, "month").daysInMonth(), r2 = u.value, s2 = i.value;
    let c2 = 1;
    const p3 = e.selectionMode === "dates" ? He(e.parsedValue) : [], h3 = ie().startOf("day");
    for (let l2 = 0; l2 < 6; l2++) {
      const i2 = s2[l2];
      e.showWeekNumber && (i2[0] || (i2[0] = {type: "week", text: d.value.add(7 * l2 + 1, "day").week()}));
      for (let s3 = 0; s3 < 7; s3++) {
        let u2 = i2[e.showWeekNumber ? s3 + 1 : s3];
        u2 || (u2 = {row: l2, column: s3, type: "normal", inRange: false, start: false, end: false});
        const v2 = 7 * l2 + s3, m = d.value.add(v2 - r2, "day");
        u2.type = "normal";
        const f = e.rangeState.endDate || e.maxDate || e.rangeState.selecting && e.minDate;
        u2.inRange = e.minDate && m.isSameOrAfter(e.minDate, "day") && f && m.isSameOrBefore(f, "day") || e.minDate && m.isSameOrBefore(e.minDate, "day") && f && m.isSameOrAfter(f, "day"), ((t2 = e.minDate) === null || t2 === void 0 ? void 0 : t2.isSameOrAfter(f)) ? (u2.start = f && m.isSame(f, "day"), u2.end = e.minDate && m.isSame(e.minDate, "day")) : (u2.start = e.minDate && m.isSame(e.minDate, "day"), u2.end = f && m.isSame(f, "day"));
        if (m.isSame(h3, "day") && (u2.type = "today"), l2 >= 0 && l2 <= 1) {
          const e2 = a2 + r2 < 0 ? 7 + a2 + r2 : a2 + r2;
          s3 + 7 * l2 >= e2 ? u2.text = c2++ : (u2.text = o2 - (e2 - s3 % 7) + 1 + 7 * l2, u2.type = "prev-month");
        } else
          c2 <= n ? u2.text = c2++ : (u2.text = c2++ - n, u2.type = "next-month");
        const g = m.toDate();
        u2.selected = p3.find((e2) => e2.valueOf() === m.valueOf()), u2.disabled = e.disabledDate && e.disabledDate(g), u2.customClass = e.cellClassName && e.cellClassName(g), i2[e.showWeekNumber ? s3 + 1 : s3] = u2;
      }
      if (e.selectionMode === "week") {
        const t3 = e.showWeekNumber ? 1 : 0, l3 = e.showWeekNumber ? 7 : 6, a3 = v(i2[t3 + 1]);
        i2[t3].inRange = a3, i2[t3].start = a3, i2[l3].inRange = a3, i2[l3].end = a3;
      }
    }
    return s2;
  }), h2 = (t2, l) => {
    const a2 = 7 * t2 + (l - (e.showWeekNumber ? 1 : 0)) - u.value;
    return d.value.add(a2, "day");
  }, v = (t2) => {
    if (e.selectionMode !== "week")
      return false;
    let l = e.date.startOf("day");
    if (t2.type === "prev-month" && (l = l.subtract(1, "month")), t2.type === "next-month" && (l = l.add(1, "month")), l = l.date(parseInt(t2.text, 10)), e.parsedValue && !Array.isArray(e.parsedValue)) {
      const t3 = (e.parsedValue.day() - r + 7) % 7 - 1;
      return e.parsedValue.subtract(t3, "day").isSame(l, "day");
    }
    return false;
  };
  return {handleMouseMove: (l) => {
    if (!e.rangeState.selecting)
      return;
    let n = l.target;
    if (n.tagName === "SPAN" && (n = n.parentNode.parentNode), n.tagName === "DIV" && (n = n.parentNode), n.tagName !== "TD")
      return;
    const i2 = n.parentNode.rowIndex - 1, r2 = n.cellIndex;
    p2.value[i2][r2].disabled || i2 === a.value && r2 === o.value || (a.value = i2, o.value = r2, t.emit("changerange", {selecting: true, endDate: h2(i2, r2)}));
  }, t: ya, rows: p2, isWeekActive: v, getCellClasses: (t2) => {
    let l = [];
    return t2.type !== "normal" && t2.type !== "today" || t2.disabled ? l.push(t2.type) : (l.push("available"), t2.type === "today" && l.push("today")), e.selectionMode !== "day" || t2.type !== "normal" && t2.type !== "today" || !((t3, l2) => !!l2 && ie(l2).isSame(e.date.date(Number(t3.text)), "day"))(t2, e.parsedValue) || l.push("current"), !t2.inRange || t2.type !== "normal" && t2.type !== "today" && e.selectionMode !== "week" || (l.push("in-range"), t2.start && l.push("start-date"), t2.end && l.push("end-date")), t2.disabled && l.push("disabled"), t2.selected && l.push("selected"), t2.customClass && l.push(t2.customClass), l.join(" ");
  }, WEEKS: c, handleClick: (l) => {
    let a2 = l.target;
    if (a2.tagName === "SPAN" && (a2 = a2.parentNode.parentNode), a2.tagName === "DIV" && (a2 = a2.parentNode), a2.tagName !== "TD")
      return;
    const n = a2.parentNode.rowIndex - 1, o2 = a2.cellIndex, i2 = p2.value[n][o2];
    if (i2.disabled || i2.type === "week")
      return;
    const r2 = h2(n, o2);
    if (e.selectionMode === "range")
      e.rangeState.selecting ? (r2 >= e.minDate ? t.emit("pick", {minDate: e.minDate, maxDate: r2}) : t.emit("pick", {minDate: r2, maxDate: e.minDate}), t.emit("select", false)) : (t.emit("pick", {minDate: r2, maxDate: null}), t.emit("select", true));
    else if (e.selectionMode === "day")
      t.emit("pick", r2);
    else if (e.selectionMode === "week") {
      const e2 = r2.week(), l2 = r2.year() + "w" + e2;
      t.emit("pick", {year: r2.year(), week: e2, value: l2, date: r2.startOf("week")});
    } else if (e.selectionMode === "dates") {
      const l2 = i2.selected ? He(e.parsedValue).filter((e2) => e2.valueOf() !== r2.valueOf()) : He(e.parsedValue).concat([r2]);
      t.emit("pick", l2);
    }
  }};
}});
const ai = {key: 0};
li.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("table", {cellspacing: "0", cellpadding: "0", class: ["el-date-table", {"is-week-mode": e.selectionMode === "week"}], onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2)), onMousemove: t[2] || (t[2] = (...t2) => e.handleMouseMove && e.handleMouseMove(...t2))}, [createVNode("tbody", null, [createVNode("tr", null, [e.showWeekNumber ? (openBlock(), createBlock("th", ai, toDisplayString(e.t("el.datepicker.week")), 1)) : createCommentVNode("v-if", true), (openBlock(true), createBlock(Fragment, null, renderList(e.WEEKS, (t2, l2) => (openBlock(), createBlock("th", {key: l2}, toDisplayString(e.t("el.datepicker.weeks." + t2)), 1))), 128))]), (openBlock(true), createBlock(Fragment, null, renderList(e.rows, (t2, l2) => (openBlock(), createBlock("tr", {key: l2, class: ["el-date-table__row", {current: e.isWeekActive(t2[1])}]}, [(openBlock(true), createBlock(Fragment, null, renderList(t2, (t3, l3) => (openBlock(), createBlock("td", {key: l3, class: e.getCellClasses(t3)}, [createVNode("div", null, [createVNode("span", null, toDisplayString(t3.text), 1)])], 2))), 128))], 2))), 128))])], 34);
}, li.__file = "packages/date-picker/src/date-picker-com/basic-date-table.vue";
var ni = defineComponent({props: {disabledDate: {type: Function}, selectionMode: {type: String, default: "month"}, minDate: {type: Object}, maxDate: {type: Object}, date: {type: Object}, parsedValue: {type: Object}, rangeState: {type: Object, default: () => ({endDate: null, selecting: false})}}, emits: ["changerange", "pick", "select"], setup(e, t) {
  const a = ref(e.date.locale("en").localeData().monthsShort().map((e2) => e2.toLowerCase())), o = ref([[], [], []]), i = ref(null), r = ref(null), s = computed(() => {
    var t2;
    const l = o.value, a2 = ie().startOf("month");
    for (let n = 0; n < 3; n++) {
      const o2 = l[n];
      for (let l2 = 0; l2 < 4; l2++) {
        let i2 = o2[l2];
        i2 || (i2 = {row: n, column: l2, type: "normal", inRange: false, start: false, end: false}), i2.type = "normal";
        const r2 = 4 * n + l2, s2 = e.date.startOf("year").month(r2), u = e.rangeState.endDate || e.maxDate || e.rangeState.selecting && e.minDate;
        i2.inRange = e.minDate && s2.isSameOrAfter(e.minDate, "month") && u && s2.isSameOrBefore(u, "month") || e.minDate && s2.isSameOrBefore(e.minDate, "month") && u && s2.isSameOrAfter(u, "month"), ((t2 = e.minDate) === null || t2 === void 0 ? void 0 : t2.isSameOrAfter(u)) ? (i2.start = u && s2.isSame(u, "month"), i2.end = e.minDate && s2.isSame(e.minDate, "month")) : (i2.start = e.minDate && s2.isSame(e.minDate, "month"), i2.end = u && s2.isSame(u, "month"));
        a2.isSame(s2) && (i2.type = "today"), i2.text = r2;
        let d = s2.toDate();
        i2.disabled = e.disabledDate && e.disabledDate(d), o2[l2] = i2;
      }
    }
    return l;
  });
  return {handleMouseMove: (l) => {
    if (!e.rangeState.selecting)
      return;
    let a2 = l.target;
    if (a2.tagName === "A" && (a2 = a2.parentNode.parentNode), a2.tagName === "DIV" && (a2 = a2.parentNode), a2.tagName !== "TD")
      return;
    const n = a2.parentNode.rowIndex, o2 = a2.cellIndex;
    s.value[n][o2].disabled || n === i.value && o2 === r.value || (i.value = n, r.value = o2, t.emit("changerange", {selecting: true, endDate: e.date.startOf("year").month(4 * n + o2)}));
  }, handleMonthTableClick: (l) => {
    let a2 = l.target;
    if (a2.tagName === "A" && (a2 = a2.parentNode.parentNode), a2.tagName === "DIV" && (a2 = a2.parentNode), a2.tagName !== "TD")
      return;
    if (at(a2, "disabled"))
      return;
    const n = a2.cellIndex, o2 = 4 * a2.parentNode.rowIndex + n, i2 = e.date.startOf("year").month(o2);
    e.selectionMode === "range" ? e.rangeState.selecting ? (i2 >= e.minDate ? t.emit("pick", {minDate: e.minDate, maxDate: i2}) : t.emit("pick", {minDate: i2, maxDate: e.minDate}), t.emit("select", false)) : (t.emit("pick", {minDate: i2, maxDate: null}), t.emit("select", true)) : t.emit("pick", o2);
  }, rows: s, getCellStyle: (t2) => {
    const l = {}, a2 = e.date.year(), n = new Date(), o2 = t2.text;
    return l.disabled = !!e.disabledDate && ((e2, t3) => {
      const l2 = ie().startOf("month").month(t3).year(e2), a3 = l2.daysInMonth();
      return Ua(a3).map((e3) => l2.add(e3, "day").toDate());
    })(a2, o2).every(e.disabledDate), l.current = He(e.parsedValue).findIndex((e2) => e2.year() === a2 && e2.month() === o2) >= 0, l.today = n.getFullYear() === a2 && n.getMonth() === o2, t2.inRange && (l["in-range"] = true, t2.start && (l["start-date"] = true), t2.end && (l["end-date"] = true)), l;
  }, t: ya, months: a};
}});
const oi = {class: "cell"};
ni.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("table", {class: "el-month-table", onClick: t[1] || (t[1] = (...t2) => e.handleMonthTableClick && e.handleMonthTableClick(...t2)), onMousemove: t[2] || (t[2] = (...t2) => e.handleMouseMove && e.handleMouseMove(...t2))}, [createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.rows, (t2, l2) => (openBlock(), createBlock("tr", {key: l2}, [(openBlock(true), createBlock(Fragment, null, renderList(t2, (t3, l3) => (openBlock(), createBlock("td", {key: l3, class: e.getCellStyle(t3)}, [createVNode("div", null, [createVNode("a", oi, toDisplayString(e.t("el.datepicker.months." + e.months[t3.text])), 1)])], 2))), 128))]))), 128))])], 32);
}, ni.__file = "packages/date-picker/src/date-picker-com/basic-month-table.vue";
var ii = defineComponent({props: {disabledDate: {type: Function}, parsedValue: {type: Object}, date: {type: Object}}, emits: ["pick"], setup: (e, t) => ({startYear: computed(() => 10 * Math.floor(e.date.year() / 10)), getCellStyle: (t2) => {
  const l = {}, a = ie();
  return l.disabled = !!e.disabledDate && ((e2) => {
    const t3 = ie(String(e2)).startOf("year"), l2 = t3.endOf("year").dayOfYear();
    return Ua(l2).map((e3) => t3.add(e3, "day").toDate());
  })(t2).every(e.disabledDate), l.current = He(e.parsedValue).findIndex((e2) => e2.year() === t2) >= 0, l.today = a.year() === t2, l;
}, handleYearTableClick: (e2) => {
  const l = e2.target;
  if (l.tagName === "A") {
    if (at(l.parentNode, "disabled"))
      return;
    const e3 = l.textContent || l.innerText;
    t.emit("pick", Number(e3));
  }
}})});
const ri = {class: "cell"}, si = {class: "cell"}, ui = {class: "cell"}, di = {class: "cell"}, ci = {class: "cell"}, pi = {class: "cell"}, hi = {class: "cell"}, vi = {class: "cell"}, mi = {class: "cell"}, fi = {class: "cell"}, gi = createVNode("td", null, null, -1), bi = createVNode("td", null, null, -1);
ii.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("table", {class: "el-year-table", onClick: t[1] || (t[1] = (...t2) => e.handleYearTableClick && e.handleYearTableClick(...t2))}, [createVNode("tbody", null, [createVNode("tr", null, [createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 0)]}, [createVNode("a", ri, toDisplayString(e.startYear), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 1)]}, [createVNode("a", si, toDisplayString(e.startYear + 1), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 2)]}, [createVNode("a", ui, toDisplayString(e.startYear + 2), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 3)]}, [createVNode("a", di, toDisplayString(e.startYear + 3), 1)], 2)]), createVNode("tr", null, [createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 4)]}, [createVNode("a", ci, toDisplayString(e.startYear + 4), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 5)]}, [createVNode("a", pi, toDisplayString(e.startYear + 5), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 6)]}, [createVNode("a", hi, toDisplayString(e.startYear + 6), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 7)]}, [createVNode("a", vi, toDisplayString(e.startYear + 7), 1)], 2)]), createVNode("tr", null, [createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 8)]}, [createVNode("a", mi, toDisplayString(e.startYear + 8), 1)], 2), createVNode("td", {class: ["available", e.getCellStyle(e.startYear + 9)]}, [createVNode("a", fi, toDisplayString(e.startYear + 9), 1)], 2), gi, bi])])]);
}, ii.__file = "packages/date-picker/src/date-picker-com/basic-year-table.vue";
var yi = defineComponent({components: {DateTable: li, ElInput: vl, ElButton: pa, TimePickPanel: Ba, MonthTable: ni, YearTable: ii}, directives: {clickoutside: $t}, props: {visible: {type: Boolean, default: false}, parsedValue: {type: [Object, Array]}, format: {type: String, default: ""}, type: {type: String, required: true}}, emits: ["pick", "set-picker-option"], setup(e, t) {
  const a = ref(ie()), i = computed(() => a.value.month()), r = computed(() => a.value.year()), s = ref([]), u = ref(null), d = ref(null), c = (t2) => !(s.value.length > 0) || (s.value, e.format, true), p2 = (e2) => {
    if (b.value)
      return e2.millisecond(0);
    if (I) {
      return ie(I).year(e2.year()).month(e2.month()).date(e2.date());
    }
    return e2.startOf("day");
  }, h2 = (e2, ...l) => {
    if (e2)
      if (Array.isArray(e2)) {
        const a2 = e2.map(p2);
        t.emit("pick", a2, ...l);
      } else
        t.emit("pick", p2(e2), ...l);
    else
      t.emit("pick", e2, ...l);
    u.value = null, d.value = null;
  }, v = ref("date"), m = computed(() => {
    const e2 = ya("el.datepicker.year");
    if (v.value === "year") {
      const t2 = 10 * Math.floor(r.value / 10);
      return e2 ? t2 + " " + e2 + " - " + (t2 + 9) + " " + e2 : t2 + " - " + (t2 + 9);
    }
    return r.value + " " + e2;
  }), f = computed(() => ["week", "month", "year", "dates"].includes(e.type) ? e.type : "day");
  watch(() => f.value, (e2) => {
    ["month", "year"].includes(e2) ? v.value = e2 : v.value = "date";
  }, {immediate: true});
  const g = computed(() => !!N.length), b = computed(() => e.type === "datetime" || e.type === "datetimerange"), y = computed(() => b.value || f.value === "dates"), k = computed(() => Xa(e.format)), C = computed(() => Ga(e.format)), x = computed(() => d.value ? d.value : e.parsedValue || P ? (e.parsedValue || a.value).format(k.value) : void 0), w = computed(() => u.value ? u.value : e.parsedValue || P ? (e.parsedValue || a.value).format(C.value) : void 0), _ = ref(false), S = () => ie(P), M = (e2) => {
    const l = {year: {38: -4, 40: 4, 37: -1, 39: 1, offset: (e3, t2) => e3.setFullYear(e3.getFullYear() + t2)}, month: {38: -4, 40: 4, 37: -1, 39: 1, offset: (e3, t2) => e3.setMonth(e3.getMonth() + t2)}, week: {38: -1, 40: 1, 37: -1, 39: 1, offset: (e3, t2) => e3.setDate(e3.getDate() + 7 * t2)}, day: {38: -7, 40: 7, 37: -1, 39: 1, offset: (e3, t2) => e3.setDate(e3.getDate() + t2)}}, n = a.value.toDate();
    for (; Math.abs(a.value.diff(n, "year", true)) < 1; ) {
      const o = l[f.value];
      if (o.offset(n, o[e2]), D && D(n))
        continue;
      const i2 = ie(n);
      a.value = i2, t.emit("pick", i2, true);
      break;
    }
  };
  t.emit("set-picker-option", ["isValidValue", (e2) => e2.isValid() && (!D || !D(e2.toDate()))]), t.emit("set-picker-option", ["formatToString", (t2) => f.value === "dates" ? t2.map((t3) => t3.format(e.format)) : t2.format(e.format)]), t.emit("set-picker-option", ["parseUserInput", (t2) => ie(t2, e.format)]), t.emit("set-picker-option", ["handleKeydown", (t2) => {
    const {code: l, keyCode: n} = t2, o = [Dt.up, Dt.down, Dt.left, Dt.right];
    e.visible && !_.value && (o.includes(l) && (M(n), t2.stopPropagation(), t2.preventDefault()), l === Dt.enter && u.value === null && d.value === null && h2(a, false));
  }]);
  const T = inject("EP_PICKER_BASE"), {shortcuts: N, disabledDate: D, cellClassName: O, defaultTime: I, defaultValue: P, arrowControl: V} = T.props;
  return watch(() => e.parsedValue, (e2) => {
    if (e2) {
      if (f.value === "dates")
        return;
      if (Array.isArray(e2))
        return;
      a.value = e2;
    } else
      a.value = S();
  }, {immediate: true}), {handleTimePick: (t2, l, n) => {
    const o = e.parsedValue ? e.parsedValue.hour(t2.hour()).minute(t2.minute()).second(t2.second()) : t2;
    a.value = o, h2(a.value, true), n || (_.value = l);
  }, handleTimePickClose: () => {
    _.value = false;
  }, onTimePickerInputFocus: () => {
    _.value = true;
  }, timePickerVisible: _, visibleTime: x, visibleDate: w, showTime: b, changeToNow: () => {
    const e2 = ie().toDate();
    D && D(e2) || !c() || (a.value = ie(), h2(a.value));
  }, onConfirm: () => {
    if (f.value === "dates")
      h2(e.parsedValue);
    else {
      let t2 = e.parsedValue;
      if (!t2) {
        const e2 = ie(I), l = S();
        t2 = e2.year(l.year()).month(l.month()).date(l.date());
      }
      a.value = t2, h2(t2);
    }
  }, footerVisible: y, handleYearPick: (e2) => {
    f.value === "year" ? (a.value = a.value.startOf("year").year(e2), h2(a.value)) : (a.value = a.value.year(e2), v.value = "month");
  }, showMonthPicker: () => {
    v.value = "month";
  }, showYearPicker: () => {
    v.value = "year";
  }, handleMonthPick: (e2) => {
    a.value = a.value.startOf("month").month(e2), f.value === "month" ? h2(a.value) : v.value = "date";
  }, hasShortcuts: g, shortcuts: N, arrowControl: V, disabledDate: D, cellClassName: O, selectionMode: f, handleShortcutClick: (e2) => {
    e2.value ? h2(ie(e2.value)) : e2.onClick && e2.onClick(t);
  }, prevYear_: () => {
    v.value === "year" ? a.value = a.value.subtract(10, "year") : a.value = a.value.subtract(1, "year");
  }, nextYear_: () => {
    v.value === "year" ? a.value = a.value.add(10, "year") : a.value = a.value.add(1, "year");
  }, prevMonth_: () => {
    a.value = a.value.subtract(1, "month");
  }, nextMonth_: () => {
    a.value = a.value.add(1, "month");
  }, innerDate: a, t: ya, yearLabel: m, currentView: v, month: i, handleDatePick: (t2) => {
    if (f.value === "day") {
      let l = e.parsedValue ? e.parsedValue.year(t2.year()).month(t2.month()).date(t2.date()) : t2;
      c() || (l = s.value[0][0].year(t2.year()).month(t2.month()).date(t2.date())), a.value = l, h2(l, b.value);
    } else
      f.value === "week" ? h2(t2.date) : f.value === "dates" && h2(t2, true);
  }, handleVisibleTimeChange: (e2) => {
    const t2 = ie(e2, k.value);
    t2.isValid() && c() && (a.value = t2.year(a.value.year()).month(a.value.month()).date(a.value.date()), d.value = null, _.value = false, h2(a.value, true));
  }, handleVisibleDateChange: (e2) => {
    const t2 = ie(e2, C.value);
    if (t2.isValid()) {
      if (D && D(t2.toDate()))
        return;
      a.value = t2.hour(a.value.hour()).minute(a.value.minute()).second(a.value.second()), u.value = null, h2(a.value, true);
    }
  }, timeFormat: k, userInputTime: d, userInputDate: u};
}});
const ki = {class: "el-picker-panel__body-wrapper"}, Ci = {key: 0, class: "el-picker-panel__sidebar"}, xi = {class: "el-picker-panel__body"}, wi = {key: 0, class: "el-date-picker__time-header"}, _i = {class: "el-date-picker__editor-wrap"}, Si = {class: "el-date-picker__editor-wrap"}, Ei = {class: "el-picker-panel__content"}, Mi = {class: "el-picker-panel__footer"};
yi.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("time-pick-panel"), p2 = resolveComponent("date-table"), y = resolveComponent("year-table"), k = resolveComponent("month-table"), C = resolveComponent("el-button"), x = resolveDirective("clickoutside");
  return openBlock(), createBlock("div", {class: ["el-picker-panel el-date-picker", [{"has-sidebar": e.$slots.sidebar || e.hasShortcuts, "has-time": e.showTime}]]}, [createVNode("div", ki, [renderSlot(e.$slots, "sidebar", {class: "el-picker-panel__sidebar"}), e.hasShortcuts ? (openBlock(), createBlock("div", Ci, [(openBlock(true), createBlock(Fragment, null, renderList(e.shortcuts, (t2, l2) => (openBlock(), createBlock("button", {key: l2, type: "button", class: "el-picker-panel__shortcut", onClick: (l3) => e.handleShortcutClick(t2)}, toDisplayString(t2.text), 9, ["onClick"]))), 128))])) : createCommentVNode("v-if", true), createVNode("div", xi, [e.showTime ? (openBlock(), createBlock("div", wi, [createVNode("span", _i, [createVNode(i, {placeholder: e.t("el.datepicker.selectDate"), "model-value": e.visibleDate, size: "small", onInput: t[1] || (t[1] = (t2) => e.userInputDate = t2), onChange: e.handleVisibleDateChange}, null, 8, ["placeholder", "model-value", "onChange"])]), withDirectives(createVNode("span", Si, [createVNode(i, {placeholder: e.t("el.datepicker.selectTime"), "model-value": e.visibleTime, size: "small", onFocus: e.onTimePickerInputFocus, onInput: t[2] || (t[2] = (t2) => e.userInputTime = t2), onChange: e.handleVisibleTimeChange}, null, 8, ["placeholder", "model-value", "onFocus", "onChange"]), createVNode(r, {visible: e.timePickerVisible, format: e.timeFormat, "time-arrow-control": e.arrowControl, "parsed-value": e.innerDate, onPick: e.handleTimePick}, null, 8, ["visible", "format", "time-arrow-control", "parsed-value", "onPick"])], 512), [[x, e.handleTimePickClose]])])) : createCommentVNode("v-if", true), withDirectives(createVNode("div", {class: ["el-date-picker__header", {"el-date-picker__header--bordered": e.currentView === "year" || e.currentView === "month"}]}, [createVNode("button", {type: "button", "aria-label": e.t("el.datepicker.prevYear"), class: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left", onClick: t[3] || (t[3] = (...t2) => e.prevYear_ && e.prevYear_(...t2))}, null, 8, ["aria-label"]), withDirectives(createVNode("button", {type: "button", "aria-label": e.t("el.datepicker.prevMonth"), class: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left", onClick: t[4] || (t[4] = (...t2) => e.prevMonth_ && e.prevMonth_(...t2))}, null, 8, ["aria-label"]), [[vShow, e.currentView === "date"]]), createVNode("span", {role: "button", class: "el-date-picker__header-label", onClick: t[5] || (t[5] = (...t2) => e.showYearPicker && e.showYearPicker(...t2))}, toDisplayString(e.yearLabel), 1), withDirectives(createVNode("span", {role: "button", class: ["el-date-picker__header-label", {active: e.currentView === "month"}], onClick: t[6] || (t[6] = (...t2) => e.showMonthPicker && e.showMonthPicker(...t2))}, toDisplayString(e.t("el.datepicker.month" + (e.month + 1))), 3), [[vShow, e.currentView === "date"]]), createVNode("button", {type: "button", "aria-label": e.t("el.datepicker.nextYear"), class: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right", onClick: t[7] || (t[7] = (...t2) => e.nextYear_ && e.nextYear_(...t2))}, null, 8, ["aria-label"]), withDirectives(createVNode("button", {type: "button", "aria-label": e.t("el.datepicker.nextMonth"), class: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right", onClick: t[8] || (t[8] = (...t2) => e.nextMonth_ && e.nextMonth_(...t2))}, null, 8, ["aria-label"]), [[vShow, e.currentView === "date"]])], 2), [[vShow, e.currentView !== "time"]]), createVNode("div", Ei, [e.currentView === "date" ? (openBlock(), createBlock(p2, {key: 0, "selection-mode": e.selectionMode, date: e.innerDate, "parsed-value": e.parsedValue, "disabled-date": e.disabledDate, onPick: e.handleDatePick}, null, 8, ["selection-mode", "date", "parsed-value", "disabled-date", "onPick"])) : createCommentVNode("v-if", true), e.currentView === "year" ? (openBlock(), createBlock(y, {key: 1, date: e.innerDate, "disabled-date": e.disabledDate, "parsed-value": e.parsedValue, onPick: e.handleYearPick}, null, 8, ["date", "disabled-date", "parsed-value", "onPick"])) : createCommentVNode("v-if", true), e.currentView === "month" ? (openBlock(), createBlock(k, {key: 2, date: e.innerDate, "parsed-value": e.parsedValue, "disabled-date": e.disabledDate, onPick: e.handleMonthPick}, null, 8, ["date", "parsed-value", "disabled-date", "onPick"])) : createCommentVNode("v-if", true)])])]), withDirectives(createVNode("div", Mi, [withDirectives(createVNode(C, {size: "mini", type: "text", class: "el-picker-panel__link-btn", onClick: e.changeToNow}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.now")), 1)]), _: 1}, 8, ["onClick"]), [[vShow, e.selectionMode !== "dates"]]), createVNode(C, {plain: "", size: "mini", class: "el-picker-panel__link-btn", onClick: e.onConfirm}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.confirm")), 1)]), _: 1}, 8, ["onClick"])], 512), [[vShow, e.footerVisible && e.currentView === "date"]])], 2);
}, yi.__file = "packages/date-picker/src/date-picker-com/panel-date-pick.vue";
var Ti = defineComponent({directives: {clickoutside: $t}, components: {TimePickPanel: Ba, DateTable: li, ElInput: vl, ElButton: pa}, props: {unlinkPanels: Boolean, parsedValue: {type: Array}, type: {type: String, required: true}}, emits: ["pick", "set-picker-option"], setup(e, t) {
  const a = ref(ie()), i = ref(ie().add(1, "month")), r = ref(null), s = ref(null), u = ref({min: null, max: null}), d = ref({min: null, max: null}), c = computed(() => a.value.year() + " " + ya("el.datepicker.year") + " " + ya("el.datepicker.month" + (a.value.month() + 1))), p2 = computed(() => i.value.year() + " " + ya("el.datepicker.year") + " " + ya("el.datepicker.month" + (i.value.month() + 1))), h2 = computed(() => a.value.year()), v = computed(() => a.value.month()), m = computed(() => i.value.year()), f = computed(() => i.value.month()), g = computed(() => !!z.length), b = computed(() => u.value.min !== null ? u.value.min : r.value ? r.value.format(w.value) : ""), y = computed(() => u.value.max !== null ? u.value.max : s.value || r.value ? (s.value || r.value).format(w.value) : ""), k = computed(() => d.value.min !== null ? d.value.min : r.value ? r.value.format(x.value) : ""), C = computed(() => d.value.max !== null ? d.value.max : s.value || r.value ? (s.value || r.value).format(x.value) : ""), x = computed(() => Xa(R)), w = computed(() => Ga(R)), _ = computed(() => {
    const t2 = (v.value + 1) % 12, l = v.value + 1 >= 12 ? 1 : 0;
    return e.unlinkPanels && new Date(h2.value + l, t2) < new Date(m.value, f.value);
  }), S = computed(() => e.unlinkPanels && 12 * m.value + f.value - (12 * h2.value + v.value + 1) >= 12), M = (e2) => Array.isArray(e2) && e2[0] && e2[1] && e2[0].valueOf() <= e2[1].valueOf(), T = ref({endDate: null, selecting: false}), N = computed(() => !(r.value && s.value && !T.value.selecting && M([r.value, s.value]))), D = computed(() => e.type === "datetime" || e.type === "datetimerange"), O = (e2 = false) => {
    M([r.value, s.value]) && t.emit("pick", [r.value, s.value], e2);
  }, I = (e2, t2) => {
    if (e2) {
      if (H) {
        return ie(H[t2] || H).year(e2.year()).month(e2.month()).date(e2.date());
      }
      return e2;
    }
  }, P = ref(false), V = ref(false), B = () => {
    a.value = A()[0], i.value = a.value.add(1, "month"), t.emit("pick", null);
  }, A = () => {
    let t2;
    if (Array.isArray(W)) {
      const t3 = ie(W[0]);
      let l = ie(W[1]);
      return e.unlinkPanels || (l = t3.add(1, "month")), [t3, l];
    }
    return t2 = W ? ie(W) : ie(), [t2, t2.add(1, "month")];
  };
  t.emit("set-picker-option", ["isValidValue", M]), t.emit("set-picker-option", ["parseUserInput", (e2) => Array.isArray(e2) ? e2.map((e3) => ie(e3, R)) : ie(e2, R)]), t.emit("set-picker-option", ["formatToString", (e2) => Array.isArray(e2) ? e2.map((e3) => e3.format(R)) : e2.format(R)]), t.emit("set-picker-option", ["handleClear", B]);
  const L = inject("EP_PICKER_BASE"), {shortcuts: z, disabledDate: F, cellClassName: $, format: R, defaultTime: H, defaultValue: W, arrowControl: j} = L.props;
  return watch(() => e.parsedValue, (t2) => {
    if (t2 && t2.length === 2)
      if (r.value = t2[0], s.value = t2[1], a.value = r.value, e.unlinkPanels && s.value) {
        const e2 = r.value.year(), t3 = r.value.month(), l = s.value.year(), a2 = s.value.month();
        i.value = e2 === l && t3 === a2 ? s.value.add(1, "month") : s.value;
      } else
        i.value = a.value.add(1, "month");
    else {
      const e2 = A();
      r.value = null, s.value = null, a.value = e2[0], i.value = e2[1];
    }
  }, {immediate: true}), {shortcuts: z, disabledDate: F, cellClassName: $, minTimePickerVisible: P, maxTimePickerVisible: V, handleMinTimeClose: () => {
    P.value = false;
  }, handleMaxTimeClose: () => {
    V.value = false;
  }, handleShortcutClick: (e2) => {
    e2.value ? t.emit("pick", [ie(e2.value[0]), ie(e2.value[1])]) : e2.onClick && e2.onClick(t);
  }, rangeState: T, minDate: r, maxDate: s, handleRangePick: (e2, t2 = true) => {
    const l = I(e2.minDate, 0), a2 = I(e2.maxDate, 1);
    s.value === a2 && r.value === l || (s.value = a2, r.value = l, t2 && !D.value && O());
  }, onSelect: (e2) => {
    T.value.selecting = e2, e2 || (T.value.endDate = null);
  }, handleChangeRange: (e2) => {
    T.value = e2;
  }, btnDisabled: N, enableYearArrow: S, enableMonthArrow: _, rightPrevMonth: () => {
    i.value = i.value.subtract(1, "month");
  }, rightPrevYear: () => {
    i.value = i.value.subtract(1, "year");
  }, rightNextMonth: () => {
    e.unlinkPanels ? i.value = i.value.add(1, "month") : (a.value = a.value.add(1, "month"), i.value = a.value.add(1, "month"));
  }, rightNextYear: () => {
    e.unlinkPanels ? i.value = i.value.add(1, "year") : (a.value = a.value.add(1, "year"), i.value = a.value.add(1, "month"));
  }, leftPrevMonth: () => {
    a.value = a.value.subtract(1, "month"), e.unlinkPanels || (i.value = a.value.add(1, "month"));
  }, leftPrevYear: () => {
    a.value = a.value.subtract(1, "year"), e.unlinkPanels || (i.value = a.value.add(1, "month"));
  }, leftNextMonth: () => {
    a.value = a.value.add(1, "month");
  }, leftNextYear: () => {
    a.value = a.value.add(1, "year");
  }, hasShortcuts: g, leftLabel: c, rightLabel: p2, leftDate: a, rightDate: i, showTime: D, t: ya, minVisibleDate: b, maxVisibleDate: y, minVisibleTime: k, maxVisibleTime: C, arrowControl: j, handleDateInput: (t2, l) => {
    u.value[l] = t2;
    const n = ie(t2, w.value);
    if (n.isValid()) {
      if (F && F(n.toDate()))
        return;
      l === "min" ? (a.value = n, r.value = (r.value || a.value).year(n.year()).month(n.month()).date(n.date()), e.unlinkPanels || (i.value = n.add(1, "month"), s.value = r.value.add(1, "month"))) : (i.value = n, s.value = (s.value || i.value).year(n.year()).month(n.month()).date(n.date()), e.unlinkPanels || (a.value = n.subtract(1, "month"), r.value = s.value.subtract(1, "month")));
    }
  }, handleDateChange: (e2, t2) => {
    u.value[t2] = null;
  }, handleTimeInput: (e2, t2) => {
    d.value[t2] = e2;
    const l = ie(e2, x.value);
    l.isValid() && (t2 === "min" ? (P.value = true, r.value = (r.value || a.value).hour(l.hour()).minute(l.minute()).second(l.second()), s.value && !s.value.isBefore(r.value) || (s.value = r.value)) : (V.value = true, s.value = (s.value || i.value).hour(l.hour()).minute(l.minute()).second(l.second()), i.value = s.value, s.value && s.value.isBefore(r.value) && (r.value = s.value)));
  }, handleTimeChange: (e2, t2) => {
    d.value[t2] = null, t2 === "min" ? (a.value = r.value, P.value = false) : (i.value = s.value, V.value = false);
  }, handleMinTimePick: (e2, t2, l) => {
    d.value.min || (e2 && (a.value = e2, r.value = (r.value || a.value).hour(e2.hour()).minute(e2.minute()).second(e2.second())), l || (P.value = t2), s.value && !s.value.isBefore(r.value) || (s.value = r.value));
  }, handleMaxTimePick: (e2, t2, l) => {
    d.value.max || (e2 && (i.value = e2, s.value = (s.value || i.value).hour(e2.hour()).minute(e2.minute()).second(e2.second())), l || (V.value = t2), s.value && s.value.isBefore(r.value) && (r.value = s.value));
  }, handleClear: B, handleConfirm: O, timeFormat: x};
}});
const Ni = {class: "el-picker-panel__body-wrapper"}, Di = {key: 0, class: "el-picker-panel__sidebar"}, Oi = {class: "el-picker-panel__body"}, Ii = {key: 0, class: "el-date-range-picker__time-header"}, Pi = {class: "el-date-range-picker__editors-wrap"}, Vi = {class: "el-date-range-picker__time-picker-wrap"}, Bi = {class: "el-date-range-picker__time-picker-wrap"}, Ai = createVNode("span", {class: "el-icon-arrow-right"}, null, -1), Li = {class: "el-date-range-picker__editors-wrap is-right"}, zi = {class: "el-date-range-picker__time-picker-wrap"}, Fi = {class: "el-date-range-picker__time-picker-wrap"}, $i = {class: "el-picker-panel__content el-date-range-picker__content is-left"}, Ri = {class: "el-date-range-picker__header"}, Hi = {class: "el-picker-panel__content el-date-range-picker__content is-right"}, Wi = {class: "el-date-range-picker__header"}, ji = {key: 0, class: "el-picker-panel__footer"};
Ti.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("time-pick-panel"), p2 = resolveComponent("date-table"), b = resolveComponent("el-button"), y = resolveDirective("clickoutside");
  return openBlock(), createBlock("div", {class: ["el-picker-panel el-date-range-picker", [{"has-sidebar": e.$slots.sidebar || e.hasShortcuts, "has-time": e.showTime}]]}, [createVNode("div", Ni, [renderSlot(e.$slots, "sidebar", {class: "el-picker-panel__sidebar"}), e.hasShortcuts ? (openBlock(), createBlock("div", Di, [(openBlock(true), createBlock(Fragment, null, renderList(e.shortcuts, (t2, l2) => (openBlock(), createBlock("button", {key: l2, type: "button", class: "el-picker-panel__shortcut", onClick: (l3) => e.handleShortcutClick(t2)}, toDisplayString(t2.text), 9, ["onClick"]))), 128))])) : createCommentVNode("v-if", true), createVNode("div", Oi, [e.showTime ? (openBlock(), createBlock("div", Ii, [createVNode("span", Pi, [createVNode("span", Vi, [createVNode(i, {size: "small", disabled: e.rangeState.selecting, placeholder: e.t("el.datepicker.startDate"), class: "el-date-range-picker__editor", "model-value": e.minVisibleDate, onInput: t[1] || (t[1] = (t2) => e.handleDateInput(t2, "min")), onChange: t[2] || (t[2] = (t2) => e.handleDateChange(t2, "min"))}, null, 8, ["disabled", "placeholder", "model-value"])]), withDirectives(createVNode("span", Bi, [createVNode(i, {size: "small", class: "el-date-range-picker__editor", disabled: e.rangeState.selecting, placeholder: e.t("el.datepicker.startTime"), "model-value": e.minVisibleTime, onFocus: t[3] || (t[3] = (t2) => e.minTimePickerVisible = true), onInput: t[4] || (t[4] = (t2) => e.handleTimeInput(t2, "min")), onChange: t[5] || (t[5] = (t2) => e.handleTimeChange(t2, "min"))}, null, 8, ["disabled", "placeholder", "model-value"]), createVNode(r, {visible: e.minTimePickerVisible, format: e.timeFormat, "datetime-role": "start", "time-arrow-control": e.arrowControl, "parsed-value": e.leftDate, onPick: e.handleMinTimePick}, null, 8, ["visible", "format", "time-arrow-control", "parsed-value", "onPick"])], 512), [[y, e.handleMinTimeClose]])]), Ai, createVNode("span", Li, [createVNode("span", zi, [createVNode(i, {size: "small", class: "el-date-range-picker__editor", disabled: e.rangeState.selecting, placeholder: e.t("el.datepicker.endDate"), "model-value": e.maxVisibleDate, readonly: !e.minDate, onInput: t[6] || (t[6] = (t2) => e.handleDateInput(t2, "max")), onChange: t[7] || (t[7] = (t2) => e.handleDateChange(t2, "max"))}, null, 8, ["disabled", "placeholder", "model-value", "readonly"])]), withDirectives(createVNode("span", Fi, [createVNode(i, {size: "small", class: "el-date-range-picker__editor", disabled: e.rangeState.selecting, placeholder: e.t("el.datepicker.endTime"), "model-value": e.maxVisibleTime, readonly: !e.minDate, onFocus: t[8] || (t[8] = (t2) => e.minDate && (e.maxTimePickerVisible = true)), onInput: t[9] || (t[9] = (t2) => e.handleTimeInput(t2, "max")), onChange: t[10] || (t[10] = (t2) => e.handleTimeChange(t2, "max"))}, null, 8, ["disabled", "placeholder", "model-value", "readonly"]), createVNode(r, {"datetime-role": "end", visible: e.maxTimePickerVisible, format: e.timeFormat, "time-arrow-control": e.arrowControl, "parsed-value": e.rightDate, onPick: e.handleMaxTimePick}, null, 8, ["visible", "format", "time-arrow-control", "parsed-value", "onPick"])], 512), [[y, e.handleMaxTimeClose]])])])) : createCommentVNode("v-if", true), createVNode("div", $i, [createVNode("div", Ri, [createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-d-arrow-left", onClick: t[11] || (t[11] = (...t2) => e.leftPrevYear && e.leftPrevYear(...t2))}), createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-arrow-left", onClick: t[12] || (t[12] = (...t2) => e.leftPrevMonth && e.leftPrevMonth(...t2))}), e.unlinkPanels ? (openBlock(), createBlock("button", {key: 0, type: "button", disabled: !e.enableYearArrow, class: [{"is-disabled": !e.enableYearArrow}, "el-picker-panel__icon-btn el-icon-d-arrow-right"], onClick: t[13] || (t[13] = (...t2) => e.leftNextYear && e.leftNextYear(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), e.unlinkPanels ? (openBlock(), createBlock("button", {key: 1, type: "button", disabled: !e.enableMonthArrow, class: [{"is-disabled": !e.enableMonthArrow}, "el-picker-panel__icon-btn el-icon-arrow-right"], onClick: t[14] || (t[14] = (...t2) => e.leftNextMonth && e.leftNextMonth(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), createVNode("div", null, toDisplayString(e.leftLabel), 1)]), createVNode(p2, {"selection-mode": "range", date: e.leftDate, "min-date": e.minDate, "max-date": e.maxDate, "range-state": e.rangeState, "disabled-date": e.disabledDate, "cell-class-name": e.cellClassName, onChangerange: e.handleChangeRange, onPick: e.handleRangePick, onSelect: e.onSelect}, null, 8, ["date", "min-date", "max-date", "range-state", "disabled-date", "cell-class-name", "onChangerange", "onPick", "onSelect"])]), createVNode("div", Hi, [createVNode("div", Wi, [e.unlinkPanels ? (openBlock(), createBlock("button", {key: 0, type: "button", disabled: !e.enableYearArrow, class: [{"is-disabled": !e.enableYearArrow}, "el-picker-panel__icon-btn el-icon-d-arrow-left"], onClick: t[15] || (t[15] = (...t2) => e.rightPrevYear && e.rightPrevYear(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), e.unlinkPanels ? (openBlock(), createBlock("button", {key: 1, type: "button", disabled: !e.enableMonthArrow, class: [{"is-disabled": !e.enableMonthArrow}, "el-picker-panel__icon-btn el-icon-arrow-left"], onClick: t[16] || (t[16] = (...t2) => e.rightPrevMonth && e.rightPrevMonth(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-d-arrow-right", onClick: t[17] || (t[17] = (...t2) => e.rightNextYear && e.rightNextYear(...t2))}), createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-arrow-right", onClick: t[18] || (t[18] = (...t2) => e.rightNextMonth && e.rightNextMonth(...t2))}), createVNode("div", null, toDisplayString(e.rightLabel), 1)]), createVNode(p2, {"selection-mode": "range", date: e.rightDate, "min-date": e.minDate, "max-date": e.maxDate, "range-state": e.rangeState, "disabled-date": e.disabledDate, "cell-class-name": e.cellClassName, onChangerange: e.handleChangeRange, onPick: e.handleRangePick, onSelect: e.onSelect}, null, 8, ["date", "min-date", "max-date", "range-state", "disabled-date", "cell-class-name", "onChangerange", "onPick", "onSelect"])])])]), e.showTime ? (openBlock(), createBlock("div", ji, [createVNode(b, {size: "mini", type: "text", class: "el-picker-panel__link-btn", onClick: e.handleClear}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.clear")), 1)]), _: 1}, 8, ["onClick"]), createVNode(b, {plain: "", size: "mini", class: "el-picker-panel__link-btn", disabled: e.btnDisabled, onClick: t[19] || (t[19] = (t2) => e.handleConfirm(false))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.t("el.datepicker.confirm")), 1)]), _: 1}, 8, ["disabled"])])) : createCommentVNode("v-if", true)], 2);
}, Ti.__file = "packages/date-picker/src/date-picker-com/panel-date-range.vue";
var Ki = defineComponent({components: {MonthTable: ni}, props: {unlinkPanels: Boolean, parsedValue: {type: Array}}, emits: ["pick", "set-picker-option"], setup(e, t) {
  const a = ref(ie()), i = ref(ie().add(1, "year")), r = computed(() => !!b.length), s = computed(() => `${a.value.year()} ${ya("el.datepicker.year")}`), u = computed(() => `${i.value.year()} ${ya("el.datepicker.year")}`), d = computed(() => a.value.year()), c = computed(() => i.value.year() === a.value.year() ? a.value.year() + 1 : i.value.year()), p2 = computed(() => e.unlinkPanels && c.value > d.value + 1), h2 = ref(null), v = ref(null), m = ref({endDate: null, selecting: false}), f = (e2 = false) => {
    var l;
    l = [h2.value, v.value], Array.isArray(l) && l && l[0] && l[1] && l[0].valueOf() <= l[1].valueOf() && t.emit("pick", [h2.value, v.value], e2);
  };
  t.emit("set-picker-option", ["formatToString", (e2) => e2.map((e3) => e3.format(k))]);
  const g = inject("EP_PICKER_BASE"), {shortcuts: b, disabledDate: y, format: k, defaultValue: C} = g.props;
  return watch(() => e.parsedValue, (t2) => {
    if (t2 && t2.length === 2)
      if (h2.value = t2[0], v.value = t2[1], a.value = h2.value, e.unlinkPanels && v.value) {
        const e2 = h2.value.year(), t3 = v.value.year();
        i.value = e2 === t3 ? v.value.add(1, "year") : v.value;
      } else
        i.value = a.value.add(1, "year");
    else {
      const t3 = (() => {
        let t4;
        if (Array.isArray(C)) {
          const t5 = ie(C[0]);
          let l = ie(C[1]);
          return e.unlinkPanels || (l = t5.add(1, "year")), [t5, l];
        }
        return t4 = C ? ie(C) : ie(), [t4, t4.add(1, "year")];
      })();
      a.value = t3[0], i.value = t3[1];
    }
  }, {immediate: true}), {shortcuts: b, disabledDate: y, onSelect: (e2) => {
    m.value.selecting = e2, e2 || (m.value.endDate = null);
  }, handleRangePick: (e2, t2 = true) => {
    const l = e2.minDate, a2 = e2.maxDate;
    v.value === a2 && h2.value === l || (v.value = a2, h2.value = l, t2 && f());
  }, rangeState: m, handleChangeRange: (e2) => {
    m.value = e2;
  }, minDate: h2, maxDate: v, enableYearArrow: p2, leftLabel: s, rightLabel: u, leftNextYear: () => {
    a.value = a.value.add(1, "year");
  }, leftPrevYear: () => {
    a.value = a.value.subtract(1, "year"), e.unlinkPanels || (i.value = i.value.subtract(1, "year"));
  }, rightNextYear: () => {
    e.unlinkPanels || (a.value = a.value.add(1, "year")), i.value = i.value.add(1, "year");
  }, rightPrevYear: () => {
    i.value = i.value.subtract(1, "year");
  }, t: ya, leftDate: a, rightDate: i, hasShortcuts: r, handleShortcutClick: (e2) => {
    e2.value ? t.emit("pick", [ie(e2.value[0]), ie(e2.value[1])]) : e2.onClick && e2.onClick(t);
  }};
}});
const Yi = {class: "el-picker-panel__body-wrapper"}, qi = {key: 0, class: "el-picker-panel__sidebar"}, Ui = {class: "el-picker-panel__body"}, Gi = {class: "el-picker-panel__content el-date-range-picker__content is-left"}, Xi = {class: "el-date-range-picker__header"}, Zi = {class: "el-picker-panel__content el-date-range-picker__content is-right"}, Qi = {class: "el-date-range-picker__header"};
Ki.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("month-table");
  return openBlock(), createBlock("div", {class: ["el-picker-panel el-date-range-picker", [{"has-sidebar": e.$slots.sidebar || e.hasShortcuts}]]}, [createVNode("div", Yi, [renderSlot(e.$slots, "sidebar", {class: "el-picker-panel__sidebar"}), e.hasShortcuts ? (openBlock(), createBlock("div", qi, [(openBlock(true), createBlock(Fragment, null, renderList(e.shortcuts, (t2, l2) => (openBlock(), createBlock("button", {key: l2, type: "button", class: "el-picker-panel__shortcut", onClick: (l3) => e.handleShortcutClick(t2)}, toDisplayString(t2.text), 9, ["onClick"]))), 128))])) : createCommentVNode("v-if", true), createVNode("div", Ui, [createVNode("div", Gi, [createVNode("div", Xi, [createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-d-arrow-left", onClick: t[1] || (t[1] = (...t2) => e.leftPrevYear && e.leftPrevYear(...t2))}), e.unlinkPanels ? (openBlock(), createBlock("button", {key: 0, type: "button", disabled: !e.enableYearArrow, class: [{"is-disabled": !e.enableYearArrow}, "el-picker-panel__icon-btn el-icon-d-arrow-right"], onClick: t[2] || (t[2] = (...t2) => e.leftNextYear && e.leftNextYear(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), createVNode("div", null, toDisplayString(e.leftLabel), 1)]), createVNode(i, {"selection-mode": "range", date: e.leftDate, "min-date": e.minDate, "max-date": e.maxDate, "range-state": e.rangeState, "disabled-date": e.disabledDate, onChangerange: e.handleChangeRange, onPick: e.handleRangePick, onSelect: e.onSelect}, null, 8, ["date", "min-date", "max-date", "range-state", "disabled-date", "onChangerange", "onPick", "onSelect"])]), createVNode("div", Zi, [createVNode("div", Qi, [e.unlinkPanels ? (openBlock(), createBlock("button", {key: 0, type: "button", disabled: !e.enableYearArrow, class: [{"is-disabled": !e.enableYearArrow}, "el-picker-panel__icon-btn el-icon-d-arrow-left"], onClick: t[3] || (t[3] = (...t2) => e.rightPrevYear && e.rightPrevYear(...t2))}, null, 10, ["disabled"])) : createCommentVNode("v-if", true), createVNode("button", {type: "button", class: "el-picker-panel__icon-btn el-icon-d-arrow-right", onClick: t[4] || (t[4] = (...t2) => e.rightNextYear && e.rightNextYear(...t2))}), createVNode("div", null, toDisplayString(e.rightLabel), 1)]), createVNode(i, {"selection-mode": "range", date: e.rightDate, "min-date": e.minDate, "max-date": e.maxDate, "range-state": e.rangeState, "disabled-date": e.disabledDate, onChangerange: e.handleChangeRange, onPick: e.handleRangePick, onSelect: e.onSelect}, null, 8, ["date", "min-date", "max-date", "range-state", "disabled-date", "onChangerange", "onPick", "onSelect"])])])])], 2);
}, Ki.__file = "packages/date-picker/src/date-picker-com/panel-month-range.vue", ie.extend(re), ie.extend(ce), ie.extend(se), ie.extend(pe), ie.extend(he), ie.extend(ve), ie.extend(me), ie.extend(fe);
const Ji = defineComponent({name: "ElDatePicker", install: null, props: Object.assign(Object.assign({}, Ca), {type: {type: String, default: "date"}}), emits: ["update:modelValue"], setup(e, t) {
  provide("ElPopperOptions", e.popperOptions);
  const a = ref(null), n = ka[e.type] || "YYYY-MM-DD", o = Object.assign(Object.assign({}, e), {focus: () => {
    var e2;
    (e2 = a.value) === null || e2 === void 0 || e2.handleFocus();
  }});
  return t.expose(o), () => h(_a, Object.assign(Object.assign({format: n}, e), {type: e.type, ref: a, "onUpdate:modelValue": (e2) => t.emit("update:modelValue", e2)}), {default: (t2) => {
    return h((l = e.type) === "daterange" || l === "datetimerange" ? Ti : l === "monthrange" ? Ki : yi, t2);
    var l;
  }});
}});
Ji.install = (e) => {
  e.component(Ji.name, Ji);
};
var er = defineComponent({name: "ElOverlay", props: {mask: {type: Boolean, default: true}, overlayClass: {type: [String, Array, Object]}, zIndex: {type: Number}}, emits: ["click"], setup(e, {slots: t, emit: l}) {
  let a = false, n = false;
  const o = (e2) => {
    a && n && l("click", e2), a = n = false;
  };
  return () => e.mask ? createVNode("div", {class: ["el-overlay", e.overlayClass], style: {zIndex: e.zIndex}, onClick: o, onMousedown: (t2) => {
    e.mask && (a = t2.target === t2.currentTarget);
  }, onMouseup: (t2) => {
    e.mask && (n = t2.target === t2.currentTarget);
  }}, [renderSlot(t, "default")], kl.STYLE | kl.CLASS | kl.PROPS, ["onClick", "onMouseup", "onMousedown"]) : h("div", {class: e.overlayClass, style: {zIndex: e.zIndex, position: "fixed", top: "0px", right: "0px", bottom: "0px", left: "0px"}}, [renderSlot(t, "default")]);
}});
er.__file = "packages/overlay/src/index.vue";
function tr(e, t, a) {
  const r = ref(false), s = ref(false), u = ref(null), d = ref(null), c = ref(null), p2 = ref(false), h2 = ref(e.zIndex || Pl.nextZIndex()), v = ref(null), m = computed(() => {
    const t2 = {};
    return e.fullscreen || (t2.marginTop = e.top, e.width && (t2.width = je(e.width) ? e.width + "px" : e.width)), t2;
  });
  function f() {
    Ye(c), Ye(d), e.openDelay && e.openDelay > 0 ? d.value = window.setTimeout(() => {
      d.value = null, k();
    }, e.openDelay) : k();
  }
  function g() {
    Ye(d), Ye(c), e.closeDelay && e.closeDelay > 0 ? c.value = window.setTimeout(() => {
      c.value = null, C();
    }, e.closeDelay) : C();
  }
  function b(e2) {
    e2 || (s.value = true, r.value = false);
  }
  function y() {
    e.beforeClose ? e.beforeClose(b) : g();
  }
  function k() {
    ye || (r.value = true);
  }
  function C() {
    r.value = false;
  }
  return e.lockScroll && Tt(r), e.closeOnPressEscape && At({handleClose: y}, r), Nt(r), watch(() => e.modelValue, (l) => {
    l ? (s.value = false, f(), p2.value = true, t.emit("open"), h2.value = e.zIndex ? h2.value++ : Pl.nextZIndex(), nextTick(() => {
      a.value && (a.value.scrollTop = 0);
    })) : r.value && g();
  }), onMounted(() => {
    e.modelValue && (r.value = true, p2.value = true, f());
  }), {afterEnter: function() {
    t.emit("opened");
  }, afterLeave: function() {
    t.emit("closed"), t.emit(qt, false), e.destroyOnClose && (p2.value = false);
  }, beforeLeave: function() {
    t.emit("close");
  }, handleClose: y, onModalClick: function() {
    e.closeOnClickModal && y();
  }, closed: s, dialogRef: u, style: m, rendered: p2, modalRef: v, visible: r, zIndex: h2};
}
var lr = defineComponent({name: "ElDialog", components: {"el-overlay": er}, directives: {TrapFocus: jt}, props: {appendToBody: {type: Boolean, default: false}, beforeClose: {type: Function}, destroyOnClose: {type: Boolean, default: false}, center: {type: Boolean, default: false}, customClass: {type: String, default: ""}, closeOnClickModal: {type: Boolean, default: true}, closeOnPressEscape: {type: Boolean, default: true}, fullscreen: {type: Boolean, default: false}, lockScroll: {type: Boolean, default: true}, modal: {type: Boolean, default: true}, showClose: {type: Boolean, default: true}, title: {type: String, default: ""}, openDelay: {type: Number, default: 0}, closeDelay: {type: Number, default: 0}, top: {type: String, default: "15vh"}, modelValue: {type: Boolean, required: true}, modalClass: String, width: {type: [String, Number], default: "50%", validator: (e) => !!je(e) || ["px", "rem", "em", "vw", "%", "vmin", "vmax"].some((t) => e.endsWith(t))}, zIndex: {type: Number}}, emits: ["open", "opened", "close", "closed", qt], setup(e, t) {
  const a = ref(null);
  return Object.assign(Object.assign({}, tr(e, t, a)), {dialogRef: a});
}});
const ar = {class: "el-dialog__header"}, nr = {class: "el-dialog__title"}, or = createVNode("i", {class: "el-dialog__close el-icon el-icon-close"}, null, -1), ir = {key: 0, class: "el-dialog__body"}, rr = {key: 1, class: "el-dialog__footer"};
lr.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-overlay"), r = resolveDirective("trap-focus");
  return openBlock(), createBlock(Teleport, {to: "body", disabled: !e.appendToBody}, [createVNode(Transition, {name: "dialog-fade", onAfterEnter: e.afterEnter, onAfterLeave: e.afterLeave, onBeforeLeave: e.beforeLeave}, {default: withCtx(() => [withDirectives(createVNode(i, {mask: e.modal, "overlay-class": e.modalClass, "z-index": e.zIndex, onClick: e.onModalClick}, {default: withCtx(() => [withDirectives(createVNode("div", {ref: "dialogRef", class: ["el-dialog", {"is-fullscreen": e.fullscreen, "el-dialog--center": e.center}, e.customClass], "aria-modal": "true", role: "dialog", "aria-label": e.title || "dialog", style: e.style, onClick: t[2] || (t[2] = withModifiers(() => {
  }, ["stop"]))}, [createVNode("div", ar, [renderSlot(e.$slots, "title", {}, () => [createVNode("span", nr, toDisplayString(e.title), 1)]), e.showClose ? (openBlock(), createBlock("button", {key: 0, "aria-label": "close", class: "el-dialog__headerbtn", type: "button", onClick: t[1] || (t[1] = (...t2) => e.handleClose && e.handleClose(...t2))}, [or])) : createCommentVNode("v-if", true)]), e.rendered ? (openBlock(), createBlock("div", ir, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true), e.$slots.footer ? (openBlock(), createBlock("div", rr, [renderSlot(e.$slots, "footer")])) : createCommentVNode("v-if", true)], 14, ["aria-label"]), [[r]])]), _: 3}, 8, ["mask", "overlay-class", "z-index", "onClick"]), [[vShow, e.visible]])]), _: 1}, 8, ["onAfterEnter", "onAfterLeave", "onBeforeLeave"])], 8, ["disabled"]);
}, lr.__file = "packages/dialog/src/index.vue", lr.install = (e) => {
  e.component(lr.name, lr);
};
const sr = lr;
var ur = defineComponent({name: "ElDivider", props: {direction: {type: String, default: "horizontal", validator: (e) => ["horizontal", "vertical"].indexOf(e) !== -1}, contentPosition: {type: String, default: "center", validator: (e) => ["left", "center", "right"].indexOf(e) !== -1}}});
ur.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-divider", "el-divider--" + e.direction]}, [e.$slots.default && e.direction !== "vertical" ? (openBlock(), createBlock("div", {key: 0, class: ["el-divider__text", "is-" + e.contentPosition]}, [renderSlot(e.$slots, "default")], 2)) : createCommentVNode("v-if", true)], 2);
}, ur.__file = "packages/divider/src/index.vue", ur.install = (e) => {
  e.component(ur.name, ur);
};
const dr = ur;
var cr = defineComponent({name: "ElDrawer", components: {[er.name]: er}, directives: {TrapFocus: jt}, props: {modelValue: {type: Boolean, required: true}, appendToBody: {type: Boolean, default: false}, beforeClose: Function, customClass: {type: String, default: ""}, direction: {type: String, default: "rtl", validator: (e) => ["ltr", "rtl", "ttb", "btt"].indexOf(e) !== -1}, showClose: {type: Boolean, default: true}, size: {type: [String, Number], default: "30%"}, title: {type: String, default: ""}, closeOnClickModal: {type: Boolean, default: true}, withHeader: {type: Boolean, default: true}, openDelay: {type: Number, default: 0}, closeDelay: {type: Number, default: 0}, zIndex: Number, modal: {type: Boolean, default: true}, modalFade: {type: Boolean, default: true}, modalClass: String, lockScroll: {type: Boolean, default: true}, closeOnPressEscape: {type: Boolean, default: true}, destroyOnClose: {type: Boolean, default: false}}, emits: ["open", "opened", "close", "closed", "update:modelValue"], setup(e, t) {
  const a = ref(null);
  return Object.assign(Object.assign({}, tr(e, t, a)), {drawerRef: a, isHorizontal: computed(() => e.direction === "rtl" || e.direction === "ltr"), drawerSize: computed(() => typeof e.size == "number" ? e.size + "px" : e.size)});
}});
const pr = {key: 0, id: "el-drawer__title", class: "el-drawer__header"}, hr = createVNode("i", {class: "el-drawer__close el-icon el-icon-close"}, null, -1), vr = {key: 1, class: "el-drawer__body"};
cr.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-overlay"), r = resolveDirective("trap-focus");
  return openBlock(), createBlock(Teleport, {to: "body", disabled: !e.appendToBody}, [createVNode(Transition, {name: "el-drawer-fade", onAfterEnter: e.afterEnter, onAfterLeave: e.afterLeave, onBeforeLeave: e.beforeLeave}, {default: withCtx(() => [withDirectives(createVNode(i, {mask: e.modal, "overlay-class": e.modalClass, "z-index": e.zIndex, onClick: e.onModalClick}, {default: withCtx(() => [withDirectives(createVNode("div", {ref: "drawerRef", "aria-modal": "true", "aria-labelledby": "el-drawer__title", "aria-label": e.title, class: ["el-drawer", e.direction, e.customClass], style: e.isHorizontal ? "width: " + e.drawerSize : "height: " + e.drawerSize, role: "dialog", onClick: t[2] || (t[2] = withModifiers(() => {
  }, ["stop"]))}, [e.withHeader ? (openBlock(), createBlock("header", pr, [renderSlot(e.$slots, "title", {}, () => [createVNode("span", {role: "heading", title: e.title}, toDisplayString(e.title), 9, ["title"])]), e.showClose ? (openBlock(), createBlock("button", {key: 0, "aria-label": "close " + (e.title || "drawer"), class: "el-drawer__close-btn", type: "button", onClick: t[1] || (t[1] = (...t2) => e.handleClose && e.handleClose(...t2))}, [hr], 8, ["aria-label"])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), e.rendered ? (openBlock(), createBlock("section", vr, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true)], 14, ["aria-label"]), [[r]])]), _: 3}, 8, ["mask", "overlay-class", "z-index", "onClick"]), [[vShow, e.visible]])]), _: 1}, 8, ["onAfterEnter", "onAfterLeave", "onBeforeLeave"])], 8, ["disabled"]);
}, cr.__file = "packages/drawer/src/index.vue", cr.install = (e) => {
  e.component(cr.name, cr);
};
const mr = cr, fr = () => {
  const e = Ue(), t = inject("elDropdown", {}), l = computed(() => t == null ? void 0 : t.dropdownSize);
  return {ELEMENT: e, elDropdown: t, _elDropdownSize: l};
}, gr = (e, t, a) => {
  const n = ref(null), o = ref(null), i = ref(null), r = ref("dropdown-menu-" + Re());
  function s() {
    var e2;
    t.setAttribute("tabindex", "-1"), (e2 = o.value) === null || e2 === void 0 || e2.forEach((e3) => {
      e3.setAttribute("tabindex", "-1");
    });
  }
  function u(e2) {
    s(), e2 == null || e2.setAttribute("tabindex", "0");
  }
  function d(e2) {
    const t2 = e2.code;
    [Dt.up, Dt.down].includes(t2) ? (s(), u(n.value[0]), n.value[0].focus(), e2.preventDefault(), e2.stopPropagation()) : t2 === Dt.enter ? a.handleClick() : [Dt.tab, Dt.esc].includes(t2) && a.hide();
  }
  function c(e2) {
    const t2 = e2.code, l = e2.target, i2 = o.value.indexOf(l), r2 = o.value.length - 1;
    let d2;
    [Dt.up, Dt.down].includes(t2) ? (d2 = t2 === Dt.up ? i2 !== 0 ? i2 - 1 : 0 : i2 < r2 ? i2 + 1 : r2, s(), u(n.value[d2]), n.value[d2].focus(), e2.preventDefault(), e2.stopPropagation()) : t2 === Dt.enter ? (p2(), l.click(), a.props.hideOnClick && a.hide()) : [Dt.tab, Dt.esc].includes(t2) && (a.hide(), p2());
  }
  function p2() {
    t.focus();
  }
  i.value = e == null ? void 0 : e.subTree.el, n.value = i.value.querySelectorAll("[tabindex='-1']"), o.value = [].slice.call(n.value), tt(t, "keydown", d), tt(i.value, "keydown", c, true), i.value.setAttribute("id", r.value), t.setAttribute("aria-haspopup", "list"), t.setAttribute("aria-controls", r.value), a.props.splitButton || (t.setAttribute("role", "button"), t.setAttribute("tabindex", a.props.tabindex), nt(t, "el-dropdown-selfdefine"));
};
var br = defineComponent({name: "ElDropdown", components: {ElButton: pa, ElButtonGroup: ma, ElScrollbar: yl, ElPopper: Hl}, props: {trigger: {type: String, default: "hover"}, type: String, size: {type: String, default: ""}, splitButton: Boolean, hideOnClick: {type: Boolean, default: true}, placement: {type: String, default: "bottom"}, showTimeout: {type: Number, default: 150}, hideTimeout: {type: Number, default: 150}, tabindex: {type: Number, default: 0}, effect: {type: String, default: "light"}, maxHeight: {type: [Number, String], default: ""}}, emits: ["visible-change", "click", "command"], setup(t, {emit: a}) {
  const r = getCurrentInstance(), {ELEMENT: s} = fr(), u = ref(null), d = ref(false), c = ref(null), p2 = computed(() => "max-height: " + et(t.maxHeight));
  watch(() => d.value, (e) => {
    var t2, l;
    e && ((l = (t2 = m.value) === null || t2 === void 0 ? void 0 : t2.focus) === null || l === void 0 || l.call(t2)), e || function() {
      var e2, t3;
      (t3 = (e2 = m.value) === null || e2 === void 0 ? void 0 : e2.blur) === null || t3 === void 0 || t3.call(e2);
    }(), a("visible-change", e);
  });
  const h2 = ref(false);
  watch(() => h2.value, (e) => {
    const t2 = m.value;
    t2 && (e ? nt(t2, "focusing") : ot(t2, "focusing"));
  });
  const v = ref(null), m = computed(() => {
    var e, l, a2, n;
    const o = (a2 = (l = (e = v.value) === null || e === void 0 ? void 0 : e.$refs.triggerRef) === null || l === void 0 ? void 0 : l.children[0]) !== null && a2 !== void 0 ? a2 : {};
    return t.splitButton ? (n = o.children) === null || n === void 0 ? void 0 : n[1] : o;
  });
  function f() {
    var e;
    ((e = m.value) === null || e === void 0 ? void 0 : e.disabled) || (d.value ? b() : g());
  }
  function g() {
    var e;
    ((e = m.value) === null || e === void 0 ? void 0 : e.disabled) || (u.value && clearTimeout(u.value), u.value = window.setTimeout(() => {
      d.value = true;
    }, ["click", "contextmenu"].includes(t.trigger) ? 0 : t.showTimeout));
  }
  function b() {
    var e;
    ((e = m.value) === null || e === void 0 ? void 0 : e.disabled) || (y(), t.tabindex >= 0 && k(m.value), clearTimeout(u.value), u.value = window.setTimeout(() => {
      d.value = false;
    }, ["click", "contextmenu"].includes(t.trigger) ? 0 : t.hideTimeout));
  }
  function y() {
    var e;
    (e = m.value) === null || e === void 0 || e.setAttribute("tabindex", "-1");
  }
  function k(e) {
    y(), e == null || e.setAttribute("tabindex", "0");
  }
  const C = computed(() => t.size || s.size);
  provide("elDropdown", {instance: r, dropdownSize: C, visible: d, handleClick: f, commandHandler: function(...e) {
    a("command", ...e);
  }, show: g, hide: b, trigger: computed(() => t.trigger), hideOnClick: computed(() => t.hideOnClick), triggerElm: m}), onMounted(() => {
    t.splitButton || (tt(m.value, "focus", () => {
      h2.value = true;
    }), tt(m.value, "blur", () => {
      h2.value = false;
    }), tt(m.value, "click", () => {
      h2.value = false;
    })), t.trigger === "hover" ? (tt(m.value, "mouseenter", g), tt(m.value, "mouseleave", b)) : t.trigger === "click" ? tt(m.value, "click", f) : t.trigger === "contextmenu" && tt(m.value, "contextmenu", (e) => {
      e.preventDefault(), f();
    }), Object.assign(r, {handleClick: f, hide: b, resetTabindex: k});
  });
  return {visible: d, scrollbar: c, wrapStyle: p2, dropdownSize: C, handlerMainButtonClick: (e) => {
    a("click", e), b();
  }, triggerVnode: v};
}});
const yr = createVNode("i", {class: "el-dropdown__icon el-icon-arrow-down"}, null, -1);
br.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-scrollbar"), r = resolveComponent("el-button"), p2 = resolveComponent("el-button-group"), v = resolveComponent("el-popper");
  return openBlock(), createBlock(v, {ref: "triggerVnode", visible: e.visible, "onUpdate:visible": t[1] || (t[1] = (t2) => e.visible = t2), placement: e.placement, effect: e.effect, pure: "", "manual-mode": true, trigger: [e.trigger], "popper-class": "el-dropdown__popper", "append-to-body": "", transition: "el-zoom-in-top", "stop-popper-mouse-event": false, "gpu-acceleration": false}, {default: withCtx(() => [createVNode(i, {ref: "scrollbar", tag: "ul", "wrap-style": e.wrapStyle, "view-class": "el-dropdown__list"}, {default: withCtx(() => [renderSlot(e.$slots, "dropdown")]), _: 3}, 8, ["wrap-style"])]), trigger: withCtx(() => [createVNode("div", {class: ["el-dropdown", e.dropdownSize ? "el-dropdown--" + e.dropdownSize : ""]}, [e.splitButton ? (openBlock(), createBlock(p2, {key: 1}, {default: withCtx(() => [createVNode(r, {size: e.dropdownSize, type: e.type, onClick: e.handlerMainButtonClick}, {default: withCtx(() => [renderSlot(e.$slots, "default")]), _: 3}, 8, ["size", "type", "onClick"]), createVNode(r, {size: e.dropdownSize, type: e.type, class: "el-dropdown__caret-button"}, {default: withCtx(() => [yr]), _: 1}, 8, ["size", "type"])]), _: 1})) : renderSlot(e.$slots, "default", {key: 0})], 2)]), _: 1}, 8, ["visible", "placement", "effect", "trigger"]);
}, br.__file = "packages/dropdown/src/dropdown.vue", br.install = (e) => {
  e.component(br.name, br);
};
const kr = br;
var Cr = defineComponent({name: "ElDropdownItem", props: {command: {type: [Object, String, Number], default: () => ({})}, disabled: Boolean, divided: Boolean, icon: String}, setup(t) {
  const {elDropdown: l} = fr(), a = getCurrentInstance();
  return {handleClick: function(e) {
    var n, o;
    t.disabled ? e.stopImmediatePropagation() : (l.hideOnClick.value && ((n = l.handleClick) === null || n === void 0 || n.call(l)), (o = l.commandHandler) === null || o === void 0 || o.call(l, t.command, a, e));
  }};
}});
Cr.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("li", {class: ["el-dropdown-menu__item", {"is-disabled": e.disabled, "el-dropdown-menu__item--divided": e.divided}], "aria-disabled": e.disabled, tabindex: e.disabled ? null : -1, onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, [e.icon ? (openBlock(), createBlock("i", {key: 0, class: e.icon}, null, 2)) : createCommentVNode("v-if", true), renderSlot(e.$slots, "default")], 10, ["aria-disabled", "tabindex"]);
}, Cr.__file = "packages/dropdown/src/dropdown-item.vue", Cr.install = (e) => {
  e.component(Cr.name, Cr);
};
const xr = Cr;
var wr = defineComponent({name: "ElDropdownMenu", directives: {ClickOutside: $t}, setup() {
  const {_elDropdownSize: t, elDropdown: l} = fr(), a = t.value;
  function n() {
    var e;
    (e = l.hide) === null || e === void 0 || e.call(l);
  }
  return onMounted(() => {
    const t2 = getCurrentInstance();
    gr(t2, l.triggerElm.value, l.instance);
  }), {size: a, show: function() {
    var e;
    ["click", "contextmenu"].includes(l.trigger.value) || (e = l.show) === null || e === void 0 || e.call(l);
  }, hide: function() {
    ["click", "contextmenu"].includes(l.trigger.value) || n();
  }, innerHide: n, triggerElm: l.triggerElm};
}});
wr.render = function(e, t, l, a, n, o) {
  const i = resolveDirective("clickOutside");
  return withDirectives((openBlock(), createBlock("ul", {class: [[e.size && "el-dropdown-menu--" + e.size], "el-dropdown-menu"], onMouseenter: t[1] || (t[1] = withModifiers((...t2) => e.show && e.show(...t2), ["stop"])), onMouseleave: t[2] || (t[2] = withModifiers((...t2) => e.hide && e.hide(...t2), ["stop"]))}, [renderSlot(e.$slots, "default")], 34)), [[i, e.innerHide, e.triggerElm]]);
}, wr.__file = "packages/dropdown/src/dropdown-menu.vue", wr.install = (e) => {
  e.component(wr.name, wr);
};
const _r = wr;
let Sr = 0;
var Er = defineComponent({name: "ImgEmpty", setup: () => ({id: ++Sr})});
const Mr = {viewBox: "0 0 79 86", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink"}, Tr = createVNode("stop", {"stop-color": "#FCFCFD", offset: "0%"}, null, -1), Nr = createVNode("stop", {"stop-color": "#EEEFF3", offset: "100%"}, null, -1), Dr = createVNode("stop", {"stop-color": "#FCFCFD", offset: "0%"}, null, -1), Or = createVNode("stop", {"stop-color": "#E9EBEF", offset: "100%"}, null, -1), Ir = {id: "Illustrations", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd"}, Pr = {id: "B-type", transform: "translate(-1268.000000, -535.000000)"}, Vr = {id: "Group-2", transform: "translate(1268.000000, 535.000000)"}, Br = createVNode("path", {id: "Oval-Copy-2", d: "M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z", fill: "#F7F8FC"}, null, -1), Ar = createVNode("polygon", {id: "Rectangle-Copy-14", fill: "#E5E7E9", transform: "translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) ", points: "13 58 53 58 42 45 2 45"}, null, -1), Lr = {id: "Group-Copy", transform: "translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"}, zr = createVNode("polygon", {id: "Rectangle-Copy-10", fill: "#E5E7E9", transform: "translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) ", points: "2.84078316e-14 3 18 3 23 7 5 7"}, null, -1), Fr = createVNode("polygon", {id: "Rectangle-Copy-11", fill: "#EDEEF2", points: "-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"}, null, -1), $r = createVNode("polygon", {id: "Rectangle-Copy-13", fill: "#F8F9FB", transform: "translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) ", points: "24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"}, null, -1), Rr = {id: "Rectangle-Copy-17", transform: "translate(53.000000, 45.000000)"}, Hr = createVNode("polygon", {id: "Rectangle-Copy-18", fill: "#F8F9FB", transform: "translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) ", points: "62 45 79 45 70 58 53 58"}, null, -1);
Er.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", Mr, [createVNode("defs", null, [createVNode("linearGradient", {id: "linearGradient-1-" + e.id, x1: "38.8503086%", y1: "0%", x2: "61.1496914%", y2: "100%"}, [Tr, Nr], 8, ["id"]), createVNode("linearGradient", {id: "linearGradient-2-" + e.id, x1: "0%", y1: "9.5%", x2: "100%", y2: "90.5%"}, [Dr, Or], 8, ["id"]), createVNode("rect", {id: "path-3-" + e.id, x: "0", y: "0", width: "17", height: "36"}, null, 8, ["id"])]), createVNode("g", Ir, [createVNode("g", Pr, [createVNode("g", Vr, [Br, Ar, createVNode("g", Lr, [zr, Fr, createVNode("rect", {id: "Rectangle-Copy-12", fill: `url(#linearGradient-1-${e.id})`, transform: "translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) ", x: "38", y: "7", width: "17", height: "36"}, null, 8, ["fill"]), $r]), createVNode("rect", {id: "Rectangle-Copy-15", fill: `url(#linearGradient-2-${e.id})`, x: "13", y: "45", width: "40", height: "36"}, null, 8, ["fill"]), createVNode("g", Rr, [createVNode("mask", {id: "mask-4-" + e.id, fill: "white"}, [createVNode("use", {"xlink:href": "#path-3-" + e.id}, null, 8, ["xlink:href"])], 8, ["id"]), createVNode("use", {id: "Mask", fill: "#E0E3E9", transform: "translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) ", "xlink:href": "#path-3-" + e.id}, null, 8, ["xlink:href"]), createVNode("polygon", {id: "Rectangle-Copy", fill: "#D5D7DE", mask: `url(#mask-4-${e.id})`, transform: "translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) ", points: "7 0 24 0 20 18 -1.70530257e-13 16"}, null, 8, ["mask"])]), Hr])])])]);
}, Er.__file = "packages/empty/src/img-empty.vue";
var Wr = defineComponent({name: "ElEmpty", components: {[Er.name]: Er}, props: {image: {type: String, default: ""}, imageSize: Number, description: {type: String, default: ""}}, setup: (e) => ({emptyDescription: computed(() => e.description || ya("el.table.emptyText")), imageStyle: computed(() => ({width: e.imageSize ? e.imageSize + "px" : ""}))})});
const jr = {class: "el-empty"}, Kr = {class: "el-empty__description"}, Yr = {key: 1}, qr = {key: 0, class: "el-empty__bottom"};
Wr.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("img-empty");
  return openBlock(), createBlock("div", jr, [createVNode("div", {class: "el-empty__image", style: e.imageStyle}, [e.image ? (openBlock(), createBlock("img", {key: 0, src: e.image, ondragstart: "return false"}, null, 8, ["src"])) : renderSlot(e.$slots, "image", {key: 1}, () => [createVNode(i)])], 4), createVNode("div", Kr, [e.$slots.description ? renderSlot(e.$slots, "description", {key: 0}) : (openBlock(), createBlock("p", Yr, toDisplayString(e.emptyDescription), 1))]), e.$slots.default ? (openBlock(), createBlock("div", qr, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true)]);
}, Wr.__file = "packages/empty/src/index.vue", Wr.install = (e) => {
  e.component(Wr.name, Wr);
};
const Ur = Wr;
var Gr = defineComponent({name: "ElFooter", props: {height: {type: String, default: "60px"}}});
Gr.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("footer", {class: "el-footer", style: {height: e.height}}, [renderSlot(e.$slots, "default")], 4);
}, Gr.__file = "packages/container/src/footer.vue", Gr.install = (e) => {
  e.component(Gr.name, Gr);
};
const Xr = Gr;
var Zr = defineComponent({name: "ElLabelWrap", props: {isAutoWidth: Boolean, updateAll: Boolean}, setup(e, {slots: t}) {
  const a = ref(null), n = inject("elForm"), s = inject("elFormItem"), u = ref(0);
  watch(u, (t2, l) => {
    e.updateAll && (n.registerLabelWidth(t2, l), s.updateComputedLabelWidth(t2));
  });
  const d = (l = "update") => {
    nextTick(() => {
      t.default && e.isAutoWidth && (l === "update" ? u.value = (() => {
        var e2;
        if ((e2 = a.value) === null || e2 === void 0 ? void 0 : e2.firstElementChild) {
          const e3 = window.getComputedStyle(a.value.firstElementChild).width;
          return Math.ceil(parseFloat(e3));
        }
        return 0;
      })() : l === "remove" && n.deregisterLabelWidth(u.value));
    });
  }, c = () => d("update");
  return onMounted(() => {
    pt(a.value.firstElementChild, c), c();
  }), onUpdated(c), onBeforeUnmount(() => {
    d("remove"), ht(a.value.firstElementChild, c);
  }), function() {
    var l, o;
    if (!t)
      return null;
    if (e.isAutoWidth) {
      const e2 = n.autoLabelWidth, o2 = {};
      if (e2 && e2 !== "auto") {
        const t2 = parseInt(e2, 10) - u.value;
        t2 && (o2.marginLeft = t2 + "px");
      }
      return h("div", {ref: a, class: ["el-form-item__label-wrap"], style: o2}, (l = t.default) === null || l === void 0 ? void 0 : l.call(t));
    }
    return h(Fragment, {ref: a}, (o = t.default) === null || o === void 0 ? void 0 : o.call(t));
  };
}}), Qr = defineComponent({name: "ElFormItem", componentName: "ElFormItem", components: {LabelWrap: Zr}, props: {label: String, labelWidth: String, prop: String, required: {type: Boolean, default: void 0}, rules: [Object, Array], error: String, validateStatus: String, for: String, inlineMessage: {type: [String, Boolean], default: ""}, showMessage: {type: Boolean, default: true}, size: {types: String, validator: Xt}}, setup(t) {
  const s = ae(), u = Ue(), d = inject("elForm", {}), c = ref(""), p2 = ref(""), h2 = ref(false), v = ref(""), m = getCurrentInstance(), f = computed(() => {
    let e = m.parent;
    for (; e && e.type.name !== "ElForm"; ) {
      if (e.type.name === "ElFormItem")
        return true;
      e = e.parent;
    }
    return false;
  });
  let g = void 0;
  watch(() => t.error, (e) => {
    p2.value = e, c.value = e ? "error" : "";
  }, {immediate: true}), watch(() => t.validateStatus, (e) => {
    c.value = e;
  });
  const b = computed(() => t.for || t.prop), y = computed(() => {
    if (d.labelPosition === "top")
      return {};
    const e = t.labelWidth || d.labelWidth;
    return e ? {width: e} : {};
  }), k = computed(() => {
    if (d.labelPosition === "top" || d.inline)
      return {};
    if (!t.label && !t.labelWidth && f.value)
      return {};
    const e = t.labelWidth || d.labelWidth, l = {};
    return e === "auto" ? t.labelWidth === "auto" ? l.marginLeft = v.value : d.labelWidth === "auto" && (l.marginLeft = d.autoLabelWidth) : l.marginLeft = e, l;
  }), C = computed(() => {
    const e = d.model;
    if (!e || !t.prop)
      return;
    let l = t.prop;
    return l.indexOf(":") !== -1 && (l = l.replace(/:/, ".")), $e(e, l, true).v;
  }), x = computed(() => {
    let e = I(), t2 = false;
    return e && e.length && e.every((e2) => !e2.required || (t2 = true, false)), t2;
  }), M = computed(() => t.size || d.size), T = computed(() => M.value || u.size), N = (e, l = ke) => {
    h2.value = false;
    const a = P(e);
    if ((!a || a.length === 0) && t.required === void 0)
      return void l();
    c.value = "validating";
    const n = {};
    a && a.length > 0 && a.forEach((e2) => {
      delete e2.trigger;
    }), n[t.prop] = a;
    const o = new Schema(n), i = {};
    i[t.prop] = C.value, o.validate(i, {firstFields: true}, (e2, a2) => {
      var n2;
      c.value = e2 ? "error" : "success", p2.value = e2 ? e2[0].message : "", l(p2.value, a2), (n2 = d.emit) === null || n2 === void 0 || n2.call(d, "validate", t.prop, !e2, p2.value || null);
    });
  }, D = () => {
    c.value = "", p2.value = "", h2.value = false;
  }, O = () => {
    c.value = "", p2.value = "";
    let e = d.model, l = C.value, a = t.prop;
    a.indexOf(":") !== -1 && (a = a.replace(/:/, "."));
    let n = $e(e, a, true);
    h2.value = true, Array.isArray(l) ? n.o[n.k] = [].concat(g) : n.o[n.k] = g, nextTick(() => {
      h2.value = false;
    });
  }, I = () => {
    const e = d.rules, l = t.rules, a = t.required !== void 0 ? {required: !!t.required} : [], n = $e(e, t.prop || "", false), o = e ? n.o[t.prop || ""] || n.v : [];
    return [].concat(l || o || []).concat(a);
  }, P = (e) => I().filter((t2) => !t2.trigger || e === "" || (Array.isArray(t2.trigger) ? t2.trigger.indexOf(e) > -1 : t2.trigger === e)).map((e2) => Object.assign({}, e2)), V = () => {
    N("blur");
  }, B = () => {
    h2.value ? h2.value = false : N("change");
  }, A = () => {
    (I().length || t.required !== void 0) && (s.on("el.form.blur", V), s.on("el.form.change", B));
  }, L = reactive(Object.assign(Object.assign({}, toRefs(t)), {size: T, validateState: c, removeValidateEvents: () => {
    s.off("el.form.blur", V), s.off("el.form.change", B);
  }, addValidateEvents: A, resetField: O, clearValidate: D, validate: N, formItemMitt: s, updateComputedLabelWidth: (e) => {
    v.value = e ? e + "px" : "";
  }}));
  onMounted(() => {
    var e;
    if (t.prop) {
      (e = d.formMitt) === null || e === void 0 || e.emit(Zt, L);
      let t2 = C.value;
      g = Array.isArray(t2) ? [...t2] : t2, A();
    }
  }), onBeforeUnmount(() => {
    var e;
    (e = d.formMitt) === null || e === void 0 || e.emit(Qt, L);
  }), provide("elFormItem", L);
  return {formItemClass: computed(() => [{"el-form-item--feedback": d.statusIcon, "is-error": c.value === "error", "is-validating": c.value === "validating", "is-success": c.value === "success", "is-required": x.value || t.required, "is-no-asterisk": d.hideRequiredAsterisk}, T.value ? "el-form-item--" + T.value : ""]), shouldShowError: computed(() => c.value === "error" && t.showMessage && d.showMessage), elForm: d, labelStyle: y, contentStyle: k, validateMessage: p2, labelFor: b, resetField: O, clearValidate: D};
}});
Qr.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("LabelWrap");
  return openBlock(), createBlock("div", {class: ["el-form-item", e.formItemClass]}, [createVNode(i, {"is-auto-width": e.labelStyle.width === "auto", "update-all": e.elForm.labelWidth === "auto"}, {default: withCtx(() => [e.label || e.$slots.label ? (openBlock(), createBlock("label", {key: 0, for: e.labelFor, class: "el-form-item__label", style: e.labelStyle}, [renderSlot(e.$slots, "label", {}, () => [createTextVNode(toDisplayString(e.label + e.elForm.labelSuffix), 1)])], 12, ["for"])) : createCommentVNode("v-if", true)]), _: 3}, 8, ["is-auto-width", "update-all"]), createVNode("div", {class: "el-form-item__content", style: e.contentStyle}, [renderSlot(e.$slots, "default"), createVNode(Transition, {name: "el-zoom-in-top"}, {default: withCtx(() => [e.shouldShowError ? renderSlot(e.$slots, "error", {key: 0, error: e.validateMessage}, () => [createVNode("div", {class: ["el-form-item__error", {"el-form-item__error--inline": typeof e.inlineMessage == "boolean" ? e.inlineMessage : e.elForm.inlineMessage || false}]}, toDisplayString(e.validateMessage), 3)]) : createCommentVNode("v-if", true)]), _: 3})], 4)], 2);
}, Qr.__file = "packages/form/src/form-item.vue", Qr.install = (e) => {
  e.component(Qr.name, Qr);
};
const Jr = Qr;
var es = defineComponent({name: "ElHeader", props: {height: {type: String, default: "60px"}}});
es.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("header", {class: "el-header", style: {height: e.height}}, [renderSlot(e.$slots, "default")], 4);
}, es.__file = "packages/container/src/header.vue", es.install = (e) => {
  e.component(es.name, es);
};
const ts = es;
var ls = defineComponent({name: "ElIcon", props: {name: {type: String, default: ""}}});
ls.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("i", {class: "el-icon-" + e.name}, null, 2);
}, ls.__file = "packages/icon/src/index.vue", ls.install = (e) => {
  e.component(ls.name, ls);
};
const as = ls, ns = {CONTAIN: {name: "contain", icon: "el-icon-full-screen"}, ORIGINAL: {name: "original", icon: "el-icon-c-scale-to-original"}}, os = !ye && window.navigator.userAgent.match(/firefox/i) ? "DOMMouseScroll" : "mousewheel";
var is = defineComponent({name: "ElImageViewer", props: {urlList: {type: Array, default: []}, zIndex: {type: Number, default: 2e3}, initialIndex: {type: Number, default: 0}, infinite: {type: Boolean, default: true}, hideOnClickModal: {type: Boolean, default: false}}, emits: ["close", "switch"], setup(e, {emit: t}) {
  let a = null, r = null, s = null;
  const u = ref(true), d = ref(e.initialIndex), c = ref(null), p2 = ref(null), h2 = ref(ns.CONTAIN);
  let v = ref({scale: 1, deg: 0, offsetX: 0, offsetY: 0, enableTransition: false});
  const m = computed(() => {
    const {urlList: t2} = e;
    return t2.length <= 1;
  }), f = computed(() => d.value === 0), g = computed(() => d.value === 0), b = computed(() => e.urlList[d.value]), y = computed(() => {
    const {scale: e2, deg: t2, offsetX: l, offsetY: a2, enableTransition: n} = v.value, o = {transform: `scale(${e2}) rotate(${t2}deg)`, transition: n ? "transform .3s" : "", marginLeft: l + "px", marginTop: a2 + "px"};
    return h2.value.name === ns.CONTAIN.name && (o.maxWidth = o.maxHeight = "100%"), o;
  });
  function k() {
    lt(document, "keydown", a), lt(document, os, r), a = null, r = null, t("close");
  }
  function C() {
    v.value = {scale: 1, deg: 0, offsetX: 0, offsetY: 0, enableTransition: false};
  }
  function x() {
    if (u.value)
      return;
    const e2 = Object.keys(ns), t2 = Object.values(ns), l = h2.value.name, a2 = (t2.findIndex((e3) => e3.name === l) + 1) % e2.length;
    h2.value = ns[e2[a2]], C();
  }
  function _() {
    if (f.value && !e.infinite)
      return;
    const t2 = e.urlList.length;
    d.value = (d.value - 1 + t2) % t2;
  }
  function S() {
    if (g.value && !e.infinite)
      return;
    const t2 = e.urlList.length;
    d.value = (d.value + 1) % t2;
  }
  function E(e2, t2 = {}) {
    if (u.value)
      return;
    const {zoomRate: l, rotateDeg: a2, enableTransition: n} = Object.assign({zoomRate: 0.2, rotateDeg: 90, enableTransition: true}, t2);
    switch (e2) {
      case "zoomOut":
        v.value.scale > 0.2 && (v.value.scale = parseFloat((v.value.scale - l).toFixed(3)));
        break;
      case "zoomIn":
        v.value.scale = parseFloat((v.value.scale + l).toFixed(3));
        break;
      case "clocelise":
        v.value.deg += a2;
        break;
      case "anticlocelise":
        v.value.deg -= a2;
    }
    v.value.enableTransition = n;
  }
  return watch(b, () => {
    nextTick(() => {
      p2.value.complete || (u.value = true);
    });
  }), watch(d, (e2) => {
    C(), t("switch", e2);
  }), onMounted(() => {
    var e2, t2;
    a = Ke((e3) => {
      switch (e3.code) {
        case Dt.esc:
          k();
          break;
        case Dt.space:
          x();
          break;
        case Dt.left:
          _();
          break;
        case Dt.up:
          E("zoomIn");
          break;
        case Dt.right:
          S();
          break;
        case Dt.down:
          E("zoomOut");
      }
    }), r = Ke((e3) => {
      E((e3.wheelDelta ? e3.wheelDelta : -e3.detail) > 0 ? "zoomIn" : "zoomOut", {zoomRate: 0.015, enableTransition: false});
    }), tt(document, "keydown", a), tt(document, os, r), (t2 = (e2 = c.value) === null || e2 === void 0 ? void 0 : e2.focus) === null || t2 === void 0 || t2.call(e2);
  }), {index: d, wrapper: c, img: p2, isSingle: m, isFirst: f, isLast: g, currentImg: b, imgStyle: y, mode: h2, handleActions: E, prev: _, next: S, hide: k, toggleMode: x, handleImgLoad: function() {
    u.value = false;
  }, handleImgError: function(e2) {
    u.value = false, e2.target.alt = ya("el.image.error");
  }, handleMouseDown: function(e2) {
    if (u.value || e2.button !== 0)
      return;
    const {offsetX: t2, offsetY: l} = v.value, a2 = e2.pageX, n = e2.pageY;
    s = Ke((e3) => {
      v.value = Object.assign(Object.assign({}, v.value), {offsetX: t2 + e3.pageX - a2, offsetY: l + e3.pageY - n});
    }), tt(document, "mousemove", s), tt(document, "mouseup", () => {
      lt(document, "mousemove", s);
    }), e2.preventDefault();
  }};
}});
const rs = createVNode("i", {class: "el-icon-close"}, null, -1), ss = createVNode("i", {class: "el-icon-arrow-left"}, null, -1), us = createVNode("i", {class: "el-icon-arrow-right"}, null, -1), ds = {class: "el-image-viewer__btn el-image-viewer__actions"}, cs = {class: "el-image-viewer__actions__inner"}, ps = createVNode("i", {class: "el-image-viewer__actions__divider"}, null, -1), hs = createVNode("i", {class: "el-image-viewer__actions__divider"}, null, -1), vs = {class: "el-image-viewer__canvas"};
is.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "viewer-fade"}, {default: withCtx(() => [createVNode("div", {ref: "wrapper", tabindex: -1, class: "el-image-viewer__wrapper", style: {zIndex: e.zIndex}}, [createVNode("div", {class: "el-image-viewer__mask", onClick: t[1] || (t[1] = withModifiers((t2) => e.hideOnClickModal && e.hide(), ["self"]))}), createCommentVNode(" CLOSE "), createVNode("span", {class: "el-image-viewer__btn el-image-viewer__close", onClick: t[2] || (t[2] = (...t2) => e.hide && e.hide(...t2))}, [rs]), createCommentVNode(" ARROW "), e.isSingle ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Fragment, {key: 0}, [createVNode("span", {class: ["el-image-viewer__btn el-image-viewer__prev", {"is-disabled": !e.infinite && e.isFirst}], onClick: t[3] || (t[3] = (...t2) => e.prev && e.prev(...t2))}, [ss], 2), createVNode("span", {class: ["el-image-viewer__btn el-image-viewer__next", {"is-disabled": !e.infinite && e.isLast}], onClick: t[4] || (t[4] = (...t2) => e.next && e.next(...t2))}, [us], 2)], 64)), createCommentVNode(" ACTIONS "), createVNode("div", ds, [createVNode("div", cs, [createVNode("i", {class: "el-icon-zoom-out", onClick: t[5] || (t[5] = (t2) => e.handleActions("zoomOut"))}), createVNode("i", {class: "el-icon-zoom-in", onClick: t[6] || (t[6] = (t2) => e.handleActions("zoomIn"))}), ps, createVNode("i", {class: e.mode.icon, onClick: t[7] || (t[7] = (...t2) => e.toggleMode && e.toggleMode(...t2))}, null, 2), hs, createVNode("i", {class: "el-icon-refresh-left", onClick: t[8] || (t[8] = (t2) => e.handleActions("anticlocelise"))}), createVNode("i", {class: "el-icon-refresh-right", onClick: t[9] || (t[9] = (t2) => e.handleActions("clocelise"))})])]), createCommentVNode(" CANVAS "), createVNode("div", vs, [(openBlock(true), createBlock(Fragment, null, renderList(e.urlList, (l2, a2) => withDirectives((openBlock(), createBlock("img", {ref: "img", key: l2, src: l2, style: e.imgStyle, class: "el-image-viewer__img", onLoad: t[10] || (t[10] = (...t2) => e.handleImgLoad && e.handleImgLoad(...t2)), onError: t[11] || (t[11] = (...t2) => e.handleImgError && e.handleImgError(...t2)), onMousedown: t[12] || (t[12] = (...t2) => e.handleMouseDown && e.handleMouseDown(...t2))}, null, 44, ["src"])), [[vShow, a2 === e.index]])), 128))])], 4)]), _: 1});
}, is.__file = "packages/image-viewer/src/index.vue", is.install = (e) => {
  e.component(Image.name, Image);
};
const ms = is, fs = () => document.documentElement.style.objectFit !== void 0, gs = "none", bs = "contain", ys = "cover", ks = "fill", Cs = "scale-down";
let xs = "";
var ws = defineComponent({name: "ElImage", components: {ImageViewer: ms}, inheritAttrs: false, props: {appendToBody: {type: Boolean, default: false}, hideOnClickModal: {type: Boolean, default: false}, src: {type: String, default: ""}, fit: {type: String, default: ""}, lazy: {type: Boolean, default: false}, scrollContainer: {type: [String, Object], default: null}, previewSrcList: {type: Array, default: () => []}, zIndex: {type: Number, default: 2e3}}, emits: ["error"], setup(e, {emit: t}) {
  const a = St(), s = ref(false), u = ref(true), d = ref(0), c = ref(0), p2 = ref(false), h2 = ref(null);
  let v = null, m = null;
  const f = computed(() => {
    const {fit: t2} = e;
    return !ye && t2 ? fs() ? {"object-fit": t2} : function(e2) {
      const t3 = d.value, l = c.value;
      if (!h2.value)
        return {};
      const {clientWidth: a2, clientHeight: n} = h2.value;
      if (!(t3 && l && a2 && n))
        return {};
      const o = t3 / l, i = a2 / n;
      if (e2 === Cs) {
        e2 = t3 < a2 && l < n ? gs : bs;
      }
      switch (e2) {
        case gs:
          return {width: "auto", height: "auto"};
        case bs:
          return o < i ? {width: "auto"} : {height: "auto"};
        case ys:
          return o < i ? {height: "auto"} : {width: "auto"};
        default:
          return {};
      }
    }(t2) : {};
  }), g = computed(() => {
    const {fit: t2} = e;
    return !ye && !fs() && t2 !== ks;
  }), b = computed(() => {
    const {previewSrcList: t2} = e;
    return Array.isArray(t2) && t2.length > 0;
  }), y = computed(() => {
    const {src: t2, previewSrcList: l} = e;
    let a2 = 0;
    const n = l.indexOf(t2);
    return n >= 0 && (a2 = n), a2;
  });
  const k = () => {
    if (ye)
      return;
    const t2 = a.value;
    u.value = true, s.value = false;
    const l = new Image();
    l.onload = (e2) => function(e3, t3) {
      d.value = t3.width, c.value = t3.height, u.value = false, s.value = false;
    }(0, l), l.onerror = C, Object.keys(t2).forEach((e2) => {
      if (e2.toLowerCase() === "onload")
        return;
      const a2 = t2[e2];
      l.setAttribute(e2, a2);
    }), l.src = e.src;
  };
  function C(e2) {
    u.value = false, s.value = true, t("error", e2);
  }
  function x() {
    ((e2, t2) => {
      if (ye || !e2 || !t2)
        return false;
      const l = e2.getBoundingClientRect();
      let a2;
      return a2 = [window, document, document.documentElement, null, void 0].includes(t2) ? {top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0} : t2.getBoundingClientRect(), l.top < a2.bottom && l.bottom > a2.top && l.right > a2.left && l.left < a2.right;
    })(h2.value, v) && (k(), S());
  }
  function _() {
    if (ye)
      return;
    const {scrollContainer: t2} = e;
    var l;
    v = (l = t2) && l.nodeType === 1 ? t2 : Ee(t2) && t2 !== "" ? document.querySelector(t2) : st(h2.value), v && (m = throttle_1(x, 200), tt(v, "scroll", m), setTimeout(() => x(), 100));
  }
  function S() {
    !ye && v && m && (lt(v, "scroll", m), v = null, m = null);
  }
  return watch(() => e.src, () => {
    k();
  }), onMounted(() => {
    e.lazy ? nextTick(_) : k();
  }), onBeforeUnmount(() => {
    e.lazy && S();
  }), {attrs: a, loading: u, hasLoadError: s, showViewer: p2, imgWidth: d, imgHeight: c, imageStyle: f, alignCenter: g, preview: b, imageIndex: y, clickHandler: function() {
    b.value && (xs = document.body.style.overflow, document.body.style.overflow = "hidden", p2.value = true);
  }, closeViewer: function() {
    document.body.style.overflow = xs, p2.value = false;
  }, container: h2, handleError: C, t: ya};
}});
const _s = createVNode("div", {class: "el-image__placeholder"}, null, -1), Ss = {class: "el-image__error"};
ws.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("image-viewer");
  return openBlock(), createBlock("div", {ref: "container", class: ["el-image", e.$attrs.class], style: e.$attrs.style}, [e.loading ? renderSlot(e.$slots, "placeholder", {key: 0}, () => [_s]) : e.hasLoadError ? renderSlot(e.$slots, "error", {key: 1}, () => [createVNode("div", Ss, toDisplayString(e.t("el.image.error")), 1)]) : (openBlock(), createBlock("img", mergeProps({key: 2, class: "el-image__inner"}, e.attrs, {src: e.src, style: e.imageStyle, class: {"el-image__inner--center": e.alignCenter, "el-image__preview": e.preview}, onClick: t[1] || (t[1] = (...t2) => e.clickHandler && e.clickHandler(...t2))}), null, 16, ["src"])), (openBlock(), createBlock(Teleport, {to: "body", disabled: !e.appendToBody}, [e.preview ? (openBlock(), createBlock(Fragment, {key: 0}, [e.showViewer ? (openBlock(), createBlock(i, {key: 0, "z-index": e.zIndex, "initial-index": e.imageIndex, "url-list": e.previewSrcList, "hide-on-click-modal": e.hideOnClickModal, onClose: e.closeViewer}, null, 8, ["z-index", "initial-index", "url-list", "hide-on-click-modal", "onClose"])) : createCommentVNode("v-if", true)], 2112)) : createCommentVNode("v-if", true)], 8, ["disabled"]))], 6);
}, ws.__file = "packages/image/src/index.vue", ws.install = (e) => {
  e.component(ws.name, ws);
};
const Es = ws;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function Ms(e, t, l, a) {
  return new (l || (l = Promise))(function(n, o) {
    function i(e2) {
      try {
        s(a.next(e2));
      } catch (e3) {
        o(e3);
      }
    }
    function r(e2) {
      try {
        s(a.throw(e2));
      } catch (e3) {
        o(e3);
      }
    }
    function s(e2) {
      var t2;
      e2.done ? n(e2.value) : (t2 = e2.value, t2 instanceof l ? t2 : new l(function(e3) {
        e3(t2);
      })).then(i, r);
    }
    s((a = a.apply(e, t || [])).next());
  });
}
const Ts = "ElInfiniteScroll", Ns = {delay: {type: Number, default: 200}, distance: {type: Number, default: 0}, disabled: {type: Boolean, default: false}, immediate: {type: Boolean, default: true}}, Ds = (e, t) => qe(Ns).reduce((l, [a, n]) => {
  var o, i;
  const {type: r, default: s} = n, u = e.getAttribute("infinite-scroll-" + a);
  let d = (i = (o = t[u]) !== null && o !== void 0 ? o : u) !== null && i !== void 0 ? i : s;
  return d = d !== "false" && d, d = r(d), l[a] = Number.isNaN(d) ? s : d, l;
}, {}), Os = (e) => {
  const {observer: t} = e[Ts];
  t && (t.disconnect(), delete e[Ts].observer);
}, Is = (e, t) => {
  const {container: l, containerEl: a, instance: n, observer: o, lastScrollTop: i} = e[Ts], {disabled: r, distance: s} = Ds(e, n), {clientHeight: u, scrollHeight: d, scrollTop: c} = a, p2 = c - i;
  if (e[Ts].lastScrollTop = c, o || r || p2 < 0)
    return;
  let h2 = false;
  if (l === e)
    h2 = d - (u + c) <= s;
  else {
    const {clientTop: t2, scrollHeight: l2} = e;
    h2 = c + u >= ((e2, t3) => Math.abs(ut(e2) - ut(t3)))(e, a) + t2 + l2 - s;
  }
  h2 && t.call(n);
};
function Ps(e, t) {
  const {containerEl: l, instance: a} = e[Ts], {disabled: n} = Ds(e, a);
  n || (l.scrollHeight <= l.clientHeight ? t.call(a) : Os(e));
}
const Vs = {mounted(e, t) {
  return Ms(this, void 0, void 0, function* () {
    const {instance: l, value: a} = t;
    Se(a) || Le(Ts, "'v-infinite-scroll' binding value must be a function"), yield nextTick();
    const {delay: n, immediate: o} = Ds(e, l), i = st(e, true), r = i === window ? document.documentElement : i, s = throttle_1(Is.bind(null, e, a), n);
    if (i) {
      if (e[Ts] = {instance: l, container: i, containerEl: r, delay: n, cb: a, onScroll: s, lastScrollTop: r.scrollTop}, o) {
        const t2 = new MutationObserver(throttle_1(Ps.bind(null, e, a), 50));
        e[Ts].observer = t2, t2.observe(e, {childList: true, subtree: true}), Ps(e, a);
      }
      i.addEventListener("scroll", s);
    }
  });
}, unmounted(e) {
  const {container: t, onScroll: l} = e[Ts];
  t == null || t.removeEventListener("scroll", l), Os(e);
}, install: (e) => {
  e.directive("InfiniteScroll", Vs);
}};
var Bs = defineComponent({name: "ElInputNumber", components: {ElInput: vl}, directives: {RepeatClick: Rt}, props: {step: {type: Number, default: 1}, stepStrictly: {type: Boolean, default: false}, max: {type: Number, default: 1 / 0}, min: {type: Number, default: -1 / 0}, modelValue: {required: true, validator: (e) => Oe(e) === "Number" || e === void 0}, disabled: {type: Boolean, default: false}, size: {type: String, validator: Xt}, controls: {type: Boolean, default: true}, controlsPosition: {type: String, default: ""}, name: String, label: String, placeholder: String, precision: {type: Number, validator: (e) => e >= 0 && e === parseInt(e + "", 10)}}, emits: ["update:modelValue", "change", "input", "blur", "focus"], setup(e, {emit: t}) {
  const r = Ue(), s = inject("elForm", {}), u = inject("elFormItem", {}), d = ref(null), c = reactive({currentValue: e.modelValue, userInput: null}), p2 = computed(() => x(e.modelValue) < e.min), h2 = computed(() => C(e.modelValue) > e.max), v = computed(() => {
    const t2 = k(e.step);
    return e.precision !== void 0 ? (t2 > e.precision && console.warn("[Element Warn][InputNumber]precision should not be less than the decimal places of step"), e.precision) : Math.max(k(e.modelValue), t2);
  }), m = computed(() => e.controls && e.controlsPosition === "right"), f = computed(() => e.size || u.size || r.size), g = computed(() => e.disabled || s.disabled), b = computed(() => {
    if (c.userInput !== null)
      return c.userInput;
    let t2 = c.currentValue;
    return typeof t2 == "number" && e.precision !== void 0 && (t2 = t2.toFixed(e.precision)), t2;
  }), y = (e2, t2) => (t2 === void 0 && (t2 = v.value), parseFloat(Math.round(e2 * Math.pow(10, t2)) / Math.pow(10, t2) + "")), k = (e2) => {
    if (e2 === void 0)
      return 0;
    const t2 = e2.toString(), l = t2.indexOf(".");
    let a = 0;
    return l !== -1 && (a = t2.length - l - 1), a;
  }, C = (t2) => {
    if (typeof t2 != "number" && t2 !== void 0)
      return c.currentValue;
    const l = Math.pow(10, v.value);
    return y((l * t2 + l * e.step) / l);
  }, x = (t2) => {
    if (typeof t2 != "number" && t2 !== void 0)
      return c.currentValue;
    const l = Math.pow(10, v.value);
    return y((l * t2 - l * e.step) / l);
  }, w = (l) => {
    const a = c.currentValue;
    typeof l == "number" && e.precision !== void 0 && (l = y(l, e.precision)), l !== void 0 && l >= e.max && (l = e.max), l !== void 0 && l <= e.min && (l = e.min), a !== l && (c.userInput = null, t("update:modelValue", l), t("input", l), t("change", l, a), c.currentValue = l);
  };
  return watch(() => e.modelValue, (l) => {
    let a = l === void 0 ? l : Number(l);
    if (a !== void 0) {
      if (isNaN(a))
        return;
      if (e.stepStrictly) {
        const t2 = k(e.step), l2 = Math.pow(10, t2);
        a = Math.round(a / e.step) * l2 * e.step / l2;
      }
      e.precision !== void 0 && (a = y(a, e.precision));
    }
    a !== void 0 && a >= e.max && (a = e.max, t("update:modelValue", a)), a !== void 0 && a <= e.min && (a = e.min, t("update:modelValue", a)), c.currentValue = a, c.userInput = null;
  }, {immediate: true}), onMounted(() => {
    let l = d.value.input;
    l.setAttribute("role", "spinbutton"), l.setAttribute("aria-valuemax", e.max), l.setAttribute("aria-valuemin", e.min), l.setAttribute("aria-valuenow", c.currentValue), l.setAttribute("aria-disabled", g.value), Oe(e.modelValue) !== "Number" && e.modelValue !== void 0 && t("update:modelValue", void 0);
  }), onUpdated(() => {
    d.value.input.setAttribute("aria-valuenow", c.currentValue);
  }), {input: d, displayValue: b, handleInput: (e2) => c.userInput = e2, handleInputChange: (e2) => {
    const t2 = e2 === "" ? void 0 : Number(e2);
    isNaN(t2) && e2 !== "" || w(t2), c.userInput = null;
  }, controlsAtRight: m, decrease: () => {
    if (g.value || p2.value)
      return;
    const t2 = e.modelValue || 0, l = x(t2);
    w(l);
  }, increase: () => {
    if (g.value || h2.value)
      return;
    const t2 = e.modelValue || 0, l = C(t2);
    w(l);
  }, inputNumberSize: f, inputNumberDisabled: g, maxDisabled: h2, minDisabled: p2};
}});
Bs.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveDirective("repeat-click");
  return openBlock(), createBlock("div", {class: ["el-input-number", e.inputNumberSize ? "el-input-number--" + e.inputNumberSize : "", {"is-disabled": e.inputNumberDisabled}, {"is-without-controls": !e.controls}, {"is-controls-right": e.controlsAtRight}], onDragstart: t[5] || (t[5] = withModifiers(() => {
  }, ["prevent"]))}, [e.controls ? withDirectives((openBlock(), createBlock("span", {key: 0, class: ["el-input-number__decrease", {"is-disabled": e.minDisabled}], role: "button", onKeydown: t[1] || (t[1] = withKeys((...t2) => e.decrease && e.decrease(...t2), ["enter"]))}, [createVNode("i", {class: "el-icon-" + (e.controlsAtRight ? "arrow-down" : "minus")}, null, 2)], 34)), [[r, e.decrease]]) : createCommentVNode("v-if", true), e.controls ? withDirectives((openBlock(), createBlock("span", {key: 1, class: ["el-input-number__increase", {"is-disabled": e.maxDisabled}], role: "button", onKeydown: t[2] || (t[2] = withKeys((...t2) => e.increase && e.increase(...t2), ["enter"]))}, [createVNode("i", {class: "el-icon-" + (e.controlsAtRight ? "arrow-up" : "plus")}, null, 2)], 34)), [[r, e.increase]]) : createCommentVNode("v-if", true), createVNode(i, {ref: "input", "model-value": e.displayValue, placeholder: e.placeholder, disabled: e.inputNumberDisabled, size: e.inputNumberSize, max: e.max, min: e.min, name: e.name, label: e.label, onKeydown: [withKeys(withModifiers(e.increase, ["prevent"]), ["up"]), withKeys(withModifiers(e.decrease, ["prevent"]), ["down"])], onBlur: t[3] || (t[3] = (t2) => e.$emit("blur", t2)), onFocus: t[4] || (t[4] = (t2) => e.$emit("focus", t2)), onInput: e.handleInput, onChange: e.handleInputChange}, null, 8, ["model-value", "placeholder", "disabled", "size", "max", "min", "name", "label", "onKeydown", "onInput", "onChange"])], 34);
}, Bs.__file = "packages/input-number/src/index.vue", Bs.install = (e) => {
  e.component(Bs.name, Bs);
};
const As = Bs;
var Ls = defineComponent({name: "ElLink", props: {type: {type: String, default: "default", validator: (e) => ["default", "primary", "success", "warning", "info", "danger"].includes(e)}, underline: {type: Boolean, default: true}, disabled: {type: Boolean, default: false}, href: {type: String, default: ""}, icon: {type: String, default: ""}}, emits: ["click"], setup: (e, {emit: t}) => ({handleClick: function(l) {
  e.disabled || t("click", l);
}})});
const zs = {key: 1, class: "el-link--inner"};
Ls.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("a", {class: ["el-link", e.type ? "el-link--" + e.type : "", e.disabled && "is-disabled", e.underline && !e.disabled && "is-underline"], href: e.disabled ? null : e.href, onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, [e.icon ? (openBlock(), createBlock("i", {key: 0, class: e.icon}, null, 2)) : createCommentVNode("v-if", true), e.$slots.default ? (openBlock(), createBlock("span", zs, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true), e.$slots.icon ? renderSlot(e.$slots, "icon", {key: 2}) : createCommentVNode("v-if", true)], 10, ["href"]);
}, Ls.__file = "packages/link/src/index.vue", Ls.install = (e) => {
  e.component(Ls.name, Ls);
};
const Fs = Ls;
const $s = {parent: null, background: "", spinner: false, text: null, fullscreen: true, body: false, lock: false, customClass: ""}, Rs = {fullscreenLoading: null}, Hs = (e, t, l) => {
  l.originalPosition.value !== "absolute" && l.originalPosition.value !== "fixed" ? nt(t, "el-loading-parent--relative") : ot(t, "el-loading-parent--relative"), e.fullscreen && e.lock ? nt(t, "el-loading-parent--hidden") : ot(t, "el-loading-parent--hidden");
}, Ws = function(e = {}) {
  if (ye)
    return;
  typeof (e = Object.assign(Object.assign({}, $s), e)).target == "string" && (e.target = document.querySelector(e.target)), e.target = e.target || document.body, e.target !== document.body ? e.fullscreen = false : e.body = true, e.fullscreen && Rs.fullscreenLoading && Rs.fullscreenLoading.close();
  const t = e.body ? document.body : e.target;
  e.parent = t;
  const n = function({options: e2, globalLoadingOption: t2}) {
    let n2 = null, o2 = null;
    const i = ref(false), r = reactive(Object.assign(Object.assign({}, e2), {originalPosition: "", originalOverflow: "", visible: false}));
    function s() {
      const e3 = r.parent;
      if (!e3.vLoadingAddClassList) {
        let t3 = e3.getAttribute("loading-number");
        t3 = Number.parseInt(t3) - 1, t3 ? e3.setAttribute("loading-number", t3.toString()) : (ot(e3, "el-loading-parent--relative"), e3.removeAttribute("loading-number")), ot(e3, "el-loading-parent--hidden");
      }
      n2.el && n2.el.parentNode && n2.el.parentNode.removeChild(n2.el);
    }
    const u = Object.assign(Object.assign({}, toRefs(r)), {setText: function(e3) {
      r.text = e3;
    }, close: function() {
      r.parent.vLoadingAddClassList = null, r.fullscreen && (t2.fullscreenLoading = void 0), i.value = true, clearTimeout(o2), o2 = window.setTimeout(() => {
        i.value && (i.value = false, s());
      }, 400), r.visible = false;
    }, handleAfterLeave: function() {
      i.value && (i.value = false, s());
    }}), c = {name: "ElLoading", setup: () => u, render() {
      const e3 = h("svg", {class: "circular", viewBox: "25 25 50 50"}, [h("circle", {class: "path", cx: "50", cy: "50", r: "20", fill: "none"})]), t3 = h("i", {class: this.spinner}), l = h("p", {class: "el-loading-text"}, [this.text]);
      return h(Transition, {name: "el-loading-fade", onAfterLeave: this.handleAfterLeave}, {default: withCtx(() => [withDirectives(createVNode("div", {style: {backgroundColor: this.background || ""}, class: ["el-loading-mask", this.customClass, this.fullscreen ? "is-fullscreen" : ""]}, [h("div", {class: "el-loading-spinner"}, [this.spinner ? t3 : e3, this.text ? l : null])]), [[vShow, this.visible]])])});
    }};
    return n2 = createVNode(c), render(n2, document.createElement("div")), Object.assign(Object.assign({}, u), {vm: n2, get $el() {
      return n2.el;
    }});
  }({options: e, globalLoadingOption: Rs});
  ((e2, t2, l) => {
    Ms(void 0, void 0, void 0, function* () {
      const a = {};
      e2.fullscreen ? (l.originalPosition.value = it(document.body, "position"), l.originalOverflow.value = it(document.body, "overflow"), a.zIndex = String(Pl.nextZIndex())) : e2.body ? (l.originalPosition.value = it(document.body, "position"), yield nextTick(), ["top", "left"].forEach((t3) => {
        const l2 = t3 === "top" ? "scrollTop" : "scrollLeft";
        a[t3] = e2.target.getBoundingClientRect()[t3] + document.body[l2] + document.documentElement[l2] - parseInt(it(document.body, "margin-" + t3), 10) + "px";
      }), ["height", "width"].forEach((t3) => {
        a[t3] = e2.target.getBoundingClientRect()[t3] + "px";
      })) : l.originalPosition.value = it(t2, "position"), Object.keys(a).forEach((e3) => {
        l.$el.style[e3] = a[e3];
      });
    });
  })(e, t, n), Hs(e, t, n), e.parent.vLoadingAddClassList = () => {
    Hs(e, t, n);
  };
  let o = t.getAttribute("loading-number");
  return o = o ? Number.parseInt(o) + 1 : 1, t.setAttribute("loading-number", o.toString()), t.appendChild(n.$el), nextTick().then(() => {
    n.visible.value = !we(e, "visible") || e.visible;
  }), e.fullscreen && (Rs.fullscreenLoading = n), n;
}, js = (e, t) => {
  const l = e.getAttribute("element-loading-text"), a = e.getAttribute("element-loading-spinner"), n = e.getAttribute("element-loading-background"), o = e.getAttribute("element-loading-custom-class"), i = t.instance;
  e.instance = Ws({text: i && i[l] || l, spinner: i && i[a] || a, background: i && i[n] || n, customClass: i && i[o] || o, fullscreen: !!t.modifiers.fullscreen, target: t.modifiers.fullscreen ? null : e, body: !!t.modifiers.body, visible: true, lock: !!t.modifiers.lock});
}, Ks = {mounted(e, t) {
  t.value && js(e, t);
}, updated(e, t) {
  const l = e.instance;
  t.oldValue !== t.value && (t.value ? js(e, t) : l.close());
}, unmounted(e) {
  var t;
  (t = e == null ? void 0 : e.instance) === null || t === void 0 || t.close();
}};
var Ys = {install(e) {
  e.directive("loading", Ks), e.config.globalProperties.$loading = Ws;
}, directive: Ks, service: Ws}, qs = defineComponent({name: "ElMain"});
const Us = {class: "el-main"};
qs.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("main", Us, [renderSlot(e.$slots, "default")]);
}, qs.__file = "packages/container/src/main.vue", qs.install = (e) => {
  e.component(qs.name, qs);
};
const Gs = qs;
class Xs {
  constructor(e, t) {
    this.parent = e, this.domNode = t, this.subIndex = 0, this.subIndex = 0, this.init();
  }
  init() {
    this.subMenuItems = this.domNode.querySelectorAll("li"), this.addListeners();
  }
  gotoSubIndex(e) {
    e === this.subMenuItems.length ? e = 0 : e < 0 && (e = this.subMenuItems.length - 1), this.subMenuItems[e].focus(), this.subIndex = e;
  }
  addListeners() {
    const e = this.parent.domNode;
    Array.prototype.forEach.call(this.subMenuItems, (t) => {
      t.addEventListener("keydown", (t2) => {
        let l = false;
        switch (t2.code) {
          case Dt.down:
            this.gotoSubIndex(this.subIndex + 1), l = true;
            break;
          case Dt.up:
            this.gotoSubIndex(this.subIndex - 1), l = true;
            break;
          case Dt.tab:
            Vt(e, "mouseleave");
            break;
          case Dt.enter:
          case Dt.space:
            l = true, t2.currentTarget.click();
        }
        return l && (t2.preventDefault(), t2.stopPropagation()), false;
      });
    });
  }
}
class Zs {
  constructor(e) {
    this.domNode = e, this.submenu = null, this.submenu = null, this.init();
  }
  init() {
    this.domNode.setAttribute("tabindex", "0");
    const e = this.domNode.querySelector(".el-menu");
    e && (this.submenu = new Xs(this, e)), this.addListeners();
  }
  addListeners() {
    this.domNode.addEventListener("keydown", (e) => {
      let t = false;
      switch (e.code) {
        case Dt.down:
          Vt(e.currentTarget, "mouseenter"), this.submenu && this.submenu.gotoSubIndex(0), t = true;
          break;
        case Dt.up:
          Vt(e.currentTarget, "mouseenter"), this.submenu && this.submenu.gotoSubIndex(this.submenu.subMenuItems.length - 1), t = true;
          break;
        case Dt.tab:
          Vt(e.currentTarget, "mouseleave");
          break;
        case Dt.enter:
        case Dt.space:
          t = true, e.currentTarget.click();
      }
      t && e.preventDefault();
    });
  }
}
class Qs {
  constructor(e) {
    this.domNode = e, this.init();
  }
  init() {
    const e = this.domNode.childNodes;
    [].filter.call(e, (e2) => e2.nodeType === 1).forEach((e2) => {
      new Zs(e2);
    });
  }
}
var Js = defineComponent({name: "ElMenuCollapseTransition", setup: () => ({on: {beforeEnter(e) {
  e.style.opacity = 0.2;
}, enter(e, t) {
  nt(e, "el-opacity-transition"), e.style.opacity = 1, t();
}, afterEnter(e) {
  ot(e, "el-opacity-transition"), e.style.opacity = "";
}, beforeLeave(e) {
  e.dataset || (e.dataset = {}), at(e, "el-menu--collapse") ? (ot(e, "el-menu--collapse"), e.dataset.oldOverflow = e.style.overflow, e.dataset.scrollWidth = e.clientWidth, nt(e, "el-menu--collapse")) : (nt(e, "el-menu--collapse"), e.dataset.oldOverflow = e.style.overflow, e.dataset.scrollWidth = e.clientWidth, ot(e, "el-menu--collapse")), e.style.width = e.scrollWidth + "px", e.style.overflow = "hidden";
}, leave(e) {
  nt(e, "horizontal-collapse-transition"), e.style.width = e.dataset.scrollWidth + "px";
}}})});
function eu(e = "") {
  const t = ref("");
  return e ? (t.value = function(e2, t2 = 0.2) {
    let {red: l, green: a, blue: n} = function(e3) {
      let t3 = e3.replace("#", "");
      if (/^[0-9a-fA-F]{3}$/.test(t3)) {
        const e4 = t3.split("");
        for (let t4 = 2; t4 >= 0; t4--)
          e4.splice(t4, 0, e4[t4]);
        t3 = e4.join("");
      }
      return /^[0-9a-fA-F]{6}$/.test(t3) ? {red: parseInt(t3.slice(0, 2), 16), green: parseInt(t3.slice(2, 4), 16), blue: parseInt(t3.slice(4, 6), 16)} : {red: 255, green: 255, blue: 255};
    }(e2);
    return t2 > 0 ? (l *= 1 - t2, a *= 1 - t2, n *= 1 - t2) : (l += (255 - l) * t2, a += (255 - a) * t2, n += (255 - n) * t2), `rgb(${Math.round(l)}, ${Math.round(a)}, ${Math.round(n)})`;
  }(e), t) : t;
}
Js.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, mergeProps({mode: "out-in"}, toHandlers(e.on)), {default: withCtx(() => [renderSlot(e.$slots, "default")]), _: 3}, 16);
}, Js.__file = "packages/menu/src/menu-collapse-transition.vue";
var tu = defineComponent({name: "ElMenu", componentName: "ElMenu", components: {ElMenuCollapseTransition: Js}, props: {mode: {type: String, default: "vertical"}, defaultActive: {type: String, default: ""}, defaultOpeneds: Array, uniqueOpened: Boolean, router: Boolean, menuTrigger: {type: String, default: "hover"}, collapse: Boolean, backgroundColor: {type: String}, textColor: {type: String}, activeTextColor: {type: String}, collapseTransition: {type: Boolean, default: true}}, emits: ["close", "open", "select"], setup(t, a) {
  const r = ref(t.defaultOpeneds && !t.collapse ? t.defaultOpeneds.slice(0) : []), s = getCurrentInstance(), u = ref(t.defaultActive), d = ref({}), c = ref({}), p2 = ref(false), h2 = ae(), v = s.appContext.config.globalProperties.$router, m = eu(t.backgroundColor), f = computed(() => t.mode === "horizontal" || t.mode === "vertical" && t.collapse), g = () => {
    const e = u.value, l = d.value[e];
    if (!l || t.mode === "horizontal" || t.collapse)
      return;
    l.indexPath.forEach((e2) => {
      let t2 = c.value[e2];
      t2 && k(e2, t2 == null ? void 0 : t2.indexPath);
    });
  }, b = (e) => {
    c.value[e.index] = e;
  }, y = (e) => {
    delete c.value[e.index];
  }, k = (e, l) => {
    r.value.includes(e) || (t.uniqueOpened && (r.value = r.value.filter((e2) => (isRef(l) ? l.value : l).indexOf(e2) !== -1)), r.value.push(e));
  }, x = (e) => {
    const t2 = r.value.indexOf(e);
    t2 !== -1 && r.value.splice(t2, 1);
  }, w = (e) => {
    const {index: t2, indexPath: l} = e;
    r.value.includes(t2) ? (x(t2), a.emit("close", t2, l.value)) : (k(t2, l), a.emit("open", t2, l.value));
  }, _ = (e) => {
    const {index: l, indexPath: n} = e, o = e.index !== null, i = u.value;
    o && (u.value = e.index), a.emit("select", l, n.value, e), (t.mode === "horizontal" || t.collapse) && (r.value = []), t.router && v && o && E(e, (e2) => {
      if (u.value = i, e2) {
        if (e2.name === "NavigationDuplicated")
          return;
        console.error(e2);
      }
    });
  }, E = (e, t2) => {
    let l = e.route || e.index;
    try {
      v == null || v.push(l, () => null, t2);
    } catch (e2) {
      console.error(e2);
    }
  }, M = (e) => {
    const l = d.value, a2 = l[e] || l[u.value] || l[t.defaultActive];
    a2 ? (u.value = a2.index, g()) : p2.value ? p2.value = false : u.value = null;
  };
  return watch(() => t.defaultActive, (e) => {
    d.value[e] || (u.value = ""), M(e);
  }), watch(d.value, () => {
    M();
  }), watch(() => t.collapse, (e, l) => {
    e !== l && (p2.value = true), e && (r.value = []), h2.emit("rootMenu:toggle-collapse", Boolean(t.collapse));
  }), provide("rootMenu", {props: t, openedMenus: r, items: d, submenus: c, hoverBackground: m, activeIndex: u, isMenuPopup: f, methods: {addMenuItem: (e) => {
    d.value[e.index] = e;
  }, removeMenuItem: (e) => {
    delete d.value[e.index];
  }, addSubMenu: b, removeSubMenu: y, openMenu: k, closeMenu: x}, rootMenuEmit: h2.emit, rootMenuOn: h2.on}), provide("subMenu:" + s.uid, {addSubMenu: b, removeSubMenu: y}), onMounted(() => {
    g(), h2.on("menuItem:item-click", _), h2.on("submenu:submenu-click", w), t.mode === "horizontal" && new Qs(s.vnode.el);
  }), {hoverBackground: m, isMenuPopup: f, props: t, open: (e) => {
    const {indexPath: t2} = c.value[e.toString()];
    t2.forEach((e2) => k(e2, t2));
  }, close: (e) => {
    x(e);
  }};
}});
tu.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-menu-collapse-transition");
  return e.props.collapseTransition ? (openBlock(), createBlock(i, {key: 0}, {default: withCtx(() => [(openBlock(), createBlock("ul", {key: +e.props.collapse, role: "menubar", style: {backgroundColor: e.props.backgroundColor || ""}, class: {"el-menu": true, "el-menu--horizontal": e.mode === "horizontal", "el-menu--collapse": e.props.collapse}}, [renderSlot(e.$slots, "default")], 6))]), _: 3})) : (openBlock(), createBlock("ul", {key: +e.props.collapse, role: "menubar", style: {backgroundColor: e.props.backgroundColor || ""}, class: {"el-menu": true, "el-menu--horizontal": e.mode === "horizontal", "el-menu--collapse": e.props.collapse}}, [renderSlot(e.$slots, "default")], 6));
}, tu.__file = "packages/menu/src/menu.vue", tu.install = (e) => {
  e.component(tu.name, tu);
};
const lu = tu;
function au(e, t) {
  const l = inject("rootMenu"), a = computed(() => {
    let l2 = e.parent;
    const a2 = [t];
    for (; l2.type.name !== "ElMenu"; )
      l2.props.index && a2.unshift(l2.props.index), l2 = l2.parent;
    return a2;
  });
  return {parentMenu: computed(() => {
    let t2 = e.parent;
    for (; t2 && ["ElMenu", "ElSubmenu"].indexOf(t2.type.name) === -1; )
      t2 = t2.parent;
    return t2;
  }), paddingStyle: computed(() => {
    let t2 = e.parent;
    if (l.props.mode !== "vertical")
      return {};
    let a2 = 20;
    if (l.props.collapse)
      a2 = 20;
    else
      for (; t2 && t2.type.name !== "ElMenu"; )
        t2.type.name === "ElSubmenu" && (a2 += 20), t2 = t2.parent;
    return {paddingLeft: a2 + "px"};
  }), indexPath: a};
}
var nu = defineComponent({name: "ElTooltip", components: {ElPopper: Hl}, props: Object.assign(Object.assign({}, Al), {manual: {type: Boolean, default: false}, modelValue: {type: Boolean, validator: (e) => typeof e == "boolean", default: void 0}, openDelay: {type: Number, default: 0}, visibleArrow: {type: Boolean, default: true}, tabindex: {type: Number, default: 0}}), emits: [qt], setup(e, t) {
  e.manual && e.modelValue === void 0 && Le("[ElTooltip]", "You need to pass a v-model to el-tooltip when `manual` is true");
  const a = ref(null);
  return {popper: a, onUpdateVisible: (e2) => {
    t.emit(qt, e2);
  }, updatePopper: () => a.value.update()};
}, render() {
  const {$slots: e, content: t, manual: l, openDelay: a, onUpdateVisible: n, showAfter: o, visibleArrow: i, modelValue: r, tabindex: s} = this, u = () => {
    Le("[ElTooltip]", "you need to provide a valid default slot.");
  };
  return h(Hl, Object.assign(Object.assign({}, Object.keys(Al).reduce((e2, t2) => Object.assign(Object.assign({}, e2), {[t2]: this[t2]}), {})), {ref: "popper", manualMode: l, showAfter: a || o, showArrow: i, visible: r, "onUpdate:visible": n}), {default: () => e.content ? e.content() : t, trigger: () => {
    if (e.default) {
      const t2 = _l(e.default(), 1);
      return t2 || u(), cloneVNode(t2, {tabindex: s}, true);
    }
    u();
  }});
}});
nu.install = (e) => {
  e.component(nu.name, nu);
};
const ou = nu;
var iu = defineComponent({name: "ElMenuItem", componentName: "ElMenuItem", components: {ElTooltip: ou}, props: {index: {default: null, validator: (e) => typeof e == "string" || e === null}, route: [String, Object], disabled: Boolean}, emits: ["click"], setup(t, {emit: l, slots: a}) {
  const o = getCurrentInstance(), s = inject("rootMenu"), {parentMenu: u, paddingStyle: d, indexPath: c} = au(o, t.index), {addSubMenu: p2, removeSubMenu: h2} = inject("subMenu:" + u.value.uid), v = computed(() => t.index === s.activeIndex.value), m = computed(() => s.hoverBackground.value), f = computed(() => s.props.backgroundColor || ""), g = computed(() => s.props.activeTextColor || ""), b = computed(() => s.props.textColor || ""), y = computed(() => s.props.mode), k = computed(() => u.value.type.name !== "ElMenu"), C = computed(() => {
    const e = {color: v.value ? g.value : b.value, borderBottomColor: ""};
    return y.value !== "horizontal" || k.value || (e.borderBottomColor = v.value ? s.props.activeTextColor ? g.value : "" : "transparent"), e;
  });
  return onMounted(() => {
    p2({index: t.index, indexPath: c, active: v}), s.methods.addMenuItem({index: t.index, indexPath: c, active: v});
  }), onBeforeUnmount(() => {
    h2({index: t.index, indexPath: c, active: v}), s.methods.removeMenuItem({index: t.index, indexPath: c, active: v});
  }), {parentMenu: u, rootMenu: s, slots: a, paddingStyle: d, itemStyle: C, backgroundColor: f, active: v, handleClick: () => {
    t.disabled || (s.rootMenuEmit("menuItem:item-click", {index: t.index, indexPath: c, route: t.route}), l("click", {index: t.index, indexPath: c.value}));
  }, onMouseEnter: () => {
    (y.value !== "horizontal" || s.props.backgroundColor) && (o.vnode.el.style.backgroundColor = m.value);
  }, onMouseLeave: () => {
    (y.value !== "horizontal" || s.props.backgroundColor) && (o.vnode.el.style.backgroundColor = f.value);
  }};
}});
const ru = {style: {position: "absolute", left: "0", top: "0", height: "100%", width: "100%", display: "inline-block", "box-sizing": "border-box", padding: "0 20px"}};
iu.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-tooltip");
  return openBlock(), createBlock("li", {class: ["el-menu-item", {"is-active": e.active, "is-disabled": e.disabled}], role: "menuitem", tabindex: "-1", style: [e.paddingStyle, e.itemStyle, {backgroundColor: e.backgroundColor}], onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2)), onMouseenter: t[2] || (t[2] = (...t2) => e.onMouseEnter && e.onMouseEnter(...t2)), onFocus: t[3] || (t[3] = (...t2) => e.onMouseEnter && e.onMouseEnter(...t2)), onBlur: t[4] || (t[4] = (...t2) => e.onMouseLeave && e.onMouseLeave(...t2)), onMouseleave: t[5] || (t[5] = (...t2) => e.onMouseLeave && e.onMouseLeave(...t2))}, [e.parentMenu.type.name === "ElMenu" && e.rootMenu.props.collapse && e.slots.title ? (openBlock(), createBlock(i, {key: 0, effect: "dark", placement: "right"}, {content: withCtx(() => [renderSlot(e.$slots, "title")]), default: withCtx(() => [createVNode("div", ru, [renderSlot(e.$slots, "default")])]), _: 3})) : (openBlock(), createBlock(Fragment, {key: 1}, [renderSlot(e.$slots, "default"), renderSlot(e.$slots, "title")], 64))], 38);
}, iu.__file = "packages/menu/src/menuItem.vue", iu.install = (e) => {
  e.component(iu.name, iu);
};
const su = iu;
var uu = defineComponent({name: "ElMenuItemGroup", componentName: "ElMenuItemGroup", props: {title: {type: String}}, setup(t, {slots: l}) {
  const o = reactive({paddingLeft: 20}), i = getCurrentInstance(), r = computed(() => {
    let e = 20, t2 = i.parent;
    if (s.collapse)
      return 20;
    for (; t2 && t2.type.name !== "ElMenu"; )
      t2.type.name === "ElSubmenu" && (e += 20), t2 = t2.parent;
    return e;
  }), {props: s} = inject("rootMenu");
  return {data: o, levelPadding: r, props: t, slots: l};
}});
const du = {class: "el-menu-item-group"};
uu.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("li", du, [createVNode("div", {class: "el-menu-item-group__title", style: {paddingLeft: e.levelPadding + "px"}}, [e.slots.title ? renderSlot(e.$slots, "title", {key: 1}) : (openBlock(), createBlock(Fragment, {key: 0}, [createTextVNode(toDisplayString(e.title), 1)], 2112))], 4), createVNode("ul", null, [renderSlot(e.$slots, "default")])]);
}, uu.__file = "packages/menu/src/menuItemGroup.vue", uu.install = (e) => {
  e.component(uu.name, uu);
};
const cu = uu, pu = {success: "success", info: "info", warning: "warning", error: "error"};
var hu = defineComponent({name: "ElMessage", props: {customClass: {type: String, default: ""}, center: {type: Boolean, default: false}, dangerouslyUseHTMLString: {type: Boolean, default: false}, duration: {type: Number, default: 3e3}, iconClass: {type: String, default: ""}, id: {type: String, default: ""}, message: {type: [String, Object], default: ""}, onClose: {type: Function, required: true}, showClose: {type: Boolean, default: false}, type: {type: String, default: "info"}, offset: {type: Number, default: 20}, zIndex: {type: Number, default: 0}}, emits: ["destroy"], setup(e) {
  const t = computed(() => {
    const t2 = e.type;
    return t2 && pu[t2] ? "el-message__icon el-icon-" + pu[t2] : "";
  }), a = computed(() => ({top: e.offset + "px", zIndex: e.zIndex})), o = ref(false);
  let s = null;
  function u() {
    e.duration > 0 && (s = setTimeout(() => {
      o.value && d();
    }, e.duration));
  }
  function d() {
    o.value = false;
  }
  function c({code: e2}) {
    e2 === Dt.esc ? o.value && d() : u();
  }
  return onMounted(() => {
    u(), o.value = true, tt(document, "keydown", c);
  }), onBeforeUnmount(() => {
    lt(document, "keydown", c);
  }), {typeClass: t, customStyle: a, visible: o, close: d, clearTimer: function() {
    clearTimeout(s), s = null;
  }, startTimer: u};
}});
const vu = {key: 0, class: "el-message__content"};
hu.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "el-message-fade", onBeforeLeave: e.onClose, onAfterLeave: t[4] || (t[4] = (t2) => e.$emit("destroy"))}, {default: withCtx(() => [withDirectives(createVNode("div", {id: e.id, class: ["el-message", e.type && !e.iconClass ? "el-message--" + e.type : "", e.center ? "is-center" : "", e.showClose ? "is-closable" : "", e.customClass], style: e.customStyle, role: "alert", onMouseenter: t[2] || (t[2] = (...t2) => e.clearTimer && e.clearTimer(...t2)), onMouseleave: t[3] || (t[3] = (...t2) => e.startTimer && e.startTimer(...t2))}, [e.type || e.iconClass ? (openBlock(), createBlock("i", {key: 0, class: [e.typeClass, e.iconClass]}, null, 2)) : createCommentVNode("v-if", true), renderSlot(e.$slots, "default", {}, () => [e.dangerouslyUseHTMLString ? (openBlock(), createBlock(Fragment, {key: 1}, [createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "), createCommentVNode("  eslint-disable-next-line "), createVNode("p", {class: "el-message__content", innerHTML: e.message}, null, 8, ["innerHTML"])], 2112)) : (openBlock(), createBlock("p", vu, toDisplayString(e.message), 1))]), e.showClose ? (openBlock(), createBlock("div", {key: 1, class: "el-message__closeBtn el-icon-close", onClick: t[1] || (t[1] = withModifiers((...t2) => e.close && e.close(...t2), ["stop"]))})) : createCommentVNode("v-if", true)], 46, ["id"]), [[vShow, e.visible]])]), _: 3}, 8, ["onBeforeLeave"]);
}, hu.__file = "packages/message/src/index.vue";
const mu = [];
let fu = 1;
const gu = function(e = {}) {
  if (ye)
    return;
  typeof e == "string" && (e = {message: e});
  let t = e, l = e.offset || 20;
  mu.forEach(({vm: e2}) => {
    l += (e2.el.offsetHeight || 0) + 16;
  }), l += 16;
  const a = "message_" + fu++, n = t.onClose;
  t = Object.assign(Object.assign({}, t), {onClose: () => {
    !function(e2, t2) {
      const l2 = mu.findIndex(({vm: t3}) => {
        const {id: l3} = t3.component.props;
        return e2 === l3;
      });
      if (l2 === -1)
        return;
      const {vm: a2} = mu[l2];
      if (!a2)
        return;
      t2 == null || t2(a2);
      const n2 = a2.el.offsetHeight;
      mu.splice(l2, 1);
      const o2 = mu.length;
      if (o2 < 1)
        return;
      for (let e3 = l2; e3 < o2; e3++) {
        const t3 = parseInt(mu[e3].vm.el.style.top, 10) - n2 - 16;
        mu[e3].vm.component.props.offset = t3;
      }
    }(a, n);
  }, offset: l, id: a, zIndex: Pl.nextZIndex()});
  const o = document.createElement("div");
  o.className = "container_" + a;
  const i = t.message, r = createVNode(hu, t, isVNode(t.message) ? {default: () => i} : null);
  return r.props.onDestroy = () => {
    render(null, o);
  }, render(r, o), mu.push({vm: r}), document.body.appendChild(o.firstElementChild), {close: () => r.component.proxy.visible = false};
};
["success", "warning", "info", "error"].forEach((e) => {
  gu[e] = (t) => (typeof t == "string" ? t = {message: t, type: e} : t.type = e, gu(t));
}), gu.closeAll = function() {
  for (let e = mu.length - 1; e >= 0; e--) {
    mu[e].vm.component.ctx.close();
  }
};
const bu = gu;
bu.install = (e) => {
  e.config.globalProperties.$message = bu;
};
const yu = {success: "success", info: "info", warning: "warning", error: "error"};
var ku = defineComponent({name: "ElMessageBox", directives: {TrapFocus: jt}, components: {ElButton: pa, ElInput: vl, ElOverlay: er}, inheritAttrs: false, props: {buttonSize: {type: String, validator: Xt}, modal: {type: Boolean, default: true}, lockScroll: {type: Boolean, default: true}, showClose: {type: Boolean, default: true}, closeOnClickModal: {type: Boolean, default: true}, closeOnPressEscape: {type: Boolean, default: true}, closeOnHashChange: {type: Boolean, default: true}, center: Boolean, roundButton: {default: false, type: Boolean}, container: {type: String, default: "body"}, boxType: {type: String, default: ""}}, emits: ["vanish", "action"], setup(e, {emit: t}) {
  const s = ref(false), u = reactive({beforeClose: null, callback: null, cancelButtonText: "", cancelButtonClass: "", confirmButtonText: "", confirmButtonClass: "", customClass: "", dangerouslyUseHTMLString: false, distinguishCancelAndClose: false, iconClass: "", inputPattern: null, inputPlaceholder: "", inputType: "text", inputValue: null, inputValidator: null, inputErrorMessage: "", message: null, modalFade: true, modalClass: "", showCancelButton: false, showConfirmButton: true, type: "", title: void 0, showInput: false, action: "", confirmButtonLoading: false, cancelButtonLoading: false, confirmButtonDisabled: false, editorErrorMessage: "", validateError: false, zIndex: Pl.nextZIndex()}), d = computed(() => u.iconClass || (u.type && yu[u.type] ? "el-icon-" + yu[u.type] : "")), c = computed(() => !!u.message), p2 = ref(null), h2 = ref(null), v = computed(() => "el-button--primary " + u.confirmButtonClass);
  function m() {
    s.value && (s.value = false, nextTick(() => {
      u.action && t("action", u.action);
    }));
  }
  watch(() => u.inputValue, (t2) => Ms(this, void 0, void 0, function* () {
    yield nextTick(), e.boxType === "prompt" && t2 !== null && g();
  }), {immediate: true}), watch(() => s.value, (t2) => {
    t2 && (e.boxType !== "alert" && e.boxType !== "confirm" || nextTick().then(() => {
      var e2, t3, l;
      (l = (t3 = (e2 = h2.value) === null || e2 === void 0 ? void 0 : e2.$el) === null || t3 === void 0 ? void 0 : t3.focus) === null || l === void 0 || l.call(t3);
    }), u.zIndex = Pl.nextZIndex()), e.boxType === "prompt" && (t2 ? nextTick().then(() => {
      p2.value && p2.value.$el && b().focus();
    }) : (u.editorErrorMessage = "", u.validateError = false));
  }), onMounted(() => Ms(this, void 0, void 0, function* () {
    yield nextTick(), e.closeOnHashChange && tt(window, "hashchange", m);
  })), onBeforeUnmount(() => {
    e.closeOnHashChange && lt(window, "hashchange", m);
  });
  const f = (t2) => {
    var l;
    (e.boxType !== "prompt" || t2 !== "confirm" || g()) && (u.action = t2, u.beforeClose ? (l = u.beforeClose) === null || l === void 0 || l.call(u, t2, u, m) : m());
  }, g = () => {
    if (e.boxType === "prompt") {
      const e2 = u.inputPattern;
      if (e2 && !e2.test(u.inputValue || ""))
        return u.editorErrorMessage = u.inputErrorMessage || ya("el.messagebox.error"), u.validateError = true, false;
      const t2 = u.inputValidator;
      if (typeof t2 == "function") {
        const e3 = t2(u.inputValue);
        if (e3 === false)
          return u.editorErrorMessage = u.inputErrorMessage || ya("el.messagebox.error"), u.validateError = true, false;
        if (typeof e3 == "string")
          return u.editorErrorMessage = e3, u.validateError = true, false;
      }
    }
    return u.editorErrorMessage = "", u.validateError = false, true;
  }, b = () => {
    const e2 = p2.value.$refs;
    return e2.input || e2.textarea;
  }, y = () => {
    f("close");
  };
  return e.closeOnPressEscape ? At({handleClose: y}, s) : ((e2, t2, l) => {
    const a = (e3) => {
      l(e3) && e3.stopImmediatePropagation();
    };
    watch(() => e2.value, (e3) => {
      e3 ? tt(document, t2, a, true) : lt(document, t2, a, true);
    }, {immediate: true});
  })(s, "keydown", (e2) => e2.code === Dt.esc), e.lockScroll && Tt(s), Nt(s), Object.assign(Object.assign({}, toRefs(u)), {visible: s, hasMessage: c, icon: d, confirmButtonClasses: v, inputRef: p2, confirmRef: h2, doClose: m, handleClose: y, handleWrapperClick: () => {
    e.closeOnClickModal && f(u.distinguishCancelAndClose ? "close" : "cancel");
  }, handleInputEnter: () => {
    if (u.inputType !== "textarea")
      return f("confirm");
  }, handleAction: f, t: ya});
}});
const Cu = {key: 0, class: "el-message-box__header"}, xu = {class: "el-message-box__title"}, wu = createVNode("i", {class: "el-message-box__close el-icon-close"}, null, -1), _u = {class: "el-message-box__content"}, Su = {class: "el-message-box__container"}, Eu = {key: 1, class: "el-message-box__message"}, Mu = {key: 0}, Tu = {class: "el-message-box__input"}, Nu = {class: "el-message-box__btns"};
ku.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input"), r = resolveComponent("el-button"), y = resolveComponent("el-overlay"), k = resolveDirective("trap-focus");
  return openBlock(), createBlock(Transition, {name: "fade-in-linear", onAfterLeave: t[8] || (t[8] = (t2) => e.$emit("vanish"))}, {default: withCtx(() => [withDirectives(createVNode(y, {"z-index": e.zIndex, "overlay-class": ["is-message-box", e.modalClass], mask: e.modal, onClick: withModifiers(e.handleWrapperClick, ["self"])}, {default: withCtx(() => [withDirectives(createVNode("div", {ref: "root", "aria-label": e.title || "dialog", "aria-modal": "true", class: ["el-message-box", e.customClass, {"el-message-box--center": e.center}]}, [e.title !== null && e.title !== void 0 ? (openBlock(), createBlock("div", Cu, [createVNode("div", xu, [e.icon && e.center ? (openBlock(), createBlock("div", {key: 0, class: ["el-message-box__status", e.icon]}, null, 2)) : createCommentVNode("v-if", true), createVNode("span", null, toDisplayString(e.title), 1)]), e.showClose ? (openBlock(), createBlock("button", {key: 0, type: "button", class: "el-message-box__headerbtn", "aria-label": "Close", onClick: t[1] || (t[1] = (t2) => e.handleAction(e.distinguishCancelAndClose ? "close" : "cancel")), onKeydown: t[2] || (t[2] = withKeys((t2) => e.handleAction(e.distinguishCancelAndClose ? "close" : "cancel"), ["enter"]))}, [wu], 32)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createVNode("div", _u, [createVNode("div", Su, [e.icon && !e.center && e.hasMessage ? (openBlock(), createBlock("div", {key: 0, class: ["el-message-box__status", e.icon]}, null, 2)) : createCommentVNode("v-if", true), e.hasMessage ? (openBlock(), createBlock("div", Eu, [renderSlot(e.$slots, "default", {}, () => [e.dangerouslyUseHTMLString ? (openBlock(), createBlock("p", {key: 1, innerHTML: e.message}, null, 8, ["innerHTML"])) : (openBlock(), createBlock("p", Mu, toDisplayString(e.message), 1))])])) : createCommentVNode("v-if", true)]), withDirectives(createVNode("div", Tu, [createVNode(i, {ref: "inputRef", modelValue: e.inputValue, "onUpdate:modelValue": t[3] || (t[3] = (t2) => e.inputValue = t2), type: e.inputType, placeholder: e.inputPlaceholder, class: {invalid: e.validateError}, onKeydown: withKeys(withModifiers(e.handleInputEnter, ["prevent"]), ["enter"])}, null, 8, ["modelValue", "type", "placeholder", "class", "onKeydown"]), createVNode("div", {class: "el-message-box__errormsg", style: {visibility: e.editorErrorMessage ? "visible" : "hidden"}}, toDisplayString(e.editorErrorMessage), 5)], 512), [[vShow, e.showInput]])]), createVNode("div", Nu, [e.showCancelButton ? (openBlock(), createBlock(r, {key: 0, loading: e.cancelButtonLoading, class: [e.cancelButtonClass], round: e.roundButton, size: e.buttonSize || "small", onClick: t[4] || (t[4] = (t2) => e.handleAction("cancel")), onKeydown: t[5] || (t[5] = withKeys((t2) => e.handleAction("cancel"), ["enter"]))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.cancelButtonText || e.t("el.messagebox.cancel")), 1)]), _: 1}, 8, ["loading", "class", "round", "size"])) : createCommentVNode("v-if", true), withDirectives(createVNode(r, {ref: "confirmRef", loading: e.confirmButtonLoading, class: [e.confirmButtonClasses], round: e.roundButton, disabled: e.confirmButtonDisabled, size: e.buttonSize || "small", onClick: t[6] || (t[6] = (t2) => e.handleAction("confirm")), onKeydown: t[7] || (t[7] = withKeys((t2) => e.handleAction("confirm"), ["enter"]))}, {default: withCtx(() => [createTextVNode(toDisplayString(e.confirmButtonText || e.t("el.messagebox.confirm")), 1)]), _: 1}, 8, ["loading", "class", "round", "disabled", "size"]), [[vShow, e.showConfirmButton]])])], 10, ["aria-label"]), [[k]])]), _: 3}, 8, ["z-index", "overlay-class", "mask", "onClick"]), [[vShow, e.visible]])]), _: 1});
}, ku.__file = "packages/message-box/src/index.vue";
const Du = new Map(), Ou = (e) => {
  const t = document.createElement("div");
  e.onVanish = () => {
    render(null, t), Du.delete(a);
  }, e.onAction = (t2) => {
    const n = Du.get(a);
    let o;
    o = e.showInput ? {value: a.inputValue, action: t2} : t2, e.callback ? e.callback(o, l.proxy) : t2 === "cancel" || t2 === "close" ? e.distinguishCancelAndClose && t2 !== "cancel" ? n.reject("close") : n.reject("cancel") : n.resolve(o);
  };
  const l = ((e2, t2) => {
    const l2 = h(ku, e2);
    return render(l2, t2), document.body.appendChild(t2.firstElementChild), l2.component;
  })(e, t), a = l.proxy;
  for (const t2 in e)
    we(e, t2) && !we(a.$props, t2) && (a[t2] = e[t2]);
  return watch(() => a.message, (e2, t2) => {
    isVNode(e2) ? l.slots.default = () => [e2] : isVNode(t2) && !isVNode(e2) && delete l.slots.default;
  }, {immediate: true}), a.visible = true, a;
};
function Iu(e) {
  if (ye)
    return;
  let t;
  return Ee(e) || isVNode(e) ? e = {message: e} : t = e.callback, new Promise((l, a) => {
    const n = Ou(e);
    Du.set(n, {options: e, callback: t, resolve: l, reject: a});
  });
}
Iu.alert = (e, t, l) => (typeof t == "object" ? (l = t, t = "") : t === void 0 && (t = ""), Iu(Object.assign({title: t, message: e, type: "", closeOnPressEscape: false, closeOnClickModal: false}, l, {boxType: "alert"}))), Iu.confirm = (e, t, l) => (typeof t == "object" ? (l = t, t = "") : t === void 0 && (t = ""), Iu(Object.assign({title: t, message: e, type: "", showCancelButton: true}, l, {boxType: "confirm"}))), Iu.prompt = (e, t, l) => (typeof t == "object" ? (l = t, t = "") : t === void 0 && (t = ""), Iu(Object.assign({title: t, message: e, showCancelButton: true, showInput: true, type: ""}, l, {boxType: "prompt"}))), Iu.close = () => {
  Du.forEach((e, t) => {
    t.doClose();
  }), Du.clear();
};
const Pu = Iu;
Pu.install = (e) => {
  e.config.globalProperties.$msgbox = Pu, e.config.globalProperties.$messageBox = Pu, e.config.globalProperties.$alert = Pu.alert, e.config.globalProperties.$confirm = Pu.confirm, e.config.globalProperties.$prompt = Pu.prompt;
};
const Vu = {success: "success", info: "info", warning: "warning", error: "error"};
var Bu = defineComponent({name: "ElNotification", props: {customClass: {type: String, default: ""}, dangerouslyUseHTMLString: {type: Boolean, default: false}, duration: {type: Number, default: 4500}, iconClass: {type: String, default: ""}, id: {type: String, default: ""}, message: {type: [String, Object], default: ""}, offset: {type: Number, default: 0}, onClick: {type: Function, default: () => {
}}, onClose: {type: Function, required: true}, position: {type: String, default: "top-right"}, showClose: {type: Boolean, default: true}, title: {type: String, default: ""}, type: {type: String, default: ""}, zIndex: {type: Number, default: 0}}, emits: ["destroy"], setup(e) {
  const t = ref(false);
  let a = null;
  const o = computed(() => {
    const t2 = e.type;
    return t2 && Vu[t2] ? "el-icon-" + Vu[t2] : "";
  }), s = computed(() => e.position.indexOf("right") > 1 ? "right" : "left"), u = computed(() => e.position.startsWith("top") ? "top" : "bottom"), d = computed(() => ({[u.value]: e.offset + "px"}));
  function c() {
    e.duration > 0 && (a = setTimeout(() => {
      t.value && h2();
    }, e.duration));
  }
  function p2() {
    clearTimeout(a), a = null;
  }
  function h2() {
    t.value = false;
  }
  function v({code: e2}) {
    e2 === Dt.delete || e2 === Dt.backspace ? p2() : e2 === Dt.esc ? t.value && h2() : c();
  }
  return onMounted(() => {
    c(), t.value = true, tt(document, "keydown", v);
  }), onBeforeUnmount(() => {
    lt(document, "keydown", v);
  }), {horizontalClass: s, typeClass: o, positionStyle: d, visible: t, close: h2, clearTimer: p2, startTimer: c};
}});
const Au = {key: 0};
Bu.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock(Transition, {name: "el-notification-fade", onBeforeLeave: e.onClose, onAfterLeave: t[5] || (t[5] = (t2) => e.$emit("destroy"))}, {default: withCtx(() => [withDirectives(createVNode("div", {id: e.id, class: ["el-notification", e.customClass, e.horizontalClass], style: e.positionStyle, role: "alert", onMouseenter: t[2] || (t[2] = (...t2) => e.clearTimer && e.clearTimer(...t2)), onMouseleave: t[3] || (t[3] = (...t2) => e.startTimer && e.startTimer(...t2)), onClick: t[4] || (t[4] = (...t2) => e.onClick && e.onClick(...t2))}, [e.type || e.iconClass ? (openBlock(), createBlock("i", {key: 0, class: ["el-notification__icon", [e.typeClass, e.iconClass]]}, null, 2)) : createCommentVNode("v-if", true), createVNode("div", {class: ["el-notification__group", {"is-with-icon": e.typeClass || e.iconClass}]}, [createVNode("h2", {class: "el-notification__title", textContent: toDisplayString(e.title)}, null, 8, ["textContent"]), withDirectives(createVNode("div", {class: "el-notification__content", style: e.title ? null : "margin: 0"}, [renderSlot(e.$slots, "default", {}, () => [e.dangerouslyUseHTMLString ? (openBlock(), createBlock(Fragment, {key: 1}, [createCommentVNode(" Caution here, message could've been compromized, nerver use user's input as message "), createCommentVNode(" eslint-disable-next-line "), createVNode("p", {innerHTML: e.message}, null, 8, ["innerHTML"])], 2112)) : (openBlock(), createBlock("p", Au, toDisplayString(e.message), 1))])], 4), [[vShow, e.message]]), e.showClose ? (openBlock(), createBlock("div", {key: 0, class: "el-notification__closeBtn el-icon-close", onClick: t[1] || (t[1] = withModifiers((...t2) => e.close && e.close(...t2), ["stop"]))})) : createCommentVNode("v-if", true)], 2)], 46, ["id"]), [[vShow, e.visible]])]), _: 3}, 8, ["onBeforeLeave"]);
}, Bu.__file = "packages/notification/src/index.vue";
const Lu = {"top-left": [], "top-right": [], "bottom-left": [], "bottom-right": []};
let zu = 1;
const Fu = function(e = {}) {
  if (ye)
    return;
  const t = e.position || "top-right";
  let l = e.offset || 0;
  Lu[t].forEach(({vm: e2}) => {
    l += (e2.el.offsetHeight || 0) + 16;
  }), l += 16;
  const a = "notification_" + zu++, n = e.onClose;
  e = Object.assign(Object.assign({}, e), {onClose: () => {
    !function(e2, t2, l2) {
      const a2 = Lu[t2], n2 = a2.findIndex(({vm: t3}) => t3.component.props.id === e2);
      if (n2 === -1)
        return;
      const {vm: o2} = a2[n2];
      if (!o2)
        return;
      l2 == null || l2(o2);
      const i2 = o2.el.offsetHeight, r = t2.split("-")[0];
      a2.splice(n2, 1);
      const s = a2.length;
      if (s < 1)
        return;
      for (let e3 = n2; e3 < s; e3++) {
        const {el: t3, component: l3} = a2[e3].vm, n3 = parseInt(t3.style[r], 10) - i2 - 16;
        l3.props.offset = n3;
      }
    }(a, t, n);
  }, offset: l, id: a, zIndex: Pl.nextZIndex()});
  const o = document.createElement("div"), i = createVNode(Bu, e, isVNode(e.message) ? {default: () => e.message} : null);
  return i.props.onDestroy = () => {
    render(null, o);
  }, render(i, o), Lu[t].push({vm: i}), document.body.appendChild(o.firstElementChild), {close: () => {
    i.component.proxy.visible = false;
  }};
};
["success", "warning", "info", "error"].forEach((e) => {
  Object.assign(Fu, {[e]: (t = {}) => ((typeof t == "string" || isVNode(t)) && (t = {message: t}), t.type = e, Fu(t))});
});
const $u = Fu;
$u.install = (e) => {
  e.config.globalProperties.$notify = $u;
};
const Ru = "elOptionQueryChange", Hu = "elOptionGroupQueryChange";
function Wu(t, l) {
  const a = inject("ElSelect"), i = inject("ElSelectGroup", {disabled: false}), r = computed(() => Object.prototype.toString.call(t.value).toLowerCase() === "[object object]"), s = computed(() => a.props.multiple ? v(a.props.modelValue, t.value) : m(t.value, a.props.modelValue)), u = computed(() => {
    if (a.props.multiple) {
      const e = a.props.modelValue || [];
      return !s.value && e.length >= a.props.multipleLimit && a.props.multipleLimit > 0;
    }
    return false;
  }), d = computed(() => t.label || (r.value ? "" : t.value)), c = computed(() => t.value || t.label || ""), p2 = computed(() => t.disabled || l.groupDisabled || u.value), h2 = getCurrentInstance(), v = (e = [], t2) => {
    if (r.value) {
      const l2 = a.props.valueKey;
      return e && e.some((e2) => Fe(e2, l2) === Fe(t2, l2));
    }
    return e && e.indexOf(t2) > -1;
  }, m = (e, t2) => {
    if (r.value) {
      const {valueKey: l2} = a.props;
      return Fe(e, l2) === Fe(t2, l2);
    }
    return e === t2;
  };
  return watch(() => d.value, () => {
    t.created || a.props.remote || a.setSelected();
  }), watch(() => t.value, (e, l2) => {
    const {remote: n, valueKey: o} = a.props;
    if (!t.created && !n) {
      if (o && typeof e == "object" && typeof l2 == "object" && e[o] === l2[o])
        return;
      a.setSelected();
    }
  }), watch(() => i.disabled, () => {
    l.groupDisabled = i.disabled;
  }, {immediate: true}), a.selectEmitter.on(Ru, (e) => {
    const n = new RegExp(((e2 = "") => String(e2).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"))(e), "i");
    l.visible = n.test(d.value) || t.created, l.visible || a.filteredOptionsCount--;
  }), {select: a, currentLabel: d, currentValue: c, itemSelected: s, isDisabled: p2, hoverItem: () => {
    t.disabled || i.disabled || (a.hoverIndex = a.optionsArray.indexOf(h2));
  }};
}
var ju = defineComponent({name: "ElOption", componentName: "ElOption", props: {value: {required: true, type: [String, Number, Boolean, Object]}, label: [String, Number], created: Boolean, disabled: {type: Boolean, default: false}}, setup(t) {
  const l = reactive({index: -1, groupDisabled: false, visible: true, hitState: false, hover: false}), {currentLabel: n, itemSelected: o, isDisabled: i, select: s, hoverItem: u} = Wu(t, l), {visible: d, hover: c} = toRefs(l), p2 = getCurrentInstance().proxy;
  return s.onOptionCreate(p2), onBeforeUnmount(() => {
    const {selected: e} = s;
    let l2 = s.props.multiple ? e : [e];
    const a = s.cachedOptions.has(t.value), n2 = l2.some((e2) => e2.value === p2.value);
    a && !n2 && s.cachedOptions.delete(t.value), s.onOptionDestroy(t.value);
  }), {currentLabel: n, itemSelected: o, isDisabled: i, select: s, hoverItem: u, visible: d, hover: c, selectOptionClick: function() {
    t.disabled !== true && l.groupDisabled !== true && s.handleOptionSelect(p2, true);
  }};
}});
ju.render = function(e, t, l, a, n, o) {
  return withDirectives((openBlock(), createBlock("li", {class: ["el-select-dropdown__item", {selected: e.itemSelected, "is-disabled": e.isDisabled, hover: e.hover}], onMouseenter: t[1] || (t[1] = (...t2) => e.hoverItem && e.hoverItem(...t2)), onClick: t[2] || (t[2] = withModifiers((...t2) => e.selectOptionClick && e.selectOptionClick(...t2), ["stop"]))}, [renderSlot(e.$slots, "default", {}, () => [createVNode("span", null, toDisplayString(e.currentLabel), 1)])], 34)), [[vShow, e.visible]]);
}, ju.__file = "packages/select/src/option.vue";
var Ku = defineComponent({name: "ElSelectDropdown", componentName: "ElSelectDropdown", setup() {
  const e = inject("ElSelect"), t = computed(() => e.props.popperClass), a = computed(() => e.props.multiple), o = ref("");
  function s() {
    var t2;
    o.value = ((t2 = e.selectWrapper) === null || t2 === void 0 ? void 0 : t2.getBoundingClientRect().width) + "px";
  }
  return onMounted(() => {
    pt(e.selectWrapper, s);
  }), onBeforeUnmount(() => {
    ht(e.selectWrapper, s);
  }), {minWidth: o, popperClass: t, isMultiple: a};
}});
Ku.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-select-dropdown", [{"is-multiple": e.isMultiple}, e.popperClass]], style: {minWidth: e.minWidth}}, [renderSlot(e.$slots, "default")], 6);
}, Ku.__file = "packages/select/src/select-dropdown.vue";
const Yu = (e, t, a) => {
  const i = Ue(), r = ref(null), s = ref(null), u = ref(null), d = ref(null), c = ref(null), p2 = ref(null), h2 = ref(-1), v = inject("elForm", {}), m = inject("elFormItem", {}), f = computed(() => !e.filterable || e.multiple || !(!ye && !isNaN(Number(document.documentMode))) && !(!ye && navigator.userAgent.indexOf("Edge") > -1) && !t.visible), g = computed(() => e.disabled || v.disabled), b = computed(() => {
    const l = e.multiple ? Array.isArray(e.modelValue) && e.modelValue.length > 0 : e.modelValue !== void 0 && e.modelValue !== null && e.modelValue !== "";
    return e.clearable && !g.value && t.inputHovering && l;
  }), y = computed(() => e.remote && e.filterable ? "" : t.visible ? "arrow-up is-reverse" : "arrow-up"), k = computed(() => e.remote ? 300 : 0), C = computed(() => e.loading ? e.loadingText || ya("el.select.loading") : (!e.remote || t.query !== "" || t.options.size !== 0) && (e.filterable && t.query && t.options.size > 0 && t.filteredOptionsCount === 0 ? e.noMatchText || ya("el.select.noMatch") : t.options.size === 0 ? e.noDataText || ya("el.select.noData") : null)), x = computed(() => Array.from(t.options.values())), _ = computed(() => Array.from(t.cachedOptions.values())), S = computed(() => {
    const l = x.value.filter((e2) => !e2.created).some((e2) => e2.currentLabel === t.query);
    return e.filterable && e.allowCreate && t.query !== "" && !l;
  }), M = computed(() => e.size || m.size || i.size), T = computed(() => ["small", "mini"].indexOf(M.value) > -1 ? "mini" : "small"), N = computed(() => t.visible && C.value !== false);
  watch(() => g.value, () => {
    nextTick(() => {
      D();
    });
  }), watch(() => e.placeholder, (e2) => {
    t.cachedPlaceHolder = t.currentPlaceholder = e2;
  }), watch(() => e.modelValue, (l, a2) => {
    var n;
    e.multiple && (D(), l && l.length > 0 || s.value && t.query !== "" ? t.currentPlaceholder = "" : t.currentPlaceholder = t.cachedPlaceHolder, e.filterable && !e.reserveKeyword && (t.query = "", O(t.query))), V(), e.filterable && !e.multiple && (t.inputLength = 20), isEqual_1(l, a2) || (n = m.formItemMitt) === null || n === void 0 || n.emit("el.form.change", l);
  }, {flush: "post", deep: true}), watch(() => t.visible, (l) => {
    var n, o;
    l ? ((o = (n = u.value) === null || n === void 0 ? void 0 : n.update) === null || o === void 0 || o.call(n), e.filterable && (t.filteredOptionsCount = t.optionsCount, t.query = e.remote ? "" : t.selectedLabel, e.multiple ? s.value.focus() : t.selectedLabel && (t.currentPlaceholder = t.selectedLabel, t.selectedLabel = ""), O(t.query), e.multiple || e.remote || (t.selectEmitter.emit("elOptionQueryChange", ""), t.selectEmitter.emit("elOptionGroupQueryChange")))) : (s.value && s.value.blur(), t.query = "", t.previousQuery = null, t.selectedLabel = "", t.inputLength = 20, t.menuVisibleOnFocus = false, A(), nextTick(() => {
      s.value && s.value.value === "" && t.selected.length === 0 && (t.currentPlaceholder = t.cachedPlaceHolder);
    }), e.multiple || (t.selected && (e.filterable && e.allowCreate && t.createdSelected && t.createdLabel ? t.selectedLabel = t.createdLabel : t.selectedLabel = t.selected.currentLabel, e.filterable && (t.query = t.selectedLabel)), e.filterable && (t.currentPlaceholder = t.cachedPlaceHolder))), a.emit("visible-change", l);
  }), watch(() => t.options.entries(), () => {
    var l, a2, n;
    if (ye)
      return;
    (a2 = (l = u.value) === null || l === void 0 ? void 0 : l.update) === null || a2 === void 0 || a2.call(l), e.multiple && D();
    const o = ((n = c.value) === null || n === void 0 ? void 0 : n.querySelectorAll("input")) || [];
    [].indexOf.call(o, document.activeElement) === -1 && V(), e.defaultFirstOption && (e.filterable || e.remote) && t.filteredOptionsCount && P();
  }, {flush: "post"}), watch(() => t.hoverIndex, (e2) => {
    typeof e2 == "number" && e2 > -1 && (h2.value = x.value[e2] || {}), x.value.forEach((e3) => {
      e3.hover = h2.value === e3;
    });
  });
  const D = () => {
    e.collapseTags && !e.filterable || nextTick(() => {
      var e2, l;
      if (!r.value)
        return;
      const a2 = r.value.$el.childNodes, n = [].filter.call(a2, (e3) => e3.tagName === "INPUT")[0], o = d.value, i2 = t.initialInputHeight || 40;
      n.style.height = t.selected.length === 0 ? i2 + "px" : Math.max(o ? o.clientHeight + (o.clientHeight > i2 ? 6 : 0) : 0, i2) + "px", t.tagInMultiLine = parseFloat(n.style.height) > i2, t.visible && C.value !== false && ((l = (e2 = u.value) === null || e2 === void 0 ? void 0 : e2.update) === null || l === void 0 || l.call(e2));
    });
  }, O = (l) => {
    t.previousQuery === l || t.isOnComposition || (t.previousQuery !== null || typeof e.filterMethod != "function" && typeof e.remoteMethod != "function" ? (t.previousQuery = l, nextTick(() => {
      var e2, l2;
      t.visible && ((l2 = (e2 = u.value) === null || e2 === void 0 ? void 0 : e2.update) === null || l2 === void 0 || l2.call(e2));
    }), t.hoverIndex = -1, e.multiple && e.filterable && nextTick(() => {
      const l2 = 15 * s.value.length + 20;
      t.inputLength = e.collapseTags ? Math.min(50, l2) : l2, I(), D();
    }), e.remote && typeof e.remoteMethod == "function" ? (t.hoverIndex = -1, e.remoteMethod(l)) : typeof e.filterMethod == "function" ? (e.filterMethod(l), t.selectEmitter.emit("elOptionGroupQueryChange")) : (t.filteredOptionsCount = t.optionsCount, t.selectEmitter.emit("elOptionQueryChange", l), t.selectEmitter.emit("elOptionGroupQueryChange")), e.defaultFirstOption && (e.filterable || e.remote) && t.filteredOptionsCount && P()) : t.previousQuery = l);
  }, I = () => {
    t.currentPlaceholder !== "" && (t.currentPlaceholder = s.value.value ? "" : t.cachedPlaceHolder);
  }, P = () => {
    t.hoverIndex = -1;
    let e2 = false;
    for (let l = t.options.size - 1; l >= 0; l--)
      if (x.value[l].created) {
        e2 = true, t.hoverIndex = l;
        break;
      }
    if (!e2)
      for (let e3 = 0; e3 !== t.options.size; ++e3) {
        const l = x.value[e3];
        if (t.query) {
          if (!l.disabled && !l.groupDisabled && l.visible) {
            t.hoverIndex = e3;
            break;
          }
        } else if (l.itemSelected) {
          t.hoverIndex = e3;
          break;
        }
      }
  }, V = () => {
    var l;
    if (!e.multiple) {
      const a3 = B(e.modelValue);
      return ((l = a3.props) === null || l === void 0 ? void 0 : l.created) ? (t.createdLabel = a3.props.value, t.createdSelected = true) : t.createdSelected = false, t.selectedLabel = a3.currentLabel, t.selected = a3, void (e.filterable && (t.query = t.selectedLabel));
    }
    const a2 = [];
    Array.isArray(e.modelValue) && e.modelValue.forEach((e2) => {
      a2.push(B(e2));
    }), t.selected = a2, nextTick(() => {
      D();
    });
  }, B = (l) => {
    let a2;
    const n = Oe(l).toLowerCase() === "object", o = Oe(l).toLowerCase() === "null", i2 = Oe(l).toLowerCase() === "undefined";
    for (let o2 = t.cachedOptions.size - 1; o2 >= 0; o2--) {
      const t2 = _.value[o2];
      if (n ? Fe(t2.value, e.valueKey) === Fe(l, e.valueKey) : t2.value === l) {
        a2 = {value: l, currentLabel: t2.currentLabel, isDisabled: t2.isDisabled};
        break;
      }
    }
    if (a2)
      return a2;
    const r2 = {value: l, currentLabel: n || o || i2 ? "" : l};
    return e.multiple && (r2.hitState = false), r2;
  }, A = () => {
    setTimeout(() => {
      e.multiple ? t.selected.length > 0 ? t.hoverIndex = Math.min.apply(null, t.selected.map((e2) => x.value.indexOf(e2))) : t.hoverIndex = -1 : t.hoverIndex = x.value.indexOf(t.selected);
    }, 300);
  }, L = () => {
    var e2;
    t.inputWidth = (e2 = r.value) === null || e2 === void 0 ? void 0 : e2.$el.getBoundingClientRect().width;
  }, z = debounce_1(() => {
    e.filterable && t.query !== t.selectedLabel && (t.query = t.selectedLabel, O(t.query));
  }, k.value), F = debounce_1((e2) => {
    O(e2.target.value);
  }, k.value), $ = (t2) => {
    isEqual_1(e.modelValue, t2) || a.emit("change", t2);
  }, R = (l) => {
    l.stopPropagation();
    const n = e.multiple ? [] : "";
    if (typeof n != "string")
      for (const e2 of t.selected)
        e2.isDisabled && n.push(e2.value);
    a.emit(qt, n), $(n), t.visible = false, a.emit("clear");
  }, H = (l, n) => {
    if (e.multiple) {
      const n2 = (e.modelValue || []).slice(), o = W(n2, l.value);
      o > -1 ? n2.splice(o, 1) : (e.multipleLimit <= 0 || n2.length < e.multipleLimit) && n2.push(l.value), a.emit(qt, n2), $(n2), l.created && (t.query = "", O(""), t.inputLength = 20), e.filterable && s.value.focus();
    } else
      a.emit(qt, l.value), $(l.value), t.visible = false;
    t.isSilentBlur = n, j(), t.visible || nextTick(() => {
      K(l);
    });
  }, W = (t2 = [], l) => {
    if (!Me(l))
      return t2.indexOf(l);
    const a2 = e.valueKey;
    let n = -1;
    return t2.some((e2, t3) => Fe(e2, a2) === Fe(l, a2) && (n = t3, true)), n;
  }, j = () => {
    t.softFocus = true;
    const e2 = s.value || r.value;
    e2 && e2.focus();
  }, K = (e2) => {
    var t2, l, a2, n;
    const o = Array.isArray(e2) ? e2[0] : e2;
    let i2 = null;
    if (o == null ? void 0 : o.value) {
      const e3 = x.value.filter((e4) => e4.value === o.value);
      e3.length > 0 && (i2 = e3[0].$el);
    }
    if (u.value && i2) {
      const e3 = (a2 = (l = (t2 = u.value) === null || t2 === void 0 ? void 0 : t2.popperRef) === null || l === void 0 ? void 0 : l.querySelector) === null || a2 === void 0 ? void 0 : a2.call(l, ".el-select-dropdown__wrap");
      e3 && qn(e3, i2);
    }
    (n = p2.value) === null || n === void 0 || n.handleScroll();
  }, Y = (e2) => {
    if (!Array.isArray(t.selected))
      return;
    const l = t.selected[t.selected.length - 1];
    return l ? e2 === true || e2 === false ? (l.hitState = e2, e2) : (l.hitState = !l.hitState, l.hitState) : void 0;
  }, q = () => {
    e.automaticDropdown || g.value || (t.menuVisibleOnFocus ? t.menuVisibleOnFocus = false : t.visible = !t.visible, t.visible && (s.value || r.value).focus());
  }, U = computed(() => x.value.filter((e2) => e2.visible).every((e2) => e2.disabled)), G = (e2) => {
    if (t.visible) {
      if (t.options.size !== 0 && t.filteredOptionsCount !== 0 && !U.value) {
        e2 === "next" ? (t.hoverIndex++, t.hoverIndex === t.options.size && (t.hoverIndex = 0)) : e2 === "prev" && (t.hoverIndex--, t.hoverIndex < 0 && (t.hoverIndex = t.options.size - 1));
        const l = x.value[t.hoverIndex];
        l.disabled !== true && l.groupDisabled !== true && l.visible || G(e2), nextTick(() => K(h2.value));
      }
    } else
      t.visible = true;
  };
  return {optionsArray: x, selectSize: M, handleResize: () => {
    var t2, l;
    L(), (l = (t2 = u.value) === null || t2 === void 0 ? void 0 : t2.update) === null || l === void 0 || l.call(t2), e.multiple && D();
  }, debouncedOnInputChange: z, debouncedQueryChange: F, deletePrevTag: (l) => {
    if (l.target.value.length <= 0 && !Y()) {
      const t2 = e.modelValue.slice();
      t2.pop(), a.emit(qt, t2), $(t2);
    }
    l.target.value.length === 1 && e.modelValue.length === 0 && (t.currentPlaceholder = t.cachedPlaceHolder);
  }, deleteTag: (l, n) => {
    const o = t.selected.indexOf(n);
    if (o > -1 && !g.value) {
      const t2 = e.modelValue.slice();
      t2.splice(o, 1), a.emit(qt, t2), $(t2), a.emit("remove-tag", n.value);
    }
    l.stopPropagation();
  }, deleteSelected: R, handleOptionSelect: H, scrollToOption: K, readonly: f, resetInputHeight: D, showClose: b, iconClass: y, showNewOption: S, collapseTagSize: T, setSelected: V, managePlaceholder: I, selectDisabled: g, emptyText: C, toggleLastOptionHitState: Y, resetInputState: (e2) => {
    e2.code !== Dt.backspace && Y(false), t.inputLength = 15 * s.value.length + 20, D();
  }, handleComposition: (e2) => {
    const l = e2.target.value;
    if (e2.type === "compositionend")
      t.isOnComposition = false, nextTick(() => O(l));
    else {
      const e3 = l[l.length - 1] || "";
      t.isOnComposition = !Gt(e3);
    }
  }, onOptionCreate: (e2) => {
    t.optionsCount++, t.filteredOptionsCount++, t.options.set(e2.value, e2), t.cachedOptions.set(e2.value, e2);
  }, onOptionDestroy: (e2) => {
    t.optionsCount--, t.filteredOptionsCount--, t.options.delete(e2);
  }, handleMenuEnter: () => {
    nextTick(() => K(t.selected));
  }, handleFocus: (l) => {
    t.softFocus ? t.softFocus = false : ((e.automaticDropdown || e.filterable) && (t.visible = true, e.filterable && (t.menuVisibleOnFocus = true)), a.emit("focus", l));
  }, blur: () => {
    t.visible = false, r.value.blur();
  }, handleBlur: (e2) => {
    nextTick(() => {
      t.isSilentBlur ? t.isSilentBlur = false : a.emit("blur", e2);
    }), t.softFocus = false;
  }, handleClearClick: (e2) => {
    R(e2);
  }, handleClose: () => {
    t.visible = false;
  }, toggleMenu: q, selectOption: () => {
    t.visible ? x.value[t.hoverIndex] && H(x.value[t.hoverIndex], void 0) : q();
  }, getValueKey: (t2) => Me(t2.value) ? Fe(t2.value, e.valueKey) : t2.value, navigateOptions: G, dropMenuVisible: N, reference: r, input: s, popper: u, tags: d, selectWrapper: c, scrollbar: p2};
};
var qu = defineComponent({name: "ElSelect", componentName: "ElSelect", components: {ElInput: vl, ElSelectMenu: Ku, ElOption: ju, ElTag: lo, ElScrollbar: yl, ElPopper: Hl}, directives: {ClickOutside: $t}, props: {name: String, id: String, modelValue: [Array, String, Number, Boolean, Object], autocomplete: {type: String, default: "off"}, automaticDropdown: Boolean, size: {type: String, validator: Xt}, disabled: Boolean, clearable: Boolean, filterable: Boolean, allowCreate: Boolean, loading: Boolean, popperClass: {type: String, default: ""}, remote: Boolean, loadingText: String, noMatchText: String, noDataText: String, remoteMethod: Function, filterMethod: Function, multiple: Boolean, multipleLimit: {type: Number, default: 0}, placeholder: {type: String}, defaultFirstOption: Boolean, reserveKeyword: Boolean, valueKey: {type: String, default: "value"}, collapseTags: Boolean, popperAppendToBody: {type: Boolean, default: true}, clearIcon: {type: String, default: "el-icon-circle-close"}}, emits: [qt, "change", "remove-tag", "clear", "visible-change", "focus", "blur"], setup(e, t) {
  const l = function(e2) {
    const t2 = ae();
    return reactive({options: new Map(), cachedOptions: new Map(), createdLabel: null, createdSelected: false, selected: e2.multiple ? [] : {}, inputLength: 20, inputWidth: 0, initialInputHeight: 0, optionsCount: 0, filteredOptionsCount: 0, visible: false, softFocus: false, selectedLabel: "", hoverIndex: -1, query: "", previousQuery: null, inputHovering: false, cachedPlaceHolder: "", currentPlaceholder: ya("el.select.placeholder"), menuVisibleOnFocus: false, isOnComposition: false, isSilentBlur: false, selectEmitter: t2, prefixWidth: null, tagInMultiLine: false});
  }(e), {optionsArray: o, selectSize: s, readonly: u, handleResize: d, collapseTagSize: c, debouncedOnInputChange: p2, debouncedQueryChange: h2, deletePrevTag: v, deleteTag: m, deleteSelected: f, handleOptionSelect: g, scrollToOption: b, setSelected: y, resetInputHeight: k, managePlaceholder: C, showClose: x, selectDisabled: E, iconClass: M, showNewOption: T, emptyText: N, toggleLastOptionHitState: D, resetInputState: O, handleComposition: I, onOptionCreate: P, onOptionDestroy: V, handleMenuEnter: B, handleFocus: A, blur: L, handleBlur: z, handleClearClick: F, handleClose: $, toggleMenu: R, selectOption: H, getValueKey: W, navigateOptions: j, dropMenuVisible: K, reference: Y, input: q, popper: U, tags: G, selectWrapper: X, scrollbar: Z} = Yu(e, l, t), {focus: Q} = (J = Y, {focus: () => {
    var e2, t2;
    (t2 = (e2 = J.value) === null || e2 === void 0 ? void 0 : e2.focus) === null || t2 === void 0 || t2.call(e2);
  }});
  var J;
  const {inputWidth: ee, selected: te, inputLength: le, filteredOptionsCount: ne, visible: oe, softFocus: ie2, selectedLabel: re2, hoverIndex: se2, query: ue, inputHovering: de, currentPlaceholder: ce2, menuVisibleOnFocus: pe2, isOnComposition: he2, isSilentBlur: ve2, options: me2, cachedOptions: fe2, optionsCount: ge, prefixWidth: be, tagInMultiLine: ye2} = toRefs(l);
  provide("ElSelect", reactive({props: e, options: me2, optionsArray: o, cachedOptions: fe2, optionsCount: ge, filteredOptionsCount: ne, hoverIndex: se2, handleOptionSelect: g, selectEmitter: l.selectEmitter, onOptionCreate: P, onOptionDestroy: V, selectWrapper: X, selected: te, setSelected: y})), onMounted(() => {
    if (l.cachedPlaceHolder = ce2.value = e.placeholder || ya("el.select.placeholder"), e.multiple && Array.isArray(e.modelValue) && e.modelValue.length > 0 && (ce2.value = ""), pt(X.value, d), Y.value && Y.value.$el) {
      const e2 = {medium: 36, small: 32, mini: 28}, t2 = Y.value.input;
      l.initialInputHeight = t2.getBoundingClientRect().height || e2[s.value];
    }
    e.remote && e.multiple && k(), nextTick(() => {
      if (Y.value.$el && (ee.value = Y.value.$el.getBoundingClientRect().width), t.slots.prefix) {
        const e2 = Y.value.$el.childNodes, t2 = [].filter.call(e2, (e3) => e3.tagName === "INPUT")[0], a = Y.value.$el.querySelector(".el-input__prefix");
        be.value = Math.max(a.getBoundingClientRect().width + 5, 30), l.prefixWidth && (t2.style.paddingLeft = Math.max(l.prefixWidth, 30) + "px");
      }
    }), y();
  }), onBeforeUnmount(() => {
    ht(X.value, d);
  }), e.multiple && !Array.isArray(e.modelValue) && t.emit(qt, []), !e.multiple && Array.isArray(e.modelValue) && t.emit(qt, "");
  const ke2 = computed(() => {
    var e2;
    return (e2 = U.value) === null || e2 === void 0 ? void 0 : e2.popperRef;
  });
  return {tagInMultiLine: ye2, prefixWidth: be, selectSize: s, readonly: u, handleResize: d, collapseTagSize: c, debouncedOnInputChange: p2, debouncedQueryChange: h2, deletePrevTag: v, deleteTag: m, deleteSelected: f, handleOptionSelect: g, scrollToOption: b, inputWidth: ee, selected: te, inputLength: le, filteredOptionsCount: ne, visible: oe, softFocus: ie2, selectedLabel: re2, hoverIndex: se2, query: ue, inputHovering: de, currentPlaceholder: ce2, menuVisibleOnFocus: pe2, isOnComposition: he2, isSilentBlur: ve2, options: me2, resetInputHeight: k, managePlaceholder: C, showClose: x, selectDisabled: E, iconClass: M, showNewOption: T, emptyText: N, toggleLastOptionHitState: D, resetInputState: O, handleComposition: I, handleMenuEnter: B, handleFocus: A, blur: L, handleBlur: z, handleClearClick: F, handleClose: $, toggleMenu: R, selectOption: H, getValueKey: W, navigateOptions: j, dropMenuVisible: K, focus: Q, reference: Y, input: q, popper: U, popperPaneRef: ke2, tags: G, selectWrapper: X, scrollbar: Z};
}});
const Uu = {class: "select-trigger"}, Gu = {key: 0}, Xu = {class: "el-select__tags-text"}, Zu = {style: {height: "100%", display: "flex", "justify-content": "center", "align-items": "center"}}, Qu = {key: 1, class: "el-select-dropdown__empty"};
qu.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-tag"), r = resolveComponent("el-input"), f = resolveComponent("el-option"), y = resolveComponent("el-scrollbar"), k = resolveComponent("el-select-menu"), C = resolveComponent("el-popper"), x = resolveDirective("click-outside");
  return withDirectives((openBlock(), createBlock("div", {ref: "selectWrapper", class: ["el-select", [e.selectSize ? "el-select--" + e.selectSize : ""]], onClick: t[26] || (t[26] = withModifiers((...t2) => e.toggleMenu && e.toggleMenu(...t2), ["stop"]))}, [createVNode(C, {ref: "popper", visible: e.dropMenuVisible, "onUpdate:visible": t[25] || (t[25] = (t2) => e.dropMenuVisible = t2), placement: "bottom-start", "append-to-body": e.popperAppendToBody, "popper-class": "el-select__popper " + e.popperClass, "manual-mode": "", effect: "light", pure: "", trigger: "click", transition: "el-zoom-in-top", "stop-popper-mouse-event": false, "gpu-acceleration": false, onBeforeEnter: e.handleMenuEnter}, {trigger: withCtx(() => [createVNode("div", Uu, [e.multiple ? (openBlock(), createBlock("div", {key: 0, ref: "tags", class: "el-select__tags", style: {"max-width": e.inputWidth - 32 + "px", width: "100%"}}, [e.collapseTags && e.selected.length ? (openBlock(), createBlock("span", Gu, [createVNode(i, {closable: !e.selectDisabled && !e.selected[0].isDisabled, size: e.collapseTagSize, hit: e.selected[0].hitState, type: "info", "disable-transitions": "", onClose: t[1] || (t[1] = (t2) => e.deleteTag(t2, e.selected[0]))}, {default: withCtx(() => [createVNode("span", {class: "el-select__tags-text", style: {"max-width": e.inputWidth - 123 + "px"}}, toDisplayString(e.selected[0].currentLabel), 5)]), _: 1}, 8, ["closable", "size", "hit"]), e.selected.length > 1 ? (openBlock(), createBlock(i, {key: 0, closable: false, size: e.collapseTagSize, type: "info", "disable-transitions": ""}, {default: withCtx(() => [createVNode("span", Xu, "+ " + toDisplayString(e.selected.length - 1), 1)]), _: 1}, 8, ["size"])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createCommentVNode(" <div> "), e.collapseTags ? createCommentVNode("v-if", true) : (openBlock(), createBlock(Transition, {key: 1, onAfterLeave: e.resetInputHeight}, {default: withCtx(() => [createVNode("span", {style: {marginLeft: e.prefixWidth && e.selected.length ? e.prefixWidth + "px" : null}}, [(openBlock(true), createBlock(Fragment, null, renderList(e.selected, (t2) => (openBlock(), createBlock(i, {key: e.getValueKey(t2), closable: !e.selectDisabled && !t2.isDisabled, size: e.collapseTagSize, hit: t2.hitState, type: "info", "disable-transitions": "", onClose: (l2) => e.deleteTag(l2, t2)}, {default: withCtx(() => [createVNode("span", {class: "el-select__tags-text", style: {"max-width": e.inputWidth - 75 + "px"}}, toDisplayString(t2.currentLabel), 5)]), _: 2}, 1032, ["closable", "size", "hit", "onClose"]))), 128))], 4)]), _: 1}, 8, ["onAfterLeave"])), createCommentVNode(" </div> "), e.filterable ? withDirectives((openBlock(), createBlock("input", {key: 2, ref: "input", "onUpdate:modelValue": t[2] || (t[2] = (t2) => e.query = t2), type: "text", class: ["el-select__input", [e.selectSize ? "is-" + e.selectSize : ""]], disabled: e.selectDisabled, autocomplete: e.autocomplete, style: {marginLeft: e.prefixWidth && !e.selected.length || e.tagInMultiLine ? e.prefixWidth + "px" : null, flexGrow: "1", width: e.inputLength / (e.inputWidth - 32) + "%", maxWidth: e.inputWidth - 42 + "px"}, onFocus: t[3] || (t[3] = (...t2) => e.handleFocus && e.handleFocus(...t2)), onBlur: t[4] || (t[4] = (...t2) => e.handleBlur && e.handleBlur(...t2)), onKeyup: t[5] || (t[5] = (...t2) => e.managePlaceholder && e.managePlaceholder(...t2)), onKeydown: [t[6] || (t[6] = (...t2) => e.resetInputState && e.resetInputState(...t2)), t[7] || (t[7] = withKeys(withModifiers((t2) => e.navigateOptions("next"), ["prevent"]), ["down"])), t[8] || (t[8] = withKeys(withModifiers((t2) => e.navigateOptions("prev"), ["prevent"]), ["up"])), t[9] || (t[9] = withKeys(withModifiers((t2) => e.visible = false, ["stop", "prevent"]), ["esc"])), t[10] || (t[10] = withKeys(withModifiers((...t2) => e.selectOption && e.selectOption(...t2), ["stop", "prevent"]), ["enter"])), t[11] || (t[11] = withKeys((...t2) => e.deletePrevTag && e.deletePrevTag(...t2), ["delete"])), t[12] || (t[12] = withKeys((t2) => e.visible = false, ["tab"]))], onCompositionstart: t[13] || (t[13] = (...t2) => e.handleComposition && e.handleComposition(...t2)), onCompositionupdate: t[14] || (t[14] = (...t2) => e.handleComposition && e.handleComposition(...t2)), onCompositionend: t[15] || (t[15] = (...t2) => e.handleComposition && e.handleComposition(...t2)), onInput: t[16] || (t[16] = (...t2) => e.debouncedQueryChange && e.debouncedQueryChange(...t2))}, null, 46, ["disabled", "autocomplete"])), [[vModelText, e.query]]) : createCommentVNode("v-if", true)], 4)) : createCommentVNode("v-if", true), createVNode(r, {id: e.id, ref: "reference", modelValue: e.selectedLabel, "onUpdate:modelValue": t[18] || (t[18] = (t2) => e.selectedLabel = t2), type: "text", placeholder: e.currentPlaceholder, name: e.name, autocomplete: e.autocomplete, size: e.selectSize, disabled: e.selectDisabled, readonly: e.readonly, "validate-event": false, class: {"is-focus": e.visible}, tabindex: e.multiple && e.filterable ? "-1" : null, onFocus: e.handleFocus, onBlur: e.handleBlur, onInput: e.debouncedOnInputChange, onPaste: e.debouncedOnInputChange, onKeydown: [t[19] || (t[19] = withKeys(withModifiers((t2) => e.navigateOptions("next"), ["stop", "prevent"]), ["down"])), t[20] || (t[20] = withKeys(withModifiers((t2) => e.navigateOptions("prev"), ["stop", "prevent"]), ["up"])), withKeys(withModifiers(e.selectOption, ["stop", "prevent"]), ["enter"]), t[21] || (t[21] = withKeys(withModifiers((t2) => e.visible = false, ["stop", "prevent"]), ["esc"])), t[22] || (t[22] = withKeys((t2) => e.visible = false, ["tab"]))], onMouseenter: t[23] || (t[23] = (t2) => e.inputHovering = true), onMouseleave: t[24] || (t[24] = (t2) => e.inputHovering = false)}, createSlots({suffix: withCtx(() => [withDirectives(createVNode("i", {class: ["el-select__caret", "el-input__icon", "el-icon-" + e.iconClass]}, null, 2), [[vShow, !e.showClose]]), e.showClose ? (openBlock(), createBlock("i", {key: 0, class: "el-select__caret el-input__icon " + e.clearIcon, onClick: t[17] || (t[17] = (...t2) => e.handleClearClick && e.handleClearClick(...t2))}, null, 2)) : createCommentVNode("v-if", true)]), _: 2}, [e.$slots.prefix ? {name: "prefix", fn: withCtx(() => [createVNode("div", Zu, [renderSlot(e.$slots, "prefix")])])} : void 0]), 1032, ["id", "modelValue", "placeholder", "name", "autocomplete", "size", "disabled", "readonly", "class", "tabindex", "onFocus", "onBlur", "onInput", "onPaste", "onKeydown"])])]), default: withCtx(() => [createVNode(k, null, {default: withCtx(() => [withDirectives(createVNode(y, {ref: "scrollbar", tag: "ul", "wrap-class": "el-select-dropdown__wrap", "view-class": "el-select-dropdown__list", class: {"is-empty": !e.allowCreate && e.query && e.filteredOptionsCount === 0}}, {default: withCtx(() => [e.showNewOption ? (openBlock(), createBlock(f, {key: 0, value: e.query, created: true}, null, 8, ["value"])) : createCommentVNode("v-if", true), renderSlot(e.$slots, "default")]), _: 3}, 8, ["class"]), [[vShow, e.options.size > 0 && !e.loading]]), e.emptyText && (!e.allowCreate || e.loading || e.allowCreate && e.options.size === 0) ? (openBlock(), createBlock(Fragment, {key: 0}, [e.$slots.empty ? renderSlot(e.$slots, "empty", {key: 0}) : (openBlock(), createBlock("p", Qu, toDisplayString(e.emptyText), 1))], 2112)) : createCommentVNode("v-if", true)]), _: 3})]), _: 1}, 8, ["visible", "append-to-body", "popper-class", "onBeforeEnter"])], 2)), [[x, e.handleClose, e.popperPaneRef]]);
}, qu.__file = "packages/select/src/select.vue", qu.install = (e) => {
  e.component(qu.name, qu);
};
const Ju = qu, ed = ju;
ed.install = (e) => {
  e.component(ed.name, ed);
};
var td = defineComponent({name: "ElOptionGroup", componentName: "ElOptionGroup", props: {label: String, disabled: {type: Boolean, default: false}}, setup(e) {
  const t = ref(true);
  provide("ElSelectGroup", reactive(Object.assign({}, toRefs(e))));
  const n = inject("ElSelect");
  return n.selectEmitter.on(Hu, () => {
    var e2;
    t.value = (e2 = n == null ? void 0 : n.optionsArray) === null || e2 === void 0 ? void 0 : e2.some((e3) => e3.visible === true);
  }), {visible: t};
}});
const ld = {class: "el-select-group__wrap"}, ad = {class: "el-select-group__title"}, nd = {class: "el-select-group"};
td.render = function(e, t, l, a, n, o) {
  return withDirectives((openBlock(), createBlock("ul", ld, [createVNode("li", ad, toDisplayString(e.label), 1), createVNode("li", null, [createVNode("ul", nd, [renderSlot(e.$slots, "default")])])], 512)), [[vShow, e.visible]]);
}, td.__file = "packages/select/src/option-group.vue", td.install = (e) => {
  e.component(td.name, td);
};
const od = td;
var id = defineComponent({name: "ElPageHeader", props: {icon: {type: String, default: "el-icon-back"}, title: {type: String, default: () => ya("el.pageHeader.title")}, content: {type: String, default: ""}}, emits: ["back"], setup: (e, {emit: t}) => ({handleClick: function() {
  t("back");
}})});
const rd = {class: "el-page-header"}, sd = {key: 0, class: "el-page-header__icon"}, ud = {class: "el-page-header__title"}, dd = {class: "el-page-header__content"};
id.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", rd, [createVNode("div", {class: "el-page-header__left", onClick: t[1] || (t[1] = (...t2) => e.handleClick && e.handleClick(...t2))}, [e.icon || e.$slots.icon ? (openBlock(), createBlock("div", sd, [renderSlot(e.$slots, "icon", {}, () => [createVNode("i", {class: e.icon}, null, 2)])])) : createCommentVNode("v-if", true), createVNode("div", ud, [renderSlot(e.$slots, "title", {}, () => [createTextVNode(toDisplayString(e.title), 1)])])]), createVNode("div", dd, [renderSlot(e.$slots, "content", {}, () => [createTextVNode(toDisplayString(e.content), 1)])])]);
}, id.__file = "packages/page-header/src/index.vue", id.install = (e) => {
  e.component(id.name, id);
};
const cd = id;
var pd = defineComponent({name: "Prev", props: {disabled: Boolean, currentPage: {type: Number, default: 1}, prevText: {type: String, default: ""}}, setup: (e) => ({internalDisabled: computed(() => e.disabled || e.currentPage <= 1)})});
const hd = {key: 0}, vd = {key: 1, class: "el-icon el-icon-arrow-left"};
pd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("button", {type: "button", class: "btn-prev", disabled: e.internalDisabled, onClick: t[1] || (t[1] = withModifiers(() => {
  }, ["self", "prevent"]))}, [e.prevText ? (openBlock(), createBlock("span", hd, toDisplayString(e.prevText), 1)) : (openBlock(), createBlock("i", vd))], 8, ["disabled"]);
}, pd.__file = "packages/pagination/src/prev.vue";
var md = defineComponent({name: "Next", props: {disabled: Boolean, currentPage: {type: Number, default: 1}, pageCount: {type: Number, default: 50}, nextText: {type: String, default: ""}}, setup: (e) => ({internalDisabled: computed(() => e.disabled || e.currentPage === e.pageCount || e.pageCount === 0)})});
const fd = {key: 0}, gd = {key: 1, class: "el-icon el-icon-arrow-right"};
md.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("button", {type: "button", class: "btn-next", disabled: e.internalDisabled, onClick: t[1] || (t[1] = withModifiers(() => {
  }, ["self", "prevent"]))}, [e.nextText ? (openBlock(), createBlock("span", fd, toDisplayString(e.nextText), 1)) : (openBlock(), createBlock("i", gd))], 8, ["disabled"]);
}, md.__file = "packages/pagination/src/next.vue";
const bd = () => {
  const e = inject("pagination", {});
  return {pagination: e, pageCount: e.pageCount, disabled: e.disabled, currentPage: e.currentPage};
};
var yd = defineComponent({name: "Sizes", components: {ElSelect: Ju, ElOption: ed}, props: {pageSize: Number, pageSizes: {type: Array, default: () => [10, 20, 30, 40, 50, 100]}, popperClass: {type: String, default: ""}, disabled: Boolean}, emits: ["page-size-change"], setup(e, {emit: t}) {
  const {pagination: a} = bd(), i = ref(e.pageSize);
  watch(() => e.pageSizes, (l, a2) => {
    if (!isEqual_1(l, a2) && Array.isArray(l)) {
      const a3 = l.indexOf(e.pageSize) > -1 ? e.pageSize : e.pageSizes[0];
      t("page-size-change", a3);
    }
  }), watch(() => e.pageSize, (e2) => {
    i.value = e2;
  });
  const r = computed(() => e.pageSizes);
  return {t: ya, innerPagesizes: r, innerPageSize: i, handleChange: function(e2) {
    e2 !== i.value && (i.value = e2, a == null || a.handleSizesChange(Number(e2)));
  }};
}});
const kd = {class: "el-pagination__sizes"};
yd.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-option"), r = resolveComponent("el-select");
  return openBlock(), createBlock("span", kd, [createVNode(r, {"model-value": e.innerPageSize, disabled: e.disabled, "popper-class": e.popperClass, size: "mini", onChange: e.handleChange}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.innerPagesizes, (t2) => (openBlock(), createBlock(i, {key: t2, value: t2, label: t2 + e.t("el.pagination.pagesize")}, null, 8, ["value", "label"]))), 128))]), _: 1}, 8, ["model-value", "disabled", "popper-class", "onChange"])]);
}, yd.__file = "packages/pagination/src/sizes.vue";
var Cd = defineComponent({components: {ElInput: vl}, setup() {
  const {pagination: e, pageCount: t, disabled: a, currentPage: o} = bd(), i = ref(null), r = computed(() => {
    var e2;
    return (e2 = i.value) !== null && e2 !== void 0 ? e2 : o.value;
  });
  return {t: ya, userInput: i, pageCount: t, disabled: a, handleInput: function(e2) {
    i.value = Number(e2);
  }, handleChange: function(t2) {
    e == null || e.changeEvent(Number(t2)), i.value = null;
  }, innerValue: r};
}});
const xd = {class: "el-pagination__jump"};
Cd.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input");
  return openBlock(), createBlock("span", xd, [createTextVNode(toDisplayString(e.t("el.pagination.goto")) + " ", 1), createVNode(i, {size: "mini", class: "el-pagination__editor is-in-pagination", min: 1, max: e.pageCount, disabled: e.disabled, "model-value": e.innerValue, type: "number", "onUpdate:modelValue": e.handleInput, onChange: e.handleChange}, null, 8, ["max", "disabled", "model-value", "onUpdate:modelValue", "onChange"]), createTextVNode(" " + toDisplayString(e.t("el.pagination.pageClassifier")), 1)]);
}, Cd.__file = "packages/pagination/src/jumper.vue";
var wd = defineComponent({name: "Total", props: {total: {type: Number, default: 1e3}}, setup: () => ({t: ya})});
const _d = {class: "el-pagination__total"};
wd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("span", _d, toDisplayString(e.t("el.pagination.total", {total: e.total})), 1);
}, wd.__file = "packages/pagination/src/total.vue";
var Sd = defineComponent({name: "ElPager", props: {currentPage: {type: Number, default: 1}, pageCount: {type: Number}, pagerCount: {type: Number, default: 7}, disabled: Boolean}, emits: ["change"], setup(e, {emit: t}) {
  const a = ref(false), o = ref(false), i = ref("el-icon-more"), r = ref("el-icon-more"), s = computed(() => {
    const t2 = e.pagerCount, l = (t2 - 1) / 2, a2 = Number(e.currentPage), n = Number(e.pageCount);
    let o2 = false, i2 = false;
    n > t2 && (a2 > t2 - l && (o2 = true), a2 < n - l && (i2 = true));
    const r2 = [];
    if (o2 && !i2) {
      for (let e2 = n - (t2 - 2); e2 < n; e2++)
        r2.push(e2);
    } else if (!o2 && i2)
      for (let e2 = 2; e2 < t2; e2++)
        r2.push(e2);
    else if (o2 && i2) {
      const e2 = Math.floor(t2 / 2) - 1;
      for (let t3 = a2 - e2; t3 <= a2 + e2; t3++)
        r2.push(t3);
    } else
      for (let e2 = 2; e2 < n; e2++)
        r2.push(e2);
    return r2;
  });
  return watchEffect(() => {
    const t2 = (e.pagerCount - 1) / 2;
    a.value = false, o.value = false, e.pageCount > e.pagerCount && (e.currentPage > e.pagerCount - t2 && (a.value = true), e.currentPage < e.pageCount - t2 && (o.value = true));
  }), watchEffect(() => {
    a.value || (r.value = "el-icon-more");
  }), watchEffect(() => {
    o.value || (i.value = "el-icon-more");
  }), {showPrevMore: a, showNextMore: o, quicknextIconClass: i, quickprevIconClass: r, pagers: s, onMouseenter: function(t2) {
    e.disabled || (t2 === "left" ? r.value = "el-icon-d-arrow-left" : i.value = "el-icon-d-arrow-right");
  }, onPagerClick: function(l) {
    const a2 = l.target;
    if (a2.tagName.toLowerCase() === "ul" || e.disabled)
      return;
    let n = Number(a2.textContent);
    const o2 = e.pageCount, i2 = e.currentPage, r2 = e.pagerCount - 2;
    a2.className.includes("more") && (a2.className.includes("quickprev") ? n = i2 - r2 : a2.className.includes("quicknext") && (n = i2 + r2)), isNaN(n) || (n < 1 && (n = 1), n > o2 && (n = o2)), n !== i2 && t("change", n);
  }};
}});
Sd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("ul", {class: "el-pager", onClick: t[5] || (t[5] = (...t2) => e.onPagerClick && e.onPagerClick(...t2))}, [e.pageCount > 0 ? (openBlock(), createBlock("li", {key: 0, class: [{active: e.currentPage === 1, disabled: e.disabled}, "number"]}, " 1 ", 2)) : createCommentVNode("v-if", true), e.showPrevMore ? (openBlock(), createBlock("li", {key: 1, class: ["el-icon more btn-quickprev", [e.quickprevIconClass, {disabled: e.disabled}]], onMouseenter: t[1] || (t[1] = (t2) => e.onMouseenter("left")), onMouseleave: t[2] || (t[2] = (t2) => e.quickprevIconClass = "el-icon-more")}, null, 34)) : createCommentVNode("v-if", true), (openBlock(true), createBlock(Fragment, null, renderList(e.pagers, (t2) => (openBlock(), createBlock("li", {key: t2, class: [{active: e.currentPage === t2, disabled: e.disabled}, "number"]}, toDisplayString(t2), 3))), 128)), e.showNextMore ? (openBlock(), createBlock("li", {key: 2, class: ["el-icon more btn-quicknext", [e.quicknextIconClass, {disabled: e.disabled}]], onMouseenter: t[3] || (t[3] = (t2) => e.onMouseenter("right")), onMouseleave: t[4] || (t[4] = (t2) => e.quicknextIconClass = "el-icon-more")}, null, 34)) : createCommentVNode("v-if", true), e.pageCount > 1 ? (openBlock(), createBlock("li", {key: 3, class: [{active: e.currentPage === e.pageCount, disabled: e.disabled}, "number"]}, toDisplayString(e.pageCount), 3)) : createCommentVNode("v-if", true)]);
}, Sd.__file = "packages/pagination/src/pager.vue";
const Ed = (e) => Number.isNaN(e) ? 10 : e;
const Md = defineComponent({name: "ElPagination", components: {Prev: pd, Next: md, Sizes: yd, Jumper: Cd, Total: wd, Pager: Sd}, props: {pageSize: {type: Number, default: 10}, small: Boolean, total: {type: Number}, pageCount: {type: Number}, pagerCount: {type: Number, validator: (e) => (0 | e) === e && e > 4 && e < 22 && e % 2 == 1, default: 7}, currentPage: {type: Number, default: 1}, layout: {type: String, default: "prev, pager, next, jumper, ->, total"}, pageSizes: {type: Array, default: () => [10, 20, 30, 40, 50, 100]}, popperClass: {type: String, default: ""}, prevText: {type: String, default: ""}, nextText: {type: String, default: ""}, background: Boolean, disabled: Boolean, hideOnSinglePage: Boolean}, emits: ["size-change", "current-change", "prev-click", "next-click", "update:currentPage", "update:pageSize"], setup(e, {emit: t}) {
  const a = ref(-1), i = ref(false), r = ref(Ed(e.pageSize)), s = computed(() => typeof e.total == "number" ? Math.max(1, Math.ceil(e.total / r.value)) : typeof e.pageCount == "number" ? Math.max(1, e.pageCount) : null), u = ref(p2(e.currentPage));
  function d() {
    (u.value !== a.value || i.value) && (a.value = u.value, i.value = false, t("update:currentPage", u.value), t("current-change", u.value));
  }
  function c(e2) {
    u.value = p2(e2), i.value = true, d();
  }
  function p2(e2) {
    let t2;
    return typeof e2 == "string" && (e2 = parseInt(e2, 10)), isNaN(e2) || e2 < 1 ? t2 = 1 : s.value < e2 && (t2 = s.value), t2 != null ? t2 : e2;
  }
  return watch(() => e.currentPage, (e2) => {
    u.value = p2(e2);
  }), watch(() => e.pageSize, (e2) => {
    r.value = Ed(e2);
  }), watch(() => s.value, (e2) => {
    const t2 = u.value;
    e2 > 0 && t2 === 0 ? u.value = 1 : t2 > e2 && (u.value = e2 === 0 ? 1 : e2, d());
  }), provide("pagination", {pageCount: computed(() => e.pageCount), disabled: computed(() => e.disabled), currentPage: computed(() => u.value), changeEvent: c, handleSizesChange: function(e2) {
    i.value = true, r.value = e2, t("update:pageSize", e2), t("size-change", e2);
  }}), {internalCurrentPage: u, internalPageSize: r, lastEmittedPage: a, userChangePageSize: i, internalPageCount: s, getValidCurrentPage: p2, emitChange: d, handleCurrentChange: c, prev: function() {
    if (e.disabled)
      return;
    const l = u.value - 1;
    u.value = p2(l), t("prev-click", u.value), d();
  }, next: function() {
    if (e.disabled)
      return;
    const l = u.value + 1;
    u.value = p2(l), t("next-click", u.value), d();
  }};
}, render() {
  var e, t, l;
  const a = this.layout;
  if (!a)
    return null;
  if (this.hideOnSinglePage && this.internalPageCount <= 1)
    return null;
  const n = h("div", {class: ["el-pagination", {"is-background": this.background, "el-pagination--small": this.small}]}), o = [], i = [], r = h("div", {class: "el-pagination__rightwrapper"}, i), s = {prev: h(pd, {disabled: this.disabled, currentPage: this.internalCurrentPage, prevText: this.prevText, onClick: this.prev}), jumper: h(Cd), pager: h(Sd, {currentPage: this.internalCurrentPage, pageCount: this.internalPageCount, pagerCount: this.pagerCount, onChange: this.handleCurrentChange, disabled: this.disabled}), next: h(md, {disabled: this.disabled, currentPage: this.internalCurrentPage, pageCount: this.internalPageCount, nextText: this.nextText, onClick: this.next}), sizes: h(yd, {pageSize: this.pageSize, pageSizes: this.pageSizes, popperClass: this.popperClass, disabled: this.disabled}), slot: (l = (t = (e = this.$slots) === null || e === void 0 ? void 0 : e.default) === null || t === void 0 ? void 0 : t.call(e)) !== null && l !== void 0 ? l : null, total: h(wd, {total: this.total})}, u = a.split(",").map((e2) => e2.trim());
  let d = false;
  return u.forEach((e2) => {
    e2 !== "->" ? d ? i.push(s[e2]) : o.push(s[e2]) : d = true;
  }), d && i.length > 0 && o.unshift(r), h(n, {}, o);
}});
Md.install = (e) => {
  e.component(Md.name, Md);
};
var Td = defineComponent({name: "ElPopconfirm", components: {ElButton: pa, ElPopper: Hl}, props: {title: {type: String}, confirmButtonText: {type: String}, cancelButtonText: {type: String}, confirmButtonType: {type: String, default: "primary"}, cancelButtonType: {type: String, default: "text"}, icon: {type: String, default: "el-icon-question"}, iconColor: {type: String, default: "#f90"}, hideIcon: {type: Boolean, default: false}}, emits: ["confirm", "cancel"], setup(e, {emit: t}) {
  const a = ref(false), o = computed(() => e.confirmButtonText || ya("el.popconfirm.confirmButtonText")), i = computed(() => e.cancelButtonText || ya("el.popconfirm.cancelButtonText"));
  return {visible: a, confirm: () => {
    a.value = false, t("confirm");
  }, cancel: () => {
    a.value = false, t("cancel");
  }, confirmButtonText_: o, cancelButtonText_: i};
}});
const Nd = {class: "el-popconfirm"}, Dd = {class: "el-popconfirm__main"}, Od = {class: "el-popconfirm__action"};
Td.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-button"), r = resolveComponent("el-popper");
  return openBlock(), createBlock(r, {visible: e.visible, "onUpdate:visible": t[1] || (t[1] = (t2) => e.visible = t2), trigger: "click", effect: "light", "popper-class": "el-popover", "append-to-body": ""}, {trigger: withCtx(() => [renderSlot(e.$slots, "reference")]), default: withCtx(() => [createVNode("div", Nd, [createVNode("p", Dd, [e.hideIcon ? createCommentVNode("v-if", true) : (openBlock(), createBlock("i", {key: 0, class: [e.icon, "el-popconfirm__icon"], style: {color: e.iconColor}}, null, 6)), createTextVNode(" " + toDisplayString(e.title), 1)]), createVNode("div", Od, [createVNode(i, {size: "mini", type: e.cancelButtonType, onClick: e.cancel}, {default: withCtx(() => [createTextVNode(toDisplayString(e.cancelButtonText_), 1)]), _: 1}, 8, ["type", "onClick"]), createVNode(i, {size: "mini", type: e.confirmButtonType, onClick: e.confirm}, {default: withCtx(() => [createTextVNode(toDisplayString(e.confirmButtonText_), 1)]), _: 1}, 8, ["type", "onClick"])])])]), _: 1}, 8, ["visible"]);
}, Td.__file = "packages/popconfirm/src/index.vue", Td.install = (e) => {
  e.component(Td.name, Td);
};
const Id = Td;
const Pd = ["update:visible", "after-enter", "after-leave", "show", "hide"], Vd = {key: 0, class: "el-popover__title", role: "title"};
var Bd = defineComponent({name: "ElPopover", components: {ElPopper: Hl}, props: Object.assign(Object.assign({}, Al), {content: {type: String}, trigger: {type: String, default: "click"}, title: {type: String}, transition: {type: String, default: "fade-in-linear"}, width: {type: [String, Number], default: 150}, appendToBody: {type: Boolean, default: true}, tabindex: Number}), emits: Pd, setup(e, t) {
  return function(e2, t2) {
    const a = ref(Pl.nextZIndex()), i = computed(() => Ee(e2.width) ? e2.width : e2.width + "px"), r = computed(() => ({width: i.value, zIndex: a.value})), s = Ll(e2, t2);
    return watch(s.visibility, (e3) => {
      e3 && (a.value = Pl.nextZIndex()), t2.emit(e3 ? "show" : "hide");
    }), Object.assign(Object.assign({}, s), {popperStyle: r});
  }(e, t);
}, render() {
  const {$slots: e} = this, t = e.reference ? e.reference() : null, l = (a = this.title, n = "div", o = Vd, i = toDisplayString(this.title), r = kl.TEXT, a ? Sl(n, o, i, r, s) : createCommentVNode("v-if", true));
  var a, n, o, i, r, s;
  const u = renderSlot(e, "default", {}, () => [createTextVNode(toDisplayString(this.content), kl.TEXT)]), {events: p2, onAfterEnter: h2, onAfterLeave: b, onPopperMouseEnter: y, onPopperMouseLeave: k, popperStyle: C, popperId: x, popperClass: w, showArrow: _, transition: S, visibility: E, tabindex: M} = this, N = [this.content ? "el-popover--plain" : "", "el-popover", w].join(" ");
  let D = zl({effect: Bl.LIGHT, name: S, popperClass: N, popperStyle: C, popperId: x, visibility: E, onMouseenter: y, onMouseleave: k, onAfterEnter: h2, onAfterLeave: b, stopPopperMouseEvent: false}, [l, u, $l(_)]);
  const O = t ? Fl(t, Object.assign({ariaDescribedby: x, ref: "triggerRef", tabindex: M}, p2)) : createCommentVNode("v-if", true);
  return Sl(Fragment, null, [this.trigger === "click" ? withDirectives(O, [[$t, this.hide]]) : O, createVNode(Teleport, {disabled: !this.appendToBody, to: "body"}, [D], kl.PROPS, ["disabled"])]);
}});
Bd.__file = "packages/popover/src/index.vue";
const Ad = (e, t, l) => {
  const a = t.arg || t.value, n = l.dirs[0].instance.$refs[a];
  n && (n.triggerRef = e, e.setAttribute("tabindex", n.tabindex), Object.entries(n.events).forEach(([t2, l2]) => {
    tt(e, t2.toLowerCase().slice(2), l2);
  }));
};
var Ld = {mounted(e, t, l) {
  Ad(e, t, l);
}, updated(e, t, l) {
  Ad(e, t, l);
}};
Bd.install = (e) => {
  e.component(Bd.name, Bd), e.directive("popover", Ld);
}, Bd.directive = Ld;
const zd = Bd;
var Fd = defineComponent({name: "ElProgress", props: {type: {type: String, default: "line", validator: (e) => ["line", "circle", "dashboard"].indexOf(e) > -1}, percentage: {type: Number, default: 0, required: true, validator: (e) => e >= 0 && e <= 100}, status: {type: String, default: "", validator: (e) => ["", "success", "exception", "warning"].indexOf(e) > -1}, indeterminate: {type: Boolean, default: false}, duration: {type: Number, default: 3}, strokeWidth: {type: Number, default: 6}, strokeLinecap: {type: String, default: "round"}, textInside: {type: Boolean, default: false}, width: {type: Number, default: 126}, showText: {type: Boolean, default: true}, color: {type: [String, Array, Function], default: ""}, format: {type: Function, default: (e) => e + "%"}}, setup(e) {
  const t = computed(() => ({width: e.percentage + "%", animationDuration: e.duration + "s", backgroundColor: m(e.percentage)})), l = computed(() => (e.strokeWidth / e.width * 100).toFixed(1)), a = computed(() => e.type === "circle" || e.type === "dashboard" ? parseInt("" + (50 - parseFloat(l.value) / 2), 10) : 0), o = computed(() => {
    const t2 = a.value, l2 = e.type === "dashboard";
    return `
          M 50 50
          m 0 ${l2 ? "" : "-"}${t2}
          a ${t2} ${t2} 0 1 1 0 ${l2 ? "-" : ""}${2 * t2}
          a ${t2} ${t2} 0 1 1 0 ${l2 ? "" : "-"}${2 * t2}
          `;
  }), i = computed(() => 2 * Math.PI * a.value), r = computed(() => e.type === "dashboard" ? 0.75 : 1), s = computed(() => -1 * i.value * (1 - r.value) / 2 + "px"), u = computed(() => ({strokeDasharray: `${i.value * r.value}px, ${i.value}px`, strokeDashoffset: s.value})), d = computed(() => ({strokeDasharray: `${i.value * r.value * (e.percentage / 100)}px, ${i.value}px`, strokeDashoffset: s.value, transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease"})), c = computed(() => {
    let t2;
    if (e.color)
      t2 = m(e.percentage);
    else
      switch (e.status) {
        case "success":
          t2 = "#13ce66";
          break;
        case "exception":
          t2 = "#ff4949";
          break;
        case "warning":
          t2 = "#e6a23c";
          break;
        default:
          t2 = "#20a0ff";
      }
    return t2;
  }), p2 = computed(() => e.status === "warning" ? "el-icon-warning" : e.type === "line" ? e.status === "success" ? "el-icon-circle-check" : "el-icon-circle-close" : e.status === "success" ? "el-icon-check" : "el-icon-close"), h2 = computed(() => e.type === "line" ? 12 + 0.4 * e.strokeWidth : 0.111111 * e.width + 2), v = computed(() => e.format(e.percentage)), m = (t2) => {
    var l2;
    const {color: a2} = e;
    if (typeof a2 == "function")
      return a2(t2);
    if (typeof a2 == "string")
      return a2;
    {
      const e2 = 100 / a2.length, n = a2.map((t3, l3) => typeof t3 == "string" ? {color: t3, percentage: (l3 + 1) * e2} : t3).sort((e3, t3) => e3.percentage - t3.percentage);
      for (let e3 = 0; e3 < n.length; e3++)
        if (n[e3].percentage > t2)
          return n[e3].color;
      return (l2 = n[n.length - 1]) === null || l2 === void 0 ? void 0 : l2.color;
    }
  }, f = computed(() => ({percentage: e.percentage}));
  return {barStyle: t, relativeStrokeWidth: l, radius: a, trackPath: o, perimeter: i, rate: r, strokeDashoffset: s, trailPathStyle: u, circlePathStyle: d, stroke: c, iconClass: p2, progressTextSize: h2, content: v, getCurrentColor: m, slotData: f};
}});
const $d = {key: 0, class: "el-progress-bar"}, Rd = {key: 0, class: "el-progress-bar__innerText"}, Hd = {viewBox: "0 0 100 100"}, Wd = {key: 0};
Fd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-progress", ["el-progress--" + e.type, e.status ? "is-" + e.status : "", {"el-progress--without-text": !e.showText, "el-progress--text-inside": e.textInside}]], role: "progressbar", "aria-valuenow": e.percentage, "aria-valuemin": "0", "aria-valuemax": "100"}, [e.type === "line" ? (openBlock(), createBlock("div", $d, [createVNode("div", {class: "el-progress-bar__outer", style: {height: e.strokeWidth + "px"}}, [createVNode("div", {class: ["el-progress-bar__inner", {"el-progress-bar__inner--indeterminate": e.indeterminate}], style: e.barStyle}, [(e.showText || e.$slots.default) && e.textInside ? (openBlock(), createBlock("div", Rd, [renderSlot(e.$slots, "default", e.slotData, () => [createVNode("span", null, toDisplayString(e.content), 1)])])) : createCommentVNode("v-if", true)], 6)], 4)])) : (openBlock(), createBlock("div", {key: 1, class: "el-progress-circle", style: {height: e.width + "px", width: e.width + "px"}}, [(openBlock(), createBlock("svg", Hd, [createVNode("path", {class: "el-progress-circle__track", d: e.trackPath, stroke: "#e5e9f2", "stroke-width": e.relativeStrokeWidth, fill: "none", style: e.trailPathStyle}, null, 12, ["d", "stroke-width"]), createVNode("path", {class: "el-progress-circle__path", d: e.trackPath, stroke: e.stroke, fill: "none", "stroke-linecap": e.strokeLinecap, "stroke-width": e.percentage ? e.relativeStrokeWidth : 0, style: e.circlePathStyle}, null, 12, ["d", "stroke", "stroke-linecap", "stroke-width"])]))], 4)), !e.showText && !e.$slots.default || e.textInside ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", {key: 2, class: "el-progress__text", style: {fontSize: e.progressTextSize + "px"}}, [renderSlot(e.$slots, "default", e.slotData, () => [e.status ? (openBlock(), createBlock("i", {key: 1, class: e.iconClass}, null, 2)) : (openBlock(), createBlock("span", Wd, toDisplayString(e.content), 1))])], 4))], 10, ["aria-valuenow"]);
}, Fd.__file = "packages/progress/src/index.vue", Fd.install = (e) => {
  e.component(Fd.name, Fd);
};
const jd = Fd;
var Kd = defineComponent({name: "ElRadioButton", props: {label: {type: [String, Number, Boolean], default: ""}, disabled: Boolean, name: {type: String, default: ""}}, setup(e) {
  const {isGroup: t, radioGroup: l, elFormItemSize: a, ELEMENT: o, focus: i, elForm: r} = Tn(), s = computed(() => l.radioGroupSize || a.value || o.size), u = computed({get: () => l.modelValue, set(e2) {
    l.changeEvent(e2);
  }}), {isDisabled: d, tabIndex: c} = Nn(e, {model: u, elForm: r, radioGroup: l, isGroup: t});
  return {isGroup: t, size: s, isDisabled: d, tabIndex: c, value: u, focus: i, activeStyle: computed(() => ({backgroundColor: l.fill || "", borderColor: l.fill || "", boxShadow: l.fill ? "-1px 0 0 0 " + l.fill : "", color: l.textColor || ""}))};
}});
Kd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("label", {class: ["el-radio-button", [e.size ? "el-radio-button--" + e.size : "", {"is-active": e.value === e.label, "is-disabled": e.isDisabled, "is-focus": e.focus}]], role: "radio", "aria-checked": e.value === e.label, "aria-disabled": e.isDisabled, tabindex: e.tabIndex, onKeydown: t[5] || (t[5] = withKeys(withModifiers((t2) => e.value = e.isDisabled ? e.value : e.label, ["stop", "prevent"]), ["space"]))}, [withDirectives(createVNode("input", {"onUpdate:modelValue": t[1] || (t[1] = (t2) => e.value = t2), class: "el-radio-button__orig-radio", value: e.label, type: "radio", name: e.name, disabled: e.isDisabled, tabindex: "-1", onFocus: t[2] || (t[2] = (t2) => e.focus = true), onBlur: t[3] || (t[3] = (t2) => e.focus = false)}, null, 40, ["value", "name", "disabled"]), [[vModelRadio, e.value]]), createVNode("span", {class: "el-radio-button__inner", style: e.value === e.label ? e.activeStyle : null, onKeydown: t[4] || (t[4] = withModifiers(() => {
  }, ["stop"]))}, [renderSlot(e.$slots, "default", {}, () => [createTextVNode(toDisplayString(e.label), 1)])], 36)], 42, ["aria-checked", "aria-disabled", "tabindex"]);
}, Kd.__file = "packages/radio/src/radio-button.vue", Kd.install = (e) => {
  e.component(Kd.name, Kd);
};
const Yd = Kd;
var qd = defineComponent({name: "ElRadioGroup", componentName: "ElRadioGroup", props: {modelValue: {type: [String, Number, Boolean], default: ""}, size: {type: String, validator: Xt}, fill: {type: String, default: ""}, textColor: {type: String, default: ""}, disabled: Boolean}, emits: [qt, "change"], setup(e, t) {
  const r = ref(null), s = inject("elFormItem", {}), u = computed(() => e.size || s.size);
  provide("RadioGroup", reactive(Object.assign(Object.assign({name: "ElRadioGroup"}, toRefs(e)), {radioGroupSize: u, changeEvent: (e2) => {
    t.emit(qt, e2), nextTick(() => {
      t.emit("change", e2);
    });
  }}))), watch(() => e.modelValue, (e2) => {
    var t2;
    (t2 = s.formItemMitt) === null || t2 === void 0 || t2.emit("el.form.change", [e2]);
  });
  return onMounted(() => {
    const e2 = r.value.querySelectorAll("[type=radio]"), t2 = e2[0];
    !Array.from(e2).some((e3) => e3.checked) && t2 && (t2.tabIndex = 0);
  }), {handleKeydown: (e2) => {
    const t2 = e2.target, l = t2.nodeName === "INPUT" ? "[type=radio]" : "[role=radio]", a = r.value.querySelectorAll(l), n = a.length, o = Array.from(a).indexOf(t2), i = r.value.querySelectorAll("[role=radio]");
    let s2 = null;
    switch (e2.code) {
      case Dt.left:
      case Dt.up:
        e2.stopPropagation(), e2.preventDefault(), s2 = o === 0 ? n - 1 : o - 1;
        break;
      case Dt.right:
      case Dt.down:
        e2.stopPropagation(), e2.preventDefault(), s2 = o === n - 1 ? 0 : o + 1;
    }
    s2 !== null && (i[s2].click(), i[s2].focus());
  }, radioGroupSize: u, radioGroup: r};
}});
qd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {ref: "radioGroup", class: "el-radio-group", role: "radiogroup", onKeydown: t[1] || (t[1] = (...t2) => e.handleKeydown && e.handleKeydown(...t2))}, [renderSlot(e.$slots, "default")], 544);
}, qd.__file = "packages/radio/src/radio-group.vue", qd.install = (e) => {
  e.component(qd.name, qd);
};
const Ud = qd;
var Gd = defineComponent({name: "ElRate", props: {modelValue: {type: Number, default: 0}, lowThreshold: {type: Number, default: 2}, highThreshold: {type: Number, default: 4}, max: {type: Number, default: 5}, colors: {type: [Array, Object], default: () => ["#F7BA2A", "#F7BA2A", "#F7BA2A"]}, voidColor: {type: String, default: "#C6D1DE"}, disabledVoidColor: {type: String, default: "#EFF2F7"}, iconClasses: {type: [Array, Object], default: () => ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"]}, voidIconClass: {type: String, default: "el-icon-star-off"}, disabledVoidIconClass: {type: String, default: "el-icon-star-on"}, disabled: {type: Boolean, default: false}, allowHalf: {type: Boolean, default: false}, showText: {type: Boolean, default: false}, showScore: {type: Boolean, default: false}, textColor: {type: String, default: "#1f2d3d"}, texts: {type: Array, default: () => ["Extremely bad", "Disappointed", "Fair", "Satisfied", "Surprise"]}, scoreTemplate: {type: String, default: "{value}"}}, emits: ["update:modelValue", "change"], setup(e, {emit: t}) {
  const a = inject("elForm", {}), i = ref(e.modelValue), r = computed(() => e.disabled || a.disabled), s = computed(() => {
    let t2 = "";
    return e.showScore ? t2 = e.scoreTemplate.replace(/\{\s*value\s*\}/, r.value ? "" + e.modelValue : "" + i.value) : e.showText && (t2 = e.texts[Math.ceil(i.value) - 1]), t2;
  });
  function u(e2, t2) {
    const l = Object.keys(t2).filter((l2) => {
      const a3 = t2[l2];
      return !!Me(a3) && a3.excluded ? e2 < l2 : e2 <= l2;
    }).sort((e3, t3) => e3 - t3), a2 = t2[l[0]];
    return Me(a2) ? a2.value : a2 || "";
  }
  const d = computed(() => 100 * e.modelValue - 100 * Math.floor(e.modelValue)), c = computed(() => _e(e.colors) ? {[e.lowThreshold]: e.colors[0], [e.highThreshold]: {value: e.colors[1], excluded: true}, [e.max]: e.colors[2]} : e.colors), p2 = computed(() => u(i.value, c.value)), h2 = computed(() => {
    let t2 = "";
    return r.value ? t2 = d.value + "%" : e.allowHalf && (t2 = "50%"), {color: p2.value, width: t2};
  }), v = computed(() => _e(e.iconClasses) ? {[e.lowThreshold]: e.iconClasses[0], [e.highThreshold]: {value: e.iconClasses[1], excluded: true}, [e.max]: e.iconClasses[2]} : e.iconClasses), m = computed(() => u(e.modelValue, v.value)), f = computed(() => r.value ? e.disabledVoidIconClass : e.voidIconClass), g = computed(() => u(i.value, v.value)), b = computed(() => {
    let t2 = Array(e.max), l = i.value;
    return t2.fill(g.value, 0, l), t2.fill(f.value, l, e.max), t2;
  }), y = ref(true);
  watch(() => e.modelValue, (t2) => {
    i.value = t2, y.value = e.modelValue !== Math.floor(e.modelValue);
  });
  const k = ref(-1);
  return e.modelValue || t("update:modelValue", 0), {hoverIndex: k, currentValue: i, rateDisabled: r, text: s, decimalStyle: h2, decimalIconClass: m, classes: b, showDecimalIcon: function(t2) {
    let l = r.value && d.value > 0 && t2 - 1 < e.modelValue && t2 > e.modelValue, a2 = e.allowHalf && y.value && t2 - 0.5 <= i.value && t2 > i.value;
    return l || a2;
  }, getIconStyle: function(t2) {
    const l = r.value ? e.disabledVoidColor : e.voidColor;
    return {color: t2 <= i.value ? p2.value : l};
  }, selectValue: function(l) {
    r.value || (e.allowHalf && y.value ? (t("update:modelValue", i.value), t("change", i.value)) : (t("update:modelValue", l), t("change", l)));
  }, handleKey: function(l) {
    if (r.value)
      return;
    let a2 = i.value;
    const n = l.code;
    return n === Dt.up || n === Dt.right ? (e.allowHalf ? a2 += 0.5 : a2 += 1, l.stopPropagation(), l.preventDefault()) : n !== Dt.left && n !== Dt.down || (e.allowHalf ? a2 -= 0.5 : a2 -= 1, l.stopPropagation(), l.preventDefault()), a2 = a2 < 0 ? 0 : a2, a2 = a2 > e.max ? e.max : a2, t("update:modelValue", a2), t("change", a2), a2;
  }, setCurrentValue: function(t2, l) {
    if (!r.value) {
      if (e.allowHalf) {
        let e2 = l.target;
        at(e2, "el-rate__item") && (e2 = e2.querySelector(".el-rate__icon")), at(e2, "el-rate__decimal") && (e2 = e2.parentNode), y.value = 2 * l.offsetX <= e2.clientWidth, i.value = y.value ? t2 - 0.5 : t2;
      } else
        i.value = t2;
      k.value = t2;
    }
  }, resetCurrentValue: function() {
    r.value || (e.allowHalf && (y.value = e.modelValue !== Math.floor(e.modelValue)), i.value = e.modelValue, k.value = -1);
  }};
}});
Gd.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: "el-rate", role: "slider", "aria-valuenow": e.currentValue, "aria-valuetext": e.text, "aria-valuemin": "0", "aria-valuemax": e.max, tabindex: "0", onKeydown: t[2] || (t[2] = (...t2) => e.handleKey && e.handleKey(...t2))}, [(openBlock(true), createBlock(Fragment, null, renderList(e.max, (l2, a2) => (openBlock(), createBlock("span", {key: a2, class: "el-rate__item", style: {cursor: e.rateDisabled ? "auto" : "pointer"}, onMousemove: (t2) => e.setCurrentValue(l2, t2), onMouseleave: t[1] || (t[1] = (...t2) => e.resetCurrentValue && e.resetCurrentValue(...t2)), onClick: (t2) => e.selectValue(l2)}, [createVNode("i", {class: [[e.classes[l2 - 1], {hover: e.hoverIndex === l2}], "el-rate__icon"], style: e.getIconStyle(l2)}, [e.showDecimalIcon(l2) ? (openBlock(), createBlock("i", {key: 0, class: [e.decimalIconClass, "el-rate__decimal"], style: e.decimalStyle}, null, 6)) : createCommentVNode("v-if", true)], 6)], 44, ["onMousemove", "onClick"]))), 128)), e.showText || e.showScore ? (openBlock(), createBlock("span", {key: 0, class: "el-rate__text", style: {color: e.textColor}}, toDisplayString(e.text), 5)) : createCommentVNode("v-if", true)], 40, ["aria-valuenow", "aria-valuetext", "aria-valuemax"]);
}, Gd.__file = "packages/rate/src/index.vue", Gd.install = (e) => {
  e.component(Gd.name, Gd);
};
const Xd = Gd;
const Zd = defineComponent({name: "ElRow", props: {tag: {type: String, default: "div"}, gutter: {type: Number, default: 0}, type: {type: String, default: ""}, justify: {type: String, default: "start"}, align: {type: String, default: "top"}}, setup(e, {slots: t}) {
  const l = computed(() => e.gutter);
  provide("ElRow", {gutter: l});
  const a = computed(() => {
    const t2 = {marginLeft: "", marginRight: ""};
    return e.gutter && (t2.marginLeft = `-${e.gutter / 2}px`, t2.marginRight = t2.marginLeft), t2;
  });
  return () => {
    var l2;
    return h(e.tag, {class: ["el-row", e.justify !== "start" ? "is-justify-" + e.justify : "", e.align !== "top" ? "is-align-" + e.align : "", e.type === "flex" ? "el-row--flex" : ""], style: a.value}, (l2 = t.default) === null || l2 === void 0 ? void 0 : l2.call(t));
  };
}});
Zd.install = (e) => {
  e.component(Zd.name, Zd);
};
const Qd = (e, t, a) => {
  const {disabled: i, min: r, max: s, step: u, showTooltip: d, precision: c, sliderSize: p2, formatTooltip: h2, emitChange: v, resetSize: m, updateDragging: f} = inject("SliderProvider"), {tooltip: g, tooltipVisible: b, formatValue: y, displayTooltip: k, hideTooltip: C} = ((e2, t2, a2) => {
    const o = ref(null), i2 = ref(false), r2 = computed(() => t2.value instanceof Function), s2 = computed(() => r2.value && t2.value(e2.modelValue) || e2.modelValue), u2 = debounce_1(() => {
      a2.value && (i2.value = true);
    }, 50), d2 = debounce_1(() => {
      a2.value && (i2.value = false);
    }, 50);
    return {tooltip: o, tooltipVisible: i2, formatValue: s2, displayTooltip: u2, hideTooltip: d2};
  })(e, h2, d), x = computed(() => (e.modelValue - r.value) / (s.value - r.value) * 100 + "%"), _ = computed(() => e.vertical ? {bottom: x.value} : {left: x.value}), S = (e2) => {
    let t2, l;
    return e2.type.startsWith("touch") ? (l = e2.touches[0].clientY, t2 = e2.touches[0].clientX) : (l = e2.clientY, t2 = e2.clientX), {clientX: t2, clientY: l};
  }, M = (l) => {
    t.dragging = true, t.isClick = true;
    const {clientX: a2, clientY: n} = S(l);
    e.vertical ? t.startY = n : t.startX = a2, t.startPosition = parseFloat(x.value), t.newPosition = t.startPosition;
  }, T = (l) => {
    if (t.dragging) {
      let a2;
      t.isClick = false, k(), m();
      const {clientX: n, clientY: o} = S(l);
      e.vertical ? (t.currentY = o, a2 = (t.startY - t.currentY) / p2.value * 100) : (t.currentX = n, a2 = (t.currentX - t.startX) / p2.value * 100), t.newPosition = t.startPosition + a2, D(t.newPosition);
    }
  }, N = () => {
    t.dragging && (setTimeout(() => {
      t.dragging = false, t.hovering || C(), t.isClick || (D(t.newPosition), v());
    }, 0), lt(window, "mousemove", T), lt(window, "touchmove", T), lt(window, "mouseup", N), lt(window, "touchend", N), lt(window, "contextmenu", N));
  }, D = (l) => Ms(void 0, void 0, void 0, function* () {
    if (l === null || isNaN(l))
      return;
    l < 0 ? l = 0 : l > 100 && (l = 100);
    const n = 100 / ((s.value - r.value) / u.value);
    let o = Math.round(l / n) * n * (s.value - r.value) * 0.01 + r.value;
    o = parseFloat(o.toFixed(c.value)), a(qt, o), t.dragging || e.modelValue === t.oldValue || (t.oldValue = e.modelValue), yield nextTick(), t.dragging && k(), g.value.updatePopper();
  });
  return watch(() => t.dragging, (e2) => {
    f(e2);
  }), {tooltip: g, tooltipVisible: b, showTooltip: d, wrapperStyle: _, formatValue: y, handleMouseEnter: () => {
    t.hovering = true, k();
  }, handleMouseLeave: () => {
    t.hovering = false, t.dragging || C();
  }, onButtonDown: (e2) => {
    i.value || (e2.preventDefault(), M(e2), tt(window, "mousemove", T), tt(window, "touchmove", T), tt(window, "mouseup", N), tt(window, "touchend", N), tt(window, "contextmenu", N));
  }, onLeftKeyDown: () => {
    i.value || (t.newPosition = parseFloat(x.value) - u.value / (s.value - r.value) * 100, D(t.newPosition), v());
  }, onRightKeyDown: () => {
    i.value || (t.newPosition = parseFloat(x.value) + u.value / (s.value - r.value) * 100, D(t.newPosition), v());
  }, setPosition: D};
};
var Jd = defineComponent({name: "ElSliderButton", components: {ElTooltip: ou}, props: {modelValue: {type: Number, default: 0}, vertical: {type: Boolean, default: false}, tooltipClass: {type: String, default: ""}}, emits: [qt], setup(e, {emit: t}) {
  const l = reactive({hovering: false, dragging: false, isClick: false, startX: 0, currentX: 0, startY: 0, currentY: 0, startPosition: 0, newPosition: 0, oldValue: e.modelValue}), {tooltip: n, showTooltip: o, tooltipVisible: i, wrapperStyle: r, formatValue: s, handleMouseEnter: u, handleMouseLeave: d, onButtonDown: c, onLeftKeyDown: p2, onRightKeyDown: h2, setPosition: v} = Qd(e, l, t), {hovering: m, dragging: f} = toRefs(l);
  return {tooltip: n, tooltipVisible: i, showTooltip: o, wrapperStyle: r, formatValue: s, handleMouseEnter: u, handleMouseLeave: d, onButtonDown: c, onLeftKeyDown: p2, onRightKeyDown: h2, setPosition: v, hovering: m, dragging: f};
}});
Jd.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-tooltip");
  return openBlock(), createBlock("div", {ref: "button", class: ["el-slider__button-wrapper", {hover: e.hovering, dragging: e.dragging}], style: e.wrapperStyle, tabindex: "0", onMouseenter: t[2] || (t[2] = (...t2) => e.handleMouseEnter && e.handleMouseEnter(...t2)), onMouseleave: t[3] || (t[3] = (...t2) => e.handleMouseLeave && e.handleMouseLeave(...t2)), onMousedown: t[4] || (t[4] = (...t2) => e.onButtonDown && e.onButtonDown(...t2)), onTouchstart: t[5] || (t[5] = (...t2) => e.onButtonDown && e.onButtonDown(...t2)), onFocus: t[6] || (t[6] = (...t2) => e.handleMouseEnter && e.handleMouseEnter(...t2)), onBlur: t[7] || (t[7] = (...t2) => e.handleMouseLeave && e.handleMouseLeave(...t2)), onKeydown: [t[8] || (t[8] = withKeys((...t2) => e.onLeftKeyDown && e.onLeftKeyDown(...t2), ["left"])), t[9] || (t[9] = withKeys((...t2) => e.onRightKeyDown && e.onRightKeyDown(...t2), ["right"])), t[10] || (t[10] = withKeys(withModifiers((...t2) => e.onLeftKeyDown && e.onLeftKeyDown(...t2), ["prevent"]), ["down"])), t[11] || (t[11] = withKeys(withModifiers((...t2) => e.onRightKeyDown && e.onRightKeyDown(...t2), ["prevent"]), ["up"]))]}, [createVNode(i, {ref: "tooltip", modelValue: e.tooltipVisible, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.tooltipVisible = t2), placement: "top", "stop-popper-mouse-event": false, "popper-class": e.tooltipClass, disabled: !e.showTooltip, manual: ""}, {content: withCtx(() => [createVNode("span", null, toDisplayString(e.formatValue), 1)]), default: withCtx(() => [createVNode("div", {class: ["el-slider__button", {hover: e.hovering, dragging: e.dragging}]}, null, 2)]), _: 1}, 8, ["modelValue", "popper-class", "disabled"])], 38);
}, Jd.__file = "packages/slider/src/button.vue";
var ec = defineComponent({name: "ElMarker", props: {mark: {type: [String, Object], default: () => {
}}}, setup: (e) => ({label: computed(() => typeof e.mark == "string" ? e.mark : e.mark.label)}), render() {
  var e;
  return h("div", {class: "el-slider__marks-text", style: (e = this.mark) === null || e === void 0 ? void 0 : e.style}, this.label);
}});
ec.__file = "packages/slider/src/marker.vue";
var tc = defineComponent({name: "ElSlider", components: {ElInputNumber: As, SliderButton: Jd, SliderMarker: ec}, props: {modelValue: {type: [Number, Array], default: 0}, min: {type: Number, default: 0}, max: {type: Number, default: 100}, step: {type: Number, default: 1}, showInput: {type: Boolean, default: false}, showInputControls: {type: Boolean, default: true}, inputSize: {type: String, default: "small"}, showStops: {type: Boolean, default: false}, showTooltip: {type: Boolean, default: true}, formatTooltip: {type: Function, default: void 0}, disabled: {type: Boolean, default: false}, range: {type: Boolean, default: false}, vertical: {type: Boolean, default: false}, height: {type: String, default: ""}, debounce: {type: Number, default: 300}, label: {type: String, default: void 0}, tooltipClass: {type: String, default: void 0}, marks: Object}, emits: [qt, "change", "input"], setup(e, {emit: t}) {
  const o = reactive({firstValue: 0, secondValue: 0, oldValue: 0, dragging: false, sliderSize: 1}), {elFormItem: i, slider: r, firstButton: s, secondButton: u, sliderDisabled: d, minValue: c, maxValue: p2, runwayStyle: h2, barStyle: v, resetSize: m, emitChange: f, onSliderClick: g} = ((e2, t2, a) => {
    const o2 = inject("elForm", {}), i2 = inject("elFormItem", {}), r2 = ref(null), s2 = ref(null), u2 = ref(null), d2 = {firstButton: s2, secondButton: u2}, c2 = computed(() => e2.disabled || o2.disabled || false), p3 = computed(() => Math.min(t2.firstValue, t2.secondValue)), h3 = computed(() => Math.max(t2.firstValue, t2.secondValue)), v2 = computed(() => e2.range ? 100 * (h3.value - p3.value) / (e2.max - e2.min) + "%" : 100 * (t2.firstValue - e2.min) / (e2.max - e2.min) + "%"), m2 = computed(() => e2.range ? 100 * (p3.value - e2.min) / (e2.max - e2.min) + "%" : "0%"), f2 = computed(() => e2.vertical ? {height: e2.height} : {}), g2 = computed(() => e2.vertical ? {height: v2.value, bottom: m2.value} : {width: v2.value, left: m2.value}), b2 = () => {
      r2.value && (t2.sliderSize = r2.value["client" + (e2.vertical ? "Height" : "Width")]);
    }, y2 = (l) => {
      const a2 = e2.min + l * (e2.max - e2.min) / 100;
      if (!e2.range)
        return void s2.value.setPosition(l);
      let n;
      n = Math.abs(p3.value - a2) < Math.abs(h3.value - a2) ? t2.firstValue < t2.secondValue ? "firstButton" : "secondButton" : t2.firstValue > t2.secondValue ? "firstButton" : "secondButton", d2[n].value.setPosition(l);
    }, k2 = () => Ms(void 0, void 0, void 0, function* () {
      yield nextTick(), a("change", e2.range ? [p3.value, h3.value] : e2.modelValue);
    });
    return {elFormItem: i2, slider: r2, firstButton: s2, secondButton: u2, sliderDisabled: c2, minValue: p3, maxValue: h3, runwayStyle: f2, barStyle: g2, resetSize: b2, setPosition: y2, emitChange: k2, onSliderClick: (l) => {
      if (!c2.value && !t2.dragging) {
        if (b2(), e2.vertical) {
          const e3 = r2.value.getBoundingClientRect().bottom;
          y2((e3 - l.clientY) / t2.sliderSize * 100);
        } else {
          const e3 = r2.value.getBoundingClientRect().left;
          y2((l.clientX - e3) / t2.sliderSize * 100);
        }
        k2();
      }
    }};
  })(e, o, t), {stops: b, getStopStyle: y} = ((e2, t2, l, a) => ({stops: computed(() => {
    if (!e2.showStops || e2.min > e2.max)
      return [];
    if (e2.step === 0)
      return [];
    const n = (e2.max - e2.min) / e2.step, o2 = 100 * e2.step / (e2.max - e2.min), i2 = Array.from({length: n - 1}).map((e3, t3) => (t3 + 1) * o2);
    return e2.range ? i2.filter((t3) => t3 < 100 * (l.value - e2.min) / (e2.max - e2.min) || t3 > 100 * (a.value - e2.min) / (e2.max - e2.min)) : i2.filter((l2) => l2 > 100 * (t2.firstValue - e2.min) / (e2.max - e2.min));
  }), getStopStyle: (t3) => e2.vertical ? {bottom: t3 + "%"} : {left: t3 + "%"}}))(e, o, c, p2), k = ((e2) => computed(() => e2.marks ? Object.keys(e2.marks).map(parseFloat).sort((e3, t2) => e3 - t2).filter((t2) => t2 <= e2.max && t2 >= e2.min).map((t2) => ({point: t2, position: 100 * (t2 - e2.min) / (e2.max - e2.min), mark: e2.marks[t2]})) : []))(e);
  lc(e, o, c, p2, t, i);
  const C = computed(() => {
    let t2 = [e.min, e.max, e.step].map((e2) => {
      let t3 = ("" + e2).split(".")[1];
      return t3 ? t3.length : 0;
    });
    return Math.max.apply(null, t2);
  }), {sliderWrapper: x} = ac(e, o, m), {firstValue: M, secondValue: T, oldValue: N, dragging: D, sliderSize: O} = toRefs(o);
  return provide("SliderProvider", Object.assign(Object.assign({}, toRefs(e)), {sliderSize: O, disabled: d, precision: C, emitChange: f, resetSize: m, updateDragging: (e2) => {
    o.dragging = e2;
  }})), {firstValue: M, secondValue: T, oldValue: N, dragging: D, sliderSize: O, slider: r, firstButton: s, secondButton: u, sliderDisabled: d, runwayStyle: h2, barStyle: v, emitChange: f, onSliderClick: g, getStopStyle: y, stops: b, markList: k, sliderWrapper: x};
}});
const lc = (e, t, l, a, n, i) => {
  const r = (e2) => {
    n(qt, e2), n("input", e2);
  }, s = () => e.range ? ![l.value, a.value].every((e2, l2) => e2 === t.oldValue[l2]) : e.modelValue !== t.oldValue, u = () => {
    var n2, o;
    if (e.min > e.max)
      return void Le("Slider", "min should not be greater than max.");
    const u2 = e.modelValue;
    e.range && Array.isArray(u2) ? u2[1] < e.min ? r([e.min, e.min]) : u2[0] > e.max ? r([e.max, e.max]) : u2[0] < e.min ? r([e.min, u2[1]]) : u2[1] > e.max ? r([u2[0], e.max]) : (t.firstValue = u2[0], t.secondValue = u2[1], s() && ((n2 = i.formItemMitt) === null || n2 === void 0 || n2.emit("el.form.change", [l.value, a.value]), t.oldValue = u2.slice())) : e.range || typeof u2 != "number" || isNaN(u2) || (u2 < e.min ? r(e.min) : u2 > e.max ? r(e.max) : (t.firstValue = u2, s() && ((o = i.formItemMitt) === null || o === void 0 || o.emit("el.form.change", u2), t.oldValue = u2)));
  };
  u(), watch(() => t.dragging, (e2) => {
    e2 || u();
  }), watch(() => t.firstValue, (t2) => {
    e.range ? r([l.value, a.value]) : r(t2);
  }), watch(() => t.secondValue, () => {
    e.range && r([l.value, a.value]);
  }), watch(() => e.modelValue, (e2, l2) => {
    t.dragging || Array.isArray(e2) && Array.isArray(l2) && e2.every((e3, t2) => e3 === l2[t2]) || u();
  }), watch(() => [e.min, e.max], () => {
    u();
  });
}, ac = (e, t, a) => {
  const n = ref(null);
  return onMounted(() => Ms(void 0, void 0, void 0, function* () {
    let l;
    e.range ? (Array.isArray(e.modelValue) ? (t.firstValue = Math.max(e.min, e.modelValue[0]), t.secondValue = Math.min(e.max, e.modelValue[1])) : (t.firstValue = e.min, t.secondValue = e.max), t.oldValue = [t.firstValue, t.secondValue], l = `${t.firstValue}-${t.secondValue}`) : (typeof e.modelValue != "number" || isNaN(e.modelValue) ? t.firstValue = e.min : t.firstValue = Math.min(e.max, Math.max(e.min, e.modelValue)), t.oldValue = t.firstValue, l = t.firstValue), n.value.setAttribute("aria-valuetext", l), n.value.setAttribute("aria-label", e.label ? e.label : `slider between ${e.min} and ${e.max}`), tt(window, "resize", a), yield nextTick(), a();
  })), onBeforeUnmount(() => {
    lt(window, "resize", a);
  }), {sliderWrapper: n};
}, nc = {key: 1}, oc = {class: "el-slider__marks"};
tc.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-input-number"), r = resolveComponent("slider-button"), c = resolveComponent("slider-marker");
  return openBlock(), createBlock("div", {ref: "sliderWrapper", class: ["el-slider", {"is-vertical": e.vertical, "el-slider--with-input": e.showInput}], role: "slider", "aria-valuemin": e.min, "aria-valuemax": e.max, "aria-orientation": e.vertical ? "vertical" : "horizontal", "aria-disabled": e.sliderDisabled}, [e.showInput && !e.range ? (openBlock(), createBlock(i, {key: 0, ref: "input", modelValue: e.firstValue, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.firstValue = t2), class: "el-slider__input", step: e.step, disabled: e.sliderDisabled, controls: e.showInputControls, min: e.min, max: e.max, debounce: e.debounce, size: e.inputSize, onChange: e.emitChange}, null, 8, ["modelValue", "step", "disabled", "controls", "min", "max", "debounce", "size", "onChange"])) : createCommentVNode("v-if", true), createVNode("div", {ref: "slider", class: ["el-slider__runway", {"show-input": e.showInput && !e.range, disabled: e.sliderDisabled}], style: e.runwayStyle, onClick: t[4] || (t[4] = (...t2) => e.onSliderClick && e.onSliderClick(...t2))}, [createVNode("div", {class: "el-slider__bar", style: e.barStyle}, null, 4), createVNode(r, {ref: "firstButton", modelValue: e.firstValue, "onUpdate:modelValue": t[2] || (t[2] = (t2) => e.firstValue = t2), vertical: e.vertical, "tooltip-class": e.tooltipClass}, null, 8, ["modelValue", "vertical", "tooltip-class"]), e.range ? (openBlock(), createBlock(r, {key: 0, ref: "secondButton", modelValue: e.secondValue, "onUpdate:modelValue": t[3] || (t[3] = (t2) => e.secondValue = t2), vertical: e.vertical, "tooltip-class": e.tooltipClass}, null, 8, ["modelValue", "vertical", "tooltip-class"])) : createCommentVNode("v-if", true), e.showStops ? (openBlock(), createBlock("div", nc, [(openBlock(true), createBlock(Fragment, null, renderList(e.stops, (t2, l2) => (openBlock(), createBlock("div", {key: l2, class: "el-slider__stop", style: e.getStopStyle(t2)}, null, 4))), 128))])) : createCommentVNode("v-if", true), e.markList.length > 0 ? (openBlock(), createBlock(Fragment, {key: 2}, [createVNode("div", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.markList, (t2, l2) => (openBlock(), createBlock("div", {key: l2, style: e.getStopStyle(t2.position), class: "el-slider__stop el-slider__marks-stop"}, null, 4))), 128))]), createVNode("div", oc, [(openBlock(true), createBlock(Fragment, null, renderList(e.markList, (t2, l2) => (openBlock(), createBlock(c, {key: l2, mark: t2.mark, style: e.getStopStyle(t2.position)}, null, 8, ["mark", "style"]))), 128))])], 64)) : createCommentVNode("v-if", true)], 6)], 10, ["aria-valuemin", "aria-valuemax", "aria-orientation", "aria-disabled"]);
}, tc.__file = "packages/slider/src/index.vue", tc.install = (e) => {
  e.component(tc.name, tc);
};
const ic = tc;
var rc = defineComponent({name: "ElStep", props: {title: {type: String, default: ""}, icon: {type: String, default: ""}, description: {type: String, default: ""}, status: {type: String, default: "", validator: (e) => ["", "wait", "process", "finish", "error", "success"].includes(e)}}, setup(t) {
  const s = ref(-1), u = ref({}), d = ref(""), c = inject("ElSteps"), p2 = getCurrentInstance();
  onMounted(() => {
    watch([() => c.props.active, () => c.props.processStatus, () => c.props.finishStatus], ([e]) => {
      _(e);
    }, {immediate: true});
  }), onBeforeUnmount(() => {
    c.steps.value = c.steps.value.filter((e) => e.uid !== p2.uid);
  });
  const h2 = computed(() => t.status || d.value), v = computed(() => {
    const e = c.steps.value[s.value - 1];
    return e ? e.currentStatus : "wait";
  }), m = computed(() => c.props.alignCenter), f = computed(() => c.props.direction === "vertical"), g = computed(() => c.props.simple), b = computed(() => c.steps.value.length), y = computed(() => {
    var e;
    return ((e = c.steps.value[b.value - 1]) === null || e === void 0 ? void 0 : e.uid) === p2.uid;
  }), k = computed(() => g.value ? "" : c.props.space), C = computed(() => {
    const e = {flexBasis: typeof k.value == "number" ? k.value + "px" : k.value ? k.value : 100 / (b.value - (m.value ? 0 : 1)) + "%"};
    return f.value || y.value && (e.maxWidth = 100 / b.value + "%"), e;
  }), x = (e) => {
    s.value = e;
  }, w = (e) => {
    let t2 = 100;
    const l = {};
    l.transitionDelay = 150 * s.value + "ms", e === c.props.processStatus ? t2 = 0 : e === "wait" && (t2 = 0, l.transitionDelay = -150 * s.value + "ms"), l.borderWidth = t2 && !g.value ? "1px" : 0, l[c.props.direction === "vertical" ? "height" : "width"] = t2 + "%", u.value = l;
  }, _ = (e) => {
    e > s.value ? d.value = c.props.finishStatus : e === s.value && v.value !== "error" ? d.value = c.props.processStatus : d.value = "wait";
    const t2 = c.steps.value[b.value - 1];
    t2 && t2.calcProgress(d.value);
  }, S = reactive({uid: computed(() => p2.uid), currentStatus: h2, setIndex: x, calcProgress: w});
  return c.steps.value = [...c.steps.value, S], {index: s, lineStyle: u, currentStatus: h2, isCenter: m, isVertical: f, isSimple: g, isLast: y, space: k, style: C, parent: c, setIndex: x, calcProgress: w, updateStatus: _};
}});
const sc = {class: "el-step__line"}, uc = {key: 1, class: "el-step__icon-inner"}, dc = {class: "el-step__main"}, cc = {key: 0, class: "el-step__arrow"};
rc.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {style: e.style, class: ["el-step", e.isSimple ? "is-simple" : "is-" + e.parent.props.direction, e.isLast && !e.space && !e.isCenter && "is-flex", e.isCenter && !e.isVertical && !e.isSimple && "is-center"]}, [createCommentVNode(" icon & line "), createVNode("div", {class: ["el-step__head", "is-" + e.currentStatus]}, [createVNode("div", sc, [createVNode("i", {class: "el-step__line-inner", style: e.lineStyle}, null, 4)]), createVNode("div", {class: ["el-step__icon", "is-" + (e.icon ? "icon" : "text")]}, [e.currentStatus !== "success" && e.currentStatus !== "error" ? renderSlot(e.$slots, "icon", {key: 0}, () => [e.icon ? (openBlock(), createBlock("i", {key: 0, class: ["el-step__icon-inner", e.icon]}, null, 2)) : createCommentVNode("v-if", true), e.icon || e.isSimple ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", uc, toDisplayString(e.index + 1), 1))]) : (openBlock(), createBlock("i", {key: 1, class: ["el-step__icon-inner", "is-status", "el-icon-" + (e.currentStatus === "success" ? "check" : "close")]}, null, 2))], 2)], 2), createCommentVNode(" title & description "), createVNode("div", dc, [createVNode("div", {class: ["el-step__title", "is-" + e.currentStatus]}, [renderSlot(e.$slots, "title", {}, () => [createTextVNode(toDisplayString(e.title), 1)])], 2), e.isSimple ? (openBlock(), createBlock("div", cc)) : (openBlock(), createBlock("div", {key: 1, class: ["el-step__description", "is-" + e.currentStatus]}, [renderSlot(e.$slots, "description", {}, () => [createTextVNode(toDisplayString(e.description), 1)])], 2))])], 6);
}, rc.__file = "packages/steps/src/item.vue", rc.install = (e) => {
  e.component(rc.name, rc);
};
const pc = rc;
var hc = defineComponent({name: "ElSteps", props: {space: {type: [Number, String], default: ""}, active: {type: Number, default: 0}, direction: {type: String, default: "horizontal", validator: (e) => ["horizontal", "vertical"].includes(e)}, alignCenter: {type: Boolean, default: false}, simple: {type: Boolean, default: false}, finishStatus: {type: String, default: "finish", validator: (e) => ["wait", "process", "finish", "error", "success"].includes(e)}, processStatus: {type: String, default: "process", validator: (e) => ["wait", "process", "finish", "error", "success"].includes(e)}}, emits: ["change"], setup(e, {emit: t}) {
  const a = ref([]);
  return watch(a, () => {
    a.value.forEach((e2, t2) => {
      e2.setIndex(t2);
    });
  }), provide("ElSteps", {props: e, steps: a}), watch(() => e.active, (e2, l) => {
    t("change", e2, l);
  }), {steps: a};
}});
hc.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-steps", e.simple ? "el-steps--simple" : "el-steps--" + e.direction]}, [renderSlot(e.$slots, "default")], 2);
}, hc.__file = "packages/steps/src/index.vue", hc.install = (e) => {
  e.component(hc.name, hc);
};
const vc = hc;
var mc = defineComponent({name: "ElSubmenu", componentName: "ElSubmenu", props: {index: {type: String, required: true}, showTimeout: {type: Number, default: 300}, hideTimeout: {type: Number, default: 300}, popperClass: String, disabled: Boolean, popperAppendToBody: {type: Boolean, default: void 0}}, setup(t) {
  const o = reactive({popperJS: null, timeout: null, items: {}, submenus: {}, currentPlacement: "", mouseInChild: false, opened: false}), s = ref(null), u = ref(null), d = getCurrentInstance(), {paddingStyle: c, indexPath: p2, parentMenu: h2} = au(d, t.index), {openedMenus: v, isMenuPopup: m, hoverBackground: f, methods: g, props: b, methods: {closeMenu: y}, rootMenuOn: k, rootMenuEmit: C} = inject("rootMenu"), {addSubMenu: x, removeSubMenu: w, handleMouseleave: _} = inject("subMenu:" + h2.value.uid), M = computed(() => A.value === "horizontal" && T.value || A.value === "vertical" && !b.collapse ? "el-icon-arrow-down" : "el-icon-arrow-right"), T = computed(() => {
    let e = true, t2 = d.parent;
    for (; t2 && t2.type.name !== "ElMenu"; ) {
      if (["ElSubmenu", "ElMenuItemGroup"].includes(t2.type.name)) {
        e = false;
        break;
      }
      t2 = t2.parent;
    }
    return e;
  }), N = computed(() => t.popperAppendToBody === void 0 ? T.value : Boolean(t.popperAppendToBody)), D = computed(() => b.collapse ? "el-zoom-in-left" : "el-zoom-in-top"), O = computed(() => v.value.includes(t.index)), I = computed(() => {
    let e = false;
    const t2 = o.submenus, l = o.items;
    return Object.keys(l).forEach((t3) => {
      l[t3].active && (e = true);
    }), Object.keys(t2).forEach((l2) => {
      t2[l2].active && (e = true);
    }), e;
  }), P = computed(() => b.backgroundColor || ""), V = computed(() => b.activeTextColor || ""), B = computed(() => b.textColor || ""), A = computed(() => b.mode), L = computed(() => A.value !== "horizontal" ? {color: B.value} : {borderBottomColor: I.value ? b.activeTextColor ? V.value : "" : "transparent", color: I.value ? V.value : B.value}), z = ae(), F = (e) => {
    var t2;
    e ? W() : (t2 = u.value) === null || t2 === void 0 || t2.doDestroy();
  }, $ = (e) => {
    o.submenus[e.index] = e;
  }, R = (e) => {
    delete o.submenus[e.index];
  }, H = (e = false) => {
    b.menuTrigger === "click" && b.mode === "horizontal" || !b.collapse && b.mode === "vertical" || (z.emit("submenu:mouse-leave-child"), clearTimeout(o.timeout), o.timeout = setTimeout(() => {
      !o.mouseInChild && y(t.index);
    }, t.hideTimeout), N.value && e && d.parent.type.name === "ElSubmenu" && _(true));
  }, W = () => {
    o.currentPlacement = A.value === "horizontal" && T.value ? "bottom-start" : "right-start";
  };
  return provide("subMenu:" + d.uid, {addSubMenu: $, removeSubMenu: R, handleMouseleave: H}), onBeforeMount(() => {
    k("rootMenu:toggle-collapse", (e) => {
      F(e);
    }), z.on("submenu:mouse-enter-child", () => {
      o.mouseInChild = true, clearTimeout(o.timeout);
    }), z.on("submenu:mouse-leave-child", () => {
      o.mouseInChild = false, clearTimeout(o.timeout);
    });
  }), onMounted(() => {
    g.addSubMenu({index: t.index, indexPath: p2, active: I}), x({index: t.index, indexPath: p2, active: I}), W();
  }), onBeforeUnmount(() => {
    w({index: t.index, indexPath: p2, active: I}), g.removeSubMenu({index: t.index, indexPath: p2, active: I});
  }), {data: o, props: t, mode: A, active: I, isMenuPopup: m, opened: O, paddingStyle: c, titleStyle: L, backgroundColor: P, rootProps: b, menuTransitionName: D, submenuTitleIcon: M, appendToBody: N, handleClick: () => {
    const e = t.disabled;
    b.menuTrigger === "hover" && b.mode === "horizontal" || b.collapse && b.mode === "vertical" || e || C("submenu:submenu-click", {index: t.index, indexPath: p2});
  }, handleMouseenter: (e, l = t.showTimeout) => {
    if (!("ActiveXObject" in window) && e.type === "focus" && !e.relatedTarget)
      return;
    const a = t.disabled;
    b.menuTrigger === "click" && b.mode === "horizontal" || !b.collapse && b.mode === "vertical" || a || (z.emit("submenu:mouse-enter-child"), clearTimeout(o.timeout), o.timeout = setTimeout(() => {
      g.openMenu(t.index, p2);
    }, l), N.value && h2.value.vnode.el.dispatchEvent(new MouseEvent("mouseenter")));
  }, handleMouseleave: H, handleTitleMouseenter: () => {
    var e;
    if (A.value === "horizontal" && !b.backgroundColor)
      return;
    const t2 = ((e = u.value) === null || e === void 0 ? void 0 : e.triggerRef) || s.value;
    t2 && (t2.style.backgroundColor = f.value);
  }, handleTitleMouseleave: () => {
    var e;
    if (A.value === "horizontal" && !b.backgroundColor)
      return;
    const t2 = ((e = u.value) === null || e === void 0 ? void 0 : e.triggerRef) || s.value;
    t2 && (t2.style.backgroundColor = b.backgroundColor || "");
  }, addItem: (e) => {
    o.items[e.index] = e;
  }, removeItem: (e) => {
    delete o.items[e.index];
  }, addSubMenu: $, removeSubMenu: R, popperVnode: u, verticalTitleRef: s};
}, render() {
  var e, t;
  const l = [(t = (e = this.$slots).title) === null || t === void 0 ? void 0 : t.call(e), h("i", {class: ["el-submenu__icon-arrow", this.submenuTitleIcon]}, null)], a = {backgroundColor: this.rootProps.backgroundColor || ""}, n = this.isMenuPopup ? h(Hl, {ref: "popperVNode", manualMode: true, visible: this.opened, "onUpdate:visible": (e2) => this.opened = e2, effect: "light", pure: true, offset: 6, showArrow: false, popperClass: this.popperClass, placement: this.data.currentPlacement, appendToBody: this.appendToBody, transition: this.menuTransitionName, gpuAcceleration: false}, {default: () => {
    var e2, t2;
    return h("div", {ref: "menu", class: ["el-menu--" + this.mode, this.popperClass], onMouseenter: (e3) => this.handleMouseenter(e3, 100), onMouseleave: () => this.handleMouseleave(true), onFocus: (e3) => this.handleMouseenter(e3, 100)}, [h("ul", {class: ["el-menu el-menu--popup", "el-menu--popup-" + this.data.currentPlacement], style: a}, [(t2 = (e2 = this.$slots).default) === null || t2 === void 0 ? void 0 : t2.call(e2)])]);
  }, trigger: () => h("div", {class: "el-submenu__title", style: [this.paddingStyle, this.titleStyle, {backgroundColor: this.backgroundColor}], onClick: this.handleClick, onMouseenter: this.handleTitleMouseenter, onMouseleave: this.handleTitleMouseleave}, l)}) : h(Fragment, {}, [h("div", {class: "el-submenu__title", style: [this.paddingStyle, this.titleStyle, {backgroundColor: this.backgroundColor}], ref: "verticalTitleRef", onClick: this.handleClick, onMouseenter: this.handleTitleMouseenter, onMouseleave: this.handleTitleMouseleave}, l), h(Co, {}, {default: () => {
    var e2, t2;
    return withDirectives(h("ul", {role: "menu", class: "el-menu el-menu--inline", style: a}, [(t2 = (e2 = this.$slots).default) === null || t2 === void 0 ? void 0 : t2.call(e2)]), [[vShow, this.opened]]);
  }})]);
  return h("li", {class: ["el-submenu", {"is-active": this.active, "is-opened": this.opened, "is-disabled": this.disabled}], role: "menuitem", ariaHaspopup: true, ariaExpanded: this.opened, onMouseenter: this.handleMouseenter, onMouseleave: () => this.handleMouseleave(true), onFocus: this.handleMouseenter}, [n]);
}});
mc.__file = "packages/menu/src/submenu.vue", mc.install = (e) => {
  e.component(mc.name, mc);
};
const fc = mc;
var gc = defineComponent({name: "ElSwitch", props: {modelValue: {type: [Boolean, String, Number], default: false}, value: {type: [Boolean, String, Number], default: false}, disabled: {type: Boolean, default: false}, width: {type: Number, default: 40}, activeIconClass: {type: String, default: ""}, inactiveIconClass: {type: String, default: ""}, activeText: {type: String, default: ""}, inactiveText: {type: String, default: ""}, activeColor: {type: String, default: ""}, inactiveColor: {type: String, default: ""}, activeValue: {type: [Boolean, String, Number], default: true}, inactiveValue: {type: [Boolean, String, Number], default: false}, name: {type: String, default: ""}, validateEvent: {type: Boolean, default: true}, id: String, loading: {type: Boolean, default: false}, beforeChange: Function}, emits: ["update:modelValue", "change", "input"], setup(e, t) {
  const a = inject("elForm", {}), r = inject("elFormItem", {}), s = ref(e.modelValue !== false), u = ref(null), d = ref(null), c = "ElSwitch";
  watch(() => e.modelValue, () => {
    s.value = true;
  }), watch(() => e.value, () => {
    s.value = false;
  });
  const p2 = computed(() => s.value ? e.modelValue : e.value), h2 = computed(() => p2.value === e.activeValue);
  ~[e.activeValue, e.inactiveValue].indexOf(p2.value) || (t.emit("update:modelValue", e.inactiveValue), t.emit("change", e.inactiveValue), t.emit("input", e.inactiveValue)), watch(h2, () => {
    var t2;
    u.value.checked = h2.value, (e.activeColor || e.inactiveColor) && f(), e.validateEvent && ((t2 = r.formItemMitt) === null || t2 === void 0 || t2.emit("el.form.change", [p2.value]));
  });
  const v = computed(() => e.disabled || e.loading || (a || {}).disabled), m = () => {
    const l = h2.value ? e.inactiveValue : e.activeValue;
    t.emit("update:modelValue", l), t.emit("change", l), t.emit("input", l), nextTick(() => {
      u.value.checked = h2.value;
    });
  }, f = () => {
    const t2 = h2.value ? e.activeColor : e.inactiveColor, l = d.value;
    l.style.borderColor = t2, l.style.backgroundColor = t2, l.children[0].style.color = t2;
  };
  return onMounted(() => {
    (e.activeColor || e.inactiveColor) && f(), u.value.checked = h2.value;
  }), {input: u, core: d, switchDisabled: v, checked: h2, handleChange: m, switchValue: () => {
    if (v.value)
      return;
    const {beforeChange: t2} = e;
    if (!t2)
      return void m();
    const l = t2();
    [Te(l), We(l)].some((e2) => e2) || Le(c, "beforeChange must return type `Promise<boolean>` or `boolean`"), Te(l) ? l.then((e2) => {
      e2 && m();
    }).catch((e2) => {
    }) : l && m();
  }, focus: () => {
    var e2, t2;
    (t2 = (e2 = u.value) === null || e2 === void 0 ? void 0 : e2.focus) === null || t2 === void 0 || t2.call(e2);
  }};
}});
const bc = {class: "el-switch__action"}, yc = {key: 0, class: "el-icon-loading"};
gc.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-switch", {"is-disabled": e.switchDisabled, "is-checked": e.checked}], role: "switch", "aria-checked": e.checked, "aria-disabled": e.switchDisabled, onClick: t[3] || (t[3] = withModifiers((...t2) => e.switchValue && e.switchValue(...t2), ["prevent"]))}, [createVNode("input", {id: e.id, ref: "input", class: "el-switch__input", type: "checkbox", name: e.name, "true-value": e.activeValue, "false-value": e.inactiveValue, disabled: e.switchDisabled, onChange: t[1] || (t[1] = (...t2) => e.handleChange && e.handleChange(...t2)), onKeydown: t[2] || (t[2] = withKeys((...t2) => e.switchValue && e.switchValue(...t2), ["enter"]))}, null, 40, ["id", "name", "true-value", "false-value", "disabled"]), e.inactiveIconClass || e.inactiveText ? (openBlock(), createBlock("span", {key: 0, class: ["el-switch__label", "el-switch__label--left", e.checked ? "" : "is-active"]}, [e.inactiveIconClass ? (openBlock(), createBlock("i", {key: 0, class: [e.inactiveIconClass]}, null, 2)) : createCommentVNode("v-if", true), !e.inactiveIconClass && e.inactiveText ? (openBlock(), createBlock("span", {key: 1, "aria-hidden": e.checked}, toDisplayString(e.inactiveText), 9, ["aria-hidden"])) : createCommentVNode("v-if", true)], 2)) : createCommentVNode("v-if", true), createVNode("span", {ref: "core", class: "el-switch__core", style: {width: (e.width || 40) + "px"}}, [createVNode("div", bc, [e.loading ? (openBlock(), createBlock("i", yc)) : createCommentVNode("v-if", true)])], 4), e.activeIconClass || e.activeText ? (openBlock(), createBlock("span", {key: 1, class: ["el-switch__label", "el-switch__label--right", e.checked ? "is-active" : ""]}, [e.activeIconClass ? (openBlock(), createBlock("i", {key: 0, class: [e.activeIconClass]}, null, 2)) : createCommentVNode("v-if", true), !e.activeIconClass && e.activeText ? (openBlock(), createBlock("span", {key: 1, "aria-hidden": !e.checked}, toDisplayString(e.activeText), 9, ["aria-hidden"])) : createCommentVNode("v-if", true)], 2)) : createCommentVNode("v-if", true)], 10, ["aria-checked", "aria-disabled"]);
}, gc.__file = "packages/switch/src/index.vue", gc.install = (e) => {
  e.component(gc.name, gc);
};
const kc = gc;
var Cc = defineComponent({name: "ElTabPane", props: {label: {type: String, default: ""}, name: {type: String, default: ""}, closable: Boolean, disabled: Boolean, lazy: Boolean}, setup(t) {
  const a = ref(null), o = ref(false), i = inject("rootTabs"), r = inject("updatePaneState");
  if (!i || !r)
    throw new Error("ElTabPane must use with ElTabs");
  const s = computed(() => t.closable || i.props.closable), u = computed(() => {
    const e = i.currentName.value === (t.name || a.value);
    return e && (o.value = true), e;
  }), d = computed(() => t.name || a.value), c = computed(() => !t.lazy || o.value || u.value), p2 = getCurrentInstance();
  return r({uid: p2.uid, instance: p2, props: t, paneName: d, active: u, index: a, isClosable: s}), {index: a, loaded: o, isClosable: s, active: u, paneName: d, shouldBeRender: c};
}});
Cc.render = function(e, t, l, a, n, o) {
  return e.shouldBeRender ? withDirectives((openBlock(), createBlock("div", {key: 0, id: "pane-" + e.paneName, class: "el-tab-pane", role: "tabpanel", "aria-hidden": !e.active, "aria-labelledby": "tab-" + e.paneName}, [renderSlot(e.$slots, "default")], 8, ["id", "aria-hidden", "aria-labelledby"])), [[vShow, e.active]]) : createCommentVNode("v-if", true);
}, Cc.__file = "packages/tabs/src/tab-pane.vue", Cc.install = (e) => {
  e.component(Cc.name, Cc);
};
const xc = Cc, wc = function(e) {
  let t = e.target;
  for (; t && t.tagName.toUpperCase() !== "HTML"; ) {
    if (t.tagName.toUpperCase() === "TD")
      return t;
    t = t.parentNode;
  }
  return null;
}, _c = function(e) {
  return e !== null && typeof e == "object";
}, Sc = function(e, t, l, a, n) {
  if (!t && !a && (!n || Array.isArray(n) && !n.length))
    return e;
  l = typeof l == "string" ? l === "descending" ? -1 : 1 : l && l < 0 ? -1 : 1;
  const o = a ? null : function(l2, a2) {
    return n ? (Array.isArray(n) || (n = [n]), n.map(function(t2) {
      return typeof t2 == "string" ? Fe(l2, t2) : t2(l2, a2, e);
    })) : (t !== "$key" && _c(l2) && "$value" in l2 && (l2 = l2.$value), [_c(l2) ? Fe(l2, t) : l2]);
  };
  return e.map(function(e2, t2) {
    return {value: e2, index: t2, key: o ? o(e2, t2) : null};
  }).sort(function(e2, t2) {
    let n2 = function(e3, t3) {
      if (a)
        return a(e3.value, t3.value);
      for (let l2 = 0, a2 = e3.key.length; l2 < a2; l2++) {
        if (e3.key[l2] < t3.key[l2])
          return -1;
        if (e3.key[l2] > t3.key[l2])
          return 1;
      }
      return 0;
    }(e2, t2);
    return n2 || (n2 = e2.index - t2.index), n2 * l;
  }).map((e2) => e2.value);
}, Ec = function(e, t) {
  let l = null;
  return e.columns.forEach(function(e2) {
    e2.id === t && (l = e2);
  }), l;
}, Mc = function(e, t) {
  const l = (t.className || "").match(/el-table_[^\s]+/gm);
  return l ? Ec(e, l[0]) : null;
}, Tc = (e, t) => {
  if (!e)
    throw new Error("row is required when get row identity");
  if (typeof t == "string") {
    if (t.indexOf(".") < 0)
      return e[t];
    const l = t.split(".");
    let a = e;
    for (let e2 = 0; e2 < l.length; e2++)
      a = a[l[e2]];
    return a;
  }
  if (typeof t == "function")
    return t.call(null, e);
}, Nc = function(e, t) {
  const l = {};
  return (e || []).forEach((e2, a) => {
    l[Tc(e2, t)] = {row: e2, index: a};
  }), l;
};
function Dc(e) {
  return e !== void 0 && (e = parseInt(e, 10), isNaN(e) && (e = null)), e;
}
function Oc(e) {
  return typeof e == "number" ? e : typeof e == "string" ? /^\d+(?:px)?$/.test(e) ? parseInt(e, 10) : e : null;
}
function Ic(e, t, l) {
  let a = false;
  const n = e.indexOf(t), o = n !== -1, i = () => {
    e.push(t), a = true;
  }, r = () => {
    e.splice(n, 1), a = true;
  };
  return typeof l == "boolean" ? l && !o ? i() : !l && o && r() : o ? r() : i(), a;
}
function Pc(e, t, l = "children", a = "hasChildren") {
  const n = (e2) => !(Array.isArray(e2) && e2.length);
  function o(e2, i, r) {
    t(e2, i, r), i.forEach((e3) => {
      if (e3[a])
        return void t(e3, null, r + 1);
      const i2 = e3[l];
      n(i2) || o(e3, i2, r + 1);
    });
  }
  e.forEach((e2) => {
    if (e2[a])
      return void t(e2, null, 0);
    const i = e2[l];
    n(i) || o(e2, i, 0);
  });
}
let Vc;
const Bc = (e) => {
  const t = [];
  return e.forEach((e2) => {
    e2.children ? t.push.apply(t, Bc(e2.children)) : t.push(e2);
  }), t;
};
function Ac() {
  const t = getCurrentInstance(), a = ref(null), i = ref([]), r = ref([]), s = ref(false), u = ref([]), d = ref([]), c = ref([]), p2 = ref([]), h2 = ref([]), v = ref([]), m = ref([]), f = ref([]), g = ref(0), b = ref(0), y = ref(0), k = ref(false), C = ref([]), x = ref(false), w = ref(false), _ = ref(null), S = ref({}), E = ref(null), M = ref(null), T = ref(null), N = ref(null), D = ref(null);
  watch(i, () => t.state && I(false), {deep: true});
  const O = () => {
    p2.value = u.value.filter((e2) => e2.fixed === true || e2.fixed === "left"), h2.value = u.value.filter((e2) => e2.fixed === "right"), p2.value.length > 0 && u.value[0] && u.value[0].type === "selection" && !u.value[0].fixed && (u.value[0].fixed = true, p2.value.unshift(u.value[0]));
    const e = u.value.filter((e2) => !e2.fixed);
    d.value = [].concat(p2.value).concat(e).concat(h2.value);
    const t2 = Bc(e), l = Bc(p2.value), a2 = Bc(h2.value);
    g.value = t2.length, b.value = l.length, y.value = a2.length, c.value = [].concat(l).concat(t2).concat(a2), s.value = p2.value.length > 0 || h2.value.length > 0;
  }, I = (e, l = false) => {
    e && O(), l ? t.state.doLayout() : t.state.debouncedUpdateLayout();
  }, P = (e, t2, l) => {
    M.value && M.value !== e && (M.value.order = null), M.value = e, T.value = t2, N.value = l;
  }, V = () => {
    let e = unref(r);
    Object.keys(S.value).forEach((t2) => {
      const l = S.value[t2];
      if (!l || l.length === 0)
        return;
      const a2 = Ec({columns: c.value}, t2);
      a2 && a2.filterMethod && (e = e.filter((e2) => l.some((t3) => a2.filterMethod.call(null, t3, e2, a2))));
    }), E.value = e;
  }, B = () => {
    i.value = ((e, t2) => {
      const l = t2.sortingColumn;
      return l && typeof l.sortable != "string" ? Sc(e, t2.sortProp, t2.sortOrder, l.sortMethod, l.sortBy) : e;
    })(E.value, {sortingColumn: M.value, sortProp: T.value, sortOrder: N.value});
  }, {setExpandRowKeys: A, toggleRowExpansion: L, updateExpandRows: z, states: F, isRowExpanded: $} = function(t2) {
    const a2 = getCurrentInstance(), n = ref(false), o = ref([]);
    return {updateExpandRows: () => {
      const e = t2.data.value || [], l = t2.rowKey.value;
      if (n.value)
        o.value = e.slice();
      else if (l) {
        const t3 = Nc(o.value, l);
        o.value = e.reduce((e2, a3) => {
          const n2 = Tc(a3, l);
          return t3[n2] && e2.push(a3), e2;
        }, []);
      } else
        o.value = [];
    }, toggleRowExpansion: (e, t3) => {
      Ic(o.value, e, t3) && (a2.emit("expand-change", e, o.value.slice()), a2.store.scheduleLayout());
    }, setExpandRowKeys: (e) => {
      a2.store.assertRowKey();
      const l = t2.data.value || [], n2 = t2.rowKey.value, i2 = Nc(l, n2);
      o.value = e.reduce((e2, t3) => {
        const l2 = i2[t3];
        return l2 && e2.push(l2.row), e2;
      }, []);
    }, isRowExpanded: (e) => {
      const l = t2.rowKey.value;
      return l ? !!Nc(o.value, l)[Tc(e, l)] : o.value.indexOf(e) !== -1;
    }, states: {expandRows: o, defaultExpandAll: n}};
  }({data: i, rowKey: a}), {updateTreeExpandKeys: R, toggleTreeExpansion: H, loadOrToggle: W, states: j} = function(t2) {
    const a2 = ref([]), i2 = ref({}), r2 = ref(16), s2 = ref(false), u2 = ref({}), d2 = ref("hasChildren"), c2 = ref("children"), p3 = getCurrentInstance(), h3 = computed(() => {
      if (!t2.rowKey.value)
        return {};
      const e = t2.data.value || [];
      return m2(e);
    }), v2 = computed(() => {
      const e = t2.rowKey.value, l = Object.keys(u2.value), a3 = {};
      return l.length ? (l.forEach((t3) => {
        if (u2.value[t3].length) {
          const l2 = {children: []};
          u2.value[t3].forEach((t4) => {
            const n = Tc(t4, e);
            l2.children.push(n), t4[d2.value] && !a3[n] && (a3[n] = {children: []});
          }), a3[t3] = l2;
        }
      }), a3) : a3;
    }), m2 = (e) => {
      const l = t2.rowKey.value, a3 = {};
      return Pc(e, (e2, t3, n) => {
        const o = Tc(e2, l);
        Array.isArray(t3) ? a3[o] = {children: t3.map((e3) => Tc(e3, l)), level: n} : s2.value && (a3[o] = {children: [], lazy: true, level: n});
      }, c2.value, d2.value), a3;
    }, f2 = () => {
      var e, t3;
      const l = h3.value, n = v2.value, o = Object.keys(l), r3 = {};
      if (o.length) {
        const t4 = unref(i2), u3 = (e = p3.store) === null || e === void 0 ? void 0 : e.states.defaultExpandAll.value, d3 = [], c3 = (e2, t5) => {
          const l2 = u3 || a2.value && a2.value.indexOf(t5) !== -1;
          return !!(e2 && e2.expanded || l2);
        };
        o.forEach((e2) => {
          const a3 = t4[e2], n2 = Object.assign({}, l[e2]);
          if (n2.expanded = c3(a3, e2), n2.lazy) {
            const {loaded: t5 = false, loading: l2 = false} = a3 || {};
            n2.loaded = !!t5, n2.loading = !!l2, d3.push(e2);
          }
          r3[e2] = n2;
        });
        const h4 = Object.keys(n);
        s2.value && h4.length && d3.length && h4.forEach((e2) => {
          const l2 = t4[e2], a3 = n[e2].children;
          if (d3.indexOf(e2) !== -1) {
            if (r3[e2].children.length !== 0)
              throw new Error("[ElTable]children must be an empty array.");
            r3[e2].children = a3;
          } else {
            const {loaded: t5 = false, loading: n2 = false} = l2 || {};
            r3[e2] = {lazy: true, loaded: !!t5, loading: !!n2, expanded: c3(l2, e2), children: a3, level: ""};
          }
        });
      }
      i2.value = r3, (t3 = p3.store) === null || t3 === void 0 || t3.updateTableScrollY();
    };
    watch(() => h3.value, f2), watch(() => v2.value, f2);
    const g2 = (e, l) => {
      p3.store.assertRowKey();
      const a3 = t2.rowKey.value, n = Tc(e, a3), o = n && i2.value[n];
      if (n && o && "expanded" in o) {
        const t3 = o.expanded;
        l = l === void 0 ? !o.expanded : l, i2.value[n].expanded = l, t3 !== l && p3.emit("expand-change", e, l), p3.store.updateTableScrollY();
      }
    }, b2 = (e, t3, l) => {
      const {load: a3} = p3.props;
      a3 && !i2.value[t3].loaded && (i2.value[t3].loading = true, a3(e, l, (l2) => {
        if (!Array.isArray(l2))
          throw new Error("[ElTable] data must be an array");
        i2.value[t3].loading = false, i2.value[t3].loaded = true, i2.value[t3].expanded = true, l2.length && (u2.value[t3] = l2), p3.emit("expand-change", e, true);
      }));
    };
    return {loadData: b2, loadOrToggle: (e) => {
      p3.store.assertRowKey();
      const l = t2.rowKey.value, a3 = Tc(e, l), n = i2.value[a3];
      s2.value && n && "loaded" in n && !n.loaded ? b2(e, a3, n) : g2(e, void 0);
    }, toggleTreeExpansion: g2, updateTreeExpandKeys: (e) => {
      a2.value = e, f2();
    }, updateTreeData: f2, normalize: m2, states: {expandRowKeys: a2, treeData: i2, indent: r2, lazy: s2, lazyTreeNodeMap: u2, lazyColumnIdentifier: d2, childrenColumnName: c2}};
  }({data: i, rowKey: a}), {updateCurrentRowData: K, updateCurrentRow: Y, setCurrentRowKey: q, states: U} = function(t2) {
    const a2 = getCurrentInstance(), n = ref(null), o = ref(null), i2 = () => {
      n.value = null;
    }, r2 = (e) => {
      const {data: l = [], rowKey: a3} = t2;
      let n2 = null;
      a3.value && (n2 = Ge(unref(l), (t3) => Tc(t3, a3.value) === e)), o.value = n2;
    };
    return {setCurrentRowKey: (e) => {
      a2.store.assertRowKey(), n.value = e, r2(e);
    }, restoreCurrentRowKey: i2, setCurrentRowByKey: r2, updateCurrentRow: (e) => {
      const t3 = o.value;
      if (e && e !== t3)
        return o.value = e, void a2.emit("current-change", o.value, t3);
      !e && t3 && (o.value = null, a2.emit("current-change", null, t3));
    }, updateCurrentRowData: () => {
      const e = t2.rowKey.value, l = t2.data.value || [], s2 = o.value;
      if (l.indexOf(s2) === -1 && s2) {
        if (e) {
          const t3 = Tc(s2, e);
          r2(t3);
        } else
          o.value = null;
        o.value === null && a2.emit("current-change", null, s2);
      } else
        n.value && (r2(n.value), i2());
    }, states: {_currentRowKey: n, currentRow: o}};
  }({data: i, rowKey: a});
  return {assertRowKey: () => {
    if (!a.value)
      throw new Error("[ElTable] prop row-key is required");
  }, updateColumns: O, scheduleLayout: I, isSelected: (e) => C.value.indexOf(e) > -1, clearSelection: () => {
    k.value = false;
    C.value.length && (C.value = [], t.emit("selection-change", []));
  }, cleanSelection: () => {
    let e;
    if (a.value) {
      e = [];
      const t2 = Nc(C.value, a.value), l = Nc(i.value, a.value);
      for (const a2 in t2)
        we(t2, a2) && !l[a2] && e.push(t2[a2].row);
    } else
      e = C.value.filter((e2) => i.value.indexOf(e2) === -1);
    if (e.length) {
      const l = C.value.filter((t2) => e.indexOf(t2) === -1);
      C.value = l, t.emit("selection-change", l.slice());
    }
  }, toggleRowSelection: (e, l, a2 = true) => {
    if (Ic(C.value, e, l)) {
      const l2 = (C.value || []).slice();
      a2 && t.emit("select", l2, e), t.emit("selection-change", l2);
    }
  }, _toggleAllSelection: () => {
    const e = w.value ? !k.value : !(k.value || C.value.length);
    k.value = e;
    let l = false;
    i.value.forEach((t2, a2) => {
      _.value ? _.value.call(null, t2, a2) && Ic(C.value, t2, e) && (l = true) : Ic(C.value, t2, e) && (l = true);
    }), l && t.emit("selection-change", C.value ? C.value.slice() : []), t.emit("select-all", C.value);
  }, updateSelectionByRowKey: () => {
    const e = Nc(C.value, a.value);
    i.value.forEach((t2) => {
      const l = Tc(t2, a.value), n = e[l];
      n && (C.value[n.index] = t2);
    });
  }, updateAllSelected: () => {
    var e;
    if (((e = i.value) === null || e === void 0 ? void 0 : e.length) === 0)
      return void (k.value = false);
    let t2;
    a.value && (t2 = Nc(C.value, a.value));
    let l = true, n = 0;
    for (let e2 = 0, r2 = (i.value || []).length; e2 < r2; e2++) {
      const r3 = i.value[e2], s2 = _.value && _.value.call(null, r3, e2);
      if (o = r3, t2 ? t2[Tc(o, a.value)] : C.value.indexOf(o) !== -1)
        n++;
      else if (!_.value || s2) {
        l = false;
        break;
      }
    }
    var o;
    n === 0 && (l = false), k.value = l;
  }, updateFilters: (e, t2) => {
    Array.isArray(e) || (e = [e]);
    const l = {};
    return e.forEach((e2) => {
      S.value[e2.id] = t2, l[e2.columnKey || e2.id] = t2;
    }), l;
  }, updateCurrentRow: Y, updateSort: P, execFilter: V, execSort: B, execQuery: (e) => {
    e && e.filter || V(), B();
  }, clearFilter: (e) => {
    const {tableHeader: l, fixedTableHeader: a2, rightFixedTableHeader: n} = t.refs;
    let o = {};
    l && (o = Object.assign(o, l.filterPanels)), a2 && (o = Object.assign(o, a2.filterPanels)), n && (o = Object.assign(o, n.filterPanels));
    const i2 = Object.keys(o);
    if (i2.length)
      if (typeof e == "string" && (e = [e]), Array.isArray(e)) {
        const l2 = e.map((e2) => function(e3, t2) {
          let l3 = null;
          for (let a3 = 0; a3 < e3.columns.length; a3++) {
            const n2 = e3.columns[a3];
            if (n2.columnKey === t2) {
              l3 = n2;
              break;
            }
          }
          return l3;
        }({columns: c.value}, e2));
        i2.forEach((e2) => {
          const t2 = l2.find((t3) => t3.id === e2);
          t2 && (t2.filteredValue = []);
        }), t.store.commit("filterChange", {column: l2, values: [], silent: true, multi: true});
      } else
        i2.forEach((e2) => {
          const t2 = c.value.find((t3) => t3.id === e2);
          t2 && (t2.filteredValue = []);
        }), S.value = {}, t.store.commit("filterChange", {column: {}, values: [], silent: true});
  }, clearSort: () => {
    M.value && (P(null, null, null), t.store.commit("changeSortCondition", {silent: true}));
  }, toggleRowExpansion: L, setExpandRowKeysAdapter: (e) => {
    A(e), R(e);
  }, setCurrentRowKey: q, toggleRowExpansionAdapter: (e, t2) => {
    c.value.some(({type: e2}) => e2 === "expand") ? L(e, t2) : H(e, t2);
  }, isRowExpanded: $, updateExpandRows: z, updateCurrentRowData: K, loadOrToggle: W, states: Object.assign(Object.assign(Object.assign({rowKey: a, data: i, _data: r, isComplex: s, _columns: u, originColumns: d, columns: c, fixedColumns: p2, rightFixedColumns: h2, leafColumns: v, fixedLeafColumns: m, rightFixedLeafColumns: f, leafColumnsLength: g, fixedLeafColumnsLength: b, rightFixedLeafColumnsLength: y, isAllSelected: k, selection: C, reserveSelection: x, selectOnIndeterminate: w, selectable: _, filters: S, filteredData: E, sortingColumn: M, sortProp: T, sortOrder: N, hoverRow: D}, F), j), U)};
}
function Lc(e, t) {
  return e.map((e2) => {
    var l;
    return e2.id === t.id ? t : (((l = e2.children) === null || l === void 0 ? void 0 : l.length) && (e2.children = Lc(e2.children, t)), e2);
  });
}
function zc(e) {
  e.forEach((e2) => {
    var t, l;
    e2.no = (t = e2.getColumnIndex) === null || t === void 0 ? void 0 : t.call(e2), ((l = e2.children) === null || l === void 0 ? void 0 : l.length) && zc(e2.children);
  }), e.sort((e2, t) => e2.no - t.no);
}
function Fc() {
  const t = getCurrentInstance(), l = {setData(e, l2) {
    const a2 = unref(e.data) !== l2;
    e.data.value = l2, e._data.value = l2, t.store.execQuery(), t.store.updateCurrentRowData(), t.store.updateExpandRows(), unref(e.reserveSelection) ? (t.store.assertRowKey(), t.store.updateSelectionByRowKey()) : a2 ? t.store.clearSelection() : t.store.cleanSelection(), t.store.updateAllSelected(), t.$ready && t.store.scheduleLayout();
  }, insertColumn(e, l2, a2) {
    const n = unref(e._columns);
    let o = [];
    a2 ? (a2 && !a2.children && (a2.children = []), a2.children.push(l2), o = Lc(n, a2)) : (n.push(l2), o = n), zc(o), e._columns.value = o, l2.type === "selection" && (e.selectable.value = l2.selectable, e.reserveSelection.value = l2.reserveSelection), t.$ready && (t.store.updateColumns(), t.store.scheduleLayout());
  }, removeColumn(e, l2, a2) {
    const n = unref(e._columns) || [];
    if (a2)
      a2.children.splice(a2.children.findIndex((e2) => e2.id === l2.id), 1), a2.children.length === 0 && delete a2.children, e._columns.value = Lc(n, a2);
    else {
      const t2 = n.indexOf(l2);
      t2 > -1 && (n.splice(t2, 1), e._columns.value = n);
    }
    t.$ready && (t.store.updateColumns(), t.store.scheduleLayout());
  }, sort(e, l2) {
    const {prop: a2, order: n, init: o} = l2;
    if (a2) {
      const l3 = Ge(unref(e.columns), (e2) => e2.property === a2);
      l3 && (l3.order = n, t.store.updateSort(l3, a2, n), t.store.commit("changeSortCondition", {init: o}));
    }
  }, changeSortCondition(e, l2) {
    const {sortingColumn: a2, sortProp: n, sortOrder: o} = e;
    unref(o) === null && (e.sortingColumn.value = null, e.sortProp.value = null);
    t.store.execQuery({filter: true}), l2 && (l2.silent || l2.init) || t.emit("sort-change", {column: unref(a2), prop: unref(n), order: unref(o)}), t.store.updateTableScrollY();
  }, filterChange(e, l2) {
    const {column: a2, values: n, silent: o} = l2, i = t.store.updateFilters(a2, n);
    t.store.execQuery(), o || t.emit("filter-change", i), t.store.updateTableScrollY();
  }, toggleAllSelection() {
    t.store.toggleAllSelection();
  }, rowSelectedChanged(e, l2) {
    t.store.toggleRowSelection(l2), t.store.updateAllSelected();
  }, setHoverRow(e, t2) {
    e.hoverRow.value = t2;
  }, setCurrentRow(e, l2) {
    t.store.updateCurrentRow(l2);
  }}, a = Ac();
  return Object.assign(Object.assign({}, a), {mutations: l, commit: function(e, ...l2) {
    const a2 = t.store.mutations;
    if (!a2[e])
      throw new Error("Action not found: " + e);
    a2[e].apply(t, [t.store.states].concat(l2));
  }, updateTableScrollY: function() {
    nextTick(() => t.layout.updateScrollY.apply(t.layout));
  }});
}
class $c {
  constructor(e) {
    this.observers = [], this.table = null, this.store = null, this.columns = [], this.fit = true, this.showHeader = true, this.height = ref(null), this.scrollX = ref(false), this.scrollY = ref(false), this.bodyWidth = ref(null), this.fixedWidth = ref(null), this.rightFixedWidth = ref(null), this.tableHeight = ref(null), this.headerHeight = ref(44), this.appendHeight = ref(0), this.footerHeight = ref(44), this.viewportHeight = ref(null), this.bodyHeight = ref(null), this.fixedBodyHeight = ref(null), this.gutterWidth = Mt();
    for (const t in e)
      we(e, t) && (isRef(this[t]) ? this[t].value = e[t] : this[t] = e[t]);
    if (!this.table)
      throw new Error("table is required for Table Layout");
    if (!this.store)
      throw new Error("store is required for Table Layout");
  }
  updateScrollY() {
    if (this.height.value === null)
      return false;
    const e = this.table.refs.bodyWrapper;
    if (this.table.vnode.el && e) {
      let t = true;
      const l = this.scrollY.value;
      if (this.bodyHeight.value === null)
        t = false;
      else {
        t = e.querySelector(".el-table__body").offsetHeight > this.bodyHeight.value;
      }
      return this.scrollY.value = t, l !== t;
    }
    return false;
  }
  setHeight(e, t = "height") {
    if (ye)
      return;
    const l = this.table.vnode.el;
    if (e = Oc(e), this.height.value = Number(e), !l && (e || e === 0))
      return nextTick(() => this.setHeight(e, t));
    typeof e == "number" ? (l.style[t] = e + "px", this.updateElsHeight()) : typeof e == "string" && (l.style[t] = e, this.updateElsHeight());
  }
  setMaxHeight(e) {
    this.setHeight(e, "max-height");
  }
  getFlattenColumns() {
    const e = [];
    return this.table.store.states.columns.value.forEach((t) => {
      t.isColumnGroup ? e.push.apply(e, t.columns) : e.push(t);
    }), e;
  }
  updateElsHeight() {
    if (!this.table.$ready)
      return nextTick(() => this.updateElsHeight());
    const {headerWrapper: e, appendWrapper: t, footerWrapper: l} = this.table.refs, a = t, n = e, o = l;
    if (this.appendHeight.value = a ? a.offsetHeight : 0, this.showHeader && !n)
      return;
    const i = n ? n.querySelector(".el-table__header tr") : null, r = this.headerDisplayNone(i), s = this.headerHeight.value = this.showHeader ? n.offsetHeight : 0;
    if (this.showHeader && !r && n.offsetWidth > 0 && (this.table.store.states.columns.value || []).length > 0 && s < 2)
      return nextTick(() => this.updateElsHeight());
    const u = this.tableHeight.value = this.table.vnode.el.clientHeight, d = this.footerHeight.value = o ? o.offsetHeight : 0;
    this.height.value !== null && (this.bodyHeight.value = u - s - d + (o ? 1 : 0)), this.fixedBodyHeight.value = this.scrollX.value ? this.bodyHeight.value - this.gutterWidth : this.bodyHeight.value, this.viewportHeight.value = this.scrollX.value ? u - this.gutterWidth : u, this.updateScrollY(), this.notifyObservers("scrollable");
  }
  headerDisplayNone(e) {
    if (!e)
      return true;
    let t = e;
    for (; t.tagName !== "DIV"; ) {
      if (getComputedStyle(t).display === "none")
        return true;
      t = t.parentElement;
    }
    return false;
  }
  updateColumnsWidth() {
    if (ye)
      return;
    const e = this.fit, t = this.table.vnode.el.clientWidth;
    let l = 0;
    const a = this.getFlattenColumns(), n = a.filter((e2) => typeof e2.width != "number");
    if (a.forEach((e2) => {
      typeof e2.width == "number" && e2.realWidth && (e2.realWidth = null);
    }), n.length > 0 && e) {
      a.forEach((e3) => {
        l += e3.width || e3.minWidth || 80;
      });
      const e2 = this.scrollY.value ? this.gutterWidth : 0;
      if (l <= t - e2) {
        this.scrollX.value = false;
        const a2 = t - e2 - l;
        if (n.length === 1)
          n[0].realWidth = (n[0].minWidth || 80) + a2;
        else {
          const e3 = a2 / n.reduce((e4, t3) => e4 + (t3.minWidth || 80), 0);
          let t2 = 0;
          n.forEach((l2, a3) => {
            if (a3 === 0)
              return;
            const n2 = Math.floor((l2.minWidth || 80) * e3);
            t2 += n2, l2.realWidth = (l2.minWidth || 80) + n2;
          }), n[0].realWidth = (n[0].minWidth || 80) + a2 - t2;
        }
      } else
        this.scrollX.value = true, n.forEach(function(e3) {
          e3.realWidth = e3.minWidth;
        });
      this.bodyWidth.value = Math.max(l, t), this.table.state.resizeState.value.width = this.bodyWidth.value;
    } else
      a.forEach((e2) => {
        e2.width || e2.minWidth ? e2.realWidth = e2.width || e2.minWidth : e2.realWidth = 80, l += e2.realWidth;
      }), this.scrollX.value = l > t, this.bodyWidth.value = l;
    const o = this.store.states.fixedColumns.value;
    if (o.length > 0) {
      let e2 = 0;
      o.forEach(function(t2) {
        e2 += t2.realWidth || t2.width;
      }), this.fixedWidth.value = e2;
    }
    const i = this.store.states.rightFixedColumns.value;
    if (i.length > 0) {
      let e2 = 0;
      i.forEach(function(t2) {
        e2 += t2.realWidth || t2.width;
      }), this.rightFixedWidth.value = e2;
    }
    this.notifyObservers("columns");
  }
  addObserver(e) {
    this.observers.push(e);
  }
  removeObserver(e) {
    const t = this.observers.indexOf(e);
    t !== -1 && this.observers.splice(t, 1);
  }
  notifyObservers(e) {
    this.observers.forEach((t) => {
      var l, a;
      switch (e) {
        case "columns":
          (l = t.state) === null || l === void 0 || l.onColumnsChange(this);
          break;
        case "scrollable":
          (a = t.state) === null || a === void 0 || a.onScrollableChange(this);
          break;
        default:
          throw new Error(`Table Layout don't have event ${e}.`);
      }
    });
  }
}
var Rc = defineComponent({name: "ElTableFilterPanel", components: {ElCheckbox: Mn, ElCheckboxGroup: mo, ElScrollbar: yl, ElPopper: Hl}, directives: {ClickOutside: $t}, props: {placement: {type: String, default: "bottom-start"}, store: {type: Object}, column: {type: Object}, upDataColumn: {type: Function}}, setup(t) {
  const a = getCurrentInstance(), i = a.parent;
  i.filterPanels.value[t.column.id] || (i.filterPanels.value[t.column.id] = a);
  const r = ref(false), s = ref(null), u = computed(() => t.column && t.column.filters), d = computed({get: () => (t.column.filteredValue || [])[0], set: (e) => {
    c.value && (e != null ? c.value.splice(0, 1, e) : c.value.splice(0, 1));
  }}), c = computed({get: () => t.column && t.column.filteredValue || [], set(e) {
    t.column && t.upDataColumn("filteredValue", e);
  }}), p2 = computed(() => !t.column || t.column.filterMultiple), h2 = () => {
    r.value = false;
  }, v = (e) => {
    t.store.commit("filterChange", {column: t.column, values: e}), t.store.updateAllSelected();
  };
  watch(r, (e) => {
    t.column && t.upDataColumn("filterOpened", e);
  }, {immediate: true});
  const m = computed(() => {
    var e;
    return (e = s.value) === null || e === void 0 ? void 0 : e.popperRef;
  });
  return {tooltipVisible: r, multiple: p2, filteredValue: c, filterValue: d, filters: u, handleConfirm: () => {
    v(c.value), h2();
  }, handleReset: () => {
    c.value = [], v(c.value), h2();
  }, handleSelect: (e) => {
    d.value = e, v(e != null ? c.value : []), h2();
  }, isActive: (e) => e.value === d.value, t: ya, showFilterPanel: (e) => {
    e.stopPropagation(), r.value = !r.value;
  }, hideFilterPanel: () => {
    r.value = false;
  }, popperPaneRef: m, tooltip: s};
}});
const Hc = {key: 0}, Wc = {class: "el-table-filter__content"}, jc = {class: "el-table-filter__bottom"}, Kc = {key: 1, class: "el-table-filter__list"};
function Yc(t) {
  const l = getCurrentInstance();
  onBeforeMount(() => {
    a.value.addObserver(l);
  }), onMounted(() => {
    o(a.value), r(a.value);
  }), onUpdated(() => {
    o(a.value), r(a.value);
  }), onUnmounted(() => {
    a.value.removeObserver(l);
  });
  const a = computed(() => {
    const e = t.layout;
    if (!e)
      throw new Error("Can not find table layout.");
    return e;
  }), o = (e) => {
    var l2;
    const a2 = ((l2 = t.vnode.el) === null || l2 === void 0 ? void 0 : l2.querySelectorAll("colgroup > col")) || [];
    if (!a2.length)
      return;
    const n = e.getFlattenColumns(), o2 = {};
    n.forEach((e2) => {
      o2[e2.id] = e2;
    });
    for (let e2 = 0, t2 = a2.length; e2 < t2; e2++) {
      const t3 = a2[e2], l3 = t3.getAttribute("name"), n2 = o2[l3];
      n2 && t3.setAttribute("width", n2.realWidth || n2.width);
    }
  }, r = (e) => {
    const l2 = t.vnode.el.querySelectorAll("colgroup > col[name=gutter]");
    for (let t2 = 0, a3 = l2.length; t2 < a3; t2++) {
      l2[t2].setAttribute("width", e.scrollY.value ? e.gutterWidth : "0");
    }
    const a2 = t.vnode.el.querySelectorAll("th.gutter");
    for (let t2 = 0, l3 = a2.length; t2 < l3; t2++) {
      const l4 = a2[t2];
      l4.style.width = e.scrollY.value ? e.gutterWidth + "px" : "0", l4.style.display = e.scrollY.value ? "" : "none";
    }
  };
  return {tableLayout: a.value, onColumnsChange: o, onScrollableChange: r};
}
function qc(t) {
  const l = getCurrentInstance().parent, a = l.store.states;
  return {getHeaderRowStyle: (e) => {
    const t2 = l.props.headerRowStyle;
    return typeof t2 == "function" ? t2.call(null, {rowIndex: e}) : t2;
  }, getHeaderRowClass: (e) => {
    const t2 = [], a2 = l.props.headerRowClassName;
    return typeof a2 == "string" ? t2.push(a2) : typeof a2 == "function" && t2.push(a2.call(null, {rowIndex: e})), t2.join(" ");
  }, getHeaderCellStyle: (e, t2, a2, n) => {
    const o = l.props.headerCellStyle;
    return typeof o == "function" ? o.call(null, {rowIndex: e, columnIndex: t2, row: a2, column: n}) : o;
  }, getHeaderCellClass: (e, n, o, i) => {
    const r = [i.id, i.order, i.headerAlign, i.className, i.labelClassName];
    e === 0 && ((e2, l2) => {
      let n2 = 0;
      for (let t2 = 0; t2 < e2; t2++)
        n2 += l2[t2].colSpan;
      const o2 = n2 + l2[e2].colSpan - 1;
      return t.fixed === "left" ? o2 >= a.fixedLeafColumnsLength.value : t.fixed === "right" ? n2 < a.columns.value.length - a.rightFixedLeafColumnsLength.value : o2 < a.fixedLeafColumnsLength.value || n2 >= a.columns.value.length - a.rightFixedLeafColumnsLength.value;
    })(n, o) && r.push("is-hidden"), i.children || r.push("is-leaf"), i.sortable && r.push("is-sortable");
    const s = l.props.headerCellClassName;
    return typeof s == "string" ? r.push(s) : typeof s == "function" && r.push(s.call(null, {rowIndex: e, columnIndex: n, row: o, column: i})), r.join(" ");
  }};
}
Rc.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-checkbox"), r = resolveComponent("el-checkbox-group"), c = resolveComponent("el-scrollbar"), p2 = resolveComponent("el-popper"), m = resolveDirective("click-outside");
  return openBlock(), createBlock(p2, {ref: "tooltip", visible: e.tooltipVisible, "onUpdate:visible": t[6] || (t[6] = (t2) => e.tooltipVisible = t2), offset: 0, placement: e.placement, "show-arrow": false, "stop-popper-mouse-event": false, effect: "light", pure: "", "manual-mode": "", "popper-class": "el-table-filter", "append-to-body": ""}, {default: withCtx(() => [e.multiple ? (openBlock(), createBlock("div", Hc, [createVNode("div", Wc, [createVNode(c, {"wrap-class": "el-table-filter__wrap"}, {default: withCtx(() => [createVNode(r, {modelValue: e.filteredValue, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.filteredValue = t2), class: "el-table-filter__checkbox-group"}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.filters, (e2) => (openBlock(), createBlock(i, {key: e2.value, label: e2.value}, {default: withCtx(() => [createTextVNode(toDisplayString(e2.text), 1)]), _: 2}, 1032, ["label"]))), 128))]), _: 1}, 8, ["modelValue"])]), _: 1})]), createVNode("div", jc, [createVNode("button", {class: {"is-disabled": e.filteredValue.length === 0}, disabled: e.filteredValue.length === 0, type: "", onClick: t[2] || (t[2] = (...t2) => e.handleConfirm && e.handleConfirm(...t2))}, toDisplayString(e.t("el.table.confirmFilter")), 11, ["disabled"]), createVNode("button", {type: "", onClick: t[3] || (t[3] = (...t2) => e.handleReset && e.handleReset(...t2))}, toDisplayString(e.t("el.table.resetFilter")), 1)])])) : (openBlock(), createBlock("ul", Kc, [createVNode("li", {class: [{"is-active": e.filterValue === void 0 || e.filterValue === null}, "el-table-filter__list-item"], onClick: t[4] || (t[4] = (t2) => e.handleSelect(null))}, toDisplayString(e.t("el.table.clearFilter")), 3), (openBlock(true), createBlock(Fragment, null, renderList(e.filters, (t2) => (openBlock(), createBlock("li", {key: t2.value, class: [{"is-active": e.isActive(t2)}, "el-table-filter__list-item"], label: t2.value, onClick: (l2) => e.handleSelect(t2.value)}, toDisplayString(t2.text), 11, ["label", "onClick"]))), 128))]))]), trigger: withCtx(() => [withDirectives(createVNode("span", {class: "el-table__column-filter-trigger el-none-outline", onClick: t[5] || (t[5] = (...t2) => e.showFilterPanel && e.showFilterPanel(...t2))}, [createVNode("i", {class: ["el-icon-arrow-down", e.column.filterOpened ? "el-icon-arrow-up" : ""]}, null, 2)], 512), [[m, e.hideFilterPanel, e.popperPaneRef]])]), _: 1}, 8, ["visible", "placement"]);
}, Rc.__file = "packages/table/src/filter-panel.vue";
const Uc = (e) => {
  const t = [];
  return e.forEach((e2) => {
    e2.children ? (t.push(e2), t.push.apply(t, Uc(e2.children))) : t.push(e2);
  }), t;
};
function Gc(t) {
  const l = getCurrentInstance().parent, a = computed(() => ((e) => {
    let t2 = 1;
    const l2 = (e2, a3) => {
      if (a3 && (e2.level = a3.level + 1, t2 < e2.level && (t2 = e2.level)), e2.children) {
        let t3 = 0;
        e2.children.forEach((a4) => {
          l2(a4, e2), t3 += a4.colSpan;
        }), e2.colSpan = t3;
      } else
        e2.colSpan = 1;
    };
    e.forEach((e2) => {
      e2.level = 1, l2(e2, void 0);
    });
    const a2 = [];
    for (let e2 = 0; e2 < t2; e2++)
      a2.push([]);
    return Uc(e).forEach((e2) => {
      e2.children ? e2.rowSpan = 1 : e2.rowSpan = t2 - e2.level + 1, a2[e2.level - 1].push(e2);
    }), a2;
  })(t.store.states.originColumns.value));
  return {isGroup: computed(() => {
    const e = a.value.length > 1;
    return e && (l.state.isGroup.value = true), e;
  }), toggleAllSelection: (e) => {
    e.stopPropagation(), l.store.commit("toggleAllSelection");
  }, columnRows: a};
}
function Xc() {
  return h("col", {name: "gutter"});
}
function Zc(e, t = false) {
  return h("colgroup", {}, [...e.map((e2) => h("col", {name: e2.id, key: e2.id})), t && Xc()]);
}
var Qc = defineComponent({name: "ElTableHeader", components: {ElCheckbox: Mn}, props: {fixed: {type: String, default: ""}, store: {required: true, type: Object}, border: Boolean, defaultSort: {type: Object, default: () => ({prop: "", order: ""})}}, setup(t, {emit: a}) {
  const o = getCurrentInstance(), r = o.parent, s = r.store.states, u = ref({}), {tableLayout: d, onColumnsChange: c, onScrollableChange: p2} = Yc(r), h2 = computed(() => !t.fixed && d.gutterWidth);
  onMounted(() => {
    nextTick(() => {
      const {prop: e, order: l} = t.defaultSort;
      r.store.commit("sort", {prop: e, order: l, init: true});
    });
  });
  const {handleHeaderClick: v, handleHeaderContextMenu: m, handleMouseDown: f, handleMouseMove: g, handleMouseOut: b, handleSortClick: y, handleFilterClick: k} = function(t2, a2) {
    const n = getCurrentInstance(), o2 = n.parent, i = (e) => {
      e.stopPropagation();
    }, r2 = ref(null), s2 = ref(false), u2 = ref({}), d2 = (e, l, a3) => {
      e.stopPropagation();
      const n2 = l.order === a3 ? null : a3 || (({order: e2, sortOrders: t3}) => {
        if (e2 === "")
          return t3[0];
        const l2 = t3.indexOf(e2 || null);
        return t3[l2 > t3.length - 2 ? 0 : l2 + 1];
      })(l);
      let i2 = e.target;
      for (; i2 && i2.tagName !== "TH"; )
        i2 = i2.parentNode;
      if (i2 && i2.tagName === "TH" && at(i2, "noclick"))
        return void ot(i2, "noclick");
      if (!l.sortable)
        return;
      const r3 = t2.store.states;
      let s3, u3 = r3.sortProp.value;
      const d3 = r3.sortingColumn.value;
      (d3 !== l || d3 === l && d3.order === null) && (d3 && (d3.order = null), r3.sortingColumn.value = l, u3 = l.property), s3 = l.order = n2 || null, r3.sortProp.value = u3, r3.sortOrder.value = s3, o2.store.commit("changeSortCondition");
    };
    return {handleHeaderClick: (e, t3) => {
      !t3.filters && t3.sortable ? d2(e, t3, false) : t3.filterable && !t3.sortable && i(e), o2.emit("header-click", t3, e);
    }, handleHeaderContextMenu: (e, t3) => {
      o2.emit("header-contextmenu", t3, e);
    }, handleMouseDown: (e, l) => {
      if (!ye && !(l.children && l.children.length > 0) && r2.value && t2.border) {
        s2.value = true;
        const i2 = o2;
        a2("set-drag-visible", true);
        const d3 = i2.vnode.el.getBoundingClientRect().left, c2 = n.vnode.el.querySelector("th." + l.id), p3 = c2.getBoundingClientRect(), h3 = p3.left - d3 + 30;
        nt(c2, "noclick"), u2.value = {startMouseLeft: e.clientX, startLeft: p3.right - d3, startColumnLeft: p3.left - d3, tableLeft: d3};
        const v2 = i2.refs.resizeProxy;
        v2.style.left = u2.value.startLeft + "px", document.onselectstart = function() {
          return false;
        }, document.ondragstart = function() {
          return false;
        };
        const m2 = (e2) => {
          const t3 = e2.clientX - u2.value.startMouseLeft, l2 = u2.value.startLeft + t3;
          v2.style.left = Math.max(h3, l2) + "px";
        }, f2 = () => {
          if (s2.value) {
            const {startColumnLeft: n2, startLeft: o3} = u2.value, d4 = parseInt(v2.style.left, 10) - n2;
            l.width = l.realWidth = d4, i2.emit("header-dragend", l.width, o3 - n2, l, e), t2.store.scheduleLayout(false, true), document.body.style.cursor = "", s2.value = false, r2.value = null, u2.value = {}, a2("set-drag-visible", false);
          }
          document.removeEventListener("mousemove", m2), document.removeEventListener("mouseup", f2), document.onselectstart = null, document.ondragstart = null, setTimeout(function() {
            ot(c2, "noclick");
          }, 0);
        };
        document.addEventListener("mousemove", m2), document.addEventListener("mouseup", f2);
      }
    }, handleMouseMove: (e, l) => {
      if (l.children && l.children.length > 0)
        return;
      let a3 = e.target;
      for (; a3 && a3.tagName !== "TH"; )
        a3 = a3.parentNode;
      if (l && l.resizable && !s2.value && t2.border) {
        const t3 = a3.getBoundingClientRect(), n2 = document.body.style;
        t3.width > 12 && t3.right - e.pageX < 8 ? (n2.cursor = "col-resize", at(a3, "is-sortable") && (a3.style.cursor = "col-resize"), r2.value = l) : s2.value || (n2.cursor = "", at(a3, "is-sortable") && (a3.style.cursor = "pointer"), r2.value = null);
      }
    }, handleMouseOut: () => {
      ye || (document.body.style.cursor = "");
    }, handleSortClick: d2, handleFilterClick: i};
  }(t, a), {getHeaderRowStyle: C, getHeaderRowClass: x, getHeaderCellStyle: _, getHeaderCellClass: S} = qc(t), {isGroup: E, toggleAllSelection: M, columnRows: T} = Gc(t);
  return o.state = {onColumnsChange: c, onScrollableChange: p2}, o.filterPanels = u, {columns: s.columns, filterPanels: u, hasGutter: h2, onColumnsChange: c, onScrollableChange: p2, columnRows: T, getHeaderRowClass: x, getHeaderRowStyle: C, getHeaderCellClass: S, getHeaderCellStyle: _, handleHeaderClick: v, handleHeaderContextMenu: m, handleMouseDown: f, handleMouseMove: g, handleMouseOut: b, handleSortClick: y, handleFilterClick: k, isGroup: E, toggleAllSelection: M};
}, render() {
  return h("table", {border: "0", cellpadding: "0", cellspacing: "0", class: "el-table__header"}, [Zc(this.columns, this.hasGutter), h("thead", {class: {"is-group": this.isGroup, "has-gutter": this.hasGutter}}, this.columnRows.map((e, t) => h("tr", {class: this.getHeaderRowClass(t), key: t, style: this.getHeaderRowStyle(t)}, e.map((l, a) => h("th", {class: this.getHeaderCellClass(t, a, e, l), colspan: l.colSpan, key: l.id + "-thead", rowSpan: l.rowSpan, style: this.getHeaderCellStyle(t, a, e, l), onClick: (e2) => this.handleHeaderClick(e2, l), onContextmenu: (e2) => this.handleHeaderContextMenu(e2, l), onMousedown: (e2) => this.handleMouseDown(e2, l), onMousemove: (e2) => this.handleMouseMove(e2, l), onMouseout: this.handleMouseOut}, [h("div", {class: ["cell", l.filteredValue && l.filteredValue.length > 0 ? "highlight" : "", l.labelClassName]}, [l.renderHeader ? l.renderHeader({column: l, $index: a, store: this.store, _self: this.$parent}) : l.label, l.sortable && h("span", {onClick: (e2) => this.handleSortClick(e2, l), class: "caret-wrapper"}, [h("i", {onClick: (e2) => this.handleSortClick(e2, l, "ascending"), class: "sort-caret ascending"}), h("i", {onClick: (e2) => this.handleSortClick(e2, l, "descending"), class: "sort-caret descending"})]), l.filterable && h(Rc, {store: this.$parent.store, placement: l.filterPlacement || "bottom-start", column: l, upDataColumn: (e2, t2) => {
    l[e2] = t2;
  }})])])))))]);
}});
function Jc(t) {
  const a = getCurrentInstance().parent, n = ref(""), o = ref(h("div")), i = (e, l, n2) => {
    const o2 = a, i2 = wc(e);
    let r;
    i2 && (r = Mc({columns: t.store.states.columns.value}, i2), r && o2.emit("cell-" + n2, l, r, i2, e)), o2.emit("row-" + n2, l, r, e);
  };
  return {handleDoubleClick: (e, t2) => {
    i(e, t2, "dblclick");
  }, handleClick: (e, l) => {
    t.store.commit("setCurrentRow", l), i(e, l, "click");
  }, handleContextMenu: (e, t2) => {
    i(e, t2, "contextmenu");
  }, handleMouseEnter: debounce_1(function(e) {
    t.store.commit("setHoverRow", e);
  }, 30), handleMouseLeave: debounce_1(function() {
    t.store.commit("setHoverRow", null);
  }, 30), handleCellMouseEnter: (e, l) => {
    const n2 = a, o2 = wc(e);
    if (o2) {
      const a2 = Mc({columns: t.store.states.columns.value}, o2), i3 = n2.hoverState = {cell: o2, column: a2, row: l};
      n2.emit("cell-mouse-enter", i3.row, i3.column, i3.cell, e);
    }
    const i2 = e.target.querySelector(".cell");
    if (!at(i2, "el-tooltip") || !i2.childNodes.length)
      return;
    const r = document.createRange();
    r.setStart(i2, 0), r.setEnd(i2, i2.childNodes.length);
    (r.getBoundingClientRect().width + ((parseInt(it(i2, "paddingLeft"), 10) || 0) + (parseInt(it(i2, "paddingRight"), 10) || 0)) > i2.offsetWidth || i2.scrollWidth > i2.offsetWidth) && function(e2, t2, l2, a2) {
      function n3() {
        o3 && o3.update();
      }
      Vc = function t3() {
        try {
          o3 && o3.destroy(), i3 && document.body.removeChild(i3), lt(e2, "mouseenter", n3), lt(e2, "mouseleave", t3);
        } catch (e3) {
        }
      };
      let o3 = null;
      const i3 = function() {
        const e3 = a2 === "light", l3 = document.createElement("div");
        return l3.className = "el-popper " + (e3 ? "is-light" : "is-dark"), l3.innerHTML = t2, l3.style.zIndex = String(Pl.nextZIndex()), document.body.appendChild(l3), l3;
      }(), r2 = function() {
        const e3 = document.createElement("div");
        return e3.className = "el-popper__arrow", e3.style.bottom = "-4px", e3;
      }();
      i3.appendChild(r2), o3 = createPopper(e2, i3, Object.assign({modifiers: [{name: "offset", options: {offset: [0, 8]}}, {name: "arrow", options: {element: r2, padding: 10}}]}, l2)), tt(e2, "mouseenter", n3), tt(e2, "mouseleave", Vc);
    }(o2, o2.innerText || o2.textContent, {placement: "top", strategy: "fixed"}, l.tooltipEffect);
  }, handleCellMouseLeave: (e) => {
    if (!wc(e))
      return;
    const t2 = a.hoverState;
    a.emit("cell-mouse-leave", t2 == null ? void 0 : t2.row, t2 == null ? void 0 : t2.column, t2 == null ? void 0 : t2.cell, e);
  }, tooltipContent: n, tooltipTrigger: o};
}
function ep(t) {
  const l = getCurrentInstance().parent, {handleDoubleClick: a, handleClick: o, handleContextMenu: i, handleMouseEnter: r, handleMouseLeave: s, handleCellMouseEnter: u, handleCellMouseLeave: d, tooltipContent: c, tooltipTrigger: p2} = Jc(t), {getRowStyle: h$1, getRowClass: v, getCellStyle: m, getCellClass: f, getSpan: g, getColspanRealWidth: b} = function(t2) {
    const l2 = getCurrentInstance().parent, a2 = (e) => t2.fixed === "left" ? e >= t2.store.states.fixedLeafColumnsLength.value : t2.fixed === "right" ? e < t2.store.states.columns.value.length - t2.store.states.rightFixedLeafColumnsLength.value : e < t2.store.states.fixedLeafColumnsLength.value || e >= t2.store.states.columns.value.length - t2.store.states.rightFixedLeafColumnsLength.value;
    return {getRowStyle: (e, t3) => {
      const a3 = l2.props.rowStyle;
      return typeof a3 == "function" ? a3.call(null, {row: e, rowIndex: t3}) : a3 || null;
    }, getRowClass: (e, a3) => {
      const n = ["el-table__row"];
      l2.props.highlightCurrentRow && e === t2.store.states.currentRow.value && n.push("current-row"), t2.stripe && a3 % 2 == 1 && n.push("el-table__row--striped");
      const o2 = l2.props.rowClassName;
      return typeof o2 == "string" ? n.push(o2) : typeof o2 == "function" && n.push(o2.call(null, {row: e, rowIndex: a3})), t2.store.states.expandRows.value.indexOf(e) > -1 && n.push("expanded"), n;
    }, getCellStyle: (e, t3, a3, n) => {
      const o2 = l2.props.cellStyle;
      return typeof o2 == "function" ? o2.call(null, {rowIndex: e, columnIndex: t3, row: a3, column: n}) : o2;
    }, getCellClass: (e, t3, n, o2) => {
      const i2 = [o2.id, o2.align, o2.className];
      a2(t3) && i2.push("is-hidden");
      const r2 = l2.props.cellClassName;
      return typeof r2 == "string" ? i2.push(r2) : typeof r2 == "function" && i2.push(r2.call(null, {rowIndex: e, columnIndex: t3, row: n, column: o2})), i2.join(" ");
    }, getSpan: (e, t3, a3, n) => {
      let o2 = 1, i2 = 1;
      const r2 = l2.props.spanMethod;
      if (typeof r2 == "function") {
        const l3 = r2({row: e, column: t3, rowIndex: a3, columnIndex: n});
        Array.isArray(l3) ? (o2 = l3[0], i2 = l3[1]) : typeof l3 == "object" && (o2 = l3.rowspan, i2 = l3.colspan);
      }
      return {rowspan: o2, colspan: i2};
    }, getColspanRealWidth: (e, t3, l3) => t3 < 1 ? e[l3].realWidth : e.map(({realWidth: e2, width: t4}) => e2 || t4).slice(l3, l3 + t3).reduce((e2, t4) => e2 + t4, -1), isColumnHidden: a2};
  }(t), y = computed(() => {
    return e = t.store.states.columns.value, l2 = ({type: e2}) => e2 === "default", e.findIndex(l2);
    var e, l2;
  }), k = (e, t2) => {
    const a2 = l.props.rowKey;
    return a2 ? Tc(e, a2) : t2;
  }, C = (e, n, c2) => {
    const {tooltipEffect: p3, store: C2} = t, {indent: x, columns: w} = C2.states, _ = v(e, n);
    let S = true;
    c2 && (_.push("el-table__row--level-" + c2.level), S = c2.display);
    return h("tr", {style: [S ? null : {display: "none"}, h$1(e, n)], class: _, key: k(e, n), onDblclick: (t2) => a(t2, e), onClick: (t2) => o(t2, e), onContextmenu: (t2) => i(t2, e), onMouseenter: () => r(n), onMouseleave: s}, w.value.map((a2, o2) => {
      const {rowspan: i2, colspan: r2} = g(e, a2, n, o2);
      if (!i2 || !r2)
        return null;
      const s2 = Object.assign({}, a2);
      s2.realWidth = b(w.value, r2, o2);
      const h$12 = {store: t.store, _self: t.context || l, column: s2, row: e, $index: n};
      o2 === y.value && c2 && (h$12.treeNode = {indent: c2.level * x.value, level: c2.level}, typeof c2.expanded == "boolean" && (h$12.treeNode.expanded = c2.expanded, "loading" in c2 && (h$12.treeNode.loading = c2.loading), "noLazyChildren" in c2 && (h$12.treeNode.noLazyChildren = c2.noLazyChildren)));
      const v2 = `${n},${o2}`;
      return h("td", {style: m(n, o2, e, a2), class: f(n, o2, e, a2), key: v2, rowspan: i2, colspan: r2, onMouseenter: (t2) => u(t2, Object.assign(Object.assign({}, e), {tooltipEffect: p3})), onMouseleave: d}, [a2.renderCell(h$12)]);
    }));
  };
  return {wrappedRowRender: (e, a2) => {
    const n = t.store, {isRowExpanded: o2, assertRowKey: i2} = n, {treeData: r2, lazyTreeNodeMap: s2, childrenColumnName: u2, rowKey: d2} = n.states;
    if (n.states.columns.value.some(({type: e2}) => e2 === "expand") && o2(e)) {
      const t2 = l.renderExpanded, o3 = C(e, a2, void 0);
      return t2 ? [o3, h("tr", {key: "expanded-row__" + o3.key}, [h("td", {colspan: n.states.columns.value.length, class: "el-table__expanded-cell"}, [t2({row: e, $index: a2, store: n})])])] : (console.error("[Element Error]renderExpanded is required."), o3);
    }
    if (Object.keys(r2.value).length) {
      i2();
      const t2 = Tc(e, d2.value);
      let l2 = r2.value[t2], n2 = null;
      l2 && (n2 = {expanded: l2.expanded, level: l2.level, display: true}, typeof l2.lazy == "boolean" && (typeof l2.loaded == "boolean" && l2.loaded && (n2.noLazyChildren = !(l2.children && l2.children.length)), n2.loading = l2.loading));
      const o3 = [C(e, a2, n2)];
      if (l2) {
        let n3 = 0;
        const i3 = (e2, t3) => {
          e2 && e2.length && t3 && e2.forEach((e3) => {
            const c3 = {display: t3.display && t3.expanded, level: t3.level + 1, expanded: false, noLazyChildren: false, loading: false}, p3 = Tc(e3, d2.value);
            if (p3 == null)
              throw new Error("for nested data item, row-key is required.");
            if (l2 = Object.assign({}, r2.value[p3]), l2 && (c3.expanded = l2.expanded, l2.level = l2.level || c3.level, l2.display = !(!l2.expanded || !c3.display), typeof l2.lazy == "boolean" && (typeof l2.loaded == "boolean" && l2.loaded && (c3.noLazyChildren = !(l2.children && l2.children.length)), c3.loading = l2.loading)), n3++, o3.push(C(e3, a2 + n3, c3)), l2) {
              const t4 = s2.value[p3] || e3[u2.value];
              i3(t4, l2);
            }
          });
        };
        l2.display = true;
        const c2 = s2.value[t2] || e[u2.value];
        i3(c2, l2);
      }
      return o3;
    }
    return C(e, a2, void 0);
  }, tooltipContent: c, tooltipTrigger: p2};
}
var tp = defineComponent({name: "ElTableBody", props: {store: {required: true, type: Object}, stripe: Boolean, tooltipEffect: String, context: {default: () => ({}), type: Object}, rowClassName: [String, Function], rowStyle: [Object, Function], fixed: {type: String, default: ""}, highlight: Boolean}, setup(t) {
  const l = getCurrentInstance(), a = l.parent, {wrappedRowRender: n, tooltipContent: i, tooltipTrigger: r} = ep(t), {onColumnsChange: s, onScrollableChange: u} = Yc(a);
  return watch(t.store.states.hoverRow, (e, a2) => {
    if (!t.store.states.isComplex.value || ye)
      return;
    let n2 = window.requestAnimationFrame;
    n2 || (n2 = (e2) => window.setTimeout(e2, 16)), n2(() => {
      const t2 = l.vnode.el.querySelectorAll(".el-table__row"), n3 = t2[a2], o = t2[e];
      n3 && ot(n3, "hover-row"), o && nt(o, "hover-row");
    });
  }), onUnmounted(() => {
    Vc == null || Vc();
  }), onUpdated(() => {
    Vc == null || Vc();
  }), {onColumnsChange: s, onScrollableChange: u, wrappedRowRender: n, tooltipContent: i, tooltipTrigger: r};
}, render() {
  const e = this.store.states.data.value || [];
  return h("table", {class: "el-table__body", cellspacing: "0", cellpadding: "0", border: "0"}, [Zc(this.store.states.columns.value), h("tbody", {}, [e.reduce((e2, t) => e2.concat(this.wrappedRowRender(t, e2.length)), [])])]);
}});
function lp(t) {
  const l = getCurrentInstance().parent, a = l.store, {leftFixedLeafCount: o, rightFixedLeafCount: i, columnsCount: r, leftFixedCount: s, rightFixedCount: u, columns: d} = function() {
    const t2 = getCurrentInstance().parent.store;
    return {leftFixedLeafCount: computed(() => t2.states.fixedLeafColumnsLength.value), rightFixedLeafCount: computed(() => t2.states.rightFixedColumns.value.length), columnsCount: computed(() => t2.states.columns.value.length), leftFixedCount: computed(() => t2.states.fixedColumns.value.length), rightFixedCount: computed(() => t2.states.rightFixedColumns.value.length), columns: t2.states.columns};
  }(), c = computed(() => !t.fixed && l.layout.gutterWidth);
  return {hasGutter: c, getRowClasses: (e, l2) => {
    const n = [e.id, e.align, e.labelClassName];
    return e.className && n.push(e.className), ((e2, l3, a2) => {
      if (t.fixed || t.fixed === "left")
        return e2 >= o.value;
      if (t.fixed === "right") {
        let t2 = 0;
        for (let a3 = 0; a3 < e2; a3++)
          t2 += l3[a3].colSpan;
        return t2 < r.value - i.value;
      }
      return !(t.fixed || !a2.fixed) || e2 < s.value || e2 >= r.value - u.value;
    })(l2, a.states.columns.value, e) && n.push("is-hidden"), e.children || n.push("is-leaf"), n;
  }, columns: d};
}
var ap = defineComponent({name: "ElTableFooter", props: {fixed: {type: String, default: ""}, store: {required: true, type: Object}, summaryMethod: Function, sumText: String, border: Boolean, defaultSort: {type: Object, default: () => ({prop: "", order: ""})}}, setup(e) {
  const {hasGutter: t, getRowClasses: l, columns: a} = lp(e);
  return {getRowClasses: l, hasGutter: t, columns: a};
}, render() {
  let e = [];
  return this.summaryMethod ? e = this.summaryMethod({columns: this.columns, data: this.store.states.data.value}) : this.columns.forEach((t, l) => {
    if (l === 0)
      return void (e[l] = this.sumText);
    const a = this.store.states.data.value.map((e2) => Number(e2[t.property])), n = [];
    let o = true;
    a.forEach((e2) => {
      if (!isNaN(e2)) {
        o = false;
        const t2 = ("" + e2).split(".")[1];
        n.push(t2 ? t2.length : 0);
      }
    });
    const i = Math.max.apply(null, n);
    e[l] = o ? "" : a.reduce((e2, t2) => {
      const l2 = Number(t2);
      return isNaN(l2) ? e2 : parseFloat((e2 + t2).toFixed(Math.min(i, 20)));
    }, 0);
  }), h("table", {class: "el-table__footer", cellspacing: "0", cellpadding: "0", border: "0"}, [Zc(this.columns, this.hasGutter), h("tbody", {class: [{"has-gutter": this.hasGutter}]}, [h("tr", {}, [...this.columns.map((t, l) => h("td", {key: l, colspan: t.colSpan, rowspan: t.rowSpan, class: this.getRowClasses(t, l)}, [h("div", {class: ["cell", t.labelClassName]}, [e[l]])])), this.hasGutter && Xc()])])]);
}});
function np(e, t, a, r) {
  const s = Ue(), u = ref(false), d = ref(null), c = ref(false), p2 = ref({width: null, height: null}), h2 = ref(false);
  watchEffect(() => {
    t.setHeight(e.height);
  }), watchEffect(() => {
    t.setMaxHeight(e.maxHeight);
  }), watchEffect(() => {
    a.states.rowKey.value && a.setCurrentRowKey(e.currentRowKey);
  }), watch(() => e.data, () => {
    r.store.commit("setData", e.data);
  }, {immediate: true, deep: true}), watchEffect(() => {
    e.expandRowKeys && a.setExpandRowKeysAdapter(e.expandRowKeys);
  });
  const v = computed(() => e.height || e.maxHeight || a.states.fixedColumns.value.length > 0 || a.states.rightFixedColumns.value.length > 0), m = () => {
    v.value && t.updateElsHeight(), t.updateColumnsWidth(), g();
  };
  onMounted(() => {
    f("is-scrolling-left"), b(), a.updateColumns(), m(), p2.value = {width: r.vnode.el.offsetWidth, height: r.vnode.el.offsetHeight}, a.states.columns.value.forEach((e2) => {
      e2.filteredValue && e2.filteredValue.length && r.store.commit("filterChange", {column: e2, values: e2.filteredValue, silent: true});
    }), r.$ready = true;
  });
  const f = (e2) => {
    const {bodyWrapper: l} = r.refs;
    ((e3, l2) => {
      if (!e3)
        return;
      const a2 = Array.from(e3.classList).filter((e4) => !e4.startsWith("is-scrolling-"));
      a2.push(t.scrollX.value ? l2 : "is-scrolling-none"), e3.className = a2.join(" ");
    })(l, e2);
  }, g = throttle_1(function() {
    if (!r.refs.bodyWrapper)
      return;
    const {scrollLeft: e2, scrollTop: t2, offsetWidth: l, scrollWidth: a2} = r.refs.bodyWrapper, {headerWrapper: n, footerWrapper: o, fixedBodyWrapper: i, rightFixedBodyWrapper: s2} = r.refs;
    n && (n.scrollLeft = e2), o && (o.scrollLeft = e2), i && (i.scrollTop = t2), s2 && (s2.scrollTop = t2);
    f(e2 >= a2 - l - 1 ? "is-scrolling-right" : e2 === 0 ? "is-scrolling-left" : "is-scrolling-middle");
  }, 10), b = () => {
    window.addEventListener("resize", m), r.refs.bodyWrapper.addEventListener("scroll", g, {passive: true}), e.fit && pt(r.vnode.el, C);
  };
  onUnmounted(() => {
    y();
  });
  const y = () => {
    var t2;
    (t2 = r.refs.bodyWrapper) === null || t2 === void 0 || t2.removeEventListener("scroll", g, true), window.removeEventListener("resize", m), e.fit && ht(r.vnode.el, C);
  }, C = () => {
    if (!r.$ready)
      return;
    let t2 = false;
    const l = r.vnode.el, {width: a2, height: n} = p2.value, o = l.offsetWidth;
    a2 !== o && (t2 = true);
    const i = l.offsetHeight;
    (e.height || v.value) && n !== i && (t2 = true), t2 && (p2.value = {width: o, height: i}, m());
  }, w = computed(() => e.size || s.size), _ = computed(() => {
    const {bodyWidth: e2, scrollY: l, gutterWidth: a2} = t;
    return e2.value ? e2.value - (l.value ? a2 : 0) + "px" : "";
  });
  return {isHidden: u, renderExpanded: d, setDragVisible: (e2) => {
    c.value = e2;
  }, isGroup: h2, handleMouseLeave: () => {
    r.store.commit("setHoverRow", null), r.hoverState && (r.hoverState = null);
  }, handleHeaderFooterMousewheel: (e2, t2) => {
    const {pixelX: l, pixelY: a2} = t2;
    Math.abs(l) >= Math.abs(a2) && (r.refs.bodyWrapper.scrollLeft += t2.pixelX / 5);
  }, tableSize: w, bodyHeight: computed(() => {
    const l = t.headerHeight.value || 0, a2 = t.bodyHeight.value, n = t.footerHeight.value || 0;
    if (e.height)
      return {height: a2 ? a2 + "px" : ""};
    if (e.maxHeight) {
      const t2 = Oc(e.maxHeight);
      if (typeof t2 == "number")
        return {"max-height": t2 - n - (e.showHeader ? l : 0) + "px"};
    }
    return {};
  }), emptyBlockStyle: computed(() => {
    if (e.data && e.data.length)
      return null;
    let l = "100%";
    return t.appendHeight.value && (l = `calc(100% - ${t.appendHeight.value}px)`), {width: _.value, height: l};
  }), handleFixedMousewheel: (e2, t2) => {
    const l = r.refs.bodyWrapper;
    if (Math.abs(t2.spinY) > 0) {
      const a2 = l.scrollTop;
      t2.pixelY < 0 && a2 !== 0 && e2.preventDefault(), t2.pixelY > 0 && l.scrollHeight - l.clientHeight > a2 && e2.preventDefault(), l.scrollTop += Math.ceil(t2.pixelY / 5);
    } else
      l.scrollLeft += Math.ceil(t2.pixelX / 5);
  }, fixedHeight: computed(() => e.maxHeight ? e.showSummary ? {bottom: 0} : {bottom: t.scrollX.value && e.data.length ? t.gutterWidth + "px" : ""} : e.showSummary ? {height: t.tableHeight.value ? t.tableHeight.value + "px" : ""} : {height: t.viewportHeight.value ? t.viewportHeight.value + "px" : ""}), fixedBodyHeight: computed(() => {
    if (e.height)
      return {height: t.fixedBodyHeight.value ? t.fixedBodyHeight.value + "px" : ""};
    if (e.maxHeight) {
      let l = Oc(e.maxHeight);
      if (typeof l == "number")
        return l = t.scrollX.value ? l - t.gutterWidth : l, e.showHeader && (l -= t.headerHeight.value), l -= t.footerHeight.value, {"max-height": l + "px"};
    }
    return {};
  }), resizeProxyVisible: c, bodyWidth: _, resizeState: p2, doLayout: m};
}
let op = 1;
var ip = defineComponent({name: "ElTable", directives: {Mousewheel: Yt}, components: {TableHeader: Qc, TableBody: tp, TableFooter: ap}, props: {data: {type: Array, default: function() {
  return [];
}}, size: String, width: [String, Number], height: [String, Number], maxHeight: [String, Number], fit: {type: Boolean, default: true}, stripe: Boolean, border: Boolean, rowKey: [String, Function], showHeader: {type: Boolean, default: true}, showSummary: Boolean, sumText: String, summaryMethod: Function, rowClassName: [String, Function], rowStyle: [Object, Function], cellClassName: [String, Function], cellStyle: [Object, Function], headerRowClassName: [String, Function], headerRowStyle: [Object, Function], headerCellClassName: [String, Function], headerCellStyle: [Object, Function], highlightCurrentRow: Boolean, currentRowKey: [String, Number], emptyText: String, expandRowKeys: Array, defaultExpandAll: Boolean, defaultSort: Object, tooltipEffect: String, spanMethod: Function, selectOnIndeterminate: {type: Boolean, default: true}, indent: {type: Number, default: 16}, treeProps: {type: Object, default: () => ({hasChildren: "hasChildren", children: "children"})}, lazy: Boolean, load: Function}, emits: ["select", "select-all", "selection-change", "cell-mouse-enter", "cell-mouse-leave", "cell-click", "cell-dblclick", "row-click", "row-contextmenu", "row-dblclick", "header-click", "header-contextmenu", "sort-change", "filter-change", "current-change", "header-dragend", "expand-change"], setup(t) {
  let l = getCurrentInstance();
  const a = function(e, t2 = {}) {
    if (!e)
      throw new Error("Table is required.");
    const l2 = Fc();
    return l2.toggleAllSelection = debounce_1(l2._toggleAllSelection, 10), Object.keys(t2).forEach((e2) => {
      l2.states[e2].value = t2[e2];
    }), l2;
  }(l, {rowKey: t.rowKey, defaultExpandAll: t.defaultExpandAll, selectOnIndeterminate: t.selectOnIndeterminate, indent: t.indent, lazy: t.lazy, lazyColumnIdentifier: t.treeProps.hasChildren || "hasChildren", childrenColumnName: t.treeProps.children || "children", data: t.data});
  l.store = a;
  const n = new $c({store: l.store, table: l, fit: t.fit, showHeader: t.showHeader});
  l.layout = n;
  const {setCurrentRow: o, toggleRowSelection: i, clearSelection: r, clearFilter: s, toggleAllSelection: u, toggleRowExpansion: d, clearSort: c, sort: p2} = function(e) {
    return {setCurrentRow: (t2) => {
      e.commit("setCurrentRow", t2);
    }, toggleRowSelection: (t2, l2) => {
      e.toggleRowSelection(t2, l2, false), e.updateAllSelected();
    }, clearSelection: () => {
      e.clearSelection();
    }, clearFilter: (t2) => {
      e.clearFilter(t2);
    }, toggleAllSelection: () => {
      e.commit("toggleAllSelection");
    }, toggleRowExpansion: (t2, l2) => {
      e.toggleRowExpansionAdapter(t2, l2);
    }, clearSort: () => {
      e.clearSort();
    }, sort: (t2, l2) => {
      e.commit("sort", {prop: t2, order: l2});
    }};
  }(a), {isHidden: h2, renderExpanded: v, setDragVisible: m, isGroup: f, handleMouseLeave: g, handleHeaderFooterMousewheel: b, tableSize: y, bodyHeight: k, emptyBlockStyle: C, handleFixedMousewheel: x, fixedHeight: w, fixedBodyHeight: _, resizeProxyVisible: S, bodyWidth: E, resizeState: M, doLayout: T} = np(t, n, a, l), N = debounce_1(() => T(), 50), D = "el-table_" + op++;
  return l.tableId = D, l.state = {isGroup: f, resizeState: M, doLayout: T, debouncedUpdateLayout: N}, {layout: n, store: a, handleHeaderFooterMousewheel: b, handleMouseLeave: g, tableId: D, tableSize: y, isHidden: h2, renderExpanded: v, resizeProxyVisible: S, resizeState: M, isGroup: f, bodyWidth: E, bodyHeight: k, emptyBlockStyle: C, debouncedUpdateLayout: N, handleFixedMousewheel: x, fixedHeight: w, fixedBodyHeight: _, setCurrentRow: o, toggleRowSelection: i, clearSelection: r, clearFilter: s, toggleAllSelection: u, toggleRowExpansion: d, clearSort: c, doLayout: T, sort: p2, t: ya, setDragVisible: m, context: l};
}});
const rp = {ref: "hiddenColumns", class: "hidden-columns"}, sp = {key: 0, ref: "headerWrapper", class: "el-table__header-wrapper"}, up = {class: "el-table__empty-text"}, dp = {key: 1, ref: "appendWrapper", class: "el-table__append-wrapper"}, cp = {key: 1, ref: "footerWrapper", class: "el-table__footer-wrapper"}, pp = {key: 0, ref: "fixedHeaderWrapper", class: "el-table__fixed-header-wrapper"}, hp = {key: 1, ref: "fixedFooterWrapper", class: "el-table__fixed-footer-wrapper"}, vp = {key: 0, ref: "rightFixedHeaderWrapper", class: "el-table__fixed-header-wrapper"}, mp = {key: 1, ref: "rightFixedFooterWrapper", class: "el-table__fixed-footer-wrapper"}, fp = {ref: "resizeProxy", class: "el-table__column-resize-proxy"};
ip.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("table-header"), r = resolveComponent("table-body"), p2 = resolveComponent("table-footer"), h2 = resolveDirective("mousewheel");
  return openBlock(), createBlock("div", {class: [[{"el-table--fit": e.fit, "el-table--striped": e.stripe, "el-table--border": e.border || e.isGroup, "el-table--hidden": e.isHidden, "el-table--group": e.isGroup, "el-table--fluid-height": e.maxHeight, "el-table--scrollable-x": e.layout.scrollX.value, "el-table--scrollable-y": e.layout.scrollY.value, "el-table--enable-row-hover": !e.store.states.isComplex.value, "el-table--enable-row-transition": (e.store.states.data.value || []).length !== 0 && (e.store.states.data.value || []).length < 100}, e.tableSize ? "el-table--" + e.tableSize : ""], "el-table"], onMouseleave: t[1] || (t[1] = (t2) => e.handleMouseLeave())}, [createVNode("div", rp, [renderSlot(e.$slots, "default")], 512), e.showHeader ? withDirectives((openBlock(), createBlock("div", sp, [createVNode(i, {ref: "tableHeader", border: e.border, "default-sort": e.defaultSort, store: e.store, style: {width: e.layout.bodyWidth.value ? e.layout.bodyWidth.value + "px" : ""}, onSetDragVisible: e.setDragVisible}, null, 8, ["border", "default-sort", "store", "style", "onSetDragVisible"])], 512)), [[h2, e.handleHeaderFooterMousewheel]]) : createCommentVNode("v-if", true), createVNode("div", {ref: "bodyWrapper", style: [e.bodyHeight], class: "el-table__body-wrapper"}, [createVNode(r, {context: e.context, highlight: e.highlightCurrentRow, "row-class-name": e.rowClassName, "tooltip-effect": e.tooltipEffect, "row-style": e.rowStyle, store: e.store, stripe: e.stripe, style: {width: e.bodyWidth}}, null, 8, ["context", "highlight", "row-class-name", "tooltip-effect", "row-style", "store", "stripe", "style"]), e.data && e.data.length !== 0 ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", {key: 0, ref: "emptyBlock", style: e.emptyBlockStyle, class: "el-table__empty-block"}, [createVNode("span", up, [renderSlot(e.$slots, "empty", {}, () => [createTextVNode(toDisplayString(e.emptyText || e.t("el.table.emptyText")), 1)])])], 4)), e.$slots.append ? (openBlock(), createBlock("div", dp, [renderSlot(e.$slots, "append")], 512)) : createCommentVNode("v-if", true)], 4), e.showSummary ? withDirectives((openBlock(), createBlock("div", cp, [createVNode(p2, {border: e.border, "default-sort": e.defaultSort, store: e.store, style: {width: e.layout.bodyWidth.value ? e.layout.bodyWidth.value + "px" : ""}, "sum-text": e.sumText || e.t("el.table.sumText"), "summary-method": e.summaryMethod}, null, 8, ["border", "default-sort", "store", "style", "sum-text", "summary-method"])], 512)), [[vShow, e.data && e.data.length > 0], [h2, e.handleHeaderFooterMousewheel]]) : createCommentVNode("v-if", true), e.store.states.fixedColumns.value.length > 0 ? withDirectives((openBlock(), createBlock("div", {key: 2, ref: "fixedWrapper", style: [{width: e.layout.fixedWidth.value ? e.layout.fixedWidth.value + "px" : ""}, e.fixedHeight], class: "el-table__fixed"}, [e.showHeader ? (openBlock(), createBlock("div", pp, [createVNode(i, {ref: "fixedTableHeader", border: e.border, store: e.store, style: {width: e.bodyWidth}, fixed: "left", onSetDragVisible: e.setDragVisible}, null, 8, ["border", "store", "style", "onSetDragVisible"])], 512)) : createCommentVNode("v-if", true), createVNode("div", {ref: "fixedBodyWrapper", style: [{top: e.layout.headerHeight.value + "px"}, e.fixedBodyHeight], class: "el-table__fixed-body-wrapper"}, [createVNode(r, {highlight: e.highlightCurrentRow, "row-class-name": e.rowClassName, "tooltip-effect": e.tooltipEffect, "row-style": e.rowStyle, store: e.store, stripe: e.stripe, style: {width: e.bodyWidth}, fixed: "left"}, null, 8, ["highlight", "row-class-name", "tooltip-effect", "row-style", "store", "stripe", "style"]), e.$slots.append ? (openBlock(), createBlock("div", {key: 0, style: {height: e.layout.appendHeight.value + "px"}, class: "el-table__append-gutter"}, null, 4)) : createCommentVNode("v-if", true)], 4), e.showSummary ? withDirectives((openBlock(), createBlock("div", hp, [createVNode(p2, {border: e.border, store: e.store, style: {width: e.bodyWidth}, "sum-text": e.sumText || e.t("el.table.sumText"), "summary-method": e.summaryMethod, fixed: "left"}, null, 8, ["border", "store", "style", "sum-text", "summary-method"])], 512)), [[vShow, e.data && e.data.length > 0]]) : createCommentVNode("v-if", true)], 4)), [[h2, e.handleFixedMousewheel]]) : createCommentVNode("v-if", true), e.store.states.rightFixedColumns.value.length > 0 ? withDirectives((openBlock(), createBlock("div", {key: 3, ref: "rightFixedWrapper", style: [{width: e.layout.rightFixedWidth.value ? e.layout.rightFixedWidth.value + "px" : "", right: e.layout.scrollY.value ? (e.border ? e.layout.gutterWidth : e.layout.gutterWidth || 0) + "px" : ""}, e.fixedHeight], class: "el-table__fixed-right"}, [e.showHeader ? (openBlock(), createBlock("div", vp, [createVNode(i, {ref: "rightFixedTableHeader", border: e.border, store: e.store, style: {width: e.bodyWidth}, fixed: "right", onSetDragVisible: e.setDragVisible}, null, 8, ["border", "store", "style", "onSetDragVisible"])], 512)) : createCommentVNode("v-if", true), createVNode("div", {ref: "rightFixedBodyWrapper", style: [{top: e.layout.headerHeight.value + "px"}, e.fixedBodyHeight], class: "el-table__fixed-body-wrapper"}, [createVNode(r, {highlight: e.highlightCurrentRow, "row-class-name": e.rowClassName, "tooltip-effect": e.tooltipEffect, "row-style": e.rowStyle, store: e.store, stripe: e.stripe, style: {width: e.bodyWidth}, fixed: "right"}, null, 8, ["highlight", "row-class-name", "tooltip-effect", "row-style", "store", "stripe", "style"]), e.$slots.append ? (openBlock(), createBlock("div", {key: 0, style: {height: e.layout.appendHeight.value + "px"}, class: "el-table__append-gutter"}, null, 4)) : createCommentVNode("v-if", true)], 4), e.showSummary ? withDirectives((openBlock(), createBlock("div", mp, [createVNode(p2, {border: e.border, store: e.store, style: {width: e.bodyWidth}, "sum-text": e.sumText || e.t("el.table.sumText"), "summary-method": e.summaryMethod, fixed: "right"}, null, 8, ["border", "store", "style", "sum-text", "summary-method"])], 512)), [[vShow, e.data && e.data.length > 0]]) : createCommentVNode("v-if", true)], 4)), [[h2, e.handleFixedMousewheel]]) : createCommentVNode("v-if", true), e.store.states.rightFixedColumns.value.length > 0 ? (openBlock(), createBlock("div", {key: 4, ref: "rightFixedPatch", style: {width: e.layout.scrollY.value ? e.layout.gutterWidth + "px" : "0", height: e.layout.headerHeight.value + "px"}, class: "el-table__fixed-right-patch"}, null, 4)) : createCommentVNode("v-if", true), withDirectives(createVNode("div", fp, null, 512), [[vShow, e.resizeProxyVisible]])], 34);
}, ip.__file = "packages/table/src/table.vue", ip.install = (e) => {
  e.component(ip.name, ip);
};
const gp = ip, bp = {default: {order: ""}, selection: {width: 48, minWidth: 48, realWidth: 48, order: "", className: "el-table-column--selection"}, expand: {width: 48, minWidth: 48, realWidth: 48, order: ""}, index: {width: 48, minWidth: 48, realWidth: 48, order: ""}}, yp = {selection: {renderHeader: function({store: e}) {
  const t = e;
  return h(Mn, {disabled: t.states.data.value && t.states.data.value.length === 0, indeterminate: t.states.selection.value.length > 0 && !t.states.isAllSelected.value, "onUpdate:modelValue": t.toggleAllSelection, modelValue: t.states.isAllSelected.value});
}, renderCell: function({row: e, column: t, store: l, $index: a}) {
  return h(Mn, {disabled: !!t.selectable && !t.selectable.call(null, e, a), onChange: () => {
    l.commit("rowSelectedChanged", e);
  }, onClick: (e2) => e2.stopPropagation(), modelValue: l.isSelected(e)});
}, sortable: false, resizable: false}, index: {renderHeader: function({column: e}) {
  return e.label || "#";
}, renderCell: function({column: e, $index: t}) {
  let l = t + 1;
  const a = e.index;
  return typeof a == "number" ? l = t + a : typeof a == "function" && (l = a(t)), h("div", {}, [l]);
}, sortable: false}, expand: {renderHeader: function({column: e}) {
  return e.label || "";
}, renderCell: function({row: e, store: t}) {
  const l = t, a = e, n = ["el-table__expand-icon"];
  l.states.expandRows.value.indexOf(a) > -1 && n.push("el-table__expand-icon--expanded");
  return h("div", {class: n, onClick: function(e2) {
    e2.stopPropagation(), l.toggleRowExpansion(a);
  }}, [h("i", {class: "el-icon el-icon-arrow-right"})]);
}, sortable: false, resizable: false, className: "el-table__expand-column"}};
function kp({row: e, column: t, $index: l}) {
  var a;
  const n = t.property, o = n && $e(e, n, false).v;
  return t && t.formatter ? t.formatter(e, t, o, l) : ((a = o == null ? void 0 : o.toString) === null || a === void 0 ? void 0 : a.call(o)) || "";
}
function Cp(t, a, o) {
  const i = getCurrentInstance(), r = ref(""), s = ref(false), u = ref(), d = ref();
  watchEffect(() => {
    u.value = t.align ? "is-" + t.align : null, u.value;
  }), watchEffect(() => {
    d.value = t.headerAlign ? "is-" + t.headerAlign : u.value, d.value;
  });
  const c = computed(() => {
    let e = i.vnode.vParent || i.parent;
    for (; e && !e.tableId && !e.columnId; )
      e = e.vnode.vParent || e.parent;
    return e;
  }), p2 = ref(Dc(t.width)), h$1 = ref(((v = t.minWidth) !== void 0 && (v = Dc(v), isNaN(v) && (v = 80)), v));
  var v;
  return {columnId: r, realAlign: u, isSubColumn: s, realHeaderAlign: d, columnOrTableParent: c, setColumnWidth: (e) => (p2.value && (e.width = p2.value), h$1.value && (e.minWidth = h$1.value), e.minWidth || (e.minWidth = 80), e.realWidth = e.width === void 0 ? e.minWidth : e.width, e), setColumnForcedProps: (e) => {
    const t2 = e.type, l = yp[t2] || {};
    return Object.keys(l).forEach((t3) => {
      const a2 = l[t3];
      a2 !== void 0 && (e[t3] = t3 === "className" ? `${e[t3]} ${a2}` : a2);
    }), e;
  }, setColumnRenders: (e) => {
    t.renderHeader ? console.warn("[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.") : e.type !== "selection" && (e.renderHeader = (t2) => {
      i.columnConfig.value.label;
      const l2 = a.header;
      return l2 ? l2(t2) : e.label;
    });
    let l = e.renderCell;
    return e.type === "expand" ? (e.renderCell = (e2) => h("div", {class: "cell"}, [l(e2)]), o.value.renderExpanded = (e2) => a.default ? a.default(e2) : a.default) : (l = l || kp, e.renderCell = (t2) => {
      let n = null;
      n = a.default ? a.default(t2) : l(t2);
      const o2 = function({row: e2, treeNode: t3, store: l2}) {
        const a2 = e2, n2 = l2, o3 = t3;
        if (!o3)
          return null;
        const i2 = [], r3 = function(e3) {
          e3.stopPropagation(), n2.loadOrToggle(a2);
        };
        if (o3.indent && i2.push(h("span", {class: "el-table__indent", style: {"padding-left": o3.indent + "px"}})), typeof o3.expanded != "boolean" || o3.noLazyChildren)
          i2.push(h("span", {class: "el-table__placeholder"}));
        else {
          const e3 = ["el-table__expand-icon", o3.expanded ? "el-table__expand-icon--expanded" : ""];
          let t4 = ["el-icon-arrow-right"];
          o3.loading && (t4 = ["el-icon-loading"]), i2.push(h("div", {class: e3, onClick: r3}, [h("i", {class: t4})]));
        }
        return i2;
      }(t2), r2 = {class: "cell", style: {}};
      return e.showOverflowTooltip && (r2.class += " el-tooltip", r2.style = {width: (t2.column.realWidth || t2.column.width) - 1 + "px"}), ((e2) => {
        function t3(e3) {
          var t4;
          ((t4 = e3 == null ? void 0 : e3.type) === null || t4 === void 0 ? void 0 : t4.name) === "ElTableColumn" && (e3.vParent = i);
        }
        e2 instanceof Array ? e2.forEach((e3) => t3(e3)) : t3(e2);
      })(n), h("div", r2, [o2, n]);
    }), e;
  }, getPropsData: (...e) => e.reduce((e2, l) => (Array.isArray(l) && l.forEach((l2) => {
    e2[l2] = t[l2];
  }), e2), {}), getColumnElIndex: (e, t2) => [].indexOf.call(e, t2)};
}
let xp = 1;
const wp = defineComponent({name: "ElTableColumn", components: {ElCheckbox: Mn}, props: {type: {type: String, default: "default"}, label: String, className: String, labelClassName: String, property: String, prop: String, width: {type: [Object, Number, String], default: () => ({})}, minWidth: {type: [Object, Number, String], default: () => ({})}, renderHeader: Function, sortable: {type: [Boolean, String], default: false}, sortMethod: Function, sortBy: [String, Function, Array], resizable: {type: Boolean, default: true}, columnKey: String, align: String, headerAlign: String, showTooltipWhenOverflow: Boolean, showOverflowTooltip: Boolean, fixed: [Boolean, String], formatter: Function, selectable: Function, reserveSelection: Boolean, filterMethod: Function, filteredValue: Array, filters: Array, filterPlacement: String, filterMultiple: {type: Boolean, default: true}, index: [Number, Function], sortOrders: {type: Array, default: () => ["ascending", "descending", null], validator: (e) => e.every((e2) => ["ascending", "descending", null].indexOf(e2) > -1)}}, setup(t, {slots: a}) {
  const s = getCurrentInstance(), u = ref({}), d = t, c = computed(() => {
    let e = s.parent;
    for (; e && !e.tableId; )
      e = e.parent;
    return e;
  }), {registerNormalWatchers: p2, registerComplexWatchers: h2} = function(t2, l) {
    const a2 = getCurrentInstance();
    return {registerComplexWatchers: () => {
      const e = {realWidth: "width", realMinWidth: "minWidth"}, n = ["fixed"].reduce((e2, t3) => (e2[t3] = t3, e2), e);
      Object.keys(n).forEach((n2) => {
        const i = e[n2];
        we(l, i) && watch(() => l[i], (e2) => {
          a2.columnConfig.value[i] = e2, a2.columnConfig.value[n2] = e2;
          const l2 = i === "fixed";
          t2.value.store.scheduleLayout(l2);
        });
      });
    }, registerNormalWatchers: () => {
      const e = {prop: "property", realAlign: "align", realHeaderAlign: "headerAlign"}, t3 = ["label", "property", "filters", "filterMultiple", "sortable", "index", "formatter", "className", "labelClassName", "showOverflowTooltip"].reduce((e2, t4) => (e2[t4] = t4, e2), e);
      Object.keys(t3).forEach((t4) => {
        const n = e[t4];
        we(l, n) && watch(() => l[n], (e2) => {
          a2.columnConfig.value[n] = e2;
        });
      });
    }};
  }(c, d), {columnId: v, isSubColumn: m, realHeaderAlign: f, columnOrTableParent: g, setColumnWidth: b, setColumnForcedProps: y, setColumnRenders: k, getPropsData: C, getColumnElIndex: x, realAlign: w} = Cp(d, a, c), _ = g.value;
  v.value = (_.tableId || _.columnId) + "_column_" + xp++, onBeforeMount(() => {
    m.value = c.value !== _;
    const e = d.type || "default", t2 = d.sortable === "" || d.sortable, l = Object.assign(Object.assign({}, bp[e]), {id: v.value, type: e, property: d.prop || d.property, align: w, headerAlign: f, showOverflowTooltip: d.showOverflowTooltip || d.showTooltipWhenOverflow, filterable: d.filters || d.filterMethod, filteredValue: [], filterPlacement: "", isColumnGroup: false, filterOpened: false, sortable: t2, index: d.index});
    let a2 = C(["columnKey", "label", "className", "labelClassName", "type", "renderHeader", "formatter", "fixed", "resizable"], ["sortMethod", "sortBy", "sortOrders"], ["selectable", "reserveSelection"], ["filterMethod", "filters", "filterMultiple", "filterOpened", "filteredValue", "filterPlacement"]);
    a2 = function(e2, t3) {
      const l2 = {};
      let a3;
      for (a3 in e2)
        l2[a3] = e2[a3];
      for (a3 in t3)
        if (we(t3, a3)) {
          const e3 = t3[a3];
          e3 !== void 0 && (l2[a3] = e3);
        }
      return l2;
    }(l, a2);
    a2 = function(...e2) {
      return e2.length === 0 ? (e3) => e3 : e2.length === 1 ? e2[0] : e2.reduce((e3, t3) => (...l2) => e3(t3(...l2)));
    }(k, b, y)(a2), u.value = a2, p2(), h2();
  }), onMounted(() => {
    var e;
    const t2 = g.value, l = m.value ? t2.vnode.el.children : (e = t2.refs.hiddenColumns) === null || e === void 0 ? void 0 : e.children, a2 = () => x(l || [], s.vnode.el);
    u.value.getColumnIndex = a2;
    a2() > -1 && c.value.store.commit("insertColumn", u.value, m.value ? t2.columnConfig.value : null);
  }), onBeforeUnmount(() => {
    c.value.store.commit("removeColumn", u.value, m.value ? _.columnConfig.value : null);
  }), s.columnId = v.value, s.columnConfig = u;
}, render() {
  var e, t, l;
  let a = [];
  try {
    const n = (t = (e = this.$slots).default) === null || t === void 0 ? void 0 : t.call(e, {row: {}, column: {}, $index: -1});
    if (n instanceof Array)
      for (const e2 of n)
        ((l = e2.type) === null || l === void 0 ? void 0 : l.name) === "ElTableColumn" || e2.shapeFlag !== 36 ? a.push(e2) : e2.type === Fragment && e2.children instanceof Array && n.push(...e2.children);
  } catch (e2) {
    a = [];
  }
  return h("div", a);
}});
wp.install = (e) => {
  e.component(wp.name, wp);
};
var _p = defineComponent({name: "ElTabBar", props: {tabs: {type: Array, default: () => []}}, setup(t) {
  const a = inject("rootTabs");
  if (!a)
    throw new Error("ElTabBar must use with ElTabs");
  const n = getCurrentInstance(), i = () => {
    let e = {}, l = 0, o = 0;
    const i2 = ["top", "bottom"].includes(a.props.tabPosition) ? "width" : "height", r2 = i2 === "width" ? "x" : "y";
    t.tabs.every((e2) => {
      var a2;
      let r3 = (a2 = n.parent.refs) === null || a2 === void 0 ? void 0 : a2["tab-" + e2.paneName];
      if (!r3)
        return false;
      if (e2.active) {
        o = r3["client" + Be(i2)];
        const e3 = window.getComputedStyle(r3);
        return i2 === "width" && (t.tabs.length > 1 && (o -= parseFloat(e3.paddingLeft) + parseFloat(e3.paddingRight)), l += parseFloat(e3.paddingLeft)), false;
      }
      return l += r3["client" + Be(i2)], true;
    });
    const s = `translate${Be(r2)}(${l}px)`;
    return e[i2] = o + "px", e.transform = s, e.msTransform = s, e.webkitTransform = s, e;
  }, r = ref(i());
  return watch(() => t.tabs, () => {
    nextTick(() => {
      r.value = i();
    });
  }), {rootTabs: a, barStyle: r};
}});
_p.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: ["el-tabs__active-bar", "is-" + e.rootTabs.props.tabPosition], style: e.barStyle}, null, 6);
}, _p.__file = "packages/tabs/src/tab-bar.vue";
var Sp = defineComponent({name: "ElTabNav", components: {TabBar: _p}, props: {panes: {type: Array, default: () => []}, currentName: {type: String, default: ""}, editable: Boolean, onTabClick: {type: Function, default: ke}, onTabRemove: {type: Function, default: ke}, type: {type: String, default: ""}, stretch: Boolean}, setup() {
  const e = inject("rootTabs");
  if (!e)
    throw new Error("ElTabNav must use with ElTabs");
  const t = ref(false), a = ref(0), o = ref(false), s = ref(true), u = ref(null), d = ref(null), c = ref(null), p2 = computed(() => ["top", "bottom"].includes(e.props.tabPosition) ? "width" : "height"), h2 = computed(() => ({transform: `translate${p2.value === "width" ? "X" : "Y"}(-${a.value}px)`})), v = () => {
    if (!t.value)
      return;
    const l = d.value, n = c.value.querySelector(".is-active");
    if (!n)
      return;
    const o2 = u.value, i = ["top", "bottom"].includes(e.props.tabPosition), r = n.getBoundingClientRect(), s2 = o2.getBoundingClientRect(), p3 = i ? l.offsetWidth - s2.width : l.offsetHeight - s2.height, h3 = a.value;
    let v2 = h3;
    i ? (r.left < s2.left && (v2 = h3 - (s2.left - r.left)), r.right > s2.right && (v2 = h3 + r.right - s2.right)) : (r.top < s2.top && (v2 = h3 - (s2.top - r.top)), r.bottom > s2.bottom && (v2 = h3 + (r.bottom - s2.bottom))), v2 = Math.max(v2, 0), a.value = Math.min(v2, p3);
  }, m = () => {
    if (!d.value)
      return;
    const e2 = d.value["offset" + Be(p2.value)], l = u.value["offset" + Be(p2.value)], n = a.value;
    if (l < e2) {
      const n2 = a.value;
      t.value = t.value || {}, t.value.prev = n2, t.value.next = n2 + l < e2, e2 - n2 < l && (a.value = e2 - l);
    } else
      t.value = false, n > 0 && (a.value = 0);
  }, f = () => {
    s.value && (o.value = true);
  }, g = () => {
    const e2 = document.visibilityState;
    e2 === "hidden" ? s.value = false : e2 === "visible" && setTimeout(() => {
      s.value = true;
    }, 50);
  }, b = () => {
    s.value = false;
  }, y = () => {
    setTimeout(() => {
      s.value = true;
    }, 50);
  };
  return onUpdated(() => {
    m();
  }), onMounted(() => {
    pt(c.value, m), tt(document, "visibilitychange", g), tt(window, "blur", b), tt(window, "focus", y), setTimeout(() => {
      v();
    }, 0);
  }), onBeforeUnmount(() => {
    c.value && ht(c.value, m), lt(document, "visibilitychange", g), lt(window, "blur", b), lt(window, "focus", y);
  }), {rootTabs: e, scrollable: t, navOffset: a, isFocus: o, focusable: s, navScroll$: u, nav$: d, el$: c, sizeName: p2, navStyle: h2, scrollPrev: () => {
    const e2 = u.value["offset" + Be(p2.value)], t2 = a.value;
    if (!t2)
      return;
    let l = t2 > e2 ? t2 - e2 : 0;
    a.value = l;
  }, scrollNext: () => {
    const e2 = d.value["offset" + Be(p2.value)], t2 = u.value["offset" + Be(p2.value)], l = a.value;
    if (e2 - l <= t2)
      return;
    let n = e2 - l > 2 * t2 ? l + t2 : e2 - t2;
    a.value = n;
  }, scrollToActiveTab: v, update: m, changeTab: (e2) => {
    const t2 = e2.code;
    let l, a2, n;
    const {up: o2, down: i, left: r, right: s2} = Dt;
    [o2, i, r, s2].indexOf(t2) !== -1 && (n = e2.currentTarget.querySelectorAll("[role=tab]"), a2 = Array.prototype.indexOf.call(n, e2.target), l = t2 === r || t2 === o2 ? a2 === 0 ? n.length - 1 : a2 - 1 : a2 < n.length - 1 ? a2 + 1 : 0, n[l].focus(), n[l].click(), f());
  }, setFocus: f, removeFocus: () => {
    o.value = false;
  }, visibilityChangeHandler: g, windowBlurHandler: b, windowFocusHandler: y};
}, render() {
  const {type: e, panes: t, editable: l, stretch: a, onTabClick: n, onTabRemove: o, navStyle: i, scrollable: r, scrollNext: s, scrollPrev: u, changeTab: d, setFocus: c, removeFocus: p2, rootTabs: h$1, isFocus: v} = this, m = r ? [h("span", {class: ["el-tabs__nav-prev", r.prev ? "" : "is-disabled"], onClick: u}, [h("i", {class: "el-icon-arrow-left"})]), h("span", {class: ["el-tabs__nav-next", r.next ? "" : "is-disabled"], onClick: s}, [h("i", {class: "el-icon-arrow-right"})])] : null, f = t.map((e2, t2) => {
    var a2, i2;
    let r2 = e2.props.name || e2.index || "" + t2;
    const s2 = e2.isClosable || l;
    e2.index = "" + t2;
    const u2 = s2 ? h("span", {class: "el-icon-close", onClick: (t3) => {
      o(e2, t3);
    }}) : null, d2 = ((i2 = (a2 = e2.instance.slots).label) === null || i2 === void 0 ? void 0 : i2.call(a2)) || e2.props.label, m2 = e2.active ? 0 : -1;
    return h("div", {class: {"el-tabs__item": true, ["is-" + h$1.props.tabPosition]: true, "is-active": e2.active, "is-disabled": e2.props.disabled, "is-closable": s2, "is-focus": v}, id: "tab-" + r2, key: "tab-" + r2, "aria-controls": "pane-" + r2, role: "tab", "aria-selected": e2.active, ref: "tab-" + r2, tabindex: m2, onFocus: () => {
      c();
    }, onBlur: () => {
      p2();
    }, onClick: (t3) => {
      p2(), n(e2, r2, t3);
    }, onKeydown: (t3) => {
      !s2 || t3.code !== Dt.delete && t3.code !== Dt.backspace || o(e2, t3);
    }}, [d2, u2]);
  });
  return h("div", {ref: "el$", class: ["el-tabs__nav-wrap", r ? "is-scrollable" : "", "is-" + h$1.props.tabPosition]}, [m, h("div", {class: "el-tabs__nav-scroll", ref: "navScroll$"}, [h("div", {class: ["el-tabs__nav", "is-" + h$1.props.tabPosition, a && ["top", "bottom"].includes(h$1.props.tabPosition) ? "is-stretch" : ""], ref: "nav$", style: i, role: "tablist", onKeydown: d}, [e ? null : h(_p, {tabs: t}), f])])]);
}});
Sp.__file = "packages/tabs/src/tab-nav.vue";
var Ep = defineComponent({name: "ElTabs", components: {TabNav: Sp}, props: {type: {type: String, default: ""}, activeName: {type: String, default: ""}, closable: Boolean, addable: Boolean, modelValue: {type: String, default: ""}, editable: Boolean, tabPosition: {type: String, default: "top"}, beforeLeave: {type: Function, default: null}, stretch: Boolean}, emits: ["tab-click", "edit", "tab-remove", "tab-add", "input", "update:modelValue"], setup(t, a) {
  const n = ref(null), r = ref(t.modelValue || t.activeName || "0"), s = ref([]), u = getCurrentInstance(), d = {};
  provide("rootTabs", {props: t, currentName: r}), provide("updatePaneState", (e) => {
    d[e.uid] = e;
  }), watch(() => t.activeName, (e) => {
    v(e);
  }), watch(() => t.modelValue, (e) => {
    v(e);
  }), watch(r, () => {
    n.value && nextTick(() => {
      n.value.$nextTick(() => {
        n.value.scrollToActiveTab();
      });
    }), p2(true);
  });
  const c = (e, t2 = []) => (Array.from(e.children || []).forEach((e2) => {
    let l = e2.type;
    l = l.name || l, l === "ElTabPane" && e2.component ? t2.push(e2.component) : l !== Fragment && l !== "template" || c(e2, t2);
  }), t2), p2 = (e = false) => {
    if (a.slots.default) {
      const t2 = u.subTree.children, l = Array.from(t2).find(({props: e2}) => e2.class === "el-tabs__content");
      if (!l)
        return;
      const a2 = c(l).map((e2) => d[e2.uid]), n2 = !(a2.length === s.value.length && a2.every((e2, t3) => e2.uid === s.value[t3].uid));
      (e || n2) && (s.value = a2);
    } else
      s.value.length !== 0 && (s.value = []);
  }, h2 = (e) => {
    r.value = e, a.emit("input", e), a.emit("update:modelValue", e);
  }, v = (e) => {
    if (r.value !== e && t.beforeLeave) {
      const l = t.beforeLeave(e, r.value);
      l && l.then ? l.then(() => {
        h2(e), n.value && n.value.removeFocus();
      }, () => {
      }) : l !== false && h2(e);
    } else
      h2(e);
  };
  return onUpdated(() => {
    p2();
  }), onMounted(() => {
    p2();
  }), {nav$: n, handleTabClick: (e, t2, l) => {
    e.props.disabled || (v(t2), a.emit("tab-click", e, l));
  }, handleTabRemove: (e, t2) => {
    e.props.disabled || (t2.stopPropagation(), a.emit("edit", e.props.name, "remove"), a.emit("tab-remove", e.props.name));
  }, handleTabAdd: () => {
    a.emit("edit", null, "add"), a.emit("tab-add");
  }, currentName: r, panes: s};
}, render() {
  var e;
  let {type: t, handleTabClick: l, handleTabRemove: a, handleTabAdd: n, currentName: o, panes: i, editable: r, addable: s, tabPosition: u, stretch: d} = this;
  const c = r || s ? h("span", {class: "el-tabs__new-tab", tabindex: "0", onClick: n, onKeydown: (e2) => {
    e2.code === Dt.enter && n();
  }}, [h("i", {class: "el-icon-plus"})]) : null, p2 = h("div", {class: ["el-tabs__header", "is-" + u]}, [c, h(Sp, {currentName: o, editable: r, type: t, panes: i, stretch: d, ref: "nav$", onTabClick: l, onTabRemove: a})]), h$1 = h("div", {class: "el-tabs__content"}, (e = this.$slots) === null || e === void 0 ? void 0 : e.default());
  return h("div", {class: {"el-tabs": true, "el-tabs--card": t === "card", ["el-tabs--" + u]: true, "el-tabs--border-card": t === "border-card"}}, u !== "bottom" ? [p2, h$1] : [h$1, p2]);
}});
Ep.__file = "packages/tabs/src/tabs.vue", Ep.install = (e) => {
  e.component(Ep.name, Ep);
};
const Mp = Ep, Tp = (e) => {
  const t = (e || "").split(":");
  if (t.length >= 2) {
    return {hours: parseInt(t[0], 10), minutes: parseInt(t[1], 10)};
  }
  return null;
}, Np = (e, t) => {
  const l = Tp(e), a = Tp(t), n = l.minutes + 60 * l.hours, o = a.minutes + 60 * a.hours;
  return n === o ? 0 : n > o ? 1 : -1;
}, Dp = (e, t) => {
  const l = Tp(e), a = Tp(t), n = {hours: l.hours, minutes: l.minutes};
  return n.minutes += a.minutes, n.hours += a.hours, n.hours += Math.floor(n.minutes / 60), n.minutes = n.minutes % 60, ((e2) => (e2.hours < 10 ? "0" + e2.hours : e2.hours) + ":" + (e2.minutes < 10 ? "0" + e2.minutes : e2.minutes))(n);
};
var Op = defineComponent({name: "ElTimeSelect", components: {ElSelect: Ju, ElOption: ed}, model: {prop: "value", event: "change"}, props: {modelValue: String, editable: {type: Boolean, default: true}, clearable: {type: Boolean, default: true}, size: {type: String, default: "", validator: (e) => !e || ["medium", "small", "mini"].indexOf(e) !== -1}, placeholder: {type: String, default: ""}, start: {type: String, default: "09:00"}, end: {type: String, default: "18:00"}, step: {type: String, default: "00:30"}, minTime: {type: String, default: ""}, maxTime: {type: String, default: ""}, name: {type: String, default: ""}, prefixIcon: {type: String, default: "el-icon-time"}, clearIcon: {type: String, default: "el-icon-circle-close"}}, emits: ["change", "blur", "focus", "update:modelValue"], setup: (e) => ({value: computed(() => e.modelValue), items: computed(() => {
  const t = [];
  if (e.start && e.end && e.step) {
    let l = e.start;
    for (; Np(l, e.end) <= 0; )
      t.push({value: l, disabled: Np(l, e.minTime || "-1:-1") <= 0 || Np(l, e.maxTime || "100:100") >= 0}), l = Dp(l, e.step);
  }
  return t;
})})});
Op.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-option"), r = resolveComponent("el-select");
  return openBlock(), createBlock(r, {"model-value": e.value, disabled: !e.editable, clearable: e.clearable, "clear-icon": e.clearIcon, size: e.size, placeholder: e.placeholder, "default-first-option": "", filterable: "", "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.$emit("update:modelValue", t2)), onChange: t[2] || (t[2] = (t2) => e.$emit("change", t2)), onBlur: t[3] || (t[3] = (t2) => e.$emit("blur", t2)), onFocus: t[4] || (t[4] = (t2) => e.$emit("focus", t2))}, {prefix: withCtx(() => [createVNode("i", {class: "el-input__icon " + e.prefixIcon}, null, 2)]), default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.items, (e2) => (openBlock(), createBlock(i, {key: e2.value, label: e2.value, value: e2.value, disabled: e2.disabled}, null, 8, ["label", "value", "disabled"]))), 128))]), _: 1}, 8, ["model-value", "disabled", "clearable", "clear-icon", "size", "placeholder"]);
}, Op.__file = "packages/time-select/src/time-select.vue", Op.install = (e) => {
  e.component(Op.name, Op);
};
const Ip = Op;
var Pp = defineComponent({name: "ElTimeline", setup: (e, t) => (provide("timeline", t), () => {
  var e2, l;
  return h("ul", {class: {"el-timeline": true}}, (l = (e2 = t.slots).default) === null || l === void 0 ? void 0 : l.call(e2));
})});
Pp.__file = "packages/timeline/src/index.vue", Pp.install = (e) => {
  e.component(Pp.name, Pp);
};
const Vp = Pp;
var Bp = defineComponent({name: "ElTimelineItem", props: {timestamp: {type: String, default: ""}, hideTimestamp: {type: Boolean, default: false}, placement: {type: String, default: "bottom"}, type: {type: String, default: ""}, color: {type: String, default: ""}, size: {type: String, default: "normal"}, icon: {type: String, default: ""}}, setup() {
  inject("timeline");
}});
const Ap = {class: "el-timeline-item"}, Lp = createVNode("div", {class: "el-timeline-item__tail"}, null, -1), zp = {key: 1, class: "el-timeline-item__dot"}, Fp = {class: "el-timeline-item__wrapper"}, $p = {key: 0, class: "el-timeline-item__timestamp is-top"}, Rp = {class: "el-timeline-item__content"}, Hp = {key: 1, class: "el-timeline-item__timestamp is-bottom"};
Bp.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("li", Ap, [Lp, e.$slots.dot ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", {key: 0, class: ["el-timeline-item__node", ["el-timeline-item__node--" + (e.size || ""), "el-timeline-item__node--" + (e.type || "")]], style: {backgroundColor: e.color}}, [e.icon ? (openBlock(), createBlock("i", {key: 0, class: ["el-timeline-item__icon", e.icon]}, null, 2)) : createCommentVNode("v-if", true)], 6)), e.$slots.dot ? (openBlock(), createBlock("div", zp, [renderSlot(e.$slots, "dot")])) : createCommentVNode("v-if", true), createVNode("div", Fp, [e.hideTimestamp || e.placement !== "top" ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", $p, toDisplayString(e.timestamp), 1)), createVNode("div", Rp, [renderSlot(e.$slots, "default")]), e.hideTimestamp || e.placement !== "bottom" ? createCommentVNode("v-if", true) : (openBlock(), createBlock("div", Hp, toDisplayString(e.timestamp), 1))])]);
}, Bp.__file = "packages/timeline/src/item.vue", Bp.install = (e) => {
  e.component(Bp.name, Bp);
};
const Wp = Bp;
var jp = defineComponent({name: "ElTransferPanel", components: {ElCheckboxGroup: mo, ElCheckbox: Mn, ElInput: vl, OptionContent: ({option: e}) => e}, props: {data: {type: Array, default: () => []}, optionRender: Function, placeholder: String, title: String, filterable: Boolean, format: Object, filterMethod: Function, defaultChecked: Array, props: Object}, emits: ["checked-change"], setup(e, {emit: t, slots: l}) {
  const i = reactive({checked: [], allChecked: false, query: "", inputHover: false, checkChangeByUser: true}), {labelProp: r, keyProp: s, disabledProp: u, filteredData: d, checkedSummary: c, isIndeterminate: p2, handleAllCheckedChange: h2} = ((e2, t2, l2) => {
    const a = computed(() => e2.props.label || "label"), i2 = computed(() => e2.props.key || "key"), r2 = computed(() => e2.props.disabled || "disabled"), s2 = computed(() => e2.data.filter((l3) => typeof e2.filterMethod == "function" ? e2.filterMethod(t2.query, l3) : (l3[a.value] || l3[i2.value].toString()).toLowerCase().includes(t2.query.toLowerCase()))), u2 = computed(() => s2.value.filter((e3) => !e3[r2.value])), d2 = computed(() => {
      const l3 = t2.checked.length, a2 = e2.data.length, {noChecked: n, hasChecked: o} = e2.format;
      return n && o ? l3 > 0 ? o.replace(/\${checked}/g, l3.toString()).replace(/\${total}/g, a2.toString()) : n.replace(/\${total}/g, a2.toString()) : `${l3}/${a2}`;
    }), c2 = computed(() => {
      const e3 = t2.checked.length;
      return e3 > 0 && e3 < u2.value.length;
    }), p3 = () => {
      const e3 = u2.value.map((e4) => e4[i2.value]);
      t2.allChecked = e3.length > 0 && e3.every((e4) => t2.checked.includes(e4));
    };
    return watch(() => t2.checked, (e3, a2) => {
      if (p3(), t2.checkChangeByUser) {
        const t3 = e3.concat(a2).filter((t4) => !e3.includes(t4) || !a2.includes(t4));
        l2("checked-change", e3, t3);
      } else
        l2("checked-change", e3), t2.checkChangeByUser = true;
    }), watch(u2, () => {
      p3();
    }), watch(() => e2.data, () => {
      const e3 = [], l3 = s2.value.map((e4) => e4[i2.value]);
      t2.checked.forEach((t3) => {
        l3.includes(t3) && e3.push(t3);
      }), t2.checkChangeByUser = false, t2.checked = e3;
    }), watch(() => e2.defaultChecked, (e3, l3) => {
      if (l3 && e3.length === l3.length && e3.every((e4) => l3.includes(e4)))
        return;
      const a2 = [], n = u2.value.map((e4) => e4[i2.value]);
      e3.forEach((e4) => {
        n.includes(e4) && a2.push(e4);
      }), t2.checkChangeByUser = false, t2.checked = a2;
    }, {immediate: true}), {labelProp: a, keyProp: i2, disabledProp: r2, filteredData: s2, checkableData: u2, checkedSummary: d2, isIndeterminate: c2, updateAllChecked: p3, handleAllCheckedChange: (e3) => {
      t2.checked = e3 ? u2.value.map((e4) => e4[i2.value]) : [];
    }};
  })(e, i, t), v = computed(() => i.query.length > 0 && d.value.length === 0), m = computed(() => i.query.length > 0 && i.inputHover ? "circle-close" : "search"), f = computed(() => !!l.default()[0].children.length), {checked: g, allChecked: b, query: y, inputHover: k, checkChangeByUser: C} = toRefs(i);
  return {labelProp: r, keyProp: s, disabledProp: u, filteredData: d, checkedSummary: c, isIndeterminate: p2, handleAllCheckedChange: h2, checked: g, allChecked: b, query: y, inputHover: k, checkChangeByUser: C, hasNoMatch: v, inputIcon: m, hasFooter: f, clearQuery: () => {
    m.value === "circle-close" && (i.query = "");
  }, t: ya};
}});
const Kp = {class: "el-transfer-panel"}, Yp = {class: "el-transfer-panel__header"}, qp = {key: 0, class: "el-transfer-panel__footer"};
jp.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-checkbox"), r = resolveComponent("el-input"), p2 = resolveComponent("option-content"), y = resolveComponent("el-checkbox-group");
  return openBlock(), createBlock("div", Kp, [createVNode("p", Yp, [createVNode(i, {modelValue: e.allChecked, "onUpdate:modelValue": t[1] || (t[1] = (t2) => e.allChecked = t2), indeterminate: e.isIndeterminate, onChange: e.handleAllCheckedChange}, {default: withCtx(() => [createTextVNode(toDisplayString(e.title) + " ", 1), createVNode("span", null, toDisplayString(e.checkedSummary), 1)]), _: 1}, 8, ["modelValue", "indeterminate", "onChange"])]), createVNode("div", {class: ["el-transfer-panel__body", e.hasFooter ? "is-with-footer" : ""]}, [e.filterable ? (openBlock(), createBlock(r, {key: 0, modelValue: e.query, "onUpdate:modelValue": t[3] || (t[3] = (t2) => e.query = t2), class: "el-transfer-panel__filter", size: "small", placeholder: e.placeholder, onMouseenter: t[4] || (t[4] = (t2) => e.inputHover = true), onMouseleave: t[5] || (t[5] = (t2) => e.inputHover = false)}, {prefix: withCtx(() => [createVNode("i", {class: ["el-input__icon", "el-icon-" + e.inputIcon], onClick: t[2] || (t[2] = (...t2) => e.clearQuery && e.clearQuery(...t2))}, null, 2)]), _: 1}, 8, ["modelValue", "placeholder"])) : createCommentVNode("v-if", true), withDirectives(createVNode(y, {modelValue: e.checked, "onUpdate:modelValue": t[6] || (t[6] = (t2) => e.checked = t2), class: [{"is-filterable": e.filterable}, "el-transfer-panel__list"]}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.filteredData, (t2) => (openBlock(), createBlock(i, {key: t2[e.keyProp], class: "el-transfer-panel__item", label: t2[e.keyProp], disabled: t2[e.disabledProp]}, {default: withCtx(() => [createVNode(p2, {option: e.optionRender(t2)}, null, 8, ["option"])]), _: 2}, 1032, ["label", "disabled"]))), 128))]), _: 1}, 8, ["modelValue", "class"]), [[vShow, !e.hasNoMatch && e.data.length > 0]]), withDirectives(createVNode("p", {class: "el-transfer-panel__empty"}, toDisplayString(e.hasNoMatch ? e.t("el.transfer.noMatch") : e.t("el.transfer.noData")), 513), [[vShow, e.hasNoMatch || e.data.length === 0]])], 2), e.hasFooter ? (openBlock(), createBlock("p", qp, [renderSlot(e.$slots, "default")])) : createCommentVNode("v-if", true)]);
}, jp.__file = "packages/transfer/src/transfer-panel.vue";
const Up = "change";
var Gp = defineComponent({name: "ElTransfer", components: {TransferPanel: jp, ElButton: pa}, props: {data: {type: Array, default: () => []}, titles: {type: Array, default: () => []}, buttonTexts: {type: Array, default: () => []}, filterPlaceholder: {type: String, default: ""}, filterMethod: Function, leftDefaultChecked: {type: Array, default: () => []}, rightDefaultChecked: {type: Array, default: () => []}, renderContent: Function, modelValue: {type: Array, default: () => []}, format: {type: Object, default: () => ({})}, filterable: {type: Boolean, default: false}, props: {type: Object, default: () => ({label: "label", key: "key", disabled: "disabled"})}, targetOrder: {type: String, default: "original", validator: (e) => ["original", "push", "unshift"].includes(e)}}, emits: [qt, Up, "left-check-change", "right-check-change"], setup(e, {emit: t, slots: i}) {
  const r = inject("elFormItem", {}), s = reactive({leftChecked: [], rightChecked: []}), {propsKey: u, sourceData: d, targetData: c} = ((e2) => {
    const t2 = computed(() => e2.props.key), l = computed(() => e2.data.reduce((e3, l2) => (e3[l2[t2.value]] = l2) && e3, {})), a = computed(() => e2.data.filter((l2) => !e2.modelValue.includes(l2[t2.value]))), o = computed(() => e2.targetOrder === "original" ? e2.data.filter((l2) => e2.modelValue.includes(l2[t2.value])) : e2.modelValue.reduce((e3, t3) => {
      const a2 = l.value[t3];
      return a2 && e3.push(a2), e3;
    }, []));
    return {propsKey: t2, sourceData: a, targetData: o};
  })(e), {onSourceCheckedChange: p2, onTargetCheckedChange: h$1} = ((e2, t2) => ({onSourceCheckedChange: (l, a) => {
    e2.leftChecked = l, a !== void 0 && t2("left-check-change", l, a);
  }, onTargetCheckedChange: (l, a) => {
    e2.rightChecked = l, a !== void 0 && t2("right-check-change", l, a);
  }}))(s, t), {addToLeft: v, addToRight: m} = ((e2, t2, l, a) => {
    const n = (e3, t3, l2) => {
      a(qt, e3), a(Up, e3, t3, l2);
    };
    return {addToLeft: () => {
      const l2 = e2.modelValue.slice();
      t2.rightChecked.forEach((e3) => {
        const t3 = l2.indexOf(e3);
        t3 > -1 && l2.splice(t3, 1);
      }), n(l2, "left", t2.rightChecked);
    }, addToRight: () => {
      let a2 = e2.modelValue.slice();
      const o = e2.data.filter((a3) => {
        const n2 = a3[l.value];
        return t2.leftChecked.includes(n2) && !e2.modelValue.includes(n2);
      }).map((e3) => e3[l.value]);
      a2 = e2.targetOrder === "unshift" ? o.concat(a2) : a2.concat(o), n(a2, "right", t2.leftChecked);
    }};
  })(e, s, u, t), f = ref(null), g = ref(null), b = computed(() => e.buttonTexts.length === 2), y = computed(() => e.titles[0] || ya("el.transfer.titles.0")), k = computed(() => e.titles[1] || ya("el.transfer.titles.1")), C = computed(() => e.filterPlaceholder || ya("el.transfer.filterPlaceholder"));
  watch(() => e.modelValue, (e2) => {
    var t2;
    (t2 = r.formItemMitt) === null || t2 === void 0 || t2.emit("el.form.change", e2);
  });
  const x = computed(() => (t2) => e.renderContent ? e.renderContent(h, t2) : i.default ? i.default({option: t2}) : h("span", t2[e.props.label] || t2[e.props.key]));
  return Object.assign(Object.assign({sourceData: d, targetData: c, onSourceCheckedChange: p2, onTargetCheckedChange: h$1, addToLeft: v, addToRight: m}, toRefs(s)), {hasButtonTexts: b, leftPanelTitle: y, rightPanelTitle: k, panelFilterPlaceholder: C, clearQuery: (e2) => {
    e2 === "left" ? f.value.query = "" : e2 === "right" && (g.value.query = "");
  }, optionRender: x});
}});
const Xp = {class: "el-transfer"}, Zp = {class: "el-transfer__buttons"}, Qp = createVNode("i", {class: "el-icon-arrow-left"}, null, -1), Jp = {key: 0}, eh = {key: 0}, th = createVNode("i", {class: "el-icon-arrow-right"}, null, -1);
Gp.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("transfer-panel"), r = resolveComponent("el-button");
  return openBlock(), createBlock("div", Xp, [createVNode(i, {ref: "leftPanel", data: e.sourceData, "option-render": e.optionRender, placeholder: e.panelFilterPlaceholder, title: e.leftPanelTitle, filterable: e.filterable, format: e.format, "filter-method": e.filterMethod, "default-checked": e.leftDefaultChecked, props: e.props, onCheckedChange: e.onSourceCheckedChange}, {default: withCtx(() => [renderSlot(e.$slots, "left-footer")]), _: 3}, 8, ["data", "option-render", "placeholder", "title", "filterable", "format", "filter-method", "default-checked", "props", "onCheckedChange"]), createVNode("div", Zp, [createVNode(r, {type: "primary", class: ["el-transfer__button", e.hasButtonTexts ? "is-with-texts" : ""], disabled: e.rightChecked.length === 0, onClick: e.addToLeft}, {default: withCtx(() => [Qp, e.buttonTexts[0] !== void 0 ? (openBlock(), createBlock("span", Jp, toDisplayString(e.buttonTexts[0]), 1)) : createCommentVNode("v-if", true)]), _: 1}, 8, ["class", "disabled", "onClick"]), createVNode(r, {type: "primary", class: ["el-transfer__button", e.hasButtonTexts ? "is-with-texts" : ""], disabled: e.leftChecked.length === 0, onClick: e.addToRight}, {default: withCtx(() => [e.buttonTexts[1] !== void 0 ? (openBlock(), createBlock("span", eh, toDisplayString(e.buttonTexts[1]), 1)) : createCommentVNode("v-if", true), th]), _: 1}, 8, ["class", "disabled", "onClick"])]), createVNode(i, {ref: "rightPanel", data: e.targetData, "option-render": e.optionRender, placeholder: e.panelFilterPlaceholder, filterable: e.filterable, format: e.format, "filter-method": e.filterMethod, title: e.rightPanelTitle, "default-checked": e.rightDefaultChecked, props: e.props, onCheckedChange: e.onTargetCheckedChange}, {default: withCtx(() => [renderSlot(e.$slots, "right-footer")]), _: 3}, 8, ["data", "option-render", "placeholder", "filterable", "format", "filter-method", "title", "default-checked", "props", "onCheckedChange"])]);
}, Gp.__file = "packages/transfer/src/index.vue", Gp.install = (e) => {
  e.component(Gp.name, Gp);
};
const lh = Gp, ah = "$treeNodeId", nh = function(e, t) {
  t && !t[ah] && Object.defineProperty(t, ah, {value: e.id, enumerable: false, configurable: false, writable: false});
}, oh = function(e, t) {
  return e ? t[e] : t[ah];
}, ih = (e) => {
  let t = true, l = true, a = true;
  for (let n = 0, o = e.length; n < o; n++) {
    const o2 = e[n];
    (o2.checked !== true || o2.indeterminate) && (t = false, o2.disabled || (a = false)), (o2.checked !== false || o2.indeterminate) && (l = false);
  }
  return {all: t, none: l, allWithoutDisable: a, half: !t && !l};
}, rh = function(e) {
  if (e.childNodes.length === 0)
    return;
  const {all: t, none: l, half: a} = ih(e.childNodes);
  t ? (e.checked = true, e.indeterminate = false) : a ? (e.checked = false, e.indeterminate = true) : l && (e.checked = false, e.indeterminate = false);
  const n = e.parent;
  n && n.level !== 0 && (e.store.checkStrictly || rh(n));
}, sh = function(e, t) {
  const l = e.store.props, a = e.data || {}, n = l[t];
  if (typeof n == "function")
    return n(a, e);
  if (typeof n == "string")
    return a[n];
  if (n === void 0) {
    const e2 = a[t];
    return e2 === void 0 ? "" : e2;
  }
};
let uh = 0;
class dh {
  constructor(e) {
    this.id = uh++, this.text = null, this.checked = false, this.indeterminate = false, this.data = null, this.expanded = false, this.parent = null, this.visible = true, this.isCurrent = false, this.canFocus = false;
    for (const t in e)
      we(e, t) && (this[t] = e[t]);
    this.level = 0, this.loaded = false, this.childNodes = [], this.loading = false, this.parent && (this.level = this.parent.level + 1);
  }
  initialize() {
    const e = this.store;
    if (!e)
      throw new Error("[Node]store is required!");
    e.registerNode(this);
    const t = e.props;
    if (t && t.isLeaf !== void 0) {
      const e2 = sh(this, "isLeaf");
      typeof e2 == "boolean" && (this.isLeafByUser = e2);
    }
    if (e.lazy !== true && this.data ? (this.setData(this.data), e.defaultExpandAll && (this.expanded = true, this.canFocus = true)) : this.level > 0 && e.lazy && e.defaultExpandAll && this.expand(), Array.isArray(this.data) || nh(this, this.data), !this.data)
      return;
    const l = e.defaultExpandedKeys, a = e.key;
    a && l && l.indexOf(this.key) !== -1 && this.expand(null, e.autoExpandParent), a && e.currentNodeKey !== void 0 && this.key === e.currentNodeKey && (e.currentNode = this, e.currentNode.isCurrent = true), e.lazy && e._initDefaultCheckedNode(this), this.updateLeafState(), !this.parent || this.level !== 1 && this.parent.expanded !== true || (this.canFocus = true);
  }
  setData(e) {
    let t;
    Array.isArray(e) || nh(this, e), this.data = e, this.childNodes = [], t = this.level === 0 && this.data instanceof Array ? this.data : sh(this, "children") || [];
    for (let e2 = 0, l = t.length; e2 < l; e2++)
      this.insertChild({data: t[e2]});
  }
  get label() {
    return sh(this, "label");
  }
  get key() {
    const e = this.store.key;
    return this.data ? this.data[e] : null;
  }
  get disabled() {
    return sh(this, "disabled");
  }
  get nextSibling() {
    const e = this.parent;
    if (e) {
      const t = e.childNodes.indexOf(this);
      if (t > -1)
        return e.childNodes[t + 1];
    }
    return null;
  }
  get previousSibling() {
    const e = this.parent;
    if (e) {
      const t = e.childNodes.indexOf(this);
      if (t > -1)
        return t > 0 ? e.childNodes[t - 1] : null;
    }
    return null;
  }
  contains(e, t = true) {
    return (this.childNodes || []).some((l) => l === e || t && l.contains(e));
  }
  remove() {
    const e = this.parent;
    e && e.removeChild(this);
  }
  insertChild(e, t, l) {
    if (!e)
      throw new Error("insertChild error: child is required.");
    if (!(e instanceof dh)) {
      if (!l) {
        const l2 = this.getChildren(true);
        l2.indexOf(e.data) === -1 && (t === void 0 || t < 0 ? l2.push(e.data) : l2.splice(t, 0, e.data));
      }
      Object.assign(e, {parent: this, store: this.store}), (e = reactive(new dh(e))) instanceof dh && e.initialize();
    }
    e.level = this.level + 1, t === void 0 || t < 0 ? this.childNodes.push(e) : this.childNodes.splice(t, 0, e), this.updateLeafState();
  }
  insertBefore(e, t) {
    let l;
    t && (l = this.childNodes.indexOf(t)), this.insertChild(e, l);
  }
  insertAfter(e, t) {
    let l;
    t && (l = this.childNodes.indexOf(t), l !== -1 && (l += 1)), this.insertChild(e, l);
  }
  removeChild(e) {
    const t = this.getChildren() || [], l = t.indexOf(e.data);
    l > -1 && t.splice(l, 1);
    const a = this.childNodes.indexOf(e);
    a > -1 && (this.store && this.store.deregisterNode(e), e.parent = null, this.childNodes.splice(a, 1)), this.updateLeafState();
  }
  removeChildByData(e) {
    let t = null;
    for (let l = 0; l < this.childNodes.length; l++)
      if (this.childNodes[l].data === e) {
        t = this.childNodes[l];
        break;
      }
    t && this.removeChild(t);
  }
  expand(e, t) {
    const l = () => {
      if (t) {
        let e2 = this.parent;
        for (; e2.level > 0; )
          e2.expanded = true, e2 = e2.parent;
      }
      this.expanded = true, e && e(), this.childNodes.forEach((e2) => {
        e2.canFocus = true;
      });
    };
    this.shouldLoadData() ? this.loadData((e2) => {
      Array.isArray(e2) && (this.checked ? this.setChecked(true, true) : this.store.checkStrictly || rh(this), l());
    }) : l();
  }
  doCreateChildren(e, t = {}) {
    e.forEach((e2) => {
      this.insertChild(Object.assign({data: e2}, t), void 0, true);
    });
  }
  collapse() {
    this.expanded = false, this.childNodes.forEach((e) => {
      e.canFocus = false;
    });
  }
  shouldLoadData() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  }
  updateLeafState() {
    if (this.store.lazy === true && this.loaded !== true && this.isLeafByUser !== void 0)
      return void (this.isLeaf = this.isLeafByUser);
    const e = this.childNodes;
    !this.store.lazy || this.store.lazy === true && this.loaded === true ? this.isLeaf = !e || e.length === 0 : this.isLeaf = false;
  }
  setChecked(e, t, l, a) {
    if (this.indeterminate = e === "half", this.checked = e === true, this.store.checkStrictly)
      return;
    if (!this.shouldLoadData() || this.store.checkDescendants) {
      const {all: l2, allWithoutDisable: n2} = ih(this.childNodes);
      this.isLeaf || l2 || !n2 || (this.checked = false, e = false);
      const o = () => {
        if (t) {
          const l3 = this.childNodes;
          for (let n4 = 0, o3 = l3.length; n4 < o3; n4++) {
            const o4 = l3[n4];
            a = a || e !== false;
            const i = o4.disabled ? o4.checked : a;
            o4.setChecked(i, t, true, a);
          }
          const {half: n3, all: o2} = ih(l3);
          o2 || (this.checked = o2, this.indeterminate = n3);
        }
      };
      if (this.shouldLoadData())
        return void this.loadData(() => {
          o(), rh(this);
        }, {checked: e !== false});
      o();
    }
    const n = this.parent;
    n && n.level !== 0 && (l || rh(n));
  }
  getChildren(e = false) {
    if (this.level === 0)
      return this.data;
    const t = this.data;
    if (!t)
      return null;
    const l = this.store.props;
    let a = "children";
    return l && (a = l.children || "children"), t[a] === void 0 && (t[a] = null), e && !t[a] && (t[a] = []), t[a];
  }
  updateChildren() {
    const e = this.getChildren() || [], t = this.childNodes.map((e2) => e2.data), l = {}, a = [];
    e.forEach((e2, n) => {
      const o = e2[ah];
      !!o && t.findIndex((e3) => e3[ah] === o) >= 0 ? l[o] = {index: n, data: e2} : a.push({index: n, data: e2});
    }), this.store.lazy || t.forEach((e2) => {
      l[e2[ah]] || this.removeChildByData(e2);
    }), a.forEach(({index: e2, data: t2}) => {
      this.insertChild({data: t2}, e2);
    }), this.updateLeafState();
  }
  loadData(e, t = {}) {
    if (this.store.lazy !== true || !this.store.load || this.loaded || this.loading && !Object.keys(t).length)
      e && e.call(this);
    else {
      this.loading = true;
      const l = (l2) => {
        this.loaded = true, this.loading = false, this.childNodes = [], this.doCreateChildren(l2, t), this.updateLeafState(), e && e.call(this, l2);
      };
      this.store.load(this, l);
    }
  }
}
class ch {
  constructor(e) {
    this.currentNode = null, this.currentNodeKey = null;
    for (const t in e)
      we(e, t) && (this[t] = e[t]);
    this.nodesMap = {};
  }
  initialize() {
    if (this.root = new dh({data: this.data, store: this}), this.root.initialize(), this.lazy && this.load) {
      (0, this.load)(this.root, (e) => {
        this.root.doCreateChildren(e), this._initDefaultCheckedNodes();
      });
    } else
      this._initDefaultCheckedNodes();
  }
  filter(e) {
    const t = this.filterNodeMethod, l = this.lazy, a = function(n) {
      const o = n.root ? n.root.childNodes : n.childNodes;
      if (o.forEach((l2) => {
        l2.visible = t.call(l2, e, l2.data, l2), a(l2);
      }), !n.visible && o.length) {
        let e2 = true;
        e2 = !o.some((e3) => e3.visible), n.root ? n.root.visible = e2 === false : n.visible = e2 === false;
      }
      e && (!n.visible || n.isLeaf || l || n.expand());
    };
    a(this);
  }
  setData(e) {
    e !== this.root.data ? (this.root.setData(e), this._initDefaultCheckedNodes()) : this.root.updateChildren();
  }
  getNode(e) {
    if (e instanceof dh)
      return e;
    const t = typeof e != "object" ? e : oh(this.key, e);
    return this.nodesMap[t] || null;
  }
  insertBefore(e, t) {
    const l = this.getNode(t);
    l.parent.insertBefore({data: e}, l);
  }
  insertAfter(e, t) {
    const l = this.getNode(t);
    l.parent.insertAfter({data: e}, l);
  }
  remove(e) {
    const t = this.getNode(e);
    t && t.parent && (t === this.currentNode && (this.currentNode = null), t.parent.removeChild(t));
  }
  append(e, t) {
    const l = t ? this.getNode(t) : this.root;
    l && l.insertChild({data: e});
  }
  _initDefaultCheckedNodes() {
    const e = this.defaultCheckedKeys || [], t = this.nodesMap;
    e.forEach((e2) => {
      const l = t[e2];
      l && l.setChecked(true, !this.checkStrictly);
    });
  }
  _initDefaultCheckedNode(e) {
    (this.defaultCheckedKeys || []).indexOf(e.key) !== -1 && e.setChecked(true, !this.checkStrictly);
  }
  setDefaultCheckedKey(e) {
    e !== this.defaultCheckedKeys && (this.defaultCheckedKeys = e, this._initDefaultCheckedNodes());
  }
  registerNode(e) {
    const t = this.key;
    if (e && e.data)
      if (t) {
        e.key !== void 0 && (this.nodesMap[e.key] = e);
      } else
        this.nodesMap[e.id] = e;
  }
  deregisterNode(e) {
    this.key && e && e.data && (e.childNodes.forEach((e2) => {
      this.deregisterNode(e2);
    }), delete this.nodesMap[e.key]);
  }
  getCheckedNodes(e = false, t = false) {
    const l = [], a = function(n) {
      (n.root ? n.root.childNodes : n.childNodes).forEach((n2) => {
        (n2.checked || t && n2.indeterminate) && (!e || e && n2.isLeaf) && l.push(n2.data), a(n2);
      });
    };
    return a(this), l;
  }
  getCheckedKeys(e = false) {
    return this.getCheckedNodes(e).map((e2) => (e2 || {})[this.key]);
  }
  getHalfCheckedNodes() {
    const e = [], t = function(l) {
      (l.root ? l.root.childNodes : l.childNodes).forEach((l2) => {
        l2.indeterminate && e.push(l2.data), t(l2);
      });
    };
    return t(this), e;
  }
  getHalfCheckedKeys() {
    return this.getHalfCheckedNodes().map((e) => (e || {})[this.key]);
  }
  _getAllNodes() {
    const e = [], t = this.nodesMap;
    for (const l in t)
      we(t, l) && e.push(t[l]);
    return e;
  }
  updateChildren(e, t) {
    const l = this.nodesMap[e];
    if (!l)
      return;
    const a = l.childNodes;
    for (let e2 = a.length - 1; e2 >= 0; e2--) {
      const t2 = a[e2];
      this.remove(t2.data);
    }
    for (let e2 = 0, a2 = t.length; e2 < a2; e2++) {
      const a3 = t[e2];
      this.append(a3, l.data);
    }
  }
  _setCheckedKeys(e, t = false, l) {
    const a = this._getAllNodes().sort((e2, t2) => t2.level - e2.level), n = Object.create(null), o = Object.keys(l);
    a.forEach((e2) => e2.setChecked(false, false));
    for (let l2 = 0, i = a.length; l2 < i; l2++) {
      const i2 = a[l2], r = i2.data[e].toString();
      if (!(o.indexOf(r) > -1)) {
        i2.checked && !n[r] && i2.setChecked(false, false);
        continue;
      }
      let s = i2.parent;
      for (; s && s.level > 0; )
        n[s.data[e]] = true, s = s.parent;
      if (i2.isLeaf || this.checkStrictly)
        i2.setChecked(true, false);
      else if (i2.setChecked(true, true), t) {
        i2.setChecked(false, false);
        const e2 = function(t2) {
          t2.childNodes.forEach((t3) => {
            t3.isLeaf || t3.setChecked(false, false), e2(t3);
          });
        };
        e2(i2);
      }
    }
  }
  setCheckedNodes(e, t = false) {
    const l = this.key, a = {};
    e.forEach((e2) => {
      a[(e2 || {})[l]] = true;
    }), this._setCheckedKeys(l, t, a);
  }
  setCheckedKeys(e, t = false) {
    this.defaultCheckedKeys = e;
    const l = this.key, a = {};
    e.forEach((e2) => {
      a[e2] = true;
    }), this._setCheckedKeys(l, t, a);
  }
  setDefaultExpandedKeys(e) {
    e = e || [], this.defaultExpandedKeys = e, e.forEach((e2) => {
      const t = this.getNode(e2);
      t && t.expand(null, this.autoExpandParent);
    });
  }
  setChecked(e, t, l) {
    const a = this.getNode(e);
    a && a.setChecked(!!t, l);
  }
  getCurrentNode() {
    return this.currentNode;
  }
  setCurrentNode(e) {
    const t = this.currentNode;
    t && (t.isCurrent = false), this.currentNode = e, this.currentNode.isCurrent = true;
  }
  setUserCurrentNode(e, t = true) {
    const l = e[this.key], a = this.nodesMap[l];
    this.setCurrentNode(a), t && this.currentNode.level > 1 && this.currentNode.parent.expand(null, true);
  }
  setCurrentNodeKey(e, t = true) {
    if (e == null)
      return this.currentNode && (this.currentNode.isCurrent = false), void (this.currentNode = null);
    const l = this.getNode(e);
    l && (this.setCurrentNode(l), t && this.currentNode.level > 1 && this.currentNode.parent.expand(null, true));
  }
}
var ph = defineComponent({name: "ElTreeNodeContent", props: {node: {type: Object, required: true}, renderContent: Function}, setup(e) {
  const t = inject("NodeInstance"), l = inject("RootTree");
  return () => {
    const a = e.node, {data: n, store: o} = a;
    return e.renderContent ? e.renderContent(h, {_self: t, node: a, data: n, store: o}) : l.ctx.slots.default ? l.ctx.slots.default({node: a, data: n}) : h("span", {class: "el-tree-node__label"}, [a.label]);
  };
}});
function hh(e) {
  const t = inject("TreeNodeMap", null), l = {treeNodeExpand: (t2) => {
    e.node !== t2 && e.node.collapse();
  }, children: []};
  return t && t.children.push(l), provide("TreeNodeMap", l), {broadcastExpanded: (t2) => {
    if (e.accordion)
      for (const e2 of l.children)
        e2.treeNodeExpand(t2);
  }};
}
ph.__file = "packages/tree/src/tree-node-content.vue";
var vh = defineComponent({name: "ElTreeNode", components: {ElCollapseTransition: Co, ElCheckbox: Mn, NodeContent: ph}, props: {node: {type: dh, default: () => ({})}, props: {type: Object, default: () => ({})}, renderContent: Function, renderAfterExpand: Boolean, showCheckbox: {type: Boolean, default: false}}, emits: ["node-expand"], setup(t, a) {
  const {broadcastExpanded: n} = hh(t), i = inject("RootTree"), r = ref(false), s = ref(false), u = ref(null), d = ref(null), c = ref(null), {emitter: p2} = {emitter: inject("DragNodeEmitter")}, h2 = getCurrentInstance();
  provide("NodeInstance", h2), i || console.warn("Can not find node's tree."), t.node.expanded && (r.value = true, s.value = true);
  const v = i.props.children || "children";
  watch(() => {
    const e = t.node.data[v];
    return e && [...e];
  }, () => {
    t.node.updateChildren();
  }), watch(() => t.node.indeterminate, (e) => {
    m(t.node.checked, e);
  }), watch(() => t.node.checked, (e) => {
    m(e, t.node.indeterminate);
  }), watch(() => t.node.expanded, (e) => {
    nextTick(() => r.value = e), e && (s.value = true);
  });
  const m = (e, l) => {
    u.value === e && d.value === l || i.ctx.emit("check-change", t.node.data, e, l), u.value = e, d.value = l;
  }, f = () => {
    t.node.isLeaf || (r.value ? (i.ctx.emit("node-collapse", t.node.data, t.node, h2), t.node.collapse()) : (t.node.expand(), a.emit("node-expand", t.node.data, t.node, h2)));
  }, g = (e, l) => {
    t.node.setChecked(l.target.checked, !i.props.checkStrictly), nextTick(() => {
      const e2 = i.store.value;
      i.ctx.emit("check", t.node.data, {checkedNodes: e2.getCheckedNodes(), checkedKeys: e2.getCheckedKeys(), halfCheckedNodes: e2.getHalfCheckedNodes(), halfCheckedKeys: e2.getHalfCheckedKeys()});
    });
  };
  return {node$: c, tree: i, expanded: r, childNodeRendered: s, oldChecked: u, oldIndeterminate: d, emitter: p2, parent, getNodeKey: (e) => oh(i.props.nodeKey, e.data), handleSelectChange: m, handleClick: () => {
    const e = i.store.value;
    e.setCurrentNode(t.node), i.ctx.emit("current-change", e.currentNode ? e.currentNode.data : null, e.currentNode), i.currentNode.value = t.node, i.props.expandOnClickNode && f(), i.props.checkOnClickNode && !t.node.disabled && g(null, {target: {checked: !t.node.checked}}), i.ctx.emit("node-click", t.node.data, t.node, h2);
  }, handleContextMenu: (e) => {
    i.instance.vnode.props.onNodeContextmenu && (e.stopPropagation(), e.preventDefault()), i.ctx.emit("node-contextmenu", e, t.node.data, t.node, h2);
  }, handleExpandIconClick: f, handleCheckChange: g, handleChildNodeExpand: (e, t2, l) => {
    n(t2), i.ctx.emit("node-expand", e, t2, l);
  }, handleDragStart: (e) => {
    i.props.draggable && p2.emit("tree-node-drag-start", {event: e, treeNode: t});
  }, handleDragOver: (e) => {
    i.props.draggable && (p2.emit("tree-node-drag-over", {event: e, treeNode: {$el: c.value, node: t.node}}), e.preventDefault());
  }, handleDrop: (e) => {
    e.preventDefault();
  }, handleDragEnd: (e) => {
    i.props.draggable && p2.emit("tree-node-drag-end", e);
  }};
}});
const mh = {key: 1, class: "el-tree-node__loading-icon el-icon-loading"};
vh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-checkbox"), r = resolveComponent("node-content"), c = resolveComponent("el-tree-node"), p2 = resolveComponent("el-collapse-transition");
  return withDirectives((openBlock(), createBlock("div", {ref: "node$", class: ["el-tree-node", {"is-expanded": e.expanded, "is-current": e.node.isCurrent, "is-hidden": !e.node.visible, "is-focusable": !e.node.disabled, "is-checked": !e.node.disabled && e.node.checked}], role: "treeitem", tabindex: "-1", "aria-expanded": e.expanded, "aria-disabled": e.node.disabled, "aria-checked": e.node.checked, draggable: e.tree.props.draggable, "data-key": e.getNodeKey(e.node), onClick: t[3] || (t[3] = withModifiers((...t2) => e.handleClick && e.handleClick(...t2), ["stop"])), onContextmenu: t[4] || (t[4] = (...t2) => e.handleContextMenu && e.handleContextMenu(...t2)), onDragstart: t[5] || (t[5] = withModifiers((...t2) => e.handleDragStart && e.handleDragStart(...t2), ["stop"])), onDragover: t[6] || (t[6] = withModifiers((...t2) => e.handleDragOver && e.handleDragOver(...t2), ["stop"])), onDragend: t[7] || (t[7] = withModifiers((...t2) => e.handleDragEnd && e.handleDragEnd(...t2), ["stop"])), onDrop: t[8] || (t[8] = withModifiers((...t2) => e.handleDrop && e.handleDrop(...t2), ["stop"]))}, [createVNode("div", {class: "el-tree-node__content", style: {"padding-left": (e.node.level - 1) * e.tree.props.indent + "px"}}, [createVNode("span", {class: [{"is-leaf": e.node.isLeaf, expanded: !e.node.isLeaf && e.expanded}, "el-tree-node__expand-icon", e.tree.props.iconClass ? e.tree.props.iconClass : "el-icon-caret-right"], onClick: t[1] || (t[1] = withModifiers((...t2) => e.handleExpandIconClick && e.handleExpandIconClick(...t2), ["stop"]))}, null, 2), e.showCheckbox ? (openBlock(), createBlock(i, {key: 0, "model-value": e.node.checked, indeterminate: e.node.indeterminate, disabled: !!e.node.disabled, onClick: t[2] || (t[2] = withModifiers(() => {
  }, ["stop"])), onChange: e.handleCheckChange}, null, 8, ["model-value", "indeterminate", "disabled", "onChange"])) : createCommentVNode("v-if", true), e.node.loading ? (openBlock(), createBlock("span", mh)) : createCommentVNode("v-if", true), createVNode(r, {node: e.node, "render-content": e.renderContent}, null, 8, ["node", "render-content"])], 4), createVNode(p2, null, {default: withCtx(() => [!e.renderAfterExpand || e.childNodeRendered ? withDirectives((openBlock(), createBlock("div", {key: 0, class: "el-tree-node__children", role: "group", "aria-expanded": e.expanded}, [(openBlock(true), createBlock(Fragment, null, renderList(e.node.childNodes, (t2) => (openBlock(), createBlock(c, {key: e.getNodeKey(t2), "render-content": e.renderContent, "render-after-expand": e.renderAfterExpand, "show-checkbox": e.showCheckbox, node: t2, onNodeExpand: e.handleChildNodeExpand}, null, 8, ["render-content", "render-after-expand", "show-checkbox", "node", "onNodeExpand"]))), 128))], 8, ["aria-expanded"])), [[vShow, e.expanded]]) : createCommentVNode("v-if", true)]), _: 1})], 42, ["aria-expanded", "aria-disabled", "aria-checked", "draggable", "data-key"])), [[vShow, e.node.visible]]);
}, vh.__file = "packages/tree/src/tree-node.vue";
var fh = defineComponent({name: "ElTree", components: {ElTreeNode: vh}, props: {data: {type: Array}, emptyText: {type: String, default: () => ya("el.tree.emptyText")}, renderAfterExpand: {type: Boolean, default: true}, nodeKey: String, checkStrictly: Boolean, defaultExpandAll: Boolean, expandOnClickNode: {type: Boolean, default: true}, checkOnClickNode: Boolean, checkDescendants: {type: Boolean, default: false}, autoExpandParent: {type: Boolean, default: true}, defaultCheckedKeys: Array, defaultExpandedKeys: Array, currentNodeKey: [String, Number], renderContent: Function, showCheckbox: {type: Boolean, default: false}, draggable: {type: Boolean, default: false}, allowDrag: Function, allowDrop: Function, props: {type: Object, default: () => ({children: "children", label: "label", disabled: "disabled"})}, lazy: {type: Boolean, default: false}, highlightCurrent: Boolean, load: Function, filterNodeMethod: Function, accordion: Boolean, indent: {type: Number, default: 18}, iconClass: String}, emits: ["check-change", "current-change", "node-click", "node-contextmenu", "node-collapse", "node-expand", "check", "node-drag-start", "node-drag-end", "node-drop", "node-drag-leave", "node-drag-enter", "node-drag-over"], setup(t, a) {
  const s = ref(new ch({key: t.nodeKey, data: t.data, lazy: t.lazy, props: t.props, load: t.load, currentNodeKey: t.currentNodeKey, checkStrictly: t.checkStrictly, checkDescendants: t.checkDescendants, defaultCheckedKeys: t.defaultCheckedKeys, defaultExpandedKeys: t.defaultExpandedKeys, autoExpandParent: t.autoExpandParent, defaultExpandAll: t.defaultExpandAll, filterNodeMethod: t.filterNodeMethod}));
  s.value.initialize();
  const u = ref(s.value.root), d = ref(null), c = ref(null), p2 = ref(null), {broadcastExpanded: h2} = hh(t), {dragState: v} = function({props: e, ctx: t2, el$: a2, dropIndicator$: n, store: o}) {
    const i = ae();
    provide("DragNodeEmitter", i);
    const r = ref({showDropIndicator: false, draggingNode: null, dropNode: null, allowDrop: true, dropType: null});
    return i.on("tree-node-drag-start", ({event: l, treeNode: a3}) => {
      if (console.log(l, a3), typeof e.allowDrag == "function" && !e.allowDrag(a3.node))
        return l.preventDefault(), false;
      l.dataTransfer.effectAllowed = "move";
      try {
        l.dataTransfer.setData("text/plain", "");
      } catch (e2) {
      }
      r.value.draggingNode = a3, t2.emit("node-drag-start", a3.node, l);
    }), i.on("tree-node-drag-over", ({event: l, treeNode: o2}) => {
      const i2 = o2, s2 = r.value.dropNode;
      s2 && s2 !== i2 && ot(s2.$el, "is-drop-inner");
      const u2 = r.value.draggingNode;
      if (!u2 || !i2)
        return;
      let d2 = true, c2 = true, p3 = true, h3 = true;
      typeof e.allowDrop == "function" && (d2 = e.allowDrop(u2.node, i2.node, "prev"), h3 = c2 = e.allowDrop(u2.node, i2.node, "inner"), p3 = e.allowDrop(u2.node, i2.node, "next")), l.dataTransfer.dropEffect = c2 ? "move" : "none", (d2 || c2 || p3) && s2 !== i2 && (s2 && t2.emit("node-drag-leave", u2.node, s2.node, l), t2.emit("node-drag-enter", u2.node, i2.node, l)), (d2 || c2 || p3) && (r.value.dropNode = i2), i2.node.nextSibling === u2.node && (p3 = false), i2.node.previousSibling === u2.node && (d2 = false), i2.node.contains(u2.node, false) && (c2 = false), (u2.node === i2.node || u2.node.contains(i2.node)) && (d2 = false, c2 = false, p3 = false);
      const v2 = i2.$el.getBoundingClientRect(), m2 = a2.value.getBoundingClientRect();
      let f2;
      const g = d2 ? c2 ? 0.25 : p3 ? 0.45 : 1 : -1, b = p3 ? c2 ? 0.75 : d2 ? 0.55 : 0 : 1;
      let y = -9999;
      const k = l.clientY - v2.top;
      f2 = k < v2.height * g ? "before" : k > v2.height * b ? "after" : c2 ? "inner" : "none";
      const C = i2.$el.querySelector(".el-tree-node__expand-icon").getBoundingClientRect(), x = n.value;
      f2 === "before" ? y = C.top - m2.top : f2 === "after" && (y = C.bottom - m2.top), x.style.top = y + "px", x.style.left = C.right - m2.left + "px", f2 === "inner" ? nt(i2.$el, "is-drop-inner") : ot(i2.$el, "is-drop-inner"), r.value.showDropIndicator = f2 === "before" || f2 === "after", r.value.allowDrop = r.value.showDropIndicator || h3, r.value.dropType = f2, t2.emit("node-drag-over", u2.node, i2.node, l);
    }), i.on("tree-node-drag-end", (e2) => {
      const {draggingNode: l, dropType: a3, dropNode: n2} = r.value;
      if (e2.preventDefault(), e2.dataTransfer.dropEffect = "move", l && n2) {
        const i2 = {data: l.node.data};
        a3 !== "none" && l.node.remove(), a3 === "before" ? n2.node.parent.insertBefore(i2, n2.node) : a3 === "after" ? n2.node.parent.insertAfter(i2, n2.node) : a3 === "inner" && n2.node.insertChild(i2), a3 !== "none" && o.value.registerNode(i2), ot(n2.$el, "is-drop-inner"), t2.emit("node-drag-end", l.node, n2.node, a3, e2), a3 !== "none" && t2.emit("node-drop", l.node, n2.node, a3, e2);
      }
      l && !n2 && t2.emit("node-drag-end", l.node, null, a3, e2), r.value.showDropIndicator = false, r.value.draggingNode = null, r.value.dropNode = null, r.value.allowDrop = true;
    }), {dragState: r};
  }({props: t, ctx: a, el$: c, dropIndicator$: p2, store: s});
  !function({el$: e}, t2) {
    const a2 = ref([]), n = ref([]);
    onMounted(() => {
      u2(), tt(e.value, "keydown", s2);
    }), onBeforeUnmount(() => {
      lt(e.value, "keydown", s2);
    }), onUpdated(() => {
      a2.value = Array.from(e.value.querySelectorAll("[role=treeitem]")), n.value = Array.from(e.value.querySelectorAll("input[type=checkbox]"));
    }), watch(n, (e2) => {
      e2.forEach((e3) => {
        e3.setAttribute("tabindex", "-1");
      });
    });
    const s2 = (l) => {
      const n2 = l.target;
      if (n2.className.indexOf("el-tree-node") === -1)
        return;
      const o = l.code;
      a2.value = Array.from(e.value.querySelectorAll(".is-focusable[role=treeitem]"));
      const i = a2.value.indexOf(n2);
      let r;
      if ([Dt.up, Dt.down].indexOf(o) > -1) {
        if (l.preventDefault(), o === Dt.up) {
          r = i === -1 ? 0 : i !== 0 ? i - 1 : a2.value.length - 1;
          const e2 = r;
          for (; !t2.value.getNode(a2.value[r].dataset.key).canFocus; ) {
            if (r--, r === e2) {
              r = -1;
              break;
            }
            r < 0 && (r = a2.value.length - 1);
          }
        } else {
          r = i === -1 ? 0 : i < a2.value.length - 1 ? i + 1 : 0;
          const e2 = r;
          for (; !t2.value.getNode(a2.value[r].dataset.key).canFocus; ) {
            if (r++, r === e2) {
              r = -1;
              break;
            }
            r >= a2.value.length && (r = 0);
          }
        }
        r !== -1 && a2.value[r].focus();
      }
      [Dt.left, Dt.right].indexOf(o) > -1 && (l.preventDefault(), n2.click());
      const s3 = n2.querySelector('[type="checkbox"]');
      [Dt.enter, Dt.space].indexOf(o) > -1 && s3 && (l.preventDefault(), s3.click());
    }, u2 = () => {
      var t3;
      a2.value = Array.from(e.value.querySelectorAll(".is-focusable[role=treeitem]")), n.value = Array.from(e.value.querySelectorAll("input[type=checkbox]"));
      const l = e.value.querySelectorAll(".is-checked[role=treeitem]");
      l.length ? l[0].setAttribute("tabindex", "0") : (t3 = a2.value[0]) === null || t3 === void 0 || t3.setAttribute("tabindex", "0");
    };
  }({el$: c}, s);
  const m = computed(() => {
    const {childNodes: e} = u.value;
    return !e || e.length === 0 || e.every(({visible: e2}) => !e2);
  });
  watch(() => t.defaultCheckedKeys, (e) => {
    s.value.setDefaultCheckedKey(e);
  }), watch(() => t.defaultExpandedKeys, (e) => {
    s.value.defaultExpandedKeys = e, s.value.setDefaultExpandedKeys(e);
  }), watch(() => t.data, (e) => {
    s.value.setData(e);
  }, {deep: true}), watch(() => t.checkStrictly, (e) => {
    s.value.checkStrictly = e;
  });
  const f = () => {
    const e = s.value.getCurrentNode();
    return e ? e.data : null;
  };
  return provide("RootTree", {ctx: a, props: t, store: s, root: u, currentNode: d, instance: getCurrentInstance()}), {store: s, root: u, currentNode: d, dragState: v, el$: c, dropIndicator$: p2, isEmpty: m, filter: (e) => {
    if (!t.filterNodeMethod)
      throw new Error("[Tree] filterNodeMethod is required when filter");
    s.value.filter(e);
  }, getNodeKey: (e) => oh(t.nodeKey, e.data), getNodePath: (e) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in getNodePath");
    const l = s.value.getNode(e);
    if (!l)
      return [];
    const a2 = [l.data];
    let n = l.parent;
    for (; n && n !== u.value; )
      a2.push(n.data), n = n.parent;
    return a2.reverse();
  }, getCheckedNodes: (e, t2) => s.value.getCheckedNodes(e, t2), getCheckedKeys: (e) => s.value.getCheckedKeys(e), getCurrentNode: f, getCurrentKey: () => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in getCurrentKey");
    const e = f();
    return e ? e[t.nodeKey] : null;
  }, setCheckedNodes: (e, l) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in setCheckedNodes");
    s.value.setCheckedNodes(e, l);
  }, setCheckedKeys: (e, l) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in setCheckedKeys");
    s.value.setCheckedKeys(e, l);
  }, setChecked: (e, t2, l) => {
    s.value.setChecked(e, t2, l);
  }, getHalfCheckedNodes: () => s.value.getHalfCheckedNodes(), getHalfCheckedKeys: () => s.value.getHalfCheckedKeys(), setCurrentNode: (e, l = true) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in setCurrentNode");
    s.value.setUserCurrentNode(e, l);
  }, setCurrentKey: (e, l = true) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in setCurrentKey");
    s.value.setCurrentNodeKey(e, l);
  }, getNode: (e) => s.value.getNode(e), remove: (e) => {
    s.value.remove(e);
  }, append: (e, t2) => {
    s.value.append(e, t2);
  }, insertBefore: (e, t2) => {
    s.value.insertBefore(e, t2);
  }, insertAfter: (e, t2) => {
    s.value.insertAfter(e, t2);
  }, handleNodeExpand: (e, t2, l) => {
    h2(t2), a.emit("node-expand", e, t2, l);
  }, updateKeyChildren: (e, l) => {
    if (!t.nodeKey)
      throw new Error("[Tree] nodeKey is required in updateKeyChild");
    s.value.updateChildren(e, l);
  }};
}});
const gh = {key: 0, class: "el-tree__empty-block"}, bh = {class: "el-tree__empty-text"}, yh = {ref: "dropIndicator$", class: "el-tree__drop-indicator"};
fh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-tree-node");
  return openBlock(), createBlock("div", {ref: "el$", class: ["el-tree", {"el-tree--highlight-current": e.highlightCurrent, "is-dragging": !!e.dragState.draggingNode, "is-drop-not-allow": !e.dragState.allowDrop, "is-drop-inner": e.dragState.dropType === "inner"}], role: "tree"}, [(openBlock(true), createBlock(Fragment, null, renderList(e.root.childNodes, (t2) => (openBlock(), createBlock(i, {key: e.getNodeKey(t2), node: t2, props: e.props, "render-after-expand": e.renderAfterExpand, "show-checkbox": e.showCheckbox, "render-content": e.renderContent, onNodeExpand: e.handleNodeExpand}, null, 8, ["node", "props", "render-after-expand", "show-checkbox", "render-content", "onNodeExpand"]))), 128)), e.isEmpty ? (openBlock(), createBlock("div", gh, [createVNode("span", bh, toDisplayString(e.emptyText), 1)])) : createCommentVNode("v-if", true), withDirectives(createVNode("div", yh, null, 512), [[vShow, e.dragState.showDropIndicator]])], 2);
}, fh.__file = "packages/tree/src/tree.vue", fh.install = (e) => {
  e.component(fh.name, fh);
};
const kh = fh;
function Ch(e, t, l) {
  let a;
  a = l.response ? "" + (l.response.error || l.response) : l.responseText ? "" + l.responseText : `fail to post ${e} ${l.status}`;
  const n = new Error(a);
  return n.status = l.status, n.method = "post", n.url = e, n;
}
function xh(e) {
  if (typeof XMLHttpRequest == "undefined")
    return;
  const t = new XMLHttpRequest(), l = e.action;
  t.upload && (t.upload.onprogress = function(t2) {
    t2.total > 0 && (t2.percent = t2.loaded / t2.total * 100), e.onProgress(t2);
  });
  const a = new FormData();
  e.data && Object.keys(e.data).forEach((t2) => {
    a.append(t2, e.data[t2]);
  }), a.append(e.filename, e.file, e.file.name), t.onerror = function() {
    e.onError(Ch(l, 0, t));
  }, t.onload = function() {
    if (t.status < 200 || t.status >= 300)
      return e.onError(Ch(l, 0, t));
    e.onSuccess(function(e2) {
      const t2 = e2.responseText || e2.response;
      if (!t2)
        return t2;
      try {
        return JSON.parse(t2);
      } catch (e3) {
        return t2;
      }
    }(t));
  }, t.open("post", l, true), e.withCredentials && "withCredentials" in t && (t.withCredentials = true);
  const n = e.headers || {};
  for (const e2 in n)
    we(n, e2) && n[e2] !== null && t.setRequestHeader(e2, n[e2]);
  return t.send(a), t;
}
var wh = defineComponent({name: "ElUploadList", components: {ElProgress: jd}, props: {files: {type: Array, default: () => []}, disabled: {type: Boolean, default: false}, handlePreview: {type: Function, default: () => ke}, listType: {type: String, default: "text"}}, emits: ["remove"], setup: (e, {emit: t}) => ({focusing: ref(false), parsePercentage: (e2) => parseInt(e2, 10), handleClick: (t2) => {
  e.handlePreview(t2);
}, handleRemove: (e2, l) => {
  t("remove", l);
}, onFileClicked: (e2) => {
  e2.target.focus();
}, t: ya})});
const _h = createVNode("i", {class: "el-icon-document"}, null, -1), Sh = {class: "el-upload-list__item-status-label"}, Eh = {key: 2, class: "el-icon-close-tip"}, Mh = {key: 4, class: "el-upload-list__item-actions"}, Th = createVNode("i", {class: "el-icon-zoom-in"}, null, -1), Nh = createVNode("i", {class: "el-icon-delete"}, null, -1);
wh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-progress");
  return openBlock(), createBlock(TransitionGroup, {tag: "ul", class: ["el-upload-list", "el-upload-list--" + e.listType, {"is-disabled": e.disabled}], name: "el-list"}, {default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(e.files, (l2) => (openBlock(), createBlock("li", {key: l2, class: ["el-upload-list__item", "is-" + l2.status, e.focusing ? "focusing" : ""], tabindex: "0", onKeydown: withKeys((t2) => !e.disabled && e.handleRemove(t2, l2), ["delete"]), onFocus: t[1] || (t[1] = (t2) => e.focusing = true), onBlur: t[2] || (t[2] = (t2) => e.focusing = false), onClick: t[3] || (t[3] = (...t2) => e.onFileClicked && e.onFileClicked(...t2))}, [renderSlot(e.$slots, "default", {file: l2}, () => [l2.status !== "uploading" && ["picture-card", "picture"].includes(e.listType) ? (openBlock(), createBlock("img", {key: 0, class: "el-upload-list__item-thumbnail", src: l2.url, alt: ""}, null, 8, ["src"])) : createCommentVNode("v-if", true), createVNode("a", {class: "el-upload-list__item-name", onClick: (t2) => e.handleClick(l2)}, [_h, createTextVNode(toDisplayString(l2.name), 1)], 8, ["onClick"]), createVNode("label", Sh, [createVNode("i", {class: {"el-icon-upload-success": true, "el-icon-circle-check": e.listType === "text", "el-icon-check": ["picture-card", "picture"].includes(e.listType)}}, null, 2)]), e.disabled ? createCommentVNode("v-if", true) : (openBlock(), createBlock("i", {key: 1, class: "el-icon-close", onClick: (t2) => e.handleRemove(t2, l2)}, null, 8, ["onClick"])), createCommentVNode(" Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn"), createCommentVNode(" This is a bug which needs to be fixed "), createCommentVNode(" TODO: Fix the incorrect navigation interaction "), e.disabled ? createCommentVNode("v-if", true) : (openBlock(), createBlock("i", Eh, toDisplayString(e.t("el.upload.deleteTip")), 1)), l2.status === "uploading" ? (openBlock(), createBlock(i, {key: 3, type: e.listType === "picture-card" ? "circle" : "line", "stroke-width": e.listType === "picture-card" ? 6 : 2, percentage: e.parsePercentage(l2.percentage)}, null, 8, ["type", "stroke-width", "percentage"])) : createCommentVNode("v-if", true), e.listType === "picture-card" ? (openBlock(), createBlock("span", Mh, [createVNode("span", {class: "el-upload-list__item-preview", onClick: (t2) => e.handlePreview(l2)}, [Th], 8, ["onClick"]), e.disabled ? createCommentVNode("v-if", true) : (openBlock(), createBlock("span", {key: 0, class: "el-upload-list__item-delete", onClick: (t2) => e.handleRemove(t2, l2)}, [Nh], 8, ["onClick"]))])) : createCommentVNode("v-if", true)])], 42, ["onKeydown"]))), 128))]), _: 3}, 8, ["class"]);
}, wh.__file = "packages/upload/src/upload-list.vue";
var Dh = defineComponent({name: "ElUploadDrag", props: {disabled: {type: Boolean, default: false}}, emits: ["file"], setup(e, {emit: t}) {
  const a = inject("uploader", {}), n = ref(false);
  return {dragover: n, onDrop: function(l) {
    if (e.disabled || !a)
      return;
    const o = a.accept;
    n.value = false, t("file", o ? Array.from(l.dataTransfer.files).filter((e2) => {
      const {type: t2, name: l2} = e2, a2 = l2.indexOf(".") > -1 ? "." + l2.split(".").pop() : "", n2 = t2.replace(/\/.*$/, "");
      return o.split(",").map((e3) => e3.trim()).filter((e3) => e3).some((e3) => e3.startsWith(".") ? a2 === e3 : /\/\*$/.test(e3) ? n2 === e3.replace(/\/\*$/, "") : !!/^[^\/]+\/[^\/]+$/.test(e3) && t2 === e3);
    }) : l.dataTransfer.files);
  }, onDragover: function() {
    e.disabled || (n.value = true);
  }};
}});
Dh.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: {"el-upload-dragger": true, "is-dragover": e.dragover}, onDrop: t[1] || (t[1] = withModifiers((...t2) => e.onDrop && e.onDrop(...t2), ["prevent"])), onDragover: t[2] || (t[2] = withModifiers((...t2) => e.onDragover && e.onDragover(...t2), ["prevent"])), onDragleave: t[3] || (t[3] = withModifiers((t2) => e.dragover = false, ["prevent"]))}, [renderSlot(e.$slots, "default")], 34);
}, Dh.__file = "packages/upload/src/upload-dragger.vue";
var Oh = defineComponent({components: {UploadDragger: Dh}, props: {type: {type: String, default: ""}, action: {type: String, required: true}, name: {type: String, default: "file"}, data: {type: Object, default: () => null}, headers: {type: Object, default: () => null}, withCredentials: {type: Boolean, default: false}, multiple: {type: Boolean, default: null}, accept: {type: String, default: ""}, onStart: {type: Function, default: ke}, onProgress: {type: Function, default: ke}, onSuccess: {type: Function, default: ke}, onError: {type: Function, default: ke}, beforeUpload: {type: Function, default: ke}, drag: {type: Boolean, default: false}, onPreview: {type: Function, default: ke}, onRemove: {type: Function, default: ke}, fileList: {type: Array, default: () => []}, autoUpload: {type: Boolean, default: true}, listType: {type: String, default: "text"}, httpRequest: {type: Function, default: () => xh}, disabled: Boolean, limit: {type: Number, default: null}, onExceed: {type: Function, default: ke}}, setup(e) {
  const t = ref({}), a = ref(false), n = ref(null);
  function o(t2) {
    if (e.limit && e.fileList.length + t2.length > e.limit)
      return void e.onExceed(t2, e.fileList);
    let l = Array.from(t2);
    e.multiple || (l = l.slice(0, 1)), l.length !== 0 && l.forEach((t3) => {
      e.onStart(t3), e.autoUpload && i(t3);
    });
  }
  function i(t2) {
    if (n.value.value = null, !e.beforeUpload)
      return r(t2);
    const l = e.beforeUpload(t2);
    l instanceof Promise ? l.then((e2) => {
      const l2 = Object.prototype.toString.call(e2);
      if (l2 === "[object File]" || l2 === "[object Blob]") {
        l2 === "[object Blob]" && (e2 = new File([e2], t2.name, {type: t2.type}));
        for (const l3 in t2)
          we(t2, l3) && (e2[l3] = t2[l3]);
        r(e2);
      } else
        r(t2);
    }).catch(() => {
      e.onRemove(null, t2);
    }) : l !== false ? r(t2) : e.onRemove(null, t2);
  }
  function r(l) {
    const {uid: a2} = l, n2 = {headers: e.headers, withCredentials: e.withCredentials, file: l, data: e.data, filename: e.name, action: e.action, onProgress: (t2) => {
      e.onProgress(t2, l);
    }, onSuccess: (n3) => {
      e.onSuccess(n3, l), delete t.value[a2];
    }, onError: (n3) => {
      e.onError(n3, l), delete t.value[a2];
    }}, o2 = e.httpRequest(n2);
    t.value[a2] = o2, o2 instanceof Promise && o2.then(n2.onSuccess, n2.onError);
  }
  function s() {
    e.disabled || (n.value.value = null, n.value.click());
  }
  return {reqs: t, mouseover: a, inputRef: n, abort: function(e2) {
    const l = t.value;
    if (e2) {
      let t2 = e2;
      e2.uid && (t2 = e2.uid), l[t2] && l[t2].abort();
    } else
      Object.keys(l).forEach((e3) => {
        l[e3] && l[e3].abort(), delete l[e3];
      });
  }, post: r, handleChange: function(e2) {
    const t2 = e2.target.files;
    t2 && o(t2);
  }, handleClick: s, handleKeydown: function() {
    s();
  }, upload: i, uploadFiles: o};
}});
function Ih(e, t) {
  return t.find((t2) => t2.uid === e.uid);
}
function Ph(e) {
  return Date.now() + e;
}
Oh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("upload-dragger");
  return openBlock(), createBlock("div", {class: ["el-upload", "el-upload--" + e.listType], tabindex: "0", onClick: t[2] || (t[2] = (...t2) => e.handleClick && e.handleClick(...t2)), onKeydown: t[3] || (t[3] = withKeys(withModifiers((...t2) => e.handleKeydown && e.handleKeydown(...t2), ["self"]), ["enter", "space"]))}, [e.drag ? (openBlock(), createBlock(i, {key: 0, disabled: e.disabled, onFile: e.uploadFiles}, {default: withCtx(() => [renderSlot(e.$slots, "default")]), _: 3}, 8, ["disabled", "onFile"])) : renderSlot(e.$slots, "default", {key: 1}), createVNode("input", {ref: "inputRef", class: "el-upload__input", type: "file", name: e.name, multiple: e.multiple, accept: e.accept, onChange: t[1] || (t[1] = (...t2) => e.handleChange && e.handleChange(...t2))}, null, 40, ["name", "multiple", "accept"])], 34);
}, Oh.__file = "packages/upload/src/upload.vue";
var Vh = defineComponent({name: "ElUpload", components: {Upload: Oh, UploadList: wh}, props: {action: {type: String, required: true}, headers: {type: Object, default: () => ({})}, data: {type: Object, default: () => ({})}, multiple: {type: Boolean, default: false}, name: {type: String, default: "file"}, drag: {type: Boolean, default: false}, withCredentials: Boolean, showFileList: {type: Boolean, default: true}, accept: {type: String, default: ""}, type: {type: String, default: "select"}, beforeUpload: {type: Function, default: ke}, beforeRemove: {type: Function, default: ke}, onRemove: {type: Function, default: ke}, onChange: {type: Function, default: ke}, onPreview: {type: Function, default: ke}, onSuccess: {type: Function, default: ke}, onProgress: {type: Function, default: ke}, onError: {type: Function, default: ke}, fileList: {type: Array, default: () => []}, autoUpload: {type: Boolean, default: true}, listType: {type: String, default: "text"}, httpRequest: {type: Function, default: xh}, disabled: Boolean, limit: {type: Number, default: null}, onExceed: {type: Function, default: () => ke}}, setup(t) {
  const a = inject("elForm", {}), i = computed(() => t.disabled || a.disabled), {abort: s, clearFiles: u, handleError: d, handleProgress: c, handleStart: p2, handleSuccess: h2, handleRemove: v, submit: m, uploadRef: f, uploadFiles: g} = ((e) => {
    let t2 = [];
    const a2 = ref([]), n = ref(null);
    let i2 = 1;
    function r(e2) {
      n.value.abort(e2);
    }
    return watch(() => e.listType, (t3) => {
      t3 !== "picture-card" && t3 !== "picture" || (a2.value = a2.value.map((t4) => {
        if (!t4.url && t4.raw)
          try {
            t4.url = URL.createObjectURL(t4.raw);
          } catch (l) {
            e.onError(l, t4, a2.value);
          }
        return t4;
      }));
    }), watch(() => e.fileList, (e2) => {
      isEqual_1(t2, e2) || (t2 = [], a2.value = e2.map((e3) => {
        const l = cloneDeep_1(e3);
        return t2.push(l), Object.assign(Object.assign({}, l), {uid: e3.uid || Ph(i2++), status: e3.status || "success"});
      }));
    }, {immediate: true, deep: true}), {abort: r, clearFiles: function() {
      a2.value = [];
    }, handleError: function(t3, l) {
      const n2 = Ih(l, a2.value);
      n2.status = "fail", a2.value.splice(a2.value.indexOf(n2), 1), e.onError(t3, n2, a2.value), e.onChange(n2, a2.value);
    }, handleProgress: function(t3, l) {
      const n2 = Ih(l, a2.value);
      e.onProgress(t3, n2, a2.value), n2.status = "uploading", n2.percentage = t3.percent || 0;
    }, handleStart: function(t3) {
      const l = Ph(i2++);
      t3.uid = l;
      const n2 = {name: t3.name, percentage: 0, status: "ready", size: t3.size, raw: t3, uid: l};
      if (e.listType === "picture-card" || e.listType === "picture")
        try {
          n2.url = URL.createObjectURL(t3);
        } catch (t4) {
          console.error("[Element Error][Upload]", t4), e.onError(t4, n2, a2.value);
        }
      a2.value.push(n2), e.onChange(n2, a2.value);
    }, handleSuccess: function(t3, l) {
      const n2 = Ih(l, a2.value);
      n2 && (n2.status = "success", n2.response = t3, e.onSuccess(t3, n2, a2.value), e.onChange(n2, a2.value));
    }, handleRemove: function(t3, l) {
      l && (t3 = Ih(l, a2.value));
      const n2 = () => {
        r(t3);
        const l2 = a2.value;
        l2.splice(l2.indexOf(t3), 1), e.onRemove(t3, l2);
      };
      if (e.beforeRemove) {
        if (typeof e.beforeRemove == "function") {
          const l2 = e.beforeRemove(t3, a2.value);
          l2 instanceof Promise ? l2.then(() => {
            n2();
          }).catch(ke) : l2 !== false && n2();
        }
      } else
        n2();
    }, submit: function() {
      a2.value.filter((e2) => e2.status === "ready").forEach((e2) => {
        n.value.upload(e2.raw);
      });
    }, uploadFiles: a2, uploadRef: n};
  })(t);
  return provide("uploader", getCurrentInstance()), onBeforeUnmount(() => {
    g.value.forEach((e) => {
      e.url && e.url.indexOf("blob:") === 0 && URL.revokeObjectURL(e.url);
    });
  }), {abort: s, dragOver: ref(false), draging: ref(false), handleError: d, handleProgress: c, handleRemove: v, handleStart: p2, handleSuccess: h2, uploadDisabled: i, uploadFiles: g, uploadRef: f, submit: m, clearFiles: u};
}, render() {
  var e, t;
  let l;
  l = this.showFileList ? h(wh, {disabled: this.uploadDisabled, listType: this.listType, files: this.uploadFiles, onRemove: this.handleRemove, handlePreview: this.onPreview}, this.$slots.file ? {default: (e2) => this.$slots.file({file: e2.file})} : null) : null;
  const a = {type: this.type, drag: this.drag, action: this.action, multiple: this.multiple, "before-upload": this.beforeUpload, "with-credentials": this.withCredentials, headers: this.headers, name: this.name, data: this.data, accept: this.accept, fileList: this.uploadFiles, autoUpload: this.autoUpload, listType: this.listType, disabled: this.uploadDisabled, limit: this.limit, "on-exceed": this.onExceed, "on-start": this.handleStart, "on-progress": this.handleProgress, "on-success": this.handleSuccess, "on-error": this.handleError, "on-preview": this.onPreview, "on-remove": this.handleRemove, "http-request": this.httpRequest, ref: "uploadRef"}, n = this.$slots.trigger || this.$slots.default, o = h(Oh, a, {default: () => n == null ? void 0 : n()});
  return h("div", [this.listType === "picture-card" ? l : null, this.$slots.trigger ? [o, this.$slots.default()] : o, (t = (e = this.$slots).tip) === null || t === void 0 ? void 0 : t.call(e), this.listType !== "picture-card" ? l : null]);
}});
Vh.__file = "packages/upload/src/index.vue", Vh.install = (e) => {
  e.component(Vh.name, Vh);
};
const Bh = Vh;
var Ah = defineComponent({props: {prefixCls: {type: String, default: "el-space"}}, setup: (e) => ({classes: computed(() => e.prefixCls + "__item")})});
Ah.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", {class: e.classes}, [renderSlot(e.$slots, "default")], 2);
}, Ah.__file = "packages/space/src/item.vue";
const Lh = {mini: 4, small: 8, medium: 12, large: 16};
const zh = defineComponent({name: "ElSpace", props: {direction: {type: String, default: "horizontal"}, class: {type: [String, Object, Array], default: ""}, style: {type: [String, Array, Object]}, alignment: {type: String, default: "center"}, prefixCls: {type: String}, spacer: {type: [Object, String, Number], default: null, validator: (e) => isVNode(e) || je(e) || Ee(e)}, wrap: {type: Boolean, default: false}, size: {type: [String, Array, Number], validator: (e) => Xt(e) || je(e) || _e(e)}}, setup: (e) => function(e2) {
  const t = computed(() => ["el-space", "el-space--" + e2.direction, e2.class]), a = ref(0), i = ref(0);
  return watch(() => [e2.size, e2.wrap, e2.direction], ([e3 = "small", t2, l]) => {
    if (_e(e3)) {
      const [t3 = 0, l2 = 0] = e3;
      a.value = t3, i.value = l2;
    } else {
      let n;
      n = je(e3) ? e3 : Lh[e3] || Lh.small, t2 && l === "horizontal" ? a.value = i.value = n : l === "horizontal" ? (a.value = n, i.value = 0) : (i.value = n, a.value = 0);
    }
  }, {immediate: true}), {classes: t, containerStyle: computed(() => [e2.wrap ? {flexWrap: "wrap", marginBottom: `-${i.value}px`} : null, {alignItems: e2.alignment}, e2.style]), itemStyle: computed(() => ({paddingBottom: i.value + "px", marginRight: a.value + "px"}))};
}(e), render(e) {
  const {classes: t, $slots: l, containerStyle: a, itemStyle: n, spacer: o, prefixCls: i, direction: r} = e, s = renderSlot(l, "default", {key: 0}, () => []);
  if (s.children.length === 0)
    return null;
  if (_e(s.children)) {
    let e2 = [];
    if (s.children.forEach((t2, l2) => {
      var a2;
      Cl(t2) ? _e(t2.children) && t2.children.forEach((t3, l3) => {
        e2.push(createVNode(Ah, {style: n, prefixCls: i, key: "nested-" + l3}, {default: () => [t3]}, kl.PROPS | kl.STYLE, ["style", "prefixCls"]));
      }) : Cl(a2 = t2) || xl(a2) || e2.push(createVNode(Ah, {style: n, prefixCls: i, key: "LoopKey" + l2}, {default: () => [t2]}, kl.PROPS | kl.STYLE, ["style", "prefixCls"]));
    }), o) {
      const t2 = e2.length - 1;
      e2 = e2.reduce((e3, l2, a2) => a2 === t2 ? [...e3, l2] : [...e3, l2, createVNode("span", {style: [n, r === "vertical" ? "width: 100%" : null], key: a2}, [isVNode(o) ? o : createTextVNode(o, kl.TEXT)], kl.STYLE)], []);
    }
    return createVNode("div", {class: t, style: a}, e2, kl.STYLE | kl.CLASS);
  }
  return s.children;
}});
zh.install = (e) => {
  e.component(zh.name, zh);
};
var Fh = defineComponent({name: "ImgPlaceholder"});
const $h = {viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg"}, Rh = createVNode("path", {d: "M64 896V128h896v768H64z m64-128l192-192 116.352 116.352L640 448l256 307.2V192H128v576z m224-480a96 96 0 1 1-0.064 192.064A96 96 0 0 1 352 288z"}, null, -1);
Fh.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", $h, [Rh]);
}, Fh.__file = "packages/skeleton-item/src/img-placeholder.vue";
var Hh = defineComponent({name: "ElSkeletonItem", components: {[Fh.name]: Fh}, props: {variant: {type: String, default: "text"}}});
Hh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("img-placeholder");
  return openBlock(), createBlock("div", {class: ["el-skeleton__item", "el-skeleton__" + e.variant]}, [e.variant === "image" ? (openBlock(), createBlock(i, {key: 0})) : createCommentVNode("v-if", true)], 2);
}, Hh.__file = "packages/skeleton-item/src/index.vue", Hh.install = (e) => {
  e.component(Hh.name, Hh);
};
const Wh = Hh;
var jh = defineComponent({name: "ElSkeleton", components: {[Wh.name]: Wh}, props: {animated: {type: Boolean, default: false}, count: {type: Number, default: 1}, rows: {type: Number, default: 3}, loading: {type: Boolean, default: true}, throttle: {type: Number}}, setup: (e) => ({uiLoading: function(e2, t = 0) {
  if (t === 0)
    return e2;
  const a = ref(false);
  let n = 0;
  const r = () => {
    n && clearTimeout(n), n = window.setTimeout(() => {
      a.value = e2.value;
    }, t);
  };
  return onMounted(r), watch(() => e2.value, (e3) => {
    e3 ? r() : a.value = e3;
  }), a;
}(computed(() => e.loading), e.throttle)})});
jh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-skeleton-item");
  return e.uiLoading ? (openBlock(), createBlock("div", mergeProps({key: 0, class: ["el-skeleton", e.animated ? "is-animated" : ""]}, e.$attrs), [(openBlock(true), createBlock(Fragment, null, renderList(e.count, (t2) => (openBlock(), createBlock(Fragment, {key: t2}, [e.loading ? renderSlot(e.$slots, "template", {key: 0}, () => [createVNode(i, {class: "is-first", variant: "p"}), (openBlock(true), createBlock(Fragment, null, renderList(e.rows, (t3) => (openBlock(), createBlock(i, {key: t3, class: {"el-skeleton__paragraph": true, "is-last": t3 === e.rows && e.rows > 1}, variant: "p"}, null, 8, ["class"]))), 128))]) : createCommentVNode("v-if", true)], 64))), 128))], 16)) : renderSlot(e.$slots, "default", mergeProps({key: 1}, e.$attrs));
}, jh.__file = "packages/skeleton/src/index.vue", jh.install = (e) => {
  e.component(jh.name, jh);
};
const Kh = jh;
var Yh = defineComponent({name: "ElCheckTag", props: {checked: Boolean}, emits: ["change"], setup: (e, {emit: t}) => ({onChange: () => {
  t("change", !e.checked);
}})});
Yh.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("span", {class: {"el-check-tag": true, "is-checked": e.checked}, onClick: t[1] || (t[1] = (...t2) => e.onChange && e.onChange(...t2))}, [renderSlot(e.$slots, "default")], 2);
}, Yh.__file = "packages/check-tag/src/index.vue", Yh.install = (e) => {
  e.component(Yh.name, Yh);
};
const qh = Yh;
var Uh = defineComponent({name: "ElDescriptionsItem"});
Uh.install = (e) => {
  e.component(Uh.name, Uh);
};
const Gh = Uh;
var Xh = defineComponent({name: "ElDescriptionsCell", props: {cell: {type: Object}, tag: {type: String}, type: {type: String}}, setup: (e) => ({descriptions: inject("elDescriptions", {}), label: computed(() => {
  var t, l, a, n, o;
  return ((a = (l = (t = e.cell) === null || t === void 0 ? void 0 : t.children) === null || l === void 0 ? void 0 : l.label) === null || a === void 0 ? void 0 : a.call(l)) || ((o = (n = e.cell) === null || n === void 0 ? void 0 : n.props) === null || o === void 0 ? void 0 : o.label);
}), content: computed(() => {
  var t, l, a;
  return (a = (l = (t = e.cell) === null || t === void 0 ? void 0 : t.children) === null || l === void 0 ? void 0 : l.default) === null || a === void 0 ? void 0 : a.call(l);
}), span: computed(() => {
  var t, l;
  return ((l = (t = e.cell) === null || t === void 0 ? void 0 : t.props) === null || l === void 0 ? void 0 : l.span) || 1;
})}), render() {
  switch (this.type) {
    case "label":
      return h(this.tag, {class: ["el-descriptions__label", {"is-bordered-label": this.descriptions.border}], colSpan: this.descriptions.direction === "vertical" ? this.span : 1}, this.label);
    case "content":
      return h(this.tag, {class: "el-descriptions__content", colSpan: this.descriptions.direction === "vertical" ? this.span : 2 * this.span - 1}, this.content);
    default:
      return h("td", {colSpan: this.span}, [h("span", {class: ["el-descriptions__label", {"is-bordered-label": this.descriptions.border}]}, this.label), h("span", {class: "el-descriptions__content"}, this.content)]);
  }
}}), Zh = defineComponent({name: "ElDescriptionsRow", components: {[Xh.name]: Xh}, props: {row: {type: Array}}, setup: () => ({descriptions: inject("elDescriptions", {})})});
const Qh = {key: 1};
Zh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-descriptions-cell");
  return e.descriptions.direction === "vertical" ? (openBlock(), createBlock(Fragment, {key: 0}, [createVNode("tr", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.row, (e2, t2) => (openBlock(), createBlock(i, {key: "tr1-" + t2, cell: e2, tag: "th", type: "label"}, null, 8, ["cell"]))), 128))]), createVNode("tr", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.row, (e2, t2) => (openBlock(), createBlock(i, {key: "tr2-" + t2, cell: e2, tag: "td", type: "content"}, null, 8, ["cell"]))), 128))])], 64)) : (openBlock(), createBlock("tr", Qh, [(openBlock(true), createBlock(Fragment, null, renderList(e.row, (t2, l2) => (openBlock(), createBlock(Fragment, {key: "tr3-" + l2}, [e.descriptions.border ? (openBlock(), createBlock(Fragment, {key: 0}, [createVNode(i, {cell: t2, tag: "td", type: "label"}, null, 8, ["cell"]), createVNode(i, {cell: t2, tag: "td", type: "content"}, null, 8, ["cell"])], 64)) : (openBlock(), createBlock(i, {key: 1, cell: t2, tag: "td", type: "both"}, null, 8, ["cell"]))], 64))), 128))]));
}, Zh.__file = "packages/descriptions/src/descriptions-row.vue";
var Jh = defineComponent({name: "ElDescriptions", components: {[Gh.name]: Gh, [Zh.name]: Zh}, props: {border: {type: Boolean, default: false}, column: {type: Number, default: 3}, direction: {type: String, default: "horizontal"}, size: {type: String, validator: Xt}, title: {type: String, default: ""}, extra: {type: String, default: ""}}, setup(e, {slots: t}) {
  provide("elDescriptions", e);
  const l = Ue(), a = computed(() => e.size || l.size), o = (e2) => {
    const t2 = Array.isArray(e2) ? e2 : [e2], l2 = [];
    return t2.forEach((e3) => {
      Array.isArray(e3.children) ? l2.push(...o(e3.children)) : l2.push(e3);
    }), l2;
  }, i = (t2, l2, a2, n = false) => (t2.props || (t2.props = {}), l2 > a2 && (t2.props.span = a2), n && (t2.props.span = e.column), t2);
  return {descriptionsSize: a, rows: computed(() => {
    var l2;
    const a2 = o((l2 = t.default) === null || l2 === void 0 ? void 0 : l2.call(t)).filter((e2) => {
      var t2;
      return ((t2 = e2 == null ? void 0 : e2.type) === null || t2 === void 0 ? void 0 : t2.name) === "ElDescriptionsItem";
    }), n = [];
    let r = [], s = e.column;
    return a2.forEach((t2, l3) => {
      var o2;
      const u = ((o2 = t2.props) === null || o2 === void 0 ? void 0 : o2.span) || 1;
      if (l3 === a2.length - 1)
        return r.push(i(t2, u, s, true)), void n.push(r);
      u < s ? (s -= u, r.push(t2)) : (r.push(i(t2, u, s)), n.push(r), s = e.column, r = []);
    }), n;
  })};
}});
const ev = {class: "el-descriptions"}, tv = {key: 0, class: "el-descriptions__header"}, lv = {class: "el-descriptions__title"}, av = {class: "el-descriptions__extra"}, nv = {class: "el-descriptions__body"};
Jh.render = function(e, t, l, a, n, o) {
  const i = resolveComponent("el-descriptions-row");
  return openBlock(), createBlock("div", ev, [e.title || e.extra || e.$slots.title || e.$slots.extra ? (openBlock(), createBlock("div", tv, [createVNode("div", lv, [renderSlot(e.$slots, "title", {}, () => [createTextVNode(toDisplayString(e.title), 1)])]), createVNode("div", av, [renderSlot(e.$slots, "extra", {}, () => [createTextVNode(toDisplayString(e.extra), 1)])])])) : createCommentVNode("v-if", true), createVNode("div", nv, [createVNode("table", {class: [{"is-bordered": e.border}, e.descriptionsSize ? "el-descriptions--" + e.descriptionsSize : ""]}, [createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(e.rows, (e2, t2) => (openBlock(), createBlock(i, {key: t2, row: e2}, null, 8, ["row"]))), 128))])], 2)])]);
}, Jh.__file = "packages/descriptions/src/index.vue", Jh.install = (e) => {
  e.component(Jh.name, Jh);
};
const ov = Jh;
var iv = defineComponent({name: "IconSuccess"});
const rv = {viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg"}, sv = createVNode("path", {d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M34.5548098,16.4485711 C33.9612228,15.8504763 32.9988282,15.8504763 32.4052412,16.4485711 L32.4052412,16.4485711 L21.413757,27.5805811 L21.413757,27.5805811 L21.4034642,27.590855 C21.0097542,27.9781674 20.3766105,27.9729811 19.9892981,27.5792711 L19.9892981,27.5792711 L15.5947588,23.1121428 C15.0011718,22.514048 14.0387772,22.514048 13.4451902,23.1121428 C12.8516033,23.7102376 12.8516033,24.6799409 13.4451902,25.2780357 L13.4451902,25.2780357 L19.6260786,31.5514289 C20.2196656,32.1495237 21.1820602,32.1495237 21.7756472,31.5514289 L21.7756472,31.5514289 L34.5548098,18.614464 C35.1483967,18.0163692 35.1483967,17.0466659 34.5548098,16.4485711 Z"}, null, -1);
iv.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", rv, [sv]);
}, iv.__file = "packages/result/src/icon-success.vue";
var uv = defineComponent({name: "IconError"});
const dv = {viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg"}, cv = createVNode("path", {d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.57818,15.42182 C32.0157534,14.8593933 31.1038797,14.8593933 30.541453,15.42182 L30.541453,15.42182 L24.0006789,21.9625941 L17.458547,15.42182 C16.8961203,14.8593933 15.9842466,14.8593933 15.42182,15.42182 C14.8593933,15.9842466 14.8593933,16.8961203 15.42182,17.458547 L15.42182,17.458547 L21.9639519,23.9993211 L15.42182,30.541453 C14.8593933,31.1038797 14.8593933,32.0157534 15.42182,32.57818 C15.9842466,33.1406067 16.8961203,33.1406067 17.458547,32.57818 L17.458547,32.57818 L24.0006789,26.0360481 L30.541453,32.57818 C31.1038797,33.1406067 32.0157534,33.1406067 32.57818,32.57818 C33.1406067,32.0157534 33.1406067,31.1038797 32.57818,30.541453 L32.57818,30.541453 L26.0374059,23.9993211 L32.57818,17.458547 C33.1406067,16.8961203 33.1406067,15.9842466 32.57818,15.42182 Z"}, null, -1);
uv.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", dv, [cv]);
}, uv.__file = "packages/result/src/icon-error.vue";
var pv = defineComponent({name: "IconWarning"});
const hv = {viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg"}, vv = createVNode("path", {d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,31 C22.8954305,31 22,31.8954305 22,33 C22,34.1045695 22.8954305,35 24,35 C25.1045695,35 26,34.1045695 26,33 C26,31.8954305 25.1045695,31 24,31 Z M24,14 C23.1715729,14 22.5,14.6715729 22.5,15.5 L22.5,15.5 L22.5,27.5 C22.5,28.3284271 23.1715729,29 24,29 C24.8284271,29 25.5,28.3284271 25.5,27.5 L25.5,27.5 L25.5,15.5 C25.5,14.6715729 24.8284271,14 24,14 Z"}, null, -1);
pv.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", hv, [vv]);
}, pv.__file = "packages/result/src/icon-warning.vue";
var mv = defineComponent({name: "IconInfo"});
const fv = {viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg"}, gv = createVNode("path", {d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,19 L21,19 C20.1715729,19 19.5,19.6715729 19.5,20.5 C19.5,21.3284271 20.1715729,22 21,22 L21,22 L22.5,22 L22.5,31 L21,31 C20.1715729,31 19.5,31.6715729 19.5,32.5 C19.5,33.3284271 20.1715729,34 21,34 L21,34 L27,34 C27.8284271,34 28.5,33.3284271 28.5,32.5 C28.5,31.6715729 27.8284271,31 27,31 L27,31 L25.5,31 L25.5,20.5 C25.5,19.6715729 24.8284271,19 24,19 L24,19 Z M24,13 C22.8954305,13 22,13.8954305 22,15 C22,16.1045695 22.8954305,17 24,17 C25.1045695,17 26,16.1045695 26,15 C26,13.8954305 25.1045695,13 24,13 Z"}, null, -1);
mv.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("svg", fv, [gv]);
}, mv.__file = "packages/result/src/icon-info.vue";
const bv = {success: "icon-success", warning: "icon-warning", error: "icon-error", info: "icon-info"};
var yv = defineComponent({name: "ElResult", components: {[iv.name]: iv, [uv.name]: uv, [pv.name]: pv, [mv.name]: mv}, props: {title: {type: String, default: ""}, subTitle: {type: String, default: ""}, icon: {type: String, default: "info"}}, setup: (e) => ({iconElement: computed(() => {
  const t = e.icon;
  return t && bv[t] ? bv[t] : "icon-info";
})})});
const kv = {class: "el-result"}, Cv = {class: "el-result__icon"}, xv = {key: 0, class: "el-result__title"}, wv = {key: 1, class: "el-result__subtitle"}, _v = {key: 2, class: "el-result__extra"};
yv.render = function(e, t, l, a, n, o) {
  return openBlock(), createBlock("div", kv, [createVNode("div", Cv, [renderSlot(e.$slots, "icon", {}, () => [(openBlock(), createBlock(resolveDynamicComponent(e.iconElement), {class: e.iconElement}, null, 8, ["class"]))])]), e.title || e.$slots.title ? (openBlock(), createBlock("div", xv, [renderSlot(e.$slots, "title", {}, () => [createVNode("p", null, toDisplayString(e.title), 1)])])) : createCommentVNode("v-if", true), e.subTitle || e.$slots.subTitle ? (openBlock(), createBlock("div", wv, [renderSlot(e.$slots, "subTitle", {}, () => [createVNode("p", null, toDisplayString(e.subTitle), 1)])])) : createCommentVNode("v-if", true), e.$slots.extra ? (openBlock(), createBlock("div", _v, [renderSlot(e.$slots, "extra")])) : createCommentVNode("v-if", true)]);
}, yv.__file = "packages/result/src/index.vue", yv.install = (e) => {
  e.component(yv.name, yv);
};
const Sv = yv;
if (!ye) {
  const e = window;
  e.dayjs || (e.dayjs = ie);
}
const Mv = (e) => {
  fa = e || fa, fa.name && ie.locale(fa.name);
}, Tv = {size: "", zIndex: 2e3}, Nv = [mt, kt, xt, Yl, Ul, Ql, ta, na, sa, pa, ma, un, pn, bn, Cn, uo, eo, Mn, po, mo, qh, fo, yo, _o, Co, Jo, ti, Ji, sr, dr, mr, kr, xr, _r, Ur, Xr, el, Jr, ts, as, Es, ms, vl, As, Fs, Gs, lu, su, cu, ed, od, cd, Md, Id, zd, Hl, jd, In, Yd, Ud, Xd, Zd, yl, Ju, ic, pc, vc, fc, kc, xc, gp, wp, Mp, lo, Za, Ip, Vp, Wp, ou, lh, kh, Bh, zh, Kh, Wh, ov, Gh, Sv], Dv = [Vs, Ys, bu, Pu, $u], Ov = (e, t) => {
  const l = Object.assign(Tv, t);
  var a;
  Mv(l.locale), l.i18n && (a = l.i18n, ga = a), e.config.globalProperties.$ELEMENT = l, ((e2) => {
    El = e2;
  })(l), Nv.forEach((t2) => {
    e.component(t2.name, t2);
  }), Dv.forEach((t2) => {
    e.use(t2);
  });
};
var Iv = {version: "1.0.2-beta.44", install: Ov};
export {Fragment as F, Iv as I, popScopeId as a, resolveComponent as b, createBlock as c, defineComponent as d, createVNode as e, createTextVNode as f, createStaticVNode as g, createApp as h, openBlock as o, pushScopeId as p, ref as r, toDisplayString as t, withScopeId as w};
