import GAME from "./globals";
import CONSTRAINTS from "../logic/enums/constraints";
import MODES from "../logic/enums/game-modes";

export default class Logic {

    constructor() {
        this.player = null;
        this.dice = null;
        this.settings = null;
        this.gameMode = MODES.PUZZLE;
        this.reset();
    }

    reset() {
        this.goalReached = false;
        this.numbersCollected = new Set();
        this.goalNumbers = new Set();

        if (this.settings !== null) {
            this.settings.startNumbers.forEach(n => {
                this.numbersCollected.add(n);
            });
            this.settings.goalNumbers.forEach(n => {
                this.goalNumbers.add(n);
            });
            this.constraints = this.gameMode === MODES.PUZZLE ? this.settings.constraints : [];
        }
    }

    init(settings, player) {
        this.settings = settings;
        this.reset();
        this.setPlayer(player);
    }

    setPlayer(player) {
        this.player = player;
        this.dice = player.getComponent("Dice");
        this.numbersCollected.forEach(n=> this.dice.addNumberOnly(n));
        this.dice.updateTextures();
    }

    getPlayer() {
        return this.player;
    }

    setGoalReached(value) {
        this.goalReached = value;
        if (value && !this.isOver()) {
            GAME.audio().playEffect("FAIL");
            console.log("still missing numbers");
        }
    }

    canAddNumber(number) {
        if (this.constraints.includes(CONSTRAINTS.LIKE_REAL_DICE)) {
            if (this.dice.moreThanOneBottomOption()) {
                return this.dice.canAddNumber(number, true) &&
                    this.dice.getBottomOptions().includes(number);
            }
            return this.dice.canAddNumber(number, true);
        }
        return true;
    }

    addNumber(number) {
        if (this.canAddNumber(number)) {
            return this.addNumberDirect(number);
        }
        return false;
    }

    removeNumber() {
        const number = this.dice.removeNumber();
        if (number !== null) {
            console.log("removed number", number)
            this.numbersCollected.delete(number);
        }
    }

    addNumberDirect(number) {
        this.numbersCollected.add(number);
        switch (this.gameMode) {
            case MODES.RELAX:
                this.dice.addNumberWithoutPos(number);
                break;
            case MODES.PUZZLE:
                this.dice.addNumber(number);
                break;
        }
        GAME.audio().playEffect("COLLECT");
        return true;
    }

    hasAllNumbers() {
        for (const n of this.goalNumbers) {
            if (!this.numbersCollected.has(n)) {
                return false;
            }
        }
        return true;
    }

    getGameMode() {
        return this.gameMode;
    }

    setGameMode(mode) {
        switch(mode) {
            case MODES.RELAX:
                this.removeConstraint(CONSTRAINTS.LIKE_REAL_DICE);
                break;
            case MODES.PUZZLE:
                this.addConstraint(CONSTRAINTS.LIKE_REAL_DICE);
                break;
        }
        this.gameMode = mode;
    }

    toggleGameMode() {
        switch(this.gameMode) {
            case MODES.RELAX:
                this.setGameMode(MODES.PUZZLE);
                break;
            case MODES.PUZZLE:
                this.setGameMode(MODES.RELAX);
                break;
        }
    }

    addConstraint(constraint) {
        if (!this.constraints.includes(constraint)) {
            this.constraints.push(constraint);
        }
    }

    removeConstraint(constraint) {
        if (constraint === undefined) {
            this.constraints = [];
        } else {
            this.constraints = this.constraints.filter(c => c !== constraint);
        }
    }

    testConstraint(constraint) {
        switch(constraint) {
            default: return true;
        }
    }

    testAllConstraints() {
        return this.constraints.every(c => this.testConstraint(c));
    }

    isOver() {
        return this.goalReached && this.hasAllNumbers() && this.testAllConstraints();
    }
}