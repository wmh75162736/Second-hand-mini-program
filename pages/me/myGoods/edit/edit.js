const util = require('../../../../utils/util.js')
Page({


  data: {
    cloudDetaiImage:[], //商品详情图片
    cloudCoverImage:[] //商品封面图片
  },


  onLoad(options) {
    console.log('商品id',options.id)
    wx.cloud.database().collection('shop_goods')
    .doc(options.id)
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        good:res.data,
        cloudDetaiImage:res.data.images, //商品详情图片
        cloudCoverImage:[res.data.cover], //商品封面图片
        typeId:res.data.type
      })
    })
  },
  onShow(){
    this.getTypeList()
  },

  //获取分类
  getTypeList(){
    wx.cloud.database().collection('shop_types').get()
    .then(res=>{
      console.log(res)
      this.setData({
        typeList:res.data
      })
  
    })
  },
  getType(event){
    console.log(event.currentTarget.dataset.index)
    this.setData({
      currentIndex:event.currentTarget.dataset.index,
      typeId:this.data.typeList[event.currentTarget.dataset.index]._id
    })
  },

  //添加商品到数据库
  updateGood(event){
    console.log(event)
    let good = event.detail.value

    if(!good.title){
      wx.showToast({
        icon:'error',
        title: '名称为空',
      })
      return
    }
    if(!good.price){
      wx.showToast({
        icon:'error',
        title: '价格为空',
      })
      return
    }
    if(!good.stockNumber){
      wx.showToast({
        icon:'error',
        title: '数量为空',
      })
      return
    }
    if(!this.data.typeId){
      wx.showToast({
        icon:'error',
        title: '请选择类型',
      })
      return
    }
    if(!good.contact){
      wx.showToast({
        icon:'error',
        title: '联系为空',
      })
      return
    }
    if(this.data.cloudCoverImage.length==0){
      wx.showToast({
        icon:'error',
        title: '封面图片为空',
      })
      return
    }

    wx.cloud.database().collection('shop_goods')
    .doc(this.data.good._id)
    .update({
      data:{
        title:good.title,
        price:Number(good.price),
        type:this.data.typeId,
        cover:this.data.cloudCoverImage[0],
        images:this.data.cloudDetaiImage,
        text:good.text,
        isHome:false,
        // status:true,//默认上架状态
        stockNumber:Number(good.stockNumber),
        saleNumber:0,
        contact:good.contact,
        // time:util.formatTime(new Date())

      }
    })
    .then(res=>{
      console.log(res)
      wx.navigateBack({
        delta: 0,
        success(res){
          wx.showToast({
            title: '保存成功',
          })
        }
      })
      
    })



  },
  //选择详情图片
  chooseDetailImage(){
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.cloudDetaiImage.length,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        console.log(res)
        that.data.tempImgList = res.tempFilePaths
        //上传图片
        that.uploadImageDetail()
      }
    })
  },
  //上传详情图片到云存储
  uploadImageDetail(){
    var that = this;
    for(let l in this.data.tempImgList){
      wx.cloud.uploadFile({
        cloudPath:`goodImage/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[l],
        success(res){
          console.log(res.fileID)
          that.data.cloudDetaiImage.push(res.fileID)
          that.setData({
            cloudDetaiImage:that.data.cloudDetaiImage
          })
        }
      })
    }
  },
  //删除详情图片
  deleteDetailImage(event){
    console.log(event.currentTarget.dataset.index)
    this.data.cloudDetaiImage.splice(event.currentTarget.dataset.index,1)
    this.setData({
      cloudDetaiImage:this.data.cloudDetaiImage
    })
  },
 

   //选择封面图片
   chooseCoverImage(){
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.cloudCoverImage.length,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        console.log(res)
        that.data.tempImgList = res.tempFilePaths
        //上传图片
        that.uploadImageCover()
      }
    })
  },
  //上传封面图片到云存储
  uploadImageCover(){
    var that = this;
    for(let l in this.data.tempImgList){
      wx.cloud.uploadFile({
        cloudPath:`goodImage/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[l],
        success(res){
          console.log(res.fileID)
          that.data.cloudCoverImage.push(res.fileID)
          that.setData({
            cloudCoverImage:that.data.cloudCoverImage
          })
        }
      })
    }
  },
  //删除封面图片
  deleteCoverImage(event){
    console.log(event.currentTarget.dataset.index)
    this.data.cloudCoverImage.splice(event.currentTarget.dataset.index,1)
    this.setData({
      cloudCoverImage:this.data.cloudCoverImage
    })
  },
})