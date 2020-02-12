const db = wx.cloud.database({});
const _ = db.command;

Page({
  data: {
    manufacturer:"",
    models_list: [],
    js_object: {
      name: "name",
      age: 12,
      alive: true,
    },
    imagePath:"",
    modelName:"",
    pic:""
  },

  onLoad: function(options){
    console.log(this.data.js_object.age);
    this.setData({
      manufacturer: options.manufacturer
    })

    db.collection('model').where({
      manufacturer: _.eq(this.data.manufacturer)
    }).get({
      success: res => {
        console.log(res.data)
        this.setData({
          models_list: res.data,
        })
       /* for(var i = 0; i < res.data.length; i++){
          this.setData({modelName: res.data[i].model});
          
          wx.cloud.downloadFile({
            fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/model/一汽/' + this.data.modelName + '.jpg',
            success: result =>{   
              console.log(res.data[i])         
              this.setData({imagePath : result.tempFilePath})
              console.log(res.data[i].pic)         

            },
          }) 
          res.data[i] = imagePath      
          
        }*/
       // res.data[0].pic = "pic"
        



    
    wx.cloud.downloadFile({
      fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/model/一汽/' + this.data.modelName + '.jpg',
      success: res =>{
        this.setData({
          imagePath : res.tempFilePath 
        }) 
      },
    })
    console.log("AFTER")

      }
    })
    
    
  },

  onReady: function(){
    
  }
  
})