var Fr = { exports: {} }, bn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ef;
function Fx() {
  if (ef) return bn;
  ef = 1;
  var d = Symbol.for("react.transitional.element"), j = Symbol.for("react.fragment");
  function k(o, H, G) {
    var X = null;
    if (G !== void 0 && (X = "" + G), H.key !== void 0 && (X = "" + H.key), "key" in H) {
      G = {};
      for (var M in H)
        M !== "key" && (G[M] = H[M]);
    } else G = H;
    return H = G.ref, {
      $$typeof: d,
      type: o,
      key: X,
      ref: H !== void 0 ? H : null,
      props: G
    };
  }
  return bn.Fragment = j, bn.jsx = k, bn.jsxs = k, bn;
}
var tf;
function Ix() {
  return tf || (tf = 1, Fr.exports = Fx()), Fr.exports;
}
var s = Ix(), Ir = { exports: {} }, yn = {}, Pr = { exports: {} }, eu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sf;
function Px() {
  return sf || (sf = 1, (function(d) {
    function j(g, Y) {
      var te = g.length;
      g.push(Y);
      e: for (; 0 < te; ) {
        var ke = te - 1 >>> 1, h = g[ke];
        if (0 < H(h, Y))
          g[ke] = Y, g[te] = h, te = ke;
        else break e;
      }
    }
    function k(g) {
      return g.length === 0 ? null : g[0];
    }
    function o(g) {
      if (g.length === 0) return null;
      var Y = g[0], te = g.pop();
      if (te !== Y) {
        g[0] = te;
        e: for (var ke = 0, h = g.length, q = h >>> 1; ke < q; ) {
          var W = 2 * (ke + 1) - 1, ee = g[W], ie = W + 1, Q = g[ie];
          if (0 > H(ee, te))
            ie < h && 0 > H(Q, ee) ? (g[ke] = Q, g[ie] = te, ke = ie) : (g[ke] = ee, g[W] = te, ke = W);
          else if (ie < h && 0 > H(Q, te))
            g[ke] = Q, g[ie] = te, ke = ie;
          else break e;
        }
      }
      return Y;
    }
    function H(g, Y) {
      var te = g.sortIndex - Y.sortIndex;
      return te !== 0 ? te : g.id - Y.id;
    }
    if (d.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var G = performance;
      d.unstable_now = function() {
        return G.now();
      };
    } else {
      var X = Date, M = X.now();
      d.unstable_now = function() {
        return X.now() - M;
      };
    }
    var L = [], x = [], T = 1, K = null, S = 3, P = !1, oe = !1, _e = !1, be = !1, ge = typeof setTimeout == "function" ? setTimeout : null, de = typeof clearTimeout == "function" ? clearTimeout : null, V = typeof setImmediate < "u" ? setImmediate : null;
    function ue(g) {
      for (var Y = k(x); Y !== null; ) {
        if (Y.callback === null) o(x);
        else if (Y.startTime <= g)
          o(x), Y.sortIndex = Y.expirationTime, j(L, Y);
        else break;
        Y = k(x);
      }
    }
    function se(g) {
      if (_e = !1, ue(g), !oe)
        if (k(L) !== null)
          oe = !0, D || (D = !0, xe());
        else {
          var Y = k(x);
          Y !== null && le(se, Y.startTime - g);
        }
    }
    var D = !1, he = -1, Oe = 5, He = -1;
    function Le() {
      return be ? !0 : !(d.unstable_now() - He < Oe);
    }
    function Ye() {
      if (be = !1, D) {
        var g = d.unstable_now();
        He = g;
        var Y = !0;
        try {
          e: {
            oe = !1, _e && (_e = !1, de(he), he = -1), P = !0;
            var te = S;
            try {
              t: {
                for (ue(g), K = k(L); K !== null && !(K.expirationTime > g && Le()); ) {
                  var ke = K.callback;
                  if (typeof ke == "function") {
                    K.callback = null, S = K.priorityLevel;
                    var h = ke(
                      K.expirationTime <= g
                    );
                    if (g = d.unstable_now(), typeof h == "function") {
                      K.callback = h, ue(g), Y = !0;
                      break t;
                    }
                    K === k(L) && o(L), ue(g);
                  } else o(L);
                  K = k(L);
                }
                if (K !== null) Y = !0;
                else {
                  var q = k(x);
                  q !== null && le(
                    se,
                    q.startTime - g
                  ), Y = !1;
                }
              }
              break e;
            } finally {
              K = null, S = te, P = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? xe() : D = !1;
        }
      }
    }
    var xe;
    if (typeof V == "function")
      xe = function() {
        V(Ye);
      };
    else if (typeof MessageChannel < "u") {
      var ae = new MessageChannel(), A = ae.port2;
      ae.port1.onmessage = Ye, xe = function() {
        A.postMessage(null);
      };
    } else
      xe = function() {
        ge(Ye, 0);
      };
    function le(g, Y) {
      he = ge(function() {
        g(d.unstable_now());
      }, Y);
    }
    d.unstable_IdlePriority = 5, d.unstable_ImmediatePriority = 1, d.unstable_LowPriority = 4, d.unstable_NormalPriority = 3, d.unstable_Profiling = null, d.unstable_UserBlockingPriority = 2, d.unstable_cancelCallback = function(g) {
      g.callback = null;
    }, d.unstable_forceFrameRate = function(g) {
      0 > g || 125 < g ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Oe = 0 < g ? Math.floor(1e3 / g) : 5;
    }, d.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, d.unstable_next = function(g) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = S;
      }
      var te = S;
      S = Y;
      try {
        return g();
      } finally {
        S = te;
      }
    }, d.unstable_requestPaint = function() {
      be = !0;
    }, d.unstable_runWithPriority = function(g, Y) {
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
      var te = S;
      S = g;
      try {
        return Y();
      } finally {
        S = te;
      }
    }, d.unstable_scheduleCallback = function(g, Y, te) {
      var ke = d.unstable_now();
      switch (typeof te == "object" && te !== null ? (te = te.delay, te = typeof te == "number" && 0 < te ? ke + te : ke) : te = ke, g) {
        case 1:
          var h = -1;
          break;
        case 2:
          h = 250;
          break;
        case 5:
          h = 1073741823;
          break;
        case 4:
          h = 1e4;
          break;
        default:
          h = 5e3;
      }
      return h = te + h, g = {
        id: T++,
        callback: Y,
        priorityLevel: g,
        startTime: te,
        expirationTime: h,
        sortIndex: -1
      }, te > ke ? (g.sortIndex = te, j(x, g), k(L) === null && g === k(x) && (_e ? (de(he), he = -1) : _e = !0, le(se, te - ke))) : (g.sortIndex = h, j(L, g), oe || P || (oe = !0, D || (D = !0, xe()))), g;
    }, d.unstable_shouldYield = Le, d.unstable_wrapCallback = function(g) {
      var Y = S;
      return function() {
        var te = S;
        S = Y;
        try {
          return g.apply(this, arguments);
        } finally {
          S = te;
        }
      };
    };
  })(eu)), eu;
}
var lf;
function ej() {
  return lf || (lf = 1, Pr.exports = Px()), Pr.exports;
}
var tu = { exports: {} }, tt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var af;
function tj() {
  if (af) return tt;
  af = 1;
  var d = Symbol.for("react.transitional.element"), j = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), H = Symbol.for("react.profiler"), G = Symbol.for("react.consumer"), X = Symbol.for("react.context"), M = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), K = Symbol.iterator;
  function S(h) {
    return h === null || typeof h != "object" ? null : (h = K && h[K] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var P = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, oe = Object.assign, _e = {};
  function be(h, q, W) {
    this.props = h, this.context = q, this.refs = _e, this.updater = W || P;
  }
  be.prototype.isReactComponent = {}, be.prototype.setState = function(h, q) {
    if (typeof h != "object" && typeof h != "function" && h != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, h, q, "setState");
  }, be.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function ge() {
  }
  ge.prototype = be.prototype;
  function de(h, q, W) {
    this.props = h, this.context = q, this.refs = _e, this.updater = W || P;
  }
  var V = de.prototype = new ge();
  V.constructor = de, oe(V, be.prototype), V.isPureReactComponent = !0;
  var ue = Array.isArray, se = { H: null, A: null, T: null, S: null, V: null }, D = Object.prototype.hasOwnProperty;
  function he(h, q, W, ee, ie, Q) {
    return W = Q.ref, {
      $$typeof: d,
      type: h,
      key: q,
      ref: W !== void 0 ? W : null,
      props: Q
    };
  }
  function Oe(h, q) {
    return he(
      h.type,
      q,
      void 0,
      void 0,
      void 0,
      h.props
    );
  }
  function He(h) {
    return typeof h == "object" && h !== null && h.$$typeof === d;
  }
  function Le(h) {
    var q = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(W) {
      return q[W];
    });
  }
  var Ye = /\/+/g;
  function xe(h, q) {
    return typeof h == "object" && h !== null && h.key != null ? Le("" + h.key) : q.toString(36);
  }
  function ae() {
  }
  function A(h) {
    switch (h.status) {
      case "fulfilled":
        return h.value;
      case "rejected":
        throw h.reason;
      default:
        switch (typeof h.status == "string" ? h.then(ae, ae) : (h.status = "pending", h.then(
          function(q) {
            h.status === "pending" && (h.status = "fulfilled", h.value = q);
          },
          function(q) {
            h.status === "pending" && (h.status = "rejected", h.reason = q);
          }
        )), h.status) {
          case "fulfilled":
            return h.value;
          case "rejected":
            throw h.reason;
        }
    }
    throw h;
  }
  function le(h, q, W, ee, ie) {
    var Q = typeof h;
    (Q === "undefined" || Q === "boolean") && (h = null);
    var I = !1;
    if (h === null) I = !0;
    else
      switch (Q) {
        case "bigint":
        case "string":
        case "number":
          I = !0;
          break;
        case "object":
          switch (h.$$typeof) {
            case d:
            case j:
              I = !0;
              break;
            case T:
              return I = h._init, le(
                I(h._payload),
                q,
                W,
                ee,
                ie
              );
          }
      }
    if (I)
      return ie = ie(h), I = ee === "" ? "." + xe(h, 0) : ee, ue(ie) ? (W = "", I != null && (W = I.replace(Ye, "$&/") + "/"), le(ie, q, W, "", function(ze) {
        return ze;
      })) : ie != null && (He(ie) && (ie = Oe(
        ie,
        W + (ie.key == null || h && h.key === ie.key ? "" : ("" + ie.key).replace(
          Ye,
          "$&/"
        ) + "/") + I
      )), q.push(ie)), 1;
    I = 0;
    var Te = ee === "" ? "." : ee + ":";
    if (ue(h))
      for (var ne = 0; ne < h.length; ne++)
        ee = h[ne], Q = Te + xe(ee, ne), I += le(
          ee,
          q,
          W,
          Q,
          ie
        );
    else if (ne = S(h), typeof ne == "function")
      for (h = ne.call(h), ne = 0; !(ee = h.next()).done; )
        ee = ee.value, Q = Te + xe(ee, ne++), I += le(
          ee,
          q,
          W,
          Q,
          ie
        );
    else if (Q === "object") {
      if (typeof h.then == "function")
        return le(
          A(h),
          q,
          W,
          ee,
          ie
        );
      throw q = String(h), Error(
        "Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return I;
  }
  function g(h, q, W) {
    if (h == null) return h;
    var ee = [], ie = 0;
    return le(h, ee, "", "", function(Q) {
      return q.call(W, Q, ie++);
    }), ee;
  }
  function Y(h) {
    if (h._status === -1) {
      var q = h._result;
      q = q(), q.then(
        function(W) {
          (h._status === 0 || h._status === -1) && (h._status = 1, h._result = W);
        },
        function(W) {
          (h._status === 0 || h._status === -1) && (h._status = 2, h._result = W);
        }
      ), h._status === -1 && (h._status = 0, h._result = q);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var te = typeof reportError == "function" ? reportError : function(h) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var q = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h),
        error: h
      });
      if (!window.dispatchEvent(q)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", h);
      return;
    }
    console.error(h);
  };
  function ke() {
  }
  return tt.Children = {
    map: g,
    forEach: function(h, q, W) {
      g(
        h,
        function() {
          q.apply(this, arguments);
        },
        W
      );
    },
    count: function(h) {
      var q = 0;
      return g(h, function() {
        q++;
      }), q;
    },
    toArray: function(h) {
      return g(h, function(q) {
        return q;
      }) || [];
    },
    only: function(h) {
      if (!He(h))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return h;
    }
  }, tt.Component = be, tt.Fragment = k, tt.Profiler = H, tt.PureComponent = de, tt.StrictMode = o, tt.Suspense = L, tt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = se, tt.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(h) {
      return se.H.useMemoCache(h);
    }
  }, tt.cache = function(h) {
    return function() {
      return h.apply(null, arguments);
    };
  }, tt.cloneElement = function(h, q, W) {
    if (h == null)
      throw Error(
        "The argument must be a React element, but you passed " + h + "."
      );
    var ee = oe({}, h.props), ie = h.key, Q = void 0;
    if (q != null)
      for (I in q.ref !== void 0 && (Q = void 0), q.key !== void 0 && (ie = "" + q.key), q)
        !D.call(q, I) || I === "key" || I === "__self" || I === "__source" || I === "ref" && q.ref === void 0 || (ee[I] = q[I]);
    var I = arguments.length - 2;
    if (I === 1) ee.children = W;
    else if (1 < I) {
      for (var Te = Array(I), ne = 0; ne < I; ne++)
        Te[ne] = arguments[ne + 2];
      ee.children = Te;
    }
    return he(h.type, ie, void 0, void 0, Q, ee);
  }, tt.createContext = function(h) {
    return h = {
      $$typeof: X,
      _currentValue: h,
      _currentValue2: h,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, h.Provider = h, h.Consumer = {
      $$typeof: G,
      _context: h
    }, h;
  }, tt.createElement = function(h, q, W) {
    var ee, ie = {}, Q = null;
    if (q != null)
      for (ee in q.key !== void 0 && (Q = "" + q.key), q)
        D.call(q, ee) && ee !== "key" && ee !== "__self" && ee !== "__source" && (ie[ee] = q[ee]);
    var I = arguments.length - 2;
    if (I === 1) ie.children = W;
    else if (1 < I) {
      for (var Te = Array(I), ne = 0; ne < I; ne++)
        Te[ne] = arguments[ne + 2];
      ie.children = Te;
    }
    if (h && h.defaultProps)
      for (ee in I = h.defaultProps, I)
        ie[ee] === void 0 && (ie[ee] = I[ee]);
    return he(h, Q, void 0, void 0, null, ie);
  }, tt.createRef = function() {
    return { current: null };
  }, tt.forwardRef = function(h) {
    return { $$typeof: M, render: h };
  }, tt.isValidElement = He, tt.lazy = function(h) {
    return {
      $$typeof: T,
      _payload: { _status: -1, _result: h },
      _init: Y
    };
  }, tt.memo = function(h, q) {
    return {
      $$typeof: x,
      type: h,
      compare: q === void 0 ? null : q
    };
  }, tt.startTransition = function(h) {
    var q = se.T, W = {};
    se.T = W;
    try {
      var ee = h(), ie = se.S;
      ie !== null && ie(W, ee), typeof ee == "object" && ee !== null && typeof ee.then == "function" && ee.then(ke, te);
    } catch (Q) {
      te(Q);
    } finally {
      se.T = q;
    }
  }, tt.unstable_useCacheRefresh = function() {
    return se.H.useCacheRefresh();
  }, tt.use = function(h) {
    return se.H.use(h);
  }, tt.useActionState = function(h, q, W) {
    return se.H.useActionState(h, q, W);
  }, tt.useCallback = function(h, q) {
    return se.H.useCallback(h, q);
  }, tt.useContext = function(h) {
    return se.H.useContext(h);
  }, tt.useDebugValue = function() {
  }, tt.useDeferredValue = function(h, q) {
    return se.H.useDeferredValue(h, q);
  }, tt.useEffect = function(h, q, W) {
    var ee = se.H;
    if (typeof W == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return ee.useEffect(h, q);
  }, tt.useId = function() {
    return se.H.useId();
  }, tt.useImperativeHandle = function(h, q, W) {
    return se.H.useImperativeHandle(h, q, W);
  }, tt.useInsertionEffect = function(h, q) {
    return se.H.useInsertionEffect(h, q);
  }, tt.useLayoutEffect = function(h, q) {
    return se.H.useLayoutEffect(h, q);
  }, tt.useMemo = function(h, q) {
    return se.H.useMemo(h, q);
  }, tt.useOptimistic = function(h, q) {
    return se.H.useOptimistic(h, q);
  }, tt.useReducer = function(h, q, W) {
    return se.H.useReducer(h, q, W);
  }, tt.useRef = function(h) {
    return se.H.useRef(h);
  }, tt.useState = function(h) {
    return se.H.useState(h);
  }, tt.useSyncExternalStore = function(h, q, W) {
    return se.H.useSyncExternalStore(
      h,
      q,
      W
    );
  }, tt.useTransition = function() {
    return se.H.useTransition();
  }, tt.version = "19.1.0", tt;
}
var nf;
function ju() {
  return nf || (nf = 1, tu.exports = tj()), tu.exports;
}
var su = { exports: {} }, Pt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cf;
function sj() {
  if (cf) return Pt;
  cf = 1;
  var d = ju();
  function j(L) {
    var x = "https://react.dev/errors/" + L;
    if (1 < arguments.length) {
      x += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var T = 2; T < arguments.length; T++)
        x += "&args[]=" + encodeURIComponent(arguments[T]);
    }
    return "Minified React error #" + L + "; visit " + x + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function k() {
  }
  var o = {
    d: {
      f: k,
      r: function() {
        throw Error(j(522));
      },
      D: k,
      C: k,
      L: k,
      m: k,
      X: k,
      S: k,
      M: k
    },
    p: 0,
    findDOMNode: null
  }, H = Symbol.for("react.portal");
  function G(L, x, T) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: H,
      key: K == null ? null : "" + K,
      children: L,
      containerInfo: x,
      implementation: T
    };
  }
  var X = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function M(L, x) {
    if (L === "font") return "";
    if (typeof x == "string")
      return x === "use-credentials" ? x : "";
  }
  return Pt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Pt.createPortal = function(L, x) {
    var T = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!x || x.nodeType !== 1 && x.nodeType !== 9 && x.nodeType !== 11)
      throw Error(j(299));
    return G(L, x, null, T);
  }, Pt.flushSync = function(L) {
    var x = X.T, T = o.p;
    try {
      if (X.T = null, o.p = 2, L) return L();
    } finally {
      X.T = x, o.p = T, o.d.f();
    }
  }, Pt.preconnect = function(L, x) {
    typeof L == "string" && (x ? (x = x.crossOrigin, x = typeof x == "string" ? x === "use-credentials" ? x : "" : void 0) : x = null, o.d.C(L, x));
  }, Pt.prefetchDNS = function(L) {
    typeof L == "string" && o.d.D(L);
  }, Pt.preinit = function(L, x) {
    if (typeof L == "string" && x && typeof x.as == "string") {
      var T = x.as, K = M(T, x.crossOrigin), S = typeof x.integrity == "string" ? x.integrity : void 0, P = typeof x.fetchPriority == "string" ? x.fetchPriority : void 0;
      T === "style" ? o.d.S(
        L,
        typeof x.precedence == "string" ? x.precedence : void 0,
        {
          crossOrigin: K,
          integrity: S,
          fetchPriority: P
        }
      ) : T === "script" && o.d.X(L, {
        crossOrigin: K,
        integrity: S,
        fetchPriority: P,
        nonce: typeof x.nonce == "string" ? x.nonce : void 0
      });
    }
  }, Pt.preinitModule = function(L, x) {
    if (typeof L == "string")
      if (typeof x == "object" && x !== null) {
        if (x.as == null || x.as === "script") {
          var T = M(
            x.as,
            x.crossOrigin
          );
          o.d.M(L, {
            crossOrigin: T,
            integrity: typeof x.integrity == "string" ? x.integrity : void 0,
            nonce: typeof x.nonce == "string" ? x.nonce : void 0
          });
        }
      } else x == null && o.d.M(L);
  }, Pt.preload = function(L, x) {
    if (typeof L == "string" && typeof x == "object" && x !== null && typeof x.as == "string") {
      var T = x.as, K = M(T, x.crossOrigin);
      o.d.L(L, T, {
        crossOrigin: K,
        integrity: typeof x.integrity == "string" ? x.integrity : void 0,
        nonce: typeof x.nonce == "string" ? x.nonce : void 0,
        type: typeof x.type == "string" ? x.type : void 0,
        fetchPriority: typeof x.fetchPriority == "string" ? x.fetchPriority : void 0,
        referrerPolicy: typeof x.referrerPolicy == "string" ? x.referrerPolicy : void 0,
        imageSrcSet: typeof x.imageSrcSet == "string" ? x.imageSrcSet : void 0,
        imageSizes: typeof x.imageSizes == "string" ? x.imageSizes : void 0,
        media: typeof x.media == "string" ? x.media : void 0
      });
    }
  }, Pt.preloadModule = function(L, x) {
    if (typeof L == "string")
      if (x) {
        var T = M(x.as, x.crossOrigin);
        o.d.m(L, {
          as: typeof x.as == "string" && x.as !== "script" ? x.as : void 0,
          crossOrigin: T,
          integrity: typeof x.integrity == "string" ? x.integrity : void 0
        });
      } else o.d.m(L);
  }, Pt.requestFormReset = function(L) {
    o.d.r(L);
  }, Pt.unstable_batchedUpdates = function(L, x) {
    return L(x);
  }, Pt.useFormState = function(L, x, T) {
    return X.H.useFormState(L, x, T);
  }, Pt.useFormStatus = function() {
    return X.H.useHostTransitionStatus();
  }, Pt.version = "19.1.0", Pt;
}
var rf;
function lj() {
  if (rf) return su.exports;
  rf = 1;
  function d() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d);
      } catch (j) {
        console.error(j);
      }
  }
  return d(), su.exports = sj(), su.exports;
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
var uf;
function aj() {
  if (uf) return yn;
  uf = 1;
  var d = ej(), j = ju(), k = lj();
  function o(e) {
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
  function G(e) {
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
  function X(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function M(e) {
    if (G(e) !== e)
      throw Error(o(188));
  }
  function L(e) {
    var t = e.alternate;
    if (!t) {
      if (t = G(e), t === null) throw Error(o(188));
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
          if (i === l) return M(n), e;
          if (i === a) return M(n), t;
          i = i.sibling;
        }
        throw Error(o(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var c = !1, u = n.child; u; ) {
          if (u === l) {
            c = !0, l = n, a = i;
            break;
          }
          if (u === a) {
            c = !0, a = n, l = i;
            break;
          }
          u = u.sibling;
        }
        if (!c) {
          for (u = i.child; u; ) {
            if (u === l) {
              c = !0, l = i, a = n;
              break;
            }
            if (u === a) {
              c = !0, a = i, l = n;
              break;
            }
            u = u.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (l.alternate !== a) throw Error(o(190));
    }
    if (l.tag !== 3) throw Error(o(188));
    return l.stateNode.current === l ? e : t;
  }
  function x(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = x(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var T = Object.assign, K = Symbol.for("react.element"), S = Symbol.for("react.transitional.element"), P = Symbol.for("react.portal"), oe = Symbol.for("react.fragment"), _e = Symbol.for("react.strict_mode"), be = Symbol.for("react.profiler"), ge = Symbol.for("react.provider"), de = Symbol.for("react.consumer"), V = Symbol.for("react.context"), ue = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), he = Symbol.for("react.memo"), Oe = Symbol.for("react.lazy"), He = Symbol.for("react.activity"), Le = Symbol.for("react.memo_cache_sentinel"), Ye = Symbol.iterator;
  function xe(e) {
    return e === null || typeof e != "object" ? null : (e = Ye && e[Ye] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ae = Symbol.for("react.client.reference");
  function A(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ae ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case oe:
        return "Fragment";
      case be:
        return "Profiler";
      case _e:
        return "StrictMode";
      case se:
        return "Suspense";
      case D:
        return "SuspenseList";
      case He:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case P:
          return "Portal";
        case V:
          return (e.displayName || "Context") + ".Provider";
        case de:
          return (e._context.displayName || "Context") + ".Consumer";
        case ue:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case he:
          return t = e.displayName || null, t !== null ? t : A(e.type) || "Memo";
        case Oe:
          t = e._payload, e = e._init;
          try {
            return A(e(t));
          } catch {
          }
      }
    return null;
  }
  var le = Array.isArray, g = j.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = k.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ke = [], h = -1;
  function q(e) {
    return { current: e };
  }
  function W(e) {
    0 > h || (e.current = ke[h], ke[h] = null, h--);
  }
  function ee(e, t) {
    h++, ke[h] = e.current, e.current = t;
  }
  var ie = q(null), Q = q(null), I = q(null), Te = q(null);
  function ne(e, t) {
    switch (ee(I, t), ee(Q, e), ee(ie, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Eh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Eh(t), e = Oh(t, e);
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
    W(ie), ee(ie, e);
  }
  function ze() {
    W(ie), W(Q), W(I);
  }
  function st(e) {
    e.memoizedState !== null && ee(Te, e);
    var t = ie.current, l = Oh(t, e.type);
    t !== l && (ee(Q, e), ee(ie, l));
  }
  function lt(e) {
    Q.current === e && (W(ie), W(Q)), Te.current === e && (W(Te), xn._currentValue = te);
  }
  var We = Object.prototype.hasOwnProperty, Je = d.unstable_scheduleCallback, Re = d.unstable_cancelCallback, Ue = d.unstable_shouldYield, we = d.unstable_requestPaint, Be = d.unstable_now, Ie = d.unstable_getCurrentPriorityLevel, Fe = d.unstable_ImmediatePriority, ot = d.unstable_UserBlockingPriority, je = d.unstable_NormalPriority, rt = d.unstable_LowPriority, De = d.unstable_IdlePriority, O = d.log, N = d.unstable_setDisableYieldValue, F = null, Se = null;
  function Me(e) {
    if (typeof O == "function" && N(e), Se && typeof Se.setStrictMode == "function")
      try {
        Se.setStrictMode(F, e);
      } catch {
      }
  }
  var et = Math.clz32 ? Math.clz32 : fe, ht = Math.log, B = Math.LN2;
  function fe(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ht(e) / B | 0) | 0;
  }
  var ce = 256, Ve = 4194304;
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
  function ye(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var u = a & 134217727;
    return u !== 0 ? (a = u & ~i, a !== 0 ? n = b(a) : (c &= u, c !== 0 ? n = b(c) : l || (l = u & ~e, l !== 0 && (n = b(l))))) : (u = a & ~i, u !== 0 ? n = b(u) : c !== 0 ? n = b(c) : l || (l = a & ~e, l !== 0 && (n = b(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function ve(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Ge(e, t) {
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
  function jt() {
    var e = ce;
    return ce <<= 1, (ce & 4194048) === 0 && (ce = 256), e;
  }
  function U() {
    var e = Ve;
    return Ve <<= 1, (Ve & 62914560) === 0 && (Ve = 4194304), e;
  }
  function m(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function re(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function pe(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var u = e.entanglements, v = e.expirationTimes, E = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var Z = 31 - et(l), $ = 1 << Z;
      u[Z] = 0, v[Z] = -1;
      var z = E[Z];
      if (z !== null)
        for (E[Z] = null, Z = 0; Z < z.length; Z++) {
          var R = z[Z];
          R !== null && (R.lane &= -536870913);
        }
      l &= ~$;
    }
    a !== 0 && at(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function at(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - et(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function _(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - et(l), n = 1 << a;
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
  function Qe(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ct() {
    var e = Y.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Kh(e.type));
  }
  function Lt(e, t) {
    var l = Y.p;
    try {
      return Y.p = e, t();
    } finally {
      Y.p = l;
    }
  }
  var Yt = Math.random().toString(36).slice(2), it = "__reactFiber$" + Yt, Nt = "__reactProps$" + Yt, p = "__reactContainer$" + Yt, Ne = "__reactEvents$" + Yt, Pe = "__reactListeners$" + Yt, vt = "__reactHandles$" + Yt, f = "__reactResources$" + Yt, Ce = "__reactMarker$" + Yt;
  function Ee(e) {
    delete e[it], delete e[Nt], delete e[Ne], delete e[Pe], delete e[vt];
  }
  function $e(e) {
    var t = e[it];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[p] || l[it]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Uh(e); e !== null; ) {
            if (l = e[it]) return l;
            e = Uh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Xt(e) {
    if (e = e[it] || e[p]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function ks(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function Us(e) {
    var t = e[f];
    return t || (t = e[f] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Rt(e) {
    e[Ce] = !0;
  }
  var wa = /* @__PURE__ */ new Set(), ka = {};
  function Ft(e, t) {
    Fs(e, t), Fs(e + "Capture", t);
  }
  function Fs(e, t) {
    for (ka[e] = t, e = 0; e < t.length; e++)
      wa.add(t[e]);
  }
  var Qf = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), pu = {}, gu = {};
  function Xf(e) {
    return We.call(gu, e) ? !0 : We.call(pu, e) ? !1 : Qf.test(e) ? gu[e] = !0 : (pu[e] = !0, !1);
  }
  function En(e, t, l) {
    if (Xf(t))
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
  function On(e, t, l) {
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
  function Rs(e, t, l, a) {
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
  var Zi, bu;
  function Bl(e) {
    if (Zi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Zi = t && t[1] || "", bu = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Zi + e + bu;
  }
  var Vi = !1;
  function Ji(e, t) {
    if (!e || Vi) return "";
    Vi = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var $ = function() {
                throw Error();
              };
              if (Object.defineProperty($.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct($, []);
                } catch (R) {
                  var z = R;
                }
                Reflect.construct(e, [], $);
              } else {
                try {
                  $.call();
                } catch (R) {
                  z = R;
                }
                e.call($.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (R) {
                z = R;
              }
              ($ = e()) && typeof $.catch == "function" && $.catch(function() {
              });
            }
          } catch (R) {
            if (R && z && typeof R.stack == "string")
              return [R.stack, z.stack];
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
      var i = a.DetermineComponentFrameRoot(), c = i[0], u = i[1];
      if (c && u) {
        var v = c.split(`
`), E = u.split(`
`);
        for (n = a = 0; a < v.length && !v[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < E.length && !E[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === v.length || n === E.length)
          for (a = v.length - 1, n = E.length - 1; 1 <= a && 0 <= n && v[a] !== E[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (v[a] !== E[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || v[a] !== E[n]) {
                  var Z = `
` + v[a].replace(" at new ", " at ");
                  return e.displayName && Z.includes("<anonymous>") && (Z = Z.replace("<anonymous>", e.displayName)), Z;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Vi = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Bl(l) : "";
  }
  function Zf(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Bl(e.type);
      case 16:
        return Bl("Lazy");
      case 13:
        return Bl("Suspense");
      case 19:
        return Bl("SuspenseList");
      case 0:
      case 15:
        return Ji(e.type, !1);
      case 11:
        return Ji(e.type.render, !1);
      case 1:
        return Ji(e.type, !0);
      case 31:
        return Bl("Activity");
      default:
        return "";
    }
  }
  function yu(e) {
    try {
      var t = "";
      do
        t += Zf(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function hs(e) {
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
  function _u(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Vf(e) {
    var t = _u(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
  function Tn(e) {
    e._valueTracker || (e._valueTracker = Vf(e));
  }
  function Nu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = _u(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function zn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Jf = /[\n"\\]/g;
  function fs(e) {
    return e.replace(
      Jf,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Ki(e, t, l, a, n, i, c, u) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + hs(t)) : e.value !== "" + hs(t) && (e.value = "" + hs(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? $i(e, c, hs(t)) : l != null ? $i(e, c, hs(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? e.name = "" + hs(u) : e.removeAttribute("name");
  }
  function Su(e, t, l, a, n, i, c, u) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + hs(l) : "", t = t != null ? "" + hs(t) : l, u || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = u ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function $i(e, t, l) {
    t === "number" && zn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Ll(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + hs(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function wu(e, t, l) {
    if (t != null && (t = "" + hs(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + hs(l) : "";
  }
  function ku(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (le(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = hs(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
  }
  function Yl(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Kf = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Cu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Kf.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Eu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Cu(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Cu(e, i, t[i]);
  }
  function Wi(e) {
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
  var $f = /* @__PURE__ */ new Map([
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
  ]), Wf = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function An(e) {
    return Wf.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var Fi = null;
  function Ii(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Gl = null, Ql = null;
  function Ou(e) {
    var t = Xt(e);
    if (t && (e = t.stateNode)) {
      var l = e[Nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Ki(
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
              'input[name="' + fs(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[Nt] || null;
                if (!n) throw Error(o(90));
                Ki(
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
              a = l[t], a.form === e.form && Nu(a);
          }
          break e;
        case "textarea":
          wu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Ll(e, !!l.multiple, t, !1);
      }
    }
  }
  var Pi = !1;
  function Tu(e, t, l) {
    if (Pi) return e(t, l);
    Pi = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (Pi = !1, (Gl !== null || Ql !== null) && (vi(), Gl && (t = Gl, e = Ql, Ql = Gl = null, Ou(t), e)))
        for (t = 0; t < e.length; t++) Ou(e[t]);
    }
  }
  function Ca(e, t) {
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
  var Ds = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ec = !1;
  if (Ds)
    try {
      var Ea = {};
      Object.defineProperty(Ea, "passive", {
        get: function() {
          ec = !0;
        }
      }), window.addEventListener("test", Ea, Ea), window.removeEventListener("test", Ea, Ea);
    } catch {
      ec = !1;
    }
  var Is = null, tc = null, Un = null;
  function zu() {
    if (Un) return Un;
    var e, t = tc, l = t.length, a, n = "value" in Is ? Is.value : Is.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Un = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Rn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Dn() {
    return !0;
  }
  function Au() {
    return !1;
  }
  function ts(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var u in e)
        e.hasOwnProperty(u) && (l = e[u], this[u] = l ? l(i) : i[u]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Dn : Au, this.isPropagationStopped = Au, this;
    }
    return T(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Dn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Dn);
      },
      persist: function() {
      },
      isPersistent: Dn
    }), t;
  }
  var Nl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Mn = ts(Nl), Oa = T({}, Nl, { view: 0, detail: 0 }), Ff = ts(Oa), sc, lc, Ta, qn = T({}, Oa, {
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
    getModifierState: nc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ta && (Ta && e.type === "mousemove" ? (sc = e.screenX - Ta.screenX, lc = e.screenY - Ta.screenY) : lc = sc = 0, Ta = e), sc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : lc;
    }
  }), Uu = ts(qn), If = T({}, qn, { dataTransfer: 0 }), Pf = ts(If), em = T({}, Oa, { relatedTarget: 0 }), ac = ts(em), tm = T({}, Nl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), sm = ts(tm), lm = T({}, Nl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), am = ts(lm), nm = T({}, Nl, { data: 0 }), Ru = ts(nm), im = {
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
  }, cm = {
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
  }, rm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function um(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = rm[e]) ? !!t[e] : !1;
  }
  function nc() {
    return um;
  }
  var dm = T({}, Oa, {
    key: function(e) {
      if (e.key) {
        var t = im[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Rn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? cm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: nc,
    charCode: function(e) {
      return e.type === "keypress" ? Rn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Rn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), om = ts(dm), hm = T({}, qn, {
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
  }), Du = ts(hm), fm = T({}, Oa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: nc
  }), mm = ts(fm), xm = T({}, Nl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), jm = ts(xm), vm = T({}, qn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), pm = ts(vm), gm = T({}, Nl, {
    newState: 0,
    oldState: 0
  }), bm = ts(gm), ym = [9, 13, 27, 32], ic = Ds && "CompositionEvent" in window, za = null;
  Ds && "documentMode" in document && (za = document.documentMode);
  var _m = Ds && "TextEvent" in window && !za, Mu = Ds && (!ic || za && 8 < za && 11 >= za), qu = " ", Hu = !1;
  function Bu(e, t) {
    switch (e) {
      case "keyup":
        return ym.indexOf(t.keyCode) !== -1;
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
  function Lu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Xl = !1;
  function Nm(e, t) {
    switch (e) {
      case "compositionend":
        return Lu(t);
      case "keypress":
        return t.which !== 32 ? null : (Hu = !0, qu);
      case "textInput":
        return e = t.data, e === qu && Hu ? null : e;
      default:
        return null;
    }
  }
  function Sm(e, t) {
    if (Xl)
      return e === "compositionend" || !ic && Bu(e, t) ? (e = zu(), Un = tc = Is = null, Xl = !1, e) : null;
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
        return Mu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var wm = {
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
  function Yu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!wm[e.type] : t === "textarea";
  }
  function Gu(e, t, l, a) {
    Gl ? Ql ? Ql.push(a) : Ql = [a] : Gl = a, t = Ni(t, "onChange"), 0 < t.length && (l = new Mn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Aa = null, Ua = null;
  function km(e) {
    Nh(e, 0);
  }
  function Hn(e) {
    var t = ks(e);
    if (Nu(t)) return e;
  }
  function Qu(e, t) {
    if (e === "change") return t;
  }
  var Xu = !1;
  if (Ds) {
    var cc;
    if (Ds) {
      var rc = "oninput" in document;
      if (!rc) {
        var Zu = document.createElement("div");
        Zu.setAttribute("oninput", "return;"), rc = typeof Zu.oninput == "function";
      }
      cc = rc;
    } else cc = !1;
    Xu = cc && (!document.documentMode || 9 < document.documentMode);
  }
  function Vu() {
    Aa && (Aa.detachEvent("onpropertychange", Ju), Ua = Aa = null);
  }
  function Ju(e) {
    if (e.propertyName === "value" && Hn(Ua)) {
      var t = [];
      Gu(
        t,
        Ua,
        e,
        Ii(e)
      ), Tu(km, t);
    }
  }
  function Cm(e, t, l) {
    e === "focusin" ? (Vu(), Aa = t, Ua = l, Aa.attachEvent("onpropertychange", Ju)) : e === "focusout" && Vu();
  }
  function Em(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Hn(Ua);
  }
  function Om(e, t) {
    if (e === "click") return Hn(t);
  }
  function Tm(e, t) {
    if (e === "input" || e === "change")
      return Hn(t);
  }
  function zm(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ns = typeof Object.is == "function" ? Object.is : zm;
  function Ra(e, t) {
    if (ns(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!We.call(t, n) || !ns(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Ku(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function $u(e, t) {
    var l = Ku(e);
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
      l = Ku(l);
    }
  }
  function Wu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Wu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Fu(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = zn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = zn(e.document);
    }
    return t;
  }
  function uc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Am = Ds && "documentMode" in document && 11 >= document.documentMode, Zl = null, dc = null, Da = null, oc = !1;
  function Iu(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    oc || Zl == null || Zl !== zn(a) || (a = Zl, "selectionStart" in a && uc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Da && Ra(Da, a) || (Da = a, a = Ni(dc, "onSelect"), 0 < a.length && (t = new Mn(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Zl)));
  }
  function Sl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Vl = {
    animationend: Sl("Animation", "AnimationEnd"),
    animationiteration: Sl("Animation", "AnimationIteration"),
    animationstart: Sl("Animation", "AnimationStart"),
    transitionrun: Sl("Transition", "TransitionRun"),
    transitionstart: Sl("Transition", "TransitionStart"),
    transitioncancel: Sl("Transition", "TransitionCancel"),
    transitionend: Sl("Transition", "TransitionEnd")
  }, hc = {}, Pu = {};
  Ds && (Pu = document.createElement("div").style, "AnimationEvent" in window || (delete Vl.animationend.animation, delete Vl.animationiteration.animation, delete Vl.animationstart.animation), "TransitionEvent" in window || delete Vl.transitionend.transition);
  function wl(e) {
    if (hc[e]) return hc[e];
    if (!Vl[e]) return e;
    var t = Vl[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Pu)
        return hc[e] = t[l];
    return e;
  }
  var ed = wl("animationend"), td = wl("animationiteration"), sd = wl("animationstart"), Um = wl("transitionrun"), Rm = wl("transitionstart"), Dm = wl("transitioncancel"), ld = wl("transitionend"), ad = /* @__PURE__ */ new Map(), fc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  fc.push("scrollEnd");
  function ys(e, t) {
    ad.set(e, t), Ft(t, [e]);
  }
  var nd = /* @__PURE__ */ new WeakMap();
  function ms(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = nd.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: yu(t)
      }, nd.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: yu(t)
    };
  }
  var xs = [], Jl = 0, mc = 0;
  function Bn() {
    for (var e = Jl, t = mc = Jl = 0; t < e; ) {
      var l = xs[t];
      xs[t++] = null;
      var a = xs[t];
      xs[t++] = null;
      var n = xs[t];
      xs[t++] = null;
      var i = xs[t];
      if (xs[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && id(l, n, i);
    }
  }
  function Ln(e, t, l, a) {
    xs[Jl++] = e, xs[Jl++] = t, xs[Jl++] = l, xs[Jl++] = a, mc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function xc(e, t, l, a) {
    return Ln(e, t, l, a), Yn(e);
  }
  function Kl(e, t) {
    return Ln(e, null, null, t), Yn(e);
  }
  function id(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - et(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function Yn(e) {
    if (50 < cn)
      throw cn = 0, yr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var $l = {};
  function Mm(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function is(e, t, l, a) {
    return new Mm(e, t, l, a);
  }
  function jc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ms(e, t) {
    var l = e.alternate;
    return l === null ? (l = is(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function cd(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Gn(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") jc(e) && (c = 1);
    else if (typeof e == "string")
      c = Hx(
        e,
        l,
        ie.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case He:
          return e = is(31, l, t, n), e.elementType = He, e.lanes = i, e;
        case oe:
          return kl(l.children, n, i, t);
        case _e:
          c = 8, n |= 24;
          break;
        case be:
          return e = is(12, l, t, n | 2), e.elementType = be, e.lanes = i, e;
        case se:
          return e = is(13, l, t, n), e.elementType = se, e.lanes = i, e;
        case D:
          return e = is(19, l, t, n), e.elementType = D, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case ge:
              case V:
                c = 10;
                break e;
              case de:
                c = 9;
                break e;
              case ue:
                c = 11;
                break e;
              case he:
                c = 14;
                break e;
              case Oe:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = is(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function kl(e, t, l, a) {
    return e = is(7, e, a, t), e.lanes = l, e;
  }
  function vc(e, t, l) {
    return e = is(6, e, null, t), e.lanes = l, e;
  }
  function pc(e, t, l) {
    return t = is(
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
  var Wl = [], Fl = 0, Qn = null, Xn = 0, js = [], vs = 0, Cl = null, qs = 1, Hs = "";
  function El(e, t) {
    Wl[Fl++] = Xn, Wl[Fl++] = Qn, Qn = e, Xn = t;
  }
  function rd(e, t, l) {
    js[vs++] = qs, js[vs++] = Hs, js[vs++] = Cl, Cl = e;
    var a = qs;
    e = Hs;
    var n = 32 - et(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - et(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, qs = 1 << 32 - et(t) + n | l << n | a, Hs = i + e;
    } else
      qs = 1 << i | l << n | a, Hs = e;
  }
  function gc(e) {
    e.return !== null && (El(e, 1), rd(e, 1, 0));
  }
  function bc(e) {
    for (; e === Qn; )
      Qn = Wl[--Fl], Wl[Fl] = null, Xn = Wl[--Fl], Wl[Fl] = null;
    for (; e === Cl; )
      Cl = js[--vs], js[vs] = null, Hs = js[--vs], js[vs] = null, qs = js[--vs], js[vs] = null;
  }
  var es = null, At = null, xt = !1, Ol = null, Cs = !1, yc = Error(o(519));
  function Tl(e) {
    var t = Error(o(418, ""));
    throw Ha(ms(t, e)), yc;
  }
  function ud(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[it] = e, t[Nt] = a, l) {
      case "dialog":
        dt("cancel", t), dt("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        dt("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < un.length; l++)
          dt(un[l], t);
        break;
      case "source":
        dt("error", t);
        break;
      case "img":
      case "image":
      case "link":
        dt("error", t), dt("load", t);
        break;
      case "details":
        dt("toggle", t);
        break;
      case "input":
        dt("invalid", t), Su(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Tn(t);
        break;
      case "select":
        dt("invalid", t);
        break;
      case "textarea":
        dt("invalid", t), ku(t, a.value, a.defaultValue, a.children), Tn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Ch(t.textContent, l) ? (a.popover != null && (dt("beforetoggle", t), dt("toggle", t)), a.onScroll != null && dt("scroll", t), a.onScrollEnd != null && dt("scrollend", t), a.onClick != null && (t.onclick = Si), t = !0) : t = !1, t || Tl(e);
  }
  function dd(e) {
    for (es = e.return; es; )
      switch (es.tag) {
        case 5:
        case 13:
          Cs = !1;
          return;
        case 27:
        case 3:
          Cs = !0;
          return;
        default:
          es = es.return;
      }
  }
  function Ma(e) {
    if (e !== es) return !1;
    if (!xt) return dd(e), xt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || qr(e.type, e.memoizedProps)), l = !l), l && At && Tl(e), dd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                At = Ns(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        At = null;
      }
    } else
      t === 27 ? (t = At, ml(e.type) ? (e = Yr, Yr = null, At = e) : At = t) : At = es ? Ns(e.stateNode.nextSibling) : null;
    return !0;
  }
  function qa() {
    At = es = null, xt = !1;
  }
  function od() {
    var e = Ol;
    return e !== null && (as === null ? as = e : as.push.apply(
      as,
      e
    ), Ol = null), e;
  }
  function Ha(e) {
    Ol === null ? Ol = [e] : Ol.push(e);
  }
  var _c = q(null), zl = null, Bs = null;
  function Ps(e, t, l) {
    ee(_c, t._currentValue), t._currentValue = l;
  }
  function Ls(e) {
    e._currentValue = _c.current, W(_c);
  }
  function Nc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Sc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var u = i;
          i = n;
          for (var v = 0; v < t.length; v++)
            if (u.context === t[v]) {
              i.lanes |= l, u = i.alternate, u !== null && (u.lanes |= l), Nc(
                i.return,
                l,
                e
              ), a || (c = null);
              break e;
            }
          i = u.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(o(341));
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Nc(c, l, e), c = null;
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
  function Ba(e, t, l, a) {
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
          var u = n.type;
          ns(n.pendingProps.value, c.value) || (e !== null ? e.push(u) : e = [u]);
        }
      } else if (n === Te.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(xn) : e = [xn]);
      }
      n = n.return;
    }
    e !== null && Sc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Zn(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!ns(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Al(e) {
    zl = e, Bs = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function It(e) {
    return hd(zl, e);
  }
  function Vn(e, t) {
    return zl === null && Al(e), hd(e, t);
  }
  function hd(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Bs === null) {
      if (e === null) throw Error(o(308));
      Bs = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Bs = Bs.next = t;
    return l;
  }
  var qm = typeof AbortController < "u" ? AbortController : function() {
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
  }, Hm = d.unstable_scheduleCallback, Bm = d.unstable_NormalPriority, Gt = {
    $$typeof: V,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function wc() {
    return {
      controller: new qm(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function La(e) {
    e.refCount--, e.refCount === 0 && Hm(Bm, function() {
      e.controller.abort();
    });
  }
  var Ya = null, kc = 0, Il = 0, Pl = null;
  function Lm(e, t) {
    if (Ya === null) {
      var l = Ya = [];
      kc = 0, Il = Er(), Pl = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return kc++, t.then(fd, fd), t;
  }
  function fd() {
    if (--kc === 0 && Ya !== null) {
      Pl !== null && (Pl.status = "fulfilled");
      var e = Ya;
      Ya = null, Il = 0, Pl = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Ym(e, t) {
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
  var md = g.S;
  g.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && Lm(e, t), md !== null && md(e, t);
  };
  var Ul = q(null);
  function Cc() {
    var e = Ul.current;
    return e !== null ? e : wt.pooledCache;
  }
  function Jn(e, t) {
    t === null ? ee(Ul, Ul.current) : ee(Ul, t.pool);
  }
  function xd() {
    var e = Cc();
    return e === null ? null : { parent: Gt._currentValue, pool: e };
  }
  var Ga = Error(o(460)), jd = Error(o(474)), Kn = Error(o(542)), Ec = { then: function() {
  } };
  function vd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function $n() {
  }
  function pd(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then($n, $n), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, bd(e), e;
      default:
        if (typeof t.status == "string") t.then($n, $n);
        else {
          if (e = wt, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, bd(e), e;
        }
        throw Qa = t, Ga;
    }
  }
  var Qa = null;
  function gd() {
    if (Qa === null) throw Error(o(459));
    var e = Qa;
    return Qa = null, e;
  }
  function bd(e) {
    if (e === Ga || e === Kn)
      throw Error(o(483));
  }
  var el = !1;
  function Oc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Tc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function tl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function sl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (pt & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Yn(e), id(e, null, l), t;
    }
    return Ln(e, a, t, l), Yn(e);
  }
  function Xa(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  function zc(e, t) {
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
  var Ac = !1;
  function Za() {
    if (Ac) {
      var e = Pl;
      if (e !== null) throw e;
    }
  }
  function Va(e, t, l, a) {
    Ac = !1;
    var n = e.updateQueue;
    el = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, u = n.shared.pending;
    if (u !== null) {
      n.shared.pending = null;
      var v = u, E = v.next;
      v.next = null, c === null ? i = E : c.next = E, c = v;
      var Z = e.alternate;
      Z !== null && (Z = Z.updateQueue, u = Z.lastBaseUpdate, u !== c && (u === null ? Z.firstBaseUpdate = E : u.next = E, Z.lastBaseUpdate = v));
    }
    if (i !== null) {
      var $ = n.baseState;
      c = 0, Z = E = v = null, u = i;
      do {
        var z = u.lane & -536870913, R = z !== u.lane;
        if (R ? (ft & z) === z : (a & z) === z) {
          z !== 0 && z === Il && (Ac = !0), Z !== null && (Z = Z.next = {
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          });
          e: {
            var Ke = e, Xe = u;
            z = t;
            var _t = l;
            switch (Xe.tag) {
              case 1:
                if (Ke = Xe.payload, typeof Ke == "function") {
                  $ = Ke.call(_t, $, z);
                  break e;
                }
                $ = Ke;
                break e;
              case 3:
                Ke.flags = Ke.flags & -65537 | 128;
              case 0:
                if (Ke = Xe.payload, z = typeof Ke == "function" ? Ke.call(_t, $, z) : Ke, z == null) break e;
                $ = T({}, $, z);
                break e;
              case 2:
                el = !0;
            }
          }
          z = u.callback, z !== null && (e.flags |= 64, R && (e.flags |= 8192), R = n.callbacks, R === null ? n.callbacks = [z] : R.push(z));
        } else
          R = {
            lane: z,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          }, Z === null ? (E = Z = R, v = $) : Z = Z.next = R, c |= z;
        if (u = u.next, u === null) {
          if (u = n.shared.pending, u === null)
            break;
          R = u, u = R.next, R.next = null, n.lastBaseUpdate = R, n.shared.pending = null;
        }
      } while (!0);
      Z === null && (v = $), n.baseState = v, n.firstBaseUpdate = E, n.lastBaseUpdate = Z, i === null && (n.shared.lanes = 0), dl |= c, e.lanes = c, e.memoizedState = $;
    }
  }
  function yd(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function _d(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        yd(l[e], t);
  }
  var ea = q(null), Wn = q(0);
  function Nd(e, t) {
    e = Js, ee(Wn, e), ee(ea, t), Js = e | t.baseLanes;
  }
  function Uc() {
    ee(Wn, Js), ee(ea, ea.current);
  }
  function Rc() {
    Js = Wn.current, W(ea), W(Wn);
  }
  var ll = 0, nt = null, bt = null, Ht = null, Fn = !1, ta = !1, Rl = !1, In = 0, Ja = 0, sa = null, Gm = 0;
  function Dt() {
    throw Error(o(321));
  }
  function Dc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!ns(e[l], t[l])) return !1;
    return !0;
  }
  function Mc(e, t, l, a, n, i) {
    return ll = i, nt = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, g.H = e === null || e.memoizedState === null ? io : co, Rl = !1, i = l(a, n), Rl = !1, ta && (i = wd(
      t,
      l,
      a,
      n
    )), Sd(e), i;
  }
  function Sd(e) {
    g.H = ai;
    var t = bt !== null && bt.next !== null;
    if (ll = 0, Ht = bt = nt = null, Fn = !1, Ja = 0, sa = null, t) throw Error(o(300));
    e === null || Zt || (e = e.dependencies, e !== null && Zn(e) && (Zt = !0));
  }
  function wd(e, t, l, a) {
    nt = e;
    var n = 0;
    do {
      if (ta && (sa = null), Ja = 0, ta = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Ht = bt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      g.H = $m, i = t(l, a);
    } while (ta);
    return i;
  }
  function Qm() {
    var e = g.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Ka(t) : t, e = e.useState()[0], (bt !== null ? bt.memoizedState : null) !== e && (nt.flags |= 1024), t;
  }
  function qc() {
    var e = In !== 0;
    return In = 0, e;
  }
  function Hc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Bc(e) {
    if (Fn) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Fn = !1;
    }
    ll = 0, Ht = bt = nt = null, ta = !1, Ja = In = 0, sa = null;
  }
  function ss() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ht === null ? nt.memoizedState = Ht = e : Ht = Ht.next = e, Ht;
  }
  function Bt() {
    if (bt === null) {
      var e = nt.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = bt.next;
    var t = Ht === null ? nt.memoizedState : Ht.next;
    if (t !== null)
      Ht = t, bt = e;
    else {
      if (e === null)
        throw nt.alternate === null ? Error(o(467)) : Error(o(310));
      bt = e, e = {
        memoizedState: bt.memoizedState,
        baseState: bt.baseState,
        baseQueue: bt.baseQueue,
        queue: bt.queue,
        next: null
      }, Ht === null ? nt.memoizedState = Ht = e : Ht = Ht.next = e;
    }
    return Ht;
  }
  function Lc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ka(e) {
    var t = Ja;
    return Ja += 1, sa === null && (sa = []), e = pd(sa, e, t), t = nt, (Ht === null ? t.memoizedState : Ht.next) === null && (t = t.alternate, g.H = t === null || t.memoizedState === null ? io : co), e;
  }
  function Pn(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Ka(e);
      if (e.$$typeof === V) return It(e);
    }
    throw Error(o(438, String(e)));
  }
  function Yc(e) {
    var t = null, l = nt.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = nt.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Lc(), nt.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Le;
    return t.index++, l;
  }
  function Ys(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ei(e) {
    var t = Bt();
    return Gc(t, bt, e);
  }
  function Gc(e, t, l) {
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
      var u = c = null, v = null, E = t, Z = !1;
      do {
        var $ = E.lane & -536870913;
        if ($ !== E.lane ? (ft & $) === $ : (ll & $) === $) {
          var z = E.revertLane;
          if (z === 0)
            v !== null && (v = v.next = {
              lane: 0,
              revertLane: 0,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }), $ === Il && (Z = !0);
          else if ((ll & z) === z) {
            E = E.next, z === Il && (Z = !0);
            continue;
          } else
            $ = {
              lane: 0,
              revertLane: E.revertLane,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }, v === null ? (u = v = $, c = i) : v = v.next = $, nt.lanes |= z, dl |= z;
          $ = E.action, Rl && l(i, $), i = E.hasEagerState ? E.eagerState : l(i, $);
        } else
          z = {
            lane: $,
            revertLane: E.revertLane,
            action: E.action,
            hasEagerState: E.hasEagerState,
            eagerState: E.eagerState,
            next: null
          }, v === null ? (u = v = z, c = i) : v = v.next = z, nt.lanes |= $, dl |= $;
        E = E.next;
      } while (E !== null && E !== t);
      if (v === null ? c = i : v.next = u, !ns(i, e.memoizedState) && (Zt = !0, Z && (l = Pl, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = v, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Qc(e) {
    var t = Bt(), l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== n);
      ns(i, t.memoizedState) || (Zt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function kd(e, t, l) {
    var a = nt, n = Bt(), i = xt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !ns(
      (bt || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Zt = !0), n = n.queue;
    var u = Od.bind(null, a, n, e);
    if ($a(2048, 8, u, [e]), n.getSnapshot !== t || c || Ht !== null && Ht.memoizedState.tag & 1) {
      if (a.flags |= 2048, la(
        9,
        ti(),
        Ed.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), wt === null) throw Error(o(349));
      i || (ll & 124) !== 0 || Cd(a, t, l);
    }
    return l;
  }
  function Cd(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = nt.updateQueue, t === null ? (t = Lc(), nt.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Ed(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Td(t) && zd(e);
  }
  function Od(e, t, l) {
    return l(function() {
      Td(t) && zd(e);
    });
  }
  function Td(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !ns(e, l);
    } catch {
      return !0;
    }
  }
  function zd(e) {
    var t = Kl(e, 2);
    t !== null && os(t, e, 2);
  }
  function Xc(e) {
    var t = ss();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Rl) {
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
      lastRenderedReducer: Ys,
      lastRenderedState: e
    }, t;
  }
  function Ad(e, t, l, a) {
    return e.baseState = l, Gc(
      e,
      bt,
      typeof a == "function" ? a : Ys
    );
  }
  function Xm(e, t, l, a, n) {
    if (li(e)) throw Error(o(485));
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
      g.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Ud(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Ud(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = g.T, c = {};
      g.T = c;
      try {
        var u = l(n, a), v = g.S;
        v !== null && v(c, u), Rd(e, t, u);
      } catch (E) {
        Zc(e, t, E);
      } finally {
        g.T = i;
      }
    } else
      try {
        i = l(n, a), Rd(e, t, i);
      } catch (E) {
        Zc(e, t, E);
      }
  }
  function Rd(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Dd(e, t, a);
      },
      function(a) {
        return Zc(e, t, a);
      }
    ) : Dd(e, t, l);
  }
  function Dd(e, t, l) {
    t.status = "fulfilled", t.value = l, Md(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Ud(e, l)));
  }
  function Zc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Md(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Md(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function qd(e, t) {
    return t;
  }
  function Hd(e, t) {
    if (xt) {
      var l = wt.formState;
      if (l !== null) {
        e: {
          var a = nt;
          if (xt) {
            if (At) {
              t: {
                for (var n = At, i = Cs; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Ns(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                At = Ns(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Tl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = ss(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: qd,
      lastRenderedState: t
    }, l.queue = a, l = lo.bind(
      null,
      nt,
      a
    ), a.dispatch = l, a = Xc(!1), i = Wc.bind(
      null,
      nt,
      !1,
      a.queue
    ), a = ss(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Xm.bind(
      null,
      nt,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Bd(e) {
    var t = Bt();
    return Ld(t, bt, e);
  }
  function Ld(e, t, l) {
    if (t = Gc(
      e,
      t,
      qd
    )[0], e = ei(Ys)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Ka(t);
      } catch (c) {
        throw c === Ga ? Kn : c;
      }
    else a = t;
    t = Bt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (nt.flags |= 2048, la(
      9,
      ti(),
      Zm.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function Zm(e, t) {
    e.action = t;
  }
  function Yd(e) {
    var t = Bt(), l = bt;
    if (l !== null)
      return Ld(t, l, e);
    Bt(), t = t.memoizedState, l = Bt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function la(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = nt.updateQueue, t === null && (t = Lc(), nt.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function ti() {
    return { destroy: void 0, resource: void 0 };
  }
  function Gd() {
    return Bt().memoizedState;
  }
  function si(e, t, l, a) {
    var n = ss();
    a = a === void 0 ? null : a, nt.flags |= e, n.memoizedState = la(
      1 | t,
      ti(),
      l,
      a
    );
  }
  function $a(e, t, l, a) {
    var n = Bt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    bt !== null && a !== null && Dc(a, bt.memoizedState.deps) ? n.memoizedState = la(t, i, l, a) : (nt.flags |= e, n.memoizedState = la(
      1 | t,
      i,
      l,
      a
    ));
  }
  function Qd(e, t) {
    si(8390656, 8, e, t);
  }
  function Xd(e, t) {
    $a(2048, 8, e, t);
  }
  function Zd(e, t) {
    return $a(4, 2, e, t);
  }
  function Vd(e, t) {
    return $a(4, 4, e, t);
  }
  function Jd(e, t) {
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
  function Kd(e, t, l) {
    l = l != null ? l.concat([e]) : null, $a(4, 4, Jd.bind(null, t, e), l);
  }
  function Vc() {
  }
  function $d(e, t) {
    var l = Bt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Dc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Wd(e, t) {
    var l = Bt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Dc(t, a[1]))
      return a[0];
    if (a = e(), Rl) {
      Me(!0);
      try {
        e();
      } finally {
        Me(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Jc(e, t, l) {
    return l === void 0 || (ll & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = eh(), nt.lanes |= e, dl |= e, l);
  }
  function Fd(e, t, l, a) {
    return ns(l, t) ? l : ea.current !== null ? (e = Jc(e, l, a), ns(e, t) || (Zt = !0), e) : (ll & 42) === 0 ? (Zt = !0, e.memoizedState = l) : (e = eh(), nt.lanes |= e, dl |= e, t);
  }
  function Id(e, t, l, a, n) {
    var i = Y.p;
    Y.p = i !== 0 && 8 > i ? i : 8;
    var c = g.T, u = {};
    g.T = u, Wc(e, !1, t, l);
    try {
      var v = n(), E = g.S;
      if (E !== null && E(u, v), v !== null && typeof v == "object" && typeof v.then == "function") {
        var Z = Ym(
          v,
          a
        );
        Wa(
          e,
          t,
          Z,
          ds(e)
        );
      } else
        Wa(
          e,
          t,
          a,
          ds(e)
        );
    } catch ($) {
      Wa(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: $ },
        ds()
      );
    } finally {
      Y.p = i, g.T = c;
    }
  }
  function Vm() {
  }
  function Kc(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = Pd(e).queue;
    Id(
      e,
      n,
      t,
      te,
      l === null ? Vm : function() {
        return eo(e), l(a);
      }
    );
  }
  function Pd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: te,
      baseState: te,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ys,
        lastRenderedState: te
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
        lastRenderedReducer: Ys,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function eo(e) {
    var t = Pd(e).next.queue;
    Wa(e, t, {}, ds());
  }
  function $c() {
    return It(xn);
  }
  function to() {
    return Bt().memoizedState;
  }
  function so() {
    return Bt().memoizedState;
  }
  function Jm(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = ds();
          e = tl(l);
          var a = sl(t, e, l);
          a !== null && (os(a, t, l), Xa(a, t, l)), t = { cache: wc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Km(e, t, l) {
    var a = ds();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, li(e) ? ao(t, l) : (l = xc(e, t, l, a), l !== null && (os(l, e, a), no(l, t, a)));
  }
  function lo(e, t, l) {
    var a = ds();
    Wa(e, t, l, a);
  }
  function Wa(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (li(e)) ao(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, u = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = u, ns(u, c))
            return Ln(e, t, n, 0), wt === null && Bn(), !1;
        } catch {
        } finally {
        }
      if (l = xc(e, t, n, a), l !== null)
        return os(l, e, a), no(l, t, a), !0;
    }
    return !1;
  }
  function Wc(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Er(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, li(e)) {
      if (t) throw Error(o(479));
    } else
      t = xc(
        e,
        l,
        a,
        2
      ), t !== null && os(t, e, 2);
  }
  function li(e) {
    var t = e.alternate;
    return e === nt || t !== null && t === nt;
  }
  function ao(e, t) {
    ta = Fn = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function no(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  var ai = {
    readContext: It,
    use: Pn,
    useCallback: Dt,
    useContext: Dt,
    useEffect: Dt,
    useImperativeHandle: Dt,
    useLayoutEffect: Dt,
    useInsertionEffect: Dt,
    useMemo: Dt,
    useReducer: Dt,
    useRef: Dt,
    useState: Dt,
    useDebugValue: Dt,
    useDeferredValue: Dt,
    useTransition: Dt,
    useSyncExternalStore: Dt,
    useId: Dt,
    useHostTransitionStatus: Dt,
    useFormState: Dt,
    useActionState: Dt,
    useOptimistic: Dt,
    useMemoCache: Dt,
    useCacheRefresh: Dt
  }, io = {
    readContext: It,
    use: Pn,
    useCallback: function(e, t) {
      return ss().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: It,
    useEffect: Qd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, si(
        4194308,
        4,
        Jd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return si(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      si(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ss();
      t = t === void 0 ? null : t;
      var a = e();
      if (Rl) {
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
      var a = ss();
      if (l !== void 0) {
        var n = l(t);
        if (Rl) {
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
      }, a.queue = e, e = e.dispatch = Km.bind(
        null,
        nt,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ss();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Xc(e);
      var t = e.queue, l = lo.bind(null, nt, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = ss();
      return Jc(l, e, t);
    },
    useTransition: function() {
      var e = Xc(!1);
      return e = Id.bind(
        null,
        nt,
        e.queue,
        !0,
        !1
      ), ss().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = nt, n = ss();
      if (xt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), wt === null)
          throw Error(o(349));
        (ft & 124) !== 0 || Cd(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, Qd(Od.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, la(
        9,
        ti(),
        Ed.bind(
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
      var e = ss(), t = wt.identifierPrefix;
      if (xt) {
        var l = Hs, a = qs;
        l = (a & ~(1 << 32 - et(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = In++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = Gm++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: $c,
    useFormState: Hd,
    useActionState: Hd,
    useOptimistic: function(e) {
      var t = ss();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = Wc.bind(
        null,
        nt,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Yc,
    useCacheRefresh: function() {
      return ss().memoizedState = Jm.bind(
        null,
        nt
      );
    }
  }, co = {
    readContext: It,
    use: Pn,
    useCallback: $d,
    useContext: It,
    useEffect: Xd,
    useImperativeHandle: Kd,
    useInsertionEffect: Zd,
    useLayoutEffect: Vd,
    useMemo: Wd,
    useReducer: ei,
    useRef: Gd,
    useState: function() {
      return ei(Ys);
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = Bt();
      return Fd(
        l,
        bt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ei(Ys)[0], t = Bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Ka(e),
        t
      ];
    },
    useSyncExternalStore: kd,
    useId: to,
    useHostTransitionStatus: $c,
    useFormState: Bd,
    useActionState: Bd,
    useOptimistic: function(e, t) {
      var l = Bt();
      return Ad(l, bt, e, t);
    },
    useMemoCache: Yc,
    useCacheRefresh: so
  }, $m = {
    readContext: It,
    use: Pn,
    useCallback: $d,
    useContext: It,
    useEffect: Xd,
    useImperativeHandle: Kd,
    useInsertionEffect: Zd,
    useLayoutEffect: Vd,
    useMemo: Wd,
    useReducer: Qc,
    useRef: Gd,
    useState: function() {
      return Qc(Ys);
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = Bt();
      return bt === null ? Jc(l, e, t) : Fd(
        l,
        bt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Qc(Ys)[0], t = Bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Ka(e),
        t
      ];
    },
    useSyncExternalStore: kd,
    useId: to,
    useHostTransitionStatus: $c,
    useFormState: Yd,
    useActionState: Yd,
    useOptimistic: function(e, t) {
      var l = Bt();
      return bt !== null ? Ad(l, bt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Yc,
    useCacheRefresh: so
  }, aa = null, Fa = 0;
  function ni(e) {
    var t = Fa;
    return Fa += 1, aa === null && (aa = []), pd(aa, e, t);
  }
  function Ia(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ii(e, t) {
    throw t.$$typeof === K ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function ro(e) {
    var t = e._init;
    return t(e._payload);
  }
  function uo(e) {
    function t(w, y) {
      if (e) {
        var C = w.deletions;
        C === null ? (w.deletions = [y], w.flags |= 16) : C.push(y);
      }
    }
    function l(w, y) {
      if (!e) return null;
      for (; y !== null; )
        t(w, y), y = y.sibling;
      return null;
    }
    function a(w) {
      for (var y = /* @__PURE__ */ new Map(); w !== null; )
        w.key !== null ? y.set(w.key, w) : y.set(w.index, w), w = w.sibling;
      return y;
    }
    function n(w, y) {
      return w = Ms(w, y), w.index = 0, w.sibling = null, w;
    }
    function i(w, y, C) {
      return w.index = C, e ? (C = w.alternate, C !== null ? (C = C.index, C < y ? (w.flags |= 67108866, y) : C) : (w.flags |= 67108866, y)) : (w.flags |= 1048576, y);
    }
    function c(w) {
      return e && w.alternate === null && (w.flags |= 67108866), w;
    }
    function u(w, y, C, J) {
      return y === null || y.tag !== 6 ? (y = vc(C, w.mode, J), y.return = w, y) : (y = n(y, C), y.return = w, y);
    }
    function v(w, y, C, J) {
      var Ae = C.type;
      return Ae === oe ? Z(
        w,
        y,
        C.props.children,
        J,
        C.key
      ) : y !== null && (y.elementType === Ae || typeof Ae == "object" && Ae !== null && Ae.$$typeof === Oe && ro(Ae) === y.type) ? (y = n(y, C.props), Ia(y, C), y.return = w, y) : (y = Gn(
        C.type,
        C.key,
        C.props,
        null,
        w.mode,
        J
      ), Ia(y, C), y.return = w, y);
    }
    function E(w, y, C, J) {
      return y === null || y.tag !== 4 || y.stateNode.containerInfo !== C.containerInfo || y.stateNode.implementation !== C.implementation ? (y = pc(C, w.mode, J), y.return = w, y) : (y = n(y, C.children || []), y.return = w, y);
    }
    function Z(w, y, C, J, Ae) {
      return y === null || y.tag !== 7 ? (y = kl(
        C,
        w.mode,
        J,
        Ae
      ), y.return = w, y) : (y = n(y, C), y.return = w, y);
    }
    function $(w, y, C) {
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return y = vc(
          "" + y,
          w.mode,
          C
        ), y.return = w, y;
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case S:
            return C = Gn(
              y.type,
              y.key,
              y.props,
              null,
              w.mode,
              C
            ), Ia(C, y), C.return = w, C;
          case P:
            return y = pc(
              y,
              w.mode,
              C
            ), y.return = w, y;
          case Oe:
            var J = y._init;
            return y = J(y._payload), $(w, y, C);
        }
        if (le(y) || xe(y))
          return y = kl(
            y,
            w.mode,
            C,
            null
          ), y.return = w, y;
        if (typeof y.then == "function")
          return $(w, ni(y), C);
        if (y.$$typeof === V)
          return $(
            w,
            Vn(w, y),
            C
          );
        ii(w, y);
      }
      return null;
    }
    function z(w, y, C, J) {
      var Ae = y !== null ? y.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return Ae !== null ? null : u(w, y, "" + C, J);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case S:
            return C.key === Ae ? v(w, y, C, J) : null;
          case P:
            return C.key === Ae ? E(w, y, C, J) : null;
          case Oe:
            return Ae = C._init, C = Ae(C._payload), z(w, y, C, J);
        }
        if (le(C) || xe(C))
          return Ae !== null ? null : Z(w, y, C, J, null);
        if (typeof C.then == "function")
          return z(
            w,
            y,
            ni(C),
            J
          );
        if (C.$$typeof === V)
          return z(
            w,
            y,
            Vn(w, C),
            J
          );
        ii(w, C);
      }
      return null;
    }
    function R(w, y, C, J, Ae) {
      if (typeof J == "string" && J !== "" || typeof J == "number" || typeof J == "bigint")
        return w = w.get(C) || null, u(y, w, "" + J, Ae);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case S:
            return w = w.get(
              J.key === null ? C : J.key
            ) || null, v(y, w, J, Ae);
          case P:
            return w = w.get(
              J.key === null ? C : J.key
            ) || null, E(y, w, J, Ae);
          case Oe:
            var ct = J._init;
            return J = ct(J._payload), R(
              w,
              y,
              C,
              J,
              Ae
            );
        }
        if (le(J) || xe(J))
          return w = w.get(C) || null, Z(y, w, J, Ae, null);
        if (typeof J.then == "function")
          return R(
            w,
            y,
            C,
            ni(J),
            Ae
          );
        if (J.$$typeof === V)
          return R(
            w,
            y,
            C,
            Vn(y, J),
            Ae
          );
        ii(y, J);
      }
      return null;
    }
    function Ke(w, y, C, J) {
      for (var Ae = null, ct = null, qe = y, Ze = y = 0, Jt = null; qe !== null && Ze < C.length; Ze++) {
        qe.index > Ze ? (Jt = qe, qe = null) : Jt = qe.sibling;
        var mt = z(
          w,
          qe,
          C[Ze],
          J
        );
        if (mt === null) {
          qe === null && (qe = Jt);
          break;
        }
        e && qe && mt.alternate === null && t(w, qe), y = i(mt, y, Ze), ct === null ? Ae = mt : ct.sibling = mt, ct = mt, qe = Jt;
      }
      if (Ze === C.length)
        return l(w, qe), xt && El(w, Ze), Ae;
      if (qe === null) {
        for (; Ze < C.length; Ze++)
          qe = $(w, C[Ze], J), qe !== null && (y = i(
            qe,
            y,
            Ze
          ), ct === null ? Ae = qe : ct.sibling = qe, ct = qe);
        return xt && El(w, Ze), Ae;
      }
      for (qe = a(qe); Ze < C.length; Ze++)
        Jt = R(
          qe,
          w,
          Ze,
          C[Ze],
          J
        ), Jt !== null && (e && Jt.alternate !== null && qe.delete(
          Jt.key === null ? Ze : Jt.key
        ), y = i(
          Jt,
          y,
          Ze
        ), ct === null ? Ae = Jt : ct.sibling = Jt, ct = Jt);
      return e && qe.forEach(function(gl) {
        return t(w, gl);
      }), xt && El(w, Ze), Ae;
    }
    function Xe(w, y, C, J) {
      if (C == null) throw Error(o(151));
      for (var Ae = null, ct = null, qe = y, Ze = y = 0, Jt = null, mt = C.next(); qe !== null && !mt.done; Ze++, mt = C.next()) {
        qe.index > Ze ? (Jt = qe, qe = null) : Jt = qe.sibling;
        var gl = z(w, qe, mt.value, J);
        if (gl === null) {
          qe === null && (qe = Jt);
          break;
        }
        e && qe && gl.alternate === null && t(w, qe), y = i(gl, y, Ze), ct === null ? Ae = gl : ct.sibling = gl, ct = gl, qe = Jt;
      }
      if (mt.done)
        return l(w, qe), xt && El(w, Ze), Ae;
      if (qe === null) {
        for (; !mt.done; Ze++, mt = C.next())
          mt = $(w, mt.value, J), mt !== null && (y = i(mt, y, Ze), ct === null ? Ae = mt : ct.sibling = mt, ct = mt);
        return xt && El(w, Ze), Ae;
      }
      for (qe = a(qe); !mt.done; Ze++, mt = C.next())
        mt = R(qe, w, Ze, mt.value, J), mt !== null && (e && mt.alternate !== null && qe.delete(mt.key === null ? Ze : mt.key), y = i(mt, y, Ze), ct === null ? Ae = mt : ct.sibling = mt, ct = mt);
      return e && qe.forEach(function(Wx) {
        return t(w, Wx);
      }), xt && El(w, Ze), Ae;
    }
    function _t(w, y, C, J) {
      if (typeof C == "object" && C !== null && C.type === oe && C.key === null && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case S:
            e: {
              for (var Ae = C.key; y !== null; ) {
                if (y.key === Ae) {
                  if (Ae = C.type, Ae === oe) {
                    if (y.tag === 7) {
                      l(
                        w,
                        y.sibling
                      ), J = n(
                        y,
                        C.props.children
                      ), J.return = w, w = J;
                      break e;
                    }
                  } else if (y.elementType === Ae || typeof Ae == "object" && Ae !== null && Ae.$$typeof === Oe && ro(Ae) === y.type) {
                    l(
                      w,
                      y.sibling
                    ), J = n(y, C.props), Ia(J, C), J.return = w, w = J;
                    break e;
                  }
                  l(w, y);
                  break;
                } else t(w, y);
                y = y.sibling;
              }
              C.type === oe ? (J = kl(
                C.props.children,
                w.mode,
                J,
                C.key
              ), J.return = w, w = J) : (J = Gn(
                C.type,
                C.key,
                C.props,
                null,
                w.mode,
                J
              ), Ia(J, C), J.return = w, w = J);
            }
            return c(w);
          case P:
            e: {
              for (Ae = C.key; y !== null; ) {
                if (y.key === Ae)
                  if (y.tag === 4 && y.stateNode.containerInfo === C.containerInfo && y.stateNode.implementation === C.implementation) {
                    l(
                      w,
                      y.sibling
                    ), J = n(y, C.children || []), J.return = w, w = J;
                    break e;
                  } else {
                    l(w, y);
                    break;
                  }
                else t(w, y);
                y = y.sibling;
              }
              J = pc(C, w.mode, J), J.return = w, w = J;
            }
            return c(w);
          case Oe:
            return Ae = C._init, C = Ae(C._payload), _t(
              w,
              y,
              C,
              J
            );
        }
        if (le(C))
          return Ke(
            w,
            y,
            C,
            J
          );
        if (xe(C)) {
          if (Ae = xe(C), typeof Ae != "function") throw Error(o(150));
          return C = Ae.call(C), Xe(
            w,
            y,
            C,
            J
          );
        }
        if (typeof C.then == "function")
          return _t(
            w,
            y,
            ni(C),
            J
          );
        if (C.$$typeof === V)
          return _t(
            w,
            y,
            Vn(w, C),
            J
          );
        ii(w, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint" ? (C = "" + C, y !== null && y.tag === 6 ? (l(w, y.sibling), J = n(y, C), J.return = w, w = J) : (l(w, y), J = vc(C, w.mode, J), J.return = w, w = J), c(w)) : l(w, y);
    }
    return function(w, y, C, J) {
      try {
        Fa = 0;
        var Ae = _t(
          w,
          y,
          C,
          J
        );
        return aa = null, Ae;
      } catch (qe) {
        if (qe === Ga || qe === Kn) throw qe;
        var ct = is(29, qe, null, w.mode);
        return ct.lanes = J, ct.return = w, ct;
      } finally {
      }
    };
  }
  var na = uo(!0), oo = uo(!1), ps = q(null), Es = null;
  function al(e) {
    var t = e.alternate;
    ee(Qt, Qt.current & 1), ee(ps, e), Es === null && (t === null || ea.current !== null || t.memoizedState !== null) && (Es = e);
  }
  function ho(e) {
    if (e.tag === 22) {
      if (ee(Qt, Qt.current), ee(ps, e), Es === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Es = e);
      }
    } else nl();
  }
  function nl() {
    ee(Qt, Qt.current), ee(ps, ps.current);
  }
  function Gs(e) {
    W(ps), Es === e && (Es = null), W(Qt);
  }
  var Qt = q(0);
  function ci(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Lr(l)))
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
  function Fc(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : T({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Ic = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = ds(), n = tl(a);
      n.payload = t, l != null && (n.callback = l), t = sl(e, n, a), t !== null && (os(t, e, a), Xa(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = ds(), n = tl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = sl(e, n, a), t !== null && (os(t, e, a), Xa(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = ds(), a = tl(l);
      a.tag = 2, t != null && (a.callback = t), t = sl(e, a, l), t !== null && (os(t, e, l), Xa(t, e, l));
    }
  };
  function fo(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !Ra(l, a) || !Ra(n, i) : !0;
  }
  function mo(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && Ic.enqueueReplaceState(t, t.state, null);
  }
  function Dl(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = T({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var ri = typeof reportError == "function" ? reportError : function(e) {
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
  function xo(e) {
    ri(e);
  }
  function jo(e) {
    console.error(e);
  }
  function vo(e) {
    ri(e);
  }
  function ui(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function po(e, t, l) {
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
  function Pc(e, t, l) {
    return l = tl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      ui(e, t);
    }, l;
  }
  function go(e) {
    return e = tl(e), e.tag = 3, e;
  }
  function bo(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        po(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      po(t, l, a), typeof n != "function" && (ol === null ? ol = /* @__PURE__ */ new Set([this]) : ol.add(this));
      var u = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: u !== null ? u : ""
      });
    });
  }
  function Wm(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ba(
        t,
        l,
        n,
        !0
      ), l = ps.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Es === null ? Nr() : l.alternate === null && Ut === 0 && (Ut = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Ec ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), wr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Ec ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), wr(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return wr(e, a, n), Nr(), !1;
    }
    if (xt)
      return t = ps.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== yc && (e = Error(o(422), { cause: a }), Ha(ms(e, l)))) : (a !== yc && (t = Error(o(423), {
        cause: a
      }), Ha(
        ms(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = ms(a, l), n = Pc(
        e.stateNode,
        a,
        n
      ), zc(e, n), Ut !== 4 && (Ut = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = ms(i, l), nn === null ? nn = [i] : nn.push(i), Ut !== 4 && (Ut = 2), t === null) return !0;
    a = ms(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = Pc(l.stateNode, a, e), zc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (ol === null || !ol.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = go(n), bo(
              n,
              e,
              l,
              a
            ), zc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var yo = Error(o(461)), Zt = !1;
  function Kt(e, t, l, a) {
    t.child = e === null ? oo(t, null, l, a) : na(
      t,
      e.child,
      l,
      a
    );
  }
  function _o(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var u in a)
        u !== "ref" && (c[u] = a[u]);
    } else c = a;
    return Al(t), a = Mc(
      e,
      t,
      l,
      c,
      i,
      n
    ), u = qc(), e !== null && !Zt ? (Hc(e, t, n), Qs(e, t, n)) : (xt && u && gc(t), t.flags |= 1, Kt(e, t, a, n), t.child);
  }
  function No(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !jc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, So(
        e,
        t,
        i,
        a,
        n
      )) : (e = Gn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !cr(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Ra, l(c, a) && e.ref === t.ref)
        return Qs(e, t, n);
    }
    return t.flags |= 1, e = Ms(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function So(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Ra(i, a) && e.ref === t.ref)
        if (Zt = !1, t.pendingProps = a = i, cr(e, n))
          (e.flags & 131072) !== 0 && (Zt = !0);
        else
          return t.lanes = e.lanes, Qs(e, t, n);
    }
    return er(
      e,
      t,
      l,
      a,
      n
    );
  }
  function wo(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return ko(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Jn(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Nd(t, i) : Uc(), ho(t);
      else
        return t.lanes = t.childLanes = 536870912, ko(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (Jn(t, i.cachePool), Nd(t, i), nl(), t.memoizedState = null) : (e !== null && Jn(t, null), Uc(), nl());
    return Kt(e, t, n, l), t.child;
  }
  function ko(e, t, l, a) {
    var n = Cc();
    return n = n === null ? null : { parent: Gt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && Jn(t, null), Uc(), ho(t), e !== null && Ba(e, t, a, !0), null;
  }
  function di(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function er(e, t, l, a, n) {
    return Al(t), l = Mc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = qc(), e !== null && !Zt ? (Hc(e, t, n), Qs(e, t, n)) : (xt && a && gc(t), t.flags |= 1, Kt(e, t, l, n), t.child);
  }
  function Co(e, t, l, a, n, i) {
    return Al(t), t.updateQueue = null, l = wd(
      t,
      a,
      l,
      n
    ), Sd(e), a = qc(), e !== null && !Zt ? (Hc(e, t, i), Qs(e, t, i)) : (xt && a && gc(t), t.flags |= 1, Kt(e, t, l, i), t.child);
  }
  function Eo(e, t, l, a, n) {
    if (Al(t), t.stateNode === null) {
      var i = $l, c = l.contextType;
      typeof c == "object" && c !== null && (i = It(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = Ic, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Oc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? It(c) : $l, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (Fc(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && Ic.enqueueReplaceState(i, i.state, null), Va(t, a, i, n), Za(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var u = t.memoizedProps, v = Dl(l, u);
      i.props = v;
      var E = i.context, Z = l.contextType;
      c = $l, typeof Z == "object" && Z !== null && (c = It(Z));
      var $ = l.getDerivedStateFromProps;
      Z = typeof $ == "function" || typeof i.getSnapshotBeforeUpdate == "function", u = t.pendingProps !== u, Z || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u || E !== c) && mo(
        t,
        i,
        a,
        c
      ), el = !1;
      var z = t.memoizedState;
      i.state = z, Va(t, a, i, n), Za(), E = t.memoizedState, u || z !== E || el ? (typeof $ == "function" && (Fc(
        t,
        l,
        $,
        a
      ), E = t.memoizedState), (v = el || fo(
        t,
        l,
        v,
        a,
        z,
        E,
        c
      )) ? (Z || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = E), i.props = a, i.state = E, i.context = c, a = v) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Tc(e, t), c = t.memoizedProps, Z = Dl(l, c), i.props = Z, $ = t.pendingProps, z = i.context, E = l.contextType, v = $l, typeof E == "object" && E !== null && (v = It(E)), u = l.getDerivedStateFromProps, (E = typeof u == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== $ || z !== v) && mo(
        t,
        i,
        a,
        v
      ), el = !1, z = t.memoizedState, i.state = z, Va(t, a, i, n), Za();
      var R = t.memoizedState;
      c !== $ || z !== R || el || e !== null && e.dependencies !== null && Zn(e.dependencies) ? (typeof u == "function" && (Fc(
        t,
        l,
        u,
        a
      ), R = t.memoizedState), (Z = el || fo(
        t,
        l,
        Z,
        a,
        z,
        R,
        v
      ) || e !== null && e.dependencies !== null && Zn(e.dependencies)) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, R, v), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        R,
        v
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = R), i.props = a, i.state = R, i.context = v, a = Z) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, di(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = na(
      t,
      e.child,
      null,
      n
    ), t.child = na(
      t,
      null,
      l,
      n
    )) : Kt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Qs(
      e,
      t,
      n
    ), e;
  }
  function Oo(e, t, l, a) {
    return qa(), t.flags |= 256, Kt(e, t, l, a), t.child;
  }
  var tr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function sr(e) {
    return { baseLanes: e, cachePool: xd() };
  }
  function lr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= gs), e;
  }
  function To(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Qt.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (xt) {
        if (n ? al(t) : nl(), xt) {
          var u = At, v;
          if (v = u) {
            e: {
              for (v = u, u = Cs; v.nodeType !== 8; ) {
                if (!u) {
                  u = null;
                  break e;
                }
                if (v = Ns(
                  v.nextSibling
                ), v === null) {
                  u = null;
                  break e;
                }
              }
              u = v;
            }
            u !== null ? (t.memoizedState = {
              dehydrated: u,
              treeContext: Cl !== null ? { id: qs, overflow: Hs } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, v = is(
              18,
              null,
              null,
              0
            ), v.stateNode = u, v.return = t, t.child = v, es = t, At = null, v = !0) : v = !1;
          }
          v || Tl(t);
        }
        if (u = t.memoizedState, u !== null && (u = u.dehydrated, u !== null))
          return Lr(u) ? t.lanes = 32 : t.lanes = 536870912, null;
        Gs(t);
      }
      return u = a.children, a = a.fallback, n ? (nl(), n = t.mode, u = oi(
        { mode: "hidden", children: u },
        n
      ), a = kl(
        a,
        n,
        l,
        null
      ), u.return = t, a.return = t, u.sibling = a, t.child = u, n = t.child, n.memoizedState = sr(l), n.childLanes = lr(
        e,
        c,
        l
      ), t.memoizedState = tr, a) : (al(t), ar(t, u));
    }
    if (v = e.memoizedState, v !== null && (u = v.dehydrated, u !== null)) {
      if (i)
        t.flags & 256 ? (al(t), t.flags &= -257, t = nr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (nl(), t.child = e.child, t.flags |= 128, t = null) : (nl(), n = a.fallback, u = t.mode, a = oi(
          { mode: "visible", children: a.children },
          u
        ), n = kl(
          n,
          u,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, na(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = sr(l), a.childLanes = lr(
          e,
          c,
          l
        ), t.memoizedState = tr, t = n);
      else if (al(t), Lr(u)) {
        if (c = u.nextSibling && u.nextSibling.dataset, c) var E = c.dgst;
        c = E, a = Error(o(419)), a.stack = "", a.digest = c, Ha({ value: a, source: null, stack: null }), t = nr(
          e,
          t,
          l
        );
      } else if (Zt || Ba(e, t, l, !1), c = (l & e.childLanes) !== 0, Zt || c) {
        if (c = wt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : me(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== v.retryLane))
          throw v.retryLane = a, Kl(e, a), os(c, e, a), yo;
        u.data === "$?" || Nr(), t = nr(
          e,
          t,
          l
        );
      } else
        u.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = v.treeContext, At = Ns(
          u.nextSibling
        ), es = t, xt = !0, Ol = null, Cs = !1, e !== null && (js[vs++] = qs, js[vs++] = Hs, js[vs++] = Cl, qs = e.id, Hs = e.overflow, Cl = t), t = ar(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (nl(), n = a.fallback, u = t.mode, v = e.child, E = v.sibling, a = Ms(v, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = v.subtreeFlags & 65011712, E !== null ? n = Ms(E, n) : (n = kl(
      n,
      u,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, u = e.child.memoizedState, u === null ? u = sr(l) : (v = u.cachePool, v !== null ? (E = Gt._currentValue, v = v.parent !== E ? { parent: E, pool: E } : v) : v = xd(), u = {
      baseLanes: u.baseLanes | l,
      cachePool: v
    }), n.memoizedState = u, n.childLanes = lr(
      e,
      c,
      l
    ), t.memoizedState = tr, a) : (al(t), l = e.child, e = l.sibling, l = Ms(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function ar(e, t) {
    return t = oi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function oi(e, t) {
    return e = is(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function nr(e, t, l) {
    return na(t, e.child, null, l), e = ar(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function zo(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Nc(e.return, t, l);
  }
  function ir(e, t, l, a, n) {
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
  function Ao(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (Kt(e, t, a.children, l), a = Qt.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && zo(e, l, t);
          else if (e.tag === 19)
            zo(e, l, t);
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
    switch (ee(Qt, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && ci(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), ir(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && ci(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        ir(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        ir(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Qs(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), dl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ba(
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
      for (e = t.child, l = Ms(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Ms(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function cr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Zn(e)));
  }
  function Fm(e, t, l) {
    switch (t.tag) {
      case 3:
        ne(t, t.stateNode.containerInfo), Ps(t, Gt, e.memoizedState.cache), qa();
        break;
      case 27:
      case 5:
        st(t);
        break;
      case 4:
        ne(t, t.stateNode.containerInfo);
        break;
      case 10:
        Ps(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (al(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? To(e, t, l) : (al(t), e = Qs(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        al(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ba(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Ao(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), ee(Qt, Qt.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, wo(e, t, l);
      case 24:
        Ps(t, Gt, e.memoizedState.cache);
    }
    return Qs(e, t, l);
  }
  function Uo(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Zt = !0;
      else {
        if (!cr(e, l) && (t.flags & 128) === 0)
          return Zt = !1, Fm(
            e,
            t,
            l
          );
        Zt = (e.flags & 131072) !== 0;
      }
    else
      Zt = !1, xt && (t.flags & 1048576) !== 0 && rd(t, Xn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            jc(a) ? (e = Dl(a, e), t.tag = 1, t = Eo(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = er(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === ue) {
                t.tag = 11, t = _o(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === he) {
                t.tag = 14, t = No(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              }
            }
            throw t = A(a) || a, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return er(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = Dl(
          a,
          t.pendingProps
        ), Eo(
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
          n = i.element, Tc(e, t), Va(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, Ps(t, Gt, a), a !== i.cache && Sc(
            t,
            [Gt],
            l,
            !0
          ), Za(), a = c.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Oo(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = ms(
                Error(o(424)),
                t
              ), Ha(n), t = Oo(
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
              for (At = Ns(e.firstChild), es = t, xt = !0, Ol = null, Cs = !0, l = oo(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (qa(), a === n) {
              t = Qs(
                e,
                t,
                l
              );
              break e;
            }
            Kt(
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
        return di(e, t), e === null ? (l = qh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : xt || (l = t.type, e = t.pendingProps, a = wi(
          I.current
        ).createElement(l), a[it] = t, a[Nt] = e, Wt(a, l, e), Rt(a), t.stateNode = a) : t.memoizedState = qh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return st(t), e === null && xt && (a = t.stateNode = Rh(
          t.type,
          t.pendingProps,
          I.current
        ), es = t, Cs = !0, n = At, ml(t.type) ? (Yr = n, At = Ns(
          a.firstChild
        )) : At = n), Kt(
          e,
          t,
          t.pendingProps.children,
          l
        ), di(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && xt && ((n = a = At) && (a = wx(
          a,
          t.type,
          t.pendingProps,
          Cs
        ), a !== null ? (t.stateNode = a, es = t, At = Ns(
          a.firstChild
        ), Cs = !1, n = !0) : n = !1), n || Tl(t)), st(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, qr(n, i) ? a = null : c !== null && qr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Mc(
          e,
          t,
          Qm,
          null,
          null,
          l
        ), xn._currentValue = n), di(e, t), Kt(e, t, a, l), t.child;
      case 6:
        return e === null && xt && ((e = l = At) && (l = kx(
          l,
          t.pendingProps,
          Cs
        ), l !== null ? (t.stateNode = l, es = t, At = null, e = !0) : e = !1), e || Tl(t)), null;
      case 13:
        return To(e, t, l);
      case 4:
        return ne(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = na(
          t,
          null,
          a,
          l
        ) : Kt(
          e,
          t,
          a,
          l
        ), t.child;
      case 11:
        return _o(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return Kt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return Kt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Kt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, Ps(t, t.type, a.value), Kt(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Al(t), n = It(n), a = a(n), t.flags |= 1, Kt(e, t, a, l), t.child;
      case 14:
        return No(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return So(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Ao(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = oi(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Ms(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return wo(e, t, l);
      case 24:
        return Al(t), a = It(Gt), e === null ? (n = Cc(), n === null && (n = wt, i = wc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Oc(t), Ps(t, Gt, n)) : ((e.lanes & l) !== 0 && (Tc(e, t), Va(t, null, null, l), Za()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Ps(t, Gt, a)) : (a = i.cache, Ps(t, Gt, a), a !== n.cache && Sc(
          t,
          [Gt],
          l,
          !0
        ))), Kt(
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
  function Xs(e) {
    e.flags |= 4;
  }
  function Ro(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Gh(t)) {
      if (t = ps.current, t !== null && ((ft & 4194048) === ft ? Es !== null : (ft & 62914560) !== ft && (ft & 536870912) === 0 || t !== Es))
        throw Qa = Ec, jd;
      e.flags |= 8192;
    }
  }
  function hi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? U() : 536870912, e.lanes |= t, ua |= t);
  }
  function Pa(e, t) {
    if (!xt)
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
  function Tt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function Im(e, t, l) {
    var a = t.pendingProps;
    switch (bc(t), t.tag) {
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
        return Tt(t), null;
      case 1:
        return Tt(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ls(Gt), ze(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ma(t) ? Xs(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, od())), Tt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Xs(t), l !== null ? (Tt(t), Ro(t, l)) : (Tt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Xs(t), Tt(t), Ro(t, l)) : (Tt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Xs(t), Tt(t), t.flags &= -16777217), null;
      case 27:
        lt(t), l = I.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Xs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Tt(t), null;
          }
          e = ie.current, Ma(t) ? ud(t) : (e = Rh(n, a, l), t.stateNode = e, Xs(t));
        }
        return Tt(t), null;
      case 5:
        if (lt(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Xs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Tt(t), null;
          }
          if (e = ie.current, Ma(t))
            ud(t);
          else {
            switch (n = wi(
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
            e[it] = t, e[Nt] = a;
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
            e: switch (Wt(e, l, a), l) {
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
            e && Xs(t);
          }
        }
        return Tt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Xs(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = I.current, Ma(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = es, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[it] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Ch(e.nodeValue, l)), e || Tl(t);
          } else
            e = wi(e).createTextNode(
              a
            ), e[it] = t, t.stateNode = e;
        }
        return Tt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ma(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[it] = t;
            } else
              qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Tt(t), n = !1;
          } else
            n = od(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Gs(t), t) : (Gs(t), null);
        }
        if (Gs(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), hi(t, t.updateQueue), Tt(t), null;
      case 4:
        return ze(), e === null && Ar(t.stateNode.containerInfo), Tt(t), null;
      case 10:
        return Ls(t.type), Tt(t), null;
      case 19:
        if (W(Qt), n = t.memoizedState, n === null) return Tt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) Pa(n, !1);
          else {
            if (Ut !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = ci(e), i !== null) {
                  for (t.flags |= 128, Pa(n, !1), e = i.updateQueue, t.updateQueue = e, hi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    cd(l, e), l = l.sibling;
                  return ee(
                    Qt,
                    Qt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && Be() > xi && (t.flags |= 128, a = !0, Pa(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = ci(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, hi(t, e), Pa(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !xt)
                return Tt(t), null;
            } else
              2 * Be() - n.renderingStartTime > xi && l !== 536870912 && (t.flags |= 128, a = !0, Pa(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = Be(), t.sibling = null, e = Qt.current, ee(Qt, a ? e & 1 | 2 : e & 1), t) : (Tt(t), null);
      case 22:
      case 23:
        return Gs(t), Rc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Tt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Tt(t), l = t.updateQueue, l !== null && hi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && W(Ul), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ls(Gt), Tt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function Pm(e, t) {
    switch (bc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ls(Gt), ze(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return lt(t), null;
      case 13:
        if (Gs(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return W(Qt), null;
      case 4:
        return ze(), null;
      case 10:
        return Ls(t.type), null;
      case 22:
      case 23:
        return Gs(t), Rc(), e !== null && W(Ul), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ls(Gt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Do(e, t) {
    switch (bc(t), t.tag) {
      case 3:
        Ls(Gt), ze();
        break;
      case 26:
      case 27:
      case 5:
        lt(t);
        break;
      case 4:
        ze();
        break;
      case 13:
        Gs(t);
        break;
      case 19:
        W(Qt);
        break;
      case 10:
        Ls(t.type);
        break;
      case 22:
      case 23:
        Gs(t), Rc(), e !== null && W(Ul);
        break;
      case 24:
        Ls(Gt);
    }
  }
  function en(e, t) {
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
    } catch (u) {
      St(t, t.return, u);
    }
  }
  function il(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        a = i;
        do {
          if ((a.tag & e) === e) {
            var c = a.inst, u = c.destroy;
            if (u !== void 0) {
              c.destroy = void 0, n = t;
              var v = l, E = u;
              try {
                E();
              } catch (Z) {
                St(
                  n,
                  v,
                  Z
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (Z) {
      St(t, t.return, Z);
    }
  }
  function Mo(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        _d(t, l);
      } catch (a) {
        St(e, e.return, a);
      }
    }
  }
  function qo(e, t, l) {
    l.props = Dl(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      St(e, t, a);
    }
  }
  function tn(e, t) {
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
      St(e, t, n);
    }
  }
  function Os(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          St(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          St(e, t, n);
        }
      else l.current = null;
  }
  function Ho(e) {
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
      St(e, e.return, n);
    }
  }
  function rr(e, t, l) {
    try {
      var a = e.stateNode;
      bx(a, e.type, l, t), a[Nt] = t;
    } catch (n) {
      St(e, e.return, n);
    }
  }
  function Bo(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ml(e.type) || e.tag === 4;
  }
  function ur(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Bo(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ml(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function dr(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Si));
    else if (a !== 4 && (a === 27 && ml(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (dr(e, t, l), e = e.sibling; e !== null; )
        dr(e, t, l), e = e.sibling;
  }
  function fi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && ml(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (fi(e, t, l), e = e.sibling; e !== null; )
        fi(e, t, l), e = e.sibling;
  }
  function Lo(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Wt(t, a, l), t[it] = e, t[Nt] = l;
    } catch (i) {
      St(e, e.return, i);
    }
  }
  var Zs = !1, Mt = !1, or = !1, Yo = typeof WeakSet == "function" ? WeakSet : Set, Vt = null;
  function ex(e, t) {
    if (e = e.containerInfo, Dr = zi, e = Fu(e), uc(e)) {
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
            var c = 0, u = -1, v = -1, E = 0, Z = 0, $ = e, z = null;
            t: for (; ; ) {
              for (var R; $ !== l || n !== 0 && $.nodeType !== 3 || (u = c + n), $ !== i || a !== 0 && $.nodeType !== 3 || (v = c + a), $.nodeType === 3 && (c += $.nodeValue.length), (R = $.firstChild) !== null; )
                z = $, $ = R;
              for (; ; ) {
                if ($ === e) break t;
                if (z === l && ++E === n && (u = c), z === i && ++Z === a && (v = c), (R = $.nextSibling) !== null) break;
                $ = z, z = $.parentNode;
              }
              $ = R;
            }
            l = u === -1 || v === -1 ? null : { start: u, end: v };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Mr = { focusedElem: e, selectionRange: l }, zi = !1, Vt = t; Vt !== null; )
      if (t = Vt, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, Vt = e;
      else
        for (; Vt !== null; ) {
          switch (t = Vt, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var Ke = Dl(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    Ke,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Xe) {
                  St(
                    l,
                    l.return,
                    Xe
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Br(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Br(e);
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
            e.return = t.return, Vt = e;
            break;
          }
          Vt = t.return;
        }
  }
  function Go(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        cl(e, l), a & 4 && en(5, l);
        break;
      case 1:
        if (cl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              St(l, l.return, c);
            }
          else {
            var n = Dl(
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
              St(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Mo(l), a & 512 && tn(l, l.return);
        break;
      case 3:
        if (cl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            _d(e, t);
          } catch (c) {
            St(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Lo(l);
      case 26:
      case 5:
        cl(e, l), t === null && a & 4 && Ho(l), a & 512 && tn(l, l.return);
        break;
      case 12:
        cl(e, l);
        break;
      case 13:
        cl(e, l), a & 4 && Zo(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = ux.bind(
          null,
          l
        ), Cx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Zs, !a) {
          t = t !== null && t.memoizedState !== null || Mt, n = Zs;
          var i = Mt;
          Zs = a, (Mt = t) && !i ? rl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : cl(e, l), Zs = n, Mt = i;
        }
        break;
      case 30:
        break;
      default:
        cl(e, l);
    }
  }
  function Qo(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Qo(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ee(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Et = null, ls = !1;
  function Vs(e, t, l) {
    for (l = l.child; l !== null; )
      Xo(e, t, l), l = l.sibling;
  }
  function Xo(e, t, l) {
    if (Se && typeof Se.onCommitFiberUnmount == "function")
      try {
        Se.onCommitFiberUnmount(F, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Mt || Os(l, t), Vs(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Mt || Os(l, t);
        var a = Et, n = ls;
        ml(l.type) && (Et = l.stateNode, ls = !1), Vs(
          e,
          t,
          l
        ), on(l.stateNode), Et = a, ls = n;
        break;
      case 5:
        Mt || Os(l, t);
      case 6:
        if (a = Et, n = ls, Et = null, Vs(
          e,
          t,
          l
        ), Et = a, ls = n, Et !== null)
          if (ls)
            try {
              (Et.nodeType === 9 ? Et.body : Et.nodeName === "HTML" ? Et.ownerDocument.body : Et).removeChild(l.stateNode);
            } catch (i) {
              St(
                l,
                t,
                i
              );
            }
          else
            try {
              Et.removeChild(l.stateNode);
            } catch (i) {
              St(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Et !== null && (ls ? (e = Et, Ah(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), gn(e)) : Ah(Et, l.stateNode));
        break;
      case 4:
        a = Et, n = ls, Et = l.stateNode.containerInfo, ls = !0, Vs(
          e,
          t,
          l
        ), Et = a, ls = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Mt || il(2, l, t), Mt || il(4, l, t), Vs(
          e,
          t,
          l
        );
        break;
      case 1:
        Mt || (Os(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && qo(
          l,
          t,
          a
        )), Vs(
          e,
          t,
          l
        );
        break;
      case 21:
        Vs(
          e,
          t,
          l
        );
        break;
      case 22:
        Mt = (a = Mt) || l.memoizedState !== null, Vs(
          e,
          t,
          l
        ), Mt = a;
        break;
      default:
        Vs(
          e,
          t,
          l
        );
    }
  }
  function Zo(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        gn(e);
      } catch (l) {
        St(t, t.return, l);
      }
  }
  function tx(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Yo()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Yo()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function hr(e, t) {
    var l = tx(e);
    t.forEach(function(a) {
      var n = dx.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function cs(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, u = c;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 27:
              if (ml(u.type)) {
                Et = u.stateNode, ls = !1;
                break e;
              }
              break;
            case 5:
              Et = u.stateNode, ls = !1;
              break e;
            case 3:
            case 4:
              Et = u.stateNode.containerInfo, ls = !0;
              break e;
          }
          u = u.return;
        }
        if (Et === null) throw Error(o(160));
        Xo(i, c, n), Et = null, ls = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Vo(t, e), t = t.sibling;
  }
  var _s = null;
  function Vo(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        cs(t, e), rs(e), a & 4 && (il(3, e, e.return), en(3, e), il(5, e, e.return));
        break;
      case 1:
        cs(t, e), rs(e), a & 512 && (Mt || l === null || Os(l, l.return)), a & 64 && Zs && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = _s;
        if (cs(t, e), rs(e), a & 512 && (Mt || l === null || Os(l, l.return)), a & 4) {
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
                      )), Wt(i, a, l), i[it] = e, Rt(i), a = i;
                      break e;
                    case "link":
                      var c = Lh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var u = 0; u < c.length; u++)
                          if (i = c[u], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(u, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Lh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (u = 0; u < c.length; u++)
                          if (i = c[u], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(u, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  i[it] = e, Rt(i), a = i;
                }
                e.stateNode = a;
              } else
                Yh(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Bh(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? Yh(
              n,
              e.type,
              e.stateNode
            ) : Bh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && rr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        cs(t, e), rs(e), a & 512 && (Mt || l === null || Os(l, l.return)), l !== null && a & 4 && rr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (cs(t, e), rs(e), a & 512 && (Mt || l === null || Os(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Yl(n, "");
          } catch (R) {
            St(e, e.return, R);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, rr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (or = !0);
        break;
      case 6:
        if (cs(t, e), rs(e), a & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (R) {
            St(e, e.return, R);
          }
        }
        break;
      case 3:
        if (Ei = null, n = _s, _s = ki(t.containerInfo), cs(t, e), _s = n, rs(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            gn(t.containerInfo);
          } catch (R) {
            St(e, e.return, R);
          }
        or && (or = !1, Jo(e));
        break;
      case 4:
        a = _s, _s = ki(
          e.stateNode.containerInfo
        ), cs(t, e), rs(e), _s = a;
        break;
      case 12:
        cs(t, e), rs(e);
        break;
      case 13:
        cs(t, e), rs(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (pr = Be()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, hr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var v = l !== null && l.memoizedState !== null, E = Zs, Z = Mt;
        if (Zs = E || n, Mt = Z || v, cs(t, e), Mt = Z, Zs = E, rs(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || v || Zs || Mt || Ml(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                v = l = t;
                try {
                  if (i = v.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    u = v.stateNode;
                    var $ = v.memoizedProps.style, z = $ != null && $.hasOwnProperty("display") ? $.display : null;
                    u.style.display = z == null || typeof z == "boolean" ? "" : ("" + z).trim();
                  }
                } catch (R) {
                  St(v, v.return, R);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                v = t;
                try {
                  v.stateNode.nodeValue = n ? "" : v.memoizedProps;
                } catch (R) {
                  St(v, v.return, R);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, hr(e, l))));
        break;
      case 19:
        cs(t, e), rs(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, hr(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        cs(t, e), rs(e);
    }
  }
  function rs(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Bo(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = ur(e);
            fi(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (Yl(c, ""), l.flags &= -33);
            var u = ur(e);
            fi(e, u, c);
            break;
          case 3:
          case 4:
            var v = l.stateNode.containerInfo, E = ur(e);
            dr(
              e,
              E,
              v
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (Z) {
        St(e, e.return, Z);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jo(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Jo(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function cl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Go(e, t.alternate, t), t = t.sibling;
  }
  function Ml(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          il(4, t, t.return), Ml(t);
          break;
        case 1:
          Os(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && qo(
            t,
            t.return,
            l
          ), Ml(t);
          break;
        case 27:
          on(t.stateNode);
        case 26:
        case 5:
          Os(t, t.return), Ml(t);
          break;
        case 22:
          t.memoizedState === null && Ml(t);
          break;
        case 30:
          Ml(t);
          break;
        default:
          Ml(t);
      }
      e = e.sibling;
    }
  }
  function rl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          rl(
            n,
            i,
            l
          ), en(4, i);
          break;
        case 1:
          if (rl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (E) {
              St(a, a.return, E);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var u = a.stateNode;
            try {
              var v = n.shared.hiddenCallbacks;
              if (v !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < v.length; n++)
                  yd(v[n], u);
            } catch (E) {
              St(a, a.return, E);
            }
          }
          l && c & 64 && Mo(i), tn(i, i.return);
          break;
        case 27:
          Lo(i);
        case 26:
        case 5:
          rl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Ho(i), tn(i, i.return);
          break;
        case 12:
          rl(
            n,
            i,
            l
          );
          break;
        case 13:
          rl(
            n,
            i,
            l
          ), l && c & 4 && Zo(n, i);
          break;
        case 22:
          i.memoizedState === null && rl(
            n,
            i,
            l
          ), tn(i, i.return);
          break;
        case 30:
          break;
        default:
          rl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function fr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && La(l));
  }
  function mr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && La(e));
  }
  function Ts(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Ko(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function Ko(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ts(
          e,
          t,
          l,
          a
        ), n & 2048 && en(9, t);
        break;
      case 1:
        Ts(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Ts(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && La(e)));
        break;
      case 12:
        if (n & 2048) {
          Ts(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, c = i.id, u = i.onPostCommit;
            typeof u == "function" && u(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (v) {
            St(t, t.return, v);
          }
        } else
          Ts(
            e,
            t,
            l,
            a
          );
        break;
      case 13:
        Ts(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Ts(
          e,
          t,
          l,
          a
        ) : sn(e, t) : i._visibility & 2 ? Ts(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, ia(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && fr(c, t);
        break;
      case 24:
        Ts(
          e,
          t,
          l,
          a
        ), n & 2048 && mr(t.alternate, t);
        break;
      default:
        Ts(
          e,
          t,
          l,
          a
        );
    }
  }
  function ia(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, u = l, v = a, E = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ia(
            i,
            c,
            u,
            v,
            n
          ), en(8, c);
          break;
        case 23:
          break;
        case 22:
          var Z = c.stateNode;
          c.memoizedState !== null ? Z._visibility & 2 ? ia(
            i,
            c,
            u,
            v,
            n
          ) : sn(
            i,
            c
          ) : (Z._visibility |= 2, ia(
            i,
            c,
            u,
            v,
            n
          )), n && E & 2048 && fr(
            c.alternate,
            c
          );
          break;
        case 24:
          ia(
            i,
            c,
            u,
            v,
            n
          ), n && E & 2048 && mr(c.alternate, c);
          break;
        default:
          ia(
            i,
            c,
            u,
            v,
            n
          );
      }
      t = t.sibling;
    }
  }
  function sn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            sn(l, a), n & 2048 && fr(
              a.alternate,
              a
            );
            break;
          case 24:
            sn(l, a), n & 2048 && mr(a.alternate, a);
            break;
          default:
            sn(l, a);
        }
        t = t.sibling;
      }
  }
  var ln = 8192;
  function ca(e) {
    if (e.subtreeFlags & ln)
      for (e = e.child; e !== null; )
        $o(e), e = e.sibling;
  }
  function $o(e) {
    switch (e.tag) {
      case 26:
        ca(e), e.flags & ln && e.memoizedState !== null && Lx(
          _s,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ca(e);
        break;
      case 3:
      case 4:
        var t = _s;
        _s = ki(e.stateNode.containerInfo), ca(e), _s = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = ln, ln = 16777216, ca(e), ln = t) : ca(e));
        break;
      default:
        ca(e);
    }
  }
  function Wo(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function an(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Vt = a, Io(
            a,
            e
          );
        }
      Wo(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Fo(e), e = e.sibling;
  }
  function Fo(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        an(e), e.flags & 2048 && il(9, e, e.return);
        break;
      case 3:
        an(e);
        break;
      case 12:
        an(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, mi(e)) : an(e);
        break;
      default:
        an(e);
    }
  }
  function mi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Vt = a, Io(
            a,
            e
          );
        }
      Wo(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          il(8, t, t.return), mi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, mi(t));
          break;
        default:
          mi(t);
      }
      e = e.sibling;
    }
  }
  function Io(e, t) {
    for (; Vt !== null; ) {
      var l = Vt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          il(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          La(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Vt = a;
      else
        e: for (l = e; Vt !== null; ) {
          a = Vt;
          var n = a.sibling, i = a.return;
          if (Qo(a), a === l) {
            Vt = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Vt = n;
            break e;
          }
          Vt = i;
        }
    }
  }
  var sx = {
    getCacheForType: function(e) {
      var t = It(Gt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, lx = typeof WeakMap == "function" ? WeakMap : Map, pt = 0, wt = null, ut = null, ft = 0, gt = 0, us = null, ul = !1, ra = !1, xr = !1, Js = 0, Ut = 0, dl = 0, ql = 0, jr = 0, gs = 0, ua = 0, nn = null, as = null, vr = !1, pr = 0, xi = 1 / 0, ji = null, ol = null, $t = 0, hl = null, da = null, oa = 0, gr = 0, br = null, Po = null, cn = 0, yr = null;
  function ds() {
    if ((pt & 2) !== 0 && ft !== 0)
      return ft & -ft;
    if (g.T !== null) {
      var e = Il;
      return e !== 0 ? e : Er();
    }
    return Ct();
  }
  function eh() {
    gs === 0 && (gs = (ft & 536870912) === 0 || xt ? jt() : 536870912);
    var e = ps.current;
    return e !== null && (e.flags |= 32), gs;
  }
  function os(e, t, l) {
    (e === wt && (gt === 2 || gt === 9) || e.cancelPendingCommit !== null) && (ha(e, 0), fl(
      e,
      ft,
      gs,
      !1
    )), re(e, l), ((pt & 2) === 0 || e !== wt) && (e === wt && ((pt & 2) === 0 && (ql |= l), Ut === 4 && fl(
      e,
      ft,
      gs,
      !1
    )), zs(e));
  }
  function th(e, t, l) {
    if ((pt & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || ve(e, t), n = a ? ix(e, t) : Sr(e, t, !0), i = a;
    do {
      if (n === 0) {
        ra && !a && fl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !ax(l)) {
          n = Sr(e, t, !1), i = !1;
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
              var u = e;
              n = nn;
              var v = u.current.memoizedState.isDehydrated;
              if (v && (ha(u, c).flags |= 256), c = Sr(
                u,
                c,
                !1
              ), c !== 2) {
                if (xr && !v) {
                  u.errorRecoveryDisabledLanes |= i, ql |= i, n = 4;
                  break e;
                }
                i = as, as = n, i !== null && (as === null ? as = i : as.push.apply(
                  as,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ha(e, 0), fl(e, t, 0, !0);
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
              fl(
                a,
                t,
                gs,
                !ul
              );
              break e;
            case 2:
              as = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = pr + 300 - Be(), 10 < n)) {
            if (fl(
              a,
              t,
              gs,
              !ul
            ), ye(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Th(
              sh.bind(
                null,
                a,
                l,
                as,
                ji,
                vr,
                t,
                gs,
                ql,
                ua,
                ul,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          sh(
            a,
            l,
            as,
            ji,
            vr,
            t,
            gs,
            ql,
            ua,
            ul,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    zs(e);
  }
  function sh(e, t, l, a, n, i, c, u, v, E, Z, $, z, R) {
    if (e.timeoutHandle = -1, $ = t.subtreeFlags, ($ & 8192 || ($ & 16785408) === 16785408) && (mn = { stylesheets: null, count: 0, unsuspend: Bx }, $o(t), $ = Yx(), $ !== null)) {
      e.cancelPendingCommit = $(
        uh.bind(
          null,
          e,
          t,
          i,
          l,
          a,
          n,
          c,
          u,
          v,
          Z,
          1,
          z,
          R
        )
      ), fl(e, i, c, !E);
      return;
    }
    uh(
      e,
      t,
      i,
      l,
      a,
      n,
      c,
      u,
      v
    );
  }
  function ax(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!ns(i(), n)) return !1;
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
  function fl(e, t, l, a) {
    t &= ~jr, t &= ~ql, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - et(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && at(e, l, t);
  }
  function vi() {
    return (pt & 6) === 0 ? (rn(0), !1) : !0;
  }
  function _r() {
    if (ut !== null) {
      if (gt === 0)
        var e = ut.return;
      else
        e = ut, Bs = zl = null, Bc(e), aa = null, Fa = 0, e = ut;
      for (; e !== null; )
        Do(e.alternate, e), e = e.return;
      ut = null;
    }
  }
  function ha(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, _x(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), _r(), wt = e, ut = l = Ms(e.current, null), ft = t, gt = 0, us = null, ul = !1, ra = ve(e, t), xr = !1, ua = gs = jr = ql = dl = Ut = 0, as = nn = null, vr = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - et(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return Js = t, Bn(), l;
  }
  function lh(e, t) {
    nt = null, g.H = ai, t === Ga || t === Kn ? (t = gd(), gt = 3) : t === jd ? (t = gd(), gt = 4) : gt = t === yo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, us = t, ut === null && (Ut = 1, ui(
      e,
      ms(t, e.current)
    ));
  }
  function ah() {
    var e = g.H;
    return g.H = ai, e === null ? ai : e;
  }
  function nh() {
    var e = g.A;
    return g.A = sx, e;
  }
  function Nr() {
    Ut = 4, ul || (ft & 4194048) !== ft && ps.current !== null || (ra = !0), (dl & 134217727) === 0 && (ql & 134217727) === 0 || wt === null || fl(
      wt,
      ft,
      gs,
      !1
    );
  }
  function Sr(e, t, l) {
    var a = pt;
    pt |= 2;
    var n = ah(), i = nh();
    (wt !== e || ft !== t) && (ji = null, ha(e, t)), t = !1;
    var c = Ut;
    e: do
      try {
        if (gt !== 0 && ut !== null) {
          var u = ut, v = us;
          switch (gt) {
            case 8:
              _r(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              ps.current === null && (t = !0);
              var E = gt;
              if (gt = 0, us = null, fa(e, u, v, E), l && ra) {
                c = 0;
                break e;
              }
              break;
            default:
              E = gt, gt = 0, us = null, fa(e, u, v, E);
          }
        }
        nx(), c = Ut;
        break;
      } catch (Z) {
        lh(e, Z);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Bs = zl = null, pt = a, g.H = n, g.A = i, ut === null && (wt = null, ft = 0, Bn()), c;
  }
  function nx() {
    for (; ut !== null; ) ih(ut);
  }
  function ix(e, t) {
    var l = pt;
    pt |= 2;
    var a = ah(), n = nh();
    wt !== e || ft !== t ? (ji = null, xi = Be() + 500, ha(e, t)) : ra = ve(
      e,
      t
    );
    e: do
      try {
        if (gt !== 0 && ut !== null) {
          t = ut;
          var i = us;
          t: switch (gt) {
            case 1:
              gt = 0, us = null, fa(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (vd(i)) {
                gt = 0, us = null, ch(t);
                break;
              }
              t = function() {
                gt !== 2 && gt !== 9 || wt !== e || (gt = 7), zs(e);
              }, i.then(t, t);
              break e;
            case 3:
              gt = 7;
              break e;
            case 4:
              gt = 5;
              break e;
            case 7:
              vd(i) ? (gt = 0, us = null, ch(t)) : (gt = 0, us = null, fa(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (ut.tag) {
                case 26:
                  c = ut.memoizedState;
                case 5:
                case 27:
                  var u = ut;
                  if (!c || Gh(c)) {
                    gt = 0, us = null;
                    var v = u.sibling;
                    if (v !== null) ut = v;
                    else {
                      var E = u.return;
                      E !== null ? (ut = E, pi(E)) : ut = null;
                    }
                    break t;
                  }
              }
              gt = 0, us = null, fa(e, t, i, 5);
              break;
            case 6:
              gt = 0, us = null, fa(e, t, i, 6);
              break;
            case 8:
              _r(), Ut = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        cx();
        break;
      } catch (Z) {
        lh(e, Z);
      }
    while (!0);
    return Bs = zl = null, g.H = a, g.A = n, pt = l, ut !== null ? 0 : (wt = null, ft = 0, Bn(), Ut);
  }
  function cx() {
    for (; ut !== null && !Ue(); )
      ih(ut);
  }
  function ih(e) {
    var t = Uo(e.alternate, e, Js);
    e.memoizedProps = e.pendingProps, t === null ? pi(e) : ut = t;
  }
  function ch(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Co(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ft
        );
        break;
      case 11:
        t = Co(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ft
        );
        break;
      case 5:
        Bc(t);
      default:
        Do(l, t), t = ut = cd(t, Js), t = Uo(l, t, Js);
    }
    e.memoizedProps = e.pendingProps, t === null ? pi(e) : ut = t;
  }
  function fa(e, t, l, a) {
    Bs = zl = null, Bc(t), aa = null, Fa = 0;
    var n = t.return;
    try {
      if (Wm(
        e,
        n,
        t,
        l,
        ft
      )) {
        Ut = 1, ui(
          e,
          ms(l, e.current)
        ), ut = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw ut = n, i;
      Ut = 1, ui(
        e,
        ms(l, e.current)
      ), ut = null;
      return;
    }
    t.flags & 32768 ? (xt || a === 1 ? e = !0 : ra || (ft & 536870912) !== 0 ? e = !1 : (ul = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = ps.current, a !== null && a.tag === 13 && (a.flags |= 16384))), rh(t, e)) : pi(t);
  }
  function pi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        rh(
          t,
          ul
        );
        return;
      }
      e = t.return;
      var l = Im(
        t.alternate,
        t,
        Js
      );
      if (l !== null) {
        ut = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ut = t;
        return;
      }
      ut = t = e;
    } while (t !== null);
    Ut === 0 && (Ut = 5);
  }
  function rh(e, t) {
    do {
      var l = Pm(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ut = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ut = e;
        return;
      }
      ut = e = l;
    } while (e !== null);
    Ut = 6, ut = null;
  }
  function uh(e, t, l, a, n, i, c, u, v) {
    e.cancelPendingCommit = null;
    do
      gi();
    while ($t !== 0);
    if ((pt & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= mc, pe(
        e,
        l,
        i,
        c,
        u,
        v
      ), e === wt && (ut = wt = null, ft = 0), da = t, hl = e, oa = l, gr = i, br = n, Po = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, ox(je, function() {
        return mh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = g.T, g.T = null, n = Y.p, Y.p = 2, c = pt, pt |= 4;
        try {
          ex(e, t, l);
        } finally {
          pt = c, Y.p = n, g.T = a;
        }
      }
      $t = 1, dh(), oh(), hh();
    }
  }
  function dh() {
    if ($t === 1) {
      $t = 0;
      var e = hl, t = da, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = g.T, g.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = pt;
        pt |= 4;
        try {
          Vo(t, e);
          var i = Mr, c = Fu(e.containerInfo), u = i.focusedElem, v = i.selectionRange;
          if (c !== u && u && u.ownerDocument && Wu(
            u.ownerDocument.documentElement,
            u
          )) {
            if (v !== null && uc(u)) {
              var E = v.start, Z = v.end;
              if (Z === void 0 && (Z = E), "selectionStart" in u)
                u.selectionStart = E, u.selectionEnd = Math.min(
                  Z,
                  u.value.length
                );
              else {
                var $ = u.ownerDocument || document, z = $ && $.defaultView || window;
                if (z.getSelection) {
                  var R = z.getSelection(), Ke = u.textContent.length, Xe = Math.min(v.start, Ke), _t = v.end === void 0 ? Xe : Math.min(v.end, Ke);
                  !R.extend && Xe > _t && (c = _t, _t = Xe, Xe = c);
                  var w = $u(
                    u,
                    Xe
                  ), y = $u(
                    u,
                    _t
                  );
                  if (w && y && (R.rangeCount !== 1 || R.anchorNode !== w.node || R.anchorOffset !== w.offset || R.focusNode !== y.node || R.focusOffset !== y.offset)) {
                    var C = $.createRange();
                    C.setStart(w.node, w.offset), R.removeAllRanges(), Xe > _t ? (R.addRange(C), R.extend(y.node, y.offset)) : (C.setEnd(y.node, y.offset), R.addRange(C));
                  }
                }
              }
            }
            for ($ = [], R = u; R = R.parentNode; )
              R.nodeType === 1 && $.push({
                element: R,
                left: R.scrollLeft,
                top: R.scrollTop
              });
            for (typeof u.focus == "function" && u.focus(), u = 0; u < $.length; u++) {
              var J = $[u];
              J.element.scrollLeft = J.left, J.element.scrollTop = J.top;
            }
          }
          zi = !!Dr, Mr = Dr = null;
        } finally {
          pt = n, Y.p = a, g.T = l;
        }
      }
      e.current = t, $t = 2;
    }
  }
  function oh() {
    if ($t === 2) {
      $t = 0;
      var e = hl, t = da, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = g.T, g.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = pt;
        pt |= 4;
        try {
          Go(e, t.alternate, t);
        } finally {
          pt = n, Y.p = a, g.T = l;
        }
      }
      $t = 3;
    }
  }
  function hh() {
    if ($t === 4 || $t === 3) {
      $t = 0, we();
      var e = hl, t = da, l = oa, a = Po;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? $t = 5 : ($t = 0, da = hl = null, fh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (ol = null), Qe(l), t = t.stateNode, Se && typeof Se.onCommitFiberRoot == "function")
        try {
          Se.onCommitFiberRoot(
            F,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = g.T, n = Y.p, Y.p = 2, g.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < a.length; c++) {
            var u = a[c];
            i(u.value, {
              componentStack: u.stack
            });
          }
        } finally {
          g.T = t, Y.p = n;
        }
      }
      (oa & 3) !== 0 && gi(), zs(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === yr ? cn++ : (cn = 0, yr = e) : cn = 0, rn(0);
    }
  }
  function fh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, La(t)));
  }
  function gi(e) {
    return dh(), oh(), hh(), mh();
  }
  function mh() {
    if ($t !== 5) return !1;
    var e = hl, t = gr;
    gr = 0;
    var l = Qe(oa), a = g.T, n = Y.p;
    try {
      Y.p = 32 > l ? 32 : l, g.T = null, l = br, br = null;
      var i = hl, c = oa;
      if ($t = 0, da = hl = null, oa = 0, (pt & 6) !== 0) throw Error(o(331));
      var u = pt;
      if (pt |= 4, Fo(i.current), Ko(
        i,
        i.current,
        c,
        l
      ), pt = u, rn(0, !1), Se && typeof Se.onPostCommitFiberRoot == "function")
        try {
          Se.onPostCommitFiberRoot(F, i);
        } catch {
        }
      return !0;
    } finally {
      Y.p = n, g.T = a, fh(e, t);
    }
  }
  function xh(e, t, l) {
    t = ms(l, t), t = Pc(e.stateNode, t, 2), e = sl(e, t, 2), e !== null && (re(e, 2), zs(e));
  }
  function St(e, t, l) {
    if (e.tag === 3)
      xh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          xh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (ol === null || !ol.has(a))) {
            e = ms(l, e), l = go(2), a = sl(t, l, 2), a !== null && (bo(
              l,
              a,
              t,
              e
            ), re(a, 2), zs(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function wr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new lx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (xr = !0, n.add(l), e = rx.bind(null, e, t, l), t.then(e, e));
  }
  function rx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, wt === e && (ft & l) === l && (Ut === 4 || Ut === 3 && (ft & 62914560) === ft && 300 > Be() - pr ? (pt & 2) === 0 && ha(e, 0) : jr |= l, ua === ft && (ua = 0)), zs(e);
  }
  function jh(e, t) {
    t === 0 && (t = U()), e = Kl(e, t), e !== null && (re(e, t), zs(e));
  }
  function ux(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), jh(e, l);
  }
  function dx(e, t) {
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
    a !== null && a.delete(t), jh(e, l);
  }
  function ox(e, t) {
    return Je(e, t);
  }
  var bi = null, ma = null, kr = !1, yi = !1, Cr = !1, Hl = 0;
  function zs(e) {
    e !== ma && e.next === null && (ma === null ? bi = ma = e : ma = ma.next = e), yi = !0, kr || (kr = !0, fx());
  }
  function rn(e, t) {
    if (!Cr && yi) {
      Cr = !0;
      do
        for (var l = !1, a = bi; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, u = a.pingedLanes;
              i = (1 << 31 - et(42 | e) + 1) - 1, i &= n & ~(c & ~u), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, bh(a, i));
          } else
            i = ft, i = ye(
              a,
              a === wt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || ve(a, i) || (l = !0, bh(a, i));
          a = a.next;
        }
      while (l);
      Cr = !1;
    }
  }
  function hx() {
    vh();
  }
  function vh() {
    yi = kr = !1;
    var e = 0;
    Hl !== 0 && (yx() && (e = Hl), Hl = 0);
    for (var t = Be(), l = null, a = bi; a !== null; ) {
      var n = a.next, i = ph(a, t);
      i === 0 ? (a.next = null, l === null ? bi = n : l.next = n, n === null && (ma = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (yi = !0)), a = n;
    }
    rn(e);
  }
  function ph(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - et(i), u = 1 << c, v = n[c];
      v === -1 ? ((u & l) === 0 || (u & a) !== 0) && (n[c] = Ge(u, t)) : v <= t && (e.expiredLanes |= u), i &= ~u;
    }
    if (t = wt, l = ft, l = ye(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (gt === 2 || gt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Re(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || ve(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Re(a), Qe(l)) {
        case 2:
        case 8:
          l = ot;
          break;
        case 32:
          l = je;
          break;
        case 268435456:
          l = De;
          break;
        default:
          l = je;
      }
      return a = gh.bind(null, e), l = Je(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Re(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function gh(e, t) {
    if ($t !== 0 && $t !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (gi() && e.callbackNode !== l)
      return null;
    var a = ft;
    return a = ye(
      e,
      e === wt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (th(e, a, t), ph(e, Be()), e.callbackNode != null && e.callbackNode === l ? gh.bind(null, e) : null);
  }
  function bh(e, t) {
    if (gi()) return null;
    th(e, t, !0);
  }
  function fx() {
    Nx(function() {
      (pt & 6) !== 0 ? Je(
        Fe,
        hx
      ) : vh();
    });
  }
  function Er() {
    return Hl === 0 && (Hl = jt()), Hl;
  }
  function yh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : An("" + e);
  }
  function _h(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function mx(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = yh(
        (n[Nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Nt] || null) ? yh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var u = new Mn(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: u,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Hl !== 0) {
                  var v = c ? _h(n, c) : new FormData(n);
                  Kc(
                    l,
                    {
                      pending: !0,
                      data: v,
                      method: n.method,
                      action: i
                    },
                    null,
                    v
                  );
                }
              } else
                typeof i == "function" && (u.preventDefault(), v = c ? _h(n, c) : new FormData(n), Kc(
                  l,
                  {
                    pending: !0,
                    data: v,
                    method: n.method,
                    action: i
                  },
                  i,
                  v
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Or = 0; Or < fc.length; Or++) {
    var Tr = fc[Or], xx = Tr.toLowerCase(), jx = Tr[0].toUpperCase() + Tr.slice(1);
    ys(
      xx,
      "on" + jx
    );
  }
  ys(ed, "onAnimationEnd"), ys(td, "onAnimationIteration"), ys(sd, "onAnimationStart"), ys("dblclick", "onDoubleClick"), ys("focusin", "onFocus"), ys("focusout", "onBlur"), ys(Um, "onTransitionRun"), ys(Rm, "onTransitionStart"), ys(Dm, "onTransitionCancel"), ys(ld, "onTransitionEnd"), Fs("onMouseEnter", ["mouseout", "mouseover"]), Fs("onMouseLeave", ["mouseout", "mouseover"]), Fs("onPointerEnter", ["pointerout", "pointerover"]), Fs("onPointerLeave", ["pointerout", "pointerover"]), Ft(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ft(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ft("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ft(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ft(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ft(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var un = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), vx = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(un)
  );
  function Nh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var u = a[c], v = u.instance, E = u.currentTarget;
            if (u = u.listener, v !== i && n.isPropagationStopped())
              break e;
            i = u, n.currentTarget = E;
            try {
              i(n);
            } catch (Z) {
              ri(Z);
            }
            n.currentTarget = null, i = v;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (u = a[c], v = u.instance, E = u.currentTarget, u = u.listener, v !== i && n.isPropagationStopped())
              break e;
            i = u, n.currentTarget = E;
            try {
              i(n);
            } catch (Z) {
              ri(Z);
            }
            n.currentTarget = null, i = v;
          }
      }
    }
  }
  function dt(e, t) {
    var l = t[Ne];
    l === void 0 && (l = t[Ne] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Sh(t, e, 2, !1), l.add(a));
  }
  function zr(e, t, l) {
    var a = 0;
    t && (a |= 4), Sh(
      l,
      e,
      a,
      t
    );
  }
  var _i = "_reactListening" + Math.random().toString(36).slice(2);
  function Ar(e) {
    if (!e[_i]) {
      e[_i] = !0, wa.forEach(function(l) {
        l !== "selectionchange" && (vx.has(l) || zr(l, !1, e), zr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[_i] || (t[_i] = !0, zr("selectionchange", !1, t));
    }
  }
  function Sh(e, t, l, a) {
    switch (Kh(t)) {
      case 2:
        var n = Xx;
        break;
      case 8:
        n = Zx;
        break;
      default:
        n = Vr;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !ec || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Ur(e, t, l, a, n) {
    var i = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var u = a.stateNode.containerInfo;
          if (u === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var v = c.tag;
              if ((v === 3 || v === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; u !== null; ) {
            if (c = $e(u), c === null) return;
            if (v = c.tag, v === 5 || v === 6 || v === 26 || v === 27) {
              a = i = c;
              continue e;
            }
            u = u.parentNode;
          }
        }
        a = a.return;
      }
    Tu(function() {
      var E = i, Z = Ii(l), $ = [];
      e: {
        var z = ad.get(e);
        if (z !== void 0) {
          var R = Mn, Ke = e;
          switch (e) {
            case "keypress":
              if (Rn(l) === 0) break e;
            case "keydown":
            case "keyup":
              R = om;
              break;
            case "focusin":
              Ke = "focus", R = ac;
              break;
            case "focusout":
              Ke = "blur", R = ac;
              break;
            case "beforeblur":
            case "afterblur":
              R = ac;
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
              R = Uu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = Pf;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = mm;
              break;
            case ed:
            case td:
            case sd:
              R = sm;
              break;
            case ld:
              R = jm;
              break;
            case "scroll":
            case "scrollend":
              R = Ff;
              break;
            case "wheel":
              R = pm;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = am;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Du;
              break;
            case "toggle":
            case "beforetoggle":
              R = bm;
          }
          var Xe = (t & 4) !== 0, _t = !Xe && (e === "scroll" || e === "scrollend"), w = Xe ? z !== null ? z + "Capture" : null : z;
          Xe = [];
          for (var y = E, C; y !== null; ) {
            var J = y;
            if (C = J.stateNode, J = J.tag, J !== 5 && J !== 26 && J !== 27 || C === null || w === null || (J = Ca(y, w), J != null && Xe.push(
              dn(y, J, C)
            )), _t) break;
            y = y.return;
          }
          0 < Xe.length && (z = new R(
            z,
            Ke,
            null,
            l,
            Z
          ), $.push({ event: z, listeners: Xe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (z = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", z && l !== Fi && (Ke = l.relatedTarget || l.fromElement) && ($e(Ke) || Ke[p]))
            break e;
          if ((R || z) && (z = Z.window === Z ? Z : (z = Z.ownerDocument) ? z.defaultView || z.parentWindow : window, R ? (Ke = l.relatedTarget || l.toElement, R = E, Ke = Ke ? $e(Ke) : null, Ke !== null && (_t = G(Ke), Xe = Ke.tag, Ke !== _t || Xe !== 5 && Xe !== 27 && Xe !== 6) && (Ke = null)) : (R = null, Ke = E), R !== Ke)) {
            if (Xe = Uu, J = "onMouseLeave", w = "onMouseEnter", y = "mouse", (e === "pointerout" || e === "pointerover") && (Xe = Du, J = "onPointerLeave", w = "onPointerEnter", y = "pointer"), _t = R == null ? z : ks(R), C = Ke == null ? z : ks(Ke), z = new Xe(
              J,
              y + "leave",
              R,
              l,
              Z
            ), z.target = _t, z.relatedTarget = C, J = null, $e(Z) === E && (Xe = new Xe(
              w,
              y + "enter",
              Ke,
              l,
              Z
            ), Xe.target = C, Xe.relatedTarget = _t, J = Xe), _t = J, R && Ke)
              t: {
                for (Xe = R, w = Ke, y = 0, C = Xe; C; C = xa(C))
                  y++;
                for (C = 0, J = w; J; J = xa(J))
                  C++;
                for (; 0 < y - C; )
                  Xe = xa(Xe), y--;
                for (; 0 < C - y; )
                  w = xa(w), C--;
                for (; y--; ) {
                  if (Xe === w || w !== null && Xe === w.alternate)
                    break t;
                  Xe = xa(Xe), w = xa(w);
                }
                Xe = null;
              }
            else Xe = null;
            R !== null && wh(
              $,
              z,
              R,
              Xe,
              !1
            ), Ke !== null && _t !== null && wh(
              $,
              _t,
              Ke,
              Xe,
              !0
            );
          }
        }
        e: {
          if (z = E ? ks(E) : window, R = z.nodeName && z.nodeName.toLowerCase(), R === "select" || R === "input" && z.type === "file")
            var Ae = Qu;
          else if (Yu(z))
            if (Xu)
              Ae = Tm;
            else {
              Ae = Em;
              var ct = Cm;
            }
          else
            R = z.nodeName, !R || R.toLowerCase() !== "input" || z.type !== "checkbox" && z.type !== "radio" ? E && Wi(E.elementType) && (Ae = Qu) : Ae = Om;
          if (Ae && (Ae = Ae(e, E))) {
            Gu(
              $,
              Ae,
              l,
              Z
            );
            break e;
          }
          ct && ct(e, z, E), e === "focusout" && E && z.type === "number" && E.memoizedProps.value != null && $i(z, "number", z.value);
        }
        switch (ct = E ? ks(E) : window, e) {
          case "focusin":
            (Yu(ct) || ct.contentEditable === "true") && (Zl = ct, dc = E, Da = null);
            break;
          case "focusout":
            Da = dc = Zl = null;
            break;
          case "mousedown":
            oc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            oc = !1, Iu($, l, Z);
            break;
          case "selectionchange":
            if (Am) break;
          case "keydown":
          case "keyup":
            Iu($, l, Z);
        }
        var qe;
        if (ic)
          e: {
            switch (e) {
              case "compositionstart":
                var Ze = "onCompositionStart";
                break e;
              case "compositionend":
                Ze = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ze = "onCompositionUpdate";
                break e;
            }
            Ze = void 0;
          }
        else
          Xl ? Bu(e, l) && (Ze = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Ze = "onCompositionStart");
        Ze && (Mu && l.locale !== "ko" && (Xl || Ze !== "onCompositionStart" ? Ze === "onCompositionEnd" && Xl && (qe = zu()) : (Is = Z, tc = "value" in Is ? Is.value : Is.textContent, Xl = !0)), ct = Ni(E, Ze), 0 < ct.length && (Ze = new Ru(
          Ze,
          e,
          null,
          l,
          Z
        ), $.push({ event: Ze, listeners: ct }), qe ? Ze.data = qe : (qe = Lu(l), qe !== null && (Ze.data = qe)))), (qe = _m ? Nm(e, l) : Sm(e, l)) && (Ze = Ni(E, "onBeforeInput"), 0 < Ze.length && (ct = new Ru(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          Z
        ), $.push({
          event: ct,
          listeners: Ze
        }), ct.data = qe)), mx(
          $,
          e,
          E,
          l,
          Z
        );
      }
      Nh($, t);
    });
  }
  function dn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Ni(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = Ca(e, l), n != null && a.unshift(
        dn(e, n, i)
      ), n = Ca(e, t), n != null && a.push(
        dn(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function xa(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function wh(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var u = l, v = u.alternate, E = u.stateNode;
      if (u = u.tag, v !== null && v === a) break;
      u !== 5 && u !== 26 && u !== 27 || E === null || (v = E, n ? (E = Ca(l, i), E != null && c.unshift(
        dn(l, E, v)
      )) : n || (E = Ca(l, i), E != null && c.push(
        dn(l, E, v)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var px = /\r\n?/g, gx = /\u0000|\uFFFD/g;
  function kh(e) {
    return (typeof e == "string" ? e : "" + e).replace(px, `
`).replace(gx, "");
  }
  function Ch(e, t) {
    return t = kh(t), kh(e) === t;
  }
  function Si() {
  }
  function yt(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Yl(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Yl(e, "" + a);
        break;
      case "className":
        On(e, "class", a);
        break;
      case "tabIndex":
        On(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        On(e, l, a);
        break;
      case "style":
        Eu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          On(e, "data", a);
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
        a = An("" + a), e.setAttribute(l, a);
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
          typeof i == "function" && (l === "formAction" ? (t !== "input" && yt(e, t, "name", n.name, n, null), yt(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), yt(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), yt(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (yt(e, t, "encType", n.encType, n, null), yt(e, t, "method", n.method, n, null), yt(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = An("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Si);
        break;
      case "onScroll":
        a != null && dt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && dt("scrollend", e);
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
        l = An("" + a), e.setAttributeNS(
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
        dt("beforetoggle", e), dt("toggle", e), En(e, "popover", a);
        break;
      case "xlinkActuate":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Rs(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Rs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Rs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Rs(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        En(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = $f.get(l) || l, En(e, l, a));
    }
  }
  function Rr(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Eu(e, a, i);
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
        typeof a == "string" ? Yl(e, a) : (typeof a == "number" || typeof a == "bigint") && Yl(e, "" + a);
        break;
      case "onScroll":
        a != null && dt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && dt("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Si);
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
        if (!ka.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[Nt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : En(e, l, a);
          }
    }
  }
  function Wt(e, t, l) {
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
        dt("error", e), dt("load", e);
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
                  yt(e, t, i, c, l, null);
              }
          }
        n && yt(e, t, "srcSet", l.srcSet, l, null), a && yt(e, t, "src", l.src, l, null);
        return;
      case "input":
        dt("invalid", e);
        var u = i = c = n = null, v = null, E = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var Z = l[a];
            if (Z != null)
              switch (a) {
                case "name":
                  n = Z;
                  break;
                case "type":
                  c = Z;
                  break;
                case "checked":
                  v = Z;
                  break;
                case "defaultChecked":
                  E = Z;
                  break;
                case "value":
                  i = Z;
                  break;
                case "defaultValue":
                  u = Z;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (Z != null)
                    throw Error(o(137, t));
                  break;
                default:
                  yt(e, t, a, Z, l, null);
              }
          }
        Su(
          e,
          i,
          u,
          v,
          E,
          c,
          n,
          !1
        ), Tn(e);
        return;
      case "select":
        dt("invalid", e), a = c = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (u = l[n], u != null))
            switch (n) {
              case "value":
                i = u;
                break;
              case "defaultValue":
                c = u;
                break;
              case "multiple":
                a = u;
              default:
                yt(e, t, n, u, l, null);
            }
        t = i, l = c, e.multiple = !!a, t != null ? Ll(e, !!a, t, !1) : l != null && Ll(e, !!a, l, !0);
        return;
      case "textarea":
        dt("invalid", e), i = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (u = l[c], u != null))
            switch (c) {
              case "value":
                a = u;
                break;
              case "defaultValue":
                n = u;
                break;
              case "children":
                i = u;
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(o(91));
                break;
              default:
                yt(e, t, c, u, l, null);
            }
        ku(e, a, n, i), Tn(e);
        return;
      case "option":
        for (v in l)
          if (l.hasOwnProperty(v) && (a = l[v], a != null))
            switch (v) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                yt(e, t, v, a, l, null);
            }
        return;
      case "dialog":
        dt("beforetoggle", e), dt("toggle", e), dt("cancel", e), dt("close", e);
        break;
      case "iframe":
      case "object":
        dt("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < un.length; a++)
          dt(un[a], e);
        break;
      case "image":
        dt("error", e), dt("load", e);
        break;
      case "details":
        dt("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        dt("error", e), dt("load", e);
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
        for (E in l)
          if (l.hasOwnProperty(E) && (a = l[E], a != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                yt(e, t, E, a, l, null);
            }
        return;
      default:
        if (Wi(t)) {
          for (Z in l)
            l.hasOwnProperty(Z) && (a = l[Z], a !== void 0 && Rr(
              e,
              t,
              Z,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (u in l)
      l.hasOwnProperty(u) && (a = l[u], a != null && yt(e, t, u, a, l, null));
  }
  function bx(e, t, l, a) {
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
        var n = null, i = null, c = null, u = null, v = null, E = null, Z = null;
        for (R in l) {
          var $ = l[R];
          if (l.hasOwnProperty(R) && $ != null)
            switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                v = $;
              default:
                a.hasOwnProperty(R) || yt(e, t, R, null, a, $);
            }
        }
        for (var z in a) {
          var R = a[z];
          if ($ = l[z], a.hasOwnProperty(z) && (R != null || $ != null))
            switch (z) {
              case "type":
                i = R;
                break;
              case "name":
                n = R;
                break;
              case "checked":
                E = R;
                break;
              case "defaultChecked":
                Z = R;
                break;
              case "value":
                c = R;
                break;
              case "defaultValue":
                u = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(o(137, t));
                break;
              default:
                R !== $ && yt(
                  e,
                  t,
                  z,
                  R,
                  a,
                  $
                );
            }
        }
        Ki(
          e,
          c,
          u,
          v,
          E,
          Z,
          i,
          n
        );
        return;
      case "select":
        R = c = u = z = null;
        for (i in l)
          if (v = l[i], l.hasOwnProperty(i) && v != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                R = v;
              default:
                a.hasOwnProperty(i) || yt(
                  e,
                  t,
                  i,
                  null,
                  a,
                  v
                );
            }
        for (n in a)
          if (i = a[n], v = l[n], a.hasOwnProperty(n) && (i != null || v != null))
            switch (n) {
              case "value":
                z = i;
                break;
              case "defaultValue":
                u = i;
                break;
              case "multiple":
                c = i;
              default:
                i !== v && yt(
                  e,
                  t,
                  n,
                  i,
                  a,
                  v
                );
            }
        t = u, l = c, a = R, z != null ? Ll(e, !!l, z, !1) : !!a != !!l && (t != null ? Ll(e, !!l, t, !0) : Ll(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        R = z = null;
        for (u in l)
          if (n = l[u], l.hasOwnProperty(u) && n != null && !a.hasOwnProperty(u))
            switch (u) {
              case "value":
                break;
              case "children":
                break;
              default:
                yt(e, t, u, null, a, n);
            }
        for (c in a)
          if (n = a[c], i = l[c], a.hasOwnProperty(c) && (n != null || i != null))
            switch (c) {
              case "value":
                z = n;
                break;
              case "defaultValue":
                R = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== i && yt(e, t, c, n, a, i);
            }
        wu(e, z, R);
        return;
      case "option":
        for (var Ke in l)
          if (z = l[Ke], l.hasOwnProperty(Ke) && z != null && !a.hasOwnProperty(Ke))
            switch (Ke) {
              case "selected":
                e.selected = !1;
                break;
              default:
                yt(
                  e,
                  t,
                  Ke,
                  null,
                  a,
                  z
                );
            }
        for (v in a)
          if (z = a[v], R = l[v], a.hasOwnProperty(v) && z !== R && (z != null || R != null))
            switch (v) {
              case "selected":
                e.selected = z && typeof z != "function" && typeof z != "symbol";
                break;
              default:
                yt(
                  e,
                  t,
                  v,
                  z,
                  a,
                  R
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
        for (var Xe in l)
          z = l[Xe], l.hasOwnProperty(Xe) && z != null && !a.hasOwnProperty(Xe) && yt(e, t, Xe, null, a, z);
        for (E in a)
          if (z = a[E], R = l[E], a.hasOwnProperty(E) && z !== R && (z != null || R != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null)
                  throw Error(o(137, t));
                break;
              default:
                yt(
                  e,
                  t,
                  E,
                  z,
                  a,
                  R
                );
            }
        return;
      default:
        if (Wi(t)) {
          for (var _t in l)
            z = l[_t], l.hasOwnProperty(_t) && z !== void 0 && !a.hasOwnProperty(_t) && Rr(
              e,
              t,
              _t,
              void 0,
              a,
              z
            );
          for (Z in a)
            z = a[Z], R = l[Z], !a.hasOwnProperty(Z) || z === R || z === void 0 && R === void 0 || Rr(
              e,
              t,
              Z,
              z,
              a,
              R
            );
          return;
        }
    }
    for (var w in l)
      z = l[w], l.hasOwnProperty(w) && z != null && !a.hasOwnProperty(w) && yt(e, t, w, null, a, z);
    for ($ in a)
      z = a[$], R = l[$], !a.hasOwnProperty($) || z === R || z == null && R == null || yt(e, t, $, z, a, R);
  }
  var Dr = null, Mr = null;
  function wi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Eh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Oh(e, t) {
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
  function qr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Hr = null;
  function yx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Hr ? !1 : (Hr = e, !0) : (Hr = null, !1);
  }
  var Th = typeof setTimeout == "function" ? setTimeout : void 0, _x = typeof clearTimeout == "function" ? clearTimeout : void 0, zh = typeof Promise == "function" ? Promise : void 0, Nx = typeof queueMicrotask == "function" ? queueMicrotask : typeof zh < "u" ? function(e) {
    return zh.resolve(null).then(e).catch(Sx);
  } : Th;
  function Sx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ml(e) {
    return e === "head";
  }
  function Ah(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var c = e.ownerDocument;
            if (l & 1 && on(c.documentElement), l & 2 && on(c.body), l & 4)
              for (l = c.head, on(l), c = l.firstChild; c; ) {
                var u = c.nextSibling, v = c.nodeName;
                c[Ce] || v === "SCRIPT" || v === "STYLE" || v === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = u;
              }
          }
          if (n === 0) {
            e.removeChild(i), gn(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    gn(t);
  }
  function Br(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Br(l), Ee(l);
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
  function wx(e, t, l, a) {
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
      if (e = Ns(e.nextSibling), e === null) break;
    }
    return null;
  }
  function kx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ns(e.nextSibling), e === null)) return null;
    return e;
  }
  function Lr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Cx(e, t) {
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
  function Ns(e) {
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
  var Yr = null;
  function Uh(e) {
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
  function Rh(e, t, l) {
    switch (t = wi(l), e) {
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
  function on(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ee(e);
  }
  var bs = /* @__PURE__ */ new Map(), Dh = /* @__PURE__ */ new Set();
  function ki(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Ks = Y.d;
  Y.d = {
    f: Ex,
    r: Ox,
    D: Tx,
    C: zx,
    L: Ax,
    m: Ux,
    X: Dx,
    S: Rx,
    M: Mx
  };
  function Ex() {
    var e = Ks.f(), t = vi();
    return e || t;
  }
  function Ox(e) {
    var t = Xt(e);
    t !== null && t.tag === 5 && t.type === "form" ? eo(t) : Ks.r(e);
  }
  var ja = typeof document > "u" ? null : document;
  function Mh(e, t, l) {
    var a = ja;
    if (a && typeof t == "string" && t) {
      var n = fs(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Dh.has(n) || (Dh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), Wt(t, "link", e), Rt(t), a.head.appendChild(t)));
    }
  }
  function Tx(e) {
    Ks.D(e), Mh("dns-prefetch", e, null);
  }
  function zx(e, t) {
    Ks.C(e, t), Mh("preconnect", e, t);
  }
  function Ax(e, t, l) {
    Ks.L(e, t, l);
    var a = ja;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + fs(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + fs(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + fs(
        l.imageSizes
      ) + '"]')) : n += '[href="' + fs(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = va(e);
          break;
        case "script":
          i = pa(e);
      }
      bs.has(i) || (e = T(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), bs.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(hn(i)) || t === "script" && a.querySelector(fn(i)) || (t = a.createElement("link"), Wt(t, "link", e), Rt(t), a.head.appendChild(t)));
    }
  }
  function Ux(e, t) {
    Ks.m(e, t);
    var l = ja;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + fs(a) + '"][href="' + fs(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = pa(e);
      }
      if (!bs.has(i) && (e = T({ rel: "modulepreload", href: e }, t), bs.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(fn(i)))
              return;
        }
        a = l.createElement("link"), Wt(a, "link", e), Rt(a), l.head.appendChild(a);
      }
    }
  }
  function Rx(e, t, l) {
    Ks.S(e, t, l);
    var a = ja;
    if (a && e) {
      var n = Us(a).hoistableStyles, i = va(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var u = { loading: 0, preload: null };
        if (c = a.querySelector(
          hn(i)
        ))
          u.loading = 5;
        else {
          e = T(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = bs.get(i)) && Gr(e, l);
          var v = c = a.createElement("link");
          Rt(v), Wt(v, "link", e), v._p = new Promise(function(E, Z) {
            v.onload = E, v.onerror = Z;
          }), v.addEventListener("load", function() {
            u.loading |= 1;
          }), v.addEventListener("error", function() {
            u.loading |= 2;
          }), u.loading |= 4, Ci(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: u
        }, n.set(i, c);
      }
    }
  }
  function Dx(e, t) {
    Ks.X(e, t);
    var l = ja;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = pa(e), i = a.get(n);
      i || (i = l.querySelector(fn(n)), i || (e = T({ src: e, async: !0 }, t), (t = bs.get(n)) && Qr(e, t), i = l.createElement("script"), Rt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Mx(e, t) {
    Ks.M(e, t);
    var l = ja;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = pa(e), i = a.get(n);
      i || (i = l.querySelector(fn(n)), i || (e = T({ src: e, async: !0, type: "module" }, t), (t = bs.get(n)) && Qr(e, t), i = l.createElement("script"), Rt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function qh(e, t, l, a) {
    var n = (n = I.current) ? ki(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = va(l.href), l = Us(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = va(l.href);
          var i = Us(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            hn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), bs.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, bs.set(e, l), i || qx(
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
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = pa(l), l = Us(
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
  function va(e) {
    return 'href="' + fs(e) + '"';
  }
  function hn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Hh(e) {
    return T({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function qx(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Wt(t, "link", l), Rt(t), e.head.appendChild(t));
  }
  function pa(e) {
    return '[src="' + fs(e) + '"]';
  }
  function fn(e) {
    return "script[async]" + e;
  }
  function Bh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + fs(l.href) + '"]'
          );
          if (a)
            return t.instance = a, Rt(a), a;
          var n = T({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Rt(a), Wt(a, "style", n), Ci(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = va(l.href);
          var i = e.querySelector(
            hn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Rt(i), i;
          a = Hh(l), (n = bs.get(n)) && Gr(a, n), i = (e.ownerDocument || e).createElement("link"), Rt(i);
          var c = i;
          return c._p = new Promise(function(u, v) {
            c.onload = u, c.onerror = v;
          }), Wt(i, "link", a), t.state.loading |= 4, Ci(i, l.precedence, e), t.instance = i;
        case "script":
          return i = pa(l.src), (n = e.querySelector(
            fn(i)
          )) ? (t.instance = n, Rt(n), n) : (a = l, (n = bs.get(i)) && (a = T({}, l), Qr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), Rt(n), Wt(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Ci(a, l.precedence, e));
    return t.instance;
  }
  function Ci(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var u = a[c];
      if (u.dataset.precedence === t) i = u;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Gr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Qr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Ei = null;
  function Lh(e, t, l) {
    if (Ei === null) {
      var a = /* @__PURE__ */ new Map(), n = Ei = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Ei, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[Ce] || i[it] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var u = a.get(c);
        u ? u.push(i) : a.set(c, [i]);
      }
    }
    return a;
  }
  function Yh(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Hx(e, t, l) {
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
  function Gh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var mn = null;
  function Bx() {
  }
  function Lx(e, t, l) {
    if (mn === null) throw Error(o(475));
    var a = mn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = va(l.href), i = e.querySelector(
          hn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Oi.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, Rt(i);
          return;
        }
        i = e.ownerDocument || e, l = Hh(l), (n = bs.get(n)) && Gr(l, n), i = i.createElement("link"), Rt(i);
        var c = i;
        c._p = new Promise(function(u, v) {
          c.onload = u, c.onerror = v;
        }), Wt(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Oi.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function Yx() {
    if (mn === null) throw Error(o(475));
    var e = mn;
    return e.stylesheets && e.count === 0 && Xr(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && Xr(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Oi() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Xr(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ti = null;
  function Xr(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ti = /* @__PURE__ */ new Map(), t.forEach(Gx, e), Ti = null, Oi.call(e));
  }
  function Gx(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Ti.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Ti.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = Oi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var xn = {
    $$typeof: V,
    Provider: null,
    Consumer: null,
    _currentValue: te,
    _currentValue2: te,
    _threadCount: 0
  };
  function Qx(e, t, l, a, n, i, c, u) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = m(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = m(0), this.hiddenUpdates = m(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = u, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Qh(e, t, l, a, n, i, c, u, v, E, Z, $) {
    return e = new Qx(
      e,
      t,
      l,
      c,
      u,
      v,
      E,
      $
    ), t = 1, i === !0 && (t |= 24), i = is(3, null, null, t), e.current = i, i.stateNode = e, t = wc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Oc(i), e;
  }
  function Xh(e) {
    return e ? (e = $l, e) : $l;
  }
  function Zh(e, t, l, a, n, i) {
    n = Xh(n), a.context === null ? a.context = n : a.pendingContext = n, a = tl(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = sl(e, a, t), l !== null && (os(l, e, t), Xa(l, e, t));
  }
  function Vh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Zr(e, t) {
    Vh(e, t), (e = e.alternate) && Vh(e, t);
  }
  function Jh(e) {
    if (e.tag === 13) {
      var t = Kl(e, 67108864);
      t !== null && os(t, e, 67108864), Zr(e, 67108864);
    }
  }
  var zi = !0;
  function Xx(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = Y.p;
    try {
      Y.p = 2, Vr(e, t, l, a);
    } finally {
      Y.p = i, g.T = n;
    }
  }
  function Zx(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = Y.p;
    try {
      Y.p = 8, Vr(e, t, l, a);
    } finally {
      Y.p = i, g.T = n;
    }
  }
  function Vr(e, t, l, a) {
    if (zi) {
      var n = Jr(a);
      if (n === null)
        Ur(
          e,
          t,
          a,
          Ai,
          l
        ), $h(e, a);
      else if (Jx(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if ($h(e, a), t & 4 && -1 < Vx.indexOf(e)) {
        for (; n !== null; ) {
          var i = Xt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = b(i.pendingLanes);
                  if (c !== 0) {
                    var u = i;
                    for (u.pendingLanes |= 2, u.entangledLanes |= 2; c; ) {
                      var v = 1 << 31 - et(c);
                      u.entanglements[1] |= v, c &= ~v;
                    }
                    zs(i), (pt & 6) === 0 && (xi = Be() + 500, rn(0));
                  }
                }
                break;
              case 13:
                u = Kl(i, 2), u !== null && os(u, i, 2), vi(), Zr(i, 2);
            }
          if (i = Jr(a), i === null && Ur(
            e,
            t,
            a,
            Ai,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Ur(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Jr(e) {
    return e = Ii(e), Kr(e);
  }
  var Ai = null;
  function Kr(e) {
    if (Ai = null, e = $e(e), e !== null) {
      var t = G(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = X(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Ai = e, null;
  }
  function Kh(e) {
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
        switch (Ie()) {
          case Fe:
            return 2;
          case ot:
            return 8;
          case je:
          case rt:
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
  var $r = !1, xl = null, jl = null, vl = null, jn = /* @__PURE__ */ new Map(), vn = /* @__PURE__ */ new Map(), pl = [], Vx = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function $h(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        xl = null;
        break;
      case "dragenter":
      case "dragleave":
        jl = null;
        break;
      case "mouseover":
      case "mouseout":
        vl = null;
        break;
      case "pointerover":
      case "pointerout":
        jn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        vn.delete(t.pointerId);
    }
  }
  function pn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Xt(t), t !== null && Jh(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Jx(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return xl = pn(
          xl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return jl = pn(
          jl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return vl = pn(
          vl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return jn.set(
          i,
          pn(
            jn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, vn.set(
          i,
          pn(
            vn.get(i) || null,
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
  function Wh(e) {
    var t = $e(e.target);
    if (t !== null) {
      var l = G(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = X(l), t !== null) {
            e.blockedOn = t, Lt(e.priority, function() {
              if (l.tag === 13) {
                var a = ds();
                a = me(a);
                var n = Kl(l, a);
                n !== null && os(n, l, a), Zr(l, a);
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
  function Ui(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Jr(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Fi = a, l.target.dispatchEvent(a), Fi = null;
      } else
        return t = Xt(l), t !== null && Jh(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Fh(e, t, l) {
    Ui(e) && l.delete(t);
  }
  function Kx() {
    $r = !1, xl !== null && Ui(xl) && (xl = null), jl !== null && Ui(jl) && (jl = null), vl !== null && Ui(vl) && (vl = null), jn.forEach(Fh), vn.forEach(Fh);
  }
  function Ri(e, t) {
    e.blockedOn === t && (e.blockedOn = null, $r || ($r = !0, d.unstable_scheduleCallback(
      d.unstable_NormalPriority,
      Kx
    )));
  }
  var Di = null;
  function Ih(e) {
    Di !== e && (Di = e, d.unstable_scheduleCallback(
      d.unstable_NormalPriority,
      function() {
        Di === e && (Di = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Kr(a || l) === null)
              continue;
            break;
          }
          var i = Xt(l);
          i !== null && (e.splice(t, 3), t -= 3, Kc(
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
  function gn(e) {
    function t(v) {
      return Ri(v, e);
    }
    xl !== null && Ri(xl, e), jl !== null && Ri(jl, e), vl !== null && Ri(vl, e), jn.forEach(t), vn.forEach(t);
    for (var l = 0; l < pl.length; l++) {
      var a = pl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < pl.length && (l = pl[0], l.blockedOn === null); )
      Wh(l), l.blockedOn === null && pl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[Nt] || null;
        if (typeof i == "function")
          c || Ih(l);
        else if (c) {
          var u = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[Nt] || null)
              u = c.formAction;
            else if (Kr(n) !== null) continue;
          } else u = c.action;
          typeof u == "function" ? l[a + 1] = u : (l.splice(a, 3), a -= 3), Ih(l);
        }
      }
  }
  function Wr(e) {
    this._internalRoot = e;
  }
  Mi.prototype.render = Wr.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = ds();
    Zh(l, a, e, t, null, null);
  }, Mi.prototype.unmount = Wr.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Zh(e.current, 2, null, e, null, null), vi(), t[p] = null;
    }
  };
  function Mi(e) {
    this._internalRoot = e;
  }
  Mi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ct();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < pl.length && t !== 0 && t < pl[l].priority; l++) ;
      pl.splice(l, 0, e), l === 0 && Wh(e);
    }
  };
  var Ph = j.version;
  if (Ph !== "19.1.0")
    throw Error(
      o(
        527,
        Ph,
        "19.1.0"
      )
    );
  Y.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = L(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var $x = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: g,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var qi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!qi.isDisabled && qi.supportsFiber)
      try {
        F = qi.inject(
          $x
        ), Se = qi;
      } catch {
      }
  }
  return yn.createRoot = function(e, t) {
    if (!H(e)) throw Error(o(299));
    var l = !1, a = "", n = xo, i = jo, c = vo, u = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (u = t.unstable_transitionCallbacks)), t = Qh(
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
      u,
      null
    ), e[p] = t.current, Ar(e), new Wr(t);
  }, yn.hydrateRoot = function(e, t, l) {
    if (!H(e)) throw Error(o(299));
    var a = !1, n = "", i = xo, c = jo, u = vo, v = null, E = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (u = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (v = l.unstable_transitionCallbacks), l.formState !== void 0 && (E = l.formState)), t = Qh(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      i,
      c,
      u,
      v,
      E
    ), t.context = Xh(null), l = t.current, a = ds(), a = me(a), n = tl(a), n.callback = null, sl(l, n, a), l = a, t.current.lanes = l, re(t, l), zs(t), e[p] = t.current, Ar(e), new Mi(t);
  }, yn.version = "19.1.0", yn;
}
var df;
function nj() {
  if (df) return Ir.exports;
  df = 1;
  function d() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d);
      } catch (j) {
        console.error(j);
      }
  }
  return d(), Ir.exports = aj(), Ir.exports;
}
var ij = nj(), r = ju();
const lu = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function cj({ api: d, projects: j }) {
  var ae;
  const [k, o] = r.useState(((ae = j[0]) == null ? void 0 : ae.id) || ""), [H, G] = r.useState([]), [X, M] = r.useState("general_inspection"), [L, x] = r.useState("现场质量安全检查"), [T, K] = r.useState("general,通用施工检查"), [S, P] = r.useState(lu.map((A) => A[0])), [oe, _e] = r.useState(!1), [be, ge] = r.useState(!1), [de, V] = r.useState(""), [ue, se] = r.useState(""), [D, he] = r.useState(0), Oe = j.find((A) => A.id === k), He = Oe != null && Oe.permissions ? Oe.permissions.includes("knowledge.process") : Oe == null ? void 0 : Oe.can_run, Le = Oe != null && Oe.permissions ? Oe.permissions.includes("knowledge.review") : Oe == null ? void 0 : Oe.can_manage;
  r.useEffect(() => {
    let A = !1;
    return G([]), V(""), k && d(`/scenes?project_id=${encodeURIComponent(k)}`).then((le) => {
      A || G(le.items);
    }).catch((le) => {
      A || V(le.message);
    }), () => {
      A = !0;
    };
  }, [k, D]);
  const Ye = async (A) => {
    ge(!0), V(""), se("");
    try {
      await A(), he((le) => le + 1);
    } catch (le) {
      V(le.message);
    } finally {
      ge(!1);
    }
  }, xe = (A) => {
    M(A.code), x(A.payload.name), K(A.payload.categories.map((le) => le.code + "," + le.name).join(`
`)), P(A.payload.steps.map((le) => le.event_type)), _e(A.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      de && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: de }),
      ue && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: ue }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: k, onChange: (A) => o(A.target.value), children: j.map((A) => /* @__PURE__ */ s.jsx("option", { value: A.id, children: A.name }, A.id)) })
      ] }),
      He && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: X, onChange: (A) => M(A.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: L, onChange: (A) => x(A.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: T, onChange: (A) => K(A.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          lu.map((A) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: S.includes(A[0]), onChange: (le) => P((g) => le.target.checked ? [...g, A[0]] : g.filter((Y) => Y !== A[0])) }),
            A[1]
          ] }, A[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: oe, onChange: (A) => _e(A.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: be || !k || !S.length, onClick: () => void Ye(async () => {
          const A = H.filter((g) => g.code === X).sort((g, Y) => Y.version - g.version)[0], le = T.split(`
`).filter((g) => g.trim()).map((g) => {
            const [Y, te] = g.split(/[,，]/);
            if (!(Y != null && Y.trim()) || !(te != null && te.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const ke = A == null ? void 0 : A.payload.categories.find((h) => h.code === Y.trim());
            return { code: Y.trim(), name: te.trim(), focus: (ke == null ? void 0 : ke.focus) || "", keywords: (ke == null ? void 0 : ke.keywords) || [] };
          });
          await d("/scenes", { method: "POST", body: JSON.stringify({ project_id: k, code: X, expected_version: (A == null ? void 0 : A.version) || 0, payload: { name: L, categories: le, steps: lu.filter((g) => S.includes(g[0])).map((g) => ({ event_type: g[0], name: g[1], scope: g[2] })), compare_deadline: oe } }) }), se("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      H.map((A) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          A.payload.name,
          " · v",
          A.version,
          A.active ? " · 已启用" : ""
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          A.code,
          " · ",
          A.payload.categories.length,
          "项分类 · ",
          A.payload.steps.length,
          "项过程记录"
        ] }),
        He && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => xe(A), children: "以此版本编辑" }),
        Le && !A.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: be, onClick: () => void Ye(async () => {
          var le;
          await d(`/scenes/${A.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((le = H.find((g) => g.code === A.code && g.active)) == null ? void 0 : le.id) || null }) }), se("场景版本已启用。");
        }), children: "启用此版本" }),
        He && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: be, onClick: () => void Ye(async () => {
          var g;
          const le = await d(`/knowledge/taxonomies?project_id=${encodeURIComponent(k)}`);
          await d("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: k, expected_version: ((g = le.items[0]) == null ? void 0 : g.version) || 0, categories: A.payload.categories }) }), se("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, A.id))
    ] })
  ] });
}
const au = {}, vu = window.location.pathname.startsWith("/quality/b/"), Na = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), of = au == null ? void 0 : au.VITE_B_PLATFORM_MODE, Ot = Na || vu && (of === "true" || of !== "false" && !0);
function Hi() {
  if (!vu && !Na) return window.location.pathname;
  const d = Na ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return d.split("?")[0] === "/knowledge" ? "/knowledge/library" : d.split("?")[0];
}
function rj(d) {
  Na ? window.history.pushState({}, "", "/quality/#/b" + d) : vu ? window.history.pushState({}, "", "/quality/b/#" + d) : window.history.pushState({}, "", d), Na && window.dispatchEvent(new Event("platform-route"));
}
async function qt(d, j = {}) {
  if (!Ot) return fetch(d, j);
  if (!d.startsWith("/api/v1/") && !d.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const k = new Headers(j.headers);
  k.delete("Authorization");
  const o = window.QaxcProjectId;
  Na && o && k.set("X-Project-ID", o);
  const H = (j.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(H)) {
    const X = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (X.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !X.ok) throw new Error(X.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const M = await X.json(), L = M.csrf_token ?? M.token;
    if (typeof L != "string" || !L) throw new Error("安全校验返回格式不正确。");
    k.set("X-CSRF-Token", L);
  }
  const G = await fetch("/quality/b" + d, { ...j, headers: k, credentials: "same-origin" });
  return G.status === 401 && window.dispatchEvent(new Event("b-session-expired")), G;
}
const hf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, ff = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, hu = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), uj = (d) => ({
  project_id: d,
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
  clauses: [hu()]
}), ga = (d) => d.split(`
`).map((j) => j.trim()).filter(Boolean);
function nu(d, j) {
  var k;
  return d != null && d.permissions ? d.permissions.includes(j) : j === "knowledge.process" ? !!(d != null && d.can_run) : !!(d != null && d.can_manage) || !!((k = d == null ? void 0 : d.roles) != null && k.includes("reviewer"));
}
function dj({ api: d, projects: j, identity: k }) {
  var je, rt, De;
  const [o, H] = r.useState(((je = j[0]) == null ? void 0 : je.id) || ""), [G, X] = r.useState([]), [M, L] = r.useState(null), [x, T] = r.useState(null), [K, S] = r.useState(!1), [P, oe] = r.useState(!1), [_e, be] = r.useState(!1), [ge, de] = r.useState(""), [V, ue] = r.useState(""), [se, D] = r.useState(""), [he, Oe] = r.useState(null), [He, Le] = r.useState(0), [Ye, xe] = r.useState(""), [ae, A] = r.useState(!1), [le, g] = r.useState(""), [Y, te] = r.useState("current_rectification"), [ke, h] = r.useState(""), [q, W] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [ee, ie] = r.useState(null), Q = r.useRef(crypto.randomUUID()), I = r.useRef(0), Te = j.find((O) => O.id === o), ne = nu(Te, "knowledge.process"), ze = nu(Te, "knowledge.review"), st = nu(Te, "knowledge.publish"), lt = ne || ze || st;
  r.useEffect(() => {
    const O = (N) => {
      K && (N.preventDefault(), N.returnValue = "");
    };
    return window.addEventListener("beforeunload", O), () => window.removeEventListener("beforeunload", O);
  }, [K]), r.useEffect(() => {
    let O = !1;
    if (be(!0), de(""), X([]), Oe(null), !o) {
      be(!1);
      return;
    }
    return d(`/standards?project_id=${encodeURIComponent(o)}&view=${lt ? "manage" : "published"}${se ? "&cursor=" + encodeURIComponent(se) : ""}`).then((N) => {
      O || (X(N.items), Oe(N.next_cursor));
    }).catch((N) => {
      O || de(N.message);
    }).finally(() => {
      O || be(!1);
    }), () => {
      O = !0;
    };
  }, [o, lt, se, He]), r.useEffect(() => () => {
    I.current++;
  }, []);
  const We = async (O) => {
    oe(!0), de(""), ue("");
    try {
      await O();
    } catch (N) {
      de(N.message);
    } finally {
      oe(!1);
    }
  }, Je = () => {
    var O;
    S(!1), (O = window.QaxcClearPendingEdits) == null || O.call(window);
  }, Re = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), Ue = (O) => {
    T((N) => N && { ...N, ...O }), S(!0), Q.current = crypto.randomUUID();
  }, we = (O, N) => {
    x && Ue({ clauses: x.clauses.map((F, Se) => Se === O ? { ...F, ...N } : F) });
  }, Be = async (O) => {
    if (!Re()) return;
    const N = ++I.current;
    await We(async () => {
      const F = await d("/standards/" + O.id);
      N === I.current && (L(F), T(null), Je(), ie(null), xe(""), A(!1));
    });
  }, Ie = () => {
    if (!M || !Re()) return;
    const { id: O, version: N, row_version: F, state: Se, source_available: Me, verified_on: et, history: ht, clauses: B, ...fe } = M;
    T({
      project_id: fe.project_id,
      code: fe.code,
      edition: fe.edition,
      title: fe.title,
      source_asset_id: fe.source_asset_id,
      valid_from: fe.valid_from,
      valid_until: fe.valid_until,
      scope: fe.scope,
      maintainer: fe.maintainer,
      expected_version: N,
      reason: "修订说明待填写",
      clauses: (B || []).map((ce) => Object.fromEntries(Object.keys(hu()).map((Ve) => [Ve, ce[Ve]])))
    }), g("沿用已绑定原件；原文变化时请重新上传"), S(!0), Q.current = crypto.randomUUID();
  }, Fe = (O) => void We(async () => {
    if (!M) return;
    const N = await d(`/standards/${M.id}/actions`, { method: "POST", body: JSON.stringify({ action: O, row_version: M.row_version, reason: Ye, evidence_checked: ae }) });
    L({ ...M, ...N }), Je(), Le((F) => F + 1), ue(ff[O] + "成功。"), xe(""), A(!1), M.source_available !== !1 && L(await d("/standards/" + M.id));
  }), ot = () => void We(async () => {
    if (!M) return;
    const O = await qt(`/api/v1/standards/${M.id}/source`, { headers: { Authorization: `Bearer dev-${k}` } });
    if (!O.ok) {
      const Me = await O.json();
      throw new Error(Me.message || "原件不可用。");
    }
    const N = await O.blob(), F = URL.createObjectURL(N), Se = document.createElement("a");
    Se.href = F, Se.download = "规范原件" + (N.type.includes("pdf") ? ".pdf" : N.type.includes("wordprocessing") ? ".docx" : ".txt"), Se.click(), setTimeout(() => URL.revokeObjectURL(F), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    ge && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      ge,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => Le((O) => O + 1), children: "刷新列表" })
    ] }),
    V && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: V }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: P, value: o, onChange: (O) => {
          Re() && (I.current++, H(O.target.value), L(null), T(null), S(!1), D(""), ie(null));
        }, children: j.map((O) => /* @__PURE__ */ s.jsx("option", { value: O.id, children: O.name }, O.id)) })
      ] }),
      ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P || !o, onClick: () => {
        Re() && (T(uj(o)), L(null), g(""), S(!1), Q.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || _e, onClick: () => Le((O) => O + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    _e ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !G.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        lt ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      G.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: O.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            O.code,
            " · ",
            O.edition,
            " · 修订 ",
            O.version,
            " · ",
            hf[O.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            O.valid_from,
            "；",
            O.valid_until ? "自 " + O.valid_until + " 起不再适用" : "未登记废止日期",
            O.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: P, onClick: () => void Be(O), children: "查看与核验" }),
        st && O.source_available === !1 && ["published", "approved", "superseded"].includes(O.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => {
          L(O), T(null), A(!1), xe("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, O.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !se || P, onClick: () => D(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !he || P, onClick: () => D(he || ""), children: "下一页" })
      ] })
    ] }) }),
    x && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (O) => {
      O.preventDefault(), We(async () => {
        if (!x.source_asset_id) throw new Error("请先上传规范原件。");
        const N = { ...x, scope: Object.fromEntries(Object.entries(x.scope).map(([Se, Me]) => [Se, ga(Me.join(`
`))])), clauses: x.clauses.map((Se) => ({
          ...Se,
          preconditions: ga(Se.preconditions.join(`
`)),
          exceptions: ga(Se.exceptions.join(`
`)),
          tables: ga(Se.tables.join(`
`)),
          notes: ga(Se.notes.join(`
`)),
          references: ga(Se.references.join(`
`))
        })) }, F = await d("/standards", { method: "POST", headers: { "Idempotency-Key": Q.current }, body: JSON.stringify(N) });
        Je(), T(null), L(await d("/standards/" + F.id)), Le((Se) => Se + 1), ue("规范草稿已保存，需核验后发布。");
      });
    }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h3", { children: x.expected_version ? "修订规范" : "登记规范" }),
        /* @__PURE__ */ s.jsx("span", { children: "原件和已保存版本保留不变" })
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { className: "proof-body", disabled: P, children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范名称",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: x.title, onChange: (O) => Ue({ title: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: x.code, readOnly: x.expected_version > 0, onChange: (O) => Ue({ code: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: x.edition, readOnly: x.expected_version > 0, onChange: (O) => Ue({ edition: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: x.maintainer, onChange: (O) => Ue({ maintainer: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: x.valid_from, onChange: (O) => Ue({ valid_from: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: x.valid_until || "", onChange: (O) => Ue({ valid_until: O.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (O) => {
            var F;
            const N = (F = O.target.files) == null ? void 0 : F[0];
            N && We(async () => {
              if (N.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const Se = await d(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(N.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: N });
              Ue({ source_asset_id: Se.asset_id }), g(N.name), ue("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: le || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([O, N]) => /* @__PURE__ */ s.jsxs("label", { children: [
            N,
            /* @__PURE__ */ s.jsx("textarea", { value: x.scope[O].join(`
`), onChange: (F) => Ue({ scope: { ...x.scope, [O]: F.target.value.split(`
`) } }) })
          ] }, O)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        x.clauses.map((O, N) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            N + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: O.number, onChange: (F) => we(N, { number: F.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: O.chapter, onChange: (F) => we(N, { chapter: F.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: O.parent_number || "", onChange: (F) => we(N, { parent_number: F.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: O.page || "", onChange: (F) => we(N, { page: F.target.value ? Number(F.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: O.locator, onChange: (F) => we(N, { locator: F.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: O.text, onChange: (F) => we(N, { text: F.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([F, Se]) => /* @__PURE__ */ s.jsxs("label", { children: [
              Se,
              /* @__PURE__ */ s.jsx("textarea", { value: O[F].join(`
`), onChange: (Me) => we(N, { [F]: Me.target.value.split(`
`) }) })
            ] }, F))
          ] }),
          x.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => Ue({ clauses: x.clauses.filter((F, Se) => Se !== N) }), children: "删除此条草稿" })
        ] }, N)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: x.clauses.length >= 200, onClick: () => Ue({ clauses: [...x.clauses, hu()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: x.reason, onChange: (O) => Ue({ reason: O.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !x.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Re() && (T(null), S(!1));
        }, children: "取消编辑" })
      ] })
    ] }),
    M && !x && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { children: M.title }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          M.code,
          " · ",
          M.edition,
          " · 修订 ",
          M.version,
          " · ",
          hf[M.state]
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
        /* @__PURE__ */ s.jsxs("p", { children: [
          "维护人：",
          M.maintainer,
          "；核验日期：",
          M.verified_on || "尚未核验",
          "。有效区间：",
          M.valid_from,
          " 至 ",
          M.valid_until || "未登记废止日期",
          "。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: P || M.source_available === !1, onClick: ot, children: "下载核对原件" }),
          ne && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || !M.clauses, onClick: Ie, children: "以此版本修订" })
        ] }),
        (rt = M.clauses) == null ? void 0 : rt.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
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
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([N, F]) => O[N].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: F }),
            O[N].map((Se, Me) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: Se }, Me))
          ] }, N))
        ] }, O.number)),
        M.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Y, onChange: (O) => {
              te(O.target.value), ie(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Y === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: ke, onChange: (O) => {
              h(O.target.value), ie(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([O, N]) => /* @__PURE__ */ s.jsxs("label", { children: [
            N,
            /* @__PURE__ */ s.jsx("input", { value: q[O], onChange: (F) => {
              W({ ...q, [O]: F.target.value }), ie(null);
            } })
          ] }, O)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: P, onClick: () => void We(async () => {
            ie(await d(`/standards/${M.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Y, event_date: ke || null, ...q }) }));
          }), children: "核对条件" }),
          ee && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[ee.status] }),
            ee.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              ee.missing.map((O) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[O] || O).join("、")
            ] }),
            ee.reasons.map((O) => /* @__PURE__ */ s.jsx("p", { children: O }, O)),
            /* @__PURE__ */ s.jsx("p", { children: ee.note })
          ] })
        ] }),
        lt && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: P, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Ye, maxLength: 2e3, onChange: (O) => xe(O.target.value) })
          ] }),
          M.state === "pending_review" && ze && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ae, onChange: (O) => A(O.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            M.state === "draft" && ne && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim(), onClick: () => Fe("submit"), children: "提交审核" }),
            M.state === "pending_review" && ze && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim() || !ae, onClick: () => Fe("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Ye.trim(), onClick: () => Fe("request_changes"), children: "退回修改" })
            ] }),
            M.state === "approved" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ye.trim(), onClick: () => Fe("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(M.state) && st && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Ye.trim(), onClick: () => Fe("withdraw"), children: "撤回此版本" })
          ] }),
          M.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (De = M.history) == null ? void 0 : De.map((O, N) => /* @__PURE__ */ s.jsxs("p", { children: [
            ff[O.action] || O.action,
            " · ",
            O.reason,
            " · ",
            new Date(O.created_at).toLocaleString("zh-CN")
          ] }, N))
        ] })
      ] })
    ] })
  ] });
}
const Sa = { kind: "asset", id: "", quote: "", locator: "" }, Df = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Sa] }, Mf = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, qf = { text: "", nature: "fact", evidence: [Sa] }, Hf = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Sa] }, oj = { name: "", value: null, evidence: [Sa] }, mf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Mf] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Df] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [qf], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [Hf], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Sa, kind: "work" }], historical_case_ids: [] }
}, hj = { evidence: Sa, records: Df, categories: Mf, claims: qf, steps: Hf, parameters: oj }, ya = {
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
}, fj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function Qi({ value: d, onChange: j, catalog: k, name: o = "", path: H = "content", readonly: G = !1 }) {
  var x;
  const X = ya[o] || o;
  if (Array.isArray(d)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: X }),
    d.map((T, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(Qi, { value: T, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: H + "." + K, catalog: k, readonly: G, onChange: (S) => j(d.map((P, oe) => oe === K ? S : P)) }),
      !G && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + X + String(K + 1), onClick: () => j(d.filter((S, P) => K !== P)), children: "移除" })
    ] }, K)),
    !G && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => j([...d, structuredClone(hj[o] ?? "")]), children: [
      "添加",
      X
    ] })
  ] });
  if (d !== null && typeof d == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(d).map(([T, K]) => T === "kind" && H === "content" ? null : /* @__PURE__ */ s.jsx(Qi, { name: T, value: K, path: H + "." + T, catalog: k, readonly: G, onChange: (S) => {
    const P = { ...d, [T]: S };
    T === "type" && ["judgment", "case"].includes(String(S)) && (P.options = {}), T === "kind" && "id" in d && (P.id = ""), j(P);
  } }, T)) });
  let M = fj[o];
  o === "kind" && (M = H.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (M = H.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const L = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in L || o === "historical_case_id") && (M = k.filter((T) => o in L ? T.work_kind === L[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(T.work_kind || "") : !0).map((T) => [T.id, T.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: H, children: [
    /* @__PURE__ */ s.jsx("span", { children: X || "内容" }),
    G ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((x = M == null ? void 0 : M.find((T) => T[0] === String(d))) == null ? void 0 : x[1]) || String(d ?? "待填") }) : M ? /* @__PURE__ */ s.jsxs("select", { id: H, value: String(d ?? ""), onChange: (T) => j(T.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      M.map(([T, K]) => /* @__PURE__ */ s.jsx("option", { value: T, children: K }, T))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: H, type: "date", value: String(d ?? ""), onChange: (T) => j(T.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: H, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(d ?? ""), onChange: (T) => j(T.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : T.target.value) })
  ] });
}
const xf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, jf = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function mj({ api: d, projects: j, identity: k }) {
  var O;
  const [o, H] = r.useState(((O = j[0]) == null ? void 0 : O.id) || ""), [G, X] = r.useState("hazard"), [M, L] = r.useState([]), [x, T] = r.useState([]), [K, S] = r.useState(null), [P, oe] = r.useState(null), [_e, be] = r.useState(""), [ge, de] = r.useState(!1), [V, ue] = r.useState(""), [se, D] = r.useState(""), [he, Oe] = r.useState(!1), [He, Le] = r.useState(!1), [Ye, xe] = r.useState(0), [ae, A] = r.useState(null), [le, g] = r.useState(""), [Y, te] = r.useState(null), [ke, h] = r.useState(null), [q, W] = r.useState(null), [ee, ie] = r.useState(null), Q = r.useRef(crypto.randomUUID()), I = r.useRef(0), Te = r.useRef(!1), ne = j.find((N) => N.id === o), ze = (N) => {
    var F, Se;
    return ne != null && ne.permissions ? ne.permissions.includes(N) : N.startsWith("training.") ? !!((F = ne == null ? void 0 : ne.roles) != null && F.some((Me) => ["admin", "teacher"].includes(Me))) : N === "knowledge.process" ? !!(ne != null && ne.can_run) : !!(ne != null && ne.can_manage) || !!((Se = ne == null ? void 0 : ne.roles) != null && Se.includes("reviewer"));
  }, st = ze(G === "question" ? "training.manage" : "knowledge.process"), lt = ze(G === "question" ? "training.review" : "knowledge.review"), We = ze(G === "question" ? "training.review" : "knowledge.publish"), Je = st || lt || We, Re = () => {
    var N;
    Te.current = !1, (N = window.QaxcClearPendingEdits) == null || N.call(window);
  }, Ue = () => !Te.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const N = (F) => {
      Te.current && (F.preventDefault(), F.returnValue = "");
    };
    return window.addEventListener("beforeunload", N), () => window.removeEventListener("beforeunload", N);
  }, []), r.useEffect(() => {
    let N = !1;
    if (Le(!0), L([]), ue(""), !o) {
      Le(!1);
      return;
    }
    return d(`/workflows?project_id=${encodeURIComponent(o)}&kind=${G}&view=${Je ? "manage" : "published"}${le ? "&cursor=" + encodeURIComponent(le) : ""}`).then((F) => {
      N || (L(F.items), A(F.next_cursor));
    }).catch((F) => {
      N || ue(F.message);
    }).finally(() => {
      N || Le(!1);
    }), Je && d(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((F) => {
      N || T(F.items);
    }).catch((F) => {
      N || ue(F.message);
    }), G === "hazard" && d(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((F) => {
      N || te(F);
    }).catch((F) => {
      N || ue(F.message);
    }), () => {
      N = !0;
    };
  }, [o, G, le, Je, Ye]), r.useEffect(() => () => {
    I.current++;
  }, []);
  const we = async (N) => {
    Oe(!0), ue(""), D("");
    try {
      await N();
    } catch (F) {
      ue(F.message);
    } finally {
      Oe(!1);
    }
  }, Be = () => {
    I.current++, S(null), oe(null), h(null), W(null), ie(null), g(""), be(""), de(!1), Re();
  }, Ie = async (N) => {
    if (!Ue()) return;
    const F = ++I.current;
    await we(async () => {
      const Se = await d("/workflows/" + N.id);
      F === I.current && (S(Se), oe(null), be(""), de(!1), W(null), ie(null), Re());
    });
  }, Fe = (N) => {
    oe((F) => F && { ...F, ...N }), Te.current = !0, Q.current = crypto.randomUUID();
  }, ot = () => we(async () => {
    if (!P) return;
    const N = await d("/workflows", { method: "POST", headers: { "Idempotency-Key": Q.current }, body: JSON.stringify({ ...P, project_id: o, reason: _e }) });
    S(N), oe(null), Re(), xe((F) => F + 1), D("已保存新版本，尚未审核发布。");
  }), je = (N, F) => we(async () => {
    const Se = await d(`/workflows/${N.id}/actions`, { method: "POST", body: JSON.stringify({ action: F, row_version: N.row_version, reason: _e, evidence_checked: ge }) });
    S(F === "withdraw" ? null : await d("/workflows/" + Se.id)), xe((Me) => Me + 1), Re(), D(jf[F] + "已完成");
  }), rt = (N) => we(async () => {
    const F = await d(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(N)}&limit=100`);
    h(F.items);
  }), De = () => we(async () => {
    if (!K) return;
    const N = await qt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + k } });
    if (!N.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const F = URL.createObjectURL(await N.blob()), Se = document.createElement("a");
    Se.href = F, Se.download = K.title + ".docx", Se.click(), setTimeout(() => URL.revokeObjectURL(F), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: he, onChange: (N) => {
          Ue() && (Be(), H(N.target.value));
        }, children: j.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he, onClick: () => xe((N) => N + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(mf).map((N) => /* @__PURE__ */ s.jsx("button", { disabled: he, className: "button " + (G === N ? "primary" : "ghost"), onClick: () => {
      Ue() && (Be(), X(N));
    }, children: ya[N] }, N)) }),
    V && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: V }),
    se && /* @__PURE__ */ s.jsx("p", { role: "status", children: se }),
    G === "hazard" && Y && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "隐患分类分析" }),
      /* @__PURE__ */ s.jsxs("div", { className: "wf-counts", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "事件 ",
          /* @__PURE__ */ s.jsx("strong", { children: Y.event_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "检查记录 ",
          /* @__PURE__ */ s.jsx("strong", { children: Y.inspection_record_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "项目 ",
          /* @__PURE__ */ s.jsx("strong", { children: Y.project_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "来源待核实 ",
          /* @__PURE__ */ s.jsx("strong", { children: Y.unavailable_count })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: Y.definition }),
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Y.categories.map((N) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: he, onClick: () => rt(N.category), children: [
        N.category,
        " · ",
        N.count,
        " 个事件 · 查看明细"
      ] }, N.category)) }),
      ke && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        ke.map((N) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ie(N), children: N.title }, N.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          ya[G],
          "清单"
        ] }),
        st && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: he, onClick: () => {
          Ue() && (Be(), oe({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(mf[G]) }), Te.current = !0, Q.current = crypto.randomUUID());
        }, children: [
          "新建",
          ya[G]
        ] })
      ] }),
      He ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : M.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        ya[G],
        "。",
        st ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: M.map((N) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: he || N.source_available === !1, onClick: () => Ie(N), children: N.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          N.version,
          " · ",
          xf[N.state],
          N.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        We && N.source_available === !1 && ["published", "approved", "superseded"].includes(N.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he || !_e.trim(), onClick: () => je(N, "withdraw"), children: "撤回此版本" })
      ] }, N.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(""), children: "首页" }),
        ae && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(ae), children: "下一页" })
      ] })
    ] }),
    P && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        ya[G],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: he, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: P.title, onChange: (N) => Fe({ title: N.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(Qi, { value: P.content, catalog: x, onChange: (N) => Fe({ content: N }) })
      ] })
    ] }),
    K && !P && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        xf[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        st && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he, onClick: () => {
          oe({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), Te.current = !0, Q.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he, onClick: De, children: "导出Word" }),
        ze("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => we(async () => {
          W((await d(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        G === "guide" && K.state === "published" && ze("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => we(async () => ie(await d("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        G === "question" && K.state === "published" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he, onClick: () => we(async () => {
          await d("/workflows/" + K.id + "/training-bank", { method: "POST" }), D("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      q && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        q.length ? q.map((N) => N.title + " v" + N.version).join("；") : "暂无下游成果"
      ] }),
      ee && /* @__PURE__ */ s.jsx("ul", { children: ee.steps.map((N) => /* @__PURE__ */ s.jsxs("li", { children: [
        N.number,
        " ",
        N.title,
        "：",
        N.question_count,
        " 道已发布题目"
      ] }, N.number)) }),
      /* @__PURE__ */ s.jsx(Qi, { value: K.content, catalog: x, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((N, F) => /* @__PURE__ */ s.jsxs("p", { children: [
          jf[N.action] || N.action,
          "：",
          N.reason
        ] }, F))
      ] })
    ] }),
    Je && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: _e, onChange: (N) => be(N.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      P ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he || !_e.trim() || !P.title.trim(), onClick: ot, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ge, onChange: (N) => de(N.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he || !_e.trim(), onClick: () => je(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && lt && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he || !ge || !_e.trim(), onClick: () => je(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he || !_e.trim(), onClick: () => je(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && We && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he || !_e.trim(), onClick: () => je(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && We && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: he || !_e.trim(), onClick: () => je(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const vf = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function xj({ id: d, identity: j, projects: k, navigate: o }) {
  const [H, G] = r.useState(null), [X, M] = r.useState(""), [L, x] = r.useState(!1), [T, K] = r.useState(""), [S, P] = r.useState(0), oe = `a-import-action:${j}:${d}`;
  async function _e(de, V) {
    const ue = await qt("/integration/v1/a-imports/" + d + de, V), se = await ue.json().catch(() => ({}));
    if (!ue.ok)
      throw ue.status >= 400 && ue.status < 500 && sessionStorage.removeItem(oe), new Error(se.message || `请求未完成（${ue.status}），请刷新查看最新状态。`);
    return se;
  }
  r.useEffect(() => {
    let de = !1;
    async function V() {
      try {
        const se = await _e("");
        de || (G(se), M(""));
      } catch (se) {
        de || (G(null), M(se.message));
      }
    }
    G(null), V();
    const ue = window.setInterval(V, 3e3);
    return () => {
      de = !0, clearInterval(ue);
    };
  }, [d, S, j]);
  const be = (de) => {
    var V, ue;
    return !!H && !!((ue = (V = k.find((se) => se.id === H.project_id)) == null ? void 0 : V.permissions) != null && ue.includes(de));
  };
  async function ge(de) {
    if (!(!H || L)) {
      x(!0), M("");
      try {
        const V = sessionStorage.getItem(oe), ue = V ? JSON.parse(V) : { operation: de, key: crypto.randomUUID(), body: { expected_version: H.version, ...de === "withdraw" ? { reason: T.trim() } : {} } };
        if (ue.operation !== de) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(oe, JSON.stringify(ue)), await _e("/" + de, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": ue.key }, body: JSON.stringify(ue.body) }), sessionStorage.removeItem(oe), P((se) => se + 1);
      } catch (V) {
        M(V.message);
      } finally {
        x(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => P((de) => de + 1), disabled: L, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      X && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: X }),
      H ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ s.jsxs("dd", { children: [
              "v",
              H.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: vf[H.status] || H.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: vf[H.retrospective_status] || H.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          H.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        H.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: H.error.message }),
        H.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: H.warnings.map((de, V) => /* @__PURE__ */ s.jsx("li", { children: de.message }, de.code + ":" + V)) })
        ] }),
        H.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          H.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          H.capabilities.can_view_materials && H.receipt_id && be("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + H.receipt_id), children: "查看原始资料" }),
          H.capabilities.can_generate_retrospective && be("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: L, onClick: () => void ge("retrospectives"), children: H.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          H.retrospective_id && H.status !== "withdrawn" && be("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + H.retrospective_id), children: "查看复盘" }),
          (H.status === "failed" || H.retrospective_status === "failed") && be("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: L, onClick: () => void ge("retry"), children: "重试失败任务" })
        ] }),
        H.status !== "withdrawn" && be("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: T, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (de) => K(de.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: L || !T.trim(), onClick: () => void ge("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: X ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function jj({ navigate: d }) {
  const [j, k] = r.useState([]), [o, H] = r.useState(""), [G, X] = r.useState(!1);
  return r.useEffect(() => {
    let M = !1;
    return (async () => {
      try {
        const [L, x, T] = await Promise.all([qt("/api/v1/health"), qt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!L.ok || !x.ok || !T.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, S, P] = await Promise.all([L.json(), x.json(), T.json()]), oe = window.QaxcProjectId, _e = P.tasks.filter((be) => !oe || be.projectId === oe).flatMap((be) => (be.events || []).map((ge) => ({ id: ge.id, action: be.title + " · " + ge.action, project_id: be.projectId, created_at: ge.uploadedAt, source: "现场作业" })));
        M || (X(K.worker_online), k([..._e, ...S.items.map((be) => ({ ...be, source: "知识与学习" }))].sort((be, ge) => Date.parse(ge.created_at) - Date.parse(be.created_at)).slice(0, 100)));
      } catch (L) {
        M || H(L.message);
      }
    })(), () => {
      M = !0;
    };
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ s.jsxs("p", { role: "status", children: [
      "后台处理：",
      G ? "在线" : "未连接或正在读取",
      "。成果接入、知识发布与资料处理共用后台任务队列。"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", style: { margin: "20px 0", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => d("/jobs"), children: "处理任务与重试" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => d("/settings/models"), children: "模型配置" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => d("/task-packages"), children: "成果与证据" })
    ] }),
    o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("h3", { children: "最近操作" }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。" }),
      j.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "业务" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: j.map((M) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(M.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: M.source }),
          /* @__PURE__ */ s.jsx("td", { children: M.action })
        ] }, M.source + M.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function vj({ deliveryId: d, navigate: j }) {
  const [k, o] = r.useState(!1), [H, G] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), X = r.useRef(!0);
  r.useEffect(() => (X.current = !0, () => {
    X.current = !1;
  }), []);
  async function M(x, T, K) {
    const S = await qt("/api/v1" + x, { method: T ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: T ? JSON.stringify(T) : void 0 }), P = await S.json();
    if (!S.ok) throw Error(P.message || "处理失败，请重试");
    return P;
  }
  async function L() {
    if (k) return;
    o(!0);
    const x = "archive-review:" + d, T = sessionStorage.getItem(x) || crypto.randomUUID();
    sessionStorage.setItem(x, T);
    try {
      G("正在核验归档成果…");
      const K = await M("/platform-archives", { delivery_id: d }, T);
      for (let S = 0; S < 60 && X.current; S++) {
        const P = await M("/task-packages/" + K.receipt_id);
        if (!X.current) return;
        if (P.status === "ready") {
          G("证据已校验，正在生成复盘…");
          const oe = await M("/retrospectives", { mode: "task_process", task_package_id: P.id });
          X.current && j("/retrospectives/" + oe.id);
          return;
        }
        if (["failed", "withdrawn"].includes(P.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        G("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((oe) => setTimeout(oe, 1e3));
      }
      X.current && G("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      X.current && G(K.message);
    } finally {
      X.current && o(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: H }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: k, onClick: () => void L(), children: "生成 / 打开复盘" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => j("/task-packages"), children: "成果处理清单" })
    ] })
  ] });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pj = (d) => d.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), gj = (d) => d.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (j, k, o) => o ? o.toUpperCase() : k.toLowerCase()
), pf = (d) => {
  const j = gj(d);
  return j.charAt(0).toUpperCase() + j.slice(1);
}, Bf = (...d) => d.filter((j, k, o) => !!j && j.trim() !== "" && o.indexOf(j) === k).join(" ").trim(), bj = (d) => {
  for (const j in d)
    if (j.startsWith("aria-") || j === "role" || j === "title")
      return !0;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var yj = {
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
const _j = r.forwardRef(
  ({
    color: d = "currentColor",
    size: j = 24,
    strokeWidth: k = 2,
    absoluteStrokeWidth: o,
    className: H = "",
    children: G,
    iconNode: X,
    ...M
  }, L) => r.createElement(
    "svg",
    {
      ref: L,
      ...yj,
      width: j,
      height: j,
      stroke: d,
      strokeWidth: o ? Number(k) * 24 / Number(j) : k,
      className: Bf("lucide", H),
      ...!G && !bj(M) && { "aria-hidden": "true" },
      ...M
    },
    [
      ...X.map(([x, T]) => r.createElement(x, T)),
      ...Array.isArray(G) ? G : [G]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kt = (d, j) => {
  const k = r.forwardRef(
    ({ className: o, ...H }, G) => r.createElement(_j, {
      ref: G,
      iconNode: j,
      className: Bf(
        `lucide-${pj(pf(d))}`,
        `lucide-${d}`,
        o
      ),
      ...H
    })
  );
  return k.displayName = pf(d), k;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], gf = kt("activity", Nj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], bf = kt("arrow-left", Sj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], bl = kt("arrow-right", wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], Xi = kt("book-open", kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], $s = kt("chevron-right", Cj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ej = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], yl = kt("circle-alert", Ej);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Oj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], _l = kt("circle-check", Oj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tj = [
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
], zj = kt("clipboard-list", Tj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Aj = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], iu = kt("database", Aj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uj = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], yf = kt("download", Uj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rj = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], Dj = kt("external-link", Rj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mj = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], wn = kt("file-check-2", Mj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qj = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], _f = kt("file-input", qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hj = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], cu = kt("file-search", Hj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bj = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Bi = kt("folder-lock", Bj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lj = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], Yj = kt("history", Lj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Nf = kt("layout-dashboard", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qj = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Sf = kt("loader-circle", Qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], wf = kt("play", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Vj = kt("plus", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], As = kt("refresh-cw", Jj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], $j = kt("search", Kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], kf = kt("shield-check", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], Lf = kt("upload", Fj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ij = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], Pj = kt("users", Ij);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Gi = kt("x", ev), Ss = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, _n = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Cf = (d) => d ? new Date(d).toLocaleString("zh-CN") : "尚未同步", Ef = (d) => {
  const j = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], k = (o) => j.includes(o) ? j.indexOf(o) : 100;
  return Object.entries(d).sort(([o], [H]) => k(o) - k(H));
}, ru = (d) => typeof d == "object" ? JSON.stringify(d, null, 2) : String(d ?? "—");
function tv({ asset: d, identity: j }) {
  const [k, o] = r.useState(""), [H, G] = r.useState("");
  return r.useEffect(() => {
    let X = !1, M = "";
    return qt(`/api/v1/assets/${d}/content`, { headers: { Authorization: `Bearer dev-${j}` } }).then(async (L) => {
      if (!L.ok) throw new Error("图片不可访问或已撤回");
      return L.blob();
    }).then((L) => {
      M = URL.createObjectURL(L), X ? URL.revokeObjectURL(M) : o(M);
    }).catch((L) => {
      X || G(L.message);
    }), () => {
      X = !0, M && URL.revokeObjectURL(M);
    };
  }, [d, j]), H ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: H }) : k ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: k, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function sv({ api: d, path: j, navigate: k, projects: o, identity: H }) {
  var it, Nt;
  const [G, X] = r.useState([]), [M, L] = r.useState([]), [x, T] = r.useState([]), [K, S] = r.useState([]), [P, oe] = r.useState("reports"), _e = r.useRef(0), [be, ge] = r.useState(""), [de, V] = r.useState([]), [ue, se] = r.useState(null), [D, he] = r.useState(""), [Oe, He] = r.useState(!1), [Le, Ye] = r.useState([]), [xe, ae] = r.useState({}), [A, le] = r.useState(0), [g, Y] = r.useState(null), [te, ke] = r.useState(null), [h, q] = r.useState(null), [W, ee] = r.useState(new URLSearchParams(location.search).get("source") || ""), [ie, Q] = r.useState(""), [I, Te] = r.useState(!1), [ne, ze] = r.useState(""), [st, lt] = r.useState(""), [We, Je] = r.useState(!0), [Re, Ue] = r.useState(!1), [we, Be] = r.useState(0), [Ie, Fe] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [ot, je] = r.useState(""), [rt, De] = r.useState(null), [O, N] = r.useState([]), [F, Se] = r.useState(""), [Me, et] = r.useState(0), [ht, B] = r.useState(!1), [fe, ce] = r.useState("csv"), [Ve, b] = r.useState(""), [ye, ve] = r.useState(""), [Ge, jt] = r.useState(((it = o.find((p) => p.can_run)) == null ? void 0 : it.id) || (Ot ? "" : "demo-airport")), U = o.some((p) => p.can_run), m = j.startsWith("/records/"), re = j.startsWith("/imports/") && j !== "/imports/new", pe = G.find((p) => p.id === W), at = M.filter((p) => p.kind === (pe == null ? void 0 : pe.kind) && p.project_id === (pe == null ? void 0 : pe.project_id));
  r.useEffect(() => {
    je(""), N([]), Se(""), et(0), ze(""), lt(""), q(null);
  }, [j]), r.useEffect(() => {
    let p = !1;
    Je(!0), ze(""), ke(null), Y(null);
    const Ne = new URLSearchParams(Object.entries(Ie).filter(([, vt]) => !!vt));
    Ne.set("limit", "15"), ot && Ne.set("cursor", ot);
    async function Pe() {
      try {
        const [vt, f] = await Promise.all([d("/sources?limit=100"), d("/input-files")]);
        if (p) return;
        if (X(vt.items), L(f.items), j === "/sources" || j === "/imports") {
          const Ce = await d("/imports?limit=15" + (ot ? "&cursor=" + encodeURIComponent(ot) : ""));
          if (p) return;
          T(Ce.items), De(Ce.next_cursor);
        } else if (re) {
          const Ce = await d(`${j}?after_row=${Me}&only_issues=${ht}`);
          p || Y(Ce);
        } else if (m) {
          const Ce = await d(j + (F ? "?version=" + F : ""));
          p || ke(Ce);
        } else if (j === "/records") {
          const Ce = await d("/records?" + Ne);
          if (p) return;
          if (Ye(Ce.items), De(Ce.next_cursor), ae(Ce.totals_by_kind), le(Ce.detail_groups_after_confirmed_links), P === "reports") {
            const Ee = new URLSearchParams(Ne);
            Ee.delete("cursor"), ot && Ee.set("after_id", ot);
            const $e = await d("/reports?" + Ee);
            if (p) return;
            S($e.items), De($e.next_cursor);
          }
        }
      } catch (vt) {
        p || ze(vt.message);
      } finally {
        p || Je(!1);
      }
    }
    return Pe(), () => {
      p = !0;
    };
  }, [j, Ie, ot, F, we, Me, ht, P]), r.useEffect(() => {
    if (!re || !g || !["queued", "running"].includes(g.status)) return;
    let p = !1;
    const Ne = setInterval(() => {
      d(`${j}?after_row=${Me}&only_issues=${ht}`).then((Pe) => {
        p || Y(Pe);
      }).catch((Pe) => {
        p || ze(Pe.message);
      });
    }, 1500);
    return () => {
      p = !0, clearInterval(Ne);
    };
  }, [j, g == null ? void 0 : g.status, Me, ht]), r.useEffect(() => {
    _e.current++, ge(""), V([]), se(null), he("");
  }, [Ie, P, j]);
  const _ = async (p, Ne = !1) => {
    const Pe = ++_e.current;
    if (!Ne && be === p) {
      ge(""), He(!1);
      return;
    }
    Ne || (V([]), se(null)), ge(p), He(!0), he("");
    const vt = new URLSearchParams(Object.entries(Ie).filter(([, f]) => !!f));
    vt.set("document_id", p), vt.set("limit", "15"), Ne && ue && vt.set("cursor", ue);
    try {
      const f = await d("/records?" + vt);
      if (Pe !== _e.current) return;
      V((Ce) => Ne ? [...Ce, ...f.items] : f.items), se(f.next_cursor);
    } catch (f) {
      Pe === _e.current && he(f.message);
    } finally {
      Pe === _e.current && He(!1);
    }
  }, me = async (p) => {
    Ue(!0), ze(""), lt("");
    try {
      await p();
    } catch (Ne) {
      ze(Ne.message);
    } finally {
      Ue(!1);
    }
  }, Qe = () => me(async () => {
    for (const p of o.filter((Ne) => Ne.can_run))
      for (const Ne of p.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const Pe = `mock-${p.id}-${Ne}`;
        G.some((vt) => vt.namespace === Pe && vt.project_id === p.id) || await d("/sources", { method: "POST", body: JSON.stringify({ name: `${p.id === "demo-airport" ? "机场" : "地铁"} · ${Ss[Ne]}（模拟）`, namespace: Pe, kind: Ne, project_id: p.id, mapping_template: Ne === "governance_export" ? "governance-v1" : `${Ne}-v1` }) });
      }
    lt("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), Be((p) => p + 1);
  }), Ct = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !O.length, onClick: () => {
        je(O.at(-1) || ""), N(O.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !rt, onClick: () => {
        N([...O, ot]), je(rt || "");
      }, children: "下一页" })
    ] })
  ] }), Lt = (p, Ne) => {
    Fe({ ...Ie, [p]: Ne }), je(""), N([]);
  }, Yt = (p) => me(async () => {
    const Ne = await qt(`/api/v1/assets/${p}/content`, { headers: { Authorization: `Bearer dev-${H}` } });
    if (!Ne.ok) {
      const f = await Ne.json();
      throw new Error(f.message);
    }
    const Pe = URL.createObjectURL(await Ne.blob()), vt = document.createElement("a");
    vt.href = Pe, vt.download = "来源文件", vt.click(), URL.revokeObjectURL(Pe);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(iu, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ot ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ne && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      ne,
      /* @__PURE__ */ s.jsx("button", { onClick: () => Be((p) => p + 1), children: "重新加载" })
    ] }),
    st && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      st
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: j === "/sources" ? "selected" : "", onClick: () => k("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: j.startsWith("/imports") ? "selected" : "", onClick: () => k("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: j.startsWith("/records") ? "selected" : "", onClick: () => k("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => Be((p) => p + 1), disabled: We, children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    We ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : j === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re || !U, onClick: () => void Qe(), children: [
          /* @__PURE__ */ s.jsx(iu, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: G.map((p) => {
        var Ne, Pe;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(iu, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ss[p.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: p.name }),
          /* @__PURE__ */ s.jsx("p", { children: (Ne = o.find((vt) => vt.id === p.project_id)) == null ? void 0 : Ne.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: p.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Cf(p.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: p.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((Pe = o.find((vt) => vt.id === p.project_id)) != null && Pe.can_run), onClick: () => {
            ee(p.id), Q(""), k("/imports/new?source=" + p.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(bl, { size: 16 })
          ] })
        ] }, p.id);
      }) }),
      !G.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(cu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      U && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Ot || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Ve, onChange: (p) => b(p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: ye, onChange: (p) => ve(p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: fe, onChange: (p) => ce(p.target.value), children: ["csv", "excel", "governance_export"].map((p) => /* @__PURE__ */ s.jsx("option", { value: p, children: Ss[p] }, p)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Ge, onChange: (p) => jt(p.target.value), children: o.filter((p) => p.can_run).map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Re || !Ve || !ye, onClick: () => void me(async () => {
          await d("/sources", { method: "POST", body: JSON.stringify({ name: Ve, namespace: ye, kind: fe, project_id: Ge, mapping_template: fe === "governance_export" ? "governance-v1" : `${fe}-v1` }) }), Be((p) => p + 1), lt("来源已创建。");
        }), children: "创建来源" })
      ] })
    ] }) : j === "/imports/new" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel import-form", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "新建历史项目" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择来源 → 预览映射与异常 → 后台增量接入" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "数据来源",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: W, onChange: (p) => {
                ee(p.target.value), Q(""), q(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                G.filter((p) => {
                  var Ne;
                  return (Ne = o.find((Pe) => Pe.id === p.project_id)) == null ? void 0 : Ne.can_run;
                }).map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ie, onChange: (p) => {
                Q(p.target.value), q(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                at.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.asset_id, children: p.label }, p.asset_id))
              ] })
            ] })
          ] }),
          !Ot && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: I, onChange: (p) => Te(p.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Ot && pe && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Re, accept: pe.kind === "csv" ? ".csv" : pe.kind === "excel" ? ".xlsx" : ".json", onChange: (p) => {
                var Pe;
                const Ne = (Pe = p.target.files) == null ? void 0 : Pe[0];
                p.target.value = "", Ne && me(async () => {
                  if (Ne.size > 5e6) throw new Error("文件不能超过5MB");
                  const vt = new Uint8Array(await Ne.arrayBuffer());
                  let f = "";
                  for (let Ee = 0; Ee < vt.length; Ee += 8192) f += String.fromCharCode(...vt.subarray(Ee, Ee + 8192));
                  const Ce = await d("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: pe.project_id, kind: pe.kind, name: Ne.name, base64: btoa(f) }) });
                  L((Ee) => [...Ee, Ce]), Q(Ce.asset_id), q(null), lt("文件已上传，请预览字段与异常后提交接入。");
                });
              } })
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "项目ID：",
              pe.project_id,
              "。文件必须保留稳定记录ID、报告ID和项目ID；记录类型为detail、review或summary。"
            ] }),
            /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsx("summary", { children: "查看所需表头" }),
              /* @__PURE__ */ s.jsx("p", { children: Object.values(pe.mapping).join("、") })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Re || !W || !ie, onClick: () => void me(async () => {
            q(await d("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: W, input_asset_id: ie }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(cu, { size: 16 }),
            "预览字段与异常"
          ] })
        ] })
      ] }),
      h && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "输入记录" }),
            /* @__PURE__ */ s.jsx("strong", { children: h.total })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "原始字段" }),
            /* @__PURE__ */ s.jsx("strong", { children: h.raw_columns.length })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "需核查行" }),
            /* @__PURE__ */ s.jsx("strong", { children: h.warning_rows })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ s.jsx("span", { children: "不能接入行" }),
            /* @__PURE__ */ s.jsx("strong", { children: h.failed_rows })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "字段映射" }),
            /* @__PURE__ */ s.jsx("span", { children: "未映射字段仍完整保留在原始字段中" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(h.mapping).map(([p, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: Ne }),
            /* @__PURE__ */ s.jsx(bl, { size: 13 }),
            /* @__PURE__ */ s.jsx("strong", { children: p })
          ] }, p)) })
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
            /* @__PURE__ */ s.jsx("tbody", { children: h.preview.map((p) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                p.row_number,
                /* @__PURE__ */ s.jsx("small", { children: p.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: ru(p.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: Ss[String(p.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...p.errors, ...p.issues].join("；") || "通过" })
            ] }, p.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re, onClick: () => void me(async () => {
              const p = await d("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: W, input_asset_id: ie, input_hash: h.input_hash, fail_after: !Ot && I ? 2 : null }) });
              k("/imports/" + p.id);
            }), children: [
              /* @__PURE__ */ s.jsx(Lf, { size: 16 }),
              Re ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : j === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !U, onClick: () => k("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(bl, { size: 15 })
        ] })
      ] }),
      x.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "来源 / 时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "新增" }),
          /* @__PURE__ */ s.jsx("th", { children: "更新" }),
          /* @__PURE__ */ s.jsx("th", { children: "跳过" }),
          /* @__PURE__ */ s.jsx("th", { children: "失败" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: x.map((p) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: p.source_name }),
            /* @__PURE__ */ s.jsx("small", { children: Cf(p.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: _n[p.status] }),
          ["created", "updated", "skipped", "failed"].map((Ne) => /* @__PURE__ */ s.jsx("td", { children: p.counts[Ne] }, Ne)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/imports/" + p.id), children: "查看历史项目" }) })
        ] }, p.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      Ct
    ] }) : re && g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => k("/imports"), children: [
        /* @__PURE__ */ s.jsx(bf, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: _n[g.status] }),
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
        g.job_status === "failed" && ((Nt = o.find((p) => p.id === g.source.project_id)) == null ? void 0 : Nt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Re, onClick: () => void me(async () => {
          await d(`/jobs/${g.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: g.row_version }) }), Be((p) => p + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(As, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      g.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: g.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((p) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: p === "failed" ? "失败行" : _n[p] }),
        /* @__PURE__ */ s.jsx("strong", { children: g.counts[p] })
      ] }, p)) }),
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
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(g.counts.kinds || {}).map(([p, Ne]) => `${Ss[p]} ${Ne}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ht, onChange: (p) => {
              B(p.target.checked), et(0);
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
          /* @__PURE__ */ s.jsx("tbody", { children: g.rows.map((p) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: p.row_number }),
            /* @__PURE__ */ s.jsx("td", { children: p.outcome === "failed" ? "失败" : _n[p.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: p.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: p.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/records/" + p.record_id), children: "查看证据" }) })
          ] }, p.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !Me, onClick: () => et(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !g.next_row, onClick: () => et(g.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : j === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((p) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            Ss[p],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: xe[p] || 0 })
        ] }, p)),
        /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsx("span", { children: "确认关联后的明细组" }),
          /* @__PURE__ */ s.jsx("strong", { children: A }),
          /* @__PURE__ */ s.jsx("small", { children: "仅合并已确认关系，非独立隐患结论" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "record-filters", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: Ie.project_id, onChange: (p) => Lt("project_id", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: Ie.source_id, onChange: (p) => Lt("source_id", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              G.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: Ie.record_kind, onChange: (p) => Lt("record_kind", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((p) => /* @__PURE__ */ s.jsx("option", { value: p, children: Ss[p] }, p))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: Ie.quality_status, onChange: (p) => Lt("quality_status", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ie.from_date, onChange: (p) => Lt("from_date", p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ie.to_date, onChange: (p) => Lt("to_date", p.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": P === "reports", onClick: () => {
            oe("reports"), je(""), N([]), ge("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": P === "rows", onClick: () => {
            oe("rows"), je(""), N([]);
          }, children: "逐条数据" })
        ] }),
        P === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((p) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": be === p.id, onClick: () => void _(p.id), children: [
            /* @__PURE__ */ s.jsx(cu, { size: 20 }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: p.title }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                p.source_name,
                " · ",
                p.report_id
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              p.count,
              " 条风险数据"
            ] }),
            /* @__PURE__ */ s.jsx(bl, { size: 16 })
          ] }),
          be === p.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            D && /* @__PURE__ */ s.jsx("p", { role: "alert", children: D }),
            Oe ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : de.map((Ne) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => k("/records/" + Ne.id), children: Ne.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                Ss[Ne.record_kind],
                " · v",
                Ne.current_version
              ] })
            ] }, Ne.id)),
            ue && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Oe, onClick: () => void _(p.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, p.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Le.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Le.map((p) => {
            var Ne;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => k("/records/" + p.id), children: p.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (Ne = G.find((Pe) => Pe.id === p.source_id)) == null ? void 0 : Ne.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Ss[p.record_kind] }),
              /* @__PURE__ */ s.jsx("td", { children: p.occurred_on || "未知" }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: `status ${p.quality_status === "valid" ? "succeeded" : "retrying"}`, children: p.quality_status === "valid" ? "通过" : "需核查" }) }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                "v",
                p.current_version
              ] })
            ] }, p.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的记录" }),
          /* @__PURE__ */ s.jsx("p", { children: "调整筛选条件，或先完成一批资料接入。" })
        ] }),
        Ct
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : m && te ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => k("/records"), children: [
        /* @__PURE__ */ s.jsx(bf, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            Ss[te.record_kind],
            " · ",
            Ot ? "来源记录" : "模拟记录"
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: te.description || "缺少描述" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            te.source.name,
            " · ",
            te.external_record_id
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "查看版本",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: te.selected_version, onChange: (p) => Se(p.target.value), children: te.versions.map((p) => /* @__PURE__ */ s.jsxs("option", { value: p.version, children: [
            "v",
            p.version,
            p.version === te.current_version ? " · 当前" : ""
          ] }, p.version)) })
        ] })
      ] }),
      te.issues.length > 0 && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: te.issues.join("；") }),
      /* @__PURE__ */ s.jsxs("div", { className: "record-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源原始字段" }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Object.keys(te.raw_fields).length,
              "个字段 · 完整保留"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Ef(te.raw_fields).map(([p, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: p }),
            /* @__PURE__ */ s.jsx("dd", { children: ru(Ne) })
          ] }, p)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Ef(te.effective_fields).map(([p, Ne]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: p }),
            /* @__PURE__ */ s.jsx("dd", { children: ru(Ne) })
          ] }, p)) }),
          /* @__PURE__ */ s.jsxs("details", { className: "provenance", children: [
            /* @__PURE__ */ s.jsx("summary", { children: "来源定位 / 人工修订 / 内容版本" }),
            /* @__PURE__ */ s.jsx("pre", { children: JSON.stringify(te.provenance, null, 2) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "report-note", children: [
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "原报告：",
              te.document.report_id
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: te.document.note })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel evidence-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "证据与图片关系" }),
          /* @__PURE__ */ s.jsx("span", { children: "确定锚点与候选关联分别标识" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "evidence-grid", children: te.evidence.map((p) => {
          var Ne;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Ss[p.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: p.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(p.locator) }),
            p.type !== "source_row" && p.asset_id ? /* @__PURE__ */ s.jsx(tv, { asset: p.asset_id, identity: H }) : p.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            p.asset_id && ((Ne = o.find((Pe) => Pe.id === te.project_id)) == null ? void 0 : Ne.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Re, onClick: () => void Yt(p.asset_id), children: "下载对应来源文件" })
          ] }, p.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        te.links.length ? te.links.map((p) => {
          var Ne;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: _n[p.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/records/" + p.other_record_id), children: "打开另一条记录" }),
            ((Ne = o.find((Pe) => Pe.id === te.project_id)) == null ? void 0 : Ne.roles.some((Pe) => ["admin", "reviewer"].includes(Pe))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Re || p.review_state === "stale", onClick: () => void me(async () => {
                await d(`/record-links/${p.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: p.row_version, decision: "confirmed" }) }), Be((Pe) => Pe + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Re || p.review_state === "stale", onClick: () => void me(async () => {
                await d(`/record-links/${p.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: p.row_version, decision: "rejected" }) }), Be((Pe) => Pe + 1);
              }), children: "排除" })
            ] })
          ] }, p.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ne ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const kn = "/history-reader";
function lv({ id: d }) {
  const [j, k] = r.useState(""), [o, H] = r.useState("");
  return r.useEffect(() => {
    let G = !1, X = "";
    return qt("/api/v1" + kn + "/images/" + encodeURIComponent(d)).then(async (M) => {
      if (!M.ok) throw Error("图片暂不可用");
      return M.blob();
    }).then((M) => {
      X = URL.createObjectURL(M), G ? URL.revokeObjectURL(X) : k(X);
    }).catch((M) => {
      G || H(M.message);
    }), () => {
      G = !0, X && URL.revokeObjectURL(X);
    };
  }, [d]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : j ? /* @__PURE__ */ s.jsx("a", { href: j, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: j, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function av({ api: d }) {
  const [j, k] = r.useState(null), [o, H] = r.useState([]), [G, X] = r.useState(""), [M, L] = r.useState(""), [x, T] = r.useState(0), [K, S] = r.useState(!1), [P, oe] = r.useState(0), [_e, be] = r.useState(""), [ge, de] = r.useState(null), [V, ue] = r.useState(!0), [se, D] = r.useState(!1), [he, Oe] = r.useState(""), [He, Le] = r.useState(""), Ye = r.useRef(null);
  r.useEffect(() => {
    var ae;
    ge && ((ae = Ye.current) == null || ae.scrollIntoView({ block: "start" }));
  }, [ge]), r.useEffect(() => {
    let ae = !1;
    return ue(!0), Oe(""), be(""), de(null), Promise.all([d(kn + "/summary"), d(kn + "/findings?" + new URLSearchParams({ q: M, offset: String(x) }))]).then(([A, le]) => {
      ae || (k(A), H(le.items), S(le.has_more));
    }).catch((A) => {
      ae || (Oe(A.message), H([]));
    }).finally(() => {
      ae || ue(!1);
    }), () => {
      ae = !0;
    };
  }, [M, x, P]), r.useEffect(() => {
    if (!_e) return;
    let ae = !1;
    return de(null), Le(""), D(!0), d(kn + "/findings/" + encodeURIComponent(_e)).then((A) => {
      ae || de(A);
    }).catch((A) => {
      ae || Le(A.message);
    }).finally(() => {
      ae || D(!1);
    }), () => {
      ae = !0;
    };
  }, [_e, P]);
  async function xe() {
    if (ge)
      try {
        const ae = await qt("/api/v1" + kn + "/documents/" + encodeURIComponent(ge.document_id) + "/original");
        if (!ae.ok) throw Error("原件暂不可用，请稍后重试。");
        const A = URL.createObjectURL(await ae.blob()), le = document.createElement("a");
        le.href = A, le.download = ge.original_name, le.click(), setTimeout(() => URL.revokeObjectURL(A), 1e3);
      } catch (ae) {
        Le(ae.message);
      }
  }
  return /* @__PURE__ */ s.jsxs("div", { className: "risk-data ingestion-module", children: [
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "风险数据 ",
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "只读" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "解析及核验进行中，当前条目尚未全部确认。" })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: V, onClick: () => oe((ae) => ae + 1), children: "刷新数据" })
      ] }),
      j && /* @__PURE__ */ s.jsxs("p", { children: [
        "已保存原报告 ",
        /* @__PURE__ */ s.jsx("strong", { children: j.documents.toLocaleString() }),
        " 份 · 当前版本问题 ",
        /* @__PURE__ */ s.jsx("strong", { children: j.findings.toLocaleString() }),
        " 条"
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "muted", children: "仅展示每份原报告的最新解析版本；条目数不代表去重隐患数。此入口供管理员核对全部风险数据，不随工作台项目筛选。" }),
      /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (ae) => {
        ae.preventDefault(), T(0), L(G.trim()), oe((A) => A + 1);
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "history-query", children: "搜索项目、工程、报告名或问题" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("input", { id: "history-query", value: G, onChange: (ae) => X(ae.target.value), maxLength: 100 }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: V, children: "搜索" })
        ] })
      ] })
    ] }),
    he && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      he,
      /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => oe((ae) => ae + 1), children: "重试" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", "aria-busy": V, children: [
      /* @__PURE__ */ s.jsx("h2", { children: "问题条目" }),
      V ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取风险数据…" }) : !he && !o.length ? /* @__PURE__ */ s.jsx("p", { children: "未找到匹配条目，请调整搜索条件。" }) : !he && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "项目 / 工程" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题描述 / 原报告" }),
            /* @__PURE__ */ s.jsx("th", { children: "查看" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: o.map((ae) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              ae.project_name || "项目待核",
              /* @__PURE__ */ s.jsx("br", {}),
              /* @__PURE__ */ s.jsx("span", { className: "muted", children: ae.engineering_project_name || "工程待核" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: ae.inspection_date || "日期待核" }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-description", children: [
              ae.problem_description,
              /* @__PURE__ */ s.jsx("br", {}),
              /* @__PURE__ */ s.jsx("small", { className: "muted", children: ae.original_name })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => be(ae.id), children: "查看证据" }) })
          ] }, ae.id)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: x === 0, onClick: () => T((ae) => Math.max(0, ae - 20)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            x / 20 + 1,
            " 页 · 本页 ",
            o.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !K, onClick: () => T((ae) => ae + 20), children: "下一页" })
        ] })
      ] })
    ] }),
    _e && /* @__PURE__ */ s.jsxs("section", { className: "panel", ref: Ye, "aria-busy": se, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
          be(""), de(null);
        }, children: "收起详情" })
      ] }),
      se && /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取字段和图片…" }),
      He && /* @__PURE__ */ s.jsx("p", { role: "alert", children: He }),
      ge && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("strong", { children: ge.original_name }) }),
        /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
          "解析版本时间：",
          new Date(ge.parsed_at).toLocaleString("zh-CN"),
          " · 提取结果待核验"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void xe(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: j == null ? void 0 : j.fields.map((ae) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: ae.label }),
          /* @__PURE__ */ s.jsx("dd", { children: ge.fields[ae.key] || "—" })
        ] }, ae.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        ge.evidence.map((ae, A) => {
          var le;
          return /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsxs("summary", { children: [
              ((le = j == null ? void 0 : j.fields.find((g) => g.key === ae.field_key)) == null ? void 0 : le.label) || ae.field_key,
              "：",
              ae.quote.slice(0, 100)
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: ae.quote }),
            /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
              "来源位置：",
              JSON.stringify(ae.locator)
            ] })
          ] }, A);
        }),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          ge.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片，关联结果仍需核对。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: ge.images.map((ae, A) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(lv, { id: ae.id }),
          /* @__PURE__ */ s.jsxs("figcaption", { children: [
            "关联方式：",
            ae.relation,
            /* @__PURE__ */ s.jsx("br", {}),
            "来源位置：",
            JSON.stringify(ae.locator)
          ] })
        ] }, ae.id + ":" + A)) })
      ] })
    ] })
  ] });
}
function zt(d, j) {
  return d ? d.permissions != null ? d.permissions.includes(j) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(j) ? !!d.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(j) ? d.roles.some((k) => ["admin", "reviewer"].includes(k)) : j === "training.manage" ? d.roles.some((k) => ["admin", "teacher"].includes(k)) : j === "training.review" ? d.roles.some((k) => ["admin", "teacher", "reviewer"].includes(k)) : !0 : !1;
}
const Ws = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Of = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Tf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function uu(d, j) {
  return [["标题", d.title, j.title], ["事实", d.facts.map((o) => o.text).join(`
`), j.facts.map((o) => o.text).join(`
`)], ["建议", d.suggestions.join(`
`), j.suggestions.join(`
`)], ["引用证据", d.facts.flatMap((o) => o.evidence_ids).join("、"), j.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(d.standards), JSON.stringify(j.standards)], ["施工要点", JSON.stringify(d.construction_points || []), JSON.stringify(j.construction_points || [])]].filter(([, o, H]) => o !== H);
}
function nv({ api: d, path: j, navigate: k, projects: o, identity: H }) {
  var U;
  const [G, X] = r.useState(!0), [M, L] = r.useState(!1), [x, T] = r.useState(""), [K, S] = r.useState(""), [P, oe] = r.useState(0), [_e, be] = r.useState([]), [ge, de] = r.useState([]), [V, ue] = r.useState([]), [se, D] = r.useState("knowledge_revision"), [he, Oe] = r.useState(""), [He, Le] = r.useState(""), [Ye, xe] = r.useState(""), [ae, A] = r.useState(null), [le, g] = r.useState([]), [Y, te] = r.useState(null), [ke, h] = r.useState("resolved"), [q, W] = r.useState(""), [ee, ie] = r.useState(""), [Q, I] = r.useState(((U = o.find((m) => zt(m, "knowledge.process"))) == null ? void 0 : U.id) || ""), [Te, ne] = r.useState([]), [ze, st] = r.useState([]), [lt, We] = r.useState("case_card"), [Je, Re] = r.useState("normal"), [Ue, we] = r.useState(null), [Be, Ie] = r.useState(sessionStorage.getItem("b03-last-job-" + H) || ""), [Fe, ot] = r.useState(null), [je, rt] = r.useState(null), [De, O] = r.useState(null), [N, F] = r.useState(""), [Se, Me] = r.useState(!1), et = /^\/knowledge\/[^/]+\/edit$/.test(j), ht = o.some((m) => zt(m, "knowledge.process")), B = o.some((m) => zt(m, "knowledge.review")), fe = j.startsWith("/quality"), ce = j === "/reviews";
  r.useEffect(() => {
    xe(""), g([]), Le(""), Oe(""), T(""), S(""), Me(!1), F("");
  }, [j]), r.useEffect(() => {
    let m = !1;
    X(!0), T(""), rt(null), O(null);
    async function re() {
      try {
        if (fe) {
          const pe = await d(`/quality/issues?limit=20${he ? "&rule_code=" + he : ""}${He ? "&status=" + He : ""}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (m) return;
          de(pe.items), ue(pe.summary), A(pe.next_cursor);
        } else if (et) {
          const pe = await d(j.replace("/edit", ""));
          if (m) return;
          rt(pe), O(structuredClone(pe.content));
        } else if (ce) {
          const pe = await d(`/reviews?object_type=${se}&state=${He || "pending_review"}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (m) return;
          be(pe.items), A(pe.next_cursor);
        } else {
          const pe = await d(`/knowledge?limit=20${He ? "&state=" + He : ""}${Ye ? "&cursor=" + encodeURIComponent(Ye) : ""}`);
          if (m) return;
          if (be(pe.items), A(pe.next_cursor), ht && Q) {
            const at = await d("/knowledge/source-options?project_id=" + Q);
            m || ne(at.items);
          }
        }
      } catch (pe) {
        m || T(pe.message);
      } finally {
        m || X(!1);
      }
    }
    return re(), () => {
      m = !0;
    };
  }, [j, He, he, Ye, P, Q, se]), r.useEffect(() => {
    st([]), we(null);
  }, [Q, lt, Je]), r.useEffect(() => {
    if (!Be || fe || et || ce || !ht) return;
    let m = !1;
    const re = () => {
      d("/knowledge/generation-jobs/" + Be).then((at) => {
        m || (ot(at), at.status === "succeeded" && oe((_) => _ + 1));
      }).catch((at) => {
        m || T(at.message);
      });
    };
    re();
    const pe = setInterval(() => {
      (!Fe || ["queued", "running", "retrying"].includes(Fe.status)) && re();
    }, 1800);
    return () => {
      m = !0, clearInterval(pe);
    };
  }, [Be, j, Fe == null ? void 0 : Fe.status]);
  const Ve = async (m) => {
    L(!0), T(""), S("");
    try {
      await m();
    } catch (re) {
      T(re.message);
    } finally {
      L(!1);
    }
  }, b = () => ({ record_version_ids: ze, type: lt, template_version: "mock-v1", mock_scenario: Je }), ye = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !le.length, onClick: () => {
        xe(le.at(-1) || ""), g(le.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !ae, onClick: () => {
        g([...le, Ye]), xe(ae || "");
      }, children: "下一页" })
    ] })
  ] }), ve = je && zt(o.find((m) => m.id === je.project_id), "knowledge.process"), Ge = je && zt(o.find((m) => m.id === je.project_id), "knowledge.review"), jt = (m) => Ve(async () => {
    if (!je) return;
    const re = m === "submit" ? `/knowledge/${je.id}/submit-review` : `/reviews/${je.revision_id}/${m}`;
    await d(re, { method: "POST", body: JSON.stringify({ row_version: je.row_version, revision_id: je.revision_id, reason: N, evidence_checked: Se }) }), S(m === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), oe((pe) => pe + 1), Me(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(wn, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    x && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      x,
      /* @__PURE__ */ s.jsx("button", { onClick: () => oe((m) => m + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => k("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: fe ? "selected" : "", onClick: () => k("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !fe && !ce ? "selected" : "", onClick: () => k("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ce ? "selected" : "", onClick: () => k("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: G, onClick: () => oe((m) => m + 1), children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    G ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : fe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Of).map(([m, re]) => /* @__PURE__ */ s.jsxs("button", { className: he === m ? "panel selected-quality" : "panel", "aria-pressed": he === m, onClick: () => {
        Oe(he === m ? "" : m), Le("open"), xe(""), g([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: re }),
        /* @__PURE__ */ s.jsx("strong", { children: V.filter((pe) => pe.rule_code === m && pe.status === "open").reduce((pe, at) => pe + at.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, m)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: He, onChange: (m) => {
            Le(m.target.value), xe(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((m) => /* @__PURE__ */ s.jsx("option", { value: m, children: Ws[m] }, m))
          ] })
        ] }),
        ge.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ge.map((m) => {
            var re, pe;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => k("/records/" + m.record_id), children: m.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Of[m.rule_code] || m.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                m.message,
                m.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (re = m.annotations.at(-1)) == null ? void 0 : re.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Ws[m.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((pe = o.find((at) => at.id === m.project_id)) != null && pe.can_run), onClick: () => {
                te(m), W(""), ie("");
              }, children: "核查处理" }) })
            ] }, m.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ye
      ] })
    ] }) : et && je && De ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Tf[je.type],
            " · v",
            je.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            Ws[je.state],
            " · 生成适配器：",
            je.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => k("/knowledge/drafts"), children: "返回候选列表" })
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
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k((je.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + je.source.record_id), children: je.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
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
              je.source.versions.map((m) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  m.version,
                  " · ",
                  m.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(m.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/records/" + m.record_id), children: "打开风险记录" })
              ] }, m.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              De.project_name,
              " · ",
              De.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            je.source.evidence.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[m.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(m.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: m.id })
            ] }, m.id)),
            je.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              je.source.annotations.map((m, re) => /* @__PURE__ */ s.jsxs("p", { children: [
                m.reason,
                " · ",
                JSON.stringify(m.value)
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
              /* @__PURE__ */ s.jsx("input", { value: De.title, disabled: !ve, onChange: (m) => O({ ...De, title: m.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            De.facts.map((m, re) => /* @__PURE__ */ s.jsxs("label", { children: [
              m.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ve, value: m.text, onChange: (pe) => O({ ...De, facts: De.facts.map((at, _) => _ === re ? { ...at, text: pe.target.value, source_kind: "human_annotation" } : at) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                m.evidence_ids.join("、")
              ] })
            ] }, re)),
            De.construction_points && De.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                De.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: De.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              De.construction_points.map((m, re) => {
                var pe;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    m.title,
                    " · ",
                    m.stage === "preparation" ? "施工准备" : m.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ve, value: m.content, onChange: (at) => {
                      var _;
                      return O({ ...De, construction_points: (_ = De.construction_points) == null ? void 0 : _.map((me, Qe) => Qe === re ? { ...me, content: at.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ve, value: m.inspection_method, onChange: (at) => {
                      var _;
                      return O({ ...De, construction_points: (_ = De.construction_points) == null ? void 0 : _.map((me, Qe) => Qe === re ? { ...me, inspection_method: at.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ve, value: m.common_mistakes, onChange: (at) => {
                      var _;
                      return O({ ...De, construction_points: (_ = De.construction_points) == null ? void 0 : _.map((me, Qe) => Qe === re ? { ...me, common_mistakes: at.target.value } : me) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: m.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    m.evidence_ids.join("、")
                  ] }),
                  (pe = m.source_quotes) == null ? void 0 : pe.map((at, _) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: at.text })
                  ] }, _))
                ] }, re);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ve, value: De.suggestions.join(`
`), onChange: (m) => O({ ...De, suggestions: m.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            De.standards.length ? De.standards.map((m, re) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: m.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                m.clause || "未提供",
                " · 版本：",
                m.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: m.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !ve, checked: m.verification_status === "not_used", onChange: (pe) => O({ ...De, standards: De.standards.map((at, _) => _ === re ? { ...at, verification_status: pe.target.checked ? "not_used" : "pending_verification" } : at) }) }),
                "明确不采用该依据"
              ] })
            ] }, re)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            uu(je.content, De).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              uu(je.content, De).map(([m, re, pe]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: m }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  re
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  pe
                ] })
              ] }, m))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: N, onChange: (m) => F(m.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              ve && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: M || !N.trim(), onClick: () => void Ve(async () => {
                await d(`/knowledge/${je.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: je.row_version, revision_id: je.revision_id, content: De, reason: N }) }), S("已创建新草稿版本；原版本和审核意见保留。"), oe((m) => m + 1);
              }), children: "保存新草稿版本" }),
              ve && ["draft", "changes_requested"].includes(je.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !N.trim() || JSON.stringify(De) !== JSON.stringify(je.content), onClick: () => void jt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Ge && je.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se, onChange: (m) => Me(m.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !Se || !N.trim() || JSON.stringify(De) !== JSON.stringify(je.content), onClick: () => void jt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: M || !N.trim(), onClick: () => void jt("request-changes"), children: "退回修改" })
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
        je.revisions.map((m, re) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            m.version,
            " · ",
            Ws[m.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: m.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            m.content.facts.map((pe) => pe.text).join("；")
          ] }),
          je.revisions[re + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              je.revisions[re + 1].version,
              "的修改："
            ] }),
            uu(je.revisions[re + 1].content, m.content).map(([pe, at, _]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: pe }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                at
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                _
              ] })
            ] }, pe))
          ] })
        ] }, m.id)),
        je.review_actions.map((m, re) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            m.version,
            " · ",
            Ws[m.action] || m.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: m.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(m.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            m.reviewer.slice(0, 8)
          ] })
        ] }, re))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ce && ht && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Q, onChange: (m) => I(m.target.value), children: o.filter((m) => zt(m, "knowledge.process")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: lt, onChange: (m) => We(m.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            st(Te.slice(0, 20).map((m) => m.record_version_id)), we(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Te.length ? Te.map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ze.includes(m.record_version_id), onChange: (re) => {
              st(re.target.checked ? [...ze, m.record_version_id] : ze.filter((pe) => pe !== m.record_version_id)), we(null);
            } }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              m.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "来源v",
                m.current_version,
                " · ",
                { detail: "明细", review: "复查", summary: "汇总" }[m.record_kind] || m.record_kind
              ] })
            ] })
          ] }, m.id)) : /* @__PURE__ */ s.jsx("p", { children: "当前项目尚无可用风险数据，请先完成历史数据接入。" }) }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "模拟校验场景（可选）" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "结构验证",
              /* @__PURE__ */ s.jsxs("select", { value: Je, onChange: (m) => Re(m.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: M || !ze.length || ze.length > 20, onClick: () => void Ve(async () => {
              we(await d("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              ze.length,
              "条）"
            ] }),
            Ue && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: M, onClick: () => void Ve(async () => {
              const m = await d("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              ot(null), Ie(m.job_id), sessionStorage.setItem("b03-last-job-" + H, m.job_id), S("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              Ue.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(bl, { size: 15 })
            ] })
          ] }),
          Ue && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: Ue.items.map((m, re) => /* @__PURE__ */ s.jsxs("p", { children: [
            m.description,
            " · 来源问题 ",
            m.quality_issue_count,
            "项"
          ] }, re)) }),
          Fe && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              Fe.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              Fe.counts.created,
              " · 复用 ",
              Fe.counts.skipped,
              " · 单项失败 ",
              Fe.counts.failed
            ] }),
            Fe.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: Fe.error }),
            Fe.items.map((m, re) => /* @__PURE__ */ s.jsxs("p", { children: [
              m.error || Ws[m.outcome],
              " ",
              m.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/knowledge/" + m.item_id + "/edit"), children: "打开知识卡" })
            ] }, re)),
            Fe.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: M, onClick: () => void Ve(async () => {
              await d("/jobs/" + Fe.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Fe.row_version }) }), ot(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "审核待办" : "知识候选列表" }),
          ce && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: se, onChange: (m) => {
            D(m.target.value), xe(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: He, onChange: (m) => {
            Le(m.target.value), xe(""), g([]);
          }, children: [
            !ce && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ce ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((m) => /* @__PURE__ */ s.jsx("option", { value: m, children: Ws[m] }, m))
          ] })
        ] }),
        ce && !B ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : _e.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: _e.map((m) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: m.title }),
            /* @__PURE__ */ s.jsx("td", { children: Tf[m.type] }),
            /* @__PURE__ */ s.jsx("td", { children: Ws[m.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              m.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k(m.object_type === "question_revision" ? "/training/questions/" + m.id : m.object_type === "retrospective_revision" ? "/retrospectives/" + m.id + "/review" : "/knowledge/" + m.id + "/edit"), children: ce ? "打开审核" : "核查与编辑" }) })
          ] }, m.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        ye
      ] })
    ] }),
    Y && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => te(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: Y.message }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ s.jsx("select", { value: ke, onChange: (m) => h(m.target.value), children: ["resolved", "ignored", "open"].map((m) => /* @__PURE__ */ s.jsx("option", { value: m, children: Ws[m] }, m)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: q, onChange: (m) => W(m.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: ee, onChange: (m) => ie(m.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !q.trim(), onClick: () => void Ve(async () => {
        await d("/quality/issues/" + Y.id, { method: "PATCH", body: JSON.stringify({ row_version: Y.row_version, status: ke, reason: q, annotation: ee || null }) }), te(null), oe((m) => m + 1), S("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const zf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, iv = (d) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[d] || "其他已配置场景", cv = (d) => [d.section, typeof d.row == "number" ? `第${d.row}行` : null, d.cell ? `单元格 ${d.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", du = (d) => d === "case_card" ? "案例卡" : "检查要点卡";
function rv({ identity: d, path: j, projects: k, navigate: o }) {
  var fe, ce, Ve, b, ye, ve, Ge, jt;
  const [H, G] = r.useState(((fe = k[0]) == null ? void 0 : fe.id) || ""), [X, M] = r.useState("generic"), [L, x] = r.useState(""), [T, K] = r.useState([]), [S, P] = r.useState({}), [oe, _e] = r.useState([]), [be, ge] = r.useState([]), [de, V] = r.useState("mock-hash-64"), [ue, se] = r.useState([]), [D, he] = r.useState(null), [Oe, He] = r.useState(""), [Le, Ye] = r.useState("extractive"), [xe, ae] = r.useState(null), [A, le] = r.useState(null), [g, Y] = r.useState(null);
  r.useEffect(() => () => {
    g && URL.revokeObjectURL(g);
  }, [g]), r.useEffect(() => {
    Y(null);
  }, [H, j]);
  const [te, ke] = r.useState(null);
  r.useEffect(() => {
    ke(null);
  }, [j]);
  const [h, q] = r.useState(""), [W, ee] = r.useState("useful"), [ie, Q] = r.useState(""), [I, Te] = r.useState(!1), [ne, ze] = r.useState(!0), [st, lt] = r.useState(""), [We, Je] = r.useState(""), [Re, Ue] = r.useState(0), [we, Be] = r.useState(""), [Ie, Fe] = r.useState(null), [ot, je] = r.useState([]), rt = r.useRef("");
  rt.current = [d, j, H, X, L, Oe, Le, te].join("|");
  const De = j === "/releases", O = j === "/search", N = j === "/knowledge/library", F = zt(k.find((U) => U.id === H), "knowledge.publish"), Se = !De && !O && !N ? j.split("/")[2] : null;
  async function Me(U, m = {}) {
    const re = await qt("/api/v1" + U, { ...m, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${d}`, ...m.headers } }), pe = await re.json();
    if (!re.ok) throw new Error(pe.message || "请求失败，请重试。");
    return pe;
  }
  r.useEffect(() => {
    ge([]), ae(null), le(null), lt(""), Je(""), Be(""), je([]);
  }, [H, j, X, L]), r.useEffect(() => {
    let U = !1;
    return ze(!0), lt(""), he(null), (async () => {
      try {
        if (De) {
          const re = await Me(`/releases?project_id=${H}${we ? "&cursor=" + encodeURIComponent(we) : ""}`);
          if (U) return;
          K(re.items), P(re.active_ids), Fe(re.next_cursor);
          const pe = await Me("/releases/options?project_id=" + H);
          U || _e(pe.items);
        } else if (N) {
          const re = await Me(`/knowledge/library?project_id=${H}${X ? "&scene_code=" + X : ""}${L ? "&card_type=" + L : ""}${we ? "&after_id=" + we : ""}`);
          U || (se(re.items), Fe(re.next_cursor));
        } else if (Se) {
          const re = await Me("/published/knowledge/" + Se + (te ? "?revision_id=" + te : ""));
          U || he(re);
        }
      } catch (re) {
        U || lt(re.message);
      } finally {
        U || ze(!1);
      }
    })(), () => {
      U = !0;
    };
  }, [H, j, X, L, Re, we, te]), r.useEffect(() => {
    if (!De || !T.some((m) => ["queued", "building"].includes(m.state))) return;
    const U = setInterval(() => Ue((m) => m + 1), 1800);
    return () => clearInterval(U);
  }, [De, T]);
  const et = async (U) => {
    Te(!0), lt(""), Je("");
    try {
      await U();
    } catch (m) {
      lt(m.message);
    } finally {
      Te(!1);
    }
  }, ht = (U, m, re = !1) => et(async () => {
    const pe = rt.current;
    Y(null), le(null);
    const at = await Me("/published/evidence/" + U + "?revision_id=" + m + (re ? "&historical=true" : ""));
    if (pe === rt.current && (le(at), at.has_image)) {
      const _ = await qt("/api/v1/published/evidence/" + U + "/content?revision_id=" + m + (re ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${d}` } });
      if (!_.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const me = await _.blob();
      pe === rt.current && Y(URL.createObjectURL(me));
    }
  }), B = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !ot.length || ne, onClick: () => {
        Be(ot.at(-1) || ""), je(ot.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Ie || ne, onClick: () => {
        je([...ot, we]), Be(Ie || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Xi, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: N || Se ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: O ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        k.some((U) => zt(U, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: De ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        le(null), ae(null), Ue((U) => U + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    st && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      st
    ] }),
    We && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      We
    ] }),
    !Se && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: H, onChange: (U) => G(U.target.value), children: k.map((U) => /* @__PURE__ */ s.jsx("option", { value: U.id, children: U.name }, U.id)) })
      ] }),
      !De && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: X, onChange: (U) => M(U.target.value), children: [
            N && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: L, onChange: (U) => x(U.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ne ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : De ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      F && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: oe.length ? oe.map((U) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: be.includes(U.revision_id), onChange: (m) => ge(m.target.checked ? [...be, U.revision_id] : be.filter((re) => re !== U.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: U.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              du(U.type),
              " · 审核版本 v",
              U.version
            ] })
          ] })
        ] }, U.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: de, onChange: (U) => V(U.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !be.length, onClick: () => void et(async () => {
            await Me("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: H, revision_ids: be, embedding_model: de }) }), ge([]), Je("发布集合已固定，处理服务正在构建索引。"), Ue((U) => U + 1);
          }), children: [
            "构建发布 · ",
            be.length,
            " 张"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "构建失败不会替换当前启用版本" })
        ] }),
        T.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: T.map((U) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: zf[U.state] || U.state }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                new Date(U.created_at).toLocaleString("zh-CN"),
                " · ",
                U.entries.length,
                " 张卡片 · ",
                U.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "批次 ",
                U.id.slice(0, 8),
                U.build_ms !== null ? ` · 构建 ${U.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                U.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(U.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void et(async () => {
                await Me("/releases/" + U.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: U.row_version, expected_active_id: S[H] || null }) }), Je("发布已启用，知识库与检索使用同一发布集合。"), Ue((m) => m + 1);
              }), children: "启用发布" }),
              U.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, onClick: () => void et(async () => {
                await Me("/jobs/" + U.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: U.job_row_version }) }), Ue((m) => m + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          U.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: U.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            U.entries.map((m) => /* @__PURE__ */ s.jsxs("p", { children: [
              m.revision_id.slice(0, 8),
              " · ",
              zf[m.state] || m.state,
              m.error ? " · " + m.error : ""
            ] }, m.revision_id))
          ] })
        ] }, U.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        B
      ] })
    ] }) : N ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ s.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      ue.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: ue.map((U) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          du(U.type),
          " · v",
          U.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: U.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + U.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(Dj, { size: 15 })
        ] })
      ] }, U.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Xi, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      B
    ] }) : O ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (U) => {
        U.preventDefault(), et(async () => {
          const m = rt.current;
          ae(null), le(null);
          const re = await Me("/search", { method: "POST", body: JSON.stringify({ project_id: H, question: Oe, scene_code: X, card_type: L || null, answer_mode: Le }) });
          m === rt.current && ae(re);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Oe, onChange: (U) => {
          He(U.target.value), ae(null), le(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Le, onChange: (U) => {
              Ye(U.target.value), ae(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !Oe.trim(), children: [
            /* @__PURE__ */ s.jsx($j, { size: 17 }),
            I ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      xe && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: xe.status === "answered" ? "找到有据内容" : xe.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            xe.latency_ms,
            " ms · ",
            xe.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          xe.answer_blocks.map((U, m) => /* @__PURE__ */ s.jsx("p", { children: U.text }, m)),
          xe.missing_conditions.map((U) => /* @__PURE__ */ s.jsx("p", { children: U }, U)),
          xe.warnings.map((U) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: U.message }, U.code))
        ] }),
        xe.results.map((U, m) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            m + 1,
            " · ",
            U.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + U.id), children: U.title }),
          /* @__PURE__ */ s.jsx("p", { children: U.text }),
          /* @__PURE__ */ s.jsx("div", { children: xe.citations.filter((re) => U.citation_ids.includes(re.citation_id)).map((re) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: I, onClick: () => void ht(re.evidence_id, re.knowledge_revision_id), children: [
            "打开来源：",
            re.source_title
          ] }, re.citation_id)) })
        ] }, U.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (U) => {
          U.preventDefault(), et(async () => {
            await Me("/search/" + xe.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: W, comment: ie }) }), Je("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: W, onChange: (U) => ee(U.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ie, maxLength: 1e3, onChange: (U) => Q(U.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, children: "保存反馈" })
        ] })
      ] })
    ] }) : D && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        D.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        du(D.type),
        " · v",
        D.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: D.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ce = k.find((U) => U.id === D.project_id)) == null ? void 0 : ce.name) || D.project_id,
        " · ",
        iv(D.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Ve = D.content) == null ? void 0 : Ve.facts.map((U, m) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: U.text }),
        /* @__PURE__ */ s.jsx("small", { children: U.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: U.evidence_ids.map((re) => /* @__PURE__ */ s.jsx("button", { disabled: I, className: "citation-button", onClick: () => void ht(re, D.revision_id, D.is_current_release === !1), children: "打开来源证据" }, re)) })
      ] }, m)),
      ((b = D.content) == null ? void 0 : b.construction_points) && D.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          D.content.category_name || "通用"
        ] }),
        D.content.construction_points.map((U, m) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            U.title,
            " · ",
            U.stage === "preparation" ? "施工准备" : U.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: U.content }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "检查方法：",
            U.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "常见问题：",
            U.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ s.jsx("small", { children: U.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ s.jsx("div", { children: U.evidence_ids.map((re) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void ht(re, D.revision_id, D.is_current_release === !1), children: "核对要点来源" }, re)) })
        ] }, m))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((ye = D.content) == null ? void 0 : ye.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (ve = D.content) == null ? void 0 : ve.suggestions.map((U, m) => /* @__PURE__ */ s.jsx("p", { children: U }, m)),
      (Ge = D.content) != null && Ge.standards.length ? D.content.standards.map((U, m) => /* @__PURE__ */ s.jsxs("p", { children: [
        U.name,
        " ",
        U.clause,
        " · ",
        U.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, m)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          D.release_id
        ] }),
        (jt = D.versions) == null ? void 0 : jt.map((U) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          ke(U.id), le(null);
        }, children: [
          "查看已发布 v",
          U.version
        ] }, U.id)),
        /* @__PURE__ */ s.jsx("p", { children: D.history_note })
      ] }),
      zt(k.find((U) => U.id === D.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: h, maxLength: 2e3, onChange: (U) => q(U.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: I || !h.trim(), onClick: () => void et(async () => {
          await Me("/knowledge/" + D.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: D.row_version, reason: h }) }), he(null), le(null), Je("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    A && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          A.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => le(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: A.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: A.description || "来源描述缺失" }),
        g && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: g, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          cv(A.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: A.note })
      ] })
    ] })
  ] });
}
const Nn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, Yf = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, fu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, uv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, mu = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, xu = (d) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[d] || d, Cn = (d) => d ? new Date(d).toLocaleString("zh-CN") : "实际时间未提供", dv = (d) => JSON.stringify(d, null, 2), ov = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function _a(d, j = "") {
  if (d == null) return "未提供";
  if (Array.isArray(d)) return d.every((k) => typeof k != "object") ? d.join("、") : d.map((k, o) => `第${o + 1}条
${_a(k)}`).join(`

`);
  if (typeof d == "object") return Object.entries(d).map(([k, o]) => `${ov[k] || fu[k] || k}：${_a(o, k)}`).join(`
`);
  if (typeof d == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(j)) return Cn(d);
    if (j === "actor_role" || j === "role") return xu(d);
    if (j === "event_type") return Yf[d] || d;
    if (j === "evidence_type") return mu[d] || d;
    if (j === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[d] || d;
  }
  return String(d);
}
const hv = (d) => {
  const j = d.note;
  return typeof j == "string" ? j : Object.keys(d).length ? dv(d) : "未补充说明";
};
function fv({ identity: d, path: j, projects: k, navigate: o }) {
  var De, O, N, F, Se, Me, et, ht, B, fe, ce, Ve;
  const H = j === "/task-packages/import", G = !H && j !== "/task-packages" ? j.split("/")[2] : null, [X, M] = r.useState(((De = k[0]) == null ? void 0 : De.id) || ""), [L, x] = r.useState(""), [T, K] = r.useState([]), [S, P] = r.useState(null), [oe, _e] = r.useState(""), [be, ge] = r.useState(null), [de, V] = r.useState([]), [ue, se] = r.useState([]), [D, he] = r.useState([]), [Oe, He] = r.useState("complete"), [Le, Ye] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + d) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [xe, ae] = r.useState(""), [A, le] = r.useState(null), [g, Y] = r.useState(""), [te, ke] = r.useState(""), [h, q] = r.useState(!0), [W, ee] = r.useState(!1), [ie, Q] = r.useState(0), [I, Te] = r.useState(""), [ne, ze] = r.useState(null), st = r.useRef(null), lt = r.useRef(null), We = r.useRef("");
  We.current = [d, j, X, Oe, Le, xe].join("|");
  const Je = k.some((b) => b.permissions != null), Re = !Je && zt(k.find((b) => b.id === X), "imports.create"), Ue = S && !Je && zt(k.find((b) => b.id === S.project_id), "imports.withdraw"), we = S && !Je && zt(k.find((b) => b.id === S.project_id), "imports.create");
  async function Be(b, ye = {}) {
    const ve = await qt("/api/v1/task-packages" + b, {
      ...ye,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${d}`, ...ye.headers }
    }), Ge = await ve.json().catch(() => ({}));
    if (!ve.ok) throw new Error(Ge.message || "接入服务暂未就绪，请稍后刷新。");
    return Ge;
  }
  const Ie = async (b) => {
    ee(!0), Y(""), ke("");
    try {
      await b();
    } catch (ye) {
      Y(ye.message);
    } finally {
      ee(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + d, Le);
  }, [Le, d]), r.useEffect(() => () => {
    ne != null && ne.url && URL.revokeObjectURL(ne.url);
  }, [ne == null ? void 0 : ne.url]), r.useEffect(() => {
    _e(""), V([]), Y(""), ke(""), ze(null), Te(""), le(null);
  }, [j, X, L]), r.useEffect(() => {
    let b = !1;
    return q(!0), P(null), Y(""), (async () => {
      try {
        if (H && Ot) {
          const ve = await qt("/api/v1/platform-archives"), Ge = await ve.json();
          if (!ve.ok) throw new Error(Ge.message);
          b || se(Ge.items);
        } else if (H) {
          const ve = await Be("/samples");
          b || he(ve.items);
        } else if (G) {
          const ve = await Be("/" + G);
          b || P(ve);
        } else {
          const ve = await Be(`?project_id=${X}${L ? "&state=" + L : ""}${oe ? "&cursor=" + encodeURIComponent(oe) : ""}`);
          b || (K(ve.items), ge(ve.next_cursor));
        }
      } catch (ve) {
        b || Y(ve.message);
      } finally {
        b || q(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [j, X, L, oe, ie]), r.useEffect(() => {
    if (Ot || !H || !Re) return;
    let b = !1;
    le(null), ae("");
    const ye = Le + "." + (Oe === "v2" ? "complete" : Oe);
    return Be(`/samples/${Oe}?project_id=${X}&task_id=${ye}`).then((ve) => {
      b || ae(JSON.stringify(ve, null, 2));
    }).catch((ve) => {
      b || Y(ve.message);
    }), () => {
      b = !0;
    };
  }, [H, X, Oe, Le]), r.useEffect(() => {
    if (!(S && ["received", "validating", "processing"].includes(S.status) || !G && T.some((ve) => ["received", "validating", "processing"].includes(ve.status))) || H) return;
    const ye = setInterval(() => Q((ve) => ve + 1), 1800);
    return () => clearInterval(ye);
  }, [S == null ? void 0 : S.status, T, j]);
  const Fe = () => Ie(async () => {
    const b = We.current;
    le(null);
    const ye = await Be("/preview", { method: "POST", body: xe });
    We.current === b && le(ye);
  }), ot = () => Ie(async () => {
    var ye;
    if (!A) return;
    ((ye = st.current) == null ? void 0 : ye.hash) !== A.content_hash && (st.current = { hash: A.content_hash, key: crypto.randomUUID() });
    const b = await Be("", { method: "POST", headers: { "Idempotency-Key": st.current.key }, body: xe });
    ke(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + b.receipt_id);
  }), je = (b) => Ie(async () => {
    const ye = We.current;
    ze(null);
    const ve = await qt(`/api/v1/task-packages/${G}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${d}` } });
    if (!ve.ok) {
      const jt = await ve.json().catch(() => ({}));
      throw new Error(jt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Ge = await ve.blob();
    if (ye === We.current)
      if (b.mime_type.startsWith("text/")) {
        const jt = await Ge.slice(0, 1e6).text();
        ye === We.current && ze({ id: b.attachment_id, url: null, text: jt });
      } else if (b.mime_type.startsWith("image/")) ze({ id: b.attachment_id, url: URL.createObjectURL(Ge), text: null });
      else {
        const jt = URL.createObjectURL(Ge), U = document.createElement("a");
        U.href = jt, U.download = "任务附件", U.click(), URL.revokeObjectURL(jt);
      }
  }), rt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !de.length || h, onClick: () => {
        _e(de.at(-1) || ""), V(de.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !be || h, onClick: () => {
        V([...de, oe]), _e(be || "");
      }, children: "下一页" })
    ] })
  ] });
  return k.length ? Je && H ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(_f, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ot ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Je ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: H ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !Je && k.some((b) => zt(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: H ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        ze(null), Q((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (S == null ? void 0 : S.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + S.a_import_id), children: "接入与复盘状态" }),
    g && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      g
    ] }),
    te && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      te
    ] }),
    !G && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: X, onChange: (b) => M(b.target.value), children: k.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !H && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: L, onChange: (b) => x(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: Nn[b] }, b))
        ] })
      ] })
    ] }),
    h ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : H ? Re ? Ot ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        ue.filter((b) => b.project_id === X).map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            b.title,
            " · 第",
            b.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: W, onClick: () => void Ie(async () => {
            const ye = await qt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), ve = await ye.json();
            if (!ye.ok) throw new Error(ve.message);
            o("/task-packages/" + ve.receipt_id);
          }), children: "接入此成果" })
        ] }, b.id)),
        !ue.some((b) => b.project_id === X) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Oe, onChange: (b) => He(b.target.value), children: D.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: W, onClick: () => Ye("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: W, onChange: (b) => {
              var ve;
              const ye = (ve = b.target.files) == null ? void 0 : ve[0];
              if (ye) {
                if (ye.size > 5242880) {
                  Y("文件超过5MiB上限。");
                  return;
                }
                ye.text().then((Ge) => {
                  ae(Ge), le(null), Y("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: xe, onChange: (b) => {
              ae(b.target.value), le(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: W || !xe, onClick: () => void Fe(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: W || !A, onClick: () => void ot(), children: [
              /* @__PURE__ */ s.jsx(Lf, { size: 16 }),
              W ? "正在处理…" : "确认接入归档成果"
            ] })
          ] })
        ] })
      ] }),
      A && /* @__PURE__ */ s.jsxs("section", { className: "panel package-preview", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          A.name,
          " · 第",
          A.package_version,
          "版"
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "归属项目：",
          ((O = k.find((b) => b.id === A.project_id)) == null ? void 0 : O.name) || A.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(A.counts).map(([b, ye]) => /* @__PURE__ */ s.jsxs("span", { children: [
          fu[b],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: ye })
        ] }, b)) }),
        /* @__PURE__ */ s.jsx("p", { children: A.note }),
        A.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : G ? S && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: S.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((N = k.find((b) => b.id === S.project_id)) == null ? void 0 : N.name) || S.project_id,
              " · 第",
              S.package_version,
              "版 · ",
              Nn[S.status],
              S.is_current ? " · 当前可用版本" : ""
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: S.is_demo ? "模拟任务包" : "平台归档成果" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-version-stats", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "最新收到 ",
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "第",
              S.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "当前可用 ",
            /* @__PURE__ */ s.jsx("strong", { children: S.current_package_id ? "第" + S.current_ready_version + "版" : "暂无（不会自动恢复旧版）" })
          ] })
        ] }),
        S.capabilities.map((b) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: uv[b] }, b)),
        S.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        S.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/retrospectives/" + S.retrospective_id), children: "打开已有复盘" }),
        we && S.status === "ready" && S.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: W, onClick: () => void Ie(async () => {
          const b = await qt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${d}` }, body: JSON.stringify({ mode: "task_process", task_package_id: S.id }) }), ye = await b.json();
          if (!b.ok) throw new Error(ye.message);
          o("/retrospectives/" + ye.id);
        }), children: "自动生成 / 更新复盘" })
      ] }),
      S.status === "withdrawn" ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "此任务包已撤回" }),
        /* @__PURE__ */ s.jsx("p", { children: "正文、事件、问题和附件已停止在线使用。" }),
        S.invalidations.map((b) => /* @__PURE__ */ s.jsxs("p", { children: [
          "下游失效通知：",
          b.state === "handled" ? "复盘、培训实时来源保护已生效" : b.state === "pending" ? "历史通知待标记；当前在线访问仍受来源保护" : b.state
        ] }, b.id))
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        (S.warnings.length > 0 || S.validation_errors.length > 0) && /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "校验结果与资料限制" }),
          S.validation_errors.map((b, ye) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "e" + ye)),
          S.warnings.map((b, ye) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "w" + ye))
        ] }),
        ["received", "validating", "processing"].includes(S.status) && /* @__PURE__ */ s.jsxs("div", { className: "feedback", children: [
          "后台处理中 · ",
          S.progress,
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-facts", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "任务快照" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "开始：",
            Cn((F = S.task) == null ? void 0 : F.started_at),
            "　结束：",
            Cn((Se = S.task) == null ? void 0 : Se.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((Me = S.participants) == null ? void 0 : Me.map((b) => xu(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (et = S.issues) == null ? void 0 : et.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              Cn(b.due_at)
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
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (ht = S.events) != null && ht.length ? S.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Cn(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? Yf[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: hv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === S.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                xu(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((ye) => {
                  var Ge;
                  const ve = (Ge = S.attachments) == null ? void 0 : Ge.find((jt) => jt.attachment_id === ye);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: W || !ve || ve.state !== "verified", onClick: () => ve && void je(ve), children: [
                    ve ? mu[ve.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ye
                  ] }, ye);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          S.event_next !== null && S.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: W, onClick: () => void Ie(async () => {
            const b = await Be("/" + G + "?event_after=" + S.event_next);
            P({ ...b, events: [...S.events || [], ...b.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (B = S.attachments) != null && B.length ? S.attachments.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                mu[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Nn[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: W || b.state !== "verified", onClick: () => void je(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
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
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (fe = S.versions) == null ? void 0 : fe.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === S.id, onClick: () => o("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            Nn[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (ce = S.diff) != null && ce.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            S.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Ve = S.diff) == null ? void 0 : Ve.changes.map((b, ye) => {
            var ve, Ge, jt, U, m;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                fu[b.section] || b.section,
                "有变化"
              ] }),
              "before" in b ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: _a(b.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: _a(b.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((ve = b.added) == null ? void 0 : ve.join("、")) || "无",
                  "；移除：",
                  ((Ge = b.removed) == null ? void 0 : Ge.join("、")) || "无"
                ] }),
                b.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (jt = b.before_order) == null ? void 0 : jt.join(" → "),
                  "　调整为　",
                  (U = b.after_order) == null ? void 0 : U.join(" → ")
                ] }),
                (m = b.changed) == null ? void 0 : m.map((re) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      re.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: _a(re.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: _a(re.after) })
                  ] })
                ] }, re.id))
              ] })
            ] }, ye);
          })
        ] }),
        (Ue || we && S.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          we && S.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: W, onClick: () => void Ie(async () => {
            const b = await qt("/api/v1/jobs/" + S.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${d}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: S.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            ke("已提交重试，已保存事件与附件不会重复新增。"), Q((ye) => ye + 1);
          }), children: "重试接入" }),
          Ue && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: I, maxLength: 2e3, onChange: (b) => Te(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: W || !I.trim(), onClick: () => void Ie(async () => {
              var ve;
              const b = JSON.stringify({ reason: I }), ye = S.id + b;
              ((ve = lt.current) == null ? void 0 : ve.body) !== ye && (lt.current = { body: ye, key: crypto.randomUUID() }), await Be("/" + S.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": lt.current.key }, body: b }), ze(null), Q((Ge) => Ge + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      T.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ s.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ s.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: T.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
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
          /* @__PURE__ */ s.jsx("td", { children: Nn[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(_f, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      rt
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function Gf(d, j, k, o) {
  const H = await d(j, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(k) });
  o();
  const G = Date.now() + 1200 * 1e3;
  for (; Date.now() < G; ) {
    const X = await d("/model-generation-jobs/" + H.job_id);
    if (X.status === "succeeded") return X.result;
    if (X.status === "failed") throw new Error(X.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((M) => setTimeout(M, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Sn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, mv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, xv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Li = (d) => d ? new Date(d).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function jv({ api: d, path: j, navigate: k, projects: o, identity: H }) {
  var ht;
  const G = j.split("/")[2], X = j.endsWith("/review"), [M, L] = r.useState([]), [x, T] = r.useState(null), [K, S] = r.useState(null), [P, oe] = r.useState(!1), [_e, be] = r.useState(!0), [ge, de] = r.useState(""), [V, ue] = r.useState(""), [se, D] = r.useState(0), [he, Oe] = r.useState("llm"), [He, Le] = r.useState("task_process"), [Ye, xe] = r.useState(((ht = o.find((B) => zt(B, "retrospective.generate"))) == null ? void 0 : ht.id) || ""), [ae, A] = r.useState([]), [le, g] = r.useState(""), [Y, te] = r.useState([]), [ke, h] = r.useState([]), [q, W] = r.useState(""), [ee, ie] = r.useState(!1), [Q, I] = r.useState(""), [Te, ne] = r.useState(""), [ze, st] = r.useState(""), [lt, We] = r.useState(null), [Je, Re] = r.useState([]), [Ue, we] = r.useState(null), [Be, Ie] = r.useState(""), [Fe, ot] = r.useState(""), je = o.some((B) => zt(B, "retrospective.generate")), rt = !!(x != null && x.is_current) && !!zt(o.find((B) => B.id === x.project_id), "retrospective.edit"), De = !!(x != null && x.is_current) && !!zt(o.find((B) => B.id === x.project_id), "retrospective.review");
  r.useEffect(() => {
    I(""), W(""), ie(!1), de(""), ue(""), st(""), Re([]), we(null);
  }, [j]), r.useEffect(() => {
    let B = !1;
    return be(!0), T(null), de(""), (async () => {
      try {
        if (G) {
          const ce = await d(`/retrospectives/${G}${Q ? "?revision_id=" + Q : ""}`);
          B || (T(ce), S({ summary: ce.summary, findings: structuredClone(ce.findings), suggestions: structuredClone(ce.suggestions) }), ie(!1));
        } else {
          const ce = await d(`/retrospectives?limit=20${Te ? "&state=" + Te : ""}${ze ? "&cursor=" + encodeURIComponent(ze) : ""}`);
          B || (L(ce.items), We(ce.next_cursor));
        }
      } catch (ce) {
        B || de(ce.message);
      } finally {
        B || be(!1);
      }
    })(), () => {
      B = !0;
    };
  }, [G, j, Q, Te, ze, se]), r.useEffect(() => {
    if (G || !Ye || !je) return;
    let B = !1;
    return h([]), A([]), te([]), g(""), (async () => {
      var ce;
      try {
        const [Ve, b] = await Promise.all([d(`/task-packages?project_id=${Ye}&state=ready&limit=100`), d(`/knowledge/source-options?project_id=${Ye}&limit=100`)]);
        if (B) return;
        const ye = Ve.items.filter((ve) => ve.is_current);
        A(ye), g(((ce = ye[0]) == null ? void 0 : ce.id) || ""), te(b.items);
      } catch (Ve) {
        B || de(Ve.message);
      }
    })(), () => {
      B = !0;
    };
  }, [G, Ye, se]), r.useEffect(() => {
    if (!(Ue != null && Ue.asset_id) || Ue.type !== "task_attachment") {
      Ie(""), ot("");
      return;
    }
    let B = !1, fe = "";
    return qt("/api/v1/assets/" + Ue.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + H } }).then(async (ce) => {
      if (!ce.ok) {
        const b = await ce.json();
        throw new Error(b.message);
      }
      const Ve = await ce.blob();
      !B && /^(image\/|text\/plain)/.test(Ve.type) && (fe = URL.createObjectURL(Ve), Ie(fe), ot(Ve.type));
    }).catch((ce) => {
      B || de(ce.message);
    }), () => {
      B = !0, fe && URL.revokeObjectURL(fe), Ie("");
    };
  }, [Ue, H]);
  const O = async (B) => {
    oe(!0), de(""), ue("");
    try {
      await B();
    } catch (fe) {
      de(fe.message);
    } finally {
      oe(!1);
    }
  }, N = () => ({ revision_id: x.revision_id, row_version: x.row_version, reason: q, evidence_checked: ee }), F = !!x && !!K && JSON.stringify(K) === JSON.stringify({ summary: x.summary, findings: x.findings, suggestions: x.suggestions }), Se = (B) => void O(async () => {
    const fe = B === "submit" ? `/retrospectives/${G}/submit-review` : `/reviews/${x.revision_id}/${B}`;
    await d(fe, { method: "POST", body: JSON.stringify(N()) }), ue("已保存本版本的审核状态与意见。"), D((ce) => ce + 1);
  }), Me = (B, fe) => B.map((ce, Ve) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ce.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: mv[ce.claim_kind] }),
      ce.record_status && /* @__PURE__ */ s.jsx("strong", { children: ce.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ce.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    X && rt ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ce.id, value: ce.text, onChange: (b) => S((ye) => ye && { ...ye, [fe]: ye[fe].map((ve, Ge) => Ge === Ve ? { ...ve, text: b.target.value, review_state: "unconfirmed" } : ve) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ce.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ce.evidence_refs.map((b, ye) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => we(x.evidence.find((ve) => ve.id === b) || null), children: [
      "查看证据 ",
      ye + 1
    ] }, b)) }),
    X && rt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ce.review_state === "confirmed", onChange: (b) => S((ye) => ye && { ...ye, [fe]: ye[fe].map((ve, Ge) => Ge === Ve ? { ...ve, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : ve) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ce.id)), et = (B) => B.map((fe) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Li(fe.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: xv[fe.event_type] || "未知事件类型：" + fe.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof fe.payload.note == "string" ? fe.payload.note : Object.keys(fe.payload).length ? JSON.stringify(fe.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => we(x.evidence.find((ce) => ce.reference === "event:" + fe.event_id) || null), children: "打开事件记录" }),
    fe.evidence_refs.map((ce) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Ve = x.evidence.find((b) => b.reference === "attachment:" + ce);
      Ve ? we(Ve) : de("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ce
    ] }, ce))
  ] }, fe.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Yj, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    ge && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      ge,
      /* @__PURE__ */ s.jsx("button", { onClick: () => D((B) => B + 1), children: "重新加载" })
    ] }),
    V && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      V
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => k("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => D((B) => B + 1), disabled: P, children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    _e ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : G ? x && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: x.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            x.version,
            " · ",
            Sn[x.state],
            " · ",
            x.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            x.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: x.revision_id, onChange: (B) => I(B.target.value), children: x.revisions.map((B) => /* @__PURE__ */ s.jsxs("option", { value: B.id, children: [
            "v",
            B.version,
            " · ",
            Sn[B.state]
          ] }, B.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => k(`/retrospectives/${G}${X ? "" : "/review"}`), children: X ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !x.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          X && rt ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: K.summary, onChange: (B) => S({ ...K, summary: B.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: x.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            x.sources.task_package_id ? "固定任务包 v" + x.sources.package_version : "固定历史版本 " + x.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          x.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/task-packages/" + x.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            x.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: et(x.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            x.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: et(x.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            x.timeline.intervals.length ? x.timeline.intervals.map((B, fe) => /* @__PURE__ */ s.jsxs("p", { children: [
              B.name,
              "：",
              B.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, fe)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            x.timeline.deadlines.length ? x.timeline.deadlines.map((B) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                B.issue_id,
                " · ",
                B.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: B.reason || `明确期限 ${Li(B.due_at || null)}；复核记录 ${Li(B.accepted_at || null)}；晚于期限 ${B.late_seconds / 60} 分钟。` })
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
      X && x.is_current && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ s.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: q, onChange: (B) => W(B.target.value) })
          ] }),
          rt && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: P || F || !q.trim(), onClick: () => void O(async () => {
              await d(`/retrospectives/${G}/draft`, { method: "PATCH", body: JSON.stringify({ ...N(), ...K }) }), ue("已保存新草稿版本，旧内容及审核意见保留。"), D((B) => B + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(x.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P || !F || !q.trim(), onClick: () => Se("submit"), children: "提交当前版本审核" })
          ] }),
          De && x.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ee, onChange: (B) => ie(B.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P || !ee || !F || !q.trim(), onClick: () => Se("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P || !F || !q.trim(), onClick: () => Se("request-changes"), children: "退回修改" })
            ] })
          ] }),
          rt && x.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P || !F || !q.trim(), onClick: () => void O(async () => {
            const B = await d(`/retrospectives/${G}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...N(), type: "case_card" }) });
            ue(B.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), D((fe) => fe + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      x.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: x.draft_ids.map((B) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => k("/knowledge/" + B + "/edit"), children: "打开经验候选" }, B)) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "审核轨迹与来源指纹" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsx("p", { className: "retro-hash", children: x.input_fingerprint }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "摘要适配器：",
            x.model_ref
          ] })
        ] }),
        x.review_actions.map((B, fe) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            B.version,
            " · ",
            Sn[B.action] || B.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: B.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Li(B.created_at) })
        ] }, fe))
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: he, onChange: (B) => Oe(B.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: He, onChange: (B) => Le(B.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Ye, onChange: (B) => xe(B.target.value), children: o.filter((B) => zt(B, "retrospective.generate")).map((B) => /* @__PURE__ */ s.jsx("option", { value: B.id, children: B.name }, B.id)) })
            ] })
          ] }),
          He === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: le, onChange: (B) => g(B.target.value), children: ae.map((B) => /* @__PURE__ */ s.jsxs("option", { value: B.id, children: [
              B.name,
              " · 包v",
              B.package_version
            ] }, B.id)) }),
            !ae.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Y.map((B) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ke.includes(B.record_version_id), onChange: (fe) => h(fe.target.checked ? [...ke, B.record_version_id] : ke.filter((ce) => ce !== B.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              B.description || "未填写描述",
              " · 来源v",
              B.current_version
            ] })
          ] }, B.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            He === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P || (He === "task_process" ? !le : !ke.length || ke.length > 20), onClick: () => void O(async () => {
              const B = await Gf(d, "/retrospective-generation-jobs", { mode: He, generation_mode: he, task_package_id: He === "task_process" ? le : null, record_version_ids: He === "historical_case" ? ke : [], template_version: "process-review-v1" }, () => ue("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              k("/retrospectives/" + B.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => k("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Te, onChange: (B) => {
            ne(B.target.value), st(""), Re([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((B) => /* @__PURE__ */ s.jsx("option", { value: B, children: Sn[B] }, B))
          ] })
        ] }),
        M.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: M.map((B) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              B.title,
              /* @__PURE__ */ s.jsx("small", { children: B.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: B.sources.task_package_id ? "任务包 v" + B.sources.package_version : B.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              B.version,
              " · ",
              Sn[B.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/retrospectives/" + B.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/retrospectives/" + B.id + "/review"), children: "核查与审核" })
            ] })
          ] }, B.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !Je.length, onClick: () => {
              st(Je.at(-1) || ""), Re(Je.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !lt, onClick: () => {
              Re([...Je, ze]), st(lt || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    Ue && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => we(null), children: /* @__PURE__ */ s.jsx(Gi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ue.type === "process_event" ? "实际事件记录" : Ue.type === "task_attachment" ? "任务附件" : Ue.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: Ue.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(Ue.locator)
      ] }),
      Be && Fe.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: Be, alt: "来源证据" }),
      Be && Fe.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: Be }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const ws = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, ba = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Af = { selected: [], text: "", row_version: 0 };
function vv({ api: d, path: j, navigate: k, projects: o }) {
  var Ne, Pe, vt;
  const H = j.startsWith("/learn"), G = /^\/training\/results\/[^/]+$/.test(j), X = j.startsWith("/learn/attempts/") || G ? j.split("/")[3] : "", M = /^\/training\/questions\/[^/]+$/.test(j), L = M ? j.split("/")[3] : "", x = j === "/training/questions", T = j === "/training/packages", K = j === "/training/results", S = o.some((f) => zt(f, "training.manage")), P = o.some((f) => zt(f, "training.review")), [oe, _e] = r.useState("llm"), [be, ge] = r.useState(""), [de, V] = r.useState(((Ne = o.find((f) => zt(f, "training.manage"))) == null ? void 0 : Ne.id) || ((Pe = o[0]) == null ? void 0 : Pe.id) || ""), [ue, se] = r.useState([]), [D, he] = r.useState([]), [Oe, He] = r.useState([]), [Le, Ye] = r.useState([]), [xe, ae] = r.useState(null), [A, le] = r.useState(null), [g, Y] = r.useState(""), [te, ke] = r.useState(!1), [h, q] = r.useState([]), [W, ee] = r.useState(["single_choice", "case_answer"]), [ie, Q] = r.useState([]), [I, Te] = r.useState("新人风险识别与复盘练习"), [ne, ze] = r.useState("learning-" + Date.now()), [st, lt] = r.useState(1), [We, Je] = r.useState(null), [Re, Ue] = r.useState({}), [we, Be] = r.useState(null), [Ie, Fe] = r.useState("rules"), [ot, je] = r.useState("useful"), [rt, De] = r.useState(""), [O, N] = r.useState({}), [F, Se] = r.useState({}), [Me, et] = r.useState(""), [ht, B] = r.useState(""), [fe, ce] = r.useState(null), [Ve, b] = r.useState([]), [ye, ve] = r.useState(!0), [Ge, jt] = r.useState(!1), [U, m] = r.useState(""), [re, pe] = r.useState(""), [at, _] = r.useState(0);
  r.useEffect(() => {
    B(""), b([]), Y(""), ke(!1), pe(""), m(""), Q([]);
  }, [j]), r.useEffect(() => {
    let f = !1;
    return ve(!0), m(""), ae(null), Je(null), Be(null), (async () => {
      try {
        if (X)
          if (G) {
            const Ee = await d(`/training/attempts/${X}/result?teacher=true`);
            f || Be(Ee);
          } else {
            const Ee = await d("/training/attempts/" + X);
            if (f) return;
            if (Je(Ee), Ue(Object.fromEntries(Ee.saved_answers.map(($e) => [$e.question_revision_id, { ...$e.answer, row_version: $e.row_version }]))), Ee.state === "submitted") {
              const $e = await d(`/training/attempts/${X}/result`);
              f || Be($e);
            }
          }
        else if (M) {
          const Ee = await d("/training/questions/" + L);
          f || (ae(Ee), le(structuredClone(Ee.content)));
        } else if (H) {
          const [Ee, $e] = await Promise.all([d("/training/packages?learner=true&limit=100"), d("/training/attempts?limit=100")]);
          f || (he(Ee.items), Ye($e.items));
        } else if (K) {
          const Ee = await d(`/training/results?limit=20${ht ? "&cursor=" + ht : ""}`);
          f || (Ye(Ee.items), ce(Ee.next_cursor));
        } else if (T) {
          const [Ee, $e] = await Promise.all([d(`/training/packages?limit=20${ht ? "&cursor=" + ht : ""}`), d("/training/questions?state=approved&limit=100")]);
          f || (he(Ee.items), se($e.items), ce(Ee.next_cursor));
        } else {
          const [Ee, $e] = await Promise.all([d(`/training/questions?limit=20${Me ? "&state=" + Me : ""}${ht ? "&cursor=" + ht : ""}`), d("/knowledge/library?limit=100&project_id=" + de)]);
          f || (se(Ee.items), He($e.items), ce(Ee.next_cursor));
        }
      } catch (Ee) {
        f || m(Ee.message);
      } finally {
        f || ve(!1);
      }
    })(), () => {
      f = !0;
    };
  }, [j, de, Me, ht, at]), r.useEffect(() => {
    if (!(we != null && we.grading_job) || !["queued", "running", "retrying"].includes(we.grading_job.status)) return;
    const f = window.setTimeout(() => _((Ce) => Ce + 1), 1800);
    return () => clearTimeout(f);
  }, [(vt = we == null ? void 0 : we.grading_job) == null ? void 0 : vt.status, at]);
  const me = async (f) => {
    jt(!0), m(""), pe("");
    try {
      await f();
    } catch (Ce) {
      m(Ce.message);
    } finally {
      jt(!1);
    }
  }, Qe = !!xe && !!A && JSON.stringify(A) === JSON.stringify(xe.content), Ct = () => ({ revision_id: xe.revision_id, row_version: xe.row_version, reason: g, evidence_checked: te }), Lt = (f) => void me(async () => {
    await d(f === "submit" ? `/training/questions/${L}/submit-review` : `/reviews/${xe.revision_id}/${f}`, { method: "POST", body: JSON.stringify(Ct()) }), pe("题目审核状态已保存到统一审核记录。"), _((Ce) => Ce + 1);
  }), Yt = async (f) => {
    const Ce = Re[f.revision_id] || Af, Ee = await d(`/training/attempts/${X}/answers/${f.question_id}`, { method: "PUT", body: JSON.stringify(Ce) });
    return Ue(($e) => ({ ...$e, [f.revision_id]: { ...Ce, row_version: Ee.row_version } })), Ee;
  }, it = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ve.length, onClick: () => {
        B(Ve.at(-1) || ""), b(Ve.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !fe, onClick: () => {
        b([...Ve, ht]), B(fe || "");
      }, children: "下一页" })
    ] })
  ] }), Nt = (f, Ce, Ee) => Ee ? [...f, Ce] : f.filter(($e) => $e !== Ce), p = (f) => void me(async () => {
    const Ce = await d("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: f.id, grading_mode: Ie }) });
    k("/learn/attempts/" + Ce.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Xi, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: H ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    U && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      U
    ] }),
    re && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 18 }),
      re
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !H && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: x || M ? "selected" : "", onClick: () => k("/training/questions"), children: "题库与审核" }),
          S && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: T ? "selected" : "", onClick: () => k("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || G ? "selected" : "", onClick: () => k("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: H ? "selected" : "", onClick: () => k("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => _((f) => f + 1), children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : we ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: ws[we.result_state] })
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
            G && S && we.grading_job.status === "failed" && we.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void me(async () => {
              await d("/jobs/" + we.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: we.grading_job.row_version }) }), _((f) => f + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          we.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: we.restriction_note }),
          we.answers.map((f, Ce) => {
            var Ee, $e, Xt, ks, Us, Rt, wa, ka;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Ce + 1,
                "题 ",
                f.type ? ba[f.type] : ""
              ] }),
              f.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: f.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((Ee = f.answer) == null ? void 0 : Ee.text) || (($e = f.answer) == null ? void 0 : $e.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Xt = f.reference_answer) == null ? void 0 : Xt.text) || ((Us = (ks = f.reference_answer) == null ? void 0 : ks.selected) == null ? void 0 : Us.join("、"))
                ] }),
                (Rt = f.rubric) == null ? void 0 : Rt.map((Ft, Fs) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  Ft.point,
                  " · ",
                  Ft.points,
                  "分"
                ] }, Fs)),
                /* @__PURE__ */ s.jsx("p", { children: (wa = f.feedback) == null ? void 0 : wa.message }),
                ((ka = f.feedback) == null ? void 0 : ka.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
                  "教员说明：",
                  f.feedback.human_review_reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "建议分：",
                f.suggested_score ?? "无",
                " · 确认分：",
                f.confirmed_score ?? "待确认",
                " · ",
                f.score_kind === "model_suggestion" ? "大模型建议" : f.score_kind === "rule_suggestion" ? "规则建议，需复核" : f.score_kind === "human_confirmed" ? "人工确认" : f.score_kind === "pending" ? "待评分" : "客观题规则评分"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "评分规则：",
                f.scoring_version,
                " · 评分器：",
                f.model_ref
              ] }),
              G && S && f.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: O[f.id] ?? String(f.confirmed_score ?? f.suggested_score ?? ""), onChange: (Ft) => N({ ...O, [f.id]: Ft.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: F[f.id] || "", onChange: (Ft) => Se({ ...F, [f.id]: Ft.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge || !(F[f.id] || "").trim() || (O[f.id] ?? String(f.confirmed_score ?? f.suggested_score ?? "")) === "", onClick: () => void me(async () => {
                  await d("/training/answers/" + f.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: f.row_version, score: Number(O[f.id] ?? f.confirmed_score ?? f.suggested_score), reason: F[f.id] }) }), pe("人工确认分已保存，原建议分和复核轨迹保留。"), _((Ft) => Ft + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, f.id);
          })
        ] })
      ] }),
      !G && we.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: ot, onChange: (f) => je(f.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: rt, onChange: (f) => De(f.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void me(async () => {
            await d(`/training/attempts/${X}/feedback`, { method: "POST", body: JSON.stringify({ rating: ot, comment: rt }) }), pe("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : We ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          We.package_title,
          " · v",
          We.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      We.questions.map((f) => {
        const Ce = Re[f.revision_id] || Af;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            f.position,
            "题 · ",
            ba[f.type],
            " · ",
            f.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: f.stem }),
          f.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + f.position + "题回答", value: Ce.text, onChange: (Ee) => Ue({ ...Re, [f.revision_id]: { ...Ce, text: Ee.target.value } }) })
          ] }) : f.options.map((Ee) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: f.type === "single_choice" ? "radio" : "checkbox", name: f.revision_id, checked: Ce.selected.includes(Ee.id), onChange: ($e) => Ue({ ...Re, [f.revision_id]: { ...Ce, selected: f.type === "single_choice" ? [Ee.id] : Nt(Ce.selected, Ee.id, $e.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Ee.id.toUpperCase(),
              " · ",
              Ee.text
            ] })
          ] }, Ee.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void me(async () => {
              await Yt(f), pe("第" + f.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Ce.row_version
            ] })
          ] })
        ] }, f.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge, onClick: () => void me(async () => {
        for (const f of We.questions) await Yt(f);
        await d(`/training/attempts/${X}/submit`, { method: "POST" }), _((f) => f + 1), pe("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : M && xe && A ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            ba[xe.type],
            " · v",
            xe.version,
            " · ",
            ws[xe.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: xe.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: A.stem, disabled: !S, onChange: (f) => le({ ...A, stem: f.target.value }) })
          ] }),
          A.options.map((f, Ce) => {
            var Ee;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              f.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: f.text, disabled: !S, onChange: ($e) => le({ ...A, options: A.options.map((Xt, ks) => ks === Ce ? { ...Xt, text: $e.target.value } : Xt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !S, checked: ((Ee = A.answer.selected) == null ? void 0 : Ee.includes(f.id)) || !1, onChange: ($e) => le({ ...A, answer: { selected: Nt(A.answer.selected || [], f.id, $e.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, f.id);
          }),
          xe.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: A.answer.text || "", disabled: !S, onChange: (f) => le({ ...A, answer: { text: f.target.value } }) })
            ] }),
            A.rubric.map((f, Ce) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: f.point, disabled: !S, onChange: (Ee) => le({ ...A, rubric: A.rubric.map(($e, Xt) => Xt === Ce ? { ...$e, point: Ee.target.value } : $e) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: f.keywords.join("，"), disabled: !S, onChange: (Ee) => le({ ...A, rubric: A.rubric.map(($e, Xt) => Xt === Ce ? { ...$e, keywords: Ee.target.value.split(/[,，]/).filter(Boolean) } : $e) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: f.points, disabled: !S, onChange: (Ee) => le({ ...A, rubric: A.rubric.map(($e, Xt) => Xt === Ce ? { ...$e, points: Number(Ee.target.value) } : $e) }) })
              ] })
            ] }, Ce))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          xe.source_versions.map((f) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: f }) }, f)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: g, onChange: (f) => Y(f.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            S && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge || Qe || !g.trim(), onClick: () => void me(async () => {
              await d(`/training/questions/${L}/draft`, { method: "PATCH", body: JSON.stringify({ ...Ct(), content: A }) }), pe("新题目版本已保存，不改变旧学习包与成绩。"), _((f) => f + 1);
            }), children: "保存新版本" }),
            S && ["draft", "changes_requested"].includes(xe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !Qe || !g.trim(), onClick: () => Lt("submit"), children: "提交题目审核" })
          ] }),
          P && xe.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te, onChange: (f) => ke(f.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !te || !Qe || !g.trim(), onClick: () => Lt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ge || !Qe || !g.trim(), onClick: () => Lt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          xe.revisions.map((f) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            f.version,
            " · ",
            ws[f.state]
          ] }, f.id)),
          xe.review_actions.map((f, Ce) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            f.version,
            " · ",
            ws[f.action] || f.action,
            " · ",
            f.reason
          ] }, Ce))
        ] })
      ] })
    ] }) : H ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: Ie, onChange: (f) => Fe(f.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          D.length ? D.map((f) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: f.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              f.version,
              " · ",
              f.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge, onClick: () => p(f), children: "开始本次练习" })
          ] }, f.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Le.map((f) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => k("/learn/attempts/" + f.id), children: [
            ws[f.state],
            " · ",
            ws[f.result_state],
            " · ",
            new Date(f.started_at).toLocaleString("zh-CN")
          ] }) }, f.id)),
          !Le.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
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
        /* @__PURE__ */ s.jsx("tbody", { children: Le.map((f) => {
          var Ce;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              f.title,
              " · v",
              f.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Ce = f.learner_id) == null ? void 0 : Ce.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              ws[f.state],
              " · ",
              ws[f.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: f.state !== "submitted", onClick: () => k("/training/results/" + f.id), children: "查看结果与复核" }) })
          ] }, f.id);
        }) })
      ] }) }),
      it
    ] }) : T ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      S && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "组建固定版本学习包" }),
          /* @__PURE__ */ s.jsx("span", { children: "只选用当前已审核题目；修改后创建新包版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: de, onChange: (f) => {
                V(f.target.value), Q([]);
              }, children: o.filter((f) => zt(f, "training.manage")).map((f) => /* @__PURE__ */ s.jsx("option", { value: f.id, children: f.name }, f.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: be, onChange: (f) => ge(f.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: I, onChange: (f) => Te(f.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ne, onChange: (f) => ze(f.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: st, onChange: (f) => lt(Number(f.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: ue.filter((f) => f.project_id === de).map((f) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ie.includes(f.revision_id), onChange: (Ce) => Q((Ee) => Nt(Ee, f.revision_id, Ce.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              ba[f.type],
              " · ",
              f.title,
              " · v",
              f.version
            ] })
          ] }, f.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ge || !ie.length || ie.length > 30 || !I.trim(), onClick: () => void me(async () => {
            await d("/training/packages", { method: "POST", body: JSON.stringify({ title: I, package_key: ne, version: st, project_id: de, question_revision_ids: ie, role_scope: ["learner", "admin", "teacher"], audience_subjects: be.split(/[,，\n]/).map((f) => f.trim()).filter(Boolean) }) }), pe("学习包草稿已建立，发布后学员可使用。"), _((f) => f + 1);
          }), children: [
            "创建学习包草稿（",
            ie.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: D.map((f) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            f.title,
            " · v",
            f.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            ws[f.state],
            " · ",
            f.question_count,
            "题 · ",
            f.package_key
          ] }),
          f.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void me(async () => {
            await d(`/training/packages/${f.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: f.row_version, reason: "发布已审核题目的固定版本学习包" }) }), pe("学习包已发布。"), _((Ce) => Ce + 1);
          }), children: "发布此学习包版本" })
        ] }, f.id)) }),
        it
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      S && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已发布知识生成题目候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "题目、答案与来源经教员核对后才可入学习包" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: de, onChange: (f) => {
              V(f.target.value), q([]);
            }, children: o.filter((f) => zt(f, "training.manage")).map((f) => /* @__PURE__ */ s.jsx("option", { value: f.id, children: f.name }, f.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Oe.map((f) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: h.includes(f.revision_id), onChange: (Ce) => q((Ee) => Nt(Ee, f.revision_id, Ce.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                f.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  f.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, f.revision_id)),
            !Oe.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(ba).map(([f, Ce]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: W.includes(f), onChange: (Ee) => ee(($e) => Nt($e, f, Ee.target.checked)) }),
            Ce
          ] }, f)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: oe, onChange: (f) => _e(f.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !h.length || h.length > 10 || !W.length, onClick: () => void me(async () => {
            const f = await Gf(d, "/training/generation-jobs", { knowledge_revision_ids: h, types: W, generation_mode: oe }, () => pe("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            pe("已生成或复用" + f.items.length + "道候选题，仍需核查答案与来源后提交审核。"), _((Ce) => Ce + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: Me, onChange: (f) => {
            et(f.target.value), B(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((f) => /* @__PURE__ */ s.jsx("option", { value: f, children: ws[f] }, f))
          ] })
        ] }),
        ue.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ue.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: f.title }),
            /* @__PURE__ */ s.jsx("td", { children: ba[f.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              f.version,
              " · ",
              ws[f.state],
              f.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/training/questions/" + f.id), children: "核查与审核" }) })
          ] }, f.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        it
      ] })
    ] })
  ] });
}
function pv({ api: d }) {
  var ge, de;
  const [j, k] = r.useState(null), [o, H] = r.useState([]), [G, X] = r.useState("openai"), [M, L] = r.useState(""), [x, T] = r.useState(!1), [K, S] = r.useState(""), [P, oe] = r.useState("");
  r.useEffect(() => {
    let V = !1;
    return Promise.all([d("/models/settings"), d("/models/presets")]).then(([ue, se]) => {
      if (V) return;
      H(se.items);
      const D = se.items.find((he) => he.base_url === ue.base_url);
      if (!ue.model && !ue.api_key_configured) {
        const he = se.items[0];
        X(he.id), k({ ...ue, base_url: he.base_url, model: he.default_model });
      } else
        X((D == null ? void 0 : D.id) || "custom"), k(ue);
    }).catch((ue) => {
      V || S(ue.message);
    }), () => {
      V = !0;
    };
  }, []);
  const _e = (V) => {
    const ue = o.find((se) => se.id === V);
    X(V), L(""), oe(""), S(""), j && k({ ...j, base_url: (ue == null ? void 0 : ue.base_url) || "", model: (ue == null ? void 0 : ue.default_model) || "", api_key_configured: !1 });
  }, be = async () => {
    if (j) {
      T(!0), S(""), oe("");
      try {
        const { api_key_configured: V, ...ue } = j, se = await d("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !0, ...M ? { api_key: M } : {} }) });
        if (k(se), L(""), oe("配置已保存，正在测试连接…"), (await d("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        oe("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (V) {
        oe(""), S(V.message);
      } finally {
        T(!1);
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
      P && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: P }),
      j ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "模型服务",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: x, value: G, onChange: (V) => _e(V.target.value), children: [
            o.map((V) => /* @__PURE__ */ s.jsx("option", { value: V.id, children: V.name }, V.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        G === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: x, value: j.base_url, onChange: (V) => k({ ...j, base_url: V.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: x, value: j.model, onChange: (V) => k({ ...j, model: V.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: x, value: j.model, onChange: (V) => k({ ...j, model: V.target.value }), children: [
            !((ge = o.find((V) => V.id === G)) != null && ge.models.some((V) => V.id === j.model)) && /* @__PURE__ */ s.jsxs("option", { value: j.model, children: [
              j.model,
              "（已保存）"
            ] }),
            (de = o.find((V) => V.id === G)) == null ? void 0 : de.models.map((V) => /* @__PURE__ */ s.jsx("option", { value: V.id, children: V.name }, V.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: x, value: M, onChange: (V) => L(V.target.value), placeholder: j.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: j.timeout_seconds, onChange: (V) => k({ ...j, timeout_seconds: Number(V.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: j.max_tokens, onChange: (V) => k({ ...j, max_tokens: Number(V.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            j.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: x || !j.model || !M.trim() && !j.api_key_configured, onClick: () => void be(), children: x ? "正在保存并测试…" : "保存并测试" }),
          j.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: x, onClick: () => {
            T(!0), S("");
            const { api_key_configured: V, ...ue } = j;
            d("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !1 }) }).then((se) => {
              k(se), oe("云端调用已停用。");
            }).catch((se) => S(se.message)).finally(() => T(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const gv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function bv({ api: d, path: j, navigate: k, projects: o, identity: H, canManageModels: G }) {
  var W, ee, ie;
  const X = j === "/settings/models", M = G, L = o.some((Q) => Q.can_run), [x, T] = r.useState(((W = o.find((Q) => Q.can_run)) == null ? void 0 : W.id) || ""), [K, S] = r.useState([]), [P, oe] = r.useState([]), [_e, be] = r.useState(null), [ge, de] = r.useState(gv), [V, ue] = r.useState("llm"), [se, D] = r.useState(sessionStorage.getItem("b07-extraction-" + H) || ""), [he, Oe] = r.useState(null), [He, Le] = r.useState(!1), [Ye, xe] = r.useState(!0), [ae, A] = r.useState(""), [le, g] = r.useState(""), [Y, te] = r.useState(0), ke = async (Q) => {
    Le(!0), A(""), g("");
    try {
      await Q();
    } catch (I) {
      A(I.message);
    } finally {
      Le(!1);
    }
  };
  r.useEffect(() => {
    let Q = !1;
    return xe(!0), A(""), oe([]), (async () => {
      var Te;
      try {
        if (X) {
          if (!M) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!L || !x) throw new Error("当前身份没有知识加工权限。");
          const [ne, ze] = await Promise.all([d(`/knowledge/source-options?project_id=${x}&limit=100`), d(`/knowledge/taxonomies?project_id=${x}`)]);
          Q || (S(ne.items), be(ze.items[0] || null), de(structuredClone(((Te = ze.items[0]) == null ? void 0 : Te.categories) || ze.suggested_categories)));
        }
      } catch (ne) {
        Q || A(ne.message);
      } finally {
        Q || xe(!1);
      }
    })(), () => {
      Q = !0;
    };
  }, [j, x, Y]), r.useEffect(() => {
    if (!se || X) return;
    let Q = !1, I;
    const Te = async () => {
      try {
        const ne = await d("/knowledge/extraction-jobs/" + se);
        if (Q) return;
        Oe(ne), ["queued", "running", "retrying"].includes(ne.status) && (I = window.setTimeout(() => void Te(), 1800));
      } catch (ne) {
        Q || A(ne.message);
      }
    };
    return Te(), () => {
      Q = !0, window.clearTimeout(I);
    };
  }, [se, j, Y]);
  const h = (Q, I) => de((Te) => Te.map((ne, ze) => ze === Q ? { ...ne, ...I } : ne)), q = JSON.stringify(ge) !== JSON.stringify((_e == null ? void 0 : _e.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(_l, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: X ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: X ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    ae && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(yl, { size: 18 }),
      ae
    ] }),
    le && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: le }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: X ? "" : "selected", onClick: () => k("/extraction"), children: "施工要点萃取" }),
        M && /* @__PURE__ */ s.jsx("button", { className: X ? "selected" : "", onClick: () => k("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => k("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => k("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => te((Q) => Q + 1), children: [
        /* @__PURE__ */ s.jsx(As, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : X && M ? /* @__PURE__ */ s.jsx(pv, { api: d }) : !X && L ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: x, onChange: (Q) => T(Q.target.value), children: o.filter((Q) => Q.can_run).map((Q) => /* @__PURE__ */ s.jsx("option", { value: Q.id, children: Q.name }, Q.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            _e ? "分类 v" + _e.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          ge.map((Q, I) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (I + 1), value: Q.code, onChange: (Te) => h(I, { code: Te.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (I + 1), value: Q.name, onChange: (Te) => h(I, { name: Te.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Q.focus, onChange: (Te) => h(I, { focus: Te.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Q.keywords.join("，"), onChange: (Te) => h(I, { keywords: Te.target.value.split(/[,，]/).map((ne) => ne.trim()).filter(Boolean) }) })
            ] }),
            ge.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => de((Te) => Te.filter((ne, ze) => ze !== I)), children: "移除此类别" })
          ] }, I)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: ge.length >= 100, onClick: () => de([...ge, { code: "category_" + (ge.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(Vj, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: He || !q, onClick: () => void ke(async () => {
              const Q = await d("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: x, expected_version: (_e == null ? void 0 : _e.version) || 0, categories: ge }) });
              be(Q), de(Q.categories), g("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => oe(K.slice(0, 20).map((Q) => Q.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((Q) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: P.includes(Q.record_version_id), onChange: (I) => oe((Te) => I.target.checked ? [...Te, Q.record_version_id] : Te.filter((ne) => ne !== Q.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Q.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "固定来源 v",
                Q.current_version
              ] })
            ] })
          ] }, Q.id)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "加工方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: V, onChange: (Q) => ue(Q.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: He || !_e || q || !P.length || P.length > 20, onClick: () => void ke(async () => {
            const Q = await d("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: P, taxonomy_id: _e.id, mode: V }) });
            D(Q.job_id), sessionStorage.setItem("b07-extraction-" + H, Q.job_id), g("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            P.length,
            "条来源）"
          ] }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "模型自主完成分类、跨记录归纳与证据摘录，人工只核对候选。不会自动批准为有效标准或直接发布。" })
        ] })
      ] }),
      he && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "最近加工任务 · ",
            he.progress,
            "%"
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: he.status })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          he.error && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: he.error }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "模式：",
            he.result.generation_mode === "llm" ? "云端大模型" : he.result.generation_mode === "mock" ? "本地模板演示" : "等待处理"
          ] }),
          he.result.model && /* @__PURE__ */ s.jsxs("p", { children: [
            "模型：",
            he.result.model.model_ref,
            " · 用量 ",
            JSON.stringify(he.result.model.usage)
          ] }),
          (ee = he.result.items) == null ? void 0 : ee.map((Q) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => k("/knowledge/" + Q.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Q.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Q.item_id)),
          (ie = he.result.missing_information) == null ? void 0 : ie.map((Q, I) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Q
          ] }, I)),
          he.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: He, onClick: () => void ke(async () => {
            await d("/jobs/" + he.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: he.row_version }) }), te((Q) => Q + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const ou = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Uf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Rf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, Yi = (d) => new Date(d).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), yv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function _v({ embedded: d = !1 }) {
  var at;
  const [j, k] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, H] = r.useState(Hi()), [G, X] = r.useState(!1), M = o === "/platform/services", L = o.startsWith("/archive-review/"), x = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [T, K] = r.useState(["/sources", "/imports", "/records"].some((_) => Hi().startsWith(_))), S = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", P = !S && ["/quality", "/knowledge", "/reviews"].some((_) => o.startsWith(_)), oe = o.startsWith("/training") || o.startsWith("/learn"), _e = o.startsWith("/workflows"), be = o.startsWith("/standards"), ge = _e || be || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", de = o.startsWith("/retrospectives"), V = o.startsWith("/task-packages"), ue = o === "/records", se = !x && ["/sources", "/imports", "/records"].some((_) => o.startsWith(_)), [D, he] = r.useState(null), [Oe, He] = r.useState([]), [Le, Ye] = r.useState({}), [xe, ae] = r.useState(!1), [A, le] = r.useState(""), [g, Y] = r.useState(""), [te, ke] = r.useState(!0), [h, q] = r.useState(!1), [W, ee] = r.useState(0), [ie, Q] = r.useState(""), [I, Te] = r.useState(""), [ne, ze] = r.useState(""), [st, lt] = r.useState(null), [We, Je] = r.useState([]), [Re, Ue] = r.useState(null), [we, Be] = r.useState(!1), [Ie, Fe] = r.useState("demo-airport"), [ot, je] = r.useState("success"), [rt, De] = r.useState(null), [O, N] = r.useState(""), [F, Se] = r.useState("processor"), [Me, et] = r.useState("demo-airport"), [ht, B] = r.useState([]);
  async function fe(_, me = {}) {
    const Qe = await qt("/api/v1" + _, {
      ...me,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${j}`, ...me.headers }
    });
    if (!Qe.ok) {
      const Ct = await Qe.json().catch(() => ({}));
      throw new Error(Ct.message || `请求失败（${Qe.status}），请刷新后重试。`);
    }
    return Qe.json();
  }
  const ce = (_) => {
    var Qe, Ct;
    const me = window;
    d && ((Qe = me.QaxcHasPendingEdits) != null && Qe.call(me)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((Ct = me.QaxcClearPendingEdits) == null || Ct.call(me), rj(_), H(Hi()), le(""), Ue(null), ze(""), Je([]));
  };
  r.useEffect(() => {
    const _ = () => H(Hi());
    return window.addEventListener("popstate", _), window.addEventListener("hashchange", _), () => {
      window.removeEventListener("popstate", _), window.removeEventListener("hashchange", _);
    };
  }, []), r.useEffect(() => {
    const _ = () => X(!0);
    return window.addEventListener("b-session-expired", _), () => window.removeEventListener("b-session-expired", _);
  }, []), r.useEffect(() => {
    let _ = !1;
    ke(!0), le(""), he(null), De(null), He([]), B([]);
    async function me() {
      try {
        const Qe = await fe("/me");
        if (_) return;
        const Ct = window.QaxcProjectNames || {};
        d && (Qe.projects = Qe.projects.map((it) => ({ ...it, name: Ct[it.id] || it.name })));
        const Lt = window.QaxcProjectId;
        d && Lt && (Qe.projects = Qe.projects.filter((it) => it.id === Lt)), he(Qe);
        const Yt = await fe("/health");
        if (_ || (ae(Yt.worker_online), x || M || L || se || P || S || V || de || oe || ge)) return;
        if (o === "/settings/access") {
          if (!Qe.projects.some((p) => p.can_manage)) return;
          const [it, Nt] = await Promise.all([fe("/access"), fe("/audit-events?limit=10")]);
          if (_) return;
          De(it), B(Nt.items), N((p) => {
            var Ne;
            return it.users.some((Pe) => Pe.id === p) ? p : ((Ne = it.users[0]) == null ? void 0 : Ne.id) || "";
          });
        } else {
          const [it, Nt] = await Promise.all([
            fe(`/jobs?limit=12${I ? `&kind=${I}` : ""}${ie ? `&status=${ie}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
            fe("/dashboard")
          ]);
          if (_) return;
          He(it.items), lt(it.next_cursor), Ye(Nt.counts);
        }
      } catch (Qe) {
        _ || le(Qe.message);
      } finally {
        _ || ke(!1);
      }
    }
    return me(), () => {
      _ = !0;
    };
  }, [j, o, ie, I, ne, W]), r.useEffect(() => {
    if (!D || x || M || L || o === "/settings/access" || se || P || S || V || de || oe || ge) return;
    let _ = !1;
    const me = window.setInterval(async () => {
      try {
        const [Qe, Ct, Lt] = await Promise.all([
          fe(`/jobs?limit=12${I ? `&kind=${I}` : ""}${ie ? `&status=${ie}` : ""}${ne ? `&cursor=${encodeURIComponent(ne)}` : ""}`),
          fe("/dashboard"),
          fe("/health")
        ]);
        if (_) return;
        He(Qe.items), lt(Qe.next_cursor), Ye(Ct.counts), ae(Lt.worker_online), Ue((Yt) => Yt ? Qe.items.find((it) => it.id === Yt.id) || Yt : null), le("");
      } catch (Qe) {
        _ || (le(Qe.message), ae(!1));
      }
    }, 2e3);
    return () => {
      _ = !0, clearInterval(me);
    };
  }, [j, o, ie, I, ne, D == null ? void 0 : D.id]);
  const Ve = async (_) => {
    q(!0), le(""), Y("");
    try {
      await _(), ee((me) => me + 1);
    } catch (me) {
      le(me.message);
    } finally {
      q(!1);
    }
  }, b = () => Ve(async () => {
    await fe("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: Ie, scenario: ot, duration_seconds: 6 })
    }), Be(!1), Y("任务已保存，处理服务会自动执行。"), ce("/jobs");
  }), ye = (_) => Ve(async () => {
    await fe(`/jobs/${_.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: _.row_version })
    }), Y("已提交重试，原任务和来源保持不变。");
  }), ve = (_) => Ve(async () => {
    const me = await qt(`/api/v1/assets/${_.result_ref}/content`, { headers: { Authorization: `Bearer dev-${j}` } });
    if (!me.ok) {
      const Lt = await me.json();
      throw new Error(Lt.message);
    }
    const Qe = document.createElement("a"), Ct = URL.createObjectURL(await me.blob());
    Qe.href = Ct, Qe.download = `演示检查结果-${_.id.slice(0, 8)}.txt`, Qe.click(), URL.revokeObjectURL(Ct), Y("演示结果已下载。");
  }), Ge = !Ot && (D == null ? void 0 : D.projects.some((_) => _.can_run)), jt = (_) => {
    const me = D == null ? void 0 : D.projects.find((Ct) => Ct.id === _.project_id);
    if ((me == null ? void 0 : me.permissions) == null) return !!(me != null && me.can_run);
    const Qe = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!Qe[_.kind] && me.permissions.includes(Qe[_.kind]);
  }, U = D == null ? void 0 : D.projects.some((_) => _.can_manage), m = Object.fromEntries(((D == null ? void 0 : D.projects) || []).map((_) => [_.id, _.name])), re = x ? "A 成果接入" : M ? "平台服务" : L ? "归档成果复盘" : oe ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : ge ? _e ? "隐患分析与知识成果" : be ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : de ? "过程复盘与经验" : V ? "归档成果与证据" : S ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : P ? "知识加工与审核" : se ? ue ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", pe = (Le.queued || 0) + (Le.running || 0) + (Le.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !d && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(kf, { size: 26 }) }),
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
          /* @__PURE__ */ s.jsx(Nf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Nf, "我的工作台"], ["/jobs", zj, "处理任务"]].map(([_, me, Qe]) => {
          const Ct = me;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Qe), className: o === _ || _ === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => ce(String(_)), children: [
            /* @__PURE__ */ s.jsx(Ct, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Qe) }),
            /* @__PURE__ */ s.jsx($s, { size: 15 })
          ] }, String(_));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${se ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": T, "aria-controls": "governance-menu", onClick: () => K((_) => !_), children: [
          /* @__PURE__ */ s.jsx(Bi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx($s, { className: T ? "expanded" : "", size: 15 })
        ] }),
        T && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, me]) => /* @__PURE__ */ s.jsx("button", { "aria-label": me, className: o.startsWith(_) ? "active" : "", onClick: () => ce(_), children: me }, _)) }),
        /* @__PURE__ */ s.jsxs("button", { className: P || ge ? "nav-item active" : "nav-item", onClick: () => ce("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(wn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: S ? "nav-item active" : "nav-item", onClick: () => ce("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(wn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: V ? "nav-item active" : "nav-item", onClick: () => ce("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(wn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: de ? "nav-item active" : "nav-item", onClick: () => ce("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(gf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: oe ? "nav-item active" : "nav-item", onClick: () => ce(D != null && D.projects.some((_) => _.roles.some((me) => ["admin", "teacher", "reviewer"].includes(me))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(Xi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ce("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(Pj, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx($s, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Bi, { size: 19 }),
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
    /* @__PURE__ */ s.jsxs("div", { className: d ? "main-shell embedded-main" : "main-shell", children: [
      !d && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx($s, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: re })
        ] }),
        Ot ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: j, onChange: (_) => {
            localStorage.setItem("b01-identity", _.target.value), k(_.target.value), Ue(null), ze(""), Je([]), Y("");
          }, children: yv.map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        d && !x && !S && !M && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (se ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : oe ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : P || ge ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : S ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : V ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([_, me]) => /* @__PURE__ */ s.jsx("button", { className: o === _ ? "button primary" : "button ghost", onClick: () => ce(_), children: me }, _)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: re }),
            /* @__PURE__ */ s.jsx("p", { children: x ? "指定版本接入、证据校验与过程复盘。" : oe ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : _e ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : be ? "保存规范原文与适用版本，核对来源后审核发布。" : ge ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : de ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : V ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : S ? "固定审核版本发布，以项目权限检索知识并打开来源。" : P ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : se ? ue ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !d && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => ee((_) => _ + 1), disabled: te, children: [
              /* @__PURE__ */ s.jsx(As, { size: 16 }),
              "刷新"
            ] }),
            !Ot && !se && !P && !S && !V && !de && !oe && !ge && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Ge || h, onClick: () => {
              var _;
              Fe(((_ = D == null ? void 0 : D.projects.find((me) => me.can_run)) == null ? void 0 : _.id) || "demo-airport"), Be(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(wf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Ot && !se && !P && !S && !V && !de && !oe && !ge && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(kf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        G && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        A && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(yl, { size: 18 }),
          A,
          /* @__PURE__ */ s.jsx("button", { onClick: () => ee((_) => _ + 1), children: "重新加载" })
        ] }),
        g && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(_l, { size: 18 }),
          g,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Y(""), children: /* @__PURE__ */ s.jsx(Gi, { size: 16 }) })
        ] }),
        G ? null : x ? D ? /* @__PURE__ */ s.jsx(xj, { id: o.split("/").pop(), identity: D.id, projects: D.projects, navigate: ce }) : /* @__PURE__ */ s.jsx("p", { children: A || "正在读取身份…" }) : te ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Sf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : A ? null : M ? /* @__PURE__ */ s.jsx(jj, { navigate: ce }, W) : L ? /* @__PURE__ */ s.jsx(vj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: ce }, o) : oe ? /* @__PURE__ */ s.jsx(vv, { api: fe, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [] }, j) : _e ? /* @__PURE__ */ s.jsx(mj, { api: fe, projects: (D == null ? void 0 : D.projects) || [], identity: j }, j + ":" + (D == null ? void 0 : D.projects.map((_) => _.id).join(","))) : be ? /* @__PURE__ */ s.jsx(dj, { api: fe, projects: (D == null ? void 0 : D.projects) || [], identity: j }, j + ":" + (D == null ? void 0 : D.projects.map((_) => _.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(cj, { api: fe, projects: (D == null ? void 0 : D.projects) || [] }) }) : ge ? /* @__PURE__ */ s.jsx(bv, { api: fe, identity: j, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [], canManageModels: !!(D != null && D.can_manage_models) }, j) : de ? /* @__PURE__ */ s.jsx(jv, { api: fe, identity: j, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [] }, j) : V ? /* @__PURE__ */ s.jsx(fv, { identity: j, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [] }, j) : S ? /* @__PURE__ */ s.jsx(rv, { identity: j, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [] }, j) : P ? /* @__PURE__ */ s.jsx(nv, { api: fe, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [], identity: j }, j) : ue ? /* @__PURE__ */ s.jsx(av, { api: fe }, j) : se ? /* @__PURE__ */ s.jsx(sv, { api: fe, path: o, navigate: ce, projects: (D == null ? void 0 : D.projects) || [], identity: j }, j) : o === "/settings/access" ? U ? rt && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                rt.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: rt.bindings.map((_) => {
                var me;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (me = rt.users.find((Qe) => Qe.id === _.user_id)) == null ? void 0 : me.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: m[_.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Uf[_.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: _.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: h,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Ve(async () => {
                          await fe(`/role-bindings/${_.id}`, { method: "DELETE", body: JSON.stringify({ row_version: _.row_version }) }), Y("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, _.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Bi, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: O, onChange: (_) => N(_.target.value), children: rt.users.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Me, onChange: (_) => et(_.target.value), children: rt.projects.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: F, onChange: (_) => Se(_.target.value), children: Object.entries(Uf).filter(([_]) => _ !== "admin" && _ !== "a_service").map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: h || !O, onClick: () => void Ve(async () => {
              await fe("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: O, project_id: Me, role: F }) }), Y("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(bl, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            ht.length ? ht.map((_) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[_.action] || _.action }),
              /* @__PURE__ */ s.jsx("span", { children: m[_.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: Yi(_.created_at) })
            ] }, _.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Bi, { size: 38 }),
          /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有管理权限" }),
          /* @__PURE__ */ s.jsx("p", { children: "可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。" })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("section", { className: "metrics", "aria-label": "任务概况", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理中" }),
              /* @__PURE__ */ s.jsx("strong", { children: pe }),
              /* @__PURE__ */ s.jsx("small", { children: "包含等待与自动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "已完成" }),
              /* @__PURE__ */ s.jsx("strong", { children: Le.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Le.failed ? "danger-color" : "", children: Le.failed || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ s.jsxs("strong", { children: [
                /* @__PURE__ */ s.jsx("i", { className: `dot ${xe ? "green" : "orange"}` }),
                xe ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: xe ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: o === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: I, onChange: (_) => {
                Te(_.target.value), ze(""), Je([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Rf).map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ie, onChange: (_) => {
                Q(_.target.value), ze(""), Je([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(ou).map(([_, me]) => /* @__PURE__ */ s.jsx("option", { value: _, children: me }, _))
              ] })
            ] }),
            Oe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "状态" }),
                /* @__PURE__ */ s.jsx("th", { children: "进度" }),
                /* @__PURE__ */ s.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: Oe.map((_) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => Ue(_), children: _.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    m[_.project_id] || _.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Rf[_.kind] || _.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${_.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  ou[_.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${_.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    _.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: Yi(_.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  _.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ce("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ue(_), children: "详情" }),
                  _.status === "failed" && jt(_) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: h, onClick: () => void ye(_), children: "重试任务" }),
                  _.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: h, onClick: () => void ve(_), children: /* @__PURE__ */ s.jsx(yf, { size: 17 }) })
                ] }) })
              ] }, _.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(wn, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ie ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ie ? "切换筛选条件查看其他任务。" : Ge ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Ge && !ie && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => Be(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(bl, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Oe.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !We.length, onClick: () => {
                  ze(We[We.length - 1]), Je(We.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !st, onClick: () => {
                  Je([...We, ne]), ze(st || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          o !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(gf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ce("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(bl, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Ot ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    we && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => Be(!1), children: /* @__PURE__ */ s.jsx(Gi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: Ie, onChange: (_) => Fe(_.target.value), children: D == null ? void 0 : D.projects.filter((_) => _.can_run).map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: ot, onChange: (_) => je(_.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !xe && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Be(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: h || !Ge, onClick: () => void b(), children: [
          h ? /* @__PURE__ */ s.jsx(Sf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(wf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Re && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => Ue(null), children: /* @__PURE__ */ s.jsx(Gi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Re.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        ou[Re.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Re.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: m[Re.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Re.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: Yi(Re.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: Yi(Re.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Re.id })
      ] }),
      Re.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Re.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Re.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: h, onClick: () => void ve(Re), children: [
        /* @__PURE__ */ s.jsx(yf, { size: 16 }),
        "下载演示结果"
      ] }),
      (at = Re.result_links) == null ? void 0 : at.map((_) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ce(_.path), children: _.label }, _.path)),
      Re.status === "failed" && jt(Re) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: h, onClick: () => void ye(Re), children: [
        /* @__PURE__ */ s.jsx(As, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function Nv(d) {
  const j = ij.createRoot(d);
  return j.render(/* @__PURE__ */ s.jsx(_v, { embedded: !0 })), () => j.unmount();
}
export {
  Nv as mountKnowledge
};
