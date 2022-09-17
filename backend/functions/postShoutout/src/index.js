const fetch = require('node-fetch');

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

  if (
    !req.variables['DISCORD_WEBHOOK_URL']
  ) {
    throw Error("Environment variables are not set.");
  }

  await fetch(req.variables['DISCORD_WEBHOOK_URL'], {
    method: 'POST',
    body: JSON.stringify({
      "content": "**" + req.payload + "**\n\n> To buy your own shoutout, visit <https://almost-shoutcart.vercel.app/>",
      "embeds": null,
      "attachments": []
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  res.json({
    success: true
  });
};
