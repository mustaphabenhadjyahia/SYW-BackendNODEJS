// Image Classification with MobileNet
// A Beginner's Guide to Machine Learning with ml5.js
// The Coding Train / Daniel Shiffman
// https://youtu.be/yNkAuWz5lnY
// https://thecodingtrain.com/learning/ml5/1.1-image-classification.html
// https://editor.p5js.org/codingtrain/sketches/qFZF7iDe
var express = require('express');

let mobilenet;
let puffin;

function modelReady() {
  console.log('Model is ready!!!');
  mobilenet.predict('https://assets.teenvogue.com/photos/56c3af2487cb21687f1b6dc6/master/w_1018,h_1385,c_limit/68500017_large.jpg', gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    return results;
   
  }
}



function setup() {
 

 
  mobilenet = ml5.imageClassifier('MobileNet', modelReady);
}

exports.setup = setup;