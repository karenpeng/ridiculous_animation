 var lookupTable = new Object();
 //var stack;

 var Munch = {
   dictionary: {

     'circle': function (stack) {
       var name = stack.pop();
       lookupTable[name] = new circle();
       return stack;
     },

     'triangle': function (stack) {
       var name = stack.pop();
       lookupTable[name] = new triangle();
       return stack;
     },

     'rectangle': function (stack) {
       var name = stack.pop();
       lookupTable[name] = new rectangle();
       return stack;
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

     'position': function (stack) {
       var obj = stack.pop();
       if (obj instanceof curvyLine) {
         var objPos = [];
         for (var i = 0; i < obj.path.length; i++) {
           objPos.push(obj.path[i]);
         }
         stack.push({
           pos: [objPos],
           time: []
         });
       } else if (obj instanceof manyLine) {
         var objPos2 = [];
         var objPos3 = [];
         for (var j = 0; j < obj.manyLinesIhave.length; j++) {
           for (var k = 0; k < obj.manyLinesIhave[j].path.length; k++) {
             objPos2.push(obj.manyLinesIhave[j].path[k]);
           }
           objPos3.push(objPos2);
           objPos2 = [];
         }
         var objTime = [];
         for (var l = 0; l < obj.manyTimeIhave.length; l++) {
           objTime.push(obj.manyTimeIhave[l]);
         }
         stack.push({
           pos: objPos3,
           time: objTime
         });
       } else if (typeof obj === 'object') {
         var whom = stack.pop();
         whom.positions = obj.pos;
         whom.timePass = obj.time;
       }
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
   },

   eval: function (source, initialStack) {
     // the stack we are operating on
     var stack;
     if (initialStack !== undefined)
     // if an initial stack is provided, use that
       stack = initialStack;
     else
     // otherwise, use an empty array
       stack = [];

     // loop through every item in the source
     for (var i = 0; i < source.length; i++) {
       if (source[i].word !== undefined) {
         // if the item is a word, look it up in the dictionary
         var wordObj = lookupTable[source[i].word];

         if (wordObj !== undefined) {
           stack.push(wordObj);
         } else {

           var wordValue = Munch.dictionary[source[i].word];
           if (typeof wordValue === "function") {
             // if the word's value is a function execute it with the current stack as an argument
             // make current stack into the result
             stack = wordValue(stack.clone());

           } else if (typeof wordValue === "object") {
             // if the word's value is a quotation, execute it on the current stack
             for (var j = 0; j < wordValue.length; j++) {
               var a = Munch.dictionary[wordValue[j].word];
               stack = a(stack.clone());
             }

           } else if (wordValue === undefined) {
             // if the word's value was not found, throw an error
             //throw new Error("Unknown word '" + source[i].word + "'!");
             stack.push(source[i].word);

           } else {
             // else, we know the word's value is not a function or undefined, push it to the stack
             stack.push(wordValue);
           }
         }
       } else {
         // else, we know that the item is not a word, push it to the stack
         stack.push(source[i]);

       }
     }

     // return the stack we operated on
     return stack;

   }
 }