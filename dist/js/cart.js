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
    2 对象也是可以循环
    3 计算总价 
    1 页面打开的时候就计算总价格
    2 点击数字输入框的时候 也是需要计算总价
      1 绑定点击事件
      2 点击触发 再调用 刚才 计算总价的方法
   */
  init();

  function init() {
    cartAll();
    eventList();
  }

  function eventList() {
    // 绑定 数字输入框的编辑按钮点击 事件  +  - 
    $(".order_list").on("tap", " li .goods_num_tool button", function () {
      // console.log("被点击了");
      // 调用计算总价格的方法
      additionAll();
    });
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
        Authorization: token
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

          mui(".mui-numbox").numbox(); // 计算总价格

          additionAll();
        } else {
          console.log("失败", result);
        }
      }
    });
  } // 计算购物车总价格


  function additionAll() {
    /* 
    0 把每一种 商品的信息 提前放入到 li标签的自定义属性中，方便后期的获取 
      修改一下 模板引擎的代码 
    1 获取 所有的li标签 里面   商品信息对象
    2 对li标签的商品信息对象数组 进行循环
    3 在循环中
      1 每一种商品的单价 * 该商品的数量(数字输入框里面的值)
      2 需要叠加之后的总价格 渲染到页面的对应的标签上 
     */
    //  1 获取所有的li标签 $lis是一个jq对象
    var $lis = $(".order_list li"); // console.log($lis);
    // 定义总价

    var total = 0; // 2 进行循环

    for (var i = 0; i < $lis.length; i++) {
      // 3.1 获取到每一个 li标签的dom对象  js 原生的dom对象
      var li = $lis[i]; // 3.2 获取li标签身上的 商品信息对象   如何通过原生的js 获取 标签上的 data- 属性的值   dom.dataset.属性名 
      // <li data-obj="1233"></li >

      var tmpObj = $(li).data("obj"); // 获取该商品的单价

      var tmpPrice = tmpObj.goods_price; // 获取要购买的商品的数量 

      var tmp_num = $(li).find(".mui-numbox-input").val();
      total += tmpPrice * tmp_num;
    } // 把总价格 赋值到对应的标签上


    console.log(total);
    $(".total_price").text(total);
  }
});
//# sourceMappingURL=cart.js.map
