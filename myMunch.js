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
       bhrProValue = this.dictionary[bhrPro](objName, objPro, bhrName);
     } else if (process[assignIndex + 1].hasOwnProperty('newPath')) {
       bhrProValue = process[assignIndex + 1].newPath;
     } else if (typeof process[assignIndex + 1] === 'number') {
       if (objPro === 'size') {
         bhrProValue = [
           [
             [process[assignIndex + 1], 0]
           ]
         ];
       }
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
     var objName, objPro;
     if (process[0].hasOwnProperty('word') && process[1].hasOwnProperty('word')) {
       objName = process[0].word;
       objPro = process[1].word;
     }
     var itemF1 = process[operationIndex - 2];
     var itemF2 = process[operationIndex - 1];
     var itemB1 = process[operationIndex + 1];
     var itemB2 = process[operationIndex + 2];
     var a, b, result;
     if (itemF1 === undefined && itemB2 === undefined || !itemF1.hasOwnProperty(
       'word') && itemB2 === undefined) {
       //2 + 2
       //g size => 2 + 2
       a = {
         name: itemF2
       };
       b = {
         name: itemB1
       };
       result = this.dictionary[operator](a, b, objName, objPro);
       process.splice(operationIndex - 1, 3);
       process.push(result);

     } else if (itemB2 === undefined) {
       //path0 y + 2
       a = {
         name: itemF1.word,
         pro: itemF2.word
       };
       b = {
         name: itemB1
       };
       result = {
         newPath: this.dictionary[operator](a, b, objName, objPro)
       };
       process.splice(operationIndex - 2, 4);
       process.push(result);

     } else if (!itemF2.hasOwnProperty('word')) {
       //2 + path0 y
       a = {
         name: itemF2,
       };
       b = {
         name: itemB1.word,
         pro: itemB2.word
       };
       result = {
         newPath: this.dictionary[operator](a, b, objName, objPro)
       };
       process.splice(operationIndex - 1, 4);
       process.push(result);
     } else if (itemF1.hasOwnProperty('word') && itemF2.hasOwnProperty('word') &&
       itemB1.hasOwnProperty('word') && itemB2.hasOwnProperty('word')) {
       //path0 y + path1 x
       a = {
         name: itemF1.word,
         pro: itemF2.word
       };
       b = {
         name: itemB1.word,
         pro: itemB2.word
       };
       result = {
         newPath: this.dictionary[operator](a, b, objName, objPro)
       };
       process.splice(operationIndex - 2, 5);
       process.push(result);
     }
     return process;
   },

   dictionary: {
     'position': function (name1, obj1, name2) {
       return lookupTable[name2].positionPaths;
     },

     'y': function (name1, obj1, name2) {
       console.log(name1, name2);
       var y = lookupTable[name2].y;
       var newArr2 = [];
       if (obj1 !== 'size') {
         var pp = lookupTable[name1].positionPaths;
         console.log(y, pp);
         if (pp[0].length < 2) {
           var newArr0 = [];
           for (var i = 0; i < y.length; i++) {
             newArr0.push([w, y[i][1]]);
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
       console.log(newArr2);
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
             newArr0.push([x[i][0], h]);
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
       console.log(newArr2);
       return newArr2;
     },

     '+': function (name1, name2, objName, objPro) {
       var value1, value2, min, newArr;
       if (!name1.hasOwnProperty('pro') && !name2.hasOwnProperty('pro')) {
         // 2 + 2
         return name1.name + name2.name;

       } else if (name1.hasOwnProperty('pro') && !name2.hasOwnProperty('pro')) {
         // path0 y + 2
         value1 = this[name1.pro](objName, objPro, name1.name);
         newArr = [];

         for (var j = 0; j < value1[0].length; j++) {
           newArr.push([name2.name + value1[0][j][0], name2.name +
             value1[0][j][1]
           ]);
         }
         return [newArr];

       } else if (!name1.hasOwnProperty('pro') && name2.hasOwnProperty('pro')) {
         // 2 + path0 y
         value2 = this[name2.pro](objName, objPro, name2.name);
         newArr = [];
         for (var l = 0; l < value2[0].length; l++) {
           newArr.push([name1.name + value2[0][l][0], name1.name +
             value2[0][l][1]
           ]);
         }
         return [newArr];

       } else if (name1.hasOwnProperty('pro') && name2.hasOwnProperty('pro')) {
         // path0 y + path1 x
         value1 = this[name1.pro](objName, objPro, name1.name);
         value2 = this[name2.pro](objName, objPro, name2.name);
         min = Math.min(value1[0].length, value2[0].length);
         newArr = [];
         for (var m = 0; m < min; m++) {
           if (objPro === 'x') {
             newArr.push([value1[0][m][0] + value2[0][m][0] / 2, h]);
           } else if (objPro === 'y') {
             newArr.push([w, value1[0][m][1] + value2[0][m][1] / 2]);
           } else if (objPro === 'position') {
             if (name1.pro === 'x' && name2.pro === 'y') {
               newArr.push([value1[0][m][0], value2[0][m][1]]);

             } else if (name1.pro === 'y' && name2.pro === 'x') {
               newArr.push([value2[0][m][0], value1[0][m][1]]);

             } else if (name1.pro === 'position' && name2.pro === 'x') {
               newArr.push([value1[0][m][0] + value2[0][m][0] / 2, value1[0][m]
                 [1]
               ]);

             } else if (name1.pro === 'y' && name2.pro === 'position') {
               newArr.push([value2[0][m][0], value1[0][m][1] + value2[0][m][1] /
                 2
               ]);

             } else if (name1.pro === 'x' && name2.pro === 'position') {
               newArr.push([value1[0][m][0] + value2[0][m][0] / 2, value2[0][m]
                 [1]
               ]);

             } else if (name1.pro === 'position' && name2.pro === 'y') {
               newArr.push([value1[0][m][0], value1[0][m][1] + value2[0][m][1] /
                 2
               ]);

             } else if (name1.pro === 'position' && name2.pro === 'position') {
               newArr.push([value1[0][m][0] + value2[0][m][0] / 2, value1[0][m]
                 [1] +
                 value2[0][m][1] / 2
               ]);
             }
           }
         }
         return [newArr];
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
       process = Machine.assignment(process.indexOf('=>'), process);
     }

     if (process.indexOf('=') >= 0) {
       process = Machine.definition(process.indexOf('='), process);
     }

     return process;
   }

 };