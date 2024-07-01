/* 
Write a function called smallestValue which accepts a variable number of parameters and returns the smallest parameters passed to the function.

Examples:
    smallestValue(4,1,12,0) // 0
    smallestValue(5,4,1,121) // 1
    smallestValue(4,2) // 2
    smallestValue(99,12321,12.2) // 2


Write a function called smallestValue which accepts a variable number of parameters and returns the smallest parameters passed to the function.

Examples:
    smallestValue(4,1,12,0) // 0
    smallestValue(5,4,1,121) // 1
    smallestValue(4,2) // 2
    smallestValue(99,12321,12.2) // 2
*/

function smallestValue() {
  // Initialize minValue to a very large number
  var minValue = Infinity;

  // Loop through all arguments using the arguments object
  for (var i = 0; i < arguments.length; i++) {
    // Update minValue if current argument is smaller
    if (arguments[i] < minValue) {
      minValue = arguments[i];
    }
  }

  // Return the smallest value found
  return minValue;
}

/* 
c

/* 
Write a function called joinArrays which accepts a variable number of parameters (you can assume that each argument to this function will be an array) and returns an array of all of the parameters concatenated together

Examples:

    joinArrays([1],[2],[3]) // [1,2,3]
    joinArrays([1],[2],[3],[1],[2],[3]) // [1,2,3,1,2,3]
    joinArrays([1,2,3],[4,5,6],[7,8,9]) // [1,2,3,4,5,6,7,8,9]
    joinArrays([1],[3],[0],[7]) // [1,3,0,7]

*/

function joinArrays() {
  var result = [];

  // Iterate through arguments and concatenate arrays
  for (var i = 0; i < arguments.length; i++) {
    result = result.concat(arguments[i]);
  }

  return result;
}

/* 
// Write a function called sumEvenArgs which takes all of the parameters passed to a function and returns the sum of the even ones.

Examples:
    sumEvenArgs(1,2,3,4) // 6
    sumEvenArgs(1,2,6) // 8
    sumEvenArgs(1,2) // 2
*/

function sumEvenArgs() {
  var sum = 0;

  // Iterate through arguments
  for (var i = 0; i < arguments.length; i++) {
    // Check if argument is even
    if (arguments[i] % 2 === 0) {
      sum += arguments[i];
    }
  }

  return sum;
}

/* 
Write a function called flip which accepts a function and a value for the keyword this. Flip should return a new function that when invoked, will invoke the function passed to flip with the correct value of the keyword this and all of the parameters passed to the function REVERSED. HINT - if you pass more than two parameters to flip, those parameters should be included as parameters to the inner function when it is invoked. You will have to make use of closure!

Examples:

    function personSubtract(a,b,c){
        return this.firstName + " subtracts " + (a-b-c);
    }
    
    var person = {
        firstName: 'Elie'
    }
    
    var flipFn = flip(personSubtract, person);
    flipFn(3,2,1) // "Elie subtracts -4"
    
    var flipFn2 = flip(personSubtract, person, 5,6);
    flipFn2(7,8). // "Elie subtracts -4"

    flip(subtractFourNumbers,this,1)(2,3,4) // -2
    flip(subtractFourNumbers,this,1,2)(3,4) // -2
    flip(subtractFourNumbers,this,1,2,3)(4) // -2
    flip(subtractFourNumbers,this,1,2,3,4)() // -2
    flip(subtractFourNumbers,this)(1,2,3,4) // -2
    flip(subtractFourNumbers,this,1,2,3)(4,5,6,7) // -2
    flip(subtractFourNumbers,this)(1,2,3,4,5,6,7,8,9,10) // -2
    flip(subtractFourNumbers,this,11,12,13,14,15)(1,2,3,4,5,6,7,8,9,10) // -22

*/

function flip(fn, thisArg, ...boundArgs) {
  return function (...args) {
    var reversedArgs = args.reverse(); // Reverse the order of arguments

    // Combine boundArgs and reversedArgs
    var allArgs = boundArgs.concat(reversedArgs);

    // Call the original function with the correct thisArg and all arguments
    return fn.apply(thisArg, allArgs);
  };
}

// Examples:

function personSubtract(a, b, c) {
  return this.firstName + " subtracts " + (a - b - c);
}

var person = {
  firstName: "Elie"
};

var flipFn = flip(personSubtract, person);
console.log(flipFn(3, 2, 1)); // Output: "Elie subtracts -4"

var flipFn2 = flip(personSubtract, person, 5, 6);
console.log(flipFn2(7, 8)); // Output: "Elie subtracts -4"

function subtractFourNumbers(a, b, c, d) {
  return a - b - c - d;
}

/* 
Write a function called bind which accepts a function and a value for the keyword this. Bind should return a new function that when invoked, will invoke the function passed to bind with the correct value of the keyword this. HINT - if you pass more than two parameters to bind, those parameters should be included as parameters to the inner function when it is invoked. You will have to make use of closure!
Examples:

    function firstNameFavoriteColor(favoriteColor){
        return this.firstName + "'s favorite color is " + favoriteColor
    }
    
    var person = {
        firstName: 'Elie'
    }
    
    var bindFn = bind(firstNameFavoriteColor, person);
    bindFn('green') // "Elie's favorite color is green"
    
    var bindFn2 = bind(firstNameFavoriteColor, person, 'blue');
    bindFn2('green') // "Elie's favorite color is blue" 
    
    function addFourNumbers(a,b,c,d){
        return a+b+c+d;
    }

    bind(addFourNumbers,this,1)(2,3,4) // 10
    bind(addFourNumbers,this,1,2)(3,4) // 10
    bind(addFourNumbers,this,1,2,3)(4) // 10
    bind(addFourNumbers,this,1,2,3,4)() // 10
    bind(addFourNumbers,this)(1,2,3,4) // 10
    bind(addFourNumbers,this)(1,2,3,4,5,6,7,8,9,10) // 10

*/

function bind(fn, thisArg, ...boundArgs) {
  return function (...args) {
    // Combine boundArgs and args when the bound function is invoked
    var allArgs = boundArgs.concat(args);

    // Call the original function with the correct thisArg and all arguments
    return fn.apply(thisArg, allArgs);
  };
}
function firstNameFavoriteColor(favoriteColor) {
  return this.firstName + "'s favorite color is " + favoriteColor;
}

var person = {
  firstName: "Elie"
};

var bindFn = bind(firstNameFavoriteColor, person);
console.log(bindFn("green")); // Output: "Elie's favorite color is green"

var bindFn2 = bind(firstNameFavoriteColor, person, "blue");
console.log(bindFn2("green")); // Output: "Elie's favorite color is blue"

function addFourNumbers(a, b, c, d) {
  return a + b + c + d;
}
