
$(function () {
  /* 
  1 任何人都可以访问这个购物车页面吗   登录过后的用户 才可以访问
    1 判断 本地存储中有没有  userinfo 这个数据  有 登录过
      假如 没有数据 
        1 把当前的页面路径存入到 本地存储中 pageurl
        2 跳转到登录页面
  
   */
  init();
  function init() {
    // checkPermission();
  }
  
  // // 验证权限  权限
  // function checkPermission() {
  //   /* 
  //   1 在浏览器中 css html先加载 最后 才到 js加载 所以肯定闪一闪 
  //   2 把js 放到 head标签中
  //    */
  //   // 1 获取本地存储中的 userinfo 数据
  //   let userinfoStr=sessionStorage.getItem("userinfo");
  //   // 2 判断是否存在
  //   if(!userinfoStr){
  //     // 2.1 存一下 当前的页面
  //     sessionStorage.setItem("pageurl",location.href);
  //     // 2.2 跳转页面 登录页面  不要 加延迟 直接跳转！！！！！
  //     location.href="login.html";
  //     return;
  //   }
  // }
})
