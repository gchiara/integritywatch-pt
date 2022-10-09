import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'tabA',
  previousmandate: false,
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  travelFilter: 'all',
  charts: {
    party: {
      title: 'Parties',
      info: 'Lorem ipsum'
    },
    activities: {
      title: 'Positions',
      info: 'Lorem ipsum'
    },
    profession: {
      title: 'Top 10 Professions',
      info: 'Lorem ipsum'
    },
    org: {
      title: 'Top 10 Orgs',
      info: 'Lorem ipsum'
    },
    gender: {
      title: 'Gender',
      info: 'Lorem ipsum'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'People',
      info: 'Lorem Ipsum'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    default: "#3B95D0",
    generic: ["#3B95D0", "#1C5075", "#ffa53d", "#FF834D", "#ff4621" ],
    parties: {
      "VVD": "#F68F1E",
      "PVV": "#153360",
      "CDA": "#009C48",
      "D66": "#3DB54A",
      "GL": "#8CBE57",
      "SP": "#EE2E22",
      "PvdA": "#BB1018",
      "CU": "#00AEEF",
      "PvdD": "#006535",
      "SGP": "#F36421",
      "DENK": "#35BFC1",
      "FVD": "#933939",
      "Fractie Den Haan": "#aaaaaa",
      "Van Haga": "#777777",
      "BBB": "#A6CB45",
      "BIJ1": "#FFFF00",
      "Volt": "#582488",
      "Groep Van Haga": "#cccccc",
      "JA21": "#999999",
    },
  }
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Check out Integrity Watch Portugal! ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://integritywatch.pt';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
      if(platform == 'linkedin'){
        var shareURL = 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fintegritywatch.pt&title=Integrity+Watch+Portugal&summary=Integrity+Watch+Portugal&source=integritywatch.nl';
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes');
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  party: {
    chart: dc.rowChart("#party_chart"),
    type: 'row',
    divId: 'party_chart'
  },
  activities: {
    chart: dc.pieChart("#activities_chart"),
    type: 'pie',
    divId: 'activities_chart'
  },
  profession: {
    chart: dc.rowChart("#profession_chart"),
    type: 'row',
    divId: 'profession_chart'
  },
  org: {
    chart: dc.rowChart("#org_chart"),
    type: 'row',
    divId: 'org_chart'
  },
  /*
  gender: {
    chart: dc.pieChart("#gender_chart"),
    type: 'pie',
    divId: 'gender_chart'
  },
  */
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("party_chart").offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    if((c == 'gender' || c == 'age') && vuedata.showAllCharts == false){
      
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if(charts[c].type == 'row'){
        charts[c].chart.width(newWidth);
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if(thisKey.indexOf('###') > -1){
            thisKey = thisKey.split('###')[0];
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
        charts[c].chart.redraw();
      } else if(charts[c].type == 'bar') {
        charts[c].chart.width(newWidth);
        charts[c].chart.rescale();
        charts[c].chart.redraw();
      } else if(charts[c].type == 'pie') {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        charts[c].chart.redraw();
      } else if(charts[c].type == 'cloud') {
        charts[c].chart.size(recalcWidthWordcloud());
        charts[c].chart.redraw();
      }
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}

//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Totals for footer counters
var totalActivities = 0;

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Fix arrays/objects so that if there is only 1 element it's still structured as an array
function fixArray(arr) {
  var fixedArr = [];
  if(Array.isArray(arr)) {
    fixedArr = arr;
  } else {
    fixedArr = [arr];
  }
  return fixedArr;
}

var declarationsDataset = './data/declarations.json';

//Load data and generate charts
json(declarationsDataset, (err, declarations) => {
  var people = declarations.RegistoBiografico.RegistoBiograficoList.pt_ar_wsgode_objectos_DadosRegistoBiograficoWeb;
  var interests = declarations.RegistoBiografico.RegistoInteressesV2List.pt_ar_wsgode_objectos_DadosDeputadoRgiWebV2;
  //Loop through data to apply fixes and calculations
  _.each(people, function (d) {
    //Find latest party
    d.party = "N/A";
    d.partyFullName = "N/A";
    var partiesLegInfo = d.cadDeputadoLegis.pt_ar_wsgode_objectos_DadosDeputadoLegis;
    partiesLegInfo = fixArray(partiesLegInfo);
    if(partiesLegInfo && partiesLegInfo.length > 0) {
      d.party = partiesLegInfo[0].parSigla;
      d.partyFullName = partiesLegInfo[0].parDes;
    }
    //Clean profession 
    d.profession = 'N/A';
    if(d.cadProfissao) {
      d.profession = d.cadProfissao.charAt(0).toUpperCase() + d.cadProfissao.slice(1).toLowerCase();
    }
    //Get this persons's infofrom interests list
    //Commented out for now because this seems to just list married state and profession
    /*
    d.interests = [];
    var thisInterests = _.filter(interests, function (x) { 
      return x.cadId == d.cadId;
    });
    if(thisInterests) {
      d.interests = thisInterests;
    }
    console.log(d.interests);
    */
    //Activities
    d.activitiesNum = 0;
    d.activitiesRange = '';
    if(d.cadCargosFuncoes && d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes) {
      d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes = fixArray(d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes);
      //d.activitiesNum = d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length;
      _.each(d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes, function (act) {
          if(act.funAntiga == 'N') {
            d.activitiesNum ++;
            totalActivities ++;
          }
      });
    }
    if(d.activitiesNum > 10 ){
      d.activitiesRange = '> 10';
    } else if(d.activitiesNum >= 5 ){
      d.activitiesRange = '5 - 10';
    } else if(d.activitiesNum >= 3){
      d.activitiesRange= '3 - 4';
    } else if(d.activitiesNum >= 1){
      d.activitiesRange = '1 - 2';
    } else {
      d.activitiesRange = '0';
    }
    //Qualifications
    if(d.cadHabilitacoes && d.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes) {
      d.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes = fixArray(d.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes);
    }
    //Orgs
    d.orgsList = [];
    if(d.cadActividadeOrgaos && d.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos) {
      d.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos = fixArray(d.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos);
      _.each(d.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos, function (org) {
        d.orgsList.push(org.orgDes);
      });
    }
  });

  //Set totals for footer counters
  $('.count-box-activities .total-count-act').text(totalActivities);

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(people);

  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.cadNomeCompleto + ' ' + d.cadProfissao + ' ' + d.party;
      return entryString.toLowerCase();
  });

  //CHART 1
  var createPartyChart = function() {
    var chart = charts.party.chart;
    var dimension = ndx.dimension(function (d) {
        return d.party;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(100).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.party.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 2 - Activities
  var createActivitiesChart = function() {
    var chart = charts.activities.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','5 - 10', '> 10'];
    var sizes = calcPieSize(charts.activities.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);
    chart.render();
  }

  //CHART 3 - Top Professions
  var createTopProfessionsChart = function() {
    var chart = charts.profession.chart;
    var dimension = ndx.dimension(function (d) {
        return d.profession;
    });
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.profession.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 4 - Top Orgs
  var createTopOrgsChart = function() {
    var chart = charts.org.chart;
    var dimension = ndx.dimension(function (d) {
        return d.orgsList;
    }, 1);
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.org.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 4 - Gender
  var createGenderChart = function() {
    var chart = charts.gender.chart;
    var dimension = ndx.dimension(function (d) {
      if(!d.cadSexo) { return "N/A"; }
      return d.cadSexo;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.gender.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .ordinalColors(vuedata.colors.generic)
      .dimension(dimension)
      .group(group);
    chart.render();
  }
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "language": {
        //"emptyTable": ""
      },
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.cadNomeCompleto;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.partyFullName;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.cadProfissao;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.activitiesNum;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "asc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.mainTable.chart.fnClearTable();
      charts.mainTable.chart.fnAddData(alldata);
      charts.mainTable.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createPartyChart();
  createActivitiesChart();
  createTopProfessionsChart();
  createTopOrgsChart();
  //createGenderChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Toggle last charts functionality and fix for responsiveness
  vuedata.showAllCharts = false;
  $('#charts-toggle-btn').click(function(){
    if(vuedata.showAllCharts){
      resizeGraphs();
    }
  })

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  //Update datatables
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Custom counters
  function drawActivitiesCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.cadId) {
        return "";
      } else {
        return d.cadId;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.cadId) {
          return p;
        }
        p.actnum = +d.activitiesNum;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.cadId) {
          return p;
        }
        p.actnum = +d.activitiesNum;
        return p;
      },
      function(p,d) {  
        return {nb: 0, actnum:0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var actnum = 0;
    var counter = dc.dataCount(".count-box-activities")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
          actnum += +kv.value.actnum;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".nbactivities").text(actnum);
      actnum=0;
    });
    counter.render();
  }
  drawActivitiesCounter();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
