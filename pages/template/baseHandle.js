// 针对所有页面的通用的handle
var cf = require("../../config.js");
var util = require("../../utils/util.js");
var cusmallToken = wx.getStorageSync('cusmallToken');

function handleCommonFormSubmit(e) {
  var formId = e.detail.formId;
  cusmallToken = wx.getStorageSync('cusmallToken');
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/addFormId',
    data: {
      cusmallToken: cusmallToken,
      formId: formId
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log("addFormId success：", formId);
    }
  })
}

function onNavTab(e) {
  var that = this;
  return util.processNavClick(e, that);
}

function longCopy(e){
  let txt = e.currentTarget.dataset.txt;
  wx.setClipboardData({
    data: txt,
    success: function (res) {
      wx.showToast({
        title: "复制成功",
        icon: "none"
      });
    },
    fail(e) {

      wx.showToast({
        title: '复制失败' + e.toString()
      })
    }
  })
  
}
function getReviewConfig(){
  let cusmallToken = wx.getStorageSync('cusmallToken');
  let mallSiteId = wx.getStorageSync('mallSiteId');
  let ctx = this;
  return new Promise(function (resolve, reject){

    wx.request({
      url: cf.config.pageDomain + "/applet/mobile/review/getReviewConfig",
      data: {
        mallSiteId: mallSiteId,
        cusmallToken: cusmallToken,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        console.log(data)
        if(data && 0 == data.ret){
          ctx.setData({
            isOpenComment: data.model.reviewConfig.isOpen
          })
          resolve(data)
        }else{
          reject(data);
        }
      },
      fail() {

      },
      complete() {

      }
    })

  });
}
function commMakeCall(e) {
  let phonecode = e.currentTarget.dataset.tel;
  wx.makePhoneCall({
    phoneNumber: phonecode //仅为示例，并非真实的电话号码
  })
}
function backToHome() {
  let app = this.data.app;
  let shopuid = app.globalData.shopuid;
  let fromuid = app.globalData.fromuid;
  let url = "/pages/index/index";
  if (shopuid) {
    url = url + "?shopuid=" + shopuid;
    if (fromuid) {
      url = url + "&fromuid=" + fromuid;
    }
  }
  wx.redirectTo({
    url: url
  })

}
function fnOpenLocation(e){
  console.log(e)
  let lat = parseFloat(e.currentTarget.dataset.lat || 22.5236670209857);
  let lng = parseFloat(e.currentTarget.dataset.lng || 113.94078612327576);
  wx.openLocation({
    latitude: lat,
    longitude: lng,
    scale: 28
  })
}

function userInfoHandler(res) {
  let that = this;
  let app = getApp();
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  if (res.detail.encryptedData) {
    wx.setStorageSync('userInfo', res.detail.userInfo);
    app.globalData.userinfoDetailData = res.detail;
    that.setData({
      "showAuthBox": false,
      userInfo: res.detail.userInfo
    })

    
    //调用登录接口
    wx.login({
      success: function (res) {
        let wxCode = res.code;
        // 获取用户信息
        let userInfo = wx.getStorageSync('userInfo');
        // 调用后台接口获取cusmallToken
        let submitData = {
          wxCode: wxCode,
          uid: cf.config.customPack ? cf.config.uid : extConfig.uid
        }
        submitData.encryptedData = app.globalData.userinfoDetailData.encryptedData;
        submitData.iv = app.globalData.userinfoDetailData.iv;
        if (app.referrerInfo) {
          submitData.extraData = app.referrerInfo
        }
        wx.request({
          url: cf.config.pageDomain + '/applet/oauth/getCusmallToken',
          data: submitData,
          header: {
            'content-type': 'application/json'
          },
          fail: function (data) {
            console.error("后台接口获取cusmallToken失败", data);
          },
          success: function (res) {
            console.log(res.data);
            if (res.data.ret == 0) {
              wx.setStorageSync('cusmallToken', res.data.model.cusmallToken);
              wx.setStorageSync('lastTokenTime', new Date().getTime());
              that.userinfoFinishCb && that.userinfoFinishCb();
            } else {
              let errMsg = res.data.msg;

              if (res.data.ret == -4000) {
                errMsg = "请检查配置参数";
              }
              wx.showModal({
                title: '获取授权信息异常',
                showCancel: false,
                content: errMsg
              })
            }
          }
        })

      },
    });
    // wx.navigateTo({
    //   url: app.globalData.userinfoBackPage
    // })
  } else {
    wx.showModal({
      title: '用户授权',
      content: "拒绝授权将无法体验完整功能，建议打开授权",
      showCancel: false,
      complete: function (res) {

      }
    })
  }
}
function checkUserInfo(cb) {
  let pageVm = this;
  let app = getApp();
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    return true;
  } else {
    pageVm.userinfoFinishCb = function () {
      app.globalData.userInfo = wx.getStorageSync('userInfo');
    }
    wx.hideLoading();
    let appName = cf.config.customPack ? cf.config.name : extConfig.name;
    let appLogo = cf.config.customPack ? cf.config.logo : extConfig.logo;
    app.globalData.appName = appName;
    app.globalData.appLogo = appLogo;
    pageVm.setData({
      "showAuthBox": true,
      appName: appName,
      appLogo: appLogo
    })
  }
  return false;
}
module.exports = {
  handleCommonFormSubmit: handleCommonFormSubmit,
  onNavTab: onNavTab,
  getReviewConfig,
  backToHome,
  userInfoHandler,
  commMakeCall,
  checkUserInfo,
  fnOpenLocation,
  longCopy
}