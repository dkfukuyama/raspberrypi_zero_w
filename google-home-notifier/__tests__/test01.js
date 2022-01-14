const expectExport = require('expect');

test('test 1.', ()=>{
  expect(1+2).toBe(3);
});

test('test 2', () => {
  const qf = require('../quiz_lib');
  let s;
  s = qf.getExistingFileNames('りか', './__tests__/__testdata__/01');
  expect(s).toEqual([]);
  s = qf.getExistingFileNames('れいな', './__tests__/__testdata__/01');
  expect(s).toEqual([]);
  s = qf.getExistingFileNames('まさのり', './__tests__/__testdata__/01');
  expect(s).toEqual([]);
});

test('test 3', () => {
  const qf = require('../quiz_lib');
  let s;
  s = qf.getExistingFileNames('りか', './__tests__/__testdata__/02');
  expect(s).toEqual(['05_rika.json', '06_rika.json', '07_rika.json']);
  s = qf.getExistingFileNames('れいな', './__tests__/__testdata__/02');
  expect(s).toEqual(['08_reina.json']);
  s = qf.getExistingFileNames('まさのり', './__tests__/__testdata__/02');
  expect(s).toEqual(['01_masa.json', '09_masa.json']);
});

test('test 4', () => {
  const qf = require('../quiz_lib');
  let s;
  for(let i=0; i<10; i++){
    s = qf.createWriteFilePath('りか', './__tests__/__testdata__/03');
    expect(s).toMatch(/\d{2}_(rika|reina|masa)\.json/);
    expect([s])
      .toEqual(
      expect.not.arrayContaining(['00_rika.json', '01_rika.json', '02_rika.json', '03_rika.json', '04_rika.json', '09_rika.json']));
    s = qf.createWriteFilePath('れいな', './__tests__/__testdata__/03');
    expect(s).toMatch(/\d{2}_(rika|reina|masa)\.json/);
    expect([s])
      .toEqual(
      expect.not.arrayContaining(['00_reina.json','01_reina.json','02_reina.json','03_reina.json','04_reina.json','05_reina.json','06_reina.json','07_reina.json','09_reina.json']));
    s = qf.createWriteFilePath('まさのり', './__tests__/__testdata__/03');
    expect(s).toMatch(/\d{2}_(rika|reina|masa)\.json/);
    expect([s])
      .toEqual(
      expect.not.arrayContaining(['00_masa.json', '03_masa.json', '04_masa.json', '05_masa.json', '06_masa.json', '07_masa.json', '08_masa.json']));
  }
});

test('test 5 rika', () => {
  const qf = require('../quiz_lib');
  let s;
  s = qf.getExistingFileNamesToJsonString('りか', './__tests__/__testdata__/03');
});

test('test 5 reina', () => {
  const qf = require('../quiz_lib');
  let s;
  s = qf.getExistingFileNamesToJsonString('れいな', './__tests__/__testdata__/03');
});

test('test 5 masa', () => {
  const qf = require('../quiz_lib');
  let s;
  s = qf.getExistingFileNamesToJsonString('まさのり', './__tests__/__testdata__/03');
});
