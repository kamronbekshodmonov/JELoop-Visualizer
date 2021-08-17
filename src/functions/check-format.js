function checkFormat(JSHINT, value) {
  let success = JSHINT(value);

  if (!success) {
    return success;
  }

  return success;
}

export default checkFormat;
