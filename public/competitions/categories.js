async function fetchCategories(eventId) {
  try {

        // Fetch event details
        const eventResponse = await fetch(`/api/events/${eventId}`); // Update API URL as needed
        const eventData = await eventResponse.json();
        // console.log(eventData.vote_cost)
        const vote = eventData.vote_cost
        const name = eventData.name

        const categoryResponse = await fetch(`/api/eventid/${eventId}`
          ); // Update API URL as needed
          const categoryData = await categoryResponse.json();
          const catId = categoryData.id
      
          

        const nomineeResponse = await fetch(`/api/nominees`); // Update API URL as needed
        const nomiData = await nomineeResponse.json();

        const filteredNominees = nomiData.filter(nominee => nominee.category_id === catId);

        const totalNominees = filteredNominees.length;
        console.log("Total nominees in category:", totalNominees);



    const response = await fetch(
      `/api/categories?eventId=${eventId}`
    ); // Update API URL as needed
    const categories = await response.json();

    const filteredCategories = categories.filter((cat) => cat.event_id === eventId);


    filteredCategories.map((cat) => {
        nomineeCount= nomiData.filter( (n) => n.category_id === cat.id).length
    })

    // console.log(filteredCategories)

  
    // categoriesWithTotalNominees.forEach(category => {
    //     console.log(category.nomineeCount);
    // });

    const categoriesWithTotalNominees = filteredCategories.map((category) => {
        const filteredNominees = nomiData.filter(nominee => nominee.category_id === category.id);
        const totalNominees = filteredNominees.length;
    
        return {
            id:category.id,
            title: category.name,
            nomineeCount: totalNominees,
            image_url: category.image_url // assuming you have an image_url for categories
        };
    });

    console.log(categoriesWithTotalNominees)
  
    // Get the container for the category list
    // const categoriesList = document.getElementById("categories-list");
    const container = document.getElementById('categoriesContainer');
    const eventname = document.getElementById('eventname');

    eventname.textContent = `${name} - Categories`;

    // Clear the container before inserting
    container.innerHTML = "";

    // Display the event name in the title
    // const eventTitle = document.getElementById('event-title');
    // eventTitle.textContent = `Categories for Event ID: ${eventId}`; // You might want to fetch the event name too

    // Loop through categories and create HTML for each one
    categoriesWithTotalNominees.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = "col-xl-4 col-lg-4 col-md-6";
        categoryDiv.innerHTML = `
            <div class="votingGrid shadow-sm">
    <div class="votingThumb">
        <img src="${category.image_url}" class="img-fluid" alt="${category.title}">
    </div>
    <div class="votingDetail">
        <div class="detailHead">
            <h6 class="votingTitle" style="font-size: 18px;">${category.title}</h6>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 10px;">
            <h4 style="width: fit-content; font-size: 12px; background-color: #6864ED; color: white; padding: 10px 10px; border-radius: 10px;">
                ₵${vote} PER VOTE
            </h4>
            <h4 style="width: fit-content; font-size: 12px; background-color: #212529; color: white; padding: 10px 10px; border-radius: 10px;">
                ${category.nomineeCount} NOMINEES
            </h4>
        </div>
        <a href="nominees.html?id=${category.id}" class="btn" style="background-color: #01455D; color: white; margin-top: 10px; display: block; text-align: center; width: 100%;">
    View Nominees
</a>
    </div>
</div>

        `;
        // Append the newly created div to the container
        container.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Function to get the URL parameters
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  console.log(params)
  return {
    id: params.get("id"),
  };
}
// Call fetchCategories when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const { id } = getQueryParams();
  if (id) {
    fetchCategories(id);
  } else {
    console.error("No event ID found in the URL");
  }
});

