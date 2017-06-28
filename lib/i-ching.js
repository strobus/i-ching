'use strict';

const data = require('./data.json');
const _ = require('lodash');
const util = require('util');

const trigramSequences = {
  earlierHeaven: [1,6,4,5,2,3,7,8],
  laterHeaven: [7,2,8,1,4,5,3,6]
};

const iChing = {};
module.exports = iChing;

class Trigram {
  constructor(number) {
    assertValidTrigramNumber(number);
    _.forOwn(data.trigrams[number - 1], (value, key) => {
      this[key] = value;
    });
  }
}

class Change {
  constructor(from, to) {
    if (!(from instanceof Hexagram)) {
      assertValidHexagramNumber(from);
      from = iChing.hexagram(from);
    }
    this.from = from;

    if (!(to instanceof Hexagram)) {
      assertValidHexagramNumber(to);
      to = iChing.hexagram(to);
    }
    this.to = to;

    let changeValue = parseInt(from.binary,2) ^ parseInt(to.binary,2); //xor
    this.binary = toBinaryString(changeValue);
    this.changingLines = _.map(this.binary, (char) => {
      return parseInt(char);
    }).reverse();
  }
}

class Hexagram {
  constructor(number) {
    assertValidHexagramNumber(number);
    _.forOwn(data.hexagrams[number - 1], (value, key) => {
      if (key == 'topTrigram') {
        this.topTrigram = iChing.trigram(value);
      }
      else if (key == 'bottomTrigram') {
        this.bottomTrigram = iChing.trigram(value);
      }
      else {
        this[key] = value;
      }
    });
  }

  changeTo(number) {
    assertValidHexagramNumber(number);
    if (this.number == number) {
      return null;
    }
    let h2 = iChing.hexagram(number);
    return new Change(this, h2);
  }

  get changes() {
    if (!this._changes) {
      this._changes = _(_.range(1,65))
      .map((h2) => {
        return new Change(this, h2);
      }).remove((c, i, a) => {
        return (c.binary != '000000'); //remove hexagram change to itself
      }).value();
    }
    return this._changes;
  }
}

function initialize() {

  iChing.trigram = function trigram(number) {
    assertValidTrigramNumber(number);
    return iChing.trigrams[number - 1];
  };

  iChing.trigramSequence = function trigramSequence(name) {
    if (!_.has(trigramSequences, name)) {
      let names = _.map(trigramSequences, (s, name) => { return name; });
      throw new RangeError('name must be a trigram sequence name: ' + names.join(', '));
    }

    let seq = trigramSequences[name];
    return _.map(seq, (number) => {
      return iChing.trigram(number);
    });
  }

  iChing.hexagram = function hexagram(number) {
    assertValidHexagramNumber(number);
    return iChing.hexagrams[number - 1];
  };

  iChing.trigrams = _.map(_.range(1,9), (n) => {
    return new Trigram(n);
  });

  iChing.hexagrams = _.map(_.range(1,65), (n) => {
    return new Hexagram(n);
  });

  iChing.asGraph = function asGraph() {
    if (iChing._graph) {
      return iChing._graph;
    }

    let graph = {
      nodes: [],
      edges: []
    };

    // iterate trigrams
    _.forEach(iChing.trigrams, (t) => {

      // create trigram node
      graph.nodes.push({
        id: 't' + t.number,
        type: 'trigram',
        name: t.character,
        number: t.number
      });

    });

    // iterate hexagrams
    _.forEach(iChing.hexagrams, (h) => {
      let id = 'h' + h.number;

      // create hexagram node
      graph.nodes.push({
        id: id,
        type: 'hexagram',
        name: h.character,
        number: h.number
      });

      // create an edge to the bottom trigram
      graph.edges.push({
        id: util.format('%s-t%d-bottom', id, h.bottomTrigram.number),
        from: id,
        to: 't' + h.bottomTrigram.number,
        name: 'bottom'
      });

      // create an edge to the top trigram
      graph.edges.push({
        id: util.format('%s-t%d-top', id, h.topTrigram.number),
        from: id,
        to: 't' + h.topTrigram.number,
        name: 'top'
      });

      let changes = h.changes;

      // iterate changes
      _.forEach(changes, (c) => {
        // create an edge to each change hexagram
        graph.edges.push({
          id: id + '-h' + c.to.number,
          from: id,
          to: 'h' + c.to.number,
          name: c.binary
        });

      });
    });

    iChing._graph = graph;
    return graph;
  };
}

function assertValidTrigramNumber(number) {
  if (!_.isInteger(number) || number < 1 || number > 8) {
    throw new RangeError('number must be an integer between 1 and 8');
  }
}

function assertValidHexagramNumber(number) {
  if (!_.isInteger(number) || number < 1 || number > 64) {
    throw new RangeError('number must be an integer between 1 and 64');
  }
}

function toBinaryString(i) {
  return pad((i >>> 0).toString(2), 6);
}

function pad(num, size) {
  var s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
}

initialize();
