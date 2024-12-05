// Example JavaScript for Calendar (you can extend this functionality as needed)
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Sample Event',
                start: '2024-12-01',
                description: 'This is a sample event'
            }
        ]
    });

    calendar.render();
});
