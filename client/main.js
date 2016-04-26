Router.configure({
    layoutTemplate:'ApplicationLayout'
});
Router.route('/',function(){
    this.render('welcome',{to:"main"});
         });

Router.route('/images',function(){
    this.render('images');
      this.render('navbar',{to:"navbar"});
      this.render('images',{to:"main"});
});


Router.route('/image/:_id',function(){
      this.render('navbar',{to:"navbar"});
      this.render('image',{to:"main", data:function(){
          return images.findOne({_id: this.params._id});
      }
});
});

Template.images.onCreated(function(){
    this.subscribe('images',function(){
        $(".loaders").delay(1000).fadeOut('slow',function(){
            $(".image-wrapper").fadeIn('slow');
        })
    });
})

Template.images.onRendered(function(){
    $(".svg").delay(10).fadeIn();
})

Template.exampleModal.onCreated(function(){
    this.subscribe('images');
})



Session.set("imageLimit",8);
    
    lastScrollTop = 0;
    $(window).scroll(function(event){
        //Test if we are near the bottom of the window  
                 if($(window).scrollTop() + $(window).height()>$(document).height()-100){
                    // console.log(new Date());
                     //Test if we going down
                     
                     var scrollTop = $(this).scrollTop();
                     
                     if(scrollTop > lastScrollTop){
                         console.log("going down ");
                         
                         Session.set("imageLimit", Session.get("imageLimit")+ 4);
                     }
                     lastScrollTop = scrollTop;
                 }   
                     });
    //Template.images.helpers({images:img_data});
    //sort and finding items by rating
    
 Template.images.helpers({images:function(){
     
     if(Session.get("userFilter")){
          return images.find({createdBy:Session.get("userFilter")}, {sort:{createOn:-1, rating:-1}});
     }
     else{
         return images.find({}, {sort:{createOn:-1, rating:-1},limit:Session.get("imageLimit")});
     }
 },
    filtering_images: function(){
        if(Session.get("userFilter")){
            return true;
        }
        else{
            return false;
        }
    },
    getFilterUser:function(){
         if(Session.get("userFilter")){
           var user = Meteor.users.findOne({_id:Session.get("userFilter")});
             return user.username;
        }
        else{
            return false;
        }
    },
                          
    getUser:function(user_id){
     var user = Meteor.users.findOne({_id:user_id});
     if(user){
         return user.username;
     }
     else{
         return "anonymous";
     }
 }
                          
                         });
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });
     
    Template.body.helpers({username:function(){
        if(Meteor.user()){
        console.log(Meteor.users.find().count());
        return Meteor.user().username;
            //return Meteor.user().emails[0].address;
        }
        else{
            return "Anonymous";
        }
    }}); 
    Template.images.events({
        'click .js-image':function(event){
            $(event.target).css("width","50px");
        },
        //click event for delete
        'click .js-del-image':function(event){
            var image_id = this._id;
            console.log(image_id);
            $("#"+image_id).hide('slow', function(){
                images.remove({"_id":image_id});
            });
            
        },
        'click .showImageModal':function(event){
            var id = this._id;
            console.log(id);
          var image = function(){                       return images.findOne({_id:id}); 
            }
        Modal.show('exampleModal',image)  
        },
        //click event for js-rate-image 
        'click .js-rate-image':function(event){
            var rating = $(event.currentTarget).data("userrating");
            console.log(rating);
            var image_id = this.id;
            console.log(image_id);
            
            images.update({_id:image_id},{$set:{rating:rating}});
        },
        
        'click .js-show-image-form':function(event){
            console.log("You cllicked mee");
            $('#image_form_modal').modal('show');
        },
        'click .js-set-user-filter':function(event){
            
            Session.set("userFilter",this.createdBy);
            console.log("you clicked me")
        },
        'click .js-unset-user-filter':function(event){
            Session.set("userFilter", undefined);
            console.log("You clicked unset");
        }
    });
    
    Template.image_add_form.events({
        'submit .js-add-image':function(event){
            var img_src, img_alt;
            img_src = event.target.img_src.value;
            img_alt = event.target.img_alt.value;
            console.log("Src "+img_src);
            console.log("Alt "+img_alt);
            if(Meteor.user()){
                images.insert({img_src:img_src, img_alt:img_alt,
                          createOn:new Date(), createdBy:Meteor.user()._id});
            }
            $('#image_form_modal').modal('show');
            return false;
        }
    })
