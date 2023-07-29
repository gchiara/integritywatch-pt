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
    map: {
      title: 'Círculo eleitoral',
      info: 'Número de Deputados por círculo eleitoral. <i>Informação declarada no seu registo biográfico.</i>'
    }, 
    party: {
      title: 'Grupos parlamentares e Deputados não inscritos',
      info: 'Número de Deputados por grupo parlamentar (representantes eleitos por um partido político ou uma coligação) e de Deputados não inscritos. <i>Informação declarada no seu registo biográfico.</i>'
    },
    positions: {
      title: 'Cargos que desempenham',
      info: 'Número de cargos que os Deputados Portugueses desempenham na atualidade. <i>Informação declarada no seu registo biográfico.</i>'
    },
    profession: {
      title: 'Top 10 profissões',
      info: 'Dez profissões mais exercidas pelos Deputados portugueses. <i>Informação declarada no seu registo biográfico.</i>'
    },
    org: {
      title: 'Comissões parlamentares',
      info: 'Comissões parlamentares ordenadas pelo número de Deputados que as compõem. <i>Informação declarada no seu registo biográfico.</i>'
    },
    topByActivities: {
      title: 'Top 10 Deputados por Interesses',
      info: 'Top 10 dos Deputados pelo número de interesses declarados. <i>Informação declarada no seu registo de interesses.</i>'
    },
    activitiesAllCargos: {
      title: 'Interesses: Todos os Cargos/Funções',
      info: 'Número total de cargos/funções exercidos pelos Deputados. <i>Informação declarada no seu registo de interesses.</i>'
    },
    activitiesActiveCargos: {
      title: 'Interesses: Cargos/Funções Atuais',
      info: 'Número total de cargos/funções exercidos pelos Deputados na atualidade. <i>Informação declarada no seu registo de interesses.</i>'
    },
    activitiesOther: {
      title: 'Interesses:<br />Outros',
      info: 'Número total de outros interesses declarados. Dados relativos a apoios ou benefícios, serviços prestados, sociedades detidas pelo próprio e/ou pelo cônjuge, e outras situações. <i>Informação declarada no seu registo de interesses.</i>'
    },
    gender: {
      title: 'Género',
      info: 'Número de Deputados por género. <i>Informação declarada no seu registo biográfico.</i>'
    },
    regime: {
      title: 'Regime de bens',
      info: 'Número de Deputados por regime de bens. <i>Informação declarada no seu registo de interesses.</i> A opção "Não disponível" refere-se aos Deputados cujos registos de interesses não estão disponíveis na respetiva base de dados.'
    },
    age: {
      title: 'Idade',
      info: 'Número de Deputados por faixa etária. <i>IInformação declarada no seu registo biográfico.</i>'
    },
    exclusivity: {
      title: 'Declaração sobre exclusividade',
      info: 'Número total de Deputados que exercem - ou não exercem - o seu mandato em regime de exclusividade. <i>Informação declarada no seu registo de interesses.</i> A opção "Não disponível" refere-se aos Deputados cujos registos de interesses não estão disponíveis na respetiva base de dados.'
    },
    missingFields: {
      title: 'Interesses: Declarações potencialmente incompletas',
      info: 'Número total de campos, por Deputado, para os quais não há informação disponível na base de dados dos registos de interesses.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Deputados',
      info: 'Lista de Deputados ordenados e/ou filtrados de acordo com as suas escolhas. Se pretender voltar a ver a lista completa, clique no botão "Limpar filtros" no canto inferior direito do ecrã.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: 'a',
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
    },
    hasInteresses: function (selectedElement) {
      if (selectedElement.RegistoInteresses.GenCargosMenosTresAnos.GenCargo || 
        selectedElement.RegistoInteresses.GenCargosMaisTresAnos.GenCargo || 
        selectedElement.RegistoInteresses.GenApoios.GenApoio || 
        selectedElement.RegistoInteresses.GenServicoPrestado.GenServicoPrestado || 
        selectedElement.RegistoInteresses.GenSociedade.GenSociedade || 
        selectedElement.RegistoInteresses.GenOutraSituacao.GenOutraSituacao)
      {
        return true;
      }
      return false;
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  map: {
    chart: dc.geoChoroplethChart("#map_chart"),
    type: 'map',
    divId: 'map_chart'
  },
  party: {
    chart: dc.rowChart("#party_chart"),
    type: 'row',
    divId: 'party_chart'
  },
  positions: {
    chart: dc.pieChart("#positions_chart"),
    type: 'pie',
    divId: 'positions_chart'
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
  activitiesAllCargos: {
    chart: dc.pieChart("#activitiesallcargos_chart"),
    type: 'pie',
    divId: 'activitiesallcargos_chart'
  },
  activitiesActiveCargos: {
    chart: dc.pieChart("#activitiesactivecargos_chart"),
    type: 'pie',
    divId: 'activitiesactivecargos_chart'
  },
  activitiesOther: {
    chart: dc.pieChart("#activitiesother_chart"),
    type: 'pie',
    divId: 'activitiesother_chart'
  },
  topByActivities: {
    chart: dc.rowChart("#topbyactivities_chart"),
    type: 'row',
    divId: 'topbyactivities_chart'
  },
  gender: {
    chart: dc.pieChart("#gender_chart"),
    type: 'pie',
    divId: 'gender_chart'
  },
  regime: {
    chart: dc.pieChart("#regime_chart"),
    type: 'pie',
    divId: 'regime_chart'
  },
  age: {
    chart: dc.barChart("#age_chart"),
    type: 'bar',
    divId: 'age_chart'
  },
  exclusivity: {
    chart: dc.pieChart("#exclusivity_chart"),
    type: 'pie',
    divId: 'exclusivity_chart'
  },
  missingFields: {
    chart: dc.rowChart("#missingfields_chart"),
    type: 'row',
    divId: 'missingfields_chart'
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
  if(newWidth > 400) {
    newWidth = 400;
  }
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth*0.85 + 170;
    sizes.radius = (newWidth*0.85)/2;
    sizes.innerRadius = (newWidth*0.85)/4;
    sizes.cy = (newWidth*0.85)/2;
    sizes.legendY = (newWidth*0.85) + 30;
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
    if((c == 'gender' || c == 'age' || c == 'regime') && vuedata.showAllCharts == false){
      
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
      } else if(charts[c].type == 'map') {
        var newProjection = d3.geoMercator()
          .center([11,45]) 
          .scale(newWidth*1)
          .translate([0, 0]);
          charts[c].chart.height(500);
        newProjection.fitSize([newWidth,400],{"type": "FeatureCollection","features":vuedata.fixedFeatures})
        charts[c].chart.width(newWidth);
        charts[c].chart.projection(newProjection);
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

function getNumRange(num) {
  var activitiesRange = '0';
  if(num > 10 ){
    activitiesRange = '> 10';
  } else if(num >= 5 ){
    activitiesRange = '5 - 10';
  } else if(num >= 3){
    activitiesRange= '3 - 4';
  } else if(num >= 1){
    activitiesRange = '1 - 2';
  } else {
    activitiesRange = '0';
  }
  return activitiesRange;
}

function getAgeRange(num) {
  //['N/A', '< 30', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70+']
  var ageRange = 'N/A';
  if(isNaN(parseInt(num))) {
    return 'N/A';
  }
  if(num < 30 ){
    ageRange  = '< 30';
  } else if(num < 40){
    ageRange  = '30 - 39';
  } else if(num < 50){
    ageRange  = '40 - 49';
  } else if(num < 60){
    ageRange  = '50 - 59';
  } else if(num < 70){
    ageRange  = '60 - 69';
  } else {
    ageRange = '70+';
  }
  return ageRange;
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

var declarationsDataset = './data/mpsXV.json';

//Load data and generate charts
var peopleStatusesDebug = [];
json(declarationsDataset, (err, declarations) => {
  //var people = declarations.RegistoBiografico.RegistoBiograficoList.pt_ar_wsgode_objectos_DadosRegistoBiograficoWeb;
  var people = declarations;
  var statusTypes = [];
  //Loop through data to apply fixes and calculations
  _.each(people, function (d) {
    d.sDebugEntry = {}
    d.sDebugEntry.name = d.cadNomeCompleto;

    //Add status to array if not present
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
    d.sDebugEntry.status = d.status;
    //d.sDebugEntry.statusAll = d.basicInfo.depSituacao.pt_ar_wsgode_objectos_DadosSituacaoDeputado;
    peopleStatusesDebug.push(d.sDebugEntry);

    //Esclusividade
    d.exclusivityString = 'Não disponível';
    if(d.RegistoInteresses && d.RegistoInteresses.Exclusividade && d.RegistoInteresses.Exclusividade.Exclusividade) {
      if(d.RegistoInteresses.Exclusividade.Exclusividade == "true") {
        d.exclusivityString = 'Exclusividade';
      } else if(d.RegistoInteresses.Exclusividade.Exclusividade == "false") {
        d.exclusivityString = 'Não';
      } else {
        d.exclusivityString = d.RegistoInteresses.Exclusividade.Exclusividade;
      }
    }
    //Age
    if(!d.cadDtNascimento) {
      d.age = "N/A";
    } else {
      d.age = getAge(d.cadDtNascimento);
    }
    d.ageRange = getAgeRange(d.age);
    //Spouse name
    d.spouse = 'N/A';
    d.propertyRegime = 'Não disponível';
    if(d.RegistoInteresses) {
      d.spouse = d.RegistoInteresses.GenDadosPessoais.NomeConjuge;
      d.propertyRegime = d.RegistoInteresses.GenDadosPessoais.RegimeBens;
    }
    //Find party corresponding with current legislation (legislation num is set as vuedata parameter)
    d.party = "N/A";
    d.partyFullName = "N/A";
    d.area = null;
    var partiesLegInfo = d.cadDeputadoLegis.pt_ar_wsgode_objectos_DadosDeputadoLegis;
    partiesLegInfo = fixArray(partiesLegInfo);
    if(partiesLegInfo && partiesLegInfo.length > 0) {
      _.each(partiesLegInfo, function (pInfo) {
        if( pInfo.legDes == vuedata.legislature) {
          d.party = pInfo.gpSigla;
          d.partyFullName = pInfo.gpDes;
          d.area = pInfo.ceDes;
        }
      });
    }
    //Clean profession 
    d.profession = 'N/A';
    if(d.cadProfissao) {
      d.profession = d.cadProfissao.charAt(0).toUpperCase() + d.cadProfissao.slice(1).toLowerCase();
    }
    //Get this person's links
    d.rbUrl = 'https://www.parlamento.pt/DeputadoGP/Paginas/Biografia.aspx?BID='+d.cadId;
    d.riUrl = 'https://www.parlamento.pt/DeputadoGP/Paginas/RegInteresses_v5.aspx?BID='+d.cadId+'&leg='+vuedata.legislature;
    //Activities - Adding AllCargos and Others
    d.activitiesNumTot = 0;
    d.activitiesNumTot = d.activitiesCounts.AllCargos + d.activitiesCounts.Other;
    totalActivities += d.activitiesNumTot;
    d.positionsNumTot = 0;
    //Positions
    if(d.cadCargosFuncoes && d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes) {
      d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes = fixArray(d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes);
      //d.activitiesNumTot = d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length;
      _.each(d.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes, function (act) {
          if(act.funAntiga == 'N') {
            d.positionsNumTot ++;
          }
      });
    }
    d.activitiesTotRange = getNumRange(d.activitiesNumTot);
    d.positionsRange = getNumRange(d.positionsNumTot);
    d.activitiesAllCargosRange = getNumRange(d.activitiesCounts.AllCargos);
    d.activitiesActiveCargosRange = getNumRange(d.activitiesCounts.ActiveCargos);
    d.activitiesOtherRange = getNumRange(d.activitiesCounts.Other);
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
    //Fix structure of interesses
    if(d.RegistoInteresses) {
      if(d.RegistoInteresses.GenApoios.GenApoio) {
        d.RegistoInteresses.GenApoios.GenApoio = fixArray(d.RegistoInteresses.GenApoios.GenApoio);
      }
      if(d.RegistoInteresses.GenCargosMaisTresAnos.GenCargo) {
        d.RegistoInteresses.GenCargosMaisTresAnos.GenCargo = fixArray(d.RegistoInteresses.GenCargosMaisTresAnos.GenCargo);
      }
      if(d.RegistoInteresses.GenCargosMenosTresAnos.GenCargo) {
        d.RegistoInteresses.GenCargosMenosTresAnos.GenCargo = fixArray(d.RegistoInteresses.GenCargosMenosTresAnos.GenCargo);
      }
      if(d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado) {
        d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado = fixArray(d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado);
      }
      if(d.RegistoInteresses.GenSociedade.GenSociedade) {
        d.RegistoInteresses.GenSociedade.GenSociedade = fixArray(d.RegistoInteresses.GenSociedade.GenSociedade);
      }
      if(d.RegistoInteresses.GenOutraSituacao.GenOutraSituacao) {
        d.RegistoInteresses.GenOutraSituacao.GenOutraSituacao = fixArray(d.RegistoInteresses.GenOutraSituacao.GenOutraSituacao);
      }
      //GenIncompatibilidade ?
    }
    //Count missing fields in interesses
    d.missingInterestFields = 0;
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenApoios.GenApoio || d.RegistoInteresses.GenApoios.GenApoio.length == 0) {
      d.missingInterestFields ++;
    }
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenCargosMaisTresAnos.GenCargo || d.RegistoInteresses.GenCargosMaisTresAnos.GenCargo.length == 0) {
      d.missingInterestFields ++;
    }
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenCargosMenosTresAnos.GenCargo || d.RegistoInteresses.GenCargosMenosTresAnos.GenCargo.length == 0) {
      d.missingInterestFields ++;
    }
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado || d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado.length == 0) {
      d.missingInterestFields ++;
    }
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenSociedade.GenSociedade || d.RegistoInteresses.GenSociedade.GenSociedade.length == 0) {
      d.missingInterestFields ++;
    }
    if(!d.RegistoInteresses || !d.RegistoInteresses.GenOutraSituacao.GenOutraSituacao || d.RegistoInteresses.GenOutraSituacao.GenOutraSituacao.length == 0) {
      d.missingInterestFields ++;
    }
  });
  vuedata.statusTypes = statusTypes;


  //Set totals for footer counters
  $('.count-box-activities .total-count-act').text(totalActivities);

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(people);

  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.cadNomeCompleto + ' ' + d.cadProfissao + ' ' + d.party + ' ' + d.partyFullName;
      return entryString.toLowerCase();
  });

  var statusDimension = ndx.dimension(function (d) {
    return d.status;
  });

  var areaDimension = ndx.dimension(function (d) {
    return d.area;
  });

  //MAP CHART
  var createMapChart = function() {
    json('./data/map.geojson', (err, jsonmap) => {
      //jsonmap.features
      _.each(jsonmap.features, function (p) {
        
      });

      var fixedFeatures = jsonmap.features.map(function(feature) {
        return turf.rewind(feature,{reverse:true});
      })
      vuedata.fixedFeatures = fixedFeatures;

      var chart = charts.map.chart;
      var width = recalcWidth(charts.map.divId);
      var height = 400;
      var mapDimension = ndx.dimension(function (d) {
        return d.area;
      });
      var group = mapDimension.group().reduceSum(function (d) { return 1; });
      //var prov = topojson.feature(jsonmap, jsonmap.objects["spain-provinces"]).features;
      var scale = width*4;
      var translate = [0, 0];
      var projection = d3.geoMercator()
        .center([-3,42.5])
        .scale(1)
        .translate(translate);
      projection.fitSize([width,height],{"type": "FeatureCollection","features":fixedFeatures})
      var centered;
      function clicked(d) {
      }
  
      chart
        .width(width)
        .height(function(d){ return height; })
        .dimension(mapDimension)
        .group(group)
        .projection(projection)
        .colors(d3.scaleQuantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([1, 20])
        .colorCalculator(function (d) { return d == 0 ? '#eee' : chart.colors()(d);})
        .overlayGeoJson(fixedFeatures, 'province', function(d) {
          return d.properties.dis_name_upper;
        })
        .title(function (d) {
          return d.key + ': ' + d.value;
        })
        .on('renderlet', function(chart) {});
      chart.render();
    });
  }

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
      .height(440)
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

  //CHART 2 - Positions
  var createPositionsChart = function() {
    var chart = charts.positions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.positionsRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','5 - 10', '> 10'];
    var sizes = calcPieSize(charts.positions.divId);
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
      .height(405)
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
          return source_group.top(100).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.org.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(470)
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

  //CHART 5 - Activities 1
  var createActivitiesAllCargosChart = function() {
    var chart = charts.activitiesAllCargos.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesAllCargosRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','5 - 10', '> 10'];
    var sizes = calcPieSize(charts.activitiesAllCargos.divId);
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

  //CHART 5 - Activities 2
  var createActivitiesActiveCargosChart = function() {
    var chart = charts.activitiesActiveCargos.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesActiveCargosRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','5 - 10', '> 10'];
    var sizes = calcPieSize(charts.activitiesActiveCargos.divId);
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

  //CHART 5 - Activities 3
  var createActivitiesOtherChart = function() {
    var chart = charts.activitiesOther.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesOtherRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','5 - 10', '> 10'];
    var sizes = calcPieSize(charts.activitiesOther.divId);
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

  //CHART 6 - Top Mps by Activities
  var createTopByActivitiesChart = function() {
    var chart = charts.topByActivities.chart;
    var dimension = ndx.dimension(function (d) {
        return d.cadNomeCompleto;
    });
    var group = dimension.group().reduceSum(function (d) {
      return d.activitiesNumTot;
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
    var width = recalcWidth(charts.topByActivities.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(380)
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

  //MISSING FIELDS CHART
  var createMissingFieldsChart = function() {
    var chart = charts.missingFields.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.missingInterestFields == 1) {
        return d.missingInterestFields + ' campo';
      }
      return d.missingInterestFields + ' campos';
    });
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var order = ['6 campos','5 campos','4 campos','3 campos','2 campos','1 campo'];
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0 && d.key != '0 campos');
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.missingFields.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(350)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .ordering(function(d) { return order.indexOf(d.key)})
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
          return d.key + ': ' + d.value + ' deputados';
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 7 - Age
  var createAgeChart = function() {
    var chart = charts.age.chart;
    var dimension = ndx.dimension(function (d) {
        return d.ageRange;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.age.divId);
    chart
      .width(width)
      .height(400)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand().domain(['< 30', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70+']))
      .xUnits(dc.units.ordinal)
      .gap(10)
      .ordinalColors(vuedata.colors.generic)
      .elasticY(true);
    chart.render();
  }

  //CHART 8 - Gender
  var createGenderChart = function() {
    var chart = charts.gender.chart;
    var dimension = ndx.dimension(function (d) {
      if(!d.cadSexo) { return "N/A"; }
      if(d.cadSexo == 'M') { return 'Masculino'; }
      if(d.cadSexo == 'F') { return 'Feminino'; }
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
      .ordinalColors(vuedata.colors.generic)
      .dimension(dimension)
      .group(group);
    chart.render();
  }

  //CHART 9 - Regime
  var createRegimeChart = function() {
    var chart = charts.regime.chart;
    var dimension = ndx.dimension(function (d) {
      if(!d.propertyRegime) { return "N/A"; }
      return d.propertyRegime;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.regime.divId);
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
      .ordinalColors(vuedata.colors.generic)
      .dimension(dimension)
      .group(group);
    chart.render();
  }

  //CHART 10 - Exclusividade
  var createExclusivityChart = function() {
    var chart = charts.exclusivity.chart;
    var dimension = ndx.dimension(function (d) {
      return d.exclusivityString;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.exclusivity.divId);
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
          "className": "dt-body-center",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.RegistoInteresses && d.RegistoInteresses.GenApoios.GenApoio) {
              return d.RegistoInteresses.GenApoios.GenApoio.length;
            }
            return 0;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "className": "dt-body-center",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.RegistoInteresses && d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado) {
              return d.RegistoInteresses.GenServicoPrestado.GenServicoPrestado.length;
            }
            return 0;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "className": "dt-body-center",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.RegistoInteresses && d.RegistoInteresses.GenSociedade.GenSociedade) {
              return d.RegistoInteresses.GenSociedade.GenSociedade.length;
            }
            return 0;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "className": "dt-body-center",
          "defaultContent":"N/A",
          "data": function(d) {
            return d.activitiesCounts.ActiveCargos;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
          "className": "dt-body-center",
          "defaultContent":"N/A",
          "data": function(d) {
            return d.activitiesCounts.AllCargos - d.activitiesCounts.ActiveCargos;
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
      //vuedata.modalShowTable = 'a';
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

  //Europa and fora de europa buttons
  $('#EUROPA').click(function () {
    $('.map-buttons button').removeClass('active');
    $(this).addClass('active');
    areaDimension.filter(function (d) { 
      return d == 'EUROPA';
    });
    dc.redrawAll();
    RefreshTable();
    $('#map_chart svg .layer0 .province').each(function(i) {
      $(this).removeClass('selected');
      $(this).addClass('deselected');
    });
  });
  $('#FORA_DA_EUROPA').click(function () {
    $('.map-buttons button').removeClass('active');
    $(this).addClass('active');
    areaDimension.filter(function (d) { 
      return d == 'FORA DA EUROPA';
    });
    dc.redrawAll();
    RefreshTable();
    $('#map_chart svg .layer0 .province').each(function(i) {
      $(this).removeClass('selected');
      $(this).addClass('deselected');
    });
  });

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    statusDimension.filter(null);
    areaDimension.filter(null);
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
  createMapChart();
  createPartyChart();
  createPositionsChart();
  createTopProfessionsChart();
  createTopOrgsChart();
  createActivitiesAllCargosChart();
  createActivitiesActiveCargosChart();
  createActivitiesOtherChart();
  createTopByActivitiesChart();
  createAgeChart();
  createGenderChart();
  createRegimeChart();
  createExclusivityChart();
  createMissingFieldsChart();
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
        p.actnum = +d.activitiesNumTot;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.cadId) {
          return p;
        }
        p.actnum = +d.activitiesNumTot;
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
