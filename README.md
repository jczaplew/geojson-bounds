# geojson-bounds
Dependency-free methods for extracting the extent, envelope, minimum latitude, minimum longitude, maximum latitude, and maximum longitude
from a valid GeoJSON representation.

Designed to follow PostGIS's conventions for these operations as much as possible.

## Install
````
npm install geojson-bounds
````

## Example usage
````
var st = require('geojson-bounds');

var shape = { "type": "Polygon",
  "coordinates": [
    [ [100.1, 0.1], [101.0, 0.1], [101.0, 1.0], [100.1, 1.0], [100.1, 0.1] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
  ]
}

st.extent(shape)
// => [ 100.1, 0.1, 101, 1 ]

st.envelope(shape)
// => {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[100.1,0.1],[100.1,1],[101,1],[101,0.1],[100.1,0.1]]]}}

st.xMin(shape)
// => 100.1

st.xMax(shape)
// => 101

st.yMin(shape)
// => 0.1

st.yMax(shape)
// => 1
````


## API

### .extent(*geojson*)
Returns an array of coordinates in the order [*West*, *South*, *East*, *North*] that represents the
extent of the provided feature or geometry.


### .envelope(*geojson*)
Returns a GeoJSON `Feature` polygon that repesents the bounding box of the provided feature or geometry.

### .xMin(*geojson*)
Returns the western-most longitude of the provided feature or geometry.

### .xMax(*geojson*)
Returns the eastern-most longitude of the provided feature or geometry.

### .yMin(*geojson*)
Returns the southern-most latitude of the provided feature or geometry.

### .yMax(*geojson*)
Returns the northern-most latitude of the provided feature or geometry.



## Licenese
CC-BY-4.0 for all code unique to this repository
