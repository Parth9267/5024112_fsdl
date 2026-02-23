// string_dt.js - examples of string manipulation and date/time usage

// STRING EXAMPLES
const str = "Hello, World!";
console.log('original string:', str);

// length
console.log('length:', str.length);

// accessing characters
console.log('first char:', str[0]);
console.log('last char:', str[str.length - 1]);

// substring and slice
console.log('slice(0,5):', str.slice(0, 5));
console.log('substring(7):', str.substring(7));

// search and index
console.log('indexOf("World"):', str.indexOf('World'));
console.log('includes("Hello"):', str.includes('Hello'));
console.log('startsWith("Hell"):', str.startsWith('Hell'));
console.log('endsWith("!"):', str.endsWith('!'));

// case conversion
console.log('toUpperCase():', str.toUpperCase());
console.log('toLowerCase():', str.toLowerCase());

// trim
const padded = '   padded   ';
console.log('trimmed:', padded.trim());

// split/join
const csv = 'red,green,blue';
const colors = csv.split(',');
console.log('split:', colors);
console.log('joined:', colors.join(' | '));

// replace (first and all)
console.log('replace Hello->Hi:', str.replace('Hello', 'Hi'));
console.log('replace /l/g:', str.replace(/l/g, 'L'));

// template literals
const name = 'Alice';
const greeting = `Welcome, ${name}!`; 
console.log('template literal:', greeting);

// Date & TIME EXAMPLES
const now = new Date();
console.log('current date/time:', now);

// components
console.log('year:', now.getFullYear());
console.log('month (0-based):', now.getMonth());
console.log('date:', now.getDate());
console.log('hours:', now.getHours());
console.log('minutes:', now.getMinutes());
console.log('seconds:', now.getSeconds());

// formatting
console.log('toString():', now.toString());
console.log('toISOString():', now.toISOString());
console.log('toLocaleString():', now.toLocaleString());

// parsing strings
const d1 = new Date('2026-02-23');
console.log('parsed date:', d1);

// timestamp
console.log('milliseconds since epoch:', now.getTime());

// arithmetic
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
console.log('tomorrow:', tomorrow.toLocaleDateString());

// compare dates
console.log('now < tomorrow?', now < tomorrow);

// set individual components
const dt = new Date();
dt.setFullYear(2000);
dt.setMonth(0); // January
console.log('modified date:', dt.toLocaleDateString());

// converting date to string parts via toLocaleDateString options
console.log('formatted date:', now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
