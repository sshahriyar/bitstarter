
//var CT = require('./models/country-list');
var AM = require('./models/account-manager');
var EM = require('./models/email-dispatcher');
//var restler= require ('restler');
var ipn = require('paypal-ipn');
 
module.exports = function(app) {

// main  //
        app.get('/', function(req, res){
           
   
                    res.render('index');
           
          });
          
          app.get('/paymentconfirm', function(req, res){
   
                    res.render('paymentconfirm');
           
          });
          
//          app.get('/info',function(req,res){
//              res.render('blog');
//          });
//login page
	app.get('/login', function(req, res){
	// check if the user's credentials are saved in a cookie //
        
		if( (req.cookies.user == undefined || req.cookies.pass == undefined) && req.session.user == undefined){
                     
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
                        var email, password;
                        if (req.session.user == null){
                            email=req.cookies.user;
                            password=req.cookies.pass;
                        } else{
                            email=req.session.user.email;
                            password=req.session.user.password;
                        }
			AM.autoLogin(email, password, function(o){
                                console.log("auto login");
				if (o != null){
				    req.session.user = o;
					res.redirect('/controlpanel');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/login', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
                                console.log(e);
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
                                    //console.log(o.user+ o.password);
					res.cookie('user', o.email, { maxAge: 900000 });
					res.cookie('pass', o.password, { maxAge: 900000 });
				}
				res.send(o, 200);
                                console.log ("I have reached manulalogin in router");
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/controlpanel', function(req, res) {
            //console.log ("In home");
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/login');
	    }   else{
                        
			AM.orderfn(req.session.user.id, 
                        /* successfunction */function(orderList){
                                                    cPanelData={
                                                        title : 'Control Panel',
                                                        //countries : CT,
                                                        uid : req.session.user.id,
                                                        firstName :req.session.user.firstName,
                                                        lastName :req.session.user.lastName,
                                                        email: req.session.user.email ,
                                                        message: req.session.user.message,
                                                        orders: orderList
                                                       };
                                               
                                                console.log (req.session.user.message);
                                                // console.log (orderList[0].transactionId);
                                                res.render('controlpanel',cPanelData);},
                        /*error function */ function(err){
                                                console.log(err);
                                                response.send("Unable to retrieve your donations");
                                            });
	    }
	});
	
	app.post('/controlpanel', function(req, res){
            //console.log(req.session.user);
             //console.log(req.param('userid'));
            if (req.param('userid') != undefined) {
               
                        if (req.param('userid')!= req.session.user.id){
                            res.send("Use of illegal user id", 400);
            
                        } else {
                               
                                AM.updateAccount({
                                        id              : req.param('userid'),
                                        email 		: req.param('user'),
                                        firstName 	: req.param('firstName'),
                                        lastName 	: req.param('lastName'),
                                        message 	: req.param('message'),
                                        password	: req.param('pass')
                                }, function(e, o){
                                        if (e){
                                                res.send('error-updating-account', 400);
                                        }	else{
                                                    req.session.user = o;
                                                    // update the user's login cookies if they exists //
                                                    if (req.cookies.user != undefined && req.cookies.pass != undefined){
                                                            res.cookie('user', o.email, { maxAge: 900000 });
                                                            res.cookie('pass', o.password, { maxAge: 900000 });	
                                                    }
                                                    res.send('ok', 200);
                                        }
                                });
                        }
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		if ((req.cookies.user == undefined || req.cookies.pass == undefined) && req.session.user == null){
			res.render('signup', { title: 'Sign Up' });
		}	else{
	// attempt automatic login //
                        var email, password;
                        if (req.session.user == null){
                            email=req.cookies.user;
                            password=req.cookies.pass;
                        } else{
                            email=req.session.user.email;
                            password=req.session.user.password;
                        }
			AM.autoLogin(email, password, function(o){
                                console.log("auto login");
				if (o != null){
                                        req.session.user = o;
					res.redirect('/controlpanel');
				}	else{
					res.render('signup', { title: 'Sign Up' });
				}
			});
		}
        
	});
	
	app.post('/signup', function(req, res){
                console.log(req.param("user"));
                var newData= {
			firstName   : req.param('firstName'),
                        lastName    : req.param('lastName'),
			email       : req.param('user'),
			//user 	: req.param('user'),
			password    : req.param('pass'),
			message     : req.param('message')
                 };
		AM.addNewAccount(newData, function(e,hPass){
			if (e){
				res.send(e, 400);
			}	else{
                                req.session.user = newData;
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, json){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e)  console.log(json);
					else{
						 res.send('email-server-error', 400);
						 console.log('error : ', e);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e){
                    	if (e){
                               
				res.send('unable to update password', 400);
			}	else{
                    
                                    res.send('ok', 200);        
                                    
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
//        app.post('/paypalpdt',function (req,res){
//            //
//            var transactionID=req.param('tx');
//            if (transactionID != undefined){
//                    restler.post('https://www.paypal.com/cgi-bin/webscr', {
//                        data: { cmd: "_notify-synch",
//                                 tx: transactionID,
//                                 at:"oUfqIr9mMvyYSmt5q2aVkO_YdufpgHwEvbFLcXbQrF8iSm-6LtyO6bWA7Im" ,
//                               }
//                     }).on('complete', function(data, response) {
//                             console.log(data);
//                            if (result instanceof Error) {
//                                  console.log('Error: ' + data.message);
//                                 // this.retry(5000); // try again after 5 sec
//                             } else {
//                                 console.log(data);
//                             }
//                   });
//             }
//        });
        
//        app.get('/paypalipn',function(req,res){
//                            var ipnData={
//                                              //message      : msg, 
//                                              txn_id       : "12332252524525",
//                                              email        : "justsshary@hotmail.com",
//                                              firstName    : "Shary",
//                                              lastName     : "Murtaza",
//                                              payment_date : "2013-04-10",
//                                            // paymentStatus: req.body.payment_status,
//                                              amount       : 200.50
//                                            //  currency     : req.body.mc_currency      
//                                          };
//                                          ipnModeling(ipnData);
//                                       
//        });
        
        app.post('/paypalipn',function (req,res){
             
          //  console.log('Paypal');
            
              if(typeof req.body != "undefined") {
                ipn.verify(req.body, function callback(err, msg) {
                    if (err) {
                        console.log('IPN: ' + err);
                    } else {
                        if (req.body.payment_status == 'Completed' && msg == "VERIFIED") {
                           // console.log('IPN: ' + msg + " " + req.body.txn_id + " " + req.body.payer_email);
                                        var ipnData={
                                              //message      : msg, 
                                              txn_id       : req.body.txn_id,
                                              email        : req.body.payer_email,
                                              firstName    : req.body.first_name,
                                              lastName     : req.body.last_name,
                                              payment_date : req.body.payment_date,
                                              transactionType: "Paypal",
                                              amount       : req.body.mc_gross
                                            //  currency     : req.body.mc_currency      
                                          };
                                          ipnModeling(ipnData);
                                       
                            
                           
                        }
                    }
                    res.send(200);
                    res.end();
                });
            }
            res.send(200);
            res.end();

        });
        
        
        var ipnModeling= function(ipnData){
               AM.getAccountByEmail(ipnData.email, function(profileObj){
                     if (profileObj){ // if there is an account
                                var id=profileObj.id;
                                 console.log("in ipn modeling" +"--"+id);                 
                                AM.addNewOrder(profileObj, ipnData,function (e){
                                      if (e)  console.log('error : ', e);
                                      else{
                                          profileObj.password=""; // don't send password for existing accounts
                                          profileObj.amount=ipnData.amount;
                                           EM.loginLink(profileObj, function(e, json){
                                                if (!e)  console.log(json);
                                                else{
                                                     res.send('email-server-error', 400);
                                                     console.log('error : ', e);
                                                }
                                           });
                                       }
                                });
                                                    
                        }else{// when account doesn't exist
                                    ipnData.password="random_pass";
                                     
                                                 AM.addNewAccountandOrder(ipnData,function (e,hashPassword){
                                                    if (e)  console.log('error : ', e);
                                                    else{ 
                                                         var loginData={firstName:ipnData.firstName, email:ipnData.email, 
                                                                           password:hashPassword, amount:ipnData.amount};
                                                          EM.loginLink(loginData, function(e, json){
                                                                if (!e)  console.log(json);
                                                                else{
                                                                         res.send('email-server-error', 400);
                                                                         console.log('error : ', e);
                                                                }
                                                           });                                  
                                                       }
                                                   });
                                              
                                      
                           }



               });
                            
        }
        
        
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};