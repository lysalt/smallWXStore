//app.js
App({
  onLaunch: function () {
    var that = this;  
    wx.login({
      success: function (res) {
        console.log(res);
      }
    });
    wx.request({
      url:app.globalData.urlDomain + '/mall/config',
      success:function(res) {
        wx.setStorageSync('mallName', res.data.MallName);
        that.globalData.order_reputation_score = res.data.Reputation;
        that.globalData.recharge_amount_min = res.data.RechargeMin;
        that.globalData.kanjiaList = res.data.KanJiaList;
      }
    })  
    // 判断是否登录
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid');
    if (!token) {
      that.goLoginPageTimeOut()
      return
    }
    wx.request({
      url:app.globalData.urlDomain + '/mall/checkToken',
      data: {
        Token: token,
        UID: uid
      },
      success: function (res) {
        //console.log(res.data);
        if (res.header.err) {
          console.log(decodeURI(res.header.err));
          wx.removeStorageSync('token')
          that.goLoginPageTimeOut()
        }
      }
    })
  },
  goLoginPageTimeOut: function () {
    setTimeout(function(){
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 1000)
  },
  globalData:{
    userInfo:null,
    subDomain: "tz", //
    urlDomain:'https://fzd.xcloudtech.com:8080',
    version: "3.0.1",
    shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
  }
})
