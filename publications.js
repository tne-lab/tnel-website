const GSheetReader = require('g-sheets-api');
var $ = require('jquery');

const options2 = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1BdDN54doJ2i_cpKOSpJSzDxvKsTL40sXJbM28tLoeEM',
  sheetName: 'Sheet1'
}

GSheetReader(
  options2,
  results => {
    results.forEach(result => {
      let container = $('.pub-row-container')
      container.append($('<div>', {
        html: result['ID'],
        class: 'col-auto pub-filter mx-1 my-1'
      }))
    })
    $('.pub-filter').click(function() {
      filter_pubs($(this))
    })
  })

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1ILJmz046S83Gr08u_et3V25aHp4-f4WkchbN3oa50WQ',
  sheetName: 'Form Responses 1'
}

const yearMap = new Map();
const pub_els = [];
let all_pubs;

function filter_pubs(el) {
  $('.pub-row-container').children('.pub-filter').each(function () {
    $(this).removeClass('pub-filter-selected')
  })
  const topic = el.html()
  el.addClass('pub-filter-selected')

  const years = new Set();
  for (let i = 0; i < pub_els.length; i++) {
    if (topic == 'All' || all_pubs[i]['Research Area Tags'].includes(topic)) {
      pub_els[i].removeClass('d-none')
      const dateParts = all_pubs[i]["Date"].split("/");
      years.add(dateParts[dateParts.length-1])
    } else {
      pub_els[i].addClass('d-none')
    }
  }
  yearMap.forEach((value, key) => {
    if (!years.has(key)) {
      value.addClass('d-none')
    } else {
      value.removeClass('d-none')
    }
  })
}

GSheetReader(
  options,
  results => {
    all_pubs = results;
    results.sort(function (a, b) {
      return new Date(b["Date"]) - new Date(a["Date"])
    })
    let num = results.length
    results.forEach(result => {
      const dateParts = result["Date"].split("/");
      if (!yearMap.has(dateParts[dateParts.length-1])) {
        const temp = $('<div>', {
            class: 'container-md'
        })
        yearMap.set(dateParts[dateParts.length-1], $('<section>', {}))
        yearMap.get(dateParts[dateParts.length-1]).append(temp);
        $('#main').append(yearMap.get(dateParts[dateParts.length-1]))
        temp.append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<div>', {
            class: 'col-7 pub-divider',
        })))
        temp.append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<h1>', {
            class: 'col pub-year',
            html: dateParts[dateParts.length-1]
        })))
        temp.append($('<div>', {
            class: 'row justify-content-center',
        }).append($('<div>', {
            class: 'col-11 pub-divider',
        })))
      }
      const pubContainer = $('<div>', {
          class: 'row justify-content-center mb-5',
      })
      pubContainer.append($('<div>', {
          class: 'col-11 pub-title',
          html: "<span style='color: #999999'>" +num + ". </span>" + result.Title
      }))
      num = num - 1
      pubContainer.append($('<div>', {
          class: 'w-100'
      }))
      pubContainer.append($('<div>', {
          class: 'col-11 pub-authors',
          html: result.Authors
      }))
      const linksRow =  $('<div>', {
          class: 'row col-11 justify-content-end mt-2'
      })
      const topicsContainer = $('<div>', {
          class: 'col-12 col-md-6 d-flex justify-content-start justify-content-md-end'
      })
      const linksContainer = $('<div>', {
          class: 'col-12 col-md-6'
      })
      linksRow.append(linksContainer)
      linksRow.append(topicsContainer)
      result['Research Area Tags'].split(',').forEach(tag => {
        if (tag.length > 0) {
          topicsContainer.append($('<div>', {
            html: tag,
            class: 'pub-filter mx-1 my-1 px-2'
          }))
        }
      })
      linksContainer.append($('<a>', {
          class: 'pub-link',
          html: 'PDF',
          href: 'https://drive.google.com/uc?export=view&'+result['Publication File (PDF)'].substring(result['Publication File (PDF)'].indexOf('id='))
      }))
      linksContainer.append($('<a>', {
          class: 'pub-link ms-3',
          html: 'Link',
          href: result['Link (DOI)']
      }))
      linksContainer.append($('<a>', {
          class: 'pub-link ms-3',
          html: 'Citation',
          href: 'https://drive.google.com/uc?export=download&'+result['Citation (BibTEX)'].substring(result['Citation (BibTEX)'].indexOf('id='))
      }))
      pubContainer.append(linksRow)
      // pubContainer.append($('<div>', {
      //     class: 'col-11 pub-divider',
      //     style: 'margin-bottom: 20px; margin-top: 10px'
      // }))
      yearMap.get(dateParts[dateParts.length-1]).children('div').eq(0).append(pubContainer)
      pub_els.push(pubContainer)
    })
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });
