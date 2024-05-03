/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 79.24528301886792, "KoPercent": 20.754716981132077};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.619811320754717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "elements/main.css-3"], "isController": false}, {"data": [0.5, 500, 1500, "elements/-2"], "isController": false}, {"data": [0.0, 500, 1500, "forms/msdownload/update/v3/static/trustedr/en/disallowedcertstl.cab-21"], "isController": false}, {"data": [1.0, 500, 1500, "forms/-26"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/favicon.ico-44"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/favicon.ico-45"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/favicon.ico-42"], "isController": false}, {"data": [0.0, 500, 1500, "elements/bundle.js-8"], "isController": false}, {"data": [0.0, 500, 1500, "Credentials user1 user1pswd "], "isController": false}, {"data": [1.0, 500, 1500, "forms/MFEwTzBNMEswSTAJBgUrDgMCGgUABBRr2bwARTxMtEy9aspRAZg5QFhagQQUgrrWPZfOn89x6JI3r%2F2ztWk1V88CEDWvt3udNB9q%2FI%2BERqsxNSs%3D-18"], "isController": false}, {"data": [0.0, 500, 1500, "Credentials username password  "], "isController": false}, {"data": [0.0, 500, 1500, "forms/generate_204-17"], "isController": false}, {"data": [0.15, 500, 1500, "widgets/images/WB.svg-40"], "isController": false}, {"data": [1.0, 500, 1500, "forms/-22"], "isController": false}, {"data": [0.05, 500, 1500, "elements/bundle.js-4"], "isController": false}, {"data": [0.2, 500, 1500, "elements/images/WB.svg-10"], "isController": false}, {"data": [1.0, 500, 1500, "forms/images/gplaypattern.jpg-29"], "isController": false}, {"data": [0.75, 500, 1500, "elements/main.css-7"], "isController": false}, {"data": [1.0, 500, 1500, "elements/images/gplaypattern.jpg-11"], "isController": false}, {"data": [0.95, 500, 1500, "widgets/favicon.ico-39"], "isController": false}, {"data": [0.45, 500, 1500, "forms/main.css-23"], "isController": false}, {"data": [0.1, 500, 1500, "forms/images/WB.svg-31"], "isController": false}, {"data": [1.0, 500, 1500, "elements/favicon.ico-14"], "isController": false}, {"data": [1.0, 500, 1500, "elements/images/gplaypattern.jpg-15"], "isController": false}, {"data": [0.95, 500, 1500, "elements/favicon.ico-5"], "isController": false}, {"data": [0.95, 500, 1500, "elements/favicon.ico-12"], "isController": false}, {"data": [0.5, 500, 1500, "forms/main.css-27"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/favicon.ico-38"], "isController": false}, {"data": [0.0, 500, 1500, "forms/success.txt-48"], "isController": false}, {"data": [0.0, 500, 1500, "forms/success.txt-47"], "isController": false}, {"data": [1.0, 500, 1500, "forms/favicon.ico-37"], "isController": false}, {"data": [0.0, 500, 1500, "forms/bundle.js-28"], "isController": false}, {"data": [0.05, 500, 1500, "forms/bundle.js-24"], "isController": false}, {"data": [1.0, 500, 1500, "forms/favicon.ico-34"], "isController": false}, {"data": [0.85, 500, 1500, "forms/msdownload/update/v3/static/trustedr/en/authrootstl.cab-20"], "isController": false}, {"data": [1.0, 500, 1500, "elements/images/zero-step.jpeg-16"], "isController": false}, {"data": [1.0, 500, 1500, "forms/favicon.ico-32"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/images/Toolsqa.jpg-41"], "isController": false}, {"data": [0.95, 500, 1500, "forms/images/zero-step.jpeg-36"], "isController": false}, {"data": [0.0, 500, 1500, "forms/-49"], "isController": false}, {"data": [0.0, 500, 1500, "forms/canonical.html-50"], "isController": false}, {"data": [1.0, 500, 1500, "widgets/images/zero-step.jpeg-43"], "isController": false}, {"data": [1.0, 500, 1500, "forms/images/Toolsqa.jpg-35"], "isController": false}, {"data": [0.0, 500, 1500, "Credentials admin admin@123 "], "isController": false}, {"data": [0.0, 500, 1500, "forms/success.txt-51"], "isController": false}, {"data": [0.0, 500, 1500, "forms/success.txt-52"], "isController": false}, {"data": [1.0, 500, 1500, "forms/images/Toolsqa.jpg-30"], "isController": false}, {"data": [1.0, 500, 1500, "forms/favicon.ico-25"], "isController": false}, {"data": [1.0, 500, 1500, "forms/-19"], "isController": false}, {"data": [0.0, 500, 1500, "forms/canonical.html-46"], "isController": false}, {"data": [0.95, 500, 1500, "forms/images/gplaypattern.jpg-33"], "isController": false}, {"data": [1.0, 500, 1500, "elements/images/Toolsqa.jpg-9"], "isController": false}, {"data": [0.0, 500, 1500, "elements/generate_204-1"], "isController": false}, {"data": [1.0, 500, 1500, "elements/-6"], "isController": false}, {"data": [1.0, 500, 1500, "elements/images/Toolsqa.jpg-13"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 530, 110, 20.754716981132077, 592.0415094339619, 1, 11491, 184.0, 1640.0000000000005, 2994.0499999999975, 5710.6299999999865, 8.686530960107516, 824.9961394618448, 4.240990028927786], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["elements/main.css-3", 10, 0, 0.0, 523.6999999999999, 507, 540, 519.0, 540.0, 540.0, 540.0, 10.256410256410257, 550.0200320512821, 5.3485576923076925], "isController": false}, {"data": ["elements/-2", 10, 0, 0.0, 605.5999999999999, 531, 802, 555.0, 797.7, 802.0, 802.0, 7.9302141157811255, 15.01629411181602, 5.312623909595559], "isController": false}, {"data": ["forms/msdownload/update/v3/static/trustedr/en/disallowedcertstl.cab-21", 10, 10, 100.0, 1.4, 1, 2, 1.0, 2.0, 2.0, 2.0, 0.5865790708587517, 1.2046638535312062, 0.0], "isController": false}, {"data": ["forms/-26", 10, 0, 0.0, 198.6, 172, 253, 185.0, 250.10000000000002, 253.0, 253.0, 0.47323837016705317, 0.8961027341346837, 0.3170327362642563], "isController": false}, {"data": ["widgets/favicon.ico-44", 10, 0, 0.0, 177.60000000000002, 170, 188, 175.5, 187.9, 188.0, 188.0, 0.5571341021783943, 1.0549638907460024, 0.3242694579085186], "isController": false}, {"data": ["widgets/favicon.ico-45", 10, 0, 0.0, 175.0, 171, 184, 174.0, 183.5, 184.0, 184.0, 0.5581603036392052, 1.0569070593324403, 0.32432166080598346], "isController": false}, {"data": ["widgets/favicon.ico-42", 10, 0, 0.0, 191.9, 170, 235, 175.5, 234.9, 235.0, 235.0, 0.556235398820781, 1.0532621467905217, 0.32048719267994213], "isController": false}, {"data": ["elements/bundle.js-8", 10, 0, 0.0, 3735.1, 1631, 6397, 3701.5, 6335.400000000001, 6397.0, 6397.0, 0.6658232904987017, 537.129531759771, 0.33876360776349956], "isController": false}, {"data": ["Credentials user1 user1pswd ", 3, 3, 100.0, 207.0, 137, 249, 235.0, 249.0, 249.0, 249.0, 0.2604166666666667, 0.0, 0.0], "isController": false}, {"data": ["forms/MFEwTzBNMEswSTAJBgUrDgMCGgUABBRr2bwARTxMtEy9aspRAZg5QFhagQQUgrrWPZfOn89x6JI3r%2F2ztWk1V88CEDWvt3udNB9q%2FI%2BERqsxNSs%3D-18", 10, 0, 0.0, 70.1, 34, 172, 40.0, 166.90000000000003, 172.0, 172.0, 0.5886508123381211, 0.6789029388391806, 0.1540609547916176], "isController": false}, {"data": ["Credentials username password  ", 4, 4, 100.0, 189.5, 108, 340, 155.0, 340.0, 340.0, 340.0, 0.22490863086870957, 0.0, 0.0], "isController": false}, {"data": ["forms/generate_204-17", 10, 10, 100.0, 34.1, 17, 67, 23.0, 66.5, 67.0, 67.0, 0.5868200222991609, 0.07277943635936858, 0.17765059268822253], "isController": false}, {"data": ["widgets/images/WB.svg-40", 10, 0, 0.0, 2512.4, 1082, 4499, 2039.5, 4488.9, 4499.0, 4499.0, 0.5092168245238823, 237.3701298184642, 0.2909100022914757], "isController": false}, {"data": ["forms/-22", 10, 0, 0.0, 198.70000000000002, 174, 300, 181.5, 293.0, 300.0, 300.0, 0.57567209717345, 1.0900665980657418, 0.38565533072361985], "isController": false}, {"data": ["elements/bundle.js-4", 10, 0, 0.0, 4837.400000000001, 1243, 11491, 4209.5, 11344.900000000001, 11491.0, 11491.0, 0.8525149190110827, 687.7364396845694, 0.4337502664109122], "isController": false}, {"data": ["elements/images/WB.svg-10", 10, 0, 0.0, 2114.9999999999995, 1131, 5856, 1602.5, 5547.600000000001, 5856.0, 5856.0, 0.5211318984835063, 242.9243112916254, 0.2977169537234874], "isController": false}, {"data": ["forms/images/gplaypattern.jpg-29", 10, 0, 0.0, 194.0, 170, 241, 182.5, 240.9, 241.0, 241.0, 0.47878961984104185, 2.1241613700564974, 0.28194349683998854], "isController": false}, {"data": ["elements/main.css-7", 10, 0, 0.0, 475.0, 199, 760, 484.0, 744.1, 760.0, 760.0, 0.9125752874612155, 48.93863216371601, 0.47589375342215734], "isController": false}, {"data": ["elements/images/gplaypattern.jpg-11", 10, 0, 0.0, 199.6, 170, 236, 199.0, 235.1, 236.0, 236.0, 0.7368653746960431, 3.269120505121214, 0.4339158407633925], "isController": false}, {"data": ["widgets/favicon.ico-39", 10, 0, 0.0, 252.10000000000002, 171, 821, 174.5, 763.8000000000002, 821.0, 821.0, 0.5335609860207021, 1.0103269061466225, 0.30377544418952085], "isController": false}, {"data": ["forms/main.css-23", 10, 0, 0.0, 703.4000000000001, 511, 1659, 619.0, 1563.3000000000002, 1659.0, 1659.0, 0.5612932195779076, 30.10044517568478, 0.29270564380332287], "isController": false}, {"data": ["forms/images/WB.svg-31", 10, 0, 0.0, 1882.4, 967, 2900, 1903.0, 2851.4, 2900.0, 2900.0, 0.45932662716457673, 214.11394099375315, 0.2624082782141381], "isController": false}, {"data": ["elements/favicon.ico-14", 10, 0, 0.0, 198.89999999999998, 172, 240, 188.0, 239.3, 240.0, 240.0, 0.5781683626271971, 1.0947934132169288, 0.3336889671022202], "isController": false}, {"data": ["elements/images/gplaypattern.jpg-15", 10, 0, 0.0, 202.1, 173, 253, 182.0, 252.4, 253.0, 253.0, 0.5797101449275363, 2.571897644927536, 0.3413722826086957], "isController": false}, {"data": ["elements/favicon.ico-5", 10, 0, 0.0, 238.1, 175, 606, 187.0, 569.0000000000001, 606.0, 606.0, 0.942507068803016, 1.784688678133836, 0.5366031456173421], "isController": false}, {"data": ["elements/favicon.ico-12", 10, 0, 0.0, 282.20000000000005, 171, 949, 210.0, 879.8000000000003, 949.0, 949.0, 0.559753708368318, 1.0599242583263364, 0.31868790232297795], "isController": false}, {"data": ["forms/main.css-27", 10, 0, 0.0, 582.4000000000001, 508, 669, 563.0, 667.1, 669.0, 669.0, 0.4670060243777145, 25.044110178396302, 0.2435363447438472], "isController": false}, {"data": ["widgets/favicon.ico-38", 10, 0, 0.0, 184.7, 169, 247, 176.5, 241.3, 247.0, 247.0, 0.5357334190506804, 1.0144405268938177, 0.30762817422050787], "isController": false}, {"data": ["forms/success.txt-48", 10, 10, 100.0, 39.0, 19, 84, 26.5, 82.80000000000001, 84.0, 84.0, 0.5435668859053107, 0.11465863999565147, 0.161902246290156], "isController": false}, {"data": ["forms/success.txt-47", 10, 10, 100.0, 37.0, 18, 94, 23.5, 92.60000000000001, 94.0, 94.0, 0.5449888277290316, 0.11495858084909259, 0.16232577388413538], "isController": false}, {"data": ["forms/favicon.ico-37", 10, 0, 0.0, 206.0, 170, 349, 186.0, 337.20000000000005, 349.0, 349.0, 0.5274539796402763, 0.9987629555883749, 0.31266070863442164], "isController": false}, {"data": ["forms/bundle.js-28", 10, 0, 0.0, 3057.7999999999997, 1641, 5035, 2683.5, 4993.3, 5035.0, 5035.0, 0.42279722645019446, 341.076798473702, 0.21511460447319464], "isController": false}, {"data": ["forms/bundle.js-24", 10, 0, 0.0, 2884.5, 1265, 5294, 2580.5, 5183.700000000001, 5294.0, 5294.0, 0.44359668189681944, 357.85602792441114, 0.22569713991039347], "isController": false}, {"data": ["forms/favicon.ico-34", 10, 0, 0.0, 183.3, 173, 203, 181.0, 202.8, 203.0, 203.0, 0.523944252331552, 0.992117094991093, 0.30085861364350835], "isController": false}, {"data": ["forms/msdownload/update/v3/static/trustedr/en/authrootstl.cab-20", 10, 0, 0.0, 463.29999999999995, 400, 568, 446.0, 566.2, 568.0, 568.0, 0.5734273754229027, 39.430747892654395, 0.10975758357703996], "isController": false}, {"data": ["elements/images/zero-step.jpeg-16", 10, 0, 0.0, 189.3, 170, 233, 175.0, 233.0, 233.0, 233.0, 0.5795421616922631, 6.59059421182266, 0.34014144450883804], "isController": false}, {"data": ["forms/favicon.ico-32", 10, 0, 0.0, 214.1, 169, 261, 201.0, 260.6, 261.0, 261.0, 0.5239168020118405, 0.9920651163095301, 0.2982846636454131], "isController": false}, {"data": ["widgets/images/Toolsqa.jpg-41", 10, 0, 0.0, 191.79999999999998, 171, 267, 177.0, 264.0, 267.0, 267.0, 0.5351886540005352, 3.9433578070644906, 0.3083606502542146], "isController": false}, {"data": ["forms/images/zero-step.jpeg-36", 10, 0, 0.0, 337.0, 169, 1451, 184.0, 1345.5000000000005, 1451.0, 1451.0, 0.5227938101212882, 5.945247967639063, 0.30530341645754916], "isController": false}, {"data": ["forms/-49", 10, 10, 100.0, 614.4, 327, 868, 636.5, 866.3, 868.0, 868.0, 0.5236150382238978, 0.10226856215310504, 0.24442186354592105], "isController": false}, {"data": ["forms/canonical.html-50", 10, 10, 100.0, 30.6, 16, 75, 23.5, 72.60000000000001, 75.0, 75.0, 0.5353605653407569, 0.15579828952299374, 0.15841235478344667], "isController": false}, {"data": ["widgets/images/zero-step.jpeg-43", 10, 0, 0.0, 175.19999999999996, 169, 185, 175.5, 184.3, 185.0, 185.0, 0.5567618729469406, 6.3315351664718005, 0.32622765992984804], "isController": false}, {"data": ["forms/images/Toolsqa.jpg-35", 10, 0, 0.0, 187.89999999999998, 170, 228, 182.0, 226.10000000000002, 228.0, 228.0, 0.5229851995188536, 3.8534407523142096, 0.30388300167355264], "isController": false}, {"data": ["Credentials admin admin@123 ", 3, 3, 100.0, 195.66666666666666, 124, 279, 184.0, 279.0, 279.0, 279.0, 0.33288948069241014, 0.0, 0.0], "isController": false}, {"data": ["forms/success.txt-51", 10, 10, 100.0, 38.39999999999999, 17, 96, 21.5, 95.3, 96.0, 96.0, 0.53835800807537, 0.11355989232839839, 0.16035077388963662], "isController": false}, {"data": ["forms/success.txt-52", 10, 10, 100.0, 39.9, 16, 109, 21.0, 105.70000000000002, 109.0, 109.0, 0.5349596105494036, 0.1128430428502648, 0.1593385558765313], "isController": false}, {"data": ["forms/images/Toolsqa.jpg-30", 10, 0, 0.0, 208.4, 172, 262, 200.0, 259.8, 262.0, 262.0, 0.47945533873519686, 3.5327055964424416, 0.2762486814978185], "isController": false}, {"data": ["forms/favicon.ico-25", 10, 0, 0.0, 201.3, 169, 259, 179.0, 257.4, 259.0, 259.0, 0.4731488052992666, 0.8959331381594511, 0.2693806186420629], "isController": false}, {"data": ["forms/-19", 10, 0, 0.0, 56.400000000000006, 34, 144, 38.5, 138.3, 144.0, 144.0, 0.589518363497023, 0.5791557360136768, 0.08405242292047396], "isController": false}, {"data": ["forms/canonical.html-46", 10, 10, 100.0, 92.7, 31, 408, 45.0, 378.7000000000001, 408.0, 408.0, 0.531632110579479, 0.1547132509303562, 0.15730911084529506], "isController": false}, {"data": ["forms/images/gplaypattern.jpg-33", 10, 0, 0.0, 294.9, 169, 1117, 174.5, 1042.9000000000003, 1117.0, 1117.0, 0.5226845076311939, 2.318902068523939, 0.30779175595860336], "isController": false}, {"data": ["elements/images/Toolsqa.jpg-9", 10, 0, 0.0, 200.79999999999998, 173, 262, 194.5, 259.2, 262.0, 262.0, 0.7359434795407713, 5.422552297983515, 0.4240299345010303], "isController": false}, {"data": ["elements/generate_204-1", 10, 10, 100.0, 39.300000000000004, 32, 60, 36.5, 59.0, 60.0, 60.0, 11.806375442739078, 1.464267266824085, 3.5741956906729637], "isController": false}, {"data": ["elements/-6", 10, 0, 0.0, 233.50000000000003, 173, 481, 206.0, 458.1000000000001, 481.0, 481.0, 0.9419743782969103, 1.783679999529013, 0.6310492417106255], "isController": false}, {"data": ["elements/images/Toolsqa.jpg-13", 10, 0, 0.0, 193.29999999999995, 170, 244, 182.0, 241.0, 244.0, 244.0, 0.5803493703209331, 4.2761093740932035, 0.3389149643085137], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 10, 9.090909090909092, 1.8867924528301887], "isController": false}, {"data": ["The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 40, 36.36363636363637, 7.547169811320755], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ctldl.windowsupdate.com:80 failed to respond", 10, 9.090909090909092, 1.8867924528301887], "isController": false}, {"data": ["The result was the wrong size: It was 127 bytes, but should have been greater or equal to 500 bytes.", 20, 18.181818181818183, 3.7735849056603774], "isController": false}, {"data": ["The result was the wrong size: It was 298 bytes, but should have been greater or equal to 500 bytes.", 20, 18.181818181818183, 3.7735849056603774], "isController": false}, {"data": ["The result was the wrong size: It was 0 bytes, but should have been greater or equal to 500 bytes.", 10, 9.090909090909092, 1.8867924528301887], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 530, 110, "The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 40, "The result was the wrong size: It was 127 bytes, but should have been greater or equal to 500 bytes.", 20, "The result was the wrong size: It was 298 bytes, but should have been greater or equal to 500 bytes.", 20, "400/Bad Request", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ctldl.windowsupdate.com:80 failed to respond", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["forms/msdownload/update/v3/static/trustedr/en/disallowedcertstl.cab-21", 10, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ctldl.windowsupdate.com:80 failed to respond", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Credentials user1 user1pswd ", 3, 3, "The result was the wrong size: It was 0 bytes, but should have been greater or equal to 500 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Credentials username password  ", 4, 4, "The result was the wrong size: It was 0 bytes, but should have been greater or equal to 500 bytes.", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["forms/generate_204-17", 10, 10, "The result was the wrong size: It was 127 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["forms/success.txt-48", 10, 10, "The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["forms/success.txt-47", 10, 10, "The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["forms/-49", 10, 10, "400/Bad Request", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["forms/canonical.html-50", 10, 10, "The result was the wrong size: It was 298 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Credentials admin admin@123 ", 3, 3, "The result was the wrong size: It was 0 bytes, but should have been greater or equal to 500 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["forms/success.txt-51", 10, 10, "The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["forms/success.txt-52", 10, 10, "The result was the wrong size: It was 216 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["forms/canonical.html-46", 10, 10, "The result was the wrong size: It was 298 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["elements/generate_204-1", 10, 10, "The result was the wrong size: It was 127 bytes, but should have been greater or equal to 500 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
