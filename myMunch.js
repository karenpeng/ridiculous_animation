 var lookupTable = new Object();
 var pathIndex = 0;

 //功能：
 //构造behavior
 //使用behacior
 //能往外部import obj?
 //然后对obj使用behavior
 //怎么对接，数据形式都不一样？
 //可以返回来修改behavior

 var Machine = {
   definition: function (objName, objType) {
     if (objType === 'circle') {
       lookupTable[objName] = new Circle();
     } else if (objType === 'triangle') {
       lookupTable[objName] = new triangle();
     } else if (objType === 'rectangle') {
       lookupTable[objName] = new rectangle();
     }
   },

   assignment: function (objName, objPro, bhrName, bhrPro) {
     //var objProValue = Mm.dictionary[objPro](objName);
     var bhrProValue = Mm.dictionary[bhrPro](bhrName);
     // lookupTable[objName].objProValue = lookupTable[bhrName].bhrProValue;
     // lookupTable[objName].positionPaths = bhrProValue;
     // Mm.dictionary[objPro](objName) = bhrProValue;
     if (objPro === 'position') {
       lookupTable[objName].positionPaths = bhrProValue;
     }
   }
 };

 var Mm = {

   dictionary: {
     'position': function (name) {
       return lookupTable[name].positionPaths;
     },

     'y': function (stack) {
       var obj = stack.pop();
       var objY = [];
       for (var i = 0; i < obj.path.length; i++) {
         objY.push([0, obj.path[i][1]]);
       }
       stack.push(objY);
       return stack;
     },

     'x': function (stack) {
       var obj = stack.pop();
       var objX = [];
       for (var i = 0; i < obj.path.length; i++) {
         objX.push([obj.path[i][0], 0]);
       }
       stack.push(objX);
       return stack;
     },

     'size': function (stack) {
       var arr = stack.pop();
       var obj = stack.pop();
       obj.size = arr;
       return stack;
     },

     'def': function (stack) {
       var name = stack.pop();
       var value = stack.pop();
       Munch.dictionary[name] = value;
       return stack;
     },

     'if': function (stack) {
       var quot = stack.pop();
       var num = stack.pop();
       if (num !== 0) {
         // if the number is not zero, evaluate the quotation given the current stack
         stack = Munch.eval(quot, stack);
       }
       return stack;
     },

     '+': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       if (typeof a === 'number' && typeof b === 'number') {
         stack.push(a + b);
       } else if (typeof a === 'number' && typeof b === 'object') {
         var newB = [];
         for (var i = 0; i < b.length; i++) {
           newB.push([b[i][0] + a, b[i][1] + a]);
         }
         stack.push(newB);

       } else if (typeof a === 'object' && typeof b === 'number') {
         var newA = [];
         for (var j = 0; j < a.length; j++) {
           newA.push([a[j][0] + b, a[j][1] + b]);
         }
         stack.push(newA);

       } else if (typeof a === 'object' && typeof b === 'object') {
         var max = Math.max(a.length, b.length);
         var newArr = [];
         for (var k = 0; k < max; k++) {
           if (a[k] === undefined) a[k] = [0, 0];
           if (b[k] === undefined) b[k] = [0, 0];
           newArr.push([a[k][0] + b[k][0], a[k][1] + b[k][1]]);
         }
         stack.push(newArr);
       }
       return stack;
     },

     '-': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       stack.push(a - b);

       return stack;
     },

     '*': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       stack.push(a * b);

       return stack;
     },

     '/': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       stack.push(a / b);

       return stack;
     },

     '÷': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       stack.push(a / b);
       return stack;
     },

     ' "pi" ': function (stack) {
       stack.push(Math.PI);
       return stack;
     },

     'dup': function (stack) {
       var a = stack.pop();
       stack.push(a);
       stack.push(a);
       return stack;
     },

     'swap': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       stack.push(a);
       stack.push(b);
       return stack;
     },

     '>': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       if (b > a) {
         stack.push(true);
       } else {
         stack.push(false);
       }
       return stack;
     },

     '<': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       if (b < a) {
         stack.push(true);
       } else {
         stack.push(false);
       }
       return stack;
     },

     '=': function (stack) {
       var a = stack.pop();
       var b = stack.pop();
       if (b === a) {
         stack.push(true);
       } else {
         stack.push(false);
       }
       return stack;
     },

     'random': function (stack) {
       stack.push(Math.random());
       return stack;
     },

     'times': function (stack) {
       var num = stack.pop();
       var quot = stack.pop();
       for (var i = num; i > 0; i--) {
         stack = Munch.eval(quot, stack);
       }
       return stack;
     },

     'maybe': function (stack) {
       var quot = stack.pop();
       if (Math.random() > 0.5) {
         stack = Munch.eval(quot, stack);
       }
       return stack;
     },

     'true': function (stack) {
       stack.push(true);
       return stack;
     },

     'false': function (stack) {
       stack.push(false);
       return stack;
     }
     // 'sineWave':function(){

     // }
     // 'triangleWave':function(){

     // }
     // 'squareWave':function(){

     // }
     // '==='
     //'color'

   },

   eval: function (source) {

     if (source.indexOf('=>') < 0 && source.indexOf('=') < 0) {
       //return a new obj

     } else if (source.indexOf('=>') >= 0) {
       //assign value to obj
       var asn = new Machine.assignment(source[0].word, source[1].word, source[
         3].word, source[4].word);

     } else if (source.indexOf('=') >= 0) {
       //define new obj
       var dfn = new Machine.definition(source[0].word, source[2].word);
     }

   }
 }