//index.js
//获取应用实例
const app = getApp()

var addressUtil = require("../../utils/address.js")

Page({
  data: {
    userInfo: { },
    openid: null,
    hasUserInfo: false,
    app : app
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 获取不到userInfo证明异步方法onLaunch返回是onLoad方法执行了，所以这里重新获取一下userInfo，然后保存到globalData中，给其他page使用
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
