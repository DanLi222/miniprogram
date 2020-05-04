/**
 * This page displays models for one brand
 * It requires 1 helper class
 */
var cloud = require('../../utils/cloud.js')

Page({
  /**
   * Page data
   * manufacturer stores brand name
   * modelList stores a model list related to the brand
   */
  data: {
    manufacturer: "",
    pingying: "",
    modelList: [],
  },
  /**
   * Set page data manufacturer according to current event
   * Load model list
   * @param {event} options - Navigate event parameter
   */
  onLoad: function(options){
    this.setManufacturer(options.manufacturer);
    this.setData({
      pingying: options.pingying
    });
    this.loadModelList();
  },

  /**
   * Download list from database
   * Set page data modelList and load model images
   */
  loadModelList: async function(){
    var condition = ""
    var list = await cloud.getList(this.data.pingying, condition)
    this.setModelList(list)
    this.loadImage(list)
  },

  /**
   * Load model images according to model list
   * @param {array} list - Model list downloaded from database
   */
  loadImage:function(list){
    var folder = 'model/' + this.data.manufacturer
    cloud.getImage(list, folder, this.setModelList)
  },

  /**
   * Set page data manufacturer
   * @param {String} brand - Current brand name
   */
  setManufacturer: function(brand){
    this.setData({
      manufacturer: brand
    })
  },

  /**
   * Set page data modelList
   * @param {array} list - Model list downloaded from database
   */
  setModelList: function(list){
    this.setData({
      modelList: list,
    })
  }
})