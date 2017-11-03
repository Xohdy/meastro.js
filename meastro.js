// ------------------------------------------------------------------
(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("meastro requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
} (typeof window !== "undefined" ? window : this, function (window, noGlobal) {

    var meastro = function (selector) {
        return new meastro.fn.init(selector);
    };

    // essential functions
    meastro.fn = meastro.prototype = {};

    meastro.extend = meastro.fn.extend = function (options) {
        for (name in options) {
            this[name] = options[name];

        }
        return this;
    }

    var init = meastro.fn.init = function (s) {
        if (meastro.isMeastro(s)) {
            return s;
        } else {
            var elems = selector(s);
            return makeMeastroArray(elems, this);
        }

        // return Object.assign(_elem, this);
        //return this;
    };
    function selector(s) {
        var reg = /<([^>]+)>/, tt;
        if (Array.isArray(s)) {
            tt = decomposeMeastro(s);
        } else if (s instanceof HTMLCollection || s instanceof NodeList) {
            tt = s;
        } else if (s instanceof Element) {
            tt = [s];
        } else if (reg.test(s)) {
            tt = [createElement(s)];
        } else if (s === null) {
            tt = null;
        } else if (typeof s === "string") {
            tt = document.querySelectorAll(s);
        }
        return tt;
    }

    function makeMeastroArray(s, context) {
        var arr = [];
        var len = 0;
        if (s)
            for (e in s) {
                if (!isNaN(Number(e))) {
                    context[e] = s[e];
                    len++;
                }
            }

        context.length = len;
        return context;
    }

    function decomposeMeastro(els) {
        var el;
        var r = [], ind = 0;

        for (e in els) {
            el = els[e];
            if (meastro.isMeastro(el)) {
                meastro.each(el, function (i, ee) {
                    r[ind] = ee;
                    ind++;
                });
            } else {
                r[ind] = el;
                ind++;
            }
        }
        return r;
    }

    function createElement(t) {
        var space = /\S+/g;

        t = t.match(space).join(' ') //remove spaces
        var s = t.match(/<([^>]+)>/)[1]; // remove content and end tag

        var tagName = s.match(space)[0] // get tag name
        var el = document.createElement(tagName);

        var content = (/<(\w+).*?>(.*?)<\/\1>/g.exec(t)); // get content
        el.innerHTML = content ? content[2] : "";

        var attrsStr = s.substr(tagName.length, s.length).trim() + " ";

        attrs = attrsStr.match(/\w+\s*\=\s*((\'([^\']+)\')|(\"([^\"]+)\"))/g);

        for (att in attrs) {
            var att = attrs[att]
            var at = att.split('=')
            el.setAttribute(at[0], at[1].substr(1, at[1].length - 2))

        }

        return el;
    }


    init.prototype = meastro.fn;

    meastro.fn.extend({
        each: function (callback) {
            return meastro.each(this, callback);
        },
    });

    /* classes */
    var rnotwhite = (/\S+/g);
    var ClassSpaces = /[\t\r\n\f]/g;
    function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
    }
    function argToClass(ar) {
        var value = [];
        if (ar.length > 1) {
            value = ar;
        } else if (ar.length == 1) {
            value = Array.isArray(ar[0]) ? ar[0] : ar[0].match(rnotwhite);
        }
        return value;
    }
    function showHide(elements, show) {
        var length, index = 0, elm;
        if (meastro.isMeastro(elements)) {
            length = elements.length;
            for (; index < length; index++) {
                elm = elements[index];
                sh(elm);
            }
        } else {
            elm = elements;
            sh(elm);
        }

        function sh(elm) {
            var display = elm.style.display;
            if (show && display === "none") {
                // show this element
                elm.style.display = null;
            } else if (!show && display !== "none") {
                // hide this element
                elm.style.display = "none";
            }
        }

    }
    function isHidden(elem) {
        if (meastro.isMeastro(elem)) {
            return elem.css("display") === "none";
        } else {
            return elem.style.display === "none";
        }
    }
    meastro.fn.extend({
        addClass: function (value) {
            // debugger;
            var elem, cur, clazz, finalValue, j, i = 0;
            classes = argToClass(arguments);
            //classes = Array.isArray(value) ? value : value.match(rnotwhite) || [];
            while ((elem = this[i++])) {
                curValue = getClass(elem);
                cur = (" " + curValue + " ").replace(ClassSpaces, " ");

                j = 0;
                while ((clazz = classes[j++])) {
                    if (cur.indexOf(" " + clazz + " ") < 0) {
                        cur += clazz + " ";
                    }
                }

                finalValue = cur.trim();
                if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                }

            }
            return this;
        },
        removeClass: function (value) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if (!arguments.length) {
                return this.attr("class", "");
            }

            classes = argToClass(arguments);

            while ((elem = this[i++])) {
                curValue = getClass(elem);
                cur = (" " + curValue + " ").replace(ClassSpaces, " ");

                j = 0;
                while ((clazz = classes[j++])) {

                    // Remove *all* instances
                    while (cur.indexOf(" " + clazz + " ") > -1) {
                        cur = cur.replace(" " + clazz + " ", " ");
                    }
                }

                finalValue = cur.trim();
                if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                }

            }

            return this;
        },
        toggleClass: function (value, stateVal) {
            if (isset(stateVal)) {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            var classes = Array.isArray(value) ? value : value.match(rnotwhite) || [];
            return this.each(function () {
                var className, i, self;
                i = 0;
                self = meastro(this);
                while ((className = classes[i++])) {
                    if (self.hasClass(className)) {
                        self.removeClass(className);
                    } else {
                        self.addClass(className);
                    }
                }
            });
        },
        hasClass: function (cls) {
            var className = " " + cls + " ",
                elem,
                i = 0;

            while ((elem = this[i++])) {
                if ((" " + getClass(elem) + " ").replace(ClassSpaces, " ").indexOf(className) > -1) {
                    return true;
                }
            }
            return false;
        },
        css: function (att, val) {
            var o = (typeof att === "object") ? att : null;
            if (o || isset(val)) {
                if (o) {
                    return this.each(function (i, e) {
                        var i;
                        for (i in o) {
                            //if (o.hasOwnProperty(prop))
                            e.style[i] = o[i];
                        }

                    });
                }
                return this.each(function (i, e) {
                    e.style[att] = val;
                });
            } else {
                return this[0].style[att];
            }
        },
        attr: function (att, val) {
            if (!isset(val)) {
            	if(this[0])
                	return this[0].getAttribute(att);
            }
            this.each(function (i, e) {
                e.setAttribute(att.toLowerCase(), val);
            });
            return this;
        },
        append: function (tag) {
            this.each(function (i, thisE) {
                _X(tag).appendTo(thisE);
            });
            return this;
        },
        appendTo: function (tag) {
            tag = _X(tag)[0];
            this.each(function (i, thisE) {
                tag.appendChild(thisE);
            });
            return this;
        },
        remove: function () {
            this.each(function (i, el) {
                el.parentElement && el.parentElement.removeChild(el);
            });
            return this;
        },
        html: function (html) {
            if (isset(html)) {
                this.each(function (i, e) {
                    e.innerHTML = html;
                });
                return this;
            } else {
                var lastHtml = "";
                return this[0].innerHTML;
            }
        },
        val: function (v) {
            if (isset(v)) {
                this.each(function (i, el) {
                    if (el.tagName === "INPUT")
                        el.value = v;
                    else
                        el.setAttribute("value", v);
                });
                return this;
            } else {
                return this[0].value;
            }
        },
        children: function () { /* TODO : make decompose do that */
            var e = [];
            this.each(function (i, el) {
                var chs = el.children, len = el.children.length, i = 0;
                for (; i < len; i++) {
                    e.push(chs[i]);
                }
            });
            return meastro(e);
        },
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this, false);
        },
        toggle: function (state) { /* TODO  fix that */
            if (isset(state)) {
                state ? this.show() : this.hide();
            } else {
                this.each(function (i, e) {
                    if (isHidden(e)) {
                        showHide(e, true);
                    } else {
                        showHide(e, false);
                    }
                });
            }
            return this;
        },
        click: function (cb) {
            this.each(function (i, e) {
                if (isset(cb))
					e.onclick =  function(v,el){cb(v,e,el)};
                else
					e.onclick();
            });
            return this;
        },
        on: function (ev, cb) {
            this.each(function (i, e) {
                e.addEventListener(ev, function (v) { cb(e, v) });
                //e["on" + ev] = function (v) { cb(e, v) };
            });
            return this;
        },
        blur: function () {
            if (this[0]) {
                this[0].blur();
            }
            return this;
        },
        focus: function () {
            if (this[0]) {
                this[0].focus();
            }
            return this;
        },
        select: function () {
            if (this[0]) {
                this[0].select();
            }
            return this;
        },
        parent: function () {
            var parents = [];
            meastro.each()
            this.each(function (i, e) {
                var p = e.parentNode;
                p && parents.indexOf(p) === -1 ? parents.push(e.parentNode) : false;
            })
            if (parents.length === 0) {
                return meastro(null);
            } else {
                return meastro(parents);
            }

        },
        position: function () {
            if (!this[0]) { return; }
            var elem = this[0], offset = {},
                doc = elem && elem.ownerDocument;

            var box = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 }
            if (elem.getBoundingClientRect) {
                var bb = elem.getBoundingClientRect();
                offset.top = bb.top;
                offset.bottom = bb.bottom;
                offset.height = bb.height;
                offset.left = bb.left;
                offset.right = bb.right;
                offset.width = bb.width;
            } else {
                return box;
            }
            return offset;
        },
        offset: function () {
            if (!this[0]) { return; }
            var elem = this[0], offset = {};

            var box = {
                top: elem.offsetTop,
                height: elem.offsetHeight,
                left: elem.offsetLeft,
                width: elem.offsetWidth
			}

            return box;
        }
    });


    /* ------------ */

    meastro.extend({
        each: function (obj, callback) {
            var length, i = 0;
            for (e in obj) {
                if (!isNaN(Number(e))) {
                    callback.call(obj[e], e, obj[e]);
                }
            }
            return obj;
        },
        isArray: function (e) {
            return Array.isArray(e);
        },
        parallel: function (elms, fxs) {

        },
        isMeastro: function (e) {
            return e instanceof meastro.fn.init;
        }
    });



    if (!noGlobal) {
        window.meastro = window._X = meastro;
    }
    return meastro;
}));