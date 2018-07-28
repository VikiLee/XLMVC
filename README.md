### 主要特性

- 支持“标准”Markdown / CommonMark和Github风格的语法，也可变身为代码编辑器；
- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；
- 支持ToC（Table of Contents）、Emoji表情、Task lists、@链接等Markdown扩展语法；
- 支持TeX科学公式（基于KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;
- 支持识别和解析HTML标签，并且支持自定义过滤标签解析，具有可靠的安全性和几乎无限的扩展性；
- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；
- 兼容主流的浏览器（IE8+）和Zepto.js，且支持iPad等平板设备；
- 支持自定义主题样式；

# Editor.md

![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)

![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

**目录 (Table of Contents)**

[TOCM]

[TOC]

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
# Heading 1 link [Heading link](https://github.com/pandao/editor.md "Heading link")
## Heading 2 link [Heading link](https://github.com/pandao/editor.md "Heading link")
### Heading 3 link [Heading link](https://github.com/pandao/editor.md "Heading link")
#### Heading 4 link [Heading link](https://github.com/pandao/editor.md "Heading link") Heading link [Heading link](https://github.com/pandao/editor.md "Heading link")
##### Heading 5 link [Heading link](https://github.com/pandao/editor.md "Heading link")
###### Heading 6 link [Heading link](https://github.com/pandao/editor.md "Heading link")

#### 标题（用底线的形式）Heading (underline)

This is an H1
=============

This is an H2
-------------

### 字符效果和横线等
                
----

~~删除线~~ <s>删除线（开启识别HTML标签时）</s>
*斜体字*      _斜体字_
**粗体**  __粗体__
***粗斜体*** ___粗斜体___

上标：X<sub>2</sub>，下标：O<sup>2</sup>

**缩写(同HTML的abbr标签)**

> 即更长的单词或短语的缩写形式，前提是开启识别HTML标签时，已默认开启

The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

### 引用 Blockquotes

> 引用文本 Blockquotes

引用的行内混合 Blockquotes
                    
> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

### 锚点与链接 Links

[普通链接](http://localhost/)

[普通链接带标题](http://localhost/ "普通链接带标题")

直接链接：<https://github.com>

[锚点链接][anchor-id] 

[anchor-id]: http://www.this-anchor-link.com/

GFM a-tail link @pandao

> @pandao

### 多语言代码高亮 Codes

#### 行内代码 Inline code

执行命令：`npm install marked`

#### 缩进风格

即缩进四个空格，也做为实现类似`<pre>`预格式化文本(Preformatted Text)的功能。

    <?php
        echo "Hello world!";
    ?>
    
预格式化文本：

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

#### JS代码　

```javascript
function test(){
	console.log("Hello world!");
}
 
(function(){
    var box = function(){
        return box.fn.init();
    };

    box.prototype = box.fn = {
        init : function(){
            console.log('box.init()');

			return this;
        },

		add : function(str){
			alert("add", str);

			return this;
		},

		remove : function(str){
			alert("remove", str);

			return this;
		}
    };
    
    box.fn.init.prototype = box.fn;
    
    window.box =box;
})();

var testBox = box();
testBox.add("jQuery").remove("jQuery");
```

#### HTML代码 HTML codes

```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>Hello world!</title>
    </head>
    <body>
        <h1>Hello world!</h1>
    </body>
</html>
```

### 图片 Images

Image:

![](https://pandao.github.io/editor.md/examples/images/4.jpg)

> Follow your heart.

![](https://pandao.github.io/editor.md/examples/images/8.jpg)

> 图为：厦门白城沙滩

图片加链接 (Image + Link)：

[![](https://pandao.github.io/editor.md/examples/images/7.jpg)](https://pandao.github.io/editor.md/examples/images/7.jpg "李健首张专辑《似水流年》封面")

> 图为：李健首张专辑《似水流年》封面
                
----

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)
                
- 列表一
- 列表二
- 列表三
     
#### 无序列表（星号）Unordered Lists (*)

* 列表一
* 列表二
* 列表三

#### 无序列表（加号和嵌套）Unordered Lists (+)
                
+ 列表一
+ 列表二
    + 列表二-1
    + 列表二-2
    + 列表二-3
+ 列表三
    * 列表一
    * 列表二
    * 列表三

#### 有序列表 Ordered Lists (-)
                
1. 第一行
2. 第二行
3. 第三行

#### GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
    - [ ] GFM task list 3-1
    - [ ] GFM task list 3-2
    - [ ] GFM task list 3-3
- [ ] GFM task list 4
    - [ ] GFM task list 4-1
    - [ ] GFM task list 4-2
                
----
                    
### 绘制表格 Tables

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机      | $1600   |   5     |
| 手机        |   $12   |   12   |
| 管线        |    $1    |  234  |
                    
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell 

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Function name | Description                    |
| ------------- | ------------------------------ |
| `help()`      | Display the help window.       |
| `destroy()`   | **Destroy your computer!**     |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

| Item      | Value |
| --------- | -----:|
| Computer  | $1600 |
| Phone     |   $12 |
| Pipe      |    $1 |
                
----

#### 特殊符号 HTML Entities Codes

&copy; &  &uml; &trade; &iexcl; &pound;
&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot; 

X&sup2; Y&sup3; &frac34; &frac14;  &times;  &divide;   &raquo;

18&ordm;C  &quot;  &apos;

### Emoji表情 :smiley:

> Blockquotes :star:

#### GFM task lists & Emoji & fontAwesome icon emoji & editormd logo emoji :editormd-logo-5x:

- [x] :smiley: @mentions, :smiley: #refs, [links](), **formatting**, and <del>tags</del> supported :editormd-logo:;
- [x] list syntax required (any unordered or ordered list supported) :editormd-logo-3x:;
- [x] [ ] :smiley: this is a complete item :smiley:;
- [ ] []this is an incomplete item [test link](#) :fa-star: @pandao; 
- [ ] [ ]this is an incomplete item :fa-star: :fa-gear:;
    - [ ] :smiley: this is an incomplete item [test link](#) :fa-star: :fa-gear:;
    - [ ] :smiley: this is  :fa-star: :fa-gear: an incomplete item [test link](#);
 
#### 反斜杠 Escape

\*literal asterisks\*
            
### 科学公式 TeX(KaTeX)
                    
$$E=mc^2$$

行内的公式$$E=mc^2$$行内的公式，行内的$$E=mc^2$$公式。

$$\(\sqrt{3x-1}+(1+x)^2\)$$
                    
$$\sin(\alpha)^{\theta}=\sum_{i=0}^{n}(x^i + \cos(f))$$

多行公式：

```math
\displaystyle
\left( \sum\_{k=1}^n a\_k b\_k \right)^2
\leq
\left( \sum\_{k=1}^n a\_k^2 \right)
\left( \sum\_{k=1}^n b\_k^2 \right)
```

```katex
\displaystyle 
    \frac{1}{
        \Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{
        \frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {
        1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}}
         {1+\cdots} }
        } 
    }
```

```latex
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
```
                
### 绘制流程图 Flowchart

```flow
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
```
                    
### 绘制序列图 Sequence Diagram
                    
```seq
Andrew->China: Says Hello 
Note right of China: China thinks\nabout it 
China-->Andrew: How are you? 
Andrew->>China: I am good thanks!
```

### End


### 主要特性

- 基于jquery的简易前端MVC框架，省去繁琐的DOM操作；
- 支持dom事件和自定义事件，且model和view之间的事件保持一致，即model监听的事件，预制相对于的view可以触发；
- model支持后台获取数据，省去麻烦的ajax请求操作和繁琐的赋值操作
- 通过函数节流的方式防止dom过于频繁修改；
- 通过md5指纹判断数据是否改变，没有改变则不修改dom；


**目录 (Table of Contents)**

[TOCM]

[TOC]
# model
## 初始化
通过XM.create方法初始化
```
var model = XM.create({
    url: 'your url',
    params: {
      type: 'carton'
    },
    data: {
      title: 'xxx'
    }
  })
  ```
  初始化后，如果有url值，则会自动到url对应的后台拉取数据赋值给该model，**记住后台返回的接口数据必须放在data属性下**，eg:
  ```
  {
	  code: 0,
	  data: {
		title: 'xxx'
	  },
	  msg: 'msg'
  }
  ```
## 属性
### data：Object
data属性是该model对应的数据，建议先定义好，并设置好默认值，如上面的代码的title
### url: String
如果你想要让你的mode的data来源于后台，则需要配置url，配置好url后，会自动拉取改url对应的数据并将response的data属性对应的值添加到data属性当中
### params: Object
object类型，如果url当中需要带参数，则可以设置该值，框架会将其转为字符串并添加到url的查询参数当中
### methods: Object
object类型，自定义model方法。虽然model有自带的几个方法，但也支持自定义方法，并且自动将自定义方法里面的上下文绑定为该model。eg:
```
methods: {
	customeMethod1: function() {
		// your code, this is bind to  model itself
	},
	customeMethod2: function() {
		// your code
	}
}
```
### listeners
object类型，不管是model还是view，都支持事件，listeners设置自定义事件，key为事件名，function为事件处理函数。eg:
```
listeners: {
	eventName1: function() {
		// your event handle code
	}
}
```
## 方法
### get(attribute)
通过get方法可以获取到model的data对应的属性，当然也可以使用.操作符获取，但建议通过get方式来获取，eg:
```
model.get('title') // xxx 等同于model.title
```
### set(attribute, [value|ifRender], [ifRender])
通过set方法可以设置model的data值。attribute可以是简单的值，也可以是object，当attribute可以是简单的值的时候value是属性对应的值。当attribute是object的时候，value是ifRender。
ifRender表示设置为true的话，model对应的view会重新渲染，所以建议如果有频繁修改多个attribute切ifRender为true的时候，请使用下面第二种方式设置。eg:
```
// 设置data的某个attribute的值
model1.set('title', 'xxx')
// 设置多个attribute的值
model2.set({
	title: 'xxx',
	name: 'yyy'
})
```
### on(event, callback)
model监听事件，在 mode 上绑定一个callback回调函数。 只要event触发，该回调函数就会调用，并且回调函数的this绑定为该model。
该函数和listeners设置的事件可以达到相同的效果，两者皆可以监听事件。
只有该model或者该model(view的$model属性指定的model)对应的view才可以触发on或者listeners直接的事件。如果想要跨model/view触发/监听事件，请使用XEvent对象。
### trigger(event, [*args])
model触发事件，触发model/view对应监听的事件。如果想要给事件处理函数callback传参数，请设置args值。
### reset()
清空model的数据。
### resetParams(params)
重置model的params属性，并且会重新拉取数据（params都改了，数据能不重新拉取吗），适用于刷选条件
### fetchData([ifRender])
拉取后台数据，ifRender为true的时候，拉取完对应的view会自动渲染数据。
### getMoreData([succ])
拉取更多数据，数据分页的时候常用。在succ回调函数里面会传入response的data值，一般succ函数就用来将新拉取的数据append到原来的数据上面，或者重写原来的数据
### refresh([initData])
更新model数据，该方法会到后台重新拉取数据，在轮询的时候常用到。initData有值的时候，会将initData作为model的初始值添加到后台拉取的数据上
## 钩子函数
### afterReady()
该方法会在数据拉取完后调用，如果需要在数据拉取完以后进行一些列的操作的话，请定义该函数，比如后台返回的数据不能直接拿来用，需要进一步进行计算才能使用的情况下
# view
## 初始化
```
var view = XV.create({
    $model: model,
    $el: "#view",
    template: $("#viewTpl").html(),
    autoRender: true
  })
```
## 属性
### $el: String 必填
view需要渲染的dom元素的选择器，会将该view渲染到该dom下
### template: String 必填
设置view对应的模板，是underscore语法的模板
### $model: model 必填
view对应的model，view渲染的数据来源于该model
### autoRender: boolean
该属性定义了在model拉取完接口数据后要不要自动渲染到Dom当中，默认是false
### methods: Object
同model的的methods，不同的地方在于
### listeners: Object
同model的listeners
### events: Object
该属性以键值对的方式指定dom事件以及事件处理函数， eg:
```
events: {
	"click #id": "handler"
}
```
其中key必须用字符串包起来，以domEvent<space>selector的格式定义，value是methods属性指定的一个方法。
对于input propertychange这类需要空格隔开的事件，需要将空格改为“:”，这样定义key
```
events: {
	"input:propertychange #id": "inputChange"
}
```
##方法
### on(event, callback)
view监听事件，在 view 上绑定一个callback回调函数。 只要event触发，该回调函数就会调用，并且回调函数的this绑定为该view。
该函数和listeners设置的事件可以达到相同的效果，两者皆可以监听事件。
只有该view或者该view对应的model(view的$model属性指定的model)才可以触发on或者listeners直接的事件。如果想要跨model/view触发/监听事件，请使用XEvent对象。
### trigger(event, [*args])
view触发事件，触发model/view对应监听的事件。如果想要给事件处理函数callback传参数，请设置args值。
### render()
该方法进行dom的渲染，在model确切告诉view要渲染的时候会自动调用，或者用户也可以手动调用，如果view的autoRender设置为false的话，则需要手动调用来实现视图的渲染
## 钩子函数
### beforeCreate()
view初始化前调用
### created()
当view初始化后调用
### beforeRender()
view调用render前调用
### rendered()
当view渲染完视图时调用
