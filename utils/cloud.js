const db = wx.cloud.database();
const _ = db.command;

async function getList(table, condition){
  const countResult = await db.collection(table).count();
  const total = countResult.total;
  const MAX_LIMIT = 20;
  const batchTimes = Math.ceil(total/MAX_LIMIT);
  const tasks = [];
  var list = [];
  return new Promise((resolve, reject) => {
    for(let i = 0; i < batchTimes; i++){
      console.log(db.collection(table))
      const promise = db.collection(table).where({
        display: _.eq(condition)
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
      tasks.push(promise);
    }
      Promise.all(tasks).then(values => {
        values.forEach(value => {
          list = list.concat(value.data);
        });
        list.sort(function(a, b){
          return a.pingying < b.pingying ? -1 : a.pingying > b.pingying ? 1 : 0;
        });
        resolve(list);
      });  
  })
}

function getImage(list, folder, callback){
  list.forEach(item => {
    wx.cloud.downloadFile({
      fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/' + folder + '/'
            + item.key + '.png',
      success: res =>{
        item.imagePath = res.tempFilePath;
        callback(list);
      }
    })
  });
}
  
  // return new Promise((resolve,reject) => {
  //   const tasks = [];
  //   list.forEach(item => {
  //     var promise = new Promise(resolve => {
  //       wx.cloud.downloadFile({
  //       fileID: 'cloud://dan-sbsq8.6461-dan-sbsq8-1300940270/' + folder + '/'
  //              + item.key + '.png',
  //       success: res =>{
  //         item.imagePath = res.tempFilePath;
  //         callback(list);
  //         resolve();
  //       }
  //     })});
  //     tasks.push(promise);
  //   })
  //   Promise.all(tasks)
  //     .then(() => {
  //       resolve(list);
  //     }); 
  // })


module.exports.getList = getList;
module.exports.getImage = getImage;
