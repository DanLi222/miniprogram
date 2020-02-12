const db = wx.cloud.database({});
Page({
  data:{
    manufacturer_list: [],
    imagePath:""
  },

  handleTap: function (e) {
    var manufacturer_list = this.data.manufacturer_list;
    var manufacturer = manufacturer_list[parseInt(e.target.dataset.id)].manufacturer;
    wx.navigateTo({
      url: '../brand/brand?manufacturer=' + manufacturer,
    })
  },

  onLoad:function(){
      db.collection('manufacturer').get({
      success: res => {
        this.setData({
          manufacturer_list: res.data
        })
      }
    });
    wx.cloud.downloadFile({
      fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/model/一汽/baidu.jpg',
      success: res =>{
        this.setData({
          imagePath: res.tempFilePath 
        }) 
      },
    })

  },
  onShow:function(){

  },
  onReady:function(){

  }
})