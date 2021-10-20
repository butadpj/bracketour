import { names } from "../api/names.js";
import { 
  getRandomIndexFrom, 
  groupArrayBy,
  randomNumberBetween,
  isOdd
} from "./utils/index.js";

// SELECTORS
const participantForm = document.getElementById('participant-form');

const brackets = document.getElementById('brackets');

const round1Players = document.getElementById('players-r1');
const round2Players = document.getElementById('players-r2');
const round3Players = document.getElementById('players-r3');

const round1Connectors = document.getElementById('connectors-r1');
const round2Connectors = document.getElementById('connectors-r2');
const round3Connectors = document.getElementById('connectors-r3');

const round1Lines = document.getElementById('lines-r1');
const round2Lines = document.getElementById('lines-r2');
const round3Lines = document.getElementById('lines-r3');

const editBracketButton = document.getElementById('edit-btn');
const nextRoundButton = document.getElementById('next-round');
//

// GLOBALS 
let nextRoundButtonState = 1;
let playersGroupCount;
//

// FUNCTIONS
const createBracketsFromRandomNames = (playersCount) => {
  playersGroupCount = Math.ceil(playersCount / 2);
  const connectorCount = Math.ceil(playersCount / 4);
  
  populateContainerWithRandomPlayers(playersCount, round1Players);
  populateContainerWithConnectors(connectorCount, round1Connectors);
  populateContainerWithLines(connectorCount, round1Lines); 
}

const getWinnersFromGroupedArray = (groupedArray) => {
  let winners = [];

  const selectRandomWinner = (array) => {
    if (array.length > 1) (
      array[randomNumberBetween(0, 1)]
    )  
    return array[0];    
  } 

  groupedArray.map(group => {
    let winner = selectRandomWinner(group);

    winner.querySelector('.player__score').textContent = (
      randomNumberBetween(2, 3)
    );
    winners.push(winner);

    // Loop through [div.player, div.player]
    // The element that still has score of 0 is the loser
    group.map(element => {
      const score = element.querySelector('.player__score').textContent;
      if (score == 0) {
        const loser = element;
        loser.querySelector('.player__score').textContent = (
          randomNumberBetween(0, 1)
        );
      }
    })
  })

  return winners
}

const populateContainerWithLines = (count, container) => {
  for (let i = 0; i < count; i++) {
    const lineElement = document.createElement('div');
    container.appendChild(lineElement);
  }
}

const populateContainerWithConnectors = (count, container) => {
  for (let i = 0; i < count; i++) {
    const connectorElement = document.createElement('div');
    container.appendChild(connectorElement);
  }
}

const populateContainerWithRandomPlayers = (count, container) => {
  const uniqueNumbers = new Set();

  for (let i = 0; i < count; i++) {
    let randomIndex = getRandomIndexFrom(names);
    let randomName = names[randomIndex];

    uniqueNumbers.add(randomIndex);

    // Generate random name again if the name has
    // already exist in uniqueNumbers
    if (uniqueNumbers.has(randomIndex)) {
      randomIndex = getRandomIndexFrom(names);
      randomName = names[randomIndex];
    }
    container.appendChild(createPlayerElement(randomName, 0));
  }
}

const createPlayerElement = (name, score) => {
  const player = document.createElement('div');
  player.classList.add('player');

  player.innerHTML = `
    <div class="player__name">${name}</div>
    <div class="player__score">${score}</div>
  `;

  return player;
}

const showBrackets = (participantCount) => {
  participantForm.classList.add('hidden');
  editBracketButton.classList.remove('hidden');
  brackets.classList.remove('hidden');
  nextRoundButton.classList.remove('hidden');

  createBracketsFromRandomNames(participantCount);
}
//

// EVENT LISTENERS
editBracketButton.addEventListener('click', () => {
  participantForm.classList.remove('hidden');
  editBracketButton.classList.add('hidden');
  brackets.classList.add('hidden');
  nextRoundButton.classList.add('hidden');

  round1Players.innerHTML = '';
  round2Players.innerHTML = '';
  round3Players.innerHTML = '';

  round1Connectors.innerHTML = '';
  round2Connectors.innerHTML = '';
  round3Connectors.innerHTML = '';

  round1Lines.innerHTML = '';
  round2Lines.innerHTML = '';
  round3Lines.innerHTML = '';

  nextRoundButtonState = 1;
});

nextRoundButton.addEventListener('click', () => {
  if (nextRoundButtonState === 1) {
    const groupedPlayers = groupArrayBy([...round1Players.children], playersGroupCount);
    const round1Winners = getWinnersFromGroupedArray(groupedPlayers);

    round1Winners.forEach(winner => {
      // Appending element to somewhere will move the element
      // Cloning it first, and then moving the cloned element
      // solves the issue
      const clonedWinner = winner.cloneNode(true);
      clonedWinner.querySelector('.player__score').textContent = 0;
      round2Players.appendChild(clonedWinner);
    });

    round1Lines.insertAdjacentElement('afterend', round2Players);

    populateContainerWithConnectors(round1Winners.length / 4, round2Connectors);
    populateContainerWithLines(round1Winners.length / 4, round2Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);
  }

  if (nextRoundButtonState === 2) {
    const groupedPlayers = groupArrayBy([...round2Players.children], playersGroupCount);
    const round2Winners = getWinnersFromGroupedArray(groupedPlayers);

    round2Winners.forEach(winner => {
      // Appending element to somewhere will move the element
      // Cloning it first, and then moving the cloned element
      // solves the issue
      const clonedWinner = winner.cloneNode(true);
      clonedWinner.querySelector('.player__score').textContent = 0;
      round3Players.appendChild(clonedWinner);
    });

    round2Lines.insertAdjacentElement('afterend', round3Players);

    populateContainerWithConnectors(round2Winners.length / 4, round3Connectors);
    populateContainerWithLines(round2Winners.length / 4, round3Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);
  }

  if (nextRoundButtonState === 3) {
    console.log('3rd');
  }
  

  nextRoundButtonState++;
});
// EVENT LISTENERS

// EXPOSE
export { showBrackets }
//