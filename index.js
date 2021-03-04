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
    // fix JavaScript engine's argument length limit. 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    let max = -Infinity;
    let QUANTUM = 32768;
    for (let i = 0, len = coords.length; i < len; i += QUANTUM) {
        let sliceCoords = coords.slice(i, Math.min(i + QUANTUM, len));
        let submax = Math.max.apply(null, sliceCoords.map(function (d) { return d[1]; }));
        max = Math.max(submax, max);
    }
    return max;
  }

  function maxLng(coords) {
    let max = -Infinity;
    let QUANTUM = 32768;
    for (let i = 0, len = coords.length; i < len; i += QUANTUM) {
        let sliceCoords = coords.slice(i, Math.min(i + QUANTUM, len));
        let submax = Math.max.apply(null, sliceCoords.map(function (d) { return d[0]; }));
        max = Math.max(submax, max);
    }
    return max;
  }

  function minLat(coords) {
    let min = Infinity;
    let QUANTUM = 32768;
    for (let i = 0, len = coords.length; i < len; i += QUANTUM) {
        let sliceCoords = coords.slice(i, Math.min(i + QUANTUM, len));
        let submin = Math.min.apply(null, sliceCoords.map(function (d) { return d[1]; }));
        min = Math.min(submin, min);
    }
    return min;
  }

  function minLng(coords) {
    let min = Infinity;
    let QUANTUM = 32768;
    for (let i = 0, len = coords.length; i < len; i += QUANTUM) {
        let sliceCoords = coords.slice(i, Math.min(i + QUANTUM, len));
        let submin = Math.min.apply(null, sliceCoords.map(function (d) { return d[0]; }));
        min = Math.min(submin, min);
    }
    return min;
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

  // Adapted from http://stackoverflow.com/questions/2792443/finding-the-centroid-of-a-polygon
  function fetchCentroid(vertices) {
    var centroid = {
      x: 0,
      y: 0
    }
    
    var signedArea = 0;
    var x0 = 0;
    var y0 = 0;
    var x1 = 0;
    var y1 = 0;
    var a = 0;

    for (var i = 0; i < vertices.length - 1; i++) {
      x0 = vertices[i][0];
      y0 = vertices[i][1];
      x1 = vertices[i + 1][0];
      y1 = vertices[i + 1][1];
      a = (x0 * y1) - (x1 * y0);

      signedArea += a;
      centroid.x += (x0 + x1) * a;
      centroid.y += (y0 + y1) * a;
    }

    x0 = vertices[vertices.length - 1][0];
    y0 = vertices[vertices.length - 1][1];
    x1 = vertices[0][0];
    y1 = vertices[0][1];
    a = (x0 * y1) - (x1 * y0);
    signedArea += a;
    centroid.x += (x0 + x1) * a;
    centroid.y += (y0 + y1) * a;

    signedArea = signedArea * 0.5;
    centroid.x = centroid.x / (6.0*signedArea);
    centroid.y = centroid.y / (6.0*signedArea);

    return [centroid.x, centroid.y];
  }

  function feature(obj) {
    switch (obj.geometry.type) {
      case "GeometryCollection":
        return geometryCollection(obj.geometry)
      case "FeatureCollection":
        return featureCollection(obj.geometry)
      default:
        return flatten(obj.geometry.coordinates)
    }
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

  function centroid(t) {
    return fetchCentroid(process(t));
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
    "centroid": centroid,
    "xMin": xMin,
    "xMax": xMax,
    "yMin": yMin,
    "yMax": yMax
  }

}());
