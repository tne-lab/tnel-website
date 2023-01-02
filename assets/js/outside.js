var $ = require('jquery');

$.getJSON("https://www.googleapis.com/drive/v3/files?q='1EP0dhEEFRg1VuUOjm7ZrVXh1lYnrBf0k'+in+parents&key=AIzaSyATTIeoF9LgTRoRH-1gGX2ZAluEghspiqM", function(data) {
    data.files.forEach(result => {
      let outsideContainer = $('<div>',{
        class: 'col-4 outside-img-cont'
      })
      outsideContainer.append($('<img>', {
          class: 'outside-img',
          src: 'https://drive.google.com/uc?export=view&id='+result.id,
          loading: "lazy"
      }))
      outsideContainer.append($('<h1>', {
        html: result.name.substring(0,result.name.indexOf('.'))
      }))
      $('.outside-container').append(outsideContainer)
    })
});
