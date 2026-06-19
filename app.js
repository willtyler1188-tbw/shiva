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
          <strong>${team.managerName}</strong><br>
          ${team.totalWins}-${team.totalLosses}-${team.totalTies} record •
          ${Number(team.totalPointsFor || 0).toFixed(1)} points for •
          ${team.seasons} seasons
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
          backgroundColor: "rgba(56, 189, 248, 0.75)",
          borderColor: "rgba(125, 211, 252, 1)",
          borderWidth: 1.5,
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#e2e8f0" }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#cbd5e1",
              maxRotation: 0,
              minRotation: 0
            },
            grid: {
              color: "rgba(255,255,255,0.05)"
            }
          },
          y: {
            ticks: {
              color: "#cbd5e1"
            },
            grid: {
              color: "rgba(255,255,255,0.08)"
            }
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
            <strong>${team.managerName}</strong><br>
            <span>${team.teamName}</span><br>
            ${team.wins}-${team.losses}-${team.ties} record •
            ${Number(team.pointsFor || 0).toFixed(1)} PF •
            ${Number(team.pointsAgainst || 0).toFixed(1)} PA •
            Final Rank: ${team.finalRank ?? "N/A"}
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
