// fills the dropdown with katagories from the server
$(document).ready(() => {

    //$('#kat-dropdown').click( () => {
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
    //});

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
//});

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
                //TODO now fucking what
            });
        })

});