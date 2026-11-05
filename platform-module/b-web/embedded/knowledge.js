var su = { exports: {} }, Nn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hf;
function mj() {
  if (hf) return Nn;
  hf = 1;
  var o = Symbol.for("react.transitional.element"), f = Symbol.for("react.fragment");
  function y(d, T, q) {
    var Z = null;
    if (q !== void 0 && (Z = "" + q), T.key !== void 0 && (Z = "" + T.key), "key" in T) {
      q = {};
      for (var A in T)
        A !== "key" && (q[A] = T[A]);
    } else q = T;
    return T = q.ref, {
      $$typeof: o,
      type: d,
      key: Z,
      ref: T !== void 0 ? T : null,
      props: q
    };
  }
  return Nn.Fragment = f, Nn.jsx = y, Nn.jsxs = y, Nn;
}
var ff;
function xj() {
  return ff || (ff = 1, su.exports = mj()), su.exports;
}
var s = xj(), lu = { exports: {} }, Sn = {}, au = { exports: {} }, nu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mf;
function jj() {
  return mf || (mf = 1, (function(o) {
    function f(g, X) {
      var se = g.length;
      g.push(X);
      e: for (; 0 < se; ) {
        var we = se - 1 >>> 1, x = g[we];
        if (0 < T(x, X))
          g[we] = X, g[se] = x, se = we;
        else break e;
      }
    }
    function y(g) {
      return g.length === 0 ? null : g[0];
    }
    function d(g) {
      if (g.length === 0) return null;
      var X = g[0], se = g.pop();
      if (se !== X) {
        g[0] = se;
        e: for (var we = 0, x = g.length, L = x >>> 1; we < L; ) {
          var F = 2 * (we + 1) - 1, ee = g[F], ie = F + 1, G = g[ie];
          if (0 > T(ee, se))
            ie < x && 0 > T(G, ee) ? (g[we] = G, g[ie] = se, we = ie) : (g[we] = ee, g[F] = se, we = F);
          else if (ie < x && 0 > T(G, se))
            g[we] = G, g[ie] = se, we = ie;
          else break e;
        }
      }
      return X;
    }
    function T(g, X) {
      var se = g.sortIndex - X.sortIndex;
      return se !== 0 ? se : g.id - X.id;
    }
    if (o.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var q = performance;
      o.unstable_now = function() {
        return q.now();
      };
    } else {
      var Z = Date, A = Z.now();
      o.unstable_now = function() {
        return Z.now() - A;
      };
    }
    var Y = [], v = [], D = 1, J = null, k = 3, te = !1, me = !1, Ne = !1, Se = !1, Te = typeof setTimeout == "function" ? setTimeout : null, fe = typeof clearTimeout == "function" ? clearTimeout : null, W = typeof setImmediate < "u" ? setImmediate : null;
    function oe(g) {
      for (var X = y(v); X !== null; ) {
        if (X.callback === null) d(v);
        else if (X.startTime <= g)
          d(v), X.sortIndex = X.expirationTime, f(Y, X);
        else break;
        X = y(v);
      }
    }
    function le(g) {
      if (Ne = !1, oe(g), !me)
        if (y(Y) !== null)
          me = !0, H || (H = !0, ve());
        else {
          var X = y(v);
          X !== null && re(le, X.startTime - g);
        }
    }
    var H = !1, xe = -1, ze = 5, Le = -1;
    function Ge() {
      return Se ? !0 : !(o.unstable_now() - Le < ze);
    }
    function He() {
      if (Se = !1, H) {
        var g = o.unstable_now();
        Le = g;
        var X = !0;
        try {
          e: {
            me = !1, Ne && (Ne = !1, fe(xe), xe = -1), te = !0;
            var se = k;
            try {
              t: {
                for (oe(g), J = y(Y); J !== null && !(J.expirationTime > g && Ge()); ) {
                  var we = J.callback;
                  if (typeof we == "function") {
                    J.callback = null, k = J.priorityLevel;
                    var x = we(
                      J.expirationTime <= g
                    );
                    if (g = o.unstable_now(), typeof x == "function") {
                      J.callback = x, oe(g), X = !0;
                      break t;
                    }
                    J === y(Y) && d(Y), oe(g);
                  } else d(Y);
                  J = y(Y);
                }
                if (J !== null) X = !0;
                else {
                  var L = y(v);
                  L !== null && re(
                    le,
                    L.startTime - g
                  ), X = !1;
                }
              }
              break e;
            } finally {
              J = null, k = se, te = !1;
            }
            X = void 0;
          }
        } finally {
          X ? ve() : H = !1;
        }
      }
    }
    var ve;
    if (typeof W == "function")
      ve = function() {
        W(He);
      };
    else if (typeof MessageChannel < "u") {
      var Ve = new MessageChannel(), Q = Ve.port2;
      Ve.port1.onmessage = He, ve = function() {
        Q.postMessage(null);
      };
    } else
      ve = function() {
        Te(He, 0);
      };
    function re(g, X) {
      xe = Te(function() {
        g(o.unstable_now());
      }, X);
    }
    o.unstable_IdlePriority = 5, o.unstable_ImmediatePriority = 1, o.unstable_LowPriority = 4, o.unstable_NormalPriority = 3, o.unstable_Profiling = null, o.unstable_UserBlockingPriority = 2, o.unstable_cancelCallback = function(g) {
      g.callback = null;
    }, o.unstable_forceFrameRate = function(g) {
      0 > g || 125 < g ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ze = 0 < g ? Math.floor(1e3 / g) : 5;
    }, o.unstable_getCurrentPriorityLevel = function() {
      return k;
    }, o.unstable_next = function(g) {
      switch (k) {
        case 1:
        case 2:
        case 3:
          var X = 3;
          break;
        default:
          X = k;
      }
      var se = k;
      k = X;
      try {
        return g();
      } finally {
        k = se;
      }
    }, o.unstable_requestPaint = function() {
      Se = !0;
    }, o.unstable_runWithPriority = function(g, X) {
      switch (g) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          g = 3;
      }
      var se = k;
      k = g;
      try {
        return X();
      } finally {
        k = se;
      }
    }, o.unstable_scheduleCallback = function(g, X, se) {
      var we = o.unstable_now();
      switch (typeof se == "object" && se !== null ? (se = se.delay, se = typeof se == "number" && 0 < se ? we + se : we) : se = we, g) {
        case 1:
          var x = -1;
          break;
        case 2:
          x = 250;
          break;
        case 5:
          x = 1073741823;
          break;
        case 4:
          x = 1e4;
          break;
        default:
          x = 5e3;
      }
      return x = se + x, g = {
        id: D++,
        callback: X,
        priorityLevel: g,
        startTime: se,
        expirationTime: x,
        sortIndex: -1
      }, se > we ? (g.sortIndex = se, f(v, g), y(Y) === null && g === y(v) && (Ne ? (fe(xe), xe = -1) : Ne = !0, re(le, se - we))) : (g.sortIndex = x, f(Y, g), me || te || (me = !0, H || (H = !0, ve()))), g;
    }, o.unstable_shouldYield = Ge, o.unstable_wrapCallback = function(g) {
      var X = k;
      return function() {
        var se = k;
        k = X;
        try {
          return g.apply(this, arguments);
        } finally {
          k = se;
        }
      };
    };
  })(nu)), nu;
}
var xf;
function vj() {
  return xf || (xf = 1, au.exports = jj()), au.exports;
}
var iu = { exports: {} }, ct = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jf;
function pj() {
  if (jf) return ct;
  jf = 1;
  var o = Symbol.for("react.transitional.element"), f = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), q = Symbol.for("react.consumer"), Z = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), J = Symbol.iterator;
  function k(x) {
    return x === null || typeof x != "object" ? null : (x = J && x[J] || x["@@iterator"], typeof x == "function" ? x : null);
  }
  var te = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, me = Object.assign, Ne = {};
  function Se(x, L, F) {
    this.props = x, this.context = L, this.refs = Ne, this.updater = F || te;
  }
  Se.prototype.isReactComponent = {}, Se.prototype.setState = function(x, L) {
    if (typeof x != "object" && typeof x != "function" && x != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, x, L, "setState");
  }, Se.prototype.forceUpdate = function(x) {
    this.updater.enqueueForceUpdate(this, x, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = Se.prototype;
  function fe(x, L, F) {
    this.props = x, this.context = L, this.refs = Ne, this.updater = F || te;
  }
  var W = fe.prototype = new Te();
  W.constructor = fe, me(W, Se.prototype), W.isPureReactComponent = !0;
  var oe = Array.isArray, le = { H: null, A: null, T: null, S: null, V: null }, H = Object.prototype.hasOwnProperty;
  function xe(x, L, F, ee, ie, G) {
    return F = G.ref, {
      $$typeof: o,
      type: x,
      key: L,
      ref: F !== void 0 ? F : null,
      props: G
    };
  }
  function ze(x, L) {
    return xe(
      x.type,
      L,
      void 0,
      void 0,
      void 0,
      x.props
    );
  }
  function Le(x) {
    return typeof x == "object" && x !== null && x.$$typeof === o;
  }
  function Ge(x) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + x.replace(/[=:]/g, function(F) {
      return L[F];
    });
  }
  var He = /\/+/g;
  function ve(x, L) {
    return typeof x == "object" && x !== null && x.key != null ? Ge("" + x.key) : L.toString(36);
  }
  function Ve() {
  }
  function Q(x) {
    switch (x.status) {
      case "fulfilled":
        return x.value;
      case "rejected":
        throw x.reason;
      default:
        switch (typeof x.status == "string" ? x.then(Ve, Ve) : (x.status = "pending", x.then(
          function(L) {
            x.status === "pending" && (x.status = "fulfilled", x.value = L);
          },
          function(L) {
            x.status === "pending" && (x.status = "rejected", x.reason = L);
          }
        )), x.status) {
          case "fulfilled":
            return x.value;
          case "rejected":
            throw x.reason;
        }
    }
    throw x;
  }
  function re(x, L, F, ee, ie) {
    var G = typeof x;
    (G === "undefined" || G === "boolean") && (x = null);
    var I = !1;
    if (x === null) I = !0;
    else
      switch (G) {
        case "bigint":
        case "string":
        case "number":
          I = !0;
          break;
        case "object":
          switch (x.$$typeof) {
            case o:
            case f:
              I = !0;
              break;
            case D:
              return I = x._init, re(
                I(x._payload),
                L,
                F,
                ee,
                ie
              );
          }
      }
    if (I)
      return ie = ie(x), I = ee === "" ? "." + ve(x, 0) : ee, oe(ie) ? (F = "", I != null && (F = I.replace(He, "$&/") + "/"), re(ie, L, F, "", function(Oe) {
        return Oe;
      })) : ie != null && (Le(ie) && (ie = ze(
        ie,
        F + (ie.key == null || x && x.key === ie.key ? "" : ("" + ie.key).replace(
          He,
          "$&/"
        ) + "/") + I
      )), L.push(ie)), 1;
    I = 0;
    var Ae = ee === "" ? "." : ee + ":";
    if (oe(x))
      for (var ae = 0; ae < x.length; ae++)
        ee = x[ae], G = Ae + ve(ee, ae), I += re(
          ee,
          L,
          F,
          G,
          ie
        );
    else if (ae = k(x), typeof ae == "function")
      for (x = ae.call(x), ae = 0; !(ee = x.next()).done; )
        ee = ee.value, G = Ae + ve(ee, ae++), I += re(
          ee,
          L,
          F,
          G,
          ie
        );
    else if (G === "object") {
      if (typeof x.then == "function")
        return re(
          Q(x),
          L,
          F,
          ee,
          ie
        );
      throw L = String(x), Error(
        "Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(x).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return I;
  }
  function g(x, L, F) {
    if (x == null) return x;
    var ee = [], ie = 0;
    return re(x, ee, "", "", function(G) {
      return L.call(F, G, ie++);
    }), ee;
  }
  function X(x) {
    if (x._status === -1) {
      var L = x._result;
      L = L(), L.then(
        function(F) {
          (x._status === 0 || x._status === -1) && (x._status = 1, x._result = F);
        },
        function(F) {
          (x._status === 0 || x._status === -1) && (x._status = 2, x._result = F);
        }
      ), x._status === -1 && (x._status = 0, x._result = L);
    }
    if (x._status === 1) return x._result.default;
    throw x._result;
  }
  var se = typeof reportError == "function" ? reportError : function(x) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var L = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof x == "object" && x !== null && typeof x.message == "string" ? String(x.message) : String(x),
        error: x
      });
      if (!window.dispatchEvent(L)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", x);
      return;
    }
    console.error(x);
  };
  function we() {
  }
  return ct.Children = {
    map: g,
    forEach: function(x, L, F) {
      g(
        x,
        function() {
          L.apply(this, arguments);
        },
        F
      );
    },
    count: function(x) {
      var L = 0;
      return g(x, function() {
        L++;
      }), L;
    },
    toArray: function(x) {
      return g(x, function(L) {
        return L;
      }) || [];
    },
    only: function(x) {
      if (!Le(x))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return x;
    }
  }, ct.Component = Se, ct.Fragment = y, ct.Profiler = T, ct.PureComponent = fe, ct.StrictMode = d, ct.Suspense = Y, ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = le, ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(x) {
      return le.H.useMemoCache(x);
    }
  }, ct.cache = function(x) {
    return function() {
      return x.apply(null, arguments);
    };
  }, ct.cloneElement = function(x, L, F) {
    if (x == null)
      throw Error(
        "The argument must be a React element, but you passed " + x + "."
      );
    var ee = me({}, x.props), ie = x.key, G = void 0;
    if (L != null)
      for (I in L.ref !== void 0 && (G = void 0), L.key !== void 0 && (ie = "" + L.key), L)
        !H.call(L, I) || I === "key" || I === "__self" || I === "__source" || I === "ref" && L.ref === void 0 || (ee[I] = L[I]);
    var I = arguments.length - 2;
    if (I === 1) ee.children = F;
    else if (1 < I) {
      for (var Ae = Array(I), ae = 0; ae < I; ae++)
        Ae[ae] = arguments[ae + 2];
      ee.children = Ae;
    }
    return xe(x.type, ie, void 0, void 0, G, ee);
  }, ct.createContext = function(x) {
    return x = {
      $$typeof: Z,
      _currentValue: x,
      _currentValue2: x,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, x.Provider = x, x.Consumer = {
      $$typeof: q,
      _context: x
    }, x;
  }, ct.createElement = function(x, L, F) {
    var ee, ie = {}, G = null;
    if (L != null)
      for (ee in L.key !== void 0 && (G = "" + L.key), L)
        H.call(L, ee) && ee !== "key" && ee !== "__self" && ee !== "__source" && (ie[ee] = L[ee]);
    var I = arguments.length - 2;
    if (I === 1) ie.children = F;
    else if (1 < I) {
      for (var Ae = Array(I), ae = 0; ae < I; ae++)
        Ae[ae] = arguments[ae + 2];
      ie.children = Ae;
    }
    if (x && x.defaultProps)
      for (ee in I = x.defaultProps, I)
        ie[ee] === void 0 && (ie[ee] = I[ee]);
    return xe(x, G, void 0, void 0, null, ie);
  }, ct.createRef = function() {
    return { current: null };
  }, ct.forwardRef = function(x) {
    return { $$typeof: A, render: x };
  }, ct.isValidElement = Le, ct.lazy = function(x) {
    return {
      $$typeof: D,
      _payload: { _status: -1, _result: x },
      _init: X
    };
  }, ct.memo = function(x, L) {
    return {
      $$typeof: v,
      type: x,
      compare: L === void 0 ? null : L
    };
  }, ct.startTransition = function(x) {
    var L = le.T, F = {};
    le.T = F;
    try {
      var ee = x(), ie = le.S;
      ie !== null && ie(F, ee), typeof ee == "object" && ee !== null && typeof ee.then == "function" && ee.then(we, se);
    } catch (G) {
      se(G);
    } finally {
      le.T = L;
    }
  }, ct.unstable_useCacheRefresh = function() {
    return le.H.useCacheRefresh();
  }, ct.use = function(x) {
    return le.H.use(x);
  }, ct.useActionState = function(x, L, F) {
    return le.H.useActionState(x, L, F);
  }, ct.useCallback = function(x, L) {
    return le.H.useCallback(x, L);
  }, ct.useContext = function(x) {
    return le.H.useContext(x);
  }, ct.useDebugValue = function() {
  }, ct.useDeferredValue = function(x, L) {
    return le.H.useDeferredValue(x, L);
  }, ct.useEffect = function(x, L, F) {
    var ee = le.H;
    if (typeof F == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return ee.useEffect(x, L);
  }, ct.useId = function() {
    return le.H.useId();
  }, ct.useImperativeHandle = function(x, L, F) {
    return le.H.useImperativeHandle(x, L, F);
  }, ct.useInsertionEffect = function(x, L) {
    return le.H.useInsertionEffect(x, L);
  }, ct.useLayoutEffect = function(x, L) {
    return le.H.useLayoutEffect(x, L);
  }, ct.useMemo = function(x, L) {
    return le.H.useMemo(x, L);
  }, ct.useOptimistic = function(x, L) {
    return le.H.useOptimistic(x, L);
  }, ct.useReducer = function(x, L, F) {
    return le.H.useReducer(x, L, F);
  }, ct.useRef = function(x) {
    return le.H.useRef(x);
  }, ct.useState = function(x) {
    return le.H.useState(x);
  }, ct.useSyncExternalStore = function(x, L, F) {
    return le.H.useSyncExternalStore(
      x,
      L,
      F
    );
  }, ct.useTransition = function() {
    return le.H.useTransition();
  }, ct.version = "19.1.0", ct;
}
var vf;
function ku() {
  return vf || (vf = 1, iu.exports = pj()), iu.exports;
}
var cu = { exports: {} }, es = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pf;
function gj() {
  if (pf) return es;
  pf = 1;
  var o = ku();
  function f(Y) {
    var v = "https://react.dev/errors/" + Y;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var D = 2; D < arguments.length; D++)
        v += "&args[]=" + encodeURIComponent(arguments[D]);
    }
    return "Minified React error #" + Y + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function y() {
  }
  var d = {
    d: {
      f: y,
      r: function() {
        throw Error(f(522));
      },
      D: y,
      C: y,
      L: y,
      m: y,
      X: y,
      S: y,
      M: y
    },
    p: 0,
    findDOMNode: null
  }, T = Symbol.for("react.portal");
  function q(Y, v, D) {
    var J = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: T,
      key: J == null ? null : "" + J,
      children: Y,
      containerInfo: v,
      implementation: D
    };
  }
  var Z = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function A(Y, v) {
    if (Y === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return es.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = d, es.createPortal = function(Y, v) {
    var D = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(f(299));
    return q(Y, v, null, D);
  }, es.flushSync = function(Y) {
    var v = Z.T, D = d.p;
    try {
      if (Z.T = null, d.p = 2, Y) return Y();
    } finally {
      Z.T = v, d.p = D, d.d.f();
    }
  }, es.preconnect = function(Y, v) {
    typeof Y == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, d.d.C(Y, v));
  }, es.prefetchDNS = function(Y) {
    typeof Y == "string" && d.d.D(Y);
  }, es.preinit = function(Y, v) {
    if (typeof Y == "string" && v && typeof v.as == "string") {
      var D = v.as, J = A(D, v.crossOrigin), k = typeof v.integrity == "string" ? v.integrity : void 0, te = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      D === "style" ? d.d.S(
        Y,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: J,
          integrity: k,
          fetchPriority: te
        }
      ) : D === "script" && d.d.X(Y, {
        crossOrigin: J,
        integrity: k,
        fetchPriority: te,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, es.preinitModule = function(Y, v) {
    if (typeof Y == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var D = A(
            v.as,
            v.crossOrigin
          );
          d.d.M(Y, {
            crossOrigin: D,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && d.d.M(Y);
  }, es.preload = function(Y, v) {
    if (typeof Y == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var D = v.as, J = A(D, v.crossOrigin);
      d.d.L(Y, D, {
        crossOrigin: J,
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
  }, es.preloadModule = function(Y, v) {
    if (typeof Y == "string")
      if (v) {
        var D = A(v.as, v.crossOrigin);
        d.d.m(Y, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: D,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else d.d.m(Y);
  }, es.requestFormReset = function(Y) {
    d.d.r(Y);
  }, es.unstable_batchedUpdates = function(Y, v) {
    return Y(v);
  }, es.useFormState = function(Y, v, D) {
    return Z.H.useFormState(Y, v, D);
  }, es.useFormStatus = function() {
    return Z.H.useHostTransitionStatus();
  }, es.version = "19.1.0", es;
}
var gf;
function bj() {
  if (gf) return cu.exports;
  gf = 1;
  function o() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o);
      } catch (f) {
        console.error(f);
      }
  }
  return o(), cu.exports = gj(), cu.exports;
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
var bf;
function yj() {
  if (bf) return Sn;
  bf = 1;
  var o = vj(), f = ku(), y = bj();
  function d(e) {
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
  function q(e) {
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
  function Z(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function A(e) {
    if (q(e) !== e)
      throw Error(d(188));
  }
  function Y(e) {
    var t = e.alternate;
    if (!t) {
      if (t = q(e), t === null) throw Error(d(188));
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
        throw Error(d(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var r = !1, h = n.child; h; ) {
          if (h === l) {
            r = !0, l = n, a = i;
            break;
          }
          if (h === a) {
            r = !0, a = n, l = i;
            break;
          }
          h = h.sibling;
        }
        if (!r) {
          for (h = i.child; h; ) {
            if (h === l) {
              r = !0, l = i, a = n;
              break;
            }
            if (h === a) {
              r = !0, a = i, l = n;
              break;
            }
            h = h.sibling;
          }
          if (!r) throw Error(d(189));
        }
      }
      if (l.alternate !== a) throw Error(d(190));
    }
    if (l.tag !== 3) throw Error(d(188));
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
  var D = Object.assign, J = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), te = Symbol.for("react.portal"), me = Symbol.for("react.fragment"), Ne = Symbol.for("react.strict_mode"), Se = Symbol.for("react.profiler"), Te = Symbol.for("react.provider"), fe = Symbol.for("react.consumer"), W = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), xe = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), Le = Symbol.for("react.activity"), Ge = Symbol.for("react.memo_cache_sentinel"), He = Symbol.iterator;
  function ve(e) {
    return e === null || typeof e != "object" ? null : (e = He && e[He] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ve = Symbol.for("react.client.reference");
  function Q(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ve ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case me:
        return "Fragment";
      case Se:
        return "Profiler";
      case Ne:
        return "StrictMode";
      case le:
        return "Suspense";
      case H:
        return "SuspenseList";
      case Le:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case te:
          return "Portal";
        case W:
          return (e.displayName || "Context") + ".Provider";
        case fe:
          return (e._context.displayName || "Context") + ".Consumer";
        case oe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case xe:
          return t = e.displayName || null, t !== null ? t : Q(e.type) || "Memo";
        case ze:
          t = e._payload, e = e._init;
          try {
            return Q(e(t));
          } catch {
          }
      }
    return null;
  }
  var re = Array.isArray, g = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, X = y.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, we = [], x = -1;
  function L(e) {
    return { current: e };
  }
  function F(e) {
    0 > x || (e.current = we[x], we[x] = null, x--);
  }
  function ee(e, t) {
    x++, we[x] = e.current, e.current = t;
  }
  var ie = L(null), G = L(null), I = L(null), Ae = L(null);
  function ae(e, t) {
    switch (ee(I, t), ee(G, e), ee(ie, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Bh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Bh(t), e = Lh(t, e);
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
    F(ie), ee(ie, e);
  }
  function Oe() {
    F(ie), F(G), F(I);
  }
  function at(e) {
    e.memoizedState !== null && ee(Ae, e);
    var t = ie.current, l = Lh(t, e.type);
    t !== l && (ee(G, e), ee(ie, l));
  }
  function Fe(e) {
    G.current === e && (F(ie), F(G)), Ae.current === e && (F(Ae), pn._currentValue = se);
  }
  var Ie = Object.prototype.hasOwnProperty, Xe = o.unstable_scheduleCallback, Me = o.unstable_cancelCallback, ye = o.unstable_shouldYield, _e = o.unstable_requestPaint, qe = o.unstable_now, tt = o.unstable_getCurrentPriorityLevel, $e = o.unstable_ImmediatePriority, rt = o.unstable_UserBlockingPriority, je = o.unstable_NormalPriority, lt = o.unstable_LowPriority, Re = o.unstable_IdlePriority, E = o.log, w = o.unstable_setDisableYieldValue, K = null, ke = null;
  function Ue(e) {
    if (typeof E == "function" && w(e), ke && typeof ke.setStrictMode == "function")
      try {
        ke.setStrictMode(K, e);
      } catch {
      }
  }
  var st = Math.clz32 ? Math.clz32 : de, ut = Math.log, R = Math.LN2;
  function de(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ut(e) / R | 0) | 0;
  }
  var ne = 256, Je = 4194304;
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
  function be(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, r = e.pingedLanes;
    e = e.warmLanes;
    var h = a & 134217727;
    return h !== 0 ? (a = h & ~i, a !== 0 ? n = b(a) : (r &= h, r !== 0 ? n = b(r) : l || (l = h & ~e, l !== 0 && (n = b(l))))) : (h = a & ~i, h !== 0 ? n = b(h) : r !== 0 ? n = b(r) : l || (l = a & ~e, l !== 0 && (n = b(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
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
  function xt() {
    var e = ne;
    return ne <<= 1, (ne & 4194048) === 0 && (ne = 256), e;
  }
  function M() {
    var e = Je;
    return Je <<= 1, (Je & 62914560) === 0 && (Je = 4194304), e;
  }
  function j(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ce(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function ge(e, t, l, a, n, i) {
    var r = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var h = e.entanglements, p = e.expirationTimes, z = e.hiddenUpdates;
    for (l = r & ~l; 0 < l; ) {
      var V = 31 - st(l), P = 1 << V;
      h[V] = 0, p[V] = -1;
      var U = z[V];
      if (U !== null)
        for (z[V] = null, V = 0; V < U.length; V++) {
          var B = U[V];
          B !== null && (B.lane &= -536870913);
        }
      l &= ~P;
    }
    a !== 0 && nt(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(r & ~t));
  }
  function nt(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - st(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function _(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - st(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function he(e) {
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
  function Qe(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function kt() {
    var e = X.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : nf(e.type));
  }
  function Mt(e, t) {
    var l = X.p;
    try {
      return X.p = e, t();
    } finally {
      X.p = l;
    }
  }
  var Tt = Math.random().toString(36).slice(2), it = "__reactFiber$" + Tt, vt = "__reactProps$" + Tt, c = "__reactContainer$" + Tt, S = "__reactEvents$" + Tt, ue = "__reactListeners$" + Tt, Pe = "__reactHandles$" + Tt, m = "__reactResources$" + Tt, Ce = "__reactMarker$" + Tt;
  function Ee(e) {
    delete e[it], delete e[vt], delete e[S], delete e[ue], delete e[Pe];
  }
  function Ze(e) {
    var t = e[it];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[c] || l[it]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Qh(e); e !== null; ) {
            if (l = e[it]) return l;
            e = Qh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Lt(e) {
    if (e = e[it] || e[c]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Cs(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(d(33));
  }
  function Us(e) {
    var t = e[m];
    return t || (t = e[m] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function qt(e) {
    e[Ce] = !0;
  }
  var Ea = /* @__PURE__ */ new Set(), Oa = {};
  function It(e, t) {
    Ps(e, t), Ps(e + "Capture", t);
  }
  function Ps(e, t) {
    for (Oa[e] = t, e = 0; e < t.length; e++)
      Ea.add(t[e]);
  }
  var im = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ou = {}, Tu = {};
  function cm(e) {
    return Ie.call(Tu, e) ? !0 : Ie.call(Ou, e) ? !1 : im.test(e) ? Tu[e] = !0 : (Ou[e] = !0, !1);
  }
  function An(e, t, l) {
    if (cm(t))
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
  function Rn(e, t, l) {
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
  function Ds(e, t, l, a) {
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
  var Wi, zu;
  function Gl(e) {
    if (Wi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Wi = t && t[1] || "", zu = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wi + e + zu;
  }
  var Fi = !1;
  function Ii(e, t) {
    if (!e || Fi) return "";
    Fi = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var P = function() {
                throw Error();
              };
              if (Object.defineProperty(P.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(P, []);
                } catch (B) {
                  var U = B;
                }
                Reflect.construct(e, [], P);
              } else {
                try {
                  P.call();
                } catch (B) {
                  U = B;
                }
                e.call(P.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (B) {
                U = B;
              }
              (P = e()) && typeof P.catch == "function" && P.catch(function() {
              });
            }
          } catch (B) {
            if (B && U && typeof B.stack == "string")
              return [B.stack, U.stack];
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
      var i = a.DetermineComponentFrameRoot(), r = i[0], h = i[1];
      if (r && h) {
        var p = r.split(`
`), z = h.split(`
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
                  var V = `
` + p[a].replace(" at new ", " at ");
                  return e.displayName && V.includes("<anonymous>") && (V = V.replace("<anonymous>", e.displayName)), V;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Fi = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Gl(l) : "";
  }
  function rm(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Gl(e.type);
      case 16:
        return Gl("Lazy");
      case 13:
        return Gl("Suspense");
      case 19:
        return Gl("SuspenseList");
      case 0:
      case 15:
        return Ii(e.type, !1);
      case 11:
        return Ii(e.type.render, !1);
      case 1:
        return Ii(e.type, !0);
      case 31:
        return Gl("Activity");
      default:
        return "";
    }
  }
  function Au(e) {
    try {
      var t = "";
      do
        t += rm(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function fs(e) {
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
  function Ru(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function um(e) {
    var t = Ru(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
        set: function(r) {
          a = "" + r, i.call(this, r);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(r) {
          a = "" + r;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Un(e) {
    e._valueTracker || (e._valueTracker = um(e));
  }
  function Uu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Ru(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Dn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var om = /[\n"\\]/g;
  function ms(e) {
    return e.replace(
      om,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Pi(e, t, l, a, n, i, r, h) {
    e.name = "", r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? e.type = r : e.removeAttribute("type"), t != null ? r === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + fs(t)) : e.value !== "" + fs(t) && (e.value = "" + fs(t)) : r !== "submit" && r !== "reset" || e.removeAttribute("value"), t != null ? ec(e, r, fs(t)) : l != null ? ec(e, r, fs(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? e.name = "" + fs(h) : e.removeAttribute("name");
  }
  function Du(e, t, l, a, n, i, r, h) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + fs(l) : "", t = t != null ? "" + fs(t) : l, h || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = h ? e.checked : !!a, e.defaultChecked = !!a, r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (e.name = r);
  }
  function ec(e, t, l) {
    t === "number" && Dn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Xl(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + fs(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Mu(e, t, l) {
    if (t != null && (t = "" + fs(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + fs(l) : "";
  }
  function qu(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(d(92));
        if (re(a)) {
          if (1 < a.length) throw Error(d(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = fs(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
  }
  function Ql(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var dm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Hu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || dm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Bu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(d(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Hu(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Hu(e, i, t[i]);
  }
  function tc(e) {
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
  var hm = /* @__PURE__ */ new Map([
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
  ]), fm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Mn(e) {
    return fm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var sc = null;
  function lc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Zl = null, Vl = null;
  function Lu(e) {
    var t = Lt(e);
    if (t && (e = t.stateNode)) {
      var l = e[vt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Pi(
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
              'input[name="' + ms(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[vt] || null;
                if (!n) throw Error(d(90));
                Pi(
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
          Mu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Xl(e, !!l.multiple, t, !1);
      }
    }
  }
  var ac = !1;
  function Yu(e, t, l) {
    if (ac) return e(t, l);
    ac = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (ac = !1, (Zl !== null || Vl !== null) && (yi(), Zl && (t = Zl, e = Vl, Vl = Zl = null, Lu(t), e)))
        for (t = 0; t < e.length; t++) Lu(e[t]);
    }
  }
  function Ta(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[vt] || null;
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
        d(231, t, typeof l)
      );
    return l;
  }
  var Ms = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), nc = !1;
  if (Ms)
    try {
      var za = {};
      Object.defineProperty(za, "passive", {
        get: function() {
          nc = !0;
        }
      }), window.addEventListener("test", za, za), window.removeEventListener("test", za, za);
    } catch {
      nc = !1;
    }
  var el = null, ic = null, qn = null;
  function Gu() {
    if (qn) return qn;
    var e, t = ic, l = t.length, a, n = "value" in el ? el.value : el.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var r = l - e;
    for (a = 1; a <= r && t[l - a] === n[i - a]; a++) ;
    return qn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Hn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Bn() {
    return !0;
  }
  function Xu() {
    return !1;
  }
  function ss(e) {
    function t(l, a, n, i, r) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = r, this.currentTarget = null;
      for (var h in e)
        e.hasOwnProperty(h) && (l = e[h], this[h] = l ? l(i) : i[h]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Bn : Xu, this.isPropagationStopped = Xu, this;
    }
    return D(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Bn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Bn);
      },
      persist: function() {
      },
      isPersistent: Bn
    }), t;
  }
  var wl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ln = ss(wl), Aa = D({}, wl, { view: 0, detail: 0 }), mm = ss(Aa), cc, rc, Ra, Yn = D({}, Aa, {
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
    getModifierState: oc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ra && (Ra && e.type === "mousemove" ? (cc = e.screenX - Ra.screenX, rc = e.screenY - Ra.screenY) : rc = cc = 0, Ra = e), cc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : rc;
    }
  }), Qu = ss(Yn), xm = D({}, Yn, { dataTransfer: 0 }), jm = ss(xm), vm = D({}, Aa, { relatedTarget: 0 }), uc = ss(vm), pm = D({}, wl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), gm = ss(pm), bm = D({}, wl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), ym = ss(bm), _m = D({}, wl, { data: 0 }), Zu = ss(_m), Nm = {
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
  }, Sm = {
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
  }, wm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function km(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = wm[e]) ? !!t[e] : !1;
  }
  function oc() {
    return km;
  }
  var Cm = D({}, Aa, {
    key: function(e) {
      if (e.key) {
        var t = Nm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Hn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: oc,
    charCode: function(e) {
      return e.type === "keypress" ? Hn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Hn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Em = ss(Cm), Om = D({}, Yn, {
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
  }), Vu = ss(Om), Tm = D({}, Aa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: oc
  }), zm = ss(Tm), Am = D({}, wl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Rm = ss(Am), Um = D({}, Yn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dm = ss(Um), Mm = D({}, wl, {
    newState: 0,
    oldState: 0
  }), qm = ss(Mm), Hm = [9, 13, 27, 32], dc = Ms && "CompositionEvent" in window, Ua = null;
  Ms && "documentMode" in document && (Ua = document.documentMode);
  var Bm = Ms && "TextEvent" in window && !Ua, Ju = Ms && (!dc || Ua && 8 < Ua && 11 >= Ua), Ku = " ", $u = !1;
  function Wu(e, t) {
    switch (e) {
      case "keyup":
        return Hm.indexOf(t.keyCode) !== -1;
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
  function Fu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Jl = !1;
  function Lm(e, t) {
    switch (e) {
      case "compositionend":
        return Fu(t);
      case "keypress":
        return t.which !== 32 ? null : ($u = !0, Ku);
      case "textInput":
        return e = t.data, e === Ku && $u ? null : e;
      default:
        return null;
    }
  }
  function Ym(e, t) {
    if (Jl)
      return e === "compositionend" || !dc && Wu(e, t) ? (e = Gu(), qn = ic = el = null, Jl = !1, e) : null;
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
        return Ju && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Gm = {
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
  function Iu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Gm[e.type] : t === "textarea";
  }
  function Pu(e, t, l, a) {
    Zl ? Vl ? Vl.push(a) : Vl = [a] : Zl = a, t = Ci(t, "onChange"), 0 < t.length && (l = new Ln(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Da = null, Ma = null;
  function Xm(e) {
    Uh(e, 0);
  }
  function Gn(e) {
    var t = Cs(e);
    if (Uu(t)) return e;
  }
  function eo(e, t) {
    if (e === "change") return t;
  }
  var to = !1;
  if (Ms) {
    var hc;
    if (Ms) {
      var fc = "oninput" in document;
      if (!fc) {
        var so = document.createElement("div");
        so.setAttribute("oninput", "return;"), fc = typeof so.oninput == "function";
      }
      hc = fc;
    } else hc = !1;
    to = hc && (!document.documentMode || 9 < document.documentMode);
  }
  function lo() {
    Da && (Da.detachEvent("onpropertychange", ao), Ma = Da = null);
  }
  function ao(e) {
    if (e.propertyName === "value" && Gn(Ma)) {
      var t = [];
      Pu(
        t,
        Ma,
        e,
        lc(e)
      ), Yu(Xm, t);
    }
  }
  function Qm(e, t, l) {
    e === "focusin" ? (lo(), Da = t, Ma = l, Da.attachEvent("onpropertychange", ao)) : e === "focusout" && lo();
  }
  function Zm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Gn(Ma);
  }
  function Vm(e, t) {
    if (e === "click") return Gn(t);
  }
  function Jm(e, t) {
    if (e === "input" || e === "change")
      return Gn(t);
  }
  function Km(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var is = typeof Object.is == "function" ? Object.is : Km;
  function qa(e, t) {
    if (is(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Ie.call(t, n) || !is(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function no(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function io(e, t) {
    var l = no(e);
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
      l = no(l);
    }
  }
  function co(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? co(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ro(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Dn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Dn(e.document);
    }
    return t;
  }
  function mc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var $m = Ms && "documentMode" in document && 11 >= document.documentMode, Kl = null, xc = null, Ha = null, jc = !1;
  function uo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    jc || Kl == null || Kl !== Dn(a) || (a = Kl, "selectionStart" in a && mc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ha && qa(Ha, a) || (Ha = a, a = Ci(xc, "onSelect"), 0 < a.length && (t = new Ln(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Kl)));
  }
  function kl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var $l = {
    animationend: kl("Animation", "AnimationEnd"),
    animationiteration: kl("Animation", "AnimationIteration"),
    animationstart: kl("Animation", "AnimationStart"),
    transitionrun: kl("Transition", "TransitionRun"),
    transitionstart: kl("Transition", "TransitionStart"),
    transitioncancel: kl("Transition", "TransitionCancel"),
    transitionend: kl("Transition", "TransitionEnd")
  }, vc = {}, oo = {};
  Ms && (oo = document.createElement("div").style, "AnimationEvent" in window || (delete $l.animationend.animation, delete $l.animationiteration.animation, delete $l.animationstart.animation), "TransitionEvent" in window || delete $l.transitionend.transition);
  function Cl(e) {
    if (vc[e]) return vc[e];
    if (!$l[e]) return e;
    var t = $l[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in oo)
        return vc[e] = t[l];
    return e;
  }
  var ho = Cl("animationend"), fo = Cl("animationiteration"), mo = Cl("animationstart"), Wm = Cl("transitionrun"), Fm = Cl("transitionstart"), Im = Cl("transitioncancel"), xo = Cl("transitionend"), jo = /* @__PURE__ */ new Map(), pc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  pc.push("scrollEnd");
  function _s(e, t) {
    jo.set(e, t), It(t, [e]);
  }
  var vo = /* @__PURE__ */ new WeakMap();
  function xs(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = vo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Au(t)
      }, vo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Au(t)
    };
  }
  var js = [], Wl = 0, gc = 0;
  function Xn() {
    for (var e = Wl, t = gc = Wl = 0; t < e; ) {
      var l = js[t];
      js[t++] = null;
      var a = js[t];
      js[t++] = null;
      var n = js[t];
      js[t++] = null;
      var i = js[t];
      if (js[t++] = null, a !== null && n !== null) {
        var r = a.pending;
        r === null ? n.next = n : (n.next = r.next, r.next = n), a.pending = n;
      }
      i !== 0 && po(l, n, i);
    }
  }
  function Qn(e, t, l, a) {
    js[Wl++] = e, js[Wl++] = t, js[Wl++] = l, js[Wl++] = a, gc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function bc(e, t, l, a) {
    return Qn(e, t, l, a), Zn(e);
  }
  function Fl(e, t) {
    return Qn(e, null, null, t), Zn(e);
  }
  function po(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - st(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function Zn(e) {
    if (50 < on)
      throw on = 0, kr = null, Error(d(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Il = {};
  function Pm(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function cs(e, t, l, a) {
    return new Pm(e, t, l, a);
  }
  function yc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function qs(e, t) {
    var l = e.alternate;
    return l === null ? (l = cs(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function go(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Vn(e, t, l, a, n, i) {
    var r = 0;
    if (a = e, typeof e == "function") yc(e) && (r = 1);
    else if (typeof e == "string")
      r = tj(
        e,
        l,
        ie.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Le:
          return e = cs(31, l, t, n), e.elementType = Le, e.lanes = i, e;
        case me:
          return El(l.children, n, i, t);
        case Ne:
          r = 8, n |= 24;
          break;
        case Se:
          return e = cs(12, l, t, n | 2), e.elementType = Se, e.lanes = i, e;
        case le:
          return e = cs(13, l, t, n), e.elementType = le, e.lanes = i, e;
        case H:
          return e = cs(19, l, t, n), e.elementType = H, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Te:
              case W:
                r = 10;
                break e;
              case fe:
                r = 9;
                break e;
              case oe:
                r = 11;
                break e;
              case xe:
                r = 14;
                break e;
              case ze:
                r = 16, a = null;
                break e;
            }
          r = 29, l = Error(
            d(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = cs(r, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function El(e, t, l, a) {
    return e = cs(7, e, a, t), e.lanes = l, e;
  }
  function _c(e, t, l) {
    return e = cs(6, e, null, t), e.lanes = l, e;
  }
  function Nc(e, t, l) {
    return t = cs(
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
  var Pl = [], ea = 0, Jn = null, Kn = 0, vs = [], ps = 0, Ol = null, Hs = 1, Bs = "";
  function Tl(e, t) {
    Pl[ea++] = Kn, Pl[ea++] = Jn, Jn = e, Kn = t;
  }
  function bo(e, t, l) {
    vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Ol = e;
    var a = Hs;
    e = Bs;
    var n = 32 - st(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - st(t) + n;
    if (30 < i) {
      var r = n - n % 5;
      i = (a & (1 << r) - 1).toString(32), a >>= r, n -= r, Hs = 1 << 32 - st(t) + n | l << n | a, Bs = i + e;
    } else
      Hs = 1 << i | l << n | a, Bs = e;
  }
  function Sc(e) {
    e.return !== null && (Tl(e, 1), bo(e, 1, 0));
  }
  function wc(e) {
    for (; e === Jn; )
      Jn = Pl[--ea], Pl[ea] = null, Kn = Pl[--ea], Pl[ea] = null;
    for (; e === Ol; )
      Ol = vs[--ps], vs[ps] = null, Bs = vs[--ps], vs[ps] = null, Hs = vs[--ps], vs[ps] = null;
  }
  var ts = null, Rt = null, pt = !1, zl = null, Es = !1, kc = Error(d(519));
  function Al(e) {
    var t = Error(d(418, ""));
    throw Ya(xs(t, e)), kc;
  }
  function yo(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[it] = e, t[vt] = a, l) {
      case "dialog":
        ft("cancel", t), ft("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ft("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < hn.length; l++)
          ft(hn[l], t);
        break;
      case "source":
        ft("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ft("error", t), ft("load", t);
        break;
      case "details":
        ft("toggle", t);
        break;
      case "input":
        ft("invalid", t), Du(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Un(t);
        break;
      case "select":
        ft("invalid", t);
        break;
      case "textarea":
        ft("invalid", t), qu(t, a.value, a.defaultValue, a.children), Un(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Hh(t.textContent, l) ? (a.popover != null && (ft("beforetoggle", t), ft("toggle", t)), a.onScroll != null && ft("scroll", t), a.onScrollEnd != null && ft("scrollend", t), a.onClick != null && (t.onclick = Ei), t = !0) : t = !1, t || Al(e);
  }
  function _o(e) {
    for (ts = e.return; ts; )
      switch (ts.tag) {
        case 5:
        case 13:
          Es = !1;
          return;
        case 27:
        case 3:
          Es = !0;
          return;
        default:
          ts = ts.return;
      }
  }
  function Ba(e) {
    if (e !== ts) return !1;
    if (!pt) return _o(e), pt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Gr(e.type, e.memoizedProps)), l = !l), l && Rt && Al(e), _o(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(d(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Rt = Ss(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        Rt = null;
      }
    } else
      t === 27 ? (t = Rt, jl(e.type) ? (e = Vr, Vr = null, Rt = e) : Rt = t) : Rt = ts ? Ss(e.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    Rt = ts = null, pt = !1;
  }
  function No() {
    var e = zl;
    return e !== null && (ns === null ? ns = e : ns.push.apply(
      ns,
      e
    ), zl = null), e;
  }
  function Ya(e) {
    zl === null ? zl = [e] : zl.push(e);
  }
  var Cc = L(null), Rl = null, Ls = null;
  function tl(e, t, l) {
    ee(Cc, t._currentValue), t._currentValue = l;
  }
  function Ys(e) {
    e._currentValue = Cc.current, F(Cc);
  }
  function Ec(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Oc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var r = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var h = i;
          i = n;
          for (var p = 0; p < t.length; p++)
            if (h.context === t[p]) {
              i.lanes |= l, h = i.alternate, h !== null && (h.lanes |= l), Ec(
                i.return,
                l,
                e
              ), a || (r = null);
              break e;
            }
          i = h.next;
        }
      } else if (n.tag === 18) {
        if (r = n.return, r === null) throw Error(d(341));
        r.lanes |= l, i = r.alternate, i !== null && (i.lanes |= l), Ec(r, l, e), r = null;
      } else r = n.child;
      if (r !== null) r.return = n;
      else
        for (r = n; r !== null; ) {
          if (r === e) {
            r = null;
            break;
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, r = n;
            break;
          }
          r = r.return;
        }
      n = r;
    }
  }
  function Ga(e, t, l, a) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var r = n.alternate;
        if (r === null) throw Error(d(387));
        if (r = r.memoizedProps, r !== null) {
          var h = n.type;
          is(n.pendingProps.value, r.value) || (e !== null ? e.push(h) : e = [h]);
        }
      } else if (n === Ae.current) {
        if (r = n.alternate, r === null) throw Error(d(387));
        r.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(pn) : e = [pn]);
      }
      n = n.return;
    }
    e !== null && Oc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function $n(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!is(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Ul(e) {
    Rl = e, Ls = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Pt(e) {
    return So(Rl, e);
  }
  function Wn(e, t) {
    return Rl === null && Ul(e), So(e, t);
  }
  function So(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ls === null) {
      if (e === null) throw Error(d(308));
      Ls = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ls = Ls.next = t;
    return l;
  }
  var ex = typeof AbortController < "u" ? AbortController : function() {
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
  }, tx = o.unstable_scheduleCallback, sx = o.unstable_NormalPriority, Qt = {
    $$typeof: W,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Tc() {
    return {
      controller: new ex(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Xa(e) {
    e.refCount--, e.refCount === 0 && tx(sx, function() {
      e.controller.abort();
    });
  }
  var Qa = null, zc = 0, ta = 0, sa = null;
  function lx(e, t) {
    if (Qa === null) {
      var l = Qa = [];
      zc = 0, ta = Rr(), sa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return zc++, t.then(wo, wo), t;
  }
  function wo() {
    if (--zc === 0 && Qa !== null) {
      sa !== null && (sa.status = "fulfilled");
      var e = Qa;
      Qa = null, ta = 0, sa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function ax(e, t) {
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
  var ko = g.S;
  g.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && lx(e, t), ko !== null && ko(e, t);
  };
  var Dl = L(null);
  function Ac() {
    var e = Dl.current;
    return e !== null ? e : Ct.pooledCache;
  }
  function Fn(e, t) {
    t === null ? ee(Dl, Dl.current) : ee(Dl, t.pool);
  }
  function Co() {
    var e = Ac();
    return e === null ? null : { parent: Qt._currentValue, pool: e };
  }
  var Za = Error(d(460)), Eo = Error(d(474)), In = Error(d(542)), Rc = { then: function() {
  } };
  function Oo(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Pn() {
  }
  function To(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Pn, Pn), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ao(e), e;
      default:
        if (typeof t.status == "string") t.then(Pn, Pn);
        else {
          if (e = Ct, e !== null && 100 < e.shellSuspendCounter)
            throw Error(d(482));
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
            throw e = t.reason, Ao(e), e;
        }
        throw Va = t, Za;
    }
  }
  var Va = null;
  function zo() {
    if (Va === null) throw Error(d(459));
    var e = Va;
    return Va = null, e;
  }
  function Ao(e) {
    if (e === Za || e === In)
      throw Error(d(483));
  }
  var sl = !1;
  function Uc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Dc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ll(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function al(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (bt & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Zn(e), po(e, null, l), t;
    }
    return Qn(e, a, t, l), Zn(e);
  }
  function Ja(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  function Mc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var r = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = r : i = i.next = r, l = l.next;
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
  var qc = !1;
  function Ka() {
    if (qc) {
      var e = sa;
      if (e !== null) throw e;
    }
  }
  function $a(e, t, l, a) {
    qc = !1;
    var n = e.updateQueue;
    sl = !1;
    var i = n.firstBaseUpdate, r = n.lastBaseUpdate, h = n.shared.pending;
    if (h !== null) {
      n.shared.pending = null;
      var p = h, z = p.next;
      p.next = null, r === null ? i = z : r.next = z, r = p;
      var V = e.alternate;
      V !== null && (V = V.updateQueue, h = V.lastBaseUpdate, h !== r && (h === null ? V.firstBaseUpdate = z : h.next = z, V.lastBaseUpdate = p));
    }
    if (i !== null) {
      var P = n.baseState;
      r = 0, V = z = p = null, h = i;
      do {
        var U = h.lane & -536870913, B = U !== h.lane;
        if (B ? (mt & U) === U : (a & U) === U) {
          U !== 0 && U === ta && (qc = !0), V !== null && (V = V.next = {
            lane: 0,
            tag: h.tag,
            payload: h.payload,
            callback: null,
            next: null
          });
          e: {
            var et = e, Ke = h;
            U = t;
            var St = l;
            switch (Ke.tag) {
              case 1:
                if (et = Ke.payload, typeof et == "function") {
                  P = et.call(St, P, U);
                  break e;
                }
                P = et;
                break e;
              case 3:
                et.flags = et.flags & -65537 | 128;
              case 0:
                if (et = Ke.payload, U = typeof et == "function" ? et.call(St, P, U) : et, U == null) break e;
                P = D({}, P, U);
                break e;
              case 2:
                sl = !0;
            }
          }
          U = h.callback, U !== null && (e.flags |= 64, B && (e.flags |= 8192), B = n.callbacks, B === null ? n.callbacks = [U] : B.push(U));
        } else
          B = {
            lane: U,
            tag: h.tag,
            payload: h.payload,
            callback: h.callback,
            next: null
          }, V === null ? (z = V = B, p = P) : V = V.next = B, r |= U;
        if (h = h.next, h === null) {
          if (h = n.shared.pending, h === null)
            break;
          B = h, h = B.next, B.next = null, n.lastBaseUpdate = B, n.shared.pending = null;
        }
      } while (!0);
      V === null && (p = P), n.baseState = p, n.firstBaseUpdate = z, n.lastBaseUpdate = V, i === null && (n.shared.lanes = 0), hl |= r, e.lanes = r, e.memoizedState = P;
    }
  }
  function Ro(e, t) {
    if (typeof e != "function")
      throw Error(d(191, e));
    e.call(t);
  }
  function Uo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Ro(l[e], t);
  }
  var la = L(null), ei = L(0);
  function Do(e, t) {
    e = Ks, ee(ei, e), ee(la, t), Ks = e | t.baseLanes;
  }
  function Hc() {
    ee(ei, Ks), ee(la, la.current);
  }
  function Bc() {
    Ks = ei.current, F(la), F(ei);
  }
  var nl = 0, ot = null, _t = null, Yt = null, ti = !1, aa = !1, Ml = !1, si = 0, Wa = 0, na = null, nx = 0;
  function Ht() {
    throw Error(d(321));
  }
  function Lc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!is(e[l], t[l])) return !1;
    return !0;
  }
  function Yc(e, t, l, a, n, i) {
    return nl = i, ot = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, g.H = e === null || e.memoizedState === null ? pd : gd, Ml = !1, i = l(a, n), Ml = !1, aa && (i = qo(
      t,
      l,
      a,
      n
    )), Mo(e), i;
  }
  function Mo(e) {
    g.H = ri;
    var t = _t !== null && _t.next !== null;
    if (nl = 0, Yt = _t = ot = null, ti = !1, Wa = 0, na = null, t) throw Error(d(300));
    e === null || Vt || (e = e.dependencies, e !== null && $n(e) && (Vt = !0));
  }
  function qo(e, t, l, a) {
    ot = e;
    var n = 0;
    do {
      if (aa && (na = null), Wa = 0, aa = !1, 25 <= n) throw Error(d(301));
      if (n += 1, Yt = _t = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      g.H = hx, i = t(l, a);
    } while (aa);
    return i;
  }
  function ix() {
    var e = g.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Fa(t) : t, e = e.useState()[0], (_t !== null ? _t.memoizedState : null) !== e && (ot.flags |= 1024), t;
  }
  function Gc() {
    var e = si !== 0;
    return si = 0, e;
  }
  function Xc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Qc(e) {
    if (ti) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ti = !1;
    }
    nl = 0, Yt = _t = ot = null, aa = !1, Wa = si = 0, na = null;
  }
  function ls() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Yt === null ? ot.memoizedState = Yt = e : Yt = Yt.next = e, Yt;
  }
  function Gt() {
    if (_t === null) {
      var e = ot.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = _t.next;
    var t = Yt === null ? ot.memoizedState : Yt.next;
    if (t !== null)
      Yt = t, _t = e;
    else {
      if (e === null)
        throw ot.alternate === null ? Error(d(467)) : Error(d(310));
      _t = e, e = {
        memoizedState: _t.memoizedState,
        baseState: _t.baseState,
        baseQueue: _t.baseQueue,
        queue: _t.queue,
        next: null
      }, Yt === null ? ot.memoizedState = Yt = e : Yt = Yt.next = e;
    }
    return Yt;
  }
  function Zc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fa(e) {
    var t = Wa;
    return Wa += 1, na === null && (na = []), e = To(na, e, t), t = ot, (Yt === null ? t.memoizedState : Yt.next) === null && (t = t.alternate, g.H = t === null || t.memoizedState === null ? pd : gd), e;
  }
  function li(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Fa(e);
      if (e.$$typeof === W) return Pt(e);
    }
    throw Error(d(438, String(e)));
  }
  function Vc(e) {
    var t = null, l = ot.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ot.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Zc(), ot.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ge;
    return t.index++, l;
  }
  function Gs(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ai(e) {
    var t = Gt();
    return Jc(t, _t, e);
  }
  function Jc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(d(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, i = a.pending;
    if (i !== null) {
      if (n !== null) {
        var r = n.next;
        n.next = i.next, i.next = r;
      }
      t.baseQueue = n = i, a.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var h = r = null, p = null, z = t, V = !1;
      do {
        var P = z.lane & -536870913;
        if (P !== z.lane ? (mt & P) === P : (nl & P) === P) {
          var U = z.revertLane;
          if (U === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), P === ta && (V = !0);
          else if ((nl & U) === U) {
            z = z.next, U === ta && (V = !0);
            continue;
          } else
            P = {
              lane: 0,
              revertLane: z.revertLane,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, p === null ? (h = p = P, r = i) : p = p.next = P, ot.lanes |= U, hl |= U;
          P = z.action, Ml && l(i, P), i = z.hasEagerState ? z.eagerState : l(i, P);
        } else
          U = {
            lane: P,
            revertLane: z.revertLane,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, p === null ? (h = p = U, r = i) : p = p.next = U, ot.lanes |= P, hl |= P;
        z = z.next;
      } while (z !== null && z !== t);
      if (p === null ? r = i : p.next = h, !is(i, e.memoizedState) && (Vt = !0, V && (l = sa, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = r, e.baseQueue = p, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Kc(e) {
    var t = Gt(), l = t.queue;
    if (l === null) throw Error(d(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var r = n = n.next;
      do
        i = e(i, r.action), r = r.next;
      while (r !== n);
      is(i, t.memoizedState) || (Vt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Ho(e, t, l) {
    var a = ot, n = Gt(), i = pt;
    if (i) {
      if (l === void 0) throw Error(d(407));
      l = l();
    } else l = t();
    var r = !is(
      (_t || n).memoizedState,
      l
    );
    r && (n.memoizedState = l, Vt = !0), n = n.queue;
    var h = Yo.bind(null, a, n, e);
    if (Ia(2048, 8, h, [e]), n.getSnapshot !== t || r || Yt !== null && Yt.memoizedState.tag & 1) {
      if (a.flags |= 2048, ia(
        9,
        ni(),
        Lo.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), Ct === null) throw Error(d(349));
      i || (nl & 124) !== 0 || Bo(a, t, l);
    }
    return l;
  }
  function Bo(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ot.updateQueue, t === null ? (t = Zc(), ot.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Lo(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Go(t) && Xo(e);
  }
  function Yo(e, t, l) {
    return l(function() {
      Go(t) && Xo(e);
    });
  }
  function Go(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !is(e, l);
    } catch {
      return !0;
    }
  }
  function Xo(e) {
    var t = Fl(e, 2);
    t !== null && hs(t, e, 2);
  }
  function $c(e) {
    var t = ls();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Ml) {
        Ue(!0);
        try {
          l();
        } finally {
          Ue(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Gs,
      lastRenderedState: e
    }, t;
  }
  function Qo(e, t, l, a) {
    return e.baseState = l, Jc(
      e,
      _t,
      typeof a == "function" ? a : Gs
    );
  }
  function cx(e, t, l, a, n) {
    if (ci(e)) throw Error(d(485));
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
        then: function(r) {
          i.listeners.push(r);
        }
      };
      g.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Zo(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Zo(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = g.T, r = {};
      g.T = r;
      try {
        var h = l(n, a), p = g.S;
        p !== null && p(r, h), Vo(e, t, h);
      } catch (z) {
        Wc(e, t, z);
      } finally {
        g.T = i;
      }
    } else
      try {
        i = l(n, a), Vo(e, t, i);
      } catch (z) {
        Wc(e, t, z);
      }
  }
  function Vo(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Jo(e, t, a);
      },
      function(a) {
        return Wc(e, t, a);
      }
    ) : Jo(e, t, l);
  }
  function Jo(e, t, l) {
    t.status = "fulfilled", t.value = l, Ko(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Zo(e, l)));
  }
  function Wc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Ko(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Ko(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function $o(e, t) {
    return t;
  }
  function Wo(e, t) {
    if (pt) {
      var l = Ct.formState;
      if (l !== null) {
        e: {
          var a = ot;
          if (pt) {
            if (Rt) {
              t: {
                for (var n = Rt, i = Es; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Ss(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Rt = Ss(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Al(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = ls(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: $o,
      lastRenderedState: t
    }, l.queue = a, l = xd.bind(
      null,
      ot,
      a
    ), a.dispatch = l, a = $c(!1), i = tr.bind(
      null,
      ot,
      !1,
      a.queue
    ), a = ls(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = cx.bind(
      null,
      ot,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Fo(e) {
    var t = Gt();
    return Io(t, _t, e);
  }
  function Io(e, t, l) {
    if (t = Jc(
      e,
      t,
      $o
    )[0], e = ai(Gs)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Fa(t);
      } catch (r) {
        throw r === Za ? In : r;
      }
    else a = t;
    t = Gt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ot.flags |= 2048, ia(
      9,
      ni(),
      rx.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function rx(e, t) {
    e.action = t;
  }
  function Po(e) {
    var t = Gt(), l = _t;
    if (l !== null)
      return Io(t, l, e);
    Gt(), t = t.memoizedState, l = Gt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function ia(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ot.updateQueue, t === null && (t = Zc(), ot.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function ni() {
    return { destroy: void 0, resource: void 0 };
  }
  function ed() {
    return Gt().memoizedState;
  }
  function ii(e, t, l, a) {
    var n = ls();
    a = a === void 0 ? null : a, ot.flags |= e, n.memoizedState = ia(
      1 | t,
      ni(),
      l,
      a
    );
  }
  function Ia(e, t, l, a) {
    var n = Gt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    _t !== null && a !== null && Lc(a, _t.memoizedState.deps) ? n.memoizedState = ia(t, i, l, a) : (ot.flags |= e, n.memoizedState = ia(
      1 | t,
      i,
      l,
      a
    ));
  }
  function td(e, t) {
    ii(8390656, 8, e, t);
  }
  function sd(e, t) {
    Ia(2048, 8, e, t);
  }
  function ld(e, t) {
    return Ia(4, 2, e, t);
  }
  function ad(e, t) {
    return Ia(4, 4, e, t);
  }
  function nd(e, t) {
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
  function id(e, t, l) {
    l = l != null ? l.concat([e]) : null, Ia(4, 4, nd.bind(null, t, e), l);
  }
  function Fc() {
  }
  function cd(e, t) {
    var l = Gt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Lc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function rd(e, t) {
    var l = Gt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Lc(t, a[1]))
      return a[0];
    if (a = e(), Ml) {
      Ue(!0);
      try {
        e();
      } finally {
        Ue(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Ic(e, t, l) {
    return l === void 0 || (nl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = dh(), ot.lanes |= e, hl |= e, l);
  }
  function ud(e, t, l, a) {
    return is(l, t) ? l : la.current !== null ? (e = Ic(e, l, a), is(e, t) || (Vt = !0), e) : (nl & 42) === 0 ? (Vt = !0, e.memoizedState = l) : (e = dh(), ot.lanes |= e, hl |= e, t);
  }
  function od(e, t, l, a, n) {
    var i = X.p;
    X.p = i !== 0 && 8 > i ? i : 8;
    var r = g.T, h = {};
    g.T = h, tr(e, !1, t, l);
    try {
      var p = n(), z = g.S;
      if (z !== null && z(h, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var V = ax(
          p,
          a
        );
        Pa(
          e,
          t,
          V,
          ds(e)
        );
      } else
        Pa(
          e,
          t,
          a,
          ds(e)
        );
    } catch (P) {
      Pa(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: P },
        ds()
      );
    } finally {
      X.p = i, g.T = r;
    }
  }
  function ux() {
  }
  function Pc(e, t, l, a) {
    if (e.tag !== 5) throw Error(d(476));
    var n = dd(e).queue;
    od(
      e,
      n,
      t,
      se,
      l === null ? ux : function() {
        return hd(e), l(a);
      }
    );
  }
  function dd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: se,
      baseState: se,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Gs,
        lastRenderedState: se
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
        lastRenderedReducer: Gs,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function hd(e) {
    var t = dd(e).next.queue;
    Pa(e, t, {}, ds());
  }
  function er() {
    return Pt(pn);
  }
  function fd() {
    return Gt().memoizedState;
  }
  function md() {
    return Gt().memoizedState;
  }
  function ox(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = ds();
          e = ll(l);
          var a = al(t, e, l);
          a !== null && (hs(a, t, l), Ja(a, t, l)), t = { cache: Tc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function dx(e, t, l) {
    var a = ds();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ci(e) ? jd(t, l) : (l = bc(e, t, l, a), l !== null && (hs(l, e, a), vd(l, t, a)));
  }
  function xd(e, t, l) {
    var a = ds();
    Pa(e, t, l, a);
  }
  function Pa(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ci(e)) jd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var r = t.lastRenderedState, h = i(r, l);
          if (n.hasEagerState = !0, n.eagerState = h, is(h, r))
            return Qn(e, t, n, 0), Ct === null && Xn(), !1;
        } catch {
        } finally {
        }
      if (l = bc(e, t, n, a), l !== null)
        return hs(l, e, a), vd(l, t, a), !0;
    }
    return !1;
  }
  function tr(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Rr(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ci(e)) {
      if (t) throw Error(d(479));
    } else
      t = bc(
        e,
        l,
        a,
        2
      ), t !== null && hs(t, e, 2);
  }
  function ci(e) {
    var t = e.alternate;
    return e === ot || t !== null && t === ot;
  }
  function jd(e, t) {
    aa = ti = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function vd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  var ri = {
    readContext: Pt,
    use: li,
    useCallback: Ht,
    useContext: Ht,
    useEffect: Ht,
    useImperativeHandle: Ht,
    useLayoutEffect: Ht,
    useInsertionEffect: Ht,
    useMemo: Ht,
    useReducer: Ht,
    useRef: Ht,
    useState: Ht,
    useDebugValue: Ht,
    useDeferredValue: Ht,
    useTransition: Ht,
    useSyncExternalStore: Ht,
    useId: Ht,
    useHostTransitionStatus: Ht,
    useFormState: Ht,
    useActionState: Ht,
    useOptimistic: Ht,
    useMemoCache: Ht,
    useCacheRefresh: Ht
  }, pd = {
    readContext: Pt,
    use: li,
    useCallback: function(e, t) {
      return ls().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Pt,
    useEffect: td,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ii(
        4194308,
        4,
        nd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ii(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ii(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ls();
      t = t === void 0 ? null : t;
      var a = e();
      if (Ml) {
        Ue(!0);
        try {
          e();
        } finally {
          Ue(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = ls();
      if (l !== void 0) {
        var n = l(t);
        if (Ml) {
          Ue(!0);
          try {
            l(t);
          } finally {
            Ue(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = dx.bind(
        null,
        ot,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ls();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = $c(e);
      var t = e.queue, l = xd.bind(null, ot, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = ls();
      return Ic(l, e, t);
    },
    useTransition: function() {
      var e = $c(!1);
      return e = od.bind(
        null,
        ot,
        e.queue,
        !0,
        !1
      ), ls().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ot, n = ls();
      if (pt) {
        if (l === void 0)
          throw Error(d(407));
        l = l();
      } else {
        if (l = t(), Ct === null)
          throw Error(d(349));
        (mt & 124) !== 0 || Bo(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, td(Yo.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, ia(
        9,
        ni(),
        Lo.bind(
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
      var e = ls(), t = Ct.identifierPrefix;
      if (pt) {
        var l = Bs, a = Hs;
        l = (a & ~(1 << 32 - st(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = si++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = nx++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: er,
    useFormState: Wo,
    useActionState: Wo,
    useOptimistic: function(e) {
      var t = ls();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = tr.bind(
        null,
        ot,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Vc,
    useCacheRefresh: function() {
      return ls().memoizedState = ox.bind(
        null,
        ot
      );
    }
  }, gd = {
    readContext: Pt,
    use: li,
    useCallback: cd,
    useContext: Pt,
    useEffect: sd,
    useImperativeHandle: id,
    useInsertionEffect: ld,
    useLayoutEffect: ad,
    useMemo: rd,
    useReducer: ai,
    useRef: ed,
    useState: function() {
      return ai(Gs);
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = Gt();
      return ud(
        l,
        _t.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ai(Gs)[0], t = Gt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: Ho,
    useId: fd,
    useHostTransitionStatus: er,
    useFormState: Fo,
    useActionState: Fo,
    useOptimistic: function(e, t) {
      var l = Gt();
      return Qo(l, _t, e, t);
    },
    useMemoCache: Vc,
    useCacheRefresh: md
  }, hx = {
    readContext: Pt,
    use: li,
    useCallback: cd,
    useContext: Pt,
    useEffect: sd,
    useImperativeHandle: id,
    useInsertionEffect: ld,
    useLayoutEffect: ad,
    useMemo: rd,
    useReducer: Kc,
    useRef: ed,
    useState: function() {
      return Kc(Gs);
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = Gt();
      return _t === null ? Ic(l, e, t) : ud(
        l,
        _t.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Kc(Gs)[0], t = Gt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: Ho,
    useId: fd,
    useHostTransitionStatus: er,
    useFormState: Po,
    useActionState: Po,
    useOptimistic: function(e, t) {
      var l = Gt();
      return _t !== null ? Qo(l, _t, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Vc,
    useCacheRefresh: md
  }, ca = null, en = 0;
  function ui(e) {
    var t = en;
    return en += 1, ca === null && (ca = []), To(ca, e, t);
  }
  function tn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function oi(e, t) {
    throw t.$$typeof === J ? Error(d(525)) : (e = Object.prototype.toString.call(t), Error(
      d(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function bd(e) {
    var t = e._init;
    return t(e._payload);
  }
  function yd(e) {
    function t(C, N) {
      if (e) {
        var O = C.deletions;
        O === null ? (C.deletions = [N], C.flags |= 16) : O.push(N);
      }
    }
    function l(C, N) {
      if (!e) return null;
      for (; N !== null; )
        t(C, N), N = N.sibling;
      return null;
    }
    function a(C) {
      for (var N = /* @__PURE__ */ new Map(); C !== null; )
        C.key !== null ? N.set(C.key, C) : N.set(C.index, C), C = C.sibling;
      return N;
    }
    function n(C, N) {
      return C = qs(C, N), C.index = 0, C.sibling = null, C;
    }
    function i(C, N, O) {
      return C.index = O, e ? (O = C.alternate, O !== null ? (O = O.index, O < N ? (C.flags |= 67108866, N) : O) : (C.flags |= 67108866, N)) : (C.flags |= 1048576, N);
    }
    function r(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function h(C, N, O, $) {
      return N === null || N.tag !== 6 ? (N = _c(O, C.mode, $), N.return = C, N) : (N = n(N, O), N.return = C, N);
    }
    function p(C, N, O, $) {
      var De = O.type;
      return De === me ? V(
        C,
        N,
        O.props.children,
        $,
        O.key
      ) : N !== null && (N.elementType === De || typeof De == "object" && De !== null && De.$$typeof === ze && bd(De) === N.type) ? (N = n(N, O.props), tn(N, O), N.return = C, N) : (N = Vn(
        O.type,
        O.key,
        O.props,
        null,
        C.mode,
        $
      ), tn(N, O), N.return = C, N);
    }
    function z(C, N, O, $) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== O.containerInfo || N.stateNode.implementation !== O.implementation ? (N = Nc(O, C.mode, $), N.return = C, N) : (N = n(N, O.children || []), N.return = C, N);
    }
    function V(C, N, O, $, De) {
      return N === null || N.tag !== 7 ? (N = El(
        O,
        C.mode,
        $,
        De
      ), N.return = C, N) : (N = n(N, O), N.return = C, N);
    }
    function P(C, N, O) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = _c(
          "" + N,
          C.mode,
          O
        ), N.return = C, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case k:
            return O = Vn(
              N.type,
              N.key,
              N.props,
              null,
              C.mode,
              O
            ), tn(O, N), O.return = C, O;
          case te:
            return N = Nc(
              N,
              C.mode,
              O
            ), N.return = C, N;
          case ze:
            var $ = N._init;
            return N = $(N._payload), P(C, N, O);
        }
        if (re(N) || ve(N))
          return N = El(
            N,
            C.mode,
            O,
            null
          ), N.return = C, N;
        if (typeof N.then == "function")
          return P(C, ui(N), O);
        if (N.$$typeof === W)
          return P(
            C,
            Wn(C, N),
            O
          );
        oi(C, N);
      }
      return null;
    }
    function U(C, N, O, $) {
      var De = N !== null ? N.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return De !== null ? null : h(C, N, "" + O, $);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            return O.key === De ? p(C, N, O, $) : null;
          case te:
            return O.key === De ? z(C, N, O, $) : null;
          case ze:
            return De = O._init, O = De(O._payload), U(C, N, O, $);
        }
        if (re(O) || ve(O))
          return De !== null ? null : V(C, N, O, $, null);
        if (typeof O.then == "function")
          return U(
            C,
            N,
            ui(O),
            $
          );
        if (O.$$typeof === W)
          return U(
            C,
            N,
            Wn(C, O),
            $
          );
        oi(C, O);
      }
      return null;
    }
    function B(C, N, O, $, De) {
      if (typeof $ == "string" && $ !== "" || typeof $ == "number" || typeof $ == "bigint")
        return C = C.get(O) || null, h(N, C, "" + $, De);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case k:
            return C = C.get(
              $.key === null ? O : $.key
            ) || null, p(N, C, $, De);
          case te:
            return C = C.get(
              $.key === null ? O : $.key
            ) || null, z(N, C, $, De);
          case ze:
            var dt = $._init;
            return $ = dt($._payload), B(
              C,
              N,
              O,
              $,
              De
            );
        }
        if (re($) || ve($))
          return C = C.get(O) || null, V(N, C, $, De, null);
        if (typeof $.then == "function")
          return B(
            C,
            N,
            O,
            ui($),
            De
          );
        if ($.$$typeof === W)
          return B(
            C,
            N,
            O,
            Wn(N, $),
            De
          );
        oi(N, $);
      }
      return null;
    }
    function et(C, N, O, $) {
      for (var De = null, dt = null, Be = N, We = N = 0, Kt = null; Be !== null && We < O.length; We++) {
        Be.index > We ? (Kt = Be, Be = null) : Kt = Be.sibling;
        var jt = U(
          C,
          Be,
          O[We],
          $
        );
        if (jt === null) {
          Be === null && (Be = Kt);
          break;
        }
        e && Be && jt.alternate === null && t(C, Be), N = i(jt, N, We), dt === null ? De = jt : dt.sibling = jt, dt = jt, Be = Kt;
      }
      if (We === O.length)
        return l(C, Be), pt && Tl(C, We), De;
      if (Be === null) {
        for (; We < O.length; We++)
          Be = P(C, O[We], $), Be !== null && (N = i(
            Be,
            N,
            We
          ), dt === null ? De = Be : dt.sibling = Be, dt = Be);
        return pt && Tl(C, We), De;
      }
      for (Be = a(Be); We < O.length; We++)
        Kt = B(
          Be,
          C,
          We,
          O[We],
          $
        ), Kt !== null && (e && Kt.alternate !== null && Be.delete(
          Kt.key === null ? We : Kt.key
        ), N = i(
          Kt,
          N,
          We
        ), dt === null ? De = Kt : dt.sibling = Kt, dt = Kt);
      return e && Be.forEach(function(yl) {
        return t(C, yl);
      }), pt && Tl(C, We), De;
    }
    function Ke(C, N, O, $) {
      if (O == null) throw Error(d(151));
      for (var De = null, dt = null, Be = N, We = N = 0, Kt = null, jt = O.next(); Be !== null && !jt.done; We++, jt = O.next()) {
        Be.index > We ? (Kt = Be, Be = null) : Kt = Be.sibling;
        var yl = U(C, Be, jt.value, $);
        if (yl === null) {
          Be === null && (Be = Kt);
          break;
        }
        e && Be && yl.alternate === null && t(C, Be), N = i(yl, N, We), dt === null ? De = yl : dt.sibling = yl, dt = yl, Be = Kt;
      }
      if (jt.done)
        return l(C, Be), pt && Tl(C, We), De;
      if (Be === null) {
        for (; !jt.done; We++, jt = O.next())
          jt = P(C, jt.value, $), jt !== null && (N = i(jt, N, We), dt === null ? De = jt : dt.sibling = jt, dt = jt);
        return pt && Tl(C, We), De;
      }
      for (Be = a(Be); !jt.done; We++, jt = O.next())
        jt = B(Be, C, We, jt.value, $), jt !== null && (e && jt.alternate !== null && Be.delete(jt.key === null ? We : jt.key), N = i(jt, N, We), dt === null ? De = jt : dt.sibling = jt, dt = jt);
      return e && Be.forEach(function(fj) {
        return t(C, fj);
      }), pt && Tl(C, We), De;
    }
    function St(C, N, O, $) {
      if (typeof O == "object" && O !== null && O.type === me && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            e: {
              for (var De = O.key; N !== null; ) {
                if (N.key === De) {
                  if (De = O.type, De === me) {
                    if (N.tag === 7) {
                      l(
                        C,
                        N.sibling
                      ), $ = n(
                        N,
                        O.props.children
                      ), $.return = C, C = $;
                      break e;
                    }
                  } else if (N.elementType === De || typeof De == "object" && De !== null && De.$$typeof === ze && bd(De) === N.type) {
                    l(
                      C,
                      N.sibling
                    ), $ = n(N, O.props), tn($, O), $.return = C, C = $;
                    break e;
                  }
                  l(C, N);
                  break;
                } else t(C, N);
                N = N.sibling;
              }
              O.type === me ? ($ = El(
                O.props.children,
                C.mode,
                $,
                O.key
              ), $.return = C, C = $) : ($ = Vn(
                O.type,
                O.key,
                O.props,
                null,
                C.mode,
                $
              ), tn($, O), $.return = C, C = $);
            }
            return r(C);
          case te:
            e: {
              for (De = O.key; N !== null; ) {
                if (N.key === De)
                  if (N.tag === 4 && N.stateNode.containerInfo === O.containerInfo && N.stateNode.implementation === O.implementation) {
                    l(
                      C,
                      N.sibling
                    ), $ = n(N, O.children || []), $.return = C, C = $;
                    break e;
                  } else {
                    l(C, N);
                    break;
                  }
                else t(C, N);
                N = N.sibling;
              }
              $ = Nc(O, C.mode, $), $.return = C, C = $;
            }
            return r(C);
          case ze:
            return De = O._init, O = De(O._payload), St(
              C,
              N,
              O,
              $
            );
        }
        if (re(O))
          return et(
            C,
            N,
            O,
            $
          );
        if (ve(O)) {
          if (De = ve(O), typeof De != "function") throw Error(d(150));
          return O = De.call(O), Ke(
            C,
            N,
            O,
            $
          );
        }
        if (typeof O.then == "function")
          return St(
            C,
            N,
            ui(O),
            $
          );
        if (O.$$typeof === W)
          return St(
            C,
            N,
            Wn(C, O),
            $
          );
        oi(C, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, N !== null && N.tag === 6 ? (l(C, N.sibling), $ = n(N, O), $.return = C, C = $) : (l(C, N), $ = _c(O, C.mode, $), $.return = C, C = $), r(C)) : l(C, N);
    }
    return function(C, N, O, $) {
      try {
        en = 0;
        var De = St(
          C,
          N,
          O,
          $
        );
        return ca = null, De;
      } catch (Be) {
        if (Be === Za || Be === In) throw Be;
        var dt = cs(29, Be, null, C.mode);
        return dt.lanes = $, dt.return = C, dt;
      } finally {
      }
    };
  }
  var ra = yd(!0), _d = yd(!1), gs = L(null), Os = null;
  function il(e) {
    var t = e.alternate;
    ee(Zt, Zt.current & 1), ee(gs, e), Os === null && (t === null || la.current !== null || t.memoizedState !== null) && (Os = e);
  }
  function Nd(e) {
    if (e.tag === 22) {
      if (ee(Zt, Zt.current), ee(gs, e), Os === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Os = e);
      }
    } else cl();
  }
  function cl() {
    ee(Zt, Zt.current), ee(gs, gs.current);
  }
  function Xs(e) {
    F(gs), Os === e && (Os = null), F(Zt);
  }
  var Zt = L(0);
  function di(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Zr(l)))
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
  function sr(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : D({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var lr = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = ds(), n = ll(a);
      n.payload = t, l != null && (n.callback = l), t = al(e, n, a), t !== null && (hs(t, e, a), Ja(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = ds(), n = ll(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = al(e, n, a), t !== null && (hs(t, e, a), Ja(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = ds(), a = ll(l);
      a.tag = 2, t != null && (a.callback = t), t = al(e, a, l), t !== null && (hs(t, e, l), Ja(t, e, l));
    }
  };
  function Sd(e, t, l, a, n, i, r) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, r) : t.prototype && t.prototype.isPureReactComponent ? !qa(l, a) || !qa(n, i) : !0;
  }
  function wd(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && lr.enqueueReplaceState(t, t.state, null);
  }
  function ql(e, t) {
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
  var hi = typeof reportError == "function" ? reportError : function(e) {
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
  function kd(e) {
    hi(e);
  }
  function Cd(e) {
    console.error(e);
  }
  function Ed(e) {
    hi(e);
  }
  function fi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Od(e, t, l) {
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
  function ar(e, t, l) {
    return l = ll(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      fi(e, t);
    }, l;
  }
  function Td(e) {
    return e = ll(e), e.tag = 3, e;
  }
  function zd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        Od(t, l, a);
      };
    }
    var r = l.stateNode;
    r !== null && typeof r.componentDidCatch == "function" && (e.callback = function() {
      Od(t, l, a), typeof n != "function" && (fl === null ? fl = /* @__PURE__ */ new Set([this]) : fl.add(this));
      var h = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: h !== null ? h : ""
      });
    });
  }
  function fx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ga(
        t,
        l,
        n,
        !0
      ), l = gs.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Os === null ? Er() : l.alternate === null && Ut === 0 && (Ut = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Rc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Tr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Rc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Tr(e, a, n)), !1;
        }
        throw Error(d(435, l.tag));
      }
      return Tr(e, a, n), Er(), !1;
    }
    if (pt)
      return t = gs.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== kc && (e = Error(d(422), { cause: a }), Ya(xs(e, l)))) : (a !== kc && (t = Error(d(423), {
        cause: a
      }), Ya(
        xs(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = xs(a, l), n = ar(
        e.stateNode,
        a,
        n
      ), Mc(e, n), Ut !== 4 && (Ut = 2)), !1;
    var i = Error(d(520), { cause: a });
    if (i = xs(i, l), un === null ? un = [i] : un.push(i), Ut !== 4 && (Ut = 2), t === null) return !0;
    a = xs(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = ar(l.stateNode, a, e), Mc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (fl === null || !fl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Td(n), zd(
              n,
              e,
              l,
              a
            ), Mc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Ad = Error(d(461)), Vt = !1;
  function $t(e, t, l, a) {
    t.child = e === null ? _d(t, null, l, a) : ra(
      t,
      e.child,
      l,
      a
    );
  }
  function Rd(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var r = {};
      for (var h in a)
        h !== "ref" && (r[h] = a[h]);
    } else r = a;
    return Ul(t), a = Yc(
      e,
      t,
      l,
      r,
      i,
      n
    ), h = Gc(), e !== null && !Vt ? (Xc(e, t, n), Qs(e, t, n)) : (pt && h && Sc(t), t.flags |= 1, $t(e, t, a, n), t.child);
  }
  function Ud(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !yc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Dd(
        e,
        t,
        i,
        a,
        n
      )) : (e = Vn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !hr(e, n)) {
      var r = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : qa, l(r, a) && e.ref === t.ref)
        return Qs(e, t, n);
    }
    return t.flags |= 1, e = qs(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Dd(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (qa(i, a) && e.ref === t.ref)
        if (Vt = !1, t.pendingProps = a = i, hr(e, n))
          (e.flags & 131072) !== 0 && (Vt = !0);
        else
          return t.lanes = e.lanes, Qs(e, t, n);
    }
    return nr(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Md(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return qd(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Fn(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Do(t, i) : Hc(), Nd(t);
      else
        return t.lanes = t.childLanes = 536870912, qd(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (Fn(t, i.cachePool), Do(t, i), cl(), t.memoizedState = null) : (e !== null && Fn(t, null), Hc(), cl());
    return $t(e, t, n, l), t.child;
  }
  function qd(e, t, l, a) {
    var n = Ac();
    return n = n === null ? null : { parent: Qt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && Fn(t, null), Hc(), Nd(t), e !== null && Ga(e, t, a, !0), null;
  }
  function mi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(d(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function nr(e, t, l, a, n) {
    return Ul(t), l = Yc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Gc(), e !== null && !Vt ? (Xc(e, t, n), Qs(e, t, n)) : (pt && a && Sc(t), t.flags |= 1, $t(e, t, l, n), t.child);
  }
  function Hd(e, t, l, a, n, i) {
    return Ul(t), t.updateQueue = null, l = qo(
      t,
      a,
      l,
      n
    ), Mo(e), a = Gc(), e !== null && !Vt ? (Xc(e, t, i), Qs(e, t, i)) : (pt && a && Sc(t), t.flags |= 1, $t(e, t, l, i), t.child);
  }
  function Bd(e, t, l, a, n) {
    if (Ul(t), t.stateNode === null) {
      var i = Il, r = l.contextType;
      typeof r == "object" && r !== null && (i = Pt(r)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = lr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Uc(t), r = l.contextType, i.context = typeof r == "object" && r !== null ? Pt(r) : Il, i.state = t.memoizedState, r = l.getDerivedStateFromProps, typeof r == "function" && (sr(
        t,
        l,
        r,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (r = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), r !== i.state && lr.enqueueReplaceState(i, i.state, null), $a(t, a, i, n), Ka(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var h = t.memoizedProps, p = ql(l, h);
      i.props = p;
      var z = i.context, V = l.contextType;
      r = Il, typeof V == "object" && V !== null && (r = Pt(V));
      var P = l.getDerivedStateFromProps;
      V = typeof P == "function" || typeof i.getSnapshotBeforeUpdate == "function", h = t.pendingProps !== h, V || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (h || z !== r) && wd(
        t,
        i,
        a,
        r
      ), sl = !1;
      var U = t.memoizedState;
      i.state = U, $a(t, a, i, n), Ka(), z = t.memoizedState, h || U !== z || sl ? (typeof P == "function" && (sr(
        t,
        l,
        P,
        a
      ), z = t.memoizedState), (p = sl || Sd(
        t,
        l,
        p,
        a,
        U,
        z,
        r
      )) ? (V || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = r, a = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Dc(e, t), r = t.memoizedProps, V = ql(l, r), i.props = V, P = t.pendingProps, U = i.context, z = l.contextType, p = Il, typeof z == "object" && z !== null && (p = Pt(z)), h = l.getDerivedStateFromProps, (z = typeof h == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (r !== P || U !== p) && wd(
        t,
        i,
        a,
        p
      ), sl = !1, U = t.memoizedState, i.state = U, $a(t, a, i, n), Ka();
      var B = t.memoizedState;
      r !== P || U !== B || sl || e !== null && e.dependencies !== null && $n(e.dependencies) ? (typeof h == "function" && (sr(
        t,
        l,
        h,
        a
      ), B = t.memoizedState), (V = sl || Sd(
        t,
        l,
        V,
        a,
        U,
        B,
        p
      ) || e !== null && e.dependencies !== null && $n(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, B, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        B,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || r === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || r === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = B), i.props = a, i.state = B, i.context = p, a = V) : (typeof i.componentDidUpdate != "function" || r === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || r === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, mi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ra(
      t,
      e.child,
      null,
      n
    ), t.child = ra(
      t,
      null,
      l,
      n
    )) : $t(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Qs(
      e,
      t,
      n
    ), e;
  }
  function Ld(e, t, l, a) {
    return La(), t.flags |= 256, $t(e, t, l, a), t.child;
  }
  var ir = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function cr(e) {
    return { baseLanes: e, cachePool: Co() };
  }
  function rr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= bs), e;
  }
  function Yd(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, r;
    if ((r = i) || (r = e !== null && e.memoizedState === null ? !1 : (Zt.current & 2) !== 0), r && (n = !0, t.flags &= -129), r = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (pt) {
        if (n ? il(t) : cl(), pt) {
          var h = Rt, p;
          if (p = h) {
            e: {
              for (p = h, h = Es; p.nodeType !== 8; ) {
                if (!h) {
                  h = null;
                  break e;
                }
                if (p = Ss(
                  p.nextSibling
                ), p === null) {
                  h = null;
                  break e;
                }
              }
              h = p;
            }
            h !== null ? (t.memoizedState = {
              dehydrated: h,
              treeContext: Ol !== null ? { id: Hs, overflow: Bs } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = cs(
              18,
              null,
              null,
              0
            ), p.stateNode = h, p.return = t, t.child = p, ts = t, Rt = null, p = !0) : p = !1;
          }
          p || Al(t);
        }
        if (h = t.memoizedState, h !== null && (h = h.dehydrated, h !== null))
          return Zr(h) ? t.lanes = 32 : t.lanes = 536870912, null;
        Xs(t);
      }
      return h = a.children, a = a.fallback, n ? (cl(), n = t.mode, h = xi(
        { mode: "hidden", children: h },
        n
      ), a = El(
        a,
        n,
        l,
        null
      ), h.return = t, a.return = t, h.sibling = a, t.child = h, n = t.child, n.memoizedState = cr(l), n.childLanes = rr(
        e,
        r,
        l
      ), t.memoizedState = ir, a) : (il(t), ur(t, h));
    }
    if (p = e.memoizedState, p !== null && (h = p.dehydrated, h !== null)) {
      if (i)
        t.flags & 256 ? (il(t), t.flags &= -257, t = or(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (cl(), t.child = e.child, t.flags |= 128, t = null) : (cl(), n = a.fallback, h = t.mode, a = xi(
          { mode: "visible", children: a.children },
          h
        ), n = El(
          n,
          h,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, ra(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = cr(l), a.childLanes = rr(
          e,
          r,
          l
        ), t.memoizedState = ir, t = n);
      else if (il(t), Zr(h)) {
        if (r = h.nextSibling && h.nextSibling.dataset, r) var z = r.dgst;
        r = z, a = Error(d(419)), a.stack = "", a.digest = r, Ya({ value: a, source: null, stack: null }), t = or(
          e,
          t,
          l
        );
      } else if (Vt || Ga(e, t, l, !1), r = (l & e.childLanes) !== 0, Vt || r) {
        if (r = Ct, r !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : he(a), a = (a & (r.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== p.retryLane))
          throw p.retryLane = a, Fl(e, a), hs(r, e, a), Ad;
        h.data === "$?" || Er(), t = or(
          e,
          t,
          l
        );
      } else
        h.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Rt = Ss(
          h.nextSibling
        ), ts = t, pt = !0, zl = null, Es = !1, e !== null && (vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Hs = e.id, Bs = e.overflow, Ol = t), t = ur(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (cl(), n = a.fallback, h = t.mode, p = e.child, z = p.sibling, a = qs(p, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = p.subtreeFlags & 65011712, z !== null ? n = qs(z, n) : (n = El(
      n,
      h,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, h = e.child.memoizedState, h === null ? h = cr(l) : (p = h.cachePool, p !== null ? (z = Qt._currentValue, p = p.parent !== z ? { parent: z, pool: z } : p) : p = Co(), h = {
      baseLanes: h.baseLanes | l,
      cachePool: p
    }), n.memoizedState = h, n.childLanes = rr(
      e,
      r,
      l
    ), t.memoizedState = ir, a) : (il(t), l = e.child, e = l.sibling, l = qs(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function ur(e, t) {
    return t = xi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function xi(e, t) {
    return e = cs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function or(e, t, l) {
    return ra(t, e.child, null, l), e = ur(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Gd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Ec(e.return, t, l);
  }
  function dr(e, t, l, a, n) {
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
  function Xd(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if ($t(e, t, a.children, l), a = Zt.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Gd(e, l, t);
          else if (e.tag === 19)
            Gd(e, l, t);
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
    switch (ee(Zt, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && di(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), dr(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && di(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        dr(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        dr(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Qs(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), hl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ga(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(d(153));
    if (t.child !== null) {
      for (e = t.child, l = qs(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = qs(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function hr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && $n(e)));
  }
  function mx(e, t, l) {
    switch (t.tag) {
      case 3:
        ae(t, t.stateNode.containerInfo), tl(t, Qt, e.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        at(t);
        break;
      case 4:
        ae(t, t.stateNode.containerInfo);
        break;
      case 10:
        tl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (il(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Yd(e, t, l) : (il(t), e = Qs(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        il(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ga(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Xd(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), ee(Zt, Zt.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Md(e, t, l);
      case 24:
        tl(t, Qt, e.memoizedState.cache);
    }
    return Qs(e, t, l);
  }
  function Qd(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Vt = !0;
      else {
        if (!hr(e, l) && (t.flags & 128) === 0)
          return Vt = !1, mx(
            e,
            t,
            l
          );
        Vt = (e.flags & 131072) !== 0;
      }
    else
      Vt = !1, pt && (t.flags & 1048576) !== 0 && bo(t, Kn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            yc(a) ? (e = ql(a, e), t.tag = 1, t = Bd(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = nr(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === oe) {
                t.tag = 11, t = Rd(
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
            throw t = Q(a) || a, Error(d(306, t, ""));
          }
        }
        return t;
      case 0:
        return nr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ql(
          a,
          t.pendingProps
        ), Bd(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (ae(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(d(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Dc(e, t), $a(t, a, null, l);
          var r = t.memoizedState;
          if (a = r.cache, tl(t, Qt, a), a !== i.cache && Oc(
            t,
            [Qt],
            l,
            !0
          ), Ka(), a = r.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: r.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Ld(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = xs(
                Error(d(424)),
                t
              ), Ya(n), t = Ld(
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
              for (Rt = Ss(e.firstChild), ts = t, pt = !0, zl = null, Es = !0, l = _d(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (La(), a === n) {
              t = Qs(
                e,
                t,
                l
              );
              break e;
            }
            $t(
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
        return mi(e, t), e === null ? (l = Kh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : pt || (l = t.type, e = t.pendingProps, a = Oi(
          I.current
        ).createElement(l), a[it] = t, a[vt] = e, Ft(a, l, e), qt(a), t.stateNode = a) : t.memoizedState = Kh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return at(t), e === null && pt && (a = t.stateNode = Zh(
          t.type,
          t.pendingProps,
          I.current
        ), ts = t, Es = !0, n = Rt, jl(t.type) ? (Vr = n, Rt = Ss(
          a.firstChild
        )) : Rt = n), $t(
          e,
          t,
          t.pendingProps.children,
          l
        ), mi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && pt && ((n = a = Rt) && (a = Gx(
          a,
          t.type,
          t.pendingProps,
          Es
        ), a !== null ? (t.stateNode = a, ts = t, Rt = Ss(
          a.firstChild
        ), Es = !1, n = !0) : n = !1), n || Al(t)), at(t), n = t.type, i = t.pendingProps, r = e !== null ? e.memoizedProps : null, a = i.children, Gr(n, i) ? a = null : r !== null && Gr(n, r) && (t.flags |= 32), t.memoizedState !== null && (n = Yc(
          e,
          t,
          ix,
          null,
          null,
          l
        ), pn._currentValue = n), mi(e, t), $t(e, t, a, l), t.child;
      case 6:
        return e === null && pt && ((e = l = Rt) && (l = Xx(
          l,
          t.pendingProps,
          Es
        ), l !== null ? (t.stateNode = l, ts = t, Rt = null, e = !0) : e = !1), e || Al(t)), null;
      case 13:
        return Yd(e, t, l);
      case 4:
        return ae(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ra(
          t,
          null,
          a,
          l
        ) : $t(
          e,
          t,
          a,
          l
        ), t.child;
      case 11:
        return Rd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return $t(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return $t(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return $t(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, tl(t, t.type, a.value), $t(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Ul(t), n = Pt(n), a = a(n), t.flags |= 1, $t(e, t, a, l), t.child;
      case 14:
        return Ud(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Dd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Xd(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = xi(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = qs(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return Md(e, t, l);
      case 24:
        return Ul(t), a = Pt(Qt), e === null ? (n = Ac(), n === null && (n = Ct, i = Tc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Uc(t), tl(t, Qt, n)) : ((e.lanes & l) !== 0 && (Dc(e, t), $a(t, null, null, l), Ka()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), tl(t, Qt, a)) : (a = i.cache, tl(t, Qt, a), a !== n.cache && Oc(
          t,
          [Qt],
          l,
          !0
        ))), $t(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(d(156, t.tag));
  }
  function Zs(e) {
    e.flags |= 4;
  }
  function Zd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Ph(t)) {
      if (t = gs.current, t !== null && ((mt & 4194048) === mt ? Os !== null : (mt & 62914560) !== mt && (mt & 536870912) === 0 || t !== Os))
        throw Va = Rc, Eo;
      e.flags |= 8192;
    }
  }
  function ji(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? M() : 536870912, e.lanes |= t, ha |= t);
  }
  function sn(e, t) {
    if (!pt)
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
  function zt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function xx(e, t, l) {
    var a = t.pendingProps;
    switch (wc(t), t.tag) {
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
        return zt(t), null;
      case 1:
        return zt(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ys(Qt), Oe(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ba(t) ? Zs(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, No())), zt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Zs(t), l !== null ? (zt(t), Zd(t, l)) : (zt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Zs(t), zt(t), Zd(t, l)) : (zt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Zs(t), zt(t), t.flags &= -16777217), null;
      case 27:
        Fe(t), l = I.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(d(166));
            return zt(t), null;
          }
          e = ie.current, Ba(t) ? yo(t) : (e = Zh(n, a, l), t.stateNode = e, Zs(t));
        }
        return zt(t), null;
      case 5:
        if (Fe(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(d(166));
            return zt(t), null;
          }
          if (e = ie.current, Ba(t))
            yo(t);
          else {
            switch (n = Oi(
              I.current
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
            e[it] = t, e[vt] = a;
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
            e: switch (Ft(e, l, a), l) {
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
            e && Zs(t);
          }
        }
        return zt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(d(166));
          if (e = I.current, Ba(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = ts, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[it] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Hh(e.nodeValue, l)), e || Al(t);
          } else
            e = Oi(e).createTextNode(
              a
            ), e[it] = t, t.stateNode = e;
        }
        return zt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ba(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(d(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(d(317));
              n[it] = t;
            } else
              La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            zt(t), n = !1;
          } else
            n = No(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Xs(t), t) : (Xs(t), null);
        }
        if (Xs(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), ji(t, t.updateQueue), zt(t), null;
      case 4:
        return Oe(), e === null && qr(t.stateNode.containerInfo), zt(t), null;
      case 10:
        return Ys(t.type), zt(t), null;
      case 19:
        if (F(Zt), n = t.memoizedState, n === null) return zt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) sn(n, !1);
          else {
            if (Ut !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = di(e), i !== null) {
                  for (t.flags |= 128, sn(n, !1), e = i.updateQueue, t.updateQueue = e, ji(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    go(l, e), l = l.sibling;
                  return ee(
                    Zt,
                    Zt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && qe() > gi && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = di(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, ji(t, e), sn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !pt)
                return zt(t), null;
            } else
              2 * qe() - n.renderingStartTime > gi && l !== 536870912 && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = qe(), t.sibling = null, e = Zt.current, ee(Zt, a ? e & 1 | 2 : e & 1), t) : (zt(t), null);
      case 22:
      case 23:
        return Xs(t), Bc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (zt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : zt(t), l = t.updateQueue, l !== null && ji(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && F(Dl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ys(Qt), zt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(d(156, t.tag));
  }
  function jx(e, t) {
    switch (wc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ys(Qt), Oe(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Fe(t), null;
      case 13:
        if (Xs(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(d(340));
          La();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return F(Zt), null;
      case 4:
        return Oe(), null;
      case 10:
        return Ys(t.type), null;
      case 22:
      case 23:
        return Xs(t), Bc(), e !== null && F(Dl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ys(Qt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Vd(e, t) {
    switch (wc(t), t.tag) {
      case 3:
        Ys(Qt), Oe();
        break;
      case 26:
      case 27:
      case 5:
        Fe(t);
        break;
      case 4:
        Oe();
        break;
      case 13:
        Xs(t);
        break;
      case 19:
        F(Zt);
        break;
      case 10:
        Ys(t.type);
        break;
      case 22:
      case 23:
        Xs(t), Bc(), e !== null && F(Dl);
        break;
      case 24:
        Ys(Qt);
    }
  }
  function ln(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var i = l.create, r = l.inst;
            a = i(), r.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (h) {
      wt(t, t.return, h);
    }
  }
  function rl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        a = i;
        do {
          if ((a.tag & e) === e) {
            var r = a.inst, h = r.destroy;
            if (h !== void 0) {
              r.destroy = void 0, n = t;
              var p = l, z = h;
              try {
                z();
              } catch (V) {
                wt(
                  n,
                  p,
                  V
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (V) {
      wt(t, t.return, V);
    }
  }
  function Jd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Uo(t, l);
      } catch (a) {
        wt(e, e.return, a);
      }
    }
  }
  function Kd(e, t, l) {
    l.props = ql(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      wt(e, t, a);
    }
  }
  function an(e, t) {
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
      wt(e, t, n);
    }
  }
  function Ts(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          wt(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          wt(e, t, n);
        }
      else l.current = null;
  }
  function $d(e) {
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
      wt(e, e.return, n);
    }
  }
  function fr(e, t, l) {
    try {
      var a = e.stateNode;
      qx(a, e.type, l, t), a[vt] = t;
    } catch (n) {
      wt(e, e.return, n);
    }
  }
  function Wd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && jl(e.type) || e.tag === 4;
  }
  function mr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Wd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && jl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xr(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Ei));
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (xr(e, t, l), e = e.sibling; e !== null; )
        xr(e, t, l), e = e.sibling;
  }
  function vi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (vi(e, t, l), e = e.sibling; e !== null; )
        vi(e, t, l), e = e.sibling;
  }
  function Fd(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Ft(t, a, l), t[it] = e, t[vt] = l;
    } catch (i) {
      wt(e, e.return, i);
    }
  }
  var Vs = !1, Bt = !1, jr = !1, Id = typeof WeakSet == "function" ? WeakSet : Set, Jt = null;
  function vx(e, t) {
    if (e = e.containerInfo, Lr = Di, e = ro(e), mc(e)) {
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
            var r = 0, h = -1, p = -1, z = 0, V = 0, P = e, U = null;
            t: for (; ; ) {
              for (var B; P !== l || n !== 0 && P.nodeType !== 3 || (h = r + n), P !== i || a !== 0 && P.nodeType !== 3 || (p = r + a), P.nodeType === 3 && (r += P.nodeValue.length), (B = P.firstChild) !== null; )
                U = P, P = B;
              for (; ; ) {
                if (P === e) break t;
                if (U === l && ++z === n && (h = r), U === i && ++V === a && (p = r), (B = P.nextSibling) !== null) break;
                P = U, U = P.parentNode;
              }
              P = B;
            }
            l = h === -1 || p === -1 ? null : { start: h, end: p };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Yr = { focusedElem: e, selectionRange: l }, Di = !1, Jt = t; Jt !== null; )
      if (t = Jt, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, Jt = e;
      else
        for (; Jt !== null; ) {
          switch (t = Jt, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var et = ql(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    et,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Ke) {
                  wt(
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
                  Qr(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Qr(e);
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
              if ((e & 1024) !== 0) throw Error(d(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Jt = e;
            break;
          }
          Jt = t.return;
        }
  }
  function Pd(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ul(e, l), a & 4 && ln(5, l);
        break;
      case 1:
        if (ul(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (r) {
              wt(l, l.return, r);
            }
          else {
            var n = ql(
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
            } catch (r) {
              wt(
                l,
                l.return,
                r
              );
            }
          }
        a & 64 && Jd(l), a & 512 && an(l, l.return);
        break;
      case 3:
        if (ul(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
          } catch (r) {
            wt(l, l.return, r);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Fd(l);
      case 26:
      case 5:
        ul(e, l), t === null && a & 4 && $d(l), a & 512 && an(l, l.return);
        break;
      case 12:
        ul(e, l);
        break;
      case 13:
        ul(e, l), a & 4 && sh(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = kx.bind(
          null,
          l
        ), Qx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Vs, !a) {
          t = t !== null && t.memoizedState !== null || Bt, n = Vs;
          var i = Bt;
          Vs = a, (Bt = t) && !i ? ol(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : ul(e, l), Vs = n, Bt = i;
        }
        break;
      case 30:
        break;
      default:
        ul(e, l);
    }
  }
  function eh(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, eh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ee(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Et = null, as = !1;
  function Js(e, t, l) {
    for (l = l.child; l !== null; )
      th(e, t, l), l = l.sibling;
  }
  function th(e, t, l) {
    if (ke && typeof ke.onCommitFiberUnmount == "function")
      try {
        ke.onCommitFiberUnmount(K, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Bt || Ts(l, t), Js(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Bt || Ts(l, t);
        var a = Et, n = as;
        jl(l.type) && (Et = l.stateNode, as = !1), Js(
          e,
          t,
          l
        ), mn(l.stateNode), Et = a, as = n;
        break;
      case 5:
        Bt || Ts(l, t);
      case 6:
        if (a = Et, n = as, Et = null, Js(
          e,
          t,
          l
        ), Et = a, as = n, Et !== null)
          if (as)
            try {
              (Et.nodeType === 9 ? Et.body : Et.nodeName === "HTML" ? Et.ownerDocument.body : Et).removeChild(l.stateNode);
            } catch (i) {
              wt(
                l,
                t,
                i
              );
            }
          else
            try {
              Et.removeChild(l.stateNode);
            } catch (i) {
              wt(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Et !== null && (as ? (e = Et, Xh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), _n(e)) : Xh(Et, l.stateNode));
        break;
      case 4:
        a = Et, n = as, Et = l.stateNode.containerInfo, as = !0, Js(
          e,
          t,
          l
        ), Et = a, as = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Bt || rl(2, l, t), Bt || rl(4, l, t), Js(
          e,
          t,
          l
        );
        break;
      case 1:
        Bt || (Ts(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Kd(
          l,
          t,
          a
        )), Js(
          e,
          t,
          l
        );
        break;
      case 21:
        Js(
          e,
          t,
          l
        );
        break;
      case 22:
        Bt = (a = Bt) || l.memoizedState !== null, Js(
          e,
          t,
          l
        ), Bt = a;
        break;
      default:
        Js(
          e,
          t,
          l
        );
    }
  }
  function sh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        _n(e);
      } catch (l) {
        wt(t, t.return, l);
      }
  }
  function px(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Id()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Id()), t;
      default:
        throw Error(d(435, e.tag));
    }
  }
  function vr(e, t) {
    var l = px(e);
    t.forEach(function(a) {
      var n = Cx.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function rs(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, r = t, h = r;
        e: for (; h !== null; ) {
          switch (h.tag) {
            case 27:
              if (jl(h.type)) {
                Et = h.stateNode, as = !1;
                break e;
              }
              break;
            case 5:
              Et = h.stateNode, as = !1;
              break e;
            case 3:
            case 4:
              Et = h.stateNode.containerInfo, as = !0;
              break e;
          }
          h = h.return;
        }
        if (Et === null) throw Error(d(160));
        th(i, r, n), Et = null, as = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        lh(t, e), t = t.sibling;
  }
  var Ns = null;
  function lh(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        rs(t, e), us(e), a & 4 && (rl(3, e, e.return), ln(3, e), rl(5, e, e.return));
        break;
      case 1:
        rs(t, e), us(e), a & 512 && (Bt || l === null || Ts(l, l.return)), a & 64 && Vs && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Ns;
        if (rs(t, e), us(e), a & 512 && (Bt || l === null || Ts(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[Ce] || i[it] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), Ft(i, a, l), i[it] = e, qt(i), a = i;
                      break e;
                    case "link":
                      var r = Fh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (r) {
                        for (var h = 0; h < r.length; h++)
                          if (i = r[h], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            r.splice(h, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Ft(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (r = Fh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (h = 0; h < r.length; h++)
                          if (i = r[h], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            r.splice(h, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Ft(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(d(468, a));
                  }
                  i[it] = e, qt(i), a = i;
                }
                e.stateNode = a;
              } else
                Ih(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Wh(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? Ih(
              n,
              e.type,
              e.stateNode
            ) : Wh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && fr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        rs(t, e), us(e), a & 512 && (Bt || l === null || Ts(l, l.return)), l !== null && a & 4 && fr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (rs(t, e), us(e), a & 512 && (Bt || l === null || Ts(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Ql(n, "");
          } catch (B) {
            wt(e, e.return, B);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, fr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (jr = !0);
        break;
      case 6:
        if (rs(t, e), us(e), a & 4) {
          if (e.stateNode === null)
            throw Error(d(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (B) {
            wt(e, e.return, B);
          }
        }
        break;
      case 3:
        if (Ai = null, n = Ns, Ns = Ti(t.containerInfo), rs(t, e), Ns = n, us(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            _n(t.containerInfo);
          } catch (B) {
            wt(e, e.return, B);
          }
        jr && (jr = !1, ah(e));
        break;
      case 4:
        a = Ns, Ns = Ti(
          e.stateNode.containerInfo
        ), rs(t, e), us(e), Ns = a;
        break;
      case 12:
        rs(t, e), us(e);
        break;
      case 13:
        rs(t, e), us(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Nr = qe()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, vr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = l !== null && l.memoizedState !== null, z = Vs, V = Bt;
        if (Vs = z || n, Bt = V || p, rs(t, e), Bt = V, Vs = z, us(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || p || Vs || Bt || Hl(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                p = l = t;
                try {
                  if (i = p.stateNode, n)
                    r = i.style, typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
                  else {
                    h = p.stateNode;
                    var P = p.memoizedProps.style, U = P != null && P.hasOwnProperty("display") ? P.display : null;
                    h.style.display = U == null || typeof U == "boolean" ? "" : ("" + U).trim();
                  }
                } catch (B) {
                  wt(p, p.return, B);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                p = t;
                try {
                  p.stateNode.nodeValue = n ? "" : p.memoizedProps;
                } catch (B) {
                  wt(p, p.return, B);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, vr(e, l))));
        break;
      case 19:
        rs(t, e), us(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, vr(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        rs(t, e), us(e);
    }
  }
  function us(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Wd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(d(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = mr(e);
            vi(e, i, n);
            break;
          case 5:
            var r = l.stateNode;
            l.flags & 32 && (Ql(r, ""), l.flags &= -33);
            var h = mr(e);
            vi(e, h, r);
            break;
          case 3:
          case 4:
            var p = l.stateNode.containerInfo, z = mr(e);
            xr(
              e,
              z,
              p
            );
            break;
          default:
            throw Error(d(161));
        }
      } catch (V) {
        wt(e, e.return, V);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function ah(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        ah(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function ul(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Pd(e, t.alternate, t), t = t.sibling;
  }
  function Hl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          rl(4, t, t.return), Hl(t);
          break;
        case 1:
          Ts(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && Kd(
            t,
            t.return,
            l
          ), Hl(t);
          break;
        case 27:
          mn(t.stateNode);
        case 26:
        case 5:
          Ts(t, t.return), Hl(t);
          break;
        case 22:
          t.memoizedState === null && Hl(t);
          break;
        case 30:
          Hl(t);
          break;
        default:
          Hl(t);
      }
      e = e.sibling;
    }
  }
  function ol(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, r = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ol(
            n,
            i,
            l
          ), ln(4, i);
          break;
        case 1:
          if (ol(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              wt(a, a.return, z);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var h = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Ro(p[n], h);
            } catch (z) {
              wt(a, a.return, z);
            }
          }
          l && r & 64 && Jd(i), an(i, i.return);
          break;
        case 27:
          Fd(i);
        case 26:
        case 5:
          ol(
            n,
            i,
            l
          ), l && a === null && r & 4 && $d(i), an(i, i.return);
          break;
        case 12:
          ol(
            n,
            i,
            l
          );
          break;
        case 13:
          ol(
            n,
            i,
            l
          ), l && r & 4 && sh(n, i);
          break;
        case 22:
          i.memoizedState === null && ol(
            n,
            i,
            l
          ), an(i, i.return);
          break;
        case 30:
          break;
        default:
          ol(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function pr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Xa(l));
  }
  function gr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Xa(e));
  }
  function zs(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        nh(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function nh(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        zs(
          e,
          t,
          l,
          a
        ), n & 2048 && ln(9, t);
        break;
      case 1:
        zs(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        zs(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Xa(e)));
        break;
      case 12:
        if (n & 2048) {
          zs(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, r = i.id, h = i.onPostCommit;
            typeof h == "function" && h(
              r,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (p) {
            wt(t, t.return, p);
          }
        } else
          zs(
            e,
            t,
            l,
            a
          );
        break;
      case 13:
        zs(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, r = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? zs(
          e,
          t,
          l,
          a
        ) : nn(e, t) : i._visibility & 2 ? zs(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, ua(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && pr(r, t);
        break;
      case 24:
        zs(
          e,
          t,
          l,
          a
        ), n & 2048 && gr(t.alternate, t);
        break;
      default:
        zs(
          e,
          t,
          l,
          a
        );
    }
  }
  function ua(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, r = t, h = l, p = a, z = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          ua(
            i,
            r,
            h,
            p,
            n
          ), ln(8, r);
          break;
        case 23:
          break;
        case 22:
          var V = r.stateNode;
          r.memoizedState !== null ? V._visibility & 2 ? ua(
            i,
            r,
            h,
            p,
            n
          ) : nn(
            i,
            r
          ) : (V._visibility |= 2, ua(
            i,
            r,
            h,
            p,
            n
          )), n && z & 2048 && pr(
            r.alternate,
            r
          );
          break;
        case 24:
          ua(
            i,
            r,
            h,
            p,
            n
          ), n && z & 2048 && gr(r.alternate, r);
          break;
        default:
          ua(
            i,
            r,
            h,
            p,
            n
          );
      }
      t = t.sibling;
    }
  }
  function nn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            nn(l, a), n & 2048 && pr(
              a.alternate,
              a
            );
            break;
          case 24:
            nn(l, a), n & 2048 && gr(a.alternate, a);
            break;
          default:
            nn(l, a);
        }
        t = t.sibling;
      }
  }
  var cn = 8192;
  function oa(e) {
    if (e.subtreeFlags & cn)
      for (e = e.child; e !== null; )
        ih(e), e = e.sibling;
  }
  function ih(e) {
    switch (e.tag) {
      case 26:
        oa(e), e.flags & cn && e.memoizedState !== null && lj(
          Ns,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        oa(e);
        break;
      case 3:
      case 4:
        var t = Ns;
        Ns = Ti(e.stateNode.containerInfo), oa(e), Ns = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = cn, cn = 16777216, oa(e), cn = t) : oa(e));
        break;
      default:
        oa(e);
    }
  }
  function ch(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function rn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Jt = a, uh(
            a,
            e
          );
        }
      ch(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        rh(e), e = e.sibling;
  }
  function rh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        rn(e), e.flags & 2048 && rl(9, e, e.return);
        break;
      case 3:
        rn(e);
        break;
      case 12:
        rn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, pi(e)) : rn(e);
        break;
      default:
        rn(e);
    }
  }
  function pi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Jt = a, uh(
            a,
            e
          );
        }
      ch(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          rl(8, t, t.return), pi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, pi(t));
          break;
        default:
          pi(t);
      }
      e = e.sibling;
    }
  }
  function uh(e, t) {
    for (; Jt !== null; ) {
      var l = Jt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          rl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Xa(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Jt = a;
      else
        e: for (l = e; Jt !== null; ) {
          a = Jt;
          var n = a.sibling, i = a.return;
          if (eh(a), a === l) {
            Jt = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Jt = n;
            break e;
          }
          Jt = i;
        }
    }
  }
  var gx = {
    getCacheForType: function(e) {
      var t = Pt(Qt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, bx = typeof WeakMap == "function" ? WeakMap : Map, bt = 0, Ct = null, ht = null, mt = 0, yt = 0, os = null, dl = !1, da = !1, br = !1, Ks = 0, Ut = 0, hl = 0, Bl = 0, yr = 0, bs = 0, ha = 0, un = null, ns = null, _r = !1, Nr = 0, gi = 1 / 0, bi = null, fl = null, Wt = 0, ml = null, fa = null, ma = 0, Sr = 0, wr = null, oh = null, on = 0, kr = null;
  function ds() {
    if ((bt & 2) !== 0 && mt !== 0)
      return mt & -mt;
    if (g.T !== null) {
      var e = ta;
      return e !== 0 ? e : Rr();
    }
    return kt();
  }
  function dh() {
    bs === 0 && (bs = (mt & 536870912) === 0 || pt ? xt() : 536870912);
    var e = gs.current;
    return e !== null && (e.flags |= 32), bs;
  }
  function hs(e, t, l) {
    (e === Ct && (yt === 2 || yt === 9) || e.cancelPendingCommit !== null) && (xa(e, 0), xl(
      e,
      mt,
      bs,
      !1
    )), ce(e, l), ((bt & 2) === 0 || e !== Ct) && (e === Ct && ((bt & 2) === 0 && (Bl |= l), Ut === 4 && xl(
      e,
      mt,
      bs,
      !1
    )), As(e));
  }
  function hh(e, t, l) {
    if ((bt & 6) !== 0) throw Error(d(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || pe(e, t), n = a ? Nx(e, t) : Or(e, t, !0), i = a;
    do {
      if (n === 0) {
        da && !a && xl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !yx(l)) {
          n = Or(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var r = 0;
          else
            r = e.pendingLanes & -536870913, r = r !== 0 ? r : r & 536870912 ? 536870912 : 0;
          if (r !== 0) {
            t = r;
            e: {
              var h = e;
              n = un;
              var p = h.current.memoizedState.isDehydrated;
              if (p && (xa(h, r).flags |= 256), r = Or(
                h,
                r,
                !1
              ), r !== 2) {
                if (br && !p) {
                  h.errorRecoveryDisabledLanes |= i, Bl |= i, n = 4;
                  break e;
                }
                i = ns, ns = n, i !== null && (ns === null ? ns = i : ns.push.apply(
                  ns,
                  i
                ));
              }
              n = r;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          xa(e, 0), xl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, i = n, i) {
            case 0:
            case 1:
              throw Error(d(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              xl(
                a,
                t,
                bs,
                !dl
              );
              break e;
            case 2:
              ns = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(d(329));
          }
          if ((t & 62914560) === t && (n = Nr + 300 - qe(), 10 < n)) {
            if (xl(
              a,
              t,
              bs,
              !dl
            ), be(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Yh(
              fh.bind(
                null,
                a,
                l,
                ns,
                bi,
                _r,
                t,
                bs,
                Bl,
                ha,
                dl,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          fh(
            a,
            l,
            ns,
            bi,
            _r,
            t,
            bs,
            Bl,
            ha,
            dl,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    As(e);
  }
  function fh(e, t, l, a, n, i, r, h, p, z, V, P, U, B) {
    if (e.timeoutHandle = -1, P = t.subtreeFlags, (P & 8192 || (P & 16785408) === 16785408) && (vn = { stylesheets: null, count: 0, unsuspend: sj }, ih(t), P = aj(), P !== null)) {
      e.cancelPendingCommit = P(
        bh.bind(
          null,
          e,
          t,
          i,
          l,
          a,
          n,
          r,
          h,
          p,
          V,
          1,
          U,
          B
        )
      ), xl(e, i, r, !z);
      return;
    }
    bh(
      e,
      t,
      i,
      l,
      a,
      n,
      r,
      h,
      p
    );
  }
  function yx(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!is(i(), n)) return !1;
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
  function xl(e, t, l, a) {
    t &= ~yr, t &= ~Bl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - st(n), r = 1 << i;
      a[i] = -1, n &= ~r;
    }
    l !== 0 && nt(e, l, t);
  }
  function yi() {
    return (bt & 6) === 0 ? (dn(0), !1) : !0;
  }
  function Cr() {
    if (ht !== null) {
      if (yt === 0)
        var e = ht.return;
      else
        e = ht, Ls = Rl = null, Qc(e), ca = null, en = 0, e = ht;
      for (; e !== null; )
        Vd(e.alternate, e), e = e.return;
      ht = null;
    }
  }
  function xa(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Bx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Cr(), Ct = e, ht = l = qs(e.current, null), mt = t, yt = 0, os = null, dl = !1, da = pe(e, t), br = !1, ha = bs = yr = Bl = hl = Ut = 0, ns = un = null, _r = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - st(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return Ks = t, Xn(), l;
  }
  function mh(e, t) {
    ot = null, g.H = ri, t === Za || t === In ? (t = zo(), yt = 3) : t === Eo ? (t = zo(), yt = 4) : yt = t === Ad ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, os = t, ht === null && (Ut = 1, fi(
      e,
      xs(t, e.current)
    ));
  }
  function xh() {
    var e = g.H;
    return g.H = ri, e === null ? ri : e;
  }
  function jh() {
    var e = g.A;
    return g.A = gx, e;
  }
  function Er() {
    Ut = 4, dl || (mt & 4194048) !== mt && gs.current !== null || (da = !0), (hl & 134217727) === 0 && (Bl & 134217727) === 0 || Ct === null || xl(
      Ct,
      mt,
      bs,
      !1
    );
  }
  function Or(e, t, l) {
    var a = bt;
    bt |= 2;
    var n = xh(), i = jh();
    (Ct !== e || mt !== t) && (bi = null, xa(e, t)), t = !1;
    var r = Ut;
    e: do
      try {
        if (yt !== 0 && ht !== null) {
          var h = ht, p = os;
          switch (yt) {
            case 8:
              Cr(), r = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              gs.current === null && (t = !0);
              var z = yt;
              if (yt = 0, os = null, ja(e, h, p, z), l && da) {
                r = 0;
                break e;
              }
              break;
            default:
              z = yt, yt = 0, os = null, ja(e, h, p, z);
          }
        }
        _x(), r = Ut;
        break;
      } catch (V) {
        mh(e, V);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ls = Rl = null, bt = a, g.H = n, g.A = i, ht === null && (Ct = null, mt = 0, Xn()), r;
  }
  function _x() {
    for (; ht !== null; ) vh(ht);
  }
  function Nx(e, t) {
    var l = bt;
    bt |= 2;
    var a = xh(), n = jh();
    Ct !== e || mt !== t ? (bi = null, gi = qe() + 500, xa(e, t)) : da = pe(
      e,
      t
    );
    e: do
      try {
        if (yt !== 0 && ht !== null) {
          t = ht;
          var i = os;
          t: switch (yt) {
            case 1:
              yt = 0, os = null, ja(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (Oo(i)) {
                yt = 0, os = null, ph(t);
                break;
              }
              t = function() {
                yt !== 2 && yt !== 9 || Ct !== e || (yt = 7), As(e);
              }, i.then(t, t);
              break e;
            case 3:
              yt = 7;
              break e;
            case 4:
              yt = 5;
              break e;
            case 7:
              Oo(i) ? (yt = 0, os = null, ph(t)) : (yt = 0, os = null, ja(e, t, i, 7));
              break;
            case 5:
              var r = null;
              switch (ht.tag) {
                case 26:
                  r = ht.memoizedState;
                case 5:
                case 27:
                  var h = ht;
                  if (!r || Ph(r)) {
                    yt = 0, os = null;
                    var p = h.sibling;
                    if (p !== null) ht = p;
                    else {
                      var z = h.return;
                      z !== null ? (ht = z, _i(z)) : ht = null;
                    }
                    break t;
                  }
              }
              yt = 0, os = null, ja(e, t, i, 5);
              break;
            case 6:
              yt = 0, os = null, ja(e, t, i, 6);
              break;
            case 8:
              Cr(), Ut = 6;
              break e;
            default:
              throw Error(d(462));
          }
        }
        Sx();
        break;
      } catch (V) {
        mh(e, V);
      }
    while (!0);
    return Ls = Rl = null, g.H = a, g.A = n, bt = l, ht !== null ? 0 : (Ct = null, mt = 0, Xn(), Ut);
  }
  function Sx() {
    for (; ht !== null && !ye(); )
      vh(ht);
  }
  function vh(e) {
    var t = Qd(e.alternate, e, Ks);
    e.memoizedProps = e.pendingProps, t === null ? _i(e) : ht = t;
  }
  function ph(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Hd(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          mt
        );
        break;
      case 11:
        t = Hd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          mt
        );
        break;
      case 5:
        Qc(t);
      default:
        Vd(l, t), t = ht = go(t, Ks), t = Qd(l, t, Ks);
    }
    e.memoizedProps = e.pendingProps, t === null ? _i(e) : ht = t;
  }
  function ja(e, t, l, a) {
    Ls = Rl = null, Qc(t), ca = null, en = 0;
    var n = t.return;
    try {
      if (fx(
        e,
        n,
        t,
        l,
        mt
      )) {
        Ut = 1, fi(
          e,
          xs(l, e.current)
        ), ht = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw ht = n, i;
      Ut = 1, fi(
        e,
        xs(l, e.current)
      ), ht = null;
      return;
    }
    t.flags & 32768 ? (pt || a === 1 ? e = !0 : da || (mt & 536870912) !== 0 ? e = !1 : (dl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = gs.current, a !== null && a.tag === 13 && (a.flags |= 16384))), gh(t, e)) : _i(t);
  }
  function _i(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        gh(
          t,
          dl
        );
        return;
      }
      e = t.return;
      var l = xx(
        t.alternate,
        t,
        Ks
      );
      if (l !== null) {
        ht = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ht = t;
        return;
      }
      ht = t = e;
    } while (t !== null);
    Ut === 0 && (Ut = 5);
  }
  function gh(e, t) {
    do {
      var l = jx(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ht = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ht = e;
        return;
      }
      ht = e = l;
    } while (e !== null);
    Ut = 6, ht = null;
  }
  function bh(e, t, l, a, n, i, r, h, p) {
    e.cancelPendingCommit = null;
    do
      Ni();
    while (Wt !== 0);
    if ((bt & 6) !== 0) throw Error(d(327));
    if (t !== null) {
      if (t === e.current) throw Error(d(177));
      if (i = t.lanes | t.childLanes, i |= gc, ge(
        e,
        l,
        i,
        r,
        h,
        p
      ), e === Ct && (ht = Ct = null, mt = 0), fa = t, ml = e, ma = l, Sr = i, wr = n, oh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Ex(je, function() {
        return wh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = g.T, g.T = null, n = X.p, X.p = 2, r = bt, bt |= 4;
        try {
          vx(e, t, l);
        } finally {
          bt = r, X.p = n, g.T = a;
        }
      }
      Wt = 1, yh(), _h(), Nh();
    }
  }
  function yh() {
    if (Wt === 1) {
      Wt = 0;
      var e = ml, t = fa, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = g.T, g.T = null;
        var a = X.p;
        X.p = 2;
        var n = bt;
        bt |= 4;
        try {
          lh(t, e);
          var i = Yr, r = ro(e.containerInfo), h = i.focusedElem, p = i.selectionRange;
          if (r !== h && h && h.ownerDocument && co(
            h.ownerDocument.documentElement,
            h
          )) {
            if (p !== null && mc(h)) {
              var z = p.start, V = p.end;
              if (V === void 0 && (V = z), "selectionStart" in h)
                h.selectionStart = z, h.selectionEnd = Math.min(
                  V,
                  h.value.length
                );
              else {
                var P = h.ownerDocument || document, U = P && P.defaultView || window;
                if (U.getSelection) {
                  var B = U.getSelection(), et = h.textContent.length, Ke = Math.min(p.start, et), St = p.end === void 0 ? Ke : Math.min(p.end, et);
                  !B.extend && Ke > St && (r = St, St = Ke, Ke = r);
                  var C = io(
                    h,
                    Ke
                  ), N = io(
                    h,
                    St
                  );
                  if (C && N && (B.rangeCount !== 1 || B.anchorNode !== C.node || B.anchorOffset !== C.offset || B.focusNode !== N.node || B.focusOffset !== N.offset)) {
                    var O = P.createRange();
                    O.setStart(C.node, C.offset), B.removeAllRanges(), Ke > St ? (B.addRange(O), B.extend(N.node, N.offset)) : (O.setEnd(N.node, N.offset), B.addRange(O));
                  }
                }
              }
            }
            for (P = [], B = h; B = B.parentNode; )
              B.nodeType === 1 && P.push({
                element: B,
                left: B.scrollLeft,
                top: B.scrollTop
              });
            for (typeof h.focus == "function" && h.focus(), h = 0; h < P.length; h++) {
              var $ = P[h];
              $.element.scrollLeft = $.left, $.element.scrollTop = $.top;
            }
          }
          Di = !!Lr, Yr = Lr = null;
        } finally {
          bt = n, X.p = a, g.T = l;
        }
      }
      e.current = t, Wt = 2;
    }
  }
  function _h() {
    if (Wt === 2) {
      Wt = 0;
      var e = ml, t = fa, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = g.T, g.T = null;
        var a = X.p;
        X.p = 2;
        var n = bt;
        bt |= 4;
        try {
          Pd(e, t.alternate, t);
        } finally {
          bt = n, X.p = a, g.T = l;
        }
      }
      Wt = 3;
    }
  }
  function Nh() {
    if (Wt === 4 || Wt === 3) {
      Wt = 0, _e();
      var e = ml, t = fa, l = ma, a = oh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Wt = 5 : (Wt = 0, fa = ml = null, Sh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (fl = null), Qe(l), t = t.stateNode, ke && typeof ke.onCommitFiberRoot == "function")
        try {
          ke.onCommitFiberRoot(
            K,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = g.T, n = X.p, X.p = 2, g.T = null;
        try {
          for (var i = e.onRecoverableError, r = 0; r < a.length; r++) {
            var h = a[r];
            i(h.value, {
              componentStack: h.stack
            });
          }
        } finally {
          g.T = t, X.p = n;
        }
      }
      (ma & 3) !== 0 && Ni(), As(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === kr ? on++ : (on = 0, kr = e) : on = 0, dn(0);
    }
  }
  function Sh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Xa(t)));
  }
  function Ni(e) {
    return yh(), _h(), Nh(), wh();
  }
  function wh() {
    if (Wt !== 5) return !1;
    var e = ml, t = Sr;
    Sr = 0;
    var l = Qe(ma), a = g.T, n = X.p;
    try {
      X.p = 32 > l ? 32 : l, g.T = null, l = wr, wr = null;
      var i = ml, r = ma;
      if (Wt = 0, fa = ml = null, ma = 0, (bt & 6) !== 0) throw Error(d(331));
      var h = bt;
      if (bt |= 4, rh(i.current), nh(
        i,
        i.current,
        r,
        l
      ), bt = h, dn(0, !1), ke && typeof ke.onPostCommitFiberRoot == "function")
        try {
          ke.onPostCommitFiberRoot(K, i);
        } catch {
        }
      return !0;
    } finally {
      X.p = n, g.T = a, Sh(e, t);
    }
  }
  function kh(e, t, l) {
    t = xs(l, t), t = ar(e.stateNode, t, 2), e = al(e, t, 2), e !== null && (ce(e, 2), As(e));
  }
  function wt(e, t, l) {
    if (e.tag === 3)
      kh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          kh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (fl === null || !fl.has(a))) {
            e = xs(l, e), l = Td(2), a = al(t, l, 2), a !== null && (zd(
              l,
              a,
              t,
              e
            ), ce(a, 2), As(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Tr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new bx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (br = !0, n.add(l), e = wx.bind(null, e, t, l), t.then(e, e));
  }
  function wx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Ct === e && (mt & l) === l && (Ut === 4 || Ut === 3 && (mt & 62914560) === mt && 300 > qe() - Nr ? (bt & 2) === 0 && xa(e, 0) : yr |= l, ha === mt && (ha = 0)), As(e);
  }
  function Ch(e, t) {
    t === 0 && (t = M()), e = Fl(e, t), e !== null && (ce(e, t), As(e));
  }
  function kx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Ch(e, l);
  }
  function Cx(e, t) {
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
        throw Error(d(314));
    }
    a !== null && a.delete(t), Ch(e, l);
  }
  function Ex(e, t) {
    return Xe(e, t);
  }
  var Si = null, va = null, zr = !1, wi = !1, Ar = !1, Ll = 0;
  function As(e) {
    e !== va && e.next === null && (va === null ? Si = va = e : va = va.next = e), wi = !0, zr || (zr = !0, Tx());
  }
  function dn(e, t) {
    if (!Ar && wi) {
      Ar = !0;
      do
        for (var l = !1, a = Si; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var r = a.suspendedLanes, h = a.pingedLanes;
              i = (1 << 31 - st(42 | e) + 1) - 1, i &= n & ~(r & ~h), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, zh(a, i));
          } else
            i = mt, i = be(
              a,
              a === Ct ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || pe(a, i) || (l = !0, zh(a, i));
          a = a.next;
        }
      while (l);
      Ar = !1;
    }
  }
  function Ox() {
    Eh();
  }
  function Eh() {
    wi = zr = !1;
    var e = 0;
    Ll !== 0 && (Hx() && (e = Ll), Ll = 0);
    for (var t = qe(), l = null, a = Si; a !== null; ) {
      var n = a.next, i = Oh(a, t);
      i === 0 ? (a.next = null, l === null ? Si = n : l.next = n, n === null && (va = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (wi = !0)), a = n;
    }
    dn(e);
  }
  function Oh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var r = 31 - st(i), h = 1 << r, p = n[r];
      p === -1 ? ((h & l) === 0 || (h & a) !== 0) && (n[r] = Ye(h, t)) : p <= t && (e.expiredLanes |= h), i &= ~h;
    }
    if (t = Ct, l = mt, l = be(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (yt === 2 || yt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Me(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || pe(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Me(a), Qe(l)) {
        case 2:
        case 8:
          l = rt;
          break;
        case 32:
          l = je;
          break;
        case 268435456:
          l = Re;
          break;
        default:
          l = je;
      }
      return a = Th.bind(null, e), l = Xe(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Me(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Th(e, t) {
    if (Wt !== 0 && Wt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ni() && e.callbackNode !== l)
      return null;
    var a = mt;
    return a = be(
      e,
      e === Ct ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (hh(e, a, t), Oh(e, qe()), e.callbackNode != null && e.callbackNode === l ? Th.bind(null, e) : null);
  }
  function zh(e, t) {
    if (Ni()) return null;
    hh(e, t, !0);
  }
  function Tx() {
    Lx(function() {
      (bt & 6) !== 0 ? Xe(
        $e,
        Ox
      ) : Eh();
    });
  }
  function Rr() {
    return Ll === 0 && (Ll = xt()), Ll;
  }
  function Ah(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Mn("" + e);
  }
  function Rh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function zx(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Ah(
        (n[vt] || null).action
      ), r = a.submitter;
      r && (t = (t = r[vt] || null) ? Ah(t.formAction) : r.getAttribute("formAction"), t !== null && (i = t, r = null));
      var h = new Ln(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: h,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ll !== 0) {
                  var p = r ? Rh(n, r) : new FormData(n);
                  Pc(
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
                typeof i == "function" && (h.preventDefault(), p = r ? Rh(n, r) : new FormData(n), Pc(
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
  for (var Ur = 0; Ur < pc.length; Ur++) {
    var Dr = pc[Ur], Ax = Dr.toLowerCase(), Rx = Dr[0].toUpperCase() + Dr.slice(1);
    _s(
      Ax,
      "on" + Rx
    );
  }
  _s(ho, "onAnimationEnd"), _s(fo, "onAnimationIteration"), _s(mo, "onAnimationStart"), _s("dblclick", "onDoubleClick"), _s("focusin", "onFocus"), _s("focusout", "onBlur"), _s(Wm, "onTransitionRun"), _s(Fm, "onTransitionStart"), _s(Im, "onTransitionCancel"), _s(xo, "onTransitionEnd"), Ps("onMouseEnter", ["mouseout", "mouseover"]), Ps("onMouseLeave", ["mouseout", "mouseover"]), Ps("onPointerEnter", ["pointerout", "pointerover"]), Ps("onPointerLeave", ["pointerout", "pointerover"]), It(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), It(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), It("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), It(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), It(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), It(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var hn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Ux = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hn)
  );
  function Uh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var r = a.length - 1; 0 <= r; r--) {
            var h = a[r], p = h.instance, z = h.currentTarget;
            if (h = h.listener, p !== i && n.isPropagationStopped())
              break e;
            i = h, n.currentTarget = z;
            try {
              i(n);
            } catch (V) {
              hi(V);
            }
            n.currentTarget = null, i = p;
          }
        else
          for (r = 0; r < a.length; r++) {
            if (h = a[r], p = h.instance, z = h.currentTarget, h = h.listener, p !== i && n.isPropagationStopped())
              break e;
            i = h, n.currentTarget = z;
            try {
              i(n);
            } catch (V) {
              hi(V);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function ft(e, t) {
    var l = t[S];
    l === void 0 && (l = t[S] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Dh(t, e, 2, !1), l.add(a));
  }
  function Mr(e, t, l) {
    var a = 0;
    t && (a |= 4), Dh(
      l,
      e,
      a,
      t
    );
  }
  var ki = "_reactListening" + Math.random().toString(36).slice(2);
  function qr(e) {
    if (!e[ki]) {
      e[ki] = !0, Ea.forEach(function(l) {
        l !== "selectionchange" && (Ux.has(l) || Mr(l, !1, e), Mr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ki] || (t[ki] = !0, Mr("selectionchange", !1, t));
    }
  }
  function Dh(e, t, l, a) {
    switch (nf(t)) {
      case 2:
        var n = cj;
        break;
      case 8:
        n = rj;
        break;
      default:
        n = Fr;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !nc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Hr(e, t, l, a, n) {
    var i = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var r = a.tag;
        if (r === 3 || r === 4) {
          var h = a.stateNode.containerInfo;
          if (h === n) break;
          if (r === 4)
            for (r = a.return; r !== null; ) {
              var p = r.tag;
              if ((p === 3 || p === 4) && r.stateNode.containerInfo === n)
                return;
              r = r.return;
            }
          for (; h !== null; ) {
            if (r = Ze(h), r === null) return;
            if (p = r.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              a = i = r;
              continue e;
            }
            h = h.parentNode;
          }
        }
        a = a.return;
      }
    Yu(function() {
      var z = i, V = lc(l), P = [];
      e: {
        var U = jo.get(e);
        if (U !== void 0) {
          var B = Ln, et = e;
          switch (e) {
            case "keypress":
              if (Hn(l) === 0) break e;
            case "keydown":
            case "keyup":
              B = Em;
              break;
            case "focusin":
              et = "focus", B = uc;
              break;
            case "focusout":
              et = "blur", B = uc;
              break;
            case "beforeblur":
            case "afterblur":
              B = uc;
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
              B = Qu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              B = jm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              B = zm;
              break;
            case ho:
            case fo:
            case mo:
              B = gm;
              break;
            case xo:
              B = Rm;
              break;
            case "scroll":
            case "scrollend":
              B = mm;
              break;
            case "wheel":
              B = Dm;
              break;
            case "copy":
            case "cut":
            case "paste":
              B = ym;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              B = Vu;
              break;
            case "toggle":
            case "beforetoggle":
              B = qm;
          }
          var Ke = (t & 4) !== 0, St = !Ke && (e === "scroll" || e === "scrollend"), C = Ke ? U !== null ? U + "Capture" : null : U;
          Ke = [];
          for (var N = z, O; N !== null; ) {
            var $ = N;
            if (O = $.stateNode, $ = $.tag, $ !== 5 && $ !== 26 && $ !== 27 || O === null || C === null || ($ = Ta(N, C), $ != null && Ke.push(
              fn(N, $, O)
            )), St) break;
            N = N.return;
          }
          0 < Ke.length && (U = new B(
            U,
            et,
            null,
            l,
            V
          ), P.push({ event: U, listeners: Ke }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (U = e === "mouseover" || e === "pointerover", B = e === "mouseout" || e === "pointerout", U && l !== sc && (et = l.relatedTarget || l.fromElement) && (Ze(et) || et[c]))
            break e;
          if ((B || U) && (U = V.window === V ? V : (U = V.ownerDocument) ? U.defaultView || U.parentWindow : window, B ? (et = l.relatedTarget || l.toElement, B = z, et = et ? Ze(et) : null, et !== null && (St = q(et), Ke = et.tag, et !== St || Ke !== 5 && Ke !== 27 && Ke !== 6) && (et = null)) : (B = null, et = z), B !== et)) {
            if (Ke = Qu, $ = "onMouseLeave", C = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (Ke = Vu, $ = "onPointerLeave", C = "onPointerEnter", N = "pointer"), St = B == null ? U : Cs(B), O = et == null ? U : Cs(et), U = new Ke(
              $,
              N + "leave",
              B,
              l,
              V
            ), U.target = St, U.relatedTarget = O, $ = null, Ze(V) === z && (Ke = new Ke(
              C,
              N + "enter",
              et,
              l,
              V
            ), Ke.target = O, Ke.relatedTarget = St, $ = Ke), St = $, B && et)
              t: {
                for (Ke = B, C = et, N = 0, O = Ke; O; O = pa(O))
                  N++;
                for (O = 0, $ = C; $; $ = pa($))
                  O++;
                for (; 0 < N - O; )
                  Ke = pa(Ke), N--;
                for (; 0 < O - N; )
                  C = pa(C), O--;
                for (; N--; ) {
                  if (Ke === C || C !== null && Ke === C.alternate)
                    break t;
                  Ke = pa(Ke), C = pa(C);
                }
                Ke = null;
              }
            else Ke = null;
            B !== null && Mh(
              P,
              U,
              B,
              Ke,
              !1
            ), et !== null && St !== null && Mh(
              P,
              St,
              et,
              Ke,
              !0
            );
          }
        }
        e: {
          if (U = z ? Cs(z) : window, B = U.nodeName && U.nodeName.toLowerCase(), B === "select" || B === "input" && U.type === "file")
            var De = eo;
          else if (Iu(U))
            if (to)
              De = Jm;
            else {
              De = Zm;
              var dt = Qm;
            }
          else
            B = U.nodeName, !B || B.toLowerCase() !== "input" || U.type !== "checkbox" && U.type !== "radio" ? z && tc(z.elementType) && (De = eo) : De = Vm;
          if (De && (De = De(e, z))) {
            Pu(
              P,
              De,
              l,
              V
            );
            break e;
          }
          dt && dt(e, U, z), e === "focusout" && z && U.type === "number" && z.memoizedProps.value != null && ec(U, "number", U.value);
        }
        switch (dt = z ? Cs(z) : window, e) {
          case "focusin":
            (Iu(dt) || dt.contentEditable === "true") && (Kl = dt, xc = z, Ha = null);
            break;
          case "focusout":
            Ha = xc = Kl = null;
            break;
          case "mousedown":
            jc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            jc = !1, uo(P, l, V);
            break;
          case "selectionchange":
            if ($m) break;
          case "keydown":
          case "keyup":
            uo(P, l, V);
        }
        var Be;
        if (dc)
          e: {
            switch (e) {
              case "compositionstart":
                var We = "onCompositionStart";
                break e;
              case "compositionend":
                We = "onCompositionEnd";
                break e;
              case "compositionupdate":
                We = "onCompositionUpdate";
                break e;
            }
            We = void 0;
          }
        else
          Jl ? Wu(e, l) && (We = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (We = "onCompositionStart");
        We && (Ju && l.locale !== "ko" && (Jl || We !== "onCompositionStart" ? We === "onCompositionEnd" && Jl && (Be = Gu()) : (el = V, ic = "value" in el ? el.value : el.textContent, Jl = !0)), dt = Ci(z, We), 0 < dt.length && (We = new Zu(
          We,
          e,
          null,
          l,
          V
        ), P.push({ event: We, listeners: dt }), Be ? We.data = Be : (Be = Fu(l), Be !== null && (We.data = Be)))), (Be = Bm ? Lm(e, l) : Ym(e, l)) && (We = Ci(z, "onBeforeInput"), 0 < We.length && (dt = new Zu(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          V
        ), P.push({
          event: dt,
          listeners: We
        }), dt.data = Be)), zx(
          P,
          e,
          z,
          l,
          V
        );
      }
      Uh(P, t);
    });
  }
  function fn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Ci(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = Ta(e, l), n != null && a.unshift(
        fn(e, n, i)
      ), n = Ta(e, t), n != null && a.push(
        fn(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function pa(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Mh(e, t, l, a, n) {
    for (var i = t._reactName, r = []; l !== null && l !== a; ) {
      var h = l, p = h.alternate, z = h.stateNode;
      if (h = h.tag, p !== null && p === a) break;
      h !== 5 && h !== 26 && h !== 27 || z === null || (p = z, n ? (z = Ta(l, i), z != null && r.unshift(
        fn(l, z, p)
      )) : n || (z = Ta(l, i), z != null && r.push(
        fn(l, z, p)
      ))), l = l.return;
    }
    r.length !== 0 && e.push({ event: t, listeners: r });
  }
  var Dx = /\r\n?/g, Mx = /\u0000|\uFFFD/g;
  function qh(e) {
    return (typeof e == "string" ? e : "" + e).replace(Dx, `
`).replace(Mx, "");
  }
  function Hh(e, t) {
    return t = qh(t), qh(e) === t;
  }
  function Ei() {
  }
  function Nt(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ql(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ql(e, "" + a);
        break;
      case "className":
        Rn(e, "class", a);
        break;
      case "tabIndex":
        Rn(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Rn(e, l, a);
        break;
      case "style":
        Bu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          Rn(e, "data", a);
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
        a = Mn("" + a), e.setAttribute(l, a);
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
          typeof i == "function" && (l === "formAction" ? (t !== "input" && Nt(e, t, "name", n.name, n, null), Nt(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Nt(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Nt(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Nt(e, t, "encType", n.encType, n, null), Nt(e, t, "method", n.method, n, null), Nt(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Mn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Ei);
        break;
      case "onScroll":
        a != null && ft("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ft("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(d(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(d(60));
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
        l = Mn("" + a), e.setAttributeNS(
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
        ft("beforetoggle", e), ft("toggle", e), An(e, "popover", a);
        break;
      case "xlinkActuate":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Ds(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Ds(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Ds(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Ds(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        An(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = hm.get(l) || l, An(e, l, a));
    }
  }
  function Br(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Bu(e, a, i);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(d(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(d(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Ql(e, a) : (typeof a == "number" || typeof a == "bigint") && Ql(e, "" + a);
        break;
      case "onScroll":
        a != null && ft("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ft("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Ei);
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
        if (!Oa.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[vt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : An(e, l, a);
          }
    }
  }
  function Ft(e, t, l) {
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
        ft("error", e), ft("load", e);
        var a = !1, n = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var r = l[i];
            if (r != null)
              switch (i) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(d(137, t));
                default:
                  Nt(e, t, i, r, l, null);
              }
          }
        n && Nt(e, t, "srcSet", l.srcSet, l, null), a && Nt(e, t, "src", l.src, l, null);
        return;
      case "input":
        ft("invalid", e);
        var h = i = r = n = null, p = null, z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var V = l[a];
            if (V != null)
              switch (a) {
                case "name":
                  n = V;
                  break;
                case "type":
                  r = V;
                  break;
                case "checked":
                  p = V;
                  break;
                case "defaultChecked":
                  z = V;
                  break;
                case "value":
                  i = V;
                  break;
                case "defaultValue":
                  h = V;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (V != null)
                    throw Error(d(137, t));
                  break;
                default:
                  Nt(e, t, a, V, l, null);
              }
          }
        Du(
          e,
          i,
          h,
          p,
          z,
          r,
          n,
          !1
        ), Un(e);
        return;
      case "select":
        ft("invalid", e), a = r = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (h = l[n], h != null))
            switch (n) {
              case "value":
                i = h;
                break;
              case "defaultValue":
                r = h;
                break;
              case "multiple":
                a = h;
              default:
                Nt(e, t, n, h, l, null);
            }
        t = i, l = r, e.multiple = !!a, t != null ? Xl(e, !!a, t, !1) : l != null && Xl(e, !!a, l, !0);
        return;
      case "textarea":
        ft("invalid", e), i = n = a = null;
        for (r in l)
          if (l.hasOwnProperty(r) && (h = l[r], h != null))
            switch (r) {
              case "value":
                a = h;
                break;
              case "defaultValue":
                n = h;
                break;
              case "children":
                i = h;
                break;
              case "dangerouslySetInnerHTML":
                if (h != null) throw Error(d(91));
                break;
              default:
                Nt(e, t, r, h, l, null);
            }
        qu(e, a, n, i), Un(e);
        return;
      case "option":
        for (p in l)
          if (l.hasOwnProperty(p) && (a = l[p], a != null))
            switch (p) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Nt(e, t, p, a, l, null);
            }
        return;
      case "dialog":
        ft("beforetoggle", e), ft("toggle", e), ft("cancel", e), ft("close", e);
        break;
      case "iframe":
      case "object":
        ft("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < hn.length; a++)
          ft(hn[a], e);
        break;
      case "image":
        ft("error", e), ft("load", e);
        break;
      case "details":
        ft("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ft("error", e), ft("load", e);
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
                throw Error(d(137, t));
              default:
                Nt(e, t, z, a, l, null);
            }
        return;
      default:
        if (tc(t)) {
          for (V in l)
            l.hasOwnProperty(V) && (a = l[V], a !== void 0 && Br(
              e,
              t,
              V,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (h in l)
      l.hasOwnProperty(h) && (a = l[h], a != null && Nt(e, t, h, a, l, null));
  }
  function qx(e, t, l, a) {
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
        var n = null, i = null, r = null, h = null, p = null, z = null, V = null;
        for (B in l) {
          var P = l[B];
          if (l.hasOwnProperty(B) && P != null)
            switch (B) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                p = P;
              default:
                a.hasOwnProperty(B) || Nt(e, t, B, null, a, P);
            }
        }
        for (var U in a) {
          var B = a[U];
          if (P = l[U], a.hasOwnProperty(U) && (B != null || P != null))
            switch (U) {
              case "type":
                i = B;
                break;
              case "name":
                n = B;
                break;
              case "checked":
                z = B;
                break;
              case "defaultChecked":
                V = B;
                break;
              case "value":
                r = B;
                break;
              case "defaultValue":
                h = B;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (B != null)
                  throw Error(d(137, t));
                break;
              default:
                B !== P && Nt(
                  e,
                  t,
                  U,
                  B,
                  a,
                  P
                );
            }
        }
        Pi(
          e,
          r,
          h,
          p,
          z,
          V,
          i,
          n
        );
        return;
      case "select":
        B = r = h = U = null;
        for (i in l)
          if (p = l[i], l.hasOwnProperty(i) && p != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                B = p;
              default:
                a.hasOwnProperty(i) || Nt(
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
                U = i;
                break;
              case "defaultValue":
                h = i;
                break;
              case "multiple":
                r = i;
              default:
                i !== p && Nt(
                  e,
                  t,
                  n,
                  i,
                  a,
                  p
                );
            }
        t = h, l = r, a = B, U != null ? Xl(e, !!l, U, !1) : !!a != !!l && (t != null ? Xl(e, !!l, t, !0) : Xl(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        B = U = null;
        for (h in l)
          if (n = l[h], l.hasOwnProperty(h) && n != null && !a.hasOwnProperty(h))
            switch (h) {
              case "value":
                break;
              case "children":
                break;
              default:
                Nt(e, t, h, null, a, n);
            }
        for (r in a)
          if (n = a[r], i = l[r], a.hasOwnProperty(r) && (n != null || i != null))
            switch (r) {
              case "value":
                U = n;
                break;
              case "defaultValue":
                B = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(d(91));
                break;
              default:
                n !== i && Nt(e, t, r, n, a, i);
            }
        Mu(e, U, B);
        return;
      case "option":
        for (var et in l)
          if (U = l[et], l.hasOwnProperty(et) && U != null && !a.hasOwnProperty(et))
            switch (et) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Nt(
                  e,
                  t,
                  et,
                  null,
                  a,
                  U
                );
            }
        for (p in a)
          if (U = a[p], B = l[p], a.hasOwnProperty(p) && U !== B && (U != null || B != null))
            switch (p) {
              case "selected":
                e.selected = U && typeof U != "function" && typeof U != "symbol";
                break;
              default:
                Nt(
                  e,
                  t,
                  p,
                  U,
                  a,
                  B
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
          U = l[Ke], l.hasOwnProperty(Ke) && U != null && !a.hasOwnProperty(Ke) && Nt(e, t, Ke, null, a, U);
        for (z in a)
          if (U = a[z], B = l[z], a.hasOwnProperty(z) && U !== B && (U != null || B != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (U != null)
                  throw Error(d(137, t));
                break;
              default:
                Nt(
                  e,
                  t,
                  z,
                  U,
                  a,
                  B
                );
            }
        return;
      default:
        if (tc(t)) {
          for (var St in l)
            U = l[St], l.hasOwnProperty(St) && U !== void 0 && !a.hasOwnProperty(St) && Br(
              e,
              t,
              St,
              void 0,
              a,
              U
            );
          for (V in a)
            U = a[V], B = l[V], !a.hasOwnProperty(V) || U === B || U === void 0 && B === void 0 || Br(
              e,
              t,
              V,
              U,
              a,
              B
            );
          return;
        }
    }
    for (var C in l)
      U = l[C], l.hasOwnProperty(C) && U != null && !a.hasOwnProperty(C) && Nt(e, t, C, null, a, U);
    for (P in a)
      U = a[P], B = l[P], !a.hasOwnProperty(P) || U === B || U == null && B == null || Nt(e, t, P, U, a, B);
  }
  var Lr = null, Yr = null;
  function Oi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Bh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Lh(e, t) {
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
  function Gr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Xr = null;
  function Hx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Xr ? !1 : (Xr = e, !0) : (Xr = null, !1);
  }
  var Yh = typeof setTimeout == "function" ? setTimeout : void 0, Bx = typeof clearTimeout == "function" ? clearTimeout : void 0, Gh = typeof Promise == "function" ? Promise : void 0, Lx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Gh < "u" ? function(e) {
    return Gh.resolve(null).then(e).catch(Yx);
  } : Yh;
  function Yx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function jl(e) {
    return e === "head";
  }
  function Xh(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var r = e.ownerDocument;
            if (l & 1 && mn(r.documentElement), l & 2 && mn(r.body), l & 4)
              for (l = r.head, mn(l), r = l.firstChild; r; ) {
                var h = r.nextSibling, p = r.nodeName;
                r[Ce] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && r.rel.toLowerCase() === "stylesheet" || l.removeChild(r), r = h;
              }
          }
          if (n === 0) {
            e.removeChild(i), _n(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    _n(t);
  }
  function Qr(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Qr(l), Ee(l);
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
  function Gx(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Ce])
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
      if (e = Ss(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Xx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ss(e.nextSibling), e === null)) return null;
    return e;
  }
  function Zr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Qx(e, t) {
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
  function Ss(e) {
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
  var Vr = null;
  function Qh(e) {
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
  function Zh(e, t, l) {
    switch (t = Oi(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(d(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(d(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(d(454));
        return e;
      default:
        throw Error(d(451));
    }
  }
  function mn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ee(e);
  }
  var ys = /* @__PURE__ */ new Map(), Vh = /* @__PURE__ */ new Set();
  function Ti(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var $s = X.d;
  X.d = {
    f: Zx,
    r: Vx,
    D: Jx,
    C: Kx,
    L: $x,
    m: Wx,
    X: Ix,
    S: Fx,
    M: Px
  };
  function Zx() {
    var e = $s.f(), t = yi();
    return e || t;
  }
  function Vx(e) {
    var t = Lt(e);
    t !== null && t.tag === 5 && t.type === "form" ? hd(t) : $s.r(e);
  }
  var ga = typeof document > "u" ? null : document;
  function Jh(e, t, l) {
    var a = ga;
    if (a && typeof t == "string" && t) {
      var n = ms(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Vh.has(n) || (Vh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), Ft(t, "link", e), qt(t), a.head.appendChild(t)));
    }
  }
  function Jx(e) {
    $s.D(e), Jh("dns-prefetch", e, null);
  }
  function Kx(e, t) {
    $s.C(e, t), Jh("preconnect", e, t);
  }
  function $x(e, t, l) {
    $s.L(e, t, l);
    var a = ga;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + ms(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + ms(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + ms(
        l.imageSizes
      ) + '"]')) : n += '[href="' + ms(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = ba(e);
          break;
        case "script":
          i = ya(e);
      }
      ys.has(i) || (e = D(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), ys.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(xn(i)) || t === "script" && a.querySelector(jn(i)) || (t = a.createElement("link"), Ft(t, "link", e), qt(t), a.head.appendChild(t)));
    }
  }
  function Wx(e, t) {
    $s.m(e, t);
    var l = ga;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + ms(a) + '"][href="' + ms(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = ya(e);
      }
      if (!ys.has(i) && (e = D({ rel: "modulepreload", href: e }, t), ys.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(jn(i)))
              return;
        }
        a = l.createElement("link"), Ft(a, "link", e), qt(a), l.head.appendChild(a);
      }
    }
  }
  function Fx(e, t, l) {
    $s.S(e, t, l);
    var a = ga;
    if (a && e) {
      var n = Us(a).hoistableStyles, i = ba(e);
      t = t || "default";
      var r = n.get(i);
      if (!r) {
        var h = { loading: 0, preload: null };
        if (r = a.querySelector(
          xn(i)
        ))
          h.loading = 5;
        else {
          e = D(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = ys.get(i)) && Jr(e, l);
          var p = r = a.createElement("link");
          qt(p), Ft(p, "link", e), p._p = new Promise(function(z, V) {
            p.onload = z, p.onerror = V;
          }), p.addEventListener("load", function() {
            h.loading |= 1;
          }), p.addEventListener("error", function() {
            h.loading |= 2;
          }), h.loading |= 4, zi(r, t, a);
        }
        r = {
          type: "stylesheet",
          instance: r,
          count: 1,
          state: h
        }, n.set(i, r);
      }
    }
  }
  function Ix(e, t) {
    $s.X(e, t);
    var l = ga;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ya(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = D({ src: e, async: !0 }, t), (t = ys.get(n)) && Kr(e, t), i = l.createElement("script"), qt(i), Ft(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Px(e, t) {
    $s.M(e, t);
    var l = ga;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ya(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = D({ src: e, async: !0, type: "module" }, t), (t = ys.get(n)) && Kr(e, t), i = l.createElement("script"), qt(i), Ft(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Kh(e, t, l, a) {
    var n = (n = I.current) ? Ti(n) : null;
    if (!n) throw Error(d(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = ba(l.href), l = Us(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = ba(l.href);
          var i = Us(
            n
          ).hoistableStyles, r = i.get(e);
          if (r || (n = n.ownerDocument || n, r = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, r), (i = n.querySelector(
            xn(e)
          )) && !i._p && (r.instance = i, r.state.loading = 5), ys.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, ys.set(e, l), i || ej(
            n,
            e,
            l,
            r.state
          ))), t && a === null)
            throw Error(d(528, ""));
          return r;
        }
        if (t && a !== null)
          throw Error(d(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ya(l), l = Us(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(d(444, e));
    }
  }
  function ba(e) {
    return 'href="' + ms(e) + '"';
  }
  function xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function $h(e) {
    return D({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function ej(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Ft(t, "link", l), qt(t), e.head.appendChild(t));
  }
  function ya(e) {
    return '[src="' + ms(e) + '"]';
  }
  function jn(e) {
    return "script[async]" + e;
  }
  function Wh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + ms(l.href) + '"]'
          );
          if (a)
            return t.instance = a, qt(a), a;
          var n = D({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), qt(a), Ft(a, "style", n), zi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = ba(l.href);
          var i = e.querySelector(
            xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, qt(i), i;
          a = $h(l), (n = ys.get(n)) && Jr(a, n), i = (e.ownerDocument || e).createElement("link"), qt(i);
          var r = i;
          return r._p = new Promise(function(h, p) {
            r.onload = h, r.onerror = p;
          }), Ft(i, "link", a), t.state.loading |= 4, zi(i, l.precedence, e), t.instance = i;
        case "script":
          return i = ya(l.src), (n = e.querySelector(
            jn(i)
          )) ? (t.instance = n, qt(n), n) : (a = l, (n = ys.get(i)) && (a = D({}, l), Kr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), qt(n), Ft(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(d(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, zi(a, l.precedence, e));
    return t.instance;
  }
  function zi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, r = 0; r < a.length; r++) {
      var h = a[r];
      if (h.dataset.precedence === t) i = h;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Jr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Kr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Ai = null;
  function Fh(e, t, l) {
    if (Ai === null) {
      var a = /* @__PURE__ */ new Map(), n = Ai = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Ai, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[Ce] || i[it] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var r = i.getAttribute(t) || "";
        r = e + r;
        var h = a.get(r);
        h ? h.push(i) : a.set(r, [i]);
      }
    }
    return a;
  }
  function Ih(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function tj(e, t, l) {
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
  function Ph(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var vn = null;
  function sj() {
  }
  function lj(e, t, l) {
    if (vn === null) throw Error(d(475));
    var a = vn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = ba(l.href), i = e.querySelector(
          xn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Ri.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, qt(i);
          return;
        }
        i = e.ownerDocument || e, l = $h(l), (n = ys.get(n)) && Jr(l, n), i = i.createElement("link"), qt(i);
        var r = i;
        r._p = new Promise(function(h, p) {
          r.onload = h, r.onerror = p;
        }), Ft(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Ri.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function aj() {
    if (vn === null) throw Error(d(475));
    var e = vn;
    return e.stylesheets && e.count === 0 && $r(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && $r(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Ri() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) $r(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ui = null;
  function $r(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ui = /* @__PURE__ */ new Map(), t.forEach(nj, e), Ui = null, Ri.call(e));
  }
  function nj(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Ui.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Ui.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var r = n[i];
          (r.nodeName === "LINK" || r.getAttribute("media") !== "not all") && (l.set(r.dataset.precedence, r), a = r);
        }
        a && l.set(null, a);
      }
      n = t.instance, r = n.getAttribute("data-precedence"), i = l.get(r) || a, i === a && l.set(null, n), l.set(r, n), this.count++, a = Ri.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var pn = {
    $$typeof: W,
    Provider: null,
    Consumer: null,
    _currentValue: se,
    _currentValue2: se,
    _threadCount: 0
  };
  function ij(e, t, l, a, n, i, r, h) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = j(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = j(0), this.hiddenUpdates = j(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = r, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = h, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function ef(e, t, l, a, n, i, r, h, p, z, V, P) {
    return e = new ij(
      e,
      t,
      l,
      r,
      h,
      p,
      z,
      P
    ), t = 1, i === !0 && (t |= 24), i = cs(3, null, null, t), e.current = i, i.stateNode = e, t = Tc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Uc(i), e;
  }
  function tf(e) {
    return e ? (e = Il, e) : Il;
  }
  function sf(e, t, l, a, n, i) {
    n = tf(n), a.context === null ? a.context = n : a.pendingContext = n, a = ll(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = al(e, a, t), l !== null && (hs(l, e, t), Ja(l, e, t));
  }
  function lf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Wr(e, t) {
    lf(e, t), (e = e.alternate) && lf(e, t);
  }
  function af(e) {
    if (e.tag === 13) {
      var t = Fl(e, 67108864);
      t !== null && hs(t, e, 67108864), Wr(e, 67108864);
    }
  }
  var Di = !0;
  function cj(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = X.p;
    try {
      X.p = 2, Fr(e, t, l, a);
    } finally {
      X.p = i, g.T = n;
    }
  }
  function rj(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = X.p;
    try {
      X.p = 8, Fr(e, t, l, a);
    } finally {
      X.p = i, g.T = n;
    }
  }
  function Fr(e, t, l, a) {
    if (Di) {
      var n = Ir(a);
      if (n === null)
        Hr(
          e,
          t,
          a,
          Mi,
          l
        ), cf(e, a);
      else if (oj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (cf(e, a), t & 4 && -1 < uj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Lt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var r = b(i.pendingLanes);
                  if (r !== 0) {
                    var h = i;
                    for (h.pendingLanes |= 2, h.entangledLanes |= 2; r; ) {
                      var p = 1 << 31 - st(r);
                      h.entanglements[1] |= p, r &= ~p;
                    }
                    As(i), (bt & 6) === 0 && (gi = qe() + 500, dn(0));
                  }
                }
                break;
              case 13:
                h = Fl(i, 2), h !== null && hs(h, i, 2), yi(), Wr(i, 2);
            }
          if (i = Ir(a), i === null && Hr(
            e,
            t,
            a,
            Mi,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Hr(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Ir(e) {
    return e = lc(e), Pr(e);
  }
  var Mi = null;
  function Pr(e) {
    if (Mi = null, e = Ze(e), e !== null) {
      var t = q(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = Z(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Mi = e, null;
  }
  function nf(e) {
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
          case $e:
            return 2;
          case rt:
            return 8;
          case je:
          case lt:
            return 32;
          case Re:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var eu = !1, vl = null, pl = null, gl = null, gn = /* @__PURE__ */ new Map(), bn = /* @__PURE__ */ new Map(), bl = [], uj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function cf(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        vl = null;
        break;
      case "dragenter":
      case "dragleave":
        pl = null;
        break;
      case "mouseover":
      case "mouseout":
        gl = null;
        break;
      case "pointerover":
      case "pointerout":
        gn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        bn.delete(t.pointerId);
    }
  }
  function yn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Lt(t), t !== null && af(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function oj(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return vl = yn(
          vl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return pl = yn(
          pl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return gl = yn(
          gl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return gn.set(
          i,
          yn(
            gn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, bn.set(
          i,
          yn(
            bn.get(i) || null,
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
  function rf(e) {
    var t = Ze(e.target);
    if (t !== null) {
      var l = q(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = Z(l), t !== null) {
            e.blockedOn = t, Mt(e.priority, function() {
              if (l.tag === 13) {
                var a = ds();
                a = he(a);
                var n = Fl(l, a);
                n !== null && hs(n, l, a), Wr(l, a);
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
  function qi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Ir(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        sc = a, l.target.dispatchEvent(a), sc = null;
      } else
        return t = Lt(l), t !== null && af(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function uf(e, t, l) {
    qi(e) && l.delete(t);
  }
  function dj() {
    eu = !1, vl !== null && qi(vl) && (vl = null), pl !== null && qi(pl) && (pl = null), gl !== null && qi(gl) && (gl = null), gn.forEach(uf), bn.forEach(uf);
  }
  function Hi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, eu || (eu = !0, o.unstable_scheduleCallback(
      o.unstable_NormalPriority,
      dj
    )));
  }
  var Bi = null;
  function of(e) {
    Bi !== e && (Bi = e, o.unstable_scheduleCallback(
      o.unstable_NormalPriority,
      function() {
        Bi === e && (Bi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Pr(a || l) === null)
              continue;
            break;
          }
          var i = Lt(l);
          i !== null && (e.splice(t, 3), t -= 3, Pc(
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
  function _n(e) {
    function t(p) {
      return Hi(p, e);
    }
    vl !== null && Hi(vl, e), pl !== null && Hi(pl, e), gl !== null && Hi(gl, e), gn.forEach(t), bn.forEach(t);
    for (var l = 0; l < bl.length; l++) {
      var a = bl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < bl.length && (l = bl[0], l.blockedOn === null); )
      rf(l), l.blockedOn === null && bl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], r = n[vt] || null;
        if (typeof i == "function")
          r || of(l);
        else if (r) {
          var h = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, r = i[vt] || null)
              h = r.formAction;
            else if (Pr(n) !== null) continue;
          } else h = r.action;
          typeof h == "function" ? l[a + 1] = h : (l.splice(a, 3), a -= 3), of(l);
        }
      }
  }
  function tu(e) {
    this._internalRoot = e;
  }
  Li.prototype.render = tu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(d(409));
    var l = t.current, a = ds();
    sf(l, a, e, t, null, null);
  }, Li.prototype.unmount = tu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      sf(e.current, 2, null, e, null, null), yi(), t[c] = null;
    }
  };
  function Li(e) {
    this._internalRoot = e;
  }
  Li.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = kt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < bl.length && t !== 0 && t < bl[l].priority; l++) ;
      bl.splice(l, 0, e), l === 0 && rf(e);
    }
  };
  var df = f.version;
  if (df !== "19.1.0")
    throw Error(
      d(
        527,
        df,
        "19.1.0"
      )
    );
  X.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(d(188)) : (e = Object.keys(e).join(","), Error(d(268, e)));
    return e = Y(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var hj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: g,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yi.isDisabled && Yi.supportsFiber)
      try {
        K = Yi.inject(
          hj
        ), ke = Yi;
      } catch {
      }
  }
  return Sn.createRoot = function(e, t) {
    if (!T(e)) throw Error(d(299));
    var l = !1, a = "", n = kd, i = Cd, r = Ed, h = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (r = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (h = t.unstable_transitionCallbacks)), t = ef(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      n,
      i,
      r,
      h,
      null
    ), e[c] = t.current, qr(e), new tu(t);
  }, Sn.hydrateRoot = function(e, t, l) {
    if (!T(e)) throw Error(d(299));
    var a = !1, n = "", i = kd, r = Cd, h = Ed, p = null, z = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (r = l.onCaughtError), l.onRecoverableError !== void 0 && (h = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (p = l.unstable_transitionCallbacks), l.formState !== void 0 && (z = l.formState)), t = ef(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      i,
      r,
      h,
      p,
      z
    ), t.context = tf(null), l = t.current, a = ds(), a = he(a), n = ll(a), n.callback = null, al(l, n, a), l = a, t.current.lanes = l, ce(t, l), As(t), e[c] = t.current, qr(e), new Li(t);
  }, Sn.version = "19.1.0", Sn;
}
var yf;
function _j() {
  if (yf) return lu.exports;
  yf = 1;
  function o() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o);
      } catch (f) {
        console.error(f);
      }
  }
  return o(), lu.exports = yj(), lu.exports;
}
var Nj = _j(), u = ku();
const ru = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function Sj({ api: o, projects: f }) {
  var Ve;
  const [y, d] = u.useState(((Ve = f[0]) == null ? void 0 : Ve.id) || ""), [T, q] = u.useState([]), [Z, A] = u.useState("general_inspection"), [Y, v] = u.useState("现场质量安全检查"), [D, J] = u.useState("general,通用施工检查"), [k, te] = u.useState(ru.map((Q) => Q[0])), [me, Ne] = u.useState(!1), [Se, Te] = u.useState(!1), [fe, W] = u.useState(""), [oe, le] = u.useState(""), [H, xe] = u.useState(0), ze = f.find((Q) => Q.id === y), Le = ze != null && ze.permissions ? ze.permissions.includes("knowledge.process") : ze == null ? void 0 : ze.can_run, Ge = ze != null && ze.permissions ? ze.permissions.includes("knowledge.review") : ze == null ? void 0 : ze.can_manage;
  u.useEffect(() => {
    let Q = !1;
    return q([]), W(""), y && o(`/scenes?project_id=${encodeURIComponent(y)}`).then((re) => {
      Q || q(re.items);
    }).catch((re) => {
      Q || W(re.message);
    }), () => {
      Q = !0;
    };
  }, [y, H]);
  const He = async (Q) => {
    Te(!0), W(""), le("");
    try {
      await Q(), xe((re) => re + 1);
    } catch (re) {
      W(re.message);
    } finally {
      Te(!1);
    }
  }, ve = (Q) => {
    A(Q.code), v(Q.payload.name), J(Q.payload.categories.map((re) => re.code + "," + re.name).join(`
`)), te(Q.payload.steps.map((re) => re.event_type)), Ne(Q.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      fe && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: fe }),
      oe && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: oe }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: y, onChange: (Q) => d(Q.target.value), children: f.map((Q) => /* @__PURE__ */ s.jsx("option", { value: Q.id, children: Q.name }, Q.id)) })
      ] }),
      Le && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: Z, onChange: (Q) => A(Q.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: Y, onChange: (Q) => v(Q.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: D, onChange: (Q) => J(Q.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          ru.map((Q) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(Q[0]), onChange: (re) => te((g) => re.target.checked ? [...g, Q[0]] : g.filter((X) => X !== Q[0])) }),
            Q[1]
          ] }, Q[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: me, onChange: (Q) => Ne(Q.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Se || !y || !k.length, onClick: () => void He(async () => {
          const Q = T.filter((g) => g.code === Z).sort((g, X) => X.version - g.version)[0], re = D.split(`
`).filter((g) => g.trim()).map((g) => {
            const [X, se] = g.split(/[,，]/);
            if (!(X != null && X.trim()) || !(se != null && se.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const we = Q == null ? void 0 : Q.payload.categories.find((x) => x.code === X.trim());
            return { code: X.trim(), name: se.trim(), focus: (we == null ? void 0 : we.focus) || "", keywords: (we == null ? void 0 : we.keywords) || [] };
          });
          await o("/scenes", { method: "POST", body: JSON.stringify({ project_id: y, code: Z, expected_version: (Q == null ? void 0 : Q.version) || 0, payload: { name: Y, categories: re, steps: ru.filter((g) => k.includes(g[0])).map((g) => ({ event_type: g[0], name: g[1], scope: g[2] })), compare_deadline: me } }) }), le("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      T.map((Q) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Q.payload.name,
          " · v",
          Q.version,
          Q.active ? " · 已启用" : ""
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          Q.code,
          " · ",
          Q.payload.categories.length,
          "项分类 · ",
          Q.payload.steps.length,
          "项过程记录"
        ] }),
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ve(Q), children: "以此版本编辑" }),
        Ge && !Q.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void He(async () => {
          var re;
          await o(`/scenes/${Q.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((re = T.find((g) => g.code === Q.code && g.active)) == null ? void 0 : re.id) || null }) }), le("场景版本已启用。");
        }), children: "启用此版本" }),
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Se, onClick: () => void He(async () => {
          var g;
          const re = await o(`/knowledge/taxonomies?project_id=${encodeURIComponent(y)}`);
          await o("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: y, expected_version: ((g = re.items[0]) == null ? void 0 : g.version) || 0, categories: Q.payload.categories }) }), le("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, Q.id))
    ] })
  ] });
}
const uu = {}, Cu = window.location.pathname.startsWith("/quality/b/"), ka = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), _f = uu == null ? void 0 : uu.VITE_B_PLATFORM_MODE, Ot = ka || Cu && (_f === "true" || _f !== "false" && !0);
function Gi() {
  if (!Cu && !ka) return window.location.pathname;
  const o = ka ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return o.split("?")[0] === "/knowledge" ? "/knowledge/library" : o.split("?")[0];
}
function wj(o) {
  ka ? window.history.pushState({}, "", "/quality/#/b" + o) : Cu ? window.history.pushState({}, "", "/quality/b/#" + o) : window.history.pushState({}, "", o), ka && window.dispatchEvent(new Event("platform-route"));
}
async function Dt(o, f = {}) {
  if (!Ot) return fetch(o, f);
  if (!o.startsWith("/api/v1/") && !o.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const y = new Headers(f.headers);
  y.delete("Authorization");
  const d = window.QaxcProjectId;
  ka && d && y.set("X-Project-ID", d);
  const T = (f.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(T)) {
    const Z = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (Z.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !Z.ok) throw new Error(Z.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const A = await Z.json(), Y = A.csrf_token ?? A.token;
    if (typeof Y != "string" || !Y) throw new Error("安全校验返回格式不正确。");
    y.set("X-CSRF-Token", Y);
  }
  const q = await fetch("/quality/b" + o, { ...f, headers: y, credentials: "same-origin" });
  return q.status === 401 && window.dispatchEvent(new Event("b-session-expired")), q;
}
const Nf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, Sf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, bu = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), kj = (o) => ({
  project_id: o,
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
  clauses: [bu()]
}), _a = (o) => o.split(`
`).map((f) => f.trim()).filter(Boolean);
function ou(o, f) {
  var y;
  return o != null && o.permissions ? o.permissions.includes(f) : f === "knowledge.process" ? !!(o != null && o.can_run) : !!(o != null && o.can_manage) || !!((y = o == null ? void 0 : o.roles) != null && y.includes("reviewer"));
}
function Cj({ api: o, projects: f, identity: y }) {
  var je, lt, Re;
  const [d, T] = u.useState(((je = f[0]) == null ? void 0 : je.id) || ""), [q, Z] = u.useState([]), [A, Y] = u.useState(null), [v, D] = u.useState(null), [J, k] = u.useState(!1), [te, me] = u.useState(!1), [Ne, Se] = u.useState(!1), [Te, fe] = u.useState(""), [W, oe] = u.useState(""), [le, H] = u.useState(""), [xe, ze] = u.useState(null), [Le, Ge] = u.useState(0), [He, ve] = u.useState(""), [Ve, Q] = u.useState(!1), [re, g] = u.useState(""), [X, se] = u.useState("current_rectification"), [we, x] = u.useState(""), [L, F] = u.useState({ project_type: "", region: "", object_type: "", stage: "" }), [ee, ie] = u.useState(null), G = u.useRef(crypto.randomUUID()), I = u.useRef(0), Ae = f.find((E) => E.id === d), ae = ou(Ae, "knowledge.process"), Oe = ou(Ae, "knowledge.review"), at = ou(Ae, "knowledge.publish"), Fe = ae || Oe || at;
  u.useEffect(() => {
    const E = (w) => {
      J && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [J]), u.useEffect(() => {
    let E = !1;
    if (Se(!0), fe(""), Z([]), ze(null), !d) {
      Se(!1);
      return;
    }
    return o(`/standards?project_id=${encodeURIComponent(d)}&view=${Fe ? "manage" : "published"}${le ? "&cursor=" + encodeURIComponent(le) : ""}`).then((w) => {
      E || (Z(w.items), ze(w.next_cursor));
    }).catch((w) => {
      E || fe(w.message);
    }).finally(() => {
      E || Se(!1);
    }), () => {
      E = !0;
    };
  }, [d, Fe, le, Le]), u.useEffect(() => () => {
    I.current++;
  }, []);
  const Ie = async (E) => {
    me(!0), fe(""), oe("");
    try {
      await E();
    } catch (w) {
      fe(w.message);
    } finally {
      me(!1);
    }
  }, Xe = () => {
    var E;
    k(!1), (E = window.QaxcClearPendingEdits) == null || E.call(window);
  }, Me = () => !J || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), ye = (E) => {
    D((w) => w && { ...w, ...E }), k(!0), G.current = crypto.randomUUID();
  }, _e = (E, w) => {
    v && ye({ clauses: v.clauses.map((K, ke) => ke === E ? { ...K, ...w } : K) });
  }, qe = async (E) => {
    if (!Me()) return;
    const w = ++I.current;
    await Ie(async () => {
      const K = await o("/standards/" + E.id);
      w === I.current && (Y(K), D(null), Xe(), ie(null), ve(""), Q(!1));
    });
  }, tt = () => {
    if (!A || !Me()) return;
    const { id: E, version: w, row_version: K, state: ke, source_available: Ue, verified_on: st, history: ut, clauses: R, ...de } = A;
    D({
      project_id: de.project_id,
      code: de.code,
      edition: de.edition,
      title: de.title,
      source_asset_id: de.source_asset_id,
      valid_from: de.valid_from,
      valid_until: de.valid_until,
      scope: de.scope,
      maintainer: de.maintainer,
      expected_version: w,
      reason: "修订说明待填写",
      clauses: (R || []).map((ne) => Object.fromEntries(Object.keys(bu()).map((Je) => [Je, ne[Je]])))
    }), g("沿用已绑定原件；原文变化时请重新上传"), k(!0), G.current = crypto.randomUUID();
  }, $e = (E) => void Ie(async () => {
    if (!A) return;
    const w = await o(`/standards/${A.id}/actions`, { method: "POST", body: JSON.stringify({ action: E, row_version: A.row_version, reason: He, evidence_checked: Ve }) });
    Y({ ...A, ...w }), Xe(), Ge((K) => K + 1), oe(Sf[E] + "成功。"), ve(""), Q(!1), A.source_available !== !1 && Y(await o("/standards/" + A.id));
  }), rt = () => void Ie(async () => {
    if (!A) return;
    const E = await Dt(`/api/v1/standards/${A.id}/source`, { headers: { Authorization: `Bearer dev-${y}` } });
    if (!E.ok) {
      const Ue = await E.json();
      throw new Error(Ue.message || "原件不可用。");
    }
    const w = await E.blob(), K = URL.createObjectURL(w), ke = document.createElement("a");
    ke.href = K, ke.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), ke.click(), setTimeout(() => URL.revokeObjectURL(K), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Te && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Te,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te, onClick: () => Ge((E) => E + 1), children: "刷新列表" })
    ] }),
    W && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: W }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: te, value: d, onChange: (E) => {
          Me() && (I.current++, T(E.target.value), Y(null), D(null), k(!1), H(""), ie(null));
        }, children: f.map((E) => /* @__PURE__ */ s.jsx("option", { value: E.id, children: E.name }, E.id)) })
      ] }),
      ae && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te || !d, onClick: () => {
        Me() && (D(kj(d)), Y(null), g(""), k(!1), G.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te || Ne, onClick: () => Ge((E) => E + 1), children: "刷新" })
    ] }),
    !d && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    Ne ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !q.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        Fe ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      q.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: E.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            E.code,
            " · ",
            E.edition,
            " · 修订 ",
            E.version,
            " · ",
            Nf[E.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            E.valid_from,
            "；",
            E.valid_until ? "自 " + E.valid_until + " 起不再适用" : "未登记废止日期",
            E.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: te, onClick: () => void qe(E), children: "查看与核验" }),
        at && E.source_available === !1 && ["published", "approved", "superseded"].includes(E.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te, onClick: () => {
          Y(E), D(null), Q(!1), ve("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, E.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !le || te, onClick: () => H(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !xe || te, onClick: () => H(xe || ""), children: "下一页" })
      ] })
    ] }) }),
    v && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (E) => {
      E.preventDefault(), Ie(async () => {
        if (!v.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...v, scope: Object.fromEntries(Object.entries(v.scope).map(([ke, Ue]) => [ke, _a(Ue.join(`
`))])), clauses: v.clauses.map((ke) => ({
          ...ke,
          preconditions: _a(ke.preconditions.join(`
`)),
          exceptions: _a(ke.exceptions.join(`
`)),
          tables: _a(ke.tables.join(`
`)),
          notes: _a(ke.notes.join(`
`)),
          references: _a(ke.references.join(`
`))
        })) }, K = await o("/standards", { method: "POST", headers: { "Idempotency-Key": G.current }, body: JSON.stringify(w) });
        Xe(), D(null), Y(await o("/standards/" + K.id)), Ge((ke) => ke + 1), oe("规范草稿已保存，需核验后发布。");
      });
    }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h3", { children: v.expected_version ? "修订规范" : "登记规范" }),
        /* @__PURE__ */ s.jsx("span", { children: "原件和已保存版本保留不变" })
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { className: "proof-body", disabled: te, children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范名称",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: v.title, onChange: (E) => ye({ title: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: v.code, readOnly: v.expected_version > 0, onChange: (E) => ye({ code: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: v.edition, readOnly: v.expected_version > 0, onChange: (E) => ye({ edition: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: v.maintainer, onChange: (E) => ye({ maintainer: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: v.valid_from, onChange: (E) => ye({ valid_from: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: v.valid_until || "", onChange: (E) => ye({ valid_until: E.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (E) => {
            var K;
            const w = (K = E.target.files) == null ? void 0 : K[0];
            w && Ie(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const ke = await o(`/standards/source-files?project_id=${encodeURIComponent(d)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              ye({ source_asset_id: ke.asset_id }), g(w.name), oe("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: re || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: v.scope[E].join(`
`), onChange: (K) => ye({ scope: { ...v.scope, [E]: K.target.value.split(`
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
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: E.number, onChange: (K) => _e(w, { number: K.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: E.chapter, onChange: (K) => _e(w, { chapter: K.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: E.parent_number || "", onChange: (K) => _e(w, { parent_number: K.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: E.page || "", onChange: (K) => _e(w, { page: K.target.value ? Number(K.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: E.locator, onChange: (K) => _e(w, { locator: K.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: E.text, onChange: (K) => _e(w, { text: K.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([K, ke]) => /* @__PURE__ */ s.jsxs("label", { children: [
              ke,
              /* @__PURE__ */ s.jsx("textarea", { value: E[K].join(`
`), onChange: (Ue) => _e(w, { [K]: Ue.target.value.split(`
`) }) })
            ] }, K))
          ] }),
          v.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => ye({ clauses: v.clauses.filter((K, ke) => ke !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: v.clauses.length >= 200, onClick: () => ye({ clauses: [...v.clauses, bu()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: v.reason, onChange: (E) => ye({ reason: E.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !v.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Me() && (D(null), k(!1));
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
          Nf[A.state]
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
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: te || A.source_available === !1, onClick: rt, children: "下载核对原件" }),
          ae && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te || !A.clauses, onClick: tt, children: "以此版本修订" })
        ] }),
        (lt = A.clauses) == null ? void 0 : lt.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
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
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, K]) => E[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: K }),
            E[w].map((ke, Ue) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: ke }, Ue))
          ] }, w))
        ] }, E.number)),
        A.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: X, onChange: (E) => {
              se(E.target.value), ie(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          X === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: we, onChange: (E) => {
              x(E.target.value), ie(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: L[E], onChange: (K) => {
              F({ ...L, [E]: K.target.value }), ie(null);
            } })
          ] }, E)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: te, onClick: () => void Ie(async () => {
            ie(await o(`/standards/${A.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: X, event_date: we || null, ...L }) }));
          }), children: "核对条件" }),
          ee && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[ee.status] }),
            ee.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              ee.missing.map((E) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[E] || E).join("、")
            ] }),
            ee.reasons.map((E) => /* @__PURE__ */ s.jsx("p", { children: E }, E)),
            /* @__PURE__ */ s.jsx("p", { children: ee.note })
          ] })
        ] }),
        Fe && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: te, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: He, maxLength: 2e3, onChange: (E) => ve(E.target.value) })
          ] }),
          A.state === "pending_review" && Oe && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ve, onChange: (E) => Q(E.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            A.state === "draft" && ae && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim(), onClick: () => $e("submit"), children: "提交审核" }),
            A.state === "pending_review" && Oe && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim() || !Ve, onClick: () => $e("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !He.trim(), onClick: () => $e("request_changes"), children: "退回修改" })
            ] }),
            A.state === "approved" && at && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim(), onClick: () => $e("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(A.state) && at && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !He.trim(), onClick: () => $e("withdraw"), children: "撤回此版本" })
          ] }),
          A.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (Re = A.history) == null ? void 0 : Re.map((E, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            Sf[E.action] || E.action,
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
const Ca = { kind: "asset", id: "", quote: "", locator: "" }, Kf = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ca] }, $f = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Wf = { text: "", nature: "fact", evidence: [Ca] }, Ff = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ca] }, Ej = { name: "", value: null, evidence: [Ca] }, wf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [$f] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Kf] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Wf], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [Ff], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ca, kind: "work" }], historical_case_ids: [] }
}, Oj = { evidence: Ca, records: Kf, categories: $f, claims: Wf, steps: Ff, parameters: Ej }, Sa = {
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
}, Tj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function Ji({ value: o, onChange: f, catalog: y, name: d = "", path: T = "content", readonly: q = !1 }) {
  var v;
  const Z = Sa[d] || d;
  if (Array.isArray(o)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: Z }),
    o.map((D, J) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(Ji, { value: D, name: d.endsWith("_ids") ? d.slice(0, -1) : "", path: T + "." + J, catalog: y, readonly: q, onChange: (k) => f(o.map((te, me) => me === J ? k : te)) }),
      !q && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + Z + String(J + 1), onClick: () => f(o.filter((k, te) => J !== te)), children: "移除" })
    ] }, J)),
    !q && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => f([...o, structuredClone(Oj[d] ?? "")]), children: [
      "添加",
      Z
    ] })
  ] });
  if (o !== null && typeof o == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(o).map(([D, J]) => D === "kind" && T === "content" ? null : /* @__PURE__ */ s.jsx(Ji, { name: D, value: J, path: T + "." + D, catalog: y, readonly: q, onChange: (k) => {
    const te = { ...o, [D]: k };
    D === "type" && ["judgment", "case"].includes(String(k)) && (te.options = {}), D === "kind" && "id" in o && (te.id = ""), f(te);
  } }, D)) });
  let A = Tj[d];
  d === "kind" && (A = T.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), d === "nature" && (A = T.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const Y = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (d === "id" || d in Y || d === "historical_case_id") && (A = y.filter((D) => d in Y ? D.work_kind === Y[d] : d === "historical_case_id" ? ["hazard", "compilation"].includes(D.work_kind || "") : !0).map((D) => [D.id, D.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: T, children: [
    /* @__PURE__ */ s.jsx("span", { children: Z || "内容" }),
    q ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((v = A == null ? void 0 : A.find((D) => D[0] === String(o))) == null ? void 0 : v[1]) || String(o ?? "待填") }) : A ? /* @__PURE__ */ s.jsxs("select", { id: T, value: String(o ?? ""), onChange: (D) => f(D.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      A.map(([D, J]) => /* @__PURE__ */ s.jsx("option", { value: D, children: J }, D))
    ] }) : d === "date" || d === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: T, type: "date", value: String(o ?? ""), onChange: (D) => f(D.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: T, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(d) ? 3 : 2, value: String(o ?? ""), onChange: (D) => f(D.target.value === "" && ["parent", "value", "related_event_id"].includes(d) ? null : D.target.value) })
  ] });
}
const kf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, Cf = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function zj({ api: o, projects: f, identity: y }) {
  var E;
  const [d, T] = u.useState(((E = f[0]) == null ? void 0 : E.id) || ""), [q, Z] = u.useState("hazard"), [A, Y] = u.useState([]), [v, D] = u.useState([]), [J, k] = u.useState(null), [te, me] = u.useState(null), [Ne, Se] = u.useState(""), [Te, fe] = u.useState(!1), [W, oe] = u.useState(""), [le, H] = u.useState(""), [xe, ze] = u.useState(!1), [Le, Ge] = u.useState(!1), [He, ve] = u.useState(0), [Ve, Q] = u.useState(null), [re, g] = u.useState(""), [X, se] = u.useState(null), [we, x] = u.useState(null), [L, F] = u.useState(null), [ee, ie] = u.useState(null), G = u.useRef(crypto.randomUUID()), I = u.useRef(0), Ae = u.useRef(!1), ae = f.find((w) => w.id === d), Oe = (w) => {
    var K, ke;
    return ae != null && ae.permissions ? ae.permissions.includes(w) : w.startsWith("training.") ? !!((K = ae == null ? void 0 : ae.roles) != null && K.some((Ue) => ["admin", "teacher"].includes(Ue))) : w === "knowledge.process" ? !!(ae != null && ae.can_run) : !!(ae != null && ae.can_manage) || !!((ke = ae == null ? void 0 : ae.roles) != null && ke.includes("reviewer"));
  }, at = Oe(q === "question" ? "training.manage" : "knowledge.process"), Fe = Oe(q === "question" ? "training.review" : "knowledge.review"), Ie = Oe(q === "question" ? "training.review" : "knowledge.publish"), Xe = at || Fe || Ie, Me = () => {
    var w;
    Ae.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, ye = () => !Ae.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  u.useEffect(() => {
    const w = (K) => {
      Ae.current && (K.preventDefault(), K.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), u.useEffect(() => {
    let w = !1;
    if (Ge(!0), Y([]), oe(""), !d) {
      Ge(!1);
      return;
    }
    return o(`/workflows?project_id=${encodeURIComponent(d)}&kind=${q}&view=${Xe ? "manage" : "published"}${re ? "&cursor=" + encodeURIComponent(re) : ""}`).then((K) => {
      w || (Y(K.items), Q(K.next_cursor));
    }).catch((K) => {
      w || oe(K.message);
    }).finally(() => {
      w || Ge(!1);
    }), Xe && o(`/workflows/catalog?project_id=${encodeURIComponent(d)}`).then((K) => {
      w || D(K.items);
    }).catch((K) => {
      w || oe(K.message);
    }), q === "hazard" && o(`/workflows/hazards/statistics?project_id=${encodeURIComponent(d)}`).then((K) => {
      w || se(K);
    }).catch((K) => {
      w || oe(K.message);
    }), () => {
      w = !0;
    };
  }, [d, q, re, Xe, He]), u.useEffect(() => () => {
    I.current++;
  }, []);
  const _e = async (w) => {
    ze(!0), oe(""), H("");
    try {
      await w();
    } catch (K) {
      oe(K.message);
    } finally {
      ze(!1);
    }
  }, qe = () => {
    I.current++, k(null), me(null), x(null), F(null), ie(null), g(""), Se(""), fe(!1), Me();
  }, tt = async (w) => {
    if (!ye()) return;
    const K = ++I.current;
    await _e(async () => {
      const ke = await o("/workflows/" + w.id);
      K === I.current && (k(ke), me(null), Se(""), fe(!1), F(null), ie(null), Me());
    });
  }, $e = (w) => {
    me((K) => K && { ...K, ...w }), Ae.current = !0, G.current = crypto.randomUUID();
  }, rt = () => _e(async () => {
    if (!te) return;
    const w = await o("/workflows", { method: "POST", headers: { "Idempotency-Key": G.current }, body: JSON.stringify({ ...te, project_id: d, reason: Ne }) });
    k(w), me(null), Me(), ve((K) => K + 1), H("已保存新版本，尚未审核发布。");
  }), je = (w, K) => _e(async () => {
    const ke = await o(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: K, row_version: w.row_version, reason: Ne, evidence_checked: Te }) });
    k(K === "withdraw" ? null : await o("/workflows/" + ke.id)), ve((Ue) => Ue + 1), Me(), H(Cf[K] + "已完成");
  }), lt = (w) => _e(async () => {
    const K = await o(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(d)}&category=${encodeURIComponent(w)}&limit=100`);
    x(K.items);
  }), Re = () => _e(async () => {
    if (!J) return;
    const w = await Dt("/api/v1/workflows/" + J.id + "/export", { headers: { Authorization: "Bearer dev-" + y } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const K = URL.createObjectURL(await w.blob()), ke = document.createElement("a");
    ke.href = K, ke.download = J.title + ".docx", ke.click(), setTimeout(() => URL.revokeObjectURL(K), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: d, disabled: xe, onChange: (w) => {
          ye() && (qe(), T(w.target.value));
        }, children: f.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: () => ve((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(wf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: xe, className: "button " + (q === w ? "primary" : "ghost"), onClick: () => {
      ye() && (qe(), Z(w));
    }, children: Sa[w] }, w)) }),
    W && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: W }),
    le && /* @__PURE__ */ s.jsx("p", { role: "status", children: le }),
    q === "hazard" && X && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "隐患分类分析" }),
      /* @__PURE__ */ s.jsxs("div", { className: "wf-counts", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "事件 ",
          /* @__PURE__ */ s.jsx("strong", { children: X.event_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "检查记录 ",
          /* @__PURE__ */ s.jsx("strong", { children: X.inspection_record_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "项目 ",
          /* @__PURE__ */ s.jsx("strong", { children: X.project_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "来源待核实 ",
          /* @__PURE__ */ s.jsx("strong", { children: X.unavailable_count })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: X.definition }),
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: X.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: xe, onClick: () => lt(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      we && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        we.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => tt(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Sa[q],
          "清单"
        ] }),
        at && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: xe, onClick: () => {
          ye() && (qe(), me({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(wf[q]) }), Ae.current = !0, G.current = crypto.randomUUID());
        }, children: [
          "新建",
          Sa[q]
        ] })
      ] }),
      Le ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : A.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Sa[q],
        "。",
        at ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: A.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: xe || w.source_available === !1, onClick: () => tt(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          kf[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        Ie && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => je(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        re && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(""), children: "首页" }),
        Ve && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(Ve), children: "下一页" })
      ] })
    ] }),
    te && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Sa[q],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: xe, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: te.title, onChange: (w) => $e({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(Ji, { value: te.content, catalog: v, onChange: (w) => $e({ content: w }) })
      ] })
    ] }),
    J && !te && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        J.title,
        " · v",
        J.version,
        " · ",
        kf[J.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        at && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: () => {
          me({ title: J.title, series: J.series, expected_version: J.version, content: structuredClone(J.content) }), Ae.current = !0, G.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe, onClick: Re, children: "导出Word" }),
        Oe("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _e(async () => {
          F((await o(`/workflows/impacts?project_id=${encodeURIComponent(d)}&source_kind=work&source_id=${J.id}`)).items);
        }), children: "查看下游影响" }),
        q === "guide" && J.state === "published" && Oe("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _e(async () => ie(await o("/workflows/" + J.id + "/blueprint"))), children: "考点覆盖" }),
        q === "question" && J.state === "published" && at && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe, onClick: () => _e(async () => {
          await o("/workflows/" + J.id + "/training-bank", { method: "POST" }), H("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      L && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        L.length ? L.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      ee && /* @__PURE__ */ s.jsx("ul", { children: ee.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(Ji, { value: J.content, catalog: v, readonly: !0, onChange: () => {
      } }),
      J.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        J.history.map((w, K) => /* @__PURE__ */ s.jsxs("p", { children: [
          Cf[w.action] || w.action,
          "：",
          w.reason
        ] }, K))
      ] })
    ] }),
    Xe && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: Ne, onChange: (w) => Se(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      te ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim() || !te.title.trim(), onClick: rt, children: "保存草稿" }) : J && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Te, onChange: (w) => fe(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          J.state === "draft" && at && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim(), onClick: () => je(J, "submit"), children: "提交审核" }),
          J.state === "pending_review" && Fe && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Te || !Ne.trim(), onClick: () => je(J, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => je(J, "request_changes"), children: "退回修改" })
          ] }),
          J.state === "approved" && Ie && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: xe || !Ne.trim(), onClick: () => je(J, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(J.state) && Ie && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: xe || !Ne.trim(), onClick: () => je(J, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const Ef = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Aj({ id: o, identity: f, projects: y, navigate: d }) {
  const [T, q] = u.useState(null), [Z, A] = u.useState(""), [Y, v] = u.useState(!1), [D, J] = u.useState(""), [k, te] = u.useState(0), me = `a-import-action:${f}:${o}`;
  async function Ne(fe, W) {
    const oe = await Dt("/integration/v1/a-imports/" + o + fe, W), le = await oe.json().catch(() => ({}));
    if (!oe.ok)
      throw oe.status >= 400 && oe.status < 500 && sessionStorage.removeItem(me), new Error(le.message || `请求未完成（${oe.status}），请刷新查看最新状态。`);
    return le;
  }
  u.useEffect(() => {
    let fe = !1;
    async function W() {
      try {
        const le = await Ne("");
        fe || (q(le), A(""));
      } catch (le) {
        fe || (q(null), A(le.message));
      }
    }
    q(null), W();
    const oe = window.setInterval(W, 3e3);
    return () => {
      fe = !0, clearInterval(oe);
    };
  }, [o, k, f]);
  const Se = (fe) => {
    var W, oe;
    return !!T && !!((oe = (W = y.find((le) => le.id === T.project_id)) == null ? void 0 : W.permissions) != null && oe.includes(fe));
  };
  async function Te(fe) {
    if (!(!T || Y)) {
      v(!0), A("");
      try {
        const W = sessionStorage.getItem(me), oe = W ? JSON.parse(W) : { operation: fe, key: crypto.randomUUID(), body: { expected_version: T.version, ...fe === "withdraw" ? { reason: D.trim() } : {} } };
        if (oe.operation !== fe) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(me, JSON.stringify(oe)), await Ne("/" + fe, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": oe.key }, body: JSON.stringify(oe.body) }), sessionStorage.removeItem(me), te((le) => le + 1);
      } catch (W) {
        A(W.message);
      } finally {
        v(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => te((fe) => fe + 1), disabled: Y, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      Z && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: Z }),
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
            /* @__PURE__ */ s.jsx("dd", { children: Ef[T.status] || T.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Ef[T.retrospective_status] || T.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          T.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        T.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: T.error.message }),
        T.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: T.warnings.map((fe, W) => /* @__PURE__ */ s.jsx("li", { children: fe.message }, fe.code + ":" + W)) })
        ] }),
        T.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          T.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          T.capabilities.can_view_materials && T.receipt_id && Se("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => d("/task-packages/" + T.receipt_id), children: "查看原始资料" }),
          T.capabilities.can_generate_retrospective && Se("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Y, onClick: () => void Te("retrospectives"), children: T.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          T.retrospective_id && T.status !== "withdrawn" && Se("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => d("/retrospectives/" + T.retrospective_id), children: "查看复盘" }),
          (T.status === "failed" || T.retrospective_status === "failed") && Se("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Y, onClick: () => void Te("retry"), children: "重试失败任务" })
        ] }),
        T.status !== "withdrawn" && Se("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: D, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (fe) => J(fe.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Y || !D.trim(), onClick: () => void Te("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: Z ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Rj({ navigate: o }) {
  const [f, y] = u.useState([]), [d, T] = u.useState(""), [q, Z] = u.useState(!1);
  return u.useEffect(() => {
    let A = !1;
    return (async () => {
      try {
        const [Y, v, D] = await Promise.all([Dt("/api/v1/health"), Dt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!Y.ok || !v.ok || !D.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [J, k, te] = await Promise.all([Y.json(), v.json(), D.json()]), me = window.QaxcProjectId, Ne = te.tasks.filter((Se) => !me || Se.projectId === me).flatMap((Se) => (Se.events || []).map((Te) => ({ id: Te.id, action: Se.title + " · " + Te.action, project_id: Se.projectId, created_at: Te.uploadedAt, source: "现场作业" })));
        A || (Z(J.worker_online), y([...Ne, ...k.items.map((Se) => ({ ...Se, source: "知识与学习" }))].sort((Se, Te) => Date.parse(Te.created_at) - Date.parse(Se.created_at)).slice(0, 100)));
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
      q ? "在线" : "未连接或正在读取",
      "。成果接入、知识发布与资料处理共用后台任务队列。"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", style: { margin: "20px 0", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/jobs"), children: "处理任务与重试" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => o("/settings/models"), children: "模型配置" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => o("/task-packages"), children: "成果与证据" })
    ] }),
    d ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: d }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("h3", { children: "最近操作" }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。" }),
      f.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "业务" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: f.map((A) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(A.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: A.source }),
          /* @__PURE__ */ s.jsx("td", { children: A.action })
        ] }, A.source + A.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function Uj({ deliveryId: o, navigate: f }) {
  const [y, d] = u.useState(!1), [T, q] = u.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), Z = u.useRef(!0);
  u.useEffect(() => (Z.current = !0, () => {
    Z.current = !1;
  }), []);
  async function A(v, D, J) {
    const k = await Dt("/api/v1" + v, { method: D ? "POST" : "GET", headers: { "Content-Type": "application/json", ...J ? { "Idempotency-Key": J } : {} }, body: D ? JSON.stringify(D) : void 0 }), te = await k.json();
    if (!k.ok) throw Error(te.message || "处理失败，请重试");
    return te;
  }
  async function Y() {
    if (y) return;
    d(!0);
    const v = "archive-review:" + o, D = sessionStorage.getItem(v) || crypto.randomUUID();
    sessionStorage.setItem(v, D);
    try {
      q("正在核验归档成果…");
      const J = await A("/platform-archives", { delivery_id: o }, D);
      for (let k = 0; k < 60 && Z.current; k++) {
        const te = await A("/task-packages/" + J.receipt_id);
        if (!Z.current) return;
        if (te.status === "ready") {
          q("证据已校验，正在生成复盘…");
          const me = await A("/retrospectives", { mode: "task_process", task_package_id: te.id });
          Z.current && f("/retrospectives/" + me.id);
          return;
        }
        if (["failed", "withdrawn"].includes(te.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        q("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((me) => setTimeout(me, 1e3));
      }
      Z.current && q("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (J) {
      Z.current && q(J.message);
    } finally {
      Z.current && d(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: T }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: y, onClick: () => void Y(), children: "生成 / 打开复盘" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => f("/task-packages"), children: "成果处理清单" })
    ] })
  ] });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dj = (o) => o.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Mj = (o) => o.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (f, y, d) => d ? d.toUpperCase() : y.toLowerCase()
), Of = (o) => {
  const f = Mj(o);
  return f.charAt(0).toUpperCase() + f.slice(1);
}, If = (...o) => o.filter((f, y, d) => !!f && f.trim() !== "" && d.indexOf(f) === y).join(" ").trim(), qj = (o) => {
  for (const f in o)
    if (f.startsWith("aria-") || f === "role" || f === "title")
      return !0;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Hj = {
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
const Bj = u.forwardRef(
  ({
    color: o = "currentColor",
    size: f = 24,
    strokeWidth: y = 2,
    absoluteStrokeWidth: d,
    className: T = "",
    children: q,
    iconNode: Z,
    ...A
  }, Y) => u.createElement(
    "svg",
    {
      ref: Y,
      ...Hj,
      width: f,
      height: f,
      stroke: o,
      strokeWidth: d ? Number(y) * 24 / Number(f) : y,
      className: If("lucide", T),
      ...!q && !qj(A) && { "aria-hidden": "true" },
      ...A
    },
    [
      ...Z.map(([v, D]) => u.createElement(v, D)),
      ...Array.isArray(q) ? q : [q]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gt = (o, f) => {
  const y = u.forwardRef(
    ({ className: d, ...T }, q) => u.createElement(Bj, {
      ref: q,
      iconNode: f,
      className: If(
        `lucide-${Dj(Of(o))}`,
        `lucide-${o}`,
        d
      ),
      ...T
    })
  );
  return y.displayName = Of(o), y;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], Tf = gt("activity", Lj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], zf = gt("arrow-left", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], _l = gt("arrow-right", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], Ki = gt("book-open", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qj = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Zj = gt("chevron-down", Qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Ws = gt("chevron-right", Vj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Kj = gt("chevron-up", Jj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $j = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Nl = gt("circle-alert", $j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Sl = gt("circle-check", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
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
], Ij = gt("clipboard-list", Fj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pj = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], du = gt("database", Pj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Af = gt("download", ev);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tv = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], sv = gt("external-link", tv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lv = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], On = gt("file-check-2", lv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], Rf = gt("file-input", av);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], hu = gt("file-search", nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iv = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Xi = gt("folder-lock", iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cv = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], rv = gt("history", cv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uv = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
], ov = gt("image", uv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dv = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Uf = gt("layout-dashboard", dv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Df = gt("loader-circle", hv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
], mv = gt("pencil", fv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], Mf = gt("play", xv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jv = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], vv = gt("plus", jv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Rs = gt("refresh-cw", pv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], bv = gt("search", gv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yv = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], qf = gt("shield-check", yv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _v = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], Pf = gt("upload", _v);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nv = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], Sv = gt("users", Nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Vi = gt("x", wv), ws = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, wn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Hf = (o) => o ? new Date(o).toLocaleString("zh-CN") : "尚未同步", Bf = (o) => {
  const f = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], y = (d) => f.includes(d) ? f.indexOf(d) : 100;
  return Object.entries(o).sort(([d], [T]) => y(d) - y(T));
}, fu = (o) => typeof o == "object" ? JSON.stringify(o, null, 2) : String(o ?? "—");
function kv({ asset: o, identity: f }) {
  const [y, d] = u.useState(""), [T, q] = u.useState("");
  return u.useEffect(() => {
    let Z = !1, A = "";
    return Dt(`/api/v1/assets/${o}/content`, { headers: { Authorization: `Bearer dev-${f}` } }).then(async (Y) => {
      if (!Y.ok) throw new Error("图片不可访问或已撤回");
      return Y.blob();
    }).then((Y) => {
      A = URL.createObjectURL(Y), Z ? URL.revokeObjectURL(A) : d(A);
    }).catch((Y) => {
      Z || q(Y.message);
    }), () => {
      Z = !0, A && URL.revokeObjectURL(A);
    };
  }, [o, f]), T ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: T }) : y ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: y, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function Cv({ api: o, path: f, navigate: y, projects: d, identity: T }) {
  var it, vt;
  const [q, Z] = u.useState([]), [A, Y] = u.useState([]), [v, D] = u.useState([]), [J, k] = u.useState([]), [te, me] = u.useState("reports"), Ne = u.useRef(0), [Se, Te] = u.useState(""), [fe, W] = u.useState([]), [oe, le] = u.useState(null), [H, xe] = u.useState(""), [ze, Le] = u.useState(!1), [Ge, He] = u.useState([]), [ve, Ve] = u.useState({}), [Q, re] = u.useState(0), [g, X] = u.useState(null), [se, we] = u.useState(null), [x, L] = u.useState(null), [F, ee] = u.useState(new URLSearchParams(location.search).get("source") || ""), [ie, G] = u.useState(""), [I, Ae] = u.useState(!1), [ae, Oe] = u.useState(""), [at, Fe] = u.useState(""), [Ie, Xe] = u.useState(!0), [Me, ye] = u.useState(!1), [_e, qe] = u.useState(0), [tt, $e] = u.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [rt, je] = u.useState(""), [lt, Re] = u.useState(null), [E, w] = u.useState([]), [K, ke] = u.useState(""), [Ue, st] = u.useState(0), [ut, R] = u.useState(!1), [de, ne] = u.useState("csv"), [Je, b] = u.useState(""), [be, pe] = u.useState(""), [Ye, xt] = u.useState(((it = d.find((c) => c.can_run)) == null ? void 0 : it.id) || (Ot ? "" : "demo-airport")), M = d.some((c) => c.can_run), j = f.startsWith("/records/"), ce = f.startsWith("/imports/") && f !== "/imports/new", ge = q.find((c) => c.id === F), nt = A.filter((c) => c.kind === (ge == null ? void 0 : ge.kind) && c.project_id === (ge == null ? void 0 : ge.project_id));
  u.useEffect(() => {
    je(""), w([]), ke(""), st(0), Oe(""), Fe(""), L(null);
  }, [f]), u.useEffect(() => {
    let c = !1;
    Xe(!0), Oe(""), we(null), X(null);
    const S = new URLSearchParams(Object.entries(tt).filter(([, Pe]) => !!Pe));
    S.set("limit", "15"), rt && S.set("cursor", rt);
    async function ue() {
      try {
        const [Pe, m] = await Promise.all([o("/sources?limit=100"), o("/input-files")]);
        if (c) return;
        if (Z(Pe.items), Y(m.items), f === "/sources" || f === "/imports") {
          const Ce = await o("/imports?limit=15" + (rt ? "&cursor=" + encodeURIComponent(rt) : ""));
          if (c) return;
          D(Ce.items), Re(Ce.next_cursor);
        } else if (ce) {
          const Ce = await o(`${f}?after_row=${Ue}&only_issues=${ut}`);
          c || X(Ce);
        } else if (j) {
          const Ce = await o(f + (K ? "?version=" + K : ""));
          c || we(Ce);
        } else if (f === "/records") {
          const Ce = await o("/records?" + S);
          if (c) return;
          if (He(Ce.items), Re(Ce.next_cursor), Ve(Ce.totals_by_kind), re(Ce.detail_groups_after_confirmed_links), te === "reports") {
            const Ee = new URLSearchParams(S);
            Ee.delete("cursor"), rt && Ee.set("after_id", rt);
            const Ze = await o("/reports?" + Ee);
            if (c) return;
            k(Ze.items), Re(Ze.next_cursor);
          }
        }
      } catch (Pe) {
        c || Oe(Pe.message);
      } finally {
        c || Xe(!1);
      }
    }
    return ue(), () => {
      c = !0;
    };
  }, [f, tt, rt, K, _e, Ue, ut, te]), u.useEffect(() => {
    if (!ce || !g || !["queued", "running"].includes(g.status)) return;
    let c = !1;
    const S = setInterval(() => {
      o(`${f}?after_row=${Ue}&only_issues=${ut}`).then((ue) => {
        c || X(ue);
      }).catch((ue) => {
        c || Oe(ue.message);
      });
    }, 1500);
    return () => {
      c = !0, clearInterval(S);
    };
  }, [f, g == null ? void 0 : g.status, Ue, ut]), u.useEffect(() => {
    Ne.current++, Te(""), W([]), le(null), xe("");
  }, [tt, te, f]);
  const _ = async (c, S = !1) => {
    const ue = ++Ne.current;
    if (!S && Se === c) {
      Te(""), Le(!1);
      return;
    }
    S || (W([]), le(null)), Te(c), Le(!0), xe("");
    const Pe = new URLSearchParams(Object.entries(tt).filter(([, m]) => !!m));
    Pe.set("document_id", c), Pe.set("limit", "15"), S && oe && Pe.set("cursor", oe);
    try {
      const m = await o("/records?" + Pe);
      if (ue !== Ne.current) return;
      W((Ce) => S ? [...Ce, ...m.items] : m.items), le(m.next_cursor);
    } catch (m) {
      ue === Ne.current && xe(m.message);
    } finally {
      ue === Ne.current && Le(!1);
    }
  }, he = async (c) => {
    ye(!0), Oe(""), Fe("");
    try {
      await c();
    } catch (S) {
      Oe(S.message);
    } finally {
      ye(!1);
    }
  }, Qe = () => he(async () => {
    for (const c of d.filter((S) => S.can_run))
      for (const S of c.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const ue = `mock-${c.id}-${S}`;
        q.some((Pe) => Pe.namespace === ue && Pe.project_id === c.id) || await o("/sources", { method: "POST", body: JSON.stringify({ name: `${c.id === "demo-airport" ? "机场" : "地铁"} · ${ws[S]}（模拟）`, namespace: ue, kind: S, project_id: c.id, mapping_template: S === "governance_export" ? "governance-v1" : `${S}-v1` }) });
      }
    Fe("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), qe((c) => c + 1);
  }), kt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !E.length, onClick: () => {
        je(E.at(-1) || ""), w(E.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !lt, onClick: () => {
        w([...E, rt]), je(lt || "");
      }, children: "下一页" })
    ] })
  ] }), Mt = (c, S) => {
    $e({ ...tt, [c]: S }), je(""), w([]);
  }, Tt = (c) => he(async () => {
    const S = await Dt(`/api/v1/assets/${c}/content`, { headers: { Authorization: `Bearer dev-${T}` } });
    if (!S.ok) {
      const m = await S.json();
      throw new Error(m.message);
    }
    const ue = URL.createObjectURL(await S.blob()), Pe = document.createElement("a");
    Pe.href = ue, Pe.download = "来源文件", Pe.click(), URL.revokeObjectURL(ue);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(du, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ot ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ae && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      ae,
      /* @__PURE__ */ s.jsx("button", { onClick: () => qe((c) => c + 1), children: "重新加载" })
    ] }),
    at && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      at
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: f === "/sources" ? "selected" : "", onClick: () => y("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: f.startsWith("/imports") ? "selected" : "", onClick: () => y("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: f.startsWith("/records") ? "selected" : "", onClick: () => y("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => qe((c) => c + 1), disabled: Ie, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ie ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : f === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Me || !M, onClick: () => void Qe(), children: [
          /* @__PURE__ */ s.jsx(du, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: q.map((c) => {
        var S, ue;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(du, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: ws[c.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: c.name }),
          /* @__PURE__ */ s.jsx("p", { children: (S = d.find((Pe) => Pe.id === c.project_id)) == null ? void 0 : S.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: c.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Hf(c.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: c.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((ue = d.find((Pe) => Pe.id === c.project_id)) != null && ue.can_run), onClick: () => {
            ee(c.id), G(""), y("/imports/new?source=" + c.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] })
        ] }, c.id);
      }) }),
      !q.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(hu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      M && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Ot || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Je, onChange: (c) => b(c.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: be, onChange: (c) => pe(c.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: de, onChange: (c) => ne(c.target.value), children: ["csv", "excel", "governance_export"].map((c) => /* @__PURE__ */ s.jsx("option", { value: c, children: ws[c] }, c)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Ye, onChange: (c) => xt(c.target.value), children: d.filter((c) => c.can_run).map((c) => /* @__PURE__ */ s.jsx("option", { value: c.id, children: c.name }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Me || !Je || !be, onClick: () => void he(async () => {
          await o("/sources", { method: "POST", body: JSON.stringify({ name: Je, namespace: be, kind: de, project_id: Ye, mapping_template: de === "governance_export" ? "governance-v1" : `${de}-v1` }) }), qe((c) => c + 1), Fe("来源已创建。");
        }), children: "创建来源" })
      ] })
    ] }) : f === "/imports/new" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel import-form", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "新建历史项目" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择来源 → 预览映射与异常 → 后台增量接入" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "数据来源",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: F, onChange: (c) => {
                ee(c.target.value), G(""), L(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                q.filter((c) => {
                  var S;
                  return (S = d.find((ue) => ue.id === c.project_id)) == null ? void 0 : S.can_run;
                }).map((c) => /* @__PURE__ */ s.jsx("option", { value: c.id, children: c.name }, c.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ie, onChange: (c) => {
                G(c.target.value), L(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                nt.map((c) => /* @__PURE__ */ s.jsx("option", { value: c.asset_id, children: c.label }, c.asset_id))
              ] })
            ] })
          ] }),
          !Ot && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: I, onChange: (c) => Ae(c.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Ot && ge && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Me, accept: ge.kind === "csv" ? ".csv" : ge.kind === "excel" ? ".xlsx" : ".json", onChange: (c) => {
                var ue;
                const S = (ue = c.target.files) == null ? void 0 : ue[0];
                c.target.value = "", S && he(async () => {
                  if (S.size > 5e6) throw new Error("文件不能超过5MB");
                  const Pe = new Uint8Array(await S.arrayBuffer());
                  let m = "";
                  for (let Ee = 0; Ee < Pe.length; Ee += 8192) m += String.fromCharCode(...Pe.subarray(Ee, Ee + 8192));
                  const Ce = await o("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: ge.project_id, kind: ge.kind, name: S.name, base64: btoa(m) }) });
                  Y((Ee) => [...Ee, Ce]), G(Ce.asset_id), L(null), Fe("文件已上传，请预览字段与异常后提交接入。");
                });
              } })
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "项目ID：",
              ge.project_id,
              "。文件必须保留稳定记录ID、报告ID和项目ID；记录类型为detail、review或summary。"
            ] }),
            /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsx("summary", { children: "查看所需表头" }),
              /* @__PURE__ */ s.jsx("p", { children: Object.values(ge.mapping).join("、") })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Me || !F || !ie, onClick: () => void he(async () => {
            L(await o("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: F, input_asset_id: ie }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(hu, { size: 16 }),
            "预览字段与异常"
          ] })
        ] })
      ] }),
      x && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "输入记录" }),
            /* @__PURE__ */ s.jsx("strong", { children: x.total })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "原始字段" }),
            /* @__PURE__ */ s.jsx("strong", { children: x.raw_columns.length })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "需核查行" }),
            /* @__PURE__ */ s.jsx("strong", { children: x.warning_rows })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "不能接入行" }),
            /* @__PURE__ */ s.jsx("strong", { children: x.failed_rows })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "字段映射" }),
            /* @__PURE__ */ s.jsx("span", { children: "未映射字段仍完整保留在原始字段中" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(x.mapping).map(([c, S]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: S }),
            /* @__PURE__ */ s.jsx(_l, { size: 13 }),
            /* @__PURE__ */ s.jsx("strong", { children: c })
          ] }, c)) })
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
            /* @__PURE__ */ s.jsx("tbody", { children: x.preview.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                c.row_number,
                /* @__PURE__ */ s.jsx("small", { children: c.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: fu(c.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: ws[String(c.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...c.errors, ...c.issues].join("；") || "通过" })
            ] }, c.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Me, onClick: () => void he(async () => {
              const c = await o("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: F, input_asset_id: ie, input_hash: x.input_hash, fail_after: !Ot && I ? 2 : null }) });
              y("/imports/" + c.id);
            }), children: [
              /* @__PURE__ */ s.jsx(Pf, { size: 16 }),
              Me ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : f === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !M, onClick: () => y("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(_l, { size: 15 })
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
        /* @__PURE__ */ s.jsx("tbody", { children: v.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: c.source_name }),
            /* @__PURE__ */ s.jsx("small", { children: Hf(c.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: wn[c.status] }),
          ["created", "updated", "skipped", "failed"].map((S) => /* @__PURE__ */ s.jsx("td", { children: c.counts[S] }, S)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/imports/" + c.id), children: "查看历史项目" }) })
        ] }, c.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      kt
    ] }) : ce && g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => y("/imports"), children: [
        /* @__PURE__ */ s.jsx(zf, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: wn[g.status] }),
          /* @__PURE__ */ s.jsx("h2", { children: g.source.name }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "已处理 ",
            g.counts.processed,
            " / ",
            g.counts.total,
            " 条 · ",
            g.progress,
            "%"
          ] })
        ] }),
        g.job_status === "failed" && ((vt = d.find((c) => c.id === g.source.project_id)) == null ? void 0 : vt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Me, onClick: () => void he(async () => {
          await o(`/jobs/${g.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: g.row_version }) }), qe((c) => c + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      g.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: g.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((c) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: c === "failed" ? "失败行" : wn[c] }),
        /* @__PURE__ */ s.jsx("strong", { children: g.counts[c] })
      ] }, c)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-meta", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "实际输入SHA-256" }),
          /* @__PURE__ */ s.jsx("code", { children: g.input_hash })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "规则版本" }),
          /* @__PURE__ */ s.jsx("strong", { children: g.rule_version })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "记录类型" }),
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(g.counts.kinds || {}).map(([c, S]) => `${ws[c]} ${S}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ut, onChange: (c) => {
              R(c.target.checked), st(0);
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
          /* @__PURE__ */ s.jsx("tbody", { children: g.rows.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: c.row_number }),
            /* @__PURE__ */ s.jsx("td", { children: c.outcome === "failed" ? "失败" : wn[c.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: c.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: c.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/records/" + c.record_id), children: "查看证据" }) })
          ] }, c.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !Ue, onClick: () => st(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !g.next_row, onClick: () => st(g.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : f === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((c) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            ws[c],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: ve[c] || 0 })
        ] }, c)),
        /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsx("span", { children: "确认关联后的明细组" }),
          /* @__PURE__ */ s.jsx("strong", { children: Q }),
          /* @__PURE__ */ s.jsx("small", { children: "仅合并已确认关系，非独立隐患结论" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "record-filters", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: tt.project_id, onChange: (c) => Mt("project_id", c.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              d.map((c) => /* @__PURE__ */ s.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: tt.source_id, onChange: (c) => Mt("source_id", c.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              q.map((c) => /* @__PURE__ */ s.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: tt.record_kind, onChange: (c) => Mt("record_kind", c.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((c) => /* @__PURE__ */ s.jsx("option", { value: c, children: ws[c] }, c))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: tt.quality_status, onChange: (c) => Mt("quality_status", c.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: tt.from_date, onChange: (c) => Mt("from_date", c.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: tt.to_date, onChange: (c) => Mt("to_date", c.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": te === "reports", onClick: () => {
            me("reports"), je(""), w([]), Te("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": te === "rows", onClick: () => {
            me("rows"), je(""), w([]);
          }, children: "逐条数据" })
        ] }),
        te === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: J.length ? J.map((c) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": Se === c.id, onClick: () => void _(c.id), children: [
            /* @__PURE__ */ s.jsx(hu, { size: 20 }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: c.title }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                c.source_name,
                " · ",
                c.report_id
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              c.count,
              " 条风险数据"
            ] }),
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] }),
          Se === c.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            H && /* @__PURE__ */ s.jsx("p", { role: "alert", children: H }),
            ze ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : fe.map((S) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => y("/records/" + S.id), children: S.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                ws[S.record_kind],
                " · v",
                S.current_version
              ] })
            ] }, S.id)),
            oe && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: ze, onClick: () => void _(c.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, c.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Ge.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ge.map((c) => {
            var S;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => y("/records/" + c.id), children: c.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (S = q.find((ue) => ue.id === c.source_id)) == null ? void 0 : S.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: ws[c.record_kind] }),
              /* @__PURE__ */ s.jsx("td", { children: c.occurred_on || "未知" }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: `status ${c.quality_status === "valid" ? "succeeded" : "retrying"}`, children: c.quality_status === "valid" ? "通过" : "需核查" }) }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                "v",
                c.current_version
              ] })
            ] }, c.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的记录" }),
          /* @__PURE__ */ s.jsx("p", { children: "调整筛选条件，或先完成一批资料接入。" })
        ] }),
        kt
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : j && se ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => y("/records"), children: [
        /* @__PURE__ */ s.jsx(zf, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            ws[se.record_kind],
            " · ",
            Ot ? "来源记录" : "模拟记录"
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: se.description || "缺少描述" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            se.source.name,
            " · ",
            se.external_record_id
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "查看版本",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: se.selected_version, onChange: (c) => ke(c.target.value), children: se.versions.map((c) => /* @__PURE__ */ s.jsxs("option", { value: c.version, children: [
            "v",
            c.version,
            c.version === se.current_version ? " · 当前" : ""
          ] }, c.version)) })
        ] })
      ] }),
      se.issues.length > 0 && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: se.issues.join("；") }),
      /* @__PURE__ */ s.jsxs("div", { className: "record-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源原始字段" }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Object.keys(se.raw_fields).length,
              "个字段 · 完整保留"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Bf(se.raw_fields).map(([c, S]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: c }),
            /* @__PURE__ */ s.jsx("dd", { children: fu(S) })
          ] }, c)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Bf(se.effective_fields).map(([c, S]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: c }),
            /* @__PURE__ */ s.jsx("dd", { children: fu(S) })
          ] }, c)) }),
          /* @__PURE__ */ s.jsxs("details", { className: "provenance", children: [
            /* @__PURE__ */ s.jsx("summary", { children: "来源定位 / 人工修订 / 内容版本" }),
            /* @__PURE__ */ s.jsx("pre", { children: JSON.stringify(se.provenance, null, 2) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "report-note", children: [
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "原报告：",
              se.document.report_id
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: se.document.note })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel evidence-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "证据与图片关系" }),
          /* @__PURE__ */ s.jsx("span", { children: "确定锚点与候选关联分别标识" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "evidence-grid", children: se.evidence.map((c) => {
          var S;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: ws[c.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: c.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(c.locator) }),
            c.type !== "source_row" && c.asset_id ? /* @__PURE__ */ s.jsx(kv, { asset: c.asset_id, identity: T }) : c.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            c.asset_id && ((S = d.find((ue) => ue.id === se.project_id)) == null ? void 0 : S.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Me, onClick: () => void Tt(c.asset_id), children: "下载对应来源文件" })
          ] }, c.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        se.links.length ? se.links.map((c) => {
          var S;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: wn[c.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/records/" + c.other_record_id), children: "打开另一条记录" }),
            ((S = d.find((ue) => ue.id === se.project_id)) == null ? void 0 : S.roles.some((ue) => ["admin", "reviewer"].includes(ue))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Me || c.review_state === "stale", onClick: () => void he(async () => {
                await o(`/record-links/${c.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: c.row_version, decision: "confirmed" }) }), qe((ue) => ue + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Me || c.review_state === "stale", onClick: () => void he(async () => {
                await o(`/record-links/${c.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: c.row_version, decision: "rejected" }) }), qe((ue) => ue + 1);
              }), children: "排除" })
            ] })
          ] }, c.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ae ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const Fs = "/history-review", zn = "/history-reader", em = "historyReview.visibleColumnsV2", tm = "historyReview.columnOrder", yu = "historyReview.columnWidths", sm = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], kn = ["_photos", "_source", "_status", "_actions"], mu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], Eu = { _actions: "操作", _photos: "照片", _source: "来源报告", _status: "状态" }, xu = Object.keys(Eu), lm = [...sm, "_photos", "_source", "_status", "_actions"], $i = [...sm, "_photos", "_source", "_actions"], ju = {
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
    const o = localStorage.getItem(em), f = o ? JSON.parse(o) : null;
    return Array.isArray(f) && f.length ? f.filter((y) => typeof y == "string") : $i;
  } catch {
    return $i;
  }
}
function Tv() {
  try {
    const o = localStorage.getItem(yu), f = o ? JSON.parse(o) : null;
    if (f && typeof f == "object") {
      const y = {};
      for (const [d, T] of Object.entries(f))
        typeof T == "number" && T >= 56 && T <= 1e3 && (y[d] = T);
      return y;
    }
  } catch {
  }
  return {};
}
function zv() {
  try {
    const o = localStorage.getItem(tm), f = o ? JSON.parse(o) : null;
    if (Array.isArray(f) && f.length) return f.filter((y) => typeof y == "string");
  } catch {
  }
  return lm;
}
function Av(o, f) {
  const y = o.filter((T) => f.includes(T) || xu.includes(T));
  let d = y.findIndex((T) => xu.includes(T));
  d < 0 && (d = y.length);
  for (const T of f)
    y.includes(T) || (y.splice(d, 0, T), d += 1);
  for (const T of xu) {
    if (y.includes(T)) continue;
    const q = y.indexOf("_actions");
    q >= 0 ? y.splice(q, 0, T) : y.push(T);
  }
  return y;
}
function Xt(o, f = 120) {
  const y = (o || "").replace(/\s+/g, " ").trim();
  return y.length > f ? y.slice(0, f) + "…" : y || "—";
}
function Yl(o, f) {
  var y;
  return Eu[f] || ((y = o.find((d) => d.key === f)) == null ? void 0 : y.label) || f;
}
function Lf(o, f) {
  return o ? Object.entries(o).map(([y, d]) => `${Yl(f, y)}：${Xt(d, 30)}`).join("；") : "—";
}
function _u({ id: o }) {
  const [f, y] = u.useState(""), [d, T] = u.useState("");
  return u.useEffect(() => {
    let q = !1, Z = "";
    return Dt("/api/v1" + zn + "/images/" + encodeURIComponent(o)).then(async (A) => {
      if (!A.ok) throw Error("图片暂不可用");
      return A.blob();
    }).then((A) => {
      Z = URL.createObjectURL(A), q ? URL.revokeObjectURL(Z) : y(Z);
    }).catch((A) => {
      q || T(A.message);
    }), () => {
      q = !0, Z && URL.revokeObjectURL(Z);
    };
  }, [o]), d ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: d }) : f ? /* @__PURE__ */ s.jsx("a", { href: f, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: f, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function Yf({ api: o, findingId: f, large: y = !1 }) {
  const [d, T] = u.useState(null), [q, Z] = u.useState("");
  return u.useEffect(() => {
    let A = !1;
    return T(null), Z(""), o(zn + "/findings/" + encodeURIComponent(f)).then((Y) => {
      A || T(Y.images);
    }).catch((Y) => {
      A || (Z(Y.message), T([]));
    }), () => {
      A = !0;
    };
  }, [o, f]), q ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: q }) : d ? d.length ? /* @__PURE__ */ s.jsx("div", { className: y ? "history-images history-images-large" : "history-images", children: d.map((A, Y) => /* @__PURE__ */ s.jsxs("figure", { children: [
    /* @__PURE__ */ s.jsx(_u, { id: A.id }),
    /* @__PURE__ */ s.jsxs("figcaption", { children: [
      Xt(A.relation, 24),
      "｜",
      JSON.stringify(A.locator)
    ] })
  ] }, A.id + ":" + Y)) }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "该条目没有已关联的照片（无照片不代表原报告没有照片）。" }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "读取关联照片…" });
}
function Rv({ api: o }) {
  const [f, y] = u.useState(null), [d, T] = u.useState([]), [q, Z] = u.useState("findings"), [A, Y] = u.useState([]), [v, D] = u.useState([]), [J, k] = u.useState([]), [te, me] = u.useState([]), [Ne, Se] = u.useState(Ov), [Te, fe] = u.useState(zv), [W, oe] = u.useState(Tv), [le, H] = u.useState(""), [xe, ze] = u.useState(""), [Le, Ge] = u.useState(!1), [He, ve] = u.useState(""), [Ve, Q] = u.useState(""), [re, g] = u.useState(""), [X, se] = u.useState(""), [we, x] = u.useState(0), [L, F] = u.useState(!1), [ee, ie] = u.useState(!1), [G, I] = u.useState([]), [Ae, ae] = u.useState(/* @__PURE__ */ new Set()), [Oe, at] = u.useState(!1), [Fe, Ie] = u.useState(null), [Xe, Me] = u.useState({}), [ye, _e] = u.useState(null), [qe, tt] = u.useState(""), [$e, rt] = u.useState(null), [je, lt] = u.useState(""), [Re, E] = u.useState(""), [w, K] = u.useState(!0), [ke, Ue] = u.useState(!1), [st, ut] = u.useState(0), R = (f == null ? void 0 : f.editable_fields) || (f == null ? void 0 : f.fields) || [], de = (f == null ? void 0 : f.fields) || R, ne = u.useMemo(() => Te.filter((c) => Ne.includes(c)), [Te, Ne]), Je = R.length + kn.length, b = Ne.filter((c) => R.some((S) => S.key === c) || kn.includes(c)).length;
  u.useEffect(() => {
    if ((!ye || Fe) && !$e) return;
    const c = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const S = (ue) => {
      ue.key === "Escape" && (_e(null), rt(null));
    };
    return window.addEventListener("keydown", S), () => {
      document.body.style.overflow = c, window.removeEventListener("keydown", S);
    };
  }, [ye, Fe, $e]), u.useEffect(() => {
    let c = !1;
    return K(!0), E(""), Promise.all([
      o(Fs + "/summary"),
      o(Fs + "/projects?limit=800"),
      o(Fs + "/drafts?limit=100")
    ]).then(([S, ue, Pe]) => {
      c || (y(S), T(ue.items), k(Pe.items), Se((m) => {
        const Ce = /* @__PURE__ */ new Set([...S.editable_fields.map((Ze) => Ze.key), ...kn]), Ee = m.filter((Ze) => Ce.has(Ze));
        return Ee.length ? Ee : $i.filter((Ze) => Ce.has(Ze));
      }), fe((m) => Av(m, S.editable_fields.map((Ce) => Ce.key))));
    }).catch((S) => {
      c || E(S.message);
    }).finally(() => {
      c || K(!1);
    }), () => {
      c = !0;
    };
  }, [o, st]), u.useEffect(() => {
    if (q !== "findings") return;
    let c = !1;
    return K(!0), E(""), o(Fs + "/findings?" + new URLSearchParams({
      q: X,
      project: He,
      document_id: Ve,
      offset: String(we),
      limit: "30"
    })).then((S) => {
      c || (Y(ee ? S.items.filter((ue) => ue.draft_id) : S.items), F(S.has_more));
    }).catch((S) => {
      c || E(S.message);
    }).finally(() => {
      c || K(!1);
    }), () => {
      c = !0;
    };
  }, [o, q, X, He, Ve, we, ee, st]), u.useEffect(() => {
    if (q !== "reports") return;
    let c = !1;
    return K(!0), E(""), o(Fs + "/reports?" + new URLSearchParams({ q: X, project: He, offset: "0", limit: "100" })).then((S) => {
      c || (D(S.items), F(!1));
    }).catch((S) => {
      c || E(S.message);
    }).finally(() => {
      c || K(!1);
    }), () => {
      c = !0;
    };
  }, [o, q, X, He, st]), u.useEffect(() => {
    if (q !== "logs") return;
    let c = !1;
    return K(!0), E(""), o(Fs + "/logs?limit=100").then((S) => {
      c || me(S.items);
    }).catch((S) => {
      c || E(S.message);
    }).finally(() => {
      c || K(!1);
    }), () => {
      c = !0;
    };
  }, [o, q, st]), u.useEffect(() => {
    Oe && ae(new Set(A.map((c) => c.id)));
  }, [A, Oe]);
  function be(c) {
    Se(c);
    try {
      localStorage.setItem(em, JSON.stringify(c));
    } catch {
    }
  }
  function pe(c) {
    be(Ne.filter((S) => S !== c));
  }
  function Ye(c, S) {
    const ue = S ? [...Ne, c] : Ne.filter((Pe) => Pe !== c);
    be(ue);
  }
  function xt(c) {
    fe(c);
    try {
      localStorage.setItem(tm, JSON.stringify(c));
    } catch {
    }
  }
  function M(c, S) {
    c.preventDefault(), c.stopPropagation();
    const ue = c.clientX, Pe = W[S] || ju[S] || 140, m = (Ee) => {
      const Ze = Math.max(56, Math.min(1e3, Pe + Ee.clientX - ue));
      oe((Lt) => ({ ...Lt, [S]: Ze }));
    }, Ce = () => {
      window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", Ce), oe((Ee) => {
        try {
          localStorage.setItem(yu, JSON.stringify(Ee));
        } catch {
        }
        return Ee;
      });
    };
    window.addEventListener("mousemove", m), window.addEventListener("mouseup", Ce);
  }
  function j() {
    oe({});
    try {
      localStorage.removeItem(yu);
    } catch {
    }
  }
  function ce(c, S) {
    if (!c || !S || c === S) return;
    const ue = Te.filter((m) => m !== c), Pe = ue.indexOf(S);
    ue.splice(Pe < 0 ? ue.length : Pe, 0, c), xt(ue);
  }
  function ge(c) {
    ae((S) => {
      const ue = new Set(S);
      return ue.has(c) ? ue.delete(c) : ue.add(c), ue;
    });
  }
  function nt() {
    Oe ? (at(!1), ae(/* @__PURE__ */ new Set())) : (at(!0), ae(new Set(A.map((c) => c.id))));
  }
  function _(c) {
    Ie(c);
    const S = {};
    for (const ue of mu) S[ue] = c[ue] || "";
    Me(S), lt(""), _e(null), tt("");
  }
  async function he() {
    if (!Fe) return;
    const c = {};
    for (const S of mu) {
      const ue = Fe[S] || "";
      Xe[S] !== ue && (c[S] = Xe[S] || null);
    }
    if (!Object.keys(c).length) {
      lt("没有修改任何字段。");
      return;
    }
    Ue(!0), E("");
    try {
      await o(Fs + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: Fe.id, changes: c }) }), lt(`已保存草稿（${Object.keys(c).map((S) => Yl(R, S)).join("、")}），批量确认后覆盖数据库。`), Ie(null), ut((S) => S + 1);
    } catch (S) {
      E(S.message);
    } finally {
      Ue(!1);
    }
  }
  async function Qe(c) {
    if (!c.length) {
      lt("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${c.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      Ue(!0), E(""), lt("");
      try {
        const S = await o(Fs + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: c }) });
        lt(`已确认写入 ${S.applied.length} 条${S.conflicts.length ? `；${S.conflicts.length} 条存在值冲突` : ""}。`), I([]), ut((ue) => ue + 1);
      } catch (S) {
        E(S.message);
      } finally {
        Ue(!1);
      }
    }
  }
  async function kt(c) {
    if (c.length) {
      Ue(!0), E("");
      try {
        await o(Fs + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: c }) }), I([]), ut((S) => S + 1);
      } catch (S) {
        E(S.message);
      } finally {
        Ue(!1);
      }
    }
  }
  async function Mt(c) {
    _e(null), tt("");
    try {
      const S = await o(zn + "/findings/" + encodeURIComponent(c.id));
      _e(S);
    } catch (S) {
      tt(S.message);
    }
  }
  async function Tt(c) {
    if (ye)
      try {
        const S = c || ye, ue = await Dt("/api/v1" + zn + "/documents/" + encodeURIComponent(S.document_id) + "/original");
        if (!ue.ok) throw Error("原件暂不可用，请稍后重试。");
        const Pe = URL.createObjectURL(await ue.blob()), m = document.createElement("a");
        m.href = Pe, m.download = S.original_name, m.click(), setTimeout(() => URL.revokeObjectURL(Pe), 1e3);
      } catch (S) {
        tt(S.message);
      }
  }
  const it = u.useMemo(() => v, [v]), vt = u.useMemo(() => J.map((c) => c.id), [J]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: w, onClick: () => ut((c) => c + 1), children: "刷新数据" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: (f == null ? void 0 : f.notice) || "正在读取历史报告数据…" }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-stats", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "问题条目 ",
          /* @__PURE__ */ s.jsx("b", { children: (f == null ? void 0 : f.findings) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "历史报告 ",
          /* @__PURE__ */ s.jsx("b", { children: (f == null ? void 0 : f.reports) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "工程项目 ",
          /* @__PURE__ */ s.jsx("b", { children: (f == null ? void 0 : f.projects) ?? "—" })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "待确认修改 ",
          /* @__PURE__ */ s.jsx("b", { children: (f == null ? void 0 : f.pending_drafts) ?? "—" })
        ] })
      ] }),
      Re && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        Re,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ut((c) => c + 1), children: "重试" })
      ] }),
      je && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: je }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([c, S]) => /* @__PURE__ */ s.jsx("button", { className: q === c ? "button primary" : "button ghost", onClick: () => {
        Z(c), x(0);
      }, children: S }, c)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (c) => {
          c.preventDefault(), se(re.trim()), x(0);
        }, children: [
          /* @__PURE__ */ s.jsx("label", { htmlFor: "history-query", children: "搜索" }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("input", { id: "history-query", value: re, onChange: (c) => g(c.target.value), maxLength: 100, placeholder: q === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: w, children: "搜索" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: He, onChange: (c) => {
            ve(c.target.value), x(0);
          }, children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目（",
              (f == null ? void 0 : f.projects) ?? "—",
              "）"
            ] }),
            d.map((c) => /* @__PURE__ */ s.jsxs("option", { value: c.name, children: [
              c.name,
              "（",
              c.findings,
              "）"
            ] }, c.name))
          ] })
        ] }),
        Ve && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          Q(""), x(0);
        }, children: "清除报告筛选" }),
        q === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ee, onChange: (c) => ie(c.target.checked) }),
          "只看待确认修改"
        ] }),
        q === "findings" && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => Ge((c) => !c), children: [
          "显示字段（",
          b,
          "/",
          Je,
          "）"
        ] }),
        q === "findings" && /* @__PURE__ */ s.jsx("button", { className: Oe ? "button primary" : "button secondary", onClick: nt, children: Oe ? "收起全部字段" : "展开全部字段" })
      ] }),
      Le && q === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        R.map((c) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(c.key), onChange: (S) => Ye(c.key, S.target.checked) }),
          c.label
        ] }, c.key)),
        /* @__PURE__ */ s.jsx("span", { className: "history-fieldsep", children: "其他列" }),
        kn.map((c) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(c), onChange: (S) => Ye(c, S.target.checked) }),
          Eu[c]
        ] }, c)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => be($i.filter((c) => R.some((S) => S.key === c) || kn.includes(c))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => xt(lm), children: "恢复列顺序" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: j, children: "恢复列宽" })
      ] }),
      q === "findings" && /* @__PURE__ */ s.jsx("p", { className: "muted history-drag-tip", children: "提示：拖动表头调整列顺序；点击表头右侧 × 可隐藏该列（全部列均可隐藏，在“显示字段”中恢复）；点击任意行展开该条全部字段与关联照片。" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      q === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        J.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              J.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ke, onClick: () => I(G.length === vt.length ? [] : vt), children: G.length === vt.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: ke || !G.length, onClick: () => void Qe(G), children: [
                "批量确认所选（",
                G.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ke || !G.length, onClick: () => void kt(G), children: "放弃所选" })
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
            /* @__PURE__ */ s.jsx("tbody", { children: J.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: G.includes(c.id), onChange: (S) => I(S.target.checked ? [...G, c.id] : G.filter((ue) => ue !== c.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Xt(c.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Xt(c.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Lf(c.changes, R) }),
              /* @__PURE__ */ s.jsx("td", { children: c.updated_at ? new Date(c.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, c.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap history-table-wrap", "aria-busy": w, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: ne.map((c) => /* @__PURE__ */ s.jsx(
            "th",
            {
              draggable: !0,
              style: { width: W[c] || ju[c], minWidth: W[c] || ju[c] },
              className: "history-col-head" + (le === c ? " history-col-dragging" : "") + (xe === c ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (S) => {
                H(c), S.dataTransfer.effectAllowed = "move", S.dataTransfer.setData("text/plain", c);
              },
              onDragOver: (S) => {
                S.preventDefault(), S.dataTransfer.dropEffect = "move", xe !== c && ze(c);
              },
              onDragLeave: () => ze(""),
              onDrop: (S) => {
                S.preventDefault(), ce(le || S.dataTransfer.getData("text/plain"), c), H(""), ze("");
              },
              onDragEnd: () => {
                H(""), ze("");
              },
              children: /* @__PURE__ */ s.jsxs("span", { className: "history-th", children: [
                /* @__PURE__ */ s.jsx("span", { className: "history-th-label", children: Yl(R, c) }),
                /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-col-hide", title: "点击隐藏该列（可在“显示字段”中恢复）", "aria-label": `隐藏${Yl(R, c)}列`, draggable: !1, onMouseDown: (S) => S.stopPropagation(), onDragStart: (S) => S.preventDefault(), onClick: (S) => {
                  S.stopPropagation(), pe(c);
                }, children: "×" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-col-resize", role: "separator", "aria-orientation": "vertical", "aria-label": "拖动调节列宽", title: "拖动调节列宽", onMouseDown: (S) => M(S, c), onDragStart: (S) => S.preventDefault() })
              ] })
            },
            c
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            A.map((c) => {
              const S = Ae.has(c.id);
              return /* @__PURE__ */ s.jsxs(u.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (c.draft_id ? "history-dirty" : "") + " history-row", onClick: (ue) => {
                  ue.target.closest("button, a, input, textarea, select, summary") || ge(c.id);
                }, children: ne.map((ue) => {
                  if (ue === "_actions") return /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                    /* @__PURE__ */ s.jsx("button", { className: "button secondary icon-button", title: "编辑", "aria-label": "编辑", onClick: () => _(c), children: /* @__PURE__ */ s.jsx(mv, { size: 15 }) }),
                    /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: "查看证据", "aria-label": "查看证据", onClick: () => void Mt(c), children: /* @__PURE__ */ s.jsx(ov, { size: 15 }) }),
                    /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: S ? "收起" : "展开", "aria-label": S ? "收起" : "展开", onClick: () => ge(c.id), children: S ? /* @__PURE__ */ s.jsx(Kj, { size: 15 }) : /* @__PURE__ */ s.jsx(Zj, { size: 15 }) })
                  ] }, ue);
                  if (ue === "_photos") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: c.image_count ? /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => rt(c), children: [
                    "查看 ",
                    c.image_count,
                    " 张"
                  ] }) : /* @__PURE__ */ s.jsx("span", { className: "muted", children: "—" }) }, ue);
                  if (ue === "_source") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: c.original_name || "", children: Xt(c.original_name, 22) }, ue);
                  if (ue === "_status") return /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: c.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Xt(c.review_state, 14) }, ue);
                  const Pe = c[ue], m = ue === "problem_description", Ce = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "source_category", "source_grade", "hazard_category"].includes(ue);
                  return /* @__PURE__ */ s.jsx("td", { title: Pe || "", className: m ? "history-cell history-cell-clamp" : Ce ? "history-cell history-cell-nowrap" : "history-cell", children: m ? Pe || "—" : Xt(Pe, 80) }, ue);
                }) }),
                S && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: ne.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: R.map((ue) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: ue.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: c[ue.key] || "—" })
                  ] }, ue.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    Xt(c.original_name, 100),
                    "｜状态：",
                    Xt(c.review_state, 20),
                    c.draft_id ? "｜有待确认修改" : ""
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "history-expanded-photos", children: [
                    /* @__PURE__ */ s.jsxs("h4", { children: [
                      "关联照片（",
                      c.image_count ?? 0,
                      "）"
                    ] }),
                    /* @__PURE__ */ s.jsx(Yf, { api: o, findingId: c.id })
                  ] })
                ] }) })
              ] }, c.id);
            }),
            !A.length && !w && !Re && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: ne.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: we === 0, onClick: () => x(Math.max(0, we - 30)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            we / 30 + 1,
            " 页 · 本页 ",
            A.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !L, onClick: () => x(we + 30), children: "下一页" })
        ] })
      ] }),
      q === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": w, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          it.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: Xt(c.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: Xt(c.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: Xt(c.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: c.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                Q(c.document_id), Z("findings"), x(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
                Dt("/api/v1" + zn + "/documents/" + encodeURIComponent(c.document_id) + "/original").then(async (S) => {
                  if (!S.ok) throw Error("原件暂不可用");
                  const ue = URL.createObjectURL(await S.blob()), Pe = document.createElement("a");
                  Pe.href = ue, Pe.download = c.original_name, Pe.click(), setTimeout(() => URL.revokeObjectURL(ue), 1e3);
                }).catch((S) => E(S.message));
              }, children: "原件" })
            ] })
          ] }, c.document_id)),
          !it.length && !w && !Re && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      q === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": w, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" }),
          /* @__PURE__ */ s.jsx("th", { children: "报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作人" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          te.map((c) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: new Date(c.created_at).toLocaleString("zh-CN") }),
            /* @__PURE__ */ s.jsx("td", { children: Ev[c.action] || c.action }),
            /* @__PURE__ */ s.jsx("td", { children: Xt(c.original_name, 28) || Xt(c.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Lf(c.changes, R) }),
            /* @__PURE__ */ s.jsx("td", { children: Xt(c.actor, 30) })
          ] }, c.id)),
          !te.length && !w && !Re && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    Fe && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          Ie(null), _e(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Xt(Fe.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: mu.map((c) => /* @__PURE__ */ s.jsxs("label", { className: c === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Yl(R, c) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: c === "problem_description" ? 3 : 2, value: Xe[c] || "", onChange: (S) => Me({ ...Xe, [c]: S.target.value }) })
      ] }, c)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ke, onClick: () => void he(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ie(null), children: "取消" })
      ] }),
      ye && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Tt(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: de.map((c) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: c.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ye.fields[c.key] || "—" })
        ] }, c.key)) }),
        ye.evidence.map((c, S) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Yl(R, c.field_key),
            "：",
            Xt(c.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: c.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(c.locator)
          ] })
        ] }, S)),
        ye.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            ye.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ye.images.map((c, S) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(_u, { id: c.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(c.locator) })
          ] }, c.id + ":" + S)) })
        ] })
      ] })
    ] }),
    ye && !Fe && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => _e(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (c) => c.stopPropagation(), children: [
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _e(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Tt(), children: "下载原报告" }),
        ye.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: ye.sources.map((c) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void Tt(c), children: c.original_name }) }, c.document_id)) })
        ] }),
        qe && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: qe }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: de.map((c) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: c.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ye.fields[c.key] || "—" })
        ] }, c.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        ye.evidence.map((c, S) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Yl(R, c.field_key),
            "：",
            Xt(c.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: c.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(c.locator)
          ] })
        ] }, S)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          ye.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ye.images.map((c, S) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(_u, { id: c.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(c.locator) })
        ] }, c.id + ":" + S)) })
      ] })
    ] }) }),
    $e && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "关联照片", onClick: () => rt(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal history-photo-modal", onClick: (c) => c.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "关联照片" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Xt($e.original_name, 90) }),
            "｜问题：",
            Xt($e.problem_description, 90)
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => rt(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-modal-body", children: /* @__PURE__ */ s.jsx(Yf, { api: o, findingId: $e.id, large: !0 }) })
    ] }) })
  ] });
}
function At(o, f) {
  return o ? o.permissions != null ? o.permissions.includes(f) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(f) ? !!o.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(f) ? o.roles.some((y) => ["admin", "reviewer"].includes(y)) : f === "training.manage" ? o.roles.some((y) => ["admin", "teacher"].includes(y)) : f === "training.review" ? o.roles.some((y) => ["admin", "teacher", "reviewer"].includes(y)) : !0 : !1;
}
const Is = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Gf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Xf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function vu(o, f) {
  return [["标题", o.title, f.title], ["事实", o.facts.map((d) => d.text).join(`
`), f.facts.map((d) => d.text).join(`
`)], ["建议", o.suggestions.join(`
`), f.suggestions.join(`
`)], ["引用证据", o.facts.flatMap((d) => d.evidence_ids).join("、"), f.facts.flatMap((d) => d.evidence_ids).join("、")], ["标准依据", JSON.stringify(o.standards), JSON.stringify(f.standards)], ["施工要点", JSON.stringify(o.construction_points || []), JSON.stringify(f.construction_points || [])]].filter(([, d, T]) => d !== T);
}
function Uv({ api: o, path: f, navigate: y, projects: d, identity: T }) {
  var M;
  const [q, Z] = u.useState(!0), [A, Y] = u.useState(!1), [v, D] = u.useState(""), [J, k] = u.useState(""), [te, me] = u.useState(0), [Ne, Se] = u.useState([]), [Te, fe] = u.useState([]), [W, oe] = u.useState([]), [le, H] = u.useState("knowledge_revision"), [xe, ze] = u.useState(""), [Le, Ge] = u.useState(""), [He, ve] = u.useState(""), [Ve, Q] = u.useState(null), [re, g] = u.useState([]), [X, se] = u.useState(null), [we, x] = u.useState("resolved"), [L, F] = u.useState(""), [ee, ie] = u.useState(""), [G, I] = u.useState(((M = d.find((j) => At(j, "knowledge.process"))) == null ? void 0 : M.id) || ""), [Ae, ae] = u.useState([]), [Oe, at] = u.useState([]), [Fe, Ie] = u.useState("case_card"), [Xe, Me] = u.useState("normal"), [ye, _e] = u.useState(null), [qe, tt] = u.useState(sessionStorage.getItem("b03-last-job-" + T) || ""), [$e, rt] = u.useState(null), [je, lt] = u.useState(null), [Re, E] = u.useState(null), [w, K] = u.useState(""), [ke, Ue] = u.useState(!1), st = /^\/knowledge\/[^/]+\/edit$/.test(f), ut = d.some((j) => At(j, "knowledge.process")), R = d.some((j) => At(j, "knowledge.review")), de = f.startsWith("/quality"), ne = f === "/reviews";
  u.useEffect(() => {
    ve(""), g([]), Ge(""), ze(""), D(""), k(""), Ue(!1), K("");
  }, [f]), u.useEffect(() => {
    let j = !1;
    Z(!0), D(""), lt(null), E(null);
    async function ce() {
      try {
        if (de) {
          const ge = await o(`/quality/issues?limit=20${xe ? "&rule_code=" + xe : ""}${Le ? "&status=" + Le : ""}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (j) return;
          fe(ge.items), oe(ge.summary), Q(ge.next_cursor);
        } else if (st) {
          const ge = await o(f.replace("/edit", ""));
          if (j) return;
          lt(ge), E(structuredClone(ge.content));
        } else if (ne) {
          const ge = await o(`/reviews?object_type=${le}&state=${Le || "pending_review"}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (j) return;
          Se(ge.items), Q(ge.next_cursor);
        } else {
          const ge = await o(`/knowledge?limit=20${Le ? "&state=" + Le : ""}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (j) return;
          if (Se(ge.items), Q(ge.next_cursor), ut && G) {
            const nt = await o("/knowledge/source-options?project_id=" + G);
            j || ae(nt.items);
          }
        }
      } catch (ge) {
        j || D(ge.message);
      } finally {
        j || Z(!1);
      }
    }
    return ce(), () => {
      j = !0;
    };
  }, [f, Le, xe, He, te, G, le]), u.useEffect(() => {
    at([]), _e(null);
  }, [G, Fe, Xe]), u.useEffect(() => {
    if (!qe || de || st || ne || !ut) return;
    let j = !1;
    const ce = () => {
      o("/knowledge/generation-jobs/" + qe).then((nt) => {
        j || (rt(nt), nt.status === "succeeded" && me((_) => _ + 1));
      }).catch((nt) => {
        j || D(nt.message);
      });
    };
    ce();
    const ge = setInterval(() => {
      (!$e || ["queued", "running", "retrying"].includes($e.status)) && ce();
    }, 1800);
    return () => {
      j = !0, clearInterval(ge);
    };
  }, [qe, f, $e == null ? void 0 : $e.status]);
  const Je = async (j) => {
    Y(!0), D(""), k("");
    try {
      await j();
    } catch (ce) {
      D(ce.message);
    } finally {
      Y(!1);
    }
  }, b = () => ({ record_version_ids: Oe, type: Fe, template_version: "mock-v1", mock_scenario: Xe }), be = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !re.length, onClick: () => {
        ve(re.at(-1) || ""), g(re.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Ve, onClick: () => {
        g([...re, He]), ve(Ve || "");
      }, children: "下一页" })
    ] })
  ] }), pe = je && At(d.find((j) => j.id === je.project_id), "knowledge.process"), Ye = je && At(d.find((j) => j.id === je.project_id), "knowledge.review"), xt = (j) => Je(async () => {
    if (!je) return;
    const ce = j === "submit" ? `/knowledge/${je.id}/submit-review` : `/reviews/${je.revision_id}/${j}`;
    await o(ce, { method: "POST", body: JSON.stringify({ row_version: je.row_version, revision_id: je.revision_id, reason: w, evidence_checked: ke }) }), k(j === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), me((ge) => ge + 1), Ue(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(On, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    v && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      v,
      /* @__PURE__ */ s.jsx("button", { onClick: () => me((j) => j + 1), children: "重新加载" })
    ] }),
    J && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      J
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => y("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: de ? "selected" : "", onClick: () => y("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !de && !ne ? "selected" : "", onClick: () => y("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ne ? "selected" : "", onClick: () => y("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: q, onClick: () => me((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    q ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : de ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Gf).map(([j, ce]) => /* @__PURE__ */ s.jsxs("button", { className: xe === j ? "panel selected-quality" : "panel", "aria-pressed": xe === j, onClick: () => {
        ze(xe === j ? "" : j), Ge("open"), ve(""), g([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: ce }),
        /* @__PURE__ */ s.jsx("strong", { children: W.filter((ge) => ge.rule_code === j && ge.status === "open").reduce((ge, nt) => ge + nt.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, j)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Le, onChange: (j) => {
            Ge(j.target.value), ve(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: Is[j] }, j))
          ] })
        ] }),
        Te.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Te.map((j) => {
            var ce, ge;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => y("/records/" + j.record_id), children: j.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Gf[j.rule_code] || j.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                j.message,
                j.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (ce = j.annotations.at(-1)) == null ? void 0 : ce.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Is[j.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((ge = d.find((nt) => nt.id === j.project_id)) != null && ge.can_run), onClick: () => {
                se(j), F(""), ie("");
              }, children: "核查处理" }) })
            ] }, j.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        be
      ] })
    ] }) : st && je && Re ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Xf[je.type],
            " · v",
            je.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            Is[je.state],
            " · 生成适配器：",
            je.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      je.source.version !== je.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        je.source.version,
        "更新到v",
        je.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y((je.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + je.source.record_id), children: je.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              je.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(je.source.raw_fields.description || je.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(je.source.effective_fields.description || "缺失") }),
            je.source.versions && je.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                je.source.versions.length,
                "条）"
              ] }),
              je.source.versions.map((j) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  j.version,
                  " · ",
                  j.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/records/" + j.record_id), children: "打开风险记录" })
              ] }, j.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              Re.project_name,
              " · ",
              Re.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            je.source.evidence.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[j.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: j.id })
            ] }, j.id)),
            je.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              je.source.annotations.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
                j.reason,
                " · ",
                JSON.stringify(j.value)
              ] }, ce))
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
              /* @__PURE__ */ s.jsx("input", { value: Re.title, disabled: !pe, onChange: (j) => E({ ...Re, title: j.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            Re.facts.map((j, ce) => /* @__PURE__ */ s.jsxs("label", { children: [
              j.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.text, onChange: (ge) => E({ ...Re, facts: Re.facts.map((nt, _) => _ === ce ? { ...nt, text: ge.target.value, source_kind: "human_annotation" } : nt) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                j.evidence_ids.join("、")
              ] })
            ] }, ce)),
            Re.construction_points && Re.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                Re.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: Re.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              Re.construction_points.map((j, ce) => {
                var ge;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    j.title,
                    " · ",
                    j.stage === "preparation" ? "施工准备" : j.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.content, onChange: (nt) => {
                      var _;
                      return E({ ...Re, construction_points: (_ = Re.construction_points) == null ? void 0 : _.map((he, Qe) => Qe === ce ? { ...he, content: nt.target.value } : he) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.inspection_method, onChange: (nt) => {
                      var _;
                      return E({ ...Re, construction_points: (_ = Re.construction_points) == null ? void 0 : _.map((he, Qe) => Qe === ce ? { ...he, inspection_method: nt.target.value } : he) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.common_mistakes, onChange: (nt) => {
                      var _;
                      return E({ ...Re, construction_points: (_ = Re.construction_points) == null ? void 0 : _.map((he, Qe) => Qe === ce ? { ...he, common_mistakes: nt.target.value } : he) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: j.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    j.evidence_ids.join("、")
                  ] }),
                  (ge = j.source_quotes) == null ? void 0 : ge.map((nt, _) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: nt.text })
                  ] }, _))
                ] }, ce);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: Re.suggestions.join(`
`), onChange: (j) => E({ ...Re, suggestions: j.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            Re.standards.length ? Re.standards.map((j, ce) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: j.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                j.clause || "未提供",
                " · 版本：",
                j.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: j.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !pe, checked: j.verification_status === "not_used", onChange: (ge) => E({ ...Re, standards: Re.standards.map((nt, _) => _ === ce ? { ...nt, verification_status: ge.target.checked ? "not_used" : "pending_verification" } : nt) }) }),
                "明确不采用该依据"
              ] })
            ] }, ce)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            vu(je.content, Re).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              vu(je.content, Re).map(([j, ce, ge]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: j }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  ce
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  ge
                ] })
              ] }, j))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (j) => K(j.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              pe && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A || !w.trim(), onClick: () => void Je(async () => {
                await o(`/knowledge/${je.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: je.row_version, revision_id: je.revision_id, content: Re, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), me((j) => j + 1);
              }), children: "保存新草稿版本" }),
              pe && ["draft", "changes_requested"].includes(je.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !w.trim() || JSON.stringify(Re) !== JSON.stringify(je.content), onClick: () => void xt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Ye && je.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ke, onChange: (j) => Ue(j.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !ke || !w.trim() || JSON.stringify(Re) !== JSON.stringify(je.content), onClick: () => void xt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: A || !w.trim(), onClick: () => void xt("request-changes"), children: "退回修改" })
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
        je.revisions.map((j, ce) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            j.version,
            " · ",
            Is[j.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            j.content.facts.map((ge) => ge.text).join("；")
          ] }),
          je.revisions[ce + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              je.revisions[ce + 1].version,
              "的修改："
            ] }),
            vu(je.revisions[ce + 1].content, j.content).map(([ge, nt, _]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: ge }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                nt
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                _
              ] })
            ] }, ge))
          ] })
        ] }, j.id)),
        je.review_actions.map((j, ce) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            j.version,
            " · ",
            Is[j.action] || j.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(j.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            j.reviewer.slice(0, 8)
          ] })
        ] }, ce))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ne && ut && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: G, onChange: (j) => I(j.target.value), children: d.filter((j) => At(j, "knowledge.process")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: Fe, onChange: (j) => Ie(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            at(Ae.slice(0, 20).map((j) => j.record_version_id)), _e(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Ae.length ? Ae.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Oe.includes(j.record_version_id), onChange: (ce) => {
              at(ce.target.checked ? [...Oe, j.record_version_id] : Oe.filter((ge) => ge !== j.record_version_id)), _e(null);
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
              /* @__PURE__ */ s.jsxs("select", { value: Xe, onChange: (j) => Me(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: A || !Oe.length || Oe.length > 20, onClick: () => void Je(async () => {
              _e(await o("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              Oe.length,
              "条）"
            ] }),
            ye && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: A, onClick: () => void Je(async () => {
              const j = await o("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              rt(null), tt(j.job_id), sessionStorage.setItem("b03-last-job-" + T, j.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              ye.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(_l, { size: 15 })
            ] })
          ] }),
          ye && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: ye.items.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
            j.description,
            " · 来源问题 ",
            j.quality_issue_count,
            "项"
          ] }, ce)) }),
          $e && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              $e.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              $e.counts.created,
              " · 复用 ",
              $e.counts.skipped,
              " · 单项失败 ",
              $e.counts.failed
            ] }),
            $e.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: $e.error }),
            $e.items.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.error || Is[j.outcome],
              " ",
              j.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/knowledge/" + j.item_id + "/edit"), children: "打开知识卡" })
            ] }, ce)),
            $e.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A, onClick: () => void Je(async () => {
              await o("/jobs/" + $e.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: $e.row_version }) }), rt(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ne ? "审核待办" : "知识候选列表" }),
          ne && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: le, onChange: (j) => {
            H(j.target.value), ve(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Le, onChange: (j) => {
            Ge(j.target.value), ve(""), g([]);
          }, children: [
            !ne && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ne ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: Is[j] }, j))
          ] })
        ] }),
        ne && !R ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : Ne.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ne.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.title }),
            /* @__PURE__ */ s.jsx("td", { children: Xf[j.type] }),
            /* @__PURE__ */ s.jsx("td", { children: Is[j.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y(j.object_type === "question_revision" ? "/training/questions/" + j.id : j.object_type === "retrospective_revision" ? "/retrospectives/" + j.id + "/review" : "/knowledge/" + j.id + "/edit"), children: ne ? "打开审核" : "核查与编辑" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ne ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        be
      ] })
    ] }),
    X && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => se(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: X.message }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ s.jsx("select", { value: we, onChange: (j) => x(j.target.value), children: ["resolved", "ignored", "open"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: Is[j] }, j)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: L, onChange: (j) => F(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: ee, onChange: (j) => ie(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !L.trim(), onClick: () => void Je(async () => {
        await o("/quality/issues/" + X.id, { method: "PATCH", body: JSON.stringify({ row_version: X.row_version, status: we, reason: L, annotation: ee || null }) }), se(null), me((j) => j + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Qf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Dv = (o) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[o] || "其他已配置场景", Mv = (o) => [o.section, typeof o.row == "number" ? `第${o.row}行` : null, o.cell ? `单元格 ${o.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", pu = (o) => o === "case_card" ? "案例卡" : "检查要点卡";
function qv({ identity: o, path: f, projects: y, navigate: d }) {
  var de, ne, Je, b, be, pe, Ye, xt;
  const [T, q] = u.useState(((de = y[0]) == null ? void 0 : de.id) || ""), [Z, A] = u.useState("generic"), [Y, v] = u.useState(""), [D, J] = u.useState([]), [k, te] = u.useState({}), [me, Ne] = u.useState([]), [Se, Te] = u.useState([]), [fe, W] = u.useState("mock-hash-64"), [oe, le] = u.useState([]), [H, xe] = u.useState(null), [ze, Le] = u.useState(""), [Ge, He] = u.useState("extractive"), [ve, Ve] = u.useState(null), [Q, re] = u.useState(null), [g, X] = u.useState(null);
  u.useEffect(() => () => {
    g && URL.revokeObjectURL(g);
  }, [g]), u.useEffect(() => {
    X(null);
  }, [T, f]);
  const [se, we] = u.useState(null);
  u.useEffect(() => {
    we(null);
  }, [f]);
  const [x, L] = u.useState(""), [F, ee] = u.useState("useful"), [ie, G] = u.useState(""), [I, Ae] = u.useState(!1), [ae, Oe] = u.useState(!0), [at, Fe] = u.useState(""), [Ie, Xe] = u.useState(""), [Me, ye] = u.useState(0), [_e, qe] = u.useState(""), [tt, $e] = u.useState(null), [rt, je] = u.useState([]), lt = u.useRef("");
  lt.current = [o, f, T, Z, Y, ze, Ge, se].join("|");
  const Re = f === "/releases", E = f === "/search", w = f === "/knowledge/library", K = At(y.find((M) => M.id === T), "knowledge.publish"), ke = !Re && !E && !w ? f.split("/")[2] : null;
  async function Ue(M, j = {}) {
    const ce = await Dt("/api/v1" + M, { ...j, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${o}`, ...j.headers } }), ge = await ce.json();
    if (!ce.ok) throw new Error(ge.message || "请求失败，请重试。");
    return ge;
  }
  u.useEffect(() => {
    Te([]), Ve(null), re(null), Fe(""), Xe(""), qe(""), je([]);
  }, [T, f, Z, Y]), u.useEffect(() => {
    let M = !1;
    return Oe(!0), Fe(""), xe(null), (async () => {
      try {
        if (Re) {
          const ce = await Ue(`/releases?project_id=${T}${_e ? "&cursor=" + encodeURIComponent(_e) : ""}`);
          if (M) return;
          J(ce.items), te(ce.active_ids), $e(ce.next_cursor);
          const ge = await Ue("/releases/options?project_id=" + T);
          M || Ne(ge.items);
        } else if (w) {
          const ce = await Ue(`/knowledge/library?project_id=${T}${Z ? "&scene_code=" + Z : ""}${Y ? "&card_type=" + Y : ""}${_e ? "&after_id=" + _e : ""}`);
          M || (le(ce.items), $e(ce.next_cursor));
        } else if (ke) {
          const ce = await Ue("/published/knowledge/" + ke + (se ? "?revision_id=" + se : ""));
          M || xe(ce);
        }
      } catch (ce) {
        M || Fe(ce.message);
      } finally {
        M || Oe(!1);
      }
    })(), () => {
      M = !0;
    };
  }, [T, f, Z, Y, Me, _e, se]), u.useEffect(() => {
    if (!Re || !D.some((j) => ["queued", "building"].includes(j.state))) return;
    const M = setInterval(() => ye((j) => j + 1), 1800);
    return () => clearInterval(M);
  }, [Re, D]);
  const st = async (M) => {
    Ae(!0), Fe(""), Xe("");
    try {
      await M();
    } catch (j) {
      Fe(j.message);
    } finally {
      Ae(!1);
    }
  }, ut = (M, j, ce = !1) => st(async () => {
    const ge = lt.current;
    X(null), re(null);
    const nt = await Ue("/published/evidence/" + M + "?revision_id=" + j + (ce ? "&historical=true" : ""));
    if (ge === lt.current && (re(nt), nt.has_image)) {
      const _ = await Dt("/api/v1/published/evidence/" + M + "/content?revision_id=" + j + (ce ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${o}` } });
      if (!_.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const he = await _.blob();
      ge === lt.current && X(URL.createObjectURL(he));
    }
  }), R = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !rt.length || ae, onClick: () => {
        qe(rt.at(-1) || ""), je(rt.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !tt || ae, onClick: () => {
        je([...rt, _e]), qe(tt || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Ki, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || ke ? "selected" : "", onClick: () => d("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: E ? "selected" : "", onClick: () => d("/search"), children: "知识检索" }),
        y.some((M) => At(M, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: Re ? "selected" : "", onClick: () => d("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        re(null), Ve(null), ye((M) => M + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    at && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      at
    ] }),
    Ie && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      Ie
    ] }),
    !ke && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: T, onChange: (M) => q(M.target.value), children: y.map((M) => /* @__PURE__ */ s.jsx("option", { value: M.id, children: M.name }, M.id)) })
      ] }),
      !Re && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: Z, onChange: (M) => A(M.target.value), children: [
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
    ae ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : Re ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      K && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: me.length ? me.map((M) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se.includes(M.revision_id), onChange: (j) => Te(j.target.checked ? [...Se, M.revision_id] : Se.filter((ce) => ce !== M.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: M.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              pu(M.type),
              " · 审核版本 v",
              M.version
            ] })
          ] })
        ] }, M.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: fe, onChange: (M) => W(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !Se.length, onClick: () => void st(async () => {
            await Ue("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: T, revision_ids: Se, embedding_model: fe }) }), Te([]), Xe("发布集合已固定，处理服务正在构建索引。"), ye((M) => M + 1);
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
        D.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: D.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Qf[M.state] || M.state }),
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
              ["ready", "inactive"].includes(M.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void st(async () => {
                await Ue("/releases/" + M.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: M.row_version, expected_active_id: k[T] || null }) }), Xe("发布已启用，知识库与检索使用同一发布集合。"), ye((j) => j + 1);
              }), children: "启用发布" }),
              M.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, onClick: () => void st(async () => {
                await Ue("/jobs/" + M.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: M.job_row_version }) }), ye((j) => j + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          M.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: M.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            M.entries.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.revision_id.slice(0, 8),
              " · ",
              Qf[j.state] || j.state,
              j.error ? " · " + j.error : ""
            ] }, j.revision_id))
          ] })
        ] }, M.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        R
      ] })
    ] }) : w ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ s.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      oe.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: oe.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          pu(M.type),
          " · v",
          M.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: M.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => d("/knowledge/" + M.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(sv, { size: 15 })
        ] })
      ] }, M.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Ki, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      R
    ] }) : E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (M) => {
        M.preventDefault(), st(async () => {
          const j = lt.current;
          Ve(null), re(null);
          const ce = await Ue("/search", { method: "POST", body: JSON.stringify({ project_id: T, question: ze, scene_code: Z, card_type: Y || null, answer_mode: Ge }) });
          j === lt.current && Ve(ce);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: ze, onChange: (M) => {
          Le(M.target.value), Ve(null), re(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Ge, onChange: (M) => {
              He(M.target.value), Ve(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !ze.trim(), children: [
            /* @__PURE__ */ s.jsx(bv, { size: 17 }),
            I ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      ve && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ve.status === "answered" ? "找到有据内容" : ve.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            ve.latency_ms,
            " ms · ",
            ve.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          ve.answer_blocks.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M.text }, j)),
          ve.missing_conditions.map((M) => /* @__PURE__ */ s.jsx("p", { children: M }, M)),
          ve.warnings.map((M) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: M.message }, M.code))
        ] }),
        ve.results.map((M, j) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            j + 1,
            " · ",
            M.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => d("/knowledge/" + M.id), children: M.title }),
          /* @__PURE__ */ s.jsx("p", { children: M.text }),
          /* @__PURE__ */ s.jsx("div", { children: ve.citations.filter((ce) => M.citation_ids.includes(ce.citation_id)).map((ce) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: I, onClick: () => void ut(ce.evidence_id, ce.knowledge_revision_id), children: [
            "打开来源：",
            ce.source_title
          ] }, ce.citation_id)) })
        ] }, M.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (M) => {
          M.preventDefault(), st(async () => {
            await Ue("/search/" + ve.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: F, comment: ie }) }), Xe("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: F, onChange: (M) => ee(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ie, maxLength: 1e3, onChange: (M) => G(M.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, children: "保存反馈" })
        ] })
      ] })
    ] }) : H && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => d("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        H.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        pu(H.type),
        " · v",
        H.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: H.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ne = y.find((M) => M.id === H.project_id)) == null ? void 0 : ne.name) || H.project_id,
        " · ",
        Dv(H.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Je = H.content) == null ? void 0 : Je.facts.map((M, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: M.text }),
        /* @__PURE__ */ s.jsx("small", { children: M.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((ce) => /* @__PURE__ */ s.jsx("button", { disabled: I, className: "citation-button", onClick: () => void ut(ce, H.revision_id, H.is_current_release === !1), children: "打开来源证据" }, ce)) })
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
          /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((ce) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void ut(ce, H.revision_id, H.is_current_release === !1), children: "核对要点来源" }, ce)) })
        ] }, j))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((be = H.content) == null ? void 0 : be.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (pe = H.content) == null ? void 0 : pe.suggestions.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M }, j)),
      (Ye = H.content) != null && Ye.standards.length ? H.content.standards.map((M, j) => /* @__PURE__ */ s.jsxs("p", { children: [
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
        (xt = H.versions) == null ? void 0 : xt.map((M) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          we(M.id), re(null);
        }, children: [
          "查看已发布 v",
          M.version
        ] }, M.id)),
        /* @__PURE__ */ s.jsx("p", { children: H.history_note })
      ] }),
      At(y.find((M) => M.id === H.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: x, maxLength: 2e3, onChange: (M) => L(M.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: I || !x.trim(), onClick: () => void st(async () => {
          await Ue("/knowledge/" + H.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: H.row_version, reason: x }) }), xe(null), re(null), Xe("知识已撤回，新的检索和证据访问已阻断。"), d("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    Q && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          Q.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => re(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Q.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: Q.description || "来源描述缺失" }),
        g && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: g, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          Mv(Q.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: Q.note })
      ] })
    ] })
  ] });
}
const Cn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, am = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, Nu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Hv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, Su = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, wu = (o) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[o] || o, Tn = (o) => o ? new Date(o).toLocaleString("zh-CN") : "实际时间未提供", Bv = (o) => JSON.stringify(o, null, 2), Lv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function wa(o, f = "") {
  if (o == null) return "未提供";
  if (Array.isArray(o)) return o.every((y) => typeof y != "object") ? o.join("、") : o.map((y, d) => `第${d + 1}条
${wa(y)}`).join(`

`);
  if (typeof o == "object") return Object.entries(o).map(([y, d]) => `${Lv[y] || Nu[y] || y}：${wa(d, y)}`).join(`
`);
  if (typeof o == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(f)) return Tn(o);
    if (f === "actor_role" || f === "role") return wu(o);
    if (f === "event_type") return am[o] || o;
    if (f === "evidence_type") return Su[o] || o;
    if (f === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[o] || o;
  }
  return String(o);
}
const Yv = (o) => {
  const f = o.note;
  return typeof f == "string" ? f : Object.keys(o).length ? Bv(o) : "未补充说明";
};
function Gv({ identity: o, path: f, projects: y, navigate: d }) {
  var Re, E, w, K, ke, Ue, st, ut, R, de, ne, Je;
  const T = f === "/task-packages/import", q = !T && f !== "/task-packages" ? f.split("/")[2] : null, [Z, A] = u.useState(((Re = y[0]) == null ? void 0 : Re.id) || ""), [Y, v] = u.useState(""), [D, J] = u.useState([]), [k, te] = u.useState(null), [me, Ne] = u.useState(""), [Se, Te] = u.useState(null), [fe, W] = u.useState([]), [oe, le] = u.useState([]), [H, xe] = u.useState([]), [ze, Le] = u.useState("complete"), [Ge, He] = u.useState(() => sessionStorage.getItem("b05-demo-task:" + o) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [ve, Ve] = u.useState(""), [Q, re] = u.useState(null), [g, X] = u.useState(""), [se, we] = u.useState(""), [x, L] = u.useState(!0), [F, ee] = u.useState(!1), [ie, G] = u.useState(0), [I, Ae] = u.useState(""), [ae, Oe] = u.useState(null), at = u.useRef(null), Fe = u.useRef(null), Ie = u.useRef("");
  Ie.current = [o, f, Z, ze, Ge, ve].join("|");
  const Xe = y.some((b) => b.permissions != null), Me = !Xe && At(y.find((b) => b.id === Z), "imports.create"), ye = k && !Xe && At(y.find((b) => b.id === k.project_id), "imports.withdraw"), _e = k && !Xe && At(y.find((b) => b.id === k.project_id), "imports.create");
  async function qe(b, be = {}) {
    const pe = await Dt("/api/v1/task-packages" + b, {
      ...be,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${o}`, ...be.headers }
    }), Ye = await pe.json().catch(() => ({}));
    if (!pe.ok) throw new Error(Ye.message || "接入服务暂未就绪，请稍后刷新。");
    return Ye;
  }
  const tt = async (b) => {
    ee(!0), X(""), we("");
    try {
      await b();
    } catch (be) {
      X(be.message);
    } finally {
      ee(!1);
    }
  };
  u.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + o, Ge);
  }, [Ge, o]), u.useEffect(() => () => {
    ae != null && ae.url && URL.revokeObjectURL(ae.url);
  }, [ae == null ? void 0 : ae.url]), u.useEffect(() => {
    Ne(""), W([]), X(""), we(""), Oe(null), Ae(""), re(null);
  }, [f, Z, Y]), u.useEffect(() => {
    let b = !1;
    return L(!0), te(null), X(""), (async () => {
      try {
        if (T && Ot) {
          const pe = await Dt("/api/v1/platform-archives"), Ye = await pe.json();
          if (!pe.ok) throw new Error(Ye.message);
          b || le(Ye.items);
        } else if (T) {
          const pe = await qe("/samples");
          b || xe(pe.items);
        } else if (q) {
          const pe = await qe("/" + q);
          b || te(pe);
        } else {
          const pe = await qe(`?project_id=${Z}${Y ? "&state=" + Y : ""}${me ? "&cursor=" + encodeURIComponent(me) : ""}`);
          b || (J(pe.items), Te(pe.next_cursor));
        }
      } catch (pe) {
        b || X(pe.message);
      } finally {
        b || L(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [f, Z, Y, me, ie]), u.useEffect(() => {
    if (Ot || !T || !Me) return;
    let b = !1;
    re(null), Ve("");
    const be = Ge + "." + (ze === "v2" ? "complete" : ze);
    return qe(`/samples/${ze}?project_id=${Z}&task_id=${be}`).then((pe) => {
      b || Ve(JSON.stringify(pe, null, 2));
    }).catch((pe) => {
      b || X(pe.message);
    }), () => {
      b = !0;
    };
  }, [T, Z, ze, Ge]), u.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !q && D.some((pe) => ["received", "validating", "processing"].includes(pe.status))) || T) return;
    const be = setInterval(() => G((pe) => pe + 1), 1800);
    return () => clearInterval(be);
  }, [k == null ? void 0 : k.status, D, f]);
  const $e = () => tt(async () => {
    const b = Ie.current;
    re(null);
    const be = await qe("/preview", { method: "POST", body: ve });
    Ie.current === b && re(be);
  }), rt = () => tt(async () => {
    var be;
    if (!Q) return;
    ((be = at.current) == null ? void 0 : be.hash) !== Q.content_hash && (at.current = { hash: Q.content_hash, key: crypto.randomUUID() });
    const b = await qe("", { method: "POST", headers: { "Idempotency-Key": at.current.key }, body: ve });
    we(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), d("/task-packages/" + b.receipt_id);
  }), je = (b) => tt(async () => {
    const be = Ie.current;
    Oe(null);
    const pe = await Dt(`/api/v1/task-packages/${q}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${o}` } });
    if (!pe.ok) {
      const xt = await pe.json().catch(() => ({}));
      throw new Error(xt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Ye = await pe.blob();
    if (be === Ie.current)
      if (b.mime_type.startsWith("text/")) {
        const xt = await Ye.slice(0, 1e6).text();
        be === Ie.current && Oe({ id: b.attachment_id, url: null, text: xt });
      } else if (b.mime_type.startsWith("image/")) Oe({ id: b.attachment_id, url: URL.createObjectURL(Ye), text: null });
      else {
        const xt = URL.createObjectURL(Ye), M = document.createElement("a");
        M.href = xt, M.download = "任务附件", M.click(), URL.revokeObjectURL(xt);
      }
  }), lt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !fe.length || x, onClick: () => {
        Ne(fe.at(-1) || ""), W(fe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Se || x, onClick: () => {
        W([...fe, me]), Ne(Se || "");
      }, children: "下一页" })
    ] })
  ] });
  return y.length ? Xe && T ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Rf, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ot ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Xe ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: T ? "" : "selected", onClick: () => d("/task-packages"), children: "任务包清单" }),
        !Xe && y.some((b) => At(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => d("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Oe(null), G((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => d("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    g && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      g
    ] }),
    se && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      se
    ] }),
    !q && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: Z, onChange: (b) => A(b.target.value), children: y.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !T && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: Y, onChange: (b) => v(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: Cn[b] }, b))
        ] })
      ] })
    ] }),
    x ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : T ? Me ? Ot ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        oe.filter((b) => b.project_id === Z).map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            b.title,
            " · 第",
            b.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: F, onClick: () => void tt(async () => {
            const be = await Dt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), pe = await be.json();
            if (!be.ok) throw new Error(pe.message);
            d("/task-packages/" + pe.receipt_id);
          }), children: "接入此成果" })
        ] }, b.id)),
        !oe.some((b) => b.project_id === Z) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: ze, onChange: (b) => Le(b.target.value), children: H.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: F, onClick: () => He("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: F, onChange: (b) => {
              var pe;
              const be = (pe = b.target.files) == null ? void 0 : pe[0];
              if (be) {
                if (be.size > 5242880) {
                  X("文件超过5MiB上限。");
                  return;
                }
                be.text().then((Ye) => {
                  Ve(Ye), re(null), X("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: ve, onChange: (b) => {
              Ve(b.target.value), re(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: F || !ve, onClick: () => void $e(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: F || !Q, onClick: () => void rt(), children: [
              /* @__PURE__ */ s.jsx(Pf, { size: 16 }),
              F ? "正在处理…" : "确认接入归档成果"
            ] })
          ] })
        ] })
      ] }),
      Q && /* @__PURE__ */ s.jsxs("section", { className: "panel package-preview", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          Q.name,
          " · 第",
          Q.package_version,
          "版"
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "归属项目：",
          ((E = y.find((b) => b.id === Q.project_id)) == null ? void 0 : E.name) || Q.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(Q.counts).map(([b, be]) => /* @__PURE__ */ s.jsxs("span", { children: [
          Nu[b],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: be })
        ] }, b)) }),
        /* @__PURE__ */ s.jsx("p", { children: Q.note }),
        Q.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : q ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => d("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: k.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((w = y.find((b) => b.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
              " · 第",
              k.package_version,
              "版 · ",
              Cn[k.status],
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
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => d("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        _e && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: F, onClick: () => void tt(async () => {
          const b = await Dt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${o}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), be = await b.json();
          if (!b.ok) throw new Error(be.message);
          d("/retrospectives/" + be.id);
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
          k.validation_errors.map((b, be) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "e" + be)),
          k.warnings.map((b, be) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "w" + be))
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
            Tn((K = k.task) == null ? void 0 : K.started_at),
            "　结束：",
            Tn((ke = k.task) == null ? void 0 : ke.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((Ue = k.participants) == null ? void 0 : Ue.map((b) => wu(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (st = k.issues) == null ? void 0 : st.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              Tn(b.due_at)
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
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (ut = k.events) != null && ut.length ? k.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Tn(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? am[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Yv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === k.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                wu(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((be) => {
                  var Ye;
                  const pe = (Ye = k.attachments) == null ? void 0 : Ye.find((xt) => xt.attachment_id === be);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: F || !pe || pe.state !== "verified", onClick: () => pe && void je(pe), children: [
                    pe ? Su[pe.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    be
                  ] }, be);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: F, onClick: () => void tt(async () => {
            const b = await qe("/" + q + "?event_after=" + k.event_next);
            te({ ...b, events: [...k.events || [], ...b.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (R = k.attachments) != null && R.length ? k.attachments.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                Su[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Cn[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: F || b.state !== "verified", onClick: () => void je(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ae && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Oe(null), children: "关闭预览" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "证据附件 · ",
              ae.id
            ] }),
            ae.url && /* @__PURE__ */ s.jsx("img", { src: ae.url, alt: "任务证据附件" }),
            ae.text && /* @__PURE__ */ s.jsx("pre", { children: ae.text })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (de = k.versions) == null ? void 0 : de.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === k.id, onClick: () => d("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            Cn[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (ne = k.diff) != null && ne.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Je = k.diff) == null ? void 0 : Je.changes.map((b, be) => {
            var pe, Ye, xt, M, j;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                Nu[b.section] || b.section,
                "有变化"
              ] }),
              "before" in b ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: wa(b.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: wa(b.after) })
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
                  (xt = b.before_order) == null ? void 0 : xt.join(" → "),
                  "　调整为　",
                  (M = b.after_order) == null ? void 0 : M.join(" → ")
                ] }),
                (j = b.changed) == null ? void 0 : j.map((ce) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      ce.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(ce.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(ce.after) })
                  ] })
                ] }, ce.id))
              ] })
            ] }, be);
          })
        ] }),
        (ye || _e && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          _e && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: F, onClick: () => void tt(async () => {
            const b = await Dt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${o}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            we("已提交重试，已保存事件与附件不会重复新增。"), G((be) => be + 1);
          }), children: "重试接入" }),
          ye && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: I, maxLength: 2e3, onChange: (b) => Ae(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: F || !I.trim(), onClick: () => void tt(async () => {
              var pe;
              const b = JSON.stringify({ reason: I }), be = k.id + b;
              ((pe = Fe.current) == null ? void 0 : pe.body) !== be && (Fe.current = { body: be, key: crypto.randomUUID() }), await qe("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": Fe.current.key }, body: b }), Oe(null), G((Ye) => Ye + 1);
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
            /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => d("/task-packages/" + b.id), children: b.name }),
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
          /* @__PURE__ */ s.jsx("td", { children: Cn[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Rf, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      lt
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function nm(o, f, y, d) {
  const T = await o(f, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(y) });
  d();
  const q = Date.now() + 1200 * 1e3;
  for (; Date.now() < q; ) {
    const Z = await o("/model-generation-jobs/" + T.job_id);
    if (Z.status === "succeeded") return Z.result;
    if (Z.status === "failed") throw new Error(Z.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((A) => setTimeout(A, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const En = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Xv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Qv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Qi = (o) => o ? new Date(o).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Zv({ api: o, path: f, navigate: y, projects: d, identity: T }) {
  var ut;
  const q = f.split("/")[2], Z = f.endsWith("/review"), [A, Y] = u.useState([]), [v, D] = u.useState(null), [J, k] = u.useState(null), [te, me] = u.useState(!1), [Ne, Se] = u.useState(!0), [Te, fe] = u.useState(""), [W, oe] = u.useState(""), [le, H] = u.useState(0), [xe, ze] = u.useState("llm"), [Le, Ge] = u.useState("task_process"), [He, ve] = u.useState(((ut = d.find((R) => At(R, "retrospective.generate"))) == null ? void 0 : ut.id) || ""), [Ve, Q] = u.useState([]), [re, g] = u.useState(""), [X, se] = u.useState([]), [we, x] = u.useState([]), [L, F] = u.useState(""), [ee, ie] = u.useState(!1), [G, I] = u.useState(""), [Ae, ae] = u.useState(""), [Oe, at] = u.useState(""), [Fe, Ie] = u.useState(null), [Xe, Me] = u.useState([]), [ye, _e] = u.useState(null), [qe, tt] = u.useState(""), [$e, rt] = u.useState(""), je = d.some((R) => At(R, "retrospective.generate")), lt = !!(v != null && v.is_current) && !!At(d.find((R) => R.id === v.project_id), "retrospective.edit"), Re = !!(v != null && v.is_current) && !!At(d.find((R) => R.id === v.project_id), "retrospective.review");
  u.useEffect(() => {
    I(""), F(""), ie(!1), fe(""), oe(""), at(""), Me([]), _e(null);
  }, [f]), u.useEffect(() => {
    let R = !1;
    return Se(!0), D(null), fe(""), (async () => {
      try {
        if (q) {
          const ne = await o(`/retrospectives/${q}${G ? "?revision_id=" + G : ""}`);
          R || (D(ne), k({ summary: ne.summary, findings: structuredClone(ne.findings), suggestions: structuredClone(ne.suggestions) }), ie(!1));
        } else {
          const ne = await o(`/retrospectives?limit=20${Ae ? "&state=" + Ae : ""}${Oe ? "&cursor=" + encodeURIComponent(Oe) : ""}`);
          R || (Y(ne.items), Ie(ne.next_cursor));
        }
      } catch (ne) {
        R || fe(ne.message);
      } finally {
        R || Se(!1);
      }
    })(), () => {
      R = !0;
    };
  }, [q, f, G, Ae, Oe, le]), u.useEffect(() => {
    if (q || !He || !je) return;
    let R = !1;
    return x([]), Q([]), se([]), g(""), (async () => {
      var ne;
      try {
        const [Je, b] = await Promise.all([o(`/task-packages?project_id=${He}&state=ready&limit=100`), o(`/knowledge/source-options?project_id=${He}&limit=100`)]);
        if (R) return;
        const be = Je.items.filter((pe) => pe.is_current);
        Q(be), g(((ne = be[0]) == null ? void 0 : ne.id) || ""), se(b.items);
      } catch (Je) {
        R || fe(Je.message);
      }
    })(), () => {
      R = !0;
    };
  }, [q, He, le]), u.useEffect(() => {
    if (!(ye != null && ye.asset_id) || ye.type !== "task_attachment") {
      tt(""), rt("");
      return;
    }
    let R = !1, de = "";
    return Dt("/api/v1/assets/" + ye.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + T } }).then(async (ne) => {
      if (!ne.ok) {
        const b = await ne.json();
        throw new Error(b.message);
      }
      const Je = await ne.blob();
      !R && /^(image\/|text\/plain)/.test(Je.type) && (de = URL.createObjectURL(Je), tt(de), rt(Je.type));
    }).catch((ne) => {
      R || fe(ne.message);
    }), () => {
      R = !0, de && URL.revokeObjectURL(de), tt("");
    };
  }, [ye, T]);
  const E = async (R) => {
    me(!0), fe(""), oe("");
    try {
      await R();
    } catch (de) {
      fe(de.message);
    } finally {
      me(!1);
    }
  }, w = () => ({ revision_id: v.revision_id, row_version: v.row_version, reason: L, evidence_checked: ee }), K = !!v && !!J && JSON.stringify(J) === JSON.stringify({ summary: v.summary, findings: v.findings, suggestions: v.suggestions }), ke = (R) => void E(async () => {
    const de = R === "submit" ? `/retrospectives/${q}/submit-review` : `/reviews/${v.revision_id}/${R}`;
    await o(de, { method: "POST", body: JSON.stringify(w()) }), oe("已保存本版本的审核状态与意见。"), H((ne) => ne + 1);
  }), Ue = (R, de) => R.map((ne, Je) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ne.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Xv[ne.claim_kind] }),
      ne.record_status && /* @__PURE__ */ s.jsx("strong", { children: ne.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ne.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    Z && lt ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ne.id, value: ne.text, onChange: (b) => k((be) => be && { ...be, [de]: be[de].map((pe, Ye) => Ye === Je ? { ...pe, text: b.target.value, review_state: "unconfirmed" } : pe) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ne.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ne.evidence_refs.map((b, be) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => _e(v.evidence.find((pe) => pe.id === b) || null), children: [
      "查看证据 ",
      be + 1
    ] }, b)) }),
    Z && lt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ne.review_state === "confirmed", onChange: (b) => k((be) => be && { ...be, [de]: be[de].map((pe, Ye) => Ye === Je ? { ...pe, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : pe) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ne.id)), st = (R) => R.map((de) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Qi(de.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Qv[de.event_type] || "未知事件类型：" + de.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof de.payload.note == "string" ? de.payload.note : Object.keys(de.payload).length ? JSON.stringify(de.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _e(v.evidence.find((ne) => ne.reference === "event:" + de.event_id) || null), children: "打开事件记录" }),
    de.evidence_refs.map((ne) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Je = v.evidence.find((b) => b.reference === "attachment:" + ne);
      Je ? _e(Je) : fe("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ne
    ] }, ne))
  ] }, de.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(rv, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Te && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Te,
      /* @__PURE__ */ s.jsx("button", { onClick: () => H((R) => R + 1), children: "重新加载" })
    ] }),
    W && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      W
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => H((R) => R + 1), disabled: te, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : q ? v && J ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: v.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            v.version,
            " · ",
            En[v.state],
            " · ",
            v.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            v.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: v.revision_id, onChange: (R) => I(R.target.value), children: v.revisions.map((R) => /* @__PURE__ */ s.jsxs("option", { value: R.id, children: [
            "v",
            R.version,
            " · ",
            En[R.state]
          ] }, R.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => y(`/retrospectives/${q}${Z ? "" : "/review"}`), children: Z ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !v.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Z && lt ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: J.summary, onChange: (R) => k({ ...J, summary: R.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: v.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            v.sources.task_package_id ? "固定任务包 v" + v.sources.package_version : "固定历史版本 " + v.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          v.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/task-packages/" + v.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            v.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: st(v.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            v.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: st(v.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            v.timeline.intervals.length ? v.timeline.intervals.map((R, de) => /* @__PURE__ */ s.jsxs("p", { children: [
              R.name,
              "：",
              R.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, de)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            v.timeline.deadlines.length ? v.timeline.deadlines.map((R) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                R.issue_id,
                " · ",
                R.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: R.reason || `明确期限 ${Qi(R.due_at || null)}；复核记录 ${Qi(R.accepted_at || null)}；晚于期限 ${R.late_seconds / 60} 分钟。` })
            ] }, R.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ s.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            Ue(J.findings, "findings"),
            /* @__PURE__ */ s.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            Ue(J.suggestions, "suggestions")
          ] })
        ] })
      ] }),
      Z && v.is_current && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ s.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: L, onChange: (R) => F(R.target.value) })
          ] }),
          lt && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: te || K || !L.trim(), onClick: () => void E(async () => {
              await o(`/retrospectives/${q}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...J }) }), oe("已保存新草稿版本，旧内容及审核意见保留。"), H((R) => R + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(v.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te || !K || !L.trim(), onClick: () => ke("submit"), children: "提交当前版本审核" })
          ] }),
          Re && v.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ee, onChange: (R) => ie(R.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te || !ee || !K || !L.trim(), onClick: () => ke("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te || !K || !L.trim(), onClick: () => ke("request-changes"), children: "退回修改" })
            ] })
          ] }),
          lt && v.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te || !K || !L.trim(), onClick: () => void E(async () => {
            const R = await o(`/retrospectives/${q}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            oe(R.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), H((de) => de + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      v.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: v.draft_ids.map((R) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => y("/knowledge/" + R + "/edit"), children: "打开经验候选" }, R)) })
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
        v.review_actions.map((R, de) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            R.version,
            " · ",
            En[R.action] || R.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: R.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Qi(R.created_at) })
        ] }, de))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      je && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: xe, onChange: (R) => ze(R.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Le, onChange: (R) => Ge(R.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: He, onChange: (R) => ve(R.target.value), children: d.filter((R) => At(R, "retrospective.generate")).map((R) => /* @__PURE__ */ s.jsx("option", { value: R.id, children: R.name }, R.id)) })
            ] })
          ] }),
          Le === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: re, onChange: (R) => g(R.target.value), children: Ve.map((R) => /* @__PURE__ */ s.jsxs("option", { value: R.id, children: [
              R.name,
              " · 包v",
              R.package_version
            ] }, R.id)) }),
            !Ve.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: X.map((R) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: we.includes(R.record_version_id), onChange: (de) => x(de.target.checked ? [...we, R.record_version_id] : we.filter((ne) => ne !== R.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              R.description || "未填写描述",
              " · 来源v",
              R.current_version
            ] })
          ] }, R.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Le === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te || (Le === "task_process" ? !re : !we.length || we.length > 20), onClick: () => void E(async () => {
              const R = await nm(o, "/retrospective-generation-jobs", { mode: Le, generation_mode: xe, task_package_id: Le === "task_process" ? re : null, record_version_ids: Le === "historical_case" ? we : [], template_version: "process-review-v1" }, () => oe("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              y("/retrospectives/" + R.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Ae, onChange: (R) => {
            ae(R.target.value), at(""), Me([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((R) => /* @__PURE__ */ s.jsx("option", { value: R, children: En[R] }, R))
          ] })
        ] }),
        A.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: A.map((R) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              R.title,
              /* @__PURE__ */ s.jsx("small", { children: R.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: R.sources.task_package_id ? "任务包 v" + R.sources.package_version : R.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              R.version,
              " · ",
              En[R.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/retrospectives/" + R.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/retrospectives/" + R.id + "/review"), children: "核查与审核" })
            ] })
          ] }, R.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !Xe.length, onClick: () => {
              at(Xe.at(-1) || ""), Me(Xe.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !Fe, onClick: () => {
              Me([...Xe, Oe]), at(Fe || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    ye && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => _e(null), children: /* @__PURE__ */ s.jsx(Vi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: ye.type === "process_event" ? "实际事件记录" : ye.type === "task_attachment" ? "任务附件" : ye.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: ye.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(ye.locator)
      ] }),
      qe && $e.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: qe, alt: "来源证据" }),
      qe && $e.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: qe }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const ks = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, Na = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Zf = { selected: [], text: "", row_version: 0 };
function Vv({ api: o, path: f, navigate: y, projects: d }) {
  var S, ue, Pe;
  const T = f.startsWith("/learn"), q = /^\/training\/results\/[^/]+$/.test(f), Z = f.startsWith("/learn/attempts/") || q ? f.split("/")[3] : "", A = /^\/training\/questions\/[^/]+$/.test(f), Y = A ? f.split("/")[3] : "", v = f === "/training/questions", D = f === "/training/packages", J = f === "/training/results", k = d.some((m) => At(m, "training.manage")), te = d.some((m) => At(m, "training.review")), [me, Ne] = u.useState("llm"), [Se, Te] = u.useState(""), [fe, W] = u.useState(((S = d.find((m) => At(m, "training.manage"))) == null ? void 0 : S.id) || ((ue = d[0]) == null ? void 0 : ue.id) || ""), [oe, le] = u.useState([]), [H, xe] = u.useState([]), [ze, Le] = u.useState([]), [Ge, He] = u.useState([]), [ve, Ve] = u.useState(null), [Q, re] = u.useState(null), [g, X] = u.useState(""), [se, we] = u.useState(!1), [x, L] = u.useState([]), [F, ee] = u.useState(["single_choice", "case_answer"]), [ie, G] = u.useState([]), [I, Ae] = u.useState("新人风险识别与复盘练习"), [ae, Oe] = u.useState("learning-" + Date.now()), [at, Fe] = u.useState(1), [Ie, Xe] = u.useState(null), [Me, ye] = u.useState({}), [_e, qe] = u.useState(null), [tt, $e] = u.useState("rules"), [rt, je] = u.useState("useful"), [lt, Re] = u.useState(""), [E, w] = u.useState({}), [K, ke] = u.useState({}), [Ue, st] = u.useState(""), [ut, R] = u.useState(""), [de, ne] = u.useState(null), [Je, b] = u.useState([]), [be, pe] = u.useState(!0), [Ye, xt] = u.useState(!1), [M, j] = u.useState(""), [ce, ge] = u.useState(""), [nt, _] = u.useState(0);
  u.useEffect(() => {
    R(""), b([]), X(""), we(!1), ge(""), j(""), G([]);
  }, [f]), u.useEffect(() => {
    let m = !1;
    return pe(!0), j(""), Ve(null), Xe(null), qe(null), (async () => {
      try {
        if (Z)
          if (q) {
            const Ee = await o(`/training/attempts/${Z}/result?teacher=true`);
            m || qe(Ee);
          } else {
            const Ee = await o("/training/attempts/" + Z);
            if (m) return;
            if (Xe(Ee), ye(Object.fromEntries(Ee.saved_answers.map((Ze) => [Ze.question_revision_id, { ...Ze.answer, row_version: Ze.row_version }]))), Ee.state === "submitted") {
              const Ze = await o(`/training/attempts/${Z}/result`);
              m || qe(Ze);
            }
          }
        else if (A) {
          const Ee = await o("/training/questions/" + Y);
          m || (Ve(Ee), re(structuredClone(Ee.content)));
        } else if (T) {
          const [Ee, Ze] = await Promise.all([o("/training/packages?learner=true&limit=100"), o("/training/attempts?limit=100")]);
          m || (xe(Ee.items), He(Ze.items));
        } else if (J) {
          const Ee = await o(`/training/results?limit=20${ut ? "&cursor=" + ut : ""}`);
          m || (He(Ee.items), ne(Ee.next_cursor));
        } else if (D) {
          const [Ee, Ze] = await Promise.all([o(`/training/packages?limit=20${ut ? "&cursor=" + ut : ""}`), o("/training/questions?state=approved&limit=100")]);
          m || (xe(Ee.items), le(Ze.items), ne(Ee.next_cursor));
        } else {
          const [Ee, Ze] = await Promise.all([o(`/training/questions?limit=20${Ue ? "&state=" + Ue : ""}${ut ? "&cursor=" + ut : ""}`), o("/knowledge/library?limit=100&project_id=" + fe)]);
          m || (le(Ee.items), Le(Ze.items), ne(Ee.next_cursor));
        }
      } catch (Ee) {
        m || j(Ee.message);
      } finally {
        m || pe(!1);
      }
    })(), () => {
      m = !0;
    };
  }, [f, fe, Ue, ut, nt]), u.useEffect(() => {
    if (!(_e != null && _e.grading_job) || !["queued", "running", "retrying"].includes(_e.grading_job.status)) return;
    const m = window.setTimeout(() => _((Ce) => Ce + 1), 1800);
    return () => clearTimeout(m);
  }, [(Pe = _e == null ? void 0 : _e.grading_job) == null ? void 0 : Pe.status, nt]);
  const he = async (m) => {
    xt(!0), j(""), ge("");
    try {
      await m();
    } catch (Ce) {
      j(Ce.message);
    } finally {
      xt(!1);
    }
  }, Qe = !!ve && !!Q && JSON.stringify(Q) === JSON.stringify(ve.content), kt = () => ({ revision_id: ve.revision_id, row_version: ve.row_version, reason: g, evidence_checked: se }), Mt = (m) => void he(async () => {
    await o(m === "submit" ? `/training/questions/${Y}/submit-review` : `/reviews/${ve.revision_id}/${m}`, { method: "POST", body: JSON.stringify(kt()) }), ge("题目审核状态已保存到统一审核记录。"), _((Ce) => Ce + 1);
  }), Tt = async (m) => {
    const Ce = Me[m.revision_id] || Zf, Ee = await o(`/training/attempts/${Z}/answers/${m.question_id}`, { method: "PUT", body: JSON.stringify(Ce) });
    return ye((Ze) => ({ ...Ze, [m.revision_id]: { ...Ce, row_version: Ee.row_version } })), Ee;
  }, it = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Je.length, onClick: () => {
        R(Je.at(-1) || ""), b(Je.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !de, onClick: () => {
        b([...Je, ut]), R(de || "");
      }, children: "下一页" })
    ] })
  ] }), vt = (m, Ce, Ee) => Ee ? [...m, Ce] : m.filter((Ze) => Ze !== Ce), c = (m) => void he(async () => {
    const Ce = await o("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: m.id, grading_mode: tt }) });
    y("/learn/attempts/" + Ce.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Ki, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: T ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    M && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      M
    ] }),
    ce && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      ce
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !T && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: v || A ? "selected" : "", onClick: () => y("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: D ? "selected" : "", onClick: () => y("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: J || q ? "selected" : "", onClick: () => y("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => y("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => _((m) => m + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    be ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : _e ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: ks[_e.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: _e.confirmed_total === null ? "待确认" : _e.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: _e.provisional_total === null ? "待评分" : _e.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: _e.max_score })
            ] })
          ] }),
          _e.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              _e.grading_job.status === "failed" ? "暂未完成" : _e.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            _e.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: _e.grading_job.error }),
            q && k && _e.grading_job.status === "failed" && _e.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void he(async () => {
              await o("/jobs/" + _e.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: _e.grading_job.row_version }) }), _((m) => m + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          _e.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: _e.restriction_note }),
          _e.answers.map((m, Ce) => {
            var Ee, Ze, Lt, Cs, Us, qt, Ea, Oa;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Ce + 1,
                "题 ",
                m.type ? Na[m.type] : ""
              ] }),
              m.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((Ee = m.answer) == null ? void 0 : Ee.text) || ((Ze = m.answer) == null ? void 0 : Ze.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Lt = m.reference_answer) == null ? void 0 : Lt.text) || ((Us = (Cs = m.reference_answer) == null ? void 0 : Cs.selected) == null ? void 0 : Us.join("、"))
                ] }),
                (qt = m.rubric) == null ? void 0 : qt.map((It, Ps) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  It.point,
                  " · ",
                  It.points,
                  "分"
                ] }, Ps)),
                /* @__PURE__ */ s.jsx("p", { children: (Ea = m.feedback) == null ? void 0 : Ea.message }),
                ((Oa = m.feedback) == null ? void 0 : Oa.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
                  "教员说明：",
                  m.feedback.human_review_reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "建议分：",
                m.suggested_score ?? "无",
                " · 确认分：",
                m.confirmed_score ?? "待确认",
                " · ",
                m.score_kind === "model_suggestion" ? "大模型建议" : m.score_kind === "rule_suggestion" ? "规则建议，需复核" : m.score_kind === "human_confirmed" ? "人工确认" : m.score_kind === "pending" ? "待评分" : "客观题规则评分"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "评分规则：",
                m.scoring_version,
                " · 评分器：",
                m.model_ref
              ] }),
              q && k && m.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: E[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? ""), onChange: (It) => w({ ...E, [m.id]: It.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: K[m.id] || "", onChange: (It) => ke({ ...K, [m.id]: It.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye || !(K[m.id] || "").trim() || (E[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? "")) === "", onClick: () => void he(async () => {
                  await o("/training/answers/" + m.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: m.row_version, score: Number(E[m.id] ?? m.confirmed_score ?? m.suggested_score), reason: K[m.id] }) }), ge("人工确认分已保存，原建议分和复核轨迹保留。"), _((It) => It + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, m.id);
          })
        ] })
      ] }),
      !q && _e.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: rt, onChange: (m) => je(m.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: lt, onChange: (m) => Re(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void he(async () => {
            await o(`/training/attempts/${Z}/feedback`, { method: "POST", body: JSON.stringify({ rating: rt, comment: lt }) }), ge("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : Ie ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          Ie.package_title,
          " · v",
          Ie.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      Ie.questions.map((m) => {
        const Ce = Me[m.revision_id] || Zf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            m.position,
            "题 · ",
            Na[m.type],
            " · ",
            m.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
          m.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + m.position + "题回答", value: Ce.text, onChange: (Ee) => ye({ ...Me, [m.revision_id]: { ...Ce, text: Ee.target.value } }) })
          ] }) : m.options.map((Ee) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: m.type === "single_choice" ? "radio" : "checkbox", name: m.revision_id, checked: Ce.selected.includes(Ee.id), onChange: (Ze) => ye({ ...Me, [m.revision_id]: { ...Ce, selected: m.type === "single_choice" ? [Ee.id] : vt(Ce.selected, Ee.id, Ze.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Ee.id.toUpperCase(),
              " · ",
              Ee.text
            ] })
          ] }, Ee.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void he(async () => {
              await Tt(m), ge("第" + m.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Ce.row_version
            ] })
          ] })
        ] }, m.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye, onClick: () => void he(async () => {
        for (const m of Ie.questions) await Tt(m);
        await o(`/training/attempts/${Z}/submit`, { method: "POST" }), _((m) => m + 1), ge("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : A && ve && Q ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Na[ve.type],
            " · v",
            ve.version,
            " · ",
            ks[ve.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: ve.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: Q.stem, disabled: !k, onChange: (m) => re({ ...Q, stem: m.target.value }) })
          ] }),
          Q.options.map((m, Ce) => {
            var Ee;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              m.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: m.text, disabled: !k, onChange: (Ze) => re({ ...Q, options: Q.options.map((Lt, Cs) => Cs === Ce ? { ...Lt, text: Ze.target.value } : Lt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((Ee = Q.answer.selected) == null ? void 0 : Ee.includes(m.id)) || !1, onChange: (Ze) => re({ ...Q, answer: { selected: vt(Q.answer.selected || [], m.id, Ze.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, m.id);
          }),
          ve.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: Q.answer.text || "", disabled: !k, onChange: (m) => re({ ...Q, answer: { text: m.target.value } }) })
            ] }),
            Q.rubric.map((m, Ce) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: m.point, disabled: !k, onChange: (Ee) => re({ ...Q, rubric: Q.rubric.map((Ze, Lt) => Lt === Ce ? { ...Ze, point: Ee.target.value } : Ze) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: m.keywords.join("，"), disabled: !k, onChange: (Ee) => re({ ...Q, rubric: Q.rubric.map((Ze, Lt) => Lt === Ce ? { ...Ze, keywords: Ee.target.value.split(/[,，]/).filter(Boolean) } : Ze) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: m.points, disabled: !k, onChange: (Ee) => re({ ...Q, rubric: Q.rubric.map((Ze, Lt) => Lt === Ce ? { ...Ze, points: Number(Ee.target.value) } : Ze) }) })
              ] })
            ] }, Ce))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          ve.source_versions.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: m }) }, m)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: g, onChange: (m) => X(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye || Qe || !g.trim(), onClick: () => void he(async () => {
              await o(`/training/questions/${Y}/draft`, { method: "PATCH", body: JSON.stringify({ ...kt(), content: Q }) }), ge("新题目版本已保存，不改变旧学习包与成绩。"), _((m) => m + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(ve.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !Qe || !g.trim(), onClick: () => Mt("submit"), children: "提交题目审核" })
          ] }),
          te && ve.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se, onChange: (m) => we(m.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !se || !Qe || !g.trim(), onClick: () => Mt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ye || !Qe || !g.trim(), onClick: () => Mt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          ve.revisions.map((m) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            ks[m.state]
          ] }, m.id)),
          ve.review_actions.map((m, Ce) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            ks[m.action] || m.action,
            " · ",
            m.reason
          ] }, Ce))
        ] })
      ] })
    ] }) : T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: tt, onChange: (m) => $e(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          H.length ? H.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: m.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              m.version,
              " · ",
              m.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye, onClick: () => c(m), children: "开始本次练习" })
          ] }, m.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Ge.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => y("/learn/attempts/" + m.id), children: [
            ks[m.state],
            " · ",
            ks[m.result_state],
            " · ",
            new Date(m.started_at).toLocaleString("zh-CN")
          ] }) }, m.id)),
          !Ge.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
        ] })
      ] })
    ] }) : J ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习完成与评分复核" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "学习包" }),
          /* @__PURE__ */ s.jsx("th", { children: "学员编号" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: Ge.map((m) => {
          var Ce;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              m.title,
              " · v",
              m.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Ce = m.learner_id) == null ? void 0 : Ce.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              ks[m.state],
              " · ",
              ks[m.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m.state !== "submitted", onClick: () => y("/training/results/" + m.id), children: "查看结果与复核" }) })
          ] }, m.id);
        }) })
      ] }) }),
      it
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
              /* @__PURE__ */ s.jsx("select", { value: fe, onChange: (m) => {
                W(m.target.value), G([]);
              }, children: d.filter((m) => At(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: Se, onChange: (m) => Te(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: I, onChange: (m) => Ae(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ae, onChange: (m) => Oe(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: at, onChange: (m) => Fe(Number(m.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: oe.filter((m) => m.project_id === fe).map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ie.includes(m.revision_id), onChange: (Ce) => G((Ee) => vt(Ee, m.revision_id, Ce.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Na[m.type],
              " · ",
              m.title,
              " · v",
              m.version
            ] })
          ] }, m.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ye || !ie.length || ie.length > 30 || !I.trim(), onClick: () => void he(async () => {
            await o("/training/packages", { method: "POST", body: JSON.stringify({ title: I, package_key: ae, version: at, project_id: fe, question_revision_ids: ie, role_scope: ["learner", "admin", "teacher"], audience_subjects: Se.split(/[,，\n]/).map((m) => m.trim()).filter(Boolean) }) }), ge("学习包草稿已建立，发布后学员可使用。"), _((m) => m + 1);
          }), children: [
            "创建学习包草稿（",
            ie.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: H.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            m.title,
            " · v",
            m.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            ks[m.state],
            " · ",
            m.question_count,
            "题 · ",
            m.package_key
          ] }),
          m.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => void he(async () => {
            await o(`/training/packages/${m.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: m.row_version, reason: "发布已审核题目的固定版本学习包" }) }), ge("学习包已发布。"), _((Ce) => Ce + 1);
          }), children: "发布此学习包版本" })
        ] }, m.id)) }),
        it
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
            /* @__PURE__ */ s.jsx("select", { value: fe, onChange: (m) => {
              W(m.target.value), L([]);
            }, children: d.filter((m) => At(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            ze.map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: x.includes(m.revision_id), onChange: (Ce) => L((Ee) => vt(Ee, m.revision_id, Ce.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                m.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  m.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, m.revision_id)),
            !ze.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(Na).map(([m, Ce]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: F.includes(m), onChange: (Ee) => ee((Ze) => vt(Ze, m, Ee.target.checked)) }),
            Ce
          ] }, m)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: me, onChange: (m) => Ne(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye || !x.length || x.length > 10 || !F.length, onClick: () => void he(async () => {
            const m = await nm(o, "/training/generation-jobs", { knowledge_revision_ids: x, types: F, generation_mode: me }, () => ge("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            ge("已生成或复用" + m.items.length + "道候选题，仍需核查答案与来源后提交审核。"), _((Ce) => Ce + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: Ue, onChange: (m) => {
            st(m.target.value), R(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((m) => /* @__PURE__ */ s.jsx("option", { value: m, children: ks[m] }, m))
          ] })
        ] }),
        oe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: oe.map((m) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: m.title }),
            /* @__PURE__ */ s.jsx("td", { children: Na[m.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              m.version,
              " · ",
              ks[m.state],
              m.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/training/questions/" + m.id), children: "核查与审核" }) })
          ] }, m.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        it
      ] })
    ] })
  ] });
}
function Jv({ api: o }) {
  var Te, fe;
  const [f, y] = u.useState(null), [d, T] = u.useState([]), [q, Z] = u.useState("openai"), [A, Y] = u.useState(""), [v, D] = u.useState(!1), [J, k] = u.useState(""), [te, me] = u.useState("");
  u.useEffect(() => {
    let W = !1;
    return Promise.all([o("/models/settings"), o("/models/presets")]).then(([oe, le]) => {
      if (W) return;
      T(le.items);
      const H = le.items.find((xe) => xe.base_url === oe.base_url);
      if (!oe.model && !oe.api_key_configured) {
        const xe = le.items[0];
        Z(xe.id), y({ ...oe, base_url: xe.base_url, model: xe.default_model });
      } else
        Z((H == null ? void 0 : H.id) || "custom"), y(oe);
    }).catch((oe) => {
      W || k(oe.message);
    }), () => {
      W = !0;
    };
  }, []);
  const Ne = (W) => {
    const oe = d.find((le) => le.id === W);
    Z(W), Y(""), me(""), k(""), f && y({ ...f, base_url: (oe == null ? void 0 : oe.base_url) || "", model: (oe == null ? void 0 : oe.default_model) || "", api_key_configured: !1 });
  }, Se = async () => {
    if (f) {
      D(!0), k(""), me("");
      try {
        const { api_key_configured: W, ...oe } = f, le = await o("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !0, ...A ? { api_key: A } : {} }) });
        if (y(le), Y(""), me("配置已保存，正在测试连接…"), (await o("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        me("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (W) {
        me(""), k(W.message);
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
      J && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: J }),
      te && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: te }),
      f ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "模型服务",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: v, value: q, onChange: (W) => Ne(W.target.value), children: [
            d.map((W) => /* @__PURE__ */ s.jsx("option", { value: W.id, children: W.name }, W.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        q === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: v, value: f.base_url, onChange: (W) => y({ ...f, base_url: W.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: v, value: f.model, onChange: (W) => y({ ...f, model: W.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: v, value: f.model, onChange: (W) => y({ ...f, model: W.target.value }), children: [
            !((Te = d.find((W) => W.id === q)) != null && Te.models.some((W) => W.id === f.model)) && /* @__PURE__ */ s.jsxs("option", { value: f.model, children: [
              f.model,
              "（已保存）"
            ] }),
            (fe = d.find((W) => W.id === q)) == null ? void 0 : fe.models.map((W) => /* @__PURE__ */ s.jsx("option", { value: W.id, children: W.name }, W.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: v, value: A, onChange: (W) => Y(W.target.value), placeholder: f.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: f.timeout_seconds, onChange: (W) => y({ ...f, timeout_seconds: Number(W.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: f.max_tokens, onChange: (W) => y({ ...f, max_tokens: Number(W.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            f.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: v || !f.model || !A.trim() && !f.api_key_configured, onClick: () => void Se(), children: v ? "正在保存并测试…" : "保存并测试" }),
          f.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: v, onClick: () => {
            D(!0), k("");
            const { api_key_configured: W, ...oe } = f;
            o("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !1 }) }).then((le) => {
              y(le), me("云端调用已停用。");
            }).catch((le) => k(le.message)).finally(() => D(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Kv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function $v({ api: o, path: f, navigate: y, projects: d, identity: T, canManageModels: q }) {
  var F, ee, ie;
  const Z = f === "/settings/models", A = q, Y = d.some((G) => G.can_run), [v, D] = u.useState(((F = d.find((G) => G.can_run)) == null ? void 0 : F.id) || ""), [J, k] = u.useState([]), [te, me] = u.useState([]), [Ne, Se] = u.useState(null), [Te, fe] = u.useState(Kv), [W, oe] = u.useState("llm"), [le, H] = u.useState(sessionStorage.getItem("b07-extraction-" + T) || ""), [xe, ze] = u.useState(null), [Le, Ge] = u.useState(!1), [He, ve] = u.useState(!0), [Ve, Q] = u.useState(""), [re, g] = u.useState(""), [X, se] = u.useState(0), we = async (G) => {
    Ge(!0), Q(""), g("");
    try {
      await G();
    } catch (I) {
      Q(I.message);
    } finally {
      Ge(!1);
    }
  };
  u.useEffect(() => {
    let G = !1;
    return ve(!0), Q(""), me([]), (async () => {
      var Ae;
      try {
        if (Z) {
          if (!A) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!Y || !v) throw new Error("当前身份没有知识加工权限。");
          const [ae, Oe] = await Promise.all([o(`/knowledge/source-options?project_id=${v}&limit=100`), o(`/knowledge/taxonomies?project_id=${v}`)]);
          G || (k(ae.items), Se(Oe.items[0] || null), fe(structuredClone(((Ae = Oe.items[0]) == null ? void 0 : Ae.categories) || Oe.suggested_categories)));
        }
      } catch (ae) {
        G || Q(ae.message);
      } finally {
        G || ve(!1);
      }
    })(), () => {
      G = !0;
    };
  }, [f, v, X]), u.useEffect(() => {
    if (!le || Z) return;
    let G = !1, I;
    const Ae = async () => {
      try {
        const ae = await o("/knowledge/extraction-jobs/" + le);
        if (G) return;
        ze(ae), ["queued", "running", "retrying"].includes(ae.status) && (I = window.setTimeout(() => void Ae(), 1800));
      } catch (ae) {
        G || Q(ae.message);
      }
    };
    return Ae(), () => {
      G = !0, window.clearTimeout(I);
    };
  }, [le, f, X]);
  const x = (G, I) => fe((Ae) => Ae.map((ae, Oe) => Oe === G ? { ...ae, ...I } : ae)), L = JSON.stringify(Te) !== JSON.stringify((Ne == null ? void 0 : Ne.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Z ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: Z ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    Ve && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ve
    ] }),
    re && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: re }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: Z ? "" : "selected", onClick: () => y("/extraction"), children: "施工要点萃取" }),
        A && /* @__PURE__ */ s.jsx("button", { className: Z ? "selected" : "", onClick: () => y("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => y("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => y("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => se((G) => G + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    He ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : Z && A ? /* @__PURE__ */ s.jsx(Jv, { api: o }) : !Z && Y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: v, onChange: (G) => D(G.target.value), children: d.filter((G) => G.can_run).map((G) => /* @__PURE__ */ s.jsx("option", { value: G.id, children: G.name }, G.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            Ne ? "分类 v" + Ne.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Te.map((G, I) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (I + 1), value: G.code, onChange: (Ae) => x(I, { code: Ae.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (I + 1), value: G.name, onChange: (Ae) => x(I, { name: Ae.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: G.focus, onChange: (Ae) => x(I, { focus: Ae.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: G.keywords.join("，"), onChange: (Ae) => x(I, { keywords: Ae.target.value.split(/[,，]/).map((ae) => ae.trim()).filter(Boolean) }) })
            ] }),
            Te.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => fe((Ae) => Ae.filter((ae, Oe) => Oe !== I)), children: "移除此类别" })
          ] }, I)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Te.length >= 100, onClick: () => fe([...Te, { code: "category_" + (Te.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(vv, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le || !L, onClick: () => void we(async () => {
              const G = await o("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: v, expected_version: (Ne == null ? void 0 : Ne.version) || 0, categories: Te }) });
              Se(G), fe(G.categories), g("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => me(J.slice(0, 20).map((G) => G.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: J.map((G) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te.includes(G.record_version_id), onChange: (I) => me((Ae) => I.target.checked ? [...Ae, G.record_version_id] : Ae.filter((ae) => ae !== G.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              G.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "固定来源 v",
                G.current_version
              ] })
            ] })
          ] }, G.id)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "加工方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: W, onChange: (G) => oe(G.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Le || !Ne || L || !te.length || te.length > 20, onClick: () => void we(async () => {
            const G = await o("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: te, taxonomy_id: Ne.id, mode: W }) });
            H(G.job_id), sessionStorage.setItem("b07-extraction-" + T, G.job_id), g("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            te.length,
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
          (ee = xe.result.items) == null ? void 0 : ee.map((G) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => y("/knowledge/" + G.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            G.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, G.item_id)),
          (ie = xe.result.missing_information) == null ? void 0 : ie.map((G, I) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            G
          ] }, I)),
          xe.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le, onClick: () => void we(async () => {
            await o("/jobs/" + xe.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: xe.row_version }) }), se((G) => G + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const gu = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Vf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Jf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, Zi = (o) => new Date(o).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Wv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function Fv({ embedded: o = !1 }) {
  var nt;
  const [f, y] = u.useState(localStorage.getItem("b01-identity") || "admin"), [d, T] = u.useState(Gi()), [q, Z] = u.useState(!1), A = d === "/platform/services", Y = d.startsWith("/archive-review/"), v = /^\/imports\/ai_[a-f0-9]{32}$/.test(d), [D, J] = u.useState(["/sources", "/imports", "/records"].some((_) => Gi().startsWith(_))), k = ["/search", "/releases", "/knowledge/library"].includes(d) || /^\/knowledge\/[^/]+$/.test(d) && d !== "/knowledge/drafts", te = !k && ["/quality", "/knowledge", "/reviews"].some((_) => d.startsWith(_)), me = d.startsWith("/training") || d.startsWith("/learn"), Ne = d.startsWith("/workflows"), Se = d.startsWith("/standards"), Te = Ne || Se || d.startsWith("/extraction") || d === "/settings/models" || d === "/settings/scenes", fe = d.startsWith("/retrospectives"), W = d.startsWith("/task-packages"), oe = d === "/records", le = !v && ["/sources", "/imports", "/records"].some((_) => d.startsWith(_)), [H, xe] = u.useState(null), [ze, Le] = u.useState([]), [Ge, He] = u.useState({}), [ve, Ve] = u.useState(!1), [Q, re] = u.useState(""), [g, X] = u.useState(""), [se, we] = u.useState(!0), [x, L] = u.useState(!1), [F, ee] = u.useState(0), [ie, G] = u.useState(""), [I, Ae] = u.useState(""), [ae, Oe] = u.useState(""), [at, Fe] = u.useState(null), [Ie, Xe] = u.useState([]), [Me, ye] = u.useState(null), [_e, qe] = u.useState(!1), [tt, $e] = u.useState("demo-airport"), [rt, je] = u.useState("success"), [lt, Re] = u.useState(null), [E, w] = u.useState(""), [K, ke] = u.useState("processor"), [Ue, st] = u.useState("demo-airport"), [ut, R] = u.useState([]);
  async function de(_, he = {}) {
    const Qe = await Dt("/api/v1" + _, {
      ...he,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${f}`, ...he.headers }
    });
    if (!Qe.ok) {
      const kt = await Qe.json().catch(() => ({}));
      throw new Error(kt.message || `请求失败（${Qe.status}），请刷新后重试。`);
    }
    return Qe.json();
  }
  const ne = (_) => {
    var Qe, kt;
    const he = window;
    o && ((Qe = he.QaxcHasPendingEdits) != null && Qe.call(he)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((kt = he.QaxcClearPendingEdits) == null || kt.call(he), wj(_), T(Gi()), re(""), ye(null), Oe(""), Xe([]));
  };
  u.useEffect(() => {
    const _ = () => T(Gi());
    return window.addEventListener("popstate", _), window.addEventListener("hashchange", _), () => {
      window.removeEventListener("popstate", _), window.removeEventListener("hashchange", _);
    };
  }, []), u.useEffect(() => {
    const _ = () => Z(!0);
    return window.addEventListener("b-session-expired", _), () => window.removeEventListener("b-session-expired", _);
  }, []), u.useEffect(() => {
    let _ = !1;
    we(!0), re(""), xe(null), Re(null), Le([]), R([]);
    async function he() {
      try {
        const Qe = await de("/me");
        if (_) return;
        const kt = window.QaxcProjectNames || {};
        o && (Qe.projects = Qe.projects.map((it) => ({ ...it, name: kt[it.id] || it.name })));
        const Mt = window.QaxcProjectId;
        o && Mt && (Qe.projects = Qe.projects.filter((it) => it.id === Mt)), xe(Qe);
        const Tt = await de("/health");
        if (_ || (Ve(Tt.worker_online), v || A || Y || le || te || k || W || fe || me || Te)) return;
        if (d === "/settings/access") {
          if (!Qe.projects.some((c) => c.can_manage)) return;
          const [it, vt] = await Promise.all([de("/access"), de("/audit-events?limit=10")]);
          if (_) return;
          Re(it), R(vt.items), w((c) => {
            var S;
            return it.users.some((ue) => ue.id === c) ? c : ((S = it.users[0]) == null ? void 0 : S.id) || "";
          });
        } else {
          const [it, vt] = await Promise.all([
            de(`/jobs?limit=12${I ? `&kind=${I}` : ""}${ie ? `&status=${ie}` : ""}${ae ? `&cursor=${encodeURIComponent(ae)}` : ""}`),
            de("/dashboard")
          ]);
          if (_) return;
          Le(it.items), Fe(it.next_cursor), He(vt.counts);
        }
      } catch (Qe) {
        _ || re(Qe.message);
      } finally {
        _ || we(!1);
      }
    }
    return he(), () => {
      _ = !0;
    };
  }, [f, d, ie, I, ae, F]), u.useEffect(() => {
    if (!H || v || A || Y || d === "/settings/access" || le || te || k || W || fe || me || Te) return;
    let _ = !1;
    const he = window.setInterval(async () => {
      try {
        const [Qe, kt, Mt] = await Promise.all([
          de(`/jobs?limit=12${I ? `&kind=${I}` : ""}${ie ? `&status=${ie}` : ""}${ae ? `&cursor=${encodeURIComponent(ae)}` : ""}`),
          de("/dashboard"),
          de("/health")
        ]);
        if (_) return;
        Le(Qe.items), Fe(Qe.next_cursor), He(kt.counts), Ve(Mt.worker_online), ye((Tt) => Tt ? Qe.items.find((it) => it.id === Tt.id) || Tt : null), re("");
      } catch (Qe) {
        _ || (re(Qe.message), Ve(!1));
      }
    }, 2e3);
    return () => {
      _ = !0, clearInterval(he);
    };
  }, [f, d, ie, I, ae, H == null ? void 0 : H.id]);
  const Je = async (_) => {
    L(!0), re(""), X("");
    try {
      await _(), ee((he) => he + 1);
    } catch (he) {
      re(he.message);
    } finally {
      L(!1);
    }
  }, b = () => Je(async () => {
    await de("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: tt, scenario: rt, duration_seconds: 6 })
    }), qe(!1), X("任务已保存，处理服务会自动执行。"), ne("/jobs");
  }), be = (_) => Je(async () => {
    await de(`/jobs/${_.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: _.row_version })
    }), X("已提交重试，原任务和来源保持不变。");
  }), pe = (_) => Je(async () => {
    const he = await Dt(`/api/v1/assets/${_.result_ref}/content`, { headers: { Authorization: `Bearer dev-${f}` } });
    if (!he.ok) {
      const Mt = await he.json();
      throw new Error(Mt.message);
    }
    const Qe = document.createElement("a"), kt = URL.createObjectURL(await he.blob());
    Qe.href = kt, Qe.download = `演示检查结果-${_.id.slice(0, 8)}.txt`, Qe.click(), URL.revokeObjectURL(kt), X("演示结果已下载。");
  }), Ye = !Ot && (H == null ? void 0 : H.projects.some((_) => _.can_run)), xt = (_) => {
    const he = H == null ? void 0 : H.projects.find((kt) => kt.id === _.project_id);
    if ((he == null ? void 0 : he.permissions) == null) return !!(he != null && he.can_run);
    const Qe = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!Qe[_.kind] && he.permissions.includes(Qe[_.kind]);
  }, M = H == null ? void 0 : H.projects.some((_) => _.can_manage), j = Object.fromEntries(((H == null ? void 0 : H.projects) || []).map((_) => [_.id, _.name])), ce = v ? "A 成果接入" : A ? "平台服务" : Y ? "归档成果复盘" : me ? d.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Te ? Ne ? "隐患分析与知识成果" : Se ? "规范原文与版本" : d === "/settings/models" ? "云端模型配置" : d === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : fe ? "过程复盘与经验" : W ? "归档成果与证据" : k ? d === "/releases" ? "知识发布管理" : d === "/search" ? "知识检索" : "已发布知识库" : te ? "知识加工与审核" : le ? oe ? "风险数据" : d.startsWith("/sources") ? "历史数据来源" : d.startsWith("/imports") ? "历史项目" : "风险数据" : d === "/settings/access" ? "成员与权限" : d === "/jobs" ? "处理任务" : "我的工作台", ge = (Ge.queued || 0) + (Ge.running || 0) + (Ge.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !o && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(qf, { size: 26 }) }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          "工程风险",
          /* @__PURE__ */ s.jsx("span", { children: "知识与复盘培训中心" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "workspace-label", children: Ot ? "质量安全小察 / 知识与学习" : "B模块 / 开发工作区" }),
      /* @__PURE__ */ s.jsxs("nav", { "aria-label": "主导航", children: [
        Ot && /* @__PURE__ */ s.jsxs("button", { className: "nav-item", onClick: () => {
          window.location.href = "/quality/";
        }, children: [
          /* @__PURE__ */ s.jsx(Uf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Uf, "我的工作台"], ["/jobs", Ij, "处理任务"]].map(([_, he, Qe]) => {
          const kt = he;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Qe), className: d === _ || _ === "/workbench" && d === "/" ? "nav-item active" : "nav-item", onClick: () => ne(String(_)), children: [
            /* @__PURE__ */ s.jsx(kt, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Qe) }),
            /* @__PURE__ */ s.jsx(Ws, { size: 15 })
          ] }, String(_));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${le ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": D, "aria-controls": "governance-menu", onClick: () => J((_) => !_), children: [
          /* @__PURE__ */ s.jsx(Xi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(Ws, { className: D ? "expanded" : "", size: 15 })
        ] }),
        D && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, he]) => /* @__PURE__ */ s.jsx("button", { "aria-label": he, className: d.startsWith(_) ? "active" : "", onClick: () => ne(_), children: he }, _)) }),
        /* @__PURE__ */ s.jsxs("button", { className: te || Te ? "nav-item active" : "nav-item", onClick: () => ne("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(On, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => ne("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(On, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: W ? "nav-item active" : "nav-item", onClick: () => ne("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(On, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: fe ? "nav-item active" : "nav-item", onClick: () => ne("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(Tf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: me ? "nav-item active" : "nav-item", onClick: () => ne(H != null && H.projects.some((_) => _.roles.some((he) => ["admin", "teacher", "reviewer"].includes(he))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(Ki, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: d === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ne("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(Sv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Xi, { size: 19 }),
        /* @__PURE__ */ s.jsx("strong", { children: "项目范围隔离" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "记录、文件和操作权限",
          /* @__PURE__ */ s.jsx("br", {}),
          "随当前身份实时检查。"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "sidebar-bottom", children: [
        /* @__PURE__ */ s.jsx("span", { className: "dot" }),
        Ot ? "平台账号 · 项目授权" : "本地开发 · B07",
        /* @__PURE__ */ s.jsx("span", { className: "version", children: "v0.7" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: o ? "main-shell embedded-main" : "main-shell", children: [
      !o && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx(Ws, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: ce })
        ] }),
        Ot ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: f, onChange: (_) => {
            localStorage.setItem("b01-identity", _.target.value), y(_.target.value), ye(null), Oe(""), Xe([]), X("");
          }, children: Wv.map(([_, he]) => /* @__PURE__ */ s.jsx("option", { value: _, children: he }, _)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        o && !v && !k && !A && !le && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (le ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : me ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : te || Te ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : W ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([_, he]) => /* @__PURE__ */ s.jsx("button", { className: d === _ ? "button primary" : "button ghost", onClick: () => ne(_), children: he }, _)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: ce }),
            /* @__PURE__ */ s.jsx("p", { children: v ? "指定版本接入、证据校验与过程复盘。" : me ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : Ne ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : Se ? "保存规范原文与适用版本，核对来源后审核发布。" : Te ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : fe ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : W ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : te ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : le ? oe ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : d === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            o && le && /* @__PURE__ */ s.jsx("nav", { "aria-label": "风险数据视图", className: "toprow-tabs", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, he]) => /* @__PURE__ */ s.jsx("button", { className: d === _ ? "button primary" : "button ghost", onClick: () => ne(_), children: he }, _)) }),
            !o && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => ee((_) => _ + 1), disabled: se, children: [
              /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
              "刷新"
            ] }),
            !Ot && !le && !te && !k && !W && !fe && !me && !Te && d !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Ye || x, onClick: () => {
              var _;
              $e(((_ = H == null ? void 0 : H.projects.find((he) => he.can_run)) == null ? void 0 : _.id) || "demo-airport"), qe(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(Mf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Ot && !le && !te && !k && !W && !fe && !me && !Te && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(qf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        q && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        Q && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
          Q,
          /* @__PURE__ */ s.jsx("button", { onClick: () => ee((_) => _ + 1), children: "重新加载" })
        ] }),
        g && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
          g,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => X(""), children: /* @__PURE__ */ s.jsx(Vi, { size: 16 }) })
        ] }),
        q ? null : v ? H ? /* @__PURE__ */ s.jsx(Aj, { id: d.split("/").pop(), identity: H.id, projects: H.projects, navigate: ne }) : /* @__PURE__ */ s.jsx("p", { children: Q || "正在读取身份…" }) : se ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Df, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : Q ? null : A ? /* @__PURE__ */ s.jsx(Rj, { navigate: ne }, F) : Y ? /* @__PURE__ */ s.jsx(Uj, { deliveryId: decodeURIComponent(d.split("/")[2]), navigate: ne }, d) : me ? /* @__PURE__ */ s.jsx(Vv, { api: de, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [] }, f) : Ne ? /* @__PURE__ */ s.jsx(zj, { api: de, projects: (H == null ? void 0 : H.projects) || [], identity: f }, f + ":" + (H == null ? void 0 : H.projects.map((_) => _.id).join(","))) : Se ? /* @__PURE__ */ s.jsx(Cj, { api: de, projects: (H == null ? void 0 : H.projects) || [], identity: f }, f + ":" + (H == null ? void 0 : H.projects.map((_) => _.id).join(","))) : d === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(Sj, { api: de, projects: (H == null ? void 0 : H.projects) || [] }) }) : Te ? /* @__PURE__ */ s.jsx($v, { api: de, identity: f, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [], canManageModels: !!(H != null && H.can_manage_models) }, f) : fe ? /* @__PURE__ */ s.jsx(Zv, { api: de, identity: f, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [] }, f) : W ? /* @__PURE__ */ s.jsx(Gv, { identity: f, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [] }, f) : k ? /* @__PURE__ */ s.jsx(qv, { identity: f, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [] }, f) : te ? /* @__PURE__ */ s.jsx(Uv, { api: de, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [], identity: f }, f) : oe ? /* @__PURE__ */ s.jsx(Rv, { api: de }, f) : le ? /* @__PURE__ */ s.jsx(Cv, { api: de, path: d, navigate: ne, projects: (H == null ? void 0 : H.projects) || [], identity: f }, f) : d === "/settings/access" ? M ? lt && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                lt.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: lt.bindings.map((_) => {
                var he;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (he = lt.users.find((Qe) => Qe.id === _.user_id)) == null ? void 0 : he.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: j[_.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Vf[_.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: _.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: x,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Je(async () => {
                          await de(`/role-bindings/${_.id}`, { method: "DELETE", body: JSON.stringify({ row_version: _.row_version }) }), X("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, _.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Xi, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: E, onChange: (_) => w(_.target.value), children: lt.users.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Ue, onChange: (_) => st(_.target.value), children: lt.projects.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: K, onChange: (_) => ke(_.target.value), children: Object.entries(Vf).filter(([_]) => _ !== "admin" && _ !== "a_service").map(([_, he]) => /* @__PURE__ */ s.jsx("option", { value: _, children: he }, _)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: x || !E, onClick: () => void Je(async () => {
              await de("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: E, project_id: Ue, role: K }) }), X("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(_l, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            ut.length ? ut.map((_) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[_.action] || _.action }),
              /* @__PURE__ */ s.jsx("span", { children: j[_.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: Zi(_.created_at) })
            ] }, _.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Xi, { size: 38 }),
          /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有管理权限" }),
          /* @__PURE__ */ s.jsx("p", { children: "可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。" })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("section", { className: "metrics", "aria-label": "任务概况", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理中" }),
              /* @__PURE__ */ s.jsx("strong", { children: ge }),
              /* @__PURE__ */ s.jsx("small", { children: "包含等待与自动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "已完成" }),
              /* @__PURE__ */ s.jsx("strong", { children: Ge.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Ge.failed ? "danger-color" : "", children: Ge.failed || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ s.jsxs("strong", { children: [
                /* @__PURE__ */ s.jsx("i", { className: `dot ${ve ? "green" : "orange"}` }),
                ve ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: ve ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: d === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: I, onChange: (_) => {
                Ae(_.target.value), Oe(""), Xe([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Jf).map(([_, he]) => /* @__PURE__ */ s.jsx("option", { value: _, children: he }, _))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ie, onChange: (_) => {
                G(_.target.value), Oe(""), Xe([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(gu).map(([_, he]) => /* @__PURE__ */ s.jsx("option", { value: _, children: he }, _))
              ] })
            ] }),
            ze.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "状态" }),
                /* @__PURE__ */ s.jsx("th", { children: "进度" }),
                /* @__PURE__ */ s.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: ze.map((_) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => ye(_), children: _.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    j[_.project_id] || _.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Jf[_.kind] || _.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${_.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  gu[_.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${_.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    _.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: Zi(_.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  _.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ne("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ye(_), children: "详情" }),
                  _.status === "failed" && xt(_) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: x, onClick: () => void be(_), children: "重试任务" }),
                  _.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: x, onClick: () => void pe(_), children: /* @__PURE__ */ s.jsx(Af, { size: 17 }) })
                ] }) })
              ] }, _.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(On, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ie ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ie ? "切换筛选条件查看其他任务。" : Ye ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Ye && !ie && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => qe(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(_l, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                ze.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !Ie.length, onClick: () => {
                  Oe(Ie[Ie.length - 1]), Xe(Ie.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !at, onClick: () => {
                  Xe([...Ie, ae]), Oe(at || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          d !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(Tf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ne("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(_l, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Ot ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    _e && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => qe(!1), children: /* @__PURE__ */ s.jsx(Vi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: tt, onChange: (_) => $e(_.target.value), children: H == null ? void 0 : H.projects.filter((_) => _.can_run).map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: rt, onChange: (_) => je(_.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !ve && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => qe(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: x || !Ye, onClick: () => void b(), children: [
          x ? /* @__PURE__ */ s.jsx(Df, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(Mf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Me && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => ye(null), children: /* @__PURE__ */ s.jsx(Vi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Me.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        gu[Me.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Me.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: j[Me.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Me.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: Zi(Me.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: Zi(Me.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Me.id })
      ] }),
      Me.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Me.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Me.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: x, onClick: () => void pe(Me), children: [
        /* @__PURE__ */ s.jsx(Af, { size: 16 }),
        "下载演示结果"
      ] }),
      (nt = Me.result_links) == null ? void 0 : nt.map((_) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ne(_.path), children: _.label }, _.path)),
      Me.status === "failed" && xt(Me) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: x, onClick: () => void be(Me), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function Iv(o) {
  const f = Nj.createRoot(o);
  return f.render(/* @__PURE__ */ s.jsx(Fv, { embedded: !0 })), () => f.unmount();
}
export {
  Iv as mountKnowledge
};
