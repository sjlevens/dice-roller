// JavaScript source code
/*
 */

var diceController = (function () {

    var data = {
        total: 0,
        dice: [],
        diceHeld: [0,0], //[d4,d6]
        max: 0
    };

    var Dice = function (id, type) {
        this.id = id;
        this.type = type;
        this.value = 1;
        this.image = 'dice-' + this.type + '-1.png';
        this.max = parseInt(this.type.slice(1));
        
    };

    Dice.prototype.roll = function () {

        this.value = Math.floor(Math.random() * this.max) + 1;
        this.image = 'dice-' + this.type+'-'+this.value + '.png';

    };

    //Public Methods
    return {

        addDie: function (type) {
            var id, newDie;

            if (data.dice.length > 0) {
                id = data.dice[data.dice.length - 1].id + 1;

            } else { id = 0; }

            newDie = new Dice(id, type);

            data.dice.push(newDie);
            data.total += newDie.value;
            data.max += newDie.max;

            if (type === 'd4') {
                data.diceHeld[0]++;
            } else if (type === 'd6') {
                data.diceHeld[1]++;
            }

            return newDie;

        },

        deleteDie: function (id) {
            var IDs, index;

            IDs = data.dice.map(function (current) {
                
                return current.id;
                
            });

            index = IDs.indexOf(id);

            if (index !== -1) {
                data.total -= data.dice[index].value;
                data.max -= data.dice[index].max;
                

                if (data.dice[index].type === 'd4') {
                    data.diceHeld[0]--;
                } else if (data.dice[index].type === 'd6') {
                    data.diceHeld[1]--;
                }

                data.dice.splice(index, 1);
            }

        },

        clearBoard: function () {

            data.dice = [];
            data.total = 0;
            data.diceHeld = [0, 0];
            data.max = 0;

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
        },

        getDice: function () {
            return data.dice;
        },

        getData: function () {
            return data;
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
        diceImage: '.dice-img',
        diceType: '.add__type',
        currentDice: '.roll-current-dice',
        max: '.roll-current-max'

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

        updateData: function (data) {

            //Update total roll
            document.querySelector(DOMstrings.currentScore).textContent = data.total;

            //Dice present
            document.querySelector(DOMstrings.currentDice).textContent = data.diceHeld[0]+ 'd4 + '+ data.diceHeld[1]+'d6';

            //Max
            document.querySelector(DOMstrings.max).textContent = (data.dice.length)+'-'+data.max;


        },

        updateDice: function (diceRolled) {

            var fields;

            fields = document.querySelectorAll(DOMstrings.dice);

            nodeListForEach(fields, function (current, index) {               
                current.firstChild.src = diceRolled[index].image;

            });

        },

        clearBoard: function () {

            var fields;

            fields = document.querySelectorAll(DOMstrings.dice);

            nodeListForEach(fields, function (current) {

                UIController.removeDie(current.id);

            });

        },

        getType: function () {

            return document.querySelector(DOMstrings.diceType).value;

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
        var newDie, type;

        type = UICtrl.getType();

        newDie = diceCtrl.addDie(type);
        UICtrl.addDie(newDie);
        UICtrl.updateData(diceCtrl.getData());

    };

    var ctrlDeleteDie = function (event) {
        var dieID;

        if (event.target.parentNode.parentNode.parentNode.id) {
            dieID = parseInt(event.target.parentNode.parentNode.parentNode.id);

            diceCtrl.deleteDie(dieID);
            UICtrl.removeDie(dieID);

        }
        UICtrl.updateData(diceCtrl.getData());

    };

    var ctrlRollDice = function () {
        var diceRolled, data;

        diceRolled = diceCtrl.rollDice();

        data = diceCtrl.getData();

        UICtrl.updateDice(diceRolled);
        UICtrl.updateData(data);


    };

    var ctrlClearBoard = function () {

        
        diceCtrl.clearBoard();
        UICtrl.updateData(diceCtrl.getData());
        UICtrl.clearBoard();


    };

    return {

        ctrlInit: function () {
            setupEventListeners();
            ctrlClearBoard();
        }

    };

})(diceController, UIController);

controller.ctrlInit();