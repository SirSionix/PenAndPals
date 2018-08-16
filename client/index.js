// fills the dropdown with katagories from the server
$(document).ready(() => {

    // fills the dropdown with katagories from the server
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/kategorien/",
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
        url: "http://localhost:3000/kategorien/",
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
        url: "http://localhost:3000/systeme/",
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

// Benutzer anlegen
    $('#BenutzerAnlegenBtn').click(() => {

        var name = $('#BenutzernameInputReg').val();

        console.log(name); //# TODO remove

        //  if (name != '' &&   ||   ) { //TODO check for all fields being filled out

        $.ajax({
            url: 'http://localhost:3000/users/new',
            type: 'POST',
            data: {
                "name": $('#BenutzernameInputReg').val(),
                "email": $('#EmailInputReg').val(),
                "password": $('#PassInputReg').val()
            },
            dataType: 'json',
        });
    })

// Event anlegen
    $('#EventAnlegenBtn').click(() => {

        var name = $('#NameInputTA').val();
        var name2 = $('#kat-dropdown-anlegen :selected').text();

        console.log(name); //# TODO remove
        console.log(name2); //# TODO remove

        //  if (name != '' &&   ||   ) { //TODO check for all fields being filled out

        $.ajax({
            url: 'http://localhost:3000/events/new',
            type: 'POST',
            data: {
                "name": $('#NameInputTA').val(),
                "plz": $('#PLZInputTA').val(),
                "ortsname": $('#OrtInputTA').val(),
                "kontaktweg": $('#KontaktInputTA').val(),
                "kategorieName": $('#kat-dropdown-anlegen :selected').text(),
                "systemName": $('#sys-dropdown-anlegen :selected').text()

            },
            dataType: 'json',
        });
    })


})