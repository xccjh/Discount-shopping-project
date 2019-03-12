$(function () {


  init()
  function init() {
    goodsDetail();
  }


  function goodsDetail() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/goods/detail",{
      goods_id:getUrl("goods_id")
    },function (result) {
      // console.log(result);
      if(result.meta.status==200){

        //  模板需要渲染 整个商品的详情部分  所有的数据都要传递到 模板引擎中
        let data=result.data;
        // data={... pics:[]}
        let html=template("mainTpl",data);
        // let html=template("mainTpl",{pics:data.pics,goods_name:艾美特});

        // let html=template("id",{arr:result.data})   第二个参数的格式是一个对象

        $(".pyg_view").html(html);

        // 轮播图的js 初始
        var gallery = mui(".mui-slider");
        gallery.slider({
          interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
      }else{
        console.log("请求失败",reslut);
      }
      
    })
    
  }

    // 获取url上的参数 的值
    function getUrl(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    }
  
})