#!/usr/bin/env sh

echo "Waiting for Floci to be ready..."
until aws sqs list-queues > /dev/null 2>&1; do
  sleep 1
done
echo "Floci is ready."

echo "Creating S3 buckets..."
# Commented example backend in compose.yml (docker/config/example-backend.env)
aws s3 mb s3://test-bucket

echo "Floci setup complete."
