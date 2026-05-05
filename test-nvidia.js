const fetch = require('node-fetch');

async function test() {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NVIDIA_KEY}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta/llama-4-maverick-17b-128e-instruct',
      messages: [{ role: 'user', content: 'Write a small poem about tech. Output as JSON {"poem": "..."}' }],
      max_tokens: 100,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });
  console.log(response.status);
  console.log(await response.text());
}
test();
