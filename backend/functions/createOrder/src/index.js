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
  if (!req.payload || req.payload.length > 280) {
    res.json({
      success: false,
      msg: "Please provide a message. Make sure it's no longer than 280 characters.",
    });

    return;
  }

  const client = new sdk.Client();

  let database = new sdk.Databases(client);

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

  const order = await database.createDocument('main', 'orders', sdk.ID.unique(), {
    userId: req.variables['APPWRITE_FUNCTION_USER_ID'],
    msg: req.payload,
    status: 'CREATED'
  });

  const revolutResponse = await (await fetch(req.variables['REVOLUT_ENDPOINT'] + '/api/1.0/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount: 99,
      currency: 'EUR',
      capture_mode: 'MANUAL',
      merchant_order_ext_ref: order.$id
    }),
    headers: {
      'Authorization': 'Bearer ' + req.variables['REVOLUT_SECRET_KEY'],
      'Content-Type': 'application/json'
    }
  })).json();

  await database.updateDocument('main', 'orders', order.$id, {
    revolutOrderId: revolutResponse.id,
    status: 'PENDING'
  });

  res.json({
    success: true,
    url: revolutResponse.checkout_url
  });
};
