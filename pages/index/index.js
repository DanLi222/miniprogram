const db = wx.cloud.database({});
Page({
  data:{
    manufacturer_list: [],
    imagePath:""
  },
  handleTap: function (e) {
    var manufacturer_list = this.data.manufacturer_list;
    var manufacturer = manufacturer_list[parseInt(e.currentTarget.id)].manufacturer;
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },
  showPicture: function(list){
    console.log(list)
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
    // db.collection('manufacturer').orderBy('pingying', 'asc').get({
    //   success: res => {
    //     this.setData({
    //       manufacturer_list: res.data
    //     })
    //     this.showPicture(this.data.manufacturer_list);
    //   }
    // });
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

  },
  onReady:function(){

  }
})