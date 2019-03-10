$(function() {
  /* 
  1 获取发送到后台需要的 请求参数 
  2 使用mui下拉上拉组件的步骤
    1 看着文档来修改 标签结构
    2 看着文档来修改 样式结构
    3 js的初始化
  3 什么时候发送ajax请求和什么时候 结束 下拉刷新组件
    1 什么时候发送ajax请求 在mui的下拉刷新组件 启用的同时 
    2 标签都生成 就可以 结束 下拉刷新组件
   */

  // 1 发送请求需要的参数对象 全局变量 方便修改
  let QueryObj = {
    // 查询的关键字 可以为空  根据 小米  华为 。。。。
    query: "",
    // 分类页面中的每一个小商品的分类id
    // 获取 url上的参数 cid的值
    cid: getUrl("cid"),
    // 页码
    pagenum: 1,
    // 页容量  一页可以存放几条数据
    pagesize: 5
  };

  init();
  function init() {
    // 开始调用mui的下拉组件
    mui.init({
      pullRefresh: {
        container: ".pyg_view",
        // 下拉刷新组件的配置
        down: {
          // 一打开页面的时候 自动显示 下拉刷新组件
          auto: true,
          //  触发下拉刷新时自动触发
          callback: function() {
            // 一旦看到下拉刷新组件 就表示 该代码也会一起被执行
            goodsSearch();
          }
        },
        // 上拉加载下一页的配置
        up: {
          //  触发上拉刷新时自动触发
          callback: function() {}
        }
      }
    });
  }

  // 获取商品列表数据
  function goodsSearch() {
    // $.get("地址","？参数对象",成功的回调函数)
    $.get(
      "http://api.pyg.ak48.xyz/api/public/v1/goods/search",
      QueryObj,
      function(result) {
        // 判断请求成功
        if (result.meta.status == 200) {
          // 成功
          // 模板要渲染的数据
          let data = result.data.goods;

          // 生成标签
          let html = template("mainTpl", { arr: data });
          $(".list").html(html);

          // 结束下拉刷新
          mui(".pyg_view")
            .pullRefresh()
            .endPulldownToRefresh();
        } else {
          console.log("失败", result);
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
