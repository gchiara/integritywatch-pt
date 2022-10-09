<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch PT – Declarations</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.nl" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch PT – Declarations" />
    <meta property="og:description" content="Lorem ipsum" />
    <meta property="og:image" content="https://www.integritywatch.pt/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_a.css">
</head>
<body>
    <div id="app" class="tabA">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Portugal - Declarations</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean auctor sem vel ipsum faucibus, non cursus ipsum tincidunt. Phasellus ut nisl libero. Mauris vitae nunc sed justo dictum iaculis quis id sapien. Aliquam aliquam nunc et sapien congue, viverra dignissim erat rhoncus. Integer at dignissim arcu. Sed ut quam quis ex cursus tincidunt imperdiet in eros. Vivamus pretium hendrerit elit, non auctor nisl lobortis vel.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.activities.title" :info="charts.activities.info" ></chart-header>
              <div class="chart-inner" id="activities_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.profession.title" :info="charts.profession.info" ></chart-header>
              <div class="chart-inner" id="profession_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.org.title" :info="charts.org.info" ></chart-header>
              <div class="chart-inner" id="org_chart"></div>
            </div>
          </div>
          <!--
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.gender.title" :info="charts.gender.info" ></chart-header>
              <div class="chart-inner" id="gender_chart"></div>
            </div>
          </div>
          -->
          
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" :info="charts.mainTable.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Name</th> 
                      <th class="header">Party</th> 
                      <th class="header">Profession</th> 
                      <th class="header">Activities</th> 
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
                <div class="">{{ selectedElement.cadNomeCompleto }}</div>
                <div>{{ selectedElement.party }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-8">
                    <div class="details-line"><span class="details-line-title">Birthdate:</span> {{ selectedElement.cadDtNascimento }}</div>
                    <div class="details-line"><span class="details-line-title">Party:</span> {{ selectedElement.partyFullName }}</div>
                    <div class="details-line"><span class="details-line-title">Profession:</span> {{ selectedElement.cadProfissao }}</div>
                  </div>
                  <div class="col-md-4">
                    <img :src="selectedElement.photoUrl" />
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <!--
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'">Positions</button>
                    </div>
                    -->
                    <!-- Positions List -->
                    <div v-show="modalShowTable == 'a' || (selectedElement.cadCargosFuncoes && selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length > 0)">
                      <div class="modal-table-title">Cargos Funcoes</div>
                      <table class="modal-table" v-if="selectedElement.cadCargosFuncoes && selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length > 0">
                        <thead>
                          <th>Description</th><th>Old?</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="el in selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes">
                              <td>{{ el.funDes }}</td>
                              <td>{{ el.funAntiga }}</td>
                            </tr>
                          </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Qualifications List -->
                    <div v-show="modalShowTable == 'b' || (selectedElement.cadHabilitacoes && selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes.length > 0)">
                      <div class="modal-table-title">Habilitacoes</div>
                      <table class="modal-table" v-if="selectedElement.cadHabilitacoes && selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes.length > 0">
                        <thead>
                          <th>Description</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="el in selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes">
                              <td>{{ el.habDes }}</td>
                              <td>{{ el.habEstado }}</td>
                            </tr>
                          </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Orgs List -->
                    <div v-show="modalShowTable == 'c' || (selectedElement.cadActividadeOrgaos && selectedElement.cadActividadeOrgaos.actividadeCom && selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos.length > 0)">
                      <div class="modal-table-title">Actividade Orgaos</div>
                      <table class="modal-table" v-if="selectedElement.cadActividadeOrgaos && selectedElement.cadActividadeOrgaos.actividadeCom && selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos.length > 0">
                        <thead>
                          <th>Description</th><th>Legislation</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="el in selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos">
                              <td>{{ el.orgDes }}</td>
                              <td>{{ el.legDes }}</td>
                              <td>{{ el.timDes }}</td>
                            </tr>
                          </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
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
          <div class="footer-col col-sm-3">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter by name, party or profession">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-sm-9 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>of <strong class="total-count">0</strong> people
            </div>
            <div class="count-box count-box-activities">
              <div class="filter-count nbactivities">0</div>of <strong class="total-count-act">0</strong> activities
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
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
    <script src="static/tab_a.js"></script>

 
</body>
</html>