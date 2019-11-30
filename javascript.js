var columns = [];

function addColumns() {
    columns.push(document.getElementById("addColumn").value);
    document.getElementById("addColumn").value = "";
    document.getElementById("columns").innerHTML = "";
    columns.forEach(function (title) {
        var p = document.createElement("p");
        p.innerHTML = title;
        document.getElementById("columns").appendChild(p);
    })
}

function createKanban() {
    document.getElementById("createProject").style.display = "none";
    document.getElementById("board").style.display = "flex";
    document.getElementById("board").innerHTML = "";
    columns.forEach(function (title) {
        var col = document.createElement("div");
        col.className = "column";
        var newTitle = document.createElement("h1");
        newTitle.innerHTML = title;
        col.appendChild(newTitle);
        document.getElementById("board").appendChild(col);
    })

    var elements = document.querySelectorAll('.column');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.width = (100/columns.length) + "%";
    }
    var details = document.createElement("div");
    details.id = "details";
    document.body.appendChild(details)
}

function addStory(){
    var story = document.createElement("div")
    story.className = "story";
    var title = document.getElementById("title");
    var desc = document.getElementById("desc");
    var col = document.getElementById("col")
    
    var h2 = document.createElement("h2");
    h2.innerHTML = title;
    var p = document.createElement("p");
    p.innerHTML = desc;
    
    story.appendChild(h2);
    story.appendChild(p);
    document.getElementById(col).appendChild(story);
}

document.getElementById("addToColumns").onclick = addColumns;
document.getElementById("createKanban").onclick = createKanban;