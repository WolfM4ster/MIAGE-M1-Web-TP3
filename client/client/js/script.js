window.onload = init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [
                
            ],
            id_modify: "",
            id_delete: "",
            nom:'',
            cuisine:'',
            nomModify:'',
            cuisineModify:'',
            nbRestaurants:0,
            page:0,
            pagesize:10,
            nbPagesTotal:0,
            name:""
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.premierePage();        
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page + "&pagesize=" +
                    this.pagesize + "&name=" +
                    this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        return reponseJSON.json();
                    })
                    .then((reponseJS) => {
                        this.restaurants = reponseJS.data;
                        this.nbRestaurants = reponseJS.count;
                        this.calculerNbPages();
                        this.afficherBoutonsPagination();
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            
            calculerNbPages() {
                this.nbPagesTotal = Math.floor(this.nbRestaurants / this.pagesize);
                if(this.nbRestaurants % this.pagesize !== 0) {
                    this.nbPagesTotal++;
                }
            },

            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let form = event.target;

                // 2 - on récupère le contenu du formulaire
                let dataFormulaire = new FormData(form);

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        return reponseJSON.json();
                    })
                    .then((reponseJS) => {
                        console.log(reponseJS.msg);
                        // On re-affiche les restaurants
                        this.getRestaurantsFromServer();
                        this.nom = "";
                        this.cuisine = "";
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            modifierRestaurant(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let form = event.target;
                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(event.target);
                console.log(donneesFormulaire);

                let id = form.id_modify.value; // on peut aller chercher la valeur
                                        // d'un champs d'un formulaire
                                        // comme cela, si on connait le nom
                                        // du champ (valeur de son attribut name)

                let url = "http://localhost:8080/api/restaurants/" + id;

                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                .then((responseJSON) =>{
                    return responseJSON.json();
                })
                .then((res) => {
                    console.log(res.msg)// Maintenant res est un vrai objet JavaScript
                    this.getRestaurantsFromServer();

                    this.nomModify = "";
                    this.cuisineModify = "";
                    this.id_modify = "";
                })
                .catch(function (err) {
                    console.log(err);
                });

                
            },
            supprimerRestaurant(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                console.log("Appel de la fonction supprimerRestaurant");

                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let form = event.target;
            
                let id = form.id_delete.value; // on peut aller chercher la valeur
                                        // d'un champs d'un formulaire
                                        // comme cela, si on connait le nom
                                        // du champ (valeur de son attribut name)

                let url = "http://localhost:8080/api/restaurants/" + id;

                fetch(url, {
                    method: "DELETE",
                })
                .then((responseJSON) => {
                    return responseJSON.json();
                })
                .then((res) => {
                    // Maintenant res est un vrai objet JavaScript
                    console.log(res.msg);
                    this.getRestaurantsFromServer();
                })
                .catch(function (err) {
                    console.log(err);
                });
            },

            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            },

            afficherBoutonsPagination() {
                document.getElementById('pagePrevious').style.visibility = 'visible';
                document.getElementById('pageNext').style.visibility = 'visible';
                document.getElementById('lastPage').style.visibility = 'visible';

                if(this.page === 0) {
                    document.getElementById('pagePrevious').style.visibility = 'hidden';
                }
                if(this.page === this.nbPagesTotal -1) {
                    document.getElementById('pageNext').style.visibility = 'hidden';
                }
            },

            premierePage() {
                this.page = 0;
                this.getRestaurantsFromServer();
            },
            
            pagePrecedente() {
                if(this.page > 0) {
                    this.page--;
                    this.getRestaurantsFromServer();
                }
            },

            pageSuivante() {
                if(this.page !== this.nbPagesTotal - 1) {
                   this.page++;
                }

                this.getRestaurantsFromServer();            
            },

            dernierePage() {
                this.page = this.nbPagesTotal - 1;
                this.getRestaurantsFromServer(); 
            },

            chercherRestaurants: _.debounce(function () {
                this.getRestaurantsFromServer(); 
            }, 300)
        }
    })
}