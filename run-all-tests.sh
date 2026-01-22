#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Green City Grow Hub - Comprehensive Test Suite${NC}"
echo -e "${BLUE}================================================${NC}\n"

# Track test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test Backend
echo -e "${YELLOW}[1/3] Running Backend Tests...${NC}"
cd BackEnd
if npm test 2>&1 | tee backend-test.log; then
    echo -e "${GREEN}✓ Backend tests passed${NC}\n"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ Backend tests failed${NC}\n"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))
cd ..

# Test Frontend
echo -e "${YELLOW}[2/3] Running Frontend Tests...${NC}"
if npm test -- --config=jest.config.frontend.cjs 2>&1 | tee frontend-test.log; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}\n"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ Frontend tests failed${NC}\n"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Generate Coverage Reports
echo -e "${YELLOW}[3/3] Generating Coverage Reports...${NC}"
echo ""
echo "Backend Coverage:"
cd BackEnd
npm run test:coverage 2>&1 | grep -E "Statements|Branches|Functions|Lines" || echo "No coverage report available"
cd ..

echo ""
echo "Frontend Coverage:"
npm test -- --coverage --config=jest.config.frontend.cjs 2>&1 | grep -E "Statements|Branches|Functions|Lines" || echo "No coverage report available"
echo ""

# Print summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Total Suites: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed! ✗${NC}"
    exit 1
fi
