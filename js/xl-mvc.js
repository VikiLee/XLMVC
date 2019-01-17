; (function () {
  //var root = typeof self == "object" && self.self === self && self || {};

  var isEqual = function(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  // bind方法兼容
  Function.prototype.bind = Function.prototype.bind || function (context) {
    var _this = this;  //保存this，即调用bind方法的目标函数
    return function () {
      return _this.apply(context, arguments);
    };
  };

  // trim方法兼容
  String.prototype.trim = String.prototype.trim || function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '')
  }

  // ie8不支持array indexof方法
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/){
      var len = this.length >>> 0;
  
      var from = Number(arguments[1]) || 0;
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;
  
      for (; from < len; from++){
        if (from in this && this[from] === elt)
          return from;
      }
      return -1;
    };
  }

  //////////// virtual dom 关键代码 /////////////////
  var REPLACE = 'REPLACE';
  var UPDATE = 'UPDATE';
  var REMOVE = 'REMOVE';
  var CREATE = 'CREATE';
  var CREATE_ATTR = 'CREATE_ATTR';
  var REMOVE_ATTR = 'REMOVE_ATTR';
  var TEXT = 'TEXT';

  // vnode.js
  var VNode = function(tagName, attrs, children) {
      this.tagName = tagName;
      this.attrs = attrs;
      this.children = children;
  }

  /* h.js
  *创建虚拟DOM，如果是text则直接返回text
  */
  function h(tagName, text, children, attrs) {
      if(tagName === TEXT) {
          return text
      }
      var node = new VNode(tagName, attrs, children);
      return node;
  }

  // render.js
  function setAttribute(el, key, value) {
      el.setAttribute(key, value);
  }

  function setAttributes(el, attributes) {
      for(var key in attributes) {
          setAttribute(el, key, attributes[key]);
      }
  }

  function createElement(vnode) {
      var el = null;
      // 文本元素
      if(typeof vnode === "string") {
          el = document.createTextNode(vnode);
          return el;
      }

      el = document.createElement(vnode.tagName);
      setAttributes(el, vnode.attrs);
      vnode.children.map(createElement).forEach(function(child) {
          el.appendChild(child);
      });
      return el;
  }

  // diff.js
  var isNull = function(node) {return !node} 

  var diffChildren = function(newVnode, oldVnode) {
      var pathces = [];
      if(typeof newVnode === 'string') {
          return null;
      }
      var newChildren = newVnode.children;
      var oldChildren = oldVnode.children;
      var len = Math.max(newChildren.length, oldChildren.length);
      for(var i = 0; i < len; i++) {
          pathces[i] = diff(newChildren[i], oldChildren[i]);
      }
      return pathces;
  }

  var diffAttrs = function(newVnode, oldVnode) {
      var pathces = [];
      var newAttrs = newVnode.attrs;
      var oldAttrs = oldVnode.attrs;
      var attrs = Object.assign({}, oldAttrs, newAttrs);
      for(var key in attrs) {
          if(newAttrs[key] !== oldAttrs[key]) {
              // 新加属性
              pathces.push({
                  type: CREATE_ATTR,
                  key: key,
                  value: attrs[key]
              })
          } else if(!newAttrs[key]) {
              // 删除属性
              pathces.push({
                  type: REMOVE_ATTR,
                  key: key
              })
          }
      }
      return pathces;
  }

  var isDiffNode = function(newVnode, oldVnode) {
      return (typeof newVnode === 'string' && newVnode !== oldVnode) || 
          (typeof oldVnode === 'string' && newVnode !== oldVnode) ||
          newVnode.tagName !== oldVnode.tagName
  }

  function diff(newVnode, oldVnode) {
      // 新建
      if(isNull(oldVnode)) {
          return {
              type: CREATE,
              newVnode: newVnode
          };
      }
      // 删除
      if(isNull(newVnode)) {
          return {
              type: REMOVE
          };
      }
      // 替换
      if(isDiffNode(newVnode, oldVnode)) {
          return {
              type: REPLACE,
              newVnode: newVnode
          }
      }
      // 更新(text的情况下没有attr和children的)
      if(newVnode.tagName) {
          return {
              type: UPDATE,
              attrs: diffAttrs(newVnode, oldVnode),
              children: diffChildren(newVnode, oldVnode)
          }
      }
  }

  // patch.js
  function patchAttrs(el, patchs) {
      for(var i in patchs) {
        var patch = patchs[i];
        if(patch.type === REMOVE_ATTR) {
            el.removeAttribute(patch.key);
        } else if(patch.type === CREATE_ATTR) {
            el.setAttribute(patch.key, patch.value);
        }
      }
  }

  function patch(parent, patches, index) {
    if (!patches) {
      return
    }

    parent = typeof parent === 'string' ? document.querySelector(parent) : parent;

    var el = null;
    // index没有值的时候，是最开始的入口，这个时候获取的最原始的DOM，不能用childNodes（childNodes有text节点）
    if(index === undefined) {
      el = parent.children[0];
    } else {
      el = parent.childNodes[index];
    }

    switch(patches && patches.type) {
        case REMOVE: {
          parent.removeChild(el);
          break;
        }
        case CREATE: {
          parent.appendChild(createElement(patches.newVnode));
          break;
        }
        case REPLACE: {
          parent.replaceChild(createElement(patches.newVnode), el);
          break;
        }
        case UPDATE: {
          var attrs = patches.attrs,
            children = patches.children;
          patchAttrs(el, attrs);
          for (var i = 0, len = children.length; i < len; i++) {
            patch(el, children[i], i);
            // 如果是remove掉原来的子元素，则需要减1，不然会找不到childNodes
            if(children[i] && children[i].type === REMOVE) {
              len--;
              i--;
            }
          }
          break;
        }
            
    }
  }

  function createVnode(el) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var attrs = {}, c = [];
    // nodeType为3则是文本类型和注释类型
    if(el.nodeType !== 3 && el.nodeType !== 8) {
        var attributes = el.attributes;
        for(var i = 0; i < attributes.length; i++) {
          var attr = attributes[i];
          attrs[attr.nodeName] = attr.nodeValue;
        }
        var children = el.childNodes;
        for(var i = 0; i < children.length; i++) {
            var child = children[i];
            c[i] = createVnode(child);
        }
        return h(el.tagName, null, c, attrs);
    } else {
        return h(TEXT, el.textContent || el.innerText, c, attrs);
    }
  }

  //////////////////// underscore template 基本代码 //////////////////
  var root = this;
  var breaker = {};
  var ArrayProto = Array.prototype;
  var slice = ArrayProto.slice;
  var nativeForEach = ArrayProto.forEach;

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var _ = function (obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  root._ = _;

  _.keys = function(obj) {
    if(!XL.isPlainObject(obj)) return
    var keys = []
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    return keys;
  }

  _.escape = function(string) {
    var escaper = function(match) {
        return escapeMap[match];
    };
    // 使用非捕获性分组
    var source = '(?:' + Object.keys(escapeMap).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');

    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  }

  var each = _.each = _.forEach = function (obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  _.defaults = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  _.template = function (text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function (match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function (data) {
      return render.call(this, data, _);
    };

    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };


  // XL begin
  // 数据状态常量
  var FULFILLED = "fulfilled",
    PENDING = "pending",
    REJECTED = "rejected";

  
  var XL = {
    _modals: [],
    hideAll: function() {
      for(var i in this.modals) {
        this.modals[i].hide();
      }
    }
  };

  /*****************************View begin*******************************/

  /*****************************辅助方法begin*******************************/
  /**
   * 为model产生唯一性id
   */
  XL._generateUUID = function () {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  XL.hasClass = function(el, className) {
    if(!el) {
      return false
    }
    var cls = el.className
    return new RegExp(className).test(cls)
  }

  XL.EventUtil = {
    on: function (element, type, callback) {
      // 保存事件处理函数 在解绑事件的时候获取 IE8的dom自定义属性只能通过setAttribute的方式设置
      element.setAttribute("callback", callback);
     
      if (element.addEventListener) {
        if(type === "propertychange") {
          type = "input";
        }
        element.addEventListener(type, callback, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, callback);
      } else {
        element["on" + type] = callback;
      }
    },
    off: function (element, type, callback) {
      // 获取事件处理函数
      var callback = callback || element.getAttribute("callback");
      if(typeof callback === "function") {
        if (element.addEventListener) {
          element.removeEventListener(type, callback, false);
        } else if (element.detachEvent) {
          element.detachEvent("on" + type, callback);
        } else {
          element["on" + type] = null;
        }
      }
    },
    getTarget: function(evt) {
      evt = evt || window.event;
      return evt.target || evt.srcElement;
    }
  }

  /**
   * 格式化请求参数
   */
  XL._formatParams = function (data) {
    var arr = [];
    _.each(data, function(value, key) {
      arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    })
    // for (var name in data) {
    //   arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    // }
    //arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
  }

  XL._generateUrl = function(url, paramsObj) {
    var params = XL._formatParams(paramsObj);
    var locationArr = url.split("?");
    if (locationArr.length == 2) {
      params += "&" + locationArr[1];
    }
    return locationArr[0] + "?" + params + ("&v=" + Math.random()).replace(".", "");
  }

  /*
  *	jsonp获取数据
  *
  */
  XL._jsonpGet = function (url, data, jsonp, timeout, success, fail) {
    data = data || {};
    jsonp = jsonp || "callback";
    timeout = timeout || 5000;
    if (!url) {
      throw new Error("参数不合法");
    }
    // 创建 script 标签并加入到页面中
    var callbackName = ("jsonp_" + Math.random()).replace(".", "");

    var oHead = document.getElementsByTagName("head")[0];
    data[jsonp] = callbackName;
    var params = XL._formatParams(data);
    var oS = document.createElement("script");
    oHead.appendChild(oS);
    // 创建jsonp回调函数
    window[callbackName] = function (json) {
      oHead.removeChild(oS);
      clearTimeout(oS.timer);
      window[callbackName] = null;
      success && success(json);
    }
    // 发送请求
    var locationArr = url.split("?");
    if (locationArr.length == 2 && params) {
      params += "&" + locationArr[1];
    }
    if (params) oS.src = locationArr[0] + "?" + params;
    //超时处理
    if (timeout) {
      oS.timer = setTimeout(function () {
        window[callbackName] = null;
        oHead.removeChild(oS);
        fail && fail({ message: "超时" });
      }, timeout);
    }
  }

  /*
  *ajax获取数据
  */
  XL._ajax = function (url, data, type, success, fail) {
    type = type || "GET";
    type = type.toUpperCase();

    if (type == "GET" && _.keys(data).length > 0) {
      url = url + "?" + XL._formatParams(data);
    }

    var requestObj;
    if (window.XMLHttpRequest) {
      requestObj = new XMLHttpRequest();
    } else {
      requestObj = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var sendData = "";
    if (type == "POST") {
      sendData = JSON.stringify(data);
    }

    requestObj.open(type, url, true);
    requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    requestObj.send(sendData);

    requestObj.onreadystatechange = function () {
      if (requestObj.readyState == 4) {
        if (requestObj.status == 200) {
          // IE9下response为undefined
          var obj = requestObj.response || requestObj.responseText;
          if (typeof obj !== "object") {
            obj = JSON.parse(obj);
          }
          success && success(obj);
        } else {
          fail && fail(requestObj);
        }
      }
    }
  }

  XL.isArray = function (arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }

  // instanceof判断Function/Date/RegEep也是Object，该方法避免之
  XL.isPlainObject = function (obj) {
    if (typeof obj !== "object" || obj.nodeType || obj.self === self) {
      // 排除非object类型，然后是DOM对象，window对象。
      return false;
    }
    try {
      // 判断这个对象的直接原型对象，是否拥有isPrototypeOf方法，没有则被排除
      if (obj.constructor &&
        !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  // 判断对象是否为DOM对象
  XL.isDOM = ( typeof HTMLElement === 'object' ) ?
    function(obj){
        return obj instanceof HTMLElement;
    } :
    function(obj){
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }

  // jquery的extend方法简化版，只复制对象
  XL._extend = function () {
    // 有jquery的话直接使用jquery的
    // if($.extend) {
    //   return $.extend;
    // }
    var src, copyIsArray, copy, name, options, clone,
      target = arguments[0],    // target为arguments[0]
      i = 1,
      length =  typeof arguments[length - 1] === "boolean" ? arguments.length - 1 : arguments.length,
      deep = typeof arguments[length - 1] === "boolean" ? arguments[length - 1] : true;

    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {    // 防止自引用
            continue;
          }
          // 如果是深拷贝，且被拷贝的属性值本身是个对象
          if (deep && copy && (XL.isPlainObject(copy) || (copyIsArray = XL.isArray(copy)))) {
            if (copyIsArray) {    // 被拷贝的属性值是个数组
              copyIsArray = false;
              clone = []; // src && XL.isArray(src) ? src : [];
            } else {    //被拷贝的属性值是个plainObject
              clone = {}; // src && XL.isPlainObject(src) ? src : {};
            }
            target[name] = XL._extend(clone, copy, deep);  // 递归
          } else if (copy !== undefined) {  // 浅拷贝，且属性值不为undefined
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  /**
   * ajax方法
   */
  XL.ajax = function (option) {
    var defaultOption = {
      url: '',
      type: "GET",
      success: function () { },
      fail: function () { },
      data: {}
    };
    option = XL._extend({}, defaultOption, option);
    if (option.type === "jsonp") {
      XL._jsonpGet(option.url, option.data, option.jsonp, option.timeout, option.success, option.fail);
    } else {
      XL._ajax(option.url, option.data, option.type, option.success, option.fail);
    }
  }

  XL.throttle = function(fn, delay, mustRunDelay) {
    var timer = null;
    var tStart;
    return function () {
      clearTimeout(timer)
      var context = this,
          args = Array.prototype.slice.call(arguments, 0),
          tCurr = +new Date();
      if (!tStart) {
        tStart = tCurr;
      }
      if (tCurr - tStart >= mustRunDelay) {
        fn.apply(context, args);
        tStart = tCurr;
        // console.log('历时：' + (window.endTime - window.startTime) / 100)
      } else {
        timer = setTimeout(function () {
          fn.apply(context, args);
          // window.endTime = +new Date();
          // console.log('历时：' + (window.endTime - window.startTime) / 100)
        }, delay);
      }
    }
  }
  /*****************************辅助方法end*******************************/

  /*****************************模态框begin*******************************/
  XL.Modal = function(option) {
    if(!option.id) {
      throw new Error("id attribute is required");
    }
    var defaultOption = {
      id: '',
      closeBtn: '.pop_close',
      okBtn: '.pop_ok',
      okBtnTxt: '确定',
      cancelBtn: '.pop_cancal',
      cancelTxt: "取消",
      beforeShow: function() {}, // show之前的钩子函数
      afterShow: function() {},
      beforeHide: function() {}, // hide之前的钩子函数
      handleOk: function() {},
      handleCancel: function() {},
      $model: null
    };
    if(!option.id) {
      throw new Error("id attribute is required");
    }
     // 关联model和modal
    option.$model && (this.$model = option.$model);
    if(this.$model) {
      this.$model.$modal = this; 
      delete option['$model'];
    }

    XL._modals.push(this);

    XL._extend(defaultOption, option);
    var _this = this;
    this._isShow = false;
    this.id = defaultOption.id;
    this.$el = document.querySelector("#" + this.id);
    this.callbacks = [];
    this.beforeShow = defaultOption.beforeShow;
    this.afterShow = defaultOption.afterShow;
    this.beforeHide = defaultOption.beforeHide;
    this.closeBtn = defaultOption.closeBtn.replace(/\./, "");
    this.afterClose = defaultOption.afterClose;
    this.okBtn = defaultOption.okBtn.replace(/\./, "");
    this.cancelBtn = defaultOption.cancelBtn.replace(/\./, "");
    this.handleCancel = defaultOption.handleCancel;
    this.handleOk = defaultOption.handleOk;
    this.eventHandler = null; // modal点击事件的处理函数，需要保存起来，以便remove掉事件
   
    // 自定义show和hide
    defaultOption.hide && (this.hide = defaultOption.hide);
    defaultOption.show && (this.show = defaultOption.show);
    // 如果有methods对象，实现代理，直接挂到instance对象下
    var methods = defaultOption.methods;
    if (methods && XL.isPlainObject(methods)) {
      XL._extend(this, methods);
    }
    // events
    var events = defaultOption.events;
    if (events && XL.isPlainObject(events)) {
      _.each(events, function(callback, event_element) {
         var type = event_element.split(/\s+/)[0].split(/:/).join(" ");
         var selector = event_element.split(/\s+/)[1] || _this.$el;
         if(!_this[callback]) {
           throw new Error("there is no method called " + callback);
           return;
         }
        // 监听事件，冒泡的方式
        XL.EventUtil.on(_this.$el, type, function(evt) {
           var target = XL.EventUtil.getTarget(evt);
           var allEl = document.querySelectorAll(selector);
           var isContains = false;
           for(var i = 0; i < allEl.length; i++) {
             if(allEl[i] === target || allEl[i].contains(target)) {
               isContains = true;
               break;
             }
           }
           if(isContains) {
             var event = {
               currentTarget: target,
               target: evt.currentTarget
             }
             _this[callback](event, i >= 0 ? i : void 0);
           }
           
        });
       })
     }
  }

  // 监听modal点击事件，初始化和当modal里面的html改变的时候调用
  XL.Modal.prototype._listenOrRelisten = function() {
    var $el = this.$el;
    var _this = this;
    this.eventHandler && XL.EventUtil.off($el, "click", _this.eventHandler);
    _this.eventHandler = function(evt) {
      var target = XL.EventUtil.getTarget(evt);
      if(XL.hasClass(target, _this.closeBtn)) {// 关闭按钮
        _this.hide();
        _this.afterClose && _this.afterClose();
      } else if(XL.hasClass(target, _this.cancelBtn)) {//取消按钮
        _this.handleCancel();
        _this.afterClose && _this.afterClose();
        // var ifClose = _this.handleCancel();
        // ifClose && _this.hide();
      } else if(XL.hasClass(target, _this.okBtn)) {// 确定按钮
        var ifClose = _this.handleOk(target);
        ifClose && _this.hide() && (_this.afterClose && _this.afterClose());
      }
    }
    XL.EventUtil.on($el, "click", _this.eventHandler);
  } 

  XL.Modal.prototype.hide = function() {
    if(!this._isShow) return;
    if(this.$parent) {
      this.$parent.hideModal();
      this.$parent.$model.set("isShow", false);
    } else {
      var el = document.querySelector("#" + this.id);
      this.beforeHide && this.beforeHide.bind(this)();
      el && (el.style.display = "none"); 
      this.afterClose && this.afterClose.bind(this)();
    }
  }

  XL.Modal.prototype.show = function() {
    // 一次只显示一个modal，隐藏之前的modal
    // this.hide(true);
    this._isShow = true;
    if(this.$parent) {
      this.$parent.showModal();
      this.$parent.$model.set("isShow", true);
    } else {
      // 显示的时候才去监听事件，1：
      this._listenOrRelisten();
      var el = document.querySelector("#" + this.id),
        show = function() {
          this.beforeShow && this.beforeShow.bind(this)()
          el && (el.style.display = "block");
          this.afterShow && this.afterShow.bind(this)()
        };
      if(this.$model) {
        if(this.$model.status === FULFILLED) {
          // 保存template
          if(!this._template) {
            this._template = el.querySelector(".pop-template").innerHTML;
          }
          if(!this.$view) {
            this.$view = XV.create({
              $el: el.querySelector(".pop-container"),
              template:  this._template,
              $model: this.$model
            });
          }
          this.$view.render();
          
          show.bind(this)();
        } else {
          // 如果model数据还未准备好，则先放入队列中
          this.callbacks.push(this.show);
        }
      } else {
        show.bind(this)();
      }
    }
  }

  XL.Modal.prototype.update = function() {
    var el = document.querySelector("#" + this.id);
    if(!this._template) {
      this._template = el.querySelector(".pop-template").innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    }
    if(!this.$view) {
      this.$view = XV.create({
        $el: el.querySelector(".pop-container"),
        template:  this._template,
        $model: this.$model
      });
    }
    this.$view.render();
  }

  XL.toast = function(option) {
    if(!option.template) {
      throw new Error("template attribute is required");
    }
    if(!option.template) {
      throw new Error("container attribute is required");
    }
    if(!option.template) {
      throw new Error("closeBtn attribute is required");
    }

    var html = _.template(option.tmplate)({title: title, content: content});
    var $container = document.querySelector(option.container);
    $container.innerHTML = html
    var $body = document.querySelector("body");
    XL.EventUtil.on($body, "click", function(evt) {
      var target = XL.EventUtil.getTarget(evt);
      if(XL.hasClass(target, option.closeBtn)) {// 关闭按钮
        $container.style.display = "none";
      }
    })
  }

  
  /*****************************模态框end*******************************/

  /*****************************event bus begin*******************************/
  var XEvent = {
    handles: {},
    // 监听事件 eventName
    on: function (eventName, callback) {
      if (!this.handles[eventName]) {
        this.handles[eventName] = [];
      }
      this.handles[eventName].push(callback);
    },
    // 触发事件 eventName
    emit: function (eventName) {
      if (this.handles[arguments[0]]) {
        for (var i = 0; i < this.handles[arguments[0]].length; i++) {
          this.handles[arguments[0]][i](arguments[1]);
        }
      }
    }
  };
  /*****************************event bus end*******************************/

  /*****************************Model begin*******************************/

  var XM = {};
  XM.create = function (obj) {
    var instance = {
      id: XL._generateUUID(),
      /**
       * 根据该url从后台获取数据到data当中
       */
      url: "",
      /**
       * 如果请求url需要带参数
       */
      params: {},
      // forceRender: true, // 是否强制重新渲染dom，在set/merge方法的第二个参数指定
      /**
       * model的data属性，内部使用
       */
      _data: {},
      _initData: {},
      watch: {}, // 监听属性变化
      _invokeWatchCallback: function(attr, value) {
        // 如果有监听属性值的改变
        if(this[attr] !== value && attr in this.watch) {
          var watchCallback = this.watch[attr].bind(this);
          watchCallback(value, this[attr])
        }
      },
      callbacks: [],
      status: FULFILLED, 
      /**
       * 监听事件
       */
      on: function (eventName, fn) {
        XEvent.on(this.id + ":" + eventName, fn.bind(instance));
      },
      /**
       * 向model的data中设置某个属性值
       */
      set: function (attr, value, ifRender) {
        var _this = this;
        // 无需从后台拉取数据的时候
        if(this.status === FULFILLED) {
          this._setData(attr, value, ifRender)
          return this;
        }
        // 如果需要从后台拉取数据，需要等数据拉取完毕
        // this._afterDataReady(function() {
        //   _this._setData(attr, value, ifRender);
        // });
        this.callbacks.push(function() {
          _this._setData(attr, value, ifRender);
        });
      },
      // 是否创建的时候就拉取数据，如果设置为true，需要用户手动调用fetchData方法拉取数据
      lazy: false, 
      _setData: function(attr, value, ifRender){
        var preData = JSON.stringify(this._data);
        // set的是整个对象
        var isSetObj = false;
        if(XL.isPlainObject(attr)) {
          ifRender = value || false;
          value = attr;
          isSetObj = true;
        }
        var self = this;
        if(isSetObj) {
          // 第一个参数是object的情况
          // 监听属性变化并执行回调
          _.each(value, function(v, k) {
            self._invokeWatchCallback(k, v);
          })
          XL._extend(this, value);
          XL._extend(this._data, value);
        } else {
          // 监听属性变化并执行回调
          this._invokeWatchCallback(attr, value);
          if (XL.isPlainObject(value)) {
            // 如果set的第一个参数是对象
            XL._extend(this[attr], value);
            XL._extend(this._data[attr], value);
          } else {
            // 如果set的是单个键值对
            this[attr] = value;
            this._data[attr] = value;
          }
        }
        // 值没改变的情况下才render
        var nowData = JSON.stringify(this._data);
        if(!isEqual(preData, nowData) && ifRender) {
          this.trigger("render");
          // 如果有和model关联的modal
          if(this.$modal) {
            this.$modal.update();
          }
        }
      
      },
      /**
       * 获取model中data的某个属性值
       */
      get: function (attr) {
        return this._data[attr];
      },
      /**
       * 将另外一个model的数据合并到当前model中
       */
      merge: function (otherModel, ifRender) {
        var _this = this;
        // 如果要merge的另一个对象的数据还未准备好
        if(otherModel.status === PENDING) {
          // otherModel._afterDataReady(function(readyData) {
          //   XL._extend(_this, otherModel._data);
          //   XL._extend(_this._data, otherModel._data);
          //   ifRender && this.trigger("render");
          // });
          otherModel.callbacks.push(function(readyData) {
            XL._extend(_this, otherModel._data);
            XL._extend(_this._data, otherModel._data);
            ifRender && this.trigger("render");
          });
        } else {
          XL._extend(_this, otherModel._data);
          XL._extend(_this._data, otherModel._data);
          ifRender && this.trigger("render");
        }
      },
      reset: function() {
        var data = this._data;
        this._data = {}
        _.each(data, function(value, prop) {
          delete this[prop];
        })
      },
      resetParams: function(params) {
        // this.reset();
        XL._extend(this.params, params);
        this.fetchData(true);
      },
      /**
       * 当数据拉取成功后把callbacks中延迟执行的操作全部执行
       */
      _onReadyData: function() {
        var callback = null;
        // 触发数据完成事件，告诉merge，如果需要合并该model，数据已经准备好啦
        while (callback = this.callbacks.shift()) {
          callback.call(this);
        }
        this.trigger("afterReady", this);
        // 如果关联了modal且modal显示的时候数据还未准备好，则现在通知modal去show
        if(this.$modal && this.$modal.callbacks.length > 0) {
          for(var i = 0; i < this.$modal.callbacks.length; i++) {
            this.$modal.callbacks[i].bind(this.$modal)();
          }
        }
      },
      /**
       * 数据准备后执行cb
       */
      _afterDataReady: function(cb) {
        this.on("afterReady", cb.bind(this));
      },
      /**
       * 触发事件
       */
      trigger: function (eventName, data) {
        XEvent.emit(this.id + ":" + eventName, data);
      },
      /**
       * 获取更多数据，用在列表数据的情况下
       * @param cb 拉取完数据后，执行的回调函数
       */
      getMoreData: function(cb) {
        var _this = this;
        // 防止多次拉取
        if(this.status === PENDING) {
          return;
        }
        if(this.params) {
          this.url = XL._generateUrl(this._rootUrl, this.params);
        }
        this.status = PENDING;
        instance.beforeFetchData && instance.beforeFetchData()
        XL.ajax({
          url: this.url,
          type: this.type,
          success: function (res) {
            if (res.data) {
              _this.status = FULFILLED;
              cb && cb(res.data);
              _this._onReadyData();
            } else {
              _this.status = REJECTED;
            }
          }
        })
      },
      /**
       * 为model拉取后台数据
       * @param {*} cb 
       */
      fetchData: function(ifRender) {
        var _this = this;
        if(this.params) {
          this.url = XL._generateUrl(this._rootUrl, this.params);
        }
        instance.status = PENDING;
        instance.beforeFetchData && instance.beforeFetchData()
        XL.ajax({
          url: this.url,
          type: this.type,
          success: function (res) {
            if (res.data) {
              // 如果有自定义数据，则选择自定义数据格式
              if(_this.dataFn) {
                _this.dataFn(res.data)
              } else {
                XL._extend(_this, res.data);
                // 同时model的_data和_prevData属性也备份一份
                XL._extend(_this._data, res.data);
              }
              
              _this.status = FULFILLED;
              // 这个位置很重要，因为调用这个函数等于告诉view可以渲染了
              _this._onReadyData();
              if(ifRender) {
                _this.trigger("render");
                return;
              } 
            } else {
              _this.status = REJECTED;
              _this.error && _this.error(res.code, res.msg);
            }
            // 获取数据后，通知视图更新
            _this._autoRender && _this.trigger("render");
          }
        })
      },
      refresh: function(initData) {
        // this.reset();
        this.reset();
        XL._extend(this._data, this._initData);
        if (initData && XL.isPlainObject(initData)) {
          XL._extend(this, initData);
          // 同时model的_data属性也备份一份
          XL._extend(this._data, initData);
        }
        this.fetchData(true);
      }
      
    };

    // 是否拉取到数据重新渲染设置
    if(obj.ifRenderAfterDataReady !== void(0)) {
      instance.ifRenderAfterDataReady = obj.ifRenderAfterDataReady;
    }

    //是否有params
    if(obj.params && XL.isPlainObject(obj.params)) {
      XL._extend(instance.params, obj.params);
    }

    // 初始化数据
    var initData = obj.initData
    if(initData && XL.isPlainObject(initData)) {
      XL._extend(instance, initData);
      // 同时model的_data属性也备份一份
      XL._extend(instance._initData, initData);
      XL._extend(instance._data, initData);
    }

    // 如果有data对象，实现代理，直接挂到instance对象下
    var data = obj.data;
    if (data) {
      if(XL.isPlainObject(data)) {
        XL._extend(instance, data);
        // 同时model的_data属性也备份一份
        XL._extend(instance._data, data);
      } else if(typeof data === 'function') {
        instance.dataFn = data.bind(instance)
      }
    }

    // 不马上加载数据
    if(obj.lazy) {
      instance.lazy = true;
    }

    // 生命周期beforeFetchData
    if(obj.beforeFetchData && obj.beforeFetchData instanceof Function) {
      instance.beforeFetchData = obj.beforeFetchData
    }
    
    var url = obj.url;
    if(url) {
      if(typeof url === 'string') {
        instance.url = url;
      } else if(typeof url === 'function') {
        instance.url = url.bind(obj)();
      }
      if(instance.url && !instance.lazy) {
        instance._rootUrl = instance.url;
        instance.type = obj.type;
        instance.fetchData();
      }
    }
    // 如果有methods对象，实现代理，直接挂到instance对象下
    var methods = obj.methods;
    if (methods && XL.isPlainObject(methods)) {
      XL._extend(instance, methods);
    }
   
    // 监听事件
    if (obj.listeners) {
      if (XL.isPlainObject(obj.listeners)) {
        var listeners = obj.listeners;
        _.each(listeners, function(listener, eventName) {
          instance.on(eventName, listener);
        })
      }
    }

    // 监听属性值变化
    if(obj.watch && XL.isPlainObject(obj.watch)) {
      _.each(obj.watch, function(callback, key, self) {
        if(typeof callback === "function") {
          instance.watch[key] = callback
        }
      })
    }

    // 生命周期
    if(obj.afterReady && obj.afterReady instanceof Function) {
      instance.on("afterReady", obj.afterReady.bind(instance))
    }

    return instance;
  }
  /*****************************Model end*******************************/

  /*****************************View begin*******************************/
  var XV = {};
  XV.create = function (obj) {
    var instance = {
      /**
       * view挂载的元素，选择器/dom对象
       */
      $el: "",
      /**
       * 事件键值对
       */
      events: {},
      /**
       * view当中有modal弹窗
       */
      $modal: null,
      showModal: function() {
        this.$model.set("isShow", true, true);
      },
      hideModal: function() {
        this.$model.set("isShow", false, true);
      },
      /**
       * 是否自动渲染数据
       */
      autoRender: false,
      /**
       * 模板，推荐基于underscore，也支持其他的
       */
      template: "", // 基于underscore的模板对象
      /**
       * 监听事件
       */
      on: function (eventName, fn) {
        XEvent.on(this.$model.id + ":" + eventName, fn.bind(instance));
      },
      _beforeRender: function() {
        // this.$model._data.status = this.$model.status;
        // var html = this._getTemplate(this.$model._data);
        // if(XL.isDOM(this.$el)) {
        //   this.$el.innerHTML = html;
        // } else {
        //   document.querySelector(this.$el).innerHTML = html;
        // }
        // $(this.$el).html(html);
      },
      /**
       * 渲染该view挂载的dom
       */
      render: function () {
        var _this = this;
        var model = this.$model;
        // _this._beforeRender();
        // 无需从后台拉取数据的时候
        if(model.status === FULFILLED) {
          model._data.status = model.status;
          _this._delayRender();
          return _this;
        }
        // _this.$model._afterDataReady(function(readyData) {
        //   _this.$model._data.status = _this.$model.status;
        //   _this._delayRender();
        // });
        // 放入延迟执行队列等待数据完成再执行
        _this.$model.callbacks.push(function(readyData) {
          _this.$model._data.status = _this.$model.status;
          _this._delayRender();
        });
      },
      extend: function(extendObj) {
        for(var k in extendObj) {
          if(typeof extendObj[k] === "function") {
            this[k] = extendObj[k];
          }
        }
      },
      init: function() {},
      rendered: function() {},
      _getTemplate: function(data) {
        if(typeof this.template !== 'function') {
          return _.template(this.template)(data);
        } else {
          return this.template(data);
        }
      },
      _initListener: function(relisten) {
        relisten = relisten || false;
        var events = this.events;
        if (events && XL.isPlainObject(events)) {
          var cannotBubbleTypes = ['blur', 'focus'];
          _.each(events, function(callback, event_element) {
            var type = event_element.split(/\s+/)[0].split(/:/).join(" ");
            var selector = event_element.split(/\s+/)[1] || instance.$el;
            if(!instance[callback]) {
              throw new Error("there is no method called " + callback);
              return;
            }
            // 无法冒泡的事件
            if(cannotBubbleTypes.indexOf(type) > -1) {
              setTimeout(function() {
                XL.EventUtil.on(document.querySelector(selector), type, function(evt) {
                  var target = XL.EventUtil.getTarget(evt);
                  var event = {
                    currentTarget: target,
                    target: evt.currentTarget
                  }
                  instance[callback](event);
                })
              }, 0);
              return;
            }
            // 冒泡监听的不需要重新监听
            if(relisten) return;
            // 监听事件，冒泡的方式
            XL.EventUtil.on(document.querySelector(obj.$el), type, function(evt) {
              var target = XL.EventUtil.getTarget(evt);
              var allEl = document.querySelectorAll(selector);
              var isContains = false, i = 0;
              for(; i < allEl.length; i++) {
                if(allEl[i] === target || allEl[i].contains(target)) {
                  isContains = true;
                  break;
                }
              }
              if(isContains) {
                var event = {
                  currentTarget: target,
                  target: evt.currentTarget
                }
                instance[callback](event, i >= 0 ? i : void 0);
              }
              
            });
            // $("body").on(type, selector, instance[callback].bind(instance));
          })
        }
      }
    };

    // 生命周期beforeCreate
    if(obj.beforeCreate && obj.beforeCreate instanceof Function) {
      obj.beforeCreate();
    }

    // 如果有methods对象，实现代理，直接挂到instance对象下
    var methods = obj.methods;
    if (methods && XL.isPlainObject(methods)) {
      XL._extend(instance, methods);
    }

    // $el
    if (!obj.$el) {
      throw new Error("$el attribute is required");
    } else {
      instance.$el = obj.$el;
    }

    // events
    instance.events = obj.events;
    instance._initListener();
    
    // template
    if (!obj.template) {
      throw new Error("template attribute is required");
    } else {
      instance.template = obj.template;
    }

    // 通过函数节流的方式来渲染dom，避免性能浪费
    instance._delayRender = function() {
      return XL.throttle(function() {
        // console.log('执行：' + (++window.count));
        this.beforeRender && this.beforeRender()
        var model = this.$model._data;
        var html = this._getTemplate(model);
        if(this._vnode) {
          // 之前渲染过，使用diff算法来更新
          var el = document.createElement("div");
          el.innerHTML = html;
          var newVnode = createVnode(el);
          patch(this.$el, diff(newVnode, this._vnode));
          this._vnode = newVnode;
        }  else {
          // 第一次渲染，为了创建虚拟DOM需要用div包起来
          var el = document.createElement("div");
          el.innerHTML = html;
          this._vnode = createVnode(el);

          if(XL.isDOM(this.$el)) {
            this.$el.appendChild(el);
          } else {
            document.querySelector(this.$el).appendChild(el);
          }
        }
        this._initListener(true);
        // $(this.$el).html(html);
        // 调用redered 生命函数
        this.rendered && this.rendered();
      }, 300, 300)
    }()

    // $model
    if (obj.$model) {
      instance.$model = obj.$model;
      instance.$model.$view = instance;
      // 监听render事件，view对应的model拉取到数据后可以触发render事件
      XEvent.on(instance.$model.id + ":render", function() {
        instance.render();
        // 如果有弹窗，view重新渲染了后需要重新监听modal的事件
        if(instance.$modal) {
          instance.$modal._listenOrRelisten();
        }
      });
    } else {
      throw new Error("$model attribute is required");
    }

    // trigger定义
    instance.trigger = function (eventName, data) {
      XEvent.emit(this.$model.id + ":" + eventName, data);
    }

    // 监听事件 events
    var listeners = obj.listeners;
    if (listeners && XL.isPlainObject(listeners)) {
      _.each(listeners, function(callback, eventName) {
        XEvent.on(instance.$model.id + ":" + eventName, callback.bind(instance, event));
      })
    }

    // 如果有data对象，实现代理，直接挂到instance对象下
    var data = obj.data;
    if (data && XL.isPlainObject(data)) {
      XL._extend(instance, data);
    }

    // 如果有init方法 则复制init方法并执行，一般是监听事件
    if (obj.init) {
      instance.init = obj.init;
      instance.init();
    }
     
    //view中有modal的情况下
    if(obj.$modal) {
      // 控制modal是否可见
      instance.$model.set("isShow", false);
      instance.$modal = obj.$modal;
      instance.$modal.$parent = instance;
    }

    // 是否自动渲染
    if(obj.autoRender) {
      instance.autoRender = obj.autoRender;
      instance.$model._autoRender = obj.autoRender;
      // 在不需要去后台拉取数据时候
      instance.$model.status === FULFILLED && instance.trigger("render");
    }

    // 生命周期beforeRender
    if(obj.beforeRender && obj.beforeRender instanceof Function) {
      instance.beforeRender = obj.beforeRender
    }

    // 生命周期rendered
    if(obj.rendered && obj.rendered instanceof Function) {
      instance.rendered = obj.rendered
    }

    // 生命周期created
    if(obj.created && obj.created instanceof Function) {
      obj.created();
    }


    return instance;
  }
  /*****************************View end*******************************/

  window.XL = XL;
  window.XEvent = XEvent;
  window.XM = XM;
  window.XV = XV;

})(window);