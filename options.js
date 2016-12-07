var input = document.querySelector('#clubname');

var dataObj = { 'clubs': []};

function getDataFromQuery() {
  var query = input.value;

  var dataUrl = 'http://www.sponsorkliks.com/sdk/Functions/ajax.php?m=Club&c=search_club_by_naam&r%5bk%5d=sk_id&r%5bv%5d=clubnaam_concat&p=' + encodeURIComponent(query);
  var x = new XMLHttpRequest();
  x.open('GET', dataUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || response.length === 0) {
      console.log("ERROR: Bad response from server:" + response);
      return;
    }
    displayOptions(response);
  };
  x.send();
}

function displayOptions(options) {
  console.log(options);
  var body = document.querySelector('#search_output');
  body.innerHTML = "";
    var tbl = document.createElement('table');
    tbl.style.width = '40%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < options.length; i++) {
        var tr = document.createElement('tr');
        var option = options[i];
        
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(option['clubnaam_volledig']))
        tr.appendChild(td)

        td = document.createElement('td');
        td.appendChild(document.createTextNode(option['city']))
        tr.appendChild(td)

        td = document.createElement('td');
        var element = document.createElement("input");
        element.setAttribute("type", "button");
        element.setAttribute("value", "Add");
        element.setAttribute("name", "button_" + option['value']);
        element.params = {'name': option['clubnaam_volledig'], 'id': option['value']};
        element.addEventListener("click", function(e) {
            add_club(e.target.params['id'], e.target.params['name']);
        }, false);
        td.appendChild(element);
        tr.appendChild(td);

        tbdy.appendChild(tr);
    }
    
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}

function add_club(id, name) {
    chrome.storage.sync.get({
      dataObj
    }, function(obj) {
        console.log(obj);
        var data = obj;
        data.dataObj.clubs.push({'id': id, 'name': name});
        dataObj = data.dataObj;
        chrome.storage.sync.set({
            dataObj
        }, function(){});
    });
    alert(id);
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      dataObj
    }, function(items) {
      console.log(items);
    });
}
document.querySelector('input').addEventListener('input', getDataFromQuery);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);