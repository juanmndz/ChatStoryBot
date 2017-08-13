const JSON = require('circular-json');
var cacheset;
const getData = ({ cache, firstStep, steps }, callback) => {
  const currentStep = firstStep;
  const renderedSteps = [steps[currentStep.id]];
  const previousSteps = [steps[currentStep.id]];
  const previousStep = {};
  cacheset = cache;
  if (cache && localStorage.getItem(cache)) {
    const data = JSON.parse(localStorage.getItem(cache));
    const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

    if (lastStep && lastStep.end) {
      localStorage.removeItem(cache);
    } else {
      for (let i = 0; i < data.renderedSteps.length; i += 1) {
        // remove delay of cached rendered steps
        data.renderedSteps[i].delay = 0;
        // flag used to avoid call triggerNextStep in cached rendered steps
        data.renderedSteps[i].rendered = true;

        // an error is thrown when render a component from localStorage.
        // So it's necessary reassing the component
        if (data.renderedSteps[i].component) {
          const id = data.renderedSteps[i].id;
          data.renderedSteps[i].component = steps[id].component;
        }
      }

      // execute callback function to enable input if last step is
      // waiting user type
      if (data.currentStep.user) {
        callback();
      }

      return data;
    }
  }

  return {
    currentStep,
    previousStep,
    previousSteps,
    renderedSteps,
  };
};

const setData = (data) => {
  localStorage.setItem(cacheset, JSON.stringify(data));
};

export {
  getData,
  setData,
};
