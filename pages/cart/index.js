// pages/cart/index.js
/**
 * 1 获取用户收货地址
 *  11 绑定点击事件
 *  22 调用小程序内置api 
 *  33 获取用户对小程序所授予收货地址的权限状态 scope
 *     用户确定获取 scope=true authSetting scope.address
 *     用户点击取消 scope=false
 *     用户从没调取过 scope=undefined
 *  44 scope=true/undefined 直接调用 获取收货地址
 *  55 scope=false 
 *    诱导用户自己打开授权设置页面，当用户重新给与权限在调用获取收货地址api
 *  66 把获取到的地址存入到本地存储中
 * 
 * 2 页面加载完毕
 *  11 获取本地存储中的地址数据
 *  22 把数据设置给data中的一个变量
 * 
 * 3 onshow
 *  11 获取缓存中的购物车数组
 *  22 把购物车数据填充到onshow中
 * 
 * 4 全选实现
 *  11 获取缓存中购物车数组
 *  22 计算 所有商品都选中，全选选中
 * 
 * 5 总价格和总数量
 *  11 需要商品被选中
 *  22 获取购物车数组
 *  33 遍历
 *  44 判断商品是否被选中
 *  55 把计算后的价格和数量设置会data
 * 
 * 6 商品的选中
 *  11 绑定change事件
 *  22 获取被修改的商品对象
 *  33 商品对象的选中状态 取反
 *  44 重新填充回data&storage
 *  55 重新计算全选&价格&数量
 * 
 * 7 全选和反选功能
 *  11 绑定事件
 *  22 获取data中的全选变量 allchecked 取反
 *  33 便利购物车数组 让商品选中状态随allChecked改变而改变
 *  44 购物车数组和allchecked重新设置会data和缓存
 * 
 * 8 商品数量的编辑
 *  11 + - 按钮，绑定同一个时间，区分的关键，自定义属性
 *  22 传递被点击的商品id
 *  33 获取data中购物车数组，找到商品，修改num
 *    当购物车的数量=1，同时用户点击-，弹窗提示用户是否要删除
 *  44 this.setCart
 * 
 * 9 点击结算
 *  11 判断有没有收货地址信息
 *  22 判断用户有没有选购商品
 *  33 经过以上验证 跳转到支付页面
 */
import { getSetting,chooseAddr,openSetting,showModal,showToast } from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address=wx.getStorageSync("address");
    const cart=wx.getStorageSync("cart")||[];
    this.setCart(cart);
    this.setData({
      address
    });
  },
  
  async handleChooseAddr(){
    try {

      const res1 = await getSetting();
      console.log(res1);
      const scopeAddr = res1.authSetting["scope.address"];
      if( scopeAddr === false ){
        await openSetting(); 
      }
      let address = await chooseAddr();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      wx.setStorageSync("address",address);

    } catch (error) {
      console.log(error);
    }
  },

  handleItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },

  setCart(cart){

    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },

  handleItemAllChecked(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },

  async handleItemNumEdit(e){
   
    const {id,operation} =e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num===1&&operation===-1){
      const res=await showModal({content: "是否删除该商品"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
    
  },

  async handlePay(){
    const {address, totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }


})