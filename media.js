const GSheetReader = require('g-sheets-api');
var $ = require('jquery');
const ogs = require('open-graph-scraper-lite');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '14t8BJBUmkVv43BU71uP733i907PxTvkLShvSIbfrARU',
  sheetName: 'Sheet1'
}

GSheetReader(
  options,
  results => {
    results.forEach((item, i) => {
      $.ajax({ url: 'https://corsproxy.io/?' + encodeURIComponent(item['URL']), success: function(data) {
        const options = {
          html: data
        };
        ogs(options)
          .then((data) => {
            const { result } = data;
            let mediaContainer = $('<div>',{
              class: 'col'
            })
            let mediaBox = $('<a>',{
              class: 'media-box rounded justify-content-center p-3',
              href: item['URL']
            })
            mediaBox.append($('<h6>', {
                class: 'media-source',
                html: result['ogSiteName']
            }))
            mediaBox.append($('<h3>', {
                class: 'media-title',
                html: result['ogTitle']
            }))
            mediaBox.append($('<p>', {
                class: 'media-desc',
                html: result['ogDescription']
            }))
            mediaBox.append($('<img>', {
                class: 'media-img',
                src: result['ogImage'][0]['url'],
                loading: 'lazy'
            }))
            mediaContainer.append(mediaBox)
            if (item['Pinned'] == 'y') {
              $('.media-container').prepend(mediaContainer)
            } else {
              $('.media-container').append(mediaContainer)
            }
        })
      } });
    });
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
});
