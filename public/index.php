<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch PT – Declarations</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://integritywatch.transparencia.pt" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch PT – Declarations" />
    <meta property="og:description" content="A plataforma Integrity Watch Portugal é uma ferramenta online que permite a qualquer cidadão visualizar e monitorizar os registos de interesses e dados biográficos dos Deputados da Assembleia da República, através da utilização de dados abertos." />
    <meta property="og:image" content="https://integritywatch.transparencia.pt/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_a.css?v=10">
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
                  <h1>Integrity Watch Portugal - Deputados</h1>
                  <p>Ferramenta interativa de fácil utilização que permite conhecer os interesses declarados dos Deputados da Assembleia da República. Com simples cliques nos gráficos ou na tabela abaixo poderá reordenar e filtrar os dados que pretender visualizar acerca dos Deputados e dos seus interesses declarados e publicamente acessíveis. Ao contrário do registo de interesses, o registo biográfico não é uma ferramenta de cumprimento de obrigações declarativas, apenas servindo o propósito de assegurar uma apresentação curricular de cada Deputado, sendo de preenchimento livre e facultativo.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12">
              <div class="status-selector-container">
                <span class="selector-title">Situação: </span>
                <select id="statusSelector" v-model="selectedStatus">
                  <option value="all" selected="selected">Todas</option>
                  <option value="m13" v-for="status in statusTypes" :value="status">{{status}}</option>
                </select>
              </div>
          </div>
          <!-- CHARTS - FIRST ROW-->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_map">
              <chart-header :title="charts.map.title" :info="charts.map.info" ></chart-header>
              <div class="chart-inner" id="map_chart"></div>
              <div class="map-buttons">
                <button id="EUROPA">EUROPA</button>
                <button id="FORA_DA_EUROPA">FORA DA EUROPA</button>
              </div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.org.title" :info="charts.org.info" ></chart-header>
              <div class="chart-inner" id="org_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.positions.title" :info="charts.positions.info" ></chart-header>
              <div class="chart-inner" id="positions_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.activitiesAllCargos.title" :info="charts.activitiesAllCargos.info" ></chart-header>
              <div class="chart-inner" id="activitiesallcargos_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_5">
              <chart-header :title="charts.activitiesActiveCargos.title" :info="charts.activitiesActiveCargos.info" ></chart-header>
              <div class="chart-inner" id="activitiesactivecargos_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_6">
              <chart-header :title="charts.activitiesOther.title" :info="charts.activitiesOther.info" ></chart-header>
              <div class="chart-inner" id="activitiesother_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_7">
              <chart-header :title="charts.topByActivities.title" :info="charts.topByActivities.info" ></chart-header>
              <div class="chart-inner" id="topbyactivities_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_8">
              <chart-header :title="charts.profession.title" :info="charts.profession.info" ></chart-header>
              <div class="chart-inner" id="profession_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_9">
              <chart-header :title="charts.exclusivity.title" :info="charts.exclusivity.info" ></chart-header>
              <div class="chart-inner" id="exclusivity_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_10">
              <chart-header :title="charts.missingFields.title" :info="charts.missingFields.info" ></chart-header>
              <div class="chart-inner" id="missingfields_chart"></div>
            </div>
          </div>
          <!-- TOGGLE BUTTONS FOR 4TH ROW -->
          <div class="col-md-12 toggle-btn-container">
            <button class="toggle-btn" id="charts-toggle-btn" @click="showAllCharts = !showAllCharts">Ver mais gráficos</button>
          </div>
          <div class="col-md-6 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.age.title" :info="charts.age.info" ></chart-header>
              <div class="chart-inner" id="age_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.gender.title" :info="charts.gender.info" ></chart-header>
              <div class="chart-inner" id="gender_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.regime.title" :info="charts.regime.info" ></chart-header>
              <div class="chart-inner" id="regime_chart"></div>
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
                      <th class="header">Grupo Parlamentar</th> 
                      <th class="header">Profissão</th> 
                      <th class="header">Apoios</th>
                      <th class="header">Serviços Prestados</th> 
                      <th class="header">Sociedades</th> 
                      <th class="header">Interesses Atuais</th> 
                      <th class="header">Interesses Antigos</th> 
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
                    <div class="details-line"><span class="details-line-title">Data de nascimento:</span> {{ selectedElement.cadDtNascimento }}</div>
                    <div class="details-line"><span class="details-line-title">Grupo parlamentar:</span> {{ selectedElement.partyFullName }}</div>
                    <div class="details-line"><span class="details-line-title">Profissão:</span> {{ selectedElement.cadProfissao }}</div>
                    <div class="details-line" v-if="selectedElement.spouse"><span class="details-line-title">Cônjuge:</span> {{ selectedElement.spouse }}</div>
                    <div class="details-line"><a :href="selectedElement.rbUrl" target="_blank">Registo Biográfico</a> | <a :href="selectedElement.riUrl" target="_blank">Registo de Interesses</a></div>
                  </div>
                  <div class="col-md-4">
                    <img :src="selectedElement.photoUrl" />
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'" :class="{active: modalShowTable == 'a'}">Registo de Interesses</button>
                      <button @click="modalShowTable = 'b'" :class="{active: modalShowTable == 'b'}">Registo Biográfico</button>
                    </div>
                    <!-- Modal subsection a -->
                    <div v-show="modalShowTable == 'a'">
                      <div v-if="selectedElement.RegistoInteresses && hasInteresses(selectedElement)">
                        <!-- Cargos menos 3 anos -->
                        <div v-if="selectedElement.RegistoInteresses.GenCargosMenosTresAnos.GenCargo">
                          <div class="modal-table-title">Cargos exercidos há menos de 3 anos</div>
                          <table class="modal-table">
                            <thead>
                              <th>Descrição</th><th>Entidade</th><th>Data Início</th><th>Data Termo</th><th>Remuneração</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenCargosMenosTresAnos.GenCargo">
                                  <td>{{ el.CargoFuncaoAtividade }}</td>
                                  <td>{{ el.Entidade }}</td>
                                  <td>{{ el.DataInicio }}</td>
                                  <td>{{ el.DataTermo }}</td>
                                  <td><span v-if="el.Remunerada == 48">Sim</span><span v-if="el.Remunerada == 78">Não</span></td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Cargos exercidos há menos de 3 anos</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                        <!-- Cargos mais 3 anos -->
                        <div v-if="selectedElement.RegistoInteresses.GenCargosMaisTresAnos.GenCargo">
                          <div class="modal-table-title">Cargos exercidos há mais de 3 anos</div>
                          <table class="modal-table">
                            <thead>
                              <th>Descrição</th><th>Entidade</th><th>Data Início</th><th>Data Termo</th><th>Remuneração</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenCargosMaisTresAnos.GenCargo">
                                  <td>{{ el.CargoFuncaoAtividade }}</td>
                                  <td>{{ el.Entidade }}</td>
                                  <td>{{ el.DataInicio }}</td>
                                  <td>{{ el.DataTermo }}</td>
                                  <td><span v-if="el.Remunerada == 48">Sim</span><span v-if="el.Remunerada == 78">Não</span></td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Cargos exercidos há mais de 3 anos</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                        <!-- Apoios -->
                        <div v-if="selectedElement.RegistoInteresses.GenApoios.GenApoio">
                          <div class="modal-table-title">Apoios</div>
                          <table class="modal-table">
                            <thead>
                              <th>Apoio</th><th>Data</th><th>Entidade</th><th>Natureza - Área</th><th>Natureza - Benefício</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenApoios.GenApoio">
                                  <td>{{ el.Apoio }}</td>
                                  <td>{{ el.Data }}</td>
                                  <td>{{ el.Entidade }}</td>
                                  <td>{{ el.NaturezaArea }}</td>
                                  <td>{{ el.NaturezaBeneficio }}</td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Apoios</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                        <!-- Servico Prestado -->
                        <div v-if="selectedElement.RegistoInteresses.GenServicoPrestado.GenServicoPrestado">
                          <div class="modal-table-title">Serviços Prestados</div>
                          <table class="modal-table">
                            <thead>
                              <th>Servico</th><th>Data</th><th>Entidade</th><th>Natureza</th><th>Local</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenServicoPrestado.GenServicoPrestado">
                                  <td>{{ el.Servico }}</td>
                                  <td>{{ el.Data }}</td>
                                  <td>{{ el.Entidade }}</td>
                                  <td>{{ el.Natureza }}</td>
                                  <td>{{ el.Local}}</td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Serviços Prestados</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                        <!-- Servico Sociedade -->
                        <div v-if="selectedElement.RegistoInteresses.GenSociedade.GenSociedade">
                          <div class="modal-table-title">Sociedades</div>
                          <table class="modal-table">
                            <thead>
                              <th>Sociedade</th><th>Participacao</th><th>Natureza</th><th>NaturezaArea</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenSociedade.GenSociedade">
                                  <td>{{ el.Sociedade }}</td>
                                  <td>{{ el.Participacao }}</td>
                                  <td>{{ el.Natureza }}</td>
                                  <td>{{ el.NaturezaArea }}</td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Sociedades</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                        <!-- Outra Situacao -->
                        <div v-if="selectedElement.RegistoInteresses.GenOutraSituacao.GenOutraSituacao">
                          <div class="modal-table-title">Outras Situações</div>
                          <table class="modal-table">
                            <thead>
                              <th>OutraSituacao</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="el in selectedElement.RegistoInteresses.GenOutraSituacao.GenOutraSituacao">
                                  <td>{{ el.OutraSituacao }}</td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <div class="modal-table-title">Outras Situações</div>
                          <div class="modal-no-data-text">Informação não disponível na base de dados dos registos de interesses.</div>
                        </div>
                      </div>
                      <div v-else>Declaração não disponível na base de dados dos registos de interesses.</div>
                    </div>
                    <!-- Modal subsection b -->
                    <!-- PositionsList -->
                    <div v-show="modalShowTable == 'b'">
                      <div v-if="(selectedElement.cadCargosFuncoes && selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length > 0)">
                        <div class="modal-table-title">Cargos/Funções</div>
                        <table class="modal-table" v-if="selectedElement.cadCargosFuncoes && selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes.length > 0">
                          <thead>
                            <th>Cargos desempenhados</th><th>Antigamente?</th></tr>
                          </thead>
                          <tbody>
                              <tr v-for="el in selectedElement.cadCargosFuncoes.pt_ar_wsgode_objectos_DadosCargosFuncoes">
                                <td>{{ el.funDes }}</td>
                                <td v-if="el.funAntiga == 'S'">Sim</td>
                                <td v-else-if="el.funAntiga == 'N'">Não</td>
                                <td v-else>{{ el.funAntiga }}</td>
                              </tr>
                            </tbody>
                        </table>
                        <div class="modal-table-else" v-else>/</div>
                      </div>
                      <div v-else>
                        <div class="modal-table-title">Cargos/Funções</div>
                        <div class="modal-no-data-text">Informação não disponível na base de dados dos registos biográficos</div>
                      </div>
                      <!-- Qualifications List -->
                      <div v-if="(selectedElement.cadHabilitacoes && selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes.length > 0)">
                        <div class="modal-table-title">Habilitações</div>
                        <table class="modal-table" v-if="selectedElement.cadHabilitacoes && selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes.length > 0">
                          <thead>
                            <th>Descrição</th><th>Estado</th></tr>
                          </thead>
                          <tbody>
                              <tr v-for="el in selectedElement.cadHabilitacoes.pt_ar_wsgode_objectos_DadosHabilitacoes">
                                <td>{{ el.habDes }}</td>
                                <td v-if="el.habEstado == 'C'">Concluído</td>
                                <td v-else-if="el.habEstado == 'F'">Frequência</td>
                                <td v-else>{{ el.habEstado }}</td>
                              </tr>
                            </tbody>
                        </table>
                        <div class="modal-table-else" v-else>/</div>
                      </div>
                      <div v-else>
                        <div class="modal-table-title">Habilitações</div>
                        <div class="modal-no-data-text">Informação não disponível na base de dados dos registos biográficos</div>
                      </div>
                      <!-- Orgs List -->
                      <div v-if="(selectedElement.cadActividadeOrgaos && selectedElement.cadActividadeOrgaos.actividadeCom && selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos.length > 0)">
                        <div class="modal-table-title">Atividade/Órgãos</div>
                        <table class="modal-table" v-if="selectedElement.cadActividadeOrgaos && selectedElement.cadActividadeOrgaos.actividadeCom && selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos.length > 0">
                          <thead>
                            <th>Descrição</th><th>Legislatura</th><th>Qualidade</th><th>Cargo</th></tr>
                          </thead>
                          <tbody>
                              <tr v-for="el in selectedElement.cadActividadeOrgaos.actividadeCom.pt_ar_wsgode_objectos_DadosOrgaos">
                                <td>{{ el.orgDes }}</td>
                                <td>{{ el.legDes }}</td>
                                <td>{{ el.timDes }}</td>
                                <td v-if="el.cargoDes && el.cargoDes.pt_ar_wsgode_objectos_DadosCargosOrgao && el.cargoDes.pt_ar_wsgode_objectos_DadosCargosOrgao.tiaDes">{{ el.cargoDes.pt_ar_wsgode_objectos_DadosCargosOrgao.tiaDes }}</td>
                                <td v-else>/</td>
                              </tr>
                            </tbody>
                        </table>
                        <div class="modal-table-else" v-else>/</div>
                      </div>
                      <div v-else>
                        <div class="modal-table-title">Atividade/Órgãos</div>
                        <div class="modal-no-data-text">Informação não disponível na base de dados dos registos biográficos</div>
                      </div>
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
          <div class="footer-col col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtrar por nome, partido ou profissão">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-sm-8 footer-counts">
            <div class="dc-data-count count-box count-box-deputees">
              <div class="filter-count">0</div>de <strong class="total-count">0</strong> Deputados
            </div>
            <div class="count-box count-box-activities">
              <div class="filter-count nbactivities">0</div>de <strong class="total-count-act">0</strong> cargos
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
    <script type="text/javascript" src="vendor/js/6.5.0_turf.min.js"></script>
    <script src="static/tab_a.js?v=10"></script>

 
</body>
</html>