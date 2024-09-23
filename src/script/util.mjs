const matchData = (str, reg, isMulti = false) => {
  let result = '';
  const matchResult = str.match(reg);
  if (matchResult && matchResult.length) {
    result = isMulti ? matchResult : matchResult[0];
  }
  return result
}

export { matchData }