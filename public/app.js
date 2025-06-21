async function endSession(sessionId, uid) {
  // Get CSRF token (if not already stored)
  const csrfToken = /* fetch or store from /api/hyperbeam/csrf-token */;
  await fetch('/api/hyperbeam/terminate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken
    },
    body: JSON.stringify({ sessionId, uid })
  });
}

// Example usage:
endSession(currentSessionId, currentUid);
