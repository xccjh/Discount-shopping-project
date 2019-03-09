"use strict";

$(function () {
  /* 
  1 实现了静态布局
  2 动态渲染数据
    1 左侧菜单是全部渲染 
    2 右侧的内容 是 根据左侧 被选中的菜单 才开始 渲染 
    3 写两个方法  (页面用到的数据 只要发送一次请求去获取 就可以提供给下次下次 使用 )
      渲染左边（）
      渲染右边（）
   */
  //  全局变量 存放 接口的返回数据 result.data
  var CateDatas;
  init();

  function init() {
    categories();
  } // 1 发请求获取数据


  function categories() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/categories", function (result) {
      // 判断请求是否成功
      if (result.meta.status == 200) {
        // 成功
        // 获取要渲染左侧的数据
        CateDatas = result.data; // 渲染左边

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


    $(".left_menu").html(leftHtml);
  } // 3 渲染右边


  function renderRight(index) {
    // 获取 大家电的数据
    var item2Obj = CateDatas[index]; // 获取右侧内容 需要循环的数据

    var rightData = item2Obj.children; // console.log(rightData);

    var rightHtml = template("rightTpl", {
      arr: rightData
    });
    $(".right_box").html(rightHtml);
  }
});
//# sourceMappingURL=category.js.map
