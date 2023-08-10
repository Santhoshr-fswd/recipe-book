import { View } from './views';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _errorMessage =
    'The recipe your trying to find is not found, Please try with different keyword';

  _generateMarkup() {
    return this._data.map(this._generatePreviewMarkup).join('');
  }
  _generatePreviewMarkup(res) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
    <a class="preview__link ${
      res.id === id ? 'preview__link--active' : ''
    } " href="#${res.id}">
      <figure class="preview__fig">
        <img src="${res.image}" alt="${res.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${res.title}</h4>
        <p class="preview__publisher">${res.publisher}</p>
        <div class="preview__user-generated ${res.key ? '' : 'hidden'}">
        </div>
      </div>
    </a>
  </li>`;
  }
  _generateErrorMarkup(message) {
    return `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${this._errorMessage}</p>
  </div> -->`;
  }
  addHandlerrender(handler) {
    window.addEventListener('hashchange', handler);
  }
}
export default new ResultsView();
