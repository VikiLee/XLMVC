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
