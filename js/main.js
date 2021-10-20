import { regexValidate, addClassTo } from './utils/index.js';

const participantInput = document.getElementById('participant-input');

const minElement = document.querySelector('.constraints .min');
const maxElement = document.querySelector('.constraints .max'); 

const submitBtn = document.getElementById('submit-btn');

const numbersOnly = regexValidate('number');

participantInput.addEventListener('input', (e) => {
  const input = e.target.value;

  const maxPraticipants = 50;
  const minPraticipants = 2;

  const validateInput = numbersOnly(pattern => {
    if (
        input && // not empty
        pattern.test(input) && // valid number
        Number(input) <= maxPraticipants &&
        Number(input) >= minPraticipants
      ) { 
        return {
          valid: true,
          value: input
        }
    } 

    if (Number(input) > maxPraticipants) return {
      valid: false,
      error: 'max'
    }

    if (Number(input) < minPraticipants) return {
      valid: false,
      error: 'min'
    }

    // default
    return {
      valid: false,
      error: 'Please input a valid number',
    }
  });

  if (!validateInput.valid) {
    participantInput.classList.add('danger');
    participantInput.classList.remove('success');
    submitBtn.classList.add('disabled');

    submitBtn.disabled = true;

    if (validateInput.error === 'min') {
      const removeAfterSecond = addClassTo('apply-shake', minElement);
      removeAfterSecond(1);
    }
    if (validateInput.error === 'max') {
      const removeAfterSecond = addClassTo('apply-shake', maxElement);
      removeAfterSecond(1);
    }
    return
  } 

  participantInput.classList.add('success');
  participantInput.classList.remove('danger');  
  submitBtn.classList.remove('disabled');

  submitBtn.disabled = false;
});

