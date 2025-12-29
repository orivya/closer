#!/bin/bash
regions=("us-east-1" "us-west-1" "us-west-2" "eu-west-1" "ap-southeast-1")

for region in "${regions[@]}"; do
  echo "Testing region: $region"
  timeout 3 nc -zv aws-0-$region.pooler.supabase.com 6543 2>&1 | grep -q "succeeded" && echo "✅ $region works!" && break
done
