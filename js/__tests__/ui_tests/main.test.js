import $ from 'jquery';
import {
  numberPattern,
  validateInputWithPattern,
  validInputAndButton,
  invalidInputAndButton,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from '../../main.js';

import { addClassTo } from '../../utils/addClassTo.js';

describe('main.js', () => {
  document.body.innerHTML = `
      <input
        id="participant-input"
        class="form__input"
        type="text"
        placeholder="2"
      />
      <div class="constraints">
        <h4 class="min">min: <span>2</span></h4>
        <h4 class="max">max: <span>50</span></h4>
      </div>
      <button
        disabled
        id="submit-btn"
        type="submit"
        class="btn submit__btn disabled"
      >
        Generate
      </button>
    `;

  const participantInput = $('#participant-input')[0];

  const minConstraintElement = $('.min')[0];
  const maxConstraintElement = $('.min')[0];

  const minConstraintValue = $('.min span')[0];
  const maxConstraintValue = $('.max span')[0];

  const submitBtn = $('#submit-btn')[0];

  const testInput = (input) => {
    participantInput.value = input;

    const inputResult = validateInputWithPattern(
      participantInput.value,
      numberPattern,
    );

    if (!inputResult.valid) {
      invalidInputAndButton(participantInput, submitBtn);
    } else {
      validInputAndButton(participantInput, submitBtn);
    }

    return inputResult;
  };

  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');

  it('add class "danger" to input if the input is invalid', () => {
    testInput(100);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('danger')).toBe(true);

    testInput(1);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('danger')).toBe(true);

    testInput(2);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('danger')).toBe(false);

    testInput(30);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('danger')).toBe(false);
  });

  it('add class "success" to input if the input is valid', () => {
    testInput(300);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('success')).toBe(false);

    testInput(-5);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('success')).toBe(false);

    testInput(2);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('success')).toBe(true);

    testInput(50);
    expect(document.body).toMatchSnapshot();
    expect(participantInput.classList.contains('success')).toBe(true);
  });

  it('min/max constraint values are matched to MIN/MAX constants', () => {
    expect(minConstraintValue.textContent).toBe(String(MIN_PARTICIPANTS));
    expect(maxConstraintValue.textContent).toBe(String(MAX_PARTICIPANTS));
  });

  it(`
      add class "apply-shake" to min constriant 
      element if input is below MIN constant, and
      remove it after n second(s)
    `, () => {
    const inputResult1 = testInput(1);

    if (inputResult1.error === 'min') {
      const removeAfterSecond = addClassTo('apply-shake', minConstraintElement);
      removeAfterSecond(1);
    }

    expect(minConstraintElement.classList.contains('apply-shake')).toBe(true);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    const inputResult2 = testInput(-5);

    if (inputResult2.error === 'min') {
      const removeAfterSecond = addClassTo('apply-shake', minConstraintElement);
      removeAfterSecond(5);
    }
    expect(minConstraintElement.classList.contains('apply-shake')).toBe(true);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    expect(document.body).toMatchSnapshot();
  });

  it(`
      add class "apply-shake" to max constriant 
      element if input is higher than MAX constant, and
      remove it after n second(s)
    `, () => {
    const inputResult1 = testInput(69);

    if (inputResult1.error === 'max') {
      const removeAfterSecond = addClassTo('apply-shake', maxConstraintElement);
      removeAfterSecond(1);
    }
    expect(maxConstraintElement.classList.contains('apply-shake')).toBe(true);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    const inputResult2 = testInput(1000);

    if (inputResult2.error === 'max') {
      const removeAfterSecond = addClassTo('apply-shake', maxConstraintElement);
      removeAfterSecond(3);
    }
    expect(maxConstraintElement.classList.contains('apply-shake')).toBe(true);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);

    expect(document.body).toMatchSnapshot();
  });

  it('button is disabled unless the input is valid', () => {
    testInput(100);
    expect(document.body).toMatchSnapshot();
    expect(submitBtn.disabled).toBe(true);

    testInput(1);
    expect(document.body).toMatchSnapshot();
    expect(submitBtn.disabled).toBe(true);

    testInput(2);
    expect(document.body).toMatchSnapshot();
    expect(submitBtn.disabled).toBe(false);

    testInput(30);
    expect(document.body).toMatchSnapshot();
    expect(submitBtn.disabled).toBe(false);
  });
});
