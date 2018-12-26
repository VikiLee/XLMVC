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

function getAttributes(el) {
    var keys = el.getAttributeNames();
    var attrs = {};
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        attrs[key] = el.getAttribute(key);
    }
    return attrs;
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
    var attrs = Object.assign({}, newAttrs, oldAttrs);
    for(var key in attrs) {
        if(newAttrs[key] !== oldAttrs[key]) {
            // 新加属性
            pathces.push({
                type: CREATE_ATTR,
                key,
                value: attrs[key]
            })
        } else if(!newAttrs[key]) {
            // 删除属性
            pathces.push({
                type: REMOVE_ATTR,
                key
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
        console.log('create', newVnode.tagName || 'TEXT');
        return {
            type: CREATE,
            newVnode
        };
    }
    // 删除
    if(isNull(newVnode)) {
        console.log('remove', oldVnode.tagName || 'TEXT');
        return {
            type: REMOVE
        };
    }
    // 替换
    if(isDiffNode(newVnode, oldVnode)) {
        console.log('remove', oldVnode.tagName || 'TEXT');
        return {
            type: REPLACE,
            newVnode
        }
    }
    // 更新(text的情况下没有attr和children的)
    if(newVnode.tagName) {
        console.log('update', newVnode.tagName || 'TEXT');
        return {
            type: UPDATE,
            attrs: diffAttrs(newVnode, oldVnode),
            children: diffChildren(newVnode, oldVnode)
        }
    }
   
}

// patch.js
function patchAttrs(el, patchs) {
    for(var patch of patchs) {
        if(patch.type === CREATE_ATTR) {
            el.removeAttribute(patch.key);
        } else if(patch.type === REMOVE_ATTR) {
            el.setAttribute(patch.key, patch.value);
        }
    }
}

function patch(parent, patches, index) {
    parent = typeof parent === 'string' ? document.querySelector(parent) : parent;

    var el = null;
    // index没有值的时候，是最开始的入口，这个时候获取的最原始的DOM，不能用childNodes（childNodes有text节点）
    if(index === undefined) {
        el = parent.children[0];
    } else {
        el = parent.childNodes[index];
    }

    if (!patches) {
        return
    }

    switch(patches.type) {
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
            var {attrs, children} = patches;
            patchAttrs(el, attrs);
            for (var i = 0, len = children.length; i < len; i++) {
                patch(el, children[i], i);
              }
            break;
        }
            
    }
}

function createVnode(el) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var attrs = {}, c = [];
    // nodeType为3则是文本类型
    if(el.nodeType !== 3) {
        var keys = el.getAttributeNames();
        for(var i = 0; i < keys.length; i++) {
          var key = keys[i];
          attrs[key] = el.getAttribute(key);
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