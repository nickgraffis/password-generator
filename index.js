/* Messages to be displayed on the opening of the app*/
var messages = ['Welcome to the password generator!', "Let's begin!"];

/* Questions to be posed to the user about thier desired password*/
var questions = [
  {
    text: 'What kind of letters do you need?',
    example: 'eg. "abc", "ABC", "aBc"',
    id: 'one',
    options: [
      {display: 'Lowercase', id: 'lowercase'},
      {display: 'Uppercase', id: 'uppercase'},
      {display: 'Both', id: 'both'}
    ]
  },
  {
    text: 'Should we include numbers and/or special charecters?',
    example: 'eg. "123", "$%&", 1$3',
    id: 'two',
    options: [
      {display: 'Numbers', id: 'numbers'},
      {display: 'Special Charecters', id: 'special'},
      {display: 'Both', id: 'both'}
    ]
  }
];

/* Global variables*/
var welcome = 1; //Defines if the welcome async function should continue
var questionCount = 0; //Defines what section of our next() function should be used
var count = 0; //How many charecters in the password
var charecterSet = []; //List of all charecters to choose from for the password
var lowercase = "abcdefghijklmnopqrstuvwxyz"; //Lowercase letters
var uppercase = lowercase.toUpperCase(); //Uppercase letters
var numbers = "0123456789"; //numbers
var special = "!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"; //Special charecters

/* Get a file from directory and return it as a string*/
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

/* Find random integer between min and max value*/
function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Generate password of 'count' charecters from the choices of 'array'*/
function generatePassword(count, array) {
  let password = [];
  console.log(array);
  for (let i = 0; i < count; i++) {
    password.push(array[getRandomInt(array.length - 1)]);
  }
  return password.join('');
}

/* Sleep creates a new Promise that will wait x miliseconds to start again*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Display the first question*/
function beginAskingQuestions() {
  let targetLocation = document.getElementById('questions-box');
  targetLocation.innerHTML = eval('`' + getFile('templates/charecter-count.html') + '`');
}

/* Go back to previous question*/
function back() {
  if (questionCount == 1) {
    count = 0;
    charecterSet = [];
    questionCount = 0;
    beginAskingQuestions();
  } else if (questionCount == 2) {
    charecterSet = [];
    questionCount = 0;
    next(count);
  } else if (questionCount == 3) {
    var letters = [];
    if (charecterSet.includes('a')) {
      letters.push(...lowercase.split(''));
    }
    if (charecterSet.includes('A')) {
      letters.push(...uppercase.split(''));
    }
    charecterSet = letters;
    questionCount = 1;
    document.getElementById('lock').classList = 'lock unlocked';
    next();
  }
}

function questionZero(targetLocation, params) {
  if (params === 'none') {
    count = document.getElementById('charecter-count').value;
    if (count < 8 || count > 128) {
      let charecterCountInput = document.getElementById('charecter-count');
      document.getElementById('eg').classList = 'subtitle is-7 has-text-danger';
      charecterCountInput.classList = 'input is-danger';
      charecterCountInput.classList.add('shake');
      setTimeout(function(){ charecterCountInput.classList.remove('shake'); }, 400);
      return;
    }
    questionCount = 1;
    let question = questions[0];
    targetLocation.innerHTML = eval('`' + getFile('templates/question.html') + '`');
    let progress = document.getElementById('progress');
    progress.value = '33';
    console.log(questionCount);
    return;
  } else {
    count = params;
    if (count < 8 || count > 128) {
      document.getElementById('eg').classList = 'subtitle is-7 has-text-danger';
      return;
    }
    questionCount = 1;
    let question = questions[0];
    targetLocation.innerHTML = eval('`' + getFile('templates/question.html') + '`');
    let progress = document.getElementById('progress');
    progress.value = '33';
    console.log(questionCount);
    return;
  }
}

function questionOne (targetLocation, params) {
  questionCount = 2;
  if (params != 'none') {
    let choices = params.split('_');
    console.log(choices);
    if (choices[1] != 'both') {
      charecterSet.push(...eval(choices[1]).split(''));
    } else {
      charecterSet.push(...lowercase.split(''));
      charecterSet.push(...uppercase.split(''));
    }
    question = questions[1];
    targetLocation.innerHTML = eval('`' + getFile('templates/question.html') + '`');
    progress.value = '66';
    console.log(questionCount);
  } else {
    questionCount = 2;
    question = questions[1];
    targetLocation.innerHTML = eval('`' + getFile('templates/question.html') + '`');
    progress.value = '66';
    console.log(questionCount);
  }
  return;
}

function questionTwo(targetLocation, params) {
  questionCount = 3;
  if (params != 'none') {
    let choices = params.split('_');
    if (choices[1] != 'both') {
      charecterSet.push(...eval(choices[1]).split(''));
    } else {
      charecterSet.push(...numbers.split(''));
      charecterSet.push(...special.split(''));
    }
    console.log(charecterSet);
    let password = generatePassword(count, charecterSet);
    targetLocation.innerHTML = eval('`' + getFile('templates/password.html') + '`');
    progress.value = '100';
    document.getElementById('lock').classList = 'lock';
    console.log(questionCount);
  } else {
    let password = generatePassword(count, charecterSet);
    targetLocation.innerHTML = eval('`' + getFile('templates/password.html') + '`');
    progress.value = '100';
  }
  return;
}

/* Go back to next question*/
function next(params = 'none') {
  var targetLocation = document.getElementById('questions-box');
  if (questionCount == 0) {
    questionZero(targetLocation, params);
    return;
  } else if (questionCount == 1) {
    questionOne(targetLocation, params);
    return;
  } else if (questionCount == 2) {
    questionTwo(targetLocation, params);
    return;
  }
}

async function begin() {
  let targetLocation = document.getElementById('questions-box');
  if (welcome == 1) {
    let message = messages[0];
    targetLocation.innerHTML = eval('`' + getFile('templates/message.html') + '`');
    let p = document.getElementById('message');
    await sleep(1000);
    message = messages[1];
    targetLocation.innerHTML += eval('`' + getFile('templates/message.html') + '`');
    await sleep(1000);
    welcome = 0;
    beginAskingQuestions();
  }
}

function startOver() {
  welcome = 1;
  questionCount = 0;
  count = 0;
  charecterSet = [];
  let progress = document.getElementById('progress');
  progress.value = '00';
  document.getElementById('lock').classList = 'lock unlocked';
  beginAskingQuestions();
}

function regenerate() {
  questionCount = 2;
  next();
}

function copyPassword() {
  let p = document.getElementById('password');
  let password = p.innerHTML;
  p.setAttribute('data-tooltip', 'Copied!');
  var element = document.createElement("textarea");
  document.body.appendChild(element);
  element.value = password;
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);
}

begin();
