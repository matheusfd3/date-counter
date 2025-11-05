function closeUserDateHistoryModal() {
  document.getElementById("modal-container").style.display = "none";
}

function openUserDateHistoryModal(index) {
  const tableBodyDOM = document.getElementById("modal-table-body");

  const userDate = userDates[index];
  const userDateHistory = userDate.history;

  document.getElementById(
    "modal-title"
  ).innerText = `Histórico de "${userDate.title}"`;

  let tableBodyContent = "";

  userDateHistory.forEach((history) => {
    const startDate = moment(history.startDate, "YYYY-MM-DD HH:mm");
    const endDate = moment(history.endDate, "YYYY-MM-DD HH:mm");

    tableBodyContent += `
      <tr>
        <td>${startDate.format("DD/MM/YYYY HH:mm")}</td>
        <td>${endDate.format("DD/MM/YYYY HH:mm")}</td>
        <td>${history.years}</td>
        <td>${history.months}</td>
        <td>${history.days}</td>
        <td>${history.hours}</td>
        <td>${history.minutes}</td>
      </tr>
    `;
  });

  tableBodyDOM.innerHTML = tableBodyContent;
  document.getElementById("modal-container").style.display = "flex";
}
