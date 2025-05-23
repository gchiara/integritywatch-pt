<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch PT – Interesses: Cargos</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://integritywatch.transparencia.pt/cargos.php" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch Portugal | Interesses: Cargos" />
    <meta property="og:description" content="A plataforma Integrity Watch Portugal é uma ferramenta online que permite a qualquer cidadão visualizar e monitorizar os registos de interesses e dados biográficos dos Deputados da Assembleia da República, através da utilização de dados abertos." />
    <meta property="og:image" content="https://integritywatch.transparencia.pt/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_b.css?v=10">
</head>
<body>
    <div id="app" class="tabB">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Portugal - Interesses: Cargos</h1>
                  <p class="legislature-tag">{{legislature}} Legislatura</p>
                  <p>Ferramenta interativa de fácil utilização que permite conhecer os interesses declarados dos Deputados da Assembleia da República. Com simples cliques nos gráficos ou na lista abaixo poderá reordenar e filtrar os dados que pretender visualizar acerca dos Deputados e dos seus interesses declarados e publicamente acessíveis. Dados relativos a atividades profissionais, cargos públicos, privados e sociais, e outras funções e atividades exercidos nos últimos três anos e/ou a exercer em acumulação ou exercidos até três anos após a cessação de funções.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- ACTIVITIES TYPE SELECTOR -->
          <div class="col-md-12 chart-col acttype-select-container">
            <a :href="'./cargos.php?legislatura='+legislature" class="link-button active">Cargos</a>
            <a :href="'./outros-interesses.php?legislatura='+legislature" class="link-button">Outros Interesses</a>
            <span class="status-selector-container status-selector-container-right">
              <span class="selector-title">Situação: </span>
              <select id="statusSelector" v-model="selectedStatus">
                <option value="all" selected="selected">Todas</option>
                <option value="m13" v-for="status in statusTypes" :value="status">{{status}}</option>
              </select>
            </span>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_1">
              <chart-header :title="charts.topMps.title" :info="charts.topMps.info" ></chart-header>
              <div class="chart-inner" id="topmps_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_2">
              <chart-header :title="charts.org.title" :info="charts.org.info" ></chart-header>
              <div class="chart-inner" id="org_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_3">
              <chart-header :title="charts.natureza.title" :info="charts.natureza.info" ></chart-header>
              <div class="chart-inner" id="natureza_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_4">
              <chart-header :title="charts.remuneration.title" :info="charts.remuneration.info" ></chart-header>
              <div class="chart-inner" id="remuneration_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_5">
              <chart-header :title="charts.current.title" :info="charts.current.info" ></chart-header>
              <div class="chart-inner" id="current_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_b_6">
              <chart-header :title="charts.type.title" :info="charts.type.info" ></chart-header>
              <div class="chart-inner" id="type_chart"></div>
            </div>
          </div>
          
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" :info="charts.mainTable.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Nome</th> 
                      <th class="header">Cargo/Função/Atividade</th> 
                      <th class="header">Entidade</th> 
                      <th class="header">Remuneração</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="">{{ selectedElement.NomeIdentificacao }}</div>
                <div>{{ selectedElement.CargoFuncaoAtividade}}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Entidade:</span> {{ selectedElement.Entidade }}</div>
                    <div class="details-line"><span class="details-line-title">Data Início:</span> {{ selectedElement.DataInicio }}</div>
                    <div class="details-line" v-if="selectedElement.DataTermo && selectedElement.DataTermo !== null"><span class="details-line-title">Data Termo:</span> {{ selectedElement.DataTermo }}</div>
                    <div class="details-line" v-else><span class="details-line-title">Data Termo:</span> /</div>
                    <div class="details-line"><span class="details-line-title">Local Sede:</span> {{ selectedElement.LocalSede }}</div>
                    <div class="details-line"><span class="details-line-title">Natureza:</span> {{ selectedElement.Natureza }}</div>
                    <div class="details-line"><span class="details-line-title">Remuneração:</span> {{ selectedElement.remuneradaString }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtrar por nome, cargo ou entidade">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>de <strong class="total-count">0</strong> cargos
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Limpar filtros</span></button>
        <!-- Share buttons -->
        <div class="footer-buttons-right">
          <button class="btn-twitter" @click="share('twitter')"><img src="./images/twitter.png" /></button>
          <button class="btn-fb" @click="share('facebook')"><img src="./images/facebook.png" /></button>
          <button class="btn-linkedin" @click="share('linkedin')"><img src="./images/linkedin.png" /></button>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_b.js?v=10"></script>

 
</body>
</html>