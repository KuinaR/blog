var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
 
var app = express();

var publishedPosts = ["Post 1", "Post 2"];

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home', {layout: 'main'});
});

app.get('/posts', function (req, res) {
   /*var links = [
        {
            name: "Game",
            link: "/Game"
        },
        {
            name: "About",
            link: "/About"
        }
    ];*/
    var posts = [];
    for(let i = 0; i < publishedPosts.length; i++){
       posts.push({contenido: publishedPosts[i]})
    }
    res.render('posts', {layout: 'main', posts: posts});
});

app.post('/posts', function(req, res){
    console.log(req.body.newPost);
    publishedPosts.push(req.body.newPost);
    var posts = [];
    for(let i = 0; i < publishedPosts.length; i++){
        posts.push({contenido: publishedPosts[i]})
    }
    res.render('posts', {layout: 'main', posts: posts});
})
 
app.listen(3000);