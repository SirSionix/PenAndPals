$(document).ready(() => {

    // fills menues with data from the server
    populateCategoriesDropdown();
    populateSystemsDropdown();

    // show login status
    showLoginStatus();


    // create user
    $('#BenutzerAnlegenBtn').click(createUser);

    // login
    $('#BenutzerEinloggenBtn').click(login);

    // logout
    $('#AusloggenBtn').click(logout);

    // create events
    $('#EventAnlegenBtn').click(createEvent);

    // search for events
    $('#EventSuchenBtn').click(searchEvent);
});


/**
 * Checks SessionStorage for existing username and JWT Access Token and shows/hides
 * login/logout buttons accordingly.
 *
 * @summary Displays login status
 */
function showLoginStatus() {
    let name = window.sessionStorage.getItem('name');

    if (name && window.sessionStorage.getItem('token')) {
        $('#AnmeldungsBtn').hide();
        $('#AusloggenBtn').text(name + ' abmelden').show();
    } else {
        window.sessionStorage.clear();
        $('#AnmeldungsBtn').show();
        $('#AusloggenBtn').text('Ausloggen').hide();
    }
}



/**
 * Queries the server for available categories. Dropdown menues are being cleared out.
 * Takes the server reply to fill both dropdown menues in both the search and create view.
 *
 * @summary Fills the dropdown menues with categories from the server
 */
function populateCategoriesDropdown() {
    $.ajax({
        type: "GET",
        url: "/kategorien/",
        success: (data) => {
            let kda = $('#kat-dropdown-anlegen');
            let kds = $('#kat-dropdown-suchen');

            kda.html('');
            kda.append('\'<option value="">Kategorie auswählen</option>\'');
            kds.html('');
            kds.append('\'<option value="">Kategorie auswählen</option>\'');

            if (data != '') {
                $.each(data, (k, v) => {
                        kda.append('<option value="' + v.id + '">' + v.name + '</option>');
                        kds.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });
}



/**
 * Queries the server for available systems. Dropdown menues are being cleared out.
 * Takes the server reply to fill both dropdown menues in both the search and create view.
 *
 * @summary Fills the dropdown menues with systems from the server
 */
function populateSystemsDropdown() {
    $.ajax({
        type: "GET",
        url: "/systeme/",
        success: (data) => {
            let sda = $('#sys-dropdown-anlegen');
            let sds = $('#sys-dropdown-suchen');

            sda.html('');
            sda.append('\'<option value="">System auswählen</option>\'');
            sds.html('');
            sds.append('\'<option value="">System auswählen</option>\'');

            if (data != '') {
                $.each(data, (k, v) => {
                        sda.append('<option value="' + v.id + '">' + v.name + '</option>');
                        sds.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });
}

/**
 * Takes input from the 'Name','Email', 'Passwort' and the 'Passwort bestätigen' input field,
 * builds a query from the non-empty fields. An AJAX POST to <code>/users/new</code> is performed
 * to create a new user.
 *
 * @summary Creates a new user using input from fields
 */
function createUser() {
    let name          = $('#BenutzernameInputReg').val();
    let email         = $('#EmailInputReg').val();
    let password      = $('#PassInputReg').val();
    let passwordCheck = $('#PassCheckInputReg').val()

    if (name != '' && email != '' && password != '' && passwordCheck == password) {

        $.ajax({
            url: '/users/new',
            type: 'POST',
            data: {
                "name": name,
                "email": email,
                "password": password
            },
            succes: (data) => {
                // TODO rückmeldung in oberfläche
            },
            dataType: 'json',
        });
    }
}


/**
 * Takes input from the 'NameInputTA', 'PLZInputTA', 'OrtInputTA', 'KontaktInputTA', 'kat-dropdown-anlegen',
 * 'sys-dropwodn-anlegen', 'BeschreibungAnlegen', and the 'DatumAnlegen' input field,
 * builds a query from the non-empty, non-optional fields. An AJAX POST to <code>/events/new</code>
 * is performed to create a new event.
 *
 * @summary Creates a new event
 */
function createEvent() {
    let name    = $('#NameInputTA').val();
    let plz     = $('#PLZInputTA').val();
    let ort     = $('#OrtInputTA').val();
    let kontakt = $('#KontaktInputTA').val();
    let kat     = $('#kat-dropdown-anlegen :selected').text();
    let sys     = $('#sys-dropdown-anlegen :selected').text();
    let beschr  = $('#BeschreibungAnlegen').val();
    let datum   = $('#DatumAnlegen').val();

    if (name != '' && plz != '' && kontakt != '' && kat != '' && sys != '') {
        $.ajax({
            url: '/events/new',
            type: 'POST',
            beforeSend: (req) => {
                if (window.sessionStorage.getItem("token")) {
                    req.setRequestHeader(
                        "Authorization",
                        "Bearer " + window.sessionStorage.getItem("token"));
                }
            },
            data: {
                "name": name,
                "plz": plz,
                "ortsname": ort,
                "kontaktweg": kontakt,
                "kategorieName": kat,
                "systemName": sys,
                "beschreibung": beschr,
                "datum": datum
            },
            success: (data) => {
                // TODO "event erstellt"-nachricht
            },
            error: (data) => {
                // TODO fehlermeldung aus server-antwort anzeigen
            },
            dataType: 'json',
        });
    }
}



/**
 * Takes input from the 'Kategorien' and 'System' dropdown menues and the 'PLZ' input field,
 * builds a query from the non-empty fields. Only the first two digits from the 'PLZ' field
 * are used. After clearing potential existing search results, an AJAX call to
 * <code>/events/src</code> is performed. The results sent back from the server are then
 * displayed in a list.
 *
 * @summary Queries the server for events and displays the results
 */
function searchEvent() {
    let kat   = $('#kat-dropdown-suchen :selected').text();
    let plz   = $('#PLZInputTF').val();
    let sys   = $('#sys-dropdown-suchen :selected').text();
    let query = {};

    if (kat != '' && kat != 'Kategorie auswählen')
        query.kategorieName = kat;

    if (plz != '')
        query.plzshort = plz.substring(0,2);

    if (sys != '' && sys != 'System auswählen')
        query.systemName = sys;

    let queryString = $.param(query);


    // Clear old search results
    $('#results').children().remove();

    $.ajax({
        url: "/events/src" + '?' + queryString,
        type: "GET",
        success: (data) => {
            let liste = $('#results');

            if (data != '') {
                $.each(data, (k, v) => {
                        $('<div>').addClass('result').append(
                            $('<hr>'),
                            $('<p>').text(v.name),
                            $('<p>').text(v.kategorieName),
                            $('<p>').text(v.ortsname),
                            $('<p>').text(v.plz),
                            $('<p>').text(v.kontaktweg)
                        ).appendTo(liste);
                    }
                )
            }
            // TODO: anzeigen, dass es keine ergebnisse gab
        }
    });
}


/**
 * Takes input from 'Name' and 'Passwort' fields, checks for empty fields and performs
 * AJAX POST to <code>/users/login</code>. On success, the received JSON Web Token and
 * the username are stored in SessionStorage for later authentication.
 *
 * @summary Logs user in and stores username and session token
 */
function login() {
    let name     = $('#NameInputLog').val();
    let mail     = $('#MailInputLog').val();
    let password = $('#PassInputLog').val();

    if (name != '' && password != '') {
        $.ajax({
            url: "/users/login",
            type: "POST",
            data: {
                email: mail,
                password: password
            },
            success: (data) => {
                window.sessionStorage.setItem('name', data.name);
                window.sessionStorage.setItem('token', data.token);
                showLoginStatus();
                self.location.href='/';
            },
            error: (data) => {
                // TODO fehlermeldung anzeigen
            },
            dataType: 'json'
        });
    }
}



/**
 * Clears SessionStorage, including username and Access Token, in effect logging the user out.
 *
 * @summary Logs user out
 */
function logout() {
    window.sessionStorage.clear();
    showLoginStatus();
}
