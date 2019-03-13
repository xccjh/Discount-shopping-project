"use strict";

$(function () {
  /* 
  1 点击 “加入购物车” tap事件
    1 获取本地存储中的一个   userinfo
    2 判断 userinfo 是否为null 
      1 null 没有登录过    =>   1 弹出对话框 您还没登录 2 延迟跳转页面 登录页面
    3 登录过了 构造参数 完成 添加到 购物车的功能
  
   */
  init();

  function init() {
    goodsDetail();
    eventList();
  }

  function eventList() {
    // 绑定 加入购物车 点击 事件
    $(".shopping_car_btn").on("tap", function () {
      // 1 获取 本地存储中的数据 userinfo sessionStorage
      // 要么是正常 字符串 要么就是 null
      var userStr = sessionStorage.getItem("userinfo"); // 1.1 判断是否存在

      if (!userStr) {
        mui.toast("您还没有登录");
        setTimeout(function () {
          // 把 当前的url存入到会话存储中 方便 登录成功之后 跳回来
          sessionStorage.setItem("pageurl", location.href);
          location.href = "login.html";
        }, 1000);
      } else {
        console.log("已经登录过了 准备添加到购物车");
      }
    });
  }

  function goodsDetail() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/goods/detail", {
      goods_id: getUrl("goods_id")
    }, function (result) {
      // console.log(result);
      if (result.meta.status == 200) {
        //  模板需要渲染 整个商品的详情部分  所有的数据都要传递到 模板引擎中
        var data = result.data; // data={... pics:[]}

        var html = template("mainTpl", data); // let html=template("mainTpl",{pics:data.pics,goods_name:艾美特});
        // let html=template("id",{arr:result.data})   第二个参数的格式是一个对象

        $(".pyg_view").html(html); // 轮播图的js 初始

        var gallery = mui(".mui-slider");
        gallery.slider({
          interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；

        });
      } else {
        console.log("请求失败", reslut);
      }
    });
  } // 获取url上的参数 的值


  function getUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
});
//# sourceMappingURL=good_detail.js.map
