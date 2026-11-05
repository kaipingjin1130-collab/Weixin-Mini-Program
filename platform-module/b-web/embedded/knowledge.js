var ou = { exports: {} }, Rn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mf;
function xj() {
  if (mf) return Rn;
  mf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function _(o, T, q) {
    var V = null;
    if (q !== void 0 && (V = "" + q), T.key !== void 0 && (V = "" + T.key), "key" in T) {
      q = {};
      for (var A in T)
        A !== "key" && (q[A] = T[A]);
    } else q = T;
    return T = q.ref, {
      $$typeof: u,
      type: o,
      key: V,
      ref: T !== void 0 ? T : null,
      props: q
    };
  }
  return Rn.Fragment = h, Rn.jsx = _, Rn.jsxs = _, Rn;
}
var xf;
function jj() {
  return xf || (xf = 1, ou.exports = xj()), ou.exports;
}
var s = jj(), du = { exports: {} }, Dn = {}, hu = { exports: {} }, fu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jf;
function vj() {
  return jf || (jf = 1, (function(u) {
    function h(b, Q) {
      var le = b.length;
      b.push(Q);
      e: for (; 0 < le; ) {
        var ke = le - 1 >>> 1, f = b[ke];
        if (0 < T(f, Q))
          b[ke] = Q, b[le] = f, le = ke;
        else break e;
      }
    }
    function _(b) {
      return b.length === 0 ? null : b[0];
    }
    function o(b) {
      if (b.length === 0) return null;
      var Q = b[0], le = b.pop();
      if (le !== Q) {
        b[0] = le;
        e: for (var ke = 0, f = b.length, Y = f >>> 1; ke < Y; ) {
          var $ = 2 * (ke + 1) - 1, I = b[$], ce = $ + 1, Z = b[ce];
          if (0 > T(I, le))
            ce < f && 0 > T(Z, I) ? (b[ke] = Z, b[ce] = le, ke = ce) : (b[ke] = I, b[$] = le, ke = $);
          else if (ce < f && 0 > T(Z, le))
            b[ke] = Z, b[ce] = le, ke = ce;
          else break e;
        }
      }
      return Q;
    }
    function T(b, Q) {
      var le = b.sortIndex - Q.sortIndex;
      return le !== 0 ? le : b.id - Q.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var q = performance;
      u.unstable_now = function() {
        return q.now();
      };
    } else {
      var V = Date, A = V.now();
      u.unstable_now = function() {
        return V.now() - A;
      };
    }
    var G = [], v = [], U = 1, K = null, k = 3, se = !1, je = !1, Ne = !1, Se = !1, Ee = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, P = typeof setImmediate < "u" ? setImmediate : null;
    function ue(b) {
      for (var Q = _(v); Q !== null; ) {
        if (Q.callback === null) o(v);
        else if (Q.startTime <= b)
          o(v), Q.sortIndex = Q.expirationTime, h(G, Q);
        else break;
        Q = _(v);
      }
    }
    function ae(b) {
      if (Ne = !1, ue(b), !je)
        if (_(G) !== null)
          je = !0, B || (B = !0, ge());
        else {
          var Q = _(v);
          Q !== null && oe(ae, Q.startTime - b);
        }
    }
    var B = !1, ve = -1, Ae = 5, Le = -1;
    function Ve() {
      return Se ? !0 : !(u.unstable_now() - Le < Ae);
    }
    function Ye() {
      if (Se = !1, B) {
        var b = u.unstable_now();
        Le = b;
        var Q = !0;
        try {
          e: {
            je = !1, Ne && (Ne = !1, me(ve), ve = -1), se = !0;
            var le = k;
            try {
              t: {
                for (ue(b), K = _(G); K !== null && !(K.expirationTime > b && Ve()); ) {
                  var ke = K.callback;
                  if (typeof ke == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var f = ke(
                      K.expirationTime <= b
                    );
                    if (b = u.unstable_now(), typeof f == "function") {
                      K.callback = f, ue(b), Q = !0;
                      break t;
                    }
                    K === _(G) && o(G), ue(b);
                  } else o(G);
                  K = _(G);
                }
                if (K !== null) Q = !0;
                else {
                  var Y = _(v);
                  Y !== null && oe(
                    ae,
                    Y.startTime - b
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
          Q ? ge() : B = !1;
        }
      }
    }
    var ge;
    if (typeof P == "function")
      ge = function() {
        P(Ye);
      };
    else if (typeof MessageChannel < "u") {
      var Pe = new MessageChannel(), X = Pe.port2;
      Pe.port1.onmessage = Ye, ge = function() {
        X.postMessage(null);
      };
    } else
      ge = function() {
        Ee(Ye, 0);
      };
    function oe(b, Q) {
      ve = Ee(function() {
        b(u.unstable_now());
      }, Q);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(b) {
      b.callback = null;
    }, u.unstable_forceFrameRate = function(b) {
      0 > b || 125 < b ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ae = 0 < b ? Math.floor(1e3 / b) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return k;
    }, u.unstable_next = function(b) {
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
        return b();
      } finally {
        k = le;
      }
    }, u.unstable_requestPaint = function() {
      Se = !0;
    }, u.unstable_runWithPriority = function(b, Q) {
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
      var le = k;
      k = b;
      try {
        return Q();
      } finally {
        k = le;
      }
    }, u.unstable_scheduleCallback = function(b, Q, le) {
      var ke = u.unstable_now();
      switch (typeof le == "object" && le !== null ? (le = le.delay, le = typeof le == "number" && 0 < le ? ke + le : ke) : le = ke, b) {
        case 1:
          var f = -1;
          break;
        case 2:
          f = 250;
          break;
        case 5:
          f = 1073741823;
          break;
        case 4:
          f = 1e4;
          break;
        default:
          f = 5e3;
      }
      return f = le + f, b = {
        id: U++,
        callback: Q,
        priorityLevel: b,
        startTime: le,
        expirationTime: f,
        sortIndex: -1
      }, le > ke ? (b.sortIndex = le, h(v, b), _(G) === null && b === _(v) && (Ne ? (me(ve), ve = -1) : Ne = !0, oe(ae, le - ke))) : (b.sortIndex = f, h(G, b), je || se || (je = !0, B || (B = !0, ge()))), b;
    }, u.unstable_shouldYield = Ve, u.unstable_wrapCallback = function(b) {
      var Q = k;
      return function() {
        var le = k;
        k = Q;
        try {
          return b.apply(this, arguments);
        } finally {
          k = le;
        }
      };
    };
  })(fu)), fu;
}
var vf;
function pj() {
  return vf || (vf = 1, hu.exports = vj()), hu.exports;
}
var mu = { exports: {} }, ot = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pf;
function gj() {
  if (pf) return ot;
  pf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), q = Symbol.for("react.consumer"), V = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), U = Symbol.for("react.lazy"), K = Symbol.iterator;
  function k(f) {
    return f === null || typeof f != "object" ? null : (f = K && f[K] || f["@@iterator"], typeof f == "function" ? f : null);
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
  }, je = Object.assign, Ne = {};
  function Se(f, Y, $) {
    this.props = f, this.context = Y, this.refs = Ne, this.updater = $ || se;
  }
  Se.prototype.isReactComponent = {}, Se.prototype.setState = function(f, Y) {
    if (typeof f != "object" && typeof f != "function" && f != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, f, Y, "setState");
  }, Se.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function Ee() {
  }
  Ee.prototype = Se.prototype;
  function me(f, Y, $) {
    this.props = f, this.context = Y, this.refs = Ne, this.updater = $ || se;
  }
  var P = me.prototype = new Ee();
  P.constructor = me, je(P, Se.prototype), P.isPureReactComponent = !0;
  var ue = Array.isArray, ae = { H: null, A: null, T: null, S: null, V: null }, B = Object.prototype.hasOwnProperty;
  function ve(f, Y, $, I, ce, Z) {
    return $ = Z.ref, {
      $$typeof: u,
      type: f,
      key: Y,
      ref: $ !== void 0 ? $ : null,
      props: Z
    };
  }
  function Ae(f, Y) {
    return ve(
      f.type,
      Y,
      void 0,
      void 0,
      void 0,
      f.props
    );
  }
  function Le(f) {
    return typeof f == "object" && f !== null && f.$$typeof === u;
  }
  function Ve(f) {
    var Y = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function($) {
      return Y[$];
    });
  }
  var Ye = /\/+/g;
  function ge(f, Y) {
    return typeof f == "object" && f !== null && f.key != null ? Ve("" + f.key) : Y.toString(36);
  }
  function Pe() {
  }
  function X(f) {
    switch (f.status) {
      case "fulfilled":
        return f.value;
      case "rejected":
        throw f.reason;
      default:
        switch (typeof f.status == "string" ? f.then(Pe, Pe) : (f.status = "pending", f.then(
          function(Y) {
            f.status === "pending" && (f.status = "fulfilled", f.value = Y);
          },
          function(Y) {
            f.status === "pending" && (f.status = "rejected", f.reason = Y);
          }
        )), f.status) {
          case "fulfilled":
            return f.value;
          case "rejected":
            throw f.reason;
        }
    }
    throw f;
  }
  function oe(f, Y, $, I, ce) {
    var Z = typeof f;
    (Z === "undefined" || Z === "boolean") && (f = null);
    var F = !1;
    if (f === null) F = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          F = !0;
          break;
        case "object":
          switch (f.$$typeof) {
            case u:
            case h:
              F = !0;
              break;
            case U:
              return F = f._init, oe(
                F(f._payload),
                Y,
                $,
                I,
                ce
              );
          }
      }
    if (F)
      return ce = ce(f), F = I === "" ? "." + ge(f, 0) : I, ue(ce) ? ($ = "", F != null && ($ = F.replace(Ye, "$&/") + "/"), oe(ce, Y, $, "", function(ze) {
        return ze;
      })) : ce != null && (Le(ce) && (ce = Ae(
        ce,
        $ + (ce.key == null || f && f.key === ce.key ? "" : ("" + ce.key).replace(
          Ye,
          "$&/"
        ) + "/") + F
      )), Y.push(ce)), 1;
    F = 0;
    var Te = I === "" ? "." : I + ":";
    if (ue(f))
      for (var ne = 0; ne < f.length; ne++)
        I = f[ne], Z = Te + ge(I, ne), F += oe(
          I,
          Y,
          $,
          Z,
          ce
        );
    else if (ne = k(f), typeof ne == "function")
      for (f = ne.call(f), ne = 0; !(I = f.next()).done; )
        I = I.value, Z = Te + ge(I, ne++), F += oe(
          I,
          Y,
          $,
          Z,
          ce
        );
    else if (Z === "object") {
      if (typeof f.then == "function")
        return oe(
          X(f),
          Y,
          $,
          I,
          ce
        );
      throw Y = String(f), Error(
        "Objects are not valid as a React child (found: " + (Y === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : Y) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return F;
  }
  function b(f, Y, $) {
    if (f == null) return f;
    var I = [], ce = 0;
    return oe(f, I, "", "", function(Z) {
      return Y.call($, Z, ce++);
    }), I;
  }
  function Q(f) {
    if (f._status === -1) {
      var Y = f._result;
      Y = Y(), Y.then(
        function($) {
          (f._status === 0 || f._status === -1) && (f._status = 1, f._result = $);
        },
        function($) {
          (f._status === 0 || f._status === -1) && (f._status = 2, f._result = $);
        }
      ), f._status === -1 && (f._status = 0, f._result = Y);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var le = typeof reportError == "function" ? reportError : function(f) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var Y = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof f == "object" && f !== null && typeof f.message == "string" ? String(f.message) : String(f),
        error: f
      });
      if (!window.dispatchEvent(Y)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", f);
      return;
    }
    console.error(f);
  };
  function ke() {
  }
  return ot.Children = {
    map: b,
    forEach: function(f, Y, $) {
      b(
        f,
        function() {
          Y.apply(this, arguments);
        },
        $
      );
    },
    count: function(f) {
      var Y = 0;
      return b(f, function() {
        Y++;
      }), Y;
    },
    toArray: function(f) {
      return b(f, function(Y) {
        return Y;
      }) || [];
    },
    only: function(f) {
      if (!Le(f))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return f;
    }
  }, ot.Component = Se, ot.Fragment = _, ot.Profiler = T, ot.PureComponent = me, ot.StrictMode = o, ot.Suspense = G, ot.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ae, ot.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(f) {
      return ae.H.useMemoCache(f);
    }
  }, ot.cache = function(f) {
    return function() {
      return f.apply(null, arguments);
    };
  }, ot.cloneElement = function(f, Y, $) {
    if (f == null)
      throw Error(
        "The argument must be a React element, but you passed " + f + "."
      );
    var I = je({}, f.props), ce = f.key, Z = void 0;
    if (Y != null)
      for (F in Y.ref !== void 0 && (Z = void 0), Y.key !== void 0 && (ce = "" + Y.key), Y)
        !B.call(Y, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && Y.ref === void 0 || (I[F] = Y[F]);
    var F = arguments.length - 2;
    if (F === 1) I.children = $;
    else if (1 < F) {
      for (var Te = Array(F), ne = 0; ne < F; ne++)
        Te[ne] = arguments[ne + 2];
      I.children = Te;
    }
    return ve(f.type, ce, void 0, void 0, Z, I);
  }, ot.createContext = function(f) {
    return f = {
      $$typeof: V,
      _currentValue: f,
      _currentValue2: f,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, f.Provider = f, f.Consumer = {
      $$typeof: q,
      _context: f
    }, f;
  }, ot.createElement = function(f, Y, $) {
    var I, ce = {}, Z = null;
    if (Y != null)
      for (I in Y.key !== void 0 && (Z = "" + Y.key), Y)
        B.call(Y, I) && I !== "key" && I !== "__self" && I !== "__source" && (ce[I] = Y[I]);
    var F = arguments.length - 2;
    if (F === 1) ce.children = $;
    else if (1 < F) {
      for (var Te = Array(F), ne = 0; ne < F; ne++)
        Te[ne] = arguments[ne + 2];
      ce.children = Te;
    }
    if (f && f.defaultProps)
      for (I in F = f.defaultProps, F)
        ce[I] === void 0 && (ce[I] = F[I]);
    return ve(f, Z, void 0, void 0, null, ce);
  }, ot.createRef = function() {
    return { current: null };
  }, ot.forwardRef = function(f) {
    return { $$typeof: A, render: f };
  }, ot.isValidElement = Le, ot.lazy = function(f) {
    return {
      $$typeof: U,
      _payload: { _status: -1, _result: f },
      _init: Q
    };
  }, ot.memo = function(f, Y) {
    return {
      $$typeof: v,
      type: f,
      compare: Y === void 0 ? null : Y
    };
  }, ot.startTransition = function(f) {
    var Y = ae.T, $ = {};
    ae.T = $;
    try {
      var I = f(), ce = ae.S;
      ce !== null && ce($, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(ke, le);
    } catch (Z) {
      le(Z);
    } finally {
      ae.T = Y;
    }
  }, ot.unstable_useCacheRefresh = function() {
    return ae.H.useCacheRefresh();
  }, ot.use = function(f) {
    return ae.H.use(f);
  }, ot.useActionState = function(f, Y, $) {
    return ae.H.useActionState(f, Y, $);
  }, ot.useCallback = function(f, Y) {
    return ae.H.useCallback(f, Y);
  }, ot.useContext = function(f) {
    return ae.H.useContext(f);
  }, ot.useDebugValue = function() {
  }, ot.useDeferredValue = function(f, Y) {
    return ae.H.useDeferredValue(f, Y);
  }, ot.useEffect = function(f, Y, $) {
    var I = ae.H;
    if (typeof $ == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return I.useEffect(f, Y);
  }, ot.useId = function() {
    return ae.H.useId();
  }, ot.useImperativeHandle = function(f, Y, $) {
    return ae.H.useImperativeHandle(f, Y, $);
  }, ot.useInsertionEffect = function(f, Y) {
    return ae.H.useInsertionEffect(f, Y);
  }, ot.useLayoutEffect = function(f, Y) {
    return ae.H.useLayoutEffect(f, Y);
  }, ot.useMemo = function(f, Y) {
    return ae.H.useMemo(f, Y);
  }, ot.useOptimistic = function(f, Y) {
    return ae.H.useOptimistic(f, Y);
  }, ot.useReducer = function(f, Y, $) {
    return ae.H.useReducer(f, Y, $);
  }, ot.useRef = function(f) {
    return ae.H.useRef(f);
  }, ot.useState = function(f) {
    return ae.H.useState(f);
  }, ot.useSyncExternalStore = function(f, Y, $) {
    return ae.H.useSyncExternalStore(
      f,
      Y,
      $
    );
  }, ot.useTransition = function() {
    return ae.H.useTransition();
  }, ot.version = "19.1.0", ot;
}
var gf;
function zu() {
  return gf || (gf = 1, mu.exports = gj()), mu.exports;
}
var xu = { exports: {} }, ns = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bf;
function bj() {
  if (bf) return ns;
  bf = 1;
  var u = zu();
  function h(G) {
    var v = "https://react.dev/errors/" + G;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var U = 2; U < arguments.length; U++)
        v += "&args[]=" + encodeURIComponent(arguments[U]);
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
  function q(G, v, U) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: T,
      key: K == null ? null : "" + K,
      children: G,
      containerInfo: v,
      implementation: U
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function A(G, v) {
    if (G === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return ns.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ns.createPortal = function(G, v) {
    var U = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(h(299));
    return q(G, v, null, U);
  }, ns.flushSync = function(G) {
    var v = V.T, U = o.p;
    try {
      if (V.T = null, o.p = 2, G) return G();
    } finally {
      V.T = v, o.p = U, o.d.f();
    }
  }, ns.preconnect = function(G, v) {
    typeof G == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, o.d.C(G, v));
  }, ns.prefetchDNS = function(G) {
    typeof G == "string" && o.d.D(G);
  }, ns.preinit = function(G, v) {
    if (typeof G == "string" && v && typeof v.as == "string") {
      var U = v.as, K = A(U, v.crossOrigin), k = typeof v.integrity == "string" ? v.integrity : void 0, se = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      U === "style" ? o.d.S(
        G,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: se
        }
      ) : U === "script" && o.d.X(G, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: se,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, ns.preinitModule = function(G, v) {
    if (typeof G == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var U = A(
            v.as,
            v.crossOrigin
          );
          o.d.M(G, {
            crossOrigin: U,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && o.d.M(G);
  }, ns.preload = function(G, v) {
    if (typeof G == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var U = v.as, K = A(U, v.crossOrigin);
      o.d.L(G, U, {
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
  }, ns.preloadModule = function(G, v) {
    if (typeof G == "string")
      if (v) {
        var U = A(v.as, v.crossOrigin);
        o.d.m(G, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: U,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else o.d.m(G);
  }, ns.requestFormReset = function(G) {
    o.d.r(G);
  }, ns.unstable_batchedUpdates = function(G, v) {
    return G(v);
  }, ns.useFormState = function(G, v, U) {
    return V.H.useFormState(G, v, U);
  }, ns.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, ns.version = "19.1.0", ns;
}
var yf;
function yj() {
  if (yf) return xu.exports;
  yf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), xu.exports = bj(), xu.exports;
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
var _f;
function _j() {
  if (_f) return Dn;
  _f = 1;
  var u = pj(), h = zu(), _ = yj();
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
  function V(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function A(e) {
    if (q(e) !== e)
      throw Error(o(188));
  }
  function G(e) {
    var t = e.alternate;
    if (!t) {
      if (t = q(e), t === null) throw Error(o(188));
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
  var U = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), se = Symbol.for("react.portal"), je = Symbol.for("react.fragment"), Ne = Symbol.for("react.strict_mode"), Se = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), me = Symbol.for("react.consumer"), P = Symbol.for("react.context"), ue = Symbol.for("react.forward_ref"), ae = Symbol.for("react.suspense"), B = Symbol.for("react.suspense_list"), ve = Symbol.for("react.memo"), Ae = Symbol.for("react.lazy"), Le = Symbol.for("react.activity"), Ve = Symbol.for("react.memo_cache_sentinel"), Ye = Symbol.iterator;
  function ge(e) {
    return e === null || typeof e != "object" ? null : (e = Ye && e[Ye] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Pe = Symbol.for("react.client.reference");
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Pe ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case je:
        return "Fragment";
      case Se:
        return "Profiler";
      case Ne:
        return "StrictMode";
      case ae:
        return "Suspense";
      case B:
        return "SuspenseList";
      case Le:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case se:
          return "Portal";
        case P:
          return (e.displayName || "Context") + ".Provider";
        case me:
          return (e._context.displayName || "Context") + ".Consumer";
        case ue:
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
  var oe = Array.isArray, b = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ke = [], f = -1;
  function Y(e) {
    return { current: e };
  }
  function $(e) {
    0 > f || (e.current = ke[f], ke[f] = null, f--);
  }
  function I(e, t) {
    f++, ke[f] = e.current, e.current = t;
  }
  var ce = Y(null), Z = Y(null), F = Y(null), Te = Y(null);
  function ne(e, t) {
    switch (I(F, t), I(Z, e), I(ce, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Yh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Yh(t), e = Gh(t, e);
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
    $(ce), I(ce, e);
  }
  function ze() {
    $(ce), $(Z), $(F);
  }
  function We(e) {
    e.memoizedState !== null && I(Te, e);
    var t = ce.current, l = Gh(t, e.type);
    t !== l && (I(Z, e), I(ce, l));
  }
  function it(e) {
    Z.current === e && ($(ce), $(Z)), Te.current === e && ($(Te), En._currentValue = le);
  }
  var at = Object.prototype.hasOwnProperty, $e = u.unstable_scheduleCallback, Re = u.unstable_cancelCallback, Ue = u.unstable_shouldYield, ye = u.unstable_requestPaint, He = u.unstable_now, lt = u.unstable_getCurrentPriorityLevel, nt = u.unstable_ImmediatePriority, Ze = u.unstable_UserBlockingPriority, xe = u.unstable_NormalPriority, dt = u.unstable_LowPriority, De = u.unstable_IdlePriority, E = u.log, w = u.unstable_setDisableYieldValue, ee = null, _e = null;
  function qe(e) {
    if (typeof E == "function" && w(e), _e && typeof _e.setStrictMode == "function")
      try {
        _e.setStrictMode(ee, e);
      } catch {
      }
  }
  var Qe = Math.clz32 ? Math.clz32 : de, ut = Math.log, L = Math.LN2;
  function de(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ut(e) / L | 0) | 0;
  }
  var ie = 256, Je = 4194304;
  function y(e) {
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
  function he(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var d = a & 134217727;
    return d !== 0 ? (a = d & ~i, a !== 0 ? n = y(a) : (c &= d, c !== 0 ? n = y(c) : l || (l = d & ~e, l !== 0 && (n = y(l))))) : (d = a & ~i, d !== 0 ? n = y(d) : c !== 0 ? n = y(c) : l || (l = a & ~e, l !== 0 && (n = y(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function pe(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Be(e, t) {
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
  function gt() {
    var e = ie;
    return ie <<= 1, (ie & 4194048) === 0 && (ie = 256), e;
  }
  function M() {
    var e = Je;
    return Je <<= 1, (Je & 62914560) === 0 && (Je = 4194304), e;
  }
  function j(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function re(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function be(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var d = e.entanglements, p = e.expirationTimes, z = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var J = 31 - Qe(l), te = 1 << J;
      d[J] = 0, p[J] = -1;
      var D = z[J];
      if (D !== null)
        for (z[J] = null, J = 0; J < D.length; J++) {
          var H = D[J];
          H !== null && (H.lane &= -536870913);
        }
      l &= ~te;
    }
    a !== 0 && ct(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function ct(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Qe(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function N(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Qe(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function fe(e) {
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
  function Ke(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Tt() {
    var e = Q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : rf(e.type));
  }
  function Lt(e, t) {
    var l = Q.p;
    try {
      return Q.p = e, t();
    } finally {
      Q.p = l;
    }
  }
  var Yt = Math.random().toString(36).slice(2), ht = "__reactFiber$" + Yt, _t = "__reactProps$" + Yt, g = "__reactContainer$" + Yt, we = "__reactEvents$" + Yt, rt = "__reactListeners$" + Yt, bt = "__reactHandles$" + Yt, m = "__reactResources$" + Yt, Oe = "__reactMarker$" + Yt;
  function Ce(e) {
    delete e[ht], delete e[_t], delete e[we], delete e[rt], delete e[bt];
  }
  function et(e) {
    var t = e[ht];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[g] || l[ht]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Vh(e); e !== null; ) {
            if (l = e[ht]) return l;
            e = Vh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Gt(e) {
    if (e = e[ht] || e[g]) {
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
  function x(e) {
    var t = e[m];
    return t || (t = e[m] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function R(e) {
    e[Oe] = !0;
  }
  var Ge = /* @__PURE__ */ new Set(), At = {};
  function tt(e, t) {
    Ut(e, t), Ut(e + "Capture", t);
  }
  function Ut(e, t) {
    for (At[e] = t, e = 0; e < t.length; e++)
      Ge.add(t[e]);
  }
  var Dl = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), is = {}, Pl = {};
  function cl(e) {
    return at.call(Pl, e) ? !0 : at.call(is, e) ? !1 : Dl.test(e) ? Pl[e] = !0 : (is[e] = !0, !1);
  }
  function Ts(e, t, l) {
    if (cl(t))
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
  function Ms(e, t, l) {
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
  function es(e, t, l, a) {
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
  var cs, qs;
  function rl(e) {
    if (cs === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        cs = t && t[1] || "", qs = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + cs + e + qs;
  }
  var Ba = !1;
  function Ul(e, t) {
    if (!e || Ba) return "";
    Ba = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var te = function() {
                throw Error();
              };
              if (Object.defineProperty(te.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(te, []);
                } catch (H) {
                  var D = H;
                }
                Reflect.construct(e, [], te);
              } else {
                try {
                  te.call();
                } catch (H) {
                  D = H;
                }
                e.call(te.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (H) {
                D = H;
              }
              (te = e()) && typeof te.catch == "function" && te.catch(function() {
              });
            }
          } catch (H) {
            if (H && D && typeof H.stack == "string")
              return [H.stack, D.stack];
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
      Ba = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? rl(l) : "";
  }
  function Gn(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return rl(e.type);
      case 16:
        return rl("Lazy");
      case 13:
        return rl("Suspense");
      case 19:
        return rl("SuspenseList");
      case 0:
      case 15:
        return Ul(e.type, !1);
      case 11:
        return Ul(e.type.render, !1);
      case 1:
        return Ul(e.type, !0);
      case 31:
        return rl("Activity");
      default:
        return "";
    }
  }
  function Du(e) {
    try {
      var t = "";
      do
        t += Gn(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function ys(e) {
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
  function om(e) {
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
  function Xn(e) {
    e._valueTracker || (e._valueTracker = om(e));
  }
  function Mu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Uu(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Qn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var dm = /[\n"\\]/g;
  function _s(e) {
    return e.replace(
      dm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function cc(e, t, l, a, n, i, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ys(t)) : e.value !== "" + ys(t) && (e.value = "" + ys(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? rc(e, c, ys(t)) : l != null ? rc(e, c, ys(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + ys(d) : e.removeAttribute("name");
  }
  function qu(e, t, l, a, n, i, c, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + ys(l) : "", t = t != null ? "" + ys(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function rc(e, t, l) {
    t === "number" && Qn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function ea(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + ys(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Hu(e, t, l) {
    if (t != null && (t = "" + ys(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + ys(l) : "";
  }
  function Bu(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (oe(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = ys(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
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
  function Lu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || hm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Yu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Lu(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Lu(e, i, t[i]);
  }
  function uc(e) {
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
  function Zn(e) {
    return mm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var oc = null;
  function dc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var sa = null, la = null;
  function Gu(e) {
    var t = Gt(e);
    if (t && (e = t.stateNode)) {
      var l = e[_t] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (cc(
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
              'input[name="' + _s(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[_t] || null;
                if (!n) throw Error(o(90));
                cc(
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
              a = l[t], a.form === e.form && Mu(a);
          }
          break e;
        case "textarea":
          Hu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && ea(e, !!l.multiple, t, !1);
      }
    }
  }
  var hc = !1;
  function Xu(e, t, l) {
    if (hc) return e(t, l);
    hc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (hc = !1, (sa !== null || la !== null) && (Ti(), sa && (t = sa, e = la, la = sa = null, Gu(t), e)))
        for (t = 0; t < e.length; t++) Gu(e[t]);
    }
  }
  function La(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[_t] || null;
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
  var Qs = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), fc = !1;
  if (Qs)
    try {
      var Ya = {};
      Object.defineProperty(Ya, "passive", {
        get: function() {
          fc = !0;
        }
      }), window.addEventListener("test", Ya, Ya), window.removeEventListener("test", Ya, Ya);
    } catch {
      fc = !1;
    }
  var ul = null, mc = null, Vn = null;
  function Qu() {
    if (Vn) return Vn;
    var e, t = mc, l = t.length, a, n = "value" in ul ? ul.value : ul.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Vn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Jn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Kn() {
    return !0;
  }
  function Zu() {
    return !1;
  }
  function os(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Kn : Zu, this.isPropagationStopped = Zu, this;
    }
    return U(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Kn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Kn);
      },
      persist: function() {
      },
      isPersistent: Kn
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
  }, $n = os(Ml), Ga = U({}, Ml, { view: 0, detail: 0 }), xm = os(Ga), xc, jc, Xa, Wn = U({}, Ga, {
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
    getModifierState: pc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Xa && (Xa && e.type === "mousemove" ? (xc = e.screenX - Xa.screenX, jc = e.screenY - Xa.screenY) : jc = xc = 0, Xa = e), xc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : jc;
    }
  }), Vu = os(Wn), jm = U({}, Wn, { dataTransfer: 0 }), vm = os(jm), pm = U({}, Ga, { relatedTarget: 0 }), vc = os(pm), gm = U({}, Ml, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bm = os(gm), ym = U({}, Ml, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), _m = os(ym), Nm = U({}, Ml, { data: 0 }), Ju = os(Nm), Sm = {
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
  function pc() {
    return Cm;
  }
  var Em = U({}, Ga, {
    key: function(e) {
      if (e.key) {
        var t = Sm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Jn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: pc,
    charCode: function(e) {
      return e.type === "keypress" ? Jn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Jn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Om = os(Em), Tm = U({}, Wn, {
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
  }), Ku = os(Tm), zm = U({}, Ga, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: pc
  }), Am = os(zm), Rm = U({}, Ml, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Dm = os(Rm), Um = U({}, Wn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Mm = os(Um), qm = U({}, Ml, {
    newState: 0,
    oldState: 0
  }), Hm = os(qm), Bm = [9, 13, 27, 32], gc = Qs && "CompositionEvent" in window, Qa = null;
  Qs && "documentMode" in document && (Qa = document.documentMode);
  var Lm = Qs && "TextEvent" in window && !Qa, $u = Qs && (!gc || Qa && 8 < Qa && 11 >= Qa), Wu = " ", Fu = !1;
  function Iu(e, t) {
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
  function Pu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var aa = !1;
  function Ym(e, t) {
    switch (e) {
      case "compositionend":
        return Pu(t);
      case "keypress":
        return t.which !== 32 ? null : (Fu = !0, Wu);
      case "textInput":
        return e = t.data, e === Wu && Fu ? null : e;
      default:
        return null;
    }
  }
  function Gm(e, t) {
    if (aa)
      return e === "compositionend" || !gc && Iu(e, t) ? (e = Qu(), Vn = mc = ul = null, aa = !1, e) : null;
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
        return $u && t.locale !== "ko" ? null : t.data;
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
  function eo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Xm[e.type] : t === "textarea";
  }
  function to(e, t, l, a) {
    sa ? la ? la.push(a) : la = [a] : sa = a, t = Mi(t, "onChange"), 0 < t.length && (l = new $n(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Za = null, Va = null;
  function Qm(e) {
    Mh(e, 0);
  }
  function Fn(e) {
    var t = us(e);
    if (Mu(t)) return e;
  }
  function so(e, t) {
    if (e === "change") return t;
  }
  var lo = !1;
  if (Qs) {
    var bc;
    if (Qs) {
      var yc = "oninput" in document;
      if (!yc) {
        var ao = document.createElement("div");
        ao.setAttribute("oninput", "return;"), yc = typeof ao.oninput == "function";
      }
      bc = yc;
    } else bc = !1;
    lo = bc && (!document.documentMode || 9 < document.documentMode);
  }
  function no() {
    Za && (Za.detachEvent("onpropertychange", io), Va = Za = null);
  }
  function io(e) {
    if (e.propertyName === "value" && Fn(Va)) {
      var t = [];
      to(
        t,
        Va,
        e,
        dc(e)
      ), Xu(Qm, t);
    }
  }
  function Zm(e, t, l) {
    e === "focusin" ? (no(), Za = t, Va = l, Za.attachEvent("onpropertychange", io)) : e === "focusout" && no();
  }
  function Vm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Fn(Va);
  }
  function Jm(e, t) {
    if (e === "click") return Fn(t);
  }
  function Km(e, t) {
    if (e === "input" || e === "change")
      return Fn(t);
  }
  function $m(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ms = typeof Object.is == "function" ? Object.is : $m;
  function Ja(e, t) {
    if (ms(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!at.call(t, n) || !ms(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function co(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ro(e, t) {
    var l = co(e);
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
      l = co(l);
    }
  }
  function uo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? uo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function oo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Qn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Qn(e.document);
    }
    return t;
  }
  function _c(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Wm = Qs && "documentMode" in document && 11 >= document.documentMode, na = null, Nc = null, Ka = null, Sc = !1;
  function ho(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Sc || na == null || na !== Qn(a) || (a = na, "selectionStart" in a && _c(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ka && Ja(Ka, a) || (Ka = a, a = Mi(Nc, "onSelect"), 0 < a.length && (t = new $n(
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
  }, wc = {}, fo = {};
  Qs && (fo = document.createElement("div").style, "AnimationEvent" in window || (delete ia.animationend.animation, delete ia.animationiteration.animation, delete ia.animationstart.animation), "TransitionEvent" in window || delete ia.transitionend.transition);
  function Hl(e) {
    if (wc[e]) return wc[e];
    if (!ia[e]) return e;
    var t = ia[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in fo)
        return wc[e] = t[l];
    return e;
  }
  var mo = Hl("animationend"), xo = Hl("animationiteration"), jo = Hl("animationstart"), Fm = Hl("transitionrun"), Im = Hl("transitionstart"), Pm = Hl("transitioncancel"), vo = Hl("transitionend"), po = /* @__PURE__ */ new Map(), kc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  kc.push("scrollEnd");
  function zs(e, t) {
    po.set(e, t), tt(t, [e]);
  }
  var go = /* @__PURE__ */ new WeakMap();
  function Ns(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = go.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Du(t)
      }, go.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Du(t)
    };
  }
  var Ss = [], ca = 0, Cc = 0;
  function In() {
    for (var e = ca, t = Cc = ca = 0; t < e; ) {
      var l = Ss[t];
      Ss[t++] = null;
      var a = Ss[t];
      Ss[t++] = null;
      var n = Ss[t];
      Ss[t++] = null;
      var i = Ss[t];
      if (Ss[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && bo(l, n, i);
    }
  }
  function Pn(e, t, l, a) {
    Ss[ca++] = e, Ss[ca++] = t, Ss[ca++] = l, Ss[ca++] = a, Cc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Ec(e, t, l, a) {
    return Pn(e, t, l, a), ei(e);
  }
  function ra(e, t) {
    return Pn(e, null, null, t), ei(e);
  }
  function bo(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - Qe(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function ei(e) {
    if (50 < bn)
      throw bn = 0, Dr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var ua = {};
  function ex(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function xs(e, t, l, a) {
    return new ex(e, t, l, a);
  }
  function Oc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Zs(e, t) {
    var l = e.alternate;
    return l === null ? (l = xs(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function yo(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ti(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") Oc(e) && (c = 1);
    else if (typeof e == "string")
      c = sj(
        e,
        l,
        ce.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Le:
          return e = xs(31, l, t, n), e.elementType = Le, e.lanes = i, e;
        case je:
          return Bl(l.children, n, i, t);
        case Ne:
          c = 8, n |= 24;
          break;
        case Se:
          return e = xs(12, l, t, n | 2), e.elementType = Se, e.lanes = i, e;
        case ae:
          return e = xs(13, l, t, n), e.elementType = ae, e.lanes = i, e;
        case B:
          return e = xs(19, l, t, n), e.elementType = B, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ee:
              case P:
                c = 10;
                break e;
              case me:
                c = 9;
                break e;
              case ue:
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
    return t = xs(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Bl(e, t, l, a) {
    return e = xs(7, e, a, t), e.lanes = l, e;
  }
  function Tc(e, t, l) {
    return e = xs(6, e, null, t), e.lanes = l, e;
  }
  function zc(e, t, l) {
    return t = xs(
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
  var oa = [], da = 0, si = null, li = 0, ws = [], ks = 0, Ll = null, Vs = 1, Js = "";
  function Yl(e, t) {
    oa[da++] = li, oa[da++] = si, si = e, li = t;
  }
  function _o(e, t, l) {
    ws[ks++] = Vs, ws[ks++] = Js, ws[ks++] = Ll, Ll = e;
    var a = Vs;
    e = Js;
    var n = 32 - Qe(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - Qe(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Vs = 1 << 32 - Qe(t) + n | l << n | a, Js = i + e;
    } else
      Vs = 1 << i | l << n | a, Js = e;
  }
  function Ac(e) {
    e.return !== null && (Yl(e, 1), _o(e, 1, 0));
  }
  function Rc(e) {
    for (; e === si; )
      si = oa[--da], oa[da] = null, li = oa[--da], oa[da] = null;
    for (; e === Ll; )
      Ll = ws[--ks], ws[ks] = null, Js = ws[--ks], ws[ks] = null, Vs = ws[--ks], ws[ks] = null;
  }
  var rs = null, Ht = null, yt = !1, Gl = null, Hs = !1, Dc = Error(o(519));
  function Xl(e) {
    var t = Error(o(418, ""));
    throw Fa(Ns(t, e)), Dc;
  }
  function No(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[ht] = e, t[_t] = a, l) {
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
        for (l = 0; l < _n.length; l++)
          jt(_n[l], t);
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
        jt("invalid", t), qu(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Xn(t);
        break;
      case "select":
        jt("invalid", t);
        break;
      case "textarea":
        jt("invalid", t), Bu(t, a.value, a.defaultValue, a.children), Xn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Lh(t.textContent, l) ? (a.popover != null && (jt("beforetoggle", t), jt("toggle", t)), a.onScroll != null && jt("scroll", t), a.onScrollEnd != null && jt("scrollend", t), a.onClick != null && (t.onclick = qi), t = !0) : t = !1, t || Xl(e);
  }
  function So(e) {
    for (rs = e.return; rs; )
      switch (rs.tag) {
        case 5:
        case 13:
          Hs = !1;
          return;
        case 27:
        case 3:
          Hs = !0;
          return;
        default:
          rs = rs.return;
      }
  }
  function $a(e) {
    if (e !== rs) return !1;
    if (!yt) return So(e), yt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Wr(e.type, e.memoizedProps)), l = !l), l && Ht && Xl(e), So(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Ht = Rs(e.nextSibling);
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
      t === 27 ? (t = Ht, wl(e.type) ? (e = eu, eu = null, Ht = e) : Ht = t) : Ht = rs ? Rs(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Wa() {
    Ht = rs = null, yt = !1;
  }
  function wo() {
    var e = Gl;
    return e !== null && (fs === null ? fs = e : fs.push.apply(
      fs,
      e
    ), Gl = null), e;
  }
  function Fa(e) {
    Gl === null ? Gl = [e] : Gl.push(e);
  }
  var Uc = Y(null), Ql = null, Ks = null;
  function ol(e, t, l) {
    I(Uc, t._currentValue), t._currentValue = l;
  }
  function $s(e) {
    e._currentValue = Uc.current, $(Uc);
  }
  function Mc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function qc(e, t, l, a) {
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
              i.lanes |= l, d = i.alternate, d !== null && (d.lanes |= l), Mc(
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
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Mc(c, l, e), c = null;
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
  function Ia(e, t, l, a) {
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
          ms(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === Te.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(En) : e = [En]);
      }
      n = n.return;
    }
    e !== null && qc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function ai(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!ms(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Zl(e) {
    Ql = e, Ks = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function as(e) {
    return ko(Ql, e);
  }
  function ni(e, t) {
    return Ql === null && Zl(e), ko(e, t);
  }
  function ko(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ks === null) {
      if (e === null) throw Error(o(308));
      Ks = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ks = Ks.next = t;
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
  }, sx = u.unstable_scheduleCallback, lx = u.unstable_NormalPriority, $t = {
    $$typeof: P,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Hc() {
    return {
      controller: new tx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Pa(e) {
    e.refCount--, e.refCount === 0 && sx(lx, function() {
      e.controller.abort();
    });
  }
  var en = null, Bc = 0, ha = 0, fa = null;
  function ax(e, t) {
    if (en === null) {
      var l = en = [];
      Bc = 0, ha = Yr(), fa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Bc++, t.then(Co, Co), t;
  }
  function Co() {
    if (--Bc === 0 && en !== null) {
      fa !== null && (fa.status = "fulfilled");
      var e = en;
      en = null, ha = 0, fa = null;
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
  var Eo = b.S;
  b.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && ax(e, t), Eo !== null && Eo(e, t);
  };
  var Vl = Y(null);
  function Lc() {
    var e = Vl.current;
    return e !== null ? e : zt.pooledCache;
  }
  function ii(e, t) {
    t === null ? I(Vl, Vl.current) : I(Vl, t.pool);
  }
  function Oo() {
    var e = Lc();
    return e === null ? null : { parent: $t._currentValue, pool: e };
  }
  var tn = Error(o(460)), To = Error(o(474)), ci = Error(o(542)), Yc = { then: function() {
  } };
  function zo(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function ri() {
  }
  function Ao(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(ri, ri), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Do(e), e;
      default:
        if (typeof t.status == "string") t.then(ri, ri);
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
            throw e = t.reason, Do(e), e;
        }
        throw sn = t, tn;
    }
  }
  var sn = null;
  function Ro() {
    if (sn === null) throw Error(o(459));
    var e = sn;
    return sn = null, e;
  }
  function Do(e) {
    if (e === tn || e === ci)
      throw Error(o(483));
  }
  var dl = !1;
  function Gc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Xc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function hl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function fl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (St & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = ei(e), bo(e, null, l), t;
    }
    return Pn(e, a, t, l), ei(e);
  }
  function ln(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  function Qc(e, t) {
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
  var Zc = !1;
  function an() {
    if (Zc) {
      var e = fa;
      if (e !== null) throw e;
    }
  }
  function nn(e, t, l, a) {
    Zc = !1;
    var n = e.updateQueue;
    dl = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var p = d, z = p.next;
      p.next = null, c === null ? i = z : c.next = z, c = p;
      var J = e.alternate;
      J !== null && (J = J.updateQueue, d = J.lastBaseUpdate, d !== c && (d === null ? J.firstBaseUpdate = z : d.next = z, J.lastBaseUpdate = p));
    }
    if (i !== null) {
      var te = n.baseState;
      c = 0, J = z = p = null, d = i;
      do {
        var D = d.lane & -536870913, H = D !== d.lane;
        if (H ? (vt & D) === D : (a & D) === D) {
          D !== 0 && D === ha && (Zc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var st = e, Fe = d;
            D = t;
            var Et = l;
            switch (Fe.tag) {
              case 1:
                if (st = Fe.payload, typeof st == "function") {
                  te = st.call(Et, te, D);
                  break e;
                }
                te = st;
                break e;
              case 3:
                st.flags = st.flags & -65537 | 128;
              case 0:
                if (st = Fe.payload, D = typeof st == "function" ? st.call(Et, te, D) : st, D == null) break e;
                te = U({}, te, D);
                break e;
              case 2:
                dl = !0;
            }
          }
          D = d.callback, D !== null && (e.flags |= 64, H && (e.flags |= 8192), H = n.callbacks, H === null ? n.callbacks = [D] : H.push(D));
        } else
          H = {
            lane: D,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, J === null ? (z = J = H, p = te) : J = J.next = H, c |= D;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          H = d, d = H.next, H.next = null, n.lastBaseUpdate = H, n.shared.pending = null;
        }
      } while (!0);
      J === null && (p = te), n.baseState = p, n.firstBaseUpdate = z, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), yl |= c, e.lanes = c, e.memoizedState = te;
    }
  }
  function Uo(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Mo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Uo(l[e], t);
  }
  var ma = Y(null), ui = Y(0);
  function qo(e, t) {
    e = sl, I(ui, e), I(ma, t), sl = e | t.baseLanes;
  }
  function Vc() {
    I(ui, sl), I(ma, ma.current);
  }
  function Jc() {
    sl = ui.current, $(ma), $(ui);
  }
  var ml = 0, ft = null, kt = null, Vt = null, oi = !1, xa = !1, Jl = !1, di = 0, cn = 0, ja = null, ix = 0;
  function Xt() {
    throw Error(o(321));
  }
  function Kc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!ms(e[l], t[l])) return !1;
    return !0;
  }
  function $c(e, t, l, a, n, i) {
    return ml = i, ft = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, b.H = e === null || e.memoizedState === null ? bd : yd, Jl = !1, i = l(a, n), Jl = !1, xa && (i = Bo(
      t,
      l,
      a,
      n
    )), Ho(e), i;
  }
  function Ho(e) {
    b.H = vi;
    var t = kt !== null && kt.next !== null;
    if (ml = 0, Vt = kt = ft = null, oi = !1, cn = 0, ja = null, t) throw Error(o(300));
    e === null || Ft || (e = e.dependencies, e !== null && ai(e) && (Ft = !0));
  }
  function Bo(e, t, l, a) {
    ft = e;
    var n = 0;
    do {
      if (xa && (ja = null), cn = 0, xa = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Vt = kt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      b.H = fx, i = t(l, a);
    } while (xa);
    return i;
  }
  function cx() {
    var e = b.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? rn(t) : t, e = e.useState()[0], (kt !== null ? kt.memoizedState : null) !== e && (ft.flags |= 1024), t;
  }
  function Wc() {
    var e = di !== 0;
    return di = 0, e;
  }
  function Fc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Ic(e) {
    if (oi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      oi = !1;
    }
    ml = 0, Vt = kt = ft = null, xa = !1, cn = di = 0, ja = null;
  }
  function ds() {
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
    if (kt === null) {
      var e = ft.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = kt.next;
    var t = Vt === null ? ft.memoizedState : Vt.next;
    if (t !== null)
      Vt = t, kt = e;
    else {
      if (e === null)
        throw ft.alternate === null ? Error(o(467)) : Error(o(310));
      kt = e, e = {
        memoizedState: kt.memoizedState,
        baseState: kt.baseState,
        baseQueue: kt.baseQueue,
        queue: kt.queue,
        next: null
      }, Vt === null ? ft.memoizedState = Vt = e : Vt = Vt.next = e;
    }
    return Vt;
  }
  function Pc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function rn(e) {
    var t = cn;
    return cn += 1, ja === null && (ja = []), e = Ao(ja, e, t), t = ft, (Vt === null ? t.memoizedState : Vt.next) === null && (t = t.alternate, b.H = t === null || t.memoizedState === null ? bd : yd), e;
  }
  function hi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return rn(e);
      if (e.$$typeof === P) return as(e);
    }
    throw Error(o(438, String(e)));
  }
  function er(e) {
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
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Pc(), ft.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ve;
    return t.index++, l;
  }
  function Ws(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function fi(e) {
    var t = Jt();
    return tr(t, kt, e);
  }
  function tr(e, t, l) {
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
        var te = z.lane & -536870913;
        if (te !== z.lane ? (vt & te) === te : (ml & te) === te) {
          var D = z.revertLane;
          if (D === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), te === ha && (J = !0);
          else if ((ml & D) === D) {
            z = z.next, D === ha && (J = !0);
            continue;
          } else
            te = {
              lane: 0,
              revertLane: z.revertLane,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, p === null ? (d = p = te, c = i) : p = p.next = te, ft.lanes |= D, yl |= D;
          te = z.action, Jl && l(i, te), i = z.hasEagerState ? z.eagerState : l(i, te);
        } else
          D = {
            lane: te,
            revertLane: z.revertLane,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, p === null ? (d = p = D, c = i) : p = p.next = D, ft.lanes |= te, yl |= te;
        z = z.next;
      } while (z !== null && z !== t);
      if (p === null ? c = i : p.next = d, !ms(i, e.memoizedState) && (Ft = !0, J && (l = fa, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = p, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function sr(e) {
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
      ms(i, t.memoizedState) || (Ft = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Lo(e, t, l) {
    var a = ft, n = Jt(), i = yt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !ms(
      (kt || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Ft = !0), n = n.queue;
    var d = Xo.bind(null, a, n, e);
    if (un(2048, 8, d, [e]), n.getSnapshot !== t || c || Vt !== null && Vt.memoizedState.tag & 1) {
      if (a.flags |= 2048, va(
        9,
        mi(),
        Go.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), zt === null) throw Error(o(349));
      i || (ml & 124) !== 0 || Yo(a, t, l);
    }
    return l;
  }
  function Yo(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ft.updateQueue, t === null ? (t = Pc(), ft.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Go(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Qo(t) && Zo(e);
  }
  function Xo(e, t, l) {
    return l(function() {
      Qo(t) && Zo(e);
    });
  }
  function Qo(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !ms(e, l);
    } catch {
      return !0;
    }
  }
  function Zo(e) {
    var t = ra(e, 2);
    t !== null && bs(t, e, 2);
  }
  function lr(e) {
    var t = ds();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Jl) {
        qe(!0);
        try {
          l();
        } finally {
          qe(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ws,
      lastRenderedState: e
    }, t;
  }
  function Vo(e, t, l, a) {
    return e.baseState = l, tr(
      e,
      kt,
      typeof a == "function" ? a : Ws
    );
  }
  function rx(e, t, l, a, n) {
    if (ji(e)) throw Error(o(485));
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
      b.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Jo(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Jo(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = b.T, c = {};
      b.T = c;
      try {
        var d = l(n, a), p = b.S;
        p !== null && p(c, d), Ko(e, t, d);
      } catch (z) {
        ar(e, t, z);
      } finally {
        b.T = i;
      }
    } else
      try {
        i = l(n, a), Ko(e, t, i);
      } catch (z) {
        ar(e, t, z);
      }
  }
  function Ko(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        $o(e, t, a);
      },
      function(a) {
        return ar(e, t, a);
      }
    ) : $o(e, t, l);
  }
  function $o(e, t, l) {
    t.status = "fulfilled", t.value = l, Wo(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Jo(e, l)));
  }
  function ar(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Wo(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Wo(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Fo(e, t) {
    return t;
  }
  function Io(e, t) {
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
                  if (n = Rs(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Ht = Rs(
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
    return l = ds(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Fo,
      lastRenderedState: t
    }, l.queue = a, l = vd.bind(
      null,
      ft,
      a
    ), a.dispatch = l, a = lr(!1), i = ur.bind(
      null,
      ft,
      !1,
      a.queue
    ), a = ds(), n = {
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
  function Po(e) {
    var t = Jt();
    return ed(t, kt, e);
  }
  function ed(e, t, l) {
    if (t = tr(
      e,
      t,
      Fo
    )[0], e = fi(Ws)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = rn(t);
      } catch (c) {
        throw c === tn ? ci : c;
      }
    else a = t;
    t = Jt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ft.flags |= 2048, va(
      9,
      mi(),
      ux.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function ux(e, t) {
    e.action = t;
  }
  function td(e) {
    var t = Jt(), l = kt;
    if (l !== null)
      return ed(t, l, e);
    Jt(), t = t.memoizedState, l = Jt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function va(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ft.updateQueue, t === null && (t = Pc(), ft.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function mi() {
    return { destroy: void 0, resource: void 0 };
  }
  function sd() {
    return Jt().memoizedState;
  }
  function xi(e, t, l, a) {
    var n = ds();
    a = a === void 0 ? null : a, ft.flags |= e, n.memoizedState = va(
      1 | t,
      mi(),
      l,
      a
    );
  }
  function un(e, t, l, a) {
    var n = Jt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    kt !== null && a !== null && Kc(a, kt.memoizedState.deps) ? n.memoizedState = va(t, i, l, a) : (ft.flags |= e, n.memoizedState = va(
      1 | t,
      i,
      l,
      a
    ));
  }
  function ld(e, t) {
    xi(8390656, 8, e, t);
  }
  function ad(e, t) {
    un(2048, 8, e, t);
  }
  function nd(e, t) {
    return un(4, 2, e, t);
  }
  function id(e, t) {
    return un(4, 4, e, t);
  }
  function cd(e, t) {
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
  function rd(e, t, l) {
    l = l != null ? l.concat([e]) : null, un(4, 4, cd.bind(null, t, e), l);
  }
  function nr() {
  }
  function ud(e, t) {
    var l = Jt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Kc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function od(e, t) {
    var l = Jt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Kc(t, a[1]))
      return a[0];
    if (a = e(), Jl) {
      qe(!0);
      try {
        e();
      } finally {
        qe(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function ir(e, t, l) {
    return l === void 0 || (ml & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = fh(), ft.lanes |= e, yl |= e, l);
  }
  function dd(e, t, l, a) {
    return ms(l, t) ? l : ma.current !== null ? (e = ir(e, l, a), ms(e, t) || (Ft = !0), e) : (ml & 42) === 0 ? (Ft = !0, e.memoizedState = l) : (e = fh(), ft.lanes |= e, yl |= e, t);
  }
  function hd(e, t, l, a, n) {
    var i = Q.p;
    Q.p = i !== 0 && 8 > i ? i : 8;
    var c = b.T, d = {};
    b.T = d, ur(e, !1, t, l);
    try {
      var p = n(), z = b.S;
      if (z !== null && z(d, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var J = nx(
          p,
          a
        );
        on(
          e,
          t,
          J,
          gs(e)
        );
      } else
        on(
          e,
          t,
          a,
          gs(e)
        );
    } catch (te) {
      on(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: te },
        gs()
      );
    } finally {
      Q.p = i, b.T = c;
    }
  }
  function ox() {
  }
  function cr(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = fd(e).queue;
    hd(
      e,
      n,
      t,
      le,
      l === null ? ox : function() {
        return md(e), l(a);
      }
    );
  }
  function fd(e) {
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
        lastRenderedReducer: Ws,
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
        lastRenderedReducer: Ws,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function md(e) {
    var t = fd(e).next.queue;
    on(e, t, {}, gs());
  }
  function rr() {
    return as(En);
  }
  function xd() {
    return Jt().memoizedState;
  }
  function jd() {
    return Jt().memoizedState;
  }
  function dx(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = gs();
          e = hl(l);
          var a = fl(t, e, l);
          a !== null && (bs(a, t, l), ln(a, t, l)), t = { cache: Hc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function hx(e, t, l) {
    var a = gs();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ji(e) ? pd(t, l) : (l = Ec(e, t, l, a), l !== null && (bs(l, e, a), gd(l, t, a)));
  }
  function vd(e, t, l) {
    var a = gs();
    on(e, t, l, a);
  }
  function on(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ji(e)) pd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, d = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, ms(d, c))
            return Pn(e, t, n, 0), zt === null && In(), !1;
        } catch {
        } finally {
        }
      if (l = Ec(e, t, n, a), l !== null)
        return bs(l, e, a), gd(l, t, a), !0;
    }
    return !1;
  }
  function ur(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Yr(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ji(e)) {
      if (t) throw Error(o(479));
    } else
      t = Ec(
        e,
        l,
        a,
        2
      ), t !== null && bs(t, e, 2);
  }
  function ji(e) {
    var t = e.alternate;
    return e === ft || t !== null && t === ft;
  }
  function pd(e, t) {
    xa = oi = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function gd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  var vi = {
    readContext: as,
    use: hi,
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
  }, bd = {
    readContext: as,
    use: hi,
    useCallback: function(e, t) {
      return ds().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: as,
    useEffect: ld,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, xi(
        4194308,
        4,
        cd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return xi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      xi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ds();
      t = t === void 0 ? null : t;
      var a = e();
      if (Jl) {
        qe(!0);
        try {
          e();
        } finally {
          qe(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = ds();
      if (l !== void 0) {
        var n = l(t);
        if (Jl) {
          qe(!0);
          try {
            l(t);
          } finally {
            qe(!1);
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
      var t = ds();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = lr(e);
      var t = e.queue, l = vd.bind(null, ft, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: nr,
    useDeferredValue: function(e, t) {
      var l = ds();
      return ir(l, e, t);
    },
    useTransition: function() {
      var e = lr(!1);
      return e = hd.bind(
        null,
        ft,
        e.queue,
        !0,
        !1
      ), ds().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ft, n = ds();
      if (yt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), zt === null)
          throw Error(o(349));
        (vt & 124) !== 0 || Yo(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, ld(Xo.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, va(
        9,
        mi(),
        Go.bind(
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
      var e = ds(), t = zt.identifierPrefix;
      if (yt) {
        var l = Js, a = Vs;
        l = (a & ~(1 << 32 - Qe(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = di++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = ix++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: rr,
    useFormState: Io,
    useActionState: Io,
    useOptimistic: function(e) {
      var t = ds();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = ur.bind(
        null,
        ft,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: er,
    useCacheRefresh: function() {
      return ds().memoizedState = dx.bind(
        null,
        ft
      );
    }
  }, yd = {
    readContext: as,
    use: hi,
    useCallback: ud,
    useContext: as,
    useEffect: ad,
    useImperativeHandle: rd,
    useInsertionEffect: nd,
    useLayoutEffect: id,
    useMemo: od,
    useReducer: fi,
    useRef: sd,
    useState: function() {
      return fi(Ws);
    },
    useDebugValue: nr,
    useDeferredValue: function(e, t) {
      var l = Jt();
      return dd(
        l,
        kt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = fi(Ws)[0], t = Jt().memoizedState;
      return [
        typeof e == "boolean" ? e : rn(e),
        t
      ];
    },
    useSyncExternalStore: Lo,
    useId: xd,
    useHostTransitionStatus: rr,
    useFormState: Po,
    useActionState: Po,
    useOptimistic: function(e, t) {
      var l = Jt();
      return Vo(l, kt, e, t);
    },
    useMemoCache: er,
    useCacheRefresh: jd
  }, fx = {
    readContext: as,
    use: hi,
    useCallback: ud,
    useContext: as,
    useEffect: ad,
    useImperativeHandle: rd,
    useInsertionEffect: nd,
    useLayoutEffect: id,
    useMemo: od,
    useReducer: sr,
    useRef: sd,
    useState: function() {
      return sr(Ws);
    },
    useDebugValue: nr,
    useDeferredValue: function(e, t) {
      var l = Jt();
      return kt === null ? ir(l, e, t) : dd(
        l,
        kt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = sr(Ws)[0], t = Jt().memoizedState;
      return [
        typeof e == "boolean" ? e : rn(e),
        t
      ];
    },
    useSyncExternalStore: Lo,
    useId: xd,
    useHostTransitionStatus: rr,
    useFormState: td,
    useActionState: td,
    useOptimistic: function(e, t) {
      var l = Jt();
      return kt !== null ? Vo(l, kt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: er,
    useCacheRefresh: jd
  }, pa = null, dn = 0;
  function pi(e) {
    var t = dn;
    return dn += 1, pa === null && (pa = []), Ao(pa, e, t);
  }
  function hn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function gi(e, t) {
    throw t.$$typeof === K ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function _d(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Nd(e) {
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
      return C = Zs(C, S), C.index = 0, C.sibling = null, C;
    }
    function i(C, S, O) {
      return C.index = O, e ? (O = C.alternate, O !== null ? (O = O.index, O < S ? (C.flags |= 67108866, S) : O) : (C.flags |= 67108866, S)) : (C.flags |= 1048576, S);
    }
    function c(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function d(C, S, O, W) {
      return S === null || S.tag !== 6 ? (S = Tc(O, C.mode, W), S.return = C, S) : (S = n(S, O), S.return = C, S);
    }
    function p(C, S, O, W) {
      var Me = O.type;
      return Me === je ? J(
        C,
        S,
        O.props.children,
        W,
        O.key
      ) : S !== null && (S.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Ae && _d(Me) === S.type) ? (S = n(S, O.props), hn(S, O), S.return = C, S) : (S = ti(
        O.type,
        O.key,
        O.props,
        null,
        C.mode,
        W
      ), hn(S, O), S.return = C, S);
    }
    function z(C, S, O, W) {
      return S === null || S.tag !== 4 || S.stateNode.containerInfo !== O.containerInfo || S.stateNode.implementation !== O.implementation ? (S = zc(O, C.mode, W), S.return = C, S) : (S = n(S, O.children || []), S.return = C, S);
    }
    function J(C, S, O, W, Me) {
      return S === null || S.tag !== 7 ? (S = Bl(
        O,
        C.mode,
        W,
        Me
      ), S.return = C, S) : (S = n(S, O), S.return = C, S);
    }
    function te(C, S, O) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return S = Tc(
          "" + S,
          C.mode,
          O
        ), S.return = C, S;
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case k:
            return O = ti(
              S.type,
              S.key,
              S.props,
              null,
              C.mode,
              O
            ), hn(O, S), O.return = C, O;
          case se:
            return S = zc(
              S,
              C.mode,
              O
            ), S.return = C, S;
          case Ae:
            var W = S._init;
            return S = W(S._payload), te(C, S, O);
        }
        if (oe(S) || ge(S))
          return S = Bl(
            S,
            C.mode,
            O,
            null
          ), S.return = C, S;
        if (typeof S.then == "function")
          return te(C, pi(S), O);
        if (S.$$typeof === P)
          return te(
            C,
            ni(C, S),
            O
          );
        gi(C, S);
      }
      return null;
    }
    function D(C, S, O, W) {
      var Me = S !== null ? S.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return Me !== null ? null : d(C, S, "" + O, W);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            return O.key === Me ? p(C, S, O, W) : null;
          case se:
            return O.key === Me ? z(C, S, O, W) : null;
          case Ae:
            return Me = O._init, O = Me(O._payload), D(C, S, O, W);
        }
        if (oe(O) || ge(O))
          return Me !== null ? null : J(C, S, O, W, null);
        if (typeof O.then == "function")
          return D(
            C,
            S,
            pi(O),
            W
          );
        if (O.$$typeof === P)
          return D(
            C,
            S,
            ni(C, O),
            W
          );
        gi(C, O);
      }
      return null;
    }
    function H(C, S, O, W, Me) {
      if (typeof W == "string" && W !== "" || typeof W == "number" || typeof W == "bigint")
        return C = C.get(O) || null, d(S, C, "" + W, Me);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case k:
            return C = C.get(
              W.key === null ? O : W.key
            ) || null, p(S, C, W, Me);
          case se:
            return C = C.get(
              W.key === null ? O : W.key
            ) || null, z(S, C, W, Me);
          case Ae:
            var mt = W._init;
            return W = mt(W._payload), H(
              C,
              S,
              O,
              W,
              Me
            );
        }
        if (oe(W) || ge(W))
          return C = C.get(O) || null, J(S, C, W, Me, null);
        if (typeof W.then == "function")
          return H(
            C,
            S,
            O,
            pi(W),
            Me
          );
        if (W.$$typeof === P)
          return H(
            C,
            S,
            O,
            ni(S, W),
            Me
          );
        gi(S, W);
      }
      return null;
    }
    function st(C, S, O, W) {
      for (var Me = null, mt = null, Xe = S, Ie = S = 0, Pt = null; Xe !== null && Ie < O.length; Ie++) {
        Xe.index > Ie ? (Pt = Xe, Xe = null) : Pt = Xe.sibling;
        var pt = D(
          C,
          Xe,
          O[Ie],
          W
        );
        if (pt === null) {
          Xe === null && (Xe = Pt);
          break;
        }
        e && Xe && pt.alternate === null && t(C, Xe), S = i(pt, S, Ie), mt === null ? Me = pt : mt.sibling = pt, mt = pt, Xe = Pt;
      }
      if (Ie === O.length)
        return l(C, Xe), yt && Yl(C, Ie), Me;
      if (Xe === null) {
        for (; Ie < O.length; Ie++)
          Xe = te(C, O[Ie], W), Xe !== null && (S = i(
            Xe,
            S,
            Ie
          ), mt === null ? Me = Xe : mt.sibling = Xe, mt = Xe);
        return yt && Yl(C, Ie), Me;
      }
      for (Xe = a(Xe); Ie < O.length; Ie++)
        Pt = H(
          Xe,
          C,
          Ie,
          O[Ie],
          W
        ), Pt !== null && (e && Pt.alternate !== null && Xe.delete(
          Pt.key === null ? Ie : Pt.key
        ), S = i(
          Pt,
          S,
          Ie
        ), mt === null ? Me = Pt : mt.sibling = Pt, mt = Pt);
      return e && Xe.forEach(function(Tl) {
        return t(C, Tl);
      }), yt && Yl(C, Ie), Me;
    }
    function Fe(C, S, O, W) {
      if (O == null) throw Error(o(151));
      for (var Me = null, mt = null, Xe = S, Ie = S = 0, Pt = null, pt = O.next(); Xe !== null && !pt.done; Ie++, pt = O.next()) {
        Xe.index > Ie ? (Pt = Xe, Xe = null) : Pt = Xe.sibling;
        var Tl = D(C, Xe, pt.value, W);
        if (Tl === null) {
          Xe === null && (Xe = Pt);
          break;
        }
        e && Xe && Tl.alternate === null && t(C, Xe), S = i(Tl, S, Ie), mt === null ? Me = Tl : mt.sibling = Tl, mt = Tl, Xe = Pt;
      }
      if (pt.done)
        return l(C, Xe), yt && Yl(C, Ie), Me;
      if (Xe === null) {
        for (; !pt.done; Ie++, pt = O.next())
          pt = te(C, pt.value, W), pt !== null && (S = i(pt, S, Ie), mt === null ? Me = pt : mt.sibling = pt, mt = pt);
        return yt && Yl(C, Ie), Me;
      }
      for (Xe = a(Xe); !pt.done; Ie++, pt = O.next())
        pt = H(Xe, C, Ie, pt.value, W), pt !== null && (e && pt.alternate !== null && Xe.delete(pt.key === null ? Ie : pt.key), S = i(pt, S, Ie), mt === null ? Me = pt : mt.sibling = pt, mt = pt);
      return e && Xe.forEach(function(mj) {
        return t(C, mj);
      }), yt && Yl(C, Ie), Me;
    }
    function Et(C, S, O, W) {
      if (typeof O == "object" && O !== null && O.type === je && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            e: {
              for (var Me = O.key; S !== null; ) {
                if (S.key === Me) {
                  if (Me = O.type, Me === je) {
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
                  } else if (S.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Ae && _d(Me) === S.type) {
                    l(
                      C,
                      S.sibling
                    ), W = n(S, O.props), hn(W, O), W.return = C, C = W;
                    break e;
                  }
                  l(C, S);
                  break;
                } else t(C, S);
                S = S.sibling;
              }
              O.type === je ? (W = Bl(
                O.props.children,
                C.mode,
                W,
                O.key
              ), W.return = C, C = W) : (W = ti(
                O.type,
                O.key,
                O.props,
                null,
                C.mode,
                W
              ), hn(W, O), W.return = C, C = W);
            }
            return c(C);
          case se:
            e: {
              for (Me = O.key; S !== null; ) {
                if (S.key === Me)
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
              W = zc(O, C.mode, W), W.return = C, C = W;
            }
            return c(C);
          case Ae:
            return Me = O._init, O = Me(O._payload), Et(
              C,
              S,
              O,
              W
            );
        }
        if (oe(O))
          return st(
            C,
            S,
            O,
            W
          );
        if (ge(O)) {
          if (Me = ge(O), typeof Me != "function") throw Error(o(150));
          return O = Me.call(O), Fe(
            C,
            S,
            O,
            W
          );
        }
        if (typeof O.then == "function")
          return Et(
            C,
            S,
            pi(O),
            W
          );
        if (O.$$typeof === P)
          return Et(
            C,
            S,
            ni(C, O),
            W
          );
        gi(C, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, S !== null && S.tag === 6 ? (l(C, S.sibling), W = n(S, O), W.return = C, C = W) : (l(C, S), W = Tc(O, C.mode, W), W.return = C, C = W), c(C)) : l(C, S);
    }
    return function(C, S, O, W) {
      try {
        dn = 0;
        var Me = Et(
          C,
          S,
          O,
          W
        );
        return pa = null, Me;
      } catch (Xe) {
        if (Xe === tn || Xe === ci) throw Xe;
        var mt = xs(29, Xe, null, C.mode);
        return mt.lanes = W, mt.return = C, mt;
      } finally {
      }
    };
  }
  var ga = Nd(!0), Sd = Nd(!1), Cs = Y(null), Bs = null;
  function xl(e) {
    var t = e.alternate;
    I(Wt, Wt.current & 1), I(Cs, e), Bs === null && (t === null || ma.current !== null || t.memoizedState !== null) && (Bs = e);
  }
  function wd(e) {
    if (e.tag === 22) {
      if (I(Wt, Wt.current), I(Cs, e), Bs === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Bs = e);
      }
    } else jl();
  }
  function jl() {
    I(Wt, Wt.current), I(Cs, Cs.current);
  }
  function Fs(e) {
    $(Cs), Bs === e && (Bs = null), $(Wt);
  }
  var Wt = Y(0);
  function bi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Pr(l)))
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
  function or(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : U({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var dr = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = gs(), n = hl(a);
      n.payload = t, l != null && (n.callback = l), t = fl(e, n, a), t !== null && (bs(t, e, a), ln(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = gs(), n = hl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = fl(e, n, a), t !== null && (bs(t, e, a), ln(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = gs(), a = hl(l);
      a.tag = 2, t != null && (a.callback = t), t = fl(e, a, l), t !== null && (bs(t, e, l), ln(t, e, l));
    }
  };
  function kd(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !Ja(l, a) || !Ja(n, i) : !0;
  }
  function Cd(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && dr.enqueueReplaceState(t, t.state, null);
  }
  function Kl(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = U({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var yi = typeof reportError == "function" ? reportError : function(e) {
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
  function Ed(e) {
    yi(e);
  }
  function Od(e) {
    console.error(e);
  }
  function Td(e) {
    yi(e);
  }
  function _i(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function zd(e, t, l) {
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
  function hr(e, t, l) {
    return l = hl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      _i(e, t);
    }, l;
  }
  function Ad(e) {
    return e = hl(e), e.tag = 3, e;
  }
  function Rd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        zd(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      zd(t, l, a), typeof n != "function" && (_l === null ? _l = /* @__PURE__ */ new Set([this]) : _l.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function mx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ia(
        t,
        l,
        n,
        !0
      ), l = Cs.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Bs === null ? Mr() : l.alternate === null && Bt === 0 && (Bt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Yc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Hr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Yc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Hr(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return Hr(e, a, n), Mr(), !1;
    }
    if (yt)
      return t = Cs.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Dc && (e = Error(o(422), { cause: a }), Fa(Ns(e, l)))) : (a !== Dc && (t = Error(o(423), {
        cause: a
      }), Fa(
        Ns(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Ns(a, l), n = hr(
        e.stateNode,
        a,
        n
      ), Qc(e, n), Bt !== 4 && (Bt = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = Ns(i, l), gn === null ? gn = [i] : gn.push(i), Bt !== 4 && (Bt = 2), t === null) return !0;
    a = Ns(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = hr(l.stateNode, a, e), Qc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (_l === null || !_l.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Ad(n), Rd(
              n,
              e,
              l,
              a
            ), Qc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Dd = Error(o(461)), Ft = !1;
  function ts(e, t, l, a) {
    t.child = e === null ? Sd(t, null, l, a) : ga(
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
    return Zl(t), a = $c(
      e,
      t,
      l,
      c,
      i,
      n
    ), d = Wc(), e !== null && !Ft ? (Fc(e, t, n), Is(e, t, n)) : (yt && d && Ac(t), t.flags |= 1, ts(e, t, a, n), t.child);
  }
  function Md(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !Oc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, qd(
        e,
        t,
        i,
        a,
        n
      )) : (e = ti(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !br(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Ja, l(c, a) && e.ref === t.ref)
        return Is(e, t, n);
    }
    return t.flags |= 1, e = Zs(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function qd(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Ja(i, a) && e.ref === t.ref)
        if (Ft = !1, t.pendingProps = a = i, br(e, n))
          (e.flags & 131072) !== 0 && (Ft = !0);
        else
          return t.lanes = e.lanes, Is(e, t, n);
    }
    return fr(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Hd(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return Bd(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ii(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? qo(t, i) : Vc(), wd(t);
      else
        return t.lanes = t.childLanes = 536870912, Bd(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ii(t, i.cachePool), qo(t, i), jl(), t.memoizedState = null) : (e !== null && ii(t, null), Vc(), jl());
    return ts(e, t, n, l), t.child;
  }
  function Bd(e, t, l, a) {
    var n = Lc();
    return n = n === null ? null : { parent: $t._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && ii(t, null), Vc(), wd(t), e !== null && Ia(e, t, a, !0), null;
  }
  function Ni(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function fr(e, t, l, a, n) {
    return Zl(t), l = $c(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Wc(), e !== null && !Ft ? (Fc(e, t, n), Is(e, t, n)) : (yt && a && Ac(t), t.flags |= 1, ts(e, t, l, n), t.child);
  }
  function Ld(e, t, l, a, n, i) {
    return Zl(t), t.updateQueue = null, l = Bo(
      t,
      a,
      l,
      n
    ), Ho(e), a = Wc(), e !== null && !Ft ? (Fc(e, t, i), Is(e, t, i)) : (yt && a && Ac(t), t.flags |= 1, ts(e, t, l, i), t.child);
  }
  function Yd(e, t, l, a, n) {
    if (Zl(t), t.stateNode === null) {
      var i = ua, c = l.contextType;
      typeof c == "object" && c !== null && (i = as(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = dr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Gc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? as(c) : ua, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (or(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && dr.enqueueReplaceState(i, i.state, null), nn(t, a, i, n), an(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, p = Kl(l, d);
      i.props = p;
      var z = i.context, J = l.contextType;
      c = ua, typeof J == "object" && J !== null && (c = as(J));
      var te = l.getDerivedStateFromProps;
      J = typeof te == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || z !== c) && Cd(
        t,
        i,
        a,
        c
      ), dl = !1;
      var D = t.memoizedState;
      i.state = D, nn(t, a, i, n), an(), z = t.memoizedState, d || D !== z || dl ? (typeof te == "function" && (or(
        t,
        l,
        te,
        a
      ), z = t.memoizedState), (p = dl || kd(
        t,
        l,
        p,
        a,
        D,
        z,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = c, a = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Xc(e, t), c = t.memoizedProps, J = Kl(l, c), i.props = J, te = t.pendingProps, D = i.context, z = l.contextType, p = ua, typeof z == "object" && z !== null && (p = as(z)), d = l.getDerivedStateFromProps, (z = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== te || D !== p) && Cd(
        t,
        i,
        a,
        p
      ), dl = !1, D = t.memoizedState, i.state = D, nn(t, a, i, n), an();
      var H = t.memoizedState;
      c !== te || D !== H || dl || e !== null && e.dependencies !== null && ai(e.dependencies) ? (typeof d == "function" && (or(
        t,
        l,
        d,
        a
      ), H = t.memoizedState), (J = dl || kd(
        t,
        l,
        J,
        a,
        D,
        H,
        p
      ) || e !== null && e.dependencies !== null && ai(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, H, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        H,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = H), i.props = a, i.state = H, i.context = p, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, Ni(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ga(
      t,
      e.child,
      null,
      n
    ), t.child = ga(
      t,
      null,
      l,
      n
    )) : ts(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Is(
      e,
      t,
      n
    ), e;
  }
  function Gd(e, t, l, a) {
    return Wa(), t.flags |= 256, ts(e, t, l, a), t.child;
  }
  var mr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function xr(e) {
    return { baseLanes: e, cachePool: Oo() };
  }
  function jr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Es), e;
  }
  function Xd(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Wt.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (yt) {
        if (n ? xl(t) : jl(), yt) {
          var d = Ht, p;
          if (p = d) {
            e: {
              for (p = d, d = Hs; p.nodeType !== 8; ) {
                if (!d) {
                  d = null;
                  break e;
                }
                if (p = Rs(
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
              treeContext: Ll !== null ? { id: Vs, overflow: Js } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = xs(
              18,
              null,
              null,
              0
            ), p.stateNode = d, p.return = t, t.child = p, rs = t, Ht = null, p = !0) : p = !1;
          }
          p || Xl(t);
        }
        if (d = t.memoizedState, d !== null && (d = d.dehydrated, d !== null))
          return Pr(d) ? t.lanes = 32 : t.lanes = 536870912, null;
        Fs(t);
      }
      return d = a.children, a = a.fallback, n ? (jl(), n = t.mode, d = Si(
        { mode: "hidden", children: d },
        n
      ), a = Bl(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, n = t.child, n.memoizedState = xr(l), n.childLanes = jr(
        e,
        c,
        l
      ), t.memoizedState = mr, a) : (xl(t), vr(t, d));
    }
    if (p = e.memoizedState, p !== null && (d = p.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (xl(t), t.flags &= -257, t = pr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (jl(), t.child = e.child, t.flags |= 128, t = null) : (jl(), n = a.fallback, d = t.mode, a = Si(
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
        ), a = t.child, a.memoizedState = xr(l), a.childLanes = jr(
          e,
          c,
          l
        ), t.memoizedState = mr, t = n);
      else if (xl(t), Pr(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var z = c.dgst;
        c = z, a = Error(o(419)), a.stack = "", a.digest = c, Fa({ value: a, source: null, stack: null }), t = pr(
          e,
          t,
          l
        );
      } else if (Ft || Ia(e, t, l, !1), c = (l & e.childLanes) !== 0, Ft || c) {
        if (c = zt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : fe(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== p.retryLane))
          throw p.retryLane = a, ra(e, a), bs(c, e, a), Dd;
        d.data === "$?" || Mr(), t = pr(
          e,
          t,
          l
        );
      } else
        d.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Ht = Rs(
          d.nextSibling
        ), rs = t, yt = !0, Gl = null, Hs = !1, e !== null && (ws[ks++] = Vs, ws[ks++] = Js, ws[ks++] = Ll, Vs = e.id, Js = e.overflow, Ll = t), t = vr(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (jl(), n = a.fallback, d = t.mode, p = e.child, z = p.sibling, a = Zs(p, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = p.subtreeFlags & 65011712, z !== null ? n = Zs(z, n) : (n = Bl(
      n,
      d,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, d = e.child.memoizedState, d === null ? d = xr(l) : (p = d.cachePool, p !== null ? (z = $t._currentValue, p = p.parent !== z ? { parent: z, pool: z } : p) : p = Oo(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: p
    }), n.memoizedState = d, n.childLanes = jr(
      e,
      c,
      l
    ), t.memoizedState = mr, a) : (xl(t), l = e.child, e = l.sibling, l = Zs(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function vr(e, t) {
    return t = Si(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Si(e, t) {
    return e = xs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function pr(e, t, l) {
    return ga(t, e.child, null, l), e = vr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Qd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Mc(e.return, t, l);
  }
  function gr(e, t, l, a, n) {
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
  function Zd(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (ts(e, t, a.children, l), a = Wt.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Qd(e, l, t);
          else if (e.tag === 19)
            Qd(e, l, t);
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
    switch (I(Wt, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && bi(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), gr(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && bi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        gr(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        gr(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Is(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), yl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ia(
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
      for (e = t.child, l = Zs(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Zs(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function br(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ai(e)));
  }
  function xx(e, t, l) {
    switch (t.tag) {
      case 3:
        ne(t, t.stateNode.containerInfo), ol(t, $t, e.memoizedState.cache), Wa();
        break;
      case 27:
      case 5:
        We(t);
        break;
      case 4:
        ne(t, t.stateNode.containerInfo);
        break;
      case 10:
        ol(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (xl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Xd(e, t, l) : (xl(t), e = Is(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        xl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ia(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Zd(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), I(Wt, Wt.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Hd(e, t, l);
      case 24:
        ol(t, $t, e.memoizedState.cache);
    }
    return Is(e, t, l);
  }
  function Vd(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ft = !0;
      else {
        if (!br(e, l) && (t.flags & 128) === 0)
          return Ft = !1, xx(
            e,
            t,
            l
          );
        Ft = (e.flags & 131072) !== 0;
      }
    else
      Ft = !1, yt && (t.flags & 1048576) !== 0 && _o(t, li, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            Oc(a) ? (e = Kl(a, e), t.tag = 1, t = Yd(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = fr(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === ue) {
                t.tag = 11, t = Ud(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === ve) {
                t.tag = 14, t = Md(
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
        return fr(
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
        ), Yd(
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
          n = i.element, Xc(e, t), nn(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, ol(t, $t, a), a !== i.cache && qc(
            t,
            [$t],
            l,
            !0
          ), an(), a = c.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Gd(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Ns(
                Error(o(424)),
                t
              ), Fa(n), t = Gd(
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
              for (Ht = Rs(e.firstChild), rs = t, yt = !0, Gl = null, Hs = !0, l = Sd(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Wa(), a === n) {
              t = Is(
                e,
                t,
                l
              );
              break e;
            }
            ts(
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
        return Ni(e, t), e === null ? (l = Wh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : yt || (l = t.type, e = t.pendingProps, a = Hi(
          F.current
        ).createElement(l), a[ht] = t, a[_t] = e, ls(a, l, e), R(a), t.stateNode = a) : t.memoizedState = Wh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return We(t), e === null && yt && (a = t.stateNode = Jh(
          t.type,
          t.pendingProps,
          F.current
        ), rs = t, Hs = !0, n = Ht, wl(t.type) ? (eu = n, Ht = Rs(
          a.firstChild
        )) : Ht = n), ts(
          e,
          t,
          t.pendingProps.children,
          l
        ), Ni(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && yt && ((n = a = Ht) && (a = Xx(
          a,
          t.type,
          t.pendingProps,
          Hs
        ), a !== null ? (t.stateNode = a, rs = t, Ht = Rs(
          a.firstChild
        ), Hs = !1, n = !0) : n = !1), n || Xl(t)), We(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, Wr(n, i) ? a = null : c !== null && Wr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = $c(
          e,
          t,
          cx,
          null,
          null,
          l
        ), En._currentValue = n), Ni(e, t), ts(e, t, a, l), t.child;
      case 6:
        return e === null && yt && ((e = l = Ht) && (l = Qx(
          l,
          t.pendingProps,
          Hs
        ), l !== null ? (t.stateNode = l, rs = t, Ht = null, e = !0) : e = !1), e || Xl(t)), null;
      case 13:
        return Xd(e, t, l);
      case 4:
        return ne(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ga(
          t,
          null,
          a,
          l
        ) : ts(
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
        return ts(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return ts(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return ts(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, ol(t, t.type, a.value), ts(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Zl(t), n = as(n), a = a(n), t.flags |= 1, ts(e, t, a, l), t.child;
      case 14:
        return Md(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return qd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Zd(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = Si(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Zs(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return Hd(e, t, l);
      case 24:
        return Zl(t), a = as($t), e === null ? (n = Lc(), n === null && (n = zt, i = Hc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Gc(t), ol(t, $t, n)) : ((e.lanes & l) !== 0 && (Xc(e, t), nn(t, null, null, l), an()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), ol(t, $t, a)) : (a = i.cache, ol(t, $t, a), a !== n.cache && qc(
          t,
          [$t],
          l,
          !0
        ))), ts(
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
  function Ps(e) {
    e.flags |= 4;
  }
  function Jd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !tf(t)) {
      if (t = Cs.current, t !== null && ((vt & 4194048) === vt ? Bs !== null : (vt & 62914560) !== vt && (vt & 536870912) === 0 || t !== Bs))
        throw sn = Yc, To;
      e.flags |= 8192;
    }
  }
  function wi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? M() : 536870912, e.lanes |= t, Na |= t);
  }
  function fn(e, t) {
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
  function Mt(e) {
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
    switch (Rc(t), t.tag) {
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
        return Mt(t), null;
      case 1:
        return Mt(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), $s($t), ze(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && ($a(t) ? Ps(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, wo())), Mt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Ps(t), l !== null ? (Mt(t), Jd(t, l)) : (Mt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Ps(t), Mt(t), Jd(t, l)) : (Mt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Ps(t), Mt(t), t.flags &= -16777217), null;
      case 27:
        it(t), l = F.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Ps(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Mt(t), null;
          }
          e = ce.current, $a(t) ? No(t) : (e = Jh(n, a, l), t.stateNode = e, Ps(t));
        }
        return Mt(t), null;
      case 5:
        if (it(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Ps(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Mt(t), null;
          }
          if (e = ce.current, $a(t))
            No(t);
          else {
            switch (n = Hi(
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
                    e = typeof a.is == "string" ? n.createElement("select", { is: a.is }) : n.createElement("select"), a.multiple ? e.multiple = !0 : a.size && (e.size = a.size);
                    break;
                  default:
                    e = typeof a.is == "string" ? n.createElement(l, { is: a.is }) : n.createElement(l);
                }
            }
            e[ht] = t, e[_t] = a;
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
            e: switch (ls(e, l, a), l) {
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
            e && Ps(t);
          }
        }
        return Mt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Ps(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = F.current, $a(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = rs, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[ht] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Lh(e.nodeValue, l)), e || Xl(t);
          } else
            e = Hi(e).createTextNode(
              a
            ), e[ht] = t, t.stateNode = e;
        }
        return Mt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = $a(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[ht] = t;
            } else
              Wa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Mt(t), n = !1;
          } else
            n = wo(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Fs(t), t) : (Fs(t), null);
        }
        if (Fs(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), wi(t, t.updateQueue), Mt(t), null;
      case 4:
        return ze(), e === null && Zr(t.stateNode.containerInfo), Mt(t), null;
      case 10:
        return $s(t.type), Mt(t), null;
      case 19:
        if ($(Wt), n = t.memoizedState, n === null) return Mt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) fn(n, !1);
          else {
            if (Bt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = bi(e), i !== null) {
                  for (t.flags |= 128, fn(n, !1), e = i.updateQueue, t.updateQueue = e, wi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    yo(l, e), l = l.sibling;
                  return I(
                    Wt,
                    Wt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && He() > Ei && (t.flags |= 128, a = !0, fn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = bi(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, wi(t, e), fn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !yt)
                return Mt(t), null;
            } else
              2 * He() - n.renderingStartTime > Ei && l !== 536870912 && (t.flags |= 128, a = !0, fn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = He(), t.sibling = null, e = Wt.current, I(Wt, a ? e & 1 | 2 : e & 1), t) : (Mt(t), null);
      case 22:
      case 23:
        return Fs(t), Jc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Mt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Mt(t), l = t.updateQueue, l !== null && wi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && $(Vl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), $s($t), Mt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function vx(e, t) {
    switch (Rc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return $s($t), ze(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return it(t), null;
      case 13:
        if (Fs(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Wa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return $(Wt), null;
      case 4:
        return ze(), null;
      case 10:
        return $s(t.type), null;
      case 22:
      case 23:
        return Fs(t), Jc(), e !== null && $(Vl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return $s($t), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Kd(e, t) {
    switch (Rc(t), t.tag) {
      case 3:
        $s($t), ze();
        break;
      case 26:
      case 27:
      case 5:
        it(t);
        break;
      case 4:
        ze();
        break;
      case 13:
        Fs(t);
        break;
      case 19:
        $(Wt);
        break;
      case 10:
        $s(t.type);
        break;
      case 22:
      case 23:
        Fs(t), Jc(), e !== null && $(Vl);
        break;
      case 24:
        $s($t);
    }
  }
  function mn(e, t) {
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
      Ot(t, t.return, d);
    }
  }
  function vl(e, t, l) {
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
                Ot(
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
      Ot(t, t.return, J);
    }
  }
  function $d(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Mo(t, l);
      } catch (a) {
        Ot(e, e.return, a);
      }
    }
  }
  function Wd(e, t, l) {
    l.props = Kl(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Ot(e, t, a);
    }
  }
  function xn(e, t) {
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
      Ot(e, t, n);
    }
  }
  function Ls(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Ot(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Ot(e, t, n);
        }
      else l.current = null;
  }
  function Fd(e) {
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
      Ot(e, e.return, n);
    }
  }
  function yr(e, t, l) {
    try {
      var a = e.stateNode;
      Hx(a, e.type, l, t), a[_t] = t;
    } catch (n) {
      Ot(e, e.return, n);
    }
  }
  function Id(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && wl(e.type) || e.tag === 4;
  }
  function _r(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Id(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && wl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Nr(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = qi));
    else if (a !== 4 && (a === 27 && wl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (Nr(e, t, l), e = e.sibling; e !== null; )
        Nr(e, t, l), e = e.sibling;
  }
  function ki(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && wl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (ki(e, t, l), e = e.sibling; e !== null; )
        ki(e, t, l), e = e.sibling;
  }
  function Pd(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ls(t, a, l), t[ht] = e, t[_t] = l;
    } catch (i) {
      Ot(e, e.return, i);
    }
  }
  var el = !1, Qt = !1, Sr = !1, eh = typeof WeakSet == "function" ? WeakSet : Set, It = null;
  function px(e, t) {
    if (e = e.containerInfo, Kr = Qi, e = oo(e), _c(e)) {
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
            var c = 0, d = -1, p = -1, z = 0, J = 0, te = e, D = null;
            t: for (; ; ) {
              for (var H; te !== l || n !== 0 && te.nodeType !== 3 || (d = c + n), te !== i || a !== 0 && te.nodeType !== 3 || (p = c + a), te.nodeType === 3 && (c += te.nodeValue.length), (H = te.firstChild) !== null; )
                D = te, te = H;
              for (; ; ) {
                if (te === e) break t;
                if (D === l && ++z === n && (d = c), D === i && ++J === a && (p = c), (H = te.nextSibling) !== null) break;
                te = D, D = te.parentNode;
              }
              te = H;
            }
            l = d === -1 || p === -1 ? null : { start: d, end: p };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for ($r = { focusedElem: e, selectionRange: l }, Qi = !1, It = t; It !== null; )
      if (t = It, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, It = e;
      else
        for (; It !== null; ) {
          switch (t = It, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var st = Kl(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    st,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Fe) {
                  Ot(
                    l,
                    l.return,
                    Fe
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Ir(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Ir(e);
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
            e.return = t.return, It = e;
            break;
          }
          It = t.return;
        }
  }
  function th(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        pl(e, l), a & 4 && mn(5, l);
        break;
      case 1:
        if (pl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              Ot(l, l.return, c);
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
              Ot(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && $d(l), a & 512 && xn(l, l.return);
        break;
      case 3:
        if (pl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            Mo(e, t);
          } catch (c) {
            Ot(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Pd(l);
      case 26:
      case 5:
        pl(e, l), t === null && a & 4 && Fd(l), a & 512 && xn(l, l.return);
        break;
      case 12:
        pl(e, l);
        break;
      case 13:
        pl(e, l), a & 4 && ah(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Cx.bind(
          null,
          l
        ), Zx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || el, !a) {
          t = t !== null && t.memoizedState !== null || Qt, n = el;
          var i = Qt;
          el = a, (Qt = t) && !i ? gl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : pl(e, l), el = n, Qt = i;
        }
        break;
      case 30:
        break;
      default:
        pl(e, l);
    }
  }
  function sh(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, sh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ce(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Dt = null, hs = !1;
  function tl(e, t, l) {
    for (l = l.child; l !== null; )
      lh(e, t, l), l = l.sibling;
  }
  function lh(e, t, l) {
    if (_e && typeof _e.onCommitFiberUnmount == "function")
      try {
        _e.onCommitFiberUnmount(ee, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Qt || Ls(l, t), tl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Qt || Ls(l, t);
        var a = Dt, n = hs;
        wl(l.type) && (Dt = l.stateNode, hs = !1), tl(
          e,
          t,
          l
        ), Sn(l.stateNode), Dt = a, hs = n;
        break;
      case 5:
        Qt || Ls(l, t);
      case 6:
        if (a = Dt, n = hs, Dt = null, tl(
          e,
          t,
          l
        ), Dt = a, hs = n, Dt !== null)
          if (hs)
            try {
              (Dt.nodeType === 9 ? Dt.body : Dt.nodeName === "HTML" ? Dt.ownerDocument.body : Dt).removeChild(l.stateNode);
            } catch (i) {
              Ot(
                l,
                t,
                i
              );
            }
          else
            try {
              Dt.removeChild(l.stateNode);
            } catch (i) {
              Ot(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Dt !== null && (hs ? (e = Dt, Zh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), An(e)) : Zh(Dt, l.stateNode));
        break;
      case 4:
        a = Dt, n = hs, Dt = l.stateNode.containerInfo, hs = !0, tl(
          e,
          t,
          l
        ), Dt = a, hs = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Qt || vl(2, l, t), Qt || vl(4, l, t), tl(
          e,
          t,
          l
        );
        break;
      case 1:
        Qt || (Ls(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Wd(
          l,
          t,
          a
        )), tl(
          e,
          t,
          l
        );
        break;
      case 21:
        tl(
          e,
          t,
          l
        );
        break;
      case 22:
        Qt = (a = Qt) || l.memoizedState !== null, tl(
          e,
          t,
          l
        ), Qt = a;
        break;
      default:
        tl(
          e,
          t,
          l
        );
    }
  }
  function ah(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        An(e);
      } catch (l) {
        Ot(t, t.return, l);
      }
  }
  function gx(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new eh()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new eh()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function wr(e, t) {
    var l = gx(e);
    t.forEach(function(a) {
      var n = Ex.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function js(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (wl(d.type)) {
                Dt = d.stateNode, hs = !1;
                break e;
              }
              break;
            case 5:
              Dt = d.stateNode, hs = !1;
              break e;
            case 3:
            case 4:
              Dt = d.stateNode.containerInfo, hs = !0;
              break e;
          }
          d = d.return;
        }
        if (Dt === null) throw Error(o(160));
        lh(i, c, n), Dt = null, hs = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        nh(t, e), t = t.sibling;
  }
  var As = null;
  function nh(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        js(t, e), vs(e), a & 4 && (vl(3, e, e.return), mn(3, e), vl(5, e, e.return));
        break;
      case 1:
        js(t, e), vs(e), a & 512 && (Qt || l === null || Ls(l, l.return)), a & 64 && el && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = As;
        if (js(t, e), vs(e), a & 512 && (Qt || l === null || Ls(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[Oe] || i[ht] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), ls(i, a, l), i[ht] = e, R(i), a = i;
                      break e;
                    case "link":
                      var c = Ph(
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
                      i = n.createElement(a), ls(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Ph(
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
                      i = n.createElement(a), ls(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  i[ht] = e, R(i), a = i;
                }
                e.stateNode = a;
              } else
                ef(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Ih(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? ef(
              n,
              e.type,
              e.stateNode
            ) : Ih(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && yr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        js(t, e), vs(e), a & 512 && (Qt || l === null || Ls(l, l.return)), l !== null && a & 4 && yr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (js(t, e), vs(e), a & 512 && (Qt || l === null || Ls(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            ta(n, "");
          } catch (H) {
            Ot(e, e.return, H);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, yr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (Sr = !0);
        break;
      case 6:
        if (js(t, e), vs(e), a & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (H) {
            Ot(e, e.return, H);
          }
        }
        break;
      case 3:
        if (Yi = null, n = As, As = Bi(t.containerInfo), js(t, e), As = n, vs(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            An(t.containerInfo);
          } catch (H) {
            Ot(e, e.return, H);
          }
        Sr && (Sr = !1, ih(e));
        break;
      case 4:
        a = As, As = Bi(
          e.stateNode.containerInfo
        ), js(t, e), vs(e), As = a;
        break;
      case 12:
        js(t, e), vs(e);
        break;
      case 13:
        js(t, e), vs(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (zr = He()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, wr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = l !== null && l.memoizedState !== null, z = el, J = Qt;
        if (el = z || n, Qt = J || p, js(t, e), Qt = J, el = z, vs(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || p || el || Qt || $l(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                p = l = t;
                try {
                  if (i = p.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    d = p.stateNode;
                    var te = p.memoizedProps.style, D = te != null && te.hasOwnProperty("display") ? te.display : null;
                    d.style.display = D == null || typeof D == "boolean" ? "" : ("" + D).trim();
                  }
                } catch (H) {
                  Ot(p, p.return, H);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                p = t;
                try {
                  p.stateNode.nodeValue = n ? "" : p.memoizedProps;
                } catch (H) {
                  Ot(p, p.return, H);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, wr(e, l))));
        break;
      case 19:
        js(t, e), vs(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, wr(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        js(t, e), vs(e);
    }
  }
  function vs(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Id(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = _r(e);
            ki(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (ta(c, ""), l.flags &= -33);
            var d = _r(e);
            ki(e, d, c);
            break;
          case 3:
          case 4:
            var p = l.stateNode.containerInfo, z = _r(e);
            Nr(
              e,
              z,
              p
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (J) {
        Ot(e, e.return, J);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function ih(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        ih(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function pl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        th(e, t.alternate, t), t = t.sibling;
  }
  function $l(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          vl(4, t, t.return), $l(t);
          break;
        case 1:
          Ls(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && Wd(
            t,
            t.return,
            l
          ), $l(t);
          break;
        case 27:
          Sn(t.stateNode);
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
  function gl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          gl(
            n,
            i,
            l
          ), mn(4, i);
          break;
        case 1:
          if (gl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              Ot(a, a.return, z);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var d = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Uo(p[n], d);
            } catch (z) {
              Ot(a, a.return, z);
            }
          }
          l && c & 64 && $d(i), xn(i, i.return);
          break;
        case 27:
          Pd(i);
        case 26:
        case 5:
          gl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Fd(i), xn(i, i.return);
          break;
        case 12:
          gl(
            n,
            i,
            l
          );
          break;
        case 13:
          gl(
            n,
            i,
            l
          ), l && c & 4 && ah(n, i);
          break;
        case 22:
          i.memoizedState === null && gl(
            n,
            i,
            l
          ), xn(i, i.return);
          break;
        case 30:
          break;
        default:
          gl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function kr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Pa(l));
  }
  function Cr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pa(e));
  }
  function Ys(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ch(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function ch(e, t, l, a) {
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
        ), n & 2048 && mn(9, t);
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
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pa(e)));
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
            Ot(t, t.return, p);
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
        ) : jn(e, t) : i._visibility & 2 ? Ys(
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
        )), n & 2048 && kr(c, t);
        break;
      case 24:
        Ys(
          e,
          t,
          l,
          a
        ), n & 2048 && Cr(t.alternate, t);
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
          ), mn(8, c);
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
          ) : jn(
            i,
            c
          ) : (J._visibility |= 2, ba(
            i,
            c,
            d,
            p,
            n
          )), n && z & 2048 && kr(
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
          ), n && z & 2048 && Cr(c.alternate, c);
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
  function jn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            jn(l, a), n & 2048 && kr(
              a.alternate,
              a
            );
            break;
          case 24:
            jn(l, a), n & 2048 && Cr(a.alternate, a);
            break;
          default:
            jn(l, a);
        }
        t = t.sibling;
      }
  }
  var vn = 8192;
  function ya(e) {
    if (e.subtreeFlags & vn)
      for (e = e.child; e !== null; )
        rh(e), e = e.sibling;
  }
  function rh(e) {
    switch (e.tag) {
      case 26:
        ya(e), e.flags & vn && e.memoizedState !== null && aj(
          As,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ya(e);
        break;
      case 3:
      case 4:
        var t = As;
        As = Bi(e.stateNode.containerInfo), ya(e), As = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = vn, vn = 16777216, ya(e), vn = t) : ya(e));
        break;
      default:
        ya(e);
    }
  }
  function uh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function pn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          It = a, dh(
            a,
            e
          );
        }
      uh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        oh(e), e = e.sibling;
  }
  function oh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        pn(e), e.flags & 2048 && vl(9, e, e.return);
        break;
      case 3:
        pn(e);
        break;
      case 12:
        pn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ci(e)) : pn(e);
        break;
      default:
        pn(e);
    }
  }
  function Ci(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          It = a, dh(
            a,
            e
          );
        }
      uh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          vl(8, t, t.return), Ci(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Ci(t));
          break;
        default:
          Ci(t);
      }
      e = e.sibling;
    }
  }
  function dh(e, t) {
    for (; It !== null; ) {
      var l = It;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          vl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Pa(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, It = a;
      else
        e: for (l = e; It !== null; ) {
          a = It;
          var n = a.sibling, i = a.return;
          if (sh(a), a === l) {
            It = null;
            break e;
          }
          if (n !== null) {
            n.return = i, It = n;
            break e;
          }
          It = i;
        }
    }
  }
  var bx = {
    getCacheForType: function(e) {
      var t = as($t), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, yx = typeof WeakMap == "function" ? WeakMap : Map, St = 0, zt = null, xt = null, vt = 0, wt = 0, ps = null, bl = !1, _a = !1, Er = !1, sl = 0, Bt = 0, yl = 0, Wl = 0, Or = 0, Es = 0, Na = 0, gn = null, fs = null, Tr = !1, zr = 0, Ei = 1 / 0, Oi = null, _l = null, ss = 0, Nl = null, Sa = null, wa = 0, Ar = 0, Rr = null, hh = null, bn = 0, Dr = null;
  function gs() {
    if ((St & 2) !== 0 && vt !== 0)
      return vt & -vt;
    if (b.T !== null) {
      var e = ha;
      return e !== 0 ? e : Yr();
    }
    return Tt();
  }
  function fh() {
    Es === 0 && (Es = (vt & 536870912) === 0 || yt ? gt() : 536870912);
    var e = Cs.current;
    return e !== null && (e.flags |= 32), Es;
  }
  function bs(e, t, l) {
    (e === zt && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null) && (ka(e, 0), Sl(
      e,
      vt,
      Es,
      !1
    )), re(e, l), ((St & 2) === 0 || e !== zt) && (e === zt && ((St & 2) === 0 && (Wl |= l), Bt === 4 && Sl(
      e,
      vt,
      Es,
      !1
    )), Gs(e));
  }
  function mh(e, t, l) {
    if ((St & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || pe(e, t), n = a ? Sx(e, t) : qr(e, t, !0), i = a;
    do {
      if (n === 0) {
        _a && !a && Sl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !_x(l)) {
          n = qr(e, t, !1), i = !1;
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
              n = gn;
              var p = d.current.memoizedState.isDehydrated;
              if (p && (ka(d, c).flags |= 256), c = qr(
                d,
                c,
                !1
              ), c !== 2) {
                if (Er && !p) {
                  d.errorRecoveryDisabledLanes |= i, Wl |= i, n = 4;
                  break e;
                }
                i = fs, fs = n, i !== null && (fs === null ? fs = i : fs.push.apply(
                  fs,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ka(e, 0), Sl(e, t, 0, !0);
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
              Sl(
                a,
                t,
                Es,
                !bl
              );
              break e;
            case 2:
              fs = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = zr + 300 - He(), 10 < n)) {
            if (Sl(
              a,
              t,
              Es,
              !bl
            ), he(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Xh(
              xh.bind(
                null,
                a,
                l,
                fs,
                Oi,
                Tr,
                t,
                Es,
                Wl,
                Na,
                bl,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          xh(
            a,
            l,
            fs,
            Oi,
            Tr,
            t,
            Es,
            Wl,
            Na,
            bl,
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
  function xh(e, t, l, a, n, i, c, d, p, z, J, te, D, H) {
    if (e.timeoutHandle = -1, te = t.subtreeFlags, (te & 8192 || (te & 16785408) === 16785408) && (Cn = { stylesheets: null, count: 0, unsuspend: lj }, rh(t), te = nj(), te !== null)) {
      e.cancelPendingCommit = te(
        _h.bind(
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
          D,
          H
        )
      ), Sl(e, i, c, !z);
      return;
    }
    _h(
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
            if (!ms(i(), n)) return !1;
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
  function Sl(e, t, l, a) {
    t &= ~Or, t &= ~Wl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - Qe(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && ct(e, l, t);
  }
  function Ti() {
    return (St & 6) === 0 ? (yn(0), !1) : !0;
  }
  function Ur() {
    if (xt !== null) {
      if (wt === 0)
        var e = xt.return;
      else
        e = xt, Ks = Ql = null, Ic(e), pa = null, dn = 0, e = xt;
      for (; e !== null; )
        Kd(e.alternate, e), e = e.return;
      xt = null;
    }
  }
  function ka(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Lx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Ur(), zt = e, xt = l = Zs(e.current, null), vt = t, wt = 0, ps = null, bl = !1, _a = pe(e, t), Er = !1, Na = Es = Or = Wl = yl = Bt = 0, fs = gn = null, Tr = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - Qe(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return sl = t, In(), l;
  }
  function jh(e, t) {
    ft = null, b.H = vi, t === tn || t === ci ? (t = Ro(), wt = 3) : t === To ? (t = Ro(), wt = 4) : wt = t === Dd ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ps = t, xt === null && (Bt = 1, _i(
      e,
      Ns(t, e.current)
    ));
  }
  function vh() {
    var e = b.H;
    return b.H = vi, e === null ? vi : e;
  }
  function ph() {
    var e = b.A;
    return b.A = bx, e;
  }
  function Mr() {
    Bt = 4, bl || (vt & 4194048) !== vt && Cs.current !== null || (_a = !0), (yl & 134217727) === 0 && (Wl & 134217727) === 0 || zt === null || Sl(
      zt,
      vt,
      Es,
      !1
    );
  }
  function qr(e, t, l) {
    var a = St;
    St |= 2;
    var n = vh(), i = ph();
    (zt !== e || vt !== t) && (Oi = null, ka(e, t)), t = !1;
    var c = Bt;
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          var d = xt, p = ps;
          switch (wt) {
            case 8:
              Ur(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Cs.current === null && (t = !0);
              var z = wt;
              if (wt = 0, ps = null, Ca(e, d, p, z), l && _a) {
                c = 0;
                break e;
              }
              break;
            default:
              z = wt, wt = 0, ps = null, Ca(e, d, p, z);
          }
        }
        Nx(), c = Bt;
        break;
      } catch (J) {
        jh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ks = Ql = null, St = a, b.H = n, b.A = i, xt === null && (zt = null, vt = 0, In()), c;
  }
  function Nx() {
    for (; xt !== null; ) gh(xt);
  }
  function Sx(e, t) {
    var l = St;
    St |= 2;
    var a = vh(), n = ph();
    zt !== e || vt !== t ? (Oi = null, Ei = He() + 500, ka(e, t)) : _a = pe(
      e,
      t
    );
    e: do
      try {
        if (wt !== 0 && xt !== null) {
          t = xt;
          var i = ps;
          t: switch (wt) {
            case 1:
              wt = 0, ps = null, Ca(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (zo(i)) {
                wt = 0, ps = null, bh(t);
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
              zo(i) ? (wt = 0, ps = null, bh(t)) : (wt = 0, ps = null, Ca(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (xt.tag) {
                case 26:
                  c = xt.memoizedState;
                case 5:
                case 27:
                  var d = xt;
                  if (!c || tf(c)) {
                    wt = 0, ps = null;
                    var p = d.sibling;
                    if (p !== null) xt = p;
                    else {
                      var z = d.return;
                      z !== null ? (xt = z, zi(z)) : xt = null;
                    }
                    break t;
                  }
              }
              wt = 0, ps = null, Ca(e, t, i, 5);
              break;
            case 6:
              wt = 0, ps = null, Ca(e, t, i, 6);
              break;
            case 8:
              Ur(), Bt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        wx();
        break;
      } catch (J) {
        jh(e, J);
      }
    while (!0);
    return Ks = Ql = null, b.H = a, b.A = n, St = l, xt !== null ? 0 : (zt = null, vt = 0, In(), Bt);
  }
  function wx() {
    for (; xt !== null && !Ue(); )
      gh(xt);
  }
  function gh(e) {
    var t = Vd(e.alternate, e, sl);
    e.memoizedProps = e.pendingProps, t === null ? zi(e) : xt = t;
  }
  function bh(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ld(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          vt
        );
        break;
      case 11:
        t = Ld(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          vt
        );
        break;
      case 5:
        Ic(t);
      default:
        Kd(l, t), t = xt = yo(t, sl), t = Vd(l, t, sl);
    }
    e.memoizedProps = e.pendingProps, t === null ? zi(e) : xt = t;
  }
  function Ca(e, t, l, a) {
    Ks = Ql = null, Ic(t), pa = null, dn = 0;
    var n = t.return;
    try {
      if (mx(
        e,
        n,
        t,
        l,
        vt
      )) {
        Bt = 1, _i(
          e,
          Ns(l, e.current)
        ), xt = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw xt = n, i;
      Bt = 1, _i(
        e,
        Ns(l, e.current)
      ), xt = null;
      return;
    }
    t.flags & 32768 ? (yt || a === 1 ? e = !0 : _a || (vt & 536870912) !== 0 ? e = !1 : (bl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Cs.current, a !== null && a.tag === 13 && (a.flags |= 16384))), yh(t, e)) : zi(t);
  }
  function zi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        yh(
          t,
          bl
        );
        return;
      }
      e = t.return;
      var l = jx(
        t.alternate,
        t,
        sl
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
  function yh(e, t) {
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
  function _h(e, t, l, a, n, i, c, d, p) {
    e.cancelPendingCommit = null;
    do
      Ai();
    while (ss !== 0);
    if ((St & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= Cc, be(
        e,
        l,
        i,
        c,
        d,
        p
      ), e === zt && (xt = zt = null, vt = 0), Sa = t, Nl = e, wa = l, Ar = i, Rr = n, hh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Ox(xe, function() {
        return Ch(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = b.T, b.T = null, n = Q.p, Q.p = 2, c = St, St |= 4;
        try {
          px(e, t, l);
        } finally {
          St = c, Q.p = n, b.T = a;
        }
      }
      ss = 1, Nh(), Sh(), wh();
    }
  }
  function Nh() {
    if (ss === 1) {
      ss = 0;
      var e = Nl, t = Sa, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = b.T, b.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          nh(t, e);
          var i = $r, c = oo(e.containerInfo), d = i.focusedElem, p = i.selectionRange;
          if (c !== d && d && d.ownerDocument && uo(
            d.ownerDocument.documentElement,
            d
          )) {
            if (p !== null && _c(d)) {
              var z = p.start, J = p.end;
              if (J === void 0 && (J = z), "selectionStart" in d)
                d.selectionStart = z, d.selectionEnd = Math.min(
                  J,
                  d.value.length
                );
              else {
                var te = d.ownerDocument || document, D = te && te.defaultView || window;
                if (D.getSelection) {
                  var H = D.getSelection(), st = d.textContent.length, Fe = Math.min(p.start, st), Et = p.end === void 0 ? Fe : Math.min(p.end, st);
                  !H.extend && Fe > Et && (c = Et, Et = Fe, Fe = c);
                  var C = ro(
                    d,
                    Fe
                  ), S = ro(
                    d,
                    Et
                  );
                  if (C && S && (H.rangeCount !== 1 || H.anchorNode !== C.node || H.anchorOffset !== C.offset || H.focusNode !== S.node || H.focusOffset !== S.offset)) {
                    var O = te.createRange();
                    O.setStart(C.node, C.offset), H.removeAllRanges(), Fe > Et ? (H.addRange(O), H.extend(S.node, S.offset)) : (O.setEnd(S.node, S.offset), H.addRange(O));
                  }
                }
              }
            }
            for (te = [], H = d; H = H.parentNode; )
              H.nodeType === 1 && te.push({
                element: H,
                left: H.scrollLeft,
                top: H.scrollTop
              });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < te.length; d++) {
              var W = te[d];
              W.element.scrollLeft = W.left, W.element.scrollTop = W.top;
            }
          }
          Qi = !!Kr, $r = Kr = null;
        } finally {
          St = n, Q.p = a, b.T = l;
        }
      }
      e.current = t, ss = 2;
    }
  }
  function Sh() {
    if (ss === 2) {
      ss = 0;
      var e = Nl, t = Sa, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = b.T, b.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          th(e, t.alternate, t);
        } finally {
          St = n, Q.p = a, b.T = l;
        }
      }
      ss = 3;
    }
  }
  function wh() {
    if (ss === 4 || ss === 3) {
      ss = 0, ye();
      var e = Nl, t = Sa, l = wa, a = hh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ss = 5 : (ss = 0, Sa = Nl = null, kh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (_l = null), Ke(l), t = t.stateNode, _e && typeof _e.onCommitFiberRoot == "function")
        try {
          _e.onCommitFiberRoot(
            ee,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = b.T, n = Q.p, Q.p = 2, b.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < a.length; c++) {
            var d = a[c];
            i(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          b.T = t, Q.p = n;
        }
      }
      (wa & 3) !== 0 && Ai(), Gs(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === Dr ? bn++ : (bn = 0, Dr = e) : bn = 0, yn(0);
    }
  }
  function kh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Pa(t)));
  }
  function Ai(e) {
    return Nh(), Sh(), wh(), Ch();
  }
  function Ch() {
    if (ss !== 5) return !1;
    var e = Nl, t = Ar;
    Ar = 0;
    var l = Ke(wa), a = b.T, n = Q.p;
    try {
      Q.p = 32 > l ? 32 : l, b.T = null, l = Rr, Rr = null;
      var i = Nl, c = wa;
      if (ss = 0, Sa = Nl = null, wa = 0, (St & 6) !== 0) throw Error(o(331));
      var d = St;
      if (St |= 4, oh(i.current), ch(
        i,
        i.current,
        c,
        l
      ), St = d, yn(0, !1), _e && typeof _e.onPostCommitFiberRoot == "function")
        try {
          _e.onPostCommitFiberRoot(ee, i);
        } catch {
        }
      return !0;
    } finally {
      Q.p = n, b.T = a, kh(e, t);
    }
  }
  function Eh(e, t, l) {
    t = Ns(l, t), t = hr(e.stateNode, t, 2), e = fl(e, t, 2), e !== null && (re(e, 2), Gs(e));
  }
  function Ot(e, t, l) {
    if (e.tag === 3)
      Eh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Eh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (_l === null || !_l.has(a))) {
            e = Ns(l, e), l = Ad(2), a = fl(t, l, 2), a !== null && (Rd(
              l,
              a,
              t,
              e
            ), re(a, 2), Gs(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Hr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new yx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Er = !0, n.add(l), e = kx.bind(null, e, t, l), t.then(e, e));
  }
  function kx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, zt === e && (vt & l) === l && (Bt === 4 || Bt === 3 && (vt & 62914560) === vt && 300 > He() - zr ? (St & 2) === 0 && ka(e, 0) : Or |= l, Na === vt && (Na = 0)), Gs(e);
  }
  function Oh(e, t) {
    t === 0 && (t = M()), e = ra(e, t), e !== null && (re(e, t), Gs(e));
  }
  function Cx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Oh(e, l);
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
    a !== null && a.delete(t), Oh(e, l);
  }
  function Ox(e, t) {
    return $e(e, t);
  }
  var Ri = null, Ea = null, Br = !1, Di = !1, Lr = !1, Fl = 0;
  function Gs(e) {
    e !== Ea && e.next === null && (Ea === null ? Ri = Ea = e : Ea = Ea.next = e), Di = !0, Br || (Br = !0, zx());
  }
  function yn(e, t) {
    if (!Lr && Di) {
      Lr = !0;
      do
        for (var l = !1, a = Ri; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              i = (1 << 31 - Qe(42 | e) + 1) - 1, i &= n & ~(c & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Rh(a, i));
          } else
            i = vt, i = he(
              a,
              a === zt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || pe(a, i) || (l = !0, Rh(a, i));
          a = a.next;
        }
      while (l);
      Lr = !1;
    }
  }
  function Tx() {
    Th();
  }
  function Th() {
    Di = Br = !1;
    var e = 0;
    Fl !== 0 && (Bx() && (e = Fl), Fl = 0);
    for (var t = He(), l = null, a = Ri; a !== null; ) {
      var n = a.next, i = zh(a, t);
      i === 0 ? (a.next = null, l === null ? Ri = n : l.next = n, n === null && (Ea = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (Di = !0)), a = n;
    }
    yn(e);
  }
  function zh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - Qe(i), d = 1 << c, p = n[c];
      p === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Be(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = zt, l = vt, l = he(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Re(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || pe(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Re(a), Ke(l)) {
        case 2:
        case 8:
          l = Ze;
          break;
        case 32:
          l = xe;
          break;
        case 268435456:
          l = De;
          break;
        default:
          l = xe;
      }
      return a = Ah.bind(null, e), l = $e(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Re(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Ah(e, t) {
    if (ss !== 0 && ss !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ai() && e.callbackNode !== l)
      return null;
    var a = vt;
    return a = he(
      e,
      e === zt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (mh(e, a, t), zh(e, He()), e.callbackNode != null && e.callbackNode === l ? Ah.bind(null, e) : null);
  }
  function Rh(e, t) {
    if (Ai()) return null;
    mh(e, t, !0);
  }
  function zx() {
    Yx(function() {
      (St & 6) !== 0 ? $e(
        nt,
        Tx
      ) : Th();
    });
  }
  function Yr() {
    return Fl === 0 && (Fl = gt()), Fl;
  }
  function Dh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Zn("" + e);
  }
  function Uh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Ax(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Dh(
        (n[_t] || null).action
      ), c = a.submitter;
      c && (t = (t = c[_t] || null) ? Dh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var d = new $n(
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
                  var p = c ? Uh(n, c) : new FormData(n);
                  cr(
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
                typeof i == "function" && (d.preventDefault(), p = c ? Uh(n, c) : new FormData(n), cr(
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
  for (var Gr = 0; Gr < kc.length; Gr++) {
    var Xr = kc[Gr], Rx = Xr.toLowerCase(), Dx = Xr[0].toUpperCase() + Xr.slice(1);
    zs(
      Rx,
      "on" + Dx
    );
  }
  zs(mo, "onAnimationEnd"), zs(xo, "onAnimationIteration"), zs(jo, "onAnimationStart"), zs("dblclick", "onDoubleClick"), zs("focusin", "onFocus"), zs("focusout", "onBlur"), zs(Fm, "onTransitionRun"), zs(Im, "onTransitionStart"), zs(Pm, "onTransitionCancel"), zs(vo, "onTransitionEnd"), Ut("onMouseEnter", ["mouseout", "mouseover"]), Ut("onMouseLeave", ["mouseout", "mouseover"]), Ut("onPointerEnter", ["pointerout", "pointerover"]), Ut("onPointerLeave", ["pointerout", "pointerover"]), tt(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), tt(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), tt("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), tt(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), tt(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), tt(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var _n = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Ux = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_n)
  );
  function Mh(e, t) {
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
              yi(J);
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
              yi(J);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function jt(e, t) {
    var l = t[we];
    l === void 0 && (l = t[we] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (qh(t, e, 2, !1), l.add(a));
  }
  function Qr(e, t, l) {
    var a = 0;
    t && (a |= 4), qh(
      l,
      e,
      a,
      t
    );
  }
  var Ui = "_reactListening" + Math.random().toString(36).slice(2);
  function Zr(e) {
    if (!e[Ui]) {
      e[Ui] = !0, Ge.forEach(function(l) {
        l !== "selectionchange" && (Ux.has(l) || Qr(l, !1, e), Qr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ui] || (t[Ui] = !0, Qr("selectionchange", !1, t));
    }
  }
  function qh(e, t, l, a) {
    switch (rf(t)) {
      case 2:
        var n = rj;
        break;
      case 8:
        n = uj;
        break;
      default:
        n = nu;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !fc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Vr(e, t, l, a, n) {
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
            if (c = et(d), c === null) return;
            if (p = c.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              a = i = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        a = a.return;
      }
    Xu(function() {
      var z = i, J = dc(l), te = [];
      e: {
        var D = po.get(e);
        if (D !== void 0) {
          var H = $n, st = e;
          switch (e) {
            case "keypress":
              if (Jn(l) === 0) break e;
            case "keydown":
            case "keyup":
              H = Om;
              break;
            case "focusin":
              st = "focus", H = vc;
              break;
            case "focusout":
              st = "blur", H = vc;
              break;
            case "beforeblur":
            case "afterblur":
              H = vc;
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
              H = Vu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              H = vm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              H = Am;
              break;
            case mo:
            case xo:
            case jo:
              H = bm;
              break;
            case vo:
              H = Dm;
              break;
            case "scroll":
            case "scrollend":
              H = xm;
              break;
            case "wheel":
              H = Mm;
              break;
            case "copy":
            case "cut":
            case "paste":
              H = _m;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              H = Ku;
              break;
            case "toggle":
            case "beforetoggle":
              H = Hm;
          }
          var Fe = (t & 4) !== 0, Et = !Fe && (e === "scroll" || e === "scrollend"), C = Fe ? D !== null ? D + "Capture" : null : D;
          Fe = [];
          for (var S = z, O; S !== null; ) {
            var W = S;
            if (O = W.stateNode, W = W.tag, W !== 5 && W !== 26 && W !== 27 || O === null || C === null || (W = La(S, C), W != null && Fe.push(
              Nn(S, W, O)
            )), Et) break;
            S = S.return;
          }
          0 < Fe.length && (D = new H(
            D,
            st,
            null,
            l,
            J
          ), te.push({ event: D, listeners: Fe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (D = e === "mouseover" || e === "pointerover", H = e === "mouseout" || e === "pointerout", D && l !== oc && (st = l.relatedTarget || l.fromElement) && (et(st) || st[g]))
            break e;
          if ((H || D) && (D = J.window === J ? J : (D = J.ownerDocument) ? D.defaultView || D.parentWindow : window, H ? (st = l.relatedTarget || l.toElement, H = z, st = st ? et(st) : null, st !== null && (Et = q(st), Fe = st.tag, st !== Et || Fe !== 5 && Fe !== 27 && Fe !== 6) && (st = null)) : (H = null, st = z), H !== st)) {
            if (Fe = Vu, W = "onMouseLeave", C = "onMouseEnter", S = "mouse", (e === "pointerout" || e === "pointerover") && (Fe = Ku, W = "onPointerLeave", C = "onPointerEnter", S = "pointer"), Et = H == null ? D : us(H), O = st == null ? D : us(st), D = new Fe(
              W,
              S + "leave",
              H,
              l,
              J
            ), D.target = Et, D.relatedTarget = O, W = null, et(J) === z && (Fe = new Fe(
              C,
              S + "enter",
              st,
              l,
              J
            ), Fe.target = O, Fe.relatedTarget = Et, W = Fe), Et = W, H && st)
              t: {
                for (Fe = H, C = st, S = 0, O = Fe; O; O = Oa(O))
                  S++;
                for (O = 0, W = C; W; W = Oa(W))
                  O++;
                for (; 0 < S - O; )
                  Fe = Oa(Fe), S--;
                for (; 0 < O - S; )
                  C = Oa(C), O--;
                for (; S--; ) {
                  if (Fe === C || C !== null && Fe === C.alternate)
                    break t;
                  Fe = Oa(Fe), C = Oa(C);
                }
                Fe = null;
              }
            else Fe = null;
            H !== null && Hh(
              te,
              D,
              H,
              Fe,
              !1
            ), st !== null && Et !== null && Hh(
              te,
              Et,
              st,
              Fe,
              !0
            );
          }
        }
        e: {
          if (D = z ? us(z) : window, H = D.nodeName && D.nodeName.toLowerCase(), H === "select" || H === "input" && D.type === "file")
            var Me = so;
          else if (eo(D))
            if (lo)
              Me = Km;
            else {
              Me = Vm;
              var mt = Zm;
            }
          else
            H = D.nodeName, !H || H.toLowerCase() !== "input" || D.type !== "checkbox" && D.type !== "radio" ? z && uc(z.elementType) && (Me = so) : Me = Jm;
          if (Me && (Me = Me(e, z))) {
            to(
              te,
              Me,
              l,
              J
            );
            break e;
          }
          mt && mt(e, D, z), e === "focusout" && z && D.type === "number" && z.memoizedProps.value != null && rc(D, "number", D.value);
        }
        switch (mt = z ? us(z) : window, e) {
          case "focusin":
            (eo(mt) || mt.contentEditable === "true") && (na = mt, Nc = z, Ka = null);
            break;
          case "focusout":
            Ka = Nc = na = null;
            break;
          case "mousedown":
            Sc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Sc = !1, ho(te, l, J);
            break;
          case "selectionchange":
            if (Wm) break;
          case "keydown":
          case "keyup":
            ho(te, l, J);
        }
        var Xe;
        if (gc)
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
          aa ? Iu(e, l) && (Ie = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Ie = "onCompositionStart");
        Ie && ($u && l.locale !== "ko" && (aa || Ie !== "onCompositionStart" ? Ie === "onCompositionEnd" && aa && (Xe = Qu()) : (ul = J, mc = "value" in ul ? ul.value : ul.textContent, aa = !0)), mt = Mi(z, Ie), 0 < mt.length && (Ie = new Ju(
          Ie,
          e,
          null,
          l,
          J
        ), te.push({ event: Ie, listeners: mt }), Xe ? Ie.data = Xe : (Xe = Pu(l), Xe !== null && (Ie.data = Xe)))), (Xe = Lm ? Ym(e, l) : Gm(e, l)) && (Ie = Mi(z, "onBeforeInput"), 0 < Ie.length && (mt = new Ju(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), te.push({
          event: mt,
          listeners: Ie
        }), mt.data = Xe)), Ax(
          te,
          e,
          z,
          l,
          J
        );
      }
      Mh(te, t);
    });
  }
  function Nn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Mi(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = La(e, l), n != null && a.unshift(
        Nn(e, n, i)
      ), n = La(e, t), n != null && a.push(
        Nn(e, n, i)
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
  function Hh(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var d = l, p = d.alternate, z = d.stateNode;
      if (d = d.tag, p !== null && p === a) break;
      d !== 5 && d !== 26 && d !== 27 || z === null || (p = z, n ? (z = La(l, i), z != null && c.unshift(
        Nn(l, z, p)
      )) : n || (z = La(l, i), z != null && c.push(
        Nn(l, z, p)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Mx = /\r\n?/g, qx = /\u0000|\uFFFD/g;
  function Bh(e) {
    return (typeof e == "string" ? e : "" + e).replace(Mx, `
`).replace(qx, "");
  }
  function Lh(e, t) {
    return t = Bh(t), Bh(e) === t;
  }
  function qi() {
  }
  function Ct(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || ta(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && ta(e, "" + a);
        break;
      case "className":
        Ms(e, "class", a);
        break;
      case "tabIndex":
        Ms(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ms(e, l, a);
        break;
      case "style":
        Yu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          Ms(e, "data", a);
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
        a = Zn("" + a), e.setAttribute(l, a);
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
        a = Zn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = qi);
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
        l = Zn("" + a), e.setAttributeNS(
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
        jt("beforetoggle", e), jt("toggle", e), Ts(e, "popover", a);
        break;
      case "xlinkActuate":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        es(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        es(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        es(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        es(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Ts(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = fm.get(l) || l, Ts(e, l, a));
    }
  }
  function Jr(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Yu(e, a, i);
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
        a != null && (e.onclick = qi);
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
        if (!At.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[_t] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Ts(e, l, a);
          }
    }
  }
  function ls(e, t, l) {
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
        qu(
          e,
          i,
          d,
          p,
          z,
          c,
          n,
          !1
        ), Xn(e);
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
                Ct(e, t, c, d, l, null);
            }
        Bu(e, a, n, i), Xn(e);
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
        for (a = 0; a < _n.length; a++)
          jt(_n[a], e);
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
        if (uc(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Jr(
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
        for (H in l) {
          var te = l[H];
          if (l.hasOwnProperty(H) && te != null)
            switch (H) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                p = te;
              default:
                a.hasOwnProperty(H) || Ct(e, t, H, null, a, te);
            }
        }
        for (var D in a) {
          var H = a[D];
          if (te = l[D], a.hasOwnProperty(D) && (H != null || te != null))
            switch (D) {
              case "type":
                i = H;
                break;
              case "name":
                n = H;
                break;
              case "checked":
                z = H;
                break;
              case "defaultChecked":
                J = H;
                break;
              case "value":
                c = H;
                break;
              case "defaultValue":
                d = H;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (H != null)
                  throw Error(o(137, t));
                break;
              default:
                H !== te && Ct(
                  e,
                  t,
                  D,
                  H,
                  a,
                  te
                );
            }
        }
        cc(
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
        H = c = d = D = null;
        for (i in l)
          if (p = l[i], l.hasOwnProperty(i) && p != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                H = p;
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
                D = i;
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
        t = d, l = c, a = H, D != null ? ea(e, !!l, D, !1) : !!a != !!l && (t != null ? ea(e, !!l, t, !0) : ea(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        H = D = null;
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
                D = n;
                break;
              case "defaultValue":
                H = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== i && Ct(e, t, c, n, a, i);
            }
        Hu(e, D, H);
        return;
      case "option":
        for (var st in l)
          if (D = l[st], l.hasOwnProperty(st) && D != null && !a.hasOwnProperty(st))
            switch (st) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ct(
                  e,
                  t,
                  st,
                  null,
                  a,
                  D
                );
            }
        for (p in a)
          if (D = a[p], H = l[p], a.hasOwnProperty(p) && D !== H && (D != null || H != null))
            switch (p) {
              case "selected":
                e.selected = D && typeof D != "function" && typeof D != "symbol";
                break;
              default:
                Ct(
                  e,
                  t,
                  p,
                  D,
                  a,
                  H
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
        for (var Fe in l)
          D = l[Fe], l.hasOwnProperty(Fe) && D != null && !a.hasOwnProperty(Fe) && Ct(e, t, Fe, null, a, D);
        for (z in a)
          if (D = a[z], H = l[z], a.hasOwnProperty(z) && D !== H && (D != null || H != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(o(137, t));
                break;
              default:
                Ct(
                  e,
                  t,
                  z,
                  D,
                  a,
                  H
                );
            }
        return;
      default:
        if (uc(t)) {
          for (var Et in l)
            D = l[Et], l.hasOwnProperty(Et) && D !== void 0 && !a.hasOwnProperty(Et) && Jr(
              e,
              t,
              Et,
              void 0,
              a,
              D
            );
          for (J in a)
            D = a[J], H = l[J], !a.hasOwnProperty(J) || D === H || D === void 0 && H === void 0 || Jr(
              e,
              t,
              J,
              D,
              a,
              H
            );
          return;
        }
    }
    for (var C in l)
      D = l[C], l.hasOwnProperty(C) && D != null && !a.hasOwnProperty(C) && Ct(e, t, C, null, a, D);
    for (te in a)
      D = a[te], H = l[te], !a.hasOwnProperty(te) || D === H || D == null && H == null || Ct(e, t, te, D, a, H);
  }
  var Kr = null, $r = null;
  function Hi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Yh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Gh(e, t) {
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
  function Wr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Fr = null;
  function Bx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Fr ? !1 : (Fr = e, !0) : (Fr = null, !1);
  }
  var Xh = typeof setTimeout == "function" ? setTimeout : void 0, Lx = typeof clearTimeout == "function" ? clearTimeout : void 0, Qh = typeof Promise == "function" ? Promise : void 0, Yx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Qh < "u" ? function(e) {
    return Qh.resolve(null).then(e).catch(Gx);
  } : Xh;
  function Gx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function wl(e) {
    return e === "head";
  }
  function Zh(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var c = e.ownerDocument;
            if (l & 1 && Sn(c.documentElement), l & 2 && Sn(c.body), l & 4)
              for (l = c.head, Sn(l), c = l.firstChild; c; ) {
                var d = c.nextSibling, p = c.nodeName;
                c[Oe] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = d;
              }
          }
          if (n === 0) {
            e.removeChild(i), An(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    An(t);
  }
  function Ir(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ir(l), Ce(l);
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
      if (e = Rs(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Qx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Rs(e.nextSibling), e === null)) return null;
    return e;
  }
  function Pr(e) {
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
  function Rs(e) {
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
  var eu = null;
  function Vh(e) {
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
  function Jh(e, t, l) {
    switch (t = Hi(l), e) {
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
  function Sn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ce(e);
  }
  var Os = /* @__PURE__ */ new Map(), Kh = /* @__PURE__ */ new Set();
  function Bi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var ll = Q.d;
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
    var e = ll.f(), t = Ti();
    return e || t;
  }
  function Jx(e) {
    var t = Gt(e);
    t !== null && t.tag === 5 && t.type === "form" ? md(t) : ll.r(e);
  }
  var Ta = typeof document > "u" ? null : document;
  function $h(e, t, l) {
    var a = Ta;
    if (a && typeof t == "string" && t) {
      var n = _s(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Kh.has(n) || (Kh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ls(t, "link", e), R(t), a.head.appendChild(t)));
    }
  }
  function Kx(e) {
    ll.D(e), $h("dns-prefetch", e, null);
  }
  function $x(e, t) {
    ll.C(e, t), $h("preconnect", e, t);
  }
  function Wx(e, t, l) {
    ll.L(e, t, l);
    var a = Ta;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + _s(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + _s(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + _s(
        l.imageSizes
      ) + '"]')) : n += '[href="' + _s(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = za(e);
          break;
        case "script":
          i = Aa(e);
      }
      Os.has(i) || (e = U(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Os.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(wn(i)) || t === "script" && a.querySelector(kn(i)) || (t = a.createElement("link"), ls(t, "link", e), R(t), a.head.appendChild(t)));
    }
  }
  function Fx(e, t) {
    ll.m(e, t);
    var l = Ta;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + _s(a) + '"][href="' + _s(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Aa(e);
      }
      if (!Os.has(i) && (e = U({ rel: "modulepreload", href: e }, t), Os.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(kn(i)))
              return;
        }
        a = l.createElement("link"), ls(a, "link", e), R(a), l.head.appendChild(a);
      }
    }
  }
  function Ix(e, t, l) {
    ll.S(e, t, l);
    var a = Ta;
    if (a && e) {
      var n = x(a).hoistableStyles, i = za(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          wn(i)
        ))
          d.loading = 5;
        else {
          e = U(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Os.get(i)) && tu(e, l);
          var p = c = a.createElement("link");
          R(p), ls(p, "link", e), p._p = new Promise(function(z, J) {
            p.onload = z, p.onerror = J;
          }), p.addEventListener("load", function() {
            d.loading |= 1;
          }), p.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Li(c, t, a);
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
    ll.X(e, t);
    var l = Ta;
    if (l && e) {
      var a = x(l).hoistableScripts, n = Aa(e), i = a.get(n);
      i || (i = l.querySelector(kn(n)), i || (e = U({ src: e, async: !0 }, t), (t = Os.get(n)) && su(e, t), i = l.createElement("script"), R(i), ls(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function ej(e, t) {
    ll.M(e, t);
    var l = Ta;
    if (l && e) {
      var a = x(l).hoistableScripts, n = Aa(e), i = a.get(n);
      i || (i = l.querySelector(kn(n)), i || (e = U({ src: e, async: !0, type: "module" }, t), (t = Os.get(n)) && su(e, t), i = l.createElement("script"), R(i), ls(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Wh(e, t, l, a) {
    var n = (n = F.current) ? Bi(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = za(l.href), l = x(
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
          var i = x(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            wn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), Os.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Os.set(e, l), i || tj(
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
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Aa(l), l = x(
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
    return 'href="' + _s(e) + '"';
  }
  function wn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Fh(e) {
    return U({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function tj(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), ls(t, "link", l), R(t), e.head.appendChild(t));
  }
  function Aa(e) {
    return '[src="' + _s(e) + '"]';
  }
  function kn(e) {
    return "script[async]" + e;
  }
  function Ih(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + _s(l.href) + '"]'
          );
          if (a)
            return t.instance = a, R(a), a;
          var n = U({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), R(a), ls(a, "style", n), Li(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = za(l.href);
          var i = e.querySelector(
            wn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, R(i), i;
          a = Fh(l), (n = Os.get(n)) && tu(a, n), i = (e.ownerDocument || e).createElement("link"), R(i);
          var c = i;
          return c._p = new Promise(function(d, p) {
            c.onload = d, c.onerror = p;
          }), ls(i, "link", a), t.state.loading |= 4, Li(i, l.precedence, e), t.instance = i;
        case "script":
          return i = Aa(l.src), (n = e.querySelector(
            kn(i)
          )) ? (t.instance = n, R(n), n) : (a = l, (n = Os.get(i)) && (a = U({}, l), su(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), R(n), ls(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Li(a, l.precedence, e));
    return t.instance;
  }
  function Li(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function tu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function su(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Yi = null;
  function Ph(e, t, l) {
    if (Yi === null) {
      var a = /* @__PURE__ */ new Map(), n = Yi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Yi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[Oe] || i[ht] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var d = a.get(c);
        d ? d.push(i) : a.set(c, [i]);
      }
    }
    return a;
  }
  function ef(e, t, l) {
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
  function tf(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var Cn = null;
  function lj() {
  }
  function aj(e, t, l) {
    if (Cn === null) throw Error(o(475));
    var a = Cn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = za(l.href), i = e.querySelector(
          wn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Gi.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, R(i);
          return;
        }
        i = e.ownerDocument || e, l = Fh(l), (n = Os.get(n)) && tu(l, n), i = i.createElement("link"), R(i);
        var c = i;
        c._p = new Promise(function(d, p) {
          c.onload = d, c.onerror = p;
        }), ls(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Gi.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function nj() {
    if (Cn === null) throw Error(o(475));
    var e = Cn;
    return e.stylesheets && e.count === 0 && lu(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && lu(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Gi() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) lu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Xi = null;
  function lu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Xi = /* @__PURE__ */ new Map(), t.forEach(ij, e), Xi = null, Gi.call(e));
  }
  function ij(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Xi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Xi.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = Gi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var En = {
    $$typeof: P,
    Provider: null,
    Consumer: null,
    _currentValue: le,
    _currentValue2: le,
    _threadCount: 0
  };
  function cj(e, t, l, a, n, i, c, d) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = j(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = j(0), this.hiddenUpdates = j(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = d, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function sf(e, t, l, a, n, i, c, d, p, z, J, te) {
    return e = new cj(
      e,
      t,
      l,
      c,
      d,
      p,
      z,
      te
    ), t = 1, i === !0 && (t |= 24), i = xs(3, null, null, t), e.current = i, i.stateNode = e, t = Hc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Gc(i), e;
  }
  function lf(e) {
    return e ? (e = ua, e) : ua;
  }
  function af(e, t, l, a, n, i) {
    n = lf(n), a.context === null ? a.context = n : a.pendingContext = n, a = hl(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = fl(e, a, t), l !== null && (bs(l, e, t), ln(l, e, t));
  }
  function nf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function au(e, t) {
    nf(e, t), (e = e.alternate) && nf(e, t);
  }
  function cf(e) {
    if (e.tag === 13) {
      var t = ra(e, 67108864);
      t !== null && bs(t, e, 67108864), au(e, 67108864);
    }
  }
  var Qi = !0;
  function rj(e, t, l, a) {
    var n = b.T;
    b.T = null;
    var i = Q.p;
    try {
      Q.p = 2, nu(e, t, l, a);
    } finally {
      Q.p = i, b.T = n;
    }
  }
  function uj(e, t, l, a) {
    var n = b.T;
    b.T = null;
    var i = Q.p;
    try {
      Q.p = 8, nu(e, t, l, a);
    } finally {
      Q.p = i, b.T = n;
    }
  }
  function nu(e, t, l, a) {
    if (Qi) {
      var n = iu(a);
      if (n === null)
        Vr(
          e,
          t,
          a,
          Zi,
          l
        ), uf(e, a);
      else if (dj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (uf(e, a), t & 4 && -1 < oj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Gt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = y(i.pendingLanes);
                  if (c !== 0) {
                    var d = i;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; c; ) {
                      var p = 1 << 31 - Qe(c);
                      d.entanglements[1] |= p, c &= ~p;
                    }
                    Gs(i), (St & 6) === 0 && (Ei = He() + 500, yn(0));
                  }
                }
                break;
              case 13:
                d = ra(i, 2), d !== null && bs(d, i, 2), Ti(), au(i, 2);
            }
          if (i = iu(a), i === null && Vr(
            e,
            t,
            a,
            Zi,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Vr(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function iu(e) {
    return e = dc(e), cu(e);
  }
  var Zi = null;
  function cu(e) {
    if (Zi = null, e = et(e), e !== null) {
      var t = q(e);
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
    return Zi = e, null;
  }
  function rf(e) {
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
        switch (lt()) {
          case nt:
            return 2;
          case Ze:
            return 8;
          case xe:
          case dt:
            return 32;
          case De:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ru = !1, kl = null, Cl = null, El = null, On = /* @__PURE__ */ new Map(), Tn = /* @__PURE__ */ new Map(), Ol = [], oj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function uf(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        kl = null;
        break;
      case "dragenter":
      case "dragleave":
        Cl = null;
        break;
      case "mouseover":
      case "mouseout":
        El = null;
        break;
      case "pointerover":
      case "pointerout":
        On.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Tn.delete(t.pointerId);
    }
  }
  function zn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Gt(t), t !== null && cf(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function dj(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return kl = zn(
          kl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Cl = zn(
          Cl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return El = zn(
          El,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return On.set(
          i,
          zn(
            On.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, Tn.set(
          i,
          zn(
            Tn.get(i) || null,
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
  function of(e) {
    var t = et(e.target);
    if (t !== null) {
      var l = q(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Lt(e.priority, function() {
              if (l.tag === 13) {
                var a = gs();
                a = fe(a);
                var n = ra(l, a);
                n !== null && bs(n, l, a), au(l, a);
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
  function Vi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = iu(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        oc = a, l.target.dispatchEvent(a), oc = null;
      } else
        return t = Gt(l), t !== null && cf(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function df(e, t, l) {
    Vi(e) && l.delete(t);
  }
  function hj() {
    ru = !1, kl !== null && Vi(kl) && (kl = null), Cl !== null && Vi(Cl) && (Cl = null), El !== null && Vi(El) && (El = null), On.forEach(df), Tn.forEach(df);
  }
  function Ji(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ru || (ru = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      hj
    )));
  }
  var Ki = null;
  function hf(e) {
    Ki !== e && (Ki = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Ki === e && (Ki = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (cu(a || l) === null)
              continue;
            break;
          }
          var i = Gt(l);
          i !== null && (e.splice(t, 3), t -= 3, cr(
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
  function An(e) {
    function t(p) {
      return Ji(p, e);
    }
    kl !== null && Ji(kl, e), Cl !== null && Ji(Cl, e), El !== null && Ji(El, e), On.forEach(t), Tn.forEach(t);
    for (var l = 0; l < Ol.length; l++) {
      var a = Ol[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Ol.length && (l = Ol[0], l.blockedOn === null); )
      of(l), l.blockedOn === null && Ol.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[_t] || null;
        if (typeof i == "function")
          c || hf(l);
        else if (c) {
          var d = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[_t] || null)
              d = c.formAction;
            else if (cu(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), hf(l);
        }
      }
  }
  function uu(e) {
    this._internalRoot = e;
  }
  $i.prototype.render = uu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = gs();
    af(l, a, e, t, null, null);
  }, $i.prototype.unmount = uu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      af(e.current, 2, null, e, null, null), Ti(), t[g] = null;
    }
  };
  function $i(e) {
    this._internalRoot = e;
  }
  $i.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Tt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Ol.length && t !== 0 && t < Ol[l].priority; l++) ;
      Ol.splice(l, 0, e), l === 0 && of(e);
    }
  };
  var ff = h.version;
  if (ff !== "19.1.0")
    throw Error(
      o(
        527,
        ff,
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
    currentDispatcherRef: b,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wi.isDisabled && Wi.supportsFiber)
      try {
        ee = Wi.inject(
          fj
        ), _e = Wi;
      } catch {
      }
  }
  return Dn.createRoot = function(e, t) {
    if (!T(e)) throw Error(o(299));
    var l = !1, a = "", n = Ed, i = Od, c = Td, d = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (d = t.unstable_transitionCallbacks)), t = sf(
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
    ), e[g] = t.current, Zr(e), new uu(t);
  }, Dn.hydrateRoot = function(e, t, l) {
    if (!T(e)) throw Error(o(299));
    var a = !1, n = "", i = Ed, c = Od, d = Td, p = null, z = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (d = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (p = l.unstable_transitionCallbacks), l.formState !== void 0 && (z = l.formState)), t = sf(
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
    ), t.context = lf(null), l = t.current, a = gs(), a = fe(a), n = hl(a), n.callback = null, fl(l, n, a), l = a, t.current.lanes = l, re(t, l), Gs(t), e[g] = t.current, Zr(e), new $i(t);
  }, Dn.version = "19.1.0", Dn;
}
var Nf;
function Nj() {
  if (Nf) return du.exports;
  Nf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), du.exports = _j(), du.exports;
}
var Sj = Nj(), r = zu();
const ju = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function wj({ api: u, projects: h }) {
  var Pe;
  const [_, o] = r.useState(((Pe = h[0]) == null ? void 0 : Pe.id) || ""), [T, q] = r.useState([]), [V, A] = r.useState("general_inspection"), [G, v] = r.useState("现场质量安全检查"), [U, K] = r.useState("general,通用施工检查"), [k, se] = r.useState(ju.map((X) => X[0])), [je, Ne] = r.useState(!1), [Se, Ee] = r.useState(!1), [me, P] = r.useState(""), [ue, ae] = r.useState(""), [B, ve] = r.useState(0), Ae = h.find((X) => X.id === _), Le = Ae != null && Ae.permissions ? Ae.permissions.includes("knowledge.process") : Ae == null ? void 0 : Ae.can_run, Ve = Ae != null && Ae.permissions ? Ae.permissions.includes("knowledge.review") : Ae == null ? void 0 : Ae.can_manage;
  r.useEffect(() => {
    let X = !1;
    return q([]), P(""), _ && u(`/scenes?project_id=${encodeURIComponent(_)}`).then((oe) => {
      X || q(oe.items);
    }).catch((oe) => {
      X || P(oe.message);
    }), () => {
      X = !0;
    };
  }, [_, B]);
  const Ye = async (X) => {
    Ee(!0), P(""), ae("");
    try {
      await X(), ve((oe) => oe + 1);
    } catch (oe) {
      P(oe.message);
    } finally {
      Ee(!1);
    }
  }, ge = (X) => {
    A(X.code), v(X.payload.name), K(X.payload.categories.map((oe) => oe.code + "," + oe.name).join(`
`)), se(X.payload.steps.map((oe) => oe.event_type)), Ne(X.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      me && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: me }),
      ue && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: ue }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: _, onChange: (X) => o(X.target.value), children: h.map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
      ] }),
      Le && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: U, onChange: (X) => K(X.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          ju.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(X[0]), onChange: (oe) => se((b) => oe.target.checked ? [...b, X[0]] : b.filter((Q) => Q !== X[0])) }),
            X[1]
          ] }, X[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: je, onChange: (X) => Ne(X.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Se || !_ || !k.length, onClick: () => void Ye(async () => {
          const X = T.filter((b) => b.code === V).sort((b, Q) => Q.version - b.version)[0], oe = U.split(`
`).filter((b) => b.trim()).map((b) => {
            const [Q, le] = b.split(/[,，]/);
            if (!(Q != null && Q.trim()) || !(le != null && le.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const ke = X == null ? void 0 : X.payload.categories.find((f) => f.code === Q.trim());
            return { code: Q.trim(), name: le.trim(), focus: (ke == null ? void 0 : ke.focus) || "", keywords: (ke == null ? void 0 : ke.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: _, code: V, expected_version: (X == null ? void 0 : X.version) || 0, payload: { name: G, categories: oe, steps: ju.filter((b) => k.includes(b[0])).map((b) => ({ event_type: b[0], name: b[1], scope: b[2] })), compare_deadline: je } }) }), ae("新场景版本已保存，原成果保持原配置。");
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
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ge(X), children: "以此版本编辑" }),
        Ve && !X.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Se, onClick: () => void Ye(async () => {
          var oe;
          await u(`/scenes/${X.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((oe = T.find((b) => b.code === X.code && b.active)) == null ? void 0 : oe.id) || null }) }), ae("场景版本已启用。");
        }), children: "启用此版本" }),
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Se, onClick: () => void Ye(async () => {
          var b;
          const oe = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(_)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: _, expected_version: ((b = oe.items[0]) == null ? void 0 : b.version) || 0, categories: X.payload.categories }) }), ae("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, X.id))
    ] })
  ] });
}
const vu = {}, Au = window.location.pathname.startsWith("/quality/b/"), qa = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), Sf = vu == null ? void 0 : vu.VITE_B_PLATFORM_MODE, Rt = qa || Au && (Sf === "true" || Sf !== "false" && !0);
function Fi() {
  if (!Au && !qa) return window.location.pathname;
  const u = qa ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function kj(u) {
  qa ? window.history.pushState({}, "", "/quality/#/b" + u) : Au ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), qa && window.dispatchEvent(new Event("platform-route"));
}
async function Zt(u, h = {}) {
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
  const q = await fetch("/quality/b" + u, { ...h, headers: _, credentials: "same-origin" });
  return q.status === 401 && window.dispatchEvent(new Event("b-session-expired")), q;
}
const wf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, kf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, ku = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), Cj = (u) => ({
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
  clauses: [ku()]
}), Ra = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function pu(u, h) {
  var _;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((_ = u == null ? void 0 : u.roles) != null && _.includes("reviewer"));
}
function Ej({ api: u, projects: h, identity: _ }) {
  var xe, dt, De;
  const [o, T] = r.useState(((xe = h[0]) == null ? void 0 : xe.id) || ""), [q, V] = r.useState([]), [A, G] = r.useState(null), [v, U] = r.useState(null), [K, k] = r.useState(!1), [se, je] = r.useState(!1), [Ne, Se] = r.useState(!1), [Ee, me] = r.useState(""), [P, ue] = r.useState(""), [ae, B] = r.useState(""), [ve, Ae] = r.useState(null), [Le, Ve] = r.useState(0), [Ye, ge] = r.useState(""), [Pe, X] = r.useState(!1), [oe, b] = r.useState(""), [Q, le] = r.useState("current_rectification"), [ke, f] = r.useState(""), [Y, $] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [I, ce] = r.useState(null), Z = r.useRef(crypto.randomUUID()), F = r.useRef(0), Te = h.find((E) => E.id === o), ne = pu(Te, "knowledge.process"), ze = pu(Te, "knowledge.review"), We = pu(Te, "knowledge.publish"), it = ne || ze || We;
  r.useEffect(() => {
    const E = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [K]), r.useEffect(() => {
    let E = !1;
    if (Se(!0), me(""), V([]), Ae(null), !o) {
      Se(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(o)}&view=${it ? "manage" : "published"}${ae ? "&cursor=" + encodeURIComponent(ae) : ""}`).then((w) => {
      E || (V(w.items), Ae(w.next_cursor));
    }).catch((w) => {
      E || me(w.message);
    }).finally(() => {
      E || Se(!1);
    }), () => {
      E = !0;
    };
  }, [o, it, ae, Le]), r.useEffect(() => () => {
    F.current++;
  }, []);
  const at = async (E) => {
    je(!0), me(""), ue("");
    try {
      await E();
    } catch (w) {
      me(w.message);
    } finally {
      je(!1);
    }
  }, $e = () => {
    var E;
    k(!1), (E = window.QaxcClearPendingEdits) == null || E.call(window);
  }, Re = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), Ue = (E) => {
    U((w) => w && { ...w, ...E }), k(!0), Z.current = crypto.randomUUID();
  }, ye = (E, w) => {
    v && Ue({ clauses: v.clauses.map((ee, _e) => _e === E ? { ...ee, ...w } : ee) });
  }, He = async (E) => {
    if (!Re()) return;
    const w = ++F.current;
    await at(async () => {
      const ee = await u("/standards/" + E.id);
      w === F.current && (G(ee), U(null), $e(), ce(null), ge(""), X(!1));
    });
  }, lt = () => {
    if (!A || !Re()) return;
    const { id: E, version: w, row_version: ee, state: _e, source_available: qe, verified_on: Qe, history: ut, clauses: L, ...de } = A;
    U({
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
      clauses: (L || []).map((ie) => Object.fromEntries(Object.keys(ku()).map((Je) => [Je, ie[Je]])))
    }), b("沿用已绑定原件；原文变化时请重新上传"), k(!0), Z.current = crypto.randomUUID();
  }, nt = (E) => void at(async () => {
    if (!A) return;
    const w = await u(`/standards/${A.id}/actions`, { method: "POST", body: JSON.stringify({ action: E, row_version: A.row_version, reason: Ye, evidence_checked: Pe }) });
    G({ ...A, ...w }), $e(), Ve((ee) => ee + 1), ue(kf[E] + "成功。"), ge(""), X(!1), A.source_available !== !1 && G(await u("/standards/" + A.id));
  }), Ze = () => void at(async () => {
    if (!A) return;
    const E = await Zt(`/api/v1/standards/${A.id}/source`, { headers: { Authorization: `Bearer dev-${_}` } });
    if (!E.ok) {
      const qe = await E.json();
      throw new Error(qe.message || "原件不可用。");
    }
    const w = await E.blob(), ee = URL.createObjectURL(w), _e = document.createElement("a");
    _e.href = ee, _e.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), _e.click(), setTimeout(() => URL.revokeObjectURL(ee), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Ee && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Ee,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => Ve((E) => E + 1), children: "刷新列表" })
    ] }),
    P && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: P }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: se, value: o, onChange: (E) => {
          Re() && (F.current++, T(E.target.value), G(null), U(null), k(!1), B(""), ce(null));
        }, children: h.map((E) => /* @__PURE__ */ s.jsx("option", { value: E.id, children: E.name }, E.id)) })
      ] }),
      ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !o, onClick: () => {
        Re() && (U(Cj(o)), G(null), b(""), k(!1), Z.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || Ne, onClick: () => Ve((E) => E + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    Ne ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !q.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        it ? "已登记" : "已发布",
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
            wf[E.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            E.valid_from,
            "；",
            E.valid_until ? "自 " + E.valid_until + " 起不再适用" : "未登记废止日期",
            E.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void He(E), children: "查看与核验" }),
        We && E.source_available === !1 && ["published", "approved", "superseded"].includes(E.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => {
          G(E), U(null), X(!1), ge("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, E.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ae || se, onClick: () => B(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !ve || se, onClick: () => B(ve || ""), children: "下一页" })
      ] })
    ] }) }),
    v && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (E) => {
      E.preventDefault(), at(async () => {
        if (!v.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...v, scope: Object.fromEntries(Object.entries(v.scope).map(([_e, qe]) => [_e, Ra(qe.join(`
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
        })) }, ee = await u("/standards", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify(w) });
        $e(), U(null), G(await u("/standards/" + ee.id)), Ve((_e) => _e + 1), ue("规范草稿已保存，需核验后发布。");
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
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: v.title, onChange: (E) => Ue({ title: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: v.code, readOnly: v.expected_version > 0, onChange: (E) => Ue({ code: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: v.edition, readOnly: v.expected_version > 0, onChange: (E) => Ue({ edition: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: v.maintainer, onChange: (E) => Ue({ maintainer: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: v.valid_from, onChange: (E) => Ue({ valid_from: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: v.valid_until || "", onChange: (E) => Ue({ valid_until: E.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (E) => {
            var ee;
            const w = (ee = E.target.files) == null ? void 0 : ee[0];
            w && at(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const _e = await u(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              Ue({ source_asset_id: _e.asset_id }), b(w.name), ue("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: oe || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: v.scope[E].join(`
`), onChange: (ee) => Ue({ scope: { ...v.scope, [E]: ee.target.value.split(`
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
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: E.number, onChange: (ee) => ye(w, { number: ee.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: E.chapter, onChange: (ee) => ye(w, { chapter: ee.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: E.parent_number || "", onChange: (ee) => ye(w, { parent_number: ee.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: E.page || "", onChange: (ee) => ye(w, { page: ee.target.value ? Number(ee.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: E.locator, onChange: (ee) => ye(w, { locator: ee.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: E.text, onChange: (ee) => ye(w, { text: ee.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([ee, _e]) => /* @__PURE__ */ s.jsxs("label", { children: [
              _e,
              /* @__PURE__ */ s.jsx("textarea", { value: E[ee].join(`
`), onChange: (qe) => ye(w, { [ee]: qe.target.value.split(`
`) }) })
            ] }, ee))
          ] }),
          v.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => Ue({ clauses: v.clauses.filter((ee, _e) => _e !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: v.clauses.length >= 200, onClick: () => Ue({ clauses: [...v.clauses, ku()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: v.reason, onChange: (E) => Ue({ reason: E.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !v.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Re() && (U(null), k(!1));
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
          wf[A.state]
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
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || A.source_available === !1, onClick: Ze, children: "下载核对原件" }),
          ne && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !A.clauses, onClick: lt, children: "以此版本修订" })
        ] }),
        (dt = A.clauses) == null ? void 0 : dt.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
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
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, ee]) => E[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: ee }),
            E[w].map((_e, qe) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: _e }, qe))
          ] }, w))
        ] }, E.number)),
        A.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Q, onChange: (E) => {
              le(E.target.value), ce(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Q === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: ke, onChange: (E) => {
              f(E.target.value), ce(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: Y[E], onChange: (ee) => {
              $({ ...Y, [E]: ee.target.value }), ce(null);
            } })
          ] }, E)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void at(async () => {
            ce(await u(`/standards/${A.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Q, event_date: ke || null, ...Y }) }));
          }), children: "核对条件" }),
          I && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[I.status] }),
            I.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              I.missing.map((E) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[E] || E).join("、")
            ] }),
            I.reasons.map((E) => /* @__PURE__ */ s.jsx("p", { children: E }, E)),
            /* @__PURE__ */ s.jsx("p", { children: I.note })
          ] })
        ] }),
        it && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: se, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Ye, maxLength: 2e3, onChange: (E) => ge(E.target.value) })
          ] }),
          A.state === "pending_review" && ze && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Pe, onChange: (E) => X(E.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            A.state === "draft" && ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim(), onClick: () => nt("submit"), children: "提交审核" }),
            A.state === "pending_review" && ze && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim() || !Pe, onClick: () => nt("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Ye.trim(), onClick: () => nt("request_changes"), children: "退回修改" })
            ] }),
            A.state === "approved" && We && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim(), onClick: () => nt("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(A.state) && We && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Ye.trim(), onClick: () => nt("withdraw"), children: "撤回此版本" })
          ] }),
          A.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (De = A.history) == null ? void 0 : De.map((E, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            kf[E.action] || E.action,
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
const Ha = { kind: "asset", id: "", quote: "", locator: "" }, Wf = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ha] }, Ff = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, If = { text: "", nature: "fact", evidence: [Ha] }, Pf = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ha] }, Oj = { name: "", value: null, evidence: [Ha] }, Cf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Ff] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Wf] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [If], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [Pf], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ha, kind: "work" }], historical_case_ids: [] }
}, Tj = { evidence: Ha, records: Wf, categories: Ff, claims: If, steps: Pf, parameters: Oj }, Ua = {
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
function ac({ value: u, onChange: h, catalog: _, name: o = "", path: T = "content", readonly: q = !1 }) {
  var v;
  const V = Ua[o] || o;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((U, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(ac, { value: U, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: T + "." + K, catalog: _, readonly: q, onChange: (k) => h(u.map((se, je) => je === K ? k : se)) }),
      !q && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, se) => K !== se)), children: "移除" })
    ] }, K)),
    !q && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(Tj[o] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([U, K]) => U === "kind" && T === "content" ? null : /* @__PURE__ */ s.jsx(ac, { name: U, value: K, path: T + "." + U, catalog: _, readonly: q, onChange: (k) => {
    const se = { ...u, [U]: k };
    U === "type" && ["judgment", "case"].includes(String(k)) && (se.options = {}), U === "kind" && "id" in u && (se.id = ""), h(se);
  } }, U)) });
  let A = zj[o];
  o === "kind" && (A = T.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (A = T.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const G = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in G || o === "historical_case_id") && (A = _.filter((U) => o in G ? U.work_kind === G[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(U.work_kind || "") : !0).map((U) => [U.id, U.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: T, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    q ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((v = A == null ? void 0 : A.find((U) => U[0] === String(u))) == null ? void 0 : v[1]) || String(u ?? "待填") }) : A ? /* @__PURE__ */ s.jsxs("select", { id: T, value: String(u ?? ""), onChange: (U) => h(U.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      A.map(([U, K]) => /* @__PURE__ */ s.jsx("option", { value: U, children: K }, U))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: T, type: "date", value: String(u ?? ""), onChange: (U) => h(U.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: T, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(u ?? ""), onChange: (U) => h(U.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : U.target.value) })
  ] });
}
const Ef = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, Of = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function Aj({ api: u, projects: h, identity: _ }) {
  var E;
  const [o, T] = r.useState(((E = h[0]) == null ? void 0 : E.id) || ""), [q, V] = r.useState("hazard"), [A, G] = r.useState([]), [v, U] = r.useState([]), [K, k] = r.useState(null), [se, je] = r.useState(null), [Ne, Se] = r.useState(""), [Ee, me] = r.useState(!1), [P, ue] = r.useState(""), [ae, B] = r.useState(""), [ve, Ae] = r.useState(!1), [Le, Ve] = r.useState(!1), [Ye, ge] = r.useState(0), [Pe, X] = r.useState(null), [oe, b] = r.useState(""), [Q, le] = r.useState(null), [ke, f] = r.useState(null), [Y, $] = r.useState(null), [I, ce] = r.useState(null), Z = r.useRef(crypto.randomUUID()), F = r.useRef(0), Te = r.useRef(!1), ne = h.find((w) => w.id === o), ze = (w) => {
    var ee, _e;
    return ne != null && ne.permissions ? ne.permissions.includes(w) : w.startsWith("training.") ? !!((ee = ne == null ? void 0 : ne.roles) != null && ee.some((qe) => ["admin", "teacher"].includes(qe))) : w === "knowledge.process" ? !!(ne != null && ne.can_run) : !!(ne != null && ne.can_manage) || !!((_e = ne == null ? void 0 : ne.roles) != null && _e.includes("reviewer"));
  }, We = ze(q === "question" ? "training.manage" : "knowledge.process"), it = ze(q === "question" ? "training.review" : "knowledge.review"), at = ze(q === "question" ? "training.review" : "knowledge.publish"), $e = We || it || at, Re = () => {
    var w;
    Te.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, Ue = () => !Te.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (ee) => {
      Te.current && (ee.preventDefault(), ee.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Ve(!0), G([]), ue(""), !o) {
      Ve(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(o)}&kind=${q}&view=${$e ? "manage" : "published"}${oe ? "&cursor=" + encodeURIComponent(oe) : ""}`).then((ee) => {
      w || (G(ee.items), X(ee.next_cursor));
    }).catch((ee) => {
      w || ue(ee.message);
    }).finally(() => {
      w || Ve(!1);
    }), $e && u(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((ee) => {
      w || U(ee.items);
    }).catch((ee) => {
      w || ue(ee.message);
    }), q === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((ee) => {
      w || le(ee);
    }).catch((ee) => {
      w || ue(ee.message);
    }), () => {
      w = !0;
    };
  }, [o, q, oe, $e, Ye]), r.useEffect(() => () => {
    F.current++;
  }, []);
  const ye = async (w) => {
    Ae(!0), ue(""), B("");
    try {
      await w();
    } catch (ee) {
      ue(ee.message);
    } finally {
      Ae(!1);
    }
  }, He = () => {
    F.current++, k(null), je(null), f(null), $(null), ce(null), b(""), Se(""), me(!1), Re();
  }, lt = async (w) => {
    if (!Ue()) return;
    const ee = ++F.current;
    await ye(async () => {
      const _e = await u("/workflows/" + w.id);
      ee === F.current && (k(_e), je(null), Se(""), me(!1), $(null), ce(null), Re());
    });
  }, nt = (w) => {
    je((ee) => ee && { ...ee, ...w }), Te.current = !0, Z.current = crypto.randomUUID();
  }, Ze = () => ye(async () => {
    if (!se) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify({ ...se, project_id: o, reason: Ne }) });
    k(w), je(null), Re(), ge((ee) => ee + 1), B("已保存新版本，尚未审核发布。");
  }), xe = (w, ee) => ye(async () => {
    const _e = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: ee, row_version: w.row_version, reason: Ne, evidence_checked: Ee }) });
    k(ee === "withdraw" ? null : await u("/workflows/" + _e.id)), ge((qe) => qe + 1), Re(), B(Of[ee] + "已完成");
  }), dt = (w) => ye(async () => {
    const ee = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(w)}&limit=100`);
    f(ee.items);
  }), De = () => ye(async () => {
    if (!K) return;
    const w = await Zt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + _ } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const ee = URL.createObjectURL(await w.blob()), _e = document.createElement("a");
    _e.href = ee, _e.download = K.title + ".docx", _e.click(), setTimeout(() => URL.revokeObjectURL(ee), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: ve, onChange: (w) => {
          Ue() && (He(), T(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: () => ge((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(Cf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: ve, className: "button " + (q === w ? "primary" : "ghost"), onClick: () => {
      Ue() && (He(), V(w));
    }, children: Ua[w] }, w)) }),
    P && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: P }),
    ae && /* @__PURE__ */ s.jsx("p", { role: "status", children: ae }),
    q === "hazard" && Q && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
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
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Q.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: ve, onClick: () => dt(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      ke && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        ke.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => lt(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Ua[q],
          "清单"
        ] }),
        We && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: ve, onClick: () => {
          Ue() && (He(), je({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(Cf[q]) }), Te.current = !0, Z.current = crypto.randomUUID());
        }, children: [
          "新建",
          Ua[q]
        ] })
      ] }),
      Le ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : A.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Ua[q],
        "。",
        We ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: A.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: ve || w.source_available === !1, onClick: () => lt(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          Ef[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        at && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !Ne.trim(), onClick: () => xe(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        oe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => b(""), children: "首页" }),
        Pe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => b(Pe), children: "下一页" })
      ] })
    ] }),
    se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Ua[q],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: ve, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: se.title, onChange: (w) => nt({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(ac, { value: se.content, catalog: v, onChange: (w) => nt({ content: w }) })
      ] })
    ] }),
    K && !se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        Ef[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        We && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: () => {
          je({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), Te.current = !0, Z.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve, onClick: De, children: "导出Word" }),
        ze("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ye(async () => {
          $((await u(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        q === "guide" && K.state === "published" && ze("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ye(async () => ce(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        q === "question" && K.state === "published" && We && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve, onClick: () => ye(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), B("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      Y && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        Y.length ? Y.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      I && /* @__PURE__ */ s.jsx("ul", { children: I.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(ac, { value: K.content, catalog: v, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((w, ee) => /* @__PURE__ */ s.jsxs("p", { children: [
          Of[w.action] || w.action,
          "：",
          w.reason
        ] }, ee))
      ] })
    ] }),
    $e && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: Ne, onChange: (w) => Se(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      se ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !Ne.trim() || !se.title.trim(), onClick: Ze, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee, onChange: (w) => me(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && We && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !Ne.trim(), onClick: () => xe(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && it && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !Ee || !Ne.trim(), onClick: () => xe(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !Ne.trim(), onClick: () => xe(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && at && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ve || !Ne.trim(), onClick: () => xe(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && at && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ve || !Ne.trim(), onClick: () => xe(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const Tf = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Rj({ id: u, identity: h, projects: _, navigate: o }) {
  const [T, q] = r.useState(null), [V, A] = r.useState(""), [G, v] = r.useState(!1), [U, K] = r.useState(""), [k, se] = r.useState(0), je = `a-import-action:${h}:${u}`;
  async function Ne(me, P) {
    const ue = await Zt("/integration/v1/a-imports/" + u + me, P), ae = await ue.json().catch(() => ({}));
    if (!ue.ok)
      throw ue.status >= 400 && ue.status < 500 && sessionStorage.removeItem(je), new Error(ae.message || `请求未完成（${ue.status}），请刷新查看最新状态。`);
    return ae;
  }
  r.useEffect(() => {
    let me = !1;
    async function P() {
      try {
        const ae = await Ne("");
        me || (q(ae), A(""));
      } catch (ae) {
        me || (q(null), A(ae.message));
      }
    }
    q(null), P();
    const ue = window.setInterval(P, 3e3);
    return () => {
      me = !0, clearInterval(ue);
    };
  }, [u, k, h]);
  const Se = (me) => {
    var P, ue;
    return !!T && !!((ue = (P = _.find((ae) => ae.id === T.project_id)) == null ? void 0 : P.permissions) != null && ue.includes(me));
  };
  async function Ee(me) {
    if (!(!T || G)) {
      v(!0), A("");
      try {
        const P = sessionStorage.getItem(je), ue = P ? JSON.parse(P) : { operation: me, key: crypto.randomUUID(), body: { expected_version: T.version, ...me === "withdraw" ? { reason: U.trim() } : {} } };
        if (ue.operation !== me) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(je, JSON.stringify(ue)), await Ne("/" + me, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": ue.key }, body: JSON.stringify(ue.body) }), sessionStorage.removeItem(je), se((ae) => ae + 1);
      } catch (P) {
        A(P.message);
      } finally {
        v(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => se((me) => me + 1), disabled: G, children: "刷新状态" })
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
            /* @__PURE__ */ s.jsx("dd", { children: Tf[T.status] || T.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Tf[T.retrospective_status] || T.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          T.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        T.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: T.error.message }),
        T.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: T.warnings.map((me, P) => /* @__PURE__ */ s.jsx("li", { children: me.message }, me.code + ":" + P)) })
        ] }),
        T.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          T.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          T.capabilities.can_view_materials && T.receipt_id && Se("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + T.receipt_id), children: "查看原始资料" }),
          T.capabilities.can_generate_retrospective && Se("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: G, onClick: () => void Ee("retrospectives"), children: T.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          T.retrospective_id && T.status !== "withdrawn" && Se("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + T.retrospective_id), children: "查看复盘" }),
          (T.status === "failed" || T.retrospective_status === "failed") && Se("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: G, onClick: () => void Ee("retry"), children: "重试失败任务" })
        ] }),
        T.status !== "withdrawn" && Se("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: U, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (me) => K(me.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: G || !U.trim(), onClick: () => void Ee("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Dj({ navigate: u }) {
  const [h, _] = r.useState([]), [o, T] = r.useState(""), [q, V] = r.useState(!1);
  return r.useEffect(() => {
    let A = !1;
    return (async () => {
      try {
        const [G, v, U] = await Promise.all([Zt("/api/v1/health"), Zt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!G.ok || !v.ok || !U.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, se] = await Promise.all([G.json(), v.json(), U.json()]), je = window.QaxcProjectId, Ne = se.tasks.filter((Se) => !je || Se.projectId === je).flatMap((Se) => (Se.events || []).map((Ee) => ({ id: Ee.id, action: Se.title + " · " + Ee.action, project_id: Se.projectId, created_at: Ee.uploadedAt, source: "现场作业" })));
        A || (V(K.worker_online), _([...Ne, ...k.items.map((Se) => ({ ...Se, source: "知识与学习" }))].sort((Se, Ee) => Date.parse(Ee.created_at) - Date.parse(Se.created_at)).slice(0, 100)));
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
      q ? "在线" : "未连接或正在读取",
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
  const [_, o] = r.useState(!1), [T, q] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function A(v, U, K) {
    const k = await Zt("/api/v1" + v, { method: U ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: U ? JSON.stringify(U) : void 0 }), se = await k.json();
    if (!k.ok) throw Error(se.message || "处理失败，请重试");
    return se;
  }
  async function G() {
    if (_) return;
    o(!0);
    const v = "archive-review:" + u, U = sessionStorage.getItem(v) || crypto.randomUUID();
    sessionStorage.setItem(v, U);
    try {
      q("正在核验归档成果…");
      const K = await A("/platform-archives", { delivery_id: u }, U);
      for (let k = 0; k < 60 && V.current; k++) {
        const se = await A("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (se.status === "ready") {
          q("证据已校验，正在生成复盘…");
          const je = await A("/retrospectives", { mode: "task_process", task_package_id: se.id });
          V.current && h("/retrospectives/" + je.id);
          return;
        }
        if (["failed", "withdrawn"].includes(se.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        q("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((je) => setTimeout(je, 1e3));
      }
      V.current && q("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      V.current && q(K.message);
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
), zf = (u) => {
  const h = qj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, em = (...u) => u.filter((h, _, o) => !!h && h.trim() !== "" && o.indexOf(h) === _).join(" ").trim(), Hj = (u) => {
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
    children: q,
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
      className: em("lucide", T),
      ...!q && !Hj(A) && { "aria-hidden": "true" },
      ...A
    },
    [
      ...V.map(([v, U]) => r.createElement(v, U)),
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
const Nt = (u, h) => {
  const _ = r.forwardRef(
    ({ className: o, ...T }, q) => r.createElement(Lj, {
      ref: q,
      iconNode: h,
      className: em(
        `lucide-${Mj(zf(u))}`,
        `lucide-${u}`,
        o
      ),
      ...T
    })
  );
  return _.displayName = zf(u), _;
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
], Af = Nt("activity", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Rf = Nt("arrow-left", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], zl = Nt("arrow-right", Xj);
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
], nc = Nt("book-open", Qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Vj = Nt("chevron-down", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], al = Nt("chevron-right", Jj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], $j = Nt("chevron-up", Kj);
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
], Al = Nt("circle-alert", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Rl = Nt("circle-check", Fj);
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
], Pj = Nt("clipboard-list", Ij);
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
], gu = Nt("database", ev);
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
], Df = Nt("download", tv);
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
], lv = Nt("external-link", sv);
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
], Bn = Nt("file-check-2", av);
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
], Uf = Nt("file-input", nv);
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
], bu = Nt("file-search", iv);
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
], Ii = Nt("folder-lock", cv);
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
], uv = Nt("history", rv);
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
], dv = Nt("image", ov);
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
], Mf = Nt("layout-dashboard", hv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], qf = Nt("loader-circle", fv);
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
], xv = Nt("pencil", mv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], Hf = Nt("play", jv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vv = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], pv = Nt("plus", vv);
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
], Xs = Nt("refresh-cw", gv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], yv = Nt("search", bv);
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
], Bf = Nt("shield-check", _v);
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
], tm = Nt("upload", Nv);
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
], wv = Nt("users", Sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], tc = Nt("x", kv), Ds = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, Un = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Lf = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Yf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], _ = (o) => h.includes(o) ? h.indexOf(o) : 100;
  return Object.entries(u).sort(([o], [T]) => _(o) - _(T));
}, yu = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function Cv({ asset: u, identity: h }) {
  const [_, o] = r.useState(""), [T, q] = r.useState("");
  return r.useEffect(() => {
    let V = !1, A = "";
    return Zt(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (G) => {
      if (!G.ok) throw new Error("图片不可访问或已撤回");
      return G.blob();
    }).then((G) => {
      A = URL.createObjectURL(G), V ? URL.revokeObjectURL(A) : o(A);
    }).catch((G) => {
      V || q(G.message);
    }), () => {
      V = !0, A && URL.revokeObjectURL(A);
    };
  }, [u, h]), T ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: T }) : _ ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: _, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function Ev({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var ht, _t;
  const [q, V] = r.useState([]), [A, G] = r.useState([]), [v, U] = r.useState([]), [K, k] = r.useState([]), [se, je] = r.useState("reports"), Ne = r.useRef(0), [Se, Ee] = r.useState(""), [me, P] = r.useState([]), [ue, ae] = r.useState(null), [B, ve] = r.useState(""), [Ae, Le] = r.useState(!1), [Ve, Ye] = r.useState([]), [ge, Pe] = r.useState({}), [X, oe] = r.useState(0), [b, Q] = r.useState(null), [le, ke] = r.useState(null), [f, Y] = r.useState(null), [$, I] = r.useState(new URLSearchParams(location.search).get("source") || ""), [ce, Z] = r.useState(""), [F, Te] = r.useState(!1), [ne, ze] = r.useState(""), [We, it] = r.useState(""), [at, $e] = r.useState(!0), [Re, Ue] = r.useState(!1), [ye, He] = r.useState(0), [lt, nt] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [Ze, xe] = r.useState(""), [dt, De] = r.useState(null), [E, w] = r.useState([]), [ee, _e] = r.useState(""), [qe, Qe] = r.useState(0), [ut, L] = r.useState(!1), [de, ie] = r.useState("csv"), [Je, y] = r.useState(""), [he, pe] = r.useState(""), [Be, gt] = r.useState(((ht = o.find((g) => g.can_run)) == null ? void 0 : ht.id) || (Rt ? "" : "demo-airport")), M = o.some((g) => g.can_run), j = h.startsWith("/records/"), re = h.startsWith("/imports/") && h !== "/imports/new", be = q.find((g) => g.id === $), ct = A.filter((g) => g.kind === (be == null ? void 0 : be.kind) && g.project_id === (be == null ? void 0 : be.project_id));
  r.useEffect(() => {
    xe(""), w([]), _e(""), Qe(0), ze(""), it(""), Y(null);
  }, [h]), r.useEffect(() => {
    let g = !1;
    $e(!0), ze(""), ke(null), Q(null);
    const we = new URLSearchParams(Object.entries(lt).filter(([, bt]) => !!bt));
    we.set("limit", "15"), Ze && we.set("cursor", Ze);
    async function rt() {
      try {
        const [bt, m] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (g) return;
        if (V(bt.items), G(m.items), h === "/sources" || h === "/imports") {
          const Oe = await u("/imports?limit=15" + (Ze ? "&cursor=" + encodeURIComponent(Ze) : ""));
          if (g) return;
          U(Oe.items), De(Oe.next_cursor);
        } else if (re) {
          const Oe = await u(`${h}?after_row=${qe}&only_issues=${ut}`);
          g || Q(Oe);
        } else if (j) {
          const Oe = await u(h + (ee ? "?version=" + ee : ""));
          g || ke(Oe);
        } else if (h === "/records") {
          const Oe = await u("/records?" + we);
          if (g) return;
          if (Ye(Oe.items), De(Oe.next_cursor), Pe(Oe.totals_by_kind), oe(Oe.detail_groups_after_confirmed_links), se === "reports") {
            const Ce = new URLSearchParams(we);
            Ce.delete("cursor"), Ze && Ce.set("after_id", Ze);
            const et = await u("/reports?" + Ce);
            if (g) return;
            k(et.items), De(et.next_cursor);
          }
        }
      } catch (bt) {
        g || ze(bt.message);
      } finally {
        g || $e(!1);
      }
    }
    return rt(), () => {
      g = !0;
    };
  }, [h, lt, Ze, ee, ye, qe, ut, se]), r.useEffect(() => {
    if (!re || !b || !["queued", "running"].includes(b.status)) return;
    let g = !1;
    const we = setInterval(() => {
      u(`${h}?after_row=${qe}&only_issues=${ut}`).then((rt) => {
        g || Q(rt);
      }).catch((rt) => {
        g || ze(rt.message);
      });
    }, 1500);
    return () => {
      g = !0, clearInterval(we);
    };
  }, [h, b == null ? void 0 : b.status, qe, ut]), r.useEffect(() => {
    Ne.current++, Ee(""), P([]), ae(null), ve("");
  }, [lt, se, h]);
  const N = async (g, we = !1) => {
    const rt = ++Ne.current;
    if (!we && Se === g) {
      Ee(""), Le(!1);
      return;
    }
    we || (P([]), ae(null)), Ee(g), Le(!0), ve("");
    const bt = new URLSearchParams(Object.entries(lt).filter(([, m]) => !!m));
    bt.set("document_id", g), bt.set("limit", "15"), we && ue && bt.set("cursor", ue);
    try {
      const m = await u("/records?" + bt);
      if (rt !== Ne.current) return;
      P((Oe) => we ? [...Oe, ...m.items] : m.items), ae(m.next_cursor);
    } catch (m) {
      rt === Ne.current && ve(m.message);
    } finally {
      rt === Ne.current && Le(!1);
    }
  }, fe = async (g) => {
    Ue(!0), ze(""), it("");
    try {
      await g();
    } catch (we) {
      ze(we.message);
    } finally {
      Ue(!1);
    }
  }, Ke = () => fe(async () => {
    for (const g of o.filter((we) => we.can_run))
      for (const we of g.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const rt = `mock-${g.id}-${we}`;
        q.some((bt) => bt.namespace === rt && bt.project_id === g.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${g.id === "demo-airport" ? "机场" : "地铁"} · ${Ds[we]}（模拟）`, namespace: rt, kind: we, project_id: g.id, mapping_template: we === "governance_export" ? "governance-v1" : `${we}-v1` }) });
      }
    it("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), He((g) => g + 1);
  }), Tt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !E.length, onClick: () => {
        xe(E.at(-1) || ""), w(E.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !dt, onClick: () => {
        w([...E, Ze]), xe(dt || "");
      }, children: "下一页" })
    ] })
  ] }), Lt = (g, we) => {
    nt({ ...lt, [g]: we }), xe(""), w([]);
  }, Yt = (g) => fe(async () => {
    const we = await Zt(`/api/v1/assets/${g}/content`, { headers: { Authorization: `Bearer dev-${T}` } });
    if (!we.ok) {
      const m = await we.json();
      throw new Error(m.message);
    }
    const rt = URL.createObjectURL(await we.blob()), bt = document.createElement("a");
    bt.href = rt, bt.download = "来源文件", bt.click(), URL.revokeObjectURL(rt);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(gu, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ne && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      ne,
      /* @__PURE__ */ s.jsx("button", { onClick: () => He((g) => g + 1), children: "重新加载" })
    ] }),
    We && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      We
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => _("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => _("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => _("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => He((g) => g + 1), disabled: at, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    at ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re || !M, onClick: () => void Ke(), children: [
          /* @__PURE__ */ s.jsx(gu, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: q.map((g) => {
        var we, rt;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(gu, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ds[g.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: g.name }),
          /* @__PURE__ */ s.jsx("p", { children: (we = o.find((bt) => bt.id === g.project_id)) == null ? void 0 : we.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Lf(g.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((rt = o.find((bt) => bt.id === g.project_id)) != null && rt.can_run), onClick: () => {
            I(g.id), Z(""), _("/imports/new?source=" + g.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(zl, { size: 16 })
          ] })
        ] }, g.id);
      }) }),
      !q.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(bu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      M && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Rt || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Je, onChange: (g) => y(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: he, onChange: (g) => pe(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: de, onChange: (g) => ie(g.target.value), children: ["csv", "excel", "governance_export"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Ds[g] }, g)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Be, onChange: (g) => gt(g.target.value), children: o.filter((g) => g.can_run).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Re || !Je || !he, onClick: () => void fe(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Je, namespace: he, kind: de, project_id: Be, mapping_template: de === "governance_export" ? "governance-v1" : `${de}-v1` }) }), He((g) => g + 1), it("来源已创建。");
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: $, onChange: (g) => {
                I(g.target.value), Z(""), Y(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                q.filter((g) => {
                  var we;
                  return (we = o.find((rt) => rt.id === g.project_id)) == null ? void 0 : we.can_run;
                }).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ce, onChange: (g) => {
                Z(g.target.value), Y(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                ct.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.asset_id, children: g.label }, g.asset_id))
              ] })
            ] })
          ] }),
          !Rt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: F, onChange: (g) => Te(g.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Rt && be && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Re, accept: be.kind === "csv" ? ".csv" : be.kind === "excel" ? ".xlsx" : ".json", onChange: (g) => {
                var rt;
                const we = (rt = g.target.files) == null ? void 0 : rt[0];
                g.target.value = "", we && fe(async () => {
                  if (we.size > 5e6) throw new Error("文件不能超过5MB");
                  const bt = new Uint8Array(await we.arrayBuffer());
                  let m = "";
                  for (let Ce = 0; Ce < bt.length; Ce += 8192) m += String.fromCharCode(...bt.subarray(Ce, Ce + 8192));
                  const Oe = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: be.project_id, kind: be.kind, name: we.name, base64: btoa(m) }) });
                  G((Ce) => [...Ce, Oe]), Z(Oe.asset_id), Y(null), it("文件已上传，请预览字段与异常后提交接入。");
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
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Re || !$ || !ce, onClick: () => void fe(async () => {
            Y(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: $, input_asset_id: ce }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(bu, { size: 16 }),
            "预览字段与异常"
          ] })
        ] })
      ] }),
      f && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "输入记录" }),
            /* @__PURE__ */ s.jsx("strong", { children: f.total })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "原始字段" }),
            /* @__PURE__ */ s.jsx("strong", { children: f.raw_columns.length })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "需核查行" }),
            /* @__PURE__ */ s.jsx("strong", { children: f.warning_rows })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "不能接入行" }),
            /* @__PURE__ */ s.jsx("strong", { children: f.failed_rows })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "字段映射" }),
            /* @__PURE__ */ s.jsx("span", { children: "未映射字段仍完整保留在原始字段中" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(f.mapping).map(([g, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: we }),
            /* @__PURE__ */ s.jsx(zl, { size: 13 }),
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
            /* @__PURE__ */ s.jsx("tbody", { children: f.preview.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                g.row_number,
                /* @__PURE__ */ s.jsx("small", { children: g.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: yu(g.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: Ds[String(g.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...g.errors, ...g.issues].join("；") || "通过" })
            ] }, g.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re, onClick: () => void fe(async () => {
              const g = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: $, input_asset_id: ce, input_hash: f.input_hash, fail_after: !Rt && F ? 2 : null }) });
              _("/imports/" + g.id);
            }), children: [
              /* @__PURE__ */ s.jsx(tm, { size: 16 }),
              Re ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !M, onClick: () => _("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(zl, { size: 15 })
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
            /* @__PURE__ */ s.jsx("small", { children: Lf(g.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: Un[g.status] }),
          ["created", "updated", "skipped", "failed"].map((we) => /* @__PURE__ */ s.jsx("td", { children: g.counts[we] }, we)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/imports/" + g.id), children: "查看历史项目" }) })
        ] }, g.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      Tt
    ] }) : re && b ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/imports"), children: [
        /* @__PURE__ */ s.jsx(Rf, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Un[b.status] }),
          /* @__PURE__ */ s.jsx("h2", { children: b.source.name }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "已处理 ",
            b.counts.processed,
            " / ",
            b.counts.total,
            " 条 · ",
            b.progress,
            "%"
          ] })
        ] }),
        b.job_status === "failed" && ((_t = o.find((g) => g.id === b.source.project_id)) == null ? void 0 : _t.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re, onClick: () => void fe(async () => {
          await u(`/jobs/${b.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: b.row_version }) }), He((g) => g + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Xs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      b.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: b.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: g === "failed" ? "失败行" : Un[g] }),
        /* @__PURE__ */ s.jsx("strong", { children: b.counts[g] })
      ] }, g)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-meta", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "实际输入SHA-256" }),
          /* @__PURE__ */ s.jsx("code", { children: b.input_hash })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "规则版本" }),
          /* @__PURE__ */ s.jsx("strong", { children: b.rule_version })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { children: "记录类型" }),
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(b.counts.kinds || {}).map(([g, we]) => `${Ds[g]} ${we}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ut, onChange: (g) => {
              L(g.target.checked), Qe(0);
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
          /* @__PURE__ */ s.jsx("tbody", { children: b.rows.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: g.row_number }),
            /* @__PURE__ */ s.jsx("td", { children: g.outcome === "failed" ? "失败" : Un[g.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: g.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: g.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.record_id), children: "查看证据" }) })
          ] }, g.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !qe, onClick: () => Qe(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !b.next_row, onClick: () => Qe(b.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            Ds[g],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: ge[g] || 0 })
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: lt.project_id, onChange: (g) => Lt("project_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: lt.source_id, onChange: (g) => Lt("source_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              q.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: lt.record_kind, onChange: (g) => Lt("record_kind", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Ds[g] }, g))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: lt.quality_status, onChange: (g) => Lt("quality_status", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: lt.from_date, onChange: (g) => Lt("from_date", g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: lt.to_date, onChange: (g) => Lt("to_date", g.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "reports", onClick: () => {
            je("reports"), xe(""), w([]), Ee("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "rows", onClick: () => {
            je("rows"), xe(""), w([]);
          }, children: "逐条数据" })
        ] }),
        se === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((g) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": Se === g.id, onClick: () => void N(g.id), children: [
            /* @__PURE__ */ s.jsx(bu, { size: 20 }),
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
            /* @__PURE__ */ s.jsx(zl, { size: 16 })
          ] }),
          Se === g.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            B && /* @__PURE__ */ s.jsx("p", { role: "alert", children: B }),
            Ae ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : me.map((we) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + we.id), children: we.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                Ds[we.record_kind],
                " · v",
                we.current_version
              ] })
            ] }, we.id)),
            ue && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Ae, onClick: () => void N(g.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, g.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Ve.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ve.map((g) => {
            var we;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + g.id), children: g.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (we = q.find((rt) => rt.id === g.source_id)) == null ? void 0 : we.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Ds[g.record_kind] }),
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
        Tt
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : j && le ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/records"), children: [
        /* @__PURE__ */ s.jsx(Rf, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            Ds[le.record_kind],
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
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Yf(le.raw_fields).map(([g, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: yu(we) })
          ] }, g)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Yf(le.effective_fields).map(([g, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: yu(we) })
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
          var we;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Ds[g.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: g.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(g.locator) }),
            g.type !== "source_row" && g.asset_id ? /* @__PURE__ */ s.jsx(Cv, { asset: g.asset_id, identity: T }) : g.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            g.asset_id && ((we = o.find((rt) => rt.id === le.project_id)) == null ? void 0 : we.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Re, onClick: () => void Yt(g.asset_id), children: "下载对应来源文件" })
          ] }, g.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        le.links.length ? le.links.map((g) => {
          var we;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Un[g.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.other_record_id), children: "打开另一条记录" }),
            ((we = o.find((rt) => rt.id === le.project_id)) == null ? void 0 : we.roles.some((rt) => ["admin", "reviewer"].includes(rt))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Re || g.review_state === "stale", onClick: () => void fe(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "confirmed" }) }), He((rt) => rt + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Re || g.review_state === "stale", onClick: () => void fe(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "rejected" }) }), He((rt) => rt + 1);
              }), children: "排除" })
            ] })
          ] }, g.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ne ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const nl = "/history-review", Yn = "/history-reader", sm = "historyReview.visibleColumnsV2", lm = "historyReview.columnOrder", sc = "historyReview.columnWidths", am = "historyReview.pageSize", nm = [20, 30, 50, 100, 200], im = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], Mn = ["_photos", "_source", "_status", "_actions"], _u = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], Ru = { _actions: "操作", _photos: "照片", _source: "来源报告", _status: "状态" }, lc = Object.keys(Ru), cm = [...im, "_photos", "_source", "_status", "_actions"], ic = [...im, "_photos", "_source", "_actions"], Ov = {
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
    const u = localStorage.getItem(sm), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((_) => typeof _ == "string") : ic;
  } catch {
    return ic;
  }
}
function Av() {
  try {
    const u = Number(localStorage.getItem(am));
    return nm.includes(u) ? u : 30;
  } catch {
    return 30;
  }
}
function Rv() {
  try {
    const u = localStorage.getItem(sc), h = u ? JSON.parse(u) : null;
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
    const u = localStorage.getItem(lm), h = u ? JSON.parse(u) : null;
    if (Array.isArray(h) && h.length) return h.filter((_) => typeof _ == "string");
  } catch {
  }
  return cm;
}
function Uv(u, h) {
  const _ = u.filter((T) => h.includes(T) || lc.includes(T));
  let o = _.findIndex((T) => lc.includes(T));
  o < 0 && (o = _.length);
  for (const T of h)
    _.includes(T) || (_.splice(o, 0, T), o += 1);
  for (const T of lc) {
    if (_.includes(T)) continue;
    const q = _.indexOf("_actions");
    q >= 0 ? _.splice(q, 0, T) : _.push(T);
  }
  return _;
}
function Kt(u, h = 120) {
  const _ = (u || "").replace(/\s+/g, " ").trim();
  return _.length > h ? _.slice(0, h) + "…" : _ || "—";
}
function Il(u, h) {
  var _;
  return Ru[h] || ((_ = u.find((o) => o.key === h)) == null ? void 0 : _.label) || h;
}
function Gf(u, h) {
  return u ? Object.entries(u).map(([_, o]) => `${Il(h, _)}：${Kt(o, 30)}`).join("；") : "—";
}
function Cu({ id: u }) {
  const [h, _] = r.useState(""), [o, T] = r.useState("");
  return r.useEffect(() => {
    let q = !1, V = "";
    return Zt("/api/v1" + Yn + "/images/" + encodeURIComponent(u)).then(async (A) => {
      if (!A.ok) throw Error("图片暂不可用");
      return A.blob();
    }).then((A) => {
      V = URL.createObjectURL(A), q ? URL.revokeObjectURL(V) : _(V);
    }).catch((A) => {
      q || T(A.message);
    }), () => {
      q = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function Xf({ api: u, findingId: h, large: _ = !1 }) {
  const [o, T] = r.useState(null), [q, V] = r.useState("");
  return r.useEffect(() => {
    let A = !1;
    return T(null), V(""), u(Yn + "/findings/" + encodeURIComponent(h)).then((G) => {
      A || T(G.images);
    }).catch((G) => {
      A || (V(G.message), T([]));
    }), () => {
      A = !0;
    };
  }, [u, h]), q ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: q }) : o ? o.length ? /* @__PURE__ */ s.jsx("div", { className: _ ? "history-images history-images-large" : "history-images", children: o.map((A, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
    /* @__PURE__ */ s.jsx(Cu, { id: A.id }),
    /* @__PURE__ */ s.jsxs("figcaption", { children: [
      Kt(A.relation, 24),
      "｜",
      JSON.stringify(A.locator)
    ] })
  ] }, A.id + ":" + G)) }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "该条目没有已关联的照片（无照片不代表原报告没有照片）。" }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "读取关联照片…" });
}
function Mv({ api: u }) {
  const [h, _] = r.useState(null), [o, T] = r.useState([]), [q, V] = r.useState("findings"), [A, G] = r.useState([]), [v, U] = r.useState([]), [K, k] = r.useState([]), [se, je] = r.useState([]), [Ne, Se] = r.useState(zv), [Ee, me] = r.useState(Dv), [P, ue] = r.useState(Rv), [ae, B] = r.useState(""), ve = r.useRef(!1), [Ae, Le] = r.useState(""), [Ve, Ye] = r.useState(""), [ge, Pe] = r.useState(!1), [X, oe] = r.useState(""), [b, Q] = r.useState(""), [le, ke] = r.useState(""), [f, Y] = r.useState(""), [$, I] = r.useState(0), [ce, Z] = r.useState(!1), [F, Te] = r.useState(Av), [ne, ze] = r.useState(!1), [We, it] = r.useState([]), [at, $e] = r.useState(/* @__PURE__ */ new Set()), [Re, Ue] = r.useState(!1), [ye, He] = r.useState(null), [lt, nt] = r.useState({}), [Ze, xe] = r.useState(null), [dt, De] = r.useState(""), [E, w] = r.useState(null), [ee, _e] = r.useState(""), [qe, Qe] = r.useState(""), [ut, L] = r.useState(!0), [de, ie] = r.useState(!1), [Je, y] = r.useState(0), he = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], pe = (h == null ? void 0 : h.fields) || he, Be = r.useMemo(() => Ee.filter((x) => Ne.includes(x)), [Ee, Ne]), gt = he.length + Mn.length, M = Ne.filter((x) => he.some((R) => R.key === x) || Mn.includes(x)).length, j = (x) => P[x] || Ov[x] || 140, re = Be.reduce((x, R) => x + j(R), 0) || 1, be = (x) => `${(j(x) / re * 100).toFixed(4)}%`;
  r.useEffect(() => {
    if ((!Ze || ye) && !E) return;
    const x = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const R = (Ge) => {
      Ge.key === "Escape" && (xe(null), w(null));
    };
    return window.addEventListener("keydown", R), () => {
      document.body.style.overflow = x, window.removeEventListener("keydown", R);
    };
  }, [Ze, ye, E]), r.useEffect(() => {
    let x = !1;
    return L(!0), Qe(""), Promise.all([
      u(nl + "/summary"),
      u(nl + "/projects?limit=800"),
      u(nl + "/drafts?limit=100")
    ]).then(([R, Ge, At]) => {
      x || (_(R), T(Ge.items), k(At.items), Se((tt) => {
        const Ut = /* @__PURE__ */ new Set([...R.editable_fields.map((is) => is.key), ...Mn]), Dl = tt.filter((is) => Ut.has(is));
        return Dl.length ? Dl : ic.filter((is) => Ut.has(is));
      }), me((tt) => Uv(tt, R.editable_fields.map((Ut) => Ut.key))));
    }).catch((R) => {
      x || Qe(R.message);
    }).finally(() => {
      x || L(!1);
    }), () => {
      x = !0;
    };
  }, [u, Je]), r.useEffect(() => {
    if (q !== "findings") return;
    let x = !1;
    return L(!0), Qe(""), u(nl + "/findings?" + new URLSearchParams({
      q: f,
      project: X,
      document_id: b,
      offset: String($),
      limit: String(F)
    })).then((R) => {
      x || (G(ne ? R.items.filter((Ge) => Ge.draft_id) : R.items), Z(R.has_more));
    }).catch((R) => {
      x || Qe(R.message);
    }).finally(() => {
      x || L(!1);
    }), () => {
      x = !0;
    };
  }, [u, q, f, X, b, $, ne, F, Je]), r.useEffect(() => {
    if (q !== "reports") return;
    let x = !1;
    return L(!0), Qe(""), u(nl + "/reports?" + new URLSearchParams({ q: f, project: X, offset: "0", limit: "100" })).then((R) => {
      x || (U(R.items), Z(!1));
    }).catch((R) => {
      x || Qe(R.message);
    }).finally(() => {
      x || L(!1);
    }), () => {
      x = !0;
    };
  }, [u, q, f, X, Je]), r.useEffect(() => {
    if (q !== "logs") return;
    let x = !1;
    return L(!0), Qe(""), u(nl + "/logs?limit=100").then((R) => {
      x || je(R.items);
    }).catch((R) => {
      x || Qe(R.message);
    }).finally(() => {
      x || L(!1);
    }), () => {
      x = !0;
    };
  }, [u, q, Je]), r.useEffect(() => {
    Re && $e(new Set(A.map((x) => x.id)));
  }, [A, Re]);
  function ct(x) {
    Se(x);
    try {
      localStorage.setItem(sm, JSON.stringify(x));
    } catch {
    }
  }
  function N(x) {
    ct(Ne.filter((R) => R !== x));
  }
  function fe(x, R) {
    const Ge = R ? [...Ne, x] : Ne.filter((At) => At !== x);
    ct(Ge);
  }
  function Ke(x) {
    me(x);
    try {
      localStorage.setItem(lm, JSON.stringify(x));
    } catch {
    }
  }
  function Tt(x, R) {
    if (x.preventDefault(), x.stopPropagation(), x.pointerType === "mouse" && x.button !== 0) return;
    const Ge = x.clientX, At = x.currentTarget.closest("table"), tt = {};
    let Ut = 0;
    if (At) {
      Ut = At.getBoundingClientRect().width;
      for (const cs of Array.from(At.querySelectorAll("thead th[data-col]"))) {
        const qs = cs.dataset.col;
        qs && (tt[qs] = cs.getBoundingClientRect().width);
      }
    }
    const Dl = tt[R] || j(R), is = Object.keys(tt).filter((cs) => cs !== R), Pl = is.reduce((cs, qs) => cs + tt[qs], 0) || 1, cl = is.length * 56, Ts = Math.max(120, Ut - cl);
    ve.current = !0, B(R), Le(""), Ye(""), document.body.classList.add("history-resizing"), ue(tt);
    const Ms = (cs) => {
      const qs = Math.round(Math.max(56, Math.min(Ts, Dl + cs.clientX - Ge))), rl = Math.max(56, Ut - qs), Ba = Math.min(3, Math.max(0.08, rl / Pl)), Ul = { ...tt };
      for (const Gn of is) Ul[Gn] = tt[Gn] * Ba;
      Ul[R] = qs, ue(Ul);
    }, es = () => {
      window.removeEventListener("pointermove", Ms), window.removeEventListener("pointerup", es), window.removeEventListener("pointercancel", es), ve.current = !1, B(""), document.body.classList.remove("history-resizing"), ue((cs) => {
        try {
          localStorage.setItem(sc, JSON.stringify(cs));
        } catch {
        }
        return cs;
      });
    };
    window.addEventListener("pointermove", Ms), window.addEventListener("pointerup", es), window.addEventListener("pointercancel", es);
  }
  function Lt(x) {
    ue((R) => {
      if (!(x in R)) return R;
      const Ge = { ...R };
      delete Ge[x];
      try {
        localStorage.setItem(sc, JSON.stringify(Ge));
      } catch {
      }
      return Ge;
    });
  }
  function Yt() {
    ue({});
    try {
      localStorage.removeItem(sc);
    } catch {
    }
  }
  function ht(x, R) {
    if (!x || !R || x === R) return;
    const Ge = Ee.filter((tt) => tt !== x), At = Ge.indexOf(R);
    Ge.splice(At < 0 ? Ge.length : At, 0, x), Ke(Ge);
  }
  function _t(x) {
    $e((R) => {
      const Ge = new Set(R);
      return Ge.has(x) ? Ge.delete(x) : Ge.add(x), Ge;
    });
  }
  function g() {
    Re ? (Ue(!1), $e(/* @__PURE__ */ new Set())) : (Ue(!0), $e(new Set(A.map((x) => x.id))));
  }
  function we(x) {
    He(x);
    const R = {};
    for (const Ge of _u) R[Ge] = x[Ge] || "";
    nt(R), _e(""), xe(null), De("");
  }
  async function rt() {
    if (!ye) return;
    const x = {};
    for (const R of _u) {
      const Ge = ye[R] || "";
      lt[R] !== Ge && (x[R] = lt[R] || null);
    }
    if (!Object.keys(x).length) {
      _e("没有修改任何字段。");
      return;
    }
    ie(!0), Qe("");
    try {
      await u(nl + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: ye.id, changes: x }) }), _e(`已保存草稿（${Object.keys(x).map((R) => Il(he, R)).join("、")}），批量确认后覆盖数据库。`), He(null), y((R) => R + 1);
    } catch (R) {
      Qe(R.message);
    } finally {
      ie(!1);
    }
  }
  async function bt(x) {
    if (!x.length) {
      _e("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${x.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      ie(!0), Qe(""), _e("");
      try {
        const R = await u(nl + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: x }) });
        _e(`已确认写入 ${R.applied.length} 条${R.conflicts.length ? `；${R.conflicts.length} 条存在值冲突` : ""}。`), it([]), y((Ge) => Ge + 1);
      } catch (R) {
        Qe(R.message);
      } finally {
        ie(!1);
      }
    }
  }
  async function m(x) {
    if (x.length) {
      ie(!0), Qe("");
      try {
        await u(nl + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: x }) }), it([]), y((R) => R + 1);
      } catch (R) {
        Qe(R.message);
      } finally {
        ie(!1);
      }
    }
  }
  async function Oe(x) {
    xe(null), De("");
    try {
      const R = await u(Yn + "/findings/" + encodeURIComponent(x.id));
      xe(R);
    } catch (R) {
      De(R.message);
    }
  }
  function Ce(x) {
    const R = Rt ? "/quality/b" : "";
    window.open(R + "/api/v1" + Yn + "/documents/" + encodeURIComponent(x) + "/view", "_blank", "noopener");
  }
  async function et(x) {
    if (Ze)
      try {
        const R = x || Ze, Ge = await Zt("/api/v1" + Yn + "/documents/" + encodeURIComponent(R.document_id) + "/original");
        if (!Ge.ok) throw Error("原件暂不可用，请稍后重试。");
        const At = URL.createObjectURL(await Ge.blob()), tt = document.createElement("a");
        tt.href = At, tt.download = R.original_name, tt.click(), setTimeout(() => URL.revokeObjectURL(At), 1e3);
      } catch (R) {
        De(R.message);
      }
  }
  const Gt = r.useMemo(() => v, [v]), us = r.useMemo(() => K.map((x) => x.id), [K]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ut, onClick: () => y((x) => x + 1), children: "刷新数据" })
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
      qe && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        qe,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => y((x) => x + 1), children: "重试" })
      ] }),
      ee && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: ee }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([x, R]) => /* @__PURE__ */ s.jsx("button", { className: q === x ? "button primary" : "button ghost", onClick: () => {
        V(x), I(0);
      }, children: R }, x)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel history-toolbar-panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (x) => {
          x.preventDefault(), Y(le.trim()), I(0);
        }, children: [
          /* @__PURE__ */ s.jsx("input", { id: "history-query", "aria-label": "搜索", value: le, onChange: (x) => ke(x.target.value), maxLength: 100, placeholder: q === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ut, children: "搜索" })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: X, onChange: (x) => {
            oe(x.target.value), I(0);
          }, children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目（",
              (h == null ? void 0 : h.projects) ?? "—",
              "）"
            ] }),
            o.map((x) => /* @__PURE__ */ s.jsxs("option", { value: x.name, children: [
              x.name,
              "（",
              x.findings,
              "）"
            ] }, x.name))
          ] })
        ] }),
        b && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          Q(""), I(0);
        }, children: "清除报告筛选" }),
        q === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ne, onChange: (x) => ze(x.target.checked) }),
          "只看待确认修改"
        ] }),
        q === "findings" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => Pe((x) => !x), children: h ? `显示字段（${M}/${gt}）` : "显示字段" }),
        q === "findings" && /* @__PURE__ */ s.jsx("button", { className: Re ? "button primary" : "button secondary", onClick: g, children: Re ? "收起全部字段" : "展开全部字段" })
      ] }),
      ge && q === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        he.map((x) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(x.key), onChange: (R) => fe(x.key, R.target.checked) }),
          x.label
        ] }, x.key)),
        /* @__PURE__ */ s.jsx("span", { className: "history-fieldsep", children: "其他列" }),
        Mn.map((x) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(x), onChange: (R) => fe(x, R.target.checked) }),
          Ru[x]
        ] }, x)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ct(ic.filter((x) => he.some((R) => R.key === x) || Mn.includes(x))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ke(cm), children: "恢复列顺序" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: Yt, children: "恢复列宽" })
      ] }),
      q === "findings" && /* @__PURE__ */ s.jsx("p", { className: "muted history-drag-tip", children: "提示：拖动表头调整列顺序；点击表头右侧 × 可隐藏该列（全部列均可隐藏，在“显示字段”中恢复）；点击任意行展开该条全部字段与关联照片。" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      q === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        K.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              K.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: de, onClick: () => it(We.length === us.length ? [] : us), children: We.length === us.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: de || !We.length, onClick: () => void bt(We), children: [
                "批量确认所选（",
                We.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: de || !We.length, onClick: () => void m(We), children: "放弃所选" })
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
            /* @__PURE__ */ s.jsx("tbody", { children: K.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: We.includes(x.id), onChange: (R) => it(R.target.checked ? [...We, x.id] : We.filter((Ge) => Ge !== x.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Kt(x.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Kt(x.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Gf(x.changes, he) }),
              /* @__PURE__ */ s.jsx("td", { children: x.updated_at ? new Date(x.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, x.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap history-table-wrap" + (ae ? " history-resizing" : ""), "aria-busy": ut, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", style: { width: "100%" }, children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: Be.map((x) => /* @__PURE__ */ s.jsx(
            "th",
            {
              draggable: !0,
              "data-col": x,
              style: { width: be(x) },
              className: "history-col-head" + (Ae === x ? " history-col-dragging" : "") + (Ve === x ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (R) => {
                if (ve.current) {
                  R.preventDefault();
                  return;
                }
                Le(x), R.dataTransfer.effectAllowed = "move", R.dataTransfer.setData("text/plain", x);
              },
              onDragOver: (R) => {
                R.preventDefault(), R.dataTransfer.dropEffect = "move", Ve !== x && Ye(x);
              },
              onDragLeave: () => Ye(""),
              onDrop: (R) => {
                R.preventDefault(), ht(Ae || R.dataTransfer.getData("text/plain"), x), Le(""), Ye("");
              },
              onDragEnd: () => {
                Le(""), Ye("");
              },
              children: /* @__PURE__ */ s.jsxs("span", { className: "history-th", children: [
                /* @__PURE__ */ s.jsx("span", { className: "history-th-label", children: Il(he, x) }),
                /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-col-hide", title: "点击隐藏该列（可在“显示字段”中恢复）", "aria-label": `隐藏${Il(he, x)}列`, draggable: !1, onMouseDown: (R) => R.stopPropagation(), onDragStart: (R) => R.preventDefault(), onClick: (R) => {
                  R.stopPropagation(), N(x);
                }, children: "×" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-col-resize", role: "separator", "aria-orientation": "vertical", "aria-label": "拖动调节列宽（双击恢复该列默认宽度）", title: "拖动调节列宽；双击恢复该列默认宽度", onPointerDown: (R) => Tt(R, x), onDoubleClick: (R) => {
                  R.preventDefault(), R.stopPropagation(), Lt(x);
                }, onDragStart: (R) => R.preventDefault() })
              ] })
            },
            x
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            A.map((x) => {
              const R = at.has(x.id);
              return /* @__PURE__ */ s.jsxs(r.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (x.draft_id ? "history-dirty" : "") + " history-row", onClick: (Ge) => {
                  Ge.target.closest("button, a, input, textarea, select, summary") || _t(x.id);
                }, children: (() => {
                  const Ge = [];
                  for (let At = 0; At < Be.length; At += 1) {
                    const tt = Be[At];
                    if (tt === "_actions") {
                      Ge.push(/* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                        /* @__PURE__ */ s.jsx("button", { className: "button secondary icon-button", title: "编辑", "aria-label": "编辑", onClick: () => we(x), children: /* @__PURE__ */ s.jsx(xv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: "查看证据", "aria-label": "查看证据", onClick: () => void Oe(x), children: /* @__PURE__ */ s.jsx(dv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: R ? "收起" : "展开", "aria-label": R ? "收起" : "展开", onClick: () => _t(x.id), children: R ? /* @__PURE__ */ s.jsx($j, { size: 15 }) : /* @__PURE__ */ s.jsx(Vj, { size: 15 }) })
                      ] }, tt));
                      continue;
                    }
                    if (tt === "_photos") {
                      Ge.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: x.image_count ? /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => w(x), children: [
                        "查看 ",
                        x.image_count,
                        " 张"
                      ] }) : /* @__PURE__ */ s.jsx("span", { className: "muted", children: "—" }) }, tt));
                      continue;
                    }
                    if (tt === "_source") {
                      Ge.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: x.original_name || "", children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (cl) => {
                        cl.stopPropagation(), Ce(x.document_id);
                      }, children: Kt(x.original_name, 26) }) }, tt));
                      continue;
                    }
                    if (tt === "_status") {
                      Ge.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: x.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Kt(x.review_state, 14) }, tt));
                      continue;
                    }
                    const Ut = x[tt];
                    if (!Ut || !String(Ut).trim()) {
                      let cl = 1, Ts = At + 1;
                      for (; Ts < Be.length; ) {
                        const Ms = Be[Ts];
                        if (lc.includes(Ms)) break;
                        const es = x[Ms];
                        if (es && String(es).trim()) break;
                        cl += 1, Ts += 1;
                      }
                      Ge.push(/* @__PURE__ */ s.jsx("td", { colSpan: cl, className: "history-cell history-cell-merged", title: "该行连续空字段合并显示", children: "—" }, tt)), At = Ts - 1;
                      continue;
                    }
                    const is = tt === "problem_description", Pl = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "source_category", "source_grade", "hazard_category"].includes(tt);
                    Ge.push(/* @__PURE__ */ s.jsx("td", { title: Ut || "", className: is ? "history-cell history-cell-wrap" : Pl ? "history-cell history-cell-nowrap" : "history-cell", children: is ? Ut : Kt(Ut, 80) }, tt));
                  }
                  return Ge;
                })() }),
                R && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: Be.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: he.map((Ge) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: Ge.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: x[Ge.key] || "—" })
                  ] }, Ge.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (Ge) => {
                      Ge.stopPropagation(), Ce(x.document_id);
                    }, children: Kt(x.original_name, 100) }),
                    "｜状态：",
                    Kt(x.review_state, 20),
                    x.draft_id ? "｜有待确认修改" : ""
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "history-expanded-photos", children: [
                    /* @__PURE__ */ s.jsxs("h4", { children: [
                      "关联照片（",
                      x.image_count ?? 0,
                      "）"
                    ] }),
                    /* @__PURE__ */ s.jsx(Xf, { api: u, findingId: x.id })
                  ] })
                ] }) })
              ] }, x.id);
            }),
            !A.length && !ut && !qe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: Be.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagesize", children: [
          "每页显示",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "每页显示条数", value: F, onChange: (x) => {
            const R = Number(x.target.value);
            Te(R), I(0);
            try {
              localStorage.setItem(am, String(R));
            } catch {
            }
          }, children: nm.map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: x }, x)) }),
          "条"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: $ === 0, onClick: () => I(Math.max(0, $ - F)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            Math.floor($ / F) + 1,
            " 页 · 本页 ",
            A.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !ce, onClick: () => I($ + F), children: "下一页" })
        ] })
      ] }),
      q === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": ut, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          Gt.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: Kt(x.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(x.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(x.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: x.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                Q(x.document_id), V("findings"), I(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ce(x.document_id), children: "浏览报告" })
            ] })
          ] }, x.document_id)),
          !Gt.length && !ut && !qe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      q === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": ut, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" }),
          /* @__PURE__ */ s.jsx("th", { children: "报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作人" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          se.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: new Date(x.created_at).toLocaleString("zh-CN") }),
            /* @__PURE__ */ s.jsx("td", { children: Tv[x.action] || x.action }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(x.original_name, 28) || Kt(x.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Gf(x.changes, he) }),
            /* @__PURE__ */ s.jsx("td", { children: Kt(x.actor, 30) })
          ] }, x.id)),
          !se.length && !ut && !qe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    ye && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          He(null), xe(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Kt(ye.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: _u.map((x) => /* @__PURE__ */ s.jsxs("label", { className: x === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Il(he, x) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: x === "problem_description" ? 3 : 2, value: lt[x] || "", onChange: (R) => nt({ ...lt, [x]: R.target.value }) })
      ] }, x)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: de, onClick: () => void rt(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => He(null), children: "取消" })
      ] }),
      Ze && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void et(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: pe.map((x) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: x.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Ze.fields[x.key] || "—" })
        ] }, x.key)) }),
        Ze.evidence.map((x, R) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Il(he, x.field_key),
            "：",
            Kt(x.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: x.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(x.locator)
          ] })
        ] }, R)),
        Ze.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            Ze.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Ze.images.map((x, R) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(Cu, { id: x.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(x.locator) })
          ] }, x.id + ":" + R)) })
        ] })
      ] })
    ] }),
    Ze && !ye && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => xe(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (x) => x.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Ze.original_name }),
            "｜解析版本时间：",
            new Date(Ze.parsed_at).toLocaleString("zh-CN")
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => xe(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void et(), children: "下载原报告" }),
        Ze.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: Ze.sources.map((x) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void et(x), children: x.original_name }) }, x.document_id)) })
        ] }),
        dt && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: dt }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: pe.map((x) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: x.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Ze.fields[x.key] || "—" })
        ] }, x.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        Ze.evidence.map((x, R) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Il(he, x.field_key),
            "：",
            Kt(x.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: x.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(x.locator)
          ] })
        ] }, R)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          Ze.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Ze.images.map((x, R) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(Cu, { id: x.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(x.locator) })
        ] }, x.id + ":" + R)) })
      ] })
    ] }) }),
    E && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "关联照片", onClick: () => w(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal history-photo-modal", onClick: (x) => x.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "关联照片" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Kt(E.original_name, 90) }),
            "｜问题：",
            Kt(E.problem_description, 90)
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => w(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-modal-body", children: /* @__PURE__ */ s.jsx(Xf, { api: u, findingId: E.id, large: !0 }) })
    ] }) })
  ] });
}
function qt(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((_) => ["admin", "reviewer"].includes(_)) : h === "training.manage" ? u.roles.some((_) => ["admin", "teacher"].includes(_)) : h === "training.review" ? u.roles.some((_) => ["admin", "teacher", "reviewer"].includes(_)) : !0 : !1;
}
const il = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Qf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Zf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function Nu(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((o) => o.text).join(`
`), h.facts.map((o) => o.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((o) => o.evidence_ids).join("、"), h.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, o, T]) => o !== T);
}
function qv({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var M;
  const [q, V] = r.useState(!0), [A, G] = r.useState(!1), [v, U] = r.useState(""), [K, k] = r.useState(""), [se, je] = r.useState(0), [Ne, Se] = r.useState([]), [Ee, me] = r.useState([]), [P, ue] = r.useState([]), [ae, B] = r.useState("knowledge_revision"), [ve, Ae] = r.useState(""), [Le, Ve] = r.useState(""), [Ye, ge] = r.useState(""), [Pe, X] = r.useState(null), [oe, b] = r.useState([]), [Q, le] = r.useState(null), [ke, f] = r.useState("resolved"), [Y, $] = r.useState(""), [I, ce] = r.useState(""), [Z, F] = r.useState(((M = o.find((j) => qt(j, "knowledge.process"))) == null ? void 0 : M.id) || ""), [Te, ne] = r.useState([]), [ze, We] = r.useState([]), [it, at] = r.useState("case_card"), [$e, Re] = r.useState("normal"), [Ue, ye] = r.useState(null), [He, lt] = r.useState(sessionStorage.getItem("b03-last-job-" + T) || ""), [nt, Ze] = r.useState(null), [xe, dt] = r.useState(null), [De, E] = r.useState(null), [w, ee] = r.useState(""), [_e, qe] = r.useState(!1), Qe = /^\/knowledge\/[^/]+\/edit$/.test(h), ut = o.some((j) => qt(j, "knowledge.process")), L = o.some((j) => qt(j, "knowledge.review")), de = h.startsWith("/quality"), ie = h === "/reviews";
  r.useEffect(() => {
    ge(""), b([]), Ve(""), Ae(""), U(""), k(""), qe(!1), ee("");
  }, [h]), r.useEffect(() => {
    let j = !1;
    V(!0), U(""), dt(null), E(null);
    async function re() {
      try {
        if (de) {
          const be = await u(`/quality/issues?limit=20${ve ? "&rule_code=" + ve : ""}${Le ? "&status=" + Le : ""}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (j) return;
          me(be.items), ue(be.summary), X(be.next_cursor);
        } else if (Qe) {
          const be = await u(h.replace("/edit", ""));
          if (j) return;
          dt(be), E(structuredClone(be.content));
        } else if (ie) {
          const be = await u(`/reviews?object_type=${ae}&state=${Le || "pending_review"}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (j) return;
          Se(be.items), X(be.next_cursor);
        } else {
          const be = await u(`/knowledge?limit=20${Le ? "&state=" + Le : ""}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (j) return;
          if (Se(be.items), X(be.next_cursor), ut && Z) {
            const ct = await u("/knowledge/source-options?project_id=" + Z);
            j || ne(ct.items);
          }
        }
      } catch (be) {
        j || U(be.message);
      } finally {
        j || V(!1);
      }
    }
    return re(), () => {
      j = !0;
    };
  }, [h, Le, ve, Ye, se, Z, ae]), r.useEffect(() => {
    We([]), ye(null);
  }, [Z, it, $e]), r.useEffect(() => {
    if (!He || de || Qe || ie || !ut) return;
    let j = !1;
    const re = () => {
      u("/knowledge/generation-jobs/" + He).then((ct) => {
        j || (Ze(ct), ct.status === "succeeded" && je((N) => N + 1));
      }).catch((ct) => {
        j || U(ct.message);
      });
    };
    re();
    const be = setInterval(() => {
      (!nt || ["queued", "running", "retrying"].includes(nt.status)) && re();
    }, 1800);
    return () => {
      j = !0, clearInterval(be);
    };
  }, [He, h, nt == null ? void 0 : nt.status]);
  const Je = async (j) => {
    G(!0), U(""), k("");
    try {
      await j();
    } catch (re) {
      U(re.message);
    } finally {
      G(!1);
    }
  }, y = () => ({ record_version_ids: ze, type: it, template_version: "mock-v1", mock_scenario: $e }), he = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !oe.length, onClick: () => {
        ge(oe.at(-1) || ""), b(oe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Pe, onClick: () => {
        b([...oe, Ye]), ge(Pe || "");
      }, children: "下一页" })
    ] })
  ] }), pe = xe && qt(o.find((j) => j.id === xe.project_id), "knowledge.process"), Be = xe && qt(o.find((j) => j.id === xe.project_id), "knowledge.review"), gt = (j) => Je(async () => {
    if (!xe) return;
    const re = j === "submit" ? `/knowledge/${xe.id}/submit-review` : `/reviews/${xe.revision_id}/${j}`;
    await u(re, { method: "POST", body: JSON.stringify({ row_version: xe.row_version, revision_id: xe.revision_id, reason: w, evidence_checked: _e }) }), k(j === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), je((be) => be + 1), qe(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Bn, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    v && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      v,
      /* @__PURE__ */ s.jsx("button", { onClick: () => je((j) => j + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: de ? "selected" : "", onClick: () => _("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !de && !ie ? "selected" : "", onClick: () => _("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ie ? "selected" : "", onClick: () => _("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: q, onClick: () => je((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    q ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : de ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Qf).map(([j, re]) => /* @__PURE__ */ s.jsxs("button", { className: ve === j ? "panel selected-quality" : "panel", "aria-pressed": ve === j, onClick: () => {
        Ae(ve === j ? "" : j), Ve("open"), ge(""), b([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: re }),
        /* @__PURE__ */ s.jsx("strong", { children: P.filter((be) => be.rule_code === j && be.status === "open").reduce((be, ct) => be + ct.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, j)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Le, onChange: (j) => {
            Ve(j.target.value), ge(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: il[j] }, j))
          ] })
        ] }),
        Ee.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ee.map((j) => {
            var re, be;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + j.record_id), children: j.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Qf[j.rule_code] || j.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                j.message,
                j.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (re = j.annotations.at(-1)) == null ? void 0 : re.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: il[j.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((be = o.find((ct) => ct.id === j.project_id)) != null && be.can_run), onClick: () => {
                le(j), $(""), ce("");
              }, children: "核查处理" }) })
            ] }, j.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        he
      ] })
    ] }) : Qe && xe && De ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Zf[xe.type],
            " · v",
            xe.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            il[xe.state],
            " · 生成适配器：",
            xe.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      xe.source.version !== xe.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        xe.source.version,
        "更新到v",
        xe.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _((xe.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + xe.source.record_id), children: xe.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              xe.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(xe.source.raw_fields.description || xe.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(xe.source.effective_fields.description || "缺失") }),
            xe.source.versions && xe.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                xe.source.versions.length,
                "条）"
              ] }),
              xe.source.versions.map((j) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  j.version,
                  " · ",
                  j.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + j.record_id), children: "打开风险记录" })
              ] }, j.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              De.project_name,
              " · ",
              De.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            xe.source.evidence.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[j.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: j.id })
            ] }, j.id)),
            xe.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              xe.source.annotations.map((j, re) => /* @__PURE__ */ s.jsxs("p", { children: [
                j.reason,
                " · ",
                JSON.stringify(j.value)
              ] }, re))
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
              /* @__PURE__ */ s.jsx("input", { value: De.title, disabled: !pe, onChange: (j) => E({ ...De, title: j.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            De.facts.map((j, re) => /* @__PURE__ */ s.jsxs("label", { children: [
              j.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.text, onChange: (be) => E({ ...De, facts: De.facts.map((ct, N) => N === re ? { ...ct, text: be.target.value, source_kind: "human_annotation" } : ct) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                j.evidence_ids.join("、")
              ] })
            ] }, re)),
            De.construction_points && De.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                De.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: De.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              De.construction_points.map((j, re) => {
                var be;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    j.title,
                    " · ",
                    j.stage === "preparation" ? "施工准备" : j.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.content, onChange: (ct) => {
                      var N;
                      return E({ ...De, construction_points: (N = De.construction_points) == null ? void 0 : N.map((fe, Ke) => Ke === re ? { ...fe, content: ct.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.inspection_method, onChange: (ct) => {
                      var N;
                      return E({ ...De, construction_points: (N = De.construction_points) == null ? void 0 : N.map((fe, Ke) => Ke === re ? { ...fe, inspection_method: ct.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: j.common_mistakes, onChange: (ct) => {
                      var N;
                      return E({ ...De, construction_points: (N = De.construction_points) == null ? void 0 : N.map((fe, Ke) => Ke === re ? { ...fe, common_mistakes: ct.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: j.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    j.evidence_ids.join("、")
                  ] }),
                  (be = j.source_quotes) == null ? void 0 : be.map((ct, N) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: ct.text })
                  ] }, N))
                ] }, re);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !pe, value: De.suggestions.join(`
`), onChange: (j) => E({ ...De, suggestions: j.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            De.standards.length ? De.standards.map((j, re) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: j.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                j.clause || "未提供",
                " · 版本：",
                j.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: j.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !pe, checked: j.verification_status === "not_used", onChange: (be) => E({ ...De, standards: De.standards.map((ct, N) => N === re ? { ...ct, verification_status: be.target.checked ? "not_used" : "pending_verification" } : ct) }) }),
                "明确不采用该依据"
              ] })
            ] }, re)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            Nu(xe.content, De).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              Nu(xe.content, De).map(([j, re, be]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: j }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  re
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  be
                ] })
              ] }, j))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (j) => ee(j.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              pe && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A || !w.trim(), onClick: () => void Je(async () => {
                await u(`/knowledge/${xe.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: xe.row_version, revision_id: xe.revision_id, content: De, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), je((j) => j + 1);
              }), children: "保存新草稿版本" }),
              pe && ["draft", "changes_requested"].includes(xe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !w.trim() || JSON.stringify(De) !== JSON.stringify(xe.content), onClick: () => void gt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Be && xe.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e, onChange: (j) => qe(j.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !_e || !w.trim() || JSON.stringify(De) !== JSON.stringify(xe.content), onClick: () => void gt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: A || !w.trim(), onClick: () => void gt("request-changes"), children: "退回修改" })
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
        xe.revisions.map((j, re) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            j.version,
            " · ",
            il[j.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            j.content.facts.map((be) => be.text).join("；")
          ] }),
          xe.revisions[re + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              xe.revisions[re + 1].version,
              "的修改："
            ] }),
            Nu(xe.revisions[re + 1].content, j.content).map(([be, ct, N]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                ct
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                N
              ] })
            ] }, be))
          ] })
        ] }, j.id)),
        xe.review_actions.map((j, re) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            j.version,
            " · ",
            il[j.action] || j.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(j.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            j.reviewer.slice(0, 8)
          ] })
        ] }, re))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ie && ut && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Z, onChange: (j) => F(j.target.value), children: o.filter((j) => qt(j, "knowledge.process")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: it, onChange: (j) => at(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            We(Te.slice(0, 20).map((j) => j.record_version_id)), ye(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Te.length ? Te.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ze.includes(j.record_version_id), onChange: (re) => {
              We(re.target.checked ? [...ze, j.record_version_id] : ze.filter((be) => be !== j.record_version_id)), ye(null);
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
              /* @__PURE__ */ s.jsxs("select", { value: $e, onChange: (j) => Re(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: A || !ze.length || ze.length > 20, onClick: () => void Je(async () => {
              ye(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(y()) }));
            }), children: [
              "预览生成范围（",
              ze.length,
              "条）"
            ] }),
            Ue && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: A, onClick: () => void Je(async () => {
              const j = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(y()) });
              Ze(null), lt(j.job_id), sessionStorage.setItem("b03-last-job-" + T, j.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              Ue.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(zl, { size: 15 })
            ] })
          ] }),
          Ue && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: Ue.items.map((j, re) => /* @__PURE__ */ s.jsxs("p", { children: [
            j.description,
            " · 来源问题 ",
            j.quality_issue_count,
            "项"
          ] }, re)) }),
          nt && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              nt.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              nt.counts.created,
              " · 复用 ",
              nt.counts.skipped,
              " · 单项失败 ",
              nt.counts.failed
            ] }),
            nt.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: nt.error }),
            nt.items.map((j, re) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.error || il[j.outcome],
              " ",
              j.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + j.item_id + "/edit"), children: "打开知识卡" })
            ] }, re)),
            nt.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: A, onClick: () => void Je(async () => {
              await u("/jobs/" + nt.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: nt.row_version }) }), Ze(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ie ? "审核待办" : "知识候选列表" }),
          ie && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ae, onChange: (j) => {
            B(j.target.value), ge(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Le, onChange: (j) => {
            Ve(j.target.value), ge(""), b([]);
          }, children: [
            !ie && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ie ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: il[j] }, j))
          ] })
        ] }),
        ie && !L ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : Ne.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ne.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.title }),
            /* @__PURE__ */ s.jsx("td", { children: Zf[j.type] }),
            /* @__PURE__ */ s.jsx("td", { children: il[j.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _(j.object_type === "question_revision" ? "/training/questions/" + j.id : j.object_type === "retrospective_revision" ? "/retrospectives/" + j.id + "/review" : "/knowledge/" + j.id + "/edit"), children: ie ? "打开审核" : "核查与编辑" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ie ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        he
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
        /* @__PURE__ */ s.jsx("select", { value: ke, onChange: (j) => f(j.target.value), children: ["resolved", "ignored", "open"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: il[j] }, j)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: Y, onChange: (j) => $(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: I, onChange: (j) => ce(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: A || !Y.trim(), onClick: () => void Je(async () => {
        await u("/quality/issues/" + Q.id, { method: "PATCH", body: JSON.stringify({ row_version: Q.row_version, status: ke, reason: Y, annotation: I || null }) }), le(null), je((j) => j + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Vf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Hv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", Bv = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", Su = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function Lv({ identity: u, path: h, projects: _, navigate: o }) {
  var de, ie, Je, y, he, pe, Be, gt;
  const [T, q] = r.useState(((de = _[0]) == null ? void 0 : de.id) || ""), [V, A] = r.useState("generic"), [G, v] = r.useState(""), [U, K] = r.useState([]), [k, se] = r.useState({}), [je, Ne] = r.useState([]), [Se, Ee] = r.useState([]), [me, P] = r.useState("mock-hash-64"), [ue, ae] = r.useState([]), [B, ve] = r.useState(null), [Ae, Le] = r.useState(""), [Ve, Ye] = r.useState("extractive"), [ge, Pe] = r.useState(null), [X, oe] = r.useState(null), [b, Q] = r.useState(null);
  r.useEffect(() => () => {
    b && URL.revokeObjectURL(b);
  }, [b]), r.useEffect(() => {
    Q(null);
  }, [T, h]);
  const [le, ke] = r.useState(null);
  r.useEffect(() => {
    ke(null);
  }, [h]);
  const [f, Y] = r.useState(""), [$, I] = r.useState("useful"), [ce, Z] = r.useState(""), [F, Te] = r.useState(!1), [ne, ze] = r.useState(!0), [We, it] = r.useState(""), [at, $e] = r.useState(""), [Re, Ue] = r.useState(0), [ye, He] = r.useState(""), [lt, nt] = r.useState(null), [Ze, xe] = r.useState([]), dt = r.useRef("");
  dt.current = [u, h, T, V, G, Ae, Ve, le].join("|");
  const De = h === "/releases", E = h === "/search", w = h === "/knowledge/library", ee = qt(_.find((M) => M.id === T), "knowledge.publish"), _e = !De && !E && !w ? h.split("/")[2] : null;
  async function qe(M, j = {}) {
    const re = await Zt("/api/v1" + M, { ...j, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...j.headers } }), be = await re.json();
    if (!re.ok) throw new Error(be.message || "请求失败，请重试。");
    return be;
  }
  r.useEffect(() => {
    Ee([]), Pe(null), oe(null), it(""), $e(""), He(""), xe([]);
  }, [T, h, V, G]), r.useEffect(() => {
    let M = !1;
    return ze(!0), it(""), ve(null), (async () => {
      try {
        if (De) {
          const re = await qe(`/releases?project_id=${T}${ye ? "&cursor=" + encodeURIComponent(ye) : ""}`);
          if (M) return;
          K(re.items), se(re.active_ids), nt(re.next_cursor);
          const be = await qe("/releases/options?project_id=" + T);
          M || Ne(be.items);
        } else if (w) {
          const re = await qe(`/knowledge/library?project_id=${T}${V ? "&scene_code=" + V : ""}${G ? "&card_type=" + G : ""}${ye ? "&after_id=" + ye : ""}`);
          M || (ae(re.items), nt(re.next_cursor));
        } else if (_e) {
          const re = await qe("/published/knowledge/" + _e + (le ? "?revision_id=" + le : ""));
          M || ve(re);
        }
      } catch (re) {
        M || it(re.message);
      } finally {
        M || ze(!1);
      }
    })(), () => {
      M = !0;
    };
  }, [T, h, V, G, Re, ye, le]), r.useEffect(() => {
    if (!De || !U.some((j) => ["queued", "building"].includes(j.state))) return;
    const M = setInterval(() => Ue((j) => j + 1), 1800);
    return () => clearInterval(M);
  }, [De, U]);
  const Qe = async (M) => {
    Te(!0), it(""), $e("");
    try {
      await M();
    } catch (j) {
      it(j.message);
    } finally {
      Te(!1);
    }
  }, ut = (M, j, re = !1) => Qe(async () => {
    const be = dt.current;
    Q(null), oe(null);
    const ct = await qe("/published/evidence/" + M + "?revision_id=" + j + (re ? "&historical=true" : ""));
    if (be === dt.current && (oe(ct), ct.has_image)) {
      const N = await Zt("/api/v1/published/evidence/" + M + "/content?revision_id=" + j + (re ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!N.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const fe = await N.blob();
      be === dt.current && Q(URL.createObjectURL(fe));
    }
  }), L = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ze.length || ne, onClick: () => {
        He(Ze.at(-1) || ""), xe(Ze.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !lt || ne, onClick: () => {
        xe([...Ze, ye]), He(lt || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(nc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || _e ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: E ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        _.some((M) => qt(M, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: De ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        oe(null), Pe(null), Ue((M) => M + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    We && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      We
    ] }),
    at && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      at
    ] }),
    !_e && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: T, onChange: (M) => q(M.target.value), children: _.map((M) => /* @__PURE__ */ s.jsx("option", { value: M.id, children: M.name }, M.id)) })
      ] }),
      !De && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: G, onChange: (M) => v(M.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : De ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      ee && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: je.length ? je.map((M) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se.includes(M.revision_id), onChange: (j) => Ee(j.target.checked ? [...Se, M.revision_id] : Se.filter((re) => re !== M.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: M.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              Su(M.type),
              " · 审核版本 v",
              M.version
            ] })
          ] })
        ] }, M.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: me, onChange: (M) => P(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: F || !Se.length, onClick: () => void Qe(async () => {
            await qe("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: T, revision_ids: Se, embedding_model: me }) }), Ee([]), $e("发布集合已固定，处理服务正在构建索引。"), Ue((M) => M + 1);
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
        U.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: U.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Vf[M.state] || M.state }),
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
              ["ready", "inactive"].includes(M.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: F, onClick: () => void Qe(async () => {
                await qe("/releases/" + M.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: M.row_version, expected_active_id: k[T] || null }) }), $e("发布已启用，知识库与检索使用同一发布集合。"), Ue((j) => j + 1);
              }), children: "启用发布" }),
              M.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: F, onClick: () => void Qe(async () => {
                await qe("/jobs/" + M.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: M.job_row_version }) }), Ue((j) => j + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          M.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: M.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            M.entries.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.revision_id.slice(0, 8),
              " · ",
              Vf[j.state] || j.state,
              j.error ? " · " + j.error : ""
            ] }, j.revision_id))
          ] })
        ] }, M.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
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
      ue.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: ue.map((M) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          Su(M.type),
          " · v",
          M.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: M.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + M.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(lv, { size: 15 })
        ] })
      ] }, M.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(nc, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      L
    ] }) : E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (M) => {
        M.preventDefault(), Qe(async () => {
          const j = dt.current;
          Pe(null), oe(null);
          const re = await qe("/search", { method: "POST", body: JSON.stringify({ project_id: T, question: Ae, scene_code: V, card_type: G || null, answer_mode: Ve }) });
          j === dt.current && Pe(re);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Ae, onChange: (M) => {
          Le(M.target.value), Pe(null), oe(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Ve, onChange: (M) => {
              Ye(M.target.value), Pe(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: F || !Ae.trim(), children: [
            /* @__PURE__ */ s.jsx(yv, { size: 17 }),
            F ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      ge && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ge.status === "answered" ? "找到有据内容" : ge.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            ge.latency_ms,
            " ms · ",
            ge.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          ge.answer_blocks.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M.text }, j)),
          ge.missing_conditions.map((M) => /* @__PURE__ */ s.jsx("p", { children: M }, M)),
          ge.warnings.map((M) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: M.message }, M.code))
        ] }),
        ge.results.map((M, j) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            j + 1,
            " · ",
            M.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + M.id), children: M.title }),
          /* @__PURE__ */ s.jsx("p", { children: M.text }),
          /* @__PURE__ */ s.jsx("div", { children: ge.citations.filter((re) => M.citation_ids.includes(re.citation_id)).map((re) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: F, onClick: () => void ut(re.evidence_id, re.knowledge_revision_id), children: [
            "打开来源：",
            re.source_title
          ] }, re.citation_id)) })
        ] }, M.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (M) => {
          M.preventDefault(), Qe(async () => {
            await qe("/search/" + ge.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: $, comment: ce }) }), $e("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: $, onChange: (M) => I(M.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ce, maxLength: 1e3, onChange: (M) => Z(M.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: F, children: "保存反馈" })
        ] })
      ] })
    ] }) : B && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        B.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        Su(B.type),
        " · v",
        B.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: B.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ie = _.find((M) => M.id === B.project_id)) == null ? void 0 : ie.name) || B.project_id,
        " · ",
        Hv(B.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Je = B.content) == null ? void 0 : Je.facts.map((M, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: M.text }),
        /* @__PURE__ */ s.jsx("small", { children: M.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((re) => /* @__PURE__ */ s.jsx("button", { disabled: F, className: "citation-button", onClick: () => void ut(re, B.revision_id, B.is_current_release === !1), children: "打开来源证据" }, re)) })
      ] }, j)),
      ((y = B.content) == null ? void 0 : y.construction_points) && B.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          B.content.category_name || "通用"
        ] }),
        B.content.construction_points.map((M, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
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
          /* @__PURE__ */ s.jsx("div", { children: M.evidence_ids.map((re) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void ut(re, B.revision_id, B.is_current_release === !1), children: "核对要点来源" }, re)) })
        ] }, j))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((he = B.content) == null ? void 0 : he.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (pe = B.content) == null ? void 0 : pe.suggestions.map((M, j) => /* @__PURE__ */ s.jsx("p", { children: M }, j)),
      (Be = B.content) != null && Be.standards.length ? B.content.standards.map((M, j) => /* @__PURE__ */ s.jsxs("p", { children: [
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
          B.release_id
        ] }),
        (gt = B.versions) == null ? void 0 : gt.map((M) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          ke(M.id), oe(null);
        }, children: [
          "查看已发布 v",
          M.version
        ] }, M.id)),
        /* @__PURE__ */ s.jsx("p", { children: B.history_note })
      ] }),
      qt(_.find((M) => M.id === B.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: f, maxLength: 2e3, onChange: (M) => Y(M.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: F || !f.trim(), onClick: () => void Qe(async () => {
          await qe("/knowledge/" + B.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: B.row_version, reason: f }) }), ve(null), oe(null), $e("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    X && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          X.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => oe(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: X.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: X.description || "来源描述缺失" }),
        b && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: b, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          Bv(X.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: X.note })
      ] })
    ] })
  ] });
}
const qn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, rm = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, Eu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Yv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, Ou = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, Tu = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, Ln = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", Gv = (u) => JSON.stringify(u, null, 2), Xv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function Ma(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((_) => typeof _ != "object") ? u.join("、") : u.map((_, o) => `第${o + 1}条
${Ma(_)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([_, o]) => `${Xv[_] || Eu[_] || _}：${Ma(o, _)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return Ln(u);
    if (h === "actor_role" || h === "role") return Tu(u);
    if (h === "event_type") return rm[u] || u;
    if (h === "evidence_type") return Ou[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const Qv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? Gv(u) : "未补充说明";
};
function Zv({ identity: u, path: h, projects: _, navigate: o }) {
  var De, E, w, ee, _e, qe, Qe, ut, L, de, ie, Je;
  const T = h === "/task-packages/import", q = !T && h !== "/task-packages" ? h.split("/")[2] : null, [V, A] = r.useState(((De = _[0]) == null ? void 0 : De.id) || ""), [G, v] = r.useState(""), [U, K] = r.useState([]), [k, se] = r.useState(null), [je, Ne] = r.useState(""), [Se, Ee] = r.useState(null), [me, P] = r.useState([]), [ue, ae] = r.useState([]), [B, ve] = r.useState([]), [Ae, Le] = r.useState("complete"), [Ve, Ye] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [ge, Pe] = r.useState(""), [X, oe] = r.useState(null), [b, Q] = r.useState(""), [le, ke] = r.useState(""), [f, Y] = r.useState(!0), [$, I] = r.useState(!1), [ce, Z] = r.useState(0), [F, Te] = r.useState(""), [ne, ze] = r.useState(null), We = r.useRef(null), it = r.useRef(null), at = r.useRef("");
  at.current = [u, h, V, Ae, Ve, ge].join("|");
  const $e = _.some((y) => y.permissions != null), Re = !$e && qt(_.find((y) => y.id === V), "imports.create"), Ue = k && !$e && qt(_.find((y) => y.id === k.project_id), "imports.withdraw"), ye = k && !$e && qt(_.find((y) => y.id === k.project_id), "imports.create");
  async function He(y, he = {}) {
    const pe = await Zt("/api/v1/task-packages" + y, {
      ...he,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...he.headers }
    }), Be = await pe.json().catch(() => ({}));
    if (!pe.ok) throw new Error(Be.message || "接入服务暂未就绪，请稍后刷新。");
    return Be;
  }
  const lt = async (y) => {
    I(!0), Q(""), ke("");
    try {
      await y();
    } catch (he) {
      Q(he.message);
    } finally {
      I(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + u, Ve);
  }, [Ve, u]), r.useEffect(() => () => {
    ne != null && ne.url && URL.revokeObjectURL(ne.url);
  }, [ne == null ? void 0 : ne.url]), r.useEffect(() => {
    Ne(""), P([]), Q(""), ke(""), ze(null), Te(""), oe(null);
  }, [h, V, G]), r.useEffect(() => {
    let y = !1;
    return Y(!0), se(null), Q(""), (async () => {
      try {
        if (T && Rt) {
          const pe = await Zt("/api/v1/platform-archives"), Be = await pe.json();
          if (!pe.ok) throw new Error(Be.message);
          y || ae(Be.items);
        } else if (T) {
          const pe = await He("/samples");
          y || ve(pe.items);
        } else if (q) {
          const pe = await He("/" + q);
          y || se(pe);
        } else {
          const pe = await He(`?project_id=${V}${G ? "&state=" + G : ""}${je ? "&cursor=" + encodeURIComponent(je) : ""}`);
          y || (K(pe.items), Ee(pe.next_cursor));
        }
      } catch (pe) {
        y || Q(pe.message);
      } finally {
        y || Y(!1);
      }
    })(), () => {
      y = !0;
    };
  }, [h, V, G, je, ce]), r.useEffect(() => {
    if (Rt || !T || !Re) return;
    let y = !1;
    oe(null), Pe("");
    const he = Ve + "." + (Ae === "v2" ? "complete" : Ae);
    return He(`/samples/${Ae}?project_id=${V}&task_id=${he}`).then((pe) => {
      y || Pe(JSON.stringify(pe, null, 2));
    }).catch((pe) => {
      y || Q(pe.message);
    }), () => {
      y = !0;
    };
  }, [T, V, Ae, Ve]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !q && U.some((pe) => ["received", "validating", "processing"].includes(pe.status))) || T) return;
    const he = setInterval(() => Z((pe) => pe + 1), 1800);
    return () => clearInterval(he);
  }, [k == null ? void 0 : k.status, U, h]);
  const nt = () => lt(async () => {
    const y = at.current;
    oe(null);
    const he = await He("/preview", { method: "POST", body: ge });
    at.current === y && oe(he);
  }), Ze = () => lt(async () => {
    var he;
    if (!X) return;
    ((he = We.current) == null ? void 0 : he.hash) !== X.content_hash && (We.current = { hash: X.content_hash, key: crypto.randomUUID() });
    const y = await He("", { method: "POST", headers: { "Idempotency-Key": We.current.key }, body: ge });
    ke(y.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + y.receipt_id);
  }), xe = (y) => lt(async () => {
    const he = at.current;
    ze(null);
    const pe = await Zt(`/api/v1/task-packages/${q}/assets/${y.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!pe.ok) {
      const gt = await pe.json().catch(() => ({}));
      throw new Error(gt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Be = await pe.blob();
    if (he === at.current)
      if (y.mime_type.startsWith("text/")) {
        const gt = await Be.slice(0, 1e6).text();
        he === at.current && ze({ id: y.attachment_id, url: null, text: gt });
      } else if (y.mime_type.startsWith("image/")) ze({ id: y.attachment_id, url: URL.createObjectURL(Be), text: null });
      else {
        const gt = URL.createObjectURL(Be), M = document.createElement("a");
        M.href = gt, M.download = "任务附件", M.click(), URL.revokeObjectURL(gt);
      }
  }), dt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !me.length || f, onClick: () => {
        Ne(me.at(-1) || ""), P(me.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Se || f, onClick: () => {
        P([...me, je]), Ne(Se || "");
      }, children: "下一页" })
    ] })
  ] });
  return _.length ? $e && T ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Uf, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: $e ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: T ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !$e && _.some((y) => qt(y, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        ze(null), Z((y) => y + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    b && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      b
    ] }),
    le && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      le
    ] }),
    !q && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (y) => A(y.target.value), children: _.map((y) => /* @__PURE__ */ s.jsx("option", { value: y.id, children: y.name }, y.id)) })
      ] }),
      !T && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: G, onChange: (y) => v(y.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((y) => /* @__PURE__ */ s.jsx("option", { value: y, children: qn[y] }, y))
        ] })
      ] })
    ] }),
    f ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : T ? Re ? Rt ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        ue.filter((y) => y.project_id === V).map((y) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            y.title,
            " · 第",
            y.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: $, onClick: () => void lt(async () => {
            const he = await Zt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: y.id }) }), pe = await he.json();
            if (!he.ok) throw new Error(pe.message);
            o("/task-packages/" + pe.receipt_id);
          }), children: "接入此成果" })
        ] }, y.id)),
        !ue.some((y) => y.project_id === V) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Ae, onChange: (y) => Le(y.target.value), children: B.map((y) => /* @__PURE__ */ s.jsx("option", { value: y.id, children: y.label }, y.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $, onClick: () => Ye("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: $, onChange: (y) => {
              var pe;
              const he = (pe = y.target.files) == null ? void 0 : pe[0];
              if (he) {
                if (he.size > 5242880) {
                  Q("文件超过5MiB上限。");
                  return;
                }
                he.text().then((Be) => {
                  Pe(Be), oe(null), Q("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: ge, onChange: (y) => {
              Pe(y.target.value), oe(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $ || !ge, onClick: () => void nt(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: $ || !X, onClick: () => void Ze(), children: [
              /* @__PURE__ */ s.jsx(tm, { size: 16 }),
              $ ? "正在处理…" : "确认接入归档成果"
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
          ((E = _.find((y) => y.id === X.project_id)) == null ? void 0 : E.name) || X.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(X.counts).map(([y, he]) => /* @__PURE__ */ s.jsxs("span", { children: [
          Eu[y],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: he })
        ] }, y)) }),
        /* @__PURE__ */ s.jsx("p", { children: X.note }),
        X.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : q ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: k.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((w = _.find((y) => y.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
              " · 第",
              k.package_version,
              "版 · ",
              qn[k.status],
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
        k.capabilities.map((y) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Yv[y] }, y)),
        k.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        ye && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: $, onClick: () => void lt(async () => {
          const y = await Zt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), he = await y.json();
          if (!y.ok) throw new Error(he.message);
          o("/retrospectives/" + he.id);
        }), children: "自动生成 / 更新复盘" })
      ] }),
      k.status === "withdrawn" ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "此任务包已撤回" }),
        /* @__PURE__ */ s.jsx("p", { children: "正文、事件、问题和附件已停止在线使用。" }),
        k.invalidations.map((y) => /* @__PURE__ */ s.jsxs("p", { children: [
          "下游失效通知：",
          y.state === "handled" ? "复盘、培训实时来源保护已生效" : y.state === "pending" ? "历史通知待标记；当前在线访问仍受来源保护" : y.state
        ] }, y.id))
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        (k.warnings.length > 0 || k.validation_errors.length > 0) && /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "校验结果与资料限制" }),
          k.validation_errors.map((y, he) => /* @__PURE__ */ s.jsx("p", { children: y.message }, "e" + he)),
          k.warnings.map((y, he) => /* @__PURE__ */ s.jsx("p", { children: y.message }, "w" + he))
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
            Ln((ee = k.task) == null ? void 0 : ee.started_at),
            "　结束：",
            Ln((_e = k.task) == null ? void 0 : _e.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((qe = k.participants) == null ? void 0 : qe.map((y) => Tu(y.role) + "（" + y.actor_id + "）").join("、")) || "未提供"
          ] }),
          (Qe = k.issues) == null ? void 0 : Qe.map((y) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: y.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              y.responsible_actor_id || "未提供",
              "　期限：",
              Ln(y.due_at)
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "整改：",
              y.rectification || "未提供"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "复核：",
              y.review_conclusion || "未提供"
            ] })
          ] }, y.issue_id))
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "过程事件与证据" }),
            /* @__PURE__ */ s.jsx("span", { children: "按A提供顺序展示，未知时间保持为空" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (ut = k.events) != null && ut.length ? k.events.map((y) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Ln(y.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: y.is_known ? rm[y.event_type] || y.event_type : "未知事件 · " + y.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Qv(y.payload) }),
              y.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                y.related_object_id === k.task_id ? "本次任务" : "问题 " + y.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Tu(y.actor.actor_role),
                " · ",
                y.actor.actor_id || "未提供人员"
              ] }),
              y.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                y.evidence_refs.map((he) => {
                  var Be;
                  const pe = (Be = k.attachments) == null ? void 0 : Be.find((gt) => gt.attachment_id === he);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: $ || !pe || pe.state !== "verified", onClick: () => pe && void xe(pe), children: [
                    pe ? Ou[pe.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    he
                  ] }, he);
                })
              ] })
            ] })
          ] }, y.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: $, onClick: () => void lt(async () => {
            const y = await He("/" + q + "?event_after=" + k.event_next);
            se({ ...y, events: [...k.events || [], ...y.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (L = k.attachments) != null && L.length ? k.attachments.map((y) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                Ou[y.evidence_type] || "未知类型",
                " · ",
                y.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                qn[y.state],
                " · ",
                y.size,
                " 字节 · 关联",
                y.event_ids.length,
                "个事件"
              ] }),
              y.error && /* @__PURE__ */ s.jsx("p", { children: y.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: $ || y.state !== "verified", onClick: () => void xe(y), children: "打开附件" })
          ] }, y.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ne && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ze(null), children: "关闭预览" }),
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
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (de = k.versions) == null ? void 0 : de.map((y) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: y.id === k.id, onClick: () => o("/task-packages/" + y.id), children: [
            "第",
            y.package_version,
            "版 · ",
            qn[y.state],
            y.is_current ? " · 当前使用" : ""
          ] }, y.id)) }),
          (ie = k.diff) != null && ie.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Je = k.diff) == null ? void 0 : Je.changes.map((y, he) => {
            var pe, Be, gt, M, j;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                Eu[y.section] || y.section,
                "有变化"
              ] }),
              "before" in y ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ma(y.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ma(y.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((pe = y.added) == null ? void 0 : pe.join("、")) || "无",
                  "；移除：",
                  ((Be = y.removed) == null ? void 0 : Be.join("、")) || "无"
                ] }),
                y.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (gt = y.before_order) == null ? void 0 : gt.join(" → "),
                  "　调整为　",
                  (M = y.after_order) == null ? void 0 : M.join(" → ")
                ] }),
                (j = y.changed) == null ? void 0 : j.map((re) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      re.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ma(re.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ma(re.after) })
                  ] })
                ] }, re.id))
              ] })
            ] }, he);
          })
        ] }),
        (Ue || ye && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          ye && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: $, onClick: () => void lt(async () => {
            const y = await Zt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!y.ok) throw new Error((await y.json()).message);
            ke("已提交重试，已保存事件与附件不会重复新增。"), Z((he) => he + 1);
          }), children: "重试接入" }),
          Ue && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: F, maxLength: 2e3, onChange: (y) => Te(y.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: $ || !F.trim(), onClick: () => void lt(async () => {
              var pe;
              const y = JSON.stringify({ reason: F }), he = k.id + y;
              ((pe = it.current) == null ? void 0 : pe.body) !== he && (it.current = { body: he, key: crypto.randomUUID() }), await He("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": it.current.key }, body: y }), ze(null), Z((Be) => Be + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      U.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ s.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ s.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: U.map((y) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/task-packages/" + y.id), children: y.name }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              y.producer,
              " · ",
              y.task_id
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            "第",
            y.package_version,
            "版",
            /* @__PURE__ */ s.jsxs("small", { children: [
              "最新接收：第",
              y.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: qn[y.status] }),
          /* @__PURE__ */ s.jsx("td", { children: y.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : y.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: y.status === "withdrawn" ? "正文与附件已停止使用" : y.missing_fields.length ? `${y.missing_fields.length} 项资料限制` : y.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, y.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Uf, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      dt
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function um(u, h, _, o) {
  const T = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(_) });
  o();
  const q = Date.now() + 1200 * 1e3;
  for (; Date.now() < q; ) {
    const V = await u("/model-generation-jobs/" + T.job_id);
    if (V.status === "succeeded") return V.result;
    if (V.status === "failed") throw new Error(V.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((A) => setTimeout(A, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Hn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Vv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Jv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Pi = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Kv({ api: u, path: h, navigate: _, projects: o, identity: T }) {
  var ut;
  const q = h.split("/")[2], V = h.endsWith("/review"), [A, G] = r.useState([]), [v, U] = r.useState(null), [K, k] = r.useState(null), [se, je] = r.useState(!1), [Ne, Se] = r.useState(!0), [Ee, me] = r.useState(""), [P, ue] = r.useState(""), [ae, B] = r.useState(0), [ve, Ae] = r.useState("llm"), [Le, Ve] = r.useState("task_process"), [Ye, ge] = r.useState(((ut = o.find((L) => qt(L, "retrospective.generate"))) == null ? void 0 : ut.id) || ""), [Pe, X] = r.useState([]), [oe, b] = r.useState(""), [Q, le] = r.useState([]), [ke, f] = r.useState([]), [Y, $] = r.useState(""), [I, ce] = r.useState(!1), [Z, F] = r.useState(""), [Te, ne] = r.useState(""), [ze, We] = r.useState(""), [it, at] = r.useState(null), [$e, Re] = r.useState([]), [Ue, ye] = r.useState(null), [He, lt] = r.useState(""), [nt, Ze] = r.useState(""), xe = o.some((L) => qt(L, "retrospective.generate")), dt = !!(v != null && v.is_current) && !!qt(o.find((L) => L.id === v.project_id), "retrospective.edit"), De = !!(v != null && v.is_current) && !!qt(o.find((L) => L.id === v.project_id), "retrospective.review");
  r.useEffect(() => {
    F(""), $(""), ce(!1), me(""), ue(""), We(""), Re([]), ye(null);
  }, [h]), r.useEffect(() => {
    let L = !1;
    return Se(!0), U(null), me(""), (async () => {
      try {
        if (q) {
          const ie = await u(`/retrospectives/${q}${Z ? "?revision_id=" + Z : ""}`);
          L || (U(ie), k({ summary: ie.summary, findings: structuredClone(ie.findings), suggestions: structuredClone(ie.suggestions) }), ce(!1));
        } else {
          const ie = await u(`/retrospectives?limit=20${Te ? "&state=" + Te : ""}${ze ? "&cursor=" + encodeURIComponent(ze) : ""}`);
          L || (G(ie.items), at(ie.next_cursor));
        }
      } catch (ie) {
        L || me(ie.message);
      } finally {
        L || Se(!1);
      }
    })(), () => {
      L = !0;
    };
  }, [q, h, Z, Te, ze, ae]), r.useEffect(() => {
    if (q || !Ye || !xe) return;
    let L = !1;
    return f([]), X([]), le([]), b(""), (async () => {
      var ie;
      try {
        const [Je, y] = await Promise.all([u(`/task-packages?project_id=${Ye}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${Ye}&limit=100`)]);
        if (L) return;
        const he = Je.items.filter((pe) => pe.is_current);
        X(he), b(((ie = he[0]) == null ? void 0 : ie.id) || ""), le(y.items);
      } catch (Je) {
        L || me(Je.message);
      }
    })(), () => {
      L = !0;
    };
  }, [q, Ye, ae]), r.useEffect(() => {
    if (!(Ue != null && Ue.asset_id) || Ue.type !== "task_attachment") {
      lt(""), Ze("");
      return;
    }
    let L = !1, de = "";
    return Zt("/api/v1/assets/" + Ue.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + T } }).then(async (ie) => {
      if (!ie.ok) {
        const y = await ie.json();
        throw new Error(y.message);
      }
      const Je = await ie.blob();
      !L && /^(image\/|text\/plain)/.test(Je.type) && (de = URL.createObjectURL(Je), lt(de), Ze(Je.type));
    }).catch((ie) => {
      L || me(ie.message);
    }), () => {
      L = !0, de && URL.revokeObjectURL(de), lt("");
    };
  }, [Ue, T]);
  const E = async (L) => {
    je(!0), me(""), ue("");
    try {
      await L();
    } catch (de) {
      me(de.message);
    } finally {
      je(!1);
    }
  }, w = () => ({ revision_id: v.revision_id, row_version: v.row_version, reason: Y, evidence_checked: I }), ee = !!v && !!K && JSON.stringify(K) === JSON.stringify({ summary: v.summary, findings: v.findings, suggestions: v.suggestions }), _e = (L) => void E(async () => {
    const de = L === "submit" ? `/retrospectives/${q}/submit-review` : `/reviews/${v.revision_id}/${L}`;
    await u(de, { method: "POST", body: JSON.stringify(w()) }), ue("已保存本版本的审核状态与意见。"), B((ie) => ie + 1);
  }), qe = (L, de) => L.map((ie, Je) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ie.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Vv[ie.claim_kind] }),
      ie.record_status && /* @__PURE__ */ s.jsx("strong", { children: ie.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ie.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && dt ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ie.id, value: ie.text, onChange: (y) => k((he) => he && { ...he, [de]: he[de].map((pe, Be) => Be === Je ? { ...pe, text: y.target.value, review_state: "unconfirmed" } : pe) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ie.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ie.evidence_refs.map((y, he) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => ye(v.evidence.find((pe) => pe.id === y) || null), children: [
      "查看证据 ",
      he + 1
    ] }, y)) }),
    V && dt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ie.review_state === "confirmed", onChange: (y) => k((he) => he && { ...he, [de]: he[de].map((pe, Be) => Be === Je ? { ...pe, review_state: y.target.checked ? "confirmed" : "unconfirmed" } : pe) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ie.id)), Qe = (L) => L.map((de) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Pi(de.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Jv[de.event_type] || "未知事件类型：" + de.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof de.payload.note == "string" ? de.payload.note : Object.keys(de.payload).length ? JSON.stringify(de.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ye(v.evidence.find((ie) => ie.reference === "event:" + de.event_id) || null), children: "打开事件记录" }),
    de.evidence_refs.map((ie) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Je = v.evidence.find((y) => y.reference === "attachment:" + ie);
      Je ? ye(Je) : me("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ie
    ] }, ie))
  ] }, de.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(uv, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Ee && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      Ee,
      /* @__PURE__ */ s.jsx("button", { onClick: () => B((L) => L + 1), children: "重新加载" })
    ] }),
    P && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      P
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => B((L) => L + 1), disabled: se, children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : q ? v && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: v.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            v.version,
            " · ",
            Hn[v.state],
            " · ",
            v.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            v.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: v.revision_id, onChange: (L) => F(L.target.value), children: v.revisions.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
            "v",
            L.version,
            " · ",
            Hn[L.state]
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _(`/retrospectives/${q}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !v.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && dt ? /* @__PURE__ */ s.jsxs("label", { children: [
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
            v.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: Qe(v.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            v.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: Qe(v.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            v.timeline.intervals.length ? v.timeline.intervals.map((L, de) => /* @__PURE__ */ s.jsxs("p", { children: [
              L.name,
              "：",
              L.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, de)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            v.timeline.deadlines.length ? v.timeline.deadlines.map((L) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                L.issue_id,
                " · ",
                L.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: L.reason || `明确期限 ${Pi(L.due_at || null)}；复核记录 ${Pi(L.accepted_at || null)}；晚于期限 ${L.late_seconds / 60} 分钟。` })
            ] }, L.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ s.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            qe(K.findings, "findings"),
            /* @__PURE__ */ s.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            qe(K.suggestions, "suggestions")
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
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: Y, onChange: (L) => $(L.target.value) })
          ] }),
          dt && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || ee || !Y.trim(), onClick: () => void E(async () => {
              await u(`/retrospectives/${q}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), ue("已保存新草稿版本，旧内容及审核意见保留。"), B((L) => L + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(v.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !ee || !Y.trim(), onClick: () => _e("submit"), children: "提交当前版本审核" })
          ] }),
          De && v.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: I, onChange: (L) => ce(L.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !I || !ee || !Y.trim(), onClick: () => _e("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !ee || !Y.trim(), onClick: () => _e("request-changes"), children: "退回修改" })
            ] })
          ] }),
          dt && v.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !ee || !Y.trim(), onClick: () => void E(async () => {
            const L = await u(`/retrospectives/${q}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            ue(L.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), B((de) => de + 1);
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
        v.review_actions.map((L, de) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            L.version,
            " · ",
            Hn[L.action] || L.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: L.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Pi(L.created_at) })
        ] }, de))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      xe && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: ve, onChange: (L) => Ae(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Le, onChange: (L) => Ve(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Ye, onChange: (L) => ge(L.target.value), children: o.filter((L) => qt(L, "retrospective.generate")).map((L) => /* @__PURE__ */ s.jsx("option", { value: L.id, children: L.name }, L.id)) })
            ] })
          ] }),
          Le === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: oe, onChange: (L) => b(L.target.value), children: Pe.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
              L.name,
              " · 包v",
              L.package_version
            ] }, L.id)) }),
            !Pe.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Q.map((L) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ke.includes(L.record_version_id), onChange: (de) => f(de.target.checked ? [...ke, L.record_version_id] : ke.filter((ie) => ie !== L.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              L.description || "未填写描述",
              " · 来源v",
              L.current_version
            ] })
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Le === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || (Le === "task_process" ? !oe : !ke.length || ke.length > 20), onClick: () => void E(async () => {
              const L = await um(u, "/retrospective-generation-jobs", { mode: Le, generation_mode: ve, task_package_id: Le === "task_process" ? oe : null, record_version_ids: Le === "historical_case" ? ke : [], template_version: "process-review-v1" }, () => ue("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              _("/retrospectives/" + L.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Te, onChange: (L) => {
            ne(L.target.value), We(""), Re([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((L) => /* @__PURE__ */ s.jsx("option", { value: L, children: Hn[L] }, L))
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
              Hn[L.state]
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
            /* @__PURE__ */ s.jsx("button", { disabled: !$e.length, onClick: () => {
              We($e.at(-1) || ""), Re($e.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !it, onClick: () => {
              Re([...$e, ze]), We(it || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    Ue && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => ye(null), children: /* @__PURE__ */ s.jsx(tc, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ue.type === "process_event" ? "实际事件记录" : Ue.type === "task_attachment" ? "任务附件" : Ue.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: Ue.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(Ue.locator)
      ] }),
      He && nt.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: He, alt: "来源证据" }),
      He && nt.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: He }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const Us = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, Da = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Jf = { selected: [], text: "", row_version: 0 };
function $v({ api: u, path: h, navigate: _, projects: o }) {
  var we, rt, bt;
  const T = h.startsWith("/learn"), q = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || q ? h.split("/")[3] : "", A = /^\/training\/questions\/[^/]+$/.test(h), G = A ? h.split("/")[3] : "", v = h === "/training/questions", U = h === "/training/packages", K = h === "/training/results", k = o.some((m) => qt(m, "training.manage")), se = o.some((m) => qt(m, "training.review")), [je, Ne] = r.useState("llm"), [Se, Ee] = r.useState(""), [me, P] = r.useState(((we = o.find((m) => qt(m, "training.manage"))) == null ? void 0 : we.id) || ((rt = o[0]) == null ? void 0 : rt.id) || ""), [ue, ae] = r.useState([]), [B, ve] = r.useState([]), [Ae, Le] = r.useState([]), [Ve, Ye] = r.useState([]), [ge, Pe] = r.useState(null), [X, oe] = r.useState(null), [b, Q] = r.useState(""), [le, ke] = r.useState(!1), [f, Y] = r.useState([]), [$, I] = r.useState(["single_choice", "case_answer"]), [ce, Z] = r.useState([]), [F, Te] = r.useState("新人风险识别与复盘练习"), [ne, ze] = r.useState("learning-" + Date.now()), [We, it] = r.useState(1), [at, $e] = r.useState(null), [Re, Ue] = r.useState({}), [ye, He] = r.useState(null), [lt, nt] = r.useState("rules"), [Ze, xe] = r.useState("useful"), [dt, De] = r.useState(""), [E, w] = r.useState({}), [ee, _e] = r.useState({}), [qe, Qe] = r.useState(""), [ut, L] = r.useState(""), [de, ie] = r.useState(null), [Je, y] = r.useState([]), [he, pe] = r.useState(!0), [Be, gt] = r.useState(!1), [M, j] = r.useState(""), [re, be] = r.useState(""), [ct, N] = r.useState(0);
  r.useEffect(() => {
    L(""), y([]), Q(""), ke(!1), be(""), j(""), Z([]);
  }, [h]), r.useEffect(() => {
    let m = !1;
    return pe(!0), j(""), Pe(null), $e(null), He(null), (async () => {
      try {
        if (V)
          if (q) {
            const Ce = await u(`/training/attempts/${V}/result?teacher=true`);
            m || He(Ce);
          } else {
            const Ce = await u("/training/attempts/" + V);
            if (m) return;
            if ($e(Ce), Ue(Object.fromEntries(Ce.saved_answers.map((et) => [et.question_revision_id, { ...et.answer, row_version: et.row_version }]))), Ce.state === "submitted") {
              const et = await u(`/training/attempts/${V}/result`);
              m || He(et);
            }
          }
        else if (A) {
          const Ce = await u("/training/questions/" + G);
          m || (Pe(Ce), oe(structuredClone(Ce.content)));
        } else if (T) {
          const [Ce, et] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          m || (ve(Ce.items), Ye(et.items));
        } else if (K) {
          const Ce = await u(`/training/results?limit=20${ut ? "&cursor=" + ut : ""}`);
          m || (Ye(Ce.items), ie(Ce.next_cursor));
        } else if (U) {
          const [Ce, et] = await Promise.all([u(`/training/packages?limit=20${ut ? "&cursor=" + ut : ""}`), u("/training/questions?state=approved&limit=100")]);
          m || (ve(Ce.items), ae(et.items), ie(Ce.next_cursor));
        } else {
          const [Ce, et] = await Promise.all([u(`/training/questions?limit=20${qe ? "&state=" + qe : ""}${ut ? "&cursor=" + ut : ""}`), u("/knowledge/library?limit=100&project_id=" + me)]);
          m || (ae(Ce.items), Le(et.items), ie(Ce.next_cursor));
        }
      } catch (Ce) {
        m || j(Ce.message);
      } finally {
        m || pe(!1);
      }
    })(), () => {
      m = !0;
    };
  }, [h, me, qe, ut, ct]), r.useEffect(() => {
    if (!(ye != null && ye.grading_job) || !["queued", "running", "retrying"].includes(ye.grading_job.status)) return;
    const m = window.setTimeout(() => N((Oe) => Oe + 1), 1800);
    return () => clearTimeout(m);
  }, [(bt = ye == null ? void 0 : ye.grading_job) == null ? void 0 : bt.status, ct]);
  const fe = async (m) => {
    gt(!0), j(""), be("");
    try {
      await m();
    } catch (Oe) {
      j(Oe.message);
    } finally {
      gt(!1);
    }
  }, Ke = !!ge && !!X && JSON.stringify(X) === JSON.stringify(ge.content), Tt = () => ({ revision_id: ge.revision_id, row_version: ge.row_version, reason: b, evidence_checked: le }), Lt = (m) => void fe(async () => {
    await u(m === "submit" ? `/training/questions/${G}/submit-review` : `/reviews/${ge.revision_id}/${m}`, { method: "POST", body: JSON.stringify(Tt()) }), be("题目审核状态已保存到统一审核记录。"), N((Oe) => Oe + 1);
  }), Yt = async (m) => {
    const Oe = Re[m.revision_id] || Jf, Ce = await u(`/training/attempts/${V}/answers/${m.question_id}`, { method: "PUT", body: JSON.stringify(Oe) });
    return Ue((et) => ({ ...et, [m.revision_id]: { ...Oe, row_version: Ce.row_version } })), Ce;
  }, ht = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Je.length, onClick: () => {
        L(Je.at(-1) || ""), y(Je.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !de, onClick: () => {
        y([...Je, ut]), L(de || "");
      }, children: "下一页" })
    ] })
  ] }), _t = (m, Oe, Ce) => Ce ? [...m, Oe] : m.filter((et) => et !== Oe), g = (m) => void fe(async () => {
    const Oe = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: m.id, grading_mode: lt }) });
    _("/learn/attempts/" + Oe.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(nc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: T ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    M && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      M
    ] }),
    re && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
      re
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !T && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: v || A ? "selected" : "", onClick: () => _("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: U ? "selected" : "", onClick: () => _("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || q ? "selected" : "", onClick: () => _("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => _("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => N((m) => m + 1), children: [
        /* @__PURE__ */ s.jsx(Xs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    he ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : ye ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: Us[ye.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: ye.confirmed_total === null ? "待确认" : ye.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: ye.provisional_total === null ? "待评分" : ye.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: ye.max_score })
            ] })
          ] }),
          ye.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              ye.grading_job.status === "failed" ? "暂未完成" : ye.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            ye.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: ye.grading_job.error }),
            q && k && ye.grading_job.status === "failed" && ye.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void fe(async () => {
              await u("/jobs/" + ye.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ye.grading_job.row_version }) }), N((m) => m + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          ye.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: ye.restriction_note }),
          ye.answers.map((m, Oe) => {
            var Ce, et, Gt, us, x, R, Ge, At;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Oe + 1,
                "题 ",
                m.type ? Da[m.type] : ""
              ] }),
              m.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((Ce = m.answer) == null ? void 0 : Ce.text) || ((et = m.answer) == null ? void 0 : et.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Gt = m.reference_answer) == null ? void 0 : Gt.text) || ((x = (us = m.reference_answer) == null ? void 0 : us.selected) == null ? void 0 : x.join("、"))
                ] }),
                (R = m.rubric) == null ? void 0 : R.map((tt, Ut) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  tt.point,
                  " · ",
                  tt.points,
                  "分"
                ] }, Ut)),
                /* @__PURE__ */ s.jsx("p", { children: (Ge = m.feedback) == null ? void 0 : Ge.message }),
                ((At = m.feedback) == null ? void 0 : At.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
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
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: E[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? ""), onChange: (tt) => w({ ...E, [m.id]: tt.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: ee[m.id] || "", onChange: (tt) => _e({ ...ee, [m.id]: tt.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be || !(ee[m.id] || "").trim() || (E[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? "")) === "", onClick: () => void fe(async () => {
                  await u("/training/answers/" + m.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: m.row_version, score: Number(E[m.id] ?? m.confirmed_score ?? m.suggested_score), reason: ee[m.id] }) }), be("人工确认分已保存，原建议分和复核轨迹保留。"), N((tt) => tt + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, m.id);
          })
        ] })
      ] }),
      !q && ye.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: Ze, onChange: (m) => xe(m.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: dt, onChange: (m) => De(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void fe(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: Ze, comment: dt }) }), be("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : at ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          at.package_title,
          " · v",
          at.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      at.questions.map((m) => {
        const Oe = Re[m.revision_id] || Jf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            m.position,
            "题 · ",
            Da[m.type],
            " · ",
            m.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
          m.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + m.position + "题回答", value: Oe.text, onChange: (Ce) => Ue({ ...Re, [m.revision_id]: { ...Oe, text: Ce.target.value } }) })
          ] }) : m.options.map((Ce) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: m.type === "single_choice" ? "radio" : "checkbox", name: m.revision_id, checked: Oe.selected.includes(Ce.id), onChange: (et) => Ue({ ...Re, [m.revision_id]: { ...Oe, selected: m.type === "single_choice" ? [Ce.id] : _t(Oe.selected, Ce.id, et.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Ce.id.toUpperCase(),
              " · ",
              Ce.text
            ] })
          ] }, Ce.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void fe(async () => {
              await Yt(m), be("第" + m.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Oe.row_version
            ] })
          ] })
        ] }, m.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Be, onClick: () => void fe(async () => {
        for (const m of at.questions) await Yt(m);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), N((m) => m + 1), be("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : A && ge && X ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Da[ge.type],
            " · v",
            ge.version,
            " · ",
            Us[ge.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: ge.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: X.stem, disabled: !k, onChange: (m) => oe({ ...X, stem: m.target.value }) })
          ] }),
          X.options.map((m, Oe) => {
            var Ce;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              m.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: m.text, disabled: !k, onChange: (et) => oe({ ...X, options: X.options.map((Gt, us) => us === Oe ? { ...Gt, text: et.target.value } : Gt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((Ce = X.answer.selected) == null ? void 0 : Ce.includes(m.id)) || !1, onChange: (et) => oe({ ...X, answer: { selected: _t(X.answer.selected || [], m.id, et.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, m.id);
          }),
          ge.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: X.answer.text || "", disabled: !k, onChange: (m) => oe({ ...X, answer: { text: m.target.value } }) })
            ] }),
            X.rubric.map((m, Oe) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: m.point, disabled: !k, onChange: (Ce) => oe({ ...X, rubric: X.rubric.map((et, Gt) => Gt === Oe ? { ...et, point: Ce.target.value } : et) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: m.keywords.join("，"), disabled: !k, onChange: (Ce) => oe({ ...X, rubric: X.rubric.map((et, Gt) => Gt === Oe ? { ...et, keywords: Ce.target.value.split(/[,，]/).filter(Boolean) } : et) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: m.points, disabled: !k, onChange: (Ce) => oe({ ...X, rubric: X.rubric.map((et, Gt) => Gt === Oe ? { ...et, points: Number(Ce.target.value) } : et) }) })
              ] })
            ] }, Oe))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          ge.source_versions.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: m }) }, m)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: b, onChange: (m) => Q(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be || Ke || !b.trim(), onClick: () => void fe(async () => {
              await u(`/training/questions/${G}/draft`, { method: "PATCH", body: JSON.stringify({ ...Tt(), content: X }) }), be("新题目版本已保存，不改变旧学习包与成绩。"), N((m) => m + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(ge.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Be || !Ke || !b.trim(), onClick: () => Lt("submit"), children: "提交题目审核" })
          ] }),
          se && ge.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le, onChange: (m) => ke(m.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Be || !le || !Ke || !b.trim(), onClick: () => Lt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Be || !Ke || !b.trim(), onClick: () => Lt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          ge.revisions.map((m) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            Us[m.state]
          ] }, m.id)),
          ge.review_actions.map((m, Oe) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            Us[m.action] || m.action,
            " · ",
            m.reason
          ] }, Oe))
        ] })
      ] })
    ] }) : T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: lt, onChange: (m) => nt(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          B.length ? B.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: m.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              m.version,
              " · ",
              m.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Be, onClick: () => g(m), children: "开始本次练习" })
          ] }, m.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Ve.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => _("/learn/attempts/" + m.id), children: [
            Us[m.state],
            " · ",
            Us[m.result_state],
            " · ",
            new Date(m.started_at).toLocaleString("zh-CN")
          ] }) }, m.id)),
          !Ve.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
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
        /* @__PURE__ */ s.jsx("tbody", { children: Ve.map((m) => {
          var Oe;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              m.title,
              " · v",
              m.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Oe = m.learner_id) == null ? void 0 : Oe.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              Us[m.state],
              " · ",
              Us[m.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m.state !== "submitted", onClick: () => _("/training/results/" + m.id), children: "查看结果与复核" }) })
          ] }, m.id);
        }) })
      ] }) }),
      ht
    ] }) : U ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      k && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "组建固定版本学习包" }),
          /* @__PURE__ */ s.jsx("span", { children: "只选用当前已审核题目；修改后创建新包版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: me, onChange: (m) => {
                P(m.target.value), Z([]);
              }, children: o.filter((m) => qt(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: Se, onChange: (m) => Ee(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: F, onChange: (m) => Te(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ne, onChange: (m) => ze(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: We, onChange: (m) => it(Number(m.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: ue.filter((m) => m.project_id === me).map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ce.includes(m.revision_id), onChange: (Oe) => Z((Ce) => _t(Ce, m.revision_id, Oe.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Da[m.type],
              " · ",
              m.title,
              " · v",
              m.version
            ] })
          ] }, m.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Be || !ce.length || ce.length > 30 || !F.trim(), onClick: () => void fe(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: F, package_key: ne, version: We, project_id: me, question_revision_ids: ce, role_scope: ["learner", "admin", "teacher"], audience_subjects: Se.split(/[,，\n]/).map((m) => m.trim()).filter(Boolean) }) }), be("学习包草稿已建立，发布后学员可使用。"), N((m) => m + 1);
          }), children: [
            "创建学习包草稿（",
            ce.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: B.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            m.title,
            " · v",
            m.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            Us[m.state],
            " · ",
            m.question_count,
            "题 · ",
            m.package_key
          ] }),
          m.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void fe(async () => {
            await u(`/training/packages/${m.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: m.row_version, reason: "发布已审核题目的固定版本学习包" }) }), be("学习包已发布。"), N((Oe) => Oe + 1);
          }), children: "发布此学习包版本" })
        ] }, m.id)) }),
        ht
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
            /* @__PURE__ */ s.jsx("select", { value: me, onChange: (m) => {
              P(m.target.value), Y([]);
            }, children: o.filter((m) => qt(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Ae.map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: f.includes(m.revision_id), onChange: (Oe) => Y((Ce) => _t(Ce, m.revision_id, Oe.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                m.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  m.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, m.revision_id)),
            !Ae.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(Da).map(([m, Oe]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $.includes(m), onChange: (Ce) => I((et) => _t(et, m, Ce.target.checked)) }),
            Oe
          ] }, m)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: je, onChange: (m) => Ne(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Be || !f.length || f.length > 10 || !$.length, onClick: () => void fe(async () => {
            const m = await um(u, "/training/generation-jobs", { knowledge_revision_ids: f, types: $, generation_mode: je }, () => be("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            be("已生成或复用" + m.items.length + "道候选题，仍需核查答案与来源后提交审核。"), N((Oe) => Oe + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: qe, onChange: (m) => {
            Qe(m.target.value), L(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((m) => /* @__PURE__ */ s.jsx("option", { value: m, children: Us[m] }, m))
          ] })
        ] }),
        ue.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ue.map((m) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: m.title }),
            /* @__PURE__ */ s.jsx("td", { children: Da[m.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              m.version,
              " · ",
              Us[m.state],
              m.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/training/questions/" + m.id), children: "核查与审核" }) })
          ] }, m.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        ht
      ] })
    ] })
  ] });
}
function Wv({ api: u }) {
  var Ee, me;
  const [h, _] = r.useState(null), [o, T] = r.useState([]), [q, V] = r.useState("openai"), [A, G] = r.useState(""), [v, U] = r.useState(!1), [K, k] = r.useState(""), [se, je] = r.useState("");
  r.useEffect(() => {
    let P = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([ue, ae]) => {
      if (P) return;
      T(ae.items);
      const B = ae.items.find((ve) => ve.base_url === ue.base_url);
      if (!ue.model && !ue.api_key_configured) {
        const ve = ae.items[0];
        V(ve.id), _({ ...ue, base_url: ve.base_url, model: ve.default_model });
      } else
        V((B == null ? void 0 : B.id) || "custom"), _(ue);
    }).catch((ue) => {
      P || k(ue.message);
    }), () => {
      P = !0;
    };
  }, []);
  const Ne = (P) => {
    const ue = o.find((ae) => ae.id === P);
    V(P), G(""), je(""), k(""), h && _({ ...h, base_url: (ue == null ? void 0 : ue.base_url) || "", model: (ue == null ? void 0 : ue.default_model) || "", api_key_configured: !1 });
  }, Se = async () => {
    if (h) {
      U(!0), k(""), je("");
      try {
        const { api_key_configured: P, ...ue } = h, ae = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !0, ...A ? { api_key: A } : {} }) });
        if (_(ae), G(""), je("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        je("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (P) {
        je(""), k(P.message);
      } finally {
        U(!1);
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
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: v, value: q, onChange: (P) => Ne(P.target.value), children: [
            o.map((P) => /* @__PURE__ */ s.jsx("option", { value: P.id, children: P.name }, P.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        q === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: v, value: h.base_url, onChange: (P) => _({ ...h, base_url: P.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (P) => _({ ...h, model: P.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: v, value: h.model, onChange: (P) => _({ ...h, model: P.target.value }), children: [
            !((Ee = o.find((P) => P.id === q)) != null && Ee.models.some((P) => P.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (me = o.find((P) => P.id === q)) == null ? void 0 : me.models.map((P) => /* @__PURE__ */ s.jsx("option", { value: P.id, children: P.name }, P.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: v, value: A, onChange: (P) => G(P.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: h.timeout_seconds, onChange: (P) => _({ ...h, timeout_seconds: Number(P.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: h.max_tokens, onChange: (P) => _({ ...h, max_tokens: Number(P.target.value) }) })
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
            U(!0), k("");
            const { api_key_configured: P, ...ue } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !1 }) }).then((ae) => {
              _(ae), je("云端调用已停用。");
            }).catch((ae) => k(ae.message)).finally(() => U(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Fv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Iv({ api: u, path: h, navigate: _, projects: o, identity: T, canManageModels: q }) {
  var $, I, ce;
  const V = h === "/settings/models", A = q, G = o.some((Z) => Z.can_run), [v, U] = r.useState((($ = o.find((Z) => Z.can_run)) == null ? void 0 : $.id) || ""), [K, k] = r.useState([]), [se, je] = r.useState([]), [Ne, Se] = r.useState(null), [Ee, me] = r.useState(Fv), [P, ue] = r.useState("llm"), [ae, B] = r.useState(sessionStorage.getItem("b07-extraction-" + T) || ""), [ve, Ae] = r.useState(null), [Le, Ve] = r.useState(!1), [Ye, ge] = r.useState(!0), [Pe, X] = r.useState(""), [oe, b] = r.useState(""), [Q, le] = r.useState(0), ke = async (Z) => {
    Ve(!0), X(""), b("");
    try {
      await Z();
    } catch (F) {
      X(F.message);
    } finally {
      Ve(!1);
    }
  };
  r.useEffect(() => {
    let Z = !1;
    return ge(!0), X(""), je([]), (async () => {
      var Te;
      try {
        if (V) {
          if (!A) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!G || !v) throw new Error("当前身份没有知识加工权限。");
          const [ne, ze] = await Promise.all([u(`/knowledge/source-options?project_id=${v}&limit=100`), u(`/knowledge/taxonomies?project_id=${v}`)]);
          Z || (k(ne.items), Se(ze.items[0] || null), me(structuredClone(((Te = ze.items[0]) == null ? void 0 : Te.categories) || ze.suggested_categories)));
        }
      } catch (ne) {
        Z || X(ne.message);
      } finally {
        Z || ge(!1);
      }
    })(), () => {
      Z = !0;
    };
  }, [h, v, Q]), r.useEffect(() => {
    if (!ae || V) return;
    let Z = !1, F;
    const Te = async () => {
      try {
        const ne = await u("/knowledge/extraction-jobs/" + ae);
        if (Z) return;
        Ae(ne), ["queued", "running", "retrying"].includes(ne.status) && (F = window.setTimeout(() => void Te(), 1800));
      } catch (ne) {
        Z || X(ne.message);
      }
    };
    return Te(), () => {
      Z = !0, window.clearTimeout(F);
    };
  }, [ae, h, Q]);
  const f = (Z, F) => me((Te) => Te.map((ne, ze) => ze === Z ? { ...ne, ...F } : ne)), Y = JSON.stringify(Ee) !== JSON.stringify((Ne == null ? void 0 : Ne.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Rl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    Pe && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Al, { size: 18 }),
      Pe
    ] }),
    oe && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: oe }),
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
    Ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && A ? /* @__PURE__ */ s.jsx(Wv, { api: u }) : !V && G ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: v, onChange: (Z) => U(Z.target.value), children: o.filter((Z) => Z.can_run).map((Z) => /* @__PURE__ */ s.jsx("option", { value: Z.id, children: Z.name }, Z.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            Ne ? "分类 v" + Ne.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Ee.map((Z, F) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (F + 1), value: Z.code, onChange: (Te) => f(F, { code: Te.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (F + 1), value: Z.name, onChange: (Te) => f(F, { name: Te.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Z.focus, onChange: (Te) => f(F, { focus: Te.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Z.keywords.join("，"), onChange: (Te) => f(F, { keywords: Te.target.value.split(/[,，]/).map((ne) => ne.trim()).filter(Boolean) }) })
            ] }),
            Ee.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => me((Te) => Te.filter((ne, ze) => ze !== F)), children: "移除此类别" })
          ] }, F)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Ee.length >= 100, onClick: () => me([...Ee, { code: "category_" + (Ee.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(pv, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le || !Y, onClick: () => void ke(async () => {
              const Z = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: v, expected_version: (Ne == null ? void 0 : Ne.version) || 0, categories: Ee }) });
              Se(Z), me(Z.categories), b("分类版本已固定，可开始加工。");
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
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se.includes(Z.record_version_id), onChange: (F) => je((Te) => F.target.checked ? [...Te, Z.record_version_id] : Te.filter((ne) => ne !== Z.record_version_id)) }),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: P, onChange: (Z) => ue(Z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Le || !Ne || Y || !se.length || se.length > 20, onClick: () => void ke(async () => {
            const Z = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: se, taxonomy_id: Ne.id, mode: P }) });
            B(Z.job_id), sessionStorage.setItem("b07-extraction-" + T, Z.job_id), b("后台加工已提交，完成后生成有来源的施工要点候选。");
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
          (I = ve.result.items) == null ? void 0 : I.map((Z) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + Z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Z.item_id)),
          (ce = ve.result.missing_information) == null ? void 0 : ce.map((Z, F) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Z
          ] }, F)),
          ve.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le, onClick: () => void ke(async () => {
            await u("/jobs/" + ve.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ve.row_version }) }), le((Z) => Z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const wu = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Kf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, $f = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, ec = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Pv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function ep({ embedded: u = !1 }) {
  var ct;
  const [h, _] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, T] = r.useState(Fi()), [q, V] = r.useState(!1), A = o === "/platform/services", G = o.startsWith("/archive-review/"), v = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [U, K] = r.useState(["/sources", "/imports", "/records"].some((N) => Fi().startsWith(N))), k = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", se = !k && ["/quality", "/knowledge", "/reviews"].some((N) => o.startsWith(N)), je = o.startsWith("/training") || o.startsWith("/learn"), Ne = o.startsWith("/workflows"), Se = o.startsWith("/standards"), Ee = Ne || Se || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", me = o.startsWith("/retrospectives"), P = o.startsWith("/task-packages"), ue = o === "/records", ae = !v && ["/sources", "/imports", "/records"].some((N) => o.startsWith(N)), [B, ve] = r.useState(null), [Ae, Le] = r.useState([]), [Ve, Ye] = r.useState({}), [ge, Pe] = r.useState(!1), [X, oe] = r.useState(""), [b, Q] = r.useState(""), [le, ke] = r.useState(!0), [f, Y] = r.useState(!1), [$, I] = r.useState(0), [ce, Z] = r.useState(""), [F, Te] = r.useState(""), [ne, ze] = r.useState(""), [We, it] = r.useState(null), [at, $e] = r.useState([]), [Re, Ue] = r.useState(null), [ye, He] = r.useState(!1), [lt, nt] = r.useState("demo-airport"), [Ze, xe] = r.useState("success"), [dt, De] = r.useState(null), [E, w] = r.useState(""), [ee, _e] = r.useState("processor"), [qe, Qe] = r.useState("demo-airport"), [ut, L] = r.useState([]);
  async function de(N, fe = {}) {
    const Ke = await Zt("/api/v1" + N, {
      ...fe,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...fe.headers }
    });
    if (!Ke.ok) {
      const Tt = await Ke.json().catch(() => ({}));
      throw new Error(Tt.message || `请求失败（${Ke.status}），请刷新后重试。`);
    }
    return Ke.json();
  }
  const ie = (N) => {
    var Ke, Tt;
    const fe = window;
    u && ((Ke = fe.QaxcHasPendingEdits) != null && Ke.call(fe)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((Tt = fe.QaxcClearPendingEdits) == null || Tt.call(fe), kj(N), T(Fi()), oe(""), Ue(null), ze(""), $e([]));
  };
  r.useEffect(() => {
    const N = () => T(Fi());
    return window.addEventListener("popstate", N), window.addEventListener("hashchange", N), () => {
      window.removeEventListener("popstate", N), window.removeEventListener("hashchange", N);
    };
  }, []), r.useEffect(() => {
    const N = () => V(!0);
    return window.addEventListener("b-session-expired", N), () => window.removeEventListener("b-session-expired", N);
  }, []), r.useEffect(() => {
    let N = !1;
    ke(!0), oe(""), ve(null), De(null), Le([]), L([]);
    async function fe() {
      try {
        const Ke = await de("/me");
        if (N) return;
        const Tt = window.QaxcProjectNames || {};
        u && (Ke.projects = Ke.projects.map((ht) => ({ ...ht, name: Tt[ht.id] || ht.name })));
        const Lt = window.QaxcProjectId;
        u && Lt && (Ke.projects = Ke.projects.filter((ht) => ht.id === Lt)), ve(Ke);
        const Yt = await de("/health");
        if (N || (Pe(Yt.worker_online), v || A || G || ae || se || k || P || me || je || Ee)) return;
        if (o === "/settings/access") {
          if (!Ke.projects.some((g) => g.can_manage)) return;
          const [ht, _t] = await Promise.all([de("/access"), de("/audit-events?limit=10")]);
          if (N) return;
          De(ht), L(_t.items), w((g) => {
            var we;
            return ht.users.some((rt) => rt.id === g) ? g : ((we = ht.users[0]) == null ? void 0 : we.id) || "";
          });
        } else {
          const [ht, _t] = await Promise.all([
            de(`/jobs?limit=12${F ? `&kind=${F}` : ""}${ce ? `&status=${ce}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
            de("/dashboard")
          ]);
          if (N) return;
          Le(ht.items), it(ht.next_cursor), Ye(_t.counts);
        }
      } catch (Ke) {
        N || oe(Ke.message);
      } finally {
        N || ke(!1);
      }
    }
    return fe(), () => {
      N = !0;
    };
  }, [h, o, ce, F, ne, $]), r.useEffect(() => {
    if (!B || v || A || G || o === "/settings/access" || ae || se || k || P || me || je || Ee) return;
    let N = !1;
    const fe = window.setInterval(async () => {
      try {
        const [Ke, Tt, Lt] = await Promise.all([
          de(`/jobs?limit=12${F ? `&kind=${F}` : ""}${ce ? `&status=${ce}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
          de("/dashboard"),
          de("/health")
        ]);
        if (N) return;
        Le(Ke.items), it(Ke.next_cursor), Ye(Tt.counts), Pe(Lt.worker_online), Ue((Yt) => Yt ? Ke.items.find((ht) => ht.id === Yt.id) || Yt : null), oe("");
      } catch (Ke) {
        N || (oe(Ke.message), Pe(!1));
      }
    }, 2e3);
    return () => {
      N = !0, clearInterval(fe);
    };
  }, [h, o, ce, F, ne, B == null ? void 0 : B.id]);
  const Je = async (N) => {
    Y(!0), oe(""), Q("");
    try {
      await N(), I((fe) => fe + 1);
    } catch (fe) {
      oe(fe.message);
    } finally {
      Y(!1);
    }
  }, y = () => Je(async () => {
    await de("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: lt, scenario: Ze, duration_seconds: 6 })
    }), He(!1), Q("任务已保存，处理服务会自动执行。"), ie("/jobs");
  }), he = (N) => Je(async () => {
    await de(`/jobs/${N.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: N.row_version })
    }), Q("已提交重试，原任务和来源保持不变。");
  }), pe = (N) => Je(async () => {
    const fe = await Zt(`/api/v1/assets/${N.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!fe.ok) {
      const Lt = await fe.json();
      throw new Error(Lt.message);
    }
    const Ke = document.createElement("a"), Tt = URL.createObjectURL(await fe.blob());
    Ke.href = Tt, Ke.download = `演示检查结果-${N.id.slice(0, 8)}.txt`, Ke.click(), URL.revokeObjectURL(Tt), Q("演示结果已下载。");
  }), Be = !Rt && (B == null ? void 0 : B.projects.some((N) => N.can_run)), gt = (N) => {
    const fe = B == null ? void 0 : B.projects.find((Tt) => Tt.id === N.project_id);
    if ((fe == null ? void 0 : fe.permissions) == null) return !!(fe != null && fe.can_run);
    const Ke = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!Ke[N.kind] && fe.permissions.includes(Ke[N.kind]);
  }, M = B == null ? void 0 : B.projects.some((N) => N.can_manage), j = Object.fromEntries(((B == null ? void 0 : B.projects) || []).map((N) => [N.id, N.name])), re = v ? "A 成果接入" : A ? "平台服务" : G ? "归档成果复盘" : je ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Ee ? Ne ? "隐患分析与知识成果" : Se ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : me ? "过程复盘与经验" : P ? "归档成果与证据" : k ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : se ? "知识加工与审核" : ae ? ue ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", be = (Ve.queued || 0) + (Ve.running || 0) + (Ve.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(Bf, { size: 26 }) }),
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
          /* @__PURE__ */ s.jsx(Mf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Mf, "我的工作台"], ["/jobs", Pj, "处理任务"]].map(([N, fe, Ke]) => {
          const Tt = fe;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Ke), className: o === N || N === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => ie(String(N)), children: [
            /* @__PURE__ */ s.jsx(Tt, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Ke) }),
            /* @__PURE__ */ s.jsx(al, { size: 15 })
          ] }, String(N));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ae ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": U, "aria-controls": "governance-menu", onClick: () => K((N) => !N), children: [
          /* @__PURE__ */ s.jsx(Ii, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(al, { className: U ? "expanded" : "", size: 15 })
        ] }),
        U && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([N, fe]) => /* @__PURE__ */ s.jsx("button", { "aria-label": fe, className: o.startsWith(N) ? "active" : "", onClick: () => ie(N), children: fe }, N)) }),
        /* @__PURE__ */ s.jsxs("button", { className: se || Ee ? "nav-item active" : "nav-item", onClick: () => ie("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(Bn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => ie("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(Bn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: P ? "nav-item active" : "nav-item", onClick: () => ie("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(Bn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: me ? "nav-item active" : "nav-item", onClick: () => ie("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(Af, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: je ? "nav-item active" : "nav-item", onClick: () => ie(B != null && B.projects.some((N) => N.roles.some((fe) => ["admin", "teacher", "reviewer"].includes(fe))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(nc, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ie("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(wv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(al, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Ii, { size: 19 }),
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
          /* @__PURE__ */ s.jsx(al, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: re })
        ] }),
        Rt ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (N) => {
            localStorage.setItem("b01-identity", N.target.value), _(N.target.value), Ue(null), ze(""), $e([]), Q("");
          }, children: Pv.map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !v && !k && !A && !ae && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ae ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : je ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : se || Ee ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : P ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([N, fe]) => /* @__PURE__ */ s.jsx("button", { className: o === N ? "button primary" : "button ghost", onClick: () => ie(N), children: fe }, N)) }),
        !(u && ae) && /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: re }),
            /* @__PURE__ */ s.jsx("p", { children: v ? "指定版本接入、证据校验与过程复盘。" : je ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : Ne ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : Se ? "保存规范原文与适用版本，核对来源后审核发布。" : Ee ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : me ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : P ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : se ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ae ? ue ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => I((N) => N + 1), disabled: le, children: [
              /* @__PURE__ */ s.jsx(Xs, { size: 16 }),
              "刷新"
            ] }),
            !Rt && !ae && !se && !k && !P && !me && !je && !Ee && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Be || f, onClick: () => {
              var N;
              nt(((N = B == null ? void 0 : B.projects.find((fe) => fe.can_run)) == null ? void 0 : N.id) || "demo-airport"), He(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(Hf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Rt && !ae && !se && !k && !P && !me && !je && !Ee && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(Bf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        q && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        X && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(Al, { size: 18 }),
          X,
          /* @__PURE__ */ s.jsx("button", { onClick: () => I((N) => N + 1), children: "重新加载" })
        ] }),
        b && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Rl, { size: 18 }),
          b,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Q(""), children: /* @__PURE__ */ s.jsx(tc, { size: 16 }) })
        ] }),
        q ? null : v ? B ? /* @__PURE__ */ s.jsx(Rj, { id: o.split("/").pop(), identity: B.id, projects: B.projects, navigate: ie }) : /* @__PURE__ */ s.jsx("p", { children: X || "正在读取身份…" }) : le ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(qf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : X ? null : A ? /* @__PURE__ */ s.jsx(Dj, { navigate: ie }, $) : G ? /* @__PURE__ */ s.jsx(Uj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: ie }, o) : je ? /* @__PURE__ */ s.jsx($v, { api: de, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [] }, h) : Ne ? /* @__PURE__ */ s.jsx(Aj, { api: de, projects: (B == null ? void 0 : B.projects) || [], identity: h }, h + ":" + (B == null ? void 0 : B.projects.map((N) => N.id).join(","))) : Se ? /* @__PURE__ */ s.jsx(Ej, { api: de, projects: (B == null ? void 0 : B.projects) || [], identity: h }, h + ":" + (B == null ? void 0 : B.projects.map((N) => N.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(wj, { api: de, projects: (B == null ? void 0 : B.projects) || [] }) }) : Ee ? /* @__PURE__ */ s.jsx(Iv, { api: de, identity: h, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [], canManageModels: !!(B != null && B.can_manage_models) }, h) : me ? /* @__PURE__ */ s.jsx(Kv, { api: de, identity: h, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [] }, h) : P ? /* @__PURE__ */ s.jsx(Zv, { identity: h, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(Lv, { identity: h, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [] }, h) : se ? /* @__PURE__ */ s.jsx(qv, { api: de, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [], identity: h }, h) : ue ? /* @__PURE__ */ s.jsx(Mv, { api: de }, h) : ae ? /* @__PURE__ */ s.jsx(Ev, { api: de, path: o, navigate: ie, projects: (B == null ? void 0 : B.projects) || [], identity: h }, h) : o === "/settings/access" ? M ? dt && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                dt.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: dt.bindings.map((N) => {
                var fe;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (fe = dt.users.find((Ke) => Ke.id === N.user_id)) == null ? void 0 : fe.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: j[N.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Kf[N.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: N.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: f,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Je(async () => {
                          await de(`/role-bindings/${N.id}`, { method: "DELETE", body: JSON.stringify({ row_version: N.row_version }) }), Q("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, N.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Ii, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: E, onChange: (N) => w(N.target.value), children: dt.users.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: qe, onChange: (N) => Qe(N.target.value), children: dt.projects.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: ee, onChange: (N) => _e(N.target.value), children: Object.entries(Kf).filter(([N]) => N !== "admin" && N !== "a_service").map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f || !E, onClick: () => void Je(async () => {
              await de("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: E, project_id: qe, role: ee }) }), Q("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(zl, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            ut.length ? ut.map((N) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[N.action] || N.action }),
              /* @__PURE__ */ s.jsx("span", { children: j[N.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: ec(N.created_at) })
            ] }, N.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Ii, { size: 38 }),
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
              /* @__PURE__ */ s.jsx("strong", { children: Ve.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Ve.failed ? "danger-color" : "", children: Ve.failed || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ s.jsxs("strong", { children: [
                /* @__PURE__ */ s.jsx("i", { className: `dot ${ge ? "green" : "orange"}` }),
                ge ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: ge ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: o === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: F, onChange: (N) => {
                Te(N.target.value), ze(""), $e([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries($f).map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ce, onChange: (N) => {
                Z(N.target.value), ze(""), $e([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(wu).map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N))
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
              /* @__PURE__ */ s.jsx("tbody", { children: Ae.map((N) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => Ue(N), children: N.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    j[N.project_id] || N.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    $f[N.kind] || N.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${N.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  wu[N.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${N.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    N.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: ec(N.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  N.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ie("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ue(N), children: "详情" }),
                  N.status === "failed" && gt(N) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: f, onClick: () => void he(N), children: "重试任务" }),
                  N.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: f, onClick: () => void pe(N), children: /* @__PURE__ */ s.jsx(Df, { size: 17 }) })
                ] }) })
              ] }, N.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(Bn, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ce ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ce ? "切换筛选条件查看其他任务。" : Be ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Be && !ce && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => He(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(zl, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Ae.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !at.length, onClick: () => {
                  ze(at[at.length - 1]), $e(at.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !We, onClick: () => {
                  $e([...at, ne]), ze(We || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          o !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(Af, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ie("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(zl, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Rt ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    ye && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => He(!1), children: /* @__PURE__ */ s.jsx(tc, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: lt, onChange: (N) => nt(N.target.value), children: B == null ? void 0 : B.projects.filter((N) => N.can_run).map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: Ze, onChange: (N) => xe(N.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !ge && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => He(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f || !Be, onClick: () => void y(), children: [
          f ? /* @__PURE__ */ s.jsx(qf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(Hf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Re && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => Ue(null), children: /* @__PURE__ */ s.jsx(tc, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Re.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        wu[Re.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Re.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: j[Re.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Re.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: ec(Re.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: ec(Re.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Re.id })
      ] }),
      Re.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Re.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Re.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f, onClick: () => void pe(Re), children: [
        /* @__PURE__ */ s.jsx(Df, { size: 16 }),
        "下载演示结果"
      ] }),
      (ct = Re.result_links) == null ? void 0 : ct.map((N) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ie(N.path), children: N.label }, N.path)),
      Re.status === "failed" && gt(Re) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f, onClick: () => void he(Re), children: [
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
