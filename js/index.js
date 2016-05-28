var sortFunc = {
  str : function(a, b, asc) {
    return (a === b ? 0 : ((a > b) * 2 - 1)) * (asc ? 1 : -1);
  },
  num : function(a, b, asc) {
    return (a - b) * (asc ? 1 : -1);
  },
  type : function(a, b, asc) {
    var toNum = function(type) {
      if(type === "cu") {
        return 0;
      } else if(type === "co") {
        return 1;
      } else if(type === "pa") {
        return 2;
      } else {
        return 3;
      }
    }
    return (toNum(a) - toNum(b)) * (asc ? 1 : -1);
  }
}

function filter(changeType, checked) {
  var table = document.getElementById("song-list");
  var length = table.rows.length;
  for(var i=0; i<length; i++) {
      var type = JSON.parse(table.rows[i].getAttribute("data-info").replace(/'/g, "\""))["type"];
      if(type === changeType) {
          table.rows[i].style.display = checked ? "" : "none";
      }
  }
}
function sort() {

  var table = document.getElementById("song-list");
  var asc = document.getElementsByName("sort")[0].checked;
  var sortType = function() {
    var e = document.getElementsByName("sorttype");
    for(var i=0; i<e.length; i++) {
      if(e[i].checked) return e[i].value
    }
    return "no";
  }();

  var cmpFunc = null;
  var cmpNumberFunc = sortFunc["num"];
  switch(sortType) {
    case "no":
      cmpFunc = null;
      break;
    case "lv":
    case "combo":
      cmpFunc = sortFunc["num"];
      break;
    case "type":
      cmpFunc = sortFunc["type"];
      break;
    case "title":
      cmpFunc = sortFunc["str"];
      break;
  }

  var length = table.rows.length;
  var start = new Date();

  var values = [];
  var numbers = [];
  for(var i=0; i<length; i++) {

    numbers.push(JSON.parse(table.rows[i].getAttribute("data-info").replace(/'/g, "\""))["no"]);
    values.push(JSON.parse(table.rows[i].getAttribute("data-info").replace(/'/g, "\""))[sortType]);
  }

  var process = [];
  for(var i=1; i<length; i++) {
    if(cmpNumberFunc(numbers[i], numbers[i-1], asc) < 0) {
      for(var j=i-1; j>=0 && cmpNumberFunc(numbers[i], numbers[j], asc) < 0; j--){}
      var tmp = numbers[i];
      numbers.splice(i, 1);
      numbers.splice(j+1, 0, tmp);
      tmp = values[i];
      values.splice(i, 1);
      values.splice(j+1, 0, tmp);
      process.push([i, j]);
    }
  }
  if(cmpFunc !== null) {
    for(var i=1; i<length; i++) {
      if(cmpFunc(values[i], values[i-1], asc) < 0) {
        for(var j=i-1; j>=0 && cmpFunc(values[i], values[j], asc) < 0; j--){}
        var tmp = values[i];
        values.splice(i, 1);
        values.splice(j+1, 0, tmp);
        process.push([i, j]);
      }
    }
  }
  for(var i in process) {
    var fromIndex = process[i][0];
    var toIndex = process[i][1] + 1;
    var clone = table.rows[fromIndex].cloneNode(true);
    table.deleteRow(fromIndex)
    var r = table.insertRow(toIndex);
    r.parentNode.replaceChild(clone, r);
  }
}
