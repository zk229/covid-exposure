var weekData = {};
var countyList = [];
var numWeeks = 5;

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
                    weekData[lowerName] = {};
                    countyList.push(countyName);
                }
                weekData[lowerName][element["report_date"]] = {
                    "cases" : element["cases_per_100k_7_day_count"],
                    "level" : element["community_transmission_level"]
                };
            });
            console.log(weekData);
            if(count === 0){
                countyList.sort();
                $( "#county" ).autocomplete({
                    source: countyList
                  });
                return;
            }
            date = date.add(7, "days");
            retrieveData(date, count - 1);
        });
    });
};

var makeChart = function() {

};

retrieveData(moment().subtract((numWeeks - 1) * 7 + 2, "days"), numWeeks);