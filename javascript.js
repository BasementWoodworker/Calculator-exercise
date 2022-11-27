function add(...args) {
    return args.reduce((sum,arg) => sum+Number(arg),0);
}

function substract(num1, num2) {
    return num1-num2;
}

function multiply(...args) {
    return args.reduce((result,arg) => result*arg,1)
}

function divide(divident,divisor) {
    let result = divisor == 0 ? "Error" : (divident/divisor);
    if (result !== "Error") {
        result = +result.toFixed(5);                            //the '+' removes extra zeroes from the number
    }                       
    return result;
}

function operate(operator, num1, num2) {
    const result = operator === "+" ? add(num1,num2) :
                   operator === "-" ? substract(num1,num2) :
                   operator === "*" ? multiply(num1,num2) :
                   operator === "/" ? divide(num1,num2) :
                   "Error";
    return result.toString();
}



function modifyDisplay(button) {
    let buttonValue = button.srcElement.textContent;
    const lastCharacter = displayValue[displayValue.length-1];
    const stringLength = displayValue.length;

    if (displayValue === "Error" || displayValue === "0") {
        clear();
    }
    
    if (buttonValue === "C") {
        clear();
        return;
    }
    if (buttonValue === "←") {
        displayValue === "Error" ? clear() : backspace(lastCharacter);
        return;
    } 
    if (stringLength === 16) {                                            //prevent from executing anything below it when the display is full
        if (buttonValue === "=") {
            getResult();
            return;
        } else {
            return;
        }
    }

    if (operators.includes(buttonValue)) {
        if (displayValue === "") {                                        //forbid to enter operators in empty string    
            return;
        } else if (currentOperator!=="none") {
            if (operators.includes(lastCharacter)) {                      //replace operator with another if it's the last character
                displayValue = displayValue.slice(0,stringLength-1);
                currentOperator = buttonValue;
            } else {
                getResult();
                currentOperator = buttonValue;
            }
        } else {
                currentOperator = buttonValue;
               }
    }


    if (operators.includes(buttonValue)) {                                
        dotAllowed = true;
    }

    if (buttonValue === "." && !dotAllowed) {
        return;
    } else if (buttonValue === "." && dotAllowed) {
        dotAllowed = false;
        if (operators.includes(lastCharacter) || lastCharacter === undefined) {
            buttonValue = "0".concat(buttonValue);
        }
    }


    if (buttonValue === "=") {
        getResult();
        return;
    }

    if (displayValue !== "Error") {                                     //prevent from outputting things like "Error+"
        displayValue += buttonValue;
        display.textContent = displayValue;
    }
}



function getResult() {
    const array = displayValue.split(currentOperator);
    if (array.includes("") || array.includes(".") || currentOperator === "none") {
        return;
    }
    const result = operate(currentOperator,array[0],array[1]);
    displayValue = result;
    display.textContent = result;
    currentOperator = "none";
    result.includes(".") ? dotAllowed = false : dotAllowed = true;
}

function backspace (lastCharacter) {
    if (operators.includes(lastCharacter)) {                 //forget the current operator if it's being removed
        currentOperator = "none";
        dotAllowed = false;
    }
    if (lastCharacter === ".") {
        dotAllowed = true;
    }
    displayValue = displayValue.slice(0,displayValue.length-1);
    display.textContent = displayValue;
}

function clear() {
    displayValue = "";
    display.textContent = "";
    currentOperator = "none";
    dotAllowed = true;
}


const operators = ["+","-","*","/"];
let currentOperator = "none";
let dotAllowed = true;

const display = document.querySelector("#display");
let displayValue = "";

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click",modifyDisplay))