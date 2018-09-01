//index.js
//获取应用实例
var app = getApp()
Page({
  data: {},
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
  },
  onShow: function () {
    var that = this;
    wx.request({
      url:'https://fzd.xcloudtech.com:8989/mall/orderDetail',
      data: {
        UID: wx.getStorageSync('uid'),
        OrderId:that.data.orderId
      },
        success: (res) => {
          wx.hideLoading();
          if (res.header.err) {
            wx.showModal({
              title: '出错提示',
              content: decodeURI(res.header.err),
            })
            return;
          }
          that.setData({
            orderDetail: res.data
          });
        }
    })
  }
})
