var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var number;

//Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newPosts', {useNewUrlParser: true});

const Post = mongoose.model('Post', { number: Number, title: String, date: Date, content: String });
 
var app = express();

var publishedPosts = [];
var mongoIds = [];

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home', {layout: 'main'});
    Post.find({}, function(err, res){
        console.log(res.length);
        number = res.length;
    });
});

app.get('/posts', function (req, res) {
   var posts = [];
    Post.find({}, function(err, resp){
        for(let i = 0; i < resp.length; i++){
            posts.push({
                title: resp[i].title,
                contenido: resp[i].content,
                date: resp[i].date,
                goto: "/posts/edit/" + resp[i].number,
                gotopost: "/posts/" + resp[i].number
            })
        }
        res.render('posts', {layout: 'main', posts: posts});
    })
    
});

app.post('/posts', function(req, res){
    var posts = [];
    if(req.body.newPost != null){
        publishedPosts.push(req.body.newPost);
        //title: String, date: Date, content: String
        var title = 'Post ' + number.toString();
        const newPosted = new Post({ number: number, title: title, date: new Date(), content: req.body.newPost});
        number++;
        newPosted.save().then(function(){
            //Recuperar los posts
            Post.find({}, function(err, res){
                for(let i = 0; i < res.length; i++){
                    posts.push({
                        title: resp[i].title,
                        contenido: resp[i].content,
                        date: resp[i].date,
                        goto: "/posts/edit/" + res[i].number,
                        gotopost: "/posts/" + res[i].number
                    })
                }
                
            })
            res.render('posts', {layout: 'main', posts: posts});
        });
    }
    else if(req.body.editPost != null){
        var id = req.body.idPost;
        publishedPosts[id] = req.body.editPost;
    }
})

app.get('/posts/new', function(req, res){
    var post = "";
    Post.find({}, function(err, resp){
        var post = resp[resp.length - 1].content;
        res.render('new', {layout: 'main', title: resp[resp.length - 1].title, contenido: post, date: resp[resp.length - 1].date});
    });
})

app.get('/posts/edit/:postid', function(req,res){
    var id = req.params.postid;
    res.render('edit', {layout: 'main', editableText: publishedPosts[id], id: id});
})

app.get("/posts/:postid", function(req, res) {
    Post.find({}, function(err, respo){
        var id = req.params.postid;
        if(id >= 0 && id < respo.length){
            Post.find({number: id}, function(err, resp){
                res.render('select', {layout: 'main', title: resp[0].title, contenido: resp[0].content, date: resp[0].date});
            });
        }
        else{
            res.render('select', {layout: 'main', contenido: "Este post no existe"});
        }
    });

    /*var id = req.params.postid;
    if(id >= 0 && id < publishedPosts.length){
        res.render('select', {layout: 'main', contenido: publishedPosts[id]});
    }
    else{
        res.render('select', {layout: 'main', contenido: "Este post no existe"});
    }*/
});

app.listen(process.env.PORT || 3000);