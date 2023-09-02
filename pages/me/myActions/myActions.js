const util = require("../../../utils/util")

const app = getApp()

Page({
  data: {
    
  },
  opendLocation(event){
    console.log(event.currentTarget.dataset.index)
    var that = this;
    wx.openLocation({
      latitude: that.data.actionsList[event.currentTarget.dataset.index].latitude,
      longitude: that.data.actionsList[event.currentTarget.dataset.index].longitude,
    })
  },
  previewImg(event){
    var that = this;
    console.log(event)
    
    wx.previewImage({
      current: event.currentTarget.dataset.src,//当前显示图片的路径
      urls: that.data.actionsList[event.currentTarget.dataset.index].images,
    })


  },
  onLoad: function (options) {
 
    this.setData({
      userOpenid: app.globalData.openid
    })


    console.log(app.globalData.userInfo)

    var that = this;
    setTimeout(function(){
      console.log(app.globalData.openid)
      that.setData({
        myOpenid: app.globalData.openid
      })
    },2000)

    this.getActionsList()


  },
  getActionsList(){
    var that = this // desc asc
    // 模糊搜索的话加上这个
    // .where({
    //   text: wx.cloud.database().RegExp({
    //     regexp: that.data.keyValue
    //   })
    // })
    wx.cloud.database().collection('shop_actions').orderBy('time','desc').where({
      _openid: this.data.userOpenid
    }).get({
      success(res){
        console.log(res)

        //格式化时间
        var list = res.data
        for(var l in list){
          list[l].time = util.formatTime(new Date(list[l].time))
        }

        for(var l in list){
          for(var j in list[l].prizeList){

            if(list[l].prizeList[j].openid == app.globalData.openid){
              list[l].isPrized = true
            }

          }
        }



          // for(var l in list){
          //   if(list[l].commentList.length != 0){

          //     for(var j in list[l].commentList){
          //       list[l].commentList[l].time = util.formatTime(new Date(list[l].commentList[l].time))
          //     }

          //   }
          // }
        

        that.setData({
          actionsList :list
        })

      }
    })
  },

  toDetail(event){

    console.log(event.currentTarget.dataset.id)

    wx.navigateTo({
      url: '/pages/shequ/detail/detail?id=' + event.currentTarget.dataset.id,
    })

  },

  deleteAction(event){

    console.log(event.currentTarget.dataset.id)

    var that = this;
    wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).remove({
      success(res){
        console.log(res)
        wx.showToast({
          title: '删除成功！',
        })
        that.getActionsList()
      }
    })

  },

  onPullDownRefresh(){

    this.getActionsList()

  },

  pirzeAction(event){
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }else {
      console.log(event.currentTarget.dataset.id)
      var that = this;
      wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).get({
        success(res){

          console.log(res)
          var action = res.data
          var tag = false
          var index 
          for(var l in action.prizeList){
            if(action.prizeList[l].openid == app.globalData.openid){
              tag = true
              index = l
              break
            }
          }
          if(tag){
            //之前点赞过 删除点赞记录
            action.prizeList.splice(index,1)
            console.log(action)
            wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){

                console.log(res)
                that.getActionsList()

              }
            })
          }else{
            //之前未点赞  添加点赞记录
            var user = {}
            user.nickName = app.globalData.userInfo.nickName
            user.faceImg = app.globalData.userInfo.avatarUrl
            user.openid = app.globalData.openid
            action.prizeList.push(user)

            console.log(action.prizeList)
            wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){
                console.log(res)
                wx.showToast({
                  title: '点赞成功！',
                })
                that.getActionsList()
              }
            })
          }

        }
      })

    }
    

    

  },
  delteComment(event){
    var that = this;
    console.log(event.currentTarget.dataset.id)
    console.log(event.currentTarget.dataset.index)

    wx.showModal({
      title:'提示',
      content:'确定要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).get({
            success(res){
              console.log(res)
              var action = res.data

              action.commentList.splice(index,1)
              wx.cloud.database().collection('shop_actions').doc(event.currentTarget.dataset.id).update({
                data: {
                  commentList: action.commentList
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  that.getActionsList()
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
    



  },

  onShareAppMessage(event){

    if(event.from == 'button'){
      console.log(event.target.dataset.index)
      var index = event.target.dataset.index

      return {
        title: this.data.actionsList[index].text,
        imageUrl: this.data.actionsList[index].images[0],
        path:'pages/shequ/detail/detail?id=' + this.data.actionsList[index]._id
      }
    }
    if(event.from == 'menu'){
      return {
        title: '欢迎进入朋友圈列表',
        imageUrl: '',
        path:'pages/index/index'
      }
    }
    

  }

})
