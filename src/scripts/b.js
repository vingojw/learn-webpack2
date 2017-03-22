require('../css/common.css');
require('../css/b.css');
require('../lib/lib.js');
import _ from 'lodash';
function component () {
  var element = document.createElement('div');

  /* 需要引入 lodash，下一行才能正常工作 */
  element.innerHTML = _.join(['Hello','b.html'], ' ');

  return element;
}

document.body.appendChild(component());
