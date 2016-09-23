var pageSize = 10; // Save the page size in case we want to change it later

// Create the Search element and add it to the end of the page-header
var addSearchElement = function() {
	
	// create the search div
	var searchDiv = document.createElement("div");
	searchDiv.setAttribute("class", "student-search");
	
	// append the input box
	var inputBox = document.createElement("input");
	inputBox.setAttribute("placeholder", "Search for students...");
	searchDiv.appendChild(inputBox);
	
	// append the search button
	var searchButton = document.createElement("button");
	searchButton.innerText = "Search";
	searchDiv.appendChild(searchButton);
	
	// append to the page header
	var header = document.getElementsByClassName("page-header")[0];
	header.insertAdjacentElement('beforeend', searchDiv);
}

// Add a pagination button for every 10 list elements
var addPaginationButtons = function() {
	
	// get the student list
	var studentList = document.getElementsByClassName("student-list")[0];
	
	// create the pagination div element
	var pageDiv = document.createElement("div");
	pageDiv.setAttribute("class", "pagination");
	
	// create a ul for the page buttons
	var ul = document.createElement("ul");
	pageDiv.appendChild(ul);
	
	// create the list items and append them to the ul item, each contains a link to the top of the page
	// and has a value set to their position in the list. Set event triggers
	// that call the goToPage function when a link is pressed/clicked.
	for (var i = 1; i <= Math.ceil(studentList.childElementCount / pageSize); i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute("href", "#");
		a.innerText = i;
		a.onclick = goToPage;
		a.onkeydown = goToPage;
		li.appendChild(a);
		ul.appendChild(li);
	}
	studentList.insertAdjacentElement("afterend", pageDiv);
	
	// initialize to the first page clicked (div->ul->li->a.click())
	pageDiv.childNodes[0].childNodes[0].childNodes[0].click();
}

// Navigate to the page click/pressed
var goToPage = function(event) {
	
	// Ignore tab keydown
	if (event.type === "keydown" && event.key === "Tab")
		return;
	// Get array of student list items
	var studentList = document.querySelectorAll(".student-list li");
	// remove page offset to match student array index 0
	var page = this.innerText - 1;
	// set each list item hidden unless it is in the page range
	for (var i = 0; i < studentList.length; i++) {
		// Anything less than the page start hide, and anything greater than the page end hide
		// IE: page = 1. anything < (1 + 1*9) or 10, and anything > (1+(1+1)*9) or 19 (index base 0 so thats really 11 to 20)
		if (i < page + (page)*9 || i > page + (page+1)*9)
			studentList[i].setAttribute("hidden", "");
		else
			studentList[i].removeAttribute("hidden", "");
	}
}


addSearchElement();
addPaginationButtons();
