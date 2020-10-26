const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest();
const taalKeuze = document.querySelectorAll('.besturing__cb-taal')
const selectSort = document.querySelector('.besturing__select')

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let resultaat = JSON.parse(xhr.responseText);
    boeken.filteren( resultaat);
    boeken.uitvoeren();
  }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

const boeken = {

    taalFilter: ['Nederlands', 'Duits', 'Engels'],
    es: 'titel',
    oplopend: 1,

    filteren( gegevens ) {
      this.data = gegevens.filter( (bk) => {
        let bool = false;
          this.taalFilter.forEach( (taal) => {
            if( bk.taal == taal ) { bool = true }
          } )
        return bool
      } )
    },
    sorteren() {
      if (this.es == 'titel') {this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? this.oplopend : -1*this.oplopend );}
      else if (this.es == 'paginas') {this.data.sort( (a,b) => ( a.paginas > b.paginas ) ? this.oplopend : -1*this.oplopend );}
      else if (this.es == 'uitgave') {this.data.sort( (a,b) => ( a.uitgave > b.uitgave ) ? this.oplopend : -1*this.oplopend );}
      else if (this.es == 'prijs') {this.data.sort( (a,b) => ( a.prijs > b.prijs ) ? this.oplopend : -1*this.oplopend );}
      else if (this.es == 'auteurs') {this.data.sort( (a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam ) ? this.oplopend : -1*this.oplopend );}
    },

    uitvoeren() {
      this.sorteren();

      let html = "";
      this.data.forEach(boek => {
          let completeTitel = "";
        if(boek.voortitel) {
          completeTitel += boek.voortitel + " ";
        }
        completeTitel += boek.titel;

        let auteurs = "";
        boek.auteurs.forEach((schrijver, index) => {
            let tv = schrijver.tussenvoegsel ? schrijver.tussenvoegsel +" " : "";
            let seperator = ", ";
            if (index >= boek.auteurs.length-2) {
              seperator = " en ";
            }
            if (index >= boek.auteurs.length-1) {
              seperator = "";
            }
            auteurs += schrijver.voornaam + " " + tv + schrijver.achternaam + seperator;
        })

        html += `<section class="boek"> `;
        html += `<img class="boek__cover" src="${boek.cover}" alt="${completeTitel}">`;
        html += `<div class="boek__info">`;
        html += `<h3 class="boek__kopje">${completeTitel}</h3>`;
        html += `<p class="boek__auteurs">${auteurs}</p>`
        html += `<span class="boek__uitgave"> ${this.datumOmzetten(boek.uitgave)}</span>`;
        html += `<span class="boek__ean"> Ean: ${boek.ean}</span>`;
        html += `<span class="boek__paginas"> ${boek.paginas} pagina's </span>`;
        html += `<span class="boek__taal"> ${boek.taal}</span>`;
        html += `<div class="boek__prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
        <a href="#" class="boek__bestel-knop">bestellen</a></div>`;
        html += `</div></section> `;

      });
      uitvoer.innerHTML = html;
    },
    datumOmzetten(datumString) {
      let datum = new Date(datumString);
      let jaar = datum.getFullYear();
      let maand = this.geefMaandnaam(datum.getMonth());
      return `${maand} ${jaar}`;
    },
    geefMaandnaam(m) {
      let maand = "";
      switch (m) {
        case 0 : maand = 'Januari'; break;
        case 1 : maand = 'Februari'; break;
        case 2 : maand = 'Maart'; break;
        case 3 : maand = 'April'; break;
        case 4 : maand = 'Mei'; break;
        case 5 : maand = 'Juni'; break;
        case 6 : maand = 'Juli'; break;
        case 7 : maand = 'Augustus'; break;
        case 8 : maand = 'September'; break;
        case 9 : maand = 'Oktober'; break;
        case 10 : maand = 'November'; break;
        case 11 : maand = 'December'; break;
        default : maand = m;
      }
      return maand;
    }
}

const pasFilterAan = () => {
  let gecheckteTaalKeuze = [];
  taalKeuze.forEach( cb => {
    if (cb.checked) gecheckteTaalKeuze.push( cb.value);
  } );
  boeken.taalFilter = gecheckteTaalKeuze;
  boeken.filteren( JSON.parse(xhr.responseText) );
  boeken.uitvoeren();
}

const pasSorteerEigAan = () => {
  boeken.es = selectSort.value;
  boeken.uitvoeren();
}

taalKeuze.forEach( cb => cb.addEventListener('change', pasFilterAan) );

selectSort.addEventListener('change', pasSorteerEigAan);

document.querySelectorAll('.besturing__rb').forEach(rb => rb.addEventListener('change', () => {
  boeken.oplopend = rb.value;
  boeken.uitvoeren();
}))
