const Decimal = require('decimal.js');

function going(n) {
    Decimal.set({ precision: 100 }); // Устанавливаем высокую точность вычислений
    let sumFactorial = new Decimal(1); // Начинаем с 1! = 1
    let sum = new Decimal(1); // Начальное значение суммы

    for (let i = 2; i <= n; i++) {
        sumFactorial = sumFactorial.times(i); // Вычисляем i!
        sum = sum.plus(sumFactorial); // Добавляем i! к сумме
    }

    return sum.dividedBy(sumFactorial).toNumber(); // Возвращаем результат умножения
}