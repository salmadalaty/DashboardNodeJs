const Customer = require("../models/Customer");
const mongoose = require("mongoose");

//get route 
//home page

exports.homepage = async (req, res) => {
    const messages = await req.flash("info");

    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System"
    }
    let perPage = 12;
    let page = req.query.page || 1;


    try {
        const customers = await Customer.aggregate([{ $sort: { updateAt: 1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count;
        res.render('index', {
            locals,
            messages,
            customers,
            current: page,
            pages: Math.ceil(count / perPage)

        });
        // const costumers = await Customer.find({}).limit(22);
        // res.render('index', { locals, messages, costumers });
    }
    catch (error) {
        console.log(error)
    }

}

//get  
//add customer
exports.addCustomer = async (req, res) => {
    const locals = {
        title: "Add New Customer ",
        description: "Free NodeJs User Management System"
    }
    res.render('customer/add', locals)
}

//post 
//create customer
exports.postCustomer = async (req, res) => {
    // console.log(req.body);
    const newCustomer = new Customer({
        firstName: req.body.firstName,
        LastName: req.body.LastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email,

    });

    try {
        await Customer.create(newCustomer);
        await req.flash('info', "new customer has been added");
        res.redirect('/');
        console.log("ADED")
    }
    catch (error) {
        console.log(error)
    }
}

exports.view = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })
        const locals = {
            title: "view Customer ",
            description: "Free NodeJs User Management System"
        };
        res.render('customer/view', {
            locals,
            customer
        })
    }
    catch (error) {
        console.log(error)
    }
}
exports.edit = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })
        const locals = {
            title: "edit Customer ",
            description: "Free NodeJs User Management System"
        };
        res.render('customer/edit', {
            locals,
            customer
        })
    }
    catch (error) {
        console.log(error)
    }
}
exports.editpost = async (req, res) => {
    console.log(req.body);

    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.LastName,
            details: req.body.details,
            tel: req.body.tel,
            email: req.body.email,
        });

        await req.flash("info", "Customer details have been updated.");

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};



/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {
    try {

        await Customer.deleteOne({ _id: req.params.id });
        await req.flash("info", "Customer details have been Deleted.");
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

exports.searchcustomer = async (req, res) => {
    try {
        const locals = {
            title: "Search Customer",
            description: "Free NodeJs User Management System"
        };

        // Get the search term from the request body
        let searchTerm = req.body.searchTerm;

        // Remove any special characters from the search term
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        // Search for customers whose first name matches the search term (case-insensitive)
        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } }
            ]
        });

        // Render the "search" view with the found customers and locals
        res.render("search", { locals, customers });
    }
    catch (error) {
        console.log(error)
    }
};
