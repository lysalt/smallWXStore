var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType: ["申请售后", "售后处理中", "已处理"],
    currentType:0,
    tabClass: ["", "", "", "", ""]
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.index;
     this.data.currentType = curType
     this.setData({
       currentType:curType
     });
     this.onShow();
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  toApply:function(e){
      var orderId = e.currentTarget.dataset.id;
      console.log(orderId);
      wx.navigateTo({
        url: "/pages/problem-submit/index?id=" + orderId
      })
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  onShow:function(){
    wx.showLoading();
    var that = this;
    var postData = {
      UID:wx.getStorageSync('uid')
    };
    if (this.data.currentType == 0) {
      postData.Status = 3;// 获取已收到货的订单列表
    }
    if (this.data.currentType == 1) {
      postData.Status = 5;
    }
    if (this.data.currentType == 2) {
      postData.Status = 6;
    }
    wx.request({
      url:app.globalData.urlDomain + '/mall/orderList',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        console.log(res.data);
        if (res.data && res.data.orderList) {
          that.setData({
            orderList: res.data.orderList,
            logisticsMap : res.data.logisticsMap
          });
        } else {
          this.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {}
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
