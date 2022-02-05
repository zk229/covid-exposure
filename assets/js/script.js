var weekData = {};
var countyList = [];
var numWeeks = 5;
var startDate = moment().subtract(2, "days");

// make API calls to the CDC database by week
var retrieveData = function(date, count) {
    var prevDay = date.format("YYYY-MM-DD");
    fetch("https://data.cdc.gov/resource/8396-v7yb.json?state_name=Florida&report_date=" + prevDay).then( function(response) {
        response.json().then( function(data) {
            data.forEach(function(element) {
                var countyName = element["county_name"];
                countyName = countyName.substring(0, countyName.indexOf("County") - 1);
                var lowerName = countyName.toLowerCase();
                // if county data is not initialized, create the object and add it to the county list
                if(!weekData.hasOwnProperty(lowerName)) {
                    weekData[lowerName] = [];
                    countyList.push(countyName);
                }
                weekData[lowerName].push({
                    "cases" : parseFloat(element["cases_per_100k_7_day_count"].replace(",","")),
                    "level" : element["community_transmission_level"]
                });
            });
            console.log(weekData);
            if(count === 0){
                countyList.sort();
                $( "#county" ).autocomplete({
                    source: countyList,
                    change: switchCounty
                  });
                return;
            }
            date = date.add(7, "days");
            retrieveData(date, count - 1);
        });
    });
};

// event handler for county search
var switchCounty = function(event) {
    makeChart($(this).val());
};

// create a chart for the given county using Quickchart API
var makeChart = function(county) {
    var currentData = weekData[county.toLowerCase()];
    var labels = [];
    var numbers = [];
    for(var i = 0; i < currentData.length; i++) {
        numbers.push(currentData[i]["cases"]);
        labels.push(moment().subtract((numWeeks - 1 - i) * 7 + 2, "days").format("MM-DD-YY"));
    }
    var dataset = {
        label: "Transmission Rate per 100k",
        data: numbers
    };
    var chartObj = {
        type: "line",
        data: {
            labels: labels,
            datasets: [dataset]
        }
    };
    $("#chart").attr("src", "https://quickchart.io/chart?c=" + JSON.stringify(chartObj) + "&w=500&h=250");
};

retrieveData(startDate.subtract((numWeeks - 1) * 7, "days"), numWeeks);