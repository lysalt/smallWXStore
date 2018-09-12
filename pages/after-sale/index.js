var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType: ["申请售后", "售后处理中", "待评价", "申请记录"],
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
  cancelOrderTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url:app.globalData.urlDomain + '/mall/closeOrder',
            method:'POST',
            data: {
              OrderId: orderId
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
              // if (res.data.code == 0) {
                that.onShow();
              // }
            }
          })
        }
      }
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
  getOrderStatistics : function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: wx.getStorageSync('token') },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onShow:function(){
    wx.showLoading();
    var that = this;
    var postData = {
      UID:wx.getStorageSync('uid')
    };
    postData.Status = 3;// 获取已收到货的订单列表
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
