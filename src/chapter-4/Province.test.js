import {Province} from './Province.js';
import {sampleProvinceData} from './sampleProvicneData.js';

describe(`Province`, () => {
  it(`calculates shortfall`, () => {
    const result = new Province(sampleProvinceData()).shortfall;
    expect(result).toBe(5);
  });
});
