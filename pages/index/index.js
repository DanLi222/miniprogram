const db = wx.cloud.database({});
const swiperInit = ["auto1","auto2","auto3"];

Page({
  data:{
    manufacturer_list: [],
    searchHistory: [],
    swiperImage: [],
  },
  clearSearchHistory: function(){
    wx.removeStorage({
      key: 'searchHistory'
      })
    this.setData({
      searchHistory: [],
    })
  },
  loadSearchHistory: function(){
    this.getSearchHistory();
  },
  setSearchHistory: function(history){
    var historyList = this.data.searchHistory;
    var exist = historyList.indexOf(history);
    if(exist != -1){
      historyList.splice(exist, 1);
    }
    if(historyList.length>3){
        historyList.pop();
    }
    historyList.unshift(history);
      this.setData({
        searchHistory: historyList
      });
    wx.setStorageSync('searchHistory', this.data.searchHistory);
  },
  getSearchHistory: function(){
    var that = this;
    wx.getStorage({
      key: 'searchHistory',
      success: function(res){
          that.setData({
            searchHistory: res.data
          })  
      }
    })
  },
  searchTap: function(e) {
    var manufacturer = this.data.searchHistory[e.currentTarget.id];
    this.navigateToBrand(manufacturer);
  },
  brandListTap: function(e) {
    var manufacturer_list = this.data.manufacturer_list;
    var manufacturer = manufacturer_list[parseInt(e.currentTarget.id)].manufacturer;
    this.navigateToBrand(manufacturer);
  },
  navigateToBrand: function(manufacturer){
    this.setSearchHistory(manufacturer);
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
    this.loadSearchHistory();
  },
  onReady:function(){
  },
  onHide:function(){
  },
})