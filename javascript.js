var columns = [];
var columnList = [];
var firebaseRef = firebase.database().ref();
var used = false;
var currentBoard = "";
var stories = [];

//Firebase functions
function getProjectColId(project){
    columnList = [];
    firebaseRef.child("project").child(project).once('value', function(data){
        data.forEach(function(child){
            columnList.push({
                title: child.val().title,
                id: child.key
            });
        })
    }) 
}

function getAllStories(project){
    firebaseRef.child('project').child(project).once('value', function(data){
        
    })
}

//JS functions
function addColumns() {
    var title = document.getElementById("addColumn").value;
    columns.push(title);
    document.getElementById("addColumn").value = "";
    document.getElementById("columns").innerHTML = "";
    columns.forEach(function (title) {
        var p = document.createElement("p");
        p.innerHTML = title;
        document.getElementById("columns").appendChild(p);
    })
}

function createKanban() {
    //Firebase
    var title = document.getElementById("projectName").value;
    //If new board
    if (document.getElementById("none").selected == true) {
        columns.forEach(function (d) {
            firebaseRef.child("project").child(title).push({
                title: d
            });
        })
        currentBoard = title;
    }
    else {
        //If board already exists
        document.getElementById("existing").childNodes.forEach(function (x) {
                    if (x.selected == true) {
                        currentBoard = x.value;
                        firebaseRef.child('project').child(x.value).once("value", function (snapshot) {
                            snapshot.forEach(function (child) {
                                columns.push(child.val().title);
                            });
                        });
            }
        })
    }
    //UI
    setTimeout(function () {
        getProjectColId(currentBoard);
        document.getElementById("createProject").style.display = "none";
        document.getElementById("board").style.display = "flex";
        document.getElementById("board").innerHTML = "";
        columns.forEach(function (title) {
            var col = document.createElement("div");
            col.className = "column";
            col.id = title;
            var newTitle = document.createElement("h1");
            newTitle.innerHTML = title;
            col.appendChild(newTitle);
            document.getElementById("board").appendChild(col);
        })
        var elements = document.querySelectorAll('.column');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.width = (100 / columns.length) + "%";
        }
        document.getElementById("createStory").style.display = "flex";
    }, 2000);
}

function addStory() {
    var title = document.getElementById("title").value;
    var desc = document.getElementById("desc").value;
    var col = document.getElementById(document.getElementById("columnSelect").value);
    var colId = "";
    columnList.forEach(function(c){
        if(c.title == col.id){
            colId = c.id;
        }
    })
    //Firebase
    var storyObject = {
        title: title,
        desc: desc,
        column: col.id
    }
    
    firebaseRef.child("project").child(currentBoard).child(colId).push(storyObject);
    
    //UI
    var story = document.createElement("div")
    story.className = "story";
    
    
    var h2 = document.createElement("h2");
    h2.innerHTML = title;
    var p = document.createElement("p");
    p.innerHTML = desc;
    var div = document.createElement("div");
    var b1 = document.createElement("button");
    b1.innerHTML = "Details";
    var b2 = document.createElement("button");
    b2.innerHTML = "Move";
    
    div.appendChild(b1);
    div.appendChild(b2);
    story.appendChild(h2);
    story.appendChild(p);
    story.appendChild(div);
    col.appendChild(story);
    document.getElementById("details").style.display = "none";
    document.getElementById("createStory").style.display = "flex";
}

window.onload = function(){
    firebaseRef.child("project").on('value', snap => {
        var data = snap.val();
        for (x in data) {
            var option = document.createElement("option");
            option.value = x;
            option.innerHTML = x;
            document.getElementById("existing").appendChild(option);
        }
    })
}

document.getElementById("closeAS").onclick = function(){
    document.getElementById("details").style.display = "none";
    document.getElementById("createStory").style.display = "block";
}
document.getElementById("addStory").onclick = addStory;
document.getElementById("createStory").onclick = function () {
    document.getElementById("createStory").style.display = "none";
    document.getElementById("columnSelect").innerHTML = "";
    document.getElementById("details").style.display = "flex";
    columns.forEach(function (title) {
        var select = document.createElement("option");
        select.innerHTML = title;
        select.value = title;
        document.getElementById("columnSelect").appendChild(select);
    })
}
document.getElementById("addToColumns").onclick = addColumns;
document.getElementById("createKanban").onclick = createKanban;