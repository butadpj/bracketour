import { names } from "../api/names.js";
import { 
  getRandomIndexFrom, 
  groupArrayBy,
  randomNumberBetween,
} from "./utils/index.js";

/* 
  TODO: FIX BUG WHEN RANDOM SCORE IS STILL GENERATING 
  EVEN WHEN THERE'S ONLY ONE (1) PLAYER LEFT
*/

// SELECTORS
const participantForm = document.getElementById('participant-form');

const brackets = document.getElementById('brackets');

const round1Players = document.getElementById('players-r1');
const round2Players = document.getElementById('players-r2');
const round3Players = document.getElementById('players-r3');
const round4Players = document.getElementById('players-r4');
const round5Players = document.getElementById('players-r5');
const round6Players = document.getElementById('players-r6');
const round7Players = document.getElementById('players-r7');

const round1Connectors = document.getElementById('connectors-r1');
const round2Connectors = document.getElementById('connectors-r2');
const round3Connectors = document.getElementById('connectors-r3');
const round4Connectors = document.getElementById('connectors-r4');
const round5Connectors = document.getElementById('connectors-r5');
const round6Connectors = document.getElementById('connectors-r6');
const round7Connectors = document.getElementById('connectors-r7');

const round1Lines = document.getElementById('lines-r1');
const round2Lines = document.getElementById('lines-r2');
const round3Lines = document.getElementById('lines-r3');
const round4Lines = document.getElementById('lines-r4');
const round5Lines = document.getElementById('lines-r5');
const round6Lines = document.getElementById('lines-r6');
const round7Lines = document.getElementById('lines-r7');

const editBracketButton = document.getElementById('edit-btn');
const nextRoundButton = document.getElementById('next-round');
//

// GLOBALS 
let nextRoundButtonState = 1;
let playersGroupCount;
let connectorsCount;
//

// FUNCTIONS
const showBrackets = (participantCount) => {
  participantForm.classList.add('hidden');
  editBracketButton.classList.remove('hidden');
  brackets.classList.remove('hidden');
  nextRoundButton.classList.remove('hidden');

  createBracketsFromRandomNames(participantCount);
}

const createBracketsFromRandomNames = (playersCount) => {
  playersGroupCount = Math.ceil(playersCount / 2);
  connectorsCount = Math.ceil(playersCount / 4);
  
  populateContainerWithRandomPlayers(playersCount, round1Players);
}

const populateContainerWithRandomPlayers = (count, container) => {
  const uniqueNumbers = new Set();

  for (let i = 0; i < count; i++) {
    let randomIndex = getRandomIndexFrom(names);
    let randomName = names[randomIndex];

    // Generate random name again if the name has
    // already exist in uniqueNumbers
    if (uniqueNumbers.has(randomIndex)) {
      randomIndex = getRandomIndexFrom(names);
      randomName = names[randomIndex];
    }
    uniqueNumbers.add(randomIndex);

    container.appendChild(createPlayerElement(randomName, 0));
  }
}

const populateContainerWithConnectors = (count, container) => {
  for (let i = 0; i < count; i++) {
    const connectorElement = document.createElement('div');
    container.appendChild(connectorElement);
  }
}

const populateContainerWithLines = (count, container) => {
  for (let i = 0; i < count; i++) {
    const lineElement = document.createElement('div');
    container.appendChild(lineElement);
  }
}

const createPlayerElement = (name, score) => {
  const player = document.createElement('div');
  player.classList.add('player');

  player.innerHTML = `
    <div class="player__name" data-name="${name}">${name}</div>
    <div class="player__score">${score}</div>
  `;

  return player;
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

const getRoundWinners = (roundPlayers, groupCount) => {
  const groupedPlayers = groupArrayBy([...roundPlayers.children], groupCount);
  const roundWinners = getWinnersFromGroupedArray(groupedPlayers);

  return roundWinners
}

const getFinalWinner = (roundPlayers) => {
  if (roundPlayers.childElementCount === 1) {
    const finalWinner = roundPlayers.firstElementChild;
    const winnerName = (
      finalWinner
      .querySelector('.player__name')
      .textContent
    )
    
    finalWinner.classList.add('winner');
    finalWinner.querySelector('.player__name').classList.add('winner');

    finalWinner
      .querySelector('.player__score')
      .textContent = 'W';
  
    setTimeout(() => {
        alert(`The winner of this tournament is: ${winnerName}`), 
        nextRoundButton.disabled = true;
        nextRoundButton.classList.add('disabled');
      },
      200
    ) 
  }
  return false
}

const advanceWinnersToNextRound = (
    roundWinners, 
    insertNextToThis,
    container
  ) => {
  
  // Append winners to the container
  roundWinners.forEach(winner => {
    // Appending element to somewhere will move the element
    // Cloning it first, and then moving the cloned element
    // solves the issue
    const clonedWinner = winner.cloneNode(true);
    clonedWinner.querySelector('.player__score').textContent = 0;
    container.appendChild(clonedWinner);
  });

  // Insert container with winners next to specified element
  insertNextToThis.insertAdjacentElement('afterend', container);
}
//

// EVENT LISTENERS

// hover feature start
brackets.addEventListener('mouseover', (e) => {
  if (
    e.target.classList.contains('player')
  ) {
    const name = e.target.firstElementChild.dataset.name;
    const mathcedPlayers = (
      document.querySelectorAll(`[data-name='${name}']`)
    )

    mathcedPlayers.forEach(player => {
      player.closest('.player').classList.add('active');
      player.classList.add('active');
    })
  }

  if (
    e.target.classList.contains('player__name') ||
    e.target.classList.contains('player__score') 
  ) {
    const name = e.target.closest('.player').firstElementChild.dataset.name;
    const mathcedPlayers = (
      document.querySelectorAll(`[data-name='${name}']`)
    )

    mathcedPlayers.forEach(player => {
      player.closest('.player').classList.add('active');
      player.classList.add('active');
    })
  }
})

brackets.addEventListener('mouseout', (e) => {
  if (
    e.target.classList.contains('player')
  ) {
    const name = e.target.firstElementChild.dataset.name;
    const mathcedPlayers = (
      document.querySelectorAll(`[data-name='${name}']`)
    )

    mathcedPlayers.forEach(player => {
      player.closest('.player').classList.remove('active');
      player.classList.remove('active');
    })
  }

  if (
    e.target.classList.contains('player__name') ||
    e.target.classList.contains('player__score') 
  ) {
    const name = e.target.closest('.player').firstElementChild.dataset.name;
    const mathcedPlayers = (
      document.querySelectorAll(`[data-name='${name}']`)
    )

    mathcedPlayers.forEach(player => {
      player.closest('.player').classList.remove('active');
      player.classList.remove('active');
    })
  }
})
// hover feature end

// edit bracket feature start
editBracketButton.addEventListener('click', () => {
  participantForm.classList.remove('hidden');
  editBracketButton.classList.add('hidden');
  brackets.classList.add('hidden');
  nextRoundButton.classList.add('hidden');

  round1Players.innerHTML = '';
  round2Players.innerHTML = '';
  round3Players.innerHTML = '';
  round4Players.innerHTML = '';
  round5Players.innerHTML = '';
  round6Players.innerHTML = '';
  round7Players.innerHTML = '';

  round1Connectors.innerHTML = '';
  round2Connectors.innerHTML = '';
  round3Connectors.innerHTML = '';
  round4Connectors.innerHTML = '';
  round5Connectors.innerHTML = '';
  round6Connectors.innerHTML = '';

  round1Lines.innerHTML = '';
  round2Lines.innerHTML = '';
  round3Lines.innerHTML = '';
  round4Lines.innerHTML = '';
  round5Lines.innerHTML = '';
  round6Lines.innerHTML = '';

  nextRoundButtonState = 1;
  nextRoundButton.disabled = false;
  nextRoundButton.classList.remove('disabled');
});
// edit bracket feature end

// next round feature start
nextRoundButton.addEventListener('click', () => {
  if (nextRoundButtonState === 1) {
    const round1Winners = getRoundWinners(round1Players, playersGroupCount);

    advanceWinnersToNextRound(round1Winners, round1Lines, round2Players);

    populateContainerWithConnectors(round1Players.childElementCount / 2, round1Connectors);
    populateContainerWithLines(round1Players.childElementCount / 4, round1Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);
    
    getFinalWinner(round2Players);
  }

  if (nextRoundButtonState === 2) {
    const round2Winners = getRoundWinners(round2Players, playersGroupCount);

    advanceWinnersToNextRound(round2Winners, round2Lines, round3Players);

    populateContainerWithConnectors(round2Players.childElementCount / 2, round2Connectors);
    populateContainerWithLines(round2Players.childElementCount / 4, round2Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(round3Players);
  }

  if (nextRoundButtonState === 3) {
    const round3Winners = getRoundWinners(round3Players, playersGroupCount);

    advanceWinnersToNextRound(round3Winners, round3Lines, round4Players);

    populateContainerWithConnectors(round3Players.childElementCount / 2, round3Connectors);
    populateContainerWithLines(round3Players.childElementCount / 4, round3Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(round4Players);
  }

  if (nextRoundButtonState === 4) {
    const round4Winners = getRoundWinners(round4Players, playersGroupCount);

    advanceWinnersToNextRound(round4Winners, round4Lines, round5Players);

    populateContainerWithConnectors(round4Players.childElementCount / 2, round4Connectors);
    populateContainerWithLines(round4Players.childElementCount / 4, round4Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(round5Players);
  }

  if (nextRoundButtonState === 5) {
    const round5Winners = getRoundWinners(round5Players, playersGroupCount);

    advanceWinnersToNextRound(round5Winners, round5Lines, round6Players);

    populateContainerWithConnectors(round5Players.childElementCount / 2, round5Connectors);
    populateContainerWithLines(round5Players.childElementCount / 4, round5Lines);  

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(round6Players);
  }

  if (nextRoundButtonState === 6) {
    const round6Winners = getRoundWinners(round6Players, playersGroupCount);

    advanceWinnersToNextRound(round6Winners, round6Lines, round7Players);

    populateContainerWithConnectors(round6Players.childElementCount / 2, round6Connectors);
    populateContainerWithLines(round6Players.childElementCount / 4, round6Lines); 

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(round7Players);
  }
  
  nextRoundButtonState++;
});
// next round feature end

// EVENT LISTENERS

// EXPOSE
export { showBrackets }
//