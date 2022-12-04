<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparency.pt/" target="_blank"><img src="./images/ti_logo_pt.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'tabA'}">Declarations</a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Other versions
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">EU</a>
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">France</a>
          <a class="dropdown-item" href="https://www.integritywatch.gr/" target="_blank">Greece</a>
          <a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Italy</a>
          <a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Latvia</a>
          <a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Lithuania</a>
          <a class="dropdown-item" href="http://varuhintegritete.transparency.si/" target="_blank">Slovenia</a>
          <a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Spain</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">UK</a>
        </div>
      </li>
      <li class="nav-item">
        <a href="./about" class="nav-link">About Integrity Watch PT</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
    </ul>
  </div>
</nav>