"use strict";

$(function () {
  /* 
  1 任何人都可以访问这个购物车页面吗   登录过后的用户 才可以访问
    1 判断 本地存储中有没有  userinfo 这个数据  有 登录过
      假如 没有数据 
        1 把当前的页面路径存入到 本地存储中 pageurl
        2 跳转到登录页面
  2 发送请求渲染数据 私人的数据  token  请求头 
    1 token  本地存储 复杂类型
   */
  init();

  function init() {
    cartAll();
  } // 获取购物车数据


  function cartAll() {
    // let obj={ name:"猪八戒", skill:"卖队友" };
    // // es5 
    // // let name=obj.name;
    // // let skill=obj.skill;
    // // es6  解构的语法
    // let {name,skill}=obj;
    // console.log(name,skill);
    // 2.1 获取本地存储中的token 字段
    var token = JSON.parse(sessionStorage.getItem("userinfo")).token; // es6  解构 node js es 6  解构 知识点
    // let {token}=JSON.parse(sessionStorage.getItem("userinfo"));
    // $.get 没有办法 设置请求头

    $.ajax({
      url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/all",
      // type:"get"
      // data:{}
      headers: {
        "Authorization": token
      },
      success: function success(result) {
        // console.log(result);
        if (result.meta.status == 200) {
          // 以前循环的数据都是数组 但是现在 是对象
          // 数组可以循环 对象可以循环
          // 要传递给模板引擎的数据  
          var cart_info = JSON.parse(result.data.cart_info);
          console.log(cart_info);
          var html = template("mainTpl", {
            goodsObj: cart_info
          });
          $(".order_list").html(html); // 数字输入框的初始化

          mui(".mui-numbox").numbox();
        } else {
          console.log("失败", result);
        }
      }
    });
  }
});
//# sourceMappingURL=cart.js.map
