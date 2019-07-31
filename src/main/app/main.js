function getRequest() {
    var resultElement = document.getElementById('todo')
    var valmiitElement = document.getElementById('valmiit')
    resultElement.innerHTML = '';
    valmiitElement.innerHTML = '';

    axios.get('http://localhost:8080/api/todo/')
        .then(function (response) {
            for(var t of response.data) {
                if(t.tarkempiTodo===null || t.tarkempiTodo.trim()==='') t.tarkempiTodo = 'Ei lisätietoja';
                if (!Boolean(t.valmis)) {
                    resultElement.innerHTML +=  '<tr>' + '<td id="rivi' + t.id + '"><span id="alkuperainen' + t.id + '">' + t.todo + '</span><span class="muokkausClass" id="muokkaus' + t.id + '"><input class="muokkausTekstiClass" id="muokkaaTodo' + t.id + '" type="text" value="' + t.todo + '"/>' + '&nbsp&nbsp&nbsp' + '<button id="muokkausSubmit" onclick="muokkaus(' + t.id + ')">Submit</button></span>' +
                        '<div id="toiminnot">' + '<span class="aikatauluClass" id="aikatauluId' + t.id + '">' + paivamaara(t.aikataulu)+ '&nbsp&nbsp&nbsp&nbsp&nbsp' + kellonAika(t.aikataulu) + '</span>' +
                        '<span class="aikatauluClassMuutos" id="aikatauluIdMuutos' + t.id + '">' + 'Deadline: &nbsp&nbsp' + '<input id="pvmMuutos' + t.id + '" type="date" value="' + pvmValue(t.aikataulu) + '" />' + '&nbsp&nbsp&nbsp&nbsp&nbsp' + '<input id="tuntiMuutos' + t.id + '" type="number" min="0" max="23" value="' + tuntiValue(t.aikataulu) + '" />' + '<input id="minuuttiMuutos' + t.id + '" type="number" min="0" max="59" value="' + minuuttiValue(t.aikataulu) + '" />' + '</span>' +
                        '<button id="nuoli' + t.id + '" onclick="lisaaTietoa(' + t.id + ')">▼</button><button onclick="muokkaa(' + t.id + ')">...</button><button onclick="tehty(' + t.id + ')">√</button><button onclick="delRequest(' + t.id + ')">Delete</button></div>' +
                        '<br><br><span class="lisatiedot" id="more' + t.id + '">' + t.tarkempiTodo + '</span>' + '<span class="muokkausClass" id="muokkausLisa' + t.id + '"><input class="muokkausTekstiClass" id="muokkaaLisaTodo' + t.id + '" type="text" value="' + t.tarkempiTodo + '"/></span>' + '</td>' + '</tr>'
                    jaljessa(t.id, t.aikataulu)

                } else if (Boolean(t.valmis)) {
                    valmiitElement.innerHTML += '<tr>' + '<td><span id="alkuperainen' + t.id + '">' + t.todo + '</span>' +
                        '<div id="toiminnot">' + '<span class="aikatauluClass" id="aikatauluId' + t.id + '">' + paivamaara(t.aikataulu)+ '&nbsp&nbsp&nbsp&nbsp&nbsp' + kellonAika(t.aikataulu) + '</span>' +
                        '<button id="nuoli' + t.id + '" onclick="lisaaTietoa(' + t.id + ')">▼</button><button onclick="eiSittenkaanTehty(' + t.id + ')">-</button><button onclick="delRequest(' + t.id + ')">Delete</button></div>' + '<br><br><span class="lisatiedot" id="more' + t.id + '">' + t.tarkempiTodo + '</span>' + '</td>' + '</tr>'
                }
            }
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error);
        });
}

function lisaaTietoa(t) {
    var lisatiedot = document.getElementById("more"+t)
    var nuoliTeksti = document.getElementById("nuoli"+t)

    if (lisatiedot.style.display === "inline") {
        lisatiedot.style.display = "none"
        nuoliTeksti.innerHTML = "▼"
    } else {
        lisatiedot.style.display = "inline"
        nuoliTeksti.innerHTML = "▲"
    }
}

function errorHTMLOutput(error) {
    return  '<p>' + JSON.stringify(error.response.headers, null, '\t') + '</p>' +
        '<p>' + JSON.stringify(error.response.data, null, '\t') + '</p>';
}

function delRequest(e) {
    var resultElement = document.getElementById('postResult')
    axios.delete('http://localhost:8080/api/todo/' + e)
        .then (function(response) {
            getRequest();
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error);
        })

}


document.getElementById('todoInputForm').addEventListener('submit', postRequest)

function postRequest(e) {
    var resultElement = document.getElementById('postResult')
    var uusi = document.getElementById('uusi').value;
    var lisatiedot = document.getElementById('lisatiedot').value;
    resultElement.innerHTML = '';

    axios.post('http://localhost:8080/api/todo/', {
        todo: uusi,
        tarkempiTodo: lisatiedot,
        aikataulu: pvmMuunnos()
    })
        .then (function(response) {
            getRequest();
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error);
        })
    e.preventDefault();
    document.getElementById('uusi').value = '';
    document.getElementById('lisatiedot').value = '';
    document.getElementById('pvm').value = '';
    document.getElementById('tunti').value = '';
    document.getElementById('minuutti').value = '';
    lisays();
}

function lisays() {
    var lisays = document.getElementById("lisays")
    var plussa = document.getElementById("plusnappula")

    if (lisays.style.display === "inline") {
        lisays.style.display = "none"
        plussa.innerHTML = "+"
    } else {
        lisays.style.display = "inline"
        plussa.innerHTML = "-"
    }
}

function valmiit() {
    var valmiit = document.getElementById("valmiitdiv")
    var vnap = document.getElementById("valmisnappula")

    if (valmiit.style.display === "inline") {
        valmiit.style.display = "none"
        vnap.innerHTML = "Valmiit ▼"
    } else {
        valmiit.style.display = "inline"
        vnap.innerHTML = "Valmiit ▲"
    }
}

function tehty(e) {
    var resultElement = document.getElementById('postResult')

    axios.put('http://localhost:8080/api/todo/' + e, {
        valmis: true
    })
        .then (function (response) {
            getRequest();
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error)
        })

}

function eiSittenkaanTehty(e) {
    var resultElement = document.getElementById('postResult')

    axios.put('http://localhost:8080/api/todo/' + e, {
        valmis: false
    })
        .then (function (response) {
            getRequest();
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error)
        })

}

function muokkaa(e) {
    var muokkaus = document.getElementById('muokkaus' + e)
    var alkup = document.getElementById('alkuperainen' + e)
    var lisaMuokkaus = document.getElementById('muokkausLisa' + e)
    var lisaAlkup = document.getElementById('more' + e)
    var aikatauluMuutos = document.getElementById('aikatauluIdMuutos' + e)
    var aikatauluAlkup = document.getElementById('aikatauluId' + e)


    if (alkup.style.display === "none") {
        alkup.style.display = "inline"
        lisaAlkup.style.display = "inline"
        aikatauluAlkup.style.display = "inline"
        muokkaus.style.display = "none"
        lisaMuokkaus.style.display = "none"
        aikatauluMuutos.style.display = "none"
    } else {
        alkup.style.display = "none"
        lisaAlkup.style.display = "none"
        aikatauluAlkup.style.display = "none"
        muokkaus.style.display = "inline"
        lisaMuokkaus.style.display = "inline"
        aikatauluMuutos.style.display = "inline"
    }
}

function muokkaus(e) {
    var resultElement = document.getElementById('postResult')
    var uusi = document.getElementById('muokkaaTodo' + e).value
    var lisatiedot = document.getElementById('muokkaaLisaTodo' + e).value
    var pvm = document.getElementById('pvmMuutos' + e).value
    var tunti = document.getElementById('tuntiMuutos' + e).value
    var minuutti = document.getElementById('minuuttiMuutos' + e).value

    if (tunti < 10) tunti = '0' + tunti;
    if (minuutti < 10) minuutti = '0' + minuutti;

    var muunnos = new Date(pvm + 'T' + tunti + ':' + minuutti + ':' + '00+03:00')

    axios.put('http://localhost:8080/api/todo/' + e, {
        todo: uusi,
        tarkempiTodo: lisatiedot,
        aikataulu: muunnos
    })
        .then (function (response) {
            getRequest();
        })
        .catch(function (error) {
            resultElement.innerHTML = errorHTMLOutput(error)
        })

}

function kellonAika(e) {
    var date = new Date(e);
    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var formatoitu = hours + ':' + minutes.substr(-2);
    return formatoitu;
}

function paivamaara(e) {
    var date = new Date(e);
    var vertaus = new Date();
    var paiva = date.getDate();
    var kuukausi = '0' + (date.getMonth()+1);
    var formatoitu = paiva + '.' + kuukausi.substr(-2)
    var formatoituvuosi = paiva + '.' + kuukausi.substr(-2) + '.' + date.getFullYear()

    if (date.getFullYear() === vertaus.getFullYear() && date.getMonth() === vertaus.getMonth() && date.getDate() === vertaus.getDate()) {
        return 'Tänään'
    } else if (date.getFullYear() === vertaus.getFullYear() && date.getMonth() === vertaus.getMonth() && (date.getDate()-1) === vertaus.getDate()) {
        return 'Huomenna'
    } else if (date.getFullYear() === vertaus.getFullYear()) {
        return formatoitu
    } else {
        return formatoituvuosi
    }
}

function pvmMuunnos() {
    var pvm = document.getElementById('pvm').value
    var tunti = document.getElementById('tunti').value
    var minuutti = document.getElementById('minuutti').value

    if (tunti === '01') tunti = 1;
    if (tunti === '02') tunti = 2;
    if (tunti === '03') tunti = 3;
    if (tunti === '04') tunti = 4;
    if (tunti === '05') tunti = 5;
    if (tunti === '06') tunti = 6;
    if (tunti === '07') tunti = 7;
    if (tunti === '08') tunti = 8;
    if (tunti === '09') tunti = 9;

    if (minuutti === '01') minuutti = 1;
    if (minuutti === '02') minuutti = 2;
    if (minuutti === '03') minuutti = 3;
    if (minuutti === '04') minuutti = 4;
    if (minuutti === '05') minuutti = 5;
    if (minuutti === '06') minuutti = 6;
    if (minuutti === '07') minuutti = 7;
    if (minuutti === '08') minuutti = 8;
    if (minuutti === '09') minuutti = 9;

    if (tunti < 10) tunti = '0' + tunti;
    if (minuutti < 10) minuutti = '0' + minuutti;

    var muunnos = new Date(pvm + 'T' + tunti + ':' + minuutti + ':' + '00+03:00')
    return muunnos
}

function pvmValue(e) {
    var date = new Date(e)
    var kuukausi = date.getMonth()+1
    var paiva = date.getDate()

    if (kuukausi < 10) kuukausi = '0' + kuukausi;
    if (paiva < 10) paiva = '0' + paiva;

    return date.getFullYear() + '-' + kuukausi + '-' + paiva;
}

function tuntiValue(e) {
    var date = new Date(e)
    return date.getHours()
}

function minuuttiValue(e) {
    var date = new Date(e)
    return date.getMinutes()
}

function jaljessa(id, pvm) {
    var vertaus = new Date()
    var date = new Date(pvm)
    var rivi = document.getElementById('rivi' + id)

    if (date < vertaus) {
        rivi.style.backgroundColor = '#ff8080'
    }
}