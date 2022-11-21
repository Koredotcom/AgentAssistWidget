!function (t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e() }(self, (function () { return function (t) { var e = {}; function n(r) { if (e[r]) return e[r].exports; var o = e[r] = { i: r, l: !1, exports: {} }; return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports } return n.m = t, n.c = e, n.d = function (t, e, r) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r }) }, n.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var r = Object.create(null); if (n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) { return t[e] }.bind(null, o)); return r }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "", n(n.s = 18) }([function (t, e) { t.exports = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")() }, function (t, e, n) { var r = n(24), o = n(25), i = String.fromCharCode(30); t.exports = { protocol: 4, encodePacket: r, encodePayload: function (t, e) { var n = t.length, o = new Array(n), s = 0; t.forEach((function (t, c) { r(t, !1, (function (t) { o[c] = t, ++s === n && e(o.join(i)) })) })) }, decodePacket: o, decodePayload: function (t, e) { for (var n = t.split(i), r = [], s = 0; s < n.length; s++) { var c = o(n[s], e); if (r.push(c), "error" === c.type) break } return r } } }, function (t, e, n) { function r(t) { if (t) return function (t) { for (var e in r.prototype) t[e] = r.prototype[e]; return t }(t) } t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) { return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this }, r.prototype.once = function (t, e) { function n() { this.off(t, n), e.apply(this, arguments) } return n.fn = e, this.on(t, n), this }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) { if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this; var n, r = this._callbacks["$" + t]; if (!r) return this; if (1 == arguments.length) return delete this._callbacks["$" + t], this; for (var o = 0; o < r.length; o++)if ((n = r[o]) === e || n.fn === e) { r.splice(o, 1); break } return 0 === r.length && delete this._callbacks["$" + t], this }, r.prototype.emit = function (t) { this._callbacks = this._callbacks || {}; for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++)e[r - 1] = arguments[r]; if (n) { r = 0; for (var o = (n = n.slice(0)).length; r < o; ++r)n[r].apply(this, e) } return this }, r.prototype.listeners = function (t) { return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [] }, r.prototype.hasListeners = function (t) { return !!this.listeners(t).length } }, function (t, e, n) { var r = n(0); t.exports.pick = function (t) { for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)n[r - 1] = arguments[r]; return n.reduce((function (e, n) { return t.hasOwnProperty(n) && (e[n] = t[n]), e }), {}) }; var o = setTimeout, i = clearTimeout; t.exports.installTimerFunctions = function (t, e) { e.useNativeTimers ? (t.setTimeoutFn = o.bind(r), t.clearTimeoutFn = i.bind(r)) : (t.setTimeoutFn = setTimeout.bind(r), t.clearTimeoutFn = clearTimeout.bind(r)) } }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = u(t); if (e) { var o = u(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return a(t) } function a(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function u(t) { return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var f = n(1), l = n(2), p = n(3).installTimerFunctions, h = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(u, t); var e, n, r, c = s(u); function u(t) { var e; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, u), e = c.call(this), p(a(e), t), e.opts = t, e.query = t.query, e.readyState = "", e.socket = t.socket, e } return e = u, (n = [{ key: "onError", value: function (t, e) { var n = new Error(t); return n.type = "TransportError", n.description = e, this.emit("error", n), this } }, { key: "open", value: function () { return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this } }, { key: "close", value: function () { return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this } }, { key: "send", value: function (t) { "open" === this.readyState && this.write(t) } }, { key: "onOpen", value: function () { this.readyState = "open", this.writable = !0, this.emit("open") } }, { key: "onData", value: function (t) { var e = f.decodePacket(t, this.socket.binaryType); this.onPacket(e) } }, { key: "onPacket", value: function (t) { this.emit("packet", t) } }, { key: "onClose", value: function () { this.readyState = "closed", this.emit("close") } }]) && o(e.prototype, n), r && o(e, r), u }(l); t.exports = h }, function (t, e) { e.encode = function (t) { var e = ""; for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])); return e }, e.decode = function (t) { for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) { var i = n[r].split("="); e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]) } return e } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e, n) { return (o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = a(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = a(t); if (e) { var o = a(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function a(t) { return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } function u(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function f(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function l(t, e, n) { return e && f(t.prototype, e), n && f(t, n), t } Object.defineProperty(e, "__esModule", { value: !0 }), e.Decoder = e.Encoder = e.PacketType = e.protocol = void 0; var p, h = n(2), y = n(30), d = n(15); e.protocol = 5, function (t) { t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK" }(p = e.PacketType || (e.PacketType = {})); var v = function () { function t() { u(this, t) } return l(t, [{ key: "encode", value: function (t) { return t.type !== p.EVENT && t.type !== p.ACK || !d.hasBinary(t) ? [this.encodeAsString(t)] : (t.type = t.type === p.EVENT ? p.BINARY_EVENT : p.BINARY_ACK, this.encodeAsBinary(t)) } }, { key: "encodeAsString", value: function (t) { var e = "" + t.type; return t.type !== p.BINARY_EVENT && t.type !== p.BINARY_ACK || (e += t.attachments + "-"), t.nsp && "/" !== t.nsp && (e += t.nsp + ","), null != t.id && (e += t.id), null != t.data && (e += JSON.stringify(t.data)), e } }, { key: "encodeAsBinary", value: function (t) { var e = y.deconstructPacket(t), n = this.encodeAsString(e.packet), r = e.buffers; return r.unshift(n), r } }]), t }(); e.Encoder = v; var b = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(n, t); var e = s(n); function n() { return u(this, n), e.call(this) } return l(n, [{ key: "add", value: function (t) { var e; if ("string" == typeof t) (e = this.decodeString(t)).type === p.BINARY_EVENT || e.type === p.BINARY_ACK ? (this.reconstructor = new m(e), 0 === e.attachments && o(a(n.prototype), "emit", this).call(this, "decoded", e)) : o(a(n.prototype), "emit", this).call(this, "decoded", e); else { if (!d.isBinary(t) && !t.base64) throw new Error("Unknown type: " + t); if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet"); (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null, o(a(n.prototype), "emit", this).call(this, "decoded", e)) } } }, { key: "decodeString", value: function (t) { var e = 0, r = { type: Number(t.charAt(0)) }; if (void 0 === p[r.type]) throw new Error("unknown packet type " + r.type); if (r.type === p.BINARY_EVENT || r.type === p.BINARY_ACK) { for (var o = e + 1; "-" !== t.charAt(++e) && e != t.length;); var i = t.substring(o, e); if (i != Number(i) || "-" !== t.charAt(e)) throw new Error("Illegal attachments"); r.attachments = Number(i) } if ("/" === t.charAt(e + 1)) { for (var s = e + 1; ++e;) { if ("," === t.charAt(e)) break; if (e === t.length) break } r.nsp = t.substring(s, e) } else r.nsp = "/"; var c = t.charAt(e + 1); if ("" !== c && Number(c) == c) { for (var a = e + 1; ++e;) { var u = t.charAt(e); if (null == u || Number(u) != u) { --e; break } if (e === t.length) break } r.id = Number(t.substring(a, e + 1)) } if (t.charAt(++e)) { var f = function (t) { try { return JSON.parse(t) } catch (t) { return !1 } }(t.substr(e)); if (!n.isPayloadValid(r.type, f)) throw new Error("invalid payload"); r.data = f } return r } }, { key: "destroy", value: function () { this.reconstructor && this.reconstructor.finishedReconstruction() } }], [{ key: "isPayloadValid", value: function (t, e) { switch (t) { case p.CONNECT: return "object" === r(e); case p.DISCONNECT: return void 0 === e; case p.CONNECT_ERROR: return "string" == typeof e || "object" === r(e); case p.EVENT: case p.BINARY_EVENT: return Array.isArray(e) && e.length > 0; case p.ACK: case p.BINARY_ACK: return Array.isArray(e) } } }]), n }(h); e.Decoder = b; var m = function () { function t(e) { u(this, t), this.packet = e, this.buffers = [], this.reconPack = e } return l(t, [{ key: "takeBinaryData", value: function (t) { if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) { var e = y.reconstructPacket(this.reconPack, this.buffers); return this.finishedReconstruction(), e } return null } }, { key: "finishedReconstruction", value: function () { this.reconPack = null, this.buffers = [] } }]), t }() }, function (t, e) { var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]; t.exports = function (t) { var e = t, o = t.indexOf("["), i = t.indexOf("]"); -1 != o && -1 != i && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length)); for (var s, c, a = n.exec(t || ""), u = {}, f = 14; f--;)u[r[f]] = a[f] || ""; return -1 != o && -1 != i && (u.source = e, u.host = u.host.substring(1, u.host.length - 1).replace(/;/g, ":"), u.authority = u.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), u.ipv6uri = !0), u.pathNames = function (t, e) { var n = e.replace(/\/{2,9}/g, "/").split("/"); "/" != e.substr(0, 1) && 0 !== e.length || n.splice(0, 1); "/" == e.substr(e.length - 1, 1) && n.splice(n.length - 1, 1); return n }(0, u.path), u.queryKey = (s = u.query, c = {}, s.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, (function (t, e, n) { e && (c[e] = n) })), c), u } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = u(t); if (e) { var o = u(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return a(t) } function a(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function u(t) { return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.Manager = void 0; var f = n(20), l = n(3), p = n(14), h = n(6), y = n(16), d = n(31), v = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(v, t); var e, n, c, u = s(v); function v(t, e) { var n, o; !function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, v), (n = u.call(this)).nsps = {}, n.subs = [], t && "object" === r(t) && (e = t, t = void 0), (e = e || {}).path = e.path || "/socket.io", n.opts = e, (0, l.installTimerFunctions)(a(n), e), n.reconnection(!1 !== e.reconnection), n.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), n.reconnectionDelay(e.reconnectionDelay || 1e3), n.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), n.randomizationFactor(null !== (o = e.randomizationFactor) && void 0 !== o ? o : .5), n.backoff = new d({ min: n.reconnectionDelay(), max: n.reconnectionDelayMax(), jitter: n.randomizationFactor() }), n.timeout(null == e.timeout ? 2e4 : e.timeout), n._readyState = "closed", n.uri = t; var i = e.parser || h; return n.encoder = new i.Encoder, n.decoder = new i.Decoder, n._autoConnect = !1 !== e.autoConnect, n._autoConnect && n.open(), n } return e = v, (n = [{ key: "reconnection", value: function (t) { return arguments.length ? (this._reconnection = !!t, this) : this._reconnection } }, { key: "reconnectionAttempts", value: function (t) { return void 0 === t ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this) } }, { key: "reconnectionDelay", value: function (t) { var e; return void 0 === t ? this._reconnectionDelay : (this._reconnectionDelay = t, null === (e = this.backoff) || void 0 === e || e.setMin(t), this) } }, { key: "randomizationFactor", value: function (t) { var e; return void 0 === t ? this._randomizationFactor : (this._randomizationFactor = t, null === (e = this.backoff) || void 0 === e || e.setJitter(t), this) } }, { key: "reconnectionDelayMax", value: function (t) { var e; return void 0 === t ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, null === (e = this.backoff) || void 0 === e || e.setMax(t), this) } }, { key: "timeout", value: function (t) { return arguments.length ? (this._timeout = t, this) : this._timeout } }, { key: "maybeReconnectOnOpen", value: function () { !this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect() } }, { key: "open", value: function (t) { var e = this; if (~this._readyState.indexOf("open")) return this; this.engine = f(this.uri, this.opts); var n = this.engine, r = this; this._readyState = "opening", this.skipReconnect = !1; var o = (0, y.on)(n, "open", (function () { r.onopen(), t && t() })), i = (0, y.on)(n, "error", (function (n) { r.cleanup(), r._readyState = "closed", e.emitReserved("error", n), t ? t(n) : r.maybeReconnectOnOpen() })); if (!1 !== this._timeout) { var s = this._timeout; 0 === s && o(); var c = this.setTimeoutFn((function () { o(), n.close(), n.emit("error", new Error("timeout")) }), s); this.opts.autoUnref && c.unref(), this.subs.push((function () { clearTimeout(c) })) } return this.subs.push(o), this.subs.push(i), this } }, { key: "connect", value: function (t) { return this.open(t) } }, { key: "onopen", value: function () { this.cleanup(), this._readyState = "open", this.emitReserved("open"); var t = this.engine; this.subs.push((0, y.on)(t, "ping", this.onping.bind(this)), (0, y.on)(t, "data", this.ondata.bind(this)), (0, y.on)(t, "error", this.onerror.bind(this)), (0, y.on)(t, "close", this.onclose.bind(this)), (0, y.on)(this.decoder, "decoded", this.ondecoded.bind(this))) } }, { key: "onping", value: function () { this.emitReserved("ping") } }, { key: "ondata", value: function (t) { this.decoder.add(t) } }, { key: "ondecoded", value: function (t) { this.emitReserved("packet", t) } }, { key: "onerror", value: function (t) { this.emitReserved("error", t) } }, { key: "socket", value: function (t, e) { var n = this.nsps[t]; return n || (n = new p.Socket(this, t, e), this.nsps[t] = n), n } }, { key: "_destroy", value: function (t) { for (var e = 0, n = Object.keys(this.nsps); e < n.length; e++) { var r = n[e]; if (this.nsps[r].active) return } this._close() } }, { key: "_packet", value: function (t) { for (var e = this.encoder.encode(t), n = 0; n < e.length; n++)this.engine.write(e[n], t.options) } }, { key: "cleanup", value: function () { this.subs.forEach((function (t) { return t() })), this.subs.length = 0, this.decoder.destroy() } }, { key: "_close", value: function () { this.skipReconnect = !0, this._reconnecting = !1, "opening" === this._readyState && this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.engine && this.engine.close() } }, { key: "disconnect", value: function () { return this._close() } }, { key: "onclose", value: function (t) { this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t), this._reconnection && !this.skipReconnect && this.reconnect() } }, { key: "reconnect", value: function () { var t = this; if (this._reconnecting || this.skipReconnect) return this; var e = this; if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1; else { var n = this.backoff.duration(); this._reconnecting = !0; var r = this.setTimeoutFn((function () { e.skipReconnect || (t.emitReserved("reconnect_attempt", e.backoff.attempts), e.skipReconnect || e.open((function (n) { n ? (e._reconnecting = !1, e.reconnect(), t.emitReserved("reconnect_error", n)) : e.onreconnect() }))) }), n); this.opts.autoUnref && r.unref(), this.subs.push((function () { clearTimeout(r) })) } } }, { key: "onreconnect", value: function () { var t = this.backoff.attempts; this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t) } }]) && o(e.prototype, n), c && o(e, c), v }(n(17).StrictEventEmitter); e.Manager = v }, function (t, e, n) { var r = n(10), o = n(23), i = n(27), s = n(28); e.polling = function (t) { var e = !1, n = !1, s = !1 !== t.jsonp; if ("undefined" != typeof location) { var c = "https:" === location.protocol, a = location.port; a || (a = c ? 443 : 80), e = t.hostname !== location.hostname || a !== t.port, n = t.secure !== c } if (t.xdomain = e, t.xscheme = n, "open" in new r(t) && !t.forceJSONP) return new o(t); if (!s) throw new Error("JSONP disabled"); return new i(t) }, e.websocket = s }, function (t, e, n) { var r = n(22), o = n(0); t.exports = function (t) { var e = t.xdomain, n = t.xscheme, i = t.enablesXDR; try { if ("undefined" != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest } catch (t) { } try { if ("undefined" != typeof XDomainRequest && !n && i) return new XDomainRequest } catch (t) { } if (!e) try { return new (o[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP") } catch (t) { } } }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function i(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function s(t, e) { return (s = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function c(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = u(t); if (e) { var o = u(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return a(this, n) } } function a(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function u(t) { return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var f = n(4), l = n(5), p = n(1), h = n(13), y = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && s(t, e) }(u, t); var e, n, r, a = c(u); function u() { return o(this, u), a.apply(this, arguments) } return e = u, (n = [{ key: "name", get: function () { return "polling" } }, { key: "doOpen", value: function () { this.poll() } }, { key: "pause", value: function (t) { var e = this; this.readyState = "pausing"; var n = function () { e.readyState = "paused", t() }; if (this.polling || !this.writable) { var r = 0; this.polling && (r++, this.once("pollComplete", (function () { --r || n() }))), this.writable || (r++, this.once("drain", (function () { --r || n() }))) } else n() } }, { key: "poll", value: function () { this.polling = !0, this.doPoll(), this.emit("poll") } }, { key: "onData", value: function (t) { var e = this; p.decodePayload(t, this.socket.binaryType).forEach((function (t) { if ("opening" === e.readyState && "open" === t.type && e.onOpen(), "close" === t.type) return e.onClose(), !1; e.onPacket(t) })), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState && this.poll()) } }, { key: "doClose", value: function () { var t = this, e = function () { t.write([{ type: "close" }]) }; "open" === this.readyState ? e() : this.once("open", e) } }, { key: "write", value: function (t) { var e = this; this.writable = !1, p.encodePayload(t, (function (t) { e.doWrite(t, (function () { e.writable = !0, e.emit("drain") })) })) } }, { key: "uri", value: function () { var t = this.query || {}, e = this.opts.secure ? "https" : "http", n = ""; return !1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = h()), this.supportsBinary || t.sid || (t.b64 = 1), t = l.encode(t), this.opts.port && ("https" === e && 443 !== Number(this.opts.port) || "http" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), t.length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t } }]) && i(e.prototype, n), r && i(e, r), u }(f); t.exports = y }, function (t, e) { var n = Object.create(null); n.open = "0", n.close = "1", n.ping = "2", n.pong = "3", n.message = "4", n.upgrade = "5", n.noop = "6"; var r = Object.create(null); Object.keys(n).forEach((function (t) { r[n[t]] = t })); t.exports = { PACKET_TYPES: n, PACKET_TYPES_REVERSE: r, ERROR_PACKET: { type: "error", data: "parser error" } } }, function (t, e, n) { "use strict"; var r, o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), i = {}, s = 0, c = 0; function a(t) { var e = ""; do { e = o[t % 64] + e, t = Math.floor(t / 64) } while (t > 0); return e } function u() { var t = a(+new Date); return t !== r ? (s = 0, r = t) : t + "." + a(s++) } for (; c < 64; c++)i[o[c]] = c; u.encode = a, u.decode = function (t) { var e = 0; for (c = 0; c < t.length; c++)e = 64 * e + i[t.charAt(c)]; return e }, t.exports = u }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]; if (!n) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return i(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var s, c = !0, a = !1; return { s: function () { n = n.call(t) }, n: function () { var t = n.next(); return c = t.done, t }, e: function (t) { a = !0, s = t }, f: function () { try { c || null == n.return || n.return() } finally { if (a) throw s } } } } function i(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e, n) { return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = l(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function a(t, e) { return (a = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function u(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = l(t); if (e) { var o = l(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return f(this, n) } } function f(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function l(t) { return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.Socket = void 0; var p = n(6), h = n(16), y = n(17), d = Object.freeze({ connect: 1, connect_error: 1, disconnect: 1, disconnecting: 1, newListener: 1, removeListener: 1 }), v = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && a(t, e) }(f, t); var e, n, r, i = u(f); function f(t, e, n) { var r; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, f), (r = i.call(this)).connected = !1, r.disconnected = !0, r.receiveBuffer = [], r.sendBuffer = [], r.ids = 0, r.acks = {}, r.flags = {}, r.io = t, r.nsp = e, n && n.auth && (r.auth = n.auth), r.io._autoConnect && r.open(), r } return e = f, (n = [{ key: "subEvents", value: function () { if (!this.subs) { var t = this.io; this.subs = [(0, h.on)(t, "open", this.onopen.bind(this)), (0, h.on)(t, "packet", this.onpacket.bind(this)), (0, h.on)(t, "error", this.onerror.bind(this)), (0, h.on)(t, "close", this.onclose.bind(this))] } } }, { key: "active", get: function () { return !!this.subs } }, { key: "connect", value: function () { return this.connected || (this.subEvents(), this.io._reconnecting || this.io.open(), "open" === this.io._readyState && this.onopen()), this } }, { key: "open", value: function () { return this.connect() } }, { key: "send", value: function () { for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)e[n] = arguments[n]; return e.unshift("message"), this.emit.apply(this, e), this } }, { key: "emit", value: function (t) { if (d.hasOwnProperty(t)) throw new Error('"' + t + '" is a reserved event name'); for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)n[r - 1] = arguments[r]; n.unshift(t); var o = { type: p.PacketType.EVENT, data: n, options: {} }; o.options.compress = !1 !== this.flags.compress, "function" == typeof n[n.length - 1] && (this.acks[this.ids] = n.pop(), o.id = this.ids++); var i = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable, s = this.flags.volatile && (!i || !this.connected); return s || (this.connected ? this.packet(o) : this.sendBuffer.push(o)), this.flags = {}, this } }, { key: "packet", value: function (t) { t.nsp = this.nsp, this.io._packet(t) } }, { key: "onopen", value: function () { var t = this; "function" == typeof this.auth ? this.auth((function (e) { t.packet({ type: p.PacketType.CONNECT, data: e }) })) : this.packet({ type: p.PacketType.CONNECT, data: this.auth }) } }, { key: "onerror", value: function (t) { this.connected || this.emitReserved("connect_error", t) } }, { key: "onclose", value: function (t) { this.connected = !1, this.disconnected = !0, delete this.id, this.emitReserved("disconnect", t) } }, { key: "onpacket", value: function (t) { if (t.nsp === this.nsp) switch (t.type) { case p.PacketType.CONNECT: if (t.data && t.data.sid) { var e = t.data.sid; this.onconnect(e) } else this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)")); break; case p.PacketType.EVENT: case p.PacketType.BINARY_EVENT: this.onevent(t); break; case p.PacketType.ACK: case p.PacketType.BINARY_ACK: this.onack(t); break; case p.PacketType.DISCONNECT: this.ondisconnect(); break; case p.PacketType.CONNECT_ERROR: var n = new Error(t.data.message); n.data = t.data.data, this.emitReserved("connect_error", n) } } }, { key: "onevent", value: function (t) { var e = t.data || []; null != t.id && e.push(this.ack(t.id)), this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e)) } }, { key: "emitEvent", value: function (t) { if (this._anyListeners && this._anyListeners.length) { var e, n = o(this._anyListeners.slice()); try { for (n.s(); !(e = n.n()).done;)e.value.apply(this, t) } catch (t) { n.e(t) } finally { n.f() } } c(l(f.prototype), "emit", this).apply(this, t) } }, { key: "ack", value: function (t) { var e = this, n = !1; return function () { if (!n) { n = !0; for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++)o[i] = arguments[i]; e.packet({ type: p.PacketType.ACK, id: t, data: o }) } } } }, { key: "onack", value: function (t) { var e = this.acks[t.id]; "function" == typeof e && (e.apply(this, t.data), delete this.acks[t.id]) } }, { key: "onconnect", value: function (t) { this.id = t, this.connected = !0, this.disconnected = !1, this.emitBuffered(), this.emitReserved("connect") } }, { key: "emitBuffered", value: function () { var t = this; this.receiveBuffer.forEach((function (e) { return t.emitEvent(e) })), this.receiveBuffer = [], this.sendBuffer.forEach((function (e) { return t.packet(e) })), this.sendBuffer = [] } }, { key: "ondisconnect", value: function () { this.destroy(), this.onclose("io server disconnect") } }, { key: "destroy", value: function () { this.subs && (this.subs.forEach((function (t) { return t() })), this.subs = void 0), this.io._destroy(this) } }, { key: "disconnect", value: function () { return this.connected && this.packet({ type: p.PacketType.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this } }, { key: "close", value: function () { return this.disconnect() } }, { key: "compress", value: function (t) { return this.flags.compress = t, this } }, { key: "volatile", get: function () { return this.flags.volatile = !0, this } }, { key: "onAny", value: function (t) { return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this } }, { key: "prependAny", value: function (t) { return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this } }, { key: "offAny", value: function (t) { if (!this._anyListeners) return this; if (t) { for (var e = this._anyListeners, n = 0; n < e.length; n++)if (t === e[n]) return e.splice(n, 1), this } else this._anyListeners = []; return this } }, { key: "listenersAny", value: function () { return this._anyListeners || [] } }]) && s(e.prototype, n), r && s(e, r), f }(y.StrictEventEmitter); e.Socket = v }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.hasBinary = e.isBinary = void 0; var o = "function" == typeof ArrayBuffer, i = Object.prototype.toString, s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob), c = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File); function a(t) { return o && (t instanceof ArrayBuffer || function (t) { return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer }(t)) || s && t instanceof Blob || c && t instanceof File } e.isBinary = a, e.hasBinary = function t(e, n) { if (!e || "object" !== r(e)) return !1; if (Array.isArray(e)) { for (var o = 0, i = e.length; o < i; o++)if (t(e[o])) return !0; return !1 } if (a(e)) return !0; if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length) return t(e.toJSON(), !0); for (var s in e) if (Object.prototype.hasOwnProperty.call(e, s) && t(e[s])) return !0; return !1 } }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.on = void 0, e.on = function (t, e, n) { return t.on(e, n), function () { t.off(e, n) } } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function i(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function s(t, e, n) { return (s = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function c(t, e) { return (c = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function a(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = f(t); if (e) { var o = f(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } function u(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function f(t) { return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.StrictEventEmitter = void 0; var l = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && c(t, e) }(l, t); var e, n, r, u = a(l); function l() { return o(this, l), u.apply(this, arguments) } return e = l, (n = [{ key: "on", value: function (t, e) { return s(f(l.prototype), "on", this).call(this, t, e), this } }, { key: "once", value: function (t, e) { return s(f(l.prototype), "once", this).call(this, t, e), this } }, { key: "emit", value: function (t) { for (var e, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)r[o - 1] = arguments[o]; return (e = s(f(l.prototype), "emit", this)).call.apply(e, [this, t].concat(r)), this } }, { key: "emitReserved", value: function (t) { for (var e, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)r[o - 1] = arguments[o]; return (e = s(f(l.prototype), "emit", this)).call.apply(e, [this, t].concat(r)), this } }, { key: "listeners", value: function (t) { return s(f(l.prototype), "listeners", this).call(this, t) } }]) && i(e.prototype, n), r && i(e, r), l }(n(2)); e.StrictEventEmitter = l }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.io = e.Socket = e.Manager = e.protocol = void 0; var o = n(19), i = n(8); t.exports = e = c; var s = e.managers = {}; function c(t, e) { "object" === r(t) && (e = t, t = void 0), e = e || {}; var n, c = (0, o.url)(t, e.path || "/socket.io"), a = c.source, u = c.id, f = c.path, l = s[u] && f in s[u].nsps; return e.forceNew || e["force new connection"] || !1 === e.multiplex || l ? n = new i.Manager(a, e) : (s[u] || (s[u] = new i.Manager(a, e)), n = s[u]), c.query && !e.query && (e.query = c.queryKey), n.socket(c.path, e) } e.io = c; var a = n(6); Object.defineProperty(e, "protocol", { enumerable: !0, get: function () { return a.protocol } }), e.connect = c; var u = n(8); Object.defineProperty(e, "Manager", { enumerable: !0, get: function () { return u.Manager } }); var f = n(14); Object.defineProperty(e, "Socket", { enumerable: !0, get: function () { return f.Socket } }), e.default = c }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.url = void 0; var r = n(7); e.url = function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, o = t; n = n || "undefined" != typeof location && location, null == t && (t = n.protocol + "//" + n.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t), /^(https?|wss?):\/\//.test(t) || (t = void 0 !== n ? n.protocol + "//" + t : "https://" + t), o = r(t)), o.port || (/^(http|ws)$/.test(o.protocol) ? o.port = "80" : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")), o.path = o.path || "/"; var i = -1 !== o.host.indexOf(":"), s = i ? "[" + o.host + "]" : o.host; return o.id = o.protocol + "://" + s + ":" + o.port + e, o.href = o.protocol + "://" + s + (n && n.port === o.port ? "" : ":" + o.port), o } }, function (t, e, n) { var r = n(21); t.exports = function (t, e) { return new r(t, e) }, t.exports.Socket = r, t.exports.protocol = r.protocol, t.exports.Transport = n(4), t.exports.transports = n(9), t.exports.parser = n(1) }, function (t, e, n) { function r() { return (r = Object.assign || function (t) { for (var e = 1; e < arguments.length; e++) { var n = arguments[e]; for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]) } return t }).apply(this, arguments) } function o(t) { return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function i(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e) { return (c = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function a(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = l(t); if (e) { var o = l(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } function u(t, e) { if (e && ("object" === o(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return f(t) } function f(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function l(t) { return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var p = n(9), h = n(2), y = n(1), d = n(7), v = n(5), b = n(3).installTimerFunctions, m = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && c(t, e) }(h, t); var e, n, u, l = a(h); function h(t) { var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i(this, h), e = l.call(this), t && "object" === o(t) && (n = t, t = null), t ? (t = d(t), n.hostname = t.host, n.secure = "https" === t.protocol || "wss" === t.protocol, n.port = t.port, t.query && (n.query = t.query)) : n.host && (n.hostname = d(n.host).host), b(f(e), n), e.secure = null != n.secure ? n.secure : "undefined" != typeof location && "https:" === location.protocol, n.hostname && !n.port && (n.port = e.secure ? "443" : "80"), e.hostname = n.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), e.port = n.port || ("undefined" != typeof location && location.port ? location.port : e.secure ? 443 : 80), e.transports = n.transports || ["polling", "websocket"], e.readyState = "", e.writeBuffer = [], e.prevBufferLen = 0, e.opts = r({ path: "/engine.io", agent: !1, withCredentials: !1, upgrade: !0, jsonp: !0, timestampParam: "t", rememberUpgrade: !1, rejectUnauthorized: !0, perMessageDeflate: { threshold: 1024 }, transportOptions: {}, closeOnBeforeunload: !0 }, n), e.opts.path = e.opts.path.replace(/\/$/, "") + "/", "string" == typeof e.opts.query && (e.opts.query = v.decode(e.opts.query)), e.id = null, e.upgrades = null, e.pingInterval = null, e.pingTimeout = null, e.pingTimeoutTimer = null, "function" == typeof addEventListener && (e.opts.closeOnBeforeunload && addEventListener("beforeunload", (function () { e.transport && (e.transport.removeAllListeners(), e.transport.close()) }), !1), "localhost" !== e.hostname && (e.offlineEventListener = function () { e.onClose("transport close") }, addEventListener("offline", e.offlineEventListener, !1))), e.open(), e } return e = h, (n = [{ key: "createTransport", value: function (t) { var e = function (t) { var e = {}; for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]); return e }(this.opts.query); e.EIO = y.protocol, e.transport = t, this.id && (e.sid = this.id); var n = r({}, this.opts.transportOptions[t], this.opts, { query: e, socket: this, hostname: this.hostname, secure: this.secure, port: this.port }); return new p[t](n) } }, { key: "open", value: function () { var t, e = this; if (this.opts.rememberUpgrade && h.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket"; else { if (0 === this.transports.length) return void this.setTimeoutFn((function () { e.emit("error", "No transports available") }), 0); t = this.transports[0] } this.readyState = "opening"; try { t = this.createTransport(t) } catch (t) { return this.transports.shift(), void this.open() } t.open(), this.setTransport(t) } }, { key: "setTransport", value: function (t) { var e = this; this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (function () { e.onClose("transport close") })) } }, { key: "probe", value: function (t) { var e = this, n = this.createTransport(t, { probe: 1 }), r = !1; h.priorWebsocketSuccess = !1; var o = function () { r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (function (t) { if (!r) if ("pong" === t.type && "probe" === t.data) { if (e.upgrading = !0, e.emit("upgrading", n), !n) return; h.priorWebsocketSuccess = "websocket" === n.name, e.transport.pause((function () { r || "closed" !== e.readyState && (f(), e.setTransport(n), n.send([{ type: "upgrade" }]), e.emit("upgrade", n), n = null, e.upgrading = !1, e.flush()) })) } else { var o = new Error("probe error"); o.transport = n.name, e.emit("upgradeError", o) } }))) }; function i() { r || (r = !0, f(), n.close(), n = null) } var s = function (t) { var r = new Error("probe error: " + t); r.transport = n.name, i(), e.emit("upgradeError", r) }; function c() { s("transport closed") } function a() { s("socket closed") } function u(t) { n && t.name !== n.name && i() } var f = function () { n.removeListener("open", o), n.removeListener("error", s), n.removeListener("close", c), e.removeListener("close", a), e.removeListener("upgrading", u) }; n.once("open", o), n.once("error", s), n.once("close", c), this.once("close", a), this.once("upgrading", u), n.open() } }, { key: "onOpen", value: function () { if (this.readyState = "open", h.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.opts.upgrade && this.transport.pause) for (var t = 0, e = this.upgrades.length; t < e; t++)this.probe(this.upgrades[t]) } }, { key: "onPacket", value: function (t) { if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (this.emit("packet", t), this.emit("heartbeat"), t.type) { case "open": this.onHandshake(JSON.parse(t.data)); break; case "ping": this.resetPingTimeout(), this.sendPacket("pong"), this.emit("ping"), this.emit("pong"); break; case "error": var e = new Error("server error"); e.code = t.data, this.onError(e); break; case "message": this.emit("data", t.data), this.emit("message", t.data) } } }, { key: "onHandshake", value: function (t) { this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && this.resetPingTimeout() } }, { key: "resetPingTimeout", value: function () { var t = this; this.clearTimeoutFn(this.pingTimeoutTimer), this.pingTimeoutTimer = this.setTimeoutFn((function () { t.onClose("ping timeout") }), this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref() } }, { key: "onDrain", value: function () { this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush() } }, { key: "flush", value: function () { "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush")) } }, { key: "write", value: function (t, e, n) { return this.sendPacket("message", t, e, n), this } }, { key: "send", value: function (t, e, n) { return this.sendPacket("message", t, e, n), this } }, { key: "sendPacket", value: function (t, e, n, r) { if ("function" == typeof e && (r = e, e = void 0), "function" == typeof n && (r = n, n = null), "closing" !== this.readyState && "closed" !== this.readyState) { (n = n || {}).compress = !1 !== n.compress; var o = { type: t, data: e, options: n }; this.emit("packetCreate", o), this.writeBuffer.push(o), r && this.once("flush", r), this.flush() } } }, { key: "close", value: function () { var t = this, e = function () { t.onClose("forced close"), t.transport.close() }, n = function n() { t.removeListener("upgrade", n), t.removeListener("upgradeError", n), e() }, r = function () { t.once("upgrade", n), t.once("upgradeError", n) }; return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", (function () { t.upgrading ? r() : e() })) : this.upgrading ? r() : e()), this } }, { key: "onError", value: function (t) { h.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t) } }, { key: "onClose", value: function (t, e) { "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (this.clearTimeoutFn(this.pingIntervalTimer), this.clearTimeoutFn(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), "function" == typeof removeEventListener && removeEventListener("offline", this.offlineEventListener, !1), this.readyState = "closed", this.id = null, this.emit("close", t, e), this.writeBuffer = [], this.prevBufferLen = 0) } }, { key: "filterUpgrades", value: function (t) { for (var e = [], n = 0, r = t.length; n < r; n++)~this.transports.indexOf(t[n]) && e.push(t[n]); return e } }]) && s(e.prototype, n), u && s(e, u), h }(h); m.priorWebsocketSuccess = !1, m.protocol = y.protocol, t.exports = m }, function (t, e) { try { t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest } catch (e) { t.exports = !1 } }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o() { return (o = Object.assign || function (t) { for (var e = 1; e < arguments.length; e++) { var n = arguments[e]; for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]) } return t }).apply(this, arguments) } function i(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e, n) { return e && s(t.prototype, e), n && s(t, n), t } function a(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && u(t, e) } function u(t, e) { return (u = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function f(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = h(t); if (e) { var o = h(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return l(this, n) } } function l(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return p(t) } function p(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function h(t) { return (h = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var y = n(10), d = n(11), v = n(2), b = n(3), m = b.pick, g = b.installTimerFunctions, k = n(0); function w() { } var O = null != new y({ xdomain: !1 }).responseType, _ = function (t) { a(n, t); var e = f(n); function n(t) { var r; if (i(this, n), r = e.call(this, t), "undefined" != typeof location) { var o = "https:" === location.protocol, s = location.port; s || (s = o ? 443 : 80), r.xd = "undefined" != typeof location && t.hostname !== location.hostname || s !== t.port, r.xs = t.secure !== o } var c = t && t.forceBase64; return r.supportsBinary = O && !c, r } return c(n, [{ key: "request", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return o(t, { xd: this.xd, xs: this.xs }, this.opts), new E(this.uri(), t) } }, { key: "doWrite", value: function (t, e) { var n = this, r = this.request({ method: "POST", data: t }); r.on("success", e), r.on("error", (function (t) { n.onError("xhr post error", t) })) } }, { key: "doPoll", value: function () { var t = this, e = this.request(); e.on("data", this.onData.bind(this)), e.on("error", (function (e) { t.onError("xhr poll error", e) })), this.pollXhr = e } }]), n }(d), E = function (t) { a(n, t); var e = f(n); function n(t, r) { var o; return i(this, n), o = e.call(this), g(p(o), r), o.opts = r, o.method = r.method || "GET", o.uri = t, o.async = !1 !== r.async, o.data = void 0 !== r.data ? r.data : null, o.create(), o } return c(n, [{ key: "create", value: function () { var t = this, e = m(this.opts, "agent", "enablesXDR", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref"); e.xdomain = !!this.opts.xd, e.xscheme = !!this.opts.xs; var r = this.xhr = new y(e); try { r.open(this.method, this.uri, this.async); try { if (this.opts.extraHeaders) for (var o in r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0), this.opts.extraHeaders) this.opts.extraHeaders.hasOwnProperty(o) && r.setRequestHeader(o, this.opts.extraHeaders[o]) } catch (t) { } if ("POST" === this.method) try { r.setRequestHeader("Content-type", "text/plain;charset=UTF-8") } catch (t) { } try { r.setRequestHeader("Accept", "*/*") } catch (t) { } "withCredentials" in r && (r.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (r.timeout = this.opts.requestTimeout), this.hasXDR() ? (r.onload = function () { t.onLoad() }, r.onerror = function () { t.onError(r.responseText) }) : r.onreadystatechange = function () { 4 === r.readyState && (200 === r.status || 1223 === r.status ? t.onLoad() : t.setTimeoutFn((function () { t.onError("number" == typeof r.status ? r.status : 0) }), 0)) }, r.send(this.data) } catch (e) { return void this.setTimeoutFn((function () { t.onError(e) }), 0) } "undefined" != typeof document && (this.index = n.requestsCount++, n.requests[this.index] = this) } }, { key: "onSuccess", value: function () { this.emit("success"), this.cleanup() } }, { key: "onData", value: function (t) { this.emit("data", t), this.onSuccess() } }, { key: "onError", value: function (t) { this.emit("error", t), this.cleanup(!0) } }, { key: "cleanup", value: function (t) { if (void 0 !== this.xhr && null !== this.xhr) { if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = w : this.xhr.onreadystatechange = w, t) try { this.xhr.abort() } catch (t) { } "undefined" != typeof document && delete n.requests[this.index], this.xhr = null } } }, { key: "onLoad", value: function () { var t = this.xhr.responseText; null !== t && this.onData(t) } }, { key: "hasXDR", value: function () { return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR } }, { key: "abort", value: function () { this.cleanup() } }]), n }(v); if (E.requestsCount = 0, E.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", S); else if ("function" == typeof addEventListener) { addEventListener("onpagehide" in k ? "pagehide" : "unload", S, !1) } function S() { for (var t in E.requests) E.requests.hasOwnProperty(t) && E.requests[t].abort() } t.exports = _, t.exports.Request = E }, function (t, e, n) { var r = n(12).PACKET_TYPES, o = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), i = "function" == typeof ArrayBuffer, s = function (t, e) { var n = new FileReader; return n.onload = function () { var t = n.result.split(",")[1]; e("b" + t) }, n.readAsDataURL(t) }; t.exports = function (t, e, n) { var c, a = t.type, u = t.data; return o && u instanceof Blob ? e ? n(u) : s(u, n) : i && (u instanceof ArrayBuffer || (c = u, "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(c) : c && c.buffer instanceof ArrayBuffer)) ? e ? n(u instanceof ArrayBuffer ? u : u.buffer) : s(new Blob([u]), n) : n(r[a] + (u || "")) } }, function (t, e, n) { var r, o = n(12), i = o.PACKET_TYPES_REVERSE, s = o.ERROR_PACKET; "function" == typeof ArrayBuffer && (r = n(26)); var c = function (t, e) { if (r) { var n = r.decode(t); return a(n, e) } return { base64: !0, data: t } }, a = function (t, e) { switch (e) { case "blob": return t instanceof ArrayBuffer ? new Blob([t]) : t; case "arraybuffer": default: return t } }; t.exports = function (t, e) { if ("string" != typeof t) return { type: "message", data: a(t, e) }; var n = t.charAt(0); return "b" === n ? { type: "message", data: c(t.substring(1), e) } : i[n] ? t.length > 1 ? { type: i[n], data: t.substring(1) } : { type: i[n] } : s } }, function (t, e) { !function (t) { "use strict"; e.encode = function (e) { var n, r = new Uint8Array(e), o = r.length, i = ""; for (n = 0; n < o; n += 3)i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]]; return o % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i }, e.decode = function (e) { var n, r, o, i, s, c = .75 * e.length, a = e.length, u = 0; "=" === e[e.length - 1] && (c--, "=" === e[e.length - 2] && c--); var f = new ArrayBuffer(c), l = new Uint8Array(f); for (n = 0; n < a; n += 4)r = t.indexOf(e[n]), o = t.indexOf(e[n + 1]), i = t.indexOf(e[n + 2]), s = t.indexOf(e[n + 3]), l[u++] = r << 2 | o >> 4, l[u++] = (15 & o) << 4 | i >> 2, l[u++] = (3 & i) << 6 | 63 & s; return f } }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/") }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e, n) { return (i = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function s(t, e) { return (s = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function c(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = f(t); if (e) { var o = f(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return a(this, n) } } function a(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return u(t) } function u(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function f(t) { return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var l, p = n(11), h = n(0), y = /\n/g, d = /\\n/g, v = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && s(t, e) }(p, t); var e, n, r, a = c(p); function p(t) { var e; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, p), (e = a.call(this, t)).query = e.query || {}, l || (l = h.___eio = h.___eio || []), e.index = l.length, l.push(e.onData.bind(u(e))), e.query.j = e.index, e } return e = p, (n = [{ key: "supportsBinary", get: function () { return !1 } }, { key: "doClose", value: function () { this.script && (this.script.onerror = function () { }, this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i(f(p.prototype), "doClose", this).call(this) } }, { key: "doPoll", value: function () { var t = this, e = document.createElement("script"); this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) { t.onError("jsonp poll error", e) }; var n = document.getElementsByTagName("script")[0]; n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), this.script = e, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && this.setTimeoutFn((function () { var t = document.createElement("iframe"); document.body.appendChild(t), document.body.removeChild(t) }), 100) } }, { key: "doWrite", value: function (t, e) { var n, r = this; if (!this.form) { var o = document.createElement("form"), i = document.createElement("textarea"), s = this.iframeId = "eio_iframe_" + this.index; o.className = "socketio", o.style.position = "absolute", o.style.top = "-1000px", o.style.left = "-1000px", o.target = s, o.method = "POST", o.setAttribute("accept-charset", "utf-8"), i.name = "d", o.appendChild(i), document.body.appendChild(o), this.form = o, this.area = i } function c() { a(), e() } this.form.action = this.uri(); var a = function () { if (r.iframe) try { r.form.removeChild(r.iframe) } catch (t) { r.onError("jsonp polling iframe removal error", t) } try { var t = '<iframe src="javascript:0" name="' + r.iframeId + '">'; n = document.createElement(t) } catch (t) { (n = document.createElement("iframe")).name = r.iframeId, n.src = "javascript:0" } n.id = r.iframeId, r.form.appendChild(n), r.iframe = n }; a(), t = t.replace(d, "\\\n"), this.area.value = t.replace(y, "\\n"); try { this.form.submit() } catch (t) { } this.iframe.attachEvent ? this.iframe.onreadystatechange = function () { "complete" === r.iframe.readyState && c() } : this.iframe.onload = c } }]) && o(e.prototype, n), r && o(e, r), p }(p); t.exports = v }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = a(t); if (e) { var o = a(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { if (e && ("object" === r(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function a(t) { return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var u = n(4), f = n(1), l = n(5), p = n(13), h = n(3).pick, y = n(29), d = y.WebSocket, v = y.usingBrowserWebSocket, b = y.defaultBinaryType, m = y.nextTick, g = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), k = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(a, t); var e, n, r, c = s(a); function a(t) { var e; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, a), (e = c.call(this, t)).supportsBinary = !t.forceBase64, e } return e = a, (n = [{ key: "name", get: function () { return "websocket" } }, { key: "doOpen", value: function () { if (this.check()) { var t = this.uri(), e = this.opts.protocols, n = g ? {} : h(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity"); this.opts.extraHeaders && (n.headers = this.opts.extraHeaders); try { this.ws = v && !g ? e ? new d(t, e) : new d(t) : new d(t, e, n) } catch (t) { return this.emit("error", t) } this.ws.binaryType = this.socket.binaryType || b, this.addEventListeners() } } }, { key: "addEventListeners", value: function () { var t = this; this.ws.onopen = function () { t.opts.autoUnref && t.ws._socket.unref(), t.onOpen() }, this.ws.onclose = this.onClose.bind(this), this.ws.onmessage = function (e) { return t.onData(e.data) }, this.ws.onerror = function (e) { return t.onError("websocket error", e) } } }, { key: "write", value: function (t) { var e = this; this.writable = !1; for (var n = function (n) { var r = t[n], o = n === t.length - 1; f.encodePacket(r, e.supportsBinary, (function (t) { var n = {}; v || (r.options && (n.compress = r.options.compress), e.opts.perMessageDeflate && ("string" == typeof t ? Buffer.byteLength(t) : t.length) < e.opts.perMessageDeflate.threshold && (n.compress = !1)); try { v ? e.ws.send(t) : e.ws.send(t, n) } catch (t) { } o && m((function () { e.writable = !0, e.emit("drain") }), e.setTimeoutFn) })) }, r = 0; r < t.length; r++)n(r) } }, { key: "onClose", value: function () { u.prototype.onClose.call(this) } }, { key: "doClose", value: function () { void 0 !== this.ws && (this.ws.close(), this.ws = null) } }, { key: "uri", value: function () { var t = this.query || {}, e = this.opts.secure ? "wss" : "ws", n = ""; return this.opts.port && ("wss" === e && 443 !== Number(this.opts.port) || "ws" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), this.opts.timestampRequests && (t[this.opts.timestampParam] = p()), this.supportsBinary || (t.b64 = 1), (t = l.encode(t)).length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t } }, { key: "check", value: function () { return !(!d || "__initialize" in d && this.name === a.prototype.name) } }]) && o(e.prototype, n), r && o(e, r), a }(u); t.exports = k }, function (t, e, n) { var r = n(0), o = "function" == typeof Promise && "function" == typeof Promise.resolve ? function (t) { return Promise.resolve().then(t) } : function (t, e) { return e(t, 0) }; t.exports = { WebSocket: r.WebSocket || r.MozWebSocket, usingBrowserWebSocket: !0, defaultBinaryType: "arraybuffer", nextTick: o } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.reconstructPacket = e.deconstructPacket = void 0; var o = n(15); e.deconstructPacket = function (t) { var e = [], n = t.data, i = t; return i.data = function t(e, n) { if (!e) return e; if (o.isBinary(e)) { var i = { _placeholder: !0, num: n.length }; return n.push(e), i } if (Array.isArray(e)) { for (var s = new Array(e.length), c = 0; c < e.length; c++)s[c] = t(e[c], n); return s } if ("object" === r(e) && !(e instanceof Date)) { var a = {}; for (var u in e) e.hasOwnProperty(u) && (a[u] = t(e[u], n)); return a } return e }(n, e), i.attachments = e.length, { packet: i, buffers: e } }, e.reconstructPacket = function (t, e) { return t.data = function t(e, n) { if (!e) return e; if (e && e._placeholder) return n[e.num]; if (Array.isArray(e)) for (var o = 0; o < e.length; o++)e[o] = t(e[o], n); else if ("object" === r(e)) for (var i in e) e.hasOwnProperty(i) && (e[i] = t(e[i], n)); return e }(t.data, e), t.attachments = void 0, t } }, function (t, e) { function n(t) { t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0 } t.exports = n, n.prototype.duration = function () { var t = this.ms * Math.pow(this.factor, this.attempts++); if (this.jitter) { var e = Math.random(), n = Math.floor(e * this.jitter * t); t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n } return 0 | Math.min(t, this.max) }, n.prototype.reset = function () { this.attempts = 0 }, n.prototype.setMin = function (t) { this.ms = t }, n.prototype.setMax = function (t) { this.max = t }, n.prototype.setJitter = function (t) { this.jitter = t } }]) }));

var sourceType;
var _agentAsisstSocket = null;
var _agentAssistComponents = {};
var isAutomationOnGoing = false;
var isShowHistoryEnable = false;
var isShowHistoryEnableForMyBot = false;
var autoExhaustiveList;
var searchedVal;
var agentSearchVal;
var custTone;
var frequentlyUsedList;
var isMyBotAutomationOnGoing = false;
var noAutomationrunninginMyBot = true;
var myBotShowHistory = false;
var idsOfMyBotDropDown;
var isOverRideMode = false;
var myBotDropdownHeaderUuids;
var myBotResponseId;
var idsOfDropDown;
var dropdownHeaderUuids;
var responseId;
var userIntentInput;
var answerPlaceableIDs = [];
var dialogName;
var currentTabActive = 'userAutoIcon';
var previousTabActive;
var AgentChatInitialize;
var chatConfig;
var agentContainer;
var previousResp;
var automationNotRanArray = [];
var jwtToken, isCallConversation, parsedCustomData;
var entitiestValueArray;
var previousEntitiesValue;
var isRetore = false;
var userMessage = {};
var numberOfNewMessages = 0;
var newlyAddedMessagesUUIDlist = [];
var newlyAddedIdList = [];
var removedIdListOnScroll = [];
var scrollAtEnd = true;
var selectedFaqList = [];
var lastElementBeforeNewMessage = '';
var isMybotInputResponseClick = false;
var agentAssistResponse = {};
var myBotDataResponse = {};
var waitingTimeForSeeMoreButton = 150;
var waitingTimeForUUID = 100;
var proactiveMode = true;

function koreGenerateUUID() {
    console.info("generating UUID");
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'ua-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
window.AgentAssist = function AgentAssist(containerId, _conversationId, _botId, connectionDetails, urlParams) {
    try {
        let params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (urlParams) {
            params = urlParams;
        }
        sourceType = params.source;
        isCallConversation = params.isCall;
        let decodedCustomData = decodeURI(params.customdata);
        parsedCustomData = JSON.parse(decodedCustomData);
        if (sourceType === 'smartassist-color-scheme') {
            $('body').addClass(sourceType);
        } else {
            $('body').addClass('default-color-scheme')
        }
    } catch (err) {
        console.log(err);
    }
    var webSocketConnection = {
        "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket'],  query: {'jToken': connectionDetails.jwtToken}
    };
    connectionDetails['webSocketConnectionDomain'] = connectionDetails.envinormentUrl + "/koreagentassist",
        connectionDetails['webSocketConnectionDetails'] = webSocketConnection,
        agentContainer = containerId;
    createAgentAssistContainer(agentContainer, _conversationId, _botId, connectionDetails);
    document.getElementById("loader").style.display = "none";
    // var token, botID, agentAssistUrl;
    if (connectionDetails.isAuthentication) {
        var jsonData = {
            "clientId": connectionDetails.botDetails.clientId,
            "clientSecret": connectionDetails.botDetails.clientSecret,
            "identity": koreGenerateUUID(),
            "aud": "",
            "isAnonymous": false
        };

        callSts(jsonData)

    } else if (connectionDetails.jwtToken) {
        jwtToken = connectionDetails.jwtToken;
        grantCall(connectionDetails.jwtToken, _botId, connectionDetails.envinormentUrl);
    } else {
        console.error("authentication failed")
    }

    function callSts() {
        $.ajax({
            url: "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts",
            type: 'post',
            data: jsonData,
            dataType: 'json',
            success: function (data) {
                jwtToken = data.jwt;
                grantCall(data.jwt, _botId, connectionDetails.envinormentUrl);
            },
            error: function (err) {
                console.error("jwt token generation failed");
            }
        });
    }

    function getToken() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        token = params.token;
        botID = params.botid;
        agentAssistUrl = params.agentassisturl;
        if (token && botID && agentAssistUrl) {
            return true;
        } else {
            return false;
        }
    }

    function grantCall(jwtID, botid, url) {
        document.getElementById("loader").style.display = "block";
        var payload = {
            "assertion": jwtID,
            "botInfo": {
                "chatBot": "sample Bot",
                "taskBotId": botid
            },
            "token": {}
        }
        $.ajax({
            url: url + '/api/1.1/oAuth/token/jwtgrant',
            type: 'POST',
            crossDomain: true,
            contentType: 'application/json',
            headers: {
                'User-Agent': this.userAgent,
                "content-type": 'application/json'
            },
            data: JSON.stringify(payload),
            dataType: "json",
            success: function (result) {
                var navigatefromLibToTab;
                let isOnlyOneFaqOnSearch = false;
                let isInitialDialogOnGoing = false;
                let isSendWelcomeMessage;
                let isShowAllClicked = false;
                chatConfig = window.KoreSDK.chatConfig;
                var koreBot = koreBotChat();
                AgentChatInitialize = new koreBot.chatWindow(chatConfig);
                AgentChatInitialize.customTemplateObj = new customTemplate(chatConfig, AgentChatInitialize);
                let isUpdateFeedBackDetailsFlag = false;
                let docs = document.getElementById('chat-window-footer');
                docs.hidden = true;
                _userTranscript = false;
                console.log("AgentAssist >>> no of agent assist instances", _agentAssistComponents);
                renderingHistoryMessage();
                if (!window._agentAssisteventListenerAdded) {
                    btnInit(containerId);
                    // eventListener for removing the ended currentconversation from the localStorage
                    // window.addEventListener("message", function (e) {
                    //     console.log(e.data);//your data is captured in e.data
                    //     let currentEndedConversationId = e.data.convsId;
                    //     var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    //     var appState = JSON.parse(appStateStr);
                    //     if (appState[currentEndedConversationId]) {
                    //         delete appState[currentEndedConversationId];
                    //     }
                    // });

                    window.addEventListener("message", function (e) {
                        console.log(e.data, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx message came to widget when any message came from others", isOverRideMode);//your data is captured in e.data
                        if(e.data.name === 'response_resolution_comments' && e.data.conversationId == _conversationId) {
                            $(`#summary`).removeClass('hide');
                            $(`#summaryText`).val(e.data?.summary ? e.data?.summary[0]?.summary_text:'');
                            $(`#summarySubmit`).attr('data-summary', e.data?JSON.stringify(e.data):'')
                        }
                        if(e.data.name == 'initial_data'){
                          e.data?.data?.forEach((ele)=>{
                            var agent_assist_request = {
                                'conversationId': ele.conversationId,
                                'query': ele.value,
                                'query': sanitizeHTML(ele.value),
                                'botId': ele.botId,
                                'agentId': '',
                                'experience': isCallConversation === 'true' ? 'voice':'chat',
                                'positionId': ele?.positionId
                            }
                            if (ele?.intentName) {
                                agent_assist_request['intentName'] = ele.value;
                            }
                            if (ele?.entities) {
                                agent_assist_request['entities'] = ele.entities;
                            } else {
                                agent_assist_request['entities'] = [];
                            }
                            if(ele.conversationId == _conversationId){
                                _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                            }      
                          })
                        }
                        if(e.data.name ==='agentAssist.endOfConversation' && e.data.conversationId) {
                            let currentEndedConversationId = e.data.conversationId;
                            var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                            var appState = JSON.parse(appStateStr);
                            if (appState[currentEndedConversationId]) {
                                let request_resolution_comments = {
                                    conversationId: e.data?.conversationId,
                                    userId: '',
                                    botId: _botId,
                                    sessionId: koreGenerateUUID(),
                                    chatHistory: e.data?.payload?.chatHistory
                                }
                                _agentAsisstSocket.emit('request_resolution_comments', request_resolution_comments);
                                console.log("request_resolution_comments event published", request_resolution_comments)
                               // localStorage.clear(appState[currentEndedConversationId]);
                               delete appState[currentEndedConversationId];
                            }
                            return;
                        }
                        // if(e.data.convsId) {
                        //     let currentEndedConversationId = e.data.convsId;
                        //     var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        //     var appState = JSON.parse(appStateStr);
                        //     if (appState[currentEndedConversationId]) {
                        //         delete appState[currentEndedConversationId];
                        //     }
                        //     return;
                        // }
                        let userInputData = e.data;
                        let agent_assist_request = {
                            'author': {
                                "firstName": userInputData.author?.firstName,
                                "lastName": userInputData.author?.lastName,
                                "type": userInputData.author?.type
                            },
                            'botId': _botId,
                            'conversationId': userInputData.conversationid,
                            'experience': isCallConversation === 'true' ? 'voice':'chat',
                            'query': sanitizeHTML(userInputData.value),
                        }
                        let user_messsage = {
                            "botId": _botId,
                            "type": "text",
                            "conversationId": userInputData.conversationid,
                            "value": sanitizeHTML(userInputData.value),
                            "author": {
                                "firstName": userInputData.author?.firstName,
                                "lastName": userInputData.author?.lastName,
                                "type": userInputData.author?.type
                            },
                            "event": "user_message"
                        }

                        
                        if (isCallConversation === 'true') {
                            prepareConversation();
                            if (userInputData.author.type === 'USER') {
                                processTranscriptData(userInputData, userInputData.conversationid, _botId,);
                                if(isOverRideMode) {
                                    _agentAsisstSocket.emit('user_message', user_messsage)
                                }else{
                                    _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                                }

                            } else {
                                processAgentMessages(userInputData)
                            }
                        } else {
                            if (userInputData?.author?.type === 'USER') {
                                if(isOverRideMode) {
                                   _agentAsisstSocket.emit('user_message', user_messsage)
                                }else{
                                    _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                                }
                                
                            }
                        }
                    })

                    window.addEventListener('agentAssist.endOfConversation', function(e){
                        console.log("----endOfConversation event captured ", e)
                       
                    })
                }
                var _agentAssistDataObj = this;
                var publicAPIs = {};
                $(`#${containerId}`).attr('data-convos-id', `userIDs-${_conversationId}`);

                publicAPIs.botId = _agentAssistDataObj.botId = _botId;
                publicAPIs.containerId = _agentAssistDataObj.containerId = containerId;
                publicAPIs._conversationId = _agentAssistDataObj.conversationId = _conversationId;
                if (!_agentAssistComponents[_agentAssistDataObj.conversationId]) {
                    _agentAssistComponents[_agentAssistDataObj.conversationId] = _agentAssistDataObj;
                } else {
                    _agentAssistDataObj = _agentAssistComponents[_agentAssistDataObj.conversationId];
                }
                if (_agentAsisstSocket === null) {
                    _agentAsisstSocket = io(connectionDetails.webSocketConnectionDomain, connectionDetails.webSocketConnectionDetails);
                    _agentAsisstSocket.on("connect", () => {
                        console.log("AgentAssist >>> socket connected");
                        if(sourceType === 'smartassist-color-scheme') {
                            var message = {
                                method: 'connected',
                                name: "agentAssist.socketConnect",
                                conversationId: _conversationId
                            };
                            window.parent.postMessage(message, '*');
                        }
                    });

                    _agentAsisstSocket.on('agent_assist_response', (data) => {
                        let shouldProcessResponse = false;
                        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        var appState = JSON.parse(appStateStr);
                        if (appState[_conversationId]) {
                            // if incoming data belongs to welcome message do nothing
                            if (!data.suggestions && data.buttons?.length > 1) {
                                if (appState[_conversationId].isWelcomeProcessed && !appState[_conversationId].automationGoingOn && document.getElementsByClassName('.welcome-msg').length > 0) {
                                    return;
                                }
                            }
                            shouldProcessResponse = true;
                        } else {
                            shouldProcessResponse = true;
                        }
                        if (!shouldProcessResponse) {
                            return;
                        }
                        if(!(isAutomationOnGoing && data.suggestions)){
                            updateNumberOfMessages();
                        }

                        var overRideObj = {
                            "agentId": "",
                            "botId": _botId,
                            "conversationId": _agentAssistDataObj.conversationId,
                            "query": "",
                            'experience': isCallConversation === 'true' ? 'voice':'chat',
                            "enable_override_userinput": false
                        }
                        if(isOverRideMode) {
                             _agentAsisstSocket.emit('enable_override_userinput', overRideObj)
                        }
                        isOverRideMode = false;
                        displayCustomerFeels(data, data.conversationId, _botId);

                        updateAgentAssistState(_conversationId, 'assistTab', data);

                        processAgentAssistResponse(data, data.conversationId, _botId);
                        removingSendCopyBtnForCall();
                        document.getElementById("loader").style.display = "none";
                        // let request_resolution_comments = {
                        //     conversationId: data.conversationId,
                        //     userId: '',
                        //     botId: _botId,
                        //     sessionId: koreGenerateUUID(),
                        //     chatHistory: []
                        // }
                        // _agentAsisstSocket.emit('request_resolution_comments', request_resolution_comments);
                        // document.getElementById("addRemoveDropDown").style.display = "block";
                    })

                    _agentAsisstSocket.on('agent_feedback_response', (data) => {
                        if(isUpdateFeedBackDetailsFlag) {
                            UpdateFeedBackDetails(data);
                        }
                    })
                    _agentAsisstSocket.on("agent_assist_endoftask", (data)=>{
                        dialogTerminatedOrIntruppted(data, data.botId, userIntentInput)
                    })


                    _agentAsisstSocket.on('user_message', (data) => {
                        // updateNumberOfMessages();
                        processUserMessage(data, data.conversationId, _botId);
                        userMessage = data;
                    });
                    _agentAsisstSocket.on('agent_assist_user_message', (data) => {
                        updateNumberOfMessages();
                      //  updateAgentAssistState(_conversationId, 'assistTab', data);
                        processUserMessages(data, data.conversationId, data.botId);
                        removingSendCopyBtnForCall();
                    });

                    _agentAsisstSocket.on('user_message', (data) => {
                        // $(`#scriptContainer .empty-data-no-agents`).addClass('hide');
                        prepareConversation();
                        isCallConversation === 'true' ? processTranscriptData(data, data.conversationId, data.botId) : '';
                    })

                    _agentAsisstSocket.on('agent_message', (data) => {
                        // $(`#scriptContainer .empty-data-no-agents`).addClass('hide')
                        prepareConversation();
                        isCallConversation === 'true' ? processAgentMessages(data) : '';
                    })
                    // Library Automation list, Search and Agent-Automation tabs related webSockets
                    // Response
                    _agentAsisstSocket.on('agent_assist_agent_response', (data) => {
                        displayCustomerFeels(data, data.conversationId, data.botId);
                        if (data.isSearch) {
                            processAgentIntentResults(data, data.conversationId, data.botId);
                            document.getElementById("loader").style.display = "none";
                            document.getElementById("overLaySearch").style.display = "block";
                            document.getElementById("overLayAutoSearch").style.display = "block";
                            $('#overLayAutoSearch').html('');
                            $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            $('.search-block').find('.search-results-text-in-lib').remove();
                        } else {
                          //  updateAgentAssistState(_conversationId, 'myBotTab', data);
                            // if(!(isMyBotAutomationOnGoing && data.suggestions)){
                            //     updateNumberOfMessages();
                            // }
                            processMybotDataResponse(data, data.conversationId, data.botId);
                            document.getElementById("loader").style.display = "none";
                        }
                        removingSendCopyBtnForCall();
                        // processAgentIntentResults(data, data.conversationId, data.botId);
                    })
                    // Get useCases List Data
                    _agentAsisstSocket.on('agent_menu_response', (data) => {
                        payloadData = {
                            "useCases": true,
                            "botId": data.botId,
                            "conversationId": data.conversationId,
                            "event": "agent_menu_response",
                            "suggestions": {
                                "dialogs": [],
                            }
                        }

                        // dataTransformation
                        usecasesArr = (data.usecases);
                        payloadData.suggestions.dialogs = (usecasesArr.map(dialog => dialog.usecaseName)).map(dlg => ({ 'name': dlg }))
                        // payloadData.suggestions.dialogs = []
                        autoExhaustiveList = payloadData;

                        processAgentIntentResults(payloadData, payloadData.conversationId, payloadData.botId);
                        removingSendCopyBtnForCall();
                    });
                    const channel = new BroadcastChannel('app-data');
                    channel.addEventListener('message', (event) => {
                        console.log("event recived", event.data);
                        let agent_assist_request = {
                            'conversationId': _agentAssistDataObj.conversationId,
                            'query': sanitizeHTML(event.data.value),
                            'botId': _agentAssistDataObj.botId,
                            'experience': isCallConversation === 'true' ? 'voice':'chat'
                        }
                        _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                    });

                    _agentAsisstSocket.on('response_resolution_comments', (data) => {
                        $(`#summary`).removeClass('hide');
                        $(`#summaryText`).val(data?.summary ? data?.summary[0]?.summary_text:''); 
                        $(`#summarySubmit`).attr('data-summary', data?JSON.stringify(data):'')
                    });

                }


                if (isCallConversation === 'true') {
                    currentTabActive = 'transcriptIcon';
                    $('#transcriptIcon').removeClass('hide');
                    transcriptionTabActive();
                }
                
                renderingAgentHistoryMessage();
                
                // var agent_menu_request = {
                //     "botId": _agentAssistDataObj.botId,
                //     "conversationId": _agentAssistDataObj.conversationId,
                //     "experience": "chat"
                // }
                // _agentAsisstSocket.emit('agent_menu_request', agent_menu_request)

                function removingSendCopyBtnForCall(){
                    if (isCallConversation === 'true') {
                        $(document.body).find('[id="sendMsg"], .copy-btn').remove();
                    }
                }

                function formatSearchAssistData(suggestions){
            
                    let searchAssistData = suggestions.searchassist;
                    let articlesData = [];
                    for(let source in searchAssistData){
                        articlesData.push.apply(articlesData,searchAssistData[source]);
                    }
                    suggestions.articles = articlesData;
                    console.log(suggestions, "suggestions");
                    return suggestions;
                }

                function processUserMessages(data, conversationId, botId) {
                    var _msgsResponse = {
                        "type": "bot_response",
                        "from": "bot",
                        "message": [

                        ],
                        "messageId": data._id,
                        "botInfo": {
                            "chatBot": "sample Bot",
                            "taskBotId": botId
                        },
                        "createdOn": "2022-03-21T07:56:18.225Z",
                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                        "traceId": "873209019a5adc26"
                    }
                    let _id = Math.floor(Math.random() * 100);
                    let body = {};
                    body['type'] = 'text';
                    body['component'] = {
                        "type": 'text',
                        "payload": {
                            "type": 'text',
                            "text": data.userInput
                        }
                    };
                    body['cInfo'] = {
                        "body": data.userInput
                    };
                    _msgsResponse.message.push(body);

                    let titleText = '';
                    let userQueryHtml = '';
                    if(isOverRideMode) {
                        titleText = "YouEntered -";
                        userQueryHtml = `
                                    <div class="steps-run-data last-msg-white-bg">
                                        <div class="icon_block_img">
                                            <img src="./images/userIcon.svg">
                                        </div>
                                        <div class="run-info-content" id="userInput-${_id}">
                                            <div class="title">${titleText}</div>
                                            <div class="agent-utt">
                                                <div class="title-data">"${sanitizeHTML(data.userInput)}"</div>
                                            </div>
                                            
                                        </div>
                                    </div>`;
                    } else {
                        titleText = "Customer Said -"
                        userQueryHtml = `
                                    <div class="steps-run-data last-msg-white-bg">
                                        <div class="icon_block_img">
                                            <img src="./images/userIcon.svg">
                                        </div>
                                        <div class="run-info-content" id="userInput-${_id}">
                                            <div class="title">${titleText}</div>
                                            <div class="agent-utt">
                                                <div class="title-data">"${sanitizeHTML(data.userInput)}"</div>
                                            </div>
                                            
                                        </div>
                                    </div>`;
                    }
                    let addUserQueryTodropdownData = document.getElementById(`dropDownData-${dropdownHeaderUuids}`);
                    addUserQueryTodropdownData.innerHTML = addUserQueryTodropdownData.innerHTML + userQueryHtml;
                    let entityHtml = $(`#dropDownData-${dropdownHeaderUuids}`).find(`#userInput-${_id}`);
                    let entityDisplayName = agentAssistResponse.entityDisplayName ? agentAssistResponse.entityDisplayName : agentAssistResponse.entityName;
                    if(agentAssistResponse.newEntityDisplayName || agentAssistResponse.newEntityName){
                        entityDisplayName = agentAssistResponse.newEntityDisplayName ? agentAssistResponse.newEntityDisplayName : agentAssistResponse.newEntityName;
                    }
                    if (data.entityValue && !data.isErrorPrompt && entityDisplayName) {
                        entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${sanitizeHTML(data.userInput)}</div>`);
                    } else { 
                        if (data.isErrorPrompt && entityDisplayName) {
                            let entityHtmls = `<div class="order-number-info">${entityDisplayName} : 
                                                    <span style="color:red">Value unidentified</span>
                                                </div>
                                                <div>
                                                    <img src="./images/warning.svg" style="padding-right: 8px;">
                                                    <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                                </div>`
                            entityHtml.append(entityHtmls);
                        }
                    }
                    AgentChatInitialize.renderMessage(_msgsResponse);
                    // HtmlRenderMethod(_convId, _msgsResponse) {}
                    // setTimeout(() => {
                    //     // store HTML
                    // }, 500)
                    // 
                }

                $('body').bind('mousedown keydown', function (event) {
                    currentTabActive = detectCurrentTab();
                    document.getElementById("loader").style.display = "none";
                    if (currentTabActive !== 'searchAutoIcon') {
                        let agentSearchBlock = $("#agentSearch");
                        agentSearchBlock.attr('data-conv-id', _agentAssistDataObj.conversationId);
                        agentSearchBlock.attr('data-bot-id', _agentAssistDataObj.botId);
                        agentSearchBlock.attr('data-agent-assist-input', true)
                    }
                });

                detectCurrentTab = () => {
                    return $('.tab-icon.active-tab').attr('id');
                }

                function displayCustomerFeels(data, convId, botId) {
                    if(sourceType !== 'smartassist-color-scheme') {
                        if (data.sentimentTone) {
                            custTone = data;
                        }
                        let userTabtoneId = document.getElementById('userTab-custSentimentAnalysis');
                        let agentTabtoneId = document.getElementById('agentTab-custSentimentAnalysis');
                        if (custTone?.sentimentTone) {
                            console.log(custTone);
                            // if (cusTone?.sentiment.strength > 0 && cusTone?.sentiment.strength <= 33) {
    
                            // } else if (cusTone?.sentiment.strength > 33 && cusTone?.sentiment.strength <= 66) {
    
                            // } else if (cusTone?.sentiment.strength > 66 && cusTone?.sentiment.strength <= 100) {
    
                            // }
                            let toneinnerHTML = `
                            <div id="custEmoji" class="emojis">${custTone?.sentimentTone?.emoji}</div>
                            <div id="strengthDisplay"></div>
                                <div [ngStyle]="{'background-color' : (custTone?.strength > 0 && custTone?.strength <=33) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-sm"></div>
                                <div [ngStyle]="{'background-color' : (custTone?.strength > 33 && custTone?.strength <=66) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-md"></div>
                                <div [ngStyle]="{'background-color' : (custTone?.strength > 66 && custTone?.strength <=100) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-lg"></div>
                            </div>
                            <span id="customerTone">Customer is feeling <b>${custTone?.sentimentTone?.sentiment}</b></span>
                            `
                            userTabtoneId.innerHTML = toneinnerHTML;
                            agentTabtoneId.innerHTML = toneinnerHTML;
                        }
                        $(document).ready(() => {
                            if (!custTone?.sentimentTone) {
                                let staticToneData = {
                                    emoji: "&#128512;",
                                    sentiment: "Happy",
                                    strength: 3
                                }
                                staticToneInnerHtml = `
                                <div id="custEmoji" class="emojis">${staticToneData.emoji}</div>
                                    <div [ngStyle]="{'background-color' : (staticToneData?.strength > 0 && staticToneData?.strength <=33) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-sm"></div>
                                    <div [ngStyle]="{'background-color' : (staticToneData?.strength > 33 && staticToneData?.strength <=66) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-md"></div>
                                    <div [ngStyle]="{'background-color' : (staticToneData?.strength > 66 && staticToneData?.strength <=100) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-lg"></div>
                                </div>
                                <span id="customerTone">Customer is feeling <b>${staticToneData.sentiment}</b></span>
                                `
                                userTabtoneId.innerHTML = staticToneInnerHtml;
                                agentTabtoneId.innerHTML = staticToneInnerHtml;
                            }
                        });
                    }
                    
                }

                // Add input field to the userResponse manually by the agent
                function agentManualentryMsg(agentInput, data, convId, botId) {
                    var _msgsResponse = {
                        "type": "bot_response",
                        "from": "bot",
                        "message": [

                        ],
                        "messageId": data._id,
                        "botInfo": {
                            "chatBot": "sample Bot",
                            "taskBotId": botId
                        },
                        "createdOn": "2022-03-21T07:56:18.225Z",
                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                        "traceId": "873209019a5adc26"
                    }
                    let body = {};
                    body['type'] = 'text';
                    body['component'] = {
                        "type": 'text',
                        "payload": {
                            "type": 'text',
                            "text": data.intentName
                        }
                    };
                    body['cInfo'] = {
                        "body": data.userInput
                    };
                    _msgsResponse.message.push(body);
                    let addAgentQueryTodropdownData;
                    let agentEntityInput;
                    if (currentTabActive == 'userAutoIcon') {
                        addAgentQueryTodropdownData = document.getElementById(`dropDownData-${dropdownHeaderUuids}`);
                        agentEntityInput = agentInput;
                    } else {
                        addAgentQueryTodropdownData = document.getElementById(`dropDownData-${myBotDropdownHeaderUuids}`);
                        agentEntityInput = agentInput
                    }


                    let agentQueryHtml =
                        // `<div class="run-info-content">
                        //     <div class="order-number-info">${data.entityName} : ${data.entityValue}</div>
                        // </div>`;
                        `<div class="steps-run-data">
                                        <div class="icon_block_img">
                                            <img src="./images/userIcon.svg">
                                        </div>
                                        <div class="run-info-content">
                                            <div class="title">You Entered- </div>
                                            <div class="order-number-info">value : ${encodeUIR(agentEntityInput)}</div>
                                        </div>
                                </div>`;
                    addAgentQueryTodropdownData.innerHTML = addAgentQueryTodropdownData.innerHTML + agentQueryHtml;

                    AgentChatInitialize.renderMessage(_msgsResponse);
                }
                let isSuggestionProcessed = true;
                processAgentIntentResults = function (data, convId, botId) {
                    let uuids = Math.floor(Math.random() * 100);
                    libraryResponseId = uuids;
                    var _msgsResponse = {
                        "type": "bot_response",
                        "from": "bot",
                        "message": [

                        ],
                        "botInfo": {
                            "chatBot": "sample Bot",
                            "taskBotId": botId
                        },
                        "createdOn": "2022-03-21T07:56:18.225Z",
                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                        "traceId": "873209019a5adc26"
                    }

                    // dummy data prepration for articles
                    // if(data.suggestions && data.suggestions.faqs){
                    //     data.suggestions.articles = [];
                    //     for(let faq of data.suggestions.faqs){
                    //         let object = {};
                    //         object.title = faq.question;
                    //         object.content = faq.answer + 'Start by entering your trip details onto an aggregator website like SkyScanner or GoogleFlights';
                    //         object.link = "http://www.google.com"
                    //         data.suggestions.articles.push(object);
                    //     }
                    // }


                    if (data.useCases) {
                        if (data.suggestions) {



                            document.getElementById('allAutomations-Exhaustivelist').classList.remove('hide');
                            $('#dialogs-faqs').removeClass('hide');
                            document.getElementById('searchResults').classList.add('hide');
                            // dialogs body
                            if (data.suggestions.dialogs.length > 0) {

                                let allAutomationSuggestions = document.getElementById(`allAutomations-Exhaustivelist`);
                                let listAreaHtml = `<div class="heading-title">All Automations</div>
                                            <div class="dialog-task-run-sec" id="dialogs-list" p-0" >
                                                <div class="task-type" id="usecases-list">
                                                <div class="content-dialog-task-type p1-0" id="usecases-suggestions"></div>
                                                </div>
                                            </div>`
                                allAutomationSuggestions.innerHTML = listAreaHtml;
                            } else {
                                $('#noLibraryList').removeClass('hide');
                            }
                            data.suggestions.dialogs?.forEach((ele, index) => {
                                let libUuid = Math.floor(Math.random() * 100);
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele.name
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.value
                                };
                                let useCasesSuggestionsList = document.getElementById('usecases-suggestions');
                                let dialogsHtml = `
                    <div class="type-info-run-send" id="useCaseList-${libUuid}">
                        <div class="left-content">
                            <div class="title-text" id="automation-${uuids}">${ele.name}</div>
                        </div>
                        <div class="action-links">
                            <button class="send-run-btn" data-conv-id="${data.conversationId}"
                            data-bot-id="${botId}" data-intent-name="${ele.name}"
                             data-library-run="true" 
                            data-use-case-list="true" id="useCase-${libUuid}"
                            >RUN</button>
                            <div class="elipse-dropdown-info" id="showRunForAgentBtn-${libUuid}">
                                <div class="elipse-icon" id="elipseIcon-${libUuid}">
                                    <i class="ast-overflow" id="overflowIcon-${libUuid}"></i>
                                </div>
                                <div class="dropdown-content-elipse hide" id="runAgtBtn-${libUuid}">
                                    <div class="list-option" data-conv-id="${data.conversationId}"
                                    data-bot-id="${botId}" data-intent-name="${ele.name}"
                                    id="agentSelect-${libUuid}"
                                    data-exhaustivelist-run="true" data-run-myBot="true">Run with Agent Inputs</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                                useCasesSuggestionsList.innerHTML += dialogsHtml;
                                // _msgsResponse.message.push(body);
                            });
                        }
                    }

                    if (data.isSearch && answerPlaceableIDs.length == 0) {
                        ShowSearchContent();
                        if (data.value.length > 0 && currentTabActive == 'searchAutoIcon') {
                            document.getElementById('allAutomations-Exhaustivelist').classList.add('hide');
                            $('#dialogs-faqs').addClass('hide');
                        }
                        if (data.suggestions) {
                            isSuggestionProcessed = false;
                            if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {
                                data.suggestions = formatSearchAssistData(data.suggestions);
                            }

                            let dialogsLength = data.suggestions.dialogs?.length || 0;
                            let faqsLength = data.suggestions.faqs?.length || 0;
                            let articlesLength = data.suggestions.articles?.length || 0;
                            let totalSuggestionLength = dialogsLength + faqsLength + articlesLength || 0;
                            let searchResultText = (totalSuggestionLength == 1) ? " Search result for " : " Search results for "

                            if (currentTabActive == 'searchAutoIcon') {
                                let searchTextDisplay = document.getElementById('search-text-display');
                                html = `<div class="searched-intent" id="librarySearchText">${totalSuggestionLength} ${searchResultText} '${sanitizeHTML(data.userInput)}' </div>`
                                searchTextDisplay.innerHTML = html;
                            } else {
                                if(totalSuggestionLength){
                                    $('#overLaySearch').html(`<div class="search-results-text">${totalSuggestionLength} ${searchResultText} '${sanitizeHTML(data.userInput)}' <span class="show-all hide">Show all</span></div>`)
                                }

                                // if ((dialogsLength > 0) && (faqsLength > 0)) {
                                //     $('#overLaySearch').html(`<div class="search-results-text">${dialogsLength + faqsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                // } else if ((dialogsLength > 0) && (faqsLength === 0 || faqsLength === undefined)) {
                                //     $('#overLaySearch').html(`<div class="search-results-text">${dialogsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                // } else if ((dialogsLength === 0 || dialogsLength === undefined) && (faqsLength > 0)) {
                                //     $('#overLaySearch').html(`<div class="search-results-text">${faqsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                // }
                                if (totalSuggestionLength > 1) {
                                    $('#overLaySearch').find('.show-all').removeClass('hide');

                                }
                            }

                        } else {
                            if (isSuggestionProcessed) {
                                if (currentTabActive == 'searchAutoIcon') {
                                    let searchTextDisplay = document.getElementById('search-text-display');
                                    html = `<div class="searched-intent" id="librarySearchText">0 Search results for '${sanitizeHTML(data.userInput)}' </div>`
                                    searchTextDisplay.innerHTML = html;
                                } else {
                                    $('#overLaySearch').html(`<div class="search-results-text">0 Search results for '${sanitizeHTML(data.userInput)}'</div>`)
                                }
                            }


                        }

                        if (data?.suggestions?.dialogs?.length > 0) {
                            let automationSuggestions = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display`) : $('#overLaySearch');
                            let dialogAreaHtml = `<div class="dialog-task-run-sec p-0" id="searchedDialogs-${libraryResponseId}">
                                            <div class="task-type" id="dialoguesArea">
                                                <div class="img-block-info">
                                                    <img src="./images/dialogtask.svg">
                                                </div>
                                                
                                                <div class="content-dialog-task-type arr-cont-dialogtask" id="dialogSuggestions-results">
                                                    <div class="type-with-img-title">Dialog task (${data.suggestions.dialogs.length})</div>
                                                </div>
                                            </div>
                                        </div>`;
                            automationSuggestions.append(dialogAreaHtml);

                            // dialogs body 
                            data.suggestions.dialogs?.forEach((ele, index) => {
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele.name
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.value
                                };
                                let dialogSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #dialogSuggestions-results') : $('#overLaySearch #dialogSuggestions-results');
                                let dialogsHtml = `
                        <div class="type-info-run-send">
                            <div class="left-content">
                                <div class="title-text" id="automation-${uuids}">${ele.name}</div>
                            </div>
                            <div class="action-links">
                                <button class="send-run-btn" data-conv-id="${data.conversationId}"
                                data-bot-id="${botId}" data-intent-name="${ele.name}"
                                 data-library-run="true"
                                id="run-${libraryResponseId}"
                                >RUN</button>
                                <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uuids}">
                                    <div class="elipse-icon" id="elipseIcon-${uuids}">
                                        <i class="ast-overflow" id="overflowIcon-${uuids}"></i>
                                    </div>
                                    <div class="dropdown-content-elipse hide" id="runsearchAgtBtn-${uuids}">
                                        <div class="list-option" data-conv-id="${data.conversationId}"
                                        data-bot-id="${botId}" data-intent-name="${ele.name}"
                                         id="agentSearchSelect-${uuids}"
                                        data-exhaustivelist-run="true" data-run-myBot="true">Run with Agent Inputs</div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                                dialogSuggestions.append(dialogsHtml);
                                // _msgsResponse.message.push(body);
                            });

                        }
                        if (data?.suggestions?.faqs?.length > 0) {
                            let automationSuggestions = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display`) : $('#overLaySearch');
                            let dialogAreaHtml = `<div class="dialog-task-run-sec p-0">
                                            <div class="task-type" id="faqssAreas">
                                                <div class="img-block-info">
                                                    <img src="./images/kg.svg">
                                                </div>
                                                <div class="content-dialog-task-type arr-cont-dialogtask" id="faqsSuggestions-results">
                                                    <div class="type-with-img-title">FAQ (${data.suggestions.faqs.length})</div>
                                                </div>
                                            </div>
                                        </div>`;
                            automationSuggestions.append(dialogAreaHtml);

                            // faqs body
                            data.suggestions.faqs?.forEach((ele, index) => {
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.value
                                };
                                let faqsSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #faqsSuggestions-results') : $('#overLaySearch #faqsSuggestions-results');

                                let faqDivClass = "type-info-run-send"
                                if(index > 1){
                                    faqDivClass = "type-info-run-send hide";
                                }

                                let faqHtml = `
                        <div class="${faqDivClass}" id="faqDivLib-${uuids+index}">
                            <div class="left-content" id="faqSectionLib-${uuids+index}">
                                <div class="title-text" id="titleLib-${uuids+index}">${ele.question}</div>
                            </div>
                        </div>`;

                                faqsSuggestions.append(faqHtml);
                               
                                let faqs = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${uuids+index}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${uuids+index}`);
                                if (!ele.answer) {
                                    let positionID = "dg-"+koreGenerateUUID();
                                    let checkHtml = `
                            <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                            data-bot-id="${botId}" data-intent-name="${ele.question}"
                            data-check-lib="true" id="checkLib-${uuids+index}" data-position-id="${positionID}"></i>`;
                                    // faqs.append(checkHtml);
                                    // $(`#titleLib-${uuids+index}`).addClass('noPadding');
                                    $(`#faqDivLib-${uuids+index}`).addClass('is-dropdown-show-default');
                                    document.getElementById(`titleLib-${uuids+index}`).insertAdjacentHTML('beforeend',checkHtml);
                                } else {
                                    let a = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display #faqDivLib-${uuids+index}`) : $(`#overLaySearch #faqDivLib-${uuids+index}`);
                                    let faqActionHtml = `<div class="action-links">
                            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids+index}"  data-msg-data="${ele.answer}">Send</button>
                            <div class="copy-btn" data-msg-id="${uuids+index}" data-msg-data="${ele.answer}">
                                <i class="ast-copy" data-msg-id="${uuids+index}" data-msg-data="${ele.answer}"></i>
                            </div>
                        </div>`;
                                    a.append(faqActionHtml);
                                    faqs.append(`<div class="desc-text" id="descLib-${uuids+index}">${ele.answer}</div>`);
                                    let faqstypeInfo = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${uuids + index}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${uuids + index}`);
                                    let seeMoreButtonHtml = `
                                  <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${uuids + index}" data-see-more="true">Show more</button>
                                  <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uuids + index}" data-see-less="true">Show less</button>                  
                                  `;
                                    faqstypeInfo.append(seeMoreButtonHtml);
                                    setTimeout(() => {
                                        updateSeeMoreButtonForAgent(uuids + index);
                                    }, waitingTimeForSeeMoreButton);
                                }                   
                                // _msgsResponse.message.push(body);
                                if(data.suggestions.faqs.length === 1 && !ele.answer) {
                                    isOnlyOneFaqOnSearch = true;
                                    document.getElementById(`checkLib-${uuids+index}`).click();
                                    $(`#checkLib-${uuids+index}`).addClass('hide');
                                    $(`#faqDivLib-${uuids+index}`).removeClass('is-dropdown-show-default');
                                }
                            });

                            if(data?.suggestions?.faqs?.length > 2){
                                let faqsSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #faqsSuggestions-results') : $('#overLaySearch #faqsSuggestions-results');
                                let fullFaqView = `<div class="link-view-full-article ghost-btn" id="faqFullView-${uuids}" data-faq-full-view="true">View All FAQs</div>`
                                let fewFaqView = `<div class="link-view-full-article ghost-btn hide" id="faqFewView-${uuids}" data-faq-few-view="true">View Few FAQs</div>`
                                faqsSuggestions.append(fullFaqView); 
                                faqsSuggestions.append(fewFaqView);
                            }


                        }

                        console.log(data.suggestions, "suggestion");

                        if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {

                            console.log("article lenght");
                            let automationSuggestions = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display`) : $('#overLaySearch');
                            let articleAreaHtml = `<div class="dialog-task-run-sec p-0">
                                            <div class="task-type" id="articlesArea">
                                                <div class="img-block-info">
                                                    <img src="./images/kg.svg">
                                                </div>
                                                <div class="content-dialog-task-type arr-cont-dialogtask" id="articleSuggestions-results">
                                                    <div class="type-with-img-title">Articles (${data.suggestions.articles.length})</div>
                                                </div>
                                            </div>
                                        </div>`;
                            automationSuggestions.append(articleAreaHtml);

                            // articles body
                            data.suggestions.articles?.forEach((ele, index) => {
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.value
                                };
                                let articleSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #articleSuggestions-results') : $('#overLaySearch #articleSuggestions-results');

                                let articleDivClass = "type-info-run-send"
                                if(index == 1){
                                    articleDivClass = "type-info-run-send hide";
                                }

                                let articleHtml = `
                        <div class="${articleDivClass}" id="articleDivLib-${uuids+index}">
                            <div class="left-content" id="articleSectionLib-${uuids+index}">
                                <div class="title-text" id="articletitleLib-${uuids+index}">${ele.title}</div>
                            </div>
                        </div>`;

                        articleSuggestions.append(articleHtml);

                        
                                let articles = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #articleSectionLib-${uuids+index}`) : $(`#overLaySearch .type-info-run-send #articleSectionLib-${uuids+index}`);
                                if (!ele.content) {
                                    let articlecheckHtml = `
                            <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                            data-bot-id="${botId}" data-intent-name="${ele.title}"
                            data-check-lib="true" id="articlecheckLib-${uuids+index}"></i>`;
                            articles.append(articlecheckHtml);
                                } else {
                                    let a = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display #articleDivLib-${uuids+index}`) : $(`#overLaySearch #articleDivLib-${uuids+index}`);
                                    let articlesActionHtml = `<div class="action-links">
                            <button class="send-run-btn" id="articlesendMsg" data-msg-id="article-${uuids+index}"  data-msg-data="${ele.content}">Send</button>
                            <div class="copy-btn" data-msg-id="article-${uuids+index}" data-msg-data="${ele.content}">
                                <i class="ast-copy" data-msg-id="article-${uuids+index}" data-msg-data="${ele.content}"></i>
                            </div>
                        </div>`;
                                    a.append(articlesActionHtml);
                                    articles.append(`<div class="desc-text" id="articledescLib-${uuids+index}">${ele.content}
                                     </div>`);
                                     if(ele.link){
                                        let fullArticleLinkHtml = `<div class="link-view-full-article hide" id="articleViewLinkLib-${uuids+index}"><a href="${ele.link}" target="_blank">View Full Article</a></div>`
                                         document.getElementById(`articledescLib-${uuids+index}`).insertAdjacentHTML('beforeend',fullArticleLinkHtml);
                                     }
                                    let articlestypeInfo = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #articleSectionLib-${uuids + index}`) : $(`#overLaySearch .type-info-run-send #articleSectionLib-${uuids + index}`);
                                    let seeMoreButtonHtml = `
                                  <button class="ghost-btn hide" style="font-style: italic;" id="articleseeMore-${uuids + index}" data-article-see-more="true">Show more</button>
                                  <button class="ghost-btn hide" style="font-style: italic;" id="articleseeLess-${uuids + index}" data-article-see-less="true">Show less</button>                  
                                  `;
                                  articlestypeInfo.append(seeMoreButtonHtml);
                                    setTimeout(() => {
                                        updateSeeMoreButtonForAgent(uuids + index, 'article');
                                    }, 10);
                                }
                                
                                
                                
                                // _msgsResponse.message.push(body);
                                // if(data.suggestions.articles.length === 1 && !ele.answer) {
                                //     document.getElementById(`articledescLib-${uuids+index}`).click();
                                //     $(`#articledescLib-${uuids+index}`).addClass('hide');
                                // }
                            });

                            if(data?.suggestions?.articles?.length > 1){
                                let articleSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #articleSuggestions-results') : $('#overLaySearch #articleSuggestions-results');
                                let fullArticleView = `<div class="link-view-full-article ghost-btn" id="articleFullView-${uuids}" data-article-full-view="true">View All Articles</div>`
                                let fewArticleView = `<div class="link-view-full-article ghost-btn hide" id="articleFewView-${uuids}" data-article-few-view="true">View Few Articles</div>`
                                articleSuggestions.append(fullArticleView); 
                                articleSuggestions.append(fewArticleView);
                            }

                        }
                    } else {
                        if (data.type === 'text' && data.suggestions) {
                            isSuggestionProcessed = false
                            let faqAnswerIdsPlace;
                            data.suggestions.faqs.forEach((ele) => {
                                faqAnswerIdsPlace = answerPlaceableIDs.find(ele => ele.input == data.value);
                                let splitedanswerPlaceableID = faqAnswerIdsPlace.id.split('-');
                                splitedanswerPlaceableID.shift();
                                
                                if(currentTabActive == 'searchAutoIcon'){

                                    let faqDiv = $(`#search-text-display #faqDivLib-${splitedanswerPlaceableID.join('-')}`);
                                    let faqaction = `<div class="action-links">
                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${splitedanswerPlaceableID.join('-')}"  data-msg-data="${ele.answer}">Send</button>
                                        <div class="copy-btn" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}">
                                            <i class="ast-copy" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}"></i>
                                        </div>
                                    </div>`;
                                    faqDiv.append(faqaction);

                                    // let faqAnswerSendMsg =  $(`#search-text-display #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                                    // $(faqAnswerSendMsg).attr('data-msg-data',ele.answer);
                                    // let faqAnswerCopyMsg =  $(`#search-text-display #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                                    // $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
                                }else{
                                        let faqDiv = $(`#overLaySearch #faqDivLib-${splitedanswerPlaceableID.join('-')}`);
                                        let faqaction = `<div class="action-links">
                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${splitedanswerPlaceableID.join('-')}"  data-msg-data="${ele.answer}">Send</button>
                                            <div class="copy-btn" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}">
                                                <i class="ast-copy" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}"></i>
                                            </div>
                                        </div>`;
                                        faqDiv.append(faqaction);
                    
                                    // let faqAnswerSendMsg =  $(`#overLaySearch #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                                    // $(faqAnswerSendMsg).attr('data-msg-data',ele.answer)
                                    // let faqAnswerCopyMsg =  $(`#overLaySearch #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                                    // $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
                                }

                                $(`${currentTabActive == 'searchAutoIcon' ? `#search-text-display #${faqAnswerIdsPlace.id}` : `#overLaySearch #${faqAnswerIdsPlace.id}`}`).html(ele.answer);
                                $(`${currentTabActive == 'searchAutoIcon' ? `#search-text-display #${faqAnswerIdsPlace.id}` : `#overLaySearch #${faqAnswerIdsPlace.id}`}`).attr('data-answer-render', 'true');
                                let faqs = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')}`);
                                let seeMoreButtonHtml = `
                        <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true">Show more</button>
                        <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true">Show less</button>
                        `;
                                faqs.append(seeMoreButtonHtml);
                                setTimeout(() => {                                 
                                    updateSeeMoreButtonForAgent(splitedanswerPlaceableID.join('-'));
                                }, waitingTimeForSeeMoreButton);
                                // $(`#search-text-display .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#search-text-display #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#search-text-display #seeMore-${splitedanswerPlaceableID.join('-')}`).addClass('hide');
                                // $(`#overLaySearch .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#overLaySearch #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#overLaySearch #seeMore-${splitedanswerPlaceableID.join('-')}`).addClass('hide');            
                            })
                            if(faqAnswerIdsPlace) {
                                let index = answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
                                answerPlaceableIDs.splice(index, 1);
                            }
                            

                        }
                        if(isOnlyOneFaqOnSearch){
                            let index = answerPlaceableIDs.indexOf(ele=>ele.positionId == data.positionId);
                            answerPlaceableIDs.splice(index, 1);
                            isOnlyOneFaqOnSearch = false;
                        }
                    }

                    function ShowSearchContent() {
                        if (currentTabActive == 'searchAutoIcon') {
                            document.getElementById('searchResults').classList.remove('hide');
                            document.getElementById('allAutomations-Exhaustivelist').classList.remove('hide');
                            $('#dialogs-faqs').removeClass('hide');
                        } else {
                            $('.overlay-suggestions').removeClass('hide').attr('style', 'bottom:0; display:block;');

                        }
                    }
                }

                function processMybotDataResponse(data, convId, botId) {
                    console.log("when an dialog is ran for the agent", data);
                    let myBotuuids = koreGenerateUUID();
                    // let automationSuggestions = $('#agentAutoContainer .dialog-task-accordiaon-info');
                    // for (let ele of automationSuggestions) {
                    //     ele.classList.add('hide');
                    // }
                    // if (automationSuggestions.length >= 1) {
                    //     automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                    // }
                    myBotresponseId = myBotuuids;
                    var _msgsResponse = {
                        "type": "bot_response",
                        "from": "bot",
                        "message": [],
                        "messageId": myBotuuids,
                        "botInfo": {
                            "chatBot": "sample Bot",
                            "taskBotId": botId
                        },
                        "createdOn": "2022-03-21T07:56:18.225Z",
                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                        "traceId": "873209019a5adc26"
                    }
                    let parsedPayload;
                    data.buttons?.forEach((elem) => {
                        if(elem.value){
                           elem.value = elem.value.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
                        }
                        let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");

                        try {
                            if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                parsedPayload = JSON.parse(withoutSpecials);
                            }
                        }catch(error){
                            if(payloadType.text){
                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                parsedPayload = withoutSpecials;
                            }
                        }

                        let body = {};
                        body['type'] = elem.type;
                        if (!parsedPayload) {
                            body['component'] = {
                                "type": elem.type,
                                "payload": {
                                    "type": elem.type,
                                    "text": elem.value
                                }
                            };
                            body['cInfo'] = {
                                "body": elem.value
                            };

                        } else {
                            body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                            if (parsedPayload?.type === 'message') {
                                body['cInfo'] = {
                                    "body": ''
                                };
                            } else if (parsedPayload?.text) {
                                body['cInfo'] = {
                                    "body": parsedPayload.text
                                };
                            } else {
                                body['cInfo'] = {
                                    "body": parsedPayload
                                };
                            }

                        }

                        _msgsResponse.message.push(body);
                    });
                    if (data.intentName) {
                        let body = {};
                        body['type'] = 'text';
                        body['component'] = {
                            "type": 'text',
                            "payload": {
                                "type": 'text',
                                "text": data.intentName
                            }
                        };
                        body['cInfo'] = {
                            "body": ''
                        };
                        //  _msgsResponse.message.push(body);
                    }
                    let agentInputId = Math.floor(Math.random() * 100);
                    if (isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited') && data.positionId == myBotDialogPositionId) {
                        let sendMsgData = encodeURI(JSON.stringify(_msgsResponse));
                        let runInfoContent = $(`#dropDownData-${myBotDropdownHeaderUuids}`);
                        $('#inputFieldForMyBot').remove();
                        
                         if(isMybotInputResponseClick){
                            let userQueryHtml = `
                                    <div class="steps-run-data">
                                        <div class="icon_block_img">
                                            <img src="./images/userIcon.svg">
                                        </div>
                                        <div class="run-info-content" id="userInput-${myBotuuids}">
                                            <div class="title">You Entered -</div>
                                            <div class="agent-utt">
                                                <div class="title-data">${sanitizeHTML(data.userInput)}</div>
                                            </div>
                                            
                                        </div>
                                    </div>`;
                            runInfoContent.append(userQueryHtml);
                            let entityHtml = $(`#dropDownData-${myBotDropdownHeaderUuids}`).find(`#userInput-${myBotuuids}`);
                            let entityDisplayName = myBotDataResponse.entityDisplayName ? myBotDataResponse.entityDisplayName : myBotDataResponse.entityName;
                            if (data.userInput && !data.isErrorPrompt && entityDisplayName) {
                                entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${sanitizeHTML(data.userInput)}</div>`);
                            } else {
                                if (data.isErrorPrompt && entityDisplayName) {
                                    let entityHtmls = `<div class="order-number-info">${entityDisplayName} : 
                                                            <span style="color:red">Value unidentified</span>
                                                        </div>
                                                        <div>
                                                            <img src="./images/warning.svg" style="padding-right: 8px;">
                                                            <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                                        </div>`
                                    entityHtml.append(entityHtmls);
                                }
                            }
                            isMybotInputResponseClick = false;
                        }
                        myBotDataResponse = {};
                        if(data.entityName){
                            myBotDataResponse = Object.assign({},data);
                        }

                        let askToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Ask customer</div>
                           <div class="agent-utt">
                               <div class="title-data"><ul class="chat-container" id="displayData-${myBotuuids}"></ul></div>
                               <div class="action-links">
                                   <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${sendMsgData}">Send</button>
                                   <div class="copy-btn hide" data-msg-id="${myBotuuids}">
                                       <i class="ast-copy" data-msg-id="${myBotuuids}"></i>
                                   </div>
                               </div>
                           </div>
                           </div>
                       </div>
            `;
                        let tellToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Tell Customer</div>
                           <div class="agent-utt">
                               <div class="title-data" ><ul class="chat-container" id="displayData-${myBotuuids}"></ul></div>
                               <div class="action-links">
                                   <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${sendMsgData}">Send</button>
                                   <div class="copy-btn hide" data-msg-id="${myBotuuids}">
                                       <i class="ast-copy" data-msg-id="${myBotuuids}"></i>
                                   </div>
                               </div>
                           </div>
                           </div>
                       </div>
            `;

            let agentInputEntityName = 'EnterDetails';
            if(data.entityDisplayName || data.entityName){
                agentInputEntityName = data.entityDisplayName ? data.entityDisplayName : data.entityName
            }

                        let agentInputToBotHtml = `
            <div class="steps-run-data" id="inputFieldForMyBot">
                <div class="icon_block">
                    <i class="ast-agent"></i>
                </div>
                <div class="run-info-content">
                <div class="title">Input</div>
                <div class="agent-utt enter-details-block">
                <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
                <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}" data-conv-id="${convId}" data-bot-id="${botId}"  data-mybot-input="true" data-position-id="${myBotDialogPositionId}">
                </div>
                </div>
                </div>
            </div>`
                        if (data.isPrompt) {
                            runInfoContent.append(askToUserHtml);
                            runInfoContent.append(agentInputToBotHtml);
                        } else {
                            runInfoContent.append(tellToUserHtml);
                        }
                        if (!parsedPayload) {
                            $(runInfoContent).find('.copy-btn').removeClass('hide');
                        }
                    }
                    AgentChatInitialize.renderMessage(_msgsResponse, myBotuuids, `dropDownData-${myBotDropdownHeaderUuids}`);
                    removeElementFromDom();

                    if(document.getElementById('agentInput-'+ agentInputId)){
                        document.getElementById('agentInput-'+ agentInputId).focus();
                    }
                    // let noOfSteps = $(`.body-data-container #agentAutoContainer`).find('.steps-run-data').not('.hide');
                    // if (noOfSteps.length > 2) {
                    //     $(noOfSteps).addClass('hide');
                    //     $(noOfSteps[noOfSteps.length - 2]).removeClass('hide');
                    //     $(noOfSteps[noOfSteps.length - 1]).removeClass('hide');
                    // }
                    if (isMyBotAutomationOnGoing && (((data.endOfFaq || data.endOfTask) && data.type !== 'text') || (data.userInput == 'discard all' && data.type !== 'text') || (userMessage && userMessage.value && userMessage.value.includes('discard')))) {
                        // isMyBotAutomationOnGoing = false;
                        // var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        // var appState = JSON.parse(appStateStr);
                        // if (appState[_conversationId]) {
                        //     appState[_conversationId]['automationGoingOnAfterRefreshMyBot'] = isMyBotAutomationOnGoing;
                        //     localStorage.setItem('agentAssistState', JSON.stringify(appState))
                        // }
                        // addFeedbackHtmlToDom(data, botId, userIntentInput, 'runForAgentBot');
                    }

                    if (scrollAtEnd) {
                        scrollToBottom();
                    }
                    addWhiteBackgroundClassToNewMessage();
                }

            

                function updateNumberOfMessages() {
                    numberOfNewMessages += 1;
                    $(".scroll-bottom-btn").addClass("new-messages");
                    $(".scroll-bottom-btn span").text(numberOfNewMessages + ' new');
                    if(numberOfNewMessages == 1){
                        removeWhiteBackgroundToSeenMessages();
                    }
                }

                function removeWhiteBackgroundToSeenMessages(){
                     let beforeLastElementArray = document.querySelectorAll('.last-msg-white-bg');
                    for(let ele of beforeLastElementArray){
                        $(ele).removeClass("last-msg-white-bg");
                    }
                }


                function addWhiteBackgroundClassToNewMessage(){
                    let dynamicBlockId = (currentTabActive == 'userAutoIcon') ?  'dynamicBlock' : 'myBotAutomationBlock';
                    let beforeLastElementArray = document.querySelectorAll('.last-msg-white-bg');
                    for(let ele of beforeLastElementArray){
                        if(ele && scrollAtEnd){
                            $(ele).removeClass("last-msg-white-bg");
                        }
                    }
                    let lastElement = getLastElement(dynamicBlockId);
                    if(lastElement && lastElement.className.includes('welcome-msg')){
                        $(lastElement).addClass('welcome-msg-last');
                        return
                    }else{
                        $('.welcome-msg').removeClass('welcome-msg-last');
                    }

                    if(lastElement){
                        $(lastElement).addClass("last-msg-white-bg");
                        $(lastElement).parent().css('opacity' , 1);
                        if(!scrollAtEnd){
                            if(lastElement.id.includes('automationSuggestions')){
                                let agentUttInfoId = lastElement.id.split('-');
                                agentUttInfoId.shift();
                                agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                                if(document.getElementById(agentUttInfoId)){
                                    $('#'+agentUttInfoId).addClass("last-msg-white-bg");
                                }
                            }
                        }
                        let newElementsHeight = lastElement.clientHeight;
                        // addBlurToOldMessage(newElementsHeight);
                        if(lastElement.nextElementSibling && lastElement.nextElementSibling.className.includes('feedback-data')){
                            lastElement.nextElementSibling.classList.add("last-msg-white-bg");
                        }
                        let lastElementId = $(lastElement).parent().attr('id');
                        if(lastElementId){
                            let uuid = lastElementId.split('-');
                            uuid.shift();
                            uuid = uuid.join('-');
                            console.log(uuid, "uuid");
                            let endofTaskId = 'endTaks-' + uuid;
                            if(document.getElementById(endofTaskId)){
                                document.getElementById(endofTaskId).classList.add('last-msg-white-bg');
                            }
                            let overridebtnId = 'overRideBtn-' + uuid;
                            if(document.getElementById(overridebtnId)){
                                $('#' + overridebtnId).parent().addClass('last-msg-white-bg');
                            }
                        }
                    }
                    RemoveVerticalLineForLastResponse();
                }

                function updateSeeMoreButtonForAgent(id,article){
                    let faqSourceTypePixel = 5;
                    let titleElement = $("#titleLib-" + id);
                    let descElement = $("#descLib-" + id);
                    let sectionElement = $('#faqSectionLib-' + id);
                    let divElement = $('#faqDivLib-' + id);
                    let seeMoreElement = $('#seeMore-' + id);
                    console.log(article, 'article');
                    if(article){
                        titleElement = $("#articletitleLib-" + id);
                        descElement = $("#articledescLib-" + id);
                        sectionElement = $('#articleSectionLib-' + id);
                        divElement = $('#articleDivLib-' + id);
                        seeMoreElement = $('#articleseeMore-' + id);
                        viewLinkElement = $('#articleViewLinkLib-' + id);
                        console.log(seeMoreElement, "see more element");
                    }
                    if(titleElement && descElement && sectionElement && divElement){
                        $(titleElement).css({"overflow": "inherit", "white-space": "normal", "text-overflow" : "unset"});
                        $(descElement).css({"overflow": "inherit", "text-overflow" : "unset", "display" : "block", "white-space": "normal"});
                        let faqSectionHeight = $(sectionElement).css("height");
			  let divSectionHeight = $(descElement).css("height")  || '0px';;
                        faqSectionHeight = parseInt(faqSectionHeight.slice(0,faqSectionHeight.length-2));
                        divSectionHeight = parseInt(divSectionHeight.slice(0,divSectionHeight.length-2));
                        let faqMinHeight = $(divElement).css("min-height");
                        faqMinHeight = parseInt(faqMinHeight.slice(0,faqMinHeight.length-2)) + 15;
                        console.log(faqSectionHeight, "section height", faqMinHeight, "min height");
                        // if ((faqSectionHeight > (faqMinHeight + faqSourceTypePixel)) || (faqSectionHeight > faqMinHeight && faqSectionHeight <= (faqMinHeight + faqSourceTypePixel))) {
                        //     $(seeMoreElement).removeClass('hide');
                        // }else{
                        //     $(seeMoreElement).addClass('hide');
                        //     if(article){
                        //         $(viewLinkElement).removeClass('hide');
                        //     }
                        // }
                        if(divSectionHeight > (24 + faqSourceTypePixel)){
                            $(seeMoreElement).removeClass('hide');
                        }else{
                            $(seeMoreElement).addClass('hide');
                            if(article){
                                $(viewLinkElement).removeClass('hide');
                            }
                        }
                        $(titleElement).css({"overflow": "hidden", "white-space": "nowrap", "text-overflow" : "ellipsis"});
                        $(descElement).css({"overflow": "hidden", "text-overflow" : "ellipsis", "display": "-webkit-box"});
                    }
                }


                function updateSeeMoreOnAssistTabActive(){
                    let faqSuggestionList = $('[id*="faqDiv-"]');
                    faqSuggestionList.each(function() {
                        let elemID = this.id.split('-');
                        elemID.shift();
                        let actualId = elemID.join('-')
                        updateSeeMoreButtonForAssist(actualId);
                    });
                }

                function updateSeeMoreButtonForAssist(id, article){
                    // let faqSourceTypePixel = ((sourceType === 'smartassist-color-scheme') ? 5 : 2) ;
                    let faqSourceTypePixel = 5;
                    let titleElement = $("#title-" + id);
                    let descElement = $("#desc-" + id);
                    let sectionElement = $('#faqSection-' + id);
                    let divElement = $('#faqDiv-' + id);
                    let seeMoreElement = $('#seeMore-' + id);
                    console.log(article, "article");
                    if(article){
                        titleElement = $("#articletitle-" + id);
                        descElement = $("#articledesc-" + id);
                        sectionElement = $('#articleSection-' + id);
                        divElement = $('#articleDiv-' + id);
                        seeMoreElement = $('#articleseeMore-' + id);
                        console.log(seeMoreElement, 'see more element');
                    }
                    if(titleElement && descElement && sectionElement && divElement){
                        $(titleElement).css({"overflow": "inherit", "white-space": "normal", "text-overflow" : "unset"});
                        $(descElement).css({"overflow": "inherit", "text-overflow" : "unset", "display" : "block"});
                        let faqSectionHeight = $(sectionElement).css("height");
                        let divSectionHeight = $(descElement).css("height") || '0px';
                        faqSectionHeight = parseInt(faqSectionHeight.slice(0,faqSectionHeight.length-2));
                        divSectionHeight = parseInt(divSectionHeight.slice(0,divSectionHeight.length-2));
                        let faqMinHeight = $(divElement).css("min-height");
                        faqMinHeight = parseInt(faqMinHeight.slice(0,faqMinHeight.length-2)) + 12;
                        console.log('FAQ SM SL: ',faqMinHeight, faqSourceTypePixel, faqSectionHeight);
                        // if ((faqSectionHeight > (faqMinHeight + faqSourceTypePixel)) || (faqSectionHeight > faqMinHeight && faqSectionHeight <= (faqMinHeight + faqSourceTypePixel))) {
                        //     $(seeMoreElement).removeClass('hide');
                        // }else{
                        //     $(seeMoreElement).addClass('hide');
                        // }

                        if(divSectionHeight > (24 + faqSourceTypePixel)){
                            $(seeMoreElement).removeClass('hide');
                        }else{
                            $(seeMoreElement).addClass('hide');
                        }
                        $(titleElement).css({"overflow": "hidden", "white-space": "nowrap", "text-overflow" : "ellipsis"});
                        $(descElement).css({"overflow": "hidden", "text-overflow" : "ellipsis", "display": "-webkit-box"});
                    }
                }

                function collapseOldDialoguesInMyBot(){
                        if($(`#myBotAutomationBlock .collapse-acc-data`).length > 0){
                            let listItems = $("#myBotAutomationBlock .collapse-acc-data");
                            listItems.each(function(idx, collapseElement) {
                                console.log(collapseElement.classList, "classlist", collapseElement.id);
                                if(!collapseElement.id.includes('smallTalk')  && collapseElement.id.includes('dropDownData')){
                                    collapseElement.classList.add('hide');
                                }
                            });
                        }
                }

                function collapseOldDialoguesInAssist(){
                    if(scrollAtEnd){
                        if($(`#dynamicBlocksData .collapse-acc-data`).length > 0){
                            let listItems = $("#dynamicBlocksData .collapse-acc-data");
                            listItems.each(function(idx, collapseElement) {
                                console.log(collapseElement.classList, "classlist", collapseElement.id);
                                if(!collapseElement.id.includes('smallTalk')  && collapseElement.id.includes('dropDownData')){
                                    collapseElement.classList.add('hide');
                                }
                            });
                        }
                    }
                }

                function processAgentAssistResponse(data, convId, botId) {
                    console.log("AgentAssist >>> agentassist_response:", data);
                    if(!isAutomationOnGoing && !isInitialDialogOnGoing && !proactiveMode){
                        return;
                    }
                    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
                    // if (data.suggestions) {
                    //     for (let ele of automationSuggestions) {
                    //         ele.classList.add('hide');
                    //     }
                    //     $('.empty-data-no-agents').addClass('hide');
                    // } else {
                    //     automationSuggestions.length > 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide'), $('.empty-data-no-agents').addClass('hide')) : '';
                    // }

                    // dummy data prepration for articles
                    // if(data.suggestions && data.suggestions.faqs){
                    //     data.suggestions.articles = [];
                    //     for(let faq of data.suggestions.faqs){
                    //         let object = {};
                    //         object.title = faq.question;
                    //         object.content = faq.answer + 'Start by entering your trip details onto an aggregator website like SkyScanner or GoogleFlights';
                    //         data.suggestions.articles.push(object);
                    //     }
                    // }

                    let uuids = koreGenerateUUID();
                    responseId = uuids;
                    
                    if(!isAutomationOnGoing && data.intentName && !data.suggestions && !isInitialDialogOnGoing) {
                        let appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        let appState = JSON.parse(appStateStr);
                        let isInitialTaskRanORNot;
                        if (appState[_conversationId]) {
                            isInitialTaskRanORNot = appState[_conversationId]['initialTaskGoingOn'] 
                        }
                        if(!isInitialTaskRanORNot){
                            runDialogForAssistTab(data, `onInitDialog-123456`, "onInitRun");
                        }  
                    }
                    if (isCallConversation === 'true' && data.suggestions) {
                        let buldHtml = `
                        <div class="buld-count-utt" id="buldCount-${uuids}">
                                    <i class="ast-bulb" id="buldCountAst-${uuids}"></i>
                                    <span class="count-number" id="buldCountNumber-${uuids}">${(data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0)}</span>
                                </div>`;

                        let attrs = $('#scriptContainer .other-user-bubble .bubble-data');
                        $(attrs).last().attr('id', uuids)
                        attrs.each((i, data) => {
                            if (data.id === uuids) {
                                $(`#${data.id}`).append(buldHtml);
                            }
                        });
                    }
                    var _msgsResponse = {
                        "type": "bot_response",
                        "from": "bot",
                        "message": [],
                        "messageId": uuids,
                        "botInfo": {
                            "chatBot": "sample Bot",
                            "taskBotId": botId
                        },
                        "createdOn": "2022-03-21T07:56:18.225Z",
                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                        "traceId": "873209019a5adc26"
                    }

                    console.log(isAutomationOnGoing, "is automation on going", data.suggestions, answerPlaceableIDs);
                    if (!isAutomationOnGoing && data.suggestions && answerPlaceableIDs.length == 0) {
                        // $('#welcomeMsg').addClass('hide');
                        let dynamicBlock = document.getElementById('dynamicBlock');
                        let suggestionsblock = $('#dynamicBlock .dialog-task-run-sec');
                        if (suggestionsblock.length >= 0) {
                            suggestionsblock.each((i, ele) => {
                                $('#dynamicBlock .agent-utt-info').each((i, elem) => {
                                    let elemID = elem.id.split('-');
                                    elemID.shift();
                                    if (ele.id.includes(elemID.join('-'))) {
                                        let foundIndex = automationNotRanArray.findIndex((ele)=>ele.id === elem.id);
                                        if(foundIndex == -1){
                                            automationNotRanArray.push({name:elem.innerText.trim(),id:elem.id});
                                            var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                            var appState = JSON.parse(appStateStr);
                                            var convState = appState[_conversationId] || {};
                                            if(!appState[_conversationId]) {
                                                convState = appState[_conversationId] = {};
                                            }else{
                                                
                                                if (!convState['assistTab'] ) {
                                                    convState['assistTab'] = {};
                                                }
                                                if (!convState['assistTab']['automationsNotRanArray']) {
                                                    convState['assistTab']['automationsNotRanArray'] = [];
                                                }
                                                    convState['assistTab']['automationsNotRanArray'] = automationNotRanArray;
                                                localStorage.setItem('agentAssistState', JSON.stringify(appState))
                                            }
                                        }
                                        // elem.remove();
                                    }
                                })
                                // ele.remove();
                            })
                        }
                        userIntentInput = data.userInput;
                        let htmls = `
            <div class="agent-utt-info" id="agentUttInfo-${responseId}">
                <div class="user-img">
                    <img src="./images/userIcon.svg">
                </div>
                <div class="text-user" >${data.userInput}</div>
            </div>
            <div class="dialog-task-run-sec hide" id="automationSuggestions-${responseId}">
            </div>`;

                        dynamicBlock.innerHTML = dynamicBlock.innerHTML + htmls;

                        if (data.type === 'intent' || data.type === 'text') {
                            let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
                            automationSuggestions.classList.remove('hide');
                        }

                        if (data.suggestions) {
                            
                            idsOfDropDown = undefined;
                            if (data.suggestions.dialogs?.length > 0) {

                                let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
                                let dialogAreaHtml = `<div class="task-type" id="dialoguesArea">
                  <div class="img-block-info">
                      <img src="./images/dialogtask.svg">
                  </div>
                  <div class="content-dialog-task-type" id="dialogSuggestions-${responseId}">
                    <div class="type-with-img-title">Dialog task (${data.suggestions.dialogs.length})</div>
                  </div>
                </div>`;
                                automationSuggestions.innerHTML += dialogAreaHtml;
                            }

                            if (data.suggestions.faqs?.length > 0) {
                                let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
                                let dialogAreaHtml = `<div class="task-type" id="faqssArea">
                <div class="img-block-info">
                    <img src="./images/kg.svg">
                </div>
                <div class="content-dialog-task-type" id="faqsSuggestions-${responseId}">
                    <div class="type-with-img-title">FAQ (${data.suggestions.faqs.length})</div>
                    
                </div>
            </div>`;
                                automationSuggestions.innerHTML += dialogAreaHtml;
                            }
                            
                            if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {
                                data.suggestions = formatSearchAssistData(data.suggestions);
                                if(data.suggestions.articles?.length > 0){
                                    let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
                                    let dialogAreaHtml = `<div class="task-type" id="articlesArea">
                                            <div class="img-block-info">
                                                <img src="./images/kg.svg">
                                            </div>
                                            <div class="content-dialog-task-type" id="articleSuggestions-${responseId}">
                                                <div class="type-with-img-title">Articles (${data.suggestions.articles.length})</div>
                                                
                                            </div>
                                        </div>`;
                                    automationSuggestions.innerHTML += dialogAreaHtml;
    
                                }

                                data.suggestions.articles?.forEach((ele, index) => {
                                    let body = {};
                                    body['type'] = 'text';
                                    body['component'] = {
                                        "type": 'text',
                                        "payload": {
                                            "type": 'text',
                                            "text": ele
                                        }
                                    };
                                    body['cInfo'] = {
                                        "body": data.value
                                    };
                                    let articleSuggestions = document.getElementById(`articleSuggestions-${responseId}`);
    
                                    let articleHtml = `
                                    <div class="type-info-run-send" id="articleDiv-${uuids+index}">
                                        <div class="left-content" id="articleSection-${uuids+index}">
                                            <div class="title-text" id="articletitle-${uuids+index}">${ele.title}</div>
                                        </div>
                                        
                                    </div>`;
    
                                    articleSuggestions.innerHTML += articleHtml;
                                    let articles = $(`.type-info-run-send #articleSection-${uuids+index}`);
                                    if (!ele.content) {
                                        let checkHtml = `
                                        <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                                        data-bot-id="${botId}" data-intent-name="${ele.title}"
                                        data-check="true" id="articlecheck-${uuids + index}"></i>`;
                                                    articles.append(checkHtml);
                                    } else {
                                            let a = $(`#articleDiv-${uuids + index}`);
                                            let articleActionHtml = `<div class="action-links">
                                            <button class="send-run-btn" id="articlesendMsg" data-msg-id="article-${uuids + index}" data-msg-data="${ele.content}">Send</button>
                                            <div class="copy-btn" data-msg-id="article-${uuids + index}" data-msg-data="${ele.content}">
                                                <i class="ast-copy" data-msg-id="article-${uuids + index}" data-msg-data="${ele.content}"></i>
                                            </div>
                                        </div>`;
                                        a.append(articleActionHtml);
                                        articles.append(`<div class="desc-text" id="articledesc-${uuids + index}">${ele.content}</div>`);
                                        if(ele.link){
                                            let fullArticleLinkHtml = `<div class="link-view-full-article hide" id="articleViewLink-${uuids+index}"><a href="${ele.link}" target="_blank">View Full Article</a></div>`
                                             document.getElementById(`articledesc-${uuids+index}`).insertAdjacentHTML('beforeend',fullArticleLinkHtml);
                                         }
    
                                        let articlestypeInfo = $(`.type-info-run-send #articleSection-${uuids + index}`);
                                        let seeMoreButtonHtml = `
                                    <button class="ghost-btn hide" style="font-style: italic;" id="articleseeMore-${uuids + index}" data-article-see-more="true">Show more</button>
                                    <button class="ghost-btn hide" style="font-style: italic;" id="articleseeLess-${uuids + index}" data-article-see-less="true">Show less</button>
                                    `;
                                        articlestypeInfo.append(seeMoreButtonHtml);
                                        setTimeout(() => {
                                            updateSeeMoreButtonForAssist(uuids + index,'article');
                                        }, 100);
                                    }
    
                                    // if (data.suggestions.faqs.length === 1 && !ele.answer) {
                                    //     document.getElementById(`check-${uuids + index}`).click();
                                    //     $(`#check-${uuids + index}`).addClass('hide');
                                    // }
                                })

                            }

                            data.suggestions.dialogs?.forEach((ele, index) => {
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele.name
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.userInput
                                };
                                ele.entities?.length > 0 ? (entitiestValueArray = ele.entities) : '';

                                let dialogSuggestions = document.getElementById(`dialogSuggestions-${responseId}`);
                                let dialogsHtml = `
                    <div class="type-info-run-send" id="suggestionId-${uuids}">
                        <div class="left-content">
                            <div class="title-text" id="automation-${uuids}">${ele.name}</div>
                        </div>
                        <div class="action-links">
                            <button class="send-run-btn" data-conv-id="${data.conversationId}"
                            data-bot-id="${botId}" data-intent-name="${ele.name}"
                            data-run="true" id="run-${uuids}"
                            >RUN</button>
                            <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uuids}">
                                <div class="elipse-icon" id="elipseIcon-${uuids}">
                                    <i class="ast-overflow" id="overflowIcon-${uuids}"></i>
                                </div>
                                <div class="dropdown-content-elipse" id="runAgtBtn-${uuids}">
                                    <div class="list-option" data-conv-id="${data.conversationId}"
                                    data-bot-id="${botId}" data-intent-name="${ele.name}"
                                     id="agentSelect-${uuids}"
                                    data-exhaustivelist-run="true">Run with Agent Inputs</div>
                                </div>
                        </div>
                    </div>`;
                                dialogSuggestions.innerHTML += dialogsHtml;
                                if (ele.entities?.length > 0) {
                                    previousEntitiesValue = JSON.stringify(ele.entities);
                                    let entitesDiv = `<div class="entity-values-container" id="entitesDiv-${uuids}">
                                    <fieldset class="fieldsets">
                                        <legend>ENTITY VALUES</legend>
                                        </fieldset>
                                <div class="edit-values-btn" id="entityEdit-${uuids}">Edit Values</div>
                                <div class="edit-values-btn restore hide" id="restorebtn-${uuids}">Restore Values</div>
                            </div>`;
                                    dialogSuggestions.innerHTML += entitesDiv;
                                    let enentiesDomDiv = $(`#entitesDiv-${uuids}`).find('.fieldsets');
                                    ele.entities?.forEach((eleData, i) => {

                                        let eachEntitiesDiv = `
                                     <div class="entity-row-data" id="enityNameAndValue-${i}">
                                        <div class="label-data">${eleData.name}</div>
                                        <div class="edited-status hide">
                                            <i class="ast-edited"></i>
                                            <span>edited</span>
                                        </div>
                                        <div class="entity-input-content-data">
                                            <div class="entity-value" id="initialentityValue-${i}" >${eleData.value}</div>
                                            <div class="entity-input">
                                                <input type="text" id="entityValue-${i}" data-isentity-values='true'
                                                 value='${eleData.value}'>
                                            </div>
                                        </div>
                                    </div>`;
                                        enentiesDomDiv.append(eachEntitiesDiv);

                                    });
                                    let entiteSaveAndCancelDiv = `<div class="save-reset-cancel hide" id='saveAndCancel-${uuids}'>
                                 <div class="save-reset-disabled" >
                                     <i class="ast-check-right  disabled-color"></i>
                                     <span id='savebtn-${uuids}'>Save</span>
                                 </div>
                                 <div class="cancel-btn" id="cancelBtn-${uuids}">Cancel</div>
                             </div>`;
                                    enentiesDomDiv.append(entiteSaveAndCancelDiv);
                                }
                                _msgsResponse.message.push(body);
                            });

                            data.suggestions.faqs?.forEach((ele, index) => {
                                let body = {};
                                body['type'] = 'text';
                                body['component'] = {
                                    "type": 'text',
                                    "payload": {
                                        "type": 'text',
                                        "text": ele
                                    }
                                };
                                body['cInfo'] = {
                                    "body": data.value
                                };
                                let faqsSuggestions = document.getElementById(`faqsSuggestions-${responseId}`);

                                let faqHtml = `
                    <div class="type-info-run-send" id="faqDiv-${uuids+index}">
                        <div class="left-content" id="faqSection-${uuids+index}">
                            <div class="title-text" id="title-${uuids+index}">${ele.question}</div>
                            
                            
                        </div>
                        
                    </div>`;

                                faqsSuggestions.innerHTML += faqHtml;
                                let faqs = $(`.type-info-run-send #faqSection-${uuids+index}`);
                                if (!ele.answer) {
                                    let positionID = 'dg-'+koreGenerateUUID();
                                    let checkHtml = `
                        <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-intent-name="${ele.question}"
                        data-check="true" id="check-${uuids+index}" data-position-id="${positionID}"></i>`;
                                    // faqs.append(checkHtml);
                                    // $(`#title-${uuids+index}`).addClass('noPadding');
                                    $(`#faqDiv-${uuids+index}`).addClass('is-dropdown-show-default');
                                    document.getElementById(`title-${uuids+index}`).insertAdjacentHTML('beforeend',checkHtml);
                                } else {
                                    let a = $(`#faqDiv-${uuids+index}`);
                                    let faqActionHtml = `<div class="action-links">
                        <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids+index}" data-msg-data="${ele.answer}">Send</button>
                        <div class="copy-btn" data-msg-id="${uuids+index}" data-msg-data="${ele.answer}">
                            <i class="ast-copy" data-msg-id="${uuids+index}" data-msg-data="${ele.answer}"></i>
                        </div>
                    </div>`;
                                    a.append(faqActionHtml);
                                    faqs.append(`<div class="desc-text" id="desc-${uuids+index}">${ele.answer}</div>`);
                                     
                                    let faqstypeInfo = $(`.type-info-run-send #faqSection-${uuids + index}`);
                                    let seeMoreButtonHtml = `
                                <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${uuids + index}" data-see-more="true">Show more</button>
                                <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uuids + index}" data-see-less="true">Show less</button>
                                `;
                                    faqstypeInfo.append(seeMoreButtonHtml);
                                    setTimeout(() => {
                                        updateSeeMoreButtonForAssist(uuids + index);
                                    }, waitingTimeForSeeMoreButton);
                                }
                           
                            if(data.suggestions.faqs.length === 1 && !ele.answer) {
                                document.getElementById(`check-${uuids+index}`).click();
                                $(`#check-${uuids+index}`).addClass('hide');
                                $(`#faqDiv-${uuids+index}`).removeClass('is-dropdown-show-default');
                            }
                            })
                        }
                        setTimeout(() => {         
                            updateNewMessageUUIDList(responseId);
                        }, waitingTimeForUUID);   
                        collapseOldDialoguesInAssist();
                    } else {
                        if (data.type === 'text' && data.suggestions) {
                            let faqAnswerIdsPlace ;
                            data.suggestions.faqs.forEach((ele) => {
                                faqAnswerIdsPlace = answerPlaceableIDs.find(ele => ele.input == data.value);
                                if(faqAnswerIdsPlace){
                                    let splitedanswerPlaceableID = faqAnswerIdsPlace.id.split('-');
                                    splitedanswerPlaceableID.shift();
     
                                    let faqDiv = $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`);
                                    let faqaction = `<div class="action-links">
                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${splitedanswerPlaceableID.join('-')}"  data-msg-data="${ele.answer}">Send</button>
                                        <div class="copy-btn" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}">
                                        <i class="ast-copy" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${ele.answer}"></i>
                                        </div>
                                        </div>`;
                                     
                                     faqDiv.append(faqaction);
     
                                 //    let faqAnswerSendMsg =  $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                                 //    $(faqAnswerSendMsg).attr('data-msg-data',ele.answer)
                                 //    let faqAnswerCopyMsg =  $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                                 //    $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
     
                                     $(`#${faqAnswerIdsPlace.id}`).html(ele.answer);
                                     $(`#${faqAnswerIdsPlace.id}`).attr('data-answer-render', 'true');
                                     let faqs = $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')}`);
                                     let seeMoreButtonHtml = `
                             <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true">Show more</button>
                             <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true">Show less</button>
                             `;
                                     faqs.append(seeMoreButtonHtml);
                                     console.log("updat see more button for assist");
                                     setTimeout(() => {
                                         updateSeeMoreButtonForAssist(splitedanswerPlaceableID.join('-'));
                                     }, waitingTimeForSeeMoreButton);
                                }
                                // $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide');
                            })
                            if(faqAnswerIdsPlace) {
                                let index = answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
                                answerPlaceableIDs.splice(index, 1);
                            }
                            
                        }
                        if (data.suggestions) {
                            automationSuggestions.length >= 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide')) : ''
                            collapseOldDialoguesInAssist();  
                        }
                    }

                    let parsedPayload;
                    data.buttons?.forEach((elem) => {
                        if(elem.value){
                            elem.value = elem.value.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
                        }
                        let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");
                        try {
                            if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                parsedPayload = JSON.parse(withoutSpecials);
                            }
                        }catch(error){
                            if(payloadType.text){
                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                parsedPayload = withoutSpecials;
                            }
                        }
                       
                        let body = {};
                        body['type'] = elem.type;
                        if (!parsedPayload) {
                            elem.value = htmlEntities(elem.value);
                            body['component'] = {
                                "type": elem.type,
                                "payload": {
                                    "type": elem.type,
                                    "text": elem.value
                                }
                            };
                            body['cInfo'] = {
                                "body": elem.value
                            };

                        } else {
                            body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                            if (parsedPayload?.type === 'message') {
                                body['cInfo'] = {
                                    "body": ''
                                };
                            } else if (parsedPayload?.text) {
                                body['cInfo'] = {
                                    "body": parsedPayload.text
                                };
                            } else {
                                body['cInfo'] = {
                                    "body": parsedPayload
                                };
                            }

                        }

                        _msgsResponse.message.push(body);
                    });
                    if (isAutomationOnGoing && dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (dialogPositionId && !data.positionId || data.positionId == dialogPositionId)) {
                        let msgStringify = JSON.stringify(_msgsResponse);
                        let newTemp = encodeURI(msgStringify);
                        $(`#overRideBtn-${dropdownHeaderUuids}`).removeClass('hide');
                        $(`#cancelOverRideBtn-${dropdownHeaderUuids}`).addClass('hide');
                        $("#inputFieldForAgent").remove();
                        let runInfoContent = $(`#dropDownData-${dropdownHeaderUuids}`);
                        setTimeout(() => {
                            if(data.entityName){
                                agentAssistResponse = {};
                                agentAssistResponse = Object.assign({},data);
                            }
                        }, 10);
                        let askToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Ask customer</div>
                           <div class="agent-utt">
                               <div class="title-data"><ul class="chat-container" id="displayData-${uuids}"></ul></div>
                               <div class="action-links">
                                   <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}">Send</button>
                                   <div class="copy-btn hide" data-msg-id="${uuids}">
                                       <i class="ast-copy" data-msg-id="${uuids}"></i>
                                   </div>
                               </div>
                           </div>
                           </div>
                       </div>
            `;

                        let tellToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Tell Customer</div>
                           <div class="agent-utt">
                               <div class="title-data" ><ul class="chat-container" id="displayData-${uuids}"></ul></div>
                               <div class="action-links">
                                   <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}">Send</button>
                                   <div class="copy-btn hide" data-msg-id="${uuids}">
                                       <i class="ast-copy" data-msg-id="${uuids}"></i>
                                   </div>
                               </div>
                           </div>
                           </div>
                       </div>
            `;
                        if (data.isPrompt) {
                            runInfoContent.append(askToUserHtml);
                            if(!proactiveMode){
                                getOverRideMode('overRideBtn-' + dropdownHeaderUuids, dialogPositionId);
                            }else{
                                $(`.override-input-div`).removeClass('hide');
                            }
                        } else {
                            $(`.override-input-div`).addClass('hide');
                            runInfoContent.append(tellToUserHtml);
                        }

                        if (!parsedPayload) {
                            $(runInfoContent).find('.copy-btn').removeClass('hide');
                        }
                        if((!sourceType || sourceType !== 'smartassist-color-scheme') && parsedPayload){
                            $(runInfoContent).find('.send-run-btn').addClass('hide');
                        }
                        setTimeout(() => {             
                            updateNewMessageUUIDList(dropdownHeaderUuids);
                        }, waitingTimeForUUID);
                    }

                 
                    if(isAutomationOnGoing && !parsedPayload && !data.suggestions){
                        if(document.getElementsByClassName('.welcome-msg').length <= 0){
                            $('#dynamicBlock .empty-data-no-agents').addClass('hide');
                            let dynamicBlockDiv = $('#dynamicBlock');
                            data.buttons?.forEach((ele, i) => {
                                let welcomeMsgHtml = `
                                <div class = "welcome-msg collapse-acc-data before-none" id='smallTalk-${uuids}'>
                                    <div class="steps-run-data">
                                        <div class="icon_block">
                                            <i class="ast-agent"></i>
                                        </div>
                                        <div class="run-info-content">
                                        
                                        </div>
                                    </div>
                                </div>`;
                                if (data.buttons?.length > 1) {
                                    if (i == 0) {
                                        dynamicBlockDiv.prepend(welcomeMsgHtml);
                                        let runInfoDivOfwelcome = $(`#dynamicBlock .welcome-msg .run-info-content`);
                                        let contentHtml = `
                                    <div class="title">Customer has waited for an agent for few seconds.<br/>Here are some appropriate opening lines.</div>
                                       <div class="agent-utt">
                                        <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                        <div class="action-links">
                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                            <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                                <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                            </div>
                                        </div>
                                    </div>`;
                                    runInfoDivOfwelcome.append(contentHtml);
                                    }else {
                                        let runInfoDivOfwelcome = $(`#dynamicBlock .welcome-msg .run-info-content`);
                                        let contentHtmlWithoutTellCus = `
                                        <div class="agent-utt">
                                            <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                            <div class="action-links">
                                                <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                                <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                                    <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                                </div>
                                            </div>
                                        </div>`;
                                        runInfoDivOfwelcome.append(contentHtmlWithoutTellCus);
                                    }
                                }
                            });
                            if(numberOfNewMessages == 1){
                                numberOfNewMessages = 0;
                                scrollToBottom();
                            }    
                        }
                    }
                    if(!isAutomationOnGoing && dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (dialogPositionId && !data.positionId || data.positionId == dialogPositionId)){
                        $('#dynamicBlock .empty-data-no-agents').addClass('hide');
                        let dynamicBlockDiv = $('#dynamicBlock');
                        data.buttons?.forEach((ele, i) => {
                            let botResHtml = `
                                <div class="collapse-acc-data before-none" id='smallTalk-${uuids}'>
                            <div class="steps-run-data">
                            <div class="icon_block">
                                <i class="ast-agent"></i>
                            </div>
                            <div class="run-info-content" >
                            <div class="title">Tell Customer</div>
                            <div class="agent-utt">
                                <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                <div class="action-links">
                                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                    <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                        <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>`;
                            dynamicBlockDiv.append(botResHtml);
                        });
                    }
                    if (!isAutomationOnGoing && !dropdownHeaderUuids && !parsedPayload && !data.suggestions) {
                        
                        $('#dynamicBlock .empty-data-no-agents').addClass('hide');
                        let dynamicBlockDiv = $('#dynamicBlock');
                        data.buttons?.forEach((ele, i) => {
                            let welcomeMsgHtml = `
                            <div class = "welcome-msg collapse-acc-data before-none" id='smallTalk-${uuids}'>
                                <div class="steps-run-data">
                                    <div class="icon_block">
                                        <i class="ast-agent"></i>
                                    </div>
                                    <div class="run-info-content">
                                    
                                    </div>
                                </div>
                            </div>`;
                            if (data.buttons?.length > 1) {
                                if (i == 0) {
                                    dynamicBlockDiv.prepend(welcomeMsgHtml);
                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data#smallTalk-${uuids} .run-info-content`);
                                    let contentHtml = `
                                <div class="title">Customer has waited for an agent for few seconds.<br/>Here are some appropriate opening lines.</div>
                                   <div class="agent-utt">
                                    <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                    <div class="action-links">
                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                        <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                            <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                        </div>
                                    </div>
                                </div>`;
                                    runInfoDivOfwelcome.append(contentHtml);
                                } else {
                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data#smallTalk-${uuids} .run-info-content`);
                                    let contentHtmlWithoutTellCus = `
                                    <div class="agent-utt">
                                        <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                        <div class="action-links">
                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                            <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                                <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                            </div>
                                        </div>
                                    </div>`;
                                    runInfoDivOfwelcome.append(contentHtmlWithoutTellCus);
                                }
                            } else {
                                let botResHtml = `
                                <div class="collapse-acc-data before-none" id='smallTalk-${uuids}'>
                             <div class="steps-run-data">
                             <div class="icon_block">
                                 <i class="ast-agent"></i>
                             </div>
                             <div class="run-info-content" >
                             <div class="title">Tell Customer</div>
                             <div class="agent-utt">
                                 <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                 <div class="action-links">
                                     <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${ele.value}">Send</button>
                                     <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                         <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                     </div>
                                 </div>
                             </div>
                             </div>
                         </div>
                         </div>`;
                                dynamicBlockDiv.append(botResHtml);
                                collapseOldDialoguesInAssist();
                            }
                        });
                        setTimeout(() => {  
                            updateNewMessageUUIDList(uuids);
                        }, waitingTimeForUUID);
                    }
                    dropdownHeaderUuids ? AgentChatInitialize.renderMessage(_msgsResponse, uuids, `dropDownData-${dropdownHeaderUuids}`) : '';

                    // let noOfStepsOfSmallTalk = $(`.body-data-container #dynamicBlock #welcomeMsg`).find('.steps-run-data').not('.hide');
                    // if (noOfStepsOfSmallTalk.length >= 2) {
                    //     $(noOfStepsOfSmallTalk).addClass('hide');
                    //     $(noOfStepsOfSmallTalk[noOfStepsOfSmallTalk.length - 2]).removeClass('hide').attr('style', 'color:gray');
                    //     $(noOfStepsOfSmallTalk[noOfStepsOfSmallTalk.length - 1]).removeClass('hide');
                    // }
                    // removeElementFromDom();
                    // let noOfSteps = $(`.body-data-container #dynamicBlock .dialog-task-accordiaon-info`).find('.steps-run-data').not('.hide');
                    // if (noOfSteps.length >= 2) {
                    //     $(noOfSteps).addClass('hide');
                    //     $(noOfSteps[noOfSteps.length - 2]).removeClass('hide').attr('style', 'color:gray');
                    //     $(noOfSteps[noOfSteps.length - 1]).removeClass('hide');
                    // }
                    if (isAutomationOnGoing && (((data.endOfFaq || data.endOfTask) && data.type !== 'text') || (data.userInput == 'discard all' && data.type !== 'text') || (userMessage && userMessage.value && userMessage.value.includes('discard')))) {
                        // isAutomationOnGoing = false;
                        // var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        // var appState = JSON.parse(appStateStr);
                        // if (appState[_conversationId]) {
                        //     appState[_conversationId].automationGoingOn = isAutomationOnGoing;
                        //     appState[_conversationId]['automationGoingOnAfterRefresh'] = isAutomationOnGoing;
                        //     localStorage.setItem('agentAssistState', JSON.stringify(appState))
                        // }
                        // //  isOverRideMode = false;
                        // $(`.override-input-div`).remove();
                        // addFeedbackHtmlToDom(data, botId, userIntentInput);
                        // userMessage = {};
                        // let dropDownDataElement = document.getElementById(`dropDownData-${dropdownHeaderUuids}`);
                        // let steprunelementArray = dropDownDataElement.querySelectorAll('.steps-run-data');
                        // let lastStepNode = steprunelementArray[steprunelementArray.length - 1];
                        // $(lastStepNode).addClass('last-child-step-run');
                    }
                    if (scrollAtEnd) {
                        scrollToBottom();
                    }
                    addWhiteBackgroundClassToNewMessage();
                }

                function dialogTerminatedOrIntruppted(data, botId, userIntentInput) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if(data.endOfTask && data?.isSearch !== undefined && !data?.isSearch ) {
                        dialogTerminatedOrIntrupptedInMyBot(data, botId, userIntentInput, appState);
                    }else {
                        isAutomationOnGoing = false;
                        isInitialDialogOnGoing = true;
                        if (appState[_conversationId]) {
                            appState[_conversationId].automationGoingOn = isAutomationOnGoing;
                            appState[_conversationId].initialTaskGoingOn =  isInitialDialogOnGoing;
                            appState[_conversationId]['automationGoingOnAfterRefresh'] = isAutomationOnGoing;
                            localStorage.setItem('agentAssistState', JSON.stringify(appState))
                        }
                        isOverRideMode = false;
                        $(`.override-input-div`).remove();
                        addFeedbackHtmlToDom(data, botId, userIntentInput);
                        userMessage = {};
                    }
                    
                }

                function terminateTheDialog(data, tabName){
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if( tabName == 'agentAutoIcon') {
                        dialogTerminatedOrIntrupptedInMyBot(data, data.botId, userIntentInput, appState);
                    }else if(tabName == 'userAutoIcon'){
                        isAutomationOnGoing = false;
                        if (appState[_conversationId]) {
                            appState[_conversationId].automationGoingOn = isAutomationOnGoing;
                            appState[_conversationId]['automationGoingOnAfterRefresh'] = isAutomationOnGoing;
                            localStorage.setItem('agentAssistState', JSON.stringify(appState))
                        }
                          isOverRideMode = false;
                        $(`.override-input-div`).remove();
                        addFeedbackHtmlToDom(data, data.botId, userIntentInput);
                        userMessage = {};
                    }
                }

                function dialogTerminatedOrIntrupptedInMyBot(data, botId, userIntentInput, appState) {
                    isMyBotAutomationOnGoing = false;
                    if (appState[_conversationId]) {
                        appState[_conversationId]['automationGoingOnAfterRefreshMyBot'] = isMyBotAutomationOnGoing;
                        localStorage.setItem('agentAssistState', JSON.stringify(appState))
                    }
                    addFeedbackHtmlToDom(data, botId, userIntentInput, 'runForAgentBot');
                }

                function htmlEntities(str) {
                    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos/g,"'");
                }

                function addBlurToOldMessage(newElementsHeight){
                    let dynamicBlockHeight = $(".dynamic-block-content").height();
                    $(".dynamic-block-blur").height(dynamicBlockHeight - newElementsHeight);
                }

                function RemoveVerticalLineForLastResponse(){
                    let accordionInfoList = document.querySelectorAll('.dialog-task-accordiaon-info');
                    for(let info of accordionInfoList){
                        let stepsrunList = info.querySelectorAll('.steps-run-data');
                        for(let node of stepsrunList){
                            $(node).removeClass('last-child-step-run');
                        }
                        let lastStepNode = stepsrunList[stepsrunList.length -1];
                        $(lastStepNode).addClass('last-child-step-run');
                    }
                }


                function processTranscriptData(data, conversationId, botid) {
                    console.log("---- data====", data)
                    let time = new Date();
                    let timeStr = formatAMPM(time);
                    //  ["user_message", { "botId": "st-760d56df-7303-5968-baae-fc4b3a6d5057", "orgId": "o-e8bde714-ea18-5b2a-8d59-648fb1ba49ee", "accountId": "62b400e7e8d0a17ed980fc3f", "type": "text", "conversationId": "c-423773d-0e9b-4510-93c3-5a492e75ae08", "value": "Operator.", "author": { "type": "USER", "id": "u-cb358b24-cc42-5843-9040-d0a61d1f7cc7", "firstName": "Kore", "lastName": "User" }, "event": "user_message", "_id": "ms-3ceba4be-0870-567a-a36d-236c749d4edb" }]
                    let transcriptTab = $(`#scriptContainer .data-contnet`);
                    let transcriptHtml = `
                        <div class="other-user-bubble">
                            <div class="name-with-time">
                                <div class="u-name">${parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'Customer'}</div>
                                <div class="u-time">${timeStr}</div>
                            </div>
                            <div class="bubble-data" id="userInputMsg">
                                <div class="b-text">${data.value}</div>
                            </div>
                        </div>`;
                    transcriptTab.append(transcriptHtml);
                }

                function formatAMPM(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;
                    return strTime;
                }

                function processAgentMessages(data) {
                    let time = new Date();
                    let timeStr = formatAMPM(time);
                    //  ["agent_message",{"botId":"st-760d56df-7303-5968-baae-fc4b3a6d5057","orgId":"o-e8bde714-ea18-5b2a-8d59-648fb1ba49ee","accountId":"62b400e7e8d0a17ed980fc3f","type":"text","conversationId":"c-0ead79b-28a0-422a-ab91-bab8372345e2","value":"One night.","author":{"type":"AGENT","id":"u-0609dd49-12b7-5432-9cc6-afb2f41128fe","firstName":"dev","lastName":"test"},"event":"agent_message","_id":"ms-1b113b73-d52e-5807-a990-5286b79f81a3"}]
                    let dataConetentTabOfTranscript = $('#scriptContainer .data-contnet');
                    let currentBubbleHtml = `
                    <div class="current-user-bubble">
                    <div class="name-with-time">
                        <div class="u-time">${timeStr}</div>
                        <div class="u-name">You</div>
                    </div>
                    <div class="bubble-data">
                        <div class="b-text">${data.value}</div>
                    </div>
                </div>`;
                    dataConetentTabOfTranscript.append(currentBubbleHtml)
                }

                function removeElementFromDom() {
                    let fromCurrentUsers = document.getElementsByClassName('fromCurrentUser');
                    for (let ele of fromCurrentUsers) {
                        ele.remove();
                    }


                    let profilephoto = document.getElementsByClassName('profile-photo');
                    for (let ele of profilephoto) {
                        ele.remove();
                    }
                    let extrainfo = document.getElementsByClassName('extra-info');
                    for (let ele of extrainfo) {
                        ele.remove();
                    }
                    let fromOtherUsers = document.getElementsByClassName('fromOtherUsers');
                    let eleIds;
                    for (let ele of fromOtherUsers) {
                        if (eleIds === ele.getAttribute('id')) {
                            ele.remove();
                        } else {
                            eleIds = ele.getAttribute('id');
                        }


                        if (ele.hasAttribute('aria-live')) {
                            ele.remove();
                        }
                    }
                }

                function _createRunTemplateContainerForMyTab(agentBotuuids, intentName, dialogId) {
                    let dynamicBlock = document.getElementById('myBotAutomationBlock');
                    let dropdownHtml = `
                <div class="dialog-task-accordiaon-info hide" id="MyBotaddRemoveDropDown-${agentBotuuids}">
                    <div class="accordion-header" id="dropDownHeader-${agentBotuuids}" data-drop-down-opened="false">
                        <div class="icon-info">
                            <i class="ast-rule"></i>
                        </div>
                        <div class="header-text" id="dropDownTitle-${agentBotuuids}">${intentName}</div>
                        <i class="ast-carrotup rotate-carrot"></i>
                        <button class="btn-danger" id="myBotTerminateAgentDialog-${agentBotuuids}" data-position-id="${dialogId}">Terminate</button>
                    </div>
                    <div class="collapse-acc-data" id="dropDownData-${agentBotuuids}">


                    </div>
                </div>`;
                    dynamicBlock.innerHTML += dropdownHtml;
                }

                function _createRunTemplateContiner(uuids, intentName, dialogId) {
                    let dynamicBlock = document.getElementById('dynamicBlock');
                    let dropdownHtml = `
       <div class="dialog-task-accordiaon-info hide" id="addRemoveDropDown-${uuids}" >
           <div class="accordion-header" id="dropDownHeader-${uuids}"
           data-drop-down-opened="false">
               <div class="icon-info">
                   <i class="ast-rule"></i>
               </div>
               <div class="header-text" id="dropDownTitle-${uuids}">${intentName}</div>
               <i class="ast-carrotup rotate-carrot"></i>
               <button class="btn-danger" id="terminateAgentDialog" data-position-id="${dialogId}">Terminate</button>
           </div>
           <div class="collapse-acc-data" id="dropDownData-${uuids}">
            <div class="override-input-div hide" id="overRideDiv-${uuids}" >
            <button class="override-input-btn" id="overRideBtn-${uuids}" data-position-id="${dialogId}">Override Input</button>
            <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${uuids}" data-position-id="${dialogId}">Cancel Override</button>
            </div>
              
           </div>
           
           </div>
           `;
                    dynamicBlock.innerHTML = dynamicBlock.innerHTML + dropdownHtml;
                }

                function updateAgentAssistState(_convId, _tabName, _data) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    var convState = appState[_convId] || {};
                    if (!appState[_convId]) {
                        convState = appState[_convId] = {};
                    }
                    if (!convState[_tabName]) {
                        convState[_tabName] = {};
                    }
                    // if (!convState[_tabName]['stateItems']) {
                    //     convState[_tabName]['stateItems'] = [];
                    // } 
                    if (!_data.suggestions && _data.buttons?.length > 1) {
                        convState['isWelcomeProcessed'] = true;
                        convState['automationGoingOn'] = isAutomationOnGoing;
                    }
                   // let stateItems = convState[_tabName]['stateItems'];
                    // if (stateItems.length >= 2) {
                    //     let lIntentName = null;
                    //     for (let i = stateItems.length-1; (i >= 0 && lIntentName == null); i--) {
                    //        let item = JSON.parse(stateItems[i]);
                    //        if (item.intentName) {
                    //           lIntentName = item.intentName;
                    //        }
                    //     }
                    //     if (!_data.intentName) {
                    //        _data.intentName = lIntentName;
                    //     }
                    //    if (JSON.parse(stateItems[0]).intentName === _data.intentName ) {
                    //         stateItems[0] = stateItems[1];
                    //         stateItems[1] = JSON.stringify(_data);
                    //    } else {
                    //        stateItems[0] = JSON.stringify(_data);
                    //        stateItems.splice(1,1);
                    //    }

                    // } else {
                    //     // let lIntentName = null;
                    //     // for (let i = stateItems.length-1; (i >= 0 && lIntentName == null); i--) {
                    //     //    let item = JSON.parse(stateItems[i]);
                    //     //    if (item.intentName) {
                    //     //       lIntentName = item.intentName;
                    //     //    }
                    //     // }
                    //     // if (!_data.intentName) {
                    //     //    _data.intentName = lIntentName;
                    //     // }
                    //     stateItems.push(JSON.stringify(_data));
                    // }
                  //  stateItems.push(JSON.stringify(_data));
                    localStorage.setItem('agentAssistState', JSON.stringify(appState));
                }
                function addFeedbackHtmlToDomForHistory(data, botId, userIntentInput, id, runForAgentBot, previousTaskPositionId) {
                    var dropDownData;
                    var endOfDialoge;
                    let taskIdOfDialog = $(`#dropDownData-${id}`).attr('data-taskId');
                    let positionID = previousTaskPositionId;
                    if (runForAgentBot) {
                        $(`#myBotTerminateAgentDialog-${id}.btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${id}`);
                        endOfDialoge = $(`#MyBotaddRemoveDropDown-${id}`);
                    } else {
                        $(`#addRemoveDropDown-${id} .btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${id}`);
                        endOfDialoge = $(`#addRemoveDropDown-${id}`);
                    }
                    // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                    let feedbackHtml = ` 
        <div class="feedback-data last-child-step-run">
        <div class="feedbackup-data" id="feedBackLikeContainer-${id}">
            <div class="feedback-icon" id="feedbackup-${id}" data-feedbacklike="false"
            data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="like"
                        data-dialog-name="${data.tN}"
                        data-user-input="${userIntentInput}">
                <i class="ast-thumbup" id="feedbackup-${id}"
                data-feedbacklike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="like"
                        data-dialog-name="${data.tN}"
                        data-user-input="${userIntentInput}"></i>
            </div>
            <span class="tootltip-tabs">Like</span>
            </div>
            <div class="feedbackdown-data" id="feedBackDislikeContainer-${id}">
            <div class="feedback-icon" id="feedbackdown-${id}" data-feedbackdislike="false"
            data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="dislike"
                        data-dialog-name="${data.tN}"
                        data-user-input="${userIntentInput}">
                <i class="ast-thumbdown" id="feedbackdown-${id}"
                data-feedbackdislike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="dislike"
                        data-dialog-name="${data.tN}"
                        data-user-input="${userIntentInput}"></i>
            </div>
            <span class="tootltip-tabs">Dislike</span>
            </div>
       </div>`;
                   // dropDownData.append(feedbackHtml);
        let endofDialogeHtml = `
                    <div class="dilog-task-end" id="endTaks-${id}">
                    <div class="text-dialog-task-end">Dialog Task ended</div>     
                               </div>
                               <div class="feedback-helpul-container" id="feedbackHelpfulContainer-${id}">
                                <div class="titles-content">
                                    <div class="title">Helpful?</div>
                                    <div class="btn-positive" id="feedbackup-${id}">
                                        <i class="ast-thumbup"
                                        id="feedbackup-${id}"
                                        data-feedbacklike="false"
                                        data-conv-id="${_conversationId}"
                                        data-bot-id="${botId}" data-feedback="like"
                                        data-dialog-name="${data.tN}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-taskID ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Like</span>
                                    </div>
                                    <div class="btn-negtive" id="feedbackdown-${id}">
                                        <i class="ast-thumbdown" 
                                        id="feedbackdown-${id}"
                                        data-feedbackdislike="false"
                                        data-conv-id="${_conversationId}"
                                        data-bot-id="${botId}" data-feedback="dislike"
                                        data-dialog-name="${data.tN}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-taskID ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Dislike</span>
                                    </div>
                                    <div class="thanks-update hide">Thanks for the feedback!</div>
                                    <div class="help-improve-arrow hide">
                                        <div class="title-improve hide">Help us improve (optional)</div>
                                        <div class="arrow-icon" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBack-${id}">
                                            <i class="ast-carrotup" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBackIcon-${id}"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="explore-more-negtive-data hide">
                                    <div class="btns-group-negtive-chips" id="feedBackOptions-${id}">
                                        <div class="btn-chip-negtive" data-chip-click='false'>Wrong suggestions</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Incorrect intent</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Accidental click</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Time taking</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Other</div>
                                    </div>
                                    <div class="input-block-optional">
                                        <div class="label-text">Additional comments (Optional)</div>
                                        <input type="text" placeholder="Type to add comment" class="input-text" id="feedBackComment-${id}"
                                        data-feedback-comment="true">
                                    </div>
                                    <button class="submit-btn" data-updateFlag="false" id="feedbackSubmit" disabled>Submit</button>
                                </div>
                            </div>
                        
                    `;
                    if(!document.getElementById('endTaks-' + id)){
                        endOfDialoge.append(endofDialogeHtml);
                    }
                    $(`.customer-feeling-text`).addClass('bottom-95');
                    setTimeout(() => {
                        id = undefined;
                    }, 100)
                    // dropdownHeaderUuids = undefined;
                }

                async function renderHistoryFeedBack(url){
                    const response = await $.ajax({
                        method: 'GET',
                        url: url
                    });
                    if(response.results) {
                        return response.results;
                    }else {
                        console.log("error")
                    }
                    
                     
                }


                async function renderingHistoryMessage () {
                    let url = `${connectionDetails.envinormentUrl}/agentassist/api/v1/agent-feedback/${_conversationId}?interaction=assist`;
                    let feedBackResult = await renderHistoryFeedBack(url);
                    // document.getElementById("loader").style.display = "block";
                    isShowHistoryEnable = true;
                    let historyFaqIDs = [];
                    getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_botId}/history?convId=${_conversationId}&agentHistory=false`)
                    .then(response => {
                        let appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        let appState = JSON.parse(appStateStr);
                        if (response?.length > 0 && appState[_conversationId]) {
                            isSendWelcomeMessage = false;
                        }else{
                            isSendWelcomeMessage = true;
                        }
                        var welcome_message_request = {
                            'waitTime': 2000,
                            'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
                            'id': _agentAssistDataObj.conversationId,
                            'isSendWelcomeMessage': isSendWelcomeMessage
                        }
        
                        _agentAsisstSocket.emit('welcome_message_request', welcome_message_request);
                        AgentAssistPubSub.publish('automation_exhaustive_list',
                        { conversationId: _agentAssistDataObj.conversationId, botId: _agentAssistDataObj.botId, 'experience': 'chat' });
                        document.getElementById("loader").style.display = "none";
                        updateUIState(_conversationId, isCallConversation);
                        let previousId;
                        let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
                        // if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                        //     $(`#historyData .collapse-acc-data.hide`)[$(`#historyData .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyData .show-history-feedback.hide`)[$(`#historyData .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyData .dilog-task-end.hide`)[$(`#historyData .dilog-task-end.hide`).length - 1]?.classList.remove('hide');


                        // } else {
                            let len = previousResp?.length - 1 <= 0? undefined:previousResp?.length-1;
                            let resp = response.length > 0 ? response?.slice(len, response.length) : undefined;
                            resp?.forEach((res, index) => {
                                // if (res.type == 'incoming') {
                                //     res.components?.forEach((ele) => {
                                //         if (ele.data.text == previousTaskName) {
                                //             previousTaskName = undefined;
                                //             previousId = undefined;
                                //             console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                                //         }
                                //     })
                                // }

                                if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && !res.agentAssistDetails?.faqResponse) {     
                                    let uniqueID = res._id;
                                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                    var appState = JSON.parse(appStateStr);               
                                    if (!appState[_conversationId]) {
                                        return 
                                    }
                                    var convState = appState[_conversationId];
                                    if (!convState['assistTab']) {return;}
                                    // if (!convState['assistTab'].automationsNotRanArray || convState['assistTab'].automationsNotRanArray.length == 0) {
                                    //   return;
                                    // }
                                    let automationsNotRanArray = convState['assistTab'].automationsNotRanArray;
                                        let historyDataHtml = $('#dynamicBlock');
                                       // if (automationsNotRanArray.findIndex(ele=>ele.name===res.agentAssistDetails?.userInput)!==-1) {

                                            let htmls = `
                                        <div class="agent-utt-info" id="agentUttInfo-${uniqueID}">
                                            <div class="user-img">
                                                <img src="./images/userIcon.svg">
                                            </div>
                                            <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                                        </div>
                                        <div class="dialog-task-run-sec" id="automationSuggestions-${uniqueID}">
                                        </div>`;

                                            historyDataHtml.append(htmls);
                                            let automationSuggestions = document.getElementById(`automationSuggestions-${uniqueID}`);
                                            if (res.agentAssistDetails?.ambiguityList?.dialogs?.length > 0 || res.agentAssistDetails?.suggestions?.dialogs?.length > 0) {


                                                let dialogAreaHtml = `<div class="task-type" id="dialoguesArea">
                              <div class="img-block-info">
                                  <img src="./images/dialogtask.svg">
                              </div>
                              <div class="content-dialog-task-type" id="dialogSuggestions-${uniqueID}">
                                <div class="type-with-img-title">Dialog task (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.dialogs?.length : res.agentAssistDetails?.ambiguityList.dialogs?.length})</div>
                              </div>
                            </div>`;
                                                automationSuggestions.innerHTML += dialogAreaHtml;
                                            }
                                            if (res.agentAssistDetails?.ambiguityList?.faqs?.length > 0 || res.agentAssistDetails?.suggestions?.faqs?.length > 0) {
                                                let dialogAreaHtml = `<div class="task-type" id="faqssArea">
                            <div class="img-block-info">
                                <img src="./images/kg.svg">
                            </div>
                            <div class="content-dialog-task-type" id="faqsSuggestions-${uniqueID}">
                                <div class="type-with-img-title">FAQ (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>
                                
                            </div>
                        </div>`;
                                                automationSuggestions.innerHTML += dialogAreaHtml;
                                            }
                                            let dialogsss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.dialogs) : (res.agentAssistDetails?.ambiguityList?.dialogs);
                                            dialogsss?.forEach((ele, index) => {

                                                let dialogSuggestions = document.getElementById(`dialogSuggestions-${uniqueID}`);
                                                let dialogsHtml = `
                                <div class="type-info-run-send">
                                    <div class="left-content">
                                        <div class="title-text" id="automation-${uniqueID}">${ele.name}</div>
                                    </div>
                                    <div class="action-links">
                                        <button class="send-run-btn" data-conv-id="${_agentAssistDataObj.conversationId}"
                                        data-bot-id="${res.botId}" data-intent-name="${ele.name}"
                                        data-history-run="true" id="run-${uniqueID}"
                                        >RUN</button>
                                        <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uniqueID}">
                                            <div class="elipse-icon" id="elipseIcon-${uniqueID}">
                                                <i class="ast-overflow" id="overflowIcon-${uniqueID}"></i>
                                            </div>
                                            <div class="dropdown-content-elipse" id="runAgtBtn-${uniqueID}">
                                                <div class="list-option" data-conv-id="${_agentAssistDataObj.conversationId}"
                                                data-bot-id="${res.botId}" data-intent-name="${ele.name}"
                                                 id="agentSelect-${uniqueID}"
                                                data-exhaustivelist-run="true">Run with Agent Inputs</div>
                                            </div>
                                    </div>
                                </div>`;
                                                dialogSuggestions.innerHTML += dialogsHtml;
                                            });
                                            let faqss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.faqs) : (res.agentAssistDetails?.ambiguityList?.faqs);
                                            faqss?.forEach((ele, index) => {

                                                let faqsSuggestions = document.getElementById(`faqsSuggestions-${uniqueID}`);
                                                historyFaqIDs.push(uniqueID+index);
                                                let faqHtml = `
                                <div class="type-info-run-send" id="faqDiv-${uniqueID+index}">
                                    <div class="left-content" id="faqSection-${uniqueID+index}">
                                        <div class="title-text" id="title-${uniqueID+index}">${ele.question}</div>
                                        
                                        
                                    </div>
                                    
                                </div>`;

                                                faqsSuggestions.innerHTML += faqHtml;
                                                let faqs = $(`.type-info-run-send #faqSection-${uniqueID+index}`);
                                                if (!ele.answer) {
                                                    let checkHtml = `
                                    <i class="ast-carrotup" data-conv-id="${_agentAssistDataObj.conversationId}"
                                    data-bot-id="${res.botId}" data-intent-name="${ele.question}"
                                    data-check="true" id="check-${uniqueID+index}" data-position-id="${uniqueID+index}"></i>`;
                                                    // faqs.append(checkHtml);
                                                    // $(`#title-${uniqueID}`).addClass('noPadding');
                                                    $(`#faqDiv-${uniqueID+index}`).addClass('is-dropdown-show-default');
                                                    document.getElementById(`title-${uniqueID+index}`).insertAdjacentHTML('beforeend',checkHtml);
                                                } else {
                                                    let a = $(`#faqDiv-${uniqueID+index}`);
                                                    let faqActionHtml = `<div class="action-links">
                                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID+index}"  data-msg-data="${ele.answer}">Send</button>
                                    <div class="copy-btn" data-msg-id="${uniqueID+index}" data-msg-data="${ele.answer}">
                                        <i class="ast-copy" data-msg-id="${uniqueID+index}" data-msg-data="${ele.answer}"></i>
                                    </div>
                                </div>`;
                                                    a.append(faqActionHtml);
                                                    faqs.append(`<div class="desc-text" id="desc-${uniqueID+index}">${ele.answer}</div>`);
                                                    let faqstypeInfo = $(`.type-info-run-send #faqSection-${uniqueID+index}`);
                                                    let seeMoreButtonHtml = `
                                          <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${uniqueID+index}" data-see-more="true">Show more</button>
                                          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uniqueID+index}" data-see-less="true">Show less</button>
                                          `;
                                                    faqstypeInfo.append(seeMoreButtonHtml);
                                                    setTimeout(() => {                                                    
                                                        updateSeeMoreButtonForAssist(uniqueID);
                                                    }, waitingTimeForSeeMoreButton);
                                                }
                                                // if(faqss.length === 1 && !ele.answer) {
                                                //     document.getElementById(`check-${uniqueID}`).click();
                                                //     $(`#check-${uniqueID}`).addClass('hide');
                                                // }
                                                
                                            })
                                            uniqueID = undefined;
                                      //  }
                                   // });
                                }
                                if((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && res.agentAssistDetails?.faqResponse && res.agentAssistDetails?.positionId) {
                                    historyFaqIDs?.forEach((ele,i)=>{
                                        let eleid = ele.slice(0,ele.length-1);
                                        res.agentAssistDetails.suggestions?.faqs?.forEach((eles,j)=>{
                                                if($(`#faqsSuggestions-${eleid} #title-${ele}`).text().trim() == eles.question) {
                                                let valOfDiv =  $(`#faqsSuggestions-${eleid} #desc-${ele}`).text().trim();
                                                if(valOfDiv == '' && !valOfDiv)
                                                   historyFaqSuggestionsContainer(eleid, ele, res);
                                                }
                                        })
                                    })
                                }

                                if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && res.agentAssistDetails?.faqResponse && !res.agentAssistDetails?.positionId) {  
                                    let historyDataHtml = $('#dynamicBlock');
                                        let uniqueID = res._id;
                                         let htmls = `
                                     <div class="agent-utt-info" id="agentUttInfo-${uniqueID}">
                                         <div class="user-img">
                                             <img src="./images/userIcon.svg">
                                         </div>
                                         <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                                     </div>
                                     <div class="dialog-task-run-sec" id="automationSuggestions-${uniqueID}">
                                     </div>`;

                                         historyDataHtml.append(htmls);
                                         let automationSuggestions = document.getElementById(`automationSuggestions-${uniqueID}`); 
                                    if (res.agentAssistDetails?.ambiguityList?.faqs?.length > 0 || res.agentAssistDetails?.suggestions?.faqs?.length > 0) {
                                        let dialogAreaHtml = `<div class="task-type" id="faqssArea">
                    <div class="img-block-info">
                        <img src="./images/kg.svg">
                    </div>
                    <div class="content-dialog-task-type" id="faqsSuggestions-${uniqueID}">
                        <div class="type-with-img-title">FAQ (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>
                        
                    </div>
                </div>`;
                                        automationSuggestions.innerHTML += dialogAreaHtml;
                                    }
                                    let faqss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.faqs) : (res.agentAssistDetails?.ambiguityList?.faqs);
                                            faqss?.forEach((ele, index) => {
                                                let faqsSuggestions = document.getElementById(`faqsSuggestions-${uniqueID}`);
                                                let faqHtml = `
                                <div class="type-info-run-send" id="faqDiv-${uniqueID+index}">
                                    <div class="left-content" id="faqSection-${uniqueID+index}">
                                        <div class="title-text" id="title-${uniqueID+index}">${ele.question}</div>
                                    </div>
                                </div>`;
                                                faqsSuggestions.innerHTML += faqHtml;
                                                let faqs = $(`.type-info-run-send #faqSection-${uniqueID+index}`);
                                                    let a = $(`#faqDiv-${uniqueID+index}`);
                                                    let faqActionHtml = `<div class="action-links">
                                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID+index}"  data-msg-data="${res.components[0].data.text}">Send</button>
                                    <div class="copy-btn" data-msg-id="${uniqueID+index}" data-msg-data="${res.components[0].data.text}">
                                        <i class="ast-copy" data-msg-id="${uniqueID+index}" data-msg-data="${res.components[0].data.text}"></i>
                                    </div>
                                </div>`;
                                                    a.append(faqActionHtml);
                                                    faqs.append(`<div class="desc-text" id="desc-${uniqueID+index}">${res.components[0].data.text}</div>`);
                                                    let faqstypeInfo = $(`.type-info-run-send #faqSection-${uniqueID+index}`);
                                                    let seeMoreButtonHtml = `
                                          <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${uniqueID+index}" data-see-more="true">Show more</button>
                                          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uniqueID+index}" data-see-less="true">Show less</button>
                                          `;
                                                    faqstypeInfo.append(seeMoreButtonHtml);
                                                    setTimeout(() => {                                                    
                                                        updateSeeMoreButtonForAssist(uniqueID+index);
                                                    }, waitingTimeForSeeMoreButton);
                                            })
                                            setTimeout(()=>{
                                                uniqueID = undefined;
                                            }, waitingTimeForSeeMoreButton)
                                            
                                }

                                if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {
                                    let _msgsResponse = {
                                        "type": "bot_response",
                                        "from": "bot",
                                        "message": [],
                                        "messageId": res._id,
                                        "botInfo": {
                                            "chatBot": "sample Bot",
                                            "taskBotId": res.botId
                                        },
                                        "createdOn": "2022-03-21T07:56:18.225Z",
                                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                                        "traceId": "873209019a5adc26",
                                        "createdOnTimemillis": res._id
                                    }
                                    currentTaskName = res.tN ? res.tN : currentTaskName;
                                    currentTaskPositionId = res?.agentAssistDetails?.positionId ? res?.agentAssistDetails?.positionId : currentTaskPositionId;

                                    let historyData = $('#dynamicBlock');
                                    let userInputHtml;
                                    if (res.agentAssistDetails?.userInput) {
                                        userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                                            <div class="user-img">
                                                <img src="./images/userIcon.svg">
                                            </div>
                                            <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                                        </div>`;
                                    }
                                    let dropdownHtml = `
                                        
                                                    <div class="dialog-task-accordiaon-info" id="addRemoveDropDown-${res._id}" >
                                                        <div class="accordion-header" id="dropDownHeader-${res._id}"
                                                        data-drop-down-opened="true">
                                                            <div class="icon-info">
                                                                <i class="ast-rule"></i>
                                                            </div>
                                                            <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                                                            <i class="ast-carrotup"></i>
                                                            <button class="btn-danger hide" id="terminateAgentDialog">Terminate</button>
                                                        </div>
                                                        <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                        <div class="override-input-div hide" id="overRideDiv-${res._id}">
                                                        <button class="override-input-btn hide" id="overRideBtn-${res._id}">Override Input</button>
                                                        <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${res._id}">Cancel Override</button>
                                                        </div>
                                                            
                                                        </div>
                                                    `;

                                    if (previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId ) {
                                        let previousIdFeedBackDetails = feedBackResult.find((ele)=> ele.positionId === previousTaskPositionId);
                                        addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, false, previousTaskPositionId);
                                        if(previousIdFeedBackDetails) {
                                            UpdateFeedBackDetails(previousIdFeedBackDetails, 'dynamicBlock');
                                            if(previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)){
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
                                            }else {
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
                                            }
                                        }    
                                        previousId = undefined;
                                        previousTaskPositionId = undefined;
                                        previousTaskName = undefined;
                                    }
                                    if (res.tN && !previousId && previousTaskPositionId !== currentTaskPositionId) {
                                        let divExist = $(`#addRemoveDropDown-${res._id}`);
                                        previousTaskPositionId = currentTaskPositionId;
                                        previousTaskName = currentTaskName;
                                        if (divExist.length >= 1) {
                                            console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                                        } else {
                                            historyData.append(userInputHtml);
                                            historyData.append(dropdownHtml);
                                            previousId = res._id;
                                            previousTaskPositionId = currentTaskPositionId;
                                        }
                                    }
                                    if(resp.length-1 == index && (!res.agentAssistDetails?.entityRequest && !res.agentAssistDetails?.entityResponse) && currentTaskPositionId == previousTaskPositionId) {
                                        let previousIdFeedBackDetails = feedBackResult.find((ele)=> ele.positionId === currentTaskPositionId);
                                        addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, false, previousTaskPositionId);
                                        if(previousIdFeedBackDetails) {
                                            UpdateFeedBackDetails(previousIdFeedBackDetails, 'dynamicBlock');
                                            if(previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)){
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
                                            }else {
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
                                            }
                                        }
                                    }
                                    if (res.agentAssistDetails?.entityName && res.agentAssistDetails?.entityResponse && res.agentAssistDetails?.entityValue) {
                                        let runInfoContent = $(`#dropDownData-${previousId}`);
                                        let userQueryHtml = `
                                            <div class="steps-run-data">
                                                <div class="icon_block_img">
                                                    <img src="./images/userIcon.svg">
                                                </div>
                                                <div class="run-info-content" id="userInput-${res._id}">
                                                    <div class="title">Customer Said - </div>
                                                    <div class="agent-utt">
                                                        <div class="title-data">"${sanitizeHTML(res.agentAssistDetails.entityValue)}"</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>`;
                                        runInfoContent.append(userQueryHtml);
                                        let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                                        let entityDisplayName = agentAssistResponse.newEntityDisplayName ? agentAssistResponse.newEntityDisplayName : agentAssistResponse.newEntityName;
                                        if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                                            entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${sanitizeHTML(res.agentAssistDetails.entityValue)}</div>`);
                                        } else {
                                            if (res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                                                let entityHtmls = `<div class="order-number-info">${entityDisplayName} : 
                                                            <span style="color:red">Value unidentified</span>
                                                        </div>
                                                        <div>
                                                            <img src="./images/warning.svg" style="padding-right: 8px;">
                                                            <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                                        </div>`
                                                entityHtml.append(entityHtmls);
                                            }
                                        }
                                    }
                                    if(res.agentAssistDetails?.entityName){
                                        agentAssistResponse = res.agentAssistDetails;
                                    }
                                    let parsedPayload;
                                    res.components?.forEach((elem) => {
                                        if(elem.data?.text){
                                           elem.data.text = elem.data.text.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
                                        }
                                        let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                                        try {
                                            if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                                parsedPayload = JSON.parse(withoutSpecials);
                                            }
                                        }catch(error){
                                            if(payloadType.text){
                                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                                parsedPayload = withoutSpecials;
                                            }
                                        }
                                        
                                        let body = {};
                                        body['type'] = elem.cT;
                                        if (!parsedPayload) {
                                            body['component'] = {
                                                "type": elem.cT,
                                                "payload": {
                                                    "type": elem.cT,
                                                    "text": elem.data.text
                                                }
                                            };
                                            body['cInfo'] = {
                                                "body": elem.data.text
                                            };

                                        } else {
                                            body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                                            if (parsedPayload?.type === 'message') {
                                                body['cInfo'] = {
                                                    "body": ''
                                                };
                                            } else if (parsedPayload?.text) {
                                                body['cInfo'] = {
                                                    "body": parsedPayload.text
                                                };
                                            } else {
                                                body['cInfo'] = {
                                                    "body": parsedPayload
                                                };
                                            }

                                        }

                                        _msgsResponse.message.push(body);
                                    });
                                    let msgStringify = JSON.stringify(_msgsResponse);
                                    let newTemp = encodeURI(msgStringify);
                                    if((res.agentAssistDetails?.isPrompt === true || res.agentAssistDetails?.isPrompt === false) && previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
                                    let runInfoContent = $(`#dropDownData-${previousId}`);
                                    let askToUserHtml = `
                                        <div class="steps-run-data">
                                                    <div class="icon_block">
                                                        <i class="ast-agent"></i>
                                                    </div>
                                                    <div class="run-info-content" >
                                                    <div class="title">Ask customer</div>
                                                    <div class="agent-utt">
                                                        <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                        <div class="action-links">
                                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}" data-msg-data="${newTemp}">Send</button>
                                                        <div class="copy-btn" data-msg-id="${res._id}">
                                                            <i class="ast-copy" data-msg-id="${res._id}"></i>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    </div>
                                                </div>
                                        `;
                                    let tellToUserHtml = `
                                        <div class="steps-run-data">
                                                    <div class="icon_block">
                                                        <i class="ast-agent"></i>
                                                    </div>
                                                    <div class="run-info-content" >
                                                    <div class="title">Tell Customer</div>
                                                    <div class="agent-utt">
                                                        <div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                        <div class="action-links">
                                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}" data-msg-data="${newTemp}">Send</button>
                                                            <div class="copy-btn hide" data-msg-id="${res._id}">
                                                                <i class="ast-copy" data-msg-id="${res._id}"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                        `;
                                        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                        var appState = JSON.parse(appStateStr);  
                                        if(appState[_conversationId]['automationGoingOnAfterRefresh']) {
                                            isAutomationOnGoing = true;
                                            dropdownHeaderUuids = previousId;
                                            appState[_conversationId]['automationGoingOnAfterRefresh'] = isAutomationOnGoing;
                                            localStorage.setItem('agentAssistState', JSON.stringify(appState))
                                        }
                                    if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                                        if(appState[_conversationId]['automationGoingOnAfterRefresh']) {
                                            $(`#overRideBtn-${previousId}`).removeClass('hide');
                                            $(`#cancelOverRideBtn-${previousId}`).addClass('hide');
                                            $("#inputFieldForAgent").remove();
                                            $(`#terminateAgentDialog`).removeClass('hide');
                                            $('#dynamicBlock .override-input-div').addClass('hide');
                                            $(`#overRideDiv-${previousId}`).removeClass('hide');
                                            $(`#overRideBtn-${previousId}`).attr('data-position-id', previousTaskPositionId);
                                            $(`#terminateAgentDialog`).attr('data-position-id', previousTaskPositionId);
                                            dialogPositionId = previousTaskPositionId;
                                        }
                                       
                                        runInfoContent.append(askToUserHtml);
                                    } else {
                                        runInfoContent.append(tellToUserHtml);
                                    }
                                    if (!parsedPayload) {
                                        $(runInfoContent).find('.copy-btn').removeClass('hide');
                                    }
                                    if ((!sourceType || sourceType !== 'smartassist-color-scheme') && parsedPayload) {
                                        $(runInfoContent).find('.send-run-btn').addClass('hide');
                                    }
                                 }
                              
                                
                                    AgentChatInitialize.renderMessage(_msgsResponse, res._id, `dropDownData-${previousId}`);
                                    let shouldProcessResponse = false;
                                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                    var appState = JSON.parse(appStateStr);
                                    if (appState[_conversationId]) {
                                        // if incoming data belongs to welcome message do nothing
                                        // if (!data.suggestions && data.buttons?.length > 1) {
                                            if (appState[_conversationId].isWelcomeProcessed) {
                                                shouldProcessResponse = false;
                                                
                                            }else {
                                                shouldProcessResponse = true;
                                            }
                                        // }
                                        
                                    }
                                    let isPromtFlag;
                                    if((res.agentAssistDetails?.isPrompt == true )){
                                        isPromtFlag = "true";
                                    }else if(res.agentAssistDetails?.isPrompt == false){
                                        isPromtFlag = "false";
                                    }
                                    if (!parsedPayload && !res.tN && !shouldProcessResponse && !isPromtFlag) {
                                        let dynamicBlockDiv = $('#dynamicBlock');
                                        res.components?.forEach((ele, i) => {
                                            let welcomeMsgHtml = `
                                            <div class = "welcome-msg collapse-acc-data before-none" id='smallTalk-${res._id}'>
                                                <div class="steps-run-data">
                                                    <div class="icon_block">
                                                        <i class="ast-agent"></i>
                                                    </div>
                                                    <div class="run-info-content">
                                                    
                                                    </div>
                                                </div>
                                            </div>`;
                                            if (res.components?.length > 1) {
                                                if (i == 0) {
                                                    dynamicBlockDiv.append(welcomeMsgHtml);
                                                    let runInfoDivOfwelcome = $(`#dynamicBlock #smallTalk-${res._id} .run-info-content`);
                                                    let contentHtml = `
                                                <div class="title">Customer has waited for an agent for few seconds.<br/>Here are some appropriate opening lines.</div>
                                                   <div class="agent-utt">
                                                    <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                    <div class="action-links">
                                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data="${ele.data.text}">Send</button>
                                                        <div class="copy-btn" data-msg-id="${res._id}" data-msg-data="${ele.data.text}">
                                                            <i class="ast-copy" data-msg-id="${res._id}" data-msg-data="${ele.data.text}"></i>
                                                        </div>
                                                    </div>
                                                </div>`;
                                                    runInfoDivOfwelcome.append(contentHtml);
                                                } else {
                                                    let runInfoDivOfwelcome = $(`#dynamicBlock #smallTalk-${res._id} .run-info-content`);
                                                    let contentHtmlWithoutTellCus = `
                                                    <div class="agent-utt">
                                                        <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                        <div class="action-links">
                                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data="${ele.data.text}">Send</button>
                                                            <div class="copy-btn" data-msg-id="${res._id}" data-msg-data="${ele.data.text}">
                                                                <i class="ast-copy" data-msg-id="${res._id}" data-msg-data="${ele.data.text}"></i>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                                    runInfoDivOfwelcome.append(contentHtmlWithoutTellCus);
                                                }
                                            } else {
                                                let botResHtml = `
                                                <div class="collapse-acc-data before-none" id='smallTalk-${res._id}'>
                                             <div class="steps-run-data">
                                             <div class="icon_block">
                                                 <i class="ast-agent"></i>
                                             </div>
                                             <div class="run-info-content" >
                                             <div class="title">Tell Customer</div>
                                             <div class="agent-utt">
                                                 <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                 <div class="action-links">
                                                     <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data="${ele.data.text}">Send</button>
                                                     <div class="copy-btn" data-msg-id="${res._id}" data-msg-data="${ele.data.text}">
                                                         <i class="ast-copy" data-msg-id="${res._id}" data-msg-data="${ele.data.text}"></i>
                                                     </div>
                                                 </div>
                                             </div>
                                             </div>
                                         </div>
                                         </div>`;
                                         dynamicBlockDiv.append(botResHtml)
                                            }
                                        });
                                    }

                                    //  removeElementFromDom();
                                    //if (res.agentAssistDetails.endOfTask) { // need this block of code once the endofTask flag received from backend
                                    //                                                    let dropDownData = $(`#dropDownData-${previousId}`);
                                    //                    let endOfDialoge = $(`#addRemoveDropDown-${previousId}`);

                                    //                 // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                                    //                 let feedbackHtml = ` 
                                    //     <div class="feedback-data">
                                    //         <div class="feedback-icon" id="feedbackup">
                                    //             <i class="ast-thumbup" id="feedbackup-${previousId}"
                                    //             data-feedbacklike="false"
                                    //             data-conv-id="${_agentAssistDataObj.conversationId}"
                                    //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like"
                                    //                     data-dialog-name="${previousTaskName}"
                                    //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                                    //         </div>
                                    //         <div class="feedback-icon" id="feedbackdown">
                                    //             <i class="ast-thumbdown" id="feedbackdown-${previousId}"
                                    //             data-feedbackdislike="false"
                                    //             data-conv-id="${_agentAssistDataObj.conversationId}"
                                    //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike"
                                    //                     data-dialog-name="${previousTaskName}"
                                    //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                                    //         </div>
                                    //    </div>`;
                                    //                 dropDownData.append(feedbackHtml);
                                    //                 let endofDialogeHtml = `
                                    //     <div class="dilog-task-end" id="endTaks-${previousId}">
                                    //     <div class="text-dialog-task-end">Task Ended</div>     
                                    //                </div>

                                    //     `;
                                    //                 endOfDialoge.append(endofDialogeHtml);
                                    //     previousId = undefined;
                                    //     previousTaskName = undefined;
                                    // }

                                }
                                // if (index == resp.length - 1) {
                                //     $(`#historyData .collapse-acc-data.hide`)[$(`#historyData .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                                //     // $(`#historyData .show-history-feedback.hide`)[$(`#historyData .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                                // }
                            });
                        
                        previousResp = response;
                        scrollToBottom();
                        addWhiteBackgroundClassToNewMessage();
                    }).catch(err => {
                        document.getElementById("loader").style.display = "none";
                        console.log("error", err)
                    });
                    isShowHistoryEnable = false;
                }

                function historyFaqSuggestionsContainer(eleid, ele, res){
                    $(`#faqsSuggestions-${eleid} #check-${ele}`).addClass('hide');
                    let faqs = $(`#faqsSuggestions-${eleid} .type-info-run-send #faqSection-${ele}`);
                    let a = $(`#faqsSuggestions-${eleid} #faqDiv-${ele}`);
                    let faqActionHtml = `<div class="action-links">
    <button class="send-run-btn" id="sendMsg" data-msg-id="${ele}"  data-msg-data="${res.components[0].data.text}">Send</button>
    <div class="copy-btn" data-msg-id="${ele}" data-msg-data="${res.components[0].data.text}">
        <i class="ast-copy" data-msg-id="${ele}" data-msg-data="${res.components[0].data.text}"></i>
    </div>
</div>`;
                    a.append(faqActionHtml);
                    faqs.append(`<div class="desc-text" id="desc-${ele}">${res.components[0].data.text}</div>`);
                    let faqstypeInfo = $(`#faqsSuggestions-${eleid} .type-info-run-send #faqSection-${ele}`);
                    let seeMoreButtonHtml = `
          <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${ele}" data-see-more="true">Show more</button>
          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${ele}" data-see-less="true">Show less</button>
          `;
                    faqstypeInfo.append(seeMoreButtonHtml);
                    setTimeout(() => {                                                    
                        updateSeeMoreButtonForAssist(ele);
                    }, waitingTimeForSeeMoreButton);
                }

                async function renderingAgentHistoryMessage(){
                    let url = `${connectionDetails.envinormentUrl}/agentassist/api/v1/agent-feedback/${_agentAssistDataObj.conversationId}?interaction=mybot`;
                    let feedBackResult = await renderHistoryFeedBack(url);
                    isShowHistoryEnableForMyBot = true;
                    getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_agentAssistDataObj.botId}/history?convId=${_agentAssistDataObj.conversationId}&agentHistory=true`)
                    .then(response => {
                        if(response.length > 0){
                            $('#noAutoRunning').addClass('hide');
                        }
                        document.getElementById("loader").style.display = "none";
                        let previousId;
                        let previousTaskName, currentTaskName, previousTaskPositionId, currentTaskPositionId;
                        let convId = _agentAssistDataObj.conversationId;
                        let botId = _agentAssistDataObj.botId;
                        // if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                        //     $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyDataForMyBot .show-history-feedback.hide`)[$(`#historyDataForMyBot .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyDataForMyBot .dilog-task-end.hide`)[$(`#historyDataForMyBot .dilog-task-end.hide`).length - 1]?.classList.remove('hide');

                        // } else {
                            //let resp = response.length > 0 ? response?.slice(previousResp?.length - 1, response.length) : undefined;
                            let resp = response.length > 0 ? response : undefined;
				            resp?.forEach((res, index) => {
                                // if (res.type == 'incoming') {
                                //     res.components?.forEach((ele) => {
                                //         if (ele.data.text == previousTaskName) {
                                //             previousTaskName = undefined;
                                //             previousId = undefined;
                                //             console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                                //         }
                                //     })
                                // }
                                if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {
                                    let _msgsResponse = {
                                        "type": "bot_response",
                                        "from": "bot",
                                        "message": [],
                                        "messageId": res._id,
                                        "botInfo": {
                                            "chatBot": "sample Bot",
                                            "taskBotId": res.botId
                                        },
                                        "createdOn": "2022-03-21T07:56:18.225Z",
                                        "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                                        "traceId": "873209019a5adc26",
                                        "createdOnTimemillis": res._id
                                    }
                                    currentTaskName = res.tN ? res.tN : currentTaskName;
                                    currentTaskPositionId = res?.agentAssistDetails?.positionId ? res?.agentAssistDetails?.positionId : currentTaskPositionId;
                                    let historyData = $('#myBotAutomationBlock');
                                    let userInputHtml;
                                    if (res.agentAssistDetails?.userInput) {
                                        userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                                                <div class="user-img">
                                                    <img src="./images/userIcon.svg">
                                                </div>
                                                <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                                            </div>`;
                                    }
                                    let dropdownHtml = `
                                            
                                                        <div class="dialog-task-accordiaon-info" id="MyBotaddRemoveDropDown-${res._id}" >
                                                            <div class="accordion-header" id="dropDownHeader-${res._id}"
                                                            data-drop-down-opened="false">
                                                                <div class="icon-info">
                                                                    <i class="ast-rule"></i>
                                                                </div>
                                                                <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                                                                <i class="ast-carrotup"></i>
                                                                <button class="btn-danger hide" id="myBotTerminateAgentDialog-${res._id}">Terminate</button>

                                                            </div>
                                                            <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                                
                                                                
                                                            </div>
                                                            
                                                        `;

                                    // if (previousTaskName && currentTaskName !== previousTaskName) {
                                    //     addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true)
                                    //     previousId = undefined;
                                    // }
                                    if (previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId ) {
                                        let previousIdFeedBackDetails = feedBackResult.find((ele)=> ele.positionId === previousTaskPositionId);
                                        addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true, previousTaskPositionId);
                                        if(previousIdFeedBackDetails) {
                                            UpdateFeedBackDetails(previousIdFeedBackDetails, 'agentAutoContainer');
                                            if(previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)){
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
                                            }else {
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
                                            }
                                        }    
                                        previousId = undefined;
                                        previousTaskPositionId = undefined;
                                        previousTaskName = undefined;
                                    }

                                    if (res.tN && !previousId && previousTaskPositionId !== currentTaskPositionId) {
                                        let divExist = $(`#MyBotaddRemoveDropDown-${res._id}`);
                                        previousTaskName = currentTaskName;
                                        previousTaskPositionId = currentTaskPositionId;
                                        if (divExist.length >= 1) {
                                            console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                                        } else {
                                            historyData.append(userInputHtml);
                                            historyData.append(dropdownHtml);
                                            previousId = res._id;
                                            previousTaskPositionId = currentTaskPositionId;
                                        }
                                    }
                                    if(resp.length-1 == index && (!res.agentAssistDetails?.entityRequest && !res.agentAssistDetails?.entityResponse) && currentTaskPositionId == previousTaskPositionId) {
                                        let previousIdFeedBackDetails = feedBackResult.find((ele)=> ele.positionId === previousTaskPositionId);
                                        addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true, previousTaskPositionId);
                                        if(previousIdFeedBackDetails) {
                                            UpdateFeedBackDetails(previousIdFeedBackDetails, 'agentAutoContainer');
                                            if(previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)){
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
                                            }else {
                                                $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
                                            }
                                        }   
                                    }
                                    if (res.agentAssistDetails?.entityName && res.agentAssistDetails?.entityResponse && res.agentAssistDetails?.entityValue) {
                                        let runInfoContent = $(`#dropDownData-${previousId}`);
                                        let userQueryHtml = `
                                                <div class="steps-run-data">
                                                    <div class="icon_block_img">
                                                        <img src="./images/userIcon.svg">
                                                    </div>
                                                    <div class="run-info-content" id="userInput-${res._id}">
                                                        <div class="title">Customer Said - </div>
                                                        <div class="agent-utt">
                                                            <div class="title-data">"${sanitizeHTML(res.agentAssistDetails.entityValue)}"</div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>`;
                                        runInfoContent.append(userQueryHtml);
                                        let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                                        let entityDisplayName = myBotDataResponse.newEntityDisplayName ? myBotDataResponse.newEntityDisplayName : myBotDataResponse.newEntityName;
                                        if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                                            entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${sanitizeHTML(res.agentAssistDetails.entityValue)}</div>`);
                                        } else {
                                            if (res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                                                let entityHtmls = `<div class="order-number-info">${entityDisplayName} : 
                                                                <span style="color:red">Value unidentified</span>
                                                            </div>
                                                            <div>
                                                                <img src="./images/warning.svg" style="padding-right: 8px;">
                                                                <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                                            </div>`
                                                entityHtml.append(entityHtmls);
                                            }
                                        }
                                    }
                                    if(res.agentAssistDetails?.entityName){
                                        myBotDataResponse = res.agentAssistDetails;
                                        myBotDataResponse.entityDisplayName = myBotDataResponse.newEntityDisplayName;
                                        myBotDataResponse.entityName = myBotDataResponse.newEntityName;
                                    }
                                    let parsedPayload;
                                    res.components?.forEach((elem) => {
                                        if(elem.data?.text){
                                           elem.data.text = elem.data.text.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
                                        }
                                        let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                                        try {
                                            if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                                parsedPayload = JSON.parse(withoutSpecials);
                                            }
                                        }catch(error){
                                            if(payloadType.text){
                                                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                                parsedPayload = withoutSpecials;
                                            }
                                        }

                                        let body = {};
                                        body['type'] = elem.cT;
                                        if (!parsedPayload) {
                                            body['component'] = {
                                                "type": elem.cT,
                                                "payload": {
                                                    "type": elem.cT,
                                                    "text": elem.data.text
                                                }
                                            };
                                            body['cInfo'] = {
                                                "body": elem.data.text
                                            };

                                        } else {
                                            body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                                            if (parsedPayload?.type === 'message') {
                                                body['cInfo'] = {
                                                    "body": ''
                                                };
                                            } else if (parsedPayload?.text) {
                                                body['cInfo'] = {
                                                    "body": parsedPayload.text
                                                };
                                            } else {
                                                body['cInfo'] = {
                                                    "body": parsedPayload
                                                };
                                            }

                                        }

                                        _msgsResponse.message.push(body);
                                    });
                                    let msgStringify = JSON.stringify(_msgsResponse);
                                    let newTemp = encodeURI(msgStringify);
                                    if((res.agentAssistDetails?.isPrompt === true || res.agentAssistDetails?.isPrompt === false)  && previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
                                    let runInfoContent = $(`#dropDownData-${previousId}`);
                                    let askToUserHtml = `
                                            <div class="steps-run-data">
                                                        <div class="icon_block">
                                                            <i class="ast-agent"></i>
                                                        </div>
                                                        <div class="run-info-content" >
                                                        <div class="title">Ask customer</div>
                                                        <div class="agent-utt">
                                                            <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                             <div class="action-links">
                                                                <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}" data-msg-data="${newTemp}">Send</button>
                                                                <div class="copy-btn hide" data-msg-id="${res._id}">
                                                                    <i class="ast-copy" data-msg-id="${res._id}"></i>
                                                                </div>
                                                           </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                            `;
                                    let tellToUserHtml = `
                                            <div class="steps-run-data">
                                                        <div class="icon_block">
                                                            <i class="ast-agent"></i>
                                                        </div>
                                                        <div class="run-info-content" >
                                                        <div class="title">Tell Customer</div>
                                                        <div class="agent-utt">
                                                            <div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                            <div class="action-links">
                                                                <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}" data-msg-data="${newTemp}">Send</button>
                                                                <div class="copy-btn hide" data-msg-id="${res._id}">
                                                                    <i class="ast-copy" data-msg-id="${res._id}"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                            `;
                                        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                        var appState = JSON.parse(appStateStr);  
                                        if(appState[_conversationId]['automationGoingOnAfterRefreshMyBot']) {
                                            isMyBotAutomationOnGoing = true;
                                            noAutomationrunninginMyBot = false;
                                            myBotDropdownHeaderUuids = previousId;
                                            $('#inputFieldForMyBot').remove();
                                            appState[_conversationId]['automationGoingOnAfterRefreshMyBot'] = isMyBotAutomationOnGoing;
                                            localStorage.setItem('agentAssistState', JSON.stringify(appState));
                                            let terminateButtonElement = document.getElementById('myBotTerminateAgentDialog-' + previousId);
                                            $(`#myBotTerminateAgentDialog-${previousId}`).attr('data-position-id', previousTaskPositionId);
                                            terminateButtonElement.classList.remove('hide');
                                            myBotDialogPositionId = previousTaskPositionId;
                                        }

                                        let agentInputEntityName = 'EnterDetails';
                                        if(res.agentAssistDetails?.newEntityDisplayName || res.agentAssistDetails?.newEntityName){
                                            agentInputEntityName = res.agentAssistDetails.newEntityDisplayName ? res.agentAssistDetails.newEntityDisplayName : res.agentAssistDetails.newEntityName
                                        }
                                        
                                        let agentInputToBotHtml = `
                                        <div class="steps-run-data">
                                            <div class="icon_block">
                                                <i class="ast-agent"></i>
                                            </div>
                                            <div class="run-info-content">
                                            <div class="title">Input</div>
                                            <div class="agent-utt enter-details-block">
                                            <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
                                            <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${Math.floor(Math.random() * 100)}" data-conv-id="${convId}" data-bot-id="${botId}"  data-mybot-input="true">
                                            </div>
                                            </div>
                                            </div>
                                        </div>`

                                   
                                    let nextResponse = resp[index+1];
                                    if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                                        runInfoContent.append(askToUserHtml);
                                        if(!nextResponse || (nextResponse.status != 'received' && nextResponse.status != 'incoming')){
                                            runInfoContent.append(agentInputToBotHtml);
                                        }
                                        
                                    } else {
                                        runInfoContent.append(tellToUserHtml);
                                    }
                                    if (!parsedPayload) {
                                        $(runInfoContent).find('.copy-btn').removeClass('hide');
                                    }
                                    if((!sourceType || sourceType !== 'smartassist-color-scheme') && parsedPayload){
                                        $(runInfoContent).find('.send-run-btn').addClass('hide');
                                    }
                                  } 
                                    AgentChatInitialize.renderMessage(_msgsResponse, res._id, `dropDownData-${previousId}`);
                                    //  removeElementFromDom();
                                    //if (res.agentAssistDetails.endOfTask) { // need this block of code once the endofTask flag received from backend
                                    //                                                    let dropDownData = $(`#dropDownData-${previousId}`);
                                    //                    let endOfDialoge = $(`#addRemoveDropDown-${previousId}`);

                                    //                 // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                                    //                 let feedbackHtml = ` 
                                    //     <div class="feedback-data">
                                    //         <div class="feedback-icon" id="feedbackup">
                                    //             <i class="ast-thumbup" id="feedbackup-${previousId}"
                                    //             data-feedbacklike="false"
                                    //             data-conv-id="${_agentAssistDataObj.conversationId}"
                                    //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like"
                                    //                     data-dialog-name="${previousTaskName}"
                                    //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                                    //         </div>
                                    //         <div class="feedback-icon" id="feedbackdown">
                                    //             <i class="ast-thumbdown" id="feedbackdown-${previousId}"
                                    //             data-feedbackdislike="false"
                                    //             data-conv-id="${_agentAssistDataObj.conversationId}"
                                    //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike"
                                    //                     data-dialog-name="${previousTaskName}"
                                    //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                                    //         </div>
                                    //    </div>`;
                                    //                 dropDownData.append(feedbackHtml);
                                    //                 let endofDialogeHtml = `
                                    //     <div class="dilog-task-end" id="endTaks-${previousId}">
                                    //     <div class="text-dialog-task-end">Task Ended</div>     
                                    //                </div>

                                    //     `;
                                    //                 endOfDialoge.append(endofDialogeHtml);
                                    //     previousId = undefined;
                                    //     previousTaskName = undefined;
                                    // }

                                }
                                // if (index == resp.length - 1 || index == 0) {
                                //     $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                                // }
                            });
                        // }
                        previousResp = response;
                        scrollToBottom();
                        addWhiteBackgroundClassToNewMessage();
                    }).catch(err => {
                        // document.getElementById("loader").style.display = "block";
                        console.log("error", err)
                    });
                    isShowHistoryEnableForMyBot = false;
                }

                function updateUIState(_convId, _isCallConv) {
                    $('.empty-data-no-agents').addClass('hide');
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    var convState = appState[_convId] || {};
                    if(_isCallConv == 'true'){
                        $(`#scriptContainer .empty-data-no-agents`).removeClass('hide');
                    }
                    if (!appState[_convId]) {
                        convState = appState[_convId] = {}
                        if (_isCallConv == 'true') {
                            convState.currentTab = 'transcriptTab';
                        } else {
                            convState.currentTab = 'assistTab';
                        }
                    }
                    if (convState.currentTab == 'librarySearch') {
                        libraryTabActive();
                        currentTabActive = 'searchAutoIcon';
                        if (convState?.libraryTab.length > 0) {
                            // $('#librarySearch').val(convState.libraryTab);
                            let decodeEncodedVal = decodeURI(convState.libraryTab)
                            $('#librarySearch').val(decodeEncodedVal);
                            var convId = _convId;
                            var botId = _botId;
                            var intentName = convState.libraryTab;
                            AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: true });

                        }

                    }
                    else if (convState.currentTab == 'myBotTab') {
                        agentTabActive();
                    }
                    else if (convState.currentTab == 'transcriptTab') {
                        transcriptionTabActive();
                    }
                    else if (convState.currentTab == 'assistTab') {
                        userTabActive();
                    }
                    updateCurrentTabInState(_convId,  convState.currentTab);
                  //  convState.currentTab !== 'librarySearch' ? updateUIWithTabState(_convId, convState.currentTab):'';
                    document.getElementById("loader").style.display = "none";
                    hightLightFaqFromStoredList(_conversationId, 'assistTab');
                }

                function hightLightFaqFromStoredList(convId, currentTab) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if (!appState[convId]) {
                        return
                    }
                    var convState = appState[convId];
                    if (!convState[currentTab]) { return; }
                    if (!convState[currentTab].faqsList) {
                        convState[currentTab].faqsList = [];
                    }
                    let selectedFaqList = convState[currentTab].faqsList;
                    for (let item of selectedFaqList) {
                        let faqElementId = item.split('_')[1];
                        let faqParentElementId = item.split('_')[0];
                        let faqParentElement = document.getElementById(faqParentElementId);
                        console.log(faqParentElement, "parent element");
                        if (faqParentElement) {
                            let faqElement = faqParentElement.querySelector('#' + faqElementId);
                            faqElement.style.borderStyle = "solid";
                        }
                        // document.getElementById(faqElementId).style.borderStyle = "solid";
                    }
                }

                function highLightDialogueTask(evt){
                    let dialogueTaskElementId = $(evt.target).parent().parent().attr('id');
                    console.log(dialogueTaskElementId, "faqelement id");
                    if(document.getElementById(dialogueTaskElementId)){
                        document.getElementById(dialogueTaskElementId).style.borderStyle = "solid";
                    }
                }

                function highLightAndStoreFaqId(evt) {
                    let faqElementId = $(evt.target).parent().parent().attr('id');
                    if(document.getElementById(faqElementId)){
                        let faqParentElementId = $(evt.target).parent().parent().parent().attr('id');
                        let storedfaqId = faqParentElementId + '_' + faqElementId;
                        selectedFaqList.push(storedfaqId);
                        document.getElementById(faqElementId).style.borderStyle = "solid";
                        setSentFaqListInStorage(_conversationId, storedfaqId, 'assistTab');
                    }
                }

                function setSentFaqListInStorage(convId, faqId, currentTab) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if (!appState[convId]) {
                        return
                    }
                    var convState = appState[convId];
                    if (!convState[currentTab]) { return; }
                    if (!convState[currentTab].faqsList) {
                        convState[currentTab].faqsList = [];
                    }
                    if (convState[currentTab].faqsList.indexOf(faqId) == -1) {
                        convState[currentTab].faqsList.push(faqId);
                        localStorage.setItem('agentAssistState', JSON.stringify(appState));
                    }
                }

                function updateUIWithTabState(convId, currentTab) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if (!appState[convId]) {
                        return
                    }
                    var convState = appState[convId];
                    if (!convState[currentTab]) { return; }
                    if (!convState[currentTab].stateItems || convState[currentTab].stateItems.length == 0) {
                        return;
                    }
                    let stateItems = convState[currentTab].stateItems;
                    if (currentTab == 'assistTab') {
                        // $('#welcomeMsg').html('');
                        // let dialogs = $(`#dynamicBlock .dialog-task-run-sec`);
                        // dialogs?.each(function (i, ele) {
                        //     $('#dynamicBlock .agent-utt-info').each((i, elem) => {
                        //         $(elem).remove();
                        //     });
                        //     $(ele).remove();
                        // });
                        // let dialogsDropDowns = $(`#dynamicBlock .dialog-task-accordiaon-info`);
                        // dialogsDropDowns?.each(function (i, ele) {
                        //     $(ele).remove();
                        // });
                    } else {
                        $('#noAutoRunning').addClass('hide');
                    }
                    let intentContainerObj = {};
                    for (let i = 0; i < stateItems.length; i++) {
                        let itemStr = stateItems[i];
                        let item = JSON.parse(itemStr);
                        if (!intentContainerObj[item.intentName]) {
                            intentContainerObj[item.intentName] = {};
                        }
                        if (item.intentName && !intentContainerObj[item.intentName]['containerCreated']) {
                            intentContainerObj[item.intentName]['containerCreated'] = true;
                            dropdownHeaderUuids = koreGenerateUUID();
                            intentContainerObj[item.intentName]['containerId'] = dropdownHeaderUuids;
                            if (currentTab == 'assistTab') {
                                _createRunTemplateContiner(dropdownHeaderUuids, item.intentName);
                                $(`#addRemoveDropDown-${dropdownHeaderUuids}`).removeClass('hide');
                            } else {
                                currentTab == 'myBotTab' ? _createRunTemplateContainerForMyTab(dropdownHeaderUuids, item.intentName) : '';
                                $(`#MyBotaddRemoveDropDown-${dropdownHeaderUuids}`).removeClass('hide');
                            }
                        }
                    }

                    for (let i = 0; i < stateItems.length; i++) {
                        let itemStr = stateItems[i];
                        let item = JSON.parse(itemStr);
                        if (item.intentName) {
                            if (currentTab == 'assistTab') {
                                dropdownHeaderUuids = intentContainerObj[item.intentName]['containerId'];
                            }
                            if (currentTab == 'myBotTab') {
                                myBotDropdownHeaderUuids = intentContainerObj[item.intentName]['containerId']
                            }

                        }
                        if (currentTab == 'assistTab') {
                            if (item.event == 'agent_assist_user_message') {
                                processUserMessages(item, convId, _botId);
                            }
                            processAgentAssistResponse(item, convId, _botId);
                        } else {
                            currentTab == 'myBotTab' ? processMybotDataResponse(item, convId, _botId) : '';
                        }

                    }
                }

                function updateCurrentTabInState(_convId, currentTab) {
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    var convState = appState[_convId] || {};
                    if (!appState[_convId]) {
                        convState = appState[_convId] = {}
                    }
                    convState.currentTab = currentTab;
                    if (appState[_convId] && (convState.currentTab == 'librarySearch')) {
                        if (searchedVal !== undefined && document.getElementById('librarySearch').value.length > 0) {
                            convState.libraryTab = document.getElementById('librarySearch').value;
                            let sanitizedVal = sanitizeHTML(convState.libraryTab);
                            console.log('updateCurrentTabInState: ',convState.libraryTab);
                            convState.libraryTab = sanitizedVal;
                        } else {
                            convState.libraryTab = '';
                        }
                    }
                    localStorage.setItem('agentAssistState', JSON.stringify(appState));
                }

                function isScrolledIntoView(elem) {
                    if (elem) {
                        var parentRec = document.getElementById("bodyContainer").getBoundingClientRect();
                        var childRec = elem.getBoundingClientRect();
                        if(childRec.top == 0 && $(elem).parent().attr('class').includes('hide')){
                            if($(elem).parent().parent().length){
                                elem = $(elem).parent().parent()[0];
                            }
                        }
                        var paddingTop = 0;
                        childRec = elem.getBoundingClientRect();
                        try{
                            if (window.getComputedStyle(elem, null).getPropertyValue('padding-top')) {
                                var paddingTopStr = window.getComputedStyle(elem, null).getPropertyValue('padding-top');
                                if (paddingTopStr.length && paddingTopStr.length - 2) {
                                    paddingTopStr = paddingTopStr.substring(0, paddingTopStr.length - 2);
                                    paddingTop = parseInt(paddingTopStr) ? parseInt(paddingTopStr) : 0;
                                }
                            }
                        }catch(e){
                            console.log(e);
                        }
                        return (childRec.top + paddingTop) > (parentRec.height + parentRec.top);
                    }
                }

                function getUUIDFromId(id){
                    if(id){
                        let idArray = id.split('-');
                        idArray.shift();
                        return (idArray.join('-'));
                    }
                    return '-';
                }

                function getLastElement(id) {
                    let lastElement = ''
                    var dynamicBlockElements = document.getElementById(id);
                    if(id.includes('smallTalk') && dynamicBlockElements){
                        lastElement = dynamicBlockElements;
                    }else if(dynamicBlockElements) {
                        var numOfdynamicBlockElements = dynamicBlockElements.children;
                        if (numOfdynamicBlockElements) {
                            for (var i = 0; i < numOfdynamicBlockElements.length; i++) {
                                lastElement = numOfdynamicBlockElements[i];
                            }
                            // if (lastElement.className == 'dialog-task-run-sec') {
                            //     var numOfdynamicBlockElements = lastElement.children;
                            //     for (var i = 0; i < numOfdynamicBlockElements.length; i++) {
                            //         lastElement = numOfdynamicBlockElements[i];
                            //         if ($(lastElement).attr("id") == 'dialoguesArea') {
                            //             let typeInfoRunNodes = lastElement.querySelectorAll('.content-dialog-task-type');
                            //             lastElement = typeInfoRunNodes[typeInfoRunNodes.length - 1];
                            //         }
                            //     }
                            // } else
                             if (lastElement.className == 'dialog-task-accordiaon-info') {
                                let listOfNodes = lastElement.querySelectorAll('.steps-run-data');
                                let index = 0;
                                for(let node of listOfNodes){
                                    if(!($(node).attr('id'))){
                                        $(node).attr('id', 'stepsrundata-' + getUUIDFromId(lastElement.id) + '*' + index);
                                    }
                                    index++;
                                }
                                lastElement = Array.from(listOfNodes).pop();
                            }
                        }
                    }
                    return lastElement;
                }

                function updateNewMessageUUIDList(responseId) {
                    if (!scrollAtEnd) {
                        if (numberOfNewMessages) {
                            if (newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
                                newlyAddedMessagesUUIDlist.push(responseId);
                                newlyAddedIdList = getActualRenderedIdList();
                            }else{
                                newlyAddedIdList = getActualRenderedIdList()
                            }
                        }
                        addUnreadMessageHtml();  
                    }
                }

                function updateNewMessageCount(lastElement) {
                    for (let id of newlyAddedIdList) {
                        let element = document.getElementById(id);
                        if (element) {
                            let inView = !isScrolledIntoView(element) ? true : false;
                            if (inView) {
                                removedIdListOnScroll.push(id);
                                newlyAddedIdList = newlyAddedIdList.filter(item => item !== id)
                                numberOfNewMessages = numberOfNewMessages > 0 ? numberOfNewMessages - 1 : 0;
                                if(id.includes('automationSuggestions')){
                                    let agentUttInfoId = id.split('-');
                                    agentUttInfoId.shift();
                                    agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                                    if(document.getElementById(agentUttInfoId)){
                                        lastElementBeforeNewMessage = document.getElementById(agentUttInfoId);
                                    }
                                }else if(id.includes('stepsrundata')){
                                    lastElementBeforeNewMessage = document.getElementById(id);
                                } else{
                                    lastElementBeforeNewMessage = getLastElement(id);
                                }
                                
                                if (numberOfNewMessages) {
                                    $(".scroll-bottom-btn").addClass("new-messages");
                                    $(".scroll-bottom-btn span").text(numberOfNewMessages + ' new');
                                }else{
                                    $(".scroll-bottom-btn span").text('Scroll to bottom');
                                }
                                // if(element.classList.contains('last-msg-white-bg') && id != lastElement.id){
                                //     element.classList.remove("last-msg-white-bg");
                                // }
                            }
                        }
                    }
                }

                function getActualRenderedIdList() {
                    let normalIdsList = ['addRemoveDropDown', 'automationSuggestions', 'smallTalk'];
                    let actualRenderedIdList = [];
                    for (let uuid of newlyAddedMessagesUUIDlist) {
                        for (let name of normalIdsList) {
                            let childIdList = [];
                            childIdList = getChildRenderedIdList(name + '-' + uuid, uuid, name);
                            actualRenderedIdList = actualRenderedIdList.concat(childIdList);
                        }
                    }
                    //removing duplicates
                    actualRenderedIdList = actualRenderedIdList.filter((c, index) => {
                        return actualRenderedIdList.indexOf(c) === index;
                    });
                    return actualRenderedIdList;
                }

                function getChildRenderedIdList(id, uuid, name) {
                    let childIdList = [];
                    var dynamicBlockElement = document.getElementById(id);
                    if (dynamicBlockElement) {
                        if (dynamicBlockElement.className == 'dialog-task-run-sec') {
                            let dialogueSuggestionId = 'dialogSuggestions-' + uuid;
                            let faqSuggestionId = 'faqsSuggestions-' + uuid;
                            let articleSuggestionId = 'articleSuggestions-' + uuid;
                            if (removedIdListOnScroll.indexOf(dialogueSuggestionId) == -1) {
                                childIdList.push(dialogueSuggestionId);
                            }
                            if (removedIdListOnScroll.indexOf(faqSuggestionId) == -1) {
                                childIdList.push(faqSuggestionId);
                            }
                            if (removedIdListOnScroll.indexOf(articleSuggestionId) == -1) {
                                childIdList.push(articleSuggestionId);
                            }
                        } else { 
                            if(dynamicBlockElement.className == 'dialog-task-accordiaon-info'){
                                let stepsrunList = dynamicBlockElement.querySelectorAll('.steps-run-data');
                                for(let node of stepsrunList){
                                    if(node.id){
                                        if (removedIdListOnScroll.indexOf(node.id) == -1) {
                                            childIdList.push(node.id);
                                        }
                                    }
                                }
                                if(childIdList.indexOf(lastElementBeforeNewMessage.id) != -1){
                                    childIdList.splice(0,childIdList.indexOf(lastElementBeforeNewMessage.id)+1);
                                }
                            }else{
                                let actualParentId = name + '-' + uuid;
                                if (removedIdListOnScroll.indexOf(actualParentId) == -1) {
                                    childIdList.push(actualParentId);
                                }
                            }
                        }
                    }
                    return childIdList;
                }

                function scrollToEle(id) {
                    let element = document.getElementById(id);
                    var _PanelEle = $(element);
                    if(id.includes('automationSuggestions')){
                        let agentUttInfoId = id.split('-');
                        agentUttInfoId.shift();
                        agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                        if(document.getElementById(agentUttInfoId)){
                            _PanelEle = $('#' + agentUttInfoId);
                        }
                    }
                    if (_PanelEle) {
                        var _container = _PanelEle.closest('.body-data-container');
                        if (_container && _container.offset()) {
                            var _scrollHeight = _PanelEle.offset().top - _container.offset().top + _container.scrollTop();
                            _container.animate({
                            scrollTop: _scrollHeight
                            }, 'slow');
                        }
                    }
                }

                function UnCollapseDropdownForLastElement(lastElement){
                    if(lastElement.className.includes('steps-run-data')){
                        let lastElementId = getUUIDFromId(lastElement.id);
                        lastElementId = lastElementId.split("*")[0];
                        let collapseElement = document.getElementById('dropDownData-' + lastElementId);
                        $(`#dropDownHeader-${lastElementId}`).find('.ast-carrotup').addClass('rotate-carrot');
                        $(collapseElement).removeClass('hide');
                    }
                }

                function checkDropdownCollapaseState(lastElement){
                    if(lastElement && lastElement.className.includes('steps-run-data')){
                        let lastElementId = getUUIDFromId(lastElement.id);
                        lastElementId = lastElementId.split("*")[0];
                        let collapseElement = document.getElementById('dropDownData-' + lastElementId);
                        if(collapseElement && collapseElement.className.includes('hide') && numberOfNewMessages){
                            scrollAtEnd = false;
                        }
                    }
                }

                function updateScrollButton(){
                    let dynamicBlockId = (currentTabActive == 'userAutoIcon') ?  'dynamicBlock' : 'myBotAutomationBlock';
                    lastelement = getLastElement(dynamicBlockId);
                    scrollAtEnd = !isScrolledIntoView(lastelement) ? true : false;
                    if (!scrollAtEnd) {
                        $(".scroll-bottom-show-btn").removeClass('hide');
                    }else{
                        $(".scroll-bottom-show-btn").addClass('hide');
                    }
                }

                function updateScrollAtEndVariables(){
                    $(".scroll-bottom-btn span").text('Scroll to bottom');
                    $(".scroll-bottom-btn").removeClass("new-messages");
                    $(".scroll-bottom-show-btn").addClass('hide');
                    numberOfNewMessages = 0;
                    newlyAddedMessagesUUIDlist = [];
                    newlyAddedIdList = [];
                    removedIdListOnScroll = [];
                }

                function getCancelOverRideMode(targetId, positionId){
                    let idsss = targetId.split('-');
                    idsss.shift();
                    let id = idsss.join('-')
                    
                    var overRideObj = {
                        "agentId": "",
                        "botId": _botId,
                        "conversationId": _agentAssistDataObj.conversationId,
                        "query": "",
                        "enable_override_userinput": false,
                        'experience': isCallConversation === 'true' ? 'voice':'chat',
                        "positionId": positionId
                    }
                    _agentAsisstSocket.emit('enable_override_userinput', overRideObj);
                    $(`#overRideBtn-${id}`).removeClass('hide');
                    console.log(`#overRideBtn-${id}`, "overrride btn inside getcancel override mode");
                    $(`#cancelOverRideBtn-${id}`).addClass('hide');
                    $('#inputFieldForAgent').remove();
                    isOverRideMode = false;
                    addWhiteBackgroundClassToNewMessage();
                    scrollToBottom();
                }

                function getOverRideMode(targetId, positionId) {
                    let idsss = targetId.split('-');
                    idsss.shift();
                    let id = idsss.join('-')

                    var overRideObj = {
                        "agentId": "",
                        "botId": _botId,
                        "conversationId": _agentAssistDataObj.conversationId,
                        "query": "",
                        "enable_override_userinput": true,
                        'experience': isCallConversation === 'true' ? 'voice' : 'chat',
                        "positionId": positionId
                    }
                    _agentAsisstSocket.emit('enable_override_userinput', overRideObj);
                    let runInfoContent = $(`#dropDownData-${dropdownHeaderUuids}`);
                    let agentInputId = Math.floor(Math.random() * 100);
                    let agentInputEntityName = 'EnterDetails';
                    if (agentAssistResponse.newEntityDisplayName || agentAssistResponse.newEntityName) {
                        agentInputEntityName = agentAssistResponse.newEntityDisplayName ? agentAssistResponse.newEntityDisplayName : agentAssistResponse.newEntityName;
                    } else if (agentAssistResponse.entityDisplayName || agentAssistResponse.entityName) {
                        agentInputEntityName = agentAssistResponse.entityDisplayName ? agentAssistResponse.entityDisplayName : agentAssistResponse.entityName;
                    }
                    let agentInputToBotHtml = `
        <div class="steps-run-data" id="inputFieldForAgent">
            <div class="icon_block">
                <i class="ast-agent"></i>
            </div>
            <div class="run-info-content">
            <div class="title">Input overridden. Please provide the input</div>
            <div class="agent-utt enter-details-block">
            <div class="title-data" ><span class="enter-details-title">${agentInputEntityName}: </span>
            <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_botId}"  data-mybot-input="true" data-position-id="${positionId}">
            </div>
            </div>
            </div>
        </div>`
                    runInfoContent.append(agentInputToBotHtml);
                    if (document.getElementById('agentInput-' + agentInputId)) {
                        document.getElementById('agentInput-' + agentInputId).focus();
                    }
                    if(proactiveMode){
                        $(`#overRideBtn-${id}`).addClass('hide');
                        $(`#cancelOverRideBtn-${id}`).removeClass('hide');
                    }
                    isOverRideMode = true;
                    addWhiteBackgroundClassToNewMessage();
                    scrollToBottom();
                }

                const typeAHead = typeAHeadDeBounce((e, falg)=>getAutoSearchApiResult(e, falg));
                function btnInit() {

                    document.querySelector('#bodyContainer').addEventListener('ps-scroll-up', (scrollUpevent) => {
                        updateScrollButton();
                    });

                    document.querySelector('#bodyContainer').addEventListener('ps-scroll-down', (scrollDownevent) => {
                        //newly added elements scroll view
                        //get last element call should be before update message count;
                        let dynamicBlockId = (currentTabActive == 'userAutoIcon') ?  'dynamicBlock' : 'myBotAutomationBlock';
                        lastelement = getLastElement(dynamicBlockId);
                        updateNewMessageCount(lastelement);
                        scrollAtEnd = !isScrolledIntoView(lastelement) ? true : false;
                        if (scrollAtEnd) {
                            $(".scroll-bottom-show-btn").addClass('hide');
                            updateScrollAtEndVariables();
                            lastElementBeforeNewMessage = getLastElement(dynamicBlockId);
                            addWhiteBackgroundClassToNewMessage();
                        }
                    });

                    document.querySelector('#bodyContainer').addEventListener('ps-y-reach-end', (scrollEndevent) => {
                        scrollAtEnd = true;
                        checkDropdownCollapaseState(lastElementBeforeNewMessage);
                        if(scrollAtEnd){
                            updateScrollAtEndVariables();
                        }else{
                            $(".scroll-bottom-show-btn").removeClass('hide');
                        }
                        let dynamicBlockId = (currentTabActive == 'userAutoIcon') ?  'dynamicBlock' : 'myBotAutomationBlock';
                        lastElementBeforeNewMessage = getLastElement(dynamicBlockId);
                        addWhiteBackgroundClassToNewMessage();
                    });

                    document.addEventListener("click", (evt) => {
                        var target = evt.target;
                        var runButton = target.dataset.run;
                        var libraryRunBtn = target.dataset.libraryRun;
                        var runAutoForAgent = target.dataset.exhaustivelistRun;
                        var historyRunBtn = target.dataset.historyRun;
                        $('.agent-assist-chat-container.kore-chat-window').on('click', '.botResponseAttachments', function (event) {
                            window.open($(this).attr('fileid'), '_blank');
                        });
                        $('.agent-assist-chat-container.kore-chat-window').off('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv').on('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv', function (e) {

                            AgentChatInitialize.bindEvents(true, e);
                            if (JSON.parse(localStorage.getItem('innerTextValue'))) {
                                AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: _agentAssistDataObj.conversationId, botId: _agentAssistDataObj.botId, value: JSON.parse(localStorage.getItem('innerTextValue')), check: true });
                                localStorage.setItem('innerTextValue', null);
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                e.stopPropagation();
                            } else {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });

                        if (target.className.includes('scroll-bottom-btn')) {
                            UnCollapseDropdownForLastElement(lastElementBeforeNewMessage);
                            if ($(".scroll-bottom-btn span").text().includes('new')) {
                                scrollToBottom();
                            }else{
                                let newElementsHeight = getNewlyAddedElementsHeights();
                                if (newElementsHeight) {
                                    scrollToEle(lastElementBeforeNewMessage.id);
                                } 
                            }
                        }

                        // if (target.id === 'sendMsg' && sourceType == 'smartassist-color-scheme') {
                        //     // let ele = document.getElementById(`displayData-${target.dataset.msgId}`)
                        //     window.parent.postMessage({
                        //         method: "send",
                        //         text: target.dataset.msgData
                        //     }, "*");
                        //     highLightAndStoreFaqId(evt);
                        // } else 

                        if(target.id === 'checkProActive'){
                            if(document.getElementById("checkProActive").checked == true){
                                proactiveMode = true;
                                $(`.override-input-div`).removeClass('hide');
                                getCancelOverRideMode('overRideBtn-' + dropdownHeaderUuids, dialogPositionId);

                            } else if (document.getElementById("checkProActive").checked == false) {   
                                proactiveMode = false;
                                if(document.getElementById(`overRideBtn-${dropdownHeaderUuids}`)){
                                    $(`#overRideBtn-${dropdownHeaderUuids}`).addClass('hide');
                                    getOverRideMode('overRideBtn-' + dropdownHeaderUuids, dialogPositionId);
                                }
                            }
                        }

                        // let isChecked =  togglePoint();
                        // $(document).ready(function() {
                        //     $('#toggle').click(function() {
                        //         $(':checkbox').each(function() {
                        //             this.click();
                        //         });
                        //     });
                        // });
                        // document.getElementById('checkProActive').onclick = function() {
                        //     var checkboxes = document.querySelectorAll('input[type="checkbox"]');
                        //     for (var checkbox of checkboxes) {
                        //         console.log('Testing: ',checkbox);
                        //         checkbox.checked = !checkbox.checked;
                        //     }
                        // }

                        if (target.id === 'sendMsg') {
                            let payload = target.dataset.msgData;
                            var message = {
                                method: 'send',
                                name: "agentAssist.SendMessage",
                                conversationId: _conversationId,
                                payload: payload
                            };
                            window.parent.postMessage(message, '*');
                            highLightAndStoreFaqId(evt);
                        }
                        // if ((target.className == 'copy-btn' || target.className == 'ast-copy') && sourceType == 'smartassist-color-scheme') {
                        //     let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
                        //     window.parent.postMessage({
                        //         method: "copy",
                        //         text: target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText)
                        //     }, "*")
                        //     highLightAndStoreFaqId(evt);
                        // } else 
                        if ((target.className == 'copy-btn' || target.className == 'ast-copy')) {
                            let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
                            let data = target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText)
                            var message = {
                                method: 'copy',
                                name: "agentAssist.CopyMessage",
                                conversationId: _conversationId,
                                payload: data
                            };
                            parent.postMessage(message, '*');
                            highLightAndStoreFaqId(evt);
                        }
                        if (target.className == 'ast-close close-search') {
                            $('#agentSearch').val('');
                            $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            $('#overLaySearch').html('');
                            $('#librarySearch').val('');
                            searchedVal = '';
                            $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            $('#overLayAutoSearch').html('');
                            $('.search-block').find('.search-results-text-in-lib')?.remove();
                        }

                        if (target.id === 'cancelLibrarySearch') {
                            $('#librarySearch').val('');
                            $('#cancelLibrarySearch').addClass('hide');
                            loadLibraryOnCancel(autoExhaustiveList, _conversationId, _botId);
                        } else if (target.id === 'cancelAgentSearch') {
                            $('#agentSearch').val('');
                            $('#cancelAgentSearch').addClass('hide');
                        }

                        if (target.className == 'show-all') {
                            isShowAllClicked = true;
                            $('#frequently-exhaustive').addClass('hide');
                            let showAllClicked = true;
                            previousTabActive = currentTabActive;
                            $(`#${currentTabActive}`).removeClass('active-tab');
                            currentTabActive = 'searchAutoIcon';
                            $(`#searchAutoIcon`).addClass('active-tab');
                            $('#LibraryContainer').removeClass('hide');
                            $('allAutomations-Exhaustivelist').addClass('hide');
                            $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            $('#backButton').removeClass('hide');

                            $(`#dynamicBlock`).addClass('hide');
                            document.getElementById('agentAutoContainer').classList.add('hide');
                            document.getElementById('scriptContainer').classList.add('hide');
                            let libSearch = $('#librarySearch').val(agentSearchVal);
                            if (libSearch.length > 0) {
                                $('#cancelLibrarySearch').removeClass('hide');
                            } else {
                                $('#cancelLibrarySearch').addClass('hide');
                                processAgentIntentResults(autoExhaustiveList, _conversationId, _botId);
                            }
                            $('.sugestions-info-data').addClass('hide');
                            $('#bodyContainer').removeClass('if-suggestion-search');
                            $('#librarySearch').keyup(function (evt) {

                                if (!showAllClicked) {
                                    evt.stopImmediatePropagation();
                                } else {
                                    var target = evt.target;
                                    target.dataset.convId = _agentAssistDataObj.conversationId;
                                    target.dataset.botId = _agentAssistDataObj.botId;
                                    target.dataset.agentAssistInput = true;
                                    var agentAssistInput = target.dataset.agentAssistInput;
                                    evt.keyCode = 13;
                                    if (agentAssistInput) {
                                        AgentAssist_input_keydown(evt);
                                    }
                                    evt.stopImmediatePropagation();
                                }
                            });

                            $('#librarySearch').keyup();

                        }

                        if (target.className == 'ast-close close-search' && currentTabActive == 'searchAutoIcon') {
                            // Logic to reset the search library on cancel
                            searchedVal = '';
                            $('#librarySearch').val('');
                            $('#backButton').addClass('hide');
                            $('#searchResults').addClass('hide');
                            $('#allAutomations-Exhaustivelist').removeClass('hide');
                            $('.search-block').find('.search-results-text-in-lib').remove();
                        }

                        if (target.id == 'backToPreviousTab') {
                            isShowAllClicked = false;
                            $('#frequently-exhaustive').removeClass('hide');
                            $(`#${currentTabActive}`).removeClass('active-tab');
                            $(`#${previousTabActive}`).addClass('active-tab');
                            $('#searchResults').addClass('hide');
                            $('#librarySearch').val('');
                            $('#allAutomations-Exhaustivelist').removeClass('hide');
                            if (previousTabActive == 'agentAutoIcon') {
                                document.getElementById('agentAutoContainer').classList.remove('hide');
                            } else if (previousTabActive == 'userAutoIcon') {
                                $(`#dynamicBlock`).removeClass('hide');
                            } else if (previousTabActive == 'transcriptIcon') {
                                document.getElementById('scriptContainer').classList.remove('hide');
                            }

                            previousTabActive = currentTabActive;
                            previousTabActive = 'userAutoIcon';

                            $('#LibraryContainer').addClass('hide');
                            $('.overlay-suggestions').removeClass('hide').attr('style', 'bottom:0; display:block');
                            $('#backButton').addClass('hide');
                            $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            $('.sugestions-info-data').removeClass('hide');
                            $('#bodyContainer').addClass('if-suggestion-search');

                        }

                        if (target.id === `searchAutoIcon` || target.id === `searchIcon` || target.id === `LibraryLabel`) {
                            $("#bodyContainer").scrollTop(0);
                            data = _agentAssistDataObj
                            updateCurrentTabInState(_conversationId, 'librarySearch')
                            libraryTabActive();
                        }
                        else if (target.id === `agentAutoIcon` || target.id === `agentBotIcon` || target.id === `MybotLabel`) {
                            updateCurrentTabInState(_conversationId, 'myBotTab')
                            agentTabActive();
                        }
                        else if (target.id === `transcriptIcon` || target.id === `scriptIcon` || target.id === `transcriptLabel`) {
                            $("#bodyContainer").scrollTop(0);
                            updateCurrentTabInState(_conversationId, 'transcriptTab')
                            transcriptionTabActive();
                            currentTabActive = 'transcriptIcon';
                        }
                        else if (target.id === `userAutoIcon` || target.id === `userBotIcon` || target.id === `AssistLabel`) {
                            updateCurrentTabInState(_conversationId, 'assistTab')
                            userTabActive();
                            //  updateUIState(_conversationId, isCallConversation);

                        }
                        var seeMoreButton = target.dataset.seeMore;
                        var seeLessButton = target.dataset.seeLess;
                        var checkButton = target.dataset.check;
                        var checkLibButton = target.dataset.checkLib;
                        var articleSeeMoreButton = target.dataset.articleSeeMore;
                        var articleSeeLessButton = target.dataset.articleSeeLess;
                        var articleFullView = target.dataset.articleFullView;
                        var faqFullView = target.dataset.faqFullView;
                        var articleFewView = target.dataset.articleFewView;
                        var faqFewView = target.dataset.faqFewView;

                        if (target.className === 'copy-btn') {
                            // Hello();
                        }

                        if(articleFewView){
                            let targets = target.id.split('-');
                            targets.shift();
                            let articleSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #articleSuggestions-results') : $('#overLaySearch #articleSuggestions-results');
                            $(articleSuggestions).children(".type-info-run-send").slice(0,1).addClass('hide');
                            $(`#articleFullView-${targets.join('-')}`).removeClass('hide');
                            evt.target.classList.add('hide');
                        }

                        if(faqFewView){
                            let targets = target.id.split('-');
                            targets.shift();
                            let faqsSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #faqsSuggestions-results') : $('#overLaySearch #faqsSuggestions-results');
                            $(faqsSuggestions).children(".type-info-run-send").slice(0,1).addClass('hide');
                            $(`#faqFullView-${targets.join('-')}`).removeClass('hide');
                            evt.target.classList.add('hide');
                        }

                        if(articleFullView){
                            let targets = target.id.split('-');
                            targets.shift();
                            let articleSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #articleSuggestions-results') : $('#overLaySearch #articleSuggestions-results');
                            $(articleSuggestions).children(".type-info-run-send").removeClass('hide');
                            $(`#articleFewView-${targets.join('-')}`).removeClass('hide');
                            evt.target.classList.add('hide');
                        }

                        if(faqFullView){
                            let targets = target.id.split('-');
                            targets.shift();
                            let faqsSuggestions = currentTabActive == 'searchAutoIcon' ? $('#search-text-display #faqsSuggestions-results') : $('#overLaySearch #faqsSuggestions-results');
                            $(faqsSuggestions).children(".type-info-run-send").removeClass('hide');
                            $(`#faqFewView-${targets.join('-')}`).removeClass('hide');
                            evt.target.classList.add('hide');
                        }

                        if(articleSeeMoreButton){
                            console.log("article see more button");
                            let targets = target.id.split('-');
                            targets.shift();
                            let articles = (currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ?
                                $(`.type-info-run-send #articleSection-${targets.join('-')}`) :
                                (currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #articleSectionLib-${targets.join('-')}`) : $(`#overLaySearch .type-info-run-send #articleSectionLib-${targets.join('-')}`));
                            articles.find(`#articleseeLess-${targets.join('-')}`).each((i, ele) => {
                                if ($(ele).attr('id').includes(`articleseeLess-${targets.join('-')}`)) {
                                    ele.classList.remove('hide')
                                }
                            })
                            evt.target.classList.add('hide');
                            articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articletitle-${targets.join('-')}` :
                                `#articletitleLib-${targets.join('-')}`}`).attr('style', `overflow: inherit; white-space: normal; text-overflow: unset;`);
                            articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articledesc-${targets.join('-')}` : `#articledescLib-${targets.join('-')}`}`).attr('style', `overflow: inherit; text-overflow: unset;  display:block;`);
                            articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articleViewLink-${targets.join('-')}` : `#articleViewLinkLib-${targets.join('-')}`}`).removeClass('hide');

                        }

                        if (articleSeeLessButton) {
                            let targets = target.id.split('-');
                            targets.shift();
                            let articles = (currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? $(`.type-info-run-send #articleSection-${targets.join('-')}`) :
                                (currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #articleSectionLib-${targets.join('-')}`) : $(`#overLaySearch .type-info-run-send #articleSectionLib-${targets.join('-')}`));

                            articles.find(`#articleseeMore-${targets.join('-')}`).each((i, ele) => {
                                if ($(ele).attr('id').includes(`articleseeMore-${targets.join('-')}`)) {
                                    ele.classList.remove('hide')
                                }
                            })
                            articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articletitle-${targets.join('-')}` : `#articletitleLib-${targets.join('-')}`}`).attr('style', `overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;`);
                                        articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articledesc-${targets.join('-')}` : `#articledescLib-${targets.join('-')}`}`).attr('style', `overflow: hidden;
                           
                            text-overflow: ellipsis;
                            display : -webkit-box`);
                            articles.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#articleViewLink-${targets.join('-')}` : `#articleViewLinkLib-${targets.join('-')}`}`).addClass('hide');

                            evt.target.classList.add('hide')
                        }
                        
                        if (seeMoreButton) {
                            console.log("see more button", target);
                            let targets = target.id.split('-');
                            targets.shift();
                            let faqs = (currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ?
                                $(`.type-info-run-send #faqSection-${targets.join('-')}`) :
                                (currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${targets.join('-')}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${targets.join('-')}`));
                            faqs.find(`#seeLess-${targets.join('-')}`).each((i, ele) => {
                                if ($(ele).attr('id').includes(`seeLess-${targets.join('-')}`)) {
                                    ele.classList.remove('hide')
                                }
                            })
                            evt.target.classList.add('hide')
                            faqs.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#title-${targets.join('-')}` :
                                `#titleLib-${targets.join('-')}`}`).attr('style', `overflow: inherit; white-space: normal; text-overflow: unset;`);
                            faqs.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#desc-${targets.join('-')}` : `#descLib-${targets.join('-')}`}`).attr('style', `overflow: inherit; text-overflow: unset; display:block;`);
                        }
                        if (seeLessButton) {
                            let targets = target.id.split('-');
                            targets.shift();
                            let faqs = (currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? $(`.type-info-run-send #faqSection-${targets.join('-')}`) :
                                (currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${targets.join('-')}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${targets.join('-')}`));

                            faqs.find(`#seeMore-${targets.join('-')}`).each((i, ele) => {
                                if ($(ele).attr('id').includes(`seeMore-${targets.join('-')}`)) {
                                    ele.classList.remove('hide')
                                }
                            })
                            faqs.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#title-${targets.join('-')}` : `#titleLib-${targets.join('-')}`}`).attr('style', `overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;`);
                            faqs.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#desc-${targets.join('-')}` : `#descLib-${targets.join('-')}`}`).attr('style', `overflow: hidden;
                
                text-overflow: ellipsis;
                display : -webkit-box`);
                            evt.target.classList.add('hide')
                        }
                        let targetIds = (target.id).split('-');
                        if (['feedbackup', 'feedbackdown'].includes(targetIds[0])) {

                            let cloneTargtIds = [...targetIds]
                            let isDivElement = evt.target instanceof HTMLDivElement;
                            console.log("isDivElement", isDivElement, target.parentElement.id);
                            if (targetIds.includes('feedbackup')) {
                                cloneTargtIds.shift()
                                if (isDivElement) {
                                    $(`#${target.id}`).addClass('active-feedback');
                                    target.firstElementChild.dataset.feedbacklike = 'true';
                                    Object.assign(target.dataset, target.firstElementChild.dataset);
                                    feedbackLoop(evt);
                                } else {
                                    $(`#${target.parentElement.id}`).addClass('active-feedback');
                                    target.dataset.feedbacklike = 'false';
                                    feedbackLoop(evt);
                                }

                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .ast-thumbdown`).attr('data-comment',``)
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .ast-thumbdown`).attr('data-feedbackdetails','[]');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .btn-chip-negtive.active-chip`).removeClass('active-chip');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} #feedBackComment-${cloneTargtIds.join('-')}`).val('');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .submit-btn`).attr('disabled', 'disabled')
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .submit-btn`).html('Submit');
                                $(`#feedbackdown-${cloneTargtIds.join('-')}`).removeClass('active-feedback')
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .thanks-update`).removeClass('hide');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .help-improve-arrow`).addClass('hide')
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .explore-more-negtive-data`).addClass('hide');
                            }
                            if (targetIds.includes('feedbackdown')) {
                                cloneTargtIds.shift()
                                if (isDivElement) {
                                    $(`#${target.id}`).addClass('active-feedback');
                                    target.firstElementChild.dataset.feedbacklike = 'true';
                                    Object.assign(target.dataset, target.firstElementChild.dataset);
                                     feedbackLoop(evt);
                                } else {
                                    $(`#${target.parentElement.id}`).addClass('active-feedback');
                                    target.dataset.feedbacklike = 'false';
                                     feedbackLoop(evt);
                                }
                                $(`#feedbackup-${cloneTargtIds.join('-')}`).removeClass('active-feedback')
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .thanks-update`).addClass('hide');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .help-improve-arrow`).removeClass('hide')
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .explore-more-negtive-data`).removeClass('hide');
                                $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .title-improve`).removeClass('hide');

                            }
                        }
                        if (target.id.split('-')[0] == 'dropdownArrowFeedBack' || target.id.split('-')[0] == 'dropdownArrowFeedBackIcon') {
                            let targteId = target.id.split('-');
                            targteId.shift();
                            let dataSets = $(`#feedbackdown-${targteId.join('-')} .ast-thumbdown`).data();
                            let activeChipCount = $(`#feedbackHelpfulContainer-${targteId.join('-')} .btn-chip-negtive.active-chip`);
                            if ((activeChipCount.length > 0 || dataSets.comment.length > 0) && target.dataset.feedbackDropDownOpened === 'true') {
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
                            } else {
                                if ((activeChipCount.length == 0 && dataSets.comment.length == 0) && target.dataset.feedbackDropDownOpened === 'true') {
                                    $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).removeClass('hide');
                                } else {
                                    $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
                                }
                            }
                            if (target.dataset.feedbackDropDownOpened === 'false') {
                                $(`#dropdownArrowFeedBackIcon-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
                                $(`#dropdownArrowFeedBack-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .explore-more-negtive-data`).addClass('hide');
                            } else {
                                $(`#dropdownArrowFeedBackIcon-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'false');
                                $(`#dropdownArrowFeedBack-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'false');
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .explore-more-negtive-data`).removeClass('hide');
                            }
                            let updateFlag = $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).attr('data-updateflag');
                            if (updateFlag == 'true' && target.dataset.feedbackDropDownOpened === 'false') {
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).html('Update');
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).attr('disabled', 'disabled');
                                AgentAssist_feedBack_Update_Request(dataSets);
                                $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
                                isUpdateFeedBackDetailsFlag = true;
                            }
                        }
                        if (target.className.includes('btn-chip-negtive')) {
                            let id = target.parentElement.id.split('-');
                            id.shift();
                            let dataSets = $(`#feedbackdown-${id.join('-')} .ast-thumbdown`).data();
                            if (target.dataset.chipClick == 'false') {
                                $(target).addClass('active-chip');
                                target.dataset.chipClick = 'true';
                                dataSets.feedbackdetails.push($(target).html());

                            } else {
                                $(target).removeClass('active-chip');
                                target.dataset.chipClick = 'false';
                                dataSets.feedbackdetails?.forEach((ele, i) => {
                                    if (ele == $(target).html()) {
                                        delete dataSets.feedbackdetails[i]
                                    }
                                })
                            }
                            let activeChipCount = $(`#${target.parentElement.id} .btn-chip-negtive.active-chip`);
                            if (activeChipCount.length > 0) {
                                $(`#feedbackHelpfulContainer-${id.join('-')} .title-improve`).addClass('hide');
                                $(`#feedbackHelpfulContainer-${id.join('-')} .submit-btn`).removeAttr('disabled');
                            } else {
                                if (dataSets.comment.length == 0) {
                                    $(`#feedbackHelpfulContainer-${id.join('-')} .title-improve`).removeClass('hide');
                                }
                            }
                            $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-feedbackdetails', dataSets.feedbackdetails)
                        }
                        if (target.id == 'feedbackSubmit') {
                            let id = target.parentElement.firstElementChild.id.split('-');
                            id.shift();
                            let dataSets = $(`#feedbackdown-${id.join('-')} .ast-thumbdown`).data();
                            // if(target.innerHTML == 'Update') {
                            //     dataSets.comment = target.value;
                            //     // dataSets.feedbackdetails = 

                            // }
                            if(typeof dataSets.feedbackdetails == 'string'&& dataSets.feedbackdetails.indexOf(',') > -1 ) {
                                dataSets.feedbackdetails = dataSets.feedbackdetails.split(',');
                            }
                            feedbackLoop(dataSets, true);
                            $(`#feedbackHelpfulContainer-${id.join('-')} .thanks-update`).css('right','34px').removeClass('hide');
                            setTimeout(()=>{
                                $(`#feedbackHelpfulContainer-${id.join('-')} .thanks-update`).css('right','25px').addClass('hide');
                            },3000)
                            $(`#feedbackHelpfulContainer-${id.join('-')} .explore-more-negtive-data`).addClass('hide');
                            $(`#feedbackHelpfulContainer-${id.join('-')} #dropdownArrowFeedBackIcon-${id.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
                            $(`#feedbackHelpfulContainer-${id.join('-')} #dropdownArrowFeedBack-${id.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
                            target.dataset.updateflag = 'true';
                            $(`#feedbackHelpfulContainer-${id.join('-')}.submit-btn`).attr('disabled', 'disabled');

                            $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-comment',``)
                            $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-feedbackdetails','[]')
                            dataSets.comment = "";
                            dataSets.feedbackdetails = [];
                            $(`#feedbackHelpfulContainer-${id.join('-')} .btn-chip-negtive.active-chip`).removeClass('active-chip');
                            $(`#feedbackHelpfulContainer-${id.join('-')} #feedBackComment-${id.join('-')}`).val('');
                            isUpdateFeedBackDetailsFlag = false;
                        }
                        if (target.id === 'showHistory') {
                            isShowHistoryEnable = true;
                            $('.show-history-block').addClass('hide');
                            $('.show-back-recommendation-block').removeClass('hide');
                            $('#dynamicBlock .dialog-task-accordiaon-info').addClass('hide');
                            $('#dynamicBlock .agent-utt-info').addClass('hide');
                            $('#dynamicBlock .dialog-task-run-sec').addClass('hide');
                            $('#historyData').removeClass('hide');
                            // getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_agentAssistDataObj.botId}/history?convId=${_agentAssistDataObj.conversationId}&agentHistory=false`)
                            //     .then(response => {

                            //         document.getElementById("loader").style.display = "none";
                            //         $(`#historyData .collapse-acc-data`)?.addClass('hide');
                            //         $(`#historyData .show-history-feedback`)?.addClass('hide');

                            //         let previousId;
                            //         let previousTaskName, currentTaskName;
                            //         if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                            //             $(`#historyData .collapse-acc-data.hide`)[$(`#historyData .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                            //             $(`#historyData .show-history-feedback.hide`)[$(`#historyData .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                            //             $(`#historyData .dilog-task-end.hide`)[$(`#historyData .dilog-task-end.hide`).length - 1]?.classList.remove('hide');


                            //         } else {
                            //             let resp = response.length > 0 ? response?.slice(previousResp?.length - 1, response.length) : undefined;
                            //             resp?.forEach((res, index) => {
                            //                 if (res.type == 'incoming') {
                            //                     res.components?.forEach((ele) => {
                            //                         if (ele.data.text == previousTaskName) {
                            //                             previousTaskName = undefined;
                            //                             previousId = undefined;
                            //                             console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                            //                         }
                            //                     })
                            //                 }

                            //                 if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing') {

                            //                     automationNotRanArray?.forEach((eleName, i) => {
                            //                         let historyDataHtml = $('#historyData');
                            //                         if (eleName === res.agentAssistDetails?.userInput) {
                            //                             let uniqueID = res._id;
                            //                             let htmls = `
                            //                         <div class="agent-utt-info" id="agentUttInfo-${uniqueID}">
                            //                             <div class="user-img">
                            //                                 <img src="./images/userIcon.svg">
                            //                             </div>
                            //                             <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                            //                         </div>
                            //                         <div class="dialog-task-run-sec" id="automationSuggestions-${uniqueID}">
                            //                         </div>`;

                            //                             historyDataHtml.append(htmls);
                            //                             let automationSuggestions = document.getElementById(`automationSuggestions-${uniqueID}`);
                            //                             if (res.agentAssistDetails?.ambiguityList?.dialogs?.length > 0 || res.agentAssistDetails?.suggestions?.dialogs?.length > 0) {


                            //                                 let dialogAreaHtml = `<div class="task-type" id="dialoguesArea">
                            //               <div class="img-block-info">
                            //                   <img src="./images/dialogtask.svg">
                            //               </div>
                            //               <div class="content-dialog-task-type" id="dialogSuggestions-${uniqueID}">
                            //                 <div class="type-with-img-title">Dialog task (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.dialogs?.length : res.agentAssistDetails?.ambiguityList.dialogs?.length})</div>
                            //               </div>
                            //             </div>`;
                            //                                 automationSuggestions.innerHTML += dialogAreaHtml;
                            //                             }
                            //                             if (res.agentAssistDetails?.ambiguityList?.faqs?.length > 0 || res.agentAssistDetails?.suggestions?.faqs?.length > 0) {
                            //                                 let dialogAreaHtml = `<div class="task-type" id="faqssArea">
                            //             <div class="img-block-info">
                            //                 <img src="./images/kg.svg">
                            //             </div>
                            //             <div class="content-dialog-task-type" id="faqsSuggestions-${uniqueID}">
                            //                 <div class="type-with-img-title">FAQ/Articles (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>
                                            
                            //             </div>
                            //         </div>`;
                            //                                 automationSuggestions.innerHTML += dialogAreaHtml;
                            //                             }
                            //                             let dialogsss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.dialogs) : (res.agentAssistDetails?.ambiguityList?.dialogs);
                            //                             dialogsss?.forEach((ele, index) => {

                            //                                 let dialogSuggestions = document.getElementById(`dialogSuggestions-${uniqueID}`);
                            //                                 let dialogsHtml = `
                            //                 <div class="type-info-run-send">
                            //                     <div class="left-content">
                            //                         <div class="title-text" id="automation-${uniqueID}">${ele.name}</div>
                            //                     </div>
                            //                     <div class="action-links">
                            //                         <button class="send-run-btn" data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                         data-bot-id="${res.botId}" data-intent-name="${ele.name}"
                            //                         data-history-run="true" id="run-${uniqueID}"
                            //                         >RUN</button>
                            //                         <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uniqueID}">
                            //                             <div class="elipse-icon" id="elipseIcon-${uniqueID}">
                            //                                 <i class="ast-overflow" id="overflowIcon-${uniqueID}"></i>
                            //                             </div>
                            //                             <div class="dropdown-content-elipse" id="runAgtBtn-${uniqueID}">
                            //                                 <div class="list-option" data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                                 data-bot-id="${res.botId}" data-intent-name="${ele.name}"
                            //                                  id="agentSelect-${uniqueID}"
                            //                                 data-exhaustivelist-run="true">Run with Agent Inputs</div>
                            //                             </div>
                            //                     </div>
                            //                 </div>`;
                            //                                 dialogSuggestions.innerHTML += dialogsHtml;
                            //                             });
                            //                             let faqss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.faqs) : (res.agentAssistDetails?.ambiguityList?.faqs);
                            //                             faqss?.forEach((ele, index) => {

                            //                                 let faqsSuggestions = document.getElementById(`faqsSuggestions-${uniqueID}`);

                            //                                 let faqHtml = `
                            //                 <div class="type-info-run-send" id="faqDiv-${uniqueID}">
                            //                     <div class="left-content" id="faqSection-${uniqueID}">
                            //                         <div class="title-text" id="title-${uniqueID}">${ele.question}</div>
                                                    
                                                    
                            //                     </div>
                                                
                            //                 </div>`;

                            //                                 faqsSuggestions.innerHTML += faqHtml;
                            //                                 let faqs = $(`.type-info-run-send #faqSection-${uniqueID}`);
                            //                                 if (!ele.answer) {
                            //                                     let checkHtml = `
                            //                     <i class="ast-carrotup" data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                     data-bot-id="${res.botId}" data-intent-name="${ele.question}"
                            //                     data-check="true" id="check-${uniqueID}"></i>`;
                            //                                     faqs.append(checkHtml);
                            //                                 } else {
                            //                                     let a = $(`#faqDiv-${uniqueID}`);
                            //                                     let faqActionHtml = `<div class="action-links">
                            //                     <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID}"  data-msg-data="${ele.answer}">Send</button>
                            //                     <div class="copy-btn" data-msg-id="${uniqueID}" data-msg-data='${ele.answer}'>
                            //                         <i class="ast-copy" data-msg-id="${uniqueID}" data-msg-data='${ele.answer}'></i>
                            //                     </div>
                            //                 </div>`;
                            //                                     a.append(faqActionHtml);
                            //                                     faqs.append(`<div class="desc-text" id="desc-${uniqueID}">${ele.answer}</div>`);
                            //                                 }
                            //                                 if ((ele.question?.length + ele.answer?.length) > 70) {
                            //                                     let faqs = $(`.type-info-run-send #faqSection-${uniqueID}`);
                            //                                     let seeMoreButtonHtml = `
                            //                       <button class="ghost-btn" style="font-style: italic;" id="seeMore-${uniqueID}" data-see-more="true">Show more</button>
                            //                       <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uniqueID}" data-see-less="true">Show less</button>
                            //                       `;
                            //                                     faqs.append(seeMoreButtonHtml);
                            //                                 }
                            //                                 uniqueID = undefined;
                            //                             })
                            //                         }
                            //                     });
                            //                 }
                            //                 if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {
                            //                     let _msgsResponse = {
                            //                         "type": "bot_response",
                            //                         "from": "bot",
                            //                         "message": [],
                            //                         "messageId": res._id,
                            //                         "botInfo": {
                            //                             "chatBot": "sample Bot",
                            //                             "taskBotId": res.botId
                            //                         },
                            //                         "createdOn": "2022-03-21T07:56:18.225Z",
                            //                         "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                            //                         "traceId": "873209019a5adc26",
                            //                         "createdOnTimemillis": res._id
                            //                     }
                            //                     currentTaskName = res.tN ? res.tN : currentTaskName;
                            //                     let historyData = $('#historyData');
                            //                     let userInputHtml;
                            //                     if (res.agentAssistDetails.userInput) {
                            //                         userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                            //                             <div class="user-img">
                            //                                 <img src="./images/userIcon.svg">
                            //                             </div>
                            //                             <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                            //                         </div>`;
                            //                     }
                            //                     let dropdownHtml = `
                                                    
                            //                                     <div class="dialog-task-accordiaon-info" id="addRemoveDropDown-${res._id}" >
                            //                                         <div class="accordion-header" id="dropDownHeader-${res._id}"
                            //                                         data-drop-down-opened="false">
                            //                                             <div class="icon-info">
                            //                                                 <i class="ast-rule"></i>
                            //                                             </div>
                            //                                             <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                            //                                             <i class="ast-carrotup"></i>
                            //                                         </div>
                            //                                         <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                                        
                                                                        
                            //                                         </div>
                            //                                         <div class="feedback-data show-history-feedback hide">
                            //                                             <div class="feedbackup-data">
                            //                                                 <div class="feedback-icon" id="feedbackup">
                            //                                                     <i class="ast-thumbup" id="feedbackup-${res._id}" data-feedbacklike="false" data-conv-id="${_agentAssistDataObj.conversationId}"data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                            //                                                 </div>
                            //                                                 <span class="tootltip-tabs">Like</span>
                            //                                             </div>
                            //                                             <div class="feedbackdown-data">
                            //                                                 <div class="feedback-icon" id="feedbackdown">
                            //                                                     <i class="ast-thumbdown" id="feedbackdown-${res._id}" data-feedbackdislike="false" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                            //                                                 </div>
                            //                                                 <span class="tootltip-tabs">Dislike</span>
                            //                                             </div>
                            //                                         </div>
                            //                                 <div class="dilog-task-end hide" id="endTaks-${res._id}">
                            //                                 <div class="text-dialog-task-end">Task Ended</div>     
                            //                                             </div>
                            //                                         </div>
                            //                                     `;

                            //                     if (previousTaskName && currentTaskName !== previousTaskName) {
                            //                         previousId = undefined;
                            //                     }

                            //                     if (res.tN && !previousId && previousTaskName !== currentTaskName) {
                            //                         let divExist = $(`#addRemoveDropDown-${res._id}`);
                            //                         previousTaskName = currentTaskName;
                            //                         if (divExist.length >= 1) {
                            //                             console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                            //                         } else {
                            //                             historyData.append(userInputHtml);
                            //                             historyData.append(dropdownHtml);
                            //                             previousId = res._id;
                            //                             previousTaskName = res.tN;
                            //                         }
                            //                     }
                            //                     if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
                            //                         let runInfoContent = $(`#dropDownData-${previousId}`);
                            //                         let userQueryHtml = `
                            //                             <div class="steps-run-data">
                            //                                 <div class="icon_block_img">
                            //                                     <img src="./images/userIcon.svg">
                            //                                 </div>
                            //                                 <div class="run-info-content" id="userInput-${res._id}">
                            //                                     <div class="title">Customer Said - </div>
                            //                                     <div class="agent-utt">
                            //                                         <div class="title-data">${res.agentAssistDetails.entityValue}</div>
                            //                                     </div>
                                                                
                            //                                 </div>
                            //                             </div>`;
                            //                         runInfoContent.append(userQueryHtml);
                            //                         let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                            //                         if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt) {
                            //                             entityHtml.append(`<div class="order-number-info">${res.agentAssistDetails.entityName} : ${res.agentAssistDetails.entityValue}</div>`);
                            //                         } else {
                            //                             if (res.agentAssistDetails.isErrorPrompt) {
                            //                                 let entityHtmls = `<div class="order-number-info">${res.agentAssistDetails.entityName} : 
                            //                                             <span style="color:red">Value unidentified</span>
                            //                                         </div>
                            //                                         <div>
                            //                                             <img src="./images/warning.svg" style="padding-right: 8px;">
                            //                                             <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                            //                                         </div>`
                            //                                 entityHtml.append(entityHtmls);
                            //                             }
                            //                         }
                            //                     }
                            //                     let parsedPayload;
                            //                     res.components?.forEach((elem) => {
                            //                         let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                            //                         if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                            //                             let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                            //                             parsedPayload = JSON.parse(withoutSpecials);
                            //                         }

                            //                         let body = {};
                            //                         body['type'] = elem.cT;
                            //                         if (!parsedPayload) {
                            //                             body['component'] = {
                            //                                 "type": elem.cT,
                            //                                 "payload": {
                            //                                     "type": elem.cT,
                            //                                     "text": elem.data.text
                            //                                 }
                            //                             };
                            //                             body['cInfo'] = {
                            //                                 "body": elem.data.text
                            //                             };

                            //                         } else {
                            //                             body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                            //                             if (parsedPayload?.type === 'message') {
                            //                                 body['cInfo'] = {
                            //                                     "body": ''
                            //                                 };
                            //                             } else if (parsedPayload?.text) {
                            //                                 body['cInfo'] = {
                            //                                     "body": parsedPayload.text
                            //                                 };
                            //                             } else {
                            //                                 body['cInfo'] = {
                            //                                     "body": parsedPayload
                            //                                 };
                            //                             }

                            //                         }

                            //                         _msgsResponse.message.push(body);
                            //                     });
                            //                     let runInfoContent = $(`#dropDownData-${previousId}`);
                            //                     let askToUserHtml = `
                            //                         <div class="steps-run-data">
                            //                                     <div class="icon_block">
                            //                                         <i class="ast-agent"></i>
                            //                                     </div>
                            //                                     <div class="run-info-content" >
                            //                                     <div class="title">Ask customer</div>
                            //                                     <div class="agent-utt">
                            //                                         <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                                    
                            //                                     </div>
                            //                                     </div>
                            //                                 </div>
                            //                         `;
                            //                     let tellToUserHtml = `
                            //                         <div class="steps-run-data">
                            //                                     <div class="icon_block">
                            //                                         <i class="ast-agent"></i>
                            //                                     </div>
                            //                                     <div class="run-info-content" >
                            //                                     <div class="title">Tell Customer</div>
                            //                                     <div class="agent-utt">
                            //                                         <div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                                    
                            //                                     </div>
                            //                                     </div>
                            //                                 </div>
                            //                         `;
                            //                     if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                            //                         runInfoContent.append(askToUserHtml);
                            //                     } else {
                            //                         runInfoContent.append(tellToUserHtml);
                            //                     }
                            //                     AgentChatInitialize.renderMessage(_msgsResponse, res._id, `dropDownData-${previousId}`);
                            //                     //  removeElementFromDom();
                            //                     //if (res.agentAssistDetails.endOfTask) { // need this block of code once the endofTask flag received from backend
                            //                     //                                                    let dropDownData = $(`#dropDownData-${previousId}`);
                            //                     //                    let endOfDialoge = $(`#addRemoveDropDown-${previousId}`);

                            //                     //                 // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                            //                     //                 let feedbackHtml = ` 
                            //                     //     <div class="feedback-data">
                            //                     //         <div class="feedback-icon" id="feedbackup">
                            //                     //             <i class="ast-thumbup" id="feedbackup-${previousId}"
                            //                     //             data-feedbacklike="false"
                            //                     //             data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                     //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like"
                            //                     //                     data-dialog-name="${previousTaskName}"
                            //                     //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                            //                     //         </div>
                            //                     //         <div class="feedback-icon" id="feedbackdown">
                            //                     //             <i class="ast-thumbdown" id="feedbackdown-${previousId}"
                            //                     //             data-feedbackdislike="false"
                            //                     //             data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                     //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike"
                            //                     //                     data-dialog-name="${previousTaskName}"
                            //                     //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                            //                     //         </div>
                            //                     //    </div>`;
                            //                     //                 dropDownData.append(feedbackHtml);
                            //                     //                 let endofDialogeHtml = `
                            //                     //     <div class="dilog-task-end" id="endTaks-${previousId}">
                            //                     //     <div class="text-dialog-task-end">Task Ended</div>     
                            //                     //                </div>

                            //                     //     `;
                            //                     //                 endOfDialoge.append(endofDialogeHtml);
                            //                     //     previousId = undefined;
                            //                     //     previousTaskName = undefined;
                            //                     // }

                            //                 }
                            //                 if (index == resp.length - 1) {
                            //                     $(`#historyData .collapse-acc-data.hide`)[$(`#historyData .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                            //                     // $(`#historyData .show-history-feedback.hide`)[$(`#historyData .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                            //                 }
                            //             });
                            //         }
                            //         previousResp = response;
                            //     }).catch(err => {
                            //         document.getElementById("loader").style.display = "block";
                            //         console.log("error", err)
                            //     });
                        }
                        if (target.id === 'backToRecommendation') {
                            isShowHistoryEnable = false;
                            let dom = document.getElementById('dynamicBlock');
                            dom.classList.remove('hide');
                            $('.show-history-block').removeClass('hide');
                            $('.show-back-recommendation-block').addClass('hide');
                            $('#historyData').addClass('hide');
                            let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
                            let dialogSpace = document.getElementsByClassName('dialog-task-run-sec hide');
                            let suggestionsLength = $(`#dynamicBlock .dialog-task-run-sec`);
                            for (let ele of automationSuggestions) {
                                ele.classList.add('hide');
                            }

                            $(document).ready(() => {
                                if (automationSuggestions.length >= 1 && suggestionsLength.length <= 0) {
                                    automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                                    for (let a of $('#dynamicBlock .agent-utt-info')) {
                                        a.classList.add('hide');
                                    }
                                }

                            })

                            if (idsOfDropDown && automationSuggestions.length >= 1 && suggestionsLength.length <= 0) {
                                automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                            }

                            if (idsOfDropDown) {
                                for (let a of $('#dynamicBlock .agent-utt-info')) {
                                    a.classList.add('hide');
                                }
                            }
                            let dialogs = $(`#dynamicBlock .dialog-task-run-sec`);
                            dialogs.each(function (i, ele) {
                                $('#dynamicBlock .agent-utt-info').each((i, elem) => {
                                    let ids = elem.id?.split('-');
                                    ids.shift();
                                    let taskIds = ele.id.split('-');
                                    taskIds.shift();

                                    if (taskIds.join('-').includes(ids.join('-'))) {
                                        $(elem).removeClass('hide')
                                    } else {
                                        $(elem).addClass('hide')
                                    }
                                })
                            });
                            for (let a of dialogSpace) {
                                a.classList.remove('hide');
                            }
                        }
                        if (target.id === 'agent-showHistory') {
                            isShowHistoryEnableForMyBot = true;
                            $('#agentAutoContainer .show-history-block').addClass('hide');
                            $('#agentAutoContainer .show-back-recommendation-block').removeClass('hide');
                            $('#agentAutoContainer .dialog-task-accordiaon-info').addClass('hide');
                            $('#agentAutoContainer .agent-utt-info').addClass('hide');
                            $('#historyDataForMyBot').removeClass('hide');
                            // getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_agentAssistDataObj.botId}/history?convId=${_agentAssistDataObj.conversationId}&agentHistory=true`)
                            //     .then(response => {
                            //         document.getElementById("loader").style.display = "none";
                            //         $(`#historyDataForMyBot .collapse-acc-data`)?.addClass('hide');
                            //         $(`#historyDataForMyBot .show-history-feedback`)?.addClass('hide');

                            //         let previousId;
                            //         let previousTaskName, currentTaskName;
                            //         if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                            //             $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                            //             $(`#historyDataForMyBot .show-history-feedback.hide`)[$(`#historyDataForMyBot .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                            //             $(`#historyDataForMyBot .dilog-task-end.hide`)[$(`#historyDataForMyBot .dilog-task-end.hide`).length - 1]?.classList.remove('hide');

                            //         } else {
                            //             let resp = response.length > 0 ? response?.slice(previousResp?.length - 1, response.length) : undefined;
                            //             resp?.forEach((res, index) => {
                            //                 if (res.type == 'incoming') {
                            //                     res.components?.forEach((ele) => {
                            //                         if (ele.data.text == previousTaskName) {
                            //                             previousTaskName = undefined;
                            //                             previousId = undefined;
                            //                             console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                            //                         }
                            //                     })
                            //                 }
                            //                 if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {
                            //                     let _msgsResponse = {
                            //                         "type": "bot_response",
                            //                         "from": "bot",
                            //                         "message": [],
                            //                         "messageId": res._id,
                            //                         "botInfo": {
                            //                             "chatBot": "sample Bot",
                            //                             "taskBotId": res.botId
                            //                         },
                            //                         "createdOn": "2022-03-21T07:56:18.225Z",
                            //                         "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                            //                         "traceId": "873209019a5adc26",
                            //                         "createdOnTimemillis": res._id
                            //                     }
                            //                     currentTaskName = res.tN ? res.tN : currentTaskName;
                            //                     let historyData = $('#historyDataForMyBot');
                            //                     let userInputHtml;
                            //                     if (res.agentAssistDetails.userInput) {
                            //                         userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                            //                                 <div class="user-img">
                            //                                     <img src="./images/userIcon.svg">
                            //                                 </div>
                            //                                 <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                            //                             </div>`;
                            //                     }
                            //                     let dropdownHtml = `
                                                        
                            //                                         <div class="dialog-task-accordiaon-info" id="addRemoveDropDown-${res._id}" >
                            //                                             <div class="accordion-header" id="dropDownHeader-${res._id}"
                            //                                             data-drop-down-opened="false">
                            //                                                 <div class="icon-info">
                            //                                                     <i class="ast-rule"></i>
                            //                                                 </div>
                            //                                                 <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                            //                                                 <i class="ast-carrotup"></i>
                            //                                             </div>
                            //                                             <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                                            
                                                                            
                            //                                             </div>
                            //                                             <div class="feedback-data show-history-feedback hide">
                            //                                                 <div class="feedbackup-data">
                            //                                                     <div class="feedback-icon" id="feedbackup">
                            //                                                         <i class="ast-thumbup" id="feedbackup-${res._id}" data-feedbacklike="false" data-conv-id="${_agentAssistDataObj.conversationId}"data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                            //                                                     </div>
                            //                                                     <span class="tootltip-tabs">Like</span>
                            //                                                 </div>
                            //                                                 <div class="feedbackdown-data">
                            //                                                     <div class="feedback-icon" id="feedbackdown">
                            //                                                         <i class="ast-thumbdown" id="feedbackdown-${res._id}" data-feedbackdislike="false" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                            //                                                     </div>
                            //                                                     <span class="tootltip-tabs">Dislike</span>
                            //                                                 </div>
                            //                                             </div>
                            //                                     <div class="dilog-task-end hide" id="endTaks-${res._id}">
                            //                                     <div class="text-dialog-task-end">Task Ended</div>     
                            //                                                 </div>
                            //                                             </div>
                            //                                         `;

                            //                     if (previousTaskName && currentTaskName !== previousTaskName) {
                            //                         previousId = undefined;
                            //                     }

                            //                     if (res.tN && !previousId && previousTaskName !== currentTaskName) {
                            //                         let divExist = $(`#addRemoveDropDown-${res._id}`);
                            //                         previousTaskName = currentTaskName;
                            //                         if (divExist.length >= 1) {
                            //                             console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                            //                         } else {
                            //                             historyData.append(userInputHtml);
                            //                             historyData.append(dropdownHtml);
                            //                             previousId = res._id;
                            //                             previousTaskName = res.tN;
                            //                         }
                            //                     }
                            //                     if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
                            //                         let runInfoContent = $(`#dropDownData-${previousId}`);
                            //                         let userQueryHtml = `
                            //                                 <div class="steps-run-data">
                            //                                     <div class="icon_block_img">
                            //                                         <img src="./images/userIcon.svg">
                            //                                     </div>
                            //                                     <div class="run-info-content" id="userInput-${res._id}">
                            //                                         <div class="title">Customer Said - </div>
                            //                                         <div class="agent-utt">
                            //                                             <div class="title-data">${res.agentAssistDetails.entityValue}</div>
                            //                                         </div>
                                                                    
                            //                                     </div>
                            //                                 </div>`;
                            //                         runInfoContent.append(userQueryHtml);
                            //                         let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                            //                         if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt) {
                            //                             entityHtml.append(`<div class="order-number-info">${res.agentAssistDetails.entityName} : ${res.agentAssistDetails.entityValue}</div>`);
                            //                         } else {
                            //                             if (res.agentAssistDetails.isErrorPrompt) {
                            //                                 let entityHtmls = `<div class="order-number-info">${res.agentAssistDetails.entityName} : 
                            //                                                 <span style="color:red">Value unidentified</span>
                            //                                             </div>
                            //                                             <div>
                            //                                                 <img src="./images/warning.svg" style="padding-right: 8px;">
                            //                                                 <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                            //                                             </div>`
                            //                                 entityHtml.append(entityHtmls);
                            //                             }
                            //                         }
                            //                     }
                            //                     let parsedPayload;
                            //                     res.components?.forEach((elem) => {
                            //                         let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                            //                         try {
                            //                             if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                            //                                 let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                            //                                 parsedPayload = JSON.parse(withoutSpecials);
                            //                             }
                            //                         }catch(error){
                            //                             if(payloadType.text){
                            //                                 let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                            //                                 parsedPayload = withoutSpecials;
                            //                             }
                            //                         }

                            //                         let body = {};
                            //                         body['type'] = elem.cT;
                            //                         if (!parsedPayload) {
                            //                             body['component'] = {
                            //                                 "type": elem.cT,
                            //                                 "payload": {
                            //                                     "type": elem.cT,
                            //                                     "text": elem.data.text
                            //                                 }
                            //                             };
                            //                             body['cInfo'] = {
                            //                                 "body": elem.data.text
                            //                             };

                            //                         } else {
                            //                             body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                            //                             if (parsedPayload?.type === 'message') {
                            //                                 body['cInfo'] = {
                            //                                     "body": ''
                            //                                 };
                            //                             } else if (parsedPayload?.text) {
                            //                                 body['cInfo'] = {
                            //                                     "body": parsedPayload.text
                            //                                 };
                            //                             } else {
                            //                                 body['cInfo'] = {
                            //                                     "body": parsedPayload
                            //                                 };
                            //                             }

                            //                         }

                            //                         _msgsResponse.message.push(body);
                            //                     });
                            //                     let runInfoContent = $(`#dropDownData-${previousId}`);
                            //                     let askToUserHtml = `
                            //                             <div class="steps-run-data">
                            //                                         <div class="icon_block">
                            //                                             <i class="ast-agent"></i>
                            //                                         </div>
                            //                                         <div class="run-info-content" >
                            //                                         <div class="title">Ask customer</div>
                            //                                         <div class="agent-utt">
                            //                                             <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                                        
                            //                                         </div>
                            //                                         </div>
                            //                                     </div>
                            //                             `;
                            //                     let tellToUserHtml = `
                            //                             <div class="steps-run-data">
                            //                                         <div class="icon_block">
                            //                                             <i class="ast-agent"></i>
                            //                                         </div>
                            //                                         <div class="run-info-content" >
                            //                                         <div class="title">Tell Customer</div>
                            //                                         <div class="agent-utt">
                            //                                             <div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                                        
                            //                                         </div>
                            //                                         </div>
                            //                                     </div>
                            //                             `;
                            //                     if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                            //                         runInfoContent.append(askToUserHtml);
                            //                     } else {
                            //                         runInfoContent.append(tellToUserHtml);
                            //                     }
                            //                     AgentChatInitialize.renderMessage(_msgsResponse, res._id, `dropDownData-${previousId}`);
                            //                     //  removeElementFromDom();
                            //                     //if (res.agentAssistDetails.endOfTask) { // need this block of code once the endofTask flag received from backend
                            //                     //                                                    let dropDownData = $(`#dropDownData-${previousId}`);
                            //                     //                    let endOfDialoge = $(`#addRemoveDropDown-${previousId}`);

                            //                     //                 // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                            //                     //                 let feedbackHtml = ` 
                            //                     //     <div class="feedback-data">
                            //                     //         <div class="feedback-icon" id="feedbackup">
                            //                     //             <i class="ast-thumbup" id="feedbackup-${previousId}"
                            //                     //             data-feedbacklike="false"
                            //                     //             data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                     //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like"
                            //                     //                     data-dialog-name="${previousTaskName}"
                            //                     //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                            //                     //         </div>
                            //                     //         <div class="feedback-icon" id="feedbackdown">
                            //                     //             <i class="ast-thumbdown" id="feedbackdown-${previousId}"
                            //                     //             data-feedbackdislike="false"
                            //                     //             data-conv-id="${_agentAssistDataObj.conversationId}"
                            //                     //                     data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike"
                            //                     //                     data-dialog-name="${previousTaskName}"
                            //                     //                     data-user-input="${res.agentAssistDetails.userInput}"></i>
                            //                     //         </div>
                            //                     //    </div>`;
                            //                     //                 dropDownData.append(feedbackHtml);
                            //                     //                 let endofDialogeHtml = `
                            //                     //     <div class="dilog-task-end" id="endTaks-${previousId}">
                            //                     //     <div class="text-dialog-task-end">Task Ended</div>     
                            //                     //                </div>

                            //                     //     `;
                            //                     //                 endOfDialoge.append(endofDialogeHtml);
                            //                     //     previousId = undefined;
                            //                     //     previousTaskName = undefined;
                            //                     // }

                            //                 }
                            //                 if (index == resp.length - 1 || index == 0) {
                            //                     $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                            //                 }
                            //             });
                            //         }
                            //         previousResp = response;
                            //     }).catch(err => {
                            //         document.getElementById("loader").style.display = "block";
                            //         console.log("error", err)
                            //     });

                        }
                        if (target.id === 'agent-backToRecommendation') {
                            isShowHistoryEnableForMyBot = false;
                            let dom = document.getElementById('agentAutoContainer');
                            dom.classList.remove('hide');
                            $('#agentAutoContainer .show-history-block').removeClass('hide');
                            $('#agentAutoContainer .show-back-recommendation-block').addClass('hide');
                            $('#historyDataForMyBot').addClass('hide');

                            let automationSuggestions = $('#agentAutoContainer .dialog-task-accordiaon-info');
                            for (let ele of automationSuggestions) {
                                ele.classList.add('hide');
                            }

                            $(document).ready(() => {
                                if (automationSuggestions.length >= 1) {
                                    automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                                    for (let a of $('#agentAutoContainer .agent-utt-info')) {
                                        a.classList.add('hide');
                                    }
                                }

                            })

                            if (idsOfDropDown && automationSuggestions.length >= 1) {
                                automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                            }

                            if (idsOfDropDown) {
                                for (let a of $('#dynamicBlock .agent-utt-info')) {
                                    a.classList.add('hide');
                                }
                            }

                        }
                        if (target.className == 'btn-danger') {
                            if(target.innerHTML == 'Terminate'){
                                $('#terminatePopUp').removeClass('hide');
                                $('#terminatePopUp .btn-danger').attr('data-position-id',target.dataset.positionId);
                                $(`#myBotTerminateAgentDialog-${myBotDropdownHeaderUuids} .btn-danger`).attr('data-position-id',target.dataset.positionId)
                            }
                            if (target.innerHTML == 'Yes, Terminate') {
                                isTerminateClicked = true;
                                $('#terminatePopUp').addClass('hide');
                                if (currentTabActive == 'userAutoIcon') {
                                    $('#terminateAgentDialog').addClass('hide');
                                    AgentAssistPubSub.publish('agent_assist_send_text',
                                        {
                                            conversationId: _agentAssistDataObj.conversationId,
                                            botId: _botId, value: 'discard all', check: true,
                                            "positionId": target.dataset.positionId
                                        });
                                    document.getElementById("loader").style.display = "block";
                                    terminateTheDialog({ conversationId: _agentAssistDataObj.conversationId,
                                        botId: _botId,"positionId": target.dataset.positionId},'userAutoIcon')
                                } else {
                                    var mybotTabTerminateBtnId = '#myBotTerminateAgentDialog-' + myBotDropdownHeaderUuids;
                                    $(mybotTabTerminateBtnId).addClass('hide');
                                    AgentAssistPubSub.publish('searched_Automation_details',
                                        { conversationId: _agentAssistDataObj.conversationId, botId: _botId, value: 'discard all', isSearch: false,
                                        "positionId": target.dataset.positionId });
                                    document.getElementById("loader").style.display = "block";
                                    terminateTheDialog({ conversationId: _agentAssistDataObj.conversationId,
                                     botId: _botId,"positionId": target.dataset.positionId},'agentAutoIcon')
                                }
                                scrollToBottom();
                            }

                        }
                        if (target.className == 'btn-cancel' || target.className == 'ast-close') {
                            if (target.parentElement.id == 'interruptCancel' || target.parentElement.parentElement.parentElement.id == 'interruptPopUp') {
                                $('#interruptPopUp').addClass('hide');
                            } else if (target.parentElement.id == 'restoreCancel' || target.parentElement.parentElement.parentElement.id == 'restorePopUp') {
                                $('#restorePopUp').addClass('hide');
                            } else {
                                $('#terminatePopUp').addClass('hide');
                            }

                        }
                        $('.dropdown-content-elipse').addClass('hide');
                        if (target.id.split("-")[0] == 'elipseIcon' || target.id.split("-")[0] == 'overflowIcon') {
                            if ($('.dropdown-content-elipse').length !== 0) {
                                $('.dropdown-content-elipse').addClass('hide');
                            }
                            let elementClicked;
                            if (target.id.split("-")[0] == 'elipseIcon') {
                                evt.stopPropagation();
                                (target.nextElementSibling)?.classList.remove('hide');
                                elementClicked = target.parentElement;

                            } else if (target.id.split("-")[0] == 'overflowIcon') {
                                elementClicked = target.parentElement.parentElement;
                                (target.parentElement.nextElementSibling)?.classList.remove('hide');
                            }
                            if (currentTabActive !== 'searchAutoIcon') {
                                $('.elipse-dropdown-info').each((i, ele) => {
                                    $(ele).attr('class').includes('active-elipse') ? $(ele).removeClass('active-elipse') : elementClicked.classList.add('active-elipse');
                                });
                                $(`#overLaySearch .type-info-run-send`).find(elementClicked).length > 0 ? elementClicked.classList.add('active-elipse') : '';
                            }


                        }
                        if (runAutoForAgent) {
                            collapseOldDialoguesInMyBot();
                            updateCurrentTabInState(_conversationId, 'myBotTab')
                            $('#agentSearch').val('');
                            $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            $('#overLaySearch').html('')
                            if (!isMyBotAutomationOnGoing) {
                                data = target.dataset;
                                runDialogFormyBotTab(data, target.id);
                                return;
                            } else if (isMyBotAutomationOnGoing && !noAutomationrunninginMyBot) {
                                // condition for if an automation is already running in the agent automation
                                $('#interruptPopUp').removeClass('hide');
                                console.log("interruption for the  myBotTab");
                                interruptCurrentDialog("myBotTab");
                                $('#interruptPopUp').attr('data-payload', JSON.stringify({id:target.id,info:target.dataset}));
                            }
                        }

                        if (runButton || libraryRunBtn || historyRunBtn) {
                            if (!isAutomationOnGoing) {
                                // $('#welcomeMsg').addClass('hide');
                                if (historyRunBtn) {
                                    isShowHistoryEnable = false;
                                    let dom = document.getElementById('dynamicBlock');
                                    dom.classList.remove('hide');
                                    $('.show-history-block').removeClass('hide');
                                    $('.show-back-recommendation-block').addClass('hide');
                                    $('#historyData').addClass('hide');
                                    $('#historyData .dialog-task-run-sec').each((i, ele) => {
                                        $('#historyData .agent-utt-info').each((i, elem) => {
                                            let eleID = ele.id.split('-');
                                            eleID.shift();
                                            let elemids = elem.id.split('-');
                                            elemids.shift();
                                            let targetIDS = target.id.split('-');
                                            targetIDS.shift();
                                            if (targetIDS.join('-').includes(eleID.join('-')) && (eleID.join('-').includes(elemids.join('-')))) {
                                                elem.remove();
                                                ele.remove();
                                            }
                                        })

                                    })
                                }
                                if (libraryRunBtn) {
                                    collapseOldDialoguesInAssist();
                                    updateCurrentTabInState(_conversationId, 'assistTab')
                                    $('.empty-data-no-agents').addClass('hide');
                                    $('#agentSearch').val('');
                                    $('.overlay-suggestions').addClass('hide').removeAttr('style');
                                    // $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                                    // $('#overLayAutoSearch').html('');
                                    $('#overLaySearch').html('');
                                    userTabActive();

                                    $('#dynamicBlock .dialog-task-run-sec').each((i, ele) => {
                                        $('#dynamicBlock .agent-utt-info').each((i, elem) => {
                                            let eleID = ele.id.split('-');
                                            eleID.shift();
                                            let elemids = elem.id.split('-');
                                            elemids.shift();
                                            if (eleID.join('-').includes(elemids.join('-'))) {
                                                $(`#historyData`).append(`
                                                <div class="agent-utt-info">
                                                   ${$(elem).html()}
                                                </div>
                                                <div class="dialog-task-run-sec">
                                                ${$(ele).html()}
                                                </div>`)
                                              //  elem.remove();
                                            }
                                        })
                                      //  ele.remove();
                                    })
                                }

                                runDialogForAssistTab(target.dataset, target.id);
                                return;
                            }
                            else if(isAutomationOnGoing && libraryRunBtn) {
                                $('#interruptPopUp').removeClass('hide');
                                console.log("interruption for the Assist Tab");
                                interruptCurrentDialog("assistTab");
                                $('#interruptPopUp').attr('data-payload', JSON.stringify({id:target.id,info:target.dataset}));
                            } 
                        }

                        
                        function interruptCurrentDialog(tab) {
                            console.log('interruptCurrentAssistDialog');
                            navigatefromLibToTab = tab;
                        }

                        if(target.innerHTML === 'Yes, continue') {
                            $('#interruptPopUp').addClass('hide');
                            let data = $('#interruptPopUp').data();
                            if(navigatefromLibToTab === 'assistTab') {
                                AgentAssistPubSub.publish('agent_assist_send_text',
                                {
                                    conversationId: _agentAssistDataObj.conversationId,
                                    botId: _botId, value: 'discard all', check: true,
                                    "positionId": dialogPositionId
                                });
                                terminateTheDialog({ conversationId: _agentAssistDataObj.conversationId,
                                botId: _botId,"positionId": dialogPositionId},'userAutoIcon')
                                collapseOldDialoguesInAssist();
                                updateCurrentTabInState(_conversationId, 'assistTab')
                                $('.empty-data-no-agents').addClass('hide');
                                $('#agentSearch').val('');
                                $('.overlay-suggestions').addClass('hide').removeAttr('style');
                                $('#overLaySearch').html('');
                                userTabActive();
                                runDialogForAssistTab(data.payload.info, data.payload.id);
                                return;
                            } else if(navigatefromLibToTab === 'myBotTab'){
                                AgentAssistPubSub.publish('searched_Automation_details',
                                { conversationId: _agentAssistDataObj.conversationId, botId: _botId, value: 'discard all', isSearch: false,
                                "positionId": myBotDialogPositionId });
                                document.getElementById("loader").style.display = "block";
                                terminateTheDialog({ conversationId: _agentAssistDataObj.conversationId,
                                botId: _botId,"positionId": myBotDialogPositionId },'agentAutoIcon')
                                collapseOldDialoguesInMyBot();
                                updateCurrentTabInState(_conversationId, 'myBotTab')
                                $('#agentSearch').val('');
                                $('.overlay-suggestions').addClass('hide').removeAttr('style');
                                $('#overLaySearch').html('')
                                if (!isMyBotAutomationOnGoing) {
                                    runDialogFormyBotTab(data, data.payload.id);
                                    return;
                                }
                            } 
                        }

                        if (target.id.split('-').includes('overRideBtn')) {
                            getOverRideMode(target.id, target.dataset.positionId);
                        }
                        if (target.id.split('-').includes('cancelOverRideBtn')) {
                            getCancelOverRideMode(target.id, target.dataset.positionId);
                           
                        }
                        if (checkButton) {
                            let id = target.id.split('-');
                            id.shift();
                            if (!target.dataset.answerRender) {
                                let faq = $(`#dynamicBlock .type-info-run-send #faqSection-${id.join('-')}`);
                                let answerHtml = `<div class="desc-text" id="desc-${id.join('-')}"></div>`
                                // let faqDiv = $(`#dynamicBlock #faqDiv-${id.join('-')}`);
                                // let faqaction = `<div class="action-links">
                                //     <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                                //     <div class="copy-btn" data-msg-id="${id.join('-')}">
                                //     <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                                //     </div>
                                //     </div>`;
                                // let dropDownHtml =` <i class="ast-carrotup" data-conv-id="${_conversationId}"
                                // data-bot-id="" data-intent-name=""
                                // data-check="true" id="check-${id.join('-')}"></i>`;
                                // let arrowIcons = $(`#dynamicBlock .type-info-run-send #faqSection-${id.join('-')} .ast-carrotup`);
                                // if(!arrowIcons || arrowIcons.length<=0) {
                                //     faq.append(dropDownHtml)
                                // }
                                faq.append(answerHtml);
                                $(`#dynamicBlock #${target.id}`).attr('data-answer-render', 'false');
                                // faqDiv.append(faqaction);
                                answerPlaceableIDs.push({id:`desc-${id.join('-')}`, input: target.dataset.intentName, positionId: target.dataset.positionId});
                                $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
                                $(`#dynamicBlock #faqDiv-${id.join('-')}`).addClass('is-dropdown-open');
                                AgentAssist_run_click(evt.target.dataset, target.dataset.positionId);
                                return
                            }
                            if ($(`#dynamicBlock .type-info-run-send #faqSection-${id.join('-')} .ast-carrotup.rotate-carrot`).length <= 0) {
                                $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
                                $(`#dynamicBlock #faqDiv-${id.join('-')}`).addClass('is-dropdown-open');
                                $(`#dynamicBlock #faqDiv-${id.join('-')} .action-links`).removeClass('hide');
                                $(`#dynamicBlock #desc-${id.join('-')}`).removeClass('hide');
                                setTimeout(() => {                                
                                    updateSeeMoreButtonForAssist(id.join('-'));
                                }, waitingTimeForSeeMoreButton);
                                // $(`#dynamicBlock #seeMore-${id.join('-')}`).removeClass('hide');
                                // $(`#dynamicBlock #seeLess-${id.join('-')}`).addClass('hide');
                            } else {
                                $(`#dynamicBlock #${target.id}`).removeClass('rotate-carrot');
                                $(`#dynamicBlock #faqDiv-${id.join('-')} .action-links`).addClass('hide');
                                $(`#dynamicBlock #faqDiv-${id.join('-')}`).removeClass('is-dropdown-open');
                                $(`#dynamicBlock #desc-${id.join('-')}`).addClass('hide');
                                $(`#dynamicBlock #seeMore-${id.join('-')}`).addClass('hide');
                                $(`#dynamicBlock #seeLess-${id.join('-')}`).addClass('hide');
                            }
                        
                        }

                        if (checkLibButton) {
                            let id = target.id.split('-');
                            id.shift();
                            if ((!target.dataset.answerRender && (currentTabActive == 'userAutoIcon' || currentTabActive == 'agentAutoIcon' || currentTabActive == 'transcriptIcon'))) {
                                let faq = $(`#overLaySearch .type-info-run-send #faqSectionLib-${id.join('-')}`);
                                let answerHtml = `<div class="desc-text" id="descLib-${id.join('-')}"></div>`
                                // let faqDiv = $(`#overLaySearch #faqDivLib-${id.join('-')}`);
                //                 let faqaction = `<div class="action-links">
                //     <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                //     <div class="copy-btn" data-msg-id="${id.join('-')}">
                //         <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                //     </div>
                // </div>`;
                                faq.append(answerHtml);
                                $(`#overLaySearch #${target.id}`).attr('data-answer-render', 'false');
                                // faqDiv.append(faqaction);
                                answerPlaceableIDs.push({id:`descLib-${id.join('-')}`, input: target.dataset.intentName, positionId: target.dataset.positionId});
                                $(`#overLaySearch #${target.id}`).addClass('rotate-carrot');
                                $(`#overLaySearch #faqDivLib-${id.join('-')}`).addClass('is-dropdown-open');
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: evt.target.dataset.convId, botId: evt.target.dataset.botId, value: evt.target.dataset.intentName, isSearch: true, positionId: target.dataset.positionId });
                                return
                            }

                            if ((!target.dataset.answerRender && currentTabActive == 'searchAutoIcon')) {
                                let faq = $(`#search-text-display .type-info-run-send #faqSectionLib-${id.join('-')}`);
                                let answerHtml = `<div class="desc-text" id="descLib-${id.join('-')}"></div>`
                //                 let faqDiv = $(`#search-text-display #faqDivLib-${id.join('-')}`);
                //                 let faqaction = `<div class="action-links">
                //     <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                //     <div class="copy-btn" data-msg-id="${id.join('-')}">
                //         <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                //     </div>
                // </div>`;
                                faq.append(answerHtml);
                                $(`#search-text-display #${target.id}`).attr('data-answer-render', 'false');
                                // faqDiv.append(faqaction);
                                answerPlaceableIDs.push({id:`descLib-${id.join('-')}`, input: target.dataset.intentName, positionId: target.dataset.positionId});
                                $(`#search-text-display #${target.id}`).addClass('rotate-carrot');
                                $(`#search-text-display #faqDivLib-${id.join('-')}`).addClass('is-dropdown-open');
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: evt.target.dataset.convId, botId: evt.target.dataset.botId, value: evt.target.dataset.intentName, isSearch: true, positionId: target.dataset.positionId });
                                return
                            }
                            if (currentTabActive == 'searchAutoIcon') {
                                if ($(`#search-text-display .type-info-run-send #faqSectionLib-${id.join('-')} .ast-carrotup.rotate-carrot`).length <= 0) {
                                    $(`#search-text-display #${target.id}`).addClass('rotate-carrot');
                                    $(`#search-text-display #faqDivLib-${id.join('-')} .action-links`).removeClass('hide');
                                    $(`#search-text-display #descLib-${id.join('-')}`).removeClass('hide');
                                    // $(`#search-text-display #seeMore-${id.join('-')}`).removeClass('hide');
                                    // $(`#search-text-display #seeLess-${id.join('-')}`).addClass('hide');
                                    setTimeout(() => {
                                        updateSeeMoreButtonForAgent(id.join('-'));
                                    }, waitingTimeForSeeMoreButton);
                                    $(`#search-text-display #faqDivLib-${id.join('-')}`).addClass('is-dropdown-open');
 
                                } else {
                                    $(`#search-text-display #${target.id}`).removeClass('rotate-carrot');
                                    $(`#search-text-display #faqDivLib-${id.join('-')} .action-links`).addClass('hide');
                                    $(`#search-text-display #descLib-${id.join('-')}`).addClass('hide');
                                    $(`#search-text-display #seeMore-${id.join('-')}`).addClass('hide');
                                    $(`#search-text-display #seeLess-${id.join('-')}`).addClass('hide');
                                    $(`#search-text-display #faqDivLib-${id.join('-')}`).removeClass('is-dropdown-open');
                                }
                            } else {
                                if ($(`#overLaySearch .type-info-run-send #faqSectionLib-${id.join('-')} .ast-carrotup.rotate-carrot`).length <= 0) {
                                    $(`#overLaySearch #${target.id}`).addClass('rotate-carrot');
                                    $(`#overLaySearch #faqDivLib-${id.join('-')} .action-links`).removeClass('hide');
                                    $(`#overLaySearch #descLib-${id.join('-')}`).removeClass('hide');
                                    // $(`#overLaySearch #seeMore-${id.join('-')}`).removeClass('hide');
                                    // $(`#overLaySearch #seeLess-${id.join('-')}`).addClass('hide');
                                    setTimeout(() => {                                  
                                        updateSeeMoreButtonForAgent(id.join('-'));
                                    }, waitingTimeForSeeMoreButton);
                                    $(`#overLaySearch #faqDivLib-${id.join('-')}`).addClass('is-dropdown-open');
                                } else {
                                    $(`#overLaySearch #${target.id}`).removeClass('rotate-carrot');
                                    $(`#overLaySearch #faqDivLib-${id.join('-')} .action-links`).addClass('hide');
                                    $(`#overLaySearch #descLib-${id.join('-')}`).addClass('hide');
                                    $(`#overLaySearch #seeMore-${id.join('-')}`).addClass('hide');
                                    $(`#overLaySearch #seeLess-${id.join('-')}`).addClass('hide');
                                    $(`#overLaySearch #faqDivLib-${id.join('-')}`).removeClass('is-dropdown-open');

                                }
                            }
                        }

                        if (target.id.split('-')[0] === 'dropDownHeader' || target.id.split('-')[0] === 'dropDownTitle') {
                            let targetIDs = (target.id).split('-');
                            targetIDs.shift();
                            let targetsss = targetIDs.join('-');
                            // if (!isShowHistoryEnable && !isShowHistoryEnableForMyBot) {
                                if (target.dataset.dropDownOpened === 'false') {
                                    $(`#${target.id}`).attr('data-drop-down-opened', 'true');
                                    $(`#dropDownData-${targetsss}`).addClass('hide');
                                    $(`#dropDownHeader-${targetsss}`).find('.ast-carrotup').removeClass('rotate-carrot');
                                   let a =  $(`#${target.parentElement.parentElement.id}`).find(`#endTaks-${targetsss}`);
                                   $(a).removeClass('hide');
                                } else {
                                    $(`#${target.id}`).attr('data-drop-down-opened', 'false');
                                    $(`#dropDownData-${targetsss}`).removeClass('hide');
                                    $(`#dropDownHeader-${targetsss}`).find('.ast-carrotup').addClass('rotate-carrot');
                                    $(`#endTaks-${targetsss}`).removeClass('hide');
                                    // $(`#${target.parentElement.parentElement.id}`).find(`.dilog-task-end.hide`).removeClass('hide');
                                }
                            // }
                            updateScrollButton();
                        }

                        if (target.id.split('-')[0] == 'entityEdit') {
                            let id = target.id.split('-');
                            id.shift();
                            $(`#entitesDiv-${id.join('-')}`).addClass('edit-entity-rules');
                            $(`#saveAndCancel-${id.join('-')}`).removeClass('hide');

                        }
                        if (target.className == 'cancel-btn') {
                            let id = target.id.split('-');
                            id.shift();
                            $(`#entitesDiv-${id.join('-')}`).removeClass('edit-entity-rules');
                            $(`#saveAndCancel-${id.join('-')}`).addClass('hide');
                            entitiestValueArray.forEach((e, i) => {
                                $(`#entityValue-${i}`).val(e.value);
                            });
                            $('.ast-check-right').addClass('disabled-color')
                            $('.save-reset').removeClass('save-reset').addClass('save-reset-disabled');
                        }
                        if (target.id.split('-')[0] == 'restorebtn') {
                            $('#restorePopUp').removeClass('hide');

                        }
                        if (target.className == 'btn-restore') {
                            $('#restorePopUp').addClass('hide');
                            isRetore = true;
                            entitiestValueArray = JSON.parse(previousEntitiesValue);
                            JSON.parse(previousEntitiesValue).forEach((e, i) => {
                                $(`#enityNameAndValue-${i}`).find('.edited-status').addClass('hide');
                                $(`#initialentityValue-${i}`).html(e.value);
                                $(`#entityValue-${i}`).val(e.value);
                                $(`.edit-values-btn.restore`).addClass('hide');
                            });
                        }
                        if (target.id.split('-')[0] == 'savebtn' || target.className == 'ast-check-right' || target.className == 'save-reset') {
                            entitiestValueArray.forEach((e, i) => {
                                if (e.editedValue) {
                                    e.value = e.editedValue;
                                    delete e.editedValue;
                                    $(`#enityNameAndValue-${i}`).find('.edited-status').removeClass('hide');
                                    $(`#initialentityValue-${i}`).html(e.value);
                                }
                            });
                            let id = target.id.split('-');
                            if (id == '') {
                                id = target.nextElementSibling.id.split('-')
                                if (id == '') {
                                    id = target.target.lastElementChild.id.split('-');
                                }
                            }
                            id.shift();
                            $(`#entitesDiv-${id.join('-')}`).removeClass('edit-entity-rules');
                            $(`#saveAndCancel-${id.join('-')}`).addClass('hide');
                            $(`.edit-values-btn.restore`).removeClass('hide');
                            isRetore = false;
                            $('.ast-check-right').addClass('disabled-color')
                            $('.save-reset').removeClass('save-reset').addClass('save-reset-disabled');
                        }

                        if (target.id.split('-')[0] == 'buldCount' || target.className == 'ast-bulb' || target.className == 'count-number') {
                            let bulbDiv;
                            if ($('#scriptContainer .other-user-bubble .bubble-data .buld-count-utt').length > 0) {
                                bulbDiv = $('#scriptContainer .other-user-bubble .bubble-data').find('.buld-count-utt, .buld-count-utt-after-click');
                            } else {
                                bulbDiv = $('#scriptContainer .other-user-bubble .bubble-data .buld-count-utt-after-click');
                            }
                            let bulbid = target.id.split('-');
                            bulbid.shift();
                            let idOfBuld = $(bulbDiv).last().attr('id').split('-');
                            idOfBuld.shift();
                            if (idOfBuld.join('-') === bulbid.join('-')) {
                                userTabActive();
                                scrollToEle(`automationSuggestions-${idOfBuld.join('-')}`)
                            } else {
                                userTabActive();
                                let theElement= `automationSuggestions-${bulbid.join('-')}`;
                                scrollToEle(theElement);
                                // document.getElementById('showHistory').click();
                            }
                            $(`#scriptContainer #buldCount-${bulbid.join('-')}`).removeClass('buld-count-utt').addClass('buld-count-utt-after-click');
                            $(`#scriptContainer #buldCountNumber-${bulbid.join('-')}`).html(`<span>&#10003;</span>`);
                        }

                        if(target.id === 'summarySubmit'){
                            let data = JSON.parse(target.dataset?.summary);
                            let editedSummaryText =  $(`#summaryText`).val();
                            if(data?.summary != ''){
                                data['summary'][0]['summary_text'] = editedSummaryText;
                            }else{
                                data['summary'] = [];
                                data['summary'].push({'summary_text': editedSummaryText});
                            }
                            var message = {
                                name: "agentAssist.conversation_summary",
                                conversationId: _conversationId,
                                payload: data
                                };
                            window.parent.postMessage(message, '*');
                            $(`#summary`).addClass('hide');
                        }

                        if(target.id.split('-').includes('autoResult')){
                            $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            $('#overLayAutoSearch').html('');
                            $('.search-block').find('.search-results-text-in-lib')?.remove();
                            $('#agentSearch').val(target.innerHTML);
                            agentSearchVal = target.innerHTML;
                            document.getElementById("loader").style.display = "block";
                            AgentAssistPubSub.publish('searched_Automation_details', { conversationId: _conversationId, botId: _botId, value: target.innerHTML, isSearch: true, "positionId": evt.target.dataset.positionId });
                        }

                        if(target.id.split('-').includes('autoResultLib')){
                            $('#librarySearch').val(target.innerHTML);
                            $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            $('#overLayAutoSearch').html('');
                            $('.search-block').find('.search-results-text-in-lib')?.remove();
                            document.getElementById("loader").style.display = "block";
                            AgentAssistPubSub.publish('searched_Automation_details', { conversationId: _conversationId, botId: _botId, value: target.innerHTML, isSearch: true, "positionId": evt.target.dataset.positionId });
                        }
                    })
                    
                    document.addEventListener("keyup", 
                    (evt) => {
                        var target = evt.target;
                        if (target.dataset.isentityValues) {
                            let targetid = target.id.split('-');
                            evt.target.dataset.eachvalue = $(`#${target.id}`).val();
                            entitiestValueArray[targetid[1]]['editedValue'] = $(`#${target.id}`).val();
                            $('.ast-check-right.disabled-color').removeClass('disabled-color');
                            $('.save-reset-disabled').removeClass('save-reset-disabled').addClass('save-reset');
                        } else if (target.dataset.feedbackComment) {
                            let targetids = target.id.split('-');
                            targetids.shift();
                            let dataSets = $(`#feedbackdown-${targetids.join('-')} .ast-thumbdown`).data();
                            dataSets.comment = target.value;
                            
                            if (target.value.length > 0) {
                                $(`#feedbackHelpfulContainer-${targetids.join('-')} .submit-btn`).removeAttr('disabled');
                                $(`#feedbackHelpfulContainer-${targetids.join('-')} .title-improve`).addClass('hide');
                            }
                            $(`#feedbackHelpfulContainer-${targetids.join('-')} .input-block-optional .input-text`).attr('value', target.value);
                            $(`#feedbackdown-${targetids.join('-')} .ast-thumbdown`).attr('data-comment', target.value);
                        } else {
                            var agentAssistInput = target.dataset.agentAssistInput;
                            var mybotInput = target.dataset.mybotInput;
                            let val = $('#agentSearch').val();
                            evt.target.dataset.val = val;
                            if (val == '') {
                                $('#overLaySearch').html('');
                                $('.overlay-suggestions').addClass('hide').removeAttr('style');
                                $('#overLayAutoSearch').find('.search-results-text')?.remove();
                                $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                            }
                            $('#searchResults').addClass('hide');
                            typeAHead(evt, val== ''? true: false);
                            
                            
                            if (agentAssistInput || mybotInput) {
                                AgentAssist_input_keydown(evt);
                            }
                        }

                    }
                    )
                    window._agentAssisteventListenerAdded = true;
                }

                function typeAHeadDeBounce(func, timeout = 300){
                  let delay;
                  return function(...args){
                    clearTimeout(delay);
                    delay = setTimeout(()=>{
                       func.apply(this, args);
                    }, timeout)
                  }
                }

                function getAutoSearchApiResult(e){
                    console.log(arguments[1],"this","get in auto search api", e)
                    let payload = {
                        "query": e.target.value,
                        "maxNumOfResults": 3,
                        "lang": "en"
                    }
                    let isLibraryTab = arguments[1];
                    $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
                    $('#overLayAutoSearch').find('.search-results-text')?.remove();
                    $('.search-block').find('.search-results-text-in-lib')?.remove();
                    if (e.target.value.length > 0) {                       
                        $.ajax({
                            url: `${connectionDetails.envinormentUrl}/agentassist/api/v1/searchaccounts/autosearch?botId=${_botId}`,
                            type: 'post',
                            data: payload,
                            dataType: 'json',
                            success: function (data) {
                                if (!isLibraryTab && data.typeAheads.length>0) {
                                    addAutoSuggestionApi(data);
                                } else {
                                    if(data.typeAheads.length>0){
                                        console.log("came hee to else condition of autpo librqaruy")
                                        addAutoSuggestionTolibrary(data);
                                    }
                                }
                            },
                            error: function (err) {
                                console.error("auto search api failed");
                            }
                        });
                    }
                }

                function addAutoSuggestionTolibrary(data){
                    let autoDiv = $('.search-block');
                    data.typeAheads?.forEach((ele) => {
                        autoDiv.append(`<div class="search-results-text-in-lib" id="autoResultLib-${ele}">${ele}</div>`)
                    })
                    
                }

                function addAutoSuggestionApi(data){
                    $('#overLayAutoSearchDiv').removeClass('hide').attr('style', 'bottom:0; display:block');
                    let autoDiv = $('#overLayAutoSearch');
                    data.typeAheads?.forEach((ele) => {
                        autoDiv.append(`<div class="search-results-text" style="cursor: pointer;" id="autoResult-${ele}">${ele}</div>`)
                    })
                    
                }
                
                function runDialogFormyBotTab(data, idTarget){
                    if(data?.payload){
                     data = data.payload.info;
                    }
                    var dialogId = 'dg-' + (Math.random() + 1).toString(36).substring(2);
                    myBotDialogPositionId = dialogId;
                    AgentAssistPubSub.publish('searched_Automation_details', { conversationId: data.convId, botId: data.botId, value: data.intentName, isSearch: false, intentName: data.intentName, "positionId": myBotDialogPositionId });
                    isMyBotAutomationOnGoing = true;
                    noAutomationrunninginMyBot = false;
                    let agentBotuuids = Math.floor(Math.random() * 100);
                    myBotDropdownHeaderUuids = agentBotuuids;
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if (appState[_conversationId]) {
                        appState[_conversationId]['automationGoingOnAfterRefreshMyBot'] = isMyBotAutomationOnGoing
                        localStorage.setItem('agentAssistState', JSON.stringify(appState))
                    }
                    $('#noAutoRunning').addClass('hide');
                    
                    _createRunTemplateContainerForMyTab(agentBotuuids, data.intentName, myBotDialogPositionId)
                    let ids = idTarget.split('-');
                    $(`${!data?.runMybot}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
                        let id = ele.id?.split('-');
                        if (ids.includes(id[1])) {
                            idsOfMyBotDropDown = ele.id;
                        }
                    });
                    let addRemoveDropDown = document.getElementById(`MyBotaddRemoveDropDown-${agentBotuuids}`);
                    addRemoveDropDown?.classList.remove('hide');
                    $(`#myBotendTaks-${agentBotuuids}`).removeClass('hide')
                    agentTabActive();
                }

                function runDialogForAssistTab(data, idTarget, runInitent){
                    let uuids = koreGenerateUUID();
                    dropdownHeaderUuids = uuids;
                    isAutomationOnGoing = true;
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    if (appState[_conversationId]) {
                        appState[_conversationId].automationGoingOn = isAutomationOnGoing;
                        appState[_conversationId]['automationGoingOnAfterRefresh'] = isAutomationOnGoing
                        localStorage.setItem('agentAssistState', JSON.stringify(appState))
                    }
                    var dialogId = 'dg-' + (Math.random() + 1).toString(36).substring(2);
                    dialogPositionId = dialogId;
                    if(runInitent){
                        dialogPositionId = data?.positionId;
                    }
                    _createRunTemplateContiner(uuids, data.intentName, dialogPositionId);
                    let ids = idTarget.split('-');
                    ids.shift();
                    let joinedIds = ids.join('-');
                    let dialogID = document.getElementById(`suggestionId-${joinedIds}`);
                    if(dialogID){
                        dialogID.style.borderStyle="solid";
                    }
                    $(`${!data.useCaseList}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
                        let id = ele.id?.split('-');
                        id.shift();
                        if (joinedIds.includes(id.join('-'))) {
                            idsOfDropDown = ele.id;
                            // $(ele).remove()
                        }
                    });

                    let addRemoveDropDown = document.getElementById(`addRemoveDropDown-${uuids}`);
                    addRemoveDropDown?.classList.remove('hide');
                    $(`#endTaks-${uuids}`).removeClass('hide');
                    if(!runInitent) {
                        AgentAssist_run_click(data, dialogPositionId);
                    }
                }

                // Example POST method implementation:
                async function getData(url = '', data = {}) {
                    // document.getElementById("loader").style.display = "block";
                    console.log(result.authorization.token_type);
                    const response = await $.ajax({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Authorization': result.authorization.token_type + ' ' + result.authorization.accessToken
                        }
                    }) // parses JSON response into native JavaScript objects
                    return response;
                }

                function getNewlyAddedElementsHeights() {
                    let newElementsHeight = lastElementBeforeNewMessage.clientHeight;
                    for (let id of newlyAddedIdList) {
                        if (document.getElementById(id)) {
                            newElementsHeight += document.getElementById(id).clientHeight;
                        }
                    }
                    return newElementsHeight;
                }

                function userTabActive() {
                    currentTabActive = 'userAutoIcon';
                    $("#historyData").addClass('hide');
                    $("#historyDataForMyBot").addClass('hide');
                    isShowHistoryEnable = false;
                    console.log('-----> User Automation Tab Active State <-----');
                    // document.getElementById(`history-details-btn`).classList.remove('hide');
                    $('.show-back-recommendation-block').addClass('hide');
                    document.getElementById(`agentAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`transcriptIcon`).classList.remove(`active-tab`);
                    document.getElementById(`searchAutoIcon`).classList.remove('active-tab');
                    document.getElementById('userAutoIcon').classList.add('active-tab');
                    document.getElementById('LibraryContainer').classList.add('hide');
                    document.getElementById('scriptContainer').classList.add('hide');
                    document.getElementById('agentAutoContainer').classList.add('hide');
                    document.getElementById(`dynamicBlock`).classList.remove('hide');
                    document.getElementById(`cust-feeling`).classList.remove('hide');
                    $('.sugestions-info-data').removeClass('hide');
                    $('#bodyContainer').addClass('if-suggestion-search');
                    emptySearchBarDuringTabShift();
                    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
                    if (automationSuggestions.length >= 1 && $('#dynamicBlock .dialog-task-run-sec').length <= 0) {
                        automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                    }
                    let dialogs = $(`#dynamicBlock .dialog-task-run-sec`);
                    dialogs?.each(function (i, ele) {
                        $('#dynamicBlock .agent-utt-info').each((i, elem) => {
                            let ids = elem.id?.split('-');
                            ids.shift();
                            let taskIds = ele.id.split('-');
                            taskIds.shift();

                            if (taskIds.join('-').includes(ids.join('-'))) {
                                $(elem).removeClass('hide');
                                $(ele).removeClass('hide');
                            } else {
                                // $(elem).addClass('hide')
                            }
                        })
                    });
                    scrollToBottom();
                    updateScrollButton();
                    updateSeeMoreOnAssistTabActive()
                }

                function libraryTabActive() {
                    console.log('-----> Library Tab Active State<-----');
                    currentTabActive = 'searchAutoIcon';
                    if (isShowHistoryEnable) {
                        $("#historyData").addClass('hide');
                        isShowHistoryEnable = false;
                    }
                    if (isShowHistoryEnableForMyBot) {
                        $("#historyDataForMyBot").addClass('hide');
                        isShowHistoryEnableForMyBot = false;
                    }
                    $('.show-back-recommendation-block').addClass('hide');
                    if (searchedVal?.length > 0) {
                        $('#librarySearch').val(searchedVal);
                    }
                    let searchblock = document.getElementById('librarySearch');
                    searchblock.setAttribute('data-conv-id', _agentAssistDataObj.conversationId);
                    searchblock.setAttribute('data-bot-id', _agentAssistDataObj.botId);
                    searchblock.setAttribute('data-agent-assist-input', true)
                    document.getElementById(`userAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`agentAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`transcriptIcon`).classList.remove(`active-tab`);
                    document.getElementById(`searchAutoIcon`).classList.add('active-tab');
                    document.getElementById(`history-details-btn`).classList.add('hide');
                    document.getElementById(`dynamicBlock`).classList.add('hide');
                    document.getElementById('agentAutoContainer').classList.add('hide');
                    document.getElementById('scriptContainer').classList.add('hide');
                    document.getElementById(`cust-feeling`).classList.add('hide');
                    document.getElementById('LibraryContainer').classList.remove('hide');
                    $('.sugestions-info-data').addClass('hide');
                    $('#bodyContainer').removeClass('if-suggestion-search');
                    emptySearchBarDuringTabShift();
                }

                function agentTabActive() {
                    currentTabActive = 'agentAutoIcon';
                    if (isShowHistoryEnable) {
                        $("#historyData").addClass('hide');
                        isShowHistoryEnable = false;
                    }
                    isShowHistoryEnableForMyBot = false;
                    $("#historyDataForMyBot").addClass('hide');
                    $('.show-back-recommendation-block').addClass('hide');
                    console.log('-----> Agent Automation Tab Active State <-----')
                    document.getElementById(`userAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`transcriptIcon`).classList.remove(`active-tab`);
                    document.getElementById(`searchAutoIcon`).classList.remove('active-tab');
                    document.getElementById(`agentAutoIcon`).classList.add(`active-tab`);
                    document.getElementById(`dynamicBlock`).classList.add('hide');
                    document.getElementById('LibraryContainer').classList.add('hide');
                    document.getElementById('agentAutoContainer').classList.remove('hide');
                    document.getElementById(`cust-feeling`).classList.add('hide');
                    document.getElementById('scriptContainer').classList.add('hide');
                    // document.getElementById(`agent-ran-history-details-btn`).classList.remove('hide');
                    $('.sugestions-info-data').removeClass('hide');
                    $('#bodyContainer').addClass('if-suggestion-search');
                    emptySearchBarDuringTabShift();
                    if (!isMyBotAutomationOnGoing && noAutomationrunninginMyBot) {
                        $('#noAutoRunning').removeClass('hide');
                    }
                    let automationSuggestions = $('#agentAutoContainer .dialog-task-accordiaon-info');
                    if (automationSuggestions.length >= 1) {
                        automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                    }
                    scrollToBottom();
                    updateScrollButton();
                }

                function transcriptionTabActive() {
                    currentTabActive = "transcriptIcon";
                    if (isShowHistoryEnable) {
                        $("#historyData").addClass('hide');
                        isShowHistoryEnable = false;
                    }
                    if (isShowHistoryEnableForMyBot) {
                        $("#historyDataForMyBot").addClass('hide');
                        isShowHistoryEnableForMyBot = false;
                    }
                    $('#dynamicBlock .show-back-recommendation-block').addClass('hide');
                    console.log('-----> Transcription Tab Active State <-----')
                    document.getElementById(`userAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`agentAutoIcon`).classList.remove(`active-tab`);
                    document.getElementById(`searchAutoIcon`).classList.remove('active-tab');
                    document.getElementById(`transcriptIcon`).classList.add(`active-tab`);
                    document.getElementById(`dynamicBlock`).classList.add('hide');
                    document.getElementById('agentAutoContainer').classList.add('hide');
                    document.getElementById('LibraryContainer').classList.add('hide');
                    document.getElementById('scriptContainer').classList.remove('hide');
                    document.getElementById(`cust-feeling`).classList.add('hide');
                    document.getElementById(`history-details-btn`).classList.add('hide');
                    $('.sugestions-info-data').removeClass('hide');
                    $('#bodyContainer').addClass('if-suggestion-search');
                    emptySearchBarDuringTabShift();
                }

                function emptySearchBarDuringTabShift() {
                    if (document.getElementById('librarySearch').value.length !== 0) {
                        const agentSearchVal = document.getElementById('librarySearch');
                        agentSearchVal.value = '';
                    }
                    if (document.getElementById('agentSearch').value.length !== 0) {
                        $('#agentSearch').val('');
                    }
                }

                function addUnreadMessageHtml() {
                    if (!scrollAtEnd && numberOfNewMessages) {
                        console.log("inside unread message", newlyAddedIdList);
                        $('.unread-msg').remove();
                        let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
                        <div class="text-dialog-task-end">Unread Messages</div>     
                                   </div>`;
                        UnCollapseDropdownForLastElement(lastElementBeforeNewMessage);

                        for (let i = 0; i < newlyAddedIdList.length; i++) {
                            if (document.getElementById(newlyAddedIdList[i])) {
                                let elements = document.getElementById(newlyAddedIdList[i]);
                                if(elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions') || elements.id.includes('articleSuggestions'))){
                                    let agentUttInfoId = newlyAddedIdList[i].split('-');
                                    agentUttInfoId.shift();
                                    agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                                    if(document.getElementById(agentUttInfoId)){
                                        elements = document.getElementById(agentUttInfoId);
                                    }
                                    elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
                                }else if(elements.id.includes('stepsrundata') && lastElementBeforeNewMessage.id.includes('stepsrundata')){
                                    elements = document.getElementById(lastElementBeforeNewMessage.id);
                                    elements?.insertAdjacentHTML('afterend', unreadHtml);
                                }
                                break;
                            }
                        }
                    }
                }

                function addFeedbackHtmlToDom(data, botId, userIntentInput, runForAgentBot) {
                    var dropDownData;
                    var endOfDialoge;
                    let headerUUids = runForAgentBot ? myBotDropdownHeaderUuids : dropdownHeaderUuids;
                    let positionID = runForAgentBot ? myBotDialogPositionId : dialogPositionId;
                    // let dialogIds = 'dg-' + (Math.random() + 1).toString(36).substring(2);
                    let taskIdOfDialog = $(`#dropDownData-${dropdownHeaderUuids}`).attr('data-taskId');
                    if (runForAgentBot) {
                        $(`#myBotTerminateAgentDialog-${headerUUids}.btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${headerUUids}`);
                        endOfDialoge = $(`#MyBotaddRemoveDropDown-${headerUUids}`);
                    } else {
                        $(`#addRemoveDropDown-${headerUUids} .btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${headerUUids}`);
                        endOfDialoge = $(`#addRemoveDropDown-${headerUUids}`);
                    }
                    // $(`#addRemoveDropDown-${headerUUids} .btn-danger`).remove();
                    let feedbackHtml = ` 
        <div class="feedback-data last-child-step-run">
        <div class="feedbackup-data" id="feedBackLikeContainer-${headerUUids}">
            <div class="feedback-icon" id="feedbackup-${headerUUids}" data-feedbacklike="false"
            data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="like"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}" data-position-id="${data.positionId}">
                <i class="ast-thumbup" id="feedbackup-${headerUUids}"
                data-feedbacklike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="like"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}" data-position-id="${data.positionId}"></i>
            </div>
            <span class="tootltip-tabs">Like</span>
            </div>
            <div class="feedbackdown-data" id="feedBackDislikeContainer-${headerUUids}">
            <div class="feedback-icon" id="feedbackdown-${headerUUids}" data-feedbackdislike="false" 
            data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="dislike"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}" data-position-id="${data.positionId}">
                <i class="ast-thumbdown" id="feedbackdown-${headerUUids}"
                data-feedbackdislike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="dislike"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}" data-position-id="${data.positionId}"></i>
            </div>
            <span class="tootltip-tabs">Dislike</span>
            </div>
       </div>`;
                    //   dropDownData.append(feedbackHtml);
                    let endofDialogeHtml = `
                    <div class="dilog-task-end" id="endTaks-${headerUUids}">
                    <div class="text-dialog-task-end">Dialog Task ended</div>     
                               </div>
                               <div class="feedback-helpul-container" id="feedbackHelpfulContainer-${headerUUids}">
                                <div class="titles-content">
                                    <div class="title">Helpful?</div>
                                    <div class="btn-positive" id="feedbackup-${headerUUids}">
                                        <i class="ast-thumbup"
                                        id="feedbackup-${headerUUids}"
                                        data-feedbacklike="false"
                                        data-conv-id="${data.conversationId}"
                                        data-bot-id="${botId}" data-feedback="like"
                                        data-dialog-name="${dialogName}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-taskID ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Like</span>
                                    </div>
                                    <div class="btn-negtive" id="feedbackdown-${headerUUids}">
                                        <i class="ast-thumbdown" 
                                        id="feedbackdown-${headerUUids}"
                                        data-feedbackdislike="false"
                                        data-conv-id="${data.conversationId}"
                                        data-bot-id="${botId}" data-feedback="dislike"
                                        data-dialog-name="${dialogName}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-taskID ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Dislike</span>
                                    </div>
                                    <div class="thanks-update hide">Thanks for the feedback!</div>
                                    <div class="help-improve-arrow hide">
                                        <div class="title-improve hide">Help us improve (optional)</div>
                                        <div class="arrow-icon" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBack-${headerUUids}">
                                            <i class="ast-carrotup" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBackIcon-${headerUUids}"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="explore-more-negtive-data hide">
                                    <div class="btns-group-negtive-chips" id="feedBackOptions-${headerUUids}">
                                        <div class="btn-chip-negtive" data-chip-click='false'>Wrong suggestions</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Incorrect intent</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Accidental click</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Time taking</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Other</div>
                                    </div>
                                    <div class="input-block-optional">
                                        <div class="label-text">Additional comments (Optional)</div>
                                        <input type="text" placeholder="Type to add comment" class="input-text" id="feedBackComment-${headerUUids}"
                                        data-feedback-comment="true">
                                    </div>
                                    <button class="submit-btn" data-updateFlag="false"id="feedbackSubmit" disabled>Submit</button>
                                </div>
                            </div>
                        
                    `;
                    if(!document.getElementById('endTaks-' + headerUUids)){
                        endOfDialoge.append(endofDialogeHtml);
                        $(`#overRideDiv-${headerUUids}`).remove();
                    }
                    $(`.customer-feeling-text`).addClass('bottom-95');
                    setTimeout(() => {
                        headerUUids = undefined;
                    }, 100)
                    // headerUUids = undefined;
		    UnCollapseDropdownForLastElement(lastElementBeforeNewMessage);
                }

                function UpdateFeedBackDetails(data, tabName) {
                    if(!tabName){
                        tabName = currentTabActive == 'userAutoIcon'? 'dynamicBlock':'agentAutoContainer';
                    }
                    let allFeedBackDetails = $(`#${tabName} .feedback-helpul-container`);
                    allFeedBackDetails?.each((i, ele) => {
                        let feedDataSet;
                        if (data.feedback == 'dislike') {
                            feedDataSet = $(ele).find('.btn-negtive .ast-thumbdown').data();
                        } else {
                            feedDataSet = $(ele).find('.btn-positive .ast-thumbup').data();
                        }

                        if (feedDataSet.dialogid == data.positionId && data.feedback == 'like') {
                            $(ele).find('.btn-positive').addClass('active-feedback');
                            $(ele).find('.btn-positive .ast-thumbup').addClass('active-feedback');
                            $(ele).find('.thanks-update').removeClass('hide');
                        } else if (feedDataSet.dialogid == data.positionId && data.feedback == 'dislike') {
                            $(ele).find('.btn-negtive').addClass('active-feedback');
                            $(ele).find('.btn-negtive .ast-thumbdown').addClass('active-feedback');
                            $(ele).find('.help-improve-arrow').removeClass('hide')
                            if (data.feedbackDetails.length > 0 || data.comment.length > 0) {
                                $(ele).find('.explore-more-negtive-data').removeClass('hide');
                                let btnChipNegtive = $(ele).find('.btn-chip-negtive');
                                btnChipNegtive.each((i, eles) => {
                                    data.feedbackDetails.includes(eles.innerHTML) ?
                                        $(eles).addClass('active-chip') : '';
                                });
                                $(ele).find('.input-block-optional .input-text').attr('value', data.comment);
                                $(ele).find('.input-block-optional .input-text').val(data.comment);
                                $(ele).find(`.ast-thumbdown`).attr('data-comment',`${data.comment}`)
                                $(ele).find(`.ast-thumbdown`).attr('data-feedbackdetails', data.feedbackDetails)
                                feedDataSet.comment = data.comment;
                                feedDataSet.feedbackdetails = data.feedbackDetails;
                            } else {
                                $(ele).find('.btn-chip-negtive').removeClass('active-chip');
                                $(ele).find('.title-improve').removeClass('hide');
                            }
                        }
                    })
                }

                function feedbackLoop(evt, isSubmit = false) {
                    if (isSubmit) {
                        AgentAssist_feedback_click(evt, true);
                    } else {
                        AgentAssist_feedback_click(evt);
                    }

                }

                function processUserMessage(data, _conversationId, botId) {
                    console.log("AgentAssist >>> processUserMessage", data, _conversationId, botId);

                }

                function loadLibraryOnCancel(list, _convsId, _botId) {
                    processAgentIntentResults(list, _convsId, _botId)
                }

                function AgentAssist_input_keydown(e) {
                    isSuggestionProcessed = true;
                    if (e.target.id == 'librarySearch' || e.target.id == 'agentSearch') {
                        var input_taker = document.getElementById('librarySearch').value;
                        var agent_search = document.getElementById('agentSearch').value;
                        if (input_taker.length > 0) {
                            $('#cancelLibrarySearch').removeClass('hide');
                        } else {
                            $('#cancelLibrarySearch').addClass('hide');
                            processAgentIntentResults(autoExhaustiveList, _conversationId, _botId);
                        }
                        if (agent_search.length > 0) {
                            $('#cancelAgentSearch').removeClass('hide');
                        } else {
                            $('#cancelAgentSearch').addClass('hide');
                        }
                        if (e.target.dataset?.val) {
                            input_taker = ''
                        }
                        if (e.target.id == 'librarySearch' && input_taker.trim().length == 0 && e.target.dataset?.val?.trim().length == 0) {
                            searchedVal = '';
                            processAgentIntentResults(autoExhaustiveList, autoExhaustiveList.conversationId, autoExhaustiveList.botId);
                        }
                        if(e.keyCode == 13 && (input_taker.trim().length <= 0)) {
                            $('.search-block').find('.search-results-text-in-lib').remove();
                        }
                        if (e.keyCode == 13 && (input_taker.trim().length > 0)) {
                            searchedVal = $('#librarySearch').val();
                            updateCurrentTabInState(_conversationId, 'librarySearch');
                            if(!isShowAllClicked){
                                $('#searchResults').addClass('hide');
                                console.log("-------val---is in -librarySearch")
                                typeAHead(e, true);
                            }
                            // agentSearchVal = agent_search;
                            var convId = e.target.dataset.convId;
                            var botId = e.target.dataset.botId;
                            var intentName = input_taker ? input_taker : e.target.dataset.val;
                            if(isShowAllClicked){
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: true });
                                document.getElementById("loader").style.display = "block";
                            }
                            
                            document.getElementById("overLaySearch").style.display = "none";
                        } else if (e.keyCode == 13 && agent_search.trim().length > 0) {
                            agentSearchVal = agent_search;
                            var convId = e.target.dataset.convId;
                            var botId = e.target.dataset.botId;
                            var intentName = input_taker ? input_taker : e.target.dataset.val;
                            AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: true });
                            document.getElementById("loader").style.display = "block";
                            document.getElementById("overLaySearch").style.display = "none";
                        }
                    }
                    if (e.target.id.split('-').includes('agentInput')) {
                        var agentInput;
                        if (currentTabActive == 'userAutoIcon') {
                            agentInput = document.getElementById(e.target.id).value;
                        } else {
                            agentInput = document.getElementById(e.target.id).value;
                        }

                        if (agentInput.trim().length == 0) {
                            console.log('no input, please enter a proper value');
                        }
                        if (e.keyCode == 13 && (agentInput.trim().length > 0)) {
                            let data = {
                                convId: e.target.convId,
                                botId: e.target.botId,
                                entityName: "entered Value",
                                entityValue: agentInput,
                            }
                            console.log(e.target.dataset.val);
                            // agentManualentryMsg(agentInput, e.target.dataset, e.target.dataset.convId, e.target.dataset.botId);
                            var convId = e.target.dataset.convId;
                            var botId = e.target.dataset.botId;
                            var intentName = agentInput
                            if (currentTabActive === 'userAutoIcon') {
                                AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, check: true, "positionId": e.target.dataset.positionId });
                                document.getElementById("loader").style.display = "block";
                            } else {
                             	 isMybotInputResponseClick = true;
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: false, "positionId": e.target.dataset.positionId });
                            }
                        }
                    }


                }

                publicAPIs.getPubSub = function () {
                    return AgentAssistPubSub;
                }

                publicAPIs.sendText = function (value) {
                    AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: _agentAssistDataObj.conversationId, botId: _botId, value: value })
                }

                publicAPIs.runIntent = function (value) {
                    AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: _agentAssistDataObj.conversationId, botId: _botId, value: value, intentName: value })
                }

                $('.body-data-container').scrollTop($('.body-data-container').prop("scrollHeight"));

                return publicAPIs;
           },
            error: function (error) {
                console.error("token is wrong");
                if (error.status === 500) {
                    $(`#${containerId}`).html("Issue identified with the backend services! Please reach out to AgentAssist Admin.")
                } else {
                    $(`#${containerId}`).html("Issue identified in configuration settings! Please reach out to AgentAssist Admin.")
                }
                return false;
            }
        });
    }

    function prepareConversation() {
        $(`#scriptContainer .empty-data-no-agents`).addClass('hide');
    }

    function initializePerfectScrollBarForOverlaySuggestions(container){
        var KRPerfectScrollbar;
        if(window.PerfectScrollbar && typeof PerfectScrollbar ==='function'){
          KRPerfectScrollbar=window.PerfectScrollbar;
          let scrollbar = new KRPerfectScrollbar($(`#${agentContainer}`).find('.suggestion-content').get(0), {
            suppressScrollX: true
          });
        }

    }

    function createAgentAssistContainer(containerId, conversationId, botId, connectionDetails) {
        console.log("AgentAssist >>> finding container ", containerId);
        console.log("AgentAssist >>> userId in createAgentAssistContainer", containerId, conversationId, connectionDetails, botId)
        var container = $(`#${containerId}`);
        container.attr('class', 'agent-assist-chat-container');
        container.addClass('kore-chat-window')
        if (container) {
            console.log("AgentAssist >>> found container", container);
            var cHtml = `<div class="header-top-bar">
            <!-- Header -->
            <div class="header-data hide">
                <div class="main-title">
                    <img src="./images/agentassist_new_logo.svg">
                </div>
                <div class="powerdby">
                    <span>Powered by</span>
                    <img src="./images/kore_new_logo.svg">
                </div>
            </div>
            <!-- Tabs -->
            <div class="tab-toggles-sec">
                <div class="top-tabs-actions">
                    <div class="logo-assist">
                        <img src="./images/logo-agent.svg">
                    </div>
                    <div class="tab-icon hide" id="transcriptIcon">
                        <i class="ast-transcipt font-15" id="scriptIcon"></i>
                        <div class="title-tab" id="transcriptLabel">Transcript</div>
                        <div class="custom-tootltip-tabs">Transcript</div>
                    </div>
                    <div class="tab-icon active-tab" id="userAutoIcon">
                        <i class="ast-bot font-13" id="userBotIcon"></i>
                        <div class="title-tab" id="AssistLabel">Assist</div>
                        <div class="custom-tootltip-tabs">Assist</div>
                    </div>
                    <div class="tab-icon" id="searchAutoIcon">
                        <i class="ast-library font-13" id="searchIcon"></i>
                        <div class="title-tab" id="LibraryLabel">Library</div>
                        <div class="custom-tootltip-tabs">Library</div>
                    </div>
                    <div class="tab-icon" id="agentAutoIcon">
                        <i class="ast-automation font-13" id="agentBotIcon"></i>
                        <div class="title-tab" id="MybotLabel">My Bot</div>
                        <div class="custom-tootltip-tabs">My Bot</div>
                    </div>    
                </div>
                <div class="taoggle-with-text">
                    <div class="t-title">Proactive</div>
                    <label class="kr-sg-toggle">
                        <div class="hover-tooltip">Proactive</div>
                        <input type="checkbox" id="checkProActive" value="YES" checked>
                        <div class="slider"></div>
                    </label>
                </div>
            </div>
        </div>
        <div class="body-data-container if-suggestion-search" id="bodyContainer">
            <div class="dialog-task-data" id="dynamicBlocksData">

                <div class="dynamic-block-content" id="dynamicBlock">
                    <div class="show-history-block hide" id="history-details-btn">
                        <button id="showHistory" class="ghost-btn">Show history</button>
                    </div>
                    <div class="show-back-recommendation-block hide">
                        <button id="backToRecommendation" class="ghost-btn">
                            <span class="back-icon">
                                <i class="ast-carrotup"></i>
                            </span>
                            Back to recommendation
                        </button>
                    </div>
                    <div id="userTab-custSentimentAnalysis" class="customer-feeling-text">
                    </div>

                    <div class="scroll-bottom-show-btn hide">
                        <button class="scroll-bottom-btn">
                            <i class="ast-carrotup"></i>
                            <span>Scroll to bottom</span>
                        </button>
                    </div>

                    <div class="empty-data-no-agents">
                    <div class="title">No Agent automations are in running state.</div>
                    <div class="desc-text">Use "Run with Agent Inputs" to execute.</div>
                       
                    </div>
                </div>
                <div class="dynamic-block-content history hide" id="historyData" style='top: -46px;'></div>
                <div class="agent-body-data-container hide" id="agentAutoContainer">
                    <div class="dynamic-block-content" id="myBotAutomationBlock">
                        <div class="show-history-block hide" id="agent-ran-history-details-btn">
                            <button id="agent-showHistory" class="ghost-btn">Show history</button>
                        </div>
                        <div class="show-back-recommendation-block hide">
                            <button id="agent-backToRecommendation" class="ghost-btn">
                                <span class="back-icon">
                                    <i class="ast-carrotup"></i>
                                </span>
                                Back to recommendation
                            </button>
                        </div>
                        <div id="agentTab-custSentimentAnalysis" class="customer-feeling-text">
                        </div>
                        <div class="scroll-bottom-show-btn hide">
                        <button class="scroll-bottom-btn">
                            <i class="ast-carrotup"></i>
                            <span>Scroll to bottom</span>
                        </button>
                        </div>
                        <div class="empty-data-no-agents hide" id="noAutoRunning">
                            <div class="title">No Agent automations are in running state.</div>
                            <div class="desc-text">Use "Run with Agent Inputs" to execute.</div>
                        </div>
                    </div>
                </div>
                <div class="dynamic-block-content history hide" id="historyDataForMyBot" style='top: -46px;'></div>
                <div class="transcipt-only-calls-data hide" id="scriptContainer">
                <div class="data-contnet"></div>
                <div class="empty-data-no-agents">
                    <div class="title">Voice based utterances from customer and Agent will render on this screen.</div> 
                    </div>
                </div>

                <div class="library-search-data-container hide" id="LibraryContainer">
                    <div class="search-block">
                        <div class="input-text-search library-search-div" id="search-block">
                            <input type="text" placeholder="Ask AgentAssist" class="input-text" id="librarySearch">
                            <i class="ast-search"></i>
                            <i class="ast-close close-search hide" id="cancelLibrarySearch"></i>
                        </div>
                    </div>

                    <div class="show-back-recommendation-block  hide" id="backButton">
                        <button id="backToPreviousTab" class="ghost-btn">
                            <span class="back-icon">
                                <i class="ast-carrotup"></i>
                            </span>
                            Back
                        </button>
                    </div>

                    <div class="dynamic-searchlibrary-data">
                        <div class="empty-library-data hide" id="noLibraryList">
                            <div class="img-block">
                                <img src="./images/emptylibrary.svg">
                            </div>
                            <div class="title-empty">No items found</div>
                            <div class="desc-text">No usecases are configured for the bot.</div>
                        </div>
                        <div id="frequently-exhaustive">
                            <div class="frequently-asked" id="allAutomations-Exhaustivelist">
                            </div>

                        </div>

                        <div class="intent-based-search" id="searchResults">
                            <div id="search-text-display"></div>

                        </div>
                    </div>
                    <div id="dialogs-faqs">
                    </div>
                </div>

            </div>
        </div>
        <div class="sugestions-info-data">
            <input type="text" class="suggestion-input" id="agentSearch" placeholder="Ask AgentAssist">
            <i class="ast-search search-icon"></i>
            <i class="ast-close close-search hide" id="cancelAgentSearch"></i>
        </div>
        
        <div id="loader">
        <img src="./images/loaderNewIcon.png">
        </div>
        <div class="overlay-suggestions hide">
            <div class="suggestion-content" id="overLaySearch">
            </div>
        </div>
        <div class="overlay-suggestions hide" id="overLayAutoSearchDiv">
            <div class="suggestion-content" id="overLayAutoSearch">
            </div>
        </div>

        <div class="overlay-delete-popup hide" id="interruptPopUp">
            <div class="delete-box-content">
                <div class="header-text">You are interrupting the current task</div>
                <div class="close-popup">
                    <i class="ast-close"></i>
                </div>
                <div class="desc-text-info">If you run the select task, the current task will be completely
                    terminated.
                    Are you sure you want to continue with the selected task?</div>
                <div class="btn-footer-info" id="interruptCancel">
                    <button class="btn-danger">Yes, continue</button>
                    <button class="btn-cancel">Cancel</button>
                </div>
            </div>
        </div>

        <div class="overlay-delete-popup hide" id="terminatePopUp">
            <div class="delete-box-content">
                <div class="header-text">You are terminating the current Task?</div>
                <div class="close-popup">
                    <i class="ast-close"></i>
                </div>
                <div class="desc-text-info">Are you sure you want to terminate the dialog task ? If you terminate this task, you cannot continue with this task. To restart, 
                you will have to run this task manually in Library.</div>
                <div class="btn-footer-info">
                    <button class="btn-danger">Yes, Terminate</button>
                    <button class="btn-cancel">Cancel</button>
                </div>
            </div>
        </div>
        <div class="overlay-delete-popup hide" id="restorePopUp">
            <div class="delete-box-content">
                <div class="header-text">Restore Values?</div>
                <div class="close-popup">
                    <i class="ast-close"></i>
                </div>
                <div class="desc-text-info">You made changes to the entity values. Are you sure you want to restore values?</div>
                <div class="btn-footer-info" id="restoreCancel">
                    <button class="btn-restore">Yes, restore</button>
                    <button class="btn-cancel">Cancel</button>
                </div>
            </div>
        </div>

        <div class="overlay-delete-popup hide" id="summary">
            <div class="delete-box-content summary-box-content">
                <div class="header-text summary-header">Desposition</div>
                    <div class="input-block-optional">
                    <div class="label-text">Remarks</div>
                    <textarea class="input-text" id="summaryText" rows="4" cols="50"></textarea>
                </div>
                <button class="submit-btn" id="summarySubmit">Submit</button>
            </div>
        </div>

        <div class="footer-info" id="cust-feeling">
            <div class="event-bucket">
                <img src="./images/bucket.svg">
            </div>
        </div>
        `;
            console.log("AgentAssist >>> adding html")
            // var hrml = `<div>Hello</div>`
            container.append(cHtml);
            initializePerfectScrollBarForOverlaySuggestions(container);
        } else {
            console.log(`AgentAssist >>> container ${containerId} not found`)
        }
    }
}

function AgentAssist_feedback_click(e, isSubmit = false) {
    let convId, botId, feedback, userInput, dialogId, comment, feedbackdetails;
    if (isSubmit) {
        convId = e.convId;
        botId = e.botId;
        feedback = e.feedback;
        userInput = e.userInput;
        dialogName = e.dialogName;
        dialogId = e.dialogid;
        comment = e.comment;
        feedbackdetails = e.feedbackdetails;
        taskId = e.taskid
    } else {
        console.log(e.target);
        convId = e.target.dataset.convId;
        botId = e.target.dataset.botId;
        feedback = e.target.dataset.feedback;
        userInput = e.target.dataset.userInput;
        dialogName = e.target.dataset.dialogName;
        dialogId = e.target.dataset.dialogid;
        comment = e.target.dataset.comment;
        feedbackdetails = e.target.dataset.feedbackdetails;
        taskId = e.target.dataset.taskid
    }

    feedDetailsArray = typeof feedbackdetails == 'string' ? [] : feedbackdetails?.filter(ele => ele !== null);
    AgentAssistPubSub.publish('agent_usage_feedback', {
        comment: comment, feedbackDetails: feedDetailsArray, userInput: userInput, dialogName: dialogName, conversationId: convId, botId: botId, feedback: feedback, eventName: 'agent_usage_feedback', dialogId: dialogId,
        taskId: taskId
    });
}

function AgentAssist_feedBack_Update_Request(e) {
    let agent_assist_feedback_request = {
        conversationId: e.convId,
        agentId: '',
        botId: e.botId,
        orgId: '',
        taskId: e.taskid,
        positionId: e.dialogid,
        'experience': isCallConversation === 'true' ? 'voice':'chat',
        "interactionType": currentTabActive == 'userAutoIcon'? 'assist': 'mybot'
    }

    _agentAsisstSocket.emit('agent_feedback_request', agent_assist_feedback_request);

}

function scrollToBottom() {
    $(window).trigger('resize');
    setTimeout(() => {
        $("#bodyContainer").scrollTop($("#bodyContainer").prop("scrollHeight"));
    }, 10);
}

function AgentAssist_run_click(e, dialogId) {
    scrollToBottom();
    var convId = e.convId;
    var botId = e.botId;
    var intentName = e.intentName;
    dialogName = intentName;

    if (e.check || e.checkLib) {
        AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, check: true, "positionId":dialogId });

    } else {
        //document.getElementById("addRemoveDropDown").style.display = "none";
        AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, intentName: intentName, "positionId":dialogId, 'entities': isRetore ? JSON.parse(previousEntitiesValue) : entitiestValueArray });
        document.getElementById("loader").style.display = "block";
    }
}



(function (root, factory) {
    'use strict';

    var AgentAssistPubSub = {};

    if (root.AgentAssistPubSub) {
        AgentAssistPubSub = root.AgentAssistPubSub;
        console.warn("AgentAssistPubSub already loaded, using existing version");
    } else {
        root.AgentAssistPubSub = AgentAssistPubSub;
        factory(AgentAssistPubSub);
    }
    // CommonJS and Node.js module support
    if (typeof exports === 'object') {
        if (module !== undefined && module.exports) {
            exports = module.exports = AgentAssistPubSub; // Node.js specific `module.exports`
        }
        exports.AgentAssistPubSub = AgentAssistPubSub; // CommonJS module 1.1.1 spec
        module.exports = exports = AgentAssistPubSub; // CommonJS
    }
    // AMD support
    /* eslint-disable no-undef */
    else if (typeof define === 'function' && define.amd) {
        define(function () { return AgentAssistPubSub; });
        /* eslint-enable no-undef */
    }

}((typeof window === 'object' && window) || this, function (AgentAssistPubSub) {
    'use strict';

    var messages = {},
        lastUid = -1,
        ALL_SUBSCRIBING_MSG = '*';

    function hasKeys(obj) {
        var key;

        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a function that throws the passed exception, for use as argument for setTimeout
     * @alias throwException
     * @function
     * @param { Object } ex An Error object
     */
    function throwException(ex) {
        return function reThrowException() {
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions(subscriber, message, data) {
        try {
            subscriber(message, data);
        } catch (ex) {
            setTimeout(throwException(ex), 0);
        }
    }

    function callSubscriberWithImmediateExceptions(subscriber, message, data) {
        subscriber(message, data);
    }

    function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
        var subscribers = messages[matchedMessage],
            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
            s;

        if (!Object.prototype.hasOwnProperty.call(messages, matchedMessage)) {
            return;
        }

        for (s in subscribers) {
            if (Object.prototype.hasOwnProperty.call(subscribers, s)) {
                callSubscriber(subscribers[s], originalMessage, data);
            }
        }
    }

    function createDeliveryFunction(message, data, immediateExceptions) {
        return function deliverNamespaced() {
            var topic = String(message),
                position = topic.lastIndexOf('.');

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while (position !== -1) {
                topic = topic.substr(0, position);
                position = topic.lastIndexOf('.');
                deliverMessage(message, topic, data, immediateExceptions);
            }

            deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
        };
    }

    function hasDirectSubscribersFor(message) {
        var topic = String(message),
            found = Boolean(Object.prototype.hasOwnProperty.call(messages, topic) && hasKeys(messages[topic]));

        return found;
    }

    function messageHasSubscribers(message) {
        var topic = String(message),
            found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),
            position = topic.lastIndexOf('.');

        while (!found && position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf('.');
            found = hasDirectSubscribersFor(topic);
        }

        return found;
    }

    function publish(message, data, sync, immediateExceptions) {
        message = (typeof message === 'symbol') ? message.toString() : message;

        var deliver = createDeliveryFunction(message, data, immediateExceptions),
            hasSubscribers = messageHasSubscribers(message);

        if (!hasSubscribers) {
            return false;
        }

        if (sync === true) {
            deliver();
        } else {
            setTimeout(deliver, 0);
        }
        return true;
    }

    /**
     * Publishes the message, passing the data to it's subscribers
     * @function
     * @alias publish
     * @param { String } message The message to publish
     * @param {} data The data to pass to subscribers
     * @return { Boolean }
     */
    AgentAssistPubSub.publish = function (message, data) {
        return publish(message, data, false, AgentAssistPubSub.immediateExceptions);
    };

    /**
     * Publishes the message synchronously, passing the data to it's subscribers
     * @function
     * @alias publishSync
     * @param { String } message The message to publish
     * @param {} data The data to pass to subscribers
     * @return { Boolean }
     */
    AgentAssistPubSub.publishSync = function (message, data) {
        return publish(message, data, true, AgentAssistPubSub.immediateExceptions);
    };

    /**
     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
     * @function
     * @alias subscribe
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { String }
     */
    AgentAssistPubSub.subscribe = function (message, func) {
        if (typeof func !== 'function') {
            return false;
        }

        message = (typeof message === 'symbol') ? message.toString() : message;

        // message is not registered yet
        if (!Object.prototype.hasOwnProperty.call(messages, message)) {
            messages[message] = {};
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = 'uid_' + String(++lastUid);
        messages[message][token] = func;

        // return token for unsubscribing
        return token;
    };

    AgentAssistPubSub.subscribeAll = function (func) {
        return AgentAssistPubSub.subscribe(ALL_SUBSCRIBING_MSG, func);
    };

    /**
     * Subscribes the passed function to the passed message once
     * @function
     * @alias subscribeOnce
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { AgentAssistPubSub }
     */
    AgentAssistPubSub.subscribeOnce = function (message, func) {
        var token = AgentAssistPubSub.subscribe(message, function () {
            // before func apply, unsubscribe message
            AgentAssistPubSub.unsubscribe(token);
            func.apply(this, arguments);
        });
        return AgentAssistPubSub;
    };

    /**
     * Clears all subscriptions
     * @function
     * @public
     * @alias clearAllSubscriptions
     */
    AgentAssistPubSub.clearAllSubscriptions = function clearAllSubscriptions() {
        messages = {};
    };

    /**
     * Clear subscriptions by the topic
     * @function
     * @public
     * @alias clearAllSubscriptions
     * @return { int }
     */
    AgentAssistPubSub.clearSubscriptions = function clearSubscriptions(topic) {
        var m;
        for (m in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
                delete messages[m];
            }
        }
    };

    /**
     Count subscriptions by the topic
    * @function
    * @public
    * @alias countSubscriptions
    * @return { Array }
    */
    AgentAssistPubSub.countSubscriptions = function countSubscriptions(topic) {
        var m;
        // eslint-disable-next-line no-unused-vars
        var token;
        var count = 0;
        for (m in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
                for (token in messages[m]) {
                    count++;
                }
                break;
            }
        }
        return count;
    };


    /**
     Gets subscriptions by the topic
    * @function
    * @public
    * @alias getSubscriptions
    */
    AgentAssistPubSub.getSubscriptions = function getSubscriptions(topic) {
        var m;
        var list = [];
        for (m in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
                list.push(m);
            }
        }
        return list;
    };

    /**
     * Removes subscriptions
     *
     * - When passed a token, removes a specific subscription.
     *
     * - When passed a function, removes all subscriptions for that function
     *
     * - When passed a topic, removes all subscriptions for that topic (hierarchy)
     * @function
     * @public
     * @alias subscribeOnce
     * @param { String | Function } value A token, function or topic to unsubscribe from
     * @example // Unsubscribing with a token
     * var token = AgentAssistPubSub.subscribe('mytopic', myFunc);
     * AgentAssistPubSub.unsubscribe(token);
     * @example // Unsubscribing with a function
     * AgentAssistPubSub.unsubscribe(myFunc);
     * @example // Unsubscribing from a topic
     * AgentAssistPubSub.unsubscribe('mytopic');
     */
    AgentAssistPubSub.unsubscribe = function (value) {
        var descendantTopicExists = function (topic) {
            var m;
            for (m in messages) {
                if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
                    // a descendant of the topic exists:
                    return true;
                }
            }

            return false;
        },
            isTopic = typeof value === 'string' && (Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value)),
            isToken = !isTopic && typeof value === 'string',
            isFunction = typeof value === 'function',
            result = false,
            m, message, t;

        if (isTopic) {
            AgentAssistPubSub.clearSubscriptions(value);
            return;
        }

        for (m in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m)) {
                message = messages[m];

                if (isToken && message[value]) {
                    delete message[value];
                    result = value;
                    // tokens are unique, so we can just stop here
                    break;
                }

                if (isFunction) {
                    for (t in message) {
                        if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value) {
                            delete message[t];
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    };
}));

function sanitizeHTML(text) {
    // var element = document.createElement('div');
    // element.innerText = text;
    // return element.innerHTML;
    console.log('sanitizeHTML: ',typeof text);
    var lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g;
    value = text?.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
    console.log(value);
    return value;
}

AgentAssistPubSub.subscribe('agent_usage_feedback', (msg, data) => {
    console.log("===== data once the feedback clicked====", data);
    var agent_assist_request = {
        "feedback": data.feedback,
        "botId": data.botId,
        "orgId": "o-1158ce5e-f159-50c6-a198-530f59e2e1d4",
        "accountId": "622efb179b25b1a23ef05da2",
        "conversationId": data.conversationId,
        userInput: data.userInput,
        taskName: data.dialogName,
        "event": data.eventName,
        positionId: data.dialogId,
        taskId: data.taskId,
        comment: data.comment,
        feedbackDetails: data.feedbackDetails,
        'experience': isCallConversation === 'true' ? 'voice':'chat',
        "interactionType": currentTabActive == 'userAutoIcon'? 'assist': 'mybot'
    }
    _agentAsisstSocket.emit('agent_usage_feedback', agent_assist_request);
});


AgentAssistPubSub.subscribe('agent_assist_send_text', (msg, data) => {
    console.log("AgentAssist >>> sending value", data);
    var agent_assist_request = {
        'conversationId': data.conversationId,
        // 'query': data.value,
        'query': sanitizeHTML(data.value),
        'botId': data.botId,
        'agentId': '',
        'experience': isCallConversation === 'true' ? 'voice':'chat',
        'positionId': data.positionId
    }
    if (data.intentName) {
        agent_assist_request['intentName'] = data.value;
    }
    if (data.entities) {
        agent_assist_request['entities'] = data.entities;
    } else {
        agent_assist_request['entities'] = [];
    }
    var agentsss = {
        "type": "currentUser",
        "message": [
            {
                "type": "text",
                "cInfo": {
                    "body": agent_assist_request.intentName ? agent_assist_request.intentName : agent_assist_request.query,
                    "ignoreCheckMark": ''
                },
                "clientMessageId": agent_assist_request.conversationId
            }
        ],
        "createdOn": 1648189648267,
        "createdOnTimemillis": 1648189648267
    }
    _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
    if (!data.check) {
        let contentDisplayDiv = document.getElementById(`dropDownTitle-${dropdownHeaderUuids}`);
        contentDisplayDiv.innerHTML = data.value;
    }

    //AgentChatInitialize.renderMessage(agentsss);
});

// Usecase list request call
AgentAssistPubSub.subscribe('automation_exhaustive_list', (msg, data) => {
    console.log("===== Request data for the Usecase list ====", data);
    var agent_assist_request = {
        "botId": data.botId,
        "conversationId": data.conversationId,
        "experience": data.experience

    }
    _agentAsisstSocket.emit('agent_menu_request', agent_assist_request);
});

// LibrarySearch and Agent Automation tabs related webSockets
// Request
AgentAssistPubSub.subscribe('searched_Automation_details', (msg, data) => {
    console.log("===== Request data for the searched Automation list ====", data);
    let agent_assist_request = {
        'isSearch': data.isSearch,
        'conversationId': data.conversationId,
        // 'query': data.value,
        'query': sanitizeHTML(data.value),
        'botId': data.botId,
        'intentName': data.intentName,
        'experience': isCallConversation === 'true' ? 'voice':'chat',
        'positionId': data?.positionId
    }
    _agentAsisstSocket.emit('agent_assist_agent_request', agent_assist_request);
});
