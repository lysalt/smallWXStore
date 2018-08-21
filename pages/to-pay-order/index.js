//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    totalScoreToPay: 0,
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    allGoodsAndYunPrice:0,
    goodsJsonStr:"",
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  onShow : function () {
    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow"==that.data.orderType){
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    }else{
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    });
  },

  getDistrictId : function (obj, aaa){
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var uid = wx.getStorageSync('uid')
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    var postData = {
      UID:uid,
      GoodsList:that.data.goodsList,
      GooodsJsonStr: that.data.goodsJsonStr,
      GoodsNumber:that.data.goodsNumber,
      GoodsMapList:that.data.goodsMapList,
      AmountTotle:that.data.allGoodsPrice,
      Logistics:{},
      Status:0,
      Remark: remark
    };
    // var postData = JSON.parse(that.data.goodsJsonStr);
    // postData.uid = uid;
    // postData.remark = remark;
    if (that.data.kjId) {
      postData.kjid = that.data.kjId;
    }
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      // postData.provinceId = that.data.curAddressData.provinceId;
      // postData.cityId = that.data.curAddressData.cityId;
      // if (that.data.curAddressData.districtId) {
      //   postData.districtId = that.data.curAddressData.districtId;
      // }
      // postData.address = that.data.curAddressData.address;
      // postData.linkMan = that.data.curAddressData.linkMan;
      // postData.mobile = that.data.curAddressData.mobile;
      // postData.code = that.data.curAddressData.code;
      postData.Pro = that.data.curAddressData.Pro;
      postData.City = that.data.curAddressData.City;
      if (that.data.curAddressData.Dist) {
        postData.Dist = that.data.curAddressData.Dist;
      }
      postData.Addr = that.data.curAddressData.Addr;
      postData.LinkMan = that.data.curAddressData.LinkMan;
      postData.Mobile = that.data.curAddressData.Mobile;
      postData.Code = that.data.curAddressData.Code;
    }
    if (that.data.curCoupon) {
      postData.CouponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.Calculate = "true";
    }

    wx.request({
      // url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
      url: 'https://fzd.xcloudtech.com:8989/mall/createOrder',
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      data: postData, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        if (res.header.err) {
          wx.showModal({
            title: '出错提示',
            content: decodeURI(res.header.err),
          })
          return;
        }

        if (e && "buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }
        if (!e) {
          that.setData({
            totalScoreToPay: res.data.score,
            isNeedLogistics: res.data.isNeedLogistics,
            allGoodsPrice: res.data.amountTotle,
            allGoodsAndYunPrice: res.data.amountLogistics + res.data.amountTotle,
            yunPrice: res.data.amountLogistics
          });
          that.getMyCoupons();
          return;
        }
        // 配置模板消息推送
        // var postJsonString = {};
        // postJsonString.keyword1 = { value: res.data.dateAdd, color: '#173177' }
        // postJsonString.keyword2 = { value: res.data.amountReal + '元', color: '#173177' }
        // postJsonString.keyword3 = { value: res.data.orderNumber, color: '#173177' }
        // postJsonString.keyword4 = { value: '订单已关闭', color: '#173177' }
        // postJsonString.keyword5 = { value: '您可以重新下单，请在30分钟内完成支付', color:'#173177'}
        // app.sendTempleMsg(res.data.id, -1,
        //   'mGVFc31MYNMoR9Z-A9yeVVYLIVGphUVcK2-S2UdZHmg', e.detail.formId,
        //   'pages/index/index', JSON.stringify(postJsonString));
        // postJsonString = {};
        // postJsonString.keyword1 = { value: '您的订单已发货，请注意查收', color: '#173177' }
        // postJsonString.keyword2 = { value: res.data.orderNumber, color: '#173177' }
        // postJsonString.keyword3 = { value: res.data.dateAdd, color: '#173177' }
        // app.sendTempleMsg(res.data.id, 2,
        //   'Arm2aS1rsklRuJSrfz-QVoyUzLVmU2vEMn_HgMxuegw', e.detail.formId,
        //   'pages/order-details/index?id=' + res.data.id, JSON.stringify(postJsonString));
        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      //url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/default',
      url: 'https://fzd.xcloudtech.com:8989/mall/shipAddress',
      data: {
        // token: wx.getStorageSync('token'),
        UID:wx.getStorageSync('uid')
      },
      success: (res) =>{
        console.log(JSON.stringify(res.data));
        if (res.data.data && res.data.data.length > 0) {
          console.log(33);
          that.setData({
            curAddressData:res.data.data[0]
          });
        }else{
          that.setData({
            curAddressData: null
          });
        }
        that.processYunfei();
      }
    })
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;
    var allNumber = 0;
    var goodsMap = {};
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      //console.log(JSON.stringify(carShopBean));
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;
      allNumber += carShopBean.number;
      goodsMap[carShopBean.goodsId] = carShopBean.pic;
      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }


      let inviter_id = 0;
      let inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
      if (inviter_id_storge) {
        inviter_id = inviter_id_storge;
      }

      this.data.goodsList[i].inviter_id = inviter_id;

      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id +'}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    var goodsMapList = [];
    for (var key in goodsMap) {
      goodsMapList.push(goodsMap[key]);
    }
    that.setData({
      isNeedLogistics: isNeedLogistics,
      //goodsJsonStr: goodsJsonStr,
      goodsMapList:goodsMapList,
      goodsNumber:allNumber,
      allGoodsPrice:allGoodsPrice
    });
    //that.createOrder();
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  },
  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: wx.getStorageSync('token'),
        status:0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon:null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  }
})
