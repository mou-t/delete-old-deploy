const endpoint = "https://api.cloudflare.com/client/v4/accounts/" + ACCOUNT_ID + "/pages/projects/" + PROJECT_NAME + "/deployments";
const email = EMAIL;

addEventListener("scheduled", (event) => {
  event.waitUntil(handleScheduled(event.scheduledTime));
});

async function handleScheduled(request) {
  const init = {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Auth-Email": email,
      "X-Auth-Key": API_KEY,
      //We recommend you store API keys as secrets using the Workers dashboard or using Wrangler as documented here https://developers.cloudflare.com/workers/cli-wrangler/commands#secret
    },
  };

  const response = await fetch(endpoint, init);
  return new Response(200);
}