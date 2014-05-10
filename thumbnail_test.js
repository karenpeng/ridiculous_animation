(function (exports) {
  var patterns = [];
  var manyPatterns = [];
  var canvas1 = document.getElementById('myCanvas1');
  var context1 = canvas1.getContext('2d');
  var w = window.innerWidth * 2 / 5;
  var h = window.innerHeight * 2 / 5;
  $("#myCanvas1").attr('width', w);
  $("#myCanvas1").attr('height', h);
  var lineNumber = 0;
  var manyNumber = 0;

  $("#myCanvas").mouseup(function () {
    if (!shiftDown) {
      patterns[lineNumber] = new curvyLine().copyFrom(lines[lineNumber]);
      patterns[lineNumber].shrink();
      patterns[lineNumber].render(context1);
      lineNumber++;
    }
  });

  $(window).keyup(function (e) {
    if (e.which === 18) {
      e.preventDefault();
      if (manyLines) {
        manyPatterns[manyNumber] = new manyLine().copyFrom(manyLinesHolder[
          manyNumber]);
        manyPatterns[manyNumber].shrink();
        manyPatterns[manyNumber].render(context1);
        manyNumber++;
      }
    }
  });

  exports.patterns = patterns;

})(this);