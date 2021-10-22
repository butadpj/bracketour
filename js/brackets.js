import { names } from '../api/names.js';
import {
  getRandomIndexFrom,
  groupArrayBy,
  randomNumberBetween,
} from './utils/index.js';

/* 
  TODO: FIX BUG WHEN RANDOM SCORE IS STILL GENERATING 
  EVEN WHEN THERE'S ONLY ONE (1) PLAYER LEFT
*/

// SELECTORS
const participantForm = document.getElementById('participant-form');
const brackets = document.getElementById('brackets');

const editBracketButton = document.getElementById('edit-btn');
const nextRoundButton = document.getElementById('next-round');
//

// GLOBALS
let nextRoundButtonState = 1;
let playersGroupCount;
//

// FUNCTIONS
const getAllRoundLines = (maxRound = 7) => {
  let roundLines = [];
  for (let i = 1; i <= maxRound; i++) {
    roundLines.push(document.getElementById(`lines-r${i}`));
  }
  return roundLines;
};

const getAllRoundConnectors = (maxRound = 7) => {
  let roundConnectors = [];
  for (let i = 1; i <= maxRound; i++) {
    roundConnectors.push(document.getElementById(`connectors-r${i}`));
  }
  return roundConnectors;
};

const getAllRoundPlayers = (maxRound = 7) => {
  let roundPlayers = [];
  for (let i = 1; i <= maxRound; i++) {
    roundPlayers.push(document.getElementById(`players-r${i}`));
  }
  return roundPlayers;
};

const selectRoundFromAll = (round, getter) => {
  if (round === 0) return console.log('Round starts from 1');
  return getter()[round - 1];
};

const showBrackets = (participantCount) => {
  participantForm.classList.add('hidden');
  editBracketButton.classList.remove('hidden');
  brackets.classList.remove('hidden');
  nextRoundButton.classList.remove('hidden');

  createBracketsFromRandomNames(participantCount);
};

const createBracketsFromRandomNames = (playersCount) => {
  playersGroupCount = Math.ceil(playersCount / 2);
  populateContainerWithRandomPlayers(
    playersCount,
    selectRoundFromAll(1, getAllRoundPlayers),
  );
};

const populateContainerWithRandomPlayers = (count, container) => {
  const uniqueNames = new Set();
  let randomName;

  // Getting unique names
  do {
    randomName = names[getRandomIndexFrom(names)];
    uniqueNames.add(randomName);
  } while (uniqueNames.has(randomName) && uniqueNames.size < count);

  // Using unique names
  uniqueNames.forEach((value) => {
    container.appendChild(createPlayerElement({ name: value, score: 0 }));
  });
};

const populateContainerWithConnectors = (count, container) => {
  for (let i = 0; i < count; i++) {
    const connectorElement = document.createElement('div');
    container.appendChild(connectorElement);
  }
};

const populateContainerWithLines = (count, container) => {
  for (let i = 0; i < count; i++) {
    const lineElement = document.createElement('div');
    container.appendChild(lineElement);
  }
};

const createPlayerElement = ({ name, score }) => {
  const player = document.createElement('div');
  player.classList.add('player');

  player.innerHTML = `
    <div class="player__name" data-name="${name}">${name}</div>
    <div class="player__score">${score}</div>
  `;

  return player;
};

const getWinnersFromGroupedArray = (groupedArray) => {
  let winners = [];

  const selectRandomWinner = (array) => {
    if (array.length > 1) array[randomNumberBetween(0, 1)];
    return array[0];
  };

  groupedArray.forEach((group) => {
    let winner = selectRandomWinner(group);
    winner.querySelector('.player__score').textContent = randomNumberBetween(
      2,
      3,
    );
    winners.push(winner);

    // Loop through [div.player, div.player]
    // The element that still has score of 0 is the loser
    group.forEach((element) => {
      const score = element.querySelector('.player__score').textContent;
      if (score == 0) {
        const loser = element;
        loser.querySelector('.player__score').textContent = randomNumberBetween(
          0,
          1,
        );
      }
    });
  });

  return winners;
};

const getRoundWinners = (roundPlayers, groupCount) => {
  const groupedPlayers = groupArrayBy([...roundPlayers.children], groupCount);
  const roundWinners = getWinnersFromGroupedArray(groupedPlayers);

  return roundWinners;
};

const getFinalWinner = (roundPlayers) => {
  if (roundPlayers.childElementCount === 1) {
    const finalWinner = roundPlayers.firstElementChild;
    const winnerName = finalWinner.querySelector('.player__name').textContent;

    finalWinner.classList.add('winner');
    finalWinner.querySelector('.player__name').classList.add('winner');

    finalWinner.querySelector('.player__score').textContent = 'W';

    setTimeout(() => {
      alert(`The winner of this tournament is: ${winnerName}`),
        (nextRoundButton.disabled = true);
      nextRoundButton.classList.add('disabled');
    }, 200);
  }
  return false;
};

const advanceWinnersToNextRound = (
  roundWinners,
  insertNextToThis,
  container,
) => {
  // Append winners to the container
  roundWinners.forEach((winner) => {
    // Appending element to somewhere will move the element
    // Cloning it first, and then moving the cloned element
    // solves the issue
    const clonedWinner = winner.cloneNode(true);
    clonedWinner.querySelector('.player__score').textContent = 0;
    container.appendChild(clonedWinner);
  });

  // Insert container with winners next to specified element
  insertNextToThis.insertAdjacentElement('afterend', container);
};
//

// EVENT LISTENERS

// hover feature start
brackets.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('player')) {
    const name = e.target.firstElementChild.dataset.name;
    const mathcedPlayers = document.querySelectorAll(`[data-name='${name}']`);

    mathcedPlayers.forEach((player) => {
      player.closest('.player').classList.add('active');
      player.classList.add('active');
    });
  }

  if (
    e.target.classList.contains('player__name') ||
    e.target.classList.contains('player__score')
  ) {
    const name = e.target.closest('.player').firstElementChild.dataset.name;
    const mathcedPlayers = document.querySelectorAll(`[data-name='${name}']`);

    mathcedPlayers.forEach((player) => {
      player.closest('.player').classList.add('active');
      player.classList.add('active');
    });
  }
});

brackets.addEventListener('mouseout', (e) => {
  if (e.target.classList.contains('player')) {
    const name = e.target.firstElementChild.dataset.name;
    const mathcedPlayers = document.querySelectorAll(`[data-name='${name}']`);

    mathcedPlayers.forEach((player) => {
      player.closest('.player').classList.remove('active');
      player.classList.remove('active');
    });
  }

  if (
    e.target.classList.contains('player__name') ||
    e.target.classList.contains('player__score')
  ) {
    const name = e.target.closest('.player').firstElementChild.dataset.name;
    const mathcedPlayers = document.querySelectorAll(`[data-name='${name}']`);

    mathcedPlayers.forEach((player) => {
      player.closest('.player').classList.remove('active');
      player.classList.remove('active');
    });
  }
});
// hover feature end

// edit bracket feature start
editBracketButton.addEventListener('click', () => {
  participantForm.classList.remove('hidden');
  editBracketButton.classList.add('hidden');
  brackets.classList.add('hidden');
  nextRoundButton.classList.add('hidden');

  getAllRoundPlayers().forEach((roundPlayers) => {
    roundPlayers.innerHTML = '';
  });

  getAllRoundConnectors().forEach((roundConnectors) => {
    roundConnectors.innerHTML = '';
  });

  getAllRoundLines().forEach((roundLines) => {
    roundLines.innerHTML = '';
  });

  nextRoundButtonState = 1;
  nextRoundButton.disabled = false;
  nextRoundButton.classList.remove('disabled');
});
// edit bracket feature end

// next round feature start
nextRoundButton.addEventListener('click', () => {
  if (nextRoundButtonState === 1) {
    const round1Winners = getRoundWinners(
      selectRoundFromAll(1, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round1Winners,
      selectRoundFromAll(1, getAllRoundLines),
      selectRoundFromAll(2, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(1, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(1, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(1, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(1, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(2, getAllRoundPlayers));
  }

  if (nextRoundButtonState === 2) {
    const round2Winners = getRoundWinners(
      selectRoundFromAll(2, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round2Winners,
      selectRoundFromAll(2, getAllRoundLines),
      selectRoundFromAll(3, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(2, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(2, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(2, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(2, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(3, getAllRoundPlayers));
  }

  if (nextRoundButtonState === 3) {
    const round3Winners = getRoundWinners(
      selectRoundFromAll(3, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round3Winners,
      selectRoundFromAll(3, getAllRoundLines),
      selectRoundFromAll(4, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(3, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(3, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(3, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(3, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(4, getAllRoundPlayers));
  }

  if (nextRoundButtonState === 4) {
    const round4Winners = getRoundWinners(
      selectRoundFromAll(4, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round4Winners,
      selectRoundFromAll(4, getAllRoundLines),
      selectRoundFromAll(5, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(4, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(4, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(4, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(4, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(5, getAllRoundPlayers));
  }

  if (nextRoundButtonState === 5) {
    const round5Winners = getRoundWinners(
      selectRoundFromAll(5, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round5Winners,
      selectRoundFromAll(5, getAllRoundLines),
      selectRoundFromAll(6, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(5, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(5, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(5, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(5, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(6, getAllRoundPlayers));
  }

  if (nextRoundButtonState === 6) {
    const round6Winners = getRoundWinners(
      selectRoundFromAll(6, getAllRoundPlayers),
      playersGroupCount,
    );

    advanceWinnersToNextRound(
      round6Winners,
      selectRoundFromAll(6, getAllRoundLines),
      selectRoundFromAll(7, getAllRoundPlayers),
    );

    populateContainerWithConnectors(
      selectRoundFromAll(6, getAllRoundPlayers).childElementCount / 2,
      selectRoundFromAll(6, getAllRoundConnectors),
    );
    populateContainerWithLines(
      selectRoundFromAll(6, getAllRoundPlayers).childElementCount / 4,
      selectRoundFromAll(6, getAllRoundLines),
    );

    // Reduce the player groupings by half
    playersGroupCount = Math.ceil(playersGroupCount / 2);

    getFinalWinner(selectRoundFromAll(7, getAllRoundPlayers));
  }

  nextRoundButtonState++;
});
// next round feature end

// EVENT LISTENERS

// EXPOSE
export { showBrackets };
//
