/**
 * This is a helper class with 2 methods
 * It helps set list of array from database, and download images from database
 */

/**
 * Variables
 * db connects to database
 * _ helps set condition when querying
 */
const db = wx.cloud.database();
const _ = db.command;

/**
 * Get list from database
 * Can get maximum 20 records per time
 * @param {String} table - Indicate the table name in the database
 * @param {*} condition - Indicate condition when querying
 * @returns {array} list - Return a list after all records are downloaded
 */
async function getList(table, condition){
  // Count number of record in database table to get batch time
  const countResult = await db.collection(table).count();
  const total = countResult.total;
  const MAX_LIMIT = 20;
  const batchTimes = Math.ceil(total/MAX_LIMIT);
  const tasks = [];
  var list = [];
  return new Promise((resolve, reject) => {
    // Download records in batches
    for(let i = 0; i < batchTimes; i++){
      const promise = db.collection(table)
                        .where({
                          display: _.eq(condition)
                        })
                        .skip(i * MAX_LIMIT)
                        .limit(MAX_LIMIT)
                        .get();
      tasks.push(promise);
    }
    // Resolve when all promises haved finished
    Promise.all(tasks).then(values => {
      values.forEach(value => {
        list = list.concat(value.data);// Store result value in list
      });
      list.sort(function(a, b){ // Sort list by pingying
        return a.pingying < b.pingying ? -1 : a.pingying > b.pingying ? 1 : 0;
      });
      resolve(list);
    });  
  })
}

/**
 * Download images from database
 * @param {array} list - The list where temporary file path will be added 
 * @param {String} folder - The folder in which the images will be loaded
 * @param {function} callback - The function which will be called back once succeeding
 */
function getImage(list, folder, callback){
  // Download image from database
  list.forEach(item => {
    wx.cloud.downloadFile({
      fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/' + folder + '/'
            + item.key + '.png',
      success: res =>{ // Once succeed, add temporary path to list
        item.imagePath = res.tempFilePath;
        callback(list);
      }
    })
  });
}

module.exports.getList = getList;
module.exports.getImage = getImage;
