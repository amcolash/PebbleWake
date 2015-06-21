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

var options = [];
var titles = [];
var card, menu;

Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  console.log(configUrl + getUrl());
  Pebble.openURL(configUrl + getUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e.response !== "") {
    var configuration = JSON.parse(decodeURIComponent(e.response));
    //     console.log('Configuration window returned: ', JSON.stringify(configuration));
    options = [{}];
    for(var key in configuration) {
      var attrName = key;
      var attrValue = configuration[key];

//       console.log(attrName + ": " + attrValue);
      options[0][attrName] = attrValue;
    }
    setOptions(options);
    //     console.log(JSON.stringify(options));
  }
});

function getUrl() {
  var url = '?';
  if (options) {
    for(var key in options[0]) {
      url += (key + '=' + options[0][key] + '&');
    }
  }
//   console.log(url);
  return url;
}

function getOptions() {
  options = JSON.parse(localStorage.getItem('options'));
  
  card.hide();
  menu.hide();
  
  if (options !== null) {
    if (options.length > 0) {
      titles = [];
      for (var i = 0; i < options.length; i++) {
        titles.push({title: options[i].name});
      }
      menu.items(0, titles);
      menu.show();
    } else {
      card.show();
    }
  } else {
    card.show();
  }
//   console.log(JSON.stringify(options));
}

function setOptions() {
  localStorage.clear();
  localStorage.setItem('options', JSON.stringify(options));
  getOptions();
}

function clearOptions() {
  localStorage.clear();
  options = [];
  titles = [];
}

card = new UI.Card({
  title: 'Please set up WOL via the app configuration',
  action: {
    select: 'images/close.png'
  },
  icon: 'images/close.png'
});

menu = new UI.Menu({
  sections: [{
    items: titles
  }]
});

menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  var computer = options[e.itemIndex];
  console.log(JSON.stringify(computer));
  
  card = new UI.Card({
    title: 'Attempting to wake up...'
  });
  card.show();
  
  ajax(
    {
      url: serverUrl + ":" + port,
      method: 'put',
      headers: computer
    },
    function(data) {
      // Success!
      console.log('Successfully sent wake up!');
      card.title('Successfully sent wake up');
    },
    function(error) {
      // Failure!
      console.log('Failed waking: ' + error);
      card.title('Something went wrong :(');
      card.body(error);
    }
  );
});

// Main app init
getOptions();