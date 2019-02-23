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
   var posts = [];
    for(let i = 0; i < publishedPosts.length; i++){
       posts.push(
           {contenido: publishedPosts[i],
            goto: "/posts/edit/" + i,
            gotopost: "/posts/" + i
        })
    }
    res.render('posts', {layout: 'main', posts: posts});
});

app.post('/posts', function(req, res){
    if(req.body.newPost != null){
        publishedPosts.push(req.body.newPost);
    }
    else if(req.body.editPost != null){
        var id = req.body.idPost;
        publishedPosts[id] = req.body.editPost;
    }
    var posts = [];
    for(let i = 0; i < publishedPosts.length; i++){
        posts.push(
            {contenido: publishedPosts[i],
             goto: "/posts/edit/" + i,
             gotopost: "/posts/" + i
         })
    }
    res.render('posts', {layout: 'main', posts: posts});
})

app.get('/posts/new', function(req, res){
    var post = publishedPosts[publishedPosts.length - 1];
    res.render('new', {layout: 'main', contenido: post});
})

app.get('/posts/edit/:postid', function(req,res){
    var id = req.params.postid;
    res.render('edit', {layout: 'main', editableText: publishedPosts[id], id: id});
})

app.get("/posts/:postid", function(req, res) {
    var id = req.params.postid;
    if(id >= 0 && id < publishedPosts.length){
        res.render('select', {layout: 'main', contenido: publishedPosts[id]});
    }
    else{
        res.render('select', {layout: 'main', contenido: "Este post no existe"});
    }
});

app.listen(process.env.PORT || 3000);