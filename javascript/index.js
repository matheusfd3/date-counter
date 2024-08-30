let userDates = [];

function loadUserDatesFromLocalStorage() {
    userDates = JSON.parse(localStorage.getItem('userDates'));

    if (userDates === null) {
        userDates = [];
    }

    loadUserDatesOnPage();
}

function saveUserDatesToLocalStorage() {
    localStorage.setItem('userDates', JSON.stringify(userDates));
}

function loadUserDatesOnPage() {
    const dateListDOM = document.getElementById('date-list');
    dateListDOM.innerHTML = '';

    if (userDates.length === 0) {
        dateListDOM.innerHTML = `
            <li id="without-dates">
                <p>&lt;Sem datas cadastradas&gt;</p>
            </li>
            `;
    } else {
        for (let i = 0; i < userDates.length; i++) {
            const userDate = userDates[i];

            const selectedDate = moment(`${userDate.selectedDate}`, 'YYYY-MM-DD HH:mm');
            const currentDate = moment();

            let startDate, endDate, classNameLi;

            if (currentDate.isBefore(selectedDate)) {
                startDate = currentDate.clone();
                endDate = selectedDate.clone();
                classNameLi = 'pulse-red';
                
            } else {
                startDate = selectedDate.clone();
                endDate = currentDate.clone();
                classNameLi = 'pulse-green';
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

            dateListDOM.innerHTML += `
                <li class="date-item ${classNameLi}">
                    <ul class="date-item-actions">
                        <li>
                            <button onclick="resetUserDate(${i})">
                                <ion-icon name="refresh-outline"></ion-icon>
                            </button>
                            ${userDate.history.length > 0 ? `
                                <button onclick="openUserDateHistoryModal(${i})">
                                    <ion-icon name="calendar-outline"></ion-icon>
                                </button>`
                            : ''}
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
                        <span>(${selectedDate.format('DD/MM/YYYY HH:mm')})</span>
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

function createUserDate(newUserDate) {
    userDates.push(newUserDate);
    saveUserDatesToLocalStorage();
    loadUserDatesOnPage();
}

function updateUserDateTitle(index) {
    const userDate = userDates[index];
    const newUserDateTitle = prompt('Digite um novo título para a data:', userDate.title).trim();

    const userDateTitles = userDates.map(userDate => userDate.title);

    if (newUserDateTitle == userDate.title || newUserDateTitle === null) {
        return;
    } else if (newUserDateTitle === '') {
        alert('Por favor, insira um título válido.');
        return;
    } else if (userDateTitles.includes(newUserDateTitle)) {
        alert('Já existe uma data cadastrada com este título!');
        return;
    }

    userDates[index].title = newUserDateTitle;
    saveUserDatesToLocalStorage();
    loadUserDatesOnPage();
}

function resetUserDate(index) {
    const userDate = userDates[index];

    if (confirm(`Deseja realmente resetar a data "${userDate.title}"?`)) {
        const selectedDate = moment(`${userDate.selectedDate}`, 'YYYY-MM-DD HH:mm');
        const currentDate = moment();

        let startDate, startDateBackup, endDate;

        if (currentDate.isBefore(selectedDate)) {
            startDateBackup = currentDate.clone();
            startDate = currentDate.clone();
            endDate = selectedDate.clone();
        } else {
            startDateBackup = selectedDate.clone();
            startDate = selectedDate.clone();
            endDate = currentDate.clone();
        }

        if (endDate.diff(startDate, 'seconds') < 60) {
            alert('Você só pode resetar datas com pelo menos 1 minuto!');
            return;
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

        const newUserDateHistory = {
            startDate: startDateBackup.format('YYYY-MM-DD HH:mm'),
            endDate: endDate.format('YYYY-MM-DD HH:mm'),
            years: yearsDiff,
            months: monthsDiff,
            days: daysDiff,
            hours: hoursDiff,
            minutes: minutesDiff
        }

        userDates[index].selectedDate = currentDate.format('YYYY-MM-DD HH:mm');
        userDates[index].history.push(newUserDateHistory);

        saveUserDatesToLocalStorage();
        loadUserDatesOnPage();
    }
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
    const dateTitleInput = document.getElementById('date-title-input');
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');

    const dateTitle = dateTitleInput.value.trim();
    const userDateTitles = userDates.map(userDate => userDate.title);

    if (dateTitle === '') {
        alert('Por favor, insira um título válido.');
        return;
    } else if (userDateTitles.includes(dateTitle)) {
        alert('Já existe uma data cadastrada com este título!');
        return;
    }

    const selectedDate = `${dateInput.value} ${timeInput.value}`;
    const currentDate = moment();

    dateTitleInput.value = '';
    dateInput.value = currentDate.format('YYYY-MM-DD');
    timeInput.value = '00:00';

    const newUserDate = {
        title: dateTitle,
        selectedDate: selectedDate,
        history: []
    }

    createUserDate(newUserDate);
}

setInterval(loadUserDatesOnPage, 1000);