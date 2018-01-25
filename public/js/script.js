console.log("LISTENING TO SCRIPT.JS");

(function() {
    /**/
    Vue.component("big-image", {
        props: ["id"],
        data: function() {
            return {
                title: "",
                description: "",
                username: "",
                image: "",
                created_at: "",
                comments: []
            };
        },
        mounted: function() {
            var that = this;
            //do somthing here
            axios.get("/single-image/" + this.id).then(function(res) {
                that.title = res.data.image.title;
                that.description = res.data.image.description;
                that.username = res.data.image.username;
                that.image = res.data.image.image;
                that.created_at = res.data.image.created_at;
            });
        }
    });

    var app = new Vue({
        el: "main", //saying that vue has control sobre este elemento = 'el' | irá criar um templante e renderiza-lo automaticamente!
        data: {
            curImg: null,
            images: [], //Adicionar propriedades a este objecto (Reactive data)
            formStuff: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            const that = this;
            axios.get("/all-images").then(result => {
                console.log("we got a response", result);
                that.images = result.data; //setting images to 'that' and then setting it to the array that we got from the results
            });
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
