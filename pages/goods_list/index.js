// pages/goods_list/index.js
/**
 * 1 用户上滑页面 滚动条触底 开始加载下一页数据
 *  11 找到滚动条触底事件 -》 开发文档
 *  22 判断还有没有下一页数据
 *    a 读取到总页数 只有总条数 
 *        总页数 = Math.cell(总条数 / 页容量)
 *    b 获取当前页码
 *    c 当前页数是否大于等于总页数？没有下一页：有
 *  33 没有则弹出一个提示
 *  44 有则加载下一页数据
 *    a 当前页码++
 *    b 重新发送请求
 *    c 数据请求回来 要对data中的数组进行拼接
 * 
 * 2 用户下拉刷新页面
 *  11 触发下拉刷新事件 需要在页面的json文件中开启一个配置项 找到触发下拉刷新的事件
 *  22 重置数据数组
 *  33 重置页码为1
 *  44 重新发送请求
 *  55 数据请求回来需要手动关闭下拉刷新
 */
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive: true
      },
      {
        id:1,
        value:"销量",
        isActive: false
      },
      {
        id:2,
        value:"价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口要的参数
  QueryParams:{
    query: "",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.data.message.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      //goodsList:res.data.message.goods
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })

    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  onReachBottom(){
    // 判断还有没有下一页
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页
      wx.showToast({
        title: '没有更多数据'
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }
})