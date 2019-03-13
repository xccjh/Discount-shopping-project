$(function() {
  /* 
  1 点击 “加入购物车” tap事件
    1 获取本地存储中的一个   userinfo
    2 判断 userinfo 是否为null 
      1 null 没有登录过    =>   1 弹出对话框 您还没登录 2 延迟跳转页面 登录页面
    3 登录过了 构造参数 完成 添加到 购物车的功能
  2 准备参数 发送请求完成登录   添加到购物车功能 必须要用到token
    1 准备参数  从第一次获取数据的时候  来获取  
    2 准备发送请求 添加到购物车
    3 在api文档的最开头已经有说明
      1 把token从本地存储中获取出来
      2 把token存放到请求头
           "Authorization" : token
  3 加入购物车成功
    1 弹出 确认框 mui消息提示框 
    2 跳转的时候 跳转到购物车页面
    3 取消的时候 就什么都不做
  
   */

  // 商品信息对象
  let GoodsObj = {};

  init();
  function init() {
    goodsDetail();
    eventList();
  }

  function eventList() {
    // 绑定 加入购物车 点击 事件
    $(".shopping_car_btn").on("tap", function() {


      
  
      // 1 获取 本地存储中的数据 userinfo sessionStorage
      // 要么是正常 字符串 要么就是 null
      let userStr = sessionStorage.getItem("userinfo");
      // 1.1 判断是否存在
      if (!userStr) {
        mui.toast("您还没有登录");
        setTimeout(() => {
          // 把 当前的url存入到会话存储中 方便 登录成功之后 跳回来
          sessionStorage.setItem("pageurl", location.href);

          location.href = "login.html";
        }, 1000);
      } else {
        // console.log("已经登录过了 准备添加到购物车");
        // 2.2 发送数据到后台完成 功能
        // 必须要带上token到后台去 否则都是失败！！！
        // 2.3 把token取出来
        let token = JSON.parse(userStr).token;
        // 2.4 把token存入到请求头中
        // 2.4.1 $.post 简洁的ajax的方法 没有办法添加请求头信息，要给ajax添加请求头的时候 必须要使用 $.ajax
        $.ajax({
          url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/add",
          type: "post",
          data: {
            info: JSON.stringify(GoodsObj)
          },
          // 请求头的配置
          headers: {
            Authorization: token
          },
          success: function(result) {
            // console.log(result);
            // 判断请求是否成功
            if(result.meta.status==200){
              // 成功
              mui.confirm("您是否要跳转到购物车页面？","添加成功",["跳转","取消"],function (editType) {
                // 判断 用户点击的按钮
                if(editType.index==0){
                  // 跳转
                  // console.log("跳转");
                  location.href="cart.html";
        
                }else if(editType.index==1){
                  // 取消
                  console.log("取消");
                }
                
              })
            }else{
              // 失败
              mui.toast(result.meta.msg);
            }
          }
        });
        //   $.post("http://api.pyg.ak48.xyz/api/public/v1/my/cart/add",{
        //     info:JSON.stringify(GoodsObj)
        //   },function (result) {
        //     console.log(result);

        //   })
      }
    });
  }

  function goodsDetail() {
    $.get(
      "http://api.pyg.ak48.xyz/api/public/v1/goods/detail",
      {
        goods_id: getUrl("goods_id")
      },
      function(result) {
        // console.log(result);
        if (result.meta.status == 200) {
          // 给全局的商品信息对象赋值
          GoodsObj = {
            cat_id: result.data.cat_id,
            goods_id: result.data.goods_id,
            goods_name: result.data.goods_name,
            goods_number: result.data.goods_number,
            goods_price: result.data.goods_price,
            goods_small_logo: result.data.goods_small_logo,
            goods_weight: result.data.goods_weight
          };

          //  模板需要渲染 整个商品的详情部分  所有的数据都要传递到 模板引擎中
          let data = result.data;
          // data={... pics:[]}
          let html = template("mainTpl", data);
          // let html=template("mainTpl",{pics:data.pics,goods_name:艾美特});

          // let html=template("id",{arr:result.data})   第二个参数的格式是一个对象

          $(".pyg_view").html(html);

          // 轮播图的js 初始
          var gallery = mui(".mui-slider");
          gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
          });
        } else {
          console.log("请求失败", reslut);
        }
      }
    );
  }

  // 获取url上的参数 的值
  function getUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
});
