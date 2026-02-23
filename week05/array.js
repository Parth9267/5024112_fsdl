// array.js - examples of working with arrays in JavaScript

// creation
const empty = [];
const numbers = [1, 2, 3, 4, 5];
const mixed = ['hello', 42, true, { name: 'Alice' }];

console.log('empty array:', empty);
console.log('numbers:', numbers);
console.log('mixed:', mixed);

// accessing elements
console.log('first number:', numbers[0]);
console.log('last number via length:', numbers[numbers.length - 1]);

// pushing and popping
numbers.push(6);
console.log('after push 6:', numbers);
const popped = numbers.pop();
console.log('popped value:', popped, 'numbers:', numbers);

// unshift/shift
numbers.unshift(0);
console.log('after unshift 0:', numbers);
const shifted = numbers.shift();
console.log('shifted value:', shifted, 'numbers:', numbers);

// iterate using for loop
for (let i = 0; i < numbers.length; i++) {
  console.log(`numbers[${i}] =`, numbers[i]);
}

// iterate using for...of
for (const n of numbers) {
  console.log('for...of number', n);
}

// array methods: map, filter, reduce, find, includes
const squared = numbers.map(n => n * n);
console.log('squared:', squared);

const evens = numbers.filter(n => n % 2 === 0);
console.log('evens:', evens);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('sum:', sum);

const found = numbers.find(n => n > 3);
console.log('first number greater than 3:', found);

console.log('does numbers include 3?', numbers.includes(3));

// spread operator and concat
const more = [...numbers, 7, 8];
console.log('more:', more);

const combined = numbers.concat([9, 10]);
console.log('combined:', combined);

// array destructuring
const [first, second, ...rest] = numbers;
console.log('first, second, rest:', first, second, rest);

// converting strings to arrays and vice versa
const csv = 'a,b,c';
const parts = csv.split(',');
console.log('parts:', parts);
console.log('join back:', parts.join('-'));

// multidimensional arrays
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
];
console.log('matrix element [1][2]:', matrix[1][2]);

// spread with Math.max
console.log('max of numbers:', Math.max(...numbers));

// copy by value vs reference
const numsCopy = numbers.slice();
numsCopy.push(99);
console.log('original numbers:', numbers);
console.log('copied and modified:', numsCopy);

// convert array-like object to array
function example() {
  const argsArray = Array.from(arguments);
  console.log('arguments as array:', argsArray);
}
example('x', 'y', 'z');
