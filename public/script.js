document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('searchInput');
  let allTalks = [];

  const renderSchedule = (talks) => {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date('2026-01-01T10:00:00');

    talks.forEach((talk, index) => {
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

      const talkElement = document.createElement('div');
      talkElement.classList.add('talk');

      talkElement.innerHTML = `
        <div class="talk-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <h2 class="talk-title">${talk.title}</h2>
        <div class="talk-speakers">${talk.speakers.join(', ')}</div>
        <div class="talk-category">
          ${talk.category.map(c => `<span>${c}</span>`).join('')}
        </div>
        <p>${talk.description}</p>
      `;
      scheduleContainer.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

      if (index === 2) {
        const lunchBreak = document.createElement('div');
        lunchBreak.classList.add('break');
        lunchBreak.innerHTML = 'Lunch Break';
        scheduleContainer.appendChild(lunchBreak);
        currentTime = new Date(currentTime.getTime() + 60 * 60000); // 1 hour lunch break
      }
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      allTalks = data;
      renderSchedule(allTalks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = allTalks.filter(talk => {
      return talk.category.some(c => c.toLowerCase().includes(searchTerm));
    });
    renderSchedule(filteredTalks);
  });
});
