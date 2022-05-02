import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GetPhotos from './getPhoto';
import LoadMoreBtn from './load_btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const newGetPhoto = new GetPhotos();

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  readMoreBtn: document.querySelector('.load-more'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', loadMore);

async function onSearch(event) {
  event.preventDefault();
  newGetPhoto.query = await event.currentTarget.elements.searchQuery.value;
  loadMoreBtn.hide();
  if (newGetPhoto.query === '') {
    loadMoreBtn.hide();
    newGetPhoto.resetPage();
    clearGalleryMarkup();
    return Notify.info('Enter something, please!');
  }

  clearGalleryMarkup();
  newGetPhoto.resetPage();
  const arrayPhoto = await newGetPhoto.getPhoto();

  if (arrayPhoto.length === 0) {
    loadMoreBtn.hide();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  renderGallery(arrayPhoto);
  loadMoreBtn.show();
}

async function loadMore() {
  const arrayPhoto = await newGetPhoto.getPhoto();
  renderGallery(arrayPhoto);
  if (arrayPhoto.length === 0) {
    loadMoreBtn.hide();
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

function renderGallery(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"=/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}</p>
    <p class="info-item">
      <b>Views</b>${views}</p>
    <p class="info-item">
      <b>Comments</b>${comments}</p>
    <p class="info-item">
      <b>Downloads</b>${downloads}</p>
  </div>
</div>`,
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  fadeSpeed: 400,
});

function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}
