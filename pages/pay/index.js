/**
 * 1 页面加载的时候
 *  11 从缓存中获取购物车数据 checked=true
 * 
 * 2 微信支付
 *  11 企业账号才能支付，还要有服务器
 *  22 企业账号的小程序后台中， 必须 给开发者添加上白名单
 *    一个appid 可以同时绑定多个开发者，可以共用开发权限
 * 
 * 3 支付按钮
 *  11 先判断缓存中有没有token
 *  22 没有 跳到授权页面 进行获取token
 *  33 有 开始创建订单
 *  44 完成微信支付
 *  55 手动删除缓存中已经被选中了的商品
 *  66 删除后的购物车数据填充回缓存
 *  77 跳转到订单页面
 */
import { getSetting,chooseAddr,openSetting,showModal,showToast,requestPayment } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address=wx.getStorageSync("address");
    let cart=wx.getStorageSync("cart")||[];
    cart=cart.filter(v=>v.checked);
    
    let totalPrice=0;
    let totalNum=0;

    cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    })
    this.setData({
      cart,
      address,
      totalPrice,
      totalNum
    })

  },

  async handleOrderPay(){
    
    try {
      const token=wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 准备请求头参数
      const header={Authorization:token};
      // 准备请求体参数
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address.all;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams={order_price,consignee_addr,goods};
      // 准备发送请求，创建订单，获取订单编号
      const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams,header});
      // 准备发起与支付接口
      const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}});
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台订单状态
      const res = await request({url:"/my/orders/chkOrder",method:"POST",header,data:{order_number}});

      await showToast({title:"支付成功"});

      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);

      // 支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });

    } catch (error) {

      await showToast({title:"支付失败"});
      console.log(error);

    }
  }

})