/**
 * This is a helper class with 3 methods
 * It helps set search history, get history, and clean history
 */

const SEARCH = {searchHistory:[]};

/**
 * Clears cache memory
 * Set class variable searchHistory to empty
 */
function clearSearchHistory(){
  wx.removeStorage({//clear search history list in cache
    key: 'searchHistory',
  })
  SEARCH.searchHistory = [];//set search history list to empty
  return SEARCH.searchHistory;
}

/**
 * Add recently viewed brand to search history list
 * If brand name already exists, delete the record from list
 * If length of list is larger than 3, delete the last record from list
 * @param {String} history - Brand name passed by current event
 */
function setSearchHistory(history){
  var historyList = SEARCH.searchHistory;
  var manufacturerList = [];
  historyList.forEach(element => {
    manufacturerList = manufacturerList.concat(element.key)
  });
  var exist = manufacturerList.indexOf(history.key);
  if(exist != -1){// Check if brand name already exists
    historyList.splice(exist, 1);
  }
  if(historyList.length>3){
      historyList.pop();
  }
  historyList.unshift(history);// Add brand name to the beginning of search list
  SEARCH.searchHistory = historyList;
  wx.setStorageSync('searchHistory', SEARCH.searchHistory);// Update search history list in cache
}

/**
 * Get search history list from cache
 */
function getSearchHistory(callback){
  wx.getStorage({// Get search history list from cache
    key: 'searchHistory',
    success: function(res){// If succeed, call back to set search history list
      SEARCH.searchHistory = res.data; 
      callback(res.data)
    }
  });
}

module.exports.clearSearchHistory = clearSearchHistory
module.exports.setSearchHistory = setSearchHistory
module.exports.getSearchHistory = getSearchHistory
