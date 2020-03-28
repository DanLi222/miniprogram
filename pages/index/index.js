const db = wx.cloud.database({});
const fs = wx.getFileSystemManager()
const SEARCH_HISTORY = 'searchHistory';

Page({
  data:{
    manufacturer_list: [],
    imagePath:"",
    searchHistory: []
  },
  handleTap: function (e) {
    var manufacturer_list = this.data.manufacturer_list;
    var manufacturer = manufacturer_list[parseInt(e.currentTarget.id)].manufacturer;
    this.addToSearchHistory(manufacturer);
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },
  handleSearchHistoryTap: function (e) {
    console.log(e);
  },
  showPicture: function(list){
    list.forEach(brand => {
      wx.cloud.downloadFile({
        fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/brand/' 
               + brand.manufacturer + '.png',
        success: res =>{
          brand.imagePath = res.tempFilePath;
          this.setData({
            manufacturer_list: list,
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
  findOrCreateFile: function(){
    var files = fs.readdirSync(`${wx.env.USER_DATA_PATH}`)
    if(files.includes(SEARCH_HISTORY)){
      console.log("Search History File found");
    } else {
       console.log("Search History File not found, creating..");
      fs.writeFileSync(`${wx.env.USER_DATA_PATH}/` + SEARCH_HISTORY, '', 'utf8');
    }
  },
  loadSearchHistory: function(){
    var history = fs.readFileSync(`${wx.env.USER_DATA_PATH}/` + SEARCH_HISTORY, 'utf8');
    var searchHistory = history.split(',');
    searchHistory.pop();
    var length = searchHistory.length;
    searchHistory = searchHistory.slice(Math.max(0,length - 4),length);

    if(length > 4) {
      fs.writeFileSync(`${wx.env.USER_DATA_PATH}/` + SEARCH_HISTORY, searchHistory.toString()+',', 'utf8');
    }
    searchHistory = searchHistory.reverse();

    this.setData({
      searchHistory: searchHistory
    })
  },
  addToSearchHistory: function(manufacturer){
    fs.appendFileSync(`${wx.env.USER_DATA_PATH}/` + SEARCH_HISTORY, manufacturer + ',', 'utf8');
  },
  onShow:function(){
    this.findOrCreateFile();
    this.loadSearchHistory();
  },
  onReady:function(){

  }
})