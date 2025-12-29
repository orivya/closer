#!/bin/bash
# Test script to verify OpenAI API key is working

echo "🧪 Testing OpenAI API Key..."
echo ""

# Get the API key from Supabase secrets (you'll need to paste it)
read -p "Enter your OpenAI API key (or press Enter to skip): " API_KEY

if [ -z "$API_KEY" ]; then
  echo "⚠️  Skipping API key test. You can test it in the app instead."
  exit 0
fi

echo ""
echo "Testing API key with a simple request..."
echo ""

# Test the API key
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Say hello in one word."}
    ],
    "max_tokens": 10
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ SUCCESS! OpenAI API key is working!"
  echo ""
  echo "Response:"
  echo "$BODY" | jq -r '.choices[0].message.content' 2>/dev/null || echo "$BODY"
else
  echo "❌ ERROR: API key test failed"
  echo ""
  echo "HTTP Status: $HTTP_STATUS"
  echo "Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  echo "Common issues:"
  echo "- Invalid API key (check for typos)"
  echo "- Insufficient credits in OpenAI account"
  echo "- API key revoked or expired"
fi

