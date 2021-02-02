// pages/search/index.js
/**
 * 1 输入框绑定 值改变事件
 *  11 获取到输入框的值
 *  22 合法性判断
 *  33 检验通过 把输入框的值发送到后台
 *  44 返回的数据打印到页面上
 * 
 * 2 防抖（搜索输入稳定后再发送请求 - 定时器
 *   11 定义全局性 定时器id
 * 
 */
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    inputValue:""
  },
  TimeId:-1,

  handleInputChange(e){

    const {value} = e.detail;
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    });
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.getSearch(value);
    }, 1000);
    
  },

  async getSearch(query){

    const res = await request({url:"/goods/qsearch", data:{query}});
    this.setData({
      goods:res.data.message
    });
  },

  handleCancle(){

    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })

  }

})