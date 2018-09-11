//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    categories: [],
    banners:[],
    activeCategoryId: 0,
    goods:[],
    scrollTop:0,
    loadingMoreHidden:true,

    hasNoCoupons:true,
    coupons: [],
    searchInput: '',
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    wx.request({
      url:app.globalData.urlDomain + '/mall/banners',
      success: function(res) {
        console.log(res);
        if (!res.data.data || res.data.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].picUrl.indexOf('http') != 0) {
              res.data.data[i].picUrl = app.globalData.urlDomain + res.data.data[i].picUrl;
            }
          }
          that.setData({
            banners: res.data.data
          });
        }
      }
    }),
    wx.request({
      url:app.globalData.urlDomain + '/mall/categorys',
      success: function(res) {
        console.log(res);
        var categories = [{_id:0, cateName:"全部"}];

        for (var i = 0; i < res.data.data.length; i++) {
          categories.push(res.data.data[i]);
        }
        that.setData({
          categories:categories,
          activeCategoryId:0
        });
        that.getGoodsList(0);
      }
    })
    that.getCoupons ();
    that.getNotice ();
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
   },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url:app.globalData.urlDomain + '/mall/products',
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput
      },
      success: function(res) {
        that.setData({
          goods:[],
          loadingMoreHidden:true
        });
        var goods = [];
        if (!res.data.data || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }
        for(var i=0;i<res.data.data.length;i++){
          if (res.data.data[i].pic.indexOf('http') != 0) {
            res.data.data[i].pic = app.globalData.urlDomain + res.data.data[i].pic;
          }
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods:goods,
        });
      }
    })
  },
  getCoupons: function () {
    return;
    var that = this;
    wx.request({
      url:app.globalData.urlDomain + '/mall/coupons',//coupons
      success: function (res) {
        if (res.data.data && res.data.data.length > 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      }
    })
  },
  gitCoupon : function (e) {
    var that = this;
    wx.request({
      url:app.globalData.urlDomain + '/mall/fetchDiscount',
      data: {
        DiscountId: e.currentTarget.dataset.id,
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
        else {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
          })
        }
        // if (res.data.code == 20001 || res.data.code == 20002) {
        //   wx.showModal({
        //     title: '错误',
        //     content: '来晚了',
        //     showCancel: false
        //   })
        //   return;
        // }
        // if (res.data.code == 20003) {
        //   wx.showModal({
        //     title: '错误',
        //     content: '你领过了，别贪心哦~',
        //     showCancel: false
        //   })
        //   return;
        // }
        // if (res.data.code == 30001) {
        //   wx.showModal({
        //     title: '错误',
        //     content: '您的积分不足',
        //     showCancel: false
        //   })
        //   return;
        // }
        // if (res.data.code == 20004) {
        //   wx.showModal({
        //     title: '错误',
        //     content: '已过期~',
        //     showCancel: false
        //   })
        //   return;
        // }
        // if (res.data.code == 0) {
        //   wx.showToast({
        //     title: '领取成功，赶紧去下单吧~',
        //     icon: 'success',
        //     duration: 2000
        //   })
        // } else {
        //   wx.showModal({
        //     title: '错误',
        //     content: res.data.msg,
        //     showCancel: false
        //   })
        // }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url:app.globalData.urlDomain + '/mall/notices',
      data: {
        pageSize :5
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.data && res.data.data.length > 0) {
          var noticeData = {totalRow: res.data.data.length, totalPage: 1, dataList:res.data.data}
          that.setData({
            noticeList: noticeData
          });
        }
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  toSearch : function (){
    this.getGoodsList(this.data.activeCategoryId);
  }
})
