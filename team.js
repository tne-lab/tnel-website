const GSheetReader = require('g-sheets-api');
var $ = require('jquery');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '1k1l7Hylaalj7bmG6dJoaVTB6eDadShdlRSaMkrdT6qI',
  sheetName: 'Form Responses 1'
}

const roles = ['Prinicipal Investigator', 'Staff Scientist', 'Post-Doctoral Researcher', 'Clinical Research Coordinator', 'Graduate Student', 'Laboratory Technician', 'Undergraduate Student']

function comparePeople(a, b) {
  if (roles.indexOf(a['Job Title (Select closest fit)']) < roles.indexOf(b['Job Title (Select closest fit)'])) {
    return -1
  }
  if (roles.indexOf(a['Job Title (Select closest fit)']) > roles.indexOf(b['Job Title (Select closest fit)'])) {
    return 1
  }
  return a['Name (First Last) '].localeCompare(b['Name (First Last) '])
}

GSheetReader(
  options,
  results => {
    let members = results.filter(function(t) { return t['We need a way to differentiate whether someone is a current lab member or alumni, so please select "Current Member" below'] == 'Current Member'})
    let alumni = results.filter(function(t) { return t['We need a way to differentiate whether someone is a current lab member or alumni, so please select "Current Member" below'] != 'Current Member'})
    members.sort(comparePeople)
    members.forEach(result => {
      let memberContainer = $('<div>', {
          class: 'row mb-3',
      })
      let leftContainer = $('<div>', {
          class: 'team-left col-12 col-md-6 text-center container justify-content-center align-items-center'
      })
      leftContainer.append($('<img>', {
          src: 'https://drive.google.com/uc?export=view&'+result['Share a photo of yourself for the website'].substring(result['Share a photo of yourself for the website'].indexOf('id='))
      }))
      leftContainer.append($('<h2>', {
          class: 'mt-3',
          html: result['Name (First Last) ']
      }))
      leftContainer.append($('<h6>', {
          html: result['Job Title (Select closest fit)'] + " (" + result.Pronouns + ")"
      }))
      leftContainer.append($('<h6>', {
          html: result['Major/Education (Can include schools, degrees, graduation year, etc.)'].replace('\n','<br>')
      }))
      memberContainer.append(leftContainer)
      let rightContainer = $('<div>', {
          class: 'team-right col-12 col-md-6 d-flex flex-column justify-content-center align-items-center'
      })
      rightContainer.append($('<p>', {
          html: result['Tell us a little about yourself. What are you generally interested in either in research or in life? Why did you choose to work in the TNE lab?']
      }))
      rightContainer.append($('<h6>', {
          html: "You can find me working on"
      }))
      let workContainer = $('<div>', {
          class: 'container-md align-items-center justify-content-center'
      })
      let workRow = $('<div>', {
          class: 'row justify-content-center'
      })
      result['Research Areas'].split(", ").forEach(area => {
        workRow.append($('<h6>', {
            class: "col-4 d-flex justify-content-center align-items-center team-work text-center",
            html: area
        }))
      });
      workContainer.append(workRow)
      rightContainer.append(workContainer)
      rightContainer.append($('<h6>', {
          html: "Stats about me"
      }))
      let statsContainer = $('<div>', {
          class: 'container-md align-items-center justify-content-center'
      })
      let statsRow1 = $('<div>', {
          class: 'row align-items-center'
      })
      statsRow1.append($('<h6>', {
          class: 'col-4',
          html: result['Write 1st stat about yourself']
      }))
      let statsCircles1 = $('<div>', {
          class: 'col-4 d-flex'
      })
      for (let i=1; i<=result['Rank 1st stat from 1-5']; i++) {
        statsCircles1.append($('<div>', {
            class: 'filled-stat'
        }))
      }
      for (let i=1; i<=5-result['Rank 1st stat from 1-5']; i++) {
        statsCircles1.append($('<div>', {
            class: 'unfilled-stat'
        }))
      }
      statsRow1.append(statsCircles1)
      statsContainer.append(statsRow1)
      let statsRow2 = $('<div>', {
          class: 'row align-items-center  mt-2'
      })
      statsRow2.append($('<h6>', {
          class: 'col-4',
          html: result['Write 2nd stat about yourself']
      }))
      let statsCircles2 = $('<div>', {
          class: 'col-4 d-flex'
      })
      for (let i=1; i<=result['Rank 2nd stat from 1-5']; i++) {
        statsCircles2.append($('<div>', {
            class: 'filled-stat'
        }))
      }
      for (let i=1; i<=5-result['Rank 2nd stat from 1-5']; i++) {
        statsCircles2.append($('<div>', {
            class: 'unfilled-stat'
        }))
      }
      statsRow2.append(statsCircles2)
      statsContainer.append(statsRow2)
      let statsRow3 = $('<div>', {
          class: 'row align-items-center mt-2'
      })
      statsRow3.append($('<h6>', {
          class: 'col-4',
          html: result['Write 3rd stat about yourself']
      }))
      let statsCircles3 = $('<div>', {
          class: 'col-4 d-flex'
      })
      for (let i=1; i<=result['Rank 3rd stat from 1-5']; i++) {
        statsCircles3.append($('<div>', {
            class: 'filled-stat'
        }))
      }
      for (let i=1; i<=5-result['Rank 3rd stat from 1-5']; i++) {
        statsCircles3.append($('<div>', {
            class: 'unfilled-stat'
        }))
      }
      statsRow3.append(statsCircles3)
      statsContainer.append(statsRow3)
      rightContainer.append(statsContainer)
      memberContainer.append(leftContainer)
      memberContainer.append(rightContainer)
      //$("#team-container").parent().css('display','initial')
      $("#team-container").append(memberContainer)
    })

    let alumniNames = ""
    let alumniDetails = ""
    console.log(alumni)
    alumni.forEach(result => {
      alumniNames += result['Name (First Last) '] + "<br>"
      let details = result.hasOwnProperty('Degree awarded') ? result['Degree awarded'] + " " : ""
      details += result.hasOwnProperty('New position') ? "(" + result['New position'] + ")" : ""
      alumniDetails += details + "<br>"
    })
    $("#alumni-names").html(alumniNames)
    $("#alumni-details").html(alumniDetails)
  },
  error => {
    console.log(error)
    // OPTIONAL: handle errors here
  });
