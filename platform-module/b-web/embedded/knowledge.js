var uu = { exports: {} }, An = {};
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
function xj() {
  if (ff) return An;
  ff = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function _(o, T, U) {
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
  return An.Fragment = h, An.jsx = _, An.jsxs = _, An;
}
var mf;
function jj() {
  return mf || (mf = 1, uu.exports = xj()), uu.exports;
}
var s = jj(), ou = { exports: {} }, Rn = {}, du = { exports: {} }, hu = {};
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
function vj() {
  return xf || (xf = 1, (function(u) {
    function h(y, Q) {
      var le = y.length;
      y.push(Q);
      e: for (; 0 < le; ) {
        var Ce = le - 1 >>> 1, m = y[Ce];
        if (0 < T(m, Q))
          y[Ce] = Q, y[le] = m, le = Ce;
        else break e;
      }
    }
    function _(y) {
      return y.length === 0 ? null : y[0];
    }
    function o(y) {
      if (y.length === 0) return null;
      var Q = y[0], le = y.pop();
      if (le !== Q) {
        y[0] = le;
        e: for (var Ce = 0, m = y.length, B = m >>> 1; Ce < B; ) {
          var P = 2 * (Ce + 1) - 1, te = y[P], re = P + 1, Z = y[re];
          if (0 > T(te, le))
            re < m && 0 > T(Z, te) ? (y[Ce] = Z, y[re] = le, Ce = re) : (y[Ce] = te, y[P] = le, Ce = P);
          else if (re < m && 0 > T(Z, le))
            y[Ce] = Z, y[re] = le, Ce = re;
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
    var G = [], v = [], M = 1, K = null, k = 3, se = !1, fe = !1, Ne = !1, Se = !1, Oe = typeof setTimeout == "function" ? setTimeout : null, he = typeof clearTimeout == "function" ? clearTimeout : null, F = typeof setImmediate < "u" ? setImmediate : null;
    function oe(y) {
      for (var Q = _(v); Q !== null; ) {
        if (Q.callback === null) o(v);
        else if (Q.startTime <= y)
          o(v), Q.sortIndex = Q.expirationTime, h(G, Q);
        else break;
        Q = _(v);
      }
    }
    function ne(y) {
      if (Ne = !1, oe(y), !fe)
        if (_(G) !== null)
          fe = !0, H || (H = !0, je());
        else {
          var Q = _(v);
          Q !== null && de(ne, Q.startTime - y);
        }
    }
    var H = !1, xe = -1, Re = 5, Xe = -1;
    function Ze() {
      return Se ? !0 : !(u.unstable_now() - Xe < Re);
    }
    function Qe() {
      if (Se = !1, H) {
        var y = u.unstable_now();
        Xe = y;
        var Q = !0;
        try {
          e: {
            fe = !1, Ne && (Ne = !1, he(xe), xe = -1), se = !0;
            var le = k;
            try {
              t: {
                for (oe(y), K = _(G); K !== null && !(K.expirationTime > y && Ze()); ) {
                  var Ce = K.callback;
                  if (typeof Ce == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var m = Ce(
                      K.expirationTime <= y
                    );
                    if (y = u.unstable_now(), typeof m == "function") {
                      K.callback = m, oe(y), Q = !0;
                      break t;
                    }
                    K === _(G) && o(G), oe(y);
                  } else o(G);
                  K = _(G);
                }
                if (K !== null) Q = !0;
                else {
                  var B = _(v);
                  B !== null && de(
                    ne,
                    B.startTime - y
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
          Q ? je() : H = !1;
        }
      }
    }
    var je;
    if (typeof F == "function")
      je = function() {
        F(Qe);
      };
    else if (typeof MessageChannel < "u") {
      var We = new MessageChannel(), X = We.port2;
      We.port1.onmessage = Qe, je = function() {
        X.postMessage(null);
      };
    } else
      je = function() {
        Oe(Qe, 0);
      };
    function de(y, Q) {
      xe = Oe(function() {
        y(u.unstable_now());
      }, Q);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(y) {
      y.callback = null;
    }, u.unstable_forceFrameRate = function(y) {
      0 > y || 125 < y ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Re = 0 < y ? Math.floor(1e3 / y) : 5;
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
      Se = !0;
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
      var Ce = u.unstable_now();
      switch (typeof le == "object" && le !== null ? (le = le.delay, le = typeof le == "number" && 0 < le ? Ce + le : Ce) : le = Ce, y) {
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
        id: M++,
        callback: Q,
        priorityLevel: y,
        startTime: le,
        expirationTime: m,
        sortIndex: -1
      }, le > Ce ? (y.sortIndex = le, h(v, y), _(G) === null && y === _(v) && (Ne ? (he(xe), xe = -1) : Ne = !0, de(ne, le - Ce))) : (y.sortIndex = m, h(G, y), fe || se || (fe = !0, H || (H = !0, je()))), y;
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
  })(hu)), hu;
}
var jf;
function pj() {
  return jf || (jf = 1, du.exports = vj()), du.exports;
}
var fu = { exports: {} }, ot = {};
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
function gj() {
  if (vf) return ot;
  vf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), V = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), K = Symbol.iterator;
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
  }, fe = Object.assign, Ne = {};
  function Se(m, B, P) {
    this.props = m, this.context = B, this.refs = Ne, this.updater = P || se;
  }
  Se.prototype.isReactComponent = {}, Se.prototype.setState = function(m, B) {
    if (typeof m != "object" && typeof m != "function" && m != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, m, B, "setState");
  }, Se.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Oe() {
  }
  Oe.prototype = Se.prototype;
  function he(m, B, P) {
    this.props = m, this.context = B, this.refs = Ne, this.updater = P || se;
  }
  var F = he.prototype = new Oe();
  F.constructor = he, fe(F, Se.prototype), F.isPureReactComponent = !0;
  var oe = Array.isArray, ne = { H: null, A: null, T: null, S: null, V: null }, H = Object.prototype.hasOwnProperty;
  function xe(m, B, P, te, re, Z) {
    return P = Z.ref, {
      $$typeof: u,
      type: m,
      key: B,
      ref: P !== void 0 ? P : null,
      props: Z
    };
  }
  function Re(m, B) {
    return xe(
      m.type,
      B,
      void 0,
      void 0,
      void 0,
      m.props
    );
  }
  function Xe(m) {
    return typeof m == "object" && m !== null && m.$$typeof === u;
  }
  function Ze(m) {
    var B = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(P) {
      return B[P];
    });
  }
  var Qe = /\/+/g;
  function je(m, B) {
    return typeof m == "object" && m !== null && m.key != null ? Ze("" + m.key) : B.toString(36);
  }
  function We() {
  }
  function X(m) {
    switch (m.status) {
      case "fulfilled":
        return m.value;
      case "rejected":
        throw m.reason;
      default:
        switch (typeof m.status == "string" ? m.then(We, We) : (m.status = "pending", m.then(
          function(B) {
            m.status === "pending" && (m.status = "fulfilled", m.value = B);
          },
          function(B) {
            m.status === "pending" && (m.status = "rejected", m.reason = B);
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
  function de(m, B, P, te, re) {
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
            case M:
              return $ = m._init, de(
                $(m._payload),
                B,
                P,
                te,
                re
              );
          }
      }
    if ($)
      return re = re(m), $ = te === "" ? "." + je(m, 0) : te, oe(re) ? (P = "", $ != null && (P = $.replace(Qe, "$&/") + "/"), de(re, B, P, "", function(Ee) {
        return Ee;
      })) : re != null && (Xe(re) && (re = Re(
        re,
        P + (re.key == null || m && m.key === re.key ? "" : ("" + re.key).replace(
          Qe,
          "$&/"
        ) + "/") + $
      )), B.push(re)), 1;
    $ = 0;
    var Ae = te === "" ? "." : te + ":";
    if (oe(m))
      for (var ce = 0; ce < m.length; ce++)
        te = m[ce], Z = Ae + je(te, ce), $ += de(
          te,
          B,
          P,
          Z,
          re
        );
    else if (ce = k(m), typeof ce == "function")
      for (m = ce.call(m), ce = 0; !(te = m.next()).done; )
        te = te.value, Z = Ae + je(te, ce++), $ += de(
          te,
          B,
          P,
          Z,
          re
        );
    else if (Z === "object") {
      if (typeof m.then == "function")
        return de(
          X(m),
          B,
          P,
          te,
          re
        );
      throw B = String(m), Error(
        "Objects are not valid as a React child (found: " + (B === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : B) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return $;
  }
  function y(m, B, P) {
    if (m == null) return m;
    var te = [], re = 0;
    return de(m, te, "", "", function(Z) {
      return B.call(P, Z, re++);
    }), te;
  }
  function Q(m) {
    if (m._status === -1) {
      var B = m._result;
      B = B(), B.then(
        function(P) {
          (m._status === 0 || m._status === -1) && (m._status = 1, m._result = P);
        },
        function(P) {
          (m._status === 0 || m._status === -1) && (m._status = 2, m._result = P);
        }
      ), m._status === -1 && (m._status = 0, m._result = B);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var le = typeof reportError == "function" ? reportError : function(m) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var B = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof m == "object" && m !== null && typeof m.message == "string" ? String(m.message) : String(m),
        error: m
      });
      if (!window.dispatchEvent(B)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", m);
      return;
    }
    console.error(m);
  };
  function Ce() {
  }
  return ot.Children = {
    map: y,
    forEach: function(m, B, P) {
      y(
        m,
        function() {
          B.apply(this, arguments);
        },
        P
      );
    },
    count: function(m) {
      var B = 0;
      return y(m, function() {
        B++;
      }), B;
    },
    toArray: function(m) {
      return y(m, function(B) {
        return B;
      }) || [];
    },
    only: function(m) {
      if (!Xe(m))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return m;
    }
  }, ot.Component = Se, ot.Fragment = _, ot.Profiler = T, ot.PureComponent = he, ot.StrictMode = o, ot.Suspense = G, ot.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ne, ot.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(m) {
      return ne.H.useMemoCache(m);
    }
  }, ot.cache = function(m) {
    return function() {
      return m.apply(null, arguments);
    };
  }, ot.cloneElement = function(m, B, P) {
    if (m == null)
      throw Error(
        "The argument must be a React element, but you passed " + m + "."
      );
    var te = fe({}, m.props), re = m.key, Z = void 0;
    if (B != null)
      for ($ in B.ref !== void 0 && (Z = void 0), B.key !== void 0 && (re = "" + B.key), B)
        !H.call(B, $) || $ === "key" || $ === "__self" || $ === "__source" || $ === "ref" && B.ref === void 0 || (te[$] = B[$]);
    var $ = arguments.length - 2;
    if ($ === 1) te.children = P;
    else if (1 < $) {
      for (var Ae = Array($), ce = 0; ce < $; ce++)
        Ae[ce] = arguments[ce + 2];
      te.children = Ae;
    }
    return xe(m.type, re, void 0, void 0, Z, te);
  }, ot.createContext = function(m) {
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
  }, ot.createElement = function(m, B, P) {
    var te, re = {}, Z = null;
    if (B != null)
      for (te in B.key !== void 0 && (Z = "" + B.key), B)
        H.call(B, te) && te !== "key" && te !== "__self" && te !== "__source" && (re[te] = B[te]);
    var $ = arguments.length - 2;
    if ($ === 1) re.children = P;
    else if (1 < $) {
      for (var Ae = Array($), ce = 0; ce < $; ce++)
        Ae[ce] = arguments[ce + 2];
      re.children = Ae;
    }
    if (m && m.defaultProps)
      for (te in $ = m.defaultProps, $)
        re[te] === void 0 && (re[te] = $[te]);
    return xe(m, Z, void 0, void 0, null, re);
  }, ot.createRef = function() {
    return { current: null };
  }, ot.forwardRef = function(m) {
    return { $$typeof: A, render: m };
  }, ot.isValidElement = Xe, ot.lazy = function(m) {
    return {
      $$typeof: M,
      _payload: { _status: -1, _result: m },
      _init: Q
    };
  }, ot.memo = function(m, B) {
    return {
      $$typeof: v,
      type: m,
      compare: B === void 0 ? null : B
    };
  }, ot.startTransition = function(m) {
    var B = ne.T, P = {};
    ne.T = P;
    try {
      var te = m(), re = ne.S;
      re !== null && re(P, te), typeof te == "object" && te !== null && typeof te.then == "function" && te.then(Ce, le);
    } catch (Z) {
      le(Z);
    } finally {
      ne.T = B;
    }
  }, ot.unstable_useCacheRefresh = function() {
    return ne.H.useCacheRefresh();
  }, ot.use = function(m) {
    return ne.H.use(m);
  }, ot.useActionState = function(m, B, P) {
    return ne.H.useActionState(m, B, P);
  }, ot.useCallback = function(m, B) {
    return ne.H.useCallback(m, B);
  }, ot.useContext = function(m) {
    return ne.H.useContext(m);
  }, ot.useDebugValue = function() {
  }, ot.useDeferredValue = function(m, B) {
    return ne.H.useDeferredValue(m, B);
  }, ot.useEffect = function(m, B, P) {
    var te = ne.H;
    if (typeof P == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return te.useEffect(m, B);
  }, ot.useId = function() {
    return ne.H.useId();
  }, ot.useImperativeHandle = function(m, B, P) {
    return ne.H.useImperativeHandle(m, B, P);
  }, ot.useInsertionEffect = function(m, B) {
    return ne.H.useInsertionEffect(m, B);
  }, ot.useLayoutEffect = function(m, B) {
    return ne.H.useLayoutEffect(m, B);
  }, ot.useMemo = function(m, B) {
    return ne.H.useMemo(m, B);
  }, ot.useOptimistic = function(m, B) {
    return ne.H.useOptimistic(m, B);
  }, ot.useReducer = function(m, B, P) {
    return ne.H.useReducer(m, B, P);
  }, ot.useRef = function(m) {
    return ne.H.useRef(m);
  }, ot.useState = function(m) {
    return ne.H.useState(m);
  }, ot.useSyncExternalStore = function(m, B, P) {
    return ne.H.useSyncExternalStore(
      m,
      B,
      P
    );
  }, ot.useTransition = function() {
    return ne.H.useTransition();
  }, ot.version = "19.1.0", ot;
}
var pf;
function Tu() {
  return pf || (pf = 1, fu.exports = gj()), fu.exports;
}
var mu = { exports: {} }, is = {};
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
function bj() {
  if (gf) return is;
  gf = 1;
  var u = Tu();
  function h(G) {
    var v = "https://react.dev/errors/" + G;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var M = 2; M < arguments.length; M++)
        v += "&args[]=" + encodeURIComponent(arguments[M]);
    }
    return "Minified React error #" + G + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function _() {
  }
  var o = {
    d: {
      f: _,
      r: function() {
        throw Error(h(522));
      },
      D: _,
      C: _,
      L: _,
      m: _,
      X: _,
      S: _,
      M: _
    },
    p: 0,
    findDOMNode: null
  }, T = Symbol.for("react.portal");
  function U(G, v, M) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: T,
      key: K == null ? null : "" + K,
      children: G,
      containerInfo: v,
      implementation: M
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function A(G, v) {
    if (G === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return is.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, is.createPortal = function(G, v) {
    var M = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(h(299));
    return U(G, v, null, M);
  }, is.flushSync = function(G) {
    var v = V.T, M = o.p;
    try {
      if (V.T = null, o.p = 2, G) return G();
    } finally {
      V.T = v, o.p = M, o.d.f();
    }
  }, is.preconnect = function(G, v) {
    typeof G == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, o.d.C(G, v));
  }, is.prefetchDNS = function(G) {
    typeof G == "string" && o.d.D(G);
  }, is.preinit = function(G, v) {
    if (typeof G == "string" && v && typeof v.as == "string") {
      var M = v.as, K = A(M, v.crossOrigin), k = typeof v.integrity == "string" ? v.integrity : void 0, se = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      M === "style" ? o.d.S(
        G,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: se
        }
      ) : M === "script" && o.d.X(G, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: se,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, is.preinitModule = function(G, v) {
    if (typeof G == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var M = A(
            v.as,
            v.crossOrigin
          );
          o.d.M(G, {
            crossOrigin: M,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && o.d.M(G);
  }, is.preload = function(G, v) {
    if (typeof G == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var M = v.as, K = A(M, v.crossOrigin);
      o.d.L(G, M, {
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
  }, is.preloadModule = function(G, v) {
    if (typeof G == "string")
      if (v) {
        var M = A(v.as, v.crossOrigin);
        o.d.m(G, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: M,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else o.d.m(G);
  }, is.requestFormReset = function(G) {
    o.d.r(G);
  }, is.unstable_batchedUpdates = function(G, v) {
    return G(v);
  }, is.useFormState = function(G, v, M) {
    return V.H.useFormState(G, v, M);
  }, is.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, is.version = "19.1.0", is;
}
var bf;
function yj() {
  if (bf) return mu.exports;
  bf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), mu.exports = bj(), mu.exports;
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
function _j() {
  if (yf) return Rn;
  yf = 1;
  var u = pj(), h = Tu(), _ = yj();
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
  function G(e) {
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
  var M = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), se = Symbol.for("react.portal"), fe = Symbol.for("react.fragment"), Ne = Symbol.for("react.strict_mode"), Se = Symbol.for("react.profiler"), Oe = Symbol.for("react.provider"), he = Symbol.for("react.consumer"), F = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), xe = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), Xe = Symbol.for("react.activity"), Ze = Symbol.for("react.memo_cache_sentinel"), Qe = Symbol.iterator;
  function je(e) {
    return e === null || typeof e != "object" ? null : (e = Qe && e[Qe] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var We = Symbol.for("react.client.reference");
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === We ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case fe:
        return "Fragment";
      case Se:
        return "Profiler";
      case Ne:
        return "StrictMode";
      case ne:
        return "Suspense";
      case H:
        return "SuspenseList";
      case Xe:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case se:
          return "Portal";
        case F:
          return (e.displayName || "Context") + ".Provider";
        case he:
          return (e._context.displayName || "Context") + ".Consumer";
        case oe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case xe:
          return t = e.displayName || null, t !== null ? t : X(e.type) || "Memo";
        case Re:
          t = e._payload, e = e._init;
          try {
            return X(e(t));
          } catch {
          }
      }
    return null;
  }
  var de = Array.isArray, y = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ce = [], m = -1;
  function B(e) {
    return { current: e };
  }
  function P(e) {
    0 > m || (e.current = Ce[m], Ce[m] = null, m--);
  }
  function te(e, t) {
    m++, Ce[m] = e.current, e.current = t;
  }
  var re = B(null), Z = B(null), $ = B(null), Ae = B(null);
  function ce(e, t) {
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
    e.memoizedState !== null && te(Ae, e);
    var t = re.current, l = Yh(t, e.type);
    t !== l && (te(Z, e), te(re, l));
  }
  function lt(e) {
    Z.current === e && (P(re), P(Z)), Ae.current === e && (P(Ae), Cn._currentValue = le);
  }
  var et = Object.prototype.hasOwnProperty, Be = u.unstable_scheduleCallback, De = u.unstable_cancelCallback, Me = u.unstable_shouldYield, we = u.unstable_requestPaint, qe = u.unstable_now, tt = u.unstable_getCurrentPriorityLevel, Ke = u.unstable_ImmediatePriority, dt = u.unstable_UserBlockingPriority, ve = u.unstable_NormalPriority, ht = u.unstable_LowPriority, ye = u.unstable_IdlePriority, E = u.log, w = u.unstable_setDisableYieldValue, I = null, _e = null;
  function He(e) {
    if (typeof E == "function" && w(e), _e && typeof _e.setStrictMode == "function")
      try {
        _e.setStrictMode(I, e);
      } catch {
      }
  }
  var at = Math.clz32 ? Math.clz32 : ie, rt = Math.log, L = Math.LN2;
  function ie(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (rt(e) / L | 0) | 0;
  }
  var ae = 256, Le = 4194304;
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
  function pe(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Ye(e, t) {
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
  function nt() {
    var e = ae;
    return ae <<= 1, (ae & 4194048) === 0 && (ae = 256), e;
  }
  function D() {
    var e = Le;
    return Le <<= 1, (Le & 62914560) === 0 && (Le = 4194304), e;
  }
  function x(e) {
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
      var J = 31 - at(l), ee = 1 << J;
      d[J] = 0, p[J] = -1;
      var R = z[J];
      if (R !== null)
        for (z[J] = null, J = 0; J < R.length; J++) {
          var q = R[J];
          q !== null && (q.lane &= -536870913);
        }
      l &= ~ee;
    }
    a !== 0 && st(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function st(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - at(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function N(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - at(l), n = 1 << a;
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
  function kt() {
    var e = Q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : cf(e.type));
  }
  function Lt(e, t) {
    var l = Q.p;
    try {
      return Q.p = e, t();
    } finally {
      Q.p = l;
    }
  }
  var qt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + qt, Nt = "__reactProps$" + qt, g = "__reactContainer$" + qt, ke = "__reactEvents$" + qt, it = "__reactListeners$" + qt, pt = "__reactHandles$" + qt, j = "__reactResources$" + qt, Te = "__reactMarker$" + qt;
  function ze(e) {
    delete e[ut], delete e[Nt], delete e[ke], delete e[it], delete e[pt];
  }
  function Pe(e) {
    var t = e[ut];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[g] || l[ut]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Zh(e); e !== null; ) {
            if (l = e[ut]) return l;
            e = Zh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Zt(e) {
    if (e = e[ut] || e[g]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function _s(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function fs(e) {
    var t = e[j];
    return t || (t = e[j] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function At(e) {
    e[Te] = !0;
  }
  var ul = /* @__PURE__ */ new Set(), Qs = {};
  function f(e, t) {
    Y(e, t), Y(e + "Capture", t);
  }
  function Y(e, t) {
    for (Qs[e] = t, e = 0; e < t.length; e++)
      ul.add(t[e]);
  }
  var Je = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Yt = {}, bt = {};
  function rs(e) {
    return et.call(bt, e) ? !0 : et.call(Yt, e) ? !1 : Je.test(e) ? bt[e] = !0 : (Yt[e] = !0, !1);
  }
  function As(e, t, l) {
    if (rs(t))
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
  function It(e, t, l) {
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
  function $t(e, t, l, a) {
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
  var ms, Ul;
  function Zs(e) {
    if (ms === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        ms = t && t[1] || "", Ul = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ms + e + Ul;
  }
  var Pl = !1;
  function nc(e, t) {
    if (!e || Pl) return "";
    Pl = !0;
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
      Pl = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Zs(l) : "";
  }
  function um(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Zs(e.type);
      case 16:
        return Zs("Lazy");
      case 13:
        return Zs("Suspense");
      case 19:
        return Zs("SuspenseList");
      case 0:
      case 15:
        return nc(e.type, !1);
      case 11:
        return nc(e.type.render, !1);
      case 1:
        return nc(e.type, !0);
      case 31:
        return Zs("Activity");
      default:
        return "";
    }
  }
  function Ru(e) {
    try {
      var t = "";
      do
        t += um(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function Ns(e) {
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
  function Du(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function om(e) {
    var t = Du(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
  function Yn(e) {
    e._valueTracker || (e._valueTracker = om(e));
  }
  function Uu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Du(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Gn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var dm = /[\n"\\]/g;
  function Ss(e) {
    return e.replace(
      dm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ic(e, t, l, a, n, i, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ns(t)) : e.value !== "" + Ns(t) && (e.value = "" + Ns(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? cc(e, c, Ns(t)) : l != null ? cc(e, c, Ns(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + Ns(d) : e.removeAttribute("name");
  }
  function Mu(e, t, l, a, n, i, c, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + Ns(l) : "", t = t != null ? "" + Ns(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function cc(e, t, l) {
    t === "number" && Gn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function ea(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Ns(l), t = null, n = 0; n < e.length; n++) {
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
    if (t != null && (t = "" + Ns(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Ns(l) : "";
  }
  function Hu(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (de(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Ns(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
  }
  function ta(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var hm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Bu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || hm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
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
  function rc(e) {
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
  var fm = /* @__PURE__ */ new Map([
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
  ]), mm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Xn(e) {
    return mm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var uc = null;
  function oc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var sa = null, la = null;
  function Yu(e) {
    var t = Zt(e);
    if (t && (e = t.stateNode)) {
      var l = e[Nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (ic(
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
              'input[name="' + Ss(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[Nt] || null;
                if (!n) throw Error(o(90));
                ic(
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
              a = l[t], a.form === e.form && Uu(a);
          }
          break e;
        case "textarea":
          qu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && ea(e, !!l.multiple, t, !1);
      }
    }
  }
  var dc = !1;
  function Gu(e, t, l) {
    if (dc) return e(t, l);
    dc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (dc = !1, (sa !== null || la !== null) && (Ei(), sa && (t = sa, e = la, la = sa = null, Yu(t), e)))
        for (t = 0; t < e.length; t++) Yu(e[t]);
    }
  }
  function Ba(e, t) {
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
  var Vs = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), hc = !1;
  if (Vs)
    try {
      var La = {};
      Object.defineProperty(La, "passive", {
        get: function() {
          hc = !0;
        }
      }), window.addEventListener("test", La, La), window.removeEventListener("test", La, La);
    } catch {
      hc = !1;
    }
  var ol = null, fc = null, Qn = null;
  function Xu() {
    if (Qn) return Qn;
    var e, t = fc, l = t.length, a, n = "value" in ol ? ol.value : ol.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Qn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Zn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Vn() {
    return !0;
  }
  function Qu() {
    return !1;
  }
  function us(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Vn : Qu, this.isPropagationStopped = Qu, this;
    }
    return M(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Vn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Vn);
      },
      persist: function() {
      },
      isPersistent: Vn
    }), t;
  }
  var Ml = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Jn = us(Ml), Ya = M({}, Ml, { view: 0, detail: 0 }), xm = us(Ya), mc, xc, Ga, Kn = M({}, Ya, {
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
    getModifierState: vc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ga && (Ga && e.type === "mousemove" ? (mc = e.screenX - Ga.screenX, xc = e.screenY - Ga.screenY) : xc = mc = 0, Ga = e), mc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : xc;
    }
  }), Zu = us(Kn), jm = M({}, Kn, { dataTransfer: 0 }), vm = us(jm), pm = M({}, Ya, { relatedTarget: 0 }), jc = us(pm), gm = M({}, Ml, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bm = us(gm), ym = M({}, Ml, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), _m = us(ym), Nm = M({}, Ml, { data: 0 }), Vu = us(Nm), Sm = {
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
  }, wm = {
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
  }, km = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Cm(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = km[e]) ? !!t[e] : !1;
  }
  function vc() {
    return Cm;
  }
  var Em = M({}, Ya, {
    key: function(e) {
      if (e.key) {
        var t = Sm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Zn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: vc,
    charCode: function(e) {
      return e.type === "keypress" ? Zn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Zn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Om = us(Em), Tm = M({}, Kn, {
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
  }), Ju = us(Tm), zm = M({}, Ya, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: vc
  }), Am = us(zm), Rm = M({}, Ml, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Dm = us(Rm), Um = M({}, Kn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Mm = us(Um), qm = M({}, Ml, {
    newState: 0,
    oldState: 0
  }), Hm = us(qm), Bm = [9, 13, 27, 32], pc = Vs && "CompositionEvent" in window, Xa = null;
  Vs && "documentMode" in document && (Xa = document.documentMode);
  var Lm = Vs && "TextEvent" in window && !Xa, Ku = Vs && (!pc || Xa && 8 < Xa && 11 >= Xa), $u = " ", Wu = !1;
  function Fu(e, t) {
    switch (e) {
      case "keyup":
        return Bm.indexOf(t.keyCode) !== -1;
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
  var aa = !1;
  function Ym(e, t) {
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
  function Gm(e, t) {
    if (aa)
      return e === "compositionend" || !pc && Fu(e, t) ? (e = Xu(), Qn = fc = ol = null, aa = !1, e) : null;
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
  var Xm = {
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
    return t === "input" ? !!Xm[e.type] : t === "textarea";
  }
  function eo(e, t, l, a) {
    sa ? la ? la.push(a) : la = [a] : sa = a, t = Di(t, "onChange"), 0 < t.length && (l = new Jn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Qa = null, Za = null;
  function Qm(e) {
    Uh(e, 0);
  }
  function $n(e) {
    var t = _s(e);
    if (Uu(t)) return e;
  }
  function to(e, t) {
    if (e === "change") return t;
  }
  var so = !1;
  if (Vs) {
    var gc;
    if (Vs) {
      var bc = "oninput" in document;
      if (!bc) {
        var lo = document.createElement("div");
        lo.setAttribute("oninput", "return;"), bc = typeof lo.oninput == "function";
      }
      gc = bc;
    } else gc = !1;
    so = gc && (!document.documentMode || 9 < document.documentMode);
  }
  function ao() {
    Qa && (Qa.detachEvent("onpropertychange", no), Za = Qa = null);
  }
  function no(e) {
    if (e.propertyName === "value" && $n(Za)) {
      var t = [];
      eo(
        t,
        Za,
        e,
        oc(e)
      ), Gu(Qm, t);
    }
  }
  function Zm(e, t, l) {
    e === "focusin" ? (ao(), Qa = t, Za = l, Qa.attachEvent("onpropertychange", no)) : e === "focusout" && ao();
  }
  function Vm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return $n(Za);
  }
  function Jm(e, t) {
    if (e === "click") return $n(t);
  }
  function Km(e, t) {
    if (e === "input" || e === "change")
      return $n(t);
  }
  function $m(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var xs = typeof Object.is == "function" ? Object.is : $m;
  function Va(e, t) {
    if (xs(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!et.call(t, n) || !xs(e[n], t[n]))
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
    for (var t = Gn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Gn(e.document);
    }
    return t;
  }
  function yc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Wm = Vs && "documentMode" in document && 11 >= document.documentMode, na = null, _c = null, Ja = null, Nc = !1;
  function oo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Nc || na == null || na !== Gn(a) || (a = na, "selectionStart" in a && yc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ja && Va(Ja, a) || (Ja = a, a = Di(_c, "onSelect"), 0 < a.length && (t = new Jn(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = na)));
  }
  function ql(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var ia = {
    animationend: ql("Animation", "AnimationEnd"),
    animationiteration: ql("Animation", "AnimationIteration"),
    animationstart: ql("Animation", "AnimationStart"),
    transitionrun: ql("Transition", "TransitionRun"),
    transitionstart: ql("Transition", "TransitionStart"),
    transitioncancel: ql("Transition", "TransitionCancel"),
    transitionend: ql("Transition", "TransitionEnd")
  }, Sc = {}, ho = {};
  Vs && (ho = document.createElement("div").style, "AnimationEvent" in window || (delete ia.animationend.animation, delete ia.animationiteration.animation, delete ia.animationstart.animation), "TransitionEvent" in window || delete ia.transitionend.transition);
  function Hl(e) {
    if (Sc[e]) return Sc[e];
    if (!ia[e]) return e;
    var t = ia[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in ho)
        return Sc[e] = t[l];
    return e;
  }
  var fo = Hl("animationend"), mo = Hl("animationiteration"), xo = Hl("animationstart"), Fm = Hl("transitionrun"), Im = Hl("transitionstart"), Pm = Hl("transitioncancel"), jo = Hl("transitionend"), vo = /* @__PURE__ */ new Map(), wc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  wc.push("scrollEnd");
  function Rs(e, t) {
    vo.set(e, t), f(t, [e]);
  }
  var po = /* @__PURE__ */ new WeakMap();
  function ws(e, t) {
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
  var ks = [], ca = 0, kc = 0;
  function Wn() {
    for (var e = ca, t = kc = ca = 0; t < e; ) {
      var l = ks[t];
      ks[t++] = null;
      var a = ks[t];
      ks[t++] = null;
      var n = ks[t];
      ks[t++] = null;
      var i = ks[t];
      if (ks[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && go(l, n, i);
    }
  }
  function Fn(e, t, l, a) {
    ks[ca++] = e, ks[ca++] = t, ks[ca++] = l, ks[ca++] = a, kc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Cc(e, t, l, a) {
    return Fn(e, t, l, a), In(e);
  }
  function ra(e, t) {
    return Fn(e, null, null, t), In(e);
  }
  function go(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - at(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function In(e) {
    if (50 < gn)
      throw gn = 0, Rr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var ua = {};
  function ex(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function js(e, t, l, a) {
    return new ex(e, t, l, a);
  }
  function Ec(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Js(e, t) {
    var l = e.alternate;
    return l === null ? (l = js(
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
  function Pn(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") Ec(e) && (c = 1);
    else if (typeof e == "string")
      c = sj(
        e,
        l,
        re.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Xe:
          return e = js(31, l, t, n), e.elementType = Xe, e.lanes = i, e;
        case fe:
          return Bl(l.children, n, i, t);
        case Ne:
          c = 8, n |= 24;
          break;
        case Se:
          return e = js(12, l, t, n | 2), e.elementType = Se, e.lanes = i, e;
        case ne:
          return e = js(13, l, t, n), e.elementType = ne, e.lanes = i, e;
        case H:
          return e = js(19, l, t, n), e.elementType = H, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Oe:
              case F:
                c = 10;
                break e;
              case he:
                c = 9;
                break e;
              case oe:
                c = 11;
                break e;
              case xe:
                c = 14;
                break e;
              case Re:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = js(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Bl(e, t, l, a) {
    return e = js(7, e, a, t), e.lanes = l, e;
  }
  function Oc(e, t, l) {
    return e = js(6, e, null, t), e.lanes = l, e;
  }
  function Tc(e, t, l) {
    return t = js(
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
  var oa = [], da = 0, ei = null, ti = 0, Cs = [], Es = 0, Ll = null, Ks = 1, $s = "";
  function Yl(e, t) {
    oa[da++] = ti, oa[da++] = ei, ei = e, ti = t;
  }
  function yo(e, t, l) {
    Cs[Es++] = Ks, Cs[Es++] = $s, Cs[Es++] = Ll, Ll = e;
    var a = Ks;
    e = $s;
    var n = 32 - at(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - at(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Ks = 1 << 32 - at(t) + n | l << n | a, $s = i + e;
    } else
      Ks = 1 << i | l << n | a, $s = e;
  }
  function zc(e) {
    e.return !== null && (Yl(e, 1), yo(e, 1, 0));
  }
  function Ac(e) {
    for (; e === ei; )
      ei = oa[--da], oa[da] = null, ti = oa[--da], oa[da] = null;
    for (; e === Ll; )
      Ll = Cs[--Es], Cs[Es] = null, $s = Cs[--Es], Cs[Es] = null, Ks = Cs[--Es], Cs[Es] = null;
  }
  var cs = null, Ht = null, yt = !1, Gl = null, Hs = !1, Rc = Error(o(519));
  function Xl(e) {
    var t = Error(o(418, ""));
    throw Wa(ws(t, e)), Rc;
  }
  function _o(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[ut] = e, t[Nt] = a, l) {
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
        for (l = 0; l < yn.length; l++)
          jt(yn[l], t);
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
        ), Yn(t);
        break;
      case "select":
        jt("invalid", t);
        break;
      case "textarea":
        jt("invalid", t), Hu(t, a.value, a.defaultValue, a.children), Yn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Bh(t.textContent, l) ? (a.popover != null && (jt("beforetoggle", t), jt("toggle", t)), a.onScroll != null && jt("scroll", t), a.onScrollEnd != null && jt("scrollend", t), a.onClick != null && (t.onclick = Ui), t = !0) : t = !1, t || Xl(e);
  }
  function No(e) {
    for (cs = e.return; cs; )
      switch (cs.tag) {
        case 5:
        case 13:
          Hs = !1;
          return;
        case 27:
        case 3:
          Hs = !0;
          return;
        default:
          cs = cs.return;
      }
  }
  function Ka(e) {
    if (e !== cs) return !1;
    if (!yt) return No(e), yt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || $r(e.type, e.memoizedProps)), l = !l), l && Ht && Xl(e), No(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Ht = Us(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        Ht = null;
      }
    } else
      t === 27 ? (t = Ht, kl(e.type) ? (e = Pr, Pr = null, Ht = e) : Ht = t) : Ht = cs ? Us(e.stateNode.nextSibling) : null;
    return !0;
  }
  function $a() {
    Ht = cs = null, yt = !1;
  }
  function So() {
    var e = Gl;
    return e !== null && (hs === null ? hs = e : hs.push.apply(
      hs,
      e
    ), Gl = null), e;
  }
  function Wa(e) {
    Gl === null ? Gl = [e] : Gl.push(e);
  }
  var Dc = B(null), Ql = null, Ws = null;
  function dl(e, t, l) {
    te(Dc, t._currentValue), t._currentValue = l;
  }
  function Fs(e) {
    e._currentValue = Dc.current, P(Dc);
  }
  function Uc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Mc(e, t, l, a) {
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
              i.lanes |= l, d = i.alternate, d !== null && (d.lanes |= l), Uc(
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
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Uc(c, l, e), c = null;
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
  function Fa(e, t, l, a) {
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
          xs(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === Ae.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Cn) : e = [Cn]);
      }
      n = n.return;
    }
    e !== null && Mc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function si(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!xs(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Zl(e) {
    Ql = e, Ws = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ns(e) {
    return wo(Ql, e);
  }
  function li(e, t) {
    return Ql === null && Zl(e), wo(e, t);
  }
  function wo(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ws === null) {
      if (e === null) throw Error(o(308));
      Ws = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ws = Ws.next = t;
    return l;
  }
  var tx = typeof AbortController < "u" ? AbortController : function() {
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
  }, sx = u.unstable_scheduleCallback, lx = u.unstable_NormalPriority, Wt = {
    $$typeof: F,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function qc() {
    return {
      controller: new tx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ia(e) {
    e.refCount--, e.refCount === 0 && sx(lx, function() {
      e.controller.abort();
    });
  }
  var Pa = null, Hc = 0, ha = 0, fa = null;
  function ax(e, t) {
    if (Pa === null) {
      var l = Pa = [];
      Hc = 0, ha = Lr(), fa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Hc++, t.then(ko, ko), t;
  }
  function ko() {
    if (--Hc === 0 && Pa !== null) {
      fa !== null && (fa.status = "fulfilled");
      var e = Pa;
      Pa = null, ha = 0, fa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function nx(e, t) {
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
    typeof t == "object" && t !== null && typeof t.then == "function" && ax(e, t), Co !== null && Co(e, t);
  };
  var Vl = B(null);
  function Bc() {
    var e = Vl.current;
    return e !== null ? e : zt.pooledCache;
  }
  function ai(e, t) {
    t === null ? te(Vl, Vl.current) : te(Vl, t.pool);
  }
  function Eo() {
    var e = Bc();
    return e === null ? null : { parent: Wt._currentValue, pool: e };
  }
  var en = Error(o(460)), Oo = Error(o(474)), ni = Error(o(542)), Lc = { then: function() {
  } };
  function To(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function ii() {
  }
  function zo(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(ii, ii), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ro(e), e;
      default:
        if (typeof t.status == "string") t.then(ii, ii);
        else {
          if (e = zt, e !== null && 100 < e.shellSuspendCounter)
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
        throw tn = t, en;
    }
  }
  var tn = null;
  function Ao() {
    if (tn === null) throw Error(o(459));
    var e = tn;
    return tn = null, e;
  }
  function Ro(e) {
    if (e === en || e === ni)
      throw Error(o(483));
  }
  var hl = !1;
  function Yc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Gc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function fl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ml(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (St & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = In(e), go(e, null, l), t;
    }
    return Fn(e, a, t, l), In(e);
  }
  function sn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  function Xc(e, t) {
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
  var Qc = !1;
  function ln() {
    if (Qc) {
      var e = fa;
      if (e !== null) throw e;
    }
  }
  function an(e, t, l, a) {
    Qc = !1;
    var n = e.updateQueue;
    hl = !1;
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
        if (q ? (vt & R) === R : (a & R) === R) {
          R !== 0 && R === ha && (Qc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var Ie = e, $e = d;
            R = t;
            var Ot = l;
            switch ($e.tag) {
              case 1:
                if (Ie = $e.payload, typeof Ie == "function") {
                  ee = Ie.call(Ot, ee, R);
                  break e;
                }
                ee = Ie;
                break e;
              case 3:
                Ie.flags = Ie.flags & -65537 | 128;
              case 0:
                if (Ie = $e.payload, R = typeof Ie == "function" ? Ie.call(Ot, ee, R) : Ie, R == null) break e;
                ee = M({}, ee, R);
                break e;
              case 2:
                hl = !0;
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
      J === null && (p = ee), n.baseState = p, n.firstBaseUpdate = z, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), _l |= c, e.lanes = c, e.memoizedState = ee;
    }
  }
  function Do(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Uo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Do(l[e], t);
  }
  var ma = B(null), ci = B(0);
  function Mo(e, t) {
    e = al, te(ci, e), te(ma, t), al = e | t.baseLanes;
  }
  function Zc() {
    te(ci, al), te(ma, ma.current);
  }
  function Vc() {
    al = ci.current, P(ma), P(ci);
  }
  var xl = 0, ft = null, Ct = null, Vt = null, ri = !1, xa = !1, Jl = !1, ui = 0, nn = 0, ja = null, ix = 0;
  function Gt() {
    throw Error(o(321));
  }
  function Jc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!xs(e[l], t[l])) return !1;
    return !0;
  }
  function Kc(e, t, l, a, n, i) {
    return xl = i, ft = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, y.H = e === null || e.memoizedState === null ? gd : bd, Jl = !1, i = l(a, n), Jl = !1, xa && (i = Ho(
      t,
      l,
      a,
      n
    )), qo(e), i;
  }
  function qo(e) {
    y.H = xi;
    var t = Ct !== null && Ct.next !== null;
    if (xl = 0, Vt = Ct = ft = null, ri = !1, nn = 0, ja = null, t) throw Error(o(300));
    e === null || Pt || (e = e.dependencies, e !== null && si(e) && (Pt = !0));
  }
  function Ho(e, t, l, a) {
    ft = e;
    var n = 0;
    do {
      if (xa && (ja = null), nn = 0, xa = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Vt = Ct = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      y.H = fx, i = t(l, a);
    } while (xa);
    return i;
  }
  function cx() {
    var e = y.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? cn(t) : t, e = e.useState()[0], (Ct !== null ? Ct.memoizedState : null) !== e && (ft.flags |= 1024), t;
  }
  function $c() {
    var e = ui !== 0;
    return ui = 0, e;
  }
  function Wc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Fc(e) {
    if (ri) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ri = !1;
    }
    xl = 0, Vt = Ct = ft = null, xa = !1, nn = ui = 0, ja = null;
  }
  function os() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Vt === null ? ft.memoizedState = Vt = e : Vt = Vt.next = e, Vt;
  }
  function Jt() {
    if (Ct === null) {
      var e = ft.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ct.next;
    var t = Vt === null ? ft.memoizedState : Vt.next;
    if (t !== null)
      Vt = t, Ct = e;
    else {
      if (e === null)
        throw ft.alternate === null ? Error(o(467)) : Error(o(310));
      Ct = e, e = {
        memoizedState: Ct.memoizedState,
        baseState: Ct.baseState,
        baseQueue: Ct.baseQueue,
        queue: Ct.queue,
        next: null
      }, Vt === null ? ft.memoizedState = Vt = e : Vt = Vt.next = e;
    }
    return Vt;
  }
  function Ic() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function cn(e) {
    var t = nn;
    return nn += 1, ja === null && (ja = []), e = zo(ja, e, t), t = ft, (Vt === null ? t.memoizedState : Vt.next) === null && (t = t.alternate, y.H = t === null || t.memoizedState === null ? gd : bd), e;
  }
  function oi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return cn(e);
      if (e.$$typeof === F) return ns(e);
    }
    throw Error(o(438, String(e)));
  }
  function Pc(e) {
    var t = null, l = ft.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ft.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Ic(), ft.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ze;
    return t.index++, l;
  }
  function Is(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function di(e) {
    var t = Jt();
    return er(t, Ct, e);
  }
  function er(e, t, l) {
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
        if (ee !== z.lane ? (vt & ee) === ee : (xl & ee) === ee) {
          var R = z.revertLane;
          if (R === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), ee === ha && (J = !0);
          else if ((xl & R) === R) {
            z = z.next, R === ha && (J = !0);
            continue;
          } else
            ee = {
              lane: 0,
              revertLane: z.revertLane,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, p === null ? (d = p = ee, c = i) : p = p.next = ee, ft.lanes |= R, _l |= R;
          ee = z.action, Jl && l(i, ee), i = z.hasEagerState ? z.eagerState : l(i, ee);
        } else
          R = {
            lane: ee,
            revertLane: z.revertLane,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, p === null ? (d = p = R, c = i) : p = p.next = R, ft.lanes |= ee, _l |= ee;
        z = z.next;
      } while (z !== null && z !== t);
      if (p === null ? c = i : p.next = d, !xs(i, e.memoizedState) && (Pt = !0, J && (l = fa, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = p, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function tr(e) {
    var t = Jt(), l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== n);
      xs(i, t.memoizedState) || (Pt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Bo(e, t, l) {
    var a = ft, n = Jt(), i = yt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !xs(
      (Ct || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Pt = !0), n = n.queue;
    var d = Go.bind(null, a, n, e);
    if (rn(2048, 8, d, [e]), n.getSnapshot !== t || c || Vt !== null && Vt.memoizedState.tag & 1) {
      if (a.flags |= 2048, va(
        9,
        hi(),
        Yo.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), zt === null) throw Error(o(349));
      i || (xl & 124) !== 0 || Lo(a, t, l);
    }
    return l;
  }
  function Lo(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ft.updateQueue, t === null ? (t = Ic(), ft.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
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
      return !xs(e, l);
    } catch {
      return !0;
    }
  }
  function Qo(e) {
    var t = ra(e, 2);
    t !== null && ys(t, e, 2);
  }
  function sr(e) {
    var t = os();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Jl) {
        He(!0);
        try {
          l();
        } finally {
          He(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Is,
      lastRenderedState: e
    }, t;
  }
  function Zo(e, t, l, a) {
    return e.baseState = l, er(
      e,
      Ct,
      typeof a == "function" ? a : Is
    );
  }
  function rx(e, t, l, a, n) {
    if (mi(e)) throw Error(o(485));
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
        lr(e, t, z);
      } finally {
        y.T = i;
      }
    } else
      try {
        i = l(n, a), Jo(e, t, i);
      } catch (z) {
        lr(e, t, z);
      }
  }
  function Jo(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Ko(e, t, a);
      },
      function(a) {
        return lr(e, t, a);
      }
    ) : Ko(e, t, l);
  }
  function Ko(e, t, l) {
    t.status = "fulfilled", t.value = l, $o(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Vo(e, l)));
  }
  function lr(e, t, l) {
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
      var l = zt.formState;
      if (l !== null) {
        e: {
          var a = ft;
          if (yt) {
            if (Ht) {
              t: {
                for (var n = Ht, i = Hs; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Us(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Ht = Us(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Xl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = os(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Wo,
      lastRenderedState: t
    }, l.queue = a, l = jd.bind(
      null,
      ft,
      a
    ), a.dispatch = l, a = sr(!1), i = rr.bind(
      null,
      ft,
      !1,
      a.queue
    ), a = os(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = rx.bind(
      null,
      ft,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Io(e) {
    var t = Jt();
    return Po(t, Ct, e);
  }
  function Po(e, t, l) {
    if (t = er(
      e,
      t,
      Wo
    )[0], e = di(Is)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = cn(t);
      } catch (c) {
        throw c === en ? ni : c;
      }
    else a = t;
    t = Jt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ft.flags |= 2048, va(
      9,
      hi(),
      ux.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function ux(e, t) {
    e.action = t;
  }
  function ed(e) {
    var t = Jt(), l = Ct;
    if (l !== null)
      return Po(t, l, e);
    Jt(), t = t.memoizedState, l = Jt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function va(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ft.updateQueue, t === null && (t = Ic(), ft.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function hi() {
    return { destroy: void 0, resource: void 0 };
  }
  function td() {
    return Jt().memoizedState;
  }
  function fi(e, t, l, a) {
    var n = os();
    a = a === void 0 ? null : a, ft.flags |= e, n.memoizedState = va(
      1 | t,
      hi(),
      l,
      a
    );
  }
  function rn(e, t, l, a) {
    var n = Jt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    Ct !== null && a !== null && Jc(a, Ct.memoizedState.deps) ? n.memoizedState = va(t, i, l, a) : (ft.flags |= e, n.memoizedState = va(
      1 | t,
      i,
      l,
      a
    ));
  }
  function sd(e, t) {
    fi(8390656, 8, e, t);
  }
  function ld(e, t) {
    rn(2048, 8, e, t);
  }
  function ad(e, t) {
    return rn(4, 2, e, t);
  }
  function nd(e, t) {
    return rn(4, 4, e, t);
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
    l = l != null ? l.concat([e]) : null, rn(4, 4, id.bind(null, t, e), l);
  }
  function ar() {
  }
  function rd(e, t) {
    var l = Jt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Jc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function ud(e, t) {
    var l = Jt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Jc(t, a[1]))
      return a[0];
    if (a = e(), Jl) {
      He(!0);
      try {
        e();
      } finally {
        He(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function nr(e, t, l) {
    return l === void 0 || (xl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = hh(), ft.lanes |= e, _l |= e, l);
  }
  function od(e, t, l, a) {
    return xs(l, t) ? l : ma.current !== null ? (e = nr(e, l, a), xs(e, t) || (Pt = !0), e) : (xl & 42) === 0 ? (Pt = !0, e.memoizedState = l) : (e = hh(), ft.lanes |= e, _l |= e, t);
  }
  function dd(e, t, l, a, n) {
    var i = Q.p;
    Q.p = i !== 0 && 8 > i ? i : 8;
    var c = y.T, d = {};
    y.T = d, rr(e, !1, t, l);
    try {
      var p = n(), z = y.S;
      if (z !== null && z(d, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var J = nx(
          p,
          a
        );
        un(
          e,
          t,
          J,
          bs(e)
        );
      } else
        un(
          e,
          t,
          a,
          bs(e)
        );
    } catch (ee) {
      un(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: ee },
        bs()
      );
    } finally {
      Q.p = i, y.T = c;
    }
  }
  function ox() {
  }
  function ir(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = hd(e).queue;
    dd(
      e,
      n,
      t,
      le,
      l === null ? ox : function() {
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
        lastRenderedReducer: Is,
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
        lastRenderedReducer: Is,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function fd(e) {
    var t = hd(e).next.queue;
    un(e, t, {}, bs());
  }
  function cr() {
    return ns(Cn);
  }
  function md() {
    return Jt().memoizedState;
  }
  function xd() {
    return Jt().memoizedState;
  }
  function dx(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = bs();
          e = fl(l);
          var a = ml(t, e, l);
          a !== null && (ys(a, t, l), sn(a, t, l)), t = { cache: qc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function hx(e, t, l) {
    var a = bs();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, mi(e) ? vd(t, l) : (l = Cc(e, t, l, a), l !== null && (ys(l, e, a), pd(l, t, a)));
  }
  function jd(e, t, l) {
    var a = bs();
    un(e, t, l, a);
  }
  function un(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (mi(e)) vd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, d = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, xs(d, c))
            return Fn(e, t, n, 0), zt === null && Wn(), !1;
        } catch {
        } finally {
        }
      if (l = Cc(e, t, n, a), l !== null)
        return ys(l, e, a), pd(l, t, a), !0;
    }
    return !1;
  }
  function rr(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Lr(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, mi(e)) {
      if (t) throw Error(o(479));
    } else
      t = Cc(
        e,
        l,
        a,
        2
      ), t !== null && ys(t, e, 2);
  }
  function mi(e) {
    var t = e.alternate;
    return e === ft || t !== null && t === ft;
  }
  function vd(e, t) {
    xa = ri = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function pd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  var xi = {
    readContext: ns,
    use: oi,
    useCallback: Gt,
    useContext: Gt,
    useEffect: Gt,
    useImperativeHandle: Gt,
    useLayoutEffect: Gt,
    useInsertionEffect: Gt,
    useMemo: Gt,
    useReducer: Gt,
    useRef: Gt,
    useState: Gt,
    useDebugValue: Gt,
    useDeferredValue: Gt,
    useTransition: Gt,
    useSyncExternalStore: Gt,
    useId: Gt,
    useHostTransitionStatus: Gt,
    useFormState: Gt,
    useActionState: Gt,
    useOptimistic: Gt,
    useMemoCache: Gt,
    useCacheRefresh: Gt
  }, gd = {
    readContext: ns,
    use: oi,
    useCallback: function(e, t) {
      return os().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ns,
    useEffect: sd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, fi(
        4194308,
        4,
        id.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return fi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      fi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = os();
      t = t === void 0 ? null : t;
      var a = e();
      if (Jl) {
        He(!0);
        try {
          e();
        } finally {
          He(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = os();
      if (l !== void 0) {
        var n = l(t);
        if (Jl) {
          He(!0);
          try {
            l(t);
          } finally {
            He(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = hx.bind(
        null,
        ft,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = os();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = sr(e);
      var t = e.queue, l = jd.bind(null, ft, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: ar,
    useDeferredValue: function(e, t) {
      var l = os();
      return nr(l, e, t);
    },
    useTransition: function() {
      var e = sr(!1);
      return e = dd.bind(
        null,
        ft,
        e.queue,
        !0,
        !1
      ), os().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ft, n = os();
      if (yt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), zt === null)
          throw Error(o(349));
        (vt & 124) !== 0 || Lo(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, sd(Go.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, va(
        9,
        hi(),
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
      var e = os(), t = zt.identifierPrefix;
      if (yt) {
        var l = $s, a = Ks;
        l = (a & ~(1 << 32 - at(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = ui++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = ix++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: cr,
    useFormState: Fo,
    useActionState: Fo,
    useOptimistic: function(e) {
      var t = os();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = rr.bind(
        null,
        ft,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Pc,
    useCacheRefresh: function() {
      return os().memoizedState = dx.bind(
        null,
        ft
      );
    }
  }, bd = {
    readContext: ns,
    use: oi,
    useCallback: rd,
    useContext: ns,
    useEffect: ld,
    useImperativeHandle: cd,
    useInsertionEffect: ad,
    useLayoutEffect: nd,
    useMemo: ud,
    useReducer: di,
    useRef: td,
    useState: function() {
      return di(Is);
    },
    useDebugValue: ar,
    useDeferredValue: function(e, t) {
      var l = Jt();
      return od(
        l,
        Ct.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = di(Is)[0], t = Jt().memoizedState;
      return [
        typeof e == "boolean" ? e : cn(e),
        t
      ];
    },
    useSyncExternalStore: Bo,
    useId: md,
    useHostTransitionStatus: cr,
    useFormState: Io,
    useActionState: Io,
    useOptimistic: function(e, t) {
      var l = Jt();
      return Zo(l, Ct, e, t);
    },
    useMemoCache: Pc,
    useCacheRefresh: xd
  }, fx = {
    readContext: ns,
    use: oi,
    useCallback: rd,
    useContext: ns,
    useEffect: ld,
    useImperativeHandle: cd,
    useInsertionEffect: ad,
    useLayoutEffect: nd,
    useMemo: ud,
    useReducer: tr,
    useRef: td,
    useState: function() {
      return tr(Is);
    },
    useDebugValue: ar,
    useDeferredValue: function(e, t) {
      var l = Jt();
      return Ct === null ? nr(l, e, t) : od(
        l,
        Ct.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = tr(Is)[0], t = Jt().memoizedState;
      return [
        typeof e == "boolean" ? e : cn(e),
        t
      ];
    },
    useSyncExternalStore: Bo,
    useId: md,
    useHostTransitionStatus: cr,
    useFormState: ed,
    useActionState: ed,
    useOptimistic: function(e, t) {
      var l = Jt();
      return Ct !== null ? Zo(l, Ct, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Pc,
    useCacheRefresh: xd
  }, pa = null, on = 0;
  function ji(e) {
    var t = on;
    return on += 1, pa === null && (pa = []), zo(pa, e, t);
  }
  function dn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function vi(e, t) {
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
        var O = C.deletions;
        O === null ? (C.deletions = [S], C.flags |= 16) : O.push(S);
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
      return C = Js(C, S), C.index = 0, C.sibling = null, C;
    }
    function i(C, S, O) {
      return C.index = O, e ? (O = C.alternate, O !== null ? (O = O.index, O < S ? (C.flags |= 67108866, S) : O) : (C.flags |= 67108866, S)) : (C.flags |= 1048576, S);
    }
    function c(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function d(C, S, O, W) {
      return S === null || S.tag !== 6 ? (S = Oc(O, C.mode, W), S.return = C, S) : (S = n(S, O), S.return = C, S);
    }
    function p(C, S, O, W) {
      var Ue = O.type;
      return Ue === fe ? J(
        C,
        S,
        O.props.children,
        W,
        O.key
      ) : S !== null && (S.elementType === Ue || typeof Ue == "object" && Ue !== null && Ue.$$typeof === Re && yd(Ue) === S.type) ? (S = n(S, O.props), dn(S, O), S.return = C, S) : (S = Pn(
        O.type,
        O.key,
        O.props,
        null,
        C.mode,
        W
      ), dn(S, O), S.return = C, S);
    }
    function z(C, S, O, W) {
      return S === null || S.tag !== 4 || S.stateNode.containerInfo !== O.containerInfo || S.stateNode.implementation !== O.implementation ? (S = Tc(O, C.mode, W), S.return = C, S) : (S = n(S, O.children || []), S.return = C, S);
    }
    function J(C, S, O, W, Ue) {
      return S === null || S.tag !== 7 ? (S = Bl(
        O,
        C.mode,
        W,
        Ue
      ), S.return = C, S) : (S = n(S, O), S.return = C, S);
    }
    function ee(C, S, O) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return S = Oc(
          "" + S,
          C.mode,
          O
        ), S.return = C, S;
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case k:
            return O = Pn(
              S.type,
              S.key,
              S.props,
              null,
              C.mode,
              O
            ), dn(O, S), O.return = C, O;
          case se:
            return S = Tc(
              S,
              C.mode,
              O
            ), S.return = C, S;
          case Re:
            var W = S._init;
            return S = W(S._payload), ee(C, S, O);
        }
        if (de(S) || je(S))
          return S = Bl(
            S,
            C.mode,
            O,
            null
          ), S.return = C, S;
        if (typeof S.then == "function")
          return ee(C, ji(S), O);
        if (S.$$typeof === F)
          return ee(
            C,
            li(C, S),
            O
          );
        vi(C, S);
      }
      return null;
    }
    function R(C, S, O, W) {
      var Ue = S !== null ? S.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return Ue !== null ? null : d(C, S, "" + O, W);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            return O.key === Ue ? p(C, S, O, W) : null;
          case se:
            return O.key === Ue ? z(C, S, O, W) : null;
          case Re:
            return Ue = O._init, O = Ue(O._payload), R(C, S, O, W);
        }
        if (de(O) || je(O))
          return Ue !== null ? null : J(C, S, O, W, null);
        if (typeof O.then == "function")
          return R(
            C,
            S,
            ji(O),
            W
          );
        if (O.$$typeof === F)
          return R(
            C,
            S,
            li(C, O),
            W
          );
        vi(C, O);
      }
      return null;
    }
    function q(C, S, O, W, Ue) {
      if (typeof W == "string" && W !== "" || typeof W == "number" || typeof W == "bigint")
        return C = C.get(O) || null, d(S, C, "" + W, Ue);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case k:
            return C = C.get(
              W.key === null ? O : W.key
            ) || null, p(S, C, W, Ue);
          case se:
            return C = C.get(
              W.key === null ? O : W.key
            ) || null, z(S, C, W, Ue);
          case Re:
            var mt = W._init;
            return W = mt(W._payload), q(
              C,
              S,
              O,
              W,
              Ue
            );
        }
        if (de(W) || je(W))
          return C = C.get(O) || null, J(S, C, W, Ue, null);
        if (typeof W.then == "function")
          return q(
            C,
            S,
            O,
            ji(W),
            Ue
          );
        if (W.$$typeof === F)
          return q(
            C,
            S,
            O,
            li(S, W),
            Ue
          );
        vi(S, W);
      }
      return null;
    }
    function Ie(C, S, O, W) {
      for (var Ue = null, mt = null, Ge = S, Fe = S = 0, ts = null; Ge !== null && Fe < O.length; Fe++) {
        Ge.index > Fe ? (ts = Ge, Ge = null) : ts = Ge.sibling;
        var gt = R(
          C,
          Ge,
          O[Fe],
          W
        );
        if (gt === null) {
          Ge === null && (Ge = ts);
          break;
        }
        e && Ge && gt.alternate === null && t(C, Ge), S = i(gt, S, Fe), mt === null ? Ue = gt : mt.sibling = gt, mt = gt, Ge = ts;
      }
      if (Fe === O.length)
        return l(C, Ge), yt && Yl(C, Fe), Ue;
      if (Ge === null) {
        for (; Fe < O.length; Fe++)
          Ge = ee(C, O[Fe], W), Ge !== null && (S = i(
            Ge,
            S,
            Fe
          ), mt === null ? Ue = Ge : mt.sibling = Ge, mt = Ge);
        return yt && Yl(C, Fe), Ue;
      }
      for (Ge = a(Ge); Fe < O.length; Fe++)
        ts = q(
          Ge,
          C,
          Fe,
          O[Fe],
          W
        ), ts !== null && (e && ts.alternate !== null && Ge.delete(
          ts.key === null ? Fe : ts.key
        ), S = i(
          ts,
          S,
          Fe
        ), mt === null ? Ue = ts : mt.sibling = ts, mt = ts);
      return e && Ge.forEach(function(zl) {
        return t(C, zl);
      }), yt && Yl(C, Fe), Ue;
    }
    function $e(C, S, O, W) {
      if (O == null) throw Error(o(151));
      for (var Ue = null, mt = null, Ge = S, Fe = S = 0, ts = null, gt = O.next(); Ge !== null && !gt.done; Fe++, gt = O.next()) {
        Ge.index > Fe ? (ts = Ge, Ge = null) : ts = Ge.sibling;
        var zl = R(C, Ge, gt.value, W);
        if (zl === null) {
          Ge === null && (Ge = ts);
          break;
        }
        e && Ge && zl.alternate === null && t(C, Ge), S = i(zl, S, Fe), mt === null ? Ue = zl : mt.sibling = zl, mt = zl, Ge = ts;
      }
      if (gt.done)
        return l(C, Ge), yt && Yl(C, Fe), Ue;
      if (Ge === null) {
        for (; !gt.done; Fe++, gt = O.next())
          gt = ee(C, gt.value, W), gt !== null && (S = i(gt, S, Fe), mt === null ? Ue = gt : mt.sibling = gt, mt = gt);
        return yt && Yl(C, Fe), Ue;
      }
      for (Ge = a(Ge); !gt.done; Fe++, gt = O.next())
        gt = q(Ge, C, Fe, gt.value, W), gt !== null && (e && gt.alternate !== null && Ge.delete(gt.key === null ? Fe : gt.key), S = i(gt, S, Fe), mt === null ? Ue = gt : mt.sibling = gt, mt = gt);
      return e && Ge.forEach(function(mj) {
        return t(C, mj);
      }), yt && Yl(C, Fe), Ue;
    }
    function Ot(C, S, O, W) {
      if (typeof O == "object" && O !== null && O.type === fe && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            e: {
              for (var Ue = O.key; S !== null; ) {
                if (S.key === Ue) {
                  if (Ue = O.type, Ue === fe) {
                    if (S.tag === 7) {
                      l(
                        C,
                        S.sibling
                      ), W = n(
                        S,
                        O.props.children
                      ), W.return = C, C = W;
                      break e;
                    }
                  } else if (S.elementType === Ue || typeof Ue == "object" && Ue !== null && Ue.$$typeof === Re && yd(Ue) === S.type) {
                    l(
                      C,
                      S.sibling
                    ), W = n(S, O.props), dn(W, O), W.return = C, C = W;
                    break e;
                  }
                  l(C, S);
                  break;
                } else t(C, S);
                S = S.sibling;
              }
              O.type === fe ? (W = Bl(
                O.props.children,
                C.mode,
                W,
                O.key
              ), W.return = C, C = W) : (W = Pn(
                O.type,
                O.key,
                O.props,
                null,
                C.mode,
                W
              ), dn(W, O), W.return = C, C = W);
            }
            return c(C);
          case se:
            e: {
              for (Ue = O.key; S !== null; ) {
                if (S.key === Ue)
                  if (S.tag === 4 && S.stateNode.containerInfo === O.containerInfo && S.stateNode.implementation === O.implementation) {
                    l(
                      C,
                      S.sibling
                    ), W = n(S, O.children || []), W.return = C, C = W;
                    break e;
                  } else {
                    l(C, S);
                    break;
                  }
                else t(C, S);
                S = S.sibling;
              }
              W = Tc(O, C.mode, W), W.return = C, C = W;
            }
            return c(C);
          case Re:
            return Ue = O._init, O = Ue(O._payload), Ot(
              C,
              S,
              O,
              W
            );
        }
        if (de(O))
          return Ie(
            C,
            S,
            O,
            W
          );
        if (je(O)) {
          if (Ue = je(O), typeof Ue != "function") throw Error(o(150));
          return O = Ue.call(O), $e(
            C,
            S,
            O,
            W
          );
        }
        if (typeof O.then == "function")
          return Ot(
            C,
            S,
            ji(O),
            W
          );
        if (O.$$typeof === F)
          return Ot(
            C,
            S,
            li(C, O),
            W
          );
        vi(C, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, S !== null && S.tag === 6 ? (l(C, S.sibling), W = n(S, O), W.return = C, C = W) : (l(C, S), W = Oc(O, C.mode, W), W.return = C, C = W), c(C)) : l(C, S);
    }
    return function(C, S, O, W) {
      try {
        on = 0;
        var Ue = Ot(
          C,
          S,
          O,
          W
        );
        return pa = null, Ue;
      } catch (Ge) {
        if (Ge === en || Ge === ni) throw Ge;
        var mt = js(29, Ge, null, C.mode);
        return mt.lanes = W, mt.return = C, mt;
      } finally {
      }
    };
  }
  var ga = _d(!0), Nd = _d(!1), Os = B(null), Bs = null;
  function jl(e) {
    var t = e.alternate;
    te(Ft, Ft.current & 1), te(Os, e), Bs === null && (t === null || ma.current !== null || t.memoizedState !== null) && (Bs = e);
  }
  function Sd(e) {
    if (e.tag === 22) {
      if (te(Ft, Ft.current), te(Os, e), Bs === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Bs = e);
      }
    } else vl();
  }
  function vl() {
    te(Ft, Ft.current), te(Os, Os.current);
  }
  function Ps(e) {
    P(Os), Bs === e && (Bs = null), P(Ft);
  }
  var Ft = B(0);
  function pi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Ir(l)))
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
  function ur(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : M({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var or = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = bs(), n = fl(a);
      n.payload = t, l != null && (n.callback = l), t = ml(e, n, a), t !== null && (ys(t, e, a), sn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = bs(), n = fl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = ml(e, n, a), t !== null && (ys(t, e, a), sn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = bs(), a = fl(l);
      a.tag = 2, t != null && (a.callback = t), t = ml(e, a, l), t !== null && (ys(t, e, l), sn(t, e, l));
    }
  };
  function wd(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !Va(l, a) || !Va(n, i) : !0;
  }
  function kd(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && or.enqueueReplaceState(t, t.state, null);
  }
  function Kl(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = M({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var gi = typeof reportError == "function" ? reportError : function(e) {
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
    gi(e);
  }
  function Ed(e) {
    console.error(e);
  }
  function Od(e) {
    gi(e);
  }
  function bi(e, t) {
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
  function dr(e, t, l) {
    return l = fl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      bi(e, t);
    }, l;
  }
  function zd(e) {
    return e = fl(e), e.tag = 3, e;
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
      Td(t, l, a), typeof n != "function" && (Nl === null ? Nl = /* @__PURE__ */ new Set([this]) : Nl.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function mx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Fa(
        t,
        l,
        n,
        !0
      ), l = Os.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Bs === null ? Ur() : l.alternate === null && Bt === 0 && (Bt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Lc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), qr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Lc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), qr(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return qr(e, a, n), Ur(), !1;
    }
    if (yt)
      return t = Os.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Rc && (e = Error(o(422), { cause: a }), Wa(ws(e, l)))) : (a !== Rc && (t = Error(o(423), {
        cause: a
      }), Wa(
        ws(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = ws(a, l), n = dr(
        e.stateNode,
        a,
        n
      ), Xc(e, n), Bt !== 4 && (Bt = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = ws(i, l), pn === null ? pn = [i] : pn.push(i), Bt !== 4 && (Bt = 2), t === null) return !0;
    a = ws(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = dr(l.stateNode, a, e), Xc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (Nl === null || !Nl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = zd(n), Ad(
              n,
              e,
              l,
              a
            ), Xc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Rd = Error(o(461)), Pt = !1;
  function ss(e, t, l, a) {
    t.child = e === null ? Nd(t, null, l, a) : ga(
      t,
      e.child,
      l,
      a
    );
  }
  function Dd(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var d in a)
        d !== "ref" && (c[d] = a[d]);
    } else c = a;
    return Zl(t), a = Kc(
      e,
      t,
      l,
      c,
      i,
      n
    ), d = $c(), e !== null && !Pt ? (Wc(e, t, n), el(e, t, n)) : (yt && d && zc(t), t.flags |= 1, ss(e, t, a, n), t.child);
  }
  function Ud(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !Ec(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Md(
        e,
        t,
        i,
        a,
        n
      )) : (e = Pn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !gr(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Va, l(c, a) && e.ref === t.ref)
        return el(e, t, n);
    }
    return t.flags |= 1, e = Js(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Md(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Va(i, a) && e.ref === t.ref)
        if (Pt = !1, t.pendingProps = a = i, gr(e, n))
          (e.flags & 131072) !== 0 && (Pt = !0);
        else
          return t.lanes = e.lanes, el(e, t, n);
    }
    return hr(
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
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ai(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Mo(t, i) : Zc(), Sd(t);
      else
        return t.lanes = t.childLanes = 536870912, Hd(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ai(t, i.cachePool), Mo(t, i), vl(), t.memoizedState = null) : (e !== null && ai(t, null), Zc(), vl());
    return ss(e, t, n, l), t.child;
  }
  function Hd(e, t, l, a) {
    var n = Bc();
    return n = n === null ? null : { parent: Wt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && ai(t, null), Zc(), Sd(t), e !== null && Fa(e, t, a, !0), null;
  }
  function yi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function hr(e, t, l, a, n) {
    return Zl(t), l = Kc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = $c(), e !== null && !Pt ? (Wc(e, t, n), el(e, t, n)) : (yt && a && zc(t), t.flags |= 1, ss(e, t, l, n), t.child);
  }
  function Bd(e, t, l, a, n, i) {
    return Zl(t), t.updateQueue = null, l = Ho(
      t,
      a,
      l,
      n
    ), qo(e), a = $c(), e !== null && !Pt ? (Wc(e, t, i), el(e, t, i)) : (yt && a && zc(t), t.flags |= 1, ss(e, t, l, i), t.child);
  }
  function Ld(e, t, l, a, n) {
    if (Zl(t), t.stateNode === null) {
      var i = ua, c = l.contextType;
      typeof c == "object" && c !== null && (i = ns(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = or, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Yc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? ns(c) : ua, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (ur(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && or.enqueueReplaceState(i, i.state, null), an(t, a, i, n), ln(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, p = Kl(l, d);
      i.props = p;
      var z = i.context, J = l.contextType;
      c = ua, typeof J == "object" && J !== null && (c = ns(J));
      var ee = l.getDerivedStateFromProps;
      J = typeof ee == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || z !== c) && kd(
        t,
        i,
        a,
        c
      ), hl = !1;
      var R = t.memoizedState;
      i.state = R, an(t, a, i, n), ln(), z = t.memoizedState, d || R !== z || hl ? (typeof ee == "function" && (ur(
        t,
        l,
        ee,
        a
      ), z = t.memoizedState), (p = hl || wd(
        t,
        l,
        p,
        a,
        R,
        z,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = c, a = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Gc(e, t), c = t.memoizedProps, J = Kl(l, c), i.props = J, ee = t.pendingProps, R = i.context, z = l.contextType, p = ua, typeof z == "object" && z !== null && (p = ns(z)), d = l.getDerivedStateFromProps, (z = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== ee || R !== p) && kd(
        t,
        i,
        a,
        p
      ), hl = !1, R = t.memoizedState, i.state = R, an(t, a, i, n), ln();
      var q = t.memoizedState;
      c !== ee || R !== q || hl || e !== null && e.dependencies !== null && si(e.dependencies) ? (typeof d == "function" && (ur(
        t,
        l,
        d,
        a
      ), q = t.memoizedState), (J = hl || wd(
        t,
        l,
        J,
        a,
        R,
        q,
        p
      ) || e !== null && e.dependencies !== null && si(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, q, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        q,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = q), i.props = a, i.state = q, i.context = p, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, yi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ga(
      t,
      e.child,
      null,
      n
    ), t.child = ga(
      t,
      null,
      l,
      n
    )) : ss(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = el(
      e,
      t,
      n
    ), e;
  }
  function Yd(e, t, l, a) {
    return $a(), t.flags |= 256, ss(e, t, l, a), t.child;
  }
  var fr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mr(e) {
    return { baseLanes: e, cachePool: Eo() };
  }
  function xr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Ts), e;
  }
  function Gd(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Ft.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (yt) {
        if (n ? jl(t) : vl(), yt) {
          var d = Ht, p;
          if (p = d) {
            e: {
              for (p = d, d = Hs; p.nodeType !== 8; ) {
                if (!d) {
                  d = null;
                  break e;
                }
                if (p = Us(
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
              treeContext: Ll !== null ? { id: Ks, overflow: $s } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = js(
              18,
              null,
              null,
              0
            ), p.stateNode = d, p.return = t, t.child = p, cs = t, Ht = null, p = !0) : p = !1;
          }
          p || Xl(t);
        }
        if (d = t.memoizedState, d !== null && (d = d.dehydrated, d !== null))
          return Ir(d) ? t.lanes = 32 : t.lanes = 536870912, null;
        Ps(t);
      }
      return d = a.children, a = a.fallback, n ? (vl(), n = t.mode, d = _i(
        { mode: "hidden", children: d },
        n
      ), a = Bl(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, n = t.child, n.memoizedState = mr(l), n.childLanes = xr(
        e,
        c,
        l
      ), t.memoizedState = fr, a) : (jl(t), jr(t, d));
    }
    if (p = e.memoizedState, p !== null && (d = p.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (jl(t), t.flags &= -257, t = vr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (vl(), t.child = e.child, t.flags |= 128, t = null) : (vl(), n = a.fallback, d = t.mode, a = _i(
          { mode: "visible", children: a.children },
          d
        ), n = Bl(
          n,
          d,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, ga(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = mr(l), a.childLanes = xr(
          e,
          c,
          l
        ), t.memoizedState = fr, t = n);
      else if (jl(t), Ir(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var z = c.dgst;
        c = z, a = Error(o(419)), a.stack = "", a.digest = c, Wa({ value: a, source: null, stack: null }), t = vr(
          e,
          t,
          l
        );
      } else if (Pt || Fa(e, t, l, !1), c = (l & e.childLanes) !== 0, Pt || c) {
        if (c = zt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : me(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== p.retryLane))
          throw p.retryLane = a, ra(e, a), ys(c, e, a), Rd;
        d.data === "$?" || Ur(), t = vr(
          e,
          t,
          l
        );
      } else
        d.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Ht = Us(
          d.nextSibling
        ), cs = t, yt = !0, Gl = null, Hs = !1, e !== null && (Cs[Es++] = Ks, Cs[Es++] = $s, Cs[Es++] = Ll, Ks = e.id, $s = e.overflow, Ll = t), t = jr(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (vl(), n = a.fallback, d = t.mode, p = e.child, z = p.sibling, a = Js(p, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = p.subtreeFlags & 65011712, z !== null ? n = Js(z, n) : (n = Bl(
      n,
      d,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, d = e.child.memoizedState, d === null ? d = mr(l) : (p = d.cachePool, p !== null ? (z = Wt._currentValue, p = p.parent !== z ? { parent: z, pool: z } : p) : p = Eo(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: p
    }), n.memoizedState = d, n.childLanes = xr(
      e,
      c,
      l
    ), t.memoizedState = fr, a) : (jl(t), l = e.child, e = l.sibling, l = Js(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function jr(e, t) {
    return t = _i(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function _i(e, t) {
    return e = js(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function vr(e, t, l) {
    return ga(t, e.child, null, l), e = jr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Xd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Uc(e.return, t, l);
  }
  function pr(e, t, l, a, n) {
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
    if (ss(e, t, a.children, l), a = Ft.current, (a & 2) !== 0)
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
    switch (te(Ft, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && pi(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), pr(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && pi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        pr(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        pr(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function el(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), _l |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Fa(
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
      for (e = t.child, l = Js(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Js(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function gr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && si(e)));
  }
  function xx(e, t, l) {
    switch (t.tag) {
      case 3:
        ce(t, t.stateNode.containerInfo), dl(t, Wt, e.memoizedState.cache), $a();
        break;
      case 27:
      case 5:
        ct(t);
        break;
      case 4:
        ce(t, t.stateNode.containerInfo);
        break;
      case 10:
        dl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (jl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Gd(e, t, l) : (jl(t), e = el(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        jl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Fa(
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
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), te(Ft, Ft.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, qd(e, t, l);
      case 24:
        dl(t, Wt, e.memoizedState.cache);
    }
    return el(e, t, l);
  }
  function Zd(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Pt = !0;
      else {
        if (!gr(e, l) && (t.flags & 128) === 0)
          return Pt = !1, xx(
            e,
            t,
            l
          );
        Pt = (e.flags & 131072) !== 0;
      }
    else
      Pt = !1, yt && (t.flags & 1048576) !== 0 && yo(t, ti, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            Ec(a) ? (e = Kl(a, e), t.tag = 1, t = Ld(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = hr(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === oe) {
                t.tag = 11, t = Dd(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === xe) {
                t.tag = 14, t = Ud(
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
        return hr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = Kl(
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
          if (ce(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Gc(e, t), an(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, dl(t, Wt, a), a !== i.cache && Mc(
            t,
            [Wt],
            l,
            !0
          ), ln(), a = c.element, i.isDehydrated)
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
              n = ws(
                Error(o(424)),
                t
              ), Wa(n), t = Yd(
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
              for (Ht = Us(e.firstChild), cs = t, yt = !0, Gl = null, Hs = !0, l = Nd(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if ($a(), a === n) {
              t = el(
                e,
                t,
                l
              );
              break e;
            }
            ss(
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
        return yi(e, t), e === null ? (l = $h(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : yt || (l = t.type, e = t.pendingProps, a = Mi(
          $.current
        ).createElement(l), a[ut] = t, a[Nt] = e, as(a, l, e), At(a), t.stateNode = a) : t.memoizedState = $h(
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
        ), cs = t, Hs = !0, n = Ht, kl(t.type) ? (Pr = n, Ht = Us(
          a.firstChild
        )) : Ht = n), ss(
          e,
          t,
          t.pendingProps.children,
          l
        ), yi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && yt && ((n = a = Ht) && (a = Xx(
          a,
          t.type,
          t.pendingProps,
          Hs
        ), a !== null ? (t.stateNode = a, cs = t, Ht = Us(
          a.firstChild
        ), Hs = !1, n = !0) : n = !1), n || Xl(t)), ct(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, $r(n, i) ? a = null : c !== null && $r(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Kc(
          e,
          t,
          cx,
          null,
          null,
          l
        ), Cn._currentValue = n), yi(e, t), ss(e, t, a, l), t.child;
      case 6:
        return e === null && yt && ((e = l = Ht) && (l = Qx(
          l,
          t.pendingProps,
          Hs
        ), l !== null ? (t.stateNode = l, cs = t, Ht = null, e = !0) : e = !1), e || Xl(t)), null;
      case 13:
        return Gd(e, t, l);
      case 4:
        return ce(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ga(
          t,
          null,
          a,
          l
        ) : ss(
          e,
          t,
          a,
          l
        ), t.child;
      case 11:
        return Dd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return ss(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return ss(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return ss(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, dl(t, t.type, a.value), ss(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Zl(t), n = ns(n), a = a(n), t.flags |= 1, ss(e, t, a, l), t.child;
      case 14:
        return Ud(
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
        }, e === null ? (l = _i(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Js(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return qd(e, t, l);
      case 24:
        return Zl(t), a = ns(Wt), e === null ? (n = Bc(), n === null && (n = zt, i = qc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Yc(t), dl(t, Wt, n)) : ((e.lanes & l) !== 0 && (Gc(e, t), an(t, null, null, l), ln()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), dl(t, Wt, a)) : (a = i.cache, dl(t, Wt, a), a !== n.cache && Mc(
          t,
          [Wt],
          l,
          !0
        ))), ss(
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
  function tl(e) {
    e.flags |= 4;
  }
  function Vd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ef(t)) {
      if (t = Os.current, t !== null && ((vt & 4194048) === vt ? Bs !== null : (vt & 62914560) !== vt && (vt & 536870912) === 0 || t !== Bs))
        throw tn = Lc, Oo;
      e.flags |= 8192;
    }
  }
  function Ni(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? D() : 536870912, e.lanes |= t, Na |= t);
  }
  function hn(e, t) {
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
  function Ut(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function jx(e, t, l) {
    var a = t.pendingProps;
    switch (Ac(t), t.tag) {
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
        return Ut(t), null;
      case 1:
        return Ut(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Fs(Wt), Ee(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ka(t) ? tl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, So())), Ut(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (tl(t), l !== null ? (Ut(t), Vd(t, l)) : (Ut(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (tl(t), Ut(t), Vd(t, l)) : (Ut(t), t.flags &= -16777217) : (e.memoizedProps !== a && tl(t), Ut(t), t.flags &= -16777217), null;
      case 27:
        lt(t), l = $.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && tl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ut(t), null;
          }
          e = re.current, Ka(t) ? _o(t) : (e = Vh(n, a, l), t.stateNode = e, tl(t));
        }
        return Ut(t), null;
      case 5:
        if (lt(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && tl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ut(t), null;
          }
          if (e = re.current, Ka(t))
            _o(t);
          else {
            switch (n = Mi(
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
            e[ut] = t, e[Nt] = a;
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
            e: switch (as(e, l, a), l) {
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
            e && tl(t);
          }
        }
        return Ut(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && tl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = $.current, Ka(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = cs, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[ut] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Bh(e.nodeValue, l)), e || Xl(t);
          } else
            e = Mi(e).createTextNode(
              a
            ), e[ut] = t, t.stateNode = e;
        }
        return Ut(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ka(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[ut] = t;
            } else
              $a(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ut(t), n = !1;
          } else
            n = So(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Ps(t), t) : (Ps(t), null);
        }
        if (Ps(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), Ni(t, t.updateQueue), Ut(t), null;
      case 4:
        return Ee(), e === null && Qr(t.stateNode.containerInfo), Ut(t), null;
      case 10:
        return Fs(t.type), Ut(t), null;
      case 19:
        if (P(Ft), n = t.memoizedState, n === null) return Ut(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) hn(n, !1);
          else {
            if (Bt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = pi(e), i !== null) {
                  for (t.flags |= 128, hn(n, !1), e = i.updateQueue, t.updateQueue = e, Ni(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    bo(l, e), l = l.sibling;
                  return te(
                    Ft,
                    Ft.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && qe() > ki && (t.flags |= 128, a = !0, hn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = pi(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Ni(t, e), hn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !yt)
                return Ut(t), null;
            } else
              2 * qe() - n.renderingStartTime > ki && l !== 536870912 && (t.flags |= 128, a = !0, hn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = qe(), t.sibling = null, e = Ft.current, te(Ft, a ? e & 1 | 2 : e & 1), t) : (Ut(t), null);
      case 22:
      case 23:
        return Ps(t), Vc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Ut(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ut(t), l = t.updateQueue, l !== null && Ni(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && P(Vl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Fs(Wt), Ut(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function vx(e, t) {
    switch (Ac(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fs(Wt), Ee(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return lt(t), null;
      case 13:
        if (Ps(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          $a();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return P(Ft), null;
      case 4:
        return Ee(), null;
      case 10:
        return Fs(t.type), null;
      case 22:
      case 23:
        return Ps(t), Vc(), e !== null && P(Vl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Fs(Wt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Jd(e, t) {
    switch (Ac(t), t.tag) {
      case 3:
        Fs(Wt), Ee();
        break;
      case 26:
      case 27:
      case 5:
        lt(t);
        break;
      case 4:
        Ee();
        break;
      case 13:
        Ps(t);
        break;
      case 19:
        P(Ft);
        break;
      case 10:
        Fs(t.type);
        break;
      case 22:
      case 23:
        Ps(t), Vc(), e !== null && P(Vl);
        break;
      case 24:
        Fs(Wt);
    }
  }
  function fn(e, t) {
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
  function pl(e, t, l) {
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
        Uo(t, l);
      } catch (a) {
        Tt(e, e.return, a);
      }
    }
  }
  function $d(e, t, l) {
    l.props = Kl(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Tt(e, t, a);
    }
  }
  function mn(e, t) {
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
  function Ls(e, t) {
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
  function br(e, t, l) {
    try {
      var a = e.stateNode;
      Hx(a, e.type, l, t), a[Nt] = t;
    } catch (n) {
      Tt(e, e.return, n);
    }
  }
  function Fd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && kl(e.type) || e.tag === 4;
  }
  function yr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Fd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && kl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function _r(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Ui));
    else if (a !== 4 && (a === 27 && kl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (_r(e, t, l), e = e.sibling; e !== null; )
        _r(e, t, l), e = e.sibling;
  }
  function Si(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && kl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Si(e, t, l), e = e.sibling; e !== null; )
        Si(e, t, l), e = e.sibling;
  }
  function Id(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      as(t, a, l), t[ut] = e, t[Nt] = l;
    } catch (i) {
      Tt(e, e.return, i);
    }
  }
  var sl = !1, Xt = !1, Nr = !1, Pd = typeof WeakSet == "function" ? WeakSet : Set, es = null;
  function px(e, t) {
    if (e = e.containerInfo, Jr = Gi, e = uo(e), yc(e)) {
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
    for (Kr = { focusedElem: e, selectionRange: l }, Gi = !1, es = t; es !== null; )
      if (t = es, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, es = e;
      else
        for (; es !== null; ) {
          switch (t = es, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var Ie = Kl(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    Ie,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch ($e) {
                  Tt(
                    l,
                    l.return,
                    $e
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Fr(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Fr(e);
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
            e.return = t.return, es = e;
            break;
          }
          es = t.return;
        }
  }
  function eh(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        gl(e, l), a & 4 && fn(5, l);
        break;
      case 1:
        if (gl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              Tt(l, l.return, c);
            }
          else {
            var n = Kl(
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
        a & 64 && Kd(l), a & 512 && mn(l, l.return);
        break;
      case 3:
        if (gl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            Uo(e, t);
          } catch (c) {
            Tt(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Id(l);
      case 26:
      case 5:
        gl(e, l), t === null && a & 4 && Wd(l), a & 512 && mn(l, l.return);
        break;
      case 12:
        gl(e, l);
        break;
      case 13:
        gl(e, l), a & 4 && lh(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Cx.bind(
          null,
          l
        ), Zx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || sl, !a) {
          t = t !== null && t.memoizedState !== null || Xt, n = sl;
          var i = Xt;
          sl = a, (Xt = t) && !i ? bl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : gl(e, l), sl = n, Xt = i;
        }
        break;
      case 30:
        break;
      default:
        gl(e, l);
    }
  }
  function th(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, th(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ze(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Dt = null, ds = !1;
  function ll(e, t, l) {
    for (l = l.child; l !== null; )
      sh(e, t, l), l = l.sibling;
  }
  function sh(e, t, l) {
    if (_e && typeof _e.onCommitFiberUnmount == "function")
      try {
        _e.onCommitFiberUnmount(I, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Xt || Ls(l, t), ll(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Xt || Ls(l, t);
        var a = Dt, n = ds;
        kl(l.type) && (Dt = l.stateNode, ds = !1), ll(
          e,
          t,
          l
        ), Nn(l.stateNode), Dt = a, ds = n;
        break;
      case 5:
        Xt || Ls(l, t);
      case 6:
        if (a = Dt, n = ds, Dt = null, ll(
          e,
          t,
          l
        ), Dt = a, ds = n, Dt !== null)
          if (ds)
            try {
              (Dt.nodeType === 9 ? Dt.body : Dt.nodeName === "HTML" ? Dt.ownerDocument.body : Dt).removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                t,
                i
              );
            }
          else
            try {
              Dt.removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Dt !== null && (ds ? (e = Dt, Qh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), zn(e)) : Qh(Dt, l.stateNode));
        break;
      case 4:
        a = Dt, n = ds, Dt = l.stateNode.containerInfo, ds = !0, ll(
          e,
          t,
          l
        ), Dt = a, ds = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Xt || pl(2, l, t), Xt || pl(4, l, t), ll(
          e,
          t,
          l
        );
        break;
      case 1:
        Xt || (Ls(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && $d(
          l,
          t,
          a
        )), ll(
          e,
          t,
          l
        );
        break;
      case 21:
        ll(
          e,
          t,
          l
        );
        break;
      case 22:
        Xt = (a = Xt) || l.memoizedState !== null, ll(
          e,
          t,
          l
        ), Xt = a;
        break;
      default:
        ll(
          e,
          t,
          l
        );
    }
  }
  function lh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        zn(e);
      } catch (l) {
        Tt(t, t.return, l);
      }
  }
  function gx(e) {
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
  function Sr(e, t) {
    var l = gx(e);
    t.forEach(function(a) {
      var n = Ex.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function vs(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (kl(d.type)) {
                Dt = d.stateNode, ds = !1;
                break e;
              }
              break;
            case 5:
              Dt = d.stateNode, ds = !1;
              break e;
            case 3:
            case 4:
              Dt = d.stateNode.containerInfo, ds = !0;
              break e;
          }
          d = d.return;
        }
        if (Dt === null) throw Error(o(160));
        sh(i, c, n), Dt = null, ds = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        ah(t, e), t = t.sibling;
  }
  var Ds = null;
  function ah(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        vs(t, e), ps(e), a & 4 && (pl(3, e, e.return), fn(3, e), pl(5, e, e.return));
        break;
      case 1:
        vs(t, e), ps(e), a & 512 && (Xt || l === null || Ls(l, l.return)), a & 64 && sl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Ds;
        if (vs(t, e), ps(e), a & 512 && (Xt || l === null || Ls(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[Te] || i[ut] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), as(i, a, l), i[ut] = e, At(i), a = i;
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
                      i = n.createElement(a), as(i, a, l), n.head.appendChild(i);
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
                      i = n.createElement(a), as(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  i[ut] = e, At(i), a = i;
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
            )) : a === null && e.stateNode !== null && br(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        vs(t, e), ps(e), a & 512 && (Xt || l === null || Ls(l, l.return)), l !== null && a & 4 && br(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (vs(t, e), ps(e), a & 512 && (Xt || l === null || Ls(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            ta(n, "");
          } catch (q) {
            Tt(e, e.return, q);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, br(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (Nr = !0);
        break;
      case 6:
        if (vs(t, e), ps(e), a & 4) {
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
        if (Bi = null, n = Ds, Ds = qi(t.containerInfo), vs(t, e), Ds = n, ps(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            zn(t.containerInfo);
          } catch (q) {
            Tt(e, e.return, q);
          }
        Nr && (Nr = !1, nh(e));
        break;
      case 4:
        a = Ds, Ds = qi(
          e.stateNode.containerInfo
        ), vs(t, e), ps(e), Ds = a;
        break;
      case 12:
        vs(t, e), ps(e);
        break;
      case 13:
        vs(t, e), ps(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Tr = qe()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Sr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = l !== null && l.memoizedState !== null, z = sl, J = Xt;
        if (sl = z || n, Xt = J || p, vs(t, e), Xt = J, sl = z, ps(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || p || sl || Xt || $l(e)), l = null, t = e; ; ) {
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Sr(e, l))));
        break;
      case 19:
        vs(t, e), ps(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Sr(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        vs(t, e), ps(e);
    }
  }
  function ps(e) {
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
            var n = l.stateNode, i = yr(e);
            Si(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (ta(c, ""), l.flags &= -33);
            var d = yr(e);
            Si(e, d, c);
            break;
          case 3:
          case 4:
            var p = l.stateNode.containerInfo, z = yr(e);
            _r(
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
  function gl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        eh(e, t.alternate, t), t = t.sibling;
  }
  function $l(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          pl(4, t, t.return), $l(t);
          break;
        case 1:
          Ls(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && $d(
            t,
            t.return,
            l
          ), $l(t);
          break;
        case 27:
          Nn(t.stateNode);
        case 26:
        case 5:
          Ls(t, t.return), $l(t);
          break;
        case 22:
          t.memoizedState === null && $l(t);
          break;
        case 30:
          $l(t);
          break;
        default:
          $l(t);
      }
      e = e.sibling;
    }
  }
  function bl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          bl(
            n,
            i,
            l
          ), fn(4, i);
          break;
        case 1:
          if (bl(
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
                  Do(p[n], d);
            } catch (z) {
              Tt(a, a.return, z);
            }
          }
          l && c & 64 && Kd(i), mn(i, i.return);
          break;
        case 27:
          Id(i);
        case 26:
        case 5:
          bl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Wd(i), mn(i, i.return);
          break;
        case 12:
          bl(
            n,
            i,
            l
          );
          break;
        case 13:
          bl(
            n,
            i,
            l
          ), l && c & 4 && lh(n, i);
          break;
        case 22:
          i.memoizedState === null && bl(
            n,
            i,
            l
          ), mn(i, i.return);
          break;
        case 30:
          break;
        default:
          bl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function wr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Ia(l));
  }
  function kr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ia(e));
  }
  function Ys(e, t, l, a) {
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
        Ys(
          e,
          t,
          l,
          a
        ), n & 2048 && fn(9, t);
        break;
      case 1:
        Ys(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Ys(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ia(e)));
        break;
      case 12:
        if (n & 2048) {
          Ys(
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
          Ys(
            e,
            t,
            l,
            a
          );
        break;
      case 13:
        Ys(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Ys(
          e,
          t,
          l,
          a
        ) : xn(e, t) : i._visibility & 2 ? Ys(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, ba(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && wr(c, t);
        break;
      case 24:
        Ys(
          e,
          t,
          l,
          a
        ), n & 2048 && kr(t.alternate, t);
        break;
      default:
        Ys(
          e,
          t,
          l,
          a
        );
    }
  }
  function ba(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, d = l, p = a, z = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ba(
            i,
            c,
            d,
            p,
            n
          ), fn(8, c);
          break;
        case 23:
          break;
        case 22:
          var J = c.stateNode;
          c.memoizedState !== null ? J._visibility & 2 ? ba(
            i,
            c,
            d,
            p,
            n
          ) : xn(
            i,
            c
          ) : (J._visibility |= 2, ba(
            i,
            c,
            d,
            p,
            n
          )), n && z & 2048 && wr(
            c.alternate,
            c
          );
          break;
        case 24:
          ba(
            i,
            c,
            d,
            p,
            n
          ), n && z & 2048 && kr(c.alternate, c);
          break;
        default:
          ba(
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
  function xn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            xn(l, a), n & 2048 && wr(
              a.alternate,
              a
            );
            break;
          case 24:
            xn(l, a), n & 2048 && kr(a.alternate, a);
            break;
          default:
            xn(l, a);
        }
        t = t.sibling;
      }
  }
  var jn = 8192;
  function ya(e) {
    if (e.subtreeFlags & jn)
      for (e = e.child; e !== null; )
        ch(e), e = e.sibling;
  }
  function ch(e) {
    switch (e.tag) {
      case 26:
        ya(e), e.flags & jn && e.memoizedState !== null && aj(
          Ds,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ya(e);
        break;
      case 3:
      case 4:
        var t = Ds;
        Ds = qi(e.stateNode.containerInfo), ya(e), Ds = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = jn, jn = 16777216, ya(e), jn = t) : ya(e));
        break;
      default:
        ya(e);
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
  function vn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          es = a, oh(
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
        vn(e), e.flags & 2048 && pl(9, e, e.return);
        break;
      case 3:
        vn(e);
        break;
      case 12:
        vn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, wi(e)) : vn(e);
        break;
      default:
        vn(e);
    }
  }
  function wi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          es = a, oh(
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
          pl(8, t, t.return), wi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, wi(t));
          break;
        default:
          wi(t);
      }
      e = e.sibling;
    }
  }
  function oh(e, t) {
    for (; es !== null; ) {
      var l = es;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          pl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ia(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, es = a;
      else
        e: for (l = e; es !== null; ) {
          a = es;
          var n = a.sibling, i = a.return;
          if (th(a), a === l) {
            es = null;
            break e;
          }
          if (n !== null) {
            n.return = i, es = n;
            break e;
          }
          es = i;
        }
    }
  }
  var bx = {
    getCacheForType: function(e) {
      var t = ns(Wt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, yx = typeof WeakMap == "function" ? WeakMap : Map, St = 0, zt = null, xt = null, vt = 0, wt = 0, gs = null, yl = !1, _a = !1, Cr = !1, al = 0, Bt = 0, _l = 0, Wl = 0, Er = 0, Ts = 0, Na = 0, pn = null, hs = null, Or = !1, Tr = 0, ki = 1 / 0, Ci = null, Nl = null, ls = 0, Sl = null, Sa = null, wa = 0, zr = 0, Ar = null, dh = null, gn = 0, Rr = null;
  function bs() {
    if ((St & 2) !== 0 && vt !== 0)
      return vt & -vt;
    if (y.T !== null) {
      var e = ha;
      return e !== 0 ? e : Lr();
    }
    return kt();
  }
  function hh() {
    Ts === 0 && (Ts = (vt & 536870912) === 0 || yt ? nt() : 536870912);
    var e = Os.current;
    return e !== null && (e.flags |= 32), Ts;
  }
  function ys(e, t, l) {
    (e === zt && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null) && (ka(e, 0), wl(
      e,
      vt,
      Ts,
      !1
    )), ue(e, l), ((St & 2) === 0 || e !== zt) && (e === zt && ((St & 2) === 0 && (Wl |= l), Bt === 4 && wl(
      e,
      vt,
      Ts,
      !1
    )), Gs(e));
  }
  function fh(e, t, l) {
    if ((St & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || pe(e, t), n = a ? Sx(e, t) : Mr(e, t, !0), i = a;
    do {
      if (n === 0) {
        _a && !a && wl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !_x(l)) {
          n = Mr(e, t, !1), i = !1;
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
              n = pn;
              var p = d.current.memoizedState.isDehydrated;
              if (p && (ka(d, c).flags |= 256), c = Mr(
                d,
                c,
                !1
              ), c !== 2) {
                if (Cr && !p) {
                  d.errorRecoveryDisabledLanes |= i, Wl |= i, n = 4;
                  break e;
                }
                i = hs, hs = n, i !== null && (hs === null ? hs = i : hs.push.apply(
                  hs,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ka(e, 0), wl(e, t, 0, !0);
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
              wl(
                a,
                t,
                Ts,
                !yl
              );
              break e;
            case 2:
              hs = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = Tr + 300 - qe(), 10 < n)) {
            if (wl(
              a,
              t,
              Ts,
              !yl
            ), ge(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Gh(
              mh.bind(
                null,
                a,
                l,
                hs,
                Ci,
                Or,
                t,
                Ts,
                Wl,
                Na,
                yl,
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
            hs,
            Ci,
            Or,
            t,
            Ts,
            Wl,
            Na,
            yl,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Gs(e);
  }
  function mh(e, t, l, a, n, i, c, d, p, z, J, ee, R, q) {
    if (e.timeoutHandle = -1, ee = t.subtreeFlags, (ee & 8192 || (ee & 16785408) === 16785408) && (kn = { stylesheets: null, count: 0, unsuspend: lj }, ch(t), ee = nj(), ee !== null)) {
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
      ), wl(e, i, c, !z);
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
  function _x(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!xs(i(), n)) return !1;
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
  function wl(e, t, l, a) {
    t &= ~Er, t &= ~Wl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - at(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && st(e, l, t);
  }
  function Ei() {
    return (St & 6) === 0 ? (bn(0), !1) : !0;
  }
  function Dr() {
    if (xt !== null) {
      if (wt === 0)
        var e = xt.return;
      else
        e = xt, Ws = Ql = null, Fc(e), pa = null, on = 0, e = xt;
      for (; e !== null; )
        Jd(e.alternate, e), e = e.return;
      xt = null;
    }
  }
  function ka(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Lx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Dr(), zt = e, xt = l = Js(e.current, null), vt = t, wt = 0, gs = null, yl = !1, _a = pe(e, t), Cr = !1, Na = Ts = Er = Wl = _l = Bt = 0, hs = pn = null, Or = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - at(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return al = t, Wn(), l;
  }
  function xh(e, t) {
    ft = null, y.H = xi, t === en || t === ni ? (t = Ao(), wt = 3) : t === Oo ? (t = Ao(), wt = 4) : wt = t === Rd ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, gs = t, xt === null && (Bt = 1, bi(
      e,
      ws(t, e.current)
    ));
  }
  function jh() {
    var e = y.H;
    return y.H = xi, e === null ? xi : e;
  }
  function vh() {
    var e = y.A;
    return y.A = bx, e;
  }
  function Ur() {
    Bt = 4, yl || (vt & 4194048) !== vt && Os.current !== null || (_a = !0), (_l & 134217727) === 0 && (Wl & 134217727) === 0 || zt === null || wl(
      zt,
      vt,
      Ts,
      !1
    );
  }
  function Mr(e, t, l) {
    var a = St;
    St |= 2;
    var n = jh(), i = vh();
    (zt !== e || vt !== t) && (Ci = null, ka(e, t)), t = !1;
    var c = Bt;
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          var d = xt, p = gs;
          switch (wt) {
            case 8:
              Dr(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Os.current === null && (t = !0);
              var z = wt;
              if (wt = 0, gs = null, Ca(e, d, p, z), l && _a) {
                c = 0;
                break e;
              }
              break;
            default:
              z = wt, wt = 0, gs = null, Ca(e, d, p, z);
          }
        }
        Nx(), c = Bt;
        break;
      } catch (J) {
        xh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ws = Ql = null, St = a, y.H = n, y.A = i, xt === null && (zt = null, vt = 0, Wn()), c;
  }
  function Nx() {
    for (; xt !== null; ) ph(xt);
  }
  function Sx(e, t) {
    var l = St;
    St |= 2;
    var a = jh(), n = vh();
    zt !== e || vt !== t ? (Ci = null, ki = qe() + 500, ka(e, t)) : _a = pe(
      e,
      t
    );
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          t = xt;
          var i = gs;
          t: switch (wt) {
            case 1:
              wt = 0, gs = null, Ca(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (To(i)) {
                wt = 0, gs = null, gh(t);
                break;
              }
              t = function() {
                wt !== 2 && wt !== 9 || zt !== e || (wt = 7), Gs(e);
              }, i.then(t, t);
              break e;
            case 3:
              wt = 7;
              break e;
            case 4:
              wt = 5;
              break e;
            case 7:
              To(i) ? (wt = 0, gs = null, gh(t)) : (wt = 0, gs = null, Ca(e, t, i, 7));
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
                    wt = 0, gs = null;
                    var p = d.sibling;
                    if (p !== null) xt = p;
                    else {
                      var z = d.return;
                      z !== null ? (xt = z, Oi(z)) : xt = null;
                    }
                    break t;
                  }
              }
              wt = 0, gs = null, Ca(e, t, i, 5);
              break;
            case 6:
              wt = 0, gs = null, Ca(e, t, i, 6);
              break;
            case 8:
              Dr(), Bt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        wx();
        break;
      } catch (J) {
        xh(e, J);
      }
    while (!0);
    return Ws = Ql = null, y.H = a, y.A = n, St = l, xt !== null ? 0 : (zt = null, vt = 0, Wn(), Bt);
  }
  function wx() {
    for (; xt !== null && !Me(); )
      ph(xt);
  }
  function ph(e) {
    var t = Zd(e.alternate, e, al);
    e.memoizedProps = e.pendingProps, t === null ? Oi(e) : xt = t;
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
          vt
        );
        break;
      case 11:
        t = Bd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          vt
        );
        break;
      case 5:
        Fc(t);
      default:
        Jd(l, t), t = xt = bo(t, al), t = Zd(l, t, al);
    }
    e.memoizedProps = e.pendingProps, t === null ? Oi(e) : xt = t;
  }
  function Ca(e, t, l, a) {
    Ws = Ql = null, Fc(t), pa = null, on = 0;
    var n = t.return;
    try {
      if (mx(
        e,
        n,
        t,
        l,
        vt
      )) {
        Bt = 1, bi(
          e,
          ws(l, e.current)
        ), xt = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw xt = n, i;
      Bt = 1, bi(
        e,
        ws(l, e.current)
      ), xt = null;
      return;
    }
    t.flags & 32768 ? (yt || a === 1 ? e = !0 : _a || (vt & 536870912) !== 0 ? e = !1 : (yl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Os.current, a !== null && a.tag === 13 && (a.flags |= 16384))), bh(t, e)) : Oi(t);
  }
  function Oi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        bh(
          t,
          yl
        );
        return;
      }
      e = t.return;
      var l = jx(
        t.alternate,
        t,
        al
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
    Bt === 0 && (Bt = 5);
  }
  function bh(e, t) {
    do {
      var l = vx(e.alternate, e);
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
    Bt = 6, xt = null;
  }
  function yh(e, t, l, a, n, i, c, d, p) {
    e.cancelPendingCommit = null;
    do
      Ti();
    while (ls !== 0);
    if ((St & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= kc, be(
        e,
        l,
        i,
        c,
        d,
        p
      ), e === zt && (xt = zt = null, vt = 0), Sa = t, Sl = e, wa = l, zr = i, Ar = n, dh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Ox(ve, function() {
        return kh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = y.T, y.T = null, n = Q.p, Q.p = 2, c = St, St |= 4;
        try {
          px(e, t, l);
        } finally {
          St = c, Q.p = n, y.T = a;
        }
      }
      ls = 1, _h(), Nh(), Sh();
    }
  }
  function _h() {
    if (ls === 1) {
      ls = 0;
      var e = Sl, t = Sa, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          ah(t, e);
          var i = Kr, c = uo(e.containerInfo), d = i.focusedElem, p = i.selectionRange;
          if (c !== d && d && d.ownerDocument && ro(
            d.ownerDocument.documentElement,
            d
          )) {
            if (p !== null && yc(d)) {
              var z = p.start, J = p.end;
              if (J === void 0 && (J = z), "selectionStart" in d)
                d.selectionStart = z, d.selectionEnd = Math.min(
                  J,
                  d.value.length
                );
              else {
                var ee = d.ownerDocument || document, R = ee && ee.defaultView || window;
                if (R.getSelection) {
                  var q = R.getSelection(), Ie = d.textContent.length, $e = Math.min(p.start, Ie), Ot = p.end === void 0 ? $e : Math.min(p.end, Ie);
                  !q.extend && $e > Ot && (c = Ot, Ot = $e, $e = c);
                  var C = co(
                    d,
                    $e
                  ), S = co(
                    d,
                    Ot
                  );
                  if (C && S && (q.rangeCount !== 1 || q.anchorNode !== C.node || q.anchorOffset !== C.offset || q.focusNode !== S.node || q.focusOffset !== S.offset)) {
                    var O = ee.createRange();
                    O.setStart(C.node, C.offset), q.removeAllRanges(), $e > Ot ? (q.addRange(O), q.extend(S.node, S.offset)) : (O.setEnd(S.node, S.offset), q.addRange(O));
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
          Gi = !!Jr, Kr = Jr = null;
        } finally {
          St = n, Q.p = a, y.T = l;
        }
      }
      e.current = t, ls = 2;
    }
  }
  function Nh() {
    if (ls === 2) {
      ls = 0;
      var e = Sl, t = Sa, l = (t.flags & 8772) !== 0;
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
      ls = 3;
    }
  }
  function Sh() {
    if (ls === 4 || ls === 3) {
      ls = 0, we();
      var e = Sl, t = Sa, l = wa, a = dh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ls = 5 : (ls = 0, Sa = Sl = null, wh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Nl = null), Ve(l), t = t.stateNode, _e && typeof _e.onCommitFiberRoot == "function")
        try {
          _e.onCommitFiberRoot(
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
      (wa & 3) !== 0 && Ti(), Gs(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === Rr ? gn++ : (gn = 0, Rr = e) : gn = 0, bn(0);
    }
  }
  function wh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ia(t)));
  }
  function Ti(e) {
    return _h(), Nh(), Sh(), kh();
  }
  function kh() {
    if (ls !== 5) return !1;
    var e = Sl, t = zr;
    zr = 0;
    var l = Ve(wa), a = y.T, n = Q.p;
    try {
      Q.p = 32 > l ? 32 : l, y.T = null, l = Ar, Ar = null;
      var i = Sl, c = wa;
      if (ls = 0, Sa = Sl = null, wa = 0, (St & 6) !== 0) throw Error(o(331));
      var d = St;
      if (St |= 4, uh(i.current), ih(
        i,
        i.current,
        c,
        l
      ), St = d, bn(0, !1), _e && typeof _e.onPostCommitFiberRoot == "function")
        try {
          _e.onPostCommitFiberRoot(I, i);
        } catch {
        }
      return !0;
    } finally {
      Q.p = n, y.T = a, wh(e, t);
    }
  }
  function Ch(e, t, l) {
    t = ws(l, t), t = dr(e.stateNode, t, 2), e = ml(e, t, 2), e !== null && (ue(e, 2), Gs(e));
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
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Nl === null || !Nl.has(a))) {
            e = ws(l, e), l = zd(2), a = ml(t, l, 2), a !== null && (Ad(
              l,
              a,
              t,
              e
            ), ue(a, 2), Gs(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function qr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new yx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Cr = !0, n.add(l), e = kx.bind(null, e, t, l), t.then(e, e));
  }
  function kx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, zt === e && (vt & l) === l && (Bt === 4 || Bt === 3 && (vt & 62914560) === vt && 300 > qe() - Tr ? (St & 2) === 0 && ka(e, 0) : Er |= l, Na === vt && (Na = 0)), Gs(e);
  }
  function Eh(e, t) {
    t === 0 && (t = D()), e = ra(e, t), e !== null && (ue(e, t), Gs(e));
  }
  function Cx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Eh(e, l);
  }
  function Ex(e, t) {
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
  function Ox(e, t) {
    return Be(e, t);
  }
  var zi = null, Ea = null, Hr = !1, Ai = !1, Br = !1, Fl = 0;
  function Gs(e) {
    e !== Ea && e.next === null && (Ea === null ? zi = Ea = e : Ea = Ea.next = e), Ai = !0, Hr || (Hr = !0, zx());
  }
  function bn(e, t) {
    if (!Br && Ai) {
      Br = !0;
      do
        for (var l = !1, a = zi; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              i = (1 << 31 - at(42 | e) + 1) - 1, i &= n & ~(c & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Ah(a, i));
          } else
            i = vt, i = ge(
              a,
              a === zt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || pe(a, i) || (l = !0, Ah(a, i));
          a = a.next;
        }
      while (l);
      Br = !1;
    }
  }
  function Tx() {
    Oh();
  }
  function Oh() {
    Ai = Hr = !1;
    var e = 0;
    Fl !== 0 && (Bx() && (e = Fl), Fl = 0);
    for (var t = qe(), l = null, a = zi; a !== null; ) {
      var n = a.next, i = Th(a, t);
      i === 0 ? (a.next = null, l === null ? zi = n : l.next = n, n === null && (Ea = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (Ai = !0)), a = n;
    }
    bn(e);
  }
  function Th(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - at(i), d = 1 << c, p = n[c];
      p === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Ye(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = zt, l = vt, l = ge(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && De(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || pe(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && De(a), Ve(l)) {
        case 2:
        case 8:
          l = dt;
          break;
        case 32:
          l = ve;
          break;
        case 268435456:
          l = ye;
          break;
        default:
          l = ve;
      }
      return a = zh.bind(null, e), l = Be(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && De(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function zh(e, t) {
    if (ls !== 0 && ls !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ti() && e.callbackNode !== l)
      return null;
    var a = vt;
    return a = ge(
      e,
      e === zt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (fh(e, a, t), Th(e, qe()), e.callbackNode != null && e.callbackNode === l ? zh.bind(null, e) : null);
  }
  function Ah(e, t) {
    if (Ti()) return null;
    fh(e, t, !0);
  }
  function zx() {
    Yx(function() {
      (St & 6) !== 0 ? Be(
        Ke,
        Tx
      ) : Oh();
    });
  }
  function Lr() {
    return Fl === 0 && (Fl = nt()), Fl;
  }
  function Rh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Xn("" + e);
  }
  function Dh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Ax(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Rh(
        (n[Nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Nt] || null) ? Rh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var d = new Jn(
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
                if (Fl !== 0) {
                  var p = c ? Dh(n, c) : new FormData(n);
                  ir(
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
                typeof i == "function" && (d.preventDefault(), p = c ? Dh(n, c) : new FormData(n), ir(
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
  for (var Yr = 0; Yr < wc.length; Yr++) {
    var Gr = wc[Yr], Rx = Gr.toLowerCase(), Dx = Gr[0].toUpperCase() + Gr.slice(1);
    Rs(
      Rx,
      "on" + Dx
    );
  }
  Rs(fo, "onAnimationEnd"), Rs(mo, "onAnimationIteration"), Rs(xo, "onAnimationStart"), Rs("dblclick", "onDoubleClick"), Rs("focusin", "onFocus"), Rs("focusout", "onBlur"), Rs(Fm, "onTransitionRun"), Rs(Im, "onTransitionStart"), Rs(Pm, "onTransitionCancel"), Rs(jo, "onTransitionEnd"), Y("onMouseEnter", ["mouseout", "mouseover"]), Y("onMouseLeave", ["mouseout", "mouseover"]), Y("onPointerEnter", ["pointerout", "pointerover"]), Y("onPointerLeave", ["pointerout", "pointerover"]), f(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), f(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), f("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), f(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), f(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), f(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var yn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Ux = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(yn)
  );
  function Uh(e, t) {
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
              gi(J);
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
              gi(J);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function jt(e, t) {
    var l = t[ke];
    l === void 0 && (l = t[ke] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Mh(t, e, 2, !1), l.add(a));
  }
  function Xr(e, t, l) {
    var a = 0;
    t && (a |= 4), Mh(
      l,
      e,
      a,
      t
    );
  }
  var Ri = "_reactListening" + Math.random().toString(36).slice(2);
  function Qr(e) {
    if (!e[Ri]) {
      e[Ri] = !0, ul.forEach(function(l) {
        l !== "selectionchange" && (Ux.has(l) || Xr(l, !1, e), Xr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ri] || (t[Ri] = !0, Xr("selectionchange", !1, t));
    }
  }
  function Mh(e, t, l, a) {
    switch (cf(t)) {
      case 2:
        var n = rj;
        break;
      case 8:
        n = uj;
        break;
      default:
        n = au;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !hc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Zr(e, t, l, a, n) {
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
            if (c = Pe(d), c === null) return;
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
      var z = i, J = oc(l), ee = [];
      e: {
        var R = vo.get(e);
        if (R !== void 0) {
          var q = Jn, Ie = e;
          switch (e) {
            case "keypress":
              if (Zn(l) === 0) break e;
            case "keydown":
            case "keyup":
              q = Om;
              break;
            case "focusin":
              Ie = "focus", q = jc;
              break;
            case "focusout":
              Ie = "blur", q = jc;
              break;
            case "beforeblur":
            case "afterblur":
              q = jc;
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
              q = vm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              q = Am;
              break;
            case fo:
            case mo:
            case xo:
              q = bm;
              break;
            case jo:
              q = Dm;
              break;
            case "scroll":
            case "scrollend":
              q = xm;
              break;
            case "wheel":
              q = Mm;
              break;
            case "copy":
            case "cut":
            case "paste":
              q = _m;
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
              q = Hm;
          }
          var $e = (t & 4) !== 0, Ot = !$e && (e === "scroll" || e === "scrollend"), C = $e ? R !== null ? R + "Capture" : null : R;
          $e = [];
          for (var S = z, O; S !== null; ) {
            var W = S;
            if (O = W.stateNode, W = W.tag, W !== 5 && W !== 26 && W !== 27 || O === null || C === null || (W = Ba(S, C), W != null && $e.push(
              _n(S, W, O)
            )), Ot) break;
            S = S.return;
          }
          0 < $e.length && (R = new q(
            R,
            Ie,
            null,
            l,
            J
          ), ee.push({ event: R, listeners: $e }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", q = e === "mouseout" || e === "pointerout", R && l !== uc && (Ie = l.relatedTarget || l.fromElement) && (Pe(Ie) || Ie[g]))
            break e;
          if ((q || R) && (R = J.window === J ? J : (R = J.ownerDocument) ? R.defaultView || R.parentWindow : window, q ? (Ie = l.relatedTarget || l.toElement, q = z, Ie = Ie ? Pe(Ie) : null, Ie !== null && (Ot = U(Ie), $e = Ie.tag, Ie !== Ot || $e !== 5 && $e !== 27 && $e !== 6) && (Ie = null)) : (q = null, Ie = z), q !== Ie)) {
            if ($e = Zu, W = "onMouseLeave", C = "onMouseEnter", S = "mouse", (e === "pointerout" || e === "pointerover") && ($e = Ju, W = "onPointerLeave", C = "onPointerEnter", S = "pointer"), Ot = q == null ? R : _s(q), O = Ie == null ? R : _s(Ie), R = new $e(
              W,
              S + "leave",
              q,
              l,
              J
            ), R.target = Ot, R.relatedTarget = O, W = null, Pe(J) === z && ($e = new $e(
              C,
              S + "enter",
              Ie,
              l,
              J
            ), $e.target = O, $e.relatedTarget = Ot, W = $e), Ot = W, q && Ie)
              t: {
                for ($e = q, C = Ie, S = 0, O = $e; O; O = Oa(O))
                  S++;
                for (O = 0, W = C; W; W = Oa(W))
                  O++;
                for (; 0 < S - O; )
                  $e = Oa($e), S--;
                for (; 0 < O - S; )
                  C = Oa(C), O--;
                for (; S--; ) {
                  if ($e === C || C !== null && $e === C.alternate)
                    break t;
                  $e = Oa($e), C = Oa(C);
                }
                $e = null;
              }
            else $e = null;
            q !== null && qh(
              ee,
              R,
              q,
              $e,
              !1
            ), Ie !== null && Ot !== null && qh(
              ee,
              Ot,
              Ie,
              $e,
              !0
            );
          }
        }
        e: {
          if (R = z ? _s(z) : window, q = R.nodeName && R.nodeName.toLowerCase(), q === "select" || q === "input" && R.type === "file")
            var Ue = to;
          else if (Pu(R))
            if (so)
              Ue = Km;
            else {
              Ue = Vm;
              var mt = Zm;
            }
          else
            q = R.nodeName, !q || q.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? z && rc(z.elementType) && (Ue = to) : Ue = Jm;
          if (Ue && (Ue = Ue(e, z))) {
            eo(
              ee,
              Ue,
              l,
              J
            );
            break e;
          }
          mt && mt(e, R, z), e === "focusout" && z && R.type === "number" && z.memoizedProps.value != null && cc(R, "number", R.value);
        }
        switch (mt = z ? _s(z) : window, e) {
          case "focusin":
            (Pu(mt) || mt.contentEditable === "true") && (na = mt, _c = z, Ja = null);
            break;
          case "focusout":
            Ja = _c = na = null;
            break;
          case "mousedown":
            Nc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Nc = !1, oo(ee, l, J);
            break;
          case "selectionchange":
            if (Wm) break;
          case "keydown":
          case "keyup":
            oo(ee, l, J);
        }
        var Ge;
        if (pc)
          e: {
            switch (e) {
              case "compositionstart":
                var Fe = "onCompositionStart";
                break e;
              case "compositionend":
                Fe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Fe = "onCompositionUpdate";
                break e;
            }
            Fe = void 0;
          }
        else
          aa ? Fu(e, l) && (Fe = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Fe = "onCompositionStart");
        Fe && (Ku && l.locale !== "ko" && (aa || Fe !== "onCompositionStart" ? Fe === "onCompositionEnd" && aa && (Ge = Xu()) : (ol = J, fc = "value" in ol ? ol.value : ol.textContent, aa = !0)), mt = Di(z, Fe), 0 < mt.length && (Fe = new Vu(
          Fe,
          e,
          null,
          l,
          J
        ), ee.push({ event: Fe, listeners: mt }), Ge ? Fe.data = Ge : (Ge = Iu(l), Ge !== null && (Fe.data = Ge)))), (Ge = Lm ? Ym(e, l) : Gm(e, l)) && (Fe = Di(z, "onBeforeInput"), 0 < Fe.length && (mt = new Vu(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), ee.push({
          event: mt,
          listeners: Fe
        }), mt.data = Ge)), Ax(
          ee,
          e,
          z,
          l,
          J
        );
      }
      Uh(ee, t);
    });
  }
  function _n(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Di(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = Ba(e, l), n != null && a.unshift(
        _n(e, n, i)
      ), n = Ba(e, t), n != null && a.push(
        _n(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Oa(e) {
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
      d !== 5 && d !== 26 && d !== 27 || z === null || (p = z, n ? (z = Ba(l, i), z != null && c.unshift(
        _n(l, z, p)
      )) : n || (z = Ba(l, i), z != null && c.push(
        _n(l, z, p)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Mx = /\r\n?/g, qx = /\u0000|\uFFFD/g;
  function Hh(e) {
    return (typeof e == "string" ? e : "" + e).replace(Mx, `
`).replace(qx, "");
  }
  function Bh(e, t) {
    return t = Hh(t), Hh(e) === t;
  }
  function Ui() {
  }
  function Et(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || ta(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && ta(e, "" + a);
        break;
      case "className":
        It(e, "class", a);
        break;
      case "tabIndex":
        It(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        It(e, l, a);
        break;
      case "style":
        Lu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          It(e, "data", a);
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
        a = Xn("" + a), e.setAttribute(l, a);
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
          typeof i == "function" && (l === "formAction" ? (t !== "input" && Et(e, t, "name", n.name, n, null), Et(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Et(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Et(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Et(e, t, "encType", n.encType, n, null), Et(e, t, "method", n.method, n, null), Et(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Xn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Ui);
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
        l = Xn("" + a), e.setAttributeNS(
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
        jt("beforetoggle", e), jt("toggle", e), As(e, "popover", a);
        break;
      case "xlinkActuate":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        $t(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        $t(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        $t(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        $t(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        As(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = fm.get(l) || l, As(e, l, a));
    }
  }
  function Vr(e, t, l, a, n, i) {
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
        typeof a == "string" ? ta(e, a) : (typeof a == "number" || typeof a == "bigint") && ta(e, "" + a);
        break;
      case "onScroll":
        a != null && jt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && jt("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Ui);
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
        if (!Qs.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[Nt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : As(e, l, a);
          }
    }
  }
  function as(e, t, l) {
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
                  Et(e, t, i, c, l, null);
              }
          }
        n && Et(e, t, "srcSet", l.srcSet, l, null), a && Et(e, t, "src", l.src, l, null);
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
                  Et(e, t, a, J, l, null);
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
        ), Yn(e);
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
                Et(e, t, n, d, l, null);
            }
        t = i, l = c, e.multiple = !!a, t != null ? ea(e, !!a, t, !1) : l != null && ea(e, !!a, l, !0);
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
                Et(e, t, c, d, l, null);
            }
        Hu(e, a, n, i), Yn(e);
        return;
      case "option":
        for (p in l)
          if (l.hasOwnProperty(p) && (a = l[p], a != null))
            switch (p) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Et(e, t, p, a, l, null);
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
        for (a = 0; a < yn.length; a++)
          jt(yn[a], e);
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
                Et(e, t, z, a, l, null);
            }
        return;
      default:
        if (rc(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Vr(
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
      l.hasOwnProperty(d) && (a = l[d], a != null && Et(e, t, d, a, l, null));
  }
  function Hx(e, t, l, a) {
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
                a.hasOwnProperty(q) || Et(e, t, q, null, a, ee);
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
                q !== ee && Et(
                  e,
                  t,
                  R,
                  q,
                  a,
                  ee
                );
            }
        }
        ic(
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
                a.hasOwnProperty(i) || Et(
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
                i !== p && Et(
                  e,
                  t,
                  n,
                  i,
                  a,
                  p
                );
            }
        t = d, l = c, a = q, R != null ? ea(e, !!l, R, !1) : !!a != !!l && (t != null ? ea(e, !!l, t, !0) : ea(e, !!l, l ? [] : "", !1));
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
                Et(e, t, d, null, a, n);
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
                n !== i && Et(e, t, c, n, a, i);
            }
        qu(e, R, q);
        return;
      case "option":
        for (var Ie in l)
          if (R = l[Ie], l.hasOwnProperty(Ie) && R != null && !a.hasOwnProperty(Ie))
            switch (Ie) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Et(
                  e,
                  t,
                  Ie,
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
                Et(
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
        for (var $e in l)
          R = l[$e], l.hasOwnProperty($e) && R != null && !a.hasOwnProperty($e) && Et(e, t, $e, null, a, R);
        for (z in a)
          if (R = a[z], q = l[z], a.hasOwnProperty(z) && R !== q && (R != null || q != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(o(137, t));
                break;
              default:
                Et(
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
        if (rc(t)) {
          for (var Ot in l)
            R = l[Ot], l.hasOwnProperty(Ot) && R !== void 0 && !a.hasOwnProperty(Ot) && Vr(
              e,
              t,
              Ot,
              void 0,
              a,
              R
            );
          for (J in a)
            R = a[J], q = l[J], !a.hasOwnProperty(J) || R === q || R === void 0 && q === void 0 || Vr(
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
      R = l[C], l.hasOwnProperty(C) && R != null && !a.hasOwnProperty(C) && Et(e, t, C, null, a, R);
    for (ee in a)
      R = a[ee], q = l[ee], !a.hasOwnProperty(ee) || R === q || R == null && q == null || Et(e, t, ee, R, a, q);
  }
  var Jr = null, Kr = null;
  function Mi(e) {
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
  function $r(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Wr = null;
  function Bx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Wr ? !1 : (Wr = e, !0) : (Wr = null, !1);
  }
  var Gh = typeof setTimeout == "function" ? setTimeout : void 0, Lx = typeof clearTimeout == "function" ? clearTimeout : void 0, Xh = typeof Promise == "function" ? Promise : void 0, Yx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xh < "u" ? function(e) {
    return Xh.resolve(null).then(e).catch(Gx);
  } : Gh;
  function Gx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function kl(e) {
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
            if (l & 1 && Nn(c.documentElement), l & 2 && Nn(c.body), l & 4)
              for (l = c.head, Nn(l), c = l.firstChild; c; ) {
                var d = c.nextSibling, p = c.nodeName;
                c[Te] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = d;
              }
          }
          if (n === 0) {
            e.removeChild(i), zn(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    zn(t);
  }
  function Fr(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Fr(l), ze(l);
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
  function Xx(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Te])
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
      if (e = Us(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Qx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Us(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ir(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Zx(e, t) {
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
  function Us(e) {
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
  var Pr = null;
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
    switch (t = Mi(l), e) {
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
  function Nn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    ze(e);
  }
  var zs = /* @__PURE__ */ new Map(), Jh = /* @__PURE__ */ new Set();
  function qi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var nl = Q.d;
  Q.d = {
    f: Vx,
    r: Jx,
    D: Kx,
    C: $x,
    L: Wx,
    m: Fx,
    X: Px,
    S: Ix,
    M: ej
  };
  function Vx() {
    var e = nl.f(), t = Ei();
    return e || t;
  }
  function Jx(e) {
    var t = Zt(e);
    t !== null && t.tag === 5 && t.type === "form" ? fd(t) : nl.r(e);
  }
  var Ta = typeof document > "u" ? null : document;
  function Kh(e, t, l) {
    var a = Ta;
    if (a && typeof t == "string" && t) {
      var n = Ss(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Jh.has(n) || (Jh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), as(t, "link", e), At(t), a.head.appendChild(t)));
    }
  }
  function Kx(e) {
    nl.D(e), Kh("dns-prefetch", e, null);
  }
  function $x(e, t) {
    nl.C(e, t), Kh("preconnect", e, t);
  }
  function Wx(e, t, l) {
    nl.L(e, t, l);
    var a = Ta;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Ss(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Ss(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Ss(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Ss(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = za(e);
          break;
        case "script":
          i = Aa(e);
      }
      zs.has(i) || (e = M(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), zs.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Sn(i)) || t === "script" && a.querySelector(wn(i)) || (t = a.createElement("link"), as(t, "link", e), At(t), a.head.appendChild(t)));
    }
  }
  function Fx(e, t) {
    nl.m(e, t);
    var l = Ta;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Ss(a) + '"][href="' + Ss(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Aa(e);
      }
      if (!zs.has(i) && (e = M({ rel: "modulepreload", href: e }, t), zs.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(wn(i)))
              return;
        }
        a = l.createElement("link"), as(a, "link", e), At(a), l.head.appendChild(a);
      }
    }
  }
  function Ix(e, t, l) {
    nl.S(e, t, l);
    var a = Ta;
    if (a && e) {
      var n = fs(a).hoistableStyles, i = za(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          Sn(i)
        ))
          d.loading = 5;
        else {
          e = M(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = zs.get(i)) && eu(e, l);
          var p = c = a.createElement("link");
          At(p), as(p, "link", e), p._p = new Promise(function(z, J) {
            p.onload = z, p.onerror = J;
          }), p.addEventListener("load", function() {
            d.loading |= 1;
          }), p.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Hi(c, t, a);
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
  function Px(e, t) {
    nl.X(e, t);
    var l = Ta;
    if (l && e) {
      var a = fs(l).hoistableScripts, n = Aa(e), i = a.get(n);
      i || (i = l.querySelector(wn(n)), i || (e = M({ src: e, async: !0 }, t), (t = zs.get(n)) && tu(e, t), i = l.createElement("script"), At(i), as(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function ej(e, t) {
    nl.M(e, t);
    var l = Ta;
    if (l && e) {
      var a = fs(l).hoistableScripts, n = Aa(e), i = a.get(n);
      i || (i = l.querySelector(wn(n)), i || (e = M({ src: e, async: !0, type: "module" }, t), (t = zs.get(n)) && tu(e, t), i = l.createElement("script"), At(i), as(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function $h(e, t, l, a) {
    var n = (n = $.current) ? qi(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = za(l.href), l = fs(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = za(l.href);
          var i = fs(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            Sn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), zs.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, zs.set(e, l), i || tj(
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
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Aa(l), l = fs(
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
  function za(e) {
    return 'href="' + Ss(e) + '"';
  }
  function Sn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Wh(e) {
    return M({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function tj(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), as(t, "link", l), At(t), e.head.appendChild(t));
  }
  function Aa(e) {
    return '[src="' + Ss(e) + '"]';
  }
  function wn(e) {
    return "script[async]" + e;
  }
  function Fh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Ss(l.href) + '"]'
          );
          if (a)
            return t.instance = a, At(a), a;
          var n = M({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), At(a), as(a, "style", n), Hi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = za(l.href);
          var i = e.querySelector(
            Sn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, At(i), i;
          a = Wh(l), (n = zs.get(n)) && eu(a, n), i = (e.ownerDocument || e).createElement("link"), At(i);
          var c = i;
          return c._p = new Promise(function(d, p) {
            c.onload = d, c.onerror = p;
          }), as(i, "link", a), t.state.loading |= 4, Hi(i, l.precedence, e), t.instance = i;
        case "script":
          return i = Aa(l.src), (n = e.querySelector(
            wn(i)
          )) ? (t.instance = n, At(n), n) : (a = l, (n = zs.get(i)) && (a = M({}, l), tu(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), At(n), as(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Hi(a, l.precedence, e));
    return t.instance;
  }
  function Hi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function eu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function tu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Bi = null;
  function Ih(e, t, l) {
    if (Bi === null) {
      var a = /* @__PURE__ */ new Map(), n = Bi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Bi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[Te] || i[ut] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
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
  function sj(e, t, l) {
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
  var kn = null;
  function lj() {
  }
  function aj(e, t, l) {
    if (kn === null) throw Error(o(475));
    var a = kn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = za(l.href), i = e.querySelector(
          Sn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Li.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, At(i);
          return;
        }
        i = e.ownerDocument || e, l = Wh(l), (n = zs.get(n)) && eu(l, n), i = i.createElement("link"), At(i);
        var c = i;
        c._p = new Promise(function(d, p) {
          c.onload = d, c.onerror = p;
        }), as(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Li.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function nj() {
    if (kn === null) throw Error(o(475));
    var e = kn;
    return e.stylesheets && e.count === 0 && su(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && su(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Li() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) su(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Yi = null;
  function su(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Yi = /* @__PURE__ */ new Map(), t.forEach(ij, e), Yi = null, Li.call(e));
  }
  function ij(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Yi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Yi.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = Li.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Cn = {
    $$typeof: F,
    Provider: null,
    Consumer: null,
    _currentValue: le,
    _currentValue2: le,
    _threadCount: 0
  };
  function cj(e, t, l, a, n, i, c, d) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = x(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = x(0), this.hiddenUpdates = x(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = d, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function tf(e, t, l, a, n, i, c, d, p, z, J, ee) {
    return e = new cj(
      e,
      t,
      l,
      c,
      d,
      p,
      z,
      ee
    ), t = 1, i === !0 && (t |= 24), i = js(3, null, null, t), e.current = i, i.stateNode = e, t = qc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Yc(i), e;
  }
  function sf(e) {
    return e ? (e = ua, e) : ua;
  }
  function lf(e, t, l, a, n, i) {
    n = sf(n), a.context === null ? a.context = n : a.pendingContext = n, a = fl(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = ml(e, a, t), l !== null && (ys(l, e, t), sn(l, e, t));
  }
  function af(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function lu(e, t) {
    af(e, t), (e = e.alternate) && af(e, t);
  }
  function nf(e) {
    if (e.tag === 13) {
      var t = ra(e, 67108864);
      t !== null && ys(t, e, 67108864), lu(e, 67108864);
    }
  }
  var Gi = !0;
  function rj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 2, au(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function uj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 8, au(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function au(e, t, l, a) {
    if (Gi) {
      var n = nu(a);
      if (n === null)
        Zr(
          e,
          t,
          a,
          Xi,
          l
        ), rf(e, a);
      else if (dj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (rf(e, a), t & 4 && -1 < oj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Zt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = b(i.pendingLanes);
                  if (c !== 0) {
                    var d = i;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; c; ) {
                      var p = 1 << 31 - at(c);
                      d.entanglements[1] |= p, c &= ~p;
                    }
                    Gs(i), (St & 6) === 0 && (ki = qe() + 500, bn(0));
                  }
                }
                break;
              case 13:
                d = ra(i, 2), d !== null && ys(d, i, 2), Ei(), lu(i, 2);
            }
          if (i = nu(a), i === null && Zr(
            e,
            t,
            a,
            Xi,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Zr(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function nu(e) {
    return e = oc(e), iu(e);
  }
  var Xi = null;
  function iu(e) {
    if (Xi = null, e = Pe(e), e !== null) {
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
    return Xi = e, null;
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
        switch (tt()) {
          case Ke:
            return 2;
          case dt:
            return 8;
          case ve:
          case ht:
            return 32;
          case ye:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var cu = !1, Cl = null, El = null, Ol = null, En = /* @__PURE__ */ new Map(), On = /* @__PURE__ */ new Map(), Tl = [], oj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function rf(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Cl = null;
        break;
      case "dragenter":
      case "dragleave":
        El = null;
        break;
      case "mouseover":
      case "mouseout":
        Ol = null;
        break;
      case "pointerover":
      case "pointerout":
        En.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        On.delete(t.pointerId);
    }
  }
  function Tn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Zt(t), t !== null && nf(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function dj(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Cl = Tn(
          Cl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return El = Tn(
          El,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Ol = Tn(
          Ol,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return En.set(
          i,
          Tn(
            En.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, On.set(
          i,
          Tn(
            On.get(i) || null,
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
    var t = Pe(e.target);
    if (t !== null) {
      var l = U(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Lt(e.priority, function() {
              if (l.tag === 13) {
                var a = bs();
                a = me(a);
                var n = ra(l, a);
                n !== null && ys(n, l, a), lu(l, a);
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
  function Qi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = nu(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        uc = a, l.target.dispatchEvent(a), uc = null;
      } else
        return t = Zt(l), t !== null && nf(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function of(e, t, l) {
    Qi(e) && l.delete(t);
  }
  function hj() {
    cu = !1, Cl !== null && Qi(Cl) && (Cl = null), El !== null && Qi(El) && (El = null), Ol !== null && Qi(Ol) && (Ol = null), En.forEach(of), On.forEach(of);
  }
  function Zi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, cu || (cu = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      hj
    )));
  }
  var Vi = null;
  function df(e) {
    Vi !== e && (Vi = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Vi === e && (Vi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (iu(a || l) === null)
              continue;
            break;
          }
          var i = Zt(l);
          i !== null && (e.splice(t, 3), t -= 3, ir(
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
  function zn(e) {
    function t(p) {
      return Zi(p, e);
    }
    Cl !== null && Zi(Cl, e), El !== null && Zi(El, e), Ol !== null && Zi(Ol, e), En.forEach(t), On.forEach(t);
    for (var l = 0; l < Tl.length; l++) {
      var a = Tl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Tl.length && (l = Tl[0], l.blockedOn === null); )
      uf(l), l.blockedOn === null && Tl.shift();
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
            else if (iu(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), df(l);
        }
      }
  }
  function ru(e) {
    this._internalRoot = e;
  }
  Ji.prototype.render = ru.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = bs();
    lf(l, a, e, t, null, null);
  }, Ji.prototype.unmount = ru.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      lf(e.current, 2, null, e, null, null), Ei(), t[g] = null;
    }
  };
  function Ji(e) {
    this._internalRoot = e;
  }
  Ji.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = kt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Tl.length && t !== 0 && t < Tl[l].priority; l++) ;
      Tl.splice(l, 0, e), l === 0 && uf(e);
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
    return e = G(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var fj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: y,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ki = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ki.isDisabled && Ki.supportsFiber)
      try {
        I = Ki.inject(
          fj
        ), _e = Ki;
      } catch {
      }
  }
  return Rn.createRoot = function(e, t) {
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
    ), e[g] = t.current, Qr(e), new ru(t);
  }, Rn.hydrateRoot = function(e, t, l) {
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
    ), t.context = sf(null), l = t.current, a = bs(), a = me(a), n = fl(a), n.callback = null, ml(l, n, a), l = a, t.current.lanes = l, ue(t, l), Gs(t), e[g] = t.current, Qr(e), new Ji(t);
  }, Rn.version = "19.1.0", Rn;
}
var _f;
function Nj() {
  if (_f) return ou.exports;
  _f = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), ou.exports = _j(), ou.exports;
}
var Sj = Nj(), r = Tu();
const xu = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function wj({ api: u, projects: h }) {
  var We;
  const [_, o] = r.useState(((We = h[0]) == null ? void 0 : We.id) || ""), [T, U] = r.useState([]), [V, A] = r.useState("general_inspection"), [G, v] = r.useState("现场质量安全检查"), [M, K] = r.useState("general,通用施工检查"), [k, se] = r.useState(xu.map((X) => X[0])), [fe, Ne] = r.useState(!1), [Se, Oe] = r.useState(!1), [he, F] = r.useState(""), [oe, ne] = r.useState(""), [H, xe] = r.useState(0), Re = h.find((X) => X.id === _), Xe = Re != null && Re.permissions ? Re.permissions.includes("knowledge.process") : Re == null ? void 0 : Re.can_run, Ze = Re != null && Re.permissions ? Re.permissions.includes("knowledge.review") : Re == null ? void 0 : Re.can_manage;
  r.useEffect(() => {
    let X = !1;
    return U([]), F(""), _ && u(`/scenes?project_id=${encodeURIComponent(_)}`).then((de) => {
      X || U(de.items);
    }).catch((de) => {
      X || F(de.message);
    }), () => {
      X = !0;
    };
  }, [_, H]);
  const Qe = async (X) => {
    Oe(!0), F(""), ne("");
    try {
      await X(), xe((de) => de + 1);
    } catch (de) {
      F(de.message);
    } finally {
      Oe(!1);
    }
  }, je = (X) => {
    A(X.code), v(X.payload.name), K(X.payload.categories.map((de) => de.code + "," + de.name).join(`
`)), se(X.payload.steps.map((de) => de.event_type)), Ne(X.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      he && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: he }),
      oe && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: oe }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: _, onChange: (X) => o(X.target.value), children: h.map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
      ] }),
      Xe && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: V, onChange: (X) => A(X.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: G, onChange: (X) => v(X.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: M, onChange: (X) => K(X.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          xu.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(X[0]), onChange: (de) => se((y) => de.target.checked ? [...y, X[0]] : y.filter((Q) => Q !== X[0])) }),
            X[1]
          ] }, X[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: fe, onChange: (X) => Ne(X.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Se || !_ || !k.length, onClick: () => void Qe(async () => {
          const X = T.filter((y) => y.code === V).sort((y, Q) => Q.version - y.version)[0], de = M.split(`
`).filter((y) => y.trim()).map((y) => {
            const [Q, le] = y.split(/[,，]/);
            if (!(Q != null && Q.trim()) || !(le != null && le.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const Ce = X == null ? void 0 : X.payload.categories.find((m) => m.code === Q.trim());
            return { code: Q.trim(), name: le.trim(), focus: (Ce == null ? void 0 : Ce.focus) || "", keywords: (Ce == null ? void 0 : Ce.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: _, code: V, expected_version: (X == null ? void 0 : X.version) || 0, payload: { name: G, categories: de, steps: xu.filter((y) => k.includes(y[0])).map((y) => ({ event_type: y[0], name: y[1], scope: y[2] })), compare_deadline: fe } }) }), ne("新场景版本已保存，原成果保持原配置。");
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
        Xe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => je(X), children: "以此版本编辑" }),
        Ze && !X.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void Qe(async () => {
          var de;
          await u(`/scenes/${X.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((de = T.find((y) => y.code === X.code && y.active)) == null ? void 0 : de.id) || null }) }), ne("场景版本已启用。");
        }), children: "启用此版本" }),
        Xe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Se, onClick: () => void Qe(async () => {
          var y;
          const de = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(_)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: _, expected_version: ((y = de.items[0]) == null ? void 0 : y.version) || 0, categories: X.payload.categories }) }), ne("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, X.id))
    ] })
  ] });
}
const ju = {}, zu = window.location.pathname.startsWith("/quality/b/"), qa = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), Nf = ju == null ? void 0 : ju.VITE_B_PLATFORM_MODE, Rt = qa || zu && (Nf === "true" || Nf !== "false" && !0);
function $i() {
  if (!zu && !qa) return window.location.pathname;
  const u = qa ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function kj(u) {
  qa ? window.history.pushState({}, "", "/quality/#/b" + u) : zu ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), qa && window.dispatchEvent(new Event("platform-route"));
}
async function Qt(u, h = {}) {
  if (!Rt) return fetch(u, h);
  if (!u.startsWith("/api/v1/") && !u.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const _ = new Headers(h.headers);
  _.delete("Authorization");
  const o = window.QaxcProjectId;
  qa && o && _.set("X-Project-ID", o);
  const T = (h.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(T)) {
    const V = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (V.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !V.ok) throw new Error(V.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const A = await V.json(), G = A.csrf_token ?? A.token;
    if (typeof G != "string" || !G) throw new Error("安全校验返回格式不正确。");
    _.set("X-CSRF-Token", G);
  }
  const U = await fetch("/quality/b" + u, { ...h, headers: _, credentials: "same-origin" });
  return U.status === 401 && window.dispatchEvent(new Event("b-session-expired")), U;
}
const Sf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, wf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, wu = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), Cj = (u) => ({
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
  clauses: [wu()]
}), Ra = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function vu(u, h) {
  var _;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((_ = u == null ? void 0 : u.roles) != null && _.includes("reviewer"));
}
function Ej({ api: u, projects: h, identity: _ }) {
  var ve, ht, ye;
  const [o, T] = r.useState(((ve = h[0]) == null ? void 0 : ve.id) || ""), [U, V] = r.useState([]), [A, G] = r.useState(null), [v, M] = r.useState(null), [K, k] = r.useState(!1), [se, fe] = r.useState(!1), [Ne, Se] = r.useState(!1), [Oe, he] = r.useState(""), [F, oe] = r.useState(""), [ne, H] = r.useState(""), [xe, Re] = r.useState(null), [Xe, Ze] = r.useState(0), [Qe, je] = r.useState(""), [We, X] = r.useState(!1), [de, y] = r.useState(""), [Q, le] = r.useState("current_rectification"), [Ce, m] = r.useState(""), [B, P] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [te, re] = r.useState(null), Z = r.useRef(crypto.randomUUID()), $ = r.useRef(0), Ae = h.find((E) => E.id === o), ce = vu(Ae, "knowledge.process"), Ee = vu(Ae, "knowledge.review"), ct = vu(Ae, "knowledge.publish"), lt = ce || Ee || ct;
  r.useEffect(() => {
    const E = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [K]), r.useEffect(() => {
    let E = !1;
    if (Se(!0), he(""), V([]), Re(null), !o) {
      Se(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(o)}&view=${lt ? "manage" : "published"}${ne ? "&cursor=" + encodeURIComponent(ne) : ""}`).then((w) => {
      E || (V(w.items), Re(w.next_cursor));
    }).catch((w) => {
      E || he(w.message);
    }).finally(() => {
      E || Se(!1);
    }), () => {
      E = !0;
    };
  }, [o, lt, ne, Xe]), r.useEffect(() => () => {
    $.current++;
  }, []);
  const et = async (E) => {
    fe(!0), he(""), oe("");
    try {
      await E();
    } catch (w) {
      he(w.message);
    } finally {
      fe(!1);
    }
  }, Be = () => {
    var E;
    k(!1), (E = window.QaxcClearPendingEdits) == null || E.call(window);
  }, De = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), Me = (E) => {
    M((w) => w && { ...w, ...E }), k(!0), Z.current = crypto.randomUUID();
  }, we = (E, w) => {
    v && Me({ clauses: v.clauses.map((I, _e) => _e === E ? { ...I, ...w } : I) });
  }, qe = async (E) => {
    if (!De()) return;
    const w = ++$.current;
    await et(async () => {
      const I = await u("/standards/" + E.id);
      w === $.current && (G(I), M(null), Be(), re(null), je(""), X(!1));
    });
  }, tt = () => {
    if (!A || !De()) return;
    const { id: E, version: w, row_version: I, state: _e, source_available: He, verified_on: at, history: rt, clauses: L, ...ie } = A;
    M({
      project_id: ie.project_id,
      code: ie.code,
      edition: ie.edition,
      title: ie.title,
      source_asset_id: ie.source_asset_id,
      valid_from: ie.valid_from,
      valid_until: ie.valid_until,
      scope: ie.scope,
      maintainer: ie.maintainer,
      expected_version: w,
      reason: "修订说明待填写",
      clauses: (L || []).map((ae) => Object.fromEntries(Object.keys(wu()).map((Le) => [Le, ae[Le]])))
    }), y("沿用已绑定原件；原文变化时请重新上传"), k(!0), Z.current = crypto.randomUUID();
  }, Ke = (E) => void et(async () => {
    if (!A) return;
    const w = await u(`/standards/${A.id}/actions`, { method: "POST", body: JSON.stringify({ action: E, row_version: A.row_version, reason: Qe, evidence_checked: We }) });
    G({ ...A, ...w }), Be(), Ze((I) => I + 1), oe(wf[E] + "成功。"), je(""), X(!1), A.source_available !== !1 && G(await u("/standards/" + A.id));
  }), dt = () => void et(async () => {
    if (!A) return;
    const E = await Qt(`/api/v1/standards/${A.id}/source`, { headers: { Authorization: `Bearer dev-${_}` } });
    if (!E.ok) {
      const He = await E.json();
      throw new Error(He.message || "原件不可用。");
    }
    const w = await E.blob(), I = URL.createObjectURL(w), _e = document.createElement("a");
    _e.href = I, _e.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), _e.click(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Oe && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Oe,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => Ze((E) => E + 1), children: "刷新列表" })
    ] }),
    F && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: F }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: se, value: o, onChange: (E) => {
          De() && ($.current++, T(E.target.value), G(null), M(null), k(!1), H(""), re(null));
        }, children: h.map((E) => /* @__PURE__ */ s.jsx("option", { value: E.id, children: E.name }, E.id)) })
      ] }),
      ce && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !o, onClick: () => {
        De() && (M(Cj(o)), G(null), y(""), k(!1), Z.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || Ne, onClick: () => Ze((E) => E + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    Ne ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !U.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        lt ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      U.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: E.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            E.code,
            " · ",
            E.edition,
            " · 修订 ",
            E.version,
            " · ",
            Sf[E.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            E.valid_from,
            "；",
            E.valid_until ? "自 " + E.valid_until + " 起不再适用" : "未登记废止日期",
            E.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void qe(E), children: "查看与核验" }),
        ct && E.source_available === !1 && ["published", "approved", "superseded"].includes(E.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => {
          G(E), M(null), X(!1), je("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, E.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ne || se, onClick: () => H(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !xe || se, onClick: () => H(xe || ""), children: "下一页" })
      ] })
    ] }) }),
    v && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (E) => {
      E.preventDefault(), et(async () => {
        if (!v.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...v, scope: Object.fromEntries(Object.entries(v.scope).map(([_e, He]) => [_e, Ra(He.join(`
`))])), clauses: v.clauses.map((_e) => ({
          ..._e,
          preconditions: Ra(_e.preconditions.join(`
`)),
          exceptions: Ra(_e.exceptions.join(`
`)),
          tables: Ra(_e.tables.join(`
`)),
          notes: Ra(_e.notes.join(`
`)),
          references: Ra(_e.references.join(`
`))
        })) }, I = await u("/standards", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify(w) });
        Be(), M(null), G(await u("/standards/" + I.id)), Ze((_e) => _e + 1), oe("规范草稿已保存，需核验后发布。");
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
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: v.title, onChange: (E) => Me({ title: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: v.code, readOnly: v.expected_version > 0, onChange: (E) => Me({ code: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: v.edition, readOnly: v.expected_version > 0, onChange: (E) => Me({ edition: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: v.maintainer, onChange: (E) => Me({ maintainer: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: v.valid_from, onChange: (E) => Me({ valid_from: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: v.valid_until || "", onChange: (E) => Me({ valid_until: E.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (E) => {
            var I;
            const w = (I = E.target.files) == null ? void 0 : I[0];
            w && et(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const _e = await u(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              Me({ source_asset_id: _e.asset_id }), y(w.name), oe("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: de || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: v.scope[E].join(`
`), onChange: (I) => Me({ scope: { ...v.scope, [E]: I.target.value.split(`
`) } }) })
          ] }, E)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        v.clauses.map((E, w) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            w + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: E.number, onChange: (I) => we(w, { number: I.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: E.chapter, onChange: (I) => we(w, { chapter: I.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: E.parent_number || "", onChange: (I) => we(w, { parent_number: I.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: E.page || "", onChange: (I) => we(w, { page: I.target.value ? Number(I.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: E.locator, onChange: (I) => we(w, { locator: I.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: E.text, onChange: (I) => we(w, { text: I.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([I, _e]) => /* @__PURE__ */ s.jsxs("label", { children: [
              _e,
              /* @__PURE__ */ s.jsx("textarea", { value: E[I].join(`
`), onChange: (He) => we(w, { [I]: He.target.value.split(`
`) }) })
            ] }, I))
          ] }),
          v.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => Me({ clauses: v.clauses.filter((I, _e) => _e !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: v.clauses.length >= 200, onClick: () => Me({ clauses: [...v.clauses, wu()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: v.reason, onChange: (E) => Me({ reason: E.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !v.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          De() && (M(null), k(!1));
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
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || A.source_available === !1, onClick: dt, children: "下载核对原件" }),
          ce && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !A.clauses, onClick: tt, children: "以此版本修订" })
        ] }),
        (ht = A.clauses) == null ? void 0 : ht.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("h4", { children: [
            E.number,
            " · ",
            E.chapter
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "父条号：",
            E.parent_number || "无",
            "；",
            E.page ? "第 " + E.page + " 页；" : "",
            E.locator
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: E.text }),
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, I]) => E[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: I }),
            E[w].map((_e, He) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: _e }, He))
          ] }, w))
        ] }, E.number)),
        A.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Q, onChange: (E) => {
              le(E.target.value), re(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Q === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ce, onChange: (E) => {
              m(E.target.value), re(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: B[E], onChange: (I) => {
              P({ ...B, [E]: I.target.value }), re(null);
            } })
          ] }, E)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void et(async () => {
            re(await u(`/standards/${A.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Q, event_date: Ce || null, ...B }) }));
          }), children: "核对条件" }),
          te && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[te.status] }),
            te.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              te.missing.map((E) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[E] || E).join("、")
            ] }),
            te.reasons.map((E) => /* @__PURE__ */ s.jsx("p", { children: E }, E)),
            /* @__PURE__ */ s.jsx("p", { children: te.note })
          ] })
        ] }),
        lt && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: se, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Qe, maxLength: 2e3, onChange: (E) => je(E.target.value) })
          ] }),
          A.state === "pending_review" && Ee && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: We, onChange: (E) => X(E.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            A.state === "draft" && ce && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Qe.trim(), onClick: () => Ke("submit"), children: "提交审核" }),
            A.state === "pending_review" && Ee && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Qe.trim() || !We, onClick: () => Ke("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Qe.trim(), onClick: () => Ke("request_changes"), children: "退回修改" })
            ] }),
            A.state === "approved" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Qe.trim(), onClick: () => Ke("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(A.state) && ct && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Qe.trim(), onClick: () => Ke("withdraw"), children: "撤回此版本" })
          ] }),
          A.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (ye = A.history) == null ? void 0 : ye.map((E, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            wf[E.action] || E.action,
            " · ",
            E.reason,
            " · ",
            new Date(E.created_at).toLocaleString("zh-CN")
          ] }, w))
        ] })
      ] })
    ] })
  ] });
}
const Ha = { kind: "asset", id: "", quote: "", locator: "" }, $f = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ha] }, Wf = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Ff = { text: "", nature: "fact", evidence: [Ha] }, If = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ha] }, Oj = { name: "", value: null, evidence: [Ha] }, kf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Wf] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [$f] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Ff], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [If], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ha, kind: "work" }], historical_case_ids: [] }
}, Tj = { evidence: Ha, records: $f, categories: Wf, claims: Ff, steps: If, parameters: Oj }, Ua = {
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
}, zj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function sc({ value: u, onChange: h, catalog: _, name: o = "", path: T = "content", readonly: U = !1 }) {
  var v;
  const V = Ua[o] || o;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((M, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(sc, { value: M, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: T + "." + K, catalog: _, readonly: U, onChange: (k) => h(u.map((se, fe) => fe === K ? k : se)) }),
      !U && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, se) => K !== se)), children: "移除" })
    ] }, K)),
    !U && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(Tj[o] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([M, K]) => M === "kind" && T === "content" ? null : /* @__PURE__ */ s.jsx(sc, { name: M, value: K, path: T + "." + M, catalog: _, readonly: U, onChange: (k) => {
    const se = { ...u, [M]: k };
    M === "type" && ["judgment", "case"].includes(String(k)) && (se.options = {}), M === "kind" && "id" in u && (se.id = ""), h(se);
  } }, M)) });
  let A = zj[o];
  o === "kind" && (A = T.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (A = T.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const G = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in G || o === "historical_case_id") && (A = _.filter((M) => o in G ? M.work_kind === G[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(M.work_kind || "") : !0).map((M) => [M.id, M.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: T, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    U ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((v = A == null ? void 0 : A.find((M) => M[0] === String(u))) == null ? void 0 : v[1]) || String(u ?? "待填") }) : A ? /* @__PURE__ */ s.jsxs("select", { id: T, value: String(u ?? ""), onChange: (M) => h(M.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      A.map(([M, K]) => /* @__PURE__ */ s.jsx("option", { value: M, children: K }, M))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: T, type: "date", value: String(u ?? ""), onChange: (M) => h(M.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: T, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(u ?? ""), onChange: (M) => h(M.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : M.target.value) })
  ] });
}
const Cf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, Ef = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function Aj({ api: u, projects: h, identity: _ }) {
  var E;
  const [o, T] = r.useState(((E = h[0]) == null ? void 0 : E.id) || ""), [U, V] = r.useState("hazard"), [A, G] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState(null), [se, fe] = r.useState(null), [Ne, Se] = r.useState(""), [Oe, he] = r.useState(!1), [F, oe] = r.useState(""), [ne, H] = r.useState(""), [xe, Re] = r.useState(!1), [Xe, Ze] = r.useState(!1), [Qe, je] = r.useState(0), [We, X] = r.useState(null), [de, y] = r.useState(""), [Q, le] = r.useState(null), [Ce, m] = r.useState(null), [B, P] = r.useState(null), [te, re] = r.useState(null), Z = r.useRef(crypto.randomUUID()), $ = r.useRef(0), Ae = r.useRef(!1), ce = h.find((w) => w.id === o), Ee = (w) => {
    var I, _e;
    return ce != null && ce.permissions ? ce.permissions.includes(w) : w.startsWith("training.") ? !!((I = ce == null ? void 0 : ce.roles) != null && I.some((He) => ["admin", "teacher"].includes(He))) : w === "knowledge.process" ? !!(ce != null && ce.can_run) : !!(ce != null && ce.can_manage) || !!((_e = ce == null ? void 0 : ce.roles) != null && _e.includes("reviewer"));
  }, ct = Ee(U === "question" ? "training.manage" : "knowledge.process"), lt = Ee(U === "question" ? "training.review" : "knowledge.review"), et = Ee(U === "question" ? "training.review" : "knowledge.publish"), Be = ct || lt || et, De = () => {
    var w;
    Ae.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, Me = () => !Ae.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (I) => {
      Ae.current && (I.preventDefault(), I.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Ze(!0), G([]), oe(""), !o) {
      Ze(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(o)}&kind=${U}&view=${Be ? "manage" : "published"}${de ? "&cursor=" + encodeURIComponent(de) : ""}`).then((I) => {
      w || (G(I.items), X(I.next_cursor));
    }).catch((I) => {
      w || oe(I.message);
    }).finally(() => {
      w || Ze(!1);
    }), Be && u(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((I) => {
      w || M(I.items);
    }).catch((I) => {
      w || oe(I.message);
    }), U === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((I) => {
      w || le(I);
    }).catch((I) => {
      w || oe(I.message);
    }), () => {
      w = !0;
    };
  }, [o, U, de, Be, Qe]), r.useEffect(() => () => {
    $.current++;
  }, []);
  const we = async (w) => {
    Re(!0), oe(""), H("");
    try {
      await w();
    } catch (I) {
      oe(I.message);
    } finally {
      Re(!1);
    }
  }, qe = () => {
    $.current++, k(null), fe(null), m(null), P(null), re(null), y(""), Se(""), he(!1), De();
  }, tt = async (w) => {
    if (!Me()) return;
    const I = ++$.current;
    await we(async () => {
      const _e = await u("/workflows/" + w.id);
      I === $.current && (k(_e), fe(null), Se(""), he(!1), P(null), re(null), De());
    });
  }, Ke = (w) => {
    fe((I) => I && { ...I, ...w }), Ae.current = !0, Z.current = crypto.randomUUID();
  }, dt = () => we(async () => {
    if (!se) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify({ ...se, project_id: o, reason: Ne }) });
    k(w), fe(null), De(), je((I) => I + 1), H("已保存新版本，尚未审核发布。");
  }), ve = (w, I) => we(async () => {
    const _e = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: I, row_version: w.row_version, reason: Ne, evidence_checked: Oe }) });
    k(I === "withdraw" ? null : await u("/workflows/" + _e.id)), je((He) => He + 1), De(), H(Ef[I] + "已完成");
  }), ht = (w) => we(async () => {
    const I = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(w)}&limit=100`);
    m(I.items);
  }), ye = () => we(async () => {
    if (!K) return;
    const w = await Qt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + _ } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const I = URL.createObjectURL(await w.blob()), _e = document.createElement("a");
    _e.href = I, _e.download = K.title + ".docx", _e.click(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: xe, onChange: (w) => {
          Me() && (qe(), T(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: () => je((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(kf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: xe, className: "button " + (U === w ? "primary" : "ghost"), onClick: () => {
      Me() && (qe(), V(w));
    }, children: Ua[w] }, w)) }),
    F && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: F }),
    ne && /* @__PURE__ */ s.jsx("p", { role: "status", children: ne }),
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
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Q.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: xe, onClick: () => ht(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      Ce && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        Ce.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => tt(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Ua[U],
          "清单"
        ] }),
        ct && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: xe, onClick: () => {
          Me() && (qe(), fe({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(kf[U]) }), Ae.current = !0, Z.current = crypto.randomUUID());
        }, children: [
          "新建",
          Ua[U]
        ] })
      ] }),
      Xe ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : A.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Ua[U],
        "。",
        ct ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: A.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: xe || w.source_available === !1, onClick: () => tt(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          Cf[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        et && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => ve(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        de && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(""), children: "首页" }),
        We && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(We), children: "下一页" })
      ] })
    ] }),
    se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Ua[U],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: xe, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: se.title, onChange: (w) => Ke({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(sc, { value: se.content, catalog: v, onChange: (w) => Ke({ content: w }) })
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
        ct && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: () => {
          fe({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), Ae.current = !0, Z.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: ye, children: "导出Word" }),
        Ee("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => we(async () => {
          P((await u(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        U === "guide" && K.state === "published" && Ee("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => we(async () => re(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        U === "question" && K.state === "published" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe, onClick: () => we(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), H("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      B && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        B.length ? B.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      te && /* @__PURE__ */ s.jsx("ul", { children: te.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(sc, { value: K.content, catalog: v, readonly: !0, onChange: () => {
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
    Be && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: Ne, onChange: (w) => Se(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      se ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim() || !se.title.trim(), onClick: dt, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Oe, onChange: (w) => he(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && ct && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim(), onClick: () => ve(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && lt && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Oe || !Ne.trim(), onClick: () => ve(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => ve(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && et && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim(), onClick: () => ve(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && et && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => ve(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const Of = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Rj({ id: u, identity: h, projects: _, navigate: o }) {
  const [T, U] = r.useState(null), [V, A] = r.useState(""), [G, v] = r.useState(!1), [M, K] = r.useState(""), [k, se] = r.useState(0), fe = `a-import-action:${h}:${u}`;
  async function Ne(he, F) {
    const oe = await Qt("/integration/v1/a-imports/" + u + he, F), ne = await oe.json().catch(() => ({}));
    if (!oe.ok)
      throw oe.status >= 400 && oe.status < 500 && sessionStorage.removeItem(fe), new Error(ne.message || `请求未完成（${oe.status}），请刷新查看最新状态。`);
    return ne;
  }
  r.useEffect(() => {
    let he = !1;
    async function F() {
      try {
        const ne = await Ne("");
        he || (U(ne), A(""));
      } catch (ne) {
        he || (U(null), A(ne.message));
      }
    }
    U(null), F();
    const oe = window.setInterval(F, 3e3);
    return () => {
      he = !0, clearInterval(oe);
    };
  }, [u, k, h]);
  const Se = (he) => {
    var F, oe;
    return !!T && !!((oe = (F = _.find((ne) => ne.id === T.project_id)) == null ? void 0 : F.permissions) != null && oe.includes(he));
  };
  async function Oe(he) {
    if (!(!T || G)) {
      v(!0), A("");
      try {
        const F = sessionStorage.getItem(fe), oe = F ? JSON.parse(F) : { operation: he, key: crypto.randomUUID(), body: { expected_version: T.version, ...he === "withdraw" ? { reason: M.trim() } : {} } };
        if (oe.operation !== he) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(fe, JSON.stringify(oe)), await Ne("/" + he, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": oe.key }, body: JSON.stringify(oe.body) }), sessionStorage.removeItem(fe), se((ne) => ne + 1);
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
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => se((he) => he + 1), disabled: G, children: "刷新状态" })
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
          /* @__PURE__ */ s.jsx("ul", { children: T.warnings.map((he, F) => /* @__PURE__ */ s.jsx("li", { children: he.message }, he.code + ":" + F)) })
        ] }),
        T.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          T.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          T.capabilities.can_view_materials && T.receipt_id && Se("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + T.receipt_id), children: "查看原始资料" }),
          T.capabilities.can_generate_retrospective && Se("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: G, onClick: () => void Oe("retrospectives"), children: T.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          T.retrospective_id && T.status !== "withdrawn" && Se("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + T.retrospective_id), children: "查看复盘" }),
          (T.status === "failed" || T.retrospective_status === "failed") && Se("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: G, onClick: () => void Oe("retry"), children: "重试失败任务" })
        ] }),
        T.status !== "withdrawn" && Se("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: M, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (he) => K(he.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: G || !M.trim(), onClick: () => void Oe("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Dj({ navigate: u }) {
  const [h, _] = r.useState([]), [o, T] = r.useState(""), [U, V] = r.useState(!1);
  return r.useEffect(() => {
    let A = !1;
    return (async () => {
      try {
        const [G, v, M] = await Promise.all([Qt("/api/v1/health"), Qt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!G.ok || !v.ok || !M.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, se] = await Promise.all([G.json(), v.json(), M.json()]), fe = window.QaxcProjectId, Ne = se.tasks.filter((Se) => !fe || Se.projectId === fe).flatMap((Se) => (Se.events || []).map((Oe) => ({ id: Oe.id, action: Se.title + " · " + Oe.action, project_id: Se.projectId, created_at: Oe.uploadedAt, source: "现场作业" })));
        A || (V(K.worker_online), _([...Ne, ...k.items.map((Se) => ({ ...Se, source: "知识与学习" }))].sort((Se, Oe) => Date.parse(Oe.created_at) - Date.parse(Se.created_at)).slice(0, 100)));
      } catch (G) {
        A || T(G.message);
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
function Uj({ deliveryId: u, navigate: h }) {
  const [_, o] = r.useState(!1), [T, U] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function A(v, M, K) {
    const k = await Qt("/api/v1" + v, { method: M ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: M ? JSON.stringify(M) : void 0 }), se = await k.json();
    if (!k.ok) throw Error(se.message || "处理失败，请重试");
    return se;
  }
  async function G() {
    if (_) return;
    o(!0);
    const v = "archive-review:" + u, M = sessionStorage.getItem(v) || crypto.randomUUID();
    sessionStorage.setItem(v, M);
    try {
      U("正在核验归档成果…");
      const K = await A("/platform-archives", { delivery_id: u }, M);
      for (let k = 0; k < 60 && V.current; k++) {
        const se = await A("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (se.status === "ready") {
          U("证据已校验，正在生成复盘…");
          const fe = await A("/retrospectives", { mode: "task_process", task_package_id: se.id });
          V.current && h("/retrospectives/" + fe.id);
          return;
        }
        if (["failed", "withdrawn"].includes(se.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        U("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((fe) => setTimeout(fe, 1e3));
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
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: _, onClick: () => void G(), children: "生成 / 打开复盘" }),
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
const Mj = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), qj = (u) => u.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (h, _, o) => o ? o.toUpperCase() : _.toLowerCase()
), Tf = (u) => {
  const h = qj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, Pf = (...u) => u.filter((h, _, o) => !!h && h.trim() !== "" && o.indexOf(h) === _).join(" ").trim(), Hj = (u) => {
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
var Bj = {
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
const Lj = r.forwardRef(
  ({
    color: u = "currentColor",
    size: h = 24,
    strokeWidth: _ = 2,
    absoluteStrokeWidth: o,
    className: T = "",
    children: U,
    iconNode: V,
    ...A
  }, G) => r.createElement(
    "svg",
    {
      ref: G,
      ...Bj,
      width: h,
      height: h,
      stroke: u,
      strokeWidth: o ? Number(_) * 24 / Number(h) : _,
      className: Pf("lucide", T),
      ...!U && !Hj(A) && { "aria-hidden": "true" },
      ...A
    },
    [
      ...V.map(([v, M]) => r.createElement(v, M)),
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
  const _ = r.forwardRef(
    ({ className: o, ...T }, U) => r.createElement(Lj, {
      ref: U,
      iconNode: h,
      className: Pf(
        `lucide-${Mj(Tf(u))}`,
        `lucide-${u}`,
        o
      ),
      ...T
    })
  );
  return _.displayName = Tf(u), _;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], zf = _t("activity", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Af = _t("arrow-left", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], Al = _t("arrow-right", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], lc = _t("book-open", Qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Vj = _t("chevron-down", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], il = _t("chevron-right", Jj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], $j = _t("chevron-up", Kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Rl = _t("circle-alert", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Dl = _t("circle-check", Fj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ij = [
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
], Pj = _t("clipboard-list", Ij);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], pu = _t("database", ev);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tv = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Rf = _t("download", tv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sv = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], lv = _t("external-link", sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], Hn = _t("file-check-2", av);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], Df = _t("file-input", nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iv = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], gu = _t("file-search", iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cv = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Wi = _t("folder-lock", cv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rv = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], uv = _t("history", rv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ov = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
], dv = _t("image", ov);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hv = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Uf = _t("layout-dashboard", hv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Mf = _t("loader-circle", fv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mv = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
], xv = _t("pencil", mv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], qf = _t("play", jv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vv = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], pv = _t("plus", vv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Xs = _t("refresh-cw", gv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], yv = _t("search", bv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _v = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Hf = _t("shield-check", _v);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nv = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], em = _t("upload", Nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sv = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], wv = _t("users", Sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Pi = _t("x", kv), Ms = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, Dn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Bf = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Lf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], _ = (o) => h.includes(o) ? h.indexOf(o) : 100;
  return Object.entries(u).sort(([o], [T]) => _(o) - _(T));
}, bu = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function Cv({ asset: u, identity: h }) {
  const [_, o] = r.useState(""), [T, U] = r.useState("");
  return r.useEffect(() => {
    let V = !1, A = "";
    return Qt(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (G) => {
      if (!G.ok) throw new Error("图片不可访问或已撤回");
      return G.blob();
    }).then((G) => {
      A = URL.createObjectURL(G), V ? URL.revokeObjectURL(A) : o(A);
    }).catch((G) => {
      V || U(G.message);
    }), () => {
      V = !0, A && URL.revokeObjectURL(A);
    };
  }, [u, h]), T ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: T }) : _ ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: _, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function Ev({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var ut, Nt;
  const [U, V] = r.useState([]), [A, G] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState([]), [se, fe] = r.useState("reports"), Ne = r.useRef(0), [Se, Oe] = r.useState(""), [he, F] = r.useState([]), [oe, ne] = r.useState(null), [H, xe] = r.useState(""), [Re, Xe] = r.useState(!1), [Ze, Qe] = r.useState([]), [je, We] = r.useState({}), [X, de] = r.useState(0), [y, Q] = r.useState(null), [le, Ce] = r.useState(null), [m, B] = r.useState(null), [P, te] = r.useState(new URLSearchParams(location.search).get("source") || ""), [re, Z] = r.useState(""), [$, Ae] = r.useState(!1), [ce, Ee] = r.useState(""), [ct, lt] = r.useState(""), [et, Be] = r.useState(!0), [De, Me] = r.useState(!1), [we, qe] = r.useState(0), [tt, Ke] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [dt, ve] = r.useState(""), [ht, ye] = r.useState(null), [E, w] = r.useState([]), [I, _e] = r.useState(""), [He, at] = r.useState(0), [rt, L] = r.useState(!1), [ie, ae] = r.useState("csv"), [Le, b] = r.useState(""), [ge, pe] = r.useState(""), [Ye, nt] = r.useState(((ut = o.find((g) => g.can_run)) == null ? void 0 : ut.id) || (Rt ? "" : "demo-airport")), D = o.some((g) => g.can_run), x = h.startsWith("/records/"), ue = h.startsWith("/imports/") && h !== "/imports/new", be = U.find((g) => g.id === P), st = A.filter((g) => g.kind === (be == null ? void 0 : be.kind) && g.project_id === (be == null ? void 0 : be.project_id));
  r.useEffect(() => {
    ve(""), w([]), _e(""), at(0), Ee(""), lt(""), B(null);
  }, [h]), r.useEffect(() => {
    let g = !1;
    Be(!0), Ee(""), Ce(null), Q(null);
    const ke = new URLSearchParams(Object.entries(tt).filter(([, pt]) => !!pt));
    ke.set("limit", "15"), dt && ke.set("cursor", dt);
    async function it() {
      try {
        const [pt, j] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (g) return;
        if (V(pt.items), G(j.items), h === "/sources" || h === "/imports") {
          const Te = await u("/imports?limit=15" + (dt ? "&cursor=" + encodeURIComponent(dt) : ""));
          if (g) return;
          M(Te.items), ye(Te.next_cursor);
        } else if (ue) {
          const Te = await u(`${h}?after_row=${He}&only_issues=${rt}`);
          g || Q(Te);
        } else if (x) {
          const Te = await u(h + (I ? "?version=" + I : ""));
          g || Ce(Te);
        } else if (h === "/records") {
          const Te = await u("/records?" + ke);
          if (g) return;
          if (Qe(Te.items), ye(Te.next_cursor), We(Te.totals_by_kind), de(Te.detail_groups_after_confirmed_links), se === "reports") {
            const ze = new URLSearchParams(ke);
            ze.delete("cursor"), dt && ze.set("after_id", dt);
            const Pe = await u("/reports?" + ze);
            if (g) return;
            k(Pe.items), ye(Pe.next_cursor);
          }
        }
      } catch (pt) {
        g || Ee(pt.message);
      } finally {
        g || Be(!1);
      }
    }
    return it(), () => {
      g = !0;
    };
  }, [h, tt, dt, I, we, He, rt, se]), r.useEffect(() => {
    if (!ue || !y || !["queued", "running"].includes(y.status)) return;
    let g = !1;
    const ke = setInterval(() => {
      u(`${h}?after_row=${He}&only_issues=${rt}`).then((it) => {
        g || Q(it);
      }).catch((it) => {
        g || Ee(it.message);
      });
    }, 1500);
    return () => {
      g = !0, clearInterval(ke);
    };
  }, [h, y == null ? void 0 : y.status, He, rt]), r.useEffect(() => {
    Ne.current++, Oe(""), F([]), ne(null), xe("");
  }, [tt, se, h]);
  const N = async (g, ke = !1) => {
    const it = ++Ne.current;
    if (!ke && Se === g) {
      Oe(""), Xe(!1);
      return;
    }
    ke || (F([]), ne(null)), Oe(g), Xe(!0), xe("");
    const pt = new URLSearchParams(Object.entries(tt).filter(([, j]) => !!j));
    pt.set("document_id", g), pt.set("limit", "15"), ke && oe && pt.set("cursor", oe);
    try {
      const j = await u("/records?" + pt);
      if (it !== Ne.current) return;
      F((Te) => ke ? [...Te, ...j.items] : j.items), ne(j.next_cursor);
    } catch (j) {
      it === Ne.current && xe(j.message);
    } finally {
      it === Ne.current && Xe(!1);
    }
  }, me = async (g) => {
    Me(!0), Ee(""), lt("");
    try {
      await g();
    } catch (ke) {
      Ee(ke.message);
    } finally {
      Me(!1);
    }
  }, Ve = () => me(async () => {
    for (const g of o.filter((ke) => ke.can_run))
      for (const ke of g.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const it = `mock-${g.id}-${ke}`;
        U.some((pt) => pt.namespace === it && pt.project_id === g.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${g.id === "demo-airport" ? "机场" : "地铁"} · ${Ms[ke]}（模拟）`, namespace: it, kind: ke, project_id: g.id, mapping_template: ke === "governance_export" ? "governance-v1" : `${ke}-v1` }) });
      }
    lt("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), qe((g) => g + 1);
  }), kt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !E.length, onClick: () => {
        ve(E.at(-1) || ""), w(E.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !ht, onClick: () => {
        w([...E, dt]), ve(ht || "");
      }, children: "下一页" })
    ] })
  ] }), Lt = (g, ke) => {
    Ke({ ...tt, [g]: ke }), ve(""), w([]);
  }, qt = (g) => me(async () => {
    const ke = await Qt(`/api/v1/assets/${g}/content`, { headers: { Authorization: `Bearer dev-${T}` } });
    if (!ke.ok) {
      const j = await ke.json();
      throw new Error(j.message);
    }
    const it = URL.createObjectURL(await ke.blob()), pt = document.createElement("a");
    pt.href = it, pt.download = "来源文件", pt.click(), URL.revokeObjectURL(it);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(pu, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ce && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      ce,
      /* @__PURE__ */ s.jsx("button", { onClick: () => qe((g) => g + 1), children: "重新加载" })
    ] }),
    ct && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      ct
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => _("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => _("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => _("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => qe((g) => g + 1), disabled: et, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    et ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: De || !D, onClick: () => void Ve(), children: [
          /* @__PURE__ */ s.jsx(pu, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: U.map((g) => {
        var ke, it;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(pu, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ms[g.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: g.name }),
          /* @__PURE__ */ s.jsx("p", { children: (ke = o.find((pt) => pt.id === g.project_id)) == null ? void 0 : ke.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Bf(g.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((it = o.find((pt) => pt.id === g.project_id)) != null && it.can_run), onClick: () => {
            te(g.id), Z(""), _("/imports/new?source=" + g.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(Al, { size: 16 })
          ] })
        ] }, g.id);
      }) }),
      !U.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(gu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      D && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Rt || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Le, onChange: (g) => b(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: ge, onChange: (g) => pe(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: ie, onChange: (g) => ae(g.target.value), children: ["csv", "excel", "governance_export"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Ms[g] }, g)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Ye, onChange: (g) => nt(g.target.value), children: o.filter((g) => g.can_run).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: De || !Le || !ge, onClick: () => void me(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Le, namespace: ge, kind: ie, project_id: Ye, mapping_template: ie === "governance_export" ? "governance-v1" : `${ie}-v1` }) }), qe((g) => g + 1), lt("来源已创建。");
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
                te(g.target.value), Z(""), B(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                U.filter((g) => {
                  var ke;
                  return (ke = o.find((it) => it.id === g.project_id)) == null ? void 0 : ke.can_run;
                }).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: re, onChange: (g) => {
                Z(g.target.value), B(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                st.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.asset_id, children: g.label }, g.asset_id))
              ] })
            ] })
          ] }),
          !Rt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $, onChange: (g) => Ae(g.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Rt && be && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: De, accept: be.kind === "csv" ? ".csv" : be.kind === "excel" ? ".xlsx" : ".json", onChange: (g) => {
                var it;
                const ke = (it = g.target.files) == null ? void 0 : it[0];
                g.target.value = "", ke && me(async () => {
                  if (ke.size > 5e6) throw new Error("文件不能超过5MB");
                  const pt = new Uint8Array(await ke.arrayBuffer());
                  let j = "";
                  for (let ze = 0; ze < pt.length; ze += 8192) j += String.fromCharCode(...pt.subarray(ze, ze + 8192));
                  const Te = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: be.project_id, kind: be.kind, name: ke.name, base64: btoa(j) }) });
                  G((ze) => [...ze, Te]), Z(Te.asset_id), B(null), lt("文件已上传，请预览字段与异常后提交接入。");
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
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: De || !P || !re, onClick: () => void me(async () => {
            B(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: P, input_asset_id: re }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(gu, { size: 16 }),
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
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(m.mapping).map(([g, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: ke }),
            /* @__PURE__ */ s.jsx(Al, { size: 13 }),
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
              /* @__PURE__ */ s.jsx("td", { children: bu(g.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: Ms[String(g.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...g.errors, ...g.issues].join("；") || "通过" })
            ] }, g.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: De, onClick: () => void me(async () => {
              const g = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: P, input_asset_id: re, input_hash: m.input_hash, fail_after: !Rt && $ ? 2 : null }) });
              _("/imports/" + g.id);
            }), children: [
              /* @__PURE__ */ s.jsx(em, { size: 16 }),
              De ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !D, onClick: () => _("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(Al, { size: 15 })
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
          /* @__PURE__ */ s.jsx("td", { children: Dn[g.status] }),
          ["created", "updated", "skipped", "failed"].map((ke) => /* @__PURE__ */ s.jsx("td", { children: g.counts[ke] }, ke)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/imports/" + g.id), children: "查看历史项目" }) })
        ] }, g.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      kt
    ] }) : ue && y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/imports"), children: [
        /* @__PURE__ */ s.jsx(Af, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Dn[y.status] }),
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
        y.job_status === "failed" && ((Nt = o.find((g) => g.id === y.source.project_id)) == null ? void 0 : Nt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: De, onClick: () => void me(async () => {
          await u(`/jobs/${y.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: y.row_version }) }), qe((g) => g + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Xs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      y.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: y.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: g === "failed" ? "失败行" : Dn[g] }),
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
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(y.counts.kinds || {}).map(([g, ke]) => `${Ms[g]} ${ke}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: rt, onChange: (g) => {
              L(g.target.checked), at(0);
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
            /* @__PURE__ */ s.jsx("td", { children: g.outcome === "failed" ? "失败" : Dn[g.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: g.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: g.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.record_id), children: "查看证据" }) })
          ] }, g.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !He, onClick: () => at(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !y.next_row, onClick: () => at(y.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            Ms[g],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: je[g] || 0 })
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: tt.project_id, onChange: (g) => Lt("project_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: tt.source_id, onChange: (g) => Lt("source_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              U.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: tt.record_kind, onChange: (g) => Lt("record_kind", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Ms[g] }, g))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: tt.quality_status, onChange: (g) => Lt("quality_status", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: tt.from_date, onChange: (g) => Lt("from_date", g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: tt.to_date, onChange: (g) => Lt("to_date", g.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "reports", onClick: () => {
            fe("reports"), ve(""), w([]), Oe("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "rows", onClick: () => {
            fe("rows"), ve(""), w([]);
          }, children: "逐条数据" })
        ] }),
        se === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((g) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": Se === g.id, onClick: () => void N(g.id), children: [
            /* @__PURE__ */ s.jsx(gu, { size: 20 }),
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
            /* @__PURE__ */ s.jsx(Al, { size: 16 })
          ] }),
          Se === g.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            H && /* @__PURE__ */ s.jsx("p", { role: "alert", children: H }),
            Re ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : he.map((ke) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + ke.id), children: ke.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                Ms[ke.record_kind],
                " · v",
                ke.current_version
              ] })
            ] }, ke.id)),
            oe && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Re, onClick: () => void N(g.id, !0), children: "加载更多风险数据" })
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
            var ke;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + g.id), children: g.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (ke = U.find((it) => it.id === g.source_id)) == null ? void 0 : ke.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Ms[g.record_kind] }),
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
        kt
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : x && le ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/records"), children: [
        /* @__PURE__ */ s.jsx(Af, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            Ms[le.record_kind],
            " · ",
            Rt ? "来源记录" : "模拟记录"
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
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: le.selected_version, onChange: (g) => _e(g.target.value), children: le.versions.map((g) => /* @__PURE__ */ s.jsxs("option", { value: g.version, children: [
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
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Lf(le.raw_fields).map(([g, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: bu(ke) })
          ] }, g)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Lf(le.effective_fields).map(([g, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: bu(ke) })
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
          var ke;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Ms[g.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: g.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(g.locator) }),
            g.type !== "source_row" && g.asset_id ? /* @__PURE__ */ s.jsx(Cv, { asset: g.asset_id, identity: T }) : g.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            g.asset_id && ((ke = o.find((it) => it.id === le.project_id)) == null ? void 0 : ke.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: De, onClick: () => void qt(g.asset_id), children: "下载对应来源文件" })
          ] }, g.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        le.links.length ? le.links.map((g) => {
          var ke;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Dn[g.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.other_record_id), children: "打开另一条记录" }),
            ((ke = o.find((it) => it.id === le.project_id)) == null ? void 0 : ke.roles.some((it) => ["admin", "reviewer"].includes(it))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: De || g.review_state === "stale", onClick: () => void me(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "confirmed" }) }), qe((it) => it + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: De || g.review_state === "stale", onClick: () => void me(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "rejected" }) }), qe((it) => it + 1);
              }), children: "排除" })
            ] })
          ] }, g.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ce ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const cl = "/history-review", Ln = "/history-reader", tm = "historyReview.visibleColumnsV2", sm = "historyReview.columnOrder", ec = "historyReview.columnWidths", lm = "historyReview.pageSize", am = [20, 30, 50, 100, 200], nm = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], Un = ["_photos", "_source", "_status", "_actions"], yu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], Au = { _actions: "操作", _photos: "照片", _source: "来源报告", _status: "状态" }, tc = Object.keys(Au), im = [...nm, "_photos", "_source", "_status", "_actions"], ac = [...nm, "_photos", "_source", "_actions"], Ov = {
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
}, Tv = { save_draft: "保存草稿", confirm: "批量确认", discard: "放弃修改", conflict: "值冲突" };
function zv() {
  try {
    const u = localStorage.getItem(tm), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((_) => typeof _ == "string") : ac;
  } catch {
    return ac;
  }
}
function Av() {
  try {
    const u = Number(localStorage.getItem(lm));
    return am.includes(u) ? u : 30;
  } catch {
    return 30;
  }
}
function Rv() {
  try {
    const u = localStorage.getItem(ec), h = u ? JSON.parse(u) : null;
    if (h && typeof h == "object") {
      const _ = {};
      for (const [o, T] of Object.entries(h))
        typeof T == "number" && T >= 56 && T <= 1e3 && (_[o] = T);
      return _;
    }
  } catch {
  }
  return {};
}
function Dv() {
  try {
    const u = localStorage.getItem(sm), h = u ? JSON.parse(u) : null;
    if (Array.isArray(h) && h.length) return h.filter((_) => typeof _ == "string");
  } catch {
  }
  return im;
}
function Uv(u, h) {
  const _ = u.filter((T) => h.includes(T) || tc.includes(T));
  let o = _.findIndex((T) => tc.includes(T));
  o < 0 && (o = _.length);
  for (const T of h)
    _.includes(T) || (_.splice(o, 0, T), o += 1);
  for (const T of tc) {
    if (_.includes(T)) continue;
    const U = _.indexOf("_actions");
    U >= 0 ? _.splice(U, 0, T) : _.push(T);
  }
  return _;
}
function Kt(u, h = 120) {
  const _ = (u || "").replace(/\s+/g, " ").trim();
  return _.length > h ? _.slice(0, h) + "…" : _ || "—";
}
function Il(u, h) {
  var _;
  return Au[h] || ((_ = u.find((o) => o.key === h)) == null ? void 0 : _.label) || h;
}
function Yf(u, h) {
  return u ? Object.entries(u).map(([_, o]) => `${Il(h, _)}：${Kt(o, 30)}`).join("；") : "—";
}
function ku({ id: u }) {
  const [h, _] = r.useState(""), [o, T] = r.useState("");
  return r.useEffect(() => {
    let U = !1, V = "";
    return Qt("/api/v1" + Ln + "/images/" + encodeURIComponent(u)).then(async (A) => {
      if (!A.ok) throw Error("图片暂不可用");
      return A.blob();
    }).then((A) => {
      V = URL.createObjectURL(A), U ? URL.revokeObjectURL(V) : _(V);
    }).catch((A) => {
      U || T(A.message);
    }), () => {
      U = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function Gf({ api: u, findingId: h, large: _ = !1 }) {
  const [o, T] = r.useState(null), [U, V] = r.useState("");
  return r.useEffect(() => {
    let A = !1;
    return T(null), V(""), u(Ln + "/findings/" + encodeURIComponent(h)).then((G) => {
      A || T(G.images);
    }).catch((G) => {
      A || (V(G.message), T([]));
    }), () => {
      A = !0;
    };
  }, [u, h]), U ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: U }) : o ? o.length ? /* @__PURE__ */ s.jsx("div", { className: _ ? "history-images history-images-large" : "history-images", children: o.map((A, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
    /* @__PURE__ */ s.jsx(ku, { id: A.id }),
    /* @__PURE__ */ s.jsxs("figcaption", { children: [
      Kt(A.relation, 24),
      "｜",
      JSON.stringify(A.locator)
    ] })
  ] }, A.id + ":" + G)) }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "该条目没有已关联的照片（无照片不代表原报告没有照片）。" }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "读取关联照片…" });
}
function Mv({ api: u }) {
  const [h, _] = r.useState(null), [o, T] = r.useState([]), [U, V] = r.useState("findings"), [A, G] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState([]), [se, fe] = r.useState([]), [Ne, Se] = r.useState(zv), [Oe, he] = r.useState(Dv), [F, oe] = r.useState(Rv), [ne, H] = r.useState(""), xe = r.useRef(null), Re = r.useRef(!1), [Xe, Ze] = r.useState(0), [Qe, je] = r.useState(""), [We, X] = r.useState(""), [de, y] = r.useState(!1), [Q, le] = r.useState(""), [Ce, m] = r.useState(""), [B, P] = r.useState(""), [te, re] = r.useState(""), [Z, $] = r.useState(0), [Ae, ce] = r.useState(!1), [Ee, ct] = r.useState(Av), [lt, et] = r.useState(!1), [Be, De] = r.useState([]), [Me, we] = r.useState(/* @__PURE__ */ new Set()), [qe, tt] = r.useState(!1), [Ke, dt] = r.useState(null), [ve, ht] = r.useState({}), [ye, E] = r.useState(null), [w, I] = r.useState(""), [_e, He] = r.useState(null), [at, rt] = r.useState(""), [L, ie] = r.useState(""), [ae, Le] = r.useState(!0), [b, ge] = r.useState(!1), [pe, Ye] = r.useState(0), nt = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], D = (h == null ? void 0 : h.fields) || nt, x = r.useMemo(() => Oe.filter((f) => Ne.includes(f)), [Oe, Ne]), ue = nt.length + Un.length, be = Ne.filter((f) => nt.some((Y) => Y.key === f) || Un.includes(f)).length, st = (f) => F[f] || Ov[f] || 140, N = x.reduce((f, Y) => f + st(Y), 0), Ve = Object.keys(F).length > 0 ? N : Math.max(N, Xe);
  r.useEffect(() => {
    const f = xe.current;
    if (!f || (Ze(f.clientWidth), typeof ResizeObserver > "u")) return;
    const Y = new ResizeObserver(() => Ze(f.clientWidth));
    return Y.observe(f), () => Y.disconnect();
  }, [U]), r.useEffect(() => {
    if ((!ye || Ke) && !_e) return;
    const f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const Y = (Je) => {
      Je.key === "Escape" && (E(null), He(null));
    };
    return window.addEventListener("keydown", Y), () => {
      document.body.style.overflow = f, window.removeEventListener("keydown", Y);
    };
  }, [ye, Ke, _e]), r.useEffect(() => {
    let f = !1;
    return Le(!0), ie(""), Promise.all([
      u(cl + "/summary"),
      u(cl + "/projects?limit=800"),
      u(cl + "/drafts?limit=100")
    ]).then(([Y, Je, Yt]) => {
      f || (_(Y), T(Je.items), k(Yt.items), Se((bt) => {
        const rs = /* @__PURE__ */ new Set([...Y.editable_fields.map((It) => It.key), ...Un]), As = bt.filter((It) => rs.has(It));
        return As.length ? As : ac.filter((It) => rs.has(It));
      }), he((bt) => Uv(bt, Y.editable_fields.map((rs) => rs.key))));
    }).catch((Y) => {
      f || ie(Y.message);
    }).finally(() => {
      f || Le(!1);
    }), () => {
      f = !0;
    };
  }, [u, pe]), r.useEffect(() => {
    if (U !== "findings") return;
    let f = !1;
    return Le(!0), ie(""), u(cl + "/findings?" + new URLSearchParams({
      q: te,
      project: Q,
      document_id: Ce,
      offset: String(Z),
      limit: String(Ee)
    })).then((Y) => {
      f || (G(lt ? Y.items.filter((Je) => Je.draft_id) : Y.items), ce(Y.has_more));
    }).catch((Y) => {
      f || ie(Y.message);
    }).finally(() => {
      f || Le(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, te, Q, Ce, Z, lt, Ee, pe]), r.useEffect(() => {
    if (U !== "reports") return;
    let f = !1;
    return Le(!0), ie(""), u(cl + "/reports?" + new URLSearchParams({ q: te, project: Q, offset: "0", limit: "100" })).then((Y) => {
      f || (M(Y.items), ce(!1));
    }).catch((Y) => {
      f || ie(Y.message);
    }).finally(() => {
      f || Le(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, te, Q, pe]), r.useEffect(() => {
    if (U !== "logs") return;
    let f = !1;
    return Le(!0), ie(""), u(cl + "/logs?limit=100").then((Y) => {
      f || fe(Y.items);
    }).catch((Y) => {
      f || ie(Y.message);
    }).finally(() => {
      f || Le(!1);
    }), () => {
      f = !0;
    };
  }, [u, U, pe]), r.useEffect(() => {
    qe && we(new Set(A.map((f) => f.id)));
  }, [A, qe]);
  function kt(f) {
    Se(f);
    try {
      localStorage.setItem(tm, JSON.stringify(f));
    } catch {
    }
  }
  function Lt(f) {
    kt(Ne.filter((Y) => Y !== f));
  }
  function qt(f, Y) {
    const Je = Y ? [...Ne, f] : Ne.filter((Yt) => Yt !== f);
    kt(Je);
  }
  function ut(f) {
    he(f);
    try {
      localStorage.setItem(sm, JSON.stringify(f));
    } catch {
    }
  }
  function Nt(f, Y) {
    if (f.preventDefault(), f.stopPropagation(), f.pointerType === "mouse" && f.button !== 0) return;
    const Je = f.clientX, Yt = f.currentTarget.closest("table"), bt = { ...F };
    if (Yt)
      for (const $t of Array.from(Yt.querySelectorAll("thead th[data-col]"))) {
        const ms = $t.dataset.col;
        ms && (bt[ms] = Math.round($t.getBoundingClientRect().width));
      }
    const rs = bt[Y] || st(Y);
    Re.current = !0, H(Y), je(""), X(""), document.body.classList.add("history-resizing"), oe(bt);
    const As = ($t) => {
      const ms = Math.round(Math.max(56, Math.min(1e3, rs + $t.clientX - Je)));
      oe({ ...bt, [Y]: ms });
    }, It = () => {
      window.removeEventListener("pointermove", As), window.removeEventListener("pointerup", It), window.removeEventListener("pointercancel", It), Re.current = !1, H(""), document.body.classList.remove("history-resizing"), oe(($t) => {
        try {
          localStorage.setItem(ec, JSON.stringify($t));
        } catch {
        }
        return $t;
      });
    };
    window.addEventListener("pointermove", As), window.addEventListener("pointerup", It), window.addEventListener("pointercancel", It);
  }
  function g(f) {
    oe((Y) => {
      if (!(f in Y)) return Y;
      const Je = { ...Y };
      delete Je[f];
      try {
        localStorage.setItem(ec, JSON.stringify(Je));
      } catch {
      }
      return Je;
    });
  }
  function ke() {
    oe({});
    try {
      localStorage.removeItem(ec);
    } catch {
    }
  }
  function it(f, Y) {
    if (!f || !Y || f === Y) return;
    const Je = Oe.filter((bt) => bt !== f), Yt = Je.indexOf(Y);
    Je.splice(Yt < 0 ? Je.length : Yt, 0, f), ut(Je);
  }
  function pt(f) {
    we((Y) => {
      const Je = new Set(Y);
      return Je.has(f) ? Je.delete(f) : Je.add(f), Je;
    });
  }
  function j() {
    qe ? (tt(!1), we(/* @__PURE__ */ new Set())) : (tt(!0), we(new Set(A.map((f) => f.id))));
  }
  function Te(f) {
    dt(f);
    const Y = {};
    for (const Je of yu) Y[Je] = f[Je] || "";
    ht(Y), rt(""), E(null), I("");
  }
  async function ze() {
    if (!Ke) return;
    const f = {};
    for (const Y of yu) {
      const Je = Ke[Y] || "";
      ve[Y] !== Je && (f[Y] = ve[Y] || null);
    }
    if (!Object.keys(f).length) {
      rt("没有修改任何字段。");
      return;
    }
    ge(!0), ie("");
    try {
      await u(cl + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: Ke.id, changes: f }) }), rt(`已保存草稿（${Object.keys(f).map((Y) => Il(nt, Y)).join("、")}），批量确认后覆盖数据库。`), dt(null), Ye((Y) => Y + 1);
    } catch (Y) {
      ie(Y.message);
    } finally {
      ge(!1);
    }
  }
  async function Pe(f) {
    if (!f.length) {
      rt("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${f.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      ge(!0), ie(""), rt("");
      try {
        const Y = await u(cl + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) });
        rt(`已确认写入 ${Y.applied.length} 条${Y.conflicts.length ? `；${Y.conflicts.length} 条存在值冲突` : ""}。`), De([]), Ye((Je) => Je + 1);
      } catch (Y) {
        ie(Y.message);
      } finally {
        ge(!1);
      }
    }
  }
  async function Zt(f) {
    if (f.length) {
      ge(!0), ie("");
      try {
        await u(cl + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) }), De([]), Ye((Y) => Y + 1);
      } catch (Y) {
        ie(Y.message);
      } finally {
        ge(!1);
      }
    }
  }
  async function _s(f) {
    E(null), I("");
    try {
      const Y = await u(Ln + "/findings/" + encodeURIComponent(f.id));
      E(Y);
    } catch (Y) {
      I(Y.message);
    }
  }
  function fs(f) {
    const Y = Rt ? "/quality/b" : "";
    window.open(Y + "/api/v1" + Ln + "/documents/" + encodeURIComponent(f) + "/view", "_blank", "noopener");
  }
  async function At(f) {
    if (ye)
      try {
        const Y = f || ye, Je = await Qt("/api/v1" + Ln + "/documents/" + encodeURIComponent(Y.document_id) + "/original");
        if (!Je.ok) throw Error("原件暂不可用，请稍后重试。");
        const Yt = URL.createObjectURL(await Je.blob()), bt = document.createElement("a");
        bt.href = Yt, bt.download = Y.original_name, bt.click(), setTimeout(() => URL.revokeObjectURL(Yt), 1e3);
      } catch (Y) {
        I(Y.message);
      }
  }
  const ul = r.useMemo(() => v, [v]), Qs = r.useMemo(() => K.map((f) => f.id), [K]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ae, onClick: () => Ye((f) => f + 1), children: "刷新数据" })
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
      L && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        L,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => Ye((f) => f + 1), children: "重试" })
      ] }),
      at && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: at }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([f, Y]) => /* @__PURE__ */ s.jsx("button", { className: U === f ? "button primary" : "button ghost", onClick: () => {
        V(f), $(0);
      }, children: Y }, f)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel history-toolbar-panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (f) => {
          f.preventDefault(), re(B.trim()), $(0);
        }, children: [
          /* @__PURE__ */ s.jsx("input", { id: "history-query", "aria-label": "搜索", value: B, onChange: (f) => P(f.target.value), maxLength: 100, placeholder: U === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ae, children: "搜索" })
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
        Ce && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          m(""), $(0);
        }, children: "清除报告筛选" }),
        U === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: lt, onChange: (f) => et(f.target.checked) }),
          "只看待确认修改"
        ] }),
        U === "findings" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => y((f) => !f), children: h ? `显示字段（${be}/${ue}）` : "显示字段" }),
        U === "findings" && /* @__PURE__ */ s.jsx("button", { className: qe ? "button primary" : "button secondary", onClick: j, children: qe ? "收起全部字段" : "展开全部字段" })
      ] }),
      de && U === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        nt.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(f.key), onChange: (Y) => qt(f.key, Y.target.checked) }),
          f.label
        ] }, f.key)),
        /* @__PURE__ */ s.jsx("span", { className: "history-fieldsep", children: "其他列" }),
        Un.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(f), onChange: (Y) => qt(f, Y.target.checked) }),
          Au[f]
        ] }, f)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => kt(ac.filter((f) => nt.some((Y) => Y.key === f) || Un.includes(f))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ut(im), children: "恢复列顺序" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: ke, children: "恢复列宽" })
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
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: b, onClick: () => De(Be.length === Qs.length ? [] : Qs), children: Be.length === Qs.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: b || !Be.length, onClick: () => void Pe(Be), children: [
                "批量确认所选（",
                Be.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: b || !Be.length, onClick: () => void Zt(Be), children: "放弃所选" })
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
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Be.includes(f.id), onChange: (Y) => De(Y.target.checked ? [...Be, f.id] : Be.filter((Je) => Je !== f.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Kt(f.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Kt(f.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Yf(f.changes, nt) }),
              /* @__PURE__ */ s.jsx("td", { children: f.updated_at ? new Date(f.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, f.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { ref: xe, className: "table-wrap history-table-wrap" + (ne ? " history-resizing" : ""), "aria-busy": ae, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", style: { width: Ve, minWidth: Ve }, children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: x.map((f) => /* @__PURE__ */ s.jsx(
            "th",
            {
              draggable: !0,
              "data-col": f,
              style: { width: st(f), minWidth: st(f) },
              className: "history-col-head" + (Qe === f ? " history-col-dragging" : "") + (We === f ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (Y) => {
                if (Re.current) {
                  Y.preventDefault();
                  return;
                }
                je(f), Y.dataTransfer.effectAllowed = "move", Y.dataTransfer.setData("text/plain", f);
              },
              onDragOver: (Y) => {
                Y.preventDefault(), Y.dataTransfer.dropEffect = "move", We !== f && X(f);
              },
              onDragLeave: () => X(""),
              onDrop: (Y) => {
                Y.preventDefault(), it(Qe || Y.dataTransfer.getData("text/plain"), f), je(""), X("");
              },
              onDragEnd: () => {
                je(""), X("");
              },
              children: /* @__PURE__ */ s.jsxs("span", { className: "history-th", children: [
                /* @__PURE__ */ s.jsx("span", { className: "history-th-label", children: Il(nt, f) }),
                /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-col-hide", title: "点击隐藏该列（可在“显示字段”中恢复）", "aria-label": `隐藏${Il(nt, f)}列`, draggable: !1, onMouseDown: (Y) => Y.stopPropagation(), onDragStart: (Y) => Y.preventDefault(), onClick: (Y) => {
                  Y.stopPropagation(), Lt(f);
                }, children: "×" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-col-resize", role: "separator", "aria-orientation": "vertical", "aria-label": "拖动调节列宽（双击恢复该列默认宽度）", title: "拖动调节列宽；双击恢复该列默认宽度", onPointerDown: (Y) => Nt(Y, f), onDoubleClick: (Y) => {
                  Y.preventDefault(), Y.stopPropagation(), g(f);
                }, onDragStart: (Y) => Y.preventDefault() })
              ] })
            },
            f
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            A.map((f) => {
              const Y = Me.has(f.id);
              return /* @__PURE__ */ s.jsxs(r.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (f.draft_id ? "history-dirty" : "") + " history-row", onClick: (Je) => {
                  Je.target.closest("button, a, input, textarea, select, summary") || pt(f.id);
                }, children: (() => {
                  const Je = [];
                  for (let Yt = 0; Yt < x.length; Yt += 1) {
                    const bt = x[Yt];
                    if (bt === "_actions") {
                      Je.push(/* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                        /* @__PURE__ */ s.jsx("button", { className: "button secondary icon-button", title: "编辑", "aria-label": "编辑", onClick: () => Te(f), children: /* @__PURE__ */ s.jsx(xv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: "查看证据", "aria-label": "查看证据", onClick: () => void _s(f), children: /* @__PURE__ */ s.jsx(dv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: Y ? "收起" : "展开", "aria-label": Y ? "收起" : "展开", onClick: () => pt(f.id), children: Y ? /* @__PURE__ */ s.jsx($j, { size: 15 }) : /* @__PURE__ */ s.jsx(Vj, { size: 15 }) })
                      ] }, bt));
                      continue;
                    }
                    if (bt === "_photos") {
                      Je.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.image_count ? /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => He(f), children: [
                        "查看 ",
                        f.image_count,
                        " 张"
                      ] }) : /* @__PURE__ */ s.jsx("span", { className: "muted", children: "—" }) }, bt));
                      continue;
                    }
                    if (bt === "_source") {
                      Je.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.original_name || "", children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (ms) => {
                        ms.stopPropagation(), fs(f.document_id);
                      }, children: Kt(f.original_name, 26) }) }, bt));
                      continue;
                    }
                    if (bt === "_status") {
                      Je.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Kt(f.review_state, 14) }, bt));
                      continue;
                    }
                    const rs = f[bt];
                    if (!rs || !String(rs).trim()) {
                      let ms = 1, Ul = Yt + 1;
                      for (; Ul < x.length; ) {
                        const Zs = x[Ul];
                        if (tc.includes(Zs)) break;
                        const Pl = f[Zs];
                        if (Pl && String(Pl).trim()) break;
                        ms += 1, Ul += 1;
                      }
                      Je.push(/* @__PURE__ */ s.jsx("td", { colSpan: ms, className: "history-cell history-cell-merged", title: "该行连续空字段合并显示", children: "—" }, bt)), Yt = Ul - 1;
                      continue;
                    }
                    const It = bt === "problem_description", $t = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "source_category", "source_grade", "hazard_category"].includes(bt);
                    Je.push(/* @__PURE__ */ s.jsx("td", { title: rs || "", className: It ? "history-cell history-cell-wrap" : $t ? "history-cell history-cell-nowrap" : "history-cell", children: It ? rs : Kt(rs, 80) }, bt));
                  }
                  return Je;
                })() }),
                Y && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: x.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: nt.map((Je) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: Je.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: f[Je.key] || "—" })
                  ] }, Je.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (Je) => {
                      Je.stopPropagation(), fs(f.document_id);
                    }, children: Kt(f.original_name, 100) }),
                    "｜状态：",
                    Kt(f.review_state, 20),
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
            !A.length && !ae && !L && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: x.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagesize", children: [
          "每页显示",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "每页显示条数", value: Ee, onChange: (f) => {
            const Y = Number(f.target.value);
            ct(Y), $(0);
            try {
              localStorage.setItem(lm, String(Y));
            } catch {
            }
          }, children: am.map((f) => /* @__PURE__ */ s.jsx("option", { value: f, children: f }, f)) }),
          "条"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Z === 0, onClick: () => $(Math.max(0, Z - Ee)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            Math.floor(Z / Ee) + 1,
            " 页 · 本页 ",
            A.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Ae, onClick: () => $(Z + Ee), children: "下一页" })
        ] })
      ] }),
      U === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": ae, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          ul.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: Kt(f.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(f.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(f.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: f.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                m(f.document_id), V("findings"), $(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => fs(f.document_id), children: "浏览报告" })
            ] })
          ] }, f.document_id)),
          !ul.length && !ae && !L && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      U === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": ae, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
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
            /* @__PURE__ */ s.jsx("td", { children: Tv[f.action] || f.action }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(f.original_name, 28) || Kt(f.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Yf(f.changes, nt) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(f.actor, 30) })
          ] }, f.id)),
          !se.length && !ae && !L && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    Ke && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          dt(null), E(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Kt(Ke.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: yu.map((f) => /* @__PURE__ */ s.jsxs("label", { className: f === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Il(nt, f) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: f === "problem_description" ? 3 : 2, value: ve[f] || "", onChange: (Y) => ht({ ...ve, [f]: Y.target.value }) })
      ] }, f)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: b, onClick: () => void ze(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => dt(null), children: "取消" })
      ] }),
      ye && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: D.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ye.fields[f.key] || "—" })
        ] }, f.key)) }),
        ye.evidence.map((f, Y) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Il(nt, f.field_key),
            "：",
            Kt(f.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, Y)),
        ye.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            ye.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ye.images.map((f, Y) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(ku, { id: f.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
          ] }, f.id + ":" + Y)) })
        ] })
      ] })
    ] }),
    ye && !Ke && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => E(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: ye.original_name }),
            "｜解析版本时间：",
            new Date(ye.parsed_at).toLocaleString("zh-CN")
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => E(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(), children: "下载原报告" }),
        ye.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: ye.sources.map((f) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(f), children: f.original_name }) }, f.document_id)) })
        ] }),
        w && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: w }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: D.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ye.fields[f.key] || "—" })
        ] }, f.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        ye.evidence.map((f, Y) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Il(nt, f.field_key),
            "：",
            Kt(f.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, Y)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          ye.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ye.images.map((f, Y) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(ku, { id: f.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
        ] }, f.id + ":" + Y)) })
      ] })
    ] }) }),
    _e && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "关联照片", onClick: () => He(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal history-photo-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "关联照片" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Kt(_e.original_name, 90) }),
            "｜问题：",
            Kt(_e.problem_description, 90)
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => He(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-modal-body", children: /* @__PURE__ */ s.jsx(Gf, { api: u, findingId: _e.id, large: !0 }) })
    ] }) })
  ] });
}
function Mt(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((_) => ["admin", "reviewer"].includes(_)) : h === "training.manage" ? u.roles.some((_) => ["admin", "teacher"].includes(_)) : h === "training.review" ? u.roles.some((_) => ["admin", "teacher", "reviewer"].includes(_)) : !0 : !1;
}
const rl = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Xf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Qf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function _u(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((o) => o.text).join(`
`), h.facts.map((o) => o.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((o) => o.evidence_ids).join("、"), h.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, o, T]) => o !== T);
}
function qv({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var D;
  const [U, V] = r.useState(!0), [A, G] = r.useState(!1), [v, M] = r.useState(""), [K, k] = r.useState(""), [se, fe] = r.useState(0), [Ne, Se] = r.useState([]), [Oe, he] = r.useState([]), [F, oe] = r.useState([]), [ne, H] = r.useState("knowledge_revision"), [xe, Re] = r.useState(""), [Xe, Ze] = r.useState(""), [Qe, je] = r.useState(""), [We, X] = r.useState(null), [de, y] = r.useState([]), [Q, le] = r.useState(null), [Ce, m] = r.useState("resolved"), [B, P] = r.useState(""), [te, re] = r.useState(""), [Z, $] = r.useState(((D = o.find((x) => Mt(x, "knowledge.process"))) == null ? void 0 : D.id) || ""), [Ae, ce] = r.useState([]), [Ee, ct] = r.useState([]), [lt, et] = r.useState("case_card"), [Be, De] = r.useState("normal"), [Me, we] = r.useState(null), [qe, tt] = r.useState(sessionStorage.getItem("b03-last-job-" + T) || ""), [Ke, dt] = r.useState(null), [ve, ht] = r.useState(null), [ye, E] = r.useState(null), [w, I] = r.useState(""), [_e, He] = r.useState(!1), at = /^\/knowledge\/[^/]+\/edit$/.test(h), rt = o.some((x) => Mt(x, "knowledge.process")), L = o.some((x) => Mt(x, "knowledge.review")), ie = h.startsWith("/quality"), ae = h === "/reviews";
  r.useEffect(() => {
    je(""), y([]), Ze(""), Re(""), M(""), k(""), He(!1), I("");
  }, [h]), r.useEffect(() => {
    let x = !1;
    V(!0), M(""), ht(null), E(null);
    async function ue() {
      try {
        if (ie) {
          const be = await u(`/quality/issues?limit=20${xe ? "&rule_code=" + xe : ""}${Xe ? "&status=" + Xe : ""}${Qe ? "&cursor=" + encodeURIComponent(Qe) : ""}`);
          if (x) return;
          he(be.items), oe(be.summary), X(be.next_cursor);
        } else if (at) {
          const be = await u(h.replace("/edit", ""));
          if (x) return;
          ht(be), E(structuredClone(be.content));
        } else if (ae) {
          const be = await u(`/reviews?object_type=${ne}&state=${Xe || "pending_review"}${Qe ? "&cursor=" + encodeURIComponent(Qe) : ""}`);
          if (x) return;
          Se(be.items), X(be.next_cursor);
        } else {
          const be = await u(`/knowledge?limit=20${Xe ? "&state=" + Xe : ""}${Qe ? "&cursor=" + encodeURIComponent(Qe) : ""}`);
          if (x) return;
          if (Se(be.items), X(be.next_cursor), rt && Z) {
            const st = await u("/knowledge/source-options?project_id=" + Z);
            x || ce(st.items);
          }
        }
      } catch (be) {
        x || M(be.message);
      } finally {
        x || V(!1);
      }
    }
    return ue(), () => {
      x = !0;
    };
  }, [h, Xe, xe, Qe, se, Z, ne]), r.useEffect(() => {
    ct([]), we(null);
  }, [Z, lt, Be]), r.useEffect(() => {
    if (!qe || ie || at || ae || !rt) return;
    let x = !1;
    const ue = () => {
      u("/knowledge/generation-jobs/" + qe).then((st) => {
        x || (dt(st), st.status === "succeeded" && fe((N) => N + 1));
      }).catch((st) => {
        x || M(st.message);
      });
    };
    ue();
    const be = setInterval(() => {
      (!Ke || ["queued", "running", "retrying"].includes(Ke.status)) && ue();
    }, 1800);
    return () => {
      x = !0, clearInterval(be);
    };
  }, [qe, h, Ke == null ? void 0 : Ke.status]);
  const Le = async (x) => {
    G(!0), M(""), k("");
    try {
      await x();
    } catch (ue) {
      M(ue.message);
    } finally {
      G(!1);
    }
  }, b = () => ({ record_version_ids: Ee, type: lt, template_version: "mock-v1", mock_scenario: Be }), ge = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !de.length, onClick: () => {
        je(de.at(-1) || ""), y(de.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !We, onClick: () => {
        y([...de, Qe]), je(We || "");
      }, children: "下一页" })
    ] })
  ] }), pe = ve && Mt(o.find((x) => x.id === ve.project_id), "knowledge.process"), Ye = ve && Mt(o.find((x) => x.id === ve.project_id), "knowledge.review"), nt = (x) => Le(async () => {
    if (!ve) return;
    const ue = x === "submit" ? `/knowledge/${ve.id}/submit-review` : `/reviews/${ve.revision_id}/${x}`;
    await u(ue, { method: "POST", body: JSON.stringify({ row_version: ve.row_version, revision_id: ve.revision_id, reason: w, evidence_checked: _e }) }), k(x === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), fe((be) => be + 1), He(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Hn, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    v && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      v,
      /* @__PURE__ */ s.jsx("button", { onClick: () => fe((x) => x + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: ie ? "selected" : "", onClick: () => _("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !ie && !ae ? "selected" : "", onClick: () => _("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ae ? "selected" : "", onClick: () => _("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: U, onClick: () => fe((x) => x + 1), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    U ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : ie ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Xf).map(([x, ue]) => /* @__PURE__ */ s.jsxs("button", { className: xe === x ? "panel selected-quality" : "panel", "aria-pressed": xe === x, onClick: () => {
        Re(xe === x ? "" : x), Ze("open"), je(""), y([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: ue }),
        /* @__PURE__ */ s.jsx("strong", { children: F.filter((be) => be.rule_code === x && be.status === "open").reduce((be, st) => be + st.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, x)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Xe, onChange: (x) => {
            Ze(x.target.value), je(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: rl[x] }, x))
          ] })
        ] }),
        Oe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Oe.map((x) => {
            var ue, be;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + x.record_id), children: x.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Xf[x.rule_code] || x.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                x.message,
                x.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (ue = x.annotations.at(-1)) == null ? void 0 : ue.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: rl[x.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((be = o.find((st) => st.id === x.project_id)) != null && be.can_run), onClick: () => {
                le(x), P(""), re("");
              }, children: "核查处理" }) })
            ] }, x.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ge
      ] })
    ] }) : at && ve && ye ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Qf[ve.type],
            " · v",
            ve.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            rl[ve.state],
            " · 生成适配器：",
            ve.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      ve.source.version !== ve.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        ve.source.version,
        "更新到v",
        ve.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _((ve.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + ve.source.record_id), children: ve.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              ve.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(ve.source.raw_fields.description || ve.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(ve.source.effective_fields.description || "缺失") }),
            ve.source.versions && ve.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                ve.source.versions.length,
                "条）"
              ] }),
              ve.source.versions.map((x) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  x.version,
                  " · ",
                  x.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(x.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + x.record_id), children: "打开风险记录" })
              ] }, x.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ye.project_name,
              " · ",
              ye.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            ve.source.evidence.map((x) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[x.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(x.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: x.id })
            ] }, x.id)),
            ve.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              ve.source.annotations.map((x, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
                x.reason,
                " · ",
                JSON.stringify(x.value)
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
              /* @__PURE__ */ s.jsx("input", { value: ye.title, disabled: !pe, onChange: (x) => E({ ...ye, title: x.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            ye.facts.map((x, ue) => /* @__PURE__ */ s.jsxs("label", { children: [
              x.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: x.text, onChange: (be) => E({ ...ye, facts: ye.facts.map((st, N) => N === ue ? { ...st, text: be.target.value, source_kind: "human_annotation" } : st) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                x.evidence_ids.join("、")
              ] })
            ] }, ue)),
            ye.construction_points && ye.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                ye.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: ye.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              ye.construction_points.map((x, ue) => {
                var be;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    x.title,
                    " · ",
                    x.stage === "preparation" ? "施工准备" : x.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: x.content, onChange: (st) => {
                      var N;
                      return E({ ...ye, construction_points: (N = ye.construction_points) == null ? void 0 : N.map((me, Ve) => Ve === ue ? { ...me, content: st.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: x.inspection_method, onChange: (st) => {
                      var N;
                      return E({ ...ye, construction_points: (N = ye.construction_points) == null ? void 0 : N.map((me, Ve) => Ve === ue ? { ...me, inspection_method: st.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: x.common_mistakes, onChange: (st) => {
                      var N;
                      return E({ ...ye, construction_points: (N = ye.construction_points) == null ? void 0 : N.map((me, Ve) => Ve === ue ? { ...me, common_mistakes: st.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: x.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    x.evidence_ids.join("、")
                  ] }),
                  (be = x.source_quotes) == null ? void 0 : be.map((st, N) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: st.text })
                  ] }, N))
                ] }, ue);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: ye.suggestions.join(`
`), onChange: (x) => E({ ...ye, suggestions: x.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            ye.standards.length ? ye.standards.map((x, ue) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: x.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                x.clause || "未提供",
                " · 版本：",
                x.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: x.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !pe, checked: x.verification_status === "not_used", onChange: (be) => E({ ...ye, standards: ye.standards.map((st, N) => N === ue ? { ...st, verification_status: be.target.checked ? "not_used" : "pending_verification" } : st) }) }),
                "明确不采用该依据"
              ] })
            ] }, ue)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            _u(ve.content, ye).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              _u(ve.content, ye).map(([x, ue, be]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: x }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  ue
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  be
                ] })
              ] }, x))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (x) => I(x.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              pe && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A || !w.trim(), onClick: () => void Le(async () => {
                await u(`/knowledge/${ve.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: ve.row_version, revision_id: ve.revision_id, content: ye, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), fe((x) => x + 1);
              }), children: "保存新草稿版本" }),
              pe && ["draft", "changes_requested"].includes(ve.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !w.trim() || JSON.stringify(ye) !== JSON.stringify(ve.content), onClick: () => void nt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Ye && ve.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e, onChange: (x) => He(x.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !_e || !w.trim() || JSON.stringify(ye) !== JSON.stringify(ve.content), onClick: () => void nt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: A || !w.trim(), onClick: () => void nt("request-changes"), children: "退回修改" })
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
        ve.revisions.map((x, ue) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            x.version,
            " · ",
            rl[x.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: x.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            x.content.facts.map((be) => be.text).join("；")
          ] }),
          ve.revisions[ue + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              ve.revisions[ue + 1].version,
              "的修改："
            ] }),
            _u(ve.revisions[ue + 1].content, x.content).map(([be, st, N]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                st
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                N
              ] })
            ] }, be))
          ] })
        ] }, x.id)),
        ve.review_actions.map((x, ue) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            x.version,
            " · ",
            rl[x.action] || x.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: x.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(x.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            x.reviewer.slice(0, 8)
          ] })
        ] }, ue))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ae && rt && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Z, onChange: (x) => $(x.target.value), children: o.filter((x) => Mt(x, "knowledge.process")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: lt, onChange: (x) => et(x.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            ct(Ae.slice(0, 20).map((x) => x.record_version_id)), we(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Ae.length ? Ae.map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee.includes(x.record_version_id), onChange: (ue) => {
              ct(ue.target.checked ? [...Ee, x.record_version_id] : Ee.filter((be) => be !== x.record_version_id)), we(null);
            } }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              x.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "来源v",
                x.current_version,
                " · ",
                { detail: "明细", review: "复查", summary: "汇总" }[x.record_kind] || x.record_kind
              ] })
            ] })
          ] }, x.id)) : /* @__PURE__ */ s.jsx("p", { children: "当前项目尚无可用风险数据，请先完成历史数据接入。" }) }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "模拟校验场景（可选）" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "结构验证",
              /* @__PURE__ */ s.jsxs("select", { value: Be, onChange: (x) => De(x.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: A || !Ee.length || Ee.length > 20, onClick: () => void Le(async () => {
              we(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              Ee.length,
              "条）"
            ] }),
            Me && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: A, onClick: () => void Le(async () => {
              const x = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              dt(null), tt(x.job_id), sessionStorage.setItem("b03-last-job-" + T, x.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              Me.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(Al, { size: 15 })
            ] })
          ] }),
          Me && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: Me.items.map((x, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
            x.description,
            " · 来源问题 ",
            x.quality_issue_count,
            "项"
          ] }, ue)) }),
          Ke && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              Ke.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              Ke.counts.created,
              " · 复用 ",
              Ke.counts.skipped,
              " · 单项失败 ",
              Ke.counts.failed
            ] }),
            Ke.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: Ke.error }),
            Ke.items.map((x, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
              x.error || rl[x.outcome],
              " ",
              x.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + x.item_id + "/edit"), children: "打开知识卡" })
            ] }, ue)),
            Ke.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A, onClick: () => void Le(async () => {
              await u("/jobs/" + Ke.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Ke.row_version }) }), dt(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ae ? "审核待办" : "知识候选列表" }),
          ae && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ne, onChange: (x) => {
            H(x.target.value), je(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Xe, onChange: (x) => {
            Ze(x.target.value), je(""), y([]);
          }, children: [
            !ae && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ae ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: rl[x] }, x))
          ] })
        ] }),
        ae && !L ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : Ne.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ne.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: x.title }),
            /* @__PURE__ */ s.jsx("td", { children: Qf[x.type] }),
            /* @__PURE__ */ s.jsx("td", { children: rl[x.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              x.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _(x.object_type === "question_revision" ? "/training/questions/" + x.id : x.object_type === "retrospective_revision" ? "/retrospectives/" + x.id + "/review" : "/knowledge/" + x.id + "/edit"), children: ae ? "打开审核" : "核查与编辑" }) })
          ] }, x.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ae ? "暂无对应审核待办" : "还没有知识候选" }),
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
        /* @__PURE__ */ s.jsx("select", { value: Ce, onChange: (x) => m(x.target.value), children: ["resolved", "ignored", "open"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: rl[x] }, x)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: B, onChange: (x) => P(x.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: te, onChange: (x) => re(x.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !B.trim(), onClick: () => void Le(async () => {
        await u("/quality/issues/" + Q.id, { method: "PATCH", body: JSON.stringify({ row_version: Q.row_version, status: Ce, reason: B, annotation: te || null }) }), le(null), fe((x) => x + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Zf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Hv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", Bv = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", Nu = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function Lv({ identity: u, path: h, projects: _, navigate: o }) {
  var ie, ae, Le, b, ge, pe, Ye, nt;
  const [T, U] = r.useState(((ie = _[0]) == null ? void 0 : ie.id) || ""), [V, A] = r.useState("generic"), [G, v] = r.useState(""), [M, K] = r.useState([]), [k, se] = r.useState({}), [fe, Ne] = r.useState([]), [Se, Oe] = r.useState([]), [he, F] = r.useState("mock-hash-64"), [oe, ne] = r.useState([]), [H, xe] = r.useState(null), [Re, Xe] = r.useState(""), [Ze, Qe] = r.useState("extractive"), [je, We] = r.useState(null), [X, de] = r.useState(null), [y, Q] = r.useState(null);
  r.useEffect(() => () => {
    y && URL.revokeObjectURL(y);
  }, [y]), r.useEffect(() => {
    Q(null);
  }, [T, h]);
  const [le, Ce] = r.useState(null);
  r.useEffect(() => {
    Ce(null);
  }, [h]);
  const [m, B] = r.useState(""), [P, te] = r.useState("useful"), [re, Z] = r.useState(""), [$, Ae] = r.useState(!1), [ce, Ee] = r.useState(!0), [ct, lt] = r.useState(""), [et, Be] = r.useState(""), [De, Me] = r.useState(0), [we, qe] = r.useState(""), [tt, Ke] = r.useState(null), [dt, ve] = r.useState([]), ht = r.useRef("");
  ht.current = [u, h, T, V, G, Re, Ze, le].join("|");
  const ye = h === "/releases", E = h === "/search", w = h === "/knowledge/library", I = Mt(_.find((D) => D.id === T), "knowledge.publish"), _e = !ye && !E && !w ? h.split("/")[2] : null;
  async function He(D, x = {}) {
    const ue = await Qt("/api/v1" + D, { ...x, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...x.headers } }), be = await ue.json();
    if (!ue.ok) throw new Error(be.message || "请求失败，请重试。");
    return be;
  }
  r.useEffect(() => {
    Oe([]), We(null), de(null), lt(""), Be(""), qe(""), ve([]);
  }, [T, h, V, G]), r.useEffect(() => {
    let D = !1;
    return Ee(!0), lt(""), xe(null), (async () => {
      try {
        if (ye) {
          const ue = await He(`/releases?project_id=${T}${we ? "&cursor=" + encodeURIComponent(we) : ""}`);
          if (D) return;
          K(ue.items), se(ue.active_ids), Ke(ue.next_cursor);
          const be = await He("/releases/options?project_id=" + T);
          D || Ne(be.items);
        } else if (w) {
          const ue = await He(`/knowledge/library?project_id=${T}${V ? "&scene_code=" + V : ""}${G ? "&card_type=" + G : ""}${we ? "&after_id=" + we : ""}`);
          D || (ne(ue.items), Ke(ue.next_cursor));
        } else if (_e) {
          const ue = await He("/published/knowledge/" + _e + (le ? "?revision_id=" + le : ""));
          D || xe(ue);
        }
      } catch (ue) {
        D || lt(ue.message);
      } finally {
        D || Ee(!1);
      }
    })(), () => {
      D = !0;
    };
  }, [T, h, V, G, De, we, le]), r.useEffect(() => {
    if (!ye || !M.some((x) => ["queued", "building"].includes(x.state))) return;
    const D = setInterval(() => Me((x) => x + 1), 1800);
    return () => clearInterval(D);
  }, [ye, M]);
  const at = async (D) => {
    Ae(!0), lt(""), Be("");
    try {
      await D();
    } catch (x) {
      lt(x.message);
    } finally {
      Ae(!1);
    }
  }, rt = (D, x, ue = !1) => at(async () => {
    const be = ht.current;
    Q(null), de(null);
    const st = await He("/published/evidence/" + D + "?revision_id=" + x + (ue ? "&historical=true" : ""));
    if (be === ht.current && (de(st), st.has_image)) {
      const N = await Qt("/api/v1/published/evidence/" + D + "/content?revision_id=" + x + (ue ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!N.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const me = await N.blob();
      be === ht.current && Q(URL.createObjectURL(me));
    }
  }), L = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !dt.length || ce, onClick: () => {
        qe(dt.at(-1) || ""), ve(dt.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !tt || ce, onClick: () => {
        ve([...dt, we]), qe(tt || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(lc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || _e ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: E ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        _.some((D) => Mt(D, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: ye ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        de(null), We(null), Me((D) => D + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ct && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      ct
    ] }),
    et && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      et
    ] }),
    !_e && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: T, onChange: (D) => U(D.target.value), children: _.map((D) => /* @__PURE__ */ s.jsx("option", { value: D.id, children: D.name }, D.id)) })
      ] }),
      !ye && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: V, onChange: (D) => A(D.target.value), children: [
            w && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: G, onChange: (D) => v(D.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ce ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : ye ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      I && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: fe.length ? fe.map((D) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se.includes(D.revision_id), onChange: (x) => Oe(x.target.checked ? [...Se, D.revision_id] : Se.filter((ue) => ue !== D.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: D.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              Nu(D.type),
              " · 审核版本 v",
              D.version
            ] })
          ] })
        ] }, D.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: he, onChange: (D) => F(D.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: $ || !Se.length, onClick: () => void at(async () => {
            await He("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: T, revision_ids: Se, embedding_model: he }) }), Oe([]), Be("发布集合已固定，处理服务正在构建索引。"), Me((D) => D + 1);
          }), children: [
            "构建发布 · ",
            Se.length,
            " 张"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "构建失败不会替换当前启用版本" })
        ] }),
        M.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: M.map((D) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Zf[D.state] || D.state }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                new Date(D.created_at).toLocaleString("zh-CN"),
                " · ",
                D.entries.length,
                " 张卡片 · ",
                D.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "批次 ",
                D.id.slice(0, 8),
                D.build_ms !== null ? ` · 构建 ${D.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                D.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(D.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: $, onClick: () => void at(async () => {
                await He("/releases/" + D.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: D.row_version, expected_active_id: k[T] || null }) }), Be("发布已启用，知识库与检索使用同一发布集合。"), Me((x) => x + 1);
              }), children: "启用发布" }),
              D.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $, onClick: () => void at(async () => {
                await He("/jobs/" + D.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: D.job_row_version }) }), Me((x) => x + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          D.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: D.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            D.entries.map((x) => /* @__PURE__ */ s.jsxs("p", { children: [
              x.revision_id.slice(0, 8),
              " · ",
              Zf[x.state] || x.state,
              x.error ? " · " + x.error : ""
            ] }, x.revision_id))
          ] })
        ] }, D.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        L
      ] })
    ] }) : w ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ s.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      oe.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: oe.map((D) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          Nu(D.type),
          " · v",
          D.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: D.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + D.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(lv, { size: 15 })
        ] })
      ] }, D.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(lc, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      L
    ] }) : E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (D) => {
        D.preventDefault(), at(async () => {
          const x = ht.current;
          We(null), de(null);
          const ue = await He("/search", { method: "POST", body: JSON.stringify({ project_id: T, question: Re, scene_code: V, card_type: G || null, answer_mode: Ze }) });
          x === ht.current && We(ue);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Re, onChange: (D) => {
          Xe(D.target.value), We(null), de(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Ze, onChange: (D) => {
              Qe(D.target.value), We(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: $ || !Re.trim(), children: [
            /* @__PURE__ */ s.jsx(yv, { size: 17 }),
            $ ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      je && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: je.status === "answered" ? "找到有据内容" : je.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            je.latency_ms,
            " ms · ",
            je.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          je.answer_blocks.map((D, x) => /* @__PURE__ */ s.jsx("p", { children: D.text }, x)),
          je.missing_conditions.map((D) => /* @__PURE__ */ s.jsx("p", { children: D }, D)),
          je.warnings.map((D) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: D.message }, D.code))
        ] }),
        je.results.map((D, x) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            x + 1,
            " · ",
            D.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + D.id), children: D.title }),
          /* @__PURE__ */ s.jsx("p", { children: D.text }),
          /* @__PURE__ */ s.jsx("div", { children: je.citations.filter((ue) => D.citation_ids.includes(ue.citation_id)).map((ue) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: $, onClick: () => void rt(ue.evidence_id, ue.knowledge_revision_id), children: [
            "打开来源：",
            ue.source_title
          ] }, ue.citation_id)) })
        ] }, D.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (D) => {
          D.preventDefault(), at(async () => {
            await He("/search/" + je.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: P, comment: re }) }), Be("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: P, onChange: (D) => te(D.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: re, maxLength: 1e3, onChange: (D) => Z(D.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $, children: "保存反馈" })
        ] })
      ] })
    ] }) : H && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        H.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        Nu(H.type),
        " · v",
        H.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: H.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ae = _.find((D) => D.id === H.project_id)) == null ? void 0 : ae.name) || H.project_id,
        " · ",
        Hv(H.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Le = H.content) == null ? void 0 : Le.facts.map((D, x) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: D.text }),
        /* @__PURE__ */ s.jsx("small", { children: D.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: D.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { disabled: $, className: "citation-button", onClick: () => void rt(ue, H.revision_id, H.is_current_release === !1), children: "打开来源证据" }, ue)) })
      ] }, x)),
      ((b = H.content) == null ? void 0 : b.construction_points) && H.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          H.content.category_name || "通用"
        ] }),
        H.content.construction_points.map((D, x) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            D.title,
            " · ",
            D.stage === "preparation" ? "施工准备" : D.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: D.content }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "检查方法：",
            D.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "常见问题：",
            D.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ s.jsx("small", { children: D.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ s.jsx("div", { children: D.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void rt(ue, H.revision_id, H.is_current_release === !1), children: "核对要点来源" }, ue)) })
        ] }, x))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((ge = H.content) == null ? void 0 : ge.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (pe = H.content) == null ? void 0 : pe.suggestions.map((D, x) => /* @__PURE__ */ s.jsx("p", { children: D }, x)),
      (Ye = H.content) != null && Ye.standards.length ? H.content.standards.map((D, x) => /* @__PURE__ */ s.jsxs("p", { children: [
        D.name,
        " ",
        D.clause,
        " · ",
        D.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, x)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          H.release_id
        ] }),
        (nt = H.versions) == null ? void 0 : nt.map((D) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          Ce(D.id), de(null);
        }, children: [
          "查看已发布 v",
          D.version
        ] }, D.id)),
        /* @__PURE__ */ s.jsx("p", { children: H.history_note })
      ] }),
      Mt(_.find((D) => D.id === H.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: m, maxLength: 2e3, onChange: (D) => B(D.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: $ || !m.trim(), onClick: () => void at(async () => {
          await He("/knowledge/" + H.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: H.row_version, reason: m }) }), xe(null), de(null), Be("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    X && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          X.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => de(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: X.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: X.description || "来源描述缺失" }),
        y && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: y, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          Bv(X.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: X.note })
      ] })
    ] })
  ] });
}
const Mn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, cm = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, Cu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Yv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, Eu = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, Ou = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, Bn = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", Gv = (u) => JSON.stringify(u, null, 2), Xv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function Ma(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((_) => typeof _ != "object") ? u.join("、") : u.map((_, o) => `第${o + 1}条
${Ma(_)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([_, o]) => `${Xv[_] || Cu[_] || _}：${Ma(o, _)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return Bn(u);
    if (h === "actor_role" || h === "role") return Ou(u);
    if (h === "event_type") return cm[u] || u;
    if (h === "evidence_type") return Eu[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const Qv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? Gv(u) : "未补充说明";
};
function Zv({ identity: u, path: h, projects: _, navigate: o }) {
  var ye, E, w, I, _e, He, at, rt, L, ie, ae, Le;
  const T = h === "/task-packages/import", U = !T && h !== "/task-packages" ? h.split("/")[2] : null, [V, A] = r.useState(((ye = _[0]) == null ? void 0 : ye.id) || ""), [G, v] = r.useState(""), [M, K] = r.useState([]), [k, se] = r.useState(null), [fe, Ne] = r.useState(""), [Se, Oe] = r.useState(null), [he, F] = r.useState([]), [oe, ne] = r.useState([]), [H, xe] = r.useState([]), [Re, Xe] = r.useState("complete"), [Ze, Qe] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [je, We] = r.useState(""), [X, de] = r.useState(null), [y, Q] = r.useState(""), [le, Ce] = r.useState(""), [m, B] = r.useState(!0), [P, te] = r.useState(!1), [re, Z] = r.useState(0), [$, Ae] = r.useState(""), [ce, Ee] = r.useState(null), ct = r.useRef(null), lt = r.useRef(null), et = r.useRef("");
  et.current = [u, h, V, Re, Ze, je].join("|");
  const Be = _.some((b) => b.permissions != null), De = !Be && Mt(_.find((b) => b.id === V), "imports.create"), Me = k && !Be && Mt(_.find((b) => b.id === k.project_id), "imports.withdraw"), we = k && !Be && Mt(_.find((b) => b.id === k.project_id), "imports.create");
  async function qe(b, ge = {}) {
    const pe = await Qt("/api/v1/task-packages" + b, {
      ...ge,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...ge.headers }
    }), Ye = await pe.json().catch(() => ({}));
    if (!pe.ok) throw new Error(Ye.message || "接入服务暂未就绪，请稍后刷新。");
    return Ye;
  }
  const tt = async (b) => {
    te(!0), Q(""), Ce("");
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
    ce != null && ce.url && URL.revokeObjectURL(ce.url);
  }, [ce == null ? void 0 : ce.url]), r.useEffect(() => {
    Ne(""), F([]), Q(""), Ce(""), Ee(null), Ae(""), de(null);
  }, [h, V, G]), r.useEffect(() => {
    let b = !1;
    return B(!0), se(null), Q(""), (async () => {
      try {
        if (T && Rt) {
          const pe = await Qt("/api/v1/platform-archives"), Ye = await pe.json();
          if (!pe.ok) throw new Error(Ye.message);
          b || ne(Ye.items);
        } else if (T) {
          const pe = await qe("/samples");
          b || xe(pe.items);
        } else if (U) {
          const pe = await qe("/" + U);
          b || se(pe);
        } else {
          const pe = await qe(`?project_id=${V}${G ? "&state=" + G : ""}${fe ? "&cursor=" + encodeURIComponent(fe) : ""}`);
          b || (K(pe.items), Oe(pe.next_cursor));
        }
      } catch (pe) {
        b || Q(pe.message);
      } finally {
        b || B(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [h, V, G, fe, re]), r.useEffect(() => {
    if (Rt || !T || !De) return;
    let b = !1;
    de(null), We("");
    const ge = Ze + "." + (Re === "v2" ? "complete" : Re);
    return qe(`/samples/${Re}?project_id=${V}&task_id=${ge}`).then((pe) => {
      b || We(JSON.stringify(pe, null, 2));
    }).catch((pe) => {
      b || Q(pe.message);
    }), () => {
      b = !0;
    };
  }, [T, V, Re, Ze]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !U && M.some((pe) => ["received", "validating", "processing"].includes(pe.status))) || T) return;
    const ge = setInterval(() => Z((pe) => pe + 1), 1800);
    return () => clearInterval(ge);
  }, [k == null ? void 0 : k.status, M, h]);
  const Ke = () => tt(async () => {
    const b = et.current;
    de(null);
    const ge = await qe("/preview", { method: "POST", body: je });
    et.current === b && de(ge);
  }), dt = () => tt(async () => {
    var ge;
    if (!X) return;
    ((ge = ct.current) == null ? void 0 : ge.hash) !== X.content_hash && (ct.current = { hash: X.content_hash, key: crypto.randomUUID() });
    const b = await qe("", { method: "POST", headers: { "Idempotency-Key": ct.current.key }, body: je });
    Ce(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + b.receipt_id);
  }), ve = (b) => tt(async () => {
    const ge = et.current;
    Ee(null);
    const pe = await Qt(`/api/v1/task-packages/${U}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!pe.ok) {
      const nt = await pe.json().catch(() => ({}));
      throw new Error(nt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Ye = await pe.blob();
    if (ge === et.current)
      if (b.mime_type.startsWith("text/")) {
        const nt = await Ye.slice(0, 1e6).text();
        ge === et.current && Ee({ id: b.attachment_id, url: null, text: nt });
      } else if (b.mime_type.startsWith("image/")) Ee({ id: b.attachment_id, url: URL.createObjectURL(Ye), text: null });
      else {
        const nt = URL.createObjectURL(Ye), D = document.createElement("a");
        D.href = nt, D.download = "任务附件", D.click(), URL.revokeObjectURL(nt);
      }
  }), ht = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !he.length || m, onClick: () => {
        Ne(he.at(-1) || ""), F(he.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Se || m, onClick: () => {
        F([...he, fe]), Ne(Se || "");
      }, children: "下一页" })
    ] })
  ] });
  return _.length ? Be && T ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Df, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Be ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: T ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !Be && _.some((b) => Mt(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Ee(null), Z((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    y && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      y
    ] }),
    le && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      le
    ] }),
    !U && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (b) => A(b.target.value), children: _.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !T && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: G, onChange: (b) => v(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: Mn[b] }, b))
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : T ? De ? Rt ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        oe.filter((b) => b.project_id === V).map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            b.title,
            " · 第",
            b.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void tt(async () => {
            const ge = await Qt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), pe = await ge.json();
            if (!ge.ok) throw new Error(pe.message);
            o("/task-packages/" + pe.receipt_id);
          }), children: "接入此成果" })
        ] }, b.id)),
        !oe.some((b) => b.project_id === V) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Re, onChange: (b) => Xe(b.target.value), children: H.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => Qe("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: P, onChange: (b) => {
              var pe;
              const ge = (pe = b.target.files) == null ? void 0 : pe[0];
              if (ge) {
                if (ge.size > 5242880) {
                  Q("文件超过5MiB上限。");
                  return;
                }
                ge.text().then((Ye) => {
                  We(Ye), de(null), Q("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: je, onChange: (b) => {
              We(b.target.value), de(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || !je, onClick: () => void Ke(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !X, onClick: () => void dt(), children: [
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
          ((E = _.find((b) => b.id === X.project_id)) == null ? void 0 : E.name) || X.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(X.counts).map(([b, ge]) => /* @__PURE__ */ s.jsxs("span", { children: [
          Cu[b],
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
              ((w = _.find((b) => b.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
              " · 第",
              k.package_version,
              "版 · ",
              Mn[k.status],
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
        k.capabilities.map((b) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Yv[b] }, b)),
        k.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        we && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void tt(async () => {
          const b = await Qt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), ge = await b.json();
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
            Bn((I = k.task) == null ? void 0 : I.started_at),
            "　结束：",
            Bn((_e = k.task) == null ? void 0 : _e.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((He = k.participants) == null ? void 0 : He.map((b) => Ou(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (at = k.issues) == null ? void 0 : at.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              Bn(b.due_at)
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
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (rt = k.events) != null && rt.length ? k.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Bn(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? cm[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Qv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === k.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Ou(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((ge) => {
                  var Ye;
                  const pe = (Ye = k.attachments) == null ? void 0 : Ye.find((nt) => nt.attachment_id === ge);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: P || !pe || pe.state !== "verified", onClick: () => pe && void ve(pe), children: [
                    pe ? Eu[pe.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ge
                  ] }, ge);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: P, onClick: () => void tt(async () => {
            const b = await qe("/" + U + "?event_after=" + k.event_next);
            se({ ...b, events: [...k.events || [], ...b.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (L = k.attachments) != null && L.length ? k.attachments.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                Eu[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Mn[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || b.state !== "verified", onClick: () => void ve(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ce && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ee(null), children: "关闭预览" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "证据附件 · ",
              ce.id
            ] }),
            ce.url && /* @__PURE__ */ s.jsx("img", { src: ce.url, alt: "任务证据附件" }),
            ce.text && /* @__PURE__ */ s.jsx("pre", { children: ce.text })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (ie = k.versions) == null ? void 0 : ie.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === k.id, onClick: () => o("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            Mn[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (ae = k.diff) != null && ae.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Le = k.diff) == null ? void 0 : Le.changes.map((b, ge) => {
            var pe, Ye, nt, D, x;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                Cu[b.section] || b.section,
                "有变化"
              ] }),
              "before" in b ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ma(b.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ma(b.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((pe = b.added) == null ? void 0 : pe.join("、")) || "无",
                  "；移除：",
                  ((Ye = b.removed) == null ? void 0 : Ye.join("、")) || "无"
                ] }),
                b.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (nt = b.before_order) == null ? void 0 : nt.join(" → "),
                  "　调整为　",
                  (D = b.after_order) == null ? void 0 : D.join(" → ")
                ] }),
                (x = b.changed) == null ? void 0 : x.map((ue) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      ue.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ma(ue.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ma(ue.after) })
                  ] })
                ] }, ue.id))
              ] })
            ] }, ge);
          })
        ] }),
        (Me || we && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          we && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void tt(async () => {
            const b = await Qt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            Ce("已提交重试，已保存事件与附件不会重复新增。"), Z((ge) => ge + 1);
          }), children: "重试接入" }),
          Me && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: $, maxLength: 2e3, onChange: (b) => Ae(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: P || !$.trim(), onClick: () => void tt(async () => {
              var pe;
              const b = JSON.stringify({ reason: $ }), ge = k.id + b;
              ((pe = lt.current) == null ? void 0 : pe.body) !== ge && (lt.current = { body: ge, key: crypto.randomUUID() }), await qe("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": lt.current.key }, body: b }), Ee(null), Z((Ye) => Ye + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      M.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ s.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ s.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: M.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
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
          /* @__PURE__ */ s.jsx("td", { children: Mn[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Df, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      ht
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function rm(u, h, _, o) {
  const T = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(_) });
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
const qn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Vv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Jv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Fi = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Kv({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var rt;
  const U = h.split("/")[2], V = h.endsWith("/review"), [A, G] = r.useState([]), [v, M] = r.useState(null), [K, k] = r.useState(null), [se, fe] = r.useState(!1), [Ne, Se] = r.useState(!0), [Oe, he] = r.useState(""), [F, oe] = r.useState(""), [ne, H] = r.useState(0), [xe, Re] = r.useState("llm"), [Xe, Ze] = r.useState("task_process"), [Qe, je] = r.useState(((rt = o.find((L) => Mt(L, "retrospective.generate"))) == null ? void 0 : rt.id) || ""), [We, X] = r.useState([]), [de, y] = r.useState(""), [Q, le] = r.useState([]), [Ce, m] = r.useState([]), [B, P] = r.useState(""), [te, re] = r.useState(!1), [Z, $] = r.useState(""), [Ae, ce] = r.useState(""), [Ee, ct] = r.useState(""), [lt, et] = r.useState(null), [Be, De] = r.useState([]), [Me, we] = r.useState(null), [qe, tt] = r.useState(""), [Ke, dt] = r.useState(""), ve = o.some((L) => Mt(L, "retrospective.generate")), ht = !!(v != null && v.is_current) && !!Mt(o.find((L) => L.id === v.project_id), "retrospective.edit"), ye = !!(v != null && v.is_current) && !!Mt(o.find((L) => L.id === v.project_id), "retrospective.review");
  r.useEffect(() => {
    $(""), P(""), re(!1), he(""), oe(""), ct(""), De([]), we(null);
  }, [h]), r.useEffect(() => {
    let L = !1;
    return Se(!0), M(null), he(""), (async () => {
      try {
        if (U) {
          const ae = await u(`/retrospectives/${U}${Z ? "?revision_id=" + Z : ""}`);
          L || (M(ae), k({ summary: ae.summary, findings: structuredClone(ae.findings), suggestions: structuredClone(ae.suggestions) }), re(!1));
        } else {
          const ae = await u(`/retrospectives?limit=20${Ae ? "&state=" + Ae : ""}${Ee ? "&cursor=" + encodeURIComponent(Ee) : ""}`);
          L || (G(ae.items), et(ae.next_cursor));
        }
      } catch (ae) {
        L || he(ae.message);
      } finally {
        L || Se(!1);
      }
    })(), () => {
      L = !0;
    };
  }, [U, h, Z, Ae, Ee, ne]), r.useEffect(() => {
    if (U || !Qe || !ve) return;
    let L = !1;
    return m([]), X([]), le([]), y(""), (async () => {
      var ae;
      try {
        const [Le, b] = await Promise.all([u(`/task-packages?project_id=${Qe}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${Qe}&limit=100`)]);
        if (L) return;
        const ge = Le.items.filter((pe) => pe.is_current);
        X(ge), y(((ae = ge[0]) == null ? void 0 : ae.id) || ""), le(b.items);
      } catch (Le) {
        L || he(Le.message);
      }
    })(), () => {
      L = !0;
    };
  }, [U, Qe, ne]), r.useEffect(() => {
    if (!(Me != null && Me.asset_id) || Me.type !== "task_attachment") {
      tt(""), dt("");
      return;
    }
    let L = !1, ie = "";
    return Qt("/api/v1/assets/" + Me.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + T } }).then(async (ae) => {
      if (!ae.ok) {
        const b = await ae.json();
        throw new Error(b.message);
      }
      const Le = await ae.blob();
      !L && /^(image\/|text\/plain)/.test(Le.type) && (ie = URL.createObjectURL(Le), tt(ie), dt(Le.type));
    }).catch((ae) => {
      L || he(ae.message);
    }), () => {
      L = !0, ie && URL.revokeObjectURL(ie), tt("");
    };
  }, [Me, T]);
  const E = async (L) => {
    fe(!0), he(""), oe("");
    try {
      await L();
    } catch (ie) {
      he(ie.message);
    } finally {
      fe(!1);
    }
  }, w = () => ({ revision_id: v.revision_id, row_version: v.row_version, reason: B, evidence_checked: te }), I = !!v && !!K && JSON.stringify(K) === JSON.stringify({ summary: v.summary, findings: v.findings, suggestions: v.suggestions }), _e = (L) => void E(async () => {
    const ie = L === "submit" ? `/retrospectives/${U}/submit-review` : `/reviews/${v.revision_id}/${L}`;
    await u(ie, { method: "POST", body: JSON.stringify(w()) }), oe("已保存本版本的审核状态与意见。"), H((ae) => ae + 1);
  }), He = (L, ie) => L.map((ae, Le) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ae.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Vv[ae.claim_kind] }),
      ae.record_status && /* @__PURE__ */ s.jsx("strong", { children: ae.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ae.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && ht ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ae.id, value: ae.text, onChange: (b) => k((ge) => ge && { ...ge, [ie]: ge[ie].map((pe, Ye) => Ye === Le ? { ...pe, text: b.target.value, review_state: "unconfirmed" } : pe) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ae.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ae.evidence_refs.map((b, ge) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => we(v.evidence.find((pe) => pe.id === b) || null), children: [
      "查看证据 ",
      ge + 1
    ] }, b)) }),
    V && ht && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ae.review_state === "confirmed", onChange: (b) => k((ge) => ge && { ...ge, [ie]: ge[ie].map((pe, Ye) => Ye === Le ? { ...pe, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : pe) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ae.id)), at = (L) => L.map((ie) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Fi(ie.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Jv[ie.event_type] || "未知事件类型：" + ie.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof ie.payload.note == "string" ? ie.payload.note : Object.keys(ie.payload).length ? JSON.stringify(ie.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => we(v.evidence.find((ae) => ae.reference === "event:" + ie.event_id) || null), children: "打开事件记录" }),
    ie.evidence_refs.map((ae) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Le = v.evidence.find((b) => b.reference === "attachment:" + ae);
      Le ? we(Le) : he("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ae
    ] }, ae))
  ] }, ie.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(uv, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Oe && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      Oe,
      /* @__PURE__ */ s.jsx("button", { onClick: () => H((L) => L + 1), children: "重新加载" })
    ] }),
    F && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      F
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => H((L) => L + 1), disabled: se, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : U ? v && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: v.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            v.version,
            " · ",
            qn[v.state],
            " · ",
            v.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            v.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: v.revision_id, onChange: (L) => $(L.target.value), children: v.revisions.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
            "v",
            L.version,
            " · ",
            qn[L.state]
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _(`/retrospectives/${U}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !v.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && ht ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: K.summary, onChange: (L) => k({ ...K, summary: L.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: v.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            v.sources.task_package_id ? "固定任务包 v" + v.sources.package_version : "固定历史版本 " + v.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          v.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/task-packages/" + v.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            v.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: at(v.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            v.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: at(v.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            v.timeline.intervals.length ? v.timeline.intervals.map((L, ie) => /* @__PURE__ */ s.jsxs("p", { children: [
              L.name,
              "：",
              L.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, ie)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            v.timeline.deadlines.length ? v.timeline.deadlines.map((L) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                L.issue_id,
                " · ",
                L.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: L.reason || `明确期限 ${Fi(L.due_at || null)}；复核记录 ${Fi(L.accepted_at || null)}；晚于期限 ${L.late_seconds / 60} 分钟。` })
            ] }, L.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ s.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            He(K.findings, "findings"),
            /* @__PURE__ */ s.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            He(K.suggestions, "suggestions")
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
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: B, onChange: (L) => P(L.target.value) })
          ] }),
          ht && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || I || !B.trim(), onClick: () => void E(async () => {
              await u(`/retrospectives/${U}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), oe("已保存新草稿版本，旧内容及审核意见保留。"), H((L) => L + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(v.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !I || !B.trim(), onClick: () => _e("submit"), children: "提交当前版本审核" })
          ] }),
          ye && v.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te, onChange: (L) => re(L.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !te || !I || !B.trim(), onClick: () => _e("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !I || !B.trim(), onClick: () => _e("request-changes"), children: "退回修改" })
            ] })
          ] }),
          ht && v.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !I || !B.trim(), onClick: () => void E(async () => {
            const L = await u(`/retrospectives/${U}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            oe(L.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), H((ie) => ie + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      v.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: v.draft_ids.map((L) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _("/knowledge/" + L + "/edit"), children: "打开经验候选" }, L)) })
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
        v.review_actions.map((L, ie) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            L.version,
            " · ",
            qn[L.action] || L.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: L.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Fi(L.created_at) })
        ] }, ie))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      ve && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: xe, onChange: (L) => Re(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Xe, onChange: (L) => Ze(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Qe, onChange: (L) => je(L.target.value), children: o.filter((L) => Mt(L, "retrospective.generate")).map((L) => /* @__PURE__ */ s.jsx("option", { value: L.id, children: L.name }, L.id)) })
            ] })
          ] }),
          Xe === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: de, onChange: (L) => y(L.target.value), children: We.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
              L.name,
              " · 包v",
              L.package_version
            ] }, L.id)) }),
            !We.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Q.map((L) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ce.includes(L.record_version_id), onChange: (ie) => m(ie.target.checked ? [...Ce, L.record_version_id] : Ce.filter((ae) => ae !== L.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              L.description || "未填写描述",
              " · 来源v",
              L.current_version
            ] })
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Xe === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || (Xe === "task_process" ? !de : !Ce.length || Ce.length > 20), onClick: () => void E(async () => {
              const L = await rm(u, "/retrospective-generation-jobs", { mode: Xe, generation_mode: xe, task_package_id: Xe === "task_process" ? de : null, record_version_ids: Xe === "historical_case" ? Ce : [], template_version: "process-review-v1" }, () => oe("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              _("/retrospectives/" + L.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Ae, onChange: (L) => {
            ce(L.target.value), ct(""), De([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((L) => /* @__PURE__ */ s.jsx("option", { value: L, children: qn[L] }, L))
          ] })
        ] }),
        A.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: A.map((L) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              L.title,
              /* @__PURE__ */ s.jsx("small", { children: L.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: L.sources.task_package_id ? "任务包 v" + L.sources.package_version : L.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              L.version,
              " · ",
              qn[L.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/retrospectives/" + L.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/retrospectives/" + L.id + "/review"), children: "核查与审核" })
            ] })
          ] }, L.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !Be.length, onClick: () => {
              ct(Be.at(-1) || ""), De(Be.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !lt, onClick: () => {
              De([...Be, Ee]), ct(lt || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    Me && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => we(null), children: /* @__PURE__ */ s.jsx(Pi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Me.type === "process_event" ? "实际事件记录" : Me.type === "task_attachment" ? "任务附件" : Me.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: Me.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(Me.locator)
      ] }),
      qe && Ke.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: qe, alt: "来源证据" }),
      qe && Ke.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: qe }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const qs = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, Da = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Vf = { selected: [], text: "", row_version: 0 };
function $v({ api: u, path: h, navigate: _, projects: o }) {
  var ke, it, pt;
  const T = h.startsWith("/learn"), U = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || U ? h.split("/")[3] : "", A = /^\/training\/questions\/[^/]+$/.test(h), G = A ? h.split("/")[3] : "", v = h === "/training/questions", M = h === "/training/packages", K = h === "/training/results", k = o.some((j) => Mt(j, "training.manage")), se = o.some((j) => Mt(j, "training.review")), [fe, Ne] = r.useState("llm"), [Se, Oe] = r.useState(""), [he, F] = r.useState(((ke = o.find((j) => Mt(j, "training.manage"))) == null ? void 0 : ke.id) || ((it = o[0]) == null ? void 0 : it.id) || ""), [oe, ne] = r.useState([]), [H, xe] = r.useState([]), [Re, Xe] = r.useState([]), [Ze, Qe] = r.useState([]), [je, We] = r.useState(null), [X, de] = r.useState(null), [y, Q] = r.useState(""), [le, Ce] = r.useState(!1), [m, B] = r.useState([]), [P, te] = r.useState(["single_choice", "case_answer"]), [re, Z] = r.useState([]), [$, Ae] = r.useState("新人风险识别与复盘练习"), [ce, Ee] = r.useState("learning-" + Date.now()), [ct, lt] = r.useState(1), [et, Be] = r.useState(null), [De, Me] = r.useState({}), [we, qe] = r.useState(null), [tt, Ke] = r.useState("rules"), [dt, ve] = r.useState("useful"), [ht, ye] = r.useState(""), [E, w] = r.useState({}), [I, _e] = r.useState({}), [He, at] = r.useState(""), [rt, L] = r.useState(""), [ie, ae] = r.useState(null), [Le, b] = r.useState([]), [ge, pe] = r.useState(!0), [Ye, nt] = r.useState(!1), [D, x] = r.useState(""), [ue, be] = r.useState(""), [st, N] = r.useState(0);
  r.useEffect(() => {
    L(""), b([]), Q(""), Ce(!1), be(""), x(""), Z([]);
  }, [h]), r.useEffect(() => {
    let j = !1;
    return pe(!0), x(""), We(null), Be(null), qe(null), (async () => {
      try {
        if (V)
          if (U) {
            const ze = await u(`/training/attempts/${V}/result?teacher=true`);
            j || qe(ze);
          } else {
            const ze = await u("/training/attempts/" + V);
            if (j) return;
            if (Be(ze), Me(Object.fromEntries(ze.saved_answers.map((Pe) => [Pe.question_revision_id, { ...Pe.answer, row_version: Pe.row_version }]))), ze.state === "submitted") {
              const Pe = await u(`/training/attempts/${V}/result`);
              j || qe(Pe);
            }
          }
        else if (A) {
          const ze = await u("/training/questions/" + G);
          j || (We(ze), de(structuredClone(ze.content)));
        } else if (T) {
          const [ze, Pe] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          j || (xe(ze.items), Qe(Pe.items));
        } else if (K) {
          const ze = await u(`/training/results?limit=20${rt ? "&cursor=" + rt : ""}`);
          j || (Qe(ze.items), ae(ze.next_cursor));
        } else if (M) {
          const [ze, Pe] = await Promise.all([u(`/training/packages?limit=20${rt ? "&cursor=" + rt : ""}`), u("/training/questions?state=approved&limit=100")]);
          j || (xe(ze.items), ne(Pe.items), ae(ze.next_cursor));
        } else {
          const [ze, Pe] = await Promise.all([u(`/training/questions?limit=20${He ? "&state=" + He : ""}${rt ? "&cursor=" + rt : ""}`), u("/knowledge/library?limit=100&project_id=" + he)]);
          j || (ne(ze.items), Xe(Pe.items), ae(ze.next_cursor));
        }
      } catch (ze) {
        j || x(ze.message);
      } finally {
        j || pe(!1);
      }
    })(), () => {
      j = !0;
    };
  }, [h, he, He, rt, st]), r.useEffect(() => {
    if (!(we != null && we.grading_job) || !["queued", "running", "retrying"].includes(we.grading_job.status)) return;
    const j = window.setTimeout(() => N((Te) => Te + 1), 1800);
    return () => clearTimeout(j);
  }, [(pt = we == null ? void 0 : we.grading_job) == null ? void 0 : pt.status, st]);
  const me = async (j) => {
    nt(!0), x(""), be("");
    try {
      await j();
    } catch (Te) {
      x(Te.message);
    } finally {
      nt(!1);
    }
  }, Ve = !!je && !!X && JSON.stringify(X) === JSON.stringify(je.content), kt = () => ({ revision_id: je.revision_id, row_version: je.row_version, reason: y, evidence_checked: le }), Lt = (j) => void me(async () => {
    await u(j === "submit" ? `/training/questions/${G}/submit-review` : `/reviews/${je.revision_id}/${j}`, { method: "POST", body: JSON.stringify(kt()) }), be("题目审核状态已保存到统一审核记录。"), N((Te) => Te + 1);
  }), qt = async (j) => {
    const Te = De[j.revision_id] || Vf, ze = await u(`/training/attempts/${V}/answers/${j.question_id}`, { method: "PUT", body: JSON.stringify(Te) });
    return Me((Pe) => ({ ...Pe, [j.revision_id]: { ...Te, row_version: ze.row_version } })), ze;
  }, ut = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Le.length, onClick: () => {
        L(Le.at(-1) || ""), b(Le.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !ie, onClick: () => {
        b([...Le, rt]), L(ie || "");
      }, children: "下一页" })
    ] })
  ] }), Nt = (j, Te, ze) => ze ? [...j, Te] : j.filter((Pe) => Pe !== Te), g = (j) => void me(async () => {
    const Te = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: j.id, grading_mode: tt }) });
    _("/learn/attempts/" + Te.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(lc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: T ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    D && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      D
    ] }),
    ue && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
      ue
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !T && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: v || A ? "selected" : "", onClick: () => _("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: M ? "selected" : "", onClick: () => _("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || U ? "selected" : "", onClick: () => _("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => _("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => N((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ge ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : we ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: qs[we.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: we.confirmed_total === null ? "待确认" : we.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: we.provisional_total === null ? "待评分" : we.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: we.max_score })
            ] })
          ] }),
          we.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              we.grading_job.status === "failed" ? "暂未完成" : we.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            we.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: we.grading_job.error }),
            U && k && we.grading_job.status === "failed" && we.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void me(async () => {
              await u("/jobs/" + we.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: we.grading_job.row_version }) }), N((j) => j + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          we.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: we.restriction_note }),
          we.answers.map((j, Te) => {
            var ze, Pe, Zt, _s, fs, At, ul, Qs;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Te + 1,
                "题 ",
                j.type ? Da[j.type] : ""
              ] }),
              j.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: j.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((ze = j.answer) == null ? void 0 : ze.text) || ((Pe = j.answer) == null ? void 0 : Pe.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Zt = j.reference_answer) == null ? void 0 : Zt.text) || ((fs = (_s = j.reference_answer) == null ? void 0 : _s.selected) == null ? void 0 : fs.join("、"))
                ] }),
                (At = j.rubric) == null ? void 0 : At.map((f, Y) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  f.point,
                  " · ",
                  f.points,
                  "分"
                ] }, Y)),
                /* @__PURE__ */ s.jsx("p", { children: (ul = j.feedback) == null ? void 0 : ul.message }),
                ((Qs = j.feedback) == null ? void 0 : Qs.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
                  "教员说明：",
                  j.feedback.human_review_reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "建议分：",
                j.suggested_score ?? "无",
                " · 确认分：",
                j.confirmed_score ?? "待确认",
                " · ",
                j.score_kind === "model_suggestion" ? "大模型建议" : j.score_kind === "rule_suggestion" ? "规则建议，需复核" : j.score_kind === "human_confirmed" ? "人工确认" : j.score_kind === "pending" ? "待评分" : "客观题规则评分"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "评分规则：",
                j.scoring_version,
                " · 评分器：",
                j.model_ref
              ] }),
              U && k && j.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: E[j.id] ?? String(j.confirmed_score ?? j.suggested_score ?? ""), onChange: (f) => w({ ...E, [j.id]: f.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: I[j.id] || "", onChange: (f) => _e({ ...I, [j.id]: f.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye || !(I[j.id] || "").trim() || (E[j.id] ?? String(j.confirmed_score ?? j.suggested_score ?? "")) === "", onClick: () => void me(async () => {
                  await u("/training/answers/" + j.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: j.row_version, score: Number(E[j.id] ?? j.confirmed_score ?? j.suggested_score), reason: I[j.id] }) }), be("人工确认分已保存，原建议分和复核轨迹保留。"), N((f) => f + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, j.id);
          })
        ] })
      ] }),
      !U && we.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: dt, onChange: (j) => ve(j.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: ht, onChange: (j) => ye(j.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void me(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: dt, comment: ht }) }), be("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : et ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          et.package_title,
          " · v",
          et.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      et.questions.map((j) => {
        const Te = De[j.revision_id] || Vf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            j.position,
            "题 · ",
            Da[j.type],
            " · ",
            j.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: j.stem }),
          j.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + j.position + "题回答", value: Te.text, onChange: (ze) => Me({ ...De, [j.revision_id]: { ...Te, text: ze.target.value } }) })
          ] }) : j.options.map((ze) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: j.type === "single_choice" ? "radio" : "checkbox", name: j.revision_id, checked: Te.selected.includes(ze.id), onChange: (Pe) => Me({ ...De, [j.revision_id]: { ...Te, selected: j.type === "single_choice" ? [ze.id] : Nt(Te.selected, ze.id, Pe.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              ze.id.toUpperCase(),
              " · ",
              ze.text
            ] })
          ] }, ze.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void me(async () => {
              await qt(j), be("第" + j.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Te.row_version
            ] })
          ] })
        ] }, j.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye, onClick: () => void me(async () => {
        for (const j of et.questions) await qt(j);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), N((j) => j + 1), be("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : A && je && X ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Da[je.type],
            " · v",
            je.version,
            " · ",
            qs[je.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: je.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: X.stem, disabled: !k, onChange: (j) => de({ ...X, stem: j.target.value }) })
          ] }),
          X.options.map((j, Te) => {
            var ze;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              j.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: j.text, disabled: !k, onChange: (Pe) => de({ ...X, options: X.options.map((Zt, _s) => _s === Te ? { ...Zt, text: Pe.target.value } : Zt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((ze = X.answer.selected) == null ? void 0 : ze.includes(j.id)) || !1, onChange: (Pe) => de({ ...X, answer: { selected: Nt(X.answer.selected || [], j.id, Pe.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, j.id);
          }),
          je.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: X.answer.text || "", disabled: !k, onChange: (j) => de({ ...X, answer: { text: j.target.value } }) })
            ] }),
            X.rubric.map((j, Te) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: j.point, disabled: !k, onChange: (ze) => de({ ...X, rubric: X.rubric.map((Pe, Zt) => Zt === Te ? { ...Pe, point: ze.target.value } : Pe) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: j.keywords.join("，"), disabled: !k, onChange: (ze) => de({ ...X, rubric: X.rubric.map((Pe, Zt) => Zt === Te ? { ...Pe, keywords: ze.target.value.split(/[,，]/).filter(Boolean) } : Pe) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: j.points, disabled: !k, onChange: (ze) => de({ ...X, rubric: X.rubric.map((Pe, Zt) => Zt === Te ? { ...Pe, points: Number(ze.target.value) } : Pe) }) })
              ] })
            ] }, Te))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          je.source_versions.map((j) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: j }) }, j)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: y, onChange: (j) => Q(j.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye || Ve || !y.trim(), onClick: () => void me(async () => {
              await u(`/training/questions/${G}/draft`, { method: "PATCH", body: JSON.stringify({ ...kt(), content: X }) }), be("新题目版本已保存，不改变旧学习包与成绩。"), N((j) => j + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(je.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !Ve || !y.trim(), onClick: () => Lt("submit"), children: "提交题目审核" })
          ] }),
          se && je.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le, onChange: (j) => Ce(j.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !le || !Ve || !y.trim(), onClick: () => Lt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ye || !Ve || !y.trim(), onClick: () => Lt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          je.revisions.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            j.version,
            " · ",
            qs[j.state]
          ] }, j.id)),
          je.review_actions.map((j, Te) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            j.version,
            " · ",
            qs[j.action] || j.action,
            " · ",
            j.reason
          ] }, Te))
        ] })
      ] })
    ] }) : T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: tt, onChange: (j) => Ke(j.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          H.length ? H.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: j.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              j.version,
              " · ",
              j.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye, onClick: () => g(j), children: "开始本次练习" })
          ] }, j.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Ze.map((j) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => _("/learn/attempts/" + j.id), children: [
            qs[j.state],
            " · ",
            qs[j.result_state],
            " · ",
            new Date(j.started_at).toLocaleString("zh-CN")
          ] }) }, j.id)),
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
        /* @__PURE__ */ s.jsx("tbody", { children: Ze.map((j) => {
          var Te;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              j.title,
              " · v",
              j.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Te = j.learner_id) == null ? void 0 : Te.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              qs[j.state],
              " · ",
              qs[j.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: j.state !== "submitted", onClick: () => _("/training/results/" + j.id), children: "查看结果与复核" }) })
          ] }, j.id);
        }) })
      ] }) }),
      ut
    ] }) : M ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      k && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "组建固定版本学习包" }),
          /* @__PURE__ */ s.jsx("span", { children: "只选用当前已审核题目；修改后创建新包版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: he, onChange: (j) => {
                F(j.target.value), Z([]);
              }, children: o.filter((j) => Mt(j, "training.manage")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: Se, onChange: (j) => Oe(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: $, onChange: (j) => Ae(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ce, onChange: (j) => Ee(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: ct, onChange: (j) => lt(Number(j.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: oe.filter((j) => j.project_id === he).map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: re.includes(j.revision_id), onChange: (Te) => Z((ze) => Nt(ze, j.revision_id, Te.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Da[j.type],
              " · ",
              j.title,
              " · v",
              j.version
            ] })
          ] }, j.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ye || !re.length || re.length > 30 || !$.trim(), onClick: () => void me(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: $, package_key: ce, version: ct, project_id: he, question_revision_ids: re, role_scope: ["learner", "admin", "teacher"], audience_subjects: Se.split(/[,，\n]/).map((j) => j.trim()).filter(Boolean) }) }), be("学习包草稿已建立，发布后学员可使用。"), N((j) => j + 1);
          }), children: [
            "创建学习包草稿（",
            re.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: H.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            j.title,
            " · v",
            j.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            qs[j.state],
            " · ",
            j.question_count,
            "题 · ",
            j.package_key
          ] }),
          j.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void me(async () => {
            await u(`/training/packages/${j.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: j.row_version, reason: "发布已审核题目的固定版本学习包" }) }), be("学习包已发布。"), N((Te) => Te + 1);
          }), children: "发布此学习包版本" })
        ] }, j.id)) }),
        ut
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
            /* @__PURE__ */ s.jsx("select", { value: he, onChange: (j) => {
              F(j.target.value), B([]);
            }, children: o.filter((j) => Mt(j, "training.manage")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Re.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: m.includes(j.revision_id), onChange: (Te) => B((ze) => Nt(ze, j.revision_id, Te.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                j.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  j.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, j.revision_id)),
            !Re.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(Da).map(([j, Te]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: P.includes(j), onChange: (ze) => te((Pe) => Nt(Pe, j, ze.target.checked)) }),
            Te
          ] }, j)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: fe, onChange: (j) => Ne(j.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !m.length || m.length > 10 || !P.length, onClick: () => void me(async () => {
            const j = await rm(u, "/training/generation-jobs", { knowledge_revision_ids: m, types: P, generation_mode: fe }, () => be("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            be("已生成或复用" + j.items.length + "道候选题，仍需核查答案与来源后提交审核。"), N((Te) => Te + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: He, onChange: (j) => {
            at(j.target.value), L(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: qs[j] }, j))
          ] })
        ] }),
        oe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: oe.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.title }),
            /* @__PURE__ */ s.jsx("td", { children: Da[j.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version,
              " · ",
              qs[j.state],
              j.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/training/questions/" + j.id), children: "核查与审核" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        ut
      ] })
    ] })
  ] });
}
function Wv({ api: u }) {
  var Oe, he;
  const [h, _] = r.useState(null), [o, T] = r.useState([]), [U, V] = r.useState("openai"), [A, G] = r.useState(""), [v, M] = r.useState(!1), [K, k] = r.useState(""), [se, fe] = r.useState("");
  r.useEffect(() => {
    let F = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([oe, ne]) => {
      if (F) return;
      T(ne.items);
      const H = ne.items.find((xe) => xe.base_url === oe.base_url);
      if (!oe.model && !oe.api_key_configured) {
        const xe = ne.items[0];
        V(xe.id), _({ ...oe, base_url: xe.base_url, model: xe.default_model });
      } else
        V((H == null ? void 0 : H.id) || "custom"), _(oe);
    }).catch((oe) => {
      F || k(oe.message);
    }), () => {
      F = !0;
    };
  }, []);
  const Ne = (F) => {
    const oe = o.find((ne) => ne.id === F);
    V(F), G(""), fe(""), k(""), h && _({ ...h, base_url: (oe == null ? void 0 : oe.base_url) || "", model: (oe == null ? void 0 : oe.default_model) || "", api_key_configured: !1 });
  }, Se = async () => {
    if (h) {
      M(!0), k(""), fe("");
      try {
        const { api_key_configured: F, ...oe } = h, ne = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !0, ...A ? { api_key: A } : {} }) });
        if (_(ne), G(""), fe("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        fe("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (F) {
        fe(""), k(F.message);
      } finally {
        M(!1);
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
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: v, value: U, onChange: (F) => Ne(F.target.value), children: [
            o.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        U === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: v, value: h.base_url, onChange: (F) => _({ ...h, base_url: F.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (F) => _({ ...h, model: F.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (F) => _({ ...h, model: F.target.value }), children: [
            !((Oe = o.find((F) => F.id === U)) != null && Oe.models.some((F) => F.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (he = o.find((F) => F.id === U)) == null ? void 0 : he.models.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: v, value: A, onChange: (F) => G(F.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: h.timeout_seconds, onChange: (F) => _({ ...h, timeout_seconds: Number(F.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: h.max_tokens, onChange: (F) => _({ ...h, max_tokens: Number(F.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            h.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: v || !h.model || !A.trim() && !h.api_key_configured, onClick: () => void Se(), children: v ? "正在保存并测试…" : "保存并测试" }),
          h.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: v, onClick: () => {
            M(!0), k("");
            const { api_key_configured: F, ...oe } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !1 }) }).then((ne) => {
              _(ne), fe("云端调用已停用。");
            }).catch((ne) => k(ne.message)).finally(() => M(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Fv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Iv({ api: u, path: h, navigate: _, projects: o, identity: T, canManageModels: U }) {
  var P, te, re;
  const V = h === "/settings/models", A = U, G = o.some((Z) => Z.can_run), [v, M] = r.useState(((P = o.find((Z) => Z.can_run)) == null ? void 0 : P.id) || ""), [K, k] = r.useState([]), [se, fe] = r.useState([]), [Ne, Se] = r.useState(null), [Oe, he] = r.useState(Fv), [F, oe] = r.useState("llm"), [ne, H] = r.useState(sessionStorage.getItem("b07-extraction-" + T) || ""), [xe, Re] = r.useState(null), [Xe, Ze] = r.useState(!1), [Qe, je] = r.useState(!0), [We, X] = r.useState(""), [de, y] = r.useState(""), [Q, le] = r.useState(0), Ce = async (Z) => {
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
    return je(!0), X(""), fe([]), (async () => {
      var Ae;
      try {
        if (V) {
          if (!A) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!G || !v) throw new Error("当前身份没有知识加工权限。");
          const [ce, Ee] = await Promise.all([u(`/knowledge/source-options?project_id=${v}&limit=100`), u(`/knowledge/taxonomies?project_id=${v}`)]);
          Z || (k(ce.items), Se(Ee.items[0] || null), he(structuredClone(((Ae = Ee.items[0]) == null ? void 0 : Ae.categories) || Ee.suggested_categories)));
        }
      } catch (ce) {
        Z || X(ce.message);
      } finally {
        Z || je(!1);
      }
    })(), () => {
      Z = !0;
    };
  }, [h, v, Q]), r.useEffect(() => {
    if (!ne || V) return;
    let Z = !1, $;
    const Ae = async () => {
      try {
        const ce = await u("/knowledge/extraction-jobs/" + ne);
        if (Z) return;
        Re(ce), ["queued", "running", "retrying"].includes(ce.status) && ($ = window.setTimeout(() => void Ae(), 1800));
      } catch (ce) {
        Z || X(ce.message);
      }
    };
    return Ae(), () => {
      Z = !0, window.clearTimeout($);
    };
  }, [ne, h, Q]);
  const m = (Z, $) => he((Ae) => Ae.map((ce, Ee) => Ee === Z ? { ...ce, ...$ } : ce)), B = JSON.stringify(Oe) !== JSON.stringify((Ne == null ? void 0 : Ne.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Dl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    We && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      We
    ] }),
    de && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: de }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: V ? "" : "selected", onClick: () => _("/extraction"), children: "施工要点萃取" }),
        A && /* @__PURE__ */ s.jsx("button", { className: V ? "selected" : "", onClick: () => _("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => le((Z) => Z + 1), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Qe ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && A ? /* @__PURE__ */ s.jsx(Wv, { api: u }) : !V && G ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: v, onChange: (Z) => M(Z.target.value), children: o.filter((Z) => Z.can_run).map((Z) => /* @__PURE__ */ s.jsx("option", { value: Z.id, children: Z.name }, Z.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            Ne ? "分类 v" + Ne.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Oe.map((Z, $) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + ($ + 1), value: Z.code, onChange: (Ae) => m($, { code: Ae.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + ($ + 1), value: Z.name, onChange: (Ae) => m($, { name: Ae.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Z.focus, onChange: (Ae) => m($, { focus: Ae.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Z.keywords.join("，"), onChange: (Ae) => m($, { keywords: Ae.target.value.split(/[,，]/).map((ce) => ce.trim()).filter(Boolean) }) })
            ] }),
            Oe.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => he((Ae) => Ae.filter((ce, Ee) => Ee !== $)), children: "移除此类别" })
          ] }, $)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Oe.length >= 100, onClick: () => he([...Oe, { code: "category_" + (Oe.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(pv, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Xe || !B, onClick: () => void Ce(async () => {
              const Z = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: v, expected_version: (Ne == null ? void 0 : Ne.version) || 0, categories: Oe }) });
              Se(Z), he(Z.categories), y("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => fe(K.slice(0, 20).map((Z) => Z.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((Z) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se.includes(Z.record_version_id), onChange: ($) => fe((Ae) => $.target.checked ? [...Ae, Z.record_version_id] : Ae.filter((ce) => ce !== Z.record_version_id)) }),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: F, onChange: (Z) => oe(Z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Xe || !Ne || B || !se.length || se.length > 20, onClick: () => void Ce(async () => {
            const Z = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: se, taxonomy_id: Ne.id, mode: F }) });
            H(Z.job_id), sessionStorage.setItem("b07-extraction-" + T, Z.job_id), y("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            se.length,
            "条来源）"
          ] }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "模型自主完成分类、跨记录归纳与证据摘录，人工只核对候选。不会自动批准为有效标准或直接发布。" })
        ] })
      ] }),
      xe && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "最近加工任务 · ",
            xe.progress,
            "%"
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: xe.status })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          xe.error && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: xe.error }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "模式：",
            xe.result.generation_mode === "llm" ? "云端大模型" : xe.result.generation_mode === "mock" ? "本地模板演示" : "等待处理"
          ] }),
          xe.result.model && /* @__PURE__ */ s.jsxs("p", { children: [
            "模型：",
            xe.result.model.model_ref,
            " · 用量 ",
            JSON.stringify(xe.result.model.usage)
          ] }),
          (te = xe.result.items) == null ? void 0 : te.map((Z) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + Z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Z.item_id)),
          (re = xe.result.missing_information) == null ? void 0 : re.map((Z, $) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Z
          ] }, $)),
          xe.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Xe, onClick: () => void Ce(async () => {
            await u("/jobs/" + xe.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: xe.row_version }) }), le((Z) => Z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const Su = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Jf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Kf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, Ii = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Pv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function ep({ embedded: u = !1 }) {
  var st;
  const [h, _] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, T] = r.useState($i()), [U, V] = r.useState(!1), A = o === "/platform/services", G = o.startsWith("/archive-review/"), v = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [M, K] = r.useState(["/sources", "/imports", "/records"].some((N) => $i().startsWith(N))), k = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", se = !k && ["/quality", "/knowledge", "/reviews"].some((N) => o.startsWith(N)), fe = o.startsWith("/training") || o.startsWith("/learn"), Ne = o.startsWith("/workflows"), Se = o.startsWith("/standards"), Oe = Ne || Se || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", he = o.startsWith("/retrospectives"), F = o.startsWith("/task-packages"), oe = o === "/records", ne = !v && ["/sources", "/imports", "/records"].some((N) => o.startsWith(N)), [H, xe] = r.useState(null), [Re, Xe] = r.useState([]), [Ze, Qe] = r.useState({}), [je, We] = r.useState(!1), [X, de] = r.useState(""), [y, Q] = r.useState(""), [le, Ce] = r.useState(!0), [m, B] = r.useState(!1), [P, te] = r.useState(0), [re, Z] = r.useState(""), [$, Ae] = r.useState(""), [ce, Ee] = r.useState(""), [ct, lt] = r.useState(null), [et, Be] = r.useState([]), [De, Me] = r.useState(null), [we, qe] = r.useState(!1), [tt, Ke] = r.useState("demo-airport"), [dt, ve] = r.useState("success"), [ht, ye] = r.useState(null), [E, w] = r.useState(""), [I, _e] = r.useState("processor"), [He, at] = r.useState("demo-airport"), [rt, L] = r.useState([]);
  async function ie(N, me = {}) {
    const Ve = await Qt("/api/v1" + N, {
      ...me,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...me.headers }
    });
    if (!Ve.ok) {
      const kt = await Ve.json().catch(() => ({}));
      throw new Error(kt.message || `请求失败（${Ve.status}），请刷新后重试。`);
    }
    return Ve.json();
  }
  const ae = (N) => {
    var Ve, kt;
    const me = window;
    u && ((Ve = me.QaxcHasPendingEdits) != null && Ve.call(me)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((kt = me.QaxcClearPendingEdits) == null || kt.call(me), kj(N), T($i()), de(""), Me(null), Ee(""), Be([]));
  };
  r.useEffect(() => {
    const N = () => T($i());
    return window.addEventListener("popstate", N), window.addEventListener("hashchange", N), () => {
      window.removeEventListener("popstate", N), window.removeEventListener("hashchange", N);
    };
  }, []), r.useEffect(() => {
    const N = () => V(!0);
    return window.addEventListener("b-session-expired", N), () => window.removeEventListener("b-session-expired", N);
  }, []), r.useEffect(() => {
    let N = !1;
    Ce(!0), de(""), xe(null), ye(null), Xe([]), L([]);
    async function me() {
      try {
        const Ve = await ie("/me");
        if (N) return;
        const kt = window.QaxcProjectNames || {};
        u && (Ve.projects = Ve.projects.map((ut) => ({ ...ut, name: kt[ut.id] || ut.name })));
        const Lt = window.QaxcProjectId;
        u && Lt && (Ve.projects = Ve.projects.filter((ut) => ut.id === Lt)), xe(Ve);
        const qt = await ie("/health");
        if (N || (We(qt.worker_online), v || A || G || ne || se || k || F || he || fe || Oe)) return;
        if (o === "/settings/access") {
          if (!Ve.projects.some((g) => g.can_manage)) return;
          const [ut, Nt] = await Promise.all([ie("/access"), ie("/audit-events?limit=10")]);
          if (N) return;
          ye(ut), L(Nt.items), w((g) => {
            var ke;
            return ut.users.some((it) => it.id === g) ? g : ((ke = ut.users[0]) == null ? void 0 : ke.id) || "";
          });
        } else {
          const [ut, Nt] = await Promise.all([
            ie(`/jobs?limit=12${$ ? `&kind=${$}` : ""}${re ? `&status=${re}` : ""}${ce ? `&cursor=${encodeURIComponent(ce)}` : ""}`),
            ie("/dashboard")
          ]);
          if (N) return;
          Xe(ut.items), lt(ut.next_cursor), Qe(Nt.counts);
        }
      } catch (Ve) {
        N || de(Ve.message);
      } finally {
        N || Ce(!1);
      }
    }
    return me(), () => {
      N = !0;
    };
  }, [h, o, re, $, ce, P]), r.useEffect(() => {
    if (!H || v || A || G || o === "/settings/access" || ne || se || k || F || he || fe || Oe) return;
    let N = !1;
    const me = window.setInterval(async () => {
      try {
        const [Ve, kt, Lt] = await Promise.all([
          ie(`/jobs?limit=12${$ ? `&kind=${$}` : ""}${re ? `&status=${re}` : ""}${ce ? `&cursor=${encodeURIComponent(ce)}` : ""}`),
          ie("/dashboard"),
          ie("/health")
        ]);
        if (N) return;
        Xe(Ve.items), lt(Ve.next_cursor), Qe(kt.counts), We(Lt.worker_online), Me((qt) => qt ? Ve.items.find((ut) => ut.id === qt.id) || qt : null), de("");
      } catch (Ve) {
        N || (de(Ve.message), We(!1));
      }
    }, 2e3);
    return () => {
      N = !0, clearInterval(me);
    };
  }, [h, o, re, $, ce, H == null ? void 0 : H.id]);
  const Le = async (N) => {
    B(!0), de(""), Q("");
    try {
      await N(), te((me) => me + 1);
    } catch (me) {
      de(me.message);
    } finally {
      B(!1);
    }
  }, b = () => Le(async () => {
    await ie("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: tt, scenario: dt, duration_seconds: 6 })
    }), qe(!1), Q("任务已保存，处理服务会自动执行。"), ae("/jobs");
  }), ge = (N) => Le(async () => {
    await ie(`/jobs/${N.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: N.row_version })
    }), Q("已提交重试，原任务和来源保持不变。");
  }), pe = (N) => Le(async () => {
    const me = await Qt(`/api/v1/assets/${N.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!me.ok) {
      const Lt = await me.json();
      throw new Error(Lt.message);
    }
    const Ve = document.createElement("a"), kt = URL.createObjectURL(await me.blob());
    Ve.href = kt, Ve.download = `演示检查结果-${N.id.slice(0, 8)}.txt`, Ve.click(), URL.revokeObjectURL(kt), Q("演示结果已下载。");
  }), Ye = !Rt && (H == null ? void 0 : H.projects.some((N) => N.can_run)), nt = (N) => {
    const me = H == null ? void 0 : H.projects.find((kt) => kt.id === N.project_id);
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
    return !!Ve[N.kind] && me.permissions.includes(Ve[N.kind]);
  }, D = H == null ? void 0 : H.projects.some((N) => N.can_manage), x = Object.fromEntries(((H == null ? void 0 : H.projects) || []).map((N) => [N.id, N.name])), ue = v ? "A 成果接入" : A ? "平台服务" : G ? "归档成果复盘" : fe ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Oe ? Ne ? "隐患分析与知识成果" : Se ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : he ? "过程复盘与经验" : F ? "归档成果与证据" : k ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : se ? "知识加工与审核" : ne ? oe ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", be = (Ze.queued || 0) + (Ze.running || 0) + (Ze.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(Hf, { size: 26 }) }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          "工程风险",
          /* @__PURE__ */ s.jsx("span", { children: "知识与复盘培训中心" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "workspace-label", children: Rt ? "质量安全小察 / 知识与学习" : "B模块 / 开发工作区" }),
      /* @__PURE__ */ s.jsxs("nav", { "aria-label": "主导航", children: [
        Rt && /* @__PURE__ */ s.jsxs("button", { className: "nav-item", onClick: () => {
          window.location.href = "/quality/";
        }, children: [
          /* @__PURE__ */ s.jsx(Uf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Uf, "我的工作台"], ["/jobs", Pj, "处理任务"]].map(([N, me, Ve]) => {
          const kt = me;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Ve), className: o === N || N === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => ae(String(N)), children: [
            /* @__PURE__ */ s.jsx(kt, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Ve) }),
            /* @__PURE__ */ s.jsx(il, { size: 15 })
          ] }, String(N));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ne ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": M, "aria-controls": "governance-menu", onClick: () => K((N) => !N), children: [
          /* @__PURE__ */ s.jsx(Wi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(il, { className: M ? "expanded" : "", size: 15 })
        ] }),
        M && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([N, me]) => /* @__PURE__ */ s.jsx("button", { "aria-label": me, className: o.startsWith(N) ? "active" : "", onClick: () => ae(N), children: me }, N)) }),
        /* @__PURE__ */ s.jsxs("button", { className: se || Oe ? "nav-item active" : "nav-item", onClick: () => ae("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(Hn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => ae("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(Hn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: F ? "nav-item active" : "nav-item", onClick: () => ae("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(Hn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: he ? "nav-item active" : "nav-item", onClick: () => ae("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(zf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: fe ? "nav-item active" : "nav-item", onClick: () => ae(H != null && H.projects.some((N) => N.roles.some((me) => ["admin", "teacher", "reviewer"].includes(me))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(lc, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ae("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(wv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(il, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Wi, { size: 19 }),
        /* @__PURE__ */ s.jsx("strong", { children: "项目范围隔离" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "记录、文件和操作权限",
          /* @__PURE__ */ s.jsx("br", {}),
          "随当前身份实时检查。"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "sidebar-bottom", children: [
        /* @__PURE__ */ s.jsx("span", { className: "dot" }),
        Rt ? "平台账号 · 项目授权" : "本地开发 · B07",
        /* @__PURE__ */ s.jsx("span", { className: "version", children: "v0.7" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: u ? "main-shell embedded-main" : "main-shell", children: [
      !u && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx(il, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: ue })
        ] }),
        Rt ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (N) => {
            localStorage.setItem("b01-identity", N.target.value), _(N.target.value), Me(null), Ee(""), Be([]), Q("");
          }, children: Pv.map(([N, me]) => /* @__PURE__ */ s.jsx("option", { value: N, children: me }, N)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !v && !k && !A && !ne && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ne ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : fe ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : se || Oe ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : F ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([N, me]) => /* @__PURE__ */ s.jsx("button", { className: o === N ? "button primary" : "button ghost", onClick: () => ae(N), children: me }, N)) }),
        !(u && ne) && /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: ue }),
            /* @__PURE__ */ s.jsx("p", { children: v ? "指定版本接入、证据校验与过程复盘。" : fe ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : Ne ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : Se ? "保存规范原文与适用版本，核对来源后审核发布。" : Oe ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : he ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : F ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : se ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ne ? oe ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => te((N) => N + 1), disabled: le, children: [
              /* @__PURE__ */ s.jsx(Xs, { size: 16 }),
              "刷新"
            ] }),
            !Rt && !ne && !se && !k && !F && !he && !fe && !Oe && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Ye || m, onClick: () => {
              var N;
              Ke(((N = H == null ? void 0 : H.projects.find((me) => me.can_run)) == null ? void 0 : N.id) || "demo-airport"), qe(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(qf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Rt && !ne && !se && !k && !F && !he && !fe && !Oe && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
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
          /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
          X,
          /* @__PURE__ */ s.jsx("button", { onClick: () => te((N) => N + 1), children: "重新加载" })
        ] }),
        y && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Dl, { size: 18 }),
          y,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Q(""), children: /* @__PURE__ */ s.jsx(Pi, { size: 16 }) })
        ] }),
        U ? null : v ? H ? /* @__PURE__ */ s.jsx(Rj, { id: o.split("/").pop(), identity: H.id, projects: H.projects, navigate: ae }) : /* @__PURE__ */ s.jsx("p", { children: X || "正在读取身份…" }) : le ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Mf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : X ? null : A ? /* @__PURE__ */ s.jsx(Dj, { navigate: ae }, P) : G ? /* @__PURE__ */ s.jsx(Uj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: ae }, o) : fe ? /* @__PURE__ */ s.jsx($v, { api: ie, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [] }, h) : Ne ? /* @__PURE__ */ s.jsx(Aj, { api: ie, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((N) => N.id).join(","))) : Se ? /* @__PURE__ */ s.jsx(Ej, { api: ie, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((N) => N.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(wj, { api: ie, projects: (H == null ? void 0 : H.projects) || [] }) }) : Oe ? /* @__PURE__ */ s.jsx(Iv, { api: ie, identity: h, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [], canManageModels: !!(H != null && H.can_manage_models) }, h) : he ? /* @__PURE__ */ s.jsx(Kv, { api: ie, identity: h, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [] }, h) : F ? /* @__PURE__ */ s.jsx(Zv, { identity: h, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(Lv, { identity: h, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [] }, h) : se ? /* @__PURE__ */ s.jsx(qv, { api: ie, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : oe ? /* @__PURE__ */ s.jsx(Mv, { api: ie }, h) : ne ? /* @__PURE__ */ s.jsx(Ev, { api: ie, path: o, navigate: ae, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : o === "/settings/access" ? D ? ht && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                ht.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: ht.bindings.map((N) => {
                var me;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (me = ht.users.find((Ve) => Ve.id === N.user_id)) == null ? void 0 : me.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: x[N.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Jf[N.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: N.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: m,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Le(async () => {
                          await ie(`/role-bindings/${N.id}`, { method: "DELETE", body: JSON.stringify({ row_version: N.row_version }) }), Q("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, N.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Wi, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: E, onChange: (N) => w(N.target.value), children: ht.users.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: He, onChange: (N) => at(N.target.value), children: ht.projects.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: I, onChange: (N) => _e(N.target.value), children: Object.entries(Jf).filter(([N]) => N !== "admin" && N !== "a_service").map(([N, me]) => /* @__PURE__ */ s.jsx("option", { value: N, children: me }, N)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !E, onClick: () => void Le(async () => {
              await ie("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: E, project_id: He, role: I }) }), Q("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(Al, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            rt.length ? rt.map((N) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[N.action] || N.action }),
              /* @__PURE__ */ s.jsx("span", { children: x[N.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: Ii(N.created_at) })
            ] }, N.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Wi, { size: 38 }),
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
                /* @__PURE__ */ s.jsx("i", { className: `dot ${je ? "green" : "orange"}` }),
                je ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: je ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: o === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: $, onChange: (N) => {
                Ae(N.target.value), Ee(""), Be([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Kf).map(([N, me]) => /* @__PURE__ */ s.jsx("option", { value: N, children: me }, N))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: re, onChange: (N) => {
                Z(N.target.value), Ee(""), Be([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(Su).map(([N, me]) => /* @__PURE__ */ s.jsx("option", { value: N, children: me }, N))
              ] })
            ] }),
            Re.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "状态" }),
                /* @__PURE__ */ s.jsx("th", { children: "进度" }),
                /* @__PURE__ */ s.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: Re.map((N) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => Me(N), children: N.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    x[N.project_id] || N.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Kf[N.kind] || N.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${N.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  Su[N.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${N.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    N.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: Ii(N.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  N.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ae("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Me(N), children: "详情" }),
                  N.status === "failed" && nt(N) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m, onClick: () => void ge(N), children: "重试任务" }),
                  N.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: m, onClick: () => void pe(N), children: /* @__PURE__ */ s.jsx(Rf, { size: 17 }) })
                ] }) })
              ] }, N.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(Hn, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: re ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: re ? "切换筛选条件查看其他任务。" : Ye ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Ye && !re && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => qe(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(Al, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Re.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !et.length, onClick: () => {
                  Ee(et[et.length - 1]), Be(et.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !ct, onClick: () => {
                  Be([...et, ce]), Ee(ct || "");
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
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ae("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(Al, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Rt ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    we && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => qe(!1), children: /* @__PURE__ */ s.jsx(Pi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: tt, onChange: (N) => Ke(N.target.value), children: H == null ? void 0 : H.projects.filter((N) => N.can_run).map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: dt, onChange: (N) => ve(N.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !je && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => qe(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !Ye, onClick: () => void b(), children: [
          m ? /* @__PURE__ */ s.jsx(Mf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(qf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    De && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => Me(null), children: /* @__PURE__ */ s.jsx(Pi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${De.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        Su[De.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: De.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: x[De.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: De.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: Ii(De.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: Ii(De.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: De.id })
      ] }),
      De.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: De.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      De.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void pe(De), children: [
        /* @__PURE__ */ s.jsx(Rf, { size: 16 }),
        "下载演示结果"
      ] }),
      (st = De.result_links) == null ? void 0 : st.map((N) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ae(N.path), children: N.label }, N.path)),
      De.status === "failed" && nt(De) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void ge(De), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function tp(u) {
  const h = Sj.createRoot(u);
  return h.render(/* @__PURE__ */ s.jsx(ep, { embedded: !0 })), () => h.unmount();
}
export {
  tp as mountKnowledge
};
