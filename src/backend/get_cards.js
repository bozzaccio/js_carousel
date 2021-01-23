/**
 * Generate a fake array of cards.
 * @async
 * @return {Promise<Card>} after 1.5 second
 */
async function getCards() {

    const cardListLength = Math.floor(Math.random() * 5) + 1;
    const cardList = [];
    const cardTypes = ['video', 'elearning', 'learning_plan', 'playlist'];

    for (let i = 0; i < cardListLength; i++) {
        cardList.push({
            imgUrl: 'http://placeimg.com/200/100',
            type: cardTypes[Math.round(Math.random() * 3)],
            isCollection: Math.random() < 0.5,
            language: Math.random() < 0.5 ? 'English' : null,
            title: 'Card carousel title',
            time_hrs : Math.round(Math.random()*12),
            time_min : Math.round(Math.random()*60)
        });
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cardList);
        }, 1500);
    });
}
