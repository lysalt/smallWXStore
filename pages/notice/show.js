var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

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
    var that = this;
    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/detail',
    //   data: {
    //     id: options.id
    //   },
    //   success: function (res) {
            var data = {"content":"<p>尊敬的客户：<br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp;商城新开张，快来砸单哦！</p><p>&nbsp; &nbsp; &nbsp; &nbsp;1、全场包邮（偏远地区除外）</p><p>&nbsp; &nbsp; &nbsp; &nbsp;2、商品都是亲自体验过，觉得质量和性价比都不错才分享</p><p>&nbsp; &nbsp; &nbsp; &nbsp;3、分享可赚佣金：</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; A：分享过后有人通过分享链接下单直接得10个积分；</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; B：有人完成订单，分享者将直接获得佣金；</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; C：如果订单出现售后退款处理，分享者将无法获取佣金；</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;D：获取到的佣金直接会充到余额里，余额可提现</p><p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>4、积分的作用：</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; A：部分商品将可通过积分直接下单；</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; B：后期会推出积分兑换策略；</p><p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>","dateAdd":"2017-09-16 17:20:43","id":161,"isShow":true,"title":"商城新开张，优惠多多，戳 戳 戳 我看详情。","userId":951}
          that.setData({
            notice: data
          });
          WxParse.wxParse('article', 'html', data.content, that, 5);
    //     }
    //   }
    // })
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
  
  }
})