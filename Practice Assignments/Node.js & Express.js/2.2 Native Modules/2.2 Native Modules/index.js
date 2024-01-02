const fs = require('node:fs');

// fs.writeFile('message.txt', "First time using a native node module which is file system", (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//   }); 

  //the data param is the contents of the file that is being read
fs.readFile('./message.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
