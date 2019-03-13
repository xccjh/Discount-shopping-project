"use strict";

$(function () {
  /* 
  1 点击登录按钮
    1 获取 用户名和密码
    2 合法性的验证 不通过 弹窗 给提示 
  2 构造参数  发送请求完成 登录
    1 登录成功
      1 把token存到本地存储中  既然要存数据 干脆 整个result.data 都存起来 方便后期 扩展使用
      2 登录成功的提示  延迟一会 再跳转页面
   */
  init();

  function init() {
    eventList();
  }

  function eventList() {
    // 点击 登录 按钮事件
    $(".login_btn").on("tap", function () {
      /* 
      1 获取用户名和密码
       */
      var username_text = $("input[name='username']").val().trim();
      var password_text = $("input[name='password']").val().trim(); // 1.2 验证合法性

      if (!checkPhone(username_text)) {
        // 不通过 
        mui.toast("手机不合法");
        return;
      }

      if (password_text.length < 6) {
        // 不通过 
        mui.toast("密码不合法");
        return;
      } // console.log("验证合法了");
      // 2 构造参数 准备执行 登录


      $.post("http://api.pyg.ak48.xyz/api/public/v1/login", {
        username: username_text,
        password: password_text
      }, function (result) {
        console.log(result);

        if (result.meta.status == 200) {
          // 成功了
          // 2.1  把数据 存入到 本地存储中  存对象的时候 要 先转成json字符串 否则会导致一个数据丢失
          sessionStorage.setItem("userinfo", JSON.stringify(result.data)); // 2.1.2 提示用户 延迟跳转 先 跳到 首页

          mui.toast("登录成功");
          setTimeout(function () {
            location.href = "index.html";
          }, 1000);
        } else {
          // 错误
          mui.toast(result.meta.msg);
        }
      });
    });
  } // 验证 手机合法性


  function checkPhone(phone) {
    if (!/^1[34578]\d{9}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  }
});
//# sourceMappingURL=login.js.map
