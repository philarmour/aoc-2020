import fs from 'fs';
import path, { dirname } from 'path';

const batch = fs.readFileSync(path.resolve('q4/input1.txt'), 'utf8');
const entries = batch.split('\n\n');

const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];
const requiredKeysHacked = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const validate = (entry) => {
  const tokens = entry.split(/[\s\n]+/);
  const keys = tokens.map((i) => i.replace(/\:.*/, ''));

  const missedKeys = requiredKeysHacked.filter((i) => !keys.includes(i));
  // console.log(missedKeys);
  return missedKeys.length == 0;
};

const validEntries = entries.filter(validate);
console.log(`count of valid (hacked) entries ${validEntries.length}`);

const validateYear = (keyVal, min, max) => {
  try {
    return keyVal.length == 4 && +keyVal >= min && +keyVal <= max;
  } catch (err) {
    return false;
  }
};

const validateBYR = (keyVal) => {
  // four digits; at least 1920 and at most 2002.
  return validateYear(keyVal, 1920, 2002);
};

const validateIYR = (keyVal) => {
  // four digits; at least 2010 and at most 2020.
  return validateYear(keyVal, 2010, 2020);
};

const validateEYR = (keyVal) => {
  // four digits; at least 2020 and at most 2030.
  return validateYear(keyVal, 2020, 2030);
};

const validateHGT = (keyVal) => {
  /**
   * a number followed by either cm or in:
   * If cm, the number must be at least 150 and at most 193.
   * If in, the number must be at least 59 and at most 76.
   */
  try {
    const units = keyVal.slice(-2);
    const val = keyVal.slice(0, -2);
    // console.log(`validating hgt: ${val} and ${units}`);
    if ('cm' === units) return +val >= 150 && +val <= 193;
    else if ('in' === units) return +val >= 59 && +val <= 76;
    else return false;
  } catch (err) {
    return false;
  }
};

const validateHCL = (val) => {
  try {
    // a # followed by exactly six characters 0-9 or a-f.
    return val == val.match(/#[0-9,a-f]{6}/);
  } catch (err) {
    return false;
  }
};

const validateECL = (val) => {
  try {
    // exactly one of: amb blu brn gry grn hzl oth.
    return val == val.match(/amb|blu|brn|gry|grn|hzl|oth/);
  } catch (err) {
    return false;
  }
};

const validatePID = (val) => {
  try {
    // a nine-digit number, including leading zeroes.
    return val == val.match(/[0-9]{9}/);
  } catch (err) {
    return false;
  }
};
const dataValidation = (pair) => {
  // console.log(`called data validation with ${pair[0]} and ${pair[1]}`);
  const keyName = pair[0];
  const keyVal = pair[1];
  switch (keyName) {
    case 'byr':
      return validateBYR(keyVal);
    case 'iyr':
      return validateIYR(keyVal);
    case 'eyr':
      return validateEYR(keyVal);
    case 'hgt':
      return validateHGT(keyVal);
    case 'hcl':
      return validateHCL(keyVal);
    case 'ecl':
      return validateECL(keyVal);
    case 'pid':
      return validatePID(keyVal);
    default:
      // extra keys will get skipped!
      return true;
  }
};

const reValidate = (entry) => {
  const tokens = entry.split(/[\s\n]+/);
  const keysOnly = tokens.map((i) => i.replace(/\:.*/, ''));
  const keyVals = tokens.map((i) => i.split(/\:/));

  const missedKeys = requiredKeysHacked.filter((i) => !keysOnly.includes(i));

  if (missedKeys.length == 0) {
    // so far so good...
    // console.log(keyVals);
    const errors = keyVals.map(dataValidation).filter((i) => !i);
    // only true if there's no errors
    return errors.length == 0;
  }
  return false;
};

const runTests = () => {
  const testVals = ['iyr', '2020'];
  console.log(`test data validation: ${dataValidation(testVals)}`);

  const testPID = '000456789';
  console.log(`test PID validation: ${validatePID(testPID)}`);

  const testECL = 'hzl ';
  console.log(`test ECL validation: ${validateECL(testECL)}`);

  const testHCL = '#123abc2';
  console.log(`test HCL validation: ${validateHCL(testHCL)}`);
};

// runTests();

const reValidateEntries = entries.filter(reValidate);
console.log(
  `count of data-validated (hacked) entries ${reValidateEntries.length}`
);
