# i-ching
Node.js library and API for working with the I Ching, including as a graph.

## Quick Start

Install:

```shell
npm install --save i-ching
```

Load the module, and consult the Oracle:
```javascript
var iChing = require('i-ching');
```

```javascript
var reading = iChing.ask('to be or not to be?');
console.log('%d %s %s', 
            reading.hexagram.number, 
            reading.hexagram.character,
            reading.hexagram.names.join(', '));

if (reading.change) {
  console.log('changing lines: %j', reading.change.changingLines);
  console.log('change to hexagram: %d %s %s', 
              reading.change.to.number, 
              reading.change.to.character, 
              reading.change.to.names.join(', '));
} else {
  console.log('no changing lines');
}
```
Example output:
```
14 ䷍ Great Possessing, Possession in Great Measure
changing lines: [1,1,1,0,0,1]
change to hexagram: 16 ䷏ Providing-For, Enthusiasm
```


Get trigram 8:
```javascript
console.log(iChing.trigram(8));
/* output:
Trigram {
  number: 8,
  names: [ 'Open', 'The Joyous' ],
  chineseName: '兌',
  pinyinName: 'duì',
  character: '☱',
  attribute: 'joyful',
  images: [ 'swamp', 'lake' ],
  chineseImage: '澤',
  pinyinImage: 'zé',
  familyRelationship: 'third daughter',
  binary: '011',
  lines: [ 1, 1, 0 ] }
*/
```

Get hexagram 3:
```javascript
console.log(iChing.hexagram(3));
/* output:
Hexagram {
  number: 3,
  names: [ 'Sprouting', 'Difficulty at the Beginning' ],
  chineseName: '屯',
  pinyinName: 'zhūn',
  character: '䷂',
  topTrigram:
   Trigram {
     number: 4,
     // ...etc...
   }
   bottomTrigram:
   Trigram {
     number: 3,
     // ...etc...
   },
  binary: '010001',
  lines: [ 1, 0, 0, 0, 1, 0 ] }
*/
```

Get a specific Change:
```javascript
console.log(iChing.hexagram(1).changeTo(63));
/* output:
Change {
  from:
   Hexagram {
     number: 1,
     // ...etc...
   },
  to:
   Hexagram {
     number: 63,
     // ...etc...
   },
  binary: '101010',
  changingLines: [ 0, 1, 0, 1, 0, 1 ] }
*/
```




# Installation

```shell
npm install --save i-ching
```




# API

### [iChing Module](#iching-m)

[Properties](#iching-properties)
* [`iChing.hexagrams`](#iching-hexagrams)
* [`iChing.trigrams`](#iching-trigrams)

[Methods](#iching-methods)
* [`iChing.asGraph()`](#iching-asgraph)
* [`iChing.ask(question)`](#iching-ask)
* [`iChing.hexagram(number)`](#iching-hexagram)
* [`iChing.trigram(number)`](#iching-trigram)
* [`iChing.trigramSequence(name)`](#iching-trigramsequence)

### [Change Class](#change)

[Properties](#change-properties)
* [`Change.binary`](#change-binary)
* [`Change.changingLines`](#change-changinglines)
* [`Change.from`](#change-from)
* [`Change.to`](#change-to)

### [Hexagram Class](#hexagram)

[Properties](#hexagram-properties)
* [`Hexagram.binary`](#hexagram-binary)
* [`Hexagram.bottomTrigram`](#hexagram-bottomtrigram)
* [`Hexagram.changes`](#hexagram-changes)
* [`Hexagram.character`](#hexagram-character)
* [`Hexagram.chineseName`](#hexagram-chinesename)
* [`Hexagram.lines`](#hexagram-lines)
* [`Hexagram.names`](#hexagram-names)
* [`Hexagram.number`](#hexagram-number)
* [`Hexagram.pinyinName`](#hexagram-pinyinname)
* [`Hexagram.topTrigram`](#hexagram-toptrigram)
  
[Methods](#hexagram-methods)
* [`Hexagram.changeLines(lines)`](#hexagram-changelines)
* [`Hexagram.changeTo(number)`](#hexagram-changeto)

### [Reading Class](#reading)

[Properties](#reading-properties)
* [`Reading.change`](#reading-change)
* [`Reading.hexagram`](#reading-hexagram)

### [Trigram Class](#trigram)

[Properties](#trigram-properties)
* [`Trigram.attribute`](#trigram-attribute)
* [`Trigram.binary`](#trigram-binary)
* [`Trigram.character`](#trigram-character)
* [`Trigram.chineseImage`](#trigram-chineseimage)
* [`Trigram.chineseName`](#trigram-chinesename)
* [`Trigram.familyRelationship`](#trigram-familyrelationship)
* [`Trigram.images`](#trigram-images)
* [`Trigram.lines`](#trigram-lines)
* [`Trigram.names`](#trigram-names)
* [`Trigram.number`](#trigram-number)
* [`Trigram.pinyinImage`](#trigram-pinyinimage)
* [`Trigram.pinyinName`](#trigram-pinyinname)

[Methods](#trigram-methods)
* [`Trigram.hexagrams(position)`](#trigram-hexagrams)




  
  

## <a name="iching-m"></a>iChing Module

```javascript
var iChing = require('i-ching');
```

### <a name="iching-properties"></a>Properties

#### <a name="iching-hexagrams"></a>iChing.hexagrams

Returns an array containing the 64 [`Hexagram`](#hexagram)s.

**Example**
```javascript
console.log(iChing.hexagrams.length);
// output: 64
```

#### <a name="iching-trigrams"></a>iChing.trigrams

Returns an array containing the 8 [`Trigram`](#trigram)s.

**Example**
```javascript
console.log(iChing.trigrams.length);
// output: 8
```

### <a name="iching-methods"></a>Methods

#### <a name="iching-asgraph"></a>iChing.asGraph()

Returns an object suitable for graph applications.

**Example**
```javascript
console.log(iChing.asGraph());
/* output excerpt:
{ nodes:
   [ { id: 't1', type: 'trigram', name: '☰', number: 1 },
     { id: 't2', type: 'trigram', name: '☷', number: 2 },
     // ... etc trigrams ...
     { id: 't8', type: 'trigram', name: '☱', number: 8 },
     //
     { id: 'h1', type: 'hexagram', name: '䷀', number: 1 },
     { id: 'h2', type: 'hexagram', name: '䷁', number: 2 },
     // ... etc hexagrams ...
     { id: 'h64', type: 'hexagram', name: '䷿', number: 64 } ],
  edges:
   [ // ... etc hexagrams 1,2,3 edges ...
     //
     // hexagram 4 edge to top and bottom trigram
     { id: 'h4-t4-bottom', from: 'h4', to: 't4', name: 'bottom' }
     { id: 'h4-t5-top', from: 'h4', to: 't5', name: 'top' }
     // hexagram 4 edge to other hexagrams, name = changed lines
     { id: 'h4-h1', from: 'h4', to: 'h1', name: '011101' }
     { id: 'h4-h2', from: 'h4', to: 'h2', name: '100010' }
     // ... etc hexagram 4 edges ...
     { id: 'h4-h64', from: 'h4', to: 'h64', name: '001000' }
     //
     // ... etc hexagram 5-64 edges
   ]
 } */
 ```

The names of the hexagram-to-hexagram edges are the binary representation of the changing lines between those hexagrams. For more information see the [`Change.binary`](#change-binary) property.

#### <a name="iching-ask"></a>iChing.ask(question)

Returns a [`Reading`](#reading) with randomness seeded by the supplied `question`. The question can be any javascript type including strings, numbers, objects, arrays, and even `undefined`. Supplying the same `question` a second time will not, however, result in the same reading.

The reading is generated using the yarrow stalk method described in Wilhelm's translation. See [references](#references). 

**Example**
```javascript
var reading = iChing.ask('what is the meaning of life?');
console.log('%d -> %d %j', 
            reading.hexagram.character, 
            reading.change.to.character, 
            reading.change.changingLines);
// output (will vary due to randomness):
䷀ -> ䷾ [0,1,0,1,0,1]
```

#### <a name="iching-hexagram"></a>iChing.hexagram(number)

Returns the [`Hexagram`](#hexagram) corresponding to the `number`. The `number` must be an integer from 1 to 64 inclusive. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(22).names);
// output: [ 'Adorning', 'Grace' ]
```

#### <a name="iching-trigram"></a>iChing.trigram(number)

Returns the [`Trigram`](#trigram) corresponding to the `number`. The `number` must be an integer from 1 to 8 inclusive. Trigrams are numbered as follows:

1. ☰ Force, The Creative
1. ☷ Field, The Receptive
1. ☳ Shake, The Arousing
1. ☵ Gorge, The Abysmal
1. ☶ Bound, Keeping Still
1. ☴ Ground, The Gentle
1. ☲ Radiance, The Clinging
1. ☱ Open, The Joyous

**Example**
```javascript
console.log(iChing.trigram(1).names);
// output: [ 'Force', 'The Creative' ]
```

#### <a name="iching-trigramsequence"></a>iChing.trigramSequence(name)

Returns an array of [`Trigram`](#trigram)s ordered according to the `name`d traditional sequence. Possible values for `name` and their corresponding outputs are as follows.

**"earlierHeaven"**

0\. ☰ The Creative

1\. ☴ Ground, The Gentle

2\. ☵ Gorge, The Abysmal

3\. ☶ Bound, Keeping Still

4\. ☷ Field, The Receptive

5\. ☳ Shake, The Arousing

6\. ☲ Radiance, The Clinging

7\. ☱ Open, The Joyous

**"laterHeaven"**

0\. ☲ Radiance, The Clinging

1\. ☷ Field, The Receptive

2\. ☱ Open, The Joyous

3\. ☰ The Creative

4\. ☵ Gorge, The Abysmal

5\. ☶ Bound, Keeping Still

6\. ☳ Shake, The Arousing

7\. ☴ Ground, The Gentle









## <a name="change"></a>Change Class

The `Change` class represents a change from one hexagram to another.

### <a name="change-properties"></a>Properties

#### <a name="change-binary"></a>Change.binary

Returns a string containing the binary representation of the change lines. The most significant digit represents the top line and the least significant digit represents the bottom line. A bit value of 1 means the line changed, and a value of 0 means it did not change.

**Example**
```javascript
var h = iChing.hexagram(5);
var c = h.changeTo(1);
console.log('%s -> %s %s', 
            c.from.character, 
            c.to.character, 
            c.binary);
// output: ䷄ -> ䷀ 101000
```

#### <a name="change-changinglines"></a>Change.changingLines

Returns an array of integers representing the changing lines. A value of 1 denotes a changed line. A value of 0 denotes an unchanged line. Lines are represented from the bottom of the hexagram to top in the array.

**Example**
```javascript
var h = iChing.hexagram(5);
var c = h.changeTo(1);
console.log('%s -> %s %s', 
            c.from.character, 
            c.to.character, 
            c.changingLines);
// output: ䷄ -> ䷀ [ 0, 0, 0, 1, 0, 1 ]
```

#### <a name="change-from"></a>Change.from

Returns the [`Hexagram`](#hexagram) from which the change originated.

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).from.number);
// output: 5
```

#### <a name="change-to"></a>Change.to

Returns the [`Hexagram`](#hexagram) which results from the change.

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).to.number);
// output: 1
```







## <a name="hexagram"></a>Hexagram Class

The `Hexagram` class represents a hexagram of the I Ching. There are 64 possible `Hexagram` instances.

### <a name="hexagram-properties"></a>Properties

#### <a name="hexagram-binary"></a>Hexagram.binary

Returns a string containing the binary representation of the lines of the hexagram. The most significant digit is the top line and the least significant digit is the bottom line.

**Example**
```javascript
console.log('%s %s', 
            iChing.hexagram(63).character, 
            iChing.hexagram(63).binary);
// output: ䷾ 010101
```

#### <a name="hexagram-bottomtrigram"></a>Hexagram.bottomTrigram

Returns a `Trigram` representing the bottom 3 lines of the hexagram.

**Example**
```javascript
console.log('%s %s', 
            iChing.hexagram(8).character, 
            iChing.hexagram(8).bottomTrigram.character);
// output: ䷇ ☷
```

#### <a name="hexagram-changes"></a>Hexagram.changes

Returns an array of [`Change`](#change)s representing the 63 possible changes to the other hexagrams of the I Ching.

**Example**
```javascript
var h = iChing.hexagram(48);
var c = h.changes[0];
console.log('%s -> %s %s', h.character, c.to.character, c.binary);
// output: ䷯ -> ䷀ 101001
```

#### <a name="hexagram-character"></a>Hexagram.character

Returns a string containing the hexagram character, which is a pictogram representing the lines of the hexagram. The characters codes for these characters range from `\u4dc0` to `\u4dff` (hexadecimal character codes).

**Example**
```javascript
var c = iChing.hexagram(2).character;
console.log('%s \\u%s', c, c.charCodeAt(0).toString(16));
// output ䷁ \u4dc0
```

#### <a name="hexagram-chinesename"></a>Hexagram.chineseName

Returns a string containing the Chinese name of the hexagram.

**Example**
```javascript
console.log(iChing.hexagram(5).chineseName);
// output: 需
```

#### <a name="hexagram-lines"></a>Hexagram.lines

Returns an array of integers representing the lines of the hexagram. A value of 1 denotes a solid line. A value of 0 denotes a broken line. Lines are represented from the bottom of the hexagram to top in the array.

**Example**
```javascript
console.log('%s %j', 
            iChing.hexagram(64).character, 
            iChing.hexagram(64).lines);
// output: ䷿ [0,1,0,1,0,1]
```

#### <a name="hexagram-names"></a>Hexagram.names

Returns an array of strings containing the names of the hexagram.

**Example**
```javascript
console.log(iChing.hexagram(31).names);
// output: [ 'Conjoining', 'Influence (Wooing)' ]
```

#### <a name="hexagram-number"></a>Hexagram.number

Returns an integer which is the hexagram number. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(15).number);
// output: 15
```

#### <a name="hexagram-pinyinname"></a>Hexagram.pinyinName

Returns a string containing the [pinyin](https://en.wikipedia.org/wiki/Pinyin) representation of the Chinese name of the hexagram.

**Example**
```javascript
console.log(iChing.hexagram(5).pinyinName);
// output: xū
```

#### <a name="hexagram-toptrigram"></a>Hexagram.topTrigram

Returns a [`Trigram`](#trigram) representing the top 3 lines of the hexagram.

**Example**
```javascript
console.log('%s %s', 
            iChing.hexagram(8).character, 
            iChing.hexagram(8).topTrigram.character);
// output: ䷇ ☵
```

### <a name="hexagram-methods"></a>Methods

#### <a name="hexagram-changelines"></a>Hexagram.changeLines(lines)

Returns a [`Change`](#change) representing the change that would occur if the specified `lines` of the hexagram were changed. The `lines` parameter must be an `Array` with 6 elements whose values are either 1 or 0. Element zero of the `lines` array represents the bottom line of the hexagram and element five represents the top line. A value of 1 means the corresponding line changes. A value of 0 means that the corresponding line does not change.

**Example**
```javascript
var change = iChing.hexagram(1).changeLines([1,0,1,0,1,0]);
console.log('%s -> %s %j', 
            change.from.character, 
            change.to.character, 
            change.changingLines);
// output: ䷀ -> ䷿ [1,0,1,0,1,0]
```

#### <a name="hexagram-changeto"></a>Hexagram.changeTo(number)

Returns a [`Change`](#change) representing the change from the current hexagram to the hexagram specified by `number`. The `number` must be an integer from 1 to 64 inclusive. If `number` is the number of the current hexagram, then the method returns `null`. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).changingLines);
// output: [ 0, 0, 0, 1, 0, 1 ]
```





## <a name="reading"></a>Reading Class

The `Reading` class represents the results of a consultation with the Oracle. The yarrow stalk method is used to obtain the reading, as described in Wilhelm's translation. See [references](#references).

### <a name="reading-properties"></a>Properties

#### <a name="reading-change"></a>Reading.change

Returns the [`Change`](#change) that was divined by the Oracle of the main hexagram of the reading to one of the other hexagrams of the I Ching. This property will return `null` if there are no changed lines in the reading.

**Example**
```javascript
var reading = iChing.ask('what am I becoming?');
console.log(reading.change ? reading.change.to.number : 'nothing!');
// output (will vary due to randomness in the reading):
[ 'Bound', 'Keeping Still, Mountain' ]
```

#### <a name="reading-hexagram"></a>Reading.hexagram

Returns the [`Hexagram`](#hexagram) that was divined by the Oracle based on the question.

**Example**
```javascript
var reading = iChing.ask('which hexagram is the best for me?');
console.log(reading.hexagram.names);
// output (will very due to randomness in the reading):
[ 'Great Exceeding', 'Preponderance of the Great' ]
```






## <a name="trigram"></a>Trigram Class

The `Trigram` class represents a trigram of the I Ching. There are 8 possible `Trigram` instances.

### <a name="trigram-properties"></a>Properties

#### <a name="trigram-attribute"></a>Trigram.attribute

Returns a string containing the "attribute" of the trigram.

**Example**
```javascript
console.log(iChing.trigram(1).attribute);
// output: strong
```

#### <a name="trigram-binary"></a>Trigram.binary

Returns a string containing the binary representation of the lines of the trigram. The most significant digit is the top line and the least significant digit is the bottom line.

**Example**
```javascript
console.log('%s %s', 
            iChing.trigram(3).character, 
            iChing.trigram(3).binary);
// output: ☳ 001
```

#### <a name="trigram-character"></a>Trigram.character

Returns a string containing the trigram character, which is a pictogram representing the lines of the trigram. The characters codes for these characters range from `\u2630` to `\u2637` (hexadecimal character codes).

**Example**
```javascript
var c = iChing.trigram(2).character;
console.log('%s \\u%s', c, c.charCodeAt(0).toString(16));
// output: ☷ \u2637
```
#### <a name="trigram-chineseimage"></a>Trigram.chineseImage

Returns a string containing the Chinese "image" of the trigram.

**Example**
```javascript
console.log(iChing.trigram(5).chineseImage);
// output: 山
```

#### <a name="trigram-chinesename"></a>Trigram.chineseName

Returns a string containing the Chinese name of the trigram.

**Example**
```javascript
console.log(iChing.trigram(5).chineseName);
// output: 艮
```

#### <a name="trigram-familyrelationship"></a>Trigram.familyRelationship

Returns a string containing the "family relationship" represented by the trigram.

**Example**
```javascript
console.log(iChing.trigram(6).familyRelationship);
// output: first daughter
```

#### <a name="trigram-images"></a>Trigram.images

Returns an array of strings containing the "images" of the trigram. These are the inherent properties of nature represented by the trigram.

**Example**
```javascript
console.log(iChing.trigram(6).images);
// output: [ 'wind', 'wood' ]
```

#### <a name="trigram-lines"></a>Trigram.lines

Returns an array of integers representing the lines of the trigram. A value of 1 denotes a solid line. A value of 0 denotes a broken line. Lines are represented from bottom of the trigram to top in the array.

**Example**
```javascript
console.log('%s %j', 
            iChing.trigram(3).character, 
            iChing.trigram(3).lines);
// output: ☳ [1,0,0]
```

#### <a name="trigram-names"></a>Trigram.names

Returns an array of strings containing the names of the trigram.

**Example**
```javascript
console.log(iChing.trigram(2).names);
// output: [ 'Field', 'The Receptive' ]
```

#### <a name="trigram-number"></a>Trigram.number

Returns an integer which is the trigram number. Trigrams are numbered according to the order presented in the Wilhelm translation (see [references](#references)) as follows:

1. ☰ Force, The Creative
1. ☷ Field, The Receptive
1. ☳ Shake, The Arousing
1. ☵ Gorge, The Abysmal
1. ☶ Bound, Keeping Still
1. ☴ Ground, The Gentle
1. ☲ Radiance, The Clinging
1. ☱ Open, The Joyous

**Example**
```javascript
console.log(iChing.trigram(1).number);
// output: 1
```

#### <a name="trigram-pinyinimage"></a>Trigram.pinyinImage

Returns a string containing the pinyin representation of the Chinese "image" of the trigram.

**Example**
```javascript
console.log(iChing.trigram(5).pinyinImage);
// output: shān
```

#### <a name="trigram-pinyinname"></a>Trigram.pinyinName

Returns a string containing the [pinyin](https://en.wikipedia.org/wiki/Pinyin) representation of the Chinese name of the trigram.

**Example**
```javascript
console.log(iChing.trigram(5).pinyinName);
// output: gèn
```

### <a name="trigram-methods"></a>Methods

#### <a name="trigram-hexagrams"></a>Trigram.hexagrams(position)

Returns an array of [`Hexagram`](#hexagram)s that have the current trigram in the specified `position`. Valid values for `position` are as follows:

* `'top'` - returns the 8 hexagrams that have the current trigram in the top position. 
* `'bottom'` - returns the 8 hexagrams that have the current trigram in bottom position. 
* `undefined` - returns the 15 hexagrams that have the current trigram in either the top or bottom position. Note that one of the hexagrams will have the trigram in *both* the top and bottom positions, which is why there are a total 15 instead of 16.

**Examples**
```javascript
var hexagrams = iChing.trigram(2).hexagrams();
var numbers = [];
hexagrams.forEach((h) => {
  numbers.push(h.number);
});
console.log('%d items: %j', numbers.length, numbers);
// output: 
// 15 items: [2,7,8,11,12,15,16,19,20,23,24,35,36,45,46]
```

```javascript
var hexagrams = iChing.trigram(2).hexagrams('top');
var numbers = [];
hexagrams.forEach((h) => {
  numbers.push(h.number);
});
console.log('%d items: %j', numbers.length, numbers);
// output: 
// 8 items: [2,7,11,15,19,24,36,46]
```

# Test

```shell
npm test
```



# Change Log

##### Version 0.3.3

* Added `Trigram.hexagrams(position)` method.
* Documentation improvements in README.

##### Version 0.3.2

* Fixed minor logical error in yarrow stalk operation.

##### Version 0.3.1

* Changed `iChing.reading` method to `iChing.ask`.

##### Version 0.2.1

* Minor documentation cleanup.

##### Version 0.2.0

* Added the `Reading` class and the yarrow stalk method of obtaining a reading.
* Added `Hexagram.changeLines` method.
* Separated pinyin names from Chinese names into their own properties.

##### Version 0.1.x

* initial release

# <a name="references"></a>References

* [Wilhelm, R. & Baynes, C. (1967). The I ching; or, Book of changes. Princeton, N.J: Princeton University Press](https://www.amazon.com/Ching-Changes-Bollingen-Princeton-University/dp/069109750X) (amazon.com).

* [List of Hexagrams of the I Ching](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching) (Wikipedia).
