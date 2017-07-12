# i-ching
Node.js library and API for working with the I Ching, including as a graph.

```javascript
var iChing = require('i-ching');

console.log(iChing.trigram(8));
/* output:
Trigram {
  number: 8,
  names: [ 'Open', 'The Joyous' ],
  chineseName: '兌 (duì)',
  character: '☱',
  attribute: 'joyful',
  images: [ 'swamp', 'lake' ],
  chineseImage: '澤 (zé)',
  familyRelationship: 'third daughter',
  binary: '011',
  lines: [ 1, 1, 0 ] }
*/

console.log(iChing.hexagram(3));
/* output:
Hexagram {
  number: 3,
  names: [ 'Sprouting', 'Difficulty at the Beginning' ],
  chineseName: '屯 (zhūn)',
  character: '䷂',
  topTrigram:
   Trigram {
     number: 4,
     names: [ 'Gorge', 'The Abysmal' ],
     chineseName: '坎 (kǎn)',
     character: '☵',
     attribute: 'dangerous',
     images: [ 'water' ],
     chineseImage: '水 (shuǐ)',
     familyRelationship: 'second son',
     binary: '010',
     lines: [ 0, 1, 0 ] },
  bottomTrigram:
   Trigram {
     number: 3,
     names: [ 'Shake', 'The Arousing' ],
     chineseName: '震 (zhèn)',
     character: '☳',
     attribute: 'inciting movement',
     images: [ 'thunder' ],
     chineseImage: '雷 (léi)',
     familyRelationship: 'first son',
     binary: '001',
     lines: [ 1, 0, 0 ] },
  binary: '010001',
  lines: [ 1, 0, 0, 0, 1, 0 ] }
/*
```
# Installation

```shell
npm install i-ching
```

# API

## iChing Module

```javascript
var iChing = require('i-ching');
```

### Properties

#### iChing.hexagrams

Returns an array containing the 64 [`Hexagram`](#hexagram)s.

**Example**
```javascript
console.log(iChing.hexagrams.length);
// output: 64
```

#### iChing.trigrams

Returns an array containing the 8 [`Trigram`](#trigram)s.

**Example**
```javascript
console.log(iChing.trigrams.length);
// output: 8
```

### Methods

#### iChing.asGraph()

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

#### iChing.hexagram(number)

Returns the [`Hexagram`](#hexagram) corresponding to the `number`. The `number` must be an integer from 1 to 64 inclusive. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(22).names);
// output: [ 'Adorning', 'Grace' ]
```

#### iChing.trigram(number)

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

#### iChing.trigramSequence(name)

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

## <a name="trigram"></a>Trigram

### Properties

#### Trigram.attribute

Returns a string containing the "attribute" of the trigram.

**Example**
```javascript
console.log(iChing.trigram(1).attribute);
// output: strong
```

#### Trigram.binary

Returns a string containing the binary representation of the lines of the trigram. The most significant digit is the top line and the least significant digit is the bottom line.

**Example**
```javascript
console.log('%s %s', iChing.trigram(3).character, iChing.trigram(3).binary);
// output: ☳ 001
```

#### Trigram.character

Returns a string containing the trigram character, which is a pictogram representing the lines of the trigram. The characters codes for these characters range from `\u9776` to `\u9783`.

**Example**
```javascript
var c = iChing.trigram(2).character;
console.log('%s \\u%s', c, c.charCodeAt(0));
// output ☷ \u9783
```

#### Trigram.chineseName

Returns a string containing the Chinese name of the trigram, with the [pinyin](https://en.wikipedia.org/wiki/Pinyin) representation in parentheses.

**Example**
```javascript
console.log(iChing.trigram(5).chineseName);
// output: 艮 (gèn)
```

#### Trigram.familyRelationship

Returns a string containing the "family relationship" represented by the trigram.

**Example**
```javascript
console.log(iChing.trigram(6).familyRelationship);
// output: first daughter
```

#### Trigram.images

Returns an array of strings containing the "images" of the trigram. These are the inherent properties of nature represented by the trigram.

**Example**
```javascript
console.log(iChing.trigram(6).images);
// output: [ 'wind', 'wood' ]
```

#### Trigram.lines

Returns an array of integers representing the lines of the trigram. A value of 1 denotes a solid line. A value of 0 denotes a broken line. Lines are represented from bottom of the trigram to top in the array.

**Example**
```javascript
console.log('%s %j', iChing.trigram(3).character, iChing.trigram(3).lines);
// output: ☳ [1,0,0]
```

#### Trigram.names

Returns an array of strings containing the names of the trigram.

**Example**
```javascript
console.log(iChing.trigram(2).names);
// output: [ 'Field', 'The Receptive' ]
```

#### Trigram.number

Returns an integer which is the trigram number. Trigrams are numbered as follows:

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

## <a name="hexagram"></a>Hexagram

### Properties

#### Hexagram.binary

Returns a string containing the binary representation of the lines of the hexagram. The most significant digit is the top line and the least significant digit is the bottom line.

**Example**
```javascript
console.log('%s %s', iChing.hexagram(63).character, iChing.hexagram(63).binary);
// output: ䷾ 010101
```

#### Hexagram.bottomTrigram

Returns a `Trigram` representing the bottom 3 lines of the hexagram.

**Example**
```javascript
console.log('%s %s', iChing.hexagram(8).character, iChing.hexagram(8).bottomTrigram.character);
// output: ䷇ ☷
```

#### Hexagram.changes

Returns an array of [`Change`](#change)s representing the 63 possible changes to the other hexagrams of the I Ching.

**Example**
```javascript
var h = iChing.hexagram(48);
var c = h.changes[0];
console.log('%s -> %s %s', h.character, c.to.character, c.binary);
// output: ䷯ -> ䷀ 101001

#### Hexagram.character

Returns a string containing the hexagram character, which is a pictogram representing the lines of the hexagram. The characters codes for these characters range from `\u19904` to `\u19967'.

**Example**
```javascript
var c = iChing.hexagram(2).character;
console.log('%s \\u%s', c, c.charCodeAt(0));
// output ䷁ \u19905
```

#### Hexagram.chineseName

Returns a string containing the Chinese name of the hexagram, with the [pinyin](https://en.wikipedia.org/wiki/Pinyin) representation in parentheses.

**Example**
```javascript
console.log(iChing.hexagram(5).chineseName);
// output: 需 (xū)
```

#### Hexagram.lines

Returns an array of integers representing the lines of the hexagram. A value of 1 denotes a solid line. A value of 0 denotes a broken line. Lines are represented from the bottom of the hexagram to top in the array.

**Example**
```javascript
console.log('%s %j', iChing.hexagram(64).character, iChing.hexagram(64).lines);
// output: ䷿ [0,1,0,1,0,1]
```

#### Hexagram.names

Returns an array of strings containing the names of the hexagram.

**Example**
```javascript
console.log(iChing.hexagram(31).names);
// output: [ 'Conjoining', 'Influence (Wooing)' ]
```

#### Hexagram.number

Returns an integer which is the hexagram number. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(15).number);
// output: 15
```

#### Hexagram.topTrigram

Returns a [`Trigram`](#trigram) representing the top 3 lines of the hexagram.

**Example**
```javascript
console.log('%s %s', iChing.hexagram(8).character, iChing.hexagram(8).topTrigram.character);
// output: ䷇ ☵
```

### Methods

#### Hexagram.changeTo(number)

Returns a [`Change`](#change) representing the change from the current hexagram to the hexagram specified by `number`. The `number` must be an integer from 1 to 64 inclusive. If `number` is the number of the current hexagram, then the method returns `null`. Hexagrams are numbered according to the [traditional sequence](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching).

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).changingLines);
// output: [ 0, 0, 0, 1, 0, 1 ]
```

## Change

### Properties

#### <a name="change-binary"></a>Change.binary

Returns a string containing the binary representation of the change lines. The most significant digit represents the top line and the least significant digit represents the bottom line. A bit value of 1 means the line changed, and a value of 0 means it did not change.

**Example**
```javascript
var h = iChing.hexagram(5);
var c = h.changeTo(1);
console.log('%s -> %s %s', c.from.character, c.to.character, c.binary);
// output: ䷄ -> ䷀ 101000
```

#### Change.changingLines

Returns an array of integers representing the changing lines. A value of 1 denotes a changed line. A value of 0 denotes an unchanged line. Lines are represented from the bottom of the hexagram to top in the array.

**Example**
```javascript
var h = iChing.hexagram(5);
var c = h.changeTo(1);
console.log('%s -> %s %s', c.from.character, c.to.character, c.changingLines);
// output: ䷄ -> ䷀ [ 0, 0, 0, 1, 0, 1 ]
```

#### Change.from

Returns the [`Hexagram`](#hexagram) from which the change originated.

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).from.number);
// output: 5
```

#### Change.to

Returns the [`Hexagram`](#hexagram) which results from the change.

**Example**
```javascript
console.log(iChing.hexagram(5).changeTo(1).from.number);
// output: 1
```
# Test

```shell
npm test
```

# References

* [Wilhelm, R. & Baynes, C. (1967). The I ching; or, Book of changes. Princeton, N.J: Princeton University Press](https://www.amazon.com/Ching-Changes-Bollingen-Princeton-University/dp/069109750X) (amazon.com).

* [List of Hexagrams of the I Ching](https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching) (Wikipedia).
