// Fetch nominee details by ID
async function fetchNomineeData(nomineeId) {
    try {
        const response = await fetch(`/api/nominees/${nomineeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch nominee data: ${response.status}`);
        }
        const nominee = await response.json();
        console.log(nominee);  // Check the data structure
        
        // Fetch the category name based on the nominee's category ID
        const categoryName = await fetchCategoryName(nominee.category_id);
        
        // Update nominee details with the category name
        updateNomineeDetails(nominee, categoryName);
    } catch (error) {
        console.error(error);
    }
}

// Fetch category name by ID
async function fetchCategoryName(categoryId) {
    try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch category data: ${response.status}`);
        }
        const category = await response.json();
        console.log(category);  // Check the data structure
        return category;  // Return the category object
    } catch (error) {
        console.error(error);
        return null; // Return null in case of error
    }
}

const nomId = new URLSearchParams(window.location.search).get('nomineeId');

// Update nominee details in the DOM
function updateNomineeDetails(nominee, category) {
    if (!nominee || !category) return;  // Handle null or undefined nominee and category

    document.getElementById('nomineeImage').src = nominee.image_url;
    document.getElementById('nomineeName').textContent = nominee.name;
    document.getElementById('nomineeCategory').textContent = category.name;  // Use category name
    document.getElementById('nomineeCode').textContent = nominee.nominee_code;
    document.getElementById('nomineeNameLabel').textContent = nominee.name;
}

// Calculate the amount to pay based on vote count
function updateAmountToPay() {
    const voteCount = parseInt(document.getElementById('voteCount').value) || 0;
    const amount = voteCount * 1; // Assuming GHS 1 per vote
    document.getElementById('amountToPay').textContent = `GHS ${amount.toFixed(2)}`;
}

// Event listeners for vote count input and buttons
document.addEventListener('DOMContentLoaded', () => {
    if (nomId) {
        fetchNomineeData(nomId);  // Fetch nominee data when the page loads
    }

    document.getElementById('voteCount').addEventListener('input', updateAmountToPay);
    
    document.getElementById('submitButton').addEventListener('click', () => {
        const voteCount = document.getElementById('voteCount').value;
        const email = document.getElementById('emailAddress').value;
        submitVote(voteCount, email);
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        document.getElementById('voteCount').value = '';
        document.getElementById('emailAddress').value = '';
        document.getElementById('amountToPay').textContent = 'GHS 0.0';
    });
});

// Submit vote function
function submitVote(voteCount, email) {
    console.log(`Votes: ${voteCount}, Email: ${email}`);
    // Add further processing for submitting the vote here
}
