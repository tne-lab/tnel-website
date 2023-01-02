const GSheetReader = require('g-sheets-api');
var $ = require('jquery');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1ILJmz046S83Gr08u_et3V25aHp4-f4WkchbN3oa50WQ',
  sheetName: 'Form Responses 1'
}

const yearMap = new Map();

GSheetReader(
  options,
  results => {
    results.forEach(result => {
      const dateParts = result["Date"].split("/");
      if (!yearMap.has(dateParts[dateParts.length-1])) {
        yearMap.set(dateParts[dateParts.length-1], $('<div>', {
            class: 'container-md',
            "data-aos": 'fade-in'
        }))
        $('#main').append($('<section>', {}).append(yearMap.get(dateParts[dateParts.length-1])))
        yearMap.get(dateParts[dateParts.length-1]).append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<div>', {
            class: 'col-7 pub-divider',
        })))
        yearMap.get(dateParts[dateParts.length-1]).append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<h2>', {
            class: 'col pub-year',
            html: dateParts[dateParts.length-1]
        })))
        yearMap.get(dateParts[dateParts.length-1]).append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<div>', {
            class: 'col-11 pub-divider',
        })))
      }
      const pubContainer = $('<div>', {
          class: 'row justify-content-center',
      })
      pubContainer.append($('<div>', {
          class: 'col-11 pub-title',
          html: result.Title
      }))
      pubContainer.append($('<div>', {
          class: 'w-100'
      }))
      pubContainer.append($('<div>', {
          class: 'col-11 pub-authors',
          html: result.Authors
      }))
      const linksRow =  $('<div>', {
          class: 'row justify-content-end'
      })
      const linksContainer = $('<div>', {
          class: 'col-11'
      })
      linksRow.append(linksContainer)
      linksContainer.append($('<a>', {
          class: 'pub-link',
          html: 'PDF',
          href: 'https://drive.google.com/uc?export=view&'+result['Publication File (PDF)'].substring(result['Publication File (PDF)'].indexOf('id='))
      }))
      linksContainer.append($('<a>', {
          class: 'pub-link',
          html: 'Link',
          href: result['Link (DOI)']
      }))
      linksContainer.append($('<a>', {
          class: 'pub-link',
          html: 'Citation',
          href: 'https://drive.google.com/uc?export=download&'+result['Citation (BibTEX)'].substring(result['Citation (BibTEX)'].indexOf('id='))
      }))
      pubContainer.append(linksRow)
      pubContainer.append($('<div>', {
          class: 'col-11 pub-divider',
          style: 'margin-bottom: 20px; margin-top: 10px'
      }))
      yearMap.get(dateParts[dateParts.length-1]).append(pubContainer)
    })
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });
