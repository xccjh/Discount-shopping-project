"use strict";

$(function () {
  /* 
  1 实现了静态布局
  2 首页动态渲染数据
    1 左侧菜单是全部渲染 
    2 右侧的内容 是 根据左侧 被选中的菜单 才开始 渲染 
    3 写两个方法  (页面用到的数据 只要发送一次请求去获取 就可以提供给下次下次 使用 )
      渲染左边（）
      渲染右边（）
  3 点击左侧菜单
    1 左侧菜单被 激活选中
    2 右侧的内容 动态跟着渲染
      1 先获取 被点击的li标签的索引
    4 实现分类页面缓存的功能   过期时间
    1 通俗的缓存的实现 
      在发送请求的之前 先判断 
        本地存储中有没有 接口数据 
        有 = 先判断数据有没有过期  没有过期 再使用 缓存 数据过期 也是 要发送请求去获取新的数据
        没有 再发送请求去获取数据
    2 技术难点
      1 用那个本地存储 永久  会话 ？
      2 看需求而定 都行！！！！  会话 就是使用它  为什么 心情好！！！
      3 本地存储 存的数据类型 比如 简单类似 数字 或者 对象 有坑吗？ 本地存储在存数据进去之后 都会把数据转成 字符串类型
          对象类型 直接转成字符串 会导致  数据丢失  先把数据 转成 json字符串 再存入 获取之后 使用之前 json 解析
    3 代码的逻辑  key:cates
      1 先发送请求 获取 数据 再存进去 
      2 在发送请求之前 先获取一下 会话存储中的数据 
    5 使用iscroll插件来实现 左右两个 弹簧效果 
      1 必须要引入 插件
      2 修改样式 有两个滚动条效果
        1 原生css的滚动条  overflow:hidden;
        2 iscroll js 实现 滚动效果 
      3 看着 iscroll的文档来实现效果 
        1 保证你的标签结构和 文档一致 右侧结构 需做个修改
        2 使用js来进行初始化 必须保证标签生成了  拥有了高度 再做初始化
          1 图片标签 都生成 但是内容 不一定马上请求回来 马上拥有高度 
          2 图片的onload 事件 搭配 js 逻辑来找到 最后一张加载的图片 进行 初始化
      6 分类页面使用rem单位
      
   */
  //  全局变量 存放 接口的返回数据 result.data
  var CateDatas;
  init();

  function init() {
    renderDatas();
    eventList();
  } // 负责 绑定 页面当中的 一坨事件


  function eventList() {
    // 1 左侧菜单的点击事件  委托 委派
    // touchstart 原生的触屏事件  
    $(".left_menu ").on("tap", "li", function () {
      $(this).addClass("active").siblings().removeClass("active"); // 获取 被点击的li标签的索引 $(this).index()

      var index = $(this).index();
      renderRight(index);
    });
  } // 0 渲染数据 数据来源 一处是发送ajax获取 一处是 从本地存储中获取


  function renderDatas() {
    // 1 先获取会话存储中的数据  null  有数据的时候 字符串类型
    var sessStr = sessionStorage.getItem("cates"); // 2 判断有没有数据

    if (!sessStr) {
      // 没有数据  发送请求来获取新数据
      categories();
    } else {
      // console.log("有数据 准备使用缓存数据");
      // 把缓存数据 重新解析成 对象格式
      var sessObj = JSON.parse(sessStr); // 有数据 先判断一下 数据是否过期 已经过期了 又发送请求去获取   过期时间 60s

      if (Date.now() - sessObj.time > 60000) {
        // 过期
        console.log("数据过期了 需要重新发送请求获取数据");
        categories();
      } else {
        console.log("数据未过期 可以使用 渲染数据"); // 获取旧的要渲染的数据

        CateDatas = sessObj.data; // 渲染左边

        renderLeft(); // 渲染右边

        renderRight(0);
      }
    }
  } // 1 发请求获取数据


  function categories() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/categories", function (result) {
      // 判断请求是否成功
      if (result.meta.status == 200) {
        // 成功
        // 获取要渲染左侧的数据
        CateDatas = result.data; // 存入 接口的数据  CateDatas=[]   {data:CateDatas,time:当前的时间} 
        // 把对象先转成  json 对象

        var sessionObj = {
          data: CateDatas,
          time: Date.now()
        };
        sessionStorage.setItem("cates", JSON.stringify(sessionObj)); // 渲染左边

        renderLeft(); // 渲染右边

        renderRight(0);
      } else {
        console.log("失败", result);
      }
    });
  } // 2 渲染左边


  function renderLeft() {
    // 要拼接的左侧的html
    var leftHtml = "";

    for (var i = 0; i < CateDatas.length; i++) {
      // let activeCls=i==0?"active":"";
      var tmpHtml = "\n                <li class=\"".concat(i == 0 ? "active" : "", "\">").concat(CateDatas[i].cat_name, "</li>\n                ");
      leftHtml += tmpHtml;
    } // 把数据插入到 左侧容器中


    $(".left_menu").html(leftHtml); // 初始化左侧滚动条

    var leftScroll = new IScroll('.left_box');
  } // 3 渲染右边


  function renderRight(index) {
    // 获取 大家电的数据
    var item2Obj = CateDatas[index]; // 获取右侧内容 需要循环的数据

    var rightData = item2Obj.children; // console.log(rightData);

    var rightHtml = template("rightTpl", {
      arr: rightData
    });
    $(".right_box").html(rightHtml); // 标签肯定已经生成了 但是图片还没有高度 内容 是 缓慢去加载 
    // 必须等待 最后一张 图片都  加载完了 onload   再做初始化
    // 最后一张 不是指 索引的最后 一张 而是 最后 加载完毕的一张 
    // img.onload 事件 会在 图片加载完毕之后 自动触发  
    // 获取要动态渲染的图片的长度

    var imgLength = $(".right_box img").length;
    $(".right_box img").on("load", function () {
      imgLength--;

      if (imgLength === 0) {
        // console.log("最后一张图片加载完毕了");
        var rightScroll = new IScroll(".right_box");
      } // console.log("初始化的次数");

    });
  }
});
//# sourceMappingURL=category.js.map
