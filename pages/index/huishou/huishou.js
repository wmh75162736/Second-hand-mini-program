
Page({


  data: {

  },


  onLoad(options) {
    wx.cloud.database().collection('shop_huishous')
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        list:res.data
      })
    })
  },
  call(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
    })
  },
  copy(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.weixin,
    })
  },
})