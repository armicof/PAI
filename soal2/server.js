const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const FLAG = "PAI26{intrud3r_fuzz1ng_m4st3r}";

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>System Maintenance Portal</title></head>
            <body style="font-family: Arial; margin: 40px; background: #f4f6f8; color: #333;">
                <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2>System Maintenance Portal</h2>
                    <p>Status: <strong>Normal Operations</strong></p>
                    <p>Administrative debug panels are restricted to internal development personnel.</p>

                    <form action="/check" method="POST" style="margin-top: 20px;">
                        <input type="hidden" name="user" value="guest" />
                        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Check System Status</button>
                    </form>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;"><em>Hint: Developers frequently leave undocumented debug or bypass parameters in requests. Can you use Burp Intruder to fuzz parameter names?</em></p>
                </div>
            </body>
        </html>
    `);
});

app.post('/check', (req, res) => {
    // Vulnerability: The backend checks for a secret hidden parameter name ('dev_mode')
    // Players must use Burp Intruder to fuzz parameter names (e.g. §param§=true)
    const isDebugActive = req.body.dev_mode === 'true' || req.query.dev_mode === 'true';

    if (isDebugActive) {
        res.send(`
            <html>
                <body style="font-family: Arial; margin: 40px; background: #f0fdf4;">
                    <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #166534;">🎉 Debug Mode Activated!</h2>
                        <p>Internal maintenance diagnostics successfully unlocked.</p>
                        <div style="background: #dcfce7; color: #166534; padding: 15px; border-radius: 5px; margin-top: 15px;">
                            <p style="font-family: monospace; font-size: 16px; margin: 0;"><strong>Flag:</strong> ${FLAG}</p>
                        </div>
                        <br/><a href="/">Back to Home</a>
                    </div>
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <body style="font-family: Arial; margin: 40px;">
                    <h2>Access Denied</h2>
                    <p>Standard user privileges. No debug flags detected in the request.</p>
                    <br/><a href="/">Back to Home</a>
                </body>
            </html>
        `);
    }
});

app.listen(3001);
