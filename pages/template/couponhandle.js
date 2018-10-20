module.exports = {
  findCouponFormList: function (couponId) {
    for (var i = 0; i < this.data.couponList.length; i++) {
      if (couponId == this.data.couponList[i].id) {
        return this.data.couponList[i];
      }
    }
  },
  handleCouponSelect:function(e){
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    if (couponId == -1) {
      
      that.setData({ "selectedCoupon": null });
      if (that.multInit){
        that.multInit();
      } else if (that.refreshPrice){
        that.refreshPrice()
      }
      
      return;
    }
    var selectedCoupon = that.findCouponFormList(couponId);
    that.setData({ "selectedCoupon": selectedCoupon });
    if (that.multInit) {
      that.multInit();
    } else if (that.refreshPrice) {
      that.refreshPrice()
    }
  },
  handleCouponModalTap: function (e) {
    var that = this;
    var target = e.target;
    if (target) {
      var action = target.dataset.action;
      if ("closeModal" == action) {
        that.setData({ "showCouponList": false });
      }
    }
  },

  handleCouponModalOpen: function (e) {
    if (this.data.couponList.length > 0) {
      this.setData({ "showCouponList": true });
    }
  },

  handleCouponModalClose: function (e) {
    this.setData({ "showCouponList": false });
  }
}