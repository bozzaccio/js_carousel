/************************************************
 *
 * GLOBAL VARIABLES
 *
 ************************************************/

const _INITIAL_CHUNK_SIZE = 6;
const _INITIAL_PAGE_NUMBER = 0;

let _element = undefined;
let _title = undefined;
let _subtitle = undefined;
let _getCards = undefined;
let _pageNumber = undefined;
let _nextButton = undefined;
let _previousButton = undefined;

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
    _getCards = options.fetchCards;
}

function _initCarouselTemplate() {
    _element.classList.add('carousel-container');
    _setCarouselHeader();
    _setCarouselBody();
}

function _initCarouselActionButton() {

    const nextIcon = document.createElement('i');
    nextIcon.className = 'material-icons';
    nextIcon.append('arrow_forward_ios')

    _nextButton = document.createElement('div');
    _nextButton.classList.add('carousel-body__action-button', 'carousel-body__next-page');
    _nextButton.appendChild(nextIcon);

    const previousIcon = document.createElement('i');
    previousIcon.className = 'material-icons';
    previousIcon.append('arrow_back_ios')

    _previousButton = document.createElement('div');
    _previousButton.classList.add('carousel-body__action-button', 'carousel-body__previous-page');
    _previousButton.appendChild(previousIcon);
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

    _getCards(_INITIAL_CHUNK_SIZE).then((response) => {
        _loadCardIntoCarousel(body, response);
    });

    _initCarouselActionButton();
    body.append(_previousButton);
    body.append(_nextButton);

    _element.appendChild(body)
}

function _loadCardIntoCarousel(carouselElement, cardsArray) {
    cardsArray.forEach(card => carouselElement.appendChild(_getCardElement(card)));
}

function _getCardElement(cardProperties) {

    const card = document.createElement('div');
    card.classList.add('card');

    card.appendChild(_getCardHeader(cardProperties));
    card.appendChild(_getCardBody(cardProperties));

    return card;
}

function _getCardHeader(cardProperties) {

    if (!cardProperties && !cardProperties.language) {
        _logError(1);
        return;
    }

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardHeaderImg = document.createElement('img');
    cardHeaderImg.src = "http://placeimg.com/300/200";

    cardHeader.appendChild(cardHeaderImg);

    if (!cardProperties && !cardProperties.type) {
        _logError(2);
    } else {

        const type = document.createElement('span');
        type.classList.add('card-header__type');
        type.append(cardProperties.type);
        cardHeader.append(type);
    }

    if (cardProperties && cardProperties.duration) {

        const hours = Math.floor(cardProperties.duration / 3600);
        const minutes = Math.ceil(cardProperties.duration / 60) % 60;

        const time = document.createElement('span');
        time.classList.add('card-header__time');

        if (hours !== 0) {
            time.append(`${hours}h ${minutes}m`);
        } else {
            time.append(`${minutes}:00`);
        }

        cardHeader.append(time);
    }

    return cardHeader
}

function _getCardBody(cardProperties) {

    if (!cardProperties && !cardProperties.language) {
        _logError(1);
        return;
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('span');
    title.classList.add('card-body__title');
    title.append(cardProperties.title);
    cardBody.appendChild(title);

    if (cardProperties && cardProperties.language) {
        const language = document.createElement('span');
        language.classList.add('card-body__language');
        language.append(cardProperties.language);
        cardBody.appendChild(language);
    }

    return cardBody;
}

function _logError(errorCode) {

    switch (errorCode) {
        case 1:
            console.error("Error: Card properties cannot be null!");
            break;
        case 2:
            console.warn("Warning: Card type should have a value");
            break;
        default:
            break;
    }
}
