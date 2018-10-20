module.exports = {
  handleDineWaySelect: function (e) {
    var that = this;
    var dineWayId = e.currentTarget.dataset.id;
    that.setData({ "selectedDineWay": dineWayId });
    that.multInit();
  },
  handleDineWayModalTap: function (e) {
    var that = this;
    var target = e.target;
    if (target) {
      var action = target.dataset.action;
      if ("closeModal" == action) {
        that.setData({ "showDineWayList": false });
      }
    }
  },

  handleDineWayModalOpen: function (e) {
    this.setData({ "showDineWayList": true });
  },

  handleDineWayModalClose: function (e) {
    this.setData({ "showDineWayList": false });
  }
}