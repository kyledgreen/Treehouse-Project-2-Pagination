// Browser Compatibility checked in IE and Chrome.

var pageSize = 10; // Save the page size in case we want to change it later

// Create the Search element and add it to the end of the page-header
var addSearchElement = function() {
	
	// create the search div
	var searchDiv = document.createElement("div");
	searchDiv.setAttribute("class", "student-search");
	
	// append the input box
	var inputBox = document.createElement("input");
	inputBox.setAttribute("placeholder", "Search for students...");
	inputBox.setAttribute("id", "searchBox");
	inputBox.oninput = runSearch; // update the filtered list as the user types
	searchDiv.appendChild(inputBox);
	
	// append the search button
	var searchButton = document.createElement("button");
	searchButton.innerText = "Search";
	searchButton.onclick = runSearch;
	searchDiv.appendChild(searchButton);
	
	// append to the page header
	var header = document.getElementsByClassName("page-header")[0];
	header.insertAdjacentElement('beforeend', searchDiv);
	
	// create the hidden div that is displayed when no students match a search string
	var noMatchDiv = document.createElement("div");
	var noMatchH4 = document.createElement("h4");
	noMatchH4.innerText = "No Matching Students...";
	noMatchDiv.setAttribute("hidden", "");
	noMatchDiv.setAttribute("id", "noMatches");
	noMatchDiv.appendChild(noMatchH4);	
	header.insertAdjacentElement('afterend', noMatchDiv);
};

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
	
	runSearch(); // initialize the 'match' class on all li elements and start on page 1
};

// Navigate to the page click/pressed
var goToPage = function(event) {
	
	// Ignore tab keydown
	if (event.type === "keydown" && event.key === "Tab")
		return;
	var links = document.querySelectorAll(".pagination li a");
	for (var j = 0; j < links.length; j++)
		links[j].removeAttribute('class', 'active');
	this.setAttribute('class', 'active');
	// Get array of student list items that have the match class
	var studentList = document.querySelectorAll(".student-list li.match");
	var page = this.innerText - 1; // remove page offset to match student array index 0
	var pageMin = page + page * (pageSize - 1); // min li offset to show based on page size
	var pageMax = page + (page + 1) * (pageSize - 1); // max li offset to show based on page size
	// set each list item hidden unless it is in the page range
	for (var i = 0; i < studentList.length; i++) {
		if (i < pageMin || i > pageMax) {
			simpleFadeOut(studentList[i]);
		} else {
			simpleFadeIn(studentList[i]);
		}
	}
	
	var divNoMatches = document.getElementById("noMatches");
	if (studentList.length === 0) {
		divNoMatches.removeAttribute("hidden", "");
	} else {
		divNoMatches.setAttribute("hidden", "");
	}
};

// filter list of students. Matches text in search box to any partial of the student's name or email.
//  hides any unneeded page buttons and goes to the first page of the filtered list
var runSearch =  function () {
	var searchText = document.getElementById("searchBox").value.toLowerCase(); // get search text
	var studentList = document.querySelectorAll(".student-list li"); // Get array of student list items
	var found = 0;
	
	// add the 'match' class to any students with an email or name that have a substring of the search text
	//  and remove the match class from any student that doesnt. case insensitive.
	for (var i = 0; i < studentList.length; i++) {
		if (studentList[i].getElementsByTagName("h3")[0].innerText.toLowerCase().indexOf(searchText) != -1 || 
			studentList[i].getElementsByClassName("email")[0].innerText.toLowerCase().indexOf(searchText) != -1) {
			found++;
			studentList[i].setAttribute("class", "student-item cf match");			
		} else {
			studentList[i].setAttribute("class", "student-item cf");
			simpleFadeOut(studentList[i]);
		}
	}
	
	// based on the match count, hide any extra page links
	var pages = Math.ceil(found / pageSize);
	var pageList = document.querySelectorAll(".pagination li");
	for (var x = 0; x < pageList.length; x++) {
		if (x < pages && pages != 1) {
			pageList[x].children[0].removeAttribute("hidden", "");
		} else {
			pageList[x].children[0].setAttribute("hidden", "");
		}
	}
	// go to first page after a search so the first 10 matches are displayed
	pageList[0].children[0].click(); 
};

// takes a document element and every 10ms reduces the opacity by 5% from 100% to 0, and then hides the element
var simpleFadeOut = function (docObject) {
	var sub = 1;
	var id = setInterval(fadeOut, 10);
	function fadeOut() {
		if (docObject.style.opacity > 0) {
			docObject.style.opacity = sub;
			sub -= 0.05;
		} else {
			clearInterval(id);
			docObject.setAttribute("hidden", "");
		}
	}
};

// takes a document element, unhides it at 1% opacity, and every 10ms increases the opacity by 1% from 0% to 100%
var simpleFadeIn = function (docObject) {
	var add = 0.01;
	docObject.style.opacity = add;
	docObject.removeAttribute("hidden", "");
	var id = setInterval(fadeIn, 10);
	function fadeIn() {
		if (docObject.style.opacity < 1.0) {
			docObject.style.opacity = add;
			add += 0.05;
		} else {
			clearInterval(id);
		}
	}
};

// Initialize components
addSearchElement();
addPaginationButtons();
