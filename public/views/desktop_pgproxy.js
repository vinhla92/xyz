document.getElementById('btnInputPG').onclick = () => document.getElementById('fileInputPG').click();
  
document.getElementById('fileInputPG').addEventListener('change', function () {

  let reader = new FileReader();
  reader.onload = function () {
    try {
      send(this.result);

    } catch (err) {
      alert('Failed to parse JSON');
    }
  };
  reader.readAsText(this.files[0]);

  function send(text) {

    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST', _xyz.host + '/proxy/pg?' +
      _xyz.utils.paramString({
        locale: _xyz.workspace.locale.key,
        token: _xyz.token
      })
    );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = e => {

      if (e.target.status !== 200) alert('I am not here. This is not happening.');

      alert(JSON.stringify(e.target.response)); 

    };

    var _text = text.split(/\r?\n/);

    var header = _text.shift().split(';');
    
    var _list = _text.map(row => {

      if (!row.length) return;

      _row = row.split(';');

      let o = {};

      for (i = 0; i < header.length; i++) {

        o[header[i]] = _row[i];

      }

      return o

    }).filter(o => {
      return typeof o === 'object';
    });

    xhr.send(JSON.stringify(_list));

  };

});