import test from 'node:test';

import { geometry } from '../index.js';
import all from './all.json' with { type: 'json' };
import ill from './illinois.json' with { type: 'json' };

test('geojson area', async t => {
  await t.test('computes the area of illinois', t => {
    // 145978332359.36746 - round to 1/1000th part for comparison
    t.assert.equal(Math.round(1000 * geometry(ill)), 145978332359367);
  });

  // http://www.wolframalpha.com/input/?i=surface+area+of+earth
  await t.test('computes the area of the world', t => {
    t.assert.equal(geometry(all), 511207893395811);
  });

  await t.test('point has zero area', t => {
    t.assert.equal(geometry({ type: 'Point', coordinates: [0, 0] }), 0);
  });

  await t.test('linestring has zero area', t => {
    t.assert.equal(
      geometry({
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }),
      0
    );
  });

  await t.test('geometrycollection is the sum', t => {
    t.assert.equal(
      geometry({ type: 'GeometryCollection', geometries: [all, ill] }),
      511353871728170.4
    );
  });
});
