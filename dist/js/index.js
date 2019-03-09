"use strict";

$(function () {
  init(); // js一加载就执行的 方法 入口

  function init() {
    swiperdata();
  } // 获取首页轮播图的数据


  function swiperdata() {
    $.ajax({
      url: "http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata",
      type: "get",
      success: function success(result) {
        //  判断请求是否成功
        if (result.meta.status === 200) {
          // 获取要渲染的数据 data=[]
          var data = result.data; // console.log(data);
          // 生成要渲染的html标签

          var html = template("swiperTpl", {
            arr: data
          }); // 把标签插入到 轮播图的 div中

          $(".pyg_slide").html(html); // 初始化轮播图

          var gallery = mui(".mui-slider");
          gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；

          });
        } else {
          console.log("请求失败", result);
        }
      }
    });
  }
});
//# sourceMappingURL=index.js.map
