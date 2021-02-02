// pages/feedback/index.js
/**
 * 1 点击+触发点击事件
 *  11 调用小程序内置选择图片的api
 *  22 获取到图片的路径数组
 *  33 把图片路径存到data的变量中
 *  44 页面就可以根据图片数组进行循环显示自定义组件
 * 
 * 2 点击自定义图片组件 删除自己
 *  11 获取被点击的元素的索引
 *  22 获取data中的图片数组
 *  33 根据索引删除对应元素
 *  44 把数组重新设置回data
 * 
 * 3 用户提交
 *  11 获取文本域内容 做合法性验证
 *  22 将用户上传图片上传到专门的服务器，返回图片外网地址
 *  33 文本域和图片外网路径一起提交到服务器（前端模拟，不会发送到后台，仅写出逻辑）
 *  44 清空当前页面，返回上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive: true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs:[],
    textVal:""

  },
  UploadImgs:[],

  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album','camera'],
      success: (res) => {
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...res.tempFilePaths]
        })
      }
    })
  },
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },

  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  handleSummit(){
    const {textVal, chooseImgs} = this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
        
      return;
    }

    wx.showLoading({
      title: '正在上传中',
      mask: true
    });

    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i) => {
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: "image",
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UploadImgs.push(url);
  
            if(i===chooseImgs.length-1){
              wx.hideLoading();              
              console.log("把图片数组和文字提交到外网服务器");
              // 提交成功之后
              this.setData({
                textVal:"",
                chooseImgs:[]
              });
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
      })
    }else{
      wx.hideLoading();
      console.log("只是提交文本");
      this.setData({
        textVal:""
      })
      wx.navigateBack({
        delta: 1
      });
    }
      
    //不支持多张图片同时上传，只能遍历数组，挨个上传
    
    
      
  }
})