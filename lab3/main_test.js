const {describe, it} = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

// TODO: write your tests here
const {mock} = require('node:test');

describe("testing calculator", () => {
    it('test exp the error-results: no Interger', () => {
        const calculator = new Calculator();
        
        const testcases = [
            { params: 'a', expected: Error('unsupported operand type') },   // String
            { params: '1', expected: Error('unsupported operand type') },     // Number
            { params: true, expected: Error('unsupported operand type') },  // Boolean
            { params: null, expected: Error('unsupported operand type') },  // null
            { params: NaN, expected: Error('unsupported operand type') },   // non a Number
            { params: {}, expected: Error('unsupported operand type') },     // Object
        ]

        for (let testcase of testcases){
            assert.throws(() => calculator.exp(testcase.params), testcase.expected);
        }
    });

    it('test exp the error-results: overflow', () => {
        const calculator = new Calculator();
        mock.method(Math, 'exp', () => Infinity);
        assert.throws(() => calculator.exp(1), Error('overflow'));
        mock.reset();
    });

    it('test exp at least 3 parameterized testcases to test the non-error-results', () => {
        const calculator = new Calculator();

        const getRndInteger = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (let i = 0; i < 20; i++) {
            const number = getRndInteger(-100, 100);
            assert.strictEqual(calculator.exp(number), Math.exp(number));
        }
    });


    it('test log the error-results: no Interger', () => {
        const calculator = new Calculator();
        
        const testcases = [
            { params: 'a', expected: Error('unsupported operand type') },   // String
            { params: '1', expected: Error('unsupported operand type') },     // Number
            { params: true, expected: Error('unsupported operand type') },  // Boolean
            { params: null, expected: Error('unsupported operand type') },  // null
            { params: NaN, expected: Error('unsupported operand type') },   // non a Number
            { params: {}, expected: Error('unsupported operand type') },     // Object
        ]

        for (let testcase of testcases){
            assert.throws(() => calculator.log(testcase.params), testcase.expected);
        }
    });

    it('test log the error-results: math domain error (1)', () => {
        const calculator = new Calculator();
        mock.method(Math, 'log', () => -Infinity);
        assert.throws(() => calculator.log(1), Error('math domain error (1)'));
        mock.reset();
    });

    it('test log the error-results: math domain error (2)', () => {
        const calculator = new Calculator();
        mock.method(Math, 'log', () => NaN);
        assert.throws(() => calculator.log(1), Error('math domain error (2)'));
        mock.reset();
    });

    it('test log at least 3 parameterized testcases to test the non-error-results', () => {
        const calculator = new Calculator();

        const logExample = [10, 100, 1000];


        for (let i = 0; i < 3; i++) {
            assert.strictEqual(calculator.log(logExample[i]), Math.log(logExample[i]));
        }
    });

});