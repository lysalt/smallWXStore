var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType: ["分享列表", "已付款", "已完成"],
    orderStatusType: ["待付款", "待发货", "待收货", "待评价", "已完成", "售后中"],
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
    var url = app.globalData.urlDomain + '/mall/share';
    if (this.data.currentType == 1) {
      url = app.globalData.urlDomain + '/mall/shareInfo';
      postData['Status'] = 10;
    }
    if (this.data.currentType == 2) {
      url = app.globalData.urlDomain + '/mall/shareInfo';
      postData['Status'] = 4;      
    }

    wx.request({
      url:url,
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.data && res.data.data.length > 0) {
          var allTips = 0;
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].pic.indexOf('http') != 0) {
              res.data.data[i].pic = app.globalData.urlDomain + res.data.data[i].pic;
            }
            if (res.data.data[i].Status == 1) {
              res.data.data[i].Status = '待发货';
            }
            if (res.data.data[i].Status == 2) {
              res.data.data[i].Status = '待收货';
            }
            if (res.data.data[i].Status == 3) {
              res.data.data[i].Status = '待评价';
            }
            if (res.data.data[i].Status == 4) {
              res.data.data[i].Status = '佣金已返到余额';
            }
            if (res.data.data[i].Status == 5) {
              res.data.data[i].Status = '售后中';
            }
            allTips += res.data.data[i].Tip;
          }
          that.setData({
            goodsList: res.data.data,
            counts:res.data.data.length,
            allTips:allTips
          });
        } else {
          this.setData({
            goodsList: null
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
  
  },
  enterDetail: function (e) {
    wx.navigateTo({
      url:"/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    }) 
  },
  deleteShare:function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该分享吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url:app.globalData.urlDomain + '/mall/delShare',
            data: {
              ShareId:id
            },
            method:'POST',
            success: (res) => {
              if (res.header.err) {
                wx.showModal({
                  title: '出错提示',
                  content: decodeURI(res.header.err),
                })
                return;
              }
              this.onShow();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  }
})
