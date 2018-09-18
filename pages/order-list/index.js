var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成", "售后中"],
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
  toPayTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    var needScore = e.currentTarget.dataset.score;
    wx.request({
      url:app.globalData.urlDomain + '/mall/userDetail',
      data: {
        // token: wx.getStorageSync('token')
        UID:wx.getStorageSync('uid')
      },
      success: function (res) {
        if (res.header.err) {
          wx.showModal({
            title: '出错提示',
            content: decodeURI(res.header.err),
          })
          return;
        }

        money = money - res.data.Balance;
        if (res.data.Score < needScore) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足，无法支付',
            showCancel: false
          })
          return;
        }
        if (money <= 0) {
          // 直接使用余额支付
          wx.request({
            url:app.globalData.urlDomain + '/mall/balancePay',
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              UID:wx.getStorageSync('uid'),
              OrderId:orderId
              // token: wx.getStorageSync('token'),
              // orderId: orderId
            },
            success: function (res2) {
              if (res2.header.err) {
                wx.showModal({
                  title: '出错提示',
                  content: decodeURI(res2.header.err)
                })
                return;
              }
              wx.showToast({title: '支付成功'})
              that.setData({
                 currentType:1
              });
              that.onShow();
            }
          })
        } else {
          wxpay.wxpay(app, money, orderId, "/pages/order-list/index?curType=1");
        }
      }
    })    
  },
  onLoad:function(e){
    if (e.curType) {
     this.setData({
       currentType:Number(e.curType)
     });
    }
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
    // 获取订单列表
    wx.showLoading();
    var that = this;
    var postData = {
      UID:wx.getStorageSync('uid')
    };
    postData.Status = that.data.currentType;
    //this.getOrderStatistics();
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
            //goodsMap : res.data.goodsMap
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
