function saveOptions() {
  var options = {};
  var valid = true;
  var macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  var ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  var domainRegex = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(\?([-a-zA-Z0-9@:%_\+.~#?&//=]+)|)$/;

  //Add all textual values
  $('textarea, select, [type="hidden"], [type="password"], [type="text"], [type="number"], [type="range"]').each(function () {
    options[$(this).attr('id')] = $(this).val();
  });

  //Add all checkbox type values
  $('[type="radio"], [type="checkbox"]').each(function () {
    options[$(this).attr('id')] = $(this).is(':checked');
  });

  if (!$('#name').val()) {
    alert('Invalid Computer Name');
    valid = false;
  }

  if (!macRegex.test($('#mac').val())) {
    alert('Invalid MAC Address');
    valid = false;
  }

  if (!ipRegex.test($('#ip').val()) && !domainRegex.test($('#ip').val())) {
    alert('Invalid IP Address/Domain');
    valid = false;
  }

  if (valid) {
    return options;
  } else {
    return null;
  }
}

function getQueryParam(variable, defaultValue) {
  // Find all URL parameters
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=').replace('%20', ' ');

    // If the query variable parameter is found, decode it to use and return it for use
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

$().ready(function () {
  $("#b-cancel").click(function () {
    console.log("Cancel");
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent('{}');
  });

  $("#b-submit").click(function () {
    console.log("Submit");

    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    var options = saveOptions();

    if (options !== null) {
      var location = return_to + encodeURIComponent(JSON.stringify(options));
      console.log("Warping to: " + location);
      console.log(location);
      document.location = location;
    }
  });

  //Set form values to whatever is passed in.
  var i, variable, name, value;

  if (window.location.search.substring(1) !== "") {
    var props = window.location.search.substring(1).split("&");
    for (i = 0; i < props.length; i++) {
      variable = props[i].split("=");
      name = variable[0];
      value = variable[1];
      if (value === 'true' || value === 'false' ) {
        $('#' + name).prop('checked', (value === 'true') ? true : false).checkboxradio('refresh');
      } else {
        $("#" + name).val(value);
      }
//      $("#" + [key]).val(obj[key]).slider("refresh");
    }
  }
});
