// pages/goods_detail/index.js
/**
 * 1 发送请求获取数据
 * 2 点击轮播图预览大图功能
 *  11 给轮播图绑定点击事件
 *  22 调用小程序api previewImage
 * 3 点击 加入购物车
 *  11 先绑定点击时间
 *  22 获取缓存中的购物车数据 数组格式
 *  33 判断当前商品是否已经存在于购物车
 *  44 若存在 修改商品数据 购物车数量添加 然后重新将购物车数据添加至缓存中
 *  55 不存在 直接给购物车数组添加新元素
 *  66 弹出提示
 * 
 * 4 商品收藏
 *  11 页面onshow的时候 加载缓存中的商品收藏的数据
 *  22 判断当前商品是不是被收藏 
 *    是 改变页面图标
 *    否
 *  33 点击商品收藏按钮
 *    判断该商品是否存在于缓存中， 是-删除 否-添加到缓存中
 *  
 */
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

    
  },

  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail", data:{goods_id}});
    this.GoodsInfo=res.data.message;

    let collect = wx.getStorageSync("collect")||[];
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:{
        goods_name:res.data.message.goods_name,
        goods_price:res.data.message.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 后台如果存在 webp=》jpg
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics

        
      },
      isCollect
    })
  },

  handlePreviewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  handleCartAdd(){
    let cart=wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 存在
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },

  handleCollect(){
    let isCollect=false;
    let collect = wx.getStorageSync("collect")||[];
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消收藏',
        icon:'success',
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask:true
      });
    }
    wx.setStorageSync("collect",collect);
    this.setData({
      isCollect
    })
  }
})