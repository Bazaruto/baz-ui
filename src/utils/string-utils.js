export function toSentence(array, separator=', ', lastSeparator=' and ') {
  const newArr = array.slice();
  const lastMember = newArr.pop();
  return newArr.length
    ? newArr.join(separator) + lastSeparator + lastMember
    : lastMember;
}
