(function() {
  /*
   Modified version of underscore.js's flatten function
   https://github.com/jashkenas/underscore/blob/master/underscore.js#L501
  */
  function flatten(input, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0; i < input.length; i++) {
      if (Array.isArray(input[i]) && Array.isArray(input[i][0])) {
        flatten(input[i], output);
        idx = output.length;
      } else {
        output[idx++] = input[i];
      }
    }
    return (Array.isArray(output[0])) ? output : [output];
  };

  function maxLat(coords) {
    return Math.max.apply(null, coords.map(function(d) { return d[1]; }));
  }

  function maxLng(coords) {
    return Math.max.apply(null, coords.map(function(d) { return d[0]; }));
  }

  function minLat(coords) {
    return Math.min.apply(null, coords.map(function(d) { return d[1]; }));
  }

  function minLng(coords) {
    return Math.min.apply(null, coords.map(function(d) { return d[0]; }));
  }

  function fetchEnvelope(coords) {
    var mmc = {
      "minLng": minLng(coords),
      "minLat": minLat(coords),
      "maxLng": maxLng(coords),
      "maxLat": maxLat(coords)
    }

    return {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [mmc.minLng, mmc.minLat],
          [mmc.minLng, mmc.maxLat],
          [mmc.maxLng, mmc.maxLat],
          [mmc.maxLng, mmc.minLat],
          [mmc.minLng, mmc.minLat]
        ]]
      }
    }
  }

  function fetchExtent(coords) {
    return [
      minLng(coords),
      minLat(coords),
      maxLng(coords),
      maxLat(coords)
    ]
  }

  function feature(obj) {
    return flatten(obj.geometry.coordinates);
  }

  function featureCollection(f) {
    return flatten(f.features.map(feature));
  }

  function geometryCollection(g) {
    return flatten(g.geometries.map(process));
  }

  function process(t) {
    if (!t) {
      return [];
    }

    switch (t.type) {
      case "Feature":
        return feature(t);
      case "GeometryCollection":
        return geometryCollection(t);
      case "FeatureCollection":
        return featureCollection(t);
      case "Point":
      case "LineString":
      case "Polygon":
      case "MultiPoint":
      case "MultiPolygon":
      case "MultiLineString":
        return flatten(t.coordinates);
      default:
        return [];
    }
  }

  function envelope(t) {
    return fetchEnvelope(process(t));
  }

  function extent(t) {
    return fetchExtent(process(t));
  }

  function xMin(t) {
    return minLng(process(t));
  }
  function xMax(t) {
    return maxLng(process(t));
  }
  function yMin(t) {
    return minLat(process(t));
  }
  function yMax(t) {
    return maxLat(process(t));
  }

  module.exports = {
    "envelope": envelope,
    "extent": extent,
    "xMin": xMin,
    "xMax": xMax,
    "yMin": yMin,
    "yMax": yMax
  }

}());
