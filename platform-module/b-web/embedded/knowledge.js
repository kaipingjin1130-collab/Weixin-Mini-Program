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
var cf;
function uj() {
  if (cf) return Nn;
  cf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function S(d, R, B) {
    var V = null;
    if (B !== void 0 && (V = "" + B), R.key !== void 0 && (V = "" + R.key), "key" in R) {
      B = {};
      for (var M in R)
        M !== "key" && (B[M] = R[M]);
    } else B = R;
    return R = B.ref, {
      $$typeof: u,
      type: d,
      key: V,
      ref: R !== void 0 ? R : null,
      props: B
    };
  }
  return Nn.Fragment = h, Nn.jsx = S, Nn.jsxs = S, Nn;
}
var rf;
function dj() {
  return rf || (rf = 1, su.exports = uj()), su.exports;
}
var s = dj(), lu = { exports: {} }, Sn = {}, au = { exports: {} }, nu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uf;
function oj() {
  return uf || (uf = 1, (function(u) {
    function h(y, Y) {
      var ee = y.length;
      y.push(Y);
      e: for (; 0 < ee; ) {
        var ke = ee - 1 >>> 1, m = y[ke];
        if (0 < R(m, Y))
          y[ke] = Y, y[ee] = m, ee = ke;
        else break e;
      }
    }
    function S(y) {
      return y.length === 0 ? null : y[0];
    }
    function d(y) {
      if (y.length === 0) return null;
      var Y = y[0], ee = y.pop();
      if (ee !== Y) {
        y[0] = ee;
        e: for (var ke = 0, m = y.length, H = m >>> 1; ke < H; ) {
          var te = 2 * (ke + 1) - 1, $ = y[te], ae = te + 1, Z = y[ae];
          if (0 > R($, ee))
            ae < m && 0 > R(Z, $) ? (y[ke] = Z, y[ae] = ee, ke = ae) : (y[ke] = $, y[te] = ee, ke = te);
          else if (ae < m && 0 > R(Z, ee))
            y[ke] = Z, y[ae] = ee, ke = ae;
          else break e;
        }
      }
      return Y;
    }
    function R(y, Y) {
      var ee = y.sortIndex - Y.sortIndex;
      return ee !== 0 ? ee : y.id - Y.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var B = performance;
      u.unstable_now = function() {
        return B.now();
      };
    } else {
      var V = Date, M = V.now();
      u.unstable_now = function() {
        return V.now() - M;
      };
    }
    var Q = [], p = [], U = 1, K = null, k = 3, le = !1, xe = !1, _e = !1, ye = !1, Ee = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, I = typeof setImmediate < "u" ? setImmediate : null;
    function oe(y) {
      for (var Y = S(p); Y !== null; ) {
        if (Y.callback === null) d(p);
        else if (Y.startTime <= y)
          d(p), Y.sortIndex = Y.expirationTime, h(Q, Y);
        else break;
        Y = S(p);
      }
    }
    function ne(y) {
      if (_e = !1, oe(y), !xe)
        if (S(Q) !== null)
          xe = !0, D || (D = !0, pe());
        else {
          var Y = S(p);
          Y !== null && de(ne, Y.startTime - y);
        }
    }
    var D = !1, je = -1, Re = 5, Be = -1;
    function Xe() {
      return ye ? !0 : !(u.unstable_now() - Be < Re);
    }
    function Ge() {
      if (ye = !1, D) {
        var y = u.unstable_now();
        Be = y;
        var Y = !0;
        try {
          e: {
            xe = !1, _e && (_e = !1, me(je), je = -1), le = !0;
            var ee = k;
            try {
              t: {
                for (oe(y), K = S(Q); K !== null && !(K.expirationTime > y && Xe()); ) {
                  var ke = K.callback;
                  if (typeof ke == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var m = ke(
                      K.expirationTime <= y
                    );
                    if (y = u.unstable_now(), typeof m == "function") {
                      K.callback = m, oe(y), Y = !0;
                      break t;
                    }
                    K === S(Q) && d(Q), oe(y);
                  } else d(Q);
                  K = S(Q);
                }
                if (K !== null) Y = !0;
                else {
                  var H = S(p);
                  H !== null && de(
                    ne,
                    H.startTime - y
                  ), Y = !1;
                }
              }
              break e;
            } finally {
              K = null, k = ee, le = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? pe() : D = !1;
        }
      }
    }
    var pe;
    if (typeof I == "function")
      pe = function() {
        I(Ge);
      };
    else if (typeof MessageChannel < "u") {
      var Ke = new MessageChannel(), X = Ke.port2;
      Ke.port1.onmessage = Ge, pe = function() {
        X.postMessage(null);
      };
    } else
      pe = function() {
        Ee(Ge, 0);
      };
    function de(y, Y) {
      je = Ee(function() {
        y(u.unstable_now());
      }, Y);
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
          var Y = 3;
          break;
        default:
          Y = k;
      }
      var ee = k;
      k = Y;
      try {
        return y();
      } finally {
        k = ee;
      }
    }, u.unstable_requestPaint = function() {
      ye = !0;
    }, u.unstable_runWithPriority = function(y, Y) {
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
      var ee = k;
      k = y;
      try {
        return Y();
      } finally {
        k = ee;
      }
    }, u.unstable_scheduleCallback = function(y, Y, ee) {
      var ke = u.unstable_now();
      switch (typeof ee == "object" && ee !== null ? (ee = ee.delay, ee = typeof ee == "number" && 0 < ee ? ke + ee : ke) : ee = ke, y) {
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
      return m = ee + m, y = {
        id: U++,
        callback: Y,
        priorityLevel: y,
        startTime: ee,
        expirationTime: m,
        sortIndex: -1
      }, ee > ke ? (y.sortIndex = ee, h(p, y), S(Q) === null && y === S(p) && (_e ? (me(je), je = -1) : _e = !0, de(ne, ee - ke))) : (y.sortIndex = m, h(Q, y), xe || le || (xe = !0, D || (D = !0, pe()))), y;
    }, u.unstable_shouldYield = Xe, u.unstable_wrapCallback = function(y) {
      var Y = k;
      return function() {
        var ee = k;
        k = Y;
        try {
          return y.apply(this, arguments);
        } finally {
          k = ee;
        }
      };
    };
  })(nu)), nu;
}
var df;
function hj() {
  return df || (df = 1, au.exports = oj()), au.exports;
}
var iu = { exports: {} }, it = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var of;
function fj() {
  if (of) return it;
  of = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), B = Symbol.for("react.consumer"), V = Symbol.for("react.context"), M = Symbol.for("react.forward_ref"), Q = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), U = Symbol.for("react.lazy"), K = Symbol.iterator;
  function k(m) {
    return m === null || typeof m != "object" ? null : (m = K && m[K] || m["@@iterator"], typeof m == "function" ? m : null);
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
  }, xe = Object.assign, _e = {};
  function ye(m, H, te) {
    this.props = m, this.context = H, this.refs = _e, this.updater = te || le;
  }
  ye.prototype.isReactComponent = {}, ye.prototype.setState = function(m, H) {
    if (typeof m != "object" && typeof m != "function" && m != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, m, H, "setState");
  }, ye.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Ee() {
  }
  Ee.prototype = ye.prototype;
  function me(m, H, te) {
    this.props = m, this.context = H, this.refs = _e, this.updater = te || le;
  }
  var I = me.prototype = new Ee();
  I.constructor = me, xe(I, ye.prototype), I.isPureReactComponent = !0;
  var oe = Array.isArray, ne = { H: null, A: null, T: null, S: null, V: null }, D = Object.prototype.hasOwnProperty;
  function je(m, H, te, $, ae, Z) {
    return te = Z.ref, {
      $$typeof: u,
      type: m,
      key: H,
      ref: te !== void 0 ? te : null,
      props: Z
    };
  }
  function Re(m, H) {
    return je(
      m.type,
      H,
      void 0,
      void 0,
      void 0,
      m.props
    );
  }
  function Be(m) {
    return typeof m == "object" && m !== null && m.$$typeof === u;
  }
  function Xe(m) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(te) {
      return H[te];
    });
  }
  var Ge = /\/+/g;
  function pe(m, H) {
    return typeof m == "object" && m !== null && m.key != null ? Xe("" + m.key) : H.toString(36);
  }
  function Ke() {
  }
  function X(m) {
    switch (m.status) {
      case "fulfilled":
        return m.value;
      case "rejected":
        throw m.reason;
      default:
        switch (typeof m.status == "string" ? m.then(Ke, Ke) : (m.status = "pending", m.then(
          function(H) {
            m.status === "pending" && (m.status = "fulfilled", m.value = H);
          },
          function(H) {
            m.status === "pending" && (m.status = "rejected", m.reason = H);
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
  function de(m, H, te, $, ae) {
    var Z = typeof m;
    (Z === "undefined" || Z === "boolean") && (m = null);
    var P = !1;
    if (m === null) P = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          P = !0;
          break;
        case "object":
          switch (m.$$typeof) {
            case u:
            case h:
              P = !0;
              break;
            case U:
              return P = m._init, de(
                P(m._payload),
                H,
                te,
                $,
                ae
              );
          }
      }
    if (P)
      return ae = ae(m), P = $ === "" ? "." + pe(m, 0) : $, oe(ae) ? (te = "", P != null && (te = P.replace(Ge, "$&/") + "/"), de(ae, H, te, "", function(Se) {
        return Se;
      })) : ae != null && (Be(ae) && (ae = Re(
        ae,
        te + (ae.key == null || m && m.key === ae.key ? "" : ("" + ae.key).replace(
          Ge,
          "$&/"
        ) + "/") + P
      )), H.push(ae)), 1;
    P = 0;
    var Ce = $ === "" ? "." : $ + ":";
    if (oe(m))
      for (var ie = 0; ie < m.length; ie++)
        $ = m[ie], Z = Ce + pe($, ie), P += de(
          $,
          H,
          te,
          Z,
          ae
        );
    else if (ie = k(m), typeof ie == "function")
      for (m = ie.call(m), ie = 0; !($ = m.next()).done; )
        $ = $.value, Z = Ce + pe($, ie++), P += de(
          $,
          H,
          te,
          Z,
          ae
        );
    else if (Z === "object") {
      if (typeof m.then == "function")
        return de(
          X(m),
          H,
          te,
          $,
          ae
        );
      throw H = String(m), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return P;
  }
  function y(m, H, te) {
    if (m == null) return m;
    var $ = [], ae = 0;
    return de(m, $, "", "", function(Z) {
      return H.call(te, Z, ae++);
    }), $;
  }
  function Y(m) {
    if (m._status === -1) {
      var H = m._result;
      H = H(), H.then(
        function(te) {
          (m._status === 0 || m._status === -1) && (m._status = 1, m._result = te);
        },
        function(te) {
          (m._status === 0 || m._status === -1) && (m._status = 2, m._result = te);
        }
      ), m._status === -1 && (m._status = 0, m._result = H);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var ee = typeof reportError == "function" ? reportError : function(m) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof m == "object" && m !== null && typeof m.message == "string" ? String(m.message) : String(m),
        error: m
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", m);
      return;
    }
    console.error(m);
  };
  function ke() {
  }
  return it.Children = {
    map: y,
    forEach: function(m, H, te) {
      y(
        m,
        function() {
          H.apply(this, arguments);
        },
        te
      );
    },
    count: function(m) {
      var H = 0;
      return y(m, function() {
        H++;
      }), H;
    },
    toArray: function(m) {
      return y(m, function(H) {
        return H;
      }) || [];
    },
    only: function(m) {
      if (!Be(m))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return m;
    }
  }, it.Component = ye, it.Fragment = S, it.Profiler = R, it.PureComponent = me, it.StrictMode = d, it.Suspense = Q, it.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ne, it.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(m) {
      return ne.H.useMemoCache(m);
    }
  }, it.cache = function(m) {
    return function() {
      return m.apply(null, arguments);
    };
  }, it.cloneElement = function(m, H, te) {
    if (m == null)
      throw Error(
        "The argument must be a React element, but you passed " + m + "."
      );
    var $ = xe({}, m.props), ae = m.key, Z = void 0;
    if (H != null)
      for (P in H.ref !== void 0 && (Z = void 0), H.key !== void 0 && (ae = "" + H.key), H)
        !D.call(H, P) || P === "key" || P === "__self" || P === "__source" || P === "ref" && H.ref === void 0 || ($[P] = H[P]);
    var P = arguments.length - 2;
    if (P === 1) $.children = te;
    else if (1 < P) {
      for (var Ce = Array(P), ie = 0; ie < P; ie++)
        Ce[ie] = arguments[ie + 2];
      $.children = Ce;
    }
    return je(m.type, ae, void 0, void 0, Z, $);
  }, it.createContext = function(m) {
    return m = {
      $$typeof: V,
      _currentValue: m,
      _currentValue2: m,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, m.Provider = m, m.Consumer = {
      $$typeof: B,
      _context: m
    }, m;
  }, it.createElement = function(m, H, te) {
    var $, ae = {}, Z = null;
    if (H != null)
      for ($ in H.key !== void 0 && (Z = "" + H.key), H)
        D.call(H, $) && $ !== "key" && $ !== "__self" && $ !== "__source" && (ae[$] = H[$]);
    var P = arguments.length - 2;
    if (P === 1) ae.children = te;
    else if (1 < P) {
      for (var Ce = Array(P), ie = 0; ie < P; ie++)
        Ce[ie] = arguments[ie + 2];
      ae.children = Ce;
    }
    if (m && m.defaultProps)
      for ($ in P = m.defaultProps, P)
        ae[$] === void 0 && (ae[$] = P[$]);
    return je(m, Z, void 0, void 0, null, ae);
  }, it.createRef = function() {
    return { current: null };
  }, it.forwardRef = function(m) {
    return { $$typeof: M, render: m };
  }, it.isValidElement = Be, it.lazy = function(m) {
    return {
      $$typeof: U,
      _payload: { _status: -1, _result: m },
      _init: Y
    };
  }, it.memo = function(m, H) {
    return {
      $$typeof: p,
      type: m,
      compare: H === void 0 ? null : H
    };
  }, it.startTransition = function(m) {
    var H = ne.T, te = {};
    ne.T = te;
    try {
      var $ = m(), ae = ne.S;
      ae !== null && ae(te, $), typeof $ == "object" && $ !== null && typeof $.then == "function" && $.then(ke, ee);
    } catch (Z) {
      ee(Z);
    } finally {
      ne.T = H;
    }
  }, it.unstable_useCacheRefresh = function() {
    return ne.H.useCacheRefresh();
  }, it.use = function(m) {
    return ne.H.use(m);
  }, it.useActionState = function(m, H, te) {
    return ne.H.useActionState(m, H, te);
  }, it.useCallback = function(m, H) {
    return ne.H.useCallback(m, H);
  }, it.useContext = function(m) {
    return ne.H.useContext(m);
  }, it.useDebugValue = function() {
  }, it.useDeferredValue = function(m, H) {
    return ne.H.useDeferredValue(m, H);
  }, it.useEffect = function(m, H, te) {
    var $ = ne.H;
    if (typeof te == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return $.useEffect(m, H);
  }, it.useId = function() {
    return ne.H.useId();
  }, it.useImperativeHandle = function(m, H, te) {
    return ne.H.useImperativeHandle(m, H, te);
  }, it.useInsertionEffect = function(m, H) {
    return ne.H.useInsertionEffect(m, H);
  }, it.useLayoutEffect = function(m, H) {
    return ne.H.useLayoutEffect(m, H);
  }, it.useMemo = function(m, H) {
    return ne.H.useMemo(m, H);
  }, it.useOptimistic = function(m, H) {
    return ne.H.useOptimistic(m, H);
  }, it.useReducer = function(m, H, te) {
    return ne.H.useReducer(m, H, te);
  }, it.useRef = function(m) {
    return ne.H.useRef(m);
  }, it.useState = function(m) {
    return ne.H.useState(m);
  }, it.useSyncExternalStore = function(m, H, te) {
    return ne.H.useSyncExternalStore(
      m,
      H,
      te
    );
  }, it.useTransition = function() {
    return ne.H.useTransition();
  }, it.version = "19.1.0", it;
}
var hf;
function _u() {
  return hf || (hf = 1, iu.exports = fj()), iu.exports;
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
var ff;
function mj() {
  if (ff) return es;
  ff = 1;
  var u = _u();
  function h(Q) {
    var p = "https://react.dev/errors/" + Q;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var U = 2; U < arguments.length; U++)
        p += "&args[]=" + encodeURIComponent(arguments[U]);
    }
    return "Minified React error #" + Q + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function S() {
  }
  var d = {
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
  }, R = Symbol.for("react.portal");
  function B(Q, p, U) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: R,
      key: K == null ? null : "" + K,
      children: Q,
      containerInfo: p,
      implementation: U
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function M(Q, p) {
    if (Q === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return es.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = d, es.createPortal = function(Q, p) {
    var U = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(h(299));
    return B(Q, p, null, U);
  }, es.flushSync = function(Q) {
    var p = V.T, U = d.p;
    try {
      if (V.T = null, d.p = 2, Q) return Q();
    } finally {
      V.T = p, d.p = U, d.d.f();
    }
  }, es.preconnect = function(Q, p) {
    typeof Q == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, d.d.C(Q, p));
  }, es.prefetchDNS = function(Q) {
    typeof Q == "string" && d.d.D(Q);
  }, es.preinit = function(Q, p) {
    if (typeof Q == "string" && p && typeof p.as == "string") {
      var U = p.as, K = M(U, p.crossOrigin), k = typeof p.integrity == "string" ? p.integrity : void 0, le = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      U === "style" ? d.d.S(
        Q,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: le
        }
      ) : U === "script" && d.d.X(Q, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: le,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, es.preinitModule = function(Q, p) {
    if (typeof Q == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var U = M(
            p.as,
            p.crossOrigin
          );
          d.d.M(Q, {
            crossOrigin: U,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && d.d.M(Q);
  }, es.preload = function(Q, p) {
    if (typeof Q == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var U = p.as, K = M(U, p.crossOrigin);
      d.d.L(Q, U, {
        crossOrigin: K,
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
  }, es.preloadModule = function(Q, p) {
    if (typeof Q == "string")
      if (p) {
        var U = M(p.as, p.crossOrigin);
        d.d.m(Q, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: U,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else d.d.m(Q);
  }, es.requestFormReset = function(Q) {
    d.d.r(Q);
  }, es.unstable_batchedUpdates = function(Q, p) {
    return Q(p);
  }, es.useFormState = function(Q, p, U) {
    return V.H.useFormState(Q, p, U);
  }, es.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, es.version = "19.1.0", es;
}
var mf;
function xj() {
  if (mf) return cu.exports;
  mf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), cu.exports = mj(), cu.exports;
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
var xf;
function jj() {
  if (xf) return Sn;
  xf = 1;
  var u = hj(), h = _u(), S = xj();
  function d(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function R(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function B(e) {
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
  function M(e) {
    if (B(e) !== e)
      throw Error(d(188));
  }
  function Q(e) {
    var t = e.alternate;
    if (!t) {
      if (t = B(e), t === null) throw Error(d(188));
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
        throw Error(d(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var c = !1, o = n.child; o; ) {
          if (o === l) {
            c = !0, l = n, a = i;
            break;
          }
          if (o === a) {
            c = !0, a = n, l = i;
            break;
          }
          o = o.sibling;
        }
        if (!c) {
          for (o = i.child; o; ) {
            if (o === l) {
              c = !0, l = i, a = n;
              break;
            }
            if (o === a) {
              c = !0, a = i, l = n;
              break;
            }
            o = o.sibling;
          }
          if (!c) throw Error(d(189));
        }
      }
      if (l.alternate !== a) throw Error(d(190));
    }
    if (l.tag !== 3) throw Error(d(188));
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
  var U = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), le = Symbol.for("react.portal"), xe = Symbol.for("react.fragment"), _e = Symbol.for("react.strict_mode"), ye = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), me = Symbol.for("react.consumer"), I = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), je = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), Be = Symbol.for("react.activity"), Xe = Symbol.for("react.memo_cache_sentinel"), Ge = Symbol.iterator;
  function pe(e) {
    return e === null || typeof e != "object" ? null : (e = Ge && e[Ge] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ke = Symbol.for("react.client.reference");
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ke ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case xe:
        return "Fragment";
      case ye:
        return "Profiler";
      case _e:
        return "StrictMode";
      case ne:
        return "Suspense";
      case D:
        return "SuspenseList";
      case Be:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case le:
          return "Portal";
        case I:
          return (e.displayName || "Context") + ".Provider";
        case me:
          return (e._context.displayName || "Context") + ".Consumer";
        case oe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case je:
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
  var de = Array.isArray, y = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = S.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ee = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ke = [], m = -1;
  function H(e) {
    return { current: e };
  }
  function te(e) {
    0 > m || (e.current = ke[m], ke[m] = null, m--);
  }
  function $(e, t) {
    m++, ke[m] = e.current, e.current = t;
  }
  var ae = H(null), Z = H(null), P = H(null), Ce = H(null);
  function ie(e, t) {
    switch ($(P, t), $(Z, e), $(ae, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Uh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Uh(t), e = Dh(t, e);
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
    te(ae), $(ae, e);
  }
  function Se() {
    te(ae), te(Z), te(P);
  }
  function st(e) {
    e.memoizedState !== null && $(Ce, e);
    var t = ae.current, l = Dh(t, e.type);
    t !== l && ($(Z, e), $(ae, l));
  }
  function lt(e) {
    Z.current === e && (te(ae), te(Z)), Ce.current === e && (te(Ce), pn._currentValue = ee);
  }
  var Pe = Object.prototype.hasOwnProperty, Oe = u.unstable_scheduleCallback, Te = u.unstable_cancelCallback, De = u.unstable_shouldYield, Ne = u.unstable_requestPaint, Le = u.unstable_now, We = u.unstable_getCurrentPriorityLevel, Fe = u.unstable_ImmediatePriority, Ze = u.unstable_UserBlockingPriority, he = u.unstable_NormalPriority, et = u.unstable_LowPriority, Ue = u.unstable_IdlePriority, E = u.log, w = u.unstable_setDisableYieldValue, W = null, ve = null;
  function He(e) {
    if (typeof E == "function" && w(e), ve && typeof ve.setStrictMode == "function")
      try {
        ve.setStrictMode(W, e);
      } catch {
      }
  }
  var tt = Math.clz32 ? Math.clz32 : fe, dt = Math.log, L = Math.LN2;
  function fe(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (dt(e) / L | 0) | 0;
  }
  var re = 256, Ve = 4194304;
  function _(e) {
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
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var o = a & 134217727;
    return o !== 0 ? (a = o & ~i, a !== 0 ? n = _(a) : (c &= o, c !== 0 ? n = _(c) : l || (l = o & ~e, l !== 0 && (n = _(l))))) : (o = a & ~i, o !== 0 ? n = _(o) : c !== 0 ? n = _(c) : l || (l = a & ~e, l !== 0 && (n = _(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function ge(e, t) {
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
  function xt() {
    var e = re;
    return re <<= 1, (re & 4194048) === 0 && (re = 256), e;
  }
  function z() {
    var e = Ve;
    return Ve <<= 1, (Ve & 62914560) === 0 && (Ve = 4194304), e;
  }
  function v(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ue(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function f(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var o = e.entanglements, g = e.expirationTimes, T = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var J = 31 - tt(l), se = 1 << J;
      o[J] = 0, g[J] = -1;
      var A = T[J];
      if (A !== null)
        for (T[J] = null, J = 0; J < A.length; J++) {
          var q = A[J];
          q !== null && (q.lane &= -536870913);
        }
      l &= ~se;
    }
    a !== 0 && G(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function G(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - tt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 4194090;
  }
  function x(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - tt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function ce(e) {
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
  function qe(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function vt() {
    var e = Y.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : ef(e.type));
  }
  function Rt(e, t) {
    var l = Y.p;
    try {
      return Y.p = e, t();
    } finally {
      Y.p = l;
    }
  }
  var Et = Math.random().toString(36).slice(2), rt = "__reactFiber$" + Et, St = "__reactProps$" + Et, b = "__reactContainer$" + Et, we = "__reactEvents$" + Et, nt = "__reactListeners$" + Et, pt = "__reactHandles$" + Et, j = "__reactResources$" + Et, ze = "__reactMarker$" + Et;
  function Ae(e) {
    delete e[rt], delete e[St], delete e[we], delete e[nt], delete e[pt];
  }
  function at(e) {
    var t = e[rt];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[b] || l[rt]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Bh(e); e !== null; ) {
            if (l = e[rt]) return l;
            e = Bh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Xt(e) {
    if (e = e[rt] || e[b]) {
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
    var t = e[j];
    return t || (t = e[j] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function qt(e) {
    e[ze] = !0;
  }
  var Ea = /* @__PURE__ */ new Set(), Oa = {};
  function It(e, t) {
    Ps(e, t), Ps(e + "Capture", t);
  }
  function Ps(e, t) {
    for (Oa[e] = t, e = 0; e < t.length; e++)
      Ea.add(t[e]);
  }
  var tm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Su = {}, wu = {};
  function sm(e) {
    return Pe.call(wu, e) ? !0 : Pe.call(Su, e) ? !1 : tm.test(e) ? wu[e] = !0 : (Su[e] = !0, !1);
  }
  function zn(e, t, l) {
    if (sm(t))
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
  function An(e, t, l) {
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
  var Wi, ku;
  function Yl(e) {
    if (Wi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Wi = t && t[1] || "", ku = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wi + e + ku;
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
              var se = function() {
                throw Error();
              };
              if (Object.defineProperty(se.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(se, []);
                } catch (q) {
                  var A = q;
                }
                Reflect.construct(e, [], se);
              } else {
                try {
                  se.call();
                } catch (q) {
                  A = q;
                }
                e.call(se.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (q) {
                A = q;
              }
              (se = e()) && typeof se.catch == "function" && se.catch(function() {
              });
            }
          } catch (q) {
            if (q && A && typeof q.stack == "string")
              return [q.stack, A.stack];
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
      var i = a.DetermineComponentFrameRoot(), c = i[0], o = i[1];
      if (c && o) {
        var g = c.split(`
`), T = o.split(`
`);
        for (n = a = 0; a < g.length && !g[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < T.length && !T[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === g.length || n === T.length)
          for (a = g.length - 1, n = T.length - 1; 1 <= a && 0 <= n && g[a] !== T[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (g[a] !== T[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || g[a] !== T[n]) {
                  var J = `
` + g[a].replace(" at new ", " at ");
                  return e.displayName && J.includes("<anonymous>") && (J = J.replace("<anonymous>", e.displayName)), J;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Fi = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Yl(l) : "";
  }
  function lm(e) {
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
        return Ii(e.type, !1);
      case 11:
        return Ii(e.type.render, !1);
      case 1:
        return Ii(e.type, !0);
      case 31:
        return Yl("Activity");
      default:
        return "";
    }
  }
  function Cu(e) {
    try {
      var t = "";
      do
        t += lm(e), e = e.return;
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
  function Eu(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function am(e) {
    var t = Eu(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
  function Rn(e) {
    e._valueTracker || (e._valueTracker = am(e));
  }
  function Ou(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Eu(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Un(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var nm = /[\n"\\]/g;
  function ms(e) {
    return e.replace(
      nm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Pi(e, t, l, a, n, i, c, o) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + fs(t)) : e.value !== "" + fs(t) && (e.value = "" + fs(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? ec(e, c, fs(t)) : l != null ? ec(e, c, fs(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.name = "" + fs(o) : e.removeAttribute("name");
  }
  function Tu(e, t, l, a, n, i, c, o) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + fs(l) : "", t = t != null ? "" + fs(t) : l, o || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = o ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function ec(e, t, l) {
    t === "number" && Un(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
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
  function zu(e, t, l) {
    if (t != null && (t = "" + fs(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + fs(l) : "";
  }
  function Au(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(d(92));
        if (de(a)) {
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
  var im = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ru(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || im.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Uu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(d(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Ru(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Ru(e, i, t[i]);
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
  var cm = /* @__PURE__ */ new Map([
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
  ]), rm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Dn(e) {
    return rm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var sc = null;
  function lc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Xl = null, Zl = null;
  function Du(e) {
    var t = Xt(e);
    if (t && (e = t.stateNode)) {
      var l = e[St] || null;
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
                var n = a[St] || null;
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
              a = l[t], a.form === e.form && Ou(a);
          }
          break e;
        case "textarea":
          zu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Gl(e, !!l.multiple, t, !1);
      }
    }
  }
  var ac = !1;
  function Mu(e, t, l) {
    if (ac) return e(t, l);
    ac = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (ac = !1, (Xl !== null || Zl !== null) && (bi(), Xl && (t = Xl, e = Zl, Zl = Xl = null, Du(t), e)))
        for (t = 0; t < e.length; t++) Du(e[t]);
    }
  }
  function Ta(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[St] || null;
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
  var el = null, ic = null, Mn = null;
  function qu() {
    if (Mn) return Mn;
    var e, t = ic, l = t.length, a, n = "value" in el ? el.value : el.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return Mn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function qn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Hn() {
    return !0;
  }
  function Hu() {
    return !1;
  }
  function ss(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var o in e)
        e.hasOwnProperty(o) && (l = e[o], this[o] = l ? l(i) : i[o]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Hn : Hu, this.isPropagationStopped = Hu, this;
    }
    return U(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Hn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Hn);
      },
      persist: function() {
      },
      isPersistent: Hn
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
  }, Bn = ss(wl), Aa = U({}, wl, { view: 0, detail: 0 }), um = ss(Aa), cc, rc, Ra, Ln = U({}, Aa, {
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
    getModifierState: dc,
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
  }), Bu = ss(Ln), dm = U({}, Ln, { dataTransfer: 0 }), om = ss(dm), hm = U({}, Aa, { relatedTarget: 0 }), uc = ss(hm), fm = U({}, wl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), mm = ss(fm), xm = U({}, wl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), jm = ss(xm), vm = U({}, wl, { data: 0 }), Lu = ss(vm), pm = {
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
  }, gm = {
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
  }, bm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function ym(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = bm[e]) ? !!t[e] : !1;
  }
  function dc() {
    return ym;
  }
  var _m = U({}, Aa, {
    key: function(e) {
      if (e.key) {
        var t = pm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = qn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? gm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: dc,
    charCode: function(e) {
      return e.type === "keypress" ? qn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? qn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Nm = ss(_m), Sm = U({}, Ln, {
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
  }), Yu = ss(Sm), wm = U({}, Aa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: dc
  }), km = ss(wm), Cm = U({}, wl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Em = ss(Cm), Om = U({}, Ln, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Tm = ss(Om), zm = U({}, wl, {
    newState: 0,
    oldState: 0
  }), Am = ss(zm), Rm = [9, 13, 27, 32], oc = Ms && "CompositionEvent" in window, Ua = null;
  Ms && "documentMode" in document && (Ua = document.documentMode);
  var Um = Ms && "TextEvent" in window && !Ua, Gu = Ms && (!oc || Ua && 8 < Ua && 11 >= Ua), Qu = " ", Xu = !1;
  function Zu(e, t) {
    switch (e) {
      case "keyup":
        return Rm.indexOf(t.keyCode) !== -1;
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
  function Vu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Vl = !1;
  function Dm(e, t) {
    switch (e) {
      case "compositionend":
        return Vu(t);
      case "keypress":
        return t.which !== 32 ? null : (Xu = !0, Qu);
      case "textInput":
        return e = t.data, e === Qu && Xu ? null : e;
      default:
        return null;
    }
  }
  function Mm(e, t) {
    if (Vl)
      return e === "compositionend" || !oc && Zu(e, t) ? (e = qu(), Mn = ic = el = null, Vl = !1, e) : null;
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
        return Gu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var qm = {
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
  function Ju(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!qm[e.type] : t === "textarea";
  }
  function Ku(e, t, l, a) {
    Xl ? Zl ? Zl.push(a) : Zl = [a] : Xl = a, t = ki(t, "onChange"), 0 < t.length && (l = new Bn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Da = null, Ma = null;
  function Hm(e) {
    Oh(e, 0);
  }
  function Yn(e) {
    var t = Cs(e);
    if (Ou(t)) return e;
  }
  function $u(e, t) {
    if (e === "change") return t;
  }
  var Wu = !1;
  if (Ms) {
    var hc;
    if (Ms) {
      var fc = "oninput" in document;
      if (!fc) {
        var Fu = document.createElement("div");
        Fu.setAttribute("oninput", "return;"), fc = typeof Fu.oninput == "function";
      }
      hc = fc;
    } else hc = !1;
    Wu = hc && (!document.documentMode || 9 < document.documentMode);
  }
  function Iu() {
    Da && (Da.detachEvent("onpropertychange", Pu), Ma = Da = null);
  }
  function Pu(e) {
    if (e.propertyName === "value" && Yn(Ma)) {
      var t = [];
      Ku(
        t,
        Ma,
        e,
        lc(e)
      ), Mu(Hm, t);
    }
  }
  function Bm(e, t, l) {
    e === "focusin" ? (Iu(), Da = t, Ma = l, Da.attachEvent("onpropertychange", Pu)) : e === "focusout" && Iu();
  }
  function Lm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Yn(Ma);
  }
  function Ym(e, t) {
    if (e === "click") return Yn(t);
  }
  function Gm(e, t) {
    if (e === "input" || e === "change")
      return Yn(t);
  }
  function Qm(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var is = typeof Object.is == "function" ? Object.is : Qm;
  function qa(e, t) {
    if (is(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Pe.call(t, n) || !is(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function ed(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function td(e, t) {
    var l = ed(e);
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
      l = ed(l);
    }
  }
  function sd(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? sd(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ld(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Un(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Un(e.document);
    }
    return t;
  }
  function mc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Xm = Ms && "documentMode" in document && 11 >= document.documentMode, Jl = null, xc = null, Ha = null, jc = !1;
  function ad(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    jc || Jl == null || Jl !== Un(a) || (a = Jl, "selectionStart" in a && mc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ha && qa(Ha, a) || (Ha = a, a = ki(xc, "onSelect"), 0 < a.length && (t = new Bn(
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
  }, vc = {}, nd = {};
  Ms && (nd = document.createElement("div").style, "AnimationEvent" in window || (delete Kl.animationend.animation, delete Kl.animationiteration.animation, delete Kl.animationstart.animation), "TransitionEvent" in window || delete Kl.transitionend.transition);
  function Cl(e) {
    if (vc[e]) return vc[e];
    if (!Kl[e]) return e;
    var t = Kl[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in nd)
        return vc[e] = t[l];
    return e;
  }
  var id = Cl("animationend"), cd = Cl("animationiteration"), rd = Cl("animationstart"), Zm = Cl("transitionrun"), Vm = Cl("transitionstart"), Jm = Cl("transitioncancel"), ud = Cl("transitionend"), dd = /* @__PURE__ */ new Map(), pc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  pc.push("scrollEnd");
  function _s(e, t) {
    dd.set(e, t), It(t, [e]);
  }
  var od = /* @__PURE__ */ new WeakMap();
  function xs(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = od.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Cu(t)
      }, od.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Cu(t)
    };
  }
  var js = [], $l = 0, gc = 0;
  function Gn() {
    for (var e = $l, t = gc = $l = 0; t < e; ) {
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
      i !== 0 && hd(l, n, i);
    }
  }
  function Qn(e, t, l, a) {
    js[$l++] = e, js[$l++] = t, js[$l++] = l, js[$l++] = a, gc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function bc(e, t, l, a) {
    return Qn(e, t, l, a), Xn(e);
  }
  function Wl(e, t) {
    return Qn(e, null, null, t), Xn(e);
  }
  function hd(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - tt(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function Xn(e) {
    if (50 < dn)
      throw dn = 0, kr = null, Error(d(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Fl = {};
  function Km(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function cs(e, t, l, a) {
    return new Km(e, t, l, a);
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
  function fd(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Zn(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") yc(e) && (c = 1);
    else if (typeof e == "string")
      c = Wx(
        e,
        l,
        ae.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Be:
          return e = cs(31, l, t, n), e.elementType = Be, e.lanes = i, e;
        case xe:
          return El(l.children, n, i, t);
        case _e:
          c = 8, n |= 24;
          break;
        case ye:
          return e = cs(12, l, t, n | 2), e.elementType = ye, e.lanes = i, e;
        case ne:
          return e = cs(13, l, t, n), e.elementType = ne, e.lanes = i, e;
        case D:
          return e = cs(19, l, t, n), e.elementType = D, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ee:
              case I:
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
              case Re:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            d(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = cs(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
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
  var Il = [], Pl = 0, Vn = null, Jn = 0, vs = [], ps = 0, Ol = null, Hs = 1, Bs = "";
  function Tl(e, t) {
    Il[Pl++] = Jn, Il[Pl++] = Vn, Vn = e, Jn = t;
  }
  function md(e, t, l) {
    vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Ol = e;
    var a = Hs;
    e = Bs;
    var n = 32 - tt(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - tt(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Hs = 1 << 32 - tt(t) + n | l << n | a, Bs = i + e;
    } else
      Hs = 1 << i | l << n | a, Bs = e;
  }
  function Sc(e) {
    e.return !== null && (Tl(e, 1), md(e, 1, 0));
  }
  function wc(e) {
    for (; e === Vn; )
      Vn = Il[--Pl], Il[Pl] = null, Jn = Il[--Pl], Il[Pl] = null;
    for (; e === Ol; )
      Ol = vs[--ps], vs[ps] = null, Bs = vs[--ps], vs[ps] = null, Hs = vs[--ps], vs[ps] = null;
  }
  var ts = null, Ut = null, jt = !1, zl = null, Es = !1, kc = Error(d(519));
  function Al(e) {
    var t = Error(d(418, ""));
    throw Ya(xs(t, e)), kc;
  }
  function xd(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[rt] = e, t[St] = a, l) {
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
        ht("invalid", t), Tu(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Rn(t);
        break;
      case "select":
        ht("invalid", t);
        break;
      case "textarea":
        ht("invalid", t), Au(t, a.value, a.defaultValue, a.children), Rn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Rh(t.textContent, l) ? (a.popover != null && (ht("beforetoggle", t), ht("toggle", t)), a.onScroll != null && ht("scroll", t), a.onScrollEnd != null && ht("scrollend", t), a.onClick != null && (t.onclick = Ci), t = !0) : t = !1, t || Al(e);
  }
  function jd(e) {
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
    if (!jt) return jd(e), jt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Gr(e.type, e.memoizedProps)), l = !l), l && Ut && Al(e), jd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(d(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Ut = Ss(e.nextSibling);
                break e;
              }
              t--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || t++;
          e = e.nextSibling;
        }
        Ut = null;
      }
    } else
      t === 27 ? (t = Ut, jl(e.type) ? (e = Vr, Vr = null, Ut = e) : Ut = t) : Ut = ts ? Ss(e.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    Ut = ts = null, jt = !1;
  }
  function vd() {
    var e = zl;
    return e !== null && (ns === null ? ns = e : ns.push.apply(
      ns,
      e
    ), zl = null), e;
  }
  function Ya(e) {
    zl === null ? zl = [e] : zl.push(e);
  }
  var Cc = H(null), Rl = null, Ls = null;
  function tl(e, t, l) {
    $(Cc, t._currentValue), t._currentValue = l;
  }
  function Ys(e) {
    e._currentValue = Cc.current, te(Cc);
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
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var o = i;
          i = n;
          for (var g = 0; g < t.length; g++)
            if (o.context === t[g]) {
              i.lanes |= l, o = i.alternate, o !== null && (o.lanes |= l), Ec(
                i.return,
                l,
                e
              ), a || (c = null);
              break e;
            }
          i = o.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(d(341));
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Ec(c, l, e), c = null;
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
        if (c === null) throw Error(d(387));
        if (c = c.memoizedProps, c !== null) {
          var o = n.type;
          is(n.pendingProps.value, c.value) || (e !== null ? e.push(o) : e = [o]);
        }
      } else if (n === Ce.current) {
        if (c = n.alternate, c === null) throw Error(d(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(pn) : e = [pn]);
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
  function Kn(e) {
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
    return pd(Rl, e);
  }
  function $n(e, t) {
    return Rl === null && Ul(e), pd(e, t);
  }
  function pd(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ls === null) {
      if (e === null) throw Error(d(308));
      Ls = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ls = Ls.next = t;
    return l;
  }
  var $m = typeof AbortController < "u" ? AbortController : function() {
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
  }, Wm = u.unstable_scheduleCallback, Fm = u.unstable_NormalPriority, Gt = {
    $$typeof: I,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Tc() {
    return {
      controller: new $m(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Qa(e) {
    e.refCount--, e.refCount === 0 && Wm(Fm, function() {
      e.controller.abort();
    });
  }
  var Xa = null, zc = 0, ea = 0, ta = null;
  function Im(e, t) {
    if (Xa === null) {
      var l = Xa = [];
      zc = 0, ea = Rr(), ta = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return zc++, t.then(gd, gd), t;
  }
  function gd() {
    if (--zc === 0 && Xa !== null) {
      ta !== null && (ta.status = "fulfilled");
      var e = Xa;
      Xa = null, ea = 0, ta = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Pm(e, t) {
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
  var bd = y.S;
  y.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && Im(e, t), bd !== null && bd(e, t);
  };
  var Dl = H(null);
  function Ac() {
    var e = Dl.current;
    return e !== null ? e : kt.pooledCache;
  }
  function Wn(e, t) {
    t === null ? $(Dl, Dl.current) : $(Dl, t.pool);
  }
  function yd() {
    var e = Ac();
    return e === null ? null : { parent: Gt._currentValue, pool: e };
  }
  var Za = Error(d(460)), _d = Error(d(474)), Fn = Error(d(542)), Rc = { then: function() {
  } };
  function Nd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function In() {
  }
  function Sd(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(In, In), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, kd(e), e;
      default:
        if (typeof t.status == "string") t.then(In, In);
        else {
          if (e = kt, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, kd(e), e;
        }
        throw Va = t, Za;
    }
  }
  var Va = null;
  function wd() {
    if (Va === null) throw Error(d(459));
    var e = Va;
    return Va = null, e;
  }
  function kd(e) {
    if (e === Za || e === Fn)
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
    if (a = a.shared, (gt & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Xn(e), hd(e, null, l), t;
    }
    return Qn(e, a, t, l), Xn(e);
  }
  function Ja(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, x(e, l);
    }
  }
  function Mc(e, t) {
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
  var qc = !1;
  function Ka() {
    if (qc) {
      var e = ta;
      if (e !== null) throw e;
    }
  }
  function $a(e, t, l, a) {
    qc = !1;
    var n = e.updateQueue;
    sl = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, o = n.shared.pending;
    if (o !== null) {
      n.shared.pending = null;
      var g = o, T = g.next;
      g.next = null, c === null ? i = T : c.next = T, c = g;
      var J = e.alternate;
      J !== null && (J = J.updateQueue, o = J.lastBaseUpdate, o !== c && (o === null ? J.firstBaseUpdate = T : o.next = T, J.lastBaseUpdate = g));
    }
    if (i !== null) {
      var se = n.baseState;
      c = 0, J = T = g = null, o = i;
      do {
        var A = o.lane & -536870913, q = A !== o.lane;
        if (q ? (ft & A) === A : (a & A) === A) {
          A !== 0 && A === ea && (qc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: o.tag,
            payload: o.payload,
            callback: null,
            next: null
          });
          e: {
            var Ie = e, Je = o;
            A = t;
            var Nt = l;
            switch (Je.tag) {
              case 1:
                if (Ie = Je.payload, typeof Ie == "function") {
                  se = Ie.call(Nt, se, A);
                  break e;
                }
                se = Ie;
                break e;
              case 3:
                Ie.flags = Ie.flags & -65537 | 128;
              case 0:
                if (Ie = Je.payload, A = typeof Ie == "function" ? Ie.call(Nt, se, A) : Ie, A == null) break e;
                se = U({}, se, A);
                break e;
              case 2:
                sl = !0;
            }
          }
          A = o.callback, A !== null && (e.flags |= 64, q && (e.flags |= 8192), q = n.callbacks, q === null ? n.callbacks = [A] : q.push(A));
        } else
          q = {
            lane: A,
            tag: o.tag,
            payload: o.payload,
            callback: o.callback,
            next: null
          }, J === null ? (T = J = q, g = se) : J = J.next = q, c |= A;
        if (o = o.next, o === null) {
          if (o = n.shared.pending, o === null)
            break;
          q = o, o = q.next, q.next = null, n.lastBaseUpdate = q, n.shared.pending = null;
        }
      } while (!0);
      J === null && (g = se), n.baseState = g, n.firstBaseUpdate = T, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), hl |= c, e.lanes = c, e.memoizedState = se;
    }
  }
  function Cd(e, t) {
    if (typeof e != "function")
      throw Error(d(191, e));
    e.call(t);
  }
  function Ed(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Cd(l[e], t);
  }
  var sa = H(null), Pn = H(0);
  function Od(e, t) {
    e = Ks, $(Pn, e), $(sa, t), Ks = e | t.baseLanes;
  }
  function Hc() {
    $(Pn, Ks), $(sa, sa.current);
  }
  function Bc() {
    Ks = Pn.current, te(sa), te(Pn);
  }
  var nl = 0, ct = null, yt = null, Lt = null, ei = !1, la = !1, Ml = !1, ti = 0, Wa = 0, aa = null, ex = 0;
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
    return nl = i, ct = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, y.H = e === null || e.memoizedState === null ? fo : mo, Ml = !1, i = l(a, n), Ml = !1, la && (i = zd(
      t,
      l,
      a,
      n
    )), Td(e), i;
  }
  function Td(e) {
    y.H = ci;
    var t = yt !== null && yt.next !== null;
    if (nl = 0, Lt = yt = ct = null, ei = !1, Wa = 0, aa = null, t) throw Error(d(300));
    e === null || Zt || (e = e.dependencies, e !== null && Kn(e) && (Zt = !0));
  }
  function zd(e, t, l, a) {
    ct = e;
    var n = 0;
    do {
      if (la && (aa = null), Wa = 0, la = !1, 25 <= n) throw Error(d(301));
      if (n += 1, Lt = yt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      y.H = cx, i = t(l, a);
    } while (la);
    return i;
  }
  function tx() {
    var e = y.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Fa(t) : t, e = e.useState()[0], (yt !== null ? yt.memoizedState : null) !== e && (ct.flags |= 1024), t;
  }
  function Gc() {
    var e = ti !== 0;
    return ti = 0, e;
  }
  function Qc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Xc(e) {
    if (ei) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ei = !1;
    }
    nl = 0, Lt = yt = ct = null, la = !1, Wa = ti = 0, aa = null;
  }
  function ls() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Lt === null ? ct.memoizedState = Lt = e : Lt = Lt.next = e, Lt;
  }
  function Yt() {
    if (yt === null) {
      var e = ct.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = yt.next;
    var t = Lt === null ? ct.memoizedState : Lt.next;
    if (t !== null)
      Lt = t, yt = e;
    else {
      if (e === null)
        throw ct.alternate === null ? Error(d(467)) : Error(d(310));
      yt = e, e = {
        memoizedState: yt.memoizedState,
        baseState: yt.baseState,
        baseQueue: yt.baseQueue,
        queue: yt.queue,
        next: null
      }, Lt === null ? ct.memoizedState = Lt = e : Lt = Lt.next = e;
    }
    return Lt;
  }
  function Zc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fa(e) {
    var t = Wa;
    return Wa += 1, aa === null && (aa = []), e = Sd(aa, e, t), t = ct, (Lt === null ? t.memoizedState : Lt.next) === null && (t = t.alternate, y.H = t === null || t.memoizedState === null ? fo : mo), e;
  }
  function si(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Fa(e);
      if (e.$$typeof === I) return Pt(e);
    }
    throw Error(d(438, String(e)));
  }
  function Vc(e) {
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
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Zc(), ct.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Xe;
    return t.index++, l;
  }
  function Gs(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function li(e) {
    var t = Yt();
    return Jc(t, yt, e);
  }
  function Jc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(d(311));
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
      var o = c = null, g = null, T = t, J = !1;
      do {
        var se = T.lane & -536870913;
        if (se !== T.lane ? (ft & se) === se : (nl & se) === se) {
          var A = T.revertLane;
          if (A === 0)
            g !== null && (g = g.next = {
              lane: 0,
              revertLane: 0,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), se === ea && (J = !0);
          else if ((nl & A) === A) {
            T = T.next, A === ea && (J = !0);
            continue;
          } else
            se = {
              lane: 0,
              revertLane: T.revertLane,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }, g === null ? (o = g = se, c = i) : g = g.next = se, ct.lanes |= A, hl |= A;
          se = T.action, Ml && l(i, se), i = T.hasEagerState ? T.eagerState : l(i, se);
        } else
          A = {
            lane: se,
            revertLane: T.revertLane,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, g === null ? (o = g = A, c = i) : g = g.next = A, ct.lanes |= se, hl |= se;
        T = T.next;
      } while (T !== null && T !== t);
      if (g === null ? c = i : g.next = o, !is(i, e.memoizedState) && (Zt = !0, J && (l = ta, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = g, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Kc(e) {
    var t = Yt(), l = t.queue;
    if (l === null) throw Error(d(311));
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
  function Ad(e, t, l) {
    var a = ct, n = Yt(), i = jt;
    if (i) {
      if (l === void 0) throw Error(d(407));
      l = l();
    } else l = t();
    var c = !is(
      (yt || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, Zt = !0), n = n.queue;
    var o = Dd.bind(null, a, n, e);
    if (Ia(2048, 8, o, [e]), n.getSnapshot !== t || c || Lt !== null && Lt.memoizedState.tag & 1) {
      if (a.flags |= 2048, na(
        9,
        ai(),
        Ud.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), kt === null) throw Error(d(349));
      i || (nl & 124) !== 0 || Rd(a, t, l);
    }
    return l;
  }
  function Rd(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ct.updateQueue, t === null ? (t = Zc(), ct.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Ud(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Md(t) && qd(e);
  }
  function Dd(e, t, l) {
    return l(function() {
      Md(t) && qd(e);
    });
  }
  function Md(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !is(e, l);
    } catch {
      return !0;
    }
  }
  function qd(e) {
    var t = Wl(e, 2);
    t !== null && hs(t, e, 2);
  }
  function $c(e) {
    var t = ls();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Ml) {
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
      lastRenderedReducer: Gs,
      lastRenderedState: e
    }, t;
  }
  function Hd(e, t, l, a) {
    return e.baseState = l, Jc(
      e,
      yt,
      typeof a == "function" ? a : Gs
    );
  }
  function sx(e, t, l, a, n) {
    if (ii(e)) throw Error(d(485));
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
      y.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Bd(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Bd(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = y.T, c = {};
      y.T = c;
      try {
        var o = l(n, a), g = y.S;
        g !== null && g(c, o), Ld(e, t, o);
      } catch (T) {
        Wc(e, t, T);
      } finally {
        y.T = i;
      }
    } else
      try {
        i = l(n, a), Ld(e, t, i);
      } catch (T) {
        Wc(e, t, T);
      }
  }
  function Ld(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Yd(e, t, a);
      },
      function(a) {
        return Wc(e, t, a);
      }
    ) : Yd(e, t, l);
  }
  function Yd(e, t, l) {
    t.status = "fulfilled", t.value = l, Gd(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Bd(e, l)));
  }
  function Wc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Gd(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Gd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Qd(e, t) {
    return t;
  }
  function Xd(e, t) {
    if (jt) {
      var l = kt.formState;
      if (l !== null) {
        e: {
          var a = ct;
          if (jt) {
            if (Ut) {
              t: {
                for (var n = Ut, i = Es; n.nodeType !== 8; ) {
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
                Ut = Ss(
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
      lastRenderedReducer: Qd,
      lastRenderedState: t
    }, l.queue = a, l = uo.bind(
      null,
      ct,
      a
    ), a.dispatch = l, a = $c(!1), i = tr.bind(
      null,
      ct,
      !1,
      a.queue
    ), a = ls(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = sx.bind(
      null,
      ct,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Zd(e) {
    var t = Yt();
    return Vd(t, yt, e);
  }
  function Vd(e, t, l) {
    if (t = Jc(
      e,
      t,
      Qd
    )[0], e = li(Gs)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Fa(t);
      } catch (c) {
        throw c === Za ? Fn : c;
      }
    else a = t;
    t = Yt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ct.flags |= 2048, na(
      9,
      ai(),
      lx.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function lx(e, t) {
    e.action = t;
  }
  function Jd(e) {
    var t = Yt(), l = yt;
    if (l !== null)
      return Vd(t, l, e);
    Yt(), t = t.memoizedState, l = Yt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function na(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ct.updateQueue, t === null && (t = Zc(), ct.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function ai() {
    return { destroy: void 0, resource: void 0 };
  }
  function Kd() {
    return Yt().memoizedState;
  }
  function ni(e, t, l, a) {
    var n = ls();
    a = a === void 0 ? null : a, ct.flags |= e, n.memoizedState = na(
      1 | t,
      ai(),
      l,
      a
    );
  }
  function Ia(e, t, l, a) {
    var n = Yt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    yt !== null && a !== null && Lc(a, yt.memoizedState.deps) ? n.memoizedState = na(t, i, l, a) : (ct.flags |= e, n.memoizedState = na(
      1 | t,
      i,
      l,
      a
    ));
  }
  function $d(e, t) {
    ni(8390656, 8, e, t);
  }
  function Wd(e, t) {
    Ia(2048, 8, e, t);
  }
  function Fd(e, t) {
    return Ia(4, 2, e, t);
  }
  function Id(e, t) {
    return Ia(4, 4, e, t);
  }
  function Pd(e, t) {
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
  function eo(e, t, l) {
    l = l != null ? l.concat([e]) : null, Ia(4, 4, Pd.bind(null, t, e), l);
  }
  function Fc() {
  }
  function to(e, t) {
    var l = Yt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Lc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function so(e, t) {
    var l = Yt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Lc(t, a[1]))
      return a[0];
    if (a = e(), Ml) {
      He(!0);
      try {
        e();
      } finally {
        He(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Ic(e, t, l) {
    return l === void 0 || (nl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = ih(), ct.lanes |= e, hl |= e, l);
  }
  function lo(e, t, l, a) {
    return is(l, t) ? l : sa.current !== null ? (e = Ic(e, l, a), is(e, t) || (Zt = !0), e) : (nl & 42) === 0 ? (Zt = !0, e.memoizedState = l) : (e = ih(), ct.lanes |= e, hl |= e, t);
  }
  function ao(e, t, l, a, n) {
    var i = Y.p;
    Y.p = i !== 0 && 8 > i ? i : 8;
    var c = y.T, o = {};
    y.T = o, tr(e, !1, t, l);
    try {
      var g = n(), T = y.S;
      if (T !== null && T(o, g), g !== null && typeof g == "object" && typeof g.then == "function") {
        var J = Pm(
          g,
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
    } catch (se) {
      Pa(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: se },
        os()
      );
    } finally {
      Y.p = i, y.T = c;
    }
  }
  function ax() {
  }
  function Pc(e, t, l, a) {
    if (e.tag !== 5) throw Error(d(476));
    var n = no(e).queue;
    ao(
      e,
      n,
      t,
      ee,
      l === null ? ax : function() {
        return io(e), l(a);
      }
    );
  }
  function no(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: ee,
      baseState: ee,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Gs,
        lastRenderedState: ee
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
  function io(e) {
    var t = no(e).next.queue;
    Pa(e, t, {}, os());
  }
  function er() {
    return Pt(pn);
  }
  function co() {
    return Yt().memoizedState;
  }
  function ro() {
    return Yt().memoizedState;
  }
  function nx(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = os();
          e = ll(l);
          var a = al(t, e, l);
          a !== null && (hs(a, t, l), Ja(a, t, l)), t = { cache: Tc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function ix(e, t, l) {
    var a = os();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ii(e) ? oo(t, l) : (l = bc(e, t, l, a), l !== null && (hs(l, e, a), ho(l, t, a)));
  }
  function uo(e, t, l) {
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
    if (ii(e)) oo(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, o = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = o, is(o, c))
            return Qn(e, t, n, 0), kt === null && Gn(), !1;
        } catch {
        } finally {
        }
      if (l = bc(e, t, n, a), l !== null)
        return hs(l, e, a), ho(l, t, a), !0;
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
    }, ii(e)) {
      if (t) throw Error(d(479));
    } else
      t = bc(
        e,
        l,
        a,
        2
      ), t !== null && hs(t, e, 2);
  }
  function ii(e) {
    var t = e.alternate;
    return e === ct || t !== null && t === ct;
  }
  function oo(e, t) {
    la = ei = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function ho(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, x(e, l);
    }
  }
  var ci = {
    readContext: Pt,
    use: si,
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
  }, fo = {
    readContext: Pt,
    use: si,
    useCallback: function(e, t) {
      return ls().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Pt,
    useEffect: $d,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ni(
        4194308,
        4,
        Pd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ni(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ni(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ls();
      t = t === void 0 ? null : t;
      var a = e();
      if (Ml) {
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
      var a = ls();
      if (l !== void 0) {
        var n = l(t);
        if (Ml) {
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
      }, a.queue = e, e = e.dispatch = ix.bind(
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
      e = $c(e);
      var t = e.queue, l = uo.bind(null, ct, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = ls();
      return Ic(l, e, t);
    },
    useTransition: function() {
      var e = $c(!1);
      return e = ao.bind(
        null,
        ct,
        e.queue,
        !0,
        !1
      ), ls().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ct, n = ls();
      if (jt) {
        if (l === void 0)
          throw Error(d(407));
        l = l();
      } else {
        if (l = t(), kt === null)
          throw Error(d(349));
        (ft & 124) !== 0 || Rd(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, $d(Dd.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, na(
        9,
        ai(),
        Ud.bind(
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
      var e = ls(), t = kt.identifierPrefix;
      if (jt) {
        var l = Bs, a = Hs;
        l = (a & ~(1 << 32 - tt(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = ti++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = ex++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: er,
    useFormState: Xd,
    useActionState: Xd,
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
        ct,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Vc,
    useCacheRefresh: function() {
      return ls().memoizedState = nx.bind(
        null,
        ct
      );
    }
  }, mo = {
    readContext: Pt,
    use: si,
    useCallback: to,
    useContext: Pt,
    useEffect: Wd,
    useImperativeHandle: eo,
    useInsertionEffect: Fd,
    useLayoutEffect: Id,
    useMemo: so,
    useReducer: li,
    useRef: Kd,
    useState: function() {
      return li(Gs);
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = Yt();
      return lo(
        l,
        yt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = li(Gs)[0], t = Yt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: Ad,
    useId: co,
    useHostTransitionStatus: er,
    useFormState: Zd,
    useActionState: Zd,
    useOptimistic: function(e, t) {
      var l = Yt();
      return Hd(l, yt, e, t);
    },
    useMemoCache: Vc,
    useCacheRefresh: ro
  }, cx = {
    readContext: Pt,
    use: si,
    useCallback: to,
    useContext: Pt,
    useEffect: Wd,
    useImperativeHandle: eo,
    useInsertionEffect: Fd,
    useLayoutEffect: Id,
    useMemo: so,
    useReducer: Kc,
    useRef: Kd,
    useState: function() {
      return Kc(Gs);
    },
    useDebugValue: Fc,
    useDeferredValue: function(e, t) {
      var l = Yt();
      return yt === null ? Ic(l, e, t) : lo(
        l,
        yt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Kc(Gs)[0], t = Yt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fa(e),
        t
      ];
    },
    useSyncExternalStore: Ad,
    useId: co,
    useHostTransitionStatus: er,
    useFormState: Jd,
    useActionState: Jd,
    useOptimistic: function(e, t) {
      var l = Yt();
      return yt !== null ? Hd(l, yt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Vc,
    useCacheRefresh: ro
  }, ia = null, en = 0;
  function ri(e) {
    var t = en;
    return en += 1, ia === null && (ia = []), Sd(ia, e, t);
  }
  function tn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ui(e, t) {
    throw t.$$typeof === K ? Error(d(525)) : (e = Object.prototype.toString.call(t), Error(
      d(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function xo(e) {
    var t = e._init;
    return t(e._payload);
  }
  function jo(e) {
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
    function c(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function o(C, N, O, F) {
      return N === null || N.tag !== 6 ? (N = _c(O, C.mode, F), N.return = C, N) : (N = n(N, O), N.return = C, N);
    }
    function g(C, N, O, F) {
      var Me = O.type;
      return Me === xe ? J(
        C,
        N,
        O.props.children,
        F,
        O.key
      ) : N !== null && (N.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Re && xo(Me) === N.type) ? (N = n(N, O.props), tn(N, O), N.return = C, N) : (N = Zn(
        O.type,
        O.key,
        O.props,
        null,
        C.mode,
        F
      ), tn(N, O), N.return = C, N);
    }
    function T(C, N, O, F) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== O.containerInfo || N.stateNode.implementation !== O.implementation ? (N = Nc(O, C.mode, F), N.return = C, N) : (N = n(N, O.children || []), N.return = C, N);
    }
    function J(C, N, O, F, Me) {
      return N === null || N.tag !== 7 ? (N = El(
        O,
        C.mode,
        F,
        Me
      ), N.return = C, N) : (N = n(N, O), N.return = C, N);
    }
    function se(C, N, O) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = _c(
          "" + N,
          C.mode,
          O
        ), N.return = C, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case k:
            return O = Zn(
              N.type,
              N.key,
              N.props,
              null,
              C.mode,
              O
            ), tn(O, N), O.return = C, O;
          case le:
            return N = Nc(
              N,
              C.mode,
              O
            ), N.return = C, N;
          case Re:
            var F = N._init;
            return N = F(N._payload), se(C, N, O);
        }
        if (de(N) || pe(N))
          return N = El(
            N,
            C.mode,
            O,
            null
          ), N.return = C, N;
        if (typeof N.then == "function")
          return se(C, ri(N), O);
        if (N.$$typeof === I)
          return se(
            C,
            $n(C, N),
            O
          );
        ui(C, N);
      }
      return null;
    }
    function A(C, N, O, F) {
      var Me = N !== null ? N.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return Me !== null ? null : o(C, N, "" + O, F);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            return O.key === Me ? g(C, N, O, F) : null;
          case le:
            return O.key === Me ? T(C, N, O, F) : null;
          case Re:
            return Me = O._init, O = Me(O._payload), A(C, N, O, F);
        }
        if (de(O) || pe(O))
          return Me !== null ? null : J(C, N, O, F, null);
        if (typeof O.then == "function")
          return A(
            C,
            N,
            ri(O),
            F
          );
        if (O.$$typeof === I)
          return A(
            C,
            N,
            $n(C, O),
            F
          );
        ui(C, O);
      }
      return null;
    }
    function q(C, N, O, F, Me) {
      if (typeof F == "string" && F !== "" || typeof F == "number" || typeof F == "bigint")
        return C = C.get(O) || null, o(N, C, "" + F, Me);
      if (typeof F == "object" && F !== null) {
        switch (F.$$typeof) {
          case k:
            return C = C.get(
              F.key === null ? O : F.key
            ) || null, g(N, C, F, Me);
          case le:
            return C = C.get(
              F.key === null ? O : F.key
            ) || null, T(N, C, F, Me);
          case Re:
            var ut = F._init;
            return F = ut(F._payload), q(
              C,
              N,
              O,
              F,
              Me
            );
        }
        if (de(F) || pe(F))
          return C = C.get(O) || null, J(N, C, F, Me, null);
        if (typeof F.then == "function")
          return q(
            C,
            N,
            O,
            ri(F),
            Me
          );
        if (F.$$typeof === I)
          return q(
            C,
            N,
            O,
            $n(N, F),
            Me
          );
        ui(N, F);
      }
      return null;
    }
    function Ie(C, N, O, F) {
      for (var Me = null, ut = null, Ye = N, $e = N = 0, Jt = null; Ye !== null && $e < O.length; $e++) {
        Ye.index > $e ? (Jt = Ye, Ye = null) : Jt = Ye.sibling;
        var mt = A(
          C,
          Ye,
          O[$e],
          F
        );
        if (mt === null) {
          Ye === null && (Ye = Jt);
          break;
        }
        e && Ye && mt.alternate === null && t(C, Ye), N = i(mt, N, $e), ut === null ? Me = mt : ut.sibling = mt, ut = mt, Ye = Jt;
      }
      if ($e === O.length)
        return l(C, Ye), jt && Tl(C, $e), Me;
      if (Ye === null) {
        for (; $e < O.length; $e++)
          Ye = se(C, O[$e], F), Ye !== null && (N = i(
            Ye,
            N,
            $e
          ), ut === null ? Me = Ye : ut.sibling = Ye, ut = Ye);
        return jt && Tl(C, $e), Me;
      }
      for (Ye = a(Ye); $e < O.length; $e++)
        Jt = q(
          Ye,
          C,
          $e,
          O[$e],
          F
        ), Jt !== null && (e && Jt.alternate !== null && Ye.delete(
          Jt.key === null ? $e : Jt.key
        ), N = i(
          Jt,
          N,
          $e
        ), ut === null ? Me = Jt : ut.sibling = Jt, ut = Jt);
      return e && Ye.forEach(function(yl) {
        return t(C, yl);
      }), jt && Tl(C, $e), Me;
    }
    function Je(C, N, O, F) {
      if (O == null) throw Error(d(151));
      for (var Me = null, ut = null, Ye = N, $e = N = 0, Jt = null, mt = O.next(); Ye !== null && !mt.done; $e++, mt = O.next()) {
        Ye.index > $e ? (Jt = Ye, Ye = null) : Jt = Ye.sibling;
        var yl = A(C, Ye, mt.value, F);
        if (yl === null) {
          Ye === null && (Ye = Jt);
          break;
        }
        e && Ye && yl.alternate === null && t(C, Ye), N = i(yl, N, $e), ut === null ? Me = yl : ut.sibling = yl, ut = yl, Ye = Jt;
      }
      if (mt.done)
        return l(C, Ye), jt && Tl(C, $e), Me;
      if (Ye === null) {
        for (; !mt.done; $e++, mt = O.next())
          mt = se(C, mt.value, F), mt !== null && (N = i(mt, N, $e), ut === null ? Me = mt : ut.sibling = mt, ut = mt);
        return jt && Tl(C, $e), Me;
      }
      for (Ye = a(Ye); !mt.done; $e++, mt = O.next())
        mt = q(Ye, C, $e, mt.value, F), mt !== null && (e && mt.alternate !== null && Ye.delete(mt.key === null ? $e : mt.key), N = i(mt, N, $e), ut === null ? Me = mt : ut.sibling = mt, ut = mt);
      return e && Ye.forEach(function(rj) {
        return t(C, rj);
      }), jt && Tl(C, $e), Me;
    }
    function Nt(C, N, O, F) {
      if (typeof O == "object" && O !== null && O.type === xe && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            e: {
              for (var Me = O.key; N !== null; ) {
                if (N.key === Me) {
                  if (Me = O.type, Me === xe) {
                    if (N.tag === 7) {
                      l(
                        C,
                        N.sibling
                      ), F = n(
                        N,
                        O.props.children
                      ), F.return = C, C = F;
                      break e;
                    }
                  } else if (N.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Re && xo(Me) === N.type) {
                    l(
                      C,
                      N.sibling
                    ), F = n(N, O.props), tn(F, O), F.return = C, C = F;
                    break e;
                  }
                  l(C, N);
                  break;
                } else t(C, N);
                N = N.sibling;
              }
              O.type === xe ? (F = El(
                O.props.children,
                C.mode,
                F,
                O.key
              ), F.return = C, C = F) : (F = Zn(
                O.type,
                O.key,
                O.props,
                null,
                C.mode,
                F
              ), tn(F, O), F.return = C, C = F);
            }
            return c(C);
          case le:
            e: {
              for (Me = O.key; N !== null; ) {
                if (N.key === Me)
                  if (N.tag === 4 && N.stateNode.containerInfo === O.containerInfo && N.stateNode.implementation === O.implementation) {
                    l(
                      C,
                      N.sibling
                    ), F = n(N, O.children || []), F.return = C, C = F;
                    break e;
                  } else {
                    l(C, N);
                    break;
                  }
                else t(C, N);
                N = N.sibling;
              }
              F = Nc(O, C.mode, F), F.return = C, C = F;
            }
            return c(C);
          case Re:
            return Me = O._init, O = Me(O._payload), Nt(
              C,
              N,
              O,
              F
            );
        }
        if (de(O))
          return Ie(
            C,
            N,
            O,
            F
          );
        if (pe(O)) {
          if (Me = pe(O), typeof Me != "function") throw Error(d(150));
          return O = Me.call(O), Je(
            C,
            N,
            O,
            F
          );
        }
        if (typeof O.then == "function")
          return Nt(
            C,
            N,
            ri(O),
            F
          );
        if (O.$$typeof === I)
          return Nt(
            C,
            N,
            $n(C, O),
            F
          );
        ui(C, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, N !== null && N.tag === 6 ? (l(C, N.sibling), F = n(N, O), F.return = C, C = F) : (l(C, N), F = _c(O, C.mode, F), F.return = C, C = F), c(C)) : l(C, N);
    }
    return function(C, N, O, F) {
      try {
        en = 0;
        var Me = Nt(
          C,
          N,
          O,
          F
        );
        return ia = null, Me;
      } catch (Ye) {
        if (Ye === Za || Ye === Fn) throw Ye;
        var ut = cs(29, Ye, null, C.mode);
        return ut.lanes = F, ut.return = C, ut;
      } finally {
      }
    };
  }
  var ca = jo(!0), vo = jo(!1), gs = H(null), Os = null;
  function il(e) {
    var t = e.alternate;
    $(Qt, Qt.current & 1), $(gs, e), Os === null && (t === null || sa.current !== null || t.memoizedState !== null) && (Os = e);
  }
  function po(e) {
    if (e.tag === 22) {
      if ($(Qt, Qt.current), $(gs, e), Os === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Os = e);
      }
    } else cl();
  }
  function cl() {
    $(Qt, Qt.current), $(gs, gs.current);
  }
  function Qs(e) {
    te(gs), Os === e && (Os = null), te(Qt);
  }
  var Qt = H(0);
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
    t = e.memoizedState, l = l(a, t), l = l == null ? t : U({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var lr = {
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
  function go(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !qa(l, a) || !qa(n, i) : !0;
  }
  function bo(e, t, l, a) {
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
      l === t && (l = U({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  var oi = typeof reportError == "function" ? reportError : function(e) {
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
  function yo(e) {
    oi(e);
  }
  function _o(e) {
    console.error(e);
  }
  function No(e) {
    oi(e);
  }
  function hi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function So(e, t, l) {
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
      hi(e, t);
    }, l;
  }
  function wo(e) {
    return e = ll(e), e.tag = 3, e;
  }
  function ko(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        So(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      So(t, l, a), typeof n != "function" && (fl === null ? fl = /* @__PURE__ */ new Set([this]) : fl.add(this));
      var o = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: o !== null ? o : ""
      });
    });
  }
  function rx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ga(
        t,
        l,
        n,
        !0
      ), l = gs.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Os === null ? Er() : l.alternate === null && Dt === 0 && (Dt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Rc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Tr(e, a, n)), !1;
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
    if (jt)
      return t = gs.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== kc && (e = Error(d(422), { cause: a }), Ya(xs(e, l)))) : (a !== kc && (t = Error(d(423), {
        cause: a
      }), Ya(
        xs(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = xs(a, l), n = ar(
        e.stateNode,
        a,
        n
      ), Mc(e, n), Dt !== 4 && (Dt = 2)), !1;
    var i = Error(d(520), { cause: a });
    if (i = xs(i, l), un === null ? un = [i] : un.push(i), Dt !== 4 && (Dt = 2), t === null) return !0;
    a = xs(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = ar(l.stateNode, a, e), Mc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (fl === null || !fl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = wo(n), ko(
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
  var Co = Error(d(461)), Zt = !1;
  function Kt(e, t, l, a) {
    t.child = e === null ? vo(t, null, l, a) : ca(
      t,
      e.child,
      l,
      a
    );
  }
  function Eo(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var o in a)
        o !== "ref" && (c[o] = a[o]);
    } else c = a;
    return Ul(t), a = Yc(
      e,
      t,
      l,
      c,
      i,
      n
    ), o = Gc(), e !== null && !Zt ? (Qc(e, t, n), Xs(e, t, n)) : (jt && o && Sc(t), t.flags |= 1, Kt(e, t, a, n), t.child);
  }
  function Oo(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !yc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, To(
        e,
        t,
        i,
        a,
        n
      )) : (e = Zn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !hr(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : qa, l(c, a) && e.ref === t.ref)
        return Xs(e, t, n);
    }
    return t.flags |= 1, e = qs(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function To(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (qa(i, a) && e.ref === t.ref)
        if (Zt = !1, t.pendingProps = a = i, hr(e, n))
          (e.flags & 131072) !== 0 && (Zt = !0);
        else
          return t.lanes = e.lanes, Xs(e, t, n);
    }
    return nr(
      e,
      t,
      l,
      a,
      n
    );
  }
  function zo(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return Ao(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Wn(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Od(t, i) : Hc(), po(t);
      else
        return t.lanes = t.childLanes = 536870912, Ao(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (Wn(t, i.cachePool), Od(t, i), cl(), t.memoizedState = null) : (e !== null && Wn(t, null), Hc(), cl());
    return Kt(e, t, n, l), t.child;
  }
  function Ao(e, t, l, a) {
    var n = Ac();
    return n = n === null ? null : { parent: Gt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && Wn(t, null), Hc(), po(t), e !== null && Ga(e, t, a, !0), null;
  }
  function fi(e, t) {
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
    ), a = Gc(), e !== null && !Zt ? (Qc(e, t, n), Xs(e, t, n)) : (jt && a && Sc(t), t.flags |= 1, Kt(e, t, l, n), t.child);
  }
  function Ro(e, t, l, a, n, i) {
    return Ul(t), t.updateQueue = null, l = zd(
      t,
      a,
      l,
      n
    ), Td(e), a = Gc(), e !== null && !Zt ? (Qc(e, t, i), Xs(e, t, i)) : (jt && a && Sc(t), t.flags |= 1, Kt(e, t, l, i), t.child);
  }
  function Uo(e, t, l, a, n) {
    if (Ul(t), t.stateNode === null) {
      var i = Fl, c = l.contextType;
      typeof c == "object" && c !== null && (i = Pt(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = lr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Uc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? Pt(c) : Fl, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (sr(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && lr.enqueueReplaceState(i, i.state, null), $a(t, a, i, n), Ka(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var o = t.memoizedProps, g = ql(l, o);
      i.props = g;
      var T = i.context, J = l.contextType;
      c = Fl, typeof J == "object" && J !== null && (c = Pt(J));
      var se = l.getDerivedStateFromProps;
      J = typeof se == "function" || typeof i.getSnapshotBeforeUpdate == "function", o = t.pendingProps !== o, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (o || T !== c) && bo(
        t,
        i,
        a,
        c
      ), sl = !1;
      var A = t.memoizedState;
      i.state = A, $a(t, a, i, n), Ka(), T = t.memoizedState, o || A !== T || sl ? (typeof se == "function" && (sr(
        t,
        l,
        se,
        a
      ), T = t.memoizedState), (g = sl || go(
        t,
        l,
        g,
        a,
        A,
        T,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = T), i.props = a, i.state = T, i.context = c, a = g) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Dc(e, t), c = t.memoizedProps, J = ql(l, c), i.props = J, se = t.pendingProps, A = i.context, T = l.contextType, g = Fl, typeof T == "object" && T !== null && (g = Pt(T)), o = l.getDerivedStateFromProps, (T = typeof o == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== se || A !== g) && bo(
        t,
        i,
        a,
        g
      ), sl = !1, A = t.memoizedState, i.state = A, $a(t, a, i, n), Ka();
      var q = t.memoizedState;
      c !== se || A !== q || sl || e !== null && e.dependencies !== null && Kn(e.dependencies) ? (typeof o == "function" && (sr(
        t,
        l,
        o,
        a
      ), q = t.memoizedState), (J = sl || go(
        t,
        l,
        J,
        a,
        A,
        q,
        g
      ) || e !== null && e.dependencies !== null && Kn(e.dependencies)) ? (T || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, q, g), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        q,
        g
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = q), i.props = a, i.state = q, i.context = g, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, fi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ca(
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
  function Do(e, t, l, a) {
    return La(), t.flags |= 256, Kt(e, t, l, a), t.child;
  }
  var ir = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function cr(e) {
    return { baseLanes: e, cachePool: yd() };
  }
  function rr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= bs), e;
  }
  function Mo(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Qt.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (jt) {
        if (n ? il(t) : cl(), jt) {
          var o = Ut, g;
          if (g = o) {
            e: {
              for (g = o, o = Es; g.nodeType !== 8; ) {
                if (!o) {
                  o = null;
                  break e;
                }
                if (g = Ss(
                  g.nextSibling
                ), g === null) {
                  o = null;
                  break e;
                }
              }
              o = g;
            }
            o !== null ? (t.memoizedState = {
              dehydrated: o,
              treeContext: Ol !== null ? { id: Hs, overflow: Bs } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, g = cs(
              18,
              null,
              null,
              0
            ), g.stateNode = o, g.return = t, t.child = g, ts = t, Ut = null, g = !0) : g = !1;
          }
          g || Al(t);
        }
        if (o = t.memoizedState, o !== null && (o = o.dehydrated, o !== null))
          return Zr(o) ? t.lanes = 32 : t.lanes = 536870912, null;
        Qs(t);
      }
      return o = a.children, a = a.fallback, n ? (cl(), n = t.mode, o = mi(
        { mode: "hidden", children: o },
        n
      ), a = El(
        a,
        n,
        l,
        null
      ), o.return = t, a.return = t, o.sibling = a, t.child = o, n = t.child, n.memoizedState = cr(l), n.childLanes = rr(
        e,
        c,
        l
      ), t.memoizedState = ir, a) : (il(t), ur(t, o));
    }
    if (g = e.memoizedState, g !== null && (o = g.dehydrated, o !== null)) {
      if (i)
        t.flags & 256 ? (il(t), t.flags &= -257, t = dr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (cl(), t.child = e.child, t.flags |= 128, t = null) : (cl(), n = a.fallback, o = t.mode, a = mi(
          { mode: "visible", children: a.children },
          o
        ), n = El(
          n,
          o,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, ca(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = cr(l), a.childLanes = rr(
          e,
          c,
          l
        ), t.memoizedState = ir, t = n);
      else if (il(t), Zr(o)) {
        if (c = o.nextSibling && o.nextSibling.dataset, c) var T = c.dgst;
        c = T, a = Error(d(419)), a.stack = "", a.digest = c, Ya({ value: a, source: null, stack: null }), t = dr(
          e,
          t,
          l
        );
      } else if (Zt || Ga(e, t, l, !1), c = (l & e.childLanes) !== 0, Zt || c) {
        if (c = kt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : ce(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== g.retryLane))
          throw g.retryLane = a, Wl(e, a), hs(c, e, a), Co;
        o.data === "$?" || Er(), t = dr(
          e,
          t,
          l
        );
      } else
        o.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = g.treeContext, Ut = Ss(
          o.nextSibling
        ), ts = t, jt = !0, zl = null, Es = !1, e !== null && (vs[ps++] = Hs, vs[ps++] = Bs, vs[ps++] = Ol, Hs = e.id, Bs = e.overflow, Ol = t), t = ur(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (cl(), n = a.fallback, o = t.mode, g = e.child, T = g.sibling, a = qs(g, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = g.subtreeFlags & 65011712, T !== null ? n = qs(T, n) : (n = El(
      n,
      o,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, o = e.child.memoizedState, o === null ? o = cr(l) : (g = o.cachePool, g !== null ? (T = Gt._currentValue, g = g.parent !== T ? { parent: T, pool: T } : g) : g = yd(), o = {
      baseLanes: o.baseLanes | l,
      cachePool: g
    }), n.memoizedState = o, n.childLanes = rr(
      e,
      c,
      l
    ), t.memoizedState = ir, a) : (il(t), l = e.child, e = l.sibling, l = qs(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function ur(e, t) {
    return t = mi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function mi(e, t) {
    return e = cs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function dr(e, t, l) {
    return ca(t, e.child, null, l), e = ur(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function qo(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Ec(e.return, t, l);
  }
  function or(e, t, l, a, n) {
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
  function Ho(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (Kt(e, t, a.children, l), a = Qt.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && qo(e, l, t);
          else if (e.tag === 19)
            qo(e, l, t);
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
    switch ($(Qt, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && di(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), or(
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
        or(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        or(t, !1, null, null, void 0);
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
      throw Error(d(153));
    if (t.child !== null) {
      for (e = t.child, l = qs(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = qs(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function hr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Kn(e)));
  }
  function ux(e, t, l) {
    switch (t.tag) {
      case 3:
        ie(t, t.stateNode.containerInfo), tl(t, Gt, e.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        st(t);
        break;
      case 4:
        ie(t, t.stateNode.containerInfo);
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
          return a.dehydrated !== null ? (il(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Mo(e, t, l) : (il(t), e = Xs(
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
            return Ho(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), $(Qt, Qt.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, zo(e, t, l);
      case 24:
        tl(t, Gt, e.memoizedState.cache);
    }
    return Xs(e, t, l);
  }
  function Bo(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Zt = !0;
      else {
        if (!hr(e, l) && (t.flags & 128) === 0)
          return Zt = !1, ux(
            e,
            t,
            l
          );
        Zt = (e.flags & 131072) !== 0;
      }
    else
      Zt = !1, jt && (t.flags & 1048576) !== 0 && md(t, Jn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            yc(a) ? (e = ql(a, e), t.tag = 1, t = Uo(
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
                t.tag = 11, t = Eo(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === je) {
                t.tag = 14, t = Oo(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              }
            }
            throw t = X(a) || a, Error(d(306, t, ""));
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
        ), Uo(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (ie(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(d(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Dc(e, t), $a(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, tl(t, Gt, a), a !== i.cache && Oc(
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
              t = Do(
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
              ), Ya(n), t = Do(
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
              for (Ut = Ss(e.firstChild), ts = t, jt = !0, zl = null, Es = !0, l = vo(
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
        return fi(e, t), e === null ? (l = Qh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : jt || (l = t.type, e = t.pendingProps, a = Ei(
          P.current
        ).createElement(l), a[rt] = t, a[St] = e, Wt(a, l, e), qt(a), t.stateNode = a) : t.memoizedState = Qh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return st(t), e === null && jt && (a = t.stateNode = Lh(
          t.type,
          t.pendingProps,
          P.current
        ), ts = t, Es = !0, n = Ut, jl(t.type) ? (Vr = n, Ut = Ss(
          a.firstChild
        )) : Ut = n), Kt(
          e,
          t,
          t.pendingProps.children,
          l
        ), fi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && jt && ((n = a = Ut) && (a = qx(
          a,
          t.type,
          t.pendingProps,
          Es
        ), a !== null ? (t.stateNode = a, ts = t, Ut = Ss(
          a.firstChild
        ), Es = !1, n = !0) : n = !1), n || Al(t)), st(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, Gr(n, i) ? a = null : c !== null && Gr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Yc(
          e,
          t,
          tx,
          null,
          null,
          l
        ), pn._currentValue = n), fi(e, t), Kt(e, t, a, l), t.child;
      case 6:
        return e === null && jt && ((e = l = Ut) && (l = Hx(
          l,
          t.pendingProps,
          Es
        ), l !== null ? (t.stateNode = l, ts = t, Ut = null, e = !0) : e = !1), e || Al(t)), null;
      case 13:
        return Mo(e, t, l);
      case 4:
        return ie(
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
        return Eo(
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
        return n = t.type._context, a = t.pendingProps.children, Ul(t), n = Pt(n), a = a(n), t.flags |= 1, Kt(e, t, a, l), t.child;
      case 14:
        return Oo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return To(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Ho(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = mi(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = qs(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return zo(e, t, l);
      case 24:
        return Ul(t), a = Pt(Gt), e === null ? (n = Ac(), n === null && (n = kt, i = Tc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Uc(t), tl(t, Gt, n)) : ((e.lanes & l) !== 0 && (Dc(e, t), $a(t, null, null, l), Ka()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), tl(t, Gt, a)) : (a = i.cache, tl(t, Gt, a), a !== n.cache && Oc(
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
    throw Error(d(156, t.tag));
  }
  function Zs(e) {
    e.flags |= 4;
  }
  function Lo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Kh(t)) {
      if (t = gs.current, t !== null && ((ft & 4194048) === ft ? Os !== null : (ft & 62914560) !== ft && (ft & 536870912) === 0 || t !== Os))
        throw Va = Rc, _d;
      e.flags |= 8192;
    }
  }
  function xi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? z() : 536870912, e.lanes |= t, oa |= t);
  }
  function sn(e, t) {
    if (!jt)
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
  function dx(e, t, l) {
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
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ys(Gt), Se(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ba(t) ? Zs(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, vd())), zt(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (Zs(t), l !== null ? (zt(t), Lo(t, l)) : (zt(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (Zs(t), zt(t), Lo(t, l)) : (zt(t), t.flags &= -16777217) : (e.memoizedProps !== a && Zs(t), zt(t), t.flags &= -16777217), null;
      case 27:
        lt(t), l = P.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(d(166));
            return zt(t), null;
          }
          e = ae.current, Ba(t) ? xd(t) : (e = Lh(n, a, l), t.stateNode = e, Zs(t));
        }
        return zt(t), null;
      case 5:
        if (lt(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(d(166));
            return zt(t), null;
          }
          if (e = ae.current, Ba(t))
            xd(t);
          else {
            switch (n = Ei(
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
            e[rt] = t, e[St] = a;
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
        return zt(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Zs(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(d(166));
          if (e = P.current, Ba(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = ts, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[rt] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Rh(e.nodeValue, l)), e || Al(t);
          } else
            e = Ei(e).createTextNode(
              a
            ), e[rt] = t, t.stateNode = e;
        }
        return zt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ba(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(d(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(d(317));
              n[rt] = t;
            } else
              La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            zt(t), n = !1;
          } else
            n = vd(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
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
        return l !== e && l && (t.child.flags |= 8192), xi(t, t.updateQueue), zt(t), null;
      case 4:
        return Se(), e === null && qr(t.stateNode.containerInfo), zt(t), null;
      case 10:
        return Ys(t.type), zt(t), null;
      case 19:
        if (te(Qt), n = t.memoizedState, n === null) return zt(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) sn(n, !1);
          else {
            if (Dt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = di(e), i !== null) {
                  for (t.flags |= 128, sn(n, !1), e = i.updateQueue, t.updateQueue = e, xi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    fd(l, e), l = l.sibling;
                  return $(
                    Qt,
                    Qt.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && Le() > pi && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = di(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, xi(t, e), sn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !jt)
                return zt(t), null;
            } else
              2 * Le() - n.renderingStartTime > pi && l !== 536870912 && (t.flags |= 128, a = !0, sn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = Le(), t.sibling = null, e = Qt.current, $(Qt, a ? e & 1 | 2 : e & 1), t) : (zt(t), null);
      case 22:
      case 23:
        return Qs(t), Bc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (zt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : zt(t), l = t.updateQueue, l !== null && xi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && te(Dl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ys(Gt), zt(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(d(156, t.tag));
  }
  function ox(e, t) {
    switch (wc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ys(Gt), Se(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return lt(t), null;
      case 13:
        if (Qs(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(d(340));
          La();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return te(Qt), null;
      case 4:
        return Se(), null;
      case 10:
        return Ys(t.type), null;
      case 22:
      case 23:
        return Qs(t), Bc(), e !== null && te(Dl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ys(Gt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Yo(e, t) {
    switch (wc(t), t.tag) {
      case 3:
        Ys(Gt), Se();
        break;
      case 26:
      case 27:
      case 5:
        lt(t);
        break;
      case 4:
        Se();
        break;
      case 13:
        Qs(t);
        break;
      case 19:
        te(Qt);
        break;
      case 10:
        Ys(t.type);
        break;
      case 22:
      case 23:
        Qs(t), Bc(), e !== null && te(Dl);
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
    } catch (o) {
      wt(t, t.return, o);
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
            var c = a.inst, o = c.destroy;
            if (o !== void 0) {
              c.destroy = void 0, n = t;
              var g = l, T = o;
              try {
                T();
              } catch (J) {
                wt(
                  n,
                  g,
                  J
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (J) {
      wt(t, t.return, J);
    }
  }
  function Go(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Ed(t, l);
      } catch (a) {
        wt(e, e.return, a);
      }
    }
  }
  function Qo(e, t, l) {
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
  function Xo(e) {
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
      Ax(a, e.type, l, t), a[St] = t;
    } catch (n) {
      wt(e, e.return, n);
    }
  }
  function Zo(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && jl(e.type) || e.tag === 4;
  }
  function mr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Zo(e.return)) return null;
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
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Ci));
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (xr(e, t, l), e = e.sibling; e !== null; )
        xr(e, t, l), e = e.sibling;
  }
  function ji(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && jl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (ji(e, t, l), e = e.sibling; e !== null; )
        ji(e, t, l), e = e.sibling;
  }
  function Vo(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Wt(t, a, l), t[rt] = e, t[St] = l;
    } catch (i) {
      wt(e, e.return, i);
    }
  }
  var Vs = !1, Bt = !1, jr = !1, Jo = typeof WeakSet == "function" ? WeakSet : Set, Vt = null;
  function hx(e, t) {
    if (e = e.containerInfo, Lr = Ui, e = ld(e), mc(e)) {
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
            var c = 0, o = -1, g = -1, T = 0, J = 0, se = e, A = null;
            t: for (; ; ) {
              for (var q; se !== l || n !== 0 && se.nodeType !== 3 || (o = c + n), se !== i || a !== 0 && se.nodeType !== 3 || (g = c + a), se.nodeType === 3 && (c += se.nodeValue.length), (q = se.firstChild) !== null; )
                A = se, se = q;
              for (; ; ) {
                if (se === e) break t;
                if (A === l && ++T === n && (o = c), A === i && ++J === a && (g = c), (q = se.nextSibling) !== null) break;
                se = A, A = se.parentNode;
              }
              se = q;
            }
            l = o === -1 || g === -1 ? null : { start: o, end: g };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Yr = { focusedElem: e, selectionRange: l }, Ui = !1, Vt = t; Vt !== null; )
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
                  var Ie = ql(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    Ie,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Je) {
                  wt(
                    l,
                    l.return,
                    Je
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Xr(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Xr(e);
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
            e.return = t.return, Vt = e;
            break;
          }
          Vt = t.return;
        }
  }
  function Ko(e, t, l) {
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
              wt(l, l.return, c);
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
              wt(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Go(l), a & 512 && an(l, l.return);
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
            Ed(e, t);
          } catch (c) {
            wt(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Vo(l);
      case 26:
      case 5:
        ul(e, l), t === null && a & 4 && Xo(l), a & 512 && an(l, l.return);
        break;
      case 12:
        ul(e, l);
        break;
      case 13:
        ul(e, l), a & 4 && Fo(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = yx.bind(
          null,
          l
        ), Bx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Vs, !a) {
          t = t !== null && t.memoizedState !== null || Bt, n = Vs;
          var i = Bt;
          Vs = a, (Bt = t) && !i ? dl(
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
  function $o(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, $o(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ae(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ot = null, as = !1;
  function Js(e, t, l) {
    for (l = l.child; l !== null; )
      Wo(e, t, l), l = l.sibling;
  }
  function Wo(e, t, l) {
    if (ve && typeof ve.onCommitFiberUnmount == "function")
      try {
        ve.onCommitFiberUnmount(W, l);
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
        var a = Ot, n = as;
        jl(l.type) && (Ot = l.stateNode, as = !1), Js(
          e,
          t,
          l
        ), mn(l.stateNode), Ot = a, as = n;
        break;
      case 5:
        Bt || Ts(l, t);
      case 6:
        if (a = Ot, n = as, Ot = null, Js(
          e,
          t,
          l
        ), Ot = a, as = n, Ot !== null)
          if (as)
            try {
              (Ot.nodeType === 9 ? Ot.body : Ot.nodeName === "HTML" ? Ot.ownerDocument.body : Ot).removeChild(l.stateNode);
            } catch (i) {
              wt(
                l,
                t,
                i
              );
            }
          else
            try {
              Ot.removeChild(l.stateNode);
            } catch (i) {
              wt(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Ot !== null && (as ? (e = Ot, Hh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), _n(e)) : Hh(Ot, l.stateNode));
        break;
      case 4:
        a = Ot, n = as, Ot = l.stateNode.containerInfo, as = !0, Js(
          e,
          t,
          l
        ), Ot = a, as = n;
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
        Bt || (Ts(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Qo(
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
  function Fo(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        _n(e);
      } catch (l) {
        wt(t, t.return, l);
      }
  }
  function fx(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Jo()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Jo()), t;
      default:
        throw Error(d(435, e.tag));
    }
  }
  function vr(e, t) {
    var l = fx(e);
    t.forEach(function(a) {
      var n = _x.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function rs(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, o = c;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case 27:
              if (jl(o.type)) {
                Ot = o.stateNode, as = !1;
                break e;
              }
              break;
            case 5:
              Ot = o.stateNode, as = !1;
              break e;
            case 3:
            case 4:
              Ot = o.stateNode.containerInfo, as = !0;
              break e;
          }
          o = o.return;
        }
        if (Ot === null) throw Error(d(160));
        Wo(i, c, n), Ot = null, as = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Io(t, e), t = t.sibling;
  }
  var Ns = null;
  function Io(e, t) {
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
                      i = n.getElementsByTagName("title")[0], (!i || i[ze] || i[rt] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), Wt(i, a, l), i[rt] = e, qt(i), a = i;
                      break e;
                    case "link":
                      var c = Vh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var o = 0; o < c.length; o++)
                          if (i = c[o], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(o, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Vh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (o = 0; o < c.length; o++)
                          if (i = c[o], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(o, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), Wt(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(d(468, a));
                  }
                  i[rt] = e, qt(i), a = i;
                }
                e.stateNode = a;
              } else
                Jh(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Zh(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? Jh(
              n,
              e.type,
              e.stateNode
            ) : Zh(
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
          } catch (q) {
            wt(e, e.return, q);
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
          } catch (q) {
            wt(e, e.return, q);
          }
        }
        break;
      case 3:
        if (zi = null, n = Ns, Ns = Oi(t.containerInfo), rs(t, e), Ns = n, us(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            _n(t.containerInfo);
          } catch (q) {
            wt(e, e.return, q);
          }
        jr && (jr = !1, Po(e));
        break;
      case 4:
        a = Ns, Ns = Oi(
          e.stateNode.containerInfo
        ), rs(t, e), us(e), Ns = a;
        break;
      case 12:
        rs(t, e), us(e);
        break;
      case 13:
        rs(t, e), us(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Nr = Le()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, vr(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var g = l !== null && l.memoizedState !== null, T = Vs, J = Bt;
        if (Vs = T || n, Bt = J || g, rs(t, e), Bt = J, Vs = T, us(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || g || Vs || Bt || Hl(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                g = l = t;
                try {
                  if (i = g.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    o = g.stateNode;
                    var se = g.memoizedProps.style, A = se != null && se.hasOwnProperty("display") ? se.display : null;
                    o.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (q) {
                  wt(g, g.return, q);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                g = t;
                try {
                  g.stateNode.nodeValue = n ? "" : g.memoizedProps;
                } catch (q) {
                  wt(g, g.return, q);
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
          if (Zo(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(d(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = mr(e);
            ji(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (Ql(c, ""), l.flags &= -33);
            var o = mr(e);
            ji(e, o, c);
            break;
          case 3:
          case 4:
            var g = l.stateNode.containerInfo, T = mr(e);
            xr(
              e,
              T,
              g
            );
            break;
          default:
            throw Error(d(161));
        }
      } catch (J) {
        wt(e, e.return, J);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Po(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Po(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function ul(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Ko(e, t.alternate, t), t = t.sibling;
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
          typeof l.componentWillUnmount == "function" && Qo(
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
              wt(a, a.return, T);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var o = a.stateNode;
            try {
              var g = n.shared.hiddenCallbacks;
              if (g !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < g.length; n++)
                  Cd(g[n], o);
            } catch (T) {
              wt(a, a.return, T);
            }
          }
          l && c & 64 && Go(i), an(i, i.return);
          break;
        case 27:
          Vo(i);
        case 26:
        case 5:
          dl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Xo(i), an(i, i.return);
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
          ), l && c & 4 && Fo(n, i);
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
  function pr(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Qa(l));
  }
  function gr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qa(e));
  }
  function zs(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        eh(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function eh(e, t, l, a) {
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
            var i = t.memoizedProps, c = i.id, o = i.onPostCommit;
            typeof o == "function" && o(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (g) {
            wt(t, t.return, g);
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
        )), n & 2048 && pr(c, t);
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
  function ra(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, o = l, g = a, T = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ra(
            i,
            c,
            o,
            g,
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
            o,
            g,
            n
          ) : nn(
            i,
            c
          ) : (J._visibility |= 2, ra(
            i,
            c,
            o,
            g,
            n
          )), n && T & 2048 && pr(
            c.alternate,
            c
          );
          break;
        case 24:
          ra(
            i,
            c,
            o,
            g,
            n
          ), n && T & 2048 && gr(c.alternate, c);
          break;
        default:
          ra(
            i,
            c,
            o,
            g,
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
  function ua(e) {
    if (e.subtreeFlags & cn)
      for (e = e.child; e !== null; )
        th(e), e = e.sibling;
  }
  function th(e) {
    switch (e.tag) {
      case 26:
        ua(e), e.flags & cn && e.memoizedState !== null && Ix(
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
        Ns = Oi(e.stateNode.containerInfo), ua(e), Ns = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = cn, cn = 16777216, ua(e), cn = t) : ua(e));
        break;
      default:
        ua(e);
    }
  }
  function sh(e) {
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
          Vt = a, ah(
            a,
            e
          );
        }
      sh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        lh(e), e = e.sibling;
  }
  function lh(e) {
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
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, vi(e)) : rn(e);
        break;
      default:
        rn(e);
    }
  }
  function vi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Vt = a, ah(
            a,
            e
          );
        }
      sh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          rl(8, t, t.return), vi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, vi(t));
          break;
        default:
          vi(t);
      }
      e = e.sibling;
    }
  }
  function ah(e, t) {
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
          if ($o(a), a === l) {
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
  var mx = {
    getCacheForType: function(e) {
      var t = Pt(Gt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, xx = typeof WeakMap == "function" ? WeakMap : Map, gt = 0, kt = null, ot = null, ft = 0, bt = 0, ds = null, ol = !1, da = !1, br = !1, Ks = 0, Dt = 0, hl = 0, Bl = 0, yr = 0, bs = 0, oa = 0, un = null, ns = null, _r = !1, Nr = 0, pi = 1 / 0, gi = null, fl = null, $t = 0, ml = null, ha = null, fa = 0, Sr = 0, wr = null, nh = null, dn = 0, kr = null;
  function os() {
    if ((gt & 2) !== 0 && ft !== 0)
      return ft & -ft;
    if (y.T !== null) {
      var e = ea;
      return e !== 0 ? e : Rr();
    }
    return vt();
  }
  function ih() {
    bs === 0 && (bs = (ft & 536870912) === 0 || jt ? xt() : 536870912);
    var e = gs.current;
    return e !== null && (e.flags |= 32), bs;
  }
  function hs(e, t, l) {
    (e === kt && (bt === 2 || bt === 9) || e.cancelPendingCommit !== null) && (ma(e, 0), xl(
      e,
      ft,
      bs,
      !1
    )), ue(e, l), ((gt & 2) === 0 || e !== kt) && (e === kt && ((gt & 2) === 0 && (Bl |= l), Dt === 4 && xl(
      e,
      ft,
      bs,
      !1
    )), As(e));
  }
  function ch(e, t, l) {
    if ((gt & 6) !== 0) throw Error(d(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || ge(e, t), n = a ? px(e, t) : Or(e, t, !0), i = a;
    do {
      if (n === 0) {
        da && !a && xl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !jx(l)) {
          n = Or(e, t, !1), i = !1;
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
              var o = e;
              n = un;
              var g = o.current.memoizedState.isDehydrated;
              if (g && (ma(o, c).flags |= 256), c = Or(
                o,
                c,
                !1
              ), c !== 2) {
                if (br && !g) {
                  o.errorRecoveryDisabledLanes |= i, Bl |= i, n = 4;
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
              throw Error(d(345));
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
              throw Error(d(329));
          }
          if ((t & 62914560) === t && (n = Nr + 300 - Le(), 10 < n)) {
            if (xl(
              a,
              t,
              bs,
              !ol
            ), be(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Mh(
              rh.bind(
                null,
                a,
                l,
                ns,
                gi,
                _r,
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
          rh(
            a,
            l,
            ns,
            gi,
            _r,
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
  function rh(e, t, l, a, n, i, c, o, g, T, J, se, A, q) {
    if (e.timeoutHandle = -1, se = t.subtreeFlags, (se & 8192 || (se & 16785408) === 16785408) && (vn = { stylesheets: null, count: 0, unsuspend: Fx }, th(t), se = Px(), se !== null)) {
      e.cancelPendingCommit = se(
        xh.bind(
          null,
          e,
          t,
          i,
          l,
          a,
          n,
          c,
          o,
          g,
          J,
          1,
          A,
          q
        )
      ), xl(e, i, c, !T);
      return;
    }
    xh(
      e,
      t,
      i,
      l,
      a,
      n,
      c,
      o,
      g
    );
  }
  function jx(e) {
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
      var i = 31 - tt(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && G(e, l, t);
  }
  function bi() {
    return (gt & 6) === 0 ? (on(0), !1) : !0;
  }
  function Cr() {
    if (ot !== null) {
      if (bt === 0)
        var e = ot.return;
      else
        e = ot, Ls = Rl = null, Xc(e), ia = null, en = 0, e = ot;
      for (; e !== null; )
        Yo(e.alternate, e), e = e.return;
      ot = null;
    }
  }
  function ma(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Ux(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Cr(), kt = e, ot = l = qs(e.current, null), ft = t, bt = 0, ds = null, ol = !1, da = ge(e, t), br = !1, oa = bs = yr = Bl = hl = Dt = 0, ns = un = null, _r = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - tt(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return Ks = t, Gn(), l;
  }
  function uh(e, t) {
    ct = null, y.H = ci, t === Za || t === Fn ? (t = wd(), bt = 3) : t === _d ? (t = wd(), bt = 4) : bt = t === Co ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ds = t, ot === null && (Dt = 1, hi(
      e,
      xs(t, e.current)
    ));
  }
  function dh() {
    var e = y.H;
    return y.H = ci, e === null ? ci : e;
  }
  function oh() {
    var e = y.A;
    return y.A = mx, e;
  }
  function Er() {
    Dt = 4, ol || (ft & 4194048) !== ft && gs.current !== null || (da = !0), (hl & 134217727) === 0 && (Bl & 134217727) === 0 || kt === null || xl(
      kt,
      ft,
      bs,
      !1
    );
  }
  function Or(e, t, l) {
    var a = gt;
    gt |= 2;
    var n = dh(), i = oh();
    (kt !== e || ft !== t) && (gi = null, ma(e, t)), t = !1;
    var c = Dt;
    e: do
      try {
        if (bt !== 0 && ot !== null) {
          var o = ot, g = ds;
          switch (bt) {
            case 8:
              Cr(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              gs.current === null && (t = !0);
              var T = bt;
              if (bt = 0, ds = null, xa(e, o, g, T), l && da) {
                c = 0;
                break e;
              }
              break;
            default:
              T = bt, bt = 0, ds = null, xa(e, o, g, T);
          }
        }
        vx(), c = Dt;
        break;
      } catch (J) {
        uh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ls = Rl = null, gt = a, y.H = n, y.A = i, ot === null && (kt = null, ft = 0, Gn()), c;
  }
  function vx() {
    for (; ot !== null; ) hh(ot);
  }
  function px(e, t) {
    var l = gt;
    gt |= 2;
    var a = dh(), n = oh();
    kt !== e || ft !== t ? (gi = null, pi = Le() + 500, ma(e, t)) : da = ge(
      e,
      t
    );
    e: do
      try {
        if (bt !== 0 && ot !== null) {
          t = ot;
          var i = ds;
          t: switch (bt) {
            case 1:
              bt = 0, ds = null, xa(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (Nd(i)) {
                bt = 0, ds = null, fh(t);
                break;
              }
              t = function() {
                bt !== 2 && bt !== 9 || kt !== e || (bt = 7), As(e);
              }, i.then(t, t);
              break e;
            case 3:
              bt = 7;
              break e;
            case 4:
              bt = 5;
              break e;
            case 7:
              Nd(i) ? (bt = 0, ds = null, fh(t)) : (bt = 0, ds = null, xa(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (ot.tag) {
                case 26:
                  c = ot.memoizedState;
                case 5:
                case 27:
                  var o = ot;
                  if (!c || Kh(c)) {
                    bt = 0, ds = null;
                    var g = o.sibling;
                    if (g !== null) ot = g;
                    else {
                      var T = o.return;
                      T !== null ? (ot = T, yi(T)) : ot = null;
                    }
                    break t;
                  }
              }
              bt = 0, ds = null, xa(e, t, i, 5);
              break;
            case 6:
              bt = 0, ds = null, xa(e, t, i, 6);
              break;
            case 8:
              Cr(), Dt = 6;
              break e;
            default:
              throw Error(d(462));
          }
        }
        gx();
        break;
      } catch (J) {
        uh(e, J);
      }
    while (!0);
    return Ls = Rl = null, y.H = a, y.A = n, gt = l, ot !== null ? 0 : (kt = null, ft = 0, Gn(), Dt);
  }
  function gx() {
    for (; ot !== null && !De(); )
      hh(ot);
  }
  function hh(e) {
    var t = Bo(e.alternate, e, Ks);
    e.memoizedProps = e.pendingProps, t === null ? yi(e) : ot = t;
  }
  function fh(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ro(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ft
        );
        break;
      case 11:
        t = Ro(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ft
        );
        break;
      case 5:
        Xc(t);
      default:
        Yo(l, t), t = ot = fd(t, Ks), t = Bo(l, t, Ks);
    }
    e.memoizedProps = e.pendingProps, t === null ? yi(e) : ot = t;
  }
  function xa(e, t, l, a) {
    Ls = Rl = null, Xc(t), ia = null, en = 0;
    var n = t.return;
    try {
      if (rx(
        e,
        n,
        t,
        l,
        ft
      )) {
        Dt = 1, hi(
          e,
          xs(l, e.current)
        ), ot = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw ot = n, i;
      Dt = 1, hi(
        e,
        xs(l, e.current)
      ), ot = null;
      return;
    }
    t.flags & 32768 ? (jt || a === 1 ? e = !0 : da || (ft & 536870912) !== 0 ? e = !1 : (ol = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = gs.current, a !== null && a.tag === 13 && (a.flags |= 16384))), mh(t, e)) : yi(t);
  }
  function yi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        mh(
          t,
          ol
        );
        return;
      }
      e = t.return;
      var l = dx(
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
    Dt === 0 && (Dt = 5);
  }
  function mh(e, t) {
    do {
      var l = ox(e.alternate, e);
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
    Dt = 6, ot = null;
  }
  function xh(e, t, l, a, n, i, c, o, g) {
    e.cancelPendingCommit = null;
    do
      _i();
    while ($t !== 0);
    if ((gt & 6) !== 0) throw Error(d(327));
    if (t !== null) {
      if (t === e.current) throw Error(d(177));
      if (i = t.lanes | t.childLanes, i |= gc, f(
        e,
        l,
        i,
        c,
        o,
        g
      ), e === kt && (ot = kt = null, ft = 0), ha = t, ml = e, fa = l, Sr = i, wr = n, nh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Nx(he, function() {
        return bh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = y.T, y.T = null, n = Y.p, Y.p = 2, c = gt, gt |= 4;
        try {
          hx(e, t, l);
        } finally {
          gt = c, Y.p = n, y.T = a;
        }
      }
      $t = 1, jh(), vh(), ph();
    }
  }
  function jh() {
    if ($t === 1) {
      $t = 0;
      var e = ml, t = ha, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = gt;
        gt |= 4;
        try {
          Io(t, e);
          var i = Yr, c = ld(e.containerInfo), o = i.focusedElem, g = i.selectionRange;
          if (c !== o && o && o.ownerDocument && sd(
            o.ownerDocument.documentElement,
            o
          )) {
            if (g !== null && mc(o)) {
              var T = g.start, J = g.end;
              if (J === void 0 && (J = T), "selectionStart" in o)
                o.selectionStart = T, o.selectionEnd = Math.min(
                  J,
                  o.value.length
                );
              else {
                var se = o.ownerDocument || document, A = se && se.defaultView || window;
                if (A.getSelection) {
                  var q = A.getSelection(), Ie = o.textContent.length, Je = Math.min(g.start, Ie), Nt = g.end === void 0 ? Je : Math.min(g.end, Ie);
                  !q.extend && Je > Nt && (c = Nt, Nt = Je, Je = c);
                  var C = td(
                    o,
                    Je
                  ), N = td(
                    o,
                    Nt
                  );
                  if (C && N && (q.rangeCount !== 1 || q.anchorNode !== C.node || q.anchorOffset !== C.offset || q.focusNode !== N.node || q.focusOffset !== N.offset)) {
                    var O = se.createRange();
                    O.setStart(C.node, C.offset), q.removeAllRanges(), Je > Nt ? (q.addRange(O), q.extend(N.node, N.offset)) : (O.setEnd(N.node, N.offset), q.addRange(O));
                  }
                }
              }
            }
            for (se = [], q = o; q = q.parentNode; )
              q.nodeType === 1 && se.push({
                element: q,
                left: q.scrollLeft,
                top: q.scrollTop
              });
            for (typeof o.focus == "function" && o.focus(), o = 0; o < se.length; o++) {
              var F = se[o];
              F.element.scrollLeft = F.left, F.element.scrollTop = F.top;
            }
          }
          Ui = !!Lr, Yr = Lr = null;
        } finally {
          gt = n, Y.p = a, y.T = l;
        }
      }
      e.current = t, $t = 2;
    }
  }
  function vh() {
    if ($t === 2) {
      $t = 0;
      var e = ml, t = ha, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = gt;
        gt |= 4;
        try {
          Ko(e, t.alternate, t);
        } finally {
          gt = n, Y.p = a, y.T = l;
        }
      }
      $t = 3;
    }
  }
  function ph() {
    if ($t === 4 || $t === 3) {
      $t = 0, Ne();
      var e = ml, t = ha, l = fa, a = nh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? $t = 5 : ($t = 0, ha = ml = null, gh(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (fl = null), qe(l), t = t.stateNode, ve && typeof ve.onCommitFiberRoot == "function")
        try {
          ve.onCommitFiberRoot(
            W,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = y.T, n = Y.p, Y.p = 2, y.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < a.length; c++) {
            var o = a[c];
            i(o.value, {
              componentStack: o.stack
            });
          }
        } finally {
          y.T = t, Y.p = n;
        }
      }
      (fa & 3) !== 0 && _i(), As(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === kr ? dn++ : (dn = 0, kr = e) : dn = 0, on(0);
    }
  }
  function gh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Qa(t)));
  }
  function _i(e) {
    return jh(), vh(), ph(), bh();
  }
  function bh() {
    if ($t !== 5) return !1;
    var e = ml, t = Sr;
    Sr = 0;
    var l = qe(fa), a = y.T, n = Y.p;
    try {
      Y.p = 32 > l ? 32 : l, y.T = null, l = wr, wr = null;
      var i = ml, c = fa;
      if ($t = 0, ha = ml = null, fa = 0, (gt & 6) !== 0) throw Error(d(331));
      var o = gt;
      if (gt |= 4, lh(i.current), eh(
        i,
        i.current,
        c,
        l
      ), gt = o, on(0, !1), ve && typeof ve.onPostCommitFiberRoot == "function")
        try {
          ve.onPostCommitFiberRoot(W, i);
        } catch {
        }
      return !0;
    } finally {
      Y.p = n, y.T = a, gh(e, t);
    }
  }
  function yh(e, t, l) {
    t = xs(l, t), t = ar(e.stateNode, t, 2), e = al(e, t, 2), e !== null && (ue(e, 2), As(e));
  }
  function wt(e, t, l) {
    if (e.tag === 3)
      yh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          yh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (fl === null || !fl.has(a))) {
            e = xs(l, e), l = wo(2), a = al(t, l, 2), a !== null && (ko(
              l,
              a,
              t,
              e
            ), ue(a, 2), As(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Tr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new xx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (br = !0, n.add(l), e = bx.bind(null, e, t, l), t.then(e, e));
  }
  function bx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, kt === e && (ft & l) === l && (Dt === 4 || Dt === 3 && (ft & 62914560) === ft && 300 > Le() - Nr ? (gt & 2) === 0 && ma(e, 0) : yr |= l, oa === ft && (oa = 0)), As(e);
  }
  function _h(e, t) {
    t === 0 && (t = z()), e = Wl(e, t), e !== null && (ue(e, t), As(e));
  }
  function yx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), _h(e, l);
  }
  function _x(e, t) {
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
    a !== null && a.delete(t), _h(e, l);
  }
  function Nx(e, t) {
    return Oe(e, t);
  }
  var Ni = null, ja = null, zr = !1, Si = !1, Ar = !1, Ll = 0;
  function As(e) {
    e !== ja && e.next === null && (ja === null ? Ni = ja = e : ja = ja.next = e), Si = !0, zr || (zr = !0, wx());
  }
  function on(e, t) {
    if (!Ar && Si) {
      Ar = !0;
      do
        for (var l = !1, a = Ni; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, o = a.pingedLanes;
              i = (1 << 31 - tt(42 | e) + 1) - 1, i &= n & ~(c & ~o), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, kh(a, i));
          } else
            i = ft, i = be(
              a,
              a === kt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || ge(a, i) || (l = !0, kh(a, i));
          a = a.next;
        }
      while (l);
      Ar = !1;
    }
  }
  function Sx() {
    Nh();
  }
  function Nh() {
    Si = zr = !1;
    var e = 0;
    Ll !== 0 && (Rx() && (e = Ll), Ll = 0);
    for (var t = Le(), l = null, a = Ni; a !== null; ) {
      var n = a.next, i = Sh(a, t);
      i === 0 ? (a.next = null, l === null ? Ni = n : l.next = n, n === null && (ja = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (Si = !0)), a = n;
    }
    on(e);
  }
  function Sh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - tt(i), o = 1 << c, g = n[c];
      g === -1 ? ((o & l) === 0 || (o & a) !== 0) && (n[c] = Qe(o, t)) : g <= t && (e.expiredLanes |= o), i &= ~o;
    }
    if (t = kt, l = ft, l = be(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (bt === 2 || bt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Te(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || ge(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Te(a), qe(l)) {
        case 2:
        case 8:
          l = Ze;
          break;
        case 32:
          l = he;
          break;
        case 268435456:
          l = Ue;
          break;
        default:
          l = he;
      }
      return a = wh.bind(null, e), l = Oe(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Te(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function wh(e, t) {
    if ($t !== 0 && $t !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (_i() && e.callbackNode !== l)
      return null;
    var a = ft;
    return a = be(
      e,
      e === kt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (ch(e, a, t), Sh(e, Le()), e.callbackNode != null && e.callbackNode === l ? wh.bind(null, e) : null);
  }
  function kh(e, t) {
    if (_i()) return null;
    ch(e, t, !0);
  }
  function wx() {
    Dx(function() {
      (gt & 6) !== 0 ? Oe(
        Fe,
        Sx
      ) : Nh();
    });
  }
  function Rr() {
    return Ll === 0 && (Ll = xt()), Ll;
  }
  function Ch(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Dn("" + e);
  }
  function Eh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function kx(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Ch(
        (n[St] || null).action
      ), c = a.submitter;
      c && (t = (t = c[St] || null) ? Ch(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var o = new Bn(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: o,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ll !== 0) {
                  var g = c ? Eh(n, c) : new FormData(n);
                  Pc(
                    l,
                    {
                      pending: !0,
                      data: g,
                      method: n.method,
                      action: i
                    },
                    null,
                    g
                  );
                }
              } else
                typeof i == "function" && (o.preventDefault(), g = c ? Eh(n, c) : new FormData(n), Pc(
                  l,
                  {
                    pending: !0,
                    data: g,
                    method: n.method,
                    action: i
                  },
                  i,
                  g
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Ur = 0; Ur < pc.length; Ur++) {
    var Dr = pc[Ur], Cx = Dr.toLowerCase(), Ex = Dr[0].toUpperCase() + Dr.slice(1);
    _s(
      Cx,
      "on" + Ex
    );
  }
  _s(id, "onAnimationEnd"), _s(cd, "onAnimationIteration"), _s(rd, "onAnimationStart"), _s("dblclick", "onDoubleClick"), _s("focusin", "onFocus"), _s("focusout", "onBlur"), _s(Zm, "onTransitionRun"), _s(Vm, "onTransitionStart"), _s(Jm, "onTransitionCancel"), _s(ud, "onTransitionEnd"), Ps("onMouseEnter", ["mouseout", "mouseover"]), Ps("onMouseLeave", ["mouseout", "mouseover"]), Ps("onPointerEnter", ["pointerout", "pointerover"]), Ps("onPointerLeave", ["pointerout", "pointerover"]), It(
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
  ), Ox = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hn)
  );
  function Oh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var o = a[c], g = o.instance, T = o.currentTarget;
            if (o = o.listener, g !== i && n.isPropagationStopped())
              break e;
            i = o, n.currentTarget = T;
            try {
              i(n);
            } catch (J) {
              oi(J);
            }
            n.currentTarget = null, i = g;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (o = a[c], g = o.instance, T = o.currentTarget, o = o.listener, g !== i && n.isPropagationStopped())
              break e;
            i = o, n.currentTarget = T;
            try {
              i(n);
            } catch (J) {
              oi(J);
            }
            n.currentTarget = null, i = g;
          }
      }
    }
  }
  function ht(e, t) {
    var l = t[we];
    l === void 0 && (l = t[we] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Th(t, e, 2, !1), l.add(a));
  }
  function Mr(e, t, l) {
    var a = 0;
    t && (a |= 4), Th(
      l,
      e,
      a,
      t
    );
  }
  var wi = "_reactListening" + Math.random().toString(36).slice(2);
  function qr(e) {
    if (!e[wi]) {
      e[wi] = !0, Ea.forEach(function(l) {
        l !== "selectionchange" && (Ox.has(l) || Mr(l, !1, e), Mr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[wi] || (t[wi] = !0, Mr("selectionchange", !1, t));
    }
  }
  function Th(e, t, l, a) {
    switch (ef(t)) {
      case 2:
        var n = sj;
        break;
      case 8:
        n = lj;
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
        var c = a.tag;
        if (c === 3 || c === 4) {
          var o = a.stateNode.containerInfo;
          if (o === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var g = c.tag;
              if ((g === 3 || g === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; o !== null; ) {
            if (c = at(o), c === null) return;
            if (g = c.tag, g === 5 || g === 6 || g === 26 || g === 27) {
              a = i = c;
              continue e;
            }
            o = o.parentNode;
          }
        }
        a = a.return;
      }
    Mu(function() {
      var T = i, J = lc(l), se = [];
      e: {
        var A = dd.get(e);
        if (A !== void 0) {
          var q = Bn, Ie = e;
          switch (e) {
            case "keypress":
              if (qn(l) === 0) break e;
            case "keydown":
            case "keyup":
              q = Nm;
              break;
            case "focusin":
              Ie = "focus", q = uc;
              break;
            case "focusout":
              Ie = "blur", q = uc;
              break;
            case "beforeblur":
            case "afterblur":
              q = uc;
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
              q = Bu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              q = om;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              q = km;
              break;
            case id:
            case cd:
            case rd:
              q = mm;
              break;
            case ud:
              q = Em;
              break;
            case "scroll":
            case "scrollend":
              q = um;
              break;
            case "wheel":
              q = Tm;
              break;
            case "copy":
            case "cut":
            case "paste":
              q = jm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              q = Yu;
              break;
            case "toggle":
            case "beforetoggle":
              q = Am;
          }
          var Je = (t & 4) !== 0, Nt = !Je && (e === "scroll" || e === "scrollend"), C = Je ? A !== null ? A + "Capture" : null : A;
          Je = [];
          for (var N = T, O; N !== null; ) {
            var F = N;
            if (O = F.stateNode, F = F.tag, F !== 5 && F !== 26 && F !== 27 || O === null || C === null || (F = Ta(N, C), F != null && Je.push(
              fn(N, F, O)
            )), Nt) break;
            N = N.return;
          }
          0 < Je.length && (A = new q(
            A,
            Ie,
            null,
            l,
            J
          ), se.push({ event: A, listeners: Je }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (A = e === "mouseover" || e === "pointerover", q = e === "mouseout" || e === "pointerout", A && l !== sc && (Ie = l.relatedTarget || l.fromElement) && (at(Ie) || Ie[b]))
            break e;
          if ((q || A) && (A = J.window === J ? J : (A = J.ownerDocument) ? A.defaultView || A.parentWindow : window, q ? (Ie = l.relatedTarget || l.toElement, q = T, Ie = Ie ? at(Ie) : null, Ie !== null && (Nt = B(Ie), Je = Ie.tag, Ie !== Nt || Je !== 5 && Je !== 27 && Je !== 6) && (Ie = null)) : (q = null, Ie = T), q !== Ie)) {
            if (Je = Bu, F = "onMouseLeave", C = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (Je = Yu, F = "onPointerLeave", C = "onPointerEnter", N = "pointer"), Nt = q == null ? A : Cs(q), O = Ie == null ? A : Cs(Ie), A = new Je(
              F,
              N + "leave",
              q,
              l,
              J
            ), A.target = Nt, A.relatedTarget = O, F = null, at(J) === T && (Je = new Je(
              C,
              N + "enter",
              Ie,
              l,
              J
            ), Je.target = O, Je.relatedTarget = Nt, F = Je), Nt = F, q && Ie)
              t: {
                for (Je = q, C = Ie, N = 0, O = Je; O; O = va(O))
                  N++;
                for (O = 0, F = C; F; F = va(F))
                  O++;
                for (; 0 < N - O; )
                  Je = va(Je), N--;
                for (; 0 < O - N; )
                  C = va(C), O--;
                for (; N--; ) {
                  if (Je === C || C !== null && Je === C.alternate)
                    break t;
                  Je = va(Je), C = va(C);
                }
                Je = null;
              }
            else Je = null;
            q !== null && zh(
              se,
              A,
              q,
              Je,
              !1
            ), Ie !== null && Nt !== null && zh(
              se,
              Nt,
              Ie,
              Je,
              !0
            );
          }
        }
        e: {
          if (A = T ? Cs(T) : window, q = A.nodeName && A.nodeName.toLowerCase(), q === "select" || q === "input" && A.type === "file")
            var Me = $u;
          else if (Ju(A))
            if (Wu)
              Me = Gm;
            else {
              Me = Lm;
              var ut = Bm;
            }
          else
            q = A.nodeName, !q || q.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? T && tc(T.elementType) && (Me = $u) : Me = Ym;
          if (Me && (Me = Me(e, T))) {
            Ku(
              se,
              Me,
              l,
              J
            );
            break e;
          }
          ut && ut(e, A, T), e === "focusout" && T && A.type === "number" && T.memoizedProps.value != null && ec(A, "number", A.value);
        }
        switch (ut = T ? Cs(T) : window, e) {
          case "focusin":
            (Ju(ut) || ut.contentEditable === "true") && (Jl = ut, xc = T, Ha = null);
            break;
          case "focusout":
            Ha = xc = Jl = null;
            break;
          case "mousedown":
            jc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            jc = !1, ad(se, l, J);
            break;
          case "selectionchange":
            if (Xm) break;
          case "keydown":
          case "keyup":
            ad(se, l, J);
        }
        var Ye;
        if (oc)
          e: {
            switch (e) {
              case "compositionstart":
                var $e = "onCompositionStart";
                break e;
              case "compositionend":
                $e = "onCompositionEnd";
                break e;
              case "compositionupdate":
                $e = "onCompositionUpdate";
                break e;
            }
            $e = void 0;
          }
        else
          Vl ? Zu(e, l) && ($e = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && ($e = "onCompositionStart");
        $e && (Gu && l.locale !== "ko" && (Vl || $e !== "onCompositionStart" ? $e === "onCompositionEnd" && Vl && (Ye = qu()) : (el = J, ic = "value" in el ? el.value : el.textContent, Vl = !0)), ut = ki(T, $e), 0 < ut.length && ($e = new Lu(
          $e,
          e,
          null,
          l,
          J
        ), se.push({ event: $e, listeners: ut }), Ye ? $e.data = Ye : (Ye = Vu(l), Ye !== null && ($e.data = Ye)))), (Ye = Um ? Dm(e, l) : Mm(e, l)) && ($e = ki(T, "onBeforeInput"), 0 < $e.length && (ut = new Lu(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), se.push({
          event: ut,
          listeners: $e
        }), ut.data = Ye)), kx(
          se,
          e,
          T,
          l,
          J
        );
      }
      Oh(se, t);
    });
  }
  function fn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function ki(e, t) {
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
  function zh(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var o = l, g = o.alternate, T = o.stateNode;
      if (o = o.tag, g !== null && g === a) break;
      o !== 5 && o !== 26 && o !== 27 || T === null || (g = T, n ? (T = Ta(l, i), T != null && c.unshift(
        fn(l, T, g)
      )) : n || (T = Ta(l, i), T != null && c.push(
        fn(l, T, g)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Tx = /\r\n?/g, zx = /\u0000|\uFFFD/g;
  function Ah(e) {
    return (typeof e == "string" ? e : "" + e).replace(Tx, `
`).replace(zx, "");
  }
  function Rh(e, t) {
    return t = Ah(t), Ah(e) === t;
  }
  function Ci() {
  }
  function _t(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ql(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ql(e, "" + a);
        break;
      case "className":
        An(e, "class", a);
        break;
      case "tabIndex":
        An(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        An(e, l, a);
        break;
      case "style":
        Uu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          An(e, "data", a);
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
        a = Dn("" + a), e.setAttribute(l, a);
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
          typeof i == "function" && (l === "formAction" ? (t !== "input" && _t(e, t, "name", n.name, n, null), _t(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), _t(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), _t(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (_t(e, t, "encType", n.encType, n, null), _t(e, t, "method", n.method, n, null), _t(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Dn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Ci);
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
        l = Dn("" + a), e.setAttributeNS(
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
        ht("beforetoggle", e), ht("toggle", e), zn(e, "popover", a);
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
        zn(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = cm.get(l) || l, zn(e, l, a));
    }
  }
  function Br(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Uu(e, a, i);
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
        a != null && ht("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ht("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Ci);
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
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[St] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : zn(e, l, a);
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
                  throw Error(d(137, t));
                default:
                  _t(e, t, i, c, l, null);
              }
          }
        n && _t(e, t, "srcSet", l.srcSet, l, null), a && _t(e, t, "src", l.src, l, null);
        return;
      case "input":
        ht("invalid", e);
        var o = i = c = n = null, g = null, T = null;
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
                  g = J;
                  break;
                case "defaultChecked":
                  T = J;
                  break;
                case "value":
                  i = J;
                  break;
                case "defaultValue":
                  o = J;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (J != null)
                    throw Error(d(137, t));
                  break;
                default:
                  _t(e, t, a, J, l, null);
              }
          }
        Tu(
          e,
          i,
          o,
          g,
          T,
          c,
          n,
          !1
        ), Rn(e);
        return;
      case "select":
        ht("invalid", e), a = c = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (o = l[n], o != null))
            switch (n) {
              case "value":
                i = o;
                break;
              case "defaultValue":
                c = o;
                break;
              case "multiple":
                a = o;
              default:
                _t(e, t, n, o, l, null);
            }
        t = i, l = c, e.multiple = !!a, t != null ? Gl(e, !!a, t, !1) : l != null && Gl(e, !!a, l, !0);
        return;
      case "textarea":
        ht("invalid", e), i = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (o = l[c], o != null))
            switch (c) {
              case "value":
                a = o;
                break;
              case "defaultValue":
                n = o;
                break;
              case "children":
                i = o;
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(d(91));
                break;
              default:
                _t(e, t, c, o, l, null);
            }
        Au(e, a, n, i), Rn(e);
        return;
      case "option":
        for (g in l)
          if (l.hasOwnProperty(g) && (a = l[g], a != null))
            switch (g) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                _t(e, t, g, a, l, null);
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
                throw Error(d(137, t));
              default:
                _t(e, t, T, a, l, null);
            }
        return;
      default:
        if (tc(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Br(
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
    for (o in l)
      l.hasOwnProperty(o) && (a = l[o], a != null && _t(e, t, o, a, l, null));
  }
  function Ax(e, t, l, a) {
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
        var n = null, i = null, c = null, o = null, g = null, T = null, J = null;
        for (q in l) {
          var se = l[q];
          if (l.hasOwnProperty(q) && se != null)
            switch (q) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                g = se;
              default:
                a.hasOwnProperty(q) || _t(e, t, q, null, a, se);
            }
        }
        for (var A in a) {
          var q = a[A];
          if (se = l[A], a.hasOwnProperty(A) && (q != null || se != null))
            switch (A) {
              case "type":
                i = q;
                break;
              case "name":
                n = q;
                break;
              case "checked":
                T = q;
                break;
              case "defaultChecked":
                J = q;
                break;
              case "value":
                c = q;
                break;
              case "defaultValue":
                o = q;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (q != null)
                  throw Error(d(137, t));
                break;
              default:
                q !== se && _t(
                  e,
                  t,
                  A,
                  q,
                  a,
                  se
                );
            }
        }
        Pi(
          e,
          c,
          o,
          g,
          T,
          J,
          i,
          n
        );
        return;
      case "select":
        q = c = o = A = null;
        for (i in l)
          if (g = l[i], l.hasOwnProperty(i) && g != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                q = g;
              default:
                a.hasOwnProperty(i) || _t(
                  e,
                  t,
                  i,
                  null,
                  a,
                  g
                );
            }
        for (n in a)
          if (i = a[n], g = l[n], a.hasOwnProperty(n) && (i != null || g != null))
            switch (n) {
              case "value":
                A = i;
                break;
              case "defaultValue":
                o = i;
                break;
              case "multiple":
                c = i;
              default:
                i !== g && _t(
                  e,
                  t,
                  n,
                  i,
                  a,
                  g
                );
            }
        t = o, l = c, a = q, A != null ? Gl(e, !!l, A, !1) : !!a != !!l && (t != null ? Gl(e, !!l, t, !0) : Gl(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        q = A = null;
        for (o in l)
          if (n = l[o], l.hasOwnProperty(o) && n != null && !a.hasOwnProperty(o))
            switch (o) {
              case "value":
                break;
              case "children":
                break;
              default:
                _t(e, t, o, null, a, n);
            }
        for (c in a)
          if (n = a[c], i = l[c], a.hasOwnProperty(c) && (n != null || i != null))
            switch (c) {
              case "value":
                A = n;
                break;
              case "defaultValue":
                q = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(d(91));
                break;
              default:
                n !== i && _t(e, t, c, n, a, i);
            }
        zu(e, A, q);
        return;
      case "option":
        for (var Ie in l)
          if (A = l[Ie], l.hasOwnProperty(Ie) && A != null && !a.hasOwnProperty(Ie))
            switch (Ie) {
              case "selected":
                e.selected = !1;
                break;
              default:
                _t(
                  e,
                  t,
                  Ie,
                  null,
                  a,
                  A
                );
            }
        for (g in a)
          if (A = a[g], q = l[g], a.hasOwnProperty(g) && A !== q && (A != null || q != null))
            switch (g) {
              case "selected":
                e.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                _t(
                  e,
                  t,
                  g,
                  A,
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
        for (var Je in l)
          A = l[Je], l.hasOwnProperty(Je) && A != null && !a.hasOwnProperty(Je) && _t(e, t, Je, null, a, A);
        for (T in a)
          if (A = a[T], q = l[T], a.hasOwnProperty(T) && A !== q && (A != null || q != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(d(137, t));
                break;
              default:
                _t(
                  e,
                  t,
                  T,
                  A,
                  a,
                  q
                );
            }
        return;
      default:
        if (tc(t)) {
          for (var Nt in l)
            A = l[Nt], l.hasOwnProperty(Nt) && A !== void 0 && !a.hasOwnProperty(Nt) && Br(
              e,
              t,
              Nt,
              void 0,
              a,
              A
            );
          for (J in a)
            A = a[J], q = l[J], !a.hasOwnProperty(J) || A === q || A === void 0 && q === void 0 || Br(
              e,
              t,
              J,
              A,
              a,
              q
            );
          return;
        }
    }
    for (var C in l)
      A = l[C], l.hasOwnProperty(C) && A != null && !a.hasOwnProperty(C) && _t(e, t, C, null, a, A);
    for (se in a)
      A = a[se], q = l[se], !a.hasOwnProperty(se) || A === q || A == null && q == null || _t(e, t, se, A, a, q);
  }
  var Lr = null, Yr = null;
  function Ei(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Uh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Dh(e, t) {
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
  var Qr = null;
  function Rx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Qr ? !1 : (Qr = e, !0) : (Qr = null, !1);
  }
  var Mh = typeof setTimeout == "function" ? setTimeout : void 0, Ux = typeof clearTimeout == "function" ? clearTimeout : void 0, qh = typeof Promise == "function" ? Promise : void 0, Dx = typeof queueMicrotask == "function" ? queueMicrotask : typeof qh < "u" ? function(e) {
    return qh.resolve(null).then(e).catch(Mx);
  } : Mh;
  function Mx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function jl(e) {
    return e === "head";
  }
  function Hh(e, t) {
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
                var o = c.nextSibling, g = c.nodeName;
                c[ze] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = o;
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
  function Xr(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Xr(l), Ae(l);
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
  function qx(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[ze])
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
  function Hx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ss(e.nextSibling), e === null)) return null;
    return e;
  }
  function Zr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Bx(e, t) {
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
  function Bh(e) {
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
  function Lh(e, t, l) {
    switch (t = Ei(l), e) {
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
    Ae(e);
  }
  var ys = /* @__PURE__ */ new Map(), Yh = /* @__PURE__ */ new Set();
  function Oi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var $s = Y.d;
  Y.d = {
    f: Lx,
    r: Yx,
    D: Gx,
    C: Qx,
    L: Xx,
    m: Zx,
    X: Jx,
    S: Vx,
    M: Kx
  };
  function Lx() {
    var e = $s.f(), t = bi();
    return e || t;
  }
  function Yx(e) {
    var t = Xt(e);
    t !== null && t.tag === 5 && t.type === "form" ? io(t) : $s.r(e);
  }
  var pa = typeof document > "u" ? null : document;
  function Gh(e, t, l) {
    var a = pa;
    if (a && typeof t == "string" && t) {
      var n = ms(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Yh.has(n) || (Yh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), Wt(t, "link", e), qt(t), a.head.appendChild(t)));
    }
  }
  function Gx(e) {
    $s.D(e), Gh("dns-prefetch", e, null);
  }
  function Qx(e, t) {
    $s.C(e, t), Gh("preconnect", e, t);
  }
  function Xx(e, t, l) {
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
      ys.has(i) || (e = U(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), ys.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(xn(i)) || t === "script" && a.querySelector(jn(i)) || (t = a.createElement("link"), Wt(t, "link", e), qt(t), a.head.appendChild(t)));
    }
  }
  function Zx(e, t) {
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
      if (!ys.has(i) && (e = U({ rel: "modulepreload", href: e }, t), ys.set(i, e), l.querySelector(n) === null)) {
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
        a = l.createElement("link"), Wt(a, "link", e), qt(a), l.head.appendChild(a);
      }
    }
  }
  function Vx(e, t, l) {
    $s.S(e, t, l);
    var a = pa;
    if (a && e) {
      var n = Us(a).hoistableStyles, i = ga(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var o = { loading: 0, preload: null };
        if (c = a.querySelector(
          xn(i)
        ))
          o.loading = 5;
        else {
          e = U(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = ys.get(i)) && Jr(e, l);
          var g = c = a.createElement("link");
          qt(g), Wt(g, "link", e), g._p = new Promise(function(T, J) {
            g.onload = T, g.onerror = J;
          }), g.addEventListener("load", function() {
            o.loading |= 1;
          }), g.addEventListener("error", function() {
            o.loading |= 2;
          }), o.loading |= 4, Ti(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: o
        }, n.set(i, c);
      }
    }
  }
  function Jx(e, t) {
    $s.X(e, t);
    var l = pa;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ba(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = U({ src: e, async: !0 }, t), (t = ys.get(n)) && Kr(e, t), i = l.createElement("script"), qt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Kx(e, t) {
    $s.M(e, t);
    var l = pa;
    if (l && e) {
      var a = Us(l).hoistableScripts, n = ba(e), i = a.get(n);
      i || (i = l.querySelector(jn(n)), i || (e = U({ src: e, async: !0, type: "module" }, t), (t = ys.get(n)) && Kr(e, t), i = l.createElement("script"), qt(i), Wt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Qh(e, t, l, a) {
    var n = (n = P.current) ? Oi(n) : null;
    if (!n) throw Error(d(446));
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
          }, ys.set(e, l), i || $x(
            n,
            e,
            l,
            c.state
          ))), t && a === null)
            throw Error(d(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(d(529, ""));
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
        throw Error(d(444, e));
    }
  }
  function ga(e) {
    return 'href="' + ms(e) + '"';
  }
  function xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Xh(e) {
    return U({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function $x(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Wt(t, "link", l), qt(t), e.head.appendChild(t));
  }
  function ba(e) {
    return '[src="' + ms(e) + '"]';
  }
  function jn(e) {
    return "script[async]" + e;
  }
  function Zh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + ms(l.href) + '"]'
          );
          if (a)
            return t.instance = a, qt(a), a;
          var n = U({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), qt(a), Wt(a, "style", n), Ti(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = ga(l.href);
          var i = e.querySelector(
            xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, qt(i), i;
          a = Xh(l), (n = ys.get(n)) && Jr(a, n), i = (e.ownerDocument || e).createElement("link"), qt(i);
          var c = i;
          return c._p = new Promise(function(o, g) {
            c.onload = o, c.onerror = g;
          }), Wt(i, "link", a), t.state.loading |= 4, Ti(i, l.precedence, e), t.instance = i;
        case "script":
          return i = ba(l.src), (n = e.querySelector(
            jn(i)
          )) ? (t.instance = n, qt(n), n) : (a = l, (n = ys.get(i)) && (a = U({}, l), Kr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), qt(n), Wt(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(d(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Ti(a, l.precedence, e));
    return t.instance;
  }
  function Ti(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var o = a[c];
      if (o.dataset.precedence === t) i = o;
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
  var zi = null;
  function Vh(e, t, l) {
    if (zi === null) {
      var a = /* @__PURE__ */ new Map(), n = zi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = zi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[ze] || i[rt] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var o = a.get(c);
        o ? o.push(i) : a.set(c, [i]);
      }
    }
    return a;
  }
  function Jh(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Wx(e, t, l) {
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
  function Kh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var vn = null;
  function Fx() {
  }
  function Ix(e, t, l) {
    if (vn === null) throw Error(d(475));
    var a = vn;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = ga(l.href), i = e.querySelector(
          xn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Ai.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, qt(i);
          return;
        }
        i = e.ownerDocument || e, l = Xh(l), (n = ys.get(n)) && Jr(l, n), i = i.createElement("link"), qt(i);
        var c = i;
        c._p = new Promise(function(o, g) {
          c.onload = o, c.onerror = g;
        }), Wt(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Ai.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function Px() {
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
  function Ai() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) $r(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ri = null;
  function $r(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ri = /* @__PURE__ */ new Map(), t.forEach(ej, e), Ri = null, Ai.call(e));
  }
  function ej(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Ri.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Ri.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = Ai.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var pn = {
    $$typeof: I,
    Provider: null,
    Consumer: null,
    _currentValue: ee,
    _currentValue2: ee,
    _threadCount: 0
  };
  function tj(e, t, l, a, n, i, c, o) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = v(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = v(0), this.hiddenUpdates = v(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function $h(e, t, l, a, n, i, c, o, g, T, J, se) {
    return e = new tj(
      e,
      t,
      l,
      c,
      o,
      g,
      T,
      se
    ), t = 1, i === !0 && (t |= 24), i = cs(3, null, null, t), e.current = i, i.stateNode = e, t = Tc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Uc(i), e;
  }
  function Wh(e) {
    return e ? (e = Fl, e) : Fl;
  }
  function Fh(e, t, l, a, n, i) {
    n = Wh(n), a.context === null ? a.context = n : a.pendingContext = n, a = ll(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = al(e, a, t), l !== null && (hs(l, e, t), Ja(l, e, t));
  }
  function Ih(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Wr(e, t) {
    Ih(e, t), (e = e.alternate) && Ih(e, t);
  }
  function Ph(e) {
    if (e.tag === 13) {
      var t = Wl(e, 67108864);
      t !== null && hs(t, e, 67108864), Wr(e, 67108864);
    }
  }
  var Ui = !0;
  function sj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Y.p;
    try {
      Y.p = 2, Fr(e, t, l, a);
    } finally {
      Y.p = i, y.T = n;
    }
  }
  function lj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Y.p;
    try {
      Y.p = 8, Fr(e, t, l, a);
    } finally {
      Y.p = i, y.T = n;
    }
  }
  function Fr(e, t, l, a) {
    if (Ui) {
      var n = Ir(a);
      if (n === null)
        Hr(
          e,
          t,
          a,
          Di,
          l
        ), tf(e, a);
      else if (nj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (tf(e, a), t & 4 && -1 < aj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Xt(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = _(i.pendingLanes);
                  if (c !== 0) {
                    var o = i;
                    for (o.pendingLanes |= 2, o.entangledLanes |= 2; c; ) {
                      var g = 1 << 31 - tt(c);
                      o.entanglements[1] |= g, c &= ~g;
                    }
                    As(i), (gt & 6) === 0 && (pi = Le() + 500, on(0));
                  }
                }
                break;
              case 13:
                o = Wl(i, 2), o !== null && hs(o, i, 2), bi(), Wr(i, 2);
            }
          if (i = Ir(a), i === null && Hr(
            e,
            t,
            a,
            Di,
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
  var Di = null;
  function Pr(e) {
    if (Di = null, e = at(e), e !== null) {
      var t = B(e);
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
    return Di = e, null;
  }
  function ef(e) {
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
        switch (We()) {
          case Fe:
            return 2;
          case Ze:
            return 8;
          case he:
          case et:
            return 32;
          case Ue:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var eu = !1, vl = null, pl = null, gl = null, gn = /* @__PURE__ */ new Map(), bn = /* @__PURE__ */ new Map(), bl = [], aj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function tf(e, t) {
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
    }, t !== null && (t = Xt(t), t !== null && Ph(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function nj(e, t, l, a, n) {
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
  function sf(e) {
    var t = at(e.target);
    if (t !== null) {
      var l = B(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Rt(e.priority, function() {
              if (l.tag === 13) {
                var a = os();
                a = ce(a);
                var n = Wl(l, a);
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
  function Mi(e) {
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
        return t = Xt(l), t !== null && Ph(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function lf(e, t, l) {
    Mi(e) && l.delete(t);
  }
  function ij() {
    eu = !1, vl !== null && Mi(vl) && (vl = null), pl !== null && Mi(pl) && (pl = null), gl !== null && Mi(gl) && (gl = null), gn.forEach(lf), bn.forEach(lf);
  }
  function qi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, eu || (eu = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      ij
    )));
  }
  var Hi = null;
  function af(e) {
    Hi !== e && (Hi = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Hi === e && (Hi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Pr(a || l) === null)
              continue;
            break;
          }
          var i = Xt(l);
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
    function t(g) {
      return qi(g, e);
    }
    vl !== null && qi(vl, e), pl !== null && qi(pl, e), gl !== null && qi(gl, e), gn.forEach(t), bn.forEach(t);
    for (var l = 0; l < bl.length; l++) {
      var a = bl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < bl.length && (l = bl[0], l.blockedOn === null); )
      sf(l), l.blockedOn === null && bl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[St] || null;
        if (typeof i == "function")
          c || af(l);
        else if (c) {
          var o = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[St] || null)
              o = c.formAction;
            else if (Pr(n) !== null) continue;
          } else o = c.action;
          typeof o == "function" ? l[a + 1] = o : (l.splice(a, 3), a -= 3), af(l);
        }
      }
  }
  function tu(e) {
    this._internalRoot = e;
  }
  Bi.prototype.render = tu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(d(409));
    var l = t.current, a = os();
    Fh(l, a, e, t, null, null);
  }, Bi.prototype.unmount = tu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Fh(e.current, 2, null, e, null, null), bi(), t[b] = null;
    }
  };
  function Bi(e) {
    this._internalRoot = e;
  }
  Bi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = vt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < bl.length && t !== 0 && t < bl[l].priority; l++) ;
      bl.splice(l, 0, e), l === 0 && sf(e);
    }
  };
  var nf = h.version;
  if (nf !== "19.1.0")
    throw Error(
      d(
        527,
        nf,
        "19.1.0"
      )
    );
  Y.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(d(188)) : (e = Object.keys(e).join(","), Error(d(268, e)));
    return e = Q(t), e = e !== null ? p(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var cj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: y,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Li = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Li.isDisabled && Li.supportsFiber)
      try {
        W = Li.inject(
          cj
        ), ve = Li;
      } catch {
      }
  }
  return Sn.createRoot = function(e, t) {
    if (!R(e)) throw Error(d(299));
    var l = !1, a = "", n = yo, i = _o, c = No, o = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (o = t.unstable_transitionCallbacks)), t = $h(
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
      o,
      null
    ), e[b] = t.current, qr(e), new tu(t);
  }, Sn.hydrateRoot = function(e, t, l) {
    if (!R(e)) throw Error(d(299));
    var a = !1, n = "", i = yo, c = _o, o = No, g = null, T = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (o = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (g = l.unstable_transitionCallbacks), l.formState !== void 0 && (T = l.formState)), t = $h(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      i,
      c,
      o,
      g,
      T
    ), t.context = Wh(null), l = t.current, a = os(), a = ce(a), n = ll(a), n.callback = null, al(l, n, a), l = a, t.current.lanes = l, ue(t, l), As(t), e[b] = t.current, qr(e), new Bi(t);
  }, Sn.version = "19.1.0", Sn;
}
var jf;
function vj() {
  if (jf) return lu.exports;
  jf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), lu.exports = jj(), lu.exports;
}
var pj = vj(), r = _u();
const ru = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function gj({ api: u, projects: h }) {
  var Ke;
  const [S, d] = r.useState(((Ke = h[0]) == null ? void 0 : Ke.id) || ""), [R, B] = r.useState([]), [V, M] = r.useState("general_inspection"), [Q, p] = r.useState("现场质量安全检查"), [U, K] = r.useState("general,通用施工检查"), [k, le] = r.useState(ru.map((X) => X[0])), [xe, _e] = r.useState(!1), [ye, Ee] = r.useState(!1), [me, I] = r.useState(""), [oe, ne] = r.useState(""), [D, je] = r.useState(0), Re = h.find((X) => X.id === S), Be = Re != null && Re.permissions ? Re.permissions.includes("knowledge.process") : Re == null ? void 0 : Re.can_run, Xe = Re != null && Re.permissions ? Re.permissions.includes("knowledge.review") : Re == null ? void 0 : Re.can_manage;
  r.useEffect(() => {
    let X = !1;
    return B([]), I(""), S && u(`/scenes?project_id=${encodeURIComponent(S)}`).then((de) => {
      X || B(de.items);
    }).catch((de) => {
      X || I(de.message);
    }), () => {
      X = !0;
    };
  }, [S, D]);
  const Ge = async (X) => {
    Ee(!0), I(""), ne("");
    try {
      await X(), je((de) => de + 1);
    } catch (de) {
      I(de.message);
    } finally {
      Ee(!1);
    }
  }, pe = (X) => {
    M(X.code), p(X.payload.name), K(X.payload.categories.map((de) => de.code + "," + de.name).join(`
`)), le(X.payload.steps.map((de) => de.event_type)), _e(X.payload.compare_deadline);
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
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: S, onChange: (X) => d(X.target.value), children: h.map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
      ] }),
      Be && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: V, onChange: (X) => M(X.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: Q, onChange: (X) => p(X.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: U, onChange: (X) => K(X.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          ru.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(X[0]), onChange: (de) => le((y) => de.target.checked ? [...y, X[0]] : y.filter((Y) => Y !== X[0])) }),
            X[1]
          ] }, X[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: xe, onChange: (X) => _e(X.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ye || !S || !k.length, onClick: () => void Ge(async () => {
          const X = R.filter((y) => y.code === V).sort((y, Y) => Y.version - y.version)[0], de = U.split(`
`).filter((y) => y.trim()).map((y) => {
            const [Y, ee] = y.split(/[,，]/);
            if (!(Y != null && Y.trim()) || !(ee != null && ee.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const ke = X == null ? void 0 : X.payload.categories.find((m) => m.code === Y.trim());
            return { code: Y.trim(), name: ee.trim(), focus: (ke == null ? void 0 : ke.focus) || "", keywords: (ke == null ? void 0 : ke.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: S, code: V, expected_version: (X == null ? void 0 : X.version) || 0, payload: { name: Q, categories: de, steps: ru.filter((y) => k.includes(y[0])).map((y) => ({ event_type: y[0], name: y[1], scope: y[2] })), compare_deadline: xe } }) }), ne("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      R.map((X) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
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
        Be && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => pe(X), children: "以此版本编辑" }),
        Xe && !X.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ye, onClick: () => void Ge(async () => {
          var de;
          await u(`/scenes/${X.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((de = R.find((y) => y.code === X.code && y.active)) == null ? void 0 : de.id) || null }) }), ne("场景版本已启用。");
        }), children: "启用此版本" }),
        Be && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ye, onClick: () => void Ge(async () => {
          var y;
          const de = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(S)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: S, expected_version: ((y = de.items[0]) == null ? void 0 : y.version) || 0, categories: X.payload.categories }) }), ne("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, X.id))
    ] })
  ] });
}
const uu = {}, Nu = window.location.pathname.startsWith("/quality/b/"), ka = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), vf = uu == null ? void 0 : uu.VITE_B_PLATFORM_MODE, Tt = ka || Nu && (vf === "true" || vf !== "false" && !0);
function Yi() {
  if (!Nu && !ka) return window.location.pathname;
  const u = ka ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function bj(u) {
  ka ? window.history.pushState({}, "", "/quality/#/b" + u) : Nu ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), ka && window.dispatchEvent(new Event("platform-route"));
}
async function Mt(u, h = {}) {
  if (!Tt) return fetch(u, h);
  if (!u.startsWith("/api/v1/") && !u.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const S = new Headers(h.headers);
  S.delete("Authorization");
  const d = window.QaxcProjectId;
  ka && d && S.set("X-Project-ID", d);
  const R = (h.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(R)) {
    const V = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (V.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !V.ok) throw new Error(V.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const M = await V.json(), Q = M.csrf_token ?? M.token;
    if (typeof Q != "string" || !Q) throw new Error("安全校验返回格式不正确。");
    S.set("X-CSRF-Token", Q);
  }
  const B = await fetch("/quality/b" + u, { ...h, headers: S, credentials: "same-origin" });
  return B.status === 401 && window.dispatchEvent(new Event("b-session-expired")), B;
}
const pf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, gf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, pu = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), yj = (u) => ({
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
  clauses: [pu()]
}), ya = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function du(u, h) {
  var S;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((S = u == null ? void 0 : u.roles) != null && S.includes("reviewer"));
}
function _j({ api: u, projects: h, identity: S }) {
  var he, et, Ue;
  const [d, R] = r.useState(((he = h[0]) == null ? void 0 : he.id) || ""), [B, V] = r.useState([]), [M, Q] = r.useState(null), [p, U] = r.useState(null), [K, k] = r.useState(!1), [le, xe] = r.useState(!1), [_e, ye] = r.useState(!1), [Ee, me] = r.useState(""), [I, oe] = r.useState(""), [ne, D] = r.useState(""), [je, Re] = r.useState(null), [Be, Xe] = r.useState(0), [Ge, pe] = r.useState(""), [Ke, X] = r.useState(!1), [de, y] = r.useState(""), [Y, ee] = r.useState("current_rectification"), [ke, m] = r.useState(""), [H, te] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [$, ae] = r.useState(null), Z = r.useRef(crypto.randomUUID()), P = r.useRef(0), Ce = h.find((E) => E.id === d), ie = du(Ce, "knowledge.process"), Se = du(Ce, "knowledge.review"), st = du(Ce, "knowledge.publish"), lt = ie || Se || st;
  r.useEffect(() => {
    const E = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [K]), r.useEffect(() => {
    let E = !1;
    if (ye(!0), me(""), V([]), Re(null), !d) {
      ye(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(d)}&view=${lt ? "manage" : "published"}${ne ? "&cursor=" + encodeURIComponent(ne) : ""}`).then((w) => {
      E || (V(w.items), Re(w.next_cursor));
    }).catch((w) => {
      E || me(w.message);
    }).finally(() => {
      E || ye(!1);
    }), () => {
      E = !0;
    };
  }, [d, lt, ne, Be]), r.useEffect(() => () => {
    P.current++;
  }, []);
  const Pe = async (E) => {
    xe(!0), me(""), oe("");
    try {
      await E();
    } catch (w) {
      me(w.message);
    } finally {
      xe(!1);
    }
  }, Oe = () => {
    var E;
    k(!1), (E = window.QaxcClearPendingEdits) == null || E.call(window);
  }, Te = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), De = (E) => {
    U((w) => w && { ...w, ...E }), k(!0), Z.current = crypto.randomUUID();
  }, Ne = (E, w) => {
    p && De({ clauses: p.clauses.map((W, ve) => ve === E ? { ...W, ...w } : W) });
  }, Le = async (E) => {
    if (!Te()) return;
    const w = ++P.current;
    await Pe(async () => {
      const W = await u("/standards/" + E.id);
      w === P.current && (Q(W), U(null), Oe(), ae(null), pe(""), X(!1));
    });
  }, We = () => {
    if (!M || !Te()) return;
    const { id: E, version: w, row_version: W, state: ve, source_available: He, verified_on: tt, history: dt, clauses: L, ...fe } = M;
    U({
      project_id: fe.project_id,
      code: fe.code,
      edition: fe.edition,
      title: fe.title,
      source_asset_id: fe.source_asset_id,
      valid_from: fe.valid_from,
      valid_until: fe.valid_until,
      scope: fe.scope,
      maintainer: fe.maintainer,
      expected_version: w,
      reason: "修订说明待填写",
      clauses: (L || []).map((re) => Object.fromEntries(Object.keys(pu()).map((Ve) => [Ve, re[Ve]])))
    }), y("沿用已绑定原件；原文变化时请重新上传"), k(!0), Z.current = crypto.randomUUID();
  }, Fe = (E) => void Pe(async () => {
    if (!M) return;
    const w = await u(`/standards/${M.id}/actions`, { method: "POST", body: JSON.stringify({ action: E, row_version: M.row_version, reason: Ge, evidence_checked: Ke }) });
    Q({ ...M, ...w }), Oe(), Xe((W) => W + 1), oe(gf[E] + "成功。"), pe(""), X(!1), M.source_available !== !1 && Q(await u("/standards/" + M.id));
  }), Ze = () => void Pe(async () => {
    if (!M) return;
    const E = await Mt(`/api/v1/standards/${M.id}/source`, { headers: { Authorization: `Bearer dev-${S}` } });
    if (!E.ok) {
      const He = await E.json();
      throw new Error(He.message || "原件不可用。");
    }
    const w = await E.blob(), W = URL.createObjectURL(w), ve = document.createElement("a");
    ve.href = W, ve.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), ve.click(), setTimeout(() => URL.revokeObjectURL(W), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Ee && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Ee,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le, onClick: () => Xe((E) => E + 1), children: "刷新列表" })
    ] }),
    I && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: I }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: le, value: d, onChange: (E) => {
          Te() && (P.current++, R(E.target.value), Q(null), U(null), k(!1), D(""), ae(null));
        }, children: h.map((E) => /* @__PURE__ */ s.jsx("option", { value: E.id, children: E.name }, E.id)) })
      ] }),
      ie && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !d, onClick: () => {
        Te() && (U(yj(d)), Q(null), y(""), k(!1), Z.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || _e, onClick: () => Xe((E) => E + 1), children: "刷新" })
    ] }),
    !d && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    _e ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !B.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        lt ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      B.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: E.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            E.code,
            " · ",
            E.edition,
            " · 修订 ",
            E.version,
            " · ",
            pf[E.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            E.valid_from,
            "；",
            E.valid_until ? "自 " + E.valid_until + " 起不再适用" : "未登记废止日期",
            E.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le, onClick: () => void Le(E), children: "查看与核验" }),
        st && E.source_available === !1 && ["published", "approved", "superseded"].includes(E.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le, onClick: () => {
          Q(E), U(null), X(!1), pe("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, E.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ne || le, onClick: () => D(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !je || le, onClick: () => D(je || ""), children: "下一页" })
      ] })
    ] }) }),
    p && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (E) => {
      E.preventDefault(), Pe(async () => {
        if (!p.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...p, scope: Object.fromEntries(Object.entries(p.scope).map(([ve, He]) => [ve, ya(He.join(`
`))])), clauses: p.clauses.map((ve) => ({
          ...ve,
          preconditions: ya(ve.preconditions.join(`
`)),
          exceptions: ya(ve.exceptions.join(`
`)),
          tables: ya(ve.tables.join(`
`)),
          notes: ya(ve.notes.join(`
`)),
          references: ya(ve.references.join(`
`))
        })) }, W = await u("/standards", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify(w) });
        Oe(), U(null), Q(await u("/standards/" + W.id)), Xe((ve) => ve + 1), oe("规范草稿已保存，需核验后发布。");
      });
    }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h3", { children: p.expected_version ? "修订规范" : "登记规范" }),
        /* @__PURE__ */ s.jsx("span", { children: "原件和已保存版本保留不变" })
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { className: "proof-body", disabled: le, children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范名称",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: p.title, onChange: (E) => De({ title: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: p.code, readOnly: p.expected_version > 0, onChange: (E) => De({ code: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: p.edition, readOnly: p.expected_version > 0, onChange: (E) => De({ edition: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: p.maintainer, onChange: (E) => De({ maintainer: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: p.valid_from, onChange: (E) => De({ valid_from: E.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: p.valid_until || "", onChange: (E) => De({ valid_until: E.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (E) => {
            var W;
            const w = (W = E.target.files) == null ? void 0 : W[0];
            w && Pe(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const ve = await u(`/standards/source-files?project_id=${encodeURIComponent(d)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              De({ source_asset_id: ve.asset_id }), y(w.name), oe("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: de || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: p.scope[E].join(`
`), onChange: (W) => De({ scope: { ...p.scope, [E]: W.target.value.split(`
`) } }) })
          ] }, E)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        p.clauses.map((E, w) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            w + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: E.number, onChange: (W) => Ne(w, { number: W.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: E.chapter, onChange: (W) => Ne(w, { chapter: W.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: E.parent_number || "", onChange: (W) => Ne(w, { parent_number: W.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: E.page || "", onChange: (W) => Ne(w, { page: W.target.value ? Number(W.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: E.locator, onChange: (W) => Ne(w, { locator: W.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: E.text, onChange: (W) => Ne(w, { text: W.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([W, ve]) => /* @__PURE__ */ s.jsxs("label", { children: [
              ve,
              /* @__PURE__ */ s.jsx("textarea", { value: E[W].join(`
`), onChange: (He) => Ne(w, { [W]: He.target.value.split(`
`) }) })
            ] }, W))
          ] }),
          p.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => De({ clauses: p.clauses.filter((W, ve) => ve !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: p.clauses.length >= 200, onClick: () => De({ clauses: [...p.clauses, pu()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: p.reason, onChange: (E) => De({ reason: E.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !p.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Te() && (U(null), k(!1));
        }, children: "取消编辑" })
      ] })
    ] }),
    M && !p && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { children: M.title }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          M.code,
          " · ",
          M.edition,
          " · 修订 ",
          M.version,
          " · ",
          pf[M.state]
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
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le || M.source_available === !1, onClick: Ze, children: "下载核对原件" }),
          ie && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || !M.clauses, onClick: We, children: "以此版本修订" })
        ] }),
        (et = M.clauses) == null ? void 0 : et.map((E) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
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
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, W]) => E[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: W }),
            E[w].map((ve, He) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: ve }, He))
          ] }, w))
        ] }, E.number)),
        M.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Y, onChange: (E) => {
              ee(E.target.value), ae(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Y === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: ke, onChange: (E) => {
              m(E.target.value), ae(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([E, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: H[E], onChange: (W) => {
              te({ ...H, [E]: W.target.value }), ae(null);
            } })
          ] }, E)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le, onClick: () => void Pe(async () => {
            ae(await u(`/standards/${M.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Y, event_date: ke || null, ...H }) }));
          }), children: "核对条件" }),
          $ && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[$.status] }),
            $.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              $.missing.map((E) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[E] || E).join("、")
            ] }),
            $.reasons.map((E) => /* @__PURE__ */ s.jsx("p", { children: E }, E)),
            /* @__PURE__ */ s.jsx("p", { children: $.note })
          ] })
        ] }),
        lt && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: le, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Ge, maxLength: 2e3, onChange: (E) => pe(E.target.value) })
          ] }),
          M.state === "pending_review" && Se && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ke, onChange: (E) => X(E.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            M.state === "draft" && ie && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ge.trim(), onClick: () => Fe("submit"), children: "提交审核" }),
            M.state === "pending_review" && Se && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ge.trim() || !Ke, onClick: () => Fe("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Ge.trim(), onClick: () => Fe("request_changes"), children: "退回修改" })
            ] }),
            M.state === "approved" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Ge.trim(), onClick: () => Fe("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(M.state) && st && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Ge.trim(), onClick: () => Fe("withdraw"), children: "撤回此版本" })
          ] }),
          M.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (Ue = M.history) == null ? void 0 : Ue.map((E, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            gf[E.action] || E.action,
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
const Ca = { kind: "asset", id: "", quote: "", locator: "" }, Qf = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ca] }, Xf = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Zf = { text: "", nature: "fact", evidence: [Ca] }, Vf = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ca] }, Nj = { name: "", value: null, evidence: [Ca] }, bf = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [Xf] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Qf] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Zf], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [Vf], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ca, kind: "work" }], historical_case_ids: [] }
}, Sj = { evidence: Ca, records: Qf, categories: Xf, claims: Zf, steps: Vf, parameters: Nj }, Na = {
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
}, wj = { status: [["unverified", "待核实"], ["open", "未整改"], ["rectifying", "整改中"], ["closed", "复查闭环"]], relation: [["independent", "独立事件"], ["recurrence", "同对象再次发生"], ["possible_duplicate", "疑似重复（不自动合并）"]], mode: [["single", "单案例"], ["category", "类别汇编"], ["project", "项目汇编"]], type: [["single", "单选"], ["multiple", "多选"], ["judgment", "判断"], ["case", "案例分析"]], cognitive_level: [["recall", "识记"], ["sequence", "操作顺序"], ["scenario", "情境判断"], ["case", "案例分析"]], difficulty: [["easy", "容易"], ["medium", "中等"], ["hard", "困难"]] };
function Ki({ value: u, onChange: h, catalog: S, name: d = "", path: R = "content", readonly: B = !1 }) {
  var p;
  const V = Na[d] || d;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((U, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(Ki, { value: U, name: d.endsWith("_ids") ? d.slice(0, -1) : "", path: R + "." + K, catalog: S, readonly: B, onChange: (k) => h(u.map((le, xe) => xe === K ? k : le)) }),
      !B && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, le) => K !== le)), children: "移除" })
    ] }, K)),
    !B && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(Sj[d] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([U, K]) => U === "kind" && R === "content" ? null : /* @__PURE__ */ s.jsx(Ki, { name: U, value: K, path: R + "." + U, catalog: S, readonly: B, onChange: (k) => {
    const le = { ...u, [U]: k };
    U === "type" && ["judgment", "case"].includes(String(k)) && (le.options = {}), U === "kind" && "id" in u && (le.id = ""), h(le);
  } }, U)) });
  let M = wj[d];
  d === "kind" && (M = R.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), d === "nature" && (M = R.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const Q = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (d === "id" || d in Q || d === "historical_case_id") && (M = S.filter((U) => d in Q ? U.work_kind === Q[d] : d === "historical_case_id" ? ["hazard", "compilation"].includes(U.work_kind || "") : !0).map((U) => [U.id, U.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: R, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    B ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((p = M == null ? void 0 : M.find((U) => U[0] === String(u))) == null ? void 0 : p[1]) || String(u ?? "待填") }) : M ? /* @__PURE__ */ s.jsxs("select", { id: R, value: String(u ?? ""), onChange: (U) => h(U.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      M.map(([U, K]) => /* @__PURE__ */ s.jsx("option", { value: U, children: K }, U))
    ] }) : d === "date" || d === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: R, type: "date", value: String(u ?? ""), onChange: (U) => h(U.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: R, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(d) ? 3 : 2, value: String(u ?? ""), onChange: (U) => h(U.target.value === "" && ["parent", "value", "related_event_id"].includes(d) ? null : U.target.value) })
  ] });
}
const yf = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, _f = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function kj({ api: u, projects: h, identity: S }) {
  var E;
  const [d, R] = r.useState(((E = h[0]) == null ? void 0 : E.id) || ""), [B, V] = r.useState("hazard"), [M, Q] = r.useState([]), [p, U] = r.useState([]), [K, k] = r.useState(null), [le, xe] = r.useState(null), [_e, ye] = r.useState(""), [Ee, me] = r.useState(!1), [I, oe] = r.useState(""), [ne, D] = r.useState(""), [je, Re] = r.useState(!1), [Be, Xe] = r.useState(!1), [Ge, pe] = r.useState(0), [Ke, X] = r.useState(null), [de, y] = r.useState(""), [Y, ee] = r.useState(null), [ke, m] = r.useState(null), [H, te] = r.useState(null), [$, ae] = r.useState(null), Z = r.useRef(crypto.randomUUID()), P = r.useRef(0), Ce = r.useRef(!1), ie = h.find((w) => w.id === d), Se = (w) => {
    var W, ve;
    return ie != null && ie.permissions ? ie.permissions.includes(w) : w.startsWith("training.") ? !!((W = ie == null ? void 0 : ie.roles) != null && W.some((He) => ["admin", "teacher"].includes(He))) : w === "knowledge.process" ? !!(ie != null && ie.can_run) : !!(ie != null && ie.can_manage) || !!((ve = ie == null ? void 0 : ie.roles) != null && ve.includes("reviewer"));
  }, st = Se(B === "question" ? "training.manage" : "knowledge.process"), lt = Se(B === "question" ? "training.review" : "knowledge.review"), Pe = Se(B === "question" ? "training.review" : "knowledge.publish"), Oe = st || lt || Pe, Te = () => {
    var w;
    Ce.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, De = () => !Ce.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (W) => {
      Ce.current && (W.preventDefault(), W.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Xe(!0), Q([]), oe(""), !d) {
      Xe(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(d)}&kind=${B}&view=${Oe ? "manage" : "published"}${de ? "&cursor=" + encodeURIComponent(de) : ""}`).then((W) => {
      w || (Q(W.items), X(W.next_cursor));
    }).catch((W) => {
      w || oe(W.message);
    }).finally(() => {
      w || Xe(!1);
    }), Oe && u(`/workflows/catalog?project_id=${encodeURIComponent(d)}`).then((W) => {
      w || U(W.items);
    }).catch((W) => {
      w || oe(W.message);
    }), B === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(d)}`).then((W) => {
      w || ee(W);
    }).catch((W) => {
      w || oe(W.message);
    }), () => {
      w = !0;
    };
  }, [d, B, de, Oe, Ge]), r.useEffect(() => () => {
    P.current++;
  }, []);
  const Ne = async (w) => {
    Re(!0), oe(""), D("");
    try {
      await w();
    } catch (W) {
      oe(W.message);
    } finally {
      Re(!1);
    }
  }, Le = () => {
    P.current++, k(null), xe(null), m(null), te(null), ae(null), y(""), ye(""), me(!1), Te();
  }, We = async (w) => {
    if (!De()) return;
    const W = ++P.current;
    await Ne(async () => {
      const ve = await u("/workflows/" + w.id);
      W === P.current && (k(ve), xe(null), ye(""), me(!1), te(null), ae(null), Te());
    });
  }, Fe = (w) => {
    xe((W) => W && { ...W, ...w }), Ce.current = !0, Z.current = crypto.randomUUID();
  }, Ze = () => Ne(async () => {
    if (!le) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify({ ...le, project_id: d, reason: _e }) });
    k(w), xe(null), Te(), pe((W) => W + 1), D("已保存新版本，尚未审核发布。");
  }), he = (w, W) => Ne(async () => {
    const ve = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: W, row_version: w.row_version, reason: _e, evidence_checked: Ee }) });
    k(W === "withdraw" ? null : await u("/workflows/" + ve.id)), pe((He) => He + 1), Te(), D(_f[W] + "已完成");
  }), et = (w) => Ne(async () => {
    const W = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(d)}&category=${encodeURIComponent(w)}&limit=100`);
    m(W.items);
  }), Ue = () => Ne(async () => {
    if (!K) return;
    const w = await Mt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + S } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const W = URL.createObjectURL(await w.blob()), ve = document.createElement("a");
    ve.href = W, ve.download = K.title + ".docx", ve.click(), setTimeout(() => URL.revokeObjectURL(W), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: d, disabled: je, onChange: (w) => {
          De() && (Le(), R(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => pe((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(bf).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: je, className: "button " + (B === w ? "primary" : "ghost"), onClick: () => {
      De() && (Le(), V(w));
    }, children: Na[w] }, w)) }),
    I && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: I }),
    ne && /* @__PURE__ */ s.jsx("p", { role: "status", children: ne }),
    B === "hazard" && Y && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
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
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Y.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: je, onClick: () => et(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      ke && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        ke.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => We(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Na[B],
          "清单"
        ] }),
        st && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: je, onClick: () => {
          De() && (Le(), xe({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(bf[B]) }), Ce.current = !0, Z.current = crypto.randomUUID());
        }, children: [
          "新建",
          Na[B]
        ] })
      ] }),
      Be ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : M.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Na[B],
        "。",
        st ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: M.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: je || w.source_available === !1, onClick: () => We(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          yf[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        Pe && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !_e.trim(), onClick: () => he(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        de && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(""), children: "首页" }),
        Ke && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(Ke), children: "下一页" })
      ] })
    ] }),
    le && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Na[B],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: je, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: le.title, onChange: (w) => Fe({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(Ki, { value: le.content, catalog: p, onChange: (w) => Fe({ content: w }) })
      ] })
    ] }),
    K && !le && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        yf[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        st && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => {
          xe({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), Ce.current = !0, Z.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: Ue, children: "导出Word" }),
        Se("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ne(async () => {
          te((await u(`/workflows/impacts?project_id=${encodeURIComponent(d)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        B === "guide" && K.state === "published" && Se("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ne(async () => ae(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        B === "question" && K.state === "published" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je, onClick: () => Ne(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), D("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      H && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        H.length ? H.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      $ && /* @__PURE__ */ s.jsx("ul", { children: $.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(Ki, { value: K.content, catalog: p, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((w, W) => /* @__PURE__ */ s.jsxs("p", { children: [
          _f[w.action] || w.action,
          "：",
          w.reason
        ] }, W))
      ] })
    ] }),
    Oe && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: _e, onChange: (w) => ye(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      le ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !_e.trim() || !le.title.trim(), onClick: Ze, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee, onChange: (w) => me(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && st && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !_e.trim(), onClick: () => he(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && lt && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !Ee || !_e.trim(), onClick: () => he(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !_e.trim(), onClick: () => he(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && Pe && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !_e.trim(), onClick: () => he(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && Pe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !_e.trim(), onClick: () => he(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const Nf = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Cj({ id: u, identity: h, projects: S, navigate: d }) {
  const [R, B] = r.useState(null), [V, M] = r.useState(""), [Q, p] = r.useState(!1), [U, K] = r.useState(""), [k, le] = r.useState(0), xe = `a-import-action:${h}:${u}`;
  async function _e(me, I) {
    const oe = await Mt("/integration/v1/a-imports/" + u + me, I), ne = await oe.json().catch(() => ({}));
    if (!oe.ok)
      throw oe.status >= 400 && oe.status < 500 && sessionStorage.removeItem(xe), new Error(ne.message || `请求未完成（${oe.status}），请刷新查看最新状态。`);
    return ne;
  }
  r.useEffect(() => {
    let me = !1;
    async function I() {
      try {
        const ne = await _e("");
        me || (B(ne), M(""));
      } catch (ne) {
        me || (B(null), M(ne.message));
      }
    }
    B(null), I();
    const oe = window.setInterval(I, 3e3);
    return () => {
      me = !0, clearInterval(oe);
    };
  }, [u, k, h]);
  const ye = (me) => {
    var I, oe;
    return !!R && !!((oe = (I = S.find((ne) => ne.id === R.project_id)) == null ? void 0 : I.permissions) != null && oe.includes(me));
  };
  async function Ee(me) {
    if (!(!R || Q)) {
      p(!0), M("");
      try {
        const I = sessionStorage.getItem(xe), oe = I ? JSON.parse(I) : { operation: me, key: crypto.randomUUID(), body: { expected_version: R.version, ...me === "withdraw" ? { reason: U.trim() } : {} } };
        if (oe.operation !== me) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(xe, JSON.stringify(oe)), await _e("/" + me, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": oe.key }, body: JSON.stringify(oe.body) }), sessionStorage.removeItem(xe), le((ne) => ne + 1);
      } catch (I) {
        M(I.message);
      } finally {
        p(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => le((me) => me + 1), disabled: Q, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      V && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: V }),
      R ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ s.jsxs("dd", { children: [
              "v",
              R.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Nf[R.status] || R.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: Nf[R.retrospective_status] || R.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          R.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        R.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: R.error.message }),
        R.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: R.warnings.map((me, I) => /* @__PURE__ */ s.jsx("li", { children: me.message }, me.code + ":" + I)) })
        ] }),
        R.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          R.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          R.capabilities.can_view_materials && R.receipt_id && ye("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => d("/task-packages/" + R.receipt_id), children: "查看原始资料" }),
          R.capabilities.can_generate_retrospective && ye("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Q, onClick: () => void Ee("retrospectives"), children: R.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          R.retrospective_id && R.status !== "withdrawn" && ye("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => d("/retrospectives/" + R.retrospective_id), children: "查看复盘" }),
          (R.status === "failed" || R.retrospective_status === "failed") && ye("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Q, onClick: () => void Ee("retry"), children: "重试失败任务" })
        ] }),
        R.status !== "withdrawn" && ye("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: U, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (me) => K(me.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Q || !U.trim(), onClick: () => void Ee("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Ej({ navigate: u }) {
  const [h, S] = r.useState([]), [d, R] = r.useState(""), [B, V] = r.useState(!1);
  return r.useEffect(() => {
    let M = !1;
    return (async () => {
      try {
        const [Q, p, U] = await Promise.all([Mt("/api/v1/health"), Mt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!Q.ok || !p.ok || !U.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, le] = await Promise.all([Q.json(), p.json(), U.json()]), xe = window.QaxcProjectId, _e = le.tasks.filter((ye) => !xe || ye.projectId === xe).flatMap((ye) => (ye.events || []).map((Ee) => ({ id: Ee.id, action: ye.title + " · " + Ee.action, project_id: ye.projectId, created_at: Ee.uploadedAt, source: "现场作业" })));
        M || (V(K.worker_online), S([..._e, ...k.items.map((ye) => ({ ...ye, source: "知识与学习" }))].sort((ye, Ee) => Date.parse(Ee.created_at) - Date.parse(ye.created_at)).slice(0, 100)));
      } catch (Q) {
        M || R(Q.message);
      }
    })(), () => {
      M = !0;
    };
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ s.jsxs("p", { role: "status", children: [
      "后台处理：",
      B ? "在线" : "未连接或正在读取",
      "。成果接入、知识发布与资料处理共用后台任务队列。"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", style: { margin: "20px 0", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => u("/jobs"), children: "处理任务与重试" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => u("/settings/models"), children: "模型配置" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => u("/task-packages"), children: "成果与证据" })
    ] }),
    d ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: d }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("h3", { children: "最近操作" }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。" }),
      h.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "业务" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: h.map((M) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(M.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: M.source }),
          /* @__PURE__ */ s.jsx("td", { children: M.action })
        ] }, M.source + M.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function Oj({ deliveryId: u, navigate: h }) {
  const [S, d] = r.useState(!1), [R, B] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function M(p, U, K) {
    const k = await Mt("/api/v1" + p, { method: U ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: U ? JSON.stringify(U) : void 0 }), le = await k.json();
    if (!k.ok) throw Error(le.message || "处理失败，请重试");
    return le;
  }
  async function Q() {
    if (S) return;
    d(!0);
    const p = "archive-review:" + u, U = sessionStorage.getItem(p) || crypto.randomUUID();
    sessionStorage.setItem(p, U);
    try {
      B("正在核验归档成果…");
      const K = await M("/platform-archives", { delivery_id: u }, U);
      for (let k = 0; k < 60 && V.current; k++) {
        const le = await M("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (le.status === "ready") {
          B("证据已校验，正在生成复盘…");
          const xe = await M("/retrospectives", { mode: "task_process", task_package_id: le.id });
          V.current && h("/retrospectives/" + xe.id);
          return;
        }
        if (["failed", "withdrawn"].includes(le.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        B("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((xe) => setTimeout(xe, 1e3));
      }
      V.current && B("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      V.current && B(K.message);
    } finally {
      V.current && d(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: R }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: S, onClick: () => void Q(), children: "生成 / 打开复盘" }),
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
const Tj = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), zj = (u) => u.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (h, S, d) => d ? d.toUpperCase() : S.toLowerCase()
), Sf = (u) => {
  const h = zj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, Jf = (...u) => u.filter((h, S, d) => !!h && h.trim() !== "" && d.indexOf(h) === S).join(" ").trim(), Aj = (u) => {
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
var Rj = {
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
const Uj = r.forwardRef(
  ({
    color: u = "currentColor",
    size: h = 24,
    strokeWidth: S = 2,
    absoluteStrokeWidth: d,
    className: R = "",
    children: B,
    iconNode: V,
    ...M
  }, Q) => r.createElement(
    "svg",
    {
      ref: Q,
      ...Rj,
      width: h,
      height: h,
      stroke: u,
      strokeWidth: d ? Number(S) * 24 / Number(h) : S,
      className: Jf("lucide", R),
      ...!B && !Aj(M) && { "aria-hidden": "true" },
      ...M
    },
    [
      ...V.map(([p, U]) => r.createElement(p, U)),
      ...Array.isArray(B) ? B : [B]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ct = (u, h) => {
  const S = r.forwardRef(
    ({ className: d, ...R }, B) => r.createElement(Uj, {
      ref: B,
      iconNode: h,
      className: Jf(
        `lucide-${Tj(Sf(u))}`,
        `lucide-${u}`,
        d
      ),
      ...R
    })
  );
  return S.displayName = Sf(u), S;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dj = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], wf = Ct("activity", Dj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], kf = Ct("arrow-left", Mj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], _l = Ct("arrow-right", qj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hj = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
], $i = Ct("book-open", Hj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Ws = Ct("chevron-right", Bj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Nl = Ct("circle-alert", Lj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Sl = Ct("circle-check", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
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
], Qj = Ct("clipboard-list", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
], ou = Ct("database", Xj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Cf = Ct("download", Zj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vj = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
], Jj = Ct("external-link", Vj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
], En = Ct("file-check-2", Kj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $j = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
], Ef = Ct("file-input", $j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
], hu = Ct("file-search", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
], Gi = Ct("folder-lock", Fj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ij = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], Pj = Ct("history", Ij);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
], Of = Ct("layout-dashboard", ev);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Tf = Ct("loader-circle", tv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], zf = Ct("play", sv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lv = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], av = Ct("plus", lv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Rs = Ct("refresh-cw", nv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iv = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], cv = Ct("search", iv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rv = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Af = Ct("shield-check", rv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uv = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], Kf = Ct("upload", uv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dv = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
], ov = Ct("users", dv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Zi = Ct("x", hv), ws = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, wn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Rf = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Uf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], S = (d) => h.includes(d) ? h.indexOf(d) : 100;
  return Object.entries(u).sort(([d], [R]) => S(d) - S(R));
}, fu = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function fv({ asset: u, identity: h }) {
  const [S, d] = r.useState(""), [R, B] = r.useState("");
  return r.useEffect(() => {
    let V = !1, M = "";
    return Mt(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (Q) => {
      if (!Q.ok) throw new Error("图片不可访问或已撤回");
      return Q.blob();
    }).then((Q) => {
      M = URL.createObjectURL(Q), V ? URL.revokeObjectURL(M) : d(M);
    }).catch((Q) => {
      V || B(Q.message);
    }), () => {
      V = !0, M && URL.revokeObjectURL(M);
    };
  }, [u, h]), R ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: R }) : S ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: S, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function mv({ api: u, path: h, navigate: S, projects: d, identity: R }) {
  var rt, St;
  const [B, V] = r.useState([]), [M, Q] = r.useState([]), [p, U] = r.useState([]), [K, k] = r.useState([]), [le, xe] = r.useState("reports"), _e = r.useRef(0), [ye, Ee] = r.useState(""), [me, I] = r.useState([]), [oe, ne] = r.useState(null), [D, je] = r.useState(""), [Re, Be] = r.useState(!1), [Xe, Ge] = r.useState([]), [pe, Ke] = r.useState({}), [X, de] = r.useState(0), [y, Y] = r.useState(null), [ee, ke] = r.useState(null), [m, H] = r.useState(null), [te, $] = r.useState(new URLSearchParams(location.search).get("source") || ""), [ae, Z] = r.useState(""), [P, Ce] = r.useState(!1), [ie, Se] = r.useState(""), [st, lt] = r.useState(""), [Pe, Oe] = r.useState(!0), [Te, De] = r.useState(!1), [Ne, Le] = r.useState(0), [We, Fe] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [Ze, he] = r.useState(""), [et, Ue] = r.useState(null), [E, w] = r.useState([]), [W, ve] = r.useState(""), [He, tt] = r.useState(0), [dt, L] = r.useState(!1), [fe, re] = r.useState("csv"), [Ve, _] = r.useState(""), [be, ge] = r.useState(""), [Qe, xt] = r.useState(((rt = d.find((b) => b.can_run)) == null ? void 0 : rt.id) || (Tt ? "" : "demo-airport")), z = d.some((b) => b.can_run), v = h.startsWith("/records/"), ue = h.startsWith("/imports/") && h !== "/imports/new", f = B.find((b) => b.id === te), G = M.filter((b) => b.kind === (f == null ? void 0 : f.kind) && b.project_id === (f == null ? void 0 : f.project_id));
  r.useEffect(() => {
    he(""), w([]), ve(""), tt(0), Se(""), lt(""), H(null);
  }, [h]), r.useEffect(() => {
    let b = !1;
    Oe(!0), Se(""), ke(null), Y(null);
    const we = new URLSearchParams(Object.entries(We).filter(([, pt]) => !!pt));
    we.set("limit", "15"), Ze && we.set("cursor", Ze);
    async function nt() {
      try {
        const [pt, j] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (b) return;
        if (V(pt.items), Q(j.items), h === "/sources" || h === "/imports") {
          const ze = await u("/imports?limit=15" + (Ze ? "&cursor=" + encodeURIComponent(Ze) : ""));
          if (b) return;
          U(ze.items), Ue(ze.next_cursor);
        } else if (ue) {
          const ze = await u(`${h}?after_row=${He}&only_issues=${dt}`);
          b || Y(ze);
        } else if (v) {
          const ze = await u(h + (W ? "?version=" + W : ""));
          b || ke(ze);
        } else if (h === "/records") {
          const ze = await u("/records?" + we);
          if (b) return;
          if (Ge(ze.items), Ue(ze.next_cursor), Ke(ze.totals_by_kind), de(ze.detail_groups_after_confirmed_links), le === "reports") {
            const Ae = new URLSearchParams(we);
            Ae.delete("cursor"), Ze && Ae.set("after_id", Ze);
            const at = await u("/reports?" + Ae);
            if (b) return;
            k(at.items), Ue(at.next_cursor);
          }
        }
      } catch (pt) {
        b || Se(pt.message);
      } finally {
        b || Oe(!1);
      }
    }
    return nt(), () => {
      b = !0;
    };
  }, [h, We, Ze, W, Ne, He, dt, le]), r.useEffect(() => {
    if (!ue || !y || !["queued", "running"].includes(y.status)) return;
    let b = !1;
    const we = setInterval(() => {
      u(`${h}?after_row=${He}&only_issues=${dt}`).then((nt) => {
        b || Y(nt);
      }).catch((nt) => {
        b || Se(nt.message);
      });
    }, 1500);
    return () => {
      b = !0, clearInterval(we);
    };
  }, [h, y == null ? void 0 : y.status, He, dt]), r.useEffect(() => {
    _e.current++, Ee(""), I([]), ne(null), je("");
  }, [We, le, h]);
  const x = async (b, we = !1) => {
    const nt = ++_e.current;
    if (!we && ye === b) {
      Ee(""), Be(!1);
      return;
    }
    we || (I([]), ne(null)), Ee(b), Be(!0), je("");
    const pt = new URLSearchParams(Object.entries(We).filter(([, j]) => !!j));
    pt.set("document_id", b), pt.set("limit", "15"), we && oe && pt.set("cursor", oe);
    try {
      const j = await u("/records?" + pt);
      if (nt !== _e.current) return;
      I((ze) => we ? [...ze, ...j.items] : j.items), ne(j.next_cursor);
    } catch (j) {
      nt === _e.current && je(j.message);
    } finally {
      nt === _e.current && Be(!1);
    }
  }, ce = async (b) => {
    De(!0), Se(""), lt("");
    try {
      await b();
    } catch (we) {
      Se(we.message);
    } finally {
      De(!1);
    }
  }, qe = () => ce(async () => {
    for (const b of d.filter((we) => we.can_run))
      for (const we of b.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const nt = `mock-${b.id}-${we}`;
        B.some((pt) => pt.namespace === nt && pt.project_id === b.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${b.id === "demo-airport" ? "机场" : "地铁"} · ${ws[we]}（模拟）`, namespace: nt, kind: we, project_id: b.id, mapping_template: we === "governance_export" ? "governance-v1" : `${we}-v1` }) });
      }
    lt("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), Le((b) => b + 1);
  }), vt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !E.length, onClick: () => {
        he(E.at(-1) || ""), w(E.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !et, onClick: () => {
        w([...E, Ze]), he(et || "");
      }, children: "下一页" })
    ] })
  ] }), Rt = (b, we) => {
    Fe({ ...We, [b]: we }), he(""), w([]);
  }, Et = (b) => ce(async () => {
    const we = await Mt(`/api/v1/assets/${b}/content`, { headers: { Authorization: `Bearer dev-${R}` } });
    if (!we.ok) {
      const j = await we.json();
      throw new Error(j.message);
    }
    const nt = URL.createObjectURL(await we.blob()), pt = document.createElement("a");
    pt.href = nt, pt.download = "来源文件", pt.click(), URL.revokeObjectURL(nt);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(ou, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Tt ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    ie && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      ie,
      /* @__PURE__ */ s.jsx("button", { onClick: () => Le((b) => b + 1), children: "重新加载" })
    ] }),
    st && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      st
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => S("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => S("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => S("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => Le((b) => b + 1), disabled: Pe, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Pe ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Tt && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Te || !z, onClick: () => void qe(), children: [
          /* @__PURE__ */ s.jsx(ou, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: B.map((b) => {
        var we, nt;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(ou, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: ws[b.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: b.name }),
          /* @__PURE__ */ s.jsx("p", { children: (we = d.find((pt) => pt.id === b.project_id)) == null ? void 0 : we.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: b.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Rf(b.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: b.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((nt = d.find((pt) => pt.id === b.project_id)) != null && nt.can_run), onClick: () => {
            $(b.id), Z(""), S("/imports/new?source=" + b.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] })
        ] }, b.id);
      }) }),
      !B.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(hu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      z && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Tt || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Ve, onChange: (b) => _(b.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: be, onChange: (b) => ge(b.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: fe, onChange: (b) => re(b.target.value), children: ["csv", "excel", "governance_export"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: ws[b] }, b)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Qe, onChange: (b) => xt(b.target.value), children: d.filter((b) => b.can_run).map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Te || !Ve || !be, onClick: () => void ce(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Ve, namespace: be, kind: fe, project_id: Qe, mapping_template: fe === "governance_export" ? "governance-v1" : `${fe}-v1` }) }), Le((b) => b + 1), lt("来源已创建。");
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: te, onChange: (b) => {
                $(b.target.value), Z(""), H(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                B.filter((b) => {
                  var we;
                  return (we = d.find((nt) => nt.id === b.project_id)) == null ? void 0 : we.can_run;
                }).map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ae, onChange: (b) => {
                Z(b.target.value), H(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                G.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.asset_id, children: b.label }, b.asset_id))
              ] })
            ] })
          ] }),
          !Tt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: P, onChange: (b) => Ce(b.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Tt && f && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Te, accept: f.kind === "csv" ? ".csv" : f.kind === "excel" ? ".xlsx" : ".json", onChange: (b) => {
                var nt;
                const we = (nt = b.target.files) == null ? void 0 : nt[0];
                b.target.value = "", we && ce(async () => {
                  if (we.size > 5e6) throw new Error("文件不能超过5MB");
                  const pt = new Uint8Array(await we.arrayBuffer());
                  let j = "";
                  for (let Ae = 0; Ae < pt.length; Ae += 8192) j += String.fromCharCode(...pt.subarray(Ae, Ae + 8192));
                  const ze = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: f.project_id, kind: f.kind, name: we.name, base64: btoa(j) }) });
                  Q((Ae) => [...Ae, ze]), Z(ze.asset_id), H(null), lt("文件已上传，请预览字段与异常后提交接入。");
                });
              } })
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "项目ID：",
              f.project_id,
              "。文件必须保留稳定记录ID、报告ID和项目ID；记录类型为detail、review或summary。"
            ] }),
            /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsx("summary", { children: "查看所需表头" }),
              /* @__PURE__ */ s.jsx("p", { children: Object.values(f.mapping).join("、") })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Te || !te || !ae, onClick: () => void ce(async () => {
            H(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: te, input_asset_id: ae }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(hu, { size: 16 }),
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
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(m.mapping).map(([b, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: we }),
            /* @__PURE__ */ s.jsx(_l, { size: 13 }),
            /* @__PURE__ */ s.jsx("strong", { children: b })
          ] }, b)) })
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
            /* @__PURE__ */ s.jsx("tbody", { children: m.preview.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                b.row_number,
                /* @__PURE__ */ s.jsx("small", { children: b.external_id || "缺少身份" })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: fu(b.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: ws[String(b.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...b.errors, ...b.issues].join("；") || "通过" })
            ] }, b.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Te, onClick: () => void ce(async () => {
              const b = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: te, input_asset_id: ae, input_hash: m.input_hash, fail_after: !Tt && P ? 2 : null }) });
              S("/imports/" + b.id);
            }), children: [
              /* @__PURE__ */ s.jsx(Kf, { size: 16 }),
              Te ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !z, onClick: () => S("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(_l, { size: 15 })
        ] })
      ] }),
      p.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "来源 / 时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "状态" }),
          /* @__PURE__ */ s.jsx("th", { children: "新增" }),
          /* @__PURE__ */ s.jsx("th", { children: "更新" }),
          /* @__PURE__ */ s.jsx("th", { children: "跳过" }),
          /* @__PURE__ */ s.jsx("th", { children: "失败" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: p.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: b.source_name }),
            /* @__PURE__ */ s.jsx("small", { children: Rf(b.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: wn[b.status] }),
          ["created", "updated", "skipped", "failed"].map((we) => /* @__PURE__ */ s.jsx("td", { children: b.counts[we] }, we)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/imports/" + b.id), children: "查看历史项目" }) })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      vt
    ] }) : ue && y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => S("/imports"), children: [
        /* @__PURE__ */ s.jsx(kf, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: wn[y.status] }),
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
        y.job_status === "failed" && ((St = d.find((b) => b.id === y.source.project_id)) == null ? void 0 : St.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Te, onClick: () => void ce(async () => {
          await u(`/jobs/${y.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: y.row_version }) }), Le((b) => b + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      y.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: y.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((b) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: b === "failed" ? "失败行" : wn[b] }),
        /* @__PURE__ */ s.jsx("strong", { children: y.counts[b] })
      ] }, b)) }),
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
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(y.counts.kinds || {}).map(([b, we]) => `${ws[b]} ${we}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: dt, onChange: (b) => {
              L(b.target.checked), tt(0);
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
          /* @__PURE__ */ s.jsx("tbody", { children: y.rows.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: b.row_number }),
            /* @__PURE__ */ s.jsx("td", { children: b.outcome === "failed" ? "失败" : wn[b.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: b.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: b.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + b.record_id), children: "查看证据" }) })
          ] }, b.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !He, onClick: () => tt(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !y.next_row, onClick: () => tt(y.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((b) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            ws[b],
            "记录"
          ] }),
          /* @__PURE__ */ s.jsx("strong", { children: pe[b] || 0 })
        ] }, b)),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: We.project_id, onChange: (b) => Rt("project_id", b.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              d.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: We.source_id, onChange: (b) => Rt("source_id", b.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              B.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: We.record_kind, onChange: (b) => Rt("record_kind", b.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: ws[b] }, b))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: We.quality_status, onChange: (b) => Rt("quality_status", b.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: We.from_date, onChange: (b) => Rt("from_date", b.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: We.to_date, onChange: (b) => Rt("to_date", b.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": le === "reports", onClick: () => {
            xe("reports"), he(""), w([]), Ee("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": le === "rows", onClick: () => {
            xe("rows"), he(""), w([]);
          }, children: "逐条数据" })
        ] }),
        le === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": ye === b.id, onClick: () => void x(b.id), children: [
            /* @__PURE__ */ s.jsx(hu, { size: 20 }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: b.title }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                b.source_name,
                " · ",
                b.report_id
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              b.count,
              " 条风险数据"
            ] }),
            /* @__PURE__ */ s.jsx(_l, { size: 16 })
          ] }),
          ye === b.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            D && /* @__PURE__ */ s.jsx("p", { role: "alert", children: D }),
            Re ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : me.map((we) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + we.id), children: we.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                ws[we.record_kind],
                " · v",
                we.current_version
              ] })
            ] }, we.id)),
            oe && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Re, onClick: () => void x(b.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, b.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
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
          /* @__PURE__ */ s.jsx("tbody", { children: Xe.map((b) => {
            var we;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + b.id), children: b.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (we = B.find((nt) => nt.id === b.source_id)) == null ? void 0 : we.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: ws[b.record_kind] }),
              /* @__PURE__ */ s.jsx("td", { children: b.occurred_on || "未知" }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: `status ${b.quality_status === "valid" ? "succeeded" : "retrying"}`, children: b.quality_status === "valid" ? "通过" : "需核查" }) }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                "v",
                b.current_version
              ] })
            ] }, b.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的记录" }),
          /* @__PURE__ */ s.jsx("p", { children: "调整筛选条件，或先完成一批资料接入。" })
        ] }),
        vt
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。" })
    ] }) : v && ee ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => S("/records"), children: [
        /* @__PURE__ */ s.jsx(kf, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            ws[ee.record_kind],
            " · ",
            Tt ? "来源记录" : "模拟记录"
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: ee.description || "缺少描述" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            ee.source.name,
            " · ",
            ee.external_record_id
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "查看版本",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: ee.selected_version, onChange: (b) => ve(b.target.value), children: ee.versions.map((b) => /* @__PURE__ */ s.jsxs("option", { value: b.version, children: [
            "v",
            b.version,
            b.version === ee.current_version ? " · 当前" : ""
          ] }, b.version)) })
        ] })
      ] }),
      ee.issues.length > 0 && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: ee.issues.join("；") }),
      /* @__PURE__ */ s.jsxs("div", { className: "record-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源原始字段" }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Object.keys(ee.raw_fields).length,
              "个字段 · 完整保留"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Uf(ee.raw_fields).map(([b, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: b }),
            /* @__PURE__ */ s.jsx("dd", { children: fu(we) })
          ] }, b)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Uf(ee.effective_fields).map(([b, we]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: b }),
            /* @__PURE__ */ s.jsx("dd", { children: fu(we) })
          ] }, b)) }),
          /* @__PURE__ */ s.jsxs("details", { className: "provenance", children: [
            /* @__PURE__ */ s.jsx("summary", { children: "来源定位 / 人工修订 / 内容版本" }),
            /* @__PURE__ */ s.jsx("pre", { children: JSON.stringify(ee.provenance, null, 2) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "report-note", children: [
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "原报告：",
              ee.document.report_id
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: ee.document.note })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel evidence-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "证据与图片关系" }),
          /* @__PURE__ */ s.jsx("span", { children: "确定锚点与候选关联分别标识" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "evidence-grid", children: ee.evidence.map((b) => {
          var we;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: ws[b.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: b.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(b.locator) }),
            b.type !== "source_row" && b.asset_id ? /* @__PURE__ */ s.jsx(fv, { asset: b.asset_id, identity: R }) : b.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            b.asset_id && ((we = d.find((nt) => nt.id === ee.project_id)) == null ? void 0 : we.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Te, onClick: () => void Et(b.asset_id), children: "下载对应来源文件" })
          ] }, b.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        ee.links.length ? ee.links.map((b) => {
          var we;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: wn[b.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + b.other_record_id), children: "打开另一条记录" }),
            ((we = d.find((nt) => nt.id === ee.project_id)) == null ? void 0 : we.roles.some((nt) => ["admin", "reviewer"].includes(nt))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Te || b.review_state === "stale", onClick: () => void ce(async () => {
                await u(`/record-links/${b.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: b.row_version, decision: "confirmed" }) }), Le((nt) => nt + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Te || b.review_state === "stale", onClick: () => void ce(async () => {
                await u(`/record-links/${b.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: b.row_version, decision: "rejected" }) }), Le((nt) => nt + 1);
              }), children: "排除" })
            ] })
          ] }, b.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : ie ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const Fs = "/history-review", Vi = "/history-reader", $f = "historyReview.visibleFields", Wf = "historyReview.columnOrder", Tn = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], mu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], Ff = { _actions: "操作", _source: "来源报告", _status: "状态" }, Ji = Object.keys(Ff), If = [...Tn, "_source", "_status", "_actions"], xv = { save_draft: "保存草稿", confirm: "批量确认", discard: "放弃修改", conflict: "值冲突" };
function jv() {
  try {
    const u = localStorage.getItem($f), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((S) => typeof S == "string") : Tn;
  } catch {
    return Tn;
  }
}
function vv() {
  try {
    const u = localStorage.getItem(Wf), h = u ? JSON.parse(u) : null;
    if (Array.isArray(h) && h.length) return h.filter((S) => typeof S == "string");
  } catch {
  }
  return If;
}
function pv(u, h) {
  const S = u.filter((R) => h.includes(R) || Ji.includes(R));
  let d = S.findIndex((R) => Ji.includes(R));
  d < 0 && (d = S.length);
  for (const R of h)
    S.includes(R) || (S.splice(d, 0, R), d += 1);
  for (const R of Ji) S.includes(R) || S.push(R);
  return S;
}
function Ft(u, h = 120) {
  const S = (u || "").replace(/\s+/g, " ").trim();
  return S.length > h ? S.slice(0, h) + "…" : S || "—";
}
function Sa(u, h) {
  var S;
  return Ff[h] || ((S = u.find((d) => d.key === h)) == null ? void 0 : S.label) || h;
}
function Df(u, h) {
  return u ? Object.entries(u).map(([S, d]) => `${Sa(h, S)}：${Ft(d, 30)}`).join("；") : "—";
}
function Mf({ id: u }) {
  const [h, S] = r.useState(""), [d, R] = r.useState("");
  return r.useEffect(() => {
    let B = !1, V = "";
    return Mt("/api/v1" + Vi + "/images/" + encodeURIComponent(u)).then(async (M) => {
      if (!M.ok) throw Error("图片暂不可用");
      return M.blob();
    }).then((M) => {
      V = URL.createObjectURL(M), B ? URL.revokeObjectURL(V) : S(V);
    }).catch((M) => {
      B || R(M.message);
    }), () => {
      B = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), d ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: d }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function gv({ api: u }) {
  const [h, S] = r.useState(null), [d, R] = r.useState([]), [B, V] = r.useState("findings"), [M, Q] = r.useState([]), [p, U] = r.useState([]), [K, k] = r.useState([]), [le, xe] = r.useState([]), [_e, ye] = r.useState(jv), [Ee, me] = r.useState(vv), [I, oe] = r.useState(""), [ne, D] = r.useState(""), [je, Re] = r.useState(!1), [Be, Xe] = r.useState(""), [Ge, pe] = r.useState(""), [Ke, X] = r.useState(""), [de, y] = r.useState(""), [Y, ee] = r.useState(0), [ke, m] = r.useState(!1), [H, te] = r.useState(!1), [$, ae] = r.useState([]), [Z, P] = r.useState(/* @__PURE__ */ new Set()), [Ce, ie] = r.useState(!1), [Se, st] = r.useState(null), [lt, Pe] = r.useState({}), [Oe, Te] = r.useState(null), [De, Ne] = r.useState(""), [Le, We] = r.useState(""), [Fe, Ze] = r.useState(""), [he, et] = r.useState(!0), [Ue, E] = r.useState(!1), [w, W] = r.useState(0), ve = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], He = (h == null ? void 0 : h.fields) || ve, tt = r.useMemo(() => Ee.filter((f) => Ji.includes(f) || _e.includes(f)), [Ee, _e]);
  r.useEffect(() => {
    if (!Oe || Se) return;
    const f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const G = (x) => {
      x.key === "Escape" && Te(null);
    };
    return window.addEventListener("keydown", G), () => {
      document.body.style.overflow = f, window.removeEventListener("keydown", G);
    };
  }, [Oe, Se]), r.useEffect(() => {
    let f = !1;
    return et(!0), Ze(""), Promise.all([
      u(Fs + "/summary"),
      u(Fs + "/projects?limit=800"),
      u(Fs + "/drafts?limit=100")
    ]).then(([G, x, ce]) => {
      f || (S(G), R(x.items), k(ce.items), ye((qe) => {
        const vt = new Set(G.editable_fields.map((Et) => Et.key)), Rt = qe.filter((Et) => vt.has(Et));
        return Rt.length ? Rt : Tn.filter((Et) => vt.has(Et));
      }), me((qe) => pv(qe, G.editable_fields.map((vt) => vt.key))));
    }).catch((G) => {
      f || Ze(G.message);
    }).finally(() => {
      f || et(!1);
    }), () => {
      f = !0;
    };
  }, [u, w]), r.useEffect(() => {
    if (B !== "findings") return;
    let f = !1;
    return et(!0), Ze(""), u(Fs + "/findings?" + new URLSearchParams({
      q: de,
      project: Be,
      document_id: Ge,
      offset: String(Y),
      limit: "30"
    })).then((G) => {
      f || (Q(H ? G.items.filter((x) => x.draft_id) : G.items), m(G.has_more));
    }).catch((G) => {
      f || Ze(G.message);
    }).finally(() => {
      f || et(!1);
    }), () => {
      f = !0;
    };
  }, [u, B, de, Be, Ge, Y, H, w]), r.useEffect(() => {
    if (B !== "reports") return;
    let f = !1;
    return et(!0), Ze(""), u(Fs + "/reports?" + new URLSearchParams({ q: de, project: Be, offset: "0", limit: "100" })).then((G) => {
      f || (U(G.items), m(!1));
    }).catch((G) => {
      f || Ze(G.message);
    }).finally(() => {
      f || et(!1);
    }), () => {
      f = !0;
    };
  }, [u, B, de, Be, w]), r.useEffect(() => {
    if (B !== "logs") return;
    let f = !1;
    return et(!0), Ze(""), u(Fs + "/logs?limit=100").then((G) => {
      f || xe(G.items);
    }).catch((G) => {
      f || Ze(G.message);
    }).finally(() => {
      f || et(!1);
    }), () => {
      f = !0;
    };
  }, [u, B, w]), r.useEffect(() => {
    Ce && P(new Set(M.map((f) => f.id)));
  }, [M, Ce]);
  function dt(f) {
    ye(f);
    try {
      localStorage.setItem($f, JSON.stringify(f));
    } catch {
    }
  }
  function L(f) {
    me(f);
    try {
      localStorage.setItem(Wf, JSON.stringify(f));
    } catch {
    }
  }
  function fe(f, G) {
    if (!f || !G || f === G) return;
    const x = Ee.filter((qe) => qe !== f), ce = x.indexOf(G);
    x.splice(ce < 0 ? x.length : ce, 0, f), L(x);
  }
  function re(f) {
    P((G) => {
      const x = new Set(G);
      return x.has(f) ? x.delete(f) : x.add(f), x;
    });
  }
  function Ve() {
    Ce ? (ie(!1), P(/* @__PURE__ */ new Set())) : (ie(!0), P(new Set(M.map((f) => f.id))));
  }
  function _(f) {
    st(f);
    const G = {};
    for (const x of mu) G[x] = f[x] || "";
    Pe(G), We(""), Te(null), Ne("");
  }
  async function be() {
    if (!Se) return;
    const f = {};
    for (const G of mu) {
      const x = Se[G] || "";
      lt[G] !== x && (f[G] = lt[G] || null);
    }
    if (!Object.keys(f).length) {
      We("没有修改任何字段。");
      return;
    }
    E(!0), Ze("");
    try {
      await u(Fs + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: Se.id, changes: f }) }), We(`已保存草稿（${Object.keys(f).map((G) => Sa(ve, G)).join("、")}），批量确认后覆盖数据库。`), st(null), W((G) => G + 1);
    } catch (G) {
      Ze(G.message);
    } finally {
      E(!1);
    }
  }
  async function ge(f) {
    if (!f.length) {
      We("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${f.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      E(!0), Ze(""), We("");
      try {
        const G = await u(Fs + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) });
        We(`已确认写入 ${G.applied.length} 条${G.conflicts.length ? `；${G.conflicts.length} 条存在值冲突` : ""}。`), ae([]), W((x) => x + 1);
      } catch (G) {
        Ze(G.message);
      } finally {
        E(!1);
      }
    }
  }
  async function Qe(f) {
    if (f.length) {
      E(!0), Ze("");
      try {
        await u(Fs + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) }), ae([]), W((G) => G + 1);
      } catch (G) {
        Ze(G.message);
      } finally {
        E(!1);
      }
    }
  }
  async function xt(f) {
    Te(null), Ne("");
    try {
      const G = await u(Vi + "/findings/" + encodeURIComponent(f.id));
      Te(G);
    } catch (G) {
      Ne(G.message);
    }
  }
  async function z(f) {
    if (Oe)
      try {
        const G = f || Oe, x = await Mt("/api/v1" + Vi + "/documents/" + encodeURIComponent(G.document_id) + "/original");
        if (!x.ok) throw Error("原件暂不可用，请稍后重试。");
        const ce = URL.createObjectURL(await x.blob()), qe = document.createElement("a");
        qe.href = ce, qe.download = G.original_name, qe.click(), setTimeout(() => URL.revokeObjectURL(ce), 1e3);
      } catch (G) {
        Ne(G.message);
      }
  }
  const v = r.useMemo(() => p, [p]), ue = r.useMemo(() => K.map((f) => f.id), [K]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: he, onClick: () => W((f) => f + 1), children: "刷新数据" })
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
      Fe && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        Fe,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => W((f) => f + 1), children: "重试" })
      ] }),
      Le && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: Le }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([f, G]) => /* @__PURE__ */ s.jsx("button", { className: B === f ? "button primary" : "button ghost", onClick: () => {
        V(f), ee(0);
      }, children: G }, f)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (f) => {
          f.preventDefault(), y(Ke.trim()), ee(0);
        }, children: [
          /* @__PURE__ */ s.jsx("label", { htmlFor: "history-query", children: "搜索" }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("input", { id: "history-query", value: Ke, onChange: (f) => X(f.target.value), maxLength: 100, placeholder: B === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: he, children: "搜索" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: Be, onChange: (f) => {
            Xe(f.target.value), ee(0);
          }, children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目（",
              (h == null ? void 0 : h.projects) ?? "—",
              "）"
            ] }),
            d.map((f) => /* @__PURE__ */ s.jsxs("option", { value: f.name, children: [
              f.name,
              "（",
              f.findings,
              "）"
            ] }, f.name))
          ] })
        ] }),
        Ge && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          pe(""), ee(0);
        }, children: "清除报告筛选" }),
        B === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: H, onChange: (f) => te(f.target.checked) }),
          "只看待确认修改"
        ] }),
        B === "findings" && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => Re((f) => !f), children: [
          "显示字段（",
          _e.length,
          "/",
          ve.length,
          "）"
        ] }),
        B === "findings" && /* @__PURE__ */ s.jsx("button", { className: Ce ? "button primary" : "button secondary", onClick: Ve, children: Ce ? "收起全部字段" : "展开全部字段" })
      ] }),
      je && B === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        ve.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e.includes(f.key), onChange: (G) => dt(G.target.checked ? [..._e, f.key] : _e.filter((x) => x !== f.key)) }),
          f.label
        ] }, f.key)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => dt(Tn.filter((f) => ve.some((G) => G.key === f))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => L(If), children: "恢复列顺序" })
      ] }),
      B === "findings" && /* @__PURE__ */ s.jsx("p", { className: "muted history-drag-tip", children: "提示：拖动表头可调整列顺序（列为“操作”默认在最后）；点击任意行可展开该条的全部字段。" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      B === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        K.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              K.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ue, onClick: () => ae($.length === ue.length ? [] : ue), children: $.length === ue.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ue || !$.length, onClick: () => void ge($), children: [
                "批量确认所选（",
                $.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ue || !$.length, onClick: () => void Qe($), children: "放弃所选" })
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
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $.includes(f.id), onChange: (G) => ae(G.target.checked ? [...$, f.id] : $.filter((x) => x !== f.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Ft(f.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Ft(f.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Df(f.changes, ve) }),
              /* @__PURE__ */ s.jsx("td", { children: f.updated_at ? new Date(f.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, f.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": he, children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: tt.map((f) => /* @__PURE__ */ s.jsxs(
            "th",
            {
              draggable: !0,
              className: "history-col-head" + (I === f ? " history-col-dragging" : "") + (ne === f ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (G) => {
                oe(f), G.dataTransfer.effectAllowed = "move", G.dataTransfer.setData("text/plain", f);
              },
              onDragOver: (G) => {
                G.preventDefault(), G.dataTransfer.dropEffect = "move", ne !== f && D(f);
              },
              onDragLeave: () => D(""),
              onDrop: (G) => {
                G.preventDefault(), fe(I || G.dataTransfer.getData("text/plain"), f), oe(""), D("");
              },
              onDragEnd: () => {
                oe(""), D("");
              },
              children: [
                Sa(ve, f),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" })
              ]
            },
            f
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            M.map((f) => {
              const G = Z.has(f.id);
              return /* @__PURE__ */ s.jsxs(r.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (f.draft_id ? "history-dirty" : "") + " history-row", onClick: (x) => {
                  x.target.closest("button, a, input, textarea, select, summary") || re(f.id);
                }, children: tt.map((x) => x === "_actions" ? /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                  /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _(f), children: "编辑" }),
                  /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => void xt(f), children: "证据" }),
                  /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => re(f.id), children: G ? "收起" : "展开" })
                ] }, x) : x === "_source" ? /* @__PURE__ */ s.jsx("td", { children: Ft(f.original_name, 24) }, x) : x === "_status" ? /* @__PURE__ */ s.jsx("td", { children: f.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Ft(f.review_state, 14) }, x) : /* @__PURE__ */ s.jsx("td", { className: x === "problem_description" ? "history-description" : "", children: Ft(f[x], x === "problem_description" ? 220 : 80) }, x)) }),
                G && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: tt.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: ve.map((x) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: x.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: f[x.key] || "—" })
                  ] }, x.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    Ft(f.original_name, 100),
                    "｜状态：",
                    Ft(f.review_state, 20),
                    f.draft_id ? "｜有待确认修改" : ""
                  ] })
                ] }) })
              ] }, f.id);
            }),
            !M.length && !he && !Fe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: tt.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Y === 0, onClick: () => ee(Math.max(0, Y - 30)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            Y / 30 + 1,
            " 页 · 本页 ",
            M.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !ke, onClick: () => ee(Y + 30), children: "下一页" })
        ] })
      ] }),
      B === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": he, children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          v.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: Ft(f.original_name, 60) }),
            /* @__PURE__ */ s.jsx("td", { children: Ft(f.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { children: Ft(f.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { children: f.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                pe(f.document_id), V("findings"), ee(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
                Mt("/api/v1" + Vi + "/documents/" + encodeURIComponent(f.document_id) + "/original").then(async (G) => {
                  if (!G.ok) throw Error("原件暂不可用");
                  const x = URL.createObjectURL(await G.blob()), ce = document.createElement("a");
                  ce.href = x, ce.download = f.original_name, ce.click(), setTimeout(() => URL.revokeObjectURL(x), 1e3);
                }).catch((G) => Ze(G.message));
              }, children: "原件" })
            ] })
          ] }, f.document_id)),
          !v.length && !he && !Fe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      B === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": he, children: /* @__PURE__ */ s.jsxs("table", { children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "时间" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" }),
          /* @__PURE__ */ s.jsx("th", { children: "报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "修改内容" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作人" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          le.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: new Date(f.created_at).toLocaleString("zh-CN") }),
            /* @__PURE__ */ s.jsx("td", { children: xv[f.action] || f.action }),
            /* @__PURE__ */ s.jsx("td", { children: Ft(f.original_name, 28) || Ft(f.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Df(f.changes, ve) }),
            /* @__PURE__ */ s.jsx("td", { children: Ft(f.actor, 30) })
          ] }, f.id)),
          !le.length && !he && !Fe && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    Se && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          st(null), Te(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Ft(Se.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: mu.map((f) => /* @__PURE__ */ s.jsxs("label", { className: f === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: Sa(ve, f) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: f === "problem_description" ? 3 : 2, value: lt[f] || "", onChange: (G) => Pe({ ...lt, [f]: G.target.value }) })
      ] }, f)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ue, onClick: () => void be(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => st(null), children: "取消" })
      ] }),
      Oe && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void z(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: He.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Oe.fields[f.key] || "—" })
        ] }, f.key)) }),
        Oe.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Sa(ve, f.field_key),
            "：",
            Ft(f.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        Oe.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            Oe.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Oe.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(Mf, { id: f.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
          ] }, f.id + ":" + G)) })
        ] })
      ] })
    ] }),
    Oe && !Se && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => Te(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Oe.original_name }),
            "｜解析版本时间：",
            new Date(Oe.parsed_at).toLocaleString("zh-CN")
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => Te(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void z(), children: "下载原报告" }),
        Oe.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: Oe.sources.map((f) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void z(f), children: f.original_name }) }, f.document_id)) })
        ] }),
        De && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: De }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: He.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Oe.fields[f.key] || "—" })
        ] }, f.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        Oe.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            Sa(ve, f.field_key),
            "：",
            Ft(f.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          Oe.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: Oe.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(Mf, { id: f.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
        ] }, f.id + ":" + G)) })
      ] })
    ] }) })
  ] });
}
function At(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((S) => ["admin", "reviewer"].includes(S)) : h === "training.manage" ? u.roles.some((S) => ["admin", "teacher"].includes(S)) : h === "training.review" ? u.roles.some((S) => ["admin", "teacher", "reviewer"].includes(S)) : !0 : !1;
}
const Is = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, qf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Hf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function xu(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((d) => d.text).join(`
`), h.facts.map((d) => d.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((d) => d.evidence_ids).join("、"), h.facts.flatMap((d) => d.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, d, R]) => d !== R);
}
function bv({ api: u, path: h, navigate: S, projects: d, identity: R }) {
  var z;
  const [B, V] = r.useState(!0), [M, Q] = r.useState(!1), [p, U] = r.useState(""), [K, k] = r.useState(""), [le, xe] = r.useState(0), [_e, ye] = r.useState([]), [Ee, me] = r.useState([]), [I, oe] = r.useState([]), [ne, D] = r.useState("knowledge_revision"), [je, Re] = r.useState(""), [Be, Xe] = r.useState(""), [Ge, pe] = r.useState(""), [Ke, X] = r.useState(null), [de, y] = r.useState([]), [Y, ee] = r.useState(null), [ke, m] = r.useState("resolved"), [H, te] = r.useState(""), [$, ae] = r.useState(""), [Z, P] = r.useState(((z = d.find((v) => At(v, "knowledge.process"))) == null ? void 0 : z.id) || ""), [Ce, ie] = r.useState([]), [Se, st] = r.useState([]), [lt, Pe] = r.useState("case_card"), [Oe, Te] = r.useState("normal"), [De, Ne] = r.useState(null), [Le, We] = r.useState(sessionStorage.getItem("b03-last-job-" + R) || ""), [Fe, Ze] = r.useState(null), [he, et] = r.useState(null), [Ue, E] = r.useState(null), [w, W] = r.useState(""), [ve, He] = r.useState(!1), tt = /^\/knowledge\/[^/]+\/edit$/.test(h), dt = d.some((v) => At(v, "knowledge.process")), L = d.some((v) => At(v, "knowledge.review")), fe = h.startsWith("/quality"), re = h === "/reviews";
  r.useEffect(() => {
    pe(""), y([]), Xe(""), Re(""), U(""), k(""), He(!1), W("");
  }, [h]), r.useEffect(() => {
    let v = !1;
    V(!0), U(""), et(null), E(null);
    async function ue() {
      try {
        if (fe) {
          const f = await u(`/quality/issues?limit=20${je ? "&rule_code=" + je : ""}${Be ? "&status=" + Be : ""}${Ge ? "&cursor=" + encodeURIComponent(Ge) : ""}`);
          if (v) return;
          me(f.items), oe(f.summary), X(f.next_cursor);
        } else if (tt) {
          const f = await u(h.replace("/edit", ""));
          if (v) return;
          et(f), E(structuredClone(f.content));
        } else if (re) {
          const f = await u(`/reviews?object_type=${ne}&state=${Be || "pending_review"}${Ge ? "&cursor=" + encodeURIComponent(Ge) : ""}`);
          if (v) return;
          ye(f.items), X(f.next_cursor);
        } else {
          const f = await u(`/knowledge?limit=20${Be ? "&state=" + Be : ""}${Ge ? "&cursor=" + encodeURIComponent(Ge) : ""}`);
          if (v) return;
          if (ye(f.items), X(f.next_cursor), dt && Z) {
            const G = await u("/knowledge/source-options?project_id=" + Z);
            v || ie(G.items);
          }
        }
      } catch (f) {
        v || U(f.message);
      } finally {
        v || V(!1);
      }
    }
    return ue(), () => {
      v = !0;
    };
  }, [h, Be, je, Ge, le, Z, ne]), r.useEffect(() => {
    st([]), Ne(null);
  }, [Z, lt, Oe]), r.useEffect(() => {
    if (!Le || fe || tt || re || !dt) return;
    let v = !1;
    const ue = () => {
      u("/knowledge/generation-jobs/" + Le).then((G) => {
        v || (Ze(G), G.status === "succeeded" && xe((x) => x + 1));
      }).catch((G) => {
        v || U(G.message);
      });
    };
    ue();
    const f = setInterval(() => {
      (!Fe || ["queued", "running", "retrying"].includes(Fe.status)) && ue();
    }, 1800);
    return () => {
      v = !0, clearInterval(f);
    };
  }, [Le, h, Fe == null ? void 0 : Fe.status]);
  const Ve = async (v) => {
    Q(!0), U(""), k("");
    try {
      await v();
    } catch (ue) {
      U(ue.message);
    } finally {
      Q(!1);
    }
  }, _ = () => ({ record_version_ids: Se, type: lt, template_version: "mock-v1", mock_scenario: Oe }), be = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !de.length, onClick: () => {
        pe(de.at(-1) || ""), y(de.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Ke, onClick: () => {
        y([...de, Ge]), pe(Ke || "");
      }, children: "下一页" })
    ] })
  ] }), ge = he && At(d.find((v) => v.id === he.project_id), "knowledge.process"), Qe = he && At(d.find((v) => v.id === he.project_id), "knowledge.review"), xt = (v) => Ve(async () => {
    if (!he) return;
    const ue = v === "submit" ? `/knowledge/${he.id}/submit-review` : `/reviews/${he.revision_id}/${v}`;
    await u(ue, { method: "POST", body: JSON.stringify({ row_version: he.row_version, revision_id: he.revision_id, reason: w, evidence_checked: ve }) }), k(v === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), xe((f) => f + 1), He(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(En, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    p && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      p,
      /* @__PURE__ */ s.jsx("button", { onClick: () => xe((v) => v + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: fe ? "selected" : "", onClick: () => S("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !fe && !re ? "selected" : "", onClick: () => S("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: re ? "selected" : "", onClick: () => S("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: B, onClick: () => xe((v) => v + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    B ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : fe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(qf).map(([v, ue]) => /* @__PURE__ */ s.jsxs("button", { className: je === v ? "panel selected-quality" : "panel", "aria-pressed": je === v, onClick: () => {
        Re(je === v ? "" : v), Xe("open"), pe(""), y([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: ue }),
        /* @__PURE__ */ s.jsx("strong", { children: I.filter((f) => f.rule_code === v && f.status === "open").reduce((f, G) => f + G.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, v)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Be, onChange: (v) => {
            Xe(v.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((v) => /* @__PURE__ */ s.jsx("option", { value: v, children: Is[v] }, v))
          ] })
        ] }),
        Ee.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "来源内容 / 规则" }),
            /* @__PURE__ */ s.jsx("th", { children: "问题" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Ee.map((v) => {
            var ue, f;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => S("/records/" + v.record_id), children: v.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: qf[v.rule_code] || v.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                v.message,
                v.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (ue = v.annotations.at(-1)) == null ? void 0 : ue.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Is[v.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((f = d.find((G) => G.id === v.project_id)) != null && f.can_run), onClick: () => {
                ee(v), te(""), ae("");
              }, children: "核查处理" }) })
            ] }, v.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        be
      ] })
    ] }) : tt && he && Ue ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Hf[he.type],
            " · v",
            he.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            Is[he.state],
            " · 生成适配器：",
            he.model_ref
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/knowledge/drafts"), children: "返回候选列表" })
      ] }),
      he.source.version !== he.source.current_version && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", children: [
        "来源已从v",
        he.source.version,
        "更新到v",
        he.source.current_version,
        "，请基于当前来源重新生成。"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-editor", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel source-proof", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "来源与证据" }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S((he.source.kind === "retrospective" ? "/retrospectives/" : "/records/") + he.source.record_id), children: he.source.kind === "retrospective" ? "打开来源复盘" : "打开风险数据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
              "固定来源 v",
              he.source.version
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "原始描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(he.source.raw_fields.description || he.source.raw_fields.隐患描述 || "见来源字段") }),
            /* @__PURE__ */ s.jsx("h3", { children: "治理生效描述" }),
            /* @__PURE__ */ s.jsx("p", { children: String(he.source.effective_fields.description || "缺失") }),
            he.source.versions && he.source.versions.length > 1 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "跨记录固定来源（",
                he.source.versions.length,
                "条）"
              ] }),
              he.source.versions.map((v) => /* @__PURE__ */ s.jsxs("details", { children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  "来源 v",
                  v.version,
                  " · ",
                  v.effective_fields.description || "查看生效字段"
                ] }),
                /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(v.effective_fields, null, 2) }),
                /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/records/" + v.record_id), children: "打开风险记录" })
              ] }, v.record_version_id))
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "项目 / 日期" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              Ue.project_name,
              " · ",
              Ue.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            he.source.evidence.map((v) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[v.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(v.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: v.id })
            ] }, v.id)),
            he.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              he.source.annotations.map((v, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
                v.reason,
                " · ",
                JSON.stringify(v.value)
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
              /* @__PURE__ */ s.jsx("input", { value: Ue.title, disabled: !ge, onChange: (v) => E({ ...Ue, title: v.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            Ue.facts.map((v, ue) => /* @__PURE__ */ s.jsxs("label", { children: [
              v.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: v.text, onChange: (f) => E({ ...Ue, facts: Ue.facts.map((G, x) => x === ue ? { ...G, text: f.target.value, source_kind: "human_annotation" } : G) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                v.evidence_ids.join("、")
              ] })
            ] }, ue)),
            Ue.construction_points && Ue.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                Ue.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: Ue.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              Ue.construction_points.map((v, ue) => {
                var f;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    v.title,
                    " · ",
                    v.stage === "preparation" ? "施工准备" : v.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: v.content, onChange: (G) => {
                      var x;
                      return E({ ...Ue, construction_points: (x = Ue.construction_points) == null ? void 0 : x.map((ce, qe) => qe === ue ? { ...ce, content: G.target.value } : ce) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: v.inspection_method, onChange: (G) => {
                      var x;
                      return E({ ...Ue, construction_points: (x = Ue.construction_points) == null ? void 0 : x.map((ce, qe) => qe === ue ? { ...ce, inspection_method: G.target.value } : ce) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: v.common_mistakes, onChange: (G) => {
                      var x;
                      return E({ ...Ue, construction_points: (x = Ue.construction_points) == null ? void 0 : x.map((ce, qe) => qe === ue ? { ...ce, common_mistakes: G.target.value } : ce) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: v.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    v.evidence_ids.join("、")
                  ] }),
                  (f = v.source_quotes) == null ? void 0 : f.map((G, x) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: G.text })
                  ] }, x))
                ] }, ue);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !ge, value: Ue.suggestions.join(`
`), onChange: (v) => E({ ...Ue, suggestions: v.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            Ue.standards.length ? Ue.standards.map((v, ue) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: v.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                v.clause || "未提供",
                " · 版本：",
                v.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: v.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !ge, checked: v.verification_status === "not_used", onChange: (f) => E({ ...Ue, standards: Ue.standards.map((G, x) => x === ue ? { ...G, verification_status: f.target.checked ? "not_used" : "pending_verification" } : G) }) }),
                "明确不采用该依据"
              ] })
            ] }, ue)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            xu(he.content, Ue).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              xu(he.content, Ue).map(([v, ue, f]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: v }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  ue
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  f
                ] })
              ] }, v))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (v) => W(v.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              ge && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: M || !w.trim(), onClick: () => void Ve(async () => {
                await u(`/knowledge/${he.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: he.row_version, revision_id: he.revision_id, content: Ue, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), xe((v) => v + 1);
              }), children: "保存新草稿版本" }),
              ge && ["draft", "changes_requested"].includes(he.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !w.trim() || JSON.stringify(Ue) !== JSON.stringify(he.content), onClick: () => void xt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Qe && he.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ve, onChange: (v) => He(v.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !ve || !w.trim() || JSON.stringify(Ue) !== JSON.stringify(he.content), onClick: () => void xt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: M || !w.trim(), onClick: () => void xt("request-changes"), children: "退回修改" })
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
        he.revisions.map((v, ue) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            v.version,
            " · ",
            Is[v.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: v.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            v.content.facts.map((f) => f.text).join("；")
          ] }),
          he.revisions[ue + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              he.revisions[ue + 1].version,
              "的修改："
            ] }),
            xu(he.revisions[ue + 1].content, v.content).map(([f, G, x]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: f }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                G
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                x
              ] })
            ] }, f))
          ] })
        ] }, v.id)),
        he.review_actions.map((v, ue) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            v.version,
            " · ",
            Is[v.action] || v.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: v.reason }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            new Date(v.created_at).toLocaleString("zh-CN"),
            " · 操作者 ",
            v.reviewer.slice(0, 8)
          ] })
        ] }, ue))
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !re && dt && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Z, onChange: (v) => P(v.target.value), children: d.filter((v) => At(v, "knowledge.process")).map((v) => /* @__PURE__ */ s.jsx("option", { value: v.id, children: v.name }, v.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: lt, onChange: (v) => Pe(v.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            st(Ce.slice(0, 20).map((v) => v.record_version_id)), Ne(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Ce.length ? Ce.map((v) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Se.includes(v.record_version_id), onChange: (ue) => {
              st(ue.target.checked ? [...Se, v.record_version_id] : Se.filter((f) => f !== v.record_version_id)), Ne(null);
            } }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              v.description || "缺少描述",
              /* @__PURE__ */ s.jsxs("small", { children: [
                "来源v",
                v.current_version,
                " · ",
                { detail: "明细", review: "复查", summary: "汇总" }[v.record_kind] || v.record_kind
              ] })
            ] })
          ] }, v.id)) : /* @__PURE__ */ s.jsx("p", { children: "当前项目尚无可用风险数据，请先完成历史数据接入。" }) }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "模拟校验场景（可选）" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "结构验证",
              /* @__PURE__ */ s.jsxs("select", { value: Oe, onChange: (v) => Te(v.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: M || !Se.length || Se.length > 20, onClick: () => void Ve(async () => {
              Ne(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(_()) }));
            }), children: [
              "预览生成范围（",
              Se.length,
              "条）"
            ] }),
            De && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: M, onClick: () => void Ve(async () => {
              const v = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(_()) });
              Ze(null), We(v.job_id), sessionStorage.setItem("b03-last-job-" + R, v.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              De.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(_l, { size: 15 })
            ] })
          ] }),
          De && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: De.items.map((v, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
            v.description,
            " · 来源问题 ",
            v.quality_issue_count,
            "项"
          ] }, ue)) }),
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
            Fe.items.map((v, ue) => /* @__PURE__ */ s.jsxs("p", { children: [
              v.error || Is[v.outcome],
              " ",
              v.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/knowledge/" + v.item_id + "/edit"), children: "打开知识卡" })
            ] }, ue)),
            Fe.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: M, onClick: () => void Ve(async () => {
              await u("/jobs/" + Fe.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Fe.row_version }) }), Ze(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: re ? "审核待办" : "知识候选列表" }),
          re && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ne, onChange: (v) => {
            D(v.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Be, onChange: (v) => {
            Xe(v.target.value), pe(""), y([]);
          }, children: [
            !re && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (re ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((v) => /* @__PURE__ */ s.jsx("option", { value: v, children: Is[v] }, v))
          ] })
        ] }),
        re && !L ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : _e.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: _e.map((v) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: v.title }),
            /* @__PURE__ */ s.jsx("td", { children: Hf[v.type] }),
            /* @__PURE__ */ s.jsx("td", { children: Is[v.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              v.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S(v.object_type === "question_revision" ? "/training/questions/" + v.id : v.object_type === "retrospective_revision" ? "/retrospectives/" + v.id + "/review" : "/knowledge/" + v.id + "/edit"), children: re ? "打开审核" : "核查与编辑" }) })
          ] }, v.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: re ? "暂无对应审核待办" : "还没有知识候选" }),
          /* @__PURE__ */ s.jsx("p", { children: "先从明确来源范围生成，再核查并提交审核。" })
        ] }),
        be
      ] })
    ] }),
    Y && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "quality-dialog", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "quality-dialog", children: "核查质量问题" }),
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ee(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: Y.message }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理状态",
        /* @__PURE__ */ s.jsx("select", { value: ke, onChange: (v) => m(v.target.value), children: ["resolved", "ignored", "open"].map((v) => /* @__PURE__ */ s.jsx("option", { value: v, children: Is[v] }, v)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: H, onChange: (v) => te(v.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: $, onChange: (v) => ae(v.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: M || !H.trim(), onClick: () => void Ve(async () => {
        await u("/quality/issues/" + Y.id, { method: "PATCH", body: JSON.stringify({ row_version: Y.row_version, status: ke, reason: H, annotation: $ || null }) }), ee(null), xe((v) => v + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Bf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, yv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", _v = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", ju = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function Nv({ identity: u, path: h, projects: S, navigate: d }) {
  var fe, re, Ve, _, be, ge, Qe, xt;
  const [R, B] = r.useState(((fe = S[0]) == null ? void 0 : fe.id) || ""), [V, M] = r.useState("generic"), [Q, p] = r.useState(""), [U, K] = r.useState([]), [k, le] = r.useState({}), [xe, _e] = r.useState([]), [ye, Ee] = r.useState([]), [me, I] = r.useState("mock-hash-64"), [oe, ne] = r.useState([]), [D, je] = r.useState(null), [Re, Be] = r.useState(""), [Xe, Ge] = r.useState("extractive"), [pe, Ke] = r.useState(null), [X, de] = r.useState(null), [y, Y] = r.useState(null);
  r.useEffect(() => () => {
    y && URL.revokeObjectURL(y);
  }, [y]), r.useEffect(() => {
    Y(null);
  }, [R, h]);
  const [ee, ke] = r.useState(null);
  r.useEffect(() => {
    ke(null);
  }, [h]);
  const [m, H] = r.useState(""), [te, $] = r.useState("useful"), [ae, Z] = r.useState(""), [P, Ce] = r.useState(!1), [ie, Se] = r.useState(!0), [st, lt] = r.useState(""), [Pe, Oe] = r.useState(""), [Te, De] = r.useState(0), [Ne, Le] = r.useState(""), [We, Fe] = r.useState(null), [Ze, he] = r.useState([]), et = r.useRef("");
  et.current = [u, h, R, V, Q, Re, Xe, ee].join("|");
  const Ue = h === "/releases", E = h === "/search", w = h === "/knowledge/library", W = At(S.find((z) => z.id === R), "knowledge.publish"), ve = !Ue && !E && !w ? h.split("/")[2] : null;
  async function He(z, v = {}) {
    const ue = await Mt("/api/v1" + z, { ...v, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...v.headers } }), f = await ue.json();
    if (!ue.ok) throw new Error(f.message || "请求失败，请重试。");
    return f;
  }
  r.useEffect(() => {
    Ee([]), Ke(null), de(null), lt(""), Oe(""), Le(""), he([]);
  }, [R, h, V, Q]), r.useEffect(() => {
    let z = !1;
    return Se(!0), lt(""), je(null), (async () => {
      try {
        if (Ue) {
          const ue = await He(`/releases?project_id=${R}${Ne ? "&cursor=" + encodeURIComponent(Ne) : ""}`);
          if (z) return;
          K(ue.items), le(ue.active_ids), Fe(ue.next_cursor);
          const f = await He("/releases/options?project_id=" + R);
          z || _e(f.items);
        } else if (w) {
          const ue = await He(`/knowledge/library?project_id=${R}${V ? "&scene_code=" + V : ""}${Q ? "&card_type=" + Q : ""}${Ne ? "&after_id=" + Ne : ""}`);
          z || (ne(ue.items), Fe(ue.next_cursor));
        } else if (ve) {
          const ue = await He("/published/knowledge/" + ve + (ee ? "?revision_id=" + ee : ""));
          z || je(ue);
        }
      } catch (ue) {
        z || lt(ue.message);
      } finally {
        z || Se(!1);
      }
    })(), () => {
      z = !0;
    };
  }, [R, h, V, Q, Te, Ne, ee]), r.useEffect(() => {
    if (!Ue || !U.some((v) => ["queued", "building"].includes(v.state))) return;
    const z = setInterval(() => De((v) => v + 1), 1800);
    return () => clearInterval(z);
  }, [Ue, U]);
  const tt = async (z) => {
    Ce(!0), lt(""), Oe("");
    try {
      await z();
    } catch (v) {
      lt(v.message);
    } finally {
      Ce(!1);
    }
  }, dt = (z, v, ue = !1) => tt(async () => {
    const f = et.current;
    Y(null), de(null);
    const G = await He("/published/evidence/" + z + "?revision_id=" + v + (ue ? "&historical=true" : ""));
    if (f === et.current && (de(G), G.has_image)) {
      const x = await Mt("/api/v1/published/evidence/" + z + "/content?revision_id=" + v + (ue ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!x.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const ce = await x.blob();
      f === et.current && Y(URL.createObjectURL(ce));
    }
  }), L = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ze.length || ie, onClick: () => {
        Le(Ze.at(-1) || ""), he(Ze.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !We || ie, onClick: () => {
        he([...Ze, Ne]), Le(We || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx($i, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || ve ? "selected" : "", onClick: () => d("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: E ? "selected" : "", onClick: () => d("/search"), children: "知识检索" }),
        S.some((z) => At(z, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: Ue ? "selected" : "", onClick: () => d("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        de(null), Ke(null), De((z) => z + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    st && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      st
    ] }),
    Pe && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      Pe
    ] }),
    !ve && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: R, onChange: (z) => B(z.target.value), children: S.map((z) => /* @__PURE__ */ s.jsx("option", { value: z.id, children: z.name }, z.id)) })
      ] }),
      !Ue && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: V, onChange: (z) => M(z.target.value), children: [
            w && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: Q, onChange: (z) => p(z.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    ie ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : Ue ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      W && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: xe.length ? xe.map((z) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(z.revision_id), onChange: (v) => Ee(v.target.checked ? [...ye, z.revision_id] : ye.filter((ue) => ue !== z.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: z.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              ju(z.type),
              " · 审核版本 v",
              z.version
            ] })
          ] })
        ] }, z.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: me, onChange: (z) => I(z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !ye.length, onClick: () => void tt(async () => {
            await He("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: R, revision_ids: ye, embedding_model: me }) }), Ee([]), Oe("发布集合已固定，处理服务正在构建索引。"), De((z) => z + 1);
          }), children: [
            "构建发布 · ",
            ye.length,
            " 张"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "构建失败不会替换当前启用版本" })
        ] }),
        U.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: U.map((z) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Bf[z.state] || z.state }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                new Date(z.created_at).toLocaleString("zh-CN"),
                " · ",
                z.entries.length,
                " 张卡片 · ",
                z.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "批次 ",
                z.id.slice(0, 8),
                z.build_ms !== null ? ` · 构建 ${z.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                z.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(z.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: P, onClick: () => void tt(async () => {
                await He("/releases/" + z.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: z.row_version, expected_active_id: k[R] || null }) }), Oe("发布已启用，知识库与检索使用同一发布集合。"), De((v) => v + 1);
              }), children: "启用发布" }),
              z.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, onClick: () => void tt(async () => {
                await He("/jobs/" + z.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: z.job_row_version }) }), De((v) => v + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          z.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: z.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            z.entries.map((v) => /* @__PURE__ */ s.jsxs("p", { children: [
              v.revision_id.slice(0, 8),
              " · ",
              Bf[v.state] || v.state,
              v.error ? " · " + v.error : ""
            ] }, v.revision_id))
          ] })
        ] }, z.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
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
      oe.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: oe.map((z) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          ju(z.type),
          " · v",
          z.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: z.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => d("/knowledge/" + z.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(Jj, { size: 15 })
        ] })
      ] }, z.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx($i, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      L
    ] }) : E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (z) => {
        z.preventDefault(), tt(async () => {
          const v = et.current;
          Ke(null), de(null);
          const ue = await He("/search", { method: "POST", body: JSON.stringify({ project_id: R, question: Re, scene_code: V, card_type: Q || null, answer_mode: Xe }) });
          v === et.current && Ke(ue);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Re, onChange: (z) => {
          Be(z.target.value), Ke(null), de(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Xe, onChange: (z) => {
              Ge(z.target.value), Ke(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Tt && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: P || !Re.trim(), children: [
            /* @__PURE__ */ s.jsx(cv, { size: 17 }),
            P ? "正在检索…" : "查找知识"
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
          pe.answer_blocks.map((z, v) => /* @__PURE__ */ s.jsx("p", { children: z.text }, v)),
          pe.missing_conditions.map((z) => /* @__PURE__ */ s.jsx("p", { children: z }, z)),
          pe.warnings.map((z) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: z.message }, z.code))
        ] }),
        pe.results.map((z, v) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            v + 1,
            " · ",
            z.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => d("/knowledge/" + z.id), children: z.title }),
          /* @__PURE__ */ s.jsx("p", { children: z.text }),
          /* @__PURE__ */ s.jsx("div", { children: pe.citations.filter((ue) => z.citation_ids.includes(ue.citation_id)).map((ue) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: P, onClick: () => void dt(ue.evidence_id, ue.knowledge_revision_id), children: [
            "打开来源：",
            ue.source_title
          ] }, ue.citation_id)) })
        ] }, z.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (z) => {
          z.preventDefault(), tt(async () => {
            await He("/search/" + pe.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: te, comment: ae }) }), Oe("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: te, onChange: (z) => $(z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ae, maxLength: 1e3, onChange: (z) => Z(z.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: P, children: "保存反馈" })
        ] })
      ] })
    ] }) : D && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => d("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        D.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        ju(D.type),
        " · v",
        D.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: D.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((re = S.find((z) => z.id === D.project_id)) == null ? void 0 : re.name) || D.project_id,
        " · ",
        yv(D.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Ve = D.content) == null ? void 0 : Ve.facts.map((z, v) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: z.text }),
        /* @__PURE__ */ s.jsx("small", { children: z.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: z.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { disabled: P, className: "citation-button", onClick: () => void dt(ue, D.revision_id, D.is_current_release === !1), children: "打开来源证据" }, ue)) })
      ] }, v)),
      ((_ = D.content) == null ? void 0 : _.construction_points) && D.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          D.content.category_name || "通用"
        ] }),
        D.content.construction_points.map((z, v) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            z.title,
            " · ",
            z.stage === "preparation" ? "施工准备" : z.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: z.content }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "检查方法：",
            z.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "常见问题：",
            z.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ s.jsx("small", { children: z.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ s.jsx("div", { children: z.evidence_ids.map((ue) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void dt(ue, D.revision_id, D.is_current_release === !1), children: "核对要点来源" }, ue)) })
        ] }, v))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((be = D.content) == null ? void 0 : be.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (ge = D.content) == null ? void 0 : ge.suggestions.map((z, v) => /* @__PURE__ */ s.jsx("p", { children: z }, v)),
      (Qe = D.content) != null && Qe.standards.length ? D.content.standards.map((z, v) => /* @__PURE__ */ s.jsxs("p", { children: [
        z.name,
        " ",
        z.clause,
        " · ",
        z.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, v)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          D.release_id
        ] }),
        (xt = D.versions) == null ? void 0 : xt.map((z) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          ke(z.id), de(null);
        }, children: [
          "查看已发布 v",
          z.version
        ] }, z.id)),
        /* @__PURE__ */ s.jsx("p", { children: D.history_note })
      ] }),
      At(S.find((z) => z.id === D.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: m, maxLength: 2e3, onChange: (z) => H(z.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: P || !m.trim(), onClick: () => void tt(async () => {
          await He("/knowledge/" + D.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: D.row_version, reason: m }) }), je(null), de(null), Oe("知识已撤回，新的检索和证据访问已阻断。"), d("/knowledge/library");
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
          _v(X.locator)
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: X.note })
      ] })
    ] })
  ] });
}
const kn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, Pf = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, gu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Sv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, bu = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, yu = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, On = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", wv = (u) => JSON.stringify(u, null, 2), kv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function wa(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((S) => typeof S != "object") ? u.join("、") : u.map((S, d) => `第${d + 1}条
${wa(S)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([S, d]) => `${kv[S] || gu[S] || S}：${wa(d, S)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return On(u);
    if (h === "actor_role" || h === "role") return yu(u);
    if (h === "event_type") return Pf[u] || u;
    if (h === "evidence_type") return bu[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const Cv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? wv(u) : "未补充说明";
};
function Ev({ identity: u, path: h, projects: S, navigate: d }) {
  var Ue, E, w, W, ve, He, tt, dt, L, fe, re, Ve;
  const R = h === "/task-packages/import", B = !R && h !== "/task-packages" ? h.split("/")[2] : null, [V, M] = r.useState(((Ue = S[0]) == null ? void 0 : Ue.id) || ""), [Q, p] = r.useState(""), [U, K] = r.useState([]), [k, le] = r.useState(null), [xe, _e] = r.useState(""), [ye, Ee] = r.useState(null), [me, I] = r.useState([]), [oe, ne] = r.useState([]), [D, je] = r.useState([]), [Re, Be] = r.useState("complete"), [Xe, Ge] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [pe, Ke] = r.useState(""), [X, de] = r.useState(null), [y, Y] = r.useState(""), [ee, ke] = r.useState(""), [m, H] = r.useState(!0), [te, $] = r.useState(!1), [ae, Z] = r.useState(0), [P, Ce] = r.useState(""), [ie, Se] = r.useState(null), st = r.useRef(null), lt = r.useRef(null), Pe = r.useRef("");
  Pe.current = [u, h, V, Re, Xe, pe].join("|");
  const Oe = S.some((_) => _.permissions != null), Te = !Oe && At(S.find((_) => _.id === V), "imports.create"), De = k && !Oe && At(S.find((_) => _.id === k.project_id), "imports.withdraw"), Ne = k && !Oe && At(S.find((_) => _.id === k.project_id), "imports.create");
  async function Le(_, be = {}) {
    const ge = await Mt("/api/v1/task-packages" + _, {
      ...be,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...be.headers }
    }), Qe = await ge.json().catch(() => ({}));
    if (!ge.ok) throw new Error(Qe.message || "接入服务暂未就绪，请稍后刷新。");
    return Qe;
  }
  const We = async (_) => {
    $(!0), Y(""), ke("");
    try {
      await _();
    } catch (be) {
      Y(be.message);
    } finally {
      $(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + u, Xe);
  }, [Xe, u]), r.useEffect(() => () => {
    ie != null && ie.url && URL.revokeObjectURL(ie.url);
  }, [ie == null ? void 0 : ie.url]), r.useEffect(() => {
    _e(""), I([]), Y(""), ke(""), Se(null), Ce(""), de(null);
  }, [h, V, Q]), r.useEffect(() => {
    let _ = !1;
    return H(!0), le(null), Y(""), (async () => {
      try {
        if (R && Tt) {
          const ge = await Mt("/api/v1/platform-archives"), Qe = await ge.json();
          if (!ge.ok) throw new Error(Qe.message);
          _ || ne(Qe.items);
        } else if (R) {
          const ge = await Le("/samples");
          _ || je(ge.items);
        } else if (B) {
          const ge = await Le("/" + B);
          _ || le(ge);
        } else {
          const ge = await Le(`?project_id=${V}${Q ? "&state=" + Q : ""}${xe ? "&cursor=" + encodeURIComponent(xe) : ""}`);
          _ || (K(ge.items), Ee(ge.next_cursor));
        }
      } catch (ge) {
        _ || Y(ge.message);
      } finally {
        _ || H(!1);
      }
    })(), () => {
      _ = !0;
    };
  }, [h, V, Q, xe, ae]), r.useEffect(() => {
    if (Tt || !R || !Te) return;
    let _ = !1;
    de(null), Ke("");
    const be = Xe + "." + (Re === "v2" ? "complete" : Re);
    return Le(`/samples/${Re}?project_id=${V}&task_id=${be}`).then((ge) => {
      _ || Ke(JSON.stringify(ge, null, 2));
    }).catch((ge) => {
      _ || Y(ge.message);
    }), () => {
      _ = !0;
    };
  }, [R, V, Re, Xe]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !B && U.some((ge) => ["received", "validating", "processing"].includes(ge.status))) || R) return;
    const be = setInterval(() => Z((ge) => ge + 1), 1800);
    return () => clearInterval(be);
  }, [k == null ? void 0 : k.status, U, h]);
  const Fe = () => We(async () => {
    const _ = Pe.current;
    de(null);
    const be = await Le("/preview", { method: "POST", body: pe });
    Pe.current === _ && de(be);
  }), Ze = () => We(async () => {
    var be;
    if (!X) return;
    ((be = st.current) == null ? void 0 : be.hash) !== X.content_hash && (st.current = { hash: X.content_hash, key: crypto.randomUUID() });
    const _ = await Le("", { method: "POST", headers: { "Idempotency-Key": st.current.key }, body: pe });
    ke(_.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), d("/task-packages/" + _.receipt_id);
  }), he = (_) => We(async () => {
    const be = Pe.current;
    Se(null);
    const ge = await Mt(`/api/v1/task-packages/${B}/assets/${_.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!ge.ok) {
      const xt = await ge.json().catch(() => ({}));
      throw new Error(xt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Qe = await ge.blob();
    if (be === Pe.current)
      if (_.mime_type.startsWith("text/")) {
        const xt = await Qe.slice(0, 1e6).text();
        be === Pe.current && Se({ id: _.attachment_id, url: null, text: xt });
      } else if (_.mime_type.startsWith("image/")) Se({ id: _.attachment_id, url: URL.createObjectURL(Qe), text: null });
      else {
        const xt = URL.createObjectURL(Qe), z = document.createElement("a");
        z.href = xt, z.download = "任务附件", z.click(), URL.revokeObjectURL(xt);
      }
  }), et = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !me.length || m, onClick: () => {
        _e(me.at(-1) || ""), I(me.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !ye || m, onClick: () => {
        I([...me, xe]), _e(ye || "");
      }, children: "下一页" })
    ] })
  ] });
  return S.length ? Oe && R ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Ef, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Tt ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Oe ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: R ? "" : "selected", onClick: () => d("/task-packages"), children: "任务包清单" }),
        !Oe && S.some((_) => At(_, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: R ? "selected" : "", onClick: () => d("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Se(null), Z((_) => _ + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => d("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    y && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      y
    ] }),
    ee && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      ee
    ] }),
    !B && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (_) => M(_.target.value), children: S.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.name }, _.id)) })
      ] }),
      !R && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: Q, onChange: (_) => p(_.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((_) => /* @__PURE__ */ s.jsx("option", { value: _, children: kn[_] }, _))
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : R ? Te ? Tt ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        oe.filter((_) => _.project_id === V).map((_) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            _.title,
            " · 第",
            _.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te, onClick: () => void We(async () => {
            const be = await Mt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: _.id }) }), ge = await be.json();
            if (!be.ok) throw new Error(ge.message);
            d("/task-packages/" + ge.receipt_id);
          }), children: "接入此成果" })
        ] }, _.id)),
        !oe.some((_) => _.project_id === V) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Re, onChange: (_) => Be(_.target.value), children: D.map((_) => /* @__PURE__ */ s.jsx("option", { value: _.id, children: _.label }, _.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te, onClick: () => Ge("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: te, onChange: (_) => {
              var ge;
              const be = (ge = _.target.files) == null ? void 0 : ge[0];
              if (be) {
                if (be.size > 5242880) {
                  Y("文件超过5MiB上限。");
                  return;
                }
                be.text().then((Qe) => {
                  Ke(Qe), de(null), Y("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: pe, onChange: (_) => {
              Ke(_.target.value), de(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te || !pe, onClick: () => void Fe(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: te || !X, onClick: () => void Ze(), children: [
              /* @__PURE__ */ s.jsx(Kf, { size: 16 }),
              te ? "正在处理…" : "确认接入归档成果"
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
          ((E = S.find((_) => _.id === X.project_id)) == null ? void 0 : E.name) || X.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(X.counts).map(([_, be]) => /* @__PURE__ */ s.jsxs("span", { children: [
          gu[_],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: be })
        ] }, _)) }),
        /* @__PURE__ */ s.jsx("p", { children: X.note }),
        X.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : B ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel package-overview", children: [
        /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => d("/task-packages"), children: "返回任务包清单" }),
        /* @__PURE__ */ s.jsxs("div", { className: "package-title", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { children: k.name }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              ((w = S.find((_) => _.id === k.project_id)) == null ? void 0 : w.name) || k.project_id,
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
        k.capabilities.map((_) => /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Sv[_] }, _)),
        k.status !== "withdrawn" && /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。" }),
        k.retrospective_id && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => d("/retrospectives/" + k.retrospective_id), children: "打开已有复盘" }),
        Ne && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te, onClick: () => void We(async () => {
          const _ = await Mt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), be = await _.json();
          if (!_.ok) throw new Error(be.message);
          d("/retrospectives/" + be.id);
        }), children: "自动生成 / 更新复盘" })
      ] }),
      k.status === "withdrawn" ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "此任务包已撤回" }),
        /* @__PURE__ */ s.jsx("p", { children: "正文、事件、问题和附件已停止在线使用。" }),
        k.invalidations.map((_) => /* @__PURE__ */ s.jsxs("p", { children: [
          "下游失效通知：",
          _.state === "handled" ? "复盘、培训实时来源保护已生效" : _.state === "pending" ? "历史通知待标记；当前在线访问仍受来源保护" : _.state
        ] }, _.id))
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        (k.warnings.length > 0 || k.validation_errors.length > 0) && /* @__PURE__ */ s.jsxs("section", { className: "panel package-warning", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "校验结果与资料限制" }),
          k.validation_errors.map((_, be) => /* @__PURE__ */ s.jsx("p", { children: _.message }, "e" + be)),
          k.warnings.map((_, be) => /* @__PURE__ */ s.jsx("p", { children: _.message }, "w" + be))
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
            On((W = k.task) == null ? void 0 : W.started_at),
            "　结束：",
            On((ve = k.task) == null ? void 0 : ve.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((He = k.participants) == null ? void 0 : He.map((_) => yu(_.role) + "（" + _.actor_id + "）").join("、")) || "未提供"
          ] }),
          (tt = k.issues) == null ? void 0 : tt.map((_) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: _.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              _.responsible_actor_id || "未提供",
              "　期限：",
              On(_.due_at)
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "整改：",
              _.rectification || "未提供"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "复核：",
              _.review_conclusion || "未提供"
            ] })
          ] }, _.issue_id))
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "过程事件与证据" }),
            /* @__PURE__ */ s.jsx("span", { children: "按A提供顺序展示，未知时间保持为空" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (dt = k.events) != null && dt.length ? k.events.map((_) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: On(_.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: _.is_known ? Pf[_.event_type] || _.event_type : "未知事件 · " + _.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Cv(_.payload) }),
              _.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                _.related_object_id === k.task_id ? "本次任务" : "问题 " + _.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                yu(_.actor.actor_role),
                " · ",
                _.actor.actor_id || "未提供人员"
              ] }),
              _.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                _.evidence_refs.map((be) => {
                  var Qe;
                  const ge = (Qe = k.attachments) == null ? void 0 : Qe.find((xt) => xt.attachment_id === be);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: te || !ge || ge.state !== "verified", onClick: () => ge && void he(ge), children: [
                    ge ? bu[ge.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    be
                  ] }, be);
                })
              ] })
            ] })
          ] }, _.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: te, onClick: () => void We(async () => {
            const _ = await Le("/" + B + "?event_after=" + k.event_next);
            le({ ..._, events: [...k.events || [], ..._.events || []] });
          }), children: "加载后续事件" })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-attachments", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "证据附件" }),
            /* @__PURE__ */ s.jsx("span", { children: "校验通过后才可打开" })
          ] }),
          (L = k.attachments) != null && L.length ? k.attachments.map((_) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                bu[_.evidence_type] || "未知类型",
                " · ",
                _.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                kn[_.state],
                " · ",
                _.size,
                " 字节 · 关联",
                _.event_ids.length,
                "个事件"
              ] }),
              _.error && /* @__PURE__ */ s.jsx("p", { children: _.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: te || _.state !== "verified", onClick: () => void he(_), children: "打开附件" })
          ] }, _.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          ie && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Se(null), children: "关闭预览" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "证据附件 · ",
              ie.id
            ] }),
            ie.url && /* @__PURE__ */ s.jsx("img", { src: ie.url, alt: "任务证据附件" }),
            ie.text && /* @__PURE__ */ s.jsx("pre", { children: ie.text })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (fe = k.versions) == null ? void 0 : fe.map((_) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: _.id === k.id, onClick: () => d("/task-packages/" + _.id), children: [
            "第",
            _.package_version,
            "版 · ",
            kn[_.state],
            _.is_current ? " · 当前使用" : ""
          ] }, _.id)) }),
          (re = k.diff) != null && re.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Ve = k.diff) == null ? void 0 : Ve.changes.map((_, be) => {
            var ge, Qe, xt, z, v;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                gu[_.section] || _.section,
                "有变化"
              ] }),
              "before" in _ ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: wa(_.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: wa(_.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((ge = _.added) == null ? void 0 : ge.join("、")) || "无",
                  "；移除：",
                  ((Qe = _.removed) == null ? void 0 : Qe.join("、")) || "无"
                ] }),
                _.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (xt = _.before_order) == null ? void 0 : xt.join(" → "),
                  "　调整为　",
                  (z = _.after_order) == null ? void 0 : z.join(" → ")
                ] }),
                (v = _.changed) == null ? void 0 : v.map((ue) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      ue.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(ue.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: wa(ue.after) })
                  ] })
                ] }, ue.id))
              ] })
            ] }, be);
          })
        ] }),
        (De || Ne && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          Ne && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: te, onClick: () => void We(async () => {
            const _ = await Mt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!_.ok) throw new Error((await _.json()).message);
            ke("已提交重试，已保存事件与附件不会重复新增。"), Z((be) => be + 1);
          }), children: "重试接入" }),
          De && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: P, maxLength: 2e3, onChange: (_) => Ce(_.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: te || !P.trim(), onClick: () => void We(async () => {
              var ge;
              const _ = JSON.stringify({ reason: P }), be = k.id + _;
              ((ge = lt.current) == null ? void 0 : ge.body) !== be && (lt.current = { body: be, key: crypto.randomUUID() }), await Le("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": lt.current.key }, body: _ }), Se(null), Z((Qe) => Qe + 1);
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
        /* @__PURE__ */ s.jsx("tbody", { children: U.map((_) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => d("/task-packages/" + _.id), children: _.name }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              _.producer,
              " · ",
              _.task_id
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            "第",
            _.package_version,
            "版",
            /* @__PURE__ */ s.jsxs("small", { children: [
              "最新接收：第",
              _.latest_received_version,
              "版"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: kn[_.status] }),
          /* @__PURE__ */ s.jsx("td", { children: _.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : _.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: _.status === "withdrawn" ? "正文与附件已停止使用" : _.missing_fields.length ? `${_.missing_fields.length} 项资料限制` : _.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, _.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Ef, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      et
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function em(u, h, S, d) {
  const R = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(S) });
  d();
  const B = Date.now() + 1200 * 1e3;
  for (; Date.now() < B; ) {
    const V = await u("/model-generation-jobs/" + R.job_id);
    if (V.status === "succeeded") return V.result;
    if (V.status === "failed") throw new Error(V.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((M) => setTimeout(M, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Cn = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Ov = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Tv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, Qi = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function zv({ api: u, path: h, navigate: S, projects: d, identity: R }) {
  var dt;
  const B = h.split("/")[2], V = h.endsWith("/review"), [M, Q] = r.useState([]), [p, U] = r.useState(null), [K, k] = r.useState(null), [le, xe] = r.useState(!1), [_e, ye] = r.useState(!0), [Ee, me] = r.useState(""), [I, oe] = r.useState(""), [ne, D] = r.useState(0), [je, Re] = r.useState("llm"), [Be, Xe] = r.useState("task_process"), [Ge, pe] = r.useState(((dt = d.find((L) => At(L, "retrospective.generate"))) == null ? void 0 : dt.id) || ""), [Ke, X] = r.useState([]), [de, y] = r.useState(""), [Y, ee] = r.useState([]), [ke, m] = r.useState([]), [H, te] = r.useState(""), [$, ae] = r.useState(!1), [Z, P] = r.useState(""), [Ce, ie] = r.useState(""), [Se, st] = r.useState(""), [lt, Pe] = r.useState(null), [Oe, Te] = r.useState([]), [De, Ne] = r.useState(null), [Le, We] = r.useState(""), [Fe, Ze] = r.useState(""), he = d.some((L) => At(L, "retrospective.generate")), et = !!(p != null && p.is_current) && !!At(d.find((L) => L.id === p.project_id), "retrospective.edit"), Ue = !!(p != null && p.is_current) && !!At(d.find((L) => L.id === p.project_id), "retrospective.review");
  r.useEffect(() => {
    P(""), te(""), ae(!1), me(""), oe(""), st(""), Te([]), Ne(null);
  }, [h]), r.useEffect(() => {
    let L = !1;
    return ye(!0), U(null), me(""), (async () => {
      try {
        if (B) {
          const re = await u(`/retrospectives/${B}${Z ? "?revision_id=" + Z : ""}`);
          L || (U(re), k({ summary: re.summary, findings: structuredClone(re.findings), suggestions: structuredClone(re.suggestions) }), ae(!1));
        } else {
          const re = await u(`/retrospectives?limit=20${Ce ? "&state=" + Ce : ""}${Se ? "&cursor=" + encodeURIComponent(Se) : ""}`);
          L || (Q(re.items), Pe(re.next_cursor));
        }
      } catch (re) {
        L || me(re.message);
      } finally {
        L || ye(!1);
      }
    })(), () => {
      L = !0;
    };
  }, [B, h, Z, Ce, Se, ne]), r.useEffect(() => {
    if (B || !Ge || !he) return;
    let L = !1;
    return m([]), X([]), ee([]), y(""), (async () => {
      var re;
      try {
        const [Ve, _] = await Promise.all([u(`/task-packages?project_id=${Ge}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${Ge}&limit=100`)]);
        if (L) return;
        const be = Ve.items.filter((ge) => ge.is_current);
        X(be), y(((re = be[0]) == null ? void 0 : re.id) || ""), ee(_.items);
      } catch (Ve) {
        L || me(Ve.message);
      }
    })(), () => {
      L = !0;
    };
  }, [B, Ge, ne]), r.useEffect(() => {
    if (!(De != null && De.asset_id) || De.type !== "task_attachment") {
      We(""), Ze("");
      return;
    }
    let L = !1, fe = "";
    return Mt("/api/v1/assets/" + De.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + R } }).then(async (re) => {
      if (!re.ok) {
        const _ = await re.json();
        throw new Error(_.message);
      }
      const Ve = await re.blob();
      !L && /^(image\/|text\/plain)/.test(Ve.type) && (fe = URL.createObjectURL(Ve), We(fe), Ze(Ve.type));
    }).catch((re) => {
      L || me(re.message);
    }), () => {
      L = !0, fe && URL.revokeObjectURL(fe), We("");
    };
  }, [De, R]);
  const E = async (L) => {
    xe(!0), me(""), oe("");
    try {
      await L();
    } catch (fe) {
      me(fe.message);
    } finally {
      xe(!1);
    }
  }, w = () => ({ revision_id: p.revision_id, row_version: p.row_version, reason: H, evidence_checked: $ }), W = !!p && !!K && JSON.stringify(K) === JSON.stringify({ summary: p.summary, findings: p.findings, suggestions: p.suggestions }), ve = (L) => void E(async () => {
    const fe = L === "submit" ? `/retrospectives/${B}/submit-review` : `/reviews/${p.revision_id}/${L}`;
    await u(fe, { method: "POST", body: JSON.stringify(w()) }), oe("已保存本版本的审核状态与意见。"), D((re) => re + 1);
  }), He = (L, fe) => L.map((re, Ve) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + re.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Ov[re.claim_kind] }),
      re.record_status && /* @__PURE__ */ s.jsx("strong", { children: re.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: re.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && et ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + re.id, value: re.text, onChange: (_) => k((be) => be && { ...be, [fe]: be[fe].map((ge, Qe) => Qe === Ve ? { ...ge, text: _.target.value, review_state: "unconfirmed" } : ge) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: re.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: re.evidence_refs.map((_, be) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => Ne(p.evidence.find((ge) => ge.id === _) || null), children: [
      "查看证据 ",
      be + 1
    ] }, _)) }),
    V && et && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: re.review_state === "confirmed", onChange: (_) => k((be) => be && { ...be, [fe]: be[fe].map((ge, Qe) => Qe === Ve ? { ...ge, review_state: _.target.checked ? "confirmed" : "unconfirmed" } : ge) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, re.id)), tt = (L) => L.map((fe) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: Qi(fe.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Tv[fe.event_type] || "未知事件类型：" + fe.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof fe.payload.note == "string" ? fe.payload.note : Object.keys(fe.payload).length ? JSON.stringify(fe.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ne(p.evidence.find((re) => re.reference === "event:" + fe.event_id) || null), children: "打开事件记录" }),
    fe.evidence_refs.map((re) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Ve = p.evidence.find((_) => _.reference === "attachment:" + re);
      Ve ? Ne(Ve) : me("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      re
    ] }, re))
  ] }, fe.event_id));
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module retro-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Pj, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "过程复盘与经验" }),
        /* @__PURE__ */ s.jsx("span", { children: "复用归档成果的事件和证据。时间与流程规则自动核算，摘要建议使用本地模拟模板；条目仍需人工核查。" })
      ] })
    ] }),
    Ee && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ee,
      /* @__PURE__ */ s.jsx("button", { onClick: () => D((L) => L + 1), children: "重新加载" })
    ] }),
    I && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      I
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => D((L) => L + 1), disabled: le, children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    _e ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : B ? p && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: p.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            p.version,
            " · ",
            Cn[p.state],
            " · ",
            p.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            p.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: p.revision_id, onChange: (L) => P(L.target.value), children: p.revisions.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
            "v",
            L.version,
            " · ",
            Cn[L.state]
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => S(`/retrospectives/${B}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !p.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && et ? /* @__PURE__ */ s.jsxs("label", { children: [
            "复盘摘要",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘摘要", value: K.summary, onChange: (L) => k({ ...K, summary: L.target.value }) })
          ] }) : /* @__PURE__ */ s.jsx("p", { children: p.summary }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            p.sources.task_package_id ? "固定任务包 v" + p.sources.package_version : "固定历史版本 " + p.sources.record_version_ids.length + "条",
            " · 未发现相关记录表示资料缺口，不代表现场未执行。"
          ] }),
          p.sources.task_package_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/task-packages/" + p.sources.task_package_id), children: "打开来源任务包" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "retro-columns", children: [
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "实际过程与时间计算" }),
            /* @__PURE__ */ s.jsx("span", { children: "仅按来源中的实际时间排序" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            p.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: tt(p.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            p.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: tt(p.timeline.unknown_time) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "可核对的时间差" }),
            p.timeline.intervals.length ? p.timeline.intervals.map((L, fe) => /* @__PURE__ */ s.jsxs("p", { children: [
              L.name,
              "：",
              L.seconds / 60,
              " 分钟（不代表有效工作量）"
            ] }, fe)) : /* @__PURE__ */ s.jsx("p", { children: "缺少可配对的实际时间，不计算过程时长。" }),
            /* @__PURE__ */ s.jsx("h3", { children: "期限对照" }),
            p.timeline.deadlines.length ? p.timeline.deadlines.map((L) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsxs("strong", { children: [
                L.issue_id,
                " · ",
                L.result
              ] }),
              /* @__PURE__ */ s.jsx("p", { children: L.reason || `明确期限 ${Qi(L.due_at || null)}；复核记录 ${Qi(L.accepted_at || null)}；晚于期限 ${L.late_seconds / 60} 分钟。` })
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
      V && p.is_current && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本审核与经验沉淀" }),
          /* @__PURE__ */ s.jsx("span", { children: "复用统一审核服务" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改 / 审核说明",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: H, onChange: (L) => te(L.target.value) })
          ] }),
          et && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: le || W || !H.trim(), onClick: () => void E(async () => {
              await u(`/retrospectives/${B}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), oe("已保存新草稿版本，旧内容及审核意见保留。"), D((L) => L + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(p.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !W || !H.trim(), onClick: () => ve("submit"), children: "提交当前版本审核" })
          ] }),
          Ue && p.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: $, onChange: (L) => ae(L.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !$ || !W || !H.trim(), onClick: () => ve("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: le || !W || !H.trim(), onClick: () => ve("request-changes"), children: "退回修改" })
            ] })
          ] }),
          et && p.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || !W || !H.trim(), onClick: () => void E(async () => {
            const L = await u(`/retrospectives/${B}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            oe(L.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), D((fe) => fe + 1);
          }), children: "转为经验候选草稿" }) }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "逐项确认后保存，再提交审核。审核通过不会自动进入知识库；转换得到的经验还需知识审核与发布。" })
        ] })
      ] }),
      p.draft_ids.length > 0 && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "本版本的经验草稿" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: p.draft_ids.map((L) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => S("/knowledge/" + L + "/edit"), children: "打开经验候选" }, L)) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel revision-panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "审核轨迹与来源指纹" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsx("p", { className: "retro-hash", children: p.input_fingerprint }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "摘要适配器：",
            p.model_ref
          ] })
        ] }),
        p.review_actions.map((L, fe) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            L.version,
            " · ",
            Cn[L.action] || L.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: L.reason }),
          /* @__PURE__ */ s.jsx("small", { children: Qi(L.created_at) })
        ] }, fe))
      ] })
    ] }) : null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      he && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从已有资料自动生成复盘" }),
          /* @__PURE__ */ s.jsx("span", { children: "选择一次来源，无需重新录入事件、问题和证据" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议生成",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: je, onChange: (L) => Re(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Be, onChange: (L) => Xe(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Ge, onChange: (L) => pe(L.target.value), children: d.filter((L) => At(L, "retrospective.generate")).map((L) => /* @__PURE__ */ s.jsx("option", { value: L.id, children: L.name }, L.id)) })
            ] })
          ] }),
          Be === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: de, onChange: (L) => y(L.target.value), children: Ke.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
              L.name,
              " · 包v",
              L.package_version
            ] }, L.id)) }),
            !Ke.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Y.map((L) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ke.includes(L.record_version_id), onChange: (fe) => m(fe.target.checked ? [...ke, L.record_version_id] : ke.filter((re) => re !== L.record_version_id)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              L.description || "未填写描述",
              " · 来源v",
              L.current_version
            ] })
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            Be === "task_process" ? "固定任务包版本，对照演示流程模板；记录不完整时明确说明。" : "只汇总所选固定来源，不能将历史隐患描述当成完整作业过程。",
            " 当前显示最近100项，每次历史来源最多20条。"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: le || (Be === "task_process" ? !de : !ke.length || ke.length > 20), onClick: () => void E(async () => {
              const L = await em(u, "/retrospective-generation-jobs", { mode: Be, generation_mode: je, task_package_id: Be === "task_process" ? de : null, record_version_ids: Be === "historical_case" ? ke : [], template_version: "process-review-v1" }, () => oe("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              S("/retrospectives/" + L.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => S("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: Ce, onChange: (L) => {
            ie(L.target.value), st(""), Te([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((L) => /* @__PURE__ */ s.jsx("option", { value: L, children: Cn[L] }, L))
          ] })
        ] }),
        M.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: M.map((L) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              L.title,
              /* @__PURE__ */ s.jsx("small", { children: L.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: L.sources.task_package_id ? "任务包 v" + L.sources.package_version : L.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              L.version,
              " · ",
              Cn[L.state]
            ] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/retrospectives/" + L.id), children: "查看复盘" }),
              /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/retrospectives/" + L.id + "/review"), children: "核查与审核" })
            ] })
          ] }, L.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "当前范围暂无复盘" }),
          /* @__PURE__ */ s.jsx("p", { children: "选择已有任务包或历史来源生成第一份草稿。" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("span", { children: "按当前项目权限显示" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
            /* @__PURE__ */ s.jsx("button", { disabled: !Oe.length, onClick: () => {
              st(Oe.at(-1) || ""), Te(Oe.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !lt, onClick: () => {
              Te([...Oe, Se]), st(lt || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    De && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => Ne(null), children: /* @__PURE__ */ s.jsx(Zi, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: De.type === "process_event" ? "实际事件记录" : De.type === "task_attachment" ? "任务附件" : De.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: De.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(De.locator)
      ] }),
      Le && Fe.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: Le, alt: "来源证据" }),
      Le && Fe.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: Le }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const ks = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, _a = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Lf = { selected: [], text: "", row_version: 0 };
function Av({ api: u, path: h, navigate: S, projects: d }) {
  var we, nt, pt;
  const R = h.startsWith("/learn"), B = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || B ? h.split("/")[3] : "", M = /^\/training\/questions\/[^/]+$/.test(h), Q = M ? h.split("/")[3] : "", p = h === "/training/questions", U = h === "/training/packages", K = h === "/training/results", k = d.some((j) => At(j, "training.manage")), le = d.some((j) => At(j, "training.review")), [xe, _e] = r.useState("llm"), [ye, Ee] = r.useState(""), [me, I] = r.useState(((we = d.find((j) => At(j, "training.manage"))) == null ? void 0 : we.id) || ((nt = d[0]) == null ? void 0 : nt.id) || ""), [oe, ne] = r.useState([]), [D, je] = r.useState([]), [Re, Be] = r.useState([]), [Xe, Ge] = r.useState([]), [pe, Ke] = r.useState(null), [X, de] = r.useState(null), [y, Y] = r.useState(""), [ee, ke] = r.useState(!1), [m, H] = r.useState([]), [te, $] = r.useState(["single_choice", "case_answer"]), [ae, Z] = r.useState([]), [P, Ce] = r.useState("新人风险识别与复盘练习"), [ie, Se] = r.useState("learning-" + Date.now()), [st, lt] = r.useState(1), [Pe, Oe] = r.useState(null), [Te, De] = r.useState({}), [Ne, Le] = r.useState(null), [We, Fe] = r.useState("rules"), [Ze, he] = r.useState("useful"), [et, Ue] = r.useState(""), [E, w] = r.useState({}), [W, ve] = r.useState({}), [He, tt] = r.useState(""), [dt, L] = r.useState(""), [fe, re] = r.useState(null), [Ve, _] = r.useState([]), [be, ge] = r.useState(!0), [Qe, xt] = r.useState(!1), [z, v] = r.useState(""), [ue, f] = r.useState(""), [G, x] = r.useState(0);
  r.useEffect(() => {
    L(""), _([]), Y(""), ke(!1), f(""), v(""), Z([]);
  }, [h]), r.useEffect(() => {
    let j = !1;
    return ge(!0), v(""), Ke(null), Oe(null), Le(null), (async () => {
      try {
        if (V)
          if (B) {
            const Ae = await u(`/training/attempts/${V}/result?teacher=true`);
            j || Le(Ae);
          } else {
            const Ae = await u("/training/attempts/" + V);
            if (j) return;
            if (Oe(Ae), De(Object.fromEntries(Ae.saved_answers.map((at) => [at.question_revision_id, { ...at.answer, row_version: at.row_version }]))), Ae.state === "submitted") {
              const at = await u(`/training/attempts/${V}/result`);
              j || Le(at);
            }
          }
        else if (M) {
          const Ae = await u("/training/questions/" + Q);
          j || (Ke(Ae), de(structuredClone(Ae.content)));
        } else if (R) {
          const [Ae, at] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          j || (je(Ae.items), Ge(at.items));
        } else if (K) {
          const Ae = await u(`/training/results?limit=20${dt ? "&cursor=" + dt : ""}`);
          j || (Ge(Ae.items), re(Ae.next_cursor));
        } else if (U) {
          const [Ae, at] = await Promise.all([u(`/training/packages?limit=20${dt ? "&cursor=" + dt : ""}`), u("/training/questions?state=approved&limit=100")]);
          j || (je(Ae.items), ne(at.items), re(Ae.next_cursor));
        } else {
          const [Ae, at] = await Promise.all([u(`/training/questions?limit=20${He ? "&state=" + He : ""}${dt ? "&cursor=" + dt : ""}`), u("/knowledge/library?limit=100&project_id=" + me)]);
          j || (ne(Ae.items), Be(at.items), re(Ae.next_cursor));
        }
      } catch (Ae) {
        j || v(Ae.message);
      } finally {
        j || ge(!1);
      }
    })(), () => {
      j = !0;
    };
  }, [h, me, He, dt, G]), r.useEffect(() => {
    if (!(Ne != null && Ne.grading_job) || !["queued", "running", "retrying"].includes(Ne.grading_job.status)) return;
    const j = window.setTimeout(() => x((ze) => ze + 1), 1800);
    return () => clearTimeout(j);
  }, [(pt = Ne == null ? void 0 : Ne.grading_job) == null ? void 0 : pt.status, G]);
  const ce = async (j) => {
    xt(!0), v(""), f("");
    try {
      await j();
    } catch (ze) {
      v(ze.message);
    } finally {
      xt(!1);
    }
  }, qe = !!pe && !!X && JSON.stringify(X) === JSON.stringify(pe.content), vt = () => ({ revision_id: pe.revision_id, row_version: pe.row_version, reason: y, evidence_checked: ee }), Rt = (j) => void ce(async () => {
    await u(j === "submit" ? `/training/questions/${Q}/submit-review` : `/reviews/${pe.revision_id}/${j}`, { method: "POST", body: JSON.stringify(vt()) }), f("题目审核状态已保存到统一审核记录。"), x((ze) => ze + 1);
  }), Et = async (j) => {
    const ze = Te[j.revision_id] || Lf, Ae = await u(`/training/attempts/${V}/answers/${j.question_id}`, { method: "PUT", body: JSON.stringify(ze) });
    return De((at) => ({ ...at, [j.revision_id]: { ...ze, row_version: Ae.row_version } })), Ae;
  }, rt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ve.length, onClick: () => {
        L(Ve.at(-1) || ""), _(Ve.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !fe, onClick: () => {
        _([...Ve, dt]), L(fe || "");
      }, children: "下一页" })
    ] })
  ] }), St = (j, ze, Ae) => Ae ? [...j, ze] : j.filter((at) => at !== ze), b = (j) => void ce(async () => {
    const ze = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: j.id, grading_mode: We }) });
    S("/learn/attempts/" + ze.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx($i, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: R ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    z && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      z
    ] }),
    ue && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
      ue
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !R && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: p || M ? "selected" : "", onClick: () => S("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: U ? "selected" : "", onClick: () => S("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || B ? "selected" : "", onClick: () => S("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: R ? "selected" : "", onClick: () => S("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => x((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    be ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : Ne ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: ks[Ne.result_state] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "training-score", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              "教员确认总分",
              /* @__PURE__ */ s.jsx("strong", { children: Ne.confirmed_total === null ? "待确认" : Ne.confirmed_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "含建议的参考总分",
              /* @__PURE__ */ s.jsx("strong", { children: Ne.provisional_total === null ? "待评分" : Ne.provisional_total })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              "满分",
              /* @__PURE__ */ s.jsx("strong", { children: Ne.max_score })
            ] })
          ] }),
          Ne.grading_job && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "后台建议评分：",
              Ne.grading_job.status === "failed" ? "暂未完成" : Ne.grading_job.status === "succeeded" ? "已完成，仍需人工确认" : "处理中，可稍后回来查看"
            ] }),
            Ne.grading_job.error && /* @__PURE__ */ s.jsx("p", { children: Ne.grading_job.error }),
            B && k && Ne.grading_job.status === "failed" && Ne.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void ce(async () => {
              await u("/jobs/" + Ne.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: Ne.grading_job.row_version }) }), x((j) => j + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          Ne.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: Ne.restriction_note }),
          Ne.answers.map((j, ze) => {
            var Ae, at, Xt, Cs, Us, qt, Ea, Oa;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                ze + 1,
                "题 ",
                j.type ? _a[j.type] : ""
              ] }),
              j.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: j.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((Ae = j.answer) == null ? void 0 : Ae.text) || ((at = j.answer) == null ? void 0 : at.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Xt = j.reference_answer) == null ? void 0 : Xt.text) || ((Us = (Cs = j.reference_answer) == null ? void 0 : Cs.selected) == null ? void 0 : Us.join("、"))
                ] }),
                (qt = j.rubric) == null ? void 0 : qt.map((It, Ps) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  It.point,
                  " · ",
                  It.points,
                  "分"
                ] }, Ps)),
                /* @__PURE__ */ s.jsx("p", { children: (Ea = j.feedback) == null ? void 0 : Ea.message }),
                ((Oa = j.feedback) == null ? void 0 : Oa.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
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
              B && k && j.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: E[j.id] ?? String(j.confirmed_score ?? j.suggested_score ?? ""), onChange: (It) => w({ ...E, [j.id]: It.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: W[j.id] || "", onChange: (It) => ve({ ...W, [j.id]: It.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe || !(W[j.id] || "").trim() || (E[j.id] ?? String(j.confirmed_score ?? j.suggested_score ?? "")) === "", onClick: () => void ce(async () => {
                  await u("/training/answers/" + j.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: j.row_version, score: Number(E[j.id] ?? j.confirmed_score ?? j.suggested_score), reason: W[j.id] }) }), f("人工确认分已保存，原建议分和复核轨迹保留。"), x((It) => It + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, j.id);
          })
        ] })
      ] }),
      !B && Ne.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: Ze, onChange: (j) => he(j.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: et, onChange: (j) => Ue(j.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void ce(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: Ze, comment: et }) }), f("学习反馈已保存。");
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
      Pe.questions.map((j) => {
        const ze = Te[j.revision_id] || Lf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            j.position,
            "题 · ",
            _a[j.type],
            " · ",
            j.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: j.stem }),
          j.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + j.position + "题回答", value: ze.text, onChange: (Ae) => De({ ...Te, [j.revision_id]: { ...ze, text: Ae.target.value } }) })
          ] }) : j.options.map((Ae) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: j.type === "single_choice" ? "radio" : "checkbox", name: j.revision_id, checked: ze.selected.includes(Ae.id), onChange: (at) => De({ ...Te, [j.revision_id]: { ...ze, selected: j.type === "single_choice" ? [Ae.id] : St(ze.selected, Ae.id, at.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              Ae.id.toUpperCase(),
              " · ",
              Ae.text
            ] })
          ] }, Ae.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void ce(async () => {
              await Et(j), f("第" + j.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              ze.row_version
            ] })
          ] })
        ] }, j.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe, onClick: () => void ce(async () => {
        for (const j of Pe.questions) await Et(j);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), x((j) => j + 1), f("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : M && pe && X ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            _a[pe.type],
            " · v",
            pe.version,
            " · ",
            ks[pe.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: pe.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: X.stem, disabled: !k, onChange: (j) => de({ ...X, stem: j.target.value }) })
          ] }),
          X.options.map((j, ze) => {
            var Ae;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              j.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: j.text, disabled: !k, onChange: (at) => de({ ...X, options: X.options.map((Xt, Cs) => Cs === ze ? { ...Xt, text: at.target.value } : Xt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((Ae = X.answer.selected) == null ? void 0 : Ae.includes(j.id)) || !1, onChange: (at) => de({ ...X, answer: { selected: St(X.answer.selected || [], j.id, at.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, j.id);
          }),
          pe.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: X.answer.text || "", disabled: !k, onChange: (j) => de({ ...X, answer: { text: j.target.value } }) })
            ] }),
            X.rubric.map((j, ze) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: j.point, disabled: !k, onChange: (Ae) => de({ ...X, rubric: X.rubric.map((at, Xt) => Xt === ze ? { ...at, point: Ae.target.value } : at) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: j.keywords.join("，"), disabled: !k, onChange: (Ae) => de({ ...X, rubric: X.rubric.map((at, Xt) => Xt === ze ? { ...at, keywords: Ae.target.value.split(/[,，]/).filter(Boolean) } : at) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: j.points, disabled: !k, onChange: (Ae) => de({ ...X, rubric: X.rubric.map((at, Xt) => Xt === ze ? { ...at, points: Number(Ae.target.value) } : at) }) })
              ] })
            ] }, ze))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          pe.source_versions.map((j) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: j }) }, j)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: y, onChange: (j) => Y(j.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe || qe || !y.trim(), onClick: () => void ce(async () => {
              await u(`/training/questions/${Q}/draft`, { method: "PATCH", body: JSON.stringify({ ...vt(), content: X }) }), f("新题目版本已保存，不改变旧学习包与成绩。"), x((j) => j + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(pe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !qe || !y.trim(), onClick: () => Rt("submit"), children: "提交题目审核" })
          ] }),
          le && pe.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ee, onChange: (j) => ke(j.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !ee || !qe || !y.trim(), onClick: () => Rt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Qe || !qe || !y.trim(), onClick: () => Rt("request-changes"), children: "退回修改" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "版本与审核记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          pe.revisions.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            j.version,
            " · ",
            ks[j.state]
          ] }, j.id)),
          pe.review_actions.map((j, ze) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            j.version,
            " · ",
            ks[j.action] || j.action,
            " · ",
            j.reason
          ] }, ze))
        ] })
      ] })
    ] }) : R ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: We, onChange: (j) => Fe(j.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Tt && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
            ] })
          ] }),
          D.length ? D.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
            /* @__PURE__ */ s.jsx("h3", { children: j.title }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "固定版本 v",
              j.version,
              " · ",
              j.question_count,
              "题"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe, onClick: () => b(j), children: "开始本次练习" })
          ] }, j.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Xe.map((j) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => S("/learn/attempts/" + j.id), children: [
            ks[j.state],
            " · ",
            ks[j.result_state],
            " · ",
            new Date(j.started_at).toLocaleString("zh-CN")
          ] }) }, j.id)),
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
        /* @__PURE__ */ s.jsx("tbody", { children: Xe.map((j) => {
          var ze;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              j.title,
              " · v",
              j.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (ze = j.learner_id) == null ? void 0 : ze.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              ks[j.state],
              " · ",
              ks[j.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: j.state !== "submitted", onClick: () => S("/training/results/" + j.id), children: "查看结果与复核" }) })
          ] }, j.id);
        }) })
      ] }) }),
      rt
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
              /* @__PURE__ */ s.jsx("select", { value: me, onChange: (j) => {
                I(j.target.value), Z([]);
              }, children: d.filter((j) => At(j, "training.manage")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: ye, onChange: (j) => Ee(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: P, onChange: (j) => Ce(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: ie, onChange: (j) => Se(j.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: st, onChange: (j) => lt(Number(j.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: oe.filter((j) => j.project_id === me).map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ae.includes(j.revision_id), onChange: (ze) => Z((Ae) => St(Ae, j.revision_id, ze.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              _a[j.type],
              " · ",
              j.title,
              " · v",
              j.version
            ] })
          ] }, j.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Qe || !ae.length || ae.length > 30 || !P.trim(), onClick: () => void ce(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: P, package_key: ie, version: st, project_id: me, question_revision_ids: ae, role_scope: ["learner", "admin", "teacher"], audience_subjects: ye.split(/[,，\n]/).map((j) => j.trim()).filter(Boolean) }) }), f("学习包草稿已建立，发布后学员可使用。"), x((j) => j + 1);
          }), children: [
            "创建学习包草稿（",
            ae.length,
            "题）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "学习包版本" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: D.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            j.title,
            " · v",
            j.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            ks[j.state],
            " · ",
            j.question_count,
            "题 · ",
            j.package_key
          ] }),
          j.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Qe, onClick: () => void ce(async () => {
            await u(`/training/packages/${j.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: j.row_version, reason: "发布已审核题目的固定版本学习包" }) }), f("学习包已发布。"), x((ze) => ze + 1);
          }), children: "发布此学习包版本" })
        ] }, j.id)) }),
        rt
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
            /* @__PURE__ */ s.jsx("select", { value: me, onChange: (j) => {
              I(j.target.value), H([]);
            }, children: d.filter((j) => At(j, "training.manage")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Re.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: m.includes(j.revision_id), onChange: (ze) => H((Ae) => St(Ae, j.revision_id, ze.target.checked)) }),
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
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(_a).map(([j, ze]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te.includes(j), onChange: (Ae) => $((at) => St(at, j, Ae.target.checked)) }),
            ze
          ] }, j)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: xe, onChange: (j) => _e(j.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Qe || !m.length || m.length > 10 || !te.length, onClick: () => void ce(async () => {
            const j = await em(u, "/training/generation-jobs", { knowledge_revision_ids: m, types: te, generation_mode: xe }, () => f("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            f("已生成或复用" + j.items.length + "道候选题，仍需核查答案与来源后提交审核。"), x((ze) => ze + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: He, onChange: (j) => {
            tt(j.target.value), L(""), _([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: ks[j] }, j))
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
            /* @__PURE__ */ s.jsx("td", { children: _a[j.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version,
              " · ",
              ks[j.state],
              j.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/training/questions/" + j.id), children: "核查与审核" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "暂无当前范围题目" }),
          /* @__PURE__ */ s.jsx("p", { children: "从已发布的固定知识版本开始。" })
        ] }),
        rt
      ] })
    ] })
  ] });
}
function Rv({ api: u }) {
  var Ee, me;
  const [h, S] = r.useState(null), [d, R] = r.useState([]), [B, V] = r.useState("openai"), [M, Q] = r.useState(""), [p, U] = r.useState(!1), [K, k] = r.useState(""), [le, xe] = r.useState("");
  r.useEffect(() => {
    let I = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([oe, ne]) => {
      if (I) return;
      R(ne.items);
      const D = ne.items.find((je) => je.base_url === oe.base_url);
      if (!oe.model && !oe.api_key_configured) {
        const je = ne.items[0];
        V(je.id), S({ ...oe, base_url: je.base_url, model: je.default_model });
      } else
        V((D == null ? void 0 : D.id) || "custom"), S(oe);
    }).catch((oe) => {
      I || k(oe.message);
    }), () => {
      I = !0;
    };
  }, []);
  const _e = (I) => {
    const oe = d.find((ne) => ne.id === I);
    V(I), Q(""), xe(""), k(""), h && S({ ...h, base_url: (oe == null ? void 0 : oe.base_url) || "", model: (oe == null ? void 0 : oe.default_model) || "", api_key_configured: !1 });
  }, ye = async () => {
    if (h) {
      U(!0), k(""), xe("");
      try {
        const { api_key_configured: I, ...oe } = h, ne = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !0, ...M ? { api_key: M } : {} }) });
        if (S(ne), Q(""), xe("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        xe("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (I) {
        xe(""), k(I.message);
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
      le && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: le }),
      h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "模型服务",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: p, value: B, onChange: (I) => _e(I.target.value), children: [
            d.map((I) => /* @__PURE__ */ s.jsx("option", { value: I.id, children: I.name }, I.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        B === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "服务地址",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型服务地址", disabled: p, value: h.base_url, onChange: (I) => S({ ...h, base_url: I.target.value, api_key_configured: !1 }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "模型名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "模型名称", disabled: p, value: h.model, onChange: (I) => S({ ...h, model: I.target.value }) })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("label", { children: [
          "模型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型名称", disabled: p, value: h.model, onChange: (I) => S({ ...h, model: I.target.value }), children: [
            !((Ee = d.find((I) => I.id === B)) != null && Ee.models.some((I) => I.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (me = d.find((I) => I.id === B)) == null ? void 0 : me.models.map((I) => /* @__PURE__ */ s.jsx("option", { value: I.id, children: I.name }, I.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: p, value: M, onChange: (I) => Q(I.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "高级设置" }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "请求超时（秒）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型超时", type: "number", min: 5, max: 180, value: h.timeout_seconds, onChange: (I) => S({ ...h, timeout_seconds: Number(I.target.value) }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "最大输出 token",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "模型输出限制", type: "number", min: 256, max: 16e3, value: h.max_tokens, onChange: (I) => S({ ...h, max_tokens: Number(I.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "服务地址：",
            h.base_url
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: p || !h.model || !M.trim() && !h.api_key_configured, onClick: () => void ye(), children: p ? "正在保存并测试…" : "保存并测试" }),
          h.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: p, onClick: () => {
            U(!0), k("");
            const { api_key_configured: I, ...oe } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...oe, enabled: !1 }) }).then((ne) => {
              S(ne), xe("云端调用已停用。");
            }).catch((ne) => k(ne.message)).finally(() => U(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Uv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Dv({ api: u, path: h, navigate: S, projects: d, identity: R, canManageModels: B }) {
  var te, $, ae;
  const V = h === "/settings/models", M = B, Q = d.some((Z) => Z.can_run), [p, U] = r.useState(((te = d.find((Z) => Z.can_run)) == null ? void 0 : te.id) || ""), [K, k] = r.useState([]), [le, xe] = r.useState([]), [_e, ye] = r.useState(null), [Ee, me] = r.useState(Uv), [I, oe] = r.useState("llm"), [ne, D] = r.useState(sessionStorage.getItem("b07-extraction-" + R) || ""), [je, Re] = r.useState(null), [Be, Xe] = r.useState(!1), [Ge, pe] = r.useState(!0), [Ke, X] = r.useState(""), [de, y] = r.useState(""), [Y, ee] = r.useState(0), ke = async (Z) => {
    Xe(!0), X(""), y("");
    try {
      await Z();
    } catch (P) {
      X(P.message);
    } finally {
      Xe(!1);
    }
  };
  r.useEffect(() => {
    let Z = !1;
    return pe(!0), X(""), xe([]), (async () => {
      var Ce;
      try {
        if (V) {
          if (!M) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!Q || !p) throw new Error("当前身份没有知识加工权限。");
          const [ie, Se] = await Promise.all([u(`/knowledge/source-options?project_id=${p}&limit=100`), u(`/knowledge/taxonomies?project_id=${p}`)]);
          Z || (k(ie.items), ye(Se.items[0] || null), me(structuredClone(((Ce = Se.items[0]) == null ? void 0 : Ce.categories) || Se.suggested_categories)));
        }
      } catch (ie) {
        Z || X(ie.message);
      } finally {
        Z || pe(!1);
      }
    })(), () => {
      Z = !0;
    };
  }, [h, p, Y]), r.useEffect(() => {
    if (!ne || V) return;
    let Z = !1, P;
    const Ce = async () => {
      try {
        const ie = await u("/knowledge/extraction-jobs/" + ne);
        if (Z) return;
        Re(ie), ["queued", "running", "retrying"].includes(ie.status) && (P = window.setTimeout(() => void Ce(), 1800));
      } catch (ie) {
        Z || X(ie.message);
      }
    };
    return Ce(), () => {
      Z = !0, window.clearTimeout(P);
    };
  }, [ne, h, Y]);
  const m = (Z, P) => me((Ce) => Ce.map((ie, Se) => Se === Z ? { ...ie, ...P } : ie)), H = JSON.stringify(Ee) !== JSON.stringify((_e == null ? void 0 : _e.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Sl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    Ke && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
      Ke
    ] }),
    de && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: de }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: V ? "" : "selected", onClick: () => S("/extraction"), children: "施工要点萃取" }),
        M && /* @__PURE__ */ s.jsx("button", { className: V ? "selected" : "", onClick: () => S("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => S("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => ee((Z) => Z + 1), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Ge ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && M ? /* @__PURE__ */ s.jsx(Rv, { api: u }) : !V && Q ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "分类与施工关注点" }),
          /* @__PURE__ */ s.jsx("span", { children: "每次保存形成新版本，不改变已提交任务的分类" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "萃取项目", value: p, onChange: (Z) => U(Z.target.value), children: d.filter((Z) => Z.can_run).map((Z) => /* @__PURE__ */ s.jsx("option", { value: Z.id, children: Z.name }, Z.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "small-note", children: [
            "当前",
            _e ? "分类 v" + _e.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Ee.map((Z, P) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (P + 1), value: Z.code, onChange: (Ce) => m(P, { code: Ce.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (P + 1), value: Z.name, onChange: (Ce) => m(P, { name: Ce.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Z.focus, onChange: (Ce) => m(P, { focus: Ce.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Z.keywords.join("，"), onChange: (Ce) => m(P, { keywords: Ce.target.value.split(/[,，]/).map((ie) => ie.trim()).filter(Boolean) }) })
            ] }),
            Ee.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => me((Ce) => Ce.filter((ie, Se) => Se !== P)), children: "移除此类别" })
          ] }, P)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Ee.length >= 100, onClick: () => me([...Ee, { code: "category_" + (Ee.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(av, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be || !H, onClick: () => void ke(async () => {
              const Z = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: p, expected_version: (_e == null ? void 0 : _e.version) || 0, categories: Ee }) });
              ye(Z), me(Z.categories), y("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => xe(K.slice(0, 20).map((Z) => Z.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((Z) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le.includes(Z.record_version_id), onChange: (P) => xe((Ce) => P.target.checked ? [...Ce, Z.record_version_id] : Ce.filter((ie) => ie !== Z.record_version_id)) }),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: I, onChange: (Z) => oe(Z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Be || !_e || H || !le.length || le.length > 20, onClick: () => void ke(async () => {
            const Z = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: le, taxonomy_id: _e.id, mode: I }) });
            D(Z.job_id), sessionStorage.setItem("b07-extraction-" + R, Z.job_id), y("后台加工已提交，完成后生成有来源的施工要点候选。");
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
          ($ = je.result.items) == null ? void 0 : $.map((Z) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => S("/knowledge/" + Z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Z.item_id)),
          (ae = je.result.missing_information) == null ? void 0 : ae.map((Z, P) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Z
          ] }, P)),
          je.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void ke(async () => {
            await u("/jobs/" + je.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: je.row_version }) }), ee((Z) => Z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const vu = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, Yf = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Gf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, Xi = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Mv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function qv({ embedded: u = !1 }) {
  var G;
  const [h, S] = r.useState(localStorage.getItem("b01-identity") || "admin"), [d, R] = r.useState(Yi()), [B, V] = r.useState(!1), M = d === "/platform/services", Q = d.startsWith("/archive-review/"), p = /^\/imports\/ai_[a-f0-9]{32}$/.test(d), [U, K] = r.useState(["/sources", "/imports", "/records"].some((x) => Yi().startsWith(x))), k = ["/search", "/releases", "/knowledge/library"].includes(d) || /^\/knowledge\/[^/]+$/.test(d) && d !== "/knowledge/drafts", le = !k && ["/quality", "/knowledge", "/reviews"].some((x) => d.startsWith(x)), xe = d.startsWith("/training") || d.startsWith("/learn"), _e = d.startsWith("/workflows"), ye = d.startsWith("/standards"), Ee = _e || ye || d.startsWith("/extraction") || d === "/settings/models" || d === "/settings/scenes", me = d.startsWith("/retrospectives"), I = d.startsWith("/task-packages"), oe = d === "/records", ne = !p && ["/sources", "/imports", "/records"].some((x) => d.startsWith(x)), [D, je] = r.useState(null), [Re, Be] = r.useState([]), [Xe, Ge] = r.useState({}), [pe, Ke] = r.useState(!1), [X, de] = r.useState(""), [y, Y] = r.useState(""), [ee, ke] = r.useState(!0), [m, H] = r.useState(!1), [te, $] = r.useState(0), [ae, Z] = r.useState(""), [P, Ce] = r.useState(""), [ie, Se] = r.useState(""), [st, lt] = r.useState(null), [Pe, Oe] = r.useState([]), [Te, De] = r.useState(null), [Ne, Le] = r.useState(!1), [We, Fe] = r.useState("demo-airport"), [Ze, he] = r.useState("success"), [et, Ue] = r.useState(null), [E, w] = r.useState(""), [W, ve] = r.useState("processor"), [He, tt] = r.useState("demo-airport"), [dt, L] = r.useState([]);
  async function fe(x, ce = {}) {
    const qe = await Mt("/api/v1" + x, {
      ...ce,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...ce.headers }
    });
    if (!qe.ok) {
      const vt = await qe.json().catch(() => ({}));
      throw new Error(vt.message || `请求失败（${qe.status}），请刷新后重试。`);
    }
    return qe.json();
  }
  const re = (x) => {
    var qe, vt;
    const ce = window;
    u && ((qe = ce.QaxcHasPendingEdits) != null && qe.call(ce)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((vt = ce.QaxcClearPendingEdits) == null || vt.call(ce), bj(x), R(Yi()), de(""), De(null), Se(""), Oe([]));
  };
  r.useEffect(() => {
    const x = () => R(Yi());
    return window.addEventListener("popstate", x), window.addEventListener("hashchange", x), () => {
      window.removeEventListener("popstate", x), window.removeEventListener("hashchange", x);
    };
  }, []), r.useEffect(() => {
    const x = () => V(!0);
    return window.addEventListener("b-session-expired", x), () => window.removeEventListener("b-session-expired", x);
  }, []), r.useEffect(() => {
    let x = !1;
    ke(!0), de(""), je(null), Ue(null), Be([]), L([]);
    async function ce() {
      try {
        const qe = await fe("/me");
        if (x) return;
        const vt = window.QaxcProjectNames || {};
        u && (qe.projects = qe.projects.map((rt) => ({ ...rt, name: vt[rt.id] || rt.name })));
        const Rt = window.QaxcProjectId;
        u && Rt && (qe.projects = qe.projects.filter((rt) => rt.id === Rt)), je(qe);
        const Et = await fe("/health");
        if (x || (Ke(Et.worker_online), p || M || Q || ne || le || k || I || me || xe || Ee)) return;
        if (d === "/settings/access") {
          if (!qe.projects.some((b) => b.can_manage)) return;
          const [rt, St] = await Promise.all([fe("/access"), fe("/audit-events?limit=10")]);
          if (x) return;
          Ue(rt), L(St.items), w((b) => {
            var we;
            return rt.users.some((nt) => nt.id === b) ? b : ((we = rt.users[0]) == null ? void 0 : we.id) || "";
          });
        } else {
          const [rt, St] = await Promise.all([
            fe(`/jobs?limit=12${P ? `&kind=${P}` : ""}${ae ? `&status=${ae}` : ""}${ie ? `&cursor=${encodeURIComponent(ie)}` : ""}`),
            fe("/dashboard")
          ]);
          if (x) return;
          Be(rt.items), lt(rt.next_cursor), Ge(St.counts);
        }
      } catch (qe) {
        x || de(qe.message);
      } finally {
        x || ke(!1);
      }
    }
    return ce(), () => {
      x = !0;
    };
  }, [h, d, ae, P, ie, te]), r.useEffect(() => {
    if (!D || p || M || Q || d === "/settings/access" || ne || le || k || I || me || xe || Ee) return;
    let x = !1;
    const ce = window.setInterval(async () => {
      try {
        const [qe, vt, Rt] = await Promise.all([
          fe(`/jobs?limit=12${P ? `&kind=${P}` : ""}${ae ? `&status=${ae}` : ""}${ie ? `&cursor=${encodeURIComponent(ie)}` : ""}`),
          fe("/dashboard"),
          fe("/health")
        ]);
        if (x) return;
        Be(qe.items), lt(qe.next_cursor), Ge(vt.counts), Ke(Rt.worker_online), De((Et) => Et ? qe.items.find((rt) => rt.id === Et.id) || Et : null), de("");
      } catch (qe) {
        x || (de(qe.message), Ke(!1));
      }
    }, 2e3);
    return () => {
      x = !0, clearInterval(ce);
    };
  }, [h, d, ae, P, ie, D == null ? void 0 : D.id]);
  const Ve = async (x) => {
    H(!0), de(""), Y("");
    try {
      await x(), $((ce) => ce + 1);
    } catch (ce) {
      de(ce.message);
    } finally {
      H(!1);
    }
  }, _ = () => Ve(async () => {
    await fe("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: We, scenario: Ze, duration_seconds: 6 })
    }), Le(!1), Y("任务已保存，处理服务会自动执行。"), re("/jobs");
  }), be = (x) => Ve(async () => {
    await fe(`/jobs/${x.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: x.row_version })
    }), Y("已提交重试，原任务和来源保持不变。");
  }), ge = (x) => Ve(async () => {
    const ce = await Mt(`/api/v1/assets/${x.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!ce.ok) {
      const Rt = await ce.json();
      throw new Error(Rt.message);
    }
    const qe = document.createElement("a"), vt = URL.createObjectURL(await ce.blob());
    qe.href = vt, qe.download = `演示检查结果-${x.id.slice(0, 8)}.txt`, qe.click(), URL.revokeObjectURL(vt), Y("演示结果已下载。");
  }), Qe = !Tt && (D == null ? void 0 : D.projects.some((x) => x.can_run)), xt = (x) => {
    const ce = D == null ? void 0 : D.projects.find((vt) => vt.id === x.project_id);
    if ((ce == null ? void 0 : ce.permissions) == null) return !!(ce != null && ce.can_run);
    const qe = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!qe[x.kind] && ce.permissions.includes(qe[x.kind]);
  }, z = D == null ? void 0 : D.projects.some((x) => x.can_manage), v = Object.fromEntries(((D == null ? void 0 : D.projects) || []).map((x) => [x.id, x.name])), ue = p ? "A 成果接入" : M ? "平台服务" : Q ? "归档成果复盘" : xe ? d.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Ee ? _e ? "隐患分析与知识成果" : ye ? "规范原文与版本" : d === "/settings/models" ? "云端模型配置" : d === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : me ? "过程复盘与经验" : I ? "归档成果与证据" : k ? d === "/releases" ? "知识发布管理" : d === "/search" ? "知识检索" : "已发布知识库" : le ? "知识加工与审核" : ne ? oe ? "风险数据" : d.startsWith("/sources") ? "历史数据来源" : d.startsWith("/imports") ? "历史项目" : "风险数据" : d === "/settings/access" ? "成员与权限" : d === "/jobs" ? "处理任务" : "我的工作台", f = (Xe.queued || 0) + (Xe.running || 0) + (Xe.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(Af, { size: 26 }) }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          "工程风险",
          /* @__PURE__ */ s.jsx("span", { children: "知识与复盘培训中心" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "workspace-label", children: Tt ? "质量安全小察 / 知识与学习" : "B模块 / 开发工作区" }),
      /* @__PURE__ */ s.jsxs("nav", { "aria-label": "主导航", children: [
        Tt && /* @__PURE__ */ s.jsxs("button", { className: "nav-item", onClick: () => {
          window.location.href = "/quality/";
        }, children: [
          /* @__PURE__ */ s.jsx(Of, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", Of, "我的工作台"], ["/jobs", Qj, "处理任务"]].map(([x, ce, qe]) => {
          const vt = ce;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(qe), className: d === x || x === "/workbench" && d === "/" ? "nav-item active" : "nav-item", onClick: () => re(String(x)), children: [
            /* @__PURE__ */ s.jsx(vt, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(qe) }),
            /* @__PURE__ */ s.jsx(Ws, { size: 15 })
          ] }, String(x));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ne ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": U, "aria-controls": "governance-menu", onClick: () => K((x) => !x), children: [
          /* @__PURE__ */ s.jsx(Gi, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(Ws, { className: U ? "expanded" : "", size: 15 })
        ] }),
        U && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([x, ce]) => /* @__PURE__ */ s.jsx("button", { "aria-label": ce, className: d.startsWith(x) ? "active" : "", onClick: () => re(x), children: ce }, x)) }),
        /* @__PURE__ */ s.jsxs("button", { className: le || Ee ? "nav-item active" : "nav-item", onClick: () => re("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => re("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: I ? "nav-item active" : "nav-item", onClick: () => re("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(En, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: me ? "nav-item active" : "nav-item", onClick: () => re("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(wf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: xe ? "nav-item active" : "nav-item", onClick: () => re(D != null && D.projects.some((x) => x.roles.some((ce) => ["admin", "teacher", "reviewer"].includes(ce))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx($i, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] }),
        !Tt && /* @__PURE__ */ s.jsxs("button", { className: d === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => re("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(ov, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(Ws, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(Gi, { size: 19 }),
        /* @__PURE__ */ s.jsx("strong", { children: "项目范围隔离" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "记录、文件和操作权限",
          /* @__PURE__ */ s.jsx("br", {}),
          "随当前身份实时检查。"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "sidebar-bottom", children: [
        /* @__PURE__ */ s.jsx("span", { className: "dot" }),
        Tt ? "平台账号 · 项目授权" : "本地开发 · B07",
        /* @__PURE__ */ s.jsx("span", { className: "version", children: "v0.7" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: u ? "main-shell embedded-main" : "main-shell", children: [
      !u && /* @__PURE__ */ s.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "breadcrumb", children: [
          "工程风险知识中心 ",
          /* @__PURE__ */ s.jsx(Ws, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: ue })
        ] }),
        Tt ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (x) => {
            localStorage.setItem("b01-identity", x.target.value), S(x.target.value), De(null), Se(""), Oe([]), Y("");
          }, children: Mv.map(([x, ce]) => /* @__PURE__ */ s.jsx("option", { value: x, children: ce }, x)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !p && !k && !M && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ne ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : xe ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : le || Ee ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : I ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([x, ce]) => /* @__PURE__ */ s.jsx("button", { className: d === x ? "button primary" : "button ghost", onClick: () => re(x), children: ce }, x)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: ue }),
            /* @__PURE__ */ s.jsx("p", { children: p ? "指定版本接入、证据校验与过程复盘。" : xe ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : _e ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : ye ? "保存规范原文与适用版本，核对来源后审核发布。" : Ee ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : me ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : I ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : le ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ne ? oe ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : d === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => $((x) => x + 1), disabled: ee, children: [
              /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
              "刷新"
            ] }),
            !Tt && !ne && !le && !k && !I && !me && !xe && !Ee && d !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Qe || m, onClick: () => {
              var x;
              Fe(((x = D == null ? void 0 : D.projects.find((ce) => ce.can_run)) == null ? void 0 : x.id) || "demo-airport"), Le(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(zf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Tt && !ne && !le && !k && !I && !me && !xe && !Ee && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(Af, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        B && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        X && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(Nl, { size: 18 }),
          X,
          /* @__PURE__ */ s.jsx("button", { onClick: () => $((x) => x + 1), children: "重新加载" })
        ] }),
        y && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Sl, { size: 18 }),
          y,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Y(""), children: /* @__PURE__ */ s.jsx(Zi, { size: 16 }) })
        ] }),
        B ? null : p ? D ? /* @__PURE__ */ s.jsx(Cj, { id: d.split("/").pop(), identity: D.id, projects: D.projects, navigate: re }) : /* @__PURE__ */ s.jsx("p", { children: X || "正在读取身份…" }) : ee ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Tf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : X ? null : M ? /* @__PURE__ */ s.jsx(Ej, { navigate: re }, te) : Q ? /* @__PURE__ */ s.jsx(Oj, { deliveryId: decodeURIComponent(d.split("/")[2]), navigate: re }, d) : xe ? /* @__PURE__ */ s.jsx(Av, { api: fe, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [] }, h) : _e ? /* @__PURE__ */ s.jsx(kj, { api: fe, projects: (D == null ? void 0 : D.projects) || [], identity: h }, h + ":" + (D == null ? void 0 : D.projects.map((x) => x.id).join(","))) : ye ? /* @__PURE__ */ s.jsx(_j, { api: fe, projects: (D == null ? void 0 : D.projects) || [], identity: h }, h + ":" + (D == null ? void 0 : D.projects.map((x) => x.id).join(","))) : d === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(gj, { api: fe, projects: (D == null ? void 0 : D.projects) || [] }) }) : Ee ? /* @__PURE__ */ s.jsx(Dv, { api: fe, identity: h, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [], canManageModels: !!(D != null && D.can_manage_models) }, h) : me ? /* @__PURE__ */ s.jsx(zv, { api: fe, identity: h, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [] }, h) : I ? /* @__PURE__ */ s.jsx(Ev, { identity: h, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(Nv, { identity: h, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [] }, h) : le ? /* @__PURE__ */ s.jsx(bv, { api: fe, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [], identity: h }, h) : oe ? /* @__PURE__ */ s.jsx(gv, { api: fe }, h) : ne ? /* @__PURE__ */ s.jsx(mv, { api: fe, path: d, navigate: re, projects: (D == null ? void 0 : D.projects) || [], identity: h }, h) : d === "/settings/access" ? z ? et && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                et.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: et.bindings.map((x) => {
                var ce;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (ce = et.users.find((qe) => qe.id === x.user_id)) == null ? void 0 : ce.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: v[x.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Yf[x.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: x.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: m,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Ve(async () => {
                          await fe(`/role-bindings/${x.id}`, { method: "DELETE", body: JSON.stringify({ row_version: x.row_version }) }), Y("角色已撤销。");
                        });
                      },
                      children: "撤销"
                    }
                  ) })
                ] }, x.id);
              }) })
            ] }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsx(Gi, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: E, onChange: (x) => w(x.target.value), children: et.users.map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: He, onChange: (x) => tt(x.target.value), children: et.projects.map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: W, onChange: (x) => ve(x.target.value), children: Object.entries(Yf).filter(([x]) => x !== "admin" && x !== "a_service").map(([x, ce]) => /* @__PURE__ */ s.jsx("option", { value: x, children: ce }, x)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !E, onClick: () => void Ve(async () => {
              await fe("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: E, project_id: He, role: W }) }), Y("角色已添加。");
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
            dt.length ? dt.map((x) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[x.action] || x.action }),
              /* @__PURE__ */ s.jsx("span", { children: v[x.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: Xi(x.created_at) })
            ] }, x.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(Gi, { size: 38 }),
          /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有管理权限" }),
          /* @__PURE__ */ s.jsx("p", { children: "可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。" })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("section", { className: "metrics", "aria-label": "任务概况", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "处理中" }),
              /* @__PURE__ */ s.jsx("strong", { children: f }),
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
                /* @__PURE__ */ s.jsx("i", { className: `dot ${pe ? "green" : "orange"}` }),
                pe ? "在线" : "未连接"
              ] }),
              /* @__PURE__ */ s.jsx("small", { children: pe ? "可自动执行已提交任务" : "任务会保留，等待服务恢复" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel jobs-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { children: d === "/jobs" ? "任务列表" : "最近处理任务" }),
                /* @__PURE__ */ s.jsx("span", { children: "仅展示当前身份可访问的项目" })
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: P, onChange: (x) => {
                Ce(x.target.value), Se(""), Oe([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Gf).map(([x, ce]) => /* @__PURE__ */ s.jsx("option", { value: x, children: ce }, x))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ae, onChange: (x) => {
                Z(x.target.value), Se(""), Oe([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(vu).map(([x, ce]) => /* @__PURE__ */ s.jsx("option", { value: x, children: ce }, x))
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
              /* @__PURE__ */ s.jsx("tbody", { children: Re.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
                /* @__PURE__ */ s.jsxs("td", { children: [
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => De(x), children: x.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    v[x.project_id] || x.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Gf[x.kind] || x.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${x.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  vu[x.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${x.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    x.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: Xi(x.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  x.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => re("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => De(x), children: "详情" }),
                  x.status === "failed" && xt(x) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m, onClick: () => void be(x), children: "重试任务" }),
                  x.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: m, onClick: () => void ge(x), children: /* @__PURE__ */ s.jsx(Cf, { size: 17 }) })
                ] }) })
              ] }, x.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(En, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ae ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ae ? "切换筛选条件查看其他任务。" : Qe ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Qe && !ae && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => Le(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(_l, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Re.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !Pe.length, onClick: () => {
                  Se(Pe[Pe.length - 1]), Oe(Pe.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !st, onClick: () => {
                  Oe([...Pe, ie]), Se(st || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          d !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(wf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => re("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(_l, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Tt ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    Ne && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => Le(!1), children: /* @__PURE__ */ s.jsx(Zi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: We, onChange: (x) => Fe(x.target.value), children: D == null ? void 0 : D.projects.filter((x) => x.can_run).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: Ze, onChange: (x) => he(x.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !pe && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Le(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !Qe, onClick: () => void _(), children: [
          m ? /* @__PURE__ */ s.jsx(Tf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(zf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Te && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => De(null), children: /* @__PURE__ */ s.jsx(Zi, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Te.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        vu[Te.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Te.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: v[Te.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Te.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: Xi(Te.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: Xi(Te.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Te.id })
      ] }),
      Te.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Te.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Te.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void ge(Te), children: [
        /* @__PURE__ */ s.jsx(Cf, { size: 16 }),
        "下载演示结果"
      ] }),
      (G = Te.result_links) == null ? void 0 : G.map((x) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => re(x.path), children: x.label }, x.path)),
      Te.status === "failed" && xt(Te) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void be(Te), children: [
        /* @__PURE__ */ s.jsx(Rs, { size: 16 }),
        "重试任务"
      ] })
    ] }) })
  ] });
}
function Hv(u) {
  const h = pj.createRoot(u);
  return h.render(/* @__PURE__ */ s.jsx(qv, { embedded: !0 })), () => h.unmount();
}
export {
  Hv as mountKnowledge
};
