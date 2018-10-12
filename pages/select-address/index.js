//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.urlDomain + '/mall/setDefaultAddress',
      method:'POST',
      data: {
        UID: wx.getStorageSync('uid'),
        ShipId:id
      },
      success: (res) =>{
        wx.navigateBack({})
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  
  onLoad: function () {
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:app.globalData.urlDomain + '/mall/shipAddress',
      data: {
        UID:uid
      },
      success: (res) => {
        if (res.data.data && res.data.data.length > 0) {
          that.setData({
            addressList:res.data.data
          });
        } else {
          that.setData({
            addressList: null
          });
        }
      }
    })
  }
})
