$(function () {


  init()
  function init() {
    goodsDetail();
  }


  function goodsDetail() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/goods/detail",{
      goods_id:getUrl("goods_id")
    },function (result) {
      console.log(result);
      
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