const expect = require('expect');
const iChing = require('../lib/i-ching.js');
const data = require('../lib/data.json');
const _ = require('lodash');

describe('iChing', () => {

  describe('initialization', () => {

    it('should create 8 trigrams', () => {
      expect(iChing.trigrams.length).toBe(8);
    });

    it('should create 64 hexagrams', () => {
      expect(iChing.hexagrams.length).toBe(64);
    });
  });

  describe('#trigram', () => {

    it('should return the requested trigram', () => {
      let t = iChing.trigram(1);
      expect(t.number).toBe(1);

      t = iChing.trigram(5);
      expect(t.number).toBe(5);
    });

    it('should throw when requested trigram is out of range', () => {
      expect(() => {
        let t = iChing.trigram(0);
      }).toThrow('number must be an integer between 1 and 8');

      expect(() => {
        let t = iChing.trigram(9);
      }).toThrow('number must be an integer between 1 and 8');

      expect(() => {
        let t = iChing.trigram(5.2);
      }).toThrow('number must be an integer between 1 and 8');

      expect(() => {
        let t = iChing.trigram('5');
      }).toThrow('number must be an integer between 1 and 8');

      expect(() => {
        let t = iChing.trigram();
      }).toThrow('number must be an integer between 1 and 8');
    });
  });

  describe('#trigramSequence', () => {

    it('should return the sequence', () => {
      let s = iChing.trigramSequence('earlierHeaven');
      expect(s.length).toBe(8);
      expect(s[0].number).toBe(1);
    });

    it('should throw on unrecognized name', () => {
      expect(() => {
        let s = iChing.trigramSequence('unrecognized');
      }).toThrow('name must be a trigram sequence name: earlierHeaven, laterHeaven');
    });
  });

  describe('#hexagram', () => {

    it('should return the requested hexagram', () => {
      let h = iChing.hexagram(1);
      expect(h.number).toBe(1);

      h = iChing.hexagram(39);
      expect(h.number).toBe(39);
    });

    it('should throw when requested hexagram is out of range', () => {
      expect(() => {
        let h = iChing.hexagram(0);
      }).toThrow('number must be an integer between 1 and 64');

      expect(() => {
        let h = iChing.hexagram(65);
      }).toThrow('number must be an integer between 1 and 64');

      expect(() => {
        let h = iChing.hexagram(5.2);
      }).toThrow('number must be an integer between 1 and 64');

      expect(() => {
        let h = iChing.hexagram('5');
      }).toThrow('number must be an integer between 1 and 64');

      expect(() => {
        let h = iChing.hexagram();
      }).toThrow('number must be an integer between 1 and 64');
    });

  });

  describe('#ask', () => {

    it('should return a Reading object with a hexagram even if no changed lines', () => {
      // get a reading that has no changed lines
      let r;
      while (!r || r.change != null) {
        r = iChing.ask('get me an unchanged reading!');
      }
      expect(r.hexagram).toExist();
      expect(r.change).toNotExist();
    });

    it('should return a Reading with a hexagram and a change', () => {
      // get a reading that has changed lines
      let r;
      while (!r || r.change == null) {
        r = iChing.ask('get me a reading that has changes!');
      }
      expect(r.hexagram).toExist();
      expect(r.change).toExist();
      expect(r.change.from.number).toBe(r.hexagram.number);
      expect(parseInt(r.change.binary,2)).toBe(parseInt(r.hexagram.binary,2) ^ parseInt(r.change.to.binary,2));
    });
  });

  describe('#asGraph', () => {

    it('should return an object with 72 nodes and 4160 edges', () => {
      let g = iChing.asGraph();
      expect(g.nodes.length).toBe(72);
      expect(g.edges.length).toBe(64*63 + 64*2);
    });

    it('should populate node data', () => {
      let g = iChing.asGraph();
      expect(g.nodes[0].id).toBe('t1');
      expect(g.nodes[0].type).toBe('trigram');
      expect(g.nodes[0].name).toBe('☰');
      expect(g.nodes[0].number).toBe(1);

      expect(g.nodes[8].id).toBe('h1');
      expect(g.nodes[8].type).toBe('hexagram');
      expect(g.nodes[8].name).toBe('䷀');
      expect(g.nodes[8].number).toBe(1);
    });

    it('should populate edge data', () => {
      let g = iChing.asGraph();
      expect(g.edges[0].id).toBe('h1-t1-bottom');
      expect(g.edges[0].from).toBe('h1');
      expect(g.edges[0].to).toBe('t1');
      expect(g.edges[0].name).toBe('bottom');

      expect(g.edges[2].id).toBe('h1-h2');
      expect(g.edges[2].from).toBe('h1');
      expect(g.edges[2].to).toBe('h2');
      expect(g.edges[2].name).toBe('111111');
    });
  });
});

describe('Hexagram', () => {

  describe('#constructor', () => {

    it('should set data from data.json', () => {
      let h = iChing.hexagram(1);
      expect(h.number).toBe(1);
      expect(h.names).toInclude('Force');
      expect(h.names).toInclude('The Creative');
      expect(h.chineseName).toBe('乾');
      expect(h.pinyinName).toBe('qián');
      expect(h.character).toBe('䷀');
      expect(h.binary).toBe('111111');
      expect(h.lines.length).toBe(6);
      expect(h.lines).toContain(1);
      expect(h.lines).toNotContain(0);
      expect(h.topTrigram.number).toBe(1);
      expect(h.bottomTrigram.number).toBe(1);
    });
  });

  describe('#changeTo', () => {
    it('should return correct change', () => {
      let h = iChing.hexagram(1);
      let c = h.changeTo(2);
      expect(c.from.number).toBe(1);
      expect(c.to.number).toBe(2);
      expect(c.binary).toBe('111111');
      expect(c.changingLines.length).toBe(6);
      expect(c.changingLines).toContain(1);
      expect(c.changingLines).toNotContain(0);
    });

    it('should return null if hexagram number is the same', () => {
      let h = iChing.hexagram(5);
      expect(h.changeTo(5)).toNotExist();
    })
  });

  describe('#changeLines', () => {
    it ('should return a change with specified lines changed', () => {
      let h = iChing.hexagram(1);
      let c = h.changeLines([1,0,1,0,1,0]);
      expect(c.to.number).toBe(64);
      expect(c.binary).toBe('010101');
    });
  });

  describe('#changes', () => {
    if('should return 63 changes', () => {
      let h = iChing.hexagram(1);
      let changes = h.changes;
      expect(changes.length).toBe(63);
      expect(changes).toNotContain('000000', (v1,v2) => {
        return v1.binary == v2;
      });
    });
  });
});

describe('Trigram', () => {

  describe('#constructor', () => {

    it('should set data from data.json', () => {
      let t = iChing.trigram(2);
      expect(t.number).toBe(2);
      expect(t.names).toInclude('Field');
      expect(t.names).toInclude('The Receptive');
      expect(t.chineseName).toBe('坤');
      expect(t.pinyinName).toBe('kūn');
      expect(t.character).toBe('☷');
      expect(t.binary).toBe('000');
      expect(t.lines.length).toBe(3);
      expect(t.lines).toContain(0);
      expect(t.lines).toNotContain(1);
      expect(t.attribute).toBe('devoted, yielding');
      expect(t.images.length).toBe(1);
      expect(t.images).toContain('earth');
      expect(t.chineseImage).toBe('地');
      expect(t.pinyinImage).toBe('dì');
      expect(t.familyRelationship).toBe('mother');
    });
  });

  describe('#hexagrams', () => {
    it('should return 15 hexagrams when undefined is passed', () => {
      let t = iChing.trigram(2);
      let hexes = t.hexagrams();
      expect(hexes.length).toBe(15);

      _.forEach(hexes, (h) => {
        let test = (h.topTrigram.number == t.number) || (h.bottomTrigram.number == t.number);
        expect(test).toBe(true);
      });
    });

    it('should return 8 hexagrams when "top" is passed', () => {
      let t = iChing.trigram(2);
      let hexes = t.hexagrams('top');
      expect(hexes.length).toBe(8);

      _.forEach(hexes, (h) => {
        let test = (h.topTrigram.number == t.number);
        expect(test).toBe(true);
      });
    });

    it('should return 8 hexagrams when "bottom" is passed', () => {
      let t = iChing.trigram(2);
      let hexes = t.hexagrams('bottom');
      expect(hexes.length).toBe(8);

      _.forEach(hexes, (h) => {
        let test = (h.bottomTrigram.number == t.number);
        expect(test).toBe(true);
      });
    });
  });
});
