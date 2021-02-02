// pages/auth/index.js
import { request } from "../../request/index.js"
import { login } from "../../utils/asyncWx.js"
Page({

  async handleGetUserInfo(e){
    
    try {
      const { encryptedData,rawData,iv,signature} = e.detail;
      const {code} = await login();
      const loginParams={ encryptedData,rawData,iv,signature,code };
      // 3 发送请求 获取用户token,无企业appid不会成功
      const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
      wx.setStorageSync("token",token);
      wx.navigateBack({
        delta: 1
      });
      
    } catch (error) {
      console.log(error);
    }
  }
})