var cu = { exports: {} }, En = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ff;
function fj() {
  if (ff) return En;
  ff = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function N(o, T, U) {
    var V = null;
    if (U !== void 0 && (V = "" + U), T.key !== void 0 && (V = "" + T.key), "key" in T) {
      U = {};
      for (var A in T)
        A !== "key" && (U[A] = T[A]);
    } else U = T;
    return T = U.ref, {
      $$typeof: u,
      type: o,
      key: V,
      ref: T !== void 0 ? T : null,
      props: U
    };
  }
  return En.Fragment = h, En.jsx = N, En.jsxs = N, En;
}
var mf;
function mj() {
  return mf || (mf = 1, cu.exports = fj()), cu.exports;
}
var s = mj(), ru = { exports: {} }, On = {}, uu = { exports: {} }, ou = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xf;
function xj() {
  return xf || (xf = 1, (function(u) {
    function h(y, Q) {
      var le = y.length;
      y.push(Q);
      e: for (; 0 < le; ) {
        var we = le - 1 >>> 1, m = y[we];
        if (0 < T(m, Q))
          y[we] = Q, y[le] = m, le = we;
        else break e;
      }
    }
    function N(y) {
      return y.length === 0 ? null : y[0];
    }
    function o(y) {
      if (y.length === 0) return null;
      var Q = y[0], le = y.pop();
      if (le !== Q) {
        y[0] = le;
        e: for (var we = 0, m = y.length, L = m >>> 1; we < L; ) {
          var P = 2 * (we + 1) - 1, te = y[P], re = P + 1, Z = y[re];
          if (0 > T(te, le))
            re < m && 0 > T(Z, te) ? (y[we] = Z, y[re] = le, we = re) : (y[we] = te, y[P] = le, we = P);
          else if (re < m && 0 > T(Z, le))
            y[we] = Z, y[re] = le, we = re;
          else break e;
        }
      }
      return Q;
    }
    function T(y, Q) {
      var le = y.sortIndex - Q.sortIndex;
      return le !== 0 ? le : y.id - Q.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var U = performance;
      u.unstable_now = function() {
        return U.now();
      };
    } else {
      var V = Date, A = V.now();
      u.unstable_now = function() {
        return V.now() - A;
      };
    }
    var Y = [], v = [], D = 1, K = null, k = 3, se = !1, je = !1, ye = !1, _e = !1, Ce = typeof setTimeout == "function" ? setTimeout : null, xe = typeof clearTimeout == "function" ? clearTimeout : null, F = typeof setImmediate < "u" ? setImmediate : null;
    function he(y) {
      for (var Q = N(v); Q !== null; ) {
        if (Q.callback === null) o(v);
        else if (Q.startTime <= y)
          o(v), Q.sortIndex = Q.expirationTime, h(Y, Q);
        else break;
        Q = N(v);
      }
    }
    function ae(y) {
      if (ye = !1, he(y), !je)
        if (N(Y) !== null)
          je = !0, H || (H = !0, pe());
        else {
          var Q = N(v);
          Q !== null && fe(ae, Q.startTime - y);
        }
    }
    var H = !1, ve = -1, Ae = 5, Ge = -1;
    function Ze() {
      return _e ? !0 : !(u.unstable_now() - Ge < Ae);
    }
    function Xe() {
      if (_e = !1, H) {
        var y = u.unstable_now();
        Ge = y;
        var Q = !0;
        try {
          e: {
            je = !1, ye && (ye = !1, xe(ve), ve = -1), se = !0;
            var le = k;
            try {
              t: {
                for (he(y), K = N(Y); K !== null && !(K.expirationTime > y && Ze()); ) {
                  var we = K.callback;
                  if (typeof we == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var m = we(
                      K.expirationTime <= y
                    );
                    if (y = u.unstable_now(), typeof m == "function") {
                      K.callback = m, he(y), Q = !0;
                      break t;
                    }
                    K === N(Y) && o(Y), he(y);
                  } else o(Y);
                  K = N(Y);
                }
                if (K !== null) Q = !0;
                else {
                  var L = N(v);
                  L !== null && fe(
                    ae,
                    L.startTime - y
                  ), Q = !1;
                }
              }
              break e;
            } finally {
              K = null, k = le, se = !1;
            }
            Q = void 0;
          }
        } finally {
          Q ? pe() : H = !1;
        }
      }
    }
    var pe;
    if (typeof F == "function")
      pe = function() {
        F(Xe);
      };
    else if (typeof MessageChannel < "u") {
      var $e = new MessageChannel(), X = $e.port2;
      $e.port1.onmessage = Xe, pe = function() {
        X.postMessage(null);
      };
    } else
      pe = function() {
        Ce(Xe, 0);
      };
    function fe(y, Q) {
      ve = Ce(function() {
        y(u.unstable_now());
      }, Q);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(y) {
      y.callback = null;
    }, u.unstable_forceFrameRate = function(y) {
      0 > y || 125 < y ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ae = 0 < y ? Math.floor(1e3 / y) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return k;
    }, u.unstable_next = function(y) {
      switch (k) {
        case 1:
        case 2:
        case 3:
          var Q = 3;
          break;
        default:
          Q = k;
      }
      var le = k;
      k = Q;
      try {
        return y();
      } finally {
        k = le;
      }
    }, u.unstable_requestPaint = function() {
      _e = !0;
    }, u.unstable_runWithPriority = function(y, Q) {
      switch (y) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          y = 3;
      }
      var le = k;
      k = y;
      try {
        return Q();
      } finally {
        k = le;
      }
    }, u.unstable_scheduleCallback = function(y, Q, le) {
      var we = u.unstable_now();
      switch (typeof le == "object" && le !== null ? (le = le.delay, le = typeof le == "number" && 0 < le ? we + le : we) : le = we, y) {
        case 1:
          var m = -1;
          break;
        case 2:
          m = 250;
          break;
        case 5:
          m = 1073741823;
          break;
        case 4:
          m = 1e4;
          break;
        default:
          m = 5e3;
      }
      return m = le + m, y = {
        id: D++,
        callback: Q,
        priorityLevel: y,
        startTime: le,
        expirationTime: m,
        sortIndex: -1
      }, le > we ? (y.sortIndex = le, h(v, y), N(Y) === null && y === N(v) && (ye ? (xe(ve), ve = -1) : ye = !0, fe(ae, le - we))) : (y.sortIndex = m, h(Y, y), je || se || (je = !0, H || (H = !0, pe()))), y;
    }, u.unstable_shouldYield = Ze, u.unstable_wrapCallback = function(y) {
      var Q = k;
      return function() {
        var le = k;
        k = Q;
        try {
          return y.apply(this, arguments);
        } finally {
          k = le;
        }
      };
    };
  })(ou)), ou;
}
var jf;
function jj() {
  return jf || (jf = 1, uu.exports = xj()), uu.exports;
}
var du = { exports: {} }, ut = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vf;
function vj() {
  if (vf) return ut;
  vf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), N = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), V = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), K = Symbol.iterator;
  function k(m) {
    return m === null || typeof m != "object" ? null : (m = K && m[K] || m["@@iterator"], typeof m == "function" ? m : null);
  }
  var se = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, je = Object.assign, ye = {};
  function _e(m, L, P) {
    this.props = m, this.context = L, this.refs = ye, this.updater = P || se;
  }
  _e.prototype.isReactComponent = {}, _e.prototype.setState = function(m, L) {
    if (typeof m != "object" && typeof m != "function" && m != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, m, L, "setState");
  }, _e.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Ce() {
  }
  Ce.prototype = _e.prototype;
  function xe(m, L, P) {
    this.props = m, this.context = L, this.refs = ye, this.updater = P || se;
  }
  var F = xe.prototype = new Ce();
  F.constructor = xe, je(F, _e.prototype), F.isPureReactComponent = !0;
  var he = Array.isArray, ae = { H: null, A: null, T: null, S: null, V: null }, H = Object.prototype.hasOwnProperty;
  function ve(m, L, P, te, re, Z) {
    return P = Z.ref, {
      $$typeof: u,
      type: m,
      key: L,
      ref: P !== void 0 ? P : null,
      props: Z
    };
  }
  function Ae(m, L) {
    return ve(
      m.type,
      L,
      void 0,
      void 0,
      void 0,
      m.props
    );
  }
  function Ge(m) {
    return typeof m == "object" && m !== null && m.$$typeof === u;
  }
  function Ze(m) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(P) {
      return L[P];
    });
  }
  var Xe = /\/+/g;
  function pe(m, L) {
    return typeof m == "object" && m !== null && m.key != null ? Ze("" + m.key) : L.toString(36);
  }
  function $e() {
  }
  function X(m) {
    switch (m.status) {
      case "fulfilled":
        return m.value;
      case "rejected":
        throw m.reason;
      default:
        switch (typeof m.status == "string" ? m.then($e, $e) : (m.status = "pending", m.then(
          function(L) {
            m.status === "pending" && (m.status = "fulfilled", m.value = L);
          },
          function(L) {
            m.status === "pending" && (m.status = "rejected", m.reason = L);
          }
        )), m.status) {
          case "fulfilled":
            return m.value;
          case "rejected":
            throw m.reason;
        }
    }
    throw m;
  }
  function fe(m, L, P, te, re) {
    var Z = typeof m;
    (Z === "undefined" || Z === "boolean") && (m = null);
    var $ = !1;
    if (m === null) $ = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          $ = !0;
          break;
        case "object":
          switch (m.$$typeof) {
            case u:
            case h:
              $ = !0;
              break;
            case D:
              return $ = m._init, fe(
                $(m._payload),
                L,
                P,
                te,
                re
              );
          }
      }
    if ($)
      return re = re(m), $ = te === "" ? "." + pe(m, 0) : te, he(re) ? (P = "", $ != null && (P = $.replace(Xe, "$&/") + "/"), fe(re, L, P, "", function(Ee) {
        return Ee;
      })) : re != null && (Ge(re) && (re = Ae(
        re,
        P + (re.key == null || m && m.key === re.key ? "" : ("" + re.key).replace(
          Xe,
          "$&/"
        ) + "/") + $
      )), L.push(re)), 1;
    $ = 0;
    var ze = te === "" ? "." : te + ":";
    if (he(m))
      for (var ne = 0; ne < m.length; ne++)
        te = m[ne], Z = ze + pe(te, ne), $ += fe(
          te,
          L,
          P,
          Z,
          re
        );
    else if (ne = k(m), typeof ne == "function")
      for (m = ne.call(m), ne = 0; !(te = m.next()).done; )
        te = te.value, Z = ze + pe(te, ne++), $ += fe(
          te,
          L,
          P,
          Z,
          re
        );
    else if (Z === "object") {
      if (typeof m.then == "function")
        return fe(
          X(m),
          L,
          P,
          te,
          re
        );
      throw L = String(m), Error(
        "Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return $;
  }
  function y(m, L, P) {
    if (m == null) return m;
    var te = [], re = 0;
    return fe(m, te, "", "", function(Z) {
      return L.call(P, Z, re++);
    }), te;
  }
  function Q(m) {
    if (m._status === -1) {
      var L = m._result;
      L = L(), L.then(
        function(P) {
          (m._status === 0 || m._status === -1) && (m._status = 1, m._result = P);
        },
        function(P) {
          (m._status === 0 || m._status === -1) && (m._status = 2, m._result = P);
        }
      ), m._status === -1 && (m._status = 0, m._result = L);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var le = typeof reportError == "function" ? reportError : function(m) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var L = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof m == "object" && m !== null && typeof m.message == "string" ? String(m.message) : String(m),
        error: m
      });
      if (!window.dispatchEvent(L)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", m);
      return;
    }
    console.error(m);
  };
  function we() {
  }
  return ut.Children = {
    map: y,
    forEach: function(m, L, P) {
      y(
        m,
        function() {
          L.apply(this, arguments);
        },
        P
      );
    },
    count: function(m) {
      var L = 0;
      return y(m, function() {
        L++;
      }), L;
    },
    toArray: function(m) {
      return y(m, function(L) {
        return L;
      }) || [];
    },
    only: function(m) {
      if (!Ge(m))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return m;
    }
  }, ut.Component = _e, ut.Fragment = N, ut.Profiler = T, ut.PureComponent = xe, ut.StrictMode = o, ut.Suspense = Y, ut.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ae, ut.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(m) {
      return ae.H.useMemoCache(m);
    }
  }, ut.cache = function(m) {
    return function() {
      return m.apply(null, arguments);
    };
  }, ut.cloneElement = function(m, L, P) {
    if (m == null)
      throw Error(
        "The argument must be a React element, but you passed " + m + "."
      );
    var te = je({}, m.props), re = m.key, Z = void 0;
    if (L != null)
      for ($ in L.ref !== void 0 && (Z = void 0), L.key !== void 0 && (re = "" + L.key), L)
        !H.call(L, $) || $ === "key" || $ === "__self" || $ === "__source" || $ === "ref" && L.ref === void 0 || (te[$] = L[$]);
    var $ = arguments.length - 2;
    if ($ === 1) te.children = P;
    else if (1 < $) {
      for (var ze = Array($), ne = 0; ne < $; ne++)
        ze[ne] = arguments[ne + 2];
      te.children = ze;
    }
    return ve(m.type, re, void 0, void 0, Z, te);
  }, ut.createContext = function(m) {
    return m = {
      $$typeof: V,
      _currentValue: m,
      _currentValue2: m,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, m.Provider = m, m.Consumer = {
      $$typeof: U,
      _context: m
    }, m;
  }, ut.createElement = function(m, L, P) {
    var te, re = {}, Z = null;
    if (L != null)
      for (te in L.key !== void 0 && (Z = "" + L.key), L)
        H.call(L, te) && te !== "key" && te !== "__self" && te !== "__source" && (re[te] = L[te]);
    var $ = arguments.length - 2;
    if ($ === 1) re.children = P;
    else if (1 < $) {
      for (var ze = Array($), ne = 0; ne < $; ne++)
        ze[ne] = arguments[ne + 2];
      re.children = ze;
    }
    if (m && m.defaultProps)
      for (te in $ = m.defaultProps, $)
        re[te] === void 0 && (re[te] = $[te]);
    return ve(m, Z, void 0, void 0, null, re);
  }, ut.createRef = function() {
    return { current: null };
  }, ut.forwardRef = function(m) {
    return { $$typeof: A, render: m };
  }, ut.isValidElement = Ge, ut.lazy = function(m) {
    return {
      $$typeof: D,
      _payload: { _status: -1, _result: m },
      _init: Q
    };
  }, ut.memo = function(m, L) {
    return {
      $$typeof: v,
      type: m,
      compare: L === void 0 ? null : L
    };
  }, ut.startTransition = function(m) {
    var L = ae.T, P = {};
    ae.T = P;
    try {
      var te = m(), re = ae.S;
      re !== null && re(P, te), typeof te == "object" && te !== null && typeof te.then == "function" && te.then(we, le);
    } catch (Z) {
      le(Z);
    } finally {
      ae.T = L;
    }
  }, ut.unstable_useCacheRefresh = function() {
    return ae.H.useCacheRefresh();
  }, ut.use = function(m) {
    return ae.H.use(m);
  }, ut.useActionState = function(m, L, P) {
    return ae.H.useActionState(m, L, P);
  }, ut.useCallback = function(m, L) {
    return ae.H.useCallback(m, L);
  }, ut.useContext = function(m) {
    return ae.H.useContext(m);
  }, ut.useDebugValue = function() {
  }, ut.useDeferredValue = function(m, L) {
    return ae.H.useDeferredValue(m, L);
  }, ut.useEffect = function(m, L, P) {
    var te = ae.H;
    if (typeof P == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return te.useEffect(m, L);
  }, ut.useId = function() {
    return ae.H.useId();
  }, ut.useImperativeHandle = function(m, L, P) {
    return ae.H.useImperativeHandle(m, L, P);
  }, ut.useInsertionEffect = function(m, L) {
    return ae.H.useInsertionEffect(m, L);
  }, ut.useLayoutEffect = function(m, L) {
    return ae.H.useLayoutEffect(m, L);
  }, ut.useMemo = function(m, L) {
    return ae.H.useMemo(m, L);
  }, ut.useOptimistic = function(m, L) {
    return ae.H.useOptimistic(m, L);
  }, ut.useReducer = function(m, L, P) {
    return ae.H.useReducer(m, L, P);
  }, ut.useRef = function(m) {
    return ae.H.useRef(m);
  }, ut.useState = function(m) {
    return ae.H.useState(m);
  }, ut.useSyncExternalStore = function(m, L, P) {
    return ae.H.useSyncExternalStore(
      m,
      L,
      P
    );
  }, ut.useTransition = function() {
    return ae.H.useTransition();
  }, ut.version = "19.1.0", ut;
}
var pf;
function Ou() {
  return pf || (pf = 1, du.exports = vj()), du.exports;
}
var hu = { exports: {} }, ls = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gf;
function pj() {
  if (gf) return ls;
  gf = 1;
  var u = Ou();
  function h(Y) {
    var v = "https://react.dev/errors/" + Y;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var D = 2; D < arguments.length; D++)
        v += "&args[]=" + encodeURIComponent(arguments[D]);
    }
    return "Minified React error #" + Y + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function N() {
  }
  var o = {
    d: {
      f: N,
      r: function() {
        throw Error(h(522));
      },
      D: N,
      C: N,
      L: N,
      m: N,
      X: N,
      S: N,
      M: N
    },
    p: 0,
    findDOMNode: null
  }, T = Symbol.for("react.portal");
  function U(Y, v, D) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: T,
      key: K == null ? null : "" + K,
      children: Y,
      containerInfo: v,
      implementation: D
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function A(Y, v) {
    if (Y === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return ls.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ls.createPortal = function(Y, v) {
    var D = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(h(299));
    return U(Y, v, null, D);
  }, ls.flushSync = function(Y) {
    var v = V.T, D = o.p;
    try {
      if (V.T = null, o.p = 2, Y) return Y();
    } finally {
      V.T = v, o.p = D, o.d.f();
    }
  }, ls.preconnect = function(Y, v) {
    typeof Y == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, o.d.C(Y, v));
  }, ls.prefetchDNS = function(Y) {
    typeof Y == "string" && o.d.D(Y);
  }, ls.preinit = function(Y, v) {
    if (typeof Y == "string" && v && typeof v.as == "string") {
      var D = v.as, K = A(D, v.crossOrigin), k = typeof v.integrity == "string" ? v.integrity : void 0, se = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      D === "style" ? o.d.S(
        Y,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: se
        }
      ) : D === "script" && o.d.X(Y, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: se,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, ls.preinitModule = function(Y, v) {
    if (typeof Y == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var D = A(
            v.as,
            v.crossOrigin
          );
          o.d.M(Y, {
            crossOrigin: D,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && o.d.M(Y);
  }, ls.preload = function(Y, v) {
    if (typeof Y == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var D = v.as, K = A(D, v.crossOrigin);
      o.d.L(Y, D, {
        crossOrigin: K,
        integrity: typeof v.integrity == "string" ? v.integrity : void 0,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0,
        type: typeof v.type == "string" ? v.type : void 0,
        fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
        referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
        imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
        imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
        media: typeof v.media == "string" ? v.media : void 0
      });
    }
  }, ls.preloadModule = function(Y, v) {
    if (typeof Y == "string")
      if (v) {
        var D = A(v.as, v.crossOrigin);
        o.d.m(Y, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: D,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else o.d.m(Y);
  }, ls.requestFormReset = function(Y) {
    o.d.r(Y);
  }, ls.unstable_batchedUpdates = function(Y, v) {
    return Y(v);
  }, ls.useFormState = function(Y, v, D) {
    return V.H.useFormState(Y, v, D);
  }, ls.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, ls.version = "19.1.0", ls;
}
var bf;
function gj() {
  if (bf) return hu.exports;
  bf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), hu.exports = pj(), hu.exports;
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
var yf;
function bj() {
  if (yf) return On;
  yf = 1;
  var u = jj(), h = Ou(), N = gj();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function T(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function U(e) {
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
  function V(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function A(e) {
    if (U(e) !== e)
      throw Error(o(188));
  }
  function Y(e) {
    var t = e.alternate;
    if (!t) {
      if (t = U(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === l) return A(n), e;
          if (i === a) return A(n), t;
          i = i.sibling;
        }
        throw Error(o(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var c = !1, d = n.child; d; ) {
          if (d === l) {
            c = !0, l = n, a = i;
            break;
          }
          if (d === a) {
            c = !0, a = n, l = i;
            break;
          }
          d = d.sibling;
        }
        if (!c) {
          for (d = i.child; d; ) {
            if (d === l) {
              c = !0, l = i, a = n;
              break;
            }
            if (d === a) {
              c = !0, a = i, l = n;
              break;
            }
            d = d.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (l.alternate !== a) throw Error(o(190));
    }
    if (l.tag !== 3) throw Error(o(188));
    return l.stateNode.current === l ? e : t;
  }
  function v(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = v(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var D = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), se = Symbol.for("react.portal"), je = Symbol.for("react.fragment"), ye = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Ce = Symbol.for("react.provider"), xe = Symbol.for("react.consumer"), F = Symbol.for("react.context"), he = Symbol.for("react.forward_ref"), ae = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), ve = Symbol.for("react.memo"), Ae = Symbol.for("react.lazy"), Ge = Symbol.for("react.activity"), Ze = Symbol.for("react.memo_cache_sentinel"), Xe = Symbol.iterator;
  function pe(e) {
    return e === null || typeof e != "object" ? null : (e = Xe && e[Xe] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var $e = Symbol.for("react.client.reference");
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === $e ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case je:
        return "Fragment";
      case _e:
        return "Profiler";
      case ye:
        return "StrictMode";
      case ae:
        return "Suspense";
      case H:
        return "SuspenseList";
      case Ge:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case se:
          return "Portal";
        case F:
          return (e.displayName || "Context") + ".Provider";
        case xe:
          return (e._context.displayName || "Context") + ".Consumer";
        case he:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case ve:
          return t = e.displayName || null, t !== null ? t : X(e.type) || "Memo";
        case Ae:
          t = e._payload, e = e._init;
          try {
            return X(e(t));
          } catch {
          }
      }
    return null;
  }
  var fe = Array.isArray, y = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = N.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, we = [], m = -1;
  function L(e) {
    return { current: e };
  }
  function P(e) {
    0 > m || (e.current = we[m], we[m] = null, m--);
  }
  function te(e, t) {
    m++, we[m] = e.current, e.current = t;
  }
  var re = L(null), Z = L(null), $ = L(null), ze = L(null);
  function ne(e, t) {
    switch (te($, t), te(Z, e), te(re, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Lh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Lh(t), e = Yh(t, e);
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
    P(re), te(re, e);
  }
  function Ee() {
    P(re), P(Z), P($);
  }
  function ct(e) {
    e.memoizedState !== null && te(ze, e);
    var t = re.current, l = Yh(t, e.type);
    t !== l && (te(Z, e), te(re, l));
  }
  function Je(e) {
    Z.current === e && (P(re), P(Z)), ze.current === e && (P(ze), Nn._currentValue = le);
  }
  var Pe = Object.prototype.hasOwnProperty, We = u.unstable_scheduleCallback, Ue = u.unstable_cancelCallback, Re = u.unstable_shouldYield, ke = u.unstable_requestPaint, De = u.unstable_now, st = u.unstable_getCurrentPriorityLevel, et = u.unstable_ImmediatePriority, ht = u.unstable_UserBlockingPriority, ie = u.unstable_NormalPriority, nt = u.unstable_LowPriority, He = u.unstable_IdlePriority, O = u.log, w = u.unstable_setDisableYieldValue, I = null, Se = null;
  function Me(e) {
    if (typeof O == "function" && w(e), Se && typeof Se.setStrictMode == "function")
      try {
        Se.setStrictMode(I, e);
      } catch {
      }
  }
  var lt = Math.clz32 ? Math.clz32 : oe, Fe = Math.log, B = Math.LN2;
  function oe(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Fe(e) / B | 0) | 0;
  }
  var ce = 256, Ye = 4194304;
  function b(e) {
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
  function ge(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var d = a & 134217727;
    return d !== 0 ? (a = d & ~i, a !== 0 ? n = b(a) : (c &= d, c !== 0 ? n = b(c) : l || (l = d & ~e, l !== 0 && (n = b(l))))) : (d = a & ~i, d !== 0 ? n = b(d) : c !== 0 ? n = b(c) : l || (l = a & ~e, l !== 0 && (n = b(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function de(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Qe(e, t) {
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
  function vt() {
    var e = ce;
    return ce <<= 1, (ce & 4194048) === 0 && (ce = 256), e;
  }
  function M() {
    var e = Ye;
    return Ye <<= 1, (Ye & 62914560) === 0 && (Ye = 4194304), e;
  }
  function j(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ue(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function be(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var d = e.entanglements, p = e.expirationTimes, z = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var J = 31 - lt(l), ee = 1 << J;
      d[J] = 0, p[J] = -1;
      var R = z[J];
      if (R !== null)
        for (z[J] = null, J = 0; J < R.length; J++) {
          var q = R[J];
          q !== null && (q.lane &= -536870913);
        }
      l &= ~ee;
    }
    a !== 0 && rt(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function rt(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - lt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function _(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - lt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function me(e) {
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
  function Ve(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ot() {
    var e = Q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : cf(e.type));
  }
  function qt(e, t) {
    var l = Q.p;
    try {
      return Q.p = e, t();
    } finally {
      Q.p = l;
    }
  }
  var Gt = Math.random().toString(36).slice(2), ot = "__reactFiber$" + Gt, Nt = "__reactProps$" + Gt, g = "__reactContainer$" + Gt, Ne = "__reactEvents$" + Gt, it = "__reactListeners$" + Gt, bt = "__reactHandles$" + Gt, x = "__reactResources$" + Gt, Oe = "__reactMarker$" + Gt;
  function Te(e) {
    delete e[ot], delete e[Nt], delete e[Ne], delete e[it], delete e[bt];
  }
  function at(e) {
    var t = e[ot];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[g] || l[ot]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Zh(e); e !== null; ) {
            if (l = e[ot]) return l;
            e = Zh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Ht(e) {
    if (e = e[ot] || e[g]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function us(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function os(e) {
    var t = e[x];
    return t || (t = e[x] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function f(e) {
    e[Oe] = !0;
  }
  var G = /* @__PURE__ */ new Set(), Be = {};
  function mt(e, t) {
    zt(e, t), zt(e + "Capture", t);
  }
  function zt(e, t) {
    for (Be[e] = t, e = 0; e < t.length; e++)
      G.add(t[e]);
  }
  var Rs = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), il = {}, ds = {};
  function Ls(e) {
    return Pe.call(ds, e) ? !0 : Pe.call(il, e) ? !1 : Rs.test(e) ? ds[e] = !0 : (il[e] = !0, !1);
  }
  function Ys(e, t, l) {
    if (Ls(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + l);
      }
  }
  function qn(e, t, l) {
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
  function Gs(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, "" + a);
    }
  }
  var tc, Au;
  function $l(e) {
    if (tc === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        tc = t && t[1] || "", Au = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + tc + e + Au;
  }
  var sc = !1;
  function lc(e, t) {
    if (!e || sc) return "";
    sc = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var ee = function() {
                throw Error();
              };
              if (Object.defineProperty(ee.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(ee, []);
                } catch (q) {
                  var R = q;
                }
                Reflect.construct(e, [], ee);
              } else {
                try {
                  ee.call();
                } catch (q) {
                  R = q;
                }
                e.call(ee.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (q) {
                R = q;
              }
              (ee = e()) && typeof ee.catch == "function" && ee.catch(function() {
              });
            }
          } catch (q) {
            if (q && R && typeof q.stack == "string")
              return [q.stack, R.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = a.DetermineComponentFrameRoot(), c = i[0], d = i[1];
      if (c && d) {
        var p = c.split(`
`), z = d.split(`
`);
        for (n = a = 0; a < p.length && !p[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < z.length && !z[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === p.length || n === z.length)
          for (a = p.length - 1, n = z.length - 1; 1 <= a && 0 <= n && p[a] !== z[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (p[a] !== z[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || p[a] !== z[n]) {
                  var J = `
` + p[a].replace(" at new ", " at ");
                  return e.displayName && J.includes("<anonymous>") && (J = J.replace("<anonymous>", e.displayName)), J;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      sc = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? $l(l) : "";
  }
  function cm(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return $l(e.type);
      case 16:
        return $l("Lazy");
      case 13:
        return $l("Suspense");
      case 19:
        return $l("SuspenseList");
      case 0:
      case 15:
        return lc(e.type, !1);
      case 11:
        return lc(e.type.render, !1);
      case 1:
        return lc(e.type, !0);
      case 31:
        return $l("Activity");
      default:
        return "";
    }
  }
  function Ru(e) {
    try {
      var t = "";
      do
        t += cm(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function gs(e) {
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
  function Uu(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function rm(e) {
    var t = Uu(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    ), a = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var n = l.get, i = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(c) {
          a = "" + c, i.call(this, c);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(c) {
          a = "" + c;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Hn(e) {
    e._valueTracker || (e._valueTracker = rm(e));
  }
  function Du(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Uu(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Bn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var um = /[\n"\\]/g;
  function bs(e) {
    return e.replace(
      um,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ac(e, t, l, a, n, i, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + gs(t)) : e.value !== "" + gs(t) && (e.value = "" + gs(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? nc(e, c, gs(t)) : l != null ? nc(e, c, gs(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + gs(d) : e.removeAttribute("name");
  }
  function Mu(e, t, l, a, n, i, c, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + gs(l) : "", t = t != null ? "" + gs(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function nc(e, t, l) {
    t === "number" && Bn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Wl(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + gs(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function qu(e, t, l) {
    if (t != null && (t = "" + gs(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + gs(l) : "";
  }
  function Hu(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (fe(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = gs(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
  }
  function Fl(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var om = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Bu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || om.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Lu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Bu(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Bu(e, i, t[i]);
  }
  function ic(e) {
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
  var dm = /* @__PURE__ */ new Map([
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
  ]), hm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ln(e) {
    return hm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var cc = null;
  function rc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Il = null, Pl = null;
  function Yu(e) {
    var t = Ht(e);
    if (t && (e = t.stateNode)) {
      var l = e[Nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (ac(
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
              'input[name="' + bs(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[Nt] || null;
                if (!n) throw Error(o(90));
                ac(
                  a,
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
              a = l[t], a.form === e.form && Du(a);
          }
          break e;
        case "textarea":
          qu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Wl(e, !!l.multiple, t, !1);
      }
    }
  }
  var uc = !1;
  function Gu(e, t, l) {
    if (uc) return e(t, l);
    uc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (uc = !1, (Il !== null || Pl !== null) && (wi(), Il && (t = Il, e = Pl, Pl = Il = null, Yu(t), e)))
        for (t = 0; t < e.length; t++) Yu(e[t]);
    }
  }
  function Da(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[Nt] || null;
    if (a === null) return null;
    l = a[t];
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
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        o(231, t, typeof l)
      );
    return l;
  }
  var Xs = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), oc = !1;
  if (Xs)
    try {
      var Ma = {};
      Object.defineProperty(Ma, "passive", {
        get: function() {
          oc = !0;
        }
      }), window.addEventListener("test", Ma, Ma), window.removeEventListener("test", Ma, Ma);
    } catch {
      oc = !1;
    }
  var cl = null, dc = null, Yn = null;
  function Xu() {
    if (Yn) return Yn;
    var e, t = dc, l = t.length, a, n = "value" in cl ? cl.value : cl.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Yn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Gn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Xn() {
    return !0;
  }
  function Qu() {
    return !1;
  }
  function ns(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Xn : Qu, this.isPropagationStopped = Qu, this;
    }
    return D(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Xn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Xn);
      },
      persist: function() {
      },
      isPersistent: Xn
    }), t;
  }
  var Al = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Qn = ns(Al), qa = D({}, Al, { view: 0, detail: 0 }), fm = ns(qa), hc, fc, Ha, Zn = D({}, qa, {
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
    getModifierState: xc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ha && (Ha && e.type === "mousemove" ? (hc = e.screenX - Ha.screenX, fc = e.screenY - Ha.screenY) : fc = hc = 0, Ha = e), hc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : fc;
    }
  }), Zu = ns(Zn), mm = D({}, Zn, { dataTransfer: 0 }), xm = ns(mm), jm = D({}, qa, { relatedTarget: 0 }), mc = ns(jm), vm = D({}, Al, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), pm = ns(vm), gm = D({}, Al, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), bm = ns(gm), ym = D({}, Al, { data: 0 }), Vu = ns(ym), _m = {
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
  }, Nm = {
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
  }, Sm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function wm(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Sm[e]) ? !!t[e] : !1;
  }
  function xc() {
    return wm;
  }
  var km = D({}, qa, {
    key: function(e) {
      if (e.key) {
        var t = _m[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Gn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Nm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: xc,
    charCode: function(e) {
      return e.type === "keypress" ? Gn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Gn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Cm = ns(km), Em = D({}, Zn, {
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
  }), Ju = ns(Em), Om = D({}, qa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: xc
  }), Tm = ns(Om), zm = D({}, Al, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Am = ns(zm), Rm = D({}, Zn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Um = ns(Rm), Dm = D({}, Al, {
    newState: 0,
    oldState: 0
  }), Mm = ns(Dm), qm = [9, 13, 27, 32], jc = Xs && "CompositionEvent" in window, Ba = null;
  Xs && "documentMode" in document && (Ba = document.documentMode);
  var Hm = Xs && "TextEvent" in window && !Ba, Ku = Xs && (!jc || Ba && 8 < Ba && 11 >= Ba), $u = " ", Wu = !1;
  function Fu(e, t) {
    switch (e) {
      case "keyup":
        return qm.indexOf(t.keyCode) !== -1;
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
  function Iu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ea = !1;
  function Bm(e, t) {
    switch (e) {
      case "compositionend":
        return Iu(t);
      case "keypress":
        return t.which !== 32 ? null : (Wu = !0, $u);
      case "textInput":
        return e = t.data, e === $u && Wu ? null : e;
      default:
        return null;
    }
  }
  function Lm(e, t) {
    if (ea)
      return e === "compositionend" || !jc && Fu(e, t) ? (e = Xu(), Yn = dc = cl = null, ea = !1, e) : null;
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
        return Ku && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Ym = {
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
  function Pu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Ym[e.type] : t === "textarea";
  }
  function eo(e, t, l, a) {
    Il ? Pl ? Pl.push(a) : Pl = [a] : Il = a, t = zi(t, "onChange"), 0 < t.length && (l = new Qn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var La = null, Ya = null;
  function Gm(e) {
    Dh(e, 0);
  }
  function Vn(e) {
    var t = us(e);
    if (Du(t)) return e;
  }
  function to(e, t) {
    if (e === "change") return t;
  }
  var so = !1;
  if (Xs) {
    var vc;
    if (Xs) {
      var pc = "oninput" in document;
      if (!pc) {
        var lo = document.createElement("div");
        lo.setAttribute("oninput", "return;"), pc = typeof lo.oninput == "function";
      }
      vc = pc;
    } else vc = !1;
    so = vc && (!document.documentMode || 9 < document.documentMode);
  }
  function ao() {
    La && (La.detachEvent("onpropertychange", no), Ya = La = null);
  }
  function no(e) {
    if (e.propertyName === "value" && Vn(Ya)) {
      var t = [];
      eo(
        t,
        Ya,
        e,
        rc(e)
      ), Gu(Gm, t);
    }
  }
  function Xm(e, t, l) {
    e === "focusin" ? (ao(), La = t, Ya = l, La.attachEvent("onpropertychange", no)) : e === "focusout" && ao();
  }
  function Qm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Vn(Ya);
  }
  function Zm(e, t) {
    if (e === "click") return Vn(t);
  }
  function Vm(e, t) {
    if (e === "input" || e === "change")
      return Vn(t);
  }
  function Jm(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var hs = typeof Object.is == "function" ? Object.is : Jm;
  function Ga(e, t) {
    if (hs(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Pe.call(t, n) || !hs(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function io(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function co(e, t) {
    var l = io(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
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
      l = io(l);
    }
  }
  function ro(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ro(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function uo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Bn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Bn(e.document);
    }
    return t;
  }
  function gc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Km = Xs && "documentMode" in document && 11 >= document.documentMode, ta = null, bc = null, Xa = null, yc = !1;
  function oo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    yc || ta == null || ta !== Bn(a) || (a = ta, "selectionStart" in a && gc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Xa && Ga(Xa, a) || (Xa = a, a = zi(bc, "onSelect"), 0 < a.length && (t = new Qn(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ta)));
  }
  function Rl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var sa = {
    animationend: Rl("Animation", "AnimationEnd"),
    animationiteration: Rl("Animation", "AnimationIteration"),
    animationstart: Rl("Animation", "AnimationStart"),
    transitionrun: Rl("Transition", "TransitionRun"),
    transitionstart: Rl("Transition", "TransitionStart"),
    transitioncancel: Rl("Transition", "TransitionCancel"),
    transitionend: Rl("Transition", "TransitionEnd")
  }, _c = {}, ho = {};
  Xs && (ho = document.createElement("div").style, "AnimationEvent" in window || (delete sa.animationend.animation, delete sa.animationiteration.animation, delete sa.animationstart.animation), "TransitionEvent" in window || delete sa.transitionend.transition);
  function Ul(e) {
    if (_c[e]) return _c[e];
    if (!sa[e]) return e;
    var t = sa[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in ho)
        return _c[e] = t[l];
    return e;
  }
  var fo = Ul("animationend"), mo = Ul("animationiteration"), xo = Ul("animationstart"), $m = Ul("transitionrun"), Wm = Ul("transitionstart"), Fm = Ul("transitioncancel"), jo = Ul("transitionend"), vo = /* @__PURE__ */ new Map(), Nc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Nc.push("scrollEnd");
  function Es(e, t) {
    vo.set(e, t), mt(t, [e]);
  }
  var po = /* @__PURE__ */ new WeakMap();
  function ys(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = po.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Ru(t)
      }, po.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Ru(t)
    };
  }
  var _s = [], la = 0, Sc = 0;
  function Jn() {
    for (var e = la, t = Sc = la = 0; t < e; ) {
      var l = _s[t];
      _s[t++] = null;
      var a = _s[t];
      _s[t++] = null;
      var n = _s[t];
      _s[t++] = null;
      var i = _s[t];
      if (_s[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && go(l, n, i);
    }
  }
  function Kn(e, t, l, a) {
    _s[la++] = e, _s[la++] = t, _s[la++] = l, _s[la++] = a, Sc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function wc(e, t, l, a) {
    return Kn(e, t, l, a), $n(e);
  }
  function aa(e, t) {
    return Kn(e, null, null, t), $n(e);
  }
  function go(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - lt(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function $n(e) {
    if (50 < xn)
      throw xn = 0, zr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var na = {};
  function Im(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function fs(e, t, l, a) {
    return new Im(e, t, l, a);
  }
  function kc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Qs(e, t) {
    var l = e.alternate;
    return l === null ? (l = fs(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function bo(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Wn(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") kc(e) && (c = 1);
    else if (typeof e == "string")
      c = ej(
        e,
        l,
        re.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Ge:
          return e = fs(31, l, t, n), e.elementType = Ge, e.lanes = i, e;
        case je:
          return Dl(l.children, n, i, t);
        case ye:
          c = 8, n |= 24;
          break;
        case _e:
          return e = fs(12, l, t, n | 2), e.elementType = _e, e.lanes = i, e;
        case ae:
          return e = fs(13, l, t, n), e.elementType = ae, e.lanes = i, e;
        case H:
          return e = fs(19, l, t, n), e.elementType = H, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ce:
              case F:
                c = 10;
                break e;
              case xe:
                c = 9;
                break e;
              case he:
                c = 11;
                break e;
              case ve:
                c = 14;
                break e;
              case Ae:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = fs(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Dl(e, t, l, a) {
    return e = fs(7, e, a, t), e.lanes = l, e;
  }
  function Cc(e, t, l) {
    return e = fs(6, e, null, t), e.lanes = l, e;
  }
  function Ec(e, t, l) {
    return t = fs(
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
  var ia = [], ca = 0, Fn = null, In = 0, Ns = [], Ss = 0, Ml = null, Zs = 1, Vs = "";
  function ql(e, t) {
    ia[ca++] = In, ia[ca++] = Fn, Fn = e, In = t;
  }
  function yo(e, t, l) {
    Ns[Ss++] = Zs, Ns[Ss++] = Vs, Ns[Ss++] = Ml, Ml = e;
    var a = Zs;
    e = Vs;
    var n = 32 - lt(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - lt(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Zs = 1 << 32 - lt(t) + n | l << n | a, Vs = i + e;
    } else
      Zs = 1 << i | l << n | a, Vs = e;
  }
  function Oc(e) {
    e.return !== null && (ql(e, 1), yo(e, 1, 0));
  }
  function Tc(e) {
    for (; e === Fn; )
      Fn = ia[--ca], ia[ca] = null, In = ia[--ca], ia[ca] = null;
    for (; e === Ml; )
      Ml = Ns[--Ss], Ns[Ss] = null, Vs = Ns[--Ss], Ns[Ss] = null, Zs = Ns[--Ss], Ns[Ss] = null;
  }
  var as = null, Bt = null, yt = !1, Hl = null, Us = !1, zc = Error(o(519));
  function Bl(e) {
    var t = Error(o(418, ""));
    throw Va(ys(t, e)), zc;
  }
  function _o(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[ot] = e, t[Nt] = a, l) {
      case "dialog":
        jt("cancel", t), jt("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        jt("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < vn.length; l++)
          jt(vn[l], t);
        break;
      case "source":
        jt("error", t);
        break;
      case "img":
      case "image":
      case "link":
        jt("error", t), jt("load", t);
        break;
      case "details":
        jt("toggle", t);
        break;
      case "input":
        jt("invalid", t), Mu(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Hn(t);
        break;
      case "select":
        jt("invalid", t);
        break;
      case "textarea":
        jt("invalid", t), Hu(t, a.value, a.defaultValue, a.children), Hn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Bh(t.textContent, l) ? (a.popover != null && (jt("beforetoggle", t), jt("toggle", t)), a.onScroll != null && jt("scroll", t), a.onScrollEnd != null && jt("scrollend", t), a.onClick != null && (t.onclick = Ai), t = !0) : t = !1, t || Bl(e);
  }
  function No(e) {
    for (as = e.return; as; )
      switch (as.tag) {
        case 5:
        case 13:
          Us = !1;
          return;
        case 27:
        case 3:
          Us = !0;
          return;
        default:
          as = as.return;
      }
  }
  function Qa(e) {
    if (e !== as) return !1;
    if (!yt) return No(e), yt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Jr(e.type, e.memoizedProps)), l = !l), l && Bt && Bl(e), No(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Bt = Ts(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        Bt = null;
      }
    } else
      t === 27 ? (t = Bt, Nl(e.type) ? (e = Fr, Fr = null, Bt = e) : Bt = t) : Bt = as ? Ts(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Za() {
    Bt = as = null, yt = !1;
  }
  function So() {
    var e = Hl;
    return e !== null && (rs === null ? rs = e : rs.push.apply(
      rs,
      e
    ), Hl = null), e;
  }
  function Va(e) {
    Hl === null ? Hl = [e] : Hl.push(e);
  }
  var Ac = L(null), Ll = null, Js = null;
  function rl(e, t, l) {
    te(Ac, t._currentValue), t._currentValue = l;
  }
  function Ks(e) {
    e._currentValue = Ac.current, P(Ac);
  }
  function Rc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Uc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var d = i;
          i = n;
          for (var p = 0; p < t.length; p++)
            if (d.context === t[p]) {
              i.lanes |= l, d = i.alternate, d !== null && (d.lanes |= l), Rc(
                i.return,
                l,
                e
              ), a || (c = null);
              break e;
            }
          i = d.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(o(341));
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Rc(c, l, e), c = null;
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === e) {
            c = null;
            break;
          }
          if (n = c.sibling, n !== null) {
            n.return = c.return, c = n;
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function Ja(e, t, l, a) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(o(387));
        if (c = c.memoizedProps, c !== null) {
          var d = n.type;
          hs(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === ze.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Nn) : e = [Nn]);
      }
      n = n.return;
    }
    e !== null && Uc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Pn(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!hs(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Yl(e) {
    Ll = e, Js = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ss(e) {
    return wo(Ll, e);
  }
  function ei(e, t) {
    return Ll === null && Yl(e), wo(e, t);
  }
  function wo(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Js === null) {
      if (e === null) throw Error(o(308));
      Js = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Js = Js.next = t;
    return l;
  }
  var Pm = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, ex = u.unstable_scheduleCallback, tx = u.unstable_NormalPriority, Kt = {
    $$typeof: F,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Dc() {
    return {
      controller: new Pm(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ka(e) {
    e.refCount--, e.refCount === 0 && ex(tx, function() {
      e.controller.abort();
    });
  }
  var $a = null, Mc = 0, ra = 0, ua = null;
  function sx(e, t) {
    if ($a === null) {
      var l = $a = [];
      Mc = 0, ra = Hr(), ua = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Mc++, t.then(ko, ko), t;
  }
  function ko() {
    if (--Mc === 0 && $a !== null) {
      ua !== null && (ua.status = "fulfilled");
      var e = $a;
      $a = null, ra = 0, ua = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function lx(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var Co = y.S;
  y.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && sx(e, t), Co !== null && Co(e, t);
  };
  var Gl = L(null);
  function qc() {
    var e = Gl.current;
    return e !== null ? e : At.pooledCache;
  }
  function ti(e, t) {
    t === null ? te(Gl, Gl.current) : te(Gl, t.pool);
  }
  function Eo() {
    var e = qc();
    return e === null ? null : { parent: Kt._currentValue, pool: e };
  }
  var Wa = Error(o(460)), Oo = Error(o(474)), si = Error(o(542)), Hc = { then: function() {
  } };
  function To(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function li() {
  }
  function zo(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(li, li), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ro(e), e;
      default:
        if (typeof t.status == "string") t.then(li, li);
        else {
          if (e = At, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Ro(e), e;
        }
        throw Fa = t, Wa;
    }
  }
  var Fa = null;
  function Ao() {
    if (Fa === null) throw Error(o(459));
    var e = Fa;
    return Fa = null, e;
  }
  function Ro(e) {
    if (e === Wa || e === si)
      throw Error(o(483));
  }
  var ul = !1;
  function Bc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Lc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ol(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function dl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (St & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = $n(e), go(e, null, l), t;
    }
    return Kn(e, a, t, l), $n(e);
  }
  function Ia(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  function Yc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var c = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = c : i = i.next = c, l = l.next;
        } while (l !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Gc = !1;
  function Pa() {
    if (Gc) {
      var e = ua;
      if (e !== null) throw e;
    }
  }
  function en(e, t, l, a) {
    Gc = !1;
    var n = e.updateQueue;
    ul = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var p = d, z = p.next;
      p.next = null, c === null ? i = z : c.next = z, c = p;
      var J = e.alternate;
      J !== null && (J = J.updateQueue, d = J.lastBaseUpdate, d !== c && (d === null ? J.firstBaseUpdate = z : d.next = z, J.lastBaseUpdate = p));
    }
    if (i !== null) {
      var ee = n.baseState;
      c = 0, J = z = p = null, d = i;
      do {
        var R = d.lane & -536870913, q = R !== d.lane;
        if (q ? (pt & R) === R : (a & R) === R) {
          R !== 0 && R === ra && (Gc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var tt = e, Ke = d;
            R = t;
            var Et = l;
            switch (Ke.tag) {
              case 1:
                if (tt = Ke.payload, typeof tt == "function") {
                  ee = tt.call(Et, ee, R);
                  break e;
                }
                ee = tt;
                break e;
              case 3:
                tt.flags = tt.flags & -65537 | 128;
              case 0:
                if (tt = Ke.payload, R = typeof tt == "function" ? tt.call(Et, ee, R) : tt, R == null) break e;
                ee = D({}, ee, R);
                break e;
              case 2:
                ul = !0;
            }
          }
          R = d.callback, R !== null && (e.flags |= 64, q && (e.flags |= 8192), q = n.callbacks, q === null ? n.callbacks = [R] : q.push(R));
        } else
          q = {
            lane: R,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, J === null ? (z = J = q, p = ee) : J = J.next = q, c |= R;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          q = d, d = q.next, q.next = null, n.lastBaseUpdate = q, n.shared.pending = null;
        }
      } while (!0);
      J === null && (p = ee), n.baseState = p, n.firstBaseUpdate = z, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), gl |= c, e.lanes = c, e.memoizedState = ee;
    }
  }
  function Uo(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Do(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Uo(l[e], t);
  }
  var oa = L(null), ai = L(0);
  function Mo(e, t) {
    e = tl, te(ai, e), te(oa, t), tl = e | t.baseLanes;
  }
  function Xc() {
    te(ai, tl), te(oa, oa.current);
  }
  function Qc() {
    tl = ai.current, P(oa), P(ai);
  }
  var hl = 0, dt = null, kt = null, Zt = null, ni = !1, da = !1, Xl = !1, ii = 0, tn = 0, ha = null, ax = 0;
  function Xt() {
    throw Error(o(321));
  }
  function Zc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!hs(e[l], t[l])) return !1;
    return !0;
  }
  function Vc(e, t, l, a, n, i) {
    return hl = i, dt = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, y.H = e === null || e.memoizedState === null ? gd : bd, Xl = !1, i = l(a, n), Xl = !1, da && (i = Ho(
      t,
      l,
      a,
      n
    )), qo(e), i;
  }
  function qo(e) {
    y.H = hi;
    var t = kt !== null && kt.next !== null;
    if (hl = 0, Zt = kt = dt = null, ni = !1, tn = 0, ha = null, t) throw Error(o(300));
    e === null || Wt || (e = e.dependencies, e !== null && Pn(e) && (Wt = !0));
  }
  function Ho(e, t, l, a) {
    dt = e;
    var n = 0;
    do {
      if (da && (ha = null), tn = 0, da = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Zt = kt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      y.H = dx, i = t(l, a);
    } while (da);
    return i;
  }
  function nx() {
    var e = y.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? sn(t) : t, e = e.useState()[0], (kt !== null ? kt.memoizedState : null) !== e && (dt.flags |= 1024), t;
  }
  function Jc() {
    var e = ii !== 0;
    return ii = 0, e;
  }
  function Kc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function $c(e) {
    if (ni) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ni = !1;
    }
    hl = 0, Zt = kt = dt = null, da = !1, tn = ii = 0, ha = null;
  }
  function is() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Zt === null ? dt.memoizedState = Zt = e : Zt = Zt.next = e, Zt;
  }
  function Vt() {
    if (kt === null) {
      var e = dt.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = kt.next;
    var t = Zt === null ? dt.memoizedState : Zt.next;
    if (t !== null)
      Zt = t, kt = e;
    else {
      if (e === null)
        throw dt.alternate === null ? Error(o(467)) : Error(o(310));
      kt = e, e = {
        memoizedState: kt.memoizedState,
        baseState: kt.baseState,
        baseQueue: kt.baseQueue,
        queue: kt.queue,
        next: null
      }, Zt === null ? dt.memoizedState = Zt = e : Zt = Zt.next = e;
    }
    return Zt;
  }
  function Wc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function sn(e) {
    var t = tn;
    return tn += 1, ha === null && (ha = []), e = zo(ha, e, t), t = dt, (Zt === null ? t.memoizedState : Zt.next) === null && (t = t.alternate, y.H = t === null || t.memoizedState === null ? gd : bd), e;
  }
  function ci(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return sn(e);
      if (e.$$typeof === F) return ss(e);
    }
    throw Error(o(438, String(e)));
  }
  function Fc(e) {
    var t = null, l = dt.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = dt.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Wc(), dt.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ze;
    return t.index++, l;
  }
  function $s(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ri(e) {
    var t = Vt();
    return Ic(t, kt, e);
  }
  function Ic(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, i = a.pending;
    if (i !== null) {
      if (n !== null) {
        var c = n.next;
        n.next = i.next, i.next = c;
      }
      t.baseQueue = n = i, a.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var d = c = null, p = null, z = t, J = !1;
      do {
        var ee = z.lane & -536870913;
        if (ee !== z.lane ? (pt & ee) === ee : (hl & ee) === ee) {
          var R = z.revertLane;
          if (R === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), ee === ra && (J = !0);
          else if ((hl & R) === R) {
            z = z.next, R === ra && (J = !0);
            continue;
          } else
            ee = {
              lane: 0,
              revertLane: z.revertLane,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, p === null ? (d = p = ee, c = i) : p = p.next = ee, dt.lanes |= R, gl |= R;
          ee = z.action, Xl && l(i, ee), i = z.hasEagerState ? z.eagerState : l(i, ee);
        } else
          R = {
            lane: ee,
            revertLane: z.revertLane,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, p === null ? (d = p = R, c = i) : p = p.next = R, dt.lanes |= ee, gl |= ee;
        z = z.next;
      } while (z !== null && z !== t);
      if (p === null ? c = i : p.next = d, !hs(i, e.memoizedState) && (Wt = !0, J && (l = ua, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = p, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Pc(e) {
    var t = Vt(), l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== n);
      hs(i, t.memoizedState) || (Wt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Bo(e, t, l) {
    var a = dt, n = Vt(), i = yt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !hs(
      (kt || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Wt = !0), n = n.queue;
    var d = Go.bind(null, a, n, e);
    if (ln(2048, 8, d, [e]), n.getSnapshot !== t || c || Zt !== null && Zt.memoizedState.tag & 1) {
      if (a.flags |= 2048, fa(
        9,
        ui(),
        Yo.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), At === null) throw Error(o(349));
      i || (hl & 124) !== 0 || Lo(a, t, l);
    }
    return l;
  }
  function Lo(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = dt.updateQueue, t === null ? (t = Wc(), dt.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Yo(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Xo(t) && Qo(e);
  }
  function Go(e, t, l) {
    return l(function() {
      Xo(t) && Qo(e);
    });
  }
  function Xo(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !hs(e, l);
    } catch {
      return !0;
    }
  }
  function Qo(e) {
    var t = aa(e, 2);
    t !== null && ps(t, e, 2);
  }
  function er(e) {
    var t = is();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Xl) {
        Me(!0);
        try {
          l();
        } finally {
          Me(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: $s,
      lastRenderedState: e
    }, t;
  }
  function Zo(e, t, l, a) {
    return e.baseState = l, Ic(
      e,
      kt,
      typeof a == "function" ? a : $s
    );
  }
  function ix(e, t, l, a, n) {
    if (di(e)) throw Error(o(485));
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
        then: function(c) {
          i.listeners.push(c);
        }
      };
      y.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Vo(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Vo(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = y.T, c = {};
      y.T = c;
      try {
        var d = l(n, a), p = y.S;
        p !== null && p(c, d), Jo(e, t, d);
      } catch (z) {
        tr(e, t, z);
      } finally {
        y.T = i;
      }
    } else
      try {
        i = l(n, a), Jo(e, t, i);
      } catch (z) {
        tr(e, t, z);
      }
  }
  function Jo(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Ko(e, t, a);
      },
      function(a) {
        return tr(e, t, a);
      }
    ) : Ko(e, t, l);
  }
  function Ko(e, t, l) {
    t.status = "fulfilled", t.value = l, $o(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Vo(e, l)));
  }
  function tr(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, $o(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function $o(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Wo(e, t) {
    return t;
  }
  function Fo(e, t) {
    if (yt) {
      var l = At.formState;
      if (l !== null) {
        e: {
          var a = dt;
          if (yt) {
            if (Bt) {
              t: {
                for (var n = Bt, i = Us; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Ts(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Bt = Ts(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Bl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = is(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Wo,
      lastRenderedState: t
    }, l.queue = a, l = jd.bind(
      null,
      dt,
      a
    ), a.dispatch = l, a = er(!1), i = ir.bind(
      null,
      dt,
      !1,
      a.queue
    ), a = is(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = ix.bind(
      null,
      dt,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Io(e) {
    var t = Vt();
    return Po(t, kt, e);
  }
  function Po(e, t, l) {
    if (t = Ic(
      e,
      t,
      Wo
    )[0], e = ri($s)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = sn(t);
      } catch (c) {
        throw c === Wa ? si : c;
      }
    else a = t;
    t = Vt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (dt.flags |= 2048, fa(
      9,
      ui(),
      cx.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function cx(e, t) {
    e.action = t;
  }
  function ed(e) {
    var t = Vt(), l = kt;
    if (l !== null)
      return Po(t, l, e);
    Vt(), t = t.memoizedState, l = Vt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function fa(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = dt.updateQueue, t === null && (t = Wc(), dt.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function ui() {
    return { destroy: void 0, resource: void 0 };
  }
  function td() {
    return Vt().memoizedState;
  }
  function oi(e, t, l, a) {
    var n = is();
    a = a === void 0 ? null : a, dt.flags |= e, n.memoizedState = fa(
      1 | t,
      ui(),
      l,
      a
    );
  }
  function ln(e, t, l, a) {
    var n = Vt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    kt !== null && a !== null && Zc(a, kt.memoizedState.deps) ? n.memoizedState = fa(t, i, l, a) : (dt.flags |= e, n.memoizedState = fa(
      1 | t,
      i,
      l,
      a
    ));
  }
  function sd(e, t) {
    oi(8390656, 8, e, t);
  }
  function ld(e, t) {
    ln(2048, 8, e, t);
  }
  function ad(e, t) {
    return ln(4, 2, e, t);
  }
  function nd(e, t) {
    return ln(4, 4, e, t);
  }
  function id(e, t) {
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
  function cd(e, t, l) {
    l = l != null ? l.concat([e]) : null, ln(4, 4, id.bind(null, t, e), l);
  }
  function sr() {
  }
  function rd(e, t) {
    var l = Vt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Zc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function ud(e, t) {
    var l = Vt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Zc(t, a[1]))
      return a[0];
    if (a = e(), Xl) {
      Me(!0);
      try {
        e();
      } finally {
        Me(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function lr(e, t, l) {
    return l === void 0 || (hl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = hh(), dt.lanes |= e, gl |= e, l);
  }
  function od(e, t, l, a) {
    return hs(l, t) ? l : oa.current !== null ? (e = lr(e, l, a), hs(e, t) || (Wt = !0), e) : (hl & 42) === 0 ? (Wt = !0, e.memoizedState = l) : (e = hh(), dt.lanes |= e, gl |= e, t);
  }
  function dd(e, t, l, a, n) {
    var i = Q.p;
    Q.p = i !== 0 && 8 > i ? i : 8;
    var c = y.T, d = {};
    y.T = d, ir(e, !1, t, l);
    try {
      var p = n(), z = y.S;
      if (z !== null && z(d, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var J = lx(
          p,
          a
        );
        an(
          e,
          t,
          J,
          vs(e)
        );
      } else
        an(
          e,
          t,
          a,
          vs(e)
        );
    } catch (ee) {
      an(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: ee },
        vs()
      );
    } finally {
      Q.p = i, y.T = c;
    }
  }
  function rx() {
  }
  function ar(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = hd(e).queue;
    dd(
      e,
      n,
      t,
      le,
      l === null ? rx : function() {
        return fd(e), l(a);
      }
    );
  }
  function hd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: le,
      baseState: le,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: $s,
        lastRenderedState: le
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
        lastRenderedReducer: $s,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function fd(e) {
    var t = hd(e).next.queue;
    an(e, t, {}, vs());
  }
  function nr() {
    return ss(Nn);
  }
  function md() {
    return Vt().memoizedState;
  }
  function xd() {
    return Vt().memoizedState;
  }
  function ux(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = vs();
          e = ol(l);
          var a = dl(t, e, l);
          a !== null && (ps(a, t, l), Ia(a, t, l)), t = { cache: Dc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function ox(e, t, l) {
    var a = vs();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, di(e) ? vd(t, l) : (l = wc(e, t, l, a), l !== null && (ps(l, e, a), pd(l, t, a)));
  }
  function jd(e, t, l) {
    var a = vs();
    an(e, t, l, a);
  }
  function an(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (di(e)) vd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, d = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, hs(d, c))
            return Kn(e, t, n, 0), At === null && Jn(), !1;
        } catch {
        } finally {
        }
      if (l = wc(e, t, n, a), l !== null)
        return ps(l, e, a), pd(l, t, a), !0;
    }
    return !1;
  }
  function ir(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Hr(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, di(e)) {
      if (t) throw Error(o(479));
    } else
      t = wc(
        e,
        l,
        a,
        2
      ), t !== null && ps(t, e, 2);
  }
  function di(e) {
    var t = e.alternate;
    return e === dt || t !== null && t === dt;
  }
  function vd(e, t) {
    da = ni = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function pd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  var hi = {
    readContext: ss,
    use: ci,
    useCallback: Xt,
    useContext: Xt,
    useEffect: Xt,
    useImperativeHandle: Xt,
    useLayoutEffect: Xt,
    useInsertionEffect: Xt,
    useMemo: Xt,
    useReducer: Xt,
    useRef: Xt,
    useState: Xt,
    useDebugValue: Xt,
    useDeferredValue: Xt,
    useTransition: Xt,
    useSyncExternalStore: Xt,
    useId: Xt,
    useHostTransitionStatus: Xt,
    useFormState: Xt,
    useActionState: Xt,
    useOptimistic: Xt,
    useMemoCache: Xt,
    useCacheRefresh: Xt
  }, gd = {
    readContext: ss,
    use: ci,
    useCallback: function(e, t) {
      return is().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ss,
    useEffect: sd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, oi(
        4194308,
        4,
        id.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return oi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      oi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = is();
      t = t === void 0 ? null : t;
      var a = e();
      if (Xl) {
        Me(!0);
        try {
          e();
        } finally {
          Me(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = is();
      if (l !== void 0) {
        var n = l(t);
        if (Xl) {
          Me(!0);
          try {
            l(t);
          } finally {
            Me(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = ox.bind(
        null,
        dt,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = is();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = er(e);
      var t = e.queue, l = jd.bind(null, dt, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: sr,
    useDeferredValue: function(e, t) {
      var l = is();
      return lr(l, e, t);
    },
    useTransition: function() {
      var e = er(!1);
      return e = dd.bind(
        null,
        dt,
        e.queue,
        !0,
        !1
      ), is().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = dt, n = is();
      if (yt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), At === null)
          throw Error(o(349));
        (pt & 124) !== 0 || Lo(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, sd(Go.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, fa(
        9,
        ui(),
        Yo.bind(
          null,
          a,
          i,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = is(), t = At.identifierPrefix;
      if (yt) {
        var l = Vs, a = Zs;
        l = (a & ~(1 << 32 - lt(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = ii++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = ax++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: nr,
    useFormState: Fo,
    useActionState: Fo,
    useOptimistic: function(e) {
      var t = is();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = ir.bind(
        null,
        dt,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Fc,
    useCacheRefresh: function() {
      return is().memoizedState = ux.bind(
        null,
        dt
      );
    }
  }, bd = {
    readContext: ss,
    use: ci,
    useCallback: rd,
    useContext: ss,
    useEffect: ld,
    useImperativeHandle: cd,
    useInsertionEffect: ad,
    useLayoutEffect: nd,
    useMemo: ud,
    useReducer: ri,
    useRef: td,
    useState: function() {
      return ri($s);
    },
    useDebugValue: sr,
    useDeferredValue: function(e, t) {
      var l = Vt();
      return od(
        l,
        kt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ri($s)[0], t = Vt().memoizedState;
      return [
        typeof e == "boolean" ? e : sn(e),
        t
      ];
    },
    useSyncExternalStore: Bo,
    useId: md,
    useHostTransitionStatus: nr,
    useFormState: Io,
    useActionState: Io,
    useOptimistic: function(e, t) {
      var l = Vt();
      return Zo(l, kt, e, t);
    },
    useMemoCache: Fc,
    useCacheRefresh: xd
  }, dx = {
    readContext: ss,
    use: ci,
    useCallback: rd,
    useContext: ss,
    useEffect: ld,
    useImperativeHandle: cd,
    useInsertionEffect: ad,
    useLayoutEffect: nd,
    useMemo: ud,
    useReducer: Pc,
    useRef: td,
    useState: function() {
      return Pc($s);
    },
    useDebugValue: sr,
    useDeferredValue: function(e, t) {
      var l = Vt();
      return kt === null ? lr(l, e, t) : od(
        l,
        kt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Pc($s)[0], t = Vt().memoizedState;
      return [
        typeof e == "boolean" ? e : sn(e),
        t
      ];
    },
    useSyncExternalStore: Bo,
    useId: md,
    useHostTransitionStatus: nr,
    useFormState: ed,
    useActionState: ed,
    useOptimistic: function(e, t) {
      var l = Vt();
      return kt !== null ? Zo(l, kt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Fc,
    useCacheRefresh: xd
  }, ma = null, nn = 0;
  function fi(e) {
    var t = nn;
    return nn += 1, ma === null && (ma = []), zo(ma, e, t);
  }
  function cn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function mi(e, t) {
    throw t.$$typeof === K ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function yd(e) {
    var t = e._init;
    return t(e._payload);
  }
  function _d(e) {
    function t(C, S) {
      if (e) {
        var E = C.deletions;
        E === null ? (C.deletions = [S], C.flags |= 16) : E.push(S);
      }
    }
    function l(C, S) {
      if (!e) return null;
      for (; S !== null; )
        t(C, S), S = S.sibling;
      return null;
    }
    function a(C) {
      for (var S = /* @__PURE__ */ new Map(); C !== null; )
        C.key !== null ? S.set(C.key, C) : S.set(C.index, C), C = C.sibling;
      return S;
    }
    function n(C, S) {
      return C = Qs(C, S), C.index = 0, C.sibling = null, C;
    }
    function i(C, S, E) {
      return C.index = E, e ? (E = C.alternate, E !== null ? (E = E.index, E < S ? (C.flags |= 67108866, S) : E) : (C.flags |= 67108866, S)) : (C.flags |= 1048576, S);
    }
    function c(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function d(C, S, E, W) {
      return S === null || S.tag !== 6 ? (S = Cc(E, C.mode, W), S.return = C, S) : (S = n(S, E), S.return = C, S);
    }
    function p(C, S, E, W) {
      var qe = E.type;
      return qe === je ? J(
        C,
        S,
        E.props.children,
        W,
        E.key
      ) : S !== null && (S.elementType === qe || typeof qe == "object" && qe !== null && qe.$$typeof === Ae && yd(qe) === S.type) ? (S = n(S, E.props), cn(S, E), S.return = C, S) : (S = Wn(
        E.type,
        E.key,
        E.props,
        null,
        C.mode,
        W
      ), cn(S, E), S.return = C, S);
    }
    function z(C, S, E, W) {
      return S === null || S.tag !== 4 || S.stateNode.containerInfo !== E.containerInfo || S.stateNode.implementation !== E.implementation ? (S = Ec(E, C.mode, W), S.return = C, S) : (S = n(S, E.children || []), S.return = C, S);
    }
    function J(C, S, E, W, qe) {
      return S === null || S.tag !== 7 ? (S = Dl(
        E,
        C.mode,
        W,
        qe
      ), S.return = C, S) : (S = n(S, E), S.return = C, S);
    }
    function ee(C, S, E) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return S = Cc(
          "" + S,
          C.mode,
          E
        ), S.return = C, S;
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case k:
            return E = Wn(
              S.type,
              S.key,
              S.props,
              null,
              C.mode,
              E
            ), cn(E, S), E.return = C, E;
          case se:
            return S = Ec(
              S,
              C.mode,
              E
            ), S.return = C, S;
          case Ae:
            var W = S._init;
            return S = W(S._payload), ee(C, S, E);
        }
        if (fe(S) || pe(S))
          return S = Dl(
            S,
            C.mode,
            E,
            null
          ), S.return = C, S;
        if (typeof S.then == "function")
          return ee(C, fi(S), E);
        if (S.$$typeof === F)
          return ee(
            C,
            ei(C, S),
            E
          );
        mi(C, S);
      }
      return null;
    }
    function R(C, S, E, W) {
      var qe = S !== null ? S.key : null;
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return qe !== null ? null : d(C, S, "" + E, W);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case k:
            return E.key === qe ? p(C, S, E, W) : null;
          case se:
            return E.key === qe ? z(C, S, E, W) : null;
          case Ae:
            return qe = E._init, E = qe(E._payload), R(C, S, E, W);
        }
        if (fe(E) || pe(E))
          return qe !== null ? null : J(C, S, E, W, null);
        if (typeof E.then == "function")
          return R(
            C,
            S,
            fi(E),
            W
          );
        if (E.$$typeof === F)
          return R(
            C,
            S,
            ei(C, E),
            W
          );
        mi(C, E);
      }
      return null;
    }
    function q(C, S, E, W, qe) {
      if (typeof W == "string" && W !== "" || typeof W == "number" || typeof W == "bigint")
        return C = C.get(E) || null, d(S, C, "" + W, qe);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case k:
            return C = C.get(
              W.key === null ? E : W.key
            ) || null, p(S, C, W, qe);
          case se:
            return C = C.get(
              W.key === null ? E : W.key
            ) || null, z(S, C, W, qe);
          case Ae:
            var ft = W._init;
            return W = ft(W._payload), q(
              C,
              S,
              E,
              W,
              qe
            );
        }
        if (fe(W) || pe(W))
          return C = C.get(E) || null, J(S, C, W, qe, null);
        if (typeof W.then == "function")
          return q(
            C,
            S,
            E,
            fi(W),
            qe
          );
        if (W.$$typeof === F)
          return q(
            C,
            S,
            E,
            ei(S, W),
            qe
          );
        mi(S, W);
      }
      return null;
    }
    function tt(C, S, E, W) {
      for (var qe = null, ft = null, Le = S, Ie = S = 0, It = null; Le !== null && Ie < E.length; Ie++) {
        Le.index > Ie ? (It = Le, Le = null) : It = Le.sibling;
        var gt = R(
          C,
          Le,
          E[Ie],
          W
        );
        if (gt === null) {
          Le === null && (Le = It);
          break;
        }
        e && Le && gt.alternate === null && t(C, Le), S = i(gt, S, Ie), ft === null ? qe = gt : ft.sibling = gt, ft = gt, Le = It;
      }
      if (Ie === E.length)
        return l(C, Le), yt && ql(C, Ie), qe;
      if (Le === null) {
        for (; Ie < E.length; Ie++)
          Le = ee(C, E[Ie], W), Le !== null && (S = i(
            Le,
            S,
            Ie
          ), ft === null ? qe = Le : ft.sibling = Le, ft = Le);
        return yt && ql(C, Ie), qe;
      }
      for (Le = a(Le); Ie < E.length; Ie++)
        It = q(
          Le,
          C,
          Ie,
          E[Ie],
          W
        ), It !== null && (e && It.alternate !== null && Le.delete(
          It.key === null ? Ie : It.key
        ), S = i(
          It,
          S,
          Ie
        ), ft === null ? qe = It : ft.sibling = It, ft = It);
      return e && Le.forEach(function(El) {
        return t(C, El);
      }), yt && ql(C, Ie), qe;
    }
    function Ke(C, S, E, W) {
      if (E == null) throw Error(o(151));
      for (var qe = null, ft = null, Le = S, Ie = S = 0, It = null, gt = E.next(); Le !== null && !gt.done; Ie++, gt = E.next()) {
        Le.index > Ie ? (It = Le, Le = null) : It = Le.sibling;
        var El = R(C, Le, gt.value, W);
        if (El === null) {
          Le === null && (Le = It);
          break;
        }
        e && Le && El.alternate === null && t(C, Le), S = i(El, S, Ie), ft === null ? qe = El : ft.sibling = El, ft = El, Le = It;
      }
      if (gt.done)
        return l(C, Le), yt && ql(C, Ie), qe;
      if (Le === null) {
        for (; !gt.done; Ie++, gt = E.next())
          gt = ee(C, gt.value, W), gt !== null && (S = i(gt, S, Ie), ft === null ? qe = gt : ft.sibling = gt, ft = gt);
        return yt && ql(C, Ie), qe;
      }
      for (Le = a(Le); !gt.done; Ie++, gt = E.next())
        gt = q(Le, C, Ie, gt.value, W), gt !== null && (e && gt.alternate !== null && Le.delete(gt.key === null ? Ie : gt.key), S = i(gt, S, Ie), ft === null ? qe = gt : ft.sibling = gt, ft = gt);
      return e && Le.forEach(function(hj) {
        return t(C, hj);
      }), yt && ql(C, Ie), qe;
    }
    function Et(C, S, E, W) {
      if (typeof E == "object" && E !== null && E.type === je && E.key === null && (E = E.props.children), typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case k:
            e: {
              for (var qe = E.key; S !== null; ) {
                if (S.key === qe) {
                  if (qe = E.type, qe === je) {
                    if (S.tag === 7) {
                      l(
                        C,
                        S.sibling
                      ), W = n(
                        S,
                        E.props.children
                      ), W.return = C, C = W;
                      break e;
                    }
                  } else if (S.elementType === qe || typeof qe == "object" && qe !== null && qe.$$typeof === Ae && yd(qe) === S.type) {
                    l(
                      C,
                      S.sibling
                    ), W = n(S, E.props), cn(W, E), W.return = C, C = W;
                    break e;
                  }
                  l(C, S);
                  break;
                } else t(C, S);
                S = S.sibling;
              }
              E.type === je ? (W = Dl(
                E.props.children,
                C.mode,
                W,
                E.key
              ), W.return = C, C = W) : (W = Wn(
                E.type,
                E.key,
                E.props,
                null,
                C.mode,
                W
              ), cn(W, E), W.return = C, C = W);
            }
            return c(C);
          case se:
            e: {
              for (qe = E.key; S !== null; ) {
                if (S.key === qe)
                  if (S.tag === 4 && S.stateNode.containerInfo === E.containerInfo && S.stateNode.implementation === E.implementation) {
                    l(
                      C,
                      S.sibling
                    ), W = n(S, E.children || []), W.return = C, C = W;
                    break e;
                  } else {
                    l(C, S);
                    break;
                  }
                else t(C, S);
                S = S.sibling;
              }
              W = Ec(E, C.mode, W), W.return = C, C = W;
            }
            return c(C);
          case Ae:
            return qe = E._init, E = qe(E._payload), Et(
              C,
              S,
              E,
              W
            );
        }
        if (fe(E))
          return tt(
            C,
            S,
            E,
            W
          );
        if (pe(E)) {
          if (qe = pe(E), typeof qe != "function") throw Error(o(150));
          return E = qe.call(E), Ke(
            C,
            S,
            E,
            W
          );
        }
        if (typeof E.then == "function")
          return Et(
            C,
            S,
            fi(E),
            W
          );
        if (E.$$typeof === F)
          return Et(
            C,
            S,
            ei(C, E),
            W
          );
        mi(C, E);
      }
      return typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint" ? (E = "" + E, S !== null && S.tag === 6 ? (l(C, S.sibling), W = n(S, E), W.return = C, C = W) : (l(C, S), W = Cc(E, C.mode, W), W.return = C, C = W), c(C)) : l(C, S);
    }
    return function(C, S, E, W) {
      try {
        nn = 0;
        var qe = Et(
          C,
          S,
          E,
          W
        );
        return ma = null, qe;
      } catch (Le) {
        if (Le === Wa || Le === si) throw Le;
        var ft = fs(29, Le, null, C.mode);
        return ft.lanes = W, ft.return = C, ft;
      } finally {
      }
    };
  }
  var xa = _d(!0), Nd = _d(!1), ws = L(null), Ds = null;
  function fl(e) {
    var t = e.alternate;
    te($t, $t.current & 1), te(ws, e), Ds === null && (t === null || oa.current !== null || t.memoizedState !== null) && (Ds = e);
  }
  function Sd(e) {
    if (e.tag === 22) {
      if (te($t, $t.current), te(ws, e), Ds === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Ds = e);
      }
    } else ml();
  }
  function ml() {
    te($t, $t.current), te(ws, ws.current);
  }
  function Ws(e) {
    P(ws), Ds === e && (Ds = null), P($t);
  }
  var $t = L(0);
  function xi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Wr(l)))
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
  function cr(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : D({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var rr = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = vs(), n = ol(a);
      n.payload = t, l != null && (n.callback = l), t = dl(e, n, a), t !== null && (ps(t, e, a), Ia(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = vs(), n = ol(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = dl(e, n, a), t !== null && (ps(t, e, a), Ia(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = vs(), a = ol(l);
      a.tag = 2, t != null && (a.callback = t), t = dl(e, a, l), t !== null && (ps(t, e, l), Ia(t, e, l));
    }
  };
  function wd(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !Ga(l, a) || !Ga(n, i) : !0;
  }
  function kd(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && rr.enqueueReplaceState(t, t.state, null);
  }
  function Ql(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = D({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var ji = typeof reportError == "function" ? reportError : function(e) {
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
  function Cd(e) {
    ji(e);
  }
  function Ed(e) {
    console.error(e);
  }
  function Od(e) {
    ji(e);
  }
  function vi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Td(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function ur(e, t, l) {
    return l = ol(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      vi(e, t);
    }, l;
  }
  function zd(e) {
    return e = ol(e), e.tag = 3, e;
  }
  function Ad(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        Td(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      Td(t, l, a), typeof n != "function" && (bl === null ? bl = /* @__PURE__ */ new Set([this]) : bl.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function hx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ja(
        t,
        l,
        n,
        !0
      ), l = ws.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Ds === null ? Rr() : l.alternate === null && Lt === 0 && (Lt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Hc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Dr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Hc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Dr(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return Dr(e, a, n), Rr(), !1;
    }
    if (yt)
      return t = ws.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== zc && (e = Error(o(422), { cause: a }), Va(ys(e, l)))) : (a !== zc && (t = Error(o(423), {
        cause: a
      }), Va(
        ys(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = ys(a, l), n = ur(
        e.stateNode,
        a,
        n
      ), Yc(e, n), Lt !== 4 && (Lt = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = ys(i, l), mn === null ? mn = [i] : mn.push(i), Lt !== 4 && (Lt = 2), t === null) return !0;
    a = ys(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = ur(l.stateNode, a, e), Yc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (bl === null || !bl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = zd(n), Ad(
              n,
              e,
              l,
              a
            ), Yc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Rd = Error(o(461)), Wt = !1;
  function Pt(e, t, l, a) {
    t.child = e === null ? Nd(t, null, l, a) : xa(
      t,
      e.child,
      l,
      a
    );
  }
  function Ud(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var d in a)
        d !== "ref" && (c[d] = a[d]);
    } else c = a;
    return Yl(t), a = Vc(
      e,
      t,
      l,
      c,
      i,
      n
    ), d = Jc(), e !== null && !Wt ? (Kc(e, t, n), Fs(e, t, n)) : (yt && d && Oc(t), t.flags |= 1, Pt(e, t, a, n), t.child);
  }
  function Dd(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !kc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Md(
        e,
        t,
        i,
        a,
        n
      )) : (e = Wn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !vr(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Ga, l(c, a) && e.ref === t.ref)
        return Fs(e, t, n);
    }
    return t.flags |= 1, e = Qs(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Md(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Ga(i, a) && e.ref === t.ref)
        if (Wt = !1, t.pendingProps = a = i, vr(e, n))
          (e.flags & 131072) !== 0 && (Wt = !0);
        else
          return t.lanes = e.lanes, Fs(e, t, n);
    }
    return or(
      e,
      t,
      l,
      a,
      n
    );
  }
  function qd(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return Hd(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ti(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Mo(t, i) : Xc(), Sd(t);
      else
        return t.lanes = t.childLanes = 536870912, Hd(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ti(t, i.cachePool), Mo(t, i), ml(), t.memoizedState = null) : (e !== null && ti(t, null), Xc(), ml());
    return Pt(e, t, n, l), t.child;
  }
  function Hd(e, t, l, a) {
    var n = qc();
    return n = n === null ? null : { parent: Kt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && ti(t, null), Xc(), Sd(t), e !== null && Ja(e, t, a, !0), null;
  }
  function pi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function or(e, t, l, a, n) {
    return Yl(t), l = Vc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Jc(), e !== null && !Wt ? (Kc(e, t, n), Fs(e, t, n)) : (yt && a && Oc(t), t.flags |= 1, Pt(e, t, l, n), t.child);
  }
  function Bd(e, t, l, a, n, i) {
    return Yl(t), t.updateQueue = null, l = Ho(
      t,
      a,
      l,
      n
    ), qo(e), a = Jc(), e !== null && !Wt ? (Kc(e, t, i), Fs(e, t, i)) : (yt && a && Oc(t), t.flags |= 1, Pt(e, t, l, i), t.child);
  }
  function Ld(e, t, l, a, n) {
    if (Yl(t), t.stateNode === null) {
      var i = na, c = l.contextType;
      typeof c == "object" && c !== null && (i = ss(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = rr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Bc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? ss(c) : na, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (cr(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && rr.enqueueReplaceState(i, i.state, null), en(t, a, i, n), Pa(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, p = Ql(l, d);
      i.props = p;
      var z = i.context, J = l.contextType;
      c = na, typeof J == "object" && J !== null && (c = ss(J));
      var ee = l.getDerivedStateFromProps;
      J = typeof ee == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || z !== c) && kd(
        t,
        i,
        a,
        c
      ), ul = !1;
      var R = t.memoizedState;
      i.state = R, en(t, a, i, n), Pa(), z = t.memoizedState, d || R !== z || ul ? (typeof ee == "function" && (cr(
        t,
        l,
        ee,
        a
      ), z = t.memoizedState), (p = ul || wd(
        t,
        l,
        p,
        a,
        R,
        z,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = c, a = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Lc(e, t), c = t.memoizedProps, J = Ql(l, c), i.props = J, ee = t.pendingProps, R = i.context, z = l.contextType, p = na, typeof z == "object" && z !== null && (p = ss(z)), d = l.getDerivedStateFromProps, (z = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== ee || R !== p) && kd(
        t,
        i,
        a,
        p
      ), ul = !1, R = t.memoizedState, i.state = R, en(t, a, i, n), Pa();
      var q = t.memoizedState;
      c !== ee || R !== q || ul || e !== null && e.dependencies !== null && Pn(e.dependencies) ? (typeof d == "function" && (cr(
        t,
        l,
        d,
        a
      ), q = t.memoizedState), (J = ul || wd(
        t,
        l,
        J,
        a,
        R,
        q,
        p
      ) || e !== null && e.dependencies !== null && Pn(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, q, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        q,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = q), i.props = a, i.state = q, i.context = p, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, pi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = xa(
      t,
      e.child,
      null,
      n
    ), t.child = xa(
      t,
      null,
      l,
      n
    )) : Pt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Fs(
      e,
      t,
      n
    ), e;
  }
  function Yd(e, t, l, a) {
    return Za(), t.flags |= 256, Pt(e, t, l, a), t.child;
  }
  var dr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function hr(e) {
    return { baseLanes: e, cachePool: Eo() };
  }
  function fr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= ks), e;
  }
  function Gd(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : ($t.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (yt) {
        if (n ? fl(t) : ml(), yt) {
          var d = Bt, p;
          if (p = d) {
            e: {
              for (p = d, d = Us; p.nodeType !== 8; ) {
                if (!d) {
                  d = null;
                  break e;
                }
                if (p = Ts(
                  p.nextSibling
                ), p === null) {
                  d = null;
                  break e;
                }
              }
              d = p;
            }
            d !== null ? (t.memoizedState = {
              dehydrated: d,
              treeContext: Ml !== null ? { id: Zs, overflow: Vs } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = fs(
              18,
              null,
              null,
              0
            ), p.stateNode = d, p.return = t, t.child = p, as = t, Bt = null, p = !0) : p = !1;
          }
          p || Bl(t);
        }
        if (d = t.memoizedState, d !== null && (d = d.dehydrated, d !== null))
          return Wr(d) ? t.lanes = 32 : t.lanes = 536870912, null;
        Ws(t);
      }
      return d = a.children, a = a.fallback, n ? (ml(), n = t.mode, d = gi(
        { mode: "hidden", children: d },
        n
      ), a = Dl(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, n = t.child, n.memoizedState = hr(l), n.childLanes = fr(
        e,
        c,
        l
      ), t.memoizedState = dr, a) : (fl(t), mr(t, d));
    }
    if (p = e.memoizedState, p !== null && (d = p.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (fl(t), t.flags &= -257, t = xr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (ml(), t.child = e.child, t.flags |= 128, t = null) : (ml(), n = a.fallback, d = t.mode, a = gi(
          { mode: "visible", children: a.children },
          d
        ), n = Dl(
          n,
          d,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, xa(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = hr(l), a.childLanes = fr(
          e,
          c,
          l
        ), t.memoizedState = dr, t = n);
      else if (fl(t), Wr(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var z = c.dgst;
        c = z, a = Error(o(419)), a.stack = "", a.digest = c, Va({ value: a, source: null, stack: null }), t = xr(
          e,
          t,
          l
        );
      } else if (Wt || Ja(e, t, l, !1), c = (l & e.childLanes) !== 0, Wt || c) {
        if (c = At, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : me(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== p.retryLane))
          throw p.retryLane = a, aa(e, a), ps(c, e, a), Rd;
        d.data === "$?" || Rr(), t = xr(
          e,
          t,
          l
        );
      } else
        d.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Bt = Ts(
          d.nextSibling
        ), as = t, yt = !0, Hl = null, Us = !1, e !== null && (Ns[Ss++] = Zs, Ns[Ss++] = Vs, Ns[Ss++] = Ml, Zs = e.id, Vs = e.overflow, Ml = t), t = mr(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (ml(), n = a.fallback, d = t.mode, p = e.child, z = p.sibling, a = Qs(p, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = p.subtreeFlags & 65011712, z !== null ? n = Qs(z, n) : (n = Dl(
      n,
      d,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, d = e.child.memoizedState, d === null ? d = hr(l) : (p = d.cachePool, p !== null ? (z = Kt._currentValue, p = p.parent !== z ? { parent: z, pool: z } : p) : p = Eo(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: p
    }), n.memoizedState = d, n.childLanes = fr(
      e,
      c,
      l
    ), t.memoizedState = dr, a) : (fl(t), l = e.child, e = l.sibling, l = Qs(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function mr(e, t) {
    return t = gi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function gi(e, t) {
    return e = fs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function xr(e, t, l) {
    return xa(t, e.child, null, l), e = mr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Xd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Rc(e.return, t, l);
  }
  function jr(e, t, l, a, n) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = l, i.tailMode = n);
  }
  function Qd(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (Pt(e, t, a.children, l), a = $t.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Xd(e, l, t);
          else if (e.tag === 19)
            Xd(e, l, t);
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
      a &= 1;
    }
    switch (te($t, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && xi(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), jr(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && xi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        jr(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        jr(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Fs(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), gl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ja(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, l = Qs(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Qs(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function vr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Pn(e)));
  }
  function fx(e, t, l) {
    switch (t.tag) {
      case 3:
        ne(t, t.stateNode.containerInfo), rl(t, Kt, e.memoizedState.cache), Za();
        break;
      case 27:
      case 5:
        ct(t);
        break;
      case 4:
        ne(t, t.stateNode.containerInfo);
        break;
      case 10:
        rl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (fl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Gd(e, t, l) : (fl(t), e = Fs(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        fl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ja(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Qd(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), te($t, $t.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, qd(e, t, l);
      case 24:
        rl(t, Kt, e.memoizedState.cache);
    }
    return Fs(e, t, l);
  }
  function Zd(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Wt = !0;
      else {
        if (!vr(e, l) && (t.flags & 128) === 0)
          return Wt = !1, fx(
            e,
            t,
            l
          );
        Wt = (e.flags & 131072) !== 0;
      }
    else
      Wt = !1, yt && (t.flags & 1048576) !== 0 && yo(t, In, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            kc(a) ? (e = Ql(a, e), t.tag = 1, t = Ld(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = or(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === he) {
                t.tag = 11, t = Ud(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === ve) {
                t.tag = 14, t = Dd(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              }
            }
            throw t = X(a) || a, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return or(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = Ql(
          a,
          t.pendingProps
        ), Ld(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (ne(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Lc(e, t), en(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, rl(t, Kt, a), a !== i.cache && Uc(
            t,
            [Kt],
            l,
            !0
          ), Pa(), a = c.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Yd(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = ys(
                Error(o(424)),
                t
              ), Va(n), t = Yd(
                e,
                t,
                a,
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
              for (Bt = Ts(e.firstChild), as = t, yt = !0, Hl = null, Us = !0, l = Nd(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Za(), a === n) {
              t = Fs(
                e,
                t,
                l
              );
              break e;
            }
            Pt(
              e,
              t,
              a,
              l
            );
          }
          t = t.child;
        }
        return t;
      case 26:
        return pi(e, t), e === null ? (l = $h(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : yt || (l = t.type, e = t.pendingProps, a = Ri(
          $.current
        ).createElement(l), a[ot] = t, a[Nt] = e, ts(a, l, e), f(a), t.stateNode = a) : t.memoizedState = $h(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return ct(t), e === null && yt && (a = t.stateNode = Vh(
          t.type,
          t.pendingProps,
          $.current
        ), as = t, Us = !0, n = Bt, Nl(t.type) ? (Fr = n, Bt = Ts(
          a.firstChild
        )) : Bt = n), Pt(
          e,
          t,
          t.pendingProps.children,
          l
        ), pi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && yt && ((n = a = Bt) && (a = Yx(
          a,
          t.type,
          t.pendingProps,
          Us
        ), a !== null ? (t.stateNode = a, as = t, Bt = Ts(
          a.firstChild
        ), Us = !1, n = !0) : n = !1), n || Bl(t)), ct(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, Jr(n, i) ? a = null : c !== null && Jr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Vc(
          e,
          t,
          nx,
          null,
          null,
          l
        ), Nn._currentValue = n), pi(e, t), Pt(e, t, a, l), t.child;
      case 6:
        return e === null && yt && ((e = l = Bt) && (l = Gx(
          l,
          t.pendingProps,
          Us
        ), l !== null ? (t.stateNode = l, as = t, Bt = null, e = !0) : e = !1), e || Bl(t)), null;
      case 13:
        return Gd(e, t, l);
      case 4:
        return ne(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = xa(
          t,
          null,
          a,
          l
        ) : Pt(
          e,
          t,
          a,
          l
        ), t.child;
      case 11:
        return Ud(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return Pt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return Pt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Pt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, rl(t, t.type, a.value), Pt(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Yl(t), n = ss(n), a = a(n), t.flags |= 1, Pt(e, t, a, l), t.child;
      case 14:
        return Dd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Md(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Qd(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = gi(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Qs(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return qd(e, t, l);
      case 24:
        return Yl(t), a = ss(Kt), e === null ? (n = qc(), n === null && (n = At, i = Dc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Bc(t), rl(t, Kt, n)) : ((e.lanes & l) !== 0 && (Lc(e, t), en(t, null, null, l), Pa()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), rl(t, Kt, a)) : (a = i.cache, rl(t, Kt, a), a !== n.cache && Uc(
          t,
          [Kt],
          l,
          !0
        ))), Pt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Is(e) {
    e.flags |= 4;
  }
  function Vd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ef(t)) {
      if (t = ws.current, t !== null && ((pt & 4194048) === pt ? Ds !== null : (pt & 62914560) !== pt && (pt & 536870912) === 0 || t !== Ds))
        throw Fa = Hc, Oo;
      e.flags |= 8192;
    }
  }
  function bi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? M() : 536870912, e.lanes |= t, ga |= t);
  }
  function rn(e, t) {
    if (!yt)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = e.tail;
          for (var a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function Dt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function mx(e, t, l) {
    var a = t.pendingProps;
    switch (Tc(t), t.tag) {
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
        return Dt(t), null;
      case 1:
        return Dt(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ks(Kt), Ee(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Qa(t) ? Is(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, So())), Dt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Is(t), l !== null ? (Dt(t), Vd(t, l)) : (Dt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Is(t), Dt(t), Vd(t, l)) : (Dt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Is(t), Dt(t), t.flags &= -16777217), null;
      case 27:
        Je(t), l = $.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Is(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Dt(t), null;
          }
          e = re.current, Qa(t) ? _o(t) : (e = Vh(n, a, l), t.stateNode = e, Is(t));
        }
        return Dt(t), null;
      case 5:
        if (Je(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Is(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Dt(t), null;
          }
          if (e = re.current, Qa(t))
            _o(t);
          else {
            switch (n = Ri(
              $.current
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
                    e = typeof a.is == "string" ? n.createElement("select", { is: a.is }) : n.createElement("select"), a.multiple ? e.multiple = !0 : a.size && (e.size = a.size);
                    break;
                  default:
                    e = typeof a.is == "string" ? n.createElement(l, { is: a.is }) : n.createElement(l);
                }
            }
            e[ot] = t, e[Nt] = a;
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
            e: switch (ts(e, l, a), l) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!a.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && Is(t);
          }
        }
        return Dt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Is(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = $.current, Qa(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = as, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[ot] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Bh(e.nodeValue, l)), e || Bl(t);
          } else
            e = Ri(e).createTextNode(
              a
            ), e[ot] = t, t.stateNode = e;
        }
        return Dt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Qa(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[ot] = t;
            } else
              Za(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Dt(t), n = !1;
          } else
            n = So(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Ws(t), t) : (Ws(t), null);
        }
        if (Ws(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), bi(t, t.updateQueue), Dt(t), null;
      case 4:
        return Ee(), e === null && Gr(t.stateNode.containerInfo), Dt(t), null;
      case 10:
        return Ks(t.type), Dt(t), null;
      case 19:
        if (P($t), n = t.memoizedState, n === null) return Dt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) rn(n, !1);
          else {
            if (Lt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = xi(e), i !== null) {
                  for (t.flags |= 128, rn(n, !1), e = i.updateQueue, t.updateQueue = e, bi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    bo(l, e), l = l.sibling;
                  return te(
                    $t,
                    $t.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && De() > Ni && (t.flags |= 128, a = !0, rn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = xi(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, bi(t, e), rn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !yt)
                return Dt(t), null;
            } else
              2 * De() - n.renderingStartTime > Ni && l !== 536870912 && (t.flags |= 128, a = !0, rn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = De(), t.sibling = null, e = $t.current, te($t, a ? e & 1 | 2 : e & 1), t) : (Dt(t), null);
      case 22:
      case 23:
        return Ws(t), Qc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Dt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Dt(t), l = t.updateQueue, l !== null && bi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && P(Gl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ks(Kt), Dt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function xx(e, t) {
    switch (Tc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ks(Kt), Ee(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Je(t), null;
      case 13:
        if (Ws(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Za();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return P($t), null;
      case 4:
        return Ee(), null;
      case 10:
        return Ks(t.type), null;
      case 22:
      case 23:
        return Ws(t), Qc(), e !== null && P(Gl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ks(Kt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Jd(e, t) {
    switch (Tc(t), t.tag) {
      case 3:
        Ks(Kt), Ee();
        break;
      case 26:
      case 27:
      case 5:
        Je(t);
        break;
      case 4:
        Ee();
        break;
      case 13:
        Ws(t);
        break;
      case 19:
        P($t);
        break;
      case 10:
        Ks(t.type);
        break;
      case 22:
      case 23:
        Ws(t), Qc(), e !== null && P(Gl);
        break;
      case 24:
        Ks(Kt);
    }
  }
  function un(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var i = l.create, c = l.inst;
            a = i(), c.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (d) {
      Tt(t, t.return, d);
    }
  }
  function xl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        a = i;
        do {
          if ((a.tag & e) === e) {
            var c = a.inst, d = c.destroy;
            if (d !== void 0) {
              c.destroy = void 0, n = t;
              var p = l, z = d;
              try {
                z();
              } catch (J) {
                Tt(
                  n,
                  p,
                  J
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (J) {
      Tt(t, t.return, J);
    }
  }
  function Kd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Do(t, l);
      } catch (a) {
        Tt(e, e.return, a);
      }
    }
  }
  function $d(e, t, l) {
    l.props = Ql(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Tt(e, t, a);
    }
  }
  function on(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (n) {
      Tt(e, t, n);
    }
  }
  function Ms(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Tt(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Tt(e, t, n);
        }
      else l.current = null;
  }
  function Wd(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      Tt(e, e.return, n);
    }
  }
  function pr(e, t, l) {
    try {
      var a = e.stateNode;
      Mx(a, e.type, l, t), a[Nt] = t;
    } catch (n) {
      Tt(e, e.return, n);
    }
  }
  function Fd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Nl(e.type) || e.tag === 4;
  }
  function gr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Fd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Nl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function br(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Ai));
    else if (a !== 4 && (a === 27 && Nl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (br(e, t, l), e = e.sibling; e !== null; )
        br(e, t, l), e = e.sibling;
  }
  function yi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Nl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (yi(e, t, l), e = e.sibling; e !== null; )
        yi(e, t, l), e = e.sibling;
  }
  function Id(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ts(t, a, l), t[ot] = e, t[Nt] = l;
    } catch (i) {
      Tt(e, e.return, i);
    }
  }
  var Ps = !1, Qt = !1, yr = !1, Pd = typeof WeakSet == "function" ? WeakSet : Set, Ft = null;
  function jx(e, t) {
    if (e = e.containerInfo, Zr = Bi, e = uo(e), gc(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset, i = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, i.nodeType;
            } catch {
              l = null;
              break e;
            }
            var c = 0, d = -1, p = -1, z = 0, J = 0, ee = e, R = null;
            t: for (; ; ) {
              for (var q; ee !== l || n !== 0 && ee.nodeType !== 3 || (d = c + n), ee !== i || a !== 0 && ee.nodeType !== 3 || (p = c + a), ee.nodeType === 3 && (c += ee.nodeValue.length), (q = ee.firstChild) !== null; )
                R = ee, ee = q;
              for (; ; ) {
                if (ee === e) break t;
                if (R === l && ++z === n && (d = c), R === i && ++J === a && (p = c), (q = ee.nextSibling) !== null) break;
                ee = R, R = ee.parentNode;
              }
              ee = q;
            }
            l = d === -1 || p === -1 ? null : { start: d, end: p };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Vr = { focusedElem: e, selectionRange: l }, Bi = !1, Ft = t; Ft !== null; )
      if (t = Ft, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, Ft = e;
      else
        for (; Ft !== null; ) {
          switch (t = Ft, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var tt = Ql(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    tt,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Ke) {
                  Tt(
                    l,
                    l.return,
                    Ke
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  $r(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      $r(e);
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
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Ft = e;
            break;
          }
          Ft = t.return;
        }
  }
  function eh(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        jl(e, l), a & 4 && un(5, l);
        break;
      case 1:
        if (jl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              Tt(l, l.return, c);
            }
          else {
            var n = Ql(
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
            } catch (c) {
              Tt(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Kd(l), a & 512 && on(l, l.return);
        break;
      case 3:
        if (jl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            Do(e, t);
          } catch (c) {
            Tt(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Id(l);
      case 26:
      case 5:
        jl(e, l), t === null && a & 4 && Wd(l), a & 512 && on(l, l.return);
        break;
      case 12:
        jl(e, l);
        break;
      case 13:
        jl(e, l), a & 4 && lh(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = wx.bind(
          null,
          l
        ), Xx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Ps, !a) {
          t = t !== null && t.memoizedState !== null || Qt, n = Ps;
          var i = Qt;
          Ps = a, (Qt = t) && !i ? vl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : jl(e, l), Ps = n, Qt = i;
        }
        break;
      case 30:
        break;
      default:
        jl(e, l);
    }
  }
  function th(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, th(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Te(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Rt = null, cs = !1;
  function el(e, t, l) {
    for (l = l.child; l !== null; )
      sh(e, t, l), l = l.sibling;
  }
  function sh(e, t, l) {
    if (Se && typeof Se.onCommitFiberUnmount == "function")
      try {
        Se.onCommitFiberUnmount(I, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Qt || Ms(l, t), el(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Qt || Ms(l, t);
        var a = Rt, n = cs;
        Nl(l.type) && (Rt = l.stateNode, cs = !1), el(
          e,
          t,
          l
        ), gn(l.stateNode), Rt = a, cs = n;
        break;
      case 5:
        Qt || Ms(l, t);
      case 6:
        if (a = Rt, n = cs, Rt = null, el(
          e,
          t,
          l
        ), Rt = a, cs = n, Rt !== null)
          if (cs)
            try {
              (Rt.nodeType === 9 ? Rt.body : Rt.nodeName === "HTML" ? Rt.ownerDocument.body : Rt).removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                t,
                i
              );
            }
          else
            try {
              Rt.removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Rt !== null && (cs ? (e = Rt, Qh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Cn(e)) : Qh(Rt, l.stateNode));
        break;
      case 4:
        a = Rt, n = cs, Rt = l.stateNode.containerInfo, cs = !0, el(
          e,
          t,
          l
        ), Rt = a, cs = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Qt || xl(2, l, t), Qt || xl(4, l, t), el(
          e,
          t,
          l
        );
        break;
      case 1:
        Qt || (Ms(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && $d(
          l,
          t,
          a
        )), el(
          e,
          t,
          l
        );
        break;
      case 21:
        el(
          e,
          t,
          l
        );
        break;
      case 22:
        Qt = (a = Qt) || l.memoizedState !== null, el(
          e,
          t,
          l
        ), Qt = a;
        break;
      default:
        el(
          e,
          t,
          l
        );
    }
  }
  function lh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Cn(e);
      } catch (l) {
        Tt(t, t.return, l);
      }
  }
  function vx(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Pd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Pd()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function _r(e, t) {
    var l = vx(e);
    t.forEach(function(a) {
      var n = kx.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function ms(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (Nl(d.type)) {
                Rt = d.stateNode, cs = !1;
                break e;
              }
              break;
            case 5:
              Rt = d.stateNode, cs = !1;
              break e;
            case 3:
            case 4:
              Rt = d.stateNode.containerInfo, cs = !0;
              break e;
          }
          d = d.return;
        }
        if (Rt === null) throw Error(o(160));
        sh(i, c, n), Rt = null, cs = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        ah(t, e), t = t.sibling;
  }
  var Os = null;
  function ah(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ms(t, e), xs(e), a & 4 && (xl(3, e, e.return), un(3, e), xl(5, e, e.return));
        break;
      case 1:
        ms(t, e), xs(e), a & 512 && (Qt || l === null || Ms(l, l.return)), a & 64 && Ps && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Os;
        if (ms(t, e), xs(e), a & 512 && (Qt || l === null || Ms(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[Oe] || i[ot] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), ts(i, a, l), i[ot] = e, f(i), a = i;
                      break e;
                    case "link":
                      var c = Ih(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var d = 0; d < c.length; d++)
                          if (i = c[d], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(d, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), ts(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Ih(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (d = 0; d < c.length; d++)
                          if (i = c[d], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(d, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), ts(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  i[ot] = e, f(i), a = i;
                }
                e.stateNode = a;
              } else
                Ph(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Fh(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? Ph(
              n,
              e.type,
              e.stateNode
            ) : Fh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && pr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ms(t, e), xs(e), a & 512 && (Qt || l === null || Ms(l, l.return)), l !== null && a & 4 && pr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ms(t, e), xs(e), a & 512 && (Qt || l === null || Ms(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Fl(n, "");
          } catch (q) {
            Tt(e, e.return, q);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, pr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (yr = !0);
        break;
      case 6:
        if (ms(t, e), xs(e), a & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (q) {
            Tt(e, e.return, q);
          }
        }
        break;
      case 3:
        if (Mi = null, n = Os, Os = Ui(t.containerInfo), ms(t, e), Os = n, xs(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Cn(t.containerInfo);
          } catch (q) {
            Tt(e, e.return, q);
          }
        yr && (yr = !1, nh(e));
        break;
      case 4:
        a = Os, Os = Ui(
          e.stateNode.containerInfo
        ), ms(t, e), xs(e), Os = a;
        break;
      case 12:
        ms(t, e), xs(e);
        break;
      case 13:
        ms(t, e), xs(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Er = De()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, _r(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = l !== null && l.memoizedState !== null, z = Ps, J = Qt;
        if (Ps = z || n, Qt = J || p, ms(t, e), Qt = J, Ps = z, xs(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || p || Ps || Qt || Zl(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                p = l = t;
                try {
                  if (i = p.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    d = p.stateNode;
                    var ee = p.memoizedProps.style, R = ee != null && ee.hasOwnProperty("display") ? ee.display : null;
                    d.style.display = R == null || typeof R == "boolean" ? "" : ("" + R).trim();
                  }
                } catch (q) {
                  Tt(p, p.return, q);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                p = t;
                try {
                  p.stateNode.nodeValue = n ? "" : p.memoizedProps;
                } catch (q) {
                  Tt(p, p.return, q);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, _r(e, l))));
        break;
      case 19:
        ms(t, e), xs(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, _r(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ms(t, e), xs(e);
    }
  }
  function xs(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Fd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = gr(e);
            yi(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (Fl(c, ""), l.flags &= -33);
            var d = gr(e);
            yi(e, d, c);
            break;
          case 3:
          case 4:
            var p = l.stateNode.containerInfo, z = gr(e);
            br(
              e,
              z,
              p
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (J) {
        Tt(e, e.return, J);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function nh(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        nh(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function jl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        eh(e, t.alternate, t), t = t.sibling;
  }
  function Zl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          xl(4, t, t.return), Zl(t);
          break;
        case 1:
          Ms(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && $d(
            t,
            t.return,
            l
          ), Zl(t);
          break;
        case 27:
          gn(t.stateNode);
        case 26:
        case 5:
          Ms(t, t.return), Zl(t);
          break;
        case 22:
          t.memoizedState === null && Zl(t);
          break;
        case 30:
          Zl(t);
          break;
        default:
          Zl(t);
      }
      e = e.sibling;
    }
  }
  function vl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          vl(
            n,
            i,
            l
          ), un(4, i);
          break;
        case 1:
          if (vl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              Tt(a, a.return, z);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var d = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Uo(p[n], d);
            } catch (z) {
              Tt(a, a.return, z);
            }
          }
          l && c & 64 && Kd(i), on(i, i.return);
          break;
        case 27:
          Id(i);
        case 26:
        case 5:
          vl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Wd(i), on(i, i.return);
          break;
        case 12:
          vl(
            n,
            i,
            l
          );
          break;
        case 13:
          vl(
            n,
            i,
            l
          ), l && c & 4 && lh(n, i);
          break;
        case 22:
          i.memoizedState === null && vl(
            n,
            i,
            l
          ), on(i, i.return);
          break;
        case 30:
          break;
        default:
          vl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Nr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Ka(l));
  }
  function Sr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ka(e));
  }
  function qs(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ih(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function ih(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        qs(
          e,
          t,
          l,
          a
        ), n & 2048 && un(9, t);
        break;
      case 1:
        qs(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        qs(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ka(e)));
        break;
      case 12:
        if (n & 2048) {
          qs(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, c = i.id, d = i.onPostCommit;
            typeof d == "function" && d(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (p) {
            Tt(t, t.return, p);
          }
        } else
          qs(
            e,
            t,
            l,
            a
          );
        break;
      case 13:
        qs(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? qs(
          e,
          t,
          l,
          a
        ) : dn(e, t) : i._visibility & 2 ? qs(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, ja(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && Nr(c, t);
        break;
      case 24:
        qs(
          e,
          t,
          l,
          a
        ), n & 2048 && Sr(t.alternate, t);
        break;
      default:
        qs(
          e,
          t,
          l,
          a
        );
    }
  }
  function ja(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, d = l, p = a, z = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ja(
            i,
            c,
            d,
            p,
            n
          ), un(8, c);
          break;
        case 23:
          break;
        case 22:
          var J = c.stateNode;
          c.memoizedState !== null ? J._visibility & 2 ? ja(
            i,
            c,
            d,
            p,
            n
          ) : dn(
            i,
            c
          ) : (J._visibility |= 2, ja(
            i,
            c,
            d,
            p,
            n
          )), n && z & 2048 && Nr(
            c.alternate,
            c
          );
          break;
        case 24:
          ja(
            i,
            c,
            d,
            p,
            n
          ), n && z & 2048 && Sr(c.alternate, c);
          break;
        default:
          ja(
            i,
            c,
            d,
            p,
            n
          );
      }
      t = t.sibling;
    }
  }
  function dn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            dn(l, a), n & 2048 && Nr(
              a.alternate,
              a
            );
            break;
          case 24:
            dn(l, a), n & 2048 && Sr(a.alternate, a);
            break;
          default:
            dn(l, a);
        }
        t = t.sibling;
      }
  }
  var hn = 8192;
  function va(e) {
    if (e.subtreeFlags & hn)
      for (e = e.child; e !== null; )
        ch(e), e = e.sibling;
  }
  function ch(e) {
    switch (e.tag) {
      case 26:
        va(e), e.flags & hn && e.memoizedState !== null && sj(
          Os,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        va(e);
        break;
      case 3:
      case 4:
        var t = Os;
        Os = Ui(e.stateNode.containerInfo), va(e), Os = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = hn, hn = 16777216, va(e), hn = t) : va(e));
        break;
      default:
        va(e);
    }
  }
  function rh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function fn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ft = a, oh(
            a,
            e
          );
        }
      rh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        uh(e), e = e.sibling;
  }
  function uh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        fn(e), e.flags & 2048 && xl(9, e, e.return);
        break;
      case 3:
        fn(e);
        break;
      case 12:
        fn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, _i(e)) : fn(e);
        break;
      default:
        fn(e);
    }
  }
  function _i(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ft = a, oh(
            a,
            e
          );
        }
      rh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          xl(8, t, t.return), _i(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, _i(t));
          break;
        default:
          _i(t);
      }
      e = e.sibling;
    }
  }
  function oh(e, t) {
    for (; Ft !== null; ) {
      var l = Ft;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          xl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ka(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Ft = a;
      else
        e: for (l = e; Ft !== null; ) {
          a = Ft;
          var n = a.sibling, i = a.return;
          if (th(a), a === l) {
            Ft = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Ft = n;
            break e;
          }
          Ft = i;
        }
    }
  }
  var px = {
    getCacheForType: function(e) {
      var t = ss(Kt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, gx = typeof WeakMap == "function" ? WeakMap : Map, St = 0, At = null, xt = null, pt = 0, wt = 0, js = null, pl = !1, pa = !1, wr = !1, tl = 0, Lt = 0, gl = 0, Vl = 0, kr = 0, ks = 0, ga = 0, mn = null, rs = null, Cr = !1, Er = 0, Ni = 1 / 0, Si = null, bl = null, es = 0, yl = null, ba = null, ya = 0, Or = 0, Tr = null, dh = null, xn = 0, zr = null;
  function vs() {
    if ((St & 2) !== 0 && pt !== 0)
      return pt & -pt;
    if (y.T !== null) {
      var e = ra;
      return e !== 0 ? e : Hr();
    }
    return Ot();
  }
  function hh() {
    ks === 0 && (ks = (pt & 536870912) === 0 || yt ? vt() : 536870912);
    var e = ws.current;
    return e !== null && (e.flags |= 32), ks;
  }
  function ps(e, t, l) {
    (e === At && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null) && (_a(e, 0), _l(
      e,
      pt,
      ks,
      !1
    )), ue(e, l), ((St & 2) === 0 || e !== At) && (e === At && ((St & 2) === 0 && (Vl |= l), Lt === 4 && _l(
      e,
      pt,
      ks,
      !1
    )), Hs(e));
  }
  function fh(e, t, l) {
    if ((St & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || de(e, t), n = a ? _x(e, t) : Ur(e, t, !0), i = a;
    do {
      if (n === 0) {
        pa && !a && _l(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !bx(l)) {
          n = Ur(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var c = 0;
          else
            c = e.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            e: {
              var d = e;
              n = mn;
              var p = d.current.memoizedState.isDehydrated;
              if (p && (_a(d, c).flags |= 256), c = Ur(
                d,
                c,
                !1
              ), c !== 2) {
                if (wr && !p) {
                  d.errorRecoveryDisabledLanes |= i, Vl |= i, n = 4;
                  break e;
                }
                i = rs, rs = n, i !== null && (rs === null ? rs = i : rs.push.apply(
                  rs,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          _a(e, 0), _l(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, i = n, i) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              _l(
                a,
                t,
                ks,
                !pl
              );
              break e;
            case 2:
              rs = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = Er + 300 - De(), 10 < n)) {
            if (_l(
              a,
              t,
              ks,
              !pl
            ), ge(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Gh(
              mh.bind(
                null,
                a,
                l,
                rs,
                Si,
                Cr,
                t,
                ks,
                Vl,
                ga,
                pl,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          mh(
            a,
            l,
            rs,
            Si,
            Cr,
            t,
            ks,
            Vl,
            ga,
            pl,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Hs(e);
  }
  function mh(e, t, l, a, n, i, c, d, p, z, J, ee, R, q) {
    if (e.timeoutHandle = -1, ee = t.subtreeFlags, (ee & 8192 || (ee & 16785408) === 16785408) && (_n = { stylesheets: null, count: 0, unsuspend: tj }, ch(t), ee = lj(), ee !== null)) {
      e.cancelPendingCommit = ee(
        yh.bind(
          null,
          e,
          t,
          i,
          l,
          a,
          n,
          c,
          d,
          p,
          J,
          1,
          R,
          q
        )
      ), _l(e, i, c, !z);
      return;
    }
    yh(
      e,
      t,
      i,
      l,
      a,
      n,
      c,
      d,
      p
    );
  }
  function bx(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!hs(i(), n)) return !1;
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
  function _l(e, t, l, a) {
    t &= ~kr, t &= ~Vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - lt(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && rt(e, l, t);
  }
  function wi() {
    return (St & 6) === 0 ? (jn(0), !1) : !0;
  }
  function Ar() {
    if (xt !== null) {
      if (wt === 0)
        var e = xt.return;
      else
        e = xt, Js = Ll = null, $c(e), ma = null, nn = 0, e = xt;
      for (; e !== null; )
        Jd(e.alternate, e), e = e.return;
      xt = null;
    }
  }
  function _a(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Hx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Ar(), At = e, xt = l = Qs(e.current, null), pt = t, wt = 0, js = null, pl = !1, pa = de(e, t), wr = !1, ga = ks = kr = Vl = gl = Lt = 0, rs = mn = null, Cr = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - lt(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return tl = t, Jn(), l;
  }
  function xh(e, t) {
    dt = null, y.H = hi, t === Wa || t === si ? (t = Ao(), wt = 3) : t === Oo ? (t = Ao(), wt = 4) : wt = t === Rd ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, js = t, xt === null && (Lt = 1, vi(
      e,
      ys(t, e.current)
    ));
  }
  function jh() {
    var e = y.H;
    return y.H = hi, e === null ? hi : e;
  }
  function vh() {
    var e = y.A;
    return y.A = px, e;
  }
  function Rr() {
    Lt = 4, pl || (pt & 4194048) !== pt && ws.current !== null || (pa = !0), (gl & 134217727) === 0 && (Vl & 134217727) === 0 || At === null || _l(
      At,
      pt,
      ks,
      !1
    );
  }
  function Ur(e, t, l) {
    var a = St;
    St |= 2;
    var n = jh(), i = vh();
    (At !== e || pt !== t) && (Si = null, _a(e, t)), t = !1;
    var c = Lt;
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          var d = xt, p = js;
          switch (wt) {
            case 8:
              Ar(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              ws.current === null && (t = !0);
              var z = wt;
              if (wt = 0, js = null, Na(e, d, p, z), l && pa) {
                c = 0;
                break e;
              }
              break;
            default:
              z = wt, wt = 0, js = null, Na(e, d, p, z);
          }
        }
        yx(), c = Lt;
        break;
      } catch (J) {
        xh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Js = Ll = null, St = a, y.H = n, y.A = i, xt === null && (At = null, pt = 0, Jn()), c;
  }
  function yx() {
    for (; xt !== null; ) ph(xt);
  }
  function _x(e, t) {
    var l = St;
    St |= 2;
    var a = jh(), n = vh();
    At !== e || pt !== t ? (Si = null, Ni = De() + 500, _a(e, t)) : pa = de(
      e,
      t
    );
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          t = xt;
          var i = js;
          t: switch (wt) {
            case 1:
              wt = 0, js = null, Na(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (To(i)) {
                wt = 0, js = null, gh(t);
                break;
              }
              t = function() {
                wt !== 2 && wt !== 9 || At !== e || (wt = 7), Hs(e);
              }, i.then(t, t);
              break e;
            case 3:
              wt = 7;
              break e;
            case 4:
              wt = 5;
              break e;
            case 7:
              To(i) ? (wt = 0, js = null, gh(t)) : (wt = 0, js = null, Na(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (xt.tag) {
                case 26:
                  c = xt.memoizedState;
                case 5:
                case 27:
                  var d = xt;
                  if (!c || ef(c)) {
                    wt = 0, js = null;
                    var p = d.sibling;
                    if (p !== null) xt = p;
                    else {
                      var z = d.return;
                      z !== null ? (xt = z, ki(z)) : xt = null;
                    }
                    break t;
                  }
              }
              wt = 0, js = null, Na(e, t, i, 5);
              break;
            case 6:
              wt = 0, js = null, Na(e, t, i, 6);
              break;
            case 8:
              Ar(), Lt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        Nx();
        break;
      } catch (J) {
        xh(e, J);
      }
    while (!0);
    return Js = Ll = null, y.H = a, y.A = n, St = l, xt !== null ? 0 : (At = null, pt = 0, Jn(), Lt);
  }
  function Nx() {
    for (; xt !== null && !Re(); )
      ph(xt);
  }
  function ph(e) {
    var t = Zd(e.alternate, e, tl);
    e.memoizedProps = e.pendingProps, t === null ? ki(e) : xt = t;
  }
  function gh(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Bd(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          pt
        );
        break;
      case 11:
        t = Bd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          pt
        );
        break;
      case 5:
        $c(t);
      default:
        Jd(l, t), t = xt = bo(t, tl), t = Zd(l, t, tl);
    }
    e.memoizedProps = e.pendingProps, t === null ? ki(e) : xt = t;
  }
  function Na(e, t, l, a) {
    Js = Ll = null, $c(t), ma = null, nn = 0;
    var n = t.return;
    try {
      if (hx(
        e,
        n,
        t,
        l,
        pt
      )) {
        Lt = 1, vi(
          e,
          ys(l, e.current)
        ), xt = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw xt = n, i;
      Lt = 1, vi(
        e,
        ys(l, e.current)
      ), xt = null;
      return;
    }
    t.flags & 32768 ? (yt || a === 1 ? e = !0 : pa || (pt & 536870912) !== 0 ? e = !1 : (pl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = ws.current, a !== null && a.tag === 13 && (a.flags |= 16384))), bh(t, e)) : ki(t);
  }
  function ki(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        bh(
          t,
          pl
        );
        return;
      }
      e = t.return;
      var l = mx(
        t.alternate,
        t,
        tl
      );
      if (l !== null) {
        xt = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        xt = t;
        return;
      }
      xt = t = e;
    } while (t !== null);
    Lt === 0 && (Lt = 5);
  }
  function bh(e, t) {
    do {
      var l = xx(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, xt = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        xt = e;
        return;
      }
      xt = e = l;
    } while (e !== null);
    Lt = 6, xt = null;
  }
  function yh(e, t, l, a, n, i, c, d, p) {
    e.cancelPendingCommit = null;
    do
      Ci();
    while (es !== 0);
    if ((St & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= Sc, be(
        e,
        l,
        i,
        c,
        d,
        p
      ), e === At && (xt = At = null, pt = 0), ba = t, yl = e, ya = l, Or = i, Tr = n, dh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Cx(ie, function() {
        return kh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = y.T, y.T = null, n = Q.p, Q.p = 2, c = St, St |= 4;
        try {
          jx(e, t, l);
        } finally {
          St = c, Q.p = n, y.T = a;
        }
      }
      es = 1, _h(), Nh(), Sh();
    }
  }
  function _h() {
    if (es === 1) {
      es = 0;
      var e = yl, t = ba, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          ah(t, e);
          var i = Vr, c = uo(e.containerInfo), d = i.focusedElem, p = i.selectionRange;
          if (c !== d && d && d.ownerDocument && ro(
            d.ownerDocument.documentElement,
            d
          )) {
            if (p !== null && gc(d)) {
              var z = p.start, J = p.end;
              if (J === void 0 && (J = z), "selectionStart" in d)
                d.selectionStart = z, d.selectionEnd = Math.min(
                  J,
                  d.value.length
                );
              else {
                var ee = d.ownerDocument || document, R = ee && ee.defaultView || window;
                if (R.getSelection) {
                  var q = R.getSelection(), tt = d.textContent.length, Ke = Math.min(p.start, tt), Et = p.end === void 0 ? Ke : Math.min(p.end, tt);
                  !q.extend && Ke > Et && (c = Et, Et = Ke, Ke = c);
                  var C = co(
                    d,
                    Ke
                  ), S = co(
                    d,
                    Et
                  );
                  if (C && S && (q.rangeCount !== 1 || q.anchorNode !== C.node || q.anchorOffset !== C.offset || q.focusNode !== S.node || q.focusOffset !== S.offset)) {
                    var E = ee.createRange();
                    E.setStart(C.node, C.offset), q.removeAllRanges(), Ke > Et ? (q.addRange(E), q.extend(S.node, S.offset)) : (E.setEnd(S.node, S.offset), q.addRange(E));
                  }
                }
              }
            }
            for (ee = [], q = d; q = q.parentNode; )
              q.nodeType === 1 && ee.push({
                element: q,
                left: q.scrollLeft,
                top: q.scrollTop
              });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < ee.length; d++) {
              var W = ee[d];
              W.element.scrollLeft = W.left, W.element.scrollTop = W.top;
            }
          }
          Bi = !!Zr, Vr = Zr = null;
        } finally {
          St = n, Q.p = a, y.T = l;
        }
      }
      e.current = t, es = 2;
    }
  }
  function Nh() {
    if (es === 2) {
      es = 0;
      var e = yl, t = ba, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          eh(e, t.alternate, t);
        } finally {
          St = n, Q.p = a, y.T = l;
        }
      }
      es = 3;
    }
  }
  function Sh() {
    if (es === 4 || es === 3) {
      es = 0, ke();
      var e = yl, t = ba, l = ya, a = dh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? es = 5 : (es = 0, ba = yl = null, wh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (bl = null), Ve(l), t = t.stateNode, Se && typeof Se.onCommitFiberRoot == "function")
        try {
          Se.onCommitFiberRoot(
            I,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = y.T, n = Q.p, Q.p = 2, y.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < a.length; c++) {
            var d = a[c];
            i(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          y.T = t, Q.p = n;
        }
      }
      (ya & 3) !== 0 && Ci(), Hs(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === zr ? xn++ : (xn = 0, zr = e) : xn = 0, jn(0);
    }
  }
  function wh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ka(t)));
  }
  function Ci(e) {
    return _h(), Nh(), Sh(), kh();
  }
  function kh() {
    if (es !== 5) return !1;
    var e = yl, t = Or;
    Or = 0;
    var l = Ve(ya), a = y.T, n = Q.p;
    try {
      Q.p = 32 > l ? 32 : l, y.T = null, l = Tr, Tr = null;
      var i = yl, c = ya;
      if (es = 0, ba = yl = null, ya = 0, (St & 6) !== 0) throw Error(o(331));
      var d = St;
      if (St |= 4, uh(i.current), ih(
        i,
        i.current,
        c,
        l
      ), St = d, jn(0, !1), Se && typeof Se.onPostCommitFiberRoot == "function")
        try {
          Se.onPostCommitFiberRoot(I, i);
        } catch {
        }
      return !0;
    } finally {
      Q.p = n, y.T = a, wh(e, t);
    }
  }
  function Ch(e, t, l) {
    t = ys(l, t), t = ur(e.stateNode, t, 2), e = dl(e, t, 2), e !== null && (ue(e, 2), Hs(e));
  }
  function Tt(e, t, l) {
    if (e.tag === 3)
      Ch(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ch(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (bl === null || !bl.has(a))) {
            e = ys(l, e), l = zd(2), a = dl(t, l, 2), a !== null && (Ad(
              l,
              a,
              t,
              e
            ), ue(a, 2), Hs(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Dr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new gx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (wr = !0, n.add(l), e = Sx.bind(null, e, t, l), t.then(e, e));
  }
  function Sx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, At === e && (pt & l) === l && (Lt === 4 || Lt === 3 && (pt & 62914560) === pt && 300 > De() - Er ? (St & 2) === 0 && _a(e, 0) : kr |= l, ga === pt && (ga = 0)), Hs(e);
  }
  function Eh(e, t) {
    t === 0 && (t = M()), e = aa(e, t), e !== null && (ue(e, t), Hs(e));
  }
  function wx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Eh(e, l);
  }
  function kx(e, t) {
    var l = 0;
    switch (e.tag) {
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    a !== null && a.delete(t), Eh(e, l);
  }
  function Cx(e, t) {
    return We(e, t);
  }
  var Ei = null, Sa = null, Mr = !1, Oi = !1, qr = !1, Jl = 0;
  function Hs(e) {
    e !== Sa && e.next === null && (Sa === null ? Ei = Sa = e : Sa = Sa.next = e), Oi = !0, Mr || (Mr = !0, Ox());
  }
  function jn(e, t) {
    if (!qr && Oi) {
      qr = !0;
      do
        for (var l = !1, a = Ei; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              i = (1 << 31 - lt(42 | e) + 1) - 1, i &= n & ~(c & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Ah(a, i));
          } else
            i = pt, i = ge(
              a,
              a === At ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || de(a, i) || (l = !0, Ah(a, i));
          a = a.next;
        }
      while (l);
      qr = !1;
    }
  }
  function Ex() {
    Oh();
  }
  function Oh() {
    Oi = Mr = !1;
    var e = 0;
    Jl !== 0 && (qx() && (e = Jl), Jl = 0);
    for (var t = De(), l = null, a = Ei; a !== null; ) {
      var n = a.next, i = Th(a, t);
      i === 0 ? (a.next = null, l === null ? Ei = n : l.next = n, n === null && (Sa = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (Oi = !0)), a = n;
    }
    jn(e);
  }
  function Th(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - lt(i), d = 1 << c, p = n[c];
      p === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Qe(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = At, l = pt, l = ge(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Ue(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || de(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Ue(a), Ve(l)) {
        case 2:
        case 8:
          l = ht;
          break;
        case 32:
          l = ie;
          break;
        case 268435456:
          l = He;
          break;
        default:
          l = ie;
      }
      return a = zh.bind(null, e), l = We(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Ue(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function zh(e, t) {
    if (es !== 0 && es !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ci() && e.callbackNode !== l)
      return null;
    var a = pt;
    return a = ge(
      e,
      e === At ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (fh(e, a, t), Th(e, De()), e.callbackNode != null && e.callbackNode === l ? zh.bind(null, e) : null);
  }
  function Ah(e, t) {
    if (Ci()) return null;
    fh(e, t, !0);
  }
  function Ox() {
    Bx(function() {
      (St & 6) !== 0 ? We(
        et,
        Ex
      ) : Oh();
    });
  }
  function Hr() {
    return Jl === 0 && (Jl = vt()), Jl;
  }
  function Rh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ln("" + e);
  }
  function Uh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Tx(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Rh(
        (n[Nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Nt] || null) ? Rh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var d = new Qn(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: d,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Jl !== 0) {
                  var p = c ? Uh(n, c) : new FormData(n);
                  ar(
                    l,
                    {
                      pending: !0,
                      data: p,
                      method: n.method,
                      action: i
                    },
                    null,
                    p
                  );
                }
              } else
                typeof i == "function" && (d.preventDefault(), p = c ? Uh(n, c) : new FormData(n), ar(
                  l,
                  {
                    pending: !0,
                    data: p,
                    method: n.method,
                    action: i
                  },
                  i,
                  p
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Br = 0; Br < Nc.length; Br++) {
    var Lr = Nc[Br], zx = Lr.toLowerCase(), Ax = Lr[0].toUpperCase() + Lr.slice(1);
    Es(
      zx,
      "on" + Ax
    );
  }
  Es(fo, "onAnimationEnd"), Es(mo, "onAnimationIteration"), Es(xo, "onAnimationStart"), Es("dblclick", "onDoubleClick"), Es("focusin", "onFocus"), Es("focusout", "onBlur"), Es($m, "onTransitionRun"), Es(Wm, "onTransitionStart"), Es(Fm, "onTransitionCancel"), Es(jo, "onTransitionEnd"), zt("onMouseEnter", ["mouseout", "mouseover"]), zt("onMouseLeave", ["mouseout", "mouseover"]), zt("onPointerEnter", ["pointerout", "pointerover"]), zt("onPointerLeave", ["pointerout", "pointerover"]), mt(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), mt(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), mt("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), mt(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), mt(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), mt(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var vn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Rx = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(vn)
  );
  function Dh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var d = a[c], p = d.instance, z = d.currentTarget;
            if (d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = z;
            try {
              i(n);
            } catch (J) {
              ji(J);
            }
            n.currentTarget = null, i = p;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (d = a[c], p = d.instance, z = d.currentTarget, d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = z;
            try {
              i(n);
            } catch (J) {
              ji(J);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function jt(e, t) {
    var l = t[Ne];
    l === void 0 && (l = t[Ne] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Mh(t, e, 2, !1), l.add(a));
  }
  function Yr(e, t, l) {
    var a = 0;
    t && (a |= 4), Mh(
      l,
      e,
      a,
      t
    );
  }
  var Ti = "_reactListening" + Math.random().toString(36).slice(2);
  function Gr(e) {
    if (!e[Ti]) {
      e[Ti] = !0, G.forEach(function(l) {
        l !== "selectionchange" && (Rx.has(l) || Yr(l, !1, e), Yr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ti] || (t[Ti] = !0, Yr("selectionchange", !1, t));
    }
  }
  function Mh(e, t, l, a) {
    switch (cf(t)) {
      case 2:
        var n = ij;
        break;
      case 8:
        n = cj;
        break;
      default:
        n = su;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !oc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Xr(e, t, l, a, n) {
    var i = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var d = a.stateNode.containerInfo;
          if (d === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var p = c.tag;
              if ((p === 3 || p === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; d !== null; ) {
            if (c = at(d), c === null) return;
            if (p = c.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              a = i = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        a = a.return;
      }
    Gu(function() {
      var z = i, J = rc(l), ee = [];
      e: {
        var R = vo.get(e);
        if (R !== void 0) {
          var q = Qn, tt = e;
          switch (e) {
            case "keypress":
              if (Gn(l) === 0) break e;
            case "keydown":
            case "keyup":
              q = Cm;
              break;
            case "focusin":
              tt = "focus", q = mc;
              break;
            case "focusout":
              tt = "blur", q = mc;
              break;
            case "beforeblur":
            case "afterblur":
              q = mc;
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
              q = Zu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              q = xm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              q = Tm;
              break;
            case fo:
            case mo:
            case xo:
              q = pm;
              break;
            case jo:
              q = Am;
              break;
            case "scroll":
            case "scrollend":
              q = fm;
              break;
            case "wheel":
              q = Um;
              break;
            case "copy":
            case "cut":
            case "paste":
              q = bm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              q = Ju;
              break;
            case "toggle":
            case "beforetoggle":
              q = Mm;
          }
          var Ke = (t & 4) !== 0, Et = !Ke && (e === "scroll" || e === "scrollend"), C = Ke ? R !== null ? R + "Capture" : null : R;
          Ke = [];
          for (var S = z, E; S !== null; ) {
            var W = S;
            if (E = W.stateNode, W = W.tag, W !== 5 && W !== 26 && W !== 27 || E === null || C === null || (W = Da(S, C), W != null && Ke.push(
              pn(S, W, E)
            )), Et) break;
            S = S.return;
          }
          0 < Ke.length && (R = new q(
            R,
            tt,
            null,
            l,
            J
          ), ee.push({ event: R, listeners: Ke }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", q = e === "mouseout" || e === "pointerout", R && l !== cc && (tt = l.relatedTarget || l.fromElement) && (at(tt) || tt[g]))
            break e;
          if ((q || R) && (R = J.window === J ? J : (R = J.ownerDocument) ? R.defaultView || R.parentWindow : window, q ? (tt = l.relatedTarget || l.toElement, q = z, tt = tt ? at(tt) : null, tt !== null && (Et = U(tt), Ke = tt.tag, tt !== Et || Ke !== 5 && Ke !== 27 && Ke !== 6) && (tt = null)) : (q = null, tt = z), q !== tt)) {
            if (Ke = Zu, W = "onMouseLeave", C = "onMouseEnter", S = "mouse", (e === "pointerout" || e === "pointerover") && (Ke = Ju, W = "onPointerLeave", C = "onPointerEnter", S = "pointer"), Et = q == null ? R : us(q), E = tt == null ? R : us(tt), R = new Ke(
              W,
              S + "leave",
              q,
              l,
              J
            ), R.target = Et, R.relatedTarget = E, W = null, at(J) === z && (Ke = new Ke(
              C,
              S + "enter",
              tt,
              l,
              J
            ), Ke.target = E, Ke.relatedTarget = Et, W = Ke), Et = W, q && tt)
              t: {
                for (Ke = q, C = tt, S = 0, E = Ke; E; E = wa(E))
                  S++;
                for (E = 0, W = C; W; W = wa(W))
                  E++;
                for (; 0 < S - E; )
                  Ke = wa(Ke), S--;
                for (; 0 < E - S; )
                  C = wa(C), E--;
                for (; S--; ) {
                  if (Ke === C || C !== null && Ke === C.alternate)
                    break t;
                  Ke = wa(Ke), C = wa(C);
                }
                Ke = null;
              }
            else Ke = null;
            q !== null && qh(
              ee,
              R,
              q,
              Ke,
              !1
            ), tt !== null && Et !== null && qh(
              ee,
              Et,
              tt,
              Ke,
              !0
            );
          }
        }
        e: {
          if (R = z ? us(z) : window, q = R.nodeName && R.nodeName.toLowerCase(), q === "select" || q === "input" && R.type === "file")
            var qe = to;
          else if (Pu(R))
            if (so)
              qe = Vm;
            else {
              qe = Qm;
              var ft = Xm;
            }
          else
            q = R.nodeName, !q || q.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? z && ic(z.elementType) && (qe = to) : qe = Zm;
          if (qe && (qe = qe(e, z))) {
            eo(
              ee,
              qe,
              l,
              J
            );
            break e;
          }
          ft && ft(e, R, z), e === "focusout" && z && R.type === "number" && z.memoizedProps.value != null && nc(R, "number", R.value);
        }
        switch (ft = z ? us(z) : window, e) {
          case "focusin":
            (Pu(ft) || ft.contentEditable === "true") && (ta = ft, bc = z, Xa = null);
            break;
          case "focusout":
            Xa = bc = ta = null;
            break;
          case "mousedown":
            yc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            yc = !1, oo(ee, l, J);
            break;
          case "selectionchange":
            if (Km) break;
          case "keydown":
          case "keyup":
            oo(ee, l, J);
        }
        var Le;
        if (jc)
          e: {
            switch (e) {
              case "compositionstart":
                var Ie = "onCompositionStart";
                break e;
              case "compositionend":
                Ie = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ie = "onCompositionUpdate";
                break e;
            }
            Ie = void 0;
          }
        else
          ea ? Fu(e, l) && (Ie = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Ie = "onCompositionStart");
        Ie && (Ku && l.locale !== "ko" && (ea || Ie !== "onCompositionStart" ? Ie === "onCompositionEnd" && ea && (Le = Xu()) : (cl = J, dc = "value" in cl ? cl.value : cl.textContent, ea = !0)), ft = zi(z, Ie), 0 < ft.length && (Ie = new Vu(
          Ie,
          e,
          null,
          l,
          J
        ), ee.push({ event: Ie, listeners: ft }), Le ? Ie.data = Le : (Le = Iu(l), Le !== null && (Ie.data = Le)))), (Le = Hm ? Bm(e, l) : Lm(e, l)) && (Ie = zi(z, "onBeforeInput"), 0 < Ie.length && (ft = new Vu(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), ee.push({
          event: ft,
          listeners: Ie
        }), ft.data = Le)), Tx(
          ee,
          e,
          z,
          l,
          J
        );
      }
      Dh(ee, t);
    });
  }
  function pn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function zi(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = Da(e, l), n != null && a.unshift(
        pn(e, n, i)
      ), n = Da(e, t), n != null && a.push(
        pn(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function wa(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function qh(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var d = l, p = d.alternate, z = d.stateNode;
      if (d = d.tag, p !== null && p === a) break;
      d !== 5 && d !== 26 && d !== 27 || z === null || (p = z, n ? (z = Da(l, i), z != null && c.unshift(
        pn(l, z, p)
      )) : n || (z = Da(l, i), z != null && c.push(
        pn(l, z, p)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Ux = /\r\n?/g, Dx = /\u0000|\uFFFD/g;
  function Hh(e) {
    return (typeof e == "string" ? e : "" + e).replace(Ux, `
`).replace(Dx, "");
  }
  function Bh(e, t) {
    return t = Hh(t), Hh(e) === t;
  }
  function Ai() {
  }
  function Ct(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Fl(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Fl(e, "" + a);
        break;
      case "className":
        qn(e, "class", a);
        break;
      case "tabIndex":
        qn(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        qn(e, l, a);
        break;
      case "style":
        Lu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          qn(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ln("" + a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (l === "formAction" ? (t !== "input" && Ct(e, t, "name", n.name, n, null), Ct(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ct(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ct(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ct(e, t, "encType", n.encType, n, null), Ct(e, t, "method", n.method, n, null), Ct(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ln("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Ai);
        break;
      case "onScroll":
        a != null && jt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && jt("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(o(60));
            e.innerHTML = l;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
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
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = Ln("" + a), e.setAttributeNS(
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
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "" + a) : e.removeAttribute(l);
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
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        jt("beforetoggle", e), jt("toggle", e), Ys(e, "popover", a);
        break;
      case "xlinkActuate":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Gs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Gs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Gs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Gs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Ys(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = dm.get(l) || l, Ys(e, l, a));
    }
  }
  function Qr(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Lu(e, a, i);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(o(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Fl(e, a) : (typeof a == "number" || typeof a == "bigint") && Fl(e, "" + a);
        break;
      case "onScroll":
        a != null && jt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && jt("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Ai);
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
        if (!Be.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[Nt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Ys(e, l, a);
          }
    }
  }
  function ts(e, t, l) {
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
        jt("error", e), jt("load", e);
        var a = !1, n = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var c = l[i];
            if (c != null)
              switch (i) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Ct(e, t, i, c, l, null);
              }
          }
        n && Ct(e, t, "srcSet", l.srcSet, l, null), a && Ct(e, t, "src", l.src, l, null);
        return;
      case "input":
        jt("invalid", e);
        var d = i = c = n = null, p = null, z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var J = l[a];
            if (J != null)
              switch (a) {
                case "name":
                  n = J;
                  break;
                case "type":
                  c = J;
                  break;
                case "checked":
                  p = J;
                  break;
                case "defaultChecked":
                  z = J;
                  break;
                case "value":
                  i = J;
                  break;
                case "defaultValue":
                  d = J;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (J != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ct(e, t, a, J, l, null);
              }
          }
        Mu(
          e,
          i,
          d,
          p,
          z,
          c,
          n,
          !1
        ), Hn(e);
        return;
      case "select":
        jt("invalid", e), a = c = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (d = l[n], d != null))
            switch (n) {
              case "value":
                i = d;
                break;
              case "defaultValue":
                c = d;
                break;
              case "multiple":
                a = d;
              default:
                Ct(e, t, n, d, l, null);
            }
        t = i, l = c, e.multiple = !!a, t != null ? Wl(e, !!a, t, !1) : l != null && Wl(e, !!a, l, !0);
        return;
      case "textarea":
        jt("invalid", e), i = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (d = l[c], d != null))
            switch (c) {
              case "value":
                a = d;
                break;
              case "defaultValue":
                n = d;
                break;
              case "children":
                i = d;
                break;
              case "dangerouslySetInnerHTML":
                if (d != null) throw Error(o(91));
                break;
              default:
                Ct(e, t, c, d, l, null);
            }
        Hu(e, a, n, i), Hn(e);
        return;
      case "option":
        for (p in l)
          if (l.hasOwnProperty(p) && (a = l[p], a != null))
            switch (p) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ct(e, t, p, a, l, null);
            }
        return;
      case "dialog":
        jt("beforetoggle", e), jt("toggle", e), jt("cancel", e), jt("close", e);
        break;
      case "iframe":
      case "object":
        jt("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < vn.length; a++)
          jt(vn[a], e);
        break;
      case "image":
        jt("error", e), jt("load", e);
        break;
      case "details":
        jt("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        jt("error", e), jt("load", e);
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
        for (z in l)
          if (l.hasOwnProperty(z) && (a = l[z], a != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ct(e, t, z, a, l, null);
            }
        return;
      default:
        if (ic(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Qr(
              e,
              t,
              J,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (d in l)
      l.hasOwnProperty(d) && (a = l[d], a != null && Ct(e, t, d, a, l, null));
  }
  function Mx(e, t, l, a) {
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
        var n = null, i = null, c = null, d = null, p = null, z = null, J = null;
        for (q in l) {
          var ee = l[q];
          if (l.hasOwnProperty(q) && ee != null)
            switch (q) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                p = ee;
              default:
                a.hasOwnProperty(q) || Ct(e, t, q, null, a, ee);
            }
        }
        for (var R in a) {
          var q = a[R];
          if (ee = l[R], a.hasOwnProperty(R) && (q != null || ee != null))
            switch (R) {
              case "type":
                i = q;
                break;
              case "name":
                n = q;
                break;
              case "checked":
                z = q;
                break;
              case "defaultChecked":
                J = q;
                break;
              case "value":
                c = q;
                break;
              case "defaultValue":
                d = q;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (q != null)
                  throw Error(o(137, t));
                break;
              default:
                q !== ee && Ct(
                  e,
                  t,
                  R,
                  q,
                  a,
                  ee
                );
            }
        }
        ac(
          e,
          c,
          d,
          p,
          z,
          J,
          i,
          n
        );
        return;
      case "select":
        q = c = d = R = null;
        for (i in l)
          if (p = l[i], l.hasOwnProperty(i) && p != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                q = p;
              default:
                a.hasOwnProperty(i) || Ct(
                  e,
                  t,
                  i,
                  null,
                  a,
                  p
                );
            }
        for (n in a)
          if (i = a[n], p = l[n], a.hasOwnProperty(n) && (i != null || p != null))
            switch (n) {
              case "value":
                R = i;
                break;
              case "defaultValue":
                d = i;
                break;
              case "multiple":
                c = i;
              default:
                i !== p && Ct(
                  e,
                  t,
                  n,
                  i,
                  a,
                  p
                );
            }
        t = d, l = c, a = q, R != null ? Wl(e, !!l, R, !1) : !!a != !!l && (t != null ? Wl(e, !!l, t, !0) : Wl(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        q = R = null;
        for (d in l)
          if (n = l[d], l.hasOwnProperty(d) && n != null && !a.hasOwnProperty(d))
            switch (d) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ct(e, t, d, null, a, n);
            }
        for (c in a)
          if (n = a[c], i = l[c], a.hasOwnProperty(c) && (n != null || i != null))
            switch (c) {
              case "value":
                R = n;
                break;
              case "defaultValue":
                q = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== i && Ct(e, t, c, n, a, i);
            }
        qu(e, R, q);
        return;
      case "option":
        for (var tt in l)
          if (R = l[tt], l.hasOwnProperty(tt) && R != null && !a.hasOwnProperty(tt))
            switch (tt) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ct(
                  e,
                  t,
                  tt,
                  null,
                  a,
                  R
                );
            }
        for (p in a)
          if (R = a[p], q = l[p], a.hasOwnProperty(p) && R !== q && (R != null || q != null))
            switch (p) {
              case "selected":
                e.selected = R && typeof R != "function" && typeof R != "symbol";
                break;
              default:
                Ct(
                  e,
                  t,
                  p,
                  R,
                  a,
                  q
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
        for (var Ke in l)
          R = l[Ke], l.hasOwnProperty(Ke) && R != null && !a.hasOwnProperty(Ke) && Ct(e, t, Ke, null, a, R);
        for (z in a)
          if (R = a[z], q = l[z], a.hasOwnProperty(z) && R !== q && (R != null || q != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(o(137, t));
                break;
              default:
                Ct(
                  e,
                  t,
                  z,
                  R,
                  a,
                  q
                );
            }
        return;
      default:
        if (ic(t)) {
          for (var Et in l)
            R = l[Et], l.hasOwnProperty(Et) && R !== void 0 && !a.hasOwnProperty(Et) && Qr(
              e,
              t,
              Et,
              void 0,
              a,
              R
            );
          for (J in a)
            R = a[J], q = l[J], !a.hasOwnProperty(J) || R === q || R === void 0 && q === void 0 || Qr(
              e,
              t,
              J,
              R,
              a,
              q
            );
          return;
        }
    }
    for (var C in l)
      R = l[C], l.hasOwnProperty(C) && R != null && !a.hasOwnProperty(C) && Ct(e, t, C, null, a, R);
    for (ee in a)
      R = a[ee], q = l[ee], !a.hasOwnProperty(ee) || R === q || R == null && q == null || Ct(e, t, ee, R, a, q);
  }
  var Zr = null, Vr = null;
  function Ri(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Lh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Yh(e, t) {
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
  function Jr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Kr = null;
  function qx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Kr ? !1 : (Kr = e, !0) : (Kr = null, !1);
  }
  var Gh = typeof setTimeout == "function" ? setTimeout : void 0, Hx = typeof clearTimeout == "function" ? clearTimeout : void 0, Xh = typeof Promise == "function" ? Promise : void 0, Bx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xh < "u" ? function(e) {
    return Xh.resolve(null).then(e).catch(Lx);
  } : Gh;
  function Lx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Nl(e) {
    return e === "head";
  }
  function Qh(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var c = e.ownerDocument;
            if (l & 1 && gn(c.documentElement), l & 2 && gn(c.body), l & 4)
              for (l = c.head, gn(l), c = l.firstChild; c; ) {
                var d = c.nextSibling, p = c.nodeName;
                c[Oe] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = d;
              }
          }
          if (n === 0) {
            e.removeChild(i), Cn(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    Cn(t);
  }
  function $r(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          $r(l), Te(l);
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
  function Yx(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Oe])
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
      if (e = Ts(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Gx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ts(e.nextSibling), e === null)) return null;
    return e;
  }
  function Wr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Xx(e, t) {
    var l = e.ownerDocument;
    if (e.data !== "$?" || l.readyState === "complete")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Ts(e) {
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
  var Fr = null;
  function Zh(e) {
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
  function Vh(e, t, l) {
    switch (t = Ri(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(o(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(o(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function gn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Te(e);
  }
  var Cs = /* @__PURE__ */ new Map(), Jh = /* @__PURE__ */ new Set();
  function Ui(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var sl = Q.d;
  Q.d = {
    f: Qx,
    r: Zx,
    D: Vx,
    C: Jx,
    L: Kx,
    m: $x,
    X: Fx,
    S: Wx,
    M: Ix
  };
  function Qx() {
    var e = sl.f(), t = wi();
    return e || t;
  }
  function Zx(e) {
    var t = Ht(e);
    t !== null && t.tag === 5 && t.type === "form" ? fd(t) : sl.r(e);
  }
  var ka = typeof document > "u" ? null : document;
  function Kh(e, t, l) {
    var a = ka;
    if (a && typeof t == "string" && t) {
      var n = bs(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Jh.has(n) || (Jh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ts(t, "link", e), f(t), a.head.appendChild(t)));
    }
  }
  function Vx(e) {
    sl.D(e), Kh("dns-prefetch", e, null);
  }
  function Jx(e, t) {
    sl.C(e, t), Kh("preconnect", e, t);
  }
  function Kx(e, t, l) {
    sl.L(e, t, l);
    var a = ka;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + bs(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + bs(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + bs(
        l.imageSizes
      ) + '"]')) : n += '[href="' + bs(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Ca(e);
          break;
        case "script":
          i = Ea(e);
      }
      Cs.has(i) || (e = D(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Cs.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(bn(i)) || t === "script" && a.querySelector(yn(i)) || (t = a.createElement("link"), ts(t, "link", e), f(t), a.head.appendChild(t)));
    }
  }
  function $x(e, t) {
    sl.m(e, t);
    var l = ka;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + bs(a) + '"][href="' + bs(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Ea(e);
      }
      if (!Cs.has(i) && (e = D({ rel: "modulepreload", href: e }, t), Cs.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(yn(i)))
              return;
        }
        a = l.createElement("link"), ts(a, "link", e), f(a), l.head.appendChild(a);
      }
    }
  }
  function Wx(e, t, l) {
    sl.S(e, t, l);
    var a = ka;
    if (a && e) {
      var n = os(a).hoistableStyles, i = Ca(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          bn(i)
        ))
          d.loading = 5;
        else {
          e = D(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Cs.get(i)) && Ir(e, l);
          var p = c = a.createElement("link");
          f(p), ts(p, "link", e), p._p = new Promise(function(z, J) {
            p.onload = z, p.onerror = J;
          }), p.addEventListener("load", function() {
            d.loading |= 1;
          }), p.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Di(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: d
        }, n.set(i, c);
      }
    }
  }
  function Fx(e, t) {
    sl.X(e, t);
    var l = ka;
    if (l && e) {
      var a = os(l).hoistableScripts, n = Ea(e), i = a.get(n);
      i || (i = l.querySelector(yn(n)), i || (e = D({ src: e, async: !0 }, t), (t = Cs.get(n)) && Pr(e, t), i = l.createElement("script"), f(i), ts(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Ix(e, t) {
    sl.M(e, t);
    var l = ka;
    if (l && e) {
      var a = os(l).hoistableScripts, n = Ea(e), i = a.get(n);
      i || (i = l.querySelector(yn(n)), i || (e = D({ src: e, async: !0, type: "module" }, t), (t = Cs.get(n)) && Pr(e, t), i = l.createElement("script"), f(i), ts(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function $h(e, t, l, a) {
    var n = (n = $.current) ? Ui(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Ca(l.href), l = os(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Ca(l.href);
          var i = os(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            bn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), Cs.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Cs.set(e, l), i || Px(
            n,
            e,
            l,
            c.state
          ))), t && a === null)
            throw Error(o(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ea(l), l = os(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function Ca(e) {
    return 'href="' + bs(e) + '"';
  }
  function bn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Wh(e) {
    return D({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Px(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), ts(t, "link", l), f(t), e.head.appendChild(t));
  }
  function Ea(e) {
    return '[src="' + bs(e) + '"]';
  }
  function yn(e) {
    return "script[async]" + e;
  }
  function Fh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + bs(l.href) + '"]'
          );
          if (a)
            return t.instance = a, f(a), a;
          var n = D({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), f(a), ts(a, "style", n), Di(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Ca(l.href);
          var i = e.querySelector(
            bn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, f(i), i;
          a = Wh(l), (n = Cs.get(n)) && Ir(a, n), i = (e.ownerDocument || e).createElement("link"), f(i);
          var c = i;
          return c._p = new Promise(function(d, p) {
            c.onload = d, c.onerror = p;
          }), ts(i, "link", a), t.state.loading |= 4, Di(i, l.precedence, e), t.instance = i;
        case "script":
          return i = Ea(l.src), (n = e.querySelector(
            yn(i)
          )) ? (t.instance = n, f(n), n) : (a = l, (n = Cs.get(i)) && (a = D({}, l), Pr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), f(n), ts(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Di(a, l.precedence, e));
    return t.instance;
  }
  function Di(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Ir(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Pr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Mi = null;
  function Ih(e, t, l) {
    if (Mi === null) {
      var a = /* @__PURE__ */ new Map(), n = Mi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Mi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[Oe] || i[ot] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var d = a.get(c);
        d ? d.push(i) : a.set(c, [i]);
      }
    }
    return a;
  }
  function Ph(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function ej(e, t, l) {
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
  function ef(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var _n = null;
  function tj() {
  }
  function sj(e, t, l) {
    if (_n === null) throw Error(o(475));
    var a = _n;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = Ca(l.href), i = e.querySelector(
          bn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = qi.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, f(i);
          return;
        }
        i = e.ownerDocument || e, l = Wh(l), (n = Cs.get(n)) && Ir(l, n), i = i.createElement("link"), f(i);
        var c = i;
        c._p = new Promise(function(d, p) {
          c.onload = d, c.onerror = p;
        }), ts(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = qi.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function lj() {
    if (_n === null) throw Error(o(475));
    var e = _n;
    return e.stylesheets && e.count === 0 && eu(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && eu(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function qi() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) eu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Hi = null;
  function eu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Hi = /* @__PURE__ */ new Map(), t.forEach(aj, e), Hi = null, qi.call(e));
  }
  function aj(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Hi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Hi.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = qi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Nn = {
    $$typeof: F,
    Provider: null,
    Consumer: null,
    _currentValue: le,
    _currentValue2: le,
    _threadCount: 0
  };
  function nj(e, t, l, a, n, i, c, d) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = j(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = j(0), this.hiddenUpdates = j(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = d, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function tf(e, t, l, a, n, i, c, d, p, z, J, ee) {
    return e = new nj(
      e,
      t,
      l,
      c,
      d,
      p,
      z,
      ee
    ), t = 1, i === !0 && (t |= 24), i = fs(3, null, null, t), e.current = i, i.stateNode = e, t = Dc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Bc(i), e;
  }
  function sf(e) {
    return e ? (e = na, e) : na;
  }
  function lf(e, t, l, a, n, i) {
    n = sf(n), a.context === null ? a.context = n : a.pendingContext = n, a = ol(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = dl(e, a, t), l !== null && (ps(l, e, t), Ia(l, e, t));
  }
  function af(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function tu(e, t) {
    af(e, t), (e = e.alternate) && af(e, t);
  }
  function nf(e) {
    if (e.tag === 13) {
      var t = aa(e, 67108864);
      t !== null && ps(t, e, 67108864), tu(e, 67108864);
    }
  }
  var Bi = !0;
  function ij(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 2, su(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function cj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 8, su(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function su(e, t, l, a) {
    if (Bi) {
      var n = lu(a);
      if (n === null)
        Xr(
          e,
          t,
          a,
          Li,
          l
        ), rf(e, a);
      else if (uj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (rf(e, a), t & 4 && -1 < rj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Ht(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = b(i.pendingLanes);
                  if (c !== 0) {
                    var d = i;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; c; ) {
                      var p = 1 << 31 - lt(c);
                      d.entanglements[1] |= p, c &= ~p;
                    }
                    Hs(i), (St & 6) === 0 && (Ni = De() + 500, jn(0));
                  }
                }
                break;
              case 13:
                d = aa(i, 2), d !== null && ps(d, i, 2), wi(), tu(i, 2);
            }
          if (i = lu(a), i === null && Xr(
            e,
            t,
            a,
            Li,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Xr(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function lu(e) {
    return e = rc(e), au(e);
  }
  var Li = null;
  function au(e) {
    if (Li = null, e = at(e), e !== null) {
      var t = U(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = V(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Li = e, null;
  }
  function cf(e) {
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
        switch (st()) {
          case et:
            return 2;
          case ht:
            return 8;
          case ie:
          case nt:
            return 32;
          case He:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var nu = !1, Sl = null, wl = null, kl = null, Sn = /* @__PURE__ */ new Map(), wn = /* @__PURE__ */ new Map(), Cl = [], rj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function rf(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Sl = null;
        break;
      case "dragenter":
      case "dragleave":
        wl = null;
        break;
      case "mouseover":
      case "mouseout":
        kl = null;
        break;
      case "pointerover":
      case "pointerout":
        Sn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        wn.delete(t.pointerId);
    }
  }
  function kn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Ht(t), t !== null && nf(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function uj(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Sl = kn(
          Sl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return wl = kn(
          wl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return kl = kn(
          kl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return Sn.set(
          i,
          kn(
            Sn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, wn.set(
          i,
          kn(
            wn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function uf(e) {
    var t = at(e.target);
    if (t !== null) {
      var l = U(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, qt(e.priority, function() {
              if (l.tag === 13) {
                var a = vs();
                a = me(a);
                var n = aa(l, a);
                n !== null && ps(n, l, a), tu(l, a);
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
  function Yi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = lu(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        cc = a, l.target.dispatchEvent(a), cc = null;
      } else
        return t = Ht(l), t !== null && nf(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function of(e, t, l) {
    Yi(e) && l.delete(t);
  }
  function oj() {
    nu = !1, Sl !== null && Yi(Sl) && (Sl = null), wl !== null && Yi(wl) && (wl = null), kl !== null && Yi(kl) && (kl = null), Sn.forEach(of), wn.forEach(of);
  }
  function Gi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, nu || (nu = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      oj
    )));
  }
  var Xi = null;
  function df(e) {
    Xi !== e && (Xi = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Xi === e && (Xi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (au(a || l) === null)
              continue;
            break;
          }
          var i = Ht(l);
          i !== null && (e.splice(t, 3), t -= 3, ar(
            i,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function Cn(e) {
    function t(p) {
      return Gi(p, e);
    }
    Sl !== null && Gi(Sl, e), wl !== null && Gi(wl, e), kl !== null && Gi(kl, e), Sn.forEach(t), wn.forEach(t);
    for (var l = 0; l < Cl.length; l++) {
      var a = Cl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Cl.length && (l = Cl[0], l.blockedOn === null); )
      uf(l), l.blockedOn === null && Cl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[Nt] || null;
        if (typeof i == "function")
          c || df(l);
        else if (c) {
          var d = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[Nt] || null)
              d = c.formAction;
            else if (au(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), df(l);
        }
      }
  }
  function iu(e) {
    this._internalRoot = e;
  }
  Qi.prototype.render = iu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = vs();
    lf(l, a, e, t, null, null);
  }, Qi.prototype.unmount = iu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      lf(e.current, 2, null, e, null, null), wi(), t[g] = null;
    }
  };
  function Qi(e) {
    this._internalRoot = e;
  }
  Qi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ot();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Cl.length && t !== 0 && t < Cl[l].priority; l++) ;
      Cl.splice(l, 0, e), l === 0 && uf(e);
    }
  };
  var hf = h.version;
  if (hf !== "19.1.0")
    throw Error(
      o(
        527,
        hf,
        "19.1.0"
      )
    );
  Q.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = Y(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var dj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: y,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Zi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Zi.isDisabled && Zi.supportsFiber)
      try {
        I = Zi.inject(
          dj
        ), Se = Zi;
      } catch {
      }
  }
  return On.createRoot = function(e, t) {
    if (!T(e)) throw Error(o(299));
    var l = !1, a = "", n = Cd, i = Ed, c = Od, d = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (d = t.unstable_transitionCallbacks)), t = tf(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      n,
      i,
      c,
      d,
      null
    ), e[g] = t.current, Gr(e), new iu(t);
  }, On.hydrateRoot = function(e, t, l) {
    if (!T(e)) throw Error(o(299));
    var a = !1, n = "", i = Cd, c = Ed, d = Od, p = null, z = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (d = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (p = l.unstable_transitionCallbacks), l.formState !== void 0 && (z = l.formState)), t = tf(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      i,
      c,
      d,
      p,
      z
    ), t.context = sf(null), l = t.current, a = vs(), a = me(a), n = ol(a), n.callback = null, dl(l, n, a), l = a, t.current.lanes = l, ue(t, l), Hs(t), e[g] = t.current, Gr(e), new Qi(t);
  }, On.version = "19.1.0", On;
}
var _f;
function yj() {
  if (_f) return ru.exports;
  _f = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), ru.exports = bj(), ru.exports;
}
var _j = yj(), r = Ou();
const fu = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function Nj({ api: u, projects: h }) {
  var $e;
  const [N, o] = r.useState((($e = h[0]) == null ? void 0 : $e.id) || ""), [T, U] = r.useState([]), [V, A] = r.useState("general_inspection"), [Y, v] = r.useState("现场质量安全检查"), [D, K] = r.useState("general,通用施工检查"), [k, se] = r.useState(fu.map((X) => X[0])), [je, ye] = r.useState(!1), [_e, Ce] = r.useState(!1), [xe, F] = r.useState(""), [he, ae] = r.useState(""), [H, ve] = r.useState(0), Ae = h.find((X) => X.id === N), Ge = Ae != null && Ae.permissions ? Ae.permissions.includes("knowledge.process") : Ae == null ? void 0 : Ae.can_run, Ze = Ae != null && Ae.permissions ? Ae.permissions.includes("knowledge.review") : Ae == null ? void 0 : Ae.can_manage;
  r.useEffect(() => {
    let X = !1;
    return U([]), F(""), N && u(`/scenes?project_id=${encodeURIComponent(N)}`).then((fe) => {
      X || U(fe.items);
    }).catch((fe) => {
      X || F(fe.message);
    }), () => {
      X = !0;
    };
  }, [N, H]);
  const Xe = async (X) => {
    Ce(!0), F(""), ae("");
    try {
      await X(), ve((fe) => fe + 1);
    } catch (fe) {
      F(fe.message);
    } finally {
      Ce(!1);
    }
  }, pe = (X) => {
    A(X.code), v(X.payload.name), K(X.payload.categories.map((fe) => fe.code + "," + fe.name).join(`
`)), se(X.payload.steps.map((fe) => fe.event_type)), ye(X.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      xe && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: xe }),
      he && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: he }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: N, onChange: (X) => o(X.target.value), children: h.map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
      ] }),
      Ge && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: V, onChange: (X) => A(X.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: Y, onChange: (X) => v(X.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: D, onChange: (X) => K(X.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          fu.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(X[0]), onChange: (fe) => se((y) => fe.target.checked ? [...y, X[0]] : y.filter((Q) => Q !== X[0])) }),
            X[1]
          ] }, X[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: je, onChange: (X) => ye(X.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: _e || !N || !k.length, onClick: () => void Xe(async () => {
          const X = T.filter((y) => y.code === V).sort((y, Q) => Q.version - y.version)[0], fe = D.split(`
`).filter((y) => y.trim()).map((y) => {
            const [Q, le] = y.split(/[,，]/);
            if (!(Q != null && Q.trim()) || !(le != null && le.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const we = X == null ? void 0 : X.payload.categories.find((m) => m.code === Q.trim());
            return { code: Q.trim(), name: le.trim(), focus: (we == null ? void 0 : we.focus) || "", keywords: (we == null ? void 0 : we.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: N, code: V, expected_version: (X == null ? void 0 : X.version) || 0, payload: { name: Y, categories: fe, steps: fu.filter((y) => k.includes(y[0])).map((y) => ({ event_type: y[0], name: y[1], scope: y[2] })), compare_deadline: je } }) }), ae("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      T.map((X) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          X.payload.name,
          " · v",
          X.version,
          X.active ? " · 已启用" : ""
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          X.code,
          " · ",
          X.payload.categories.length,
          "项分类 · ",
          X.payload.steps.length,
          "项过程记录"
        ] }),
        Ge && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => pe(X), children: "以此版本编辑" }),
        Ze && !X.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: _e, onClick: () => void Xe(async () => {
          var fe;
          await u(`/scenes/${X.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((fe = T.find((y) => y.code === X.code && y.active)) == null ? void 0 : fe.id) || null }) }), ae("场景版本已启用。");
        }), children: "启用此版本" }),
        Ge && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: _e, onClick: () => void Xe(async () => {
          var y;
          const fe = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(N)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: N, expected_version: ((y = fe.items[0]) == null ? void 0 : y.version) || 0, categories: X.payload.categories }) }), ae("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, X.id))
    ] })
  ] });
}
const mu = {}, Tu = window.location.pathname.startsWith("/quality/b/"), Ra = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), Nf = mu == null ? void 0 : mu.VITE_B_PLATFORM_MODE, Ut = Ra || Tu && (Nf === "true" || Nf !== "false" && !0);
function Vi() {
  if (!Tu && !Ra) return window.location.pathname;
  const u = Ra ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function Sj(u) {
  Ra ? window.history.pushState({}, "", "/quality/#/b" + u) : Tu ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), Ra && window.dispatchEvent(new Event("platform-route"));
}
async function Yt(u, h = {}) {
  if (!Ut) return fetch(u, h);
  if (!u.startsWith("/api/v1/") && !u.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const N = new Headers(h.headers);
  N.delete("Authorization");
  const o = window.QaxcProjectId;
  Ra && o && N.set("X-Project-ID", o);
  const T = (h.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(T)) {
    const V = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (V.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !V.ok) throw new Error(V.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const A = await V.json(), Y = A.csrf_token ?? A.token;
    if (typeof Y != "string" || !Y) throw new Error("安全校验返回格式不正确。");
    N.set("X-CSRF-Token", Y);
  }
  const U = await fetch("/quality/b" + u, { ...h, headers: N, credentials: "same-origin" });
  return U.status === 401 && window.dispatchEvent(new Event("b-session-expired")), U;
}
const Sf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, wf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, Su = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), wj = (u) => ({
  project_id: u,
  code: "",
  edition: "",
  expected_version: 0,
  title: "",
  source_asset_id: "",
  valid_from: "",
  valid_until: null,
  scope: { project_types: [], regions: [], object_types: [], stages: [] },
  maintainer: "",
  reason: "首次录入",
  clauses: [Su()]
}), Oa = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function xu(u, h) {
  var N;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((N = u == null ? void 0 : u.roles) != null && N.includes("reviewer"));
}
function kj({ api: u, projects: h, identity: N }) {
  var ie, nt, He;
  const [o, T] = r.useState(((ie = h[0]) == null ? void 0 : ie.id) || ""), [U, V] = r.useState([]), [A, Y] = r.useState(null), [v, D] = r.useState(null), [K, k] = r.useState(!1), [se, je] = r.useState(!1), [ye, _e] = r.useState(!1), [Ce, xe] = r.useState(""), [F, he] = r.useState(""), [ae, H] = r.useState(""), [ve, Ae] = r.useState(null), [Ge, Ze] = r.useState(0), [Xe, pe] = r.useState(""), [$e, X] = r.useState(!1), [fe, y] = r.useState(""), [Q, le] = r.useState("current_rectification"), [we, m] = r.useState(""), [L, P] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [te, re] = r.useState(null), Z = r.useRef(crypto.randomUUID()), $ = r.useRef(0), ze = h.find((O) => O.id === o), ne = xu(ze, "knowledge.process"), Ee = xu(ze, "knowledge.review"), ct = xu(ze, "knowledge.publish"), Je = ne || Ee || ct;
  r.useEffect(() => {
    const O = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", O), () => window.removeEventListener("beforeunload", O);
  }, [K]), r.useEffect(() => {
    let O = !1;
    if (_e(!0), xe(""), V([]), Ae(null), !o) {
      _e(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(o)}&view=${Je ? "manage" : "published"}${ae ? "&cursor=" + encodeURIComponent(ae) : ""}`).then((w) => {
      O || (V(w.items), Ae(w.next_cursor));
    }).catch((w) => {
      O || xe(w.message);
    }).finally(() => {
      O || _e(!1);
    }), () => {
      O = !0;
    };
  }, [o, Je, ae, Ge]), r.useEffect(() => () => {
    $.current++;
  }, []);
  const Pe = async (O) => {
    je(!0), xe(""), he("");
    try {
      await O();
    } catch (w) {
      xe(w.message);
    } finally {
      je(!1);
    }
  }, We = () => {
    var O;
    k(!1), (O = window.QaxcClearPendingEdits) == null || O.call(window);
  }, Ue = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), Re = (O) => {
    D((w) => w && { ...w, ...O }), k(!0), Z.current = crypto.randomUUID();
  }, ke = (O, w) => {
    v && Re({ clauses: v.clauses.map((I, Se) => Se === O ? { ...I, ...w } : I) });
  }, De = async (O) => {
    if (!Ue()) return;
    const w = ++$.current;
    await Pe(async () => {
      const I = await u("/standards/" + O.id);
      w === $.current && (Y(I), D(null), We(), re(null), pe(""), X(!1));
    });
  }, st = () => {
    if (!A || !Ue()) return;
    const { id: O, version: w, row_version: I, state: Se, source_available: Me, verified_on: lt, history: Fe, clauses: B, ...oe } = A;
    D({
      project_id: oe.project_id,
      code: oe.code,
      edition: oe.edition,
      title: oe.title,
      source_asset_id: oe.source_asset_id,
      valid_from: oe.valid_from,
      valid_until: oe.valid_until,
      scope: oe.scope,
      maintainer: oe.maintainer,
      expected_version: w,
      reason: "修订说明待填写",
      clauses: (B || []).map((ce) => Object.fromEntries(Object.keys(Su()).map((Ye) => [Ye, ce[Ye]])))
    }), y("沿用已绑定原件；原文变化时请重新上传"), k(!0), Z.current = crypto.randomUUID();
  }, et = (O) => void Pe(async () => {
    if (!A) return;
    const w = await u(`/standards/${A.id}/actions`, { method: "POST", body: JSON.stringify({ action: O, row_version: A.row_version, reason: Xe, evidence_checked: $e }) });
    Y({ ...A, ...w }), We(), Ze((I) => I + 1), he(wf[O] + "成功。"), pe(""), X(!1), A.source_available !== !1 && Y(await u("/standards/" + A.id));
  }), ht = () => void Pe(async () => {
    if (!A) return;
    const O = await Yt(`/api/v1/standards/${A.id}/source`, { headers: { Authorization: `Bearer dev-${N}` } });
    if (!O.ok) {
      const Me = await O.json();
      throw new Error(Me.message || "原件不可用。");
    }
    const w = await O.blob(), I = URL.createObjectURL(w), Se = document.createElement("a");
    Se.href = I, Se.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), Se.click(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Ce && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Ce,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => Ze((O) => O + 1), children: "刷新列表" })
    ] }),
    F && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: F }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: se, value: o, onChange: (O) => {
          Ue() && ($.current++, T(O.target.value), Y(null), D(null), k(!1), H(""), re(null));
        }, children: h.map((O) => /* @__PURE__ */ s.jsx("option", { value: O.id, children: O.name }, O.id)) })
      ] }),
      ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !o, onClick: () => {
        Ue() && (D(wj(o)), Y(null), y(""), k(!1), Z.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || ye, onClick: () => Ze((O) => O + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    ye ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !U.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        Je ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      U.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: O.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            O.code,
            " · ",
            O.edition,
            " · 修订 ",
            O.version,
            " · ",
            Sf[O.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            O.valid_from,
            "；",
            O.valid_until ? "自 " + O.valid_until + " 起不再适用" : "未登记废止日期",
            O.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void De(O), children: "查看与核验" }),
        ct && O.source_available === !1 && ["published", "approved", "superseded"].includes(O.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => {
          Y(O), D(null), X(!1), pe("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, O.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ae || se, onClick: () => H(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !ve || se, onClick: () => H(ve || ""), children: "下一页" })
      ] })
    ] }) }),
    v && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (O) => {
      O.preventDefault(), Pe(async () => {
        if (!v.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...v, scope: Object.fromEntries(Object.entries(v.scope).map(([Se, Me]) => [Se, Oa(Me.join(`
`))])), clauses: v.clauses.map((Se) => ({
          ...Se,
          preconditions: Oa(Se.preconditions.join(`
`)),
          exceptions: Oa(Se.exceptions.join(`
`)),
          tables: Oa(Se.tables.join(`
`)),
          notes: Oa(Se.notes.join(`
`)),
          references: Oa(Se.references.join(`
`))
        })) }, I = await u("/standards", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify(w) });
        We(), D(null), Y(await u("/standards/" + I.id)), Ze((Se) => Se + 1), he("规范草稿已保存，需核验后发布。");
      });
    }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h3", { children: v.expected_version ? "修订规范" : "登记规范" }),
        /* @__PURE__ */ s.jsx("span", { children: "原件和已保存版本保留不变" })
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { className: "proof-body", disabled: se, children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范名称",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: v.title, onChange: (O) => Re({ title: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: v.code, readOnly: v.expected_version > 0, onChange: (O) => Re({ code: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: v.edition, readOnly: v.expected_version > 0, onChange: (O) => Re({ edition: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: v.maintainer, onChange: (O) => Re({ maintainer: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: v.valid_from, onChange: (O) => Re({ valid_from: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: v.valid_until || "", onChange: (O) => Re({ valid_until: O.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (O) => {
            var I;
            const w = (I = O.target.files) == null ? void 0 : I[0];
            w && Pe(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const Se = await u(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              Re({ source_asset_id: Se.asset_id }), y(w.name), he("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: fe || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([O, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: v.scope[O].join(`
`), onChange: (I) => Re({ scope: { ...v.scope, [O]: I.target.value.split(`
`) } }) })
          ] }, O)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        v.clauses.map((O, w) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            w + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: O.number, onChange: (I) => ke(w, { number: I.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: O.chapter, onChange: (I) => ke(w, { chapter: I.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: O.parent_number || "", onChange: (I) => ke(w, { parent_number: I.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: O.page || "", onChange: (I) => ke(w, { page: I.target.value ? Number(I.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: O.locator, onChange: (I) => ke(w, { locator: I.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: O.text, onChange: (I) => ke(w, { text: I.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([I, Se]) => /* @__PURE__ */ s.jsxs("label", { children: [
              Se,
              /* @__PURE__ */ s.jsx("textarea", { value: O[I].join(`
`), onChange: (Me) => ke(w, { [I]: Me.target.value.split(`
`) }) })
            ] }, I))
          ] }),
          v.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => Re({ clauses: v.clauses.filter((I, Se) => Se !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: v.clauses.length >= 200, onClick: () => Re({ clauses: [...v.clauses, Su()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: v.reason, onChange: (O) => Re({ reason: O.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !v.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Ue() && (D(null), k(!1));
        }, children: "取消编辑" })
      ] })
    ] }),
    A && !v && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { children: A.title }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          A.code,
          " · ",
          A.edition,
          " · 修订 ",
          A.version,
          " · ",
          Sf[A.state]
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
        /* @__PURE__ */ s.jsxs("p", { children: [
          "维护人：",
          A.maintainer,
          "；核验日期：",
          A.verified_on || "尚未核验",
          "。有效区间：",
          A.valid_from,
          " 至 ",
          A.valid_until || "未登记废止日期",
          "。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || A.source_available === !1, onClick: ht, children: "下载核对原件" }),
          ne && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !A.clauses, onClick: st, children: "以此版本修订" })
        ] }),
        (nt = A.clauses) == null ? void 0 : nt.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("h4", { children: [
            O.number,
            " · ",
            O.chapter
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "父条号：",
            O.parent_number || "无",
            "；",
            O.page ? "第 " + O.page + " 页；" : "",
            O.locator
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: O.text }),
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, I]) => O[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: I }),
            O[w].map((Se, Me) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: Se }, Me))
          ] }, w))
        ] }, O.number)),
        A.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Q, onChange: (O) => {
              le(O.target.value), re(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Q === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: we, onChange: (O) => {
              m(O.target.value), re(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([O, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: L[O], onChange: (I) => {
              P({ ...L, [O]: I.target.value }), re(null);
            } })
          ] }, O)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void Pe(async () => {
            re(await u(`/standards/${A.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Q, event_date: we || null, ...L }) }));
          }), children: "核对条件" }),
          te && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[te.status] }),
            te.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              te.missing.map((O) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[O] || O).join("、")
            ] }),
            te.reasons.map((O) => /* @__PURE__ */ s.jsx("p", { children: O }, O)),
            /* @__PURE__ */ s.jsx("p", { children: te.note })
          ] })
        ] }),
        Je && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: se, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Xe, maxLength: 2e3, onChange: (O) => pe(O.target.value) })
          ] }),
          A.state === "pending_review" && Ee && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $e, onChange: (O) => X(O.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            A.state === "draft" && ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Xe.trim(), onClick: () => et("submit"), children: "提交审核" }),
            A.state === "pending_review" && Ee && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Xe.trim() || !$e, onClick: () => et("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Xe.trim(), onClick: () => et("request_changes"), children: "退回修改" })
            ] }),
            A.state === "approved" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Xe.trim(), onClick: () => et("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(A.state) && ct && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Xe.trim(), onClick: () => et("withdraw"), children: "撤回此版本" })
          ] }),
          A.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (He = A.history) == null ? void 0 : He.map((O, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            wf[O.action] || O.action,
            " · ",
            O.reason,
            " · ",
            new Date(O.created_at).toLocaleString("zh-CN")
          ] }, w))
        ] })
      ] })
    ] })
  ] });
}
const Ua = { kind: "asset", id: "", quote: "", locator: "" }, $f = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ua] }, Wf = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Ff = { text: "", nature: "fact", evidence: [Ua] }, If = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ua] }, Cj = { name: "", value: null, evidence: [Ua] }, kf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Wf] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [$f] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Ff], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [If], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ua, kind: "work" }], historical_case_ids: [] }
}, Ej = { evidence: Ua, records: $f, categories: Wf, claims: Ff, steps: If, parameters: Cj }, za = {
  taxonomy: "分类字典",
  hazard: "隐患事件",
  compilation: "案例汇编",
  guide: "作业指导书",
  question: "指导书题目",
  kind: "类型",
  title: "标题",
  rule: "分类规则",
  categories: "分类项",
  code: "分类编码",
  name: "名称",
  parent: "父分类编码（可空）",
  positive_examples: "正例",
  negative_examples: "反例",
  description: "隐患原始描述",
  occurred_on: "发生日期",
  stage: "阶段",
  object_name: "作业对象",
  taxonomy_id: "分类规则版本",
  category: "主分类编码",
  subcategory: "子分类编码",
  tags: "辅助标签",
  classification_reason: "分类理由",
  original_risk: "原始风险等级",
  reviewed_risk: "人工核查等级",
  risk_reason: "等级核查依据",
  status: "闭环状态",
  nature: "性质",
  split_reason: "问题拆分依据",
  relation: "与其他事件的关系",
  related_event_id: "关联事件（可空）",
  records: "检查 / 整改 / 复查记录",
  record_key: "原记录唯一编号",
  date: "日期",
  text: "内容",
  evidence: "来源证据",
  id: "来源版本",
  quote: "精确原文摘录",
  locator: "页码 / 段落 / 表格位置",
  mode: "汇编类型",
  event_ids: "固定事件版本",
  background: "项目与场景背景",
  claims: "事实、结论与分析",
  differences: "差异及适用边界",
  limitations: "限制与缺失证据说明",
  missing: "待补充项",
  conditions: "项目条件",
  required_conditions: "企业必填条件",
  preparation: "准备",
  implementation: "实施",
  risk_control: "风险控制",
  acceptance: "检查验收",
  emergency: "异常处置",
  steps: "步骤—风险—措施—检查—依据",
  parameters: "关键参数",
  value: "参数值（无依据留空）",
  number: "步骤编号",
  operation: "操作说明",
  risks: "风险",
  measures: "控制措施",
  checks: "检查要求",
  conflicts: "未解决冲突",
  guide_id: "已发布指导书版本",
  chapter: "章节",
  role: "岗位",
  step: "步骤编号",
  risk: "风险点",
  point: "考点",
  cognitive_level: "考查层次",
  difficulty: "预设难度",
  type: "题型",
  stem: "题干",
  options: "选项（案例/判断题请移除）",
  answer: "答案",
  explanation: "解析",
  rubric: "评分要点",
  historical_case_ids: "历史案例版本"
}, Oj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function Ii({ value: u, onChange: h, catalog: N, name: o = "", path: T = "content", readonly: U = !1 }) {
  var v;
  const V = za[o] || o;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((D, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(Ii, { value: D, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: T + "." + K, catalog: N, readonly: U, onChange: (k) => h(u.map((se, je) => je === K ? k : se)) }),
      !U && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, se) => K !== se)), children: "移除" })
    ] }, K)),
    !U && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(Ej[o] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([D, K]) => D === "kind" && T === "content" ? null : /* @__PURE__ */ s.jsx(Ii, { name: D, value: K, path: T + "." + D, catalog: N, readonly: U, onChange: (k) => {
    const se = { ...u, [D]: k };
    D === "type" && ["judgment", "case"].includes(String(k)) && (se.options = {}), D === "kind" && "id" in u && (se.id = ""), h(se);
  } }, D)) });
  let A = Oj[o];
  o === "kind" && (A = T.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (A = T.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const Y = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in Y || o === "historical_case_id") && (A = N.filter((D) => o in Y ? D.work_kind === Y[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(D.work_kind || "") : !0).map((D) => [D.id, D.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: T, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    U ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((v = A == null ? void 0 : A.find((D) => D[0] === String(u))) == null ? void 0 : v[1]) || String(u ?? "待填") }) : A ? /* @__PURE__ */ s.jsxs("select", { id: T, value: String(u ?? ""), onChange: (D) => h(D.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      A.map(([D, K]) => /* @__PURE__ */ s.jsx("option", { value: D, children: K }, D))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: T, type: "date", value: String(u ?? ""), onChange: (D) => h(D.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: T, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(u ?? ""), onChange: (D) => h(D.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : D.target.value) })
  ] });
}
const Cf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, Ef = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function Tj({ api: u, projects: h, identity: N }) {
  var O;
  const [o, T] = r.useState(((O = h[0]) == null ? void 0 : O.id) || ""), [U, V] = r.useState("hazard"), [A, Y] = r.useState([]), [v, D] = r.useState([]), [K, k] = r.useState(null), [se, je] = r.useState(null), [ye, _e] = r.useState(""), [Ce, xe] = r.useState(!1), [F, he] = r.useState(""), [ae, H] = r.useState(""), [ve, Ae] = r.useState(!1), [Ge, Ze] = r.useState(!1), [Xe, pe] = r.useState(0), [$e, X] = r.useState(null), [fe, y] = r.useState(""), [Q, le] = r.useState(null), [we, m] = r.useState(null), [L, P] = r.useState(null), [te, re] = r.useState(null), Z = r.useRef(crypto.randomUUID()), $ = r.useRef(0), ze = r.useRef(!1), ne = h.find((w) => w.id === o), Ee = (w) => {
    var I, Se;
    return ne != null && ne.permissions ? ne.permissions.includes(w) : w.startsWith("training.") ? !!((I = ne == null ? void 0 : ne.roles) != null && I.some((Me) => ["admin", "teacher"].includes(Me))) : w === "knowledge.process" ? !!(ne != null && ne.can_run) : !!(ne != null && ne.can_manage) || !!((Se = ne == null ? void 0 : ne.roles) != null && Se.includes("reviewer"));
  }, ct = Ee(U === "question" ? "training.manage" : "knowledge.process"), Je = Ee(U === "question" ? "training.review" : "knowledge.review"), Pe = Ee(U === "question" ? "training.review" : "knowledge.publish"), We = ct || Je || Pe, Ue = () => {
    var w;
    ze.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, Re = () => !ze.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (I) => {
      ze.current && (I.preventDefault(), I.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Ze(!0), Y([]), he(""), !o) {
      Ze(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(o)}&kind=${U}&view=${We ? "manage" : "published"}${fe ? "&cursor=" + encodeURIComponent(fe) : ""}`).then((I) => {
      w || (Y(I.items), X(I.next_cursor));
    }).catch((I) => {
      w || he(I.message);
    }).finally(() => {
      w || Ze(!1);
    }), We && u(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((I) => {
      w || D(I.items);
    }).catch((I) => {
      w || he(I.message);
    }), U === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((I) => {
      w || le(I);
    }).catch((I) => {
      w || he(I.message);
    }), () => {
      w = !0;
    };
  }, [o, U, fe, We, Xe]), r.useEffect(() => () => {
    $.current++;
  }, []);
  const ke = async (w) => {
    Ae(!0), he(""), H("");
    try {
      await w();
    } catch (I) {
      he(I.message);
    } finally {
      Ae(!1);
    }
  }, De = () => {
    $.current++, k(null), je(null), m(null), P(null), re(null), y(""), _e(""), xe(!1), Ue();
  }, st = async (w) => {
    if (!Re()) return;
    const I = ++$.current;
    await ke(async () => {
      const Se = await u("/workflows/" + w.id);
      I === $.current && (k(Se), je(null), _e(""), xe(!1), P(null), re(null), Ue());
    });
  }, et = (w) => {
    je((I) => I && { ...I, ...w }), ze.current = !0, Z.current = crypto.randomUUID();
  }, ht = () => ke(async () => {
    if (!se) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify({ ...se, project_id: o, reason: ye }) });
    k(w), je(null), Ue(), pe((I) => I + 1), H("已保存新版本，尚未审核发布。");
  }), ie = (w, I) => ke(async () => {
    const Se = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: I, row_version: w.row_version, reason: ye, evidence_checked: Ce }) });
    k(I === "withdraw" ? null : await u("/workflows/" + Se.id)), pe((Me) => Me + 1), Ue(), H(Ef[I] + "已完成");
  }), nt = (w) => ke(async () => {
    const I = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(w)}&limit=100`);
    m(I.items);
  }), He = () => ke(async () => {
    if (!K) return;
    const w = await Yt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + N } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const I = URL.createObjectURL(await w.blob()), Se = document.createElement("a");
    Se.href = I, Se.download = K.title + ".docx", Se.click(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: ve, onChange: (w) => {
          Re() && (De(), T(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: () => pe((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(kf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: ve, className: "button " + (U === w ? "primary" : "ghost"), onClick: () => {
      Re() && (De(), V(w));
    }, children: za[w] }, w)) }),
    F && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: F }),
    ae && /* @__PURE__ */ s.jsx("p", { role: "status", children: ae }),
    U === "hazard" && Q && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "隐患分类分析" }),
      /* @__PURE__ */ s.jsxs("div", { className: "wf-counts", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "事件 ",
          /* @__PURE__ */ s.jsx("strong", { children: Q.event_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "检查记录 ",
          /* @__PURE__ */ s.jsx("strong", { children: Q.inspection_record_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "项目 ",
          /* @__PURE__ */ s.jsx("strong", { children: Q.project_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "来源待核实 ",
          /* @__PURE__ */ s.jsx("strong", { children: Q.unavailable_count })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: Q.definition }),
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Q.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: ve, onClick: () => nt(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      we && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        we.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => st(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          za[U],
          "清单"
        ] }),
        ct && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: ve, onClick: () => {
          Re() && (De(), je({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(kf[U]) }), ze.current = !0, Z.current = crypto.randomUUID());
        }, children: [
          "新建",
          za[U]
        ] })
      ] }),
      Ge ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : A.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        za[U],
        "。",
        ct ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: A.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: ve || w.source_available === !1, onClick: () => st(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          Cf[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        Pe && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !ye.trim(), onClick: () => ie(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        fe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(""), children: "首页" }),
        $e && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y($e), children: "下一页" })
      ] })
    ] }),
    se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        za[U],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: ve, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: se.title, onChange: (w) => et({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(Ii, { value: se.content, catalog: v, onChange: (w) => et({ content: w }) })
      ] })
    ] }),
    K && !se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        Cf[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        ct && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: () => {
          je({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), ze.current = !0, Z.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: He, children: "导出Word" }),
        Ee("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ke(async () => {
          P((await u(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        U === "guide" && K.state === "published" && Ee("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ke(async () => re(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        U === "question" && K.state === "published" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve, onClick: () => ke(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), H("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      L && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        L.length ? L.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      te && /* @__PURE__ */ s.jsx("ul", { children: te.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(Ii, { value: K.content, catalog: v, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((w, I) => /* @__PURE__ */ s.jsxs("p", { children: [
          Ef[w.action] || w.action,
          "：",
          w.reason
        ] }, I))
      ] })
    ] }),
    We && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: ye, onChange: (w) => _e(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      se ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !ye.trim() || !se.title.trim(), onClick: ht, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ce, onChange: (w) => xe(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !ye.trim(), onClick: () => ie(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && Je && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !Ce || !ye.trim(), onClick: () => ie(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !ye.trim(), onClick: () => ie(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && Pe && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !ye.trim(), onClick: () => ie(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && Pe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !ye.trim(), onClick: () => ie(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const Of = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function zj({ id: u, identity: h, projects: N, navigate: o }) {
  const [T, U] = r.useState(null), [V, A] = r.useState(""), [Y, v] = r.useState(!1), [D, K] = r.useState(""), [k, se] = r.useState(0), je = `a-import-action:${h}:${u}`;
  async function ye(xe, F) {
    const he = await Yt("/integration/v1/a-imports/" + u + xe, F), ae = await he.json().catch(() => ({}));
    if (!he.ok)
      throw he.status >= 400 && he.status < 500 && sessionStorage.removeItem(je), new Error(ae.message || `请求未完成（${he.status}），请刷新查看最新状态。`);
    return ae;
  }
  r.useEffect(() => {
    let xe = !1;
    async function F() {
      try {
        const ae = await ye("");
        xe || (U(ae), A(""));
      } catch (ae) {
        xe || (U(null), A(ae.message));
      }
    }
    U(null), F();
    const he = window.setInterval(F, 3e3);
    return () => {
      xe = !0, clearInterval(he);
    };
  }, [u, k, h]);
  const _e = (xe) => {
    var F, he;
    return !!T && !!((he = (F = N.find((ae) => ae.id === T.project_id)) == null ? void 0 : F.permissions) != null && he.includes(xe));
  };
  async function Ce(xe) {
    if (!(!T || Y)) {
      v(!0), A("");
      try {
        const F = sessionStorage.getItem(je), he = F ? JSON.parse(F) : { operation: xe, key: crypto.randomUUID(), body: { expected_version: T.version, ...xe === "withdraw" ? { reason: D.trim() } : {} } };
        if (he.operation !== xe) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(je, JSON.stringify(he)), await ye("/" + xe, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": he.key }, body: JSON.stringify(he.body) }), sessionStorage.removeItem(je), se((ae) => ae + 1);
      } catch (F) {
        A(F.message);
      } finally {
        v(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => se((xe) => xe + 1), disabled: Y, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      V && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: V }),
      T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ s.jsxs("dd", { children: [
              "v",
              T.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Of[T.status] || T.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Of[T.retrospective_status] || T.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          T.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        T.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: T.error.message }),
        T.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: T.warnings.map((xe, F) => /* @__PURE__ */ s.jsx("li", { children: xe.message }, xe.code + ":" + F)) })
        ] }),
        T.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          T.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          T.capabilities.can_view_materials && T.receipt_id && _e("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + T.receipt_id), children: "查看原始资料" }),
          T.capabilities.can_generate_retrospective && _e("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Y, onClick: () => void Ce("retrospectives"), children: T.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          T.retrospective_id && T.status !== "withdrawn" && _e("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + T.retrospective_id), children: "查看复盘" }),
          (T.status === "failed" || T.retrospective_status === "failed") && _e("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Y, onClick: () => void Ce("retry"), children: "重试失败任务" })
        ] }),
        T.status !== "withdrawn" && _e("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: D, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (xe) => K(xe.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Y || !D.trim(), onClick: () => void Ce("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Aj({ navigate: u }) {
  const [h, N] = r.useState([]), [o, T] = r.useState(""), [U, V] = r.useState(!1);
  return r.useEffect(() => {
    let A = !1;
    return (async () => {
      try {
        const [Y, v, D] = await Promise.all([Yt("/api/v1/health"), Yt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!Y.ok || !v.ok || !D.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, se] = await Promise.all([Y.json(), v.json(), D.json()]), je = window.QaxcProjectId, ye = se.tasks.filter((_e) => !je || _e.projectId === je).flatMap((_e) => (_e.events || []).map((Ce) => ({ id: Ce.id, action: _e.title + " · " + Ce.action, project_id: _e.projectId, created_at: Ce.uploadedAt, source: "现场作业" })));
        A || (V(K.worker_online), N([...ye, ...k.items.map((_e) => ({ ..._e, source: "知识与学习" }))].sort((_e, Ce) => Date.parse(Ce.created_at) - Date.parse(_e.created_at)).slice(0, 100)));
      } catch (Y) {
        A || T(Y.message);
      }
    })(), () => {
      A = !0;
    };
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ s.jsxs("p", { role: "status", children: [
      "后台处理：",
      U ? "在线" : "未连接或正在读取",
      "。成果接入、知识发布与资料处理共用后台任务队列。"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", style: { margin: "20px 0", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => u("/jobs"), children: "处理任务与重试" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => u("/settings/models"), children: "模型配置" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => u("/task-packages"), children: "成果与证据" })
    ] }),
    o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("h3", { children: "最近操作" }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。" }),
      h.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "业务" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: h.map((A) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(A.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: A.source }),
          /* @__PURE__ */ s.jsx("td", { children: A.action })
        ] }, A.source + A.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function Rj({ deliveryId: u, navigate: h }) {
  const [N, o] = r.useState(!1), [T, U] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function A(v, D, K) {
    const k = await Yt("/api/v1" + v, { method: D ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: D ? JSON.stringify(D) : void 0 }), se = await k.json();
    if (!k.ok) throw Error(se.message || "处理失败，请重试");
    return se;
  }
  async function Y() {
    if (N) return;
    o(!0);
    const v = "archive-review:" + u, D = sessionStorage.getItem(v) || crypto.randomUUID();
    sessionStorage.setItem(v, D);
    try {
      U("正在核验归档成果…");
      const K = await A("/platform-archives", { delivery_id: u }, D);
      for (let k = 0; k < 60 && V.current; k++) {
        const se = await A("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (se.status === "ready") {
          U("证据已校验，正在生成复盘…");
          const je = await A("/retrospectives", { mode: "task_process", task_package_id: se.id });
          V.current && h("/retrospectives/" + je.id);
          return;
        }
        if (["failed", "withdrawn"].includes(se.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        U("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((je) => setTimeout(je, 1e3));
      }
      V.current && U("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      V.current && U(K.message);
    } finally {
      V.current && o(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: T }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: N, onClick: () => void Y(), children: "生成 / 打开复盘" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => h("/task-packages"), children: "成果处理清单" })
    ] })
  ] });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uj = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Dj = (u) => u.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (h, N, o) => o ? o.toUpperCase() : N.toLowerCase()
), Tf = (u) => {
  const h = Dj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, Pf = (...u) => u.filter((h, N, o) => !!h && h.trim() !== "" && o.indexOf(h) === N).join(" ").trim(), Mj = (u) => {
  for (const h in u)
    if (h.startsWith("aria-") || h === "role" || h === "title")
      return !0;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var qj = {
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
const Hj = r.forwardRef(
  ({
    color: u = "currentColor",
    size: h = 24,
    strokeWidth: N = 2,
    absoluteStrokeWidth: o,
    className: T = "",
    children: U,
    iconNode: V,
    ...A
  }, Y) => r.createElement(
    "svg",
    {
      ref: Y,
      ...qj,
      width: h,
      height: h,
      stroke: u,
      strokeWidth: o ? Number(N) * 24 / Number(h) : N,
      className: Pf("lucide", T),
      ...!U && !Mj(A) && { "aria-hidden": "true" },
      ...A
    },
    [
      ...V.map(([v, D]) => r.createElement(v, D)),
      ...Array.isArray(U) ? U : [U]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _t = (u, h) => {
  const N = r.forwardRef(
    ({ className: o, ...T }, U) => r.createElement(Hj, {
      ref: U,
      iconNode: h,
      className: Pf(
        `lucide-${Uj(Tf(u))}`,
        `lucide-${u}`,
        o
      ),
      ...T
    })
  );
  return N.displayName = Tf(u), N;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], zf = _t("activity", Bj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Af = _t("arrow-left", Lj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], Ol = _t("arrow-right", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], Pi = _t("book-open", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Qj = _t("chevron-down", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], ll = _t("chevron-right", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vj = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Jj = _t("chevron-up", Vj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Tl = _t("circle-alert", Kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $j = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], zl = _t("circle-check", $j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
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
], Fj = _t("clipboard-list", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ij = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], ju = _t("database", Ij);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pj = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Rf = _t("download", Pj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], tv = _t("external-link", ev);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sv = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], Un = _t("file-check-2", sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lv = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], Uf = _t("file-input", lv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], vu = _t("file-search", av);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Ji = _t("folder-lock", nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iv = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], cv = _t("history", iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rv = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
], uv = _t("image", rv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ov = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Df = _t("layout-dashboard", ov);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Mf = _t("loader-circle", dv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hv = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
], fv = _t("pencil", hv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], qf = _t("play", mv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xv = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], jv = _t("plus", xv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Bs = _t("refresh-cw", vv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], gv = _t("search", pv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bv = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Hf = _t("shield-check", bv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yv = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], em = _t("upload", yv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _v = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], Nv = _t("users", _v);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Wi = _t("x", Sv), zs = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, Tn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Bf = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Lf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], N = (o) => h.includes(o) ? h.indexOf(o) : 100;
  return Object.entries(u).sort(([o], [T]) => N(o) - N(T));
}, pu = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function wv({ asset: u, identity: h }) {
  const [N, o] = r.useState(""), [T, U] = r.useState("");
  return r.useEffect(() => {
    let V = !1, A = "";
    return Yt(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (Y) => {
      if (!Y.ok) throw new Error("图片不可访问或已撤回");
      return Y.blob();
    }).then((Y) => {
      A = URL.createObjectURL(Y), V ? URL.revokeObjectURL(A) : o(A);
    }).catch((Y) => {
      V || U(Y.message);
    }), () => {
      V = !0, A && URL.revokeObjectURL(A);
    };
  }, [u, h]), T ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: T }) : N ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: N, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function kv({ api: u, path: h, navigate: N, projects: o, identity: T }) {
  var ot, Nt;
  const [U, V] = r.useState([]), [A, Y] = r.useState([]), [v, D] = r.useState([]), [K, k] = r.useState([]), [se, je] = r.useState("reports"), ye = r.useRef(0), [_e, Ce] = r.useState(""), [xe, F] = r.useState([]), [he, ae] = r.useState(null), [H, ve] = r.useState(""), [Ae, Ge] = r.useState(!1), [Ze, Xe] = r.useState([]), [pe, $e] = r.useState({}), [X, fe] = r.useState(0), [y, Q] = r.useState(null), [le, we] = r.useState(null), [m, L] = r.useState(null), [P, te] = r.useState(new URLSearchParams(location.search).get("source") || ""), [re, Z] = r.useState(""), [$, ze] = r.useState(!1), [ne, Ee] = r.useState(""), [ct, Je] = r.useState(""), [Pe, We] = r.useState(!0), [Ue, Re] = r.useState(!1), [ke, De] = r.useState(0), [st, et] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [ht, ie] = r.useState(""), [nt, He] = r.useState(null), [O, w] = r.useState([]), [I, Se] = r.useState(""), [Me, lt] = r.useState(0), [Fe, B] = r.useState(!1), [oe, ce] = r.useState("csv"), [Ye, b] = r.useState(""), [ge, de] = r.useState(""), [Qe, vt] = r.useState(((ot = o.find((g) => g.can_run)) == null ? void 0 : ot.id) || (Ut ? "" : "demo-airport")), M = o.some((g) => g.can_run), j = h.startsWith("/records/"), ue = h.startsWith("/imports/") && h !== "/imports/new", be = U.find((g) => g.id === P), rt = A.filter((g) => g.kind === (be == null ? void 0 : be.kind) && g.project_id === (be == null ? void 0 : be.project_id));
  r.useEffect(() => {
    ie(""), w([]), Se(""), lt(0), Ee(""), Je(""), L(null);
  }, [h]), r.useEffect(() => {
    let g = !1;
    We(!0), Ee(""), we(null), Q(null);
    const Ne = new URLSearchParams(Object.entries(st).filter(([, bt]) => !!bt));
    Ne.set("limit", "15"), ht && Ne.set("cursor", ht);
    async function it() {
      try {
        const [bt, x] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (g) return;
        if (V(bt.items), Y(x.items), h === "/sources" || h === "/imports") {
          const Oe = await u("/imports?limit=15" + (ht ? "&cursor=" + encodeURIComponent(ht) : ""));
          if (g) return;
          D(Oe.items), He(Oe.next_cursor);
        } else if (ue) {
          const Oe = await u(`${h}?after_row=${Me}&only_issues=${Fe}`);
          g || Q(Oe);
        } else if (j) {
          const Oe = await u(h + (I ? "?version=" + I : ""));
          g || we(Oe);
        } else if (h === "/records") {
          const Oe = await u("/records?" + Ne);
          if (g) return;
          if (Xe(Oe.items), He(Oe.next_cursor), $e(Oe.totals_by_kind), fe(Oe.detail_groups_after_confirmed_links), se === "reports") {
            const Te = new URLSearchParams(Ne);
            Te.delete("cursor"), ht && Te.set("after_id", ht);
            const at = await u("/reports?" + Te);
            if (g) return;
            k(at.items), He(at.next_cursor);
          }
        }
      } catch (bt) {
        g || Ee(bt.message);
      } finally {
        g || We(!1);
      }
    }
    return it(), () => {
      g = !0;
    };
  }, [h, st, ht, I, ke, Me, Fe, se]), r.useEffect(() => {
    if (!ue || !y || !["queued", "running"].includes(y.status)) return;
    let g = !1;
    const Ne = setInterval(() => {
      u(`${h}?after_row=${Me}&only_issues=${Fe}`).then((it) => {
        g || Q(it);
      }).catch((it) => {
        g || Ee(it.message);
      });
    }, 1500);
    return () => {
      g = !0, clearInterval(Ne);
    };
  }, [h, y == null ? void 0 : y.status, Me, Fe]), r.useEffect(() => {
    ye.current++, Ce(""), F([]), ae(null), ve("");
  }, [st, se, h]);
  const _ = async (g, Ne = !1) => {
    const it = ++ye.current;
    if (!Ne && _e === g) {
      Ce(""), Ge(!1);
      return;
    }
    Ne || (F([]), ae(null)), Ce(g), Ge(!0), ve("");
    const bt = new URLSearchParams(Object.entries(st).filter(([, x]) => !!x));
    bt.set("document_id", g), bt.set("limit", "15"), Ne && he && bt.set("cursor", he);
    try {
      const x = await u("/records?" + bt);
      if (it !== ye.current) return;
      F((Oe) => Ne ? [...Oe, ...x.items] : x.items), ae(x.next_cursor);
    } catch (x) {
      it === ye.current && ve(x.message);
    } finally {
      it === ye.current && Ge(!1);
    }
  }, me = async (g) => {
    Re(!0), Ee(""), Je("");
    try {
      await g();
    } catch (Ne) {
      Ee(Ne.message);
    } finally {
      Re(!1);
    }
  }, Ve = () => me(async () => {
    for (const g of o.filter((Ne) => Ne.can_run))
      for (const Ne of g.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const it = `mock-${g.id}-${Ne}`;
        U.some((bt) => bt.namespace === it && bt.project_id === g.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${g.id === "demo-airport" ? "机场" : "地铁"} · ${zs[Ne]}（模拟）`, namespace: it, kind: Ne, project_id: g.id, mapping_template: Ne === "governance_export" ? "governance-v1" : `${Ne}-v1` }) });
      }
    Je("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), De((g) => g + 1);
  }), Ot = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !O.length, onClick: () => {
        ie(O.at(-1) || ""), w(O.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !nt, onClick: () => {
        w([...O, ht]), ie(nt || "");
      }, children: "下一页" })
    ] })
  ] }), qt = (g, Ne) => {
    et({ ...st, [g]: Ne }), ie(""), w([]);
  }, Gt = (g) => me(async () => {
    const Ne = await Yt(`/api/v1/assets/${g}/content`, { headers: { Authorization: `Bearer dev-${T}` } });
    if (!Ne.ok) {
      const x = await Ne.json();
      throw new Error(x.message);
    }
    const it = URL.createObjectURL(await Ne.blob()), bt = document.createElement("a");
    bt.href = it, bt.download = "来源文件", bt.click(), URL.revokeObjectURL(it);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(ju, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ut ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ne && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      ne,
      /* @__PURE__ */ s.jsx("button", { onClick: () => De((g) => g + 1), children: "重新加载" })
    ] }),
    ct && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      ct
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => N("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => N("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => N("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => De((g) => g + 1), disabled: Pe, children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Pe ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Ut && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ue || !M, onClick: () => void Ve(), children: [
          /* @__PURE__ */ s.jsx(ju, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: U.map((g) => {
        var Ne, it;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(ju, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: zs[g.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: g.name }),
          /* @__PURE__ */ s.jsx("p", { children: (Ne = o.find((bt) => bt.id === g.project_id)) == null ? void 0 : Ne.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Bf(g.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((it = o.find((bt) => bt.id === g.project_id)) != null && it.can_run), onClick: () => {
            te(g.id), Z(""), N("/imports/new?source=" + g.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(Ol, { size: 16 })
          ] })
        ] }, g.id);
      }) }),
      !U.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(vu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      M && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Ut || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Ye, onChange: (g) => b(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: ge, onChange: (g) => de(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: oe, onChange: (g) => ce(g.target.value), children: ["csv", "excel", "governance_export"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: zs[g] }, g)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Qe, onChange: (g) => vt(g.target.value), children: o.filter((g) => g.can_run).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ue || !Ye || !ge, onClick: () => void me(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Ye, namespace: ge, kind: oe, project_id: Qe, mapping_template: oe === "governance_export" ? "governance-v1" : `${oe}-v1` }) }), De((g) => g + 1), Je("来源已创建。");
        }), children: "创建来源" })
      ] })
    ] }) : h === "/imports/new" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel import-form", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "新建历史项目" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择来源 → 预览映射与异常 → 后台增量接入" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "数据来源",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: P, onChange: (g) => {
                te(g.target.value), Z(""), L(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                U.filter((g) => {
                  var Ne;
                  return (Ne = o.find((it) => it.id === g.project_id)) == null ? void 0 : Ne.can_run;
                }).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: re, onChange: (g) => {
                Z(g.target.value), L(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                rt.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.asset_id, children: g.label }, g.asset_id))
              ] })
            ] })
          ] }),
          !Ut && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $, onChange: (g) => ze(g.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Ut && be && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Ue, accept: be.kind === "csv" ? ".csv" : be.kind === "excel" ? ".xlsx" : ".json", onChange: (g) => {
                var it;
                const Ne = (it = g.target.files) == null ? void 0 : it[0];
                g.target.value = "", Ne && me(async () => {
                  if (Ne.size > 5e6) throw new Error("文件不能超过5MB");
                  const bt = new Uint8Array(await Ne.arrayBuffer());
                  let x = "";
                  for (let Te = 0; Te < bt.length; Te += 8192) x += String.fromCharCode(...bt.subarray(Te, Te + 8192));
                  const Oe = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: be.project_id, kind: be.kind, name: Ne.name, base64: btoa(x) }) });
                  Y((Te) => [...Te, Oe]), Z(Oe.asset_id), L(null), Je("文件已上传，请预览字段与异常后提交接入。");
                });
              } })
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "项目ID：",
              be.project_id,
              "。文件必须保留稳定记录ID、报告ID和项目ID；记录类型为detail、review或summary。"
            ] }),
            /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsx("summary", { children: "查看所需表头" }),
              /* @__PURE__ */ s.jsx("p", { children: Object.values(be.mapping).join("、") })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Ue || !P || !re, onClick: () => void me(async () => {
            L(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: P, input_asset_id: re }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(vu, { size: 16 }),
            "预览字段与异常"
          ] })
        ] })
      ] }),
      m && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "输入记录" }),
            /* @__PURE__ */ s.jsx("strong", { children: m.total })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "原始字段" }),
            /* @__PURE__ */ s.jsx("strong", { children: m.raw_columns.length })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "需核查行" }),
            /* @__PURE__ */ s.jsx("strong", { children: m.warning_rows })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "不能接入行" }),
            /* @__PURE__ */ s.jsx("strong", { children: m.failed_rows })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "字段映射" }),
            /* @__PURE__ */ s.jsx("span", { children: "未映射字段仍完整保留在原始字段中" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(m.mapping).map(([g, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: Ne }),
            /* @__PURE__ */ s.jsx(Ol, { size: 13 }),
            /* @__PURE__ */ s.jsx("strong", { children: g })
          ] }, g)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel preview-table", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "内容与异常预览" }),
            /* @__PURE__ */ s.jsx("span", { children: "预览不生成业务记录 · 最多展示20行" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
            /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("th", { children: "来源行 / 身份" }),
              /* @__PURE__ */ s.jsx("th", { children: "生效描述" }),
              /* @__PURE__ */ s.jsx("th", { children: "类型" }),
              /* @__PURE__ */ s.jsx("th", { children: "异常" })
            ] }) }),
            /* @__PURE__ */ s.jsx("tbody", { children: m.preview.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                g.row_number,
                /* @__PURE__ */ s.jsx("small", { children: g.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: pu(g.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: zs[String(g.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...g.errors, ...g.issues].join("；") || "通过" })
            ] }, g.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ue, onClick: () => void me(async () => {
              const g = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: P, input_asset_id: re, input_hash: m.input_hash, fail_after: !Ut && $ ? 2 : null }) });
              N("/imports/" + g.id);
            }), children: [
              /* @__PURE__ */ s.jsx(em, { size: 16 }),
              Ue ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !M, onClick: () => N("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(Ol, { size: 15 })
        ] })
      ] }),
      v.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "来源 / 时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "新增" }),
          /* @__PURE__ */ s.jsx("th", { children: "更新" }),
          /* @__PURE__ */ s.jsx("th", { children: "跳过" }),
          /* @__PURE__ */ s.jsx("th", { children: "失败" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: v.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: g.source_name }),
            /* @__PURE__ */ s.jsx("small", { children: Bf(g.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: Tn[g.status] }),
          ["created", "updated", "skipped", "failed"].map((Ne) => /* @__PURE__ */ s.jsx("td", { children: g.counts[Ne] }, Ne)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/imports/" + g.id), children: "查看历史项目" }) })
        ] }, g.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      Ot
    ] }) : ue && y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => N("/imports"), children: [
        /* @__PURE__ */ s.jsx(Af, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Tn[y.status] }),
          /* @__PURE__ */ s.jsx("h2", { children: y.source.name }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "已处理 ",
            y.counts.processed,
            " / ",
            y.counts.total,
            " 条 · ",
            y.progress,
            "%"
          ] })
        ] }),
        y.job_status === "failed" && ((Nt = o.find((g) => g.id === y.source.project_id)) == null ? void 0 : Nt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ue, onClick: () => void me(async () => {
          await u(`/jobs/${y.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: y.row_version }) }), De((g) => g + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Bs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      y.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: y.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: g === "failed" ? "失败行" : Tn[g] }),
        /* @__PURE__ */ s.jsx("strong", { children: y.counts[g] })
      ] }, g)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-meta", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "实际输入SHA-256" }),
          /* @__PURE__ */ s.jsx("code", { children: y.input_hash })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "规则版本" }),
          /* @__PURE__ */ s.jsx("strong", { children: y.rule_version })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "记录类型" }),
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(y.counts.kinds || {}).map(([g, Ne]) => `${zs[g]} ${Ne}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Fe, onChange: (g) => {
              B(g.target.checked), lt(0);
            } }),
            "只看异常行"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "输入行" }),
            /* @__PURE__ */ s.jsx("th", { children: "结果" }),
            /* @__PURE__ */ s.jsx("th", { children: "说明" }),
            /* @__PURE__ */ s.jsx("th", { children: "记录" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: y.rows.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: g.row_number }),
            /* @__PURE__ */ s.jsx("td", { children: g.outcome === "failed" ? "失败" : Tn[g.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: g.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: g.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/records/" + g.record_id), children: "查看证据" }) })
          ] }, g.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !Me, onClick: () => lt(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !y.next_row, onClick: () => lt(y.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            zs[g],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: pe[g] || 0 })
        ] }, g)),
        /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsx("span", { children: "确认关联后的明细组" }),
          /* @__PURE__ */ s.jsx("strong", { children: X }),
          /* @__PURE__ */ s.jsx("small", { children: "仅合并已确认关系，非独立隐患结论" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "record-filters", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: st.project_id, onChange: (g) => qt("project_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: st.source_id, onChange: (g) => qt("source_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              U.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: st.record_kind, onChange: (g) => qt("record_kind", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: zs[g] }, g))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: st.quality_status, onChange: (g) => qt("quality_status", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: st.from_date, onChange: (g) => qt("from_date", g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: st.to_date, onChange: (g) => qt("to_date", g.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "reports", onClick: () => {
            je("reports"), ie(""), w([]), Ce("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "rows", onClick: () => {
            je("rows"), ie(""), w([]);
          }, children: "逐条数据" })
        ] }),
        se === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((g) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": _e === g.id, onClick: () => void _(g.id), children: [
            /* @__PURE__ */ s.jsx(vu, { size: 20 }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: g.title }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                g.source_name,
                " · ",
                g.report_id
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              g.count,
              " 条风险数据"
            ] }),
            /* @__PURE__ */ s.jsx(Ol, { size: 16 })
          ] }),
          _e === g.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            H && /* @__PURE__ */ s.jsx("p", { role: "alert", children: H }),
            Ae ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : xe.map((Ne) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => N("/records/" + Ne.id), children: Ne.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                zs[Ne.record_kind],
                " · v",
                Ne.current_version
              ] })
            ] }, Ne.id)),
            he && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Ae, onClick: () => void _(g.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, g.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Ze.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ze.map((g) => {
            var Ne;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => N("/records/" + g.id), children: g.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (Ne = U.find((it) => it.id === g.source_id)) == null ? void 0 : Ne.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: zs[g.record_kind] }),
              /* @__PURE__ */ s.jsx("td", { children: g.occurred_on || "未知" }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: `status ${g.quality_status === "valid" ? "succeeded" : "retrying"}`, children: g.quality_status === "valid" ? "通过" : "需核查" }) }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                "v",
                g.current_version
              ] })
            ] }, g.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的记录" }),
          /* @__PURE__ */ s.jsx("p", { children: "调整筛选条件，或先完成一批资料接入。" })
        ] }),
        Ot
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : j && le ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => N("/records"), children: [
        /* @__PURE__ */ s.jsx(Af, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            zs[le.record_kind],
            " · ",
            Ut ? "来源记录" : "模拟记录"
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: le.description || "缺少描述" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            le.source.name,
            " · ",
            le.external_record_id
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "查看版本",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: le.selected_version, onChange: (g) => Se(g.target.value), children: le.versions.map((g) => /* @__PURE__ */ s.jsxs("option", { value: g.version, children: [
            "v",
            g.version,
            g.version === le.current_version ? " · 当前" : ""
          ] }, g.version)) })
        ] })
      ] }),
      le.issues.length > 0 && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: le.issues.join("；") }),
      /* @__PURE__ */ s.jsxs("div", { className: "record-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源原始字段" }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Object.keys(le.raw_fields).length,
              "个字段 · 完整保留"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Lf(le.raw_fields).map(([g, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: pu(Ne) })
          ] }, g)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Lf(le.effective_fields).map(([g, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: pu(Ne) })
          ] }, g)) }),
          /* @__PURE__ */ s.jsxs("details", { className: "provenance", children: [
            /* @__PURE__ */ s.jsx("summary", { children: "来源定位 / 人工修订 / 内容版本" }),
            /* @__PURE__ */ s.jsx("pre", { children: JSON.stringify(le.provenance, null, 2) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "report-note", children: [
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "原报告：",
              le.document.report_id
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: le.document.note })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel evidence-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "证据与图片关系" }),
          /* @__PURE__ */ s.jsx("span", { children: "确定锚点与候选关联分别标识" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "evidence-grid", children: le.evidence.map((g) => {
          var Ne;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: zs[g.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: g.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(g.locator) }),
            g.type !== "source_row" && g.asset_id ? /* @__PURE__ */ s.jsx(wv, { asset: g.asset_id, identity: T }) : g.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            g.asset_id && ((Ne = o.find((it) => it.id === le.project_id)) == null ? void 0 : Ne.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Ue, onClick: () => void Gt(g.asset_id), children: "下载对应来源文件" })
          ] }, g.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        le.links.length ? le.links.map((g) => {
          var Ne;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Tn[g.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/records/" + g.other_record_id), children: "打开另一条记录" }),
            ((Ne = o.find((it) => it.id === le.project_id)) == null ? void 0 : Ne.roles.some((it) => ["admin", "reviewer"].includes(it))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ue || g.review_state === "stale", onClick: () => void me(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "confirmed" }) }), De((it) => it + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ue || g.review_state === "stale", onClick: () => void me(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "rejected" }) }), De((it) => it + 1);
              }), children: "排除" })
            ] })
          ] }, g.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ne ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const al = "/history-review", Mn = "/history-reader", tm = "historyReview.visibleColumnsV2", sm = "historyReview.columnOrder", Fi = "historyReview.columnWidths", lm = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], zn = ["_photos", "_source", "_status", "_actions"], gu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], zu = { _actions: "操作", _photos: "照片", _source: "来源报告", _status: "状态" }, bu = Object.keys(zu), am = [...lm, "_photos", "_source", "_status", "_actions"], ec = [...lm, "_photos", "_source", "_actions"], Cv = {
  problem_description: 340,
  project_name: 170,
  engineering_project_name: 170,
  inspection_location: 140,
  basis_or_clause: 170,
  rectification_requirement: 190,
  rectification_advice: 190,
  rectification_deadline: 110,
  reported_response: 190,
  reinspection_conclusion: 140,
  inspection_date: 104,
  source_category: 120,
  hazard_category: 110,
  source_grade: 90,
  _photos: 104,
  _source: 160,
  _status: 92,
  _actions: 104
}, Ev = { save_draft: "保存草稿", confirm: "批量确认", discard: "放弃修改", conflict: "值冲突" };
function Ov() {
  try {
    const u = localStorage.getItem(tm), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((N) => typeof N == "string") : ec;
  } catch {
    return ec;
  }
}
function Tv() {
  try {
    const u = localStorage.getItem(Fi), h = u ? JSON.parse(u) : null;
    if (h && typeof h == "object") {
      const N = {};
      for (const [o, T] of Object.entries(h))
        typeof T == "number" && T >= 56 && T <= 1e3 && (N[o] = T);
      return N;
    }
  } catch {
  }
  return {};
}
function zv() {
  try {
    const u = localStorage.getItem(sm), h = u ? JSON.parse(u) : null;
    if (Array.isArray(h) && h.length) return h.filter((N) => typeof N == "string");
  } catch {
  }
  return am;
}
function Av(u, h) {
  const N = u.filter((T) => h.includes(T) || bu.includes(T));
  let o = N.findIndex((T) => bu.includes(T));
  o < 0 && (o = N.length);
  for (const T of h)
    N.includes(T) || (N.splice(o, 0, T), o += 1);
  for (const T of bu) {
    if (N.includes(T)) continue;
    const U = N.indexOf("_actions");
    U >= 0 ? N.splice(U, 0, T) : N.push(T);
  }
  return N;
}
function Jt(u, h = 120) {
  const N = (u || "").replace(/\s+/g, " ").trim();
  return N.length > h ? N.slice(0, h) + "…" : N || "—";
}
function Kl(u, h) {
  var N;
  return zu[h] || ((N = u.find((o) => o.key === h)) == null ? void 0 : N.label) || h;
}
function Yf(u, h) {
  return u ? Object.entries(u).map(([N, o]) => `${Kl(h, N)}：${Jt(o, 30)}`).join("；") : "—";
}
function wu({ id: u }) {
  const [h, N] = r.useState(""), [o, T] = r.useState("");
  return r.useEffect(() => {
    let U = !1, V = "";
    return Yt("/api/v1" + Mn + "/images/" + encodeURIComponent(u)).then(async (A) => {
      if (!A.ok) throw Error("图片暂不可用");
      return A.blob();
    }).then((A) => {
      V = URL.createObjectURL(A), U ? URL.revokeObjectURL(V) : N(V);
    }).catch((A) => {
      U || T(A.message);
    }), () => {
      U = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function Gf({ api: u, findingId: h, large: N = !1 }) {
  const [o, T] = r.useState(null), [U, V] = r.useState("");
  return r.useEffect(() => {
    let A = !1;
    return T(null), V(""), u(Mn + "/findings/" + encodeURIComponent(h)).then((Y) => {
      A || T(Y.images);
    }).catch((Y) => {
      A || (V(Y.message), T([]));
    }), () => {
      A = !0;
    };
  }, [u, h]), U ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: U }) : o ? o.length ? /* @__PURE__ */ s.jsx("div", { className: N ? "history-images history-images-large" : "history-images", children: o.map((A, Y) => /* @__PURE__ */ s.jsxs("figure", { children: [
    /* @__PURE__ */ s.jsx(wu, { id: A.id }),
    /* @__PURE__ */ s.jsxs("figcaption", { children: [
      Jt(A.relation, 24),
      "｜",
      JSON.stringify(A.locator)
    ] })
  ] }, A.id + ":" + Y)) }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "该条目没有已关联的照片（无照片不代表原报告没有照片）。" }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "读取关联照片…" });
}
function Rv({ api: u }) {
  const [h, N] = r.useState(null), [o, T] = r.useState([]), [U, V] = r.useState("findings"), [A, Y] = r.useState([]), [v, D] = r.useState([]), [K, k] = r.useState([]), [se, je] = r.useState([]), [ye, _e] = r.useState(Ov), [Ce, xe] = r.useState(zv), [F, he] = r.useState(Tv), [ae, H] = r.useState(""), ve = r.useRef(null), Ae = r.useRef(!1), [Ge, Ze] = r.useState(0), [Xe, pe] = r.useState(""), [$e, X] = r.useState(""), [fe, y] = r.useState(!1), [Q, le] = r.useState(""), [we, m] = r.useState(""), [L, P] = r.useState(""), [te, re] = r.useState(""), [Z, $] = r.useState(0), [ze, ne] = r.useState(!1), [Ee, ct] = r.useState(!1), [Je, Pe] = r.useState([]), [We, Ue] = r.useState(/* @__PURE__ */ new Set()), [Re, ke] = r.useState(!1), [De, st] = r.useState(null), [et, ht] = r.useState({}), [ie, nt] = r.useState(null), [He, O] = r.useState(""), [w, I] = r.useState(null), [Se, Me] = r.useState(""), [lt, Fe] = r.useState(""), [B, oe] = r.useState(!0), [ce, Ye] = r.useState(!1), [b, ge] = r.useState(0), de = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], Qe = (h == null ? void 0 : h.fields) || de, vt = r.useMemo(() => Ce.filter((f) => ye.includes(f)), [Ce, ye]), M = de.length + zn.length, j = ye.filter((f) => de.some((G) => G.key === f) || zn.includes(f)).length, ue = (f) => F[f] || Cv[f] || 140, be = vt.reduce((f, G) => f + ue(G), 0), _ = Object.keys(F).length > 0 ? be : Math.max(be, Ge);
  r.useEffect(() => {
    const f = ve.current;
    if (!f || (Ze(f.clientWidth), typeof ResizeObserver > "u")) return;
    const G = new ResizeObserver(() => Ze(f.clientWidth));
    return G.observe(f), () => G.disconnect();
  }, [U]), r.useEffect(() => {
    if ((!ie || De) && !w) return;
    const f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const G = (Be) => {
      Be.key === "Escape" && (nt(null), I(null));
    };
    return window.addEventListener("keydown", G), () => {
      document.body.style.overflow = f, window.removeEventListener("keydown", G);
    };
  }, [ie, De, w]), r.useEffect(() => {
    let f = !1;
    return oe(!0), Fe(""), Promise.all([
      u(al + "/summary"),
      u(al + "/projects?limit=800"),
      u(al + "/drafts?limit=100")
    ]).then(([G, Be, mt]) => {
      f || (N(G), T(Be.items), k(mt.items), _e((zt) => {
        const Rs = /* @__PURE__ */ new Set([...G.editable_fields.map((ds) => ds.key), ...zn]), il = zt.filter((ds) => Rs.has(ds));
        return il.length ? il : ec.filter((ds) => Rs.has(ds));
      }), xe((zt) => Av(zt, G.editable_fields.map((Rs) => Rs.key))));
    }).catch((G) => {
      f || Fe(G.message);
    }).finally(() => {
      f || oe(!1);
    }), () => {
      f = !0;
    };
  }, [u, b]), r.useEffect(() => {
    if (U !== "findings") return;
    let f = !1;
    return oe(!0), Fe(""), u(al + "/findings?" + new URLSearchParams({
      q: te,
      project: Q,
      document_id: we,
      offset: String(Z),
      limit: "30"
    })).then((G) => {
      f || (Y(Ee ? G.items.filter((Be) => Be.draft_id) : G.items), ne(G.has_more));
    }).catch((G) => {
      f || Fe(G.message);
    }).finally(() => {
      f || oe(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, te, Q, we, Z, Ee, b]), r.useEffect(() => {
    if (U !== "reports") return;
    let f = !1;
    return oe(!0), Fe(""), u(al + "/reports?" + new URLSearchParams({ q: te, project: Q, offset: "0", limit: "100" })).then((G) => {
      f || (D(G.items), ne(!1));
    }).catch((G) => {
      f || Fe(G.message);
    }).finally(() => {
      f || oe(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, te, Q, b]), r.useEffect(() => {
    if (U !== "logs") return;
    let f = !1;
    return oe(!0), Fe(""), u(al + "/logs?limit=100").then((G) => {
      f || je(G.items);
    }).catch((G) => {
      f || Fe(G.message);
    }).finally(() => {
      f || oe(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, b]), r.useEffect(() => {
    Re && Ue(new Set(A.map((f) => f.id)));
  }, [A, Re]);
  function me(f) {
    _e(f);
    try {
      localStorage.setItem(tm, JSON.stringify(f));
    } catch {
    }
  }
  function Ve(f) {
    me(ye.filter((G) => G !== f));
  }
  function Ot(f, G) {
    const Be = G ? [...ye, f] : ye.filter((mt) => mt !== f);
    me(Be);
  }
  function qt(f) {
    xe(f);
    try {
      localStorage.setItem(sm, JSON.stringify(f));
    } catch {
    }
  }
  function Gt(f, G) {
    if (f.preventDefault(), f.stopPropagation(), f.pointerType === "mouse" && f.button !== 0) return;
    const Be = f.clientX, mt = f.currentTarget.closest("table"), zt = { ...F };
    if (mt)
      for (const Ls of Array.from(mt.querySelectorAll("thead th[data-col]"))) {
        const Ys = Ls.dataset.col;
        Ys && (zt[Ys] = Math.round(Ls.getBoundingClientRect().width));
      }
    const Rs = zt[G] || ue(G);
    Ae.current = !0, H(G), pe(""), X(""), document.body.classList.add("history-resizing"), he(zt);
    const il = (Ls) => {
      const Ys = Math.round(Math.max(56, Math.min(1e3, Rs + Ls.clientX - Be)));
      he({ ...zt, [G]: Ys });
    }, ds = () => {
      window.removeEventListener("pointermove", il), window.removeEventListener("pointerup", ds), window.removeEventListener("pointercancel", ds), Ae.current = !1, H(""), document.body.classList.remove("history-resizing"), he((Ls) => {
        try {
          localStorage.setItem(Fi, JSON.stringify(Ls));
        } catch {
        }
        return Ls;
      });
    };
    window.addEventListener("pointermove", il), window.addEventListener("pointerup", ds), window.addEventListener("pointercancel", ds);
  }
  function ot(f) {
    he((G) => {
      if (!(f in G)) return G;
      const Be = { ...G };
      delete Be[f];
      try {
        localStorage.setItem(Fi, JSON.stringify(Be));
      } catch {
      }
      return Be;
    });
  }
  function Nt() {
    he({});
    try {
      localStorage.removeItem(Fi);
    } catch {
    }
  }
  function g(f, G) {
    if (!f || !G || f === G) return;
    const Be = Ce.filter((zt) => zt !== f), mt = Be.indexOf(G);
    Be.splice(mt < 0 ? Be.length : mt, 0, f), qt(Be);
  }
  function Ne(f) {
    Ue((G) => {
      const Be = new Set(G);
      return Be.has(f) ? Be.delete(f) : Be.add(f), Be;
    });
  }
  function it() {
    Re ? (ke(!1), Ue(/* @__PURE__ */ new Set())) : (ke(!0), Ue(new Set(A.map((f) => f.id))));
  }
  function bt(f) {
    st(f);
    const G = {};
    for (const Be of gu) G[Be] = f[Be] || "";
    ht(G), Me(""), nt(null), O("");
  }
  async function x() {
    if (!De) return;
    const f = {};
    for (const G of gu) {
      const Be = De[G] || "";
      et[G] !== Be && (f[G] = et[G] || null);
    }
    if (!Object.keys(f).length) {
      Me("没有修改任何字段。");
      return;
    }
    Ye(!0), Fe("");
    try {
      await u(al + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: De.id, changes: f }) }), Me(`已保存草稿（${Object.keys(f).map((G) => Kl(de, G)).join("、")}），批量确认后覆盖数据库。`), st(null), ge((G) => G + 1);
    } catch (G) {
      Fe(G.message);
    } finally {
      Ye(!1);
    }
  }
  async function Oe(f) {
    if (!f.length) {
      Me("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${f.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      Ye(!0), Fe(""), Me("");
      try {
        const G = await u(al + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) });
        Me(`已确认写入 ${G.applied.length} 条${G.conflicts.length ? `；${G.conflicts.length} 条存在值冲突` : ""}。`), Pe([]), ge((Be) => Be + 1);
      } catch (G) {
        Fe(G.message);
      } finally {
        Ye(!1);
      }
    }
  }
  async function Te(f) {
    if (f.length) {
      Ye(!0), Fe("");
      try {
        await u(al + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) }), Pe([]), ge((G) => G + 1);
      } catch (G) {
        Fe(G.message);
      } finally {
        Ye(!1);
      }
    }
  }
  async function at(f) {
    nt(null), O("");
    try {
      const G = await u(Mn + "/findings/" + encodeURIComponent(f.id));
      nt(G);
    } catch (G) {
      O(G.message);
    }
  }
  async function Ht(f) {
    if (ie)
      try {
        const G = f || ie, Be = await Yt("/api/v1" + Mn + "/documents/" + encodeURIComponent(G.document_id) + "/original");
        if (!Be.ok) throw Error("原件暂不可用，请稍后重试。");
        const mt = URL.createObjectURL(await Be.blob()), zt = document.createElement("a");
        zt.href = mt, zt.download = G.original_name, zt.click(), setTimeout(() => URL.revokeObjectURL(mt), 1e3);
      } catch (G) {
        O(G.message);
      }
  }
  const us = r.useMemo(() => v, [v]), os = r.useMemo(() => K.map((f) => f.id), [K]);
  return /* @__PURE__ */ s.jsxs("div", { className: "risk-data", children: [
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "风险数据 ",
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "可编辑核验" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "历史报告解析成果与人工核验修改入口。" })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: B, onClick: () => ge((f) => f + 1), children: "刷新数据" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: (h == null ? void 0 : h.notice) || "正在读取历史报告数据…" }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-stats", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "问题条目 ",
          /* @__PURE__ */ s.jsx("b", { children: (h == null ? void 0 : h.findings) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "历史报告 ",
          /* @__PURE__ */ s.jsx("b", { children: (h == null ? void 0 : h.reports) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "工程项目 ",
          /* @__PURE__ */ s.jsx("b", { children: (h == null ? void 0 : h.projects) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "待确认修改 ",
          /* @__PURE__ */ s.jsx("b", { children: (h == null ? void 0 : h.pending_drafts) ?? "—" })
        ] })
      ] }),
      lt && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        lt,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ge((f) => f + 1), children: "重试" })
      ] }),
      Se && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: Se }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([f, G]) => /* @__PURE__ */ s.jsx("button", { className: U === f ? "button primary" : "button ghost", onClick: () => {
        V(f), $(0);
      }, children: G }, f)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (f) => {
          f.preventDefault(), re(L.trim()), $(0);
        }, children: [
          /* @__PURE__ */ s.jsx("label", { htmlFor: "history-query", children: "搜索" }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("input", { id: "history-query", value: L, onChange: (f) => P(f.target.value), maxLength: 100, placeholder: U === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: B, children: "搜索" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: Q, onChange: (f) => {
            le(f.target.value), $(0);
          }, children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目（",
              (h == null ? void 0 : h.projects) ?? "—",
              "）"
            ] }),
            o.map((f) => /* @__PURE__ */ s.jsxs("option", { value: f.name, children: [
              f.name,
              "（",
              f.findings,
              "）"
            ] }, f.name))
          ] })
        ] }),
        we && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          m(""), $(0);
        }, children: "清除报告筛选" }),
        U === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee, onChange: (f) => ct(f.target.checked) }),
          "只看待确认修改"
        ] }),
        U === "findings" && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => y((f) => !f), children: [
          "显示字段（",
          j,
          "/",
          M,
          "）"
        ] }),
        U === "findings" && /* @__PURE__ */ s.jsx("button", { className: Re ? "button primary" : "button secondary", onClick: it, children: Re ? "收起全部字段" : "展开全部字段" })
      ] }),
      fe && U === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        de.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(f.key), onChange: (G) => Ot(f.key, G.target.checked) }),
          f.label
        ] }, f.key)),
        /* @__PURE__ */ s.jsx("span", { className: "history-fieldsep", children: "其他列" }),
        zn.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(f), onChange: (G) => Ot(f, G.target.checked) }),
          zu[f]
        ] }, f)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => me(ec.filter((f) => de.some((G) => G.key === f) || zn.includes(f))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => qt(am), children: "恢复列顺序" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: Nt, children: "恢复列宽" })
      ] }),
      U === "findings" && /* @__PURE__ */ s.jsx("p", { className: "muted history-drag-tip", children: "提示：拖动表头调整列顺序；点击表头右侧 × 可隐藏该列（全部列均可隐藏，在“显示字段”中恢复）；点击任意行展开该条全部字段与关联照片。" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      U === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        K.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              K.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ce, onClick: () => Pe(Je.length === os.length ? [] : os), children: Je.length === os.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: ce || !Je.length, onClick: () => void Oe(Je), children: [
                "批量确认所选（",
                Je.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ce || !Je.length, onClick: () => void Te(Je), children: "放弃所选" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
            /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("th", {}),
              /* @__PURE__ */ s.jsx("th", { children: "报告" }),
              /* @__PURE__ */ s.jsx("th", { children: "问题描述（当前）" }),
              /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
              /* @__PURE__ */ s.jsx("th", { children: "更新时间" })
            ] }) }),
            /* @__PURE__ */ s.jsx("tbody", { children: K.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Je.includes(f.id), onChange: (G) => Pe(G.target.checked ? [...Je, f.id] : Je.filter((Be) => Be !== f.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Jt(f.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Jt(f.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Yf(f.changes, de) }),
              /* @__PURE__ */ s.jsx("td", { children: f.updated_at ? new Date(f.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, f.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { ref: ve, className: "table-wrap history-table-wrap" + (ae ? " history-resizing" : ""), "aria-busy": B, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", style: { width: _, minWidth: _ }, children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: vt.map((f) => /* @__PURE__ */ s.jsx(
            "th",
            {
              draggable: !0,
              "data-col": f,
              style: { width: ue(f), minWidth: ue(f) },
              className: "history-col-head" + (Xe === f ? " history-col-dragging" : "") + ($e === f ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (G) => {
                if (Ae.current) {
                  G.preventDefault();
                  return;
                }
                pe(f), G.dataTransfer.effectAllowed = "move", G.dataTransfer.setData("text/plain", f);
              },
              onDragOver: (G) => {
                G.preventDefault(), G.dataTransfer.dropEffect = "move", $e !== f && X(f);
              },
              onDragLeave: () => X(""),
              onDrop: (G) => {
                G.preventDefault(), g(Xe || G.dataTransfer.getData("text/plain"), f), pe(""), X("");
              },
              onDragEnd: () => {
                pe(""), X("");
              },
              children: /* @__PURE__ */ s.jsxs("span", { className: "history-th", children: [
                /* @__PURE__ */ s.jsx("span", { className: "history-th-label", children: Kl(de, f) }),
                /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-col-hide", title: "点击隐藏该列（可在“显示字段”中恢复）", "aria-label": `隐藏${Kl(de, f)}列`, draggable: !1, onMouseDown: (G) => G.stopPropagation(), onDragStart: (G) => G.preventDefault(), onClick: (G) => {
                  G.stopPropagation(), Ve(f);
                }, children: "×" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-col-resize", role: "separator", "aria-orientation": "vertical", "aria-label": "拖动调节列宽（双击恢复该列默认宽度）", title: "拖动调节列宽；双击恢复该列默认宽度", onPointerDown: (G) => Gt(G, f), onDoubleClick: (G) => {
                  G.preventDefault(), G.stopPropagation(), ot(f);
                }, onDragStart: (G) => G.preventDefault() })
              ] })
            },
            f
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            A.map((f) => {
              const G = We.has(f.id);
              return /* @__PURE__ */ s.jsxs(r.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (f.draft_id ? "history-dirty" : "") + " history-row", onClick: (Be) => {
                  Be.target.closest("button, a, input, textarea, select, summary") || Ne(f.id);
                }, children: vt.map((Be) => {
                  if (Be === "_actions") return /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                    /* @__PURE__ */ s.jsx("button", { className: "button secondary icon-button", title: "编辑", "aria-label": "编辑", onClick: () => bt(f), children: /* @__PURE__ */ s.jsx(fv, { size: 15 }) }),
                    /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: "查看证据", "aria-label": "查看证据", onClick: () => void at(f), children: /* @__PURE__ */ s.jsx(uv, { size: 15 }) }),
                    /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: G ? "收起" : "展开", "aria-label": G ? "收起" : "展开", onClick: () => Ne(f.id), children: G ? /* @__PURE__ */ s.jsx(Jj, { size: 15 }) : /* @__PURE__ */ s.jsx(Qj, { size: 15 }) })
                  ] }, Be);
                  if (Be === "_photos") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.image_count ? /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => I(f), children: [
                    "查看 ",
                    f.image_count,
                    " 张"
                  ] }) : /* @__PURE__ */ s.jsx("span", { className: "muted", children: "—" }) }, Be);
                  if (Be === "_source") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.original_name || "", children: Jt(f.original_name, 22) }, Be);
                  if (Be === "_status") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Jt(f.review_state, 14) }, Be);
                  const mt = f[Be], zt = Be === "problem_description", Rs = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "source_category", "source_grade", "hazard_category"].includes(Be);
                  return /* @__PURE__ */ s.jsx("td", { title: mt || "", className: zt ? "history-cell history-cell-clamp" : Rs ? "history-cell history-cell-nowrap" : "history-cell", children: zt ? mt || "—" : Jt(mt, 80) }, Be);
                }) }),
                G && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: vt.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: de.map((Be) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: Be.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: f[Be.key] || "—" })
                  ] }, Be.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    Jt(f.original_name, 100),
                    "｜状态：",
                    Jt(f.review_state, 20),
                    f.draft_id ? "｜有待确认修改" : ""
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "history-expanded-photos", children: [
                    /* @__PURE__ */ s.jsxs("h4", { children: [
                      "关联照片（",
                      f.image_count ?? 0,
                      "）"
                    ] }),
                    /* @__PURE__ */ s.jsx(Gf, { api: u, findingId: f.id })
                  ] })
                ] }) })
              ] }, f.id);
            }),
            !A.length && !B && !lt && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: vt.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Z === 0, onClick: () => $(Math.max(0, Z - 30)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            Z / 30 + 1,
            " 页 · 本页 ",
            A.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !ze, onClick: () => $(Z + 30), children: "下一页" })
        ] })
      ] }),
      U === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": B, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          us.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: Jt(f.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: Jt(f.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: Jt(f.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: f.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                m(f.document_id), V("findings"), $(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
                Yt("/api/v1" + Mn + "/documents/" + encodeURIComponent(f.document_id) + "/original").then(async (G) => {
                  if (!G.ok) throw Error("原件暂不可用");
                  const Be = URL.createObjectURL(await G.blob()), mt = document.createElement("a");
                  mt.href = Be, mt.download = f.original_name, mt.click(), setTimeout(() => URL.revokeObjectURL(Be), 1e3);
                }).catch((G) => Fe(G.message));
              }, children: "原件" })
            ] })
          ] }, f.document_id)),
          !us.length && !B && !lt && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      U === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": B, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" }),
          /* @__PURE__ */ s.jsx("th", { children: "报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作人" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          se.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: new Date(f.created_at).toLocaleString("zh-CN") }),
            /* @__PURE__ */ s.jsx("td", { children: Ev[f.action] || f.action }),
            /* @__PURE__ */ s.jsx("td", { children: Jt(f.original_name, 28) || Jt(f.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Yf(f.changes, de) }),
            /* @__PURE__ */ s.jsx("td", { children: Jt(f.actor, 30) })
          ] }, f.id)),
          !se.length && !B && !lt && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    De && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          st(null), nt(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Jt(De.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: gu.map((f) => /* @__PURE__ */ s.jsxs("label", { className: f === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Kl(de, f) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: f === "problem_description" ? 3 : 2, value: et[f] || "", onChange: (G) => ht({ ...et, [f]: G.target.value }) })
      ] }, f)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ce, onClick: () => void x(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => st(null), children: "取消" })
      ] }),
      ie && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Ht(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: Qe.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ie.fields[f.key] || "—" })
        ] }, f.key)) }),
        ie.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Kl(de, f.field_key),
            "：",
            Jt(f.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        ie.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            ie.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ie.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(wu, { id: f.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
          ] }, f.id + ":" + G)) })
        ] })
      ] })
    ] }),
    ie && !De && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => nt(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: ie.original_name }),
            "｜解析版本时间：",
            new Date(ie.parsed_at).toLocaleString("zh-CN")
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => nt(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Ht(), children: "下载原报告" }),
        ie.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: ie.sources.map((f) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Ht(f), children: f.original_name }) }, f.document_id)) })
        ] }),
        He && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: He }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: Qe.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ie.fields[f.key] || "—" })
        ] }, f.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        ie.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Kl(de, f.field_key),
            "：",
            Jt(f.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          ie.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ie.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(wu, { id: f.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
        ] }, f.id + ":" + G)) })
      ] })
    ] }) }),
    w && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "关联照片", onClick: () => I(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal history-photo-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "关联照片" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Jt(w.original_name, 90) }),
            "｜问题：",
            Jt(w.problem_description, 90)
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => I(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-modal-body", children: /* @__PURE__ */ s.jsx(Gf, { api: u, findingId: w.id, large: !0 }) })
    ] }) })
  ] });
}
function Mt(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((N) => ["admin", "reviewer"].includes(N)) : h === "training.manage" ? u.roles.some((N) => ["admin", "teacher"].includes(N)) : h === "training.review" ? u.roles.some((N) => ["admin", "teacher", "reviewer"].includes(N)) : !0 : !1;
}
const nl = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Xf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Qf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function yu(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((o) => o.text).join(`
`), h.facts.map((o) => o.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((o) => o.evidence_ids).join("、"), h.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, o, T]) => o !== T);
}
function Uv({ api: u, path: h, navigate: N, projects: o, identity: T }) {
  var M;
  const [U, V] = r.useState(!0), [A, Y] = r.useState(!1), [v, D] = r.useState(""), [K, k] = r.useState(""), [se, je] = r.useState(0), [ye, _e] = r.useState([]), [Ce, xe] = r.useState([]), [F, he] = r.useState([]), [ae, H] = r.useState("knowledge_revision"), [ve, Ae] = r.useState(""), [Ge, Ze] = r.useState(""), [Xe, pe] = r.useState(""), [$e, X] = r.useState(null), [fe, y] = r.useState([]), [Q, le] = r.useState(null), [we, m] = r.useState("resolved"), [L, P] = r.useState(""), [te, re] = r.useState(""), [Z, $] = r.useState(((M = o.find((j) => Mt(j, "knowledge.process"))) == null ? void 0 : M.id) || ""), [ze, ne] = r.useState([]), [Ee, ct] = r.useState([]), [Je, Pe] = r.useState("case_card"), [We, Ue] = r.useState("normal"), [Re, ke] = r.useState(null), [De, st] = r.useState(sessionStorage.getItem("b03-last-job-" + T) || ""), [et, ht] = r.useState(null), [ie, nt] = r.useState(null), [He, O] = r.useState(null), [w, I] = r.useState(""), [Se, Me] = r.useState(!1), lt = /^\/knowledge\/[^/]+\/edit$/.test(h), Fe = o.some((j) => Mt(j, "knowledge.process")), B = o.some((j) => Mt(j, "knowledge.review")), oe = h.startsWith("/quality"), ce = h === "/reviews";
  r.useEffect(() => {
    pe(""), y([]), Ze(""), Ae(""), D(""), k(""), Me(!1), I("");
  }, [h]), r.useEffect(() => {
    let j = !1;
    V(!0), D(""), nt(null), O(null);
    async function ue() {
      try {
        if (oe) {
          const be = await u(`/quality/issues?limit=20${ve ? "&rule_code=" + ve : ""}${Ge ? "&status=" + Ge : ""}${Xe ? "&cursor=" + encodeURIComponent(Xe) : ""}`);
          if (j) return;
          xe(be.items), he(be.summary), X(be.next_cursor);
        } else if (lt) {
          const be = await u(h.replace("/edit", ""));
          if (j) return;
          nt(be), O(structuredClone(be.content));
        } else if (ce) {
          const be = await u(`/reviews?object_type=${ae}&state=${Ge || "pending_review"}${Xe ? "&cursor=" + encodeURIComponent(Xe) : ""}`);
          if (j) return;
          _e(be.items), X(be.next_cursor);
        } else {
          const be = await u(`/knowledge?limit=20${Ge ? "&state=" + Ge : ""}${Xe ? "&cursor=" + encodeURIComponent(Xe) : ""}`);
          if (j) return;
          if (_e(be.items), X(be.next_cursor), Fe && Z) {
            const rt = await u("/knowledge/source-options?project_id=" + Z);
            j || ne(rt.items);
          }
        }
      } catch (be) {
        j || D(be.message);
      } finally {
        j || V(!1);
      }
    }
    return ue(), () => {
      j = !0;
    };
  }, [h, Ge, ve, Xe, se, Z, ae]), r.useEffect(() => {
    ct([]), ke(null);
  }, [Z, Je, We]), r.useEffect(() => {
    if (!De || oe || lt || ce || !Fe) return;
    let j = !1;
    const ue = () => {
      u("/knowledge/generation-jobs/" + De).then((rt) => {
        j || (ht(rt), rt.status === "succeeded" && je((_) => _ + 1));
      }).catch((rt) => {
        j || D(rt.message);
      });
    };
    ue();
    const be = setInterval(() => {
      (!et || ["queued", "running", "retrying"].includes(et.status)) && ue();
    }, 1800);
    return () => {
      j = !0, clearInterval(be);
    };
  }, [De, h, et == null ? void 0 : et.status]);
  const Ye = async (j) => {
    Y(!0), D(""), k("");
    try {
      await j();
    } catch (ue) {
      D(ue.message);
    } finally {
      Y(!1);
    }
  }, b = () => ({ record_version_ids: Ee, type: Je, template_version: "mock-v1", mock_scenario: We }), ge = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !fe.length, onClick: () => {
        pe(fe.at(-1) || ""), y(fe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !$e, onClick: () => {
        y([...fe, Xe]), pe($e || "");
      }, children: "下一页" })
    ] })
  ] }), de = ie && Mt(o.find((j) => j.id === ie.project_id), "knowledge.process"), Qe = ie && Mt(o.find((j) => j.id === ie.project_id), "knowledge.review"), vt = (j) => Ye(async () => {
    if (!ie) return;
    const ue = j === "submit" ? `/knowledge/${ie.id}/submit-review` : `/reviews/${ie.revision_id}/${j}`;
    await u(ue, { method: "POST", body: JSON.stringify({ row_version: ie.row_version, revision_id: ie.revision_id, reason: w, evidence_checked: Se }) }), k(j === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), je((be) => be + 1), Me(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Un, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    v && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      v,
      /* @__PURE__ */ s.jsx("button", { onClick: () => je((j) => j + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => N("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: oe ? "selected" : "", onClick: () => N("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !oe && !ce ? "selected" : "", onClick: () => N("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ce ? "selected" : "", onClick: () => N("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: U, onClick: () => je((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    U ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : oe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Xf).map(([j, ue]) => /* @__PURE__ */ s.jsxs("button", { className: ve === j ? "panel selected-quality" : "panel", "aria-pressed": ve === j, onClick: () => {
        Ae(ve === j ? "" : j), Ze("open"), pe(""), y([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: ue }),
        /* @__PURE__ */ s.jsx("strong", { children: F.filter((be) => be.rule_code === j && be.status === "open").reduce((be, rt) => be + rt.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, j)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Ge, onChange: (j) => {
            Ze(j.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: nl[j] }, j))
          ] })
        ] }),
        Ce.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ce.map((j) => {
            var ue, be;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => N("/records/" + j.record_id), children: j.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Xf[j.rule_code] || j.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                j.message,
                j.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (ue = j.annotations.at(-1)) == null ? void 0 : ue.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: nl[j.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((be = o.find((rt) => rt.id === j.project_id)) != null && be.can_run), onClick: () => {
                le(j), P(""), re("");
              }, children: "核查处理" }) })
            ] }, j.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ge
      ] })
    ] }) : lt && ie && He ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Qf[ie.type],
            " · v",
            ie.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            nl[ie.state],
            " · 生成适配器：",
            ie.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => N("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      ie.source.version !== ie.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        ie.source.version,
        "更新到v",
        ie.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N((ie.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + ie.source.record_id), children: ie.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              ie.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(ie.source.raw_fields.description || ie.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(ie.source.effective_fields.description || "缺失") }),
            ie.source.versions && ie.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                ie.source.versions.length,
                "条）"
              ] }),
              ie.source.versions.map((j) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  j.version,
                  " · ",
                  j.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/records/" + j.record_id), children: "打开风险记录" })
              ] }, j.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              He.project_name,
              " · ",
              He.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            ie.source.evidence.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[j.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: j.id })
            ] }, j.id)),
            ie.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              ie.source.annotations.map((j, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
                j.reason,
                " · ",
                JSON.stringify(j.value)
              ] }, ue))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel card-editor", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "结构化知识候选" }),
            /* @__PURE__ */ s.jsx("span", { children: "内容变更保存为新版本" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "标题",
              /* @__PURE__ */ s.jsx("input", { value: He.title, disabled: !de, onChange: (j) => O({ ...He, title: j.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            He.facts.map((j, ue) => /* @__PURE__ */ s.jsxs("label", { children: [
              j.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !de, value: j.text, onChange: (be) => O({ ...He, facts: He.facts.map((rt, _) => _ === ue ? { ...rt, text: be.target.value, source_kind: "human_annotation" } : rt) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                j.evidence_ids.join("、")
              ] })
            ] }, ue)),
            He.construction_points && He.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                He.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: He.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              He.construction_points.map((j, ue) => {
                var be;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    j.title,
                    " · ",
                    j.stage === "preparation" ? "施工准备" : j.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !de, value: j.content, onChange: (rt) => {
                      var _;
                      return O({ ...He, construction_points: (_ = He.construction_points) == null ? void 0 : _.map((me, Ve) => Ve === ue ? { ...me, content: rt.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !de, value: j.inspection_method, onChange: (rt) => {
                      var _;
                      return O({ ...He, construction_points: (_ = He.construction_points) == null ? void 0 : _.map((me, Ve) => Ve === ue ? { ...me, inspection_method: rt.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !de, value: j.common_mistakes, onChange: (rt) => {
                      var _;
                      return O({ ...He, construction_points: (_ = He.construction_points) == null ? void 0 : _.map((me, Ve) => Ve === ue ? { ...me, common_mistakes: rt.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: j.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    j.evidence_ids.join("、")
                  ] }),
                  (be = j.source_quotes) == null ? void 0 : be.map((rt, _) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: rt.text })
                  ] }, _))
                ] }, ue);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !de, value: He.suggestions.join(`
`), onChange: (j) => O({ ...He, suggestions: j.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            He.standards.length ? He.standards.map((j, ue) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: j.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                j.clause || "未提供",
                " · 版本：",
                j.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: j.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !de, checked: j.verification_status === "not_used", onChange: (be) => O({ ...He, standards: He.standards.map((rt, _) => _ === ue ? { ...rt, verification_status: be.target.checked ? "not_used" : "pending_verification" } : rt) }) }),
                "明确不采用该依据"
              ] })
            ] }, ue)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            yu(ie.content, He).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              yu(ie.content, He).map(([j, ue, be]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: j }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  ue
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  be
                ] })
              ] }, j))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (j) => I(j.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              de && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A || !w.trim(), onClick: () => void Ye(async () => {
                await u(`/knowledge/${ie.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: ie.row_version, revision_id: ie.revision_id, content: He, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), je((j) => j + 1);
              }), children: "保存新草稿版本" }),
              de && ["draft", "changes_requested"].includes(ie.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !w.trim() || JSON.stringify(He) !== JSON.stringify(ie.content), onClick: () => void vt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Qe && ie.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se, onChange: (j) => Me(j.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !Se || !w.trim() || JSON.stringify(He) !== JSON.stringify(ie.content), onClick: () => void vt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: A || !w.trim(), onClick: () => void vt("request-changes"), children: "退回修改" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与审核轨迹" }),
          /* @__PURE__ */ s.jsx("span", { children: "审核准确关联到具体版本" })
        ] }),
        ie.revisions.map((j, ue) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            j.version,
            " · ",
            nl[j.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            j.content.facts.map((be) => be.text).join("；")
          ] }),
          ie.revisions[ue + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              ie.revisions[ue + 1].version,
              "的修改："
            ] }),
            yu(ie.revisions[ue + 1].content, j.content).map(([be, rt, _]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                rt
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                _
              ] })
            ] }, be))
          ] })
        ] }, j.id)),
        ie.review_actions.map((j, ue) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            j.version,
            " · ",
            nl[j.action] || j.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(j.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            j.reviewer.slice(0, 8)
          ] })
        ] }, ue))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ce && Fe && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Z, onChange: (j) => $(j.target.value), children: o.filter((j) => Mt(j, "knowledge.process")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: Je, onChange: (j) => Pe(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            ct(ze.slice(0, 20).map((j) => j.record_version_id)), ke(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: ze.length ? ze.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee.includes(j.record_version_id), onChange: (ue) => {
              ct(ue.target.checked ? [...Ee, j.record_version_id] : Ee.filter((be) => be !== j.record_version_id)), ke(null);
            } }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              j.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "来源v",
                j.current_version,
                " · ",
                { detail: "明细", review: "复查", summary: "汇总" }[j.record_kind] || j.record_kind
              ] })
            ] })
          ] }, j.id)) : /* @__PURE__ */ s.jsx("p", { children: "当前项目尚无可用风险数据，请先完成历史数据接入。" }) }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "模拟校验场景（可选）" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "结构验证",
              /* @__PURE__ */ s.jsxs("select", { value: We, onChange: (j) => Ue(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: A || !Ee.length || Ee.length > 20, onClick: () => void Ye(async () => {
              ke(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              Ee.length,
              "条）"
            ] }),
            Re && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: A, onClick: () => void Ye(async () => {
              const j = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              ht(null), st(j.job_id), sessionStorage.setItem("b03-last-job-" + T, j.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              Re.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(Ol, { size: 15 })
            ] })
          ] }),
          Re && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: Re.items.map((j, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
            j.description,
            " · 来源问题 ",
            j.quality_issue_count,
            "项"
          ] }, ue)) }),
          et && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              et.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              et.counts.created,
              " · 复用 ",
              et.counts.skipped,
              " · 单项失败 ",
              et.counts.failed
            ] }),
            et.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: et.error }),
            et.items.map((j, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.error || nl[j.outcome],
              " ",
              j.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/knowledge/" + j.item_id + "/edit"), children: "打开知识卡" })
            ] }, ue)),
            et.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A, onClick: () => void Ye(async () => {
              await u("/jobs/" + et.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: et.row_version }) }), ht(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "审核待办" : "知识候选列表" }),
          ce && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ae, onChange: (j) => {
            H(j.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Ge, onChange: (j) => {
            Ze(j.target.value), pe(""), y([]);
          }, children: [
            !ce && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ce ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: nl[j] }, j))
          ] })
        ] }),
        ce && !B ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : ye.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ye.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.title }),
            /* @__PURE__ */ s.jsx("td", { children: Qf[j.type] }),
            /* @__PURE__ */ s.jsx("td", { children: nl[j.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N(j.object_type === "question_revision" ? "/training/questions/" + j.id : j.object_type === "retrospective_revision" ? "/retrospectives/" + j.id + "/review" : "/knowledge/" + j.id + "/edit"), children: ce ? "打开审核" : "核查与编辑" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        ge
      ] })
    ] }),
    Q && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => le(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: Q.message }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ s.jsx("select", { value: we, onChange: (j) => m(j.target.value), children: ["resolved", "ignored", "open"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: nl[j] }, j)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: L, onChange: (j) => P(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: te, onChange: (j) => re(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !L.trim(), onClick: () => void Ye(async () => {
        await u("/quality/issues/" + Q.id, { method: "PATCH", body: JSON.stringify({ row_version: Q.row_version, status: we, reason: L, annotation: te || null }) }), le(null), je((j) => j + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Zf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Dv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", Mv = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", _u = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function qv({ identity: u, path: h, projects: N, navigate: o }) {
  var oe, ce, Ye, b, ge, de, Qe, vt;
  const [T, U] = r.useState(((oe = N[0]) == null ? void 0 : oe.id) || ""), [V, A] = r.useState("generic"), [Y, v] = r.useState(""), [D, K] = r.useState([]), [k, se] = r.useState({}), [je, ye] = r.useState([]), [_e, Ce] = r.useState([]), [xe, F] = r.useState("mock-hash-64"), [he, ae] = r.useState([]), [H, ve] = r.useState(null), [Ae, Ge] = r.useState(""), [Ze, Xe] = r.useState("extractive"), [pe, $e] = r.useState(null), [X, fe] = r.useState(null), [y, Q] = r.useState(null);
  r.useEffect(() => () => {
    y && URL.revokeObjectURL(y);
  }, [y]), r.useEffect(() => {
    Q(null);
  }, [T, h]);
  const [le, we] = r.useState(null);
  r.useEffect(() => {
    we(null);
  }, [h]);
  const [m, L] = r.useState(""), [P, te] = r.useState("useful"), [re, Z] = r.useState(""), [$, ze] = r.useState(!1), [ne, Ee] = r.useState(!0), [ct, Je] = r.useState(""), [Pe, We] = r.useState(""), [Ue, Re] = r.useState(0), [ke, De] = r.useState(""), [st, et] = r.useState(null), [ht, ie] = r.useState([]), nt = r.useRef("");
  nt.current = [u, h, T, V, Y, Ae, Ze, le].join("|");
  const He = h === "/releases", O = h === "/search", w = h === "/knowledge/library", I = Mt(N.find((M) => M.id === T), "knowledge.publish"), Se = !He && !O && !w ? h.split("/")[2] : null;
  async function Me(M, j = {}) {
    const ue = await Yt("/api/v1" + M, { ...j, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...j.headers } }), be = await ue.json();
    if (!ue.ok) throw new Error(be.message || "请求失败，请重试。");
    return be;
  }
  r.useEffect(() => {
    Ce([]), $e(null), fe(null), Je(""), We(""), De(""), ie([]);
  }, [T, h, V, Y]), r.useEffect(() => {
    let M = !1;
    return Ee(!0), Je(""), ve(null), (async () => {
      try {
        if (He) {
          const ue = await Me(`/releases?project_id=${T}${ke ? "&cursor=" + encodeURIComponent(ke) : ""}`);
          if (M) return;
          K(ue.items), se(ue.active_ids), et(ue.next_cursor);
          const be = await Me("/releases/options?project_id=" + T);
          M || ye(be.items);
        } else if (w) {
          const ue = await Me(`/knowledge/library?project_id=${T}${V ? "&scene_code=" + V : ""}${Y ? "&card_type=" + Y : ""}${ke ? "&after_id=" + ke : ""}`);
          M || (ae(ue.items), et(ue.next_cursor));
        } else if (Se) {
          const ue = await Me("/published/knowledge/" + Se + (le ? "?revision_id=" + le : ""));
          M || ve(ue);
        }
      } catch (ue) {
        M || Je(ue.message);
      } finally {
        M || Ee(!1);
      }
    })(), () => {
      M = !0;
    };
  }, [T, h, V, Y, Ue, ke, le]), r.useEffect(() => {
    if (!He || !D.some((j) => ["queued", "building"].includes(j.state))) return;
    const M = setInterval(() => Re((j) => j + 1), 1800);
    return () => clearInterval(M);
  }, [He, D]);
  const lt = async (M) => {
    ze(!0), Je(""), We("");
    try {
      await M();
    } catch (j) {
      Je(j.message);
    } finally {
      ze(!1);
    }
  }, Fe = (M, j, ue = !1) => lt(async () => {
    const be = nt.current;
    Q(null), fe(null);
    const rt = await Me("/published/evidence/" + M + "?revision_id=" + j + (ue ? "&historical=true" : ""));
    if (be === nt.current && (fe(rt), rt.has_image)) {
      const _ = await Yt("/api/v1/published/evidence/" + M + "/content?revision_id=" + j + (ue ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!_.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const me = await _.blob();
      be === nt.current && Q(URL.createObjectURL(me));
    }
  }), B = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !ht.length || ne, onClick: () => {
        De(ht.at(-1) || ""), ie(ht.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !st || ne, onClick: () => {
        ie([...ht, ke]), De(st || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Pi, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || Se ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: O ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        N.some((M) => Mt(M, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: He ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        fe(null), $e(null), Re((M) => M + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ct && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      ct
    ] }),
    Pe && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      Pe
    ] }),
    !Se && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: T, onChange: (M) => U(M.target.value), children: N.map((M) => /* @__PURE__ */ s.jsx("option", { value: M.id, children: M.name }, M.id)) })
      ] }),
      !He && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: V, onChange: (M) => A(M.target.value), children: [
            w && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: Y, onChange: (M) => v(M.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : He ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      I && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: je.length ? je.map((M) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e.includes(M.revision_id), onChange: (j) => Ce(j.target.checked ? [..._e, M.revision_id] : _e.filter((ue) => ue !== M.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: M.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              _u(M.type),
              " · 审核版本 v",
              M.version
            ] })
          ] })
        ] }, M.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: xe, onChange: (M) => F(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: $ || !_e.length, onClick: () => void lt(async () => {
            await Me("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: T, revision_ids: _e, embedding_model: xe }) }), Ce([]), We("发布集合已固定，处理服务正在构建索引。"), Re((M) => M + 1);
          }), children: [
            "构建发布 · ",
            _e.length,
            " 张"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "构建失败不会替换当前启用版本" })
        ] }),
        D.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: D.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Zf[M.state] || M.state }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                new Date(M.created_at).toLocaleString("zh-CN"),
                " · ",
                M.entries.length,
                " 张卡片 · ",
                M.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "批次 ",
                M.id.slice(0, 8),
                M.build_ms !== null ? ` · 构建 ${M.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                M.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(M.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: $, onClick: () => void lt(async () => {
                await Me("/releases/" + M.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: M.row_version, expected_active_id: k[T] || null }) }), We("发布已启用，知识库与检索使用同一发布集合。"), Re((j) => j + 1);
              }), children: "启用发布" }),
              M.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $, onClick: () => void lt(async () => {
                await Me("/jobs/" + M.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: M.job_row_version }) }), Re((j) => j + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          M.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: M.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            M.entries.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.revision_id.slice(0, 8),
              " · ",
              Zf[j.state] || j.state,
              j.error ? " · " + j.error : ""
            ] }, j.revision_id))
          ] })
        ] }, M.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        B
      ] })
    ] }) : w ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ s.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      he.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: he.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          _u(M.type),
          " · v",
          M.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: M.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + M.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(tv, { size: 15 })
        ] })
      ] }, M.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Pi, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      B
    ] }) : O ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (M) => {
        M.preventDefault(), lt(async () => {
          const j = nt.current;
          $e(null), fe(null);
          const ue = await Me("/search", { method: "POST", body: JSON.stringify({ project_id: T, question: Ae, scene_code: V, card_type: Y || null, answer_mode: Ze }) });
          j === nt.current && $e(ue);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Ae, onChange: (M) => {
          Ge(M.target.value), $e(null), fe(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Ze, onChange: (M) => {
              Xe(M.target.value), $e(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Ut && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: $ || !Ae.trim(), children: [
            /* @__PURE__ */ s.jsx(gv, { size: 17 }),
            $ ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      pe && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: pe.status === "answered" ? "找到有据内容" : pe.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            pe.latency_ms,
            " ms · ",
            pe.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          pe.answer_blocks.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M.text }, j)),
          pe.missing_conditions.map((M) => /* @__PURE__ */ s.jsx("p", { children: M }, M)),
          pe.warnings.map((M) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: M.message }, M.code))
        ] }),
        pe.results.map((M, j) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            j + 1,
            " · ",
            M.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + M.id), children: M.title }),
          /* @__PURE__ */ s.jsx("p", { children: M.text }),
          /* @__PURE__ */ s.jsx("div", { children: pe.citations.filter((ue) => M.citation_ids.includes(ue.citation_id)).map((ue) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: $, onClick: () => void Fe(ue.evidence_id, ue.knowledge_revision_id), children: [
            "打开来源：",
            ue.source_title
          ] }, ue.citation_id)) })
        ] }, M.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (M) => {
          M.preventDefault(), lt(async () => {
            await Me("/search/" + pe.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: P, comment: re }) }), We("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: P, onChange: (M) => te(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: re, maxLength: 1e3, onChange: (M) => Z(M.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $, children: "保存反馈" })
        ] })
      ] })
    ] }) : H && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        H.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        _u(H.type),
        " · v",
        H.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: H.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ce = N.find((M) => M.id === H.project_id)) == null ? void 0 : ce.name) || H.project_id,
        " · ",
        Dv(H.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Ye = H.content) == null ? void 0 : Ye.facts.map((M, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: M.text }),
        /* @__PURE__ */ s.jsx("small", { children: M.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { disabled: $, className: "citation-button", onClick: () => void Fe(ue, H.revision_id, H.is_current_release === !1), children: "打开来源证据" }, ue)) })
      ] }, j)),
      ((b = H.content) == null ? void 0 : b.construction_points) && H.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          H.content.category_name || "通用"
        ] }),
        H.content.construction_points.map((M, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            M.title,
            " · ",
            M.stage === "preparation" ? "施工准备" : M.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: M.content }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "检查方法：",
            M.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "常见问题：",
            M.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ s.jsx("small", { children: M.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void Fe(ue, H.revision_id, H.is_current_release === !1), children: "核对要点来源" }, ue)) })
        ] }, j))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((ge = H.content) == null ? void 0 : ge.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (de = H.content) == null ? void 0 : de.suggestions.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M }, j)),
      (Qe = H.content) != null && Qe.standards.length ? H.content.standards.map((M, j) => /* @__PURE__ */ s.jsxs("p", { children: [
        M.name,
        " ",
        M.clause,
        " · ",
        M.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, j)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          H.release_id
        ] }),
        (vt = H.versions) == null ? void 0 : vt.map((M) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          we(M.id), fe(null);
        }, children: [
          "查看已发布 v",
          M.version
        ] }, M.id)),
        /* @__PURE__ */ s.jsx("p", { children: H.history_note })
      ] }),
      Mt(N.find((M) => M.id === H.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: m, maxLength: 2e3, onChange: (M) => L(M.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: $ || !m.trim(), onClick: () => void lt(async () => {
          await Me("/knowledge/" + H.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: H.row_version, reason: m }) }), ve(null), fe(null), We("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    X && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          X.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => fe(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: X.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: X.description || "来源描述缺失" }),
        y && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: y, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          Mv(X.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: X.note })
      ] })
    ] })
  ] });
}
const An = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, nm = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, ku = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Hv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, Cu = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, Eu = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, Dn = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", Bv = (u) => JSON.stringify(u, null, 2), Lv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function Aa(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((N) => typeof N != "object") ? u.join("、") : u.map((N, o) => `第${o + 1}条
${Aa(N)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([N, o]) => `${Lv[N] || ku[N] || N}：${Aa(o, N)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return Dn(u);
    if (h === "actor_role" || h === "role") return Eu(u);
    if (h === "event_type") return nm[u] || u;
    if (h === "evidence_type") return Cu[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const Yv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? Bv(u) : "未补充说明";
};
function Gv({ identity: u, path: h, projects: N, navigate: o }) {
  var He, O, w, I, Se, Me, lt, Fe, B, oe, ce, Ye;
  const T = h === "/task-packages/import", U = !T && h !== "/task-packages" ? h.split("/")[2] : null, [V, A] = r.useState(((He = N[0]) == null ? void 0 : He.id) || ""), [Y, v] = r.useState(""), [D, K] = r.useState([]), [k, se] = r.useState(null), [je, ye] = r.useState(""), [_e, Ce] = r.useState(null), [xe, F] = r.useState([]), [he, ae] = r.useState([]), [H, ve] = r.useState([]), [Ae, Ge] = r.useState("complete"), [Ze, Xe] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [pe, $e] = r.useState(""), [X, fe] = r.useState(null), [y, Q] = r.useState(""), [le, we] = r.useState(""), [m, L] = r.useState(!0), [P, te] = r.useState(!1), [re, Z] = r.useState(0), [$, ze] = r.useState(""), [ne, Ee] = r.useState(null), ct = r.useRef(null), Je = r.useRef(null), Pe = r.useRef("");
  Pe.current = [u, h, V, Ae, Ze, pe].join("|");
  const We = N.some((b) => b.permissions != null), Ue = !We && Mt(N.find((b) => b.id === V), "imports.create"), Re = k && !We && Mt(N.find((b) => b.id === k.project_id), "imports.withdraw"), ke = k && !We && Mt(N.find((b) => b.id === k.project_id), "imports.create");
  async function De(b, ge = {}) {
    const de = await Yt("/api/v1/task-packages" + b, {
      ...ge,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...ge.headers }
    }), Qe = await de.json().catch(() => ({}));
    if (!de.ok) throw new Error(Qe.message || "接入服务暂未就绪，请稍后刷新。");
    return Qe;
  }
  const st = async (b) => {
    te(!0), Q(""), we("");
    try {
      await b();
    } catch (ge) {
      Q(ge.message);
    } finally {
      te(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + u, Ze);
  }, [Ze, u]), r.useEffect(() => () => {
    ne != null && ne.url && URL.revokeObjectURL(ne.url);
  }, [ne == null ? void 0 : ne.url]), r.useEffect(() => {
    ye(""), F([]), Q(""), we(""), Ee(null), ze(""), fe(null);
  }, [h, V, Y]), r.useEffect(() => {
    let b = !1;
    return L(!0), se(null), Q(""), (async () => {
      try {
        if (T && Ut) {
          const de = await Yt("/api/v1/platform-archives"), Qe = await de.json();
          if (!de.ok) throw new Error(Qe.message);
          b || ae(Qe.items);
        } else if (T) {
          const de = await De("/samples");
          b || ve(de.items);
        } else if (U) {
          const de = await De("/" + U);
          b || se(de);
        } else {
          const de = await De(`?project_id=${V}${Y ? "&state=" + Y : ""}${je ? "&cursor=" + encodeURIComponent(je) : ""}`);
          b || (K(de.items), Ce(de.next_cursor));
        }
      } catch (de) {
        b || Q(de.message);
      } finally {
        b || L(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [h, V, Y, je, re]), r.useEffect(() => {
    if (Ut || !T || !Ue) return;
    let b = !1;
    fe(null), $e("");
    const ge = Ze + "." + (Ae === "v2" ? "complete" : Ae);
    return De(`/samples/${Ae}?project_id=${V}&task_id=${ge}`).then((de) => {
      b || $e(JSON.stringify(de, null, 2));
    }).catch((de) => {
      b || Q(de.message);
    }), () => {
      b = !0;
    };
  }, [T, V, Ae, Ze]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !U && D.some((de) => ["received", "validating", "processing"].includes(de.status))) || T) return;
    const ge = setInterval(() => Z((de) => de + 1), 1800);
    return () => clearInterval(ge);
  }, [k == null ? void 0 : k.status, D, h]);
  const et = () => st(async () => {
    const b = Pe.current;
    fe(null);
    const ge = await De("/preview", { method: "POST", body: pe });
    Pe.current === b && fe(ge);
  }), ht = () => st(async () => {
    var ge;
    if (!X) return;
    ((ge = ct.current) == null ? void 0 : ge.hash) !== X.content_hash && (ct.current = { hash: X.content_hash, key: crypto.randomUUID() });
    const b = await De("", { method: "POST", headers: { "Idempotency-Key": ct.current.key }, body: pe });
    we(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + b.receipt_id);
  }), ie = (b) => st(async () => {
    const ge = Pe.current;
    Ee(null);
    const de = await Yt(`/api/v1/task-packages/${U}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!de.ok) {
      const vt = await de.json().catch(() => ({}));
      throw new Error(vt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Qe = await de.blob();
    if (ge === Pe.current)
      if (b.mime_type.startsWith("text/")) {
        const vt = await Qe.slice(0, 1e6).text();
        ge === Pe.current && Ee({ id: b.attachment_id, url: null, text: vt });
      } else if (b.mime_type.startsWith("image/")) Ee({ id: b.attachment_id, url: URL.createObjectURL(Qe), text: null });
      else {
        const vt = URL.createObjectURL(Qe), M = document.createElement("a");
        M.href = vt, M.download = "任务附件", M.click(), URL.revokeObjectURL(vt);
      }
  }), nt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !xe.length || m, onClick: () => {
        ye(xe.at(-1) || ""), F(xe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !_e || m, onClick: () => {
        F([...xe, je]), ye(_e || "");
      }, children: "下一页" })
    ] })
  ] });
  return N.length ? We && T ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Uf, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ut ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: We ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: T ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !We && N.some((b) => Mt(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Ee(null), Z((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    y && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      y
    ] }),
    le && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      le
    ] }),
    !U && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (b) => A(b.target.value), children: N.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !T && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: Y, onChange: (b) => v(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: An[b] }, b))
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : T ? Ue ? Ut ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        he.filter((b) => b.project_id === V).map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            b.title,
            " · 第",
            b.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void st(async () => {
            const ge = await Yt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), de = await ge.json();
            if (!ge.ok) throw new Error(de.message);
            o("/task-packages/" + de.receipt_id);
          }), children: "接入此成果" })
        ] }, b.id)),
        !he.some((b) => b.project_id === V) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "选择演示数据" }),
          /* @__PURE__ */ s.jsx("span", { children: "无需重复填写已有任务、人员与事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模拟场景",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Ae, onChange: (b) => Ge(b.target.value), children: H.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => Xe("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: P, onChange: (b) => {
              var de;
              const ge = (de = b.target.files) == null ? void 0 : de[0];
              if (ge) {
                if (ge.size > 5242880) {
                  Q("文件超过5MiB上限。");
                  return;
                }
                ge.text().then((Qe) => {
                  $e(Qe), fe(null), Q("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: pe, onChange: (b) => {
              $e(b.target.value), fe(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || !pe, onClick: () => void et(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !X, onClick: () => void ht(), children: [
              /* @__PURE__ */ s.jsx(em, { size: 16 }),
              P ? "正在处理…" : "确认接入归档成果"
            ] })
          ] })
        ] })
      ] }),
      X && /* @__PURE__ */ s.jsxs("section", { className: "panel package-preview", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          X.name,
          " · 第",
          X.package_version,
          "版"
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "归属项目：",
          ((O = N.find((b) => b.id === X.project_id)) == null ? void 0 : O.name) || X.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(X.counts).map(([b, ge]) => /* @__PURE__ */ s.jsxs("span", { children: [
          ku[b],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: ge })
        ] }, b)) }),
        /* @__PURE__ */ s.jsx("p", { children: X.note }),
        X.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : U ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: k.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((w = N.find((b) => b.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
              " · 第",
              k.package_version,
              "版 · ",
              An[k.status],
              k.is_current ? " · 当前可用版本" : ""
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: k.is_demo ? "模拟任务包" : "平台归档成果" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-version-stats", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "最新收到 ",
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "第",
              k.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "当前可用 ",
            /* @__PURE__ */ s.jsx("strong", { children: k.current_package_id ? "第" + k.current_ready_version + "版" : "暂无（不会自动恢复旧版）" })
          ] })
        ] }),
        k.capabilities.map((b) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Hv[b] }, b)),
        k.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        ke && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void st(async () => {
          const b = await Yt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), ge = await b.json();
          if (!b.ok) throw new Error(ge.message);
          o("/retrospectives/" + ge.id);
        }), children: "自动生成 / 更新复盘" })
      ] }),
      k.status === "withdrawn" ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "此任务包已撤回" }),
        /* @__PURE__ */ s.jsx("p", { children: "正文、事件、问题和附件已停止在线使用。" }),
        k.invalidations.map((b) => /* @__PURE__ */ s.jsxs("p", { children: [
          "下游失效通知：",
          b.state === "handled" ? "复盘、培训实时来源保护已生效" : b.state === "pending" ? "历史通知待标记；当前在线访问仍受来源保护" : b.state
        ] }, b.id))
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        (k.warnings.length > 0 || k.validation_errors.length > 0) && /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "校验结果与资料限制" }),
          k.validation_errors.map((b, ge) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "e" + ge)),
          k.warnings.map((b, ge) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "w" + ge))
        ] }),
        ["received", "validating", "processing"].includes(k.status) && /* @__PURE__ */ s.jsxs("div", { className: "feedback", children: [
          "后台处理中 · ",
          k.progress,
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-facts", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "任务快照" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "开始：",
            Dn((I = k.task) == null ? void 0 : I.started_at),
            "　结束：",
            Dn((Se = k.task) == null ? void 0 : Se.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((Me = k.participants) == null ? void 0 : Me.map((b) => Eu(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (lt = k.issues) == null ? void 0 : lt.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              Dn(b.due_at)
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "整改：",
              b.rectification || "未提供"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "复核：",
              b.review_conclusion || "未提供"
            ] })
          ] }, b.issue_id))
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "过程事件与证据" }),
            /* @__PURE__ */ s.jsx("span", { children: "按A提供顺序展示，未知时间保持为空" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (Fe = k.events) != null && Fe.length ? k.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Dn(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? nm[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Yv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === k.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Eu(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((ge) => {
                  var Qe;
                  const de = (Qe = k.attachments) == null ? void 0 : Qe.find((vt) => vt.attachment_id === ge);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: P || !de || de.state !== "verified", onClick: () => de && void ie(de), children: [
                    de ? Cu[de.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ge
                  ] }, ge);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: P, onClick: () => void st(async () => {
            const b = await De("/" + U + "?event_after=" + k.event_next);
            se({ ...b, events: [...k.events || [], ...b.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (B = k.attachments) != null && B.length ? k.attachments.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                Cu[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                An[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || b.state !== "verified", onClick: () => void ie(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ne && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ee(null), children: "关闭预览" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "证据附件 · ",
              ne.id
            ] }),
            ne.url && /* @__PURE__ */ s.jsx("img", { src: ne.url, alt: "任务证据附件" }),
            ne.text && /* @__PURE__ */ s.jsx("pre", { children: ne.text })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (oe = k.versions) == null ? void 0 : oe.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === k.id, onClick: () => o("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            An[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (ce = k.diff) != null && ce.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Ye = k.diff) == null ? void 0 : Ye.changes.map((b, ge) => {
            var de, Qe, vt, M, j;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                ku[b.section] || b.section,
                "有变化"
              ] }),
              "before" in b ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Aa(b.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Aa(b.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((de = b.added) == null ? void 0 : de.join("、")) || "无",
                  "；移除：",
                  ((Qe = b.removed) == null ? void 0 : Qe.join("、")) || "无"
                ] }),
                b.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (vt = b.before_order) == null ? void 0 : vt.join(" → "),
                  "　调整为　",
                  (M = b.after_order) == null ? void 0 : M.join(" → ")
                ] }),
                (j = b.changed) == null ? void 0 : j.map((ue) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      ue.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: Aa(ue.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: Aa(ue.after) })
                  ] })
                ] }, ue.id))
              ] })
            ] }, ge);
          })
        ] }),
        (Re || ke && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          ke && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void st(async () => {
            const b = await Yt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            we("已提交重试，已保存事件与附件不会重复新增。"), Z((ge) => ge + 1);
          }), children: "重试接入" }),
          Re && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: $, maxLength: 2e3, onChange: (b) => ze(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: P || !$.trim(), onClick: () => void st(async () => {
              var de;
              const b = JSON.stringify({ reason: $ }), ge = k.id + b;
              ((de = Je.current) == null ? void 0 : de.body) !== ge && (Je.current = { body: ge, key: crypto.randomUUID() }), await De("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": Je.current.key }, body: b }), Ee(null), Z((Qe) => Qe + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      D.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ s.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ s.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: D.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/task-packages/" + b.id), children: b.name }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              b.producer,
              " · ",
              b.task_id
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            "第",
            b.package_version,
            "版",
            /* @__PURE__ */ s.jsxs("small", { children: [
              "最新接收：第",
              b.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: An[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Uf, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      nt
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function im(u, h, N, o) {
  const T = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(N) });
  o();
  const U = Date.now() + 1200 * 1e3;
  for (; Date.now() < U; ) {
    const V = await u("/model-generation-jobs/" + T.job_id);
    if (V.status === "succeeded") return V.result;
    if (V.status === "failed") throw new Error(V.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((A) => setTimeout(A, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Rn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Xv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Qv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Ki = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Zv({ api: u, path: h, navigate: N, projects: o, identity: T }) {
  var Fe;
  const U = h.split("/")[2], V = h.endsWith("/review"), [A, Y] = r.useState([]), [v, D] = r.useState(null), [K, k] = r.useState(null), [se, je] = r.useState(!1), [ye, _e] = r.useState(!0), [Ce, xe] = r.useState(""), [F, he] = r.useState(""), [ae, H] = r.useState(0), [ve, Ae] = r.useState("llm"), [Ge, Ze] = r.useState("task_process"), [Xe, pe] = r.useState(((Fe = o.find((B) => Mt(B, "retrospective.generate"))) == null ? void 0 : Fe.id) || ""), [$e, X] = r.useState([]), [fe, y] = r.useState(""), [Q, le] = r.useState([]), [we, m] = r.useState([]), [L, P] = r.useState(""), [te, re] = r.useState(!1), [Z, $] = r.useState(""), [ze, ne] = r.useState(""), [Ee, ct] = r.useState(""), [Je, Pe] = r.useState(null), [We, Ue] = r.useState([]), [Re, ke] = r.useState(null), [De, st] = r.useState(""), [et, ht] = r.useState(""), ie = o.some((B) => Mt(B, "retrospective.generate")), nt = !!(v != null && v.is_current) && !!Mt(o.find((B) => B.id === v.project_id), "retrospective.edit"), He = !!(v != null && v.is_current) && !!Mt(o.find((B) => B.id === v.project_id), "retrospective.review");
  r.useEffect(() => {
    $(""), P(""), re(!1), xe(""), he(""), ct(""), Ue([]), ke(null);
  }, [h]), r.useEffect(() => {
    let B = !1;
    return _e(!0), D(null), xe(""), (async () => {
      try {
        if (U) {
          const ce = await u(`/retrospectives/${U}${Z ? "?revision_id=" + Z : ""}`);
          B || (D(ce), k({ summary: ce.summary, findings: structuredClone(ce.findings), suggestions: structuredClone(ce.suggestions) }), re(!1));
        } else {
          const ce = await u(`/retrospectives?limit=20${ze ? "&state=" + ze : ""}${Ee ? "&cursor=" + encodeURIComponent(Ee) : ""}`);
          B || (Y(ce.items), Pe(ce.next_cursor));
        }
      } catch (ce) {
        B || xe(ce.message);
      } finally {
        B || _e(!1);
      }
    })(), () => {
      B = !0;
    };
  }, [U, h, Z, ze, Ee, ae]), r.useEffect(() => {
    if (U || !Xe || !ie) return;
    let B = !1;
    return m([]), X([]), le([]), y(""), (async () => {
      var ce;
      try {
        const [Ye, b] = await Promise.all([u(`/task-packages?project_id=${Xe}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${Xe}&limit=100`)]);
        if (B) return;
        const ge = Ye.items.filter((de) => de.is_current);
        X(ge), y(((ce = ge[0]) == null ? void 0 : ce.id) || ""), le(b.items);
      } catch (Ye) {
        B || xe(Ye.message);
      }
    })(), () => {
      B = !0;
    };
  }, [U, Xe, ae]), r.useEffect(() => {
    if (!(Re != null && Re.asset_id) || Re.type !== "task_attachment") {
      st(""), ht("");
      return;
    }
    let B = !1, oe = "";
    return Yt("/api/v1/assets/" + Re.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + T } }).then(async (ce) => {
      if (!ce.ok) {
        const b = await ce.json();
        throw new Error(b.message);
      }
      const Ye = await ce.blob();
      !B && /^(image\/|text\/plain)/.test(Ye.type) && (oe = URL.createObjectURL(Ye), st(oe), ht(Ye.type));
    }).catch((ce) => {
      B || xe(ce.message);
    }), () => {
      B = !0, oe && URL.revokeObjectURL(oe), st("");
    };
  }, [Re, T]);
  const O = async (B) => {
    je(!0), xe(""), he("");
    try {
      await B();
    } catch (oe) {
      xe(oe.message);
    } finally {
      je(!1);
    }
  }, w = () => ({ revision_id: v.revision_id, row_version: v.row_version, reason: L, evidence_checked: te }), I = !!v && !!K && JSON.stringify(K) === JSON.stringify({ summary: v.summary, findings: v.findings, suggestions: v.suggestions }), Se = (B) => void O(async () => {
    const oe = B === "submit" ? `/retrospectives/${U}/submit-review` : `/reviews/${v.revision_id}/${B}`;
    await u(oe, { method: "POST", body: JSON.stringify(w()) }), he("已保存本版本的审核状态与意见。"), H((ce) => ce + 1);
  }), Me = (B, oe) => B.map((ce, Ye) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ce.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Xv[ce.claim_kind] }),
      ce.record_status && /* @__PURE__ */ s.jsx("strong", { children: ce.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ce.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && nt ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ce.id, value: ce.text, onChange: (b) => k((ge) => ge && { ...ge, [oe]: ge[oe].map((de, Qe) => Qe === Ye ? { ...de, text: b.target.value, review_state: "unconfirmed" } : de) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ce.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ce.evidence_refs.map((b, ge) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => ke(v.evidence.find((de) => de.id === b) || null), children: [
      "查看证据 ",
      ge + 1
    ] }, b)) }),
    V && nt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ce.review_state === "confirmed", onChange: (b) => k((ge) => ge && { ...ge, [oe]: ge[oe].map((de, Qe) => Qe === Ye ? { ...de, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : de) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ce.id)), lt = (B) => B.map((oe) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Ki(oe.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Qv[oe.event_type] || "未知事件类型：" + oe.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof oe.payload.note == "string" ? oe.payload.note : Object.keys(oe.payload).length ? JSON.stringify(oe.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ke(v.evidence.find((ce) => ce.reference === "event:" + oe.event_id) || null), children: "打开事件记录" }),
    oe.evidence_refs.map((ce) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Ye = v.evidence.find((b) => b.reference === "attachment:" + ce);
      Ye ? ke(Ye) : xe("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ce
    ] }, ce))
  ] }, oe.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(cv, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Ce && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      Ce,
      /* @__PURE__ */ s.jsx("button", { onClick: () => H((B) => B + 1), children: "重新加载" })
    ] }),
    F && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      F
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => N("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => H((B) => B + 1), disabled: se, children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : U ? v && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: v.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            v.version,
            " · ",
            Rn[v.state],
            " · ",
            v.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            v.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: v.revision_id, onChange: (B) => $(B.target.value), children: v.revisions.map((B) => /* @__PURE__ */ s.jsxs("option", { value: B.id, children: [
            "v",
            B.version,
            " · ",
            Rn[B.state]
          ] }, B.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => N(`/retrospectives/${U}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !v.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && nt ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: K.summary, onChange: (B) => k({ ...K, summary: B.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: v.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            v.sources.task_package_id ? "固定任务包 v" + v.sources.package_version : "固定历史版本 " + v.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          v.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/task-packages/" + v.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            v.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: lt(v.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            v.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: lt(v.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            v.timeline.intervals.length ? v.timeline.intervals.map((B, oe) => /* @__PURE__ */ s.jsxs("p", { children: [
              B.name,
              "：",
              B.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, oe)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            v.timeline.deadlines.length ? v.timeline.deadlines.map((B) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                B.issue_id,
                " · ",
                B.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: B.reason || `明确期限 ${Ki(B.due_at || null)}；复核记录 ${Ki(B.accepted_at || null)}；晚于期限 ${B.late_seconds / 60} 分钟。` })
            ] }, B.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ s.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            Me(K.findings, "findings"),
            /* @__PURE__ */ s.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            Me(K.suggestions, "suggestions")
          ] })
        ] })
      ] }),
      V && v.is_current && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ s.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: L, onChange: (B) => P(B.target.value) })
          ] }),
          nt && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || I || !L.trim(), onClick: () => void O(async () => {
              await u(`/retrospectives/${U}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), he("已保存新草稿版本，旧内容及审核意见保留。"), H((B) => B + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(v.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !I || !L.trim(), onClick: () => Se("submit"), children: "提交当前版本审核" })
          ] }),
          He && v.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te, onChange: (B) => re(B.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !te || !I || !L.trim(), onClick: () => Se("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !I || !L.trim(), onClick: () => Se("request-changes"), children: "退回修改" })
            ] })
          ] }),
          nt && v.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !I || !L.trim(), onClick: () => void O(async () => {
            const B = await u(`/retrospectives/${U}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            he(B.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), H((oe) => oe + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      v.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: v.draft_ids.map((B) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => N("/knowledge/" + B + "/edit"), children: "打开经验候选" }, B)) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "审核轨迹与来源指纹" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsx("p", { className: "retro-hash", children: v.input_fingerprint }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "摘要适配器：",
            v.model_ref
          ] })
        ] }),
        v.review_actions.map((B, oe) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            B.version,
            " · ",
            Rn[B.action] || B.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: B.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Ki(B.created_at) })
        ] }, oe))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      ie && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: ve, onChange: (B) => Ae(B.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Ge, onChange: (B) => Ze(B.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Xe, onChange: (B) => pe(B.target.value), children: o.filter((B) => Mt(B, "retrospective.generate")).map((B) => /* @__PURE__ */ s.jsx("option", { value: B.id, children: B.name }, B.id)) })
            ] })
          ] }),
          Ge === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: fe, onChange: (B) => y(B.target.value), children: $e.map((B) => /* @__PURE__ */ s.jsxs("option", { value: B.id, children: [
              B.name,
              " · 包v",
              B.package_version
            ] }, B.id)) }),
            !$e.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Q.map((B) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: we.includes(B.record_version_id), onChange: (oe) => m(oe.target.checked ? [...we, B.record_version_id] : we.filter((ce) => ce !== B.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              B.description || "未填写描述",
              " · 来源v",
              B.current_version
            ] })
          ] }, B.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Ge === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || (Ge === "task_process" ? !fe : !we.length || we.length > 20), onClick: () => void O(async () => {
              const B = await im(u, "/retrospective-generation-jobs", { mode: Ge, generation_mode: ve, task_package_id: Ge === "task_process" ? fe : null, record_version_ids: Ge === "historical_case" ? we : [], template_version: "process-review-v1" }, () => he("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              N("/retrospectives/" + B.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => N("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: ze, onChange: (B) => {
            ne(B.target.value), ct(""), Ue([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((B) => /* @__PURE__ */ s.jsx("option", { value: B, children: Rn[B] }, B))
          ] })
        ] }),
        A.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: A.map((B) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              B.title,
              /* @__PURE__ */ s.jsx("small", { children: B.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: B.sources.task_package_id ? "任务包 v" + B.sources.package_version : B.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              B.version,
              " · ",
              Rn[B.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/retrospectives/" + B.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/retrospectives/" + B.id + "/review"), children: "核查与审核" })
            ] })
          ] }, B.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !We.length, onClick: () => {
              ct(We.at(-1) || ""), Ue(We.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !Je, onClick: () => {
              Ue([...We, Ee]), ct(Je || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    Re && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => ke(null), children: /* @__PURE__ */ s.jsx(Wi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Re.type === "process_event" ? "实际事件记录" : Re.type === "task_attachment" ? "任务附件" : Re.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: Re.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(Re.locator)
      ] }),
      De && et.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: De, alt: "来源证据" }),
      De && et.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: De }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const As = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, Ta = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Vf = { selected: [], text: "", row_version: 0 };
function Vv({ api: u, path: h, navigate: N, projects: o }) {
  var Ne, it, bt;
  const T = h.startsWith("/learn"), U = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || U ? h.split("/")[3] : "", A = /^\/training\/questions\/[^/]+$/.test(h), Y = A ? h.split("/")[3] : "", v = h === "/training/questions", D = h === "/training/packages", K = h === "/training/results", k = o.some((x) => Mt(x, "training.manage")), se = o.some((x) => Mt(x, "training.review")), [je, ye] = r.useState("llm"), [_e, Ce] = r.useState(""), [xe, F] = r.useState(((Ne = o.find((x) => Mt(x, "training.manage"))) == null ? void 0 : Ne.id) || ((it = o[0]) == null ? void 0 : it.id) || ""), [he, ae] = r.useState([]), [H, ve] = r.useState([]), [Ae, Ge] = r.useState([]), [Ze, Xe] = r.useState([]), [pe, $e] = r.useState(null), [X, fe] = r.useState(null), [y, Q] = r.useState(""), [le, we] = r.useState(!1), [m, L] = r.useState([]), [P, te] = r.useState(["single_choice", "case_answer"]), [re, Z] = r.useState([]), [$, ze] = r.useState("新人风险识别与复盘练习"), [ne, Ee] = r.useState("learning-" + Date.now()), [ct, Je] = r.useState(1), [Pe, We] = r.useState(null), [Ue, Re] = r.useState({}), [ke, De] = r.useState(null), [st, et] = r.useState("rules"), [ht, ie] = r.useState("useful"), [nt, He] = r.useState(""), [O, w] = r.useState({}), [I, Se] = r.useState({}), [Me, lt] = r.useState(""), [Fe, B] = r.useState(""), [oe, ce] = r.useState(null), [Ye, b] = r.useState([]), [ge, de] = r.useState(!0), [Qe, vt] = r.useState(!1), [M, j] = r.useState(""), [ue, be] = r.useState(""), [rt, _] = r.useState(0);
  r.useEffect(() => {
    B(""), b([]), Q(""), we(!1), be(""), j(""), Z([]);
  }, [h]), r.useEffect(() => {
    let x = !1;
    return de(!0), j(""), $e(null), We(null), De(null), (async () => {
      try {
        if (V)
          if (U) {
            const Te = await u(`/training/attempts/${V}/result?teacher=true`);
            x || De(Te);
          } else {
            const Te = await u("/training/attempts/" + V);
            if (x) return;
            if (We(Te), Re(Object.fromEntries(Te.saved_answers.map((at) => [at.question_revision_id, { ...at.answer, row_version: at.row_version }]))), Te.state === "submitted") {
              const at = await u(`/training/attempts/${V}/result`);
              x || De(at);
            }
          }
        else if (A) {
          const Te = await u("/training/questions/" + Y);
          x || ($e(Te), fe(structuredClone(Te.content)));
        } else if (T) {
          const [Te, at] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          x || (ve(Te.items), Xe(at.items));
        } else if (K) {
          const Te = await u(`/training/results?limit=20${Fe ? "&cursor=" + Fe : ""}`);
          x || (Xe(Te.items), ce(Te.next_cursor));
        } else if (D) {
          const [Te, at] = await Promise.all([u(`/training/packages?limit=20${Fe ? "&cursor=" + Fe : ""}`), u("/training/questions?state=approved&limit=100")]);
          x || (ve(Te.items), ae(at.items), ce(Te.next_cursor));
        } else {
          const [Te, at] = await Promise.all([u(`/training/questions?limit=20${Me ? "&state=" + Me : ""}${Fe ? "&cursor=" + Fe : ""}`), u("/knowledge/library?limit=100&project_id=" + xe)]);
          x || (ae(Te.items), Ge(at.items), ce(Te.next_cursor));
        }
      } catch (Te) {
        x || j(Te.message);
      } finally {
        x || de(!1);
      }
    })(), () => {
      x = !0;
    };
  }, [h, xe, Me, Fe, rt]), r.useEffect(() => {
    if (!(ke != null && ke.grading_job) || !["queued", "running", "retrying"].includes(ke.grading_job.status)) return;
    const x = window.setTimeout(() => _((Oe) => Oe + 1), 1800);
    return () => clearTimeout(x);
  }, [(bt = ke == null ? void 0 : ke.grading_job) == null ? void 0 : bt.status, rt]);
  const me = async (x) => {
    vt(!0), j(""), be("");
    try {
      await x();
    } catch (Oe) {
      j(Oe.message);
    } finally {
      vt(!1);
    }
  }, Ve = !!pe && !!X && JSON.stringify(X) === JSON.stringify(pe.content), Ot = () => ({ revision_id: pe.revision_id, row_version: pe.row_version, reason: y, evidence_checked: le }), qt = (x) => void me(async () => {
    await u(x === "submit" ? `/training/questions/${Y}/submit-review` : `/reviews/${pe.revision_id}/${x}`, { method: "POST", body: JSON.stringify(Ot()) }), be("题目审核状态已保存到统一审核记录。"), _((Oe) => Oe + 1);
  }), Gt = async (x) => {
    const Oe = Ue[x.revision_id] || Vf, Te = await u(`/training/attempts/${V}/answers/${x.question_id}`, { method: "PUT", body: JSON.stringify(Oe) });
    return Re((at) => ({ ...at, [x.revision_id]: { ...Oe, row_version: Te.row_version } })), Te;
  }, ot = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ye.length, onClick: () => {
        B(Ye.at(-1) || ""), b(Ye.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !oe, onClick: () => {
        b([...Ye, Fe]), B(oe || "");
      }, children: "下一页" })
    ] })
  ] }), Nt = (x, Oe, Te) => Te ? [...x, Oe] : x.filter((at) => at !== Oe), g = (x) => void me(async () => {
    const Oe = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: x.id, grading_mode: st }) });
    N("/learn/attempts/" + Oe.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Pi, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: T ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    M && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      M
    ] }),
    ue && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 18 }),
      ue
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !T && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: v || A ? "selected" : "", onClick: () => N("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: D ? "selected" : "", onClick: () => N("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || U ? "selected" : "", onClick: () => N("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => N("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => _((x) => x + 1), children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ge ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : ke ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: As[ke.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: ke.confirmed_total === null ? "待确认" : ke.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: ke.provisional_total === null ? "待评分" : ke.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: ke.max_score })
            ] })
          ] }),
          ke.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              ke.grading_job.status === "failed" ? "暂未完成" : ke.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            ke.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: ke.grading_job.error }),
            U && k && ke.grading_job.status === "failed" && ke.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void me(async () => {
              await u("/jobs/" + ke.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ke.grading_job.row_version }) }), _((x) => x + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          ke.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: ke.restriction_note }),
          ke.answers.map((x, Oe) => {
            var Te, at, Ht, us, os, f, G, Be;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Oe + 1,
                "题 ",
                x.type ? Ta[x.type] : ""
              ] }),
              x.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: x.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((Te = x.answer) == null ? void 0 : Te.text) || ((at = x.answer) == null ? void 0 : at.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Ht = x.reference_answer) == null ? void 0 : Ht.text) || ((os = (us = x.reference_answer) == null ? void 0 : us.selected) == null ? void 0 : os.join("、"))
                ] }),
                (f = x.rubric) == null ? void 0 : f.map((mt, zt) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  mt.point,
                  " · ",
                  mt.points,
                  "分"
                ] }, zt)),
                /* @__PURE__ */ s.jsx("p", { children: (G = x.feedback) == null ? void 0 : G.message }),
                ((Be = x.feedback) == null ? void 0 : Be.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
                  "教员说明：",
                  x.feedback.human_review_reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "建议分：",
                x.suggested_score ?? "无",
                " · 确认分：",
                x.confirmed_score ?? "待确认",
                " · ",
                x.score_kind === "model_suggestion" ? "大模型建议" : x.score_kind === "rule_suggestion" ? "规则建议，需复核" : x.score_kind === "human_confirmed" ? "人工确认" : x.score_kind === "pending" ? "待评分" : "客观题规则评分"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "评分规则：",
                x.scoring_version,
                " · 评分器：",
                x.model_ref
              ] }),
              U && k && x.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: O[x.id] ?? String(x.confirmed_score ?? x.suggested_score ?? ""), onChange: (mt) => w({ ...O, [x.id]: mt.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: I[x.id] || "", onChange: (mt) => Se({ ...I, [x.id]: mt.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe || !(I[x.id] || "").trim() || (O[x.id] ?? String(x.confirmed_score ?? x.suggested_score ?? "")) === "", onClick: () => void me(async () => {
                  await u("/training/answers/" + x.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: x.row_version, score: Number(O[x.id] ?? x.confirmed_score ?? x.suggested_score), reason: I[x.id] }) }), be("人工确认分已保存，原建议分和复核轨迹保留。"), _((mt) => mt + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, x.id);
          })
        ] })
      ] }),
      !U && ke.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: ht, onChange: (x) => ie(x.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: nt, onChange: (x) => He(x.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void me(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: ht, comment: nt }) }), be("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : Pe ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          Pe.package_title,
          " · v",
          Pe.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      Pe.questions.map((x) => {
        const Oe = Ue[x.revision_id] || Vf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            x.position,
            "题 · ",
            Ta[x.type],
            " · ",
            x.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: x.stem }),
          x.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + x.position + "题回答", value: Oe.text, onChange: (Te) => Re({ ...Ue, [x.revision_id]: { ...Oe, text: Te.target.value } }) })
          ] }) : x.options.map((Te) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: x.type === "single_choice" ? "radio" : "checkbox", name: x.revision_id, checked: Oe.selected.includes(Te.id), onChange: (at) => Re({ ...Ue, [x.revision_id]: { ...Oe, selected: x.type === "single_choice" ? [Te.id] : Nt(Oe.selected, Te.id, at.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Te.id.toUpperCase(),
              " · ",
              Te.text
            ] })
          ] }, Te.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void me(async () => {
              await Gt(x), be("第" + x.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Oe.row_version
            ] })
          ] })
        ] }, x.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe, onClick: () => void me(async () => {
        for (const x of Pe.questions) await Gt(x);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), _((x) => x + 1), be("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : A && pe && X ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Ta[pe.type],
            " · v",
            pe.version,
            " · ",
            As[pe.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: pe.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: X.stem, disabled: !k, onChange: (x) => fe({ ...X, stem: x.target.value }) })
          ] }),
          X.options.map((x, Oe) => {
            var Te;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              x.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: x.text, disabled: !k, onChange: (at) => fe({ ...X, options: X.options.map((Ht, us) => us === Oe ? { ...Ht, text: at.target.value } : Ht) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((Te = X.answer.selected) == null ? void 0 : Te.includes(x.id)) || !1, onChange: (at) => fe({ ...X, answer: { selected: Nt(X.answer.selected || [], x.id, at.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, x.id);
          }),
          pe.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: X.answer.text || "", disabled: !k, onChange: (x) => fe({ ...X, answer: { text: x.target.value } }) })
            ] }),
            X.rubric.map((x, Oe) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: x.point, disabled: !k, onChange: (Te) => fe({ ...X, rubric: X.rubric.map((at, Ht) => Ht === Oe ? { ...at, point: Te.target.value } : at) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: x.keywords.join("，"), disabled: !k, onChange: (Te) => fe({ ...X, rubric: X.rubric.map((at, Ht) => Ht === Oe ? { ...at, keywords: Te.target.value.split(/[,，]/).filter(Boolean) } : at) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: x.points, disabled: !k, onChange: (Te) => fe({ ...X, rubric: X.rubric.map((at, Ht) => Ht === Oe ? { ...at, points: Number(Te.target.value) } : at) }) })
              ] })
            ] }, Oe))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          pe.source_versions.map((x) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: x }) }, x)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: y, onChange: (x) => Q(x.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe || Ve || !y.trim(), onClick: () => void me(async () => {
              await u(`/training/questions/${Y}/draft`, { method: "PATCH", body: JSON.stringify({ ...Ot(), content: X }) }), be("新题目版本已保存，不改变旧学习包与成绩。"), _((x) => x + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(pe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !Ve || !y.trim(), onClick: () => qt("submit"), children: "提交题目审核" })
          ] }),
          se && pe.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le, onChange: (x) => we(x.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !le || !Ve || !y.trim(), onClick: () => qt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Qe || !Ve || !y.trim(), onClick: () => qt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          pe.revisions.map((x) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            x.version,
            " · ",
            As[x.state]
          ] }, x.id)),
          pe.review_actions.map((x, Oe) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            x.version,
            " · ",
            As[x.action] || x.action,
            " · ",
            x.reason
          ] }, Oe))
        ] })
      ] })
    ] }) : T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: st, onChange: (x) => et(x.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Ut && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          H.length ? H.map((x) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: x.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              x.version,
              " · ",
              x.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe, onClick: () => g(x), children: "开始本次练习" })
          ] }, x.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Ze.map((x) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => N("/learn/attempts/" + x.id), children: [
            As[x.state],
            " · ",
            As[x.result_state],
            " · ",
            new Date(x.started_at).toLocaleString("zh-CN")
          ] }) }, x.id)),
          !Ze.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
        ] })
      ] })
    ] }) : K ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习完成与评分复核" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "学习包" }),
          /* @__PURE__ */ s.jsx("th", { children: "学员编号" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: Ze.map((x) => {
          var Oe;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              x.title,
              " · v",
              x.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Oe = x.learner_id) == null ? void 0 : Oe.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              As[x.state],
              " · ",
              As[x.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: x.state !== "submitted", onClick: () => N("/training/results/" + x.id), children: "查看结果与复核" }) })
          ] }, x.id);
        }) })
      ] }) }),
      ot
    ] }) : D ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      k && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "组建固定版本学习包" }),
          /* @__PURE__ */ s.jsx("span", { children: "只选用当前已审核题目；修改后创建新包版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: xe, onChange: (x) => {
                F(x.target.value), Z([]);
              }, children: o.filter((x) => Mt(x, "training.manage")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: _e, onChange: (x) => Ce(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: $, onChange: (x) => ze(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ne, onChange: (x) => Ee(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: ct, onChange: (x) => Je(Number(x.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: he.filter((x) => x.project_id === xe).map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: re.includes(x.revision_id), onChange: (Oe) => Z((Te) => Nt(Te, x.revision_id, Oe.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Ta[x.type],
              " · ",
              x.title,
              " · v",
              x.version
            ] })
          ] }, x.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Qe || !re.length || re.length > 30 || !$.trim(), onClick: () => void me(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: $, package_key: ne, version: ct, project_id: xe, question_revision_ids: re, role_scope: ["learner", "admin", "teacher"], audience_subjects: _e.split(/[,，\n]/).map((x) => x.trim()).filter(Boolean) }) }), be("学习包草稿已建立，发布后学员可使用。"), _((x) => x + 1);
          }), children: [
            "创建学习包草稿（",
            re.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: H.map((x) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            x.title,
            " · v",
            x.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            As[x.state],
            " · ",
            x.question_count,
            "题 · ",
            x.package_key
          ] }),
          x.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void me(async () => {
            await u(`/training/packages/${x.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: x.row_version, reason: "发布已审核题目的固定版本学习包" }) }), be("学习包已发布。"), _((Oe) => Oe + 1);
          }), children: "发布此学习包版本" })
        ] }, x.id)) }),
        ot
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      k && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已发布知识生成题目候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "题目、答案与来源经教员核对后才可入学习包" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: xe, onChange: (x) => {
              F(x.target.value), L([]);
            }, children: o.filter((x) => Mt(x, "training.manage")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Ae.map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: m.includes(x.revision_id), onChange: (Oe) => L((Te) => Nt(Te, x.revision_id, Oe.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                x.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  x.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, x.revision_id)),
            !Ae.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(Ta).map(([x, Oe]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: P.includes(x), onChange: (Te) => te((at) => Nt(at, x, Te.target.checked)) }),
            Oe
          ] }, x)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: je, onChange: (x) => ye(x.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !m.length || m.length > 10 || !P.length, onClick: () => void me(async () => {
            const x = await im(u, "/training/generation-jobs", { knowledge_revision_ids: m, types: P, generation_mode: je }, () => be("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            be("已生成或复用" + x.items.length + "道候选题，仍需核查答案与来源后提交审核。"), _((Oe) => Oe + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: Me, onChange: (x) => {
            lt(x.target.value), B(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: As[x] }, x))
          ] })
        ] }),
        he.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: he.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: x.title }),
            /* @__PURE__ */ s.jsx("td", { children: Ta[x.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              x.version,
              " · ",
              As[x.state],
              x.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/training/questions/" + x.id), children: "核查与审核" }) })
          ] }, x.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        ot
      ] })
    ] })
  ] });
}
function Jv({ api: u }) {
  var Ce, xe;
  const [h, N] = r.useState(null), [o, T] = r.useState([]), [U, V] = r.useState("openai"), [A, Y] = r.useState(""), [v, D] = r.useState(!1), [K, k] = r.useState(""), [se, je] = r.useState("");
  r.useEffect(() => {
    let F = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([he, ae]) => {
      if (F) return;
      T(ae.items);
      const H = ae.items.find((ve) => ve.base_url === he.base_url);
      if (!he.model && !he.api_key_configured) {
        const ve = ae.items[0];
        V(ve.id), N({ ...he, base_url: ve.base_url, model: ve.default_model });
      } else
        V((H == null ? void 0 : H.id) || "custom"), N(he);
    }).catch((he) => {
      F || k(he.message);
    }), () => {
      F = !0;
    };
  }, []);
  const ye = (F) => {
    const he = o.find((ae) => ae.id === F);
    V(F), Y(""), je(""), k(""), h && N({ ...h, base_url: (he == null ? void 0 : he.base_url) || "", model: (he == null ? void 0 : he.default_model) || "", api_key_configured: !1 });
  }, _e = async () => {
    if (h) {
      D(!0), k(""), je("");
      try {
        const { api_key_configured: F, ...he } = h, ae = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...he, enabled: !0, ...A ? { api_key: A } : {} }) });
        if (N(ae), Y(""), je("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        je("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (F) {
        je(""), k(F.message);
      } finally {
        D(!1);
      }
    }
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "选择模型并连接" }),
      /* @__PURE__ */ s.jsx("span", { children: "填写对应服务的 API Key" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      K && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: K }),
      se && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: se }),
      h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "模型服务",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: v, value: U, onChange: (F) => ye(F.target.value), children: [
            o.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        U === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: v, value: h.base_url, onChange: (F) => N({ ...h, base_url: F.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (F) => N({ ...h, model: F.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (F) => N({ ...h, model: F.target.value }), children: [
            !((Ce = o.find((F) => F.id === U)) != null && Ce.models.some((F) => F.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (xe = o.find((F) => F.id === U)) == null ? void 0 : xe.models.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: v, value: A, onChange: (F) => Y(F.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: h.timeout_seconds, onChange: (F) => N({ ...h, timeout_seconds: Number(F.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: h.max_tokens, onChange: (F) => N({ ...h, max_tokens: Number(F.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            h.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: v || !h.model || !A.trim() && !h.api_key_configured, onClick: () => void _e(), children: v ? "正在保存并测试…" : "保存并测试" }),
          h.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: v, onClick: () => {
            D(!0), k("");
            const { api_key_configured: F, ...he } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...he, enabled: !1 }) }).then((ae) => {
              N(ae), je("云端调用已停用。");
            }).catch((ae) => k(ae.message)).finally(() => D(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Kv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function $v({ api: u, path: h, navigate: N, projects: o, identity: T, canManageModels: U }) {
  var P, te, re;
  const V = h === "/settings/models", A = U, Y = o.some((Z) => Z.can_run), [v, D] = r.useState(((P = o.find((Z) => Z.can_run)) == null ? void 0 : P.id) || ""), [K, k] = r.useState([]), [se, je] = r.useState([]), [ye, _e] = r.useState(null), [Ce, xe] = r.useState(Kv), [F, he] = r.useState("llm"), [ae, H] = r.useState(sessionStorage.getItem("b07-extraction-" + T) || ""), [ve, Ae] = r.useState(null), [Ge, Ze] = r.useState(!1), [Xe, pe] = r.useState(!0), [$e, X] = r.useState(""), [fe, y] = r.useState(""), [Q, le] = r.useState(0), we = async (Z) => {
    Ze(!0), X(""), y("");
    try {
      await Z();
    } catch ($) {
      X($.message);
    } finally {
      Ze(!1);
    }
  };
  r.useEffect(() => {
    let Z = !1;
    return pe(!0), X(""), je([]), (async () => {
      var ze;
      try {
        if (V) {
          if (!A) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!Y || !v) throw new Error("当前身份没有知识加工权限。");
          const [ne, Ee] = await Promise.all([u(`/knowledge/source-options?project_id=${v}&limit=100`), u(`/knowledge/taxonomies?project_id=${v}`)]);
          Z || (k(ne.items), _e(Ee.items[0] || null), xe(structuredClone(((ze = Ee.items[0]) == null ? void 0 : ze.categories) || Ee.suggested_categories)));
        }
      } catch (ne) {
        Z || X(ne.message);
      } finally {
        Z || pe(!1);
      }
    })(), () => {
      Z = !0;
    };
  }, [h, v, Q]), r.useEffect(() => {
    if (!ae || V) return;
    let Z = !1, $;
    const ze = async () => {
      try {
        const ne = await u("/knowledge/extraction-jobs/" + ae);
        if (Z) return;
        Ae(ne), ["queued", "running", "retrying"].includes(ne.status) && ($ = window.setTimeout(() => void ze(), 1800));
      } catch (ne) {
        Z || X(ne.message);
      }
    };
    return ze(), () => {
      Z = !0, window.clearTimeout($);
    };
  }, [ae, h, Q]);
  const m = (Z, $) => xe((ze) => ze.map((ne, Ee) => Ee === Z ? { ...ne, ...$ } : ne)), L = JSON.stringify(Ce) !== JSON.stringify((ye == null ? void 0 : ye.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(zl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    $e && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
      $e
    ] }),
    fe && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: fe }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: V ? "" : "selected", onClick: () => N("/extraction"), children: "施工要点萃取" }),
        A && /* @__PURE__ */ s.jsx("button", { className: V ? "selected" : "", onClick: () => N("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => N("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => N("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => le((Z) => Z + 1), children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Xe ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && A ? /* @__PURE__ */ s.jsx(Jv, { api: u }) : !V && Y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: v, onChange: (Z) => D(Z.target.value), children: o.filter((Z) => Z.can_run).map((Z) => /* @__PURE__ */ s.jsx("option", { value: Z.id, children: Z.name }, Z.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            ye ? "分类 v" + ye.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Ce.map((Z, $) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + ($ + 1), value: Z.code, onChange: (ze) => m($, { code: ze.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + ($ + 1), value: Z.name, onChange: (ze) => m($, { name: ze.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Z.focus, onChange: (ze) => m($, { focus: ze.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Z.keywords.join("，"), onChange: (ze) => m($, { keywords: ze.target.value.split(/[,，]/).map((ne) => ne.trim()).filter(Boolean) }) })
            ] }),
            Ce.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => xe((ze) => ze.filter((ne, Ee) => Ee !== $)), children: "移除此类别" })
          ] }, $)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Ce.length >= 100, onClick: () => xe([...Ce, { code: "category_" + (Ce.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(jv, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge || !L, onClick: () => void we(async () => {
              const Z = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: v, expected_version: (ye == null ? void 0 : ye.version) || 0, categories: Ce }) });
              _e(Z), xe(Z.categories), y("分类版本已固定，可开始加工。");
            }), children: "保存分类新版本" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "选择已有风险记录" }),
          /* @__PURE__ */ s.jsx("span", { children: "最多20条；单次文本最多60000字符" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => je(K.slice(0, 20).map((Z) => Z.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((Z) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se.includes(Z.record_version_id), onChange: ($) => je((ze) => $.target.checked ? [...ze, Z.record_version_id] : ze.filter((ne) => ne !== Z.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Z.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "固定来源 v",
                Z.current_version
              ] })
            ] })
          ] }, Z.id)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "加工方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: F, onChange: (Z) => he(Z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ge || !ye || L || !se.length || se.length > 20, onClick: () => void we(async () => {
            const Z = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: se, taxonomy_id: ye.id, mode: F }) });
            H(Z.job_id), sessionStorage.setItem("b07-extraction-" + T, Z.job_id), y("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            se.length,
            "条来源）"
          ] }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "模型自主完成分类、跨记录归纳与证据摘录，人工只核对候选。不会自动批准为有效标准或直接发布。" })
        ] })
      ] }),
      ve && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "最近加工任务 · ",
            ve.progress,
            "%"
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: ve.status })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          ve.error && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: ve.error }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "模式：",
            ve.result.generation_mode === "llm" ? "云端大模型" : ve.result.generation_mode === "mock" ? "本地模板演示" : "等待处理"
          ] }),
          ve.result.model && /* @__PURE__ */ s.jsxs("p", { children: [
            "模型：",
            ve.result.model.model_ref,
            " · 用量 ",
            JSON.stringify(ve.result.model.usage)
          ] }),
          (te = ve.result.items) == null ? void 0 : te.map((Z) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => N("/knowledge/" + Z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Z.item_id)),
          (re = ve.result.missing_information) == null ? void 0 : re.map((Z, $) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Z
          ] }, $)),
          ve.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void we(async () => {
            await u("/jobs/" + ve.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ve.row_version }) }), le((Z) => Z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const Nu = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Jf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Kf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, $i = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Wv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function Fv({ embedded: u = !1 }) {
  var rt;
  const [h, N] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, T] = r.useState(Vi()), [U, V] = r.useState(!1), A = o === "/platform/services", Y = o.startsWith("/archive-review/"), v = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [D, K] = r.useState(["/sources", "/imports", "/records"].some((_) => Vi().startsWith(_))), k = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", se = !k && ["/quality", "/knowledge", "/reviews"].some((_) => o.startsWith(_)), je = o.startsWith("/training") || o.startsWith("/learn"), ye = o.startsWith("/workflows"), _e = o.startsWith("/standards"), Ce = ye || _e || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", xe = o.startsWith("/retrospectives"), F = o.startsWith("/task-packages"), he = o === "/records", ae = !v && ["/sources", "/imports", "/records"].some((_) => o.startsWith(_)), [H, ve] = r.useState(null), [Ae, Ge] = r.useState([]), [Ze, Xe] = r.useState({}), [pe, $e] = r.useState(!1), [X, fe] = r.useState(""), [y, Q] = r.useState(""), [le, we] = r.useState(!0), [m, L] = r.useState(!1), [P, te] = r.useState(0), [re, Z] = r.useState(""), [$, ze] = r.useState(""), [ne, Ee] = r.useState(""), [ct, Je] = r.useState(null), [Pe, We] = r.useState([]), [Ue, Re] = r.useState(null), [ke, De] = r.useState(!1), [st, et] = r.useState("demo-airport"), [ht, ie] = r.useState("success"), [nt, He] = r.useState(null), [O, w] = r.useState(""), [I, Se] = r.useState("processor"), [Me, lt] = r.useState("demo-airport"), [Fe, B] = r.useState([]);
  async function oe(_, me = {}) {
    const Ve = await Yt("/api/v1" + _, {
      ...me,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...me.headers }
    });
    if (!Ve.ok) {
      const Ot = await Ve.json().catch(() => ({}));
      throw new Error(Ot.message || `请求失败（${Ve.status}），请刷新后重试。`);
    }
    return Ve.json();
  }
  const ce = (_) => {
    var Ve, Ot;
    const me = window;
    u && ((Ve = me.QaxcHasPendingEdits) != null && Ve.call(me)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((Ot = me.QaxcClearPendingEdits) == null || Ot.call(me), Sj(_), T(Vi()), fe(""), Re(null), Ee(""), We([]));
  };
  r.useEffect(() => {
    const _ = () => T(Vi());
    return window.addEventListener("popstate", _), window.addEventListener("hashchange", _), () => {
      window.removeEventListener("popstate", _), window.removeEventListener("hashchange", _);
    };
  }, []), r.useEffect(() => {
    const _ = () => V(!0);
    return window.addEventListener("b-session-expired", _), () => window.removeEventListener("b-session-expired", _);
  }, []), r.useEffect(() => {
    let _ = !1;
    we(!0), fe(""), ve(null), He(null), Ge([]), B([]);
    async function me() {
      try {
        const Ve = await oe("/me");
        if (_) return;
        const Ot = window.QaxcProjectNames || {};
        u && (Ve.projects = Ve.projects.map((ot) => ({ ...ot, name: Ot[ot.id] || ot.name })));
        const qt = window.QaxcProjectId;
        u && qt && (Ve.projects = Ve.projects.filter((ot) => ot.id === qt)), ve(Ve);
        const Gt = await oe("/health");
        if (_ || ($e(Gt.worker_online), v || A || Y || ae || se || k || F || xe || je || Ce)) return;
        if (o === "/settings/access") {
          if (!Ve.projects.some((g) => g.can_manage)) return;
          const [ot, Nt] = await Promise.all([oe("/access"), oe("/audit-events?limit=10")]);
          if (_) return;
          He(ot), B(Nt.items), w((g) => {
            var Ne;
            return ot.users.some((it) => it.id === g) ? g : ((Ne = ot.users[0]) == null ? void 0 : Ne.id) || "";
          });
        } else {
          const [ot, Nt] = await Promise.all([
            oe(`/jobs?limit=12${$ ? `&kind=${$}` : ""}${re ? `&status=${re}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
            oe("/dashboard")
          ]);
          if (_) return;
          Ge(ot.items), Je(ot.next_cursor), Xe(Nt.counts);
        }
      } catch (Ve) {
        _ || fe(Ve.message);
      } finally {
        _ || we(!1);
      }
    }
    return me(), () => {
      _ = !0;
    };
  }, [h, o, re, $, ne, P]), r.useEffect(() => {
    if (!H || v || A || Y || o === "/settings/access" || ae || se || k || F || xe || je || Ce) return;
    let _ = !1;
    const me = window.setInterval(async () => {
      try {
        const [Ve, Ot, qt] = await Promise.all([
          oe(`/jobs?limit=12${$ ? `&kind=${$}` : ""}${re ? `&status=${re}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
          oe("/dashboard"),
          oe("/health")
        ]);
        if (_) return;
        Ge(Ve.items), Je(Ve.next_cursor), Xe(Ot.counts), $e(qt.worker_online), Re((Gt) => Gt ? Ve.items.find((ot) => ot.id === Gt.id) || Gt : null), fe("");
      } catch (Ve) {
        _ || (fe(Ve.message), $e(!1));
      }
    }, 2e3);
    return () => {
      _ = !0, clearInterval(me);
    };
  }, [h, o, re, $, ne, H == null ? void 0 : H.id]);
  const Ye = async (_) => {
    L(!0), fe(""), Q("");
    try {
      await _(), te((me) => me + 1);
    } catch (me) {
      fe(me.message);
    } finally {
      L(!1);
    }
  }, b = () => Ye(async () => {
    await oe("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: st, scenario: ht, duration_seconds: 6 })
    }), De(!1), Q("任务已保存，处理服务会自动执行。"), ce("/jobs");
  }), ge = (_) => Ye(async () => {
    await oe(`/jobs/${_.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: _.row_version })
    }), Q("已提交重试，原任务和来源保持不变。");
  }), de = (_) => Ye(async () => {
    const me = await Yt(`/api/v1/assets/${_.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!me.ok) {
      const qt = await me.json();
      throw new Error(qt.message);
    }
    const Ve = document.createElement("a"), Ot = URL.createObjectURL(await me.blob());
    Ve.href = Ot, Ve.download = `演示检查结果-${_.id.slice(0, 8)}.txt`, Ve.click(), URL.revokeObjectURL(Ot), Q("演示结果已下载。");
  }), Qe = !Ut && (H == null ? void 0 : H.projects.some((_) => _.can_run)), vt = (_) => {
    const me = H == null ? void 0 : H.projects.find((Ot) => Ot.id === _.project_id);
    if ((me == null ? void 0 : me.permissions) == null) return !!(me != null && me.can_run);
    const Ve = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!Ve[_.kind] && me.permissions.includes(Ve[_.kind]);
  }, M = H == null ? void 0 : H.projects.some((_) => _.can_manage), j = Object.fromEntries(((H == null ? void 0 : H.projects) || []).map((_) => [_.id, _.name])), ue = v ? "A 成果接入" : A ? "平台服务" : Y ? "归档成果复盘" : je ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Ce ? ye ? "隐患分析与知识成果" : _e ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : xe ? "过程复盘与经验" : F ? "归档成果与证据" : k ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : se ? "知识加工与审核" : ae ? he ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", be = (Ze.queued || 0) + (Ze.running || 0) + (Ze.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(Hf, { size: 26 }) }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          "工程风险",
          /* @__PURE__ */ s.jsx("span", { children: "知识与复盘培训中心" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "workspace-label", children: Ut ? "质量安全小察 / 知识与学习" : "B模块 / 开发工作区" }),
      /* @__PURE__ */ s.jsxs("nav", { "aria-label": "主导航", children: [
        Ut && /* @__PURE__ */ s.jsxs("button", { className: "nav-item", onClick: () => {
          window.location.href = "/quality/";
        }, children: [
          /* @__PURE__ */ s.jsx(Df, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Df, "我的工作台"], ["/jobs", Fj, "处理任务"]].map(([_, me, Ve]) => {
          const Ot = me;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Ve), className: o === _ || _ === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => ce(String(_)), children: [
            /* @__PURE__ */ s.jsx(Ot, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Ve) }),
            /* @__PURE__ */ s.jsx(ll, { size: 15 })
          ] }, String(_));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ae ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": D, "aria-controls": "governance-menu", onClick: () => K((_) => !_), children: [
          /* @__PURE__ */ s.jsx(Ji, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(ll, { className: D ? "expanded" : "", size: 15 })
        ] }),
        D && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, me]) => /* @__PURE__ */ s.jsx("button", { "aria-label": me, className: o.startsWith(_) ? "active" : "", onClick: () => ce(_), children: me }, _)) }),
        /* @__PURE__ */ s.jsxs("button", { className: se || Ce ? "nav-item active" : "nav-item", onClick: () => ce("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(Un, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => ce("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(Un, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: F ? "nav-item active" : "nav-item", onClick: () => ce("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(Un, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: xe ? "nav-item active" : "nav-item", onClick: () => ce("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(zf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: je ? "nav-item active" : "nav-item", onClick: () => ce(H != null && H.projects.some((_) => _.roles.some((me) => ["admin", "teacher", "reviewer"].includes(me))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(Pi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] }),
        !Ut && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ce("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(Nv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(ll, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Ji, { size: 19 }),
        /* @__PURE__ */ s.jsx("strong", { children: "项目范围隔离" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "记录、文件和操作权限",
          /* @__PURE__ */ s.jsx("br", {}),
          "随当前身份实时检查。"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "sidebar-bottom", children: [
        /* @__PURE__ */ s.jsx("span", { className: "dot" }),
        Ut ? "平台账号 · 项目授权" : "本地开发 · B07",
        /* @__PURE__ */ s.jsx("span", { className: "version", children: "v0.7" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: u ? "main-shell embedded-main" : "main-shell", children: [
      !u && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx(ll, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: ue })
        ] }),
        Ut ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (_) => {
            localStorage.setItem("b01-identity", _.target.value), N(_.target.value), Re(null), Ee(""), We([]), Q("");
          }, children: Wv.map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !v && !k && !A && !ae && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ae ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : je ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : se || Ce ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : F ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([_, me]) => /* @__PURE__ */ s.jsx("button", { className: o === _ ? "button primary" : "button ghost", onClick: () => ce(_), children: me }, _)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: ue }),
            /* @__PURE__ */ s.jsx("p", { children: v ? "指定版本接入、证据校验与过程复盘。" : je ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : ye ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : _e ? "保存规范原文与适用版本，核对来源后审核发布。" : Ce ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : xe ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : F ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : se ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ae ? he ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            u && ae && /* @__PURE__ */ s.jsx("nav", { "aria-label": "风险数据视图", className: "toprow-tabs", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, me]) => /* @__PURE__ */ s.jsx("button", { className: o === _ ? "button primary" : "button ghost", onClick: () => ce(_), children: me }, _)) }),
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => te((_) => _ + 1), disabled: le, children: [
              /* @__PURE__ */ s.jsx(Bs, { size: 16 }),
              "刷新"
            ] }),
            !Ut && !ae && !se && !k && !F && !xe && !je && !Ce && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Qe || m, onClick: () => {
              var _;
              et(((_ = H == null ? void 0 : H.projects.find((me) => me.can_run)) == null ? void 0 : _.id) || "demo-airport"), De(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(qf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Ut && !ae && !se && !k && !F && !xe && !je && !Ce && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(Hf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        U && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        X && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(Tl, { size: 18 }),
          X,
          /* @__PURE__ */ s.jsx("button", { onClick: () => te((_) => _ + 1), children: "重新加载" })
        ] }),
        y && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(zl, { size: 18 }),
          y,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Q(""), children: /* @__PURE__ */ s.jsx(Wi, { size: 16 }) })
        ] }),
        U ? null : v ? H ? /* @__PURE__ */ s.jsx(zj, { id: o.split("/").pop(), identity: H.id, projects: H.projects, navigate: ce }) : /* @__PURE__ */ s.jsx("p", { children: X || "正在读取身份…" }) : le ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Mf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : X ? null : A ? /* @__PURE__ */ s.jsx(Aj, { navigate: ce }, P) : Y ? /* @__PURE__ */ s.jsx(Rj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: ce }, o) : je ? /* @__PURE__ */ s.jsx(Vv, { api: oe, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [] }, h) : ye ? /* @__PURE__ */ s.jsx(Tj, { api: oe, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((_) => _.id).join(","))) : _e ? /* @__PURE__ */ s.jsx(kj, { api: oe, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((_) => _.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(Nj, { api: oe, projects: (H == null ? void 0 : H.projects) || [] }) }) : Ce ? /* @__PURE__ */ s.jsx($v, { api: oe, identity: h, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [], canManageModels: !!(H != null && H.can_manage_models) }, h) : xe ? /* @__PURE__ */ s.jsx(Zv, { api: oe, identity: h, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [] }, h) : F ? /* @__PURE__ */ s.jsx(Gv, { identity: h, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(qv, { identity: h, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [] }, h) : se ? /* @__PURE__ */ s.jsx(Uv, { api: oe, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : he ? /* @__PURE__ */ s.jsx(Rv, { api: oe }, h) : ae ? /* @__PURE__ */ s.jsx(kv, { api: oe, path: o, navigate: ce, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : o === "/settings/access" ? M ? nt && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                nt.bindings.length,
                " 项绑定"
              ] })
            ] }),
            /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "成员" }),
                /* @__PURE__ */ s.jsx("th", { children: "项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "角色" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: nt.bindings.map((_) => {
                var me;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (me = nt.users.find((Ve) => Ve.id === _.user_id)) == null ? void 0 : me.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: j[_.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Jf[_.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: _.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: m,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Ye(async () => {
                          await oe(`/role-bindings/${_.id}`, { method: "DELETE", body: JSON.stringify({ row_version: _.row_version }) }), Q("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, _.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Ji, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: O, onChange: (_) => w(_.target.value), children: nt.users.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Me, onChange: (_) => lt(_.target.value), children: nt.projects.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: I, onChange: (_) => Se(_.target.value), children: Object.entries(Jf).filter(([_]) => _ !== "admin" && _ !== "a_service").map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !O, onClick: () => void Ye(async () => {
              await oe("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: O, project_id: Me, role: I }) }), Q("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(Ol, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            Fe.length ? Fe.map((_) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[_.action] || _.action }),
              /* @__PURE__ */ s.jsx("span", { children: j[_.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: $i(_.created_at) })
            ] }, _.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Ji, { size: 38 }),
          /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有管理权限" }),
          /* @__PURE__ */ s.jsx("p", { children: "可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。" })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("section", { className: "metrics", "aria-label": "任务概况", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理中" }),
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsx("small", { children: "包含等待与自动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "已完成" }),
              /* @__PURE__ */ s.jsx("strong", { children: Ze.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Ze.failed ? "danger-color" : "", children: Ze.failed || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ s.jsxs("strong", { children: [
                /* @__PURE__ */ s.jsx("i", { className: `dot ${pe ? "green" : "orange"}` }),
                pe ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: pe ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: o === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: $, onChange: (_) => {
                ze(_.target.value), Ee(""), We([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Kf).map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: re, onChange: (_) => {
                Z(_.target.value), Ee(""), We([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(Nu).map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _))
              ] })
            ] }),
            Ae.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "状态" }),
                /* @__PURE__ */ s.jsx("th", { children: "进度" }),
                /* @__PURE__ */ s.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: Ae.map((_) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => Re(_), children: _.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    j[_.project_id] || _.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Kf[_.kind] || _.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${_.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  Nu[_.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${_.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    _.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: $i(_.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  _.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ce("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Re(_), children: "详情" }),
                  _.status === "failed" && vt(_) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m, onClick: () => void ge(_), children: "重试任务" }),
                  _.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: m, onClick: () => void de(_), children: /* @__PURE__ */ s.jsx(Rf, { size: 17 }) })
                ] }) })
              ] }, _.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(Un, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: re ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: re ? "切换筛选条件查看其他任务。" : Qe ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Qe && !re && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => De(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(Ol, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Ae.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !Pe.length, onClick: () => {
                  Ee(Pe[Pe.length - 1]), We(Pe.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !ct, onClick: () => {
                  We([...Pe, ne]), Ee(ct || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          o !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(zf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ce("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(Ol, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Ut ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    ke && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => De(!1), children: /* @__PURE__ */ s.jsx(Wi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: st, onChange: (_) => et(_.target.value), children: H == null ? void 0 : H.projects.filter((_) => _.can_run).map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: ht, onChange: (_) => ie(_.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !pe && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => De(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !Qe, onClick: () => void b(), children: [
          m ? /* @__PURE__ */ s.jsx(Mf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(qf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Ue && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => Re(null), children: /* @__PURE__ */ s.jsx(Wi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Ue.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        Nu[Ue.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Ue.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: j[Ue.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Ue.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: $i(Ue.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: $i(Ue.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Ue.id })
      ] }),
      Ue.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Ue.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Ue.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void de(Ue), children: [
        /* @__PURE__ */ s.jsx(Rf, { size: 16 }),
        "下载演示结果"
      ] }),
      (rt = Ue.result_links) == null ? void 0 : rt.map((_) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ce(_.path), children: _.label }, _.path)),
      Ue.status === "failed" && vt(Ue) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void ge(Ue), children: [
        /* @__PURE__ */ s.jsx(Bs, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function Iv(u) {
  const h = _j.createRoot(u);
  return h.render(/* @__PURE__ */ s.jsx(Fv, { embedded: !0 })), () => h.unmount();
}
export {
  Iv as mountKnowledge
};
