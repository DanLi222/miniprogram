var utils = require('../../utils/search.js')
var cloud = require('../../utils/cloud.js')

Page({
  data:{
    imageIndex: 0,
    manufacturer_list: [],
    searchHistory: utils.getSearchHistory(),
    swiperImage: [
      {key: 'auto1'},
      {key: 'auto2'},
      {key: 'auto3'}
    ],
  },
  setSearchHistory: function(){
    this.setData({
      searchHistory: utils.getSearchHistory()
    })
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
    this.navigateToBrand(this.data.manufacturer_list[parseInt(e.currentTarget.id)].key);
  },
  navigateToBrand: function(manufacturer){
    utils.setSearchHistory(manufacturer);
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },
  getList: async function(){
    var condition = ""
    var list = await cloud.getList('manufacturer', condition);
    this.setManufacturerList(list);
    cloud.getImage(list, 'brand', this.setManufacturerList);
  },
  setManufacturerList: function(list){
    this.setData({
      manufacturer_list: list
    })
  },
  setSwiperImage: function(list){
    this.setData({
      swiperImage: list
    })
  },
  getSwiperImage: function(){
    cloud.getImage(this.data.swiperImage, 'carousel', this.setSwiperImage)
  },
  onLoad:function(){
    this.getSwiperImage();
    this.getList();
    this.setSearchHistory();
  },
  onShow:function(){
    this.setSearchHistory();
  }
})