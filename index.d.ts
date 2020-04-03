declare module 'geojson-bounds' {

  import geojson from 'geojson';

	/**
 	* Returns an array of coordinates in the order [West, South, East, North] that represents the extent of the provided feature or geometry
 	*/
  export function extent(geojson: geojson.GeoJSON): [number, number, number, number];

	/**
 	* Returns a GeoJSON Feature polygon that repesents the bounding box of the provided feature or geometry
 	*/
  export function envelope(geojson: geojson.GeoJSON): geojson.Feature<geojson.Polygon>

	/**
 	* Returns the western-most longitude of the provided feature or geometry
 	*/
  export function xMin(geojson: geojson.GeoJSON): number;

	/**
 	* Returns the eastern-most longitude of the provided feature or geometry
 	*/
  export function xMax(geojson: geojson.GeoJSON): number;

	/**
 	* Returns the southern-most latitude of the provided feature or geometry
 	*/
  export function yMin(geojson: geojson.GeoJSON): number;

	/**
 	* Returns the northern-most latitude of the provided feature or geometry
 	*/
  export function yMax(geojson: geojson.GeoJSON): number;

}