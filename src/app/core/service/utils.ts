const utils = {

  parseServerModelState: (modelState) => {
    const errors = [];
    for (const key in modelState) {
      if (modelState.hasOwnProperty(key)) {
        errors.push({ field: key, message: modelState[key]});
      }
    }
    return errors;
  }
};

export default utils;
