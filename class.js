 (function (exports) {

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

   function Circle() {
     //this.position = [350, 300];
     this.x = [350, 0];
     this.y = [0, 300];
     this.size = [20, 0];
     this.color = [];
     this.positionPaths = [
       [
         [350, 300]
       ]
     ];
     this.prePositionPaths = this.positionPaths;
     this.positionIndex = 0;
     this.positionCount = 0;
     this.positionPointIndex = 0;
     this.positionTimes = [0];
     this.positionTimesIndex = 0;
     this.positionTimesCount = 0;

     this.sizePaths = [];
     this.sizeTimes = [];
   }

   Circle.prototype = {
     pointGenerate: function () {
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

     },
     draw: function (ctx) {
       ctx.beginPath();
       var dia = this.size[0] + this.size[1];
       ctx.arc(this.x[0], this.y[1], dia, 0, 2 * Math.PI);
       ctx.strokeStyle = '#000';
       ctx.stroke();
     }
   };

   exports.Path = Path;
   exports.Circle = Circle;
 })(this);