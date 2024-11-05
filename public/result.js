document.addEventListener('DOMContentLoaded', () => {
    const eventSelect = document.getElementById('eventSelect');
    const categorySelect = document.getElementById('categorySelect');
    const resultsChart = document.getElementById('resultsChart').getContext('2d');
    const noResultsText = document.getElementById('noResults');
    const noCategoriesText = document.getElementById('noCategories'); // Element for no categories message

    let chart;
    let events = [];
    let categories = [];
    let nominees = [];
    let voteData = [];

    categorySelect.style.display = 'none';  // Initially hide the categories dropdown

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    async function loadEvents() {
        const data = await fetchData('/api/events');
        if (data) {
            events = data;
            eventSelect.innerHTML = '<option value="">*Select Event*</option>';
            events.forEach(event => {
                eventSelect.innerHTML += `<option value="${event.id}">${event.name}</option>`;
            });
        }
    }

    async function loadCategories(eventId) {
        const selectedEvent = events.find(event => event.id === eventId); // Direct string comparison
        console.log(selectedEvent)
        const data = await fetchData(`/api/category/${eventId}/`);
        
        if (data && data.length > 0) {
            categories = data;
            categorySelect.innerHTML = '<option value="">*Select Category*</option>';
            categories.forEach(category => {
                categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
            categorySelect.style.display = 'block';  // Show categories dropdown if categories are available
            noCategoriesText.style.display = 'none'; // Hide the "No categories" message
        } else {
            categorySelect.innerHTML = '';           // Clear any existing options
            categorySelect.style.display = 'none';    // Hide the categories dropdown if no categories
            noCategoriesText.textContent = `No categories available for this  event: ${selectedEvent ? selectedEvent.name : ''}`; // Set dynamic message
            noCategoriesText.style.display = 'block'; // Show the "No categories" message
        }
    }
    

    async function loadNominees() {
        const data = await fetchData('/api/nominees');
        if (data) {
            nominees = data;
        }
    }

    async function loadVotes() {
        const data = await fetchData('/api/votes');
        if (data) {
            voteData = data;
        }
    }

    function updateChart() {
        const selectedCategory = parseInt(categorySelect.value, 10);
        const categoryNominees = nominees.filter(nominee => nominee.category_id === selectedCategory);

        const nomineeVotes = categoryNominees.map(nominee => {
            const nomineeVote = voteData.find(vote => vote.nominee_id === nominee.id);
            return {
                ...nominee,
                votes: nomineeVote ? nomineeVote.number_of_votes : 0,
            };
        });

        const chartData = {
            labels: categoryNominees.map(nominee => nominee.name),
            datasets: [{
                label: 'Votes',
                data: nomineeVotes.map(nominee => nominee.votes),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        };

        if (chart) chart.destroy();
        if (nomineeVotes.length > 0) {
            noResultsText.style.display = 'none';
            chart = new Chart(resultsChart, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: { label: (context) => `Votes: ${context.raw}` },
                        },
                    },
                    scales: { y: { beginAtZero: true } },
                },
            });
        } else {
            noResultsText.style.display = 'block';
        }
    }

    eventSelect.addEventListener('change', async () => {
        const selectedEvent = eventSelect.value;
        if (selectedEvent) {
            await loadCategories(selectedEvent);
            await loadNominees();
            categorySelect.value = '';
            noResultsText.style.display = 'block';
            if (chart) chart.destroy();
        } else {
            categorySelect.style.display = 'none';  // Hide categories dropdown if no event is selected
            noCategoriesText.style.display = 'none'; // Hide the "No categories" message if no event is selected
        }
    });

    categorySelect.addEventListener('change', async () => {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            await loadVotes();
            updateChart();
        }
    });

    loadEvents();
});
