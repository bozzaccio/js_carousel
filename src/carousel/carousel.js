class Carousel {

    _INITIAL_CHUNK_SIZE = 6;
    _INITIAL_PAGE_NUMBER = 0;

    _getCardsFunction = undefined;
    _tmpStartSwipe = undefined;
    _tmpEndSwipe = undefined;
    _carouselBody = undefined;


    /**
     * Carousel object model.
     * @param options
     * @constructor
     * @public
     */
    constructor(options) {

        this._getCardsFunction = options.fetchCards;
        this._title = options.title;
        this._subtitle = options.subtitle;
        this._element = document.getElementById(options.container);
        this._elementId = options.container;
        this._nextButton = undefined;
        this._previousButton = undefined;
        this._totalCards = [];
        this._pageNumber = 0;
        this._numberOfPages = 0;
        this._isLoading = false;
        this._initCarouselTemplate();
    }

    /**
     * Init of the carousel.
     *
     * @private
     */
    _initCarouselTemplate() {
        this._element.classList.add('carousel-container');
        this._setCarouselHeader();
        this._setCarouselBody();
        this._initCarouselActionButton();
        this._initSwipeListener();
    }

    /**
     * Set to carousel the navigation buttons
     *
     * @private
     */
    _initCarouselActionButton() {

        const nextIcon = document.createElement('i');
        nextIcon.className = 'material-icons';
        nextIcon.append('arrow_forward_ios')

        this._nextButton = document.createElement('div');
        this._nextButton.classList.add('carousel-body__action-button', 'carousel-body__next-page');
        this._nextButton.appendChild(nextIcon);
        this._nextButton.addEventListener('click', ev => this._onNextClick());

        const previousIcon = document.createElement('i');
        previousIcon.className = 'material-icons';
        previousIcon.append('arrow_back_ios')

        this._previousButton = document.createElement('div');
        this._previousButton.classList.add('carousel-body__action-button', 'carousel-body__previous-page');
        this._previousButton.appendChild(previousIcon);
        this._previousButton.addEventListener('click', ev => this._onPreviousClick());

        this._carouselBody.append(this._previousButton);
        this._carouselBody.append(this._nextButton);

        this._element.addEventListener("mouseover", () => this._onCarouselBodyOver('over'));
        this._element.addEventListener("mouseout", () => this._onCarouselBodyOver('out'));
    }

    /**
     * Hook the swipe event to carousels.
     *
     * @private
     */
    _initSwipeListener() {

        const selector = '#'.concat(this._elementId);

        document.querySelector(selector).addEventListener('touchstart', (event) => this._onSwipeStart(event, this));
        document.querySelector(selector).addEventListener('touchend', (event) => this._onSwipeEnd(event, this));
    }

    /**
     * Set the carousel header with configuration.
     *
     * @private
     */
    _setCarouselHeader() {

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
        title.append(this._title);

        const rightTitleArrow = document.createElement('i');
        rightTitleArrow.className = 'material-icons';
        rightTitleArrow.append('keyboard_arrow_right');

        title.append(rightTitleArrow);
        header.append(title);

        const subtitle = document.createElement('span');
        subtitle.className = 'carousel-header__subtitle-container';
        subtitle.append(this._subtitle);
        header.append(subtitle);

        this._element.appendChild(header)
    }

    /**
     * Set the carousel body and initialize the loading automatism.
     *
     * @private
     */
    _setCarouselBody() {
        const body = document.createElement('div');
        body.classList.add('carousel-body');
        this._carouselBody = body;

        this._onLoadCarouselElements(this._INITIAL_CHUNK_SIZE);
        this._element.appendChild(body)
    }

    /**
     * This function before load card to view, clear all the children element.
     * Next set the card based on pageNumber.
     *
     * @param skeletonCards
     * @private
     */
    _setDisplayCards(skeletonCards) {

        this._carouselBody.querySelectorAll('.card').forEach(n => n.remove());
        this._carouselBody.querySelectorAll('.card-skeleton').forEach(n => n.remove());
        let totalCards = [];

        if (skeletonCards) {
            totalCards = [...skeletonCards];
        } else {
            totalCards = [...this._totalCards];
        }

        const displayCards = totalCards.splice(this._pageNumber * this._INITIAL_CHUNK_SIZE, this._INITIAL_CHUNK_SIZE);
        displayCards.forEach(card => {
            this._carouselBody.appendChild(card);
        });
    }

    /**
     * Load real card into carousel.
     *
     * @param cardsArray
     * @private
     */
    _loadCardIntoCarousel(cardsArray) {

        cardsArray.forEach(card => {
            const cardElement = this._getCardElement(card);
            this._totalCards.push(cardElement);
        });
        this._setDisplayCards();
    }

    /**
     * Fill the carousel with skeleton card when it is loading.
     *
     * @private
     */
    _fillCarouselWithSkeleton() {

        const skeletonArray = new Array(this._INITIAL_CHUNK_SIZE).fill('').map(_ => this._getSkeletonCard());

        this._setDisplayCards(skeletonArray);
    }

    /**
     * Get an empty card used while the carousel is loading.
     * @return {HTMLDivElement}
     * @private
     */
    _getSkeletonCard() {

        const card = document.createElement('div');
        card.classList.add('card', 'card-skeleton');

        card.appendChild(this._getCardHeader());
        card.appendChild(this._getCardBody());

        return card
    }

    /**
     * Given card properties from the backend, this method return a card html element.
     * @param cardProperties
     * @return {HTMLDivElement}
     * @private
     */
    _getCardElement(cardProperties) {

        const card = document.createElement('div');
        card.classList.add('card');
        if (cardProperties.cardinality === 'collection') {
            card.classList.add('card__cardinality');
        }

        card.appendChild(this._getCardHeader(cardProperties));
        card.appendChild(this._getCardBody(cardProperties));

        return card;
    }

    /**
     * Get the card header template.
     * @param cardProperties
     * @return {HTMLDivElement}
     * @private
     */
    _getCardHeader(cardProperties) {

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        if (cardProperties) {
            this._loadCardHeaderData(cardHeader, cardProperties)
        }

        return cardHeader
    }

    /**
     * Get the card body template.
     * @param cardProperties
     * @return {HTMLDivElement}
     * @private
     */
    _getCardBody(cardProperties) {

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('span');
        title.classList.add('card-body__title');
        cardBody.appendChild(title);

        const language = document.createElement('span');
        language.classList.add('card-body__language');
        cardBody.appendChild(language);

        if (cardProperties) {
            this._loadCardBodyData(cardBody, cardProperties);
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

    /**
     * Load the template and the header information with configuration given from the HTML template.
     * @param cardHeader
     * @param cardProperties
     * @private
     */
    _loadCardHeaderData(cardHeader, cardProperties) {

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

    /**
     * Prepare the body of carousel given the configuration data from the template.
     * @param cardBody
     * @param cardProperties
     * @private
     */
    _loadCardBodyData(cardBody, cardProperties) {

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

    /**
     * Setup left and right button behavior when mouse are over the carousel container.
     *
     * @param event
     * @private
     */
    _onCarouselBodyOver(event) {

        if (event === 'over') {

            if (this._carouselBody.getElementsByClassName('card').length === this._INITIAL_CHUNK_SIZE) {
                this._nextButton.style.visibility = 'visible';
            } else {
                this._nextButton.style.visibility = 'hidden';
            }

            if (this._pageNumber > 0 && this._pageNumber !== this._INITIAL_PAGE_NUMBER) {
                this._previousButton.style.visibility = 'visible';
            } else {
                this._previousButton.style.visibility = 'hidden';
            }
        } else {
            this._nextButton.style.visibility = 'hidden';
            this._previousButton.style.visibility = 'hidden';
        }
    }

    /**
     * Invoke when next (right) button will be clicked.
     * increases pageNumber and if the pageNumber and the numberOfPages are the same, call API for new cards.
     *
     * @private
     */
    _onNextClick() {

        this._nextButton.style.visibility = 'hidden';
        if (this._pageNumber === this._numberOfPages) {
            this._onLoadCarouselElements(null);
        } else {
            this._pageNumber = this._pageNumber + 1;
            this._setDisplayCards();
        }

    }

    /**
     * Invoke when previous (left) button will be clicked.
     * decreases pageNumber and reload carousel cards.
     *
     * @private
     */
    _onPreviousClick() {

        this._previousButton.style.visibility = 'hidden';
        this._pageNumber = this._pageNumber - 1;
        this._setDisplayCards();
    }

    /**
     * Set temporary variables after the user start swiping.
     * @param event
     * @param context
     * @private
     */
    _onSwipeStart(event, context) {

        context._tmpStartSwipe = event.touches[0].pageX;
    }

    /**
     * Navigate after finish the swipe action.
     * @param event
     * @param context
     * @private
     */
    _onSwipeEnd(event, context) {

        context._tmpEndSwipe = event.changedTouches[0].pageX;

        if (context._tmpEndSwipe < context._tmpStartSwipe) {
            if (context._carouselBody.getElementsByClassName('card').length === context._INITIAL_CHUNK_SIZE)
                context._onNextClick();
        } else {
            if (context._pageNumber > 0 && context._pageNumber !== context._INITIAL_PAGE_NUMBER)
                context._onPreviousClick()
        }
    }

    /**
     * Call API function and hook the promise for start carousel loading automatism.
     *
     * @param chunks
     * @private
     */
    _onLoadCarouselElements(chunks) {
        this._setIsLoading(true);
        if (chunks) {
            this._getCardsFunction(chunks).then((response) => {
                this._loadCardIntoCarousel(response);
                this._setIsLoading(false);
            }).catch(_ => {
                this._logError(3);
                this._setIsLoading(false);
            });
        } else {
            this._getCardsFunction(null).then((response) => {
                this._numberOfPages = this._numberOfPages + 1;
                this._pageNumber = this._pageNumber + 1;
                this._loadCardIntoCarousel(response);
                this._setIsLoading(false);
            }).catch(_ => {
                this._logError(3);
                this._setIsLoading(false);
            });
        }
    }

    /**
     * Message console logger based on errorCode.
     * @param errorCode
     * @private
     */
    _logError(errorCode) {

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

    /**
     * Set loading flag for prepare carousel with skeleton card.
     *
     * @param isLoading
     * @private
     */
    _setIsLoading(isLoading) {

        if (isLoading) {
            this._fillCarouselWithSkeleton();
        }

        this._isLoading = isLoading;
    }
}
