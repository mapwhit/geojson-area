const assert = require('node:assert/strict');
const test = require('node:test');

const gjArea = require('../');
const ill = require('./illinois.json');
const all = require('./all.json');

test('geojson area', async t => {
  await t.test('computes the area of illinois', () => {
    // 145978332359.36746 - round to 1/1000th part for comparison
    assert.equal(Math.round(1000 * gjArea.geometry(ill)), 145978332359367);
  });

  // http://www.wolframalpha.com/input/?i=surface+area+of+earth
  await t.test('computes the area of the world', () => {
    assert.equal(gjArea.geometry(all), 511207893395811);
  });

  await t.test('point has zero area', () => {
    assert.equal(gjArea.geometry({ type: 'Point', coordinates: [0, 0] }), 0);
  });

  await t.test('linestring has zero area', () => {
    assert.equal(
      gjArea.geometry({
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }),
      0
    );
  });

  await t.test('geometrycollection is the sum', () => {
    assert.equal(
      gjArea.geometry({ type: 'GeometryCollection', geometries: [all, ill] }),
      511353871728170.4
    );
  });
});
