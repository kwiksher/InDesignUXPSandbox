const {run, it, describe, expect, skip} = require("./jest-lite/dist/core.js");
//
console.log(__dirname)
const options = {
  projects: [__dirname],
  silent: true,
};

const runCLI = () =>{
  run(options, options.projects)
  .then((success) => {
    console.log(success);
  })
  .catch((failure) => {
    console.error(failure);
  });
}

function sum(x, y) {
  return x + y;
}

describe.skip('sum', () => {
    it('adds the two given numbers', () => {
      expect(sum(2, 2)).toBe(3);
    });

    it.skip('dddadds the two given numbers', () => {
      expect(sum(2, 2)).toBe(4);
    });

});

const importFigma = require("../importFigma.js")
const AddPoints = require("../AddPoints.idjs")

describe('import from figma', () => {

  it.skip('add points', async () => {
    AddPoints.main();
  });


  it.skip('readfile', async () => {
    const ret = await importFigma.readFile();
    console.log(ret)
  });

  it.skip('master spread', () => {
    importFigma.masterSpreads();
  });

  it('addTextFrame', () => {
    importFigma.addTextFrame();
  });

  it('add Text', () => {
    importFigma.addText("Headline!\r");
  });

  it.skip('placeGraphic', () => {
    importFigma.placeGraphic();
  });

  it.skip('import Figma', () => {
    importFigma.importFigma();
  });

});

module.exports = {runCLI}
