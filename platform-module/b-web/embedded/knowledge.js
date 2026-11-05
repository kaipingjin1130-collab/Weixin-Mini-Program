var tu = { exports: {} }, Nn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nf;
function nj() {
  if (nf) return Nn;
  nf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function S(o, Y, L) {
    var V = null;
    if (L !== void 0 && (V = "" + L), Y.key !== void 0 && (V = "" + Y.key), "key" in Y) {
      L = {};
      for (var H in Y)
        H !== "key" && (L[H] = Y[H]);
    } else L = Y;
    return Y = L.ref, {
      $$typeof: u,
      type: o,
      key: V,
      ref: Y !== void 0 ? Y : null,
      props: L
    };
  }
  return Nn.Fragment = h, Nn.jsx = S, Nn.jsxs = S, Nn;
}
var cf;
function ij() {
  return cf || (cf = 1, tu.exports = nj()), tu.exports;
}
var s = ij(), su = { exports: {} }, Sn = {}, lu = { exports: {} }, au = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rf;
function cj() {
  return rf || (rf = 1, (function(u) {
    function h(g, B) {
      var se = g.length;
      g.push(B);
      e: for (; 0 < se; ) {
        var Ne = se - 1 >>> 1, f = g[Ne];
        if (0 < Y(f, B))
          g[Ne] = B, g[se] = f, se = Ne;
        else break e;
      }
    }
    function S(g) {
      return g.length === 0 ? null : g[0];
    }
    function o(g) {
      if (g.length === 0) return null;
      var B = g[0], se = g.pop();
      if (se !== B) {
        g[0] = se;
        e: for (var Ne = 0, f = g.length, q = f >>> 1; Ne < q; ) {
          var I = 2 * (Ne + 1) - 1, Z = g[I], ne = I + 1, X = g[ne];
          if (0 > Y(Z, se))
            ne < f && 0 > Y(X, Z) ? (g[Ne] = X, g[ne] = se, Ne = ne) : (g[Ne] = Z, g[I] = se, Ne = I);
          else if (ne < f && 0 > Y(X, se))
            g[Ne] = X, g[ne] = se, Ne = ne;
          else break e;
        }
      }
      return B;
    }
    function Y(g, B) {
      var se = g.sortIndex - B.sortIndex;
      return se !== 0 ? se : g.id - B.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var L = performance;
      u.unstable_now = function() {
        return L.now();
      };
    } else {
      var V = Date, H = V.now();
      u.unstable_now = function() {
        return V.now() - H;
      };
    }
    var G = [], j = [], R = 1, K = null, k = 3, le = !1, fe = !1, ye = !1, _e = !1, Ee = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, $ = typeof setImmediate < "u" ? setImmediate : null;
    function oe(g) {
      for (var B = S(j); B !== null; ) {
        if (B.callback === null) o(j);
        else if (B.startTime <= g)
          o(j), B.sortIndex = B.expirationTime, h(G, B);
        else break;
        B = S(j);
      }
    }
    function ie(g) {
      if (ye = !1, oe(g), !fe)
        if (S(G) !== null)
          fe = !0, M || (M = !0, he());
        else {
          var B = S(j);
          B !== null && ue(ie, B.startTime - g);
        }
    }
    var M = !1, je = -1, Ue = 5, Le = -1;
    function Xe() {
      return _e ? !0 : !(u.unstable_now() - Le < Ue);
    }
    function He() {
      if (_e = !1, M) {
        var g = u.unstable_now();
        Le = g;
        var B = !0;
        try {
          e: {
            fe = !1, ye && (ye = !1, me(je), je = -1), le = !0;
            var se = k;
            try {
              t: {
                for (oe(g), K = S(G); K !== null && !(K.expirationTime > g && Xe()); ) {
                  var Ne = K.callback;
                  if (typeof Ne == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var f = Ne(
                      K.expirationTime <= g
                    );
                    if (g = u.unstable_now(), typeof f == "function") {
                      K.callback = f, oe(g), B = !0;
                      break t;
                    }
                    K === S(G) && o(G), oe(g);
                  } else o(G);
                  K = S(G);
                }
                if (K !== null) B = !0;
                else {
                  var q = S(j);
                  q !== null && ue(
                    ie,
                    q.startTime - g
                  ), B = !1;
                }
              }
              break e;
            } finally {
              K = null, k = se, le = !1;
            }
            B = void 0;
          }
        } finally {
          B ? he() : M = !1;
        }
      }
    }
    var he;
    if (typeof $ == "function")
      he = function() {
        $(He);
      };
    else if (typeof MessageChannel < "u") {
      var Ie = new MessageChannel(), Q = Ie.port2;
      Ie.port1.onmessage = He, he = function() {
        Q.postMessage(null);
      };
    } else
      he = function() {
        Ee(He, 0);
      };
    function ue(g, B) {
      je = Ee(function() {
        g(u.unstable_now());
      }, B);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(g) {
      g.callback = null;
    }, u.unstable_forceFrameRate = function(g) {
      0 > g || 125 < g ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ue = 0 < g ? Math.floor(1e3 / g) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return k;
    }, u.unstable_next = function(g) {
      switch (k) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = k;
      }
      var se = k;
      k = B;
      try {
        return g();
      } finally {
        k = se;
      }
    }, u.unstable_requestPaint = function() {
      _e = !0;
    }, u.unstable_runWithPriority = function(g, B) {
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
        return B();
      } finally {
        k = se;
      }
    }, u.unstable_scheduleCallback = function(g, B, se) {
      var Ne = u.unstable_now();
      switch (typeof se == "object" && se !== null ? (se = se.delay, se = typeof se == "number" && 0 < se ? Ne + se : Ne) : se = Ne, g) {
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
      return f = se + f, g = {
        id: R++,
        callback: B,
        priorityLevel: g,
        startTime: se,
        expirationTime: f,
        sortIndex: -1
      }, se > Ne ? (g.sortIndex = se, h(j, g), S(G) === null && g === S(j) && (ye ? (me(je), je = -1) : ye = !0, ue(ie, se - Ne))) : (g.sortIndex = f, h(G, g), fe || le || (fe = !0, M || (M = !0, he()))), g;
    }, u.unstable_shouldYield = Xe, u.unstable_wrapCallback = function(g) {
      var B = k;
      return function() {
        var se = k;
        k = B;
        try {
          return g.apply(this, arguments);
        } finally {
          k = se;
        }
      };
    };
  })(au)), au;
}
var uf;
function rj() {
  return uf || (uf = 1, lu.exports = cj()), lu.exports;
}
var nu = { exports: {} }, at = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var df;
function uj() {
  if (df) return at;
  df = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), Y = Symbol.for("react.profiler"), L = Symbol.for("react.consumer"), V = Symbol.for("react.context"), H = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), j = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), K = Symbol.iterator;
  function k(f) {
    return f === null || typeof f != "object" ? null : (f = K && f[K] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var le = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, fe = Object.assign, ye = {};
  function _e(f, q, I) {
    this.props = f, this.context = q, this.refs = ye, this.updater = I || le;
  }
  _e.prototype.isReactComponent = {}, _e.prototype.setState = function(f, q) {
    if (typeof f != "object" && typeof f != "function" && f != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, f, q, "setState");
  }, _e.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function Ee() {
  }
  Ee.prototype = _e.prototype;
  function me(f, q, I) {
    this.props = f, this.context = q, this.refs = ye, this.updater = I || le;
  }
  var $ = me.prototype = new Ee();
  $.constructor = me, fe($, _e.prototype), $.isPureReactComponent = !0;
  var oe = Array.isArray, ie = { H: null, A: null, T: null, S: null, V: null }, M = Object.prototype.hasOwnProperty;
  function je(f, q, I, Z, ne, X) {
    return I = X.ref, {
      $$typeof: u,
      type: f,
      key: q,
      ref: I !== void 0 ? I : null,
      props: X
    };
  }
  function Ue(f, q) {
    return je(
      f.type,
      q,
      void 0,
      void 0,
      void 0,
      f.props
    );
  }
  function Le(f) {
    return typeof f == "object" && f !== null && f.$$typeof === u;
  }
  function Xe(f) {
    var q = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(I) {
      return q[I];
    });
  }
  var He = /\/+/g;
  function he(f, q) {
    return typeof f == "object" && f !== null && f.key != null ? Xe("" + f.key) : q.toString(36);
  }
  function Ie() {
  }
  function Q(f) {
    switch (f.status) {
      case "fulfilled":
        return f.value;
      case "rejected":
        throw f.reason;
      default:
        switch (typeof f.status == "string" ? f.then(Ie, Ie) : (f.status = "pending", f.then(
          function(q) {
            f.status === "pending" && (f.status = "fulfilled", f.value = q);
          },
          function(q) {
            f.status === "pending" && (f.status = "rejected", f.reason = q);
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
  function ue(f, q, I, Z, ne) {
    var X = typeof f;
    (X === "undefined" || X === "boolean") && (f = null);
    var P = !1;
    if (f === null) P = !0;
    else
      switch (X) {
        case "bigint":
        case "string":
        case "number":
          P = !0;
          break;
        case "object":
          switch (f.$$typeof) {
            case u:
            case h:
              P = !0;
              break;
            case R:
              return P = f._init, ue(
                P(f._payload),
                q,
                I,
                Z,
                ne
              );
          }
      }
    if (P)
      return ne = ne(f), P = Z === "" ? "." + he(f, 0) : Z, oe(ne) ? (I = "", P != null && (I = P.replace(He, "$&/") + "/"), ue(ne, q, I, "", function(Ce) {
        return Ce;
      })) : ne != null && (Le(ne) && (ne = Ue(
        ne,
        I + (ne.key == null || f && f.key === ne.key ? "" : ("" + ne.key).replace(
          He,
          "$&/"
        ) + "/") + P
      )), q.push(ne)), 1;
    P = 0;
    var Oe = Z === "" ? "." : Z + ":";
    if (oe(f))
      for (var ae = 0; ae < f.length; ae++)
        Z = f[ae], X = Oe + he(Z, ae), P += ue(
          Z,
          q,
          I,
          X,
          ne
        );
    else if (ae = k(f), typeof ae == "function")
      for (f = ae.call(f), ae = 0; !(Z = f.next()).done; )
        Z = Z.value, X = Oe + he(Z, ae++), P += ue(
          Z,
          q,
          I,
          X,
          ne
        );
    else if (X === "object") {
      if (typeof f.then == "function")
        return ue(
          Q(f),
          q,
          I,
          Z,
          ne
        );
      throw q = String(f), Error(
        "Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return P;
  }
  function g(f, q, I) {
    if (f == null) return f;
    var Z = [], ne = 0;
    return ue(f, Z, "", "", function(X) {
      return q.call(I, X, ne++);
    }), Z;
  }
  function B(f) {
    if (f._status === -1) {
      var q = f._result;
      q = q(), q.then(
        function(I) {
          (f._status === 0 || f._status === -1) && (f._status = 1, f._result = I);
        },
        function(I) {
          (f._status === 0 || f._status === -1) && (f._status = 2, f._result = I);
        }
      ), f._status === -1 && (f._status = 0, f._result = q);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var se = typeof reportError == "function" ? reportError : function(f) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var q = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof f == "object" && f !== null && typeof f.message == "string" ? String(f.message) : String(f),
        error: f
      });
      if (!window.dispatchEvent(q)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", f);
      return;
    }
    console.error(f);
  };
  function Ne() {
  }
  return at.Children = {
    map: g,
    forEach: function(f, q, I) {
      g(
        f,
        function() {
          q.apply(this, arguments);
        },
        I
      );
    },
    count: function(f) {
      var q = 0;
      return g(f, function() {
        q++;
      }), q;
    },
    toArray: function(f) {
      return g(f, function(q) {
        return q;
      }) || [];
    },
    only: function(f) {
      if (!Le(f))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return f;
    }
  }, at.Component = _e, at.Fragment = S, at.Profiler = Y, at.PureComponent = me, at.StrictMode = o, at.Suspense = G, at.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ie, at.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(f) {
      return ie.H.useMemoCache(f);
    }
  }, at.cache = function(f) {
    return function() {
      return f.apply(null, arguments);
    };
  }, at.cloneElement = function(f, q, I) {
    if (f == null)
      throw Error(
        "The argument must be a React element, but you passed " + f + "."
      );
    var Z = fe({}, f.props), ne = f.key, X = void 0;
    if (q != null)
      for (P in q.ref !== void 0 && (X = void 0), q.key !== void 0 && (ne = "" + q.key), q)
        !M.call(q, P) || P === "key" || P === "__self" || P === "__source" || P === "ref" && q.ref === void 0 || (Z[P] = q[P]);
    var P = arguments.length - 2;
    if (P === 1) Z.children = I;
    else if (1 < P) {
      for (var Oe = Array(P), ae = 0; ae < P; ae++)
        Oe[ae] = arguments[ae + 2];
      Z.children = Oe;
    }
    return je(f.type, ne, void 0, void 0, X, Z);
  }, at.createContext = function(f) {
    return f = {
      $$typeof: V,
      _currentValue: f,
      _currentValue2: f,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, f.Provider = f, f.Consumer = {
      $$typeof: L,
      _context: f
    }, f;
  }, at.createElement = function(f, q, I) {
    var Z, ne = {}, X = null;
    if (q != null)
      for (Z in q.key !== void 0 && (X = "" + q.key), q)
        M.call(q, Z) && Z !== "key" && Z !== "__self" && Z !== "__source" && (ne[Z] = q[Z]);
    var P = arguments.length - 2;
    if (P === 1) ne.children = I;
    else if (1 < P) {
      for (var Oe = Array(P), ae = 0; ae < P; ae++)
        Oe[ae] = arguments[ae + 2];
      ne.children = Oe;
    }
    if (f && f.defaultProps)
      for (Z in P = f.defaultProps, P)
        ne[Z] === void 0 && (ne[Z] = P[Z]);
    return je(f, X, void 0, void 0, null, ne);
  }, at.createRef = function() {
    return { current: null };
  }, at.forwardRef = function(f) {
    return { $$typeof: H, render: f };
  }, at.isValidElement = Le, at.lazy = function(f) {
    return {
      $$typeof: R,
      _payload: { _status: -1, _result: f },
      _init: B
    };
  }, at.memo = function(f, q) {
    return {
      $$typeof: j,
      type: f,
      compare: q === void 0 ? null : q
    };
  }, at.startTransition = function(f) {
    var q = ie.T, I = {};
    ie.T = I;
    try {
      var Z = f(), ne = ie.S;
      ne !== null && ne(I, Z), typeof Z == "object" && Z !== null && typeof Z.then == "function" && Z.then(Ne, se);
    } catch (X) {
      se(X);
    } finally {
      ie.T = q;
    }
  }, at.unstable_useCacheRefresh = function() {
    return ie.H.useCacheRefresh();
  }, at.use = function(f) {
    return ie.H.use(f);
  }, at.useActionState = function(f, q, I) {
    return ie.H.useActionState(f, q, I);
  }, at.useCallback = function(f, q) {
    return ie.H.useCallback(f, q);
  }, at.useContext = function(f) {
    return ie.H.useContext(f);
  }, at.useDebugValue = function() {
  }, at.useDeferredValue = function(f, q) {
    return ie.H.useDeferredValue(f, q);
  }, at.useEffect = function(f, q, I) {
    var Z = ie.H;
    if (typeof I == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return Z.useEffect(f, q);
  }, at.useId = function() {
    return ie.H.useId();
  }, at.useImperativeHandle = function(f, q, I) {
    return ie.H.useImperativeHandle(f, q, I);
  }, at.useInsertionEffect = function(f, q) {
    return ie.H.useInsertionEffect(f, q);
  }, at.useLayoutEffect = function(f, q) {
    return ie.H.useLayoutEffect(f, q);
  }, at.useMemo = function(f, q) {
    return ie.H.useMemo(f, q);
  }, at.useOptimistic = function(f, q) {
    return ie.H.useOptimistic(f, q);
  }, at.useReducer = function(f, q, I) {
    return ie.H.useReducer(f, q, I);
  }, at.useRef = function(f) {
    return ie.H.useRef(f);
  }, at.useState = function(f) {
    return ie.H.useState(f);
  }, at.useSyncExternalStore = function(f, q, I) {
    return ie.H.useSyncExternalStore(
      f,
      q,
      I
    );
  }, at.useTransition = function() {
    return ie.H.useTransition();
  }, at.version = "19.1.0", at;
}
var of;
function yu() {
  return of || (of = 1, nu.exports = uj()), nu.exports;
}
var iu = { exports: {} }, Pt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hf;
function dj() {
  if (hf) return Pt;
  hf = 1;
  var u = yu();
  function h(G) {
    var j = "https://react.dev/errors/" + G;
    if (1 < arguments.length) {
      j += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var R = 2; R < arguments.length; R++)
        j += "&args[]=" + encodeURIComponent(arguments[R]);
    }
    return "Minified React error #" + G + "; visit " + j + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function S() {
  }
  var o = {
    d: {
      f: S,
      r: function() {
        throw Error(h(522));
      },
      D: S,
      C: S,
      L: S,
      m: S,
      X: S,
      S,
      M: S
    },
    p: 0,
    findDOMNode: null
  }, Y = Symbol.for("react.portal");
  function L(G, j, R) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Y,
      key: K == null ? null : "" + K,
      children: G,
      containerInfo: j,
      implementation: R
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function H(G, j) {
    if (G === "font") return "";
    if (typeof j == "string")
      return j === "use-credentials" ? j : "";
  }
  return Pt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Pt.createPortal = function(G, j) {
    var R = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!j || j.nodeType !== 1 && j.nodeType !== 9 && j.nodeType !== 11)
      throw Error(h(299));
    return L(G, j, null, R);
  }, Pt.flushSync = function(G) {
    var j = V.T, R = o.p;
    try {
      if (V.T = null, o.p = 2, G) return G();
    } finally {
      V.T = j, o.p = R, o.d.f();
    }
  }, Pt.preconnect = function(G, j) {
    typeof G == "string" && (j ? (j = j.crossOrigin, j = typeof j == "string" ? j === "use-credentials" ? j : "" : void 0) : j = null, o.d.C(G, j));
  }, Pt.prefetchDNS = function(G) {
    typeof G == "string" && o.d.D(G);
  }, Pt.preinit = function(G, j) {
    if (typeof G == "string" && j && typeof j.as == "string") {
      var R = j.as, K = H(R, j.crossOrigin), k = typeof j.integrity == "string" ? j.integrity : void 0, le = typeof j.fetchPriority == "string" ? j.fetchPriority : void 0;
      R === "style" ? o.d.S(
        G,
        typeof j.precedence == "string" ? j.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: le
        }
      ) : R === "script" && o.d.X(G, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: le,
        nonce: typeof j.nonce == "string" ? j.nonce : void 0
      });
    }
  }, Pt.preinitModule = function(G, j) {
    if (typeof G == "string")
      if (typeof j == "object" && j !== null) {
        if (j.as == null || j.as === "script") {
          var R = H(
            j.as,
            j.crossOrigin
          );
          o.d.M(G, {
            crossOrigin: R,
            integrity: typeof j.integrity == "string" ? j.integrity : void 0,
            nonce: typeof j.nonce == "string" ? j.nonce : void 0
          });
        }
      } else j == null && o.d.M(G);
  }, Pt.preload = function(G, j) {
    if (typeof G == "string" && typeof j == "object" && j !== null && typeof j.as == "string") {
      var R = j.as, K = H(R, j.crossOrigin);
      o.d.L(G, R, {
        crossOrigin: K,
        integrity: typeof j.integrity == "string" ? j.integrity : void 0,
        nonce: typeof j.nonce == "string" ? j.nonce : void 0,
        type: typeof j.type == "string" ? j.type : void 0,
        fetchPriority: typeof j.fetchPriority == "string" ? j.fetchPriority : void 0,
        referrerPolicy: typeof j.referrerPolicy == "string" ? j.referrerPolicy : void 0,
        imageSrcSet: typeof j.imageSrcSet == "string" ? j.imageSrcSet : void 0,
        imageSizes: typeof j.imageSizes == "string" ? j.imageSizes : void 0,
        media: typeof j.media == "string" ? j.media : void 0
      });
    }
  }, Pt.preloadModule = function(G, j) {
    if (typeof G == "string")
      if (j) {
        var R = H(j.as, j.crossOrigin);
        o.d.m(G, {
          as: typeof j.as == "string" && j.as !== "script" ? j.as : void 0,
          crossOrigin: R,
          integrity: typeof j.integrity == "string" ? j.integrity : void 0
        });
      } else o.d.m(G);
  }, Pt.requestFormReset = function(G) {
    o.d.r(G);
  }, Pt.unstable_batchedUpdates = function(G, j) {
    return G(j);
  }, Pt.useFormState = function(G, j, R) {
    return V.H.useFormState(G, j, R);
  }, Pt.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, Pt.version = "19.1.0", Pt;
}
var ff;
function oj() {
  if (ff) return iu.exports;
  ff = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), iu.exports = dj(), iu.exports;
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
var mf;
function hj() {
  if (mf) return Sn;
  mf = 1;
  var u = rj(), h = yu(), S = oj();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Y(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function L(e) {
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
  function H(e) {
    if (L(e) !== e)
      throw Error(o(188));
  }
  function G(e) {
    var t = e.alternate;
    if (!t) {
      if (t = L(e), t === null) throw Error(o(188));
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
          if (i === l) return H(n), e;
          if (i === a) return H(n), t;
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
  function j(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = j(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var R = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), le = Symbol.for("react.portal"), fe = Symbol.for("react.fragment"), ye = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), me = Symbol.for("react.consumer"), $ = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), je = Symbol.for("react.memo"), Ue = Symbol.for("react.lazy"), Le = Symbol.for("react.activity"), Xe = Symbol.for("react.memo_cache_sentinel"), He = Symbol.iterator;
  function he(e) {
    return e === null || typeof e != "object" ? null : (e = He && e[He] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ie = Symbol.for("react.client.reference");
  function Q(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ie ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case fe:
        return "Fragment";
      case _e:
        return "Profiler";
      case ye:
        return "StrictMode";
      case ie:
        return "Suspense";
      case M:
        return "SuspenseList";
      case Le:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case le:
          return "Portal";
        case $:
          return (e.displayName || "Context") + ".Provider";
        case me:
          return (e._context.displayName || "Context") + ".Consumer";
        case oe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case je:
          return t = e.displayName || null, t !== null ? t : Q(e.type) || "Memo";
        case Ue:
          t = e._payload, e = e._init;
          try {
            return Q(e(t));
          } catch {
          }
      }
    return null;
  }
  var ue = Array.isArray, g = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = S.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ne = [], f = -1;
  function q(e) {
    return { current: e };
  }
  function I(e) {
    0 > f || (e.current = Ne[f], Ne[f] = null, f--);
  }
  function Z(e, t) {
    f++, Ne[f] = e.current, e.current = t;
  }
  var ne = q(null), X = q(null), P = q(null), Oe = q(null);
  function ae(e, t) {
    switch (Z(P, t), Z(X, e), Z(ne, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Rh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Rh(t), e = Uh(t, e);
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
    I(ne), Z(ne, e);
  }
  function Ce() {
    I(ne), I(X), I(P);
  }
  function Ge(e) {
    e.memoizedState !== null && Z(Oe, e);
    var t = ne.current, l = Uh(t, e.type);
    t !== l && (Z(X, e), Z(ne, l));
  }
  function Pe(e) {
    X.current === e && (I(ne), I(X)), Oe.current === e && (I(Oe), pn._currentValue = se);
  }
  var Ze = Object.prototype.hasOwnProperty, Ve = u.unstable_scheduleCallback, Ae = u.unstable_cancelCallback, Re = u.unstable_shouldYield, Se = u.unstable_requestPaint, Be = u.unstable_now, Qe = u.unstable_getCurrentPriorityLevel, tt = u.unstable_ImmediatePriority, rt = u.unstable_UserBlockingPriority, pe = u.unstable_NormalPriority, it = u.unstable_LowPriority, Me = u.unstable_IdlePriority, O = u.log, w = u.unstable_setDisableYieldValue, F = null, we = null;
  function qe(e) {
    if (typeof O == "function" && w(e), we && typeof we.setStrictMode == "function")
      try {
        we.setStrictMode(F, e);
      } catch {
      }
  }
  var N = Math.clz32 ? Math.clz32 : re, ee = Math.log, z = Math.LN2;
  function re(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ee(e) / z | 0) | 0;
  }
  var ce = 256, Je = 4194304;
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
  function ve(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var d = a & 134217727;
    return d !== 0 ? (a = d & ~i, a !== 0 ? n = b(a) : (c &= d, c !== 0 ? n = b(c) : l || (l = d & ~e, l !== 0 && (n = b(l))))) : (d = a & ~i, d !== 0 ? n = b(d) : c !== 0 ? n = b(c) : l || (l = a & ~e, l !== 0 && (n = b(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function ge(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Ke(e, t) {
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
    var e = Je;
    return Je <<= 1, (Je & 62914560) === 0 && (Je = 4194304), e;
  }
  function x(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function de(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function be(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var d = e.entanglements, v = e.expirationTimes, T = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var J = 31 - N(l), te = 1 << J;
      d[J] = 0, v[J] = -1;
      var A = T[J];
      if (A !== null)
        for (T[J] = null, J = 0; J < A.length; J++) {
          var D = A[J];
          D !== null && (D.lane &= -536870913);
        }
      l &= ~te;
    }
    a !== 0 && nt(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function nt(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - N(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function _(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - N(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function xe(e) {
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
  function $e(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ct() {
    var e = B.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Ph(e.type));
  }
  function Lt(e, t) {
    var l = B.p;
    try {
      return B.p = e, t();
    } finally {
      B.p = l;
    }
  }
  var Yt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + Yt, Nt = "__reactProps$" + Yt, p = "__reactContainer$" + Yt, ke = "__reactEvents$" + Yt, lt = "__reactListeners$" + Yt, vt = "__reactHandles$" + Yt, m = "__reactResources$" + Yt, Te = "__reactMarker$" + Yt;
  function ze(e) {
    delete e[ut], delete e[Nt], delete e[ke], delete e[lt], delete e[vt];
  }
  function st(e) {
    var t = e[ut];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[p] || l[ut]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Hh(e); e !== null; ) {
            if (l = e[ut]) return l;
            e = Hh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Xt(e) {
    if (e = e[ut] || e[p]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Cs(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function Us(e) {
    var t = e[m];
    return t || (t = e[m] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Dt(e) {
    e[Te] = !0;
  }
  var Ea = /* @__PURE__ */ new Set(), Oa = {};
  function Ft(e, t) {
    Ps(e, t), Ps(e + "Capture", t);
  }
  function Ps(e, t) {
    for (Oa[e] = t, e = 0; e < t.length; e++)
      Ea.add(t[e]);
  }
  var Ff = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Nu = {}, Su = {};
  function If(e) {
    return Ze.call(Su, e) ? !0 : Ze.call(Nu, e) ? !1 : Ff.test(e) ? Su[e] = !0 : (Nu[e] = !0, !1);
  }
  function Tn(e, t, l) {
    if (If(t))
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
  function zn(e, t, l) {
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
  var $i, wu;
  function Yl(e) {
    if ($i === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        $i = t && t[1] || "", wu = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + $i + e + wu;
  }
  var Wi = !1;
  function Fi(e, t) {
    if (!e || Wi) return "";
    Wi = !0;
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
                } catch (D) {
                  var A = D;
                }
                Reflect.construct(e, [], te);
              } else {
                try {
                  te.call();
                } catch (D) {
                  A = D;
                }
                e.call(te.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (D) {
                A = D;
              }
              (te = e()) && typeof te.catch == "function" && te.catch(function() {
              });
            }
          } catch (D) {
            if (D && A && typeof D.stack == "string")
              return [D.stack, A.stack];
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
        var v = c.split(`
`), T = d.split(`
`);
        for (n = a = 0; a < v.length && !v[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < T.length && !T[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === v.length || n === T.length)
          for (a = v.length - 1, n = T.length - 1; 1 <= a && 0 <= n && v[a] !== T[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (v[a] !== T[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || v[a] !== T[n]) {
                  var J = `
` + v[a].replace(" at new ", " at ");
                  return e.displayName && J.includes("<anonymous>") && (J = J.replace("<anonymous>", e.displayName)), J;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Wi = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Yl(l) : "";
  }
  function Pf(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Yl(e.type);
      case 16:
        return Yl("Lazy");
      case 13:
        return Yl("Suspense");
      case 19:
        return Yl("SuspenseList");
      case 0:
      case 15:
        return Fi(e.type, !1);
      case 11:
        return Fi(e.type.render, !1);
      case 1:
        return Fi(e.type, !0);
      case 31:
        return Yl("Activity");
      default:
        return "";
    }
  }
  function ku(e) {
    try {
      var t = "";
      do
        t += Pf(e), e = e.return;
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
  function Cu(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function em(e) {
    var t = Cu(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
  function An(e) {
    e._valueTracker || (e._valueTracker = em(e));
  }
  function Eu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Cu(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Rn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var tm = /[\n"\\]/g;
  function ms(e) {
    return e.replace(
      tm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Ii(e, t, l, a, n, i, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + fs(t)) : e.value !== "" + fs(t) && (e.value = "" + fs(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? Pi(e, c, fs(t)) : l != null ? Pi(e, c, fs(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + fs(d) : e.removeAttribute("name");
  }
  function Ou(e, t, l, a, n, i, c, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + fs(l) : "", t = t != null ? "" + fs(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function Pi(e, t, l) {
    t === "number" && Rn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Gl(e, t, l, a) {
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
  function Tu(e, t, l) {
    if (t != null && (t = "" + fs(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + fs(l) : "";
  }
  function zu(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (ue(a)) {
          if (1 < a.length) throw Error(o(93));
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
  var sm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Au(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || sm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Ru(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Au(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Au(e, i, t[i]);
  }
  function ec(e) {
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
  var lm = /* @__PURE__ */ new Map([
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
  ]), am = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Un(e) {
    return am.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var tc = null;
  function sc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Xl = null, Zl = null;
  function Uu(e) {
    var t = Xt(e);
    if (t && (e = t.stateNode)) {
      var l = e[Nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Ii(
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
                var n = a[Nt] || null;
                if (!n) throw Error(o(90));
                Ii(
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
              a = l[t], a.form === e.form && Eu(a);
          }
          break e;
        case "textarea":
          Tu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Gl(e, !!l.multiple, t, !1);
      }
    }
  }
  var lc = !1;
  function Du(e, t, l) {
    if (lc) return e(t, l);
    lc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (lc = !1, (Xl !== null || Zl !== null) && (gi(), Xl && (t = Xl, e = Zl, Zl = Xl = null, Uu(t), e)))
        for (t = 0; t < e.length; t++) Uu(e[t]);
    }
  }
  function Ta(e, t) {
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
  var Ms = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ac = !1;
  if (Ms)
    try {
      var za = {};
      Object.defineProperty(za, "passive", {
        get: function() {
          ac = !0;
        }
      }), window.addEventListener("test", za, za), window.removeEventListener("test", za, za);
    } catch {
      ac = !1;
    }
  var el = null, nc = null, Dn = null;
  function Mu() {
    if (Dn) return Dn;
    var e, t = nc, l = t.length, a, n = "value" in el ? el.value : el.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Dn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Mn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function qn() {
    return !0;
  }
  function qu() {
    return !1;
  }
  function ss(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? qn : qu, this.isPropagationStopped = qu, this;
    }
    return R(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = qn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = qn);
      },
      persist: function() {
      },
      isPersistent: qn
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
  }, Hn = ss(wl), Aa = R({}, wl, { view: 0, detail: 0 }), nm = ss(Aa), ic, cc, Ra, Bn = R({}, Aa, {
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
    getModifierState: uc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ra && (Ra && e.type === "mousemove" ? (ic = e.screenX - Ra.screenX, cc = e.screenY - Ra.screenY) : cc = ic = 0, Ra = e), ic);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : cc;
    }
  }), Hu = ss(Bn), im = R({}, Bn, { dataTransfer: 0 }), cm = ss(im), rm = R({}, Aa, { relatedTarget: 0 }), rc = ss(rm), um = R({}, wl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), dm = ss(um), om = R({}, wl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), hm = ss(om), fm = R({}, wl, { data: 0 }), Bu = ss(fm), mm = {
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
  }, xm = {
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
  }, jm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function vm(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = jm[e]) ? !!t[e] : !1;
  }
  function uc() {
    return vm;
  }
  var pm = R({}, Aa, {
    key: function(e) {
      if (e.key) {
        var t = mm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Mn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? xm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: uc,
    charCode: function(e) {
      return e.type === "keypress" ? Mn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Mn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), gm = ss(pm), bm = R({}, Bn, {
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
  }), Lu = ss(bm), ym = R({}, Aa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: uc
  }), _m = ss(ym), Nm = R({}, wl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Sm = ss(Nm), wm = R({}, Bn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), km = ss(wm), Cm = R({}, wl, {
    newState: 0,
    oldState: 0
  }), Em = ss(Cm), Om = [9, 13, 27, 32], dc = Ms && "CompositionEvent" in window, Ua = null;
  Ms && "documentMode" in document && (Ua = document.documentMode);
  var Tm = Ms && "TextEvent" in window && !Ua, Yu = Ms && (!dc || Ua && 8 < Ua && 11 >= Ua), Gu = " ", Qu = !1;
  function Xu(e, t) {
    switch (e) {
      case "keyup":
        return Om.indexOf(t.keyCode) !== -1;
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
  function Zu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Vl = !1;
  function zm(e, t) {
    switch (e) {
      case "compositionend":
        return Zu(t);
      case "keypress":
        return t.which !== 32 ? null : (Qu = !0, Gu);
      case "textInput":
        return e = t.data, e === Gu && Qu ? null : e;
      default:
        return null;
    }
  }
  function Am(e, t) {
    if (Vl)
      return e === "compositionend" || !dc && Xu(e, t) ? (e = Mu(), Dn = nc = el = null, Vl = !1, e) : null;
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
        return Yu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Rm = {
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
  function Vu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Rm[e.type] : t === "textarea";
  }
  function Ju(e, t, l, a) {
    Xl ? Zl ? Zl.push(a) : Zl = [a] : Xl = a, t = wi(t, "onChange"), 0 < t.length && (l = new Hn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Da = null, Ma = null;
  function Um(e) {
    Eh(e, 0);
  }
  function Ln(e) {
    var t = Cs(e);
    if (Eu(t)) return e;
  }
  function Ku(e, t) {
    if (e === "change") return t;
  }
  var $u = !1;
  if (Ms) {
    var oc;
    if (Ms) {
      var hc = "oninput" in document;
      if (!hc) {
        var Wu = document.createElement("div");
        Wu.setAttribute("oninput", "return;"), hc = typeof Wu.oninput == "function";
      }
      oc = hc;
    } else oc = !1;
    $u = oc && (!document.documentMode || 9 < document.documentMode);
  }
  function Fu() {
    Da && (Da.detachEvent("onpropertychange", Iu), Ma = Da = null);
  }
  function Iu(e) {
    if (e.propertyName === "value" && Ln(Ma)) {
      var t = [];
      Ju(
        t,
        Ma,
        e,
        sc(e)
      ), Du(Um, t);
    }
  }
  function Dm(e, t, l) {
    e === "focusin" ? (Fu(), Da = t, Ma = l, Da.attachEvent("onpropertychange", Iu)) : e === "focusout" && Fu();
  }
  function Mm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ln(Ma);
  }
  function qm(e, t) {
    if (e === "click") return Ln(t);
  }
  function Hm(e, t) {
    if (e === "input" || e === "change")
      return Ln(t);
  }
  function Bm(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var is = typeof Object.is == "function" ? Object.is : Bm;
  function qa(e, t) {
    if (is(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Ze.call(t, n) || !is(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Pu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ed(e, t) {
    var l = Pu(e);
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
      l = Pu(l);
    }
  }
  function td(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? td(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function sd(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Rn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Rn(e.document);
    }
    return t;
  }
  function fc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Lm = Ms && "documentMode" in document && 11 >= document.documentMode, Jl = null, mc = null, Ha = null, xc = !1;
  function ld(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    xc || Jl == null || Jl !== Rn(a) || (a = Jl, "selectionStart" in a && fc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ha && qa(Ha, a) || (Ha = a, a = wi(mc, "onSelect"), 0 < a.length && (t = new Hn(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Jl)));
  }
  function kl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Kl = {
    animationend: kl("Animation", "AnimationEnd"),
    animationiteration: kl("Animation", "AnimationIteration"),
    animationstart: kl("Animation", "AnimationStart"),
    transitionrun: kl("Transition", "TransitionRun"),
    transitionstart: kl("Transition", "TransitionStart"),
    transitioncancel: kl("Transition", "TransitionCancel"),
    transitionend: kl("Transition", "TransitionEnd")
  }, jc = {}, ad = {};
  Ms && (ad = document.createElement("div").style, "AnimationEvent" in window || (delete Kl.animationend.animation, delete Kl.animationiteration.animation, delete Kl.animationstart.animation), "TransitionEvent" in window || delete Kl.transitionend.transition);
  function Cl(e) {
    if (jc[e]) return jc[e];
    if (!Kl[e]) return e;
    var t = Kl[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in ad)
        return jc[e] = t[l];
    return e;
  }
  var nd = Cl("animationend"), id = Cl("animationiteration"), cd = Cl("animationstart"), Ym = Cl("transitionrun"), Gm = Cl("transitionstart"), Qm = Cl("transitioncancel"), rd = Cl("transitionend"), ud = /* @__PURE__ */ new Map(), vc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  vc.push("scrollEnd");
  function _s(e, t) {
    ud.set(e, t), Ft(t, [e]);
  }
  var dd = /* @__PURE__ */ new WeakMap();
  function xs(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = dd.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: ku(t)
      }, dd.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: ku(t)
    };
  }
  var js = [], $l = 0, pc = 0;
  function Yn() {
    for (var e = $l, t = pc = $l = 0; t < e; ) {
      var l = js[t];
      js[t++] = null;
      var a = js[t];
      js[t++] = null;
      var n = js[t];
      js[t++] = null;
      var i = js[t];
      if (js[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && od(l, n, i);
    }
  }
  function Gn(e, t, l, a) {
    js[$l++] = e, js[$l++] = t, js[$l++] = l, js[$l++] = a, pc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function gc(e, t, l, a) {
    return Gn(e, t, l, a), Qn(e);
  }
  function Wl(e, t) {
    return Gn(e, null, null, t), Qn(e);
  }
  function od(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - N(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function Qn(e) {
    if (50 < dn)
      throw dn = 0, wr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Fl = {};
  function Xm(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function cs(e, t, l, a) {
    return new Xm(e, t, l, a);
  }
  function bc(e) {
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
  function hd(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Xn(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") bc(e) && (c = 1);
    else if (typeof e == "string")
      c = Vx(
        e,
        l,
        ne.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Le:
          return e = cs(31, l, t, n), e.elementType = Le, e.lanes = i, e;
        case fe:
          return El(l.children, n, i, t);
        case ye:
          c = 8, n |= 24;
          break;
        case _e:
          return e = cs(12, l, t, n | 2), e.elementType = _e, e.lanes = i, e;
        case ie:
          return e = cs(13, l, t, n), e.elementType = ie, e.lanes = i, e;
        case M:
          return e = cs(19, l, t, n), e.elementType = M, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ee:
              case $:
                c = 10;
                break e;
              case me:
                c = 9;
                break e;
              case oe:
                c = 11;
                break e;
              case je:
                c = 14;
                break e;
              case Ue:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = cs(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function El(e, t, l, a) {
    return e = cs(7, e, a, t), e.lanes = l, e;
  }
  function yc(e, t, l) {
    return e = cs(6, e, null, t), e.lanes = l, e;
  }
  function _c(e, t, l) {
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
  var Il = [], Pl = 0, Zn = null, Vn = 0, vs = [], ps = 0, Ol = null, Hs = 1, Bs = "";
  function Tl(e, t) {
    Il[Pl++] = Vn, Il[Pl++] = Zn, Zn = e, Vn = t;
  }
  function fd(e, t, l) {
    vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Ol = e;
    var a = Hs;
    e = Bs;
    var n = 32 - N(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - N(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Hs = 1 << 32 - N(t) + n | l << n | a, Bs = i + e;
    } else
      Hs = 1 << i | l << n | a, Bs = e;
  }
  function Nc(e) {
    e.return !== null && (Tl(e, 1), fd(e, 1, 0));
  }
  function Sc(e) {
    for (; e === Zn; )
      Zn = Il[--Pl], Il[Pl] = null, Vn = Il[--Pl], Il[Pl] = null;
    for (; e === Ol; )
      Ol = vs[--ps], vs[ps] = null, Bs = vs[--ps], vs[ps] = null, Hs = vs[--ps], vs[ps] = null;
  }
  var es = null, At = null, xt = !1, zl = null, Es = !1, wc = Error(o(519));
  function Al(e) {
    var t = Error(o(418, ""));
    throw Ya(xs(t, e)), wc;
  }
  function md(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[ut] = e, t[Nt] = a, l) {
      case "dialog":
        ht("cancel", t), ht("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ht("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < hn.length; l++)
          ht(hn[l], t);
        break;
      case "source":
        ht("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ht("error", t), ht("load", t);
        break;
      case "details":
        ht("toggle", t);
        break;
      case "input":
        ht("invalid", t), Ou(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), An(t);
        break;
      case "select":
        ht("invalid", t);
        break;
      case "textarea":
        ht("invalid", t), zu(t, a.value, a.defaultValue, a.children), An(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Ah(t.textContent, l) ? (a.popover != null && (ht("beforetoggle", t), ht("toggle", t)), a.onScroll != null && ht("scroll", t), a.onScrollEnd != null && ht("scrollend", t), a.onClick != null && (t.onclick = ki), t = !0) : t = !1, t || Al(e);
  }
  function xd(e) {
    for (es = e.return; es; )
      switch (es.tag) {
        case 5:
        case 13:
          Es = !1;
          return;
        case 27:
        case 3:
          Es = !0;
          return;
        default:
          es = es.return;
      }
  }
  function Ba(e) {
    if (e !== es) return !1;
    if (!xt) return xd(e), xt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Yr(e.type, e.memoizedProps)), l = !l), l && At && Al(e), xd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                At = Ss(e.nextSibling);
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
      t === 27 ? (t = At, jl(e.type) ? (e = Zr, Zr = null, At = e) : At = t) : At = es ? Ss(e.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    At = es = null, xt = !1;
  }
  function jd() {
    var e = zl;
    return e !== null && (ns === null ? ns = e : ns.push.apply(
      ns,
      e
    ), zl = null), e;
  }
  function Ya(e) {
    zl === null ? zl = [e] : zl.push(e);
  }
  var kc = q(null), Rl = null, Ls = null;
  function tl(e, t, l) {
    Z(kc, t._currentValue), t._currentValue = l;
  }
  function Ys(e) {
    e._currentValue = kc.current, I(kc);
  }
  function Cc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Ec(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var d = i;
          i = n;
          for (var v = 0; v < t.length; v++)
            if (d.context === t[v]) {
              i.lanes |= l, d = i.alternate, d !== null && (d.lanes |= l), Cc(
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
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Cc(c, l, e), c = null;
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
  function Ga(e, t, l, a) {
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
          is(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === Oe.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(pn) : e = [pn]);
      }
      n = n.return;
    }
    e !== null && Ec(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Jn(e) {
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
  function It(e) {
    return vd(Rl, e);
  }
  function Kn(e, t) {
    return Rl === null && Ul(e), vd(e, t);
  }
  function vd(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ls === null) {
      if (e === null) throw Error(o(308));
      Ls = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ls = Ls.next = t;
    return l;
  }
  var Zm = typeof AbortController < "u" ? AbortController : function() {
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
  }, Vm = u.unstable_scheduleCallback, Jm = u.unstable_NormalPriority, Gt = {
    $$typeof: $,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Oc() {
    return {
      controller: new Zm(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Qa(e) {
    e.refCount--, e.refCount === 0 && Vm(Jm, function() {
      e.controller.abort();
    });
  }
  var Xa = null, Tc = 0, ea = 0, ta = null;
  function Km(e, t) {
    if (Xa === null) {
      var l = Xa = [];
      Tc = 0, ea = Ar(), ta = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Tc++, t.then(pd, pd), t;
  }
  function pd() {
    if (--Tc === 0 && Xa !== null) {
      ta !== null && (ta.status = "fulfilled");
      var e = Xa;
      Xa = null, ea = 0, ta = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function $m(e, t) {
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
  var gd = g.S;
  g.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && Km(e, t), gd !== null && gd(e, t);
  };
  var Dl = q(null);
  function zc() {
    var e = Dl.current;
    return e !== null ? e : wt.pooledCache;
  }
  function $n(e, t) {
    t === null ? Z(Dl, Dl.current) : Z(Dl, t.pool);
  }
  function bd() {
    var e = zc();
    return e === null ? null : { parent: Gt._currentValue, pool: e };
  }
  var Za = Error(o(460)), yd = Error(o(474)), Wn = Error(o(542)), Ac = { then: function() {
  } };
  function _d(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Fn() {
  }
  function Nd(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Fn, Fn), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, wd(e), e;
      default:
        if (typeof t.status == "string") t.then(Fn, Fn);
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
            throw e = t.reason, wd(e), e;
        }
        throw Va = t, Za;
    }
  }
  var Va = null;
  function Sd() {
    if (Va === null) throw Error(o(459));
    var e = Va;
    return Va = null, e;
  }
  function wd(e) {
    if (e === Za || e === Wn)
      throw Error(o(483));
  }
  var sl = !1;
  function Rc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Uc(e, t) {
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
    if (a = a.shared, (pt & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Qn(e), od(e, null, l), t;
    }
    return Gn(e, a, t, l), Qn(e);
  }
  function Ja(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  function Dc(e, t) {
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
  var Mc = !1;
  function Ka() {
    if (Mc) {
      var e = ta;
      if (e !== null) throw e;
    }
  }
  function $a(e, t, l, a) {
    Mc = !1;
    var n = e.updateQueue;
    sl = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var v = d, T = v.next;
      v.next = null, c === null ? i = T : c.next = T, c = v;
      var J = e.alternate;
      J !== null && (J = J.updateQueue, d = J.lastBaseUpdate, d !== c && (d === null ? J.firstBaseUpdate = T : d.next = T, J.lastBaseUpdate = v));
    }
    if (i !== null) {
      var te = n.baseState;
      c = 0, J = T = v = null, d = i;
      do {
        var A = d.lane & -536870913, D = A !== d.lane;
        if (D ? (ft & A) === A : (a & A) === A) {
          A !== 0 && A === ea && (Mc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var et = e, We = d;
            A = t;
            var _t = l;
            switch (We.tag) {
              case 1:
                if (et = We.payload, typeof et == "function") {
                  te = et.call(_t, te, A);
                  break e;
                }
                te = et;
                break e;
              case 3:
                et.flags = et.flags & -65537 | 128;
              case 0:
                if (et = We.payload, A = typeof et == "function" ? et.call(_t, te, A) : et, A == null) break e;
                te = R({}, te, A);
                break e;
              case 2:
                sl = !0;
            }
          }
          A = d.callback, A !== null && (e.flags |= 64, D && (e.flags |= 8192), D = n.callbacks, D === null ? n.callbacks = [A] : D.push(A));
        } else
          D = {
            lane: A,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, J === null ? (T = J = D, v = te) : J = J.next = D, c |= A;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          D = d, d = D.next, D.next = null, n.lastBaseUpdate = D, n.shared.pending = null;
        }
      } while (!0);
      J === null && (v = te), n.baseState = v, n.firstBaseUpdate = T, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), hl |= c, e.lanes = c, e.memoizedState = te;
    }
  }
  function kd(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Cd(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        kd(l[e], t);
  }
  var sa = q(null), In = q(0);
  function Ed(e, t) {
    e = Ks, Z(In, e), Z(sa, t), Ks = e | t.baseLanes;
  }
  function qc() {
    Z(In, Ks), Z(sa, sa.current);
  }
  function Hc() {
    Ks = In.current, I(sa), I(In);
  }
  var nl = 0, ct = null, bt = null, Ht = null, Pn = !1, la = !1, Ml = !1, ei = 0, Wa = 0, aa = null, Wm = 0;
  function Mt() {
    throw Error(o(321));
  }
  function Bc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!is(e[l], t[l])) return !1;
    return !0;
  }
  function Lc(e, t, l, a, n, i) {
    return nl = i, ct = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, g.H = e === null || e.memoizedState === null ? ho : fo, Ml = !1, i = l(a, n), Ml = !1, la && (i = Td(
      t,
      l,
      a,
      n
    )), Od(e), i;
  }
  function Od(e) {
    g.H = ii;
    var t = bt !== null && bt.next !== null;
    if (nl = 0, Ht = bt = ct = null, Pn = !1, Wa = 0, aa = null, t) throw Error(o(300));
    e === null || Zt || (e = e.dependencies, e !== null && Jn(e) && (Zt = !0));
  }
  function Td(e, t, l, a) {
    ct = e;
    var n = 0;
    do {
      if (la && (aa = null), Wa = 0, la = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Ht = bt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      g.H = lx, i = t(l, a);
    } while (la);
    return i;
  }
  function Fm() {
    var e = g.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Fa(t) : t, e = e.useState()[0], (bt !== null ? bt.memoizedState : null) !== e && (ct.flags |= 1024), t;
  }
  function Yc() {
    var e = ei !== 0;
    return ei = 0, e;
  }
  function Gc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Qc(e) {
    if (Pn) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Pn = !1;
    }
    nl = 0, Ht = bt = ct = null, la = !1, Wa = ei = 0, aa = null;
  }
  function ls() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ht === null ? ct.memoizedState = Ht = e : Ht = Ht.next = e, Ht;
  }
  function Bt() {
    if (bt === null) {
      var e = ct.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = bt.next;
    var t = Ht === null ? ct.memoizedState : Ht.next;
    if (t !== null)
      Ht = t, bt = e;
    else {
      if (e === null)
        throw ct.alternate === null ? Error(o(467)) : Error(o(310));
      bt = e, e = {
        memoizedState: bt.memoizedState,
        baseState: bt.baseState,
        baseQueue: bt.baseQueue,
        queue: bt.queue,
        next: null
      }, Ht === null ? ct.memoizedState = Ht = e : Ht = Ht.next = e;
    }
    return Ht;
  }
  function Xc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fa(e) {
    var t = Wa;
    return Wa += 1, aa === null && (aa = []), e = Nd(aa, e, t), t = ct, (Ht === null ? t.memoizedState : Ht.next) === null && (t = t.alternate, g.H = t === null || t.memoizedState === null ? ho : fo), e;
  }
  function ti(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Fa(e);
      if (e.$$typeof === $) return It(e);
    }
    throw Error(o(438, String(e)));
  }
  function Zc(e) {
    var t = null, l = ct.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ct.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Xc(), ct.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Xe;
    return t.index++, l;
  }
  function Gs(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function si(e) {
    var t = Bt();
    return Vc(t, bt, e);
  }
  function Vc(e, t, l) {
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
      var d = c = null, v = null, T = t, J = !1;
      do {
        var te = T.lane & -536870913;
        if (te !== T.lane ? (ft & te) === te : (nl & te) === te) {
          var A = T.revertLane;
          if (A === 0)
            v !== null && (v = v.next = {
              lane: 0,
              revertLane: 0,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), te === ea && (J = !0);
          else if ((nl & A) === A) {
            T = T.next, A === ea && (J = !0);
            continue;
          } else
            te = {
              lane: 0,
              revertLane: T.revertLane,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }, v === null ? (d = v = te, c = i) : v = v.next = te, ct.lanes |= A, hl |= A;
          te = T.action, Ml && l(i, te), i = T.hasEagerState ? T.eagerState : l(i, te);
        } else
          A = {
            lane: te,
            revertLane: T.revertLane,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, v === null ? (d = v = A, c = i) : v = v.next = A, ct.lanes |= te, hl |= te;
        T = T.next;
      } while (T !== null && T !== t);
      if (v === null ? c = i : v.next = d, !is(i, e.memoizedState) && (Zt = !0, J && (l = ta, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = v, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Jc(e) {
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
      is(i, t.memoizedState) || (Zt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function zd(e, t, l) {
    var a = ct, n = Bt(), i = xt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !is(
      (bt || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Zt = !0), n = n.queue;
    var d = Ud.bind(null, a, n, e);
    if (Ia(2048, 8, d, [e]), n.getSnapshot !== t || c || Ht !== null && Ht.memoizedState.tag & 1) {
      if (a.flags |= 2048, na(
        9,
        li(),
        Rd.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), wt === null) throw Error(o(349));
      i || (nl & 124) !== 0 || Ad(a, t, l);
    }
    return l;
  }
  function Ad(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ct.updateQueue, t === null ? (t = Xc(), ct.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Rd(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Dd(t) && Md(e);
  }
  function Ud(e, t, l) {
    return l(function() {
      Dd(t) && Md(e);
    });
  }
  function Dd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !is(e, l);
    } catch {
      return !0;
    }
  }
  function Md(e) {
    var t = Wl(e, 2);
    t !== null && hs(t, e, 2);
  }
  function Kc(e) {
    var t = ls();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Ml) {
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
      lastRenderedReducer: Gs,
      lastRenderedState: e
    }, t;
  }
  function qd(e, t, l, a) {
    return e.baseState = l, Vc(
      e,
      bt,
      typeof a == "function" ? a : Gs
    );
  }
  function Im(e, t, l, a, n) {
    if (ni(e)) throw Error(o(485));
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
      g.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Hd(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Hd(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = g.T, c = {};
      g.T = c;
      try {
        var d = l(n, a), v = g.S;
        v !== null && v(c, d), Bd(e, t, d);
      } catch (T) {
        $c(e, t, T);
      } finally {
        g.T = i;
      }
    } else
      try {
        i = l(n, a), Bd(e, t, i);
      } catch (T) {
        $c(e, t, T);
      }
  }
  function Bd(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Ld(e, t, a);
      },
      function(a) {
        return $c(e, t, a);
      }
    ) : Ld(e, t, l);
  }
  function Ld(e, t, l) {
    t.status = "fulfilled", t.value = l, Yd(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Hd(e, l)));
  }
  function $c(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Yd(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Yd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Gd(e, t) {
    return t;
  }
  function Qd(e, t) {
    if (xt) {
      var l = wt.formState;
      if (l !== null) {
        e: {
          var a = ct;
          if (xt) {
            if (At) {
              t: {
                for (var n = At, i = Es; n.nodeType !== 8; ) {
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
                At = Ss(
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
      lastRenderedReducer: Gd,
      lastRenderedState: t
    }, l.queue = a, l = ro.bind(
      null,
      ct,
      a
    ), a.dispatch = l, a = Kc(!1), i = er.bind(
      null,
      ct,
      !1,
      a.queue
    ), a = ls(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Im.bind(
      null,
      ct,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Xd(e) {
    var t = Bt();
    return Zd(t, bt, e);
  }
  function Zd(e, t, l) {
    if (t = Vc(
      e,
      t,
      Gd
    )[0], e = si(Gs)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Fa(t);
      } catch (c) {
        throw c === Za ? Wn : c;
      }
    else a = t;
    t = Bt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ct.flags |= 2048, na(
      9,
      li(),
      Pm.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function Pm(e, t) {
    e.action = t;
  }
  function Vd(e) {
    var t = Bt(), l = bt;
    if (l !== null)
      return Zd(t, l, e);
    Bt(), t = t.memoizedState, l = Bt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function na(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ct.updateQueue, t === null && (t = Xc(), ct.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function li() {
    return { destroy: void 0, resource: void 0 };
  }
  function Jd() {
    return Bt().memoizedState;
  }
  function ai(e, t, l, a) {
    var n = ls();
    a = a === void 0 ? null : a, ct.flags |= e, n.memoizedState = na(
      1 | t,
      li(),
      l,
      a
    );
  }
  function Ia(e, t, l, a) {
    var n = Bt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    bt !== null && a !== null && Bc(a, bt.memoizedState.deps) ? n.memoizedState = na(t, i, l, a) : (ct.flags |= e, n.memoizedState = na(
      1 | t,
      i,
      l,
      a
    ));
  }
  function Kd(e, t) {
    ai(8390656, 8, e, t);
  }
  function $d(e, t) {
    Ia(2048, 8, e, t);
  }
  function Wd(e, t) {
    return Ia(4, 2, e, t);
  }
  function Fd(e, t) {
    return Ia(4, 4, e, t);
  }
  function Id(e, t) {
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
  function Pd(e, t, l) {
    l = l != null ? l.concat([e]) : null, Ia(4, 4, Id.bind(null, t, e), l);
  }
  function Wc() {
  }
  function eo(e, t) {
    var l = Bt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Bc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function to(e, t) {
    var l = Bt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Bc(t, a[1]))
      return a[0];
    if (a = e(), Ml) {
      qe(!0);
      try {
        e();
      } finally {
        qe(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Fc(e, t, l) {
    return l === void 0 || (nl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = nh(), ct.lanes |= e, hl |= e, l);
  }
  function so(e, t, l, a) {
    return is(l, t) ? l : sa.current !== null ? (e = Fc(e, l, a), is(e, t) || (Zt = !0), e) : (nl & 42) === 0 ? (Zt = !0, e.memoizedState = l) : (e = nh(), ct.lanes |= e, hl |= e, t);
  }
  function lo(e, t, l, a, n) {
    var i = B.p;
    B.p = i !== 0 && 8 > i ? i : 8;
    var c = g.T, d = {};
    g.T = d, er(e, !1, t, l);
    try {
      var v = n(), T = g.S;
      if (T !== null && T(d, v), v !== null && typeof v == "object" && typeof v.then == "function") {
        var J = $m(
          v,
          a
        );
        Pa(
          e,
          t,
          J,
          os(e)
        );
      } else
        Pa(
          e,
          t,
          a,
          os(e)
        );
    } catch (te) {
      Pa(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: te },
        os()
      );
    } finally {
      B.p = i, g.T = c;
    }
  }
  function ex() {
  }
  function Ic(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = ao(e).queue;
    lo(
      e,
      n,
      t,
      se,
      l === null ? ex : function() {
        return no(e), l(a);
      }
    );
  }
  function ao(e) {
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
  function no(e) {
    var t = ao(e).next.queue;
    Pa(e, t, {}, os());
  }
  function Pc() {
    return It(pn);
  }
  function io() {
    return Bt().memoizedState;
  }
  function co() {
    return Bt().memoizedState;
  }
  function tx(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = os();
          e = ll(l);
          var a = al(t, e, l);
          a !== null && (hs(a, t, l), Ja(a, t, l)), t = { cache: Oc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function sx(e, t, l) {
    var a = os();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ni(e) ? uo(t, l) : (l = gc(e, t, l, a), l !== null && (hs(l, e, a), oo(l, t, a)));
  }
  function ro(e, t, l) {
    var a = os();
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
    if (ni(e)) uo(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, d = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, is(d, c))
            return Gn(e, t, n, 0), wt === null && Yn(), !1;
        } catch {
        } finally {
        }
      if (l = gc(e, t, n, a), l !== null)
        return hs(l, e, a), oo(l, t, a), !0;
    }
    return !1;
  }
  function er(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Ar(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ni(e)) {
      if (t) throw Error(o(479));
    } else
      t = gc(
        e,
        l,
        a,
        2
      ), t !== null && hs(t, e, 2);
  }
  function ni(e) {
    var t = e.alternate;
    return e === ct || t !== null && t === ct;
  }
  function uo(e, t) {
    la = Pn = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function oo(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, _(e, l);
    }
  }
  var ii = {
    readContext: It,
    use: ti,
    useCallback: Mt,
    useContext: Mt,
    useEffect: Mt,
    useImperativeHandle: Mt,
    useLayoutEffect: Mt,
    useInsertionEffect: Mt,
    useMemo: Mt,
    useReducer: Mt,
    useRef: Mt,
    useState: Mt,
    useDebugValue: Mt,
    useDeferredValue: Mt,
    useTransition: Mt,
    useSyncExternalStore: Mt,
    useId: Mt,
    useHostTransitionStatus: Mt,
    useFormState: Mt,
    useActionState: Mt,
    useOptimistic: Mt,
    useMemoCache: Mt,
    useCacheRefresh: Mt
  }, ho = {
    readContext: It,
    use: ti,
    useCallback: function(e, t) {
      return ls().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: It,
    useEffect: Kd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ai(
        4194308,
        4,
        Id.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ai(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ai(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ls();
      t = t === void 0 ? null : t;
      var a = e();
      if (Ml) {
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
      var a = ls();
      if (l !== void 0) {
        var n = l(t);
        if (Ml) {
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
      }, a.queue = e, e = e.dispatch = sx.bind(
        null,
        ct,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ls();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Kc(e);
      var t = e.queue, l = ro.bind(null, ct, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = ls();
      return Fc(l, e, t);
    },
    useTransition: function() {
      var e = Kc(!1);
      return e = lo.bind(
        null,
        ct,
        e.queue,
        !0,
        !1
      ), ls().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ct, n = ls();
      if (xt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), wt === null)
          throw Error(o(349));
        (ft & 124) !== 0 || Ad(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, Kd(Ud.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, na(
        9,
        li(),
        Rd.bind(
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
      var e = ls(), t = wt.identifierPrefix;
      if (xt) {
        var l = Bs, a = Hs;
        l = (a & ~(1 << 32 - N(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = ei++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = Wm++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Pc,
    useFormState: Qd,
    useActionState: Qd,
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
      return t.queue = l, t = er.bind(
        null,
        ct,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Zc,
    useCacheRefresh: function() {
      return ls().memoizedState = tx.bind(
        null,
        ct
      );
    }
  }, fo = {
    readContext: It,
    use: ti,
    useCallback: eo,
    useContext: It,
    useEffect: $d,
    useImperativeHandle: Pd,
    useInsertionEffect: Wd,
    useLayoutEffect: Fd,
    useMemo: to,
    useReducer: si,
    useRef: Jd,
    useState: function() {
      return si(Gs);
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = Bt();
      return so(
        l,
        bt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = si(Gs)[0], t = Bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: zd,
    useId: io,
    useHostTransitionStatus: Pc,
    useFormState: Xd,
    useActionState: Xd,
    useOptimistic: function(e, t) {
      var l = Bt();
      return qd(l, bt, e, t);
    },
    useMemoCache: Zc,
    useCacheRefresh: co
  }, lx = {
    readContext: It,
    use: ti,
    useCallback: eo,
    useContext: It,
    useEffect: $d,
    useImperativeHandle: Pd,
    useInsertionEffect: Wd,
    useLayoutEffect: Fd,
    useMemo: to,
    useReducer: Jc,
    useRef: Jd,
    useState: function() {
      return Jc(Gs);
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = Bt();
      return bt === null ? Fc(l, e, t) : so(
        l,
        bt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Jc(Gs)[0], t = Bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: zd,
    useId: io,
    useHostTransitionStatus: Pc,
    useFormState: Vd,
    useActionState: Vd,
    useOptimistic: function(e, t) {
      var l = Bt();
      return bt !== null ? qd(l, bt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Zc,
    useCacheRefresh: co
  }, ia = null, en = 0;
  function ci(e) {
    var t = en;
    return en += 1, ia === null && (ia = []), Nd(ia, e, t);
  }
  function tn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ri(e, t) {
    throw t.$$typeof === K ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function mo(e) {
    var t = e._init;
    return t(e._payload);
  }
  function xo(e) {
    function t(C, y) {
      if (e) {
        var E = C.deletions;
        E === null ? (C.deletions = [y], C.flags |= 16) : E.push(y);
      }
    }
    function l(C, y) {
      if (!e) return null;
      for (; y !== null; )
        t(C, y), y = y.sibling;
      return null;
    }
    function a(C) {
      for (var y = /* @__PURE__ */ new Map(); C !== null; )
        C.key !== null ? y.set(C.key, C) : y.set(C.index, C), C = C.sibling;
      return y;
    }
    function n(C, y) {
      return C = qs(C, y), C.index = 0, C.sibling = null, C;
    }
    function i(C, y, E) {
      return C.index = E, e ? (E = C.alternate, E !== null ? (E = E.index, E < y ? (C.flags |= 67108866, y) : E) : (C.flags |= 67108866, y)) : (C.flags |= 1048576, y);
    }
    function c(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function d(C, y, E, W) {
      return y === null || y.tag !== 6 ? (y = yc(E, C.mode, W), y.return = C, y) : (y = n(y, E), y.return = C, y);
    }
    function v(C, y, E, W) {
      var De = E.type;
      return De === fe ? J(
        C,
        y,
        E.props.children,
        W,
        E.key
      ) : y !== null && (y.elementType === De || typeof De == "object" && De !== null && De.$$typeof === Ue && mo(De) === y.type) ? (y = n(y, E.props), tn(y, E), y.return = C, y) : (y = Xn(
        E.type,
        E.key,
        E.props,
        null,
        C.mode,
        W
      ), tn(y, E), y.return = C, y);
    }
    function T(C, y, E, W) {
      return y === null || y.tag !== 4 || y.stateNode.containerInfo !== E.containerInfo || y.stateNode.implementation !== E.implementation ? (y = _c(E, C.mode, W), y.return = C, y) : (y = n(y, E.children || []), y.return = C, y);
    }
    function J(C, y, E, W, De) {
      return y === null || y.tag !== 7 ? (y = El(
        E,
        C.mode,
        W,
        De
      ), y.return = C, y) : (y = n(y, E), y.return = C, y);
    }
    function te(C, y, E) {
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return y = yc(
          "" + y,
          C.mode,
          E
        ), y.return = C, y;
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case k:
            return E = Xn(
              y.type,
              y.key,
              y.props,
              null,
              C.mode,
              E
            ), tn(E, y), E.return = C, E;
          case le:
            return y = _c(
              y,
              C.mode,
              E
            ), y.return = C, y;
          case Ue:
            var W = y._init;
            return y = W(y._payload), te(C, y, E);
        }
        if (ue(y) || he(y))
          return y = El(
            y,
            C.mode,
            E,
            null
          ), y.return = C, y;
        if (typeof y.then == "function")
          return te(C, ci(y), E);
        if (y.$$typeof === $)
          return te(
            C,
            Kn(C, y),
            E
          );
        ri(C, y);
      }
      return null;
    }
    function A(C, y, E, W) {
      var De = y !== null ? y.key : null;
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return De !== null ? null : d(C, y, "" + E, W);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case k:
            return E.key === De ? v(C, y, E, W) : null;
          case le:
            return E.key === De ? T(C, y, E, W) : null;
          case Ue:
            return De = E._init, E = De(E._payload), A(C, y, E, W);
        }
        if (ue(E) || he(E))
          return De !== null ? null : J(C, y, E, W, null);
        if (typeof E.then == "function")
          return A(
            C,
            y,
            ci(E),
            W
          );
        if (E.$$typeof === $)
          return A(
            C,
            y,
            Kn(C, E),
            W
          );
        ri(C, E);
      }
      return null;
    }
    function D(C, y, E, W, De) {
      if (typeof W == "string" && W !== "" || typeof W == "number" || typeof W == "bigint")
        return C = C.get(E) || null, d(y, C, "" + W, De);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case k:
            return C = C.get(
              W.key === null ? E : W.key
            ) || null, v(y, C, W, De);
          case le:
            return C = C.get(
              W.key === null ? E : W.key
            ) || null, T(y, C, W, De);
          case Ue:
            var dt = W._init;
            return W = dt(W._payload), D(
              C,
              y,
              E,
              W,
              De
            );
        }
        if (ue(W) || he(W))
          return C = C.get(E) || null, J(y, C, W, De, null);
        if (typeof W.then == "function")
          return D(
            C,
            y,
            E,
            ci(W),
            De
          );
        if (W.$$typeof === $)
          return D(
            C,
            y,
            E,
            Kn(y, W),
            De
          );
        ri(y, W);
      }
      return null;
    }
    function et(C, y, E, W) {
      for (var De = null, dt = null, Ye = y, Fe = y = 0, Jt = null; Ye !== null && Fe < E.length; Fe++) {
        Ye.index > Fe ? (Jt = Ye, Ye = null) : Jt = Ye.sibling;
        var mt = A(
          C,
          Ye,
          E[Fe],
          W
        );
        if (mt === null) {
          Ye === null && (Ye = Jt);
          break;
        }
        e && Ye && mt.alternate === null && t(C, Ye), y = i(mt, y, Fe), dt === null ? De = mt : dt.sibling = mt, dt = mt, Ye = Jt;
      }
      if (Fe === E.length)
        return l(C, Ye), xt && Tl(C, Fe), De;
      if (Ye === null) {
        for (; Fe < E.length; Fe++)
          Ye = te(C, E[Fe], W), Ye !== null && (y = i(
            Ye,
            y,
            Fe
          ), dt === null ? De = Ye : dt.sibling = Ye, dt = Ye);
        return xt && Tl(C, Fe), De;
      }
      for (Ye = a(Ye); Fe < E.length; Fe++)
        Jt = D(
          Ye,
          C,
          Fe,
          E[Fe],
          W
        ), Jt !== null && (e && Jt.alternate !== null && Ye.delete(
          Jt.key === null ? Fe : Jt.key
        ), y = i(
          Jt,
          y,
          Fe
        ), dt === null ? De = Jt : dt.sibling = Jt, dt = Jt);
      return e && Ye.forEach(function(yl) {
        return t(C, yl);
      }), xt && Tl(C, Fe), De;
    }
    function We(C, y, E, W) {
      if (E == null) throw Error(o(151));
      for (var De = null, dt = null, Ye = y, Fe = y = 0, Jt = null, mt = E.next(); Ye !== null && !mt.done; Fe++, mt = E.next()) {
        Ye.index > Fe ? (Jt = Ye, Ye = null) : Jt = Ye.sibling;
        var yl = A(C, Ye, mt.value, W);
        if (yl === null) {
          Ye === null && (Ye = Jt);
          break;
        }
        e && Ye && yl.alternate === null && t(C, Ye), y = i(yl, y, Fe), dt === null ? De = yl : dt.sibling = yl, dt = yl, Ye = Jt;
      }
      if (mt.done)
        return l(C, Ye), xt && Tl(C, Fe), De;
      if (Ye === null) {
        for (; !mt.done; Fe++, mt = E.next())
          mt = te(C, mt.value, W), mt !== null && (y = i(mt, y, Fe), dt === null ? De = mt : dt.sibling = mt, dt = mt);
        return xt && Tl(C, Fe), De;
      }
      for (Ye = a(Ye); !mt.done; Fe++, mt = E.next())
        mt = D(Ye, C, Fe, mt.value, W), mt !== null && (e && mt.alternate !== null && Ye.delete(mt.key === null ? Fe : mt.key), y = i(mt, y, Fe), dt === null ? De = mt : dt.sibling = mt, dt = mt);
      return e && Ye.forEach(function(aj) {
        return t(C, aj);
      }), xt && Tl(C, Fe), De;
    }
    function _t(C, y, E, W) {
      if (typeof E == "object" && E !== null && E.type === fe && E.key === null && (E = E.props.children), typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case k:
            e: {
              for (var De = E.key; y !== null; ) {
                if (y.key === De) {
                  if (De = E.type, De === fe) {
                    if (y.tag === 7) {
                      l(
                        C,
                        y.sibling
                      ), W = n(
                        y,
                        E.props.children
                      ), W.return = C, C = W;
                      break e;
                    }
                  } else if (y.elementType === De || typeof De == "object" && De !== null && De.$$typeof === Ue && mo(De) === y.type) {
                    l(
                      C,
                      y.sibling
                    ), W = n(y, E.props), tn(W, E), W.return = C, C = W;
                    break e;
                  }
                  l(C, y);
                  break;
                } else t(C, y);
                y = y.sibling;
              }
              E.type === fe ? (W = El(
                E.props.children,
                C.mode,
                W,
                E.key
              ), W.return = C, C = W) : (W = Xn(
                E.type,
                E.key,
                E.props,
                null,
                C.mode,
                W
              ), tn(W, E), W.return = C, C = W);
            }
            return c(C);
          case le:
            e: {
              for (De = E.key; y !== null; ) {
                if (y.key === De)
                  if (y.tag === 4 && y.stateNode.containerInfo === E.containerInfo && y.stateNode.implementation === E.implementation) {
                    l(
                      C,
                      y.sibling
                    ), W = n(y, E.children || []), W.return = C, C = W;
                    break e;
                  } else {
                    l(C, y);
                    break;
                  }
                else t(C, y);
                y = y.sibling;
              }
              W = _c(E, C.mode, W), W.return = C, C = W;
            }
            return c(C);
          case Ue:
            return De = E._init, E = De(E._payload), _t(
              C,
              y,
              E,
              W
            );
        }
        if (ue(E))
          return et(
            C,
            y,
            E,
            W
          );
        if (he(E)) {
          if (De = he(E), typeof De != "function") throw Error(o(150));
          return E = De.call(E), We(
            C,
            y,
            E,
            W
          );
        }
        if (typeof E.then == "function")
          return _t(
            C,
            y,
            ci(E),
            W
          );
        if (E.$$typeof === $)
          return _t(
            C,
            y,
            Kn(C, E),
            W
          );
        ri(C, E);
      }
      return typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint" ? (E = "" + E, y !== null && y.tag === 6 ? (l(C, y.sibling), W = n(y, E), W.return = C, C = W) : (l(C, y), W = yc(E, C.mode, W), W.return = C, C = W), c(C)) : l(C, y);
    }
    return function(C, y, E, W) {
      try {
        en = 0;
        var De = _t(
          C,
          y,
          E,
          W
        );
        return ia = null, De;
      } catch (Ye) {
        if (Ye === Za || Ye === Wn) throw Ye;
        var dt = cs(29, Ye, null, C.mode);
        return dt.lanes = W, dt.return = C, dt;
      } finally {
      }
    };
  }
  var ca = xo(!0), jo = xo(!1), gs = q(null), Os = null;
  function il(e) {
    var t = e.alternate;
    Z(Qt, Qt.current & 1), Z(gs, e), Os === null && (t === null || sa.current !== null || t.memoizedState !== null) && (Os = e);
  }
  function vo(e) {
    if (e.tag === 22) {
      if (Z(Qt, Qt.current), Z(gs, e), Os === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Os = e);
      }
    } else cl();
  }
  function cl() {
    Z(Qt, Qt.current), Z(gs, gs.current);
  }
  function Qs(e) {
    I(gs), Os === e && (Os = null), I(Qt);
  }
  var Qt = q(0);
  function ui(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || Xr(l)))
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
  function tr(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : R({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var sr = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = os(), n = ll(a);
      n.payload = t, l != null && (n.callback = l), t = al(e, n, a), t !== null && (hs(t, e, a), Ja(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = os(), n = ll(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = al(e, n, a), t !== null && (hs(t, e, a), Ja(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = os(), a = ll(l);
      a.tag = 2, t != null && (a.callback = t), t = al(e, a, l), t !== null && (hs(t, e, l), Ja(t, e, l));
    }
  };
  function po(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !qa(l, a) || !qa(n, i) : !0;
  }
  function go(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && sr.enqueueReplaceState(t, t.state, null);
  }
  function ql(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = R({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var di = typeof reportError == "function" ? reportError : function(e) {
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
  function bo(e) {
    di(e);
  }
  function yo(e) {
    console.error(e);
  }
  function _o(e) {
    di(e);
  }
  function oi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function No(e, t, l) {
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
  function lr(e, t, l) {
    return l = ll(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      oi(e, t);
    }, l;
  }
  function So(e) {
    return e = ll(e), e.tag = 3, e;
  }
  function wo(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        No(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      No(t, l, a), typeof n != "function" && (fl === null ? fl = /* @__PURE__ */ new Set([this]) : fl.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function ax(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ga(
        t,
        l,
        n,
        !0
      ), l = gs.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Os === null ? Cr() : l.alternate === null && Rt === 0 && (Rt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Ac ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Or(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Ac ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Or(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return Or(e, a, n), Cr(), !1;
    }
    if (xt)
      return t = gs.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== wc && (e = Error(o(422), { cause: a }), Ya(xs(e, l)))) : (a !== wc && (t = Error(o(423), {
        cause: a
      }), Ya(
        xs(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = xs(a, l), n = lr(
        e.stateNode,
        a,
        n
      ), Dc(e, n), Rt !== 4 && (Rt = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = xs(i, l), un === null ? un = [i] : un.push(i), Rt !== 4 && (Rt = 2), t === null) return !0;
    a = xs(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = lr(l.stateNode, a, e), Dc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (fl === null || !fl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = So(n), wo(
              n,
              e,
              l,
              a
            ), Dc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var ko = Error(o(461)), Zt = !1;
  function Kt(e, t, l, a) {
    t.child = e === null ? jo(t, null, l, a) : ca(
      t,
      e.child,
      l,
      a
    );
  }
  function Co(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var d in a)
        d !== "ref" && (c[d] = a[d]);
    } else c = a;
    return Ul(t), a = Lc(
      e,
      t,
      l,
      c,
      i,
      n
    ), d = Yc(), e !== null && !Zt ? (Gc(e, t, n), Xs(e, t, n)) : (xt && d && Nc(t), t.flags |= 1, Kt(e, t, a, n), t.child);
  }
  function Eo(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !bc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Oo(
        e,
        t,
        i,
        a,
        n
      )) : (e = Xn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !or(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : qa, l(c, a) && e.ref === t.ref)
        return Xs(e, t, n);
    }
    return t.flags |= 1, e = qs(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Oo(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (qa(i, a) && e.ref === t.ref)
        if (Zt = !1, t.pendingProps = a = i, or(e, n))
          (e.flags & 131072) !== 0 && (Zt = !0);
        else
          return t.lanes = e.lanes, Xs(e, t, n);
    }
    return ar(
      e,
      t,
      l,
      a,
      n
    );
  }
  function To(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return zo(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && $n(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Ed(t, i) : qc(), vo(t);
      else
        return t.lanes = t.childLanes = 536870912, zo(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? ($n(t, i.cachePool), Ed(t, i), cl(), t.memoizedState = null) : (e !== null && $n(t, null), qc(), cl());
    return Kt(e, t, n, l), t.child;
  }
  function zo(e, t, l, a) {
    var n = zc();
    return n = n === null ? null : { parent: Gt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && $n(t, null), qc(), vo(t), e !== null && Ga(e, t, a, !0), null;
  }
  function hi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function ar(e, t, l, a, n) {
    return Ul(t), l = Lc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Yc(), e !== null && !Zt ? (Gc(e, t, n), Xs(e, t, n)) : (xt && a && Nc(t), t.flags |= 1, Kt(e, t, l, n), t.child);
  }
  function Ao(e, t, l, a, n, i) {
    return Ul(t), t.updateQueue = null, l = Td(
      t,
      a,
      l,
      n
    ), Od(e), a = Yc(), e !== null && !Zt ? (Gc(e, t, i), Xs(e, t, i)) : (xt && a && Nc(t), t.flags |= 1, Kt(e, t, l, i), t.child);
  }
  function Ro(e, t, l, a, n) {
    if (Ul(t), t.stateNode === null) {
      var i = Fl, c = l.contextType;
      typeof c == "object" && c !== null && (i = It(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = sr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Rc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? It(c) : Fl, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (tr(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && sr.enqueueReplaceState(i, i.state, null), $a(t, a, i, n), Ka(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, v = ql(l, d);
      i.props = v;
      var T = i.context, J = l.contextType;
      c = Fl, typeof J == "object" && J !== null && (c = It(J));
      var te = l.getDerivedStateFromProps;
      J = typeof te == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || T !== c) && go(
        t,
        i,
        a,
        c
      ), sl = !1;
      var A = t.memoizedState;
      i.state = A, $a(t, a, i, n), Ka(), T = t.memoizedState, d || A !== T || sl ? (typeof te == "function" && (tr(
        t,
        l,
        te,
        a
      ), T = t.memoizedState), (v = sl || po(
        t,
        l,
        v,
        a,
        A,
        T,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = T), i.props = a, i.state = T, i.context = c, a = v) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Uc(e, t), c = t.memoizedProps, J = ql(l, c), i.props = J, te = t.pendingProps, A = i.context, T = l.contextType, v = Fl, typeof T == "object" && T !== null && (v = It(T)), d = l.getDerivedStateFromProps, (T = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== te || A !== v) && go(
        t,
        i,
        a,
        v
      ), sl = !1, A = t.memoizedState, i.state = A, $a(t, a, i, n), Ka();
      var D = t.memoizedState;
      c !== te || A !== D || sl || e !== null && e.dependencies !== null && Jn(e.dependencies) ? (typeof d == "function" && (tr(
        t,
        l,
        d,
        a
      ), D = t.memoizedState), (J = sl || po(
        t,
        l,
        J,
        a,
        A,
        D,
        v
      ) || e !== null && e.dependencies !== null && Jn(e.dependencies)) ? (T || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, D, v), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        D,
        v
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = D), i.props = a, i.state = D, i.context = v, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, hi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ca(
      t,
      e.child,
      null,
      n
    ), t.child = ca(
      t,
      null,
      l,
      n
    )) : Kt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = Xs(
      e,
      t,
      n
    ), e;
  }
  function Uo(e, t, l, a) {
    return La(), t.flags |= 256, Kt(e, t, l, a), t.child;
  }
  var nr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ir(e) {
    return { baseLanes: e, cachePool: bd() };
  }
  function cr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= bs), e;
  }
  function Do(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Qt.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (xt) {
        if (n ? il(t) : cl(), xt) {
          var d = At, v;
          if (v = d) {
            e: {
              for (v = d, d = Es; v.nodeType !== 8; ) {
                if (!d) {
                  d = null;
                  break e;
                }
                if (v = Ss(
                  v.nextSibling
                ), v === null) {
                  d = null;
                  break e;
                }
              }
              d = v;
            }
            d !== null ? (t.memoizedState = {
              dehydrated: d,
              treeContext: Ol !== null ? { id: Hs, overflow: Bs } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, v = cs(
              18,
              null,
              null,
              0
            ), v.stateNode = d, v.return = t, t.child = v, es = t, At = null, v = !0) : v = !1;
          }
          v || Al(t);
        }
        if (d = t.memoizedState, d !== null && (d = d.dehydrated, d !== null))
          return Xr(d) ? t.lanes = 32 : t.lanes = 536870912, null;
        Qs(t);
      }
      return d = a.children, a = a.fallback, n ? (cl(), n = t.mode, d = fi(
        { mode: "hidden", children: d },
        n
      ), a = El(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, n = t.child, n.memoizedState = ir(l), n.childLanes = cr(
        e,
        c,
        l
      ), t.memoizedState = nr, a) : (il(t), rr(t, d));
    }
    if (v = e.memoizedState, v !== null && (d = v.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (il(t), t.flags &= -257, t = ur(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (cl(), t.child = e.child, t.flags |= 128, t = null) : (cl(), n = a.fallback, d = t.mode, a = fi(
          { mode: "visible", children: a.children },
          d
        ), n = El(
          n,
          d,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, ca(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = ir(l), a.childLanes = cr(
          e,
          c,
          l
        ), t.memoizedState = nr, t = n);
      else if (il(t), Xr(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var T = c.dgst;
        c = T, a = Error(o(419)), a.stack = "", a.digest = c, Ya({ value: a, source: null, stack: null }), t = ur(
          e,
          t,
          l
        );
      } else if (Zt || Ga(e, t, l, !1), c = (l & e.childLanes) !== 0, Zt || c) {
        if (c = wt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : xe(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== v.retryLane))
          throw v.retryLane = a, Wl(e, a), hs(c, e, a), ko;
        d.data === "$?" || Cr(), t = ur(
          e,
          t,
          l
        );
      } else
        d.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = v.treeContext, At = Ss(
          d.nextSibling
        ), es = t, xt = !0, zl = null, Es = !1, e !== null && (vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Hs = e.id, Bs = e.overflow, Ol = t), t = rr(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (cl(), n = a.fallback, d = t.mode, v = e.child, T = v.sibling, a = qs(v, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = v.subtreeFlags & 65011712, T !== null ? n = qs(T, n) : (n = El(
      n,
      d,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, d = e.child.memoizedState, d === null ? d = ir(l) : (v = d.cachePool, v !== null ? (T = Gt._currentValue, v = v.parent !== T ? { parent: T, pool: T } : v) : v = bd(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: v
    }), n.memoizedState = d, n.childLanes = cr(
      e,
      c,
      l
    ), t.memoizedState = nr, a) : (il(t), l = e.child, e = l.sibling, l = qs(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function rr(e, t) {
    return t = fi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function fi(e, t) {
    return e = cs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function ur(e, t, l) {
    return ca(t, e.child, null, l), e = rr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Mo(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Cc(e.return, t, l);
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
  function qo(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (Kt(e, t, a.children, l), a = Qt.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Mo(e, l, t);
          else if (e.tag === 19)
            Mo(e, l, t);
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
    switch (Z(Qt, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && ui(e) === null && (n = l), l = l.sibling;
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
          if (e = n.alternate, e !== null && ui(e) === null) {
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
  function Xs(e, t, l) {
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
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, l = qs(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = qs(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function or(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Jn(e)));
  }
  function nx(e, t, l) {
    switch (t.tag) {
      case 3:
        ae(t, t.stateNode.containerInfo), tl(t, Gt, e.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        Ge(t);
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
          return a.dehydrated !== null ? (il(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Do(e, t, l) : (il(t), e = Xs(
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
            return qo(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Z(Qt, Qt.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, To(e, t, l);
      case 24:
        tl(t, Gt, e.memoizedState.cache);
    }
    return Xs(e, t, l);
  }
  function Ho(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Zt = !0;
      else {
        if (!or(e, l) && (t.flags & 128) === 0)
          return Zt = !1, nx(
            e,
            t,
            l
          );
        Zt = (e.flags & 131072) !== 0;
      }
    else
      Zt = !1, xt && (t.flags & 1048576) !== 0 && fd(t, Vn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            bc(a) ? (e = ql(a, e), t.tag = 1, t = Ro(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = ar(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === oe) {
                t.tag = 11, t = Co(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === je) {
                t.tag = 14, t = Eo(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              }
            }
            throw t = Q(a) || a, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return ar(
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
        ), Ro(
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
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Uc(e, t), $a(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, tl(t, Gt, a), a !== i.cache && Ec(
            t,
            [Gt],
            l,
            !0
          ), Ka(), a = c.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Uo(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = xs(
                Error(o(424)),
                t
              ), Ya(n), t = Uo(
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
              for (At = Ss(e.firstChild), es = t, xt = !0, zl = null, Es = !0, l = jo(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (La(), a === n) {
              t = Xs(
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
        return hi(e, t), e === null ? (l = Gh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : xt || (l = t.type, e = t.pendingProps, a = Ci(
          P.current
        ).createElement(l), a[ut] = t, a[Nt] = e, Wt(a, l, e), Dt(a), t.stateNode = a) : t.memoizedState = Gh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Ge(t), e === null && xt && (a = t.stateNode = Bh(
          t.type,
          t.pendingProps,
          P.current
        ), es = t, Es = !0, n = At, jl(t.type) ? (Zr = n, At = Ss(
          a.firstChild
        )) : At = n), Kt(
          e,
          t,
          t.pendingProps.children,
          l
        ), hi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && xt && ((n = a = At) && (a = Rx(
          a,
          t.type,
          t.pendingProps,
          Es
        ), a !== null ? (t.stateNode = a, es = t, At = Ss(
          a.firstChild
        ), Es = !1, n = !0) : n = !1), n || Al(t)), Ge(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, Yr(n, i) ? a = null : c !== null && Yr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Lc(
          e,
          t,
          Fm,
          null,
          null,
          l
        ), pn._currentValue = n), hi(e, t), Kt(e, t, a, l), t.child;
      case 6:
        return e === null && xt && ((e = l = At) && (l = Ux(
          l,
          t.pendingProps,
          Es
        ), l !== null ? (t.stateNode = l, es = t, At = null, e = !0) : e = !1), e || Al(t)), null;
      case 13:
        return Do(e, t, l);
      case 4:
        return ae(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ca(
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
        return Co(
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
        return a = t.pendingProps, tl(t, t.type, a.value), Kt(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Ul(t), n = It(n), a = a(n), t.flags |= 1, Kt(e, t, a, l), t.child;
      case 14:
        return Eo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Oo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return qo(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = fi(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = qs(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return To(e, t, l);
      case 24:
        return Ul(t), a = It(Gt), e === null ? (n = zc(), n === null && (n = wt, i = Oc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Rc(t), tl(t, Gt, n)) : ((e.lanes & l) !== 0 && (Uc(e, t), $a(t, null, null, l), Ka()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), tl(t, Gt, a)) : (a = i.cache, tl(t, Gt, a), a !== n.cache && Ec(
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
  function Zs(e) {
    e.flags |= 4;
  }
  function Bo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Jh(t)) {
      if (t = gs.current, t !== null && ((ft & 4194048) === ft ? Os !== null : (ft & 62914560) !== ft && (ft & 536870912) === 0 || t !== Os))
        throw Va = Ac, yd;
      e.flags |= 8192;
    }
  }
  function mi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? U() : 536870912, e.lanes |= t, oa |= t);
  }
  function sn(e, t) {
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
  function ix(e, t, l) {
    var a = t.pendingProps;
    switch (Sc(t), t.tag) {
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
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ys(Gt), Ce(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ba(t) ? Zs(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, jd())), Tt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Zs(t), l !== null ? (Tt(t), Bo(t, l)) : (Tt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Zs(t), Tt(t), Bo(t, l)) : (Tt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Zs(t), Tt(t), t.flags &= -16777217), null;
      case 27:
        Pe(t), l = P.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Tt(t), null;
          }
          e = ne.current, Ba(t) ? md(t) : (e = Bh(n, a, l), t.stateNode = e, Zs(t));
        }
        return Tt(t), null;
      case 5:
        if (Pe(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Tt(t), null;
          }
          if (e = ne.current, Ba(t))
            md(t);
          else {
            switch (n = Ci(
              P.current
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
            e && Zs(t);
          }
        }
        return Tt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = P.current, Ba(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = es, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[ut] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Ah(e.nodeValue, l)), e || Al(t);
          } else
            e = Ci(e).createTextNode(
              a
            ), e[ut] = t, t.stateNode = e;
        }
        return Tt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ba(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[ut] = t;
            } else
              La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Tt(t), n = !1;
          } else
            n = jd(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Qs(t), t) : (Qs(t), null);
        }
        if (Qs(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), mi(t, t.updateQueue), Tt(t), null;
      case 4:
        return Ce(), e === null && Mr(t.stateNode.containerInfo), Tt(t), null;
      case 10:
        return Ys(t.type), Tt(t), null;
      case 19:
        if (I(Qt), n = t.memoizedState, n === null) return Tt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) sn(n, !1);
          else {
            if (Rt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = ui(e), i !== null) {
                  for (t.flags |= 128, sn(n, !1), e = i.updateQueue, t.updateQueue = e, mi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    hd(l, e), l = l.sibling;
                  return Z(
                    Qt,
                    Qt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && Be() > vi && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = ui(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, mi(t, e), sn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !xt)
                return Tt(t), null;
            } else
              2 * Be() - n.renderingStartTime > vi && l !== 536870912 && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = Be(), t.sibling = null, e = Qt.current, Z(Qt, a ? e & 1 | 2 : e & 1), t) : (Tt(t), null);
      case 22:
      case 23:
        return Qs(t), Hc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Tt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Tt(t), l = t.updateQueue, l !== null && mi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && I(Dl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ys(Gt), Tt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function cx(e, t) {
    switch (Sc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ys(Gt), Ce(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Pe(t), null;
      case 13:
        if (Qs(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          La();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return I(Qt), null;
      case 4:
        return Ce(), null;
      case 10:
        return Ys(t.type), null;
      case 22:
      case 23:
        return Qs(t), Hc(), e !== null && I(Dl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ys(Gt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lo(e, t) {
    switch (Sc(t), t.tag) {
      case 3:
        Ys(Gt), Ce();
        break;
      case 26:
      case 27:
      case 5:
        Pe(t);
        break;
      case 4:
        Ce();
        break;
      case 13:
        Qs(t);
        break;
      case 19:
        I(Qt);
        break;
      case 10:
        Ys(t.type);
        break;
      case 22:
      case 23:
        Qs(t), Hc(), e !== null && I(Dl);
        break;
      case 24:
        Ys(Gt);
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
            var i = l.create, c = l.inst;
            a = i(), c.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (d) {
      St(t, t.return, d);
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
            var c = a.inst, d = c.destroy;
            if (d !== void 0) {
              c.destroy = void 0, n = t;
              var v = l, T = d;
              try {
                T();
              } catch (J) {
                St(
                  n,
                  v,
                  J
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (J) {
      St(t, t.return, J);
    }
  }
  function Yo(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Cd(t, l);
      } catch (a) {
        St(e, e.return, a);
      }
    }
  }
  function Go(e, t, l) {
    l.props = ql(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      St(e, t, a);
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
      St(e, t, n);
    }
  }
  function Ts(e, t) {
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
  function Qo(e) {
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
  function hr(e, t, l) {
    try {
      var a = e.stateNode;
      Ex(a, e.type, l, t), a[Nt] = t;
    } catch (n) {
      St(e, e.return, n);
    }
  }
  function Xo(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && jl(e.type) || e.tag === 4;
  }
  function fr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Xo(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && jl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function mr(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = ki));
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (mr(e, t, l), e = e.sibling; e !== null; )
        mr(e, t, l), e = e.sibling;
  }
  function xi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (xi(e, t, l), e = e.sibling; e !== null; )
        xi(e, t, l), e = e.sibling;
  }
  function Zo(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Wt(t, a, l), t[ut] = e, t[Nt] = l;
    } catch (i) {
      St(e, e.return, i);
    }
  }
  var Vs = !1, qt = !1, xr = !1, Vo = typeof WeakSet == "function" ? WeakSet : Set, Vt = null;
  function rx(e, t) {
    if (e = e.containerInfo, Br = Ri, e = sd(e), fc(e)) {
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
            var c = 0, d = -1, v = -1, T = 0, J = 0, te = e, A = null;
            t: for (; ; ) {
              for (var D; te !== l || n !== 0 && te.nodeType !== 3 || (d = c + n), te !== i || a !== 0 && te.nodeType !== 3 || (v = c + a), te.nodeType === 3 && (c += te.nodeValue.length), (D = te.firstChild) !== null; )
                A = te, te = D;
              for (; ; ) {
                if (te === e) break t;
                if (A === l && ++T === n && (d = c), A === i && ++J === a && (v = c), (D = te.nextSibling) !== null) break;
                te = A, A = te.parentNode;
              }
              te = D;
            }
            l = d === -1 || v === -1 ? null : { start: d, end: v };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Lr = { focusedElem: e, selectionRange: l }, Ri = !1, Vt = t; Vt !== null; )
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
                  var et = ql(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    et,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (We) {
                  St(
                    l,
                    l.return,
                    We
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
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Vt = e;
            break;
          }
          Vt = t.return;
        }
  }
  function Jo(e, t, l) {
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
            } catch (c) {
              St(l, l.return, c);
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
            } catch (c) {
              St(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Yo(l), a & 512 && an(l, l.return);
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
            Cd(e, t);
          } catch (c) {
            St(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Zo(l);
      case 26:
      case 5:
        ul(e, l), t === null && a & 4 && Qo(l), a & 512 && an(l, l.return);
        break;
      case 12:
        ul(e, l);
        break;
      case 13:
        ul(e, l), a & 4 && Wo(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = vx.bind(
          null,
          l
        ), Dx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Vs, !a) {
          t = t !== null && t.memoizedState !== null || qt, n = Vs;
          var i = qt;
          Vs = a, (qt = t) && !i ? dl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : ul(e, l), Vs = n, qt = i;
        }
        break;
      case 30:
        break;
      default:
        ul(e, l);
    }
  }
  function Ko(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Ko(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ze(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Et = null, as = !1;
  function Js(e, t, l) {
    for (l = l.child; l !== null; )
      $o(e, t, l), l = l.sibling;
  }
  function $o(e, t, l) {
    if (we && typeof we.onCommitFiberUnmount == "function")
      try {
        we.onCommitFiberUnmount(F, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        qt || Ts(l, t), Js(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        qt || Ts(l, t);
        var a = Et, n = as;
        jl(l.type) && (Et = l.stateNode, as = !1), Js(
          e,
          t,
          l
        ), mn(l.stateNode), Et = a, as = n;
        break;
      case 5:
        qt || Ts(l, t);
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
        Et !== null && (as ? (e = Et, qh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), _n(e)) : qh(Et, l.stateNode));
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
        qt || rl(2, l, t), qt || rl(4, l, t), Js(
          e,
          t,
          l
        );
        break;
      case 1:
        qt || (Ts(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Go(
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
        qt = (a = qt) || l.memoizedState !== null, Js(
          e,
          t,
          l
        ), qt = a;
        break;
      default:
        Js(
          e,
          t,
          l
        );
    }
  }
  function Wo(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        _n(e);
      } catch (l) {
        St(t, t.return, l);
      }
  }
  function ux(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Vo()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Vo()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function jr(e, t) {
    var l = ux(e);
    t.forEach(function(a) {
      var n = px.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function rs(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (jl(d.type)) {
                Et = d.stateNode, as = !1;
                break e;
              }
              break;
            case 5:
              Et = d.stateNode, as = !1;
              break e;
            case 3:
            case 4:
              Et = d.stateNode.containerInfo, as = !0;
              break e;
          }
          d = d.return;
        }
        if (Et === null) throw Error(o(160));
        $o(i, c, n), Et = null, as = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Fo(t, e), t = t.sibling;
  }
  var Ns = null;
  function Fo(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        rs(t, e), us(e), a & 4 && (rl(3, e, e.return), ln(3, e), rl(5, e, e.return));
        break;
      case 1:
        rs(t, e), us(e), a & 512 && (qt || l === null || Ts(l, l.return)), a & 64 && Vs && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Ns;
        if (rs(t, e), us(e), a & 512 && (qt || l === null || Ts(l, l.return)), a & 4) {
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
                      )), Wt(i, a, l), i[ut] = e, Dt(i), a = i;
                      break e;
                    case "link":
                      var c = Zh(
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
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Zh(
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
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  i[ut] = e, Dt(i), a = i;
                }
                e.stateNode = a;
              } else
                Vh(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Xh(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? Vh(
              n,
              e.type,
              e.stateNode
            ) : Xh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && hr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        rs(t, e), us(e), a & 512 && (qt || l === null || Ts(l, l.return)), l !== null && a & 4 && hr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (rs(t, e), us(e), a & 512 && (qt || l === null || Ts(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Ql(n, "");
          } catch (D) {
            St(e, e.return, D);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, hr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (xr = !0);
        break;
      case 6:
        if (rs(t, e), us(e), a & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (D) {
            St(e, e.return, D);
          }
        }
        break;
      case 3:
        if (Ti = null, n = Ns, Ns = Ei(t.containerInfo), rs(t, e), Ns = n, us(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            _n(t.containerInfo);
          } catch (D) {
            St(e, e.return, D);
          }
        xr && (xr = !1, Io(e));
        break;
      case 4:
        a = Ns, Ns = Ei(
          e.stateNode.containerInfo
        ), rs(t, e), us(e), Ns = a;
        break;
      case 12:
        rs(t, e), us(e);
        break;
      case 13:
        rs(t, e), us(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (_r = Be()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, jr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var v = l !== null && l.memoizedState !== null, T = Vs, J = qt;
        if (Vs = T || n, qt = J || v, rs(t, e), qt = J, Vs = T, us(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || v || Vs || qt || Hl(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                v = l = t;
                try {
                  if (i = v.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    d = v.stateNode;
                    var te = v.memoizedProps.style, A = te != null && te.hasOwnProperty("display") ? te.display : null;
                    d.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (D) {
                  St(v, v.return, D);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                v = t;
                try {
                  v.stateNode.nodeValue = n ? "" : v.memoizedProps;
                } catch (D) {
                  St(v, v.return, D);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, jr(e, l))));
        break;
      case 19:
        rs(t, e), us(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, jr(e, a)));
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
          if (Xo(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = fr(e);
            xi(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (Ql(c, ""), l.flags &= -33);
            var d = fr(e);
            xi(e, d, c);
            break;
          case 3:
          case 4:
            var v = l.stateNode.containerInfo, T = fr(e);
            mr(
              e,
              T,
              v
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (J) {
        St(e, e.return, J);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Io(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Io(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function ul(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Jo(e, t.alternate, t), t = t.sibling;
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
          typeof l.componentWillUnmount == "function" && Go(
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
  function dl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          dl(
            n,
            i,
            l
          ), ln(4, i);
          break;
        case 1:
          if (dl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (T) {
              St(a, a.return, T);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var d = a.stateNode;
            try {
              var v = n.shared.hiddenCallbacks;
              if (v !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < v.length; n++)
                  kd(v[n], d);
            } catch (T) {
              St(a, a.return, T);
            }
          }
          l && c & 64 && Yo(i), an(i, i.return);
          break;
        case 27:
          Zo(i);
        case 26:
        case 5:
          dl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Qo(i), an(i, i.return);
          break;
        case 12:
          dl(
            n,
            i,
            l
          );
          break;
        case 13:
          dl(
            n,
            i,
            l
          ), l && c & 4 && Wo(n, i);
          break;
        case 22:
          i.memoizedState === null && dl(
            n,
            i,
            l
          ), an(i, i.return);
          break;
        case 30:
          break;
        default:
          dl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function vr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Qa(l));
  }
  function pr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qa(e));
  }
  function zs(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Po(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function Po(e, t, l, a) {
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
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qa(e)));
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
            var i = t.memoizedProps, c = i.id, d = i.onPostCommit;
            typeof d == "function" && d(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (v) {
            St(t, t.return, v);
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
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? zs(
          e,
          t,
          l,
          a
        ) : nn(e, t) : i._visibility & 2 ? zs(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, ra(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && vr(c, t);
        break;
      case 24:
        zs(
          e,
          t,
          l,
          a
        ), n & 2048 && pr(t.alternate, t);
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
  function ra(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, d = l, v = a, T = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ra(
            i,
            c,
            d,
            v,
            n
          ), ln(8, c);
          break;
        case 23:
          break;
        case 22:
          var J = c.stateNode;
          c.memoizedState !== null ? J._visibility & 2 ? ra(
            i,
            c,
            d,
            v,
            n
          ) : nn(
            i,
            c
          ) : (J._visibility |= 2, ra(
            i,
            c,
            d,
            v,
            n
          )), n && T & 2048 && vr(
            c.alternate,
            c
          );
          break;
        case 24:
          ra(
            i,
            c,
            d,
            v,
            n
          ), n && T & 2048 && pr(c.alternate, c);
          break;
        default:
          ra(
            i,
            c,
            d,
            v,
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
            nn(l, a), n & 2048 && vr(
              a.alternate,
              a
            );
            break;
          case 24:
            nn(l, a), n & 2048 && pr(a.alternate, a);
            break;
          default:
            nn(l, a);
        }
        t = t.sibling;
      }
  }
  var cn = 8192;
  function ua(e) {
    if (e.subtreeFlags & cn)
      for (e = e.child; e !== null; )
        eh(e), e = e.sibling;
  }
  function eh(e) {
    switch (e.tag) {
      case 26:
        ua(e), e.flags & cn && e.memoizedState !== null && Kx(
          Ns,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ua(e);
        break;
      case 3:
      case 4:
        var t = Ns;
        Ns = Ei(e.stateNode.containerInfo), ua(e), Ns = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = cn, cn = 16777216, ua(e), cn = t) : ua(e));
        break;
      default:
        ua(e);
    }
  }
  function th(e) {
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
          Vt = a, lh(
            a,
            e
          );
        }
      th(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        sh(e), e = e.sibling;
  }
  function sh(e) {
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
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ji(e)) : rn(e);
        break;
      default:
        rn(e);
    }
  }
  function ji(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Vt = a, lh(
            a,
            e
          );
        }
      th(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          rl(8, t, t.return), ji(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, ji(t));
          break;
        default:
          ji(t);
      }
      e = e.sibling;
    }
  }
  function lh(e, t) {
    for (; Vt !== null; ) {
      var l = Vt;
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
          Qa(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Vt = a;
      else
        e: for (l = e; Vt !== null; ) {
          a = Vt;
          var n = a.sibling, i = a.return;
          if (Ko(a), a === l) {
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
  var dx = {
    getCacheForType: function(e) {
      var t = It(Gt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, ox = typeof WeakMap == "function" ? WeakMap : Map, pt = 0, wt = null, ot = null, ft = 0, gt = 0, ds = null, ol = !1, da = !1, gr = !1, Ks = 0, Rt = 0, hl = 0, Bl = 0, br = 0, bs = 0, oa = 0, un = null, ns = null, yr = !1, _r = 0, vi = 1 / 0, pi = null, fl = null, $t = 0, ml = null, ha = null, fa = 0, Nr = 0, Sr = null, ah = null, dn = 0, wr = null;
  function os() {
    if ((pt & 2) !== 0 && ft !== 0)
      return ft & -ft;
    if (g.T !== null) {
      var e = ea;
      return e !== 0 ? e : Ar();
    }
    return Ct();
  }
  function nh() {
    bs === 0 && (bs = (ft & 536870912) === 0 || xt ? jt() : 536870912);
    var e = gs.current;
    return e !== null && (e.flags |= 32), bs;
  }
  function hs(e, t, l) {
    (e === wt && (gt === 2 || gt === 9) || e.cancelPendingCommit !== null) && (ma(e, 0), xl(
      e,
      ft,
      bs,
      !1
    )), de(e, l), ((pt & 2) === 0 || e !== wt) && (e === wt && ((pt & 2) === 0 && (Bl |= l), Rt === 4 && xl(
      e,
      ft,
      bs,
      !1
    )), As(e));
  }
  function ih(e, t, l) {
    if ((pt & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || ge(e, t), n = a ? mx(e, t) : Er(e, t, !0), i = a;
    do {
      if (n === 0) {
        da && !a && xl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !hx(l)) {
          n = Er(e, t, !1), i = !1;
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
              n = un;
              var v = d.current.memoizedState.isDehydrated;
              if (v && (ma(d, c).flags |= 256), c = Er(
                d,
                c,
                !1
              ), c !== 2) {
                if (gr && !v) {
                  d.errorRecoveryDisabledLanes |= i, Bl |= i, n = 4;
                  break e;
                }
                i = ns, ns = n, i !== null && (ns === null ? ns = i : ns.push.apply(
                  ns,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ma(e, 0), xl(e, t, 0, !0);
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
              xl(
                a,
                t,
                bs,
                !ol
              );
              break e;
            case 2:
              ns = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = _r + 300 - Be(), 10 < n)) {
            if (xl(
              a,
              t,
              bs,
              !ol
            ), ve(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Dh(
              ch.bind(
                null,
                a,
                l,
                ns,
                pi,
                yr,
                t,
                bs,
                Bl,
                oa,
                ol,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          ch(
            a,
            l,
            ns,
            pi,
            yr,
            t,
            bs,
            Bl,
            oa,
            ol,
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
  function ch(e, t, l, a, n, i, c, d, v, T, J, te, A, D) {
    if (e.timeoutHandle = -1, te = t.subtreeFlags, (te & 8192 || (te & 16785408) === 16785408) && (vn = { stylesheets: null, count: 0, unsuspend: Jx }, eh(t), te = $x(), te !== null)) {
      e.cancelPendingCommit = te(
        mh.bind(
          null,
          e,
          t,
          i,
          l,
          a,
          n,
          c,
          d,
          v,
          J,
          1,
          A,
          D
        )
      ), xl(e, i, c, !T);
      return;
    }
    mh(
      e,
      t,
      i,
      l,
      a,
      n,
      c,
      d,
      v
    );
  }
  function hx(e) {
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
    t &= ~br, t &= ~Bl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - N(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && nt(e, l, t);
  }
  function gi() {
    return (pt & 6) === 0 ? (on(0), !1) : !0;
  }
  function kr() {
    if (ot !== null) {
      if (gt === 0)
        var e = ot.return;
      else
        e = ot, Ls = Rl = null, Qc(e), ia = null, en = 0, e = ot;
      for (; e !== null; )
        Lo(e.alternate, e), e = e.return;
      ot = null;
    }
  }
  function ma(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Tx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), kr(), wt = e, ot = l = qs(e.current, null), ft = t, gt = 0, ds = null, ol = !1, da = ge(e, t), gr = !1, oa = bs = br = Bl = hl = Rt = 0, ns = un = null, yr = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - N(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return Ks = t, Yn(), l;
  }
  function rh(e, t) {
    ct = null, g.H = ii, t === Za || t === Wn ? (t = Sd(), gt = 3) : t === yd ? (t = Sd(), gt = 4) : gt = t === ko ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ds = t, ot === null && (Rt = 1, oi(
      e,
      xs(t, e.current)
    ));
  }
  function uh() {
    var e = g.H;
    return g.H = ii, e === null ? ii : e;
  }
  function dh() {
    var e = g.A;
    return g.A = dx, e;
  }
  function Cr() {
    Rt = 4, ol || (ft & 4194048) !== ft && gs.current !== null || (da = !0), (hl & 134217727) === 0 && (Bl & 134217727) === 0 || wt === null || xl(
      wt,
      ft,
      bs,
      !1
    );
  }
  function Er(e, t, l) {
    var a = pt;
    pt |= 2;
    var n = uh(), i = dh();
    (wt !== e || ft !== t) && (pi = null, ma(e, t)), t = !1;
    var c = Rt;
    e: do
      try {
        if (gt !== 0 && ot !== null) {
          var d = ot, v = ds;
          switch (gt) {
            case 8:
              kr(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              gs.current === null && (t = !0);
              var T = gt;
              if (gt = 0, ds = null, xa(e, d, v, T), l && da) {
                c = 0;
                break e;
              }
              break;
            default:
              T = gt, gt = 0, ds = null, xa(e, d, v, T);
          }
        }
        fx(), c = Rt;
        break;
      } catch (J) {
        rh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ls = Rl = null, pt = a, g.H = n, g.A = i, ot === null && (wt = null, ft = 0, Yn()), c;
  }
  function fx() {
    for (; ot !== null; ) oh(ot);
  }
  function mx(e, t) {
    var l = pt;
    pt |= 2;
    var a = uh(), n = dh();
    wt !== e || ft !== t ? (pi = null, vi = Be() + 500, ma(e, t)) : da = ge(
      e,
      t
    );
    e: do
      try {
        if (gt !== 0 && ot !== null) {
          t = ot;
          var i = ds;
          t: switch (gt) {
            case 1:
              gt = 0, ds = null, xa(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (_d(i)) {
                gt = 0, ds = null, hh(t);
                break;
              }
              t = function() {
                gt !== 2 && gt !== 9 || wt !== e || (gt = 7), As(e);
              }, i.then(t, t);
              break e;
            case 3:
              gt = 7;
              break e;
            case 4:
              gt = 5;
              break e;
            case 7:
              _d(i) ? (gt = 0, ds = null, hh(t)) : (gt = 0, ds = null, xa(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (ot.tag) {
                case 26:
                  c = ot.memoizedState;
                case 5:
                case 27:
                  var d = ot;
                  if (!c || Jh(c)) {
                    gt = 0, ds = null;
                    var v = d.sibling;
                    if (v !== null) ot = v;
                    else {
                      var T = d.return;
                      T !== null ? (ot = T, bi(T)) : ot = null;
                    }
                    break t;
                  }
              }
              gt = 0, ds = null, xa(e, t, i, 5);
              break;
            case 6:
              gt = 0, ds = null, xa(e, t, i, 6);
              break;
            case 8:
              kr(), Rt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        xx();
        break;
      } catch (J) {
        rh(e, J);
      }
    while (!0);
    return Ls = Rl = null, g.H = a, g.A = n, pt = l, ot !== null ? 0 : (wt = null, ft = 0, Yn(), Rt);
  }
  function xx() {
    for (; ot !== null && !Re(); )
      oh(ot);
  }
  function oh(e) {
    var t = Ho(e.alternate, e, Ks);
    e.memoizedProps = e.pendingProps, t === null ? bi(e) : ot = t;
  }
  function hh(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ao(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ft
        );
        break;
      case 11:
        t = Ao(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ft
        );
        break;
      case 5:
        Qc(t);
      default:
        Lo(l, t), t = ot = hd(t, Ks), t = Ho(l, t, Ks);
    }
    e.memoizedProps = e.pendingProps, t === null ? bi(e) : ot = t;
  }
  function xa(e, t, l, a) {
    Ls = Rl = null, Qc(t), ia = null, en = 0;
    var n = t.return;
    try {
      if (ax(
        e,
        n,
        t,
        l,
        ft
      )) {
        Rt = 1, oi(
          e,
          xs(l, e.current)
        ), ot = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw ot = n, i;
      Rt = 1, oi(
        e,
        xs(l, e.current)
      ), ot = null;
      return;
    }
    t.flags & 32768 ? (xt || a === 1 ? e = !0 : da || (ft & 536870912) !== 0 ? e = !1 : (ol = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = gs.current, a !== null && a.tag === 13 && (a.flags |= 16384))), fh(t, e)) : bi(t);
  }
  function bi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        fh(
          t,
          ol
        );
        return;
      }
      e = t.return;
      var l = ix(
        t.alternate,
        t,
        Ks
      );
      if (l !== null) {
        ot = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ot = t;
        return;
      }
      ot = t = e;
    } while (t !== null);
    Rt === 0 && (Rt = 5);
  }
  function fh(e, t) {
    do {
      var l = cx(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ot = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ot = e;
        return;
      }
      ot = e = l;
    } while (e !== null);
    Rt = 6, ot = null;
  }
  function mh(e, t, l, a, n, i, c, d, v) {
    e.cancelPendingCommit = null;
    do
      yi();
    while ($t !== 0);
    if ((pt & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= pc, be(
        e,
        l,
        i,
        c,
        d,
        v
      ), e === wt && (ot = wt = null, ft = 0), ha = t, ml = e, fa = l, Nr = i, Sr = n, ah = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, gx(pe, function() {
        return gh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = g.T, g.T = null, n = B.p, B.p = 2, c = pt, pt |= 4;
        try {
          rx(e, t, l);
        } finally {
          pt = c, B.p = n, g.T = a;
        }
      }
      $t = 1, xh(), jh(), vh();
    }
  }
  function xh() {
    if ($t === 1) {
      $t = 0;
      var e = ml, t = ha, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = g.T, g.T = null;
        var a = B.p;
        B.p = 2;
        var n = pt;
        pt |= 4;
        try {
          Fo(t, e);
          var i = Lr, c = sd(e.containerInfo), d = i.focusedElem, v = i.selectionRange;
          if (c !== d && d && d.ownerDocument && td(
            d.ownerDocument.documentElement,
            d
          )) {
            if (v !== null && fc(d)) {
              var T = v.start, J = v.end;
              if (J === void 0 && (J = T), "selectionStart" in d)
                d.selectionStart = T, d.selectionEnd = Math.min(
                  J,
                  d.value.length
                );
              else {
                var te = d.ownerDocument || document, A = te && te.defaultView || window;
                if (A.getSelection) {
                  var D = A.getSelection(), et = d.textContent.length, We = Math.min(v.start, et), _t = v.end === void 0 ? We : Math.min(v.end, et);
                  !D.extend && We > _t && (c = _t, _t = We, We = c);
                  var C = ed(
                    d,
                    We
                  ), y = ed(
                    d,
                    _t
                  );
                  if (C && y && (D.rangeCount !== 1 || D.anchorNode !== C.node || D.anchorOffset !== C.offset || D.focusNode !== y.node || D.focusOffset !== y.offset)) {
                    var E = te.createRange();
                    E.setStart(C.node, C.offset), D.removeAllRanges(), We > _t ? (D.addRange(E), D.extend(y.node, y.offset)) : (E.setEnd(y.node, y.offset), D.addRange(E));
                  }
                }
              }
            }
            for (te = [], D = d; D = D.parentNode; )
              D.nodeType === 1 && te.push({
                element: D,
                left: D.scrollLeft,
                top: D.scrollTop
              });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < te.length; d++) {
              var W = te[d];
              W.element.scrollLeft = W.left, W.element.scrollTop = W.top;
            }
          }
          Ri = !!Br, Lr = Br = null;
        } finally {
          pt = n, B.p = a, g.T = l;
        }
      }
      e.current = t, $t = 2;
    }
  }
  function jh() {
    if ($t === 2) {
      $t = 0;
      var e = ml, t = ha, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = g.T, g.T = null;
        var a = B.p;
        B.p = 2;
        var n = pt;
        pt |= 4;
        try {
          Jo(e, t.alternate, t);
        } finally {
          pt = n, B.p = a, g.T = l;
        }
      }
      $t = 3;
    }
  }
  function vh() {
    if ($t === 4 || $t === 3) {
      $t = 0, Se();
      var e = ml, t = ha, l = fa, a = ah;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? $t = 5 : ($t = 0, ha = ml = null, ph(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (fl = null), $e(l), t = t.stateNode, we && typeof we.onCommitFiberRoot == "function")
        try {
          we.onCommitFiberRoot(
            F,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = g.T, n = B.p, B.p = 2, g.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < a.length; c++) {
            var d = a[c];
            i(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          g.T = t, B.p = n;
        }
      }
      (fa & 3) !== 0 && yi(), As(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === wr ? dn++ : (dn = 0, wr = e) : dn = 0, on(0);
    }
  }
  function ph(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Qa(t)));
  }
  function yi(e) {
    return xh(), jh(), vh(), gh();
  }
  function gh() {
    if ($t !== 5) return !1;
    var e = ml, t = Nr;
    Nr = 0;
    var l = $e(fa), a = g.T, n = B.p;
    try {
      B.p = 32 > l ? 32 : l, g.T = null, l = Sr, Sr = null;
      var i = ml, c = fa;
      if ($t = 0, ha = ml = null, fa = 0, (pt & 6) !== 0) throw Error(o(331));
      var d = pt;
      if (pt |= 4, sh(i.current), Po(
        i,
        i.current,
        c,
        l
      ), pt = d, on(0, !1), we && typeof we.onPostCommitFiberRoot == "function")
        try {
          we.onPostCommitFiberRoot(F, i);
        } catch {
        }
      return !0;
    } finally {
      B.p = n, g.T = a, ph(e, t);
    }
  }
  function bh(e, t, l) {
    t = xs(l, t), t = lr(e.stateNode, t, 2), e = al(e, t, 2), e !== null && (de(e, 2), As(e));
  }
  function St(e, t, l) {
    if (e.tag === 3)
      bh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          bh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (fl === null || !fl.has(a))) {
            e = xs(l, e), l = So(2), a = al(t, l, 2), a !== null && (wo(
              l,
              a,
              t,
              e
            ), de(a, 2), As(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Or(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new ox();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (gr = !0, n.add(l), e = jx.bind(null, e, t, l), t.then(e, e));
  }
  function jx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, wt === e && (ft & l) === l && (Rt === 4 || Rt === 3 && (ft & 62914560) === ft && 300 > Be() - _r ? (pt & 2) === 0 && ma(e, 0) : br |= l, oa === ft && (oa = 0)), As(e);
  }
  function yh(e, t) {
    t === 0 && (t = U()), e = Wl(e, t), e !== null && (de(e, t), As(e));
  }
  function vx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), yh(e, l);
  }
  function px(e, t) {
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
    a !== null && a.delete(t), yh(e, l);
  }
  function gx(e, t) {
    return Ve(e, t);
  }
  var _i = null, ja = null, Tr = !1, Ni = !1, zr = !1, Ll = 0;
  function As(e) {
    e !== ja && e.next === null && (ja === null ? _i = ja = e : ja = ja.next = e), Ni = !0, Tr || (Tr = !0, yx());
  }
  function on(e, t) {
    if (!zr && Ni) {
      zr = !0;
      do
        for (var l = !1, a = _i; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              i = (1 << 31 - N(42 | e) + 1) - 1, i &= n & ~(c & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, wh(a, i));
          } else
            i = ft, i = ve(
              a,
              a === wt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || ge(a, i) || (l = !0, wh(a, i));
          a = a.next;
        }
      while (l);
      zr = !1;
    }
  }
  function bx() {
    _h();
  }
  function _h() {
    Ni = Tr = !1;
    var e = 0;
    Ll !== 0 && (Ox() && (e = Ll), Ll = 0);
    for (var t = Be(), l = null, a = _i; a !== null; ) {
      var n = a.next, i = Nh(a, t);
      i === 0 ? (a.next = null, l === null ? _i = n : l.next = n, n === null && (ja = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (Ni = !0)), a = n;
    }
    on(e);
  }
  function Nh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - N(i), d = 1 << c, v = n[c];
      v === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Ke(d, t)) : v <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = wt, l = ft, l = ve(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (gt === 2 || gt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Ae(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || ge(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Ae(a), $e(l)) {
        case 2:
        case 8:
          l = rt;
          break;
        case 32:
          l = pe;
          break;
        case 268435456:
          l = Me;
          break;
        default:
          l = pe;
      }
      return a = Sh.bind(null, e), l = Ve(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Ae(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Sh(e, t) {
    if ($t !== 0 && $t !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (yi() && e.callbackNode !== l)
      return null;
    var a = ft;
    return a = ve(
      e,
      e === wt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (ih(e, a, t), Nh(e, Be()), e.callbackNode != null && e.callbackNode === l ? Sh.bind(null, e) : null);
  }
  function wh(e, t) {
    if (yi()) return null;
    ih(e, t, !0);
  }
  function yx() {
    zx(function() {
      (pt & 6) !== 0 ? Ve(
        tt,
        bx
      ) : _h();
    });
  }
  function Ar() {
    return Ll === 0 && (Ll = jt()), Ll;
  }
  function kh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Un("" + e);
  }
  function Ch(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function _x(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = kh(
        (n[Nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Nt] || null) ? kh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var d = new Hn(
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
                if (Ll !== 0) {
                  var v = c ? Ch(n, c) : new FormData(n);
                  Ic(
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
                typeof i == "function" && (d.preventDefault(), v = c ? Ch(n, c) : new FormData(n), Ic(
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
  for (var Rr = 0; Rr < vc.length; Rr++) {
    var Ur = vc[Rr], Nx = Ur.toLowerCase(), Sx = Ur[0].toUpperCase() + Ur.slice(1);
    _s(
      Nx,
      "on" + Sx
    );
  }
  _s(nd, "onAnimationEnd"), _s(id, "onAnimationIteration"), _s(cd, "onAnimationStart"), _s("dblclick", "onDoubleClick"), _s("focusin", "onFocus"), _s("focusout", "onBlur"), _s(Ym, "onTransitionRun"), _s(Gm, "onTransitionStart"), _s(Qm, "onTransitionCancel"), _s(rd, "onTransitionEnd"), Ps("onMouseEnter", ["mouseout", "mouseover"]), Ps("onMouseLeave", ["mouseout", "mouseover"]), Ps("onPointerEnter", ["pointerout", "pointerover"]), Ps("onPointerLeave", ["pointerout", "pointerover"]), Ft(
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
  var hn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), wx = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hn)
  );
  function Eh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var d = a[c], v = d.instance, T = d.currentTarget;
            if (d = d.listener, v !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = T;
            try {
              i(n);
            } catch (J) {
              di(J);
            }
            n.currentTarget = null, i = v;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (d = a[c], v = d.instance, T = d.currentTarget, d = d.listener, v !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = T;
            try {
              i(n);
            } catch (J) {
              di(J);
            }
            n.currentTarget = null, i = v;
          }
      }
    }
  }
  function ht(e, t) {
    var l = t[ke];
    l === void 0 && (l = t[ke] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Oh(t, e, 2, !1), l.add(a));
  }
  function Dr(e, t, l) {
    var a = 0;
    t && (a |= 4), Oh(
      l,
      e,
      a,
      t
    );
  }
  var Si = "_reactListening" + Math.random().toString(36).slice(2);
  function Mr(e) {
    if (!e[Si]) {
      e[Si] = !0, Ea.forEach(function(l) {
        l !== "selectionchange" && (wx.has(l) || Dr(l, !1, e), Dr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Si] || (t[Si] = !0, Dr("selectionchange", !1, t));
    }
  }
  function Oh(e, t, l, a) {
    switch (Ph(t)) {
      case 2:
        var n = Ix;
        break;
      case 8:
        n = Px;
        break;
      default:
        n = Wr;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !ac || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function qr(e, t, l, a, n) {
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
              var v = c.tag;
              if ((v === 3 || v === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; d !== null; ) {
            if (c = st(d), c === null) return;
            if (v = c.tag, v === 5 || v === 6 || v === 26 || v === 27) {
              a = i = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        a = a.return;
      }
    Du(function() {
      var T = i, J = sc(l), te = [];
      e: {
        var A = ud.get(e);
        if (A !== void 0) {
          var D = Hn, et = e;
          switch (e) {
            case "keypress":
              if (Mn(l) === 0) break e;
            case "keydown":
            case "keyup":
              D = gm;
              break;
            case "focusin":
              et = "focus", D = rc;
              break;
            case "focusout":
              et = "blur", D = rc;
              break;
            case "beforeblur":
            case "afterblur":
              D = rc;
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
              D = Hu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = cm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = _m;
              break;
            case nd:
            case id:
            case cd:
              D = dm;
              break;
            case rd:
              D = Sm;
              break;
            case "scroll":
            case "scrollend":
              D = nm;
              break;
            case "wheel":
              D = km;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = hm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = Lu;
              break;
            case "toggle":
            case "beforetoggle":
              D = Em;
          }
          var We = (t & 4) !== 0, _t = !We && (e === "scroll" || e === "scrollend"), C = We ? A !== null ? A + "Capture" : null : A;
          We = [];
          for (var y = T, E; y !== null; ) {
            var W = y;
            if (E = W.stateNode, W = W.tag, W !== 5 && W !== 26 && W !== 27 || E === null || C === null || (W = Ta(y, C), W != null && We.push(
              fn(y, W, E)
            )), _t) break;
            y = y.return;
          }
          0 < We.length && (A = new D(
            A,
            et,
            null,
            l,
            J
          ), te.push({ event: A, listeners: We }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (A = e === "mouseover" || e === "pointerover", D = e === "mouseout" || e === "pointerout", A && l !== tc && (et = l.relatedTarget || l.fromElement) && (st(et) || et[p]))
            break e;
          if ((D || A) && (A = J.window === J ? J : (A = J.ownerDocument) ? A.defaultView || A.parentWindow : window, D ? (et = l.relatedTarget || l.toElement, D = T, et = et ? st(et) : null, et !== null && (_t = L(et), We = et.tag, et !== _t || We !== 5 && We !== 27 && We !== 6) && (et = null)) : (D = null, et = T), D !== et)) {
            if (We = Hu, W = "onMouseLeave", C = "onMouseEnter", y = "mouse", (e === "pointerout" || e === "pointerover") && (We = Lu, W = "onPointerLeave", C = "onPointerEnter", y = "pointer"), _t = D == null ? A : Cs(D), E = et == null ? A : Cs(et), A = new We(
              W,
              y + "leave",
              D,
              l,
              J
            ), A.target = _t, A.relatedTarget = E, W = null, st(J) === T && (We = new We(
              C,
              y + "enter",
              et,
              l,
              J
            ), We.target = E, We.relatedTarget = _t, W = We), _t = W, D && et)
              t: {
                for (We = D, C = et, y = 0, E = We; E; E = va(E))
                  y++;
                for (E = 0, W = C; W; W = va(W))
                  E++;
                for (; 0 < y - E; )
                  We = va(We), y--;
                for (; 0 < E - y; )
                  C = va(C), E--;
                for (; y--; ) {
                  if (We === C || C !== null && We === C.alternate)
                    break t;
                  We = va(We), C = va(C);
                }
                We = null;
              }
            else We = null;
            D !== null && Th(
              te,
              A,
              D,
              We,
              !1
            ), et !== null && _t !== null && Th(
              te,
              _t,
              et,
              We,
              !0
            );
          }
        }
        e: {
          if (A = T ? Cs(T) : window, D = A.nodeName && A.nodeName.toLowerCase(), D === "select" || D === "input" && A.type === "file")
            var De = Ku;
          else if (Vu(A))
            if ($u)
              De = Hm;
            else {
              De = Mm;
              var dt = Dm;
            }
          else
            D = A.nodeName, !D || D.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? T && ec(T.elementType) && (De = Ku) : De = qm;
          if (De && (De = De(e, T))) {
            Ju(
              te,
              De,
              l,
              J
            );
            break e;
          }
          dt && dt(e, A, T), e === "focusout" && T && A.type === "number" && T.memoizedProps.value != null && Pi(A, "number", A.value);
        }
        switch (dt = T ? Cs(T) : window, e) {
          case "focusin":
            (Vu(dt) || dt.contentEditable === "true") && (Jl = dt, mc = T, Ha = null);
            break;
          case "focusout":
            Ha = mc = Jl = null;
            break;
          case "mousedown":
            xc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            xc = !1, ld(te, l, J);
            break;
          case "selectionchange":
            if (Lm) break;
          case "keydown":
          case "keyup":
            ld(te, l, J);
        }
        var Ye;
        if (dc)
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
          Vl ? Xu(e, l) && (Fe = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (Fe = "onCompositionStart");
        Fe && (Yu && l.locale !== "ko" && (Vl || Fe !== "onCompositionStart" ? Fe === "onCompositionEnd" && Vl && (Ye = Mu()) : (el = J, nc = "value" in el ? el.value : el.textContent, Vl = !0)), dt = wi(T, Fe), 0 < dt.length && (Fe = new Bu(
          Fe,
          e,
          null,
          l,
          J
        ), te.push({ event: Fe, listeners: dt }), Ye ? Fe.data = Ye : (Ye = Zu(l), Ye !== null && (Fe.data = Ye)))), (Ye = Tm ? zm(e, l) : Am(e, l)) && (Fe = wi(T, "onBeforeInput"), 0 < Fe.length && (dt = new Bu(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), te.push({
          event: dt,
          listeners: Fe
        }), dt.data = Ye)), _x(
          te,
          e,
          T,
          l,
          J
        );
      }
      Eh(te, t);
    });
  }
  function fn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function wi(e, t) {
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
  function va(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Th(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var d = l, v = d.alternate, T = d.stateNode;
      if (d = d.tag, v !== null && v === a) break;
      d !== 5 && d !== 26 && d !== 27 || T === null || (v = T, n ? (T = Ta(l, i), T != null && c.unshift(
        fn(l, T, v)
      )) : n || (T = Ta(l, i), T != null && c.push(
        fn(l, T, v)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var kx = /\r\n?/g, Cx = /\u0000|\uFFFD/g;
  function zh(e) {
    return (typeof e == "string" ? e : "" + e).replace(kx, `
`).replace(Cx, "");
  }
  function Ah(e, t) {
    return t = zh(t), zh(e) === t;
  }
  function ki() {
  }
  function yt(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ql(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ql(e, "" + a);
        break;
      case "className":
        zn(e, "class", a);
        break;
      case "tabIndex":
        zn(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        zn(e, l, a);
        break;
      case "style":
        Ru(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          zn(e, "data", a);
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
        a = Un("" + a), e.setAttribute(l, a);
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
        a = Un("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = ki);
        break;
      case "onScroll":
        a != null && ht("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ht("scrollend", e);
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
        l = Un("" + a), e.setAttributeNS(
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
        ht("beforetoggle", e), ht("toggle", e), Tn(e, "popover", a);
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
        Tn(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = lm.get(l) || l, Tn(e, l, a));
    }
  }
  function Hr(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Ru(e, a, i);
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
        typeof a == "string" ? Ql(e, a) : (typeof a == "number" || typeof a == "bigint") && Ql(e, "" + a);
        break;
      case "onScroll":
        a != null && ht("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ht("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = ki);
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
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[Nt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Tn(e, l, a);
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
        ht("error", e), ht("load", e);
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
        ht("invalid", e);
        var d = i = c = n = null, v = null, T = null;
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
                  v = J;
                  break;
                case "defaultChecked":
                  T = J;
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
                  yt(e, t, a, J, l, null);
              }
          }
        Ou(
          e,
          i,
          d,
          v,
          T,
          c,
          n,
          !1
        ), An(e);
        return;
      case "select":
        ht("invalid", e), a = c = i = null;
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
                yt(e, t, n, d, l, null);
            }
        t = i, l = c, e.multiple = !!a, t != null ? Gl(e, !!a, t, !1) : l != null && Gl(e, !!a, l, !0);
        return;
      case "textarea":
        ht("invalid", e), i = n = a = null;
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
                yt(e, t, c, d, l, null);
            }
        zu(e, a, n, i), An(e);
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
        ht("beforetoggle", e), ht("toggle", e), ht("cancel", e), ht("close", e);
        break;
      case "iframe":
      case "object":
        ht("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < hn.length; a++)
          ht(hn[a], e);
        break;
      case "image":
        ht("error", e), ht("load", e);
        break;
      case "details":
        ht("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ht("error", e), ht("load", e);
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
        for (T in l)
          if (l.hasOwnProperty(T) && (a = l[T], a != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                yt(e, t, T, a, l, null);
            }
        return;
      default:
        if (ec(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Hr(
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
      l.hasOwnProperty(d) && (a = l[d], a != null && yt(e, t, d, a, l, null));
  }
  function Ex(e, t, l, a) {
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
        var n = null, i = null, c = null, d = null, v = null, T = null, J = null;
        for (D in l) {
          var te = l[D];
          if (l.hasOwnProperty(D) && te != null)
            switch (D) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                v = te;
              default:
                a.hasOwnProperty(D) || yt(e, t, D, null, a, te);
            }
        }
        for (var A in a) {
          var D = a[A];
          if (te = l[A], a.hasOwnProperty(A) && (D != null || te != null))
            switch (A) {
              case "type":
                i = D;
                break;
              case "name":
                n = D;
                break;
              case "checked":
                T = D;
                break;
              case "defaultChecked":
                J = D;
                break;
              case "value":
                c = D;
                break;
              case "defaultValue":
                d = D;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(o(137, t));
                break;
              default:
                D !== te && yt(
                  e,
                  t,
                  A,
                  D,
                  a,
                  te
                );
            }
        }
        Ii(
          e,
          c,
          d,
          v,
          T,
          J,
          i,
          n
        );
        return;
      case "select":
        D = c = d = A = null;
        for (i in l)
          if (v = l[i], l.hasOwnProperty(i) && v != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                D = v;
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
                A = i;
                break;
              case "defaultValue":
                d = i;
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
        t = d, l = c, a = D, A != null ? Gl(e, !!l, A, !1) : !!a != !!l && (t != null ? Gl(e, !!l, t, !0) : Gl(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        D = A = null;
        for (d in l)
          if (n = l[d], l.hasOwnProperty(d) && n != null && !a.hasOwnProperty(d))
            switch (d) {
              case "value":
                break;
              case "children":
                break;
              default:
                yt(e, t, d, null, a, n);
            }
        for (c in a)
          if (n = a[c], i = l[c], a.hasOwnProperty(c) && (n != null || i != null))
            switch (c) {
              case "value":
                A = n;
                break;
              case "defaultValue":
                D = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== i && yt(e, t, c, n, a, i);
            }
        Tu(e, A, D);
        return;
      case "option":
        for (var et in l)
          if (A = l[et], l.hasOwnProperty(et) && A != null && !a.hasOwnProperty(et))
            switch (et) {
              case "selected":
                e.selected = !1;
                break;
              default:
                yt(
                  e,
                  t,
                  et,
                  null,
                  a,
                  A
                );
            }
        for (v in a)
          if (A = a[v], D = l[v], a.hasOwnProperty(v) && A !== D && (A != null || D != null))
            switch (v) {
              case "selected":
                e.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                yt(
                  e,
                  t,
                  v,
                  A,
                  a,
                  D
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
        for (var We in l)
          A = l[We], l.hasOwnProperty(We) && A != null && !a.hasOwnProperty(We) && yt(e, t, We, null, a, A);
        for (T in a)
          if (A = a[T], D = l[T], a.hasOwnProperty(T) && A !== D && (A != null || D != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(o(137, t));
                break;
              default:
                yt(
                  e,
                  t,
                  T,
                  A,
                  a,
                  D
                );
            }
        return;
      default:
        if (ec(t)) {
          for (var _t in l)
            A = l[_t], l.hasOwnProperty(_t) && A !== void 0 && !a.hasOwnProperty(_t) && Hr(
              e,
              t,
              _t,
              void 0,
              a,
              A
            );
          for (J in a)
            A = a[J], D = l[J], !a.hasOwnProperty(J) || A === D || A === void 0 && D === void 0 || Hr(
              e,
              t,
              J,
              A,
              a,
              D
            );
          return;
        }
    }
    for (var C in l)
      A = l[C], l.hasOwnProperty(C) && A != null && !a.hasOwnProperty(C) && yt(e, t, C, null, a, A);
    for (te in a)
      A = a[te], D = l[te], !a.hasOwnProperty(te) || A === D || A == null && D == null || yt(e, t, te, A, a, D);
  }
  var Br = null, Lr = null;
  function Ci(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Rh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Uh(e, t) {
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
  function Yr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Gr = null;
  function Ox() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Gr ? !1 : (Gr = e, !0) : (Gr = null, !1);
  }
  var Dh = typeof setTimeout == "function" ? setTimeout : void 0, Tx = typeof clearTimeout == "function" ? clearTimeout : void 0, Mh = typeof Promise == "function" ? Promise : void 0, zx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Mh < "u" ? function(e) {
    return Mh.resolve(null).then(e).catch(Ax);
  } : Dh;
  function Ax(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function jl(e) {
    return e === "head";
  }
  function qh(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var c = e.ownerDocument;
            if (l & 1 && mn(c.documentElement), l & 2 && mn(c.body), l & 4)
              for (l = c.head, mn(l), c = l.firstChild; c; ) {
                var d = c.nextSibling, v = c.nodeName;
                c[Te] || v === "SCRIPT" || v === "STYLE" || v === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = d;
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
          Qr(l), ze(l);
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
  function Rx(e, t, l, a) {
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
      if (e = Ss(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Ux(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ss(e.nextSibling), e === null)) return null;
    return e;
  }
  function Xr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Dx(e, t) {
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
  var Zr = null;
  function Hh(e) {
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
  function Bh(e, t, l) {
    switch (t = Ci(l), e) {
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
  function mn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    ze(e);
  }
  var ys = /* @__PURE__ */ new Map(), Lh = /* @__PURE__ */ new Set();
  function Ei(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var $s = B.d;
  B.d = {
    f: Mx,
    r: qx,
    D: Hx,
    C: Bx,
    L: Lx,
    m: Yx,
    X: Qx,
    S: Gx,
    M: Xx
  };
  function Mx() {
    var e = $s.f(), t = gi();
    return e || t;
  }
  function qx(e) {
    var t = Xt(e);
    t !== null && t.tag === 5 && t.type === "form" ? no(t) : $s.r(e);
  }
  var pa = typeof document > "u" ? null : document;
  function Yh(e, t, l) {
    var a = pa;
    if (a && typeof t == "string" && t) {
      var n = ms(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Lh.has(n) || (Lh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), Wt(t, "link", e), Dt(t), a.head.appendChild(t)));
    }
  }
  function Hx(e) {
    $s.D(e), Yh("dns-prefetch", e, null);
  }
  function Bx(e, t) {
    $s.C(e, t), Yh("preconnect", e, t);
  }
  function Lx(e, t, l) {
    $s.L(e, t, l);
    var a = pa;
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
          i = ga(e);
          break;
        case "script":
          i = ba(e);
      }
      ys.has(i) || (e = R(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), ys.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(xn(i)) || t === "script" && a.querySelector(jn(i)) || (t = a.createElement("link"), Wt(t, "link", e), Dt(t), a.head.appendChild(t)));
    }
  }
  function Yx(e, t) {
    $s.m(e, t);
    var l = pa;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + ms(a) + '"][href="' + ms(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = ba(e);
      }
      if (!ys.has(i) && (e = R({ rel: "modulepreload", href: e }, t), ys.set(i, e), l.querySelector(n) === null)) {
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
        a = l.createElement("link"), Wt(a, "link", e), Dt(a), l.head.appendChild(a);
      }
    }
  }
  function Gx(e, t, l) {
    $s.S(e, t, l);
    var a = pa;
    if (a && e) {
      var n = Us(a).hoistableStyles, i = ga(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          xn(i)
        ))
          d.loading = 5;
        else {
          e = R(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = ys.get(i)) && Vr(e, l);
          var v = c = a.createElement("link");
          Dt(v), Wt(v, "link", e), v._p = new Promise(function(T, J) {
            v.onload = T, v.onerror = J;
          }), v.addEventListener("load", function() {
            d.loading |= 1;
          }), v.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Oi(c, t, a);
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
  function Qx(e, t) {
    $s.X(e, t);
    var l = pa;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ba(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = R({ src: e, async: !0 }, t), (t = ys.get(n)) && Jr(e, t), i = l.createElement("script"), Dt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Xx(e, t) {
    $s.M(e, t);
    var l = pa;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ba(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = R({ src: e, async: !0, type: "module" }, t), (t = ys.get(n)) && Jr(e, t), i = l.createElement("script"), Dt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Gh(e, t, l, a) {
    var n = (n = P.current) ? Ei(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = ga(l.href), l = Us(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = ga(l.href);
          var i = Us(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            xn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), ys.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, ys.set(e, l), i || Zx(
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
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ba(l), l = Us(
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
  function ga(e) {
    return 'href="' + ms(e) + '"';
  }
  function xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Qh(e) {
    return R({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Zx(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Wt(t, "link", l), Dt(t), e.head.appendChild(t));
  }
  function ba(e) {
    return '[src="' + ms(e) + '"]';
  }
  function jn(e) {
    return "script[async]" + e;
  }
  function Xh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + ms(l.href) + '"]'
          );
          if (a)
            return t.instance = a, Dt(a), a;
          var n = R({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Dt(a), Wt(a, "style", n), Oi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = ga(l.href);
          var i = e.querySelector(
            xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Dt(i), i;
          a = Qh(l), (n = ys.get(n)) && Vr(a, n), i = (e.ownerDocument || e).createElement("link"), Dt(i);
          var c = i;
          return c._p = new Promise(function(d, v) {
            c.onload = d, c.onerror = v;
          }), Wt(i, "link", a), t.state.loading |= 4, Oi(i, l.precedence, e), t.instance = i;
        case "script":
          return i = ba(l.src), (n = e.querySelector(
            jn(i)
          )) ? (t.instance = n, Dt(n), n) : (a = l, (n = ys.get(i)) && (a = R({}, l), Jr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), Dt(n), Wt(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Oi(a, l.precedence, e));
    return t.instance;
  }
  function Oi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Vr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Jr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Ti = null;
  function Zh(e, t, l) {
    if (Ti === null) {
      var a = /* @__PURE__ */ new Map(), n = Ti = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Ti, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
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
  function Vh(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Vx(e, t, l) {
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
  function Jh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var vn = null;
  function Jx() {
  }
  function Kx(e, t, l) {
    if (vn === null) throw Error(o(475));
    var a = vn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = ga(l.href), i = e.querySelector(
          xn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = zi.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, Dt(i);
          return;
        }
        i = e.ownerDocument || e, l = Qh(l), (n = ys.get(n)) && Vr(l, n), i = i.createElement("link"), Dt(i);
        var c = i;
        c._p = new Promise(function(d, v) {
          c.onload = d, c.onerror = v;
        }), Wt(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = zi.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function $x() {
    if (vn === null) throw Error(o(475));
    var e = vn;
    return e.stylesheets && e.count === 0 && Kr(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && Kr(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function zi() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Kr(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ai = null;
  function Kr(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ai = /* @__PURE__ */ new Map(), t.forEach(Wx, e), Ai = null, zi.call(e));
  }
  function Wx(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Ai.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Ai.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = zi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var pn = {
    $$typeof: $,
    Provider: null,
    Consumer: null,
    _currentValue: se,
    _currentValue2: se,
    _threadCount: 0
  };
  function Fx(e, t, l, a, n, i, c, d) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = x(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = x(0), this.hiddenUpdates = x(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = d, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Kh(e, t, l, a, n, i, c, d, v, T, J, te) {
    return e = new Fx(
      e,
      t,
      l,
      c,
      d,
      v,
      T,
      te
    ), t = 1, i === !0 && (t |= 24), i = cs(3, null, null, t), e.current = i, i.stateNode = e, t = Oc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Rc(i), e;
  }
  function $h(e) {
    return e ? (e = Fl, e) : Fl;
  }
  function Wh(e, t, l, a, n, i) {
    n = $h(n), a.context === null ? a.context = n : a.pendingContext = n, a = ll(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = al(e, a, t), l !== null && (hs(l, e, t), Ja(l, e, t));
  }
  function Fh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function $r(e, t) {
    Fh(e, t), (e = e.alternate) && Fh(e, t);
  }
  function Ih(e) {
    if (e.tag === 13) {
      var t = Wl(e, 67108864);
      t !== null && hs(t, e, 67108864), $r(e, 67108864);
    }
  }
  var Ri = !0;
  function Ix(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = B.p;
    try {
      B.p = 2, Wr(e, t, l, a);
    } finally {
      B.p = i, g.T = n;
    }
  }
  function Px(e, t, l, a) {
    var n = g.T;
    g.T = null;
    var i = B.p;
    try {
      B.p = 8, Wr(e, t, l, a);
    } finally {
      B.p = i, g.T = n;
    }
  }
  function Wr(e, t, l, a) {
    if (Ri) {
      var n = Fr(a);
      if (n === null)
        qr(
          e,
          t,
          a,
          Ui,
          l
        ), ef(e, a);
      else if (tj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (ef(e, a), t & 4 && -1 < ej.indexOf(e)) {
        for (; n !== null; ) {
          var i = Xt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = b(i.pendingLanes);
                  if (c !== 0) {
                    var d = i;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; c; ) {
                      var v = 1 << 31 - N(c);
                      d.entanglements[1] |= v, c &= ~v;
                    }
                    As(i), (pt & 6) === 0 && (vi = Be() + 500, on(0));
                  }
                }
                break;
              case 13:
                d = Wl(i, 2), d !== null && hs(d, i, 2), gi(), $r(i, 2);
            }
          if (i = Fr(a), i === null && qr(
            e,
            t,
            a,
            Ui,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        qr(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Fr(e) {
    return e = sc(e), Ir(e);
  }
  var Ui = null;
  function Ir(e) {
    if (Ui = null, e = st(e), e !== null) {
      var t = L(e);
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
    return Ui = e, null;
  }
  function Ph(e) {
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
        switch (Qe()) {
          case tt:
            return 2;
          case rt:
            return 8;
          case pe:
          case it:
            return 32;
          case Me:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Pr = !1, vl = null, pl = null, gl = null, gn = /* @__PURE__ */ new Map(), bn = /* @__PURE__ */ new Map(), bl = [], ej = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ef(e, t) {
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
    }, t !== null && (t = Xt(t), t !== null && Ih(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function tj(e, t, l, a, n) {
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
  function tf(e) {
    var t = st(e.target);
    if (t !== null) {
      var l = L(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Lt(e.priority, function() {
              if (l.tag === 13) {
                var a = os();
                a = xe(a);
                var n = Wl(l, a);
                n !== null && hs(n, l, a), $r(l, a);
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
  function Di(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Fr(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        tc = a, l.target.dispatchEvent(a), tc = null;
      } else
        return t = Xt(l), t !== null && Ih(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function sf(e, t, l) {
    Di(e) && l.delete(t);
  }
  function sj() {
    Pr = !1, vl !== null && Di(vl) && (vl = null), pl !== null && Di(pl) && (pl = null), gl !== null && Di(gl) && (gl = null), gn.forEach(sf), bn.forEach(sf);
  }
  function Mi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Pr || (Pr = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      sj
    )));
  }
  var qi = null;
  function lf(e) {
    qi !== e && (qi = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        qi === e && (qi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Ir(a || l) === null)
              continue;
            break;
          }
          var i = Xt(l);
          i !== null && (e.splice(t, 3), t -= 3, Ic(
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
    function t(v) {
      return Mi(v, e);
    }
    vl !== null && Mi(vl, e), pl !== null && Mi(pl, e), gl !== null && Mi(gl, e), gn.forEach(t), bn.forEach(t);
    for (var l = 0; l < bl.length; l++) {
      var a = bl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < bl.length && (l = bl[0], l.blockedOn === null); )
      tf(l), l.blockedOn === null && bl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[Nt] || null;
        if (typeof i == "function")
          c || lf(l);
        else if (c) {
          var d = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[Nt] || null)
              d = c.formAction;
            else if (Ir(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), lf(l);
        }
      }
  }
  function eu(e) {
    this._internalRoot = e;
  }
  Hi.prototype.render = eu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = os();
    Wh(l, a, e, t, null, null);
  }, Hi.prototype.unmount = eu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Wh(e.current, 2, null, e, null, null), gi(), t[p] = null;
    }
  };
  function Hi(e) {
    this._internalRoot = e;
  }
  Hi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ct();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < bl.length && t !== 0 && t < bl[l].priority; l++) ;
      bl.splice(l, 0, e), l === 0 && tf(e);
    }
  };
  var af = h.version;
  if (af !== "19.1.0")
    throw Error(
      o(
        527,
        af,
        "19.1.0"
      )
    );
  B.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = G(t), e = e !== null ? j(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var lj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: g,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bi.isDisabled && Bi.supportsFiber)
      try {
        F = Bi.inject(
          lj
        ), we = Bi;
      } catch {
      }
  }
  return Sn.createRoot = function(e, t) {
    if (!Y(e)) throw Error(o(299));
    var l = !1, a = "", n = bo, i = yo, c = _o, d = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (d = t.unstable_transitionCallbacks)), t = Kh(
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
    ), e[p] = t.current, Mr(e), new eu(t);
  }, Sn.hydrateRoot = function(e, t, l) {
    if (!Y(e)) throw Error(o(299));
    var a = !1, n = "", i = bo, c = yo, d = _o, v = null, T = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (d = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (v = l.unstable_transitionCallbacks), l.formState !== void 0 && (T = l.formState)), t = Kh(
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
      v,
      T
    ), t.context = $h(null), l = t.current, a = os(), a = xe(a), n = ll(a), n.callback = null, al(l, n, a), l = a, t.current.lanes = l, de(t, l), As(t), e[p] = t.current, Mr(e), new Hi(t);
  }, Sn.version = "19.1.0", Sn;
}
var xf;
function fj() {
  if (xf) return su.exports;
  xf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), su.exports = hj(), su.exports;
}
var mj = fj(), r = yu();
const cu = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function xj({ api: u, projects: h }) {
  var Ie;
  const [S, o] = r.useState(((Ie = h[0]) == null ? void 0 : Ie.id) || ""), [Y, L] = r.useState([]), [V, H] = r.useState("general_inspection"), [G, j] = r.useState("现场质量安全检查"), [R, K] = r.useState("general,通用施工检查"), [k, le] = r.useState(cu.map((Q) => Q[0])), [fe, ye] = r.useState(!1), [_e, Ee] = r.useState(!1), [me, $] = r.useState(""), [oe, ie] = r.useState(""), [M, je] = r.useState(0), Ue = h.find((Q) => Q.id === S), Le = Ue != null && Ue.permissions ? Ue.permissions.includes("knowledge.process") : Ue == null ? void 0 : Ue.can_run, Xe = Ue != null && Ue.permissions ? Ue.permissions.includes("knowledge.review") : Ue == null ? void 0 : Ue.can_manage;
  r.useEffect(() => {
    let Q = !1;
    return L([]), $(""), S && u(`/scenes?project_id=${encodeURIComponent(S)}`).then((ue) => {
      Q || L(ue.items);
    }).catch((ue) => {
      Q || $(ue.message);
    }), () => {
      Q = !0;
    };
  }, [S, M]);
  const He = async (Q) => {
    Ee(!0), $(""), ie("");
    try {
      await Q(), je((ue) => ue + 1);
    } catch (ue) {
      $(ue.message);
    } finally {
      Ee(!1);
    }
  }, he = (Q) => {
    H(Q.code), j(Q.payload.name), K(Q.payload.categories.map((ue) => ue.code + "," + ue.name).join(`
`)), le(Q.payload.steps.map((ue) => ue.event_type)), ye(Q.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      me && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: me }),
      oe && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: oe }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: S, onChange: (Q) => o(Q.target.value), children: h.map((Q) => /* @__PURE__ */ s.jsx("option", { value: Q.id, children: Q.name }, Q.id)) })
      ] }),
      Le && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: V, onChange: (Q) => H(Q.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: G, onChange: (Q) => j(Q.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: R, onChange: (Q) => K(Q.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          cu.map((Q) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(Q[0]), onChange: (ue) => le((g) => ue.target.checked ? [...g, Q[0]] : g.filter((B) => B !== Q[0])) }),
            Q[1]
          ] }, Q[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: fe, onChange: (Q) => ye(Q.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: _e || !S || !k.length, onClick: () => void He(async () => {
          const Q = Y.filter((g) => g.code === V).sort((g, B) => B.version - g.version)[0], ue = R.split(`
`).filter((g) => g.trim()).map((g) => {
            const [B, se] = g.split(/[,，]/);
            if (!(B != null && B.trim()) || !(se != null && se.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const Ne = Q == null ? void 0 : Q.payload.categories.find((f) => f.code === B.trim());
            return { code: B.trim(), name: se.trim(), focus: (Ne == null ? void 0 : Ne.focus) || "", keywords: (Ne == null ? void 0 : Ne.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: S, code: V, expected_version: (Q == null ? void 0 : Q.version) || 0, payload: { name: G, categories: ue, steps: cu.filter((g) => k.includes(g[0])).map((g) => ({ event_type: g[0], name: g[1], scope: g[2] })), compare_deadline: fe } }) }), ie("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      Y.map((Q) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
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
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => he(Q), children: "以此版本编辑" }),
        Xe && !Q.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: _e, onClick: () => void He(async () => {
          var ue;
          await u(`/scenes/${Q.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((ue = Y.find((g) => g.code === Q.code && g.active)) == null ? void 0 : ue.id) || null }) }), ie("场景版本已启用。");
        }), children: "启用此版本" }),
        Le && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: _e, onClick: () => void He(async () => {
          var g;
          const ue = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(S)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: S, expected_version: ((g = ue.items[0]) == null ? void 0 : g.version) || 0, categories: Q.payload.categories }) }), ie("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, Q.id))
    ] })
  ] });
}
const ru = {}, _u = window.location.pathname.startsWith("/quality/b/"), ka = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), jf = ru == null ? void 0 : ru.VITE_B_PLATFORM_MODE, Ot = ka || _u && (jf === "true" || jf !== "false" && !0);
function Li() {
  if (!_u && !ka) return window.location.pathname;
  const u = ka ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function jj(u) {
  ka ? window.history.pushState({}, "", "/quality/#/b" + u) : _u ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), ka && window.dispatchEvent(new Event("platform-route"));
}
async function Ut(u, h = {}) {
  if (!Ot) return fetch(u, h);
  if (!u.startsWith("/api/v1/") && !u.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const S = new Headers(h.headers);
  S.delete("Authorization");
  const o = window.QaxcProjectId;
  ka && o && S.set("X-Project-ID", o);
  const Y = (h.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(Y)) {
    const V = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (V.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !V.ok) throw new Error(V.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const H = await V.json(), G = H.csrf_token ?? H.token;
    if (typeof G != "string" || !G) throw new Error("安全校验返回格式不正确。");
    S.set("X-CSRF-Token", G);
  }
  const L = await fetch("/quality/b" + u, { ...h, headers: S, credentials: "same-origin" });
  return L.status === 401 && window.dispatchEvent(new Event("b-session-expired")), L;
}
const vf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, pf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, vu = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), vj = (u) => ({
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
  clauses: [vu()]
}), ya = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function uu(u, h) {
  var S;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((S = u == null ? void 0 : u.roles) != null && S.includes("reviewer"));
}
function pj({ api: u, projects: h, identity: S }) {
  var pe, it, Me;
  const [o, Y] = r.useState(((pe = h[0]) == null ? void 0 : pe.id) || ""), [L, V] = r.useState([]), [H, G] = r.useState(null), [j, R] = r.useState(null), [K, k] = r.useState(!1), [le, fe] = r.useState(!1), [ye, _e] = r.useState(!1), [Ee, me] = r.useState(""), [$, oe] = r.useState(""), [ie, M] = r.useState(""), [je, Ue] = r.useState(null), [Le, Xe] = r.useState(0), [He, he] = r.useState(""), [Ie, Q] = r.useState(!1), [ue, g] = r.useState(""), [B, se] = r.useState("current_rectification"), [Ne, f] = r.useState(""), [q, I] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [Z, ne] = r.useState(null), X = r.useRef(crypto.randomUUID()), P = r.useRef(0), Oe = h.find((O) => O.id === o), ae = uu(Oe, "knowledge.process"), Ce = uu(Oe, "knowledge.review"), Ge = uu(Oe, "knowledge.publish"), Pe = ae || Ce || Ge;
  r.useEffect(() => {
    const O = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", O), () => window.removeEventListener("beforeunload", O);
  }, [K]), r.useEffect(() => {
    let O = !1;
    if (_e(!0), me(""), V([]), Ue(null), !o) {
      _e(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(o)}&view=${Pe ? "manage" : "published"}${ie ? "&cursor=" + encodeURIComponent(ie) : ""}`).then((w) => {
      O || (V(w.items), Ue(w.next_cursor));
    }).catch((w) => {
      O || me(w.message);
    }).finally(() => {
      O || _e(!1);
    }), () => {
      O = !0;
    };
  }, [o, Pe, ie, Le]), r.useEffect(() => () => {
    P.current++;
  }, []);
  const Ze = async (O) => {
    fe(!0), me(""), oe("");
    try {
      await O();
    } catch (w) {
      me(w.message);
    } finally {
      fe(!1);
    }
  }, Ve = () => {
    var O;
    k(!1), (O = window.QaxcClearPendingEdits) == null || O.call(window);
  }, Ae = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), Re = (O) => {
    R((w) => w && { ...w, ...O }), k(!0), X.current = crypto.randomUUID();
  }, Se = (O, w) => {
    j && Re({ clauses: j.clauses.map((F, we) => we === O ? { ...F, ...w } : F) });
  }, Be = async (O) => {
    if (!Ae()) return;
    const w = ++P.current;
    await Ze(async () => {
      const F = await u("/standards/" + O.id);
      w === P.current && (G(F), R(null), Ve(), ne(null), he(""), Q(!1));
    });
  }, Qe = () => {
    if (!H || !Ae()) return;
    const { id: O, version: w, row_version: F, state: we, source_available: qe, verified_on: N, history: ee, clauses: z, ...re } = H;
    R({
      project_id: re.project_id,
      code: re.code,
      edition: re.edition,
      title: re.title,
      source_asset_id: re.source_asset_id,
      valid_from: re.valid_from,
      valid_until: re.valid_until,
      scope: re.scope,
      maintainer: re.maintainer,
      expected_version: w,
      reason: "修订说明待填写",
      clauses: (z || []).map((ce) => Object.fromEntries(Object.keys(vu()).map((Je) => [Je, ce[Je]])))
    }), g("沿用已绑定原件；原文变化时请重新上传"), k(!0), X.current = crypto.randomUUID();
  }, tt = (O) => void Ze(async () => {
    if (!H) return;
    const w = await u(`/standards/${H.id}/actions`, { method: "POST", body: JSON.stringify({ action: O, row_version: H.row_version, reason: He, evidence_checked: Ie }) });
    G({ ...H, ...w }), Ve(), Xe((F) => F + 1), oe(pf[O] + "成功。"), he(""), Q(!1), H.source_available !== !1 && G(await u("/standards/" + H.id));
  }), rt = () => void Ze(async () => {
    if (!H) return;
    const O = await Ut(`/api/v1/standards/${H.id}/source`, { headers: { Authorization: `Bearer dev-${S}` } });
    if (!O.ok) {
      const qe = await O.json();
      throw new Error(qe.message || "原件不可用。");
    }
    const w = await O.blob(), F = URL.createObjectURL(w), we = document.createElement("a");
    we.href = F, we.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), we.click(), setTimeout(() => URL.revokeObjectURL(F), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Ee && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Ee,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le, onClick: () => Xe((O) => O + 1), children: "刷新列表" })
    ] }),
    $ && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: $ }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: le, value: o, onChange: (O) => {
          Ae() && (P.current++, Y(O.target.value), G(null), R(null), k(!1), M(""), ne(null));
        }, children: h.map((O) => /* @__PURE__ */ s.jsx("option", { value: O.id, children: O.name }, O.id)) })
      ] }),
      ae && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !o, onClick: () => {
        Ae() && (R(vj(o)), G(null), g(""), k(!1), X.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || ye, onClick: () => Xe((O) => O + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    ye ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !L.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        Pe ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      L.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: O.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            O.code,
            " · ",
            O.edition,
            " · 修订 ",
            O.version,
            " · ",
            vf[O.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            O.valid_from,
            "；",
            O.valid_until ? "自 " + O.valid_until + " 起不再适用" : "未登记废止日期",
            O.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le, onClick: () => void Be(O), children: "查看与核验" }),
        Ge && O.source_available === !1 && ["published", "approved", "superseded"].includes(O.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le, onClick: () => {
          G(O), R(null), Q(!1), he("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, O.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ie || le, onClick: () => M(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !je || le, onClick: () => M(je || ""), children: "下一页" })
      ] })
    ] }) }),
    j && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (O) => {
      O.preventDefault(), Ze(async () => {
        if (!j.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...j, scope: Object.fromEntries(Object.entries(j.scope).map(([we, qe]) => [we, ya(qe.join(`
`))])), clauses: j.clauses.map((we) => ({
          ...we,
          preconditions: ya(we.preconditions.join(`
`)),
          exceptions: ya(we.exceptions.join(`
`)),
          tables: ya(we.tables.join(`
`)),
          notes: ya(we.notes.join(`
`)),
          references: ya(we.references.join(`
`))
        })) }, F = await u("/standards", { method: "POST", headers: { "Idempotency-Key": X.current }, body: JSON.stringify(w) });
        Ve(), R(null), G(await u("/standards/" + F.id)), Xe((we) => we + 1), oe("规范草稿已保存，需核验后发布。");
      });
    }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h3", { children: j.expected_version ? "修订规范" : "登记规范" }),
        /* @__PURE__ */ s.jsx("span", { children: "原件和已保存版本保留不变" })
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { className: "proof-body", disabled: le, children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范名称",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: j.title, onChange: (O) => Re({ title: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: j.code, readOnly: j.expected_version > 0, onChange: (O) => Re({ code: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: j.edition, readOnly: j.expected_version > 0, onChange: (O) => Re({ edition: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: j.maintainer, onChange: (O) => Re({ maintainer: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: j.valid_from, onChange: (O) => Re({ valid_from: O.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: j.valid_until || "", onChange: (O) => Re({ valid_until: O.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (O) => {
            var F;
            const w = (F = O.target.files) == null ? void 0 : F[0];
            w && Ze(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const we = await u(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              Re({ source_asset_id: we.asset_id }), g(w.name), oe("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: ue || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([O, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: j.scope[O].join(`
`), onChange: (F) => Re({ scope: { ...j.scope, [O]: F.target.value.split(`
`) } }) })
          ] }, O)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        j.clauses.map((O, w) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            w + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: O.number, onChange: (F) => Se(w, { number: F.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: O.chapter, onChange: (F) => Se(w, { chapter: F.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: O.parent_number || "", onChange: (F) => Se(w, { parent_number: F.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: O.page || "", onChange: (F) => Se(w, { page: F.target.value ? Number(F.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: O.locator, onChange: (F) => Se(w, { locator: F.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: O.text, onChange: (F) => Se(w, { text: F.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([F, we]) => /* @__PURE__ */ s.jsxs("label", { children: [
              we,
              /* @__PURE__ */ s.jsx("textarea", { value: O[F].join(`
`), onChange: (qe) => Se(w, { [F]: qe.target.value.split(`
`) }) })
            ] }, F))
          ] }),
          j.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => Re({ clauses: j.clauses.filter((F, we) => we !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: j.clauses.length >= 200, onClick: () => Re({ clauses: [...j.clauses, vu()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: j.reason, onChange: (O) => Re({ reason: O.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !j.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Ae() && (R(null), k(!1));
        }, children: "取消编辑" })
      ] })
    ] }),
    H && !j && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { children: H.title }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          H.code,
          " · ",
          H.edition,
          " · 修订 ",
          H.version,
          " · ",
          vf[H.state]
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
        /* @__PURE__ */ s.jsxs("p", { children: [
          "维护人：",
          H.maintainer,
          "；核验日期：",
          H.verified_on || "尚未核验",
          "。有效区间：",
          H.valid_from,
          " 至 ",
          H.valid_until || "未登记废止日期",
          "。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le || H.source_available === !1, onClick: rt, children: "下载核对原件" }),
          ae && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || !H.clauses, onClick: Qe, children: "以此版本修订" })
        ] }),
        (it = H.clauses) == null ? void 0 : it.map((O) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
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
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, F]) => O[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: F }),
            O[w].map((we, qe) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: we }, qe))
          ] }, w))
        ] }, O.number)),
        H.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: B, onChange: (O) => {
              se(O.target.value), ne(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          B === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ne, onChange: (O) => {
              f(O.target.value), ne(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([O, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: q[O], onChange: (F) => {
              I({ ...q, [O]: F.target.value }), ne(null);
            } })
          ] }, O)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le, onClick: () => void Ze(async () => {
            ne(await u(`/standards/${H.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: B, event_date: Ne || null, ...q }) }));
          }), children: "核对条件" }),
          Z && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[Z.status] }),
            Z.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              Z.missing.map((O) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[O] || O).join("、")
            ] }),
            Z.reasons.map((O) => /* @__PURE__ */ s.jsx("p", { children: O }, O)),
            /* @__PURE__ */ s.jsx("p", { children: Z.note })
          ] })
        ] }),
        Pe && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: le, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: He, maxLength: 2e3, onChange: (O) => he(O.target.value) })
          ] }),
          H.state === "pending_review" && Ce && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ie, onChange: (O) => Q(O.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            H.state === "draft" && ae && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim(), onClick: () => tt("submit"), children: "提交审核" }),
            H.state === "pending_review" && Ce && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim() || !Ie, onClick: () => tt("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !He.trim(), onClick: () => tt("request_changes"), children: "退回修改" })
            ] }),
            H.state === "approved" && Ge && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !He.trim(), onClick: () => tt("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(H.state) && Ge && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !He.trim(), onClick: () => tt("withdraw"), children: "撤回此版本" })
          ] }),
          H.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (Me = H.history) == null ? void 0 : Me.map((O, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            pf[O.action] || O.action,
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
const Ca = { kind: "asset", id: "", quote: "", locator: "" }, Gf = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ca] }, Qf = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Xf = { text: "", nature: "fact", evidence: [Ca] }, Zf = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ca] }, gj = { name: "", value: null, evidence: [Ca] }, gf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Qf] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Gf] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Xf], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [Zf], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ca, kind: "work" }], historical_case_ids: [] }
}, bj = { evidence: Ca, records: Gf, categories: Qf, claims: Xf, steps: Zf, parameters: gj }, Na = {
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
}, yj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function Vi({ value: u, onChange: h, catalog: S, name: o = "", path: Y = "content", readonly: L = !1 }) {
  var j;
  const V = Na[o] || o;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((R, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(Vi, { value: R, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: Y + "." + K, catalog: S, readonly: L, onChange: (k) => h(u.map((le, fe) => fe === K ? k : le)) }),
      !L && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, le) => K !== le)), children: "移除" })
    ] }, K)),
    !L && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(bj[o] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([R, K]) => R === "kind" && Y === "content" ? null : /* @__PURE__ */ s.jsx(Vi, { name: R, value: K, path: Y + "." + R, catalog: S, readonly: L, onChange: (k) => {
    const le = { ...u, [R]: k };
    R === "type" && ["judgment", "case"].includes(String(k)) && (le.options = {}), R === "kind" && "id" in u && (le.id = ""), h(le);
  } }, R)) });
  let H = yj[o];
  o === "kind" && (H = Y.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (H = Y.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const G = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in G || o === "historical_case_id") && (H = S.filter((R) => o in G ? R.work_kind === G[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(R.work_kind || "") : !0).map((R) => [R.id, R.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: Y, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    L ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((j = H == null ? void 0 : H.find((R) => R[0] === String(u))) == null ? void 0 : j[1]) || String(u ?? "待填") }) : H ? /* @__PURE__ */ s.jsxs("select", { id: Y, value: String(u ?? ""), onChange: (R) => h(R.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      H.map(([R, K]) => /* @__PURE__ */ s.jsx("option", { value: R, children: K }, R))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: Y, type: "date", value: String(u ?? ""), onChange: (R) => h(R.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: Y, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(u ?? ""), onChange: (R) => h(R.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : R.target.value) })
  ] });
}
const bf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, yf = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function _j({ api: u, projects: h, identity: S }) {
  var O;
  const [o, Y] = r.useState(((O = h[0]) == null ? void 0 : O.id) || ""), [L, V] = r.useState("hazard"), [H, G] = r.useState([]), [j, R] = r.useState([]), [K, k] = r.useState(null), [le, fe] = r.useState(null), [ye, _e] = r.useState(""), [Ee, me] = r.useState(!1), [$, oe] = r.useState(""), [ie, M] = r.useState(""), [je, Ue] = r.useState(!1), [Le, Xe] = r.useState(!1), [He, he] = r.useState(0), [Ie, Q] = r.useState(null), [ue, g] = r.useState(""), [B, se] = r.useState(null), [Ne, f] = r.useState(null), [q, I] = r.useState(null), [Z, ne] = r.useState(null), X = r.useRef(crypto.randomUUID()), P = r.useRef(0), Oe = r.useRef(!1), ae = h.find((w) => w.id === o), Ce = (w) => {
    var F, we;
    return ae != null && ae.permissions ? ae.permissions.includes(w) : w.startsWith("training.") ? !!((F = ae == null ? void 0 : ae.roles) != null && F.some((qe) => ["admin", "teacher"].includes(qe))) : w === "knowledge.process" ? !!(ae != null && ae.can_run) : !!(ae != null && ae.can_manage) || !!((we = ae == null ? void 0 : ae.roles) != null && we.includes("reviewer"));
  }, Ge = Ce(L === "question" ? "training.manage" : "knowledge.process"), Pe = Ce(L === "question" ? "training.review" : "knowledge.review"), Ze = Ce(L === "question" ? "training.review" : "knowledge.publish"), Ve = Ge || Pe || Ze, Ae = () => {
    var w;
    Oe.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, Re = () => !Oe.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (F) => {
      Oe.current && (F.preventDefault(), F.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Xe(!0), G([]), oe(""), !o) {
      Xe(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(o)}&kind=${L}&view=${Ve ? "manage" : "published"}${ue ? "&cursor=" + encodeURIComponent(ue) : ""}`).then((F) => {
      w || (G(F.items), Q(F.next_cursor));
    }).catch((F) => {
      w || oe(F.message);
    }).finally(() => {
      w || Xe(!1);
    }), Ve && u(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((F) => {
      w || R(F.items);
    }).catch((F) => {
      w || oe(F.message);
    }), L === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((F) => {
      w || se(F);
    }).catch((F) => {
      w || oe(F.message);
    }), () => {
      w = !0;
    };
  }, [o, L, ue, Ve, He]), r.useEffect(() => () => {
    P.current++;
  }, []);
  const Se = async (w) => {
    Ue(!0), oe(""), M("");
    try {
      await w();
    } catch (F) {
      oe(F.message);
    } finally {
      Ue(!1);
    }
  }, Be = () => {
    P.current++, k(null), fe(null), f(null), I(null), ne(null), g(""), _e(""), me(!1), Ae();
  }, Qe = async (w) => {
    if (!Re()) return;
    const F = ++P.current;
    await Se(async () => {
      const we = await u("/workflows/" + w.id);
      F === P.current && (k(we), fe(null), _e(""), me(!1), I(null), ne(null), Ae());
    });
  }, tt = (w) => {
    fe((F) => F && { ...F, ...w }), Oe.current = !0, X.current = crypto.randomUUID();
  }, rt = () => Se(async () => {
    if (!le) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": X.current }, body: JSON.stringify({ ...le, project_id: o, reason: ye }) });
    k(w), fe(null), Ae(), he((F) => F + 1), M("已保存新版本，尚未审核发布。");
  }), pe = (w, F) => Se(async () => {
    const we = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: F, row_version: w.row_version, reason: ye, evidence_checked: Ee }) });
    k(F === "withdraw" ? null : await u("/workflows/" + we.id)), he((qe) => qe + 1), Ae(), M(yf[F] + "已完成");
  }), it = (w) => Se(async () => {
    const F = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(w)}&limit=100`);
    f(F.items);
  }), Me = () => Se(async () => {
    if (!K) return;
    const w = await Ut("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + S } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const F = URL.createObjectURL(await w.blob()), we = document.createElement("a");
    we.href = F, we.download = K.title + ".docx", we.click(), setTimeout(() => URL.revokeObjectURL(F), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: je, onChange: (w) => {
          Re() && (Be(), Y(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => he((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(gf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: je, className: "button " + (L === w ? "primary" : "ghost"), onClick: () => {
      Re() && (Be(), V(w));
    }, children: Na[w] }, w)) }),
    $ && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: $ }),
    ie && /* @__PURE__ */ s.jsx("p", { role: "status", children: ie }),
    L === "hazard" && B && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "隐患分类分析" }),
      /* @__PURE__ */ s.jsxs("div", { className: "wf-counts", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "事件 ",
          /* @__PURE__ */ s.jsx("strong", { children: B.event_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "检查记录 ",
          /* @__PURE__ */ s.jsx("strong", { children: B.inspection_record_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "项目 ",
          /* @__PURE__ */ s.jsx("strong", { children: B.project_count })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "来源待核实 ",
          /* @__PURE__ */ s.jsx("strong", { children: B.unavailable_count })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: B.definition }),
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: B.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: je, onClick: () => it(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      Ne && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        Ne.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Qe(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Na[L],
          "清单"
        ] }),
        Ge && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: je, onClick: () => {
          Re() && (Be(), fe({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(gf[L]) }), Oe.current = !0, X.current = crypto.randomUUID());
        }, children: [
          "新建",
          Na[L]
        ] })
      ] }),
      Le ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : H.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Na[L],
        "。",
        Ge ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: H.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: je || w.source_available === !1, onClick: () => Qe(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          bf[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        Ze && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => pe(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        ue && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(""), children: "首页" }),
        Ie && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => g(Ie), children: "下一页" })
      ] })
    ] }),
    le && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Na[L],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: je, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: le.title, onChange: (w) => tt({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(Vi, { value: le.content, catalog: j, onChange: (w) => tt({ content: w }) })
      ] })
    ] }),
    K && !le && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        bf[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        Ge && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => {
          fe({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), Oe.current = !0, X.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: Me, children: "导出Word" }),
        Ce("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Se(async () => {
          I((await u(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        L === "guide" && K.state === "published" && Ce("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Se(async () => ne(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        L === "question" && K.state === "published" && Ge && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je, onClick: () => Se(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), M("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      q && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        q.length ? q.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      Z && /* @__PURE__ */ s.jsx("ul", { children: Z.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(Vi, { value: K.content, catalog: j, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((w, F) => /* @__PURE__ */ s.jsxs("p", { children: [
          yf[w.action] || w.action,
          "：",
          w.reason
        ] }, F))
      ] })
    ] }),
    Ve && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: ye, onChange: (w) => _e(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      le ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim() || !le.title.trim(), onClick: rt, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee, onChange: (w) => me(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && Ge && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim(), onClick: () => pe(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && Pe && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !Ee || !ye.trim(), onClick: () => pe(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => pe(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && Ze && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim(), onClick: () => pe(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && Ze && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => pe(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const _f = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Nj({ id: u, identity: h, projects: S, navigate: o }) {
  const [Y, L] = r.useState(null), [V, H] = r.useState(""), [G, j] = r.useState(!1), [R, K] = r.useState(""), [k, le] = r.useState(0), fe = `a-import-action:${h}:${u}`;
  async function ye(me, $) {
    const oe = await Ut("/integration/v1/a-imports/" + u + me, $), ie = await oe.json().catch(() => ({}));
    if (!oe.ok)
      throw oe.status >= 400 && oe.status < 500 && sessionStorage.removeItem(fe), new Error(ie.message || `请求未完成（${oe.status}），请刷新查看最新状态。`);
    return ie;
  }
  r.useEffect(() => {
    let me = !1;
    async function $() {
      try {
        const ie = await ye("");
        me || (L(ie), H(""));
      } catch (ie) {
        me || (L(null), H(ie.message));
      }
    }
    L(null), $();
    const oe = window.setInterval($, 3e3);
    return () => {
      me = !0, clearInterval(oe);
    };
  }, [u, k, h]);
  const _e = (me) => {
    var $, oe;
    return !!Y && !!((oe = ($ = S.find((ie) => ie.id === Y.project_id)) == null ? void 0 : $.permissions) != null && oe.includes(me));
  };
  async function Ee(me) {
    if (!(!Y || G)) {
      j(!0), H("");
      try {
        const $ = sessionStorage.getItem(fe), oe = $ ? JSON.parse($) : { operation: me, key: crypto.randomUUID(), body: { expected_version: Y.version, ...me === "withdraw" ? { reason: R.trim() } : {} } };
        if (oe.operation !== me) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(fe, JSON.stringify(oe)), await ye("/" + me, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": oe.key }, body: JSON.stringify(oe.body) }), sessionStorage.removeItem(fe), le((ie) => ie + 1);
      } catch ($) {
        H($.message);
      } finally {
        j(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => le((me) => me + 1), disabled: G, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      V && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: V }),
      Y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ s.jsxs("dd", { children: [
              "v",
              Y.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: _f[Y.status] || Y.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: _f[Y.retrospective_status] || Y.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          Y.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        Y.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: Y.error.message }),
        Y.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: Y.warnings.map((me, $) => /* @__PURE__ */ s.jsx("li", { children: me.message }, me.code + ":" + $)) })
        ] }),
        Y.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          Y.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          Y.capabilities.can_view_materials && Y.receipt_id && _e("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + Y.receipt_id), children: "查看原始资料" }),
          Y.capabilities.can_generate_retrospective && _e("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: G, onClick: () => void Ee("retrospectives"), children: Y.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          Y.retrospective_id && Y.status !== "withdrawn" && _e("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + Y.retrospective_id), children: "查看复盘" }),
          (Y.status === "failed" || Y.retrospective_status === "failed") && _e("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: G, onClick: () => void Ee("retry"), children: "重试失败任务" })
        ] }),
        Y.status !== "withdrawn" && _e("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: R, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (me) => K(me.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: G || !R.trim(), onClick: () => void Ee("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Sj({ navigate: u }) {
  const [h, S] = r.useState([]), [o, Y] = r.useState(""), [L, V] = r.useState(!1);
  return r.useEffect(() => {
    let H = !1;
    return (async () => {
      try {
        const [G, j, R] = await Promise.all([Ut("/api/v1/health"), Ut("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!G.ok || !j.ok || !R.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, le] = await Promise.all([G.json(), j.json(), R.json()]), fe = window.QaxcProjectId, ye = le.tasks.filter((_e) => !fe || _e.projectId === fe).flatMap((_e) => (_e.events || []).map((Ee) => ({ id: Ee.id, action: _e.title + " · " + Ee.action, project_id: _e.projectId, created_at: Ee.uploadedAt, source: "现场作业" })));
        H || (V(K.worker_online), S([...ye, ...k.items.map((_e) => ({ ..._e, source: "知识与学习" }))].sort((_e, Ee) => Date.parse(Ee.created_at) - Date.parse(_e.created_at)).slice(0, 100)));
      } catch (G) {
        H || Y(G.message);
      }
    })(), () => {
      H = !0;
    };
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ s.jsxs("p", { role: "status", children: [
      "后台处理：",
      L ? "在线" : "未连接或正在读取",
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
        /* @__PURE__ */ s.jsx("tbody", { children: h.map((H) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(H.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: H.source }),
          /* @__PURE__ */ s.jsx("td", { children: H.action })
        ] }, H.source + H.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function wj({ deliveryId: u, navigate: h }) {
  const [S, o] = r.useState(!1), [Y, L] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function H(j, R, K) {
    const k = await Ut("/api/v1" + j, { method: R ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: R ? JSON.stringify(R) : void 0 }), le = await k.json();
    if (!k.ok) throw Error(le.message || "处理失败，请重试");
    return le;
  }
  async function G() {
    if (S) return;
    o(!0);
    const j = "archive-review:" + u, R = sessionStorage.getItem(j) || crypto.randomUUID();
    sessionStorage.setItem(j, R);
    try {
      L("正在核验归档成果…");
      const K = await H("/platform-archives", { delivery_id: u }, R);
      for (let k = 0; k < 60 && V.current; k++) {
        const le = await H("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (le.status === "ready") {
          L("证据已校验，正在生成复盘…");
          const fe = await H("/retrospectives", { mode: "task_process", task_package_id: le.id });
          V.current && h("/retrospectives/" + fe.id);
          return;
        }
        if (["failed", "withdrawn"].includes(le.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        L("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((fe) => setTimeout(fe, 1e3));
      }
      V.current && L("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      V.current && L(K.message);
    } finally {
      V.current && o(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: Y }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: S, onClick: () => void G(), children: "生成 / 打开复盘" }),
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
const kj = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Cj = (u) => u.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (h, S, o) => o ? o.toUpperCase() : S.toLowerCase()
), Nf = (u) => {
  const h = Cj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, Vf = (...u) => u.filter((h, S, o) => !!h && h.trim() !== "" && o.indexOf(h) === S).join(" ").trim(), Ej = (u) => {
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
var Oj = {
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
const Tj = r.forwardRef(
  ({
    color: u = "currentColor",
    size: h = 24,
    strokeWidth: S = 2,
    absoluteStrokeWidth: o,
    className: Y = "",
    children: L,
    iconNode: V,
    ...H
  }, G) => r.createElement(
    "svg",
    {
      ref: G,
      ...Oj,
      width: h,
      height: h,
      stroke: u,
      strokeWidth: o ? Number(S) * 24 / Number(h) : S,
      className: Vf("lucide", Y),
      ...!L && !Ej(H) && { "aria-hidden": "true" },
      ...H
    },
    [
      ...V.map(([j, R]) => r.createElement(j, R)),
      ...Array.isArray(L) ? L : [L]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kt = (u, h) => {
  const S = r.forwardRef(
    ({ className: o, ...Y }, L) => r.createElement(Tj, {
      ref: L,
      iconNode: h,
      className: Vf(
        `lucide-${kj(Nf(u))}`,
        `lucide-${u}`,
        o
      ),
      ...Y
    })
  );
  return S.displayName = Nf(u), S;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], Sf = kt("activity", zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Aj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], wf = kt("arrow-left", Aj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], _l = kt("arrow-right", Rj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], Ji = kt("book-open", Uj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Ws = kt("chevron-right", Dj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Nl = kt("circle-alert", Mj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Sl = kt("circle-check", qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hj = [
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
], Bj = kt("clipboard-list", Hj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lj = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], du = kt("database", Lj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], kf = kt("download", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], Qj = kt("external-link", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], En = kt("file-check-2", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], Cf = kt("file-input", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vj = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], ou = kt("file-search", Vj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Yi = kt("folder-lock", Jj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], $j = kt("history", Kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Ef = kt("layout-dashboard", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Of = kt("loader-circle", Fj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ij = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], Tf = kt("play", Ij);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], ev = kt("plus", Pj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Rs = kt("refresh-cw", tv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], lv = kt("search", sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], zf = kt("shield-check", av);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], Jf = kt("upload", nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iv = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], cv = kt("users", iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Xi = kt("x", rv), ws = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, wn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Af = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Rf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], S = (o) => h.includes(o) ? h.indexOf(o) : 100;
  return Object.entries(u).sort(([o], [Y]) => S(o) - S(Y));
}, hu = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function uv({ asset: u, identity: h }) {
  const [S, o] = r.useState(""), [Y, L] = r.useState("");
  return r.useEffect(() => {
    let V = !1, H = "";
    return Ut(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (G) => {
      if (!G.ok) throw new Error("图片不可访问或已撤回");
      return G.blob();
    }).then((G) => {
      H = URL.createObjectURL(G), V ? URL.revokeObjectURL(H) : o(H);
    }).catch((G) => {
      V || L(G.message);
    }), () => {
      V = !0, H && URL.revokeObjectURL(H);
    };
  }, [u, h]), Y ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: Y }) : S ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: S, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function dv({ api: u, path: h, navigate: S, projects: o, identity: Y }) {
  var ut, Nt;
  const [L, V] = r.useState([]), [H, G] = r.useState([]), [j, R] = r.useState([]), [K, k] = r.useState([]), [le, fe] = r.useState("reports"), ye = r.useRef(0), [_e, Ee] = r.useState(""), [me, $] = r.useState([]), [oe, ie] = r.useState(null), [M, je] = r.useState(""), [Ue, Le] = r.useState(!1), [Xe, He] = r.useState([]), [he, Ie] = r.useState({}), [Q, ue] = r.useState(0), [g, B] = r.useState(null), [se, Ne] = r.useState(null), [f, q] = r.useState(null), [I, Z] = r.useState(new URLSearchParams(location.search).get("source") || ""), [ne, X] = r.useState(""), [P, Oe] = r.useState(!1), [ae, Ce] = r.useState(""), [Ge, Pe] = r.useState(""), [Ze, Ve] = r.useState(!0), [Ae, Re] = r.useState(!1), [Se, Be] = r.useState(0), [Qe, tt] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [rt, pe] = r.useState(""), [it, Me] = r.useState(null), [O, w] = r.useState([]), [F, we] = r.useState(""), [qe, N] = r.useState(0), [ee, z] = r.useState(!1), [re, ce] = r.useState("csv"), [Je, b] = r.useState(""), [ve, ge] = r.useState(""), [Ke, jt] = r.useState(((ut = o.find((p) => p.can_run)) == null ? void 0 : ut.id) || (Ot ? "" : "demo-airport")), U = o.some((p) => p.can_run), x = h.startsWith("/records/"), de = h.startsWith("/imports/") && h !== "/imports/new", be = L.find((p) => p.id === I), nt = H.filter((p) => p.kind === (be == null ? void 0 : be.kind) && p.project_id === (be == null ? void 0 : be.project_id));
  r.useEffect(() => {
    pe(""), w([]), we(""), N(0), Ce(""), Pe(""), q(null);
  }, [h]), r.useEffect(() => {
    let p = !1;
    Ve(!0), Ce(""), Ne(null), B(null);
    const ke = new URLSearchParams(Object.entries(Qe).filter(([, vt]) => !!vt));
    ke.set("limit", "15"), rt && ke.set("cursor", rt);
    async function lt() {
      try {
        const [vt, m] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (p) return;
        if (V(vt.items), G(m.items), h === "/sources" || h === "/imports") {
          const Te = await u("/imports?limit=15" + (rt ? "&cursor=" + encodeURIComponent(rt) : ""));
          if (p) return;
          R(Te.items), Me(Te.next_cursor);
        } else if (de) {
          const Te = await u(`${h}?after_row=${qe}&only_issues=${ee}`);
          p || B(Te);
        } else if (x) {
          const Te = await u(h + (F ? "?version=" + F : ""));
          p || Ne(Te);
        } else if (h === "/records") {
          const Te = await u("/records?" + ke);
          if (p) return;
          if (He(Te.items), Me(Te.next_cursor), Ie(Te.totals_by_kind), ue(Te.detail_groups_after_confirmed_links), le === "reports") {
            const ze = new URLSearchParams(ke);
            ze.delete("cursor"), rt && ze.set("after_id", rt);
            const st = await u("/reports?" + ze);
            if (p) return;
            k(st.items), Me(st.next_cursor);
          }
        }
      } catch (vt) {
        p || Ce(vt.message);
      } finally {
        p || Ve(!1);
      }
    }
    return lt(), () => {
      p = !0;
    };
  }, [h, Qe, rt, F, Se, qe, ee, le]), r.useEffect(() => {
    if (!de || !g || !["queued", "running"].includes(g.status)) return;
    let p = !1;
    const ke = setInterval(() => {
      u(`${h}?after_row=${qe}&only_issues=${ee}`).then((lt) => {
        p || B(lt);
      }).catch((lt) => {
        p || Ce(lt.message);
      });
    }, 1500);
    return () => {
      p = !0, clearInterval(ke);
    };
  }, [h, g == null ? void 0 : g.status, qe, ee]), r.useEffect(() => {
    ye.current++, Ee(""), $([]), ie(null), je("");
  }, [Qe, le, h]);
  const _ = async (p, ke = !1) => {
    const lt = ++ye.current;
    if (!ke && _e === p) {
      Ee(""), Le(!1);
      return;
    }
    ke || ($([]), ie(null)), Ee(p), Le(!0), je("");
    const vt = new URLSearchParams(Object.entries(Qe).filter(([, m]) => !!m));
    vt.set("document_id", p), vt.set("limit", "15"), ke && oe && vt.set("cursor", oe);
    try {
      const m = await u("/records?" + vt);
      if (lt !== ye.current) return;
      $((Te) => ke ? [...Te, ...m.items] : m.items), ie(m.next_cursor);
    } catch (m) {
      lt === ye.current && je(m.message);
    } finally {
      lt === ye.current && Le(!1);
    }
  }, xe = async (p) => {
    Re(!0), Ce(""), Pe("");
    try {
      await p();
    } catch (ke) {
      Ce(ke.message);
    } finally {
      Re(!1);
    }
  }, $e = () => xe(async () => {
    for (const p of o.filter((ke) => ke.can_run))
      for (const ke of p.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const lt = `mock-${p.id}-${ke}`;
        L.some((vt) => vt.namespace === lt && vt.project_id === p.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${p.id === "demo-airport" ? "机场" : "地铁"} · ${ws[ke]}（模拟）`, namespace: lt, kind: ke, project_id: p.id, mapping_template: ke === "governance_export" ? "governance-v1" : `${ke}-v1` }) });
      }
    Pe("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), Be((p) => p + 1);
  }), Ct = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !O.length, onClick: () => {
        pe(O.at(-1) || ""), w(O.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !it, onClick: () => {
        w([...O, rt]), pe(it || "");
      }, children: "下一页" })
    ] })
  ] }), Lt = (p, ke) => {
    tt({ ...Qe, [p]: ke }), pe(""), w([]);
  }, Yt = (p) => xe(async () => {
    const ke = await Ut(`/api/v1/assets/${p}/content`, { headers: { Authorization: `Bearer dev-${Y}` } });
    if (!ke.ok) {
      const m = await ke.json();
      throw new Error(m.message);
    }
    const lt = URL.createObjectURL(await ke.blob()), vt = document.createElement("a");
    vt.href = lt, vt.download = "来源文件", vt.click(), URL.revokeObjectURL(lt);
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
      /* @__PURE__ */ s.jsx("button", { onClick: () => Be((p) => p + 1), children: "重新加载" })
    ] }),
    Ge && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      Ge
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => S("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => S("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => S("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => Be((p) => p + 1), disabled: Ze, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ze ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ae || !U, onClick: () => void $e(), children: [
          /* @__PURE__ */ s.jsx(du, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: L.map((p) => {
        var ke, lt;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(du, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: ws[p.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: p.name }),
          /* @__PURE__ */ s.jsx("p", { children: (ke = o.find((vt) => vt.id === p.project_id)) == null ? void 0 : ke.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: p.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Af(p.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: p.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((lt = o.find((vt) => vt.id === p.project_id)) != null && lt.can_run), onClick: () => {
            Z(p.id), X(""), S("/imports/new?source=" + p.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] })
        ] }, p.id);
      }) }),
      !L.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(ou, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      U && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Ot || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Je, onChange: (p) => b(p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: ve, onChange: (p) => ge(p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: re, onChange: (p) => ce(p.target.value), children: ["csv", "excel", "governance_export"].map((p) => /* @__PURE__ */ s.jsx("option", { value: p, children: ws[p] }, p)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Ke, onChange: (p) => jt(p.target.value), children: o.filter((p) => p.can_run).map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ae || !Je || !ve, onClick: () => void xe(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Je, namespace: ve, kind: re, project_id: Ke, mapping_template: re === "governance_export" ? "governance-v1" : `${re}-v1` }) }), Be((p) => p + 1), Pe("来源已创建。");
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: I, onChange: (p) => {
                Z(p.target.value), X(""), q(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                L.filter((p) => {
                  var ke;
                  return (ke = o.find((lt) => lt.id === p.project_id)) == null ? void 0 : ke.can_run;
                }).map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ne, onChange: (p) => {
                X(p.target.value), q(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                nt.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.asset_id, children: p.label }, p.asset_id))
              ] })
            ] })
          ] }),
          !Ot && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: P, onChange: (p) => Oe(p.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Ot && be && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Ae, accept: be.kind === "csv" ? ".csv" : be.kind === "excel" ? ".xlsx" : ".json", onChange: (p) => {
                var lt;
                const ke = (lt = p.target.files) == null ? void 0 : lt[0];
                p.target.value = "", ke && xe(async () => {
                  if (ke.size > 5e6) throw new Error("文件不能超过5MB");
                  const vt = new Uint8Array(await ke.arrayBuffer());
                  let m = "";
                  for (let ze = 0; ze < vt.length; ze += 8192) m += String.fromCharCode(...vt.subarray(ze, ze + 8192));
                  const Te = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: be.project_id, kind: be.kind, name: ke.name, base64: btoa(m) }) });
                  G((ze) => [...ze, Te]), X(Te.asset_id), q(null), Pe("文件已上传，请预览字段与异常后提交接入。");
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
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Ae || !I || !ne, onClick: () => void xe(async () => {
            q(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: I, input_asset_id: ne }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(ou, { size: 16 }),
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
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(f.mapping).map(([p, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: ke }),
            /* @__PURE__ */ s.jsx(_l, { size: 13 }),
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
            /* @__PURE__ */ s.jsx("tbody", { children: f.preview.map((p) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                p.row_number,
                /* @__PURE__ */ s.jsx("small", { children: p.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: hu(p.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: ws[String(p.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...p.errors, ...p.issues].join("；") || "通过" })
            ] }, p.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ae, onClick: () => void xe(async () => {
              const p = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: I, input_asset_id: ne, input_hash: f.input_hash, fail_after: !Ot && P ? 2 : null }) });
              S("/imports/" + p.id);
            }), children: [
              /* @__PURE__ */ s.jsx(Jf, { size: 16 }),
              Ae ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !U, onClick: () => S("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(_l, { size: 15 })
        ] })
      ] }),
      j.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "来源 / 时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "新增" }),
          /* @__PURE__ */ s.jsx("th", { children: "更新" }),
          /* @__PURE__ */ s.jsx("th", { children: "跳过" }),
          /* @__PURE__ */ s.jsx("th", { children: "失败" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: j.map((p) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: p.source_name }),
            /* @__PURE__ */ s.jsx("small", { children: Af(p.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: wn[p.status] }),
          ["created", "updated", "skipped", "failed"].map((ke) => /* @__PURE__ */ s.jsx("td", { children: p.counts[ke] }, ke)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/imports/" + p.id), children: "查看历史项目" }) })
        ] }, p.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      Ct
    ] }) : de && g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => S("/imports"), children: [
        /* @__PURE__ */ s.jsx(wf, { size: 15 }),
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
        g.job_status === "failed" && ((Nt = o.find((p) => p.id === g.source.project_id)) == null ? void 0 : Nt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ae, onClick: () => void xe(async () => {
          await u(`/jobs/${g.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: g.row_version }) }), Be((p) => p + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      g.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: g.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((p) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: p === "failed" ? "失败行" : wn[p] }),
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
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(g.counts.kinds || {}).map(([p, ke]) => `${ws[p]} ${ke}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ee, onChange: (p) => {
              z(p.target.checked), N(0);
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
            /* @__PURE__ */ s.jsx("td", { children: p.outcome === "failed" ? "失败" : wn[p.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: p.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: p.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + p.record_id), children: "查看证据" }) })
          ] }, p.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !qe, onClick: () => N(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !g.next_row, onClick: () => N(g.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((p) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            ws[p],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: he[p] || 0 })
        ] }, p)),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: Qe.project_id, onChange: (p) => Lt("project_id", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: Qe.source_id, onChange: (p) => Lt("source_id", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              L.map((p) => /* @__PURE__ */ s.jsx("option", { value: p.id, children: p.name }, p.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: Qe.record_kind, onChange: (p) => Lt("record_kind", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((p) => /* @__PURE__ */ s.jsx("option", { value: p, children: ws[p] }, p))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: Qe.quality_status, onChange: (p) => Lt("quality_status", p.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Qe.from_date, onChange: (p) => Lt("from_date", p.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Qe.to_date, onChange: (p) => Lt("to_date", p.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": le === "reports", onClick: () => {
            fe("reports"), pe(""), w([]), Ee("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": le === "rows", onClick: () => {
            fe("rows"), pe(""), w([]);
          }, children: "逐条数据" })
        ] }),
        le === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((p) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": _e === p.id, onClick: () => void _(p.id), children: [
            /* @__PURE__ */ s.jsx(ou, { size: 20 }),
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
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] }),
          _e === p.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            M && /* @__PURE__ */ s.jsx("p", { role: "alert", children: M }),
            Ue ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : me.map((ke) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + ke.id), children: ke.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                ws[ke.record_kind],
                " · v",
                ke.current_version
              ] })
            ] }, ke.id)),
            oe && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Ue, onClick: () => void _(p.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, p.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Xe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Xe.map((p) => {
            var ke;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + p.id), children: p.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (ke = L.find((lt) => lt.id === p.source_id)) == null ? void 0 : ke.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: ws[p.record_kind] }),
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
    ] }) : x && se ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => S("/records"), children: [
        /* @__PURE__ */ s.jsx(wf, { size: 15 }),
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
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: se.selected_version, onChange: (p) => we(p.target.value), children: se.versions.map((p) => /* @__PURE__ */ s.jsxs("option", { value: p.version, children: [
            "v",
            p.version,
            p.version === se.current_version ? " · 当前" : ""
          ] }, p.version)) })
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
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Rf(se.raw_fields).map(([p, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: p }),
            /* @__PURE__ */ s.jsx("dd", { children: hu(ke) })
          ] }, p)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Rf(se.effective_fields).map(([p, ke]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: p }),
            /* @__PURE__ */ s.jsx("dd", { children: hu(ke) })
          ] }, p)) }),
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
        /* @__PURE__ */ s.jsx("div", { className: "evidence-grid", children: se.evidence.map((p) => {
          var ke;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: ws[p.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: p.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(p.locator) }),
            p.type !== "source_row" && p.asset_id ? /* @__PURE__ */ s.jsx(uv, { asset: p.asset_id, identity: Y }) : p.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            p.asset_id && ((ke = o.find((lt) => lt.id === se.project_id)) == null ? void 0 : ke.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Ae, onClick: () => void Yt(p.asset_id), children: "下载对应来源文件" })
          ] }, p.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        se.links.length ? se.links.map((p) => {
          var ke;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: wn[p.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + p.other_record_id), children: "打开另一条记录" }),
            ((ke = o.find((lt) => lt.id === se.project_id)) == null ? void 0 : ke.roles.some((lt) => ["admin", "reviewer"].includes(lt))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ae || p.review_state === "stale", onClick: () => void xe(async () => {
                await u(`/record-links/${p.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: p.row_version, decision: "confirmed" }) }), Be((lt) => lt + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ae || p.review_state === "stale", onClick: () => void xe(async () => {
                await u(`/record-links/${p.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: p.row_version, decision: "rejected" }) }), Be((lt) => lt + 1);
              }), children: "排除" })
            ] })
          ] }, p.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ae ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const Fs = "/history-review", Zi = "/history-reader", Kf = "historyReview.visibleFields", Ki = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], fu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], ov = { save_draft: "保存草稿", confirm: "批量确认", discard: "放弃修改", conflict: "值冲突" };
function hv() {
  try {
    const u = localStorage.getItem(Kf), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((S) => typeof S == "string") : Ki;
  } catch {
    return Ki;
  }
}
function ts(u, h = 120) {
  const S = (u || "").replace(/\s+/g, " ").trim();
  return S.length > h ? S.slice(0, h) + "…" : S || "—";
}
function Sa(u, h) {
  var S;
  return ((S = u.find((o) => o.key === h)) == null ? void 0 : S.label) || h;
}
function Uf(u, h) {
  return u ? Object.entries(u).map(([S, o]) => `${Sa(h, S)}：${ts(o, 30)}`).join("；") : "—";
}
function Df({ id: u }) {
  const [h, S] = r.useState(""), [o, Y] = r.useState("");
  return r.useEffect(() => {
    let L = !1, V = "";
    return Ut("/api/v1" + Zi + "/images/" + encodeURIComponent(u)).then(async (H) => {
      if (!H.ok) throw Error("图片暂不可用");
      return H.blob();
    }).then((H) => {
      V = URL.createObjectURL(H), L ? URL.revokeObjectURL(V) : S(V);
    }).catch((H) => {
      L || Y(H.message);
    }), () => {
      L = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function fv({ api: u }) {
  const [h, S] = r.useState(null), [o, Y] = r.useState([]), [L, V] = r.useState("findings"), [H, G] = r.useState([]), [j, R] = r.useState([]), [K, k] = r.useState([]), [le, fe] = r.useState([]), [ye, _e] = r.useState(hv), [Ee, me] = r.useState(!1), [$, oe] = r.useState(""), [ie, M] = r.useState(""), [je, Ue] = r.useState(""), [Le, Xe] = r.useState(""), [He, he] = r.useState(0), [Ie, Q] = r.useState(!1), [ue, g] = r.useState(!1), [B, se] = r.useState([]), [Ne, f] = r.useState(null), [q, I] = r.useState({}), [Z, ne] = r.useState(null), [X, P] = r.useState(""), [Oe, ae] = r.useState(""), [Ce, Ge] = r.useState(""), [Pe, Ze] = r.useState(!0), [Ve, Ae] = r.useState(!1), [Re, Se] = r.useState(0), Be = r.useRef(null), Qe = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], tt = (h == null ? void 0 : h.fields) || Qe;
  r.useEffect(() => {
    var N;
    Z && ((N = Be.current) == null || N.scrollIntoView({ block: "start" }));
  }, [Z]), r.useEffect(() => {
    let N = !1;
    return Ze(!0), Ge(""), Promise.all([
      u(Fs + "/summary"),
      u(Fs + "/projects?limit=800"),
      u(Fs + "/drafts?limit=100")
    ]).then(([ee, z, re]) => {
      N || (S(ee), Y(z.items), k(re.items), _e((ce) => {
        const Je = new Set(ee.editable_fields.map((ve) => ve.key)), b = ce.filter((ve) => Je.has(ve));
        return b.length ? b : Ki.filter((ve) => Je.has(ve));
      }));
    }).catch((ee) => {
      N || Ge(ee.message);
    }).finally(() => {
      N || Ze(!1);
    }), () => {
      N = !0;
    };
  }, [u, Re]), r.useEffect(() => {
    if (L !== "findings") return;
    let N = !1;
    return Ze(!0), Ge(""), u(Fs + "/findings?" + new URLSearchParams({
      q: Le,
      project: $,
      document_id: ie,
      offset: String(He),
      limit: "30"
    })).then((ee) => {
      N || (G(ue ? ee.items.filter((z) => z.draft_id) : ee.items), Q(ee.has_more));
    }).catch((ee) => {
      N || Ge(ee.message);
    }).finally(() => {
      N || Ze(!1);
    }), () => {
      N = !0;
    };
  }, [u, L, Le, $, ie, He, ue, Re]), r.useEffect(() => {
    if (L !== "reports") return;
    let N = !1;
    return Ze(!0), Ge(""), u(Fs + "/reports?" + new URLSearchParams({ q: Le, project: $, offset: "0", limit: "100" })).then((ee) => {
      N || (R(ee.items), Q(!1));
    }).catch((ee) => {
      N || Ge(ee.message);
    }).finally(() => {
      N || Ze(!1);
    }), () => {
      N = !0;
    };
  }, [u, L, Le, $, Re]), r.useEffect(() => {
    if (L !== "logs") return;
    let N = !1;
    return Ze(!0), Ge(""), u(Fs + "/logs?limit=100").then((ee) => {
      N || fe(ee.items);
    }).catch((ee) => {
      N || Ge(ee.message);
    }).finally(() => {
      N || Ze(!1);
    }), () => {
      N = !0;
    };
  }, [u, L, Re]);
  function rt(N) {
    _e(N);
    try {
      localStorage.setItem(Kf, JSON.stringify(N));
    } catch {
    }
  }
  function pe(N) {
    f(N);
    const ee = {};
    for (const z of fu) ee[z] = N[z] || "";
    I(ee), ae(""), ne(null), P("");
  }
  async function it() {
    if (!Ne) return;
    const N = {};
    for (const ee of fu) {
      const z = Ne[ee] || "";
      q[ee] !== z && (N[ee] = q[ee] || null);
    }
    if (!Object.keys(N).length) {
      ae("没有修改任何字段。");
      return;
    }
    Ae(!0), Ge("");
    try {
      await u(Fs + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: Ne.id, changes: N }) }), ae(`已保存草稿（${Object.keys(N).map((ee) => Sa(Qe, ee)).join("、")}），批量确认后覆盖数据库。`), f(null), Se((ee) => ee + 1);
    } catch (ee) {
      Ge(ee.message);
    } finally {
      Ae(!1);
    }
  }
  async function Me(N) {
    if (!N.length) {
      ae("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${N.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      Ae(!0), Ge(""), ae("");
      try {
        const ee = await u(Fs + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: N }) });
        ae(`已确认写入 ${ee.applied.length} 条${ee.conflicts.length ? `；${ee.conflicts.length} 条存在值冲突` : ""}。`), se([]), Se((z) => z + 1);
      } catch (ee) {
        Ge(ee.message);
      } finally {
        Ae(!1);
      }
    }
  }
  async function O(N) {
    if (N.length) {
      Ae(!0), Ge("");
      try {
        await u(Fs + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: N }) }), se([]), Se((ee) => ee + 1);
      } catch (ee) {
        Ge(ee.message);
      } finally {
        Ae(!1);
      }
    }
  }
  async function w(N) {
    ne(null), P("");
    try {
      const ee = await u(Zi + "/findings/" + encodeURIComponent(N.id));
      ne(ee);
    } catch (ee) {
      P(ee.message);
    }
  }
  async function F(N) {
    if (Z)
      try {
        const ee = N || Z, z = await Ut("/api/v1" + Zi + "/documents/" + encodeURIComponent(ee.document_id) + "/original");
        if (!z.ok) throw Error("原件暂不可用，请稍后重试。");
        const re = URL.createObjectURL(await z.blob()), ce = document.createElement("a");
        ce.href = re, ce.download = ee.original_name, ce.click(), setTimeout(() => URL.revokeObjectURL(re), 1e3);
      } catch (ee) {
        P(ee.message);
      }
  }
  const we = r.useMemo(() => j, [j]), qe = r.useMemo(() => K.map((N) => N.id), [K]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Pe, onClick: () => Se((N) => N + 1), children: "刷新数据" })
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
      Ce && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        Ce,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => Se((N) => N + 1), children: "重试" })
      ] }),
      Oe && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: Oe }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([N, ee]) => /* @__PURE__ */ s.jsx("button", { className: L === N ? "button primary" : "button ghost", onClick: () => {
        V(N), he(0);
      }, children: ee }, N)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (N) => {
          N.preventDefault(), Xe(je.trim()), he(0);
        }, children: [
          /* @__PURE__ */ s.jsx("label", { htmlFor: "history-query", children: "搜索" }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("input", { id: "history-query", value: je, onChange: (N) => Ue(N.target.value), maxLength: 100, placeholder: L === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Pe, children: "搜索" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: $, onChange: (N) => {
            oe(N.target.value), he(0);
          }, children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目（",
              (h == null ? void 0 : h.projects) ?? "—",
              "）"
            ] }),
            o.map((N) => /* @__PURE__ */ s.jsxs("option", { value: N.name, children: [
              N.name,
              "（",
              N.findings,
              "）"
            ] }, N.name))
          ] })
        ] }),
        ie && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          M(""), he(0);
        }, children: "清除报告筛选" }),
        L === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ue, onChange: (N) => g(N.target.checked) }),
          "只看待确认修改"
        ] }),
        L === "findings" && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => me((N) => !N), children: [
          "显示字段（",
          ye.length,
          "/",
          Qe.length,
          "）"
        ] })
      ] }),
      Ee && L === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        Qe.map((N) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(N.key), onChange: (ee) => rt(ee.target.checked ? [...ye, N.key] : ye.filter((z) => z !== N.key)) }),
          N.label
        ] }, N.key)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => rt(Ki.filter((N) => Qe.some((ee) => ee.key === N))), children: "恢复默认" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      L === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        K.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              K.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ve, onClick: () => se(B.length === qe.length ? [] : qe), children: B.length === qe.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ve || !B.length, onClick: () => void Me(B), children: [
                "批量确认所选（",
                B.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ve || !B.length, onClick: () => void O(B), children: "放弃所选" })
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
            /* @__PURE__ */ s.jsx("tbody", { children: K.map((N) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: B.includes(N.id), onChange: (ee) => se(ee.target.checked ? [...B, N.id] : B.filter((z) => z !== N.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: ts(N.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: ts(N.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Uf(N.changes, Qe) }),
              /* @__PURE__ */ s.jsx("td", { children: N.updated_at ? new Date(N.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, N.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": Pe, children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "操作" }),
            ye.map((N) => /* @__PURE__ */ s.jsx("th", { children: Sa(Qe, N) }, N)),
            /* @__PURE__ */ s.jsx("th", { children: "来源报告" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" })
          ] }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            H.map((N) => /* @__PURE__ */ s.jsxs("tr", { className: N.draft_id ? "history-dirty" : "", children: [
              /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => pe(N), children: "编辑" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => void w(N), children: "证据" })
              ] }),
              ye.map((ee) => /* @__PURE__ */ s.jsx("td", { className: ee === "problem_description" ? "history-description" : "", children: ts(N[ee], ee === "problem_description" ? 220 : 80) }, ee)),
              /* @__PURE__ */ s.jsx("td", { children: ts(N.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { children: N.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : ts(N.review_state, 14) })
            ] }, N.id)),
            !H.length && !Pe && !Ce && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: ye.length + 3, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: He === 0, onClick: () => he(Math.max(0, He - 30)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            He / 30 + 1,
            " 页 · 本页 ",
            H.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Ie, onClick: () => he(He + 30), children: "下一页" })
        ] })
      ] }),
      L === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": Pe, children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          we.map((N) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: ts(N.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: ts(N.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: ts(N.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: N.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                M(N.document_id), V("findings"), he(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
                Ut("/api/v1" + Zi + "/documents/" + encodeURIComponent(N.document_id) + "/original").then(async (ee) => {
                  if (!ee.ok) throw Error("原件暂不可用");
                  const z = URL.createObjectURL(await ee.blob()), re = document.createElement("a");
                  re.href = z, re.download = N.original_name, re.click(), setTimeout(() => URL.revokeObjectURL(z), 1e3);
                }).catch((ee) => Ge(ee.message));
              }, children: "原件" })
            ] })
          ] }, N.document_id)),
          !we.length && !Pe && !Ce && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      L === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": Pe, children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" }),
          /* @__PURE__ */ s.jsx("th", { children: "报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作人" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          le.map((N) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: new Date(N.created_at).toLocaleString("zh-CN") }),
            /* @__PURE__ */ s.jsx("td", { children: ov[N.action] || N.action }),
            /* @__PURE__ */ s.jsx("td", { children: ts(N.original_name, 28) || ts(N.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Uf(N.changes, Qe) }),
            /* @__PURE__ */ s.jsx("td", { children: ts(N.actor, 30) })
          ] }, N.id)),
          !le.length && !Pe && !Ce && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    Ne && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          f(null), ne(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        ts(Ne.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: fu.map((N) => /* @__PURE__ */ s.jsxs("label", { className: N === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Sa(Qe, N) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: N === "problem_description" ? 3 : 2, value: q[N] || "", onChange: (ee) => I({ ...q, [N]: ee.target.value }) })
      ] }, N)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ve, onClick: () => void it(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => f(null), children: "取消" })
      ] }),
      Z && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void F(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: tt.map((N) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: N.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Z.fields[N.key] || "—" })
        ] }, N.key)) }),
        Z.evidence.map((N, ee) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Sa(Qe, N.field_key),
            "：",
            ts(N.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: N.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(N.locator)
          ] })
        ] }, ee)),
        Z.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            Z.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Z.images.map((N, ee) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(Df, { id: N.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(N.locator) })
          ] }, N.id + ":" + ee)) })
        ] })
      ] })
    ] }),
    Z && !Ne && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", ref: Be, "aria-label": "问题条目证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ne(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("strong", { children: Z.original_name }) }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "解析版本时间：",
        new Date(Z.parsed_at).toLocaleString("zh-CN")
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void F(), children: "下载原报告" }),
      Z.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
        /* @__PURE__ */ s.jsx("ul", { children: Z.sources.map((N) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void F(N), children: N.original_name }) }, N.document_id)) })
      ] }),
      /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: tt.map((N) => /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: N.label }),
        /* @__PURE__ */ s.jsx("dd", { children: Z.fields[N.key] || "—" })
      ] }, N.key)) }),
      /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
      Z.evidence.map((N, ee) => /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsxs("summary", { children: [
          Sa(Qe, N.field_key),
          "：",
          ts(N.quote, 100)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: N.quote }),
        /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
          "来源位置：",
          JSON.stringify(N.locator)
        ] })
      ] }, ee)),
      X && /* @__PURE__ */ s.jsx("p", { role: "alert", children: X }),
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "关联图片（",
        Z.images.length,
        "）"
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
      /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Z.images.map((N, ee) => /* @__PURE__ */ s.jsxs("figure", { children: [
        /* @__PURE__ */ s.jsx(Df, { id: N.id }),
        /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(N.locator) })
      ] }, N.id + ":" + ee)) })
    ] })
  ] });
}
function zt(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((S) => ["admin", "reviewer"].includes(S)) : h === "training.manage" ? u.roles.some((S) => ["admin", "teacher"].includes(S)) : h === "training.review" ? u.roles.some((S) => ["admin", "teacher", "reviewer"].includes(S)) : !0 : !1;
}
const Is = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Mf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, qf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function mu(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((o) => o.text).join(`
`), h.facts.map((o) => o.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((o) => o.evidence_ids).join("、"), h.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, o, Y]) => o !== Y);
}
function mv({ api: u, path: h, navigate: S, projects: o, identity: Y }) {
  var U;
  const [L, V] = r.useState(!0), [H, G] = r.useState(!1), [j, R] = r.useState(""), [K, k] = r.useState(""), [le, fe] = r.useState(0), [ye, _e] = r.useState([]), [Ee, me] = r.useState([]), [$, oe] = r.useState([]), [ie, M] = r.useState("knowledge_revision"), [je, Ue] = r.useState(""), [Le, Xe] = r.useState(""), [He, he] = r.useState(""), [Ie, Q] = r.useState(null), [ue, g] = r.useState([]), [B, se] = r.useState(null), [Ne, f] = r.useState("resolved"), [q, I] = r.useState(""), [Z, ne] = r.useState(""), [X, P] = r.useState(((U = o.find((x) => zt(x, "knowledge.process"))) == null ? void 0 : U.id) || ""), [Oe, ae] = r.useState([]), [Ce, Ge] = r.useState([]), [Pe, Ze] = r.useState("case_card"), [Ve, Ae] = r.useState("normal"), [Re, Se] = r.useState(null), [Be, Qe] = r.useState(sessionStorage.getItem("b03-last-job-" + Y) || ""), [tt, rt] = r.useState(null), [pe, it] = r.useState(null), [Me, O] = r.useState(null), [w, F] = r.useState(""), [we, qe] = r.useState(!1), N = /^\/knowledge\/[^/]+\/edit$/.test(h), ee = o.some((x) => zt(x, "knowledge.process")), z = o.some((x) => zt(x, "knowledge.review")), re = h.startsWith("/quality"), ce = h === "/reviews";
  r.useEffect(() => {
    he(""), g([]), Xe(""), Ue(""), R(""), k(""), qe(!1), F("");
  }, [h]), r.useEffect(() => {
    let x = !1;
    V(!0), R(""), it(null), O(null);
    async function de() {
      try {
        if (re) {
          const be = await u(`/quality/issues?limit=20${je ? "&rule_code=" + je : ""}${Le ? "&status=" + Le : ""}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (x) return;
          me(be.items), oe(be.summary), Q(be.next_cursor);
        } else if (N) {
          const be = await u(h.replace("/edit", ""));
          if (x) return;
          it(be), O(structuredClone(be.content));
        } else if (ce) {
          const be = await u(`/reviews?object_type=${ie}&state=${Le || "pending_review"}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (x) return;
          _e(be.items), Q(be.next_cursor);
        } else {
          const be = await u(`/knowledge?limit=20${Le ? "&state=" + Le : ""}${He ? "&cursor=" + encodeURIComponent(He) : ""}`);
          if (x) return;
          if (_e(be.items), Q(be.next_cursor), ee && X) {
            const nt = await u("/knowledge/source-options?project_id=" + X);
            x || ae(nt.items);
          }
        }
      } catch (be) {
        x || R(be.message);
      } finally {
        x || V(!1);
      }
    }
    return de(), () => {
      x = !0;
    };
  }, [h, Le, je, He, le, X, ie]), r.useEffect(() => {
    Ge([]), Se(null);
  }, [X, Pe, Ve]), r.useEffect(() => {
    if (!Be || re || N || ce || !ee) return;
    let x = !1;
    const de = () => {
      u("/knowledge/generation-jobs/" + Be).then((nt) => {
        x || (rt(nt), nt.status === "succeeded" && fe((_) => _ + 1));
      }).catch((nt) => {
        x || R(nt.message);
      });
    };
    de();
    const be = setInterval(() => {
      (!tt || ["queued", "running", "retrying"].includes(tt.status)) && de();
    }, 1800);
    return () => {
      x = !0, clearInterval(be);
    };
  }, [Be, h, tt == null ? void 0 : tt.status]);
  const Je = async (x) => {
    G(!0), R(""), k("");
    try {
      await x();
    } catch (de) {
      R(de.message);
    } finally {
      G(!1);
    }
  }, b = () => ({ record_version_ids: Ce, type: Pe, template_version: "mock-v1", mock_scenario: Ve }), ve = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !ue.length, onClick: () => {
        he(ue.at(-1) || ""), g(ue.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Ie, onClick: () => {
        g([...ue, He]), he(Ie || "");
      }, children: "下一页" })
    ] })
  ] }), ge = pe && zt(o.find((x) => x.id === pe.project_id), "knowledge.process"), Ke = pe && zt(o.find((x) => x.id === pe.project_id), "knowledge.review"), jt = (x) => Je(async () => {
    if (!pe) return;
    const de = x === "submit" ? `/knowledge/${pe.id}/submit-review` : `/reviews/${pe.revision_id}/${x}`;
    await u(de, { method: "POST", body: JSON.stringify({ row_version: pe.row_version, revision_id: pe.revision_id, reason: w, evidence_checked: we }) }), k(x === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), fe((be) => be + 1), qe(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(En, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    j && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      j,
      /* @__PURE__ */ s.jsx("button", { onClick: () => fe((x) => x + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: re ? "selected" : "", onClick: () => S("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !re && !ce ? "selected" : "", onClick: () => S("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: ce ? "selected" : "", onClick: () => S("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: L, onClick: () => fe((x) => x + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    L ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : re ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Mf).map(([x, de]) => /* @__PURE__ */ s.jsxs("button", { className: je === x ? "panel selected-quality" : "panel", "aria-pressed": je === x, onClick: () => {
        Ue(je === x ? "" : x), Xe("open"), he(""), g([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: de }),
        /* @__PURE__ */ s.jsx("strong", { children: $.filter((be) => be.rule_code === x && be.status === "open").reduce((be, nt) => be + nt.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, x)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Le, onChange: (x) => {
            Xe(x.target.value), he(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: Is[x] }, x))
          ] })
        ] }),
        Ee.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ee.map((x) => {
            var de, be;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + x.record_id), children: x.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Mf[x.rule_code] || x.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                x.message,
                x.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (de = x.annotations.at(-1)) == null ? void 0 : de.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Is[x.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((be = o.find((nt) => nt.id === x.project_id)) != null && be.can_run), onClick: () => {
                se(x), I(""), ne("");
              }, children: "核查处理" }) })
            ] }, x.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ve
      ] })
    ] }) : N && pe && Me ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            qf[pe.type],
            " · v",
            pe.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            Is[pe.state],
            " · 生成适配器：",
            pe.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      pe.source.version !== pe.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        pe.source.version,
        "更新到v",
        pe.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S((pe.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + pe.source.record_id), children: pe.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              pe.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(pe.source.raw_fields.description || pe.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(pe.source.effective_fields.description || "缺失") }),
            pe.source.versions && pe.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                pe.source.versions.length,
                "条）"
              ] }),
              pe.source.versions.map((x) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  x.version,
                  " · ",
                  x.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(x.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + x.record_id), children: "打开风险记录" })
              ] }, x.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              Me.project_name,
              " · ",
              Me.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            pe.source.evidence.map((x) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[x.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(x.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: x.id })
            ] }, x.id)),
            pe.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              pe.source.annotations.map((x, de) => /* @__PURE__ */ s.jsxs("p", { children: [
                x.reason,
                " · ",
                JSON.stringify(x.value)
              ] }, de))
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
              /* @__PURE__ */ s.jsx("input", { value: Me.title, disabled: !ge, onChange: (x) => O({ ...Me, title: x.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            Me.facts.map((x, de) => /* @__PURE__ */ s.jsxs("label", { children: [
              x.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: x.text, onChange: (be) => O({ ...Me, facts: Me.facts.map((nt, _) => _ === de ? { ...nt, text: be.target.value, source_kind: "human_annotation" } : nt) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                x.evidence_ids.join("、")
              ] })
            ] }, de)),
            Me.construction_points && Me.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                Me.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: Me.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              Me.construction_points.map((x, de) => {
                var be;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    x.title,
                    " · ",
                    x.stage === "preparation" ? "施工准备" : x.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: x.content, onChange: (nt) => {
                      var _;
                      return O({ ...Me, construction_points: (_ = Me.construction_points) == null ? void 0 : _.map((xe, $e) => $e === de ? { ...xe, content: nt.target.value } : xe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: x.inspection_method, onChange: (nt) => {
                      var _;
                      return O({ ...Me, construction_points: (_ = Me.construction_points) == null ? void 0 : _.map((xe, $e) => $e === de ? { ...xe, inspection_method: nt.target.value } : xe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: x.common_mistakes, onChange: (nt) => {
                      var _;
                      return O({ ...Me, construction_points: (_ = Me.construction_points) == null ? void 0 : _.map((xe, $e) => $e === de ? { ...xe, common_mistakes: nt.target.value } : xe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: x.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    x.evidence_ids.join("、")
                  ] }),
                  (be = x.source_quotes) == null ? void 0 : be.map((nt, _) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: nt.text })
                  ] }, _))
                ] }, de);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: Me.suggestions.join(`
`), onChange: (x) => O({ ...Me, suggestions: x.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            Me.standards.length ? Me.standards.map((x, de) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: x.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                x.clause || "未提供",
                " · 版本：",
                x.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: x.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !ge, checked: x.verification_status === "not_used", onChange: (be) => O({ ...Me, standards: Me.standards.map((nt, _) => _ === de ? { ...nt, verification_status: be.target.checked ? "not_used" : "pending_verification" } : nt) }) }),
                "明确不采用该依据"
              ] })
            ] }, de)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            mu(pe.content, Me).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              mu(pe.content, Me).map(([x, de, be]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: x }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  de
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  be
                ] })
              ] }, x))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (x) => F(x.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              ge && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: H || !w.trim(), onClick: () => void Je(async () => {
                await u(`/knowledge/${pe.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: pe.row_version, revision_id: pe.revision_id, content: Me, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), fe((x) => x + 1);
              }), children: "保存新草稿版本" }),
              ge && ["draft", "changes_requested"].includes(pe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: H || !w.trim() || JSON.stringify(Me) !== JSON.stringify(pe.content), onClick: () => void jt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Ke && pe.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: we, onChange: (x) => qe(x.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: H || !we || !w.trim() || JSON.stringify(Me) !== JSON.stringify(pe.content), onClick: () => void jt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: H || !w.trim(), onClick: () => void jt("request-changes"), children: "退回修改" })
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
        pe.revisions.map((x, de) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            x.version,
            " · ",
            Is[x.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: x.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            x.content.facts.map((be) => be.text).join("；")
          ] }),
          pe.revisions[de + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              pe.revisions[de + 1].version,
              "的修改："
            ] }),
            mu(pe.revisions[de + 1].content, x.content).map(([be, nt, _]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                nt
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                _
              ] })
            ] }, be))
          ] })
        ] }, x.id)),
        pe.review_actions.map((x, de) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            x.version,
            " · ",
            Is[x.action] || x.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: x.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(x.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            x.reviewer.slice(0, 8)
          ] })
        ] }, de))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ce && ee && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: X, onChange: (x) => P(x.target.value), children: o.filter((x) => zt(x, "knowledge.process")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: Pe, onChange: (x) => Ze(x.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            Ge(Oe.slice(0, 20).map((x) => x.record_version_id)), Se(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Oe.length ? Oe.map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ce.includes(x.record_version_id), onChange: (de) => {
              Ge(de.target.checked ? [...Ce, x.record_version_id] : Ce.filter((be) => be !== x.record_version_id)), Se(null);
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
              /* @__PURE__ */ s.jsxs("select", { value: Ve, onChange: (x) => Ae(x.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: H || !Ce.length || Ce.length > 20, onClick: () => void Je(async () => {
              Se(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              Ce.length,
              "条）"
            ] }),
            Re && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: H, onClick: () => void Je(async () => {
              const x = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              rt(null), Qe(x.job_id), sessionStorage.setItem("b03-last-job-" + Y, x.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              Re.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(_l, { size: 15 })
            ] })
          ] }),
          Re && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: Re.items.map((x, de) => /* @__PURE__ */ s.jsxs("p", { children: [
            x.description,
            " · 来源问题 ",
            x.quality_issue_count,
            "项"
          ] }, de)) }),
          tt && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              tt.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              tt.counts.created,
              " · 复用 ",
              tt.counts.skipped,
              " · 单项失败 ",
              tt.counts.failed
            ] }),
            tt.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: tt.error }),
            tt.items.map((x, de) => /* @__PURE__ */ s.jsxs("p", { children: [
              x.error || Is[x.outcome],
              " ",
              x.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/knowledge/" + x.item_id + "/edit"), children: "打开知识卡" })
            ] }, de)),
            tt.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: H, onClick: () => void Je(async () => {
              await u("/jobs/" + tt.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: tt.row_version }) }), rt(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "审核待办" : "知识候选列表" }),
          ce && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ie, onChange: (x) => {
            M(x.target.value), he(""), g([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Le, onChange: (x) => {
            Xe(x.target.value), he(""), g([]);
          }, children: [
            !ce && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (ce ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: Is[x] }, x))
          ] })
        ] }),
        ce && !z ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : ye.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ye.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: x.title }),
            /* @__PURE__ */ s.jsx("td", { children: qf[x.type] }),
            /* @__PURE__ */ s.jsx("td", { children: Is[x.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              x.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S(x.object_type === "question_revision" ? "/training/questions/" + x.id : x.object_type === "retrospective_revision" ? "/retrospectives/" + x.id + "/review" : "/knowledge/" + x.id + "/edit"), children: ce ? "打开审核" : "核查与编辑" }) })
          ] }, x.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: ce ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        ve
      ] })
    ] }),
    B && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => se(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: B.message }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ s.jsx("select", { value: Ne, onChange: (x) => f(x.target.value), children: ["resolved", "ignored", "open"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: Is[x] }, x)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: q, onChange: (x) => I(x.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: Z, onChange: (x) => ne(x.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: H || !q.trim(), onClick: () => void Je(async () => {
        await u("/quality/issues/" + B.id, { method: "PATCH", body: JSON.stringify({ row_version: B.row_version, status: Ne, reason: q, annotation: Z || null }) }), se(null), fe((x) => x + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Hf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, xv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", jv = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", xu = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function vv({ identity: u, path: h, projects: S, navigate: o }) {
  var re, ce, Je, b, ve, ge, Ke, jt;
  const [Y, L] = r.useState(((re = S[0]) == null ? void 0 : re.id) || ""), [V, H] = r.useState("generic"), [G, j] = r.useState(""), [R, K] = r.useState([]), [k, le] = r.useState({}), [fe, ye] = r.useState([]), [_e, Ee] = r.useState([]), [me, $] = r.useState("mock-hash-64"), [oe, ie] = r.useState([]), [M, je] = r.useState(null), [Ue, Le] = r.useState(""), [Xe, He] = r.useState("extractive"), [he, Ie] = r.useState(null), [Q, ue] = r.useState(null), [g, B] = r.useState(null);
  r.useEffect(() => () => {
    g && URL.revokeObjectURL(g);
  }, [g]), r.useEffect(() => {
    B(null);
  }, [Y, h]);
  const [se, Ne] = r.useState(null);
  r.useEffect(() => {
    Ne(null);
  }, [h]);
  const [f, q] = r.useState(""), [I, Z] = r.useState("useful"), [ne, X] = r.useState(""), [P, Oe] = r.useState(!1), [ae, Ce] = r.useState(!0), [Ge, Pe] = r.useState(""), [Ze, Ve] = r.useState(""), [Ae, Re] = r.useState(0), [Se, Be] = r.useState(""), [Qe, tt] = r.useState(null), [rt, pe] = r.useState([]), it = r.useRef("");
  it.current = [u, h, Y, V, G, Ue, Xe, se].join("|");
  const Me = h === "/releases", O = h === "/search", w = h === "/knowledge/library", F = zt(S.find((U) => U.id === Y), "knowledge.publish"), we = !Me && !O && !w ? h.split("/")[2] : null;
  async function qe(U, x = {}) {
    const de = await Ut("/api/v1" + U, { ...x, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...x.headers } }), be = await de.json();
    if (!de.ok) throw new Error(be.message || "请求失败，请重试。");
    return be;
  }
  r.useEffect(() => {
    Ee([]), Ie(null), ue(null), Pe(""), Ve(""), Be(""), pe([]);
  }, [Y, h, V, G]), r.useEffect(() => {
    let U = !1;
    return Ce(!0), Pe(""), je(null), (async () => {
      try {
        if (Me) {
          const de = await qe(`/releases?project_id=${Y}${Se ? "&cursor=" + encodeURIComponent(Se) : ""}`);
          if (U) return;
          K(de.items), le(de.active_ids), tt(de.next_cursor);
          const be = await qe("/releases/options?project_id=" + Y);
          U || ye(be.items);
        } else if (w) {
          const de = await qe(`/knowledge/library?project_id=${Y}${V ? "&scene_code=" + V : ""}${G ? "&card_type=" + G : ""}${Se ? "&after_id=" + Se : ""}`);
          U || (ie(de.items), tt(de.next_cursor));
        } else if (we) {
          const de = await qe("/published/knowledge/" + we + (se ? "?revision_id=" + se : ""));
          U || je(de);
        }
      } catch (de) {
        U || Pe(de.message);
      } finally {
        U || Ce(!1);
      }
    })(), () => {
      U = !0;
    };
  }, [Y, h, V, G, Ae, Se, se]), r.useEffect(() => {
    if (!Me || !R.some((x) => ["queued", "building"].includes(x.state))) return;
    const U = setInterval(() => Re((x) => x + 1), 1800);
    return () => clearInterval(U);
  }, [Me, R]);
  const N = async (U) => {
    Oe(!0), Pe(""), Ve("");
    try {
      await U();
    } catch (x) {
      Pe(x.message);
    } finally {
      Oe(!1);
    }
  }, ee = (U, x, de = !1) => N(async () => {
    const be = it.current;
    B(null), ue(null);
    const nt = await qe("/published/evidence/" + U + "?revision_id=" + x + (de ? "&historical=true" : ""));
    if (be === it.current && (ue(nt), nt.has_image)) {
      const _ = await Ut("/api/v1/published/evidence/" + U + "/content?revision_id=" + x + (de ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!_.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const xe = await _.blob();
      be === it.current && B(URL.createObjectURL(xe));
    }
  }), z = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !rt.length || ae, onClick: () => {
        Be(rt.at(-1) || ""), pe(rt.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Qe || ae, onClick: () => {
        pe([...rt, Se]), Be(Qe || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Ji, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || we ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: O ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        S.some((U) => zt(U, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: Me ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        ue(null), Ie(null), Re((U) => U + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ge && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ge
    ] }),
    Ze && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      Ze
    ] }),
    !we && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: Y, onChange: (U) => L(U.target.value), children: S.map((U) => /* @__PURE__ */ s.jsx("option", { value: U.id, children: U.name }, U.id)) })
      ] }),
      !Me && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: V, onChange: (U) => H(U.target.value), children: [
            w && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: G, onChange: (U) => j(U.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ae ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : Me ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      F && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: fe.length ? fe.map((U) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e.includes(U.revision_id), onChange: (x) => Ee(x.target.checked ? [..._e, U.revision_id] : _e.filter((de) => de !== U.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: U.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              xu(U.type),
              " · 审核版本 v",
              U.version
            ] })
          ] })
        ] }, U.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: me, onChange: (U) => $(U.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !_e.length, onClick: () => void N(async () => {
            await qe("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: Y, revision_ids: _e, embedding_model: me }) }), Ee([]), Ve("发布集合已固定，处理服务正在构建索引。"), Re((U) => U + 1);
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
        R.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: R.map((U) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Hf[U.state] || U.state }),
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
              ["ready", "inactive"].includes(U.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void N(async () => {
                await qe("/releases/" + U.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: U.row_version, expected_active_id: k[Y] || null }) }), Ve("发布已启用，知识库与检索使用同一发布集合。"), Re((x) => x + 1);
              }), children: "启用发布" }),
              U.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => void N(async () => {
                await qe("/jobs/" + U.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: U.job_row_version }) }), Re((x) => x + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          U.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: U.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            U.entries.map((x) => /* @__PURE__ */ s.jsxs("p", { children: [
              x.revision_id.slice(0, 8),
              " · ",
              Hf[x.state] || x.state,
              x.error ? " · " + x.error : ""
            ] }, x.revision_id))
          ] })
        ] }, U.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无发布批次" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已审核知识建立第一个发布。" })
        ] }),
        z
      ] })
    ] }) : w ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "当前可用知识" }),
        /* @__PURE__ */ s.jsx("span", { children: "仅显示已启用、未撤回的审核版本" })
      ] }),
      oe.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: oe.map((U) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          xu(U.type),
          " · v",
          U.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: U.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + U.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(Qj, { size: 15 })
        ] })
      ] }, U.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Ji, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      z
    ] }) : O ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (U) => {
        U.preventDefault(), N(async () => {
          const x = it.current;
          Ie(null), ue(null);
          const de = await qe("/search", { method: "POST", body: JSON.stringify({ project_id: Y, question: Ue, scene_code: V, card_type: G || null, answer_mode: Xe }) });
          x === it.current && Ie(de);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Ue, onChange: (U) => {
          Le(U.target.value), Ie(null), ue(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Xe, onChange: (U) => {
              He(U.target.value), Ie(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !Ue.trim(), children: [
            /* @__PURE__ */ s.jsx(lv, { size: 17 }),
            P ? "正在检索…" : "查找知识"
          ] })
        ] })
      ] }),
      he && /* @__PURE__ */ s.jsxs("section", { className: "panel search-result", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: he.status === "answered" ? "找到有据内容" : he.status === "degraded" ? "回答暂不可用，已保留检索结果" : "证据不足" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            he.latency_ms,
            " ms · ",
            he.results.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "search-answer", children: [
          he.answer_blocks.map((U, x) => /* @__PURE__ */ s.jsx("p", { children: U.text }, x)),
          he.missing_conditions.map((U) => /* @__PURE__ */ s.jsx("p", { children: U }, U)),
          he.warnings.map((U) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: U.message }, U.code))
        ] }),
        he.results.map((U, x) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            x + 1,
            " · ",
            U.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + U.id), children: U.title }),
          /* @__PURE__ */ s.jsx("p", { children: U.text }),
          /* @__PURE__ */ s.jsx("div", { children: he.citations.filter((de) => U.citation_ids.includes(de.citation_id)).map((de) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: P, onClick: () => void ee(de.evidence_id, de.knowledge_revision_id), children: [
            "打开来源：",
            de.source_title
          ] }, de.citation_id)) })
        ] }, U.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (U) => {
          U.preventDefault(), N(async () => {
            await qe("/search/" + he.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: I, comment: ne }) }), Ve("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: I, onChange: (U) => Z(U.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ne, maxLength: 1e3, onChange: (U) => X(U.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, children: "保存反馈" })
        ] })
      ] })
    ] }) : M && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        M.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        xu(M.type),
        " · v",
        M.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: M.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((ce = S.find((U) => U.id === M.project_id)) == null ? void 0 : ce.name) || M.project_id,
        " · ",
        xv(M.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Je = M.content) == null ? void 0 : Je.facts.map((U, x) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: U.text }),
        /* @__PURE__ */ s.jsx("small", { children: U.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: U.evidence_ids.map((de) => /* @__PURE__ */ s.jsx("button", { disabled: P, className: "citation-button", onClick: () => void ee(de, M.revision_id, M.is_current_release === !1), children: "打开来源证据" }, de)) })
      ] }, x)),
      ((b = M.content) == null ? void 0 : b.construction_points) && M.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          M.content.category_name || "通用"
        ] }),
        M.content.construction_points.map((U, x) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
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
          /* @__PURE__ */ s.jsx("div", { children: U.evidence_ids.map((de) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void ee(de, M.revision_id, M.is_current_release === !1), children: "核对要点来源" }, de)) })
        ] }, x))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((ve = M.content) == null ? void 0 : ve.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (ge = M.content) == null ? void 0 : ge.suggestions.map((U, x) => /* @__PURE__ */ s.jsx("p", { children: U }, x)),
      (Ke = M.content) != null && Ke.standards.length ? M.content.standards.map((U, x) => /* @__PURE__ */ s.jsxs("p", { children: [
        U.name,
        " ",
        U.clause,
        " · ",
        U.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, x)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          M.release_id
        ] }),
        (jt = M.versions) == null ? void 0 : jt.map((U) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          Ne(U.id), ue(null);
        }, children: [
          "查看已发布 v",
          U.version
        ] }, U.id)),
        /* @__PURE__ */ s.jsx("p", { children: M.history_note })
      ] }),
      zt(S.find((U) => U.id === M.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: f, maxLength: 2e3, onChange: (U) => q(U.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: P || !f.trim(), onClick: () => void N(async () => {
          await qe("/knowledge/" + M.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: M.row_version, reason: f }) }), je(null), ue(null), Ve("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
        }), children: "撤回知识" })
      ] })
    ] }),
    Q && /* @__PURE__ */ s.jsxs("section", { className: "panel opened-evidence", "aria-label": "来源证据", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          "来源证据 · v",
          Q.source_version
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ue(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Q.source_title }),
        /* @__PURE__ */ s.jsx("p", { children: Q.description || "来源描述缺失" }),
        g && /* @__PURE__ */ s.jsx("img", { className: "published-evidence-image", src: g, alt: "模拟证据示意图，非真实现场照片" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "位置：",
          jv(Q.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: Q.note })
      ] })
    ] })
  ] });
}
const kn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, $f = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, pu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, pv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, gu = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, bu = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, On = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", gv = (u) => JSON.stringify(u, null, 2), bv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function wa(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((S) => typeof S != "object") ? u.join("、") : u.map((S, o) => `第${o + 1}条
${wa(S)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([S, o]) => `${bv[S] || pu[S] || S}：${wa(o, S)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return On(u);
    if (h === "actor_role" || h === "role") return bu(u);
    if (h === "event_type") return $f[u] || u;
    if (h === "evidence_type") return gu[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const yv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? gv(u) : "未补充说明";
};
function _v({ identity: u, path: h, projects: S, navigate: o }) {
  var Me, O, w, F, we, qe, N, ee, z, re, ce, Je;
  const Y = h === "/task-packages/import", L = !Y && h !== "/task-packages" ? h.split("/")[2] : null, [V, H] = r.useState(((Me = S[0]) == null ? void 0 : Me.id) || ""), [G, j] = r.useState(""), [R, K] = r.useState([]), [k, le] = r.useState(null), [fe, ye] = r.useState(""), [_e, Ee] = r.useState(null), [me, $] = r.useState([]), [oe, ie] = r.useState([]), [M, je] = r.useState([]), [Ue, Le] = r.useState("complete"), [Xe, He] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [he, Ie] = r.useState(""), [Q, ue] = r.useState(null), [g, B] = r.useState(""), [se, Ne] = r.useState(""), [f, q] = r.useState(!0), [I, Z] = r.useState(!1), [ne, X] = r.useState(0), [P, Oe] = r.useState(""), [ae, Ce] = r.useState(null), Ge = r.useRef(null), Pe = r.useRef(null), Ze = r.useRef("");
  Ze.current = [u, h, V, Ue, Xe, he].join("|");
  const Ve = S.some((b) => b.permissions != null), Ae = !Ve && zt(S.find((b) => b.id === V), "imports.create"), Re = k && !Ve && zt(S.find((b) => b.id === k.project_id), "imports.withdraw"), Se = k && !Ve && zt(S.find((b) => b.id === k.project_id), "imports.create");
  async function Be(b, ve = {}) {
    const ge = await Ut("/api/v1/task-packages" + b, {
      ...ve,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...ve.headers }
    }), Ke = await ge.json().catch(() => ({}));
    if (!ge.ok) throw new Error(Ke.message || "接入服务暂未就绪，请稍后刷新。");
    return Ke;
  }
  const Qe = async (b) => {
    Z(!0), B(""), Ne("");
    try {
      await b();
    } catch (ve) {
      B(ve.message);
    } finally {
      Z(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + u, Xe);
  }, [Xe, u]), r.useEffect(() => () => {
    ae != null && ae.url && URL.revokeObjectURL(ae.url);
  }, [ae == null ? void 0 : ae.url]), r.useEffect(() => {
    ye(""), $([]), B(""), Ne(""), Ce(null), Oe(""), ue(null);
  }, [h, V, G]), r.useEffect(() => {
    let b = !1;
    return q(!0), le(null), B(""), (async () => {
      try {
        if (Y && Ot) {
          const ge = await Ut("/api/v1/platform-archives"), Ke = await ge.json();
          if (!ge.ok) throw new Error(Ke.message);
          b || ie(Ke.items);
        } else if (Y) {
          const ge = await Be("/samples");
          b || je(ge.items);
        } else if (L) {
          const ge = await Be("/" + L);
          b || le(ge);
        } else {
          const ge = await Be(`?project_id=${V}${G ? "&state=" + G : ""}${fe ? "&cursor=" + encodeURIComponent(fe) : ""}`);
          b || (K(ge.items), Ee(ge.next_cursor));
        }
      } catch (ge) {
        b || B(ge.message);
      } finally {
        b || q(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [h, V, G, fe, ne]), r.useEffect(() => {
    if (Ot || !Y || !Ae) return;
    let b = !1;
    ue(null), Ie("");
    const ve = Xe + "." + (Ue === "v2" ? "complete" : Ue);
    return Be(`/samples/${Ue}?project_id=${V}&task_id=${ve}`).then((ge) => {
      b || Ie(JSON.stringify(ge, null, 2));
    }).catch((ge) => {
      b || B(ge.message);
    }), () => {
      b = !0;
    };
  }, [Y, V, Ue, Xe]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !L && R.some((ge) => ["received", "validating", "processing"].includes(ge.status))) || Y) return;
    const ve = setInterval(() => X((ge) => ge + 1), 1800);
    return () => clearInterval(ve);
  }, [k == null ? void 0 : k.status, R, h]);
  const tt = () => Qe(async () => {
    const b = Ze.current;
    ue(null);
    const ve = await Be("/preview", { method: "POST", body: he });
    Ze.current === b && ue(ve);
  }), rt = () => Qe(async () => {
    var ve;
    if (!Q) return;
    ((ve = Ge.current) == null ? void 0 : ve.hash) !== Q.content_hash && (Ge.current = { hash: Q.content_hash, key: crypto.randomUUID() });
    const b = await Be("", { method: "POST", headers: { "Idempotency-Key": Ge.current.key }, body: he });
    Ne(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + b.receipt_id);
  }), pe = (b) => Qe(async () => {
    const ve = Ze.current;
    Ce(null);
    const ge = await Ut(`/api/v1/task-packages/${L}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!ge.ok) {
      const jt = await ge.json().catch(() => ({}));
      throw new Error(jt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Ke = await ge.blob();
    if (ve === Ze.current)
      if (b.mime_type.startsWith("text/")) {
        const jt = await Ke.slice(0, 1e6).text();
        ve === Ze.current && Ce({ id: b.attachment_id, url: null, text: jt });
      } else if (b.mime_type.startsWith("image/")) Ce({ id: b.attachment_id, url: URL.createObjectURL(Ke), text: null });
      else {
        const jt = URL.createObjectURL(Ke), U = document.createElement("a");
        U.href = jt, U.download = "任务附件", U.click(), URL.revokeObjectURL(jt);
      }
  }), it = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !me.length || f, onClick: () => {
        ye(me.at(-1) || ""), $(me.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !_e || f, onClick: () => {
        $([...me, fe]), ye(_e || "");
      }, children: "下一页" })
    ] })
  ] });
  return S.length ? Ve && Y ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Cf, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Ot ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Ve ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: Y ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !Ve && S.some((b) => zt(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: Y ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Ce(null), X((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    g && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      g
    ] }),
    se && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      se
    ] }),
    !L && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (b) => H(b.target.value), children: S.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !Y && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: G, onChange: (b) => j(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: kn[b] }, b))
        ] })
      ] })
    ] }),
    f ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : Y ? Ae ? Ot ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
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
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Qe(async () => {
            const ve = await Ut("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), ge = await ve.json();
            if (!ve.ok) throw new Error(ge.message);
            o("/task-packages/" + ge.receipt_id);
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Ue, onChange: (b) => Le(b.target.value), children: M.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, onClick: () => He("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: I, onChange: (b) => {
              var ge;
              const ve = (ge = b.target.files) == null ? void 0 : ge[0];
              if (ve) {
                if (ve.size > 5242880) {
                  B("文件超过5MiB上限。");
                  return;
                }
                ve.text().then((Ke) => {
                  Ie(Ke), ue(null), B("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: he, onChange: (b) => {
              Ie(b.target.value), ue(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I || !he, onClick: () => void tt(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !Q, onClick: () => void rt(), children: [
              /* @__PURE__ */ s.jsx(Jf, { size: 16 }),
              I ? "正在处理…" : "确认接入归档成果"
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
          ((O = S.find((b) => b.id === Q.project_id)) == null ? void 0 : O.name) || Q.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(Q.counts).map(([b, ve]) => /* @__PURE__ */ s.jsxs("span", { children: [
          pu[b],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: ve })
        ] }, b)) }),
        /* @__PURE__ */ s.jsx("p", { children: Q.note }),
        Q.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : L ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: k.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((w = S.find((b) => b.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
              " · 第",
              k.package_version,
              "版 · ",
              kn[k.status],
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
        k.capabilities.map((b) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: pv[b] }, b)),
        k.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        Se && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Qe(async () => {
          const b = await Ut("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), ve = await b.json();
          if (!b.ok) throw new Error(ve.message);
          o("/retrospectives/" + ve.id);
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
          k.validation_errors.map((b, ve) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "e" + ve)),
          k.warnings.map((b, ve) => /* @__PURE__ */ s.jsx("p", { children: b.message }, "w" + ve))
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
            On((F = k.task) == null ? void 0 : F.started_at),
            "　结束：",
            On((we = k.task) == null ? void 0 : we.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((qe = k.participants) == null ? void 0 : qe.map((b) => bu(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (N = k.issues) == null ? void 0 : N.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              On(b.due_at)
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
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (ee = k.events) != null && ee.length ? k.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: On(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? $f[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: yv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === k.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                bu(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((ve) => {
                  var Ke;
                  const ge = (Ke = k.attachments) == null ? void 0 : Ke.find((jt) => jt.attachment_id === ve);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: I || !ge || ge.state !== "verified", onClick: () => ge && void pe(ge), children: [
                    ge ? gu[ge.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ve
                  ] }, ve);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: I, onClick: () => void Qe(async () => {
            const b = await Be("/" + L + "?event_after=" + k.event_next);
            le({ ...b, events: [...k.events || [], ...b.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (z = k.attachments) != null && z.length ? k.attachments.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                gu[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                kn[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I || b.state !== "verified", onClick: () => void pe(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ae && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ce(null), children: "关闭预览" }),
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
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (re = k.versions) == null ? void 0 : re.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === k.id, onClick: () => o("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            kn[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (ce = k.diff) != null && ce.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Je = k.diff) == null ? void 0 : Je.changes.map((b, ve) => {
            var ge, Ke, jt, U, x;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                pu[b.section] || b.section,
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
                  ((ge = b.added) == null ? void 0 : ge.join("、")) || "无",
                  "；移除：",
                  ((Ke = b.removed) == null ? void 0 : Ke.join("、")) || "无"
                ] }),
                b.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (jt = b.before_order) == null ? void 0 : jt.join(" → "),
                  "　调整为　",
                  (U = b.after_order) == null ? void 0 : U.join(" → ")
                ] }),
                (x = b.changed) == null ? void 0 : x.map((de) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      de.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(de.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(de.after) })
                  ] })
                ] }, de.id))
              ] })
            ] }, ve);
          })
        ] }),
        (Re || Se && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          Se && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Qe(async () => {
            const b = await Ut("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            Ne("已提交重试，已保存事件与附件不会重复新增。"), X((ve) => ve + 1);
          }), children: "重试接入" }),
          Re && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: P, maxLength: 2e3, onChange: (b) => Oe(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: I || !P.trim(), onClick: () => void Qe(async () => {
              var ge;
              const b = JSON.stringify({ reason: P }), ve = k.id + b;
              ((ge = Pe.current) == null ? void 0 : ge.body) !== ve && (Pe.current = { body: ve, key: crypto.randomUUID() }), await Be("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": Pe.current.key }, body: b }), Ce(null), X((Ke) => Ke + 1);
            }), children: "撤回此任务包" })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "接收与版本记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "新包接收后，不会立即替换当前可用包" })
      ] }),
      R.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "任务 / 来源" }),
          /* @__PURE__ */ s.jsx("th", { children: "包版本" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "当前可用" }),
          /* @__PURE__ */ s.jsx("th", { children: "资料提示" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: R.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
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
          /* @__PURE__ */ s.jsx("td", { children: kn[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Cf, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      it
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function Wf(u, h, S, o) {
  const Y = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(S) });
  o();
  const L = Date.now() + 1200 * 1e3;
  for (; Date.now() < L; ) {
    const V = await u("/model-generation-jobs/" + Y.job_id);
    if (V.status === "succeeded") return V.result;
    if (V.status === "failed") throw new Error(V.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((H) => setTimeout(H, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Cn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Nv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Sv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Gi = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function wv({ api: u, path: h, navigate: S, projects: o, identity: Y }) {
  var ee;
  const L = h.split("/")[2], V = h.endsWith("/review"), [H, G] = r.useState([]), [j, R] = r.useState(null), [K, k] = r.useState(null), [le, fe] = r.useState(!1), [ye, _e] = r.useState(!0), [Ee, me] = r.useState(""), [$, oe] = r.useState(""), [ie, M] = r.useState(0), [je, Ue] = r.useState("llm"), [Le, Xe] = r.useState("task_process"), [He, he] = r.useState(((ee = o.find((z) => zt(z, "retrospective.generate"))) == null ? void 0 : ee.id) || ""), [Ie, Q] = r.useState([]), [ue, g] = r.useState(""), [B, se] = r.useState([]), [Ne, f] = r.useState([]), [q, I] = r.useState(""), [Z, ne] = r.useState(!1), [X, P] = r.useState(""), [Oe, ae] = r.useState(""), [Ce, Ge] = r.useState(""), [Pe, Ze] = r.useState(null), [Ve, Ae] = r.useState([]), [Re, Se] = r.useState(null), [Be, Qe] = r.useState(""), [tt, rt] = r.useState(""), pe = o.some((z) => zt(z, "retrospective.generate")), it = !!(j != null && j.is_current) && !!zt(o.find((z) => z.id === j.project_id), "retrospective.edit"), Me = !!(j != null && j.is_current) && !!zt(o.find((z) => z.id === j.project_id), "retrospective.review");
  r.useEffect(() => {
    P(""), I(""), ne(!1), me(""), oe(""), Ge(""), Ae([]), Se(null);
  }, [h]), r.useEffect(() => {
    let z = !1;
    return _e(!0), R(null), me(""), (async () => {
      try {
        if (L) {
          const ce = await u(`/retrospectives/${L}${X ? "?revision_id=" + X : ""}`);
          z || (R(ce), k({ summary: ce.summary, findings: structuredClone(ce.findings), suggestions: structuredClone(ce.suggestions) }), ne(!1));
        } else {
          const ce = await u(`/retrospectives?limit=20${Oe ? "&state=" + Oe : ""}${Ce ? "&cursor=" + encodeURIComponent(Ce) : ""}`);
          z || (G(ce.items), Ze(ce.next_cursor));
        }
      } catch (ce) {
        z || me(ce.message);
      } finally {
        z || _e(!1);
      }
    })(), () => {
      z = !0;
    };
  }, [L, h, X, Oe, Ce, ie]), r.useEffect(() => {
    if (L || !He || !pe) return;
    let z = !1;
    return f([]), Q([]), se([]), g(""), (async () => {
      var ce;
      try {
        const [Je, b] = await Promise.all([u(`/task-packages?project_id=${He}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${He}&limit=100`)]);
        if (z) return;
        const ve = Je.items.filter((ge) => ge.is_current);
        Q(ve), g(((ce = ve[0]) == null ? void 0 : ce.id) || ""), se(b.items);
      } catch (Je) {
        z || me(Je.message);
      }
    })(), () => {
      z = !0;
    };
  }, [L, He, ie]), r.useEffect(() => {
    if (!(Re != null && Re.asset_id) || Re.type !== "task_attachment") {
      Qe(""), rt("");
      return;
    }
    let z = !1, re = "";
    return Ut("/api/v1/assets/" + Re.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + Y } }).then(async (ce) => {
      if (!ce.ok) {
        const b = await ce.json();
        throw new Error(b.message);
      }
      const Je = await ce.blob();
      !z && /^(image\/|text\/plain)/.test(Je.type) && (re = URL.createObjectURL(Je), Qe(re), rt(Je.type));
    }).catch((ce) => {
      z || me(ce.message);
    }), () => {
      z = !0, re && URL.revokeObjectURL(re), Qe("");
    };
  }, [Re, Y]);
  const O = async (z) => {
    fe(!0), me(""), oe("");
    try {
      await z();
    } catch (re) {
      me(re.message);
    } finally {
      fe(!1);
    }
  }, w = () => ({ revision_id: j.revision_id, row_version: j.row_version, reason: q, evidence_checked: Z }), F = !!j && !!K && JSON.stringify(K) === JSON.stringify({ summary: j.summary, findings: j.findings, suggestions: j.suggestions }), we = (z) => void O(async () => {
    const re = z === "submit" ? `/retrospectives/${L}/submit-review` : `/reviews/${j.revision_id}/${z}`;
    await u(re, { method: "POST", body: JSON.stringify(w()) }), oe("已保存本版本的审核状态与意见。"), M((ce) => ce + 1);
  }), qe = (z, re) => z.map((ce, Je) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + ce.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Nv[ce.claim_kind] }),
      ce.record_status && /* @__PURE__ */ s.jsx("strong", { children: ce.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: ce.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && it ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + ce.id, value: ce.text, onChange: (b) => k((ve) => ve && { ...ve, [re]: ve[re].map((ge, Ke) => Ke === Je ? { ...ge, text: b.target.value, review_state: "unconfirmed" } : ge) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: ce.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: ce.evidence_refs.map((b, ve) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => Se(j.evidence.find((ge) => ge.id === b) || null), children: [
      "查看证据 ",
      ve + 1
    ] }, b)) }),
    V && it && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ce.review_state === "confirmed", onChange: (b) => k((ve) => ve && { ...ve, [re]: ve[re].map((ge, Ke) => Ke === Je ? { ...ge, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : ge) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, ce.id)), N = (z) => z.map((re) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Gi(re.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Sv[re.event_type] || "未知事件类型：" + re.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof re.payload.note == "string" ? re.payload.note : Object.keys(re.payload).length ? JSON.stringify(re.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Se(j.evidence.find((ce) => ce.reference === "event:" + re.event_id) || null), children: "打开事件记录" }),
    re.evidence_refs.map((ce) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Je = j.evidence.find((b) => b.reference === "attachment:" + ce);
      Je ? Se(Je) : me("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      ce
    ] }, ce))
  ] }, re.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx($j, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Ee && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ee,
      /* @__PURE__ */ s.jsx("button", { onClick: () => M((z) => z + 1), children: "重新加载" })
    ] }),
    $ && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      $
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => M((z) => z + 1), disabled: le, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : L ? j && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: j.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            j.version,
            " · ",
            Cn[j.state],
            " · ",
            j.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            j.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: j.revision_id, onChange: (z) => P(z.target.value), children: j.revisions.map((z) => /* @__PURE__ */ s.jsxs("option", { value: z.id, children: [
            "v",
            z.version,
            " · ",
            Cn[z.state]
          ] }, z.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => S(`/retrospectives/${L}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !j.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && it ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: K.summary, onChange: (z) => k({ ...K, summary: z.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: j.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            j.sources.task_package_id ? "固定任务包 v" + j.sources.package_version : "固定历史版本 " + j.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          j.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/task-packages/" + j.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            j.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: N(j.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            j.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: N(j.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            j.timeline.intervals.length ? j.timeline.intervals.map((z, re) => /* @__PURE__ */ s.jsxs("p", { children: [
              z.name,
              "：",
              z.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, re)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            j.timeline.deadlines.length ? j.timeline.deadlines.map((z) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                z.issue_id,
                " · ",
                z.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: z.reason || `明确期限 ${Gi(z.due_at || null)}；复核记录 ${Gi(z.accepted_at || null)}；晚于期限 ${z.late_seconds / 60} 分钟。` })
            ] }, z.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
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
      V && j.is_current && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ s.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: q, onChange: (z) => I(z.target.value) })
          ] }),
          it && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le || F || !q.trim(), onClick: () => void O(async () => {
              await u(`/retrospectives/${L}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), oe("已保存新草稿版本，旧内容及审核意见保留。"), M((z) => z + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(j.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !F || !q.trim(), onClick: () => we("submit"), children: "提交当前版本审核" })
          ] }),
          Me && j.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Z, onChange: (z) => ne(z.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !Z || !F || !q.trim(), onClick: () => we("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || !F || !q.trim(), onClick: () => we("request-changes"), children: "退回修改" })
            ] })
          ] }),
          it && j.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !F || !q.trim(), onClick: () => void O(async () => {
            const z = await u(`/retrospectives/${L}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            oe(z.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), M((re) => re + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      j.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: j.draft_ids.map((z) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => S("/knowledge/" + z + "/edit"), children: "打开经验候选" }, z)) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "审核轨迹与来源指纹" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsx("p", { className: "retro-hash", children: j.input_fingerprint }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "摘要适配器：",
            j.model_ref
          ] })
        ] }),
        j.review_actions.map((z, re) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            z.version,
            " · ",
            Cn[z.action] || z.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: z.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Gi(z.created_at) })
        ] }, re))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      pe && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: je, onChange: (z) => Ue(z.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Le, onChange: (z) => Xe(z.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: He, onChange: (z) => he(z.target.value), children: o.filter((z) => zt(z, "retrospective.generate")).map((z) => /* @__PURE__ */ s.jsx("option", { value: z.id, children: z.name }, z.id)) })
            ] })
          ] }),
          Le === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: ue, onChange: (z) => g(z.target.value), children: Ie.map((z) => /* @__PURE__ */ s.jsxs("option", { value: z.id, children: [
              z.name,
              " · 包v",
              z.package_version
            ] }, z.id)) }),
            !Ie.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: B.map((z) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne.includes(z.record_version_id), onChange: (re) => f(re.target.checked ? [...Ne, z.record_version_id] : Ne.filter((ce) => ce !== z.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              z.description || "未填写描述",
              " · 来源v",
              z.current_version
            ] })
          ] }, z.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Le === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || (Le === "task_process" ? !ue : !Ne.length || Ne.length > 20), onClick: () => void O(async () => {
              const z = await Wf(u, "/retrospective-generation-jobs", { mode: Le, generation_mode: je, task_package_id: Le === "task_process" ? ue : null, record_version_ids: Le === "historical_case" ? Ne : [], template_version: "process-review-v1" }, () => oe("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              S("/retrospectives/" + z.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Oe, onChange: (z) => {
            ae(z.target.value), Ge(""), Ae([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((z) => /* @__PURE__ */ s.jsx("option", { value: z, children: Cn[z] }, z))
          ] })
        ] }),
        H.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: H.map((z) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              z.title,
              /* @__PURE__ */ s.jsx("small", { children: z.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: z.sources.task_package_id ? "任务包 v" + z.sources.package_version : z.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              z.version,
              " · ",
              Cn[z.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/retrospectives/" + z.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/retrospectives/" + z.id + "/review"), children: "核查与审核" })
            ] })
          ] }, z.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !Ve.length, onClick: () => {
              Ge(Ve.at(-1) || ""), Ae(Ve.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !Pe, onClick: () => {
              Ae([...Ve, Ce]), Ge(Pe || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    Re && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => Se(null), children: /* @__PURE__ */ s.jsx(Xi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Re.type === "process_event" ? "实际事件记录" : Re.type === "task_attachment" ? "任务附件" : Re.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: Re.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(Re.locator)
      ] }),
      Be && tt.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: Be, alt: "来源证据" }),
      Be && tt.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: Be }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const ks = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, _a = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Bf = { selected: [], text: "", row_version: 0 };
function kv({ api: u, path: h, navigate: S, projects: o }) {
  var ke, lt, vt;
  const Y = h.startsWith("/learn"), L = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || L ? h.split("/")[3] : "", H = /^\/training\/questions\/[^/]+$/.test(h), G = H ? h.split("/")[3] : "", j = h === "/training/questions", R = h === "/training/packages", K = h === "/training/results", k = o.some((m) => zt(m, "training.manage")), le = o.some((m) => zt(m, "training.review")), [fe, ye] = r.useState("llm"), [_e, Ee] = r.useState(""), [me, $] = r.useState(((ke = o.find((m) => zt(m, "training.manage"))) == null ? void 0 : ke.id) || ((lt = o[0]) == null ? void 0 : lt.id) || ""), [oe, ie] = r.useState([]), [M, je] = r.useState([]), [Ue, Le] = r.useState([]), [Xe, He] = r.useState([]), [he, Ie] = r.useState(null), [Q, ue] = r.useState(null), [g, B] = r.useState(""), [se, Ne] = r.useState(!1), [f, q] = r.useState([]), [I, Z] = r.useState(["single_choice", "case_answer"]), [ne, X] = r.useState([]), [P, Oe] = r.useState("新人风险识别与复盘练习"), [ae, Ce] = r.useState("learning-" + Date.now()), [Ge, Pe] = r.useState(1), [Ze, Ve] = r.useState(null), [Ae, Re] = r.useState({}), [Se, Be] = r.useState(null), [Qe, tt] = r.useState("rules"), [rt, pe] = r.useState("useful"), [it, Me] = r.useState(""), [O, w] = r.useState({}), [F, we] = r.useState({}), [qe, N] = r.useState(""), [ee, z] = r.useState(""), [re, ce] = r.useState(null), [Je, b] = r.useState([]), [ve, ge] = r.useState(!0), [Ke, jt] = r.useState(!1), [U, x] = r.useState(""), [de, be] = r.useState(""), [nt, _] = r.useState(0);
  r.useEffect(() => {
    z(""), b([]), B(""), Ne(!1), be(""), x(""), X([]);
  }, [h]), r.useEffect(() => {
    let m = !1;
    return ge(!0), x(""), Ie(null), Ve(null), Be(null), (async () => {
      try {
        if (V)
          if (L) {
            const ze = await u(`/training/attempts/${V}/result?teacher=true`);
            m || Be(ze);
          } else {
            const ze = await u("/training/attempts/" + V);
            if (m) return;
            if (Ve(ze), Re(Object.fromEntries(ze.saved_answers.map((st) => [st.question_revision_id, { ...st.answer, row_version: st.row_version }]))), ze.state === "submitted") {
              const st = await u(`/training/attempts/${V}/result`);
              m || Be(st);
            }
          }
        else if (H) {
          const ze = await u("/training/questions/" + G);
          m || (Ie(ze), ue(structuredClone(ze.content)));
        } else if (Y) {
          const [ze, st] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          m || (je(ze.items), He(st.items));
        } else if (K) {
          const ze = await u(`/training/results?limit=20${ee ? "&cursor=" + ee : ""}`);
          m || (He(ze.items), ce(ze.next_cursor));
        } else if (R) {
          const [ze, st] = await Promise.all([u(`/training/packages?limit=20${ee ? "&cursor=" + ee : ""}`), u("/training/questions?state=approved&limit=100")]);
          m || (je(ze.items), ie(st.items), ce(ze.next_cursor));
        } else {
          const [ze, st] = await Promise.all([u(`/training/questions?limit=20${qe ? "&state=" + qe : ""}${ee ? "&cursor=" + ee : ""}`), u("/knowledge/library?limit=100&project_id=" + me)]);
          m || (ie(ze.items), Le(st.items), ce(ze.next_cursor));
        }
      } catch (ze) {
        m || x(ze.message);
      } finally {
        m || ge(!1);
      }
    })(), () => {
      m = !0;
    };
  }, [h, me, qe, ee, nt]), r.useEffect(() => {
    if (!(Se != null && Se.grading_job) || !["queued", "running", "retrying"].includes(Se.grading_job.status)) return;
    const m = window.setTimeout(() => _((Te) => Te + 1), 1800);
    return () => clearTimeout(m);
  }, [(vt = Se == null ? void 0 : Se.grading_job) == null ? void 0 : vt.status, nt]);
  const xe = async (m) => {
    jt(!0), x(""), be("");
    try {
      await m();
    } catch (Te) {
      x(Te.message);
    } finally {
      jt(!1);
    }
  }, $e = !!he && !!Q && JSON.stringify(Q) === JSON.stringify(he.content), Ct = () => ({ revision_id: he.revision_id, row_version: he.row_version, reason: g, evidence_checked: se }), Lt = (m) => void xe(async () => {
    await u(m === "submit" ? `/training/questions/${G}/submit-review` : `/reviews/${he.revision_id}/${m}`, { method: "POST", body: JSON.stringify(Ct()) }), be("题目审核状态已保存到统一审核记录。"), _((Te) => Te + 1);
  }), Yt = async (m) => {
    const Te = Ae[m.revision_id] || Bf, ze = await u(`/training/attempts/${V}/answers/${m.question_id}`, { method: "PUT", body: JSON.stringify(Te) });
    return Re((st) => ({ ...st, [m.revision_id]: { ...Te, row_version: ze.row_version } })), ze;
  }, ut = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Je.length, onClick: () => {
        z(Je.at(-1) || ""), b(Je.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !re, onClick: () => {
        b([...Je, ee]), z(re || "");
      }, children: "下一页" })
    ] })
  ] }), Nt = (m, Te, ze) => ze ? [...m, Te] : m.filter((st) => st !== Te), p = (m) => void xe(async () => {
    const Te = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: m.id, grading_mode: Qe }) });
    S("/learn/attempts/" + Te.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Ji, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Y ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    U && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      U
    ] }),
    de && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      de
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !Y && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: j || H ? "selected" : "", onClick: () => S("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: R ? "selected" : "", onClick: () => S("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || L ? "selected" : "", onClick: () => S("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: Y ? "selected" : "", onClick: () => S("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => _((m) => m + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ve ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : Se ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: ks[Se.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: Se.confirmed_total === null ? "待确认" : Se.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: Se.provisional_total === null ? "待评分" : Se.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: Se.max_score })
            ] })
          ] }),
          Se.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              Se.grading_job.status === "failed" ? "暂未完成" : Se.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            Se.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: Se.grading_job.error }),
            L && k && Se.grading_job.status === "failed" && Se.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke, onClick: () => void xe(async () => {
              await u("/jobs/" + Se.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Se.grading_job.row_version }) }), _((m) => m + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          Se.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: Se.restriction_note }),
          Se.answers.map((m, Te) => {
            var ze, st, Xt, Cs, Us, Dt, Ea, Oa;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Te + 1,
                "题 ",
                m.type ? _a[m.type] : ""
              ] }),
              m.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((ze = m.answer) == null ? void 0 : ze.text) || ((st = m.answer) == null ? void 0 : st.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Xt = m.reference_answer) == null ? void 0 : Xt.text) || ((Us = (Cs = m.reference_answer) == null ? void 0 : Cs.selected) == null ? void 0 : Us.join("、"))
                ] }),
                (Dt = m.rubric) == null ? void 0 : Dt.map((Ft, Ps) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  Ft.point,
                  " · ",
                  Ft.points,
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
              L && k && m.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: O[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? ""), onChange: (Ft) => w({ ...O, [m.id]: Ft.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: F[m.id] || "", onChange: (Ft) => we({ ...F, [m.id]: Ft.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke || !(F[m.id] || "").trim() || (O[m.id] ?? String(m.confirmed_score ?? m.suggested_score ?? "")) === "", onClick: () => void xe(async () => {
                  await u("/training/answers/" + m.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: m.row_version, score: Number(O[m.id] ?? m.confirmed_score ?? m.suggested_score), reason: F[m.id] }) }), be("人工确认分已保存，原建议分和复核轨迹保留。"), _((Ft) => Ft + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, m.id);
          })
        ] })
      ] }),
      !L && Se.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: rt, onChange: (m) => pe(m.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: it, onChange: (m) => Me(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke, onClick: () => void xe(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: rt, comment: it }) }), be("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : Ze ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          Ze.package_title,
          " · v",
          Ze.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      Ze.questions.map((m) => {
        const Te = Ae[m.revision_id] || Bf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            m.position,
            "题 · ",
            _a[m.type],
            " · ",
            m.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: m.stem }),
          m.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + m.position + "题回答", value: Te.text, onChange: (ze) => Re({ ...Ae, [m.revision_id]: { ...Te, text: ze.target.value } }) })
          ] }) : m.options.map((ze) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: m.type === "single_choice" ? "radio" : "checkbox", name: m.revision_id, checked: Te.selected.includes(ze.id), onChange: (st) => Re({ ...Ae, [m.revision_id]: { ...Te, selected: m.type === "single_choice" ? [ze.id] : Nt(Te.selected, ze.id, st.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              ze.id.toUpperCase(),
              " · ",
              ze.text
            ] })
          ] }, ze.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke, onClick: () => void xe(async () => {
              await Yt(m), be("第" + m.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Te.row_version
            ] })
          ] })
        ] }, m.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ke, onClick: () => void xe(async () => {
        for (const m of Ze.questions) await Yt(m);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), _((m) => m + 1), be("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : H && he && Q ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            _a[he.type],
            " · v",
            he.version,
            " · ",
            ks[he.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: he.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: Q.stem, disabled: !k, onChange: (m) => ue({ ...Q, stem: m.target.value }) })
          ] }),
          Q.options.map((m, Te) => {
            var ze;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              m.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: m.text, disabled: !k, onChange: (st) => ue({ ...Q, options: Q.options.map((Xt, Cs) => Cs === Te ? { ...Xt, text: st.target.value } : Xt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((ze = Q.answer.selected) == null ? void 0 : ze.includes(m.id)) || !1, onChange: (st) => ue({ ...Q, answer: { selected: Nt(Q.answer.selected || [], m.id, st.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, m.id);
          }),
          he.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: Q.answer.text || "", disabled: !k, onChange: (m) => ue({ ...Q, answer: { text: m.target.value } }) })
            ] }),
            Q.rubric.map((m, Te) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: m.point, disabled: !k, onChange: (ze) => ue({ ...Q, rubric: Q.rubric.map((st, Xt) => Xt === Te ? { ...st, point: ze.target.value } : st) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: m.keywords.join("，"), disabled: !k, onChange: (ze) => ue({ ...Q, rubric: Q.rubric.map((st, Xt) => Xt === Te ? { ...st, keywords: ze.target.value.split(/[,，]/).filter(Boolean) } : st) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: m.points, disabled: !k, onChange: (ze) => ue({ ...Q, rubric: Q.rubric.map((st, Xt) => Xt === Te ? { ...st, points: Number(ze.target.value) } : st) }) })
              ] })
            ] }, Te))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          he.source_versions.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: m }) }, m)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: g, onChange: (m) => B(m.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke || $e || !g.trim(), onClick: () => void xe(async () => {
              await u(`/training/questions/${G}/draft`, { method: "PATCH", body: JSON.stringify({ ...Ct(), content: Q }) }), be("新题目版本已保存，不改变旧学习包与成绩。"), _((m) => m + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(he.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ke || !$e || !g.trim(), onClick: () => Lt("submit"), children: "提交题目审核" })
          ] }),
          le && he.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se, onChange: (m) => Ne(m.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ke || !se || !$e || !g.trim(), onClick: () => Lt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ke || !$e || !g.trim(), onClick: () => Lt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          he.revisions.map((m) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            ks[m.state]
          ] }, m.id)),
          he.review_actions.map((m, Te) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            m.version,
            " · ",
            ks[m.action] || m.action,
            " · ",
            m.reason
          ] }, Te))
        ] })
      ] })
    ] }) : Y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: Qe, onChange: (m) => tt(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Ot && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          M.length ? M.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: m.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              m.version,
              " · ",
              m.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ke, onClick: () => p(m), children: "开始本次练习" })
          ] }, m.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Xe.map((m) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => S("/learn/attempts/" + m.id), children: [
            ks[m.state],
            " · ",
            ks[m.result_state],
            " · ",
            new Date(m.started_at).toLocaleString("zh-CN")
          ] }) }, m.id)),
          !Xe.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
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
        /* @__PURE__ */ s.jsx("tbody", { children: Xe.map((m) => {
          var Te;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              m.title,
              " · v",
              m.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Te = m.learner_id) == null ? void 0 : Te.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              ks[m.state],
              " · ",
              ks[m.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m.state !== "submitted", onClick: () => S("/training/results/" + m.id), children: "查看结果与复核" }) })
          ] }, m.id);
        }) })
      ] }) }),
      ut
    ] }) : R ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
                $(m.target.value), X([]);
              }, children: o.filter((m) => zt(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: _e, onChange: (m) => Ee(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: P, onChange: (m) => Oe(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ae, onChange: (m) => Ce(m.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: Ge, onChange: (m) => Pe(Number(m.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: oe.filter((m) => m.project_id === me).map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ne.includes(m.revision_id), onChange: (Te) => X((ze) => Nt(ze, m.revision_id, Te.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              _a[m.type],
              " · ",
              m.title,
              " · v",
              m.version
            ] })
          ] }, m.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ke || !ne.length || ne.length > 30 || !P.trim(), onClick: () => void xe(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: P, package_key: ae, version: Ge, project_id: me, question_revision_ids: ne, role_scope: ["learner", "admin", "teacher"], audience_subjects: _e.split(/[,，\n]/).map((m) => m.trim()).filter(Boolean) }) }), be("学习包草稿已建立，发布后学员可使用。"), _((m) => m + 1);
          }), children: [
            "创建学习包草稿（",
            ne.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: M.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
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
          m.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ke, onClick: () => void xe(async () => {
            await u(`/training/packages/${m.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: m.row_version, reason: "发布已审核题目的固定版本学习包" }) }), be("学习包已发布。"), _((Te) => Te + 1);
          }), children: "发布此学习包版本" })
        ] }, m.id)) }),
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
            /* @__PURE__ */ s.jsx("select", { value: me, onChange: (m) => {
              $(m.target.value), q([]);
            }, children: o.filter((m) => zt(m, "training.manage")).map((m) => /* @__PURE__ */ s.jsx("option", { value: m.id, children: m.name }, m.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Ue.map((m) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: f.includes(m.revision_id), onChange: (Te) => q((ze) => Nt(ze, m.revision_id, Te.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                m.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  m.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, m.revision_id)),
            !Ue.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(_a).map(([m, Te]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: I.includes(m), onChange: (ze) => Z((st) => Nt(st, m, ze.target.checked)) }),
            Te
          ] }, m)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: fe, onChange: (m) => ye(m.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ke || !f.length || f.length > 10 || !I.length, onClick: () => void xe(async () => {
            const m = await Wf(u, "/training/generation-jobs", { knowledge_revision_ids: f, types: I, generation_mode: fe }, () => be("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            be("已生成或复用" + m.items.length + "道候选题，仍需核查答案与来源后提交审核。"), _((Te) => Te + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: qe, onChange: (m) => {
            N(m.target.value), z(""), b([]);
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
            /* @__PURE__ */ s.jsx("td", { children: _a[m.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              m.version,
              " · ",
              ks[m.state],
              m.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/training/questions/" + m.id), children: "核查与审核" }) })
          ] }, m.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        ut
      ] })
    ] })
  ] });
}
function Cv({ api: u }) {
  var Ee, me;
  const [h, S] = r.useState(null), [o, Y] = r.useState([]), [L, V] = r.useState("openai"), [H, G] = r.useState(""), [j, R] = r.useState(!1), [K, k] = r.useState(""), [le, fe] = r.useState("");
  r.useEffect(() => {
    let $ = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([oe, ie]) => {
      if ($) return;
      Y(ie.items);
      const M = ie.items.find((je) => je.base_url === oe.base_url);
      if (!oe.model && !oe.api_key_configured) {
        const je = ie.items[0];
        V(je.id), S({ ...oe, base_url: je.base_url, model: je.default_model });
      } else
        V((M == null ? void 0 : M.id) || "custom"), S(oe);
    }).catch((oe) => {
      $ || k(oe.message);
    }), () => {
      $ = !0;
    };
  }, []);
  const ye = ($) => {
    const oe = o.find((ie) => ie.id === $);
    V($), G(""), fe(""), k(""), h && S({ ...h, base_url: (oe == null ? void 0 : oe.base_url) || "", model: (oe == null ? void 0 : oe.default_model) || "", api_key_configured: !1 });
  }, _e = async () => {
    if (h) {
      R(!0), k(""), fe("");
      try {
        const { api_key_configured: $, ...oe } = h, ie = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !0, ...H ? { api_key: H } : {} }) });
        if (S(ie), G(""), fe("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        fe("连接测试通过，可以开始知识萃取和案例评分。");
      } catch ($) {
        fe(""), k($.message);
      } finally {
        R(!1);
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
      le && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: le }),
      h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "模型服务",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: j, value: L, onChange: ($) => ye($.target.value), children: [
            o.map(($) => /* @__PURE__ */ s.jsx("option", { value: $.id, children: $.name }, $.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        L === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: j, value: h.base_url, onChange: ($) => S({ ...h, base_url: $.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: j, value: h.model, onChange: ($) => S({ ...h, model: $.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: j, value: h.model, onChange: ($) => S({ ...h, model: $.target.value }), children: [
            !((Ee = o.find(($) => $.id === L)) != null && Ee.models.some(($) => $.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (me = o.find(($) => $.id === L)) == null ? void 0 : me.models.map(($) => /* @__PURE__ */ s.jsx("option", { value: $.id, children: $.name }, $.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: j, value: H, onChange: ($) => G($.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: h.timeout_seconds, onChange: ($) => S({ ...h, timeout_seconds: Number($.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: h.max_tokens, onChange: ($) => S({ ...h, max_tokens: Number($.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            h.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: j || !h.model || !H.trim() && !h.api_key_configured, onClick: () => void _e(), children: j ? "正在保存并测试…" : "保存并测试" }),
          h.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: j, onClick: () => {
            R(!0), k("");
            const { api_key_configured: $, ...oe } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !1 }) }).then((ie) => {
              S(ie), fe("云端调用已停用。");
            }).catch((ie) => k(ie.message)).finally(() => R(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Ev = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Ov({ api: u, path: h, navigate: S, projects: o, identity: Y, canManageModels: L }) {
  var I, Z, ne;
  const V = h === "/settings/models", H = L, G = o.some((X) => X.can_run), [j, R] = r.useState(((I = o.find((X) => X.can_run)) == null ? void 0 : I.id) || ""), [K, k] = r.useState([]), [le, fe] = r.useState([]), [ye, _e] = r.useState(null), [Ee, me] = r.useState(Ev), [$, oe] = r.useState("llm"), [ie, M] = r.useState(sessionStorage.getItem("b07-extraction-" + Y) || ""), [je, Ue] = r.useState(null), [Le, Xe] = r.useState(!1), [He, he] = r.useState(!0), [Ie, Q] = r.useState(""), [ue, g] = r.useState(""), [B, se] = r.useState(0), Ne = async (X) => {
    Xe(!0), Q(""), g("");
    try {
      await X();
    } catch (P) {
      Q(P.message);
    } finally {
      Xe(!1);
    }
  };
  r.useEffect(() => {
    let X = !1;
    return he(!0), Q(""), fe([]), (async () => {
      var Oe;
      try {
        if (V) {
          if (!H) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!G || !j) throw new Error("当前身份没有知识加工权限。");
          const [ae, Ce] = await Promise.all([u(`/knowledge/source-options?project_id=${j}&limit=100`), u(`/knowledge/taxonomies?project_id=${j}`)]);
          X || (k(ae.items), _e(Ce.items[0] || null), me(structuredClone(((Oe = Ce.items[0]) == null ? void 0 : Oe.categories) || Ce.suggested_categories)));
        }
      } catch (ae) {
        X || Q(ae.message);
      } finally {
        X || he(!1);
      }
    })(), () => {
      X = !0;
    };
  }, [h, j, B]), r.useEffect(() => {
    if (!ie || V) return;
    let X = !1, P;
    const Oe = async () => {
      try {
        const ae = await u("/knowledge/extraction-jobs/" + ie);
        if (X) return;
        Ue(ae), ["queued", "running", "retrying"].includes(ae.status) && (P = window.setTimeout(() => void Oe(), 1800));
      } catch (ae) {
        X || Q(ae.message);
      }
    };
    return Oe(), () => {
      X = !0, window.clearTimeout(P);
    };
  }, [ie, h, B]);
  const f = (X, P) => me((Oe) => Oe.map((ae, Ce) => Ce === X ? { ...ae, ...P } : ae)), q = JSON.stringify(Ee) !== JSON.stringify((ye == null ? void 0 : ye.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    Ie && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ie
    ] }),
    ue && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: ue }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: V ? "" : "selected", onClick: () => S("/extraction"), children: "施工要点萃取" }),
        H && /* @__PURE__ */ s.jsx("button", { className: V ? "selected" : "", onClick: () => S("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => se((X) => X + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    He ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && H ? /* @__PURE__ */ s.jsx(Cv, { api: u }) : !V && G ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: j, onChange: (X) => R(X.target.value), children: o.filter((X) => X.can_run).map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            ye ? "分类 v" + ye.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Ee.map((X, P) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (P + 1), value: X.code, onChange: (Oe) => f(P, { code: Oe.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (P + 1), value: X.name, onChange: (Oe) => f(P, { name: Oe.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: X.focus, onChange: (Oe) => f(P, { focus: Oe.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: X.keywords.join("，"), onChange: (Oe) => f(P, { keywords: Oe.target.value.split(/[,，]/).map((ae) => ae.trim()).filter(Boolean) }) })
            ] }),
            Ee.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => me((Oe) => Oe.filter((ae, Ce) => Ce !== P)), children: "移除此类别" })
          ] }, P)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Ee.length >= 100, onClick: () => me([...Ee, { code: "category_" + (Ee.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(ev, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le || !q, onClick: () => void Ne(async () => {
              const X = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: j, expected_version: (ye == null ? void 0 : ye.version) || 0, categories: Ee }) });
              _e(X), me(X.categories), g("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => fe(K.slice(0, 20).map((X) => X.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le.includes(X.record_version_id), onChange: (P) => fe((Oe) => P.target.checked ? [...Oe, X.record_version_id] : Oe.filter((ae) => ae !== X.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              X.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "固定来源 v",
                X.current_version
              ] })
            ] })
          ] }, X.id)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "加工方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: $, onChange: (X) => oe(X.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Le || !ye || q || !le.length || le.length > 20, onClick: () => void Ne(async () => {
            const X = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: le, taxonomy_id: ye.id, mode: $ }) });
            M(X.job_id), sessionStorage.setItem("b07-extraction-" + Y, X.job_id), g("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            le.length,
            "条来源）"
          ] }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "模型自主完成分类、跨记录归纳与证据摘录，人工只核对候选。不会自动批准为有效标准或直接发布。" })
        ] })
      ] }),
      je && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            "最近加工任务 · ",
            je.progress,
            "%"
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: je.status })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          je.error && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: je.error }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "模式：",
            je.result.generation_mode === "llm" ? "云端大模型" : je.result.generation_mode === "mock" ? "本地模板演示" : "等待处理"
          ] }),
          je.result.model && /* @__PURE__ */ s.jsxs("p", { children: [
            "模型：",
            je.result.model.model_ref,
            " · 用量 ",
            JSON.stringify(je.result.model.usage)
          ] }),
          (Z = je.result.items) == null ? void 0 : Z.map((X) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/knowledge/" + X.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            X.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, X.item_id)),
          (ne = je.result.missing_information) == null ? void 0 : ne.map((X, P) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            X
          ] }, P)),
          je.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Le, onClick: () => void Ne(async () => {
            await u("/jobs/" + je.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: je.row_version }) }), se((X) => X + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const ju = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Lf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Yf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, Qi = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Tv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function zv({ embedded: u = !1 }) {
  var nt;
  const [h, S] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, Y] = r.useState(Li()), [L, V] = r.useState(!1), H = o === "/platform/services", G = o.startsWith("/archive-review/"), j = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [R, K] = r.useState(["/sources", "/imports", "/records"].some((_) => Li().startsWith(_))), k = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", le = !k && ["/quality", "/knowledge", "/reviews"].some((_) => o.startsWith(_)), fe = o.startsWith("/training") || o.startsWith("/learn"), ye = o.startsWith("/workflows"), _e = o.startsWith("/standards"), Ee = ye || _e || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", me = o.startsWith("/retrospectives"), $ = o.startsWith("/task-packages"), oe = o === "/records", ie = !j && ["/sources", "/imports", "/records"].some((_) => o.startsWith(_)), [M, je] = r.useState(null), [Ue, Le] = r.useState([]), [Xe, He] = r.useState({}), [he, Ie] = r.useState(!1), [Q, ue] = r.useState(""), [g, B] = r.useState(""), [se, Ne] = r.useState(!0), [f, q] = r.useState(!1), [I, Z] = r.useState(0), [ne, X] = r.useState(""), [P, Oe] = r.useState(""), [ae, Ce] = r.useState(""), [Ge, Pe] = r.useState(null), [Ze, Ve] = r.useState([]), [Ae, Re] = r.useState(null), [Se, Be] = r.useState(!1), [Qe, tt] = r.useState("demo-airport"), [rt, pe] = r.useState("success"), [it, Me] = r.useState(null), [O, w] = r.useState(""), [F, we] = r.useState("processor"), [qe, N] = r.useState("demo-airport"), [ee, z] = r.useState([]);
  async function re(_, xe = {}) {
    const $e = await Ut("/api/v1" + _, {
      ...xe,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...xe.headers }
    });
    if (!$e.ok) {
      const Ct = await $e.json().catch(() => ({}));
      throw new Error(Ct.message || `请求失败（${$e.status}），请刷新后重试。`);
    }
    return $e.json();
  }
  const ce = (_) => {
    var $e, Ct;
    const xe = window;
    u && (($e = xe.QaxcHasPendingEdits) != null && $e.call(xe)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((Ct = xe.QaxcClearPendingEdits) == null || Ct.call(xe), jj(_), Y(Li()), ue(""), Re(null), Ce(""), Ve([]));
  };
  r.useEffect(() => {
    const _ = () => Y(Li());
    return window.addEventListener("popstate", _), window.addEventListener("hashchange", _), () => {
      window.removeEventListener("popstate", _), window.removeEventListener("hashchange", _);
    };
  }, []), r.useEffect(() => {
    const _ = () => V(!0);
    return window.addEventListener("b-session-expired", _), () => window.removeEventListener("b-session-expired", _);
  }, []), r.useEffect(() => {
    let _ = !1;
    Ne(!0), ue(""), je(null), Me(null), Le([]), z([]);
    async function xe() {
      try {
        const $e = await re("/me");
        if (_) return;
        const Ct = window.QaxcProjectNames || {};
        u && ($e.projects = $e.projects.map((ut) => ({ ...ut, name: Ct[ut.id] || ut.name })));
        const Lt = window.QaxcProjectId;
        u && Lt && ($e.projects = $e.projects.filter((ut) => ut.id === Lt)), je($e);
        const Yt = await re("/health");
        if (_ || (Ie(Yt.worker_online), j || H || G || ie || le || k || $ || me || fe || Ee)) return;
        if (o === "/settings/access") {
          if (!$e.projects.some((p) => p.can_manage)) return;
          const [ut, Nt] = await Promise.all([re("/access"), re("/audit-events?limit=10")]);
          if (_) return;
          Me(ut), z(Nt.items), w((p) => {
            var ke;
            return ut.users.some((lt) => lt.id === p) ? p : ((ke = ut.users[0]) == null ? void 0 : ke.id) || "";
          });
        } else {
          const [ut, Nt] = await Promise.all([
            re(`/jobs?limit=12${P ? `&kind=${P}` : ""}${ne ? `&status=${ne}` : ""}${ae ? `&cursor=${encodeURIComponent(ae)}` : ""}`),
            re("/dashboard")
          ]);
          if (_) return;
          Le(ut.items), Pe(ut.next_cursor), He(Nt.counts);
        }
      } catch ($e) {
        _ || ue($e.message);
      } finally {
        _ || Ne(!1);
      }
    }
    return xe(), () => {
      _ = !0;
    };
  }, [h, o, ne, P, ae, I]), r.useEffect(() => {
    if (!M || j || H || G || o === "/settings/access" || ie || le || k || $ || me || fe || Ee) return;
    let _ = !1;
    const xe = window.setInterval(async () => {
      try {
        const [$e, Ct, Lt] = await Promise.all([
          re(`/jobs?limit=12${P ? `&kind=${P}` : ""}${ne ? `&status=${ne}` : ""}${ae ? `&cursor=${encodeURIComponent(ae)}` : ""}`),
          re("/dashboard"),
          re("/health")
        ]);
        if (_) return;
        Le($e.items), Pe($e.next_cursor), He(Ct.counts), Ie(Lt.worker_online), Re((Yt) => Yt ? $e.items.find((ut) => ut.id === Yt.id) || Yt : null), ue("");
      } catch ($e) {
        _ || (ue($e.message), Ie(!1));
      }
    }, 2e3);
    return () => {
      _ = !0, clearInterval(xe);
    };
  }, [h, o, ne, P, ae, M == null ? void 0 : M.id]);
  const Je = async (_) => {
    q(!0), ue(""), B("");
    try {
      await _(), Z((xe) => xe + 1);
    } catch (xe) {
      ue(xe.message);
    } finally {
      q(!1);
    }
  }, b = () => Je(async () => {
    await re("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: Qe, scenario: rt, duration_seconds: 6 })
    }), Be(!1), B("任务已保存，处理服务会自动执行。"), ce("/jobs");
  }), ve = (_) => Je(async () => {
    await re(`/jobs/${_.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: _.row_version })
    }), B("已提交重试，原任务和来源保持不变。");
  }), ge = (_) => Je(async () => {
    const xe = await Ut(`/api/v1/assets/${_.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!xe.ok) {
      const Lt = await xe.json();
      throw new Error(Lt.message);
    }
    const $e = document.createElement("a"), Ct = URL.createObjectURL(await xe.blob());
    $e.href = Ct, $e.download = `演示检查结果-${_.id.slice(0, 8)}.txt`, $e.click(), URL.revokeObjectURL(Ct), B("演示结果已下载。");
  }), Ke = !Ot && (M == null ? void 0 : M.projects.some((_) => _.can_run)), jt = (_) => {
    const xe = M == null ? void 0 : M.projects.find((Ct) => Ct.id === _.project_id);
    if ((xe == null ? void 0 : xe.permissions) == null) return !!(xe != null && xe.can_run);
    const $e = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!$e[_.kind] && xe.permissions.includes($e[_.kind]);
  }, U = M == null ? void 0 : M.projects.some((_) => _.can_manage), x = Object.fromEntries(((M == null ? void 0 : M.projects) || []).map((_) => [_.id, _.name])), de = j ? "A 成果接入" : H ? "平台服务" : G ? "归档成果复盘" : fe ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Ee ? ye ? "隐患分析与知识成果" : _e ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : me ? "过程复盘与经验" : $ ? "归档成果与证据" : k ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : le ? "知识加工与审核" : ie ? oe ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", be = (Xe.queued || 0) + (Xe.running || 0) + (Xe.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(zf, { size: 26 }) }),
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
          /* @__PURE__ */ s.jsx(Ef, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Ef, "我的工作台"], ["/jobs", Bj, "处理任务"]].map(([_, xe, $e]) => {
          const Ct = xe;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String($e), className: o === _ || _ === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => ce(String(_)), children: [
            /* @__PURE__ */ s.jsx(Ct, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String($e) }),
            /* @__PURE__ */ s.jsx(Ws, { size: 15 })
          ] }, String(_));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ie ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": R, "aria-controls": "governance-menu", onClick: () => K((_) => !_), children: [
          /* @__PURE__ */ s.jsx(Yi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(Ws, { className: R ? "expanded" : "", size: 15 })
        ] }),
        R && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([_, xe]) => /* @__PURE__ */ s.jsx("button", { "aria-label": xe, className: o.startsWith(_) ? "active" : "", onClick: () => ce(_), children: xe }, _)) }),
        /* @__PURE__ */ s.jsxs("button", { className: le || Ee ? "nav-item active" : "nav-item", onClick: () => ce("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => ce("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: $ ? "nav-item active" : "nav-item", onClick: () => ce("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: me ? "nav-item active" : "nav-item", onClick: () => ce("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(Sf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: fe ? "nav-item active" : "nav-item", onClick: () => ce(M != null && M.projects.some((_) => _.roles.some((xe) => ["admin", "teacher", "reviewer"].includes(xe))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(Ji, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        !Ot && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => ce("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(cv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Yi, { size: 19 }),
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
    /* @__PURE__ */ s.jsxs("div", { className: u ? "main-shell embedded-main" : "main-shell", children: [
      !u && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx(Ws, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: de })
        ] }),
        Ot ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (_) => {
            localStorage.setItem("b01-identity", _.target.value), S(_.target.value), Re(null), Ce(""), Ve([]), B("");
          }, children: Tv.map(([_, xe]) => /* @__PURE__ */ s.jsx("option", { value: _, children: xe }, _)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !j && !k && !H && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ie ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : fe ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : le || Ee ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : $ ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([_, xe]) => /* @__PURE__ */ s.jsx("button", { className: o === _ ? "button primary" : "button ghost", onClick: () => ce(_), children: xe }, _)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: de }),
            /* @__PURE__ */ s.jsx("p", { children: j ? "指定版本接入、证据校验与过程复盘。" : fe ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : ye ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : _e ? "保存规范原文与适用版本，核对来源后审核发布。" : Ee ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : me ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : $ ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : le ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ie ? oe ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => Z((_) => _ + 1), disabled: se, children: [
              /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
              "刷新"
            ] }),
            !Ot && !ie && !le && !k && !$ && !me && !fe && !Ee && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Ke || f, onClick: () => {
              var _;
              tt(((_ = M == null ? void 0 : M.projects.find((xe) => xe.can_run)) == null ? void 0 : _.id) || "demo-airport"), Be(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(Tf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Ot && !ie && !le && !k && !$ && !me && !fe && !Ee && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(zf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        L && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        Q && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
          Q,
          /* @__PURE__ */ s.jsx("button", { onClick: () => Z((_) => _ + 1), children: "重新加载" })
        ] }),
        g && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
          g,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => B(""), children: /* @__PURE__ */ s.jsx(Xi, { size: 16 }) })
        ] }),
        L ? null : j ? M ? /* @__PURE__ */ s.jsx(Nj, { id: o.split("/").pop(), identity: M.id, projects: M.projects, navigate: ce }) : /* @__PURE__ */ s.jsx("p", { children: Q || "正在读取身份…" }) : se ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Of, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : Q ? null : H ? /* @__PURE__ */ s.jsx(Sj, { navigate: ce }, I) : G ? /* @__PURE__ */ s.jsx(wj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: ce }, o) : fe ? /* @__PURE__ */ s.jsx(kv, { api: re, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [] }, h) : ye ? /* @__PURE__ */ s.jsx(_j, { api: re, projects: (M == null ? void 0 : M.projects) || [], identity: h }, h + ":" + (M == null ? void 0 : M.projects.map((_) => _.id).join(","))) : _e ? /* @__PURE__ */ s.jsx(pj, { api: re, projects: (M == null ? void 0 : M.projects) || [], identity: h }, h + ":" + (M == null ? void 0 : M.projects.map((_) => _.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(xj, { api: re, projects: (M == null ? void 0 : M.projects) || [] }) }) : Ee ? /* @__PURE__ */ s.jsx(Ov, { api: re, identity: h, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [], canManageModels: !!(M != null && M.can_manage_models) }, h) : me ? /* @__PURE__ */ s.jsx(wv, { api: re, identity: h, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [] }, h) : $ ? /* @__PURE__ */ s.jsx(_v, { identity: h, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(vv, { identity: h, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [] }, h) : le ? /* @__PURE__ */ s.jsx(mv, { api: re, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [], identity: h }, h) : oe ? /* @__PURE__ */ s.jsx(fv, { api: re }, h) : ie ? /* @__PURE__ */ s.jsx(dv, { api: re, path: o, navigate: ce, projects: (M == null ? void 0 : M.projects) || [], identity: h }, h) : o === "/settings/access" ? U ? it && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                it.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: it.bindings.map((_) => {
                var xe;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (xe = it.users.find(($e) => $e.id === _.user_id)) == null ? void 0 : xe.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: x[_.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Lf[_.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: _.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: f,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Je(async () => {
                          await re(`/role-bindings/${_.id}`, { method: "DELETE", body: JSON.stringify({ row_version: _.row_version }) }), B("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, _.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Yi, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: O, onChange: (_) => w(_.target.value), children: it.users.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: qe, onChange: (_) => N(_.target.value), children: it.projects.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: F, onChange: (_) => we(_.target.value), children: Object.entries(Lf).filter(([_]) => _ !== "admin" && _ !== "a_service").map(([_, xe]) => /* @__PURE__ */ s.jsx("option", { value: _, children: xe }, _)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f || !O, onClick: () => void Je(async () => {
              await re("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: O, project_id: qe, role: F }) }), B("角色已添加。");
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
            ee.length ? ee.map((_) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[_.action] || _.action }),
              /* @__PURE__ */ s.jsx("span", { children: x[_.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: Qi(_.created_at) })
            ] }, _.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Yi, { size: 38 }),
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
              /* @__PURE__ */ s.jsx("strong", { children: Xe.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Xe.failed ? "danger-color" : "", children: Xe.failed || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "保留原因，可手动重试" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric service", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理服务" }),
              /* @__PURE__ */ s.jsxs("strong", { children: [
                /* @__PURE__ */ s.jsx("i", { className: `dot ${he ? "green" : "orange"}` }),
                he ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: he ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: o === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: P, onChange: (_) => {
                Oe(_.target.value), Ce(""), Ve([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Yf).map(([_, xe]) => /* @__PURE__ */ s.jsx("option", { value: _, children: xe }, _))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ne, onChange: (_) => {
                X(_.target.value), Ce(""), Ve([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(ju).map(([_, xe]) => /* @__PURE__ */ s.jsx("option", { value: _, children: xe }, _))
              ] })
            ] }),
            Ue.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
              /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsx("th", { children: "任务 / 项目" }),
                /* @__PURE__ */ s.jsx("th", { children: "状态" }),
                /* @__PURE__ */ s.jsx("th", { children: "进度" }),
                /* @__PURE__ */ s.jsx("th", { children: "提交时间" }),
                /* @__PURE__ */ s.jsx("th", { children: "操作" })
              ] }) }),
              /* @__PURE__ */ s.jsx("tbody", { children: Ue.map((_) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => Re(_), children: _.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    x[_.project_id] || _.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Yf[_.kind] || _.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${_.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  ju[_.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${_.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    _.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: Qi(_.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  _.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ce("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Re(_), children: "详情" }),
                  _.status === "failed" && jt(_) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: f, onClick: () => void ve(_), children: "重试任务" }),
                  _.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: f, onClick: () => void ge(_), children: /* @__PURE__ */ s.jsx(kf, { size: 17 }) })
                ] }) })
              ] }, _.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(En, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ne ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ne ? "切换筛选条件查看其他任务。" : Ke ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Ke && !ne && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => Be(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(_l, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Ue.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !Ze.length, onClick: () => {
                  Ce(Ze[Ze.length - 1]), Ve(Ze.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !Ge, onClick: () => {
                  Ve([...Ze, ae]), Ce(Ge || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          o !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(Sf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => ce("/sources"), children: [
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
    Se && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => Be(!1), children: /* @__PURE__ */ s.jsx(Xi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: Qe, onChange: (_) => tt(_.target.value), children: M == null ? void 0 : M.projects.filter((_) => _.can_run).map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: rt, onChange: (_) => pe(_.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !he && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Be(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f || !Ke, onClick: () => void b(), children: [
          f ? /* @__PURE__ */ s.jsx(Of, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(Tf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Ae && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => Re(null), children: /* @__PURE__ */ s.jsx(Xi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Ae.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        ju[Ae.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Ae.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: x[Ae.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Ae.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: Qi(Ae.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: Qi(Ae.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Ae.id })
      ] }),
      Ae.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Ae.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Ae.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f, onClick: () => void ge(Ae), children: [
        /* @__PURE__ */ s.jsx(kf, { size: 16 }),
        "下载演示结果"
      ] }),
      (nt = Ae.result_links) == null ? void 0 : nt.map((_) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => ce(_.path), children: _.label }, _.path)),
      Ae.status === "failed" && jt(Ae) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: f, onClick: () => void ve(Ae), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function Av(u) {
  const h = mj.createRoot(u);
  return h.render(/* @__PURE__ */ s.jsx(zv, { embedded: !0 })), () => h.unmount();
}
export {
  Av as mountKnowledge
};
