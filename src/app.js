/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var serverUrl = 'http://pi.amcolash.com';
var port = 4000;
var configUrl = 'http://pi.amcolash.com/pebblewake/index.html';

var options = [{}];

Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  console.log(configUrl + getUrl());
  Pebble.openURL(configUrl + getUrl());
});

Pebble.addEventListener('webviewclosed',
  function(e) {
    var configuration = JSON.parse(decodeURIComponent(e.response));
//     console.log('Configuration window returned: ', JSON.stringify(configuration));
    options = [{}];
    for(var key in configuration) {
      var attrName = key;
      var attrValue = configuration[key];
      
      console.log(attrName + ": " + attrValue);
      options[0][attrName] = attrValue;
    }
    setOptions(options);
//     console.log(JSON.stringify(options));
  }
);

function getUrl() {
  var url = '?';
  if (options) {
    for(var key in options[0]) {
      console.log(key + ": " + options[0][key]);
      url += key + "=" + options[0][key] + '&';
    }
  }
//   console.log(url);
  return url;
}

function getOptions() {
  options = JSON.parse(localStorage.getItem('options'));
//   console.log(JSON.stringify(options));
}

function setOptions() {
  clearOptions();
  localStorage.setItem('options', JSON.stringify(options));
}

function clearOptions() {
  localStorage.clear();
}

getOptions();

var titles = [];
if (options !== null) {
  for (var i = 0; i < options.length; i++) {
    titles.push({title: options[i].name});
  }
}

var menu = new UI.Menu({
  sections: [{
    items: titles
  }]
});

menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  var computer = options[e.itemIndex];
  console.log(JSON.stringify(computer));
  
  var card = new UI.Card({
    title: 'Attempting to wake up...'
  });
  card.show();
  
  ajax(
    {
      url: serverUrl + ":" + port,
      type: 'json',
      medthod: 'put',
      headers: computer
    },
    function(success) {
      // Success!
      console.log('Successfully sent wake up!');
      card.title('Successfully sent wake up');
    },
    function(error) {
      // Failure!
      console.log('Failed waking somewhere: ' + error);
      card.title('Something went wrong :(');
      card.body(error);
    }
  );
});

menu.show();