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
  4 修改现在的代码结构
    1 第一次打开页面的时候
      1 标签 全部替换 $().html()
      2 结束 下拉刷新组件
    2 实现 加载下一页
      1 请求了 5条数据  再请求5条  一共  10条 $().html()
          追加 $().append()
      2 结束  上拉加载组件
    3 请求的路径还是同一个 但是 数据回来之后要做的事不一样
      首次加载   全部替换 和  结束下拉
      加载下一页  追加数据 和 结束上拉 
  5 上拉加载下一页
    1 判断有没有下一页的数据 
      当前的页码（已知） 和 总页码比较   总页码=Math.ceil(总条数 / 页容量)
        当前页码  大于等于 总页码  没有下一页 否则就 有下一页数据
       总页码=Math.ceil(总条数 / 页容量) 
           ？ =  Math.ceil(21 /10)= 3
    2 在什么地方开始判断 有没有下一页数据
      1 在执行 上拉手势操作的时候开始判断
      2 还有下一页的数据
        1 当前页码 ++ 
        2 直接发送请求获取数据
        3 请求成功 需要 
          1 append
          2 结束 上拉刷新组件
    6 在执行完 上拉加载之后 没有下一页的数据之后  触发下拉刷新 bug 就出现
      1 不断进行加载下一页的时候 页码一直 被++ 1 =>4 
      2 上拉组件 已经变成 没有更多数据
      3 执行 下拉刷新 用到的参数 页码已经变成了  4 
        1 当用户触发下拉刷新的时候 肯定是希望 加载的是第一页的数据
      4 当用户 执行 下拉刷新的同时 也顺便 重置一下 上拉组件 
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
    pagesize: 10
  };

  // 2 总页码 是在发送请求成功了 才能 正确的赋值
  let TotalPage = 1;

  init();
  function init() {
    eventList();
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
            let cb = function(data) {
              let html = template("mainTpl", { arr: data });
              $(".list").html(html);

              // 结束下拉刷新
              mui(".pyg_view")
                .pullRefresh()
                .endPulldownToRefresh();

                // 重置 上拉组件
                mui('.pyg_view').pullRefresh().refresh(true);
            };

            // 重置页码 变成第一页
            QueryObj.pagenum=1;
            // 重置 上拉组件  思路十分正确 但是 mui框架不给力 没有效果 
            // 但是 我有方法来解决 bug 把以下代码 放入到 cb的回调函数中执行就可以了
            // mui('.pyg_view').pullRefresh().refresh(true);
            goodsSearch(cb);
          }
        },
        // 上拉加载下一页的配置
        up: {
          //  触发上拉刷新时自动触发
          callback: function() {
            // 判断有没有下一页的数据
            if (QueryObj.pagenum >= TotalPage) {
              console.log("没有数据 不要再划了 网页都要崩掉！");

              // 自己把没有数据的提示 放入到页面中 一旦传入了一个true 那么这么上拉组件永远不会再被执行
              // 没数据了 肯定没有办法再执行 
              mui(".pyg_view")
              .pullRefresh()
              .endPullupToRefresh(true);
            } else {
              console.log("还有数据 准备 下一次的请求");
              QueryObj.pagenum++;

              // 定义数据回来之后的逻辑
              let cb = function(data) {
                let html = template("mainTpl", { arr: data });
                // append 追加
                $(".list").append(html);

                // 结束上拉组件
                // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
                mui(".pyg_view")
                  .pullRefresh()
                  .endPullupToRefresh(false);
              };

              goodsSearch(cb);
            }
          }
        }
      }
    });
  }

  function eventList() {
    // 给a标签绑定 tap点击事件 用来进行 点击页面跳转
    $(".list").on("tap","a",function () {
      // 获取a标签身上的 href属性
      let href=this.href;
      // 通过js的方式来跳转
      location.href=href;
      
    })
    
  }

  // 获取商品列表数据
  function goodsSearch(func) {
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

          // 计算总页码
          TotalPage = Math.ceil(result.data.total / QueryObj.pagesize);
          console.log(TotalPage);

          // 生成标签
          // let html = template("mainTpl", { arr: data });
          // $(".list").html(html);

          // // 结束下拉刷新
          // mui(".pyg_view") .pullRefresh() .endPulldownToRefresh();
          func(data);
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
