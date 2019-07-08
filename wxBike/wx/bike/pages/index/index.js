var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var localTomcat = getApp().globalData.localTomcat;
Page({
  /**
  * 页面的初始数据
  */
  data: {
    lat: 0,
    log: 0,
    controls: [],
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.mapCtx = wx.createMapContext('map');

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'EBMBZ-N5FWU-JYOVP-B3LKB-63JCQ-XBFHT'
    });



    var that = this;
    wx.getLocation({
      success: function (res) {
        var lat = res.latitude;
        var log = res.longitude;
        //先传经度，再纬度
        findBikes(that, log, lat);
      },
    })
    //模拟加载的动画
    wx.showLoading({
      title: '加载中',
    })
    //1.5s关闭动画效果
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)



    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        var width = res.windowWidth;
        that.setData({
          controls: [{
            //中心点位置
            id: 1,
            iconPath: '/image/location.png',
            position: {
              width: 20,
              height: 35,
              left: width / 2 - 10,
              top: height / 2 - 35.
            },
            //是否可点击
            clickable: true
          }, {
            //定位按钮安置
            id: 2,
            iconPath: '/image/img1.png',
            position: {
              width: 40,
              height: 40,
              left: 20,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //扫码按钮
            id: 3,
            iconPath: '/image/qrcode.png',
            position: {
              width: 100,
              height: 40,
              left: width / 2 - 50,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //充值按钮
            id: 4,
            iconPath: '/image/pay.png',
            position: {
              width: 40,
              height: 40,
              left: width - 45,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, { //手动添加一辆单车
            id: 5,
            iconPath: "/image/bike.png",
            position: {
              width: 35,
              height: 40,
            },
            //是否可点击
            clickable: true
          }, { //报修
            id: 6,
            iconPath: "/image/warn.png",
            position: {
              width: 35,
              height: 35,
              left: width - 42,
              top: height - 103.
            },
            //是否可点击
            clickable: true
          }]
        })
      },
    })
  },

  regionchange(e) {
    var that = this;
    if (e.type == "end") {
      that.mapCtx.getCenterLocation({
        success: function (res) {
          // findBikes(that, res.longitude, res.latitude)
          // findAllBikes(that, res.latitude, res.longitude)
          // console.log("huadonghuadong")
         
// -----------------解决闪烁-----------------------------
          var distance = getDistance(res.latitude, res.longitude, that.data.lat, that.data.log)
          if ((res.latitude == that.data.lat && res.longitude == that.data.log) || distance < 1) {
            return;
          }
          findBikes(that, res.longitude, res.latitude)
// ----------------------------------------------------------
        }
      })
    }
  },

  controltap(e) {
    var that = this;
    if (e.controlId == 2) {
      //点击定位当前位置
      that.mapCtx.moveToLocation();
    }
    if (e.controlId == 3) {
      //获取全局变量中的status属性值
      var status = getApp().globalData.status;
      if (status == 0) {
        //跳转到注册页面
        wx.navigateTo({
          url: '../register/register',
        });
      } else if (status == 1) {
        wx.navigateTo({
          url: '../deposit/deposit',
        });
      } else if (status == 2) {
        wx.navigateTo({
          url: '../identify/identify',
        });
      } else if (status == 3) {
        wx.navigateTo({
          url: '../register/register',
        });
        // scanCode()
      }
    }

    if (e.controlId == 4) {
      console.log("123")
      wx.navigateTo({
        url: '../pay/pay',
      })
    }

    if (e.controlId == 5) {
      //添加车辆
      that.mapCtx.getCenterLocation({
        success: function (res) {
          var lat = res.latitude;
          var log = res.longitude;
          //取出车辆编号
          var bikeNo = getApp().globalData.bikeNo;
          wx.request({
            // url: "http://localhost:9999/bike",
            url: localTomcat+"/bike",
            method: 'POST',
            data: {
              id: bikeNo,
              //使用mongo的geo，数据是格式是[经度，纬度]
              location: [log, lat]
            },
            success: function () {
              //车辆编号+1
              getApp().globalData.bikeNo = bikeNo + 1
              findBikes(that, log, lat)
            }
          })
        }
      })
    }

    if (e.controlId == 6) {
      wx.navigateTo({
        url: '../warn/warn',
      })
    }

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    //获取当前位置
    wx.getLocation({
      success: function (res) {
        //纬度
        var lat = res.latitude;
        //经度
        var log = res.longitude;
        //从本地存储中取出唯一身份标识
        var openid = wx.getStorageSync('openid')
        // //发送request向ES中添加数据（添加一条文档）
        // wx.request({
        //   url: "http://192.168.5.250/bike/p_index",
        //   data: {
        //     time: new Date(),
        //     openid: openid,
        //     lat: lat,
        //     log: log
        //   },
        //   method: "POST",
        //   success: function() {}
        // })
      },
    })

    //10关闭活动提示
    setTimeout(function () {
      that.setData({
        isHidden: "none"
      })
    }, 30000)
  }

})

function findBikes(that, log, lat) {
  //请求后端数据
  wx.request({
    // url: "http://localhost:9999/bikes",
    url: localTomcat+"/bikes",
    method: 'GET',
    data: {
      longitude: log,
      latitude: lat,
    },
    success: function (res) {
      console.log(res)
      //函数式编程，将每个GeoResult中的单词数据迭代出来
      const bikes = res.data.content.map((reslut) => {
        var bike = reslut.content
        return {
          id: bike.id,
          iconPath: "/image/bike.png",
          width: 35,
          height: 40,
          longitude: bike.location[0],
          latitude: bike.location[1]

        };
      });
      // 修改data里面的markers
      that.setData({
        lat: lat,
        log: log,
        markers: bikes
      });
    }
  })
}


function findAllBikes(that, lat, log) {
  //请求后端数据
  wx.request({
    // url: "http://localhost:9999/allbikes",
    url: localTomcat+"/allbikes",
    method: 'GET',
    success: function (res) {
      const bikes = res.data.map((item) => {
        return {
          id: item.id,
          iconPath: "/image/bike.png",
          width: 35,
          height: 40,
          latitude: item.latitude,
          longitude: item.longitude
        };
      });
      // 修改data里面的markers
      that.setData({
        lat: lat,
        log: log,
        markers: bikes
      });
    }
  })
}



function scanCode() {
  wx.scanCode({
    success: function (res) {
      var bikeNo = res.result;
      console.log(bikeNo);

      // ----------------可能需要的代码---------------------------------
      //       var openid = wx.getStorageSync('openid');
      // qqmapsdk.reverseGeocoder({
      //   location: {
      //     longitude: that.data.log,
      //     latitude: that.data.lat
      //   },
      //   success: function (res) {
      //     var addr = res.result.address_component
      //     var province = addr.province;
      //     var city = addr.city;
      //     var district = addr.district;
      //   }
      // });
      // -------------------------------------------------------------
      /**
      var openid = wx.getStorageSync('openid');
      
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: that.data.lat,
          longitude: that.data.log
        },
        success: function (res) {
          var addr = res.result.address_component
          var province = addr.province;
          var city = addr.city;
          var district = addr.district;
          //将数据写入到es中
          
        }
      });
       */
      wx.navigateTo({
        url: '../billing/billing'
      });
    }
  })
}

/** 

//未充押金
if (!flag) {
  wx.showModal({
    title: '提示',
    content: '您的账号押金不足，请充押金后再尝试开锁吧！',
    showCancel: false,
    confirmText: '去充值',
    success: function (res) {
      wx.navigateTo({
        url: '../wallet/wallet',
      });
    }
  })
}
*/
function getDistance(lat1, lng1, lat2, lng2) {

  lat1 = lat1 || 0;

  lng1 = lng1 || 0;

  lat2 = lat2 || 0;

  lng2 = lng2 || 0;

  var rad1 = lat1 * Math.PI / 180.0;

  var rad2 = lat2 * Math.PI / 180.0;

  var a = rad1 - rad2;

  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

  var r = 6378137;

  return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

}