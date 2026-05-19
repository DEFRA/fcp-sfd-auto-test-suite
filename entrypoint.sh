#!/bin/sh

echo "run_id: $RUN_ID"
echo "CDP_PROXY: $CDP_PROXY"
echo "BASE_URL: $BASE_URL"

# Network diagnostics
echo "--- Network diagnostics ---"
AUTH_URL="https://your-account.cpdev.cui.defra.gov.uk/registration/journey/check-js/check-js-enabled"

echo "Request 1 to auth URL via proxy (headers):"
curl -s -o /dev/null -D - --proxy http://localhost:3128 --insecure "$AUTH_URL" | grep -i "x-cache\|age:\|x-squid\|via:\|http/"
echo ""
echo "Request 2 to auth URL via proxy (headers - check for HIT):"
curl -s -o /dev/null -D - --proxy http://localhost:3128 --insecure "$AUTH_URL" | grep -i "x-cache\|age:\|x-squid\|via:\|http/"
echo ""
echo "--- End diagnostics ---"

npm test
test_exit_code=$?

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

if [ $test_exit_code -ne 0 ]; then
  echo "test suite failed"
  exit 1
fi

echo "test suite passed"
exit 0