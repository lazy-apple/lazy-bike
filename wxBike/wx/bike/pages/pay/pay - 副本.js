// pages/pay/pay.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var localTomcat = getApp().globalData.localTomcat;




Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0, //余额
    currentTab: 3, //默认选中标签
    payMoney: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'EBMBZ-N5FWU-JYOVP-B3LKB-63JCQ-XBFHT'
    });
    // console.log(qqmapsdk)
  },

  //tab的切换
  switchNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        //tab
        currentTab: e.target.dataset.current,
        payMoney: e.target.dataset.money
      })
    }
  },

  
  // * 点击充值按钮
  
  recharge: function () {
    var that = this;
    //充值提示框
    wx.showModal({
      title: '充值',
      content: '您是否进行充值' + that.data.payMoney + '元?',
      success: function (res) {
        // console.log(res)
        //确认充值
        if (res.confirm) {
          //发送充值请求
          var phoneNum = getApp().globalData.phoneNum;
          var openid = getApp().globalData.openid;
          var amount =  that.data.payMoney;
          wx.request({
            // url: 'http://localhost:9999/recharge',
            url: localTomcat+'/recharge',
            method: 'POST',
            //header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              balance: amount,
              phoneNum: phoneNum
            },
            success: function (res) {
              if(res.data) {
                wx.showModal({
                  title: '提示',
                  content: '充值成功！',
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../index/index',
                      })
                      
                      wx.getLocation({
                        success: function (res) {
                          var lat = res.latitude;
                          var log = res.longitude;
                          //请求腾讯地图api查找省市区
                          qqmapsdk.reverseGeocoder({
                            location: {
                              latitude: lat,
                              longitude: log
                            },
                            success: function (res) {
                              console.log(11111111111111111111111111111111111)
                              var address = res.result.address_component;
                              var province = address.province;
                              var city = address.city;
                              var district = address.district;
                              var date = getApp().globalData.cur_date;
                                                                    
                              console.log(date)            
                              console.log(province + " , " + city + " ," + district)
                              wx.request({
                                url: 'http://192.168.255.203/kafka/user',
                                method: "post",
                                data: {
                                  phoneNum: "138000000000",
                                  amount: 10,
                                  date: date,
                                  lat: lat,
                                  log: log,
                                  province: province,
                                  city: city,
                                  district: district
                                }
                              })
                            }
                          })
                        },
                      })
                      // wx.getLocation({
                      //   success: function(res) {
                      //     var lat = res.altitude;
                      //     var log = res.longitude;
                      //     //埋点：记录用户充值的行为信息，以后做数据分析
                      //     wx.request({
                      //       url: "http://192.168.100.106/kafka/recharge",
                      //       data: {
                      //         openid: openid,
                      //         phoneNum: phoneNum,
                      //         amount: amount,
                      //         date: new Date(),
                      //         lat: lat,
                      //         log: log,

                      //       },
                      //       method: "POST"
                      //     })

                      //   },
                      // })

                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
   

  // recharge: function () {
  //   wx.getLocation({
  //     success: function (res) {
  //       var lat = res.latitude;
  //       var log = res.longitude;
  //       //请求腾讯地图api查找省市区
  //       qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: lat,
  //           longitude: log
  //         },
  //         success: function (res) {
  //           console.log(11111111111111111111111111111111111)
  //           var address = res.result.address_component;
  //           var province = address.province;
  //           var city = address.city;
  //           var district = address.district;
  //           console.log(province + " , " + city + " ," + district)
  //           wx.request({
  //             url: 'http://192.168.255.203/kafka/track',
  //             method:"post",
  //             data:{
  //               phoneNum: "138000000000",
  //               amount: 10,
  //               date: new Date(),
  //               lat: lat,
  //               log: log,
  //               province:province,
  //               city:city,
  //               district:district
  //             }
  //           })
  //         }
  //       })
  //     },
  //   })
  // },



})