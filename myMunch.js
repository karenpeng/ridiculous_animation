 var lookupTable = new Object();

 function cloneArr(obj) {
   // Handle the 3 simple types, and null or undefined
   if (null === obj || "object" != typeof obj) return obj;
   // Handle Array
   if (obj instanceof Array) {
     var copy = [];
     for (var i = 0, len = obj.length; i < len; i++) {
       copy[i] = cloneArr(obj[i]);
     }
     return copy;
   }
 }

 //功能：
 //构造behavior
 //使用behacior
 //能往外部import obj?
 //然后对obj使用behavior
 //怎么对接，数据形式都不一样？
 //可以返回来修改behavior

 var Machine = {
   definition: function (defineIndex, process) {
     var objName = process[defineIndex - 1].word;
     var objType = process[defineIndex + 1].word;

     if (objType === 'circle') {
       lookupTable[objName] = new Circle();
     } else if (objType === 'triangle') {
       lookupTable[objName] = new Triangle();
     } else if (objType === 'square') {
       lookupTable[objName] = new Square();
     }
     process = [];
     return process;
   },

   assignment: function (assignIndex, process) {
     var objName = process[assignIndex - 2].word;
     var objPro = process[assignIndex - 1].word;
     var bhrName = null;
     var bhrPro = null;
     var bhrProValue = null;
     if (process[assignIndex + 1].hasOwnProperty('word')) {
       bhrName = process[assignIndex + 1].word;
       bhrPro = process[assignIndex + 2].word;
       bhrProValue = Match.dictionary[bhrPro](objName, objPro, bhrName);
     } else if (process[assignIndex + 1].hasOwnProperty('newPath')) {
       bhrProValue = process[assignIndex + 1].newPath;
     }

     if (objPro === 'position') {
       lookupTable[objName].positionPaths = bhrProValue;
     } else if (objPro === 'y') {
       lookupTable[objName].positionPaths = bhrProValue;
     } else if (objPro === 'x') {
       lookupTable[objName].positionPaths = bhrProValue;
     } else if (objPro === 'size') {
       lookupTable[objName].sizePaths = bhrProValue;
     }
     process = [];
     return process;
   },

   operation: function (operationIndex, process) {
     var operator = process[operationIndex];
     var objName = process[0].word;
     var objPro = process[1].word;
     var itemF1 = process[operationIndex - 2].word;
     var itemF2 = process[operationIndex - 1].word;
     var itemB1 = process[operationIndex + 1].word;
     var itemB2 = process[operationIndex + 2].word;
     var a, b, result;
     if (itemF2 === undefined && itemB1 === undefined) {
       //2 + 2
       a = {
         name: itemF2
       };
       b = {
         name: itemB1
       };
       result = {
         newPath: Match.dictionary[operator](a, b, objName, objPro)
       };
       process.slice(operationIndex - 1, 3);
       process.push(result);

     } else if (itemB2 === undefined) {
       //path0 y + 2
       a = {
         name: itemF1,
         pro: itemF2
       };
       b = {
         name: itemB1
       };
       result = {
         newPath: Match.dictionary[operator](a, b, objName, objPro)
       };
       process.slice(operationIndex - 2, 4);
       process.push(result);

     } else if (itemF2 === undefined) {
       //2 + path0 y
     } else {
       //path0 + path1
       a = {
         name: itemF1,
         pro: itemF2
       };
       b = {
         name: itemB1,
         pro: itemB2
       };
       //Match.dictionary[operator](a, b, objName, objPro);
       //console.log(operator, a, b, objName, objPro);
       result = {
         newPath: Match.dictionary[operator](a, b, objName, objPro)
       };
       process.slice(operationIndex - 2, 5);
       process.push(result);
     }
     return process;
   }
 };

 var Match = {
   dictionary: {
     'position': function (name1, obj1, name2) {
       return lookupTable[name2].positionPaths;
     },

     'y': function (name1, obj1, name2) {
       var y = lookupTable[name2].y;
       var newArr2 = [];
       if (obj1 !== 'size') {
         var pp = lookupTable[name1].positionPaths;
         if (pp[0].length < 2) {
           var newArr0 = [];
           for (var i = 0; i < y.length; i++) {
             newArr0.push([350, y[i][1]]);
           }
           newArr2.push(newArr0);
         } else {
           for (var k = 0; k < pp.length; k++) {
             var newArr1 = [];
             var min = Math.min(y.length, pp[k].length);
             for (var j = 0; j < min; j++) {
               newArr1.push([pp[k][j][0], y[j][1]]);
             }
             newArr2.push(newArr1);
           }
         }

       } else {
         var ss = lookupTable[name1].sizePaths;
         var newArr3 = [];
         for (var l = 0; l < y.length; l++) {
           newArr3.push([0, y[l][1]]);
         }
         newArr2.push(newArr3);
       }
       return newArr2;
     },

     'x': function (name1, obj1, name2) {
       var x = lookupTable[name2].x;
       var newArr2 = [];
       if (obj1 !== 'size') {
         var pp = lookupTable[name1].positionPaths;
         if (pp[0].length < 2) {
           var newArr0 = [];
           for (var i = 0; i < x.length; i++) {
             newArr0.push([x[i][0], 300]);
           }
           newArr2.push(newArr0);
         } else {
           for (var k = 0; k < pp.length; k++) {
             var newArr1 = [];
             var min = Math.min(x.length, pp[k].length);
             for (var j = 0; j < min; j++) {
               newArr1.push([x[j][0], pp[k][j][1]]);
             }
             newArr2.push(newArr1);
           }
         }
       } else {
         var ss = lookupTable[name1].sizePaths;
         var newArr3 = [];
         for (var l = 0; l < x.length; l++) {
           newArr3.push([x[l][0], 0]);
         }
         newArr2.push(newArr3);
       }
       return newArr2;
     },

     '+': function (name1, name2, objName, objPro) {
       console.log(name1, name2, objName, objPro);
       var value1, value2, min, newArr;
       if (!name1.hasOwnProperty('pro') && !name2.hasOwnProperty('pro')) {
         // 2 + 2
         return name1.name + name2.name;

       } else if (name1.hasOwnProperty('pro') && !name2.hasOwnProperty('pro')) {
         // path0 y + 2
         value1 = Match.dicitionary[name1.pro](objName, objPro, name1.name);
         newArr = [];
         for (var i = 0; i < value1.length; i++) {
           var newArr0 = [];
           for (var j = 0; j < value1[j].length; j++) {
             newArr0.push([name2.name + value1[i][j][0], name2.name +
               value1[i][j][1]
             ]);
           }
           newArr.push(newArr0);
         }
         return newArr;

       } else if (!name1.hasOwnProperty('pro') && name2.hasOwnProperty('pro')) {
         // 2 + path0 y
         value2 = Match.dicitionary[name2.pro](objName, objPro, name2.name);
         newArr = [];
         for (var i = 0; i < value2.length; i++) {
           var newArr0 = [];
           for (var j = 0; j < value2[j].length; j++) {
             newArr0.push([name1.name + value2[i][j][0], name1.name +
               value2[i][j][1]
             ]);
           }
           newArr.push(newArr0);
         }
         return newArr;

       } else if (name1.hasOwnProperty('pro') && name2.pro.hasOwnProperty('pro')) {
         // path0 y + path1 x

         console.log('bingGo');

         value1 = Match.dicitionary[name1.pro](objName, objPro, name1.name);
         value2 = Match.dicitionary[name2.pro](objName, objPro, name2.name);
         console.log(value1, value2);
         min = Math.min(value1.length, value2.length);
         newArr = [];
         for (var i = 0; i < min; i++) {
           var newArr0 = [];
           var minAgain = Math.min(value1[i], value2[i]);
           for (var j = 0; j < minAgain; j++) {
             newArr0.push([value1[i][j][0] + value2[i][j][0], value1[i][j][1] +
               value2[i][j][1]
             ]);
           }
           newArr.push(newArr0);
         }
         return newArr;
       }
     },

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
     var process = source.clone();

     if (process.indexOf('+') >= 0) {
       process = Machine.operation(process.indexOf('+'), process);
     }

     if (process.indexOf('-') >= 0) {
       process = Machine.operation(process.indexOf('-'), process);
     }

     if (process.indexOf('*') >= 0) {
       process = Machine.operation(process.indexOf('*'), process);
     }

     if (process.indexOf('/') >= 0) {
       process = Machine.operation(process.indexOf('/'), process);
     }

     if (process.indexOf('=>') >= 0) {
       //assign value to obj
       // Match.assignment(process[0].word, process[1].word, process[
       //   3].word, process[4].word);
       process = Machine.assignment(process.indexOf('=>'), process);
     }

     if (process.indexOf('=') >= 0) {
       //define new obj
       process = Machine.definition(process.indexOf('='), process);
     }
     // else if(){

     // }

     return process;
   }

 };