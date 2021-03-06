function wxpay(app, money, orderId, redirectUrl) {
  let remark = "在线充值";
  let nextAction = {};
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
  }
  wx.request({
    url:app.globalData.urlDomain + '/mall/wxPay',
    data: {
      UID: wx.getStorageSync('uid'),
      Money:money,
      Remark: remark,
      PayName:"在线支付",
      OrderId:orderId
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
      var bno = res.data.BNO;
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
          wx.request({
            url:app.globalData.urlDomain + '/mall/payResult',
            data: {
              UID: wx.getStorageSync('uid'),
              BNO: bno,
              Ret: 1
            },
            method:'POST',
            success:function(res) {
              wx.showToast({title: '支付成功'})
              wx.redirectTo({//支持成功时告诉服务端
                url: redirectUrl
              });              
            }
          });
        }
      })
    }
  })
}

module.exports = {
  wxpay: wxpay
}
