import { regexPattern, addClassTo } from './utils/index.js';

// SELECTORS
const participantInput = document.getElementById('participant-input');

const minInputElement = document.querySelector('.constraints .min');
const maxInputElement = document.querySelector('.constraints .max');

const submitBtn = document.getElementById('submit-btn');
//

// GLOBALS/CONSTANTS
const MAX_PARTICIPANTS = 50;
const MIN_PARTICIPANTS = 2;
const numberPattern = regexPattern.number;
//

// FUNCTIONS
const validateInputWithPattern = (input, pattern) => {
  if (
    input && // not empty
    pattern.test(input) && // valid number
    Number(input) <= MAX_PARTICIPANTS &&
    Number(input) >= MIN_PARTICIPANTS
  )
    return {
      valid: true,
      value: input,
    };

  if (Number(input) > MAX_PARTICIPANTS)
    return {
      valid: false,
      error: 'max',
    };

  if (Number(input) < MIN_PARTICIPANTS)
    return {
      valid: false,
      error: 'min',
    };

  // default
  return {
    valid: false,
    error: 'Please input a valid number',
  };
};

const invalidInputAndButton = (inputElement, buttonElement) => {
  inputElement.classList.add('danger');
  inputElement.classList.remove('success');

  buttonElement.classList.add('disabled');
  buttonElement.disabled = true;
};

const validInputAndButton = (inputElement, buttonElement) => {
  inputElement.classList.add('success');
  inputElement.classList.remove('danger');

  buttonElement.classList.remove('disabled');
  buttonElement.disabled = false;
};
//

// DOM nodes needed to be loaded first
// For testing purposes
window.addEventListener('load', () => {
  maxInputElement.querySelector('span').textContent = MAX_PARTICIPANTS;
  minInputElement.querySelector('span').textContent = MIN_PARTICIPANTS;

  // EVENT LISTENERS
  participantInput.addEventListener('input', (e) => {
    const input = e.target.value;

    const inputResult = validateInputWithPattern(input, numberPattern);

    if (!inputResult.valid) {
      invalidInputAndButton(participantInput, submitBtn);

      if (inputResult.error === 'min') {
        const removeAfterSecond = addClassTo('apply-shake', minInputElement);
        removeAfterSecond(1);
      }
      if (inputResult.error === 'max') {
        const removeAfterSecond = addClassTo('apply-shake', maxInputElement);
        removeAfterSecond(1);
      }
      return;
    }

    validInputAndButton(participantInput, submitBtn);
  });
  //
});

// EXPOSE
export {
  validateInputWithPattern,
  validInputAndButton,
  invalidInputAndButton,
  numberPattern,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
};
