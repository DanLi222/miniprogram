/**
 * This page has 3 sections
 * The 1st section is a swiper view with 3 images
 * The 2nd section is a search history block, displaying 4 recently viewed history
 * The 3rd section is a list of brand with images
 */

var search = require('../../utils/search.js')
var cloud = require('../../utils/cloud.js')

Page({
  data:{
    /**
     * manufacturerList stores information about brand
     * searchHistory stores recently viewed brand
     * swiperImage stores information of 3 images
     */
    manufacturerList: [],
    searchHistory: [],
    swiperImage: [
      {key: 'auto1'},
      {key: 'auto2'},
      {key: 'auto3'}
    ],
    interval: 2000,
  },

  /**
   * Load 3 swiper images
   * Load brand list with images
   * Load searchHistory
   */
  onLoad: function(){
    this.getSwiperImage();
    this.getManufacturerList();
    this.loadSearchHistory();
  },
  /** 
   * Load searchHistory when redirecting to this page
   */
  onShow: function(){
    this.loadSearchHistory();
  },

  /**
   * Navigate to corresponding brand page
   * @param {event} e - The current event
   */
  handleTap: function(e) {
    var manufacturer = e.currentTarget.dataset.manufacturer;
    var pingying = manufacturer.pingying;
    search.setSearchHistory(manufacturer);
    wx.navigateTo({
      //url: `../brand/brand?manufacturer=${manufacturer}`,
      url: `../brand/brand?manufacturer=${manufacturer.key}&pingying=${pingying}`,
    })  
  },
  
  /**
   * Load swiper images from database
   */
  getSwiperImage: function(){
    cloud.getImage(this.data.swiperImage, 'swiper', this.setSwiperImage)
  },
  /**
   * Update page data swiperImage
   * Add impagePath to list
   * @param {array} list - List downloaded from database
   */
  setSwiperImage: function(list){
    this.setData({
      swiperImage: list
    })
  },

  /**
   * Get search history from storage and set page data searchHistory
   */
  loadSearchHistory: function(){
    search.getSearchHistory(this.setSearchHistory)
  },
  /**
   * Clean page data searchHistory to empty
   */
  clearSearchHistory: function(){
    this.setData({
      searchHistory: search.clearSearchHistory()
    })
  },
  /**
   * Set page data searchHistoty
   * @param {array} list - The list downloaded from storage
   */
  setSearchHistory: function(list){
    this.setData({
      searchHistory: list
    })
  },

  /**
   * Load brand list from database and download images
   */
  getManufacturerList: async function(){
    var condition = ""
    var list = await cloud.getList('manufacturer', condition);
    this.setManufacturerList(list);
    this.loadManufacturerImage(list);
    cloud.getImage(list, 'brand', this.setManufacturerList);
  },
  /**
   * Set page data manufacturerList
   * @param {array} list - Brand list downloaded from database 
   */
  setManufacturerList: function(list){
    this.setData({
      manufacturerList: list
    })
  },
  /**
   * Add imagePath 
   * @param {array} list - An array of objects whose imagePath needs to be updated
   */
  loadManufacturerImage: function(list){
    list.forEach(item => {
      item.imagePath = `../../images/brand/${item.key}.png`;
      this.setManufacturerList(list);
    });
  },

})