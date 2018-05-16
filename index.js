var wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry(_) {
    var area = 0, i;
    switch (_.type) {
        case 'Polygon':
            return polygonArea(_.coordinates);
        case 'MultiPolygon':
            for (i = 0; i < _.coordinates.length; i++) {
                area += polygonArea(_.coordinates[i]);
            }
            return area;
        case 'Point':
        case 'MultiPoint':
        case 'LineString':
        case 'MultiLineString':
            return 0;
        case 'GeometryCollection':
            for (i = 0; i < _.geometries.length; i++) {
                area += geometry(_.geometries[i]);
            }
            return area;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
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

function ringArea(coords) {
    // it's a ring - ignore the last one
    const len = coords.length - 1;

    if (len < 3) {
        return 0;
    }

    let total = 0;

    // start from [len - 2, len - 1, 0]
    let l_x = rad(coords[len - 2][0]), l_y = rad(coords[len - 2][1]);
    let m_x = rad(coords[len - 1][0]), m_y = rad(coords[len - 1][1]);
    let u_x = 0, u_y = 0;

    for (let i = 0; i < len; i++) {
        u_x = rad(coords[i][0]); u_y = rad(coords[i][1]);

        total += ( u_x - l_x ) * Math.sin(m_y);

        l_x = m_x; l_y = m_y;
        m_x = u_x; m_y = u_y;
    }

    return total * wgs84.RADIUS * wgs84.RADIUS / 2;
}

function rad(_) {
    return _ * Math.PI / 180;
}
