const returnPrecedence = (operator) => {
    if (operator === '(') return 5;
    else if (operator === '^') return 4;
    else if (operator === '/' || operator === '*' || operator === '%') return 3;
    else if (operator === '+' || operator === '-') return 2;
    else if (operator === ')') return 1;
    else return 0;
  };
  
  const infixToPostfix = (num) => {
    const infix = num.trim().split(' ');
    const tempPostfix = [];
    const postfix = [];
  
    for (let i = 0; i < infix.length; i++) {
      if (returnPrecedence(infix[i]) == 0) {
        postfix.push(infix[i]);
      } else {
        if (tempPostfix.length == 0) {
          tempPostfix.push(infix[i]);
        } else if (
          returnPrecedence(infix[i]) >
          returnPrecedence(tempPostfix[tempPostfix.length - 1])
        ) {
          tempPostfix.push(infix[i]);
        } else if (
          returnPrecedence(infix[i]) <=
          returnPrecedence(tempPostfix[tempPostfix.length - 1])
        ) {
          if (infix[i] == ')') {
            while (
              tempPostfix[tempPostfix.length - 1] != '(' &&
              tempPostfix.length > 0
            ) {
              postfix.push(tempPostfix.pop());
            }
            tempPostfix.pop();
          } else {
            while (
              returnPrecedence(infix[i]) <=
                returnPrecedence(tempPostfix[tempPostfix.length - 1]) &&
              tempPostfix.length > 0 &&
              tempPostfix[tempPostfix.length - 1] != '('
            ) {
              postfix.push(tempPostfix.pop());
            }
            tempPostfix.push(infix[i]);
          }
        }
      }
    }
  
    const tempPostfixLength = tempPostfix.length;
    for (let i = 0; i < tempPostfixLength; i++) {
      postfix.push(tempPostfix.pop());
    }
  
    return postfix;
  };
  
  const evaluate = (operand1, operand2, operator) => {
    if (operator === '+') {
      return parseFloat(operand1) + parseFloat(operand2);
    } else if (operator === '-') {
      return parseFloat(operand1) - parseFloat(operand2);
    } else if (operator === '/') {
      return parseFloat(operand1) / parseFloat(operand2);
    } else if (operator === '*') {
      return parseFloat(operand1) * parseFloat(operand2);
    }
  };
  
  const evaluatePostfix = (postfix) => {
    const res = [];
    if (postfix.length === 1) {
      return parseFloat(postfix[0]);
    }
    for (let i = 0; i < postfix.length; i++) {
      if (
        !(
          postfix[i] == '-' ||
          postfix[i] == '+' ||
          postfix[i] == '*' ||
          postfix[i] == '/'
        )
      ) {
        res.push(postfix[i]);
      } else {
        const operand2 = res.pop();
        const operand1 = res.pop();
        if (!operand1) {
          if (postfix[i] === '-') {
            res.push(parseFloat(operand2) * -1);
            break;
          }
          res.push(parseFloat(operand2));
          break;
        } else if (!operand2) {
          if (postfix[i] === '-') {
            res.push(parseFloat(operand1) * -1);
            break;
          }
          res.push(parseFloat(operand1));
          break;
        }
  
        if (postfix[i] === '/' && operand2 === '0') {
          return 0;
        }
        const evaluated = evaluate(operand1, operand2, postfix[i]);
        res.push(evaluated);
      }
    }
    return res.pop();
  };
  
  const formatInput = (s) => {
    let deep = 0;
    let deepDot = 0;
    let dotFlag = false;
    let dot = 0;
  
    const input = s.replace(/ +?/g, '');
    let result = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '.') {
        continue;
      }
      if (!isNaN(Number(input[i]))) {
        if (i + 1 !== input.length && input[i + 1] === '.') {
          dot = i;
          deepDot = deep;
          deep = 0;
          dotFlag = true;
          continue;
        }
  
        if (i + 1 !== input.length && !isNaN(Number(input[i + 1]))) {
          deep += 1;
          dotFlag = true;
          continue;
        }
      }
  
      if (dot !== 0 && dotFlag) {
        let sz = '';
  
        for (let q = dot - deepDot; q <= dot; q++) {
          sz += input[q];
        }
  
        sz += '.';
        for (let j = dot + 2; j < dot + 3 + deep; j++) {
          sz += input[j];
        }
  
        result.push(sz);
        deep = 0;
        dot = 0;
  
        continue;
      }
  
      if (deep !== 0) {
        let sz = '';
        for (let j = i - deep; j <= i; j++) {
          sz += input[j];
        }
        result.push(sz);
        deep = 0;
        continue;
      }
  
      dotFlag = false;
      result.push(input[i]);
    }
  
    let minusFlag = false;
  
    for (let k = 0; k < result.length; k++) {
      if (result[k] !== '-' && result[k] !== '(') {
        minusFlag = false;
      } else if (!minusFlag && result[k] === '-') {
        let operatorExistsAfterMinus = false;
        for (let v = k + 1; v < result.length; v++) {
          if (isNaN(Number(result[v]))) {
            operatorExistsAfterMinus = true;
          }
        }
  
        if (!operatorExistsAfterMinus) {
          result[k + 1] = '-' + result[k + 1];
          if (!isNaN(Number(result[k - 1]))) {
            result[k] = '+';
          } else {
            result[k] = undefined;
          }
  
          break;
        }
  
        if (
          k + 2 !== result.length &&
          !isNaN(Number(result[k + 1])) &&
          isNaN(Number(result[k + 2])) &&
          result[k + 2] !== ')'
        ) {
          result[k + 1] = '-' + result[k + 1];
          result[k] = undefined;
        }
  
        minusFlag = true;
      } else if (
        minusFlag &&
        result[k] === '-' &&
        result[k + 1] !== '(' &&
        k + 1 !== result.length
      ) {
        result[k + 1] = '-' + result[k + 1];
        result[k] = undefined;
      }
    }
  
    result = result.filter((r) => r);
  
    for (let k = 0; k < result.length; k++) {
      if (k + 1 !== result.length && result[k] === '-' && result[k + 1] === '(') {
        let closingBracketIndex = k + 2;
        let opBracketCount = 0;
        for (let z = k + 2; z < result.length; z++) {
          if (result[z] === '(') {
            opBracketCount += 1;
          } else if (result[z] === ')' && opBracketCount === 0) {
            closingBracketIndex = z;
            break;
          } else if (result[z] === ')' && opBracketCount !== 0) {
            opBracketCount -= 1;
          }
        }
  
        result[k] = '-1';
        result.splice(k + 1, 0, '*');
        result.splice(k, 0, '(');
        result.splice(closingBracketIndex + 3, 0, ')');
  
        if (result[k - 1] === ')') {
          result.splice(k, 0, '+');
        }
  
        if (result[k - 2] === '(') {
          result.splice(k, 0, '+');
        }
      }
    }
  
    return result.filter((r) => r).join(' ');
  };
  
  function calc(expression) {
    const formattedExpression = formatInput(expression);
  
    // Преобразуем инфиксное выражение в постфиксную нотацию
    const postfixExpression = infixToPostfix(formattedExpression);
  
    // Вычисляем значение постфиксного выражения
    const result = evaluatePostfix(postfixExpression);
  
    return result;
  }