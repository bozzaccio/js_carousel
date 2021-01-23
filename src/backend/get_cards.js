/**
 * Generate a fake array of cards.
 * @async
 * @return {Promise<Card>} after 1 second
 */
async function getCards(chunkSize) {

    const cardListLength = chunkSize ? chunkSize : Math.floor(Math.random() * 5) + 1;
    const cardList = [];
    const cardTypes = ['video', 'elearning', 'learning_plan', 'playlist'];

    for (let i = 0; i < cardListLength; i++) {
        cardList.push({
            image: 'http://placeimg.com/200/100',
            type: cardTypes[Math.round(Math.random() * 3)],
            duration: 1800 + Math.round(Math.random() * 10800),
            title: 'Card carousel title',
            cardinality: Math.random() >= 0.5 ? 'single' : 'collection',
            language: Math.random() < 0.5 ? 'English' : null,
        });
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cardList);
        }, 1000);
    });
}
