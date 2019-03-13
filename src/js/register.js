$(function() {
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
  3 绑定注册点击事件
    1 获取一坨值 表单一些值
    2 挨个验证
      1 不通过弹出对话框 提示
    3 构造参数 发送请求到后台 完成注册
      1 注册失败  手机号码已经被注册过了 弹出一个提示 
    4 注册成功
      1 弹出一个提示 恭喜用户 你进坑。。
      2 跳转页面 登录页面

   */
  init();
  function init() {
    eventList();
  }

  function eventList() {
    // 绑定 获取验证码 点击事件
    $(".get_code_btn").on("tap", function() {
      // attr $ 动态添加属性的方法
      // disabled 标签本身就支持的 禁用属性
      // $(this).attr("disabled","disabled");

      // 1 获取手机 进行验证 属性选择器  trim 去除掉 值两边 的空格 “   15155515    ”
      let mobile_txt = $("input[name='mobile']")
        .val()
        .trim();
      // 1.1 手机号码合法性判断  找工具函数 正则表达式！！！

      if (!checkPhone(mobile_txt)) {
        //  失败
        // 1.2 弹出一个提示
        mui.toast("手机号码错误");

        return;
      }  
      //  2 构造参数发送到后台
      // https://zhengzhicheng.cn/api/public/v1/home/floordata
      $.post(
        "http://api.pyg.ak48.xyz/api/public/v1/users/get_reg_code",
        // "/api/public/v1/users/get_reg_code",
        {
          mobile: mobile_txt
        },
        function(result) {
          if (result.meta.status == 200) {
            console.log(result);
            // 成功
            // 2.1 禁用按钮
            $(".get_code_btn").attr("disabled", "disabled");
            //  2.2 开启 定时器
            // 要倒计时的总时间 5s
            let time = 5;
            $(".get_code_btn").text(`${time} 秒后再获取`);
            let timeId = setInterval(() => {
              time--;
              $(".get_code_btn").text(`${time} 秒后再获取`);
              // 2.3 判断时间是否到期了
              if (time == 0) {
                // 2.3.1 清除定时器
                clearInterval(timeId);
                // 2.3.2 启用按钮 修改按钮文字
                $(".get_code_btn")
                  .removeAttr("disabled")
                  .text("获取验证码");
              }
            }, 1000);
          } else {
            console.log("失败", result);
          }
        }
      );
    });

    // 绑定 点击注册 的按钮 事件
    $(".register_btn ").on("tap", function() {
      // 3.1 获取一堆值
      let mobile_text = $("input[name='mobile']")
        .val()
        .trim();
      let code_text = $("input[name='code']")
        .val()
        .trim();
      let email_text = $("input[name='email']")
        .val()
        .trim();
      let pwd_text = $("input[name='pwd']")
        .val()
        .trim();
      let pwd2_text = $("input[name='pwd2']")
        .val()
        .trim();
      let gender_text = $("input[name='gender']:checked")
        .val()
        .trim();

      // 3.2 按个验证
      // 验证手机号码
      if (!checkPhone(mobile_text)) {
        //  失败
        // 1.2 弹出一个提示
        mui.toast("手机号码错误");

        return;
      }

      // 验证 验证码的长度 不等于  4 就是错误
      if (code_text.length != 4) {
        mui.toast("验证码不合法");
        return;
      }

      // 验证邮箱的合法性
      if (!checkEmail(email_text)) {
        mui.toast("邮箱不合法");
        return;
      }

      // 验证密码的合法性
      if (pwd_text.length < 6) {
        mui.toast("密码格式不对");
        return;
      }
      // 验证 重复密码
      if (pwd2_text != pwd_text) {
        mui.toast("两次密码不一致！");
        return;
      }

      // 3.3 构造参数 完成注册
      $.post(
        "http://api.pyg.ak48.xyz/api/public/v1/users/reg",
        {
          mobile: mobile_text,
          code: code_text,
          email: email_text,
          pwd: pwd_text,
          gender: gender_text
        },
        function(result) {
          console.log(result);
          if (result.meta.status == 200) {
            // 成功
            mui.toast("注册成功");
            setTimeout(() => {
              location.href = "login.html";
            }, 1000);
          } else {
            mui.toast(result.meta.msg);
          }
        }
      );
    });
  }

  // 验证 手机合法性
  function checkPhone(phone) {
    if (!/^1[34578]\d{9}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  }

  // 验证 邮箱
  function checkEmail(myemail) {
    var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if (myReg.test(myemail)) {
      return true;
    } else {
      return false;
    }
  }
});
