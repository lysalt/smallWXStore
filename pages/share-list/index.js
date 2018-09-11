var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType: ["分享列表", "已付款", "已发货", "已完成"],
    currentType:0,
    tabClass: ["", "", "", "", ""]
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  onShow:function(){
    // 获取订单列表
    wx.showLoading();
    var that = this;
    var postData = {
      UID:wx.getStorageSync('uid')
    };
    wx.request({
      url:app.globalData.urlDomain + '/mall/shareInfo',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data) {
          that.setData({
            orderList: res.data
          });
        } else {
          this.setData({
            orderList: null
          });
        }
      }
    })
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  }
})
