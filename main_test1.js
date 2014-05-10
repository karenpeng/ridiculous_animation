(function (exports) {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var editorW = window.innerWidth * 2 / 5;
  var w = window.innerWidth * 3 / 5;
  var h = window.innerHeight;
  $("#myCanvas").attr('width', w);
  $("#myCanvas").attr('height', h);

  function drawBg() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, w, h);
  }

  function drawGrid() {
    context.beginPath();
    for (var x = 20; x < w; x += 20) {
      context.moveTo(x, 0);
      context.lineTo(x, h);
    }
    for (var y = 20; y < h; y += 20) {
      context.moveTo(0, y);
      context.lineTo(w, y);
    }
    context.strokeStyle = '#cde';
    context.stroke();
  }

  function draw(foo, rate) {
    setTimeout(function () {
      requestAnimationFrame(function () {
        draw(foo, rate);
      });
      foo();
    }, 1000 / rate);
  }

  //-------------------------main------------------------------

  var c;
  var lines = [];
  var manyLines = new manyLine();
  var manyLinesHolder = [];
  var manyTime = [];
  var down = 0;
  var lineNumber = 0;
  var manyLineNumber = 0;
  exports.shiftDown = false;
  var startCountGap = false;
  var countGap = 0;

  $("#myCanvas").mousedown(function (e) {
    if (exports.shiftDown && countGap !== 0) {
      startCountGap = false;
      manyLines.manyTimeIhave.push(countGap);
      countGap = 0;
    }
    c = new curvyLine();
    c.begin(e.pageX - editorW, e.pageY);
    down = 1;
  });

  $("#myCanvas").mousemove(function (e) {
    if (down === 1) {
      c.middle(e.pageX - editorW, e.pageY);
    }
  });

  $("#myCanvas").mouseup(function () {
    if (!exports.shiftDown) {
      lines.push(c);
      var index = ['line', lineNumber];
      var dicIndex = index.join("");
      lookupTable[dicIndex] = lines[lineNumber];
      c = null;
      lineNumber++;
    } else {
      manyLines.manyLinesIhave.push(c);
      startCountGap = true;
    }
    down = 0;
  });

  $(window).keydown(function (e) {
    if (e.which === 18) {
      e.preventDefault();
      exports.shiftDown = true;
    }
  });

  $(window).keyup(function (e) {
    if (e.which === 18) {
      e.preventDefault();
      shiftDown = false;
      if (manyLines.manyLinesIhave.length !== 0) {
        var index = ['manyLine', manyLineNumber];
        var dicIndex = index.join("");
        lookupTable[dicIndex] = manyLines;
        c = null;
        manyLineNumber++;
        manyTime = [];
        manyLinesHolder.push(manyLines);
        manyLines = null;
        countGap = 0;
      }
    }
  });

  draw(function () {
    //exports.code = editor.getSession().getValue();

    drawBg();
    drawGrid();
    if (c) {
      c.render(context);
    }
    for (var key in lookupTable) {
      var item = lookupTable[key];
      //var item = lookupTable.key;
      if (item instanceof circle) {
        item.switchArr();
        item.draw(context);
      }
    }
    if (startCountGap) {
      countGap++;
    }
    if (manyLines) {
      manyLines.manyLinesIhave.forEach(function (l) {
        l.render(context);
      });
    }
  }, 18);

  exports.lines = lines;
  exports.manyLines = manyLines;
  exports.manyLinesHolder = manyLinesHolder;
  //exports.shiftDown = shiftDown;

})(this);