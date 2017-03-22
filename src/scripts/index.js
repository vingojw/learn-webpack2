// require('../css/index.css');
import _ from 'lodash'
function component () {
  var element = document.createElement('div');

  /* 需要引入 lodash，下一行才能正常工作 */
  element.innerHTML = _.join(['Hello','webpack'], ' ');

  return element;
}

document.body.appendChild(component());

var moment = require('moment');
console.log(moment().format());