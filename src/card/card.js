import './card.scss';

export default class Card {


    constructor(model) {
        this.createCardElement(model);
        // if(this._validateDataModel(model)){
        //     this.createCardElement(model);
        // }
    }


    createCardElement(model){
        this._getEmptyCardTemplate();
    }

    _validateDataModel(model) {

        let isValid = false;

        for (const prop in model) {

            if (!prop) {
                isValid = false;
                break;
            } else {
                isValid = true;
            }
        }

        return isValid;
    }

    _getEmptyCardTemplate(){
        const card = document.createElement('div');
        card.className = 'card-container';
    }

}
