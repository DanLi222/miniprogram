var cloud = require('../../utils/cloud.js')

const db = wx.cloud.database({});
const _ = db.command;

Page({
  data: {
    manufacturer:"",
    models_list: [],
  },
  setManufacturer: function(name){
    this.setData({
      manufacturer: name
    })
  },
  setModelsList: function(list){
    console.log(list)
    this.setData({
      models_list: list,
    })
  },
  showPicture:function(list){
     var folder = 'model/' + this.data.manufacturer
     cloud.getImage(list, folder, this.setModelsList)
  },
  getList: async function(){
    var condition = this.data.manufacturer
    var list = await cloud.getList('model', condition)
    this.setModelsList(list)
    this.showPicture(list)
  },
  onLoad: function(options){
    this.setManufacturer(options.manufacturer);
    this.getList();
  }
})