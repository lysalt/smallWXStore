const app = getApp()

Page({
	data: {
    balance:0,
    freeze:0,
    score:0,
    score_sign_continuous:0
  },
	onLoad() {
    
	},	
  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    } else {
      that.setData({
        userInfo: userInfo,
        version: app.globalData.version
      })
    }
    this.getUserApiInfo();
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
      showCancel:false
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      url:'https://fzd.xcloudtech.com:8989/mall/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      method:'POST',
      success: function (res) {
        if (res.header.err) {
          wx.showModal({
            title: '出错提示',
            content: decodeURI(res.header.err),
          })
          return;
        }
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        that.getUserApiInfo();
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      url:'https://fzd.xcloudtech.com:8989/mall/userDetail',
      data: {
        UID: wx.getStorageSync('uid')
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            apiUserInfoMap: res.data,
            userMobile: res.data.Mobile,
            balance:res.data.Balance,
            freeze:res.data.Freeze,
            score:res.data.Score
          });
        }
      }
    })
  },
  scoresign: function () {
    var that = this;
    wx.request({
      // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
      url:'https://fzd.xcloudtech.com:8989/mall/sign',
      data: {
        UID: wx.getStorageSync('uid')
      },
      method:'POST',
      success: function (res) {
        if (res.header.err) {
          wx.showModal({
            title: '出错提示',
            content: decodeURI(res.header.err),
          })
          return;
        }
        if (res.data.Continuous) {
          that.setData({
            score_sign_continuous:res.data.Continuous,
            score:res.data.Score
          })
        }
      }
    })
  },
  relogin:function(){
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})