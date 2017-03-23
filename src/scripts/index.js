require('../css/common.css');
require('../css/index.css');
require('../lib/lib');
import _ from 'lodash'
function component () {
  var element = document.createElement('div');

  /* 需要引入 lodash，下一行才能正常工作 */
  element.innerHTML = _.join(['Hello','webpack'], ' ');

  return element;
}

document.body.appendChild(component());

console.log('jQuery:$("body").height():'+$('body').height());
var s = require('../common/meta.html');
console.log(s);