var weekData = {};
var countyList = [];
var numWeeks = 5;



var retrieveData = function(date, count) {
    var prevDay = date.format("YYYY-MM-DD");
    fetch("https://data.cdc.gov/resource/8396-v7yb.json?state_name=Florida&report_date=" + prevDay).then( function(response) {
        response.json().then( function(data) {
            console.log(data);
            data.forEach(function(element) {
                var countyName = element["county_name"];
                countyName = countyName.substring(0, countyName.indexOf("County") - 1);
                var lowerName = countyName.toLowerCase();
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
            console.log(prevDay);
            console.log(count);
            if(count === 0){
                return;
            }
            date = date.add(7, "days");
            retrieveData(date, count - 1);
        });
    });
};

retrieveData(moment().subtract((numWeeks - 1) * 7 + 2, "days"), numWeeks);