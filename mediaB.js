
document.addEventListener('DOMContentLoaded', () => {
  fetch('media.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load media.json: ${response.status}`);
      }
      return response.json();
    })
    
.then(items => {
    const container = document.querySelector('.media-container');
  
    if (!container) {
      throw new Error('Could not find .media-container in the HTML.');
    }
  
    container.innerHTML = '';
  
    items.forEach(item => {
      const mediaContainer = document.createElement('div');
      mediaContainer.className = 'col';
  
      const mediaBox = document.createElement('a');
      mediaBox.className = 'media-box rounded justify-content-center p-3';
      mediaBox.href = item.url;
      mediaBox.target = '_blank';
      mediaBox.rel = 'noopener noreferrer';
  
      const source = document.createElement('h6');
      source.className = 'media-source';
      source.textContent = item.source || '';
  
      const title = document.createElement('h3');
      title.className = 'media-title';
      title.textContent = item.title || item.url;
  
      const description = document.createElement('p');
      description.className = 'media-desc';
      description.textContent = item.description || '';
  
      mediaBox.append(source, title, description);
  
      if (item.image) {
        const image = document.createElement('img');
        image.className = 'media-img';
        image.src = item.image;
        image.loading = 'lazy';
        image.alt = '';
        mediaBox.appendChild(image);
      }
  
      mediaContainer.appendChild(mediaBox);
      container.appendChild(mediaContainer);
    });
  })
  .catch(error => {
    console.error('Failed to load media:', error);
  });
});
