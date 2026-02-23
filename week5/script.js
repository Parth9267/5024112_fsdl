// script.js - JavaScript examples of variables, operators, conditions, loops, functions, events, classes

// variables & operators
let a = 10;
let b = 20;
const sum = a + b;
console.log(`a + b = ${sum}`);

// condition
function checkNumber(num) {
  if (num > 0) return "positive";
  else if (num < 0) return "negative";
  else return "zero";
}

// loops
function listNumbers(n) {
  const arr = [];
  for (let i = 1; i <= n; i++) {
    arr.push(i);
  }
  return arr;
}

// functions
function greet(name) {
  return `Hello, ${name}!`;
}

// class & object
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  describe() {
    return `${this.name} is ${this.age} years old.`;
  }
}

// event handlers
function showGreeting() {
  const name = document.getElementById('nameInput').value;
  const output = document.getElementById('greetOutput');
  output.textContent = greet(name || 'World');
}

function displayNumbers() {
  const n = parseInt(document.getElementById('numberCount').value, 10) || 5;
  const list = listNumbers(n);
  document.getElementById('numbersOutput').textContent = list.join(', ');
}

// demonstrate classes
function makePerson() {
  const name = document.getElementById('personName').value;
  const age = parseInt(document.getElementById('personAge').value, 10) || 0;
  const p = new Person(name, age);
  document.getElementById('personOutput').textContent = p.describe();
}

// attach event listeners
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('greetBtn').addEventListener('click', showGreeting);
  document.getElementById('listBtn').addEventListener('click', displayNumbers);
  document.getElementById('personBtn').addEventListener('click', makePerson);
});
