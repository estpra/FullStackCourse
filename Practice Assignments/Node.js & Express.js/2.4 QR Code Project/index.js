/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import qr from "qr-image"
import inquirer from "inquirer"
import * as fs from 'node:fs';

const questions = [{
    type: 'input',
    name: 'url',
    message: "Enter the URL of the website that you want a QR code for: "
}]

inquirer.prompt(questions).then((answers) => {
    //this version fixes issue where we had to have a previous existing file to create the qr code image
    //Note that I got the code to be able to actually use the QR code generator code from the npm website 
    let qr_png = qr.image(answers.url, { type: 'png' });
    qr_png.pipe(fs.createWriteStream("QR Img.png"));
    console.log("File was created!")

    // console.log(JSON.stringify(answers.url, null, '  '));
    // console.log(answers.url)
    // this code works too!
    // let qr_png = qr.imageSync(answers.url, { type: 'png' })
    // fs.writeFile("QR Img.png", qr_png, (err) => {
    //     if (err) throw err;
    //     console.log('The "data to append" was appended to file!');
    // })
});