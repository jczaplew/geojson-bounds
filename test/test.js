var assert = require("assert");
var should = require("should");
var geojsonhint = require("@mapbox/geojsonhint");
var st = require("../index");
var shapes = require("./shapes");

// For exach test geometry, get envelope, extent, xMin, xMax, yMin, and yMax
var geometries = Object.keys(shapes);

geometries.forEach(function(shape) {
  describe(shape + " - envelope", function() {
    it("should return an envelope or nothing", function(done) {
      try {
        var result = st.envelope(shapes[shape]);
        var errors = geojsonhint.hint(JSON.stringify(result));
        if (errors.length && shape.substr(0, 5) != "baddy") {
          throw new Error("Invalid GeoJSON returned", JSON.stringify(result));
        } else {
          done();
        }
      } catch(e) {
        if (shape.substr(0, 5) != "baddy") {
          throw new Error("Could not get envelope " +  JSON.stringify(result));
        }
        done();
      }
    });
  });

  describe(shape + " - extent", function() {
    it("should return an extent or nothing", function(done) {
      var result = st.extent(shapes[shape]);

      if (result.length != 4 && shape.substr(0,5) != "baddy") {
        throw new Error("Bad extent returned");
      }
      done();
    });
  });

  describe(shape + " - xMin", function() {
    it("should return a minimum longitude or nothing", function(done) {
      var result = st.xMin(shapes[shape]);

      if (!result && shape.substr(0,5) != "baddy") {
        throw new Error("Bad minimum longitude returned");
      }
      done();
    });
  });

  describe(shape + " - xMax", function() {
    it("should return a maximum longitude or nothing", function(done) {
      var result = st.xMax(shapes[shape]);

      if (!result && shape.substr(0,5) != "baddy") {
        throw new Error("Bad maximum longitude returned");
      }
      done();
    });
  });

  describe(shape + " - yMin", function() {
    it("should return a minimum latitude or nothing", function(done) {
      var result = st.yMin(shapes[shape]);

      if (!result && shape.substr(0,5) != "baddy") {
        throw new Error("Bad minimum latitude returned " + result);
      }
      done();
    });
  });

  describe(shape + " - yMax", function() {
    it("should return a maximum latitude or nothing", function(done) {
      var result = st.yMax(shapes[shape]);

      if (!result && shape.substr(0,5) != "baddy") {
        throw new Error("Bad maximum latitude returned");
      }
      done();
    });
  });
});
