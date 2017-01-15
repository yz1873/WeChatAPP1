var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchpannelShow: false,
    },
    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonurl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在上映");
        this.getMovieListData(comingSoonurl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣TOP250");
    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle)
            },
            fail: function (error) {
                console.log(error);
            },
        })
    },
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
        var readyData = {};
        readyData[settedKey] = {
            movies: movies,
            categoryTitle: categoryTitle
        };
        this.setData(readyData);
    },

    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category
        })
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPannelShow: true
        });
    },
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPannelShow: false
        });
    },
    onBindChange: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;//名称会自动全部转为小写
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId
        })
    }
})