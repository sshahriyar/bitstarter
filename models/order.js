/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var uu = require('underscore');

module.exports=function (sequelize, DataTypes){
    return sequelize.define('order',{
     transactionId    :   {type: DataTypes.STRING, allowNull: false },
     amount            :   {type: DataTypes.FLOAT, allowNull:false},
     transactionTime  :   {type: DataTypes.STRING, allowNull: false},
     transactionType    :   {type: DataTypes.STRING, defaultValue:"not-avialble"}
    },
    {
        classMethods:{
            insert: function(ordersData,cb){ 
            var _Order=this;
                var newOrderInstance = _Order.build({
                    transactionId: ordersData.transactionId,
                    amount: ordersData.amount,
                    transactionTime: ordersData.transactionTime,
                    transactionType: ordersData.transactionType,
                    profileId   : ordersData.profileId
                });
                    
                          
	       newOrderInstance.save().success(function() {
				cb(null);
			    }).error(function(err) {
				console.log(err);
                                cb(err);
			    });
            },
            
           totals: function(successcb, errcb) {
		this.findAll().success(function(orders) {
		    var total_funded = 0.0;
		    orders.forEach(function(order) {
			total_funded += parseFloat(order.amount);
		    });
		    var totals = {total_funded: total_funded,
				  num_orders: orders.length};
		    successcb(totals);
		}).error(errcb);
	    },
            
            allOrdersforPerson: function(profile_id,successcb, errcb) {
		 // this.find({where: {profileId: profile_id}}).success(function(orders) {
                 this.findAll({where: {profileId: profile_id}}).success(function(orders) {

			successcb(uu.invoke(orders, 'toJSON'));
                         
                         
                         
                        
                      
                       //successcb(JSON.stringify(orders));
		    })
		    .error(errcb);
        }
            
    },
        instanceMethods:{
            
        }
    });
}