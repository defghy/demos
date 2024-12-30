const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { endpoint, azureApiKey, deploymentName, } = require('../secret-key.js');

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
  { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI" },
  { role: "user", content: "Do other Azure AI services support this too" },
];

async function main() {
  console.log("== Chat Completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const result = await client.getChatCompletions(deploymentName, messages);

  console.log("result", result);
  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };

`
curl 'https://animal.openai.azure.com/openai/deployments/${deploymentName}/completions?api-version=2023-03-15-preview' \
-H "Content-Type: application/json" \
-H "api-key: ${azureApiKey}" \
-d '{  "prompt": "hello GPT"}'
`;
