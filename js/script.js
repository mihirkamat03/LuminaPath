document.getElementById('analyzeBtn').addEventListener('click', () => {
    const btn = document.getElementById('analyzeBtn');
    const btnText = document.getElementById('btnText');
    const resultPanel = document.getElementById('geminiResult');
    
    // 1. Get User Input
    const origin = document.getElementById('origin').value.trim();
    const dest = document.getElementById('dest').value.trim();
    const combinedText = (origin + " " + dest).toLowerCase();

    // 2. UI Loading Animation (The "Fake" Wait)
    btnText.innerText = "Connecting to Satellite...";
    btn.style.opacity = "0.7";
    btn.style.cursor = "wait";
    resultPanel.style.display = "none";

    // 3. Fake "Processing" Steps
    setTimeout(() => {
        btnText.innerText = "Analyzing Street Light Density...";
    }, 1000);

    setTimeout(() => {
        btnText.innerText = "Querying Crime Database...";
    }, 2000);

    setTimeout(() => {
        // 4. "Client-Side AI" Logic
        // This generates different answers based on what you typed!
        
        let score = "0%";
        let visibility = "NA";
        let summary = "Unable to analyze route.";
        let details = "No data available for the provided locations.";

        // LOGIC: Check for keywords to change the story
        if (combinedText.includes("alley") || combinedText.includes("lane") || combinedText.includes("slum")) {
            score = "45%";
            visibility = "Low";
            summary = "⚠️ High Risk: Avoid this route at night.";
            details = "Analysis detects narrow passages with broken streetlights. Historical data suggests high isolation risks.";
        } 
        else if (combinedText.includes("station") || combinedText.includes("market") || combinedText.includes("road")) {
            score = "92%";
            visibility = "High";
            summary = "✅ Safe Route: High visibility area.";
            details = "Route passes through active commercial zones (24/7 shops). Police patrol reported near the station entrance.";
        }
        else if (combinedText.includes("college") || combinedText.includes("school") || combinedText.includes("campus")) {
            score = "96%";
            visibility = "Medium";
            summary = "✅ Safe Zone: Student area.";
            details = "This area has active security guards and high pedestrian density. Very safe for solo walking.";
        }
        else if (combinedText.includes("park") || combinedText.includes("garden")) {
            score = "60%";
            visibility = "Low";
            summary = "⚠️ Caution: Park is unlit after 10 PM.";
            details = "Perimeter lighting is adequate, but avoid cutting through the center path due to lack of surveillance.";
        }

        // 5. Update UI with the Generated Data
        document.getElementById('safetyScore').innerText = score;
        document.getElementById('lightScore').innerText = visibility;
        
        // Color code the score
        const scoreVal = parseInt(score);
        if(scoreVal < 60) {
            document.getElementById('safetyScore').style.color = "#FF5252"; // Red
            document.getElementById('safetyScore').style.textShadow = "0 0 10px rgba(255, 82, 82, 0.4)";
        } else {
            document.getElementById('safetyScore').style.color = "#00E5FF"; // Cyan
            document.getElementById('safetyScore').style.textShadow = "0 0 10px rgba(0, 229, 255, 0.4)";
        }

        document.getElementById('aiTitle').innerHTML = `<strong>Recommendation:</strong> ${summary}`;
        document.getElementById('aiDesc').innerText = details;

        // 6. Reveal Result
        resultPanel.style.display = "block";
        btnText.innerText = "Analysis Complete";
        btn.style.background = "#4CAF50"; // Green Success Color
        
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";

    }, 3000); // 3 second total delay for realism
});