[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]

# geojson-area

Calculate the area inside of any [GeoJSON](http://geojson.org/) geometry.

## usage

    npm install @mapbox/geojson-area

## example

```js
var geojsonArea = require('@mapbox/geojson-area');

var area = geojsonArea.geometry(obj);
```

## api

### `geojsonArea.geometry(obj)`

Given a Geometry object, return contained
area as square meters. Invalid input will return `null`.

Adapted from [OpenLayers](http://openlayers.org/)

[npm-image]: https://img.shields.io/npm/v/@mapwhit/geojson-area
[npm-url]: https://npmjs.org/package/@mapwhit/geojson-area

[build-url]: https://github.com/mapwhit/geojson-area/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/mapwhit/geojson-area/check.yaml?branch=main

