let userDates = [];

function loadUserDatesFromLocalStorage() {
  userDates = JSON.parse(localStorage.getItem("userDates"));

  if (userDates === null) {
    userDates = [];
  }

  loadUserDatesOnPage();
}

function saveUserDatesToLocalStorage() {
  localStorage.setItem("userDates", JSON.stringify(userDates));
}

// Função auxiliar para calcular a diferença com precisão
function getPreciseDiff(start, end) {
  const clone = start.clone();

  const years = end.diff(clone, "years");
  clone.add(years, "years");

  const months = end.diff(clone, "months");
  clone.add(months, "months");

  const days = end.diff(clone, "days");
  clone.add(days, "days");

  const hours = end.diff(clone, "hours");
  clone.add(hours, "hours");

  const minutes = end.diff(clone, "minutes");
  clone.add(minutes, "minutes");

  const seconds = end.diff(clone, "seconds");

  return { years, months, days, hours, minutes, seconds };
}

function loadUserDatesOnPage() {
  const dateListDOM = document.getElementById("date-list");
  const now = moment();

  // Nenhuma data cadastrada
  if (!userDates || userDates.length === 0) {
    dateListDOM.innerHTML = `
      <li id="without-dates">
        <p>&lt;Sem datas cadastradas&gt;</p>
      </li>
    `;
    return;
  }

  // Ordenar por proximidade ao momento atual
  userDates.sort((a, b) => {
    const diffA = Math.abs(moment(a.selectedDate).valueOf() - now.valueOf());
    const diffB = Math.abs(moment(b.selectedDate).valueOf() - now.valueOf());
    return diffA - diffB;
  });

  // Montagem dos itens
  const dateListContent = userDates
    .map((userDate, i) => {
      const selectedDate = moment(userDate.selectedDate, "YYYY-MM-DD HH:mm");
      const isFuture = now.isBefore(selectedDate);

      const [startDate, endDate] = isFuture
        ? [now.clone(), selectedDate.clone()]
        : [selectedDate.clone(), now.clone()];

      const classNameLi = isFuture ? "pulse-red" : "pulse-green";
      const { years, months, days, hours, minutes, seconds } = getPreciseDiff(
        startDate,
        endDate
      );

      const historyButton = userDate.history.length
        ? `
        <button onclick="openUserDateHistoryModal(${i})">
          <ion-icon name="calendar-outline"></ion-icon>
        </button>
      `
        : "";

      return `
        <li class="date-item ${classNameLi}">
          <ul class="date-item-actions">
            <li>
              <button onclick="resetUserDate(${i})">
                <ion-icon name="refresh-outline"></ion-icon>
              </button>
              ${historyButton}
            </li>
            <li>
              <button onclick="updateUserDateTitle(${i})">
                <ion-icon name="create-outline"></ion-icon>
              </button>
              <button onclick="deleteUserDate(${i})">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </li>
          </ul>
          <div class="date-item-header">
            <h2>${userDate.title}</h2>
            <span>(${selectedDate.format("DD/MM/YYYY HH:mm")})</span>
          </div>
          <div class="date-item-content-container">
            <ul>
              <li><span>Anos</span><span>${years}</span></li>
              <li><span>Meses</span><span>${months}</span></li>
              <li><span>Dias</span><span>${days}</span></li>
            </ul>
            <ul>
              <li><span>Horas</span><span>${hours}</span></li>
              <li><span>Minutos</span><span>${minutes}</span></li>
              <li><span>Segundos</span><span>${seconds}</span></li>
            </ul>
          </div>
        </li>
      `;
    })
    .join("");

  // Atualiza o DOM de uma vez
  dateListDOM.innerHTML = dateListContent;
}

function createUserDate(newUserDate) {
  userDates.push(newUserDate);
  saveUserDatesToLocalStorage();
  loadUserDatesOnPage();
}

function updateUserDateTitle(index) {
  const userDate = userDates[index];
  const newUserDateTitle = prompt(
    "Digite um novo título para a data:",
    userDate.title
  ).trim();

  const userDateTitles = userDates.map((userDate) => userDate.title);

  if (newUserDateTitle == userDate.title || newUserDateTitle === null) {
    return;
  } else if (newUserDateTitle === "") {
    alert("Por favor, insira um título válido.");
    return;
  } else if (userDateTitles.includes(newUserDateTitle)) {
    alert("Já existe uma data cadastrada com este título!");
    return;
  }

  userDate.title = newUserDateTitle;
  saveUserDatesToLocalStorage();
  loadUserDatesOnPage();
}

function resetUserDate(index) {
  const userDate = userDates[index];

  if (!confirm(`Deseja realmente resetar a data "${userDate.title}"?`)) return;

  const selectedDate = moment(userDate.selectedDate, "YYYY-MM-DD HH:mm");
  const currentDate = moment();

  const startDate = moment.min(selectedDate, currentDate);
  const endDate = moment.max(selectedDate, currentDate);

  if (moment.duration(endDate.diff(startDate)).asMinutes() < 1) {
    alert("Você só pode resetar datas com pelo menos 1 minuto!");
    return;
  }

  const { years, months, days, hours, minutes } = getPreciseDiff(
    startDate,
    endDate
  );

  const newUserDateHistory = {
    startDate: startDate.format("YYYY-MM-DD HH:mm"),
    endDate: endDate.format("YYYY-MM-DD HH:mm"),
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
  };

  userDate.selectedDate = currentDate.format("YYYY-MM-DD HH:mm");
  userDate.history.push(newUserDateHistory);

  saveUserDatesToLocalStorage();
  loadUserDatesOnPage();
}

function deleteUserDate(index) {
  const userDate = userDates[index];
  if (confirm(`Deseja realmente excluir a data "${userDate.title}"?`)) {
    userDates.splice(index, 1);
    saveUserDatesToLocalStorage();
    loadUserDatesOnPage();
  }
}

function sendForm() {
  const dateTitleInput = document.getElementById("date-title-input");
  const dateTimeInput = document.getElementById("date-time-input");

  const dateTitle = dateTitleInput.value.trim();
  const userDateTitles = userDates.map((userDate) => userDate.title);

  if (dateTitle === "") {
    alert("Por favor, insira um título válido.");
    return;
  } else if (userDateTitles.includes(dateTitle)) {
    alert("Já existe uma data cadastrada com este título!");
    return;
  }

  const selectedDate = dateTimeInput.value.replace("T", " ");
  const currentDate = moment();

  dateTitleInput.value = "";
  dateTimeInput.value = currentDate.format("YYYY-MM-DDT00:00");

  const newUserDate = {
    title: dateTitle,
    selectedDate: selectedDate,
    history: [],
  };

  createUserDate(newUserDate);
}

setInterval(loadUserDatesOnPage, 1000);
