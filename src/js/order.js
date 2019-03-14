$(function () {
  /* 
  1 要不要做权限控制 肯定要 
   */
  init();
  function init() {
    ordersAll();
  }
  

  // 查询订单
  function ordersAll() {
    let token = JSON.parse(sessionStorage.getItem("userinfo")).token;
    $.ajax({
      url:"http://api.pyg.ak48.xyz/api/public/v1/my/orders/all?type=1",
      headers:{
        Authorization: token
      }
      ,success:function (result) {
        // console.log(result);
        if(result.meta.status==200){
            let arr=result.data;
            let html="";
            for (let i = 0; i < arr.length; i++) {
                html+=
                `
                <li>
                订单编号:
                <br>
                ${arr[i].order_price}
                <br>
                ${arr[i].order_number}
              </li>
                `;
            }
            // 渲染数据
            $("#item1 ul").html(html);
        }else{
          console.log("失败");
        }
        
      }
    })
    
  }
})