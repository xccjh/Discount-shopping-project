$(function () {
  /* 
  1 获取个人信息 动态渲染到页面上
  2 点击退出登录
    0 您是否确定退出！！！
    1 清除缓存 本地存储
    2 跳转页面 跳到登录页面 
   */
  init();
  function init() {
    getuserinfo();
    eventList();
  }
  
  // 获取个人信息数据
  function getuserinfo() {
    let token = JSON.parse(sessionStorage.getItem("userinfo")).token;
    $.ajax({
      url:"http://api.pyg.ak48.xyz/api/public/v1/my/users/userinfo",
      headers:{
        Authorization: token
      },
      success:function (result) {
       if(result.meta.status==200){
          let html=
          `
          <li> 手机号码:${result.data.user_tel}  
          <br>
          邮箱:${result.data.user_email}  
           </li>
          `;

          $(".userinfo").html(html);
       }else{
         console.log("失败");
       }
        
      }
    })
  }

  function eventList() {
    // 点击 退出按钮
    $(".logout_btn").on("tap",function () {

      mui.confirm("您确定退出吗？","警告",["退出","取消"],function (editType) {
        if(editType.index==0){
          // 退出
          
      // 清除本地存储数据
      sessionStorage.clear();
      // 跳转到登录页面
      location.href="login.html";
        }else if(editType.index==1){
          // 取消
        }
        
      })


      
    })
    
  }
})