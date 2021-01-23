/************************************************
 *
 * GLOBAL VARIABLES
 *
 ************************************************/

let _element = undefined;
let _title = undefined;
let _subtitle = undefined;

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
    _setCarouselElement(options);
    _element.classList.add('carousel-container');
    _setCarouselHeader();
    options.fetchCards().then(result => console.log(result));
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
function _setCarouselElement(options) {
    _title = options.title;
    _subtitle = options.subtitle;
    _element = document.getElementById(options.container);
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

