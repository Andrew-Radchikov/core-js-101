/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */

function fromJSON(proto, json) {
  const ourObj = JSON.parse(json);
  const keys = Object.keys(ourObj);
  const values = [];
  keys.map((elem) => values.push(ourObj[elem]));
  const obj = Object.create(proto);
  keys.map((element) => {
    obj[element] = ourObj[element];
    return element;
  });
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests. */


const cssSelectorBuilder = {
  selector: '',
  elem: 0,
  aidi: 0,
  pseudo: 0,
  position: 0,


  isError(nowPos) {
    if (this.position > nowPos) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  },

  addText(value, mark) {
    const select = { ...this };
    this.isError(mark);
    select.position = mark;
    switch (mark) {
      case 1:
        if (select.elem > 0) {
          throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        } else {
          select.elem = 1;
        }
        break;
      case 2: if (select.aidi > 0) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      } else {
        select.aidi = 1;
      } break;
      case 6:
        if (select.pseudo > 0) {
          throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        } else {
          select.pseudo = 1;
        }
        break;
      default: break;
    }
    select.selector = this.selector + value;
    return select;
  },

  stringify() {
    return this.selector;
  },

  element(value) {
    return this.addText(value, 1);
  },

  id(value) {
    return this.addText(`#${value}`, 2);
  },

  class(value) {
    return this.addText(`.${value}`, 3);
  },

  attr(value) {
    return this.addText(`[${value}]`, 4);
  },

  pseudoClass(value) {
    return this.addText(`:${value}`, 5);
  },

  pseudoElement(value) {
    return this.addText(`::${value}`, 6);
  },

  combine(selector1, combinator, selector2) {
    const select = { ...this };
    select.selector = `${selector1.selector} ${combinator} ${selector2.selector}`;
    return select;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
