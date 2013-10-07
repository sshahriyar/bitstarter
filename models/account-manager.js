
var crypto 		= require('crypto');
//var mysql        	= require('mysql');//pg for postgresql
//var Server 		= require('mongodb').Server;
var moment 		= require('moment');

//var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'debug007';
var dbUser              = 'root';
var db                  =require('../models');
/* establish mysql database connection 
  var connection = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  database :dbName,
  password : 'root'
});

connection.connect(function(err) {
  // connected! (unless `err` is set)
  if (err) {
        console.log('Unable to connect');
        throw err;
  }
  else
      console.log('Connected to '+dbHost+'::'+dbUser+'::'+ dbName);
  
});
*/
//var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
//	db.open(function(e, d){
//	if (e) {
//		console.log(e);
//	}	else{
//		console.log('connected to database :: ' + dbName);
//	}
//});

//var accounts = db.collection('accounts');

/* login validation methods */

exports.autoLogin = function(user, password, callback)
{
	global.db.Profile.findOne({email:user}, function(o) {
		if (o){
			o.password == password ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
//	connection.query('SELECT email,pass from profile where firstname=\''+user+'\'', function(err, rows) {
//                if (err) throw err;
//                //console.log('The user id is: ', rows);
//                if (rows[0] == null){
//			callback('user-not-found');
//		}	else{
//			validatePassword(pass, rows[0].pass, function(err, res) {
//				if (res){
//                                     console.log('password verified');
//					callback(null, rows[0].email);
//				}	else{
//                                         console.log('password not verified');
//					callback('invalid-password');
//                                        
//				}
//			});
//                        console.log('The user id is: ', rows[0].email);
//		}
//                
//           });

    
         global.db.Profile.findOne({email:user}, function(o) {
		if (o == null){
			callback('invalid user id');
		}	else{
			validatePassword(pass, o.password, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{

			global.db.Profile.findOne({email:newData.email}, function(e) {
				if (e){
					callback('email-taken');
				}	else{
                                                //console.log("email"+newData.email);
                                                saltAndHash(newData.password, function(hash){
						newData.password = hash;
					// append date stamp when record was created //
						//newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                                               // console.log(newData);
                                                db.Profile.insert(newData,  callback);
					});
				}
			});

}

exports.updateAccount = function(newData, callback)
{
	global.db.Profile.findOne({id:newData.id}, function(o){
		
                o.firstName 	= newData.firstName;
                o.lastName      = newData.lastName;
		o.email 	= newData.email;
                o.password      = newData.password;
                
		//o.country 	= newData.country;
		if (newData.password == ''){
			//global.db.Profile.update(o, function(err) {
                         //o.update(function(err) {
				//if (err) callback(err);
				//else
                                    callback("password is empty");
			//});
		}	else{
			saltAndHash(newData.password, function(hash){
                           
				o.password = hash;
				o.update(function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	global.db.Profile.findOne({email:email}, function(o){
           
             if (!o){
                        console.log("in update email didn't...");
			callback("Email didn't match", null);
		}	else{
                                   

			saltAndHash(newPass, function(hash){
		        o.password = hash;
		        o.update(callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
//	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	db.Profile.findOne({email:email}, function(o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	db.Profile.findOne({ email:email,  password:passHash }, function(o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
//	accounts.find().toArray(
//		function(e, res) {
//		if (e) callback(e)
//		else callback(null, res)
//	});
};

exports.delAllRecords = function(callback)
{
//	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
        console.log(hashedPass+ " "+ validHash);
	callback(null, hashedPass === validHash);
        //callback(null, true);
}

/* auxiliary methods */

var getObjectId = function(id)
{
//	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
//	accounts.findOne({_id: getObjectId(id)},
//		function(e, res) {
//		if (e) callback(e)
//		else callback(null, res)
//	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
//	accounts.find( { $or : a } ).toArray(
//		function(e, results) {
//		if (e) callback(e)
//		else callback(null, results)
//	});
}
