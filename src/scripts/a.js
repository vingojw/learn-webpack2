// require('../css/a.css');
function component () {
  var element = document.createElement('div');

  /* 需要引入 lodash，下一行才能正常工作 */
  element.innerHTML = _.join(['Hello','a.html'], ' ');

  return element;
}

document.body.appendChild(component());
