const GSheetReader = require('g-sheets-api');
var $ = require('jquery');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1ILJmz046S83Gr08u_et3V25aHp4-f4WkchbN3oa50WQ',
  sheetName: 'Form Responses 1'
}

textFit($("#title-title"))
textFit($("#title-subtitle"))

GSheetReader(
  options,
  results => {
    $('.pub-square-image').each(function(i, obj) {
      $(this).css('background-image','url(https://drive.google.com/uc?export=view&'+results[i]['Figure'].substring(results[0]['Figure'].indexOf('id='))+')');
        $(this).children().eq(0).text(results[i].Title)
        textFit($(this).children()[0])
    });
    //$('#title').text(results[0].Title)
    //$('#authors').html(results[0].Authors.replace(new RegExp(String.fromCharCode(8224),"g"),'<sup>'+String.fromCharCode(8224)+'</sup>'))
    //$('.pub-tile').css('background-image','url(https://drive.google.com/uc?export=view&'+results[0]['Header Figure'].substring(results[0]['Header Figure'].indexOf('id='))+')');
    //$('#abstract').text(results[0].Abstract)
    //$('#pub_dwnld').attr('href', 'https://drive.google.com/uc?export=download&'+results[0]['Publication'].substring(results[0]['Publication'].indexOf('id=')))
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });
