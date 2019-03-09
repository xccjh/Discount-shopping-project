$(function() {
  /* 
  1 实现了静态布局
  2 首页动态渲染数据
    1 左侧菜单是全部渲染 
    2 右侧的内容 是 根据左侧 被选中的菜单 才开始 渲染 
    3 写两个方法  (页面用到的数据 只要发送一次请求去获取 就可以提供给下次下次 使用 )
      渲染左边（）
      渲染右边（）
  3 点击左侧菜单
    1 左侧菜单被 激活选中
    2 右侧的内容 动态跟着渲染
      1 先获取 被点击的li标签的索引
   */

  //  全局变量 存放 接口的返回数据 result.data
  let CateDatas;

  init();
  function init() {
    categories();
    eventList();
  }

  // 负责 绑定 页面当中的 一坨事件
  function eventList(params) {  
    // 1 左侧菜单的点击事件  委托 委派
    // touchstart 原生的触屏事件  

    $(".left_menu ").on("tap","li",function () {
      
      $(this).addClass("active").siblings().removeClass("active");

      // 获取 被点击的li标签的索引 $(this).index()
      let index=$(this).index();
      renderRight(index);
      
    })
  }


  // 1 发请求获取数据
  function categories() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/categories", result => {
      // 判断请求是否成功
      if (result.meta.status == 200) {
        // 成功

        // 获取要渲染左侧的数据
        CateDatas = result.data;

        // 渲染左边
        renderLeft();

        // 渲染右边
        renderRight(0);
      } else {
        console.log("失败", result);
      }
    });
  }

  // 2 渲染左边
  function renderLeft() {
    // 要拼接的左侧的html
    let leftHtml = "";
    for (let i = 0; i < CateDatas.length; i++) {
      // let activeCls=i==0?"active":"";

      let tmpHtml = `
                <li class="${i == 0 ? "active" : ""}">${
        CateDatas[i].cat_name
      }</li>
                `;
      leftHtml += tmpHtml;
    }

    // 把数据插入到 左侧容器中
    $(".left_menu").html(leftHtml);
  }

  // 3 渲染右边
  function renderRight(index) {
    // 获取 大家电的数据
    let item2Obj = CateDatas[index];
    // 获取右侧内容 需要循环的数据
    let rightData = item2Obj.children;
    // console.log(rightData);

    let rightHtml = template("rightTpl", { arr: rightData });
    $(".right_box").html(rightHtml);
  }
});
