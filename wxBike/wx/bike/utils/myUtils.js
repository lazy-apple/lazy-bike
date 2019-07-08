function getOpenid() {
  var globalData =  getApp().globalData;
  var openid = globalData.openid;
  if(!openid) {
    openid = wx.getStorageSync('openid');
    if(!openid) {
      wx.request({
        url: "http://localhost:9999/appInfo",
        success: function(res) {
          
        }
      })
    }
  }
}