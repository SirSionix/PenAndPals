#Pens and Pals

##Requirements
    node >= 10.3.0

##Run
    npm install
    npm start
    
##Dokumentation

###Server

####Used Modules:

        "@types/body-parser": "*",
        "@types/es6-promise": "^3.3.0",
        "@types/express": "^4.16.0",
        "@types/node": "^10.5.6",
        "body-parser": "^1.17.1",
        "express": "^4.16.3",
        "handlebars": "^4.0.11",
        "reflect-metadata": "^0.1.12",
        "sequelize": "^4.38.0",
        "sequelize-typescript": "^0.6.5",
        "sqlite3": "^4.0.2",
        "tsc": "^1.20150623.0",
        "typescript": "^3.0.1"

####Databese

The database is saved in sqlite and consists of 4 Tables (everything without a type declaration is a string)

- Event  
    - id :number (primary key & autoincrement)
    - name
    - plz
    - ortsname
    - kontaktweg
    - beschreibung
    - kategorieName (foreign key from kategorie)
    - systemName (foreign key from system)
    - datum :date
    - plzshort (consists of the first 2 numberst from plz and is used in the search function)
- Kategorie  
    - name (primary Key)
    - beschreibung
- System  
    - name (primary Key)
    - beschreibung
- User (unused for now)
    - id (primary key)
    - name
    - email
    - password (this is especialy subjekt to change)

For futher information like which colums each table has, look at the typescript files in the `server/models` folder.

####Routes

Those can be found in the `server/routes` folder. Like with the Tabel there are 4 main routs

- `...:3000events/`
- `...:3000kategorien/`
- `...:3000/systeme/`
- `...:3000/users/`

All routs work on port 3000.  
Comon functions between those routs:

#####...:3000/[route]
A get request at any of those routs above will get you a respone with all entrys in the respektive tables in JSON-Format.  
Eg.: a get request on `http://localhost:3000/events/` will give you a respone with the members of the Event-table with the datatype JSON.  
     resone might be:

    [
        {
            "id": 1,
            "name": "Abenteuer in Aventurien die erste",
            "plz": "123456",
            "ortsname": "roemms",
            "straße": "Albrechtalee 200",
            "kontaktweg": "asdf@qwer.com",
            "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
            "kategorieName": "Larp",
            "systemName": "DSA",
            "datum": "2018-09-10T15:30:00.000Z",
            "plzshort": "12"
        },
        {
            "id": 2,
            "name": "D&D Abenteuer",
            "plz": "765346",
            "ortsname": "Pompenhausen",
            "straße": "Apfelweg 5",
            "kontaktweg": "asdf@qwer.com",
            "beschreibung": "Mein Name ist Bob ich bin 4 und ich hab keine Ahnung was ich hier mache",
            "kategorieName": "Pen and Paper",
            "systemName": "DnD",
            "datum": "2018-10-20T10:30:00.000Z",
            "plzshort": "76"
        },
        {
            "id": 3,
            "name": "Shadowrun Tabletop",
            "plz": "453523",
            "ortsname": "Zwiebeldingen",
            "straße": "Kohlstraße 3",
            "kontaktweg": "asdf@qwer.com",
            "beschreibung": "Nicht HAAAAAAAALLLLLLOOOOOOOO",
            "kategorieName": "Tabletop",
            "systemName": "Shadowrun",
            "datum": "2018-08-13T17:30:00.000Z",
            "plzshort": "45"
        }
    ]
    

#####...:3000/[route]/new

A post request with the JSON datatype at `...:3000/[route]/new` will create a new Element in the Table. The response will be the created Element in JSON.  
Eg.: request body to `http://localhost:3000/events/new`.:

    {
    	"name": "Abenteuer in Aventurien die erste",
    	"plz": "123456",
    	"ortsname": "roemms",
    	"straße": "Albrechtalee 200",
    	"kontaktweg": "asdf@qwer.com",
    	"beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
    	"kategorieName": "Larp",
    	"systemName": "DSA",
    	"datum": "2018-09-10T17:30"
    }
    
A response to this request could be:

     {
         "id": 4,
         "name": "Abenteuer in Aventurien die erste",
         "plz": "123456",
         "ortsname": "roemms",
         "straße": "Albrechtalee 200",
         "kontaktweg": "asdf@qwer.com",
         "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
         "kategorieName": "Larp",
         "systemName": "DSA",
         "datum": "2018-09-10T15:30:00.000Z",
         "plzshort": "12"
     }
     
     
An important exeption would be a new Event since it tests if the Kategory and System exists, if they don't it will send an error.


#####...:3000/[route]/:id

A delete request at `...:3000/[route]/delete/:id` with the `:id` refering to the primary key will delete the element from the table. As a response you will get the deleted element as JSON.  
Eg.: delete-request at `http://localhost:3000/events/delete/1` will delete the element with id=1 from table Event.
A response to that could be:  

     {
         "id": 1,
         "name": "Abenteuer in Aventurien die erste",
         "plz": "123456",
         "ortsname": "roemms",
         "straße": "Albrechtalee 200",
         "kontaktweg": "asdf@qwer.com",
         "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
         "kategorieName": "Larp",
         "systemName": "DSA",
         "datum": "2018-09-10T15:30:00.000Z",
         "plzshort": "12"
     }


##### ...:3000/events/src?[quary]

This route is used to search through the events. The response to this will be the elements meeting the search kriteria in JSON.
Eg.: get-request at `http://localhost:3000/events/src?systemName=DSA&plzshort=12` might get you this response:

    [
        {
            "id": 1,
            "name": "Abenteuer in Aventurien die erste",
            "plz": "123456",
            "ortsname": "roemms",
            "straße": "Albrechtalee 200",
            "kontaktweg": "asdf@qwer.com",
            "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
            "kategorieName": "Larp",
            "systemName": "DSA",
            "datum": "2018-09-10T15:30:00.000Z",
            "plzshort": "12"
        }
    ]
    
