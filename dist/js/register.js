"use strict";

$(function () {
  /* 
  1 绑定 获取验证码 tap事件
    1 获取手机号码 进行合法性的验证
      1 不通过 给出一个用户提示 就ok
  2 构造参数 发送请求到后台   成功了
    1 禁用按钮   $(this).attr("disabled","disabled");
    2 开启定时器 倒计时 60s
      1 修改按钮的文字 定时的时间
    3 时间到了 
      1 清除定时器
      2 重新启用 按钮
     */
  init();

  function init() {
    eventList();
  }

  function eventList() {
    // 绑定 获取验证码 点击事件
    $(".get_code_btn").on("tap", function () {
      // attr $ 动态添加属性的方法
      // disabled 标签本身就支持的 禁用属性
      // $(this).attr("disabled","disabled");
      // 1 获取手机 进行验证 属性选择器  trim 去除掉 值两边 的空格 “   15155515    ”
      var mobile_txt = $("input[name='mobile']").val().trim(); // 1.1 手机号码合法性判断  找工具函数 正则表达式！！！

      if (!checkPhone(mobile_txt)) {
        //  失败
        // 1.2 弹出一个提示
        mui.toast("手机号码错误");
        return;
      } //  2 构造参数发送到后台


      $.post("http://api.pyg.ak48.xyz/api/public/v1/users/get_reg_code", {
        mobile: mobile_txt
      }, function (result) {
        if (result.meta.status == 200) {
          console.log(result); // 成功 
          // 2.1 禁用按钮

          $(".get_code_btn").attr("disabled", "disabled"); //  2.2 开启 定时器
          // 要倒计时的总时间 5s

          var time = 5;
          $(".get_code_btn").text("".concat(time, " \u79D2\u540E\u518D\u83B7\u53D6"));
          var timeId = setInterval(function () {
            time--;
            $(".get_code_btn").text("".concat(time, " \u79D2\u540E\u518D\u83B7\u53D6")); // 2.3 判断时间是否到期了

            if (time == 0) {
              // 2.3.1 清除定时器
              clearInterval(timeId); // 2.3.2 启用按钮 修改按钮文字

              $(".get_code_btn").removeAttr("disabled").text("获取验证码");
            }
          }, 1000);
        } else {
          console.log("失败", result);
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
//# sourceMappingURL=register.js.map
