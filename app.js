// JavaScript source code
/*
 */

var diceController = (function () {

    var data = {
        total: 0,
        dice: []
    };

    var Dice = function (id) {
        this.id = id;
        this.value = 1;
        this.image = 'dice-1.png';
    };

    Dice.prototype.roll = function () {

        this.value = Math.floor(Math.random() * 6) + 1;
        this.image = 'dice-' + this.value + '.png';

    };

    //Public Methods
    return {

        addDie: function () {
            var id, newDie;

            if (data.dice.length > 0) {
                id = data.dice[data.dice.length - 1].id + 1;

            } else { id = 0; }

            newDie = new Dice(id);

            data.dice.push(newDie);

            return newDie;

        },

        deleteDie: function (id) {
            var IDs, index;

            IDs = data.dice.map(function (current) {
                
                return current.id;
                
            });

            index = IDs.indexOf(id);

            if (index !== -1) {
                data.dice.splice(index, 1);
            }

        },

        rollDice: function () {
            

            data.total = 0;

            data.dice.forEach(function (current) {

                current.roll();
                data.total += current.value;

            });

            return data.dice;

        },

        getTotal: function () {
            return data.total;
        }


    };

})();

var UIController = (function () {

    var DOMstrings = {
        addDie: '.btn-add',
        rollDice: '.btn-roll',
        clearBoard: '.btn-clear',
        rollBox: '.roll-box',
        dice: '.dice',
        currentScore: '.roll-current-score',
        deleteDie: '.btn-die-delete',
        diceImage:'.dice-img'

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        };
    };

    //Public Methods
    return {

        getDOMstrings: function () {
            return DOMstrings;
        },

        addDie: function (newDie) {

            var html, newHtml, element;

            element = DOMstrings.rollBox;

            html = '<div class="dice" id="%id%"><img src="%src%" class="dice-img"><div class="item__delete"><button class="btn-die-delete"><i class="ion-ios-close-outline"></i></button></div></div>';            

            newHtml = html.replace('%id%', newDie.id);
            
            newHtml = newHtml.replace('%src%', newDie.image);


            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        removeDie: function (ID) {

            var element = document.getElementById(ID);
            element.parentNode.removeChild(element);


        },

        updateDice: function (diceRolled, total) {

            var fields;

            fields = document.querySelectorAll(DOMstrings.dice);

            nodeListForEach(fields, function (current, index) {               
                current.firstChild.src = diceRolled[index].image;

            });

            document.querySelector(DOMstrings.currentScore).textContent = total;

        }





    };

})();

var controller = (function (diceCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        //Add die click
        document.querySelector(DOM.addDie).addEventListener('click', ctrlAddDie);

        //Roll dice click
        document.querySelector(DOM.rollDice).addEventListener('click', ctrlRollDice);

        //Clear board click
        document.querySelector(DOM.clearBoard).addEventListener('click', ctrlClearBoard);

        //Remove die click
        document.querySelector(DOM.rollBox).addEventListener('click', ctrlDeleteDie);
    };

    var ctrlAddDie = function () {
        var newDie;

        newDie = diceCtrl.addDie();
        UICtrl.addDie(newDie);

    };

    var ctrlDeleteDie = function (event) {
        var dieID;

        dieID = parseInt(event.target.parentNode.parentNode.parentNode.id);     

        diceCtrl.deleteDie(dieID);
        UICtrl.removeDie(dieID);

    };

    var ctrlRollDice = function () {
        var diceRolled, total;

        diceRolled = diceCtrl.rollDice();

        total = diceCtrl.getTotal();

        UICtrl.updateDice(diceRolled, total);

    };

    var ctrlClearBoard = function () {

    };

    return {

        ctrlInit: function () {
            setupEventListeners();
        }

    };

})(diceController, UIController);

controller.ctrlInit();