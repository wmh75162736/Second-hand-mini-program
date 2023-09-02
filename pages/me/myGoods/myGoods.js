const app = getApp()
Page({
  data: {
  },
  onShow(options) {
    this.getGoodsList()
  },
  getGoodsList(){
    wx.cloud.database().collection('shop_goods')
    .where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        goodsList:res.data
      })
    })

  },
  //上架商品
  up(event){
    console.log(event.currentTarget.dataset.index)
    let index = event.currentTarget.dataset.index
    wx.cloud.database().collection('shop_goods')
    .doc(this.data.goodsList[index]._id)
    .update({
      data:{
        status:true
      }
    })
    .then(res=>{
      wx.showToast({
        title: '上架成功',
      })
      this.getGoodsList()
    })
  },
  //下架商品
  down(event){
    console.log(event.currentTarget.dataset.index)
    let index = event.currentTarget.dataset.index
    wx.cloud.database().collection('shop_goods')
    .doc(this.data.goodsList[index]._id)
    .update({
      data:{
        status:false
      }
    })
    .then(res=>{
      wx.showToast({
        title: '下架成功',
      })
      this.getGoodsList()
    })
  },
  //删除商品
  delete(event){
    console.log(event.currentTarget.dataset.index)
    let index = event.currentTarget.dataset.index
    wx.cloud.database().collection('shop_goods')
    .doc(this.data.goodsList[index]._id)
    .remove()
    .then(res=>{
      wx.showToast({
        title: '删除成功',
      })
      this.getGoodsList()
    })
  },
  edit(event){
    console.log(event.currentTarget.dataset.index)
    let index = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/me/myGoods/edit/edit?id=' + this.data.goodsList[index]._id,
    })
  }
  
})