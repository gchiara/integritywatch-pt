<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparencia.pt/" target="_blank"><img src="./images/ti_logo_pt.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" :class="{active: page == 'tabA'}" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Deputados
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" :class="{active: page == 'tabA' && legislature == 'XV'}" href="./deputados.php?legislatura=XV">XV legislatura</a>
          <a class="dropdown-item" :class="{active: page == 'tabA' && legislature == 'XIV'}" href="./deputados.php?legislatura=XIV">XIV legislatura</a>
        </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" :class="{active: page == 'tabB'}" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Interesses
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" :class="{active: page == 'tabB' && legislature == 'XV'}"  href="./cargos.php?legislatura=XV">XV legislatura</a>
          <a class="dropdown-item" :class="{active: page == 'tabB' && legislature == 'XIV'}" href="./cargos.php?legislatura=XIV">XIV legislatura</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Outras versões
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">União Europeia</a>
          <a class="dropdown-item" href="http://varuhintegritete.transparency.si/" target="_blank">Eslovénia</a>
          <a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Espanha</a>
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">França</a>
          <a class="dropdown-item" href="https://www.integritywatch.gr/" target="_blank">Grécia</a>
          <a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Itália</a>
          <a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Letónia</a>
          <a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Lituânia</a>
          <a class="dropdown-item" href="https://www.integritywatch.nl/" target="_blank">Países Baixos</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">Reino Unido</a>
        </div>
      </li>
      <li class="nav-item">
        <a href="./sobre.php" class="nav-link">Sobre</a>
      </li>
      <!--
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
      -->
    </ul>
  </div>
</nav>