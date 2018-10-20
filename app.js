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
        console.log(res.code)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取ID
  },
  globalData: {
    userInfo: null,
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