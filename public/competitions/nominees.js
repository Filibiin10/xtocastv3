// nominees.js

// Get the category ID from URL parameters
function getCategoryId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch nominees from the API based on category ID
async function fetchNominees(categoryId) {
    try {
        const response = await fetch(`/api/nominee/${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Assuming the API returns a JSON array of nominees
    } catch (error) {
        console.error('Error fetching nominees:', error);
        return []; // Return an empty array in case of error
    }
}

// Fetch events from the API
async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Assuming the API returns a JSON array of events
    } catch (error) {
        console.error('Error fetching events:', error);
        return []; // Return an empty array in case of error
    }
}

// Fetch category by ID
async function fetchCategory(categoryId) {
    try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Assuming the API returns a single category object
    } catch (error) {
        console.error('Error fetching category:', error);
        return null; // Return null in case of error
    }
}

// Render nominees in the DOM
function renderNominees(nominees, events, category) {
    const titleNominee = document.getElementById('titleNominee');
    const nomineesContainer = document.getElementById('nomineesContainer');
    nomineesContainer.innerHTML = ''; // Clear previous content

    nominees.forEach(nominee => {
        const event = events.find(event => event.id === nominee.event_id); // Find the event for the nominee
        const nomineeHTML = createNomineeCard(nominee, event);
        nomineesContainer.insertAdjacentHTML('beforeend', nomineeHTML);
    });

    // Update the title with the category name
    if (category) {
        titleNominee.textContent = ` ${category.name} - Nominees`; // Assuming category has a name property
    }
}

// Create HTML structure for a nominee card
function createNomineeCard(nominee, event) {
    return `
        <div class="col-xl-3 col-lg-3 col-md-5">
            <div class="votingGrid shadow-sm">
                <div class="votingThumb">
                    <img src="${nominee.image_url}" class="img-fluid" alt="${nominee.name}" />
                </div>
                <div class="votingDetail">
                    <div class="detailHead">
                        <h6 class="votingTitle" style="font-size: 18px; text-align: center;">${nominee.name}</h6>
                    </div>
                    <div style="display: flex; justify-content: center">
                        <h6>${nominee.nominee_code}</h6>
                    </div>
                    <div class="votingButton">
                        <a href="vote.html?nomineeId=${nominee.id}" class="btn voting-btn">Vote</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize nominee display based on category
async function initNominees() {
    const categoryId = getCategoryId();
    const [nominees, events, category] = await Promise.all([
        fetchNominees(categoryId),
        fetchEvents(),
        fetchCategory(categoryId) // Fetch category data
    ]); // Fetch nominees and events concurrently
    renderNominees(nominees, events, category);
}

// Call the main function to display nominees on page load
document.addEventListener('DOMContentLoaded', initNominees);
