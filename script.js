'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-04-20T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-04-17T23:10:17.929Z',
    '2022-04-16T12:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
const calcIn = function (movements) {
  return movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
};

const calcOut = function (movements) {
  return Math.abs(
    movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
};
const calcInterest = function (acc) {
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => deposite * (acc.interestRate / 100))
    .filter(deposite => deposite >= 1)
    .reduce((acc, deposite) => acc + deposite, 0);
  return interest;
};
const formateMoney = function (locale, formatConfig, money) {
  return new Intl.NumberFormat(locale, formatConfig).format(money);
};
const displaySummary = function (acc) {
  labelSumIn.textContent = `${formateMoney(
    acc.locale,
    { style: 'currency', currency: acc.currency },
    Number(calcIn(acc.movements))
  )}`;
  labelSumOut.textContent = `${formateMoney(
    acc.locale,
    { style: 'currency', currency: acc.currency },
    Number(calcOut(acc.movements))
  )}`;
  labelSumInterest.textContent = `${formateMoney(
    acc.locale,
    { style: 'currency', currency: acc.currency },
    Number(calcInterest(acc))
  )}`;
};
const generateUserNames = function (accounts) {
  accounts = accounts.map(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcBalance = function (currentAccount) {
  currentAccount.balance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov
  );
};

const displayBalance = function (currentAccount) {
  calcBalance(currentAccount);
  labelBalance.textContent = `${formateMoney(
    currentAccount.locale,
    { style: 'currency', currency: currentAccount.currency },
    currentAccount.balance
  )}`;
};

const calcDaysPassed = function (date1, date2) {
  return Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));
};

const formatMovementDate = function (movementDate, locale) {
  const date = new Intl.DateTimeFormat(locale).format(movementDate);
  const days = calcDaysPassed(new Date(), new Date(movementDate));

  if (days === 0) return 'TODAY';
  else if (days === 1) return 'YESTERDAY';
  else if (days <= 7) return `${days} days ago`;
  else return date;
};
const displayMovements = function (currAccount, isSorted) {
  const movs = isSorted
    ? currAccount.movements.slice().sort((a, b) => a - b)
    : currAccount.movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const movementDate = formatMovementDate(
      new Date(currAccount.movementsDates[i]),
      currAccount.locale
    );
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${movementDate}</div> 
    <div class="movements__value">${formateMoney(
      currAccount.locale,
      { style: 'currency', currency: currAccount.currency },
      mov
    )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const displayBalanceDate = function (account) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  };
  const now = new Date();
  labelDate.textContent = new Intl.DateTimeFormat(
    account.locale,
    options
  ).format(now);
};
const updateUI = function (account) {
  displayMovements(account);
  displayBalance(account);
  displaySummary(account);
  displayBalanceDate(account);
};
generateUserNames(accounts);
//////////////////////////////////////////////////////////////////////////
let currentAccount,
  timer,
  sorted = false;
const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
};
const resetTimer = function () {
  clearInterval(timer);
  startLogOutTimer();
};
const login = function (e) {
  sorted = false;
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ,${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 1;
    if (timer) clearInterval(timer);
    startLogOutTimer();
    updateUI(currentAccount);
  }
};

const transfer = function (e) {
  e.preventDefault();
  const receiver = accounts.find(acc => acc.userName === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    receiver &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.userName !== receiver.userName
  ) {
    currentAccount.movements.push(amount * -1);
    currentAccount.movementsDates.push(new Date().toISOString());

    receiver.movements.push(amount);
    receiver.movementsDates.push(new Date().toISOString());
    resetTimer();
    updateUI(currentAccount);
  }
};

const loan = function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const validRequest = currentAccount.movements.some(
    mov => mov > 0 && mov >= amount * 0.1
  );
  inputLoanAmount.value = '';

  if (validRequest) {
    resetTimer();
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }
};

const close_ = function (e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);
  labelWelcome.textContent = `Log in to get started`;
  inputCloseUsername.value = inputClosePin.value = '';
  if (
    confirmUser === currentAccount.userName &&
    confirmPin === currentAccount.pin
  ) {
    const indexOfDeletedAcc = accounts.findIndex(
      acc => acc.userName === confirmUser
    );
    accounts.splice(indexOfDeletedAcc, 1);
    containerApp.style.opacity = 0;
  }
};

const sort = function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
};

btnLogin.addEventListener('click', login);

btnTransfer.addEventListener('click', transfer);

btnLoan.addEventListener('click', loan);

btnClose.addEventListener('click', close_);

btnSort.addEventListener('click', sort);
