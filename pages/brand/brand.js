const db = wx.cloud.database({});
const _ = db.command;

Page({
  data: {
    manufacturer:"",
    models_list: [],
  },

  showPicture:function(list){
    list.forEach(model => {
      wx.cloud.downloadFile({
        fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/model/' 
               + model.manufacturer 
               +'/'
               + model.model + '.jpg',
        success: res =>{
          model.imagePath = res.tempFilePath;
          this.setData({
            models_list: list,
          })
        }
      });
    })
  },

  onLoad: function(options){
    this.setData({
      manufacturer: options.manufacturer
    })

    db.collection('model').where({
      manufacturer: _.eq(this.data.manufacturer)
    }).get({
      success: res => {
        this.setData({
          models_list: res.data,
        })
        this.showPicture(this.data.models_list);
      }
    })
  },

  onReady: function(){
    
  }
  
})