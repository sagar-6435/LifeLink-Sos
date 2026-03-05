# Setup Instructions for LifeLink AI System

## ✅ Step 1: Dependencies Installed

You've successfully installed all backend dependencies!

---

## 🔑 Step 2: Get GitHub Token (Required)

The AI agent needs a GitHub token to access GitHub Models (free AI service).

### How to Get GitHub Token:

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token (classic)"
   - Give it a name: "LifeLink AI Agent"

3. **Select Permissions**
   - Check: `repo` (Full control of private repositories)
   - Check: `read:org` (Read org and team membership)

4. **Generate and Copy**
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **Add to .env File**
   - Open `backend/.env`
   - Find the line: `GITHUB_TOKEN=your_github_token_here`
   - Replace with your token: `GITHUB_TOKEN=ghp_your_actual_token`
   - Save the file

---

## 🧪 Step 3: Test the AI Agent

After adding your GitHub token, test if it works:

```bash
cd backend
node test-agent.js
```

**Expected Output:**
```
🧪 Testing AI Agent...

Test 1: Basic emergency question
✅ Response received:
[AI provides choking first-aid instructions]

---

Test 2: Telugu language test
✅ Telugu response received:
[AI responds in Telugu]

---

✅ All tests passed! AI agent is working correctly.

🎉 You can now start the backend server with: npm run dev
```

---

## 🚀 Step 4: Start the Backend Server

Once the test passes:

```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected
✓ Server running on port 3000
✓ Server accessible at http://localhost:3000
```

---

## 🧪 Step 5: Test the Chatbot API

In a new terminal, test the chat endpoint:

```bash
curl -X POST http://localhost:3000/api/agents/chat -H "Content-Type: application/json" -d "{\"message\": \"Someone is choking, what do I do?\", \"history\": []}"
```

**Expected Response:**
```json
{
  "reply": "Call 108 immediately. Perform Heimlich maneuver: Stand behind them, make a fist above navel, thrust inward and upward sharply. Repeat until object dislodges.",
  "detectedInputLang": {"code": "en-IN", "name": "English"},
  "replyLang": {"code": "en-IN", "name": "English"},
  "emergencyTriggered": true
}
```

---

## 📱 Step 6: Test the Mobile App

1. **Start Mobile App**
   ```bash
   cd mobile
   npm start
   ```

2. **Open App** on your device/emulator

3. **Test Chatbot**
   - Look for blue floating button (bottom-right)
   - Tap the button
   - Type: "Someone is bleeding heavily"
   - You should get first-aid instructions!

---

## 🎯 What Works Now

With just the GitHub token, you have:

✅ **Layer 1: AI Guidance Chatbot** - Fully working!
- First-aid instructions
- Emergency assessment
- Multi-language support
- Emergency detection

---

## 🔧 Optional: Add Twilio for Full Features

To enable Layer 2 (AI Calling) and Layer 3 (SMS), you'll need Twilio:

### Get Twilio Account (Optional)

1. **Sign Up**
   - Visit: https://www.twilio.com/try-twilio
   - Get $15 free trial credit

2. **Get Credentials**
   - From Twilio Console:
     - Copy Account SID
     - Copy Auth Token
   - Buy a phone number with Voice & SMS

3. **Setup Ngrok**
   - Download: https://ngrok.com/download
   - Run: `ngrok http 3000`
   - Copy HTTPS URL

4. **Update .env**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   PUBLIC_URL=https://abc123.ngrok.io
   ```

5. **Test AI Calling**
   ```bash
   curl -X POST http://localhost:3000/api/agents/call \
     -H "Content-Type: application/json" \
     -d '{
       "to": "+917330873455",
       "situation": "Person fell and is injured",
       "context": "Emergency contact"
     }'
   ```

---

## 🐛 Troubleshooting

### Issue: "GITHUB_TOKEN is not defined"

**Solution:**
1. Make sure you added the token to `backend/.env`
2. Token should start with `ghp_`
3. No quotes needed around the token
4. Restart the server after adding token

### Issue: "Invalid token" or "401 Unauthorized"

**Solution:**
1. Generate a new token
2. Make sure you selected `repo` and `read:org` permissions
3. Copy the entire token (starts with `ghp_`)
4. Update `.env` file

### Issue: Test script fails

**Solution:**
1. Check internet connection
2. Verify token is correct
3. Try generating a new token
4. Check if GitHub is accessible

### Issue: MongoDB connection error

**Solution:**
Your MongoDB connection string is already in `.env`, so this should work. If not:
1. Check MongoDB Atlas is accessible
2. Verify connection string is correct
3. Check IP whitelist in MongoDB Atlas

---

## 📊 Current Status

### ✅ Completed
- Dependencies installed
- Package.json updated
- .env file configured (needs GitHub token)
- Test script created

### 🔧 Next Steps
1. Get GitHub token
2. Add to .env file
3. Run test script
4. Start backend server
5. Test chatbot

### 📋 Optional (Later)
- Add Twilio for AI calling
- Add Twilio for SMS alerts
- Deploy to production

---

## 📚 Documentation

For more details, see:
- **QUICK_START.md** - Quick setup guide
- **TESTING_GUIDE.md** - Complete testing procedures
- **AGENTS_INTEGRATION_GUIDE.md** - Full integration guide

---

## 🎯 Summary

**What you need right now:**
1. GitHub token (free, takes 2 minutes)
2. Add to .env file
3. Run test script
4. Start server
5. Test chatbot

**That's it! The chatbot will be fully working!**

Twilio is optional and only needed for AI calling and SMS features.

---

## 💡 Quick Commands

```bash
# 1. Get GitHub token from: https://github.com/settings/tokens
# 2. Add to backend/.env

# 3. Test AI agent
cd backend
node test-agent.js

# 4. Start backend
npm run dev

# 5. Test chatbot (in new terminal)
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Someone is choking\", \"history\": []}"

# 6. Start mobile app (in new terminal)
cd mobile
npm start
```

---

**You're almost there! Just need the GitHub token and you're ready to go!** 🚀
