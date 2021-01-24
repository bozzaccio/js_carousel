/************************************************
 *
 * GLOBAL VARIABLES
 *
 ************************************************/

const _INITIAL_CHUNK_SIZE = 6;
const _INITIAL_PAGE_NUMBER = 0;

let _element = undefined;
let _carouselBody = undefined;
let _title = undefined;
let _subtitle = undefined;
let _getCards = undefined;
let _nextButton = undefined;
let _previousButton = undefined;

let _totalCards = [];
let _pageNumber = 0;
let _numberOfPages = 0;
let _isLoading = false;

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

function _initCarouselTemplate() {
    _element.classList.add('carousel-container');
    _setCarouselHeader();
    _setCarouselBody();
    _initCarouselActionButton();
}

function _initCarouselActionButton() {

    const nextIcon = document.createElement('i');
    nextIcon.className = 'material-icons';
    nextIcon.append('arrow_forward_ios')

    _nextButton = document.createElement('div');
    _nextButton.classList.add('carousel-body__action-button', 'carousel-body__next-page');
    _nextButton.appendChild(nextIcon);
    _nextButton.addEventListener('click', ev => _onNextClick());

    const previousIcon = document.createElement('i');
    previousIcon.className = 'material-icons';
    previousIcon.append('arrow_back_ios')

    _previousButton = document.createElement('div');
    _previousButton.classList.add('carousel-body__action-button', 'carousel-body__previous-page');
    _previousButton.appendChild(previousIcon);
    _previousButton.addEventListener('click', ev => _onPreviousClick());

    _carouselBody.append(_previousButton);
    _carouselBody.append(_nextButton);

    _carouselBody.addEventListener("mouseover", function () {
        _onCarouselBodyOver('over');
    });
    _carouselBody.addEventListener("mouseout", function () {
        _onCarouselBodyOver('out');
    });
}


/************************************************
 * ELEMENT SETTER
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

    _carouselBody = body;
    _onLoadCarouselElements(_INITIAL_CHUNK_SIZE);
    _element.appendChild(body)
}

function _setDisplayCards(skeletonCards) {

    _carouselBody.querySelectorAll('.card').forEach(n => n.remove());
    _carouselBody.querySelectorAll('.card-skeleton').forEach(n => n.remove());
    let totalCards = [];

    if (skeletonCards) {
        totalCards = [...skeletonCards];
    } else {
        totalCards = [..._totalCards];
    }

    const displayCards = totalCards.splice(_pageNumber * _INITIAL_CHUNK_SIZE, _INITIAL_CHUNK_SIZE);
    displayCards.forEach(card => {
        _carouselBody.appendChild(card);
    });
}

function _loadCardIntoCarousel(carouselElement, cardsArray) {

    cardsArray.forEach(card => {
        // const cardElement = _getCardElement(card);
        const cardElement = _getCardElement(card);
        _totalCards.push(cardElement);
    });
    _setDisplayCards();
}

function _fillCarouselWithSkeleton() {

    const skeletonArray = new Array(_INITIAL_CHUNK_SIZE).fill('').map(_ => _getSkeletonCard());

    _setDisplayCards(skeletonArray);
}

/************************************************
 * ELEMENT GETTER
 ************************************************/

function _getSkeletonCard() {

    const card = document.createElement('div');
    card.classList.add('card', 'card-skeleton');

    card.appendChild(_getCardHeader());
    card.appendChild(_getCardBody());

    return card
}

function _getCardElement(cardProperties) {

    const card = document.createElement('div');
    card.classList.add('card');
    if(cardProperties.cardinality === 'collection'){
        card.classList.add('card__cardinality');
    }

    card.appendChild(_getCardHeader(cardProperties));
    card.appendChild(_getCardBody(cardProperties));

    return card;
}

function _getCardHeader(cardProperties) {

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    if (cardProperties) {
        _loadCardHeaderData(cardHeader, cardProperties)
    }

    return cardHeader
}

function _getCardBody(cardProperties) {

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('span');
    title.classList.add('card-body__title');
    cardBody.appendChild(title);

    const language = document.createElement('span');
    language.classList.add('card-body__language');
    cardBody.appendChild(language);

    if (cardProperties) {
        _loadCardBodyData(cardBody, cardProperties);
    } else if (!cardProperties) {
        const cardBodyFooter = document.createElement('div');
        cardBodyFooter.classList.add('card-body__footer');
        cardBodyFooter.appendChild(document.createElement('span'));
        cardBodyFooter.appendChild(document.createElement('span'));
        cardBodyFooter.appendChild(document.createElement('span'));
        cardBody.appendChild(cardBodyFooter);
    }

    return cardBody;
}

function _loadCardHeaderData(cardHeader, cardProperties) {

    cardHeader.classList.add('card-header');

    const cardHeaderImg = document.createElement('img');
    cardHeaderImg.src = cardProperties.image;

    cardHeader.appendChild(cardHeaderImg);

    if (!cardProperties.type) {
        _logError(2);
    } else {

        const type = document.createElement('span');
        type.classList.add('card-header__type');
        type.append(cardProperties.type);
        cardHeader.append(type);
    }

    if (cardProperties.duration) {

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
}

function _loadCardBodyData(cardBody, cardProperties) {

    if (!cardProperties.title) {
        _logError(1);
        return;
    }

    const title = document.createElement('span');
    title.classList.add('card-body__title');
    title.append(cardProperties.title);
    cardBody.appendChild(title);

    if (cardProperties.language) {
        const language = document.createElement('span');
        language.classList.add('card-body__language');
        language.append(cardProperties.language);
        cardBody.appendChild(language);
    }
}

/************************************************
 * ON EVENTS CALLBACK
 ************************************************/

function _onCarouselBodyOver(event) {

    if (event === 'over') {

        if (_carouselBody.getElementsByClassName('card').length === _INITIAL_CHUNK_SIZE) {
            _nextButton.style.visibility = 'visible';
        } else {
            _nextButton.style.visibility = 'hidden';
        }

        if (_pageNumber > 0 && _pageNumber !== _INITIAL_PAGE_NUMBER) {
            _previousButton.style.visibility = 'visible';
        } else {
            _previousButton.style.visibility = 'hidden';
        }
    } else {
        _nextButton.style.visibility = 'hidden';
        _previousButton.style.visibility = 'hidden';
    }
}

function _onNextClick() {

    _nextButton.style.visibility = 'hidden';
    if (_pageNumber === _numberOfPages) {
        _onLoadCarouselElements(null);
    } else {
        _pageNumber = _pageNumber + 1;
        _setDisplayCards();
    }

}

function _onPreviousClick() {

    _previousButton.style.visibility = 'hidden';
    _pageNumber = _pageNumber - 1;
    _setDisplayCards();
}

function _onLoadCarouselElements(chunks) {
    _setIsLoading(true);
    if (chunks) {
        _getCards(chunks).then((response) => {
            _loadCardIntoCarousel(_carouselBody, response);
            _setIsLoading(false);
        }).catch(_ => {
            _logError(3);
            _setIsLoading(false);
        });
    } else {
        _getCards(null).then((response) => {
            _numberOfPages = _numberOfPages + 1;
            _pageNumber = _pageNumber + 1;
            _loadCardIntoCarousel(_carouselBody, response);
            _setIsLoading(false);
        }).catch(_ => {
            _logError(3);
            _setIsLoading(false);
        });
    }
}

/************************************************
 * UTILS
 ************************************************/

function _logError(errorCode) {

    switch (errorCode) {
        case 1:
            console.error("Error: Card properties cannot be null!");
            break;
        case 2:
            console.warn("Warning: Card type should have a value");
            break;
        case 3:
            console.error("Error: 500, Internal Server Error");
            break
        default:
            break;
    }
}

function _setIsLoading(isLoading) {

    if (isLoading) {
        _fillCarouselWithSkeleton();
    }

    _isLoading = isLoading;
}
