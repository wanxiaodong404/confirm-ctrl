(() => {
    "use strict";
    var t = {
            602: (t, e, i) => {
                var n;
                i.r(e), i.d(e, {
                        Mode: () => n
                    }),
                    function (t) {
                        t.Async = "async", t.Sync = "sync", t.Delay = "delay", t.Hybrid = "hybrid"
                    }(n || (n = {}))
            }
        },
        e = {};

    function i(n) {
        var o = e[n];
        if (void 0 !== o) return o.exports;
        var r = e[n] = {
            exports: {}
        };
        return t[n](r, r.exports, i), r.exports
    }
    i.d = (t, e) => {
        for (var n in e) i.o(e, n) && !i.o(t, n) && Object.defineProperty(t, n, {
            enumerable: !0,
            get: e[n]
        })
    }, i.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), i.r = t => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, (() => {
        var t;
        ! function (t) {
            t.Normal = "NORMAL", t.Destory = "DESTORY", t.Pause = "PAUSE"
        }(t || (t = {}));
        var e = i(602);

        function n(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function o(t, e) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        var r = function () {
            function i(o) {
                var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    a = arguments.length > 2 ? arguments[2] : void 0;
                n(this, i), this.status = t.Normal, this.payload = null, this.callback = o;
                var s = r.priority,
                    c = void 0 === s ? 0 : s,
                    l = r.mode,
                    u = void 0 === l ? e.Mode.Sync : l,
                    d = r.delay,
                    h = void 0 === d ? 0 : d;
                this.priority = c, this.mode = u, this.delay = h, a && (this.context = a)
            }
            var r, a;
            return r = i, (a = [{
                key: "dispatch",
                value: function () {
                    var t = this,
                        i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                        n = this;
                    return this.mode === e.Mode.Async ? this.timer = new Promise((function (e) {
                        t.callback((function () {
                            var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
                                i = arguments.length > 1 ? arguments[1] : void 0;
                            e(t), n.payload = i
                        }), i)
                    })).catch((function (t) {
                        console.warn(t.message)
                    })) : this.mode === e.Mode.Delay ? this.timer = new Promise((function (e) {
                        setTimeout((function () {
                            e(!0), t.callback()
                        }), t.delay)
                    })).catch((function (t) {
                        return console.warn(t.message), !1
                    })) : void this.callback()
                }
            }, {
                key: "destory",
                value: function () {
                    this.context && this.context.remove(this), this.payload = null, this.timer = null
                }
            }]) && o(r.prototype, a), i
        }();

        function a(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function s(t, e) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        var c = i(602).Mode;
        (function () {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                if (a(this, t), this.stack = [], this.mode = c.Hybrid, this.destroyed = !1, !(this instanceof t)) return new t(e);
                var i = e.mode;
                i && (this.mode = i)
            }
            var e, i;
            return e = t, (i = [{
                key: "trigger",
                value: function (t) {
                    var e, i = this,
                        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    if (this.destroyed) throw Error("flow 已销毁");
                    return t instanceof r ? (e = t).context = this : e = new r(t, n, this), this.stack.push(e), setTimeout((function () {
                        i.dispatch(null)
                    }), 0), e
                }
            }, {
                key: "dispatch",
                value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                    if (this.destroyed) throw Error("flow 已销毁");
                    switch (this.mode) {
                        case c.Async:
                            this.asyncHandle(t);
                            break;
                        case c.Sync:
                            this.syncHandle(t);
                            break;
                        case c.Delay:
                            this.delayHandle(t);
                            break;
                        case c.Hybrid:
                            this.hybridHandle(t);
                            break;
                        default:
                            this.syncHandle(t)
                    }
                }
            }, {
                key: "asyncHandle",
                value: function (t) {
                    var e = this;
                    if (this.active);
                    else {
                        if (!(this.stack.length > 0)) return Promise.resolve();
                        var i = this.active = this.sortStack()[0];
                        i.dispatch(t).then((function (t) {
                            i.destory(), i = null, t ? e.dispatch(i.payload) : e.stack.forEach((function (t) {
                                t.destory()
                            }))
                        }))
                    }
                }
            }, {
                key: "syncHandle",
                value: function (t) {
                    this.stack.sort((function (t, e) {
                        return t.priority - e.priority
                    })).forEach((function (e) {
                        e.dispatch(t), e.destory()
                    }))
                }
            }, {
                key: "delayHandle",
                value: function (t) {
                    this.stack.sort((function (t, e) {
                        return t.priority - e.priority
                    })).forEach((function (e) {
                        setTimeout((function () {
                            e.dispatch(t), e.destory()
                        }), e.delay)
                    }))
                }
            }, {
                key: "hybridHandle",
                value: function (t) {
                    var e = this,
                        i = this.sortStack(),
                        n = !1;
                    i.length > 0 && i.forEach((function (i) {
                        if (n) return !1;
                        switch (console.log(i), i.mode) {
                            case c.Sync:
                                e.active ? n = !0 : (i.dispatch(t), i.destory());
                                break;
                            case c.Async:
                            case c.Delay:
                                e.active ? n = !0 : (e.active = i, i.dispatch(t).then((function (t) {
                                    i.destory(), e.active = null, t && e.dispatch(i.payload)
                                })));
                                break;
                            default:
                                e.active ? n = !0 : (i.dispatch(t), i.destory())
                        }
                    }))
                }
            }, {
                key: "destory",
                value: function () {
                    this.stack.length = 0, this.active = null, this.destroyed = !0
                }
            }, {
                key: "remove",
                value: function (t) {
                    var e = this.stack.indexOf(t);
                    e >= 0 && this.stack.splice(e, 1)
                }
            }, {
                key: "sortStack",
                value: function () {
                    return this.stack.sort((function (t, e) {
                        return e.priority - t.priority
                    })).slice()
                }
            }]) && s(e.prototype, i), t
        }()).Step = r
    })()
})();