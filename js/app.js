// Wedding Blog AI - Hauptlogik
// Globale Variablen
let currentOutline = '';
let currentBlogPost = '';
let isGenerating = false;
let selectedKeywords = [];
let currentEditingContent = null;

// Vordefinierte Keywords für die Hochzeitsbranche
const predefinedKeywords = [
    // Allgemeine Begriffe
    "Hochzeit",
    "Hochzeitsplanung",
    "Hochzeitsideen",
    "Hochzeitsblog",
    "Hochzeitsratgeber",
    "Hochzeitscheckliste",

    // Location & Ort
    "Hochzeitslocation",
    "Standesamt",
    "Kirchliche Trauung",
    "Freie Trauung",
    "Outdoor Hochzeit",
    "Scheunenhochzeit",
    "Strandhochzeit",
    "Destination Wedding",
    "Schloss Hochzeit",
    "Gartenhochzeit",

    // Dienstleister
    "Hochzeitsfotograf",
    "Hochzeitsvideograf",
    "Freier Trauredner",
    "DJ Hochzeit",
    "Hochzeitsband",
    "Hochzeitsplaner",
    "Catering Hochzeit",
    "Hochzeitstorte",
    "Florist Hochzeit",

    // Braut & Bräutigam
    "Brautkleid",
    "Hochzeitsanzug",
    "Brautfrisur",
    "Hochzeitsmakeup",
    "Brautstrauß",
    "Brautjungfern",
    "Trauzeugen",

    // Ablauf & Programm
    "Hochzeitseinladung",
    "Hochzeitsdeko",
    "Hochzeitsfeier",
    "Hochzeitstanz",
    "Sektempfang",
    "Hochzeitsspiele",
    "Hochzeitsrede",
    "Gastgeschenke",

    // Budget & Organisation
    "Hochzeitsbudget",
    "Kosten Hochzeit",
    "Hochzeitskostenplaner",
    "Spartipps Hochzeit",

    // Trends & Stile
    "Vintage Hochzeit",
    "Boho Hochzeit",
    "Winterhochzeit",
    "Sommerhochzeit",
    "Luxushochzeit",
    "Nachhaltige Hochzeit",
    "Moderne Hochzeit"
];

// Demo-Funktionen (da keine echte API verfügbar)
async function mockAPICall(prompt, isOutline = false) {
    // Simuliere API-Aufruf mit realistischer Verzögerung
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    if (isOutline) {
        return generateMockOutline(prompt);
    } else {
        return generateMockContent(prompt);
    }
}

function generateMockOutline(prompt) {
    const outlines = {
        'location': `<h2>Einführung in die Hochzeitslocationsuche</h2>
<h3>Warum die richtige Location so wichtig ist</h3>
<h3>Was macht eine perfekte Hochzeitslocation aus</h3>
<h2>Die verschiedenen Location-Typen</h2>
<h3>Schlösser und Burgen</h3>
<h3>Hotels und Eventlocations</h3>
<h3>Outdoor-Locations und Gärten</h3>
<h3>Vintage und rustikale Locations</h3>
<h3>Moderne Eventlocations</h3>
<h2>Budget und Kostenfaktoren</h2>
<h3>Versteckte Kosten vermeiden</h3>
<h3>Preisverhandlungen erfolgreich führen</h3>
<h2>Besichtigungstermine optimal nutzen</h2>
<h3>Die richtige Vorbereitung</h3>
<h3>Wichtige Fragen an den Veranstalter</h3>
<h2>Vertragsabschluss und Buchung</h2>
<h3>Worauf im Vertrag zu achten ist</h3>
<h3>Stornobedingungen und Versicherung</h3>`,
        
        'planung': `<h2>Die ersten Schritte der Hochzeitsplanung</h2>
<h3>Timeline erstellen</h3>
<h3>Budget festlegen</h3>
<h2>Wichtige Entscheidungen treffen</h2>
<h3>Datum und Saison wählen</h3>
<h3>Gästeliste zusammenstellen</h3>
<h2>Dienstleister finden und buchen</h2>
<h3>Hochzeitsfotograf auswählen</h3>
<h3>Catering und Menü planen</h3>
<h2>Dekoration und Atmosphäre</h2>
<h3>Farbkonzept entwickeln</h3>
<h3>Blumenschmuck und Tischdekorationen</h3>`,
        
        'default': `<h2>Einführung in das Thema</h2>
<h3>Grundlagen verstehen</h3>
<h3>Wichtige Aspekte berücksichtigen</h3>
<h2>Praktische Tipps und Tricks</h2>
<h3>Schritt-für-Schritt Anleitung</h3>
<h3>Häufige Fehler vermeiden</h3>
<h2>Expertenrat und Empfehlungen</h2>
<h3>Bewährte Strategien</h3>
<h3>Zukunftstrends</h3>
<h2>Fazit und Zusammenfassung</h2>
<h3>Die wichtigsten Punkte</h3>
<h3>Nächste Schritte</h3>`
    };
    
    if (prompt.toLowerCase().includes('location')) {
        return outlines.location;
    } else if (prompt.toLowerCase().includes('planung')) {
        return outlines.planung;
    } else {
        return outlines.default;
    }
}

function generateMockContent(prompt) {
    const contents = [
        `<p>Die Auswahl der perfekten Hochzeitslocation ist einer der wichtigsten Schritte bei der Hochzeitsplanung. Sie bestimmt nicht nur das Ambiente eurer Feier, sondern auch maßgeblich euer Budget und die Möglichkeiten für Dekoration, Catering und weitere Details.</p>

<p>Eine durchdachte Locationwahl kann den Unterschied zwischen einer unvergesslichen Traumhochzeit und enttäuschten Erwartungen ausmachen. Dabei spielen viele Faktoren eine Rolle: von der Anzahl der Gäste über das verfügbare Budget bis hin zu euren persönlichen Vorstellungen vom perfekten Hochzeitstag.</p>

<h2>Die verschiedenen Location-Typen</h2>

<h3>Schlösser und Burgen</h3>
<p>Historische Locations wie Schlösser und Burgen bieten eine märchenhafte Kulisse für eure Hochzeit. Die imposante Architektur und die romantische Atmosphäre schaffen unvergessliche Erinnerungen. Allerdings sind diese Locations oft preisintensiver und haben längere Vorlaufzeiten für Buchungen.</p>

<p>Bei der Auswahl solltet ihr bedenken, dass historische Gebäude oft Einschränkungen bezüglich Dekoration und Technik haben. Dafür bieten sie eine einzigartige Atmosphäre, die eure Gäste begeistern wird.</p>

<h3>Hotels und Eventlocations</h3>
<p>Hotels bieten den Vorteil eines Rundum-sorglos-Pakets. Catering, Service und oft auch Übernachtungsmöglichkeiten sind bereits vorhanden. Moderne Eventlocations punkten mit flexiblen Räumlichkeiten und professioneller Ausstattung.</p>

<p>Der große Vorteil liegt in der Erfahrung des Personals und den eingespielten Abläufen. Viele Hotels haben spezielle Hochzeitspakete, die verschiedene Services bündeln und oft günstiger sind als Einzelbuchungen.</p>

<h2>Budget und Kostenfaktoren</h2>

<h3>Versteckte Kosten vermeiden</h3>
<p>Bei der Budgetplanung solltet ihr nicht nur die Grundmiete berücksichtigen. Zusatzkosten für Dekoration, Technik, Parkplätze oder Reinigung können das Budget erheblich belasten. Fragt daher nach einer detaillierten Kostenaufstellung.</p>

<p>Plant etwa 20-30% eures Gesamtbudgets für die Location ein. Bei einer Hochzeit mit 100 Gästen und einem Budget von 15.000 Euro solltet ihr also 3.000-4.500 Euro für die Location kalkulieren.</p>

<h3>Preisverhandlungen erfolgreich führen</h3>
<p>Viele Locations sind bereit zu verhandeln, besonders bei Terminen außerhalb der Hauptsaison oder bei größeren Gesellschaften. Erkundigt euch nach Rabatten für Nebensaison-Termine oder Package-Deals.</p>

<p>Ein professioneller Tip: Fragt nach kostenlosen Zusatzleistungen statt nur nach Preisnachlässen. Oft sind Locations eher bereit, zusätzliche Services zu gewähren als den Grundpreis zu reduzieren.</p>`,

        `<p>Die Hochzeitsplanung kann überwältigend erscheinen, aber mit der richtigen Herangehensweise wird sie zu einem aufregenden Abenteuer. Eine systematische Planung hilft dabei, den Überblick zu behalten und Stress zu vermeiden.</p>

<p>Beginnt mindestens 12-18 Monate vor dem geplanten Hochzeitstermin mit der Planung. So habt ihr genügend Zeit für alle wichtigen Entscheidungen und könnt von besseren Preisen und größerer Auswahl profitieren.</p>

<h2>Die ersten Schritte der Hochzeitsplanung</h2>

<h3>Timeline erstellen</h3>
<p>Eine detaillierte Timeline ist das Fundament einer erfolgreichen Hochzeitsplanung. Arbeitet euch von eurem Wunschtermin rückwärts vor und plant wichtige Meilensteine ein.</p>

<p>Wichtige Termine sind beispielsweise: Location-Buchung (12-18 Monate vorher), Fotografen-Buchung (6-12 Monate), Einladungen versenden (6-8 Wochen vorher) und finale Details besprechen (1 Woche vorher).</p>

<h3>Budget festlegen</h3>
<p>Setzt euch zusammen und bestimmt ein realistisches Gesamtbudget. Berücksichtigt dabei nicht nur die offensichtlichen Kosten, sondern auch kleinere Ausgaben, die sich schnell summieren können.</p>

<p>Eine typische Budgetaufteilung könnte so aussehen: 40-50% für Location und Catering, 15% für Fotograf, 10% für Kleidung, 10% für Dekoration und Blumen, 5% für Musik, 10% für sonstige Ausgaben und 5-10% als Puffer für unvorhergesehene Kosten.</p>`
    ];
    
    return contents[Math.floor(Math.random() * contents.length)];
}

// Tag-System für Keywords
function initKeywordTagSystem() {
    const input = document.getElementById('mainKeyword');
    const dropdown = document.getElementById('keywordDropdown');

    if (!input || !dropdown) return;

    input.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        if (value.length > 0) {
            showKeywordDropdown(value);
        } else {
            showAllKeywords();
        }
    });

    input.addEventListener('click', function(e) {
        const value = e.target.value.trim();
        if (value.length > 0) {
            showKeywordDropdown(value);
        } else {
            showAllKeywords();
        }
    });

    input.addEventListener('focus', function(e) {
        const value = e.target.value.trim();
        if (value.length > 0) {
            showKeywordDropdown(value);
        } else {
            showAllKeywords();
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                addKeyword(value);
                e.target.value = '';
                hideKeywordDropdown();
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tag-input-container') && !e.target.closest('.dropdown')) {
            hideKeywordDropdown();
        }
    });
}

function addKeyword(keywordText) {
    if (!selectedKeywords.includes(keywordText)) {
        selectedKeywords.push(keywordText);
        renderKeywords();
        const input = document.getElementById('mainKeyword');
        if (input) input.value = '';
        hideKeywordDropdown();
    }
}

function removeKeyword(keywordText) {
    selectedKeywords = selectedKeywords.filter(keyword => keyword !== keywordText);
    renderKeywords();
}

function getKeywordsString() {
    return selectedKeywords.join(', ');
}

function showAllKeywords() {
    const dropdown = document.getElementById('keywordDropdown');
    if (!dropdown) return;

    const availableKeywords = predefinedKeywords.filter(keyword => !selectedKeywords.includes(keyword));

    let dropdownHTML = '';
    availableKeywords.slice(0, 10).forEach(keyword => {
        dropdownHTML += `<div class="dropdown-item" onclick="addKeyword('${keyword.replace(/'/g, "\\'")}')">${keyword}</div>`;
    });

    if (dropdownHTML) {
        dropdown.innerHTML = dropdownHTML;
        dropdown.style.display = 'block';
    } else {
        hideKeywordDropdown();
    }
}

function showKeywordDropdown(searchTerm) {
    const dropdown = document.getElementById('keywordDropdown');
    if (!dropdown) return;

    const matches = predefinedKeywords.filter(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedKeywords.includes(keyword)
    );

    let dropdownHTML = '';

    matches.slice(0, 8).forEach(keyword => {
        dropdownHTML += `<div class="dropdown-item" onclick="addKeyword('${keyword.replace(/'/g, "\\'")}')">${keyword}</div>`;
    });

    if (!matches.includes(searchTerm) && !selectedKeywords.includes(searchTerm)) {
        dropdownHTML += `<div class="dropdown-item create-new" onclick="addKeyword('${searchTerm.replace(/'/g, "\\'")}')">\u002B "${searchTerm}" hinzufügen</div>`;
    }

    if (dropdownHTML) {
        dropdown.innerHTML = dropdownHTML;
        dropdown.style.display = 'block';
    } else {
        hideKeywordDropdown();
    }
}

function hideKeywordDropdown() {
    const dropdown = document.getElementById('keywordDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

function renderKeywords() {
    const container = document.getElementById('keywordsDisplay');
    if (!container) return;

    container.innerHTML = '';

    selectedKeywords.forEach(keyword => {
        const pill = document.createElement('div');
        pill.className = 'keyword-pill';
        pill.innerHTML = `
            <span>${keyword}</span>
            <span class="keyword-remove" onclick="removeKeyword('${keyword.replace(/'/g, "\\'")}')">\u00D7</span>
        `;
        container.appendChild(pill);
    });
}

function showPreviewMessage(content) {
    const messages = document.getElementById('messages');
    if (!messages) return;

    const message = document.createElement('div');
    message.className = 'message bot';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content;
    
    message.appendChild(messageContent);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function showBlogPreview(title, content) {
    const messages = document.getElementById('messages');
    if (!messages) return;

    messages.innerHTML = '';

    const blogContainer = document.createElement('div');
    blogContainer.className = 'blog-content';
    
    const meta = document.createElement('div');
    meta.className = 'blog-meta';
    const keywords = getKeywordsString();
    const wordCount = document.getElementById('wordCount')?.value || '1500';
    const tone = document.getElementById('toneStyle')?.value || 'freundlich-beratend';
    
    meta.innerHTML = `
        <strong>📊 Blog-Metadaten:</strong><br>
        Keywords: ${keywords || 'Nicht angegeben'}<br>
        Zielwortanzahl: ${wordCount}<br>
        Stil: ${tone.replace('-', ' & ')}
    `;
    
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    
    const contentElement = document.createElement('div');
    contentElement.innerHTML = content;
    
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-buttons';
    exportContainer.innerHTML = `
        <button class="export-btn" onclick="exportAsHTML()">📄 HTML Export</button>
        <button class="export-btn" onclick="exportAsMarkdown()">📝 Markdown Export</button>
        <button class="export-btn" onclick="copyToClipboard()">📋 Kopieren</button>
        <button class="export-btn" onclick="generateSEOReport()">🔍 SEO-Report</button>
    `;
    
    blogContainer.appendChild(meta);
    blogContainer.appendChild(titleElement);
    blogContainer.appendChild(contentElement);
    blogContainer.appendChild(exportContainer);
    
    messages.appendChild(blogContainer);
    messages.scrollTop = 0;
}

function showTyping() {
    const typing = document.getElementById('typing');
    const messages = document.getElementById('messages');
    if (typing) typing.style.display = 'block';
    if (messages) messages.scrollTop = messages.scrollHeight + 100;
}

function hideTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.style.display = 'none';
}

async function optimizeTitle() {
    const titleInput = document.getElementById('blogTitle');
    if (!titleInput) return;

    const originalTitle = titleInput.value.trim();
    
    if (!originalTitle) {
        alert('Bitte gib zuerst einen Titel ein!');
        return;
    }

    const optimizeBtn = document.getElementById('optimizeTitleBtn');
    if (optimizeBtn) {
        optimizeBtn.classList.add('loading');
        optimizeBtn.disabled = true;
    }

    showTyping();

    try {
        await mockAPICall(`Optimiere diesen Titel: ${originalTitle}`);
        
        // Generiere SEO-optimierten Titel basierend auf Input
        let newTitle = originalTitle;
        if (originalTitle.toLowerCase().includes('hochzeitslocation')) {
            newTitle = "Die 10 besten Tipps für die perfekte Hochzeitslocation 2024";
        } else if (originalTitle.toLowerCase().includes('planung')) {
            newTitle = "Ultimativer Guide: " + originalTitle + " - Schritt für Schritt";
        } else if (originalTitle.toLowerCase().includes('budget')) {
            newTitle = originalTitle + " - Spartipps & Kostenfallen vermeiden";
        } else {
            newTitle = "Ultimativer Guide: " + originalTitle.substring(0, 45) + "...";
        }
        
        titleInput.value = newTitle;
        
        hideTyping();
        showPreviewMessage(`✅ <strong>SEO-optimierter Titel:</strong><br>"${newTitle}"<br><br>💡 <em>Optimiert für: Keyword-Integration, Länge, Klick-Appeal</em>`);
        
    } catch (error) {
        hideTyping();
        showPreviewMessage(`❌ <strong>Fehler bei der Titel-Optimierung:</strong> ${error.message}`);
    } finally {
        if (optimizeBtn) {
            optimizeBtn.classList.remove('loading');
            optimizeBtn.disabled = false;
        }
    }
}

async function generateOutline() {
    const titleInput = document.getElementById('blogTitle');
    const wordCountSelect = document.getElementById('wordCount');
    const toneSelect = document.getElementById('toneStyle');

    if (!titleInput || !wordCountSelect || !toneSelect) return;

    const title = titleInput.value.trim();
    const keywords = getKeywordsString();
    const wordCount = wordCountSelect.value;
    const tone = toneSelect.value;
    
    if (!title) {
        alert('Bitte gib zuerst einen Titel ein!');
        return;
    }

    if (isGenerating) return;
    isGenerating = true;

    const generateBtn = document.getElementById('generateOutlineBtn');
    const generateContentBtn = document.getElementById('generateContentBtn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '⏳ Generiere Gliederung...';
    }

    showTyping();

    try {
        const outline = await mockAPICall(`Erstelle Gliederung für: ${title}`, true);
        
        currentOutline = outline;
        
        const outlineContent = document.getElementById('outlineContent');
        const outlineContainer = document.getElementById('outlineContainer');
        
        if (outlineContent) outlineContent.innerHTML = outline;
        if (outlineContainer) outlineContainer.classList.add('visible');
        if (generateContentBtn) generateContentBtn.style.display = 'block';
        
        setTimeout(() => {
            addHeadingActions();
        }, 100);
        
        hideTyping();
        showPreviewMessage('✅ <strong>Gliederung erfolgreich erstellt!</strong><br><br>📋 Die H2 und H3-Struktur wurde automatisch generiert und ist SEO-optimiert.<br><br>💡 <em>Klicke auf "Vollständigen Blog generieren" oder hovere über Überschriften für individuelle Bearbeitung!</em>');
        
    } catch (error) {
        hideTyping();
        showPreviewMessage(`❌ <strong>Fehler bei der Gliederung-Generierung:</strong> ${error.message}`);
    } finally {
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '🪄 Gliederung generieren';
        }
        isGenerating = false;
    }
}

async function generateFullBlog() {
    const titleInput = document.getElementById('blogTitle');
    const wordCountSelect = document.getElementById('wordCount');
    const toneSelect = document.getElementById('toneStyle');
    const outlineContent = document.getElementById('outlineContent');

    if (!titleInput || !wordCountSelect || !toneSelect || !outlineContent) return;

    const title = titleInput.value.trim();
    const keywords = getKeywordsString();
    const wordCount = wordCountSelect.value;
    const tone = toneSelect.value;
    const outline = outlineContent.innerHTML;
    
    if (!title || !outline) {
        alert('Bitte erstelle zuerst eine Gliederung!');
        return;
    }

    if (isGenerating) return;
    isGenerating = true;

    const generateBtn = document.getElementById('generateContentBtn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '⏳ Generiere vollständigen Blog...';
    }

    showTyping();

    try {
        const content = await mockAPICall(`Schreibe Blog für: ${title}`);
        
        currentBlogPost = content;
        
        hideTyping();
        showBlogPreview(title, content);
        
    } catch (error) {
        hideTyping();
        showPreviewMessage(`❌ <strong>Fehler bei der Blog-Generierung:</strong> ${error.message}`);
    } finally {
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '✨ Vollständigen Blog generieren';
        }
        isGenerating = false;
    }
}

function addHeadingActions() {
    const outlineContent = document.getElementById('outlineContent');
    if (!outlineContent) return;

    const headings = outlineContent.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
        const existingActions = heading.querySelector('.heading-actions');
        if (existingActions) {
            existingActions.remove();
        }

        const actions = document.createElement('div');
        actions.className = 'heading-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit';
        editBtn.innerHTML = '✎';
        editBtn.title = 'Bearbeiten';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editHeading(heading);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Löschen';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHeading(heading);
        };

        const generateBtn = document.createElement('button');
        generateBtn.className = 'action-btn generate';
        generateBtn.innerHTML = '✦';
        generateBtn.title = 'Text generieren';
        generateBtn.onclick = (e) => {
            e.stopPropagation();
            generateContentForHeading(heading);
        };

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(generateBtn);
        heading.appendChild(actions);
    });
}

function editHeading(heading) {
    const actionsElement = heading.querySelector('.heading-actions');
    
    let currentText = heading.textContent.trim();
    if (actionsElement) {
        const actionsText = actionsElement.textContent.trim();
        currentText = currentText.replace(actionsText, '').trim();
    }
    
    const originalActions = actionsElement ? actionsElement.cloneNode(true) : null;
    
    if (actionsElement) {
        actionsElement.remove();
    }
    
    const input = document.createElement('input');
    input.className = 'heading-edit-input';
    input.type = 'text';
    input.value = currentText;
    
    heading.innerHTML = '';
    heading.appendChild(input);
    
    input.focus();
    input.select();
    
    let isHandled = false;
    
    function saveEdit() {
        if (isHandled) return;
        isHandled = true;
        
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            heading.textContent = newText;
            if (originalActions) {
                heading.appendChild(originalActions);
                reattachEventListeners(heading);
            }
        } else if (newText === currentText) {
            heading.textContent = currentText;
            if (originalActions) {
                heading.appendChild(originalActions);
                reattachEventListeners(heading);
            }
        } else {
            heading.textContent = currentText;
            if (originalActions) {
                heading.appendChild(originalActions);
                reattachEventListeners(heading);
            }
            showPreviewMessage('❌ Überschrift-Änderung abgebrochen (leerer Text)');
        }
    }
    
    function cancelEdit() {
        if (isHandled) return;
        isHandled = true;
        
        heading.textContent = currentText;
        if (originalActions) {
            heading.appendChild(originalActions);
            reattachEventListeners(heading);
        }
    }
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
    
    input.addEventListener('blur', saveEdit);
}

function reattachEventListeners(heading) {
    const actions = heading.querySelector('.heading-actions');
    if (!actions) return;
    
    const editBtn = actions.querySelector('.edit');
    const deleteBtn = actions.querySelector('.delete');
    const generateBtn = actions.querySelector('.generate');
    
    if (editBtn) {
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editHeading(heading);
        };
    }
    
    if (deleteBtn) {
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHeading(heading);
        };
    }
    
    if (generateBtn) {
        generateBtn.onclick = (e) => {
            e.stopPropagation();
            generateContentForHeading(heading);
        };
    }
}

function deleteHeading(heading) {
    const actionsElement = heading.querySelector('.heading-actions');
    let headingText = heading.textContent.trim();
    
    if (actionsElement) {
        const actionsText = actionsElement.textContent.trim();
        headingText = headingText.replace(actionsText, '').trim();
    }
    
    const isH2 = heading.tagName === 'H2';
    
    if (!confirm(`Möchtest du "${headingText}" wirklich löschen?${isH2 ? '\n\n(Alle untergeordneten H3-Überschriften werden mitgelöscht)' : ''}`)) {
        return;
    }
    
    try {
        const outlineContent = document.getElementById('outlineContent');
        if (!outlineContent || !outlineContent.contains(heading)) {
            return;
        }
        
        if (isH2) {
            let currentElement = heading;
            const elementsToDelete = [heading];
            
            while (currentElement.nextElementSibling) {
                const nextElement = currentElement.nextElementSibling;
                
                if (nextElement.tagName === 'H3' || nextElement.classList.contains('generated-content')) {
                    elementsToDelete.push(nextElement);
                }
                
                currentElement = nextElement;
            }
            
            elementsToDelete.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
            
        } else {
            const elementsToDelete = [heading];
            
            let nextElement = heading.nextElementSibling;
            while (nextElement && nextElement.classList.contains('generated-content')) {
                elementsToDelete.push(nextElement);
                nextElement = nextElement.nextElementSibling;
            }
            
            elementsToDelete.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
        
    } catch (error) {
        showPreviewMessage(`❌ Fehler beim Löschen: ${error.message}`);
    }
}

async function generateContentForHeading(heading) {
    const headingText = heading.textContent.trim();
    const headingLevel = heading.tagName;
    const isH2 = headingLevel === 'H2';
    
    const outlineContent = document.getElementById('outlineContent');
    const allElements = Array.from(outlineContent.children);
    const headingIndex = allElements.indexOf(heading);
    
    let hasSubHeadings = false;
    if (isH2) {
        for (let i = headingIndex + 1; i < allElements.length; i++) {
            const element = allElements[i];
            if (element.tagName === 'H2') break;
            if (element.tagName === 'H3') {
                hasSubHeadings = true;
                break;
            }
        }
    }
    
    const generateBtn = heading.querySelector('.action-btn.generate');
    if (generateBtn) {
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;
    }
    
    showTyping();
    
    try {
        await mockAPICall(`Generiere Content für: ${headingText}`);
        
        const demoContent = hasSubHeadings ? 
            `Dieser Abschnitt führt in das wichtige Thema "${headingText}" ein und gibt einen Überblick über die folgenden Unterkapitel. Es ist wichtig, diese Grundlagen zu verstehen, bevor wir in die Details einsteigen.` :
            `Dies ist ein ausführlicher Absatz zum Thema "${headingText}". Hier würde normalerweise der vollständige, SEO-optimierte Content stehen, der durch die KI generiert wurde. Der Text enthält wertvolle Informationen, praktische Tipps und ist im gewählten Stil verfasst. Zusätzlich werden relevante Keywords natürlich eingebunden, um die Suchmaschinenoptimierung zu unterstützen.`;
        
        hideTyping();
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'generated-content';
        contentDiv.innerHTML = `<p>${demoContent}</p>`;
        
        heading.insertAdjacentElement('afterend', contentDiv);
        
        // Füge Content-Actions hinzu
        addContentActions(contentDiv);
        
        const contentType = hasSubHeadings ? 'Einleitungstext' : 'Vollständiger Abschnitt';
        showPreviewMessage(`✅ ${contentType} erfolgreich generiert für "${headingText}"`);
        
    } catch (error) {
        hideTyping();
        showPreviewMessage(`❌ <strong>Fehler bei der Content-Generierung:</strong> ${error.message}`);
    } finally {
        if (generateBtn) {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }
}

function addContentActions(contentDiv) {
    const actions = document.createElement('div');
    actions.className = 'content-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.innerHTML = '✎';
    editBtn.title = 'Text bearbeiten';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        editContent(contentDiv);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Löschen';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteContent(contentDiv);
    };

    const regenerateBtn = document.createElement('button');
    regenerateBtn.className = 'action-btn magic';
    regenerateBtn.innerHTML = '🔄';
    regenerateBtn.title = 'Neu generieren';
    regenerateBtn.onclick = (e) => {
        e.stopPropagation();
        regenerateContent(contentDiv);
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(regenerateBtn);
    contentDiv.appendChild(actions);
}

function editContent(contentDiv) {
    const currentText = contentDiv.querySelector('p').textContent;
    const textarea = document.createElement('textarea');
    textarea.value = currentText;
    textarea.style.width = '100%';
    textarea.style.minHeight = '80px';
    textarea.style.background = 'rgba(0, 0, 0, 0.5)';
    textarea.style.border = '1px solid #7209b7';
    textarea.style.borderRadius = '4px';
    textarea.style.color = 'white';
    textarea.style.padding = '8px';
    textarea.style.fontFamily = 'inherit';
    textarea.style.fontSize = 'inherit';
    textarea.style.outline = 'none';
    
    contentDiv.innerHTML = '';
    contentDiv.appendChild(textarea);
    textarea.focus();
    
    function saveEdit() {
        const newText = textarea.value.trim();
        if (newText) {
            contentDiv.innerHTML = `<p>${newText}</p>`;
            addContentActions(contentDiv);
        } else {
            deleteContent(contentDiv);
        }
    }
    
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            contentDiv.innerHTML = `<p>${currentText}</p>`;
            addContentActions(contentDiv);
        }
    });
    
    textarea.addEventListener('blur', saveEdit);
}

function deleteContent(contentDiv) {
    if (confirm('Möchtest du diesen generierten Content wirklich löschen?')) {
        contentDiv.remove();
    }
}

async function regenerateContent(contentDiv) {
    const regenerateBtn = contentDiv.querySelector('.action-btn.magic');
    if (regenerateBtn) {
        regenerateBtn.classList.add('loading');
        regenerateBtn.disabled = true;
    }
    
    showTyping();
    
    try {
        await mockAPICall('Regeneriere Content');
        
        const newContent = `Dies ist ein neu generierter Absatz mit anderem Inhalt und Fokus. Der Text wurde komplett überarbeitet und bietet eine frische Perspektive auf das Thema. Hier finden sich neue Aspekte und Informationen, die vorher nicht erwähnt wurden.`;
        
        hideTyping();
        
        const currentActions = contentDiv.querySelector('.content-actions');
        if (currentActions) currentActions.remove();
        
        contentDiv.innerHTML = `<p>${newContent}</p>`;
        addContentActions(contentDiv);
        
        showPreviewMessage('✅ Content erfolgreich neu generiert!');
        
    } catch (error) {
        hideTyping();
        showPreviewMessage(`❌ <strong>Fehler bei der Neu-Generierung:</strong> ${error.message}`);
    } finally {
        if (regenerateBtn) {
            regenerateBtn.classList.remove('loading');
            regenerateBtn.disabled = false;
        }
    }
}

function exportAsHTML() {
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) {
        showPreviewMessage('❌ Kein Blog-Content zum Exportieren gefunden!');
        return;
    }

    const content = blogContent.cloneNode(true);
    // Entferne Export-Buttons vom Export
    const exportButtons = content.querySelector('.export-buttons');
    if (exportButtons) exportButtons.remove();
    
    const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hochzeitsblog Export</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #ff6b35; }
        h2 { color: #ff6b35; border-left: 4px solid #ff6b35; padding-left: 12px; }
        h3 { color: #20c997; border-left: 3px solid #20c997; padding-left: 12px; margin-left: 20px; }
        p { line-height: 1.6; margin-bottom: 16px; }
        .blog-meta { background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    ${content.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-blog-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showPreviewMessage('📄 HTML-Export erfolgreich!');
}

function exportAsMarkdown() {
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) {
        showPreviewMessage('❌ Kein Blog-Content zum Exportieren gefunden!');
        return;
    }

    const title = blogContent.querySelector('h1')?.textContent || 'Unbenannter Blog';
    const meta = blogContent.querySelector('.blog-meta')?.textContent || '';
    
    let content = blogContent.innerHTML;
    content = content.replace(/<div class="blog-meta">.*?<\/div>/s, '');
    content = content.replace(/<div class="export-buttons">.*?<\/div>/s, '');
    content = content.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n');
    content = content.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n');
    content = content.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n');
    content = content.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n');
    content = content.replace(/<[^>]*>/g, '');
    content = content.replace(/\n{3,}/g, '\n\n');
    
    const markdownContent = `# ${title}\n\n${meta ? meta + '\n\n' : ''}${content}`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-blog-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showPreviewMessage('📝 Markdown-Export erfolgreich!');
}

function copyToClipboard() {
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) {
        showPreviewMessage('❌ Kein Blog-Content zum Kopieren gefunden!');
        return;
    }

    const content = blogContent.innerText;
    navigator.clipboard.writeText(content).then(() => {
        showPreviewMessage('📋 Blogbeitrag in Zwischenablage kopiert!');
    }).catch(() => {
        showPreviewMessage('❌ Fehler beim Kopieren in die Zwischenablage!');
    });
}

function generateSEOReport() {
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) {
        showPreviewMessage('❌ Kein Blog-Content für SEO-Analyse gefunden!');
        return;
    }

    const title = blogContent.querySelector('h1')?.textContent || '';
    const h2Count = blogContent.querySelectorAll('h2').length;
    const h3Count = blogContent.querySelectorAll('h3').length;
    const paragraphs = blogContent.querySelectorAll('p').length;
    const wordCount = blogContent.innerText.split(' ').length;
    
    const seoReport = `
        <div style="background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.3); border-radius: 8px; padding: 16px; margin: 12px 0;">
            <h4 style="color: #28a745; margin-bottom: 12px;">🔍 SEO-Analyse Report</h4>
            <p style="margin: 8px 0;"><strong>Titel-Länge:</strong> ${title.length < 60 ? '✅' : '⚠️'} ${title.length} Zeichen ${title.length < 60 ? '(optimal)' : '(zu lang)'}</p>
            <p style="margin: 8px 0;"><strong>Wortanzahl:</strong> ${wordCount > 300 ? '✅' : '⚠️'} ${wordCount} Wörter ${wordCount > 300 ? '(gut)' : '(zu kurz)'}</p>
            <p style="margin: 8px 0;"><strong>H2-Struktur:</strong> ${h2Count > 2 ? '✅' : '⚠️'} ${h2Count} H2-Überschriften ${h2Count > 2 ? '(gut strukturiert)' : '(mehr H2s empfohlen)'}</p>
            <p style="margin: 8px 0;"><strong>H3-Struktur:</strong> ${h3Count > 3 ? '✅' : '⚠️'} ${h3Count} H3-Überschriften gefunden</p>
            <p style="margin: 8px 0;"><strong>Absätze:</strong> ${paragraphs > 5 ? '✅' : '⚠️'} ${paragraphs} Absätze ${paragraphs > 5 ? '(gute Lesbarkeit)' : '(mehr Absätze empfohlen)'}</p>
            <p style="margin: 8px 0;"><strong>Keywords:</strong> ${selectedKeywords.length > 2 ? '✅' : '⚠️'} ${selectedKeywords.length} Keywords definiert</p>
            <p style="margin: 8px 0;"><strong>Meta-Description:</strong> ✅ Automatisch generiert</p>
            <p style="margin: 8px 0;"><strong>Gesamtscore:</strong> <span style="color: #28a745; font-weight: bold;">${Math.min(95, 60 + (h2Count * 5) + (h3Count * 2) + (paragraphs * 2))}/100</span></p>
        </div>
    `;
    showPreviewMessage(seoReport);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    initKeywordTagSystem();
    
    setTimeout(() => {
        showPreviewMessage("🎯 <strong>Wedding Blog AI ist bereit!</strong><br><br>Beginne mit der Eingabe deines Blog-Titels und klicke auf den Zauberstab für SEO-Optimierung. Anschließend kannst du eine strukturierte Gliederung generieren lassen.<br><br>💡 <em>Tipp: Nutze aussagekräftige Keywords für bessere SEO-Ergebnisse!</em>");
    }, 1000);

    // Enter-Taste für Titel-Input
    const titleInput = document.getElementById('blogTitle');
    if (titleInput) {
        titleInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                optimizeTitle();
            }
        });
    }
});'H2') {
                    break;
                }
                
                if (nextElement.tagName ===
