# 🧪 Real-Time Chat Testing Guide

## Quick Start Testing

### Prerequisites

✅ Development server running: `pnpm dev`  
✅ Database migrated: `pnpm prisma db push`  
✅ At least 2 user accounts created

## Test Scenarios

### 1️⃣ Real-Time Message Delivery

**Setup:**

1. Open browser window 1 (User A - Student)
2. Open incognito window (User B - Expert)
3. Login to both accounts
4. Navigate to `/chat` in both windows
5. Start a conversation between them

**Test:**

```
User A: Type "Hello, I need help with my assignment"
Expected: ✅ Message appears instantly in BOTH windows
Expected: ✅ User A sees message immediately (no delay)
Expected: ✅ User B sees message + receives notification
```

**Pass Criteria:**

- Message shows in under 100ms
- No refresh needed
- Both users see the message

---

### 2️⃣ Typing Indicator

**Setup:**

- Same two users in conversation

**Test:**

```
User A: Start typing (don't send)
Wait 1 second
Expected: ✅ User B sees "Typing..." under User A's name

User A: Stop typing
Wait 2 seconds
Expected: ✅ "Typing..." disappears, shows "Online"
```

**Pass Criteria:**

- Typing indicator appears within 500ms
- Auto-clears after 2 seconds of inactivity
- Doesn't show for own typing

---

### 3️⃣ Connection Status

**Setup:**

- Open chat page
- Look at top-right of chat header

**Test:**

```
Expected: ✅ Green badge "Connected" with pulsing dot

Disconnect internet
Wait 2 seconds
Expected: ✅ Red badge "Disconnected"

Reconnect internet
Wait 2 seconds
Expected: ✅ Green badge "Connected" returns
```

**Pass Criteria:**

- Status indicator visible
- Changes color based on connection
- Pulsing animation on "Connected"

---

### 4️⃣ Multiple Messages

**Setup:**

- Two users in conversation

**Test:**

```
User A: Send 5 messages rapidly
Expected: ✅ All 5 messages appear in order
Expected: ✅ No duplicate messages
Expected: ✅ Each message appears instantly

User B: Reply to each message
Expected: ✅ All replies appear in real-time
```

**Pass Criteria:**

- All messages delivered
- Correct order maintained
- No duplicates
- Under 100ms delivery

---

### 5️⃣ Message Persistence

**Setup:**

- Send several messages

**Test:**

```
Send 3 messages
Refresh page (F5)
Expected: ✅ All 3 messages still visible
Expected: ✅ Message order preserved
Expected: ✅ Timestamps correct
```

**Pass Criteria:**

- Messages survive page reload
- Database persistence working
- No data loss

---

### 6️⃣ File Upload

**Setup:**

- Two users in conversation

**Test:**

```
User A: Upload an image (< 5MB)
Expected: ✅ Upload progress indicator
Expected: ✅ Image appears in chat instantly
Expected: ✅ User B sees image in real-time
Expected: ✅ Image clickable/downloadable

User A: Upload a PDF
Expected: ✅ PDF appears with file icon
Expected: ✅ Download button works
```

**Pass Criteria:**

- Files upload successfully
- Real-time delivery to other user
- Downloadable attachments

---

## Browser Console Checks

### Expected Socket.IO Logs

```javascript
// When page loads
✅ Socket connected

// When sending message
📨 New message received: {id: "...", content: "..."}

// When typing
⌨️ User typing: userId123 true
⌨️ User typing: userId123 false

// When user joins
👤 User status changed: userId123 true
```

### Check Connection

Open browser console (F12) and run:

```javascript
// Should show socket object
console.log(window.__socket);

// Should show true
console.log(window.__isConnected);
```

---

## Performance Benchmarks

### Message Delivery Time

- ✅ Target: < 100ms
- ⚠️ Acceptable: < 500ms
- ❌ Poor: > 1000ms

### Typing Indicator

- ✅ Target: < 200ms
- ⚠️ Acceptable: < 500ms
- ❌ Poor: > 1000ms

### Connection Status Update

- ✅ Target: < 1000ms
- ⚠️ Acceptable: < 3000ms
- ❌ Poor: > 5000ms

---

## Troubleshooting

### ❌ "Disconnected" Badge Shown

**Check:**

1. Server running? `pnpm dev`
2. Console errors?
3. Network tab shows WebSocket connection?

**Fix:**

```bash
# Restart server
pnpm dev
```

### ❌ Messages Not Appearing

**Check:**

1. Browser console for errors
2. Look for "📨 New message received:" logs
3. Check Socket.IO connection status

**Debug:**

```javascript
// In browser console
socket.emit("send_message", {
  conversationId: "test-conv-id",
  senderId: "your-user-id",
  receiverId: "receiver-id",
  content: "Test",
  messageType: "TEXT",
});
```

### ❌ Typing Indicator Not Working

**Check:**

1. Socket.IO connected?
2. Input onChange calling `handleTyping()`?
3. Server logs show "typing" events?

**Fix:**

- Ensure you're typing in active conversation
- Check connection status indicator

### ❌ Duplicate Messages

**Check:**

1. Should be fixed with duplicate prevention
2. Check if message IDs are unique

**Verify:**

```javascript
// Should see duplicate check in logs
const exists = prev.some((m) => m.id === message.id);
```

---

## Manual Testing Checklist

### Before Testing

- [ ] Database running
- [ ] Server started (`pnpm dev`)
- [ ] 2+ users registered
- [ ] No console errors

### During Testing

- [ ] ✅ Real-time messages work
- [ ] ✅ Typing indicator works
- [ ] ✅ Connection status accurate
- [ ] ✅ No duplicate messages
- [ ] ✅ File uploads work
- [ ] ✅ Messages persist after refresh
- [ ] ✅ Notifications appear
- [ ] ✅ Timestamps correct

### After Testing

- [ ] Check server logs for errors
- [ ] Verify database has all messages
- [ ] No memory leaks (check browser task manager)
- [ ] All sockets properly cleaned up

---

## Advanced Testing

### Load Testing

```bash
# Send 100 messages
for ($i=1; $i -le 100; $i++) {
  # Send message via Socket.IO
}

Expected: All messages delivered in order
Expected: No performance degradation
```

### Concurrent Users

```bash
# Open 10 browser tabs
# All send messages simultaneously

Expected: All messages delivered
Expected: Server stays responsive
```

### Network Interruption

```bash
# Send message
# Disconnect internet for 5 seconds
# Reconnect

Expected: Message sent after reconnection
Expected: No data loss
```

---

## Success Criteria

### ✅ Test Passes If:

1. Messages appear instantly (< 100ms)
2. Typing indicator works smoothly
3. Connection status accurate
4. No duplicate messages
5. Files upload in real-time
6. Messages persist after refresh
7. No console errors
8. Server stays stable

### ❌ Test Fails If:

1. Messages delayed > 1 second
2. Typing indicator broken
3. Connection status wrong
4. Duplicate messages appear
5. Files don't upload
6. Messages lost after refresh
7. Console shows errors
8. Server crashes

---

## Automated Testing (Future)

```typescript
// Test template
describe("Real-Time Chat", () => {
  it("should send messages in real-time", async () => {
    // Setup
    const userA = await loginUser("userA");
    const userB = await loginUser("userB");

    // Act
    await userA.sendMessage("Hello");

    // Assert
    expect(userB.messages).toContain("Hello");
    expect(userB.messageDelay).toBeLessThan(100);
  });
});
```

---

## Report Template

```markdown
## Test Results

**Date:** YYYY-MM-DD
**Tester:** Your Name
**Environment:** Development/Staging/Production

### Results

- [ ] ✅ Real-time messages: PASS/FAIL
- [ ] ✅ Typing indicator: PASS/FAIL
- [ ] ✅ Connection status: PASS/FAIL
- [ ] ✅ No duplicates: PASS/FAIL
- [ ] ✅ File uploads: PASS/FAIL
- [ ] ✅ Persistence: PASS/FAIL

### Performance

- Average message delivery: \_\_\_ ms
- Typing indicator response: \_\_\_ ms
- Connection recovery: \_\_\_ ms

### Issues Found

1. [Issue description]
2. [Issue description]

### Notes

[Additional observations]
```

---

**Ready to test?** 🚀  
Start with Scenario 1 and work through each test systematically.
