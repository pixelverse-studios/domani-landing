# Audit Log - Landing Page - 2025-01-16 16:45:00

## Prompt Summary
User reported persistent "ERR_TOO_MANY_REDIRECTS" errors despite previous fixes. Browser screenshots showed requests to `http://localhost:3001/api/users/count`.

## Root Cause Identified
**Port Mismatch**: The user's browser was accessing `localhost:3001` while the dev server was running on port `3000`. This was not a code issue but a browser/server port alignment problem.

## Actions Taken
1. Analyzed browser network logs showing requests to port 3001
2. Killed all existing dev server processes
3. Started dev server explicitly on port 3001 to match browser's expectation
4. Verified API endpoint works correctly on port 3001

## Files Changed
None - this was a runtime configuration issue, not a code issue

## Resolution
Started dev server on port 3001 using:
```bash
PORT=3001 npm run dev
```

## Testing Results
- API endpoint responds correctly: `curl http://localhost:3001/api/users/count` returns `{"count":0}`
- Server logs show successful 200 responses
- No redirect loops when server and browser use matching ports

## Key Learnings
1. **Always check what port the browser is using** - Network tab shows actual request URLs
2. **Browser caches port preferences** - If you once accessed port 3001, browser may keep using it
3. **Relative URLs work correctly** - The `/api/users/count` relative URL works on any port
4. **Port misalignment causes redirect loops** - When browser and server ports don't match

## Recommended Actions for Users
If experiencing similar issues:

### Option 1: Match Server to Browser
```bash
# Check what port your browser is using (look at URL bar or network tab)
# Start server on that specific port
PORT=3001 npm run dev  # or whatever port browser is using
```

### Option 2: Navigate Browser to Correct Port
1. Check where dev server is running (look at terminal output)
2. Navigate browser to that exact URL (e.g., http://localhost:3000)
3. Clear browser cache if needed

### Option 3: Use Consistent Port
Add to package.json:
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

## Prevention
- Always verify browser URL matches server port
- Clear browser cache when switching ports
- Consider using a consistent port in package.json scripts

## Timestamp
Created: 2025-01-16 16:45:00
Page Section: infrastructure/ports