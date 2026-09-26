"use strict";
// Display contents
const infoTooltipHTML = document.querySelector("[data-info-tooltip]");
const topDisplayHTML = document.querySelector("[data-previous-number]");
const bottomDisplayHTML = document.querySelector("[data-actual-number]");
// Keyboard buttons
const allClearButton = document.querySelector("[data-all-clear]");
const clearButton = document.querySelector("[data-clear]");
const numberButtons = document.querySelectorAll("[data-number]");
const commaButton = document.querySelector("[data-comma]");
const operationsButtons = document.querySelectorAll("[data-operator]");
const oneOperandButton = document.querySelectorAll("[data-one-operand-operator]");
const resultButton = document.querySelector("[data-result]");
let topDisplay = "";
let bottomDisplay = "";
let firstOperand;
let secondOperand;
let operation = "";
let resultLength = 0;
const twoOperandsOperators = ["÷", "×", "-", "+", "%", "^"];
const updateDisplayVariables = ({ topNr, botNr, oper, }) => {
    if (topNr === "" || topNr) {
        topDisplay = topNr;
    }
    if (botNr === "" || botNr) {
        bottomDisplay = botNr;
    }
    if (oper === "" || oper) {
        operation = oper;
    }
};
const assignOperands = ({ first, second, }) => {
    if (first !== undefined) {
        firstOperand = first;
    }
    if (second !== undefined) {
        secondOperand = second;
    }
};
const showInfoMessage = (message) => {
    infoTooltipHTML.textContent = message;
    infoTooltipHTML.classList.remove("show");
    void infoTooltipHTML.offsetWidth;
    infoTooltipHTML.classList.add("show");
};
const showIncompleteEquationMessage = () => {
    infoTooltipHTML.textContent = "The equation is not complete.";
    infoTooltipHTML.classList.remove("show");
    void infoTooltipHTML.offsetWidth;
    infoTooltipHTML.classList.add("show");
};
const isOperator = (display) => {
    const operator = twoOperandsOperators.find((operator) => display.includes(operator));
    return operator ?? "";
};
// Determines behaviour of two-operands buttons
const checkOperationConditions = (button) => {
    const topContent = topDisplayHTML.textContent;
    const bottomContent = bottomDisplayHTML.textContent;
    const tempOperation = button.dataset.operator;
    if (topContent === "" && bottomContent === "") {
        return;
    }
    if (topContent !== "" && bottomContent === "") {
        const twoOperandsOperator = isOperator(topDisplay);
        if (twoOperandsOperator) {
            if (topContent.slice(-1) === twoOperandsOperator) {
                updateDisplayVariables({
                    topNr: `${topDisplay.slice(0, -1)}${tempOperation}`,
                    oper: tempOperation,
                });
                return;
            }
            else {
                performOperation();
                return;
            }
        }
        updateDisplayVariables({
            topNr: `${topDisplay}${tempOperation}`,
            oper: tempOperation,
        });
        return;
    }
    if (topContent === "" && bottomContent !== "") {
        const twoOperandsOperator = isOperator(bottomDisplay);
        if (bottomDisplay.includes("√")) {
            if (bottomContent.slice(0, 1) === "√" && bottomContent.slice(1) !== "") {
                updateDisplayVariables({
                    oper: "√",
                });
                performOperation();
                return;
            }
            else if (bottomContent.slice(0, 1) === "√" &&
                bottomContent.slice(1) === "") {
                return;
            }
        }
        if (twoOperandsOperator) {
            const [first, second] = bottomDisplay.split(twoOperandsOperator);
            if (second !== "") {
                operation = twoOperandsOperator;
                performOperation();
                return;
            }
            else {
                updateDisplayVariables({
                    botNr: `${bottomDisplay.slice(0, -1)}${tempOperation}`,
                    oper: tempOperation,
                });
                return;
            }
        }
        const tempPreviousNumber = `${bottomDisplay}${tempOperation}`;
        updateDisplayVariables({
            topNr: tempPreviousNumber,
            botNr: "",
            oper: tempOperation,
        });
        return;
    }
    if (topContent !== "" && bottomContent !== "") {
        isDotAtEnd();
        const operator = isOperator(topDisplay);
        if (topDisplay.slice(-1) === operator) {
            performOperation();
        }
        else {
            const tempPreviousNumber = `${bottomDisplay}${tempOperation}`;
            updateDisplayVariables({
                topNr: tempPreviousNumber,
                botNr: "",
                oper: tempOperation,
            });
        }
        return;
    }
};
// Checks conditions for assigning operands based on existing or non-existing operator
const checkTopDisplayContentForOperator = () => {
    const twoOperandsOperator = isOperator(topDisplay);
    if (twoOperandsOperator) {
        let [first, second] = topDisplay.split(twoOperandsOperator);
        if (second !== "") {
            if (first.slice(0, 1) === "√") {
                first = Math.sqrt(parseFloat(first.slice(1))).toString();
            }
            if (second.slice(0, 1) === "√") {
                second = Math.sqrt(parseFloat(second.slice(1))).toString();
            }
            assignOperands({ first: parseFloat(first), second: parseFloat(second) });
            operation = twoOperandsOperator;
            return true;
        }
        else {
            showIncompleteEquationMessage();
            return false;
        }
    }
    else if (topDisplay.includes("√")) {
        const tempContentAfterRoot = topDisplay.slice(1);
        if (tempContentAfterRoot === "") {
            showIncompleteEquationMessage();
            return false;
        }
        else {
            assignOperands({ second: parseFloat(tempContentAfterRoot) });
            operation = "√";
            return true;
        }
    }
    return false;
};
// Checks conditions for assigning operands based on existing or non-existing operator
const checkBottomDisplayContentForOperator = () => {
    const twoOperandsOperator = isOperator(bottomDisplay);
    if (twoOperandsOperator) {
        let [first, second] = bottomDisplay.split(twoOperandsOperator);
        if (second !== "") {
            if (first.slice(0, 1) === "√") {
                first = Math.sqrt(parseFloat(first.slice(1))).toString();
            }
            if (second.slice(0, 1) === "√") {
                second = Math.sqrt(parseFloat(second.slice(1))).toString();
            }
            assignOperands({ first: parseFloat(first), second: parseFloat(second) });
            operation = twoOperandsOperator;
            return true;
        }
        else {
            showIncompleteEquationMessage();
            return false;
        }
    }
    else if (bottomDisplay.includes("√")) {
        const tempContentAfterRoot = bottomDisplay.slice(1);
        if (tempContentAfterRoot === "") {
            showIncompleteEquationMessage();
            return false;
        }
        else {
            assignOperands({ second: parseFloat(tempContentAfterRoot) });
            operation = "√";
            return true;
        }
    }
    else {
        if (operation === "√") {
            assignOperands({ second: parseFloat(bottomDisplay) });
            return true;
        }
        else {
            showIncompleteEquationMessage();
            return false;
        }
    }
};
const checkBothDisplaysContentforOperator = () => {
    const twoOperandsOperator = isOperator(topDisplay);
    if (topDisplay.slice(-1) === twoOperandsOperator) {
        const first = topDisplay.split(twoOperandsOperator);
        if (topDisplay.includes("√") && bottomDisplay.includes("√")) {
            const tempFirstOperand = Math.sqrt(parseFloat(topDisplay.slice(1, -1)));
            if (bottomDisplay.slice(1) === "") {
                showIncompleteEquationMessage();
                return false;
            }
            else {
                const tempSecondOperand = Math.sqrt(parseFloat(bottomDisplay.slice(1)));
                assignOperands({ first: tempFirstOperand, second: tempSecondOperand });
                operation = twoOperandsOperator;
                return true;
            }
        }
        if (topDisplay.includes("√")) {
            const tempFirstOperand = Math.sqrt(parseFloat(topDisplay.slice(1, -1)));
            assignOperands({
                first: tempFirstOperand,
                second: parseFloat(bottomDisplay),
            });
            operation = twoOperandsOperator;
            return true;
        }
        if (bottomDisplay.includes("√")) {
            if (bottomDisplay.slice(1) !== "") {
                bottomDisplay = Math.sqrt(parseFloat(bottomDisplay.slice(1))).toString();
            }
            else {
                showIncompleteEquationMessage();
                return false;
            }
        }
        assignOperands({
            first: parseFloat(first[0]),
            second: parseFloat(bottomDisplay),
        });
        operation = twoOperandsOperator;
        return true;
    }
    else {
        showInfoMessage("No operation to perform.");
        return false;
    }
};
const canOperationBePerformed = () => {
    let success;
    try {
        if (topDisplay !== "" && bottomDisplay !== "") {
            success = checkBothDisplaysContentforOperator();
        }
        else if (topDisplay !== "" && bottomDisplay === "") {
            success = checkTopDisplayContentForOperator();
        }
        else if (topDisplay === "" && bottomDisplay !== "") {
            success = checkBottomDisplayContentForOperator();
        }
        else {
            showIncompleteEquationMessage();
            success = false;
        }
    }
    catch (e) {
        success = false;
        if (e instanceof Error) {
            console.log(e.message);
        }
        console.log("Something went wrong at canOperationBePerformed.");
    }
    return success;
};
const performOperation = () => {
    isDotAtEnd();
    let success;
    let result;
    success = canOperationBePerformed();
    if (success) {
        switch (operation) {
            case "+":
                result = firstOperand + secondOperand;
                break;
            case "-":
                result = firstOperand - secondOperand;
                break;
            case "×":
                result = firstOperand * secondOperand;
                break;
            case "÷":
                result = firstOperand / secondOperand;
                break;
            case "%":
                result = firstOperand % secondOperand;
                break;
            case "^":
                result = Math.pow(firstOperand, secondOperand);
                break;
            case "√":
                result = Math.sqrt(secondOperand);
                break;
            default:
                return;
        }
    }
    else {
        return;
    }
    if (result !== undefined) {
        // TODO:
        // zaokrąglić wynik do max 8 cyfr po przecinku
        // zrobić ograniczenie dla wprowadzania cyfr do 8? itd.
        // if (result.toString().length > 16) {
        //   resultLength = result.toString().length;
        //   showInfoMessage("The result is too long to display.");
        //   return;
        // }
        if (operation === "√") {
            if (topDisplay.includes("√")) {
                updateDisplayVariables({
                    topNr: `${topDisplay}`,
                    botNr: result.toString(),
                    oper: "",
                });
                return;
            }
            else if (bottomDisplay.includes("√")) {
                updateDisplayVariables({
                    topNr: bottomDisplay,
                    botNr: result.toString(),
                    oper: "",
                });
                return;
            }
            else {
                updateDisplayVariables({
                    topNr: `√${bottomDisplay}`,
                    botNr: result.toString(),
                    oper: "",
                });
                return;
            }
        }
        updateDisplayVariables({
            topNr: `${topDisplay}${bottomDisplay}`,
            botNr: result.toString(),
            oper: "",
        });
        assignOperands({ first: undefined, second: undefined });
    }
};
const updateHtmlDisplay = () => {
    bottomDisplayHTML.textContent = bottomDisplay;
    topDisplayHTML.textContent = topDisplay;
};
const addCharacterToDisplay = (char) => {
    const charactersAllowedAfterZero = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];
    if (topDisplay !== "" && bottomDisplay === "") {
        const twoOperandsOperator = isOperator(topDisplay);
        if (!twoOperandsOperator) {
            return;
        }
    }
    if (char === "00" && bottomDisplay === "") {
        bottomDisplay = "0";
    }
    else if (char === "." && bottomDisplay === "0") {
        bottomDisplay += char;
    }
    else if (bottomDisplay === "0") {
        if (charactersAllowedAfterZero.includes(char)) {
            bottomDisplay = char;
        }
    }
    else if (bottomDisplay.includes("√")) {
        if (bottomDisplay.slice(1) === "" && (char === "00" || char === "0")) {
            bottomDisplay += "0";
        }
        else if (bottomDisplay === "√0") {
            if (char === ".") {
                bottomDisplay += char;
            }
            else {
                return;
            }
        }
        else {
            bottomDisplay += char;
        }
        return;
    }
    else {
        bottomDisplay += char;
    }
};
// Determines behaviour of root button
const checkRootConditions = () => {
    if (topDisplay !== "" && bottomDisplay !== "") {
        return;
    }
    if (topDisplay !== "" && bottomDisplay === "") {
        const twoOperandsOperator = isOperator(topDisplay);
        if (!twoOperandsOperator) {
            return;
        }
    }
    if (bottomDisplay === "") {
        addCharacterToDisplay("√");
        operation = "√";
    }
    else if (bottomDisplay.includes("√")) {
        return;
    }
    else {
        operation = "√";
        performOperation();
    }
};
// Determines behaviour of comma button
const checkCommaConditions = () => {
    if (topDisplay !== "" && bottomDisplay === "") {
        const twoOperandsOperator = isOperator(topDisplay);
        if (!twoOperandsOperator) {
            return;
        }
    }
    if (bottomDisplay === "" || bottomDisplay === "√") {
        bottomDisplay = `${bottomDisplay}0.`;
    }
    else if (bottomDisplay.includes(".")) {
        return;
    }
    else {
        addCharacterToDisplay(".");
    }
};
const isDotAtEnd = () => {
    if (bottomDisplay.at(-1) === ".") {
        bottomDisplay = bottomDisplay.slice(0, -1);
    }
};
const clearLastCharacter = () => {
    // if case for negative number with one digit
    const operator = isOperator(bottomDisplay);
    if (operator === "-") {
        const [first, second] = bottomDisplay.split(operator);
        if (first === "" && second.length === 1) {
            updateDisplayVariables({
                botNr: "",
                oper: "",
            });
            return;
        }
    }
    if (bottomDisplay === "" && topDisplay !== "") {
        if (topDisplay.includes("√")) {
            updateDisplayVariables({
                topNr: "",
                botNr: topDisplay.slice(0, -1),
                oper: "√",
            });
            return;
        }
        else {
            const foundOperator = isOperator(topDisplay);
            updateDisplayVariables({
                topNr: "",
                botNr: topDisplay.slice(0, -1),
                oper: foundOperator,
            });
        }
    }
    else {
        if (bottomDisplay === "√") {
            updateDisplayVariables({
                botNr: bottomDisplay.slice(0, -1),
                oper: "",
            });
            return;
        }
        const tempCharacter = bottomDisplay.slice(-1);
        if (twoOperandsOperators.includes(tempCharacter)) {
            if (twoOperandsOperators.includes(bottomDisplay.slice(-1))) {
                updateDisplayVariables({
                    botNr: bottomDisplay.slice(0, -1),
                    oper: "",
                });
            }
        }
        else {
            bottomDisplay = bottomDisplay.slice(0, -1);
        }
    }
};
const clearAll = () => {
    if (bottomDisplay !== "" || topDisplay !== "") {
        updateDisplayVariables({
            topNr: "",
            botNr: "",
            oper: "",
        });
    }
};
// Listeners =============================================
numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        addCharacterToDisplay(button.dataset.number);
        updateHtmlDisplay();
    });
});
commaButton?.addEventListener("click", () => {
    checkCommaConditions();
    updateHtmlDisplay();
});
operationsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        checkOperationConditions(button);
        updateHtmlDisplay();
    });
});
oneOperandButton.forEach((button) => {
    button.addEventListener("click", () => {
        checkRootConditions();
        updateHtmlDisplay();
    });
});
clearButton?.addEventListener("click", () => {
    clearLastCharacter();
    updateHtmlDisplay();
});
allClearButton?.addEventListener("click", () => {
    clearAll();
    updateHtmlDisplay();
});
resultButton?.addEventListener("click", () => {
    performOperation();
    updateHtmlDisplay();
});
