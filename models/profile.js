
/*
   Object/Relational mapping for instances of the Order class.

    - classes correspond to tables
    - instances correspond to rows
    - fields correspond to columns

   In other words, this code defines how a row in the PostgreSQL "Order"
   table maps to the JS Order object. Note that we've omitted a fair bit of
   error handling from the classMethods and instanceMethods for simplicity.
*/
var async = require('async');
//var util = require('util');
//var uu = require('underscore');
//var coinbase = require('./coinbase');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("profile", {
	id   :{type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
        email: {type: DataTypes.STRING, unique: true, allowNull: false},
	firstName: {type: DataTypes.STRING, allowNull: false},
        lastName:{type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        message: {type: DataTypes.TEXT, allowNull: true}
        //amount: {type: DataTypes.FLOAT},
	//time: {type: DataTypes.STRING, allowNull: false}
    }, {
	classMethods: {
            findOne:function(keywords,cb){
                    this.find({where: keywords}).success(function (result){
                        cb(result);
                    }).error(function(err){
                        console.log(err);
                        cb(null);
                    });
                
            },
            insert: function(profileObj, cb){
                var _Profile=this;
                var newProfileInstance = _Profile.build({
				email: profileObj.email,
                                firstName: profileObj.firstName,
                                lastName:profileObj.lastName,
                                password: profileObj.password,
                                message: profileObj.message
				//amount: order.total_btc.cents / 100000000,
				//time: order.created_at
			    });
	       newProfileInstance.save().success(function() {
				cb(null,newProfileInstance);
			    }).error(function(err) {
				console.log(err,null);
                                cb(err);
			    });
              //  cb(true);
               // cb(null);
            },
            
	    numRecords: function() {
		this.count().success(function(c) {
		    console.log("There are %s Orders", c);});
	    },
//	    allToJSON: function(successcb, errcb) {
//		this.findAll()
//		    .success(function(orders) {
//			//successcb(uu.invoke(orders, 'toJSON'));
//		    })
//		    .error(errcb);
//	    },
	  
	 
	
	},
	instanceMethods: {
            update: function(cb){
                this.save().success(function() {
                    cb();
                }).error(function(err){
                    cb (error);
                });
            }
            
	  
	}
    });
};
