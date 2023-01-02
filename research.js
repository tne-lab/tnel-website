var $ = require('jquery');
const GSheetReader = require('g-sheets-api');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1BdDN54doJ2i_cpKOSpJSzDxvKsTL40sXJbM28tLoeEM',
  sheetName: 'Sheet1'
}

GSheetReader(
  options,
  results => {
    results.forEach(result => {
      let projectContainer = $('<div>', {
          class: 'col'
      })
      let image = 'https://drive.google.com/uc?export=view&id=' + result['Image']
      let background = $('<div>', {
          class: 'project_back project_item ratio ratio-1x1 align-items-center justify-content-center',
          style: "background: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('" + image + "'); background-position: center; background-size: cover"
      })
      background.append($('<h3>', {
        html: result['Title']
      }))
      background.append($('<i>', {
        class: 'bi bi-arrow-right-circle project_arrow arrow-bottom'
      }))
      projectContainer.append(background)
      projectContainer.click(function () {
          $('.project_info_title').html(result['Title'])
          $('#project_detail_summary').html(result['Summary'])
          $('#project_detail_technical').html(result['Technical'])
          $('#project_detail_skills').html(result['Skills'])
          $('#project_detail_image').css({"height": "100%",
            "background": "linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('" + image + "')",
            "background-position": "center",
            "background-size": "cover"})
          $('html, body').scrollTop($('#all_projects_container').position().top + $('#all_projects_container').offset().top + $('#all_projects_container').outerHeight(true) - $('header').height())
          $('.project_detail_container')
          .css('opacity', 0)
          .slideDown('slow')
          .animate(
            {opacity: 1},
            {queue: false, duration: 'slow'}
          )
      })
      $('#all_projects_container').append(projectContainer)
    })
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });

$('#project_detail_image').click(function () {
  $('.project_detail_container').slideUp('slow')
  .animate(
    {opacity: 0},
    {queue: false, duration: 'slow'}
  )
})
