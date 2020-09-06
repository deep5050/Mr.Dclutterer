const FileTypes = require('./file-types.json')
const fs = require('fs')
const path = require('path')

// path__ = '/home/deep/Documents/'
// files = fs.readdirSync(path__)
// files.forEach(element => {
//     if(fs.lstatSync(path.join(path__,element)).isFile())
//     {

//         console.log(element);
//     }
// });


console.log(path.basename('/home/deep/Documents/TEXT/seminar.md'))


// if (FileTypes['mpeg'])
// {
//     console.log(FileTypes['mpeg']);
// }

// const path = require('path');

// console.log(path.extname('/home/deep/Documents/Alumnus/codes/kmodules/helloworld/helloworld.c'))