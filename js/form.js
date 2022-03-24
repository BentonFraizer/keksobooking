import { TYPE_OF_PLACEMENT } from './mock-data.js';
//Валидация с помощью библиотеки PristineJS
const adForm = document.querySelector('.ad-form');

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  successClass: 'ad-form__element--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

//Валидация поля title на количество введённых символов
const validateTitleLength = (value) => {
  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;
  return value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH;
};
pristine.addValidator(adForm.querySelector('#title'), validateTitleLength, 'От 30 до 100 символов');

//Валидация поля price на максимальное значение
const priceField = adForm.querySelector('#price');
const MAX_PRICE_VALUE = 100000;
const validatePriceField = (value) => {
  if (value <= MAX_PRICE_VALUE && value >= priceField.dataset.pristineMin){
    return true;
  }
};

const getPriceFieldErrorMessage = () => {
  if (priceField.dataset.pristineMin >= priceField.value) {
    return `Минимальная цена ${priceField.placeholder}`;
  } else if (priceField.value > MAX_PRICE_VALUE) {
    return `Максимальная цена ${MAX_PRICE_VALUE}`;
  }
};
pristine.addValidator(priceField, validatePriceField, getPriceFieldErrorMessage);

//"Синхронизация" полей room_number и capacity
const roomNumberField = adForm.querySelector('[name="rooms"]');
const capacityOfGuestsField = adForm.querySelector('[name="capacity"]');
const amountOfGuestsOption = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0']
};
//Функция валидации поля capacity
const validateCapacityOfGuests = () => amountOfGuestsOption[roomNumberField.value].includes(capacityOfGuestsField.value);
//Функция вывода сообщения об ошибке
const getCapacityOfGuestsErrorMessage = () => 'Недопустимое значение';
pristine.addValidator(capacityOfGuestsField, validateCapacityOfGuests, getCapacityOfGuestsErrorMessage);

//Валидация полей type и price
const PRICES_OF_PLACEMENT = [
  10000,
  1000,
  5000,
  0,
  3000
];
//Функция для валидации поля price в зависимости от значения поля type
const typePlacementField = adForm.querySelector('#type');
const getMinPriceValue = () => {
  PRICES_OF_PLACEMENT.forEach((element, i) => {
    if (TYPE_OF_PLACEMENT[i] === typePlacementField.value) {
      priceField.placeholder = element;
      priceField.dataset.pristineMin = element;
    }
  });
  return true;
};
pristine.addValidator(typePlacementField, getMinPriceValue);

//"Синхронизация" полей timein и timeout
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');

const onTimeChange = (evt) => {
  timeIn.value = evt.target.value;
  timeOut.value = evt.target.value;
};
timeIn.addEventListener('change', onTimeChange);
timeOut.addEventListener('change', onTimeChange);

const validateAdForm = () => {
  adForm.addEventListener('submit', (evt) => {
    if(!pristine.validate()) {
      evt.preventDefault();
    }
  });
};

//Изменение состояния страницы (Активное/Неактивное)
const activatePage = (activate) => {
  const mapForm = document.querySelector('.map__filters');
  const mapFormSelectFields = mapForm.querySelectorAll('select');
  const mapFormFieldsetField = mapForm.querySelector('fieldset');
  const adFormFieldsetFields = adForm.querySelectorAll('fieldset');

  if (activate) {
    adForm.classList.remove('ad-form--disabled');
    mapForm.classList.remove('map__filters--disabled');
    for (let i = 0; i < adFormFieldsetFields.length; i++) {
      adFormFieldsetFields[i].removeAttribute('disabled');
    }

    for (let i = 0; i < mapFormSelectFields.length; i++) {
      mapFormSelectFields[i].removeAttribute('disabled');
    }

    mapFormFieldsetField.removeAttribute('disabled');
  } else {
    adForm.classList.add('ad-form--disabled');
    mapForm.classList.add('map__filters--disabled');
    for (let i = 0; i < adFormFieldsetFields.length; i++) {
      adFormFieldsetFields[i].setAttribute('disabled', '');
    }

    for (let i = 0; i < mapFormSelectFields.length; i++) {
      mapFormSelectFields[i].setAttribute('disabled', '');
    }

    mapFormFieldsetField.setAttribute('disabled', '');
  }
};

export { validateAdForm, activatePage };
