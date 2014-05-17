 (function (exports) {

   var w = $(window).innerWidth() * 3 / 10;
   var h = $(window).innerHeight() / 2;

   function Path() {
     this.positionPath = [];
     this.x = [];
     this.y = [];
     this.positionPaths = [];
     this.shrinkDone = 0;
   }
   Path.prototype = {
     add: function (x1, y1) {
       this.positionPath.push([x1, y1]);
     },
     getX: function () {
       for (var i = 0; i < this.positionPath.length - 2; i++) {
         this.x.push([this.positionPath[i][0], 0]);
       }
     },
     getY: function () {
       for (var i = 0; i < this.positionPath.length - 2; i++) {
         this.y.push([0, this.positionPath[i][1]]);
       }
     },
     getPaths: function () {
       this.positionPaths.push(this.positionPath);
     },
     render: function (ctx) {
       ctx.beginPath();
       ctx.strokeStyle = '#000';
       for (var i = 0; i < this.positionPath.length - 2; i++) {
         ctx.moveTo(this.positionPath[i][0], this.positionPath[i][1]);
         ctx.lineTo(this.positionPath[i + 1][0], this.positionPath[i + 1][1]);
       }
       ctx.stroke();
     },
     shrink: function () {
       if (!this.shrinkDone) {
         this.positionPath.forEach(function (item) {
           item[0] *= 0.3;
           item[1] *= 0.3;
         });
         this.shrinkDone = 1;
       }
     },
     copyFrom: function (obj) {
       var i = 0;
       var that = this;
       obj.positionPath.forEach(function (item) {
         that.positionPath[i] = [item[0], item[1]];
         i++;
       });
       this.shrinkDone = obj.shrinkDone;
       this.shrink = obj.shrink;
       return this;
     }
   };

   //-----------------------------------------------------------

   function Shape() {
     //this.position = [350, 300];
     this.x = [w, 0];
     this.y = [0, h];
     this.size = [20, 0];
     this.color = [];
     this.positionPaths = [
       [
         [w, h]
       ]
     ];
     this.prePositionPaths = this.positionPaths;
     this.positionIndex = 0;
     this.positionCount = 0;
     this.positionPointIndex = 0;
     this.positionTimes = [0];
     this.positionTimesIndex = 0;
     this.positionTimesCount = 0;

     this.sizePaths = [
       [
         [20, 0]
       ]
     ];
     this.preSizePaths = this.sizePaths;
     this.sizeIndex = 0;
     this.sizeCount = 0;
     this.sizePointIndex = 0;
     this.sizeTimes = [0];
     this.sizeTimesIndex = 0;
     this.sizeTimesCount = 0;

     this.pointGenerate = function () {
       if (this.prePositionPaths !== this.positionPaths) {
         this.positionIndex = 0;
         this.positionCount = 0;
         this.positionPointIndex = 0;
         this.positionTimes = [0];
         this.positionTimesIndex = 0;
         this.positionTimesCount = 0;
         this.prePositionPaths = this.positionPaths;
       }
       this.position = this.positionPaths[this.positionIndex][this.positionCount];
       this.x = [this.position[0], 0];
       this.y = [0, this.position[1]];
       if (this.positionCount < this.positionPaths[this.positionIndex].length -
         1) {
         this.positionCount++;
       } else if (this.positionTimesCount === this.positionTimes[this.positionTimesIndex]) {
         this.positionIndex++;
         this.positionCount = 0;
         this.positionTimesIndex++;
         this.positionTimesCount = 0;
       } else {
         this.positionTimesCount++;
       }

       if (this.positionIndex >= this.positionPaths.length) this.positionIndex =
         0;
       if (this.positionTimesIndex >= this.positionTimes.length) this.positionTimesIndex =
         0;

       //-------------------------------------------------------------------------
       if (this.preSizePaths !== this.sizePaths) {
         this.sizeIndex = 0;
         this.sizeCount = 0;
         this.sizePointIndex = 0;
         this.sizeTimes = [0];
         this.sizeTimesIndex = 0;
         this.sizeTimesCount = 0;
         this.preSizePaths = this.sizePaths;
       }
       this.size = this.sizePaths[this.sizeIndex][this.sizeCount];
       if (this.sizeCount < this.sizePaths[this.sizeIndex].length -
         1) {
         this.sizeCount++;
       } else if (this.sizeTimesCount === this.sizeTimes[this.sizeTimesIndex]) {
         this.sizeIndex++;
         this.sizeCount = 0;
         this.sizeTimesIndex++;
         this.sizeTimesCount = 0;
       } else {
         this.sizeTimesCount++;
       }

       if (this.sizeIndex >= this.sizePaths.length) this.sizeIndex =
         0;
       if (this.sizeTimesIndex >= this.sizeTimes.length) this.sizeTimesIndex =
         0;
     };
   }

   //--------------------------------------------------------------------------

   var Circle = function () {
     this.draw = function (ctx) {
       ctx.beginPath();
       var dia = this.size[0] + this.size[1];
       ctx.arc(this.x[0], this.y[1], dia, 0, 2 * Math.PI);
       ctx.strokeStyle = '#000';
       ctx.stroke();
     };
   };
   Circle.prototype = new Shape();

   var Square = function () {
     this.draw = function (ctx) {
       var dia = this.size[0] + this.size[1];
       ctx.strokeStyle = '#000';
       ctx.strokeRect(this.x[0] - dia, this.y[1] - dia, dia * 2, dia * 2);
     };
   };
   Square.prototype = new Shape();

   var Triangle = function () {
     this.draw = function (ctx) {
       var dia = this.size[0] + this.size[1];
       ctx.beginPath();
       ctx.moveTo(this.x[0] - 2 * dia / Math.sqrt(3), this.y[1] - dia / Math.sqrt(
         3));
       ctx.lineTo(this.x[0] + 2 * dia / Math.sqrt(3), this.y[1] - dia / Math.sqrt(
         3));
       ctx.lineTo(this.x[0], this.y[1] + dia);
       ctx.closePath();
       ctx.strokeStyle = '#000';
       ctx.stroke();
     };
   };
   Triangle.prototype = new Shape();

   exports.Path = Path;
   exports.Circle = Circle;
   exports.Square = Square;
   exports.Triangle = Triangle;
 })(this);