var dates = [];

function loadDatesFromLocalStorage() {
    dates = JSON.parse(localStorage.getItem('dates'));
    if (dates === null) {
        dates = [];
    }

    loadDatesOnPage();
}

function saveDateToLocalStorage() {
    localStorage.setItem('dates', JSON.stringify(dates));
}

function loadDatesOnPage() {
    var datesList = document.getElementById('dates-list');
    datesList.innerHTML = '';

    if (dates.length === 0) {
        datesList.innerHTML = `
            <li id="without-dates">
                <p>&lt;Sem datas cadastradas&gt;</p>
            </li>
            `;
    } else {
        for (var i = 0; i < dates.length; i++) {
            var currentDate = moment();
            var date = moment(`${dates[i].date} ${dates[i].time}`, 'YYYY-MM-DD HH:mm');

            let startDate, endDate;

            if (currentDate.isBefore(date)) {
                startDate = currentDate.clone();
                endDate = date.clone();
            } else {
                startDate = date.clone();
                endDate = currentDate.clone();
            }

            const yearsDiff = endDate.diff(startDate, 'years');
            startDate.add(yearsDiff, 'years');

            const monthsDiff = endDate.diff(startDate, 'months');
            startDate.add(monthsDiff, 'months');

            const daysDiff = endDate.diff(startDate, 'days');
            startDate.add(daysDiff, 'days');

            const hoursDiff = endDate.diff(startDate, 'hours');
            startDate.add(hoursDiff, 'hours');

            const minutesDiff = endDate.diff(startDate, 'minutes');
            startDate.add(minutesDiff, 'minutes');

            const secondsDiff = endDate.diff(startDate, 'seconds');

            const dateTitle = dates[i].title;

            datesList.innerHTML += `
                <li class="date-item">
                    <ul class="date-item-actions">
                        <li>
                            <button onclick="resetDate(${i})">
                                <ion-icon name="refresh-outline"></ion-icon>
                            </button>
                        </li>
                        <li>
                            <button onclick="updateDateTitle(${i})">
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                            <button onclick="deleteDate(${i})">
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </li>
                    </ul>
                    <div class="date-item-header">
                        <h2>${dateTitle}</h2>
                        <span>(${date.format('DD')}/${date.format('MM')}/${date.format('YYYY')} ${date.format('HH:mm')})</span>
                    </div>
                    <div class="date-item-content-container">
                        <ul>
                            <li>
                                <span>Anos</span>
                                <span>${yearsDiff}</span>
                            </li>
                            <li>
                                <span>Meses</span>
                                <span>${monthsDiff}</span>
                            </li>
                            <li>
                                <span>Dias</span>
                                <span>${daysDiff}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span>Horas</span>
                                <span>${hoursDiff}</span>
                            </li>
                            <li>
                                <span>Minutos</span>
                                <span>${minutesDiff}</span>
                            </li>
                            <li>
                                <span>Segundos</span>
                                <span>${secondsDiff}</span>
                            </li>
                        </ul>
                    </div>
                </li>
            `;
        }
    }
}

function createDate(newDate) {
    dates.push(newDate);
    saveDateToLocalStorage();
    loadDatesOnPage();
}

function updateDateTitle(index) {
    var date = dates[index];
    var newDateTitle = prompt('Digite o novo título da data', date.title).trim();

    const dateTitles = dates.map(date => date.title);

    if (newDateTitle == date.title || newDateTitle === null) {
        return;
    } else if (newDateTitle === '') {
        alert('Por favor, insira um título válido.');
        return;
    } else if (dateTitles.includes(newDateTitle)) {
        alert('Já existe uma data cadastrada com este título!');
        return;
    }

    dates[index].title = newDateTitle;
    saveDateToLocalStorage();
    loadDatesOnPage();
}

function resetDate(index) {
    var date = dates[index];
    if (confirm(`Deseja realmente resetar a data "${date.title}" para a data atual?`)) {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        dates[index].date = `${year}-${month}-${day}`;
        dates[index].time = `${hours}:${minutes}`;

        saveDateToLocalStorage();
        loadDatesOnPage();
    }
}

function deleteDate(index) {
    var date = dates[index];
    if (confirm(`Deseja realmente excluir a data "${date.title}"?`)) {
        dates.splice(index, 1);
        saveDateToLocalStorage();
        loadDatesOnPage();
    }
}

function sendForm() {
    var dateTitleInput = document.getElementById('date-title-input');
    var dateInput = document.getElementById('date-input');
    var timeInput = document.getElementById('time-input');

    var dateTitle = dateTitleInput.value.trim();
    var date = dateInput.value;
    var time = timeInput.value;

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês é zero-indexado
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    dateTitleInput.value = '';
    dateInput.value = `${year}-${month}-${day}`;
    timeInput.value = `${hours}:${minutes}`;

    const dateTitles = dates.map(date => date.title);

    if (dateTitle === '') {
        alert('Por favor, insira um título válido.');
        return;
    } else if (dateTitles.includes(dateTitle)) {
        alert('Já existe uma data cadastrada com este título!');
        return;
    }

    var newDate = {
        title: dateTitle,
        date: date,
        time: time
    }

    createDate(newDate);
}

setInterval(loadDatesOnPage, 1000);