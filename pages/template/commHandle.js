// 此JS是针对包含装饰内容(decoration)的页面的通用逻辑抽取
// 如首页，商品详情，分类详情，子页面等
// 针对所有页面的更通用的handle请写在baseHandle.js
var cf = require("../../config.js");
var util = require("../../utils/util.js");
var cusmallToken = wx.getStorageSync('cusmallToken');
let communityHandle = {
  fetchTopicListData: function (pageCxt, mallSiteId, sectionId) {
    if (!sectionId){
      //return;
    }
    cusmallToken = wx.getStorageSync('cusmallToken');
    let limit = 10
    let vm = pageCxt;
    let that = this;
    // if (vm.data.communityHandleData.loadingTopic) {
    //   return;
    // }
    // let start = vm.data.communityHandleData.topicList.length;
    let start = 0;
    wx.showLoading({
      title: "加载中",
    })
    let submitData = {
      cusmallToken: cusmallToken,
      start: start,
      mallSiteId: mallSiteId,
      limit: limit
    };
    if (vm.data.categoryArr['cmm' + sectionId + 'selectedCatId']) {
      submitData.themeId = vm.data.categoryArr['cmm' + sectionId + 'selectedCatId'];
    }
    submitData.sectionId = sectionId || "";
    vm.data.communityHandleData.loadingTopic = true;
    wx.request({
      url: cf.config.pageDomain + '/applet/mobile/community/findPost',
      data: submitData,
      header: {
        "content": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        vm.data.communityHandleData.loadingTopic = false;
        if (res.data.ret == 0) {
          let topicList = res.data.model.result;
          for (let i = 0; i < topicList.length; i++) {
            topicList[i].createTime = util.formatTime(new Date(topicList[i].createTime));
            if (topicList[i].content.length > 100) {
              topicList[i].content = topicList[i].content.substr(0, 100) + "......";
            }
            if (topicList[i].address && "所在位置" != topicList[i].address) {
              let addrArr = topicList[i].address.split(";");
              topicList[i].address = addrArr[0];
              if (2 == addrArr.length) {
                let strLatLng = addrArr[1];
                let lat = strLatLng.split(",")[0];
                let lng = strLatLng.split(",")[1];
                topicList[i].lat = lat;
                topicList[i].lng = lng;
              }

            }
          }
          // vm.setData({
          //   ['communityHandleData.topicList']: topicList.slice(0, 5)
          // });
          // vm.setData({
          //   ['communityHandleData.total']: res.data.model.total
          // });
          if (sectionId){
            vm.setData({
              ['topicArr.cmm' + sectionId + '']: topicList.slice(0, 5)
            });
          }else{
            vm.setData({
              ['topicArr.cmm']: topicList.slice(0, 5)
            });
          }
          
          
          if (res.data.model.total == 0) {
            vm.setData({
              ['communityHandleData.nomore']: false
            });
            vm.setData({
              ['communityHandleData.nodata']: true
            });
          } else {
            vm.setData({ "nodata": false });
            if (vm.data.communityHandleData.topicList.length >= res.data.model.total) {
              vm.setData({
                ['communityHandleData.nodata']: true
              });
            } else {
              vm.setData({
                ['communityHandleData.nodata']: false
              });
            }
          }
        }
      }
    });
    
    

  },


  fetchCategoryData: function (pageCxt, mallSiteId,sectionId){
    cusmallToken = wx.getStorageSync('cusmallToken');
    let vm = pageCxt;
    let submitData = {
      cusmallToken: cusmallToken,
      start: 0,
      mallSiteId: mallSiteId,
      sectionId: sectionId,
      limit: 15
    };
    wx.request({
      url: cf.config.pageDomain + '/applet/mobile/community/findThemePage',
      data: submitData,
      header: {
        "content": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ret == 0) {
          let categoryList = res.data.model.result;
          // vm.setData({
          //   ['communityHandleData.categoryList']: categoryList
          // });categoryArr
          if (sectionId) {
            vm.setData({
              ['categoryArr.cmm' + sectionId + '']: categoryList
            });
          } else {
            vm.setData({
              ['categoryArr.cmm']: categoryList
            });
          }
        }
      }
    })
  },
  findCommunitySectionList: function (pageCxt, mallSiteId){
    cusmallToken = wx.getStorageSync('cusmallToken');
    let vm = pageCxt;
    let submitData = {
      cusmallToken: cusmallToken,
      start: 0,
      mallSiteId: mallSiteId,
      limit: 15
    };
    wx.request({
      url: cf.config.pageDomain + '/applet/mobile/community/findCommunitySectionList',
      data: submitData,
      header: {
        "content": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ret == 0) {
          let sectionList = res.data.model.result;
          vm.setData({
            ['topicArr.sectionList']: sectionList
          });
        }
      }
    })
  },

}
//砍价
let sbargainHandle = {
  fetchSbargainData: function (pageCxt,activityid){
     cusmallToken = wx.getStorageSync('cusmallToken');
    let vm = pageCxt;
    let submitData = {
      cusmallToken: cusmallToken,
      activityid:activityid
    };
    wx.request({
      url: cf.config.pageDomain + '/mobile/base/activity/init',
      data: submitData,
      header: {
        "content": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ret == 0) {
          let goodsList = res.data.model.awardList;
          for (let i = 0; i < goodsList.length; i++) {
            let ecExtendObj = JSON.parse(goodsList[i].ecExtend);
            for (let key in ecExtendObj) {
              goodsList[i][key] = ecExtendObj[key]
            }
          }
          vm.setData({
            ['sbargain.sbs' + activityid + '']: goodsList
          });
        }
      }
    })
   }
}
function goodsDetailPage (e) {
  wx.showLoading({
    title: '加载中',
  });
  let that = this;
  let curTarget = e.currentTarget;
  let goodsid = curTarget.dataset.goodsid;
  let activityid = curTarget.dataset.activityid;
  let bargaintype = curTarget.dataset.bargaintype;
  let fromShare = that.data.fromShare;
  let atyIsLive = that.data.atyIsLive;
  console.log(fromShare)
  wx.navigateTo({
    url: '/pages/sbargain/sbargain?activityId=' + activityid + '&goodsid=' + goodsid + '&bargaintype=' + bargaintype
  })
}
//拼团
let groupbuyHandle = {
  fetchGroupbuyData: function (pageCxt, activityid) {
    cusmallToken = wx.getStorageSync('cusmallToken');
    let vm = pageCxt;
    let submitData = {
      cusmallToken: cusmallToken,
      activityid: activityid
    };
    wx.request({
      url: cf.config.pageDomain + '/mobile/base/activity/init',
      data: submitData,
      header: {
        "content": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ret == 0) {
          let groupbuyList = res.data.model.awardList;
          for (let i = 0; i < groupbuyList.length; i++) {
            let ecExtendObj = JSON.parse(groupbuyList[i].ecExtend);
            for (let key in ecExtendObj) {
              groupbuyList[i][key] = ecExtendObj[key]
            }
          }
          vm.setData({
            ['groupbuy.gb' + activityid + '']: groupbuyList
          });
        }
      }
    })
  }
}
function gbDetailPage(e){
  wx.showLoading({
    title: '加载中',
  });
  let that = this;
  let curTarget = e.currentTarget;
  let goodsid = curTarget.dataset.goodsid;
  let activityid = curTarget.dataset.activityid;
  let tuantype = curTarget.dataset.tuantype;
  let fromShare = that.data.fromShare;
  let atyIsLive = that.data.atyIsLive;
  console.log(fromShare)
  wx.navigateTo({
    url: '/pages/groupbuy/groupbuy?activityId=' + activityid + '&goodsid=' + goodsid + '&tuantype=' + tuantype
  })
}
function handleTopicTap (e) {
  let vm = this;
  let topicId = e.currentTarget.dataset.id;
  let sectionId = e.currentTarget.dataset.secid || "";
  wx.navigateTo({
    url: '/pages/forum/topic?id=' + topicId + "&sectionId=" + sectionId,
  })
}
function handleReply (e) {
  let vm = this;
  let topicId = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '/pages/forum/reply?topicId=' + topicId
  })
}
function handleCmtyCategoryTab (e) {
  let that = this;
  let catId = e.target.dataset.id;
  let sectionId = e.target.dataset.stionid;
  // that.setData({
  //   ['communityHandleData.selectedCatId']: catId
  // });
  // that.setData({
  //   ['communityHandleData.topicList']: []
  // });
  if (sectionId) {
    that.setData({
      ['categoryArr.cmm' + sectionId + 'selectedCatId']: catId
    });
  } else {
    that.setData({
      ['categoryArr.cmmselectedCatId']: catId
    });
  }
  if (sectionId) {
    that.setData({
      ['topicArr.cmm' + sectionId + '']: []
    });
  } else {
    that.setData({
      ['topicArr.cmm']: []
    });
  }
  that.communityHandle.fetchTopicListData(this, that.data.mallSiteId, sectionId);

}

function handleCmtyCategorySectionTab (e) {
  let that = this;
  let widgetIndex = e.target.dataset.index;
  let sectionId = e.target.dataset.id;
  that.setData({
    ['categoryArr.cmmSection' + widgetIndex + 'selectedSecId']: sectionId
  });
  that.setData({
    ['topicArr.cmm' + sectionId + '']: []
  });
  that.communityHandle.fetchTopicListData(this, that.data.mallSiteId, sectionId);

}
function handleLike (e) {
  if (!this.checkUserInfo()) {
    return false;
  }
  let vm = this;
  let topicId = e.currentTarget.dataset.id;
  vm.changeLike(topicId);
}


function findTopicIndexById (topicId) {
  let vm = this;
  for (let i = 0; i < vm.data.communityHandleData.topicList.length; i++) {
    if (topicId == vm.data.communityHandleData.topicList[i].id) {
      return i;
    }
  }
  return -1;
}

function changeLike (topicId) {
  if (!this.checkUserInfo()) {
    return false;
  }
  cusmallToken = wx.getStorageSync('cusmallToken');
  let vm = this;
  wx.showLoading({
    title: "加载中",
  })
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/community/thumbsUpPost',
    data: {
      cusmallToken: cusmallToken,
      postId: topicId
    },
    header: {
      "content": "application/json"
    },
    success: function (res) {
      wx.hideLoading();
      let isThumbs = res.data.model.isThumbs;
      let topicIndex = vm.findTopicIndexById(topicId);
      let topic = vm.data.communityHandleData.topicList[topicIndex];
      topic.isThumbs = isThumbs;
      if (isThumbs) {
        topic.thumbsCount += 1;
      } else {
        topic.thumbsCount -= 1;
      }
      if (topic.thumbsCount < 0) {
        topic.thumbsCount = 0;
      }
      vm.setData({
        ['communityHandleData.likeAnimateId']: topicId
      });
      topic.topicId = topicId;
      vm.setData({
        ["communityHandleData." + "topicList[" + topicIndex + "]"]: topic
      });
      setTimeout(function () {
        vm.setData({
          ['communityHandleData.likeAnimateId']: ""
        });
      }, 500);
    }
  })
}

// 商品购买弹出框中加载商品信息
function loadGoodsData(that, goodsId) {
  cusmallToken = wx.getStorageSync('cusmallToken');
  wx.showLoading({
    title: '加载中',
  });
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/goods/selectGoods',
    data: {
      cusmallToken: cusmallToken,
      goodsId: goodsId
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        var goodsData = res.data.model.goods;
        that.setData({ totalBuyCount: 1 });
        if (goodsData.usenewspec) {
          var specData = JSON.parse(goodsData.spec);
          that.setData({ "specData": specData });
          that.setData({ "specList": res.data.model.spec });
          goodsData.selectedSku = specData[0];
        }
        that.setData({ goodsData: goodsData });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '获取商品信息异常',
          showCancel: false,
          content: res.data.msg
        })
      }
    }
  });
}
// 商品购买弹出框中增加购买数量
function addCount() {
  var that = this;
  var inventory = that.data.goodsData.selectedSku ? that.data.goodsData.selectedSku.inventory : that.data.goodsData.totalCount;
  if (that.data.totalBuyCount < inventory) {
    var totalBuyCount = ++that.data.totalBuyCount;
    that.setData({ totalBuyCount: totalBuyCount });
  }
}
// 商品购买弹出框中减少购买数量
function minusCount() {
  var that = this;
  if (that.data.totalBuyCount > 1) {
    var totalBuyCount = --that.data.totalBuyCount;
    that.setData({ totalBuyCount: totalBuyCount });
  }
}

// 商品购买弹出框中规格选择事件
function handleSkuTap (e) {
  var that = this;
  var specId = e.currentTarget.dataset.id;
  var groupId = e.currentTarget.dataset.groupid;
  var sku = findSelectedSpec(that, specId, groupId);
  that.setData({ 
    specList: that.data.specList,
    ["goodsData.selectedSku"]: sku
  });
}

function findSelectedSpec(that, specId, groupId) {
  var selectedIdArray = [];
  for (var i = 0; i < that.data.specList.length; i++) {
    var specGroup = that.data.specList[i];
    if (specGroup.id == groupId) {
      specGroup.selectedId = specId;
    } else {
      if (specGroup.selectedId) {

      } else {
        specGroup.selectedId = specGroup.specValue[0].id;
      }
    }
    selectedIdArray.push(specGroup.selectedId);
  }
  var selectedIds = selectedIdArray.join(",");
  for (var k = 0; k < that.data.specData.length; k++) {
    if (that.data.specData[k].ids == selectedIds) {
      return that.data.specData[k];
    }
  }
  return null;
}

// 点击立即购买
function onBuyNow(){
  if (!this.checkUserInfo()){
    return false;
  }
  var that = this;
  that.setData({ categoryContClass: "step2 onByNow" });
}

// 点击加入购物车
function onAddCart(e) {
  if (!this.checkUserInfo()) {
    return false;
  }
  var that = this;
  var goodsId = e.target.dataset.goodsid;
  that.setData({ categoryContClass: "step2 onAddCart" });
  if (!that.data.isDetailPage && goodsId){
    loadGoodsData(that,goodsId);
  }
}

// 关闭商品购买弹出框
function onCloseBuy() {
  var that = this;
  that.setData({ categoryContClass: "" });
}

// 添加到购物车
function onAddCartNext() {
  cusmallToken = wx.getStorageSync('cusmallToken');
  var that = this;
  var app = getApp();
  wx.showLoading({
    title: '请稍后...',
  });
  if(that.data.goodsData.selectedSku){
    if (that.data.goodsData.selectedSku.inventory == 0) {
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        content: "库存不足"
      })
      return;
    }
  }

  
  var submitData = {
    cusmallToken: cusmallToken,
    goodsId: that.data.goodsData.id,
    category: that.data.goodsData.category,
    category2: that.data.goodsData.category2,
    goodsCount: that.data.totalBuyCount,
    fromUid: app.globalData.fromuid || "",
    shopUid: app.globalData.shopuid || ""
  };
  if (that.data.goodsData.selectedSku) {
    submitData.spec = JSON.stringify(that.data.goodsData.selectedSku);
  }
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/shopping_cart/addShoppingCart',
    data: submitData,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        that.setData({ categoryContClass: "" });
        that.setData({ fuzzyLayerStatu: "fuzzylayer-show" });
        that.setData({ infoDialogStatu: "dialog-show" });
        wx.hideLoading();
        if (!that.data.isDetailPage) {
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 1000
          })
        }
        util.getShoppingCartCount(function (count) {
          that.setData({ shoppingCartCount: count });
        }, app);
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '添加失败',
          showCancel: false,
          content: res.data.msg
        })
      }
    }
  })

}

// 立即购买
function onBuyNowNext() {
  var that = this;
  var goodsData = that.data.goodsData;
  wx.navigateTo({
    url: '/pages/orderinfo/orderinfo?id=' + that.data.goodsData.id + "&goodsCount=" + that.data.totalBuyCount + (goodsData.selectedSku ? ("&specId=" + goodsData.selectedSku.ids) : "")
  })
}

// 输入商品购买数量
function handleBuyGoodsCountChange(event) {
  var that = this;
  var inputValue = Number(event.detail.value);
  if (inputValue > 0 && inputValue < that.data.goodsData.totalCount) {
    that.setData({ totalBuyCount: inputValue });
  }
}

//跳转表单页面
function gotoForm () {
	wx.navigateTo({
       url: '/pages/form/form?id=' + this.data.goodsData.formId
    })
}

function onBannerImgLoad(e) {
  var that = this;
  util.processBannerImgLoad(e, that);
}


function findSubClsIndexFromList(subClsId){
  var subClsList = this.data.subClsList;
  if (subClsList && subClsList.length > 0) {
    for (var i = 0; i < subClsList.length; i++) {
      if (subClsId == subClsList[i].id) {
        return i;
      }
    }
  }
  return -1;
}
function findInfoIndexFromList(subClsId){
  var infoPageList = this.data.infoPageList;
  if (infoPageList && infoPageList.length > 0) {
    for (var i = 0; i < infoPageList.length; i++) {
      if (subClsId == infoPageList[i].id) {
        return i;
      }
    }
  }
  return -1;
}
function handleSubClsTap(e){
  var that = this;
  var subClsId = e.currentTarget.dataset.id;
  var idx = e.currentTarget.dataset.index;
  var selectedSubData = that.data.selectedSubData;
  if (!selectedSubData) {
    selectedSubData = {};
  }
  var subIndex = that.findSubClsIndexFromList(subClsId);
  selectedSubData["sub-" + idx] = that.data.subClsList[subIndex];
  that.setData({
    selectedSubData: selectedSubData
  });
  that.loadSubPageById(subClsId);
}
function handleClsIdTabScrollToLower(e){
  let idx = e.currentTarget.dataset.index;
  let that = this;
  let subCls = that.data.subClsList[0];
  if (that.data.selectedSubData && that.data.selectedSubData["sub-" + idx]) {
    subCls = that.data.selectedSubData["sub-" + idx];
    // 微页面数据存储在subClsList中
    subCls = that.data.subClsList[that.findSubClsIndexFromList(subCls.id)];
  }
  if (subCls.hasLoaded && subCls.total > subCls.subListData.length) {
    that.loadSubPageById(subCls.id);
  }
}
function handleInfoPageTap(e) {
  var that = this;
  var subPageId = e.currentTarget.dataset.id;
  var subPageIdx = e.currentTarget.dataset.idx;
  that.setData({
    selectedInfoPageIdx: subPageIdx,
    selectedInfoPageId: subPageId
  });
  if (subPageId){
    that.loadInfoPageById(subPageId);
  }
}
function handleInfoTabScrollToLower(e){
  let that = this;
  let subPage = that.data.infoPageList[0];
  if (that.data.selectedInfoPageIdx && that.data.selectedInfoPageIdx >= 0){
    subPage = that.data.infoPageList[that.data.selectedInfoPageIdx];
  }
  if (subPage.hasLoaded && subPage.total > subPage.subListData.length) {
    that.loadInfoPageById(subPage.id);
  }
}
function loadSubPageById(subClsId){
  var that = this;
  var idx = that.findSubClsIndexFromList(subClsId);
  var cat = that.data.subClsList[idx];
  var cusmallToken = wx.getStorageSync('cusmallToken');
  if (cat && cat.hasLoaded && cat.subListData.length >= cat.total) {
    return false;
  }
  if (cat.loading) {
    return false;
  }
  var submitData = {
    cusmallToken: cusmallToken,
    start: cat.subListData ? cat.subListData.length : 0,
    limit: 10
  };
  if (subClsId) {
    submitData.classifyId = subClsId;
  }
  if (cat) {
    cat.hasLoaded = true;
    cat.loading = true;
  }
  
  try{

    submitData.shopUid = that.data.app.globalData.shopuid || "";
    submitData.fromUid = that.data.app.globalData.fromuid || "";
  }catch(e){
    console.log(e)
  }

  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/cusmall_page/queryPageByClassify',
    data: submitData,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        if (typeof (cat.subListData) == "undefined") {
          cat.subListData = [];
        }
        for (let i = 0; i < res.data.model.records.length; i++){
          res.data.model.records[i].createTime = util.formatTime(new Date(res.data.model.records[i].createTime));
        }
        cat.subListData = cat.subListData.concat(res.data.model.records);
        cat.total = res.data.model.total;
        cat.loading = false;
        that.setData({
          ["subClsList[" + idx + "]"]: cat
        });
      }
    }
  })
}

function loadInfoPageById(subClsId){
  var that = this;
  var idx = that.findInfoIndexFromList(subClsId);
  var info = {};
  if(idx == -1){
    idx = 0;
  } else {
    info = that.data.infoPageList[idx];
  }
  var cusmallToken = wx.getStorageSync('cusmallToken');
  if (info && info.hasLoaded && info.subListData.length >= info.total) {
    return false;
  }
  if (info.loading) {
    return false;
  }
  var submitData = {
    cusmallToken: cusmallToken,
    start: info.subListData ? info.subListData.length : 0,
    limit: 10
  };
  if (subClsId) {
    submitData.classifyId = subClsId;
  }
  if (info) {
    info.hasLoaded = true;
    info.loading = true;
  }
  
  try{

    submitData.shopUid = that.data.app.globalData.shopuid || "";
    submitData.fromUid = that.data.app.globalData.fromuid || "";
  }catch(e){
    console.log(e)
  }

  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/cusmall_page/queryPageByClassify',
    data: submitData,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        if (typeof (info.subListData) == "undefined") {
          info.subListData = [];
        }
        for (let i = 0; i < res.data.model.records.length; i++){
          let record = res.data.model.records[i];
          let decoration = JSON.parse(record.decoration);
          record.icon_url = decoration.header_data.icon_url;
          record.createTime = util.formatTime(new Date(record.createTime));
        }
        info.subListData = info.subListData.concat(res.data.model.records);
        info.total = res.data.model.total;
        info.loading = false;
        info.id = subClsId;
        that.setData({
          ["infoPageList[" + idx + "]"]: info
        });
      }
    }
  })
}

function findAllSubCls(idx){
  var that = this;
  var cusmallToken = wx.getStorageSync('cusmallToken');
  var mallSiteId = wx.getStorageSync('mallSiteId');
  let fromUid = "";
  let shopUid = ""
  try {

     shopUid = that.data.app.globalData.shopuid || "";
     fromUid = that.data.app.globalData.fromuid || "";
  } catch (e) {
    console.log(e)
  }
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/cusmall_page/queryPageClassify',
    data: {
      start: 0,
      limit: 20,
      fromUid: fromUid,
      shopUid: shopUid,
      cusmallToken: cusmallToken
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        var subClsList = res.data.model.records;
        that.setData({
          subClsList: subClsList
        });
        if (subClsList.length > 0) {
          let cat = that.data.subClsList[0];
          if (that.data.selectedSubData && that.data.selectedSubData["sub-" + idx]) {
            cat = that.data.selectedSubData["sub-" + idx];
            // 数据存储在subClsList中
            cat = that.data.subClsList[that.findSubClsIndexFromList(cat.id)];
          }
          that.loadSubPageById(cat.id);
        }

      }
    }
  })
}

//点击进入图片预览
function handleQrcImg(e){
  let imgUrl = e.currentTarget.dataset.img;
  wx.previewImage({
    current: imgUrl, // 当前显示图片的http链接
    urls: [imgUrl] // 需要预览的图片http链接列表
  });
}

//绑定分销关系
function commBindPromoter (promoterOpenid) {
  let cusmallToken = wx.getStorageSync('cusmallToken');
  wx.request({
    url: cf.config.pageDomain + "/applet/mobile/distributor/bindPromoter",
    data: {
      cusmallToken: cusmallToken,
      promoterOpenid: promoterOpenid,
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let data = res.data;
      console.log(data);
    },
    fail: function () {
    },
    complete: function () {
    }
  });
}

function commInvitation(scene){
  let cusmallToken = wx.getStorageSync('cusmallToken');
  wx.request({
    url: cf.config.pageDomain + "/applet/mobile/member/invitattionMember",
    data: {
      cusmallToken: cusmallToken,
      scene: scene,
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let data = res.data;
      console.log(data);
    },
    fail: function () {
    },
    complete: function () {
    }
  });
}


function showCountDownList(endDate, targetTime) {
  let that = this;
  endDate = new Date(endDate);
  var now = new Date();
  let atyTimeShutDown;
  var leftTime = endDate.getTime() - now.getTime();
  if (0 >= leftTime) {
    atyTimeShutDown = { timerDay1: "00", timerHour1: "00", timerMinute1: "00", timerSecond1: "00" };
    targetTime.atyTimeShutDown = atyTimeShutDown;
    targetTime.atyIsLive = false;
    return;
  }
  var dd = util.numAddPreZero(parseInt(leftTime / 1000 / 60 / 60 / 24, 10));//计算剩余的天数
  var hh = util.numAddPreZero(parseInt(leftTime / 1000 / 60 / 60 % 24, 10));//计算剩余的小时数
  var mm = util.numAddPreZero(parseInt(leftTime / 1000 / 60 % 60, 10));//计算剩余的分钟数
  var ss = util.numAddPreZero(parseInt(leftTime / 1000 % 60, 10));//计算剩余的秒数

  atyTimeShutDown = { timerDay1: dd, timerHour1: hh, timerMinute1: mm, timerSecond1: ss };

  targetTime.atyTimeShutDown = atyTimeShutDown;
  targetTime.atyIsLive = true;
}

//秒杀列表
function getSKListData(){
  let cxt = this;
  let mallSiteId = wx.getStorageSync('mallSiteId');
  wx.request({
    url: cf.config.pageDomain + '/mobile/base/activity/busi/queryActivityList',
    data: {
      mallSiteId: mallSiteId,
      start: 0,
      end: 3,
      activityType: 3,
      status: -1
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let data = res.data;

      if (data && 0 == data.ret) {
        let rets = data.model.records || [];
        let mCountDownList = [];
        for (let i in rets) {
          let mDate = {
            endTime: rets[i].endTime,
            startTime: rets[i].startTime
          }
          mCountDownList.push(mDate);
          rets[i].eo = JSON.parse(rets[i].extendOperation);
        }
        
        cxt.setData({
          seckList: rets
        });
        cxt.setData({
          countDownList: mCountDownList
        })
        
      }
    },
    complete: function () {
      let secTimer;
      if (cxt.data.countDownList && 0 < cxt.data.countDownList.length ){
        secTimer = setInterval(function () {
          let countDownList = cxt.data.countDownList;
          console.log("commh")
          for (let i = 0; i < (countDownList && countDownList.length); i++) {

            cxt.showCountDownList(countDownList[i].endTime, countDownList[i]);
          }
          cxt.setData({
            countDownList: countDownList
          })
        }, 1000);
        cxt.setData({
          secTimer: secTimer
        });
      }
      
    }
  })
}

function clearSecAtyTimer(){
  clearInterval(this.data.secTimer);
}
function setSecAtyTimer() {
  let secTimer;
  let cxt = this;
  if (undefined == cxt.data.secTimer){
    return;
  }
  
  secTimer = setInterval(function () {
    let countDownList = cxt.data.countDownList;
    for (let i = 0; i < (countDownList && countDownList.length); i++) {

      cxt.showCountDownList(countDownList[i].endTime, countDownList[i]);
    }
    cxt.setData({
      countDownList: countDownList
    })
  }, 1000);
  cxt.setData({
    secTimer: secTimer
  });
}
function hidePasswordCheck() {
  let cxt = this;
  this.setData({
    showPwdCheck: false
  });
}
function switchPasswordCheck(){
  this.setData({
    showQrcodePopup: false
  })
  let cxt = this;
  this.setData({
    showPwdCheck: !cxt.data.showPwdCheck
  });
}
function passwordCheck(e){
  console.log(e)
  let cxt = this;
  let pcName = e.detail.value.pcName;
  let pcPwd = e.detail.value.pcPwd;
  if ("" == pcName){
    cxt.setData({
      pcNameErr : true
    });
    return;
  }else{
    cxt.setData({
      pcNameErr: false
    });
  }
  if ("" == pcPwd){
    cxt.setData({
      pcPwdErr : true
    });
    return;
  }else{
    cxt.setData({
      pcPwdErr: false
    });
  }

  let verid = e.detail.target.dataset.verid;
  if("order" == cxt.data.verType){
    verifyOrder(cxt, verid, pcName, pcPwd);

  } else if ("coupon" == cxt.data.verType){
    let uid = e.detail.target.dataset.uid;
    verifyCoupon(cxt, verid, pcName, pcPwd, uid);
  }

}

function verifyOrder(cxt, verid, pcName, pcPwd){
  let cusmallToken = wx.getStorageSync('cusmallToken');
  wx.showLoading({
    title: '核销处理中...',
  })
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/verifiedclerk/verifyOrder',
    data: {
      cusmallToken: cusmallToken,
      orderId: verid,
      clerkId: pcName,
      passward: pcPwd
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        wx.hideLoading();
        cxt.setData({
          showPwdCheck: false
        });
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: "核销成功"
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '核销订单异常',
          showCancel: false,
          content: res.data && res.data.msg
        })
      }
    },
    fail:function(){

    },
    complete:function(){
      
    }
  })
}

function verifyCoupon(cxt, verid, pcName, pcPwd, uid){
  wx.showLoading({
    title: '核销处理中...',
  })
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/verifiedclerk/verifyCoupon',
    data: {
      cusmallToken: cusmallToken,
      recordId: verid,
      clerkId: pcName,
      passward: pcPwd,
      uid: uid
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0) {
        wx.hideLoading();
        cxt.setData({
          showPwdCheck: false
        });
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: "核销成功"
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: "核销优惠券异常"
        });
        console.log(res.data)
      }
    }, 
    fail:function(){

    },
    complete:function(){

    }
  })
}
function mallSiteFindConfig(mallSiteId){//查配置
  let that = this;
  let cusmallToken = wx.getStorageSync('cusmallToken');
  wx.request({
    url: cf.config.pageDomain + '/applet/mobile/mallSite/findConfig',
    data: {
      cusmallToken: cusmallToken,
      mallSiteId: mallSiteId
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.ret == 0 && res.data.model.config) {
        that.setData({
          openQueryExpress: res.data.model.config.openQueryExpress
        })
      }
    }
  })
}

function openWxAdress(){
  wx.chooseAddress({
    success: function (res) {
      console.log(res)
    },
    fail(err){
      let mErr = JSON.stringify(err)
    }
  })
}

function toggleBgMusic() {
  let vm = this;
  vm.setData({
    playBgMusic: !vm.data.playBgMusic
  })
  if (vm.data.playBgMusic) {
    vm.audioCtx.play();
  } else {
    vm.audioCtx.pause();
  }
}

function onRefreshPage(){
  let vm = this;
  let currentPage = getCurrentPages()[getCurrentPages().length - 1];
  let pageUrl = "/" + currentPage.route;
  if (currentPage.options) {
    let param = "?";
    let i = 0;
    for (let k in currentPage.options) {
      if (i++ != 0) {
        param += "&";
      }
      param += (k + "=" + currentPage.options[k]);
    }
    pageUrl += param;
  }
  wx.redirectTo({
    url: pageUrl
  })
}

module.exports ={
  communityHandle: communityHandle,
  sbargainHandle: sbargainHandle,
  groupbuyHandle: groupbuyHandle,
  gbDetailPage: gbDetailPage,
  goodsDetailPage: goodsDetailPage,
  onBannerImgLoad: onBannerImgLoad,
  handleTopicTap: handleTopicTap,
  handleReply: handleReply,
  handleCmtyCategoryTab: handleCmtyCategoryTab,
  handleLike: handleLike,
  handleSkuTap: handleSkuTap,
  addCount: addCount,
  onRefreshPage: onRefreshPage,
  minusCount: minusCount,
  onAddCart: onAddCart,
  onBuyNow: onBuyNow,
  onAddCartNext: onAddCartNext,
  onBuyNowNext: onBuyNowNext,
  gotoForm: gotoForm,
  loadInfoPageById: loadInfoPageById,
  onCloseBuy: onCloseBuy,
  handleBuyGoodsCountChange: handleBuyGoodsCountChange,
  findTopicIndexById: findTopicIndexById,
  changeLike: changeLike,
  //微页面分类
  findSubClsIndexFromList: findSubClsIndexFromList,
  handleSubClsTap: handleSubClsTap,
  handleClsIdTabScrollToLower: handleClsIdTabScrollToLower,
  loadSubPageById: loadSubPageById,
  findInfoIndexFromList: findInfoIndexFromList,
  findAllSubCls: findAllSubCls,
  handleQrcImg: handleQrcImg,
  commBindPromoter: commBindPromoter,
  commInvitation,
  showCountDownList,
  getSKListData,
  handleCmtyCategorySectionTab,
  clearSecAtyTimer,
  setSecAtyTimer,
  handleInfoPageTap,
  handleInfoTabScrollToLower,
  passwordCheck,
  switchPasswordCheck,
  hidePasswordCheck,
  mallSiteFindConfig,
  toggleBgMusic

}