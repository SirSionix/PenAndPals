$(document).ready(() => {

    // Menüs mit Daten vom Server befüllen
    populateCategoriesDropdown();
    populateSystemsDropdown();


    // Benutzer anlegen
    $('#BenutzerAnlegenBtn').click(createUser);

    // Event anlegen
    $('#EventAnlegenBtn').click(createEvent);

    // Event suchen
    $('#EventSuchenBtn').click(searchEvent);
});



/**
 * - Query server for available categories
 * - clear out dropdown menues
 * - add categories from server reply to both dropdown menues (from search and create view)
 *
 * @summary Fills the dropdown menues with catagories from the server
 */
function populateCategoriesDropdown() {
    $.ajax({
        type: "GET",
        url: "/kategorien/",
        success: (data) => {
            var kda = $('#kat-dropdown-anlegen');
            var kds = $('#kat-dropdown-suchen');

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
 * - Query server for available systems
 * - clear out dropdown menues
 * - add categories from server reply to both dropdown menues (from search and create view)
 *
 * @summary Fills the dropdown menues with systems from the server
 */
function populateSystemsDropdown() {
    $.ajax({
        type: "GET",
        url: "/systeme/",
        success: (data) => {
            var sda = $('#sys-dropdown-anlegen');
            var sds = $('#sys-dropdown-suchen');

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
 * Takes input from the 'Name', 'Passwort', 'Passwort bestätigen' and 'Email' fields and if none
 * of the fields are empty and the password matches the repetition performs AJAX POST call to
 * <code>/users/new</code> to create a new user.
 *
 * @summary Creates a new user using input from fields
 */
function createUser() {
    var name     = $('#BenutzernameInputReg').val();
    var email    = $('#EmailInputReg').val();
    var password = $('#PassInputReg').val();
    var passwordCheck = $('#PassCheckInputReg').val()

    if (name != '' && email != '' && password != '' && passwordCheck == password) {

        $.ajax({
            url: '/users/new',
            type: 'POST',
            data: {
                "name": name,
                "email": email,
                "password": password
            },
            dataType: 'json',
        });
    }
}



/**
 * - takes input from ... fields
 * - check for empty fields (not all, some are optional)
 * - perform AJAX POST call to <code>/events/new</code>
 *
 * @summary Creates a new event
 */
function createEvent() {
    var name    = $('#NameInputTA').val();
    var plz     = $('#PLZInputTA').val();
    var ort     = $('#OrtInputTA').val();
    var kontakt = $('#KontaktInputTA').val();
    var kat     = $('#kat-dropdown-anlegen :selected').text();
    var sys     = $('#sys-dropdown-anlegen :selected').text();
    var beschr  = $('#BeschreibungAnlegen').val();
    var datum   = $('#DatumAnlegen').val();

    if (name != '' && plz != '' && kontakt != '' && kat != '' && sys != '') {
        $.ajax({
            url: '/events/new',
            type: 'POST',
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
    var kat   = $('#kat-dropdown-suchen :selected').text();
    var plz   = $('#PLZInputTF').val();
    var sys   = $('#sys-dropdown-suchen :selected').text();
    var query = {};

    if (kat != '' && kat != 'Kategorie auswählen')
        query.kategorieName = kat;

    if (plz != '')
        query.plzshort = plz.substring(0,2);

    if (sys != '' && sys != 'System auswählen')
        query.systemName = sys;

    var queryString = $.param(query);


    // Clear old search results
    $('#results').children().remove();

    $.ajax({
        url: "/events/src" + '?' + queryString,
        type: "GET",
        success: (data) => {
            var liste = $('#results');

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
        }
    });
}

