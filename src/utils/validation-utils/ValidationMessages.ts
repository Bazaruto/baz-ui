const ValidationMessages: Record<string, string> = {
  isPresent: 'This is required',
  isNotEmpty: 'This is required',
  isRequired: 'This is required',
  isNumeric: 'This must be a number',
  isNotZero: 'This should be non-zero',
  isNotNegative: 'This should be zero or more',
  isGreaterThanZero: 'This should be greater than zero',
  isEmail: 'A valid email is required',
  isUrl: 'A valid URL is required',
};

export default ValidationMessages;
