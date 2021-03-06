const storeModel = require('../models/store');
const {storeValidation, recordValidation} = require("../validation");

exports.create_store = async (req, res) => {
    const {error} = storeValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const path_img = req.file.path;
    const res_path = path_img.replace("uploads", "");
    let postal_code;
    if (req.body.postal_code.includes(",")) {
        let array = [];
        postal_code = req.body.postal_code.split(",");
        postal_code.forEach(element => {
            if (element !== " ") {
                const elements = element.trim().split(/\s*,\s*/);
                array.push(elements[0]);
            }
        });
        console.log(array);
        postal_code = array;
    } else {
        postal_code = req.body.postal_code.toLowerCase();
    }
    const store = new storeModel({
        store_name: req.body.store_name,
        store_url: req.body.store_url,
        status: req.body.status,
        store_description: req.body.store_description,
        country: req.body.country,
        postal_code: postal_code,
        city: req.body.city,
        address1: req.body.address1,
        address2: req.body.address2,
        state: req.body.state,
        phone_number: req.body.phone_number,
        store_logo: res_path
    });
    try {
        const savedStore = await store.save();
        if (savedStore.status === "false") {
            res.redirect('/create?success=true');
        }
        res.redirect('/admin');
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.edit_store = async (req, res) => {
    const {error} = storeValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
};


exports.get_store = async (req, res) => {
    try {
        const store = await storeModel.find();
        res.status(200).send(store);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_single_store = async (req, res) => {
    const {error} = recordValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const store = storeModel.findById(req.body._id);
        res.status(200).send(store);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.patch_store = async (req, res) => {
    const store = await storeModel.findById(req.body._id);
    if (store != null) {
        if (req.body.status === "true") {
            store.status = "false";
        } else {
            store.status = "true";
        }
        try {
            await store.save();
            res.redirect('/admin');
        } catch (err) {
            res.redirect('/admin');
        }
    }
};