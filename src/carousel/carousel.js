/************************************************
 *
 * GLOBAL VARIABLES
 *
 ************************************************/

const _INITIAL_CHUNK_SIZE = 6;
const _INITIAL_PAGE_NUMBER = 0;
const _carousel_array = []

let _getCardsFunction = undefined;

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
    _getCardsFunction = options.fetchCards;

    const htmlEl = document.getElementsByTagName('div');

    for (let i = 0; i < htmlEl.length; i++) {
        htmlEl[i].innerHTML = "";
    }

    if (!_carousel_array.some(carousel => carousel._elementId === options.container)) {
        _carousel_array.push(new CarouselClass(options));
    }

    _initTemplate();
}


function CarouselClass(options) {

    this._title = options.title;
    this._subtitle = options.subtitle;
    this._element = document.getElementById(options.container);
    this._elementId = options.container;
    this._carouselBody = undefined;
    this._getCards = undefined;
    this._nextButton = undefined;
    this._previousButton = undefined;
    this._totalCards = [];
    this._pageNumber = 0;
    this._numberOfPages = 0;
    this._isLoading = false;


}

/************************************************
 *
 * PRIVATE FUNCTIONS
 *
 ************************************************/

function _initTemplate() {
    _carousel_array.forEach(carousel => {
        _initCarouselTemplate(carousel);
    });
}

function _initCarouselTemplate(carousel) {
    carousel._element.classList.add('carousel-container');
    _setCarouselHeader(carousel);
    _setCarouselBody(carousel);
    _initCarouselActionButton(carousel);
}

function _initCarouselActionButton(carousel) {

    const nextIcon = document.createElement('i');
    nextIcon.className = 'material-icons';
    nextIcon.append('arrow_forward_ios')

    carousel._nextButton = document.createElement('div');
    carousel._nextButton.classList.add('carousel-body__action-button', 'carousel-body__next-page');
    carousel._nextButton.appendChild(nextIcon);
    carousel._nextButton.addEventListener('click', ev => _onNextClick(carousel));

    const previousIcon = document.createElement('i');
    previousIcon.className = 'material-icons';
    previousIcon.append('arrow_back_ios')

    carousel._previousButton = document.createElement('div');
    carousel._previousButton.classList.add('carousel-body__action-button', 'carousel-body__previous-page');
    carousel._previousButton.appendChild(previousIcon);
    carousel._previousButton.addEventListener('click', ev => _onPreviousClick(carousel));

    carousel._carouselBody.append(carousel._previousButton);
    carousel._carouselBody.append(carousel._nextButton);

    carousel._element.addEventListener("mouseover", function () {
        _onCarouselBodyOver(carousel, 'over');
    });
    carousel._element.addEventListener("mouseout", function () {
        _onCarouselBodyOver(carousel, 'out');
    });
}


/************************************************
 * ELEMENT SETTER
 ************************************************/

/**
 *
 * @private
 */
function _setCarouselHeader(carousel) {

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
    title.append(carousel._title);

    const rightTitleArrow = document.createElement('i');
    rightTitleArrow.className = 'material-icons';
    rightTitleArrow.append('keyboard_arrow_right');

    title.append(rightTitleArrow);
    header.append(title);

    const subtitle = document.createElement('span');
    subtitle.className = 'carousel-header__subtitle-container';
    subtitle.append(carousel._subtitle);
    header.append(subtitle);

    carousel._element.appendChild(header)
}

function _setCarouselBody(carousel) {
    const body = document.createElement('div');
    body.classList.add('carousel-body');
    carousel._carouselBody = body;

    _onLoadCarouselElements(carousel, _INITIAL_CHUNK_SIZE);
    carousel._element.appendChild(body)
}

function _setDisplayCards(carousel, skeletonCards) {

    carousel._carouselBody.querySelectorAll('.card').forEach(n => n.remove());
    carousel._carouselBody.querySelectorAll('.card-skeleton').forEach(n => n.remove());
    let totalCards = [];

    if (skeletonCards) {
        totalCards = [...skeletonCards];
    } else {
        totalCards = [...carousel._totalCards];
    }

    const displayCards = totalCards.splice(carousel._pageNumber * _INITIAL_CHUNK_SIZE, _INITIAL_CHUNK_SIZE);
    displayCards.forEach(card => {
        carousel._carouselBody.appendChild(card);
    });
}

function _loadCardIntoCarousel(carousel, cardsArray) {

    cardsArray.forEach(card => {
        const cardElement = _getCardElement(card);
        carousel._totalCards.push(cardElement);
    });
    _setDisplayCards(carousel);
}

function _fillCarouselWithSkeleton(carousel) {

    const skeletonArray = new Array(_INITIAL_CHUNK_SIZE).fill('').map(_ => _getSkeletonCard());

    _setDisplayCards(carousel, skeletonArray);
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
    if (cardProperties.cardinality === 'collection') {
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

function _onCarouselBodyOver(carousel, event) {

    if (event === 'over') {

        if (carousel._carouselBody.getElementsByClassName('card').length === _INITIAL_CHUNK_SIZE) {
            carousel._nextButton.style.visibility = 'visible';
        } else {
            carousel._nextButton.style.visibility = 'hidden';
        }

        if (carousel._pageNumber > 0 && carousel._pageNumber !== _INITIAL_PAGE_NUMBER) {
            carousel._previousButton.style.visibility = 'visible';
        } else {
            carousel._previousButton.style.visibility = 'hidden';
        }
    } else {
        carousel._nextButton.style.visibility = 'hidden';
        carousel._previousButton.style.visibility = 'hidden';
    }
}

function _onNextClick(carousel) {

    carousel._nextButton.style.visibility = 'hidden';
    if (carousel._pageNumber === carousel._numberOfPages) {
        _onLoadCarouselElements(carousel, null);
    } else {
        carousel._pageNumber = carousel._pageNumber + 1;
        _setDisplayCards(carousel);
    }

}

function _onPreviousClick(carousel) {

    carousel._previousButton.style.visibility = 'hidden';
    carousel._pageNumber = carousel._pageNumber - 1;
    _setDisplayCards(carousel);
}

function _onLoadCarouselElements(carousel, chunks) {
    _setIsLoading(carousel, true);
    if (chunks) {
        _getCardsFunction(chunks).then((response) => {
            _loadCardIntoCarousel(carousel, response);
            _setIsLoading(false);
        }).catch(_ => {
            _logError(3);
            _setIsLoading(false);
        });
    } else {
        _getCardsFunction(null).then((response) => {
            carousel._numberOfPages = carousel._numberOfPages + 1;
            carousel._pageNumber = carousel._pageNumber + 1;
            _loadCardIntoCarousel(carousel, response);
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

function _setIsLoading(carousel, isLoading) {

    if (isLoading) {
        _fillCarouselWithSkeleton(carousel);
    }

    carousel._isLoading = isLoading;
}
