var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    app        = express()
var methodOverride =require('method-override'),
    expressSanitizer = require('express-sanitizer')

const port = process.env.port || 3000;

mongoose.connect('mongodb://localhost/blogApp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    });

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(methodOverride("_method"))
app.use(expressSanitizer());

//making schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

/*Blog.create({
    title: "Test",
    image: "https://images.unsplash.com/photo-1596619627561-3fad1ffc2999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80",
    body:"What a beautiful Day",
});*/

//RESTFUL ROUTES

app.get("/",(req,res)=>{
    res.redirect("/blogs")
});

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err)
        }else{
            res.render("index",{blogs:blogs})
        }
    });
});

app.get("/blogs/new",(req,res)=>{
    res.render("new")
})

app.post("/blogs",(req,res)=>{
    //sanitizing the input
    req.body.blog.body =  req.sanitize(req.body.blog.body)

    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show",{blog:foundBlog})
        }
    })
})

// EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog:foundBlog})
        }
    })
})

//UPDATE
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body =  req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
    })
})

app.listen(port,function(){
    console.log("server is running")
})
