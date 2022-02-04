var today = moment().format("YYYY-MM-DD");
console.log(today);
fetch("https://data.cdc.gov/resource/8396-v7yb.json?state_name=Florida&report_date=" + today).then( function(response) {
    response.json().then( function(data) {
        console.log(data);
    });
});