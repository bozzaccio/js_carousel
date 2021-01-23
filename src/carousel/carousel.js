/************************************************
 *
 * GLOBAL VARIABLES
 *
 ************************************************/

let _element = undefined;
let _title = undefined;
let _subtitle = undefined;
let _getCards = undefined;

/************************************************
 *
 * PUBLIC FUNCTIONS
 *
 ************************************************/

/**
 *
 * @param options
 * @constructor
 */
function Carousel(options) {
    _setCarouselLocalElement(options);
    _initCarouselTemplate();
}

/************************************************
 *
 * PRIVATE FUNCTIONS
 *
 ************************************************/

/**
 *
 * @param options
 * @private
 */
function _setCarouselLocalElement(options) {
    _title = options.title;
    _subtitle = options.subtitle;
    _element = document.getElementById(options.container);
    _getCards = options.fetchCards();
}

function _initCarouselTemplate() {
    _element.classList.add('carousel-container');
    _setCarouselHeader();
    _setCarouselBody();
}

/**
 *
 * @private
 */
function _setCarouselHeader() {

    const header = document.createElement('div');
    header.classList.add('carousel-header');

    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.append('view_carousel');

    const iconContainer = document.createElement('span');
    iconContainer.className = 'carousel-header__icon-container';
    iconContainer.append(icon);

    header.append(iconContainer);

    const title = document.createElement('span');
    title.className = 'carousel-header__title-container';
    title.append(_title);

    const rightTitleArrow = document.createElement('i');
    rightTitleArrow.className = 'material-icons';
    rightTitleArrow.append('keyboard_arrow_right');

    title.append(rightTitleArrow);
    header.append(title);

    const subtitle = document.createElement('span');
    subtitle.className = 'carousel-header__subtitle-container';
    subtitle.append(_subtitle);
    header.append(subtitle);

    _element.appendChild(header)
}

function _setCarouselBody() {
    const body = document.createElement('div');
    body.classList.add('carousel-body');

    body.appendChild(_getCardElement())

    _element.appendChild(body)

}

function _getCardElement() {

    const card = document.createElement('div');
    card.classList.add('card');

    card.appendChild(_getCardHeader());
    card.appendChild(_getCardBody());

    return card;
}

function _getCardHeader() {

    const type2 = 'ELEARNING';
    const time2 = '1:12'

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardHeaderImg = document.createElement('img');
    cardHeaderImg.src = "http://placeimg.com/300/200";

    cardHeader.appendChild(cardHeaderImg);

    const type = document.createElement('span');
    type.classList.add('card-header__type');
    type.append(type2);
    cardHeader.append(type);

    const time = document.createElement('span');
    time.classList.add('card-header__time');
    time.append(time2);
    cardHeader.append(time);

    return cardHeader
}

function _getCardBody() {

    const title2 = 'Card carousel title';
    const language2 = 'English';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('span');
    title.classList.add('card-body__title');
    title.append(title2);
    cardBody.appendChild(title);

    if (language2) {
        const language = document.createElement('span');
        language.classList.add('card-body__language');
        language.append(language2);
        cardBody.appendChild(language);
    }

    return cardBody;
}
