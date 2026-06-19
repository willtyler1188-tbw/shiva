Promise.all([
  fetch("league-summary.json").then(response => response.json()),
  fetch("all-seasons.json").then(response => response.json())
])
  .then(([summaryData, seasonsData]) => {
    const allTimeStandings = document.getElementById("allTimeStandings");
    const allTimeChart = document.getElementById("allTimeChart");
    const yearSelect = document.getElementById("yearSelect");
    const yearStandings = document.getElementById("yearStandings");

    if (!allTimeStandings || !allTimeChart || !yearSelect || !yearStandings) {
      throw new Error("One or more HTML elements are missing.");
    }

    const allTimeTeams = summaryData.teams || [];
    const allSeasonRows = seasonsData.seasons || [];

    const sortedAllTime = [...allTimeTeams].sort(
      (a, b) => b.totalWins - a.totalWins || b.totalPointsFor - a.totalPointsFor
    );

    const allTimeHtml = sortedAllTime
      .map(team => `
        <li>
          <strong>${team.managerName}</strong> —
          ${team.totalWins}-${team.totalLosses}-${team.totalTies}
          | ${Number(team.totalPointsFor || 0).toFixed(1)} PF
          | ${team.seasons} seasons
        </li>
      `)
      .join("");

    allTimeStandings.innerHTML = `<ol>${allTimeHtml}</ol>`;

    new Chart(allTimeChart, {
      type: "bar",
      data: {
        labels: sortedAllTime.map(team => team.managerName),
        datasets: [{
          label: "All-Time Points For",
          data: sortedAllTime.map(team => team.totalPointsFor),
          backgroundColor: "#3b82f6"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "white" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#d1d5db" },
            grid: { color: "rgba(255,255,255,0.08)" }
          },
          y: {
            ticks: { color: "#d1d5db" },
            grid: { color: "rgba(255,255,255,0.08)" }
          }
        }
      }
    });

    const years = [...new Set(allSeasonRows.map(row => row.year))].sort((a, b) => b - a);

    yearSelect.innerHTML = "";
    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    function renderYear(year) {
      const teamsForYear = allSeasonRows
        .filter(row => row.year === Number(year))
        .sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor);

      const html = teamsForYear
        .map(team => `
          <li>
            <strong>${team.managerName}</strong> (${team.teamName}) —
            ${team.wins}-${team.losses}-${team.ties}
            | ${Number(team.pointsFor || 0).toFixed(1)} PF
            | ${Number(team.pointsAgainst || 0).toFixed(1)} PA
            | Final Rank: ${team.finalRank ?? "N/A"}
          </li>
        `)
        .join("");

      yearStandings.innerHTML = `<ol>${html}</ol>`;
    }

    yearSelect.addEventListener("change", e => {
      renderYear(e.target.value);
    });

    if (years.length > 0) {
      yearSelect.value = years[0];
      renderYear(years[0]);
    } else {
      yearStandings.innerHTML = "No yearly data found.";
    }
  })
  .catch(error => {
    console.error(error);

    const allTimeStandings = document.getElementById("allTimeStandings");
    const yearStandings = document.getElementById("yearStandings");

    if (allTimeStandings) {
      allTimeStandings.innerHTML = "Could not load league history.";
    }

    if (yearStandings) {
      yearStandings.innerHTML = "Could not load league history.";
    }
  });
