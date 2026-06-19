Promise.all([
  fetch("league-summary.json").then(response => response.json()),
  fetch("all-seasons.json").then(response => response.json())
])
  .then(([summaryData, seasonsData]) => {
    const allTimeTeams = summaryData.teams;
    const allSeasonRows = seasonsData.seasons;

    const sortedAllTime = [...allTimeTeams].sort(
      (a, b) => b.totalWins - a.totalWins || b.totalPointsFor - a.totalPointsFor
    );

    const allTimeHtml = sortedAllTime
      .map(team => `
        <li>
          <strong>${team.name}</strong> —
          ${team.totalWins}-${team.totalLosses}-${team.totalTies}
          | ${team.totalPointsFor.toFixed(1)} PF
          | ${team.seasons} seasons
        </li>
      `)
      .join("");

    document.getElementById("allTimeStandings").innerHTML = `<ol>${allTimeHtml}</ol>`;

    const ctx = document.getElementById("allTimeChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedAllTime.map(team => team.name),
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
            ticks: { color: "white" }
          },
          y: {
            ticks: { color: "white" }
          }
        }
      }
    });

    const yearSelect = document.getElementById("yearSelect");
    const yearStandings = document.getElementById("yearStandings");

    const years = [...new Set(allSeasonRows.map(row => row.year))].sort((a, b) => b - a);

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
            <strong>${team.name}</strong> —
            ${team.wins}-${team.losses}-${team.ties}
            | ${team.pointsFor.toFixed(1)} PF
            | ${team.pointsAgainst.toFixed(1)} PA
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
    }
  })
  .catch(error => {
    document.getElementById("allTimeStandings").innerHTML = "Could not load league history.";
    document.getElementById("yearStandings").innerHTML = "Could not load league history.";
    console.error(error);
  });
