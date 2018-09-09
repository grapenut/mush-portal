/*
 * jHash v2.1
 * http://jhash.codeplex.com
 * 
 * Copyright (c) 2013 Chris Pietschmann
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in the 
 * Software without restriction, including without limitation the rights to use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export default class jHash {

    constructor() {
        this.ie_documentMode = window.document.documentMode;
        this.hashChangeSupported = ('onhashchange' in window) && (ie_documentMode === undefined || ie_documentMode > 7);
        this.jhash = "2.1";
        this._routes = {};
        this._routeHandlerRegistered = false;
        this._defaultRoute = null;

        this.eventHandlers = [];
        this.previousHashValue = window.location.hash;
        
        this.ROUTE_REPLACE = "([^\/]+)",
        this.ROUTE_MATCH = /{([\w\d]+)}/g,

        var that = this;

        if (!this.hashChangeSupported) {
            window.setInterval(function () {
                var currentHash = window.location.hash;
                if (that.previousHashValue !== currentHash) {
                    for (var i in that.eventHandlers) {
                        that.eventHandlers[i].call(window);
                    }
                }
                that.previousHashValue = currentHash;
            }, 200);
        }
    }

    /// adds an event handler for the "hashchange" event
    change(handler) {
        if (this.hashChangeSupported) {
            this.attachEvent(window, "hashchange", handler);
        } else {
            this.eventHandlers.push(handler);
        }
        return this;
    }

    /// removes an event handler from the "hashchange" event
    unbind(handler) {
        var i = 0, len = 0;
        if (this.hashChangeSupported) {
            this.detachEvent(window, "hashchange", handler);
        } else {
            this.arrayRemove(this.eventHandlers, this.eventHandlers.indexOf(handler));
        }
        return this;
    }

    /// gets or sets a hash querystring value
    val(name, value) {
        var ho = this.query();
        if (arguments.length === 2) {
            ho[name.toLowerCase()] = (value === null ? '' : value);
            return this.set(this.root(), ho);
        } else if (arguments.length === 1 && typeof (name) === 'string') {
            return ho[name.toLowerCase()];
        } else if (typeof(name) === 'object') {
            return this.set(this.root(), name);
        }
        return ho;
    }

    /// gets or sets the root hash
    root(value) {
        if (value === undefined) {
            return this.parseHashRoot(window.location.hash);
        }
        return this.set(value, this.val());
    }

    /// sets both the root hash and the hash querystring
    set(root, query) {
        var fullHashValue = null;
        if (root === null && query === null) {
            fullHashValue = null;
        } else if (query !== undefined) {
            var rootValue = root;
            var queryValue = typeof (query) === "string" ? query : this.objectToHash(query);
            if (queryValue.length > 0) {
                rootValue += '?';
            }
            fullHashValue = rootValue + queryValue;
        } else {
            fullHashValue = root;
        }
        window.location.hash = fullHashValue;
        return this;
    }

    /// removes a value from the hash querystring
    remove(name) {
        var ho = this.query();
        ho[name.toLowerCase()] = undefined;
        return this.set(this.root(), ho);
    }

    /// returns an object representation of the hash querystring
    query() {
        return this.hashToObject(window.location.hash);
    }

    /// clears the hash
    clear() {
        window.location.hash = '';
        return this;
    }
    
    // clears the hash querystring
    clearQuery() {
        this.set(this.root());
        return this;
    }
    
    // clears the hash root
    clearRoot() {
        this.set('', this.query());
        return this;
    }
    
    /// adds a new route handler
    route(route, handler) {
        this._routes[route] = handler;

        if (!this._routeHandlerRegistered) {
            this._routeHandlerRegistered = true;
            this.change(this.routeHandler);
        }
    }

    /// Forces the current route to be processed.
    /// useful for calling on initial page load, after
    /// all page initialization has been performed
    processRoute() {
        this.routeHandler();
    }

    /// Gets or sets the default route for the page, when
    /// no "root" hash is specified
    defaultRoute(root, query) {
        if (arguments.length == 0) {
            return this._defaultRoute;
        }
        this._defaultRoute = {
            root: root,
            query: query
        };
    }

    attachEvent(element, evtName, handler) {
        if (element.addEventListener) {
            element.addEventListener(evtName, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + evtName, handler);
        } else {
            element["on" + evtName] += handler;
        }
    }
    
    detachEvent(element, evtName, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(evtName, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + evtName, handler);
        } else {
            element["on" + evtName] -= handler;
        }
    }
    
    arrayRemove(array, from, to) {
        /* function source: http://ejohn.org/blog/javascript-array-remove/ */
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }
    
    hashToObject(hash) {
        /* create a "dictionary" object for the passed in hash value */
        var obj = {},
            pair = null,
            strHash = hash.substring(0, hash.length);
        if (hash !== null && hash !== undefined) {
            if (strHash.indexOf("#") === 0) {
                strHash = strHash.substring(1, strHash.length);
            }

            var queryIndex = strHash.indexOf("?");
            
            if (queryIndex > -1) {
                strHash = strHash.substring(queryIndex + 1, strHash.length);

                var parts = strHash.split("&");
                for (var i in parts) {
                    pair = parts[i].split("=");
                    obj[pair[0].toString().toLowerCase()] = pair[1];
                }
            }
        }
        return obj;
    }
    
    objectToHash(object) {
        var s = "";
        for (var i in object) {
            if (object[i] !== undefined) {
                if (s.length > 0) {
                    s += "&";
                }
                s += i.toString() + "=" + object[i].toString();
            }
        }
        return s;
    }
    
    parseHashRoot(hash) {
        var strHash = hash.substring(0, hash.length);
        if (strHash.indexOf("#") > -1) {
            strHash = strHash.substring(1, strHash.length);
        }
        if (strHash.indexOf("?") > -1) {
            strHash = strHash.substring(0, strHash.indexOf("?"));
        }
        return strHash;
    }

    getRouteMatches(route, root) {
        var pathRegex = new RegExp(route.replace(this.ROUTE_MATCH, this.ROUTE_REPLACE) + "$")
        return root.match(pathRegex);
    }
    
    routeHandler() {
        var root = this.root();

        var defaultRoute = this.defaultRoute();
        if ((root || '').length === 0 && defaultRoute) {
            this.set(defaultRoute.root, defaultRoute.query);
            return;
        }

        for (var r in this._routes) {
            if (typeof (r) === "string") {
                var matches = this.getRouteMatches(r, root);
                if (matches !== null) {
                    var handler = this._routes[r];

                    var context = {};
                    var routeParts = r.match(ROUTE_MATCH);
                    if (routeParts !== null) {
                        for (var rp = 0; rp < routeParts.length; rp++) {
                            var routePartName = routeParts[rp].substring(1).substring(0, routeParts[rp].length - 2);
                            context[routePartName] = matches[rp + 1];
                        }
                    }

                    handler.call(context);

                    return;
                }
            }
        }
    }
    
    // end of class methods
}



