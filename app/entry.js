require('!style!css!./style.css');
var $ = require('jquery');
var content = require('./content.js');


$(function() {
  $('h1').html(content);
  console.log(content);
});
