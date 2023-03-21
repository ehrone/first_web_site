

//Header/footer/Topbutton display
//Using jQuery to display without repeating on all pages.
//From everyxhere.html
$(function(){
    $("#header").load("everywhere.html #header_à_ajouter");
});
$(function()
{
    $("#footer").load("everywhere.html #footer_à_ajouter");
});
$(function()
{
    $("#inserer").load("everywhere.html #a_inserer");
});

//Management of the Top button
window.onscroll = function(){scrollFunction()}

function scrollFunction()   
{
    bouton = document.getElementById("TopButton");
    if(document.body.scrollTop || document.documentElement.scrollTop) //deux trucs, pour le naviagteur safari || pour le reste en grande partie
    {
        //console.log(bouton)
        bouton.style.display = "block";
    }
    else 
    {
        bouton.style.display ="none";
    }
}
function la_haut() 
    {
        document.body.scrollTop = 0; //pour le navigateur safari
        document.documentElement.scrollTop = 0; //pour les autres navigateurs
    }    
//Managment of the storage
//
//
//class for the personalisation
class personalisation
{
    constructor(nom, ecriture, motif, couleur ,prix,quantite, volume)
        {
            this.nom = nom;
            this.ecriture = ecriture;
            this.motif = motif;
            this.couleur = couleur;
            this.prix= prix;
            this.quantite = quantite;
            this.volume = volume;
            
        }
}
// recupérer le nom du produit à partir de l'url
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);

    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam)

        {
            return sParameterName[1];
        }
    }
}
//fonction qui calcule le prix
function calcul_prix(nom_produit,nom_ecriture,nom_couleur,nom_motif,nom_quantité)
{
    return 15
}
//fonction qui compte le nombre de produits dans le panier
function getNbprod()
    {
        return parseInt(localStorage.getItem("Nb_produit"))
    }
//fonction qui ajoute l'élément au storage
function add_storage()
    {

        nom_produit = GetURLParameter('id')
        valeur_ecriture = document.getElementById ("ecriture").value;
        valeur_motif = document.getElementById("motif");
        valeur_couleur = document.getElementById("couleur_unie").value;
        valeur_quantite = document.getElementById("quantite").value;
        valeur_volume = document.getElementById("volume").value;
        console.log(valeur_volume)
        valeur_prix = calcul_prix(nom_produit, valeur_ecriture,valeur_couleur, valeur_motif,valeur_quantite, valeur_volume);
        if(localStorage.getItem("Nb_produit")==null)
            {
                localStorage.setItem("Nb_produit",1);
            }
        else
            {
                localStorage.setItem("Nb_produit",getNbprod()+1)
            }
        var prod_panier = new personalisation(nom_produit,valeur_ecriture,valeur_motif,valeur_couleur,valeur_prix,valeur_quantite,valeur_volume)
        localStorage.setItem(getNbprod(), JSON.stringify(prod_panier))
    }
//Fonction pour récupérer le panier du localstorage
function recup_panier()
    {
        array_out = [];
        for(let i=1; i <=getNbprod();i++)
            {
                array_out.push([i,Object.assign(new personalisation(1,1,1,1,1),JSON.parse(localStorage.getItem(i+"")))]);
                console.log(array_out[1])
            }
        return array_out
    }
//fonction pour afficher le storage
function show_storage()
    {
      var contenu = document.getElementById("contenu_panier")  
      var template = contenu.querySelector("template").innerHTML;
      contenu.innerHTML="<template>" + template + "</template>";
      for (const lst_produit of recup_panier())
        {
            nb_prod = lst_produit[0];
            prod = lst_produit[1];
            console.log("loaded :" + nb_prod);
            newtemplate = template.replace(/{{nb_prod}}/g,nb_prod).replace(/{{type}}/g,prod.nom)
            .replace(/{{prix}}/g,prod.prix).replace(/{{quantite}}/g,prod.quantite)
            .replace(/{{ecriture}}/g,prod.ecriture).replace(/{{motif}}/g,prod.motif)
            .replace(/{{couleur}}/g,prod.couleur).replace(/{{volume}}/g,prod.volume);
            contenu.innerHTML += newtemplate;
        }
    }

// fonction qui permet de supprimer des commandes du panier
function suppr_commande(nb_prod)
    {
        localStorage.removeItem(nb_prod);
        for(let i=nb_prod+1; i <=getNbprod(); i++)
            {
                localStorage.setItem(i-1,localStorage.getItem(i));
                localStorage;removeItem(i);
            }
        localStorage.setItem("Nb_produit",getNbprod()-1);
        show_storage();
    }





    // a class for the simple products
class produit
{
    constructor(name, materiau,  price, image, description, couleurs)
        {
            this.name = name;
            this.materiau = materiau;
            this.price = price;
            this.image = image;
            this.description = description;
            this.colors = couleurs;
        
        }

}


// a dictionnary with all produtcs possibilyties
var products = {};

// for the filter in the main page
var data_filter = [];


// use the grid template to creat our first grid of products on the home page
async function run_index() 
{
   
    // we get our data base and fill our product's dictionnary
    json= await fetch('../data.json')
        .then( 
                function (reponse) 
                    { 
                        return reponse.json() 
                    } 
            );

    //console.log
    // we fill our dictionnar(y of products
    for (thermos of json["liste_produits"]) 
    {
 
        //console.log(thermos.nom)
        // we get the product from the json 
        recup_produit(thermos)
        // we display it on the index page
        load_product(thermos)
    }

    // we fill our array for the filter
    var i = 0
    for (i in json["data_filtre"])
        {   
            for (option of json["data_filtre"][i] )
            {
                //console.log("créa filtre ")
                crea_sous_filtre(i, option);
            }
            
        }

}



function crea_sous_filtre(i, option)
{ /* cette fonction ajoiute une option à un filtre */

    // we get our structure
    //var temp = document.querySelector("#visual_filtre");
    //var div_check_box = temp.content.querySelector("#check_box");
    /*
    // we set the inner data
    var div_check_box_content =  div_check_box_clone.firstElementChild.outerHTML
        .replace(/{{filtre}}/g, "filtre " +i )
        .replace(/{{name}}/g, option );

    // we add it to the string that will be added to the inner html 
    inner = div_check_box_content
    div_check_box_clone.firstElementChild.innerHTML = inner;
    //console.log( inner);
    //console.log("filtre "+i);
    //console.log( document.getElementById("filtre "+i));

    //div_check_box_clone.querySelector("input").addEventListener('click', function(event){  une_option(event.target); } );*/

    // we make a clone
    var div_check_box_clone = document.importNode(visual_filtre.content, true);
    // we change the name and filter attribut of the checkbox html object

    box =  div_check_box_clone.querySelector("div");
    box.querySelector("input").name="filtre_"+i;
    box.querySelector("input").id= option;
    box.querySelector("label").for= option;
    box.querySelector("label").innerHTML= option;
    
    // si c'est l'option ' tous les matériaux' ou 'tous les volumes' on les coches à l'origine
    if (option=='Tous les matériaux' || option=='Tous les volumes' )
    {
        div_check_box_clone.querySelector('input').checked= true;
    }

    // we creat an event when the checkbox = true, so we can have only one option of the filter at a time
    div_check_box_clone.querySelector('input').addEventListener('click', function(event){ une_option(event.target) } );
    document.getElementById("filtre_"+i).append(div_check_box_clone);
}

function une_option(box)
{
    //console.log(box);
    // le nomù de l'option que l'on vient de cocher
    box_id = box.id;
    //console.log(box_id);

    //console.log("action sur la box "+box_id);
    // we get the name of the filter it belongs to
    filtre = box.name;
    //console.log(filtre);

    // the path to the filter
    chemin = 'div#'+filtre+' input';
    //console.log(chemin);

    // we get all the checkbox of the filter
    mes_box=document.querySelectorAll(chemin);
    //console.log(mes_box);
    mes_box.forEach( option=> { // si la case est cochée est que ce n'est pas celle sur laquelle on a coché, on la décoche
                                 if(option.checked && option.id != box_id)
                                    {
                                        //console.log('on décoche '+option.id);
                                        option.checked = false;
                                    }
                                }
        
                    );
}


function recup_produit(thermos)
{ /* on créer un objet de classe produit */
    var nom = thermos["nom"];
    var materiau = thermos["materiau"];
    var prix = thermos["prix"];
    var image = thermos["image"];
    var description = thermos["description"];

    //new produit( nom, materiau, prix, image, description ) adde to the dico
    products[nom] = new produit(nom, materiau, prix, image, description);


}

function load_product(produit)
{/* cette fonction sert à afficher le produit sur la page index*/
    // we get the template structure with the id grid
    temp = document.querySelector('#template_produit');

    // a clone f the div 
    clone = document.importNode( temp.content, true );
    // informations we add in the url of th epersonalisation to get the image


    // we load the content
    //our product's name
    nom = produit.nom;
    //console.log(nom)
    // our product's description 
    des = produit.description;
    // the link for the custom page
    lien_perso = 'personalisation.html?id='+produit.perso;
    console.log('chemin image '+lien_perso)
    clone.querySelector('a').href= lien_perso;
    console.log(lien_perso)
    clone.querySelector('a').id = nom;
    clone.querySelector('a').alt = nom;
    // our produt's image
    image = produit.image;
    clone.querySelector('div a img').src= image;
    clone.querySelector('div a img').id= nom;
    
    // the hidden part of the product
    clone.querySelector('div div').id = nom;
    clone.querySelector('div div p').innerHTML = des;
    //clone.querySelector('div div button').innerHTML = "Personnalisez votre "+nom.replace("_"," ")+" !";
    

    // if the mouse is over the image of the product
    clone.querySelector('img').addEventListener('mouseover', function(event){ anim_produit_mouse_over(event.target) } )
    clone.querySelector('img').addEventListener('mouseleave', function(event){ anim_produit_mouse_leave(event.target) } )
    document.getElementById('grille').append(clone);

    //console.log(document.getElementById('#grille div#grid_visual div#'+nom));
    //document.getElementById('#grille div#grid_visual #'+nom).addEventListener('mouseleave', function(event){ anim_produit_mouse_leave(event.target) } )
    //console.log('done')

}

function anim_produit_mouse_over(zone)
{
    // we get the id of the hidden div
    div_id = zone.id;

    // check if it detects 
    //console.log(div_id);
    //console.log('sourie dessus');
    hidden_div = document.querySelector("#grid_visual div#"+div_id);
    // we change the class from hidden to visible
    hidden_div.classList.remove('hidden_div');
    hidden_div.classList.add('anim_div')
    //hidden_div.classList.add('anim_div');
    // if the mouse is leaving the div

}

function anim_produit_mouse_leave(zone)
{
    // we get the id of the vivible div that will deseapear
    div_id = zone.id;
    visible_div = document.querySelector("#grid_visual div#"+div_id);
    // we change the class from visible to hidden
    visible_div.classList.add('hidden_div');
    visible_div.classList.remove('anim_div');
    
}

async function display_perso()
{
    // we get our data base and fill our product's dictionnary
    json= await fetch('../data.json')
        .then( 
                function (reponse) 
                    { 
                        return reponse.json() 
                    } 
            );


    for (option of json["data_filtre"][1].splice(1,json["data_filtre"][1].length-1 ))
        {   
            // we import the checkbox model in our template 
            var div_check_box_clone = document.importNode(choix.content, true);
            // we change the name and filter attribut of the checkbox html object
            box =  div_check_box_clone.querySelector("div");
            box.querySelector("input").id= option;
            box.querySelector("label").for= option;
            box.querySelector("label").innerHTML= option;

            div_check_box_clone.querySelector('input').addEventListener('click', function(event){ option_perso(event.target) } );

            document.querySelector('li#volume').append(box)

            
        }
   get_color()
   draw_img_perso()
}


function get_color()
{
    /* On récupère la couleur pour la personnalisation*/
    var color= document.getElementById("couleur_unie").value;
    //console.log('la couleur est '+ color)
    var canvas = document.getElementById('canvas');
    //console.log(canvas);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(90,5, 30, 90);

    //document.querySelector('div#color').style.backgroundColor =color;
}

function draw_img_perso()
{/* cette fonction affiche l'image de personnalisation */
    // the image we want to display ( saved in the URL as the id)
    var image = new URLSearchParams(window.location.search).get("id").replace('é', 'e');
    //console.log("test", image);
    
    // on récupère la couleur pour le personnalisation
    document.getElementById("couleur_unie").addEventListener('mouseover', function(){ get_color(); })
    document.getElementById("couleur_unie").addEventListener('mouseleave', function(){ get_color(); })

    var canvas = document.getElementById('canvas');
    //console.log(canvas);
    //canvas.
    var ctx = canvas.getContext("2d");
    // on créer une balise image
    var balise_image = document.createElement("img");
    balise_image.src = image
    //console.log(balise_image)

    balise_image.addEventListener('load', function(){
                                                        ctx.drawImage(balise_image, 90, 5, 30, 90);
                                                        draw_img_perso()
                                                    }
                                )
}

function option_perso(box)
{   box_id = box.id
    mes_box = document.querySelectorAll('#volume input')
    mes_box.forEach( option=> { // si la case est cochée est que ce n'est pas celle sur laquelle on a coché, on la décoche
        if(option.checked && option.id != box_id)
           {
               //console.log('on décoche '+option.id);
               option.checked = false;
           }
       }

);
}