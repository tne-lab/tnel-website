const GSheetReader = require('g-sheets-api');
var $ = require('jquery');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1-UpIbHLNgREmZ81KxJUwHI41kfCqvXbYErtXsW1adx8',
  sheetName: 'Sheet1'
}

GSheetReader(
  options,
  results => {
    results.forEach((item, i) => {
      let accordionContainer = $('<div>', {
          class: 'accordion-item'
      })
      let jobContainer = $('<h2>', {
          class: 'accordion-header',
          id: 'open_heading_' + i
      })
      let jobButton = $('<button>', {
          class: 'accordion-button collapsed',
          type: 'button',
          "data-bs-toggle": 'collapse',
          "data-bs-target": '#open_collapse_' + i,
          "aria-expanded": 'false',
          "aria-controls": 'open_collapse_' + i
      })
      jobButton.append($('<strong>', {
          html: item['Title']
      }))
      jobContainer.append(jobButton)
      let jobCollapse = $('<div>', {
          class: 'accordion-collapse collapse',
          "aria-labelledby": 'open_heading_' + i,
          "data-bs-parent": '#openings-accordion',
          id: 'open_collapse_' + i
      })
      jobCollapse.append($('<a>', {
          style: 'color: red; text-decoration: underline',
          class: 'accordion-body',
          href: 'https://hr.myu.umn.edu/jobs/ext/' + item['ID'],
          html: 'University of Minnesota Job ' + item['ID']
      }))
      jobCollapse.append($('<div>', {
          class: 'accordion-body',
          html: item['Description']
      }))
      accordionContainer.append(jobContainer)
      accordionContainer.append(jobCollapse)
      $("#openings-accordion").append(accordionContainer)
    });
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });
