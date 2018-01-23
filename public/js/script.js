console.log("Listening SCRIPT.JS");

(function() {
    var app = new Vue({
        el: "main", //saying that vue tem controlo sobre este elemento = 'el' | irá criar um templante e renderiza-lo automaticamente!
        data: {
            images: [], //Adicionar propriedades a este objecto (Reactive data)
            formStuff: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        methods: {
            // Everthing in methods will be rendered like in data;
            chooseFiles: function(e) {
                console.log("this works");
                this.formStuff.file = e.target.files[0];
            },
            upload: function() {
                console.log("this works?? upload");

                const fd = new FormData(); //built in in javascript
                fd.append("file", this.formStuff.file);
                fd.append("title", this.formStuff.title);
                fd.append("description", this.formStuff.description);
                fd.append("username", this.formStuff.username);

                axios.post("/uploads", fd).then(results => {
                    console.log("response from server:", results);
                });
            }
        }
    });
})();
