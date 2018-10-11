//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    wuliInfo:{"SF":"顺丰速运","HTKY":"百世快递","ZTO":"中通快递","STO":"申通快递","YTO":"圆通速递","YD":"韵达速递","YZPY":"邮政快递包裹","EMS":"EMS","HHTT":"天天快递","JD":"京东物流","QFKD":"全峰快递","GTO":"国通快递","UC":"优速快递","DBL":"德邦","FAST":"快捷快递","ZJS":"宅急送"}
  },
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
    console.log(orderId);
  },
  onShow: function () {
    var that = this;
    wx.request({
      url:app.globalData.urlDomain + '/mall/shipInfo',
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
            logisticsTraces: res.data.logisticsTraces,
            trackingNumber:res.data.trackingNumber,
            shipperName:that.data.wuliInfo[res.data.shipperName]
          });
        }
    })
  }
})
