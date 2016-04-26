images = new Mongo.Collection("images");
//set up security on 
images.allow({
    insert:function(userId,doc){
        console.log("Testing security on image insert");
        if(Meteor.user()){
            console.log(doc);
            doc.createdBy = userId;
            if(userId != doc.createdBy){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    },
    
    remove:function(userId,doc){
        
        return true;
    },
    
    update:function(userId,doc){
        return true
    }
    
});