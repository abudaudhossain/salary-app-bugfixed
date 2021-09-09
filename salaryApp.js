// Initialize Chart
function initializeChart(data) {
  var chartData = formatChartData(data);
  drawChart(chartData);
}

const formatChartData = function (data) {
  const chartItems = getChartItems(data);

  const dataWithUniqueName = uniquifyNames(chartItems);

  return [
    {
      key: "unnecessary data",
      values: dataWithUniqueName,
    },
  ];
};

const getChartItems = function (data) {
  const chartItems = [];
  for (const i in data) {
    chartItems.push(data[i]);
  }

  return chartItems;
};

const drawChart = function drawChart(data) {
  nv.addGraph(function () {
    const chart = nv.models
      .discreteBarChart()
      .x(function (d) {
        return d.name;
      })
      .y(function (d) {
        return parseFloat(d.salary);
      })
      .staggerLabels(true);
    d3.select("#chart svg").datum(data).call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
};

//save new item
document.addEventListener("DOMContentLoaded", () => {
  initializeChart(salary_data);
  document
    .getElementById("AddRecord")
    .addEventListener("click", addRecordHandler);
  const btnShowLast = document.getElementById("showLast");
  btnShowLast.addEventListener("click", function showLastHandler(e) {
    showLastItem();
  });

  document
    .getElementById("recordCount")
    .addEventListener("click", function recordCountHandler(e) {
      loadFirebaseData(showRecordCountListener);
    });

  window.setTimeout(function () {
    document
      .getElementById("recordCount")
      .setAttribute("class", "btn btn-success");
  }, 2000);
});

const showRecordCountListener = function (chartItems) {
  showRecordCount(chartItems[0].values);
};

const initialCountListener = function () {
  const itemsObj = JSON.parse(this.responseText);
  const chartItems = getChartItems(itemsObj);
  document.getElementById("initial-count").innerText = chartItems.length;
};

function addRecordHandler() {
  const name = document.getElementById("name").value;
  const salary = document.getElementById("salary").value;

  if (!name || !salary) {
    showDataError(name, salary);
    return;
  }

  addRecord(name, salary);
}

function addRecord(name, salary) {
  const previousImpolyName = checkName(salary_data);
  // console.log(previousImpolyName);
  if(previousImpolyName.indexOf(name) === -1){
    const newItem = getRecord(name, salary);
    const id = Math.ceil(Math.random() * 1000000000);

    salary_data[id] = newItem;
    initializeChart(salary_data);
  }else{
    updateSalary(salary_data, name,salary)
    initializeChart(salary_data);
  }
  // console.log("this is salary data: ", salary_data);
  
}

function getRecord(name, salary) {
  const newItem = {
    name: name,
    salary: salary,
  };

  return newItem;
}

function secondHandler(e) {
  console.log("why are you clicking around????");
}

const showLastItem = function () {
  const items = salary_data;
  let lastKey;
  for (const key in items) {
    lastKey = key;
  };
  const lastItem = items[lastKey];
  const lastRecord = getRecord(lastItem.name, lastItem.salary);
  displayLastItemDialog(lastRecord);
};

const loadFirebaseData = function (resHandler) {
  const data = salary_data;
  const chartData = formatChartData(data);
  resHandler(chartData);
};

const displayLastItemDialog = function (lastItem) {
  const dlg = document.getElementById("dialog-last-item");
  dlg.classList.remove("hide");
  document.getElementById("showName").innerText = lastItem.name;
  document.getElementById("showSalary").innerText = d3.format(",.0f")(
    lastItem.salary
  );
  $('#dialog-last-item').dialog({
    width: 600,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};

var showDataError = function (name, salary) {
  const dlg = document.getElementById("dialog-error");
  dlg.classList.remove("hide");

  toggleErrorMessage("newName", name, "Who the hell you are talking about!");
  toggleErrorMessage("newSalary", salary, "How much that guy make!");

  $('#dialog-error').dialog({
    width: 600,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};

function toggleErrorMessage(selector, value, msg) {
  if (value) {
    document.getElementById(selector + "Line").style.display = "none";
  } else {
    document.getElementById(selector + "Line").style.display = "block";
    document.getElementById(selector).innerText = msg;
  }
}

const showRecordCount = function (data) {
  const dlg = document.getElementById("dialog-record-count");

  dlg.classList.remove("hide");

  document.getElementById("numberOfRecords").innerText = data.length;

  $('#dialog-record-count').dialog({
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};

const anotherRecordCountHandler = function anotherRecordCountHandler(e) {
  console.log("you have extra click handler");
  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 ? "odd" : "even";
    console.log(isEven);
  }
};

function longLineCode() {
  console.log("you have extra click handler");
  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 ? "odd" : "even";
    console.log(isEven);
  }
}

/*
  bad data breaks code. Broken code needs more code to fix.
  and more code means higher job security. So, smile :)



  how it works: 
  we keep track of names in the "uniqueNames" object. 
  
  If a name exists in the uniqueNames object, you got a duplicate. 

  For a duplicate, you will add a white space
  to distinguish it from the previous one

  i hate writing comment. 
  need a coffee break!
*/

const uniquifyNames = function (items) {
  const uniqueNames = {};

  return items.map(function (item) {
    if (uniqueNames[item.name] != undefined) {
      uniqueNames[item.name] += " ";
      item.name += uniqueNames[item.name];
    } else {
      uniqueNames[item.name] = "";
    }
    return item;
  });
};


// check Name 
const checkName = (salary_data) => {
  let impoloyNames = [];
  for (let i in salary_data) {
    if (impoloyNames.indexOf(salary_data[i].name) === -1) {
      impoloyNames.push(salary_data[i].name);
    }
    // console.log(salary_data[i].name)
  }
  // console.log(impoloyNames);
  return impoloyNames;

}
// update selary 
const updateSalary = (salary_data, name,salary) => {
  
  for (let i in salary_data) {
    if (salary_data[i].name === name) {
      console.log(salary_data[i].name, name)
      salary_data[i].salary = salary;
    }
   
  }
  console.table(salary_data,["name", "salary"])
 
}
