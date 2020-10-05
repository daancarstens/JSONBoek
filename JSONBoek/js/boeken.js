const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let resultaat = JSON.parse(xhr.responseText);
    boeken.data = resultaat;
    boeken.uitvoeren();
  }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

const boeken = {
    uitvoeren() {
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
        html += `<h3 class="boek__kopje">${completeTitel}</h3>`;
        html += `<p class="boek__auteurs">${auteurs}</p>`
        html += `<span class="boek__uitgave"> ${this.datumOmzetten(boek.uitgave)}</span>`;
        html += `<span class="boek__ean"> Ean: ${boek.ean}</span>`;
        html += `<span class="boek__paginas"> ${boek.paginas} pagina's </span>`;
        html += `<span class="boek__taal"> ${boek.taal}</span>`;
        html += `<div class="boek__prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</div>`;
        html += `</section> `;

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
