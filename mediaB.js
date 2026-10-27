
$(function () {
  fetch('media.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load media.json: ${response.status}`);
      }
      return response.json();
    })
    .then(items => {
      const container = $('.media-container');
      container.empty();

      items.forEach(item => {
        const mediaContainer = $('<div>', { class: 'col' });

        const mediaBox = $('<a>', {
          class: 'media-box rounded justify-content-center p-3',
          href: item.url,
          target: '_blank',
          rel: 'noopener noreferrer'
        });

        mediaBox.append($('<h6>', {
          class: 'media-source',
          text: item.source
        }));

        mediaBox.append($('<h3>', {
          class: 'media-title',
          text: item.title
        }));

        mediaBox.append($('<p>', {
          class: 'media-desc',
          text: item.description
        }));

        if (item.image) {
          mediaBox.append($('<img>', {
            class: 'media-img',
            src: item.image,
            loading: 'lazy',
            alt: ''
          }));
        }

        mediaContainer.append(mediaBox);
        container.append(mediaContainer);
      });
    })
    .catch(error => {
      console.error('Failed to load media:', error);
    });
});
