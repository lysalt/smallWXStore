// pages/index/index.js
// var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')
// var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      upFilesBtn:true,
      upFilesProgress:false,
      maxUploadLen:6,
      orderId:''
  },

  onLoad:function(e){
    var orderId = e.id;
    console.log(orderId);
    this.data.orderId = orderId;
    this.setData({
      orderId: orderId
    });
  },
  // 预览图片
  previewImg: function (e) {
      let imgsrc = e.currentTarget.dataset.presrc;
      let _this = this;
      let arr = _this.data.upImgArr;
      let preArr = [];
      arr.map(function(v, i) {
          preArr.push(v.path)
      })
    //   console.log(preArr)
      wx.previewImage({
          current: imgsrc,
          urls: preArr
      })
  },
    // 删除上传图片 或者视频
  delFile:function(e){
     let _this = this;
     wx.showModal({
         title: '提示',
         content: '您确认删除嘛？',
         success: function (res) {
             if (res.confirm) {
                 let delNum = e.currentTarget.dataset.index;
                 let delType = e.currentTarget.dataset.type;
                 let upImgArr = _this.data.upImgArr;
                 let upVideoArr = _this.data.upVideoArr;
                 if (delType == 'image') {
                     upImgArr.splice(delNum, 1)
                     _this.setData({
                         upImgArr: upImgArr,
                     })
                 } else if (delType == 'video') {
                     upVideoArr.splice(delNum, 1)
                     _this.setData({
                         upVideoArr: upVideoArr,
                     })
                 }
                 let upFilesArr = upFiles.getPathArr(_this);
                 if (upFilesArr.length < _this.data.maxUploadLen) {
                     _this.setData({
                         upFilesBtn: true,
                     })
                 }
             } else if (res.cancel) {
                 console.log('用户点击取消')
             }
         }
     })
  },
  // 选择图片或者视频
  uploadFiles: function (e) {
      var _this = this;
      wx.showActionSheet({
          itemList: ['选择图片', '选择视频'],
          success: function (res) {
            //   console.log(res.tapIndex)
              let xindex = res.tapIndex;
              if (xindex == 0){
                  upFiles.chooseImage(_this, _this.data.maxUploadLen)
              } else if (xindex == 1){
                  upFiles.chooseVideo(_this, _this.data.maxUploadLen)
              }
              
          },
          fail: function (res) {
              console.log(res.errMsg)
          }
      })
  },
  // 上传文件
  submitProblem:function(e){
      let _this = this;
      let upData = {};
      let upImgArr = _this.data.upImgArr;
      let upVideoArr = _this.data.upVideoArr;
      _this.setData({
          upFilesProgress:true,
      })
      if (e.detail.value["problemRemark"] == '') {
          wx.showModal({
            title: '提示',
            content: '请输入备注内容',
            showCancel:false
          })
          return
      }
      if (!upImgArr && !upVideoArr) {
          wx.showModal({
            title: '提示',
            content: '请上传图片或视频',
            showCancel:false
          })
          return        
      }
      upData['url'] = config.service.upFiles;
      upData['formData'] = {orderId:this.data.orderId, content:e.detail.value["problemRemark"]};
      upFiles.upFilesFun(_this, upData, function(res) {
          if (res.index < upImgArr.length){
              upImgArr[res.index]['progress'] = res.progress
              _this.setData({
                  upImgArr: upImgArr,
              })
          } else {
              let i = res.index - upImgArr.length;
              upVideoArr[i]['progress'] = res.progress
              _this.setData({
                  upVideoArr: upVideoArr,
              })
          }
      }, function (arr) {
          wx.showModal({
            title: '提示',
            content: '提交申诉成功，我们会尽快处理',
            showCancel:false
          })
          wx.navigateTo({
            url:"/pages/order-list/index?curType=5"
          });
      })
  }
})
