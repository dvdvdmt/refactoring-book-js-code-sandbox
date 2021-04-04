import {Province} from './Province.js';
import {sampleProvinceData} from './sampleProvicneData.js';

describe(`Province`, () => {
  let asia;

  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });

  it(`shortfall`, () => {
    expect(asia.shortfall).toBe(5);
  });

  it(`profit`, () => {
    expect(asia.profit).toBe(230);
  });
});
