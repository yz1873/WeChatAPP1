var postsData = require('../../../data/post_data.js')
var app = getApp(); //拿到全局变量
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        // 等同于this.data.currentPostId = postId; 暂时放入this.data中，以便postID供onLoad以外的函数使用
        this.setData({
            currentPostId: postId,
        });
        var postData = postsData.postlist[postId];
        this.setData({
            postData: postData,
        });
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == postId) {
            this.setData({
                isPlayingMusic: true,
            });
            // this.data.isPlayingMusic = true;
        }
        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(
            function () {
                that.setData({
                    isPlayingMusic: true
                })
                app.globalData.g_isPlayingMusic = true;
                app.globalData.g_currentMusicPostId = that.data.currentPostId;
            }
        )
        wx.onBackgroundAudioPause(
            function () {
                that.setData({
                    isPlayingMusic: false
                })
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_currentMusicPostId = null;
            }
        )
        wx.onBackgroundAudioStop(
            function () {
                that.setData({
                    isPlayingMusic: false
                })
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_currentMusicPostId = null;
            }
        )
    },

    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected)
    },

    showToast: function (postsCollected, postCollected) {
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 500,
            icon: "success"
        })
    },

    showModal: function (postsCollected, postCollected) {
        // this指代的是函数调用的上下文环境，而success函数中的this是没有showToast和setData的方法的的，故要用that替换
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "是否收藏该文章？" : "是否取消收藏？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    that.setData({
                        collected: postCollected
                    });
                }
            }
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel  用户是不是点击了取消
                // res.tapIndex 用户点击的按钮，从上到下的顺序，从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            //this.setData通知ui层改变属性值，直接赋值不能通知UI层
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postsData.postlist[currentPostId].music.url,
                title: postsData.postlist[currentPostId].music.title,
                coverImgUrl: postsData.postlist[currentPostId].music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})