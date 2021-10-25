import { 
  createPlayerElement,
  getUniqueNames,
} from "../../brackets.js";

import { hasDuplicate } from '../../utils/index.js';

describe('brackets.js unit tests', () => {
  it('createPlayerElement() returns the correct element', () => {
    const expectedElement = createPlayerElement({name: 'Test User', score: 0});

    expect(expectedElement.classList.contains('player')).toBe(true);
    expect(expectedElement.firstElementChild.dataset.name).toBe("Test User");
    expect(expectedElement.firstElementChild.textContent).toBe("Test User");

    expect(expectedElement.lastElementChild.textContent).toBe("0");
  });

  it("getUniqueNames() size matches the count", () => {
    expect(getUniqueNames(50).size).toBe(50);
  });

  it("no repeating names in getUniqueNames() return", () => {
    expect(hasDuplicate([...getUniqueNames(50)])).toBe(false);
  });
});