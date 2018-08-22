// fills the dropdown with katagories from the server
$(document).ready(() => {

    // fills the dropdown with katagories from the server
    $.ajax({
        type: "GET",
        url: "/kategorien/",
        success: (data) => {
            var kategorien = data;//jQuery.parseJSON(data);
            console.log(data);
            var dropdown = $('#kat-dropdown-suchen');

            dropdown.html('');
            dropdown.append('\'<option value="">Kategorie auswählen</option>\'');

            if (kategorien != '') {
                $.each(kategorien, (k, v) => {
                        dropdown.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });

// fills the dropdown with katagories from the server
    $.ajax({
        type: "GET",
        url: "/kategorien/",
        success: (data) => {
            var kategorien = data;//jQuery.parseJSON(data);
            console.log(data);
            var dropdown = $('#kat-dropdown-anlegen');

            dropdown.html('');
            dropdown.append('\'<option value="">Kategorie auswählen</option>\'');

            if (kategorien != '') {
                $.each(kategorien, (k, v) => {
                        dropdown.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });

// fills the dropdown with systems from the server
    $.ajax({
        type: "GET",
        url: "/systeme/",
        success: (data) => {
            var systeme = data;//jQuery.parseJSON(data);
            console.log(data);
            var dropdown = $('#sys-dropdown-anlegen');

            dropdown.html('');
            dropdown.append('\'<option value="">System auswählen</option>\'');

            if (systeme != '') {
                $.each(systeme, (k, v) => {
                        dropdown.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });

    // fills the dropdown with systems from the server
    $.ajax({
        type: "GET",
        url: "/systeme/",
        success: (data) => {
            var systeme = data;//jQuery.parseJSON(data);
            console.log(data);
            var dropdown = $('#sys-dropdown-suchen');

            dropdown.html('');
            dropdown.append('\'<option value="">System auswählen</option>\'');

            if (systeme != '') {
                $.each(systeme, (k, v) => {
                        dropdown.append('<option value="' + v.id + '">' + v.name + '</option>');
                    }
                )
            }
        }
    });

// Benutzer anlegen
    $('#BenutzerAnlegenBtn').click(() => {

        var name = $('#BenutzernameInputReg').val();

        console.log(name); //# TODO remove

        //  if (name != '' &&   ||   ) { //TODO check for all fields being filled out

        $.ajax({
            url: '/users/new',
            type: 'POST',
            data: {
                "name": $('#BenutzernameInputReg').val(),
                "email": $('#EmailInputReg').val(),
                "password": $('#PassInputReg').val()
            },
            dataType: 'json',
        });
    });

// Event anlegen
    $('#EventAnlegenBtn').click(() => {

        var name = $('#NameInputTA').val();
        var kat = $('#kat-dropdown-anlegen :selected').text();
        var ort = $('#OrtInputTA').val();
        var kontakt = $('#KontaktInputTA').val();
        var plz = $('#PLZInputTA').val();
        var sys = $('#sys-dropdown-anlegen :selected').text();


          if (name != '' && kat != '' && kontakt != '' && plz != '' && sys != '') {

              $.ajax({

                  url: '/events/new',
                  type: 'POST',
                  data: {
                      "name": $('#NameInputTA').val(),
                      "plz": $('#PLZInputTA').val(),
                      "ortsname": $('#OrtInputTA').val(),
                      "kontaktweg": $('#KontaktInputTA').val(),
                      "kategorieName": $('#kat-dropdown-anlegen :selected').text(),
                      "systemName": $('#sys-dropdown-anlegen :selected').text(),
                      "beschreibung": $('#BeschreibungAnlegen').val()

                  },
                  dataType: 'json',
              });
          }
    });


    $('#EventSuchenBtn').click(() => {

        var kat = $('#kat-dropdown-suchen :selected').text();
        var plz = $('#PLZInputTF').val();
        var sys = $('#sys-dropdown-suchen :selected').text();
        var query = {};

        if (kat != '' && kat != 'Kategorie auswählen')
            query.kategorieName = kat;

        if (plz != '')
            query.plzshort = plz.substring(0,2);

        if (sys != '' && sys != 'System auswählen')
            query.systemName = sys;

        var queryString = $.param(query);


        $('#results').children().remove();

        $.ajax({

            url: "/events/src" + '?' + queryString,
            type: "GET",
            success: (data) => {
                var eingabe = data;//jQuery.parseJSON(data);
                console.log(data);
                var liste = $('#results');

                if (eingabe != '') {
                    $.each(eingabe, (k, v) => {
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
                // window.location.href = 'Anzeigenansicht.html';
            }
        });

    })
});
/**
 * Here Be a test
 */