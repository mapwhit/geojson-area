const wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry({ type, coordinates, geometries }) {
  switch (type) {
    case 'Polygon':
      return polygonArea(coordinates);
    case 'MultiPolygon':
      return coordinates.reduce((area, p) => area + polygonArea(p), 0);
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
      return 0;
    case 'GeometryCollection':
      return geometries.reduce((area, g) => area + geometry(g), 0);
  }
}

function polygonArea(coords) {
  let area = 0;
  if (coords?.length > 0) {
    area += Math.abs(ringArea(coords[0]));
    for (let i = 1; i < coords.length; i++) {
      area -= Math.abs(ringArea(coords[i]));
    }
  }
  return area;
}

/**
 * Calculate the approximate area of the polygon were it projected onto
 *     the earth.  Note that this area will be positive if ring is oriented
 *     clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * Returns:
 * {float} The approximate signed geodesic area of the polygon in square
 *     meters.
 */

const RADIUS_SQR = wgs84.RADIUS ** 2;

function ringArea(coords) {
  // it's a ring - ignore the last one
  const len = coords.length - 1;

  if (len < 3) {
    return 0;
  }

  let total = 0;

  // start from [len - 2, len - 1, 0]
  let l_x = rad(coords[len - 2][0]);
  const m = coords[len - 1];
  let m_x = rad(m[0]);
  let m_y = rad(m[1]);
  let u_x = 0;

  for (let i = 0; ; i++) {
    const c = coords[i];
    u_x = rad(c[0]);

    total += (u_x - l_x) * Math.sin(m_y);

    if (i === len - 1) break;

    l_x = m_x;
    m_x = u_x;
    m_y = rad(c[1]);
  }

  return (total * RADIUS_SQR) / 2;
}

function rad(n) {
  return (n * Math.PI) / 180;
}
