// api/claude.js - Vercel API Route mit verbesserten Prompts

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

        // Verbesserte Prompts - präzise und ohne Erklärungen
        const systemPrompts = {
         'title-optimization': 'Du bist ein SEO-Experte für die Hochzeitsbranche. Optimiere den gegebenen Titel für bessere Suchmaschinenrankings. REGELN: - Hauptkeyword möglichst weit vorne platzieren. - Länge: 50–60 Zeichen (niemals über 60). - Emotional ansprechend und relevant für Hochzeitspaare. - Zahlen und spezifische Begriffe einbauen, wenn sinnvoll. - Clickbait vermeiden, aber Neugier wecken. - Keine Füllwörter oder unnötigen Zeichen. - Verwende, wenn passend, das Format: [Keyword(s)]: [Aufruf]. - Aufruf-Beispiele: Der ultimative Guide für XXXXX / Inspiration & Tipps für eure Hochzeit am Strand! / Das sind die schönsten Spots an der Nord- und Ostsee / Alles was ihr für eure Hochzeit wissen müsst! / Das sind die 6 schönsten Orte für eure Sylt-Hochzeit. Gib NUR den optimierten Titel aus, ohne Erklärungen oder Zusatztexte.',

       'outline-generation': 'Du bist ein SEO-Experte für Hochzeitsblogs. Erstelle eine HTML-Gliederung (<h2> und <h3>) für einen Blogartikel basierend auf den angegebenen Keywords. Verwende nur die ersten 3 Keywords für die Platzierung. Das erste Keyword ist das wichtigste: Es MUSS in der ersten <h2>-Überschrift vorkommen und in mindestens einer der ersten drei <h3>-Überschriften erscheinen. Das zweite und dritte Keyword sollen, wenn möglich, in frühen Überschriften vorkommen. Verteile alle Keywords sinnvoll über die Gliederung, ohne sie unnatürlich zu wiederholen. Antworte NUR mit <h2> und <h3>-Tags, keine Erklärungen oder anderen HTML-Elemente.',

            'full-blog-generation': 'Du bist ein Hochzeits-Blogger. Schreibe NUR den Blogbeitrag-Content in HTML mit <p>, <h2>, <h3> Tags. Keine Metakommentare oder Erklärungen.',
            
            'content-generation': 'Du bist ein Hochzeitsexperte. Schreibe NUR einen informativen Textabsatz ohne HTML-Tags. Keine Einleitung, keine Erklärung.',
            
            'text-improvement': 'Du bist ein Texteditor für Hochzeitsblogs. Antworte NUR mit dem verbesserten Text, keine Erklärungen oder Kommentare.',
            
            'content-regeneration': 'Du bist ein Hochzeits-Content-Writer. Antworte NUR mit dem neuen Text-Inhalt, keine Metakommentare.',
            
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

        let content = data.content[0].text;

        // Zusätzliche Bereinigung für bestimmte Typen
        if (type === 'title-optimization') {
            // Entferne Anführungszeichen und trimme
            content = content.replace(/^["']|["']$/g, '').trim();
            
            // Falls Claude doch Erklärungen hinzufügt, nimm nur die erste Zeile
            const lines = content.split('\n');
            content = lines[0].trim();
            
            // Entferne "Titel:" oder ähnliche Präfixe
            content = content.replace(/^(Titel|Optimiert|Neu|Verbesserter Titel):\s*/i, '');
        }

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
