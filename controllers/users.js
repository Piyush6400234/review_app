const User = require('../models/user')


module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.register = async (req, res, next)=>{
    // res.send(req.body)
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password)
        // console.log (registeredUser)
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success', 'welcome to places');
            res.redirect('/campgrounds');
        })//this is a helper function in passport that will automatically login a user when he/she registers

    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
}


module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

module.exports.login = (req, res)=>{
    // res.render('users/register');
    req.flash('success', 'welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}