Create table Categories (
    idCateg Serial primary key,
    nom text
);

Create table Gammes(
    idGam Serial primary key,
    nom text
);

Create table Tarifs (
    idTarif Serial primary key,
    libelle text,
    TJ numeric
);

Create table GrilleTarifaire (
    idGam integer,
    idCateg integer,
    idTarif integer,
    primary key (idGam, idCateg),
);

create table Articles (
 idArt serial primary key,
 designation text,
 idCateg integer,
 idGam Integer,
);

Create table Clients (
 idCli Serial primary key,
 nom text,
 prenom text,
 email text,
 adresse text,
 cpo text,
 ville text
);


create type etatFiche as enum(
'PretALouer',
'EnLocation',
'Rendu',
'Solde'
);

Create table Fiches(
 idFiche Serial primary key,
 idCli integer ,
 dateCrea date,
 datePaye date,
 etat etatFiche
);     

Create Table lignes(
 numLi integer,
 idFiche integer ,
 idart integer ,
 dateDep date,
 dateRet date,
 primary key (idFiche,numLi) 
);