import { showBrackets } from './brackets.js';

const participantForm = document.getElementById('participant-form');

participantForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let participantCount = e.target.querySelector('#participant-input').value;
  showBrackets(participantCount);
})

