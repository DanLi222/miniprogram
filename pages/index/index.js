const db = wx.cloud.database({});
Page({
  data:{
    manufacturer_list: [],
    imagePath:""
  },

  handleTap: function (e) {
    var manufacturer_list = this.data.manufacturer_list;
    console.log(e.currentTarget.id);
    var manufacturer = manufacturer_list[parseInt(e.currentTarget.id)].manufacturer;
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },
  showPicture:function(list){
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
    db.collection('manufacturer').count({
      success: function(res){
        var number = res.total;
        for(var i = 0; i <= number; i = i+20){
          db.collection('manufacturer').skip(i).get({
            success: v => {
              var list = that.data.manufacturer_list;
              list = list.concat(v.data);
              that.setData({
                manufacturer_list: list
              })
              that.showPicture(that.data.manufacturer_list);
            }
          })
        }
      }
    })
      

  },
  onShow:function(){

  },
  onReady:function(){

  }
})