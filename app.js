fetch("league-data.json")
  .then(response => response.json())
  .then(data => {
    const teams = data.teams;

    const standingsHtml = teams
      .sort((a, b) => b.wins - a.wins || b.points - a.points)
      .map(team => `<li>${team.name} - ${team.wins}-${team.losses} - ${team.points} pts</li>`)
      .join("");

    document.getElementById("standings").innerHTML = `<ol>${standingsHtml}</ol>`;

    const ctx = document.getElementById("pointsChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: teams.map(team => team.name),
        datasets: [{
          label: "Points",
          data: teams.map(team => team.points),
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
  })
  .catch(error => {
    document.getElementById("standings").innerHTML = "Could not load league data.";
    console.error(error);
  });
