var Store = require('../models/store');
const { storeValidation, recordValidation } = require("../validation");

//Post Store 
exports.create_store = async(req, res)=>
{
   
    const { error } = storeValidation(req.body);
    if( error )
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    var path_img = req.file.path;
    var res_path = path_img.replace("uploads", "");
    
    const store = new Store({
        store_name : req.body.store_name,
        store_url : req.body.store_url,
        status : req.body.status,
        store_description : req.body.store_description,
        country : req.body.country,
        postal_code : req.body.postal_code,
        store_logo : res_path
    });
    try{
        const savedStore = await store.save();
        if(savedStore.status == "false")
        {
            res.redirect('/');
        }
        res.redirect('/admin');
        //res.send(savedStore);
    }
    catch(err){
        res.status(400).send(err);
    }
    //res.send(store);
}

//Edit Store
exports.edit_store = async(req, res)=>
{
    const { error } = storeValidation(req.body);
    if( error )
    {
        res.status(400).send(error.details[0].message);
        return;
    }


}

//Get Store
exports.get_store = async(req, res)=>
{

    
    try{
        var store = await Store.find();
        res.status(200).send(store);
    }
    catch(err){
        res.status(500).send(err);
    }

}

//
//Get Single Store
exports.get_single_store = async(req, res)=>
{

    const { error } = recordValidation(req.body);
    if( error )
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        var store = Store.findById(req.body._id);
        res.status(200).send(store);
    }
    catch(err){
        res.status(500).send(err);
    }

}