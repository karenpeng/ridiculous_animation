 (function (exports) {

   function curvyLine() {
     this.path = [];
     this.diff = [];
     this.preX;
     this.preY;
     this.shrinkDone = 0;
     this.gapOpen = false;
     this.gapTime = [];
   }
   curvyLine.prototype = {
     begin: function (x1, y1) {
       this.path.push([x1, y1]);
       this.preX = x1;
       this.preY = y1;
     },
     middle: function (x1, y1) {
       this.path.push([x1, y1]);
       var x_ = x1 - this.preX;
       var y_ = y1 - this.preY;
       this.diff.push([x_, y_]);

       this.preX = x1;
       this.preY = y1;
     },
     render: function (ctx) {
       ctx.beginPath();
       ctx.strokeStyle = '#000';
       for (var i = 0; i < this.path.length - 2; i++) {
         ctx.moveTo(this.path[i][0], this.path[i][1]);
         ctx.lineTo(this.path[i + 1][0], this.path[i + 1][1]);
       }
       ctx.stroke();
     },
     shrink: function () {
       if (!this.shrinkDone) {
         this.path.forEach(function (item) {
           item[0] *= 0.3;
           item[1] *= 0.3;
         });
         this.diff.forEach(function (item) {
           item[0] *= 0.3;
           item[1] *= 0.3;
         });
         this.shrinkDone = 1;
       }
     },
     amplify: function () {
       if (this.shrink) {
         this.path.forEach(function (item) {
           item[0] /= 0.3;
           item[1] /= 0.3;
         });
         this.diff.forEach(function (item) {
           item[0] /= 0.3;
           item[1] /= 0.3;
         });
         this.shrink = 0;
       }
     },
     copyFrom: function (obj) {
       var i = 0;
       var that = this;
       obj.path.forEach(function (item) {
         that.path[i] = [item[0], item[1]];
         i++;
       });
       var j = 0;
       obj.diff.forEach(function (item) {
         that.diff[j] = [item[0], item[1]];
         j++;
       });
       // this.path = obj.path.slice(0);
       // this.diff = obj.diff.slice(0);
       this.preX = obj.preX;
       this.preY = obj.preY;
       this.shrinkDone = obj.shrinkDone;
       this.shrink = obj.shrink;
       this.amplify = obj.amplify;
       return this;
     }
   };

   function manyLine() {
     this.manyLinesIhave = [];
     this.manyTimeIhave = [];
   }
   manyLine.prototype = {
     shrink: function () {
       this.manyLinesIhave.forEach(function (l) {
         l.forEach(function (p) {
           p[0] *= 0.3;
           p[1] *= 0.3;
         });
       });
     },
     render: function (ctx) {
       ctx.beginPath();
       ctx.strokeStyle = '#000';
       this.manyLinesIhave.forEach(function (l) {
         for (var i = 0; i < l.length - 2; i++) {
           ctx.moveTo(l[i][0], l[i][1]);
           ctx.lineTo(l[i + 1][0], l[i + 1][1]);
         }
         ctx.stroke();
       });
     },
     copyFrom: function (obj) {
       var that = this;
       var ll = [];
       obj.manyLinesIhave.forEach(function (cl) {
         cl.path.forEach(function (p) {
           ll.push([p[0], p[1]]);
         });
         that.manyLinesIhave.push(ll);
         ll = [];
       });
       obj.manyTimeIhave.forEach(function (t) {
         that.manyTimeIhave.push(t);
       });
       return this;
     }
   };

   function circle(arr1, arr2) {
     if (arr1 === undefined && arr2 === undefined) {
       this.size = [
         [20, 0]
       ];
       this.position = [
         [350, 300]
       ];
     } else if (arr1 === undefined && arr2[0][0] !== undefined) {
       this.size = [
         [20, 0]
       ];
       this.position = arr2;
     } else if (arr1[0] !== undefined && arr1[0][0] === undefined && arr2 ===
       undefined) {
       this.size = arr1;
       this.position = [
         [350, 300]
       ];
     } else if (arr1[0] !== undefined && arr2[0][0] !== undefined) {
       this.size = arr1;
       this.position = arr2;
     }
     this.i = 0;
     this.j = 0;
     this.positions = [];
     this.positionNum = 0;
     this.positionCounter = 0;
     this.timePass = [];
     this.timeNum = 0;
     this.positonDone = false;
     this.positions.push(this.position);
   }
   circle.prototype = {
     draw: function (ctx) {
       this.position = this.positions[this.positionNum];
       ctx.beginPath();
       var dia = this.size[this.j][0] + this.size[this.j][1];
       ctx.arc(this.position[this.i][0], this.position[this.i][1], dia, 0,
         2 * Math.PI);
       ctx.strokeStyle = '#000';
       ctx.stroke();
       if (this.i < this.position.length - 1) {
         this.i++;
       } else {
         this.positonDone = true;
       }
       this.j++;
       if (this.j >= this.size.length) {
         this.j = 0;
       }
     },
     switchArr: function () {
       if (this.positonDone) {
         if (this.timePass.length === 0) {
           this.i = 0;
           this.positonDone = false;
         } else if (this.positionCounter === this.timePass[this.timeNum]) {
           this.positionNum++;
           this.i = 0;
           this.positonDone = false;
           this.positionCounter = 0;
           this.timeNum++;
         } else {
           this.positionCounter++;
         }
         if (this.timeNum >= this.timePass.length) this.timeNum = 0;
         if (this.positionNum >= this.positions.length) this.positionNum = 0;
       }
     }
   };

   exports.curvyLine = curvyLine;
   exports.manyLine = manyLine;
   exports.circle = circle;

 })(this);