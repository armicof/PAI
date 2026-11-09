const express = require('express');
const app = express();

const FLAG = "PAI26{pr0xy_m4tch_r3pl4c3_win}";

app.get('/', (req, res) => {
    // Check for internal IP header (e.g. X-Forwarded-For or X-Client-IP)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const isInternal = clientIp && clientIp.startsWith('10.0.0.');

    res.send(`
        <html>
            <head><title>Internal Operations Portal</title></head>
            <body style="font-family: Arial; margin: 40px; background: #f4f6f8; color: #333;">
                <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2>Internal Operations Portal 🏢</h2>
                    <p>Current Detected IP: <strong>${clientIp}</strong></p>
                    
                    ${isInternal ? `
                        <div style="background: #dcfce7; color: #166534; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <h4>🎉 Internal Access Granted!</h4>
                            <p style="font-family: monospace; font-size: 16px; margin: 0;"><strong>Flag:</strong> ${FLAG}</p>
                        </div>
                    ` : `
                        <div style="background: #fee2e2; color: #991b1b; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <h4>❌ Access Denied</h4>
                            <p style="margin: 0 0 10px 0;">This application is restricted to the internal corporate network (IP range: <code>10.0.0.x</code>).</p>
                        </div>
                        <p style="margin-top: 20px; color: #666; font-size: 14px;"><em>Hint: Applications often trust proxy headers like <code>X-Forwarded-For</code> to determine client origin. Can you configure Burp Suite's Match and Replace feature to automatically inject this header?</em></p>
                    `}
                </div>
            </body>
        </html>
    `);
});

app.listen(3002);