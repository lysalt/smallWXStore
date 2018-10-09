var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      statusType: ["充值", "得佣金", "支付"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.urlDomain + '/mall/record',
      data: {
        UID: wx.getStorageSync('uid')
      },
      success: function (res) {
        if (res.header.err) {
          wx.showModal({
            title: '出错提示',
            content: decodeURI(res.header.err),
          })
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].Time =  res.data.data[i].Time.substr(5, 11);
          res.data.data[i].AddValue = Math.abs(res.data.data[i].AddValue);
          if (res.data.data[i].Type == 0) {
            res.data.data[i].Type = '充值';
          }
          if (res.data.data[i].Type == 1) {
            res.data.data[i].Type = '得佣金';
          }
          if (res.data.data[i].Type == 2) {
            res.data.data[i].Type = '购物:扣除';
          }
          if (res.data.data[i].Type == 3) {
            res.data.data[i].Type = '退款';
          }
        }
        that.setData({
          list: res.data.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})