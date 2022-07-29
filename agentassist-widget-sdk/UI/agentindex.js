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
var answerPlaceableID;
var dialogName;
var currentTabActive;
var previousTabActive;
var AgentChatInitialize;
var chatConfig;
var agentContainer;
var previousResp;
var automationNotRanArray = [];
var jwtToken, isCallConversation;
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
window.AgentAssist = function AgentAssist(containerId, _conversationId, _botId, connectionDetails) {
    console.log('inside agentassist constructor')
    try {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        sourceType = params.source;
        isCallConversation = params.isCall;
        if (sourceType === 'smartassist-color-scheme') {
            $('body').addClass(sourceType);
        } else {
            $('body').addClass('default-color-scheme')
        }
    } catch (err) {
        console.log(err);
    }
    var webSocketConnection = {
        "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket']
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
                chatConfig = window.KoreSDK.chatConfig;
                var koreBot = koreBotChat();
                AgentChatInitialize = new koreBot.chatWindow(chatConfig);
                AgentChatInitialize.customTemplateObj = new customTemplate(chatConfig, AgentChatInitialize);
                let docs = document.getElementById('chat-window-footer');
                docs.hidden = true;
                _userTranscript = false;
                console.log("AgentAssist >>> no of agent assist instances", _agentAssistComponents);
                if (!window._agentAssisteventListenerAdded) {
                    btnInit(containerId);
                    // eventListener for removing the ended currentconversation from the localStorage
                    window.addEventListener("message", function (e) {
                        console.log(e.data);//your data is captured in e.data
                        let currentEndedConversationId = e.data.convsId;
                        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        var appState = JSON.parse(appStateStr);
                        if (appState[currentEndedConversationId]) {
                            delete appState[currentEndedConversationId];
                        }
                    });

                    window.addEventListener("message", function (e) {
                        console.log('event listener message: ', e.data)
                        let userInputData = e.data;
                        let agent_assist_request = {
                            'author': {
                                "firstName": userInputData.author.firstName,
                                "lastName": userInputData.author.lastName,
                                "type": userInputData.author.type
                            },
                            'botId': _botId,
                            'conversationId': userInputData.conversationid,
                            'query': userInputData.value,
                        }
                        if (isCallConversation === 'true') {
                            if (userInputData.author.type === 'USER') {
                                console.log('event listener USER Message:')
                                processTranscriptData(userInputData, userInputData.conversationid, _botId,);
                                _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                            } else {
                                console.log('event listener AGENT Message:')
                                processAgentMessages(userInputData)
                            }
                        } else {
                            if (userInputData.author.type === 'USER') {
                                console.log('event listener AGENT Message:')
                                _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                            }
                        }
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
                    });

                    _agentAsisstSocket.on('agent_assist_response', (data) => {
                        // console.log('event listner message response', data)
                        let shouldProcessResponse = false;
                        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                        var appState = JSON.parse(appStateStr);
                        if (appState[_conversationId]) {
                            // if incoming data belongs to welcome message do nothing
                            if (!data.suggestions && data.buttons?.length > 1) {
                                if (appState[_conversationId].isWelcomeProcessed) {
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
                        updateNumberOfMessages();

                        var overRideObj = {
                            "agentId": "",
                            "botId": _botId,
                            "conversationId": _agentAssistDataObj.conversationId,
                            "query": "",
                            "enable_override_userinput": false
                        }
                        isOverRideMode ? _agentAsisstSocket.emit('enable_override_userinput', overRideObj) : '';
                        isOverRideMode = false;
                        displayCustomerFeels(data, data.conversationId, _botId);

                        updateAgentAssistState(_conversationId, 'assistTab', data);

                        processAgentAssistResponse(data, data.conversationId, _botId);
                        document.getElementById("loader").style.display = "none";
                        // document.getElementById("addRemoveDropDown").style.display = "block";

                    })


                    AgentAssistPubSub.publish('automation_exhaustive_list',
                        { conversationId: _agentAssistDataObj.conversationId, botId: _agentAssistDataObj.botId, 'experience': 'chat' });
                    _agentAsisstSocket.on('user_message', (data) => {
                        // updateNumberOfMessages();
                        processUserMessage(data, data.conversationId, _botId);
                        userMessage = data;
                    });
                    _agentAsisstSocket.on('agent_assist_user_message', (data) => {
                        updateNumberOfMessages();
                      //  updateAgentAssistState(_conversationId, 'assistTab', data);
                        processUserMessages(data, data.conversationId, data.botId);

                    });

                    _agentAsisstSocket.on('user_message', (data) => {
                        isCallConversation === 'true' ? processTranscriptData(data, data.conversationId, data.botId) : '';
                    })

                    _agentAsisstSocket.on('agent_message', (data) => {
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
                        } else {
                          //  updateAgentAssistState(_conversationId, 'myBotTab', data);
                            processMybotDataResponse(data, data.conversationId, data.botId);
                        }
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
                    });
                    const channel = new BroadcastChannel('app-data');
                    channel.addEventListener('message', (event) => {
                        console.log("event recived", event.data);
                        let agent_assist_request = {
                            'conversationId': _agentAssistDataObj.conversationId,
                            'query': event.data.value,
                            'botId': _agentAssistDataObj.botId,
                        }
                        _agentAsisstSocket.emit('agent_assist_request', agent_assist_request);
                    });

                }

                var welcome_message_request = {
                    'waitTime': 2000,
                    'userName': 'test',
                    'id': _agentAssistDataObj.conversationId
                }

                _agentAsisstSocket.emit('welcome_message_request', welcome_message_request);

                if (isCallConversation === 'true') {
                    currentTabActive = 'transcriptIcon';
                    $('#transcriptIcon').removeClass('hide');
                    transcriptionTabActive();
                }

                renderingHistoryMessage();
                
                updateUIState(_conversationId, isCallConversation);
                // var agent_menu_request = {
                //     "botId": _agentAssistDataObj.botId,
                //     "conversationId": _agentAssistDataObj.conversationId,
                //     "experience": "chat"
                // }
                // _agentAsisstSocket.emit('agent_menu_request', agent_menu_request)



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

                    let addUserQueryTodropdownData = document.getElementById(`dropDownData-${dropdownHeaderUuids}`);
                    let userQueryHtml = `
                                    <div class="steps-run-data">
                                        <div class="icon_block_img">
                                            <img src="./images/userIcon.svg">
                                        </div>
                                        <div class="run-info-content" id="userInput-${_id}">
                                            <div class="title">Customer Said - </div>
                                            <div class="agent-utt">
                                                <div class="title-data">${data.userInput}</div>
                                            </div>
                                            
                                        </div>
                                    </div>`;
                    addUserQueryTodropdownData.innerHTML = addUserQueryTodropdownData.innerHTML + userQueryHtml;
                    let entityHtml = $(`#dropDownData-${dropdownHeaderUuids}`).find(`#userInput-${_id}`);
                    if (data.entityValue && !data.isErrorPrompt) {
                        entityHtml.append(`<div class="order-number-info">${data.entityName} : ${data.entityValue}</div>`);
                    } else {
                        if (data.isErrorPrompt) {
                            let entityHtmls = `<div class="order-number-info">${data.entityName} : 
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
                    if (currentTabActive === 'userAutoIcon') {
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
                                            <div class="order-number-info">value : ${agentEntityInput}</div>
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

                    if (data.useCases) {
                        if (data.suggestions) {
                            document.getElementById('allAutomations-Exhaustivelist').classList.remove('hide');
                            $('#dialogs-faqs').removeClass('hide');
                            document.getElementById('searchResults').classList.add('hide');
                            // dialogs body
                            if (data.suggestions.dialogs.length > 0) {

                                let allAutomationSuggestions = document.getElementById(`allAutomations-Exhaustivelist`);
                                let listAreaHtml = `<div class="heading-title">All Automations</div>
                                            <div class="dialog-task-run-sec p-0" >
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


                    if (data.isSearch && !answerPlaceableID) {
                        ShowSearchContent();
                        if (data.value.length > 0 && currentTabActive == 'searchAutoIcon') {
                            document.getElementById('allAutomations-Exhaustivelist').classList.add('hide');
                            $('#dialogs-faqs').addClass('hide');
                        }
                        if (data.suggestions) {
                            isSuggestionProcessed = false;
                            if (currentTabActive == 'searchAutoIcon') {
                                let searchTextDisplay = document.getElementById('search-text-display');
                                html = `<div class="searched-intent" id="librarySearchText">Search results for '${data.userInput}' </div>`
                                searchTextDisplay.innerHTML = html;
                            } else {
                                let dialogsLength = data.suggestions.dialogs?.length || 0;
                                let faqsLength = data.suggestions.faqs?.length || 0;
                                if ((dialogsLength > 0) && (faqsLength > 0)) {
                                    $('#overLaySearch').html(`<div class="search-results-text">${dialogsLength + faqsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                } else if ((dialogsLength > 0) && (faqsLength === 0 || faqsLength === undefined)) {
                                    $('#overLaySearch').html(`<div class="search-results-text">${dialogsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                } else if ((dialogsLength === 0 || dialogsLength === undefined) && (faqsLength > 0)) {
                                    $('#overLaySearch').html(`<div class="search-results-text">${faqsLength} Search results for '${data.userInput}' <span class="show-all hide">Show all</span></div>`)
                                }
                                if ((dialogsLength + faqsLength) > 1) {
                                    $('#overLaySearch').find('.show-all').removeClass('hide');

                                }
                            }

                        } else {
                            if (isSuggestionProcessed) {
                                if (currentTabActive == 'searchAutoIcon') {
                                    let searchTextDisplay = document.getElementById('search-text-display');
                                    html = `<div class="searched-intent" id="librarySearchText">0 Search results for '${data.userInput}' </div>`
                                    searchTextDisplay.innerHTML = html;
                                } else {
                                    $('#overLaySearch').html(`<div class="search-results-text">0 Search results for '${data.userInput}'</div>`)
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
                                                    <div class="type-with-img-title">FAQ/Articles (${data.suggestions.faqs.length})</div>
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

                                let faqHtml = `
                        <div class="type-info-run-send" id="faqDivLib-${uuids+index}">
                            <div class="left-content" id="faqSectionLib-${uuids+index}">
                                <div class="title-text" id="titleLib-${uuids+index}">${ele.question}</div>
                            </div>
                        </div>`;

                                faqsSuggestions.append(faqHtml);
                                let faqs = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${uuids+index}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${uuids+index}`);
                                if (!ele.answer) {
                                    let checkHtml = `
                            <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                            data-bot-id="${botId}" data-intent-name="${ele.question}"
                            data-check-lib="true" id="checkLib-${uuids+index}"></i>`;
                                    faqs.append(checkHtml);
                                } else {
                                    let a = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display #faqDivLib-${uuids+index}`) : $(`#overLaySearch #faqDivLib-${uuids+index}`);
                                    let faqActionHtml = `<div class="action-links">
                            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids+index}"  data-msg-data="${ele.answer}">Send</button>
                            <div class="copy-btn" data-msg-id="${uuids+index}" data-msg-data='${ele.answer}'>
                                <i class="ast-copy" data-msg-id="${uuids+index}" data-msg-data='${ele.answer}'></i>
                            </div>
                        </div>`;
                                    a.append(faqActionHtml);
                                    faqs.append(`<div class="desc-text" id="descLib-${uuids+index}">${ele.answer}</div>`);
                                }
                                if ((ele.question?.length + ele.answer?.length) > 70) {
                                    let faqs = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${uuids+index}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${uuids+index}`);
                                    let seeMoreButtonHtml = `
                              <button class="ghost-btn" style="font-style: italic;" id="seeMore-${uuids+index}" data-see-more="true">Show more</button>
                              <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uuids+index}" data-see-less="true">Show less</button>                  
                              `;
                                    faqs.append(seeMoreButtonHtml);
                                }
                                // _msgsResponse.message.push(body);
                            });

                        }
                    } else {
                        if (data.type === 'text' && data.suggestions) {
                            isSuggestionProcessed = false
                            data.suggestions.faqs.forEach((ele) => {
                                let splitedanswerPlaceableID = answerPlaceableID.split('-');
                                splitedanswerPlaceableID.shift();
                                
                                if(currentTabActive == 'searchAutoIcon'){
                                    let faqAnswerSendMsg =  $(`#search-text-display #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                                    $(faqAnswerSendMsg).attr('data-msg-data',ele.answer);
                                    let faqAnswerCopyMsg =  $(`#search-text-display #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                                    $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
                                }else{
                                    let faqAnswerSendMsg =  $(`#overLaySearch #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                                    $(faqAnswerSendMsg).attr('data-msg-data',ele.answer)
                                    let faqAnswerCopyMsg =  $(`#overLaySearch #faqDivLib-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                                    $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
                                }

                                $(`${currentTabActive == 'searchAutoIcon' ? `#search-text-display #${answerPlaceableID}` : `#overLaySearch #${answerPlaceableID}`}`).html(ele.answer);
                                $(`${currentTabActive == 'searchAutoIcon' ? `#search-text-display #${answerPlaceableID}` : `#overLaySearch #${answerPlaceableID}`}`).attr('data-answer-render', 'true');
                                if ((ele.question?.length + ele.answer?.length) > 70) {
                                    let faqs = currentTabActive == 'searchAutoIcon' ? $(`#search-text-display .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')}`) : $(`#overLaySearch .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')}`);
                                    let seeMoreButtonHtml = `
                          <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true">Show more</button>
                          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true">Show less</button>
                          `;
                                    faqs.append(seeMoreButtonHtml);
                                    $(`#search-text-display .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#search-text-display #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#search-text-display #seeMore-${splitedanswerPlaceableID.join('-')}`).addClass('hide');
                                    $(`#overLaySearch .type-info-run-send #faqSectionLib-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#overLaySearch #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#overLaySearch #seeMore-${splitedanswerPlaceableID.join('-')}`).addClass('hide');
                                }
                            })
                            answerPlaceableID = undefined;

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
                    let myBotuuids = Math.floor(Math.random() * 100);
                    let automationSuggestions = $('#agentAutoContainer .dialog-task-accordiaon-info');
                    for (let ele of automationSuggestions) {
                        ele.classList.add('hide');
                    }
                    if (automationSuggestions.length >= 1) {
                        automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                    }
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
                        let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");

                        if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                            let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                            parsedPayload = JSON.parse(withoutSpecials);
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
                    if (isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited')) {
                        let sendMsgData = encodeURI(JSON.stringify(_msgsResponse));
                        let runInfoContent = $(`#dropDownData-${myBotDropdownHeaderUuids}`);
                        let askToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Ask customer...</div>
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
                        let agentInputToBotHtml = `
            <div class="steps-run-data">
                <div class="icon_block">
                    <i class="ast-agent"></i>
                </div>
                <div class="run-info-content">
                <div class="title">Input</div>
                <div class="agent-utt enter-details-block">
                <div class="title-data" ><span class="enter-details-title">EnterDetails: </span>
                <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${Math.floor(Math.random() * 100)}" data-conv-id="${convId}" data-bot-id="${botId}"  data-mybot-input="true">
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
                    let noOfSteps = $(`.body-data-container #agentAutoContainer`).find('.steps-run-data').not('.hide');
                    if (noOfSteps.length > 2) {
                        $(noOfSteps).addClass('hide');
                        $(noOfSteps[noOfSteps.length - 2]).removeClass('hide');
                        $(noOfSteps[noOfSteps.length - 1]).removeClass('hide');
                    }
                    if (isMyBotAutomationOnGoing && (((data.endOfFaq || data.endOfTask) && data.type !== 'text') || (data.userInput == 'discard all' && data.type !== 'text') || (userMessage && userMessage.value && userMessage.value.includes('discard')))) {
                        isMyBotAutomationOnGoing = false;
                        addFeedbackHtmlToDom(data, botId, userIntentInput, 'runForAgentBot');
                    }
                }

                function updateNumberOfMessages() {
                    numberOfNewMessages += 1;
                    $(".scroll-bottom-btn").addClass("new-messages");
                    $(".scroll-bottom-btn span").text(numberOfNewMessages + ' new');
                    if(numberOfNewMessages == 1){
                        removeWhiteBackgroundToSeenMessages();
                    }
                }

                function addIconClassToNewMessage(){
                    let lastElement = getLastElement('dynamicBlock');
                    let beforeLastElement = document.getElementsByClassName('icon-block');
                    if(beforeLastElement){
                        $(beforeLastElement).removeClass("icon-block");
                    }
                    var iconBlockElements = lastElement.querySelectorAll('.icon_block');
                    for (let i = 0; i < iconBlockElements.length; i++) {
                        let iconElement = iconBlockElements[i];
                        if (i == (iconBlockElements.length - 1)) {
                            $(iconElement).addClass("icon-block");
                        }
                    }
                }

                function removeWhiteBackgroundToSeenMessages(){
                     let beforeLastElementArray = document.querySelectorAll('.last-msg-white-bg');
                    for(let ele of beforeLastElementArray){
                        $(ele).removeClass("last-msg-white-bg");
                    }
                }


                function addWhiteBackgroundClassToNewMessage(){
                    let beforeLastElementArray = document.querySelectorAll('.last-msg-white-bg');
                    for(let ele of beforeLastElementArray){
                        if(ele && scrollAtEnd){
                            $(ele).removeClass("last-msg-white-bg");
                        }
                    }
                    let lastElement = getLastElement('dynamicBlock');
                    $(lastElement).addClass("last-msg-white-bg");
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
                    if(lastElement.nextElementSibling && lastElement.nextElementSibling.className == 'feedback-data'){
                        lastElement.nextElementSibling.classList.add('last-msg-white-bg');
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

                function processAgentAssistResponse(data, convId, botId) {
                    console.log("AgentAssist >>> agentassist_response:", data);
                    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
                    // if (data.suggestions) {
                    //     for (let ele of automationSuggestions) {
                    //         ele.classList.add('hide');
                    //     }
                    //     $('.empty-data-no-agents').addClass('hide');
                    // } else {
                    //     automationSuggestions.length > 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide'), $('.empty-data-no-agents').addClass('hide')) : '';
                    // }

                    let uuids = koreGenerateUUID();
                    responseId = uuids;
                    if (isCallConversation === 'true' && data.suggestions && currentTabActive == 'transcriptIcon') {
                        let buldHtml = `
                        <div class="buld-count-utt" id="buldCount-${uuids}">
                                    <i class="ast-bulb" id="buldCountAst-${uuids}"></i>
                                    <span class="count-number" id="buldCountNumber-${uuids}">${(data.suggestions.dialogs.length || 0) + (data.suggestions.faqs?.length || 0)}</span>
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

                    console.log(isAutomationOnGoing, "is automation on going", data.suggestions, answerPlaceableID)
                    if (!isAutomationOnGoing && data.suggestions && !answerPlaceableID) {
                        // $('#welcomeMsg').addClass('hide');
                        let dynamicBlock = document.getElementById('dynamicBlock');
                        let suggestionsblock = $('#dynamicBlock .dialog-task-run-sec');
                        if (suggestionsblock.length >= 1) {
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
                    <div class="type-with-img-title">FAQ/Articles (${data.suggestions.faqs.length})</div>
                    
                </div>
            </div>`;
                                automationSuggestions.innerHTML += dialogAreaHtml;
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
                                    let checkHtml = `
                        <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-intent-name="${ele.question}"
                        data-check="true" id="check-${uuids+index}"></i>`;
                                    faqs.append(checkHtml);
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
                                }
                                if ((ele.question?.length + ele.answer?.length) > 70) {
                                    let faqs = $(`.type-info-run-send #faqSection-${uuids+index}`);
                                    let seeMoreButtonHtml = `
                          <button class="ghost-btn" style="font-style: italic;" id="seeMore-${uuids+index}" data-see-more="true">Show more</button>
                          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uuids+index}" data-see-less="true">Show less</button>
                          `;
                                    faqs.append(seeMoreButtonHtml);
                                }
                                //  _msgsResponse.message.push(body);
                            })
                        }

                        updateNewMessageUUIDList(responseId);

                    } else {
                        if (data.type === 'text' && data.suggestions) {
                            data.suggestions.faqs.forEach((ele) => {
                               let splitedanswerPlaceableID = answerPlaceableID.split('-');
                               splitedanswerPlaceableID.shift();
                               let faqAnswerSendMsg =  $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
                               $(faqAnswerSendMsg).attr('data-msg-data',ele.answer)
                               let faqAnswerCopyMsg =  $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
                               $(faqAnswerCopyMsg).attr('data-msg-data',ele.answer)
                                $(`#${answerPlaceableID}`).html(ele.answer);
                                $(`#${answerPlaceableID}`).attr('data-answer-render', 'true');
                                if ((ele.question?.length + ele.answer?.length) > 70) {
                                    let faqs = $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')}`);
                                    let seeMoreButtonHtml = `
                          <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true">Show more</button>
                          <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true">Show less</button>
                          `;
                                    faqs.append(seeMoreButtonHtml);
                                    $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} .ast-carrotup.rotate-carrot`).length>0?$(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} #seeMore-${splitedanswerPlaceableID.join('-')}`).removeClass('hide'):$(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')} #seeMore-${splitedanswerPlaceableID.join('-')}`).addClass('hide');
                                }
                            })
                            answerPlaceableID = undefined;
                        }
                        if (data.suggestions) {
                            automationSuggestions.length >= 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide')) : ''
                        }
                    }

                    let parsedPayload;
                    data.buttons?.forEach((elem) => {
                        let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");
                        if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                            let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                            parsedPayload = JSON.parse(withoutSpecials);
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
                    if (isAutomationOnGoing && dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited')) {
                        let msgStringify = JSON.stringify(_msgsResponse);
                        let newTemp = encodeURI(msgStringify);
                        $(`#overRideBtn-${dropdownHeaderUuids}`).removeClass('hide');
                        $(`#cancelOverRideBtn-${dropdownHeaderUuids}`).addClass('hide');
                        $("#inputFieldForAgent").remove();
                        let runInfoContent = $(`#dropDownData-${dropdownHeaderUuids}`);
                        let askToUserHtml = `
            <div class="steps-run-data">
                           <div class="icon_block">
                               <i class="ast-agent"></i>
                           </div>
                           <div class="run-info-content" >
                           <div class="title">Ask customer...</div>
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
                            $('.override-input-div').removeClass('hide');
                            runInfoContent.append(askToUserHtml);
                        } else {
                            $('.override-input-div').addClass('hide');
                            runInfoContent.append(tellToUserHtml);
                        }

                        if (!parsedPayload) {
                            $(runInfoContent).find('.copy-btn').removeClass('hide');
                        }

                    }
                    if (!dropdownHeaderUuids && !parsedPayload && !data.suggestions) {
                        $('#dynamicBlock .empty-data-no-agents').addClass('hide');
                        let dynamicBlockDiv = $('#dynamicBlock');
                        data.buttons?.forEach((ele, i) => {
                            let welcomeMsgHtml = `
                            <div class = "collapse-acc-data" id='smallTalk-${uuids}'>
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
                                    dynamicBlockDiv.append(welcomeMsgHtml);
                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data .run-info-content`);
                                    let contentHtml = `
                                <div class="title">Customer has waited for an agent for few seconds.<br/>Here are some appropriate opening lines.</div>
                                   <div class="agent-utt">
                                    <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                    <div class="action-links">
                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data='${ele.value}'>Send</button>
                                        <div class="copy-btn" data-msg-id="${uuids}" data-msg-data="${ele.value}">
                                            <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${ele.value}"></i>
                                        </div>
                                    </div>
                                </div>`;
                                    runInfoDivOfwelcome.append(contentHtml);
                                } else {
                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data .run-info-content`);
                                    let contentHtmlWithoutTellCus = `
                                    <div class="agent-utt">
                                        <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                        <div class="action-links">
                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data='${ele.value}'>Send</button>
                                            <div class="copy-btn" data-msg-id="${uuids}" data-msg-data='${ele.value}'>
                                                <i class="ast-copy" data-msg-id="${uuids}" data-msg-data='${ele.value}'></i>
                                            </div>
                                        </div>
                                    </div>`;
                                    runInfoDivOfwelcome.append(contentHtmlWithoutTellCus);
                                }
                            } else {
                                let botResHtml = `
                                <div class="collapse-acc-data" id='smallTalk-${uuids}'>
                             <div class="steps-run-data">
                             <div class="icon_block">
                                 <i class="ast-agent"></i>
                             </div>
                             <div class="run-info-content" >
                             <div class="title">Tell Customer</div>
                             <div class="agent-utt">
                                 <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
                                 <div class="action-links">
                                     <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}"  data-msg-data='${ele.value}'>Send</button>
                                     <div class="copy-btn" data-msg-id="${uuids}" data-msg-data='${ele.value}'>
                                         <i class="ast-copy" data-msg-id="${uuids}" data-msg-data='${ele.value}'></i>
                                     </div>
                                 </div>
                             </div>
                             </div>
                         </div>
                         </div>`;
                                dynamicBlockDiv.append(botResHtml)
                            }
                        });
                        updateNewMessageUUIDList(uuids);
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
                        isAutomationOnGoing = false;
                        //  isOverRideMode = false;
                        $('.override-input-div').addClass('hide');
                        addFeedbackHtmlToDom(data, botId, userIntentInput);
                        userMessage = {};
                    }
                    if (scrollAtEnd) {
                        scrollToBottom();
                    }
                    addWhiteBackgroundClassToNewMessage();
                    addIconClassToNewMessage();
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
                                <div class="u-name">${data.author.firstName + data.author.lastName}</div>
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

                function _createRunTemplateContainerForMyTab(agentBotuuids, intentName) {
                    let dynamicBlock = document.getElementById('myBotAutomationBlock');
                    let dropdownHtml = `
                <div class="dialog-task-accordiaon-info hide" id="MyBotaddRemoveDropDown-${agentBotuuids}">
                    <div class="accordion-header" id="dropDownHeader-${agentBotuuids}" data-drop-down-opened="false">
                        <div class="icon-info">
                            <i class="ast-rule"></i>
                        </div>
                        <div class="header-text" id="dropDownTitle-${agentBotuuids}">${intentName}</div>
                        <i class="ast-carrotup"></i>
                        <button class="btn-danger" id="myBotTerminateAgentDialog-${agentBotuuids}">Terminate</button>
                    </div>
                    <div class="collapse-acc-data" id="dropDownData-${agentBotuuids}">


                    </div>
                </div>`;
                    dynamicBlock.innerHTML += dropdownHtml;
                }

                function _createRunTemplateContiner(uuids, intentName) {
                    let dynamicBlock = document.getElementById('dynamicBlock');
                    let dropdownHtml = `
       <div class="dialog-task-accordiaon-info hide" id="addRemoveDropDown-${uuids}" >
           <div class="accordion-header" id="dropDownHeader-${uuids}"
           data-drop-down-opened="false">
               <div class="icon-info">
                   <i class="ast-rule"></i>
               </div>
               <div class="header-text" id="dropDownTitle-${uuids}">${intentName}</div>
               <i class="ast-carrotup"></i>
               <button class="btn-danger" id="terminateAgentDialog">Terminate</button>
           </div>
           <div class="collapse-acc-data" id="dropDownData-${uuids}">
            <div class="override-input-div hide">
            <button class="override-input-btn" id="overRideBtn-${uuids}">Override Input</button>
            <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${uuids}">Cancel Override</button>
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

                function renderingHistoryMessage () {
                    isShowHistoryEnable = true;
                    getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_agentAssistDataObj.botId}/history?convId=${_agentAssistDataObj.conversationId}&agentHistory=false`)
                    .then(response => {

                        document.getElementById("loader").style.display = "none";

                        let previousId;
                        let previousTaskName, currentTaskName;
                        // if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                        //     $(`#historyData .collapse-acc-data.hide`)[$(`#historyData .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyData .show-history-feedback.hide`)[$(`#historyData .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                        //     $(`#historyData .dilog-task-end.hide`)[$(`#historyData .dilog-task-end.hide`).length - 1]?.classList.remove('hide');


                        // } else {
                            let resp = response.length > 0 ? response?.slice(previousResp?.length - 1, response.length) : undefined;
                            resp?.forEach((res, index) => {
                                if (res.type == 'incoming') {
                                    res.components?.forEach((ele) => {
                                        if (ele.data.text == previousTaskName) {
                                            previousTaskName = undefined;
                                            previousId = undefined;
                                            console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                                        }
                                    })
                                }

                                if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing') {
                                    let uniqueID = res._id;
                                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                                    var appState = JSON.parse(appStateStr);
                                    if (!appState[_conversationId]) {
                                        return 
                                    }
                                    var convState = appState[_conversationId];
                                    if (!convState['assistTab']) {return;}
                                    if (!convState['assistTab'].automationsNotRanArray || convState['assistTab'].automationsNotRanArray.length == 0) {
                                      return;
                                    }
                                    let automationsNotRanArray = convState['assistTab'].automationsNotRanArray;
                                        let historyDataHtml = $('#dynamicBlock');
                                        if (automationsNotRanArray.findIndex(ele=>ele.name===res.agentAssistDetails?.userInput)!==-1) {

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
                                <div class="type-with-img-title">FAQ/Articles (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>
                                
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

                                                let faqHtml = `
                                <div class="type-info-run-send" id="faqDiv-${uniqueID}">
                                    <div class="left-content" id="faqSection-${uniqueID}">
                                        <div class="title-text" id="title-${uniqueID}">${ele.question}</div>
                                        
                                        
                                    </div>
                                    
                                </div>`;

                                                faqsSuggestions.innerHTML += faqHtml;
                                                let faqs = $(`.type-info-run-send #faqSection-${uniqueID}`);
                                                if (!ele.answer) {
                                                    let checkHtml = `
                                    <i class="ast-carrotup" data-conv-id="${_agentAssistDataObj.conversationId}"
                                    data-bot-id="${res.botId}" data-intent-name="${ele.question}"
                                    data-check="true" id="check-${uniqueID}"></i>`;
                                                    faqs.append(checkHtml);
                                                } else {
                                                    let a = $(`#faqDiv-${uniqueID}`);
                                                    let faqActionHtml = `<div class="action-links">
                                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID}"  data-msg-data="${ele.answer}">Send</button>
                                    <div class="copy-btn" data-msg-id="${uniqueID}" data-msg-data='${ele.answer}'>
                                        <i class="ast-copy" data-msg-id="${uniqueID}" data-msg-data='${ele.answer}'></i>
                                    </div>
                                </div>`;
                                                    a.append(faqActionHtml);
                                                    faqs.append(`<div class="desc-text" id="desc-${uniqueID}">${ele.answer}</div>`);
                                                }
                                                if ((ele.question?.length + ele.answer?.length) > 70) {
                                                    let faqs = $(`.type-info-run-send #faqSection-${uniqueID}`);
                                                    let seeMoreButtonHtml = `
                                      <button class="ghost-btn" style="font-style: italic;" id="seeMore-${uniqueID}" data-see-more="true">Show more</button>
                                      <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uniqueID}" data-see-less="true">Show less</button>
                                      `;
                                                    faqs.append(seeMoreButtonHtml);
                                                }
                                                uniqueID = undefined;
                                            })
                                        }
                                   // });
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
                                    let historyData = $('#dynamicBlock');
                                    let userInputHtml;
                                    if (res.agentAssistDetails.userInput) {
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
                                                        data-drop-down-opened="false">
                                                            <div class="icon-info">
                                                                <i class="ast-rule"></i>
                                                            </div>
                                                            <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                                                            <i class="ast-carrotup"></i>
                                                        </div>
                                                        <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                            
                                                            
                                                        </div>
                                                        <div class="feedback-data show-history-feedback hide">
                                                            <div class="feedbackup-data">
                                                                <div class="feedback-icon" id="feedbackup">
                                                                    <i class="ast-thumbup" id="feedbackup-${res._id}" data-feedbacklike="false" data-conv-id="${_agentAssistDataObj.conversationId}"data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                                                                </div>
                                                                <span class="tootltip-tabs">Like</span>
                                                            </div>
                                                            <div class="feedbackdown-data">
                                                                <div class="feedback-icon" id="feedbackdown">
                                                                    <i class="ast-thumbdown" id="feedbackdown-${res._id}" data-feedbackdislike="false" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                                                                </div>
                                                                <span class="tootltip-tabs">Dislike</span>
                                                            </div>
                                                        </div>
                                                <div class="dilog-task-end hide" id="endTaks-${res._id}">
                                                <div class="text-dialog-task-end">Dialog Task ended</div>     
                                                            </div>
                                                        </div>
                                                    `;

                                    if (previousTaskName && currentTaskName !== previousTaskName) {
                                        previousId = undefined;
                                    }

                                    if (res.tN && !previousId && previousTaskName !== currentTaskName) {
                                        let divExist = $(`#addRemoveDropDown-${res._id}`);
                                        previousTaskName = currentTaskName;
                                        if (divExist.length >= 1) {
                                            console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                                        } else {
                                            historyData.append(userInputHtml);
                                            historyData.append(dropdownHtml);
                                            previousId = res._id;
                                            previousTaskName = res.tN;
                                        }
                                    }
                                    if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
                                        let runInfoContent = $(`#dropDownData-${previousId}`);
                                        let userQueryHtml = `
                                            <div class="steps-run-data">
                                                <div class="icon_block_img">
                                                    <img src="./images/userIcon.svg">
                                                </div>
                                                <div class="run-info-content" id="userInput-${res._id}">
                                                    <div class="title">Customer Said - </div>
                                                    <div class="agent-utt">
                                                        <div class="title-data">${res.agentAssistDetails.entityValue}</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>`;
                                        runInfoContent.append(userQueryHtml);
                                        let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                                        if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt) {
                                            entityHtml.append(`<div class="order-number-info">${res.agentAssistDetails.entityName} : ${res.agentAssistDetails.entityValue}</div>`);
                                        } else {
                                            if (res.agentAssistDetails.isErrorPrompt) {
                                                let entityHtmls = `<div class="order-number-info">${res.agentAssistDetails.entityName} : 
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
                                    let parsedPayload;
                                    res.components?.forEach((elem) => {
                                        let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                                        if (payloadType.indexOf('payload') !== -1) {
                                            let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                            parsedPayload = JSON.parse(withoutSpecials);
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
                                    let runInfoContent = $(`#dropDownData-${previousId}`);
                                    let askToUserHtml = `
                                        <div class="steps-run-data">
                                                    <div class="icon_block">
                                                        <i class="ast-agent"></i>
                                                    </div>
                                                    <div class="run-info-content" >
                                                    <div class="title">Ask customer...</div>
                                                    <div class="agent-utt">
                                                        <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                        
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
                                                        
                                                    </div>
                                                    </div>
                                                </div>
                                        `;
                                    if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                                        runInfoContent.append(askToUserHtml);
                                    } else {
                                        runInfoContent.append(tellToUserHtml);
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
                                    if (!parsedPayload && !res.tN && !shouldProcessResponse) {
                                        let dynamicBlockDiv = $('#dynamicBlock');
                                        res.components?.forEach((ele, i) => {
                                            let welcomeMsgHtml = `
                                            <div class = "collapse-acc-data" id='smallTalk-${res._id}'>
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
                                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data .run-info-content`);
                                                    let contentHtml = `
                                                <div class="title">Customer has waited for an agent for few seconds.<br/>Here are some appropriate opening lines.</div>
                                                   <div class="agent-utt">
                                                    <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                    <div class="action-links">
                                                        <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data='${ele.data.text}'>Send</button>
                                                        <div class="copy-btn" data-msg-id="${res._id}" data-msg-data="${ele.data.text}">
                                                            <i class="ast-copy" data-msg-id="${res._id}" data-msg-data="${ele.data.text}"></i>
                                                        </div>
                                                    </div>
                                                </div>`;
                                                    runInfoDivOfwelcome.append(contentHtml);
                                                } else {
                                                    let runInfoDivOfwelcome = $(`#dynamicBlock .collapse-acc-data .run-info-content`);
                                                    let contentHtmlWithoutTellCus = `
                                                    <div class="agent-utt">
                                                        <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                        <div class="action-links">
                                                            <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data='${ele.data.text}'>Send</button>
                                                            <div class="copy-btn" data-msg-id="${res._id}" data-msg-data='${ele.data.text}'>
                                                                <i class="ast-copy" data-msg-id="${res._id}" data-msg-data='${ele.data.text}'></i>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                                    runInfoDivOfwelcome.append(contentHtmlWithoutTellCus);
                                                }
                                            } else {
                                                let botResHtml = `
                                                <div class="collapse-acc-data" id='smallTalk-${res._id}'>
                                             <div class="steps-run-data">
                                             <div class="icon_block">
                                                 <i class="ast-agent"></i>
                                             </div>
                                             <div class="run-info-content" >
                                             <div class="title">Tell Customer</div>
                                             <div class="agent-utt">
                                                 <div class="title-data" id="displayData-${res._id}">${ele.data.text}</div>
                                                 <div class="action-links">
                                                     <button class="send-run-btn" id="sendMsg" data-msg-id="${res._id}"  data-msg-data='${ele.data.text}'>Send</button>
                                                     <div class="copy-btn" data-msg-id="${res._id}" data-msg-data='${ele.data.text}'>
                                                         <i class="ast-copy" data-msg-id="${res._id}" data-msg-data='${ele.data.text}'></i>
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
                                    //     <div class="text-dialog-task-end">Dialog Task ended</div>     
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
                    }).catch(err => {
                        document.getElementById("loader").style.display = "block";
                        console.log("error", err)
                    });
                }

                function updateUIState(_convId, _isCallConv) {
                    $('.empty-data-no-agents').addClass('hide')
                    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                    var appState = JSON.parse(appStateStr);
                    var convState = appState[_convId] || {};
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
                            $('#librarySearch').val(convState.libraryTab);
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

                function highLightAndStoreFaqId(evt) {
                    let faqElementId = $(evt.target).parent().parent().attr('id');
                    let faqParentElementId = $(evt.target).parent().parent().parent().attr('id');
                    let storedfaqId = faqParentElementId + '_' + faqElementId;
                    selectedFaqList.push(storedfaqId);
                    document.getElementById(faqElementId).style.borderStyle = "solid";
                    setSentFaqListInStorage(_conversationId, storedfaqId, 'assistTab');
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
                        var paddingTop = 0;
                        if (window.getComputedStyle(elem, null).getPropertyValue('padding-top')) {
                            var paddingTopStr = window.getComputedStyle(elem, null).getPropertyValue('padding-top');
                            if (paddingTopStr.length && paddingTopStr.length - 2) {
                                paddingTopStr = paddingTopStr.substring(0, paddingTopStr.length - 2);
                                paddingTop = parseInt(paddingTopStr) ? parseInt(paddingTopStr) : 0;
                            }
                        }
                        return (childRec.top + paddingTop) > (parentRec.height + parentRec.top);
                    }
                }

                function getLastElement(id) {
                    let lastElement = ''
                    var dynamicBlockElements = document.getElementById(id);
                    if (dynamicBlockElements) {
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
                                        $(node).attr('id', 'steps-run-data-' + lastElement.id + index);
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
                        console.log(numberOfNewMessages, "update new message uuid list");
                        if (numberOfNewMessages) {
                            if (newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
                                newlyAddedMessagesUUIDlist.push(responseId);
                                newlyAddedIdList = getActualRenderedIdList();
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
                                lastElementBeforeNewMessage = getLastElement(id);
                                if (numberOfNewMessages) {
                                    $(".scroll-bottom-btn").addClass("new-messages");
                                    $(".scroll-bottom-btn span").text(numberOfNewMessages + ' new');
                                }else{
                                    $(".scroll-bottom-btn span").text('Scroll Bottom');
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
                            if (removedIdListOnScroll.indexOf(dialogueSuggestionId) == -1) {
                                childIdList.push(dialogueSuggestionId);
                            }
                            if (removedIdListOnScroll.indexOf(faqSuggestionId) == -1) {
                                childIdList.push(faqSuggestionId);
                            }
                        } else {
                            let actualParentId = name + '-' + uuid;
                            if (removedIdListOnScroll.indexOf(actualParentId) == -1) {
                                childIdList.push(actualParentId);
                            }
                        }
                    }
                    return childIdList;
                }

                function scrollToEle(id) {
                    console.log(id, "scroll to ele");
                    var _PanelEle = $('#'+id);
                    if(id.includes('automationSuggestions')){
                        let agentUttInfoId = id.split('-');
                        agentUttInfoId.shift();
                        agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                        if(document.getElementById(agentUttInfoId)){
                            _PanelEle = $('#' + agentUttInfoId);
                        }
                        console.log(agentUttInfoId, "aggent utt info id");
                    }
                    console.log(_PanelEle, "panelement");
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

                function btnInit() {

                    document.querySelector('#bodyContainer').addEventListener('ps-scroll-up', (scrollUpevent) => {
                        lastelement = getLastElement('dynamicBlock');
                        scrollAtEnd = !isScrolledIntoView(lastelement) ? true : false;
                        if (!scrollAtEnd) {
                            $(".scroll-bottom-show-btn").removeClass('hide');
                        }
                    });

                    document.querySelector('#bodyContainer').addEventListener('ps-scroll-down', (scrollDownevent) => {
                        //newly added elements scroll view
                        //get last element call should be before update message count;
                        lastelement = getLastElement('dynamicBlock');
                        updateNewMessageCount(lastelement);
                        scrollAtEnd = !isScrolledIntoView(lastelement) ? true : false;
                        if (scrollAtEnd) {
                            $(".scroll-bottom-show-btn").addClass('hide');
                            $('.unread-msg').remove();
                        }
                    });

                    document.querySelector('#bodyContainer').addEventListener('ps-y-reach-end', (scrollEndevent) => {
                        $(".scroll-bottom-show-btn").addClass('hide');
                        numberOfNewMessages = 0;
                        newlyAddedMessagesUUIDlist = [];
                        newlyAddedIdList = [];
                        removedIdListOnScroll = [];
                        $(".scroll-bottom-btn").removeClass("new-messages");
                        $(".scroll-bottom-btn span").text('Scroll Bottom');
                        scrollAtEnd = true;
                        lastElementBeforeNewMessage = getLastElement('dynamicBlock');
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
                            let newElementsHeight = getNewlyAddedElementsHeights();
                            if (newElementsHeight) {
                                scrollToEle(lastElementBeforeNewMessage.id);

                            } else {
                                scrollToBottom();
                            }
                            // $("#bodyContainer").perfectScrollbar('update');
                            if ($(".scroll-bottom-btn span").text().includes('new')) {
                                console.log(newlyAddedIdList, "id list");
                                // if (!scrollAtEnd && numberOfNewMessages > 0) {
                                //     for (let i = 0; i < newlyAddedIdList.length; i++) {
                                //         if (document.getElementById(newlyAddedIdList[i])) {
                                //             let elements = document.getElementById(newlyAddedIdList[i]);
                                //             elements?.insertAdjacentHTML('beforeBegin', addUnreadMessageHtml());
                                //             break;
                                //         }
                                //     }

                                // }
                            }
                        }

                        if (target.id === 'sendMsg' && sourceType == 'smartassist-color-scheme') {
                            // let ele = document.getElementById(`displayData-${target.dataset.msgId}`)
                            window.parent.postMessage({
                                method: "send",
                                text: target.dataset.msgData
                            }, "*");
                            highLightAndStoreFaqId(evt);
                        } else if (target.id === 'sendMsg' && sourceType == 'salesforce') {
                            let payload = target.dataset.msgData;
                            var message = {
                                name: "agentAssist.SendMessage",
                                conversationId: _conversationId,
                                payload: payload
                            };
                            parent.postMessage(message, '*');
                        }
                        if ((target.className == 'copy-btn' || target.className == 'ast-copy') && sourceType == 'smartassist-color-scheme') {
                            let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
                            window.parent.postMessage({
                                method: "copy",
                                text: target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText)
                            }, "*")
                        } else if ((target.className == 'copy-btn' || target.className == 'ast-copy') && sourceType == 'salesforce') {
                            let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
                            let data = target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText)
                            var message = {
                                name: "agentAssist.CopyMessage",
                                conversationId: _conversationId,
                                payload: data
                            };
                            parent.postMessage(message, '*');
                        }
                        if (target.className == 'ast-close close-search') {
                            $('#agentSearch').val('');
                            $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            $('#overLaySearch').html('');
                            $('#librarySearch').val('');
                            searchedVal = '';
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
                        }

                        if (target.id == 'backToPreviousTab') {
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
                            $("#bodyContainer").scrollTop(0);
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
                            $("#bodyContainer").scrollTop(0)
                            updateCurrentTabInState(_conversationId, 'assistTab')
                            userTabActive();
                            //  updateUIState(_conversationId, isCallConversation);

                        }
                        var seeMoreButton = target.dataset.seeMore;
                        var seeLessButton = target.dataset.seeLess;
                        var checkButton = target.dataset.check;
                        var checkLibButton = target.dataset.checkLib;

                        if (target.className === 'copy-btn') {
                            // Hello();
                        }
                        if (seeMoreButton) {
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
                            faqs.find(`${(currentTabActive == 'userAutoIcon' && $('#agentSearch').val() == '') ? `#desc-${targets.join('-')}` : `#descLib-${targets.join('-')}`}`).attr('style', `overflow: inherit; white-space: normal; text-overflow: unset;`);
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
                white-space: nowrap;
                text-overflow: ellipsis;`);
                            evt.target.classList.add('hide')
                        }
                        let targetIds = (target.id).split('-');
                        if (['feedbackup', 'feedbackdown'].includes(targetIds[0])) {
                            console.log("=====event===============", evt.target);
                            if (targetIds.includes('feedbackup')) {
                                if (target.dataset.feedbacklike == 'false') {
                                    //  target.dataset.feedbacklike = 'true';
                                    ($(target.parentElement.parentElement.parentElement).find('#feedbackdown')?.attr('style')) ? (
                                        $(target.parentElement.parentElement.parentElement).find('#feedbackdown')?.removeAttr('style'),
                                        $(target.parentElement.parentElement).find('.ast-thumbdown').attr('data-feedbackdislike', 'false')) : '';
                                    $(target.parentElement).attr('style', 'color:#0077D2;border-color:#0077D2;');
                                    feedbackLoop(evt);
                                } else {
                                    target.dataset.feedbacklike = 'false';
                                    $(target.parentElement).removeAttr('style');
                                }
                            }
                            if (targetIds.includes('feedbackdown')) {
                                if (target.dataset.feedbackdislike == 'false') {
                                    // target.dataset.feedbackdislike = 'true';
                                    ($(target.parentElement.parentElement.parentElement).find('#feedbackup')?.attr('style')) ? (
                                        $(target.parentElement.parentElement.parentElement).find('#feedbackup')?.removeAttr('style'),
                                        $(target.parentElement.parentElement).find('.ast-thumbup').attr('data-feedbacklike', 'false')) : '';
                                    $(target.parentElement).attr('style', 'color:#0077D2;border-color:#0077D2;');
                                    feedbackLoop(evt);
                                } else {
                                    target.dataset.feedbackdislike = 'false';
                                    $(target.parentElement).removeAttr('style');
                                }
                            }
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
                            //                                 <div class="text-dialog-task-end">Dialog Task ended</div>     
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
                            //                                     <div class="title">Ask customer...</div>
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
                            //                     //     <div class="text-dialog-task-end">Dialog Task ended</div>     
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
                            getData(`${connectionDetails.envinormentUrl}/api/1.1/botmessages/agentassist/${_agentAssistDataObj.botId}/history?convId=${_agentAssistDataObj.conversationId}&agentHistory=true`)
                                .then(response => {
                                    document.getElementById("loader").style.display = "none";
                                    $(`#historyDataForMyBot .collapse-acc-data`)?.addClass('hide');
                                    $(`#historyDataForMyBot .show-history-feedback`)?.addClass('hide');

                                    let previousId;
                                    let previousTaskName, currentTaskName;
                                    if (JSON.stringify(response) === JSON.stringify(previousResp)) {
                                        $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                                        $(`#historyDataForMyBot .show-history-feedback.hide`)[$(`#historyDataForMyBot .show-history-feedback.hide`).length - 1]?.classList.remove('hide');
                                        $(`#historyDataForMyBot .dilog-task-end.hide`)[$(`#historyDataForMyBot .dilog-task-end.hide`).length - 1]?.classList.remove('hide');

                                    } else {
                                        let resp = response.length > 0 ? response?.slice(previousResp?.length - 1, response.length) : undefined;
                                        resp?.forEach((res, index) => {
                                            if (res.type == 'incoming') {
                                                res.components?.forEach((ele) => {
                                                    if (ele.data.text == previousTaskName) {
                                                        previousTaskName = undefined;
                                                        previousId = undefined;
                                                        console.log("xxxxxxxxxxxxxxxxxxxxx incoming task same")
                                                    }
                                                })
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
                                                let historyData = $('#historyDataForMyBot');
                                                let userInputHtml;
                                                if (res.agentAssistDetails.userInput) {
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
                                                                        data-drop-down-opened="false">
                                                                            <div class="icon-info">
                                                                                <i class="ast-rule"></i>
                                                                            </div>
                                                                            <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                                                                            <i class="ast-carrotup"></i>
                                                                        </div>
                                                                        <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                                                            
                                                                            
                                                                        </div>
                                                                        <div class="feedback-data show-history-feedback hide">
                                                                            <div class="feedbackup-data">
                                                                                <div class="feedback-icon" id="feedbackup">
                                                                                    <i class="ast-thumbup" id="feedbackup-${res._id}" data-feedbacklike="false" data-conv-id="${_agentAssistDataObj.conversationId}"data-bot-id="${_agentAssistDataObj.botId}" data-feedback="like" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                                                                                </div>
                                                                                <span class="tootltip-tabs">Like</span>
                                                                            </div>
                                                                            <div class="feedbackdown-data">
                                                                                <div class="feedback-icon" id="feedbackdown">
                                                                                    <i class="ast-thumbdown" id="feedbackdown-${res._id}" data-feedbackdislike="false" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_agentAssistDataObj.botId}" data-feedback="dislike" data-dialog-name="${res.tN}" data-user-input="${res?.agentAssistDetails?.userInput}"></i>
                                                                                </div>
                                                                                <span class="tootltip-tabs">Dislike</span>
                                                                            </div>
                                                                        </div>
                                                                <div class="dilog-task-end hide" id="endTaks-${res._id}">
                                                                <div class="text-dialog-task-end">Dialog Task ended</div>     
                                                                            </div>
                                                                        </div>
                                                                    `;

                                                if (previousTaskName && currentTaskName !== previousTaskName) {
                                                    previousId = undefined;
                                                }

                                                if (res.tN && !previousId && previousTaskName !== currentTaskName) {
                                                    let divExist = $(`#addRemoveDropDown-${res._id}`);
                                                    previousTaskName = currentTaskName;
                                                    if (divExist.length >= 1) {
                                                        console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                                                    } else {
                                                        historyData.append(userInputHtml);
                                                        historyData.append(dropdownHtml);
                                                        previousId = res._id;
                                                        previousTaskName = res.tN;
                                                    }
                                                }
                                                if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
                                                    let runInfoContent = $(`#dropDownData-${previousId}`);
                                                    let userQueryHtml = `
                                                            <div class="steps-run-data">
                                                                <div class="icon_block_img">
                                                                    <img src="./images/userIcon.svg">
                                                                </div>
                                                                <div class="run-info-content" id="userInput-${res._id}">
                                                                    <div class="title">Customer Said - </div>
                                                                    <div class="agent-utt">
                                                                        <div class="title-data">${res.agentAssistDetails.entityValue}</div>
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>`;
                                                    runInfoContent.append(userQueryHtml);
                                                    let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                                                    if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt) {
                                                        entityHtml.append(`<div class="order-number-info">${res.agentAssistDetails.entityName} : ${res.agentAssistDetails.entityValue}</div>`);
                                                    } else {
                                                        if (res.agentAssistDetails.isErrorPrompt) {
                                                            let entityHtmls = `<div class="order-number-info">${res.agentAssistDetails.entityName} : 
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
                                                let parsedPayload;
                                                res.components?.forEach((elem) => {
                                                    let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                                                    if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                                                        let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                                                        parsedPayload = JSON.parse(withoutSpecials);
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
                                                let runInfoContent = $(`#dropDownData-${previousId}`);
                                                let askToUserHtml = `
                                                        <div class="steps-run-data">
                                                                    <div class="icon_block">
                                                                        <i class="ast-agent"></i>
                                                                    </div>
                                                                    <div class="run-info-content" >
                                                                    <div class="title">Ask customer...</div>
                                                                    <div class="agent-utt">
                                                                        <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                                                        
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
                                                                        
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                        `;
                                                if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                                                    runInfoContent.append(askToUserHtml);
                                                } else {
                                                    runInfoContent.append(tellToUserHtml);
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
                                                //     <div class="text-dialog-task-end">Dialog Task ended</div>     
                                                //                </div>

                                                //     `;
                                                //                 endOfDialoge.append(endofDialogeHtml);
                                                //     previousId = undefined;
                                                //     previousTaskName = undefined;
                                                // }

                                            }
                                            if (index == resp.length - 1 || index == 0) {
                                                $(`#historyDataForMyBot .collapse-acc-data.hide`)[$(`#historyDataForMyBot .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
                                            }
                                        });
                                    }
                                    previousResp = response;
                                }).catch(err => {
                                    document.getElementById("loader").style.display = "block";
                                    console.log("error", err)
                                });

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
                            target.innerHTML == 'Terminate' ? $('#terminatePopUp').removeClass('hide') : '';
                            if (target.innerHTML == 'Yes, Terminate') {
                                isTerminateClicked = true;
                                $('#terminatePopUp').addClass('hide');
                                if (currentTabActive == 'userAutoIcon') {
                                    $('#terminateAgentDialog').addClass('hide');
                                    AgentAssistPubSub.publish('agent_assist_send_text',
                                        {
                                            conversationId: _agentAssistDataObj.conversationId,
                                            botId: _botId, value: 'discard all', check: true
                                        });
                                    document.getElementById("loader").style.display = "block";
                                } else {
                                    var mybotTabTerminateBtnId = '#myBotTerminateAgentDialog-' + myBotDropdownHeaderUuids;
                                    $(mybotTabTerminateBtnId).addClass('hide');
                                    AgentAssistPubSub.publish('searched_Automation_details',
                                        { conversationId: _agentAssistDataObj.conversationId, botId: _botId, value: 'discard all', isSearch: false });
                                    document.getElementById("loader").style.display = "block";
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
                        if (target.id.split("-")[0] == 'elipseIcon' || target.id.split("-")[0] == 'overflowIcon') {
                            if ($('.dropdown-content-elipse').length !== 0) {
                                $('.dropdown-content-elipse').addClass('hide');
                            }
                            let elementClicked;
                            if (target.id.split("-")[0] == 'elipseIcon') {
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
                            updateCurrentTabInState(_conversationId, 'myBotTab')
                            $('#agentSearch').val('');
                            $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            $('#overLaySearch').html('')
                            if (!isMyBotAutomationOnGoing) {
                                data = target.dataset;
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: data.convId, botId: data.botId, value: data.intentName, isSearch: false, intentName: data.intentName });
                                isMyBotAutomationOnGoing = true;
                                noAutomationrunninginMyBot = false;
                                let agentBotuuids = Math.floor(Math.random() * 100);
                                myBotDropdownHeaderUuids = agentBotuuids;
                                $('#noAutoRunning').addClass('hide');
                                _createRunTemplateContainerForMyTab(agentBotuuids, target.dataset.intentName)
                                let ids = target.id.split('-');
                                $(`${!target?.dataset?.runMybot}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
                                    let id = ele.id?.split('-');
                                    if (ids.includes(id[1])) {
                                        idsOfMyBotDropDown = ele.id;
                                        $(ele).remove()
                                    }
                                });
                                let addRemoveDropDown = document.getElementById(`MyBotaddRemoveDropDown-${agentBotuuids}`);
                                addRemoveDropDown?.classList.remove('hide');
                                $(`#myBotendTaks-${agentBotuuids}`).removeClass('hide')
                                agentTabActive();
                                return;
                            } else if (isMyBotAutomationOnGoing && !noAutomationrunninginMyBot) {
                                // condition for if an automation is already running in the agent automation
                                $('#interruptPopUp').removeClass('hide');
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
                                    updateCurrentTabInState(_conversationId, 'assistTab')
                                    $('.empty-data-no-agents').addClass('hide');
                                    $('#agentSearch').val('');
                                    $('.overlay-suggestions').addClass('hide').removeAttr('style');
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

                                let uuids = koreGenerateUUID();
                                dropdownHeaderUuids = uuids;
                                isAutomationOnGoing = true;
                                // for (let a of $('#dynamicBlock .agent-utt-info')) {
                                //     a.classList.add('hide');
                                // }
                                // let suggestionsLength = $(`#dynamicBlock .dialog-task-run-sec`);
                                // suggestionsLength.each((i, ele) => {
                                //     $(ele).addClass('hide');
                                // })
                                
                                _createRunTemplateContiner(uuids, target.dataset.intentName);
                                let ids = target.id.split('-');
                                ids.shift();
                                let joinedIds = ids.join('-');
                                let dialogID = document.getElementById(`suggestionId-${joinedIds}`);
                                if(dialogID){
                                    dialogID.style.borderStyle="solid";
                                }
                                $(`${!target?.dataset?.useCaseList}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
                                    let id = ele.id?.split('-');
                                    id.shift();
                                    if (joinedIds.includes(id.join('-'))) {
                                        idsOfDropDown = ele.id;
                                        // $(ele).remove()
                                    }
                                });

                                let addRemoveDropDown = document.getElementById(`addRemoveDropDown-${uuids}`);
                                addRemoveDropDown?.classList.remove('hide');
                                $(`#endTaks-${uuids}`).removeClass('hide')
                                AgentAssist_run_click(evt);
                               

                                // if (libraryRunBtn) {
                                //     let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
                                //     automationSuggestions.each((i, ele) => {
                                //         $(ele).addClass('hide');
                                //     });
                                //     (automationSuggestions.length >= 1 && $('#dynamicBlock .dialog-task-run-sec').length <= 0) ? $(automationSuggestions[automationSuggestions.length - 1]).removeClass('hide') : '';
                                // }
                                return;
                            }
                            else {
                                $('#interruptPopUp').removeClass('hide');
                            }
                        }
                        if (target.id.split('-').includes('overRideBtn')) {
                            let idsss = target.id.split('-');
                            idsss.shift();
                            let id = idsss.join('-')
                            isOverRideMode = true;
                            var overRideObj = {
                                "agentId": "",
                                "botId": _botId,
                                "conversationId": _agentAssistDataObj.conversationId,
                                "query": "",
                                "enable_override_userinput": true
                            }
                            _agentAsisstSocket.emit('enable_override_userinput', overRideObj);
                            let runInfoContent = $(`#dropDownData-${dropdownHeaderUuids}`);
                            let agentInputToBotHtml = `
                <div class="steps-run-data" id="inputFieldForAgent">
                    <div class="icon_block">
                        <i class="ast-agent"></i>
                    </div>
                    <div class="run-info-content">
                    <div class="title">Input overridden. Please provide the input</div>
                    <div class="agent-utt enter-details-block">
                    <div class="title-data" ><span class="enter-details-title">EnterDetails: </span>
                    <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${Math.floor(Math.random() * 100)}" data-conv-id="${_agentAssistDataObj.conversationId}" data-bot-id="${_botId}"  data-mybot-input="true">
                    </div>
                    </div>
                    </div>
                </div>`
                            runInfoContent.append(agentInputToBotHtml);
                            $(`#overRideBtn-${id}`).addClass('hide');
                            $(`#cancelOverRideBtn-${id}`).removeClass('hide');
                            addWhiteBackgroundClassToNewMessage();
                        }
                        if (target.id.split('-').includes('cancelOverRideBtn')) {
                            let idsss = target.id.split('-');
                            idsss.shift();
                            let id = idsss.join('-')
                            isOverRideMode = false;
                            var overRideObj = {
                                "agentId": "",
                                "botId": _botId,
                                "conversationId": _agentAssistDataObj.conversationId,
                                "query": "",
                                "enable_override_userinput": false
                            }
                            _agentAsisstSocket.emit('enable_override_userinput', overRideObj);
                            $(`#overRideBtn-${id}`).removeClass('hide');
                            $(`#cancelOverRideBtn-${id}`).addClass('hide');
                            $('#inputFieldForAgent').remove();
                            addWhiteBackgroundClassToNewMessage();
                        }
                        if (checkButton) {
                            let id = target.id.split('-');
                            id.shift();
                            if (!target.dataset.answerRender) {
                                let faq = $(`#dynamicBlock .type-info-run-send #faqSection-${id.join('-')}`);
                                let answerHtml = `<div class="desc-text" id="desc-${id.join('-')}"></div>`
                                let faqDiv = $(`#dynamicBlock #faqDiv-${id.join('-')}`);
                                let faqaction = `<div class="action-links">
                        <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                        <div class="copy-btn" data-msg-id="${id.join('-')}">
                        <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                        </div>
                        </div>`;
                          let dropDownHtml =` <i class="ast-carrotup" data-conv-id="${_conversationId}"
                          data-bot-id="" data-intent-name=""
                          data-check="true" id="check-${id.join('-')}"></i>`;
                          faq.append(dropDownHtml)
                                faq.append(answerHtml);
                                $(`#dynamicBlock #${target.id}`).attr('data-answer-render', 'false');
                                faqDiv.append(faqaction);
                                answerPlaceableID = `desc-${id.join('-')}`;
                                $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
                                AgentAssist_run_click(evt);
                                return
                            }
                            if ($(`#dynamicBlock .ast-carrotup.rotate-carrot`).length <= 0) {
                                $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
                                $(`#dynamicBlock #faqDiv-${id.join('-')} .action-links`).removeClass('hide');
                                $(`#dynamicBlock #desc-${id.join('-')}`).removeClass('hide');
                                $(`#dynamicBlock #seeMore-${id.join('-')}`).removeClass('hide');
                                $(`#dynamicBlock #seeLess-${id.join('-')}`).addClass('hide');
                            } else {
                                $(`#dynamicBlock #${target.id}`).removeClass('rotate-carrot');
                                $(`#dynamicBlock #faqDiv-${id.join('-')} .action-links`).addClass('hide');
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
                                let faqDiv = $(`#overLaySearch #faqDivLib-${id.join('-')}`);
                                let faqaction = `<div class="action-links">
                    <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                    <div class="copy-btn" data-msg-id="${id.join('-')}">
                        <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                    </div>
                </div>`;
                                faq.append(answerHtml);
                                $(`#overLaySearch #${target.id}`).attr('data-answer-render', 'false');
                                faqDiv.append(faqaction);
                                answerPlaceableID = `descLib-${id.join('-')}`;
                                $(`#overLaySearch #${target.id}`).addClass('rotate-carrot');
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: evt.target.dataset.convId, botId: evt.target.dataset.botId, value: evt.target.dataset.intentName, isSearch: true });
                                return
                            }

                            if ((!target.dataset.answerRender && currentTabActive == 'searchAutoIcon')) {
                                let faq = $(`#search-text-display .type-info-run-send #faqSectionLib-${id.join('-')}`);
                                let answerHtml = `<div class="desc-text" id="descLib-${id.join('-')}"></div>`
                                let faqDiv = $(`#search-text-display #faqDivLib-${id.join('-')}`);
                                let faqaction = `<div class="action-links">
                    <button class="send-run-btn" id="sendMsg" data-msg-id="${id.join('-')}"  data-msg-data="">Send</button>
                    <div class="copy-btn" data-msg-id="${id.join('-')}">
                        <i class="ast-copy" data-msg-id="${id.join('-')}"></i>
                    </div>
                </div>`;
                                faq.append(answerHtml);
                                $(`#search-text-display #${target.id}`).attr('data-answer-render', 'false');
                                faqDiv.append(faqaction);
                                answerPlaceableID = `descLib-${id.join('-')}`;
                                $(`#search-text-display #${target.id}`).addClass('rotate-carrot');
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: evt.target.dataset.convId, botId: evt.target.dataset.botId, value: evt.target.dataset.intentName, isSearch: true });
                                return
                            }
                            if (currentTabActive == 'searchAutoIcon') {
                                if ($(`#search-text-display .ast-carrotup.rotate-carrot`).length <= 0) {
                                    $(`#search-text-display #${target.id}`).addClass('rotate-carrot');
                                    $(`#search-text-display #faqDivLib-${id.join('-')} .action-links`).removeClass('hide');
                                    $(`#search-text-display #descLib-${id.join('-')}`).removeClass('hide');
                                    $(`#search-text-display #seeMore-${id.join('-')}`).removeClass('hide');
                                    $(`#search-text-display #seeLess-${id.join('-')}`).addClass('hide');
                                } else {
                                    $(`#search-text-display #${target.id}`).removeClass('rotate-carrot');
                                    $(`#search-text-display #faqDivLib-${id.join('-')} .action-links`).addClass('hide');
                                    $(`#search-text-display #descLib-${id.join('-')}`).addClass('hide');
                                    $(`#search-text-display #seeMore-${id.join('-')}`).addClass('hide');
                                    $(`#search-text-display #seeLess-${id.join('-')}`).addClass('hide');
                                }
                            } else {
                                if ($(`#overLaySearch .ast-carrotup.rotate-carrot`).length <= 0) {
                                    $(`#overLaySearch #${target.id}`).addClass('rotate-carrot');
                                    $(`#overLaySearch #faqDivLib-${id.join('-')} .action-links`).removeClass('hide');
                                    $(`#overLaySearch #descLib-${id.join('-')}`).removeClass('hide');
                                    $(`#overLaySearch #seeMore-${id.join('-')}`).removeClass('hide');
                                    $(`#overLaySearch #seeLess-${id.join('-')}`).addClass('hide');
                                } else {
                                    $(`#overLaySearch #${target.id}`).removeClass('rotate-carrot');
                                    $(`#overLaySearch #faqDivLib-${id.join('-')} .action-links`).addClass('hide');
                                    $(`#overLaySearch #descLib-${id.join('-')}`).addClass('hide');
                                    $(`#overLaySearch #seeMore-${id.join('-')}`).addClass('hide');
                                    $(`#overLaySearch #seeLess-${id.join('-')}`).addClass('hide');
                                }
                            }
                        }

                        if (target.id.split('-')[0] === 'dropDownHeader' || target.id.split('-')[0] === 'dropDownTitle') {
                            let targetIDs = (target.id).split('-');
                            targetIDs.shift();
                            let targetsss = targetIDs.join('-');
                            if (!isShowHistoryEnable && !isShowHistoryEnableForMyBot) {
                                if (target.dataset.dropDownOpened === 'false') {
                                    $(`#${target.id}`).attr('data-drop-down-opened', 'true');
                                    $(`#dropDownData-${targetsss}`).addClass('hide');
                                    $(`#${target.parentElement.parentElement.id}`).find(`.dilog-task-end`).addClass('hide');
                                } else {
                                    $(`#${target.id}`).attr('data-drop-down-opened', 'false');
                                    $(`#dropDownData-${targetsss}`).removeClass('hide');
                                    $(`#${target.parentElement.parentElement.id}`).find(`.dilog-task-end`).removeClass('hide');
                                }
                            }
                            if (isShowHistoryEnable || isShowHistoryEnableForMyBot) {
                                let a = $(` #dropDownData-${targetsss}`);
                                let b = $(` #addRemoveDropDown-${targetsss}`).find('.show-history-feedback ');
                                a.each(function (i, ele) {
                                    let eleID = $(ele).attr('id').split('-');
                                    eleID.shift();
                                    let joinedID = eleID.join('-');
                                    if (!$(ele).attr('class').includes('hide')) {
                                        targetsss.includes(joinedID) ? ele.classList.add('hide') : '';
                                        b.length > 0 ? targetsss.includes(joinedID) ? b[i].classList.add('hide') : '' : '';
                                    } else {
                                        targetsss.includes(joinedID) ? ele.classList.remove('hide') : '';
                                        b.length > 0 ? targetsss.includes(joinedID) ? b[i].classList.remove('hide') : '' : '';
                                    }

                                });
                            }
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
                            } else {
                                userTabActive();
                                document.getElementById('showHistory').click();
                            }
                            $(`#scriptContainer #buldCount-${bulbid.join('-')}`).removeClass('buld-count-utt').addClass('buld-count-utt-after-click');
                            $(`#scriptContainer #buldCountNumber-${bulbid.join('-')}`).html(`<span>&#10003;</span>`);
                        }
                    })

                    document.addEventListener("keyup", (evt) => {
                        var target = evt.target;
                        if (target.dataset.isentityValues) {
                            let targetid = target.id.split('-');
                            evt.target.dataset.eachvalue = $(`#${target.id}`).val();
                            entitiestValueArray[targetid[1]]['editedValue'] = $(`#${target.id}`).val();
                            $('.ast-check-right.disabled-color').removeClass('disabled-color');
                            $('.save-reset-disabled').removeClass('save-reset-disabled').addClass('save-reset');
                        } else {
                            var agentAssistInput = target.dataset.agentAssistInput;
                            var mybotInput = target.dataset.mybotInput;
                            let val = $('#agentSearch').val();
                            evt.target.dataset.val = val;
                            if (val == '') {
                                $('#overLaySearch').html('');
                                $('.overlay-suggestions').addClass('hide').removeAttr('style');
                            }
                            if (agentAssistInput || mybotInput) {
                                AgentAssist_input_keydown(evt);
                            }
                        }

                    })
                    window._agentAssisteventListenerAdded = true;
                }

                // Example POST method implementation:
                async function getData(url = '', data = {}) {
                    document.getElementById("loader").style.display = "block";
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
                    console.log(lastElementBeforeNewMessage, "lastElement before new message");
                    let newElementsHeight = lastElementBeforeNewMessage.clientHeight;
                    for (let id of newlyAddedIdList) {
                        if (document.getElementById(id)) {
                            console.log(id, "newly added id list");
                            newElementsHeight += document.getElementById(id).clientHeight;
                        }
                    }
                    return newElementsHeight;
                }

                function userTabActive() {
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

                }

                function libraryTabActive() {
                    console.log('-----> Library Tab Active State<-----');
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

                }

                function agentTabActive() {
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
                    document.getElementById(`agent-ran-history-details-btn`).classList.remove('hide');
                    $('.sugestions-info-data').removeClass('hide');
                    $('#bodyContainer').addClass('if-suggestion-search');
                    emptySearchBarDuringTabShift();
                    if (!isAutomationOnGoing && noAutomationrunninginMyBot) {
                        $('#noAutoRunning').removeClass('hide');
                    }
                    let automationSuggestions = $('#agentAutoContainer .dialog-task-accordiaon-info');
                    if (automationSuggestions.length >= 1) {
                        automationSuggestions[automationSuggestions.length - 1].classList.remove('hide');
                    }

                }

                function transcriptionTabActive() {
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
                }

                function addUnreadMessageHtml() {
                    console.log("outside number of new messages", numberOfNewMessages);
                    console.log(document.getElementsByClassName('unread-msg'), "unread msg");
                    if (!scrollAtEnd && numberOfNewMessages && document.getElementsByClassName('unread-msg').length == 0) {
                        console.log("inside unread message", newlyAddedIdList);
                        // if (document.getElementsByClassName('unread-msg')) {
                        //     $('.unread-msg').remove();
                        // }
                        let unreadHtml = ` <div class="unread-msg">
                        <div class="text-dialog-task-end">Unread Messages</div>     
                                   </div>`;

                        console.log(lastElementBeforeNewMessage, "last element before new message");


                        for (let i = 0; i < newlyAddedIdList.length; i++) {
                            if (document.getElementById(newlyAddedIdList[i])) {
                                let elements = document.getElementById(newlyAddedIdList[i]);
                                if(elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions'))){
                                    let agentUttInfoId = newlyAddedIdList[i].split('-');
                                    agentUttInfoId.shift();
                                    agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
                                    if(document.getElementById(agentUttInfoId)){
                                        elements = document.getElementById(agentUttInfoId);
                                    }
                                }
                                console.log(elements, "elements");
                                elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
                                break;
                            }
                        }
                    }
                }

                function addFeedbackHtmlToDom(data, botId, userIntentInput, runForAgentBot) {
                    var dropDownData;
                    var endOfDialoge;
                    if (runForAgentBot) {
                        $(`#myBotTerminateAgentDialog-${myBotDropdownHeaderUuids}.btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${myBotDropdownHeaderUuids}`);
                        endOfDialoge = $(`#MyBotaddRemoveDropDown-${myBotDropdownHeaderUuids}`);
                    } else {
                        $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                        dropDownData = $(`#dropDownData-${dropdownHeaderUuids}`);
                        endOfDialoge = $(`#addRemoveDropDown-${dropdownHeaderUuids}`);
                    }
                    // $(`#addRemoveDropDown-${dropdownHeaderUuids} .btn-danger`).remove();
                    let feedbackHtml = ` 
        <div class="feedback-data">
        <div class="feedbackup-data">
            <div class="feedback-icon" id="feedbackup">
                <i class="ast-thumbup" id="feedbackup-${dropdownHeaderUuids}"
                data-feedbacklike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="like"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}"></i>
            </div>
            <span class="tootltip-tabs">Like</span>
            </div>
            <div class="feedbackdown-data">
            <div class="feedback-icon" id="feedbackdown">
                <i class="ast-thumbdown" id="feedbackdown-${dropdownHeaderUuids}"
                data-feedbackdislike="false"
                data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-feedback="dislike"
                        data-dialog-name="${dialogName}"
                        data-user-input="${userIntentInput}"></i>
            </div>
            <span class="tootltip-tabs">Dislike</span>
            </div>
       </div>`;
                    dropDownData.append(feedbackHtml);
                    let endofDialogeHtml = `
        <div class="dilog-task-end" id="endTaks-${dropdownHeaderUuids}">
        <div class="text-dialog-task-end">Dialog Task ended</div>     
                   </div>
                   <div class="feedback-helpul-container">
                    <div class="titles-content">
                        <div class="title">Helpful?</div>
                        <div class="btn-positive">
                            <i class="ast-thumbup"></i>
                            <span class="tootltip-tabs">Like</span>
                        </div>
                        <div class="btn-negtive">
                            <i class="ast-thumbdown"></i>
                            <span class="tootltip-tabs">Dislike</span>
                        </div>
                        <div class="thanks-update hide">Thanks for the feedback!</div>
                        <div class="help-improve-arrow">
                            <div class="title-improve">Help us improve (optional)</div>
                            <div class="arrow-icon">
                                <i class="ast-carrotup"></i>
                            </div>
                        </div>
                    </div>
                    <div class="explore-more-negtive-data">
                        <div class="btns-group-negtive-chips">
                            <div class="btn-chip-negtive active-chip">Not enough suggestions</div>
                            <div class="btn-chip-negtive active-chip">Not prompt</div>
                            <div class="btn-chip-negtive">Intent undetected</div>
                            <div class="btn-chip-negtive">Not prompt</div>
                            <div class="btn-chip-negtive">Other</div>
                        </div>
                        <div class="input-block-optional">
                            <div class="label-text"></div>
                            <input type="text" placeholder="Placeholder text" class="input-text">
                        </div>
                        <button class="submit-btn" disabled>Submit</button>
                    </div>
                </div>
            
        `;
                    if(!document.getElementById('endTaks-' + dropdownHeaderUuids)){
                        endOfDialoge.append(endofDialogeHtml);
                    }
                    $(`.customer-feeling-text`).addClass('bottom-95');
                    setTimeout(() => {
                        dropdownHeaderUuids = undefined;
                    }, 100)
                    // dropdownHeaderUuids = undefined;
                }

                function feedbackLoop(evt) {
                    AgentAssist_feedback_click(evt);
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
                        if (e.keyCode == 13 && (input_taker.trim().length > 0)) {
                            searchedVal = $('#librarySearch').val();
                            updateCurrentTabInState(_conversationId, 'librarySearch');
                            // agentSearchVal = agent_search;
                            var convId = e.target.dataset.convId;
                            var botId = e.target.dataset.botId;
                            var intentName = input_taker ? input_taker : e.target.dataset.val;
                            AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: true });
                            document.getElementById("loader").style.display = "block";
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
                            agentManualentryMsg(agentInput, e.target.dataset, e.target.dataset.convId, e.target.dataset.botId);
                            var convId = e.target.dataset.convId;
                            var botId = e.target.dataset.botId;
                            var intentName = agentInput
                            if (currentTabActive === 'userAutoIcon') {
                                AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, check: true });
                                document.getElementById("loader").style.display = "block";
                            } else {
                                AgentAssistPubSub.publish('searched_Automation_details', { conversationId: convId, botId: botId, value: intentName, isSearch: false });
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
                <div class="taoggle-with-text hide">
                    <div class="t-title">Proactive</div>
                    <label class="kr-sg-toggle">
                        <div class="hover-tooltip">Proactive</div>
                        <input id="check1" type="checkbox" checked>
                        <div for="check1" class="slider"></div>
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
                            <span>Scroll Bottom</span>
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
                        <div class="show-history-block" id="agent-ran-history-details-btn">
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
                        <div class="empty-data-no-agents hide" id="noAutoRunning">
                            <div class="title">No Agent automations are in running state.</div>
                            <div class="desc-text">Use "Run with Agent Inputs" to execute.</div>
                        </div>
                    </div>
                </div>
                <div class="dynamic-block-content history hide" id="historyDataForMyBot" style='top: -46px;'></div>
                <div class="transcipt-only-calls-data hide" id="scriptContainer">
                <div class="data-contnet"></div>
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
        <lottie-player autoplay loop mode="normal" src="./images/loader.json" style="width: 100px"></lottie-player>
        </div>
        <div class="overlay-suggestions hide">
            <div class="suggestion-content" id="overLaySearch">
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

        <div class="footer-info" id="cust-feeling">
            <div class="event-bucket">
                <img src="./images/bucket.svg">
            </div>
        </div>
        `;
            console.log("AgentAssist >>> adding html")
            // var hrml = `<div>Hello</div>`
            container.append(cHtml);
        } else {
            console.log(`AgentAssist >>> container ${containerId} not found`)
        }
    }
}

function AgentAssist_feedback_click(e) {
    console.log(e.target);
    var convId = e.target.dataset.convId;
    var botId = e.target.dataset.botId;
    var feedback = e.target.dataset.feedback;
    var userInput = e.target.dataset.userInput;
    var dialogName = e.target.dataset.dialogName;
    var dialogId = 'dg-' + (Math.random() + 1).toString(36).substring(2);
    // var userId = (Math.random() + 1).toString(36).substring(3);
    AgentAssistPubSub.publish('agent_usage_feedback', { userInput: userInput, dialogName: dialogName, conversationId: convId, botId: botId, feedback: feedback, eventName: 'agent_usage_feedback', dialogId: dialogId });
}

function scrollToBottom() {
    setTimeout(() => {
        $("#bodyContainer").scrollTop($("#bodyContainer").prop("scrollHeight"));
    }, 0);
}

function AgentAssist_run_click(e) {
    scrollToBottom();
    var convId = e.target.dataset.convId;
    var botId = e.target.dataset.botId;
    var intentName = e.target.dataset.intentName;
    dialogName = intentName;
    let runbtnId = e.target.id;
    let actualIdArray = runbtnId.split('-');
    actualIdArray.shift();
    let actualId = actualIdArray.join('-');
    let showRunForAgentBtn = 'showRunForAgentBtn-' + actualId;
    if(currentTabActive !== 'searchAutoIcon') {
        $("#" + runbtnId).remove();
        $("#" + showRunForAgentBtn).remove();
    }
   
    if (e.target.dataset.check || e.target.dataset.checkLib) {
        AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, check: true });

    } else {
        //document.getElementById("addRemoveDropDown").style.display = "none";
        AgentAssistPubSub.publish('agent_assist_send_text', { conversationId: convId, botId: botId, value: intentName, intentName: intentName, 'entities': isRetore ? JSON.parse(previousEntitiesValue) : entitiestValueArray });
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

AgentAssistPubSub.subscribe('agent_usage_feedback', (msg, data) => {
    console.log("===== data once the feedback clicked====", data);
    var agent_assist_request = {
        "feedback": data.feedback,
        "botId": data.botId,
        "orgId": "o-1158ce5e-f159-50c6-a198-530f59e2e1d4",
        "accountId": "622efb179b25b1a23ef05da2",
        "conversationId": data.conversationId,
        userInput: data.userInput,
        dialogName: data.dialogName,
        "event": data.eventName,
        dialogId: data.dialogId,
    }
    _agentAsisstSocket.emit('agent_usage_feedback', agent_assist_request);
});


AgentAssistPubSub.subscribe('agent_assist_send_text', (msg, data) => {
    console.log("AgentAssist >>> sending value", data);
    var agent_assist_request = {
        'conversationId': data.conversationId,
        'query': data.value,
        'botId': data.botId,
        'agentId': ''
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
        'query': data.value,
        'botId': data.botId,
        'intentName': data.intentName
    }
    _agentAsisstSocket.emit('agent_assist_agent_request', agent_assist_request);
});

