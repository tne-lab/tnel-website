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
      $('<div>', {
        html: result['ID'],
        class: 'col-auto pub-project-filter mx-1 my-1'
      }).insertBefore("#filter-topic-header")
    })
    $('.pub-project-filter').click(function() {
      filter_pubs($(this), false)
    })
  })

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1ILJmz046S83Gr08u_et3V25aHp4-f4WkchbN3oa50WQ',
  sheetName: 'Form Responses 1'
}

const yearMap = new Map();
const pub_els = [];
const topics = ["Deep Brain Stimulation", "Transcranial Magnetic Stimulation", "Traumatic Brain Injury", "Phase Locked Stimulation", "Addiction", "Ethics", "Neuroimaging","Clinical Psychiatry"]
let all_pubs;
let cur_topic = 'All'
let cur_project = 'All'

topics.forEach(topic => {
  let container = $('.pub-row-container')
  container.append($('<div>', {
    html: topic,
    class: 'col-auto pub-filter mx-1 my-1'
  }))
  $('.pub-filter').click(function() {
    filter_pubs($(this), true)
  })
})

function filter_pubs(el, is_topic) {
  if (!is_topic) {
    $('.pub-row-container').children('.pub-project-filter').each(function () {
      $(this).removeClass('pub-project-filter-selected')
    })
    cur_project = el.html()
    el.addClass('pub-project-filter-selected')
  } else {
    $('.pub-row-container').children('.pub-filter').each(function () {
      $(this).removeClass('pub-filter-selected')
    })
    cur_topic = el.html()
    el.addClass('pub-filter-selected')
  }

  const years = new Set();
  for (let i = 0; i < pub_els.length; i++) {
    if ((cur_project == 'All' || (all_pubs[i].hasOwnProperty('Project Tags') && all_pubs[i]['Project Tags'].includes(cur_project))) &&
        (cur_topic == 'All' || (all_pubs[i].hasOwnProperty('Topic Tags') && all_pubs[i]['Topic Tags'].includes(cur_topic)))) {
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
      if (result.hasOwnProperty('Project Tags')) {
        result['Project Tags'].split(',').forEach(tag => {
          if (tag.length > 0) {
            topicsContainer.append($('<div>', {
              html: tag,
              class: 'pub-project-filter mx-1 my-1 px-2'
            }))
          }
        })
      }
      if (result.hasOwnProperty('Topic Tags')) {
        result['Topic Tags'].split(',').forEach(tag => {
          if (tag.length > 0) {
            topicsContainer.append($('<div>', {
              html: tag,
              class: 'pub-filter mx-1 my-1 px-2'
            }))
          }
        })
      }
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
