const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Store votes independently for each session token
const sessionVotes = {};
const UI_LIMIT = 1;          // Button disappears after this many browser clicks
const TARGET_VOTES = 20;     // Total required to unlock the flag (must use Burp Repeater!)
const FLAG = "PAI26{r3p34t_4nd_w1n_s1Rr}";

app.get('/', (req, res) => {
    // Check if the user already has a session cookie; if not, issue a new one
    let token = req.cookies.session_token;
    if (!token || !sessionVotes.hasOwnProperty(token)) {
        token = 'user_' + Math.random().toString(36).substring(2, 11);
        res.cookie('session_token', token, { httpOnly: true });
        sessionVotes[token] = 0;
    }

    const currentVotes = sessionVotes[token];

    res.send(`
        <html>
            <head><title>Pet Voting Portal</title></head>
            <body style="font-family: Arial; margin: 40px; background: #f4f6f8; color: #333;">
                <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2>Office Pet Voting Portal 🐾</h2>
                    <p>Help us choose the office mascot! You are allocated 5 official clicks on the portal.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <h3>Your Voting Status:</h3>
                    <p>Votes Registered: <strong>${currentVotes}</strong> / ${TARGET_VOTES}</p>

                    ${currentVotes < UI_LIMIT ? `
                        <form action="/vote" method="GET">
                            <button type="submit" style="background: #2563eb; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;">Cast Vote for Cat</button>
                        </form>
                    ` : currentVotes < TARGET_VOTES ? `
                        <p style="color: #d97706; font-weight: bold;">⚠️ You have exhausted your 1 portal clicks and the voting button has vanished!</p>
                    ` : ``}

                    ${currentVotes >= TARGET_VOTES ? `
                        <div style="margin-top: 20px; background: #dcfce7; color: #166534; padding: 15px; border-radius: 5px;">
                            <h4>🎉 Target Reached! Here is your flag:</h4>
                            <p style="font-family: monospace; font-size: 16px;"><strong>${FLAG}</strong></p>
                        </div>
                    ` : ``}
                </div>
            </body>
        </html>
    `);
});

// Voting endpoint
app.get('/vote', (req, res) => {
    const token = req.cookies.session_token;
    if (!token || sessionVotes[token] === undefined) {
        return res.redirect('/');
    }

    if (sessionVotes[token] < TARGET_VOTES) {
        sessionVotes[token]++;
    }

    res.redirect('/');
});

app.listen(58731);
