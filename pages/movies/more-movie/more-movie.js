// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    totalCount: 0,
    requestUrl: "",
    movies: {},
    navigateTitle: "",
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category,
    });
    switch (category) {
      case "正在上映": var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映": var dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣TOP250": var dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        covergeUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      });
    }
    this.setData({
      movies: totalMovies,
      totalCount: this.data.totalCount + 20,
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function (event) {
    //对于此类设置，只能在onready中设置
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    });
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;//名称会自动全部转为小写
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }
})