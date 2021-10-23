const numberButtons = document.querySelectorAll('[data-number]')
const operationsButtons = document.querySelectorAll('[data-operator]')
const oneOperandButtons = document.querySelectorAll('[data-one-operand-operator]')
const clearButton = document.querySelector('[data-clear]')
const allClearButton = document.querySelector('[data-all-clear]')
const resultButton = document.querySelector('[data-result]')
const previousNumberDisplayElement = document.querySelector('[data-previous-number]')
const actualNumberDisplayElement = document.querySelector('[data-actual-number]')
const displayMessage = 'Enter a number first'

let oneOperandActualNumber = ''
let previousNumber = ''
let actualNumber  = ''
let operation  = undefined

///Functions

//Returns:
//true - when the actual content is not a Number type
//false - when the actual content is a Number type
const checkActual = () => {
    actualNumberDisplayElementText = actualNumberDisplayElement.innerText
    if(isNaN(actualNumberDisplayElementText) || actualNumberDisplayElementText === ''){
        return true
    }
    else{
        return false
    }
}

const clear = () => {
    if (actualNumber === '' && previousNumber !== ''){
        previousNumber = previousNumber.toString().slice(0,-1)
        actualNumber = previousNumber
        previousNumber = ''
        operation = undefined
    }
    else{
        actualNumber = actualNumber.toString().slice(0,-1)
    }
}

const allClear = () => {
    if (actualNumber !== '' || previousNumber !== ''){
        previousNumber = ''
        actualNumber = ''
        operation = undefined
    }
    else return
}

const addNumber = (number) => {
    if (number === '.' && actualNumber === ''){number = '0.'}
    if (number === '.' && isNaN(actualNumber)){number = '0.'}
    if (number === '.' && actualNumber.includes('.')) {return}
    actual = parseFloat(actualNumberDisplayElement.innerText) // ????
    if (isNaN(actual)){
        actualNumberDisplayElement.innerText = ''
        actualNumber = number.toString() }
    else{actualNumber = actualNumber.toString() + number.toString()}
}

const whatOperation = (operator,value) => {
    if (value === true){
        return
    }
    else{
        if (previousNumberDisplayElement.innerText !== ''){
            computeResult()
        }
        operation = operator
        actualNumber = actualNumber.toString() + operator.toString()
        previousNumber = actualNumber
        actualNumber = ''
    }
}

const oneOperandResult = () => {
    if (actualNumberDisplayElement.innerText === '' & previousNumberDisplayElement.innerText === '') {
        actualNumber = displayMessage
        updateDisplay()
    }
    else if (actualNumberDisplayElement.innerText !== ''){
        actualNumber = actualNumberDisplayElement.innerText
        const actual = parseFloat(actualNumber)
        if (isNaN(actual)){
            return
        }
        result = Math.sqrt(actual)
        actualNumber = result
        updateDisplay()
    }
    else return
}

const computeResult = () => {
    let result

    const previous = parseFloat(previousNumber)
    const actual = parseFloat(actualNumber)

    if (isNaN(actual) || isNaN(previous)){return}
    switch (operation) {
        case '+':
            result = previous + actual
            break
        case '-':
            result = previous - actual
            break
        case '×':
            result = previous * actual
            break;
        case '÷':
            result = previous / actual
            break
        case '%':

            result = previous % actual
            break
        case '^':
            result = Math.pow(previous,actual)
            break
        default:
            return
    }

    previousNumber = previousNumber.toString() + actualNumber.toString()
    actualNumber = result
    operation = undefined
}

const updateDisplay = () => {
    actualNumberDisplayElement.innerText = actualNumber
    previousNumberDisplayElement.innerText = previousNumber
}


///Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        addNumber(button.innerText)
        updateDisplay()
    })
})

oneOperandButtons.forEach(button => {
    button.addEventListener('click', () => {
        oneOperandResult()
    })
})

operationsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = checkActual()
        whatOperation(button.innerText,content)
        updateDisplay()
    })
})

clearButton.addEventListener('click', () => {
    clear()
    updateDisplay()
})

allClearButton.addEventListener('click', () => {
    allClear()
    updateDisplay()
})

resultButton.addEventListener('click', () => {
    computeResult()
    updateDisplay()
})