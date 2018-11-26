const functions = require('firebase-functions');
const conekta = require('conekta');
const admin = require('firebase-admin');
const cors = require('cors');
conekta.api_key = "key_YKHtLWJ7wzsFbHc5zQtWUg";
conekta.api_version = '2.0.0';
conekta.locale = 'es';
admin.initializeApp(functions.config().firebase);
const corsHandler = cors({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello Word!!!!!");
});

exports.createUserConekta = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {});
    let token = request.get('x-user-key');
    admin.auth().verifyIdToken(token).then(function(decodedToken) {
        let uid = decodedToken.uid;
        let name = decodedToken.name;
        let email = decodedToken.email;
        conekta.Customer.create({
            name: name,
            email: email
        }, function(err, customer) {
            if (err != null){
                let details = err.details;
                response.status(500).send(details[0].message);
            } else{
                admin.database().ref('users/' + uid + '/idConekta').set(customer._id).then(() => {
                    response.send(customer.toObject());
                });
            }
        });
    }).catch(function(error) {
        // Handle error
        response.status(500).send(error.message);
    });
   
});

exports.createPaymentSourceConekta = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {});
    let token = request.get('x-user-key');
    admin.auth().verifyIdToken(token).then(function(decodedToken) {
        let uid = decodedToken.uid;
        let tok_user = request.body.token_id_user;
        let tok_card = request.body.token_id_card;
        conekta.Customer.find(tok_user, function(err, customer) {
            
            if (err != null){
                response.status(500).send('No existe el usuario conekta');
            }else{

                customer.createPaymentSource({
                    type: "card",
                    token_id: tok_card
                  }, function(err, res) {
                      if (err != null){
                          let details = err.details;
                          response.status(500).send(details[0].message);
                      }else{
                          console.log(res);
                          admin.database().ref('users/' + uid + '/cards').push(res, function(error) {
                            if (error){
                               console.log('Error has occured during saving process')
                              response.status(500).send('Error has occured during saving process');
                            }else
                              console.log("Data hss been saved succesfully");
                              response.send(res);
                          })
                      }
                  });
            }
        });
    }).catch(function(error) {
        // Handle error
        response.status(500).send(error.message);
    });
   
});

exports.createPaymentConekta = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {});
    let token = request.get('x-user-key');
    admin.auth().verifyIdToken(token).then(function(decodedToken) {
        
        let uid = decodedToken.uid;
        let customer_id = request.body.customer_id;
        let concepto = request.body.concepto;
        let amount = request.body.amount;
        let payment_source_id = request.body.payment_source_id;

        conekta.Order.create({
            "currency": "MXN",
            "customer_info": {
              "customer_id": customer_id
            },
            "line_items": [{
              "name": concepto,
              "unit_price": amount,
              "quantity": 1
            }],
            "charges": [{
              "payment_method": {
                "type" : "card",
                "payment_source_id": payment_source_id
              }
            }]
          }, function(err, order) {

                console.log(err);
              
                if (err != null){
                    response.status(500).send(err.details[0].message);
                }else{

                    console.log(order.toObject());

                    admin.database().ref('users/' + uid + '/payments').push(order.toObject(), function(error) {
                        if (error){
                           console.log('Error has occured during saving process')
                          response.status(500).send('Error has occured during saving process');
                        }else
                          console.log("Data hss been saved succesfully");
                          response.send(order.toObject());
                    })

                }

          })
        
    }).catch(function(error) {
        // Handle error
        response.status(500).send(error.message);
    });
   
});

