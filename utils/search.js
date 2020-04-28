const SEARCH = {searchHistory:[]};

function clearSearchHistory(){
  wx.removeStorage({
    key: 'searchHistory',
  })
  SEARCH.searchHistory = [];
  return SEARCH.searchHistory;
}

function loadSearchHistory(){
  getSearchHistory();
}

function setSearchHistory(history){
  var historyList = SEARCH.searchHistory;
  var exist = historyList.indexOf(history);
  if(exist != -1){
    historyList.splice(exist, 1);
  }
  if(historyList.length>3){
      historyList.pop();
  }
  historyList.unshift(history);
  SEARCH.searchHistory = historyList;
  wx.setStorageSync('searchHistory', SEARCH.searchHistory);
}

function getSearchHistory(){
  wx.getStorage({
    key: 'searchHistory',
    success: function(res){
      SEARCH.searchHistory = res.data; 
    }
  });
  return SEARCH.searchHistory;
}

module.exports.clearSearchHistory = clearSearchHistory
module.exports.setSearchHistory = setSearchHistory
module.exports.loadSearchHistory = loadSearchHistory
module.exports.getSearchHistory = getSearchHistory
