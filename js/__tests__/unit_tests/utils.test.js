import { 
  regexPattern, 
  groupArrayBy, 
  hasDuplicate 
} from '../../utils/index.js';

describe('Utility functions', () => {
  it('regexPattern() is working correctly', () => {
    expect(regexPattern.number).toEqual(/^[0-9]*$/);
    expect(regexPattern.letter).toEqual(/[A-Za-z]/);
  });

  it('groupArrayBy() is working correctly', () => {
    const array = ['hey', 'jude', "don't", 'make', 'it', 'bad'];

    const groupedArray2 = groupArrayBy(array, array.length / 2);
    expect(groupedArray2).toEqual([
      ['hey', 'jude'],
      ["don't", 'make'],
      ['it', 'bad'],
    ]);
  });

  it('hasDuplicate() is working correctly', () => {
    const array1 = ['John', 'Paul', 'George', 'Ringo'];
    const array2 = ['John', 'John', 'George', 'Ringo'];

    expect(hasDuplicate(array1)).toBe(false);
    expect(hasDuplicate(array2)).toBe(true);
  });
});
