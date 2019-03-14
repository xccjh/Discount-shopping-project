"use strict";

$(function () {
  /* 
  1 要不要做权限控制 肯定要 
   */
  init();

  function init() {
    ordersAll();
  } // 查询订单


  function ordersAll() {
    var token = JSON.parse(sessionStorage.getItem("userinfo")).token;
    $.ajax({
      url: "http://api.pyg.ak48.xyz/api/public/v1/my/orders/all?type=1",
      headers: {
        Authorization: token
      },
      success: function success(result) {
        // console.log(result);
        if (result.meta.status == 200) {
          var arr = result.data;
          var html = "";

          for (var i = 0; i < arr.length; i++) {
            html += "\n                <li>\n                \u8BA2\u5355\u7F16\u53F7:\n                <br>\n                ".concat(arr[i].order_price, "\n                <br>\n                ").concat(arr[i].order_number, "\n              </li>\n                ");
          } // 渲染数据


          $("#item1 ul").html(html);
        } else {
          console.log("失败");
        }
      }
    });
  }
});
//# sourceMappingURL=order.js.map
