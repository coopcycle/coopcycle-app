export const isMandatoryOption = option => {
  return option ? !option.additional : false;
};

export const isAdditionalOption = option => {
  return option ? option.additional : false;
};

export function parseOptionValuesRange(valuesRange) {
  const matches = valuesRange.match(/^(\[|\()([0-9]{1,}),([0-9]*)(\]|\))$/);

  return [
    parseInt(matches[2], 10),
    matches[3] === '' ? Infinity : parseInt(matches[3], 10),
  ];
}

export function getPriceForOptionValue(optionValue) {
  return optionValue.offers?.price ?? 0;
}
