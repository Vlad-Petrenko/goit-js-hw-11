const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class GetPhotos {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPhoto() {
    const URL = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: '27112752-ba9c06a82163f4d21667ea4bf',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: `${this.page}`,
      },
    };

    try {
      const { data } = await axios.get(URL, options);
      this.incrementPage();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return data.hits;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
