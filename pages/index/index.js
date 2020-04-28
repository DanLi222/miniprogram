var utils = require('../../utils/search.js')
const db = wx.cloud.database({});
const swiperInit = ["auto1","auto2","auto3"];

Page({
  data:{
    manufacturer_list: [],
    searchHistory: utils.getSearchHistory(),
    swiperImage: [],
  },
  clearSearchHistory: function(){
    this.setData({
      searchHistory: utils.clearSearchHistory()
    })
  },
  searchTap: function(e) {
    this.navigateToBrand(this.data.searchHistory[e.currentTarget.id]);
  },
  brandListTap: function(e) {
    this.navigateToBrand(this.data.manufacturer_list[parseInt(e.currentTarget.id)].manufacturer);
  },
  navigateToBrand: function(manufacturer){
    utils.setSearchHistory(manufacturer);
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },
  getSwiperImage: function(imageList){
    var that = this;
    var list = [];
    imageList.forEach(image => {
      wx.cloud.downloadFile({
        fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/carousel/' 
               + image + '.jpg',
        success: res =>{
          list.push(res.tempFilePath);
          that.setData({
            swiperImage: list
          })
        }
      });
    })
  },
  showPicture: function(list){
    list.forEach(brand => {
      wx.cloud.downloadFile({
        fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/brand/' 
               + brand.manufacturer + '.png',
        success: res =>{
          brand.imagePath = res.tempFilePath;
          this.setData({
            manufacturer_list: list
          })
        }
      });
    })
  },
  getList: function(number){
    for(var i = 0; i <= number; i = i+20){
      db.collection('manufacturer')
      .where({deleted_at: ""})
      .skip(i).get({
        success: v => {
          var list = this.data.manufacturer_list;
          list = list.concat(v.data);
          list = list.sort(function(a, b){
            if(a.pingying < b.pingying) { return -1; }
            if(a.pingying > b.pingying) { return 1; }
            return 0;
          })
          this.setData({
            manufacturer_list: list
          })
          if(list.length === number){
            this.showPicture(this.data.manufacturer_list);
          }
        }
      })
    }
  },
  onLoad:function(){
    var that = this;
    this.getSwiperImage(swiperInit);
    db.collection('manufacturer')
    .where({deleted_at: ""})
    .count({
      success: function(res){
        var number = res.total;
        that.getList(number);
      }
    });
  },
  onShow:function(){
    this.setData({
      searchHistory: utils.getSearchHistory()
    })
  },
})