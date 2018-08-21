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
      // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/detail',
      url:'https://fzd.xcloudtech.com:8989/mall/orderDetail',
      data: {
        token: wx.getStorageSync('token'),
        orderid:that.data.orderId
      },
        success: (res) => {
          //console.log(res.data);
          wx.hideLoading();
          // if (res.data.code != 0) {
          //   wx.showModal({
          //     title: '错误',
          //     content: res.data.msg,
          //     showCancel: false
          //   })
          //   return;
          // }
          if (res.header.err) {
            // 去注册
            // that.registerUser();
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
