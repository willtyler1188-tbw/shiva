const teams = [
  { name: "Team A", wins: 8, losses: 2, points: 1450 },
  { name: "Team B", wins: 7, losses: 3, points: 1390 },
  { name: "Team C", wins: 6, losses: 4, points: 1345 },
  { name: "Team D", wins: 4, losses: 6, points: 1200 }
];

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
        labels: {
          color: "white"
        }
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
