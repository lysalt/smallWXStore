var app = getApp();
Page({
    data:{
      orderId:0,
        goodsList:[],
        yunPrice:"0.00"
    },
    onLoad:function(e){
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {
      var that = this;
      wx.request({
        url:app.globalData.urlDomain + '/mall/orderDetail',
        data: {
          OrderId:that.data.orderId
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
          that.setData({
            orderDetail: res.data
          });
        }
      })
      // var yunPrice = parseFloat(this.data.yunPrice);
      // var allprice = 0;
      // var goodsList = this.data.goodsList;
      // for (var i = 0; i < goodsList.length; i++) {
      //   allprice += parseFloat(goodsList[0].price) * goodsList[0].number;
      // }
      // this.setData({
      //   allGoodsPrice: allprice,
      //   yunPrice: yunPrice
      // });
    },
    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      let that = this;
      let orderId = this.data.orderId;
      let formId = e.detail.formId;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading();
              wx.request({
                url:app.globalData.urlDomain + '/mall/recvGoods',
                data: {
                  UID: wx.getStorageSync('uid'),
                  OrderId: orderId
                },
                method:'POST',
                success: (res) => {
                  if (res.header.err) {
                    wx.showModal({
                      title: '出错提示',
                      content: decodeURI(res.header.err)
                    })
                    return;
                  }
                  that.onShow();
                  // 模板消息，提醒用户进行评价
                  let postJsonString = {};
                  postJsonString.keyword1 = { value: that.data.orderDetail._id, color: '#173177' }
                  let keywords2 = '您已确认收货，期待您的再次光临！';
                  if (app.globalData.order_reputation_score) {
                    keywords2 += '立即好评，系统赠送您' + app.globalData.order_reputation_score +'积分奖励。';
                  }
                  postJsonString.keyword2 = { value: keywords2, color: '#173177' }
                  // app.sendTempleMsgImmediately('uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco', formId,
                  //   '/pages/order-details/index?id=' + orderId, JSON.stringify(postJsonString));
                }
              })
            }
          }
      })
    },
    submitReputation: function (e) {
      let that = this;
      let formId = e.detail.formId;
      wx.showLoading();
      var goodsIdList = [];
      var goodsList = that.data.orderDetail.GoodsList;
      for (var i = 0; i < goodsList.length; i++) {
        goodsIdList.push(goodsList[i].goodsId);
      }
      wx.request({
        url:app.globalData.urlDomain + '/mall/reputation',
        data: {
          UID:wx.getStorageSync('uid'),
          GoodsIdList:goodsIdList,
          OrderId:this.data.orderId,
          // Reputation:e.detail.value["goodReputation"],
          ReputationRemark:e.detail.value["goodReputationRemark"]
        },
        header: {
          'content-type': 'application/json'
        },
        method:'POST',
        success: (res) => {
          wx.hideLoading();
          if (res.header.err) {
            wx.showModal({
              title: '出错提示',
              content: decodeURI(res.header.err),
            })
            return;
          }
          that.onShow();
          // 模板消息，通知用户已评价
          let postJsonString = {};
          postJsonString.keyword1 = { value: that.data.orderDetail._id, color: '#173177' }
          let keywords2 = '感谢您的评价，期待您的再次光临！';
          if (app.globalData.order_reputation_score) {
            keywords2 += app.globalData.order_reputation_score + '积分奖励已发放至您的账户。';
          }
          postJsonString.keyword2 = { value: keywords2, color: '#173177' }
          // app.sendTempleMsgImmediately('uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco', formId,
          //   '/pages/order-details/index?id=' + that.data.orderId, JSON.stringify(postJsonString));
        }
      })
    }
})