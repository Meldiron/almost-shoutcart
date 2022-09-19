const fetch = require('node-fetch');
const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const database = new sdk.Databases(client);
  const functions = new sdk.Functions(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['REVOLUT_SECRET_KEY'] ||
    !req.variables['REVOLUT_ENDPOINT']
  ) {
    throw Error("Environment variables are not set.");
  }

  client
    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

  async function verifyPayment(order) {
    const revolutResponse = await (await fetch(req.variables['REVOLUT_ENDPOINT'] + '/api/1.0/orders/' + order.revolutOrderId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + req.variables['REVOLUT_SECRET_KEY'],
        'Content-Type': 'application/json'
      }
    })).json();

    await database.updateDocument('main', 'orders', order.$id, {
      attempts: order.attempts + 1,
      status: revolutResponse.state
    });

    if (order.status !== revolutResponse.state) {
      if (revolutResponse.state === 'AUTHORISED') {
        const res = await functions.createExecution('postShoutout', order.msg, false);
        const resJson = JSON.parse(res.response);

        if (resJson.success) {
          const revolutClaimResponse = await (await fetch(req.variables['REVOLUT_ENDPOINT'] + '/api/1.0/orders/' + order.revolutOrderId + '/capture', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
              'Authorization': 'Bearer ' + req.variables['REVOLUT_SECRET_KEY'],
              'Content-Type': 'application/json'
            }
          })).json();

          await database.updateDocument('main', 'orders', order.$id, {
            status: revolutClaimResponse.state
          });
        }
      }
    }
  }

  async function verifyAllPayments() {
    const response = await database.listDocuments('main', 'orders', [sdk.Query.limit(100), sdk.Query.equal('status', 'PENDING'), sdk.Query.lessThan('attempts', 5), sdk.Query.orderDesc('$createdAt')]);

    for (const document of response.documents) {
      await verifyPayment(document);
    }
  }

  if (req.variables['APPWRITE_FUNCTION_TRIGGER'] === 'schedule') {
    await verifyAllPayments();
  } else {
    if (!req.payload) {
      res.json({
        success: false,
        msg: "Please provide a message. Make sure it's no longer than 280 characters.",
      });

      return;
    }

    const orderId = req.payload;
    const order = await database.getDocument('main', 'orders', orderId);

    if (!order.attempts >= 5) {
      res.json({
        success: false,
        msg: "You can no longer verify this payment to prevent spam. Please contact us.",
      });

      return;
    }

    await verifyPayment(order);
  }

  res.json({
    success: true
  });
};
