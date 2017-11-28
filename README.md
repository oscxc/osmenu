![](logo.png)

#  JavaScript 二级菜单组件

**实现原因**:

  &emsp;单、多页面框架都需要这样一个菜单

**优点**:

  &emsp;1、易用

  &emsp;2、多功能配置

  &emsp;3、样式控制灵活

  &emsp;4、使用svg图标数据，拒绝懒加载字体图标

  &emsp;5、支持多个实例

**缺点**:

  &emsp;1、仅支持二级

## 获取和引用 osmenu

**简单粗暴方式（必须首先提供的方式）**

  [`下载最新版本`](https://github.com/oscxc/osmenu/releases) && 使用标签引用

```
<link rel="stylesheet" href="styles/osmenu.css">

<script src="osmenu.js"></script>
```

**npm + CommonJS 方式**

```
npm install osmenu
```

```
var menu = require('osmenu');
```

## Usage examples

1、基本使用：[`examples/basic.html`](https://oscxc.github.io/osmenu/examples/basic.html)

2、添加图标：[`examples/icon.html`](https://oscxc.github.io/osmenu/examples/icon.html)

3、获取svg图标：[`Meterial Design`](https://materialdesignicons.com/)
## 配置项速查
<table>
  <tr>
    <td> data </td>
    <td> 创建菜单需要的数据（详见demo）  </td>
  </tr>
  <tr>
    <td> open </td>
    <td> true | false | number  默认展开所有菜单 </td>
  <tr>
    <td> activeIndex </td>
    <td>  false | [number,number] | name  活动状态的菜单索引 </td>
  </tr>
  <tr>
      <td> mode </td>
      <td>  true | false    默认执行回调、false打开跳转链接</td>
  </tr>
  <tr>
      <td> loadRunCallback </td>
      <td>  创建完成之后是否执行回调 </td>
  </tr>
  <tr>
      <td> callback </td>
      <td>  点击菜单触发的回调 </td>
  </tr>
</table>

## 联系我们

欢迎加入下面QQ群

![](https://oscxc.github.io/Images/doc/contact.jpg)
