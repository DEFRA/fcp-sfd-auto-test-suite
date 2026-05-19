#!/bin/sh

echo "run_id: $RUN_ID"
echo "CDP_PROXY: $CDP_PROXY"
echo "BASE_URL: $BASE_URL"

# Network diagnostics
echo "--- Network diagnostics ---"
echo "Proxy check (localhost:3128):"
curl -s -o /dev/null -w "HTTP %{http_code}" --proxy http://localhost:3128 "${BASE_URL:-https://fcp-sfd-frontend.test.cdp-int.defra.cloud}/" || echo "FAILED"
echo ""
echo "Direct check (no proxy):"
curl -s -o /dev/null -w "HTTP %{http_code}" "${BASE_URL:-https://fcp-sfd-frontend.test.cdp-int.defra.cloud}/" || echo "FAILED"
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