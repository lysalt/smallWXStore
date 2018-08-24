// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo){
      console.log('cannot get userinfo');
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.login();
    
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid');
    if (token) {
      wx.request({
        url: 'https://fzd.xcloudtech.com:8989/mall/checkToken',
        data: {
          Token: token,
          UID:uid
        },
        success: function (res) {
          if (res.header.err) {
            // 去注册
            // that.registerUser();
            wx.removeStorageSync('token')
            that.login();
            return;
          }
          else {
            // 回到原来的地方放
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        var userInfo = wx.getStorageSync('userInfo');
        var systemInfo = wx.getSystemInfoSync();
        wx.request({
          url: 'https://fzd.xcloudtech.com:8989/mall/wxlogin',
          data: {
            Code: res.code,
            Name:userInfo.nickName,
            ImgUrl:userInfo.avatarUrl,
            Model: systemInfo.model,
            SysVer: systemInfo.system,
            WxVer: systemInfo.version,
            Lan: systemInfo.language,
            Brand: systemInfo.brand,
            Sex:userInfo.gender
          },
          method:'POST',
          success: function (res) {
            // console.log(res.data);
            if (res.header.err) {
              // 去注册
              // that.registerUser();
              wx.showModal({
                title: '出错提示',
                content: decodeURI(res.header.err),
              })
              return;
            }
            wx.setStorageSync('token', res.data.Token)
            wx.setStorageSync('uid', res.data.UID)
            // 回到原来的地方放
            // wx.navigateBack();
            wx.navigateTo({
              url: "/pages/start/start"
            })
          }
        })
      }
    })
  }
})