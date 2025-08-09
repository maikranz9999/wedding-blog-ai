// api/claude.js - Vercel API Route für Claude Integration

export default async function handler(req, res) {
    // CORS Headers setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Preflight OPTIONS Request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Nur POST Requests erlauben
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, type = 'general' } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Prompt is required and must be a string' });
        }

        // API Key aus Environment Variables
        const apiKey = process.env.ANTHROPIC_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'API Key nicht konfiguriert. Bitte ANTHROPIC_API_KEY in Vercel Environment Variables hinzufügen.' 
            });
        }

        // Optimierte Prompts basierend auf Typ
        const systemPrompts = {
            'title-optimization': 'Du bist ein SEO-Experte für Hochzeitsblogs. Optimiere den gegebenen Titel für bessere Suchmaschinenrankings, halte ihn unter 60 Zeichen und mache ihn ansprechend für Hochzeitspaare.',
            
            'outline-generation': 'Du bist ein Experte für Hochzeitsplanung und Content-Erstellung. Erstelle eine strukturierte HTML-Gliederung mit H2 und H3-Tags für einen informativen Hochzeitsblog.',
            
            'full-blog-generation': 'Du bist ein professioneller Hochzeits-Blogger. Schreibe einen vollständigen, informativen und SEO-optimierten Blogbeitrag in HTML-Format.',
            
            'content-generation': 'Du bist ein Hochzeitsexperte. Erstelle einen informativen Textabschnitt für den gegebenen Bereich eines Hochzeitsblogs.',
            
            'text-improvement': 'Du bist ein Texteditor für Hochzeitsblogs. Verbessere den gegebenen Text basierend auf den Anweisungen.',
            
            'content-regeneration': 'Du bist ein kreativer Hochzeits-Content-Writer. Erstelle eine alternative Version des Textes mit frischen Ideen.',
            
            'general': 'Du bist ein hilfreicher Assistent für Hochzeitsplanung und Content-Erstellung.'
        };

        const systemPrompt = systemPrompts[type] || systemPrompts['general'];

        // Claude API Aufruf
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                temperature: 0.7,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Claude API Error:', errorData);
            
            if (response.status === 401) {
                return res.status(500).json({ 
                    error: 'Ungültiger API-Schlüssel. Bitte überprüfe deinen ANTHROPIC_API_KEY.' 
                });
            }
            
            if (response.status === 429) {
                return res.status(500).json({ 
                    error: 'Rate Limit erreicht. Bitte versuche es in ein paar Minuten erneut.' 
                });
            }
            
            return res.status(500).json({ 
                error: `Claude API Fehler: ${response.status} - ${errorData.error?.message || 'Unbekannter Fehler'}` 
            });
        }

        const data = await response.json();
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            return res.status(500).json({ 
                error: 'Unerwartete API-Antwort von Claude' 
            });
        }

        const content = data.content[0].text;

        // Erfolgreiche Antwort
        res.status(200).json({ 
            content: content,
            type: type,
            usage: data.usage || null
        });

    } catch (error) {
        console.error('API Route Error:', error);
        
        res.status(500).json({ 
            error: `Server-Fehler: ${error.message}` 
        });
    }
}
