function wxpay(app, money, orderId, redirectUrl) {
  let remark = "在线充值";
  let nextAction = {};
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
    nextAction = { type: 0, id: orderId };
  }
  wx.request({
    // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/pay/wxapp/get-pay-data',
    url:'https://fzd.xcloudtech.com:8989/mall/wxPay',
    data: {
      UID: wx.getStorageSync('uid'),
      Money:money,
      Remark: remark,
      PayName:"在线支付",
      NextAction: nextAction
    },
    method:'POST',
    success: function(res){
      if (res.header.err) {
        wx.showModal({
          title: '出错提示',
          content: decodeURI(res.header.err),
        })
        return;
      }

      wx.requestPayment({
        timeStamp:res.data.timeStamp,
        nonceStr:res.data.nonceStr,
        package:'prepay_id=' + res.data.prepayId,
        signType:'MD5',
        paySign:res.data.data.sign,
        fail:function (aaa) {
          wx.showToast({title: '支付失败:' + aaa})
        },
        success:function () {
          wx.showToast({title: '支付成功'})
          wx.redirectTo({//支持成功时告诉服务端
            url: redirectUrl
          });
        }
      })
    }
  })
}

module.exports = {
  wxpay: wxpay
}
