
'use strict';
(function (f) {
    if (typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = f;
    }
    else{
        window.osmenu = f;
    }
})(function (mycfg) {

    function type(v) {
        return Object.prototype.toString.apply(v).slice(8,-1);
    }

    function extend(t,o) {
        for(var n in o){
            t[n]=o[n] ;
        }
    }

    function each(v,f) {
        var t = type(v);
        if (t==='Array'||t==='NodeList'||t==='Arguments') {
            for (var i=0;i<v.length;i++) {
                f(i,v[i]);
            }
        }
        else if(t==='Object'){
            for (var key in v) {
                f(key,v[key]);
            }
        }
        else if(t==='Number'){
            for (var i=0;i<v;i++) {
                f(i,v);
            }
        }
        else{
            throw new TypeError('该对象不支持遍历');
        }
    }

    function create(tagName,attrs) {
        var el;
        switch (tagName){
            case "text":
                el = document.createTextNode(attrs);
                break;
            case "comment":
                el = document.createComment(attrs);
                break;
            case "fragment":
                el = document.createDocumentFragment();
                break;
            default:
                el = document.createElement(tagName);
                if(attrs){
                    each(attrs,function (k,v) {
                        el.setAttribute(k,v);
                    });
                }
                break;
        }
        return el;
    }

    function createDiv(className) {
        return create('div',{
            'class':className
        });
    }

    function css(el,obj) {
        if(type(obj)==='String'){
            return window.getComputedStyle(el).getPropertyValue(obj);
        }
        else {
            each(obj,function (k,v) {
                el.style[k] = v;
            });
        }
    }

    function insert(el,data,_mode) {
        var mode = _mode?_mode:'beforeEnd';
        var arr = type(data)=='Array'?data:[data];
        each(arr,function (k,v) {
            if(type(v)=='String'){
                el.insertAdjacentHTML(mode, v);
            }
            else{
                el.insertAdjacentElement(mode, v);
            }
        });
        return el;
    }

    // 菜单折叠和展开需要一个改变元素高度的动画
    function H(el,sh,eh,time) {

        var value = sh;
        var n = Math.ceil(time * 60 / 1000);
        var step = (eh - sh) / n;

        function change() {
            n--;
            value += step;
            if(n>0){
                if(n===1){
                    value = eh;
                }
                el.style.height = value + 'px';
                requestAnimationFrame(change);
            }
        }
        requestAnimationFrame(change);
    }

    // 创建菜单需要的核心函数
    var menucore = {
        // 每个Box含有一个Title和多个Item
        createItem: createDiv,
        createTitle:createDiv,
        createBox:createDiv,
        // 创建svg图标（每个 Title 或 Item 可能含有图标和文字）
        createSvgIcon:function (obj) {
            function create(name) {
                return document.createElementNS('http://www.w3.org/2000/svg',name);
            }
            function attr(el,p,v) {
                el.setAttribute(p,v);
            }
            var path = create('path');
            attr(path,'fill',obj.color?obj.color:'black');
            attr(path,'d',obj.data);
            var svg = create('svg');
            attr(svg,'viewBox',obj.viewBox?obj.viewBox:'0 0 24 24');

            if(obj.className){
                attr(svg,'class',obj.className);
            }
            svg.appendChild(path);
            return svg;
        },
        // svg图标内容切换
        setSvgData:function (svg,data) {
            svg.childNodes[0].setAttribute('d',data);
        },
        // 创建显示文字（每个 Title 或 Item 可能含有图标和文字）
        createText:function (text) {
            var el = create('span');
            el.innerHTML = text;
            return el;
        }
    };

    //默认配置
    var cfg = {
        data:{},// 菜单数据
        open:true,// true|false|number
        activeIndex:[0,0], // false|[number,number]|菜单名
        changeTime: 240, // 菜单展开和收缩动画时间  毫秒为单位
        mode:false,   // true|false   true打开跳转链接 false执行回调
        loadRunCallback:true, // 第一次加载之后执行回调
        callback:function () {}
    };
    extend(cfg,mycfg);

    var open_close = cfg.data.open && cfg.data.close && cfg.data.open != '' && cfg.data.close != '';
    var el = create('div',{
        'class':'osmenu'
    });

    var boxList = [];

    var data = cfg.data.data;
    // 创建元素
    for(var i=0;i<data.length;i++){
        //每个菜单创建box
        var box = menucore.createBox('menu-box');
        box.open = true;
        //每个菜单创建title及其子元素
        box.tit = menucore.createTitle('box-title');
        if(data[i].title.svg && data[i].title.svg !=''){
            box.tit.icon = menucore.createSvgIcon({
                data:data[i].title.svg
            });
            insert(box.tit,box.tit.icon);
        }

        box.tit.text = menucore.createText(data[i].title.name);
        insert(box.tit,box.tit.text);
        if(open_close){
            box.tit.open_close = menucore.createSvgIcon({
                data:cfg.data.open
            });
            insert(box.tit,box.tit.open_close);
        }

        //title添加到box
        insert(el,insert(box,box.tit));

        //遍历创建item及其子元素 并添加到box
        var items = data[i].items;
        box.items = [];
        for(var j=0;j<items.length;j++){
            box.items[j] = menucore.createItem('box-item');
            if(items[j].svg  && items[j].svg != ''){
                box.items[j].icon = menucore.createSvgIcon({
                    data:items[j].svg
                });
                insert(box.items[j],box.items[j].icon);
            }
            if(items[j].url && items[j].url != ''){
                box.items[j].url = items[j].url;
            }
            box.items[j].text = menucore.createText(items[j].name);
            insert(box,insert(box.items[j],box.items[j].text));
        }
        boxList.push(box);
    }
    // menu添加到body
    insert(document.body,el,'afterBegin');

    // 获取每个item的高度，必须先添加到页面渲染出来才能获取到有效值
    var itemH = boxList[0].items[0].getBoundingClientRect().height;
    var titleH = boxList[0].tit.getBoundingClientRect().height;

    // 处理 cfg.open 配置
    if(cfg.open!==true){
        for(var i=0;i<boxList.length;i++){
            boxList[i].open=false;
        }
        if(cfg.open!==false){
            boxList[cfg.open].open=true;
        }
    }
    for(var i=0;i<boxList.length;i++){
        if(!boxList[i].open){
            if(open_close){
                menucore.setSvgData(boxList[i].tit.open_close,cfg.data.close);
            }
            boxList[i].style.height = titleH + 'px';
        }
    }

    // 处理 cfg.activeIndex 配置
    var activeIndex;
    if(cfg.activeIndex!=false){
        if(type(cfg.activeIndex)=="String"){
            for(var i=0;i<data.length;i++){
                var flag = false;
                for(var j=0;j<data[i].items.length;j++){
                    if(cfg.activeIndex==data[i].items[j].name){
                        activeIndex=[i,j];
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    break;
                }
            }
        }
        else{
            activeIndex = cfg.activeIndex;
        }
    }
    else{
        activeIndex = false;
    }
    function removeActive() {
        boxList[activeIndex[0]].tit.classList.remove('title-active');
        boxList[activeIndex[0]].items[activeIndex[1]].classList.remove("item-active");
    }
    function setActive() {
        if(activeIndex!=false){
            boxList[activeIndex[0]].tit.classList.add('title-active');
            boxList[activeIndex[0]].items[activeIndex[1]].classList.add("item-active");
        }
    }
    setActive();

    // 处理 cfg.loadRunCallback 配置
    if(cfg.loadRunCallback){
        if(activeIndex === false){
            throw new Error('使用错误：activeIndex 为 false，首次加载无法执行callback');
        }
        cfg.callback(boxList[activeIndex[0]].items[activeIndex[1]].text.innerText,activeIndex);
    }

    // 事件
    for(var i=0;i<data.length;i++){
        (function (i) {
            var box = boxList[i];
            box.tit.addEventListener('click',function () {
                var min = titleH,max = titleH + itemH * box.items.length;
                if(box.open){
                    if(open_close) {
                        menucore.setSvgData(this.open_close,cfg.data.close);
                    }
                    new H(box,max,min,cfg.changeTime);
                }
                else{
                    if(open_close) {
                        menucore.setSvgData(this.open_close,cfg.data.open);
                    }
                    new H(box,min,max,cfg.changeTime);
                }
                box.open = !box.open;
            });

            for(var j=0;j<box.items.length;j++){
                (function (j) {
                    box.items[j].addEventListener("click",function () {
                        if(cfg.mode){
                            removeActive();
                            activeIndex = [i,j];
                            setActive();
                            cfg.callback(this.text.innerText,activeIndex);
                        }
                        else{
                            location.href = this.url;
                        }
                    });
                })(j);
            }
        })(i);
    }
});
