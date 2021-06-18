var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/userlistdb', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(methodOverride("_method"));
//schema
var userlistSchema = new mongoose.Schema({
	name:String
});

//model using schema
var Users = mongoose.model("Users",userlistSchema);




app.get("/",function(req,res){
	res.redirect("/user");
});

app.get("/user",function(req,res){
	Users.find({},function(err,users){
		if(err){
			console.log(err);
		}else{
			res.render("users",{users:users});
		}
	});
});

app.get("/user/new",function(req,res){
	res.render("new");
});

app.post("/user",function(req,res){
   var name =req.body.user
   var uname = {name:name}
	Users.create(uname,function(err,creatednn){
		if(err){
			console.log("err");
		}else{
			res.redirect("/user");
		}
	});
});

app.get("/user/:id",function(req,res){
	Users.findById(req.params.id,function(err,foundid){
		if(err){
			res.redirect("/user");
			
		}else{
			res.render("show",{user:foundid});
		}
});
});



app.put("/user/:id",function(req,res){
	Users.findByIdAndUpdate(req.params.id,req.body,function(err,updateduser){
		console.log(req.params);
		console.log(req.body);
		if(err){
			res.redirect("/user");
		}else{
			res.redirect("/user/"+ req.params.id);
		}
	});
});

app.get("/user/:id/edit",function(req,res){
	Users.findById(req.params.id,function(err,foundid){
		if(err){
			res.redirect("/user")
		}else{
				res.render("edit.ejs",{user:foundid});
		}
	});

});

app.delete("/user/:id",function(req,res){
	Users.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/user");
		}else{
			res.redirect("/user");
		}
	});
});


app.listen(process.env.port||3500,function(req,res){
	console.log("server is running");
});