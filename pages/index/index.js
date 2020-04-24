const db = wx.cloud.database({});

Page({
  data:{
    manufacturer_list: [],
    searchHistory: [],
    showHistory: false
  },
  clearSearchHistory: function(){
    wx.removeStorage({
      key: 'searchHistory',
      success (res) {
      console.log(res)
      }
      })
    //wx.removeStorageSync('searchHistory');
    this.setData({
      searchHistory: [],
      showHistory: false,
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
  handleTap: function (e) {
    var manufacturer_list = this.data.manufacturer_list;
    var manufacturer = manufacturer_list[parseInt(e.currentTarget.id)].manufacturer;
    this.setSearchHistory(manufacturer);
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
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
    db.collection('manufacturer')
    .where({deleted_at: ""})
    .count({
      success: function(res){
        var number = res.total;
        that.getList(number);
      }
    })
  },
  onShow:function(){
    this.loadSearchHistory();
  },
  onReady:function(){
  },
  onHide:function(){
  },
})