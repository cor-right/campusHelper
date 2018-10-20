//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.openid = res.code
        console.log(this.globalData.openid)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid : null,
    domain: 2,
    isShow: true,
    bottomMenus: {
      list: [
        {
          target: "#",
          url: "/pages/index/index",
          menusName: "首页",
          imageSource: "http://cdn.xcx.weijuju.com/2018/3/common/13955/dd41f3de-e4e8-4ba6-a56a-3352ebb9872c.png?imageMogr2/crop/!200x200a0a0|imageView2/2/w/400"
        },
        {
          target: "#",
          url: "/pages/recruit/recruit",
          menusName: "招聘",
          isSelected: true,
          imageSource: "http://cdn.xcx.weijuju.com/2018/3/common/13955/e99be15b-5340-488f-82cc-126de4ccb8d7.png?imageMogr2/crop/!200x200a0a0|imageView2/2/w/400"
        },
        {
          target: "#",
          url: "/pages/team/team",
          menusName: "抱团",
          imageSource: "http://cdn.xcx.weijuju.com/2018/3/common/13955/e99be15b-5340-488f-82cc-126de4ccb8d7.png?imageMogr2/crop/!200x200a0a0|imageView2/2/w/400"
        },
        {
          target: "#",
          url: "/pages/user/index",
          menusName: "个人中心",
          imageSource: "http://cdn.xcx.weijuju.com/2018/3/common/13955/694d7030-3ee5-48a4-95fa-986ab16d4400.png?imageMogr2/crop/!200x200a0a0|imageView2/2/w/400"
        },

      ]
    }
  }
})