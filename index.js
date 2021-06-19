const deployments_endpoint = "https://api.cloudflare.com/client/v4/accounts/" + ACCOUNT_ID + "/pages/projects/" + PROJECT_NAME + "/deployments";
const email = EMAIL;
const expiration_days = 7;

addEventListener("scheduled", (event) => {
  event.waitUntil(handleScheduled(event.scheduledTime));
});

async function handleScheduled(request) {
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Auth-Email": email,
      "X-Auth-Key": API_KEY,
      //We recommend you store API keys as secrets using the Workers dashboard or using Wrangler as documented here https://developers.cloudflare.com/workers/cli-wrangler/commands#secret
    },
  };

  let response = await fetch(deployments_endpoint, init);
  let deployments = await response.json();
  let to_delete = [];

  deployments.result.forEach(function (deploy) {
    if (
      (Date.now() - new Date(deploy.created_on)) / 86400000 >
      expiration_days
    ) {
      to_delete.push(deploy.id);
    }
  });

  const delete_request = {
    method: "DELETE",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Auth-Email": email,
      "X-Auth-Key": API_KEY,
    },
  };
  for (const id of to_delete) {
    await fetch(deployments_endpoint + "/" + id, delete_request);
  }
  return new Response("OK", { status: 200 });
}