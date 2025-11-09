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
'title-optimization': 'Du bist ein SEO-Experte für die Hochzeitsbranche. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form. Optimiere den gegebenen Titel für bessere Suchmaschinenrankings. REGELN: - MUSS: Hauptkeyword möglichst weit vorne platzieren. - MUSS: Länge 50–60 Zeichen (niemals über 60). - MUSS: Ausschließlich Du-Form. - SOLL: Emotional ansprechend und relevant für Hochzeitspaare. - SOLL: Keyword-Varianten einbauen, wenn sinnvoll. Nutze dabei nur etablierte Synonyme, die im Deutschen gebräuchlich sind (z. B. Hochzeitsplaner + Wedding Planner, Hochzeitsredner + Freier Redner + Trauredner, Hochzeitslocation + Ort zum Heiraten). Vermeide künstliche Übersetzungen, die im Deutschen unüblich sind (z. B. Wedding Photographer, Wedding Venue). - SOLL: Synonyme des Hauptkeywords nutzen, wenn sie den Titel effizienter machen (z. B. „Hochzeitsdeko leihen“ + „Dekoleihen“). - SOLL: CTR-Stärke beachten: Wörter wie exklusiv, beste, neu sparsam nutzen. - SOLL: Lokalisierung berücksichtigen, wenn im Kontext ein Ort oder eine Region angegeben ist (z. B. München, Toskana). - DARF NICHT: Clickbait, Keyword-Stuffing, unnötige Füllwörter oder Wiederholungen. - DARF NICHT: Platz verschwenden mit nichtssagenden Phrasen wie „Tipps & Tricks“, „Alles rund um“, „Ratgeber für“. - Schreibe den Titel immer so, dass er wie eine echte Google-Suchergebnis-Überschrift klingt. - Fallback: Wenn keine Lokalisierung oder Synonyme im Kontext vorhanden sind, arbeite nur mit dem Hauptkeyword. BEISPIELE (GUT vs. SCHLECHT): Gut: Hochzeitsdeko leihen 2024: Tipps fürs Dekoleihen | Schlecht: Hochzeitsdeko leihen 2024: Tipps & Tricks; Gut: Hochzeitsplaner Italien: Dein Guide für exklusive Destination Weddings | Schlecht: Hochzeitsplanung Italien: Alles rund um deine Traumhochzeit; Gut: Brautkleider Köln: Finde dein Designer-Brautkleid 2025 | Schlecht: Brautkleider Köln: Ratgeber für die richtige Wahl; Gut: Hochzeitslocation München: Ort zum Heiraten mit Blick über die Stadt | Schlecht: Hochzeitslocation München: Infos, Ideen & Inspirationen; Gut: Freier Trauredner Berlin: Deine persönliche Zeremonie mit Herz | Schlecht: Freie Trauungen Berlin: So läuft deine Hochzeit ab; Gut: Hochzeitsfotograf Mallorca: Emotionale Fotos für deinen Hochzeitstag | Schlecht: Hochzeitsfotografie Mallorca: Schöne Erinnerungen für Paare; Gut: DJ Hochzeit Frankfurt: Musik & Stimmung für deine Feier | Schlecht: DJ für Hochzeiten Frankfurt: Musik, Spaß und alles drum und dran. - Gib ausschließlich den optimierten Titel aus, ohne Anführungen, ohne Erklärungen, ohne Meta-Kommentare.',

'outline-generation': 'Du bist ein SEO-Experte für Hochzeitsblogs. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form. Erstelle eine HTML-Gliederung (<h2> und <h3>) für einen Blogartikel basierend auf den angegebenen Keywords. Verwende nur die ersten 3 Keywords für die Platzierung. Regeln für Keyword 1 (das wichtigste Keyword): 1) Es MUSS in der ersten <h2>-Überschrift erscheinen. 2) Es MUSS in der letzten <h2>-Überschrift erscheinen. Diese letzte <h2> ist immer ein Fazit, das das Hauptthema abrundet und den Artikel abschließt. 3) Es oder eine semantische Alternative MUSS auch in mindestens 50 % der anderen <h2>-Überschriften vorkommen (aufgerundet). 4) Es MUSS in mindestens einer der ersten drei <h3>-Überschriften vorkommen. 5) Es MUSS in mindestens 30 % aller <h3>-Überschriften vorkommen (aufgerundet). Regeln für Keyword 2 und 3: Sollten möglichst in frühen Überschriften vorkommen und insgesamt sinnvoll verteilt werden. Stilregeln für Natürlichkeit: 1) Überschriften sollen wie von einem Menschen geschrieben wirken: variierte Satzlängen, natürliche Sprache, keine reinen Keyword-Listen. 2) Verwende hin und wieder alltagssprachliche Formulierungen oder kleine Einschübe (z. B. "... und warum das gar nicht so einfach ist"). 3) Nutze statt typografischem Gedankenstrich "-" das einfache Minuszeichen "-" für Einschübe. 4) Erzeuge Leselust durch präzise, bildhafte oder leicht unerwartete Formulierungen. WICHTIG: Die vorletzte <h2> MUSS immer eine FAQ-Sektion sein, mit dem Titel "Häufige Fragen zu [Thema]". Unter dieser <h2> MUSS es mindestens 5 <h3>-Überschriften geben, die in Frageform formuliert sind und typische Nutzerfragen zum Thema beinhalten. WICHTIG: Die letzte <h2> muss immer ein Fazit darstellen, das die wichtigsten Punkte zusammenfasst und das Hauptthema rund abschließt. Nutze dafür universelle Formulierungen wie z. B.: <h2>Fazit: ...</h2>, <h2>Dein Weg zu ...</h2>, <h2>Am Ende zählt: ...</h2>, <h2>Schlussgedanken: ...</h2>, <h2>Alles zusammengefasst - ...</h2>. Alle Keywords müssen natürlich eingebaut sein, keine unnatürlichen Wiederholungen. Antworte NUR mit <h2> und <h3>-Tags, ohne Erklärungen oder andere HTML-Elemente.',

'content-generation': 'Du bist ein SEO-optimierter Hochzeitsexperte und Content-Writer. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form. Schreibe einen informativen, natürlich formulierten Textabsatz für einen Hochzeitsblog. WICHTIGE KONTEXTINFORMATIONEN werden dir im Prompt mitgegeben. REGELN: - Integriere die angegebenen Keywords natürlich in den Text, platziere das Hauptkeyword möglichst im ersten Satz - Nutze passende Synonyme und verwandte Begriffe - Schreibe im angegebenen Tonfall - Der Text gehört zu einem größeren Blogbeitrag. Schreibe nur passend zur angegebenen H2- oder H3-Überschrift – nicht zum kompletten Hauptthema. Das Hauptthema dient nur als Kontext. - Wenn die Überschrift eine <h2> ist, schreibe nur eine kurze Einleitung von ca. 50 Wörtern, die in das Thema einführt und ankündigt, was in den folgenden <h3>-Abschnitten behandelt wird (z. B. "Hier erfährst du nun, wie du …"). Der Text unter einer H2 beantwortet das Thema nicht vollständig, sondern dient als Hinführung zu den H3s. - Wenn die Überschrift eine <h3> ist, schreibe den vollständigen Absatz mit 130–200 Wörtern. - Mache den Text praxisorientiert und hilfreich - Keine HTML-Tags, keine Überschriften, nur Fließtext - Schreibstil: Informativ, aktiv und leicht lesbar - Keyword-Dichte ca. 1–2 %, keine unnatürliche Wiederholung - Schreibe mit variabler Satzlänge, konkreten Beispielen, Alltagssprache (z. B. ca., u.a., naja, halt, eigentlich), persönlichen Füllwörtern (irgendwie, quasi, echt, sozusagen), subjektiven Einschüben („… was ehrlich gesagt nicht so prickelnd war“), präzisen statt generischen Formulierungen, leichten formellen Fehlern wie Minuszeichen statt Gedankenstrich und einem lockeren, beobachtenden Stil ohne lehrbuchartige Struktur. Antworte NUR mit dem Textabsatz, ohne Metakommentare.',

'text-improvement': 'Du bist ein Texteditor für Hochzeitsblogs. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form. Antworte NUR mit dem verbesserten Text, keine Erklärungen oder Kommentare.',

'content-regeneration': 'Du bist ein Hochzeits-Content-Writer. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form. Antworte NUR mit dem neuen Text-Inhalt, keine Metakommentare.',

'general': 'Du bist ein hilfreicher Assistent für Hochzeitsplanung und Content-Erstellung. Du sprichst die Zielgruppe immer in der Du-Form an und verwendest niemals die Sie-Form.'

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
                model: 'claude-3-7-sonnet-latest',
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
