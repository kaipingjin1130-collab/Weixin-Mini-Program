var Zu = { exports: {} }, vn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Kf;
function Rv() {
  if (Kf) return vn;
  Kf = 1;
  var m = Symbol.for("react.transitional.element"), N = Symbol.for("react.fragment");
  function O(f, H, Z) {
    var K = null;
    if (Z !== void 0 && (K = "" + Z), H.key !== void 0 && (K = "" + H.key), "key" in H) {
      Z = {};
      for (var W in H)
        W !== "key" && (Z[W] = H[W]);
    } else Z = H;
    return H = Z.ref, {
      $$typeof: m,
      type: f,
      key: K,
      ref: H !== void 0 ? H : null,
      props: Z
    };
  }
  return vn.Fragment = N, vn.jsx = O, vn.jsxs = O, vn;
}
var $f;
function Uv() {
  return $f || ($f = 1, Zu.exports = Rv()), Zu.exports;
}
var a = Uv(), Vu = { exports: {} }, xn = {}, Ju = { exports: {} }, Ku = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wf;
function Mv() {
  return Wf || (Wf = 1, (function(m) {
    function N(b, U) {
      var Q = b.length;
      b.push(U);
      e: for (; 0 < Q; ) {
        var pe = Q - 1 >>> 1, v = b[pe];
        if (0 < H(v, U))
          b[pe] = U, b[Q] = v, Q = pe;
        else break e;
      }
    }
    function O(b) {
      return b.length === 0 ? null : b[0];
    }
    function f(b) {
      if (b.length === 0) return null;
      var U = b[0], Q = b.pop();
      if (Q !== U) {
        b[0] = Q;
        e: for (var pe = 0, v = b.length, T = v >>> 1; pe < T; ) {
          var Y = 2 * (pe + 1) - 1, L = b[Y], P = Y + 1, re = b[P];
          if (0 > H(L, Q))
            P < v && 0 > H(re, L) ? (b[pe] = re, b[P] = Q, pe = P) : (b[pe] = L, b[Y] = Q, pe = Y);
          else if (P < v && 0 > H(re, Q))
            b[pe] = re, b[P] = Q, pe = P;
          else break e;
        }
      }
      return U;
    }
    function H(b, U) {
      var Q = b.sortIndex - U.sortIndex;
      return Q !== 0 ? Q : b.id - U.id;
    }
    if (m.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var Z = performance;
      m.unstable_now = function() {
        return Z.now();
      };
    } else {
      var K = Date, W = K.now();
      m.unstable_now = function() {
        return K.now() - W;
      };
    }
    var D = [], p = [], G = 1, xe = null, E = 3, oe = !1, I = !1, ze = !1, ae = !1, Ne = typeof setTimeout == "function" ? setTimeout : null, de = typeof clearTimeout == "function" ? clearTimeout : null, X = typeof setImmediate < "u" ? setImmediate : null;
    function fe(b) {
      for (var U = O(p); U !== null; ) {
        if (U.callback === null) f(p);
        else if (U.startTime <= b)
          f(p), U.sortIndex = U.expirationTime, N(D, U);
        else break;
        U = O(p);
      }
    }
    function le(b) {
      if (ze = !1, fe(b), !I)
        if (O(D) !== null)
          I = !0, he || (he = !0, ue());
        else {
          var U = O(p);
          U !== null && Ce(le, U.startTime - b);
        }
    }
    var he = !1, Ee = -1, ye = 5, Me = -1;
    function ce() {
      return ae ? !0 : !(m.unstable_now() - Me < ye);
    }
    function De() {
      if (ae = !1, he) {
        var b = m.unstable_now();
        Me = b;
        var U = !0;
        try {
          e: {
            I = !1, ze && (ze = !1, de(Ee), Ee = -1), oe = !0;
            var Q = E;
            try {
              t: {
                for (fe(b), xe = O(D); xe !== null && !(xe.expirationTime > b && ce()); ) {
                  var pe = xe.callback;
                  if (typeof pe == "function") {
                    xe.callback = null, E = xe.priorityLevel;
                    var v = pe(
                      xe.expirationTime <= b
                    );
                    if (b = m.unstable_now(), typeof v == "function") {
                      xe.callback = v, fe(b), U = !0;
                      break t;
                    }
                    xe === O(D) && f(D), fe(b);
                  } else f(D);
                  xe = O(D);
                }
                if (xe !== null) U = !0;
                else {
                  var T = O(p);
                  T !== null && Ce(
                    le,
                    T.startTime - b
                  ), U = !1;
                }
              }
              break e;
            } finally {
              xe = null, E = Q, oe = !1;
            }
            U = void 0;
          }
        } finally {
          U ? ue() : he = !1;
        }
      }
    }
    var ue;
    if (typeof X == "function")
      ue = function() {
        X(De);
      };
    else if (typeof MessageChannel < "u") {
      var Je = new MessageChannel(), we = Je.port2;
      Je.port1.onmessage = De, ue = function() {
        we.postMessage(null);
      };
    } else
      ue = function() {
        Ne(De, 0);
      };
    function Ce(b, U) {
      Ee = Ne(function() {
        b(m.unstable_now());
      }, U);
    }
    m.unstable_IdlePriority = 5, m.unstable_ImmediatePriority = 1, m.unstable_LowPriority = 4, m.unstable_NormalPriority = 3, m.unstable_Profiling = null, m.unstable_UserBlockingPriority = 2, m.unstable_cancelCallback = function(b) {
      b.callback = null;
    }, m.unstable_forceFrameRate = function(b) {
      0 > b || 125 < b ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ye = 0 < b ? Math.floor(1e3 / b) : 5;
    }, m.unstable_getCurrentPriorityLevel = function() {
      return E;
    }, m.unstable_next = function(b) {
      switch (E) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = E;
      }
      var Q = E;
      E = U;
      try {
        return b();
      } finally {
        E = Q;
      }
    }, m.unstable_requestPaint = function() {
      ae = !0;
    }, m.unstable_runWithPriority = function(b, U) {
      switch (b) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          b = 3;
      }
      var Q = E;
      E = b;
      try {
        return U();
      } finally {
        E = Q;
      }
    }, m.unstable_scheduleCallback = function(b, U, Q) {
      var pe = m.unstable_now();
      switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? pe + Q : pe) : Q = pe, b) {
        case 1:
          var v = -1;
          break;
        case 2:
          v = 250;
          break;
        case 5:
          v = 1073741823;
          break;
        case 4:
          v = 1e4;
          break;
        default:
          v = 5e3;
      }
      return v = Q + v, b = {
        id: G++,
        callback: U,
        priorityLevel: b,
        startTime: Q,
        expirationTime: v,
        sortIndex: -1
      }, Q > pe ? (b.sortIndex = Q, N(p, b), O(D) === null && b === O(p) && (ze ? (de(Ee), Ee = -1) : ze = !0, Ce(le, Q - pe))) : (b.sortIndex = v, N(D, b), I || oe || (I = !0, he || (he = !0, ue()))), b;
    }, m.unstable_shouldYield = ce, m.unstable_wrapCallback = function(b) {
      var U = E;
      return function() {
        var Q = E;
        E = U;
        try {
          return b.apply(this, arguments);
        } finally {
          E = Q;
        }
      };
    };
  })(Ku)), Ku;
}
var Ff;
function Dv() {
  return Ff || (Ff = 1, Ju.exports = Mv()), Ju.exports;
}
var $u = { exports: {} }, Ge = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var If;
function qv() {
  if (If) return Ge;
  If = 1;
  var m = Symbol.for("react.transitional.element"), N = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), H = Symbol.for("react.profiler"), Z = Symbol.for("react.consumer"), K = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), xe = Symbol.iterator;
  function E(v) {
    return v === null || typeof v != "object" ? null : (v = xe && v[xe] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var oe = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, I = Object.assign, ze = {};
  function ae(v, T, Y) {
    this.props = v, this.context = T, this.refs = ze, this.updater = Y || oe;
  }
  ae.prototype.isReactComponent = {}, ae.prototype.setState = function(v, T) {
    if (typeof v != "object" && typeof v != "function" && v != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, v, T, "setState");
  }, ae.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function Ne() {
  }
  Ne.prototype = ae.prototype;
  function de(v, T, Y) {
    this.props = v, this.context = T, this.refs = ze, this.updater = Y || oe;
  }
  var X = de.prototype = new Ne();
  X.constructor = de, I(X, ae.prototype), X.isPureReactComponent = !0;
  var fe = Array.isArray, le = { H: null, A: null, T: null, S: null, V: null }, he = Object.prototype.hasOwnProperty;
  function Ee(v, T, Y, L, P, re) {
    return Y = re.ref, {
      $$typeof: m,
      type: v,
      key: T,
      ref: Y !== void 0 ? Y : null,
      props: re
    };
  }
  function ye(v, T) {
    return Ee(
      v.type,
      T,
      void 0,
      void 0,
      void 0,
      v.props
    );
  }
  function Me(v) {
    return typeof v == "object" && v !== null && v.$$typeof === m;
  }
  function ce(v) {
    var T = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(Y) {
      return T[Y];
    });
  }
  var De = /\/+/g;
  function ue(v, T) {
    return typeof v == "object" && v !== null && v.key != null ? ce("" + v.key) : T.toString(36);
  }
  function Je() {
  }
  function we(v) {
    switch (v.status) {
      case "fulfilled":
        return v.value;
      case "rejected":
        throw v.reason;
      default:
        switch (typeof v.status == "string" ? v.then(Je, Je) : (v.status = "pending", v.then(
          function(T) {
            v.status === "pending" && (v.status = "fulfilled", v.value = T);
          },
          function(T) {
            v.status === "pending" && (v.status = "rejected", v.reason = T);
          }
        )), v.status) {
          case "fulfilled":
            return v.value;
          case "rejected":
            throw v.reason;
        }
    }
    throw v;
  }
  function Ce(v, T, Y, L, P) {
    var re = typeof v;
    (re === "undefined" || re === "boolean") && (v = null);
    var F = !1;
    if (v === null) F = !0;
    else
      switch (re) {
        case "bigint":
        case "string":
        case "number":
          F = !0;
          break;
        case "object":
          switch (v.$$typeof) {
            case m:
            case N:
              F = !0;
              break;
            case G:
              return F = v._init, Ce(
                F(v._payload),
                T,
                Y,
                L,
                P
              );
          }
      }
    if (F)
      return P = P(v), F = L === "" ? "." + ue(v, 0) : L, fe(P) ? (Y = "", F != null && (Y = F.replace(De, "$&/") + "/"), Ce(P, T, Y, "", function(ne) {
        return ne;
      })) : P != null && (Me(P) && (P = ye(
        P,
        Y + (P.key == null || v && v.key === P.key ? "" : ("" + P.key).replace(
          De,
          "$&/"
        ) + "/") + F
      )), T.push(P)), 1;
    F = 0;
    var Qe = L === "" ? "." : L + ":";
    if (fe(v))
      for (var z = 0; z < v.length; z++)
        L = v[z], re = Qe + ue(L, z), F += Ce(
          L,
          T,
          Y,
          re,
          P
        );
    else if (z = E(v), typeof z == "function")
      for (v = z.call(v), z = 0; !(L = v.next()).done; )
        L = L.value, re = Qe + ue(L, z++), F += Ce(
          L,
          T,
          Y,
          re,
          P
        );
    else if (re === "object") {
      if (typeof v.then == "function")
        return Ce(
          we(v),
          T,
          Y,
          L,
          P
        );
      throw T = String(v), Error(
        "Objects are not valid as a React child (found: " + (T === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : T) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return F;
  }
  function b(v, T, Y) {
    if (v == null) return v;
    var L = [], P = 0;
    return Ce(v, L, "", "", function(re) {
      return T.call(Y, re, P++);
    }), L;
  }
  function U(v) {
    if (v._status === -1) {
      var T = v._result;
      T = T(), T.then(
        function(Y) {
          (v._status === 0 || v._status === -1) && (v._status = 1, v._result = Y);
        },
        function(Y) {
          (v._status === 0 || v._status === -1) && (v._status = 2, v._result = Y);
        }
      ), v._status === -1 && (v._status = 0, v._result = T);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var Q = typeof reportError == "function" ? reportError : function(v) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var T = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof v == "object" && v !== null && typeof v.message == "string" ? String(v.message) : String(v),
        error: v
      });
      if (!window.dispatchEvent(T)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", v);
      return;
    }
    console.error(v);
  };
  function pe() {
  }
  return Ge.Children = {
    map: b,
    forEach: function(v, T, Y) {
      b(
        v,
        function() {
          T.apply(this, arguments);
        },
        Y
      );
    },
    count: function(v) {
      var T = 0;
      return b(v, function() {
        T++;
      }), T;
    },
    toArray: function(v) {
      return b(v, function(T) {
        return T;
      }) || [];
    },
    only: function(v) {
      if (!Me(v))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return v;
    }
  }, Ge.Component = ae, Ge.Fragment = O, Ge.Profiler = H, Ge.PureComponent = de, Ge.StrictMode = f, Ge.Suspense = D, Ge.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = le, Ge.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(v) {
      return le.H.useMemoCache(v);
    }
  }, Ge.cache = function(v) {
    return function() {
      return v.apply(null, arguments);
    };
  }, Ge.cloneElement = function(v, T, Y) {
    if (v == null)
      throw Error(
        "The argument must be a React element, but you passed " + v + "."
      );
    var L = I({}, v.props), P = v.key, re = void 0;
    if (T != null)
      for (F in T.ref !== void 0 && (re = void 0), T.key !== void 0 && (P = "" + T.key), T)
        !he.call(T, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && T.ref === void 0 || (L[F] = T[F]);
    var F = arguments.length - 2;
    if (F === 1) L.children = Y;
    else if (1 < F) {
      for (var Qe = Array(F), z = 0; z < F; z++)
        Qe[z] = arguments[z + 2];
      L.children = Qe;
    }
    return Ee(v.type, P, void 0, void 0, re, L);
  }, Ge.createContext = function(v) {
    return v = {
      $$typeof: K,
      _currentValue: v,
      _currentValue2: v,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, v.Provider = v, v.Consumer = {
      $$typeof: Z,
      _context: v
    }, v;
  }, Ge.createElement = function(v, T, Y) {
    var L, P = {}, re = null;
    if (T != null)
      for (L in T.key !== void 0 && (re = "" + T.key), T)
        he.call(T, L) && L !== "key" && L !== "__self" && L !== "__source" && (P[L] = T[L]);
    var F = arguments.length - 2;
    if (F === 1) P.children = Y;
    else if (1 < F) {
      for (var Qe = Array(F), z = 0; z < F; z++)
        Qe[z] = arguments[z + 2];
      P.children = Qe;
    }
    if (v && v.defaultProps)
      for (L in F = v.defaultProps, F)
        P[L] === void 0 && (P[L] = F[L]);
    return Ee(v, re, void 0, void 0, null, P);
  }, Ge.createRef = function() {
    return { current: null };
  }, Ge.forwardRef = function(v) {
    return { $$typeof: W, render: v };
  }, Ge.isValidElement = Me, Ge.lazy = function(v) {
    return {
      $$typeof: G,
      _payload: { _status: -1, _result: v },
      _init: U
    };
  }, Ge.memo = function(v, T) {
    return {
      $$typeof: p,
      type: v,
      compare: T === void 0 ? null : T
    };
  }, Ge.startTransition = function(v) {
    var T = le.T, Y = {};
    le.T = Y;
    try {
      var L = v(), P = le.S;
      P !== null && P(Y, L), typeof L == "object" && L !== null && typeof L.then == "function" && L.then(pe, Q);
    } catch (re) {
      Q(re);
    } finally {
      le.T = T;
    }
  }, Ge.unstable_useCacheRefresh = function() {
    return le.H.useCacheRefresh();
  }, Ge.use = function(v) {
    return le.H.use(v);
  }, Ge.useActionState = function(v, T, Y) {
    return le.H.useActionState(v, T, Y);
  }, Ge.useCallback = function(v, T) {
    return le.H.useCallback(v, T);
  }, Ge.useContext = function(v) {
    return le.H.useContext(v);
  }, Ge.useDebugValue = function() {
  }, Ge.useDeferredValue = function(v, T) {
    return le.H.useDeferredValue(v, T);
  }, Ge.useEffect = function(v, T, Y) {
    var L = le.H;
    if (typeof Y == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return L.useEffect(v, T);
  }, Ge.useId = function() {
    return le.H.useId();
  }, Ge.useImperativeHandle = function(v, T, Y) {
    return le.H.useImperativeHandle(v, T, Y);
  }, Ge.useInsertionEffect = function(v, T) {
    return le.H.useInsertionEffect(v, T);
  }, Ge.useLayoutEffect = function(v, T) {
    return le.H.useLayoutEffect(v, T);
  }, Ge.useMemo = function(v, T) {
    return le.H.useMemo(v, T);
  }, Ge.useOptimistic = function(v, T) {
    return le.H.useOptimistic(v, T);
  }, Ge.useReducer = function(v, T, Y) {
    return le.H.useReducer(v, T, Y);
  }, Ge.useRef = function(v) {
    return le.H.useRef(v);
  }, Ge.useState = function(v) {
    return le.H.useState(v);
  }, Ge.useSyncExternalStore = function(v, T, Y) {
    return le.H.useSyncExternalStore(
      v,
      T,
      Y
    );
  }, Ge.useTransition = function() {
    return le.H.useTransition();
  }, Ge.version = "19.1.0", Ge;
}
var Pf;
function cr() {
  return Pf || (Pf = 1, $u.exports = qv()), $u.exports;
}
var Wu = { exports: {} }, Jt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eh;
function Hv() {
  if (eh) return Jt;
  eh = 1;
  var m = cr();
  function N(D) {
    var p = "https://react.dev/errors/" + D;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var G = 2; G < arguments.length; G++)
        p += "&args[]=" + encodeURIComponent(arguments[G]);
    }
    return "Minified React error #" + D + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function O() {
  }
  var f = {
    d: {
      f: O,
      r: function() {
        throw Error(N(522));
      },
      D: O,
      C: O,
      L: O,
      m: O,
      X: O,
      S: O,
      M: O
    },
    p: 0,
    findDOMNode: null
  }, H = Symbol.for("react.portal");
  function Z(D, p, G) {
    var xe = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: H,
      key: xe == null ? null : "" + xe,
      children: D,
      containerInfo: p,
      implementation: G
    };
  }
  var K = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function W(D, p) {
    if (D === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return Jt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f, Jt.createPortal = function(D, p) {
    var G = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(N(299));
    return Z(D, p, null, G);
  }, Jt.flushSync = function(D) {
    var p = K.T, G = f.p;
    try {
      if (K.T = null, f.p = 2, D) return D();
    } finally {
      K.T = p, f.p = G, f.d.f();
    }
  }, Jt.preconnect = function(D, p) {
    typeof D == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, f.d.C(D, p));
  }, Jt.prefetchDNS = function(D) {
    typeof D == "string" && f.d.D(D);
  }, Jt.preinit = function(D, p) {
    if (typeof D == "string" && p && typeof p.as == "string") {
      var G = p.as, xe = W(G, p.crossOrigin), E = typeof p.integrity == "string" ? p.integrity : void 0, oe = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      G === "style" ? f.d.S(
        D,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: xe,
          integrity: E,
          fetchPriority: oe
        }
      ) : G === "script" && f.d.X(D, {
        crossOrigin: xe,
        integrity: E,
        fetchPriority: oe,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, Jt.preinitModule = function(D, p) {
    if (typeof D == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var G = W(
            p.as,
            p.crossOrigin
          );
          f.d.M(D, {
            crossOrigin: G,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && f.d.M(D);
  }, Jt.preload = function(D, p) {
    if (typeof D == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var G = p.as, xe = W(G, p.crossOrigin);
      f.d.L(D, G, {
        crossOrigin: xe,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, Jt.preloadModule = function(D, p) {
    if (typeof D == "string")
      if (p) {
        var G = W(p.as, p.crossOrigin);
        f.d.m(D, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: G,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else f.d.m(D);
  }, Jt.requestFormReset = function(D) {
    f.d.r(D);
  }, Jt.unstable_batchedUpdates = function(D, p) {
    return D(p);
  }, Jt.useFormState = function(D, p, G) {
    return K.H.useFormState(D, p, G);
  }, Jt.useFormStatus = function() {
    return K.H.useHostTransitionStatus();
  }, Jt.version = "19.1.0", Jt;
}
var th;
function Bv() {
  if (th) return Wu.exports;
  th = 1;
  function m() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(m);
      } catch (N) {
        console.error(N);
      }
  }
  return m(), Wu.exports = Hv(), Wu.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lh;
function Yv() {
  if (lh) return xn;
  lh = 1;
  var m = Dv(), N = cr(), O = Bv();
  function f(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function H(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Z(e) {
    var t = e, l = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? l : null;
  }
  function K(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function W(e) {
    if (Z(e) !== e)
      throw Error(f(188));
  }
  function D(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Z(e), t === null) throw Error(f(188));
      return t !== e ? null : e;
    }
    for (var l = e, s = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (s = n.return, s !== null) {
          l = s;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === l) return W(n), e;
          if (i === s) return W(n), t;
          i = i.sibling;
        }
        throw Error(f(188));
      }
      if (l.return !== s.return) l = n, s = i;
      else {
        for (var u = !1, r = n.child; r; ) {
          if (r === l) {
            u = !0, l = n, s = i;
            break;
          }
          if (r === s) {
            u = !0, s = n, l = i;
            break;
          }
          r = r.sibling;
        }
        if (!u) {
          for (r = i.child; r; ) {
            if (r === l) {
              u = !0, l = i, s = n;
              break;
            }
            if (r === s) {
              u = !0, s = i, l = n;
              break;
            }
            r = r.sibling;
          }
          if (!u) throw Error(f(189));
        }
      }
      if (l.alternate !== s) throw Error(f(190));
    }
    if (l.tag !== 3) throw Error(f(188));
    return l.stateNode.current === l ? e : t;
  }
  function p(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = p(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var G = Object.assign, xe = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), oe = Symbol.for("react.portal"), I = Symbol.for("react.fragment"), ze = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), Ne = Symbol.for("react.provider"), de = Symbol.for("react.consumer"), X = Symbol.for("react.context"), fe = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), he = Symbol.for("react.suspense_list"), Ee = Symbol.for("react.memo"), ye = Symbol.for("react.lazy"), Me = Symbol.for("react.activity"), ce = Symbol.for("react.memo_cache_sentinel"), De = Symbol.iterator;
  function ue(e) {
    return e === null || typeof e != "object" ? null : (e = De && e[De] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Je = Symbol.for("react.client.reference");
  function we(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Je ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case I:
        return "Fragment";
      case ae:
        return "Profiler";
      case ze:
        return "StrictMode";
      case le:
        return "Suspense";
      case he:
        return "SuspenseList";
      case Me:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case oe:
          return "Portal";
        case X:
          return (e.displayName || "Context") + ".Provider";
        case de:
          return (e._context.displayName || "Context") + ".Consumer";
        case fe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Ee:
          return t = e.displayName || null, t !== null ? t : we(e.type) || "Memo";
        case ye:
          t = e._payload, e = e._init;
          try {
            return we(e(t));
          } catch {
          }
      }
    return null;
  }
  var Ce = Array.isArray, b = N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = O.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, pe = [], v = -1;
  function T(e) {
    return { current: e };
  }
  function Y(e) {
    0 > v || (e.current = pe[v], pe[v] = null, v--);
  }
  function L(e, t) {
    v++, pe[v] = e.current, e.current = t;
  }
  var P = T(null), re = T(null), F = T(null), Qe = T(null);
  function z(e, t) {
    switch (L(F, t), L(re, e), L(P, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? _f(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = _f(t), e = Nf(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    Y(P), L(P, e);
  }
  function ne() {
    Y(P), Y(re), Y(F);
  }
  function ke(e) {
    e.memoizedState !== null && L(Qe, e);
    var t = P.current, l = Nf(t, e.type);
    t !== l && (L(re, e), L(P, l));
  }
  function se(e) {
    re.current === e && (Y(P), Y(re)), Qe.current === e && (Y(Qe), dn._currentValue = Q);
  }
  var me = Object.prototype.hasOwnProperty, qe = m.unstable_scheduleCallback, Fe = m.unstable_cancelCallback, mt = m.unstable_shouldYield, rt = m.unstable_requestPaint, He = m.unstable_now, tt = m.unstable_getCurrentPriorityLevel, Ze = m.unstable_ImmediatePriority, Ie = m.unstable_UserBlockingPriority, te = m.unstable_NormalPriority, dt = m.unstable_LowPriority, be = m.unstable_IdlePriority, Pe = m.log, at = m.unstable_setDisableYieldValue, ct = null, Le = null;
  function Ye(e) {
    if (typeof Pe == "function" && at(e), Le && typeof Le.setStrictMode == "function")
      try {
        Le.setStrictMode(ct, e);
      } catch {
      }
  }
  var _ = Math.clz32 ? Math.clz32 : et, $ = Math.log, je = Math.LN2;
  function et(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - ($(e) / je | 0) | 0;
  }
  var Re = 256, Se = 4194304;
  function j(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function ie(e, t, l) {
    var s = e.pendingLanes;
    if (s === 0) return 0;
    var n = 0, i = e.suspendedLanes, u = e.pingedLanes;
    e = e.warmLanes;
    var r = s & 134217727;
    return r !== 0 ? (s = r & ~i, s !== 0 ? n = j(s) : (u &= r, u !== 0 ? n = j(u) : l || (l = r & ~e, l !== 0 && (n = j(l))))) : (r = s & ~i, r !== 0 ? n = j(r) : u !== 0 ? n = j(u) : l || (l = s & ~e, l !== 0 && (n = j(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function ee(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function lt(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ke() {
    var e = Re;
    return Re <<= 1, (Re & 4194048) === 0 && (Re = 256), e;
  }
  function d() {
    var e = Se;
    return Se <<= 1, (Se & 62914560) === 0 && (Se = 4194304), e;
  }
  function o(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function A(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function J(e, t, l, s, n, i) {
    var u = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var r = e.entanglements, x = e.expirationTimes, w = e.hiddenUpdates;
    for (l = u & ~l; 0 < l; ) {
      var R = 31 - _(l), B = 1 << R;
      r[R] = 0, x[R] = -1;
      var k = w[R];
      if (k !== null)
        for (w[R] = null, R = 0; R < k.length; R++) {
          var C = k[R];
          C !== null && (C.lane &= -536870913);
        }
      l &= ~B;
    }
    s !== 0 && Be(e, s, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(u & ~t));
  }
  function Be(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var s = 31 - _(t);
    e.entangledLanes |= t, e.entanglements[s] = e.entanglements[s] | 1073741824 | l & 4194090;
  }
  function Ue(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var s = 31 - _(l), n = 1 << s;
      n & t | e[s] & t && (e[s] |= t), l &= ~n;
    }
  }
  function nt(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function zt(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Wt() {
    var e = U.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Lf(e.type));
  }
  function rl(e, t) {
    var l = U.p;
    try {
      return U.p = e, t();
    } finally {
      U.p = l;
    }
  }
  var tl = Math.random().toString(36).slice(2), kt = "__reactFiber$" + tl, At = "__reactProps$" + tl, c = "__reactContainer$" + tl, q = "__reactEvents$" + tl, V = "__reactListeners$" + tl, ge = "__reactHandles$" + tl, ot = "__reactResources$" + tl, gt = "__reactMarker$" + tl;
  function Gt(e) {
    delete e[kt], delete e[At], delete e[q], delete e[V], delete e[ge];
  }
  function dl(e) {
    var t = e[kt];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[c] || l[kt]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Ef(e); e !== null; ) {
            if (l = e[kt]) return l;
            e = Ef(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function zl(e) {
    if (e = e[kt] || e[c]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function $l(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(f(33));
  }
  function Kt(e) {
    var t = e[ot];
    return t || (t = e[ot] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Rt(e) {
    e[gt] = !0;
  }
  var rr = /* @__PURE__ */ new Set(), dr = {};
  function ba(e, t) {
    Ha(e, t), Ha(e + "Capture", t);
  }
  function Ha(e, t) {
    for (dr[e] = t, e = 0; e < t.length; e++)
      rr.add(t[e]);
  }
  var wh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), or = {}, fr = {};
  function kh(e) {
    return me.call(fr, e) ? !0 : me.call(or, e) ? !1 : wh.test(e) ? fr[e] = !0 : (or[e] = !0, !1);
  }
  function _n(e, t, l) {
    if (kh(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var s = t.toLowerCase().slice(0, 5);
            if (s !== "data-" && s !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + l);
      }
  }
  function Nn(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + l);
    }
  }
  function Al(e, t, l, s) {
    if (s === null) e.removeAttribute(l);
    else {
      switch (typeof s) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, "" + s);
    }
  }
  var Bi, hr;
  function Ba(e) {
    if (Bi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Bi = t && t[1] || "", hr = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Bi + e + hr;
  }
  var Yi = !1;
  function Gi(e, t) {
    if (!e || Yi) return "";
    Yi = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var s = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var B = function() {
                throw Error();
              };
              if (Object.defineProperty(B.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(B, []);
                } catch (C) {
                  var k = C;
                }
                Reflect.construct(e, [], B);
              } else {
                try {
                  B.call();
                } catch (C) {
                  k = C;
                }
                e.call(B.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (C) {
                k = C;
              }
              (B = e()) && typeof B.catch == "function" && B.catch(function() {
              });
            }
          } catch (C) {
            if (C && k && typeof C.stack == "string")
              return [C.stack, k.stack];
          }
          return [null, null];
        }
      };
      s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        s.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        s.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = s.DetermineComponentFrameRoot(), u = i[0], r = i[1];
      if (u && r) {
        var x = u.split(`
`), w = r.split(`
`);
        for (n = s = 0; s < x.length && !x[s].includes("DetermineComponentFrameRoot"); )
          s++;
        for (; n < w.length && !w[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (s === x.length || n === w.length)
          for (s = x.length - 1, n = w.length - 1; 1 <= s && 0 <= n && x[s] !== w[n]; )
            n--;
        for (; 1 <= s && 0 <= n; s--, n--)
          if (x[s] !== w[n]) {
            if (s !== 1 || n !== 1)
              do
                if (s--, n--, 0 > n || x[s] !== w[n]) {
                  var R = `
` + x[s].replace(" at new ", " at ");
                  return e.displayName && R.includes("<anonymous>") && (R = R.replace("<anonymous>", e.displayName)), R;
                }
              while (1 <= s && 0 <= n);
            break;
          }
      }
    } finally {
      Yi = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Ba(l) : "";
  }
  function Eh(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Ba(e.type);
      case 16:
        return Ba("Lazy");
      case 13:
        return Ba("Suspense");
      case 19:
        return Ba("SuspenseList");
      case 0:
      case 15:
        return Gi(e.type, !1);
      case 11:
        return Gi(e.type.render, !1);
      case 1:
        return Gi(e.type, !0);
      case 31:
        return Ba("Activity");
      default:
        return "";
    }
  }
  function mr(e) {
    try {
      var t = "";
      do
        t += Eh(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function ol(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function vr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ch(e) {
    var t = vr(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    ), s = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var n = l.get, i = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(u) {
          s = "" + u, i.call(this, u);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return s;
        },
        setValue: function(u) {
          s = "" + u;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Sn(e) {
    e._valueTracker || (e._valueTracker = Ch(e));
  }
  function xr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), s = "";
    return e && (s = vr(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== l ? (t.setValue(e), !0) : !1;
  }
  function wn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Th = /[\n"\\]/g;
  function fl(e) {
    return e.replace(
      Th,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Li(e, t, l, s, n, i, u, r) {
    e.name = "", u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? e.type = u : e.removeAttribute("type"), t != null ? u === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ol(t)) : e.value !== "" + ol(t) && (e.value = "" + ol(t)) : u !== "submit" && u !== "reset" || e.removeAttribute("value"), t != null ? Xi(e, u, ol(t)) : l != null ? Xi(e, u, ol(l)) : s != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? e.name = "" + ol(r) : e.removeAttribute("name");
  }
  function jr(e, t, l, s, n, i, u, r) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + ol(l) : "", t = t != null ? "" + ol(t) : l, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    s = s ?? n, s = typeof s != "function" && typeof s != "symbol" && !!s, e.checked = r ? e.checked : !!s, e.defaultChecked = !!s, u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.name = u);
  }
  function Xi(e, t, l) {
    t === "number" && wn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Ya(e, t, l, s) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && s && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + ol(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, s && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function gr(e, t, l) {
    if (t != null && (t = "" + ol(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + ol(l) : "";
  }
  function pr(e, t, l, s) {
    if (t == null) {
      if (s != null) {
        if (l != null) throw Error(f(92));
        if (Ce(s)) {
          if (1 < s.length) throw Error(f(93));
          s = s[0];
        }
        l = s;
      }
      l == null && (l = ""), t = l;
    }
    l = ol(t), e.defaultValue = l, s = e.textContent, s === l && s !== "" && s !== null && (e.value = s);
  }
  function Ga(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Oh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function yr(e, t, l) {
    var s = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? s ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : s ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Oh.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function br(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(f(62));
    if (e = e.style, l != null) {
      for (var s in l)
        !l.hasOwnProperty(s) || t != null && t.hasOwnProperty(s) || (s.indexOf("--") === 0 ? e.setProperty(s, "") : s === "float" ? e.cssFloat = "" : e[s] = "");
      for (var n in t)
        s = t[n], t.hasOwnProperty(n) && l[n] !== s && yr(e, n, s);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && yr(e, i, t[i]);
  }
  function Qi(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var zh = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Ah = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function kn(e) {
    return Ah.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var Zi = null;
  function Vi(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var La = null, Xa = null;
  function _r(e) {
    var t = zl(e);
    if (t && (e = t.stateNode)) {
      var l = e[At] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Li(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + fl(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var s = l[t];
              if (s !== e && s.form === e.form) {
                var n = s[At] || null;
                if (!n) throw Error(f(90));
                Li(
                  s,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              s = l[t], s.form === e.form && xr(s);
          }
          break e;
        case "textarea":
          gr(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Ya(e, !!l.multiple, t, !1);
      }
    }
  }
  var Ji = !1;
  function Nr(e, t, l) {
    if (Ji) return e(t, l);
    Ji = !0;
    try {
      var s = e(t);
      return s;
    } finally {
      if (Ji = !1, (La !== null || Xa !== null) && (oi(), La && (t = La, e = Xa, Xa = La = null, _r(t), e)))
        for (t = 0; t < e.length; t++) _r(e[t]);
    }
  }
  function _s(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var s = l[At] || null;
    if (s === null) return null;
    l = s[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        f(231, t, typeof l)
      );
    return l;
  }
  var Rl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ki = !1;
  if (Rl)
    try {
      var Ns = {};
      Object.defineProperty(Ns, "passive", {
        get: function() {
          Ki = !0;
        }
      }), window.addEventListener("test", Ns, Ns), window.removeEventListener("test", Ns, Ns);
    } catch {
      Ki = !1;
    }
  var Wl = null, $i = null, En = null;
  function Sr() {
    if (En) return En;
    var e, t = $i, l = t.length, s, n = "value" in Wl ? Wl.value : Wl.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var u = l - e;
    for (s = 1; s <= u && t[l - s] === n[i - s]; s++) ;
    return En = n.slice(e, 1 < s ? 1 - s : void 0);
  }
  function Cn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Tn() {
    return !0;
  }
  function wr() {
    return !1;
  }
  function Ft(e) {
    function t(l, s, n, i, u) {
      this._reactName = l, this._targetInst = n, this.type = s, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var r in e)
        e.hasOwnProperty(r) && (l = e[r], this[r] = l ? l(i) : i[r]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Tn : wr, this.isPropagationStopped = wr, this;
    }
    return G(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Tn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Tn);
      },
      persist: function() {
      },
      isPersistent: Tn
    }), t;
  }
  var _a = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, On = Ft(_a), Ss = G({}, _a, { view: 0, detail: 0 }), Rh = Ft(Ss), Wi, Fi, ws, zn = G({}, Ss, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Pi,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== ws && (ws && e.type === "mousemove" ? (Wi = e.screenX - ws.screenX, Fi = e.screenY - ws.screenY) : Fi = Wi = 0, ws = e), Wi);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Fi;
    }
  }), kr = Ft(zn), Uh = G({}, zn, { dataTransfer: 0 }), Mh = Ft(Uh), Dh = G({}, Ss, { relatedTarget: 0 }), Ii = Ft(Dh), qh = G({}, _a, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Hh = Ft(qh), Bh = G({}, _a, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Yh = Ft(Bh), Gh = G({}, _a, { data: 0 }), Er = Ft(Gh), Lh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Xh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Qh = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Zh(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Qh[e]) ? !!t[e] : !1;
  }
  function Pi() {
    return Zh;
  }
  var Vh = G({}, Ss, {
    key: function(e) {
      if (e.key) {
        var t = Lh[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Cn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Xh[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Pi,
    charCode: function(e) {
      return e.type === "keypress" ? Cn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Cn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Jh = Ft(Vh), Kh = G({}, zn, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Cr = Ft(Kh), $h = G({}, Ss, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Pi
  }), Wh = Ft($h), Fh = G({}, _a, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ih = Ft(Fh), Ph = G({}, zn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), em = Ft(Ph), tm = G({}, _a, {
    newState: 0,
    oldState: 0
  }), lm = Ft(tm), am = [9, 13, 27, 32], ec = Rl && "CompositionEvent" in window, ks = null;
  Rl && "documentMode" in document && (ks = document.documentMode);
  var sm = Rl && "TextEvent" in window && !ks, Tr = Rl && (!ec || ks && 8 < ks && 11 >= ks), Or = " ", zr = !1;
  function Ar(e, t) {
    switch (e) {
      case "keyup":
        return am.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Rr(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Qa = !1;
  function nm(e, t) {
    switch (e) {
      case "compositionend":
        return Rr(t);
      case "keypress":
        return t.which !== 32 ? null : (zr = !0, Or);
      case "textInput":
        return e = t.data, e === Or && zr ? null : e;
      default:
        return null;
    }
  }
  function im(e, t) {
    if (Qa)
      return e === "compositionend" || !ec && Ar(e, t) ? (e = Sr(), En = $i = Wl = null, Qa = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Tr && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var cm = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Ur(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!cm[e.type] : t === "textarea";
  }
  function Mr(e, t, l, s) {
    La ? Xa ? Xa.push(s) : Xa = [s] : La = s, t = ji(t, "onChange"), 0 < t.length && (l = new On(
      "onChange",
      "change",
      null,
      l,
      s
    ), e.push({ event: l, listeners: t }));
  }
  var Es = null, Cs = null;
  function um(e) {
    jf(e, 0);
  }
  function An(e) {
    var t = $l(e);
    if (xr(t)) return e;
  }
  function Dr(e, t) {
    if (e === "change") return t;
  }
  var qr = !1;
  if (Rl) {
    var tc;
    if (Rl) {
      var lc = "oninput" in document;
      if (!lc) {
        var Hr = document.createElement("div");
        Hr.setAttribute("oninput", "return;"), lc = typeof Hr.oninput == "function";
      }
      tc = lc;
    } else tc = !1;
    qr = tc && (!document.documentMode || 9 < document.documentMode);
  }
  function Br() {
    Es && (Es.detachEvent("onpropertychange", Yr), Cs = Es = null);
  }
  function Yr(e) {
    if (e.propertyName === "value" && An(Cs)) {
      var t = [];
      Mr(
        t,
        Cs,
        e,
        Vi(e)
      ), Nr(um, t);
    }
  }
  function rm(e, t, l) {
    e === "focusin" ? (Br(), Es = t, Cs = l, Es.attachEvent("onpropertychange", Yr)) : e === "focusout" && Br();
  }
  function dm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return An(Cs);
  }
  function om(e, t) {
    if (e === "click") return An(t);
  }
  function fm(e, t) {
    if (e === "input" || e === "change")
      return An(t);
  }
  function hm(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ll = typeof Object.is == "function" ? Object.is : hm;
  function Ts(e, t) {
    if (ll(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), s = Object.keys(t);
    if (l.length !== s.length) return !1;
    for (s = 0; s < l.length; s++) {
      var n = l[s];
      if (!me.call(t, n) || !ll(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Gr(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Lr(e, t) {
    var l = Gr(e);
    e = 0;
    for (var s; l; ) {
      if (l.nodeType === 3) {
        if (s = e + l.textContent.length, e <= t && s >= t)
          return { node: l, offset: t - e };
        e = s;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Gr(l);
    }
  }
  function Xr(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Xr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Qr(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = wn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = wn(e.document);
    }
    return t;
  }
  function ac(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var mm = Rl && "documentMode" in document && 11 >= document.documentMode, Za = null, sc = null, Os = null, nc = !1;
  function Zr(e, t, l) {
    var s = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    nc || Za == null || Za !== wn(s) || (s = Za, "selectionStart" in s && ac(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
      anchorNode: s.anchorNode,
      anchorOffset: s.anchorOffset,
      focusNode: s.focusNode,
      focusOffset: s.focusOffset
    }), Os && Ts(Os, s) || (Os = s, s = ji(sc, "onSelect"), 0 < s.length && (t = new On(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: s }), t.target = Za)));
  }
  function Na(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Va = {
    animationend: Na("Animation", "AnimationEnd"),
    animationiteration: Na("Animation", "AnimationIteration"),
    animationstart: Na("Animation", "AnimationStart"),
    transitionrun: Na("Transition", "TransitionRun"),
    transitionstart: Na("Transition", "TransitionStart"),
    transitioncancel: Na("Transition", "TransitionCancel"),
    transitionend: Na("Transition", "TransitionEnd")
  }, ic = {}, Vr = {};
  Rl && (Vr = document.createElement("div").style, "AnimationEvent" in window || (delete Va.animationend.animation, delete Va.animationiteration.animation, delete Va.animationstart.animation), "TransitionEvent" in window || delete Va.transitionend.transition);
  function Sa(e) {
    if (ic[e]) return ic[e];
    if (!Va[e]) return e;
    var t = Va[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Vr)
        return ic[e] = t[l];
    return e;
  }
  var Jr = Sa("animationend"), Kr = Sa("animationiteration"), $r = Sa("animationstart"), vm = Sa("transitionrun"), xm = Sa("transitionstart"), jm = Sa("transitioncancel"), Wr = Sa("transitionend"), Fr = /* @__PURE__ */ new Map(), cc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  cc.push("scrollEnd");
  function yl(e, t) {
    Fr.set(e, t), ba(t, [e]);
  }
  var Ir = /* @__PURE__ */ new WeakMap();
  function hl(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Ir.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: mr(t)
      }, Ir.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: mr(t)
    };
  }
  var ml = [], Ja = 0, uc = 0;
  function Rn() {
    for (var e = Ja, t = uc = Ja = 0; t < e; ) {
      var l = ml[t];
      ml[t++] = null;
      var s = ml[t];
      ml[t++] = null;
      var n = ml[t];
      ml[t++] = null;
      var i = ml[t];
      if (ml[t++] = null, s !== null && n !== null) {
        var u = s.pending;
        u === null ? n.next = n : (n.next = u.next, u.next = n), s.pending = n;
      }
      i !== 0 && Pr(l, n, i);
    }
  }
  function Un(e, t, l, s) {
    ml[Ja++] = e, ml[Ja++] = t, ml[Ja++] = l, ml[Ja++] = s, uc |= s, e.lanes |= s, e = e.alternate, e !== null && (e.lanes |= s);
  }
  function rc(e, t, l, s) {
    return Un(e, t, l, s), Mn(e);
  }
  function Ka(e, t) {
    return Un(e, null, null, t), Mn(e);
  }
  function Pr(e, t, l) {
    e.lanes |= l;
    var s = e.alternate;
    s !== null && (s.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, s = i.alternate, s !== null && (s.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - _(l), e = i.hiddenUpdates, s = e[n], s === null ? e[n] = [t] : s.push(t), t.lane = l | 536870912), i) : null;
  }
  function Mn(e) {
    if (50 < tn)
      throw tn = 0, vu = null, Error(f(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var $a = {};
  function gm(e, t, l, s) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function al(e, t, l, s) {
    return new gm(e, t, l, s);
  }
  function dc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ul(e, t) {
    var l = e.alternate;
    return l === null ? (l = al(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function ed(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Dn(e, t, l, s, n, i) {
    var u = 0;
    if (s = e, typeof e == "function") dc(e) && (u = 1);
    else if (typeof e == "string")
      u = yv(
        e,
        l,
        P.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Me:
          return e = al(31, l, t, n), e.elementType = Me, e.lanes = i, e;
        case I:
          return wa(l.children, n, i, t);
        case ze:
          u = 8, n |= 24;
          break;
        case ae:
          return e = al(12, l, t, n | 2), e.elementType = ae, e.lanes = i, e;
        case le:
          return e = al(13, l, t, n), e.elementType = le, e.lanes = i, e;
        case he:
          return e = al(19, l, t, n), e.elementType = he, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ne:
              case X:
                u = 10;
                break e;
              case de:
                u = 9;
                break e;
              case fe:
                u = 11;
                break e;
              case Ee:
                u = 14;
                break e;
              case ye:
                u = 16, s = null;
                break e;
            }
          u = 29, l = Error(
            f(130, e === null ? "null" : typeof e, "")
          ), s = null;
      }
    return t = al(u, l, t, n), t.elementType = e, t.type = s, t.lanes = i, t;
  }
  function wa(e, t, l, s) {
    return e = al(7, e, s, t), e.lanes = l, e;
  }
  function oc(e, t, l) {
    return e = al(6, e, null, t), e.lanes = l, e;
  }
  function fc(e, t, l) {
    return t = al(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Wa = [], Fa = 0, qn = null, Hn = 0, vl = [], xl = 0, ka = null, Ml = 1, Dl = "";
  function Ea(e, t) {
    Wa[Fa++] = Hn, Wa[Fa++] = qn, qn = e, Hn = t;
  }
  function td(e, t, l) {
    vl[xl++] = Ml, vl[xl++] = Dl, vl[xl++] = ka, ka = e;
    var s = Ml;
    e = Dl;
    var n = 32 - _(s) - 1;
    s &= ~(1 << n), l += 1;
    var i = 32 - _(t) + n;
    if (30 < i) {
      var u = n - n % 5;
      i = (s & (1 << u) - 1).toString(32), s >>= u, n -= u, Ml = 1 << 32 - _(t) + n | l << n | s, Dl = i + e;
    } else
      Ml = 1 << i | l << n | s, Dl = e;
  }
  function hc(e) {
    e.return !== null && (Ea(e, 1), td(e, 1, 0));
  }
  function mc(e) {
    for (; e === qn; )
      qn = Wa[--Fa], Wa[Fa] = null, Hn = Wa[--Fa], Wa[Fa] = null;
    for (; e === ka; )
      ka = vl[--xl], vl[xl] = null, Dl = vl[--xl], vl[xl] = null, Ml = vl[--xl], vl[xl] = null;
  }
  var $t = null, Et = null, ut = !1, Ca = null, wl = !1, vc = Error(f(519));
  function Ta(e) {
    var t = Error(f(418, ""));
    throw Rs(hl(t, e)), vc;
  }
  function ld(e) {
    var t = e.stateNode, l = e.type, s = e.memoizedProps;
    switch (t[kt] = e, t[At] = s, l) {
      case "dialog":
        We("cancel", t), We("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        We("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < an.length; l++)
          We(an[l], t);
        break;
      case "source":
        We("error", t);
        break;
      case "img":
      case "image":
      case "link":
        We("error", t), We("load", t);
        break;
      case "details":
        We("toggle", t);
        break;
      case "input":
        We("invalid", t), jr(
          t,
          s.value,
          s.defaultValue,
          s.checked,
          s.defaultChecked,
          s.type,
          s.name,
          !0
        ), Sn(t);
        break;
      case "select":
        We("invalid", t);
        break;
      case "textarea":
        We("invalid", t), pr(t, s.value, s.defaultValue, s.children), Sn(t);
    }
    l = s.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || s.suppressHydrationWarning === !0 || bf(t.textContent, l) ? (s.popover != null && (We("beforetoggle", t), We("toggle", t)), s.onScroll != null && We("scroll", t), s.onScrollEnd != null && We("scrollend", t), s.onClick != null && (t.onclick = gi), t = !0) : t = !1, t || Ta(e);
  }
  function ad(e) {
    for ($t = e.return; $t; )
      switch ($t.tag) {
        case 5:
        case 13:
          wl = !1;
          return;
        case 27:
        case 3:
          wl = !0;
          return;
        default:
          $t = $t.return;
      }
  }
  function zs(e) {
    if (e !== $t) return !1;
    if (!ut) return ad(e), ut = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || zu(e.type, e.memoizedProps)), l = !l), l && Et && Ta(e), ad(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(f(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Et = _l(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        Et = null;
      }
    } else
      t === 27 ? (t = Et, fa(e.type) ? (e = Mu, Mu = null, Et = e) : Et = t) : Et = $t ? _l(e.stateNode.nextSibling) : null;
    return !0;
  }
  function As() {
    Et = $t = null, ut = !1;
  }
  function sd() {
    var e = Ca;
    return e !== null && (el === null ? el = e : el.push.apply(
      el,
      e
    ), Ca = null), e;
  }
  function Rs(e) {
    Ca === null ? Ca = [e] : Ca.push(e);
  }
  var xc = T(null), Oa = null, ql = null;
  function Fl(e, t, l) {
    L(xc, t._currentValue), t._currentValue = l;
  }
  function Hl(e) {
    e._currentValue = xc.current, Y(xc);
  }
  function jc(e, t, l) {
    for (; e !== null; ) {
      var s = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function gc(e, t, l, s) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var u = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var r = i;
          i = n;
          for (var x = 0; x < t.length; x++)
            if (r.context === t[x]) {
              i.lanes |= l, r = i.alternate, r !== null && (r.lanes |= l), jc(
                i.return,
                l,
                e
              ), s || (u = null);
              break e;
            }
          i = r.next;
        }
      } else if (n.tag === 18) {
        if (u = n.return, u === null) throw Error(f(341));
        u.lanes |= l, i = u.alternate, i !== null && (i.lanes |= l), jc(u, l, e), u = null;
      } else u = n.child;
      if (u !== null) u.return = n;
      else
        for (u = n; u !== null; ) {
          if (u === e) {
            u = null;
            break;
          }
          if (n = u.sibling, n !== null) {
            n.return = u.return, u = n;
            break;
          }
          u = u.return;
        }
      n = u;
    }
  }
  function Us(e, t, l, s) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var u = n.alternate;
        if (u === null) throw Error(f(387));
        if (u = u.memoizedProps, u !== null) {
          var r = n.type;
          ll(n.pendingProps.value, u.value) || (e !== null ? e.push(r) : e = [r]);
        }
      } else if (n === Qe.current) {
        if (u = n.alternate, u === null) throw Error(f(387));
        u.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(dn) : e = [dn]);
      }
      n = n.return;
    }
    e !== null && gc(
      t,
      e,
      l,
      s
    ), t.flags |= 262144;
  }
  function Bn(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!ll(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function za(e) {
    Oa = e, ql = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Vt(e) {
    return nd(Oa, e);
  }
  function Yn(e, t) {
    return Oa === null && za(e), nd(e, t);
  }
  function nd(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, ql === null) {
      if (e === null) throw Error(f(308));
      ql = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else ql = ql.next = t;
    return l;
  }
  var pm = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, s) {
        e.push(s);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, ym = m.unstable_scheduleCallback, bm = m.unstable_NormalPriority, Dt = {
    $$typeof: X,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function pc() {
    return {
      controller: new pm(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ms(e) {
    e.refCount--, e.refCount === 0 && ym(bm, function() {
      e.controller.abort();
    });
  }
  var Ds = null, yc = 0, Ia = 0, Pa = null;
  function _m(e, t) {
    if (Ds === null) {
      var l = Ds = [];
      yc = 0, Ia = _u(), Pa = {
        status: "pending",
        value: void 0,
        then: function(s) {
          l.push(s);
        }
      };
    }
    return yc++, t.then(id, id), t;
  }
  function id() {
    if (--yc === 0 && Ds !== null) {
      Pa !== null && (Pa.status = "fulfilled");
      var e = Ds;
      Ds = null, Ia = 0, Pa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Nm(e, t) {
    var l = [], s = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        s.status = "fulfilled", s.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (s.status = "rejected", s.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), s;
  }
  var cd = b.S;
  b.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && _m(e, t), cd !== null && cd(e, t);
  };
  var Aa = T(null);
  function bc() {
    var e = Aa.current;
    return e !== null ? e : yt.pooledCache;
  }
  function Gn(e, t) {
    t === null ? L(Aa, Aa.current) : L(Aa, t.pool);
  }
  function ud() {
    var e = bc();
    return e === null ? null : { parent: Dt._currentValue, pool: e };
  }
  var qs = Error(f(460)), rd = Error(f(474)), Ln = Error(f(542)), _c = { then: function() {
  } };
  function dd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Xn() {
  }
  function od(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Xn, Xn), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, hd(e), e;
      default:
        if (typeof t.status == "string") t.then(Xn, Xn);
        else {
          if (e = yt, e !== null && 100 < e.shellSuspendCounter)
            throw Error(f(482));
          e = t, e.status = "pending", e.then(
            function(s) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = s;
              }
            },
            function(s) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = s;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, hd(e), e;
        }
        throw Hs = t, qs;
    }
  }
  var Hs = null;
  function fd() {
    if (Hs === null) throw Error(f(459));
    var e = Hs;
    return Hs = null, e;
  }
  function hd(e) {
    if (e === qs || e === Ln)
      throw Error(f(483));
  }
  var Il = !1;
  function Nc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Sc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Pl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ea(e, t, l) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (s = s.shared, (ft & 2) !== 0) {
      var n = s.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), s.pending = t, t = Mn(e), Pr(e, null, l), t;
    }
    return Un(e, s, t, l), Mn(e);
  }
  function Bs(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var s = t.lanes;
      s &= e.pendingLanes, l |= s, t.lanes = l, Ue(e, l);
    }
  }
  function wc(e, t) {
    var l = e.updateQueue, s = e.alternate;
    if (s !== null && (s = s.updateQueue, l === s)) {
      var n = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var u = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = u : i = i.next = u, l = l.next;
        } while (l !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      l = {
        baseState: s.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: s.shared,
        callbacks: s.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var kc = !1;
  function Ys() {
    if (kc) {
      var e = Pa;
      if (e !== null) throw e;
    }
  }
  function Gs(e, t, l, s) {
    kc = !1;
    var n = e.updateQueue;
    Il = !1;
    var i = n.firstBaseUpdate, u = n.lastBaseUpdate, r = n.shared.pending;
    if (r !== null) {
      n.shared.pending = null;
      var x = r, w = x.next;
      x.next = null, u === null ? i = w : u.next = w, u = x;
      var R = e.alternate;
      R !== null && (R = R.updateQueue, r = R.lastBaseUpdate, r !== u && (r === null ? R.firstBaseUpdate = w : r.next = w, R.lastBaseUpdate = x));
    }
    if (i !== null) {
      var B = n.baseState;
      u = 0, R = w = x = null, r = i;
      do {
        var k = r.lane & -536870913, C = k !== r.lane;
        if (C ? (st & k) === k : (s & k) === k) {
          k !== 0 && k === Ia && (kc = !0), R !== null && (R = R.next = {
            lane: 0,
            tag: r.tag,
            payload: r.payload,
            callback: null,
            next: null
          });
          e: {
            var Ae = e, Te = r;
            k = t;
            var jt = l;
            switch (Te.tag) {
              case 1:
                if (Ae = Te.payload, typeof Ae == "function") {
                  B = Ae.call(jt, B, k);
                  break e;
                }
                B = Ae;
                break e;
              case 3:
                Ae.flags = Ae.flags & -65537 | 128;
              case 0:
                if (Ae = Te.payload, k = typeof Ae == "function" ? Ae.call(jt, B, k) : Ae, k == null) break e;
                B = G({}, B, k);
                break e;
              case 2:
                Il = !0;
            }
          }
          k = r.callback, k !== null && (e.flags |= 64, C && (e.flags |= 8192), C = n.callbacks, C === null ? n.callbacks = [k] : C.push(k));
        } else
          C = {
            lane: k,
            tag: r.tag,
            payload: r.payload,
            callback: r.callback,
            next: null
          }, R === null ? (w = R = C, x = B) : R = R.next = C, u |= k;
        if (r = r.next, r === null) {
          if (r = n.shared.pending, r === null)
            break;
          C = r, r = C.next, C.next = null, n.lastBaseUpdate = C, n.shared.pending = null;
        }
      } while (!0);
      R === null && (x = B), n.baseState = x, n.firstBaseUpdate = w, n.lastBaseUpdate = R, i === null && (n.shared.lanes = 0), ua |= u, e.lanes = u, e.memoizedState = B;
    }
  }
  function md(e, t) {
    if (typeof e != "function")
      throw Error(f(191, e));
    e.call(t);
  }
  function vd(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        md(l[e], t);
  }
  var es = T(null), Qn = T(0);
  function xd(e, t) {
    e = Zl, L(Qn, e), L(es, t), Zl = e | t.baseLanes;
  }
  function Ec() {
    L(Qn, Zl), L(es, es.current);
  }
  function Cc() {
    Zl = Qn.current, Y(es), Y(Qn);
  }
  var ta = 0, Xe = null, vt = null, Ut = null, Zn = !1, ts = !1, Ra = !1, Vn = 0, Ls = 0, ls = null, Sm = 0;
  function Tt() {
    throw Error(f(321));
  }
  function Tc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!ll(e[l], t[l])) return !1;
    return !0;
  }
  function Oc(e, t, l, s, n, i) {
    return ta = i, Xe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, b.H = e === null || e.memoizedState === null ? Pd : eo, Ra = !1, i = l(s, n), Ra = !1, ts && (i = gd(
      t,
      l,
      s,
      n
    )), jd(e), i;
  }
  function jd(e) {
    b.H = In;
    var t = vt !== null && vt.next !== null;
    if (ta = 0, Ut = vt = Xe = null, Zn = !1, Ls = 0, ls = null, t) throw Error(f(300));
    e === null || Ht || (e = e.dependencies, e !== null && Bn(e) && (Ht = !0));
  }
  function gd(e, t, l, s) {
    Xe = e;
    var n = 0;
    do {
      if (ts && (ls = null), Ls = 0, ts = !1, 25 <= n) throw Error(f(301));
      if (n += 1, Ut = vt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      b.H = zm, i = t(l, s);
    } while (ts);
    return i;
  }
  function wm() {
    var e = b.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Xs(t) : t, e = e.useState()[0], (vt !== null ? vt.memoizedState : null) !== e && (Xe.flags |= 1024), t;
  }
  function zc() {
    var e = Vn !== 0;
    return Vn = 0, e;
  }
  function Ac(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Rc(e) {
    if (Zn) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Zn = !1;
    }
    ta = 0, Ut = vt = Xe = null, ts = !1, Ls = Vn = 0, ls = null;
  }
  function It() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ut === null ? Xe.memoizedState = Ut = e : Ut = Ut.next = e, Ut;
  }
  function Mt() {
    if (vt === null) {
      var e = Xe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = vt.next;
    var t = Ut === null ? Xe.memoizedState : Ut.next;
    if (t !== null)
      Ut = t, vt = e;
    else {
      if (e === null)
        throw Xe.alternate === null ? Error(f(467)) : Error(f(310));
      vt = e, e = {
        memoizedState: vt.memoizedState,
        baseState: vt.baseState,
        baseQueue: vt.baseQueue,
        queue: vt.queue,
        next: null
      }, Ut === null ? Xe.memoizedState = Ut = e : Ut = Ut.next = e;
    }
    return Ut;
  }
  function Uc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Xs(e) {
    var t = Ls;
    return Ls += 1, ls === null && (ls = []), e = od(ls, e, t), t = Xe, (Ut === null ? t.memoizedState : Ut.next) === null && (t = t.alternate, b.H = t === null || t.memoizedState === null ? Pd : eo), e;
  }
  function Jn(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Xs(e);
      if (e.$$typeof === X) return Vt(e);
    }
    throw Error(f(438, String(e)));
  }
  function Mc(e) {
    var t = null, l = Xe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var s = Xe.alternate;
      s !== null && (s = s.updateQueue, s !== null && (s = s.memoCache, s != null && (t = {
        data: s.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Uc(), Xe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), s = 0; s < e; s++)
        l[s] = ce;
    return t.index++, l;
  }
  function Bl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Kn(e) {
    var t = Mt();
    return Dc(t, vt, e);
  }
  function Dc(e, t, l) {
    var s = e.queue;
    if (s === null) throw Error(f(311));
    s.lastRenderedReducer = l;
    var n = e.baseQueue, i = s.pending;
    if (i !== null) {
      if (n !== null) {
        var u = n.next;
        n.next = i.next, i.next = u;
      }
      t.baseQueue = n = i, s.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var r = u = null, x = null, w = t, R = !1;
      do {
        var B = w.lane & -536870913;
        if (B !== w.lane ? (st & B) === B : (ta & B) === B) {
          var k = w.revertLane;
          if (k === 0)
            x !== null && (x = x.next = {
              lane: 0,
              revertLane: 0,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }), B === Ia && (R = !0);
          else if ((ta & k) === k) {
            w = w.next, k === Ia && (R = !0);
            continue;
          } else
            B = {
              lane: 0,
              revertLane: w.revertLane,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }, x === null ? (r = x = B, u = i) : x = x.next = B, Xe.lanes |= k, ua |= k;
          B = w.action, Ra && l(i, B), i = w.hasEagerState ? w.eagerState : l(i, B);
        } else
          k = {
            lane: B,
            revertLane: w.revertLane,
            action: w.action,
            hasEagerState: w.hasEagerState,
            eagerState: w.eagerState,
            next: null
          }, x === null ? (r = x = k, u = i) : x = x.next = k, Xe.lanes |= B, ua |= B;
        w = w.next;
      } while (w !== null && w !== t);
      if (x === null ? u = i : x.next = r, !ll(i, e.memoizedState) && (Ht = !0, R && (l = Pa, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = u, e.baseQueue = x, s.lastRenderedState = i;
    }
    return n === null && (s.lanes = 0), [e.memoizedState, s.dispatch];
  }
  function qc(e) {
    var t = Mt(), l = t.queue;
    if (l === null) throw Error(f(311));
    l.lastRenderedReducer = e;
    var s = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var u = n = n.next;
      do
        i = e(i, u.action), u = u.next;
      while (u !== n);
      ll(i, t.memoizedState) || (Ht = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, s];
  }
  function pd(e, t, l) {
    var s = Xe, n = Mt(), i = ut;
    if (i) {
      if (l === void 0) throw Error(f(407));
      l = l();
    } else l = t();
    var u = !ll(
      (vt || n).memoizedState,
      l
    );
    u && (n.memoizedState = l, Ht = !0), n = n.queue;
    var r = _d.bind(null, s, n, e);
    if (Qs(2048, 8, r, [e]), n.getSnapshot !== t || u || Ut !== null && Ut.memoizedState.tag & 1) {
      if (s.flags |= 2048, as(
        9,
        $n(),
        bd.bind(
          null,
          s,
          n,
          l,
          t
        ),
        null
      ), yt === null) throw Error(f(349));
      i || (ta & 124) !== 0 || yd(s, t, l);
    }
    return l;
  }
  function yd(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = Xe.updateQueue, t === null ? (t = Uc(), Xe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function bd(e, t, l, s) {
    t.value = l, t.getSnapshot = s, Nd(t) && Sd(e);
  }
  function _d(e, t, l) {
    return l(function() {
      Nd(t) && Sd(e);
    });
  }
  function Nd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !ll(e, l);
    } catch {
      return !0;
    }
  }
  function Sd(e) {
    var t = Ka(e, 2);
    t !== null && ul(t, e, 2);
  }
  function Hc(e) {
    var t = It();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Ra) {
        Ye(!0);
        try {
          l();
        } finally {
          Ye(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Bl,
      lastRenderedState: e
    }, t;
  }
  function wd(e, t, l, s) {
    return e.baseState = l, Dc(
      e,
      vt,
      typeof s == "function" ? s : Bl
    );
  }
  function km(e, t, l, s, n) {
    if (Fn(e)) throw Error(f(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(u) {
          i.listeners.push(u);
        }
      };
      b.T !== null ? l(!0) : i.isTransition = !1, s(i), l = t.pending, l === null ? (i.next = t.pending = i, kd(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function kd(e, t) {
    var l = t.action, s = t.payload, n = e.state;
    if (t.isTransition) {
      var i = b.T, u = {};
      b.T = u;
      try {
        var r = l(n, s), x = b.S;
        x !== null && x(u, r), Ed(e, t, r);
      } catch (w) {
        Bc(e, t, w);
      } finally {
        b.T = i;
      }
    } else
      try {
        i = l(n, s), Ed(e, t, i);
      } catch (w) {
        Bc(e, t, w);
      }
  }
  function Ed(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(s) {
        Cd(e, t, s);
      },
      function(s) {
        return Bc(e, t, s);
      }
    ) : Cd(e, t, l);
  }
  function Cd(e, t, l) {
    t.status = "fulfilled", t.value = l, Td(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, kd(e, l)));
  }
  function Bc(e, t, l) {
    var s = e.pending;
    if (e.pending = null, s !== null) {
      s = s.next;
      do
        t.status = "rejected", t.reason = l, Td(t), t = t.next;
      while (t !== s);
    }
    e.action = null;
  }
  function Td(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Od(e, t) {
    return t;
  }
  function zd(e, t) {
    if (ut) {
      var l = yt.formState;
      if (l !== null) {
        e: {
          var s = Xe;
          if (ut) {
            if (Et) {
              t: {
                for (var n = Et, i = wl; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = _l(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Et = _l(
                  n.nextSibling
                ), s = n.data === "F!";
                break e;
              }
            }
            Ta(s);
          }
          s = !1;
        }
        s && (t = l[0]);
      }
    }
    return l = It(), l.memoizedState = l.baseState = t, s = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Od,
      lastRenderedState: t
    }, l.queue = s, l = Wd.bind(
      null,
      Xe,
      s
    ), s.dispatch = l, s = Hc(!1), i = Qc.bind(
      null,
      Xe,
      !1,
      s.queue
    ), s = It(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, s.queue = n, l = km.bind(
      null,
      Xe,
      n,
      i,
      l
    ), n.dispatch = l, s.memoizedState = e, [t, l, !1];
  }
  function Ad(e) {
    var t = Mt();
    return Rd(t, vt, e);
  }
  function Rd(e, t, l) {
    if (t = Dc(
      e,
      t,
      Od
    )[0], e = Kn(Bl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var s = Xs(t);
      } catch (u) {
        throw u === qs ? Ln : u;
      }
    else s = t;
    t = Mt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (Xe.flags |= 2048, as(
      9,
      $n(),
      Em.bind(null, n, l),
      null
    )), [s, i, e];
  }
  function Em(e, t) {
    e.action = t;
  }
  function Ud(e) {
    var t = Mt(), l = vt;
    if (l !== null)
      return Rd(t, l, e);
    Mt(), t = t.memoizedState, l = Mt();
    var s = l.queue.dispatch;
    return l.memoizedState = e, [t, s, !1];
  }
  function as(e, t, l, s) {
    return e = { tag: e, create: l, deps: s, inst: t, next: null }, t = Xe.updateQueue, t === null && (t = Uc(), Xe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (s = l.next, l.next = e, e.next = s, t.lastEffect = e), e;
  }
  function $n() {
    return { destroy: void 0, resource: void 0 };
  }
  function Md() {
    return Mt().memoizedState;
  }
  function Wn(e, t, l, s) {
    var n = It();
    s = s === void 0 ? null : s, Xe.flags |= e, n.memoizedState = as(
      1 | t,
      $n(),
      l,
      s
    );
  }
  function Qs(e, t, l, s) {
    var n = Mt();
    s = s === void 0 ? null : s;
    var i = n.memoizedState.inst;
    vt !== null && s !== null && Tc(s, vt.memoizedState.deps) ? n.memoizedState = as(t, i, l, s) : (Xe.flags |= e, n.memoizedState = as(
      1 | t,
      i,
      l,
      s
    ));
  }
  function Dd(e, t) {
    Wn(8390656, 8, e, t);
  }
  function qd(e, t) {
    Qs(2048, 8, e, t);
  }
  function Hd(e, t) {
    return Qs(4, 2, e, t);
  }
  function Bd(e, t) {
    return Qs(4, 4, e, t);
  }
  function Yd(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Gd(e, t, l) {
    l = l != null ? l.concat([e]) : null, Qs(4, 4, Yd.bind(null, t, e), l);
  }
  function Yc() {
  }
  function Ld(e, t) {
    var l = Mt();
    t = t === void 0 ? null : t;
    var s = l.memoizedState;
    return t !== null && Tc(t, s[1]) ? s[0] : (l.memoizedState = [e, t], e);
  }
  function Xd(e, t) {
    var l = Mt();
    t = t === void 0 ? null : t;
    var s = l.memoizedState;
    if (t !== null && Tc(t, s[1]))
      return s[0];
    if (s = e(), Ra) {
      Ye(!0);
      try {
        e();
      } finally {
        Ye(!1);
      }
    }
    return l.memoizedState = [s, t], s;
  }
  function Gc(e, t, l) {
    return l === void 0 || (ta & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = Jo(), Xe.lanes |= e, ua |= e, l);
  }
  function Qd(e, t, l, s) {
    return ll(l, t) ? l : es.current !== null ? (e = Gc(e, l, s), ll(e, t) || (Ht = !0), e) : (ta & 42) === 0 ? (Ht = !0, e.memoizedState = l) : (e = Jo(), Xe.lanes |= e, ua |= e, t);
  }
  function Zd(e, t, l, s, n) {
    var i = U.p;
    U.p = i !== 0 && 8 > i ? i : 8;
    var u = b.T, r = {};
    b.T = r, Qc(e, !1, t, l);
    try {
      var x = n(), w = b.S;
      if (w !== null && w(r, x), x !== null && typeof x == "object" && typeof x.then == "function") {
        var R = Nm(
          x,
          s
        );
        Zs(
          e,
          t,
          R,
          cl(e)
        );
      } else
        Zs(
          e,
          t,
          s,
          cl(e)
        );
    } catch (B) {
      Zs(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: B },
        cl()
      );
    } finally {
      U.p = i, b.T = u;
    }
  }
  function Cm() {
  }
  function Lc(e, t, l, s) {
    if (e.tag !== 5) throw Error(f(476));
    var n = Vd(e).queue;
    Zd(
      e,
      n,
      t,
      Q,
      l === null ? Cm : function() {
        return Jd(e), l(s);
      }
    );
  }
  function Vd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Q,
      baseState: Q,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Bl,
        lastRenderedState: Q
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Bl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Jd(e) {
    var t = Vd(e).next.queue;
    Zs(e, t, {}, cl());
  }
  function Xc() {
    return Vt(dn);
  }
  function Kd() {
    return Mt().memoizedState;
  }
  function $d() {
    return Mt().memoizedState;
  }
  function Tm(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = cl();
          e = Pl(l);
          var s = ea(t, e, l);
          s !== null && (ul(s, t, l), Bs(s, t, l)), t = { cache: pc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Om(e, t, l) {
    var s = cl();
    l = {
      lane: s,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fn(e) ? Fd(t, l) : (l = rc(e, t, l, s), l !== null && (ul(l, e, s), Id(l, t, s)));
  }
  function Wd(e, t, l) {
    var s = cl();
    Zs(e, t, l, s);
  }
  function Zs(e, t, l, s) {
    var n = {
      lane: s,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Fn(e)) Fd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var u = t.lastRenderedState, r = i(u, l);
          if (n.hasEagerState = !0, n.eagerState = r, ll(r, u))
            return Un(e, t, n, 0), yt === null && Rn(), !1;
        } catch {
        } finally {
        }
      if (l = rc(e, t, n, s), l !== null)
        return ul(l, e, s), Id(l, t, s), !0;
    }
    return !1;
  }
  function Qc(e, t, l, s) {
    if (s = {
      lane: 2,
      revertLane: _u(),
      action: s,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fn(e)) {
      if (t) throw Error(f(479));
    } else
      t = rc(
        e,
        l,
        s,
        2
      ), t !== null && ul(t, e, 2);
  }
  function Fn(e) {
    var t = e.alternate;
    return e === Xe || t !== null && t === Xe;
  }
  function Fd(e, t) {
    ts = Zn = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Id(e, t, l) {
    if ((l & 4194048) !== 0) {
      var s = t.lanes;
      s &= e.pendingLanes, l |= s, t.lanes = l, Ue(e, l);
    }
  }
  var In = {
    readContext: Vt,
    use: Jn,
    useCallback: Tt,
    useContext: Tt,
    useEffect: Tt,
    useImperativeHandle: Tt,
    useLayoutEffect: Tt,
    useInsertionEffect: Tt,
    useMemo: Tt,
    useReducer: Tt,
    useRef: Tt,
    useState: Tt,
    useDebugValue: Tt,
    useDeferredValue: Tt,
    useTransition: Tt,
    useSyncExternalStore: Tt,
    useId: Tt,
    useHostTransitionStatus: Tt,
    useFormState: Tt,
    useActionState: Tt,
    useOptimistic: Tt,
    useMemoCache: Tt,
    useCacheRefresh: Tt
  }, Pd = {
    readContext: Vt,
    use: Jn,
    useCallback: function(e, t) {
      return It().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Vt,
    useEffect: Dd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, Wn(
        4194308,
        4,
        Yd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return Wn(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Wn(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = It();
      t = t === void 0 ? null : t;
      var s = e();
      if (Ra) {
        Ye(!0);
        try {
          e();
        } finally {
          Ye(!1);
        }
      }
      return l.memoizedState = [s, t], s;
    },
    useReducer: function(e, t, l) {
      var s = It();
      if (l !== void 0) {
        var n = l(t);
        if (Ra) {
          Ye(!0);
          try {
            l(t);
          } finally {
            Ye(!1);
          }
        }
      } else n = t;
      return s.memoizedState = s.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, s.queue = e, e = e.dispatch = Om.bind(
        null,
        Xe,
        e
      ), [s.memoizedState, e];
    },
    useRef: function(e) {
      var t = It();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Hc(e);
      var t = e.queue, l = Wd.bind(null, Xe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Yc,
    useDeferredValue: function(e, t) {
      var l = It();
      return Gc(l, e, t);
    },
    useTransition: function() {
      var e = Hc(!1);
      return e = Zd.bind(
        null,
        Xe,
        e.queue,
        !0,
        !1
      ), It().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var s = Xe, n = It();
      if (ut) {
        if (l === void 0)
          throw Error(f(407));
        l = l();
      } else {
        if (l = t(), yt === null)
          throw Error(f(349));
        (st & 124) !== 0 || yd(s, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, Dd(_d.bind(null, s, i, e), [
        e
      ]), s.flags |= 2048, as(
        9,
        $n(),
        bd.bind(
          null,
          s,
          i,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = It(), t = yt.identifierPrefix;
      if (ut) {
        var l = Dl, s = Ml;
        l = (s & ~(1 << 32 - _(s) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = Vn++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = Sm++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Xc,
    useFormState: zd,
    useActionState: zd,
    useOptimistic: function(e) {
      var t = It();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = Qc.bind(
        null,
        Xe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Mc,
    useCacheRefresh: function() {
      return It().memoizedState = Tm.bind(
        null,
        Xe
      );
    }
  }, eo = {
    readContext: Vt,
    use: Jn,
    useCallback: Ld,
    useContext: Vt,
    useEffect: qd,
    useImperativeHandle: Gd,
    useInsertionEffect: Hd,
    useLayoutEffect: Bd,
    useMemo: Xd,
    useReducer: Kn,
    useRef: Md,
    useState: function() {
      return Kn(Bl);
    },
    useDebugValue: Yc,
    useDeferredValue: function(e, t) {
      var l = Mt();
      return Qd(
        l,
        vt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Kn(Bl)[0], t = Mt().memoizedState;
      return [
        typeof e == "boolean" ? e : Xs(e),
        t
      ];
    },
    useSyncExternalStore: pd,
    useId: Kd,
    useHostTransitionStatus: Xc,
    useFormState: Ad,
    useActionState: Ad,
    useOptimistic: function(e, t) {
      var l = Mt();
      return wd(l, vt, e, t);
    },
    useMemoCache: Mc,
    useCacheRefresh: $d
  }, zm = {
    readContext: Vt,
    use: Jn,
    useCallback: Ld,
    useContext: Vt,
    useEffect: qd,
    useImperativeHandle: Gd,
    useInsertionEffect: Hd,
    useLayoutEffect: Bd,
    useMemo: Xd,
    useReducer: qc,
    useRef: Md,
    useState: function() {
      return qc(Bl);
    },
    useDebugValue: Yc,
    useDeferredValue: function(e, t) {
      var l = Mt();
      return vt === null ? Gc(l, e, t) : Qd(
        l,
        vt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = qc(Bl)[0], t = Mt().memoizedState;
      return [
        typeof e == "boolean" ? e : Xs(e),
        t
      ];
    },
    useSyncExternalStore: pd,
    useId: Kd,
    useHostTransitionStatus: Xc,
    useFormState: Ud,
    useActionState: Ud,
    useOptimistic: function(e, t) {
      var l = Mt();
      return vt !== null ? wd(l, vt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Mc,
    useCacheRefresh: $d
  }, ss = null, Vs = 0;
  function Pn(e) {
    var t = Vs;
    return Vs += 1, ss === null && (ss = []), od(ss, e, t);
  }
  function Js(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ei(e, t) {
    throw t.$$typeof === xe ? Error(f(525)) : (e = Object.prototype.toString.call(t), Error(
      f(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function to(e) {
    var t = e._init;
    return t(e._payload);
  }
  function lo(e) {
    function t(y, g) {
      if (e) {
        var S = y.deletions;
        S === null ? (y.deletions = [g], y.flags |= 16) : S.push(g);
      }
    }
    function l(y, g) {
      if (!e) return null;
      for (; g !== null; )
        t(y, g), g = g.sibling;
      return null;
    }
    function s(y) {
      for (var g = /* @__PURE__ */ new Map(); y !== null; )
        y.key !== null ? g.set(y.key, y) : g.set(y.index, y), y = y.sibling;
      return g;
    }
    function n(y, g) {
      return y = Ul(y, g), y.index = 0, y.sibling = null, y;
    }
    function i(y, g, S) {
      return y.index = S, e ? (S = y.alternate, S !== null ? (S = S.index, S < g ? (y.flags |= 67108866, g) : S) : (y.flags |= 67108866, g)) : (y.flags |= 1048576, g);
    }
    function u(y) {
      return e && y.alternate === null && (y.flags |= 67108866), y;
    }
    function r(y, g, S, M) {
      return g === null || g.tag !== 6 ? (g = oc(S, y.mode, M), g.return = y, g) : (g = n(g, S), g.return = y, g);
    }
    function x(y, g, S, M) {
      var ve = S.type;
      return ve === I ? R(
        y,
        g,
        S.props.children,
        M,
        S.key
      ) : g !== null && (g.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === ye && to(ve) === g.type) ? (g = n(g, S.props), Js(g, S), g.return = y, g) : (g = Dn(
        S.type,
        S.key,
        S.props,
        null,
        y.mode,
        M
      ), Js(g, S), g.return = y, g);
    }
    function w(y, g, S, M) {
      return g === null || g.tag !== 4 || g.stateNode.containerInfo !== S.containerInfo || g.stateNode.implementation !== S.implementation ? (g = fc(S, y.mode, M), g.return = y, g) : (g = n(g, S.children || []), g.return = y, g);
    }
    function R(y, g, S, M, ve) {
      return g === null || g.tag !== 7 ? (g = wa(
        S,
        y.mode,
        M,
        ve
      ), g.return = y, g) : (g = n(g, S), g.return = y, g);
    }
    function B(y, g, S) {
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return g = oc(
          "" + g,
          y.mode,
          S
        ), g.return = y, g;
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case E:
            return S = Dn(
              g.type,
              g.key,
              g.props,
              null,
              y.mode,
              S
            ), Js(S, g), S.return = y, S;
          case oe:
            return g = fc(
              g,
              y.mode,
              S
            ), g.return = y, g;
          case ye:
            var M = g._init;
            return g = M(g._payload), B(y, g, S);
        }
        if (Ce(g) || ue(g))
          return g = wa(
            g,
            y.mode,
            S,
            null
          ), g.return = y, g;
        if (typeof g.then == "function")
          return B(y, Pn(g), S);
        if (g.$$typeof === X)
          return B(
            y,
            Yn(y, g),
            S
          );
        ei(y, g);
      }
      return null;
    }
    function k(y, g, S, M) {
      var ve = g !== null ? g.key : null;
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return ve !== null ? null : r(y, g, "" + S, M);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case E:
            return S.key === ve ? x(y, g, S, M) : null;
          case oe:
            return S.key === ve ? w(y, g, S, M) : null;
          case ye:
            return ve = S._init, S = ve(S._payload), k(y, g, S, M);
        }
        if (Ce(S) || ue(S))
          return ve !== null ? null : R(y, g, S, M, null);
        if (typeof S.then == "function")
          return k(
            y,
            g,
            Pn(S),
            M
          );
        if (S.$$typeof === X)
          return k(
            y,
            g,
            Yn(y, S),
            M
          );
        ei(y, S);
      }
      return null;
    }
    function C(y, g, S, M, ve) {
      if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
        return y = y.get(S) || null, r(g, y, "" + M, ve);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case E:
            return y = y.get(
              M.key === null ? S : M.key
            ) || null, x(g, y, M, ve);
          case oe:
            return y = y.get(
              M.key === null ? S : M.key
            ) || null, w(g, y, M, ve);
          case ye:
            var Ve = M._init;
            return M = Ve(M._payload), C(
              y,
              g,
              S,
              M,
              ve
            );
        }
        if (Ce(M) || ue(M))
          return y = y.get(S) || null, R(g, y, M, ve, null);
        if (typeof M.then == "function")
          return C(
            y,
            g,
            S,
            Pn(M),
            ve
          );
        if (M.$$typeof === X)
          return C(
            y,
            g,
            S,
            Yn(g, M),
            ve
          );
        ei(g, M);
      }
      return null;
    }
    function Ae(y, g, S, M) {
      for (var ve = null, Ve = null, _e = g, Oe = g = 0, Yt = null; _e !== null && Oe < S.length; Oe++) {
        _e.index > Oe ? (Yt = _e, _e = null) : Yt = _e.sibling;
        var it = k(
          y,
          _e,
          S[Oe],
          M
        );
        if (it === null) {
          _e === null && (_e = Yt);
          break;
        }
        e && _e && it.alternate === null && t(y, _e), g = i(it, g, Oe), Ve === null ? ve = it : Ve.sibling = it, Ve = it, _e = Yt;
      }
      if (Oe === S.length)
        return l(y, _e), ut && Ea(y, Oe), ve;
      if (_e === null) {
        for (; Oe < S.length; Oe++)
          _e = B(y, S[Oe], M), _e !== null && (g = i(
            _e,
            g,
            Oe
          ), Ve === null ? ve = _e : Ve.sibling = _e, Ve = _e);
        return ut && Ea(y, Oe), ve;
      }
      for (_e = s(_e); Oe < S.length; Oe++)
        Yt = C(
          _e,
          y,
          Oe,
          S[Oe],
          M
        ), Yt !== null && (e && Yt.alternate !== null && _e.delete(
          Yt.key === null ? Oe : Yt.key
        ), g = i(
          Yt,
          g,
          Oe
        ), Ve === null ? ve = Yt : Ve.sibling = Yt, Ve = Yt);
      return e && _e.forEach(function(ja) {
        return t(y, ja);
      }), ut && Ea(y, Oe), ve;
    }
    function Te(y, g, S, M) {
      if (S == null) throw Error(f(151));
      for (var ve = null, Ve = null, _e = g, Oe = g = 0, Yt = null, it = S.next(); _e !== null && !it.done; Oe++, it = S.next()) {
        _e.index > Oe ? (Yt = _e, _e = null) : Yt = _e.sibling;
        var ja = k(y, _e, it.value, M);
        if (ja === null) {
          _e === null && (_e = Yt);
          break;
        }
        e && _e && ja.alternate === null && t(y, _e), g = i(ja, g, Oe), Ve === null ? ve = ja : Ve.sibling = ja, Ve = ja, _e = Yt;
      }
      if (it.done)
        return l(y, _e), ut && Ea(y, Oe), ve;
      if (_e === null) {
        for (; !it.done; Oe++, it = S.next())
          it = B(y, it.value, M), it !== null && (g = i(it, g, Oe), Ve === null ? ve = it : Ve.sibling = it, Ve = it);
        return ut && Ea(y, Oe), ve;
      }
      for (_e = s(_e); !it.done; Oe++, it = S.next())
        it = C(_e, y, Oe, it.value, M), it !== null && (e && it.alternate !== null && _e.delete(it.key === null ? Oe : it.key), g = i(it, g, Oe), Ve === null ? ve = it : Ve.sibling = it, Ve = it);
      return e && _e.forEach(function(Av) {
        return t(y, Av);
      }), ut && Ea(y, Oe), ve;
    }
    function jt(y, g, S, M) {
      if (typeof S == "object" && S !== null && S.type === I && S.key === null && (S = S.props.children), typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case E:
            e: {
              for (var ve = S.key; g !== null; ) {
                if (g.key === ve) {
                  if (ve = S.type, ve === I) {
                    if (g.tag === 7) {
                      l(
                        y,
                        g.sibling
                      ), M = n(
                        g,
                        S.props.children
                      ), M.return = y, y = M;
                      break e;
                    }
                  } else if (g.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === ye && to(ve) === g.type) {
                    l(
                      y,
                      g.sibling
                    ), M = n(g, S.props), Js(M, S), M.return = y, y = M;
                    break e;
                  }
                  l(y, g);
                  break;
                } else t(y, g);
                g = g.sibling;
              }
              S.type === I ? (M = wa(
                S.props.children,
                y.mode,
                M,
                S.key
              ), M.return = y, y = M) : (M = Dn(
                S.type,
                S.key,
                S.props,
                null,
                y.mode,
                M
              ), Js(M, S), M.return = y, y = M);
            }
            return u(y);
          case oe:
            e: {
              for (ve = S.key; g !== null; ) {
                if (g.key === ve)
                  if (g.tag === 4 && g.stateNode.containerInfo === S.containerInfo && g.stateNode.implementation === S.implementation) {
                    l(
                      y,
                      g.sibling
                    ), M = n(g, S.children || []), M.return = y, y = M;
                    break e;
                  } else {
                    l(y, g);
                    break;
                  }
                else t(y, g);
                g = g.sibling;
              }
              M = fc(S, y.mode, M), M.return = y, y = M;
            }
            return u(y);
          case ye:
            return ve = S._init, S = ve(S._payload), jt(
              y,
              g,
              S,
              M
            );
        }
        if (Ce(S))
          return Ae(
            y,
            g,
            S,
            M
          );
        if (ue(S)) {
          if (ve = ue(S), typeof ve != "function") throw Error(f(150));
          return S = ve.call(S), Te(
            y,
            g,
            S,
            M
          );
        }
        if (typeof S.then == "function")
          return jt(
            y,
            g,
            Pn(S),
            M
          );
        if (S.$$typeof === X)
          return jt(
            y,
            g,
            Yn(y, S),
            M
          );
        ei(y, S);
      }
      return typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint" ? (S = "" + S, g !== null && g.tag === 6 ? (l(y, g.sibling), M = n(g, S), M.return = y, y = M) : (l(y, g), M = oc(S, y.mode, M), M.return = y, y = M), u(y)) : l(y, g);
    }
    return function(y, g, S, M) {
      try {
        Vs = 0;
        var ve = jt(
          y,
          g,
          S,
          M
        );
        return ss = null, ve;
      } catch (_e) {
        if (_e === qs || _e === Ln) throw _e;
        var Ve = al(29, _e, null, y.mode);
        return Ve.lanes = M, Ve.return = y, Ve;
      } finally {
      }
    };
  }
  var ns = lo(!0), ao = lo(!1), jl = T(null), kl = null;
  function la(e) {
    var t = e.alternate;
    L(qt, qt.current & 1), L(jl, e), kl === null && (t === null || es.current !== null || t.memoizedState !== null) && (kl = e);
  }
  function so(e) {
    if (e.tag === 22) {
      if (L(qt, qt.current), L(jl, e), kl === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (kl = e);
      }
    } else aa();
  }
  function aa() {
    L(qt, qt.current), L(jl, jl.current);
  }
  function Yl(e) {
    Y(jl), kl === e && (kl = null), Y(qt);
  }
  var qt = T(0);
  function ti(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Uu(l)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  function Zc(e, t, l, s) {
    t = e.memoizedState, l = l(s, t), l = l == null ? t : G({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Vc = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var s = cl(), n = Pl(s);
      n.payload = t, l != null && (n.callback = l), t = ea(e, n, s), t !== null && (ul(t, e, s), Bs(t, e, s));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var s = cl(), n = Pl(s);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = ea(e, n, s), t !== null && (ul(t, e, s), Bs(t, e, s));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = cl(), s = Pl(l);
      s.tag = 2, t != null && (s.callback = t), t = ea(e, s, l), t !== null && (ul(t, e, l), Bs(t, e, l));
    }
  };
  function no(e, t, l, s, n, i, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, i, u) : t.prototype && t.prototype.isPureReactComponent ? !Ts(l, s) || !Ts(n, i) : !0;
  }
  function io(e, t, l, s) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, s), t.state !== e && Vc.enqueueReplaceState(t, t.state, null);
  }
  function Ua(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var s in t)
        s !== "ref" && (l[s] = t[s]);
    }
    if (e = e.defaultProps) {
      l === t && (l = G({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var li = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  };
  function co(e) {
    li(e);
  }
  function uo(e) {
    console.error(e);
  }
  function ro(e) {
    li(e);
  }
  function ai(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function oo(e, t, l) {
    try {
      var s = e.onCaughtError;
      s(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Jc(e, t, l) {
    return l = Pl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      ai(e, t);
    }, l;
  }
  function fo(e) {
    return e = Pl(e), e.tag = 3, e;
  }
  function ho(e, t, l, s) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = s.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        oo(t, l, s);
      };
    }
    var u = l.stateNode;
    u !== null && typeof u.componentDidCatch == "function" && (e.callback = function() {
      oo(t, l, s), typeof n != "function" && (ra === null ? ra = /* @__PURE__ */ new Set([this]) : ra.add(this));
      var r = s.stack;
      this.componentDidCatch(s.value, {
        componentStack: r !== null ? r : ""
      });
    });
  }
  function Am(e, t, l, s, n) {
    if (l.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
      if (t = l.alternate, t !== null && Us(
        t,
        l,
        n,
        !0
      ), l = jl.current, l !== null) {
        switch (l.tag) {
          case 13:
            return kl === null ? ju() : l.alternate === null && Ct === 0 && (Ct = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, s === _c ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([s]) : t.add(s), pu(e, s, n)), !1;
          case 22:
            return l.flags |= 65536, s === _c ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([s])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([s]) : l.add(s)), pu(e, s, n)), !1;
        }
        throw Error(f(435, l.tag));
      }
      return pu(e, s, n), ju(), !1;
    }
    if (ut)
      return t = jl.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, s !== vc && (e = Error(f(422), { cause: s }), Rs(hl(e, l)))) : (s !== vc && (t = Error(f(423), {
        cause: s
      }), Rs(
        hl(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, s = hl(s, l), n = Jc(
        e.stateNode,
        s,
        n
      ), wc(e, n), Ct !== 4 && (Ct = 2)), !1;
    var i = Error(f(520), { cause: s });
    if (i = hl(i, l), en === null ? en = [i] : en.push(i), Ct !== 4 && (Ct = 2), t === null) return !0;
    s = hl(s, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = Jc(l.stateNode, s, e), wc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (ra === null || !ra.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = fo(n), ho(
              n,
              e,
              l,
              s
            ), wc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var mo = Error(f(461)), Ht = !1;
  function Lt(e, t, l, s) {
    t.child = e === null ? ao(t, null, l, s) : ns(
      t,
      e.child,
      l,
      s
    );
  }
  function vo(e, t, l, s, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in s) {
      var u = {};
      for (var r in s)
        r !== "ref" && (u[r] = s[r]);
    } else u = s;
    return za(t), s = Oc(
      e,
      t,
      l,
      u,
      i,
      n
    ), r = zc(), e !== null && !Ht ? (Ac(e, t, n), Gl(e, t, n)) : (ut && r && hc(t), t.flags |= 1, Lt(e, t, s, n), t.child);
  }
  function xo(e, t, l, s, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !dc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, jo(
        e,
        t,
        i,
        s,
        n
      )) : (e = Dn(
        l.type,
        null,
        s,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !tu(e, n)) {
      var u = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Ts, l(u, s) && e.ref === t.ref)
        return Gl(e, t, n);
    }
    return t.flags |= 1, e = Ul(i, s), e.ref = t.ref, e.return = t, t.child = e;
  }
  function jo(e, t, l, s, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Ts(i, s) && e.ref === t.ref)
        if (Ht = !1, t.pendingProps = s = i, tu(e, n))
          (e.flags & 131072) !== 0 && (Ht = !0);
        else
          return t.lanes = e.lanes, Gl(e, t, n);
    }
    return Kc(
      e,
      t,
      l,
      s,
      n
    );
  }
  function go(e, t, l) {
    var s = t.pendingProps, n = s.children, i = e !== null ? e.memoizedState : null;
    if (s.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (s = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~s;
        } else t.childLanes = 0, t.child = null;
        return po(
          e,
          t,
          s,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Gn(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? xd(t, i) : Ec(), so(t);
      else
        return t.lanes = t.childLanes = 536870912, po(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (Gn(t, i.cachePool), xd(t, i), aa(), t.memoizedState = null) : (e !== null && Gn(t, null), Ec(), aa());
    return Lt(e, t, n, l), t.child;
  }
  function po(e, t, l, s) {
    var n = bc();
    return n = n === null ? null : { parent: Dt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && Gn(t, null), Ec(), so(t), e !== null && Us(e, t, s, !0), null;
  }
  function si(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(f(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function Kc(e, t, l, s, n) {
    return za(t), l = Oc(
      e,
      t,
      l,
      s,
      void 0,
      n
    ), s = zc(), e !== null && !Ht ? (Ac(e, t, n), Gl(e, t, n)) : (ut && s && hc(t), t.flags |= 1, Lt(e, t, l, n), t.child);
  }
  function yo(e, t, l, s, n, i) {
    return za(t), t.updateQueue = null, l = gd(
      t,
      s,
      l,
      n
    ), jd(e), s = zc(), e !== null && !Ht ? (Ac(e, t, i), Gl(e, t, i)) : (ut && s && hc(t), t.flags |= 1, Lt(e, t, l, i), t.child);
  }
  function bo(e, t, l, s, n) {
    if (za(t), t.stateNode === null) {
      var i = $a, u = l.contextType;
      typeof u == "object" && u !== null && (i = Vt(u)), i = new l(s, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = Vc, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = s, i.state = t.memoizedState, i.refs = {}, Nc(t), u = l.contextType, i.context = typeof u == "object" && u !== null ? Vt(u) : $a, i.state = t.memoizedState, u = l.getDerivedStateFromProps, typeof u == "function" && (Zc(
        t,
        l,
        u,
        s
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (u = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), u !== i.state && Vc.enqueueReplaceState(i, i.state, null), Gs(t, s, i, n), Ys(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), s = !0;
    } else if (e === null) {
      i = t.stateNode;
      var r = t.memoizedProps, x = Ua(l, r);
      i.props = x;
      var w = i.context, R = l.contextType;
      u = $a, typeof R == "object" && R !== null && (u = Vt(R));
      var B = l.getDerivedStateFromProps;
      R = typeof B == "function" || typeof i.getSnapshotBeforeUpdate == "function", r = t.pendingProps !== r, R || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (r || w !== u) && io(
        t,
        i,
        s,
        u
      ), Il = !1;
      var k = t.memoizedState;
      i.state = k, Gs(t, s, i, n), Ys(), w = t.memoizedState, r || k !== w || Il ? (typeof B == "function" && (Zc(
        t,
        l,
        B,
        s
      ), w = t.memoizedState), (x = Il || no(
        t,
        l,
        x,
        s,
        k,
        w,
        u
      )) ? (R || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = w), i.props = s, i.state = w, i.context = u, s = x) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), s = !1);
    } else {
      i = t.stateNode, Sc(e, t), u = t.memoizedProps, R = Ua(l, u), i.props = R, B = t.pendingProps, k = i.context, w = l.contextType, x = $a, typeof w == "object" && w !== null && (x = Vt(w)), r = l.getDerivedStateFromProps, (w = typeof r == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== B || k !== x) && io(
        t,
        i,
        s,
        x
      ), Il = !1, k = t.memoizedState, i.state = k, Gs(t, s, i, n), Ys();
      var C = t.memoizedState;
      u !== B || k !== C || Il || e !== null && e.dependencies !== null && Bn(e.dependencies) ? (typeof r == "function" && (Zc(
        t,
        l,
        r,
        s
      ), C = t.memoizedState), (R = Il || no(
        t,
        l,
        R,
        s,
        k,
        C,
        x
      ) || e !== null && e.dependencies !== null && Bn(e.dependencies)) ? (w || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(s, C, x), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        s,
        C,
        x
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = C), i.props = s, i.state = C, i.context = x, s = R) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), s = !1);
    }
    return i = s, si(e, t), s = (t.flags & 128) !== 0, i || s ? (i = t.stateNode, l = s && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && s ? (t.child = ns(
      t,
      e.child,
      null,
      n
    ), t.child = ns(
      t,
      null,
      l,
      n
    )) : Lt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Gl(
      e,
      t,
      n
    ), e;
  }
  function _o(e, t, l, s) {
    return As(), t.flags |= 256, Lt(e, t, l, s), t.child;
  }
  var $c = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Wc(e) {
    return { baseLanes: e, cachePool: ud() };
  }
  function Fc(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= gl), e;
  }
  function No(e, t, l) {
    var s = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (qt.current & 2) !== 0), u && (n = !0, t.flags &= -129), u = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (ut) {
        if (n ? la(t) : aa(), ut) {
          var r = Et, x;
          if (x = r) {
            e: {
              for (x = r, r = wl; x.nodeType !== 8; ) {
                if (!r) {
                  r = null;
                  break e;
                }
                if (x = _l(
                  x.nextSibling
                ), x === null) {
                  r = null;
                  break e;
                }
              }
              r = x;
            }
            r !== null ? (t.memoizedState = {
              dehydrated: r,
              treeContext: ka !== null ? { id: Ml, overflow: Dl } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, x = al(
              18,
              null,
              null,
              0
            ), x.stateNode = r, x.return = t, t.child = x, $t = t, Et = null, x = !0) : x = !1;
          }
          x || Ta(t);
        }
        if (r = t.memoizedState, r !== null && (r = r.dehydrated, r !== null))
          return Uu(r) ? t.lanes = 32 : t.lanes = 536870912, null;
        Yl(t);
      }
      return r = s.children, s = s.fallback, n ? (aa(), n = t.mode, r = ni(
        { mode: "hidden", children: r },
        n
      ), s = wa(
        s,
        n,
        l,
        null
      ), r.return = t, s.return = t, r.sibling = s, t.child = r, n = t.child, n.memoizedState = Wc(l), n.childLanes = Fc(
        e,
        u,
        l
      ), t.memoizedState = $c, s) : (la(t), Ic(t, r));
    }
    if (x = e.memoizedState, x !== null && (r = x.dehydrated, r !== null)) {
      if (i)
        t.flags & 256 ? (la(t), t.flags &= -257, t = Pc(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (aa(), t.child = e.child, t.flags |= 128, t = null) : (aa(), n = s.fallback, r = t.mode, s = ni(
          { mode: "visible", children: s.children },
          r
        ), n = wa(
          n,
          r,
          l,
          null
        ), n.flags |= 2, s.return = t, n.return = t, s.sibling = n, t.child = s, ns(
          t,
          e.child,
          null,
          l
        ), s = t.child, s.memoizedState = Wc(l), s.childLanes = Fc(
          e,
          u,
          l
        ), t.memoizedState = $c, t = n);
      else if (la(t), Uu(r)) {
        if (u = r.nextSibling && r.nextSibling.dataset, u) var w = u.dgst;
        u = w, s = Error(f(419)), s.stack = "", s.digest = u, Rs({ value: s, source: null, stack: null }), t = Pc(
          e,
          t,
          l
        );
      } else if (Ht || Us(e, t, l, !1), u = (l & e.childLanes) !== 0, Ht || u) {
        if (u = yt, u !== null && (s = l & -l, s = (s & 42) !== 0 ? 1 : nt(s), s = (s & (u.suspendedLanes | l)) !== 0 ? 0 : s, s !== 0 && s !== x.retryLane))
          throw x.retryLane = s, Ka(e, s), ul(u, e, s), mo;
        r.data === "$?" || ju(), t = Pc(
          e,
          t,
          l
        );
      } else
        r.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = x.treeContext, Et = _l(
          r.nextSibling
        ), $t = t, ut = !0, Ca = null, wl = !1, e !== null && (vl[xl++] = Ml, vl[xl++] = Dl, vl[xl++] = ka, Ml = e.id, Dl = e.overflow, ka = t), t = Ic(
          t,
          s.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (aa(), n = s.fallback, r = t.mode, x = e.child, w = x.sibling, s = Ul(x, {
      mode: "hidden",
      children: s.children
    }), s.subtreeFlags = x.subtreeFlags & 65011712, w !== null ? n = Ul(w, n) : (n = wa(
      n,
      r,
      l,
      null
    ), n.flags |= 2), n.return = t, s.return = t, s.sibling = n, t.child = s, s = n, n = t.child, r = e.child.memoizedState, r === null ? r = Wc(l) : (x = r.cachePool, x !== null ? (w = Dt._currentValue, x = x.parent !== w ? { parent: w, pool: w } : x) : x = ud(), r = {
      baseLanes: r.baseLanes | l,
      cachePool: x
    }), n.memoizedState = r, n.childLanes = Fc(
      e,
      u,
      l
    ), t.memoizedState = $c, s) : (la(t), l = e.child, e = l.sibling, l = Ul(l, {
      mode: "visible",
      children: s.children
    }), l.return = t, l.sibling = null, e !== null && (u = t.deletions, u === null ? (t.deletions = [e], t.flags |= 16) : u.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function Ic(e, t) {
    return t = ni(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ni(e, t) {
    return e = al(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function Pc(e, t, l) {
    return ns(t, e.child, null, l), e = Ic(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function So(e, t, l) {
    e.lanes |= t;
    var s = e.alternate;
    s !== null && (s.lanes |= t), jc(e.return, t, l);
  }
  function eu(e, t, l, s, n) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: s,
      tail: l,
      tailMode: n
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = s, i.tail = l, i.tailMode = n);
  }
  function wo(e, t, l) {
    var s = t.pendingProps, n = s.revealOrder, i = s.tail;
    if (Lt(e, t, s.children, l), s = qt.current, (s & 2) !== 0)
      s = s & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && So(e, l, t);
          else if (e.tag === 19)
            So(e, l, t);
          else if (e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t)
              break e;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      s &= 1;
    }
    switch (L(qt, s), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && ti(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), eu(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && ti(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        eu(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        eu(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Gl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), ua |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Us(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(f(153));
    if (t.child !== null) {
      for (e = t.child, l = Ul(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Ul(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function tu(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Bn(e)));
  }
  function Rm(e, t, l) {
    switch (t.tag) {
      case 3:
        z(t, t.stateNode.containerInfo), Fl(t, Dt, e.memoizedState.cache), As();
        break;
      case 27:
      case 5:
        ke(t);
        break;
      case 4:
        z(t, t.stateNode.containerInfo);
        break;
      case 10:
        Fl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var s = t.memoizedState;
        if (s !== null)
          return s.dehydrated !== null ? (la(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? No(e, t, l) : (la(t), e = Gl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        la(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (s = (l & t.childLanes) !== 0, s || (Us(
          e,
          t,
          l,
          !1
        ), s = (l & t.childLanes) !== 0), n) {
          if (s)
            return wo(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), L(qt, qt.current), s) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, go(e, t, l);
      case 24:
        Fl(t, Dt, e.memoizedState.cache);
    }
    return Gl(e, t, l);
  }
  function ko(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ht = !0;
      else {
        if (!tu(e, l) && (t.flags & 128) === 0)
          return Ht = !1, Rm(
            e,
            t,
            l
          );
        Ht = (e.flags & 131072) !== 0;
      }
    else
      Ht = !1, ut && (t.flags & 1048576) !== 0 && td(t, Hn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var s = t.elementType, n = s._init;
          if (s = n(s._payload), t.type = s, typeof s == "function")
            dc(s) ? (e = Ua(s, e), t.tag = 1, t = bo(
              null,
              t,
              s,
              e,
              l
            )) : (t.tag = 0, t = Kc(
              null,
              t,
              s,
              e,
              l
            ));
          else {
            if (s != null) {
              if (n = s.$$typeof, n === fe) {
                t.tag = 11, t = vo(
                  null,
                  t,
                  s,
                  e,
                  l
                );
                break e;
              } else if (n === Ee) {
                t.tag = 14, t = xo(
                  null,
                  t,
                  s,
                  e,
                  l
                );
                break e;
              }
            }
            throw t = we(s) || s, Error(f(306, t, ""));
          }
        }
        return t;
      case 0:
        return Kc(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return s = t.type, n = Ua(
          s,
          t.pendingProps
        ), bo(
          e,
          t,
          s,
          n,
          l
        );
      case 3:
        e: {
          if (z(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(f(387));
          s = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Sc(e, t), Gs(t, s, null, l);
          var u = t.memoizedState;
          if (s = u.cache, Fl(t, Dt, s), s !== i.cache && gc(
            t,
            [Dt],
            l,
            !0
          ), Ys(), s = u.element, i.isDehydrated)
            if (i = {
              element: s,
              isDehydrated: !1,
              cache: u.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = _o(
                e,
                t,
                s,
                l
              );
              break e;
            } else if (s !== n) {
              n = hl(
                Error(f(424)),
                t
              ), Rs(n), t = _o(
                e,
                t,
                s,
                l
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Et = _l(e.firstChild), $t = t, ut = !0, Ca = null, wl = !0, l = ao(
                t,
                null,
                s,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (As(), s === n) {
              t = Gl(
                e,
                t,
                l
              );
              break e;
            }
            Lt(
              e,
              t,
              s,
              l
            );
          }
          t = t.child;
        }
        return t;
      case 26:
        return si(e, t), e === null ? (l = zf(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : ut || (l = t.type, e = t.pendingProps, s = pi(
          F.current
        ).createElement(l), s[kt] = t, s[At] = e, Qt(s, l, e), Rt(s), t.stateNode = s) : t.memoizedState = zf(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return ke(t), e === null && ut && (s = t.stateNode = Cf(
          t.type,
          t.pendingProps,
          F.current
        ), $t = t, wl = !0, n = Et, fa(t.type) ? (Mu = n, Et = _l(
          s.firstChild
        )) : Et = n), Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), si(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && ut && ((n = s = Et) && (s = cv(
          s,
          t.type,
          t.pendingProps,
          wl
        ), s !== null ? (t.stateNode = s, $t = t, Et = _l(
          s.firstChild
        ), wl = !1, n = !0) : n = !1), n || Ta(t)), ke(t), n = t.type, i = t.pendingProps, u = e !== null ? e.memoizedProps : null, s = i.children, zu(n, i) ? s = null : u !== null && zu(n, u) && (t.flags |= 32), t.memoizedState !== null && (n = Oc(
          e,
          t,
          wm,
          null,
          null,
          l
        ), dn._currentValue = n), si(e, t), Lt(e, t, s, l), t.child;
      case 6:
        return e === null && ut && ((e = l = Et) && (l = uv(
          l,
          t.pendingProps,
          wl
        ), l !== null ? (t.stateNode = l, $t = t, Et = null, e = !0) : e = !1), e || Ta(t)), null;
      case 13:
        return No(e, t, l);
      case 4:
        return z(
          t,
          t.stateNode.containerInfo
        ), s = t.pendingProps, e === null ? t.child = ns(
          t,
          null,
          s,
          l
        ) : Lt(
          e,
          t,
          s,
          l
        ), t.child;
      case 11:
        return vo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return Lt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return s = t.pendingProps, Fl(t, t.type, s.value), Lt(
          e,
          t,
          s.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, s = t.pendingProps.children, za(t), n = Vt(n), s = s(n), t.flags |= 1, Lt(e, t, s, l), t.child;
      case 14:
        return xo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return jo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return wo(e, t, l);
      case 31:
        return s = t.pendingProps, l = t.mode, s = {
          mode: s.mode,
          children: s.children
        }, e === null ? (l = ni(
          s,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Ul(e.child, s), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return go(e, t, l);
      case 24:
        return za(t), s = Vt(Dt), e === null ? (n = bc(), n === null && (n = yt, i = pc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: s,
          cache: n
        }, Nc(t), Fl(t, Dt, n)) : ((e.lanes & l) !== 0 && (Sc(e, t), Gs(t, null, null, l), Ys()), n = e.memoizedState, i = t.memoizedState, n.parent !== s ? (n = { parent: s, cache: s }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Fl(t, Dt, s)) : (s = i.cache, Fl(t, Dt, s), s !== n.cache && gc(
          t,
          [Dt],
          l,
          !0
        ))), Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(f(156, t.tag));
  }
  function Ll(e) {
    e.flags |= 4;
  }
  function Eo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Df(t)) {
      if (t = jl.current, t !== null && ((st & 4194048) === st ? kl !== null : (st & 62914560) !== st && (st & 536870912) === 0 || t !== kl))
        throw Hs = _c, rd;
      e.flags |= 8192;
    }
  }
  function ii(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? d() : 536870912, e.lanes |= t, rs |= t);
  }
  function Ks(e, t) {
    if (!ut)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = e.tail;
          for (var s = null; l !== null; )
            l.alternate !== null && (s = l), l = l.sibling;
          s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
      }
  }
  function St(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, s = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, s |= n.subtreeFlags & 65011712, s |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, s |= n.subtreeFlags, s |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= s, e.childLanes = l, t;
  }
  function Um(e, t, l) {
    var s = t.pendingProps;
    switch (mc(t), t.tag) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return St(t), null;
      case 1:
        return St(t), null;
      case 3:
        return l = t.stateNode, s = null, e !== null && (s = e.memoizedState.cache), t.memoizedState.cache !== s && (t.flags |= 2048), Hl(Dt), ne(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (zs(t) ? Ll(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, sd())), St(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Ll(t), l !== null ? (St(t), Eo(t, l)) : (St(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Ll(t), St(t), Eo(t, l)) : (St(t), t.flags &= -16777217) : (e.memoizedProps !== s && Ll(t), St(t), t.flags &= -16777217), null;
      case 27:
        se(t), l = F.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== s && Ll(t);
        else {
          if (!s) {
            if (t.stateNode === null)
              throw Error(f(166));
            return St(t), null;
          }
          e = P.current, zs(t) ? ld(t) : (e = Cf(n, s, l), t.stateNode = e, Ll(t));
        }
        return St(t), null;
      case 5:
        if (se(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== s && Ll(t);
        else {
          if (!s) {
            if (t.stateNode === null)
              throw Error(f(166));
            return St(t), null;
          }
          if (e = P.current, zs(t))
            ld(t);
          else {
            switch (n = pi(
              F.current
            ), e) {
              case 1:
                e = n.createElementNS(
                  "http://www.w3.org/2000/svg",
                  l
                );
                break;
              case 2:
                e = n.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  l
                );
                break;
              default:
                switch (l) {
                  case "svg":
                    e = n.createElementNS(
                      "http://www.w3.org/2000/svg",
                      l
                    );
                    break;
                  case "math":
                    e = n.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      l
                    );
                    break;
                  case "script":
                    e = n.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild);
                    break;
                  case "select":
                    e = typeof s.is == "string" ? n.createElement("select", { is: s.is }) : n.createElement("select"), s.multiple ? e.multiple = !0 : s.size && (e.size = s.size);
                    break;
                  default:
                    e = typeof s.is == "string" ? n.createElement(l, { is: s.is }) : n.createElement(l);
                }
            }
            e[kt] = t, e[At] = s;
            e: for (n = t.child; n !== null; ) {
              if (n.tag === 5 || n.tag === 6)
                e.appendChild(n.stateNode);
              else if (n.tag !== 4 && n.tag !== 27 && n.child !== null) {
                n.child.return = n, n = n.child;
                continue;
              }
              if (n === t) break e;
              for (; n.sibling === null; ) {
                if (n.return === null || n.return === t)
                  break e;
                n = n.return;
              }
              n.sibling.return = n.return, n = n.sibling;
            }
            t.stateNode = e;
            e: switch (Qt(e, l, s), l) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!s.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && Ll(t);
          }
        }
        return St(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== s && Ll(t);
        else {
          if (typeof s != "string" && t.stateNode === null)
            throw Error(f(166));
          if (e = F.current, zs(t)) {
            if (e = t.stateNode, l = t.memoizedProps, s = null, n = $t, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  s = n.memoizedProps;
              }
            e[kt] = t, e = !!(e.nodeValue === l || s !== null && s.suppressHydrationWarning === !0 || bf(e.nodeValue, l)), e || Ta(t);
          } else
            e = pi(e).createTextNode(
              s
            ), e[kt] = t, t.stateNode = e;
        }
        return St(t), null;
      case 13:
        if (s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = zs(t), s !== null && s.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(f(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(f(317));
              n[kt] = t;
            } else
              As(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            St(t), n = !1;
          } else
            n = sd(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Yl(t), t) : (Yl(t), null);
        }
        if (Yl(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = s !== null, e = e !== null && e.memoizedState !== null, l) {
          s = t.child, n = null, s.alternate !== null && s.alternate.memoizedState !== null && s.alternate.memoizedState.cachePool !== null && (n = s.alternate.memoizedState.cachePool.pool);
          var i = null;
          s.memoizedState !== null && s.memoizedState.cachePool !== null && (i = s.memoizedState.cachePool.pool), i !== n && (s.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), ii(t, t.updateQueue), St(t), null;
      case 4:
        return ne(), e === null && ku(t.stateNode.containerInfo), St(t), null;
      case 10:
        return Hl(t.type), St(t), null;
      case 19:
        if (Y(qt), n = t.memoizedState, n === null) return St(t), null;
        if (s = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (s) Ks(n, !1);
          else {
            if (Ct !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = ti(e), i !== null) {
                  for (t.flags |= 128, Ks(n, !1), e = i.updateQueue, t.updateQueue = e, ii(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    ed(l, e), l = l.sibling;
                  return L(
                    qt,
                    qt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && He() > ri && (t.flags |= 128, s = !0, Ks(n, !1), t.lanes = 4194304);
          }
        else {
          if (!s)
            if (e = ti(i), e !== null) {
              if (t.flags |= 128, s = !0, e = e.updateQueue, t.updateQueue = e, ii(t, e), Ks(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !ut)
                return St(t), null;
            } else
              2 * He() - n.renderingStartTime > ri && l !== 536870912 && (t.flags |= 128, s = !0, Ks(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = He(), t.sibling = null, e = qt.current, L(qt, s ? e & 1 | 2 : e & 1), t) : (St(t), null);
      case 22:
      case 23:
        return Yl(t), Cc(), s = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== s && (t.flags |= 8192) : s && (t.flags |= 8192), s ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (St(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : St(t), l = t.updateQueue, l !== null && ii(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), s = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (s = t.memoizedState.cachePool.pool), s !== l && (t.flags |= 2048), e !== null && Y(Aa), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Hl(Dt), St(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function Mm(e, t) {
    switch (mc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Hl(Dt), ne(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return se(t), null;
      case 13:
        if (Yl(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(f(340));
          As();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Y(qt), null;
      case 4:
        return ne(), null;
      case 10:
        return Hl(t.type), null;
      case 22:
      case 23:
        return Yl(t), Cc(), e !== null && Y(Aa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Hl(Dt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Co(e, t) {
    switch (mc(t), t.tag) {
      case 3:
        Hl(Dt), ne();
        break;
      case 26:
      case 27:
      case 5:
        se(t);
        break;
      case 4:
        ne();
        break;
      case 13:
        Yl(t);
        break;
      case 19:
        Y(qt);
        break;
      case 10:
        Hl(t.type);
        break;
      case 22:
      case 23:
        Yl(t), Cc(), e !== null && Y(Aa);
        break;
      case 24:
        Hl(Dt);
    }
  }
  function $s(e, t) {
    try {
      var l = t.updateQueue, s = l !== null ? l.lastEffect : null;
      if (s !== null) {
        var n = s.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            s = void 0;
            var i = l.create, u = l.inst;
            s = i(), u.destroy = s;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (r) {
      pt(t, t.return, r);
    }
  }
  function sa(e, t, l) {
    try {
      var s = t.updateQueue, n = s !== null ? s.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        s = i;
        do {
          if ((s.tag & e) === e) {
            var u = s.inst, r = u.destroy;
            if (r !== void 0) {
              u.destroy = void 0, n = t;
              var x = l, w = r;
              try {
                w();
              } catch (R) {
                pt(
                  n,
                  x,
                  R
                );
              }
            }
          }
          s = s.next;
        } while (s !== i);
      }
    } catch (R) {
      pt(t, t.return, R);
    }
  }
  function To(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        vd(t, l);
      } catch (s) {
        pt(e, e.return, s);
      }
    }
  }
  function Oo(e, t, l) {
    l.props = Ua(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (s) {
      pt(e, t, s);
    }
  }
  function Ws(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var s = e.stateNode;
            break;
          case 30:
            s = e.stateNode;
            break;
          default:
            s = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(s) : l.current = s;
      }
    } catch (n) {
      pt(e, t, n);
    }
  }
  function El(e, t) {
    var l = e.ref, s = e.refCleanup;
    if (l !== null)
      if (typeof s == "function")
        try {
          s();
        } catch (n) {
          pt(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          pt(e, t, n);
        }
      else l.current = null;
  }
  function zo(e) {
    var t = e.type, l = e.memoizedProps, s = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && s.focus();
          break e;
        case "img":
          l.src ? s.src = l.src : l.srcSet && (s.srcset = l.srcSet);
      }
    } catch (n) {
      pt(e, e.return, n);
    }
  }
  function lu(e, t, l) {
    try {
      var s = e.stateNode;
      lv(s, e.type, l, t), s[At] = t;
    } catch (n) {
      pt(e, e.return, n);
    }
  }
  function Ao(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && fa(e.type) || e.tag === 4;
  }
  function au(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ao(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && fa(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function su(e, t, l) {
    var s = e.tag;
    if (s === 5 || s === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = gi));
    else if (s !== 4 && (s === 27 && fa(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (su(e, t, l), e = e.sibling; e !== null; )
        su(e, t, l), e = e.sibling;
  }
  function ci(e, t, l) {
    var s = e.tag;
    if (s === 5 || s === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (s !== 4 && (s === 27 && fa(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (ci(e, t, l), e = e.sibling; e !== null; )
        ci(e, t, l), e = e.sibling;
  }
  function Ro(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var s = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Qt(t, s, l), t[kt] = e, t[At] = l;
    } catch (i) {
      pt(e, e.return, i);
    }
  }
  var Xl = !1, Ot = !1, nu = !1, Uo = typeof WeakSet == "function" ? WeakSet : Set, Bt = null;
  function Dm(e, t) {
    if (e = e.containerInfo, Tu = wi, e = Qr(e), ac(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var s = l.getSelection && l.getSelection();
          if (s && s.rangeCount !== 0) {
            l = s.anchorNode;
            var n = s.anchorOffset, i = s.focusNode;
            s = s.focusOffset;
            try {
              l.nodeType, i.nodeType;
            } catch {
              l = null;
              break e;
            }
            var u = 0, r = -1, x = -1, w = 0, R = 0, B = e, k = null;
            t: for (; ; ) {
              for (var C; B !== l || n !== 0 && B.nodeType !== 3 || (r = u + n), B !== i || s !== 0 && B.nodeType !== 3 || (x = u + s), B.nodeType === 3 && (u += B.nodeValue.length), (C = B.firstChild) !== null; )
                k = B, B = C;
              for (; ; ) {
                if (B === e) break t;
                if (k === l && ++w === n && (r = u), k === i && ++R === s && (x = u), (C = B.nextSibling) !== null) break;
                B = k, k = B.parentNode;
              }
              B = C;
            }
            l = r === -1 || x === -1 ? null : { start: r, end: x };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Ou = { focusedElem: e, selectionRange: l }, wi = !1, Bt = t; Bt !== null; )
      if (t = Bt, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, Bt = e;
      else
        for (; Bt !== null; ) {
          switch (t = Bt, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, s = l.stateNode;
                try {
                  var Ae = Ua(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = s.getSnapshotBeforeUpdate(
                    Ae,
                    i
                  ), s.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Te) {
                  pt(
                    l,
                    l.return,
                    Te
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Ru(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Ru(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(f(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Bt = e;
            break;
          }
          Bt = t.return;
        }
  }
  function Mo(e, t, l) {
    var s = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        na(e, l), s & 4 && $s(5, l);
        break;
      case 1:
        if (na(e, l), s & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (u) {
              pt(l, l.return, u);
            }
          else {
            var n = Ua(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (u) {
              pt(
                l,
                l.return,
                u
              );
            }
          }
        s & 64 && To(l), s & 512 && Ws(l, l.return);
        break;
      case 3:
        if (na(e, l), s & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            vd(e, t);
          } catch (u) {
            pt(l, l.return, u);
          }
        }
        break;
      case 27:
        t === null && s & 4 && Ro(l);
      case 26:
      case 5:
        na(e, l), t === null && s & 4 && zo(l), s & 512 && Ws(l, l.return);
        break;
      case 12:
        na(e, l);
        break;
      case 13:
        na(e, l), s & 4 && Ho(e, l), s & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Zm.bind(
          null,
          l
        ), rv(e, l))));
        break;
      case 22:
        if (s = l.memoizedState !== null || Xl, !s) {
          t = t !== null && t.memoizedState !== null || Ot, n = Xl;
          var i = Ot;
          Xl = s, (Ot = t) && !i ? ia(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : na(e, l), Xl = n, Ot = i;
        }
        break;
      case 30:
        break;
      default:
        na(e, l);
    }
  }
  function Do(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Do(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Gt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var _t = null, Pt = !1;
  function Ql(e, t, l) {
    for (l = l.child; l !== null; )
      qo(e, t, l), l = l.sibling;
  }
  function qo(e, t, l) {
    if (Le && typeof Le.onCommitFiberUnmount == "function")
      try {
        Le.onCommitFiberUnmount(ct, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ot || El(l, t), Ql(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ot || El(l, t);
        var s = _t, n = Pt;
        fa(l.type) && (_t = l.stateNode, Pt = !1), Ql(
          e,
          t,
          l
        ), nn(l.stateNode), _t = s, Pt = n;
        break;
      case 5:
        Ot || El(l, t);
      case 6:
        if (s = _t, n = Pt, _t = null, Ql(
          e,
          t,
          l
        ), _t = s, Pt = n, _t !== null)
          if (Pt)
            try {
              (_t.nodeType === 9 ? _t.body : _t.nodeName === "HTML" ? _t.ownerDocument.body : _t).removeChild(l.stateNode);
            } catch (i) {
              pt(
                l,
                t,
                i
              );
            }
          else
            try {
              _t.removeChild(l.stateNode);
            } catch (i) {
              pt(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        _t !== null && (Pt ? (e = _t, kf(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), mn(e)) : kf(_t, l.stateNode));
        break;
      case 4:
        s = _t, n = Pt, _t = l.stateNode.containerInfo, Pt = !0, Ql(
          e,
          t,
          l
        ), _t = s, Pt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ot || sa(2, l, t), Ot || sa(4, l, t), Ql(
          e,
          t,
          l
        );
        break;
      case 1:
        Ot || (El(l, t), s = l.stateNode, typeof s.componentWillUnmount == "function" && Oo(
          l,
          t,
          s
        )), Ql(
          e,
          t,
          l
        );
        break;
      case 21:
        Ql(
          e,
          t,
          l
        );
        break;
      case 22:
        Ot = (s = Ot) || l.memoizedState !== null, Ql(
          e,
          t,
          l
        ), Ot = s;
        break;
      default:
        Ql(
          e,
          t,
          l
        );
    }
  }
  function Ho(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        mn(e);
      } catch (l) {
        pt(t, t.return, l);
      }
  }
  function qm(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Uo()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Uo()), t;
      default:
        throw Error(f(435, e.tag));
    }
  }
  function iu(e, t) {
    var l = qm(e);
    t.forEach(function(s) {
      var n = Vm.bind(null, e, s);
      l.has(s) || (l.add(s), s.then(n, n));
    });
  }
  function sl(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var s = 0; s < l.length; s++) {
        var n = l[s], i = e, u = t, r = u;
        e: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (fa(r.type)) {
                _t = r.stateNode, Pt = !1;
                break e;
              }
              break;
            case 5:
              _t = r.stateNode, Pt = !1;
              break e;
            case 3:
            case 4:
              _t = r.stateNode.containerInfo, Pt = !0;
              break e;
          }
          r = r.return;
        }
        if (_t === null) throw Error(f(160));
        qo(i, u, n), _t = null, Pt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Bo(t, e), t = t.sibling;
  }
  var bl = null;
  function Bo(e, t) {
    var l = e.alternate, s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        sl(t, e), nl(e), s & 4 && (sa(3, e, e.return), $s(3, e), sa(5, e, e.return));
        break;
      case 1:
        sl(t, e), nl(e), s & 512 && (Ot || l === null || El(l, l.return)), s & 64 && Xl && (e = e.updateQueue, e !== null && (s = e.callbacks, s !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? s : l.concat(s))));
        break;
      case 26:
        var n = bl;
        if (sl(t, e), nl(e), s & 512 && (Ot || l === null || El(l, l.return)), s & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (s = e.memoizedState, l === null)
            if (s === null)
              if (e.stateNode === null) {
                e: {
                  s = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (s) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[gt] || i[kt] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(s), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), Qt(i, s, l), i[kt] = e, Rt(i), s = i;
                      break e;
                    case "link":
                      var u = Uf(
                        "link",
                        "href",
                        n
                      ).get(s + (l.href || ""));
                      if (u) {
                        for (var r = 0; r < u.length; r++)
                          if (i = u[r], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            u.splice(r, 1);
                            break t;
                          }
                      }
                      i = n.createElement(s), Qt(i, s, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (u = Uf(
                        "meta",
                        "content",
                        n
                      ).get(s + (l.content || ""))) {
                        for (r = 0; r < u.length; r++)
                          if (i = u[r], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            u.splice(r, 1);
                            break t;
                          }
                      }
                      i = n.createElement(s), Qt(i, s, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(f(468, s));
                  }
                  i[kt] = e, Rt(i), s = i;
                }
                e.stateNode = s;
              } else
                Mf(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Rf(
                n,
                s,
                e.memoizedProps
              );
          else
            i !== s ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, s === null ? Mf(
              n,
              e.type,
              e.stateNode
            ) : Rf(
              n,
              s,
              e.memoizedProps
            )) : s === null && e.stateNode !== null && lu(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        sl(t, e), nl(e), s & 512 && (Ot || l === null || El(l, l.return)), l !== null && s & 4 && lu(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (sl(t, e), nl(e), s & 512 && (Ot || l === null || El(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Ga(n, "");
          } catch (C) {
            pt(e, e.return, C);
          }
        }
        s & 4 && e.stateNode != null && (n = e.memoizedProps, lu(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), s & 1024 && (nu = !0);
        break;
      case 6:
        if (sl(t, e), nl(e), s & 4) {
          if (e.stateNode === null)
            throw Error(f(162));
          s = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = s;
          } catch (C) {
            pt(e, e.return, C);
          }
        }
        break;
      case 3:
        if (_i = null, n = bl, bl = yi(t.containerInfo), sl(t, e), bl = n, nl(e), s & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            mn(t.containerInfo);
          } catch (C) {
            pt(e, e.return, C);
          }
        nu && (nu = !1, Yo(e));
        break;
      case 4:
        s = bl, bl = yi(
          e.stateNode.containerInfo
        ), sl(t, e), nl(e), bl = s;
        break;
      case 12:
        sl(t, e), nl(e);
        break;
      case 13:
        sl(t, e), nl(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (fu = He()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, iu(e, s)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var x = l !== null && l.memoizedState !== null, w = Xl, R = Ot;
        if (Xl = w || n, Ot = R || x, sl(t, e), Ot = R, Xl = w, nl(e), s & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || x || Xl || Ot || Ma(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                x = l = t;
                try {
                  if (i = x.stateNode, n)
                    u = i.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none";
                  else {
                    r = x.stateNode;
                    var B = x.memoizedProps.style, k = B != null && B.hasOwnProperty("display") ? B.display : null;
                    r.style.display = k == null || typeof k == "boolean" ? "" : ("" + k).trim();
                  }
                } catch (C) {
                  pt(x, x.return, C);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                x = t;
                try {
                  x.stateNode.nodeValue = n ? "" : x.memoizedProps;
                } catch (C) {
                  pt(x, x.return, C);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              l === t && (l = null), t = t.return;
            }
            l === t && (l = null), t.sibling.return = t.return, t = t.sibling;
          }
        s & 4 && (s = e.updateQueue, s !== null && (l = s.retryQueue, l !== null && (s.retryQueue = null, iu(e, l))));
        break;
      case 19:
        sl(t, e), nl(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, iu(e, s)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        sl(t, e), nl(e);
    }
  }
  function nl(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, s = e.return; s !== null; ) {
          if (Ao(s)) {
            l = s;
            break;
          }
          s = s.return;
        }
        if (l == null) throw Error(f(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = au(e);
            ci(e, i, n);
            break;
          case 5:
            var u = l.stateNode;
            l.flags & 32 && (Ga(u, ""), l.flags &= -33);
            var r = au(e);
            ci(e, r, u);
            break;
          case 3:
          case 4:
            var x = l.stateNode.containerInfo, w = au(e);
            su(
              e,
              w,
              x
            );
            break;
          default:
            throw Error(f(161));
        }
      } catch (R) {
        pt(e, e.return, R);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Yo(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Yo(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function na(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Mo(e, t.alternate, t), t = t.sibling;
  }
  function Ma(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          sa(4, t, t.return), Ma(t);
          break;
        case 1:
          El(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && Oo(
            t,
            t.return,
            l
          ), Ma(t);
          break;
        case 27:
          nn(t.stateNode);
        case 26:
        case 5:
          El(t, t.return), Ma(t);
          break;
        case 22:
          t.memoizedState === null && Ma(t);
          break;
        case 30:
          Ma(t);
          break;
        default:
          Ma(t);
      }
      e = e.sibling;
    }
  }
  function ia(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var s = t.alternate, n = e, i = t, u = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ia(
            n,
            i,
            l
          ), $s(4, i);
          break;
        case 1:
          if (ia(
            n,
            i,
            l
          ), s = i, n = s.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (w) {
              pt(s, s.return, w);
            }
          if (s = i, n = s.updateQueue, n !== null) {
            var r = s.stateNode;
            try {
              var x = n.shared.hiddenCallbacks;
              if (x !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < x.length; n++)
                  md(x[n], r);
            } catch (w) {
              pt(s, s.return, w);
            }
          }
          l && u & 64 && To(i), Ws(i, i.return);
          break;
        case 27:
          Ro(i);
        case 26:
        case 5:
          ia(
            n,
            i,
            l
          ), l && s === null && u & 4 && zo(i), Ws(i, i.return);
          break;
        case 12:
          ia(
            n,
            i,
            l
          );
          break;
        case 13:
          ia(
            n,
            i,
            l
          ), l && u & 4 && Ho(n, i);
          break;
        case 22:
          i.memoizedState === null && ia(
            n,
            i,
            l
          ), Ws(i, i.return);
          break;
        case 30:
          break;
        default:
          ia(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function cu(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Ms(l));
  }
  function uu(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ms(e));
  }
  function Cl(e, t, l, s) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Go(
          e,
          t,
          l,
          s
        ), t = t.sibling;
  }
  function Go(e, t, l, s) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Cl(
          e,
          t,
          l,
          s
        ), n & 2048 && $s(9, t);
        break;
      case 1:
        Cl(
          e,
          t,
          l,
          s
        );
        break;
      case 3:
        Cl(
          e,
          t,
          l,
          s
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ms(e)));
        break;
      case 12:
        if (n & 2048) {
          Cl(
            e,
            t,
            l,
            s
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, u = i.id, r = i.onPostCommit;
            typeof r == "function" && r(
              u,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (x) {
            pt(t, t.return, x);
          }
        } else
          Cl(
            e,
            t,
            l,
            s
          );
        break;
      case 13:
        Cl(
          e,
          t,
          l,
          s
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, u = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Cl(
          e,
          t,
          l,
          s
        ) : Fs(e, t) : i._visibility & 2 ? Cl(
          e,
          t,
          l,
          s
        ) : (i._visibility |= 2, is(
          e,
          t,
          l,
          s,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && cu(u, t);
        break;
      case 24:
        Cl(
          e,
          t,
          l,
          s
        ), n & 2048 && uu(t.alternate, t);
        break;
      default:
        Cl(
          e,
          t,
          l,
          s
        );
    }
  }
  function is(e, t, l, s, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, u = t, r = l, x = s, w = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          is(
            i,
            u,
            r,
            x,
            n
          ), $s(8, u);
          break;
        case 23:
          break;
        case 22:
          var R = u.stateNode;
          u.memoizedState !== null ? R._visibility & 2 ? is(
            i,
            u,
            r,
            x,
            n
          ) : Fs(
            i,
            u
          ) : (R._visibility |= 2, is(
            i,
            u,
            r,
            x,
            n
          )), n && w & 2048 && cu(
            u.alternate,
            u
          );
          break;
        case 24:
          is(
            i,
            u,
            r,
            x,
            n
          ), n && w & 2048 && uu(u.alternate, u);
          break;
        default:
          is(
            i,
            u,
            r,
            x,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Fs(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, s = t, n = s.flags;
        switch (s.tag) {
          case 22:
            Fs(l, s), n & 2048 && cu(
              s.alternate,
              s
            );
            break;
          case 24:
            Fs(l, s), n & 2048 && uu(s.alternate, s);
            break;
          default:
            Fs(l, s);
        }
        t = t.sibling;
      }
  }
  var Is = 8192;
  function cs(e) {
    if (e.subtreeFlags & Is)
      for (e = e.child; e !== null; )
        Lo(e), e = e.sibling;
  }
  function Lo(e) {
    switch (e.tag) {
      case 26:
        cs(e), e.flags & Is && e.memoizedState !== null && _v(
          bl,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        cs(e);
        break;
      case 3:
      case 4:
        var t = bl;
        bl = yi(e.stateNode.containerInfo), cs(e), bl = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = Is, Is = 16777216, cs(e), Is = t) : cs(e));
        break;
      default:
        cs(e);
    }
  }
  function Xo(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Ps(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var s = t[l];
          Bt = s, Zo(
            s,
            e
          );
        }
      Xo(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Qo(e), e = e.sibling;
  }
  function Qo(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ps(e), e.flags & 2048 && sa(9, e, e.return);
        break;
      case 3:
        Ps(e);
        break;
      case 12:
        Ps(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ui(e)) : Ps(e);
        break;
      default:
        Ps(e);
    }
  }
  function ui(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var s = t[l];
          Bt = s, Zo(
            s,
            e
          );
        }
      Xo(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          sa(8, t, t.return), ui(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, ui(t));
          break;
        default:
          ui(t);
      }
      e = e.sibling;
    }
  }
  function Zo(e, t) {
    for (; Bt !== null; ) {
      var l = Bt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          sa(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var s = l.memoizedState.cachePool.pool;
            s != null && s.refCount++;
          }
          break;
        case 24:
          Ms(l.memoizedState.cache);
      }
      if (s = l.child, s !== null) s.return = l, Bt = s;
      else
        e: for (l = e; Bt !== null; ) {
          s = Bt;
          var n = s.sibling, i = s.return;
          if (Do(s), s === l) {
            Bt = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Bt = n;
            break e;
          }
          Bt = i;
        }
    }
  }
  var Hm = {
    getCacheForType: function(e) {
      var t = Vt(Dt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, Bm = typeof WeakMap == "function" ? WeakMap : Map, ft = 0, yt = null, $e = null, st = 0, ht = 0, il = null, ca = !1, us = !1, ru = !1, Zl = 0, Ct = 0, ua = 0, Da = 0, du = 0, gl = 0, rs = 0, en = null, el = null, ou = !1, fu = 0, ri = 1 / 0, di = null, ra = null, Xt = 0, da = null, ds = null, os = 0, hu = 0, mu = null, Vo = null, tn = 0, vu = null;
  function cl() {
    if ((ft & 2) !== 0 && st !== 0)
      return st & -st;
    if (b.T !== null) {
      var e = Ia;
      return e !== 0 ? e : _u();
    }
    return Wt();
  }
  function Jo() {
    gl === 0 && (gl = (st & 536870912) === 0 || ut ? Ke() : 536870912);
    var e = jl.current;
    return e !== null && (e.flags |= 32), gl;
  }
  function ul(e, t, l) {
    (e === yt && (ht === 2 || ht === 9) || e.cancelPendingCommit !== null) && (fs(e, 0), oa(
      e,
      st,
      gl,
      !1
    )), A(e, l), ((ft & 2) === 0 || e !== yt) && (e === yt && ((ft & 2) === 0 && (Da |= l), Ct === 4 && oa(
      e,
      st,
      gl,
      !1
    )), Tl(e));
  }
  function Ko(e, t, l) {
    if ((ft & 6) !== 0) throw Error(f(327));
    var s = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || ee(e, t), n = s ? Lm(e, t) : gu(e, t, !0), i = s;
    do {
      if (n === 0) {
        us && !s && oa(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !Ym(l)) {
          n = gu(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var u = 0;
          else
            u = e.pendingLanes & -536870913, u = u !== 0 ? u : u & 536870912 ? 536870912 : 0;
          if (u !== 0) {
            t = u;
            e: {
              var r = e;
              n = en;
              var x = r.current.memoizedState.isDehydrated;
              if (x && (fs(r, u).flags |= 256), u = gu(
                r,
                u,
                !1
              ), u !== 2) {
                if (ru && !x) {
                  r.errorRecoveryDisabledLanes |= i, Da |= i, n = 4;
                  break e;
                }
                i = el, el = n, i !== null && (el === null ? el = i : el.push.apply(
                  el,
                  i
                ));
              }
              n = u;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          fs(e, 0), oa(e, t, 0, !0);
          break;
        }
        e: {
          switch (s = e, i = n, i) {
            case 0:
            case 1:
              throw Error(f(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              oa(
                s,
                t,
                gl,
                !ca
              );
              break e;
            case 2:
              el = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(f(329));
          }
          if ((t & 62914560) === t && (n = fu + 300 - He(), 10 < n)) {
            if (oa(
              s,
              t,
              gl,
              !ca
            ), ie(s, 0, !0) !== 0) break e;
            s.timeoutHandle = Sf(
              $o.bind(
                null,
                s,
                l,
                el,
                di,
                ou,
                t,
                gl,
                Da,
                rs,
                ca,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          $o(
            s,
            l,
            el,
            di,
            ou,
            t,
            gl,
            Da,
            rs,
            ca,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Tl(e);
  }
  function $o(e, t, l, s, n, i, u, r, x, w, R, B, k, C) {
    if (e.timeoutHandle = -1, B = t.subtreeFlags, (B & 8192 || (B & 16785408) === 16785408) && (rn = { stylesheets: null, count: 0, unsuspend: bv }, Lo(t), B = Nv(), B !== null)) {
      e.cancelPendingCommit = B(
        lf.bind(
          null,
          e,
          t,
          i,
          l,
          s,
          n,
          u,
          r,
          x,
          R,
          1,
          k,
          C
        )
      ), oa(e, i, u, !w);
      return;
    }
    lf(
      e,
      t,
      i,
      l,
      s,
      n,
      u,
      r,
      x
    );
  }
  function Ym(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var s = 0; s < l.length; s++) {
          var n = l[s], i = n.getSnapshot;
          n = n.value;
          try {
            if (!ll(i(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function oa(e, t, l, s) {
    t &= ~du, t &= ~Da, e.suspendedLanes |= t, e.pingedLanes &= ~t, s && (e.warmLanes |= t), s = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - _(n), u = 1 << i;
      s[i] = -1, n &= ~u;
    }
    l !== 0 && Be(e, l, t);
  }
  function oi() {
    return (ft & 6) === 0 ? (ln(0), !1) : !0;
  }
  function xu() {
    if ($e !== null) {
      if (ht === 0)
        var e = $e.return;
      else
        e = $e, ql = Oa = null, Rc(e), ss = null, Vs = 0, e = $e;
      for (; e !== null; )
        Co(e.alternate, e), e = e.return;
      $e = null;
    }
  }
  function fs(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, sv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), xu(), yt = e, $e = l = Ul(e.current, null), st = t, ht = 0, il = null, ca = !1, us = ee(e, t), ru = !1, rs = gl = du = Da = ua = Ct = 0, el = en = null, ou = !1, (t & 8) !== 0 && (t |= t & 32);
    var s = e.entangledLanes;
    if (s !== 0)
      for (e = e.entanglements, s &= t; 0 < s; ) {
        var n = 31 - _(s), i = 1 << n;
        t |= e[n], s &= ~i;
      }
    return Zl = t, Rn(), l;
  }
  function Wo(e, t) {
    Xe = null, b.H = In, t === qs || t === Ln ? (t = fd(), ht = 3) : t === rd ? (t = fd(), ht = 4) : ht = t === mo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, il = t, $e === null && (Ct = 1, ai(
      e,
      hl(t, e.current)
    ));
  }
  function Fo() {
    var e = b.H;
    return b.H = In, e === null ? In : e;
  }
  function Io() {
    var e = b.A;
    return b.A = Hm, e;
  }
  function ju() {
    Ct = 4, ca || (st & 4194048) !== st && jl.current !== null || (us = !0), (ua & 134217727) === 0 && (Da & 134217727) === 0 || yt === null || oa(
      yt,
      st,
      gl,
      !1
    );
  }
  function gu(e, t, l) {
    var s = ft;
    ft |= 2;
    var n = Fo(), i = Io();
    (yt !== e || st !== t) && (di = null, fs(e, t)), t = !1;
    var u = Ct;
    e: do
      try {
        if (ht !== 0 && $e !== null) {
          var r = $e, x = il;
          switch (ht) {
            case 8:
              xu(), u = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              jl.current === null && (t = !0);
              var w = ht;
              if (ht = 0, il = null, hs(e, r, x, w), l && us) {
                u = 0;
                break e;
              }
              break;
            default:
              w = ht, ht = 0, il = null, hs(e, r, x, w);
          }
        }
        Gm(), u = Ct;
        break;
      } catch (R) {
        Wo(e, R);
      }
    while (!0);
    return t && e.shellSuspendCounter++, ql = Oa = null, ft = s, b.H = n, b.A = i, $e === null && (yt = null, st = 0, Rn()), u;
  }
  function Gm() {
    for (; $e !== null; ) Po($e);
  }
  function Lm(e, t) {
    var l = ft;
    ft |= 2;
    var s = Fo(), n = Io();
    yt !== e || st !== t ? (di = null, ri = He() + 500, fs(e, t)) : us = ee(
      e,
      t
    );
    e: do
      try {
        if (ht !== 0 && $e !== null) {
          t = $e;
          var i = il;
          t: switch (ht) {
            case 1:
              ht = 0, il = null, hs(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (dd(i)) {
                ht = 0, il = null, ef(t);
                break;
              }
              t = function() {
                ht !== 2 && ht !== 9 || yt !== e || (ht = 7), Tl(e);
              }, i.then(t, t);
              break e;
            case 3:
              ht = 7;
              break e;
            case 4:
              ht = 5;
              break e;
            case 7:
              dd(i) ? (ht = 0, il = null, ef(t)) : (ht = 0, il = null, hs(e, t, i, 7));
              break;
            case 5:
              var u = null;
              switch ($e.tag) {
                case 26:
                  u = $e.memoizedState;
                case 5:
                case 27:
                  var r = $e;
                  if (!u || Df(u)) {
                    ht = 0, il = null;
                    var x = r.sibling;
                    if (x !== null) $e = x;
                    else {
                      var w = r.return;
                      w !== null ? ($e = w, fi(w)) : $e = null;
                    }
                    break t;
                  }
              }
              ht = 0, il = null, hs(e, t, i, 5);
              break;
            case 6:
              ht = 0, il = null, hs(e, t, i, 6);
              break;
            case 8:
              xu(), Ct = 6;
              break e;
            default:
              throw Error(f(462));
          }
        }
        Xm();
        break;
      } catch (R) {
        Wo(e, R);
      }
    while (!0);
    return ql = Oa = null, b.H = s, b.A = n, ft = l, $e !== null ? 0 : (yt = null, st = 0, Rn(), Ct);
  }
  function Xm() {
    for (; $e !== null && !mt(); )
      Po($e);
  }
  function Po(e) {
    var t = ko(e.alternate, e, Zl);
    e.memoizedProps = e.pendingProps, t === null ? fi(e) : $e = t;
  }
  function ef(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = yo(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          st
        );
        break;
      case 11:
        t = yo(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          st
        );
        break;
      case 5:
        Rc(t);
      default:
        Co(l, t), t = $e = ed(t, Zl), t = ko(l, t, Zl);
    }
    e.memoizedProps = e.pendingProps, t === null ? fi(e) : $e = t;
  }
  function hs(e, t, l, s) {
    ql = Oa = null, Rc(t), ss = null, Vs = 0;
    var n = t.return;
    try {
      if (Am(
        e,
        n,
        t,
        l,
        st
      )) {
        Ct = 1, ai(
          e,
          hl(l, e.current)
        ), $e = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw $e = n, i;
      Ct = 1, ai(
        e,
        hl(l, e.current)
      ), $e = null;
      return;
    }
    t.flags & 32768 ? (ut || s === 1 ? e = !0 : us || (st & 536870912) !== 0 ? e = !1 : (ca = e = !0, (s === 2 || s === 9 || s === 3 || s === 6) && (s = jl.current, s !== null && s.tag === 13 && (s.flags |= 16384))), tf(t, e)) : fi(t);
  }
  function fi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        tf(
          t,
          ca
        );
        return;
      }
      e = t.return;
      var l = Um(
        t.alternate,
        t,
        Zl
      );
      if (l !== null) {
        $e = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        $e = t;
        return;
      }
      $e = t = e;
    } while (t !== null);
    Ct === 0 && (Ct = 5);
  }
  function tf(e, t) {
    do {
      var l = Mm(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, $e = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        $e = e;
        return;
      }
      $e = e = l;
    } while (e !== null);
    Ct = 6, $e = null;
  }
  function lf(e, t, l, s, n, i, u, r, x) {
    e.cancelPendingCommit = null;
    do
      hi();
    while (Xt !== 0);
    if ((ft & 6) !== 0) throw Error(f(327));
    if (t !== null) {
      if (t === e.current) throw Error(f(177));
      if (i = t.lanes | t.childLanes, i |= uc, J(
        e,
        l,
        i,
        u,
        r,
        x
      ), e === yt && ($e = yt = null, st = 0), ds = t, da = e, os = l, hu = i, mu = n, Vo = s, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Jm(te, function() {
        return uf(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), s = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || s) {
        s = b.T, b.T = null, n = U.p, U.p = 2, u = ft, ft |= 4;
        try {
          Dm(e, t, l);
        } finally {
          ft = u, U.p = n, b.T = s;
        }
      }
      Xt = 1, af(), sf(), nf();
    }
  }
  function af() {
    if (Xt === 1) {
      Xt = 0;
      var e = da, t = ds, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = b.T, b.T = null;
        var s = U.p;
        U.p = 2;
        var n = ft;
        ft |= 4;
        try {
          Bo(t, e);
          var i = Ou, u = Qr(e.containerInfo), r = i.focusedElem, x = i.selectionRange;
          if (u !== r && r && r.ownerDocument && Xr(
            r.ownerDocument.documentElement,
            r
          )) {
            if (x !== null && ac(r)) {
              var w = x.start, R = x.end;
              if (R === void 0 && (R = w), "selectionStart" in r)
                r.selectionStart = w, r.selectionEnd = Math.min(
                  R,
                  r.value.length
                );
              else {
                var B = r.ownerDocument || document, k = B && B.defaultView || window;
                if (k.getSelection) {
                  var C = k.getSelection(), Ae = r.textContent.length, Te = Math.min(x.start, Ae), jt = x.end === void 0 ? Te : Math.min(x.end, Ae);
                  !C.extend && Te > jt && (u = jt, jt = Te, Te = u);
                  var y = Lr(
                    r,
                    Te
                  ), g = Lr(
                    r,
                    jt
                  );
                  if (y && g && (C.rangeCount !== 1 || C.anchorNode !== y.node || C.anchorOffset !== y.offset || C.focusNode !== g.node || C.focusOffset !== g.offset)) {
                    var S = B.createRange();
                    S.setStart(y.node, y.offset), C.removeAllRanges(), Te > jt ? (C.addRange(S), C.extend(g.node, g.offset)) : (S.setEnd(g.node, g.offset), C.addRange(S));
                  }
                }
              }
            }
            for (B = [], C = r; C = C.parentNode; )
              C.nodeType === 1 && B.push({
                element: C,
                left: C.scrollLeft,
                top: C.scrollTop
              });
            for (typeof r.focus == "function" && r.focus(), r = 0; r < B.length; r++) {
              var M = B[r];
              M.element.scrollLeft = M.left, M.element.scrollTop = M.top;
            }
          }
          wi = !!Tu, Ou = Tu = null;
        } finally {
          ft = n, U.p = s, b.T = l;
        }
      }
      e.current = t, Xt = 2;
    }
  }
  function sf() {
    if (Xt === 2) {
      Xt = 0;
      var e = da, t = ds, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = b.T, b.T = null;
        var s = U.p;
        U.p = 2;
        var n = ft;
        ft |= 4;
        try {
          Mo(e, t.alternate, t);
        } finally {
          ft = n, U.p = s, b.T = l;
        }
      }
      Xt = 3;
    }
  }
  function nf() {
    if (Xt === 4 || Xt === 3) {
      Xt = 0, rt();
      var e = da, t = ds, l = os, s = Vo;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Xt = 5 : (Xt = 0, ds = da = null, cf(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (ra = null), zt(l), t = t.stateNode, Le && typeof Le.onCommitFiberRoot == "function")
        try {
          Le.onCommitFiberRoot(
            ct,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (s !== null) {
        t = b.T, n = U.p, U.p = 2, b.T = null;
        try {
          for (var i = e.onRecoverableError, u = 0; u < s.length; u++) {
            var r = s[u];
            i(r.value, {
              componentStack: r.stack
            });
          }
        } finally {
          b.T = t, U.p = n;
        }
      }
      (os & 3) !== 0 && hi(), Tl(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === vu ? tn++ : (tn = 0, vu = e) : tn = 0, ln(0);
    }
  }
  function cf(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ms(t)));
  }
  function hi(e) {
    return af(), sf(), nf(), uf();
  }
  function uf() {
    if (Xt !== 5) return !1;
    var e = da, t = hu;
    hu = 0;
    var l = zt(os), s = b.T, n = U.p;
    try {
      U.p = 32 > l ? 32 : l, b.T = null, l = mu, mu = null;
      var i = da, u = os;
      if (Xt = 0, ds = da = null, os = 0, (ft & 6) !== 0) throw Error(f(331));
      var r = ft;
      if (ft |= 4, Qo(i.current), Go(
        i,
        i.current,
        u,
        l
      ), ft = r, ln(0, !1), Le && typeof Le.onPostCommitFiberRoot == "function")
        try {
          Le.onPostCommitFiberRoot(ct, i);
        } catch {
        }
      return !0;
    } finally {
      U.p = n, b.T = s, cf(e, t);
    }
  }
  function rf(e, t, l) {
    t = hl(l, t), t = Jc(e.stateNode, t, 2), e = ea(e, t, 2), e !== null && (A(e, 2), Tl(e));
  }
  function pt(e, t, l) {
    if (e.tag === 3)
      rf(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          rf(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var s = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (ra === null || !ra.has(s))) {
            e = hl(l, e), l = fo(2), s = ea(t, l, 2), s !== null && (ho(
              l,
              s,
              t,
              e
            ), A(s, 2), Tl(s));
            break;
          }
        }
        t = t.return;
      }
  }
  function pu(e, t, l) {
    var s = e.pingCache;
    if (s === null) {
      s = e.pingCache = new Bm();
      var n = /* @__PURE__ */ new Set();
      s.set(t, n);
    } else
      n = s.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), s.set(t, n));
    n.has(l) || (ru = !0, n.add(l), e = Qm.bind(null, e, t, l), t.then(e, e));
  }
  function Qm(e, t, l) {
    var s = e.pingCache;
    s !== null && s.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, yt === e && (st & l) === l && (Ct === 4 || Ct === 3 && (st & 62914560) === st && 300 > He() - fu ? (ft & 2) === 0 && fs(e, 0) : du |= l, rs === st && (rs = 0)), Tl(e);
  }
  function df(e, t) {
    t === 0 && (t = d()), e = Ka(e, t), e !== null && (A(e, t), Tl(e));
  }
  function Zm(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), df(e, l);
  }
  function Vm(e, t) {
    var l = 0;
    switch (e.tag) {
      case 13:
        var s = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        s = e.stateNode;
        break;
      case 22:
        s = e.stateNode._retryCache;
        break;
      default:
        throw Error(f(314));
    }
    s !== null && s.delete(t), df(e, l);
  }
  function Jm(e, t) {
    return qe(e, t);
  }
  var mi = null, ms = null, yu = !1, vi = !1, bu = !1, qa = 0;
  function Tl(e) {
    e !== ms && e.next === null && (ms === null ? mi = ms = e : ms = ms.next = e), vi = !0, yu || (yu = !0, $m());
  }
  function ln(e, t) {
    if (!bu && vi) {
      bu = !0;
      do
        for (var l = !1, s = mi; s !== null; ) {
          if (e !== 0) {
            var n = s.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var u = s.suspendedLanes, r = s.pingedLanes;
              i = (1 << 31 - _(42 | e) + 1) - 1, i &= n & ~(u & ~r), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, mf(s, i));
          } else
            i = st, i = ie(
              s,
              s === yt ? i : 0,
              s.cancelPendingCommit !== null || s.timeoutHandle !== -1
            ), (i & 3) === 0 || ee(s, i) || (l = !0, mf(s, i));
          s = s.next;
        }
      while (l);
      bu = !1;
    }
  }
  function Km() {
    of();
  }
  function of() {
    vi = yu = !1;
    var e = 0;
    qa !== 0 && (av() && (e = qa), qa = 0);
    for (var t = He(), l = null, s = mi; s !== null; ) {
      var n = s.next, i = ff(s, t);
      i === 0 ? (s.next = null, l === null ? mi = n : l.next = n, n === null && (ms = l)) : (l = s, (e !== 0 || (i & 3) !== 0) && (vi = !0)), s = n;
    }
    ln(e);
  }
  function ff(e, t) {
    for (var l = e.suspendedLanes, s = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var u = 31 - _(i), r = 1 << u, x = n[u];
      x === -1 ? ((r & l) === 0 || (r & s) !== 0) && (n[u] = lt(r, t)) : x <= t && (e.expiredLanes |= r), i &= ~r;
    }
    if (t = yt, l = st, l = ie(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), s = e.callbackNode, l === 0 || e === t && (ht === 2 || ht === 9) || e.cancelPendingCommit !== null)
      return s !== null && s !== null && Fe(s), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || ee(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (s !== null && Fe(s), zt(l)) {
        case 2:
        case 8:
          l = Ie;
          break;
        case 32:
          l = te;
          break;
        case 268435456:
          l = be;
          break;
        default:
          l = te;
      }
      return s = hf.bind(null, e), l = qe(l, s), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return s !== null && s !== null && Fe(s), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function hf(e, t) {
    if (Xt !== 0 && Xt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (hi() && e.callbackNode !== l)
      return null;
    var s = st;
    return s = ie(
      e,
      e === yt ? s : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), s === 0 ? null : (Ko(e, s, t), ff(e, He()), e.callbackNode != null && e.callbackNode === l ? hf.bind(null, e) : null);
  }
  function mf(e, t) {
    if (hi()) return null;
    Ko(e, t, !0);
  }
  function $m() {
    nv(function() {
      (ft & 6) !== 0 ? qe(
        Ze,
        Km
      ) : of();
    });
  }
  function _u() {
    return qa === 0 && (qa = Ke()), qa;
  }
  function vf(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : kn("" + e);
  }
  function xf(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Wm(e, t, l, s, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = vf(
        (n[At] || null).action
      ), u = s.submitter;
      u && (t = (t = u[At] || null) ? vf(t.formAction) : u.getAttribute("formAction"), t !== null && (i = t, u = null));
      var r = new On(
        "action",
        "action",
        null,
        s,
        n
      );
      e.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (s.defaultPrevented) {
                if (qa !== 0) {
                  var x = u ? xf(n, u) : new FormData(n);
                  Lc(
                    l,
                    {
                      pending: !0,
                      data: x,
                      method: n.method,
                      action: i
                    },
                    null,
                    x
                  );
                }
              } else
                typeof i == "function" && (r.preventDefault(), x = u ? xf(n, u) : new FormData(n), Lc(
                  l,
                  {
                    pending: !0,
                    data: x,
                    method: n.method,
                    action: i
                  },
                  i,
                  x
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Nu = 0; Nu < cc.length; Nu++) {
    var Su = cc[Nu], Fm = Su.toLowerCase(), Im = Su[0].toUpperCase() + Su.slice(1);
    yl(
      Fm,
      "on" + Im
    );
  }
  yl(Jr, "onAnimationEnd"), yl(Kr, "onAnimationIteration"), yl($r, "onAnimationStart"), yl("dblclick", "onDoubleClick"), yl("focusin", "onFocus"), yl("focusout", "onBlur"), yl(vm, "onTransitionRun"), yl(xm, "onTransitionStart"), yl(jm, "onTransitionCancel"), yl(Wr, "onTransitionEnd"), Ha("onMouseEnter", ["mouseout", "mouseover"]), Ha("onMouseLeave", ["mouseout", "mouseover"]), Ha("onPointerEnter", ["pointerout", "pointerover"]), Ha("onPointerLeave", ["pointerout", "pointerover"]), ba(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), ba(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), ba("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), ba(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), ba(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), ba(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var an = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Pm = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(an)
  );
  function jf(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var s = e[l], n = s.event;
      s = s.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var u = s.length - 1; 0 <= u; u--) {
            var r = s[u], x = r.instance, w = r.currentTarget;
            if (r = r.listener, x !== i && n.isPropagationStopped())
              break e;
            i = r, n.currentTarget = w;
            try {
              i(n);
            } catch (R) {
              li(R);
            }
            n.currentTarget = null, i = x;
          }
        else
          for (u = 0; u < s.length; u++) {
            if (r = s[u], x = r.instance, w = r.currentTarget, r = r.listener, x !== i && n.isPropagationStopped())
              break e;
            i = r, n.currentTarget = w;
            try {
              i(n);
            } catch (R) {
              li(R);
            }
            n.currentTarget = null, i = x;
          }
      }
    }
  }
  function We(e, t) {
    var l = t[q];
    l === void 0 && (l = t[q] = /* @__PURE__ */ new Set());
    var s = e + "__bubble";
    l.has(s) || (gf(t, e, 2, !1), l.add(s));
  }
  function wu(e, t, l) {
    var s = 0;
    t && (s |= 4), gf(
      l,
      e,
      s,
      t
    );
  }
  var xi = "_reactListening" + Math.random().toString(36).slice(2);
  function ku(e) {
    if (!e[xi]) {
      e[xi] = !0, rr.forEach(function(l) {
        l !== "selectionchange" && (Pm.has(l) || wu(l, !1, e), wu(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[xi] || (t[xi] = !0, wu("selectionchange", !1, t));
    }
  }
  function gf(e, t, l, s) {
    switch (Lf(t)) {
      case 2:
        var n = kv;
        break;
      case 8:
        n = Ev;
        break;
      default:
        n = Yu;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !Ki || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), s ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Eu(e, t, l, s, n) {
    var i = s;
    if ((t & 1) === 0 && (t & 2) === 0 && s !== null)
      e: for (; ; ) {
        if (s === null) return;
        var u = s.tag;
        if (u === 3 || u === 4) {
          var r = s.stateNode.containerInfo;
          if (r === n) break;
          if (u === 4)
            for (u = s.return; u !== null; ) {
              var x = u.tag;
              if ((x === 3 || x === 4) && u.stateNode.containerInfo === n)
                return;
              u = u.return;
            }
          for (; r !== null; ) {
            if (u = dl(r), u === null) return;
            if (x = u.tag, x === 5 || x === 6 || x === 26 || x === 27) {
              s = i = u;
              continue e;
            }
            r = r.parentNode;
          }
        }
        s = s.return;
      }
    Nr(function() {
      var w = i, R = Vi(l), B = [];
      e: {
        var k = Fr.get(e);
        if (k !== void 0) {
          var C = On, Ae = e;
          switch (e) {
            case "keypress":
              if (Cn(l) === 0) break e;
            case "keydown":
            case "keyup":
              C = Jh;
              break;
            case "focusin":
              Ae = "focus", C = Ii;
              break;
            case "focusout":
              Ae = "blur", C = Ii;
              break;
            case "beforeblur":
            case "afterblur":
              C = Ii;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              C = kr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              C = Mh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              C = Wh;
              break;
            case Jr:
            case Kr:
            case $r:
              C = Hh;
              break;
            case Wr:
              C = Ih;
              break;
            case "scroll":
            case "scrollend":
              C = Rh;
              break;
            case "wheel":
              C = em;
              break;
            case "copy":
            case "cut":
            case "paste":
              C = Yh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              C = Cr;
              break;
            case "toggle":
            case "beforetoggle":
              C = lm;
          }
          var Te = (t & 4) !== 0, jt = !Te && (e === "scroll" || e === "scrollend"), y = Te ? k !== null ? k + "Capture" : null : k;
          Te = [];
          for (var g = w, S; g !== null; ) {
            var M = g;
            if (S = M.stateNode, M = M.tag, M !== 5 && M !== 26 && M !== 27 || S === null || y === null || (M = _s(g, y), M != null && Te.push(
              sn(g, M, S)
            )), jt) break;
            g = g.return;
          }
          0 < Te.length && (k = new C(
            k,
            Ae,
            null,
            l,
            R
          ), B.push({ event: k, listeners: Te }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (k = e === "mouseover" || e === "pointerover", C = e === "mouseout" || e === "pointerout", k && l !== Zi && (Ae = l.relatedTarget || l.fromElement) && (dl(Ae) || Ae[c]))
            break e;
          if ((C || k) && (k = R.window === R ? R : (k = R.ownerDocument) ? k.defaultView || k.parentWindow : window, C ? (Ae = l.relatedTarget || l.toElement, C = w, Ae = Ae ? dl(Ae) : null, Ae !== null && (jt = Z(Ae), Te = Ae.tag, Ae !== jt || Te !== 5 && Te !== 27 && Te !== 6) && (Ae = null)) : (C = null, Ae = w), C !== Ae)) {
            if (Te = kr, M = "onMouseLeave", y = "onMouseEnter", g = "mouse", (e === "pointerout" || e === "pointerover") && (Te = Cr, M = "onPointerLeave", y = "onPointerEnter", g = "pointer"), jt = C == null ? k : $l(C), S = Ae == null ? k : $l(Ae), k = new Te(
              M,
              g + "leave",
              C,
              l,
              R
            ), k.target = jt, k.relatedTarget = S, M = null, dl(R) === w && (Te = new Te(
              y,
              g + "enter",
              Ae,
              l,
              R
            ), Te.target = S, Te.relatedTarget = jt, M = Te), jt = M, C && Ae)
              t: {
                for (Te = C, y = Ae, g = 0, S = Te; S; S = vs(S))
                  g++;
                for (S = 0, M = y; M; M = vs(M))
                  S++;
                for (; 0 < g - S; )
                  Te = vs(Te), g--;
                for (; 0 < S - g; )
                  y = vs(y), S--;
                for (; g--; ) {
                  if (Te === y || y !== null && Te === y.alternate)
                    break t;
                  Te = vs(Te), y = vs(y);
                }
                Te = null;
              }
            else Te = null;
            C !== null && pf(
              B,
              k,
              C,
              Te,
              !1
            ), Ae !== null && jt !== null && pf(
              B,
              jt,
              Ae,
              Te,
              !0
            );
          }
        }
        e: {
          if (k = w ? $l(w) : window, C = k.nodeName && k.nodeName.toLowerCase(), C === "select" || C === "input" && k.type === "file")
            var ve = Dr;
          else if (Ur(k))
            if (qr)
              ve = fm;
            else {
              ve = dm;
              var Ve = rm;
            }
          else
            C = k.nodeName, !C || C.toLowerCase() !== "input" || k.type !== "checkbox" && k.type !== "radio" ? w && Qi(w.elementType) && (ve = Dr) : ve = om;
          if (ve && (ve = ve(e, w))) {
            Mr(
              B,
              ve,
              l,
              R
            );
            break e;
          }
          Ve && Ve(e, k, w), e === "focusout" && w && k.type === "number" && w.memoizedProps.value != null && Xi(k, "number", k.value);
        }
        switch (Ve = w ? $l(w) : window, e) {
          case "focusin":
            (Ur(Ve) || Ve.contentEditable === "true") && (Za = Ve, sc = w, Os = null);
            break;
          case "focusout":
            Os = sc = Za = null;
            break;
          case "mousedown":
            nc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            nc = !1, Zr(B, l, R);
            break;
          case "selectionchange":
            if (mm) break;
          case "keydown":
          case "keyup":
            Zr(B, l, R);
        }
        var _e;
        if (ec)
          e: {
            switch (e) {
              case "compositionstart":
                var Oe = "onCompositionStart";
                break e;
              case "compositionend":
                Oe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Oe = "onCompositionUpdate";
                break e;
            }
            Oe = void 0;
          }
        else
          Qa ? Ar(e, l) && (Oe = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Oe = "onCompositionStart");
        Oe && (Tr && l.locale !== "ko" && (Qa || Oe !== "onCompositionStart" ? Oe === "onCompositionEnd" && Qa && (_e = Sr()) : (Wl = R, $i = "value" in Wl ? Wl.value : Wl.textContent, Qa = !0)), Ve = ji(w, Oe), 0 < Ve.length && (Oe = new Er(
          Oe,
          e,
          null,
          l,
          R
        ), B.push({ event: Oe, listeners: Ve }), _e ? Oe.data = _e : (_e = Rr(l), _e !== null && (Oe.data = _e)))), (_e = sm ? nm(e, l) : im(e, l)) && (Oe = ji(w, "onBeforeInput"), 0 < Oe.length && (Ve = new Er(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          R
        ), B.push({
          event: Ve,
          listeners: Oe
        }), Ve.data = _e)), Wm(
          B,
          e,
          w,
          l,
          R
        );
      }
      jf(B, t);
    });
  }
  function sn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function ji(e, t) {
    for (var l = t + "Capture", s = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = _s(e, l), n != null && s.unshift(
        sn(e, n, i)
      ), n = _s(e, t), n != null && s.push(
        sn(e, n, i)
      )), e.tag === 3) return s;
      e = e.return;
    }
    return [];
  }
  function vs(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function pf(e, t, l, s, n) {
    for (var i = t._reactName, u = []; l !== null && l !== s; ) {
      var r = l, x = r.alternate, w = r.stateNode;
      if (r = r.tag, x !== null && x === s) break;
      r !== 5 && r !== 26 && r !== 27 || w === null || (x = w, n ? (w = _s(l, i), w != null && u.unshift(
        sn(l, w, x)
      )) : n || (w = _s(l, i), w != null && u.push(
        sn(l, w, x)
      ))), l = l.return;
    }
    u.length !== 0 && e.push({ event: t, listeners: u });
  }
  var ev = /\r\n?/g, tv = /\u0000|\uFFFD/g;
  function yf(e) {
    return (typeof e == "string" ? e : "" + e).replace(ev, `
`).replace(tv, "");
  }
  function bf(e, t) {
    return t = yf(t), yf(e) === t;
  }
  function gi() {
  }
  function xt(e, t, l, s, n, i) {
    switch (l) {
      case "children":
        typeof s == "string" ? t === "body" || t === "textarea" && s === "" || Ga(e, s) : (typeof s == "number" || typeof s == "bigint") && t !== "body" && Ga(e, "" + s);
        break;
      case "className":
        Nn(e, "class", s);
        break;
      case "tabIndex":
        Nn(e, "tabindex", s);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Nn(e, l, s);
        break;
      case "style":
        br(e, s, i);
        break;
      case "data":
        if (t !== "object") {
          Nn(e, "data", s);
          break;
        }
      case "src":
      case "href":
        if (s === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(l);
          break;
        }
        s = kn("" + s), e.setAttribute(l, s);
        break;
      case "action":
      case "formAction":
        if (typeof s == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (l === "formAction" ? (t !== "input" && xt(e, t, "name", n.name, n, null), xt(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), xt(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), xt(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (xt(e, t, "encType", n.encType, n, null), xt(e, t, "method", n.method, n, null), xt(e, t, "target", n.target, n, null)));
        if (s == null || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(l);
          break;
        }
        s = kn("" + s), e.setAttribute(l, s);
        break;
      case "onClick":
        s != null && (e.onclick = gi);
        break;
      case "onScroll":
        s != null && We("scroll", e);
        break;
      case "onScrollEnd":
        s != null && We("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(f(61));
          if (l = s.__html, l != null) {
            if (n.children != null) throw Error(f(60));
            e.innerHTML = l;
          }
        }
        break;
      case "multiple":
        e.multiple = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "muted":
        e.muted = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (s == null || typeof s == "function" || typeof s == "boolean" || typeof s == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = kn("" + s), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(l, "" + s) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        s && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        s === !0 ? e.setAttribute(l, "") : s !== !1 && s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(l, s) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s ? e.setAttribute(l, s) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s) ? e.removeAttribute(l) : e.setAttribute(l, s);
        break;
      case "popover":
        We("beforetoggle", e), We("toggle", e), _n(e, "popover", s);
        break;
      case "xlinkActuate":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          s
        );
        break;
      case "xlinkArcrole":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          s
        );
        break;
      case "xlinkRole":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          s
        );
        break;
      case "xlinkShow":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          s
        );
        break;
      case "xlinkTitle":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          s
        );
        break;
      case "xlinkType":
        Al(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          s
        );
        break;
      case "xmlBase":
        Al(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          s
        );
        break;
      case "xmlLang":
        Al(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          s
        );
        break;
      case "xmlSpace":
        Al(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          s
        );
        break;
      case "is":
        _n(e, "is", s);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = zh.get(l) || l, _n(e, l, s));
    }
  }
  function Cu(e, t, l, s, n, i) {
    switch (l) {
      case "style":
        br(e, s, i);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(f(61));
          if (l = s.__html, l != null) {
            if (n.children != null) throw Error(f(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof s == "string" ? Ga(e, s) : (typeof s == "number" || typeof s == "bigint") && Ga(e, "" + s);
        break;
      case "onScroll":
        s != null && We("scroll", e);
        break;
      case "onScrollEnd":
        s != null && We("scrollend", e);
        break;
      case "onClick":
        s != null && (e.onclick = gi);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!dr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[At] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof s == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, s, n);
              break e;
            }
            l in e ? e[l] = s : s === !0 ? e.setAttribute(l, "") : _n(e, l, s);
          }
    }
  }
  function Qt(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        We("error", e), We("load", e);
        var s = !1, n = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var u = l[i];
            if (u != null)
              switch (i) {
                case "src":
                  s = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(f(137, t));
                default:
                  xt(e, t, i, u, l, null);
              }
          }
        n && xt(e, t, "srcSet", l.srcSet, l, null), s && xt(e, t, "src", l.src, l, null);
        return;
      case "input":
        We("invalid", e);
        var r = i = u = n = null, x = null, w = null;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            var R = l[s];
            if (R != null)
              switch (s) {
                case "name":
                  n = R;
                  break;
                case "type":
                  u = R;
                  break;
                case "checked":
                  x = R;
                  break;
                case "defaultChecked":
                  w = R;
                  break;
                case "value":
                  i = R;
                  break;
                case "defaultValue":
                  r = R;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (R != null)
                    throw Error(f(137, t));
                  break;
                default:
                  xt(e, t, s, R, l, null);
              }
          }
        jr(
          e,
          i,
          r,
          x,
          w,
          u,
          n,
          !1
        ), Sn(e);
        return;
      case "select":
        We("invalid", e), s = u = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (r = l[n], r != null))
            switch (n) {
              case "value":
                i = r;
                break;
              case "defaultValue":
                u = r;
                break;
              case "multiple":
                s = r;
              default:
                xt(e, t, n, r, l, null);
            }
        t = i, l = u, e.multiple = !!s, t != null ? Ya(e, !!s, t, !1) : l != null && Ya(e, !!s, l, !0);
        return;
      case "textarea":
        We("invalid", e), i = n = s = null;
        for (u in l)
          if (l.hasOwnProperty(u) && (r = l[u], r != null))
            switch (u) {
              case "value":
                s = r;
                break;
              case "defaultValue":
                n = r;
                break;
              case "children":
                i = r;
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(f(91));
                break;
              default:
                xt(e, t, u, r, l, null);
            }
        pr(e, s, n, i), Sn(e);
        return;
      case "option":
        for (x in l)
          if (l.hasOwnProperty(x) && (s = l[x], s != null))
            switch (x) {
              case "selected":
                e.selected = s && typeof s != "function" && typeof s != "symbol";
                break;
              default:
                xt(e, t, x, s, l, null);
            }
        return;
      case "dialog":
        We("beforetoggle", e), We("toggle", e), We("cancel", e), We("close", e);
        break;
      case "iframe":
      case "object":
        We("load", e);
        break;
      case "video":
      case "audio":
        for (s = 0; s < an.length; s++)
          We(an[s], e);
        break;
      case "image":
        We("error", e), We("load", e);
        break;
      case "details":
        We("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        We("error", e), We("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (w in l)
          if (l.hasOwnProperty(w) && (s = l[w], s != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(f(137, t));
              default:
                xt(e, t, w, s, l, null);
            }
        return;
      default:
        if (Qi(t)) {
          for (R in l)
            l.hasOwnProperty(R) && (s = l[R], s !== void 0 && Cu(
              e,
              t,
              R,
              s,
              l,
              void 0
            ));
          return;
        }
    }
    for (r in l)
      l.hasOwnProperty(r) && (s = l[r], s != null && xt(e, t, r, s, l, null));
  }
  function lv(e, t, l, s) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, i = null, u = null, r = null, x = null, w = null, R = null;
        for (C in l) {
          var B = l[C];
          if (l.hasOwnProperty(C) && B != null)
            switch (C) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                x = B;
              default:
                s.hasOwnProperty(C) || xt(e, t, C, null, s, B);
            }
        }
        for (var k in s) {
          var C = s[k];
          if (B = l[k], s.hasOwnProperty(k) && (C != null || B != null))
            switch (k) {
              case "type":
                i = C;
                break;
              case "name":
                n = C;
                break;
              case "checked":
                w = C;
                break;
              case "defaultChecked":
                R = C;
                break;
              case "value":
                u = C;
                break;
              case "defaultValue":
                r = C;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (C != null)
                  throw Error(f(137, t));
                break;
              default:
                C !== B && xt(
                  e,
                  t,
                  k,
                  C,
                  s,
                  B
                );
            }
        }
        Li(
          e,
          u,
          r,
          x,
          w,
          R,
          i,
          n
        );
        return;
      case "select":
        C = u = r = k = null;
        for (i in l)
          if (x = l[i], l.hasOwnProperty(i) && x != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                C = x;
              default:
                s.hasOwnProperty(i) || xt(
                  e,
                  t,
                  i,
                  null,
                  s,
                  x
                );
            }
        for (n in s)
          if (i = s[n], x = l[n], s.hasOwnProperty(n) && (i != null || x != null))
            switch (n) {
              case "value":
                k = i;
                break;
              case "defaultValue":
                r = i;
                break;
              case "multiple":
                u = i;
              default:
                i !== x && xt(
                  e,
                  t,
                  n,
                  i,
                  s,
                  x
                );
            }
        t = r, l = u, s = C, k != null ? Ya(e, !!l, k, !1) : !!s != !!l && (t != null ? Ya(e, !!l, t, !0) : Ya(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        C = k = null;
        for (r in l)
          if (n = l[r], l.hasOwnProperty(r) && n != null && !s.hasOwnProperty(r))
            switch (r) {
              case "value":
                break;
              case "children":
                break;
              default:
                xt(e, t, r, null, s, n);
            }
        for (u in s)
          if (n = s[u], i = l[u], s.hasOwnProperty(u) && (n != null || i != null))
            switch (u) {
              case "value":
                k = n;
                break;
              case "defaultValue":
                C = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(f(91));
                break;
              default:
                n !== i && xt(e, t, u, n, s, i);
            }
        gr(e, k, C);
        return;
      case "option":
        for (var Ae in l)
          if (k = l[Ae], l.hasOwnProperty(Ae) && k != null && !s.hasOwnProperty(Ae))
            switch (Ae) {
              case "selected":
                e.selected = !1;
                break;
              default:
                xt(
                  e,
                  t,
                  Ae,
                  null,
                  s,
                  k
                );
            }
        for (x in s)
          if (k = s[x], C = l[x], s.hasOwnProperty(x) && k !== C && (k != null || C != null))
            switch (x) {
              case "selected":
                e.selected = k && typeof k != "function" && typeof k != "symbol";
                break;
              default:
                xt(
                  e,
                  t,
                  x,
                  k,
                  s,
                  C
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Te in l)
          k = l[Te], l.hasOwnProperty(Te) && k != null && !s.hasOwnProperty(Te) && xt(e, t, Te, null, s, k);
        for (w in s)
          if (k = s[w], C = l[w], s.hasOwnProperty(w) && k !== C && (k != null || C != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (k != null)
                  throw Error(f(137, t));
                break;
              default:
                xt(
                  e,
                  t,
                  w,
                  k,
                  s,
                  C
                );
            }
        return;
      default:
        if (Qi(t)) {
          for (var jt in l)
            k = l[jt], l.hasOwnProperty(jt) && k !== void 0 && !s.hasOwnProperty(jt) && Cu(
              e,
              t,
              jt,
              void 0,
              s,
              k
            );
          for (R in s)
            k = s[R], C = l[R], !s.hasOwnProperty(R) || k === C || k === void 0 && C === void 0 || Cu(
              e,
              t,
              R,
              k,
              s,
              C
            );
          return;
        }
    }
    for (var y in l)
      k = l[y], l.hasOwnProperty(y) && k != null && !s.hasOwnProperty(y) && xt(e, t, y, null, s, k);
    for (B in s)
      k = s[B], C = l[B], !s.hasOwnProperty(B) || k === C || k == null && C == null || xt(e, t, B, k, s, C);
  }
  var Tu = null, Ou = null;
  function pi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function _f(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Nf(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function zu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Au = null;
  function av() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Au ? !1 : (Au = e, !0) : (Au = null, !1);
  }
  var Sf = typeof setTimeout == "function" ? setTimeout : void 0, sv = typeof clearTimeout == "function" ? clearTimeout : void 0, wf = typeof Promise == "function" ? Promise : void 0, nv = typeof queueMicrotask == "function" ? queueMicrotask : typeof wf < "u" ? function(e) {
    return wf.resolve(null).then(e).catch(iv);
  } : Sf;
  function iv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function fa(e) {
    return e === "head";
  }
  function kf(e, t) {
    var l = t, s = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < s && 8 > s) {
            l = s;
            var u = e.ownerDocument;
            if (l & 1 && nn(u.documentElement), l & 2 && nn(u.body), l & 4)
              for (l = u.head, nn(l), u = l.firstChild; u; ) {
                var r = u.nextSibling, x = u.nodeName;
                u[gt] || x === "SCRIPT" || x === "STYLE" || x === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = r;
              }
          }
          if (n === 0) {
            e.removeChild(i), mn(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : s = l.charCodeAt(0) - 48;
      else s = 0;
      l = i;
    } while (l);
    mn(t);
  }
  function Ru(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ru(l), Gt(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function cv(e, t, l, s) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (s) {
        if (!e[gt])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = _l(e.nextSibling), e === null) break;
    }
    return null;
  }
  function uv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = _l(e.nextSibling), e === null)) return null;
    return e;
  }
  function Uu(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function rv(e, t) {
    var l = e.ownerDocument;
    if (e.data !== "$?" || l.readyState === "complete")
      t();
    else {
      var s = function() {
        t(), l.removeEventListener("DOMContentLoaded", s);
      };
      l.addEventListener("DOMContentLoaded", s), e._reactRetry = s;
    }
  }
  function _l(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "F!" || t === "F")
          break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  var Mu = null;
  function Ef(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (t === 0) return e;
          t--;
        } else l === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Cf(e, t, l) {
    switch (t = pi(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(f(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(f(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(f(454));
        return e;
      default:
        throw Error(f(451));
    }
  }
  function nn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Gt(e);
  }
  var pl = /* @__PURE__ */ new Map(), Tf = /* @__PURE__ */ new Set();
  function yi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Vl = U.d;
  U.d = {
    f: dv,
    r: ov,
    D: fv,
    C: hv,
    L: mv,
    m: vv,
    X: jv,
    S: xv,
    M: gv
  };
  function dv() {
    var e = Vl.f(), t = oi();
    return e || t;
  }
  function ov(e) {
    var t = zl(e);
    t !== null && t.tag === 5 && t.type === "form" ? Jd(t) : Vl.r(e);
  }
  var xs = typeof document > "u" ? null : document;
  function Of(e, t, l) {
    var s = xs;
    if (s && typeof t == "string" && t) {
      var n = fl(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Tf.has(n) || (Tf.add(n), e = { rel: e, crossOrigin: l, href: t }, s.querySelector(n) === null && (t = s.createElement("link"), Qt(t, "link", e), Rt(t), s.head.appendChild(t)));
    }
  }
  function fv(e) {
    Vl.D(e), Of("dns-prefetch", e, null);
  }
  function hv(e, t) {
    Vl.C(e, t), Of("preconnect", e, t);
  }
  function mv(e, t, l) {
    Vl.L(e, t, l);
    var s = xs;
    if (s && e && t) {
      var n = 'link[rel="preload"][as="' + fl(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + fl(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + fl(
        l.imageSizes
      ) + '"]')) : n += '[href="' + fl(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = js(e);
          break;
        case "script":
          i = gs(e);
      }
      pl.has(i) || (e = G(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), pl.set(i, e), s.querySelector(n) !== null || t === "style" && s.querySelector(cn(i)) || t === "script" && s.querySelector(un(i)) || (t = s.createElement("link"), Qt(t, "link", e), Rt(t), s.head.appendChild(t)));
    }
  }
  function vv(e, t) {
    Vl.m(e, t);
    var l = xs;
    if (l && e) {
      var s = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + fl(s) + '"][href="' + fl(e) + '"]', i = n;
      switch (s) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = gs(e);
      }
      if (!pl.has(i) && (e = G({ rel: "modulepreload", href: e }, t), pl.set(i, e), l.querySelector(n) === null)) {
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(un(i)))
              return;
        }
        s = l.createElement("link"), Qt(s, "link", e), Rt(s), l.head.appendChild(s);
      }
    }
  }
  function xv(e, t, l) {
    Vl.S(e, t, l);
    var s = xs;
    if (s && e) {
      var n = Kt(s).hoistableStyles, i = js(e);
      t = t || "default";
      var u = n.get(i);
      if (!u) {
        var r = { loading: 0, preload: null };
        if (u = s.querySelector(
          cn(i)
        ))
          r.loading = 5;
        else {
          e = G(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = pl.get(i)) && Du(e, l);
          var x = u = s.createElement("link");
          Rt(x), Qt(x, "link", e), x._p = new Promise(function(w, R) {
            x.onload = w, x.onerror = R;
          }), x.addEventListener("load", function() {
            r.loading |= 1;
          }), x.addEventListener("error", function() {
            r.loading |= 2;
          }), r.loading |= 4, bi(u, t, s);
        }
        u = {
          type: "stylesheet",
          instance: u,
          count: 1,
          state: r
        }, n.set(i, u);
      }
    }
  }
  function jv(e, t) {
    Vl.X(e, t);
    var l = xs;
    if (l && e) {
      var s = Kt(l).hoistableScripts, n = gs(e), i = s.get(n);
      i || (i = l.querySelector(un(n)), i || (e = G({ src: e, async: !0 }, t), (t = pl.get(n)) && qu(e, t), i = l.createElement("script"), Rt(i), Qt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, s.set(n, i));
    }
  }
  function gv(e, t) {
    Vl.M(e, t);
    var l = xs;
    if (l && e) {
      var s = Kt(l).hoistableScripts, n = gs(e), i = s.get(n);
      i || (i = l.querySelector(un(n)), i || (e = G({ src: e, async: !0, type: "module" }, t), (t = pl.get(n)) && qu(e, t), i = l.createElement("script"), Rt(i), Qt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, s.set(n, i));
    }
  }
  function zf(e, t, l, s) {
    var n = (n = F.current) ? yi(n) : null;
    if (!n) throw Error(f(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = js(l.href), l = Kt(
          n
        ).hoistableStyles, s = l.get(t), s || (s = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, s)), s) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = js(l.href);
          var i = Kt(
            n
          ).hoistableStyles, u = i.get(e);
          if (u || (n = n.ownerDocument || n, u = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, u), (i = n.querySelector(
            cn(e)
          )) && !i._p && (u.instance = i, u.state.loading = 5), pl.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, pl.set(e, l), i || pv(
            n,
            e,
            l,
            u.state
          ))), t && s === null)
            throw Error(f(528, ""));
          return u;
        }
        if (t && s !== null)
          throw Error(f(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = gs(l), l = Kt(
          n
        ).hoistableScripts, s = l.get(t), s || (s = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, s)), s) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(f(444, e));
    }
  }
  function js(e) {
    return 'href="' + fl(e) + '"';
  }
  function cn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Af(e) {
    return G({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function pv(e, t, l, s) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? s.loading = 1 : (t = e.createElement("link"), s.preload = t, t.addEventListener("load", function() {
      return s.loading |= 1;
    }), t.addEventListener("error", function() {
      return s.loading |= 2;
    }), Qt(t, "link", l), Rt(t), e.head.appendChild(t));
  }
  function gs(e) {
    return '[src="' + fl(e) + '"]';
  }
  function un(e) {
    return "script[async]" + e;
  }
  function Rf(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var s = e.querySelector(
            'style[data-href~="' + fl(l.href) + '"]'
          );
          if (s)
            return t.instance = s, Rt(s), s;
          var n = G({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return s = (e.ownerDocument || e).createElement(
            "style"
          ), Rt(s), Qt(s, "style", n), bi(s, l.precedence, e), t.instance = s;
        case "stylesheet":
          n = js(l.href);
          var i = e.querySelector(
            cn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Rt(i), i;
          s = Af(l), (n = pl.get(n)) && Du(s, n), i = (e.ownerDocument || e).createElement("link"), Rt(i);
          var u = i;
          return u._p = new Promise(function(r, x) {
            u.onload = r, u.onerror = x;
          }), Qt(i, "link", s), t.state.loading |= 4, bi(i, l.precedence, e), t.instance = i;
        case "script":
          return i = gs(l.src), (n = e.querySelector(
            un(i)
          )) ? (t.instance = n, Rt(n), n) : (s = l, (n = pl.get(i)) && (s = G({}, l), qu(s, n)), e = e.ownerDocument || e, n = e.createElement("script"), Rt(n), Qt(n, "link", s), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(f(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (s = t.instance, t.state.loading |= 4, bi(s, l.precedence, e));
    return t.instance;
  }
  function bi(e, t, l) {
    for (var s = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = s.length ? s[s.length - 1] : null, i = n, u = 0; u < s.length; u++) {
      var r = s[u];
      if (r.dataset.precedence === t) i = r;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Du(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function qu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var _i = null;
  function Uf(e, t, l) {
    if (_i === null) {
      var s = /* @__PURE__ */ new Map(), n = _i = /* @__PURE__ */ new Map();
      n.set(l, s);
    } else
      n = _i, s = n.get(l), s || (s = /* @__PURE__ */ new Map(), n.set(l, s));
    if (s.has(e)) return s;
    for (s.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[gt] || i[kt] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var u = i.getAttribute(t) || "";
        u = e + u;
        var r = s.get(u);
        r ? r.push(i) : s.set(u, [i]);
      }
    }
    return s;
  }
  function Mf(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function yv(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Df(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var rn = null;
  function bv() {
  }
  function _v(e, t, l) {
    if (rn === null) throw Error(f(475));
    var s = rn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = js(l.href), i = e.querySelector(
          cn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (s.count++, s = Ni.bind(s), e.then(s, s)), t.state.loading |= 4, t.instance = i, Rt(i);
          return;
        }
        i = e.ownerDocument || e, l = Af(l), (n = pl.get(n)) && Du(l, n), i = i.createElement("link"), Rt(i);
        var u = i;
        u._p = new Promise(function(r, x) {
          u.onload = r, u.onerror = x;
        }), Qt(i, "link", l), t.instance = i;
      }
      s.stylesheets === null && (s.stylesheets = /* @__PURE__ */ new Map()), s.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (s.count++, t = Ni.bind(s), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function Nv() {
    if (rn === null) throw Error(f(475));
    var e = rn;
    return e.stylesheets && e.count === 0 && Hu(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && Hu(e, e.stylesheets), e.unsuspend) {
          var s = e.unsuspend;
          e.unsuspend = null, s();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Ni() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Hu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Si = null;
  function Hu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Si = /* @__PURE__ */ new Map(), t.forEach(Sv, e), Si = null, Ni.call(e));
  }
  function Sv(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Si.get(e);
      if (l) var s = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Si.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var u = n[i];
          (u.nodeName === "LINK" || u.getAttribute("media") !== "not all") && (l.set(u.dataset.precedence, u), s = u);
        }
        s && l.set(null, s);
      }
      n = t.instance, u = n.getAttribute("data-precedence"), i = l.get(u) || s, i === s && l.set(null, n), l.set(u, n), this.count++, s = Ni.bind(this), n.addEventListener("load", s), n.addEventListener("error", s), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var dn = {
    $$typeof: X,
    Provider: null,
    Consumer: null,
    _currentValue: Q,
    _currentValue2: Q,
    _threadCount: 0
  };
  function wv(e, t, l, s, n, i, u, r) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = o(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = o(0), this.hiddenUpdates = o(null), this.identifierPrefix = s, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = u, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = r, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function qf(e, t, l, s, n, i, u, r, x, w, R, B) {
    return e = new wv(
      e,
      t,
      l,
      u,
      r,
      x,
      w,
      B
    ), t = 1, i === !0 && (t |= 24), i = al(3, null, null, t), e.current = i, i.stateNode = e, t = pc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: s,
      isDehydrated: l,
      cache: t
    }, Nc(i), e;
  }
  function Hf(e) {
    return e ? (e = $a, e) : $a;
  }
  function Bf(e, t, l, s, n, i) {
    n = Hf(n), s.context === null ? s.context = n : s.pendingContext = n, s = Pl(t), s.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (s.callback = i), l = ea(e, s, t), l !== null && (ul(l, e, t), Bs(l, e, t));
  }
  function Yf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Bu(e, t) {
    Yf(e, t), (e = e.alternate) && Yf(e, t);
  }
  function Gf(e) {
    if (e.tag === 13) {
      var t = Ka(e, 67108864);
      t !== null && ul(t, e, 67108864), Bu(e, 67108864);
    }
  }
  var wi = !0;
  function kv(e, t, l, s) {
    var n = b.T;
    b.T = null;
    var i = U.p;
    try {
      U.p = 2, Yu(e, t, l, s);
    } finally {
      U.p = i, b.T = n;
    }
  }
  function Ev(e, t, l, s) {
    var n = b.T;
    b.T = null;
    var i = U.p;
    try {
      U.p = 8, Yu(e, t, l, s);
    } finally {
      U.p = i, b.T = n;
    }
  }
  function Yu(e, t, l, s) {
    if (wi) {
      var n = Gu(s);
      if (n === null)
        Eu(
          e,
          t,
          s,
          ki,
          l
        ), Xf(e, s);
      else if (Tv(
        n,
        e,
        t,
        l,
        s
      ))
        s.stopPropagation();
      else if (Xf(e, s), t & 4 && -1 < Cv.indexOf(e)) {
        for (; n !== null; ) {
          var i = zl(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var u = j(i.pendingLanes);
                  if (u !== 0) {
                    var r = i;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; u; ) {
                      var x = 1 << 31 - _(u);
                      r.entanglements[1] |= x, u &= ~x;
                    }
                    Tl(i), (ft & 6) === 0 && (ri = He() + 500, ln(0));
                  }
                }
                break;
              case 13:
                r = Ka(i, 2), r !== null && ul(r, i, 2), oi(), Bu(i, 2);
            }
          if (i = Gu(s), i === null && Eu(
            e,
            t,
            s,
            ki,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && s.stopPropagation();
      } else
        Eu(
          e,
          t,
          s,
          null,
          l
        );
    }
  }
  function Gu(e) {
    return e = Vi(e), Lu(e);
  }
  var ki = null;
  function Lu(e) {
    if (ki = null, e = dl(e), e !== null) {
      var t = Z(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = K(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ki = e, null;
  }
  function Lf(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (tt()) {
          case Ze:
            return 2;
          case Ie:
            return 8;
          case te:
          case dt:
            return 32;
          case be:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Xu = !1, ha = null, ma = null, va = null, on = /* @__PURE__ */ new Map(), fn = /* @__PURE__ */ new Map(), xa = [], Cv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Xf(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ha = null;
        break;
      case "dragenter":
      case "dragleave":
        ma = null;
        break;
      case "mouseover":
      case "mouseout":
        va = null;
        break;
      case "pointerover":
      case "pointerout":
        on.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        fn.delete(t.pointerId);
    }
  }
  function hn(e, t, l, s, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: s,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = zl(t), t !== null && Gf(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Tv(e, t, l, s, n) {
    switch (t) {
      case "focusin":
        return ha = hn(
          ha,
          e,
          t,
          l,
          s,
          n
        ), !0;
      case "dragenter":
        return ma = hn(
          ma,
          e,
          t,
          l,
          s,
          n
        ), !0;
      case "mouseover":
        return va = hn(
          va,
          e,
          t,
          l,
          s,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return on.set(
          i,
          hn(
            on.get(i) || null,
            e,
            t,
            l,
            s,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, fn.set(
          i,
          hn(
            fn.get(i) || null,
            e,
            t,
            l,
            s,
            n
          )
        ), !0;
    }
    return !1;
  }
  function Qf(e) {
    var t = dl(e.target);
    if (t !== null) {
      var l = Z(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = K(l), t !== null) {
            e.blockedOn = t, rl(e.priority, function() {
              if (l.tag === 13) {
                var s = cl();
                s = nt(s);
                var n = Ka(l, s);
                n !== null && ul(n, l, s), Bu(l, s);
              }
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ei(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Gu(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var s = new l.constructor(
          l.type,
          l
        );
        Zi = s, l.target.dispatchEvent(s), Zi = null;
      } else
        return t = zl(l), t !== null && Gf(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Zf(e, t, l) {
    Ei(e) && l.delete(t);
  }
  function Ov() {
    Xu = !1, ha !== null && Ei(ha) && (ha = null), ma !== null && Ei(ma) && (ma = null), va !== null && Ei(va) && (va = null), on.forEach(Zf), fn.forEach(Zf);
  }
  function Ci(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Xu || (Xu = !0, m.unstable_scheduleCallback(
      m.unstable_NormalPriority,
      Ov
    )));
  }
  var Ti = null;
  function Vf(e) {
    Ti !== e && (Ti = e, m.unstable_scheduleCallback(
      m.unstable_NormalPriority,
      function() {
        Ti === e && (Ti = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], s = e[t + 1], n = e[t + 2];
          if (typeof s != "function") {
            if (Lu(s || l) === null)
              continue;
            break;
          }
          var i = zl(l);
          i !== null && (e.splice(t, 3), t -= 3, Lc(
            i,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: s
            },
            s,
            n
          ));
        }
      }
    ));
  }
  function mn(e) {
    function t(x) {
      return Ci(x, e);
    }
    ha !== null && Ci(ha, e), ma !== null && Ci(ma, e), va !== null && Ci(va, e), on.forEach(t), fn.forEach(t);
    for (var l = 0; l < xa.length; l++) {
      var s = xa[l];
      s.blockedOn === e && (s.blockedOn = null);
    }
    for (; 0 < xa.length && (l = xa[0], l.blockedOn === null); )
      Qf(l), l.blockedOn === null && xa.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (s = 0; s < l.length; s += 3) {
        var n = l[s], i = l[s + 1], u = n[At] || null;
        if (typeof i == "function")
          u || Vf(l);
        else if (u) {
          var r = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, u = i[At] || null)
              r = u.formAction;
            else if (Lu(n) !== null) continue;
          } else r = u.action;
          typeof r == "function" ? l[s + 1] = r : (l.splice(s, 3), s -= 3), Vf(l);
        }
      }
  }
  function Qu(e) {
    this._internalRoot = e;
  }
  Oi.prototype.render = Qu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(f(409));
    var l = t.current, s = cl();
    Bf(l, s, e, t, null, null);
  }, Oi.prototype.unmount = Qu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Bf(e.current, 2, null, e, null, null), oi(), t[c] = null;
    }
  };
  function Oi(e) {
    this._internalRoot = e;
  }
  Oi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Wt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < xa.length && t !== 0 && t < xa[l].priority; l++) ;
      xa.splice(l, 0, e), l === 0 && Qf(e);
    }
  };
  var Jf = N.version;
  if (Jf !== "19.1.0")
    throw Error(
      f(
        527,
        Jf,
        "19.1.0"
      )
    );
  U.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(f(188)) : (e = Object.keys(e).join(","), Error(f(268, e)));
    return e = D(t), e = e !== null ? p(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var zv = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: b,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var zi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!zi.isDisabled && zi.supportsFiber)
      try {
        ct = zi.inject(
          zv
        ), Le = zi;
      } catch {
      }
  }
  return xn.createRoot = function(e, t) {
    if (!H(e)) throw Error(f(299));
    var l = !1, s = "", n = co, i = uo, u = ro, r = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (u = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (r = t.unstable_transitionCallbacks)), t = qf(
      e,
      1,
      !1,
      null,
      null,
      l,
      s,
      n,
      i,
      u,
      r,
      null
    ), e[c] = t.current, ku(e), new Qu(t);
  }, xn.hydrateRoot = function(e, t, l) {
    if (!H(e)) throw Error(f(299));
    var s = !1, n = "", i = co, u = uo, r = ro, x = null, w = null;
    return l != null && (l.unstable_strictMode === !0 && (s = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (u = l.onCaughtError), l.onRecoverableError !== void 0 && (r = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (x = l.unstable_transitionCallbacks), l.formState !== void 0 && (w = l.formState)), t = qf(
      e,
      1,
      !0,
      t,
      l ?? null,
      s,
      n,
      i,
      u,
      r,
      x,
      w
    ), t.context = Hf(null), l = t.current, s = cl(), s = nt(s), n = Pl(s), n.callback = null, ea(l, n, s), l = s, t.current.lanes = l, A(t, l), Tl(t), e[c] = t.current, ku(e), new Oi(t);
  }, xn.version = "19.1.0", xn;
}
var ah;
function Gv() {
  if (ah) return Vu.exports;
  ah = 1;
  function m() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(m);
      } catch (N) {
        console.error(N);
      }
  }
  return m(), Vu.exports = Yv(), Vu.exports;
}
var Lv = Gv(), h = cr();
const Fu = {}, ur = window.location.pathname.startsWith("/quality/b/"), bs = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), sh = Fu == null ? void 0 : Fu.VITE_B_PLATFORM_MODE, Nt = bs || ur && (sh === "true" || sh !== "false" && !0);
function Ai() {
  if (!ur && !bs) return window.location.pathname;
  const m = bs ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return m.split("?")[0] === "/knowledge" ? "/knowledge/library" : m.split("?")[0];
}
function Xv(m) {
  bs ? window.history.pushState({}, "", "/quality/#/b" + m) : ur ? window.history.pushState({}, "", "/quality/b/#" + m) : window.history.pushState({}, "", m), bs && window.dispatchEvent(new Event("platform-route"));
}
async function Zt(m, N = {}) {
  if (!Nt) return fetch(m, N);
  if (!m.startsWith("/api/v1/") && !m.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const O = new Headers(N.headers);
  O.delete("Authorization");
  const f = window.QaxcProjectId;
  bs && f && O.set("X-Project-ID", f);
  const H = (N.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(H)) {
    const K = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (K.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !K.ok) throw new Error(K.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const W = await K.json(), D = W.csrf_token ?? W.token;
    if (typeof D != "string" || !D) throw new Error("安全校验返回格式不正确。");
    O.set("X-CSRF-Token", D);
  }
  const Z = await fetch("/quality/b" + m, { ...N, headers: O, credentials: "same-origin" });
  return Z.status === 401 && window.dispatchEvent(new Event("b-session-expired")), Z;
}
const nh = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Qv({ id: m, identity: N, projects: O, navigate: f }) {
  const [H, Z] = h.useState(null), [K, W] = h.useState(""), [D, p] = h.useState(!1), [G, xe] = h.useState(""), [E, oe] = h.useState(0), I = `a-import-action:${N}:${m}`;
  async function ze(de, X) {
    const fe = await Zt("/integration/v1/a-imports/" + m + de, X), le = await fe.json().catch(() => ({}));
    if (!fe.ok)
      throw fe.status >= 400 && fe.status < 500 && sessionStorage.removeItem(I), new Error(le.message || `请求未完成（${fe.status}），请刷新查看最新状态。`);
    return le;
  }
  h.useEffect(() => {
    let de = !1;
    async function X() {
      try {
        const le = await ze("");
        de || (Z(le), W(""));
      } catch (le) {
        de || (Z(null), W(le.message));
      }
    }
    Z(null), X();
    const fe = window.setInterval(X, 3e3);
    return () => {
      de = !0, clearInterval(fe);
    };
  }, [m, E, N]);
  const ae = (de) => {
    var X, fe;
    return !!H && !!((fe = (X = O.find((le) => le.id === H.project_id)) == null ? void 0 : X.permissions) != null && fe.includes(de));
  };
  async function Ne(de) {
    if (!(!H || D)) {
      p(!0), W("");
      try {
        const X = sessionStorage.getItem(I), fe = X ? JSON.parse(X) : { operation: de, key: crypto.randomUUID(), body: { expected_version: H.version, ...de === "withdraw" ? { reason: G.trim() } : {} } };
        if (fe.operation !== de) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(I, JSON.stringify(fe)), await ze("/" + de, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": fe.key }, body: JSON.stringify(fe.body) }), sessionStorage.removeItem(I), oe((le) => le + 1);
      } catch (X) {
        W(X.message);
      } finally {
        p(!1);
      }
    }
  }
  return /* @__PURE__ */ a.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ a.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => oe((de) => de + 1), disabled: D, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ a.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      K && /* @__PURE__ */ a.jsx("p", { role: "alert", className: "feedback error", children: K }),
      H ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ a.jsxs("dd", { children: [
              "v",
              H.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ a.jsx("dd", { children: nh[H.status] || H.status })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ a.jsx("dd", { children: nh[H.retrospective_status] || H.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "证据完整性：" }),
          H.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        H.error && /* @__PURE__ */ a.jsx("p", { role: "alert", children: H.error.message }),
        H.warnings.length > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
          /* @__PURE__ */ a.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ a.jsx("ul", { children: H.warnings.map((de, X) => /* @__PURE__ */ a.jsx("li", { children: de.message }, de.code + ":" + X)) })
        ] }),
        H.missing_fields.length > 0 && /* @__PURE__ */ a.jsxs("p", { children: [
          "存在 ",
          H.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "a-import-actions", children: [
          H.capabilities.can_view_materials && H.receipt_id && ae("imports.read") && /* @__PURE__ */ a.jsx("button", { className: "button secondary", onClick: () => f("/task-packages/" + H.receipt_id), children: "查看原始资料" }),
          H.capabilities.can_generate_retrospective && ae("retrospective.generate") && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: D, onClick: () => void Ne("retrospectives"), children: H.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          H.retrospective_id && H.status !== "withdrawn" && ae("retrospective.read") && /* @__PURE__ */ a.jsx("button", { className: "button primary", onClick: () => f("/retrospectives/" + H.retrospective_id), children: "查看复盘" }),
          (H.status === "failed" || H.retrospective_status === "failed") && ae("imports.retry") && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: D, onClick: () => void Ne("retry"), children: "重试失败任务" })
        ] }),
        H.status !== "withdrawn" && ae("imports.withdraw") && /* @__PURE__ */ a.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ a.jsx("input", { value: G, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (de) => xe(de.target.value) })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: D || !G.trim(), onClick: () => void Ne("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ a.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ a.jsx("p", { children: K ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Zv({ navigate: m }) {
  const [N, O] = h.useState([]), [f, H] = h.useState(""), [Z, K] = h.useState(!1);
  return h.useEffect(() => {
    let W = !1;
    return (async () => {
      try {
        const [D, p, G] = await Promise.all([Zt("/api/v1/health"), Zt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!D.ok || !p.ok || !G.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [xe, E, oe] = await Promise.all([D.json(), p.json(), G.json()]), I = window.QaxcProjectId, ze = oe.tasks.filter((ae) => !I || ae.projectId === I).flatMap((ae) => (ae.events || []).map((Ne) => ({ id: Ne.id, action: ae.title + " · " + Ne.action, project_id: ae.projectId, created_at: Ne.uploadedAt, source: "现场作业" })));
        W || (K(xe.worker_online), O([...ze, ...E.items.map((ae) => ({ ...ae, source: "知识与学习" }))].sort((ae, Ne) => Date.parse(Ne.created_at) - Date.parse(ae.created_at)).slice(0, 100)));
      } catch (D) {
        W || H(D.message);
      }
    })(), () => {
      W = !0;
    };
  }, []), /* @__PURE__ */ a.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ a.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ a.jsxs("p", { role: "status", children: [
      "后台处理：",
      Z ? "在线" : "未连接或正在读取",
      "。成果接入、知识发布与资料处理共用后台任务队列。"
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "heading-actions", style: { margin: "20px 0", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ a.jsx("button", { className: "button primary", onClick: () => m("/jobs"), children: "处理任务与重试" }),
      /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => m("/settings/models"), children: "模型配置" }),
      /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => m("/task-packages"), children: "成果与证据" })
    ] }),
    f ? /* @__PURE__ */ a.jsx("p", { role: "alert", children: f }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx("h3", { children: "最近操作" }),
      /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。" }),
      N.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "时间" }),
          /* @__PURE__ */ a.jsx("th", { children: "业务" }),
          /* @__PURE__ */ a.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: N.map((W) => /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("td", { children: new Date(W.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ a.jsx("td", { children: W.source }),
          /* @__PURE__ */ a.jsx("td", { children: W.action })
        ] }, W.source + W.id)) })
      ] }) }) : /* @__PURE__ */ a.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function Vv({ deliveryId: m, navigate: N }) {
  const [O, f] = h.useState(!1), [H, Z] = h.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), K = h.useRef(!0);
  h.useEffect(() => (K.current = !0, () => {
    K.current = !1;
  }), []);
  async function W(p, G, xe) {
    const E = await Zt("/api/v1" + p, { method: G ? "POST" : "GET", headers: { "Content-Type": "application/json", ...xe ? { "Idempotency-Key": xe } : {} }, body: G ? JSON.stringify(G) : void 0 }), oe = await E.json();
    if (!E.ok) throw Error(oe.message || "处理失败，请重试");
    return oe;
  }
  async function D() {
    if (O) return;
    f(!0);
    const p = "archive-review:" + m, G = sessionStorage.getItem(p) || crypto.randomUUID();
    sessionStorage.setItem(p, G);
    try {
      Z("正在核验归档成果…");
      const xe = await W("/platform-archives", { delivery_id: m }, G);
      for (let E = 0; E < 60 && K.current; E++) {
        const oe = await W("/task-packages/" + xe.receipt_id);
        if (!K.current) return;
        if (oe.status === "ready") {
          Z("证据已校验，正在生成复盘…");
          const I = await W("/retrospectives", { mode: "task_process", task_package_id: oe.id });
          K.current && N("/retrospectives/" + I.id);
          return;
        }
        if (["failed", "withdrawn"].includes(oe.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        Z("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((I) => setTimeout(I, 1e3));
      }
      K.current && Z("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (xe) {
      K.current && Z(xe.message);
    } finally {
      K.current && f(!1);
    }
  }
  return /* @__PURE__ */ a.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ a.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ a.jsx("p", { role: "status", style: { margin: "20px 0" }, children: H }),
    /* @__PURE__ */ a.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: O, onClick: () => void D(), children: "生成 / 打开复盘" }),
      /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => N("/task-packages"), children: "成果处理清单" })
    ] })
  ] });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jv = (m) => m.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Kv = (m) => m.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (N, O, f) => f ? f.toUpperCase() : O.toLowerCase()
), ih = (m) => {
  const N = Kv(m);
  return N.charAt(0).toUpperCase() + N.slice(1);
}, _h = (...m) => m.filter((N, O, f) => !!N && N.trim() !== "" && f.indexOf(N) === O).join(" ").trim(), $v = (m) => {
  for (const N in m)
    if (N.startsWith("aria-") || N === "role" || N === "title")
      return !0;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Wv = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fv = h.forwardRef(
  ({
    color: m = "currentColor",
    size: N = 24,
    strokeWidth: O = 2,
    absoluteStrokeWidth: f,
    className: H = "",
    children: Z,
    iconNode: K,
    ...W
  }, D) => h.createElement(
    "svg",
    {
      ref: D,
      ...Wv,
      width: N,
      height: N,
      stroke: m,
      strokeWidth: f ? Number(O) * 24 / Number(N) : O,
      className: _h("lucide", H),
      ...!Z && !$v(W) && { "aria-hidden": "true" },
      ...W
    },
    [
      ...K.map(([p, G]) => h.createElement(p, G)),
      ...Array.isArray(Z) ? Z : [Z]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bt = (m, N) => {
  const O = h.forwardRef(
    ({ className: f, ...H }, Z) => h.createElement(Fv, {
      ref: Z,
      iconNode: N,
      className: _h(
        `lucide-${Jv(ih(m))}`,
        `lucide-${m}`,
        f
      ),
      ...H
    })
  );
  return O.displayName = ih(m), O;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Iv = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], ch = bt("activity", Iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pv = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], uh = bt("arrow-left", Pv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ex = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], ga = bt("arrow-right", ex);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tx = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], Hi = bt("book-open", tx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lx = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Jl = bt("chevron-right", lx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ax = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], pa = bt("circle-alert", ax);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sx = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], ya = bt("circle-check", sx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nx = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
], ix = bt("clipboard-list", nx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cx = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], Iu = bt("database", cx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ux = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], rh = bt("download", ux);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rx = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], dx = bt("external-link", rx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ox = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], yn = bt("file-check-2", ox);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fx = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], dh = bt("file-input", fx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hx = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], Pu = bt("file-search", hx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mx = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Ri = bt("folder-lock", mx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vx = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], xx = bt("history", vx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jx = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], oh = bt("layout-dashboard", jx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gx = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], fh = bt("loader-circle", gx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const px = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], hh = bt("play", px);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yx = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], bx = bt("plus", yx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _x = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Ol = bt("refresh-cw", _x);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nx = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], Sx = bt("search", Nx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wx = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], mh = bt("shield-check", wx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kx = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], Nh = bt("upload", kx);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ex = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], Cx = bt("users", Ex);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tx = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], qi = bt("x", Tx), Nl = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, jn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, vh = (m) => m ? new Date(m).toLocaleString("zh-CN") : "尚未同步", xh = (m) => {
  const N = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], O = (f) => N.includes(f) ? N.indexOf(f) : 100;
  return Object.entries(m).sort(([f], [H]) => O(f) - O(H));
}, er = (m) => typeof m == "object" ? JSON.stringify(m, null, 2) : String(m ?? "—");
function Ox({ asset: m, identity: N }) {
  const [O, f] = h.useState(""), [H, Z] = h.useState("");
  return h.useEffect(() => {
    let K = !1, W = "";
    return Zt(`/api/v1/assets/${m}/content`, { headers: { Authorization: `Bearer dev-${N}` } }).then(async (D) => {
      if (!D.ok) throw new Error("图片不可访问或已撤回");
      return D.blob();
    }).then((D) => {
      W = URL.createObjectURL(D), K ? URL.revokeObjectURL(W) : f(W);
    }).catch((D) => {
      K || Z(D.message);
    }), () => {
      K = !0, W && URL.revokeObjectURL(W);
    };
  }, [m, N]), H ? /* @__PURE__ */ a.jsx("p", { role: "alert", children: H }) : O ? /* @__PURE__ */ a.jsx("img", { className: "evidence-image", src: O, alt: "来源证据图片" }) : /* @__PURE__ */ a.jsx("p", { children: "正在读取图片…" });
}
function zx({ api: m, path: N, navigate: O, projects: f, identity: H }) {
  var kt, At;
  const [Z, K] = h.useState([]), [W, D] = h.useState([]), [p, G] = h.useState([]), [xe, E] = h.useState([]), [oe, I] = h.useState("reports"), ze = h.useRef(0), [ae, Ne] = h.useState(""), [de, X] = h.useState([]), [fe, le] = h.useState(null), [he, Ee] = h.useState(""), [ye, Me] = h.useState(!1), [ce, De] = h.useState([]), [ue, Je] = h.useState({}), [we, Ce] = h.useState(0), [b, U] = h.useState(null), [Q, pe] = h.useState(null), [v, T] = h.useState(null), [Y, L] = h.useState(new URLSearchParams(location.search).get("source") || ""), [P, re] = h.useState(""), [F, Qe] = h.useState(!1), [z, ne] = h.useState(""), [ke, se] = h.useState(""), [me, qe] = h.useState(!0), [Fe, mt] = h.useState(!1), [rt, He] = h.useState(0), [tt, Ze] = h.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [Ie, te] = h.useState(""), [dt, be] = h.useState(null), [Pe, at] = h.useState([]), [ct, Le] = h.useState(""), [Ye, _] = h.useState(0), [$, je] = h.useState(!1), [et, Re] = h.useState("csv"), [Se, j] = h.useState(""), [ie, ee] = h.useState(""), [lt, Ke] = h.useState(((kt = f.find((c) => c.can_run)) == null ? void 0 : kt.id) || (Nt ? "" : "demo-airport")), d = f.some((c) => c.can_run), o = N.startsWith("/records/"), A = N.startsWith("/imports/") && N !== "/imports/new", J = Z.find((c) => c.id === Y), Be = W.filter((c) => c.kind === (J == null ? void 0 : J.kind) && c.project_id === (J == null ? void 0 : J.project_id));
  h.useEffect(() => {
    te(""), at([]), Le(""), _(0), ne(""), se(""), T(null);
  }, [N]), h.useEffect(() => {
    let c = !1;
    qe(!0), ne(""), pe(null), U(null);
    const q = new URLSearchParams(Object.entries(tt).filter(([, ge]) => !!ge));
    q.set("limit", "15"), Ie && q.set("cursor", Ie);
    async function V() {
      try {
        const [ge, ot] = await Promise.all([m("/sources?limit=100"), m("/input-files")]);
        if (c) return;
        if (K(ge.items), D(ot.items), N === "/sources" || N === "/imports") {
          const gt = await m("/imports?limit=15" + (Ie ? "&cursor=" + encodeURIComponent(Ie) : ""));
          if (c) return;
          G(gt.items), be(gt.next_cursor);
        } else if (A) {
          const gt = await m(`${N}?after_row=${Ye}&only_issues=${$}`);
          c || U(gt);
        } else if (o) {
          const gt = await m(N + (ct ? "?version=" + ct : ""));
          c || pe(gt);
        } else if (N === "/records") {
          const gt = await m("/records?" + q);
          if (c) return;
          if (De(gt.items), be(gt.next_cursor), Je(gt.totals_by_kind), Ce(gt.detail_groups_after_confirmed_links), oe === "reports") {
            const Gt = new URLSearchParams(q);
            Gt.delete("cursor"), Ie && Gt.set("after_id", Ie);
            const dl = await m("/reports?" + Gt);
            if (c) return;
            E(dl.items), be(dl.next_cursor);
          }
        }
      } catch (ge) {
        c || ne(ge.message);
      } finally {
        c || qe(!1);
      }
    }
    return V(), () => {
      c = !0;
    };
  }, [N, tt, Ie, ct, rt, Ye, $, oe]), h.useEffect(() => {
    if (!A || !b || !["queued", "running"].includes(b.status)) return;
    let c = !1;
    const q = setInterval(() => {
      m(`${N}?after_row=${Ye}&only_issues=${$}`).then((V) => {
        c || U(V);
      }).catch((V) => {
        c || ne(V.message);
      });
    }, 1500);
    return () => {
      c = !0, clearInterval(q);
    };
  }, [N, b == null ? void 0 : b.status, Ye, $]), h.useEffect(() => {
    ze.current++, Ne(""), X([]), le(null), Ee("");
  }, [tt, oe, N]);
  const Ue = async (c, q = !1) => {
    const V = ++ze.current;
    if (!q && ae === c) {
      Ne(""), Me(!1);
      return;
    }
    q || (X([]), le(null)), Ne(c), Me(!0), Ee("");
    const ge = new URLSearchParams(Object.entries(tt).filter(([, ot]) => !!ot));
    ge.set("document_id", c), ge.set("limit", "15"), q && fe && ge.set("cursor", fe);
    try {
      const ot = await m("/records?" + ge);
      if (V !== ze.current) return;
      X((gt) => q ? [...gt, ...ot.items] : ot.items), le(ot.next_cursor);
    } catch (ot) {
      V === ze.current && Ee(ot.message);
    } finally {
      V === ze.current && Me(!1);
    }
  }, nt = async (c) => {
    mt(!0), ne(""), se("");
    try {
      await c();
    } catch (q) {
      ne(q.message);
    } finally {
      mt(!1);
    }
  }, zt = () => nt(async () => {
    for (const c of f.filter((q) => q.can_run))
      for (const q of c.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const V = `mock-${c.id}-${q}`;
        Z.some((ge) => ge.namespace === V && ge.project_id === c.id) || await m("/sources", { method: "POST", body: JSON.stringify({ name: `${c.id === "demo-airport" ? "机场" : "地铁"} · ${Nl[q]}（模拟）`, namespace: V, kind: q, project_id: c.id, mapping_template: q === "governance_export" ? "governance-v1" : `${q}-v1` }) });
      }
    se("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), He((c) => c + 1);
  }), Wt = /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ a.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ a.jsx("button", { disabled: !Pe.length, onClick: () => {
        te(Pe.at(-1) || ""), at(Pe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ a.jsx("button", { disabled: !dt, onClick: () => {
        at([...Pe, Ie]), te(dt || "");
      }, children: "下一页" })
    ] })
  ] }), rl = (c, q) => {
    Ze({ ...tt, [c]: q }), te(""), at([]);
  }, tl = (c) => nt(async () => {
    const q = await Zt(`/api/v1/assets/${c}/content`, { headers: { Authorization: `Bearer dev-${H}` } });
    if (!q.ok) {
      const ot = await q.json();
      throw new Error(ot.message);
    }
    const V = URL.createObjectURL(await q.blob()), ge = document.createElement("a");
    ge.href = V, ge.download = "来源文件", ge.click(), URL.revokeObjectURL(V);
  });
  return /* @__PURE__ */ a.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(Iu, { size: 19 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: Nt ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ a.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    z && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      z,
      /* @__PURE__ */ a.jsx("button", { onClick: () => He((c) => c + 1), children: "重新加载" })
    ] }),
    ke && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      ke
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ a.jsx("button", { className: N === "/sources" ? "selected" : "", onClick: () => O("/sources"), children: "来源管理" }),
        /* @__PURE__ */ a.jsx("button", { className: N.startsWith("/imports") ? "selected" : "", onClick: () => O("/imports"), children: "历史项目" }),
        /* @__PURE__ */ a.jsx("button", { className: N.startsWith("/records") ? "selected" : "", onClick: () => O("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => He((c) => c + 1), disabled: me, children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    me ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取数据…" }) : N === "/sources" ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ a.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Nt && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: Fe || !d, onClick: () => void zt(), children: [
          /* @__PURE__ */ a.jsx(Iu, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "source-grid", children: Z.map((c) => {
        var q, V;
        return /* @__PURE__ */ a.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ a.jsx("span", { className: "source-icon", children: /* @__PURE__ */ a.jsx(Iu, { size: 22 }) }),
            /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: Nl[c.kind] })
          ] }),
          /* @__PURE__ */ a.jsx("h2", { children: c.name }),
          /* @__PURE__ */ a.jsx("p", { children: (q = f.find((ge) => ge.id === c.project_id)) == null ? void 0 : q.name }),
          /* @__PURE__ */ a.jsxs("dl", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ a.jsx("dd", { children: c.mapping_version }),
            /* @__PURE__ */ a.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ a.jsx("dd", { children: vh(c.cursor.synced_at) }),
            /* @__PURE__ */ a.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ a.jsx("dd", { children: c.namespace })
          ] }),
          /* @__PURE__ */ a.jsxs("button", { className: "button secondary", disabled: !((V = f.find((ge) => ge.id === c.project_id)) != null && V.can_run), onClick: () => {
            L(c.id), re(""), O("/imports/new?source=" + c.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ a.jsx(ga, { size: 16 })
          ] })
        ] }, c.id);
      }) }),
      !Z.length && /* @__PURE__ */ a.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ a.jsx(Pu, { size: 38 }),
        /* @__PURE__ */ a.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ a.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      d && /* @__PURE__ */ a.jsxs("details", { className: "panel custom-source", open: Nt || void 0, children: [
        /* @__PURE__ */ a.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ a.jsx("input", { value: Se, onChange: (c) => j(c.target.value) })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ a.jsx("input", { placeholder: "例如 mock-extra-csv", value: ie, onChange: (c) => ee(c.target.value) })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ a.jsx("select", { value: et, onChange: (c) => Re(c.target.value), children: ["csv", "excel", "governance_export"].map((c) => /* @__PURE__ */ a.jsx("option", { value: c, children: Nl[c] }, c)) })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ a.jsx("select", { value: lt, onChange: (c) => Ke(c.target.value), children: f.filter((c) => c.can_run).map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Fe || !Se || !ie, onClick: () => void nt(async () => {
          await m("/sources", { method: "POST", body: JSON.stringify({ name: Se, namespace: ie, kind: et, project_id: lt, mapping_template: et === "governance_export" ? "governance-v1" : `${et}-v1` }) }), He((c) => c + 1), se("来源已创建。");
        }), children: "创建来源" })
      ] })
    ] }) : N === "/imports/new" ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel import-form", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("h2", { children: "新建历史项目" }),
          /* @__PURE__ */ a.jsx("span", { children: "选择来源 → 预览映射与异常 → 后台增量接入" })
        ] }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "form-body", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "数据来源",
              /* @__PURE__ */ a.jsxs("select", { "aria-label": "数据来源", value: Y, onChange: (c) => {
                L(c.target.value), re(""), T(null);
              }, children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "请选择" }),
                Z.filter((c) => {
                  var q;
                  return (q = f.find((V) => V.id === c.project_id)) == null ? void 0 : q.can_run;
                }).map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id))
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ a.jsxs("select", { "aria-label": "输入文件", value: P, onChange: (c) => {
                re(c.target.value), T(null);
              }, children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "请选择" }),
                Be.map((c) => /* @__PURE__ */ a.jsx("option", { value: c.asset_id, children: c.label }, c.asset_id))
              ] })
            ] })
          ] }),
          !Nt && /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: F, onChange: (c) => Qe(c.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Nt && J && /* @__PURE__ */ a.jsxs("section", { children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ a.jsx("input", { type: "file", disabled: Fe, accept: J.kind === "csv" ? ".csv" : J.kind === "excel" ? ".xlsx" : ".json", onChange: (c) => {
                var V;
                const q = (V = c.target.files) == null ? void 0 : V[0];
                c.target.value = "", q && nt(async () => {
                  if (q.size > 5e6) throw new Error("文件不能超过5MB");
                  const ge = new Uint8Array(await q.arrayBuffer());
                  let ot = "";
                  for (let Gt = 0; Gt < ge.length; Gt += 8192) ot += String.fromCharCode(...ge.subarray(Gt, Gt + 8192));
                  const gt = await m("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: J.project_id, kind: J.kind, name: q.name, base64: btoa(ot) }) });
                  D((Gt) => [...Gt, gt]), re(gt.asset_id), T(null), se("文件已上传，请预览字段与异常后提交接入。");
                });
              } })
            ] }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "项目ID：",
              J.project_id,
              "。文件必须保留稳定记录ID、报告ID和项目ID；记录类型为detail、review或summary。"
            ] }),
            /* @__PURE__ */ a.jsxs("details", { children: [
              /* @__PURE__ */ a.jsx("summary", { children: "查看所需表头" }),
              /* @__PURE__ */ a.jsx("p", { children: Object.values(J.mapping).join("、") })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("button", { className: "button secondary", disabled: Fe || !Y || !P, onClick: () => void nt(async () => {
            T(await m("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: Y, input_asset_id: P }) }));
          }), children: [
            /* @__PURE__ */ a.jsx(Pu, { size: 16 }),
            "预览字段与异常"
          ] })
        ] })
      ] }),
      v && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsxs("section", { className: "metrics ingest-metrics", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ a.jsx("span", { children: "输入记录" }),
            /* @__PURE__ */ a.jsx("strong", { children: v.total })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ a.jsx("span", { children: "原始字段" }),
            /* @__PURE__ */ a.jsx("strong", { children: v.raw_columns.length })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ a.jsx("span", { children: "需核查行" }),
            /* @__PURE__ */ a.jsx("strong", { children: v.warning_rows })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ a.jsx("span", { children: "不能接入行" }),
            /* @__PURE__ */ a.jsx("strong", { children: v.failed_rows })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "字段映射" }),
            /* @__PURE__ */ a.jsx("span", { children: "未映射字段仍完整保留在原始字段中" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "mapping-grid", children: Object.entries(v.mapping).map(([c, q]) => /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("code", { children: q }),
            /* @__PURE__ */ a.jsx(ga, { size: 13 }),
            /* @__PURE__ */ a.jsx("strong", { children: c })
          ] }, c)) })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel preview-table", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "内容与异常预览" }),
            /* @__PURE__ */ a.jsx("span", { children: "预览不生成业务记录 · 最多展示20行" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
            /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
              /* @__PURE__ */ a.jsx("th", { children: "来源行 / 身份" }),
              /* @__PURE__ */ a.jsx("th", { children: "生效描述" }),
              /* @__PURE__ */ a.jsx("th", { children: "类型" }),
              /* @__PURE__ */ a.jsx("th", { children: "异常" })
            ] }) }),
            /* @__PURE__ */ a.jsx("tbody", { children: v.preview.map((c) => /* @__PURE__ */ a.jsxs("tr", { children: [
              /* @__PURE__ */ a.jsxs("td", { children: [
                c.row_number,
                /* @__PURE__ */ a.jsx("small", { children: c.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ a.jsx("td", { children: er(c.effective_fields.description) }),
              /* @__PURE__ */ a.jsx("td", { children: Nl[String(c.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ a.jsx("td", { children: [...c.errors, ...c.issues].join("；") || "通过" })
            ] }, c.row_number)) })
          ] }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ a.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: Fe, onClick: () => void nt(async () => {
              const c = await m("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: Y, input_asset_id: P, input_hash: v.input_hash, fail_after: !Nt && F ? 2 : null }) });
              O("/imports/" + c.id);
            }), children: [
              /* @__PURE__ */ a.jsx(Nh, { size: 16 }),
              Fe ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : N === "/imports" ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: !d, onClick: () => O("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ a.jsx(ga, { size: 15 })
        ] })
      ] }),
      p.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "来源 / 时间" }),
          /* @__PURE__ */ a.jsx("th", { children: "状态" }),
          /* @__PURE__ */ a.jsx("th", { children: "新增" }),
          /* @__PURE__ */ a.jsx("th", { children: "更新" }),
          /* @__PURE__ */ a.jsx("th", { children: "跳过" }),
          /* @__PURE__ */ a.jsx("th", { children: "失败" }),
          /* @__PURE__ */ a.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: p.map((c) => /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsxs("td", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: c.source_name }),
            /* @__PURE__ */ a.jsx("small", { children: vh(c.created_at) })
          ] }),
          /* @__PURE__ */ a.jsx("td", { children: jn[c.status] }),
          ["created", "updated", "skipped", "failed"].map((q) => /* @__PURE__ */ a.jsx("td", { children: c.counts[q] }, q)),
          /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/imports/" + c.id), children: "查看历史项目" }) })
        ] }, c.id)) })
      ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ a.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      Wt
    ] }) : A && b ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("button", { className: "text-button back", onClick: () => O("/imports"), children: [
        /* @__PURE__ */ a.jsx(uh, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: jn[b.status] }),
          /* @__PURE__ */ a.jsx("h2", { children: b.source.name }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "已处理 ",
            b.counts.processed,
            " / ",
            b.counts.total,
            " 条 · ",
            b.progress,
            "%"
          ] })
        ] }),
        b.job_status === "failed" && ((At = f.find((c) => c.id === b.source.project_id)) == null ? void 0 : At.can_run) && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: Fe, onClick: () => void nt(async () => {
          await m(`/jobs/${b.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: b.row_version }) }), He((c) => c + 1);
        }), children: [
          /* @__PURE__ */ a.jsx(Ol, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      b.error && /* @__PURE__ */ a.jsx("div", { className: "feedback error", children: b.error }),
      /* @__PURE__ */ a.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((c) => /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ a.jsx("span", { children: c === "failed" ? "失败行" : jn[c] }),
        /* @__PURE__ */ a.jsx("strong", { children: b.counts[c] })
      ] }, c)) }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel batch-meta", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "实际输入SHA-256" }),
          /* @__PURE__ */ a.jsx("code", { children: b.input_hash })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "规则版本" }),
          /* @__PURE__ */ a.jsx("strong", { children: b.rule_version })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "记录类型" }),
          /* @__PURE__ */ a.jsx("strong", { children: Object.entries(b.counts.kinds || {}).map(([c, q]) => `${Nl[c]} ${q}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ a.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: $, onChange: (c) => {
              je(c.target.checked), _(0);
            } }),
            "只看异常行"
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "输入行" }),
            /* @__PURE__ */ a.jsx("th", { children: "结果" }),
            /* @__PURE__ */ a.jsx("th", { children: "说明" }),
            /* @__PURE__ */ a.jsx("th", { children: "记录" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: b.rows.map((c) => /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("td", { children: c.row_number }),
            /* @__PURE__ */ a.jsx("td", { children: c.outcome === "failed" ? "失败" : jn[c.outcome] }),
            /* @__PURE__ */ a.jsx("td", { children: c.issues.join("；") || "通过" }),
            /* @__PURE__ */ a.jsx("td", { children: c.record_id && /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/records/" + c.record_id), children: "查看证据" }) })
          ] }, c.row_number)) })
        ] }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: !Ye, onClick: () => _(0), children: "返回首段" }),
          /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: !b.next_row, onClick: () => _(b.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : N === "/records" ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((c) => /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            Nl[c],
            "记录"
          ] }),
          /* @__PURE__ */ a.jsx("strong", { children: ue[c] || 0 })
        ] }, c)),
        /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ a.jsx("span", { children: "确认关联后的明细组" }),
          /* @__PURE__ */ a.jsx("strong", { children: we }),
          /* @__PURE__ */ a.jsx("small", { children: "仅合并已确认关系，非独立隐患结论" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "record-filters", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "项目筛选", value: tt.project_id, onChange: (c) => rl("project_id", c.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "全部项目" }),
              f.map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "来源筛选", value: tt.source_id, onChange: (c) => rl("source_id", c.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "全部来源" }),
              Z.map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "记录类型筛选", value: tt.record_kind, onChange: (c) => rl("record_kind", c.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((c) => /* @__PURE__ */ a.jsx("option", { value: c, children: Nl[c] }, c))
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "质量状态筛选", value: tt.quality_status, onChange: (c) => rl("quality_status", c.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ a.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ a.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ a.jsx("input", { type: "date", value: tt.from_date, onChange: (c) => rl("from_date", c.target.value) })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ a.jsx("input", { type: "date", value: tt.to_date, onChange: (c) => rl("to_date", c.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ a.jsx("button", { "aria-pressed": oe === "reports", onClick: () => {
            I("reports"), te(""), at([]), Ne("");
          }, children: "报告清单" }),
          /* @__PURE__ */ a.jsx("button", { "aria-pressed": oe === "rows", onClick: () => {
            I("rows"), te(""), at([]);
          }, children: "逐条数据" })
        ] }),
        oe === "reports" ? /* @__PURE__ */ a.jsx("div", { className: "reports-list", children: xe.length ? xe.map((c) => /* @__PURE__ */ a.jsxs("article", { children: [
          /* @__PURE__ */ a.jsxs("button", { className: "report-toggle", "aria-expanded": ae === c.id, onClick: () => void Ue(c.id), children: [
            /* @__PURE__ */ a.jsx(Pu, { size: 20 }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: c.title }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                c.source_name,
                " · ",
                c.report_id
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              c.count,
              " 条风险数据"
            ] }),
            /* @__PURE__ */ a.jsx(ga, { size: 16 })
          ] }),
          ae === c.id && /* @__PURE__ */ a.jsxs("div", { className: "report-records", children: [
            he && /* @__PURE__ */ a.jsx("p", { role: "alert", children: he }),
            ye ? /* @__PURE__ */ a.jsx("p", { children: "正在读取报告内风险数据…" }) : de.map((q) => /* @__PURE__ */ a.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => O("/records/" + q.id), children: q.description || "缺少描述" }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                Nl[q.record_kind],
                " · v",
                q.current_version
              ] })
            ] }, q.id)),
            fe && /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: ye, onClick: () => void Ue(c.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, c.id)) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ a.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : ce.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ a.jsx("th", { children: "类型" }),
            /* @__PURE__ */ a.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ a.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ a.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: ce.map((c) => {
            var q;
            return /* @__PURE__ */ a.jsxs("tr", { children: [
              /* @__PURE__ */ a.jsxs("td", { children: [
                /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => O("/records/" + c.id), children: c.description || "缺少描述" }),
                /* @__PURE__ */ a.jsx("small", { children: (q = Z.find((V) => V.id === c.source_id)) == null ? void 0 : q.name })
              ] }),
              /* @__PURE__ */ a.jsx("td", { children: Nl[c.record_kind] }),
              /* @__PURE__ */ a.jsx("td", { children: c.occurred_on || "未知" }),
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("span", { className: `status ${c.quality_status === "valid" ? "succeeded" : "retrying"}`, children: c.quality_status === "valid" ? "通过" : "需核查" }) }),
              /* @__PURE__ */ a.jsxs("td", { children: [
                "v",
                c.current_version
              ] })
            ] }, c.id);
          }) })
        ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "没有符合条件的记录" }),
          /* @__PURE__ */ a.jsx("p", { children: "调整筛选条件，或先完成一批资料接入。" })
        ] }),
        Wt
      ] }),
      /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : o && Q ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("button", { className: "text-button back", onClick: () => O("/records"), children: [
        /* @__PURE__ */ a.jsx(uh, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsxs("span", { className: "role-tag", children: [
            Nl[Q.record_kind],
            " · ",
            Nt ? "来源记录" : "模拟记录"
          ] }),
          /* @__PURE__ */ a.jsx("h2", { children: Q.description || "缺少描述" }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            Q.source.name,
            " · ",
            Q.external_record_id
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("label", { children: [
          "查看版本",
          /* @__PURE__ */ a.jsx("select", { "aria-label": "查看版本", value: Q.selected_version, onChange: (c) => Le(c.target.value), children: Q.versions.map((c) => /* @__PURE__ */ a.jsxs("option", { value: c.version, children: [
            "v",
            c.version,
            c.version === Q.current_version ? " · 当前" : ""
          ] }, c.version)) })
        ] })
      ] }),
      Q.issues.length > 0 && /* @__PURE__ */ a.jsx("div", { className: "feedback error", children: Q.issues.join("；") }),
      /* @__PURE__ */ a.jsxs("div", { className: "record-columns", children: [
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "来源原始字段" }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              Object.keys(Q.raw_fields).length,
              "个字段 · 完整保留"
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "field-list", children: xh(Q.raw_fields).map(([c, q]) => /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: c }),
            /* @__PURE__ */ a.jsx("dd", { children: er(q) })
          ] }, c)) })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ a.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "field-list", children: xh(Q.effective_fields).map(([c, q]) => /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("dt", { children: c }),
            /* @__PURE__ */ a.jsx("dd", { children: er(q) })
          ] }, c)) }),
          /* @__PURE__ */ a.jsxs("details", { className: "provenance", children: [
            /* @__PURE__ */ a.jsx("summary", { children: "来源定位 / 人工修订 / 内容版本" }),
            /* @__PURE__ */ a.jsx("pre", { children: JSON.stringify(Q.provenance, null, 2) })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "report-note", children: [
            /* @__PURE__ */ a.jsxs("strong", { children: [
              "原报告：",
              Q.document.report_id
            ] }),
            /* @__PURE__ */ a.jsx("p", { children: Q.document.note })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel evidence-section", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "证据与图片关系" }),
          /* @__PURE__ */ a.jsx("span", { children: "确定锚点与候选关联分别标识" })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "evidence-grid", children: Q.evidence.map((c) => {
          var q;
          return /* @__PURE__ */ a.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: Nl[c.type] }),
              /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: c.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ a.jsx("p", { children: JSON.stringify(c.locator) }),
            c.type !== "source_row" && c.asset_id ? /* @__PURE__ */ a.jsx(Ox, { asset: c.asset_id, identity: H }) : c.type === "source_row" ? /* @__PURE__ */ a.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ a.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            c.asset_id && ((q = f.find((V) => V.id === Q.project_id)) == null ? void 0 : q.can_run) && /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: Fe, onClick: () => void tl(c.asset_id), children: "下载对应来源文件" })
          ] }, c.id);
        }) })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ a.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        Q.links.length ? Q.links.map((c) => {
          var q;
          return /* @__PURE__ */ a.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: jn[c.review_state] }),
              /* @__PURE__ */ a.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/records/" + c.other_record_id), children: "打开另一条记录" }),
            ((q = f.find((V) => V.id === Q.project_id)) == null ? void 0 : q.roles.some((V) => ["admin", "reviewer"].includes(V))) && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Fe || c.review_state === "stale", onClick: () => void nt(async () => {
                await m(`/record-links/${c.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: c.row_version, decision: "confirmed" }) }), He((V) => V + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: Fe || c.review_state === "stale", onClick: () => void nt(async () => {
                await m(`/record-links/${c.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: c.row_version, decision: "rejected" }) }), He((V) => V + 1);
              }), children: "排除" })
            ] })
          ] }, c.id);
        }) : /* @__PURE__ */ a.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : z ? null : /* @__PURE__ */ a.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
function wt(m, N) {
  return m ? m.permissions != null ? m.permissions.includes(N) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(N) ? !!m.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(N) ? m.roles.some((O) => ["admin", "reviewer"].includes(O)) : N === "training.manage" ? m.roles.some((O) => ["admin", "teacher"].includes(O)) : N === "training.review" ? m.roles.some((O) => ["admin", "teacher", "reviewer"].includes(O)) : !0 : !1;
}
const Kl = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, jh = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, gh = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function tr(m, N) {
  return [["标题", m.title, N.title], ["事实", m.facts.map((f) => f.text).join(`
`), N.facts.map((f) => f.text).join(`
`)], ["建议", m.suggestions.join(`
`), N.suggestions.join(`
`)], ["引用证据", m.facts.flatMap((f) => f.evidence_ids).join("、"), N.facts.flatMap((f) => f.evidence_ids).join("、")], ["标准依据", JSON.stringify(m.standards), JSON.stringify(N.standards)], ["施工要点", JSON.stringify(m.construction_points || []), JSON.stringify(N.construction_points || [])]].filter(([, f, H]) => f !== H);
}
function Ax({ api: m, path: N, navigate: O, projects: f, identity: H }) {
  var d;
  const [Z, K] = h.useState(!0), [W, D] = h.useState(!1), [p, G] = h.useState(""), [xe, E] = h.useState(""), [oe, I] = h.useState(0), [ze, ae] = h.useState([]), [Ne, de] = h.useState([]), [X, fe] = h.useState([]), [le, he] = h.useState("knowledge_revision"), [Ee, ye] = h.useState(""), [Me, ce] = h.useState(""), [De, ue] = h.useState(""), [Je, we] = h.useState(null), [Ce, b] = h.useState([]), [U, Q] = h.useState(null), [pe, v] = h.useState("resolved"), [T, Y] = h.useState(""), [L, P] = h.useState(""), [re, F] = h.useState(((d = f.find((o) => wt(o, "knowledge.process"))) == null ? void 0 : d.id) || ""), [Qe, z] = h.useState([]), [ne, ke] = h.useState([]), [se, me] = h.useState("case_card"), [qe, Fe] = h.useState("normal"), [mt, rt] = h.useState(null), [He, tt] = h.useState(sessionStorage.getItem("b03-last-job-" + H) || ""), [Ze, Ie] = h.useState(null), [te, dt] = h.useState(null), [be, Pe] = h.useState(null), [at, ct] = h.useState(""), [Le, Ye] = h.useState(!1), _ = /^\/knowledge\/[^/]+\/edit$/.test(N), $ = f.some((o) => wt(o, "knowledge.process")), je = f.some((o) => wt(o, "knowledge.review")), et = N.startsWith("/quality"), Re = N === "/reviews";
  h.useEffect(() => {
    ue(""), b([]), ce(""), ye(""), G(""), E(""), Ye(!1), ct("");
  }, [N]), h.useEffect(() => {
    let o = !1;
    K(!0), G(""), dt(null), Pe(null);
    async function A() {
      try {
        if (et) {
          const J = await m(`/quality/issues?limit=20${Ee ? "&rule_code=" + Ee : ""}${Me ? "&status=" + Me : ""}${De ? "&cursor=" + encodeURIComponent(De) : ""}`);
          if (o) return;
          de(J.items), fe(J.summary), we(J.next_cursor);
        } else if (_) {
          const J = await m(N.replace("/edit", ""));
          if (o) return;
          dt(J), Pe(structuredClone(J.content));
        } else if (Re) {
          const J = await m(`/reviews?object_type=${le}&state=${Me || "pending_review"}${De ? "&cursor=" + encodeURIComponent(De) : ""}`);
          if (o) return;
          ae(J.items), we(J.next_cursor);
        } else {
          const J = await m(`/knowledge?limit=20${Me ? "&state=" + Me : ""}${De ? "&cursor=" + encodeURIComponent(De) : ""}`);
          if (o) return;
          if (ae(J.items), we(J.next_cursor), $ && re) {
            const Be = await m("/knowledge/source-options?project_id=" + re);
            o || z(Be.items);
          }
        }
      } catch (J) {
        o || G(J.message);
      } finally {
        o || K(!1);
      }
    }
    return A(), () => {
      o = !0;
    };
  }, [N, Me, Ee, De, oe, re, le]), h.useEffect(() => {
    ke([]), rt(null);
  }, [re, se, qe]), h.useEffect(() => {
    if (!He || et || _ || Re || !$) return;
    let o = !1;
    const A = () => {
      m("/knowledge/generation-jobs/" + He).then((Be) => {
        o || (Ie(Be), Be.status === "succeeded" && I((Ue) => Ue + 1));
      }).catch((Be) => {
        o || G(Be.message);
      });
    };
    A();
    const J = setInterval(() => {
      (!Ze || ["queued", "running", "retrying"].includes(Ze.status)) && A();
    }, 1800);
    return () => {
      o = !0, clearInterval(J);
    };
  }, [He, N, Ze == null ? void 0 : Ze.status]);
  const Se = async (o) => {
    D(!0), G(""), E("");
    try {
      await o();
    } catch (A) {
      G(A.message);
    } finally {
      D(!1);
    }
  }, j = () => ({ record_version_ids: ne, type: se, template_version: "mock-v1", mock_scenario: qe }), ie = /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ a.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ a.jsx("button", { disabled: !Ce.length, onClick: () => {
        ue(Ce.at(-1) || ""), b(Ce.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ a.jsx("button", { disabled: !Je, onClick: () => {
        b([...Ce, De]), ue(Je || "");
      }, children: "下一页" })
    ] })
  ] }), ee = te && wt(f.find((o) => o.id === te.project_id), "knowledge.process"), lt = te && wt(f.find((o) => o.id === te.project_id), "knowledge.review"), Ke = (o) => Se(async () => {
    if (!te) return;
    const A = o === "submit" ? `/knowledge/${te.id}/submit-review` : `/reviews/${te.revision_id}/${o}`;
    await m(A, { method: "POST", body: JSON.stringify({ row_version: te.row_version, revision_id: te.revision_id, reason: at, evidence_checked: Le }) }), E(o === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), I((J) => J + 1), Ye(!1);
  });
  return /* @__PURE__ */ a.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(yn, { size: 19 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: "质量核查与知识加工 · 模拟模式" }),
        /* @__PURE__ */ a.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、模拟建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    p && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      p,
      /* @__PURE__ */ a.jsx("button", { onClick: () => I((o) => o + 1), children: "重新加载" })
    ] }),
    xe && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      xe
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ a.jsx("button", { onClick: () => O("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ a.jsx("button", { className: et ? "selected" : "", onClick: () => O("/quality"), children: "质量核查" }),
        /* @__PURE__ */ a.jsx("button", { className: !et && !Re ? "selected" : "", onClick: () => O("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ a.jsx("button", { className: Re ? "selected" : "", onClick: () => O("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", disabled: Z, onClick: () => I((o) => o + 1), children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Z ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取工作区…" }) : et ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx("section", { className: "quality-summary", children: Object.entries(jh).map(([o, A]) => /* @__PURE__ */ a.jsxs("button", { className: Ee === o ? "panel selected-quality" : "panel", "aria-pressed": Ee === o, onClick: () => {
        ye(Ee === o ? "" : o), ce("open"), ue(""), b([]);
      }, children: [
        /* @__PURE__ */ a.jsx("span", { children: A }),
        /* @__PURE__ */ a.jsx("strong", { children: X.filter((J) => J.rule_code === o && J.status === "open").reduce((J, Be) => J + Be.count, 0) }),
        /* @__PURE__ */ a.jsx("small", { children: "待核查" })
      ] }, o)) }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "质量处理状态", value: Me, onChange: (o) => {
            ce(o.target.value), ue(""), b([]);
          }, children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((o) => /* @__PURE__ */ a.jsx("option", { value: o, children: Kl[o] }, o))
          ] })
        ] }),
        Ne.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ a.jsx("th", { children: "问题" }),
            /* @__PURE__ */ a.jsx("th", { children: "状态" }),
            /* @__PURE__ */ a.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: Ne.map((o) => {
            var A, J;
            return /* @__PURE__ */ a.jsxs("tr", { children: [
              /* @__PURE__ */ a.jsxs("td", { children: [
                /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => O("/records/" + o.record_id), children: o.description || "缺少描述" }),
                /* @__PURE__ */ a.jsx("small", { children: jh[o.rule_code] || o.rule_code })
              ] }),
              /* @__PURE__ */ a.jsxs("td", { children: [
                o.message,
                o.annotations.length > 0 && /* @__PURE__ */ a.jsxs("small", { children: [
                  "最近说明：",
                  (A = o.annotations.at(-1)) == null ? void 0 : A.reason
                ] })
              ] }),
              /* @__PURE__ */ a.jsx("td", { children: Kl[o.status] }),
              /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: !((J = f.find((Be) => Be.id === o.project_id)) != null && J.can_run), onClick: () => {
                Q(o), Y(""), P("");
              }, children: "核查处理" }) })
            ] }, o.id);
          }) })
        ] }) }) : /* @__PURE__ */ a.jsx("div", { className: "empty", children: /* @__PURE__ */ a.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ie
      ] })
    ] }) : _ && te && be ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsxs("h2", { children: [
            gh[te.type],
            " · v",
            te.version
          ] }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            Kl[te.state],
            " · 生成适配器：",
            te.model_ref
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => O("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      te.source.version !== te.source.current_version && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        te.source.version,
        "更新到v",
        te.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ a.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O((te.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + te.source.record_id), children: te.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ a.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              te.source.version
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ a.jsx("p", { children: String(te.source.raw_fields.description || te.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ a.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ a.jsx("p", { children: String(te.source.effective_fields.description || "缺失") }),
            te.source.versions && te.source.versions.length > 1 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsxs("h3", { children: [
                "跨记录固定来源（",
                te.source.versions.length,
                "条）"
              ] }),
              te.source.versions.map((o) => /* @__PURE__ */ a.jsxs("details", { children: [
                /* @__PURE__ */ a.jsxs("summary", { children: [
                  "来源 v",
                  o.version,
                  " · ",
                  o.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ a.jsx("p", { children: JSON.stringify(o.effective_fields, null, 2) }),
                /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/records/" + o.record_id), children: "打开风险记录" })
              ] }, o.record_version_id))
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              be.project_name,
              " · ",
              be.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "证据定位" }),
            te.source.evidence.map((o) => /* @__PURE__ */ a.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ a.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[o.type] || "来源证据" }),
              /* @__PURE__ */ a.jsx("p", { children: JSON.stringify(o.locator) }),
              /* @__PURE__ */ a.jsx("code", { children: o.id })
            ] }, o.id)),
            te.source.annotations.length > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsx("h3", { children: "人工补充（独立保存）" }),
              te.source.annotations.map((o, A) => /* @__PURE__ */ a.jsxs("p", { children: [
                o.reason,
                " · ",
                JSON.stringify(o.value)
              ] }, A))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel card-editor", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "结构化知识候选" }),
            /* @__PURE__ */ a.jsx("span", { children: "内容变更保存为新版本" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "标题",
              /* @__PURE__ */ a.jsx("input", { value: be.title, disabled: !ee, onChange: (o) => Pe({ ...be, title: o.target.value }) })
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "来源事实 / 人工补充" }),
            be.facts.map((o, A) => /* @__PURE__ */ a.jsxs("label", { children: [
              o.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ a.jsx("textarea", { disabled: !ee, value: o.text, onChange: (J) => Pe({ ...be, facts: be.facts.map((Be, Ue) => Ue === A ? { ...Be, text: J.target.value, source_kind: "human_annotation" } : Be) }) }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                "引用：",
                o.evidence_ids.join("、")
              ] })
            ] }, A)),
            be.construction_points && be.construction_points.length > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsxs("h3", { children: [
                "施工要点 · ",
                be.category_name || "待分类"
              ] }),
              /* @__PURE__ */ a.jsx("p", { className: "small-note", children: be.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              be.construction_points.map((o, A) => {
                var J;
                return /* @__PURE__ */ a.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ a.jsxs("strong", { children: [
                    o.title,
                    " · ",
                    o.stage === "preparation" ? "施工准备" : o.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ a.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ a.jsx("textarea", { disabled: !ee, value: o.content, onChange: (Be) => {
                      var Ue;
                      return Pe({ ...be, construction_points: (Ue = be.construction_points) == null ? void 0 : Ue.map((nt, zt) => zt === A ? { ...nt, content: Be.target.value } : nt) });
                    } })
                  ] }),
                  /* @__PURE__ */ a.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ a.jsx("textarea", { disabled: !ee, value: o.inspection_method, onChange: (Be) => {
                      var Ue;
                      return Pe({ ...be, construction_points: (Ue = be.construction_points) == null ? void 0 : Ue.map((nt, zt) => zt === A ? { ...nt, inspection_method: Be.target.value } : nt) });
                    } })
                  ] }),
                  /* @__PURE__ */ a.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ a.jsx("textarea", { disabled: !ee, value: o.common_mistakes, onChange: (Be) => {
                      var Ue;
                      return Pe({ ...be, construction_points: (Ue = be.construction_points) == null ? void 0 : Ue.map((nt, zt) => zt === A ? { ...nt, common_mistakes: Be.target.value } : nt) });
                    } })
                  ] }),
                  /* @__PURE__ */ a.jsx("p", { children: o.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ a.jsxs("small", { children: [
                    "证据：",
                    o.evidence_ids.join("、")
                  ] }),
                  (J = o.source_quotes) == null ? void 0 : J.map((Be, Ue) => /* @__PURE__ */ a.jsxs("details", { children: [
                    /* @__PURE__ */ a.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ a.jsx("p", { children: Be.text })
                  ] }, Ue))
                ] }, A);
              })
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "模拟建议 · 不作为来源事实" }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ a.jsx("textarea", { disabled: !ee, value: be.suggestions.join(`
`), onChange: (o) => Pe({ ...be, suggestions: o.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "标准依据" }),
            be.standards.length ? be.standards.map((o, A) => /* @__PURE__ */ a.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ a.jsx("strong", { children: o.name }),
              /* @__PURE__ */ a.jsxs("p", { children: [
                "条款：",
                o.clause || "未提供",
                " · 版本：",
                o.edition || "未提供"
              ] }),
              /* @__PURE__ */ a.jsx("span", { children: o.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ a.jsx("input", { type: "checkbox", disabled: !ee, checked: o.verification_status === "not_used", onChange: (J) => Pe({ ...be, standards: be.standards.map((Be, Ue) => Ue === A ? { ...Be, verification_status: J.target.checked ? "not_used" : "pending_verification" } : Be) }) }),
                "明确不采用该依据"
              ] })
            ] }, A)) : /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            tr(te.content, be).length > 0 && /* @__PURE__ */ a.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ a.jsx("h3", { children: "本次未保存修改" }),
              tr(te.content, be).map(([o, A, J]) => /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsx("strong", { children: o }),
                /* @__PURE__ */ a.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  A
                ] }),
                /* @__PURE__ */ a.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  J
                ] })
              ] }, o))
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ a.jsx("textarea", { value: at, onChange: (o) => ct(o.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
              ee && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: W || !at.trim(), onClick: () => void Se(async () => {
                await m(`/knowledge/${te.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: te.row_version, revision_id: te.revision_id, content: be, reason: at }) }), E("已创建新草稿版本；原版本和审核意见保留。"), I((o) => o + 1);
              }), children: "保存新草稿版本" }),
              ee && ["draft", "changes_requested"].includes(te.state) && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: W || !at.trim() || JSON.stringify(be) !== JSON.stringify(te.content), onClick: () => void Ke("submit"), children: "提交当前已保存版本审核" })
            ] }),
            lt && te.state === "pending_review" && /* @__PURE__ */ a.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: Le, onChange: (o) => Ye(o.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: W || !Le || !at.trim() || JSON.stringify(be) !== JSON.stringify(te.content), onClick: () => void Ke("approve"), children: "批准此版本" }),
                /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: W || !at.trim(), onClick: () => void Ke("request-changes"), children: "退回修改" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "版本与审核轨迹" }),
          /* @__PURE__ */ a.jsx("span", { children: "审核准确关联到具体版本" })
        ] }),
        te.revisions.map((o, A) => /* @__PURE__ */ a.jsxs("details", { children: [
          /* @__PURE__ */ a.jsxs("summary", { children: [
            "v",
            o.version,
            " · ",
            Kl[o.state]
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: o.content.title }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "事实：",
            o.content.facts.map((J) => J.text).join("；")
          ] }),
          te.revisions[A + 1] && /* @__PURE__ */ a.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ a.jsxs("p", { children: [
              "相较v",
              te.revisions[A + 1].version,
              "的修改："
            ] }),
            tr(te.revisions[A + 1].content, o.content).map(([J, Be, Ue]) => /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: J }),
              /* @__PURE__ */ a.jsxs("p", { className: "diff-before", children: [
                "原：",
                Be
              ] }),
              /* @__PURE__ */ a.jsxs("p", { className: "diff-after", children: [
                "新：",
                Ue
              ] })
            ] }, J))
          ] })
        ] }, o.id)),
        te.review_actions.map((o, A) => /* @__PURE__ */ a.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ a.jsxs("strong", { children: [
            "v",
            o.version,
            " · ",
            Kl[o.action] || o.action
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: o.reason }),
          /* @__PURE__ */ a.jsxs("small", { children: [
            new Date(o.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            o.reviewer.slice(0, 8)
          ] })
        ] }, A))
      ] })
    ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      !Re && $ && /* @__PURE__ */ a.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ a.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ a.jsx("select", { value: re, onChange: (o) => F(o.target.value), children: f.filter((o) => wt(o, "knowledge.process")).map((o) => /* @__PURE__ */ a.jsx("option", { value: o.id, children: o.name }, o.id)) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ a.jsxs("select", { value: se, onChange: (o) => me(o.target.value), children: [
                /* @__PURE__ */ a.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ a.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => {
            ke(Qe.slice(0, 20).map((o) => o.record_version_id)), rt(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ a.jsx("div", { className: "source-options", children: Qe.length ? Qe.map((o) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: ne.includes(o.record_version_id), onChange: (A) => {
              ke(A.target.checked ? [...ne, o.record_version_id] : ne.filter((J) => J !== o.record_version_id)), rt(null);
            } }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              o.description || "缺少描述",
              /* @__PURE__ */ a.jsxs("small", { children: [
                "来源v",
                o.current_version,
                " · ",
                { detail: "明细", review: "复查", summary: "汇总" }[o.record_kind] || o.record_kind
              ] })
            ] })
          ] }, o.id)) : /* @__PURE__ */ a.jsx("p", { children: "当前项目尚无可用风险数据，请先完成历史数据接入。" }) }),
          /* @__PURE__ */ a.jsxs("details", { children: [
            /* @__PURE__ */ a.jsx("summary", { children: "模拟校验场景（可选）" }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "结构验证",
              /* @__PURE__ */ a.jsxs("select", { value: qe, onChange: (o) => Fe(o.target.value), children: [
                /* @__PURE__ */ a.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ a.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ a.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ a.jsxs("button", { className: "button secondary", disabled: W || !ne.length || ne.length > 20, onClick: () => void Se(async () => {
              rt(await m("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(j()) }));
            }), children: [
              "预览生成范围（",
              ne.length,
              "条）"
            ] }),
            mt && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: W, onClick: () => void Se(async () => {
              const o = await m("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(j()) });
              Ie(null), tt(o.job_id), sessionStorage.setItem("b03-last-job-" + H, o.job_id), E("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              mt.count,
              " 张候选卡",
              /* @__PURE__ */ a.jsx(ga, { size: 15 })
            ] })
          ] }),
          mt && /* @__PURE__ */ a.jsx("div", { className: "generation-preview", children: mt.items.map((o, A) => /* @__PURE__ */ a.jsxs("p", { children: [
            o.description,
            " · 来源问题 ",
            o.quality_issue_count,
            "项"
          ] }, A)) }),
          Ze && /* @__PURE__ */ a.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ a.jsxs("h3", { children: [
              "最近生成任务 · ",
              Ze.progress,
              "%"
            ] }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "新增 ",
              Ze.counts.created,
              " · 复用 ",
              Ze.counts.skipped,
              " · 单项失败 ",
              Ze.counts.failed
            ] }),
            Ze.error && /* @__PURE__ */ a.jsx("p", { role: "alert", children: Ze.error }),
            Ze.items.map((o, A) => /* @__PURE__ */ a.jsxs("p", { children: [
              o.error || Kl[o.outcome],
              " ",
              o.item_id && /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/knowledge/" + o.item_id + "/edit"), children: "打开知识卡" })
            ] }, A)),
            Ze.status === "failed" && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: W, onClick: () => void Se(async () => {
              await m("/jobs/" + Ze.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Ze.row_version }) }), Ie(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: Re ? "审核待办" : "知识候选列表" }),
          Re && /* @__PURE__ */ a.jsxs("select", { "aria-label": "审核对象类型", value: le, onChange: (o) => {
            he(o.target.value), ue(""), b([]);
          }, children: [
            /* @__PURE__ */ a.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ a.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ a.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "知识状态", value: Me, onChange: (o) => {
            ce(o.target.value), ue(""), b([]);
          }, children: [
            !Re && /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
            (Re ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((o) => /* @__PURE__ */ a.jsx("option", { value: o, children: Kl[o] }, o))
          ] })
        ] }),
        Re && !je ? /* @__PURE__ */ a.jsx("div", { className: "empty", children: /* @__PURE__ */ a.jsx("h2", { children: "当前身份没有审核权限" }) }) : ze.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ a.jsx("th", { children: "类型" }),
            /* @__PURE__ */ a.jsx("th", { children: "状态" }),
            /* @__PURE__ */ a.jsx("th", { children: "版本" }),
            /* @__PURE__ */ a.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: ze.map((o) => /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("td", { children: o.title }),
            /* @__PURE__ */ a.jsx("td", { children: gh[o.type] }),
            /* @__PURE__ */ a.jsx("td", { children: Kl[o.state] }),
            /* @__PURE__ */ a.jsxs("td", { children: [
              "v",
              o.version
            ] }),
            /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O(o.object_type === "question_revision" ? "/training/questions/" + o.id : o.object_type === "retrospective_revision" ? "/retrospectives/" + o.id + "/review" : "/knowledge/" + o.id + "/edit"), children: Re ? "打开审核" : "核查与编辑" }) })
          ] }, o.id)) })
        ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: Re ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ a.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        ie
      ] })
    ] }),
    U && /* @__PURE__ */ a.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ a.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => Q(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ a.jsx("p", { children: U.message }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ a.jsx("select", { value: pe, onChange: (o) => v(o.target.value), children: ["resolved", "ignored", "open"].map((o) => /* @__PURE__ */ a.jsx("option", { value: o, children: Kl[o] }, o)) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ a.jsx("textarea", { value: T, onChange: (o) => Y(o.target.value) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ a.jsx("textarea", { value: L, onChange: (o) => P(o.target.value) })
      ] }),
      /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: W || !T.trim(), onClick: () => void Se(async () => {
        await m("/quality/issues/" + U.id, { method: "PATCH", body: JSON.stringify({ row_version: U.row_version, status: pe, reason: T, annotation: L || null }) }), Q(null), I((o) => o + 1), E("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const ph = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Rx = (m) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[m] || "其他已配置场景", Ux = (m) => [m.section, typeof m.row == "number" ? `第${m.row}行` : null, m.cell ? `单元格 ${m.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", lr = (m) => m === "case_card" ? "案例卡" : "检查要点卡";
function Mx({ identity: m, path: N, projects: O, navigate: f }) {
  var et, Re, Se, j, ie, ee, lt, Ke;
  const [H, Z] = h.useState(((et = O[0]) == null ? void 0 : et.id) || ""), [K, W] = h.useState("generic"), [D, p] = h.useState(""), [G, xe] = h.useState([]), [E, oe] = h.useState({}), [I, ze] = h.useState([]), [ae, Ne] = h.useState([]), [de, X] = h.useState("mock-hash-64"), [fe, le] = h.useState([]), [he, Ee] = h.useState(null), [ye, Me] = h.useState(""), [ce, De] = h.useState("extractive"), [ue, Je] = h.useState(null), [we, Ce] = h.useState(null), [b, U] = h.useState(null);
  h.useEffect(() => () => {
    b && URL.revokeObjectURL(b);
  }, [b]), h.useEffect(() => {
    U(null);
  }, [H, N]);
  const [Q, pe] = h.useState(null);
  h.useEffect(() => {
    pe(null);
  }, [N]);
  const [v, T] = h.useState(""), [Y, L] = h.useState("useful"), [P, re] = h.useState(""), [F, Qe] = h.useState(!1), [z, ne] = h.useState(!0), [ke, se] = h.useState(""), [me, qe] = h.useState(""), [Fe, mt] = h.useState(0), [rt, He] = h.useState(""), [tt, Ze] = h.useState(null), [Ie, te] = h.useState([]), dt = h.useRef("");
  dt.current = [m, N, H, K, D, ye, ce, Q].join("|");
  const be = N === "/releases", Pe = N === "/search", at = N === "/knowledge/library", ct = wt(O.find((d) => d.id === H), "knowledge.publish"), Le = !be && !Pe && !at ? N.split("/")[2] : null;
  async function Ye(d, o = {}) {
    const A = await Zt("/api/v1" + d, { ...o, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${m}`, ...o.headers } }), J = await A.json();
    if (!A.ok) throw new Error(J.message || "请求失败，请重试。");
    return J;
  }
  h.useEffect(() => {
    Ne([]), Je(null), Ce(null), se(""), qe(""), He(""), te([]);
  }, [H, N, K, D]), h.useEffect(() => {
    let d = !1;
    return ne(!0), se(""), Ee(null), (async () => {
      try {
        if (be) {
          const A = await Ye(`/releases?project_id=${H}${rt ? "&cursor=" + encodeURIComponent(rt) : ""}`);
          if (d) return;
          xe(A.items), oe(A.active_ids), Ze(A.next_cursor);
          const J = await Ye("/releases/options?project_id=" + H);
          d || ze(J.items);
        } else if (at) {
          const A = await Ye(`/knowledge/library?project_id=${H}${K ? "&scene_code=" + K : ""}${D ? "&card_type=" + D : ""}${rt ? "&after_id=" + rt : ""}`);
          d || (le(A.items), Ze(A.next_cursor));
        } else if (Le) {
          const A = await Ye("/published/knowledge/" + Le + (Q ? "?revision_id=" + Q : ""));
          d || Ee(A);
        }
      } catch (A) {
        d || se(A.message);
      } finally {
        d || ne(!1);
      }
    })(), () => {
      d = !0;
    };
  }, [H, N, K, D, Fe, rt, Q]), h.useEffect(() => {
    if (!be || !G.some((o) => ["queued", "building"].includes(o.state))) return;
    const d = setInterval(() => mt((o) => o + 1), 1800);
    return () => clearInterval(d);
  }, [be, G]);
  const _ = async (d) => {
    Qe(!0), se(""), qe("");
    try {
      await d();
    } catch (o) {
      se(o.message);
    } finally {
      Qe(!1);
    }
  }, $ = (d, o, A = !1) => _(async () => {
    const J = dt.current;
    U(null), Ce(null);
    const Be = await Ye("/published/evidence/" + d + "?revision_id=" + o + (A ? "&historical=true" : ""));
    if (J === dt.current && (Ce(Be), Be.has_image)) {
      const Ue = await Zt("/api/v1/published/evidence/" + d + "/content?revision_id=" + o + (A ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${m}` } });
      if (!Ue.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const nt = await Ue.blob();
      J === dt.current && U(URL.createObjectURL(nt));
    }
  }), je = /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ a.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ a.jsx("button", { disabled: !Ie.length || z, onClick: () => {
        He(Ie.at(-1) || ""), te(Ie.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ a.jsx("button", { disabled: !tt || z, onClick: () => {
        te([...Ie, rt]), He(tt || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ a.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(Hi, { size: 20 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ a.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ a.jsx("button", { className: at || Le ? "selected" : "", onClick: () => f("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ a.jsx("button", { className: Pe ? "selected" : "", onClick: () => f("/search"), children: "知识检索" }),
        O.some((d) => wt(d, "knowledge.publish")) && /* @__PURE__ */ a.jsx("button", { className: be ? "selected" : "", onClick: () => f("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => {
        Ce(null), Je(null), mt((d) => d + 1);
      }, children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ke && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      ke
    ] }),
    me && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      me
    ] }),
    !Le && /* @__PURE__ */ a.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ a.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ a.jsx("select", { "aria-label": "发布检索项目", value: H, onChange: (d) => Z(d.target.value), children: O.map((d) => /* @__PURE__ */ a.jsx("option", { value: d.id, children: d.name }, d.id)) })
      ] }),
      !be && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "检索场景", value: K, onChange: (d) => W(d.target.value), children: [
            at && /* @__PURE__ */ a.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ a.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ a.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ a.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "知识类型", value: D, onChange: (d) => p(d.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ a.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ a.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    z ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在加载…" }) : be ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      ct && /* @__PURE__ */ a.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ a.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ a.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ a.jsx("div", { className: "release-choices", children: I.length ? I.map((d) => /* @__PURE__ */ a.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: ae.includes(d.revision_id), onChange: (o) => Ne(o.target.checked ? [...ae, d.revision_id] : ae.filter((A) => A !== d.revision_id)) }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: d.title }),
            /* @__PURE__ */ a.jsxs("small", { children: [
              lr(d.type),
              " · 审核版本 v",
              d.version
            ] })
          ] })
        ] }, d.revision_id)) : /* @__PURE__ */ a.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "向量配置", value: de, onChange: (d) => X(d.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ a.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: F || !ae.length, onClick: () => void _(async () => {
            await Ye("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: H, revision_ids: ae, embedding_model: de }) }), Ne([]), qe("发布集合已固定，处理服务正在构建索引。"), mt((d) => d + 1);
          }), children: [
            "构建发布 · ",
            ae.length,
            " 张"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "发布批次" }),
          /* @__PURE__ */ a.jsx("span", { children: "构建失败不会替换当前启用版本" })
        ] }),
        G.length ? /* @__PURE__ */ a.jsx("div", { className: "release-list", children: G.map((d) => /* @__PURE__ */ a.jsxs("article", { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: ph[d.state] || d.state }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                new Date(d.created_at).toLocaleString("zh-CN"),
                " · ",
                d.entries.length,
                " 张卡片 · ",
                d.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                "批次 ",
                d.id.slice(0, 8),
                d.build_ms !== null ? ` · 构建 ${d.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsxs("span", { children: [
                d.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(d.state) && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: F, onClick: () => void _(async () => {
                await Ye("/releases/" + d.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: d.row_version, expected_active_id: E[H] || null }) }), qe("发布已启用，知识库与检索使用同一发布集合。"), mt((o) => o + 1);
              }), children: "启用发布" }),
              d.state === "failed" && /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: F, onClick: () => void _(async () => {
                await Ye("/jobs/" + d.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: d.job_row_version }) }), mt((o) => o + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          d.error && /* @__PURE__ */ a.jsx("p", { className: "release-error", children: d.error }),
          /* @__PURE__ */ a.jsxs("details", { children: [
            /* @__PURE__ */ a.jsx("summary", { children: "查看构建项" }),
            d.entries.map((o) => /* @__PURE__ */ a.jsxs("p", { children: [
              o.revision_id.slice(0, 8),
              " · ",
              ph[o.state] || o.state,
              o.error ? " · " + o.error : ""
            ] }, o.revision_id))
          ] })
        ] }, d.id)) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ a.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        je
      ] })
    ] }) : at ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ a.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      fe.length ? /* @__PURE__ */ a.jsx("div", { className: "library-grid", children: fe.map((d) => /* @__PURE__ */ a.jsxs("article", { children: [
        /* @__PURE__ */ a.jsxs("span", { className: "role-tag", children: [
          lr(d.type),
          " · v",
          d.version
        ] }),
        /* @__PURE__ */ a.jsx("h2", { children: d.title }),
        /* @__PURE__ */ a.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => f("/knowledge/" + d.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ a.jsx(dx, { size: 15 })
        ] })
      ] }, d.revision_id)) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ a.jsx(Hi, { size: 32 }),
        /* @__PURE__ */ a.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ a.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      je
    ] }) : Pe ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("form", { className: "panel search-form", onSubmit: (d) => {
        d.preventDefault(), _(async () => {
          const o = dt.current;
          Je(null), Ce(null);
          const A = await Ye("/search", { method: "POST", body: JSON.stringify({ project_id: H, question: ye, scene_code: K, card_type: D || null, answer_mode: ce }) });
          o === dt.current && Je(A);
        });
      }, children: [
        /* @__PURE__ */ a.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ a.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: ye, onChange: (d) => {
          Me(d.target.value), Je(null), Ce(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "回答方式", value: ce, onChange: (d) => {
              De(d.target.value), Je(null);
            }, children: [
              /* @__PURE__ */ a.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Nt && /* @__PURE__ */ a.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: F || !ye.trim(), children: [
            /* @__PURE__ */ a.jsx(Sx, { size: 17 }),
            F ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      ue && /* @__PURE__ */ a.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: ue.status === "answered" ? "找到有据内容" : ue.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            ue.latency_ms,
            " ms · ",
            ue.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "search-answer", children: [
          ue.answer_blocks.map((d, o) => /* @__PURE__ */ a.jsx("p", { children: d.text }, o)),
          ue.missing_conditions.map((d) => /* @__PURE__ */ a.jsx("p", { children: d }, d)),
          ue.warnings.map((d) => /* @__PURE__ */ a.jsx("p", { className: "small-note", children: d.message }, d.code))
        ] }),
        ue.results.map((d, o) => /* @__PURE__ */ a.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ a.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            o + 1,
            " · ",
            d.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => f("/knowledge/" + d.id), children: d.title }),
          /* @__PURE__ */ a.jsx("p", { children: d.text }),
          /* @__PURE__ */ a.jsx("div", { children: ue.citations.filter((A) => d.citation_ids.includes(A.citation_id)).map((A) => /* @__PURE__ */ a.jsxs("button", { className: "citation-button", disabled: F, onClick: () => void $(A.evidence_id, A.knowledge_revision_id), children: [
            "打开来源：",
            A.source_title
          ] }, A.citation_id)) })
        ] }, d.revision_id)),
        /* @__PURE__ */ a.jsxs("form", { className: "search-feedback", onSubmit: (d) => {
          d.preventDefault(), _(async () => {
            await Ye("/search/" + ue.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: Y, comment: P }) }), qe("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ a.jsxs("select", { value: Y, onChange: (d) => L(d.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ a.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ a.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ a.jsx("input", { value: P, maxLength: 1e3, onChange: (d) => re(d.target.value) })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: F, children: "保存反馈" })
        ] })
      ] })
    ] }) : he && /* @__PURE__ */ a.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => f("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ a.jsxs("span", { className: "role-tag", children: [
        he.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        lr(he.type),
        " · v",
        he.version
      ] }),
      /* @__PURE__ */ a.jsx("h2", { children: he.title }),
      /* @__PURE__ */ a.jsxs("p", { children: [
        "适用范围：",
        ((Re = O.find((d) => d.id === he.project_id)) == null ? void 0 : Re.name) || he.project_id,
        " · ",
        Rx(he.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ a.jsx("h3", { children: "已审核事实" }),
      (Se = he.content) == null ? void 0 : Se.facts.map((d, o) => /* @__PURE__ */ a.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ a.jsx("p", { children: d.text }),
        /* @__PURE__ */ a.jsx("small", { children: d.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ a.jsx("div", { children: d.evidence_ids.map((A) => /* @__PURE__ */ a.jsx("button", { disabled: F, className: "citation-button", onClick: () => void $(A, he.revision_id, he.is_current_release === !1), children: "打开来源证据" }, A)) })
      ] }, o)),
      ((j = he.content) == null ? void 0 : j.construction_points) && he.content.construction_points.length > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsxs("h3", { children: [
          "施工要点 · ",
          he.content.category_name || "通用"
        ] }),
        he.content.construction_points.map((d, o) => /* @__PURE__ */ a.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ a.jsxs("strong", { children: [
            d.title,
            " · ",
            d.stage === "preparation" ? "施工准备" : d.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: d.content }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "检查方法：",
            d.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "常见问题：",
            d.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ a.jsx("small", { children: d.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ a.jsx("div", { children: d.evidence_ids.map((A) => /* @__PURE__ */ a.jsx("button", { className: "citation-button", onClick: () => void $(A, he.revision_id, he.is_current_release === !1), children: "核对要点来源" }, A)) })
        ] }, o))
      ] }),
      /* @__PURE__ */ a.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ a.jsx("p", { children: ((ie = he.content) == null ? void 0 : ie.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (ee = he.content) == null ? void 0 : ee.suggestions.map((d, o) => /* @__PURE__ */ a.jsx("p", { children: d }, o)),
      (lt = he.content) != null && lt.standards.length ? he.content.standards.map((d, o) => /* @__PURE__ */ a.jsxs("p", { children: [
        d.name,
        " ",
        d.clause,
        " · ",
        d.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, o)) : /* @__PURE__ */ a.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ a.jsxs("details", { children: [
        /* @__PURE__ */ a.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          "发布批次：",
          he.release_id
        ] }),
        (Ke = he.versions) == null ? void 0 : Ke.map((d) => /* @__PURE__ */ a.jsxs("button", { className: "citation-button", onClick: () => {
          pe(d.id), Ce(null);
        }, children: [
          "查看已发布 v",
          d.version
        ] }, d.id)),
        /* @__PURE__ */ a.jsx("p", { children: he.history_note })
      ] }),
      wt(O.find((d) => d.id === he.project_id), "knowledge.publish") && /* @__PURE__ */ a.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ a.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ a.jsx("input", { value: v, maxLength: 2e3, onChange: (d) => T(d.target.value) })
        ] }),
        /* @__PURE__ */ a.jsx("button", { className: "button ghost danger", disabled: F || !v.trim(), onClick: () => void _(async () => {
          await Ye("/knowledge/" + he.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: he.row_version, reason: v }) }), Ee(null), Ce(null), qe("知识已撤回，新的检索和证据访问已阻断。"), f("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    we && /* @__PURE__ */ a.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsxs("h2", { children: [
          "来源证据 · v",
          we.source_version
        ] }),
        /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => Ce(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: we.source_title }),
        /* @__PURE__ */ a.jsx("p", { children: we.description || "来源描述缺失" }),
        b && /* @__PURE__ */ a.jsx("img", { className: "published-evidence-image", src: b, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          "位置：",
          Ux(we.locator)
        ] }),
        /* @__PURE__ */ a.jsx("p", { className: "small-note", children: we.note })
      ] })
    ] })
  ] });
}
const gn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, Sh = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, sr = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Dx = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, nr = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, ir = (m) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[m] || m, bn = (m) => m ? new Date(m).toLocaleString("zh-CN") : "实际时间未提供", qx = (m) => JSON.stringify(m, null, 2), Hx = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function ys(m, N = "") {
  if (m == null) return "未提供";
  if (Array.isArray(m)) return m.every((O) => typeof O != "object") ? m.join("、") : m.map((O, f) => `第${f + 1}条
${ys(O)}`).join(`

`);
  if (typeof m == "object") return Object.entries(m).map(([O, f]) => `${Hx[O] || sr[O] || O}：${ys(f, O)}`).join(`
`);
  if (typeof m == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(N)) return bn(m);
    if (N === "actor_role" || N === "role") return ir(m);
    if (N === "event_type") return Sh[m] || m;
    if (N === "evidence_type") return nr[m] || m;
    if (N === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[m] || m;
  }
  return String(m);
}
const Bx = (m) => {
  const N = m.note;
  return typeof N == "string" ? N : Object.keys(m).length ? qx(m) : "未补充说明";
};
function Yx({ identity: m, path: N, projects: O, navigate: f }) {
  var be, Pe, at, ct, Le, Ye, _, $, je, et, Re, Se;
  const H = N === "/task-packages/import", Z = !H && N !== "/task-packages" ? N.split("/")[2] : null, [K, W] = h.useState(((be = O[0]) == null ? void 0 : be.id) || ""), [D, p] = h.useState(""), [G, xe] = h.useState([]), [E, oe] = h.useState(null), [I, ze] = h.useState(""), [ae, Ne] = h.useState(null), [de, X] = h.useState([]), [fe, le] = h.useState([]), [he, Ee] = h.useState([]), [ye, Me] = h.useState("complete"), [ce, De] = h.useState(() => sessionStorage.getItem("b05-demo-task:" + m) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [ue, Je] = h.useState(""), [we, Ce] = h.useState(null), [b, U] = h.useState(""), [Q, pe] = h.useState(""), [v, T] = h.useState(!0), [Y, L] = h.useState(!1), [P, re] = h.useState(0), [F, Qe] = h.useState(""), [z, ne] = h.useState(null), ke = h.useRef(null), se = h.useRef(null), me = h.useRef("");
  me.current = [m, N, K, ye, ce, ue].join("|");
  const qe = O.some((j) => j.permissions != null), Fe = !qe && wt(O.find((j) => j.id === K), "imports.create"), mt = E && !qe && wt(O.find((j) => j.id === E.project_id), "imports.withdraw"), rt = E && !qe && wt(O.find((j) => j.id === E.project_id), "imports.create");
  async function He(j, ie = {}) {
    const ee = await Zt("/api/v1/task-packages" + j, {
      ...ie,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${m}`, ...ie.headers }
    }), lt = await ee.json().catch(() => ({}));
    if (!ee.ok) throw new Error(lt.message || "接入服务暂未就绪，请稍后刷新。");
    return lt;
  }
  const tt = async (j) => {
    L(!0), U(""), pe("");
    try {
      await j();
    } catch (ie) {
      U(ie.message);
    } finally {
      L(!1);
    }
  };
  h.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + m, ce);
  }, [ce, m]), h.useEffect(() => () => {
    z != null && z.url && URL.revokeObjectURL(z.url);
  }, [z == null ? void 0 : z.url]), h.useEffect(() => {
    ze(""), X([]), U(""), pe(""), ne(null), Qe(""), Ce(null);
  }, [N, K, D]), h.useEffect(() => {
    let j = !1;
    return T(!0), oe(null), U(""), (async () => {
      try {
        if (H && Nt) {
          const ee = await Zt("/api/v1/platform-archives"), lt = await ee.json();
          if (!ee.ok) throw new Error(lt.message);
          j || le(lt.items);
        } else if (H) {
          const ee = await He("/samples");
          j || Ee(ee.items);
        } else if (Z) {
          const ee = await He("/" + Z);
          j || oe(ee);
        } else {
          const ee = await He(`?project_id=${K}${D ? "&state=" + D : ""}${I ? "&cursor=" + encodeURIComponent(I) : ""}`);
          j || (xe(ee.items), Ne(ee.next_cursor));
        }
      } catch (ee) {
        j || U(ee.message);
      } finally {
        j || T(!1);
      }
    })(), () => {
      j = !0;
    };
  }, [N, K, D, I, P]), h.useEffect(() => {
    if (Nt || !H || !Fe) return;
    let j = !1;
    Ce(null), Je("");
    const ie = ce + "." + (ye === "v2" ? "complete" : ye);
    return He(`/samples/${ye}?project_id=${K}&task_id=${ie}`).then((ee) => {
      j || Je(JSON.stringify(ee, null, 2));
    }).catch((ee) => {
      j || U(ee.message);
    }), () => {
      j = !0;
    };
  }, [H, K, ye, ce]), h.useEffect(() => {
    if (!(E && ["received", "validating", "processing"].includes(E.status) || !Z && G.some((ee) => ["received", "validating", "processing"].includes(ee.status))) || H) return;
    const ie = setInterval(() => re((ee) => ee + 1), 1800);
    return () => clearInterval(ie);
  }, [E == null ? void 0 : E.status, G, N]);
  const Ze = () => tt(async () => {
    const j = me.current;
    Ce(null);
    const ie = await He("/preview", { method: "POST", body: ue });
    me.current === j && Ce(ie);
  }), Ie = () => tt(async () => {
    var ie;
    if (!we) return;
    ((ie = ke.current) == null ? void 0 : ie.hash) !== we.content_hash && (ke.current = { hash: we.content_hash, key: crypto.randomUUID() });
    const j = await He("", { method: "POST", headers: { "Idempotency-Key": ke.current.key }, body: ue });
    pe(j.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), f("/task-packages/" + j.receipt_id);
  }), te = (j) => tt(async () => {
    const ie = me.current;
    ne(null);
    const ee = await Zt(`/api/v1/task-packages/${Z}/assets/${j.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${m}` } });
    if (!ee.ok) {
      const Ke = await ee.json().catch(() => ({}));
      throw new Error(Ke.message || "附件服务暂不可用，请稍后重试。");
    }
    const lt = await ee.blob();
    if (ie === me.current)
      if (j.mime_type.startsWith("text/")) {
        const Ke = await lt.slice(0, 1e6).text();
        ie === me.current && ne({ id: j.attachment_id, url: null, text: Ke });
      } else if (j.mime_type.startsWith("image/")) ne({ id: j.attachment_id, url: URL.createObjectURL(lt), text: null });
      else {
        const Ke = URL.createObjectURL(lt), d = document.createElement("a");
        d.href = Ke, d.download = "任务附件", d.click(), URL.revokeObjectURL(Ke);
      }
  }), dt = /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ a.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ a.jsx("button", { disabled: !de.length || v, onClick: () => {
        ze(de.at(-1) || ""), X(de.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ a.jsx("button", { disabled: !ae || v, onClick: () => {
        X([...de, I]), ze(ae || "");
      }, children: "下一页" })
    ] })
  ] });
  return O.length ? qe && H ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ a.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ a.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ a.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(dh, { size: 21 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: Nt ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ a.jsx("span", { children: qe ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ a.jsx("button", { className: H ? "" : "selected", onClick: () => f("/task-packages"), children: "任务包清单" }),
        !qe && O.some((j) => wt(j, "imports.create")) && /* @__PURE__ */ a.jsx("button", { className: H ? "selected" : "", onClick: () => f("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => {
        ne(null), re((j) => j + 1);
      }, children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (E == null ? void 0 : E.a_import_id) && /* @__PURE__ */ a.jsx("button", { className: "button primary", onClick: () => f("/imports/" + E.a_import_id), children: "接入与复盘状态" }),
    b && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      b
    ] }),
    Q && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      Q
    ] }),
    !Z && /* @__PURE__ */ a.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ a.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ a.jsx("select", { "aria-label": "任务包项目", value: K, onChange: (j) => W(j.target.value), children: O.map((j) => /* @__PURE__ */ a.jsx("option", { value: j.id, children: j.name }, j.id)) })
      ] }),
      !H && /* @__PURE__ */ a.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ a.jsxs("select", { "aria-label": "任务包状态", value: D, onChange: (j) => p(j.target.value), children: [
          /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((j) => /* @__PURE__ */ a.jsx("option", { value: j, children: gn[j] }, j))
        ] })
      ] })
    ] }),
    v ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取任务包…" }) : H ? Fe ? Nt ? /* @__PURE__ */ a.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ a.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "package-import-inner", children: [
        fe.filter((j) => j.project_id === K).map((j) => /* @__PURE__ */ a.jsxs("article", { children: [
          /* @__PURE__ */ a.jsxs("h3", { children: [
            j.title,
            " · 第",
            j.version,
            "版"
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Y, onClick: () => void tt(async () => {
            const ie = await Zt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: j.id }) }), ee = await ie.json();
            if (!ie.ok) throw new Error(ee.message);
            f("/task-packages/" + ee.receipt_id);
          }), children: "接入此成果" })
        ] }, j.id)),
        !fe.some((j) => j.project_id === K) && /* @__PURE__ */ a.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
      ] })
    ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel package-import", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "选择演示数据" }),
          /* @__PURE__ */ a.jsx("span", { children: "无需重复填写已有任务、人员与事件" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "package-import-inner", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "模拟场景",
            /* @__PURE__ */ a.jsx("select", { "aria-label": "模拟任务场景", value: ye, onChange: (j) => Me(j.target.value), children: he.map((j) => /* @__PURE__ */ a.jsx("option", { value: j.id, children: j.label }, j.id)) })
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: Y, onClick: () => De("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ a.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ a.jsx("input", { type: "file", accept: ".json,application/json", disabled: Y, onChange: (j) => {
              var ee;
              const ie = (ee = j.target.files) == null ? void 0 : ee[0];
              if (ie) {
                if (ie.size > 5242880) {
                  U("文件超过5MiB上限。");
                  return;
                }
                ie.text().then((lt) => {
                  Je(lt), Ce(null), U("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ a.jsxs("details", { children: [
            /* @__PURE__ */ a.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: ue, onChange: (j) => {
              Je(j.target.value), Ce(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: Y || !ue, onClick: () => void Ze(), children: "预检查" }),
            /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: Y || !we, onClick: () => void Ie(), children: [
              /* @__PURE__ */ a.jsx(Nh, { size: 16 }),
              Y ? "正在处理…" : "确认接入归档成果"
            ] })
          ] })
        ] })
      ] }),
      we && /* @__PURE__ */ a.jsxs("section", { className: "panel package-preview", children: [
        /* @__PURE__ */ a.jsxs("h2", { children: [
          we.name,
          " · 第",
          we.package_version,
          "版"
        ] }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          "归属项目：",
          ((Pe = O.find((j) => j.id === we.project_id)) == null ? void 0 : Pe.name) || we.project_id
        ] }),
        /* @__PURE__ */ a.jsx("div", { children: Object.entries(we.counts).map(([j, ie]) => /* @__PURE__ */ a.jsxs("span", { children: [
          sr[j],
          " ",
          /* @__PURE__ */ a.jsx("strong", { children: ie })
        ] }, j)) }),
        /* @__PURE__ */ a.jsx("p", { children: we.note }),
        we.warnings.length > 0 && /* @__PURE__ */ a.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ a.jsx("section", { className: "panel empty", children: /* @__PURE__ */ a.jsx("h2", { children: "当前项目没有导入权限" }) }) : Z ? E && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => f("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ a.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("h2", { children: E.name }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              ((at = O.find((j) => j.id === E.project_id)) == null ? void 0 : at.name) || E.project_id,
              " · 第",
              E.package_version,
              "版 · ",
              gn[E.status],
              E.is_current ? " · 当前可用版本" : ""
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("span", { className: "demo-tag", children: E.is_demo ? "模拟任务包" : "平台归档成果" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "package-version-stats", children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "最新收到 ",
            /* @__PURE__ */ a.jsxs("strong", { children: [
              "第",
              E.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "当前可用 ",
            /* @__PURE__ */ a.jsx("strong", { children: E.current_package_id ? "第" + E.current_ready_version + "版" : "暂无（不会自动恢复旧版）" })
          ] })
        ] }),
        E.capabilities.map((j) => /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: Dx[j] }, j)),
        E.status !== "withdrawn" && /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        E.retrospective_id && /* @__PURE__ */ a.jsx("button", { className: "button secondary", onClick: () => f("/retrospectives/" + E.retrospective_id), children: "打开已有复盘" }),
        rt && E.status === "ready" && E.is_current && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Y, onClick: () => void tt(async () => {
          const j = await Zt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${m}` }, body: JSON.stringify({ mode: "task_process", task_package_id: E.id }) }), ie = await j.json();
          if (!j.ok) throw new Error(ie.message);
          f("/retrospectives/" + ie.id);
        }), children: "自动生成 / 更新复盘" })
      ] }),
      E.status === "withdrawn" ? /* @__PURE__ */ a.jsxs("section", { className: "panel package-warning", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "此任务包已撤回" }),
        /* @__PURE__ */ a.jsx("p", { children: "正文、事件、问题和附件已停止在线使用。" }),
        E.invalidations.map((j) => /* @__PURE__ */ a.jsxs("p", { children: [
          "下游失效通知：",
          j.state === "handled" ? "复盘、培训实时来源保护已生效" : j.state === "pending" ? "历史通知待标记；当前在线访问仍受来源保护" : j.state
        ] }, j.id))
      ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        (E.warnings.length > 0 || E.validation_errors.length > 0) && /* @__PURE__ */ a.jsxs("section", { className: "panel package-warning", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "校验结果与资料限制" }),
          E.validation_errors.map((j, ie) => /* @__PURE__ */ a.jsx("p", { children: j.message }, "e" + ie)),
          E.warnings.map((j, ie) => /* @__PURE__ */ a.jsx("p", { children: j.message }, "w" + ie))
        ] }),
        ["received", "validating", "processing"].includes(E.status) && /* @__PURE__ */ a.jsxs("div", { className: "feedback", children: [
          "后台处理中 · ",
          E.progress,
          "%"
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel package-facts", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "任务快照" }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "开始：",
            bn((ct = E.task) == null ? void 0 : ct.started_at),
            "　结束：",
            bn((Le = E.task) == null ? void 0 : Le.completed_at)
          ] }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "参与人员：",
            ((Ye = E.participants) == null ? void 0 : Ye.map((j) => ir(j.role) + "（" + j.actor_id + "）").join("、")) || "未提供"
          ] }),
          (_ = E.issues) == null ? void 0 : _.map((j) => /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("h3", { children: j.description }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "责任方：",
              j.responsible_actor_id || "未提供",
              "　期限：",
              bn(j.due_at)
            ] }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "整改：",
              j.rectification || "未提供"
            ] }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "复核：",
              j.review_conclusion || "未提供"
            ] })
          ] }, j.issue_id))
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "过程事件与证据" }),
            /* @__PURE__ */ a.jsx("span", { children: "按A提供顺序展示，未知时间保持为空" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "package-timeline", children: ($ = E.events) != null && $.length ? E.events.map((j) => /* @__PURE__ */ a.jsxs("article", { children: [
            /* @__PURE__ */ a.jsx("time", { children: bn(j.occurred_at) }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("h3", { children: j.is_known ? Sh[j.event_type] || j.event_type : "未知事件 · " + j.event_type }),
              /* @__PURE__ */ a.jsx("p", { children: Bx(j.payload) }),
              j.related_object_id && /* @__PURE__ */ a.jsxs("p", { children: [
                "对应：",
                j.related_object_id === E.task_id ? "本次任务" : "问题 " + j.related_object_id
              ] }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                ir(j.actor.actor_role),
                " · ",
                j.actor.actor_id || "未提供人员"
              ] }),
              j.evidence_refs.length > 0 && /* @__PURE__ */ a.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                j.evidence_refs.map((ie) => {
                  var lt;
                  const ee = (lt = E.attachments) == null ? void 0 : lt.find((Ke) => Ke.attachment_id === ie);
                  return /* @__PURE__ */ a.jsxs("button", { className: "text-button", disabled: Y || !ee || ee.state !== "verified", onClick: () => ee && void te(ee), children: [
                    ee ? nr[ee.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ie
                  ] }, ie);
                })
              ] })
            ] })
          ] }, j.event_id)) : /* @__PURE__ */ a.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          E.event_next !== null && E.event_next !== void 0 && /* @__PURE__ */ a.jsx("button", { className: "button ghost package-more", disabled: Y, onClick: () => void tt(async () => {
            const j = await He("/" + Z + "?event_after=" + E.event_next);
            oe({ ...j, events: [...E.events || [], ...j.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ a.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (je = E.attachments) != null && je.length ? E.attachments.map((j) => /* @__PURE__ */ a.jsxs("article", { children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsxs("strong", { children: [
                nr[j.evidence_type] || "未知类型",
                " · ",
                j.attachment_id
              ] }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                gn[j.state],
                " · ",
                j.size,
                " 字节 · 关联",
                j.event_ids.length,
                "个事件"
              ] }),
              j.error && /* @__PURE__ */ a.jsx("p", { children: j.error })
            ] }),
            /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: Y || j.state !== "verified", onClick: () => void te(j), children: "打开附件" })
          ] }, j.attachment_id)) : /* @__PURE__ */ a.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          z && /* @__PURE__ */ a.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => ne(null), children: "关闭预览" }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "证据附件 · ",
              z.id
            ] }),
            z.url && /* @__PURE__ */ a.jsx("img", { src: z.url, alt: "任务证据附件" }),
            z.text && /* @__PURE__ */ a.jsx("pre", { children: z.text })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ a.jsx("div", { className: "package-version-links", children: (et = E.versions) == null ? void 0 : et.map((j) => /* @__PURE__ */ a.jsxs("button", { className: "button ghost", disabled: j.id === E.id, onClick: () => f("/task-packages/" + j.id), children: [
            "第",
            j.package_version,
            "版 · ",
            gn[j.state],
            j.is_current ? " · 当前使用" : ""
          ] }, j.id)) }),
          (Re = E.diff) != null && Re.previous_version ? /* @__PURE__ */ a.jsxs("p", { children: [
            "与上一可查看版本（第",
            E.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ a.jsx("p", { children: "暂无更早可查看版本。" }),
          (Se = E.diff) == null ? void 0 : Se.changes.map((j, ie) => {
            var ee, lt, Ke, d, o;
            return /* @__PURE__ */ a.jsxs("details", { children: [
              /* @__PURE__ */ a.jsxs("summary", { children: [
                sr[j.section] || j.section,
                "有变化"
              ] }),
              "before" in j ? /* @__PURE__ */ a.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ a.jsxs("div", { children: [
                  /* @__PURE__ */ a.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ a.jsx("pre", { children: ys(j.before) })
                ] }),
                /* @__PURE__ */ a.jsxs("div", { children: [
                  /* @__PURE__ */ a.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ a.jsx("pre", { children: ys(j.after) })
                ] })
              ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
                /* @__PURE__ */ a.jsxs("p", { children: [
                  "新增：",
                  ((ee = j.added) == null ? void 0 : ee.join("、")) || "无",
                  "；移除：",
                  ((lt = j.removed) == null ? void 0 : lt.join("、")) || "无"
                ] }),
                j.order_changed && /* @__PURE__ */ a.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (Ke = j.before_order) == null ? void 0 : Ke.join(" → "),
                  "　调整为　",
                  (d = j.after_order) == null ? void 0 : d.join(" → ")
                ] }),
                (o = j.changed) == null ? void 0 : o.map((A) => /* @__PURE__ */ a.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ a.jsxs("div", { children: [
                    /* @__PURE__ */ a.jsxs("strong", { children: [
                      A.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ a.jsx("pre", { children: ys(A.before) })
                  ] }),
                  /* @__PURE__ */ a.jsxs("div", { children: [
                    /* @__PURE__ */ a.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ a.jsx("pre", { children: ys(A.after) })
                  ] })
                ] }, A.id))
              ] })
            ] }, ie);
          })
        ] }),
        (mt || rt && E.status === "failed") && /* @__PURE__ */ a.jsxs("section", { className: "panel package-controls", children: [
          rt && E.status === "failed" && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Y, onClick: () => void tt(async () => {
            const j = await Zt("/api/v1/jobs/" + E.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${m}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: E.job_row_version }) });
            if (!j.ok) throw new Error((await j.json()).message);
            pe("已提交重试，已保存事件与附件不会重复新增。"), re((ie) => ie + 1);
          }), children: "重试接入" }),
          mt && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ a.jsx("input", { value: F, maxLength: 2e3, onChange: (j) => Qe(j.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ a.jsx("button", { className: "button ghost danger", disabled: Y || !F.trim(), onClick: () => void tt(async () => {
              var ee;
              const j = JSON.stringify({ reason: F }), ie = E.id + j;
              ((ee = se.current) == null ? void 0 : ee.body) !== ie && (se.current = { body: ie, key: crypto.randomUUID() }), await He("/" + E.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": se.current.key }, body: j }), ne(null), re((lt) => lt + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ a.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      G.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ a.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ a.jsx("th", { children: "状态" }),
          /* @__PURE__ */ a.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ a.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: G.map((j) => /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsxs("td", { children: [
            /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => f("/task-packages/" + j.id), children: j.name }),
            /* @__PURE__ */ a.jsxs("small", { children: [
              j.producer,
              " · ",
              j.task_id
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("td", { children: [
            "第",
            j.package_version,
            "版",
            /* @__PURE__ */ a.jsxs("small", { children: [
              "最新接收：第",
              j.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("td", { children: gn[j.status] }),
          /* @__PURE__ */ a.jsx("td", { children: j.is_current ? /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: "当前使用" }) : j.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ a.jsx("td", { children: j.status === "withdrawn" ? "正文与附件已停止使用" : j.missing_fields.length ? `${j.missing_fields.length} 项资料限制` : j.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, j.id)) })
      ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ a.jsx(dh, { size: 35 }),
        /* @__PURE__ */ a.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ a.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      dt
    ] })
  ] }) : /* @__PURE__ */ a.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ a.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
const pn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Gx = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Lx = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Ui = (m) => m ? new Date(m).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Xx({ api: m, path: N, navigate: O, projects: f, identity: H }) {
  var Ye;
  const Z = N.split("/")[2], K = N.endsWith("/review"), [W, D] = h.useState([]), [p, G] = h.useState(null), [xe, E] = h.useState(null), [oe, I] = h.useState(!1), [ze, ae] = h.useState(!0), [Ne, de] = h.useState(""), [X, fe] = h.useState(""), [le, he] = h.useState(0), [Ee, ye] = h.useState("task_process"), [Me, ce] = h.useState(((Ye = f.find((_) => wt(_, "retrospective.generate"))) == null ? void 0 : Ye.id) || ""), [De, ue] = h.useState([]), [Je, we] = h.useState(""), [Ce, b] = h.useState([]), [U, Q] = h.useState([]), [pe, v] = h.useState(""), [T, Y] = h.useState(!1), [L, P] = h.useState(""), [re, F] = h.useState(""), [Qe, z] = h.useState(""), [ne, ke] = h.useState(null), [se, me] = h.useState([]), [qe, Fe] = h.useState(null), [mt, rt] = h.useState(""), [He, tt] = h.useState(""), Ze = f.some((_) => wt(_, "retrospective.generate")), Ie = !!(p != null && p.is_current) && !!wt(f.find((_) => _.id === p.project_id), "retrospective.edit"), te = !!(p != null && p.is_current) && !!wt(f.find((_) => _.id === p.project_id), "retrospective.review");
  h.useEffect(() => {
    P(""), v(""), Y(!1), de(""), fe(""), z(""), me([]), Fe(null);
  }, [N]), h.useEffect(() => {
    let _ = !1;
    return ae(!0), G(null), de(""), (async () => {
      try {
        if (Z) {
          const je = await m(`/retrospectives/${Z}${L ? "?revision_id=" + L : ""}`);
          _ || (G(je), E({ summary: je.summary, findings: structuredClone(je.findings), suggestions: structuredClone(je.suggestions) }), Y(!1));
        } else {
          const je = await m(`/retrospectives?limit=20${re ? "&state=" + re : ""}${Qe ? "&cursor=" + encodeURIComponent(Qe) : ""}`);
          _ || (D(je.items), ke(je.next_cursor));
        }
      } catch (je) {
        _ || de(je.message);
      } finally {
        _ || ae(!1);
      }
    })(), () => {
      _ = !0;
    };
  }, [Z, N, L, re, Qe, le]), h.useEffect(() => {
    if (Z || !Me || !Ze) return;
    let _ = !1;
    return Q([]), ue([]), b([]), we(""), (async () => {
      var je;
      try {
        const [et, Re] = await Promise.all([m(`/task-packages?project_id=${Me}&state=ready&limit=100`), m(`/knowledge/source-options?project_id=${Me}&limit=100`)]);
        if (_) return;
        const Se = et.items.filter((j) => j.is_current);
        ue(Se), we(((je = Se[0]) == null ? void 0 : je.id) || ""), b(Re.items);
      } catch (et) {
        _ || de(et.message);
      }
    })(), () => {
      _ = !0;
    };
  }, [Z, Me, le]), h.useEffect(() => {
    if (!(qe != null && qe.asset_id) || qe.type !== "task_attachment") {
      rt(""), tt("");
      return;
    }
    let _ = !1, $ = "";
    return Zt("/api/v1/assets/" + qe.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + H } }).then(async (je) => {
      if (!je.ok) {
        const Re = await je.json();
        throw new Error(Re.message);
      }
      const et = await je.blob();
      !_ && /^(image\/|text\/plain)/.test(et.type) && ($ = URL.createObjectURL(et), rt($), tt(et.type));
    }).catch((je) => {
      _ || de(je.message);
    }), () => {
      _ = !0, $ && URL.revokeObjectURL($), rt("");
    };
  }, [qe, H]);
  const dt = async (_) => {
    I(!0), de(""), fe("");
    try {
      await _();
    } catch ($) {
      de($.message);
    } finally {
      I(!1);
    }
  }, be = () => ({ revision_id: p.revision_id, row_version: p.row_version, reason: pe, evidence_checked: T }), Pe = !!p && !!xe && JSON.stringify(xe) === JSON.stringify({ summary: p.summary, findings: p.findings, suggestions: p.suggestions }), at = (_) => void dt(async () => {
    const $ = _ === "submit" ? `/retrospectives/${Z}/submit-review` : `/reviews/${p.revision_id}/${_}`;
    await m($, { method: "POST", body: JSON.stringify(be()) }), fe("已保存本版本的审核状态与意见。"), he((je) => je + 1);
  }), ct = (_, $) => _.map((je, et) => /* @__PURE__ */ a.jsxs("article", { className: "retro-finding " + je.claim_kind, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: Gx[je.claim_kind] }),
      je.record_status && /* @__PURE__ */ a.jsx("strong", { children: je.record_status }),
      /* @__PURE__ */ a.jsx("small", { children: je.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    K && Ie ? /* @__PURE__ */ a.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ a.jsx("textarea", { "aria-label": "修改" + je.id, value: je.text, onChange: (Re) => E((Se) => Se && { ...Se, [$]: Se[$].map((j, ie) => ie === et ? { ...j, text: Re.target.value, review_state: "unconfirmed" } : j) }) })
    ] }) : /* @__PURE__ */ a.jsx("p", { children: je.text }),
    /* @__PURE__ */ a.jsx("div", { className: "retro-evidence-links", children: je.evidence_refs.map((Re, Se) => /* @__PURE__ */ a.jsxs("button", { className: "text-button", onClick: () => Fe(p.evidence.find((j) => j.id === Re) || null), children: [
      "查看证据 ",
      Se + 1
    ] }, Re)) }),
    K && Ie && /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: je.review_state === "confirmed", onChange: (Re) => E((Se) => Se && { ...Se, [$]: Se[$].map((j, ie) => ie === et ? { ...j, review_state: Re.target.checked ? "confirmed" : "unconfirmed" } : j) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, je.id)), Le = (_) => _.map(($) => /* @__PURE__ */ a.jsxs("li", { children: [
    /* @__PURE__ */ a.jsx("time", { children: Ui($.occurred_at) }),
    /* @__PURE__ */ a.jsx("strong", { children: Lx[$.event_type] || "未知事件类型：" + $.event_type }),
    /* @__PURE__ */ a.jsx("p", { children: typeof $.payload.note == "string" ? $.payload.note : Object.keys($.payload).length ? JSON.stringify($.payload) : "未补充说明" }),
    /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => Fe(p.evidence.find((je) => je.reference === "event:" + $.event_id) || null), children: "打开事件记录" }),
    $.evidence_refs.map((je) => /* @__PURE__ */ a.jsxs("button", { className: "text-button", onClick: () => {
      const et = p.evidence.find((Re) => Re.reference === "attachment:" + je);
      et ? Fe(et) : de("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      je
    ] }, je))
  ] }, $.event_id));
  return /* @__PURE__ */ a.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(xx, { size: 20 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ a.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Ne && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      Ne,
      /* @__PURE__ */ a.jsx("button", { onClick: () => he((_) => _ + 1), children: "重新加载" })
    ] }),
    X && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      X
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => O("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => he((_) => _ + 1), disabled: oe, children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ze ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : Z ? p && xe ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("h2", { children: p.title }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "v",
            p.version,
            " · ",
            pn[p.state],
            " · ",
            p.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            p.template_version
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ a.jsx("select", { "aria-label": "选择复盘版本", value: p.revision_id, onChange: (_) => P(_.target.value), children: p.revisions.map((_) => /* @__PURE__ */ a.jsxs("option", { value: _.id, children: [
            "v",
            _.version,
            " · ",
            pn[_.state]
          ] }, _.id)) }),
          /* @__PURE__ */ a.jsx("button", { className: "button secondary", onClick: () => O(`/retrospectives/${Z}${K ? "" : "/review"}`), children: K ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !p.is_current && /* @__PURE__ */ a.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ a.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          K && Ie ? /* @__PURE__ */ a.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "复盘摘要", value: xe.summary, onChange: (_) => E({ ...xe, summary: _.target.value }) })
          ] }) : /* @__PURE__ */ a.jsx("p", { children: p.summary }),
          /* @__PURE__ */ a.jsxs("p", { className: "small-note", children: [
            p.sources.task_package_id ? "固定任务包 v" + p.sources.package_version : "固定历史版本 " + p.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          p.sources.task_package_id && /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/task-packages/" + p.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ a.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
            p.timeline.known.length ? /* @__PURE__ */ a.jsx("ol", { className: "retro-timeline", children: Le(p.timeline.known) }) : /* @__PURE__ */ a.jsx("p", { children: "未发现可排序的过程记录。" }),
            p.timeline.unknown_time.length > 0 && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ a.jsx("ol", { className: "retro-timeline unknown", children: Le(p.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ a.jsx("h3", { children: "可核对的时间差" }),
            p.timeline.intervals.length ? p.timeline.intervals.map((_, $) => /* @__PURE__ */ a.jsxs("p", { children: [
              _.name,
              "：",
              _.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, $)) : /* @__PURE__ */ a.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ a.jsx("h3", { children: "期限对照" }),
            p.timeline.deadlines.length ? p.timeline.deadlines.map((_) => /* @__PURE__ */ a.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ a.jsxs("strong", { children: [
                _.issue_id,
                " · ",
                _.result
              ] }),
              /* @__PURE__ */ a.jsx("p", { children: _.reason || `明确期限 ${Ui(_.due_at || null)}；复核记录 ${Ui(_.accepted_at || null)}；晚于期限 ${_.late_seconds / 60} 分钟。` })
            ] }, _.issue_id)) : /* @__PURE__ */ a.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ a.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
            ct(xe.findings, "findings"),
            /* @__PURE__ */ a.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            ct(xe.suggestions, "suggestions")
          ] })
        ] })
      ] }),
      K && p.is_current && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ a.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "复盘审核说明", value: pe, onChange: (_) => v(_.target.value) })
          ] }),
          Ie && /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: oe || Pe || !pe.trim(), onClick: () => void dt(async () => {
              await m(`/retrospectives/${Z}/draft`, { method: "PATCH", body: JSON.stringify({ ...be(), ...xe }) }), fe("已保存新草稿版本，旧内容及审核意见保留。"), he((_) => _ + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(p.state) && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: oe || !Pe || !pe.trim(), onClick: () => at("submit"), children: "提交当前版本审核" })
          ] }),
          te && p.state === "pending_review" && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: T, onChange: (_) => Y(_.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: oe || !T || !Pe || !pe.trim(), onClick: () => at("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: oe || !Pe || !pe.trim(), onClick: () => at("request-changes"), children: "退回修改" })
            ] })
          ] }),
          Ie && p.state === "approved" && /* @__PURE__ */ a.jsx("div", { className: "card-actions", children: /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: oe || !Pe || !pe.trim(), onClick: () => void dt(async () => {
            const _ = await m(`/retrospectives/${Z}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...be(), type: "case_card" }) });
            fe(_.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), he(($) => $ + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      p.draft_ids.length > 0 && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ a.jsx("div", { className: "proof-body", children: p.draft_ids.map((_) => /* @__PURE__ */ a.jsx("button", { className: "button secondary", onClick: () => O("/knowledge/" + _ + "/edit"), children: "打开经验候选" }, _)) })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "审核轨迹与来源指纹" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsx("p", { className: "retro-hash", children: p.input_fingerprint }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "摘要适配器：",
            p.model_ref
          ] })
        ] }),
        p.review_actions.map((_, $) => /* @__PURE__ */ a.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ a.jsxs("strong", { children: [
            "v",
            _.version,
            " · ",
            pn[_.action] || _.action
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: _.reason }),
          /* @__PURE__ */ a.jsx("small", { children: Ui(_.created_at) })
        ] }, $))
      ] })
    ] }) : null : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      Ze && /* @__PURE__ */ a.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ a.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ a.jsxs("select", { "aria-label": "复盘模式", value: Ee, onChange: (_) => ye(_.target.value), children: [
                /* @__PURE__ */ a.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ a.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ a.jsx("select", { "aria-label": "复盘项目", value: Me, onChange: (_) => ce(_.target.value), children: f.filter((_) => wt(_, "retrospective.generate")).map((_) => /* @__PURE__ */ a.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] })
          ] }),
          Ee === "task_process" ? /* @__PURE__ */ a.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ a.jsx("select", { "aria-label": "复盘任务包", value: Je, onChange: (_) => we(_.target.value), children: De.map((_) => /* @__PURE__ */ a.jsxs("option", { value: _.id, children: [
              _.name,
              " · 包v",
              _.package_version
            ] }, _.id)) }),
            !De.length && /* @__PURE__ */ a.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ a.jsx("div", { className: "source-options", children: Ce.map((_) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: U.includes(_.record_version_id), onChange: ($) => Q($.target.checked ? [...U, _.record_version_id] : U.filter((je) => je !== _.record_version_id)) }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              _.description || "未填写描述",
              " · 来源v",
              _.current_version
            ] })
          ] }, _.id)) }),
          /* @__PURE__ */ a.jsxs("p", { className: "small-note", children: [
            Ee === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: oe || (Ee === "task_process" ? !Je : !U.length || U.length > 20), onClick: () => void dt(async () => {
              const _ = await m("/retrospectives", { method: "POST", body: JSON.stringify({ mode: Ee, task_package_id: Ee === "task_process" ? Je : null, record_version_ids: Ee === "historical_case" ? U : [], template_version: "process-review-v1" }) });
              O("/retrospectives/" + _.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => O("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "复盘状态", value: re, onChange: (_) => {
            F(_.target.value), z(""), me([]);
          }, children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((_) => /* @__PURE__ */ a.jsx("option", { value: _, children: pn[_] }, _))
          ] })
        ] }),
        W.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ a.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ a.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ a.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: W.map((_) => /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsxs("td", { children: [
              _.title,
              /* @__PURE__ */ a.jsx("small", { children: _.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ a.jsx("td", { children: _.sources.task_package_id ? "任务包 v" + _.sources.package_version : _.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ a.jsxs("td", { children: [
              "v",
              _.version,
              " · ",
              pn[_.state]
            ] }),
            /* @__PURE__ */ a.jsxs("td", { children: [
              /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/retrospectives/" + _.id), children: "查看复盘" }),
              /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/retrospectives/" + _.id + "/review"), children: "核查与审核" })
            ] })
          ] }, _.id)) })
        ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ a.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ a.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ a.jsx("button", { disabled: !se.length, onClick: () => {
              z(se.at(-1) || ""), me(se.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ a.jsx("button", { disabled: !ne, onClick: () => {
              me([...se, Qe]), z(ne || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    qe && /* @__PURE__ */ a.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ a.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ a.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => Fe(null), children: /* @__PURE__ */ a.jsx(qi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: qe.type === "process_event" ? "实际事件记录" : qe.type === "task_attachment" ? "任务附件" : qe.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ a.jsx("p", { children: qe.text }),
      /* @__PURE__ */ a.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(qe.locator)
      ] }),
      mt && He.startsWith("image/") && /* @__PURE__ */ a.jsx("img", { src: mt, alt: "来源证据" }),
      mt && He.startsWith("text/") && /* @__PURE__ */ a.jsx("iframe", { title: "作业日志", src: mt }),
      /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const Sl = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, ps = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, yh = { selected: [], text: "", row_version: 0 };
function Qx({ api: m, path: N, navigate: O, projects: f }) {
  var tl, kt, At;
  const H = N.startsWith("/learn"), Z = /^\/training\/results\/[^/]+$/.test(N), K = N.startsWith("/learn/attempts/") || Z ? N.split("/")[3] : "", W = /^\/training\/questions\/[^/]+$/.test(N), D = W ? N.split("/")[3] : "", p = N === "/training/questions", G = N === "/training/packages", xe = N === "/training/results", E = f.some((c) => wt(c, "training.manage")), oe = f.some((c) => wt(c, "training.review")), [I, ze] = h.useState(((tl = f.find((c) => wt(c, "training.manage"))) == null ? void 0 : tl.id) || ((kt = f[0]) == null ? void 0 : kt.id) || ""), [ae, Ne] = h.useState([]), [de, X] = h.useState([]), [fe, le] = h.useState([]), [he, Ee] = h.useState([]), [ye, Me] = h.useState(null), [ce, De] = h.useState(null), [ue, Je] = h.useState(""), [we, Ce] = h.useState(!1), [b, U] = h.useState([]), [Q, pe] = h.useState(["single_choice", "case_answer"]), [v, T] = h.useState([]), [Y, L] = h.useState("新人风险识别与复盘练习"), [P, re] = h.useState("learning-" + Date.now()), [F, Qe] = h.useState(1), [z, ne] = h.useState(null), [ke, se] = h.useState({}), [me, qe] = h.useState(null), [Fe, mt] = h.useState("rules"), [rt, He] = h.useState("useful"), [tt, Ze] = h.useState(""), [Ie, te] = h.useState({}), [dt, be] = h.useState({}), [Pe, at] = h.useState(""), [ct, Le] = h.useState(""), [Ye, _] = h.useState(null), [$, je] = h.useState([]), [et, Re] = h.useState(!0), [Se, j] = h.useState(!1), [ie, ee] = h.useState(""), [lt, Ke] = h.useState(""), [d, o] = h.useState(0);
  h.useEffect(() => {
    Le(""), je([]), Je(""), Ce(!1), Ke(""), ee(""), T([]);
  }, [N]), h.useEffect(() => {
    let c = !1;
    return Re(!0), ee(""), Me(null), ne(null), qe(null), (async () => {
      try {
        if (K)
          if (Z) {
            const V = await m(`/training/attempts/${K}/result?teacher=true`);
            c || qe(V);
          } else {
            const V = await m("/training/attempts/" + K);
            if (c) return;
            if (ne(V), se(Object.fromEntries(V.saved_answers.map((ge) => [ge.question_revision_id, { ...ge.answer, row_version: ge.row_version }]))), V.state === "submitted") {
              const ge = await m(`/training/attempts/${K}/result`);
              c || qe(ge);
            }
          }
        else if (W) {
          const V = await m("/training/questions/" + D);
          c || (Me(V), De(structuredClone(V.content)));
        } else if (H) {
          const [V, ge] = await Promise.all([m("/training/packages?learner=true&limit=100"), m("/training/attempts?limit=100")]);
          c || (X(V.items), Ee(ge.items));
        } else if (xe) {
          const V = await m(`/training/results?limit=20${ct ? "&cursor=" + ct : ""}`);
          c || (Ee(V.items), _(V.next_cursor));
        } else if (G) {
          const [V, ge] = await Promise.all([m(`/training/packages?limit=20${ct ? "&cursor=" + ct : ""}`), m("/training/questions?state=approved&limit=100")]);
          c || (X(V.items), Ne(ge.items), _(V.next_cursor));
        } else {
          const [V, ge] = await Promise.all([m(`/training/questions?limit=20${Pe ? "&state=" + Pe : ""}${ct ? "&cursor=" + ct : ""}`), m("/knowledge/library?limit=100&project_id=" + I)]);
          c || (Ne(V.items), le(ge.items), _(V.next_cursor));
        }
      } catch (V) {
        c || ee(V.message);
      } finally {
        c || Re(!1);
      }
    })(), () => {
      c = !0;
    };
  }, [N, I, Pe, ct, d]), h.useEffect(() => {
    if (!(me != null && me.grading_job) || !["queued", "running", "retrying"].includes(me.grading_job.status)) return;
    const c = window.setTimeout(() => o((q) => q + 1), 1800);
    return () => clearTimeout(c);
  }, [(At = me == null ? void 0 : me.grading_job) == null ? void 0 : At.status, d]);
  const A = async (c) => {
    j(!0), ee(""), Ke("");
    try {
      await c();
    } catch (q) {
      ee(q.message);
    } finally {
      j(!1);
    }
  }, J = !!ye && !!ce && JSON.stringify(ce) === JSON.stringify(ye.content), Be = () => ({ revision_id: ye.revision_id, row_version: ye.row_version, reason: ue, evidence_checked: we }), Ue = (c) => void A(async () => {
    await m(c === "submit" ? `/training/questions/${D}/submit-review` : `/reviews/${ye.revision_id}/${c}`, { method: "POST", body: JSON.stringify(Be()) }), Ke("题目审核状态已保存到统一审核记录。"), o((q) => q + 1);
  }), nt = async (c) => {
    const q = ke[c.revision_id] || yh, V = await m(`/training/attempts/${K}/answers/${c.question_id}`, { method: "PUT", body: JSON.stringify(q) });
    return se((ge) => ({ ...ge, [c.revision_id]: { ...q, row_version: V.row_version } })), V;
  }, zt = /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ a.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ a.jsx("button", { disabled: !$.length, onClick: () => {
        Le($.at(-1) || ""), je($.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ a.jsx("button", { disabled: !Ye, onClick: () => {
        je([...$, ct]), Le(Ye || "");
      }, children: "下一页" })
    ] })
  ] }), Wt = (c, q, V) => V ? [...c, q] : c.filter((ge) => ge !== q), rl = (c) => void A(async () => {
    const q = await m("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: c.id, grading_mode: Fe }) });
    O("/learn/attempts/" + q.id);
  });
  return /* @__PURE__ */ a.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(Hi, { size: 20 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: H ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ a.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    ie && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      ie
    ] }),
    lt && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 18 }),
      lt
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        !H && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
          /* @__PURE__ */ a.jsx("button", { className: p || W ? "selected" : "", onClick: () => O("/training/questions"), children: "题库与审核" }),
          E && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsx("button", { className: G ? "selected" : "", onClick: () => O("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ a.jsx("button", { className: xe || Z ? "selected" : "", onClick: () => O("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("button", { className: H ? "selected" : "", onClick: () => O("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => o((c) => c + 1), children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    et ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : me ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ a.jsx("span", { children: Sl[me.result_state] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ a.jsx("strong", { children: me.confirmed_total === null ? "待确认" : me.confirmed_total })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ a.jsx("strong", { children: me.provisional_total === null ? "待评分" : me.provisional_total })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ a.jsx("strong", { children: me.max_score })
            ] })
          ] }),
          me.grading_job && /* @__PURE__ */ a.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ a.jsxs("p", { children: [
              "后台建议评分：",
              me.grading_job.status === "failed" ? "暂未完成" : me.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            me.grading_job.error && /* @__PURE__ */ a.jsx("p", { children: me.grading_job.error }),
            Z && E && me.grading_job.status === "failed" && me.content_available && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void A(async () => {
              await m("/jobs/" + me.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: me.grading_job.row_version }) }), o((c) => c + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          me.restriction_note && /* @__PURE__ */ a.jsx("p", { className: "warning-text", children: me.restriction_note }),
          me.answers.map((c, q) => {
            var V, ge, ot, gt, Gt, dl, zl, $l;
            return /* @__PURE__ */ a.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ a.jsxs("h3", { children: [
                "第",
                q + 1,
                "题 ",
                c.type ? ps[c.type] : ""
              ] }),
              c.content_available && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
                /* @__PURE__ */ a.jsx("p", { className: "question-stem", children: c.stem }),
                /* @__PURE__ */ a.jsxs("p", { children: [
                  "我的作答：",
                  ((V = c.answer) == null ? void 0 : V.text) || ((ge = c.answer) == null ? void 0 : ge.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ a.jsxs("p", { children: [
                  "参考答案：",
                  ((ot = c.reference_answer) == null ? void 0 : ot.text) || ((Gt = (gt = c.reference_answer) == null ? void 0 : gt.selected) == null ? void 0 : Gt.join("、"))
                ] }),
                (dl = c.rubric) == null ? void 0 : dl.map((Kt, Rt) => /* @__PURE__ */ a.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  Kt.point,
                  " · ",
                  Kt.points,
                  "分"
                ] }, Rt)),
                /* @__PURE__ */ a.jsx("p", { children: (zl = c.feedback) == null ? void 0 : zl.message }),
                (($l = c.feedback) == null ? void 0 : $l.human_review_reason) && /* @__PURE__ */ a.jsxs("p", { children: [
                  "教员说明：",
                  c.feedback.human_review_reason
                ] })
              ] }),
              /* @__PURE__ */ a.jsxs("p", { children: [
                "建议分：",
                c.suggested_score ?? "无",
                " · 确认分：",
                c.confirmed_score ?? "待确认",
                " · ",
                c.score_kind === "model_suggestion" ? "大模型建议" : c.score_kind === "rule_suggestion" ? "规则建议，需复核" : c.score_kind === "human_confirmed" ? "人工确认" : c.score_kind === "pending" ? "待评分" : "客观题规则评分"
              ] }),
              /* @__PURE__ */ a.jsxs("small", { children: [
                "评分规则：",
                c.scoring_version,
                " · 评分器：",
                c.model_ref
              ] }),
              Z && E && c.content_available && /* @__PURE__ */ a.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ a.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ a.jsx("input", { type: "number", min: 0, max: 100, value: Ie[c.id] ?? String(c.confirmed_score ?? c.suggested_score ?? ""), onChange: (Kt) => te({ ...Ie, [c.id]: Kt.target.value }) })
                ] }),
                /* @__PURE__ */ a.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ a.jsx("textarea", { value: dt[c.id] || "", onChange: (Kt) => be({ ...dt, [c.id]: Kt.target.value }) })
                ] }),
                /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se || !(dt[c.id] || "").trim() || (Ie[c.id] ?? String(c.confirmed_score ?? c.suggested_score ?? "")) === "", onClick: () => void A(async () => {
                  await m("/training/answers/" + c.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: c.row_version, score: Number(Ie[c.id] ?? c.confirmed_score ?? c.suggested_score), reason: dt[c.id] }) }), Ke("人工确认分已保存，原建议分和复核轨迹保留。"), o((Kt) => Kt + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, c.id);
          })
        ] })
      ] }),
      !Z && me.content_available && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "学习反馈", value: rt, onChange: (c) => He(c.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ a.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ a.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ a.jsx("textarea", { value: tt, onChange: (c) => Ze(c.target.value) })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void A(async () => {
            await m(`/training/attempts/${K}/feedback`, { method: "POST", body: JSON.stringify({ rating: rt, comment: tt }) }), Ke("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : z ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsxs("h2", { children: [
          z.package_title,
          " · v",
          z.package_version
        ] }),
        /* @__PURE__ */ a.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      z.questions.map((c) => {
        const q = ke[c.revision_id] || yh;
        return /* @__PURE__ */ a.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ a.jsxs("h3", { children: [
            "第",
            c.position,
            "题 · ",
            ps[c.type],
            " · ",
            c.max_score,
            "分"
          ] }),
          /* @__PURE__ */ a.jsx("p", { className: "question-stem", children: c.stem }),
          c.type === "case_answer" ? /* @__PURE__ */ a.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "第" + c.position + "题回答", value: q.text, onChange: (V) => se({ ...ke, [c.revision_id]: { ...q, text: V.target.value } }) })
          ] }) : c.options.map((V) => /* @__PURE__ */ a.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ a.jsx("input", { type: c.type === "single_choice" ? "radio" : "checkbox", name: c.revision_id, checked: q.selected.includes(V.id), onChange: (ge) => se({ ...ke, [c.revision_id]: { ...q, selected: c.type === "single_choice" ? [V.id] : Wt(q.selected, V.id, ge.target.checked) } }) }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              V.id.toUpperCase(),
              " · ",
              V.text
            ] })
          ] }, V.id)),
          /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void A(async () => {
              await nt(c), Ke("第" + c.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ a.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              q.row_version
            ] })
          ] })
        ] }, c.revision_id);
      }),
      /* @__PURE__ */ a.jsx("div", { className: "proof-body", children: /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Se, onClick: () => void A(async () => {
        for (const c of z.questions) await nt(c);
        await m(`/training/attempts/${K}/submit`, { method: "POST" }), o((c) => c + 1), Ke("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : W && ye && ce ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsxs("h2", { children: [
            ps[ye.type],
            " · v",
            ye.version,
            " · ",
            Sl[ye.state]
          ] }),
          /* @__PURE__ */ a.jsx("span", { children: ye.model_ref })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "题面", value: ce.stem, disabled: !E, onChange: (c) => De({ ...ce, stem: c.target.value }) })
          ] }),
          ce.options.map((c, q) => {
            var V;
            return /* @__PURE__ */ a.jsxs("label", { children: [
              "选项 ",
              c.id.toUpperCase(),
              /* @__PURE__ */ a.jsx("input", { value: c.text, disabled: !E, onChange: (ge) => De({ ...ce, options: ce.options.map((ot, gt) => gt === q ? { ...ot, text: ge.target.value } : ot) }) }),
              /* @__PURE__ */ a.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ a.jsx("input", { type: "checkbox", disabled: !E, checked: ((V = ce.answer.selected) == null ? void 0 : V.includes(c.id)) || !1, onChange: (ge) => De({ ...ce, answer: { selected: Wt(ce.answer.selected || [], c.id, ge.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, c.id);
          }),
          ye.type === "case_answer" && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ a.jsx("textarea", { value: ce.answer.text || "", disabled: !E, onChange: (c) => De({ ...ce, answer: { text: c.target.value } }) })
            ] }),
            ce.rubric.map((c, q) => /* @__PURE__ */ a.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ a.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ a.jsx("textarea", { value: c.point, disabled: !E, onChange: (V) => De({ ...ce, rubric: ce.rubric.map((ge, ot) => ot === q ? { ...ge, point: V.target.value } : ge) }) })
              ] }),
              /* @__PURE__ */ a.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ a.jsx("input", { value: c.keywords.join("，"), disabled: !E, onChange: (V) => De({ ...ce, rubric: ce.rubric.map((ge, ot) => ot === q ? { ...ge, keywords: V.target.value.split(/[,，]/).filter(Boolean) } : ge) }) })
              ] }),
              /* @__PURE__ */ a.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ a.jsx("input", { type: "number", min: 1, max: 100, value: c.points, disabled: !E, onChange: (V) => De({ ...ce, rubric: ce.rubric.map((ge, ot) => ot === q ? { ...ge, points: Number(V.target.value) } : ge) }) })
              ] })
            ] }, q))
          ] }),
          /* @__PURE__ */ a.jsx("h3", { children: "固定审核来源" }),
          ye.source_versions.map((c) => /* @__PURE__ */ a.jsx("p", { children: /* @__PURE__ */ a.jsx("code", { children: c }) }, c)),
          /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ a.jsx("textarea", { "aria-label": "题目审核原因", value: ue, onChange: (c) => Je(c.target.value) })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            E && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se || J || !ue.trim(), onClick: () => void A(async () => {
              await m(`/training/questions/${D}/draft`, { method: "PATCH", body: JSON.stringify({ ...Be(), content: ce }) }), Ke("新题目版本已保存，不改变旧学习包与成绩。"), o((c) => c + 1);
            }), children: "保存新版本" }),
            E && ["draft", "changes_requested"].includes(ye.state) && /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Se || !J || !ue.trim(), onClick: () => Ue("submit"), children: "提交题目审核" })
          ] }),
          oe && ye.state === "pending_review" && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: we, onChange: (c) => Ce(c.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Se || !we || !J || !ue.trim(), onClick: () => Ue("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ a.jsx("button", { className: "button ghost", disabled: Se || !J || !ue.trim(), onClick: () => Ue("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          ye.revisions.map((c) => /* @__PURE__ */ a.jsxs("p", { children: [
            "v",
            c.version,
            " · ",
            Sl[c.state]
          ] }, c.id)),
          ye.review_actions.map((c, q) => /* @__PURE__ */ a.jsxs("p", { children: [
            "v",
            c.version,
            " · ",
            Sl[c.action] || c.action,
            " · ",
            c.reason
          ] }, q))
        ] })
      ] })
    ] }) : H ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "开放题评分方式", value: Fe, onChange: (c) => mt(c.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ a.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Nt && /* @__PURE__ */ a.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          de.length ? de.map((c) => /* @__PURE__ */ a.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ a.jsx("h3", { children: c.title }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              "固定版本 v",
              c.version,
              " · ",
              c.question_count,
              "题"
            ] }),
            /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Se, onClick: () => rl(c), children: "开始本次练习" })
          ] }, c.id)) : /* @__PURE__ */ a.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          he.map((c) => /* @__PURE__ */ a.jsx("p", { children: /* @__PURE__ */ a.jsxs("button", { className: "text-button", onClick: () => O("/learn/attempts/" + c.id), children: [
            Sl[c.state],
            " · ",
            Sl[c.result_state],
            " · ",
            new Date(c.started_at).toLocaleString("zh-CN")
          ] }) }, c.id)),
          !he.length && /* @__PURE__ */ a.jsx("p", { children: "还没有学习记录。" })
        ] })
      ] })
    ] }) : xe ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "学习完成与评分复核" }) }),
      /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
        /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
          /* @__PURE__ */ a.jsx("th", { children: "学习包" }),
          /* @__PURE__ */ a.jsx("th", { children: "学员编号" }),
          /* @__PURE__ */ a.jsx("th", { children: "状态" }),
          /* @__PURE__ */ a.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ a.jsx("tbody", { children: he.map((c) => {
          var q;
          return /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsxs("td", { children: [
              c.title,
              " · v",
              c.package_version
            ] }),
            /* @__PURE__ */ a.jsx("td", { children: (q = c.learner_id) == null ? void 0 : q.slice(0, 8) }),
            /* @__PURE__ */ a.jsxs("td", { children: [
              Sl[c.state],
              " · ",
              Sl[c.result_state]
            ] }),
            /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: c.state !== "submitted", onClick: () => O("/training/results/" + c.id), children: "查看结果与复核" }) })
          ] }, c.id);
        }) })
      ] }) }),
      zt
    ] }) : G ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      E && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "组建固定版本学习包" }),
          /* @__PURE__ */ a.jsx("span", { children: "只选用当前已审核题目；修改后创建新包版本" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ a.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ a.jsx("select", { value: I, onChange: (c) => {
                ze(c.target.value), T([]);
              }, children: f.filter((c) => wt(c, "training.manage")).map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id)) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ a.jsx("input", { value: Y, onChange: (c) => L(c.target.value) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ a.jsx("input", { value: P, onChange: (c) => re(c.target.value) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ a.jsx("input", { type: "number", min: 1, value: F, onChange: (c) => Qe(Number(c.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "source-options", children: ae.filter((c) => c.project_id === I).map((c) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: v.includes(c.revision_id), onChange: (q) => T((V) => Wt(V, c.revision_id, q.target.checked)) }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              ps[c.type],
              " · ",
              c.title,
              " · v",
              c.version
            ] })
          ] }, c.revision_id)) }),
          /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: Se || !v.length || v.length > 30 || !Y.trim(), onClick: () => void A(async () => {
            await m("/training/packages", { method: "POST", body: JSON.stringify({ title: Y, package_key: P, version: F, project_id: I, question_revision_ids: v, role_scope: ["learner", "admin", "teacher"] }) }), Ke("学习包草稿已建立，发布后学员可使用。"), o((c) => c + 1);
          }), children: [
            "创建学习包草稿（",
            v.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ a.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ a.jsx("div", { className: "proof-body", children: de.map((c) => /* @__PURE__ */ a.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ a.jsxs("h3", { children: [
            c.title,
            " · v",
            c.version
          ] }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            Sl[c.state],
            " · ",
            c.question_count,
            "题 · ",
            c.package_key
          ] }),
          c.state === "draft" && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void A(async () => {
            await m(`/training/packages/${c.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: c.row_version, reason: "发布已审核题目的固定版本学习包" }) }), Ke("学习包已发布。"), o((q) => q + 1);
          }), children: "发布此学习包版本" })
        ] }, c.id)) }),
        zt
      ] })
    ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      E && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "从已发布知识生成题目候选" }),
          /* @__PURE__ */ a.jsx("span", { children: "本地模板演示，教员核对后才可入学习包" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ a.jsx("select", { value: I, onChange: (c) => {
              ze(c.target.value), U([]);
            }, children: f.filter((c) => wt(c, "training.manage")).map((c) => /* @__PURE__ */ a.jsx("option", { value: c.id, children: c.name }, c.id)) })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "source-options", children: [
            fe.map((c) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: b.includes(c.revision_id), onChange: (q) => U((V) => Wt(V, c.revision_id, q.target.checked)) }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                c.title,
                /* @__PURE__ */ a.jsxs("small", { children: [
                  c.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, c.revision_id)),
            !fe.length && /* @__PURE__ */ a.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "card-actions", children: Object.entries(ps).map(([c, q]) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: Q.includes(c), onChange: (V) => pe((ge) => Wt(ge, c, V.target.checked)) }),
            q
          ] }, c)) }),
          /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: Se || !b.length || b.length > 10 || !Q.length, onClick: () => void A(async () => {
            const c = await m("/training/questions/generate", { method: "POST", body: JSON.stringify({ knowledge_revision_ids: b, types: Q }) });
            Ke("已生成或复用" + c.items.length + "道候选题，仍需核查答案与来源后提交审核。"), o((q) => q + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。当前未调用出题大模型，不宣称题目难度与质量已验证。" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ a.jsxs("select", { "aria-label": "题目状态", value: Pe, onChange: (c) => {
            at(c.target.value), Le(""), je([]);
          }, children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((c) => /* @__PURE__ */ a.jsx("option", { value: c, children: Sl[c] }, c))
          ] })
        ] }),
        ae.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
          /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("th", { children: "题面" }),
            /* @__PURE__ */ a.jsx("th", { children: "类型" }),
            /* @__PURE__ */ a.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ a.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ a.jsx("tbody", { children: ae.map((c) => /* @__PURE__ */ a.jsxs("tr", { children: [
            /* @__PURE__ */ a.jsx("td", { children: c.title }),
            /* @__PURE__ */ a.jsx("td", { children: ps[c.type] }),
            /* @__PURE__ */ a.jsxs("td", { children: [
              "v",
              c.version,
              " · ",
              Sl[c.state],
              c.published && /* @__PURE__ */ a.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/training/questions/" + c.id), children: "核查与审核" }) })
          ] }, c.id)) })
        ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ a.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        zt
      ] })
    ] })
  ] });
}
const Zx = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Vx({ api: m, path: N, navigate: O, projects: f, identity: H }) {
  var re, F, Qe;
  const Z = N === "/settings/models", K = f.some((z) => z.can_manage), W = f.some((z) => z.can_run), [D, p] = h.useState(((re = f.find((z) => z.can_run)) == null ? void 0 : re.id) || ""), [G, xe] = h.useState([]), [E, oe] = h.useState([]), [I, ze] = h.useState(null), [ae, Ne] = h.useState(Zx), [de, X] = h.useState("llm"), [fe, le] = h.useState(null), [he, Ee] = h.useState(""), [ye, Me] = h.useState(sessionStorage.getItem("b07-extraction-" + H) || ""), [ce, De] = h.useState(null), [ue, Je] = h.useState(!1), [we, Ce] = h.useState(!0), [b, U] = h.useState(""), [Q, pe] = h.useState(""), [v, T] = h.useState(0), Y = async (z) => {
    Je(!0), U(""), pe("");
    try {
      await z();
    } catch (ne) {
      U(ne.message);
    } finally {
      Je(!1);
    }
  };
  h.useEffect(() => {
    let z = !1;
    return Ce(!0), U(""), oe([]), (async () => {
      var ke;
      try {
        if (Z) {
          if (!K) throw new Error("仅管理员可配置云端模型。");
          const se = await m("/models/settings");
          z || le(se);
        } else {
          if (!W || !D) throw new Error("当前身份没有知识加工权限。");
          const [se, me] = await Promise.all([m(`/knowledge/source-options?project_id=${D}&limit=100`), m(`/knowledge/taxonomies?project_id=${D}`)]);
          z || (xe(se.items), ze(me.items[0] || null), Ne(structuredClone(((ke = me.items[0]) == null ? void 0 : ke.categories) || me.suggested_categories)));
        }
      } catch (se) {
        z || U(se.message);
      } finally {
        z || Ce(!1);
      }
    })(), () => {
      z = !0;
    };
  }, [N, D, v]), h.useEffect(() => {
    if (!ye || Z) return;
    let z = !1, ne;
    const ke = async () => {
      try {
        const se = await m("/knowledge/extraction-jobs/" + ye);
        if (z) return;
        De(se), ["queued", "running", "retrying"].includes(se.status) && (ne = window.setTimeout(() => void ke(), 1800));
      } catch (se) {
        z || U(se.message);
      }
    };
    return ke(), () => {
      z = !0, window.clearTimeout(ne);
    };
  }, [ye, N, v]);
  const L = (z, ne) => Ne((ke) => ke.map((se, me) => me === z ? { ...se, ...ne } : se)), P = JSON.stringify(ae) !== JSON.stringify((I == null ? void 0 : I.categories) || []);
  return /* @__PURE__ */ a.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ a.jsx(ya, { size: 20 }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: Z ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ a.jsx("span", { children: Z ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    b && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ a.jsx(pa, { size: 18 }),
      b
    ] }),
    Q && /* @__PURE__ */ a.jsx("div", { className: "feedback success", role: "status", children: Q }),
    /* @__PURE__ */ a.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ a.jsx("button", { className: Z ? "" : "selected", onClick: () => O("/extraction"), children: "施工要点萃取" }),
        K && /* @__PURE__ */ a.jsx("button", { className: Z ? "selected" : "", onClick: () => O("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ a.jsx("button", { onClick: () => O("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => T((z) => z + 1), children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 15 }),
        "刷新"
      ] })
    ] }),
    we ? /* @__PURE__ */ a.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : Z && fe ? /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { children: "兼容接口连接" }),
        /* @__PURE__ */ a.jsx("span", { children: "DeepSeek、通义等提供的 Chat Completions 兼容服务" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: fe.enabled, onChange: (z) => le({ ...fe, enabled: z.target.checked }) }),
          "启用云端调用，允许发送本次选择的加工资料或评分文本"
        ] }),
        /* @__PURE__ */ a.jsxs("label", { children: [
          "服务地址",
          /* @__PURE__ */ a.jsx("input", { "aria-label": "模型服务地址", value: fe.base_url, onChange: (z) => le({ ...fe, base_url: z.target.value }) })
        ] }),
        /* @__PURE__ */ a.jsxs("label", { children: [
          "模型名称",
          /* @__PURE__ */ a.jsx("input", { "aria-label": "模型名称", value: fe.model, onChange: (z) => le({ ...fe, model: z.target.value }), placeholder: "填写该服务支持的模型名称" })
        ] }),
        /* @__PURE__ */ a.jsxs("label", { children: [
          "API 密钥",
          /* @__PURE__ */ a.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", value: he, onChange: (z) => Ee(z.target.value), placeholder: fe.api_key_configured ? "已保存；留空保留，换地址需重填" : "尚未配置" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "请求超时（秒）",
            /* @__PURE__ */ a.jsx("input", { type: "number", min: 5, max: 180, value: fe.timeout_seconds, onChange: (z) => le({ ...fe, timeout_seconds: Number(z.target.value) }) })
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "最大输出 token",
            /* @__PURE__ */ a.jsx("input", { type: "number", min: 256, max: 16e3, value: fe.max_tokens, onChange: (z) => le({ ...fe, max_tokens: Number(z.target.value) }) })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ a.jsx("button", { className: "button primary", disabled: ue, onClick: () => void Y(async () => {
            const { api_key_configured: z, ...ne } = fe;
            le(await m("/models/settings", { method: "PUT", body: JSON.stringify({ ...ne, ...he ? { api_key: he } : {} }) })), Ee(""), pe("模型配置已保存在本机，密钥未返回网页。");
          }), children: "保存模型配置" }),
          /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: ue || !fe.enabled, onClick: () => void Y(async () => {
            const z = await m("/models/test", { method: "POST" });
            pe(z.status === "ok" ? "连接与结构化输出测试通过（未发送业务资料）。" : "服务有响应，但测试内容不符合预期。");
          }), children: "测试已保存连接" })
        ] }),
        /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "保存后再测试。未配置、超时或结构不符会明确失败，不会伪装成真实大模型结果。使用前核对服务方的数据使用约定。" })
      ] })
    ] }) : !Z && W ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ a.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ a.jsx("select", { "aria-label": "萃取项目", value: D, onChange: (z) => p(z.target.value), children: f.filter((z) => z.can_run).map((z) => /* @__PURE__ */ a.jsx("option", { value: z.id, children: z.name }, z.id)) })
          ] }),
          /* @__PURE__ */ a.jsxs("p", { className: "small-note", children: [
            "当前",
            I ? "分类 v" + I.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          ae.map((z, ne) => /* @__PURE__ */ a.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ a.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ a.jsx("input", { "aria-label": "类别编码" + (ne + 1), value: z.code, onChange: (ke) => L(ne, { code: ke.target.value }) })
              ] }),
              /* @__PURE__ */ a.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ a.jsx("input", { "aria-label": "类别名称" + (ne + 1), value: z.name, onChange: (ke) => L(ne, { name: ke.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ a.jsx("textarea", { value: z.focus, onChange: (ke) => L(ne, { focus: ke.target.value }) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ a.jsx("input", { value: z.keywords.join("，"), onChange: (ke) => L(ne, { keywords: ke.target.value.split(/[,，]/).map((se) => se.trim()).filter(Boolean) }) })
            ] }),
            ae.length > 1 && /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => Ne((ke) => ke.filter((se, me) => me !== ne)), children: "移除此类别" })
          ] }, ne)),
          /* @__PURE__ */ a.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ a.jsxs("button", { className: "button ghost", disabled: ae.length >= 30, onClick: () => Ne([...ae, { code: "category_" + (ae.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ a.jsx(bx, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: ue || !P, onClick: () => void Y(async () => {
              const z = await m("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: D, expected_version: (I == null ? void 0 : I.version) || 0, categories: ae }) });
              ze(z), Ne(z.categories), pe("分类版本已固定，可开始加工。");
            }), children: "保存分类新版本" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsx("h2", { children: "选择已有风险记录" }),
          /* @__PURE__ */ a.jsx("span", { children: "最多20条；单次文本最多60000字符" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => oe(G.slice(0, 20).map((z) => z.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ a.jsx("div", { className: "source-options", children: G.map((z) => /* @__PURE__ */ a.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: E.includes(z.record_version_id), onChange: (ne) => oe((ke) => ne.target.checked ? [...ke, z.record_version_id] : ke.filter((se) => se !== z.record_version_id)) }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              z.description || "缺少描述",
              /* @__PURE__ */ a.jsxs("small", { children: [
                "固定来源 v",
                z.current_version
              ] })
            ] })
          ] }, z.id)) }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            "加工方式",
            /* @__PURE__ */ a.jsxs("select", { "aria-label": "知识加工方式", value: de, onChange: (z) => X(z.target.value), children: [
              /* @__PURE__ */ a.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ a.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "card-actions", children: /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: ue || !I || P || !E.length || E.length > 20, onClick: () => void Y(async () => {
            const z = await m("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: E, taxonomy_id: I.id, mode: de }) });
            Me(z.job_id), sessionStorage.setItem("b07-extraction-" + H, z.job_id), pe("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            E.length,
            "条来源）"
          ] }) }),
          /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "模型自主完成分类、跨记录归纳与证据摘录，人工只核对候选。不会自动批准为有效标准或直接发布。" })
        ] })
      ] }),
      ce && /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ a.jsxs("h2", { children: [
            "最近加工任务 · ",
            ce.progress,
            "%"
          ] }),
          /* @__PURE__ */ a.jsx("span", { children: ce.status })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "proof-body", children: [
          ce.error && /* @__PURE__ */ a.jsx("p", { className: "warning-text", children: ce.error }),
          /* @__PURE__ */ a.jsxs("p", { children: [
            "模式：",
            ce.result.generation_mode === "llm" ? "云端大模型" : ce.result.generation_mode === "mock" ? "本地模板演示" : "等待处理"
          ] }),
          ce.result.model && /* @__PURE__ */ a.jsxs("p", { children: [
            "模型：",
            ce.result.model.model_ref,
            " · 用量 ",
            JSON.stringify(ce.result.model.usage)
          ] }),
          (F = ce.result.items) == null ? void 0 : F.map((z) => /* @__PURE__ */ a.jsxs("p", { children: [
            /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => O("/knowledge/" + z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, z.item_id)),
          (Qe = ce.result.missing_information) == null ? void 0 : Qe.map((z, ne) => /* @__PURE__ */ a.jsxs("p", { children: [
            "资料缺口：",
            z
          ] }, ne)),
          ce.status === "failed" && /* @__PURE__ */ a.jsx("button", { className: "button secondary", disabled: ue, onClick: () => void Y(async () => {
            await m("/jobs/" + ce.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ce.row_version }) }), T((z) => z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const ar = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, bh = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Mi = { "demo-airport": "机场检查 · 演示", "demo-metro": "地铁监护 · 演示" }, Di = (m) => new Date(m).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Jx = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function Kx({ embedded: m = !1 }) {
  const [N, O] = h.useState(localStorage.getItem("b01-identity") || "admin"), [f, H] = h.useState(Ai()), [Z, K] = h.useState(!1), W = f === "/platform/services", D = f.startsWith("/archive-review/"), p = /^\/imports\/ai_[a-f0-9]{32}$/.test(f), [G, xe] = h.useState(["/sources", "/imports", "/records"].some((d) => Ai().startsWith(d))), E = ["/search", "/releases", "/knowledge/library"].includes(f) || /^\/knowledge\/[^/]+$/.test(f) && f !== "/knowledge/drafts", oe = !E && ["/quality", "/knowledge", "/reviews"].some((d) => f.startsWith(d)), I = f.startsWith("/training") || f.startsWith("/learn"), ze = f.startsWith("/extraction") || f === "/settings/models", ae = f.startsWith("/retrospectives"), Ne = f.startsWith("/task-packages"), de = !p && ["/sources", "/imports", "/records"].some((d) => f.startsWith(d)), [X, fe] = h.useState(null), [le, he] = h.useState([]), [Ee, ye] = h.useState({}), [Me, ce] = h.useState(!1), [De, ue] = h.useState(""), [Je, we] = h.useState(""), [Ce, b] = h.useState(!0), [U, Q] = h.useState(!1), [pe, v] = h.useState(0), [T, Y] = h.useState(""), [L, P] = h.useState(""), [re, F] = h.useState(""), [Qe, z] = h.useState(null), [ne, ke] = h.useState([]), [se, me] = h.useState(null), [qe, Fe] = h.useState(!1), [mt, rt] = h.useState("demo-airport"), [He, tt] = h.useState("success"), [Ze, Ie] = h.useState(null), [te, dt] = h.useState(""), [be, Pe] = h.useState("processor"), [at, ct] = h.useState("demo-airport"), [Le, Ye] = h.useState([]);
  async function _(d, o = {}) {
    const A = await Zt("/api/v1" + d, {
      ...o,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${N}`, ...o.headers }
    });
    if (!A.ok) {
      const J = await A.json().catch(() => ({}));
      throw new Error(J.message || `请求失败（${A.status}），请刷新后重试。`);
    }
    return A.json();
  }
  const $ = (d) => {
    var A, J;
    const o = window;
    m && ((A = o.QaxcHasPendingEdits) != null && A.call(o)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((J = o.QaxcClearPendingEdits) == null || J.call(o), Xv(d), H(Ai()), ue(""), me(null), F(""), ke([]));
  };
  h.useEffect(() => {
    const d = () => H(Ai());
    return window.addEventListener("popstate", d), window.addEventListener("hashchange", d), () => {
      window.removeEventListener("popstate", d), window.removeEventListener("hashchange", d);
    };
  }, []), h.useEffect(() => {
    const d = () => K(!0);
    return window.addEventListener("b-session-expired", d), () => window.removeEventListener("b-session-expired", d);
  }, []), h.useEffect(() => {
    let d = !1;
    b(!0), ue(""), fe(null), Ie(null), he([]), Ye([]);
    async function o() {
      try {
        const A = await _("/me");
        if (d) return;
        const J = window.QaxcProjectId;
        m && J && (A.projects = A.projects.filter((Ue) => Ue.id === J)), fe(A);
        const Be = await _("/health");
        if (d || (ce(Be.worker_online), p || W || D || de || oe || E || Ne || ae || I || ze)) return;
        if (f === "/settings/access") {
          if (!A.projects.some((zt) => zt.can_manage)) return;
          const [Ue, nt] = await Promise.all([_("/access"), _("/audit-events?limit=10")]);
          if (d) return;
          Ie(Ue), Ye(nt.items), dt((zt) => {
            var Wt;
            return Ue.users.some((rl) => rl.id === zt) ? zt : ((Wt = Ue.users[0]) == null ? void 0 : Wt.id) || "";
          });
        } else {
          const [Ue, nt] = await Promise.all([
            _(`/jobs?limit=12${L ? `&kind=${L}` : ""}${T ? `&status=${T}` : ""}${re ? `&cursor=${encodeURIComponent(re)}` : ""}`),
            _("/dashboard")
          ]);
          if (d) return;
          he(Ue.items), z(Ue.next_cursor), ye(nt.counts);
        }
      } catch (A) {
        d || ue(A.message);
      } finally {
        d || b(!1);
      }
    }
    return o(), () => {
      d = !0;
    };
  }, [N, f, T, L, re, pe]), h.useEffect(() => {
    if (!X || p || W || D || f === "/settings/access" || de || oe || E || Ne || ae || I || ze) return;
    let d = !1;
    const o = window.setInterval(async () => {
      try {
        const [A, J, Be] = await Promise.all([
          _(`/jobs?limit=12${L ? `&kind=${L}` : ""}${T ? `&status=${T}` : ""}${re ? `&cursor=${encodeURIComponent(re)}` : ""}`),
          _("/dashboard"),
          _("/health")
        ]);
        if (d) return;
        he(A.items), z(A.next_cursor), ye(J.counts), ce(Be.worker_online), me((Ue) => Ue ? A.items.find((nt) => nt.id === Ue.id) || Ue : null), ue("");
      } catch (A) {
        d || (ue(A.message), ce(!1));
      }
    }, 2e3);
    return () => {
      d = !0, clearInterval(o);
    };
  }, [N, f, T, L, re, X == null ? void 0 : X.id]);
  const je = async (d) => {
    Q(!0), ue(""), we("");
    try {
      await d(), v((o) => o + 1);
    } catch (o) {
      ue(o.message);
    } finally {
      Q(!1);
    }
  }, et = () => je(async () => {
    await _("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: mt, scenario: He, duration_seconds: 6 })
    }), Fe(!1), we("任务已保存，处理服务会自动执行。"), $("/jobs");
  }), Re = (d) => je(async () => {
    await _(`/jobs/${d.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: d.row_version })
    }), we("已提交重试，原任务和来源保持不变。");
  }), Se = (d) => je(async () => {
    const o = await Zt(`/api/v1/assets/${d.result_ref}/content`, { headers: { Authorization: `Bearer dev-${N}` } });
    if (!o.ok) {
      const Be = await o.json();
      throw new Error(Be.message);
    }
    const A = document.createElement("a"), J = URL.createObjectURL(await o.blob());
    A.href = J, A.download = `演示检查结果-${d.id.slice(0, 8)}.txt`, A.click(), URL.revokeObjectURL(J), we("演示结果已下载。");
  }), j = !Nt && (X == null ? void 0 : X.projects.some((d) => d.can_run)), ie = (d) => {
    const o = X == null ? void 0 : X.projects.find((J) => J.id === d.project_id);
    if ((o == null ? void 0 : o.permissions) == null) return !!(o != null && o.can_run);
    const A = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_grading: "training.manage"
    };
    return !!A[d.kind] && o.permissions.includes(A[d.kind]);
  }, ee = X == null ? void 0 : X.projects.some((d) => d.can_manage), lt = p ? "A 成果接入" : W ? "平台服务" : D ? "归档成果复盘" : I ? f.startsWith("/learn") ? "我的学习" : "培训与学习记录" : ze ? f === "/settings/models" ? "云端模型配置" : "施工要点知识萃取" : ae ? "过程复盘与经验" : Ne ? "归档成果与证据" : E ? f === "/releases" ? "知识发布管理" : f === "/search" ? "知识检索" : "已发布知识库" : oe ? "知识加工与审核" : de ? f.startsWith("/sources") ? "历史数据来源" : f.startsWith("/imports") ? "历史项目" : "风险数据" : f === "/settings/access" ? "成员与权限" : f === "/jobs" ? "处理任务" : "我的工作台", Ke = (Ee.queued || 0) + (Ee.running || 0) + (Ee.retrying || 0);
  return /* @__PURE__ */ a.jsxs("div", { className: "app-shell", children: [
    !m && /* @__PURE__ */ a.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ a.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ a.jsx(mh, { size: 26 }) }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "工程风险",
          /* @__PURE__ */ a.jsx("span", { children: "知识与复盘培训中心" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "workspace-label", children: Nt ? "质量安全小察 / 知识与学习" : "B模块 / 开发工作区" }),
      /* @__PURE__ */ a.jsxs("nav", { "aria-label": "主导航", children: [
        Nt && /* @__PURE__ */ a.jsxs("button", { className: "nav-item", onClick: () => {
          window.location.href = "/quality/";
        }, children: [
          /* @__PURE__ */ a.jsx(oh, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", oh, "我的工作台"], ["/jobs", ix, "处理任务"]].map(([d, o, A]) => {
          const J = o;
          return /* @__PURE__ */ a.jsxs("button", { "aria-label": String(A), className: f === d || d === "/workbench" && f === "/" ? "nav-item active" : "nav-item", onClick: () => $(String(d)), children: [
            /* @__PURE__ */ a.jsx(J, { size: 19 }),
            /* @__PURE__ */ a.jsx("span", { children: String(A) }),
            /* @__PURE__ */ a.jsx(Jl, { size: 15 })
          ] }, String(d));
        }),
        /* @__PURE__ */ a.jsxs("button", { className: `nav-item governance-toggle ${de ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": G, "aria-controls": "governance-menu", onClick: () => xe((d) => !d), children: [
          /* @__PURE__ */ a.jsx(Ri, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ a.jsx(Jl, { className: G ? "expanded" : "", size: 15 })
        ] }),
        G && /* @__PURE__ */ a.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([d, o]) => /* @__PURE__ */ a.jsx("button", { "aria-label": o, className: f.startsWith(d) ? "active" : "", onClick: () => $(d), children: o }, d)) }),
        /* @__PURE__ */ a.jsxs("button", { className: oe || ze ? "nav-item active" : "nav-item", onClick: () => $("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ a.jsx(yn, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] }),
        /* @__PURE__ */ a.jsxs("button", { className: E ? "nav-item active" : "nav-item", onClick: () => $("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ a.jsx(yn, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] }),
        /* @__PURE__ */ a.jsxs("button", { className: Ne ? "nav-item active" : "nav-item", onClick: () => $("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ a.jsx(yn, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] }),
        /* @__PURE__ */ a.jsxs("button", { className: ae ? "nav-item active" : "nav-item", onClick: () => $("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ a.jsx(ch, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] }),
        /* @__PURE__ */ a.jsxs("button", { className: I ? "nav-item active" : "nav-item", onClick: () => $(X != null && X.projects.some((d) => d.roles.some((o) => ["admin", "teacher", "reviewer"].includes(o))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ a.jsx(Hi, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] }),
        !Nt && /* @__PURE__ */ a.jsxs("button", { className: f === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => $("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ a.jsx(Cx, { size: 19 }),
          /* @__PURE__ */ a.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ a.jsx(Jl, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ a.jsx(Ri, { size: 19 }),
        /* @__PURE__ */ a.jsx("strong", { children: "项目范围隔离" }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          "记录、文件和操作权限",
          /* @__PURE__ */ a.jsx("br", {}),
          "随当前身份实时检查。"
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "sidebar-bottom", children: [
        /* @__PURE__ */ a.jsx("span", { className: "dot" }),
        Nt ? "平台账号 · 项目授权" : "本地开发 · B07",
        /* @__PURE__ */ a.jsx("span", { className: "version", children: "v0.7" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: m ? "main-shell embedded-main" : "main-shell", children: [
      !m && /* @__PURE__ */ a.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ a.jsx(Jl, { size: 14 }),
          /* @__PURE__ */ a.jsx("strong", { children: lt })
        ] }),
        Nt ? /* @__PURE__ */ a.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ a.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ a.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ a.jsx("select", { "aria-label": "切换模拟身份", value: N, onChange: (d) => {
            localStorage.setItem("b01-identity", d.target.value), O(d.target.value), me(null), F(""), ke([]), we("");
          }, children: Jx.map(([d, o]) => /* @__PURE__ */ a.jsx("option", { value: d, children: o }, d)) })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("main", { children: [
        m && !p && !E && !W && /* @__PURE__ */ a.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (de ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : I ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : oe || ze ? [["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"]] : E ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : Ne ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([d, o]) => /* @__PURE__ */ a.jsx("button", { className: f === d ? "button primary" : "button ghost", onClick: () => $(d), children: o }, d)) }),
        /* @__PURE__ */ a.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ a.jsx("h1", { children: lt }),
            /* @__PURE__ */ a.jsx("p", { children: p ? "指定版本接入、证据校验与过程复盘。" : I ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : ze ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : ae ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : Ne ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : E ? "固定审核版本发布，以项目权限检索知识并打开来源。" : oe ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : de ? "一次接入模拟资料，保留原文、治理生效值与来源证据。" : f === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "heading-actions", children: [
            !m && /* @__PURE__ */ a.jsxs("button", { className: "button ghost", onClick: () => v((d) => d + 1), disabled: Ce, children: [
              /* @__PURE__ */ a.jsx(Ol, { size: 16 }),
              "刷新"
            ] }),
            !Nt && !de && !oe && !E && !Ne && !ae && !I && !ze && f !== "/settings/access" && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: !j || U, onClick: () => {
              var d;
              rt(((d = X == null ? void 0 : X.projects.find((o) => o.can_run)) == null ? void 0 : d.id) || "demo-airport"), Fe(!0);
            }, children: [
              /* @__PURE__ */ a.jsx(hh, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Nt && !de && !oe && !E && !Ne && !ae && !I && !ze && /* @__PURE__ */ a.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ a.jsx(mh, { size: 18 }),
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ a.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        Z && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ a.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        De && /* @__PURE__ */ a.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ a.jsx(pa, { size: 18 }),
          De,
          /* @__PURE__ */ a.jsx("button", { onClick: () => v((d) => d + 1), children: "重新加载" })
        ] }),
        Je && /* @__PURE__ */ a.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ a.jsx(ya, { size: 18 }),
          Je,
          /* @__PURE__ */ a.jsx("button", { "aria-label": "关闭提示", onClick: () => we(""), children: /* @__PURE__ */ a.jsx(qi, { size: 16 }) })
        ] }),
        Z ? null : p ? X ? /* @__PURE__ */ a.jsx(Qv, { id: f.split("/").pop(), identity: X.id, projects: X.projects, navigate: $ }) : /* @__PURE__ */ a.jsx("p", { children: De || "正在读取身份…" }) : Ce ? /* @__PURE__ */ a.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ a.jsx(fh, { className: "spin", size: 24 }),
          /* @__PURE__ */ a.jsx("span", { children: "正在读取工作区…" })
        ] }) : De ? null : W ? /* @__PURE__ */ a.jsx(Zv, { navigate: $ }, pe) : D ? /* @__PURE__ */ a.jsx(Vv, { deliveryId: decodeURIComponent(f.split("/")[2]), navigate: $ }, f) : I ? /* @__PURE__ */ a.jsx(Qx, { api: _, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [] }, N) : ze ? /* @__PURE__ */ a.jsx(Vx, { api: _, identity: N, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [] }, N) : ae ? /* @__PURE__ */ a.jsx(Xx, { api: _, identity: N, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [] }, N) : Ne ? /* @__PURE__ */ a.jsx(Yx, { identity: N, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [] }, N) : E ? /* @__PURE__ */ a.jsx(Mx, { identity: N, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [] }, N) : oe ? /* @__PURE__ */ a.jsx(Ax, { api: _, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [], identity: N }, N) : de ? /* @__PURE__ */ a.jsx(zx, { api: _, path: f, navigate: $, projects: (X == null ? void 0 : X.projects) || [], identity: N }, N) : f === "/settings/access" ? ee ? Ze && /* @__PURE__ */ a.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ a.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ a.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                Ze.bindings.length,
                " 项绑定"
              ] })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
              /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
                /* @__PURE__ */ a.jsx("th", { children: "成员" }),
                /* @__PURE__ */ a.jsx("th", { children: "项目" }),
                /* @__PURE__ */ a.jsx("th", { children: "角色" }),
                /* @__PURE__ */ a.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ a.jsx("tbody", { children: Ze.bindings.map((d) => {
                var o;
                return /* @__PURE__ */ a.jsxs("tr", { children: [
                  /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("strong", { children: (o = Ze.users.find((A) => A.id === d.user_id)) == null ? void 0 : o.name }) }),
                  /* @__PURE__ */ a.jsx("td", { children: Mi[d.project_id] }),
                  /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("span", { className: "role-tag", children: bh[d.role] }) }),
                  /* @__PURE__ */ a.jsx("td", { children: d.role === "admin" ? /* @__PURE__ */ a.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ a.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: U,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && je(async () => {
                          await _(`/role-bindings/${d.id}`, { method: "DELETE", body: JSON.stringify({ row_version: d.row_version }) }), we("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, d.id);
              }) })
            ] }) }),
            /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ a.jsx(Ri, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ a.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ a.jsx("select", { value: te, onChange: (d) => dt(d.target.value), children: Ze.users.map((d) => /* @__PURE__ */ a.jsx("option", { value: d.id, children: d.name }, d.id)) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ a.jsx("select", { value: at, onChange: (d) => ct(d.target.value), children: Ze.projects.map((d) => /* @__PURE__ */ a.jsx("option", { value: d.id, children: d.name }, d.id)) })
            ] }),
            /* @__PURE__ */ a.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ a.jsx("select", { value: be, onChange: (d) => Pe(d.target.value), children: Object.entries(bh).filter(([d]) => d !== "admin" && d !== "a_service").map(([d, o]) => /* @__PURE__ */ a.jsx("option", { value: d, children: o }, d)) })
            ] }),
            /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: U || !te, onClick: () => void je(async () => {
              await _("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: te, project_id: at, role: be }) }), we("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ a.jsx(ga, { size: 16 })
            ] }),
            /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ a.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ a.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ a.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            Le.length ? Le.map((d) => /* @__PURE__ */ a.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ a.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ a.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[d.action] || d.action }),
              /* @__PURE__ */ a.jsx("span", { children: Mi[d.project_id] }),
              /* @__PURE__ */ a.jsx("time", { children: Di(d.created_at) })
            ] }, d.id)) : /* @__PURE__ */ a.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ a.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ a.jsx(Ri, { size: 38 }),
          /* @__PURE__ */ a.jsx("h2", { children: "当前身份没有管理权限" }),
          /* @__PURE__ */ a.jsx("p", { children: "可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。" })
        ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
          /* @__PURE__ */ a.jsxs("section", { className: "metrics", "aria-label": "任务概况", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ a.jsx("span", { children: "处理中" }),
              /* @__PURE__ */ a.jsx("strong", { children: Ke }),
              /* @__PURE__ */ a.jsx("small", { children: "包含等待与自动重试" })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ a.jsx("span", { children: "已完成" }),
              /* @__PURE__ */ a.jsx("strong", { children: Ee.succeeded || 0 }),
              /* @__PURE__ */ a.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ a.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ a.jsx("strong", { className: Ee.failed ? "danger-color" : "", children: Ee.failed || 0 }),
              /* @__PURE__ */ a.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ a.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ a.jsxs("strong", { children: [
                /* @__PURE__ */ a.jsx("i", { className: `dot ${Me ? "green" : "orange"}` }),
                Me ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ a.jsx("small", { children: Me ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsx("h2", { children: f === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ a.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ a.jsxs("select", { "aria-label": "任务类型筛选", value: L, onChange: (d) => {
                P(d.target.value), F(""), ke([]);
              }, children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "全部类型" }),
                /* @__PURE__ */ a.jsx("option", { value: "demo_check", children: "演示检查" }),
                /* @__PURE__ */ a.jsx("option", { value: "source_import", children: "历史数据接入" }),
                /* @__PURE__ */ a.jsx("option", { value: "knowledge_generation", children: "知识候选生成" }),
                /* @__PURE__ */ a.jsx("option", { value: "release_build", children: "发布索引构建" }),
                /* @__PURE__ */ a.jsx("option", { value: "task_package_import", children: "A任务包接入" })
              ] }),
              /* @__PURE__ */ a.jsxs("select", { "aria-label": "任务状态筛选", value: T, onChange: (d) => {
                Y(d.target.value), F(""), ke([]);
              }, children: [
                /* @__PURE__ */ a.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(ar).map(([d, o]) => /* @__PURE__ */ a.jsx("option", { value: d, children: o }, d))
              ] })
            ] }),
            le.length ? /* @__PURE__ */ a.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ a.jsxs("table", { children: [
              /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
                /* @__PURE__ */ a.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ a.jsx("th", { children: "状态" }),
                /* @__PURE__ */ a.jsx("th", { children: "进度" }),
                /* @__PURE__ */ a.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ a.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ a.jsx("tbody", { children: le.map((d) => /* @__PURE__ */ a.jsxs("tr", { children: [
                /* @__PURE__ */ a.jsxs("td", { children: [
                  /* @__PURE__ */ a.jsx("button", { className: "job-title", onClick: () => me(d), children: d.title }),
                  /* @__PURE__ */ a.jsxs("small", { children: [
                    Mi[d.project_id],
                    /* @__PURE__ */ a.jsx("span", { className: "subtle-separator", children: "·" }),
                    d.kind === "source_import" ? "历史项目接入" : d.kind === "knowledge_generation" ? "知识候选生成" : d.kind === "release_build" ? "发布索引构建" : d.kind === "task_package_import" ? "A任务包接入" : "演示任务"
                  ] })
                ] }),
                /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsxs("span", { className: `status ${d.status}`, children: [
                  /* @__PURE__ */ a.jsx("i", {}),
                  ar[d.status]
                ] }) }),
                /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ a.jsx("div", { className: "progress-track", children: /* @__PURE__ */ a.jsx("span", { style: { width: `${d.progress}%` } }) }),
                  /* @__PURE__ */ a.jsxs("span", { children: [
                    d.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ a.jsx("td", { className: "muted nowrap", children: Di(d.created_at) }),
                /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsxs("div", { className: "row-actions", children: [
                  d.kind === "source_import" && /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => $("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ a.jsx("button", { className: "text-button", onClick: () => me(d), children: "详情" }),
                  d.status === "failed" && ie(d) && /* @__PURE__ */ a.jsx("button", { className: "text-button", disabled: U, onClick: () => void Re(d), children: "重试任务" }),
                  d.result_ref && /* @__PURE__ */ a.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: U, onClick: () => void Se(d), children: /* @__PURE__ */ a.jsx(rh, { size: 17 }) })
                ] }) })
              ] }, d.id)) })
            ] }) }) : /* @__PURE__ */ a.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ a.jsx(yn, { size: 42 }),
              /* @__PURE__ */ a.jsx("h2", { children: T ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ a.jsx("p", { children: T ? "切换筛选条件查看其他任务。" : j ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              j && !T && /* @__PURE__ */ a.jsxs("button", { className: "button secondary", onClick: () => Fe(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ a.jsx(ga, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ a.jsxs("span", { children: [
                "显示 ",
                le.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ a.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ a.jsx("button", { disabled: !ne.length, onClick: () => {
                  F(ne[ne.length - 1]), ke(ne.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ a.jsx("button", { disabled: !Qe, onClick: () => {
                  ke([...ne, re]), F(Qe || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          f !== "/jobs" && /* @__PURE__ */ a.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ a.jsx("div", { className: "next-icon", children: /* @__PURE__ */ a.jsx(ch, { size: 22 }) }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ a.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ a.jsxs("button", { className: "button secondary", onClick: () => $("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ a.jsx(ga, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ a.jsx("span", { children: Nt ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    qe && /* @__PURE__ */ a.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ a.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ a.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => Fe(!1), children: /* @__PURE__ */ a.jsx(qi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ a.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ a.jsx("select", { value: mt, onChange: (d) => rt(d.target.value), children: X == null ? void 0 : X.projects.filter((d) => d.can_run).map((d) => /* @__PURE__ */ a.jsx("option", { value: d.id, children: d.name }, d.id)) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ a.jsxs("select", { value: He, onChange: (d) => tt(d.target.value), children: [
          /* @__PURE__ */ a.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ a.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ a.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !Me && /* @__PURE__ */ a.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ a.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ a.jsx("button", { className: "button ghost", onClick: () => Fe(!1), children: "取消" }),
        /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: U || !j, onClick: () => void et(), children: [
          U ? /* @__PURE__ */ a.jsx(fh, { className: "spin", size: 16 }) : /* @__PURE__ */ a.jsx(hh, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    se && /* @__PURE__ */ a.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ a.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ a.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ a.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => me(null), children: /* @__PURE__ */ a.jsx(qi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ a.jsxs("span", { className: `status ${se.status}`, children: [
        /* @__PURE__ */ a.jsx("i", {}),
        ar[se.status]
      ] }),
      /* @__PURE__ */ a.jsx("h3", { children: se.title }),
      /* @__PURE__ */ a.jsxs("dl", { children: [
        /* @__PURE__ */ a.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ a.jsx("dd", { children: Mi[se.project_id] }),
        /* @__PURE__ */ a.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ a.jsx("dd", { children: se.attempts }),
        /* @__PURE__ */ a.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ a.jsx("dd", { children: Di(se.created_at) }),
        /* @__PURE__ */ a.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ a.jsx("dd", { children: Di(se.updated_at) }),
        /* @__PURE__ */ a.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ a.jsx("dd", { className: "mono", children: se.id })
      ] }),
      se.error && /* @__PURE__ */ a.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ a.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ a.jsx("p", { children: se.error })
      ] }),
      /* @__PURE__ */ a.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      se.result_ref && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: U, onClick: () => void Se(se), children: [
        /* @__PURE__ */ a.jsx(rh, { size: 16 }),
        "下载演示结果"
      ] }),
      se.status === "failed" && ie(se) && /* @__PURE__ */ a.jsxs("button", { className: "button primary", disabled: U, onClick: () => void Re(se), children: [
        /* @__PURE__ */ a.jsx(Ol, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function $x(m) {
  const N = Lv.createRoot(m);
  return N.render(/* @__PURE__ */ a.jsx(Kx, { embedded: !0 })), () => N.unmount();
}
export {
  $x as mountKnowledge
};
