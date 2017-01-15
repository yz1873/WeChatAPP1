// require中只能使用相对路径，不能使用绝对路径
var postData = require('../../data/post_data.js')

Page({
  data: {
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      posts_key: postData.postlist
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },

  onPostTap: function (event) {
    // event.currentTarget.dataset为固定写法，currentTarget当前点击目标，postId会小写为postid
    var postId = event.currentTarget.dataset.postid;
    // console.log("当前id"+postId);
    wx.navigateTo({
      url: "post_detail/post_detail?id=" + postId
    })
  },
  // onSwiperItemTap: function (event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: "post_detail/post_detail?id=" + postId
  //   })
  // },
  onSwiperTap: function (event) {
    // target和currentTarget的区别，target指的是当前点击的组件，currentTarge指的是时间捕获的组件
    // target这里指的是image，currentTarget指的是catchtap="onSwiperTap"所在组件swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post_detail/post_detail?id=" + postId
    })
  }
})