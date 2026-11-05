var fu = { exports: {} }, Un = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xf;
function xj() {
  if (xf) return Un;
  xf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function _(o, z, D) {
    var V = null;
    if (D !== void 0 && (V = "" + D), z.key !== void 0 && (V = "" + z.key), "key" in z) {
      D = {};
      for (var R in z)
        R !== "key" && (D[R] = z[R]);
    } else D = z;
    return z = D.ref, {
      $$typeof: u,
      type: o,
      key: V,
      ref: z !== void 0 ? z : null,
      props: D
    };
  }
  return Un.Fragment = h, Un.jsx = _, Un.jsxs = _, Un;
}
var jf;
function jj() {
  return jf || (jf = 1, fu.exports = xj()), fu.exports;
}
var s = jj(), mu = { exports: {} }, Mn = {}, xu = { exports: {} }, ju = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vf;
function vj() {
  return vf || (vf = 1, (function(u) {
    function h(y, Q) {
      var le = y.length;
      y.push(Q);
      e: for (; 0 < le; ) {
        var Ce = le - 1 >>> 1, m = y[Ce];
        if (0 < z(m, Q))
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
          var I = 2 * (Ce + 1) - 1, ae = y[I], ie = I + 1, Z = y[ie];
          if (0 > z(ae, le))
            ie < m && 0 > z(Z, ae) ? (y[Ce] = Z, y[ie] = le, Ce = ie) : (y[Ce] = ae, y[I] = le, Ce = I);
          else if (ie < m && 0 > z(Z, le))
            y[Ce] = Z, y[ie] = le, Ce = ie;
          else break e;
        }
      }
      return Q;
    }
    function z(y, Q) {
      var le = y.sortIndex - Q.sortIndex;
      return le !== 0 ? le : y.id - Q.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var D = performance;
      u.unstable_now = function() {
        return D.now();
      };
    } else {
      var V = Date, R = V.now();
      u.unstable_now = function() {
        return V.now() - R;
      };
    }
    var Y = [], v = [], M = 1, K = null, k = 3, se = !1, me = !1, ye = !1, _e = !1, Ee = typeof setTimeout == "function" ? setTimeout : null, he = typeof clearTimeout == "function" ? clearTimeout : null, F = typeof setImmediate < "u" ? setImmediate : null;
    function ue(y) {
      for (var Q = _(v); Q !== null; ) {
        if (Q.callback === null) o(v);
        else if (Q.startTime <= y)
          o(v), Q.sortIndex = Q.expirationTime, h(Y, Q);
        else break;
        Q = _(v);
      }
    }
    function ne(y) {
      if (ye = !1, ue(y), !me)
        if (_(Y) !== null)
          me = !0, H || (H = !0, pe());
        else {
          var Q = _(v);
          Q !== null && oe(ne, Q.startTime - y);
        }
    }
    var H = !1, je = -1, Re = 5, Be = -1;
    function Qe() {
      return _e ? !0 : !(u.unstable_now() - Be < Re);
    }
    function Le() {
      if (_e = !1, H) {
        var y = u.unstable_now();
        Be = y;
        var Q = !0;
        try {
          e: {
            me = !1, ye && (ye = !1, he(je), je = -1), se = !0;
            var le = k;
            try {
              t: {
                for (ue(y), K = _(Y); K !== null && !(K.expirationTime > y && Qe()); ) {
                  var Ce = K.callback;
                  if (typeof Ce == "function") {
                    K.callback = null, k = K.priorityLevel;
                    var m = Ce(
                      K.expirationTime <= y
                    );
                    if (y = u.unstable_now(), typeof m == "function") {
                      K.callback = m, ue(y), Q = !0;
                      break t;
                    }
                    K === _(Y) && o(Y), ue(y);
                  } else o(Y);
                  K = _(Y);
                }
                if (K !== null) Q = !0;
                else {
                  var B = _(v);
                  B !== null && oe(
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
          Q ? pe() : H = !1;
        }
      }
    }
    var pe;
    if (typeof F == "function")
      pe = function() {
        F(Le);
      };
    else if (typeof MessageChannel < "u") {
      var We = new MessageChannel(), X = We.port2;
      We.port1.onmessage = Le, pe = function() {
        X.postMessage(null);
      };
    } else
      pe = function() {
        Ee(Le, 0);
      };
    function oe(y, Q) {
      je = Ee(function() {
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
      }, le > Ce ? (y.sortIndex = le, h(v, y), _(Y) === null && y === _(v) && (ye ? (he(je), je = -1) : ye = !0, oe(ne, le - Ce))) : (y.sortIndex = m, h(Y, y), me || se || (me = !0, H || (H = !0, pe()))), y;
    }, u.unstable_shouldYield = Qe, u.unstable_wrapCallback = function(y) {
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
  })(ju)), ju;
}
var pf;
function pj() {
  return pf || (pf = 1, xu.exports = vj()), xu.exports;
}
var vu = { exports: {} }, ot = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gf;
function gj() {
  if (gf) return ot;
  gf = 1;
  var u = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), z = Symbol.for("react.profiler"), D = Symbol.for("react.consumer"), V = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), Y = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), K = Symbol.iterator;
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
  }, me = Object.assign, ye = {};
  function _e(m, B, I) {
    this.props = m, this.context = B, this.refs = ye, this.updater = I || se;
  }
  _e.prototype.isReactComponent = {}, _e.prototype.setState = function(m, B) {
    if (typeof m != "object" && typeof m != "function" && m != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, m, B, "setState");
  }, _e.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Ee() {
  }
  Ee.prototype = _e.prototype;
  function he(m, B, I) {
    this.props = m, this.context = B, this.refs = ye, this.updater = I || se;
  }
  var F = he.prototype = new Ee();
  F.constructor = he, me(F, _e.prototype), F.isPureReactComponent = !0;
  var ue = Array.isArray, ne = { H: null, A: null, T: null, S: null, V: null }, H = Object.prototype.hasOwnProperty;
  function je(m, B, I, ae, ie, Z) {
    return I = Z.ref, {
      $$typeof: u,
      type: m,
      key: B,
      ref: I !== void 0 ? I : null,
      props: Z
    };
  }
  function Re(m, B) {
    return je(
      m.type,
      B,
      void 0,
      void 0,
      void 0,
      m.props
    );
  }
  function Be(m) {
    return typeof m == "object" && m !== null && m.$$typeof === u;
  }
  function Qe(m) {
    var B = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(I) {
      return B[I];
    });
  }
  var Le = /\/+/g;
  function pe(m, B) {
    return typeof m == "object" && m !== null && m.key != null ? Qe("" + m.key) : B.toString(36);
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
  function oe(m, B, I, ae, ie) {
    var Z = typeof m;
    (Z === "undefined" || Z === "boolean") && (m = null);
    var W = !1;
    if (m === null) W = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          W = !0;
          break;
        case "object":
          switch (m.$$typeof) {
            case u:
            case h:
              W = !0;
              break;
            case M:
              return W = m._init, oe(
                W(m._payload),
                B,
                I,
                ae,
                ie
              );
          }
      }
    if (W)
      return ie = ie(m), W = ae === "" ? "." + pe(m, 0) : ae, ue(ie) ? (I = "", W != null && (I = W.replace(Le, "$&/") + "/"), oe(ie, B, I, "", function(Ae) {
        return Ae;
      })) : ie != null && (Be(ie) && (ie = Re(
        ie,
        I + (ie.key == null || m && m.key === ie.key ? "" : ("" + ie.key).replace(
          Le,
          "$&/"
        ) + "/") + W
      )), B.push(ie)), 1;
    W = 0;
    var we = ae === "" ? "." : ae + ":";
    if (ue(m))
      for (var re = 0; re < m.length; re++)
        ae = m[re], Z = we + pe(ae, re), W += oe(
          ae,
          B,
          I,
          Z,
          ie
        );
    else if (re = k(m), typeof re == "function")
      for (m = re.call(m), re = 0; !(ae = m.next()).done; )
        ae = ae.value, Z = we + pe(ae, re++), W += oe(
          ae,
          B,
          I,
          Z,
          ie
        );
    else if (Z === "object") {
      if (typeof m.then == "function")
        return oe(
          X(m),
          B,
          I,
          ae,
          ie
        );
      throw B = String(m), Error(
        "Objects are not valid as a React child (found: " + (B === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : B) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return W;
  }
  function y(m, B, I) {
    if (m == null) return m;
    var ae = [], ie = 0;
    return oe(m, ae, "", "", function(Z) {
      return B.call(I, Z, ie++);
    }), ae;
  }
  function Q(m) {
    if (m._status === -1) {
      var B = m._result;
      B = B(), B.then(
        function(I) {
          (m._status === 0 || m._status === -1) && (m._status = 1, m._result = I);
        },
        function(I) {
          (m._status === 0 || m._status === -1) && (m._status = 2, m._result = I);
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
    forEach: function(m, B, I) {
      y(
        m,
        function() {
          B.apply(this, arguments);
        },
        I
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
      if (!Be(m))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return m;
    }
  }, ot.Component = _e, ot.Fragment = _, ot.Profiler = z, ot.PureComponent = he, ot.StrictMode = o, ot.Suspense = Y, ot.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ne, ot.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(m) {
      return ne.H.useMemoCache(m);
    }
  }, ot.cache = function(m) {
    return function() {
      return m.apply(null, arguments);
    };
  }, ot.cloneElement = function(m, B, I) {
    if (m == null)
      throw Error(
        "The argument must be a React element, but you passed " + m + "."
      );
    var ae = me({}, m.props), ie = m.key, Z = void 0;
    if (B != null)
      for (W in B.ref !== void 0 && (Z = void 0), B.key !== void 0 && (ie = "" + B.key), B)
        !H.call(B, W) || W === "key" || W === "__self" || W === "__source" || W === "ref" && B.ref === void 0 || (ae[W] = B[W]);
    var W = arguments.length - 2;
    if (W === 1) ae.children = I;
    else if (1 < W) {
      for (var we = Array(W), re = 0; re < W; re++)
        we[re] = arguments[re + 2];
      ae.children = we;
    }
    return je(m.type, ie, void 0, void 0, Z, ae);
  }, ot.createContext = function(m) {
    return m = {
      $$typeof: V,
      _currentValue: m,
      _currentValue2: m,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, m.Provider = m, m.Consumer = {
      $$typeof: D,
      _context: m
    }, m;
  }, ot.createElement = function(m, B, I) {
    var ae, ie = {}, Z = null;
    if (B != null)
      for (ae in B.key !== void 0 && (Z = "" + B.key), B)
        H.call(B, ae) && ae !== "key" && ae !== "__self" && ae !== "__source" && (ie[ae] = B[ae]);
    var W = arguments.length - 2;
    if (W === 1) ie.children = I;
    else if (1 < W) {
      for (var we = Array(W), re = 0; re < W; re++)
        we[re] = arguments[re + 2];
      ie.children = we;
    }
    if (m && m.defaultProps)
      for (ae in W = m.defaultProps, W)
        ie[ae] === void 0 && (ie[ae] = W[ae]);
    return je(m, Z, void 0, void 0, null, ie);
  }, ot.createRef = function() {
    return { current: null };
  }, ot.forwardRef = function(m) {
    return { $$typeof: R, render: m };
  }, ot.isValidElement = Be, ot.lazy = function(m) {
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
    var B = ne.T, I = {};
    ne.T = I;
    try {
      var ae = m(), ie = ne.S;
      ie !== null && ie(I, ae), typeof ae == "object" && ae !== null && typeof ae.then == "function" && ae.then(Ce, le);
    } catch (Z) {
      le(Z);
    } finally {
      ne.T = B;
    }
  }, ot.unstable_useCacheRefresh = function() {
    return ne.H.useCacheRefresh();
  }, ot.use = function(m) {
    return ne.H.use(m);
  }, ot.useActionState = function(m, B, I) {
    return ne.H.useActionState(m, B, I);
  }, ot.useCallback = function(m, B) {
    return ne.H.useCallback(m, B);
  }, ot.useContext = function(m) {
    return ne.H.useContext(m);
  }, ot.useDebugValue = function() {
  }, ot.useDeferredValue = function(m, B) {
    return ne.H.useDeferredValue(m, B);
  }, ot.useEffect = function(m, B, I) {
    var ae = ne.H;
    if (typeof I == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return ae.useEffect(m, B);
  }, ot.useId = function() {
    return ne.H.useId();
  }, ot.useImperativeHandle = function(m, B, I) {
    return ne.H.useImperativeHandle(m, B, I);
  }, ot.useInsertionEffect = function(m, B) {
    return ne.H.useInsertionEffect(m, B);
  }, ot.useLayoutEffect = function(m, B) {
    return ne.H.useLayoutEffect(m, B);
  }, ot.useMemo = function(m, B) {
    return ne.H.useMemo(m, B);
  }, ot.useOptimistic = function(m, B) {
    return ne.H.useOptimistic(m, B);
  }, ot.useReducer = function(m, B, I) {
    return ne.H.useReducer(m, B, I);
  }, ot.useRef = function(m) {
    return ne.H.useRef(m);
  }, ot.useState = function(m) {
    return ne.H.useState(m);
  }, ot.useSyncExternalStore = function(m, B, I) {
    return ne.H.useSyncExternalStore(
      m,
      B,
      I
    );
  }, ot.useTransition = function() {
    return ne.H.useTransition();
  }, ot.version = "19.1.0", ot;
}
var bf;
function Du() {
  return bf || (bf = 1, vu.exports = gj()), vu.exports;
}
var pu = { exports: {} }, ns = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yf;
function bj() {
  if (yf) return ns;
  yf = 1;
  var u = Du();
  function h(Y) {
    var v = "https://react.dev/errors/" + Y;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var M = 2; M < arguments.length; M++)
        v += "&args[]=" + encodeURIComponent(arguments[M]);
    }
    return "Minified React error #" + Y + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  }, z = Symbol.for("react.portal");
  function D(Y, v, M) {
    var K = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: z,
      key: K == null ? null : "" + K,
      children: Y,
      containerInfo: v,
      implementation: M
    };
  }
  var V = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function R(Y, v) {
    if (Y === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return ns.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ns.createPortal = function(Y, v) {
    var M = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(h(299));
    return D(Y, v, null, M);
  }, ns.flushSync = function(Y) {
    var v = V.T, M = o.p;
    try {
      if (V.T = null, o.p = 2, Y) return Y();
    } finally {
      V.T = v, o.p = M, o.d.f();
    }
  }, ns.preconnect = function(Y, v) {
    typeof Y == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, o.d.C(Y, v));
  }, ns.prefetchDNS = function(Y) {
    typeof Y == "string" && o.d.D(Y);
  }, ns.preinit = function(Y, v) {
    if (typeof Y == "string" && v && typeof v.as == "string") {
      var M = v.as, K = R(M, v.crossOrigin), k = typeof v.integrity == "string" ? v.integrity : void 0, se = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      M === "style" ? o.d.S(
        Y,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: K,
          integrity: k,
          fetchPriority: se
        }
      ) : M === "script" && o.d.X(Y, {
        crossOrigin: K,
        integrity: k,
        fetchPriority: se,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, ns.preinitModule = function(Y, v) {
    if (typeof Y == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var M = R(
            v.as,
            v.crossOrigin
          );
          o.d.M(Y, {
            crossOrigin: M,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && o.d.M(Y);
  }, ns.preload = function(Y, v) {
    if (typeof Y == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var M = v.as, K = R(M, v.crossOrigin);
      o.d.L(Y, M, {
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
  }, ns.preloadModule = function(Y, v) {
    if (typeof Y == "string")
      if (v) {
        var M = R(v.as, v.crossOrigin);
        o.d.m(Y, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: M,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else o.d.m(Y);
  }, ns.requestFormReset = function(Y) {
    o.d.r(Y);
  }, ns.unstable_batchedUpdates = function(Y, v) {
    return Y(v);
  }, ns.useFormState = function(Y, v, M) {
    return V.H.useFormState(Y, v, M);
  }, ns.useFormStatus = function() {
    return V.H.useHostTransitionStatus();
  }, ns.version = "19.1.0", ns;
}
var _f;
function yj() {
  if (_f) return pu.exports;
  _f = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), pu.exports = bj(), pu.exports;
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
var Nf;
function _j() {
  if (Nf) return Mn;
  Nf = 1;
  var u = pj(), h = Du(), _ = yj();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function z(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function D(e) {
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
  function R(e) {
    if (D(e) !== e)
      throw Error(o(188));
  }
  function Y(e) {
    var t = e.alternate;
    if (!t) {
      if (t = D(e), t === null) throw Error(o(188));
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
          if (i === l) return R(n), e;
          if (i === a) return R(n), t;
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
  var M = Object.assign, K = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), se = Symbol.for("react.portal"), me = Symbol.for("react.fragment"), ye = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), he = Symbol.for("react.consumer"), F = Symbol.for("react.context"), ue = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), je = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), Be = Symbol.for("react.activity"), Qe = Symbol.for("react.memo_cache_sentinel"), Le = Symbol.iterator;
  function pe(e) {
    return e === null || typeof e != "object" ? null : (e = Le && e[Le] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var We = Symbol.for("react.client.reference");
  function X(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === We ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case me:
        return "Fragment";
      case _e:
        return "Profiler";
      case ye:
        return "StrictMode";
      case ne:
        return "Suspense";
      case H:
        return "SuspenseList";
      case Be:
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
        case ue:
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
  var oe = Array.isArray, y = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ce = [], m = -1;
  function B(e) {
    return { current: e };
  }
  function I(e) {
    0 > m || (e.current = Ce[m], Ce[m] = null, m--);
  }
  function ae(e, t) {
    m++, Ce[m] = e.current, e.current = t;
  }
  var ie = B(null), Z = B(null), W = B(null), we = B(null);
  function re(e, t) {
    switch (ae(W, t), ae(Z, e), ae(ie, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Gh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Gh(t), e = Xh(t, e);
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
    I(ie), ae(ie, e);
  }
  function Ae() {
    I(ie), I(Z), I(W);
  }
  function et(e) {
    e.memoizedState !== null && ae(we, e);
    var t = ie.current, l = Xh(t, e.type);
    t !== l && (ae(Z, e), ae(ie, l));
  }
  function it(e) {
    Z.current === e && (I(ie), I(Z)), we.current === e && (I(we), Tn._currentValue = le);
  }
  var Fe = Object.prototype.hasOwnProperty, Ke = u.unstable_scheduleCallback, Oe = u.unstable_cancelCallback, De = u.unstable_shouldYield, ke = u.unstable_requestPaint, He = u.unstable_now, Ie = u.unstable_getCurrentPriorityLevel, st = u.unstable_ImmediatePriority, at = u.unstable_UserBlockingPriority, ve = u.unstable_NormalPriority, ct = u.unstable_LowPriority, qe = u.unstable_IdlePriority, C = u.log, w = u.unstable_setDisableYieldValue, P = null, Ne = null;
  function Ue(e) {
    if (typeof C == "function" && w(e), Ne && typeof Ne.setStrictMode == "function")
      try {
        Ne.setStrictMode(P, e);
      } catch {
      }
  }
  var lt = Math.clz32 ? Math.clz32 : de, ft = Math.log, L = Math.LN2;
  function de(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ft(e) / L | 0) | 0;
  }
  var te = 256, Ye = 4194304;
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
  function xe(e, t) {
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
    var e = te;
    return te <<= 1, (te & 4194048) === 0 && (te = 256), e;
  }
  function T() {
    var e = Ye;
    return Ye <<= 1, (Ye & 62914560) === 0 && (Ye = 4194304), e;
  }
  function j(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ce(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function be(e, t, l, a, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var d = e.entanglements, p = e.expirationTimes, A = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var J = 31 - lt(l), ee = 1 << J;
      d[J] = 0, p[J] = -1;
      var U = A[J];
      if (U !== null)
        for (A[J] = null, J = 0; J < U.length; J++) {
          var q = U[J];
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
  function N(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - lt(l), n = 1 << a;
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
  function Ze(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function kt() {
    var e = Q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : uf(e.type));
  }
  function Yt(e, t) {
    var l = Q.p;
    try {
      return Q.p = e, t();
    } finally {
      Q.p = l;
    }
  }
  var qt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + qt, Nt = "__reactProps$" + qt, g = "__reactContainer$" + qt, Se = "__reactEvents$" + qt, nt = "__reactListeners$" + qt, pt = "__reactHandles$" + qt, x = "__reactResources$" + qt, Te = "__reactMarker$" + qt;
  function ze(e) {
    delete e[ut], delete e[Nt], delete e[Se], delete e[nt], delete e[pt];
  }
  function tt(e) {
    var t = e[ut];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[g] || l[ut]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Jh(e); e !== null; ) {
            if (l = e[ut]) return l;
            e = Jh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Vt(e) {
    if (e = e[ut] || e[g]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Ns(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function us(e) {
    var t = e[x];
    return t || (t = e[x] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function At(e) {
    e[Te] = !0;
  }
  var fl = /* @__PURE__ */ new Set(), Ks = {};
  function f(e, t) {
    G(e, t), G(e + "Capture", t);
  }
  function G(e, t) {
    for (Ks[e] = t, e = 0; e < t.length; e++)
      fl.add(t[e]);
  }
  var Ve = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ht = {}, gt = {};
  function is(e) {
    return Fe.call(gt, e) ? !0 : Fe.call(Ht, e) ? !1 : Ve.test(e) ? gt[e] = !0 : (Ht[e] = !0, !1);
  }
  function Ss(e, t, l) {
    if (is(t))
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
  function os(e, t, l) {
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
  var Ls, $s;
  function ws(e) {
    if (Ls === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Ls = t && t[1] || "", $s = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Ls + e + $s;
  }
  var Ds = !1;
  function cs(e, t) {
    if (!e || Ds) return "";
    Ds = !0;
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
                  var U = q;
                }
                Reflect.construct(e, [], ee);
              } else {
                try {
                  ee.call();
                } catch (q) {
                  U = q;
                }
                e.call(ee.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (q) {
                U = q;
              }
              (ee = e()) && typeof ee.catch == "function" && ee.catch(function() {
              });
            }
          } catch (q) {
            if (q && U && typeof q.stack == "string")
              return [q.stack, U.stack];
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
`), A = d.split(`
`);
        for (n = a = 0; a < p.length && !p[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < A.length && !A[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === p.length || n === A.length)
          for (a = p.length - 1, n = A.length - 1; 1 <= a && 0 <= n && p[a] !== A[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (p[a] !== A[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || p[a] !== A[n]) {
                  var J = `
` + p[a].replace(" at new ", " at ");
                  return e.displayName && J.includes("<anonymous>") && (J = J.replace("<anonymous>", e.displayName)), J;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ds = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? ws(l) : "";
  }
  function Ws(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ws(e.type);
      case 16:
        return ws("Lazy");
      case 13:
        return ws("Suspense");
      case 19:
        return ws("SuspenseList");
      case 0:
      case 15:
        return cs(e.type, !1);
      case 11:
        return cs(e.type.render, !1);
      case 1:
        return cs(e.type, !0);
      case 31:
        return ws("Activity");
      default:
        return "";
    }
  }
  function Qn(e) {
    try {
      var t = "";
      do
        t += Ws(e), e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function ds(e) {
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
  function sa(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Zn(e) {
    var t = sa(e) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
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
  function Vn(e) {
    e._valueTracker || (e._valueTracker = Zn(e));
  }
  function qu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = sa(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Jn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var dm = /[\n"\\]/g;
  function ks(e) {
    return e.replace(
      dm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function oc(e, t, l, a, n, i, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ds(t)) : e.value !== "" + ds(t) && (e.value = "" + ds(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? dc(e, c, ds(t)) : l != null ? dc(e, c, ds(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + ds(d) : e.removeAttribute("name");
  }
  function Hu(e, t, l, a, n, i, c, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null))
        return;
      l = l != null ? "" + ds(l) : "", t = t != null ? "" + ds(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c);
  }
  function dc(e, t, l) {
    t === "number" && Jn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function la(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + ds(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Bu(e, t, l) {
    if (t != null && (t = "" + ds(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + ds(l) : "";
  }
  function Lu(e, t, l, a) {
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
    l = ds(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a);
  }
  function aa(e, t) {
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
  function Yu(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || hm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Gu(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Yu(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Yu(e, i, t[i]);
  }
  function hc(e) {
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
  function Kn(e) {
    return mm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var fc = null;
  function mc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var na = null, ia = null;
  function Xu(e) {
    var t = Vt(e);
    if (t && (e = t.stateNode)) {
      var l = e[Nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (oc(
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
              'input[name="' + ks(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[Nt] || null;
                if (!n) throw Error(o(90));
                oc(
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
              a = l[t], a.form === e.form && qu(a);
          }
          break e;
        case "textarea":
          Bu(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && la(e, !!l.multiple, t, !1);
      }
    }
  }
  var xc = !1;
  function Qu(e, t, l) {
    if (xc) return e(t, l);
    xc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (xc = !1, (na !== null || ia !== null) && (Ri(), na && (t = na, e = ia, ia = na = null, Xu(t), e)))
        for (t = 0; t < e.length; t++) Xu(e[t]);
    }
  }
  function Ga(e, t) {
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
  var Fs = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), jc = !1;
  if (Fs)
    try {
      var Xa = {};
      Object.defineProperty(Xa, "passive", {
        get: function() {
          jc = !0;
        }
      }), window.addEventListener("test", Xa, Xa), window.removeEventListener("test", Xa, Xa);
    } catch {
      jc = !1;
    }
  var ml = null, vc = null, $n = null;
  function Zu() {
    if ($n) return $n;
    var e, t = vc, l = t.length, a, n = "value" in ml ? ml.value : ml.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[i - a]; a++) ;
    return $n = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Wn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Fn() {
    return !0;
  }
  function Vu() {
    return !1;
  }
  function hs(e) {
    function t(l, a, n, i, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Fn : Vu, this.isPropagationStopped = Vu, this;
    }
    return M(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Fn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Fn);
      },
      persist: function() {
      },
      isPersistent: Fn
    }), t;
  }
  var Bl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, In = hs(Bl), Qa = M({}, Bl, { view: 0, detail: 0 }), xm = hs(Qa), pc, gc, Za, Pn = M({}, Qa, {
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
    getModifierState: yc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Za && (Za && e.type === "mousemove" ? (pc = e.screenX - Za.screenX, gc = e.screenY - Za.screenY) : gc = pc = 0, Za = e), pc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : gc;
    }
  }), Ju = hs(Pn), jm = M({}, Pn, { dataTransfer: 0 }), vm = hs(jm), pm = M({}, Qa, { relatedTarget: 0 }), bc = hs(pm), gm = M({}, Bl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bm = hs(gm), ym = M({}, Bl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), _m = hs(ym), Nm = M({}, Bl, { data: 0 }), Ku = hs(Nm), Sm = {
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
  function yc() {
    return Cm;
  }
  var Em = M({}, Qa, {
    key: function(e) {
      if (e.key) {
        var t = Sm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Wn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: yc,
    charCode: function(e) {
      return e.type === "keypress" ? Wn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Wn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Om = hs(Em), Tm = M({}, Pn, {
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
  }), $u = hs(Tm), zm = M({}, Qa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: yc
  }), Am = hs(zm), Rm = M({}, Bl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Dm = hs(Rm), Um = M({}, Pn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Mm = hs(Um), qm = M({}, Bl, {
    newState: 0,
    oldState: 0
  }), Hm = hs(qm), Bm = [9, 13, 27, 32], _c = Fs && "CompositionEvent" in window, Va = null;
  Fs && "documentMode" in document && (Va = document.documentMode);
  var Lm = Fs && "TextEvent" in window && !Va, Wu = Fs && (!_c || Va && 8 < Va && 11 >= Va), Fu = " ", Iu = !1;
  function Pu(e, t) {
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
  function eo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ca = !1;
  function Ym(e, t) {
    switch (e) {
      case "compositionend":
        return eo(t);
      case "keypress":
        return t.which !== 32 ? null : (Iu = !0, Fu);
      case "textInput":
        return e = t.data, e === Fu && Iu ? null : e;
      default:
        return null;
    }
  }
  function Gm(e, t) {
    if (ca)
      return e === "compositionend" || !_c && Pu(e, t) ? (e = Zu(), $n = vc = ml = null, ca = !1, e) : null;
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
        return Wu && t.locale !== "ko" ? null : t.data;
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
  function to(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Xm[e.type] : t === "textarea";
  }
  function so(e, t, l, a) {
    na ? ia ? ia.push(a) : ia = [a] : na = a, t = Bi(t, "onChange"), 0 < t.length && (l = new In(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Ja = null, Ka = null;
  function Qm(e) {
    qh(e, 0);
  }
  function ei(e) {
    var t = Ns(e);
    if (qu(t)) return e;
  }
  function lo(e, t) {
    if (e === "change") return t;
  }
  var ao = !1;
  if (Fs) {
    var Nc;
    if (Fs) {
      var Sc = "oninput" in document;
      if (!Sc) {
        var no = document.createElement("div");
        no.setAttribute("oninput", "return;"), Sc = typeof no.oninput == "function";
      }
      Nc = Sc;
    } else Nc = !1;
    ao = Nc && (!document.documentMode || 9 < document.documentMode);
  }
  function io() {
    Ja && (Ja.detachEvent("onpropertychange", co), Ka = Ja = null);
  }
  function co(e) {
    if (e.propertyName === "value" && ei(Ka)) {
      var t = [];
      so(
        t,
        Ka,
        e,
        mc(e)
      ), Qu(Qm, t);
    }
  }
  function Zm(e, t, l) {
    e === "focusin" ? (io(), Ja = t, Ka = l, Ja.attachEvent("onpropertychange", co)) : e === "focusout" && io();
  }
  function Vm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return ei(Ka);
  }
  function Jm(e, t) {
    if (e === "click") return ei(t);
  }
  function Km(e, t) {
    if (e === "input" || e === "change")
      return ei(t);
  }
  function $m(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var js = typeof Object.is == "function" ? Object.is : $m;
  function $a(e, t) {
    if (js(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Fe.call(t, n) || !js(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function ro(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function uo(e, t) {
    var l = ro(e);
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
      l = ro(l);
    }
  }
  function oo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? oo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ho(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Jn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Jn(e.document);
    }
    return t;
  }
  function wc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Wm = Fs && "documentMode" in document && 11 >= document.documentMode, ra = null, kc = null, Wa = null, Cc = !1;
  function fo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Cc || ra == null || ra !== Jn(a) || (a = ra, "selectionStart" in a && wc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Wa && $a(Wa, a) || (Wa = a, a = Bi(kc, "onSelect"), 0 < a.length && (t = new In(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ra)));
  }
  function Ll(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var ua = {
    animationend: Ll("Animation", "AnimationEnd"),
    animationiteration: Ll("Animation", "AnimationIteration"),
    animationstart: Ll("Animation", "AnimationStart"),
    transitionrun: Ll("Transition", "TransitionRun"),
    transitionstart: Ll("Transition", "TransitionStart"),
    transitioncancel: Ll("Transition", "TransitionCancel"),
    transitionend: Ll("Transition", "TransitionEnd")
  }, Ec = {}, mo = {};
  Fs && (mo = document.createElement("div").style, "AnimationEvent" in window || (delete ua.animationend.animation, delete ua.animationiteration.animation, delete ua.animationstart.animation), "TransitionEvent" in window || delete ua.transitionend.transition);
  function Yl(e) {
    if (Ec[e]) return Ec[e];
    if (!ua[e]) return e;
    var t = ua[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in mo)
        return Ec[e] = t[l];
    return e;
  }
  var xo = Yl("animationend"), jo = Yl("animationiteration"), vo = Yl("animationstart"), Fm = Yl("transitionrun"), Im = Yl("transitionstart"), Pm = Yl("transitioncancel"), po = Yl("transitionend"), go = /* @__PURE__ */ new Map(), Oc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Oc.push("scrollEnd");
  function Us(e, t) {
    go.set(e, t), f(t, [e]);
  }
  var bo = /* @__PURE__ */ new WeakMap();
  function Cs(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = bo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Qn(t)
      }, bo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Qn(t)
    };
  }
  var Es = [], oa = 0, Tc = 0;
  function ti() {
    for (var e = oa, t = Tc = oa = 0; t < e; ) {
      var l = Es[t];
      Es[t++] = null;
      var a = Es[t];
      Es[t++] = null;
      var n = Es[t];
      Es[t++] = null;
      var i = Es[t];
      if (Es[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      i !== 0 && yo(l, n, i);
    }
  }
  function si(e, t, l, a) {
    Es[oa++] = e, Es[oa++] = t, Es[oa++] = l, Es[oa++] = a, Tc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function zc(e, t, l, a) {
    return si(e, t, l, a), li(e);
  }
  function da(e, t) {
    return si(e, null, null, t), li(e);
  }
  function yo(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - lt(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function li(e) {
    if (50 < _n)
      throw _n = 0, qr = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var ha = {};
  function ex(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function vs(e, t, l, a) {
    return new ex(e, t, l, a);
  }
  function Ac(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Is(e, t) {
    var l = e.alternate;
    return l === null ? (l = vs(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function _o(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ai(e, t, l, a, n, i) {
    var c = 0;
    if (a = e, typeof e == "function") Ac(e) && (c = 1);
    else if (typeof e == "string")
      c = sj(
        e,
        l,
        ie.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Be:
          return e = vs(31, l, t, n), e.elementType = Be, e.lanes = i, e;
        case me:
          return Gl(l.children, n, i, t);
        case ye:
          c = 8, n |= 24;
          break;
        case _e:
          return e = vs(12, l, t, n | 2), e.elementType = _e, e.lanes = i, e;
        case ne:
          return e = vs(13, l, t, n), e.elementType = ne, e.lanes = i, e;
        case H:
          return e = vs(19, l, t, n), e.elementType = H, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Ee:
              case F:
                c = 10;
                break e;
              case he:
                c = 9;
                break e;
              case ue:
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
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = vs(c, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Gl(e, t, l, a) {
    return e = vs(7, e, a, t), e.lanes = l, e;
  }
  function Rc(e, t, l) {
    return e = vs(6, e, null, t), e.lanes = l, e;
  }
  function Dc(e, t, l) {
    return t = vs(
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
  var fa = [], ma = 0, ni = null, ii = 0, Os = [], Ts = 0, Xl = null, Ps = 1, el = "";
  function Ql(e, t) {
    fa[ma++] = ii, fa[ma++] = ni, ni = e, ii = t;
  }
  function No(e, t, l) {
    Os[Ts++] = Ps, Os[Ts++] = el, Os[Ts++] = Xl, Xl = e;
    var a = Ps;
    e = el;
    var n = 32 - lt(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - lt(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Ps = 1 << 32 - lt(t) + n | l << n | a, el = i + e;
    } else
      Ps = 1 << i | l << n | a, el = e;
  }
  function Uc(e) {
    e.return !== null && (Ql(e, 1), No(e, 1, 0));
  }
  function Mc(e) {
    for (; e === ni; )
      ni = fa[--ma], fa[ma] = null, ii = fa[--ma], fa[ma] = null;
    for (; e === Xl; )
      Xl = Os[--Ts], Os[Ts] = null, el = Os[--Ts], Os[Ts] = null, Ps = Os[--Ts], Os[Ts] = null;
  }
  var rs = null, Bt = null, yt = !1, Zl = null, Ys = !1, qc = Error(o(519));
  function Vl(e) {
    var t = Error(o(418, ""));
    throw Pa(Cs(t, e)), qc;
  }
  function So(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[ut] = e, t[Nt] = a, l) {
      case "dialog":
        xt("cancel", t), xt("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        xt("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Sn.length; l++)
          xt(Sn[l], t);
        break;
      case "source":
        xt("error", t);
        break;
      case "img":
      case "image":
      case "link":
        xt("error", t), xt("load", t);
        break;
      case "details":
        xt("toggle", t);
        break;
      case "input":
        xt("invalid", t), Hu(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Vn(t);
        break;
      case "select":
        xt("invalid", t);
        break;
      case "textarea":
        xt("invalid", t), Lu(t, a.value, a.defaultValue, a.children), Vn(t);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Yh(t.textContent, l) ? (a.popover != null && (xt("beforetoggle", t), xt("toggle", t)), a.onScroll != null && xt("scroll", t), a.onScrollEnd != null && xt("scrollend", t), a.onClick != null && (t.onclick = Li), t = !0) : t = !1, t || Vl(e);
  }
  function wo(e) {
    for (rs = e.return; rs; )
      switch (rs.tag) {
        case 5:
        case 13:
          Ys = !1;
          return;
        case 27:
        case 3:
          Ys = !0;
          return;
        default:
          rs = rs.return;
      }
  }
  function Fa(e) {
    if (e !== rs) return !1;
    if (!yt) return wo(e), yt = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Pr(e.type, e.memoizedProps)), l = !l), l && Bt && Vl(e), wo(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (l = e.data, l === "/$") {
              if (t === 0) {
                Bt = qs(e.nextSibling);
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
      t === 27 ? (t = Bt, Tl(e.type) ? (e = lu, lu = null, Bt = e) : Bt = t) : Bt = rs ? qs(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ia() {
    Bt = rs = null, yt = !1;
  }
  function ko() {
    var e = Zl;
    return e !== null && (xs === null ? xs = e : xs.push.apply(
      xs,
      e
    ), Zl = null), e;
  }
  function Pa(e) {
    Zl === null ? Zl = [e] : Zl.push(e);
  }
  var Hc = B(null), Jl = null, tl = null;
  function xl(e, t, l) {
    ae(Hc, t._currentValue), t._currentValue = l;
  }
  function sl(e) {
    e._currentValue = Hc.current, I(Hc);
  }
  function Bc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Lc(e, t, l, a) {
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
              i.lanes |= l, d = i.alternate, d !== null && (d.lanes |= l), Bc(
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
        c.lanes |= l, i = c.alternate, i !== null && (i.lanes |= l), Bc(c, l, e), c = null;
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
  function en(e, t, l, a) {
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
          js(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === we.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Tn) : e = [Tn]);
      }
      n = n.return;
    }
    e !== null && Lc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function ci(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!js(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Kl(e) {
    Jl = e, tl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function as(e) {
    return Co(Jl, e);
  }
  function ri(e, t) {
    return Jl === null && Kl(e), Co(e, t);
  }
  function Co(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, tl === null) {
      if (e === null) throw Error(o(308));
      tl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else tl = tl.next = t;
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
  function Yc() {
    return {
      controller: new tx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function tn(e) {
    e.refCount--, e.refCount === 0 && sx(lx, function() {
      e.controller.abort();
    });
  }
  var sn = null, Gc = 0, xa = 0, ja = null;
  function ax(e, t) {
    if (sn === null) {
      var l = sn = [];
      Gc = 0, xa = Qr(), ja = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Gc++, t.then(Eo, Eo), t;
  }
  function Eo() {
    if (--Gc === 0 && sn !== null) {
      ja !== null && (ja.status = "fulfilled");
      var e = sn;
      sn = null, xa = 0, ja = null;
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
  var Oo = y.S;
  y.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && ax(e, t), Oo !== null && Oo(e, t);
  };
  var $l = B(null);
  function Xc() {
    var e = $l.current;
    return e !== null ? e : zt.pooledCache;
  }
  function ui(e, t) {
    t === null ? ae($l, $l.current) : ae($l, t.pool);
  }
  function To() {
    var e = Xc();
    return e === null ? null : { parent: Wt._currentValue, pool: e };
  }
  var ln = Error(o(460)), zo = Error(o(474)), oi = Error(o(542)), Qc = { then: function() {
  } };
  function Ao(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function di() {
  }
  function Ro(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(di, di), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Uo(e), e;
      default:
        if (typeof t.status == "string") t.then(di, di);
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
            throw e = t.reason, Uo(e), e;
        }
        throw an = t, ln;
    }
  }
  var an = null;
  function Do() {
    if (an === null) throw Error(o(459));
    var e = an;
    return an = null, e;
  }
  function Uo(e) {
    if (e === ln || e === oi)
      throw Error(o(483));
  }
  var jl = !1;
  function Zc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Vc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function vl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function pl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (St & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = li(e), yo(e, null, l), t;
    }
    return si(e, a, t, l), li(e);
  }
  function nn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  function Jc(e, t) {
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
  var Kc = !1;
  function cn() {
    if (Kc) {
      var e = ja;
      if (e !== null) throw e;
    }
  }
  function rn(e, t, l, a) {
    Kc = !1;
    var n = e.updateQueue;
    jl = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var p = d, A = p.next;
      p.next = null, c === null ? i = A : c.next = A, c = p;
      var J = e.alternate;
      J !== null && (J = J.updateQueue, d = J.lastBaseUpdate, d !== c && (d === null ? J.firstBaseUpdate = A : d.next = A, J.lastBaseUpdate = p));
    }
    if (i !== null) {
      var ee = n.baseState;
      c = 0, J = A = p = null, d = i;
      do {
        var U = d.lane & -536870913, q = U !== d.lane;
        if (q ? (vt & U) === U : (a & U) === U) {
          U !== 0 && U === xa && (Kc = !0), J !== null && (J = J.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var Pe = e, Je = d;
            U = t;
            var Ot = l;
            switch (Je.tag) {
              case 1:
                if (Pe = Je.payload, typeof Pe == "function") {
                  ee = Pe.call(Ot, ee, U);
                  break e;
                }
                ee = Pe;
                break e;
              case 3:
                Pe.flags = Pe.flags & -65537 | 128;
              case 0:
                if (Pe = Je.payload, U = typeof Pe == "function" ? Pe.call(Ot, ee, U) : Pe, U == null) break e;
                ee = M({}, ee, U);
                break e;
              case 2:
                jl = !0;
            }
          }
          U = d.callback, U !== null && (e.flags |= 64, q && (e.flags |= 8192), q = n.callbacks, q === null ? n.callbacks = [U] : q.push(U));
        } else
          q = {
            lane: U,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, J === null ? (A = J = q, p = ee) : J = J.next = q, c |= U;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          q = d, d = q.next, q.next = null, n.lastBaseUpdate = q, n.shared.pending = null;
        }
      } while (!0);
      J === null && (p = ee), n.baseState = p, n.firstBaseUpdate = A, n.lastBaseUpdate = J, i === null && (n.shared.lanes = 0), kl |= c, e.lanes = c, e.memoizedState = ee;
    }
  }
  function Mo(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function qo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Mo(l[e], t);
  }
  var va = B(null), hi = B(0);
  function Ho(e, t) {
    e = ul, ae(hi, e), ae(va, t), ul = e | t.baseLanes;
  }
  function $c() {
    ae(hi, ul), ae(va, va.current);
  }
  function Wc() {
    ul = hi.current, I(va), I(hi);
  }
  var gl = 0, dt = null, Ct = null, Jt = null, fi = !1, pa = !1, Wl = !1, mi = 0, un = 0, ga = null, ix = 0;
  function Gt() {
    throw Error(o(321));
  }
  function Fc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!js(e[l], t[l])) return !1;
    return !0;
  }
  function Ic(e, t, l, a, n, i) {
    return gl = i, dt = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, y.H = e === null || e.memoizedState === null ? yd : _d, Wl = !1, i = l(a, n), Wl = !1, pa && (i = Lo(
      t,
      l,
      a,
      n
    )), Bo(e), i;
  }
  function Bo(e) {
    y.H = bi;
    var t = Ct !== null && Ct.next !== null;
    if (gl = 0, Jt = Ct = dt = null, fi = !1, un = 0, ga = null, t) throw Error(o(300));
    e === null || It || (e = e.dependencies, e !== null && ci(e) && (It = !0));
  }
  function Lo(e, t, l, a) {
    dt = e;
    var n = 0;
    do {
      if (pa && (ga = null), un = 0, pa = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Jt = Ct = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      y.H = fx, i = t(l, a);
    } while (pa);
    return i;
  }
  function cx() {
    var e = y.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? on(t) : t, e = e.useState()[0], (Ct !== null ? Ct.memoizedState : null) !== e && (dt.flags |= 1024), t;
  }
  function Pc() {
    var e = mi !== 0;
    return mi = 0, e;
  }
  function er(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function tr(e) {
    if (fi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      fi = !1;
    }
    gl = 0, Jt = Ct = dt = null, pa = !1, un = mi = 0, ga = null;
  }
  function fs() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Jt === null ? dt.memoizedState = Jt = e : Jt = Jt.next = e, Jt;
  }
  function Kt() {
    if (Ct === null) {
      var e = dt.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ct.next;
    var t = Jt === null ? dt.memoizedState : Jt.next;
    if (t !== null)
      Jt = t, Ct = e;
    else {
      if (e === null)
        throw dt.alternate === null ? Error(o(467)) : Error(o(310));
      Ct = e, e = {
        memoizedState: Ct.memoizedState,
        baseState: Ct.baseState,
        baseQueue: Ct.baseQueue,
        queue: Ct.queue,
        next: null
      }, Jt === null ? dt.memoizedState = Jt = e : Jt = Jt.next = e;
    }
    return Jt;
  }
  function sr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function on(e) {
    var t = un;
    return un += 1, ga === null && (ga = []), e = Ro(ga, e, t), t = dt, (Jt === null ? t.memoizedState : Jt.next) === null && (t = t.alternate, y.H = t === null || t.memoizedState === null ? yd : _d), e;
  }
  function xi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return on(e);
      if (e.$$typeof === F) return as(e);
    }
    throw Error(o(438, String(e)));
  }
  function lr(e) {
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
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = sr(), dt.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Qe;
    return t.index++, l;
  }
  function ll(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ji(e) {
    var t = Kt();
    return ar(t, Ct, e);
  }
  function ar(e, t, l) {
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
      var d = c = null, p = null, A = t, J = !1;
      do {
        var ee = A.lane & -536870913;
        if (ee !== A.lane ? (vt & ee) === ee : (gl & ee) === ee) {
          var U = A.revertLane;
          if (U === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: A.action,
              hasEagerState: A.hasEagerState,
              eagerState: A.eagerState,
              next: null
            }), ee === xa && (J = !0);
          else if ((gl & U) === U) {
            A = A.next, U === xa && (J = !0);
            continue;
          } else
            ee = {
              lane: 0,
              revertLane: A.revertLane,
              action: A.action,
              hasEagerState: A.hasEagerState,
              eagerState: A.eagerState,
              next: null
            }, p === null ? (d = p = ee, c = i) : p = p.next = ee, dt.lanes |= U, kl |= U;
          ee = A.action, Wl && l(i, ee), i = A.hasEagerState ? A.eagerState : l(i, ee);
        } else
          U = {
            lane: ee,
            revertLane: A.revertLane,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null
          }, p === null ? (d = p = U, c = i) : p = p.next = U, dt.lanes |= ee, kl |= ee;
        A = A.next;
      } while (A !== null && A !== t);
      if (p === null ? c = i : p.next = d, !js(i, e.memoizedState) && (It = !0, J && (l = ja, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = c, e.baseQueue = p, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function nr(e) {
    var t = Kt(), l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== n);
      js(i, t.memoizedState) || (It = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Yo(e, t, l) {
    var a = dt, n = Kt(), i = yt;
    if (i) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var c = !js(
      (Ct || n).memoizedState,
      l
    );
    c && (n.memoizedState = l, It = !0), n = n.queue;
    var d = Qo.bind(null, a, n, e);
    if (dn(2048, 8, d, [e]), n.getSnapshot !== t || c || Jt !== null && Jt.memoizedState.tag & 1) {
      if (a.flags |= 2048, ba(
        9,
        vi(),
        Xo.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), zt === null) throw Error(o(349));
      i || (gl & 124) !== 0 || Go(a, t, l);
    }
    return l;
  }
  function Go(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = dt.updateQueue, t === null ? (t = sr(), dt.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Xo(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Zo(t) && Vo(e);
  }
  function Qo(e, t, l) {
    return l(function() {
      Zo(t) && Vo(e);
    });
  }
  function Zo(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !js(e, l);
    } catch {
      return !0;
    }
  }
  function Vo(e) {
    var t = da(e, 2);
    t !== null && _s(t, e, 2);
  }
  function ir(e) {
    var t = fs();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Wl) {
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
      lastRenderedReducer: ll,
      lastRenderedState: e
    }, t;
  }
  function Jo(e, t, l, a) {
    return e.baseState = l, ar(
      e,
      Ct,
      typeof a == "function" ? a : ll
    );
  }
  function rx(e, t, l, a, n) {
    if (gi(e)) throw Error(o(485));
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
      y.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, Ko(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function Ko(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = y.T, c = {};
      y.T = c;
      try {
        var d = l(n, a), p = y.S;
        p !== null && p(c, d), $o(e, t, d);
      } catch (A) {
        cr(e, t, A);
      } finally {
        y.T = i;
      }
    } else
      try {
        i = l(n, a), $o(e, t, i);
      } catch (A) {
        cr(e, t, A);
      }
  }
  function $o(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Wo(e, t, a);
      },
      function(a) {
        return cr(e, t, a);
      }
    ) : Wo(e, t, l);
  }
  function Wo(e, t, l) {
    t.status = "fulfilled", t.value = l, Fo(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Ko(e, l)));
  }
  function cr(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Fo(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Fo(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Io(e, t) {
    return t;
  }
  function Po(e, t) {
    if (yt) {
      var l = zt.formState;
      if (l !== null) {
        e: {
          var a = dt;
          if (yt) {
            if (Bt) {
              t: {
                for (var n = Bt, i = Ys; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = qs(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Bt = qs(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Vl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = fs(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Io,
      lastRenderedState: t
    }, l.queue = a, l = pd.bind(
      null,
      dt,
      a
    ), a.dispatch = l, a = ir(!1), i = hr.bind(
      null,
      dt,
      !1,
      a.queue
    ), a = fs(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = rx.bind(
      null,
      dt,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function ed(e) {
    var t = Kt();
    return td(t, Ct, e);
  }
  function td(e, t, l) {
    if (t = ar(
      e,
      t,
      Io
    )[0], e = ji(ll)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = on(t);
      } catch (c) {
        throw c === ln ? oi : c;
      }
    else a = t;
    t = Kt();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (dt.flags |= 2048, ba(
      9,
      vi(),
      ux.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function ux(e, t) {
    e.action = t;
  }
  function sd(e) {
    var t = Kt(), l = Ct;
    if (l !== null)
      return td(t, l, e);
    Kt(), t = t.memoizedState, l = Kt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function ba(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = dt.updateQueue, t === null && (t = sr(), dt.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function vi() {
    return { destroy: void 0, resource: void 0 };
  }
  function ld() {
    return Kt().memoizedState;
  }
  function pi(e, t, l, a) {
    var n = fs();
    a = a === void 0 ? null : a, dt.flags |= e, n.memoizedState = ba(
      1 | t,
      vi(),
      l,
      a
    );
  }
  function dn(e, t, l, a) {
    var n = Kt();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    Ct !== null && a !== null && Fc(a, Ct.memoizedState.deps) ? n.memoizedState = ba(t, i, l, a) : (dt.flags |= e, n.memoizedState = ba(
      1 | t,
      i,
      l,
      a
    ));
  }
  function ad(e, t) {
    pi(8390656, 8, e, t);
  }
  function nd(e, t) {
    dn(2048, 8, e, t);
  }
  function id(e, t) {
    return dn(4, 2, e, t);
  }
  function cd(e, t) {
    return dn(4, 4, e, t);
  }
  function rd(e, t) {
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
  function ud(e, t, l) {
    l = l != null ? l.concat([e]) : null, dn(4, 4, rd.bind(null, t, e), l);
  }
  function rr() {
  }
  function od(e, t) {
    var l = Kt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Fc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function dd(e, t) {
    var l = Kt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Fc(t, a[1]))
      return a[0];
    if (a = e(), Wl) {
      Ue(!0);
      try {
        e();
      } finally {
        Ue(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function ur(e, t, l) {
    return l === void 0 || (gl & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = l, e = mh(), dt.lanes |= e, kl |= e, l);
  }
  function hd(e, t, l, a) {
    return js(l, t) ? l : va.current !== null ? (e = ur(e, l, a), js(e, t) || (It = !0), e) : (gl & 42) === 0 ? (It = !0, e.memoizedState = l) : (e = mh(), dt.lanes |= e, kl |= e, t);
  }
  function fd(e, t, l, a, n) {
    var i = Q.p;
    Q.p = i !== 0 && 8 > i ? i : 8;
    var c = y.T, d = {};
    y.T = d, hr(e, !1, t, l);
    try {
      var p = n(), A = y.S;
      if (A !== null && A(d, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var J = nx(
          p,
          a
        );
        hn(
          e,
          t,
          J,
          ys(e)
        );
      } else
        hn(
          e,
          t,
          a,
          ys(e)
        );
    } catch (ee) {
      hn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: ee },
        ys()
      );
    } finally {
      Q.p = i, y.T = c;
    }
  }
  function ox() {
  }
  function or(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = md(e).queue;
    fd(
      e,
      n,
      t,
      le,
      l === null ? ox : function() {
        return xd(e), l(a);
      }
    );
  }
  function md(e) {
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
        lastRenderedReducer: ll,
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
        lastRenderedReducer: ll,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function xd(e) {
    var t = md(e).next.queue;
    hn(e, t, {}, ys());
  }
  function dr() {
    return as(Tn);
  }
  function jd() {
    return Kt().memoizedState;
  }
  function vd() {
    return Kt().memoizedState;
  }
  function dx(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = ys();
          e = vl(l);
          var a = pl(t, e, l);
          a !== null && (_s(a, t, l), nn(a, t, l)), t = { cache: Yc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function hx(e, t, l) {
    var a = ys();
    l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, gi(e) ? gd(t, l) : (l = zc(e, t, l, a), l !== null && (_s(l, e, a), bd(l, t, a)));
  }
  function pd(e, t, l) {
    var a = ys();
    hn(e, t, l, a);
  }
  function hn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (gi(e)) gd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, d = i(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, js(d, c))
            return si(e, t, n, 0), zt === null && ti(), !1;
        } catch {
        } finally {
        }
      if (l = zc(e, t, n, a), l !== null)
        return _s(l, e, a), bd(l, t, a), !0;
    }
    return !1;
  }
  function hr(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Qr(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, gi(e)) {
      if (t) throw Error(o(479));
    } else
      t = zc(
        e,
        l,
        a,
        2
      ), t !== null && _s(t, e, 2);
  }
  function gi(e) {
    var t = e.alternate;
    return e === dt || t !== null && t === dt;
  }
  function gd(e, t) {
    pa = fi = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function bd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, N(e, l);
    }
  }
  var bi = {
    readContext: as,
    use: xi,
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
  }, yd = {
    readContext: as,
    use: xi,
    useCallback: function(e, t) {
      return fs().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: as,
    useEffect: ad,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, pi(
        4194308,
        4,
        rd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return pi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      pi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = fs();
      t = t === void 0 ? null : t;
      var a = e();
      if (Wl) {
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
      var a = fs();
      if (l !== void 0) {
        var n = l(t);
        if (Wl) {
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
      }, a.queue = e, e = e.dispatch = hx.bind(
        null,
        dt,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = fs();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = ir(e);
      var t = e.queue, l = pd.bind(null, dt, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: rr,
    useDeferredValue: function(e, t) {
      var l = fs();
      return ur(l, e, t);
    },
    useTransition: function() {
      var e = ir(!1);
      return e = fd.bind(
        null,
        dt,
        e.queue,
        !0,
        !1
      ), fs().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = dt, n = fs();
      if (yt) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), zt === null)
          throw Error(o(349));
        (vt & 124) !== 0 || Go(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, ad(Qo.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, ba(
        9,
        vi(),
        Xo.bind(
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
      var e = fs(), t = zt.identifierPrefix;
      if (yt) {
        var l = el, a = Ps;
        l = (a & ~(1 << 32 - lt(a) - 1)).toString(32) + l, t = "«" + t + "R" + l, l = mi++, 0 < l && (t += "H" + l.toString(32)), t += "»";
      } else
        l = ix++, t = "«" + t + "r" + l.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: dr,
    useFormState: Po,
    useActionState: Po,
    useOptimistic: function(e) {
      var t = fs();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = hr.bind(
        null,
        dt,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: lr,
    useCacheRefresh: function() {
      return fs().memoizedState = dx.bind(
        null,
        dt
      );
    }
  }, _d = {
    readContext: as,
    use: xi,
    useCallback: od,
    useContext: as,
    useEffect: nd,
    useImperativeHandle: ud,
    useInsertionEffect: id,
    useLayoutEffect: cd,
    useMemo: dd,
    useReducer: ji,
    useRef: ld,
    useState: function() {
      return ji(ll);
    },
    useDebugValue: rr,
    useDeferredValue: function(e, t) {
      var l = Kt();
      return hd(
        l,
        Ct.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ji(ll)[0], t = Kt().memoizedState;
      return [
        typeof e == "boolean" ? e : on(e),
        t
      ];
    },
    useSyncExternalStore: Yo,
    useId: jd,
    useHostTransitionStatus: dr,
    useFormState: ed,
    useActionState: ed,
    useOptimistic: function(e, t) {
      var l = Kt();
      return Jo(l, Ct, e, t);
    },
    useMemoCache: lr,
    useCacheRefresh: vd
  }, fx = {
    readContext: as,
    use: xi,
    useCallback: od,
    useContext: as,
    useEffect: nd,
    useImperativeHandle: ud,
    useInsertionEffect: id,
    useLayoutEffect: cd,
    useMemo: dd,
    useReducer: nr,
    useRef: ld,
    useState: function() {
      return nr(ll);
    },
    useDebugValue: rr,
    useDeferredValue: function(e, t) {
      var l = Kt();
      return Ct === null ? ur(l, e, t) : hd(
        l,
        Ct.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = nr(ll)[0], t = Kt().memoizedState;
      return [
        typeof e == "boolean" ? e : on(e),
        t
      ];
    },
    useSyncExternalStore: Yo,
    useId: jd,
    useHostTransitionStatus: dr,
    useFormState: sd,
    useActionState: sd,
    useOptimistic: function(e, t) {
      var l = Kt();
      return Ct !== null ? Jo(l, Ct, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: lr,
    useCacheRefresh: vd
  }, ya = null, fn = 0;
  function yi(e) {
    var t = fn;
    return fn += 1, ya === null && (ya = []), Ro(ya, e, t);
  }
  function mn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function _i(e, t) {
    throw t.$$typeof === K ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Nd(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Sd(e) {
    function t(E, S) {
      if (e) {
        var O = E.deletions;
        O === null ? (E.deletions = [S], E.flags |= 16) : O.push(S);
      }
    }
    function l(E, S) {
      if (!e) return null;
      for (; S !== null; )
        t(E, S), S = S.sibling;
      return null;
    }
    function a(E) {
      for (var S = /* @__PURE__ */ new Map(); E !== null; )
        E.key !== null ? S.set(E.key, E) : S.set(E.index, E), E = E.sibling;
      return S;
    }
    function n(E, S) {
      return E = Is(E, S), E.index = 0, E.sibling = null, E;
    }
    function i(E, S, O) {
      return E.index = O, e ? (O = E.alternate, O !== null ? (O = O.index, O < S ? (E.flags |= 67108866, S) : O) : (E.flags |= 67108866, S)) : (E.flags |= 1048576, S);
    }
    function c(E) {
      return e && E.alternate === null && (E.flags |= 67108866), E;
    }
    function d(E, S, O, $) {
      return S === null || S.tag !== 6 ? (S = Rc(O, E.mode, $), S.return = E, S) : (S = n(S, O), S.return = E, S);
    }
    function p(E, S, O, $) {
      var Me = O.type;
      return Me === me ? J(
        E,
        S,
        O.props.children,
        $,
        O.key
      ) : S !== null && (S.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Re && Nd(Me) === S.type) ? (S = n(S, O.props), mn(S, O), S.return = E, S) : (S = ai(
        O.type,
        O.key,
        O.props,
        null,
        E.mode,
        $
      ), mn(S, O), S.return = E, S);
    }
    function A(E, S, O, $) {
      return S === null || S.tag !== 4 || S.stateNode.containerInfo !== O.containerInfo || S.stateNode.implementation !== O.implementation ? (S = Dc(O, E.mode, $), S.return = E, S) : (S = n(S, O.children || []), S.return = E, S);
    }
    function J(E, S, O, $, Me) {
      return S === null || S.tag !== 7 ? (S = Gl(
        O,
        E.mode,
        $,
        Me
      ), S.return = E, S) : (S = n(S, O), S.return = E, S);
    }
    function ee(E, S, O) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return S = Rc(
          "" + S,
          E.mode,
          O
        ), S.return = E, S;
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case k:
            return O = ai(
              S.type,
              S.key,
              S.props,
              null,
              E.mode,
              O
            ), mn(O, S), O.return = E, O;
          case se:
            return S = Dc(
              S,
              E.mode,
              O
            ), S.return = E, S;
          case Re:
            var $ = S._init;
            return S = $(S._payload), ee(E, S, O);
        }
        if (oe(S) || pe(S))
          return S = Gl(
            S,
            E.mode,
            O,
            null
          ), S.return = E, S;
        if (typeof S.then == "function")
          return ee(E, yi(S), O);
        if (S.$$typeof === F)
          return ee(
            E,
            ri(E, S),
            O
          );
        _i(E, S);
      }
      return null;
    }
    function U(E, S, O, $) {
      var Me = S !== null ? S.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return Me !== null ? null : d(E, S, "" + O, $);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            return O.key === Me ? p(E, S, O, $) : null;
          case se:
            return O.key === Me ? A(E, S, O, $) : null;
          case Re:
            return Me = O._init, O = Me(O._payload), U(E, S, O, $);
        }
        if (oe(O) || pe(O))
          return Me !== null ? null : J(E, S, O, $, null);
        if (typeof O.then == "function")
          return U(
            E,
            S,
            yi(O),
            $
          );
        if (O.$$typeof === F)
          return U(
            E,
            S,
            ri(E, O),
            $
          );
        _i(E, O);
      }
      return null;
    }
    function q(E, S, O, $, Me) {
      if (typeof $ == "string" && $ !== "" || typeof $ == "number" || typeof $ == "bigint")
        return E = E.get(O) || null, d(S, E, "" + $, Me);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case k:
            return E = E.get(
              $.key === null ? O : $.key
            ) || null, p(S, E, $, Me);
          case se:
            return E = E.get(
              $.key === null ? O : $.key
            ) || null, A(S, E, $, Me);
          case Re:
            var ht = $._init;
            return $ = ht($._payload), q(
              E,
              S,
              O,
              $,
              Me
            );
        }
        if (oe($) || pe($))
          return E = E.get(O) || null, J(S, E, $, Me, null);
        if (typeof $.then == "function")
          return q(
            E,
            S,
            O,
            yi($),
            Me
          );
        if ($.$$typeof === F)
          return q(
            E,
            S,
            O,
            ri(S, $),
            Me
          );
        _i(S, $);
      }
      return null;
    }
    function Pe(E, S, O, $) {
      for (var Me = null, ht = null, Xe = S, $e = S = 0, es = null; Xe !== null && $e < O.length; $e++) {
        Xe.index > $e ? (es = Xe, Xe = null) : es = Xe.sibling;
        var bt = U(
          E,
          Xe,
          O[$e],
          $
        );
        if (bt === null) {
          Xe === null && (Xe = es);
          break;
        }
        e && Xe && bt.alternate === null && t(E, Xe), S = i(bt, S, $e), ht === null ? Me = bt : ht.sibling = bt, ht = bt, Xe = es;
      }
      if ($e === O.length)
        return l(E, Xe), yt && Ql(E, $e), Me;
      if (Xe === null) {
        for (; $e < O.length; $e++)
          Xe = ee(E, O[$e], $), Xe !== null && (S = i(
            Xe,
            S,
            $e
          ), ht === null ? Me = Xe : ht.sibling = Xe, ht = Xe);
        return yt && Ql(E, $e), Me;
      }
      for (Xe = a(Xe); $e < O.length; $e++)
        es = q(
          Xe,
          E,
          $e,
          O[$e],
          $
        ), es !== null && (e && es.alternate !== null && Xe.delete(
          es.key === null ? $e : es.key
        ), S = i(
          es,
          S,
          $e
        ), ht === null ? Me = es : ht.sibling = es, ht = es);
      return e && Xe.forEach(function(Ul) {
        return t(E, Ul);
      }), yt && Ql(E, $e), Me;
    }
    function Je(E, S, O, $) {
      if (O == null) throw Error(o(151));
      for (var Me = null, ht = null, Xe = S, $e = S = 0, es = null, bt = O.next(); Xe !== null && !bt.done; $e++, bt = O.next()) {
        Xe.index > $e ? (es = Xe, Xe = null) : es = Xe.sibling;
        var Ul = U(E, Xe, bt.value, $);
        if (Ul === null) {
          Xe === null && (Xe = es);
          break;
        }
        e && Xe && Ul.alternate === null && t(E, Xe), S = i(Ul, S, $e), ht === null ? Me = Ul : ht.sibling = Ul, ht = Ul, Xe = es;
      }
      if (bt.done)
        return l(E, Xe), yt && Ql(E, $e), Me;
      if (Xe === null) {
        for (; !bt.done; $e++, bt = O.next())
          bt = ee(E, bt.value, $), bt !== null && (S = i(bt, S, $e), ht === null ? Me = bt : ht.sibling = bt, ht = bt);
        return yt && Ql(E, $e), Me;
      }
      for (Xe = a(Xe); !bt.done; $e++, bt = O.next())
        bt = q(Xe, E, $e, bt.value, $), bt !== null && (e && bt.alternate !== null && Xe.delete(bt.key === null ? $e : bt.key), S = i(bt, S, $e), ht === null ? Me = bt : ht.sibling = bt, ht = bt);
      return e && Xe.forEach(function(mj) {
        return t(E, mj);
      }), yt && Ql(E, $e), Me;
    }
    function Ot(E, S, O, $) {
      if (typeof O == "object" && O !== null && O.type === me && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case k:
            e: {
              for (var Me = O.key; S !== null; ) {
                if (S.key === Me) {
                  if (Me = O.type, Me === me) {
                    if (S.tag === 7) {
                      l(
                        E,
                        S.sibling
                      ), $ = n(
                        S,
                        O.props.children
                      ), $.return = E, E = $;
                      break e;
                    }
                  } else if (S.elementType === Me || typeof Me == "object" && Me !== null && Me.$$typeof === Re && Nd(Me) === S.type) {
                    l(
                      E,
                      S.sibling
                    ), $ = n(S, O.props), mn($, O), $.return = E, E = $;
                    break e;
                  }
                  l(E, S);
                  break;
                } else t(E, S);
                S = S.sibling;
              }
              O.type === me ? ($ = Gl(
                O.props.children,
                E.mode,
                $,
                O.key
              ), $.return = E, E = $) : ($ = ai(
                O.type,
                O.key,
                O.props,
                null,
                E.mode,
                $
              ), mn($, O), $.return = E, E = $);
            }
            return c(E);
          case se:
            e: {
              for (Me = O.key; S !== null; ) {
                if (S.key === Me)
                  if (S.tag === 4 && S.stateNode.containerInfo === O.containerInfo && S.stateNode.implementation === O.implementation) {
                    l(
                      E,
                      S.sibling
                    ), $ = n(S, O.children || []), $.return = E, E = $;
                    break e;
                  } else {
                    l(E, S);
                    break;
                  }
                else t(E, S);
                S = S.sibling;
              }
              $ = Dc(O, E.mode, $), $.return = E, E = $;
            }
            return c(E);
          case Re:
            return Me = O._init, O = Me(O._payload), Ot(
              E,
              S,
              O,
              $
            );
        }
        if (oe(O))
          return Pe(
            E,
            S,
            O,
            $
          );
        if (pe(O)) {
          if (Me = pe(O), typeof Me != "function") throw Error(o(150));
          return O = Me.call(O), Je(
            E,
            S,
            O,
            $
          );
        }
        if (typeof O.then == "function")
          return Ot(
            E,
            S,
            yi(O),
            $
          );
        if (O.$$typeof === F)
          return Ot(
            E,
            S,
            ri(E, O),
            $
          );
        _i(E, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, S !== null && S.tag === 6 ? (l(E, S.sibling), $ = n(S, O), $.return = E, E = $) : (l(E, S), $ = Rc(O, E.mode, $), $.return = E, E = $), c(E)) : l(E, S);
    }
    return function(E, S, O, $) {
      try {
        fn = 0;
        var Me = Ot(
          E,
          S,
          O,
          $
        );
        return ya = null, Me;
      } catch (Xe) {
        if (Xe === ln || Xe === oi) throw Xe;
        var ht = vs(29, Xe, null, E.mode);
        return ht.lanes = $, ht.return = E, ht;
      } finally {
      }
    };
  }
  var _a = Sd(!0), wd = Sd(!1), zs = B(null), Gs = null;
  function bl(e) {
    var t = e.alternate;
    ae(Ft, Ft.current & 1), ae(zs, e), Gs === null && (t === null || va.current !== null || t.memoizedState !== null) && (Gs = e);
  }
  function kd(e) {
    if (e.tag === 22) {
      if (ae(Ft, Ft.current), ae(zs, e), Gs === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Gs = e);
      }
    } else yl();
  }
  function yl() {
    ae(Ft, Ft.current), ae(zs, zs.current);
  }
  function al(e) {
    I(zs), Gs === e && (Gs = null), I(Ft);
  }
  var Ft = B(0);
  function Ni(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || su(l)))
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
  function fr(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : M({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var mr = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = ys(), n = vl(a);
      n.payload = t, l != null && (n.callback = l), t = pl(e, n, a), t !== null && (_s(t, e, a), nn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = ys(), n = vl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = pl(e, n, a), t !== null && (_s(t, e, a), nn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = ys(), a = vl(l);
      a.tag = 2, t != null && (a.callback = t), t = pl(e, a, l), t !== null && (_s(t, e, l), nn(t, e, l));
    }
  };
  function Cd(e, t, l, a, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, c) : t.prototype && t.prototype.isPureReactComponent ? !$a(l, a) || !$a(n, i) : !0;
  }
  function Ed(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && mr.enqueueReplaceState(t, t.state, null);
  }
  function Fl(e, t) {
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
  var Si = typeof reportError == "function" ? reportError : function(e) {
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
  function Od(e) {
    Si(e);
  }
  function Td(e) {
    console.error(e);
  }
  function zd(e) {
    Si(e);
  }
  function wi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Ad(e, t, l) {
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
  function xr(e, t, l) {
    return l = vl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      wi(e, t);
    }, l;
  }
  function Rd(e) {
    return e = vl(e), e.tag = 3, e;
  }
  function Dd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        Ad(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      Ad(t, l, a), typeof n != "function" && (Cl === null ? Cl = /* @__PURE__ */ new Set([this]) : Cl.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function mx(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && en(
        t,
        l,
        n,
        !0
      ), l = zs.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Gs === null ? Br() : l.alternate === null && Lt === 0 && (Lt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Qc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Yr(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Qc ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Yr(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return Yr(e, a, n), Br(), !1;
    }
    if (yt)
      return t = zs.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== qc && (e = Error(o(422), { cause: a }), Pa(Cs(e, l)))) : (a !== qc && (t = Error(o(423), {
        cause: a
      }), Pa(
        Cs(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Cs(a, l), n = xr(
        e.stateNode,
        a,
        n
      ), Jc(e, n), Lt !== 4 && (Lt = 2)), !1;
    var i = Error(o(520), { cause: a });
    if (i = Cs(i, l), yn === null ? yn = [i] : yn.push(i), Lt !== 4 && (Lt = 2), t === null) return !0;
    a = Cs(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = xr(l.stateNode, a, e), Jc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (Cl === null || !Cl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Rd(n), Dd(
              n,
              e,
              l,
              a
            ), Jc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Ud = Error(o(461)), It = !1;
  function ts(e, t, l, a) {
    t.child = e === null ? wd(t, null, l, a) : _a(
      t,
      e.child,
      l,
      a
    );
  }
  function Md(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var d in a)
        d !== "ref" && (c[d] = a[d]);
    } else c = a;
    return Kl(t), a = Ic(
      e,
      t,
      l,
      c,
      i,
      n
    ), d = Pc(), e !== null && !It ? (er(e, t, n), nl(e, t, n)) : (yt && d && Uc(t), t.flags |= 1, ts(e, t, a, n), t.child);
  }
  function qd(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !Ac(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Hd(
        e,
        t,
        i,
        a,
        n
      )) : (e = ai(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !Nr(e, n)) {
      var c = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : $a, l(c, a) && e.ref === t.ref)
        return nl(e, t, n);
    }
    return t.flags |= 1, e = Is(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Hd(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if ($a(i, a) && e.ref === t.ref)
        if (It = !1, t.pendingProps = a = i, Nr(e, n))
          (e.flags & 131072) !== 0 && (It = !0);
        else
          return t.lanes = e.lanes, nl(e, t, n);
    }
    return jr(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Bd(e, t, l) {
    var a = t.pendingProps, n = a.children, i = e !== null ? e.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = i !== null ? i.baseLanes | l : l, e !== null) {
          for (n = t.child = e.child, i = 0; n !== null; )
            i = i | n.lanes | n.childLanes, n = n.sibling;
          t.childLanes = i & ~a;
        } else t.childLanes = 0, t.child = null;
        return Ld(
          e,
          t,
          a,
          l
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ui(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Ho(t, i) : $c(), kd(t);
      else
        return t.lanes = t.childLanes = 536870912, Ld(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ui(t, i.cachePool), Ho(t, i), yl(), t.memoizedState = null) : (e !== null && ui(t, null), $c(), yl());
    return ts(e, t, n, l), t.child;
  }
  function Ld(e, t, l, a) {
    var n = Xc();
    return n = n === null ? null : { parent: Wt._currentValue, pool: n }, t.memoizedState = {
      baseLanes: l,
      cachePool: n
    }, e !== null && ui(t, null), $c(), kd(t), e !== null && en(e, t, a, !0), null;
  }
  function ki(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function jr(e, t, l, a, n) {
    return Kl(t), l = Ic(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Pc(), e !== null && !It ? (er(e, t, n), nl(e, t, n)) : (yt && a && Uc(t), t.flags |= 1, ts(e, t, l, n), t.child);
  }
  function Yd(e, t, l, a, n, i) {
    return Kl(t), t.updateQueue = null, l = Lo(
      t,
      a,
      l,
      n
    ), Bo(e), a = Pc(), e !== null && !It ? (er(e, t, i), nl(e, t, i)) : (yt && a && Uc(t), t.flags |= 1, ts(e, t, l, i), t.child);
  }
  function Gd(e, t, l, a, n) {
    if (Kl(t), t.stateNode === null) {
      var i = ha, c = l.contextType;
      typeof c == "object" && c !== null && (i = as(c)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = mr, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, Zc(t), c = l.contextType, i.context = typeof c == "object" && c !== null ? as(c) : ha, i.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (fr(
        t,
        l,
        c,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && mr.enqueueReplaceState(i, i.state, null), rn(t, a, i, n), cn(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, p = Fl(l, d);
      i.props = p;
      var A = i.context, J = l.contextType;
      c = ha, typeof J == "object" && J !== null && (c = as(J));
      var ee = l.getDerivedStateFromProps;
      J = typeof ee == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, J || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || A !== c) && Ed(
        t,
        i,
        a,
        c
      ), jl = !1;
      var U = t.memoizedState;
      i.state = U, rn(t, a, i, n), cn(), A = t.memoizedState, d || U !== A || jl ? (typeof ee == "function" && (fr(
        t,
        l,
        ee,
        a
      ), A = t.memoizedState), (p = jl || Cd(
        t,
        l,
        p,
        a,
        U,
        A,
        c
      )) ? (J || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = A), i.props = a, i.state = A, i.context = c, a = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Vc(e, t), c = t.memoizedProps, J = Fl(l, c), i.props = J, ee = t.pendingProps, U = i.context, A = l.contextType, p = ha, typeof A == "object" && A !== null && (p = as(A)), d = l.getDerivedStateFromProps, (A = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== ee || U !== p) && Ed(
        t,
        i,
        a,
        p
      ), jl = !1, U = t.memoizedState, i.state = U, rn(t, a, i, n), cn();
      var q = t.memoizedState;
      c !== ee || U !== q || jl || e !== null && e.dependencies !== null && ci(e.dependencies) ? (typeof d == "function" && (fr(
        t,
        l,
        d,
        a
      ), q = t.memoizedState), (J = jl || Cd(
        t,
        l,
        J,
        a,
        U,
        q,
        p
      ) || e !== null && e.dependencies !== null && ci(e.dependencies)) ? (A || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, q, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        q,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = q), i.props = a, i.state = q, i.context = p, a = J) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, ki(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = _a(
      t,
      e.child,
      null,
      n
    ), t.child = _a(
      t,
      null,
      l,
      n
    )) : ts(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = nl(
      e,
      t,
      n
    ), e;
  }
  function Xd(e, t, l, a) {
    return Ia(), t.flags |= 256, ts(e, t, l, a), t.child;
  }
  var vr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function pr(e) {
    return { baseLanes: e, cachePool: To() };
  }
  function gr(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= As), e;
  }
  function Qd(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Ft.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (yt) {
        if (n ? bl(t) : yl(), yt) {
          var d = Bt, p;
          if (p = d) {
            e: {
              for (p = d, d = Ys; p.nodeType !== 8; ) {
                if (!d) {
                  d = null;
                  break e;
                }
                if (p = qs(
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
              treeContext: Xl !== null ? { id: Ps, overflow: el } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = vs(
              18,
              null,
              null,
              0
            ), p.stateNode = d, p.return = t, t.child = p, rs = t, Bt = null, p = !0) : p = !1;
          }
          p || Vl(t);
        }
        if (d = t.memoizedState, d !== null && (d = d.dehydrated, d !== null))
          return su(d) ? t.lanes = 32 : t.lanes = 536870912, null;
        al(t);
      }
      return d = a.children, a = a.fallback, n ? (yl(), n = t.mode, d = Ci(
        { mode: "hidden", children: d },
        n
      ), a = Gl(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, n = t.child, n.memoizedState = pr(l), n.childLanes = gr(
        e,
        c,
        l
      ), t.memoizedState = vr, a) : (bl(t), br(t, d));
    }
    if (p = e.memoizedState, p !== null && (d = p.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (bl(t), t.flags &= -257, t = yr(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (yl(), t.child = e.child, t.flags |= 128, t = null) : (yl(), n = a.fallback, d = t.mode, a = Ci(
          { mode: "visible", children: a.children },
          d
        ), n = Gl(
          n,
          d,
          l,
          null
        ), n.flags |= 2, a.return = t, n.return = t, a.sibling = n, t.child = a, _a(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = pr(l), a.childLanes = gr(
          e,
          c,
          l
        ), t.memoizedState = vr, t = n);
      else if (bl(t), su(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var A = c.dgst;
        c = A, a = Error(o(419)), a.stack = "", a.digest = c, Pa({ value: a, source: null, stack: null }), t = yr(
          e,
          t,
          l
        );
      } else if (It || en(e, t, l, !1), c = (l & e.childLanes) !== 0, It || c) {
        if (c = zt, c !== null && (a = l & -l, a = (a & 42) !== 0 ? 1 : fe(a), a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a, a !== 0 && a !== p.retryLane))
          throw p.retryLane = a, da(e, a), _s(c, e, a), Ud;
        d.data === "$?" || Br(), t = yr(
          e,
          t,
          l
        );
      } else
        d.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Bt = qs(
          d.nextSibling
        ), rs = t, yt = !0, Zl = null, Ys = !1, e !== null && (Os[Ts++] = Ps, Os[Ts++] = el, Os[Ts++] = Xl, Ps = e.id, el = e.overflow, Xl = t), t = br(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (yl(), n = a.fallback, d = t.mode, p = e.child, A = p.sibling, a = Is(p, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = p.subtreeFlags & 65011712, A !== null ? n = Is(A, n) : (n = Gl(
      n,
      d,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, a = n, n = t.child, d = e.child.memoizedState, d === null ? d = pr(l) : (p = d.cachePool, p !== null ? (A = Wt._currentValue, p = p.parent !== A ? { parent: A, pool: A } : p) : p = To(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: p
    }), n.memoizedState = d, n.childLanes = gr(
      e,
      c,
      l
    ), t.memoizedState = vr, a) : (bl(t), l = e.child, e = l.sibling, l = Is(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function br(e, t) {
    return t = Ci(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Ci(e, t) {
    return e = vs(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function yr(e, t, l) {
    return _a(t, e.child, null, l), e = br(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Zd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Bc(e.return, t, l);
  }
  function _r(e, t, l, a, n) {
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
  function Vd(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    if (ts(e, t, a.children, l), a = Ft.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Zd(e, l, t);
          else if (e.tag === 19)
            Zd(e, l, t);
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
    switch (ae(Ft, a), n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && Ni(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), _r(
          t,
          !1,
          n,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Ni(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        _r(
          t,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        _r(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function nl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), kl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (en(
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
      for (e = t.child, l = Is(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Is(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Nr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ci(e)));
  }
  function xx(e, t, l) {
    switch (t.tag) {
      case 3:
        re(t, t.stateNode.containerInfo), xl(t, Wt, e.memoizedState.cache), Ia();
        break;
      case 27:
      case 5:
        et(t);
        break;
      case 4:
        re(t, t.stateNode.containerInfo);
        break;
      case 10:
        xl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (bl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Qd(e, t, l) : (bl(t), e = nl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        bl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (en(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Vd(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), ae(Ft, Ft.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Bd(e, t, l);
      case 24:
        xl(t, Wt, e.memoizedState.cache);
    }
    return nl(e, t, l);
  }
  function Jd(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        It = !0;
      else {
        if (!Nr(e, l) && (t.flags & 128) === 0)
          return It = !1, xx(
            e,
            t,
            l
          );
        It = (e.flags & 131072) !== 0;
      }
    else
      It = !1, yt && (t.flags & 1048576) !== 0 && No(t, ii, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, n = a._init;
          if (a = n(a._payload), t.type = a, typeof a == "function")
            Ac(a) ? (e = Fl(a, e), t.tag = 1, t = Gd(
              null,
              t,
              a,
              e,
              l
            )) : (t.tag = 0, t = jr(
              null,
              t,
              a,
              e,
              l
            ));
          else {
            if (a != null) {
              if (n = a.$$typeof, n === ue) {
                t.tag = 11, t = Md(
                  null,
                  t,
                  a,
                  e,
                  l
                );
                break e;
              } else if (n === je) {
                t.tag = 14, t = qd(
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
        return jr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = Fl(
          a,
          t.pendingProps
        ), Gd(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (re(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Vc(e, t), rn(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, xl(t, Wt, a), a !== i.cache && Lc(
            t,
            [Wt],
            l,
            !0
          ), cn(), a = c.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Xd(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Cs(
                Error(o(424)),
                t
              ), Pa(n), t = Xd(
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
              for (Bt = qs(e.firstChild), rs = t, yt = !0, Zl = null, Ys = !0, l = wd(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Ia(), a === n) {
              t = nl(
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
        return ki(e, t), e === null ? (l = Fh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : yt || (l = t.type, e = t.pendingProps, a = Yi(
          W.current
        ).createElement(l), a[ut] = t, a[Nt] = e, ls(a, l, e), At(a), t.stateNode = a) : t.memoizedState = Fh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return et(t), e === null && yt && (a = t.stateNode = Kh(
          t.type,
          t.pendingProps,
          W.current
        ), rs = t, Ys = !0, n = Bt, Tl(t.type) ? (lu = n, Bt = qs(
          a.firstChild
        )) : Bt = n), ts(
          e,
          t,
          t.pendingProps.children,
          l
        ), ki(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && yt && ((n = a = Bt) && (a = Xx(
          a,
          t.type,
          t.pendingProps,
          Ys
        ), a !== null ? (t.stateNode = a, rs = t, Bt = qs(
          a.firstChild
        ), Ys = !1, n = !0) : n = !1), n || Vl(t)), et(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = i.children, Pr(n, i) ? a = null : c !== null && Pr(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Ic(
          e,
          t,
          cx,
          null,
          null,
          l
        ), Tn._currentValue = n), ki(e, t), ts(e, t, a, l), t.child;
      case 6:
        return e === null && yt && ((e = l = Bt) && (l = Qx(
          l,
          t.pendingProps,
          Ys
        ), l !== null ? (t.stateNode = l, rs = t, Bt = null, e = !0) : e = !1), e || Vl(t)), null;
      case 13:
        return Qd(e, t, l);
      case 4:
        return re(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = _a(
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
        return Md(
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
        return a = t.pendingProps, xl(t, t.type, a.value), ts(
          e,
          t,
          a.children,
          l
        ), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Kl(t), n = as(n), a = a(n), t.flags |= 1, ts(e, t, a, l), t.child;
      case 14:
        return qd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Hd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Vd(e, t, l);
      case 31:
        return a = t.pendingProps, l = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, e === null ? (l = Ci(
          a,
          l
        ), l.ref = t.ref, t.child = l, l.return = t, t = l) : (l = Is(e.child, a), l.ref = t.ref, t.child = l, l.return = t, t = l), t;
      case 22:
        return Bd(e, t, l);
      case 24:
        return Kl(t), a = as(Wt), e === null ? (n = Xc(), n === null && (n = zt, i = Yc(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = {
          parent: a,
          cache: n
        }, Zc(t), xl(t, Wt, n)) : ((e.lanes & l) !== 0 && (Vc(e, t), rn(t, null, null, l), cn()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), xl(t, Wt, a)) : (a = i.cache, xl(t, Wt, a), a !== n.cache && Lc(
          t,
          [Wt],
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
  function il(e) {
    e.flags |= 4;
  }
  function Kd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !sf(t)) {
      if (t = zs.current, t !== null && ((vt & 4194048) === vt ? Gs !== null : (vt & 62914560) !== vt && (vt & 536870912) === 0 || t !== Gs))
        throw an = Qc, zo;
      e.flags |= 8192;
    }
  }
  function Ei(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? T() : 536870912, e.lanes |= t, ka |= t);
  }
  function xn(e, t) {
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
    switch (Mc(t), t.tag) {
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
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), sl(Wt), Ae(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Fa(t) ? il(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, ko())), Ut(t), null;
      case 26:
        return l = t.memoizedState, e === null ? (il(t), l !== null ? (Ut(t), Kd(t, l)) : (Ut(t), t.flags &= -16777217)) : l ? l !== e.memoizedState ? (il(t), Ut(t), Kd(t, l)) : (Ut(t), t.flags &= -16777217) : (e.memoizedProps !== a && il(t), Ut(t), t.flags &= -16777217), null;
      case 27:
        it(t), l = W.current;
        var n = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && il(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ut(t), null;
          }
          e = ie.current, Fa(t) ? So(t) : (e = Kh(n, a, l), t.stateNode = e, il(t));
        }
        return Ut(t), null;
      case 5:
        if (it(t), l = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && il(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ut(t), null;
          }
          if (e = ie.current, Fa(t))
            So(t);
          else {
            switch (n = Yi(
              W.current
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
            e && il(t);
          }
        }
        return Ut(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && il(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = W.current, Fa(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = rs, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[ut] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Yh(e.nodeValue, l)), e || Vl(t);
          } else
            e = Yi(e).createTextNode(
              a
            ), e[ut] = t, t.stateNode = e;
        }
        return Ut(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Fa(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[ut] = t;
            } else
              Ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ut(t), n = !1;
          } else
            n = ko(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (al(t), t) : (al(t), null);
        }
        if (al(t), (t.flags & 128) !== 0)
          return t.lanes = l, t;
        if (l = a !== null, e = e !== null && e.memoizedState !== null, l) {
          a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool);
          var i = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048);
        }
        return l !== e && l && (t.child.flags |= 8192), Ei(t, t.updateQueue), Ut(t), null;
      case 4:
        return Ae(), e === null && Kr(t.stateNode.containerInfo), Ut(t), null;
      case 10:
        return sl(t.type), Ut(t), null;
      case 19:
        if (I(Ft), n = t.memoizedState, n === null) return Ut(t), null;
        if (a = (t.flags & 128) !== 0, i = n.rendering, i === null)
          if (a) xn(n, !1);
          else {
            if (Lt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = Ni(e), i !== null) {
                  for (t.flags |= 128, xn(n, !1), e = i.updateQueue, t.updateQueue = e, Ei(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    _o(l, e), l = l.sibling;
                  return ae(
                    Ft,
                    Ft.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            n.tail !== null && He() > zi && (t.flags |= 128, a = !0, xn(n, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = Ni(i), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Ei(t, e), xn(n, !0), n.tail === null && n.tailMode === "hidden" && !i.alternate && !yt)
                return Ut(t), null;
            } else
              2 * He() - n.renderingStartTime > zi && l !== 536870912 && (t.flags |= 128, a = !0, xn(n, !1), t.lanes = 4194304);
          n.isBackwards ? (i.sibling = t.child, t.child = i) : (e = n.last, e !== null ? e.sibling = i : t.child = i, n.last = i);
        }
        return n.tail !== null ? (t = n.tail, n.rendering = t, n.tail = t.sibling, n.renderingStartTime = He(), t.sibling = null, e = Ft.current, ae(Ft, a ? e & 1 | 2 : e & 1), t) : (Ut(t), null);
      case 22:
      case 23:
        return al(t), Wc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Ut(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ut(t), l = t.updateQueue, l !== null && Ei(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && I($l), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), sl(Wt), Ut(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function vx(e, t) {
    switch (Mc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return sl(Wt), Ae(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return it(t), null;
      case 13:
        if (al(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return I(Ft), null;
      case 4:
        return Ae(), null;
      case 10:
        return sl(t.type), null;
      case 22:
      case 23:
        return al(t), Wc(), e !== null && I($l), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return sl(Wt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function $d(e, t) {
    switch (Mc(t), t.tag) {
      case 3:
        sl(Wt), Ae();
        break;
      case 26:
      case 27:
      case 5:
        it(t);
        break;
      case 4:
        Ae();
        break;
      case 13:
        al(t);
        break;
      case 19:
        I(Ft);
        break;
      case 10:
        sl(t.type);
        break;
      case 22:
      case 23:
        al(t), Wc(), e !== null && I($l);
        break;
      case 24:
        sl(Wt);
    }
  }
  function jn(e, t) {
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
  function _l(e, t, l) {
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
              var p = l, A = d;
              try {
                A();
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
  function Wd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        qo(t, l);
      } catch (a) {
        Tt(e, e.return, a);
      }
    }
  }
  function Fd(e, t, l) {
    l.props = Fl(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Tt(e, t, a);
    }
  }
  function vn(e, t) {
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
  function Xs(e, t) {
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
  function Id(e) {
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
  function Sr(e, t, l) {
    try {
      var a = e.stateNode;
      Hx(a, e.type, l, t), a[Nt] = t;
    } catch (n) {
      Tt(e, e.return, n);
    }
  }
  function Pd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Tl(e.type) || e.tag === 4;
  }
  function wr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Pd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Tl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function kr(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Li));
    else if (a !== 4 && (a === 27 && Tl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (kr(e, t, l), e = e.sibling; e !== null; )
        kr(e, t, l), e = e.sibling;
  }
  function Oi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Tl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Oi(e, t, l), e = e.sibling; e !== null; )
        Oi(e, t, l), e = e.sibling;
  }
  function eh(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ls(t, a, l), t[ut] = e, t[Nt] = l;
    } catch (i) {
      Tt(e, e.return, i);
    }
  }
  var cl = !1, Xt = !1, Cr = !1, th = typeof WeakSet == "function" ? WeakSet : Set, Pt = null;
  function px(e, t) {
    if (e = e.containerInfo, Fr = Ji, e = ho(e), wc(e)) {
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
            var c = 0, d = -1, p = -1, A = 0, J = 0, ee = e, U = null;
            t: for (; ; ) {
              for (var q; ee !== l || n !== 0 && ee.nodeType !== 3 || (d = c + n), ee !== i || a !== 0 && ee.nodeType !== 3 || (p = c + a), ee.nodeType === 3 && (c += ee.nodeValue.length), (q = ee.firstChild) !== null; )
                U = ee, ee = q;
              for (; ; ) {
                if (ee === e) break t;
                if (U === l && ++A === n && (d = c), U === i && ++J === a && (p = c), (q = ee.nextSibling) !== null) break;
                ee = U, U = ee.parentNode;
              }
              ee = q;
            }
            l = d === -1 || p === -1 ? null : { start: d, end: p };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Ir = { focusedElem: e, selectionRange: l }, Ji = !1, Pt = t; Pt !== null; )
      if (t = Pt, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, Pt = e;
      else
        for (; Pt !== null; ) {
          switch (t = Pt, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var Pe = Fl(
                    l.type,
                    n,
                    l.elementType === l.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    Pe,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Je) {
                  Tt(
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
                  tu(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      tu(e);
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
            e.return = t.return, Pt = e;
            break;
          }
          Pt = t.return;
        }
  }
  function sh(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        Nl(e, l), a & 4 && jn(5, l);
        break;
      case 1:
        if (Nl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              Tt(l, l.return, c);
            }
          else {
            var n = Fl(
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
        a & 64 && Wd(l), a & 512 && vn(l, l.return);
        break;
      case 3:
        if (Nl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            qo(e, t);
          } catch (c) {
            Tt(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && eh(l);
      case 26:
      case 5:
        Nl(e, l), t === null && a & 4 && Id(l), a & 512 && vn(l, l.return);
        break;
      case 12:
        Nl(e, l);
        break;
      case 13:
        Nl(e, l), a & 4 && nh(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Cx.bind(
          null,
          l
        ), Zx(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || cl, !a) {
          t = t !== null && t.memoizedState !== null || Xt, n = cl;
          var i = Xt;
          cl = a, (Xt = t) && !i ? Sl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : Nl(e, l), cl = n, Xt = i;
        }
        break;
      case 30:
        break;
      default:
        Nl(e, l);
    }
  }
  function lh(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, lh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ze(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Dt = null, ms = !1;
  function rl(e, t, l) {
    for (l = l.child; l !== null; )
      ah(e, t, l), l = l.sibling;
  }
  function ah(e, t, l) {
    if (Ne && typeof Ne.onCommitFiberUnmount == "function")
      try {
        Ne.onCommitFiberUnmount(P, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Xt || Xs(l, t), rl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Xt || Xs(l, t);
        var a = Dt, n = ms;
        Tl(l.type) && (Dt = l.stateNode, ms = !1), rl(
          e,
          t,
          l
        ), kn(l.stateNode), Dt = a, ms = n;
        break;
      case 5:
        Xt || Xs(l, t);
      case 6:
        if (a = Dt, n = ms, Dt = null, rl(
          e,
          t,
          l
        ), Dt = a, ms = n, Dt !== null)
          if (ms)
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
        Dt !== null && (ms ? (e = Dt, Vh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Dn(e)) : Vh(Dt, l.stateNode));
        break;
      case 4:
        a = Dt, n = ms, Dt = l.stateNode.containerInfo, ms = !0, rl(
          e,
          t,
          l
        ), Dt = a, ms = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Xt || _l(2, l, t), Xt || _l(4, l, t), rl(
          e,
          t,
          l
        );
        break;
      case 1:
        Xt || (Xs(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Fd(
          l,
          t,
          a
        )), rl(
          e,
          t,
          l
        );
        break;
      case 21:
        rl(
          e,
          t,
          l
        );
        break;
      case 22:
        Xt = (a = Xt) || l.memoizedState !== null, rl(
          e,
          t,
          l
        ), Xt = a;
        break;
      default:
        rl(
          e,
          t,
          l
        );
    }
  }
  function nh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Dn(e);
      } catch (l) {
        Tt(t, t.return, l);
      }
  }
  function gx(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new th()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new th()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Er(e, t) {
    var l = gx(e);
    t.forEach(function(a) {
      var n = Ex.bind(null, e, a);
      l.has(a) || (l.add(a), a.then(n, n));
    });
  }
  function ps(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (Tl(d.type)) {
                Dt = d.stateNode, ms = !1;
                break e;
              }
              break;
            case 5:
              Dt = d.stateNode, ms = !1;
              break e;
            case 3:
            case 4:
              Dt = d.stateNode.containerInfo, ms = !0;
              break e;
          }
          d = d.return;
        }
        if (Dt === null) throw Error(o(160));
        ah(i, c, n), Dt = null, ms = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        ih(t, e), t = t.sibling;
  }
  var Ms = null;
  function ih(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ps(t, e), gs(e), a & 4 && (_l(3, e, e.return), jn(3, e), _l(5, e, e.return));
        break;
      case 1:
        ps(t, e), gs(e), a & 512 && (Xt || l === null || Xs(l, l.return)), a & 64 && cl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Ms;
        if (ps(t, e), gs(e), a & 512 && (Xt || l === null || Xs(l, l.return)), a & 4) {
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
                      )), ls(i, a, l), i[ut] = e, At(i), a = i;
                      break e;
                    case "link":
                      var c = ef(
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
                      if (c = ef(
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
                  i[ut] = e, At(i), a = i;
                }
                e.stateNode = a;
              } else
                tf(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Ph(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? tf(
              n,
              e.type,
              e.stateNode
            ) : Ph(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && Sr(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ps(t, e), gs(e), a & 512 && (Xt || l === null || Xs(l, l.return)), l !== null && a & 4 && Sr(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ps(t, e), gs(e), a & 512 && (Xt || l === null || Xs(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            aa(n, "");
          } catch (q) {
            Tt(e, e.return, q);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, Sr(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (Cr = !0);
        break;
      case 6:
        if (ps(t, e), gs(e), a & 4) {
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
        if (Qi = null, n = Ms, Ms = Gi(t.containerInfo), ps(t, e), Ms = n, gs(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Dn(t.containerInfo);
          } catch (q) {
            Tt(e, e.return, q);
          }
        Cr && (Cr = !1, ch(e));
        break;
      case 4:
        a = Ms, Ms = Gi(
          e.stateNode.containerInfo
        ), ps(t, e), gs(e), Ms = a;
        break;
      case 12:
        ps(t, e), gs(e);
        break;
      case 13:
        ps(t, e), gs(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Dr = He()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Er(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = l !== null && l.memoizedState !== null, A = cl, J = Xt;
        if (cl = A || n, Xt = J || p, ps(t, e), Xt = J, cl = A, gs(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || p || cl || Xt || Il(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                p = l = t;
                try {
                  if (i = p.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    d = p.stateNode;
                    var ee = p.memoizedProps.style, U = ee != null && ee.hasOwnProperty("display") ? ee.display : null;
                    d.style.display = U == null || typeof U == "boolean" ? "" : ("" + U).trim();
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Er(e, l))));
        break;
      case 19:
        ps(t, e), gs(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Er(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ps(t, e), gs(e);
    }
  }
  function gs(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Pd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = wr(e);
            Oi(e, i, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (aa(c, ""), l.flags &= -33);
            var d = wr(e);
            Oi(e, d, c);
            break;
          case 3:
          case 4:
            var p = l.stateNode.containerInfo, A = wr(e);
            kr(
              e,
              A,
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
  function ch(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        ch(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Nl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        sh(e, t.alternate, t), t = t.sibling;
  }
  function Il(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _l(4, t, t.return), Il(t);
          break;
        case 1:
          Xs(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && Fd(
            t,
            t.return,
            l
          ), Il(t);
          break;
        case 27:
          kn(t.stateNode);
        case 26:
        case 5:
          Xs(t, t.return), Il(t);
          break;
        case 22:
          t.memoizedState === null && Il(t);
          break;
        case 30:
          Il(t);
          break;
        default:
          Il(t);
      }
      e = e.sibling;
    }
  }
  function Sl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Sl(
            n,
            i,
            l
          ), jn(4, i);
          break;
        case 1:
          if (Sl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (A) {
              Tt(a, a.return, A);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var d = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Mo(p[n], d);
            } catch (A) {
              Tt(a, a.return, A);
            }
          }
          l && c & 64 && Wd(i), vn(i, i.return);
          break;
        case 27:
          eh(i);
        case 26:
        case 5:
          Sl(
            n,
            i,
            l
          ), l && a === null && c & 4 && Id(i), vn(i, i.return);
          break;
        case 12:
          Sl(
            n,
            i,
            l
          );
          break;
        case 13:
          Sl(
            n,
            i,
            l
          ), l && c & 4 && nh(n, i);
          break;
        case 22:
          i.memoizedState === null && Sl(
            n,
            i,
            l
          ), vn(i, i.return);
          break;
        case 30:
          break;
        default:
          Sl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Or(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && tn(l));
  }
  function Tr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && tn(e));
  }
  function Qs(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        rh(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function rh(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Qs(
          e,
          t,
          l,
          a
        ), n & 2048 && jn(9, t);
        break;
      case 1:
        Qs(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Qs(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && tn(e)));
        break;
      case 12:
        if (n & 2048) {
          Qs(
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
          Qs(
            e,
            t,
            l,
            a
          );
        break;
      case 13:
        Qs(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Qs(
          e,
          t,
          l,
          a
        ) : pn(e, t) : i._visibility & 2 ? Qs(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, Na(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), n & 2048 && Or(c, t);
        break;
      case 24:
        Qs(
          e,
          t,
          l,
          a
        ), n & 2048 && Tr(t.alternate, t);
        break;
      default:
        Qs(
          e,
          t,
          l,
          a
        );
    }
  }
  function Na(e, t, l, a, n) {
    for (n = n && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var i = e, c = t, d = l, p = a, A = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Na(
            i,
            c,
            d,
            p,
            n
          ), jn(8, c);
          break;
        case 23:
          break;
        case 22:
          var J = c.stateNode;
          c.memoizedState !== null ? J._visibility & 2 ? Na(
            i,
            c,
            d,
            p,
            n
          ) : pn(
            i,
            c
          ) : (J._visibility |= 2, Na(
            i,
            c,
            d,
            p,
            n
          )), n && A & 2048 && Or(
            c.alternate,
            c
          );
          break;
        case 24:
          Na(
            i,
            c,
            d,
            p,
            n
          ), n && A & 2048 && Tr(c.alternate, c);
          break;
        default:
          Na(
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
  function pn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            pn(l, a), n & 2048 && Or(
              a.alternate,
              a
            );
            break;
          case 24:
            pn(l, a), n & 2048 && Tr(a.alternate, a);
            break;
          default:
            pn(l, a);
        }
        t = t.sibling;
      }
  }
  var gn = 8192;
  function Sa(e) {
    if (e.subtreeFlags & gn)
      for (e = e.child; e !== null; )
        uh(e), e = e.sibling;
  }
  function uh(e) {
    switch (e.tag) {
      case 26:
        Sa(e), e.flags & gn && e.memoizedState !== null && aj(
          Ms,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Sa(e);
        break;
      case 3:
      case 4:
        var t = Ms;
        Ms = Gi(e.stateNode.containerInfo), Sa(e), Ms = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = gn, gn = 16777216, Sa(e), gn = t) : Sa(e));
        break;
      default:
        Sa(e);
    }
  }
  function oh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function bn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Pt = a, hh(
            a,
            e
          );
        }
      oh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        dh(e), e = e.sibling;
  }
  function dh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        bn(e), e.flags & 2048 && _l(9, e, e.return);
        break;
      case 3:
        bn(e);
        break;
      case 12:
        bn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ti(e)) : bn(e);
        break;
      default:
        bn(e);
    }
  }
  function Ti(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Pt = a, hh(
            a,
            e
          );
        }
      oh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          _l(8, t, t.return), Ti(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Ti(t));
          break;
        default:
          Ti(t);
      }
      e = e.sibling;
    }
  }
  function hh(e, t) {
    for (; Pt !== null; ) {
      var l = Pt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          _l(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          tn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Pt = a;
      else
        e: for (l = e; Pt !== null; ) {
          a = Pt;
          var n = a.sibling, i = a.return;
          if (lh(a), a === l) {
            Pt = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Pt = n;
            break e;
          }
          Pt = i;
        }
    }
  }
  var bx = {
    getCacheForType: function(e) {
      var t = as(Wt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    }
  }, yx = typeof WeakMap == "function" ? WeakMap : Map, St = 0, zt = null, mt = null, vt = 0, wt = 0, bs = null, wl = !1, wa = !1, zr = !1, ul = 0, Lt = 0, kl = 0, Pl = 0, Ar = 0, As = 0, ka = 0, yn = null, xs = null, Rr = !1, Dr = 0, zi = 1 / 0, Ai = null, Cl = null, ss = 0, El = null, Ca = null, Ea = 0, Ur = 0, Mr = null, fh = null, _n = 0, qr = null;
  function ys() {
    if ((St & 2) !== 0 && vt !== 0)
      return vt & -vt;
    if (y.T !== null) {
      var e = xa;
      return e !== 0 ? e : Qr();
    }
    return kt();
  }
  function mh() {
    As === 0 && (As = (vt & 536870912) === 0 || yt ? jt() : 536870912);
    var e = zs.current;
    return e !== null && (e.flags |= 32), As;
  }
  function _s(e, t, l) {
    (e === zt && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null) && (Oa(e, 0), Ol(
      e,
      vt,
      As,
      !1
    )), ce(e, l), ((St & 2) === 0 || e !== zt) && (e === zt && ((St & 2) === 0 && (Pl |= l), Lt === 4 && Ol(
      e,
      vt,
      As,
      !1
    )), Zs(e));
  }
  function xh(e, t, l) {
    if ((St & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 124) === 0 && (t & e.expiredLanes) === 0 || xe(e, t), n = a ? Sx(e, t) : Lr(e, t, !0), i = a;
    do {
      if (n === 0) {
        wa && !a && Ol(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !_x(l)) {
          n = Lr(e, t, !1), i = !1;
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
              n = yn;
              var p = d.current.memoizedState.isDehydrated;
              if (p && (Oa(d, c).flags |= 256), c = Lr(
                d,
                c,
                !1
              ), c !== 2) {
                if (zr && !p) {
                  d.errorRecoveryDisabledLanes |= i, Pl |= i, n = 4;
                  break e;
                }
                i = xs, xs = n, i !== null && (xs === null ? xs = i : xs.push.apply(
                  xs,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Oa(e, 0), Ol(e, t, 0, !0);
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
              Ol(
                a,
                t,
                As,
                !wl
              );
              break e;
            case 2:
              xs = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = Dr + 300 - He(), 10 < n)) {
            if (Ol(
              a,
              t,
              As,
              !wl
            ), ge(a, 0, !0) !== 0) break e;
            a.timeoutHandle = Qh(
              jh.bind(
                null,
                a,
                l,
                xs,
                Ai,
                Rr,
                t,
                As,
                Pl,
                ka,
                wl,
                i,
                2,
                -0,
                0
              ),
              n
            );
            break e;
          }
          jh(
            a,
            l,
            xs,
            Ai,
            Rr,
            t,
            As,
            Pl,
            ka,
            wl,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Zs(e);
  }
  function jh(e, t, l, a, n, i, c, d, p, A, J, ee, U, q) {
    if (e.timeoutHandle = -1, ee = t.subtreeFlags, (ee & 8192 || (ee & 16785408) === 16785408) && (On = { stylesheets: null, count: 0, unsuspend: lj }, uh(t), ee = nj(), ee !== null)) {
      e.cancelPendingCommit = ee(
        Nh.bind(
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
          U,
          q
        )
      ), Ol(e, i, c, !A);
      return;
    }
    Nh(
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
            if (!js(i(), n)) return !1;
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
  function Ol(e, t, l, a) {
    t &= ~Ar, t &= ~Pl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - lt(n), c = 1 << i;
      a[i] = -1, n &= ~c;
    }
    l !== 0 && rt(e, l, t);
  }
  function Ri() {
    return (St & 6) === 0 ? (Nn(0), !1) : !0;
  }
  function Hr() {
    if (mt !== null) {
      if (wt === 0)
        var e = mt.return;
      else
        e = mt, tl = Jl = null, tr(e), ya = null, fn = 0, e = mt;
      for (; e !== null; )
        $d(e.alternate, e), e = e.return;
      mt = null;
    }
  }
  function Oa(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Lx(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Hr(), zt = e, mt = l = Is(e.current, null), vt = t, wt = 0, bs = null, wl = !1, wa = xe(e, t), zr = !1, ka = As = Ar = Pl = kl = Lt = 0, xs = yn = null, Rr = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - lt(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return ul = t, ti(), l;
  }
  function vh(e, t) {
    dt = null, y.H = bi, t === ln || t === oi ? (t = Do(), wt = 3) : t === zo ? (t = Do(), wt = 4) : wt = t === Ud ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, bs = t, mt === null && (Lt = 1, wi(
      e,
      Cs(t, e.current)
    ));
  }
  function ph() {
    var e = y.H;
    return y.H = bi, e === null ? bi : e;
  }
  function gh() {
    var e = y.A;
    return y.A = bx, e;
  }
  function Br() {
    Lt = 4, wl || (vt & 4194048) !== vt && zs.current !== null || (wa = !0), (kl & 134217727) === 0 && (Pl & 134217727) === 0 || zt === null || Ol(
      zt,
      vt,
      As,
      !1
    );
  }
  function Lr(e, t, l) {
    var a = St;
    St |= 2;
    var n = ph(), i = gh();
    (zt !== e || vt !== t) && (Ai = null, Oa(e, t)), t = !1;
    var c = Lt;
    e: do
      try {
        if (wt !== 0 && mt !== null) {
          var d = mt, p = bs;
          switch (wt) {
            case 8:
              Hr(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              zs.current === null && (t = !0);
              var A = wt;
              if (wt = 0, bs = null, Ta(e, d, p, A), l && wa) {
                c = 0;
                break e;
              }
              break;
            default:
              A = wt, wt = 0, bs = null, Ta(e, d, p, A);
          }
        }
        Nx(), c = Lt;
        break;
      } catch (J) {
        vh(e, J);
      }
    while (!0);
    return t && e.shellSuspendCounter++, tl = Jl = null, St = a, y.H = n, y.A = i, mt === null && (zt = null, vt = 0, ti()), c;
  }
  function Nx() {
    for (; mt !== null; ) bh(mt);
  }
  function Sx(e, t) {
    var l = St;
    St |= 2;
    var a = ph(), n = gh();
    zt !== e || vt !== t ? (Ai = null, zi = He() + 500, Oa(e, t)) : wa = xe(
      e,
      t
    );
    e: do
      try {
        if (wt !== 0 && mt !== null) {
          t = mt;
          var i = bs;
          t: switch (wt) {
            case 1:
              wt = 0, bs = null, Ta(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (Ao(i)) {
                wt = 0, bs = null, yh(t);
                break;
              }
              t = function() {
                wt !== 2 && wt !== 9 || zt !== e || (wt = 7), Zs(e);
              }, i.then(t, t);
              break e;
            case 3:
              wt = 7;
              break e;
            case 4:
              wt = 5;
              break e;
            case 7:
              Ao(i) ? (wt = 0, bs = null, yh(t)) : (wt = 0, bs = null, Ta(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (mt.tag) {
                case 26:
                  c = mt.memoizedState;
                case 5:
                case 27:
                  var d = mt;
                  if (!c || sf(c)) {
                    wt = 0, bs = null;
                    var p = d.sibling;
                    if (p !== null) mt = p;
                    else {
                      var A = d.return;
                      A !== null ? (mt = A, Di(A)) : mt = null;
                    }
                    break t;
                  }
              }
              wt = 0, bs = null, Ta(e, t, i, 5);
              break;
            case 6:
              wt = 0, bs = null, Ta(e, t, i, 6);
              break;
            case 8:
              Hr(), Lt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        wx();
        break;
      } catch (J) {
        vh(e, J);
      }
    while (!0);
    return tl = Jl = null, y.H = a, y.A = n, St = l, mt !== null ? 0 : (zt = null, vt = 0, ti(), Lt);
  }
  function wx() {
    for (; mt !== null && !De(); )
      bh(mt);
  }
  function bh(e) {
    var t = Jd(e.alternate, e, ul);
    e.memoizedProps = e.pendingProps, t === null ? Di(e) : mt = t;
  }
  function yh(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Yd(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          vt
        );
        break;
      case 11:
        t = Yd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          vt
        );
        break;
      case 5:
        tr(t);
      default:
        $d(l, t), t = mt = _o(t, ul), t = Jd(l, t, ul);
    }
    e.memoizedProps = e.pendingProps, t === null ? Di(e) : mt = t;
  }
  function Ta(e, t, l, a) {
    tl = Jl = null, tr(t), ya = null, fn = 0;
    var n = t.return;
    try {
      if (mx(
        e,
        n,
        t,
        l,
        vt
      )) {
        Lt = 1, wi(
          e,
          Cs(l, e.current)
        ), mt = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw mt = n, i;
      Lt = 1, wi(
        e,
        Cs(l, e.current)
      ), mt = null;
      return;
    }
    t.flags & 32768 ? (yt || a === 1 ? e = !0 : wa || (vt & 536870912) !== 0 ? e = !1 : (wl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = zs.current, a !== null && a.tag === 13 && (a.flags |= 16384))), _h(t, e)) : Di(t);
  }
  function Di(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        _h(
          t,
          wl
        );
        return;
      }
      e = t.return;
      var l = jx(
        t.alternate,
        t,
        ul
      );
      if (l !== null) {
        mt = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        mt = t;
        return;
      }
      mt = t = e;
    } while (t !== null);
    Lt === 0 && (Lt = 5);
  }
  function _h(e, t) {
    do {
      var l = vx(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, mt = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        mt = e;
        return;
      }
      mt = e = l;
    } while (e !== null);
    Lt = 6, mt = null;
  }
  function Nh(e, t, l, a, n, i, c, d, p) {
    e.cancelPendingCommit = null;
    do
      Ui();
    while (ss !== 0);
    if ((St & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= Tc, be(
        e,
        l,
        i,
        c,
        d,
        p
      ), e === zt && (mt = zt = null, vt = 0), Ca = t, El = e, Ea = l, Ur = i, Mr = n, fh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Ox(ve, function() {
        return Eh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = y.T, y.T = null, n = Q.p, Q.p = 2, c = St, St |= 4;
        try {
          px(e, t, l);
        } finally {
          St = c, Q.p = n, y.T = a;
        }
      }
      ss = 1, Sh(), wh(), kh();
    }
  }
  function Sh() {
    if (ss === 1) {
      ss = 0;
      var e = El, t = Ca, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          ih(t, e);
          var i = Ir, c = ho(e.containerInfo), d = i.focusedElem, p = i.selectionRange;
          if (c !== d && d && d.ownerDocument && oo(
            d.ownerDocument.documentElement,
            d
          )) {
            if (p !== null && wc(d)) {
              var A = p.start, J = p.end;
              if (J === void 0 && (J = A), "selectionStart" in d)
                d.selectionStart = A, d.selectionEnd = Math.min(
                  J,
                  d.value.length
                );
              else {
                var ee = d.ownerDocument || document, U = ee && ee.defaultView || window;
                if (U.getSelection) {
                  var q = U.getSelection(), Pe = d.textContent.length, Je = Math.min(p.start, Pe), Ot = p.end === void 0 ? Je : Math.min(p.end, Pe);
                  !q.extend && Je > Ot && (c = Ot, Ot = Je, Je = c);
                  var E = uo(
                    d,
                    Je
                  ), S = uo(
                    d,
                    Ot
                  );
                  if (E && S && (q.rangeCount !== 1 || q.anchorNode !== E.node || q.anchorOffset !== E.offset || q.focusNode !== S.node || q.focusOffset !== S.offset)) {
                    var O = ee.createRange();
                    O.setStart(E.node, E.offset), q.removeAllRanges(), Je > Ot ? (q.addRange(O), q.extend(S.node, S.offset)) : (O.setEnd(S.node, S.offset), q.addRange(O));
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
              var $ = ee[d];
              $.element.scrollLeft = $.left, $.element.scrollTop = $.top;
            }
          }
          Ji = !!Fr, Ir = Fr = null;
        } finally {
          St = n, Q.p = a, y.T = l;
        }
      }
      e.current = t, ss = 2;
    }
  }
  function wh() {
    if (ss === 2) {
      ss = 0;
      var e = El, t = Ca, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = y.T, y.T = null;
        var a = Q.p;
        Q.p = 2;
        var n = St;
        St |= 4;
        try {
          sh(e, t.alternate, t);
        } finally {
          St = n, Q.p = a, y.T = l;
        }
      }
      ss = 3;
    }
  }
  function kh() {
    if (ss === 4 || ss === 3) {
      ss = 0, ke();
      var e = El, t = Ca, l = Ea, a = fh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ss = 5 : (ss = 0, Ca = El = null, Ch(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Cl = null), Ze(l), t = t.stateNode, Ne && typeof Ne.onCommitFiberRoot == "function")
        try {
          Ne.onCommitFiberRoot(
            P,
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
      (Ea & 3) !== 0 && Ui(), Zs(e), n = e.pendingLanes, (l & 4194090) !== 0 && (n & 42) !== 0 ? e === qr ? _n++ : (_n = 0, qr = e) : _n = 0, Nn(0);
    }
  }
  function Ch(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, tn(t)));
  }
  function Ui(e) {
    return Sh(), wh(), kh(), Eh();
  }
  function Eh() {
    if (ss !== 5) return !1;
    var e = El, t = Ur;
    Ur = 0;
    var l = Ze(Ea), a = y.T, n = Q.p;
    try {
      Q.p = 32 > l ? 32 : l, y.T = null, l = Mr, Mr = null;
      var i = El, c = Ea;
      if (ss = 0, Ca = El = null, Ea = 0, (St & 6) !== 0) throw Error(o(331));
      var d = St;
      if (St |= 4, dh(i.current), rh(
        i,
        i.current,
        c,
        l
      ), St = d, Nn(0, !1), Ne && typeof Ne.onPostCommitFiberRoot == "function")
        try {
          Ne.onPostCommitFiberRoot(P, i);
        } catch {
        }
      return !0;
    } finally {
      Q.p = n, y.T = a, Ch(e, t);
    }
  }
  function Oh(e, t, l) {
    t = Cs(l, t), t = xr(e.stateNode, t, 2), e = pl(e, t, 2), e !== null && (ce(e, 2), Zs(e));
  }
  function Tt(e, t, l) {
    if (e.tag === 3)
      Oh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Oh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Cl === null || !Cl.has(a))) {
            e = Cs(l, e), l = Rd(2), a = pl(t, l, 2), a !== null && (Dd(
              l,
              a,
              t,
              e
            ), ce(a, 2), Zs(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Yr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new yx();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (zr = !0, n.add(l), e = kx.bind(null, e, t, l), t.then(e, e));
  }
  function kx(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, zt === e && (vt & l) === l && (Lt === 4 || Lt === 3 && (vt & 62914560) === vt && 300 > He() - Dr ? (St & 2) === 0 && Oa(e, 0) : Ar |= l, ka === vt && (ka = 0)), Zs(e);
  }
  function Th(e, t) {
    t === 0 && (t = T()), e = da(e, t), e !== null && (ce(e, t), Zs(e));
  }
  function Cx(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Th(e, l);
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
    a !== null && a.delete(t), Th(e, l);
  }
  function Ox(e, t) {
    return Ke(e, t);
  }
  var Mi = null, za = null, Gr = !1, qi = !1, Xr = !1, ea = 0;
  function Zs(e) {
    e !== za && e.next === null && (za === null ? Mi = za = e : za = za.next = e), qi = !0, Gr || (Gr = !0, zx());
  }
  function Nn(e, t) {
    if (!Xr && qi) {
      Xr = !0;
      do
        for (var l = !1, a = Mi; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              i = (1 << 31 - lt(42 | e) + 1) - 1, i &= n & ~(c & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Dh(a, i));
          } else
            i = vt, i = ge(
              a,
              a === zt ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || xe(a, i) || (l = !0, Dh(a, i));
          a = a.next;
        }
      while (l);
      Xr = !1;
    }
  }
  function Tx() {
    zh();
  }
  function zh() {
    qi = Gr = !1;
    var e = 0;
    ea !== 0 && (Bx() && (e = ea), ea = 0);
    for (var t = He(), l = null, a = Mi; a !== null; ) {
      var n = a.next, i = Ah(a, t);
      i === 0 ? (a.next = null, l === null ? Mi = n : l.next = n, n === null && (za = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (qi = !0)), a = n;
    }
    Nn(e);
  }
  function Ah(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - lt(i), d = 1 << c, p = n[c];
      p === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Ge(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = zt, l = vt, l = ge(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (wt === 2 || wt === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Oe(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || xe(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Oe(a), Ze(l)) {
        case 2:
        case 8:
          l = at;
          break;
        case 32:
          l = ve;
          break;
        case 268435456:
          l = qe;
          break;
        default:
          l = ve;
      }
      return a = Rh.bind(null, e), l = Ke(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Oe(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Rh(e, t) {
    if (ss !== 0 && ss !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ui() && e.callbackNode !== l)
      return null;
    var a = vt;
    return a = ge(
      e,
      e === zt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (xh(e, a, t), Ah(e, He()), e.callbackNode != null && e.callbackNode === l ? Rh.bind(null, e) : null);
  }
  function Dh(e, t) {
    if (Ui()) return null;
    xh(e, t, !0);
  }
  function zx() {
    Yx(function() {
      (St & 6) !== 0 ? Ke(
        st,
        Tx
      ) : zh();
    });
  }
  function Qr() {
    return ea === 0 && (ea = jt()), ea;
  }
  function Uh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Kn("" + e);
  }
  function Mh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Ax(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Uh(
        (n[Nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Nt] || null) ? Uh(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var d = new In(
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
                if (ea !== 0) {
                  var p = c ? Mh(n, c) : new FormData(n);
                  or(
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
                typeof i == "function" && (d.preventDefault(), p = c ? Mh(n, c) : new FormData(n), or(
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
  for (var Zr = 0; Zr < Oc.length; Zr++) {
    var Vr = Oc[Zr], Rx = Vr.toLowerCase(), Dx = Vr[0].toUpperCase() + Vr.slice(1);
    Us(
      Rx,
      "on" + Dx
    );
  }
  Us(xo, "onAnimationEnd"), Us(jo, "onAnimationIteration"), Us(vo, "onAnimationStart"), Us("dblclick", "onDoubleClick"), Us("focusin", "onFocus"), Us("focusout", "onBlur"), Us(Fm, "onTransitionRun"), Us(Im, "onTransitionStart"), Us(Pm, "onTransitionCancel"), Us(po, "onTransitionEnd"), G("onMouseEnter", ["mouseout", "mouseover"]), G("onMouseLeave", ["mouseout", "mouseover"]), G("onPointerEnter", ["pointerout", "pointerover"]), G("onPointerLeave", ["pointerout", "pointerover"]), f(
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
  var Sn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Ux = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Sn)
  );
  function qh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var d = a[c], p = d.instance, A = d.currentTarget;
            if (d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = A;
            try {
              i(n);
            } catch (J) {
              Si(J);
            }
            n.currentTarget = null, i = p;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (d = a[c], p = d.instance, A = d.currentTarget, d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = A;
            try {
              i(n);
            } catch (J) {
              Si(J);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function xt(e, t) {
    var l = t[Se];
    l === void 0 && (l = t[Se] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Hh(t, e, 2, !1), l.add(a));
  }
  function Jr(e, t, l) {
    var a = 0;
    t && (a |= 4), Hh(
      l,
      e,
      a,
      t
    );
  }
  var Hi = "_reactListening" + Math.random().toString(36).slice(2);
  function Kr(e) {
    if (!e[Hi]) {
      e[Hi] = !0, fl.forEach(function(l) {
        l !== "selectionchange" && (Ux.has(l) || Jr(l, !1, e), Jr(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Hi] || (t[Hi] = !0, Jr("selectionchange", !1, t));
    }
  }
  function Hh(e, t, l, a) {
    switch (uf(t)) {
      case 2:
        var n = rj;
        break;
      case 8:
        n = uj;
        break;
      default:
        n = ru;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !jc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function $r(e, t, l, a, n) {
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
            if (c = tt(d), c === null) return;
            if (p = c.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              a = i = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        a = a.return;
      }
    Qu(function() {
      var A = i, J = mc(l), ee = [];
      e: {
        var U = go.get(e);
        if (U !== void 0) {
          var q = In, Pe = e;
          switch (e) {
            case "keypress":
              if (Wn(l) === 0) break e;
            case "keydown":
            case "keyup":
              q = Om;
              break;
            case "focusin":
              Pe = "focus", q = bc;
              break;
            case "focusout":
              Pe = "blur", q = bc;
              break;
            case "beforeblur":
            case "afterblur":
              q = bc;
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
              q = Ju;
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
            case xo:
            case jo:
            case vo:
              q = bm;
              break;
            case po:
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
              q = $u;
              break;
            case "toggle":
            case "beforetoggle":
              q = Hm;
          }
          var Je = (t & 4) !== 0, Ot = !Je && (e === "scroll" || e === "scrollend"), E = Je ? U !== null ? U + "Capture" : null : U;
          Je = [];
          for (var S = A, O; S !== null; ) {
            var $ = S;
            if (O = $.stateNode, $ = $.tag, $ !== 5 && $ !== 26 && $ !== 27 || O === null || E === null || ($ = Ga(S, E), $ != null && Je.push(
              wn(S, $, O)
            )), Ot) break;
            S = S.return;
          }
          0 < Je.length && (U = new q(
            U,
            Pe,
            null,
            l,
            J
          ), ee.push({ event: U, listeners: Je }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (U = e === "mouseover" || e === "pointerover", q = e === "mouseout" || e === "pointerout", U && l !== fc && (Pe = l.relatedTarget || l.fromElement) && (tt(Pe) || Pe[g]))
            break e;
          if ((q || U) && (U = J.window === J ? J : (U = J.ownerDocument) ? U.defaultView || U.parentWindow : window, q ? (Pe = l.relatedTarget || l.toElement, q = A, Pe = Pe ? tt(Pe) : null, Pe !== null && (Ot = D(Pe), Je = Pe.tag, Pe !== Ot || Je !== 5 && Je !== 27 && Je !== 6) && (Pe = null)) : (q = null, Pe = A), q !== Pe)) {
            if (Je = Ju, $ = "onMouseLeave", E = "onMouseEnter", S = "mouse", (e === "pointerout" || e === "pointerover") && (Je = $u, $ = "onPointerLeave", E = "onPointerEnter", S = "pointer"), Ot = q == null ? U : Ns(q), O = Pe == null ? U : Ns(Pe), U = new Je(
              $,
              S + "leave",
              q,
              l,
              J
            ), U.target = Ot, U.relatedTarget = O, $ = null, tt(J) === A && (Je = new Je(
              E,
              S + "enter",
              Pe,
              l,
              J
            ), Je.target = O, Je.relatedTarget = Ot, $ = Je), Ot = $, q && Pe)
              t: {
                for (Je = q, E = Pe, S = 0, O = Je; O; O = Aa(O))
                  S++;
                for (O = 0, $ = E; $; $ = Aa($))
                  O++;
                for (; 0 < S - O; )
                  Je = Aa(Je), S--;
                for (; 0 < O - S; )
                  E = Aa(E), O--;
                for (; S--; ) {
                  if (Je === E || E !== null && Je === E.alternate)
                    break t;
                  Je = Aa(Je), E = Aa(E);
                }
                Je = null;
              }
            else Je = null;
            q !== null && Bh(
              ee,
              U,
              q,
              Je,
              !1
            ), Pe !== null && Ot !== null && Bh(
              ee,
              Ot,
              Pe,
              Je,
              !0
            );
          }
        }
        e: {
          if (U = A ? Ns(A) : window, q = U.nodeName && U.nodeName.toLowerCase(), q === "select" || q === "input" && U.type === "file")
            var Me = lo;
          else if (to(U))
            if (ao)
              Me = Km;
            else {
              Me = Vm;
              var ht = Zm;
            }
          else
            q = U.nodeName, !q || q.toLowerCase() !== "input" || U.type !== "checkbox" && U.type !== "radio" ? A && hc(A.elementType) && (Me = lo) : Me = Jm;
          if (Me && (Me = Me(e, A))) {
            so(
              ee,
              Me,
              l,
              J
            );
            break e;
          }
          ht && ht(e, U, A), e === "focusout" && A && U.type === "number" && A.memoizedProps.value != null && dc(U, "number", U.value);
        }
        switch (ht = A ? Ns(A) : window, e) {
          case "focusin":
            (to(ht) || ht.contentEditable === "true") && (ra = ht, kc = A, Wa = null);
            break;
          case "focusout":
            Wa = kc = ra = null;
            break;
          case "mousedown":
            Cc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Cc = !1, fo(ee, l, J);
            break;
          case "selectionchange":
            if (Wm) break;
          case "keydown":
          case "keyup":
            fo(ee, l, J);
        }
        var Xe;
        if (_c)
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
          ca ? Pu(e, l) && ($e = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && ($e = "onCompositionStart");
        $e && (Wu && l.locale !== "ko" && (ca || $e !== "onCompositionStart" ? $e === "onCompositionEnd" && ca && (Xe = Zu()) : (ml = J, vc = "value" in ml ? ml.value : ml.textContent, ca = !0)), ht = Bi(A, $e), 0 < ht.length && ($e = new Ku(
          $e,
          e,
          null,
          l,
          J
        ), ee.push({ event: $e, listeners: ht }), Xe ? $e.data = Xe : (Xe = eo(l), Xe !== null && ($e.data = Xe)))), (Xe = Lm ? Ym(e, l) : Gm(e, l)) && ($e = Bi(A, "onBeforeInput"), 0 < $e.length && (ht = new Ku(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          J
        ), ee.push({
          event: ht,
          listeners: $e
        }), ht.data = Xe)), Ax(
          ee,
          e,
          A,
          l,
          J
        );
      }
      qh(ee, t);
    });
  }
  function wn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Bi(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = Ga(e, l), n != null && a.unshift(
        wn(e, n, i)
      ), n = Ga(e, t), n != null && a.push(
        wn(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Aa(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Bh(e, t, l, a, n) {
    for (var i = t._reactName, c = []; l !== null && l !== a; ) {
      var d = l, p = d.alternate, A = d.stateNode;
      if (d = d.tag, p !== null && p === a) break;
      d !== 5 && d !== 26 && d !== 27 || A === null || (p = A, n ? (A = Ga(l, i), A != null && c.unshift(
        wn(l, A, p)
      )) : n || (A = Ga(l, i), A != null && c.push(
        wn(l, A, p)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Mx = /\r\n?/g, qx = /\u0000|\uFFFD/g;
  function Lh(e) {
    return (typeof e == "string" ? e : "" + e).replace(Mx, `
`).replace(qx, "");
  }
  function Yh(e, t) {
    return t = Lh(t), Lh(e) === t;
  }
  function Li() {
  }
  function Et(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || aa(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && aa(e, "" + a);
        break;
      case "className":
        os(e, "class", a);
        break;
      case "tabIndex":
        os(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        os(e, l, a);
        break;
      case "style":
        Gu(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          os(e, "data", a);
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
        a = Kn("" + a), e.setAttribute(l, a);
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
        a = Kn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Li);
        break;
      case "onScroll":
        a != null && xt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && xt("scrollend", e);
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
        l = Kn("" + a), e.setAttributeNS(
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
        xt("beforetoggle", e), xt("toggle", e), Ss(e, "popover", a);
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
        Ss(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = fm.get(l) || l, Ss(e, l, a));
    }
  }
  function Wr(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Gu(e, a, i);
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
        typeof a == "string" ? aa(e, a) : (typeof a == "number" || typeof a == "bigint") && aa(e, "" + a);
        break;
      case "onScroll":
        a != null && xt("scroll", e);
        break;
      case "onScrollEnd":
        a != null && xt("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Li);
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
        if (!Ks.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[Nt] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Ss(e, l, a);
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
        xt("error", e), xt("load", e);
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
        xt("invalid", e);
        var d = i = c = n = null, p = null, A = null;
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
                  A = J;
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
        Hu(
          e,
          i,
          d,
          p,
          A,
          c,
          n,
          !1
        ), Vn(e);
        return;
      case "select":
        xt("invalid", e), a = c = i = null;
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
        t = i, l = c, e.multiple = !!a, t != null ? la(e, !!a, t, !1) : l != null && la(e, !!a, l, !0);
        return;
      case "textarea":
        xt("invalid", e), i = n = a = null;
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
        Lu(e, a, n, i), Vn(e);
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
        xt("beforetoggle", e), xt("toggle", e), xt("cancel", e), xt("close", e);
        break;
      case "iframe":
      case "object":
        xt("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Sn.length; a++)
          xt(Sn[a], e);
        break;
      case "image":
        xt("error", e), xt("load", e);
        break;
      case "details":
        xt("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        xt("error", e), xt("load", e);
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
        for (A in l)
          if (l.hasOwnProperty(A) && (a = l[A], a != null))
            switch (A) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Et(e, t, A, a, l, null);
            }
        return;
      default:
        if (hc(t)) {
          for (J in l)
            l.hasOwnProperty(J) && (a = l[J], a !== void 0 && Wr(
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
        var n = null, i = null, c = null, d = null, p = null, A = null, J = null;
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
        for (var U in a) {
          var q = a[U];
          if (ee = l[U], a.hasOwnProperty(U) && (q != null || ee != null))
            switch (U) {
              case "type":
                i = q;
                break;
              case "name":
                n = q;
                break;
              case "checked":
                A = q;
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
                  U,
                  q,
                  a,
                  ee
                );
            }
        }
        oc(
          e,
          c,
          d,
          p,
          A,
          J,
          i,
          n
        );
        return;
      case "select":
        q = c = d = U = null;
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
                U = i;
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
        t = d, l = c, a = q, U != null ? la(e, !!l, U, !1) : !!a != !!l && (t != null ? la(e, !!l, t, !0) : la(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        q = U = null;
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
                U = n;
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
        Bu(e, U, q);
        return;
      case "option":
        for (var Pe in l)
          if (U = l[Pe], l.hasOwnProperty(Pe) && U != null && !a.hasOwnProperty(Pe))
            switch (Pe) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Et(
                  e,
                  t,
                  Pe,
                  null,
                  a,
                  U
                );
            }
        for (p in a)
          if (U = a[p], q = l[p], a.hasOwnProperty(p) && U !== q && (U != null || q != null))
            switch (p) {
              case "selected":
                e.selected = U && typeof U != "function" && typeof U != "symbol";
                break;
              default:
                Et(
                  e,
                  t,
                  p,
                  U,
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
          U = l[Je], l.hasOwnProperty(Je) && U != null && !a.hasOwnProperty(Je) && Et(e, t, Je, null, a, U);
        for (A in a)
          if (U = a[A], q = l[A], a.hasOwnProperty(A) && U !== q && (U != null || q != null))
            switch (A) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (U != null)
                  throw Error(o(137, t));
                break;
              default:
                Et(
                  e,
                  t,
                  A,
                  U,
                  a,
                  q
                );
            }
        return;
      default:
        if (hc(t)) {
          for (var Ot in l)
            U = l[Ot], l.hasOwnProperty(Ot) && U !== void 0 && !a.hasOwnProperty(Ot) && Wr(
              e,
              t,
              Ot,
              void 0,
              a,
              U
            );
          for (J in a)
            U = a[J], q = l[J], !a.hasOwnProperty(J) || U === q || U === void 0 && q === void 0 || Wr(
              e,
              t,
              J,
              U,
              a,
              q
            );
          return;
        }
    }
    for (var E in l)
      U = l[E], l.hasOwnProperty(E) && U != null && !a.hasOwnProperty(E) && Et(e, t, E, null, a, U);
    for (ee in a)
      U = a[ee], q = l[ee], !a.hasOwnProperty(ee) || U === q || U == null && q == null || Et(e, t, ee, U, a, q);
  }
  var Fr = null, Ir = null;
  function Yi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Gh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Xh(e, t) {
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
  function Pr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var eu = null;
  function Bx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === eu ? !1 : (eu = e, !0) : (eu = null, !1);
  }
  var Qh = typeof setTimeout == "function" ? setTimeout : void 0, Lx = typeof clearTimeout == "function" ? clearTimeout : void 0, Zh = typeof Promise == "function" ? Promise : void 0, Yx = typeof queueMicrotask == "function" ? queueMicrotask : typeof Zh < "u" ? function(e) {
    return Zh.resolve(null).then(e).catch(Gx);
  } : Qh;
  function Gx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Tl(e) {
    return e === "head";
  }
  function Vh(e, t) {
    var l = t, a = 0, n = 0;
    do {
      var i = l.nextSibling;
      if (e.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < a && 8 > a) {
            l = a;
            var c = e.ownerDocument;
            if (l & 1 && kn(c.documentElement), l & 2 && kn(c.body), l & 4)
              for (l = c.head, kn(l), c = l.firstChild; c; ) {
                var d = c.nextSibling, p = c.nodeName;
                c[Te] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = d;
              }
          }
          if (n === 0) {
            e.removeChild(i), Dn(t);
            return;
          }
          n--;
        } else
          l === "$" || l === "$?" || l === "$!" ? n++ : a = l.charCodeAt(0) - 48;
      else a = 0;
      l = i;
    } while (l);
    Dn(t);
  }
  function tu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          tu(l), ze(l);
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
      if (e = qs(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Qx(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = qs(e.nextSibling), e === null)) return null;
    return e;
  }
  function su(e) {
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
  function qs(e) {
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
  var lu = null;
  function Jh(e) {
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
  function Kh(e, t, l) {
    switch (t = Yi(l), e) {
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
  function kn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    ze(e);
  }
  var Rs = /* @__PURE__ */ new Map(), $h = /* @__PURE__ */ new Set();
  function Gi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var ol = Q.d;
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
    var e = ol.f(), t = Ri();
    return e || t;
  }
  function Jx(e) {
    var t = Vt(e);
    t !== null && t.tag === 5 && t.type === "form" ? xd(t) : ol.r(e);
  }
  var Ra = typeof document > "u" ? null : document;
  function Wh(e, t, l) {
    var a = Ra;
    if (a && typeof t == "string" && t) {
      var n = ks(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), $h.has(n) || ($h.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ls(t, "link", e), At(t), a.head.appendChild(t)));
    }
  }
  function Kx(e) {
    ol.D(e), Wh("dns-prefetch", e, null);
  }
  function $x(e, t) {
    ol.C(e, t), Wh("preconnect", e, t);
  }
  function Wx(e, t, l) {
    ol.L(e, t, l);
    var a = Ra;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + ks(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + ks(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + ks(
        l.imageSizes
      ) + '"]')) : n += '[href="' + ks(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Da(e);
          break;
        case "script":
          i = Ua(e);
      }
      Rs.has(i) || (e = M(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Rs.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Cn(i)) || t === "script" && a.querySelector(En(i)) || (t = a.createElement("link"), ls(t, "link", e), At(t), a.head.appendChild(t)));
    }
  }
  function Fx(e, t) {
    ol.m(e, t);
    var l = Ra;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + ks(a) + '"][href="' + ks(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Ua(e);
      }
      if (!Rs.has(i) && (e = M({ rel: "modulepreload", href: e }, t), Rs.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(En(i)))
              return;
        }
        a = l.createElement("link"), ls(a, "link", e), At(a), l.head.appendChild(a);
      }
    }
  }
  function Ix(e, t, l) {
    ol.S(e, t, l);
    var a = Ra;
    if (a && e) {
      var n = us(a).hoistableStyles, i = Da(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          Cn(i)
        ))
          d.loading = 5;
        else {
          e = M(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Rs.get(i)) && au(e, l);
          var p = c = a.createElement("link");
          At(p), ls(p, "link", e), p._p = new Promise(function(A, J) {
            p.onload = A, p.onerror = J;
          }), p.addEventListener("load", function() {
            d.loading |= 1;
          }), p.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Xi(c, t, a);
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
    ol.X(e, t);
    var l = Ra;
    if (l && e) {
      var a = us(l).hoistableScripts, n = Ua(e), i = a.get(n);
      i || (i = l.querySelector(En(n)), i || (e = M({ src: e, async: !0 }, t), (t = Rs.get(n)) && nu(e, t), i = l.createElement("script"), At(i), ls(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function ej(e, t) {
    ol.M(e, t);
    var l = Ra;
    if (l && e) {
      var a = us(l).hoistableScripts, n = Ua(e), i = a.get(n);
      i || (i = l.querySelector(En(n)), i || (e = M({ src: e, async: !0, type: "module" }, t), (t = Rs.get(n)) && nu(e, t), i = l.createElement("script"), At(i), ls(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Fh(e, t, l, a) {
    var n = (n = W.current) ? Gi(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Da(l.href), l = us(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Da(l.href);
          var i = us(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            Cn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), Rs.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Rs.set(e, l), i || tj(
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
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ua(l), l = us(
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
  function Da(e) {
    return 'href="' + ks(e) + '"';
  }
  function Cn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Ih(e) {
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
    }), ls(t, "link", l), At(t), e.head.appendChild(t));
  }
  function Ua(e) {
    return '[src="' + ks(e) + '"]';
  }
  function En(e) {
    return "script[async]" + e;
  }
  function Ph(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + ks(l.href) + '"]'
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
          ), At(a), ls(a, "style", n), Xi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Da(l.href);
          var i = e.querySelector(
            Cn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, At(i), i;
          a = Ih(l), (n = Rs.get(n)) && au(a, n), i = (e.ownerDocument || e).createElement("link"), At(i);
          var c = i;
          return c._p = new Promise(function(d, p) {
            c.onload = d, c.onerror = p;
          }), ls(i, "link", a), t.state.loading |= 4, Xi(i, l.precedence, e), t.instance = i;
        case "script":
          return i = Ua(l.src), (n = e.querySelector(
            En(i)
          )) ? (t.instance = n, At(n), n) : (a = l, (n = Rs.get(i)) && (a = M({}, l), nu(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), At(n), ls(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Xi(a, l.precedence, e));
    return t.instance;
  }
  function Xi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function au(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function nu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Qi = null;
  function ef(e, t, l) {
    if (Qi === null) {
      var a = /* @__PURE__ */ new Map(), n = Qi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Qi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
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
  function tf(e, t, l) {
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
  function sf(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var On = null;
  function lj() {
  }
  function aj(e, t, l) {
    if (On === null) throw Error(o(475));
    var a = On;
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var n = Da(l.href), i = e.querySelector(
          Cn(n)
        );
        if (i) {
          e = i._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = Zi.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = i, At(i);
          return;
        }
        i = e.ownerDocument || e, l = Ih(l), (n = Rs.get(n)) && au(l, n), i = i.createElement("link"), At(i);
        var c = i;
        c._p = new Promise(function(d, p) {
          c.onload = d, c.onerror = p;
        }), ls(i, "link", l), t.instance = i;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Zi.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function nj() {
    if (On === null) throw Error(o(475));
    var e = On;
    return e.stylesheets && e.count === 0 && iu(e, e.stylesheets), 0 < e.count ? function(t) {
      var l = setTimeout(function() {
        if (e.stylesheets && iu(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function Zi() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) iu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Vi = null;
  function iu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Vi = /* @__PURE__ */ new Map(), t.forEach(ij, e), Vi = null, Zi.call(e));
  }
  function ij(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Vi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Vi.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = l.get(c) || a, i === a && l.set(null, n), l.set(c, n), this.count++, a = Zi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Tn = {
    $$typeof: F,
    Provider: null,
    Consumer: null,
    _currentValue: le,
    _currentValue2: le,
    _threadCount: 0
  };
  function cj(e, t, l, a, n, i, c, d) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = j(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = j(0), this.hiddenUpdates = j(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = d, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function lf(e, t, l, a, n, i, c, d, p, A, J, ee) {
    return e = new cj(
      e,
      t,
      l,
      c,
      d,
      p,
      A,
      ee
    ), t = 1, i === !0 && (t |= 24), i = vs(3, null, null, t), e.current = i, i.stateNode = e, t = Yc(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Zc(i), e;
  }
  function af(e) {
    return e ? (e = ha, e) : ha;
  }
  function nf(e, t, l, a, n, i) {
    n = af(n), a.context === null ? a.context = n : a.pendingContext = n, a = vl(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = pl(e, a, t), l !== null && (_s(l, e, t), nn(l, e, t));
  }
  function cf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function cu(e, t) {
    cf(e, t), (e = e.alternate) && cf(e, t);
  }
  function rf(e) {
    if (e.tag === 13) {
      var t = da(e, 67108864);
      t !== null && _s(t, e, 67108864), cu(e, 67108864);
    }
  }
  var Ji = !0;
  function rj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 2, ru(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function uj(e, t, l, a) {
    var n = y.T;
    y.T = null;
    var i = Q.p;
    try {
      Q.p = 8, ru(e, t, l, a);
    } finally {
      Q.p = i, y.T = n;
    }
  }
  function ru(e, t, l, a) {
    if (Ji) {
      var n = uu(a);
      if (n === null)
        $r(
          e,
          t,
          a,
          Ki,
          l
        ), of(e, a);
      else if (dj(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (of(e, a), t & 4 && -1 < oj.indexOf(e)) {
        for (; n !== null; ) {
          var i = Vt(n);
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
                    Zs(i), (St & 6) === 0 && (zi = He() + 500, Nn(0));
                  }
                }
                break;
              case 13:
                d = da(i, 2), d !== null && _s(d, i, 2), Ri(), cu(i, 2);
            }
          if (i = uu(a), i === null && $r(
            e,
            t,
            a,
            Ki,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        $r(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function uu(e) {
    return e = mc(e), ou(e);
  }
  var Ki = null;
  function ou(e) {
    if (Ki = null, e = tt(e), e !== null) {
      var t = D(e);
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
    return Ki = e, null;
  }
  function uf(e) {
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
          case st:
            return 2;
          case at:
            return 8;
          case ve:
          case ct:
            return 32;
          case qe:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var du = !1, zl = null, Al = null, Rl = null, zn = /* @__PURE__ */ new Map(), An = /* @__PURE__ */ new Map(), Dl = [], oj = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function of(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        zl = null;
        break;
      case "dragenter":
      case "dragleave":
        Al = null;
        break;
      case "mouseover":
      case "mouseout":
        Rl = null;
        break;
      case "pointerover":
      case "pointerout":
        zn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        An.delete(t.pointerId);
    }
  }
  function Rn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = Vt(t), t !== null && rf(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function dj(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return zl = Rn(
          zl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Al = Rn(
          Al,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Rl = Rn(
          Rl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return zn.set(
          i,
          Rn(
            zn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, An.set(
          i,
          Rn(
            An.get(i) || null,
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
  function df(e) {
    var t = tt(e.target);
    if (t !== null) {
      var l = D(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Yt(e.priority, function() {
              if (l.tag === 13) {
                var a = ys();
                a = fe(a);
                var n = da(l, a);
                n !== null && _s(n, l, a), cu(l, a);
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
  function $i(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = uu(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        fc = a, l.target.dispatchEvent(a), fc = null;
      } else
        return t = Vt(l), t !== null && rf(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function hf(e, t, l) {
    $i(e) && l.delete(t);
  }
  function hj() {
    du = !1, zl !== null && $i(zl) && (zl = null), Al !== null && $i(Al) && (Al = null), Rl !== null && $i(Rl) && (Rl = null), zn.forEach(hf), An.forEach(hf);
  }
  function Wi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, du || (du = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      hj
    )));
  }
  var Fi = null;
  function ff(e) {
    Fi !== e && (Fi = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Fi === e && (Fi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (ou(a || l) === null)
              continue;
            break;
          }
          var i = Vt(l);
          i !== null && (e.splice(t, 3), t -= 3, or(
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
  function Dn(e) {
    function t(p) {
      return Wi(p, e);
    }
    zl !== null && Wi(zl, e), Al !== null && Wi(Al, e), Rl !== null && Wi(Rl, e), zn.forEach(t), An.forEach(t);
    for (var l = 0; l < Dl.length; l++) {
      var a = Dl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Dl.length && (l = Dl[0], l.blockedOn === null); )
      df(l), l.blockedOn === null && Dl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], c = n[Nt] || null;
        if (typeof i == "function")
          c || ff(l);
        else if (c) {
          var d = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[Nt] || null)
              d = c.formAction;
            else if (ou(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), ff(l);
        }
      }
  }
  function hu(e) {
    this._internalRoot = e;
  }
  Ii.prototype.render = hu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = ys();
    nf(l, a, e, t, null, null);
  }, Ii.prototype.unmount = hu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      nf(e.current, 2, null, e, null, null), Ri(), t[g] = null;
    }
  };
  function Ii(e) {
    this._internalRoot = e;
  }
  Ii.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = kt();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Dl.length && t !== 0 && t < Dl[l].priority; l++) ;
      Dl.splice(l, 0, e), l === 0 && df(e);
    }
  };
  var mf = h.version;
  if (mf !== "19.1.0")
    throw Error(
      o(
        527,
        mf,
        "19.1.0"
      )
    );
  Q.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = Y(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var fj = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: y,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Pi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Pi.isDisabled && Pi.supportsFiber)
      try {
        P = Pi.inject(
          fj
        ), Ne = Pi;
      } catch {
      }
  }
  return Mn.createRoot = function(e, t) {
    if (!z(e)) throw Error(o(299));
    var l = !1, a = "", n = Od, i = Td, c = zd, d = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (d = t.unstable_transitionCallbacks)), t = lf(
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
    ), e[g] = t.current, Kr(e), new hu(t);
  }, Mn.hydrateRoot = function(e, t, l) {
    if (!z(e)) throw Error(o(299));
    var a = !1, n = "", i = Od, c = Td, d = zd, p = null, A = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (d = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (p = l.unstable_transitionCallbacks), l.formState !== void 0 && (A = l.formState)), t = lf(
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
      A
    ), t.context = af(null), l = t.current, a = ys(), a = fe(a), n = vl(a), n.callback = null, pl(l, n, a), l = a, t.current.lanes = l, ce(t, l), Zs(t), e[g] = t.current, Kr(e), new Ii(t);
  }, Mn.version = "19.1.0", Mn;
}
var Sf;
function Nj() {
  if (Sf) return mu.exports;
  Sf = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (h) {
        console.error(h);
      }
  }
  return u(), mu.exports = _j(), mu.exports;
}
var Sj = Nj(), r = Du();
const gu = [["task_started", "任务开始", "task"], ["inspection_recorded", "检查记录", "task"], ["issue_created", "问题记录", "issue"], ["rectification_submitted", "整改提交", "issue"], ["review_rejected", "复核退回", "issue"], ["review_accepted", "复核通过", "issue"], ["task_completed", "任务结束", "task"]];
function wj({ api: u, projects: h }) {
  var We;
  const [_, o] = r.useState(((We = h[0]) == null ? void 0 : We.id) || ""), [z, D] = r.useState([]), [V, R] = r.useState("general_inspection"), [Y, v] = r.useState("现场质量安全检查"), [M, K] = r.useState("general,通用施工检查"), [k, se] = r.useState(gu.map((X) => X[0])), [me, ye] = r.useState(!1), [_e, Ee] = r.useState(!1), [he, F] = r.useState(""), [ue, ne] = r.useState(""), [H, je] = r.useState(0), Re = h.find((X) => X.id === _), Be = Re != null && Re.permissions ? Re.permissions.includes("knowledge.process") : Re == null ? void 0 : Re.can_run, Qe = Re != null && Re.permissions ? Re.permissions.includes("knowledge.review") : Re == null ? void 0 : Re.can_manage;
  r.useEffect(() => {
    let X = !1;
    return D([]), F(""), _ && u(`/scenes?project_id=${encodeURIComponent(_)}`).then((oe) => {
      X || D(oe.items);
    }).catch((oe) => {
      X || F(oe.message);
    }), () => {
      X = !0;
    };
  }, [_, H]);
  const Le = async (X) => {
    Ee(!0), F(""), ne("");
    try {
      await X(), je((oe) => oe + 1);
    } catch (oe) {
      F(oe.message);
    } finally {
      Ee(!1);
    }
  }, pe = (X) => {
    R(X.code), v(X.payload.name), K(X.payload.categories.map((oe) => oe.code + "," + oe.name).join(`
`)), se(X.payload.steps.map((oe) => oe.event_type)), ye(X.payload.compare_deadline);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "场景与流程配置" }),
      /* @__PURE__ */ s.jsx("span", { children: "保存新版本，经审核人员启用后用于后续复盘" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      he && /* @__PURE__ */ s.jsx("p", { className: "feedback error", role: "alert", children: he }),
      ue && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: ue }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "场景项目", value: _, onChange: (X) => o(X.target.value), children: h.map((X) => /* @__PURE__ */ s.jsx("option", { value: X.id, children: X.name }, X.id)) })
      ] }),
      Be && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景编码",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景编码", value: V, onChange: (X) => R(X.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "场景名称",
            /* @__PURE__ */ s.jsx("input", { "aria-label": "场景名称", value: Y, onChange: (X) => v(X.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "分类（每行：英文编码,中文名称）",
          /* @__PURE__ */ s.jsx("textarea", { "aria-label": "场景分类", value: M, onChange: (X) => K(X.target.value) })
        ] }),
        /* @__PURE__ */ s.jsxs("fieldset", { children: [
          /* @__PURE__ */ s.jsx("legend", { children: "需要核对的过程记录" }),
          gu.map((X) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: k.includes(X[0]), onChange: (oe) => se((y) => oe.target.checked ? [...y, X[0]] : y.filter((Q) => Q !== X[0])) }),
            X[1]
          ] }, X[0]))
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: me, onChange: (X) => ye(X.target.checked) }),
          "有明确期限、终态及复核时间时比较记录中的期限"
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: _e || !_ || !k.length, onClick: () => void Le(async () => {
          const X = z.filter((y) => y.code === V).sort((y, Q) => Q.version - y.version)[0], oe = M.split(`
`).filter((y) => y.trim()).map((y) => {
            const [Q, le] = y.split(/[,，]/);
            if (!(Q != null && Q.trim()) || !(le != null && le.trim())) throw new Error("分类须逐行填写英文编码和中文名称。");
            const Ce = X == null ? void 0 : X.payload.categories.find((m) => m.code === Q.trim());
            return { code: Q.trim(), name: le.trim(), focus: (Ce == null ? void 0 : Ce.focus) || "", keywords: (Ce == null ? void 0 : Ce.keywords) || [] };
          });
          await u("/scenes", { method: "POST", body: JSON.stringify({ project_id: _, code: V, expected_version: (X == null ? void 0 : X.version) || 0, payload: { name: Y, categories: oe, steps: gu.filter((y) => k.includes(y[0])).map((y) => ({ event_type: y[0], name: y[1], scope: y[2] })), compare_deadline: me } }) }), ne("新场景版本已保存，原成果保持原配置。");
        }), children: "保存新版本" })
      ] }),
      z.map((X) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
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
        Qe && !X.active && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: _e, onClick: () => void Le(async () => {
          var oe;
          await u(`/scenes/${X.id}/activate`, { method: "POST", body: JSON.stringify({ expected_active_id: ((oe = z.find((y) => y.code === X.code && y.active)) == null ? void 0 : oe.id) || null }) }), ne("场景版本已启用。");
        }), children: "启用此版本" }),
        Be && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: _e, onClick: () => void Le(async () => {
          var y;
          const oe = await u(`/knowledge/taxonomies?project_id=${encodeURIComponent(_)}`);
          await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: _, expected_version: ((y = oe.items[0]) == null ? void 0 : y.version) || 0, categories: X.payload.categories }) }), ne("分类已保存为新的知识萃取分类版本。");
        }), children: "用于知识萃取分类" })
      ] }, X.id))
    ] })
  ] });
}
const bu = {}, Uu = window.location.pathname.startsWith("/quality/b/"), La = window.location.pathname === "/quality/" && window.location.hash.startsWith("#/b/"), wf = bu == null ? void 0 : bu.VITE_B_PLATFORM_MODE, Rt = La || Uu && (wf === "true" || wf !== "false" && !0);
function ec() {
  if (!Uu && !La) return window.location.pathname;
  const u = La ? window.location.hash.slice(3) : window.location.hash.slice(1) || "/knowledge";
  return u.split("?")[0] === "/knowledge" ? "/knowledge/library" : u.split("?")[0];
}
function kj(u) {
  La ? window.history.pushState({}, "", "/quality/#/b" + u) : Uu ? window.history.pushState({}, "", "/quality/b/#" + u) : window.history.pushState({}, "", u), La && window.dispatchEvent(new Event("platform-route"));
}
async function Zt(u, h = {}) {
  if (!Rt) return fetch(u, h);
  if (!u.startsWith("/api/v1/") && !u.startsWith("/integration/v1/"))
    throw new Error("请求地址不属于平台接口。");
  const _ = new Headers(h.headers);
  _.delete("Authorization");
  const o = window.QaxcProjectId;
  La && o && _.set("X-Project-ID", o);
  const z = (h.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(z)) {
    const V = await fetch("/quality/api/csrf-token", { credentials: "same-origin", cache: "no-store" });
    if (V.status === 401 && window.dispatchEvent(new Event("b-session-expired")), !V.ok) throw new Error(V.status === 401 ? "登录已失效，请返回平台重新登录。" : "无法取得安全校验，请稍后重试。");
    const R = await V.json(), Y = R.csrf_token ?? R.token;
    if (typeof Y != "string" || !Y) throw new Error("安全校验返回格式不正确。");
    _.set("X-CSRF-Token", Y);
  }
  const D = await fetch("/quality/b" + u, { ...h, headers: _, credentials: "same-origin" });
  return D.status === 401 && window.dispatchEvent(new Event("b-session-expired")), D;
}
const kf = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", superseded: "已有修订版", withdrawn: "已撤回" }, Cf = { created: "保存草稿", submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回", superseded: "被修订版替代" }, Ou = () => ({ number: "", text: "", chapter: "", parent_number: null, page: null, locator: "", preconditions: [], exceptions: [], tables: [], notes: [], references: [] }), Cj = (u) => ({
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
  clauses: [Ou()]
}), Ma = (u) => u.split(`
`).map((h) => h.trim()).filter(Boolean);
function yu(u, h) {
  var _;
  return u != null && u.permissions ? u.permissions.includes(h) : h === "knowledge.process" ? !!(u != null && u.can_run) : !!(u != null && u.can_manage) || !!((_ = u == null ? void 0 : u.roles) != null && _.includes("reviewer"));
}
function Ej({ api: u, projects: h, identity: _ }) {
  var ve, ct, qe;
  const [o, z] = r.useState(((ve = h[0]) == null ? void 0 : ve.id) || ""), [D, V] = r.useState([]), [R, Y] = r.useState(null), [v, M] = r.useState(null), [K, k] = r.useState(!1), [se, me] = r.useState(!1), [ye, _e] = r.useState(!1), [Ee, he] = r.useState(""), [F, ue] = r.useState(""), [ne, H] = r.useState(""), [je, Re] = r.useState(null), [Be, Qe] = r.useState(0), [Le, pe] = r.useState(""), [We, X] = r.useState(!1), [oe, y] = r.useState(""), [Q, le] = r.useState("current_rectification"), [Ce, m] = r.useState(""), [B, I] = r.useState({ project_type: "", region: "", object_type: "", stage: "" }), [ae, ie] = r.useState(null), Z = r.useRef(crypto.randomUUID()), W = r.useRef(0), we = h.find((C) => C.id === o), re = yu(we, "knowledge.process"), Ae = yu(we, "knowledge.review"), et = yu(we, "knowledge.publish"), it = re || Ae || et;
  r.useEffect(() => {
    const C = (w) => {
      K && (w.preventDefault(), w.returnValue = "");
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [K]), r.useEffect(() => {
    let C = !1;
    if (_e(!0), he(""), V([]), Re(null), !o) {
      _e(!1);
      return;
    }
    return u(`/standards?project_id=${encodeURIComponent(o)}&view=${it ? "manage" : "published"}${ne ? "&cursor=" + encodeURIComponent(ne) : ""}`).then((w) => {
      C || (V(w.items), Re(w.next_cursor));
    }).catch((w) => {
      C || he(w.message);
    }).finally(() => {
      C || _e(!1);
    }), () => {
      C = !0;
    };
  }, [o, it, ne, Be]), r.useEffect(() => () => {
    W.current++;
  }, []);
  const Fe = async (C) => {
    me(!0), he(""), ue("");
    try {
      await C();
    } catch (w) {
      he(w.message);
    } finally {
      me(!1);
    }
  }, Ke = () => {
    var C;
    k(!1), (C = window.QaxcClearPendingEdits) == null || C.call(window);
  }, Oe = () => !K || confirm("当前规范草稿尚未保存，确定放弃本次编辑？"), De = (C) => {
    M((w) => w && { ...w, ...C }), k(!0), Z.current = crypto.randomUUID();
  }, ke = (C, w) => {
    v && De({ clauses: v.clauses.map((P, Ne) => Ne === C ? { ...P, ...w } : P) });
  }, He = async (C) => {
    if (!Oe()) return;
    const w = ++W.current;
    await Fe(async () => {
      const P = await u("/standards/" + C.id);
      w === W.current && (Y(P), M(null), Ke(), ie(null), pe(""), X(!1));
    });
  }, Ie = () => {
    if (!R || !Oe()) return;
    const { id: C, version: w, row_version: P, state: Ne, source_available: Ue, verified_on: lt, history: ft, clauses: L, ...de } = R;
    M({
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
      clauses: (L || []).map((te) => Object.fromEntries(Object.keys(Ou()).map((Ye) => [Ye, te[Ye]])))
    }), y("沿用已绑定原件；原文变化时请重新上传"), k(!0), Z.current = crypto.randomUUID();
  }, st = (C) => void Fe(async () => {
    if (!R) return;
    const w = await u(`/standards/${R.id}/actions`, { method: "POST", body: JSON.stringify({ action: C, row_version: R.row_version, reason: Le, evidence_checked: We }) });
    Y({ ...R, ...w }), Ke(), Qe((P) => P + 1), ue(Cf[C] + "成功。"), pe(""), X(!1), R.source_available !== !1 && Y(await u("/standards/" + R.id));
  }), at = () => void Fe(async () => {
    if (!R) return;
    const C = await Zt(`/api/v1/standards/${R.id}/source`, { headers: { Authorization: `Bearer dev-${_}` } });
    if (!C.ok) {
      const Ue = await C.json();
      throw new Error(Ue.message || "原件不可用。");
    }
    const w = await C.blob(), P = URL.createObjectURL(w), Ne = document.createElement("a");
    Ne.href = P, Ne.download = "规范原件" + (w.type.includes("pdf") ? ".pdf" : w.type.includes("wordprocessing") ? ".docx" : ".txt"), Ne.click(), setTimeout(() => URL.revokeObjectURL(P), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module standards-module", children: [
    /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "规范原文与版本" }),
      /* @__PURE__ */ s.jsx("p", { children: "绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。" })
    ] }) }),
    Ee && /* @__PURE__ */ s.jsxs("p", { className: "feedback error", role: "alert", children: [
      Ee,
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => Qe((C) => C + 1), children: "刷新列表" })
    ] }),
    F && /* @__PURE__ */ s.jsx("p", { className: "feedback success", role: "status", children: F }),
    /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "规范项目", disabled: se, value: o, onChange: (C) => {
          Oe() && (W.current++, z(C.target.value), Y(null), M(null), k(!1), H(""), ie(null));
        }, children: h.map((C) => /* @__PURE__ */ s.jsx("option", { value: C.id, children: C.name }, C.id)) })
      ] }),
      re && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !o, onClick: () => {
        Oe() && (M(Cj(o)), Y(null), y(""), k(!1), Z.current = crypto.randomUUID());
      }, children: "登记规范原文" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || ye, onClick: () => Qe((C) => C + 1), children: "刷新" })
    ] }),
    !o && /* @__PURE__ */ s.jsx("p", { className: "panel empty", children: "没有可访问项目。" }),
    ye ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取规范版本…" }) : /* @__PURE__ */ s.jsx("section", { className: "panel", children: /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
      !D.length && /* @__PURE__ */ s.jsxs("p", { children: [
        "当前页没有",
        it ? "已登记" : "已发布",
        "的规范版本。"
      ] }),
      D.map((C) => /* @__PURE__ */ s.jsxs("article", { className: "standard-entry", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: C.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            C.code,
            " · ",
            C.edition,
            " · 修订 ",
            C.version,
            " · ",
            kf[C.state]
          ] }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "生效 ",
            C.valid_from,
            "；",
            C.valid_until ? "自 " + C.valid_until + " 起不再适用" : "未登记废止日期",
            C.source_available === !1 ? " · 原件不可用" : ""
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void He(C), children: "查看与核验" }),
        et && C.source_available === !1 && ["published", "approved", "superseded"].includes(C.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se, onClick: () => {
          Y(C), M(null), X(!1), pe("来源不可用，撤回规范");
        }, children: "办理撤回" })
      ] }, C.id)),
      /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !ne || se, onClick: () => H(""), children: "返回首页" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !je || se, onClick: () => H(je || ""), children: "下一页" })
      ] })
    ] }) }),
    v && /* @__PURE__ */ s.jsxs("form", { className: "panel", onSubmit: (C) => {
      C.preventDefault(), Fe(async () => {
        if (!v.source_asset_id) throw new Error("请先上传规范原件。");
        const w = { ...v, scope: Object.fromEntries(Object.entries(v.scope).map(([Ne, Ue]) => [Ne, Ma(Ue.join(`
`))])), clauses: v.clauses.map((Ne) => ({
          ...Ne,
          preconditions: Ma(Ne.preconditions.join(`
`)),
          exceptions: Ma(Ne.exceptions.join(`
`)),
          tables: Ma(Ne.tables.join(`
`)),
          notes: Ma(Ne.notes.join(`
`)),
          references: Ma(Ne.references.join(`
`))
        })) }, P = await u("/standards", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify(w) });
        Ke(), M(null), Y(await u("/standards/" + P.id)), Qe((Ne) => Ne + 1), ue("规范草稿已保存，需核验后发布。");
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
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 300, value: v.title, onChange: (C) => De({ title: C.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "规范编号",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 128, value: v.code, readOnly: v.expected_version > 0, onChange: (C) => De({ code: C.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "版本标识",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: v.edition, readOnly: v.expected_version > 0, onChange: (C) => De({ edition: C.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源维护责任人",
            /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: v.maintainer, onChange: (C) => De({ maintainer: C.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "生效日期",
            /* @__PURE__ */ s.jsx("input", { required: !0, type: "date", value: v.valid_from, onChange: (C) => De({ valid_from: C.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "废止日期（当天起不再适用，可留空）",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: v.valid_until || "", onChange: (C) => De({ valid_until: C.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）",
          /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".pdf,.docx,.txt", onChange: (C) => {
            var P;
            const w = (P = C.target.files) == null ? void 0 : P[0];
            w && Fe(async () => {
              if (w.size > 5e6) throw new Error("原件超过5MB，请先分卷整理。");
              const Ne = await u(`/standards/source-files?project_id=${encodeURIComponent(o)}&name=${encodeURIComponent(w.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: w });
              De({ source_asset_id: Ne.asset_id }), y(w.name), ue("原件已上传，请逐条核对原文。自动解析尚未接入。");
            });
          } })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: oe || "尚未选择原件" }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "适用范围（每行一项；空白表示未限定该维度）" }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_types", "项目类型"], ["regions", "地域"], ["object_types", "作业对象"], ["stages", "作业阶段"]].map(([C, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("textarea", { value: v.scope[C].join(`
`), onChange: (P) => De({ scope: { ...v.scope, [C]: P.target.value.split(`
`) } }) })
          ] }, C)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { children: "条文与上下文" }),
        v.clauses.map((C, w) => /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("legend", { children: [
            "条文 ",
            w + 1
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "条号",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 100, value: C.number, onChange: (P) => ke(w, { number: P.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "所属章节",
              /* @__PURE__ */ s.jsx("input", { required: !0, maxLength: 200, value: C.chapter, onChange: (P) => ke(w, { chapter: P.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "父条号（可留空）",
              /* @__PURE__ */ s.jsx("input", { value: C.parent_number || "", onChange: (P) => ke(w, { parent_number: P.target.value || null }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "原文页码",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 1e5, value: C.page || "", onChange: (P) => ke(w, { page: P.target.value ? Number(P.target.value) : null }) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "原文位置（无页码时必填）",
            /* @__PURE__ */ s.jsx("input", { value: C.locator, onChange: (P) => ke(w, { locator: P.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "条文原文",
            /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 12e3, value: C.text, onChange: (P) => ke(w, { text: P.target.value }) })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "前置条件、例外、表格、注释与引用（每行一项）" }),
            [["preconditions", "前置条件"], ["exceptions", "例外条件"], ["tables", "相关表格原文"], ["notes", "注释"], ["references", "引用条款"]].map(([P, Ne]) => /* @__PURE__ */ s.jsxs("label", { children: [
              Ne,
              /* @__PURE__ */ s.jsx("textarea", { value: C[P].join(`
`), onChange: (Ue) => ke(w, { [P]: Ue.target.value.split(`
`) }) })
            ] }, P))
          ] }),
          v.clauses.length > 1 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", onClick: () => De({ clauses: v.clauses.filter((P, Ne) => Ne !== w) }), children: "删除此条草稿" })
        ] }, w)),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "button secondary", disabled: v.clauses.length >= 200, onClick: () => De({ clauses: [...v.clauses, Ou()] }), children: "添加条文" }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "录入或修订原因",
          /* @__PURE__ */ s.jsx("textarea", { required: !0, maxLength: 200, value: v.reason, onChange: (C) => De({ reason: C.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", type: "submit", disabled: !v.source_asset_id, children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", type: "button", onClick: () => {
          Oe() && (M(null), k(!1));
        }, children: "取消编辑" })
      ] })
    ] }),
    R && !v && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { children: R.title }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          R.code,
          " · ",
          R.edition,
          " · 修订 ",
          R.version,
          " · ",
          kf[R.state]
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
        /* @__PURE__ */ s.jsxs("p", { children: [
          "维护人：",
          R.maintainer,
          "；核验日期：",
          R.verified_on || "尚未核验",
          "。有效区间：",
          R.valid_from,
          " 至 ",
          R.valid_until || "未登记废止日期",
          "。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || R.source_available === !1, onClick: at, children: "下载核对原件" }),
          re && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !R.clauses, onClick: Ie, children: "以此版本修订" })
        ] }),
        (ct = R.clauses) == null ? void 0 : ct.map((C) => /* @__PURE__ */ s.jsxs("article", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsxs("h4", { children: [
            C.number,
            " · ",
            C.chapter
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "父条号：",
            C.parent_number || "无",
            "；",
            C.page ? "第 " + C.page + " 页；" : "",
            C.locator
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: C.text }),
          [["preconditions", "前置条件"], ["exceptions", "例外"], ["tables", "表格"], ["notes", "注释"], ["references", "引用条款"]].map(([w, P]) => C[w].length > 0 && /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: P }),
            C[w].map((Ne, Ue) => /* @__PURE__ */ s.jsx("p", { className: "standard-original", children: Ne }, Ue))
          ] }, w))
        ] }, C.number)),
        R.state === "published" && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", children: [
          /* @__PURE__ */ s.jsx("legend", { children: "核对版本及适用范围" }),
          /* @__PURE__ */ s.jsx("p", { children: "此处只核对已登记条件，具体条文前提和例外仍需专业判断。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "用途",
            /* @__PURE__ */ s.jsxs("select", { value: Q, onChange: (C) => {
              le(C.target.value), ie(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "current_rectification", children: "当前整改" }),
              /* @__PURE__ */ s.jsx("option", { value: "historical_review", children: "历史复盘" })
            ] })
          ] }),
          Q === "historical_review" && /* @__PURE__ */ s.jsxs("label", { children: [
            "事件日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ce, onChange: (C) => {
              m(C.target.value), ie(null);
            } })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "form-grid", children: [["project_type", "项目类型"], ["region", "地域"], ["object_type", "作业对象"], ["stage", "作业阶段"]].map(([C, w]) => /* @__PURE__ */ s.jsxs("label", { children: [
            w,
            /* @__PURE__ */ s.jsx("input", { value: B[C], onChange: (P) => {
              I({ ...B, [C]: P.target.value }), ie(null);
            } })
          ] }, C)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se, onClick: () => void Fe(async () => {
            ie(await u(`/standards/${R.id}/applicability`, { method: "POST", body: JSON.stringify({ purpose: Q, event_date: Ce || null, ...B }) }));
          }), children: "核对条件" }),
          ae && /* @__PURE__ */ s.jsxs("div", { role: "status", children: [
            /* @__PURE__ */ s.jsx("p", { children: { candidate: "日期与登记范围符合，仍需核对具体条文", needs_information: "条件不全，请补充", not_applicable: "存在不适用条件", unavailable: "版本不可用" }[ae.status] }),
            ae.missing.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
              "待补：",
              ae.missing.map((C) => ({ event_date: "事件日期", project_type: "项目类型", region: "地域", object_type: "作业对象", stage: "作业阶段" })[C] || C).join("、")
            ] }),
            ae.reasons.map((C) => /* @__PURE__ */ s.jsx("p", { children: C }, C)),
            /* @__PURE__ */ s.jsx("p", { children: ae.note })
          ] })
        ] }),
        it && /* @__PURE__ */ s.jsxs("fieldset", { className: "standard-clause", disabled: se, children: [
          /* @__PURE__ */ s.jsx("legend", { children: "审核与发布" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "操作说明",
            /* @__PURE__ */ s.jsx("textarea", { value: Le, maxLength: 2e3, onChange: (C) => pe(C.target.value) })
          ] }),
          R.state === "pending_review" && Ae && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: We, onChange: (C) => X(C.target.checked) }),
            "已逐项核对条号、原文、上下文、适用范围及有效日期"
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "standards-toolbar", children: [
            R.state === "draft" && re && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Le.trim(), onClick: () => st("submit"), children: "提交审核" }),
            R.state === "pending_review" && Ae && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Le.trim() || !We, onClick: () => st("approve"), children: "审核通过" }),
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !Le.trim(), onClick: () => st("request_changes"), children: "退回修改" })
            ] }),
            R.state === "approved" && et && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: !Le.trim(), onClick: () => st("publish"), children: "发布此版本" }),
            ["published", "approved", "superseded"].includes(R.state) && et && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: !Le.trim(), onClick: () => st("withdraw"), children: "撤回此版本" })
          ] }),
          R.state === "changes_requested" && /* @__PURE__ */ s.jsx("p", { children: "请使用“以此版本修订”保存新稿，再提交审核。" })
        ] }),
        /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsx("summary", { children: "操作记录" }),
          (qe = R.history) == null ? void 0 : qe.map((C, w) => /* @__PURE__ */ s.jsxs("p", { children: [
            Cf[C.action] || C.action,
            " · ",
            C.reason,
            " · ",
            new Date(C.created_at).toLocaleString("zh-CN")
          ] }, w))
        ] })
      ] })
    ] })
  ] });
}
const Ya = { kind: "asset", id: "", quote: "", locator: "" }, Ff = { record_key: "", kind: "inspection", date: "", text: "", evidence: [Ya] }, If = { code: "", name: "", parent: null, positive_examples: [""], negative_examples: [""] }, Pf = { text: "", nature: "fact", evidence: [Ya] }, em = { number: "", title: "", operation: "", risks: [""], measures: [""], checks: [""], evidence: [Ya] }, Oj = { name: "", value: null, evidence: [Ya] }, Ef = {
  taxonomy: { kind: "taxonomy", rule: "", categories: [If] },
  hazard: { kind: "hazard", description: "", occurred_on: "", stage: "", object_name: "", taxonomy_id: "", category: "", subcategory: "", tags: [], classification_reason: "", original_risk: "待核实", reviewed_risk: "待核实", risk_reason: "", status: "unverified", nature: "observed_hazard", split_reason: "", relation: "independent", related_event_id: null, records: [Ff] },
  compilation: { kind: "compilation", mode: "single", event_ids: [""], background: "", claims: [Pf], differences: "", limitations: [""], missing: [] },
  guide: { kind: "guide", conditions: { 项目类型: "", 地域: "", 作业对象: "", 设备型号: "", 环境: "", 人员: "", 前置方案: "" }, required_conditions: ["项目类型", "作业对象", "人员", "前置方案"], preparation: "", implementation: "", risk_control: "", acceptance: "", emergency: "", steps: [em], parameters: [], missing: [], conflicts: [] },
  question: { kind: "question", guide_id: "", chapter: "", role: "", step: "", risk: "", point: "", cognitive_level: "recall", difficulty: "medium", type: "single", stem: "", options: { a: "", b: "", c: "", d: "" }, answer: ["a"], explanation: "", rubric: [], evidence: [{ ...Ya, kind: "work" }], historical_case_ids: [] }
}, Tj = { evidence: Ya, records: Ff, categories: If, claims: Pf, steps: em, parameters: Oj }, Ha = {
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
function cc({ value: u, onChange: h, catalog: _, name: o = "", path: z = "content", readonly: D = !1 }) {
  var v;
  const V = Ha[o] || o;
  if (Array.isArray(u)) return /* @__PURE__ */ s.jsxs("fieldset", { className: "wf-group", children: [
    /* @__PURE__ */ s.jsx("legend", { children: V }),
    u.map((M, K) => /* @__PURE__ */ s.jsxs("div", { className: "wf-array", children: [
      /* @__PURE__ */ s.jsx(cc, { value: M, name: o.endsWith("_ids") ? o.slice(0, -1) : "", path: z + "." + K, catalog: _, readonly: D, onChange: (k) => h(u.map((se, me) => me === K ? k : se)) }),
      !D && /* @__PURE__ */ s.jsx("button", { type: "button", className: "button ghost", "aria-label": "删除" + V + String(K + 1), onClick: () => h(u.filter((k, se) => K !== se)), children: "移除" })
    ] }, K)),
    !D && /* @__PURE__ */ s.jsxs("button", { type: "button", className: "button ghost", onClick: () => h([...u, structuredClone(Tj[o] ?? "")]), children: [
      "添加",
      V
    ] })
  ] });
  if (u !== null && typeof u == "object") return /* @__PURE__ */ s.jsx("div", { className: "wf-fields", children: Object.entries(u).map(([M, K]) => M === "kind" && z === "content" ? null : /* @__PURE__ */ s.jsx(cc, { name: M, value: K, path: z + "." + M, catalog: _, readonly: D, onChange: (k) => {
    const se = { ...u, [M]: k };
    M === "type" && ["judgment", "case"].includes(String(k)) && (se.options = {}), M === "kind" && "id" in u && (se.id = ""), h(se);
  } }, M)) });
  let R = zj[o];
  o === "kind" && (R = z.includes(".records.") ? [["inspection", "检查"], ["rectification", "整改"], ["reinspection", "复查"]] : [["asset", "原件"], ["record", "历史记录"], ["standard", "规范版本"], ["work", "知识成果"]]), o === "nature" && (R = z.includes("claims") ? [["fact", "原始事实"], ["source_conclusion", "资料已有结论"], ["analysis", "系统分析"], ["hypothesis", "待核实假设"]] : [["observed_hazard", "已发现隐患"], ["potential_source", "潜在风险源"]]);
  const Y = { taxonomy_id: "taxonomy", guide_id: "guide", related_event_id: "hazard", event_id: "hazard" };
  return (o === "id" || o in Y || o === "historical_case_id") && (R = _.filter((M) => o in Y ? M.work_kind === Y[o] : o === "historical_case_id" ? ["hazard", "compilation"].includes(M.work_kind || "") : !0).map((M) => [M.id, M.label])), /* @__PURE__ */ s.jsxs("label", { className: "wf-field", htmlFor: z, children: [
    /* @__PURE__ */ s.jsx("span", { children: V || "内容" }),
    D ? /* @__PURE__ */ s.jsx("div", { className: "wf-value", children: ((v = R == null ? void 0 : R.find((M) => M[0] === String(u))) == null ? void 0 : v[1]) || String(u ?? "待填") }) : R ? /* @__PURE__ */ s.jsxs("select", { id: z, value: String(u ?? ""), onChange: (M) => h(M.target.value || null), children: [
      /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
      R.map(([M, K]) => /* @__PURE__ */ s.jsx("option", { value: M, children: K }, M))
    ] }) : o === "date" || o === "occurred_on" ? /* @__PURE__ */ s.jsx("input", { id: z, type: "date", value: String(u ?? ""), onChange: (M) => h(M.target.value) }) : /* @__PURE__ */ s.jsx("textarea", { id: z, rows: ["description", "text", "quote", "operation", "rule", "stem"].includes(o) ? 3 : 2, value: String(u ?? ""), onChange: (M) => h(M.target.value === "" && ["parent", "value", "related_event_id"].includes(o) ? null : M.target.value) })
  ] });
}
const Of = { draft: "草稿", pending_review: "待审核", approved: "审核通过", published: "已发布", changes_requested: "退回修改", superseded: "已有新版本", withdrawn: "已撤回" }, Tf = { submit: "提交审核", approve: "审核通过", request_changes: "退回修改", publish: "发布", withdraw: "撤回" };
function Aj({ api: u, projects: h, identity: _ }) {
  var C;
  const [o, z] = r.useState(((C = h[0]) == null ? void 0 : C.id) || ""), [D, V] = r.useState("hazard"), [R, Y] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState(null), [se, me] = r.useState(null), [ye, _e] = r.useState(""), [Ee, he] = r.useState(!1), [F, ue] = r.useState(""), [ne, H] = r.useState(""), [je, Re] = r.useState(!1), [Be, Qe] = r.useState(!1), [Le, pe] = r.useState(0), [We, X] = r.useState(null), [oe, y] = r.useState(""), [Q, le] = r.useState(null), [Ce, m] = r.useState(null), [B, I] = r.useState(null), [ae, ie] = r.useState(null), Z = r.useRef(crypto.randomUUID()), W = r.useRef(0), we = r.useRef(!1), re = h.find((w) => w.id === o), Ae = (w) => {
    var P, Ne;
    return re != null && re.permissions ? re.permissions.includes(w) : w.startsWith("training.") ? !!((P = re == null ? void 0 : re.roles) != null && P.some((Ue) => ["admin", "teacher"].includes(Ue))) : w === "knowledge.process" ? !!(re != null && re.can_run) : !!(re != null && re.can_manage) || !!((Ne = re == null ? void 0 : re.roles) != null && Ne.includes("reviewer"));
  }, et = Ae(D === "question" ? "training.manage" : "knowledge.process"), it = Ae(D === "question" ? "training.review" : "knowledge.review"), Fe = Ae(D === "question" ? "training.review" : "knowledge.publish"), Ke = et || it || Fe, Oe = () => {
    var w;
    we.current = !1, (w = window.QaxcClearPendingEdits) == null || w.call(window);
  }, De = () => !we.current || confirm("当前草稿尚未保存，确定放弃编辑？");
  r.useEffect(() => {
    const w = (P) => {
      we.current && (P.preventDefault(), P.returnValue = "");
    };
    return window.addEventListener("beforeunload", w), () => window.removeEventListener("beforeunload", w);
  }, []), r.useEffect(() => {
    let w = !1;
    if (Qe(!0), Y([]), ue(""), !o) {
      Qe(!1);
      return;
    }
    return u(`/workflows?project_id=${encodeURIComponent(o)}&kind=${D}&view=${Ke ? "manage" : "published"}${oe ? "&cursor=" + encodeURIComponent(oe) : ""}`).then((P) => {
      w || (Y(P.items), X(P.next_cursor));
    }).catch((P) => {
      w || ue(P.message);
    }).finally(() => {
      w || Qe(!1);
    }), Ke && u(`/workflows/catalog?project_id=${encodeURIComponent(o)}`).then((P) => {
      w || M(P.items);
    }).catch((P) => {
      w || ue(P.message);
    }), D === "hazard" && u(`/workflows/hazards/statistics?project_id=${encodeURIComponent(o)}`).then((P) => {
      w || le(P);
    }).catch((P) => {
      w || ue(P.message);
    }), () => {
      w = !0;
    };
  }, [o, D, oe, Ke, Le]), r.useEffect(() => () => {
    W.current++;
  }, []);
  const ke = async (w) => {
    Re(!0), ue(""), H("");
    try {
      await w();
    } catch (P) {
      ue(P.message);
    } finally {
      Re(!1);
    }
  }, He = () => {
    W.current++, k(null), me(null), m(null), I(null), ie(null), y(""), _e(""), he(!1), Oe();
  }, Ie = async (w) => {
    if (!De()) return;
    const P = ++W.current;
    await ke(async () => {
      const Ne = await u("/workflows/" + w.id);
      P === W.current && (k(Ne), me(null), _e(""), he(!1), I(null), ie(null), Oe());
    });
  }, st = (w) => {
    me((P) => P && { ...P, ...w }), we.current = !0, Z.current = crypto.randomUUID();
  }, at = () => ke(async () => {
    if (!se) return;
    const w = await u("/workflows", { method: "POST", headers: { "Idempotency-Key": Z.current }, body: JSON.stringify({ ...se, project_id: o, reason: ye }) });
    k(w), me(null), Oe(), pe((P) => P + 1), H("已保存新版本，尚未审核发布。");
  }), ve = (w, P) => ke(async () => {
    const Ne = await u(`/workflows/${w.id}/actions`, { method: "POST", body: JSON.stringify({ action: P, row_version: w.row_version, reason: ye, evidence_checked: Ee }) });
    k(P === "withdraw" ? null : await u("/workflows/" + Ne.id)), pe((Ue) => Ue + 1), Oe(), H(Tf[P] + "已完成");
  }), ct = (w) => ke(async () => {
    const P = await u(`/workflows/hazards/drilldown?project_id=${encodeURIComponent(o)}&category=${encodeURIComponent(w)}&limit=100`);
    m(P.items);
  }), qe = () => ke(async () => {
    if (!K) return;
    const w = await Zt("/api/v1/workflows/" + K.id + "/export", { headers: { Authorization: "Bearer dev-" + _ } });
    if (!w.ok) throw new Error("导出失败，请核对来源是否仍可用。");
    const P = URL.createObjectURL(await w.blob()), Ne = document.createElement("a");
    Ne.href = P, Ne.download = K.title + ".docx", Ne.click(), setTimeout(() => URL.revokeObjectURL(P), 1e3);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module wf-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目 ",
        /* @__PURE__ */ s.jsx("select", { value: o, disabled: je, onChange: (w) => {
          De() && (He(), z(w.target.value));
        }, children: h.map((w) => /* @__PURE__ */ s.jsx("option", { value: w.id, children: w.name }, w.id)) })
      ] }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => pe((w) => w + 1), children: "刷新" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "wf-tabs", "aria-label": "知识业务", children: Object.keys(Ef).map((w) => /* @__PURE__ */ s.jsx("button", { disabled: je, className: "button " + (D === w ? "primary" : "ghost"), onClick: () => {
      De() && (He(), V(w));
    }, children: Ha[w] }, w)) }),
    F && /* @__PURE__ */ s.jsx("div", { role: "alert", className: "error-banner", children: F }),
    ne && /* @__PURE__ */ s.jsx("p", { role: "status", children: ne }),
    D === "hazard" && Q && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
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
      /* @__PURE__ */ s.jsx("div", { className: "wf-tabs", children: Q.categories.map((w) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: je, onClick: () => ct(w.category), children: [
        w.category,
        " · ",
        w.count,
        " 个事件 · 查看明细"
      ] }, w.category)) }),
      Ce && /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("p", { children: "明细最多显示100条；数量口径与分类统计一致。" }),
        Ce.map((w) => /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => Ie(w), children: w.title }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          Ha[D],
          "清单"
        ] }),
        et && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: je, onClick: () => {
          De() && (He(), me({ title: "", series: crypto.randomUUID(), expected_version: 0, content: structuredClone(Ef[D]) }), we.current = !0, Z.current = crypto.randomUUID());
        }, children: [
          "新建",
          Ha[D]
        ] })
      ] }),
      Be ? /* @__PURE__ */ s.jsx("p", { role: "status", children: "正在读取…" }) : R.length === 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
        "暂无",
        Ha[D],
        "。",
        et ? "可新建草稿，核对依据后提交审核。" : ""
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "wf-list", children: R.map((w) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsx("button", { className: "wf-title", disabled: je || w.source_available === !1, onClick: () => Ie(w), children: w.title }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "v",
          w.version,
          " · ",
          Of[w.state],
          w.source_available === !1 ? " · 来源失效，需重新核验" : ""
        ] }),
        Fe && w.source_available === !1 && ["published", "approved", "superseded"].includes(w.state) && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => ve(w, "withdraw"), children: "撤回此版本" })
      ] }, w.id)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        oe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(""), children: "首页" }),
        We && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => y(We), children: "下一页" })
      ] })
    ] }),
    se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        "编辑",
        Ha[D],
        " · 保存生成新版本"
      ] }),
      /* @__PURE__ */ s.jsxs("fieldset", { disabled: je, className: "wf-editor", children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
          "标题",
          /* @__PURE__ */ s.jsx("input", { value: se.title, onChange: (w) => st({ title: w.target.value }) })
        ] }),
        /* @__PURE__ */ s.jsx(cc, { value: se.content, catalog: v, onChange: (w) => st({ content: w }) })
      ] })
    ] }),
    K && !se && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("h3", { children: [
        K.title,
        " · v",
        K.version,
        " · ",
        Of[K.state]
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
        et && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: () => {
          me({ title: K.title, series: K.series, expected_version: K.version, content: structuredClone(K.content) }), we.current = !0, Z.current = crypto.randomUUID();
        }, children: "另存修订版" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je, onClick: qe, children: "导出Word" }),
        Ae("knowledge.process") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ke(async () => {
          I((await u(`/workflows/impacts?project_id=${encodeURIComponent(o)}&source_kind=work&source_id=${K.id}`)).items);
        }), children: "查看下游影响" }),
        D === "guide" && K.state === "published" && Ae("training.manage") && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ke(async () => ie(await u("/workflows/" + K.id + "/blueprint"))), children: "考点覆盖" }),
        D === "question" && K.state === "published" && et && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je, onClick: () => ke(async () => {
          await u("/workflows/" + K.id + "/training-bank", { method: "POST" }), H("已加入现有培训题库，可在培训页面编入学习包。");
        }), children: "加入培训题库" })
      ] }),
      B && /* @__PURE__ */ s.jsxs("p", { children: [
        "关联下游：",
        B.length ? B.map((w) => w.title + " v" + w.version).join("；") : "暂无下游成果"
      ] }),
      ae && /* @__PURE__ */ s.jsx("ul", { children: ae.steps.map((w) => /* @__PURE__ */ s.jsxs("li", { children: [
        w.number,
        " ",
        w.title,
        "：",
        w.question_count,
        " 道已发布题目"
      ] }, w.number)) }),
      /* @__PURE__ */ s.jsx(cc, { value: K.content, catalog: v, readonly: !0, onChange: () => {
      } }),
      K.history && /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "审核与版本记录" }),
        K.history.map((w, P) => /* @__PURE__ */ s.jsxs("p", { children: [
          Tf[w.action] || w.action,
          "：",
          w.reason
        ] }, P))
      ] })
    ] }),
    Ke && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("label", { className: "wf-field", children: [
        "保存 / 审核 / 撤回说明",
        /* @__PURE__ */ s.jsx("textarea", { value: ye, onChange: (w) => _e(w.target.value), placeholder: "说明依据、修改或撤回原因" })
      ] }),
      se ? /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim() || !se.title.trim(), onClick: at, children: "保存草稿" }) : K && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { className: "wf-check", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ee, onChange: (w) => he(w.target.checked) }),
          "已核对原文、事实、分类与适用条件；缺项和冲突已处理"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
          K.state === "draft" && et && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim(), onClick: () => ve(K, "submit"), children: "提交审核" }),
          K.state === "pending_review" && it && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !Ee || !ye.trim(), onClick: () => ve(K, "approve"), children: "审核通过" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => ve(K, "request_changes"), children: "退回修改" })
          ] }),
          K.state === "approved" && Fe && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: je || !ye.trim(), onClick: () => ve(K, "publish"), children: "发布" }),
          ["published", "approved", "superseded"].includes(K.state) && Fe && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: je || !ye.trim(), onClick: () => ve(K, "withdraw"), children: "撤回" })
        ] })
      ] })
    ] })
  ] });
}
const zf = { queued: "等待处理", fetching: "正在取件", validating: "正在校验", processing: "正在处理", ready: "已完成", failed: "处理失败", withdrawn: "已撤回", not_created: "尚未生成" };
function Rj({ id: u, identity: h, projects: _, navigate: o }) {
  const [z, D] = r.useState(null), [V, R] = r.useState(""), [Y, v] = r.useState(!1), [M, K] = r.useState(""), [k, se] = r.useState(0), me = `a-import-action:${h}:${u}`;
  async function ye(he, F) {
    const ue = await Zt("/integration/v1/a-imports/" + u + he, F), ne = await ue.json().catch(() => ({}));
    if (!ue.ok)
      throw ue.status >= 400 && ue.status < 500 && sessionStorage.removeItem(me), new Error(ne.message || `请求未完成（${ue.status}），请刷新查看最新状态。`);
    return ne;
  }
  r.useEffect(() => {
    let he = !1;
    async function F() {
      try {
        const ne = await ye("");
        he || (D(ne), R(""));
      } catch (ne) {
        he || (D(null), R(ne.message));
      }
    }
    D(null), F();
    const ue = window.setInterval(F, 3e3);
    return () => {
      he = !0, clearInterval(ue);
    };
  }, [u, k, h]);
  const _e = (he) => {
    var F, ue;
    return !!z && !!((ue = (F = _.find((ne) => ne.id === z.project_id)) == null ? void 0 : F.permissions) != null && ue.includes(he));
  };
  async function Ee(he) {
    if (!(!z || Y)) {
      v(!0), R("");
      try {
        const F = sessionStorage.getItem(me), ue = F ? JSON.parse(F) : { operation: he, key: crypto.randomUUID(), body: { expected_version: z.version, ...he === "withdraw" ? { reason: M.trim() } : {} } };
        if (ue.operation !== he) throw new Error("上一次操作结果尚未确认，请先重试该操作或刷新核对状态。");
        sessionStorage.setItem(me, JSON.stringify(ue)), await ye("/" + he, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": ue.key }, body: JSON.stringify(ue.body) }), sessionStorage.removeItem(me), se((ne) => ne + 1);
      } catch (F) {
        R(F.message);
      } finally {
        v(!1);
      }
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel a-import-detail", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ s.jsx("h2", { children: "成果处理状态" }),
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => se((he) => he + 1), disabled: Y, children: "刷新状态" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "a-import-body", children: [
      /* @__PURE__ */ s.jsx("p", { children: "指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。" }),
      V && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "feedback error", children: V }),
      z ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("dl", { className: "a-import-status", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "成果版本" }),
            /* @__PURE__ */ s.jsxs("dd", { children: [
              "v",
              z.delivery_version
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "接入状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: zf[z.status] || z.status })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "复盘状态" }),
            /* @__PURE__ */ s.jsx("dd", { children: zf[z.retrospective_status] || z.retrospective_status })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: "证据完整性：" }),
          z.capabilities.evidence_complete ? "已通过附件校验" : "存在缺失或尚未完成校验"
        ] }),
        z.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: z.error.message }),
        z.warnings.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("h3", { children: "资料提示" }),
          /* @__PURE__ */ s.jsx("ul", { children: z.warnings.map((he, F) => /* @__PURE__ */ s.jsx("li", { children: he.message }, he.code + ":" + F)) })
        ] }),
        z.missing_fields.length > 0 && /* @__PURE__ */ s.jsxs("p", { children: [
          "存在 ",
          z.missing_fields.length,
          " 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "a-import-actions", children: [
          z.capabilities.can_view_materials && z.receipt_id && _e("imports.read") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => o("/task-packages/" + z.receipt_id), children: "查看原始资料" }),
          z.capabilities.can_generate_retrospective && _e("retrospective.generate") && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Y, onClick: () => void Ee("retrospectives"), children: z.retrospective_status === "not_created" ? "生成复盘" : "确认复盘状态" }),
          z.retrospective_id && z.status !== "withdrawn" && _e("retrospective.read") && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/retrospectives/" + z.retrospective_id), children: "查看复盘" }),
          (z.status === "failed" || z.retrospective_status === "failed") && _e("imports.retry") && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Y, onClick: () => void Ee("retry"), children: "重试失败任务" })
        ] }),
        z.status !== "withdrawn" && _e("imports.withdraw") && /* @__PURE__ */ s.jsxs("div", { className: "a-import-withdraw", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "撤回原因",
            /* @__PURE__ */ s.jsx("input", { value: M, placeholder: "填写需要停止使用本次接入的原因", maxLength: 2e3, onChange: (he) => K(he.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Y || !M.trim(), onClick: () => void Ee("withdraw"), children: "撤回 B 接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "撤回后停止使用本次接入；A 原归档保留。" })
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: V ? "当前接入暂不可读取，请根据提示处理后刷新。" : "正在读取成果接入状态…" })
    ] })
  ] });
}
function Dj({ navigate: u }) {
  const [h, _] = r.useState([]), [o, z] = r.useState(""), [D, V] = r.useState(!1);
  return r.useEffect(() => {
    let R = !1;
    return (async () => {
      try {
        const [Y, v, M] = await Promise.all([Zt("/api/v1/health"), Zt("/api/v1/audit-events?limit=50"), fetch("/quality/api/work/state", { credentials: "same-origin" })]);
        if (!Y.ok || !v.ok || !M.ok) throw Error("无法读取运行记录，请确认登录及项目管理权限。");
        const [K, k, se] = await Promise.all([Y.json(), v.json(), M.json()]), me = window.QaxcProjectId, ye = se.tasks.filter((_e) => !me || _e.projectId === me).flatMap((_e) => (_e.events || []).map((Ee) => ({ id: Ee.id, action: _e.title + " · " + Ee.action, project_id: _e.projectId, created_at: Ee.uploadedAt, source: "现场作业" })));
        R || (V(K.worker_online), _([...ye, ...k.items.map((_e) => ({ ..._e, source: "知识与学习" }))].sort((_e, Ee) => Date.parse(Ee.created_at) - Date.parse(_e.created_at)).slice(0, 100)));
      } catch (Y) {
        R || z(Y.message);
      }
    })(), () => {
      R = !0;
    };
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "平台运行与操作记录" }),
    /* @__PURE__ */ s.jsxs("p", { role: "status", children: [
      "后台处理：",
      D ? "在线" : "未连接或正在读取",
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
        /* @__PURE__ */ s.jsx("tbody", { children: h.map((R) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: new Date(R.created_at).toLocaleString("zh-CN") }),
          /* @__PURE__ */ s.jsx("td", { children: R.source }),
          /* @__PURE__ */ s.jsx("td", { children: R.action })
        ] }, R.source + R.id)) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { children: "暂无操作记录。" })
    ] })
  ] });
}
function Uj({ deliveryId: u, navigate: h }) {
  const [_, o] = r.useState(!1), [z, D] = r.useState("读取固定归档版本并校验证据后，生成待审核复盘。"), V = r.useRef(!0);
  r.useEffect(() => (V.current = !0, () => {
    V.current = !1;
  }), []);
  async function R(v, M, K) {
    const k = await Zt("/api/v1" + v, { method: M ? "POST" : "GET", headers: { "Content-Type": "application/json", ...K ? { "Idempotency-Key": K } : {} }, body: M ? JSON.stringify(M) : void 0 }), se = await k.json();
    if (!k.ok) throw Error(se.message || "处理失败，请重试");
    return se;
  }
  async function Y() {
    if (_) return;
    o(!0);
    const v = "archive-review:" + u, M = sessionStorage.getItem(v) || crypto.randomUUID();
    sessionStorage.setItem(v, M);
    try {
      D("正在核验归档成果…");
      const K = await R("/platform-archives", { delivery_id: u }, M);
      for (let k = 0; k < 60 && V.current; k++) {
        const se = await R("/task-packages/" + K.receipt_id);
        if (!V.current) return;
        if (se.status === "ready") {
          D("证据已校验，正在生成复盘…");
          const me = await R("/retrospectives", { mode: "task_process", task_package_id: se.id });
          V.current && h("/retrospectives/" + me.id);
          return;
        }
        if (["failed", "withdrawn"].includes(se.status)) throw Error("成果处理失败或已撤回，请在成果清单查看原因并重试。");
        D("正在处理成果与证据，离开页面不会取消后台任务…"), await new Promise((me) => setTimeout(me, 1e3));
      }
      V.current && D("成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。");
    } catch (K) {
      V.current && D(K.message);
    } finally {
      V.current && o(!1);
    }
  }
  return /* @__PURE__ */ s.jsxs("section", { className: "panel", style: { padding: 24 }, children: [
    /* @__PURE__ */ s.jsx("h2", { children: "归档成果复盘" }),
    /* @__PURE__ */ s.jsx("p", { role: "status", style: { margin: "20px 0" }, children: z }),
    /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: _, onClick: () => void Y(), children: "生成 / 打开复盘" }),
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
), Af = (u) => {
  const h = qj(u);
  return h.charAt(0).toUpperCase() + h.slice(1);
}, tm = (...u) => u.filter((h, _, o) => !!h && h.trim() !== "" && o.indexOf(h) === _).join(" ").trim(), Hj = (u) => {
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
    className: z = "",
    children: D,
    iconNode: V,
    ...R
  }, Y) => r.createElement(
    "svg",
    {
      ref: Y,
      ...Bj,
      width: h,
      height: h,
      stroke: u,
      strokeWidth: o ? Number(_) * 24 / Number(h) : _,
      className: tm("lucide", z),
      ...!D && !Hj(R) && { "aria-hidden": "true" },
      ...R
    },
    [
      ...V.map(([v, M]) => r.createElement(v, M)),
      ...Array.isArray(D) ? D : [D]
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
    ({ className: o, ...z }, D) => r.createElement(Lj, {
      ref: D,
      iconNode: h,
      className: tm(
        `lucide-${Mj(Af(u))}`,
        `lucide-${u}`,
        o
      ),
      ...z
    })
  );
  return _.displayName = Af(u), _;
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
], Rf = _t("activity", Yj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Df = _t("arrow-left", Gj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], Ml = _t("arrow-right", Xj);
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
], rc = _t("book-open", Qj);
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
const Jj = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], dl = _t("chevron-right", Jj);
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
], ql = _t("circle-alert", Wj);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Hl = _t("circle-check", Fj);
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
], _u = _t("database", ev);
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
], Uf = _t("download", tv);
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
], Yn = _t("file-check-2", av);
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
], Mf = _t("file-input", nv);
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
], Nu = _t("file-search", iv);
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
], tc = _t("folder-lock", cv);
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
], qf = _t("layout-dashboard", hv);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Hf = _t("loader-circle", fv);
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
const jv = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]], Bf = _t("play", jv);
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
], Js = _t("refresh-cw", gv);
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
], Lf = _t("shield-check", _v);
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
], sm = _t("upload", Nv);
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
], ac = _t("x", kv), Hs = { csv: "CSV数据", excel: "Excel表格", governance_export: "治理结果导出", detail: "明细", review: "复查", summary: "汇总", source_row: "原始行", site_photo: "现场照片", text_screenshot: "文字截图" }, qn = { queued: "等待处理", running: "正在接入", failed: "接入中断", completed: "已完成", completed_with_errors: "完成 · 有异常", created: "新增", updated: "更新", skipped: "跳过", candidate: "待确认", confirmed: "已确认重复", rejected: "已排除", stale: "版本已变，需复核" }, Yf = (u) => u ? new Date(u).toLocaleString("zh-CN") : "尚未同步", Gf = (u) => {
  const h = ["description", "隐患描述", "record_id", "来源记录ID", "report_id", "报告ID", "project_id", "项目ID", "record_kind", "记录类型", "inspection_date", "occurred_on", "检查日期", "images", "图片关系"], _ = (o) => h.includes(o) ? h.indexOf(o) : 100;
  return Object.entries(u).sort(([o], [z]) => _(o) - _(z));
}, Su = (u) => typeof u == "object" ? JSON.stringify(u, null, 2) : String(u ?? "—");
function Cv({ asset: u, identity: h }) {
  const [_, o] = r.useState(""), [z, D] = r.useState("");
  return r.useEffect(() => {
    let V = !1, R = "";
    return Zt(`/api/v1/assets/${u}/content`, { headers: { Authorization: `Bearer dev-${h}` } }).then(async (Y) => {
      if (!Y.ok) throw new Error("图片不可访问或已撤回");
      return Y.blob();
    }).then((Y) => {
      R = URL.createObjectURL(Y), V ? URL.revokeObjectURL(R) : o(R);
    }).catch((Y) => {
      V || D(Y.message);
    }), () => {
      V = !0, R && URL.revokeObjectURL(R);
    };
  }, [u, h]), z ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: z }) : _ ? /* @__PURE__ */ s.jsx("img", { className: "evidence-image", src: _, alt: "来源证据图片" }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取图片…" });
}
function Ev({ api: u, path: h, navigate: _, projects: o, identity: z }) {
  var ut, Nt;
  const [D, V] = r.useState([]), [R, Y] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState([]), [se, me] = r.useState("reports"), ye = r.useRef(0), [_e, Ee] = r.useState(""), [he, F] = r.useState([]), [ue, ne] = r.useState(null), [H, je] = r.useState(""), [Re, Be] = r.useState(!1), [Qe, Le] = r.useState([]), [pe, We] = r.useState({}), [X, oe] = r.useState(0), [y, Q] = r.useState(null), [le, Ce] = r.useState(null), [m, B] = r.useState(null), [I, ae] = r.useState(new URLSearchParams(location.search).get("source") || ""), [ie, Z] = r.useState(""), [W, we] = r.useState(!1), [re, Ae] = r.useState(""), [et, it] = r.useState(""), [Fe, Ke] = r.useState(!0), [Oe, De] = r.useState(!1), [ke, He] = r.useState(0), [Ie, st] = r.useState({ project_id: "", source_id: "", record_kind: "", quality_status: "", from_date: "", to_date: "" }), [at, ve] = r.useState(""), [ct, qe] = r.useState(null), [C, w] = r.useState([]), [P, Ne] = r.useState(""), [Ue, lt] = r.useState(0), [ft, L] = r.useState(!1), [de, te] = r.useState("csv"), [Ye, b] = r.useState(""), [ge, xe] = r.useState(""), [Ge, jt] = r.useState(((ut = o.find((g) => g.can_run)) == null ? void 0 : ut.id) || (Rt ? "" : "demo-airport")), T = o.some((g) => g.can_run), j = h.startsWith("/records/"), ce = h.startsWith("/imports/") && h !== "/imports/new", be = D.find((g) => g.id === I), rt = R.filter((g) => g.kind === (be == null ? void 0 : be.kind) && g.project_id === (be == null ? void 0 : be.project_id));
  r.useEffect(() => {
    ve(""), w([]), Ne(""), lt(0), Ae(""), it(""), B(null);
  }, [h]), r.useEffect(() => {
    let g = !1;
    Ke(!0), Ae(""), Ce(null), Q(null);
    const Se = new URLSearchParams(Object.entries(Ie).filter(([, pt]) => !!pt));
    Se.set("limit", "15"), at && Se.set("cursor", at);
    async function nt() {
      try {
        const [pt, x] = await Promise.all([u("/sources?limit=100"), u("/input-files")]);
        if (g) return;
        if (V(pt.items), Y(x.items), h === "/sources" || h === "/imports") {
          const Te = await u("/imports?limit=15" + (at ? "&cursor=" + encodeURIComponent(at) : ""));
          if (g) return;
          M(Te.items), qe(Te.next_cursor);
        } else if (ce) {
          const Te = await u(`${h}?after_row=${Ue}&only_issues=${ft}`);
          g || Q(Te);
        } else if (j) {
          const Te = await u(h + (P ? "?version=" + P : ""));
          g || Ce(Te);
        } else if (h === "/records") {
          const Te = await u("/records?" + Se);
          if (g) return;
          if (Le(Te.items), qe(Te.next_cursor), We(Te.totals_by_kind), oe(Te.detail_groups_after_confirmed_links), se === "reports") {
            const ze = new URLSearchParams(Se);
            ze.delete("cursor"), at && ze.set("after_id", at);
            const tt = await u("/reports?" + ze);
            if (g) return;
            k(tt.items), qe(tt.next_cursor);
          }
        }
      } catch (pt) {
        g || Ae(pt.message);
      } finally {
        g || Ke(!1);
      }
    }
    return nt(), () => {
      g = !0;
    };
  }, [h, Ie, at, P, ke, Ue, ft, se]), r.useEffect(() => {
    if (!ce || !y || !["queued", "running"].includes(y.status)) return;
    let g = !1;
    const Se = setInterval(() => {
      u(`${h}?after_row=${Ue}&only_issues=${ft}`).then((nt) => {
        g || Q(nt);
      }).catch((nt) => {
        g || Ae(nt.message);
      });
    }, 1500);
    return () => {
      g = !0, clearInterval(Se);
    };
  }, [h, y == null ? void 0 : y.status, Ue, ft]), r.useEffect(() => {
    ye.current++, Ee(""), F([]), ne(null), je("");
  }, [Ie, se, h]);
  const N = async (g, Se = !1) => {
    const nt = ++ye.current;
    if (!Se && _e === g) {
      Ee(""), Be(!1);
      return;
    }
    Se || (F([]), ne(null)), Ee(g), Be(!0), je("");
    const pt = new URLSearchParams(Object.entries(Ie).filter(([, x]) => !!x));
    pt.set("document_id", g), pt.set("limit", "15"), Se && ue && pt.set("cursor", ue);
    try {
      const x = await u("/records?" + pt);
      if (nt !== ye.current) return;
      F((Te) => Se ? [...Te, ...x.items] : x.items), ne(x.next_cursor);
    } catch (x) {
      nt === ye.current && je(x.message);
    } finally {
      nt === ye.current && Be(!1);
    }
  }, fe = async (g) => {
    De(!0), Ae(""), it("");
    try {
      await g();
    } catch (Se) {
      Ae(Se.message);
    } finally {
      De(!1);
    }
  }, Ze = () => fe(async () => {
    for (const g of o.filter((Se) => Se.can_run))
      for (const Se of g.id === "demo-airport" ? ["csv", "excel", "governance_export"] : ["csv"]) {
        const nt = `mock-${g.id}-${Se}`;
        D.some((pt) => pt.namespace === nt && pt.project_id === g.id) || await u("/sources", { method: "POST", body: JSON.stringify({ name: `${g.id === "demo-airport" ? "机场" : "地铁"} · ${Hs[Se]}（模拟）`, namespace: nt, kind: Se, project_id: g.id, mapping_template: Se === "governance_export" ? "governance-v1" : `${Se}-v1` }) });
      }
    it("模拟来源已配置。选择“开始接入”，字段映射会自动带入。"), He((g) => g + 1);
  }), kt = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按权限范围显示 · 使用稳定游标分页" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !C.length, onClick: () => {
        ve(C.at(-1) || ""), w(C.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !ct, onClick: () => {
        w([...C, at]), ve(ct || "");
      }, children: "下一页" })
    ] })
  ] }), Yt = (g, Se) => {
    st({ ...Ie, [g]: Se }), ve(""), w([]);
  }, qt = (g) => fe(async () => {
    const Se = await Zt(`/api/v1/assets/${g}/content`, { headers: { Authorization: `Bearer dev-${z}` } });
    if (!Se.ok) {
      const x = await Se.json();
      throw new Error(x.message);
    }
    const nt = URL.createObjectURL(await Se.blob()), pt = document.createElement("a");
    pt.href = nt, pt.download = "来源文件", pt.click(), URL.revokeObjectURL(nt);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "ingestion", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(_u, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "历史资料工作区" : "模拟数据工作区" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目上传CSV、Excel或治理导出文件。原文、人工生效值和来源版本分别保留。" })
      ] })
    ] }),
    re && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      re,
      /* @__PURE__ */ s.jsx("button", { onClick: () => He((g) => g + 1), children: "重新加载" })
    ] }),
    et && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      et
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: h === "/sources" ? "selected" : "", onClick: () => _("/sources"), children: "来源管理" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/imports") ? "selected" : "", onClick: () => _("/imports"), children: "历史项目" }),
        /* @__PURE__ */ s.jsx("button", { className: h.startsWith("/records") ? "selected" : "", onClick: () => _("/records"), children: "风险数据" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => He((g) => g + 1), disabled: Fe, children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Fe ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取数据…" }) : h === "/sources" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel ingest-intro", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "配置一次，后续按变化接入" }),
          /* @__PURE__ */ s.jsx("p", { children: "使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。" })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Oe || !T, onClick: () => void Ze(), children: [
          /* @__PURE__ */ s.jsx(_u, { size: 16 }),
          "一键配置模拟来源"
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "source-grid", children: D.map((g) => {
        var Se, nt;
        return /* @__PURE__ */ s.jsxs("section", { className: "panel source-card", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "source-top", children: [
            /* @__PURE__ */ s.jsx("span", { className: "source-icon", children: /* @__PURE__ */ s.jsx(_u, { size: 22 }) }),
            /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Hs[g.kind] })
          ] }),
          /* @__PURE__ */ s.jsx("h2", { children: g.name }),
          /* @__PURE__ */ s.jsx("p", { children: (Se = o.find((pt) => pt.id === g.project_id)) == null ? void 0 : Se.name }),
          /* @__PURE__ */ s.jsxs("dl", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: "映射模板" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.mapping_version }),
            /* @__PURE__ */ s.jsx("dt", { children: "最近同步" }),
            /* @__PURE__ */ s.jsx("dd", { children: Yf(g.cursor.synced_at) }),
            /* @__PURE__ */ s.jsx("dt", { children: "稳定命名空间" }),
            /* @__PURE__ */ s.jsx("dd", { children: g.namespace })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: !((nt = o.find((pt) => pt.id === g.project_id)) != null && nt.can_run), onClick: () => {
            ae(g.id), Z(""), _("/imports/new?source=" + g.id);
          }, children: [
            "开始接入",
            /* @__PURE__ */ s.jsx(Ml, { size: 16 })
          ] })
        ] }, g.id);
      }) }),
      !D.length && /* @__PURE__ */ s.jsxs("div", { className: "panel empty", children: [
        /* @__PURE__ */ s.jsx(Nu, { size: 38 }),
        /* @__PURE__ */ s.jsx("h2", { children: "还没有配置来源" }),
        /* @__PURE__ */ s.jsx("p", { children: "请先配置来源，随后上传资料并预览字段。" })
      ] }),
      T && /* @__PURE__ */ s.jsxs("details", { className: "panel custom-source", open: Rt || void 0, children: [
        /* @__PURE__ */ s.jsx("summary", { children: "配置资料来源" }),
        /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源名称",
            /* @__PURE__ */ s.jsx("input", { value: Ye, onChange: (g) => b(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "命名空间",
            /* @__PURE__ */ s.jsx("input", { placeholder: "例如 mock-extra-csv", value: ge, onChange: (g) => xe(g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "类型",
            /* @__PURE__ */ s.jsx("select", { value: de, onChange: (g) => te(g.target.value), children: ["csv", "excel", "governance_export"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Hs[g] }, g)) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "项目",
            /* @__PURE__ */ s.jsx("select", { value: Ge, onChange: (g) => jt(g.target.value), children: o.filter((g) => g.can_run).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Oe || !Ye || !ge, onClick: () => void fe(async () => {
          await u("/sources", { method: "POST", body: JSON.stringify({ name: Ye, namespace: ge, kind: de, project_id: Ge, mapping_template: de === "governance_export" ? "governance-v1" : `${de}-v1` }) }), He((g) => g + 1), it("来源已创建。");
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "数据来源", value: I, onChange: (g) => {
                ae(g.target.value), Z(""), B(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                D.filter((g) => {
                  var Se;
                  return (Se = o.find((nt) => nt.id === g.project_id)) == null ? void 0 : Se.can_run;
                }).map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "输入文件",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "输入文件", value: ie, onChange: (g) => {
                Z(g.target.value), B(null);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "请选择" }),
                rt.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.asset_id, children: g.label }, g.asset_id))
              ] })
            ] })
          ] }),
          !Rt && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: W, onChange: (g) => we(g.target.checked) }),
            "模拟接入2条后中断，用于验证继续处理"
          ] }),
          Rt && be && /* @__PURE__ */ s.jsxs("section", { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "上传资料（最大5MB）",
              /* @__PURE__ */ s.jsx("input", { type: "file", disabled: Oe, accept: be.kind === "csv" ? ".csv" : be.kind === "excel" ? ".xlsx" : ".json", onChange: (g) => {
                var nt;
                const Se = (nt = g.target.files) == null ? void 0 : nt[0];
                g.target.value = "", Se && fe(async () => {
                  if (Se.size > 5e6) throw new Error("文件不能超过5MB");
                  const pt = new Uint8Array(await Se.arrayBuffer());
                  let x = "";
                  for (let ze = 0; ze < pt.length; ze += 8192) x += String.fromCharCode(...pt.subarray(ze, ze + 8192));
                  const Te = await u("/platform-inputs", { method: "POST", body: JSON.stringify({ project_id: be.project_id, kind: be.kind, name: Se.name, base64: btoa(x) }) });
                  Y((ze) => [...ze, Te]), Z(Te.asset_id), B(null), it("文件已上传，请预览字段与异常后提交接入。");
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
          /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: Oe || !I || !ie, onClick: () => void fe(async () => {
            B(await u("/imports/preview", { method: "POST", body: JSON.stringify({ source_id: I, input_asset_id: ie }) }));
          }), children: [
            /* @__PURE__ */ s.jsx(Nu, { size: 16 }),
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
          /* @__PURE__ */ s.jsx("div", { className: "mapping-grid", children: Object.entries(m.mapping).map(([g, Se]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("code", { children: Se }),
            /* @__PURE__ */ s.jsx(Ml, { size: 13 }),
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
              /* @__PURE__ */ s.jsx("td", { children: Su(g.effective_fields.description) }),
              /* @__PURE__ */ s.jsx("td", { children: Hs[String(g.effective_fields.record_kind)] || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: [...g.errors, ...g.issues].join("；") || "通过" })
            ] }, g.row_number)) })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "submit-bar", children: [
            /* @__PURE__ */ s.jsx("span", { children: "坏值保留；不符合项目范围的行会被拒绝。" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Oe, onClick: () => void fe(async () => {
              const g = await u("/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ source_id: I, input_asset_id: ie, input_hash: m.input_hash, fail_after: !Rt && W ? 2 : null }) });
              _("/imports/" + g.id);
            }), children: [
              /* @__PURE__ */ s.jsx(sm, { size: 16 }),
              Oe ? "正在提交…" : "提交接入"
            ] })
          ] })
        ] })
      ] })
    ] }) : h === "/imports" ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "历史项目" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !T, onClick: () => _("/imports/new"), children: [
          "新建历史项目",
          /* @__PURE__ */ s.jsx(Ml, { size: 15 })
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
            /* @__PURE__ */ s.jsx("small", { children: Yf(g.created_at) })
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: qn[g.status] }),
          ["created", "updated", "skipped", "failed"].map((Se) => /* @__PURE__ */ s.jsx("td", { children: g.counts[Se] }, Se)),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/imports/" + g.id), children: "查看历史项目" }) })
        ] }, g.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "还没有历史项目" }),
        /* @__PURE__ */ s.jsx("p", { children: "先配置来源，再选择模拟文件进行预览和接入。" })
      ] }),
      kt
    ] }) : ce && y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/imports"), children: [
        /* @__PURE__ */ s.jsx(Df, { size: 15 }),
        "返回历史项目"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel batch-header", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: qn[y.status] }),
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
        y.job_status === "failed" && ((Nt = o.find((g) => g.id === y.source.project_id)) == null ? void 0 : Nt.can_run) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Oe, onClick: () => void fe(async () => {
          await u(`/jobs/${y.job_id}/retry`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: y.row_version }) }), He((g) => g + 1);
        }), children: [
          /* @__PURE__ */ s.jsx(Js, { size: 16 }),
          "继续未完成行"
        ] })
      ] }),
      y.error && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: y.error }),
      /* @__PURE__ */ s.jsx("section", { className: "metrics ingest-metrics", children: ["created", "updated", "skipped", "failed"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
        /* @__PURE__ */ s.jsx("span", { children: g === "failed" ? "失败行" : qn[g] }),
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
          /* @__PURE__ */ s.jsx("strong", { children: Object.entries(y.counts.kinds || {}).map(([g, Se]) => `${Hs[g]} ${Se}`).join(" / ") || "尚未处理" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "行处理明细" }),
          /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ft, onChange: (g) => {
              L(g.target.checked), lt(0);
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
            /* @__PURE__ */ s.jsx("td", { children: g.outcome === "failed" ? "失败" : qn[g.outcome] }),
            /* @__PURE__ */ s.jsx("td", { children: g.issues.join("；") || "通过" }),
            /* @__PURE__ */ s.jsx("td", { children: g.record_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.record_id), children: "查看证据" }) })
          ] }, g.row_number)) })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !Ue, onClick: () => lt(0), children: "返回首段" }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !y.next_row, onClick: () => lt(y.next_row || 0), children: "下一段" })
        ] })
      ] })
    ] }) : h === "/records" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "metrics ingest-metrics", children: [
        ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            Hs[g],
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "项目筛选", value: Ie.project_id, onChange: (g) => Yt("project_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部项目" }),
              o.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "来源",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "来源筛选", value: Ie.source_id, onChange: (g) => Yt("source_id", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部来源" }),
              D.map((g) => /* @__PURE__ */ s.jsx("option", { value: g.id, children: g.name }, g.id))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "记录类型",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "记录类型筛选", value: Ie.record_kind, onChange: (g) => Yt("record_kind", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
              ["detail", "review", "summary"].map((g) => /* @__PURE__ */ s.jsx("option", { value: g, children: Hs[g] }, g))
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "质量状态",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量状态筛选", value: Ie.quality_status, onChange: (g) => Yt("quality_status", g.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
              /* @__PURE__ */ s.jsx("option", { value: "needs_review", children: "需核查" }),
              /* @__PURE__ */ s.jsx("option", { value: "valid", children: "通过" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开始日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ie.from_date, onChange: (g) => Yt("from_date", g.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "结束日期",
            /* @__PURE__ */ s.jsx("input", { type: "date", value: Ie.to_date, onChange: (g) => Yt("to_date", g.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "view-switch", "aria-label": "风险数据展示方式", children: [
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "reports", onClick: () => {
            me("reports"), ve(""), w([]), Ee("");
          }, children: "报告清单" }),
          /* @__PURE__ */ s.jsx("button", { "aria-pressed": se === "rows", onClick: () => {
            me("rows"), ve(""), w([]);
          }, children: "逐条数据" })
        ] }),
        se === "reports" ? /* @__PURE__ */ s.jsx("div", { className: "reports-list", children: K.length ? K.map((g) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("button", { className: "report-toggle", "aria-expanded": _e === g.id, onClick: () => void N(g.id), children: [
            /* @__PURE__ */ s.jsx(Nu, { size: 20 }),
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
            /* @__PURE__ */ s.jsx(Ml, { size: 16 })
          ] }),
          _e === g.id && /* @__PURE__ */ s.jsxs("div", { className: "report-records", children: [
            H && /* @__PURE__ */ s.jsx("p", { role: "alert", children: H }),
            Re ? /* @__PURE__ */ s.jsx("p", { children: "正在读取报告内风险数据…" }) : he.map((Se) => /* @__PURE__ */ s.jsxs("div", { className: "report-record", children: [
              /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + Se.id), children: Se.description || "缺少描述" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                Hs[Se.record_kind],
                " · v",
                Se.current_version
              ] })
            ] }, Se.id)),
            ue && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Re, onClick: () => void N(g.id, !0), children: "加载更多风险数据" })
          ] })
        ] }, g.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "没有符合条件的报告" }),
          /* @__PURE__ */ s.jsx("p", { children: "可切换筛选条件或先接入资料来源。" })
        ] }) }) : Qe.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "记录内容 / 来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
            /* @__PURE__ */ s.jsx("th", { children: "质量状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Qe.map((g) => {
            var Se;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + g.id), children: g.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: (Se = D.find((nt) => nt.id === g.source_id)) == null ? void 0 : Se.name })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: Hs[g.record_kind] }),
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
    ] }) : j && le ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("button", { className: "text-button back", onClick: () => _("/records"), children: [
        /* @__PURE__ */ s.jsx(Df, { size: 15 }),
        "返回风险数据"
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel record-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
            Hs[le.record_kind],
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
          /* @__PURE__ */ s.jsx("select", { "aria-label": "查看版本", value: le.selected_version, onChange: (g) => Ne(g.target.value), children: le.versions.map((g) => /* @__PURE__ */ s.jsxs("option", { value: g.version, children: [
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
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Gf(le.raw_fields).map(([g, Se]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: Su(Se) })
          ] }, g)) })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "生效值与治理来源" }),
            /* @__PURE__ */ s.jsx("span", { children: "优先保留旧系统人工修订结果" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "field-list", children: Gf(le.effective_fields).map(([g, Se]) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("dt", { children: g }),
            /* @__PURE__ */ s.jsx("dd", { children: Su(Se) })
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
          var Se;
          return /* @__PURE__ */ s.jsxs("article", { className: "evidence-card", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Hs[g.type] }),
              /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: g.relation_confidence === "anchored" ? "来源锚定" : "候选关联" })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(g.locator) }),
            g.type !== "source_row" && g.asset_id ? /* @__PURE__ */ s.jsx(Cv, { asset: g.asset_id, identity: z }) : g.type === "source_row" ? /* @__PURE__ */ s.jsx("p", { children: "原始行定位已保留，可与上方原文核对。" }) : /* @__PURE__ */ s.jsx("div", { className: "missing-evidence", children: "附件缺失或不可用，无法预览" }),
            g.asset_id && ((Se = o.find((nt) => nt.id === le.project_id)) == null ? void 0 : Se.can_run) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: Oe, onClick: () => void qt(g.asset_id), children: "下载对应来源文件" })
          ] }, g.id);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel links-section", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "跨来源重复候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "仅同项目同类型生成候选，不自动删除原记录" })
        ] }),
        le.links.length ? le.links.map((g) => {
          var Se;
          return /* @__PURE__ */ s.jsxs("div", { className: "link-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: qn[g.review_state] }),
              /* @__PURE__ */ s.jsx("small", { children: "比较方法：同项目同类型的描述匹配；决策绑定具体版本" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/records/" + g.other_record_id), children: "打开另一条记录" }),
            ((Se = o.find((nt) => nt.id === le.project_id)) == null ? void 0 : Se.roles.some((nt) => ["admin", "reviewer"].includes(nt))) && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Oe || g.review_state === "stale", onClick: () => void fe(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "confirmed" }) }), He((nt) => nt + 1);
              }), children: "确认重复" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Oe || g.review_state === "stale", onClick: () => void fe(async () => {
                await u(`/record-links/${g.id}/confirm`, { method: "POST", body: JSON.stringify({ row_version: g.row_version, decision: "rejected" }) }), He((nt) => nt + 1);
              }), children: "排除" })
            ] })
          ] }, g.id);
        }) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无候选。可再接入Excel或治理导出，验证跨来源比较。" })
      ] })
    ] }) : re ? null : /* @__PURE__ */ s.jsx("div", { className: "empty", children: "请选择来源、批次或记录。" })
  ] });
}
const Vs = "/history-review", Xn = "/history-reader", lm = "historyReview.visibleColumnsV2", am = "historyReview.columnOrder", nc = "historyReview.columnWidths", nm = "historyReview.pageSize", im = [20, 30, 50, 100, 200], cm = ["engineering_project_name", "inspection_date", "problem_description", "source_category", "rectification_requirement", "reported_response"], Hn = ["_photos", "_source", "_status", "_actions"], wu = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "problem_description", "source_category", "source_grade", "hazard_category", "basis_or_clause", "rectification_requirement", "rectification_advice", "rectification_deadline", "reported_response", "reinspection_conclusion"], Mu = { _actions: "操作", _photos: "照片", _source: "来源报告", _status: "状态" }, ic = Object.keys(Mu), rm = [...cm, "_photos", "_source", "_status", "_actions"], uc = [...cm, "_photos", "_source", "_actions"], Ov = {
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
    const u = localStorage.getItem(lm), h = u ? JSON.parse(u) : null;
    return Array.isArray(h) && h.length ? h.filter((_) => typeof _ == "string") : uc;
  } catch {
    return uc;
  }
}
function Av() {
  try {
    const u = Number(localStorage.getItem(nm));
    return im.includes(u) ? u : 30;
  } catch {
    return 30;
  }
}
function Rv() {
  try {
    const u = localStorage.getItem(nc), h = u ? JSON.parse(u) : null;
    if (h && typeof h == "object") {
      const _ = {};
      for (const [o, z] of Object.entries(h))
        typeof z == "number" && z >= 56 && z <= 1e3 && (_[o] = z);
      return _;
    }
  } catch {
  }
  return {};
}
function Dv() {
  try {
    const u = localStorage.getItem(am), h = u ? JSON.parse(u) : null;
    if (Array.isArray(h) && h.length) return h.filter((_) => typeof _ == "string");
  } catch {
  }
  return rm;
}
function Uv(u, h) {
  const _ = u.filter((z) => h.includes(z) || ic.includes(z));
  let o = _.findIndex((z) => ic.includes(z));
  o < 0 && (o = _.length);
  for (const z of h)
    _.includes(z) || (_.splice(o, 0, z), o += 1);
  for (const z of ic) {
    if (_.includes(z)) continue;
    const D = _.indexOf("_actions");
    D >= 0 ? _.splice(D, 0, z) : _.push(z);
  }
  return _;
}
function Qt(u, h = 120) {
  const _ = (u || "").replace(/\s+/g, " ").trim();
  return _.length > h ? _.slice(0, h) + "…" : _ || "—";
}
function ta(u, h) {
  var _;
  return Mu[h] || ((_ = u.find((o) => o.key === h)) == null ? void 0 : _.label) || h;
}
function Xf(u, h) {
  return u ? Object.entries(u).map(([_, o]) => `${ta(h, _)}：${Qt(o, 30)}`).join("；") : "—";
}
function Tu({ id: u }) {
  const [h, _] = r.useState(""), [o, z] = r.useState("");
  return r.useEffect(() => {
    let D = !1, V = "";
    return Zt("/api/v1" + Xn + "/images/" + encodeURIComponent(u)).then(async (R) => {
      if (!R.ok) throw Error("图片暂不可用");
      return R.blob();
    }).then((R) => {
      V = URL.createObjectURL(R), D ? URL.revokeObjectURL(V) : _(V);
    }).catch((R) => {
      D || z(R.message);
    }), () => {
      D = !0, V && URL.revokeObjectURL(V);
    };
  }, [u]), o ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: o }) : h ? /* @__PURE__ */ s.jsx("a", { href: h, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ s.jsx("img", { src: h, alt: "原报告关联图片，点击查看大图" }) }) : /* @__PURE__ */ s.jsx("p", { children: "读取图片…" });
}
function Qf({ api: u, findingId: h, large: _ = !1 }) {
  const [o, z] = r.useState(null), [D, V] = r.useState("");
  return r.useEffect(() => {
    let R = !1;
    return z(null), V(""), u(Xn + "/findings/" + encodeURIComponent(h)).then((Y) => {
      R || z(Y.images);
    }).catch((Y) => {
      R || (V(Y.message), z([]));
    }), () => {
      R = !0;
    };
  }, [u, h]), D ? /* @__PURE__ */ s.jsx("p", { role: "alert", children: D }) : o ? o.length ? /* @__PURE__ */ s.jsx("div", { className: _ ? "history-images history-images-large" : "history-images", children: o.map((R, Y) => /* @__PURE__ */ s.jsxs("figure", { children: [
    /* @__PURE__ */ s.jsx(Tu, { id: R.id }),
    /* @__PURE__ */ s.jsxs("figcaption", { children: [
      Qt(R.relation, 24),
      "｜",
      JSON.stringify(R.locator)
    ] })
  ] }, R.id + ":" + Y)) }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "该条目没有已关联的照片（无照片不代表原报告没有照片）。" }) : /* @__PURE__ */ s.jsx("p", { className: "muted", children: "读取关联照片…" });
}
function Mv({ api: u }) {
  const [h, _] = r.useState(null), [o, z] = r.useState([]), [D, V] = r.useState("findings"), [R, Y] = r.useState([]), [v, M] = r.useState([]), [K, k] = r.useState([]), [se, me] = r.useState([]), [ye, _e] = r.useState(zv), [Ee, he] = r.useState(Dv), [F, ue] = r.useState(Rv), [ne, H] = r.useState(""), je = r.useRef(!1), [Re, Be] = r.useState(""), [Qe, Le] = r.useState(""), [pe, We] = r.useState(!1), [X, oe] = r.useState(""), [y, Q] = r.useState(""), [le, Ce] = r.useState([]), [m, B] = r.useState(""), [I, ae] = r.useState(""), [ie, Z] = r.useState(""), [W, we] = r.useState(0), [re, Ae] = r.useState(!1), [et, it] = r.useState(Av), [Fe, Ke] = r.useState(!1), [Oe, De] = r.useState([]), [ke, He] = r.useState(/* @__PURE__ */ new Set()), [Ie, st] = r.useState(!1), [at, ve] = r.useState(null), [ct, qe] = r.useState({}), [C, w] = r.useState(null), [P, Ne] = r.useState(""), [Ue, lt] = r.useState(null), [ft, L] = r.useState(""), [de, te] = r.useState(""), [Ye, b] = r.useState(!0), [ge, xe] = r.useState(!1), [Ge, jt] = r.useState(0), T = (h == null ? void 0 : h.editable_fields) || (h == null ? void 0 : h.fields) || [], j = (h == null ? void 0 : h.fields) || T, ce = r.useMemo(() => Ee.filter((f) => ye.includes(f)), [Ee, ye]), be = T.length + Hn.length, rt = ye.filter((f) => T.some((G) => G.key === f) || Hn.includes(f)).length, N = (f) => F[f] || Ov[f] || 140, fe = ce.reduce((f, G) => f + N(G), 0) || 1, Ze = (f) => `${(N(f) / fe * 100).toFixed(4)}%`;
  r.useEffect(() => {
    if ((!C || at) && !Ue) return;
    const f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const G = (Ve) => {
      Ve.key === "Escape" && (w(null), lt(null));
    };
    return window.addEventListener("keydown", G), () => {
      document.body.style.overflow = f, window.removeEventListener("keydown", G);
    };
  }, [C, at, Ue]), r.useEffect(() => {
    let f = !1;
    return b(!0), te(""), Promise.all([
      u(Vs + "/summary"),
      u(Vs + "/projects?limit=800"),
      u(Vs + "/projects?field=project_name&limit=800"),
      u(Vs + "/drafts?limit=100")
    ]).then(([G, Ve, Ht, gt]) => {
      f || (_(G), z(Ve.items), Ce(Ht.items), k(gt.items), _e((is) => {
        const Ss = /* @__PURE__ */ new Set([...G.editable_fields.map(($t) => $t.key), ...Hn]), os = is.filter(($t) => Ss.has($t));
        return os.length ? os : uc.filter(($t) => Ss.has($t));
      }), he((is) => Uv(is, G.editable_fields.map((Ss) => Ss.key))));
    }).catch((G) => {
      f || te(G.message);
    }).finally(() => {
      f || b(!1);
    }), () => {
      f = !0;
    };
  }, [u, Ge]), r.useEffect(() => {
    if (D !== "findings") return;
    let f = !1;
    return b(!0), te(""), u(Vs + "/findings?" + new URLSearchParams({
      q: ie,
      project: X,
      document_id: m,
      offset: String(W),
      limit: String(et)
    })).then((G) => {
      f || (Y(Fe ? G.items.filter((Ve) => Ve.draft_id) : G.items), Ae(G.has_more));
    }).catch((G) => {
      f || te(G.message);
    }).finally(() => {
      f || b(!1);
    }), () => {
      f = !0;
    };
  }, [u, D, ie, X, m, W, Fe, et, Ge]), r.useEffect(() => {
    if (D !== "reports") return;
    let f = !1;
    return b(!0), te(""), u(Vs + "/reports?" + new URLSearchParams({ q: ie, project: X, project_name: y, offset: "0", limit: "100" })).then((G) => {
      f || (M(G.items), Ae(!1));
    }).catch((G) => {
      f || te(G.message);
    }).finally(() => {
      f || b(!1);
    }), () => {
      f = !0;
    };
  }, [u, D, ie, X, y, Ge]), r.useEffect(() => {
    if (D !== "logs") return;
    let f = !1;
    return b(!0), te(""), u(Vs + "/logs?limit=100").then((G) => {
      f || me(G.items);
    }).catch((G) => {
      f || te(G.message);
    }).finally(() => {
      f || b(!1);
    }), () => {
      f = !0;
    };
  }, [u, D, Ge]), r.useEffect(() => {
    Ie && He(new Set(R.map((f) => f.id)));
  }, [R, Ie]);
  function kt(f) {
    _e(f);
    try {
      localStorage.setItem(lm, JSON.stringify(f));
    } catch {
    }
  }
  function Yt(f) {
    kt(ye.filter((G) => G !== f));
  }
  function qt(f, G) {
    const Ve = G ? [...ye, f] : ye.filter((Ht) => Ht !== f);
    kt(Ve);
  }
  function ut(f) {
    he(f);
    try {
      localStorage.setItem(am, JSON.stringify(f));
    } catch {
    }
  }
  function Nt(f, G) {
    if (f.preventDefault(), f.stopPropagation(), f.pointerType === "mouse" && f.button !== 0) return;
    const Ve = f.clientX, Ht = f.currentTarget.closest("table"), gt = {};
    let is = 0;
    if (Ht) {
      is = Ht.getBoundingClientRect().width;
      for (const cs of Array.from(Ht.querySelectorAll("thead th[data-col]"))) {
        const Ws = cs.dataset.col;
        Ws && (gt[Ws] = cs.getBoundingClientRect().width);
      }
    }
    const Ss = gt[G] || N(G), os = Object.keys(gt).filter((cs) => cs !== G), $t = os.reduce((cs, Ws) => cs + gt[Ws], 0) || 1, Ls = os.length * 56, $s = Math.max(120, is - Ls);
    je.current = !0, H(G), Be(""), Le(""), document.body.classList.add("history-resizing"), ue(gt);
    const ws = (cs) => {
      const Ws = Math.round(Math.max(56, Math.min($s, Ss + cs.clientX - Ve))), Qn = Math.max(56, is - Ws), ds = Math.min(3, Math.max(0.08, Qn / $t)), sa = { ...gt };
      for (const Zn of os) sa[Zn] = gt[Zn] * ds;
      sa[G] = Ws, ue(sa);
    }, Ds = () => {
      window.removeEventListener("pointermove", ws), window.removeEventListener("pointerup", Ds), window.removeEventListener("pointercancel", Ds), je.current = !1, H(""), document.body.classList.remove("history-resizing"), ue((cs) => {
        try {
          localStorage.setItem(nc, JSON.stringify(cs));
        } catch {
        }
        return cs;
      });
    };
    window.addEventListener("pointermove", ws), window.addEventListener("pointerup", Ds), window.addEventListener("pointercancel", Ds);
  }
  function g(f) {
    ue((G) => {
      if (!(f in G)) return G;
      const Ve = { ...G };
      delete Ve[f];
      try {
        localStorage.setItem(nc, JSON.stringify(Ve));
      } catch {
      }
      return Ve;
    });
  }
  function Se() {
    ue({});
    try {
      localStorage.removeItem(nc);
    } catch {
    }
  }
  function nt(f, G) {
    if (!f || !G || f === G) return;
    const Ve = Ee.filter((gt) => gt !== f), Ht = Ve.indexOf(G);
    Ve.splice(Ht < 0 ? Ve.length : Ht, 0, f), ut(Ve);
  }
  function pt(f) {
    He((G) => {
      const Ve = new Set(G);
      return Ve.has(f) ? Ve.delete(f) : Ve.add(f), Ve;
    });
  }
  function x() {
    Ie ? (st(!1), He(/* @__PURE__ */ new Set())) : (st(!0), He(new Set(R.map((f) => f.id))));
  }
  function Te(f) {
    ve(f);
    const G = {};
    for (const Ve of wu) G[Ve] = f[Ve] || "";
    qe(G), L(""), w(null), Ne("");
  }
  async function ze() {
    if (!at) return;
    const f = {};
    for (const G of wu) {
      const Ve = at[G] || "";
      ct[G] !== Ve && (f[G] = ct[G] || null);
    }
    if (!Object.keys(f).length) {
      L("没有修改任何字段。");
      return;
    }
    xe(!0), te("");
    try {
      await u(Vs + "/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ finding_id: at.id, changes: f }) }), L(`已保存草稿（${Object.keys(f).map((G) => ta(T, G)).join("、")}），批量确认后覆盖数据库。`), ve(null), jt((G) => G + 1);
    } catch (G) {
      te(G.message);
    } finally {
      xe(!1);
    }
  }
  async function tt(f) {
    if (!f.length) {
      L("请先勾选要确认的修改。");
      return;
    }
    if (window.confirm(`确认将 ${f.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) {
      xe(!0), te(""), L("");
      try {
        const G = await u(Vs + "/drafts/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) });
        L(`已确认写入 ${G.applied.length} 条${G.conflicts.length ? `；${G.conflicts.length} 条存在值冲突` : ""}。`), De([]), jt((Ve) => Ve + 1);
      } catch (G) {
        te(G.message);
      } finally {
        xe(!1);
      }
    }
  }
  async function Vt(f) {
    if (f.length) {
      xe(!0), te("");
      try {
        await u(Vs + "/drafts/discard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: f }) }), De([]), jt((G) => G + 1);
      } catch (G) {
        te(G.message);
      } finally {
        xe(!1);
      }
    }
  }
  async function Ns(f) {
    w(null), Ne("");
    try {
      const G = await u(Xn + "/findings/" + encodeURIComponent(f.id));
      w(G);
    } catch (G) {
      Ne(G.message);
    }
  }
  function us(f) {
    const G = Rt ? "/quality/b" : "";
    window.open(G + "/api/v1" + Xn + "/documents/" + encodeURIComponent(f) + "/view", "_blank", "noopener");
  }
  async function At(f) {
    if (C)
      try {
        const G = f || C, Ve = await Zt("/api/v1" + Xn + "/documents/" + encodeURIComponent(G.document_id) + "/original");
        if (!Ve.ok) throw Error("原件暂不可用，请稍后重试。");
        const Ht = URL.createObjectURL(await Ve.blob()), gt = document.createElement("a");
        gt.href = Ht, gt.download = G.original_name, gt.click(), setTimeout(() => URL.revokeObjectURL(Ht), 1e3);
      } catch (G) {
        Ne(G.message);
      }
  }
  const fl = r.useMemo(() => v, [v]), Ks = r.useMemo(() => K.map((f) => f.id), [K]);
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
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ye, onClick: () => jt((f) => f + 1), children: "刷新数据" })
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
      de && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
        de,
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => jt((f) => f + 1), children: "重试" })
      ] }),
      ft && /* @__PURE__ */ s.jsx("p", { role: "status", className: "history-message", children: ft }),
      /* @__PURE__ */ s.jsx("nav", { "aria-label": "历史报告视图", className: "history-tabs", children: [["findings", "问题条目"], ["reports", "历史报告"], ["logs", "修改日志"]].map(([f, G]) => /* @__PURE__ */ s.jsx("button", { className: D === f ? "button primary" : "button ghost", onClick: () => {
        V(f), we(0);
      }, children: G }, f)) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel history-toolbar-panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-toolbar", children: [
        /* @__PURE__ */ s.jsxs("form", { className: "history-search", onSubmit: (f) => {
          f.preventDefault(), Z(I.trim()), we(0);
        }, children: [
          /* @__PURE__ */ s.jsx("input", { id: "history-query", "aria-label": "搜索", value: I, onChange: (f) => ae(f.target.value), maxLength: 100, placeholder: D === "reports" ? "报告名称或项目" : "问题描述、项目或报告" }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ye, children: "搜索" })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          D === "reports" ? "工程项目" : "项目筛选",
          /* @__PURE__ */ s.jsxs("select", { value: X, onChange: (f) => {
            oe(f.target.value), we(0);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: D === "reports" ? "全部工程项目" : `全部项目（${(h == null ? void 0 : h.projects) ?? "—"}）` }),
            o.map((f) => /* @__PURE__ */ s.jsxs("option", { value: f.name, children: [
              f.name,
              "（",
              f.findings,
              "）"
            ] }, f.name))
          ] })
        ] }),
        D === "reports" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          "项目名称",
          /* @__PURE__ */ s.jsxs("select", { value: y, onChange: (f) => Q(f.target.value), children: [
            /* @__PURE__ */ s.jsxs("option", { value: "", children: [
              "全部项目名称（",
              le.length,
              "）"
            ] }),
            le.map((f) => /* @__PURE__ */ s.jsxs("option", { value: f.name, children: [
              f.name,
              "（",
              f.findings,
              "）"
            ] }, f.name))
          ] })
        ] }),
        m && /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          B(""), we(0);
        }, children: "清除报告筛选" }),
        D === "findings" && /* @__PURE__ */ s.jsxs("label", { className: "history-inline", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Fe, onChange: (f) => Ke(f.target.checked) }),
          "只看待确认修改"
        ] }),
        D === "findings" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => We((f) => !f), children: h ? `显示字段（${rt}/${be}）` : "显示字段" }),
        D === "findings" && /* @__PURE__ */ s.jsx("button", { className: Ie ? "button primary" : "button secondary", onClick: x, children: Ie ? "收起全部字段" : "展开全部字段" })
      ] }),
      pe && D === "findings" && /* @__PURE__ */ s.jsxs("div", { className: "history-fieldpicker", role: "group", "aria-label": "选择显示字段", children: [
        T.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(f.key), onChange: (G) => qt(f.key, G.target.checked) }),
          f.label
        ] }, f.key)),
        /* @__PURE__ */ s.jsx("span", { className: "history-fieldsep", children: "其他列" }),
        Hn.map((f) => /* @__PURE__ */ s.jsxs("label", { children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ye.includes(f), onChange: (G) => qt(f, G.target.checked) }),
          Mu[f]
        ] }, f)),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => kt(uc.filter((f) => T.some((G) => G.key === f) || Hn.includes(f))), children: "恢复默认" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ut(rm), children: "恢复列顺序" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: Se, children: "恢复列宽" })
      ] }),
      D === "findings" && /* @__PURE__ */ s.jsx("p", { className: "muted history-drag-tip", children: "提示：拖动表头调整列顺序；点击表头右侧 × 可隐藏该列（全部列均可隐藏，在“显示字段”中恢复）；点击任意行展开该条全部字段与关联照片。" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      D === "findings" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        K.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "history-drafts", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "history-drafts-head", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "待确认修改（",
              K.length,
              "）"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: ge, onClick: () => De(Oe.length === Ks.length ? [] : Ks), children: Oe.length === Ks.length ? "全不选" : "全选" }),
              /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: ge || !Oe.length, onClick: () => void tt(Oe), children: [
                "批量确认所选（",
                Oe.length,
                "）"
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: ge || !Oe.length, onClick: () => void Vt(Oe), children: "放弃所选" })
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
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Oe.includes(f.id), onChange: (G) => De(G.target.checked ? [...Oe, f.id] : Oe.filter((Ve) => Ve !== f.id)) }) }),
              /* @__PURE__ */ s.jsx("td", { children: Qt(f.original_name, 24) }),
              /* @__PURE__ */ s.jsx("td", { className: "history-description", children: Qt(f.current_problem_description, 100) }),
              /* @__PURE__ */ s.jsx("td", { children: Xf(f.changes, T) }),
              /* @__PURE__ */ s.jsx("td", { children: f.updated_at ? new Date(f.updated_at).toLocaleString("zh-CN") : "—" })
            ] }, f.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "table-wrap history-table-wrap" + (ne ? " history-resizing" : ""), "aria-busy": Ye, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", style: { width: "100%" }, children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsx("tr", { children: ce.map((f) => /* @__PURE__ */ s.jsx(
            "th",
            {
              draggable: !0,
              "data-col": f,
              style: { width: Ze(f) },
              className: "history-col-head" + (Re === f ? " history-col-dragging" : "") + (Qe === f ? " history-col-dragover" : ""),
              title: "拖动调整列顺序",
              onDragStart: (G) => {
                if (je.current) {
                  G.preventDefault();
                  return;
                }
                Be(f), G.dataTransfer.effectAllowed = "move", G.dataTransfer.setData("text/plain", f);
              },
              onDragOver: (G) => {
                G.preventDefault(), G.dataTransfer.dropEffect = "move", Qe !== f && Le(f);
              },
              onDragLeave: () => Le(""),
              onDrop: (G) => {
                G.preventDefault(), nt(Re || G.dataTransfer.getData("text/plain"), f), Be(""), Le("");
              },
              onDragEnd: () => {
                Be(""), Le("");
              },
              children: /* @__PURE__ */ s.jsxs("span", { className: "history-th", children: [
                /* @__PURE__ */ s.jsx("span", { className: "history-th-label", children: ta(T, f) }),
                /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-col-hide", title: "点击隐藏该列（可在“显示字段”中恢复）", "aria-label": `隐藏${ta(T, f)}列`, draggable: !1, onMouseDown: (G) => G.stopPropagation(), onDragStart: (G) => G.preventDefault(), onClick: (G) => {
                  G.stopPropagation(), Yt(f);
                }, children: "×" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-drag-mark", "aria-hidden": "true", children: "⋮⋮" }),
                /* @__PURE__ */ s.jsx("span", { className: "history-col-resize", role: "separator", "aria-orientation": "vertical", "aria-label": "拖动调节列宽（双击恢复该列默认宽度）", title: "拖动调节列宽；双击恢复该列默认宽度", onPointerDown: (G) => Nt(G, f), onDoubleClick: (G) => {
                  G.preventDefault(), G.stopPropagation(), g(f);
                }, onDragStart: (G) => G.preventDefault() })
              ] })
            },
            f
          )) }) }),
          /* @__PURE__ */ s.jsxs("tbody", { children: [
            R.map((f) => {
              const G = ke.has(f.id);
              return /* @__PURE__ */ s.jsxs(r.Fragment, { children: [
                /* @__PURE__ */ s.jsx("tr", { className: (f.draft_id ? "history-dirty" : "") + " history-row", onClick: (Ve) => {
                  Ve.target.closest("button, a, input, textarea, select, summary") || pt(f.id);
                }, children: (() => {
                  const Ve = [];
                  for (let Ht = 0; Ht < ce.length; Ht += 1) {
                    const gt = ce[Ht];
                    if (gt === "_actions") {
                      Ve.push(/* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
                        /* @__PURE__ */ s.jsx("button", { className: "button secondary icon-button", title: "编辑", "aria-label": "编辑", onClick: () => Te(f), children: /* @__PURE__ */ s.jsx(xv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: "查看证据", "aria-label": "查看证据", onClick: () => void Ns(f), children: /* @__PURE__ */ s.jsx(dv, { size: 15 }) }),
                        /* @__PURE__ */ s.jsx("button", { className: "button ghost icon-button", title: G ? "收起" : "展开", "aria-label": G ? "收起" : "展开", onClick: () => pt(f.id), children: G ? /* @__PURE__ */ s.jsx($j, { size: 15 }) : /* @__PURE__ */ s.jsx(Vj, { size: 15 }) })
                      ] }, gt));
                      continue;
                    }
                    if (gt === "_photos") {
                      Ve.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.image_count ? /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => lt(f), children: [
                        "查看 ",
                        f.image_count,
                        " 张"
                      ] }) : /* @__PURE__ */ s.jsx("span", { className: "muted", children: "—" }) }, gt));
                      continue;
                    }
                    if (gt === "_source") {
                      Ve.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.original_name || "", children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (Ls) => {
                        Ls.stopPropagation(), us(f.document_id);
                      }, children: Qt(f.original_name, 26) }) }, gt));
                      continue;
                    }
                    if (gt === "_status") {
                      Ve.push(/* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.draft_id ? /* @__PURE__ */ s.jsx("span", { className: "history-badge", children: "待确认" }) : Qt(f.review_state, 14) }, gt));
                      continue;
                    }
                    const is = f[gt];
                    if (!is || !String(is).trim()) {
                      let Ls = 1, $s = Ht + 1;
                      for (; $s < ce.length; ) {
                        const ws = ce[$s];
                        if (ic.includes(ws)) break;
                        const Ds = f[ws];
                        if (Ds && String(Ds).trim()) break;
                        Ls += 1, $s += 1;
                      }
                      Ve.push(/* @__PURE__ */ s.jsx("td", { colSpan: Ls, className: "history-cell history-cell-merged", title: "该行连续空字段合并显示", children: "—" }, gt)), Ht = $s - 1;
                      continue;
                    }
                    const os = gt === "problem_description", $t = ["project_name", "engineering_project_name", "inspection_date", "inspection_location", "source_category", "source_grade", "hazard_category"].includes(gt);
                    Ve.push(/* @__PURE__ */ s.jsx("td", { title: is || "", className: os ? "history-cell history-cell-wrap" : $t ? "history-cell history-cell-nowrap" : "history-cell", children: os ? is : Qt(is, 80) }, gt));
                  }
                  return Ve;
                })() }),
                G && /* @__PURE__ */ s.jsx("tr", { className: "history-expanded", children: /* @__PURE__ */ s.jsxs("td", { colSpan: ce.length, children: [
                  /* @__PURE__ */ s.jsx("dl", { className: "history-fields history-fields-all", children: T.map((Ve) => /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("dt", { children: Ve.label }),
                    /* @__PURE__ */ s.jsx("dd", { children: f[Ve.key] || "—" })
                  ] }, Ve.key)) }),
                  /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
                    "来源报告：",
                    /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: (Ve) => {
                      Ve.stopPropagation(), us(f.document_id);
                    }, children: Qt(f.original_name, 100) }),
                    "｜状态：",
                    Qt(f.review_state, 20),
                    f.draft_id ? "｜有待确认修改" : ""
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "history-expanded-photos", children: [
                    /* @__PURE__ */ s.jsxs("h4", { children: [
                      "关联照片（",
                      f.image_count ?? 0,
                      "）"
                    ] }),
                    /* @__PURE__ */ s.jsx(Qf, { api: u, findingId: f.id })
                  ] })
                ] }) })
              ] }, f.id);
            }),
            !R.length && !Ye && !de && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: ce.length, children: "没有匹配的问题条目。" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagesize", children: [
          "每页显示",
          /* @__PURE__ */ s.jsx("select", { "aria-label": "每页显示条数", value: et, onChange: (f) => {
            const G = Number(f.target.value);
            it(G), we(0);
            try {
              localStorage.setItem(nm, String(G));
            } catch {
            }
          }, children: im.map((f) => /* @__PURE__ */ s.jsx("option", { value: f, children: f }, f)) }),
          "条"
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "history-pagination", children: [
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: W === 0, onClick: () => we(Math.max(0, W - et)), children: "上一页" }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            "第 ",
            Math.floor(W / et) + 1,
            " 页 · 本页 ",
            R.length,
            " 条"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: !re, onClick: () => we(W + et), children: "下一页" })
        ] })
      ] }),
      D === "reports" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": Ye, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table history-reports-table", children: [
        /* @__PURE__ */ s.jsxs("colgroup", { children: [
          /* @__PURE__ */ s.jsx("col", { style: { width: "30%" } }),
          /* @__PURE__ */ s.jsx("col", { style: { width: "18%" } }),
          /* @__PURE__ */ s.jsx("col", { style: { width: "18%" } }),
          /* @__PURE__ */ s.jsx("col", { style: { width: "10%" } }),
          /* @__PURE__ */ s.jsx("col", { style: { width: "8%" } }),
          /* @__PURE__ */ s.jsx("col", { style: { width: "16%" } })
        ] }),
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "历史报告" }),
          /* @__PURE__ */ s.jsx("th", { children: "项目名称" }),
          /* @__PURE__ */ s.jsx("th", { children: "工程项目" }),
          /* @__PURE__ */ s.jsx("th", { children: "检查日期" }),
          /* @__PURE__ */ s.jsx("th", { children: "问题条目" }),
          /* @__PURE__ */ s.jsx("th", { children: "操作" })
        ] }) }),
        /* @__PURE__ */ s.jsxs("tbody", { children: [
          fl.map((f) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.original_name, children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "history-link", onClick: () => us(f.document_id), children: Qt(f.original_name, 80) }) }),
            /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.project_name || "", children: Qt(f.project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", title: f.engineering_project_name || "", children: Qt(f.engineering_project_name, 30) }),
            /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: Qt(f.inspection_date, 20) }),
            /* @__PURE__ */ s.jsx("td", { className: "history-cell history-cell-nowrap", children: f.findings }),
            /* @__PURE__ */ s.jsxs("td", { className: "history-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => {
                B(f.document_id), V("findings"), we(0);
              }, children: "查看问题" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => us(f.document_id), children: "浏览报告" })
            ] })
          ] }, f.document_id)),
          !fl.length && !Ye && !de && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 6, children: "没有匹配的历史报告。" }) })
        ] })
      ] }) }),
      D === "logs" && /* @__PURE__ */ s.jsx("div", { className: "table-wrap", "aria-busy": Ye, children: /* @__PURE__ */ s.jsxs("table", { className: "history-table", children: [
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
            /* @__PURE__ */ s.jsx("td", { children: Qt(f.original_name, 28) || Qt(f.document_id, 8) }),
            /* @__PURE__ */ s.jsx("td", { children: Xf(f.changes, T) }),
            /* @__PURE__ */ s.jsx("td", { children: Qt(f.actor, 30) })
          ] }, f.id)),
          !se.length && !Ye && !de && /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsx("td", { colSpan: 5, children: "暂无修改日志。" }) })
        ] })
      ] }) })
    ] }),
    at && /* @__PURE__ */ s.jsxs("section", { className: "panel history-editor", "aria-label": "编辑问题条目", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "编辑问题条目" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => {
          ve(null), w(null);
        }, children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
        "修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：",
        Qt(at.original_name, 80)
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-editor-grid", children: wu.map((f) => /* @__PURE__ */ s.jsxs("label", { className: f === "problem_description" ? "history-editor-wide" : "", children: [
        /* @__PURE__ */ s.jsx("span", { children: ta(T, f) }),
        /* @__PURE__ */ s.jsx("textarea", { rows: f === "problem_description" ? 3 : 2, value: ct[f] || "", onChange: (G) => qe({ ...ct, [f]: G.target.value }) })
      ] }, f)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: ge, onClick: () => void ze(), children: "保存草稿" }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => ve(null), children: "取消" })
      ] }),
      C && /* @__PURE__ */ s.jsxs("details", { className: "history-detail", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "查看原文证据与关联图片" }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(), children: "下载原报告" }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: j.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: C.fields[f.key] || "—" })
        ] }, f.key)) }),
        C.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            ta(T, f.field_key),
            "：",
            Qt(f.quote, 80)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        C.images.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "关联图片（",
            C.images.length,
            "）"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "history-images", children: C.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
            /* @__PURE__ */ s.jsx(Tu, { id: f.id }),
            /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
          ] }, f.id + ":" + G)) })
        ] })
      ] })
    ] }),
    C && !at && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "字段与来源证据", onClick: () => w(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "字段与来源证据" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: C.original_name }),
            "｜解析版本时间：",
            new Date(C.parsed_at).toLocaleString("zh-CN")
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => w(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-body", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(), children: "下载原报告" }),
        C.consolidation_id && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("p", { children: "同一隐患的重复出处已合并，以下字段与图片保留原报告来源。" }),
          /* @__PURE__ */ s.jsx("ul", { children: C.sources.map((f) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => void At(f), children: f.original_name }) }, f.document_id)) })
        ] }),
        P && /* @__PURE__ */ s.jsx("p", { role: "alert", className: "loginerror", children: P }),
        /* @__PURE__ */ s.jsx("dl", { className: "history-fields", children: j.map((f) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: f.label }),
          /* @__PURE__ */ s.jsx("dd", { children: C.fields[f.key] || "—" })
        ] }, f.key)) }),
        /* @__PURE__ */ s.jsx("h3", { children: "原文证据" }),
        C.evidence.map((f, G) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            ta(T, f.field_key),
            "：",
            Qt(f.quote, 100)
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "history-quote", children: f.quote }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源位置：",
            JSON.stringify(f.locator)
          ] })
        ] }, G)),
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "关联图片（",
          C.images.length,
          "）"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "muted", children: "展示已建立关联的图片；无图片不代表原报告没有照片。" }),
        /* @__PURE__ */ s.jsx("div", { className: "history-images", children: C.images.map((f, G) => /* @__PURE__ */ s.jsxs("figure", { children: [
          /* @__PURE__ */ s.jsx(Tu, { id: f.id }),
          /* @__PURE__ */ s.jsx("figcaption", { children: JSON.stringify(f.locator) })
        ] }, f.id + ":" + G)) })
      ] })
    ] }) }),
    Ue && /* @__PURE__ */ s.jsx("div", { className: "history-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "关联照片", onClick: () => lt(null), children: /* @__PURE__ */ s.jsxs("section", { className: "history-modal history-photo-modal", onClick: (f) => f.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("div", { className: "history-modal-head", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: "关联照片" }),
          /* @__PURE__ */ s.jsxs("p", { className: "muted", children: [
            "来源报告：",
            /* @__PURE__ */ s.jsx("strong", { children: Qt(Ue.original_name, 90) }),
            "｜问题：",
            Qt(Ue.problem_description, 90)
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => lt(null), children: "关闭" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "history-modal-body", children: /* @__PURE__ */ s.jsx(Qf, { api: u, findingId: Ue.id, large: !0 }) })
    ] }) })
  ] });
}
function Mt(u, h) {
  return u ? u.permissions != null ? u.permissions.includes(h) : ["knowledge.process", "retrospective.generate", "retrospective.edit", "imports.create", "imports.retry"].includes(h) ? !!u.can_run : ["knowledge.review", "knowledge.publish", "retrospective.review", "imports.withdraw"].includes(h) ? u.roles.some((_) => ["admin", "reviewer"].includes(_)) : h === "training.manage" ? u.roles.some((_) => ["admin", "teacher"].includes(_)) : h === "training.review" ? u.roles.some((_) => ["admin", "teacher", "reviewer"].includes(_)) : !0 : !1;
}
const hl = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", open: "待核查", resolved: "已处理", ignored: "暂不处理", submitted: "提交审核", edited: "人工修订", created: "新增", skipped: "复用已有", failed: "失败" }, Zf = { INVALID_DATE: "日期异常", INVALID_IMAGES: "图片字段异常", FALLBACK_ID: "来源身份待核查", MISSING_DESCRIPTION: "缺少描述", UNVERIFIED_STANDARD: "依据待核验" }, Vf = { case_card: "案例卡", checkpoint_card: "检查要点卡", retrospective_revision: "过程复盘", question_revision: "培训题目" };
function ku(u, h) {
  return [["标题", u.title, h.title], ["事实", u.facts.map((o) => o.text).join(`
`), h.facts.map((o) => o.text).join(`
`)], ["建议", u.suggestions.join(`
`), h.suggestions.join(`
`)], ["引用证据", u.facts.flatMap((o) => o.evidence_ids).join("、"), h.facts.flatMap((o) => o.evidence_ids).join("、")], ["标准依据", JSON.stringify(u.standards), JSON.stringify(h.standards)], ["施工要点", JSON.stringify(u.construction_points || []), JSON.stringify(h.construction_points || [])]].filter(([, o, z]) => o !== z);
}
function qv({ api: u, path: h, navigate: _, projects: o, identity: z }) {
  var T;
  const [D, V] = r.useState(!0), [R, Y] = r.useState(!1), [v, M] = r.useState(""), [K, k] = r.useState(""), [se, me] = r.useState(0), [ye, _e] = r.useState([]), [Ee, he] = r.useState([]), [F, ue] = r.useState([]), [ne, H] = r.useState("knowledge_revision"), [je, Re] = r.useState(""), [Be, Qe] = r.useState(""), [Le, pe] = r.useState(""), [We, X] = r.useState(null), [oe, y] = r.useState([]), [Q, le] = r.useState(null), [Ce, m] = r.useState("resolved"), [B, I] = r.useState(""), [ae, ie] = r.useState(""), [Z, W] = r.useState(((T = o.find((j) => Mt(j, "knowledge.process"))) == null ? void 0 : T.id) || ""), [we, re] = r.useState([]), [Ae, et] = r.useState([]), [it, Fe] = r.useState("case_card"), [Ke, Oe] = r.useState("normal"), [De, ke] = r.useState(null), [He, Ie] = r.useState(sessionStorage.getItem("b03-last-job-" + z) || ""), [st, at] = r.useState(null), [ve, ct] = r.useState(null), [qe, C] = r.useState(null), [w, P] = r.useState(""), [Ne, Ue] = r.useState(!1), lt = /^\/knowledge\/[^/]+\/edit$/.test(h), ft = o.some((j) => Mt(j, "knowledge.process")), L = o.some((j) => Mt(j, "knowledge.review")), de = h.startsWith("/quality"), te = h === "/reviews";
  r.useEffect(() => {
    pe(""), y([]), Qe(""), Re(""), M(""), k(""), Ue(!1), P("");
  }, [h]), r.useEffect(() => {
    let j = !1;
    V(!0), M(""), ct(null), C(null);
    async function ce() {
      try {
        if (de) {
          const be = await u(`/quality/issues?limit=20${je ? "&rule_code=" + je : ""}${Be ? "&status=" + Be : ""}${Le ? "&cursor=" + encodeURIComponent(Le) : ""}`);
          if (j) return;
          he(be.items), ue(be.summary), X(be.next_cursor);
        } else if (lt) {
          const be = await u(h.replace("/edit", ""));
          if (j) return;
          ct(be), C(structuredClone(be.content));
        } else if (te) {
          const be = await u(`/reviews?object_type=${ne}&state=${Be || "pending_review"}${Le ? "&cursor=" + encodeURIComponent(Le) : ""}`);
          if (j) return;
          _e(be.items), X(be.next_cursor);
        } else {
          const be = await u(`/knowledge?limit=20${Be ? "&state=" + Be : ""}${Le ? "&cursor=" + encodeURIComponent(Le) : ""}`);
          if (j) return;
          if (_e(be.items), X(be.next_cursor), ft && Z) {
            const rt = await u("/knowledge/source-options?project_id=" + Z);
            j || re(rt.items);
          }
        }
      } catch (be) {
        j || M(be.message);
      } finally {
        j || V(!1);
      }
    }
    return ce(), () => {
      j = !0;
    };
  }, [h, Be, je, Le, se, Z, ne]), r.useEffect(() => {
    et([]), ke(null);
  }, [Z, it, Ke]), r.useEffect(() => {
    if (!He || de || lt || te || !ft) return;
    let j = !1;
    const ce = () => {
      u("/knowledge/generation-jobs/" + He).then((rt) => {
        j || (at(rt), rt.status === "succeeded" && me((N) => N + 1));
      }).catch((rt) => {
        j || M(rt.message);
      });
    };
    ce();
    const be = setInterval(() => {
      (!st || ["queued", "running", "retrying"].includes(st.status)) && ce();
    }, 1800);
    return () => {
      j = !0, clearInterval(be);
    };
  }, [He, h, st == null ? void 0 : st.status]);
  const Ye = async (j) => {
    Y(!0), M(""), k("");
    try {
      await j();
    } catch (ce) {
      M(ce.message);
    } finally {
      Y(!1);
    }
  }, b = () => ({ record_version_ids: Ae, type: it, template_version: "mock-v1", mock_scenario: Ke }), ge = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅显示当前身份可访问范围" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !oe.length, onClick: () => {
        pe(oe.at(-1) || ""), y(oe.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !We, onClick: () => {
        y([...oe, Le]), pe(We || "");
      }, children: "下一页" })
    ] })
  ] }), xe = ve && Mt(o.find((j) => j.id === ve.project_id), "knowledge.process"), Ge = ve && Mt(o.find((j) => j.id === ve.project_id), "knowledge.review"), jt = (j) => Ye(async () => {
    if (!ve) return;
    const ce = j === "submit" ? `/knowledge/${ve.id}/submit-review` : `/reviews/${ve.revision_id}/${j}`;
    await u(ce, { method: "POST", body: JSON.stringify({ row_version: ve.row_version, revision_id: ve.revision_id, reason: w, evidence_checked: Ne }) }), k(j === "approve" ? "此版本已审核，请到发布管理构建并启用。" : "状态已更新，审核意见已保留。"), me((be) => be + 1), Ue(!1);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Yn, { size: 19 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "质量核查与知识加工" }),
        /* @__PURE__ */ s.jsx("span", { children: "已有字段自动带入。来源事实、人工补充、生成建议和待核验依据分别标记；审核通过后可到发布管理构建并启用。" })
      ] })
    ] }),
    v && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      v,
      /* @__PURE__ */ s.jsx("button", { onClick: () => me((j) => j + 1), children: "重新加载" })
    ] }),
    K && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      K
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/extraction"), children: "施工要点萃取" }),
        /* @__PURE__ */ s.jsx("button", { className: de ? "selected" : "", onClick: () => _("/quality"), children: "质量核查" }),
        /* @__PURE__ */ s.jsx("button", { className: !de && !te ? "selected" : "", onClick: () => _("/knowledge/drafts"), children: "知识候选" }),
        /* @__PURE__ */ s.jsx("button", { className: te ? "selected" : "", onClick: () => _("/reviews"), children: "审核待办" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: D, onClick: () => me((j) => j + 1), children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    D ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取工作区…" }) : de ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("section", { className: "quality-summary", children: Object.entries(Zf).map(([j, ce]) => /* @__PURE__ */ s.jsxs("button", { className: je === j ? "panel selected-quality" : "panel", "aria-pressed": je === j, onClick: () => {
        Re(je === j ? "" : j), Qe("open"), pe(""), y([]);
      }, children: [
        /* @__PURE__ */ s.jsx("span", { children: ce }),
        /* @__PURE__ */ s.jsx("strong", { children: F.filter((be) => be.rule_code === j && be.status === "open").reduce((be, rt) => be + rt.count, 0) }),
        /* @__PURE__ */ s.jsx("small", { children: "待核查" })
      ] }, j)) }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "质量问题" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "质量处理状态", value: Be, onChange: (j) => {
            Qe(j.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["open", "resolved", "ignored"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: hl[j] }, j))
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
            var ce, be;
            return /* @__PURE__ */ s.jsxs("tr", { children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => _("/records/" + j.record_id), children: j.description || "缺少描述" }),
                /* @__PURE__ */ s.jsx("small", { children: Zf[j.rule_code] || j.rule_code })
              ] }),
              /* @__PURE__ */ s.jsxs("td", { children: [
                j.message,
                j.annotations.length > 0 && /* @__PURE__ */ s.jsxs("small", { children: [
                  "最近说明：",
                  (ce = j.annotations.at(-1)) == null ? void 0 : ce.reason
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: hl[j.status] }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: !((be = o.find((rt) => rt.id === j.project_id)) != null && be.can_run), onClick: () => {
                le(j), I(""), ie("");
              }, children: "核查处理" }) })
            ] }, j.id);
          }) })
        ] }) }) : /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前范围没有对应质量问题" }) }),
        ge
      ] })
    ] }) : lt && ve && qe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            Vf[ve.type],
            " · v",
            ve.version
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            hl[ve.state],
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
              ve.source.versions.map((j) => /* @__PURE__ */ s.jsxs("details", { children: [
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
              qe.project_name,
              " · ",
              qe.occurred_on || "日期未知"
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "证据定位" }),
            ve.source.evidence.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "proof-row", children: [
              /* @__PURE__ */ s.jsx("strong", { children: { source_row: "来源原始行", site_photo: "现场照片类型", process_event: "过程事件记录", historical_row: "复盘历史来源行", task_snapshot: "固定任务快照", task_attachment: "复盘附件" }[j.type] || "来源证据" }),
              /* @__PURE__ */ s.jsx("p", { children: JSON.stringify(j.locator) }),
              /* @__PURE__ */ s.jsx("code", { children: j.id })
            ] }, j.id)),
            ve.source.annotations.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "人工补充（独立保存）" }),
              ve.source.annotations.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
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
              /* @__PURE__ */ s.jsx("input", { value: qe.title, disabled: !xe, onChange: (j) => C({ ...qe, title: j.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "来源事实 / 人工补充" }),
            qe.facts.map((j, ce) => /* @__PURE__ */ s.jsxs("label", { children: [
              j.source_kind === "human_annotation" ? "人工补充，需核查" : "来源生效值",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !xe, value: j.text, onChange: (be) => C({ ...qe, facts: qe.facts.map((rt, N) => N === ce ? { ...rt, text: be.target.value, source_kind: "human_annotation" } : rt) }) }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "引用：",
                j.evidence_ids.join("、")
              ] })
            ] }, ce)),
            qe.construction_points && qe.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "施工要点 · ",
                qe.category_name || "待分类"
              ] }),
              /* @__PURE__ */ s.jsx("p", { className: "small-note", children: qe.generation_mode === "llm" ? "云端模型自主归纳；来源事实与新增建议仍需核查。" : "本地模板演示，尚不能代表模型归纳效果。" }),
              qe.construction_points.map((j, ce) => {
                var be;
                return /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
                  /* @__PURE__ */ s.jsxs("strong", { children: [
                    j.title,
                    " · ",
                    j.stage === "preparation" ? "施工准备" : j.stage === "execution" ? "现场实施" : "验收复核"
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "施工要点",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !xe, value: j.content, onChange: (rt) => {
                      var N;
                      return C({ ...qe, construction_points: (N = qe.construction_points) == null ? void 0 : N.map((fe, Ze) => Ze === ce ? { ...fe, content: rt.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "检查方法",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !xe, value: j.inspection_method, onChange: (rt) => {
                      var N;
                      return C({ ...qe, construction_points: (N = qe.construction_points) == null ? void 0 : N.map((fe, Ze) => Ze === ce ? { ...fe, inspection_method: rt.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsxs("label", { children: [
                    "常见问题",
                    /* @__PURE__ */ s.jsx("textarea", { disabled: !xe, value: j.common_mistakes, onChange: (rt) => {
                      var N;
                      return C({ ...qe, construction_points: (N = qe.construction_points) == null ? void 0 : N.map((fe, Ze) => Ze === ce ? { ...fe, common_mistakes: rt.target.value } : fe) });
                    } })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { children: j.claim_kind === "source_summary" ? "来源归纳，待核查" : "新增建议，不代表已执行或有效标准" }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    "证据：",
                    j.evidence_ids.join("、")
                  ] }),
                  (be = j.source_quotes) == null ? void 0 : be.map((rt, N) => /* @__PURE__ */ s.jsxs("details", { children: [
                    /* @__PURE__ */ s.jsx("summary", { children: "核对原文摘录" }),
                    /* @__PURE__ */ s.jsx("p", { children: rt.text })
                  ] }, N))
                ] }, ce);
              })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "生成建议 · 不作为来源事实" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "建议（每行一项）",
              /* @__PURE__ */ s.jsx("textarea", { disabled: !xe, value: qe.suggestions.join(`
`), onChange: (j) => C({ ...qe, suggestions: j.target.value.split(`
`).filter(Boolean) }) })
            ] }),
            /* @__PURE__ */ s.jsx("h3", { children: "标准依据" }),
            qe.standards.length ? qe.standards.map((j, ce) => /* @__PURE__ */ s.jsxs("div", { className: "standard-card", children: [
              /* @__PURE__ */ s.jsx("strong", { children: j.name }),
              /* @__PURE__ */ s.jsxs("p", { children: [
                "条款：",
                j.clause || "未提供",
                " · 版本：",
                j.edition || "未提供"
              ] }),
              /* @__PURE__ */ s.jsx("span", { children: j.verification_status === "pending_verification" ? "待核验 · 不能作为有效标准" : "不采用" }),
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !xe, checked: j.verification_status === "not_used", onChange: (be) => C({ ...qe, standards: qe.standards.map((rt, N) => N === ce ? { ...rt, verification_status: be.target.checked ? "not_used" : "pending_verification" } : rt) }) }),
                "明确不采用该依据"
              ] })
            ] }, ce)) : /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "没有已核验标准，不自动补造标准名称或条款。" }),
            ku(ve.content, qe).length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
              /* @__PURE__ */ s.jsx("h3", { children: "本次未保存修改" }),
              ku(ve.content, qe).map(([j, ce, be]) => /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("strong", { children: j }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                  "原：",
                  ce
                ] }),
                /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                  "新：",
                  be
                ] })
              ] }, j))
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "本次修改 / 审核说明",
              /* @__PURE__ */ s.jsx("textarea", { value: w, onChange: (j) => P(j.target.value), placeholder: "说明核查结果、修改理由或退回原因" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              xe && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: R || !w.trim(), onClick: () => void Ye(async () => {
                await u(`/knowledge/${ve.id}/draft`, { method: "PATCH", body: JSON.stringify({ row_version: ve.row_version, revision_id: ve.revision_id, content: qe, reason: w }) }), k("已创建新草稿版本；原版本和审核意见保留。"), me((j) => j + 1);
              }), children: "保存新草稿版本" }),
              xe && ["draft", "changes_requested"].includes(ve.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: R || !w.trim() || JSON.stringify(qe) !== JSON.stringify(ve.content), onClick: () => void jt("submit"), children: "提交当前已保存版本审核" })
            ] }),
            Ge && ve.state === "pending_review" && /* @__PURE__ */ s.jsxs("div", { className: "review-controls", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ne, onChange: (j) => Ue(j.target.checked) }),
                "已逐条核对事实及来源证据"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
                /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: R || !Ne || !w.trim() || JSON.stringify(qe) !== JSON.stringify(ve.content), onClick: () => void jt("approve"), children: "批准此版本" }),
                /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: R || !w.trim(), onClick: () => void jt("request-changes"), children: "退回修改" })
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
        ve.revisions.map((j, ce) => /* @__PURE__ */ s.jsxs("details", { children: [
          /* @__PURE__ */ s.jsxs("summary", { children: [
            "v",
            j.version,
            " · ",
            hl[j.state]
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: j.content.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "事实：",
            j.content.facts.map((be) => be.text).join("；")
          ] }),
          ve.revisions[ce + 1] && /* @__PURE__ */ s.jsxs("div", { className: "draft-diff", children: [
            /* @__PURE__ */ s.jsxs("p", { children: [
              "相较v",
              ve.revisions[ce + 1].version,
              "的修改："
            ] }),
            ku(ve.revisions[ce + 1].content, j.content).map(([be, rt, N]) => /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: be }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-before", children: [
                "原：",
                rt
              ] }),
              /* @__PURE__ */ s.jsxs("p", { className: "diff-after", children: [
                "新：",
                N
              ] })
            ] }, be))
          ] })
        ] }, j.id)),
        ve.review_actions.map((j, ce) => /* @__PURE__ */ s.jsxs("div", { className: "review-history", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            "v",
            j.version,
            " · ",
            hl[j.action] || j.action
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
      !te && ft && /* @__PURE__ */ s.jsxs("section", { className: "panel generation-panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "从风险数据生成知识候选" }),
          /* @__PURE__ */ s.jsx("span", { children: "先选择明确范围，核对后提交；每次最多20条同项目来源" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Z, onChange: (j) => W(j.target.value), children: o.filter((j) => Mt(j, "knowledge.process")).map((j) => /* @__PURE__ */ s.jsx("option", { value: j.id, children: j.name }, j.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "知识类型",
              /* @__PURE__ */ s.jsxs("select", { value: it, onChange: (j) => Fe(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
                /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => {
            et(we.slice(0, 20).map((j) => j.record_version_id)), ke(null);
          }, children: "选择当前显示范围" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: we.length ? we.map((j) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ae.includes(j.record_version_id), onChange: (ce) => {
              et(ce.target.checked ? [...Ae, j.record_version_id] : Ae.filter((be) => be !== j.record_version_id)), ke(null);
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
              /* @__PURE__ */ s.jsxs("select", { value: Ke, onChange: (j) => Oe(j.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "normal", children: "正常候选" }),
                /* @__PURE__ */ s.jsx("option", { value: "bad_evidence", children: "返回错误证据ID，验证拒绝" }),
                /* @__PURE__ */ s.jsx("option", { value: "unverified_standard", children: "附带待核验依据，验证审核阻断" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", disabled: R || !Ae.length || Ae.length > 20, onClick: () => void Ye(async () => {
              ke(await u("/knowledge/generation-preview", { method: "POST", body: JSON.stringify(b()) }));
            }), children: [
              "预览生成范围（",
              Ae.length,
              "条）"
            ] }),
            De && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: R, onClick: () => void Ye(async () => {
              const j = await u("/knowledge/generation-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(b()) });
              at(null), Ie(j.job_id), sessionStorage.setItem("b03-last-job-" + z, j.job_id), k("生成任务已提交，字段和来源证据将自动带入。");
            }), children: [
              "确认生成 ",
              De.count,
              " 张候选卡",
              /* @__PURE__ */ s.jsx(Ml, { size: 15 })
            ] })
          ] }),
          De && /* @__PURE__ */ s.jsx("div", { className: "generation-preview", children: De.items.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
            j.description,
            " · 来源问题 ",
            j.quality_issue_count,
            "项"
          ] }, ce)) }),
          st && /* @__PURE__ */ s.jsxs("div", { className: "generation-result", children: [
            /* @__PURE__ */ s.jsxs("h3", { children: [
              "最近生成任务 · ",
              st.progress,
              "%"
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "新增 ",
              st.counts.created,
              " · 复用 ",
              st.counts.skipped,
              " · 单项失败 ",
              st.counts.failed
            ] }),
            st.error && /* @__PURE__ */ s.jsx("p", { role: "alert", children: st.error }),
            st.items.map((j, ce) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.error || hl[j.outcome],
              " ",
              j.item_id && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + j.item_id + "/edit"), children: "打开知识卡" })
            ] }, ce)),
            st.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: R, onClick: () => void Ye(async () => {
              await u("/jobs/" + st.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: st.row_version }) }), at(null);
            }), children: "重试生成任务" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: te ? "审核待办" : "知识候选列表" }),
          te && /* @__PURE__ */ s.jsxs("select", { "aria-label": "审核对象类型", value: ne, onChange: (j) => {
            H(j.target.value), pe(""), y([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "knowledge_revision", children: "知识候选" }),
            /* @__PURE__ */ s.jsx("option", { value: "retrospective_revision", children: "过程复盘" }),
            /* @__PURE__ */ s.jsx("option", { value: "question_revision", children: "培训题目" })
          ] }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识状态", value: Be, onChange: (j) => {
            Qe(j.target.value), pe(""), y([]);
          }, children: [
            !te && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            (te ? ["pending_review", "changes_requested", "approved"] : ["draft", "pending_review", "changes_requested", "approved"]).map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: hl[j] }, j))
          ] })
        ] }),
        te && !L ? /* @__PURE__ */ s.jsx("div", { className: "empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前身份没有审核权限" }) }) : ye.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "知识卡" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ye.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.title }),
            /* @__PURE__ */ s.jsx("td", { children: Vf[j.type] }),
            /* @__PURE__ */ s.jsx("td", { children: hl[j.state] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              j.version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _(j.object_type === "question_revision" ? "/training/questions/" + j.id : j.object_type === "retrospective_revision" ? "/retrospectives/" + j.id + "/review" : "/knowledge/" + j.id + "/edit"), children: te ? "打开审核" : "核查与编辑" }) })
          ] }, j.id)) })
        ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
          /* @__PURE__ */ s.jsx("h2", { children: te ? "暂无对应审核待办" : "还没有知识候选" }),
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
        /* @__PURE__ */ s.jsx("select", { value: Ce, onChange: (j) => m(j.target.value), children: ["resolved", "ignored", "open"].map((j) => /* @__PURE__ */ s.jsx("option", { value: j, children: hl[j] }, j)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "处理理由",
        /* @__PURE__ */ s.jsx("textarea", { value: B, onChange: (j) => I(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "人工补充（可选，独立保存）",
        /* @__PURE__ */ s.jsx("textarea", { value: ae, onChange: (j) => ie(j.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "只保存核查说明，不覆盖原始字段或旧治理生效值。" }),
      /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: R || !B.trim(), onClick: () => void Ye(async () => {
        await u("/quality/issues/" + Q.id, { method: "PATCH", body: JSON.stringify({ row_version: Q.row_version, status: Ce, reason: B, annotation: ae || null }) }), le(null), me((j) => j + 1), k("处理状态及人工说明已保存。");
      }), children: "保存处理" })
    ] }) })
  ] });
}
const Jf = { queued: "等待构建", building: "索引构建中", ready: "待启用", active: "当前启用", inactive: "历史发布", failed: "构建失败", pending: "等待处理" }, Hv = (u) => ({ generic: "通用工程风险", lifting_supervision: "吊装监护", fire_inspection: "消防巡查", structural_inspection: "结构检查", mep_inspection: "机电检查" })[u] || "其他已配置场景", Bv = (u) => [u.section, typeof u.row == "number" ? `第${u.row}行` : null, u.cell ? `单元格 ${u.cell}` : null].filter(Boolean).join(" · ") || "已关联来源记录", Cu = (u) => u === "case_card" ? "案例卡" : "检查要点卡";
function Lv({ identity: u, path: h, projects: _, navigate: o }) {
  var de, te, Ye, b, ge, xe, Ge, jt;
  const [z, D] = r.useState(((de = _[0]) == null ? void 0 : de.id) || ""), [V, R] = r.useState("generic"), [Y, v] = r.useState(""), [M, K] = r.useState([]), [k, se] = r.useState({}), [me, ye] = r.useState([]), [_e, Ee] = r.useState([]), [he, F] = r.useState("mock-hash-64"), [ue, ne] = r.useState([]), [H, je] = r.useState(null), [Re, Be] = r.useState(""), [Qe, Le] = r.useState("extractive"), [pe, We] = r.useState(null), [X, oe] = r.useState(null), [y, Q] = r.useState(null);
  r.useEffect(() => () => {
    y && URL.revokeObjectURL(y);
  }, [y]), r.useEffect(() => {
    Q(null);
  }, [z, h]);
  const [le, Ce] = r.useState(null);
  r.useEffect(() => {
    Ce(null);
  }, [h]);
  const [m, B] = r.useState(""), [I, ae] = r.useState("useful"), [ie, Z] = r.useState(""), [W, we] = r.useState(!1), [re, Ae] = r.useState(!0), [et, it] = r.useState(""), [Fe, Ke] = r.useState(""), [Oe, De] = r.useState(0), [ke, He] = r.useState(""), [Ie, st] = r.useState(null), [at, ve] = r.useState([]), ct = r.useRef("");
  ct.current = [u, h, z, V, Y, Re, Qe, le].join("|");
  const qe = h === "/releases", C = h === "/search", w = h === "/knowledge/library", P = Mt(_.find((T) => T.id === z), "knowledge.publish"), Ne = !qe && !C && !w ? h.split("/")[2] : null;
  async function Ue(T, j = {}) {
    const ce = await Zt("/api/v1" + T, { ...j, headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...j.headers } }), be = await ce.json();
    if (!ce.ok) throw new Error(be.message || "请求失败，请重试。");
    return be;
  }
  r.useEffect(() => {
    Ee([]), We(null), oe(null), it(""), Ke(""), He(""), ve([]);
  }, [z, h, V, Y]), r.useEffect(() => {
    let T = !1;
    return Ae(!0), it(""), je(null), (async () => {
      try {
        if (qe) {
          const ce = await Ue(`/releases?project_id=${z}${ke ? "&cursor=" + encodeURIComponent(ke) : ""}`);
          if (T) return;
          K(ce.items), se(ce.active_ids), st(ce.next_cursor);
          const be = await Ue("/releases/options?project_id=" + z);
          T || ye(be.items);
        } else if (w) {
          const ce = await Ue(`/knowledge/library?project_id=${z}${V ? "&scene_code=" + V : ""}${Y ? "&card_type=" + Y : ""}${ke ? "&after_id=" + ke : ""}`);
          T || (ne(ce.items), st(ce.next_cursor));
        } else if (Ne) {
          const ce = await Ue("/published/knowledge/" + Ne + (le ? "?revision_id=" + le : ""));
          T || je(ce);
        }
      } catch (ce) {
        T || it(ce.message);
      } finally {
        T || Ae(!1);
      }
    })(), () => {
      T = !0;
    };
  }, [z, h, V, Y, Oe, ke, le]), r.useEffect(() => {
    if (!qe || !M.some((j) => ["queued", "building"].includes(j.state))) return;
    const T = setInterval(() => De((j) => j + 1), 1800);
    return () => clearInterval(T);
  }, [qe, M]);
  const lt = async (T) => {
    we(!0), it(""), Ke("");
    try {
      await T();
    } catch (j) {
      it(j.message);
    } finally {
      we(!1);
    }
  }, ft = (T, j, ce = !1) => lt(async () => {
    const be = ct.current;
    Q(null), oe(null);
    const rt = await Ue("/published/evidence/" + T + "?revision_id=" + j + (ce ? "&historical=true" : ""));
    if (be === ct.current && (oe(rt), rt.has_image)) {
      const N = await Zt("/api/v1/published/evidence/" + T + "/content?revision_id=" + j + (ce ? "&historical=true" : ""), { headers: { Authorization: `Bearer dev-${u}` } });
      if (!N.ok) throw new Error("证据图片已不可用，请刷新后重试。");
      const fe = await N.blob();
      be === ct.current && Q(URL.createObjectURL(fe));
    }
  }), L = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "按当前授权范围展示" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !at.length || re, onClick: () => {
        He(at.at(-1) || ""), ve(at.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !Ie || re, onClick: () => {
        ve([...at, ke]), He(Ie || "");
      }, children: "下一页" })
    ] })
  ] });
  return /* @__PURE__ */ s.jsxs("div", { className: "retrieval-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(rc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: "审核成果发布与证据检索" }),
        /* @__PURE__ */ s.jsx("span", { children: "按项目权限读取已发布资料。检索使用本地特征哈希向量，回答直接摘录已审核事实。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: w || Ne ? "selected" : "", onClick: () => o("/knowledge/library"), children: "已发布知识" }),
        /* @__PURE__ */ s.jsx("button", { className: C ? "selected" : "", onClick: () => o("/search"), children: "知识检索" }),
        _.some((T) => Mt(T, "knowledge.publish")) && /* @__PURE__ */ s.jsx("button", { className: qe ? "selected" : "", onClick: () => o("/releases"), children: "发布管理" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        oe(null), We(null), De((T) => T + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    et && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      et
    ] }),
    Fe && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      Fe
    ] }),
    !Ne && /* @__PURE__ */ s.jsxs("div", { className: "retrieval-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "发布检索项目", value: z, onChange: (T) => D(T.target.value), children: _.map((T) => /* @__PURE__ */ s.jsx("option", { value: T.id, children: T.name }, T.id)) })
      ] }),
      !qe && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "场景",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "检索场景", value: V, onChange: (T) => R(T.target.value), children: [
            w && /* @__PURE__ */ s.jsx("option", { value: "", children: "全部场景" }),
            /* @__PURE__ */ s.jsx("option", { value: "generic", children: "通用工程风险" }),
            /* @__PURE__ */ s.jsx("option", { value: "lifting_supervision", children: "吊装监护" }),
            /* @__PURE__ */ s.jsx("option", { value: "fire_inspection", children: "消防巡查" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "知识类型",
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识类型", value: Y, onChange: (T) => v(T.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
            /* @__PURE__ */ s.jsx("option", { value: "case_card", children: "案例卡" }),
            /* @__PURE__ */ s.jsx("option", { value: "checkpoint_card", children: "检查要点卡" })
          ] })
        ] })
      ] })
    ] }),
    re ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在加载…" }) : qe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      P && /* @__PURE__ */ s.jsxs("section", { className: "panel release-compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "建立发布批次" }),
          /* @__PURE__ */ s.jsx("span", { children: "已有内容自动带入，仅选择审核版本" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { children: "每个批次是此项目的完整发布集合，启用时会替换上一批。构建成功后仍需点击“启用发布”。" }),
        /* @__PURE__ */ s.jsx("div", { className: "release-choices", children: me.length ? me.map((T) => /* @__PURE__ */ s.jsxs("label", { className: "release-choice", children: [
          /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: _e.includes(T.revision_id), onChange: (j) => Ee(j.target.checked ? [..._e, T.revision_id] : _e.filter((ce) => ce !== T.revision_id)) }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: T.title }),
            /* @__PURE__ */ s.jsxs("small", { children: [
              Cu(T.type),
              " · 审核版本 v",
              T.version
            ] })
          ] })
        ] }, T.revision_id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无可发布的审核版本。请先到知识加工区完成审核。" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "release-submit", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "向量配置",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "向量配置", value: he, onChange: (T) => F(T.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "openai-text-embedding-3-small", children: "OpenAI 语义向量 · 1536维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-64", children: "模拟特征向量 · 64维" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock-hash-96", children: "模拟特征向量 · 96维（重建新集合）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: W || !_e.length, onClick: () => void lt(async () => {
            await Ue("/releases", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ project_id: z, revision_ids: _e, embedding_model: he }) }), Ee([]), Ke("发布集合已固定，处理服务正在构建索引。"), De((T) => T + 1);
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
        M.length ? /* @__PURE__ */ s.jsx("div", { className: "release-list", children: M.map((T) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("div", { className: "release-row", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("strong", { children: Jf[T.state] || T.state }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                new Date(T.created_at).toLocaleString("zh-CN"),
                " · ",
                T.entries.length,
                " 张卡片 · ",
                T.index_config.dimension,
                " 维"
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                "批次 ",
                T.id.slice(0, 8),
                T.build_ms !== null ? ` · 构建 ${T.build_ms} ms` : ""
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                T.progress,
                "%"
              ] }),
              ["ready", "inactive"].includes(T.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: W, onClick: () => void lt(async () => {
                await Ue("/releases/" + T.id + "/activate", { method: "POST", body: JSON.stringify({ row_version: T.row_version, expected_active_id: k[z] || null }) }), Ke("发布已启用，知识库与检索使用同一发布集合。"), De((j) => j + 1);
              }), children: "启用发布" }),
              T.state === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: W, onClick: () => void lt(async () => {
                await Ue("/jobs/" + T.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: T.job_row_version }) }), De((j) => j + 1);
              }), children: "重试构建" })
            ] })
          ] }),
          T.error && /* @__PURE__ */ s.jsx("p", { className: "release-error", children: T.error }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看构建项" }),
            T.entries.map((j) => /* @__PURE__ */ s.jsxs("p", { children: [
              j.revision_id.slice(0, 8),
              " · ",
              Jf[j.state] || j.state,
              j.error ? " · " + j.error : ""
            ] }, j.revision_id))
          ] })
        ] }, T.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
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
      ue.length ? /* @__PURE__ */ s.jsx("div", { className: "library-grid", children: ue.map((T) => /* @__PURE__ */ s.jsxs("article", { children: [
        /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
          Cu(T.type),
          " · v",
          T.version
        ] }),
        /* @__PURE__ */ s.jsx("h2", { children: T.title }),
        /* @__PURE__ */ s.jsx("p", { children: "通用工程风险 · 已审核版本" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => o("/knowledge/" + T.id), children: [
          "查看内容与来源",
          /* @__PURE__ */ s.jsx(lv, { size: 15 })
        ] })
      ] }, T.revision_id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(rc, { size: 32 }),
        /* @__PURE__ */ s.jsx("h2", { children: "此范围暂无已发布知识" }),
        /* @__PURE__ */ s.jsx("p", { children: "审核通过后，还需构建并启用发布；也可调整场景或类型筛选。" })
      ] }),
      L
    ] }) : C ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("form", { className: "panel search-form", onSubmit: (T) => {
        T.preventDefault(), lt(async () => {
          const j = ct.current;
          We(null), oe(null);
          const ce = await Ue("/search", { method: "POST", body: JSON.stringify({ project_id: z, question: Re, scene_code: V, card_type: Y || null, answer_mode: Qe }) });
          j === ct.current && We(ce);
        });
      }, children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "knowledge-question", children: "希望查找什么风险或案例？" }),
        /* @__PURE__ */ s.jsx("textarea", { id: "knowledge-question", required: !0, maxLength: 4e3, rows: 3, value: Re, onChange: (T) => {
          Be(T.target.value), We(null), oe(null);
        }, placeholder: "例如：疏散通道被材料堵住，有哪些历史检查记录？" }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "回答方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "回答方式", value: Qe, onChange: (T) => {
              Le(T.target.value), We(null);
            }, children: [
              /* @__PURE__ */ s.jsx("option", { value: "extractive", children: "摘录审核事实并附引用" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_timeout", children: "验证超时回退（模拟）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: W || !Re.trim(), children: [
            /* @__PURE__ */ s.jsx(yv, { size: 17 }),
            W ? "正在检索…" : "查找知识"
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
          pe.answer_blocks.map((T, j) => /* @__PURE__ */ s.jsx("p", { children: T.text }, j)),
          pe.missing_conditions.map((T) => /* @__PURE__ */ s.jsx("p", { children: T }, T)),
          pe.warnings.map((T) => /* @__PURE__ */ s.jsx("p", { className: "small-note", children: T.message }, T.code))
        ] }),
        pe.results.map((T, j) => /* @__PURE__ */ s.jsxs("article", { className: "search-hit", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "eyebrow", children: [
            "结果 ",
            j + 1,
            " · ",
            T.match === "exact_standard" ? "标准编号精确匹配" : "关键词与模拟向量合并"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => o("/knowledge/" + T.id), children: T.title }),
          /* @__PURE__ */ s.jsx("p", { children: T.text }),
          /* @__PURE__ */ s.jsx("div", { children: pe.citations.filter((ce) => T.citation_ids.includes(ce.citation_id)).map((ce) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", disabled: W, onClick: () => void ft(ce.evidence_id, ce.knowledge_revision_id), children: [
            "打开来源：",
            ce.source_title
          ] }, ce.citation_id)) })
        ] }, T.revision_id)),
        /* @__PURE__ */ s.jsxs("form", { className: "search-feedback", onSubmit: (T) => {
          T.preventDefault(), lt(async () => {
            await Ue("/search/" + pe.query_id + "/feedback", { method: "POST", body: JSON.stringify({ rating: I, comment: ie }) }), Ke("检索反馈已保存。");
          });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "此次检索反馈",
            /* @__PURE__ */ s.jsxs("select", { value: I, onChange: (T) => ae(T.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
              /* @__PURE__ */ s.jsx("option", { value: "irrelevant", children: "结果不相关" }),
              /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "内容需核查" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明（选填）",
            /* @__PURE__ */ s.jsx("input", { value: ie, maxLength: 1e3, onChange: (T) => Z(T.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: W, children: "保存反馈" })
        ] })
      ] })
    ] }) : H && /* @__PURE__ */ s.jsxs("section", { className: "panel published-detail", children: [
      /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => o("/knowledge/library"), children: "返回知识库" }),
      /* @__PURE__ */ s.jsxs("span", { className: "role-tag", children: [
        H.is_current_release === !1 ? "历史发布" : "已发布",
        " · ",
        Cu(H.type),
        " · v",
        H.version
      ] }),
      /* @__PURE__ */ s.jsx("h2", { children: H.title }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "适用范围：",
        ((te = _.find((T) => T.id === H.project_id)) == null ? void 0 : te.name) || H.project_id,
        " · ",
        Hv(H.scene_code),
        "；需结合具体作业条件核对。"
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "已审核事实" }),
      (Ye = H.content) == null ? void 0 : Ye.facts.map((T, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
        /* @__PURE__ */ s.jsx("p", { children: T.text }),
        /* @__PURE__ */ s.jsx("small", { children: T.source_kind === "human_annotation" ? "人工修订并经审核" : "来源生效值" }),
        /* @__PURE__ */ s.jsx("div", { children: T.evidence_ids.map((ce) => /* @__PURE__ */ s.jsx("button", { disabled: W, className: "citation-button", onClick: () => void ft(ce, H.revision_id, H.is_current_release === !1), children: "打开来源证据" }, ce)) })
      ] }, j)),
      ((b = H.content) == null ? void 0 : b.construction_points) && H.content.construction_points.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("h3", { children: [
          "施工要点 · ",
          H.content.category_name || "通用"
        ] }),
        H.content.construction_points.map((T, j) => /* @__PURE__ */ s.jsxs("div", { className: "published-fact", children: [
          /* @__PURE__ */ s.jsxs("strong", { children: [
            T.title,
            " · ",
            T.stage === "preparation" ? "施工准备" : T.stage === "execution" ? "现场实施" : "验收复核"
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: T.content }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "检查方法：",
            T.inspection_method || "来源未明确，请结合具体条件核查"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "常见问题：",
            T.common_mistakes || "未明确"
          ] }),
          /* @__PURE__ */ s.jsx("small", { children: T.claim_kind === "source_summary" ? "已审核的来源归纳" : "经审核保留的建议，不等同已执行或有效规范" }),
          /* @__PURE__ */ s.jsx("div", { children: T.evidence_ids.map((ce) => /* @__PURE__ */ s.jsx("button", { className: "citation-button", onClick: () => void ft(ce, H.revision_id, H.is_current_release === !1), children: "核对要点来源" }, ce)) })
        ] }, j))
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: "建议与依据状态" }),
      /* @__PURE__ */ s.jsx("p", { children: ((ge = H.content) == null ? void 0 : ge.generation_mode) === "llm" ? "下列建议由模型提出并经人工审核，仍需核对现场适用条件。" : "下列建议来自本地演示模板，不能作为自动处置指令。" }),
      (xe = H.content) == null ? void 0 : xe.suggestions.map((T, j) => /* @__PURE__ */ s.jsx("p", { children: T }, j)),
      (Ge = H.content) != null && Ge.standards.length ? H.content.standards.map((T, j) => /* @__PURE__ */ s.jsxs("p", { children: [
        T.name,
        " ",
        T.clause,
        " · ",
        T.verification_status === "not_used" ? "未采用" : "待核验"
      ] }, j)) : /* @__PURE__ */ s.jsx("p", { children: "没有已独立核验的标准依据。" }),
      /* @__PURE__ */ s.jsxs("details", { children: [
        /* @__PURE__ */ s.jsx("summary", { children: "版本信息" }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          "发布批次：",
          H.release_id
        ] }),
        (jt = H.versions) == null ? void 0 : jt.map((T) => /* @__PURE__ */ s.jsxs("button", { className: "citation-button", onClick: () => {
          Ce(T.id), oe(null);
        }, children: [
          "查看已发布 v",
          T.version
        ] }, T.id)),
        /* @__PURE__ */ s.jsx("p", { children: H.history_note })
      ] }),
      Mt(_.find((T) => T.id === H.project_id), "knowledge.publish") && /* @__PURE__ */ s.jsxs("div", { className: "withdraw-form", children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "撤回原因",
          /* @__PURE__ */ s.jsx("input", { value: m, maxLength: 2e3, onChange: (T) => B(T.target.value) })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: W || !m.trim(), onClick: () => void lt(async () => {
          await Ue("/knowledge/" + H.id + "/withdraw", { method: "POST", body: JSON.stringify({ row_version: H.row_version, reason: m }) }), je(null), oe(null), Ke("知识已撤回，新的检索和证据访问已阻断。"), o("/knowledge/library");
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
const Bn = { received: "已接收", validating: "校验中", processing: "处理中", ready: "处理完成", failed: "处理失败", withdrawn: "已撤回", verified: "校验通过", pending: "待校验", unavailable: "当前不可用" }, um = { task_started: "任务开始", inspection_recorded: "现场检查记录", issue_created: "提出问题", rectification_submitted: "提交整改", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务完成" }, zu = { task: "任务资料", participants: "参与人员", events: "过程事件", issues: "问题与整改", attachments: "证据附件", event_times: "实际时间", data_completeness: "资料完整性", scene_code: "作业场景", extensions: "扩展资料" }, Yv = { historical_summary: "可供历史资料复盘", partial_timeline: "只能还原部分过程", complete_timeline: "具备完整时间线输入条件" }, Au = { site_photo: "现场照片", text_screenshot: "文字截图", source_document: "原始文档", video: "视频", other: "其他资料", unknown: "类型未确认" }, Ru = (u) => ({ supervisor: "监护人员", contractor: "整改责任方", inspector: "检查人员", reviewer: "复核人员" })[u] || u, Gn = (u) => u ? new Date(u).toLocaleString("zh-CN") : "实际时间未提供", Gv = (u) => JSON.stringify(u, null, 2), Xv = { due_at: "整改期限", status: "状态", issue_id: "问题编号", description: "问题描述", evidence_refs: "证据编号", rectification: "整改说明", review_conclusion: "复核结论", responsible_actor_id: "责任方", event_type: "事件类型", occurred_at: "实际时间", actor_id: "人员编号", actor_role: "人员角色", payload: "补充信息", note: "说明", related_object_id: "对应对象", event_id: "事件编号", name: "任务名称", started_at: "开始时间", completed_at: "结束时间", attachment_id: "附件编号", mime_type: "文件类型", size: "文件字节数", evidence_type: "证据类型", sha256: "内容校验值" };
function Ba(u, h = "") {
  if (u == null) return "未提供";
  if (Array.isArray(u)) return u.every((_) => typeof _ != "object") ? u.join("、") : u.map((_, o) => `第${o + 1}条
${Ba(_)}`).join(`

`);
  if (typeof u == "object") return Object.entries(u).map(([_, o]) => `${Xv[_] || zu[_] || _}：${Ba(o, _)}`).join(`
`);
  if (typeof u == "string") {
    if (["due_at", "occurred_at", "started_at", "completed_at"].includes(h)) return Gn(u);
    if (h === "actor_role" || h === "role") return Ru(u);
    if (h === "event_type") return um[u] || u;
    if (h === "evidence_type") return Au[u] || u;
    if (h === "status") return { closed: "已闭环", open: "未整改", rectifying: "整改中", pending_review: "待复核", completed: "已完成", cancelled: "已取消", archived: "已归档" }[u] || u;
  }
  return String(u);
}
const Qv = (u) => {
  const h = u.note;
  return typeof h == "string" ? h : Object.keys(u).length ? Gv(u) : "未补充说明";
};
function Zv({ identity: u, path: h, projects: _, navigate: o }) {
  var qe, C, w, P, Ne, Ue, lt, ft, L, de, te, Ye;
  const z = h === "/task-packages/import", D = !z && h !== "/task-packages" ? h.split("/")[2] : null, [V, R] = r.useState(((qe = _[0]) == null ? void 0 : qe.id) || ""), [Y, v] = r.useState(""), [M, K] = r.useState([]), [k, se] = r.useState(null), [me, ye] = r.useState(""), [_e, Ee] = r.useState(null), [he, F] = r.useState([]), [ue, ne] = r.useState([]), [H, je] = r.useState([]), [Re, Be] = r.useState("complete"), [Qe, Le] = r.useState(() => sessionStorage.getItem("b05-demo-task:" + u) || "demo-task-" + crypto.randomUUID().slice(0, 8)), [pe, We] = r.useState(""), [X, oe] = r.useState(null), [y, Q] = r.useState(""), [le, Ce] = r.useState(""), [m, B] = r.useState(!0), [I, ae] = r.useState(!1), [ie, Z] = r.useState(0), [W, we] = r.useState(""), [re, Ae] = r.useState(null), et = r.useRef(null), it = r.useRef(null), Fe = r.useRef("");
  Fe.current = [u, h, V, Re, Qe, pe].join("|");
  const Ke = _.some((b) => b.permissions != null), Oe = !Ke && Mt(_.find((b) => b.id === V), "imports.create"), De = k && !Ke && Mt(_.find((b) => b.id === k.project_id), "imports.withdraw"), ke = k && !Ke && Mt(_.find((b) => b.id === k.project_id), "imports.create");
  async function He(b, ge = {}) {
    const xe = await Zt("/api/v1/task-packages" + b, {
      ...ge,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, ...ge.headers }
    }), Ge = await xe.json().catch(() => ({}));
    if (!xe.ok) throw new Error(Ge.message || "接入服务暂未就绪，请稍后刷新。");
    return Ge;
  }
  const Ie = async (b) => {
    ae(!0), Q(""), Ce("");
    try {
      await b();
    } catch (ge) {
      Q(ge.message);
    } finally {
      ae(!1);
    }
  };
  r.useEffect(() => {
    sessionStorage.setItem("b05-demo-task:" + u, Qe);
  }, [Qe, u]), r.useEffect(() => () => {
    re != null && re.url && URL.revokeObjectURL(re.url);
  }, [re == null ? void 0 : re.url]), r.useEffect(() => {
    ye(""), F([]), Q(""), Ce(""), Ae(null), we(""), oe(null);
  }, [h, V, Y]), r.useEffect(() => {
    let b = !1;
    return B(!0), se(null), Q(""), (async () => {
      try {
        if (z && Rt) {
          const xe = await Zt("/api/v1/platform-archives"), Ge = await xe.json();
          if (!xe.ok) throw new Error(Ge.message);
          b || ne(Ge.items);
        } else if (z) {
          const xe = await He("/samples");
          b || je(xe.items);
        } else if (D) {
          const xe = await He("/" + D);
          b || se(xe);
        } else {
          const xe = await He(`?project_id=${V}${Y ? "&state=" + Y : ""}${me ? "&cursor=" + encodeURIComponent(me) : ""}`);
          b || (K(xe.items), Ee(xe.next_cursor));
        }
      } catch (xe) {
        b || Q(xe.message);
      } finally {
        b || B(!1);
      }
    })(), () => {
      b = !0;
    };
  }, [h, V, Y, me, ie]), r.useEffect(() => {
    if (Rt || !z || !Oe) return;
    let b = !1;
    oe(null), We("");
    const ge = Qe + "." + (Re === "v2" ? "complete" : Re);
    return He(`/samples/${Re}?project_id=${V}&task_id=${ge}`).then((xe) => {
      b || We(JSON.stringify(xe, null, 2));
    }).catch((xe) => {
      b || Q(xe.message);
    }), () => {
      b = !0;
    };
  }, [z, V, Re, Qe]), r.useEffect(() => {
    if (!(k && ["received", "validating", "processing"].includes(k.status) || !D && M.some((xe) => ["received", "validating", "processing"].includes(xe.status))) || z) return;
    const ge = setInterval(() => Z((xe) => xe + 1), 1800);
    return () => clearInterval(ge);
  }, [k == null ? void 0 : k.status, M, h]);
  const st = () => Ie(async () => {
    const b = Fe.current;
    oe(null);
    const ge = await He("/preview", { method: "POST", body: pe });
    Fe.current === b && oe(ge);
  }), at = () => Ie(async () => {
    var ge;
    if (!X) return;
    ((ge = et.current) == null ? void 0 : ge.hash) !== X.content_hash && (et.current = { hash: X.content_hash, key: crypto.randomUUID() });
    const b = await He("", { method: "POST", headers: { "Idempotency-Key": et.current.key }, body: pe });
    Ce(b.replayed ? "已找到相同任务包，复用原接收记录。" : "任务包已接收，后台将自动校验附件。"), o("/task-packages/" + b.receipt_id);
  }), ve = (b) => Ie(async () => {
    const ge = Fe.current;
    Ae(null);
    const xe = await Zt(`/api/v1/task-packages/${D}/assets/${b.attachment_id}/content`, { headers: { Authorization: `Bearer dev-${u}` } });
    if (!xe.ok) {
      const jt = await xe.json().catch(() => ({}));
      throw new Error(jt.message || "附件服务暂不可用，请稍后重试。");
    }
    const Ge = await xe.blob();
    if (ge === Fe.current)
      if (b.mime_type.startsWith("text/")) {
        const jt = await Ge.slice(0, 1e6).text();
        ge === Fe.current && Ae({ id: b.attachment_id, url: null, text: jt });
      } else if (b.mime_type.startsWith("image/")) Ae({ id: b.attachment_id, url: URL.createObjectURL(Ge), text: null });
      else {
        const jt = URL.createObjectURL(Ge), T = document.createElement("a");
        T.href = jt, T.download = "任务附件", T.click(), URL.revokeObjectURL(jt);
      }
  }), ct = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "仅展示当前授权项目" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !he.length || m, onClick: () => {
        ye(he.at(-1) || ""), F(he.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !_e || m, onClick: () => {
        F([...he, me]), ye(_e || "");
      }, children: "下一页" })
    ] })
  ] });
  return _.length ? Ke && z ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "A 成果接入" }),
    /* @__PURE__ */ s.jsx("p", { children: "请在 A 的成果归档中选择指定版本并点击“接入知识中心”。已有资料可继续查看。" }),
    /* @__PURE__ */ s.jsx("a", { href: "/quality/#archives", children: "打开成果归档" })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "task-packages-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Mf, { size: 21 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: Rt ? "小察归档成果接入" : "A任务包接入 · 模拟数据" }),
        /* @__PURE__ */ s.jsx("span", { children: Ke ? "保留指定成果版本；新版本产生后旧版本仍可使用，明确撤回才停止引用。缺失信息不会自动补全。" : "保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: z ? "" : "selected", onClick: () => o("/task-packages"), children: "任务包清单" }),
        !Ke && _.some((b) => Mt(b, "imports.create")) && /* @__PURE__ */ s.jsx("button", { className: z ? "selected" : "", onClick: () => o("/task-packages/import"), children: "接入归档成果" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => {
        Ae(null), Z((b) => b + 1);
      }, children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    (k == null ? void 0 : k.a_import_id) && /* @__PURE__ */ s.jsx("button", { className: "button primary", onClick: () => o("/imports/" + k.a_import_id), children: "接入与复盘状态" }),
    y && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      y
    ] }),
    le && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      le
    ] }),
    !D && /* @__PURE__ */ s.jsxs("div", { className: "package-filters", children: [
      /* @__PURE__ */ s.jsxs("label", { children: [
        "项目范围",
        /* @__PURE__ */ s.jsx("select", { "aria-label": "任务包项目", value: V, onChange: (b) => R(b.target.value), children: _.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.name }, b.id)) })
      ] }),
      !z && /* @__PURE__ */ s.jsxs("label", { children: [
        "接入状态",
        /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务包状态", value: Y, onChange: (b) => v(b.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
          ["received", "validating", "processing", "ready", "failed", "withdrawn"].map((b) => /* @__PURE__ */ s.jsx("option", { value: b, children: Bn[b] }, b))
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取任务包…" }) : z ? Oe ? Rt ? /* @__PURE__ */ s.jsxs("section", { className: "panel package-import", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "选择当前项目已归档成果" }),
        /* @__PURE__ */ s.jsx("span", { children: "自动接入已有记录和附件，无需重复填写" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "package-import-inner", children: [
        ue.filter((b) => b.project_id === V).map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            b.title,
            " · 第",
            b.version,
            "版"
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Ie(async () => {
            const ge = await Zt("/api/v1/platform-archives", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ delivery_id: b.id }) }), xe = await ge.json();
            if (!ge.ok) throw new Error(xe.message);
            o("/task-packages/" + xe.receipt_id);
          }), children: "接入此成果" })
        ] }, b.id)),
        !ue.some((b) => b.project_id === V) && /* @__PURE__ */ s.jsx("p", { children: "当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。" })
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
            /* @__PURE__ */ s.jsx("select", { "aria-label": "模拟任务场景", value: Re, onChange: (b) => Be(b.target.value), children: H.map((b) => /* @__PURE__ */ s.jsx("option", { value: b.id, children: b.label }, b.id)) })
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: "完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。" }),
          /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I, onClick: () => Le("demo-task-" + crypto.randomUUID().slice(0, 8)), children: "换一组新的模拟任务" }),
          /* @__PURE__ */ s.jsxs("label", { className: "package-file", children: [
            "或选择本地JSON任务包",
            /* @__PURE__ */ s.jsx("input", { type: "file", accept: ".json,application/json", disabled: I, onChange: (b) => {
              var xe;
              const ge = (xe = b.target.files) == null ? void 0 : xe[0];
              if (ge) {
                if (ge.size > 5242880) {
                  Q("文件超过5MiB上限。");
                  return;
                }
                ge.text().then((Ge) => {
                  We(Ge), oe(null), Q("");
                });
              }
            } })
          ] }),
          /* @__PURE__ */ s.jsxs("details", { children: [
            /* @__PURE__ */ s.jsx("summary", { children: "查看或调整原始任务包（开发用）" }),
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "任务包JSON", rows: 15, value: pe, onChange: (b) => {
              We(b.target.value), oe(null);
            }, spellCheck: !1 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "package-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I || !pe, onClick: () => void st(), children: "预检查" }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: I || !X, onClick: () => void at(), children: [
              /* @__PURE__ */ s.jsx(sm, { size: 16 }),
              I ? "正在处理…" : "确认接入归档成果"
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
          ((C = _.find((b) => b.id === X.project_id)) == null ? void 0 : C.name) || X.project_id
        ] }),
        /* @__PURE__ */ s.jsx("div", { children: Object.entries(X.counts).map(([b, ge]) => /* @__PURE__ */ s.jsxs("span", { children: [
          zu[b],
          " ",
          /* @__PURE__ */ s.jsx("strong", { children: ge })
        ] }, b)) }),
        /* @__PURE__ */ s.jsx("p", { children: X.note }),
        X.warnings.length > 0 && /* @__PURE__ */ s.jsx("p", { children: "检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。" })
      ] })
    ] }) : /* @__PURE__ */ s.jsx("section", { className: "panel empty", children: /* @__PURE__ */ s.jsx("h2", { children: "当前项目没有导入权限" }) }) : D ? k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
              Bn[k.status],
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
        ke && k.status === "ready" && k.is_current && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Ie(async () => {
          const b = await Zt("/api/v1/retrospectives", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}` }, body: JSON.stringify({ mode: "task_process", task_package_id: k.id }) }), ge = await b.json();
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
            Gn((P = k.task) == null ? void 0 : P.started_at),
            "　结束：",
            Gn((Ne = k.task) == null ? void 0 : Ne.completed_at)
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "参与人员：",
            ((Ue = k.participants) == null ? void 0 : Ue.map((b) => Ru(b.role) + "（" + b.actor_id + "）").join("、")) || "未提供"
          ] }),
          (lt = k.issues) == null ? void 0 : lt.map((b) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h3", { children: b.description }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "责任方：",
              b.responsible_actor_id || "未提供",
              "　期限：",
              Gn(b.due_at)
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
          /* @__PURE__ */ s.jsx("div", { className: "package-timeline", children: (ft = k.events) != null && ft.length ? k.events.map((b) => /* @__PURE__ */ s.jsxs("article", { children: [
            /* @__PURE__ */ s.jsx("time", { children: Gn(b.occurred_at) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: b.is_known ? um[b.event_type] || b.event_type : "未知事件 · " + b.event_type }),
              /* @__PURE__ */ s.jsx("p", { children: Qv(b.payload) }),
              b.related_object_id && /* @__PURE__ */ s.jsxs("p", { children: [
                "对应：",
                b.related_object_id === k.task_id ? "本次任务" : "问题 " + b.related_object_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Ru(b.actor.actor_role),
                " · ",
                b.actor.actor_id || "未提供人员"
              ] }),
              b.evidence_refs.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "package-event-evidence", children: [
                "关联证据：",
                b.evidence_refs.map((ge) => {
                  var Ge;
                  const xe = (Ge = k.attachments) == null ? void 0 : Ge.find((jt) => jt.attachment_id === ge);
                  return /* @__PURE__ */ s.jsxs("button", { className: "text-button", disabled: I || !xe || xe.state !== "verified", onClick: () => xe && void ve(xe), children: [
                    xe ? Au[xe.evidence_type] || "证据附件" : "证据缺失",
                    " · ",
                    ge
                  ] }, ge);
                })
              ] })
            ] })
          ] }, b.event_id)) : /* @__PURE__ */ s.jsx("p", { children: "没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。" }) }),
          k.event_next !== null && k.event_next !== void 0 && /* @__PURE__ */ s.jsx("button", { className: "button ghost package-more", disabled: I, onClick: () => void Ie(async () => {
            const b = await He("/" + D + "?event_after=" + k.event_next);
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
                Au[b.evidence_type] || "未知类型",
                " · ",
                b.attachment_id
              ] }),
              /* @__PURE__ */ s.jsxs("small", { children: [
                Bn[b.state],
                " · ",
                b.size,
                " 字节 · 关联",
                b.event_ids.length,
                "个事件"
              ] }),
              b.error && /* @__PURE__ */ s.jsx("p", { children: b.error })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: I || b.state !== "verified", onClick: () => void ve(b), children: "打开附件" })
          ] }, b.attachment_id)) : /* @__PURE__ */ s.jsx("p", { className: "package-pad", children: "未提供附件，不能据此声称证据完整。" }),
          re && /* @__PURE__ */ s.jsxs("div", { className: "package-opened", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => Ae(null), children: "关闭预览" }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              "证据附件 · ",
              re.id
            ] }),
            re.url && /* @__PURE__ */ s.jsx("img", { src: re.url, alt: "任务证据附件" }),
            re.text && /* @__PURE__ */ s.jsx("pre", { children: re.text })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel package-history", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "版本与变化" }),
          /* @__PURE__ */ s.jsx("div", { className: "package-version-links", children: (de = k.versions) == null ? void 0 : de.map((b) => /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: b.id === k.id, onClick: () => o("/task-packages/" + b.id), children: [
            "第",
            b.package_version,
            "版 · ",
            Bn[b.state],
            b.is_current ? " · 当前使用" : ""
          ] }, b.id)) }),
          (te = k.diff) != null && te.previous_version ? /* @__PURE__ */ s.jsxs("p", { children: [
            "与上一可查看版本（第",
            k.diff.previous_version,
            "版）比较："
          ] }) : /* @__PURE__ */ s.jsx("p", { children: "暂无更早可查看版本。" }),
          (Ye = k.diff) == null ? void 0 : Ye.changes.map((b, ge) => {
            var xe, Ge, jt, T, j;
            return /* @__PURE__ */ s.jsxs("details", { children: [
              /* @__PURE__ */ s.jsxs("summary", { children: [
                zu[b.section] || b.section,
                "有变化"
              ] }),
              "before" in b ? /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "上一版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ba(b.before) })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                  /* @__PURE__ */ s.jsx("pre", { children: Ba(b.after) })
                ] })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "新增：",
                  ((xe = b.added) == null ? void 0 : xe.join("、")) || "无",
                  "；移除：",
                  ((Ge = b.removed) == null ? void 0 : Ge.join("、")) || "无"
                ] }),
                b.order_changed && /* @__PURE__ */ s.jsxs("p", { children: [
                  "来源记录顺序有变化：",
                  (jt = b.before_order) == null ? void 0 : jt.join(" → "),
                  "　调整为　",
                  (T = b.after_order) == null ? void 0 : T.join(" → ")
                ] }),
                (j = b.changed) == null ? void 0 : j.map((ce) => /* @__PURE__ */ s.jsxs("div", { className: "package-diff", children: [
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      ce.id,
                      " · 上一版"
                    ] }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ba(ce.before) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { children: [
                    /* @__PURE__ */ s.jsx("strong", { children: "本版" }),
                    /* @__PURE__ */ s.jsx("pre", { children: Ba(ce.after) })
                  ] })
                ] }, ce.id))
              ] })
            ] }, ge);
          })
        ] }),
        (De || ke && k.status === "failed") && /* @__PURE__ */ s.jsxs("section", { className: "panel package-controls", children: [
          ke && k.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: I, onClick: () => void Ie(async () => {
            const b = await Zt("/api/v1/jobs/" + k.job_id + "/retry", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${u}`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: k.job_row_version }) });
            if (!b.ok) throw new Error((await b.json()).message);
            Ce("已提交重试，已保存事件与附件不会重复新增。"), Z((ge) => ge + 1);
          }), children: "重试接入" }),
          De && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "撤回原因",
              /* @__PURE__ */ s.jsx("input", { value: W, maxLength: 2e3, onChange: (b) => we(b.target.value), placeholder: "请填写撤回原因" })
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost danger", disabled: I || !W.trim(), onClick: () => void Ie(async () => {
              var xe;
              const b = JSON.stringify({ reason: W }), ge = k.id + b;
              ((xe = it.current) == null ? void 0 : xe.body) !== ge && (it.current = { body: ge, key: crypto.randomUUID() }), await He("/" + k.id + "/withdraw", { method: "POST", headers: { "Idempotency-Key": it.current.key }, body: b }), Ae(null), Z((Ge) => Ge + 1);
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
          /* @__PURE__ */ s.jsx("td", { children: Bn[b.status] }),
          /* @__PURE__ */ s.jsx("td", { children: b.is_current ? /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: "当前使用" }) : b.current_package_id ? "其他版本" : "暂无可用包" }),
          /* @__PURE__ */ s.jsx("td", { children: b.status === "withdrawn" ? "正文与附件已停止使用" : b.missing_fields.length ? `${b.missing_fields.length} 项资料限制` : b.status === "ready" ? "暂未发现缺失" : "等待校验结果" })
        ] }, b.id)) })
      ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
        /* @__PURE__ */ s.jsx(Mf, { size: 35 }),
        /* @__PURE__ */ s.jsx("h2", { children: "暂无任务包" }),
        /* @__PURE__ */ s.jsx("p", { children: "接入归档成果，即可查看任务过程、附件校验和版本变化。" })
      ] }),
      ct
    ] })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
    /* @__PURE__ */ s.jsx("h2", { children: "当前没有可用项目" }),
    /* @__PURE__ */ s.jsx("p", { children: "请刷新以重新加载授权范围，或核对当前身份权限。" })
  ] });
}
async function om(u, h, _, o) {
  const z = await u(h, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(_) });
  o();
  const D = Date.now() + 1200 * 1e3;
  for (; Date.now() < D; ) {
    const V = await u("/model-generation-jobs/" + z.job_id);
    if (V.status === "succeeded") return V.result;
    if (V.status === "failed") throw new Error(V.error || "后台生成失败，请从任务工作台查看或重试。");
    await new Promise((R) => setTimeout(R, 2e3));
  }
  throw new Error("任务仍在后台处理，请从任务工作台查看进度；无需重复提交。");
}
const Ln = { draft: "草稿", pending_review: "待审核", approved: "已批准", changes_requested: "已退回", submitted: "提交审核", edited: "人工修订" }, Vv = { fact: "事实记录", inference: "记录对照 / 推断", suggestion: "改进建议" }, Jv = { task_started: "任务开始", inspection_recorded: "检查记录", issue_created: "提出问题", rectification_submitted: "整改提交", review_rejected: "复核退回", review_accepted: "复核通过", task_completed: "任务结束" }, sc = (u) => u ? new Date(u).toLocaleString("zh-CN", { hour12: !1 }) : "实际时间未知";
function Kv({ api: u, path: h, navigate: _, projects: o, identity: z }) {
  var ft;
  const D = h.split("/")[2], V = h.endsWith("/review"), [R, Y] = r.useState([]), [v, M] = r.useState(null), [K, k] = r.useState(null), [se, me] = r.useState(!1), [ye, _e] = r.useState(!0), [Ee, he] = r.useState(""), [F, ue] = r.useState(""), [ne, H] = r.useState(0), [je, Re] = r.useState("llm"), [Be, Qe] = r.useState("task_process"), [Le, pe] = r.useState(((ft = o.find((L) => Mt(L, "retrospective.generate"))) == null ? void 0 : ft.id) || ""), [We, X] = r.useState([]), [oe, y] = r.useState(""), [Q, le] = r.useState([]), [Ce, m] = r.useState([]), [B, I] = r.useState(""), [ae, ie] = r.useState(!1), [Z, W] = r.useState(""), [we, re] = r.useState(""), [Ae, et] = r.useState(""), [it, Fe] = r.useState(null), [Ke, Oe] = r.useState([]), [De, ke] = r.useState(null), [He, Ie] = r.useState(""), [st, at] = r.useState(""), ve = o.some((L) => Mt(L, "retrospective.generate")), ct = !!(v != null && v.is_current) && !!Mt(o.find((L) => L.id === v.project_id), "retrospective.edit"), qe = !!(v != null && v.is_current) && !!Mt(o.find((L) => L.id === v.project_id), "retrospective.review");
  r.useEffect(() => {
    W(""), I(""), ie(!1), he(""), ue(""), et(""), Oe([]), ke(null);
  }, [h]), r.useEffect(() => {
    let L = !1;
    return _e(!0), M(null), he(""), (async () => {
      try {
        if (D) {
          const te = await u(`/retrospectives/${D}${Z ? "?revision_id=" + Z : ""}`);
          L || (M(te), k({ summary: te.summary, findings: structuredClone(te.findings), suggestions: structuredClone(te.suggestions) }), ie(!1));
        } else {
          const te = await u(`/retrospectives?limit=20${we ? "&state=" + we : ""}${Ae ? "&cursor=" + encodeURIComponent(Ae) : ""}`);
          L || (Y(te.items), Fe(te.next_cursor));
        }
      } catch (te) {
        L || he(te.message);
      } finally {
        L || _e(!1);
      }
    })(), () => {
      L = !0;
    };
  }, [D, h, Z, we, Ae, ne]), r.useEffect(() => {
    if (D || !Le || !ve) return;
    let L = !1;
    return m([]), X([]), le([]), y(""), (async () => {
      var te;
      try {
        const [Ye, b] = await Promise.all([u(`/task-packages?project_id=${Le}&state=ready&limit=100`), u(`/knowledge/source-options?project_id=${Le}&limit=100`)]);
        if (L) return;
        const ge = Ye.items.filter((xe) => xe.is_current);
        X(ge), y(((te = ge[0]) == null ? void 0 : te.id) || ""), le(b.items);
      } catch (Ye) {
        L || he(Ye.message);
      }
    })(), () => {
      L = !0;
    };
  }, [D, Le, ne]), r.useEffect(() => {
    if (!(De != null && De.asset_id) || De.type !== "task_attachment") {
      Ie(""), at("");
      return;
    }
    let L = !1, de = "";
    return Zt("/api/v1/assets/" + De.asset_id + "/content", { headers: { Authorization: "Bearer dev-" + z } }).then(async (te) => {
      if (!te.ok) {
        const b = await te.json();
        throw new Error(b.message);
      }
      const Ye = await te.blob();
      !L && /^(image\/|text\/plain)/.test(Ye.type) && (de = URL.createObjectURL(Ye), Ie(de), at(Ye.type));
    }).catch((te) => {
      L || he(te.message);
    }), () => {
      L = !0, de && URL.revokeObjectURL(de), Ie("");
    };
  }, [De, z]);
  const C = async (L) => {
    me(!0), he(""), ue("");
    try {
      await L();
    } catch (de) {
      he(de.message);
    } finally {
      me(!1);
    }
  }, w = () => ({ revision_id: v.revision_id, row_version: v.row_version, reason: B, evidence_checked: ae }), P = !!v && !!K && JSON.stringify(K) === JSON.stringify({ summary: v.summary, findings: v.findings, suggestions: v.suggestions }), Ne = (L) => void C(async () => {
    const de = L === "submit" ? `/retrospectives/${D}/submit-review` : `/reviews/${v.revision_id}/${L}`;
    await u(de, { method: "POST", body: JSON.stringify(w()) }), ue("已保存本版本的审核状态与意见。"), H((te) => te + 1);
  }), Ue = (L, de) => L.map((te, Ye) => /* @__PURE__ */ s.jsxs("article", { className: "retro-finding " + te.claim_kind, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "retro-finding-title", children: [
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: Vv[te.claim_kind] }),
      te.record_status && /* @__PURE__ */ s.jsx("strong", { children: te.record_status }),
      /* @__PURE__ */ s.jsx("small", { children: te.review_state === "confirmed" ? "已逐项确认" : "待确认" })
    ] }),
    V && ct ? /* @__PURE__ */ s.jsxs("label", { children: [
      "条目内容",
      /* @__PURE__ */ s.jsx("textarea", { "aria-label": "修改" + te.id, value: te.text, onChange: (b) => k((ge) => ge && { ...ge, [de]: ge[de].map((xe, Ge) => Ge === Ye ? { ...xe, text: b.target.value, review_state: "unconfirmed" } : xe) }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { children: te.text }),
    /* @__PURE__ */ s.jsx("div", { className: "retro-evidence-links", children: te.evidence_refs.map((b, ge) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => ke(v.evidence.find((xe) => xe.id === b) || null), children: [
      "查看证据 ",
      ge + 1
    ] }, b)) }),
    V && ct && /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
      /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: te.review_state === "confirmed", onChange: (b) => k((ge) => ge && { ...ge, [de]: ge[de].map((xe, Ge) => Ge === Ye ? { ...xe, review_state: b.target.checked ? "confirmed" : "unconfirmed" } : xe) }) }),
      "已核对此条内容与来源"
    ] })
  ] }, te.id)), lt = (L) => L.map((de) => /* @__PURE__ */ s.jsxs("li", { children: [
    /* @__PURE__ */ s.jsx("time", { children: sc(de.occurred_at) }),
    /* @__PURE__ */ s.jsx("strong", { children: Jv[de.event_type] || "未知事件类型：" + de.event_type }),
    /* @__PURE__ */ s.jsx("p", { children: typeof de.payload.note == "string" ? de.payload.note : Object.keys(de.payload).length ? JSON.stringify(de.payload) : "未补充说明" }),
    /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => ke(v.evidence.find((te) => te.reference === "event:" + de.event_id) || null), children: "打开事件记录" }),
    de.evidence_refs.map((te) => /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => {
      const Ye = v.evidence.find((b) => b.reference === "attachment:" + te);
      Ye ? ke(Ye) : he("该事件的附件未通过校验或暂不可用。");
    }, children: [
      "附件 ",
      te
    ] }, te))
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
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      Ee,
      /* @__PURE__ */ s.jsx("button", { onClick: () => H((L) => L + 1), children: "重新加载" })
    ] }),
    F && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      F
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/retrospectives"), children: "复盘清单" }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => H((L) => L + 1), disabled: se, children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ye ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取固定来源与复盘版本…" }) : D ? v && K ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("div", { className: "knowledge-heading", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h2", { children: v.title }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            v.version,
            " · ",
            Ln[v.state],
            " · ",
            v.mode === "task_process" ? "任务过程" : "历史案例",
            " · 模板 ",
            v.template_version
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ s.jsx("select", { "aria-label": "选择复盘版本", value: v.revision_id, onChange: (L) => W(L.target.value), children: v.revisions.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
            "v",
            L.version,
            " · ",
            Ln[L.state]
          ] }, L.id)) }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => _(`/retrospectives/${D}${V ? "" : "/review"}`), children: V ? "查看实际过程" : "核查与审核" })
        ] })
      ] }),
      !v.is_current && /* @__PURE__ */ s.jsx("div", { className: "feedback error", children: "正在查看历史版本；内容和原审核结论保留，只能对当前版本操作。" }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "事实摘要" }),
          /* @__PURE__ */ s.jsx("span", { children: "自动带入，保存修改会产生新版本" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          V && ct ? /* @__PURE__ */ s.jsxs("label", { children: [
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
            v.timeline.known.length ? /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline", children: lt(v.timeline.known) }) : /* @__PURE__ */ s.jsx("p", { children: "未发现可排序的过程记录。" }),
            v.timeline.unknown_time.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "时间未知的记录" }),
              /* @__PURE__ */ s.jsx("ol", { className: "retro-timeline unknown", children: lt(v.timeline.unknown_time) })
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
              /* @__PURE__ */ s.jsx("p", { children: L.reason || `明确期限 ${sc(L.due_at || null)}；复核记录 ${sc(L.accepted_at || null)}；晚于期限 ${L.late_seconds / 60} 分钟。` })
            ] }, L.issue_id)) : /* @__PURE__ */ s.jsx("p", { children: "未提供适用的期限与过程记录，不判超期。" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "事实与记录对照" }),
            /* @__PURE__ */ s.jsx("span", { children: "每项均可回到固定版本证据" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
            Ue(K.findings, "findings"),
            /* @__PURE__ */ s.jsx("h3", { children: "建议流程与培训启示" }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "本地模板建议，未经模型推理；不能当作已发生事实。" }),
            Ue(K.suggestions, "suggestions")
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
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "复盘审核说明", value: B, onChange: (L) => I(L.target.value) })
          ] }),
          ct && /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: se || P || !B.trim(), onClick: () => void C(async () => {
              await u(`/retrospectives/${D}/draft`, { method: "PATCH", body: JSON.stringify({ ...w(), ...K }) }), ue("已保存新草稿版本，旧内容及审核意见保留。"), H((L) => L + 1);
            }), children: "保存修订版本" }),
            ["draft", "changes_requested"].includes(v.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !P || !B.trim(), onClick: () => Ne("submit"), children: "提交当前版本审核" })
          ] }),
          qe && v.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ae, onChange: (L) => ie(L.target.checked) }),
              "已逐条核对事实、推断、建议与来源证据"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !ae || !P || !B.trim(), onClick: () => Ne("approve"), children: "批准此复盘版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: se || !P || !B.trim(), onClick: () => Ne("request-changes"), children: "退回修改" })
            ] })
          ] }),
          ct && v.state === "approved" && /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || !P || !B.trim(), onClick: () => void C(async () => {
            const L = await u(`/retrospectives/${D}/publish-experiences`, { method: "POST", body: JSON.stringify({ ...w(), type: "case_card" }) });
            ue(L.replayed ? "已存在相同版本的经验草稿，无重复创建。" : "已生成经验草稿，尚未发布；请继续知识审核。"), H((de) => de + 1);
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
            Ln[L.action] || L.action
          ] }),
          /* @__PURE__ */ s.jsx("p", { children: L.reason }),
          /* @__PURE__ */ s.jsx("small", { children: sc(L.created_at) })
        ] }, de))
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘生成方式", value: je, onChange: (L) => Re(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型（引用来源，人工审核）" }),
                /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "复盘模式",
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘模式", value: Be, onChange: (L) => Qe(L.target.value), children: [
                /* @__PURE__ */ s.jsx("option", { value: "task_process", children: "任务过程复盘" }),
                /* @__PURE__ */ s.jsx("option", { value: "historical_case", children: "历史案例复盘" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘项目", value: Le, onChange: (L) => pe(L.target.value), children: o.filter((L) => Mt(L, "retrospective.generate")).map((L) => /* @__PURE__ */ s.jsx("option", { value: L.id, children: L.name }, L.id)) })
            ] })
          ] }),
          Be === "task_process" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "已就绪的当前任务包",
            /* @__PURE__ */ s.jsx("select", { "aria-label": "复盘任务包", value: oe, onChange: (L) => y(L.target.value), children: We.map((L) => /* @__PURE__ */ s.jsxs("option", { value: L.id, children: [
              L.name,
              " · 包v",
              L.package_version
            ] }, L.id)) }),
            !We.length && /* @__PURE__ */ s.jsx("p", { children: "暂无可用成果，请先到成果接入页面接入已归档版本。" })
          ] }) : /* @__PURE__ */ s.jsx("div", { className: "source-options", children: Q.map((L) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: Ce.includes(L.record_version_id), onChange: (de) => m(de.target.checked ? [...Ce, L.record_version_id] : Ce.filter((te) => te !== L.record_version_id)) }),
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
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: se || (Be === "task_process" ? !oe : !Ce.length || Ce.length > 20), onClick: () => void C(async () => {
              const L = await om(u, "/retrospective-generation-jobs", { mode: Be, generation_mode: je, task_package_id: Be === "task_process" ? oe : null, record_version_ids: Be === "historical_case" ? Ce : [], template_version: "process-review-v1" }, () => ue("已提交后台复盘，关闭页面不影响任务；可在任务工作台查看进度。"));
              _("/retrospectives/" + L.id);
            }), children: "生成复盘草稿" }),
            /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => _("/task-packages"), children: "查看归档成果" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "复盘清单" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "复盘状态", value: we, onChange: (L) => {
            re(L.target.value), et(""), Oe([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved"].map((L) => /* @__PURE__ */ s.jsx("option", { value: L, children: Ln[L] }, L))
          ] })
        ] }),
        R.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "复盘 / 模式" }),
            /* @__PURE__ */ s.jsx("th", { children: "固定来源" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本与状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: R.map((L) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              L.title,
              /* @__PURE__ */ s.jsx("small", { children: L.mode === "task_process" ? "任务过程复盘" : "历史案例复盘" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: L.sources.task_package_id ? "任务包 v" + L.sources.package_version : L.sources.record_version_ids.length + "条历史来源" }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              L.version,
              " · ",
              Ln[L.state]
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
            /* @__PURE__ */ s.jsx("button", { disabled: !Ke.length, onClick: () => {
              et(Ke.at(-1) || ""), Oe(Ke.slice(0, -1));
            }, children: "上一页" }),
            /* @__PURE__ */ s.jsx("button", { disabled: !it, onClick: () => {
              Oe([...Ke, Ae]), et(it || "");
            }, children: "下一页" })
          ] })
        ] })
      ] })
    ] }),
    De && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ s.jsxs("section", { className: "modal retro-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "retro-evidence", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "retro-evidence", children: "固定版本证据" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭证据", onClick: () => ke(null), children: /* @__PURE__ */ s.jsx(ac, { size: 19 }) })
      ] }),
      /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: De.type === "process_event" ? "实际事件记录" : De.type === "task_attachment" ? "任务附件" : De.type === "historical_row" ? "固定历史来源行" : "任务快照" }),
      /* @__PURE__ */ s.jsx("p", { children: De.text }),
      /* @__PURE__ */ s.jsxs("p", { className: "retro-hash", children: [
        "定位：",
        JSON.stringify(De.locator)
      ] }),
      He && st.startsWith("image/") && /* @__PURE__ */ s.jsx("img", { src: He, alt: "来源证据" }),
      He && st.startsWith("text/") && /* @__PURE__ */ s.jsx("iframe", { title: "作业日志", src: He }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "证据来自固定来源版本；缺失信息需人工核查。" })
    ] }) })
  ] });
}
const Bs = { draft: "草稿", pending_review: "待审核", changes_requested: "已退回", approved: "已审核", published: "已发布", in_progress: "作答中", submitted: "已提交", not_submitted: "未提交", pending_scoring: "待评分", awaiting_review: "待教员复核", confirmed: "评分已确认", edited: "人工修订" }, qa = { single_choice: "单选题", multiple_choice: "多选题", case_answer: "案例问答" }, Kf = { selected: [], text: "", row_version: 0 };
function $v({ api: u, path: h, navigate: _, projects: o }) {
  var Se, nt, pt;
  const z = h.startsWith("/learn"), D = /^\/training\/results\/[^/]+$/.test(h), V = h.startsWith("/learn/attempts/") || D ? h.split("/")[3] : "", R = /^\/training\/questions\/[^/]+$/.test(h), Y = R ? h.split("/")[3] : "", v = h === "/training/questions", M = h === "/training/packages", K = h === "/training/results", k = o.some((x) => Mt(x, "training.manage")), se = o.some((x) => Mt(x, "training.review")), [me, ye] = r.useState("llm"), [_e, Ee] = r.useState(""), [he, F] = r.useState(((Se = o.find((x) => Mt(x, "training.manage"))) == null ? void 0 : Se.id) || ((nt = o[0]) == null ? void 0 : nt.id) || ""), [ue, ne] = r.useState([]), [H, je] = r.useState([]), [Re, Be] = r.useState([]), [Qe, Le] = r.useState([]), [pe, We] = r.useState(null), [X, oe] = r.useState(null), [y, Q] = r.useState(""), [le, Ce] = r.useState(!1), [m, B] = r.useState([]), [I, ae] = r.useState(["single_choice", "case_answer"]), [ie, Z] = r.useState([]), [W, we] = r.useState("新人风险识别与复盘练习"), [re, Ae] = r.useState("learning-" + Date.now()), [et, it] = r.useState(1), [Fe, Ke] = r.useState(null), [Oe, De] = r.useState({}), [ke, He] = r.useState(null), [Ie, st] = r.useState("rules"), [at, ve] = r.useState("useful"), [ct, qe] = r.useState(""), [C, w] = r.useState({}), [P, Ne] = r.useState({}), [Ue, lt] = r.useState(""), [ft, L] = r.useState(""), [de, te] = r.useState(null), [Ye, b] = r.useState([]), [ge, xe] = r.useState(!0), [Ge, jt] = r.useState(!1), [T, j] = r.useState(""), [ce, be] = r.useState(""), [rt, N] = r.useState(0);
  r.useEffect(() => {
    L(""), b([]), Q(""), Ce(!1), be(""), j(""), Z([]);
  }, [h]), r.useEffect(() => {
    let x = !1;
    return xe(!0), j(""), We(null), Ke(null), He(null), (async () => {
      try {
        if (V)
          if (D) {
            const ze = await u(`/training/attempts/${V}/result?teacher=true`);
            x || He(ze);
          } else {
            const ze = await u("/training/attempts/" + V);
            if (x) return;
            if (Ke(ze), De(Object.fromEntries(ze.saved_answers.map((tt) => [tt.question_revision_id, { ...tt.answer, row_version: tt.row_version }]))), ze.state === "submitted") {
              const tt = await u(`/training/attempts/${V}/result`);
              x || He(tt);
            }
          }
        else if (R) {
          const ze = await u("/training/questions/" + Y);
          x || (We(ze), oe(structuredClone(ze.content)));
        } else if (z) {
          const [ze, tt] = await Promise.all([u("/training/packages?learner=true&limit=100"), u("/training/attempts?limit=100")]);
          x || (je(ze.items), Le(tt.items));
        } else if (K) {
          const ze = await u(`/training/results?limit=20${ft ? "&cursor=" + ft : ""}`);
          x || (Le(ze.items), te(ze.next_cursor));
        } else if (M) {
          const [ze, tt] = await Promise.all([u(`/training/packages?limit=20${ft ? "&cursor=" + ft : ""}`), u("/training/questions?state=approved&limit=100")]);
          x || (je(ze.items), ne(tt.items), te(ze.next_cursor));
        } else {
          const [ze, tt] = await Promise.all([u(`/training/questions?limit=20${Ue ? "&state=" + Ue : ""}${ft ? "&cursor=" + ft : ""}`), u("/knowledge/library?limit=100&project_id=" + he)]);
          x || (ne(ze.items), Be(tt.items), te(ze.next_cursor));
        }
      } catch (ze) {
        x || j(ze.message);
      } finally {
        x || xe(!1);
      }
    })(), () => {
      x = !0;
    };
  }, [h, he, Ue, ft, rt]), r.useEffect(() => {
    if (!(ke != null && ke.grading_job) || !["queued", "running", "retrying"].includes(ke.grading_job.status)) return;
    const x = window.setTimeout(() => N((Te) => Te + 1), 1800);
    return () => clearTimeout(x);
  }, [(pt = ke == null ? void 0 : ke.grading_job) == null ? void 0 : pt.status, rt]);
  const fe = async (x) => {
    jt(!0), j(""), be("");
    try {
      await x();
    } catch (Te) {
      j(Te.message);
    } finally {
      jt(!1);
    }
  }, Ze = !!pe && !!X && JSON.stringify(X) === JSON.stringify(pe.content), kt = () => ({ revision_id: pe.revision_id, row_version: pe.row_version, reason: y, evidence_checked: le }), Yt = (x) => void fe(async () => {
    await u(x === "submit" ? `/training/questions/${Y}/submit-review` : `/reviews/${pe.revision_id}/${x}`, { method: "POST", body: JSON.stringify(kt()) }), be("题目审核状态已保存到统一审核记录。"), N((Te) => Te + 1);
  }), qt = async (x) => {
    const Te = Oe[x.revision_id] || Kf, ze = await u(`/training/attempts/${V}/answers/${x.question_id}`, { method: "PUT", body: JSON.stringify(Te) });
    return De((tt) => ({ ...tt, [x.revision_id]: { ...Te, row_version: ze.row_version } })), ze;
  }, ut = /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
    /* @__PURE__ */ s.jsx("span", { children: "只显示当前授权范围；题库每页20项" }),
    /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
      /* @__PURE__ */ s.jsx("button", { disabled: !Ye.length, onClick: () => {
        L(Ye.at(-1) || ""), b(Ye.slice(0, -1));
      }, children: "上一页" }),
      /* @__PURE__ */ s.jsx("button", { disabled: !de, onClick: () => {
        b([...Ye, ft]), L(de || "");
      }, children: "下一页" })
    ] })
  ] }), Nt = (x, Te, ze) => ze ? [...x, Te] : x.filter((tt) => tt !== Te), g = (x) => void fe(async () => {
    const Te = await u("/training/attempts", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ package_version_id: x.id, grading_mode: Ie }) });
    _("/learn/attempts/" + Te.id);
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(rc, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: z ? "新人学习与练习" : "培训题库与学习记录" }),
        /* @__PURE__ */ s.jsx("span", { children: "题目固定审核来源版本，开放题建议分仍需教员复核。学习记录保留原题版本；来源受限时隐藏正文。" })
      ] })
    ] }),
    T && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      T
    ] }),
    ce && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
      ce
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        !z && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("button", { className: v || R ? "selected" : "", onClick: () => _("/training/questions"), children: "题库与审核" }),
          k && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("button", { className: M ? "selected" : "", onClick: () => _("/training/packages"), children: "学习包" }),
            /* @__PURE__ */ s.jsx("button", { className: K || D ? "selected" : "", onClick: () => _("/training/results"), children: "学习结果" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: z ? "selected" : "", onClick: () => _("/learn"), children: "我的学习" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => N((x) => x + 1), children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    ge ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取培训资料与版本…" }) : ke ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "本次学习结果" }),
          /* @__PURE__ */ s.jsx("span", { children: Bs[ke.result_state] })
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
            D && k && ke.grading_job.status === "failed" && ke.content_available && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void fe(async () => {
              await u("/jobs/" + ke.grading_job.id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: ke.grading_job.row_version }) }), N((x) => x + 1);
            }), children: "按当前模型配置重试未完成评分" })
          ] }),
          ke.restriction_note && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: ke.restriction_note }),
          ke.answers.map((x, Te) => {
            var ze, tt, Vt, Ns, us, At, fl, Ks;
            return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
              /* @__PURE__ */ s.jsxs("h3", { children: [
                "第",
                Te + 1,
                "题 ",
                x.type ? qa[x.type] : ""
              ] }),
              x.content_available && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: x.stem }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "我的作答：",
                  ((ze = x.answer) == null ? void 0 : ze.text) || ((tt = x.answer) == null ? void 0 : tt.selected.join("、")) || "空白"
                ] }),
                /* @__PURE__ */ s.jsxs("p", { children: [
                  "参考答案：",
                  ((Vt = x.reference_answer) == null ? void 0 : Vt.text) || ((us = (Ns = x.reference_answer) == null ? void 0 : Ns.selected) == null ? void 0 : us.join("、"))
                ] }),
                (At = x.rubric) == null ? void 0 : At.map((f, G) => /* @__PURE__ */ s.jsxs("p", { className: "training-muted", children: [
                  "评分要点：",
                  f.point,
                  " · ",
                  f.points,
                  "分"
                ] }, G)),
                /* @__PURE__ */ s.jsx("p", { children: (fl = x.feedback) == null ? void 0 : fl.message }),
                ((Ks = x.feedback) == null ? void 0 : Ks.human_review_reason) && /* @__PURE__ */ s.jsxs("p", { children: [
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
              D && k && x.content_available && /* @__PURE__ */ s.jsxs("div", { className: "score-review", children: [
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "确认分数（0—100）",
                  /* @__PURE__ */ s.jsx("input", { type: "number", min: 0, max: 100, value: C[x.id] ?? String(x.confirmed_score ?? x.suggested_score ?? ""), onChange: (f) => w({ ...C, [x.id]: f.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsxs("label", { children: [
                  "评分复核原因",
                  /* @__PURE__ */ s.jsx("textarea", { value: P[x.id] || "", onChange: (f) => Ne({ ...P, [x.id]: f.target.value }) })
                ] }),
                /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge || !(P[x.id] || "").trim() || (C[x.id] ?? String(x.confirmed_score ?? x.suggested_score ?? "")) === "", onClick: () => void fe(async () => {
                  await u("/training/answers/" + x.id + "/review-score", { method: "POST", body: JSON.stringify({ row_version: x.row_version, score: Number(C[x.id] ?? x.confirmed_score ?? x.suggested_score), reason: P[x.id] }) }), be("人工确认分已保存，原建议分和复核轨迹保留。"), N((f) => f + 1);
                }), children: "保存人工确认分" })
              ] })
            ] }, x.id);
          })
        ] })
      ] }),
      !D && ke.content_available && /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "题目与解释反馈" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "学习反馈", value: at, onChange: (x) => ve(x.target.value), children: [
            /* @__PURE__ */ s.jsx("option", { value: "useful", children: "有帮助" }),
            /* @__PURE__ */ s.jsx("option", { value: "unclear", children: "表述不清" }),
            /* @__PURE__ */ s.jsx("option", { value: "incorrect", children: "需要核查" })
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "补充说明",
            /* @__PURE__ */ s.jsx("textarea", { value: ct, onChange: (x) => qe(x.target.value) })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void fe(async () => {
            await u(`/training/attempts/${V}/feedback`, { method: "POST", body: JSON.stringify({ rating: at, comment: ct }) }), be("学习反馈已保存。");
          }), children: "提交反馈" })
        ] })
      ] })
    ] }) : Fe ? /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ s.jsxs("h2", { children: [
          Fe.package_title,
          " · v",
          Fe.package_version
        ] }),
        /* @__PURE__ */ s.jsx("span", { children: "保存后可刷新恢复；提交后锁定本次作答" })
      ] }),
      Fe.questions.map((x) => {
        const Te = Oe[x.revision_id] || Kf;
        return /* @__PURE__ */ s.jsxs("article", { className: "training-question", children: [
          /* @__PURE__ */ s.jsxs("h3", { children: [
            "第",
            x.position,
            "题 · ",
            qa[x.type],
            " · ",
            x.max_score,
            "分"
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "question-stem", children: x.stem }),
          x.type === "case_answer" ? /* @__PURE__ */ s.jsxs("label", { children: [
            "我的回答",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "第" + x.position + "题回答", value: Te.text, onChange: (ze) => De({ ...Oe, [x.revision_id]: { ...Te, text: ze.target.value } }) })
          ] }) : x.options.map((ze) => /* @__PURE__ */ s.jsxs("label", { className: "training-option", children: [
            /* @__PURE__ */ s.jsx("input", { type: x.type === "single_choice" ? "radio" : "checkbox", name: x.revision_id, checked: Te.selected.includes(ze.id), onChange: (tt) => De({ ...Oe, [x.revision_id]: { ...Te, selected: x.type === "single_choice" ? [ze.id] : Nt(Te.selected, ze.id, tt.target.checked) } }) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              ze.id.toUpperCase(),
              " · ",
              ze.text
            ] })
          ] }, ze.id)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void fe(async () => {
              await qt(x), be("第" + x.position + "题已保存到服务端。");
            }), children: "保存本题作答" }),
            /* @__PURE__ */ s.jsxs("span", { className: "training-muted", children: [
              "已保存版本 ",
              Te.row_version
            ] })
          ] })
        ] }, x.revision_id);
      }),
      /* @__PURE__ */ s.jsx("div", { className: "proof-body", children: /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge, onClick: () => void fe(async () => {
        for (const x of Fe.questions) await qt(x);
        await u(`/training/attempts/${V}/submit`, { method: "POST" }), N((x) => x + 1), be("作答已提交，评分结果如下。");
      }), children: "保存全部并提交" }) })
    ] }) : R && pe && X ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsxs("h2", { children: [
            qa[pe.type],
            " · v",
            pe.version,
            " · ",
            Bs[pe.state]
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: pe.model_ref })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "题面",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题面", value: X.stem, disabled: !k, onChange: (x) => oe({ ...X, stem: x.target.value }) })
          ] }),
          X.options.map((x, Te) => {
            var ze;
            return /* @__PURE__ */ s.jsxs("label", { children: [
              "选项 ",
              x.id.toUpperCase(),
              /* @__PURE__ */ s.jsx("input", { value: x.text, disabled: !k, onChange: (tt) => oe({ ...X, options: X.options.map((Vt, Ns) => Ns === Te ? { ...Vt, text: tt.target.value } : Vt) }) }),
              /* @__PURE__ */ s.jsxs("span", { className: "check-label", children: [
                /* @__PURE__ */ s.jsx("input", { type: "checkbox", disabled: !k, checked: ((ze = X.answer.selected) == null ? void 0 : ze.includes(x.id)) || !1, onChange: (tt) => oe({ ...X, answer: { selected: Nt(X.answer.selected || [], x.id, tt.target.checked) } }) }),
                "此项为正确答案"
              ] })
            ] }, x.id);
          }),
          pe.type === "case_answer" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { children: [
              "参考回答",
              /* @__PURE__ */ s.jsx("textarea", { value: X.answer.text || "", disabled: !k, onChange: (x) => oe({ ...X, answer: { text: x.target.value } }) })
            ] }),
            X.rubric.map((x, Te) => /* @__PURE__ */ s.jsxs("div", { className: "rubric-edit", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "评分要点",
                /* @__PURE__ */ s.jsx("textarea", { value: x.point, disabled: !k, onChange: (ze) => oe({ ...X, rubric: X.rubric.map((tt, Vt) => Vt === Te ? { ...tt, point: ze.target.value } : tt) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "匹配词（用逗号分隔，仅规则建议评分使用）",
                /* @__PURE__ */ s.jsx("input", { value: x.keywords.join("，"), disabled: !k, onChange: (ze) => oe({ ...X, rubric: X.rubric.map((tt, Vt) => Vt === Te ? { ...tt, keywords: ze.target.value.split(/[,，]/).filter(Boolean) } : tt) }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "分值",
                /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, max: 100, value: x.points, disabled: !k, onChange: (ze) => oe({ ...X, rubric: X.rubric.map((tt, Vt) => Vt === Te ? { ...tt, points: Number(ze.target.value) } : tt) }) })
              ] })
            ] }, Te))
          ] }),
          /* @__PURE__ */ s.jsx("h3", { children: "固定审核来源" }),
          pe.source_versions.map((x) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsx("code", { children: x }) }, x)),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "请到知识库核对来源版本；原始隐患没有可信整改结论时，题目只用于识别和补证据，不编造标准处置。" }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "修改或审核原因",
            /* @__PURE__ */ s.jsx("textarea", { "aria-label": "题目审核原因", value: y, onChange: (x) => Q(x.target.value) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            k && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge || Ze || !y.trim(), onClick: () => void fe(async () => {
              await u(`/training/questions/${Y}/draft`, { method: "PATCH", body: JSON.stringify({ ...kt(), content: X }) }), be("新题目版本已保存，不改变旧学习包与成绩。"), N((x) => x + 1);
            }), children: "保存新版本" }),
            k && ["draft", "changes_requested"].includes(pe.state) && /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !Ze || !y.trim(), onClick: () => Yt("submit"), children: "提交题目审核" })
          ] }),
          se && pe.state === "pending_review" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: le, onChange: (x) => Ce(x.target.checked) }),
              "已核对题面、正确答案、评分要点和来源"
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !le || !Ze || !y.trim(), onClick: () => Yt("approve"), children: "批准此题目版本" }),
              /* @__PURE__ */ s.jsx("button", { className: "button ghost", disabled: Ge || !Ze || !y.trim(), onClick: () => Yt("request-changes"), children: "退回修改" })
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
            Bs[x.state]
          ] }, x.id)),
          pe.review_actions.map((x, Te) => /* @__PURE__ */ s.jsxs("p", { children: [
            "v",
            x.version,
            " · ",
            Bs[x.action] || x.action,
            " · ",
            x.reason
          ] }, Te))
        ] })
      ] })
    ] }) : z ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "可学习的固定版本学习包" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "开放题评分方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "开放题评分方式", value: Ie, onChange: (x) => st(x.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "rules", children: "关键词规则建议分，等待教员确认" }),
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型建议分，等待教员确认" }),
              !Rt && /* @__PURE__ */ s.jsx("option", { value: "simulate_failure", children: "模拟评分失败，验证作答保留" })
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
            /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge, onClick: () => g(x), children: "开始本次练习" })
          ] }, x.id)) : /* @__PURE__ */ s.jsx("p", { children: "暂无适用于当前身份的已发布学习包。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ s.jsx("h2", { children: "我的学习记录" }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "proof-body", children: [
          Qe.map((x) => /* @__PURE__ */ s.jsx("p", { children: /* @__PURE__ */ s.jsxs("button", { className: "text-button", onClick: () => _("/learn/attempts/" + x.id), children: [
            Bs[x.state],
            " · ",
            Bs[x.result_state],
            " · ",
            new Date(x.started_at).toLocaleString("zh-CN")
          ] }) }, x.id)),
          !Qe.length && /* @__PURE__ */ s.jsx("p", { children: "还没有学习记录。" })
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
        /* @__PURE__ */ s.jsx("tbody", { children: Qe.map((x) => {
          var Te;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              x.title,
              " · v",
              x.package_version
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: (Te = x.learner_id) == null ? void 0 : Te.slice(0, 8) }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              Bs[x.state],
              " · ",
              Bs[x.result_state]
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: x.state !== "submitted", onClick: () => _("/training/results/" + x.id), children: "查看结果与复核" }) })
          ] }, x.id);
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
              /* @__PURE__ */ s.jsx("select", { value: he, onChange: (x) => {
                F(x.target.value), Z([]);
              }, children: o.filter((x) => Mt(x, "training.manage")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "指定学习账号（可留空，逗号分隔）",
              /* @__PURE__ */ s.jsx("input", { "aria-label": "指定学习账号", value: _e, onChange: (x) => Ee(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "名称",
              /* @__PURE__ */ s.jsx("input", { value: W, onChange: (x) => we(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "学习包组编码",
              /* @__PURE__ */ s.jsx("input", { value: re, onChange: (x) => Ae(x.target.value) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "版本号",
              /* @__PURE__ */ s.jsx("input", { type: "number", min: 1, value: et, onChange: (x) => it(Number(x.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: ue.filter((x) => x.project_id === he).map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: ie.includes(x.revision_id), onChange: (Te) => Z((ze) => Nt(ze, x.revision_id, Te.target.checked)) }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              qa[x.type],
              " · ",
              x.title,
              " · v",
              x.version
            ] })
          ] }, x.revision_id)) }),
          /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Ge || !ie.length || ie.length > 30 || !W.trim(), onClick: () => void fe(async () => {
            await u("/training/packages", { method: "POST", body: JSON.stringify({ title: W, package_key: re, version: et, project_id: he, question_revision_ids: ie, role_scope: ["learner", "admin", "teacher"], audience_subjects: _e.split(/[,，\n]/).map((x) => x.trim()).filter(Boolean) }) }), be("学习包草稿已建立，发布后学员可使用。"), N((x) => x + 1);
          }), children: [
            "创建学习包草稿（",
            ie.length,
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
            Bs[x.state],
            " · ",
            x.question_count,
            "题 · ",
            x.package_key
          ] }),
          x.state === "draft" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Ge, onClick: () => void fe(async () => {
            await u(`/training/packages/${x.id}/publish`, { method: "POST", body: JSON.stringify({ row_version: x.row_version, reason: "发布已审核题目的固定版本学习包" }) }), be("学习包已发布。"), N((Te) => Te + 1);
          }), children: "发布此学习包版本" })
        ] }, x.id)) }),
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
            /* @__PURE__ */ s.jsx("select", { value: he, onChange: (x) => {
              F(x.target.value), B([]);
            }, children: o.filter((x) => Mt(x, "training.manage")).map((x) => /* @__PURE__ */ s.jsx("option", { value: x.id, children: x.name }, x.id)) })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "source-options", children: [
            Re.map((x) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
              /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: m.includes(x.revision_id), onChange: (Te) => B((ze) => Nt(ze, x.revision_id, Te.target.checked)) }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                x.title,
                /* @__PURE__ */ s.jsxs("small", { children: [
                  x.origin_type === "retrospective" ? "复盘经验" : "历史知识",
                  " · 已发布固定版本"
                ] })
              ] })
            ] }, x.revision_id)),
            !Re.length && /* @__PURE__ */ s.jsx("p", { children: "先审核并发布知识；B06复盘需先转经验并完成知识审核，不能直接跳过来源门槛出题。" })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: Object.entries(qa).map(([x, Te]) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: I.includes(x), onChange: (ze) => ae((tt) => Nt(tt, x, ze.target.checked)) }),
            Te
          ] }, x)) }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "出题方式",
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "出题方式", value: me, onChange: (x) => ye(x.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "云端模型生成" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: Ge || !m.length || m.length > 10 || !I.length, onClick: () => void fe(async () => {
            const x = await om(u, "/training/generation-jobs", { knowledge_revision_ids: m, types: I, generation_mode: me }, () => be("已提交后台生成，关闭页面不影响任务；可在任务工作台查看进度。"));
            be("已生成或复用" + x.items.length + "道候选题，仍需核查答案与来源后提交审核。"), N((Te) => Te + 1);
          }), children: "生成题目候选" }),
          /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "多选演示题需至少两条审核事实。模型输出仍需核对，不将自动生成等同于质量验收通过。" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ s.jsx("h2", { children: "题目候选与审核" }),
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "题目状态", value: Ue, onChange: (x) => {
            lt(x.target.value), L(""), b([]);
          }, children: [
            /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
            ["draft", "pending_review", "changes_requested", "approved", "published"].map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: Bs[x] }, x))
          ] })
        ] }),
        ue.length ? /* @__PURE__ */ s.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ s.jsxs("table", { children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "题面" }),
            /* @__PURE__ */ s.jsx("th", { children: "类型" }),
            /* @__PURE__ */ s.jsx("th", { children: "版本/状态" }),
            /* @__PURE__ */ s.jsx("th", { children: "操作" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: ue.map((x) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: x.title }),
            /* @__PURE__ */ s.jsx("td", { children: qa[x.type] }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              "v",
              x.version,
              " · ",
              Bs[x.state],
              x.published && /* @__PURE__ */ s.jsx("small", { children: "已用于发布学习包" })
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/training/questions/" + x.id), children: "核查与审核" }) })
          ] }, x.id)) })
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
  var Ee, he;
  const [h, _] = r.useState(null), [o, z] = r.useState([]), [D, V] = r.useState("openai"), [R, Y] = r.useState(""), [v, M] = r.useState(!1), [K, k] = r.useState(""), [se, me] = r.useState("");
  r.useEffect(() => {
    let F = !1;
    return Promise.all([u("/models/settings"), u("/models/presets")]).then(([ue, ne]) => {
      if (F) return;
      z(ne.items);
      const H = ne.items.find((je) => je.base_url === ue.base_url);
      if (!ue.model && !ue.api_key_configured) {
        const je = ne.items[0];
        V(je.id), _({ ...ue, base_url: je.base_url, model: je.default_model });
      } else
        V((H == null ? void 0 : H.id) || "custom"), _(ue);
    }).catch((ue) => {
      F || k(ue.message);
    }), () => {
      F = !0;
    };
  }, []);
  const ye = (F) => {
    const ue = o.find((ne) => ne.id === F);
    V(F), Y(""), me(""), k(""), h && _({ ...h, base_url: (ue == null ? void 0 : ue.base_url) || "", model: (ue == null ? void 0 : ue.default_model) || "", api_key_configured: !1 });
  }, _e = async () => {
    if (h) {
      M(!0), k(""), me("");
      try {
        const { api_key_configured: F, ...ue } = h, ne = await u("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !0, ...R ? { api_key: R } : {} }) });
        if (_(ne), Y(""), me("配置已保存，正在测试连接…"), (await u("/models/test", { method: "POST" })).status !== "ok") throw new Error("配置已保存，但模型未返回预期结果，请重新测试。");
        me("连接测试通过，可以开始知识萃取和案例评分。");
      } catch (F) {
        me(""), k(F.message);
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
          /* @__PURE__ */ s.jsxs("select", { "aria-label": "模型服务", disabled: v, value: D, onChange: (F) => ye(F.target.value), children: [
            o.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id)),
            /* @__PURE__ */ s.jsx("option", { value: "custom", children: "其他兼容服务（自定义）" })
          ] })
        ] }),
        D === "custom" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
            !((Ee = o.find((F) => F.id === D)) != null && Ee.models.some((F) => F.id === h.model)) && /* @__PURE__ */ s.jsxs("option", { value: h.model, children: [
              h.model,
              "（已保存）"
            ] }),
            (he = o.find((F) => F.id === D)) == null ? void 0 : he.models.map((F) => /* @__PURE__ */ s.jsx("option", { value: F.id, children: F.name }, F.id))
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "API Key",
          /* @__PURE__ */ s.jsx("input", { "aria-label": "模型密钥", type: "password", autoComplete: "new-password", disabled: v, value: R, onChange: (F) => Y(F.target.value), placeholder: h.api_key_configured ? "已保存，留空继续使用" : "粘贴所选服务的 API Key" })
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
          /* @__PURE__ */ s.jsx("button", { className: "button primary", disabled: v || !h.model || !R.trim() && !h.api_key_configured, onClick: () => void _e(), children: v ? "正在保存并测试…" : "保存并测试" }),
          h.enabled && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: v, onClick: () => {
            M(!0), k("");
            const { api_key_configured: F, ...ue } = h;
            u("/models/settings", { method: "PUT", body: JSON.stringify({ ...ue, enabled: !1 }) }).then((ne) => {
              _(ne), me("云端调用已停用。");
            }).catch((ne) => k(ne.message)).finally(() => M(!1));
          }, children: "停用云端调用" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。" })
      ] }) : /* @__PURE__ */ s.jsx("p", { children: "正在读取模型配置…" })
    ] })
  ] });
}
const Fv = [{ code: "general", name: "通用施工检查", focus: "从历史记录归纳施工准备、现场实施、验收复核要点；后续替换为正式分类。", keywords: [] }];
function Iv({ api: u, path: h, navigate: _, projects: o, identity: z, canManageModels: D }) {
  var I, ae, ie;
  const V = h === "/settings/models", R = D, Y = o.some((Z) => Z.can_run), [v, M] = r.useState(((I = o.find((Z) => Z.can_run)) == null ? void 0 : I.id) || ""), [K, k] = r.useState([]), [se, me] = r.useState([]), [ye, _e] = r.useState(null), [Ee, he] = r.useState(Fv), [F, ue] = r.useState("llm"), [ne, H] = r.useState(sessionStorage.getItem("b07-extraction-" + z) || ""), [je, Re] = r.useState(null), [Be, Qe] = r.useState(!1), [Le, pe] = r.useState(!0), [We, X] = r.useState(""), [oe, y] = r.useState(""), [Q, le] = r.useState(0), Ce = async (Z) => {
    Qe(!0), X(""), y("");
    try {
      await Z();
    } catch (W) {
      X(W.message);
    } finally {
      Qe(!1);
    }
  };
  r.useEffect(() => {
    let Z = !1;
    return pe(!0), X(""), me([]), (async () => {
      var we;
      try {
        if (V) {
          if (!R) throw new Error("仅管理员可配置云端模型。");
        } else {
          if (!Y || !v) throw new Error("当前身份没有知识加工权限。");
          const [re, Ae] = await Promise.all([u(`/knowledge/source-options?project_id=${v}&limit=100`), u(`/knowledge/taxonomies?project_id=${v}`)]);
          Z || (k(re.items), _e(Ae.items[0] || null), he(structuredClone(((we = Ae.items[0]) == null ? void 0 : we.categories) || Ae.suggested_categories)));
        }
      } catch (re) {
        Z || X(re.message);
      } finally {
        Z || pe(!1);
      }
    })(), () => {
      Z = !0;
    };
  }, [h, v, Q]), r.useEffect(() => {
    if (!ne || V) return;
    let Z = !1, W;
    const we = async () => {
      try {
        const re = await u("/knowledge/extraction-jobs/" + ne);
        if (Z) return;
        Re(re), ["queued", "running", "retrying"].includes(re.status) && (W = window.setTimeout(() => void we(), 1800));
      } catch (re) {
        Z || X(re.message);
      }
    };
    return we(), () => {
      Z = !0, window.clearTimeout(W);
    };
  }, [ne, h, Q]);
  const m = (Z, W) => he((we) => we.map((re, Ae) => Ae === Z ? { ...re, ...W } : re)), B = JSON.stringify(Ee) !== JSON.stringify((ye == null ? void 0 : ye.categories) || []);
  return /* @__PURE__ */ s.jsxs("div", { className: "knowledge-module training-module", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-banner", children: [
      /* @__PURE__ */ s.jsx(Hl, { size: 20 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: V ? "云端模型配置" : "按类别萃取施工要点" }),
        /* @__PURE__ */ s.jsx("span", { children: V ? "密钥只写入本机受忽略的配置文件，网页不会回传已保存的密钥。" : "多条记录自动分类、合并、提炼施工要点。事实、来源归纳与新增建议分开标记，候选继续进入原知识审核。" })
      ] })
    ] }),
    We && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
      /* @__PURE__ */ s.jsx(ql, { size: 18 }),
      We
    ] }),
    oe && /* @__PURE__ */ s.jsx("div", { className: "feedback success", role: "status", children: oe }),
    /* @__PURE__ */ s.jsxs("div", { className: "ingest-toolbar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ingest-tabs", children: [
        /* @__PURE__ */ s.jsx("button", { className: V ? "" : "selected", onClick: () => _("/extraction"), children: "施工要点萃取" }),
        R && /* @__PURE__ */ s.jsx("button", { className: V ? "selected" : "", onClick: () => _("/settings/models"), children: "云端模型配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/settings/scenes"), children: "场景配置" }),
        /* @__PURE__ */ s.jsx("button", { onClick: () => _("/knowledge/drafts"), children: "知识候选与审核" })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => le((Z) => Z + 1), children: [
        /* @__PURE__ */ s.jsx(Js, { size: 15 }),
        "刷新"
      ] })
    ] }),
    Le ? /* @__PURE__ */ s.jsx("div", { className: "loading", children: "正在读取加工配置…" }) : V && R ? /* @__PURE__ */ s.jsx(Wv, { api: u }) : !V && Y ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
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
            ye ? "分类 v" + ye.version : "尚无分类版本",
            "。先使用通用分类，后续可替换为你提供的类别；关键词帮助演示模式分组，云端模型同时参考名称与关注点。"
          ] }),
          Ee.map((Z, W) => /* @__PURE__ */ s.jsxs("div", { className: "training-category", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "form-grid", children: [
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别编码",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别编码" + (W + 1), value: Z.code, onChange: (we) => m(W, { code: we.target.value }) })
              ] }),
              /* @__PURE__ */ s.jsxs("label", { children: [
                "类别名称",
                /* @__PURE__ */ s.jsx("input", { "aria-label": "类别名称" + (W + 1), value: Z.name, onChange: (we) => m(W, { name: we.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "施工关注点",
              /* @__PURE__ */ s.jsx("textarea", { value: Z.focus, onChange: (we) => m(W, { focus: we.target.value }) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "匹配关键词（用逗号分隔，可留空）",
              /* @__PURE__ */ s.jsx("input", { value: Z.keywords.join("，"), onChange: (we) => m(W, { keywords: we.target.value.split(/[,，]/).map((re) => re.trim()).filter(Boolean) }) })
            ] }),
            Ee.length > 1 && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => he((we) => we.filter((re, Ae) => Ae !== W)), children: "移除此类别" })
          ] }, W)),
          /* @__PURE__ */ s.jsxs("div", { className: "card-actions", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "button ghost", disabled: Ee.length >= 100, onClick: () => he([...Ee, { code: "category_" + (Ee.length + 1), name: "", focus: "", keywords: [] }]), children: [
              /* @__PURE__ */ s.jsx(pv, { size: 16 }),
              "添加类别"
            ] }),
            /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be || !B, onClick: () => void Ce(async () => {
              const Z = await u("/knowledge/taxonomies", { method: "POST", body: JSON.stringify({ project_id: v, expected_version: (ye == null ? void 0 : ye.version) || 0, categories: Ee }) });
              _e(Z), he(Z.categories), y("分类版本已固定，可开始加工。");
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
          /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => me(K.slice(0, 20).map((Z) => Z.record_version_id)), children: "选择当前显示的前20条" }),
          /* @__PURE__ */ s.jsx("div", { className: "source-options", children: K.map((Z) => /* @__PURE__ */ s.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: se.includes(Z.record_version_id), onChange: (W) => me((we) => W.target.checked ? [...we, Z.record_version_id] : we.filter((re) => re !== Z.record_version_id)) }),
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
            /* @__PURE__ */ s.jsxs("select", { "aria-label": "知识加工方式", value: F, onChange: (Z) => ue(Z.target.value), children: [
              /* @__PURE__ */ s.jsx("option", { value: "llm", children: "调用云端大模型，自主分类与提炼" }),
              /* @__PURE__ */ s.jsx("option", { value: "mock", children: "本地模板演示（不代表模型效果）" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "card-actions", children: /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: Be || !ye || B || !se.length || se.length > 20, onClick: () => void Ce(async () => {
            const Z = await u("/knowledge/extraction-jobs", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ record_version_ids: se, taxonomy_id: ye.id, mode: F }) });
            H(Z.job_id), sessionStorage.setItem("b07-extraction-" + z, Z.job_id), y("后台加工已提交，完成后生成有来源的施工要点候选。");
          }), children: [
            "自动萃取施工要点（",
            se.length,
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
          (ae = je.result.items) == null ? void 0 : ae.map((Z) => /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => _("/knowledge/" + Z.item_id + "/edit"), children: "打开施工要点候选" }),
            " · ",
            Z.outcome === "reused" ? "复用已有人工版本" : "新增草稿"
          ] }, Z.item_id)),
          (ie = je.result.missing_information) == null ? void 0 : ie.map((Z, W) => /* @__PURE__ */ s.jsxs("p", { children: [
            "资料缺口：",
            Z
          ] }, W)),
          je.status === "failed" && /* @__PURE__ */ s.jsx("button", { className: "button secondary", disabled: Be, onClick: () => void Ce(async () => {
            await u("/jobs/" + je.job_id + "/retry", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ row_version: je.row_version }) }), le((Z) => Z + 1);
          }), children: "重试此加工任务" })
        ] })
      ] })
    ] }) : null
  ] });
}
const Eu = { queued: "等待处理", running: "正在处理", retrying: "自动重试中", succeeded: "已完成", failed: "处理失败" }, $f = { admin: "管理员", processor: "资料加工", reviewer: "内容审核", teacher: "培训教员", learner: "学习成员", a_service: "模拟A服务" }, Wf = { demo_check: "演示检查", source_import: "历史数据接入", knowledge_generation: "模板知识候选", knowledge_extraction: "施工要点萃取", release_build: "发布索引构建", task_package_import: "任务包处理", a_import: "A 成果接入", a_retrospective: "A 成果复盘", training_generation: "培训题目生成", retrospective_generation: "案例复盘生成", training_grading: "培训案例评分" }, lc = (u) => new Date(u).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }), Pv = [["admin", "本地管理员"], ["processor", "资料加工员"], ["learner", "新成员"], ["teacher", "培训教员"], ["outsider", "其他项目成员"]];
function ep({ embedded: u = !1 }) {
  var rt;
  const [h, _] = r.useState(localStorage.getItem("b01-identity") || "admin"), [o, z] = r.useState(ec()), [D, V] = r.useState(!1), R = o === "/platform/services", Y = o.startsWith("/archive-review/"), v = /^\/imports\/ai_[a-f0-9]{32}$/.test(o), [M, K] = r.useState(["/sources", "/imports", "/records"].some((N) => ec().startsWith(N))), k = ["/search", "/releases", "/knowledge/library"].includes(o) || /^\/knowledge\/[^/]+$/.test(o) && o !== "/knowledge/drafts", se = !k && ["/quality", "/knowledge", "/reviews"].some((N) => o.startsWith(N)), me = o.startsWith("/training") || o.startsWith("/learn"), ye = o.startsWith("/workflows"), _e = o.startsWith("/standards"), Ee = ye || _e || o.startsWith("/extraction") || o === "/settings/models" || o === "/settings/scenes", he = o.startsWith("/retrospectives"), F = o.startsWith("/task-packages"), ue = o === "/records", ne = !v && ["/sources", "/imports", "/records"].some((N) => o.startsWith(N)), [H, je] = r.useState(null), [Re, Be] = r.useState([]), [Qe, Le] = r.useState({}), [pe, We] = r.useState(!1), [X, oe] = r.useState(""), [y, Q] = r.useState(""), [le, Ce] = r.useState(!0), [m, B] = r.useState(!1), [I, ae] = r.useState(0), [ie, Z] = r.useState(""), [W, we] = r.useState(""), [re, Ae] = r.useState(""), [et, it] = r.useState(null), [Fe, Ke] = r.useState([]), [Oe, De] = r.useState(null), [ke, He] = r.useState(!1), [Ie, st] = r.useState("demo-airport"), [at, ve] = r.useState("success"), [ct, qe] = r.useState(null), [C, w] = r.useState(""), [P, Ne] = r.useState("processor"), [Ue, lt] = r.useState("demo-airport"), [ft, L] = r.useState([]);
  async function de(N, fe = {}) {
    const Ze = await Zt("/api/v1" + N, {
      ...fe,
      headers: { "Content-Type": "application/json", Authorization: `Bearer dev-${h}`, ...fe.headers }
    });
    if (!Ze.ok) {
      const kt = await Ze.json().catch(() => ({}));
      throw new Error(kt.message || `请求失败（${Ze.status}），请刷新后重试。`);
    }
    return Ze.json();
  }
  const te = (N) => {
    var Ze, kt;
    const fe = window;
    u && ((Ze = fe.QaxcHasPendingEdits) != null && Ze.call(fe)) && !confirm("当前页面有编辑操作，请确认已保存后再离开。继续？") || ((kt = fe.QaxcClearPendingEdits) == null || kt.call(fe), kj(N), z(ec()), oe(""), De(null), Ae(""), Ke([]));
  };
  r.useEffect(() => {
    const N = () => z(ec());
    return window.addEventListener("popstate", N), window.addEventListener("hashchange", N), () => {
      window.removeEventListener("popstate", N), window.removeEventListener("hashchange", N);
    };
  }, []), r.useEffect(() => {
    const N = () => V(!0);
    return window.addEventListener("b-session-expired", N), () => window.removeEventListener("b-session-expired", N);
  }, []), r.useEffect(() => {
    let N = !1;
    Ce(!0), oe(""), je(null), qe(null), Be([]), L([]);
    async function fe() {
      try {
        const Ze = await de("/me");
        if (N) return;
        const kt = window.QaxcProjectNames || {};
        u && (Ze.projects = Ze.projects.map((ut) => ({ ...ut, name: kt[ut.id] || ut.name })));
        const Yt = window.QaxcProjectId;
        u && Yt && (Ze.projects = Ze.projects.filter((ut) => ut.id === Yt)), je(Ze);
        const qt = await de("/health");
        if (N || (We(qt.worker_online), v || R || Y || ne || se || k || F || he || me || Ee)) return;
        if (o === "/settings/access") {
          if (!Ze.projects.some((g) => g.can_manage)) return;
          const [ut, Nt] = await Promise.all([de("/access"), de("/audit-events?limit=10")]);
          if (N) return;
          qe(ut), L(Nt.items), w((g) => {
            var Se;
            return ut.users.some((nt) => nt.id === g) ? g : ((Se = ut.users[0]) == null ? void 0 : Se.id) || "";
          });
        } else {
          const [ut, Nt] = await Promise.all([
            de(`/jobs?limit=12${W ? `&kind=${W}` : ""}${ie ? `&status=${ie}` : ""}${re ? `&cursor=${encodeURIComponent(re)}` : ""}`),
            de("/dashboard")
          ]);
          if (N) return;
          Be(ut.items), it(ut.next_cursor), Le(Nt.counts);
        }
      } catch (Ze) {
        N || oe(Ze.message);
      } finally {
        N || Ce(!1);
      }
    }
    return fe(), () => {
      N = !0;
    };
  }, [h, o, ie, W, re, I]), r.useEffect(() => {
    if (!H || v || R || Y || o === "/settings/access" || ne || se || k || F || he || me || Ee) return;
    let N = !1;
    const fe = window.setInterval(async () => {
      try {
        const [Ze, kt, Yt] = await Promise.all([
          de(`/jobs?limit=12${W ? `&kind=${W}` : ""}${ie ? `&status=${ie}` : ""}${re ? `&cursor=${encodeURIComponent(re)}` : ""}`),
          de("/dashboard"),
          de("/health")
        ]);
        if (N) return;
        Be(Ze.items), it(Ze.next_cursor), Le(kt.counts), We(Yt.worker_online), De((qt) => qt ? Ze.items.find((ut) => ut.id === qt.id) || qt : null), oe("");
      } catch (Ze) {
        N || (oe(Ze.message), We(!1));
      }
    }, 2e3);
    return () => {
      N = !0, clearInterval(fe);
    };
  }, [h, o, ie, W, re, H == null ? void 0 : H.id]);
  const Ye = async (N) => {
    B(!0), oe(""), Q("");
    try {
      await N(), ae((fe) => fe + 1);
    } catch (fe) {
      oe(fe.message);
    } finally {
      B(!1);
    }
  }, b = () => Ye(async () => {
    await de("/jobs", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ title: "演示资料完整性检查", project_id: Ie, scenario: at, duration_seconds: 6 })
    }), He(!1), Q("任务已保存，处理服务会自动执行。"), te("/jobs");
  }), ge = (N) => Ye(async () => {
    await de(`/jobs/${N.id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ row_version: N.row_version })
    }), Q("已提交重试，原任务和来源保持不变。");
  }), xe = (N) => Ye(async () => {
    const fe = await Zt(`/api/v1/assets/${N.result_ref}/content`, { headers: { Authorization: `Bearer dev-${h}` } });
    if (!fe.ok) {
      const Yt = await fe.json();
      throw new Error(Yt.message);
    }
    const Ze = document.createElement("a"), kt = URL.createObjectURL(await fe.blob());
    Ze.href = kt, Ze.download = `演示检查结果-${N.id.slice(0, 8)}.txt`, Ze.click(), URL.revokeObjectURL(kt), Q("演示结果已下载。");
  }), Ge = !Rt && (H == null ? void 0 : H.projects.some((N) => N.can_run)), jt = (N) => {
    const fe = H == null ? void 0 : H.projects.find((kt) => kt.id === N.project_id);
    if ((fe == null ? void 0 : fe.permissions) == null) return !!(fe != null && fe.can_run);
    const Ze = {
      source_import: "knowledge.process",
      knowledge_generation: "knowledge.process",
      knowledge_extraction: "knowledge.process",
      release_build: "knowledge.publish",
      training_generation: "training.manage",
      retrospective_generation: "retrospective.generate",
      training_grading: "training.manage"
    };
    return !!Ze[N.kind] && fe.permissions.includes(Ze[N.kind]);
  }, T = H == null ? void 0 : H.projects.some((N) => N.can_manage), j = Object.fromEntries(((H == null ? void 0 : H.projects) || []).map((N) => [N.id, N.name])), ce = v ? "A 成果接入" : R ? "平台服务" : Y ? "归档成果复盘" : me ? o.startsWith("/learn") ? "我的学习" : "培训与学习记录" : Ee ? ye ? "隐患分析与知识成果" : _e ? "规范原文与版本" : o === "/settings/models" ? "云端模型配置" : o === "/settings/scenes" ? "场景与流程配置" : "施工要点知识萃取" : he ? "过程复盘与经验" : F ? "归档成果与证据" : k ? o === "/releases" ? "知识发布管理" : o === "/search" ? "知识检索" : "已发布知识库" : se ? "知识加工与审核" : ne ? ue ? "风险数据" : o.startsWith("/sources") ? "历史数据来源" : o.startsWith("/imports") ? "历史项目" : "风险数据" : o === "/settings/access" ? "成员与权限" : o === "/jobs" ? "处理任务" : "我的工作台", be = (Qe.queued || 0) + (Qe.running || 0) + (Qe.retrying || 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "app-shell", children: [
    !u && /* @__PURE__ */ s.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ s.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ s.jsx(Lf, { size: 26 }) }),
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
          /* @__PURE__ */ s.jsx(qf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "返回小察工作台" })
        ] }),
        [["/workbench", qf, "我的工作台"], ["/jobs", Pj, "处理任务"]].map(([N, fe, Ze]) => {
          const kt = fe;
          return /* @__PURE__ */ s.jsxs("button", { "aria-label": String(Ze), className: o === N || N === "/workbench" && o === "/" ? "nav-item active" : "nav-item", onClick: () => te(String(N)), children: [
            /* @__PURE__ */ s.jsx(kt, { size: 19 }),
            /* @__PURE__ */ s.jsx("span", { children: String(Ze) }),
            /* @__PURE__ */ s.jsx(dl, { size: 15 })
          ] }, String(N));
        }),
        /* @__PURE__ */ s.jsxs("button", { className: `nav-item governance-toggle ${ne ? "active-group" : ""}`, "aria-label": "历史数据治理", "aria-expanded": M, "aria-controls": "governance-menu", onClick: () => K((N) => !N), children: [
          /* @__PURE__ */ s.jsx(tc, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "历史数据治理" }),
          /* @__PURE__ */ s.jsx(dl, { className: M ? "expanded" : "", size: 15 })
        ] }),
        M && /* @__PURE__ */ s.jsx("div", { id: "governance-menu", className: "subnav", children: [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]].map(([N, fe]) => /* @__PURE__ */ s.jsx("button", { "aria-label": fe, className: o.startsWith(N) ? "active" : "", onClick: () => te(N), children: fe }, N)) }),
        /* @__PURE__ */ s.jsxs("button", { className: se || Ee ? "nav-item active" : "nav-item", onClick: () => te("/extraction"), "aria-label": "知识加工与审核", children: [
          /* @__PURE__ */ s.jsx(Yn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识加工与审核" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: k ? "nav-item active" : "nav-item", onClick: () => te("/knowledge/library"), "aria-label": "知识库与检索", children: [
          /* @__PURE__ */ s.jsx(Yn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "知识库与检索" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: F ? "nav-item active" : "nav-item", onClick: () => te("/task-packages"), "aria-label": "A任务包接入", children: [
          /* @__PURE__ */ s.jsx(Yn, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "A任务包接入" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: he ? "nav-item active" : "nav-item", onClick: () => te("/retrospectives"), "aria-label": "过程复盘与经验", children: [
          /* @__PURE__ */ s.jsx(Rf, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "过程复盘与经验" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] }),
        /* @__PURE__ */ s.jsxs("button", { className: me ? "nav-item active" : "nav-item", onClick: () => te(H != null && H.projects.some((N) => N.roles.some((fe) => ["admin", "teacher", "reviewer"].includes(fe))) ? "/training/questions" : "/learn"), "aria-label": "培训与学习", children: [
          /* @__PURE__ */ s.jsx(rc, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "培训与学习" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] }),
        !Rt && /* @__PURE__ */ s.jsxs("button", { className: o === "/settings/access" ? "nav-item active" : "nav-item", onClick: () => te("/settings/access"), "aria-label": "成员与权限", children: [
          /* @__PURE__ */ s.jsx(wv, { size: 19 }),
          /* @__PURE__ */ s.jsx("span", { children: "成员与权限" }),
          /* @__PURE__ */ s.jsx(dl, { size: 15 })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "scope-card", children: [
        /* @__PURE__ */ s.jsx(tc, { size: 19 }),
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
          /* @__PURE__ */ s.jsx(dl, { size: 14 }),
          /* @__PURE__ */ s.jsx("strong", { children: ce })
        ] }),
        Rt ? /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" }) : /* @__PURE__ */ s.jsxs("div", { className: "identity", children: [
          /* @__PURE__ */ s.jsx("span", { className: "demo-tag", children: "模拟身份" }),
          /* @__PURE__ */ s.jsx("select", { "aria-label": "切换模拟身份", value: h, onChange: (N) => {
            localStorage.setItem("b01-identity", N.target.value), _(N.target.value), De(null), Ae(""), Ke([]), Q("");
          }, children: Pv.map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("main", { children: [
        u && !v && !k && !R && !ne && /* @__PURE__ */ s.jsx("nav", { "aria-label": "业务功能", className: "heading-actions", style: { flexWrap: "wrap", marginBottom: 20 }, children: (ne ? [["/sources", "数据来源"], ["/imports", "历史项目"], ["/records", "风险数据"]] : me ? [["/learn", "我的学习"], ["/training/questions", "题库与学习包"]] : se || Ee ? [["/workflows", "隐患与指导书"], ["/standards", "规范原文"], ["/extraction", "知识萃取"], ["/quality", "质量核查"], ["/knowledge/drafts", "知识草稿"], ["/reviews", "内容审核"], ["/settings/models", "模型设置"], ["/settings/scenes", "场景配置"]] : k ? [["/knowledge/library", "已发布知识"], ["/search", "检索"], ["/releases", "发布管理"]] : F ? [["/task-packages", "成果清单"], ["/task-packages/import", "接入成果"]] : [["/retrospectives", "复盘清单"]]).map(([N, fe]) => /* @__PURE__ */ s.jsx("button", { className: o === N ? "button primary" : "button ghost", onClick: () => te(N), children: fe }, N)) }),
        !(u && ne) && /* @__PURE__ */ s.jsxs("div", { className: "page-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("div", { className: "eyebrow", children: "工作空间" }),
            /* @__PURE__ */ s.jsx("h1", { children: ce }),
            /* @__PURE__ */ s.jsx("p", { children: v ? "指定版本接入、证据校验与过程复盘。" : me ? "固定审核来源、题目与学习包版本，保留作答、建议评分和教员复核。" : ye ? "按固定来源版本登记事件、分析分类、编制汇编和指导书，经审核发布后进入培训。" : _e ? "保存规范原文与适用版本，核对来源后审核发布。" : Ee ? "按类别合并历史记录，调用云端模型提炼可追溯的施工要点。" : he ? "复用已有过程记录与证据，核查实际流程，形成可审核的经验草稿。" : F ? "接收作业快照，核对事件、证据和版本，减少重复准备资料。" : k ? "固定审核版本发布，以项目权限检索知识并打开来源。" : se ? "复用来源证据生成候选，核查质量问题后逐版本审核。" : ne ? ue ? "查看原报告当前解析版本、字段证据和关联图片。" : "一次接入模拟资料，保留原文、治理生效值与来源证据。" : o === "/settings/access" ? "按项目分配角色，保留每次授权与撤销的记录。" : "查看处理进度、定位失败任务，保留每一次执行结果。" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "heading-actions", children: [
            !u && /* @__PURE__ */ s.jsxs("button", { className: "button ghost", onClick: () => ae((N) => N + 1), disabled: le, children: [
              /* @__PURE__ */ s.jsx(Js, { size: 16 }),
              "刷新"
            ] }),
            !Rt && !ne && !se && !k && !F && !he && !me && !Ee && o !== "/settings/access" && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: !Ge || m, onClick: () => {
              var N;
              st(((N = H == null ? void 0 : H.projects.find((fe) => fe.can_run)) == null ? void 0 : N.id) || "demo-airport"), He(!0);
            }, children: [
              /* @__PURE__ */ s.jsx(Bf, { size: 16 }),
              "运行演示检查"
            ] })
          ] })
        ] }),
        !Rt && !ne && !se && !k && !F && !he && !me && !Ee && /* @__PURE__ */ s.jsxs("div", { className: "mode-banner", children: [
          /* @__PURE__ */ s.jsx(Lf, { size: 18 }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "本地演示模式" }),
            /* @__PURE__ */ s.jsx("span", { children: "尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。" })
          ] })
        ] }),
        D && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          "登录已失效，请返回平台重新登录。",
          /* @__PURE__ */ s.jsx("a", { href: "/quality/", children: "返回平台" })
        ] }),
        X && /* @__PURE__ */ s.jsxs("div", { className: "feedback error", role: "alert", children: [
          /* @__PURE__ */ s.jsx(ql, { size: 18 }),
          X,
          /* @__PURE__ */ s.jsx("button", { onClick: () => ae((N) => N + 1), children: "重新加载" })
        ] }),
        y && /* @__PURE__ */ s.jsxs("div", { className: "feedback success", role: "status", children: [
          /* @__PURE__ */ s.jsx(Hl, { size: 18 }),
          y,
          /* @__PURE__ */ s.jsx("button", { "aria-label": "关闭提示", onClick: () => Q(""), children: /* @__PURE__ */ s.jsx(ac, { size: 16 }) })
        ] }),
        D ? null : v ? H ? /* @__PURE__ */ s.jsx(Rj, { id: o.split("/").pop(), identity: H.id, projects: H.projects, navigate: te }) : /* @__PURE__ */ s.jsx("p", { children: X || "正在读取身份…" }) : le ? /* @__PURE__ */ s.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ s.jsx(Hf, { className: "spin", size: 24 }),
          /* @__PURE__ */ s.jsx("span", { children: "正在读取工作区…" })
        ] }) : X ? null : R ? /* @__PURE__ */ s.jsx(Dj, { navigate: te }, I) : Y ? /* @__PURE__ */ s.jsx(Uj, { deliveryId: decodeURIComponent(o.split("/")[2]), navigate: te }, o) : me ? /* @__PURE__ */ s.jsx($v, { api: de, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [] }, h) : ye ? /* @__PURE__ */ s.jsx(Aj, { api: de, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((N) => N.id).join(","))) : _e ? /* @__PURE__ */ s.jsx(Ej, { api: de, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h + ":" + (H == null ? void 0 : H.projects.map((N) => N.id).join(","))) : o === "/settings/scenes" ? /* @__PURE__ */ s.jsx("div", { className: "knowledge-module training-module", children: /* @__PURE__ */ s.jsx(wj, { api: de, projects: (H == null ? void 0 : H.projects) || [] }) }) : Ee ? /* @__PURE__ */ s.jsx(Iv, { api: de, identity: h, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [], canManageModels: !!(H != null && H.can_manage_models) }, h) : he ? /* @__PURE__ */ s.jsx(Kv, { api: de, identity: h, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [] }, h) : F ? /* @__PURE__ */ s.jsx(Zv, { identity: h, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [] }, h) : k ? /* @__PURE__ */ s.jsx(Lv, { identity: h, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [] }, h) : se ? /* @__PURE__ */ s.jsx(qv, { api: de, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : ue ? /* @__PURE__ */ s.jsx(Mv, { api: de }, h) : ne ? /* @__PURE__ */ s.jsx(Ev, { api: de, path: o, navigate: te, projects: (H == null ? void 0 : H.projects) || [], identity: h }, h) : o === "/settings/access" ? T ? ct && /* @__PURE__ */ s.jsxs("div", { className: "access-layout", children: [
          /* @__PURE__ */ s.jsxs("section", { className: "panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "项目角色" }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                ct.bindings.length,
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
              /* @__PURE__ */ s.jsx("tbody", { children: ct.bindings.map((N) => {
                var fe;
                return /* @__PURE__ */ s.jsxs("tr", { children: [
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("strong", { children: (fe = ct.users.find((Ze) => Ze.id === N.user_id)) == null ? void 0 : fe.name }) }),
                  /* @__PURE__ */ s.jsx("td", { children: j[N.project_id] }),
                  /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("span", { className: "role-tag", children: $f[N.role] }) }),
                  /* @__PURE__ */ s.jsx("td", { children: N.role === "admin" ? /* @__PURE__ */ s.jsx("span", { className: "muted", children: "初始化管理" }) : /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "text-button danger",
                      disabled: m,
                      onClick: () => {
                        confirm("撤销后，该成员在此项目的对应能力将立即失效。继续？") && Ye(async () => {
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
              /* @__PURE__ */ s.jsx(tc, { size: 15 }),
              "B内角色不能扩大来源系统授予的项目范围。"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel grant-panel", children: [
            /* @__PURE__ */ s.jsx("h2", { children: "添加项目角色" }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "成员",
              /* @__PURE__ */ s.jsx("select", { value: C, onChange: (N) => w(N.target.value), children: ct.users.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "项目",
              /* @__PURE__ */ s.jsx("select", { value: Ue, onChange: (N) => lt(N.target.value), children: ct.projects.map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { children: [
              "角色",
              /* @__PURE__ */ s.jsx("select", { value: P, onChange: (N) => Ne(N.target.value), children: Object.entries($f).filter(([N]) => N !== "admin" && N !== "a_service").map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N)) })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !C, onClick: () => void Ye(async () => {
              await de("/role-bindings", { method: "POST", body: JSON.stringify({ user_id: C, project_id: Ue, role: P }) }), Q("角色已添加。");
            }), children: [
              "添加角色",
              /* @__PURE__ */ s.jsx(Ml, { size: 16 })
            ] }),
            /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。" })
          ] }),
          /* @__PURE__ */ s.jsxs("section", { className: "panel audit-panel", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ s.jsx("h2", { children: "最近操作" }),
              /* @__PURE__ */ s.jsx("span", { children: "按当前管理范围展示" })
            ] }),
            ft.length ? ft.map((N) => /* @__PURE__ */ s.jsxs("div", { className: "audit-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "audit-point" }),
              /* @__PURE__ */ s.jsx("strong", { children: { job_created: "创建演示任务", job_retried: "重试任务", role_granted: "添加角色", role_revoked: "撤销角色" }[N.action] || N.action }),
              /* @__PURE__ */ s.jsx("span", { children: j[N.project_id] }),
              /* @__PURE__ */ s.jsx("time", { children: lc(N.created_at) })
            ] }, N.id)) : /* @__PURE__ */ s.jsx("p", { className: "empty-inline", children: "暂无操作记录。" })
          ] })
        ] }) : /* @__PURE__ */ s.jsxs("section", { className: "panel empty", children: [
          /* @__PURE__ */ s.jsx(tc, { size: 38 }),
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
              /* @__PURE__ */ s.jsx("strong", { children: Qe.succeeded || 0 }),
              /* @__PURE__ */ s.jsx("small", { children: "结果可查看、可下载" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "metric", children: [
              /* @__PURE__ */ s.jsx("span", { children: "待处理失败" }),
              /* @__PURE__ */ s.jsx("strong", { className: Qe.failed ? "danger-color" : "", children: Qe.failed || 0 }),
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
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务类型筛选", value: W, onChange: (N) => {
                we(N.target.value), Ae(""), Ke([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部类型" }),
                Object.entries(Wf).map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N))
              ] }),
              /* @__PURE__ */ s.jsxs("select", { "aria-label": "任务状态筛选", value: ie, onChange: (N) => {
                Z(N.target.value), Ae(""), Ke([]);
              }, children: [
                /* @__PURE__ */ s.jsx("option", { value: "", children: "全部状态" }),
                Object.entries(Eu).map(([N, fe]) => /* @__PURE__ */ s.jsx("option", { value: N, children: fe }, N))
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
                  /* @__PURE__ */ s.jsx("button", { className: "job-title", onClick: () => De(N), children: N.title }),
                  /* @__PURE__ */ s.jsxs("small", { children: [
                    j[N.project_id] || N.project_id,
                    /* @__PURE__ */ s.jsx("span", { className: "subtle-separator", children: "·" }),
                    Wf[N.kind] || N.kind
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("span", { className: `status ${N.status}`, children: [
                  /* @__PURE__ */ s.jsx("i", {}),
                  Eu[N.status]
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "progress-cell", children: [
                  /* @__PURE__ */ s.jsx("div", { className: "progress-track", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${N.progress}%` } }) }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    N.progress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ s.jsx("td", { className: "muted nowrap", children: lc(N.created_at) }),
                /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  N.kind === "source_import" && /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => te("/imports"), children: "历史项目" }),
                  /* @__PURE__ */ s.jsx("button", { className: "text-button", onClick: () => De(N), children: "详情" }),
                  N.status === "failed" && jt(N) && /* @__PURE__ */ s.jsx("button", { className: "text-button", disabled: m, onClick: () => void ge(N), children: "重试任务" }),
                  N.result_ref && /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "下载任务结果", disabled: m, onClick: () => void xe(N), children: /* @__PURE__ */ s.jsx(Uf, { size: 17 }) })
                ] }) })
              ] }, N.id)) })
            ] }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty", children: [
              /* @__PURE__ */ s.jsx(Yn, { size: 42 }),
              /* @__PURE__ */ s.jsx("h2", { children: ie ? "没有符合条件的任务" : "还没有处理任务" }),
              /* @__PURE__ */ s.jsx("p", { children: ie ? "切换筛选条件查看其他任务。" : Ge ? "运行一次演示检查，验证提交、执行和结果保存的完整过程。" : "当前身份可查看项目任务，请等待加工人员提交。" }),
              Ge && !ie && /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => He(!0), children: [
                "开始一次演示",
                /* @__PURE__ */ s.jsx(Ml, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "panel-footer", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                "显示 ",
                Re.length,
                " 条 · 任务状态自动更新"
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "pagination", children: [
                /* @__PURE__ */ s.jsx("button", { disabled: !Fe.length, onClick: () => {
                  Ae(Fe[Fe.length - 1]), Ke(Fe.slice(0, -1));
                }, children: "上一页" }),
                /* @__PURE__ */ s.jsx("button", { disabled: !et, onClick: () => {
                  Ke([...Fe, re]), Ae(et || "");
                }, children: "下一页" })
              ] })
            ] })
          ] }),
          o !== "/jobs" && /* @__PURE__ */ s.jsxs("section", { className: "next-step", children: [
            /* @__PURE__ */ s.jsx("div", { className: "next-icon", children: /* @__PURE__ */ s.jsx(Rf, { size: 22 }) }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("h3", { children: "从真实记录开始，逐步形成可用知识" }),
              /* @__PURE__ */ s.jsx("p", { children: "现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。" })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { className: "button secondary", onClick: () => te("/sources"), children: [
              "打开数据接入",
              /* @__PURE__ */ s.jsx(Ml, { size: 16 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "footer", children: [
          "工程风险知识与复盘培训中心",
          /* @__PURE__ */ s.jsx("span", { children: Rt ? "小察统一账号 · 按项目授权访问" : "仅限本机开发验证 · 模拟身份" })
        ] })
      ] })
    ] }),
    ke && /* @__PURE__ */ s.jsx("div", { className: "modal-backdrop", role: "presentation", children: /* @__PURE__ */ s.jsxs("section", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "create-title", children: "运行演示检查" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭", onClick: () => He(!1), children: /* @__PURE__ */ s.jsx(ac, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "所属项目",
        /* @__PURE__ */ s.jsx("select", { value: Ie, onChange: (N) => st(N.target.value), children: H == null ? void 0 : H.projects.filter((N) => N.can_run).map((N) => /* @__PURE__ */ s.jsx("option", { value: N.id, children: N.name }, N.id)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "验证场景",
        /* @__PURE__ */ s.jsxs("select", { value: at, onChange: (N) => ve(N.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "success", children: "正常完成" }),
          /* @__PURE__ */ s.jsx("option", { value: "fail_once", children: "临时失败后自动重试" }),
          /* @__PURE__ */ s.jsx("option", { value: "manual_failure", children: "失败后手动重试" })
        ] })
      ] }),
      !pe && /* @__PURE__ */ s.jsx("p", { className: "warning-text", children: "处理服务未连接，任务将保存并等待恢复。" }),
      /* @__PURE__ */ s.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ s.jsx("button", { className: "button ghost", onClick: () => He(!1), children: "取消" }),
        /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m || !Ge, onClick: () => void b(), children: [
          m ? /* @__PURE__ */ s.jsx(Hf, { className: "spin", size: 16 }) : /* @__PURE__ */ s.jsx(Bf, { size: 16 }),
          "提交任务"
        ] })
      ] })
    ] }) }),
    Oe && /* @__PURE__ */ s.jsx("div", { className: "drawer-backdrop", children: /* @__PURE__ */ s.jsxs("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "modal-heading", children: [
        /* @__PURE__ */ s.jsx("h2", { id: "detail-title", children: "任务详情" }),
        /* @__PURE__ */ s.jsx("button", { className: "icon-button", "aria-label": "关闭详情", onClick: () => De(null), children: /* @__PURE__ */ s.jsx(ac, { size: 20 }) })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: `status ${Oe.status}`, children: [
        /* @__PURE__ */ s.jsx("i", {}),
        Eu[Oe.status]
      ] }),
      /* @__PURE__ */ s.jsx("h3", { children: Oe.title }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsx("dt", { children: "项目" }),
        /* @__PURE__ */ s.jsx("dd", { children: j[Oe.project_id] }),
        /* @__PURE__ */ s.jsx("dt", { children: "实际执行次数" }),
        /* @__PURE__ */ s.jsx("dd", { children: Oe.attempts }),
        /* @__PURE__ */ s.jsx("dt", { children: "提交时间" }),
        /* @__PURE__ */ s.jsx("dd", { children: lc(Oe.created_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "最近更新" }),
        /* @__PURE__ */ s.jsx("dd", { children: lc(Oe.updated_at) }),
        /* @__PURE__ */ s.jsx("dt", { children: "任务编号" }),
        /* @__PURE__ */ s.jsx("dd", { className: "mono", children: Oe.id })
      ] }),
      Oe.error && /* @__PURE__ */ s.jsxs("div", { className: "detail-error", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "处理说明" }),
        /* @__PURE__ */ s.jsx("p", { children: Oe.error })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "small-note", children: "此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。" }),
      Oe.result_ref && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void xe(Oe), children: [
        /* @__PURE__ */ s.jsx(Uf, { size: 16 }),
        "下载演示结果"
      ] }),
      (rt = Oe.result_links) == null ? void 0 : rt.map((N) => /* @__PURE__ */ s.jsx("button", { className: "button secondary", onClick: () => te(N.path), children: N.label }, N.path)),
      Oe.status === "failed" && jt(Oe) && /* @__PURE__ */ s.jsxs("button", { className: "button primary", disabled: m, onClick: () => void ge(Oe), children: [
        /* @__PURE__ */ s.jsx(Js, { size: 16 }),
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
