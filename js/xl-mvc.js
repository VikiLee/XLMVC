; (function () {
  //var root = typeof self == "object" && self.self === self && self || {};

  // md5加密
  function MD5(sMessage) {  

    if(XL.isArray(sMessage) || XL.isPlainObject(sMessage)) {
      sMessage = JSON.stringify(sMessage)
    }
      function RotateLeft(lValue, iShiftBits) {   
          return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));   
      }  
      function AddUnsigned(lX,lY) {  
          var lX4,lY4,lX8,lY8,lResult;  
          lX8 = (lX & 0x80000000);  
          lY8 = (lY & 0x80000000);  
          lX4 = (lX & 0x40000000);  
          lY4 = (lY & 0x40000000);  
          lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);  
          if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);  
          if (lX4 | lY4) {  
              if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);  
              else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);  
          }  
          else return (lResult ^ lX8 ^ lY8);  
      }  
      function F(x,y,z) { return (x & y) | ((~x) & z); }  
      function G(x,y,z) { return (x & z) | (y & (~z)); }  
      function H(x,y,z) { return (x ^ y ^ z); }  
      function I(x,y,z) { return (y ^ (x | (~z))); }  
      function FF(a, b, c, d, x, s, ac) {  
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));  
        return AddUnsigned(RotateLeft(a, s), b);  
      }  
      function GG(a, b, c, d, x, s, ac) {  
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));  
        return AddUnsigned(RotateLeft(a, s), b);  
      }  
      function HH(a, b, c, d, x, s, ac) {  
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));  
        return AddUnsigned(RotateLeft(a, s), b);  
      }  
      function II(a, b, c, d, x, s, ac) {  
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));  
        return AddUnsigned(RotateLeft(a, s), b);  
      }  
      function ConvertToWordArray(sMessage) {  
        var lWordCount;  
        var lMessageLength = sMessage.length;  
        var lNumberOfWords_temp1=lMessageLength + 8;  
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64)) / 64;  
        var lNumberOfWords = (lNumberOfWords_temp2+1) * 16;  
        var lWordArray=Array(lNumberOfWords - 1);  
        var lBytePosition = 0;  
        var lByteCount = 0;  
        while ( lByteCount < lMessageLength ) {  
         lWordCount = (lByteCount-(lByteCount % 4)) / 4;  
         lBytePosition = (lByteCount % 4) *8 ;  
         lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount)<<lBytePosition));  
         lByteCount++;  
        }  
        lWordCount = (lByteCount-(lByteCount % 4)) /4 ;  
        lBytePosition = (lByteCount % 4)*8;  
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);  
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;  
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;  
        return lWordArray;  
      }  
      function WordToHex(lValue) {  
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;  
        for (lCount = 0;lCount<=3;lCount++)   
        {  
          lByte = (lValue>>>(lCount*8)) & 255;  
          WordToHexValue_temp = "0" + lByte.toString(16);  
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);  
        }  
        return WordToHexValue;  
      }  
      var x=Array();  
      var k,AA,BB,CC,DD,a,b,c,d  
      var S11 = 7, S12 = 12, S13 = 17, S14 = 22;  
      var S21 = 5, S22 = 9 , S23 = 14, S24 = 20;  
      var S31 = 4, S32 = 11, S33 = 16, S34 = 23;  
      var S41 = 6, S42 = 10, S43 = 15, S44 = 21;  
      x = ConvertToWordArray(sMessage);  
      a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;  
      for (k=0; k<x.length; k += 16) {  
          AA=a; BB=b; CC=c; DD=d;  
          a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);  
          d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);  
          c=FF(c,d,a,b,x[k+2], S13,0x242070DB);  
          b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);  
          a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);  
          d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);  
          c=FF(c,d,a,b,x[k+6], S13,0xA8304613);  
          b=FF(b,c,d,a,x[k+7], S14,0xFD469501);  
          a=FF(a,b,c,d,x[k+8], S11,0x698098D8);  
          d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);  
          c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);  
          b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);  
          a=FF(a,b,c,d,x[k+12],S11,0x6B901122);  
          d=FF(d,a,b,c,x[k+13],S12,0xFD987193);  
          c=FF(c,d,a,b,x[k+14],S13,0xA679438E);  
          b=FF(b,c,d,a,x[k+15],S14,0x49B40821);  
        
          a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);  
          d=GG(d,a,b,c,x[k+6], S22,0xC040B340);  
          c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);  
          b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);  
          a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);  
          d=GG(d,a,b,c,x[k+10],S22,0x2441453);  
          c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);  
          b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);  
          a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);  
          d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);  
          c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);  
          b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);  
          a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);  
          d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);  
          c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);  
          b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);  
        
          a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);  
          d=HH(d,a,b,c,x[k+8], S32,0x8771F681);  
          c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);  
          b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);  
          a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);  
          d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);  
          c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);  
          b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);  
          a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);  
          d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);  
          c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);  
          b=HH(b,c,d,a,x[k+6], S34,0x4881D05);  
          a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);  
          d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);  
          c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);  
          b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);  
        
          a=II(a,b,c,d,x[k+0], S41,0xF4292244);  
          d=II(d,a,b,c,x[k+7], S42,0x432AFF97);  
          c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);  
          b=II(b,c,d,a,x[k+5], S44,0xFC93A039);  
          a=II(a,b,c,d,x[k+12],S41,0x655B59C3);  
          d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);  
          c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);  
          b=II(b,c,d,a,x[k+1], S44,0x85845DD1);  
          a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);  
          d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);  
          c=II(c,d,a,b,x[k+6], S43,0xA3014314);  
          b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);  
          a=II(a,b,c,d,x[k+4], S41,0xF7537E82);  
          d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);  
          c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);  
          b=II(b,c,d,a,x[k+9], S44,0xEB86D391);  
        
          a = AddUnsigned(a,AA); b = AddUnsigned(b,BB); c = AddUnsigned(c,CC); d = AddUnsigned(d,DD);  
      }  
      var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);  
      return temp.toLowerCase();  
  }  

  // bind方法兼容
  Function.prototype.bind = Function.prototype.bind || function (context) {
    var _this = this;  //保存this，即调用bind方法的目标函数
    return function () {
      return _this.apply(context, arguments);
    };
  };

  // underscore template source
  var root = this;
  var breaker = {};
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  var
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  var
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;

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

  
  var XL = {};

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
        element.addEventListener(type, callback, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, callback);
      } else {
        element["on" + type] = callback;
      }
    },
    off: function (element, type) {
      // 获取事件处理函数
      var callback =  element.getAttribute("callback");
      if (element.addEventListener) {
        element.removeEventListener(type, callback, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, callback);
      } else {
        element["on" + type] = null;
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
      length = arguments.length,
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
              clone = src && XL.isArray(src) ? src : [];
            } else {    //被拷贝的属性值是个plainObject
              clone = src && XL.isPlainObject(src) ? src : {};
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
      handleOk: function(){},
      handleCancel: function() {},
      $model: null
    };
    if(!option.id) {
      throw new Error("id attribute is required");
      return;
    }
    XL._extend(defaultOption, option);
    var _this = this;
    this.id = defaultOption.id;
    this.closeBtn = defaultOption.closeBtn.replace(/\./, "");
    this.afterClose = defaultOption.afterClose;
    this.okBtn = defaultOption.okBtn.replace(/\./, "");
    this.cancelBtn = defaultOption.cancelBtn.replace(/\./, "");
    this.handleCancel = defaultOption.handleCancel;
    this.handleOk = defaultOption.handleOk;
    this.$model = defaultOption.$model
  }

  // 监听modal点击事件，初始化和当modal里面的html改变的时候调用
  XL.Modal.prototype._listenOrRelisten = function() {
    var $el = document.querySelector("#" + this.id);
    var _this = this;
    XL.EventUtil.off($el, "click");
    XL.EventUtil.on($el, "click", function(evt) {
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
    });
  } 

  XL.Modal.prototype.hide = function() {
    if(this.$parent) {
      this.$parent.hideModal();
      this.$parent.$model.set("isShow", false);
    } else {
      var el = document.querySelector("#" + this.id);
      el && (el.style.display = "none"); 
    }
  }

  XL.Modal.prototype.show = function(option) {
    this.hide();
    if(this.$parent) {
      this.$parent.showModal();
      this.$parent.$model.set("isShow", true);
    } else {
      // 显示的时候才去监听事件，1：
      this._listenOrRelisten();
      var el = document.querySelector("#" + this.id);
      if(this.$model) {
        // 保存template
        if(!this._template) {
          this._template = el.querySelector(".pop-template").innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        }
        var view = XV.create({
          $el: el.querySelector(".pop-container"),
          template:  this._template,
          $model: this.$model
        })
        view.render();
      }
      el && (el.style.display = "block");
    }
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
      _setData: function(attr, value, ifRender){
        var preMd5 = MD5(this._data);
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
        var nowMd5 = MD5(this._data);
        if(preMd5 !== nowMd5 && ifRender) {
           this.trigger("render");
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
        this.reset();
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
              XL._extend(_this, res.data);
              // 同时model的_data和_prevData属性也备份一份
              XL._extend(_this._data, res.data);
              _this.status = FULFILLED;
              // 这个位置很重要，因为调用这个函数等于告诉view可以渲染了
              _this._onReadyData();
              if(ifRender) {
                _this.trigger("render");
                return;
              } 
              // 获取数据后，通知视图更新
              _this._autoRender && _this.trigger("render");
            } else {
              _this.status = REJECTED;
            }
          }
        })
      },
      refresh: function(initData) {
        // this.reset();
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

    // 如果有data对象，实现代理，直接挂到instance对象下
    var data = obj.data;
    if (data && XL.isPlainObject(data)) {
      XL._extend(instance, data);
      // 同时model的_data属性也备份一份
      XL._extend(instance._data, data);
    }

    // 生命周期beforeFetchData
    if(obj.beforeFetchData && obj.beforeFetchData instanceof Function) {
      instance.beforeFetchData = obj.beforeFetchData
    }
    
    if(obj.url) {
      instance.url = obj.url;
      instance._rootUrl = obj.url;
      instance.type = obj.type;
      instance.fetchData();
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
        this.$model._data.status = this.$model.status;
        var html = this.template(this.$model._data);
        if(XL.isDOM(this.$el)) {
          this.$el.innerHTML = html;
        } else {
          document.querySelector(this.$el).innerHTML = html;
        }
        // $(this.$el).html(html);
      },
      /**
       * 渲染该view挂载的dom
       */
      render: function () {
        var _this = this;
        var model = this.$model;
        _this._beforeRender();
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
      rendered: function() {}
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
    var events = obj.events;
    if (events && XL.isPlainObject(events)) {
      _.each(events, function(callback, event_element) {
        var type = event_element.split(/\s+/)[0].split(/:/).join(" ");
        var selector = event_element.split(/\s+/)[1] || instance.$el;
        if(!instance[callback]) {
          throw new Error("there is no method called " + callback);
          return;
        }
        // 监听事件，冒泡的方式
        XL.EventUtil.on(document.querySelector(obj.$el), type, function(evt) {
          if(XL.EventUtil.getTarget(evt) === document.querySelector(selector)) {
            instance[callback](evt);
          }
        });
        // $("body").on(type, selector, instance[callback].bind(instance));
      })
    }

    // template
    if (!obj.template) {
      throw new Error("template attribute is required");
    } else {
      if(typeof obj.template !== 'function') {
        instance.template = _.template(obj.template);
      } else {
        instance.template = obj.template;
      }
    }

    // 通过函数节流的方式来渲染dom，避免性能浪费
    instance._delayRender = function() {
      return XL.throttle(function() {
        // console.log('执行：' + (++window.count));
        this.beforeRender && this.beforeRender()
        var model = this.$model._data;
        var html = this.template(model);
        if(XL.isDOM(this.$el)) {
          this.$el.innerHTML = html;
        } else {
          document.querySelector(this.$el).innerHTML = html;
        }
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

