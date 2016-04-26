Meteor.publish('images',function(){
    return images.find({});
})
    Meteor.startup(function(){
       if(images.find().count() == 0){
           for(var i = 1;i<23; i++){
                    images.insert({img_src:"img_"+i+".jpg", img_alt:"image number "+i});
       }
           console.log('startup.js'+images.find().count());
    }
    });