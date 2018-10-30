import _xyz from '../../_xyz.mjs';

export default (table, record, tr) => {

  tr.classList.add('tr_streetview');
  
  let td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      className: 'td_streetview',
      colSpan: '2'
    },
    appendTo: tr
  });
  
  _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'div_streetview'
    },
    appendTo: td
  });
  
  let a = _xyz.utils.createElement({
    tag: 'a',
    options: {
      href: 'https://www.google.com/maps?cbll=' + record.location.marker[1] + ',' + record.location.marker[0] + '&layer=c',
      target: '_blank'
    },
    appendTo: td
  });
  
  _xyz.utils.createElement({
    tag: 'img',
    options: {
      className: 'img_streetview',
      src: _xyz.host + '/proxy/image?uri=https://maps.googleapis.com/maps/api/streetview?location=' + record.location.marker[1] + ',' + record.location.marker[0] + '&size=290x230&provider=GOOGLE&token=' + _xyz.token
    },
    appendTo: a
  });
  
  table.appendChild(tr);
};