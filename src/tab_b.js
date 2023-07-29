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
  page: 'tabB',
  legislature: 'XV',
  previousmandate: false,
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  statusFilter: 'all',
  statusTypes: null,
  selectedStatus: 'all',
  charts: {
    topMps: {
      title: 'Top 10: Deputados',
      info: 'Top 10 dos Deputados portugueses com maior número de cargos/funções/atividades declarados.'
    },
    natureza: {
      title: 'Top 10: Área de Atividade Profissional',
      info: 'Top 10 das áreas nas quais os Deputados exercem ou exerceram os seus cargos/funções/atividades.'
    },
    remuneration: {
      title: 'Remuneração',
      info: 'Existência ou não de remuneração dos cargos/funções/atividades exercidos pelos Deputados.'
    },
    current: {
      title: 'Atual ou Terminado',
      info: 'Número de cargos/funções/atividades atualmente desempenhados ou já exercidos pelos Deputados no passado.'
    },
    type: {
      title: 'Mais ou menos de 3 anos',
      info: 'Número de cargos/funções/atividades exercidos pelos Deputados há mais ou menos de 3 anos.'
    },
    org: {
      title: 'Top 10: Entidades',
      info: 'Top 10 das entidades para as quais os Deputados portugueses mais exercem ou exerceram as suas atividades profissionais.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Deputados',
      info: 'Lista de Deputados ordenados e/ou filtrados de acordo com as suas escolhas. Se pretender voltar a ver a lista completa, clique no botão "Limpar filtros" no canto inferior direito do ecrã.'
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
        var shareText = 'A @transparenciapt lançou hoje a plataforma #IntegrityWatch Portugal, que permite aceder a infos sobre integridade na política em PT, através da monitorização dos dados bio e registos de interesses dos Deputados da @AssembleiaRepub. Descobre mais👉 ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://www.integritywatch.transparencia.pt';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
      if(platform == 'linkedin'){
        var shareURL = 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fintegritywatch.transparencia.pt&title=Integrity+Watch+Portugal&summary=Integrity+Watch+Portugal&source=https://integritywatch.transparencia.pt';
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
  topMps: {
    chart: dc.rowChart("#topmps_chart"),
    type: 'row',
    divId: 'topmps_chart'
  },
  natureza: {
    chart: dc.rowChart("#natureza_chart"),
    type: 'row',
    divId: 'natureza_chart'
  },
  remuneration: {
    chart: dc.pieChart("#remuneration_chart"),
    type: 'pie',
    divId: 'remuneration_chart'
  },
  current: {
    chart: dc.pieChart("#current_chart"),
    type: 'pie',
    divId: 'current_chart'
  },
  type: {
    chart: dc.pieChart("#type_chart"),
    type: 'pie',
    divId: 'type_chart'
  },
  org: {
    chart: dc.rowChart("#org_chart"),
    type: 'row',
    divId: 'org_chart'
  },
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

var activitiesDataset = './data/activitiesXV.json';
var declarationsDataset = './data/mpsXV.json';

//Load data and generate charts
json(declarationsDataset, (err0, declarations) => {
  var people = declarations;
  var statusTypes = [];
  var mpStatuses = {};
  //Add status to array if not present
  _.each(people, function (d) {
    d.status = null;
    var statusesData = d.basicInfo.depSituacao.pt_ar_wsgode_objectos_DadosSituacaoDeputado;
    if(statusesData.sioDes) {
      d.status = statusesData.sioDes;
    } else {
      _.each(statusesData, function (s) {
        if(!s.sioDtFim) {
          d.status = s.sioDes;
        }
    });
    }
    if(d.status && statusTypes.indexOf(d.status) == -1) {
      statusTypes.push(d.status);
    }
    mpStatuses['id'+d.cadId] = d.status;
  });
vuedata.statusTypes = statusTypes;
json(activitiesDataset, (err, activities) => {
  //var people = declarations.RegistoBiografico.RegistoBiograficoList.pt_ar_wsgode_objectos_DadosRegistoBiograficoWeb;
  var activities = _.filter(activities, function(x, index) {
    return x.activityType == "GenCargosMenosTresAnos" || x.activityType == "GenCargosMaisTresAnos";
  });
  //Loop through data to apply fixes and calculations
  _.each(activities, function (d) {
    //Status
    d.status = mpStatuses['id'+d.IdCadastroGODE];
    d.remuneradaString = d.Remunerada;
    if(d.Remunerada == "48") { 
      d.remuneradaString = "Sim" ;
    } else if(d.Remunerada == "78") { 
      d.remuneradaString = "Não";
    }
    d.currentEndedString = "Terminado";
    if(d.DataTermo == null) { d.currentEndedString = "Atual" }
    d.typeString = d.activityType;
    if(d.activityType == "GenCargosMenosTresAnos") {
      d.typeString = "Menos de 3 anos";
    } else if(d.activityType == "GenCargosMaisTresAnos") {
      d.typeString = "Mais de 3 anos";
    }
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(activities);

  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.NomeIdentificacao + " " + d.CargoFuncaoAtividade + " " + d.Entidade + " " + d.CargoFuncaoAtividade;
      return entryString.toLowerCase();
  });

  var statusDimension = ndx.dimension(function (d) {
    return d.status;
  });

  //CHART 1 - Top MPs
  var createTopMpsChart = function() {
    var chart = charts.topMps.chart;
    var dimension = ndx.dimension(function (d) {
        return d.NomeIdentificacao;
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
    var width = recalcWidth(charts.topMps.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(420)
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

  //CHART 2 - Top Orgs
  var createTopOrgsChart = function() {
    var chart = charts.org.chart;
    var dimension = ndx.dimension(function (d) {
        return d.Entidade;
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
    var width = recalcWidth(charts.org.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(420)
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

  //CHART 3 - Natureza
  var createNaturezaChart = function() {
    var chart = charts.natureza.chart;
    var dimension = ndx.dimension(function (d) {
        return d.Natureza;
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
    var width = recalcWidth(charts.natureza.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(390)
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

  //CHART 3 - Remuneration
  var createRemunerationChart = function() {
    var chart = charts.remuneration.chart;
    var dimension = ndx.dimension(function (d) {
      return d.remuneradaString;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.remuneration.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
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

  //CHART 4 - Current
  var createCurrentChart = function() {
    var chart = charts.current.chart;
    var dimension = ndx.dimension(function (d) {
      return d.currentEndedString;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.current.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
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

  //CHART 5 - Type
  var createTypeChart = function() {
    var chart = charts.type.chart;
    var dimension = ndx.dimension(function (d) {
      return d.typeString;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.type.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
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
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "A mostrar _START_ a _END_ de _TOTAL_ entradas",
        "lengthMenu": "Mostrar _MENU_ entradas",
        "search": "Search",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Seguinte",
          "previous":   "Anterior"
        }
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
            return d.NomeIdentificacao;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.CargoFuncaoAtividade;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.Entidade;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.remuneradaString;
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
    statusDimension.filter(null);
    vuedata.selectedStatus = 'all';
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })

  //Status selector
  $( "#statusSelector" ).change(function() {
    statusDimension.filter(function(d) { 
      if(vuedata.selectedStatus == 'all') {
        return true;
      } else {
        return d == vuedata.selectedStatus;
      } 
    });
    dc.redrawAll();
  });
  
  //Render charts
  createTopMpsChart();
  createRemunerationChart();
  createNaturezaChart();
  createCurrentChart();
  createTypeChart();
  createTopOrgsChart();
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

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
});
});
