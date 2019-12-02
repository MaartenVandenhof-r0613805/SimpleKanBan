var columns = [];
var columnList = [];
var firebaseRef = firebase.database().ref();
var used = false;
var currentBoard = "";
var stories = [];
var isNew = true;

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
    getProjectColId(currentBoard);
    //UI
    setTimeout(function () {
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
        
        //Display stories
        isNew = false;
        addStory();
    }, 2000);
}

function addStory() {
    var title = document.getElementById("title").value;
    var desc = document.getElementById("desc").value;
    var col = document.getElementById(document.getElementById("columnSelect").value);
    if (isNew) {
        var colId = "";
        columnList.forEach(function (c) {
                if (c.title == col.id) {
                    colId = c.id;
                }
            })
            //Firebase
        var storyObject = {
            title: title
            , desc: desc
            , column: col.id
        }
        firebaseRef.child("project").child(currentBoard).child(colId).child("story").push(storyObject);
        //UI
        var story = document.createElement("div")
        story.className = "story";
        var h2 = document.createElement("h2");
        h2.innerHTML = title;
        var p = document.createElement("p");
        p.innerHTML = desc;
        var div = document.createElement("div");
        div.classList.add("storyButtons");
        var b1 = document.createElement("button");
        b1.innerHTML = "Details";
        b1.classList.add("Details");
        b1.classList.add("whiteButton");
        var b2 = document.createElement("button");
        b2.innerHTML = "Move";
        b2.classList.add("Move");
        b2.classList.add("whiteButton");
        b2.setAttribute("name", title)
        b2.onclick = openMoveScreen;
        div.appendChild(b1);
        div.appendChild(b2);
        story.appendChild(h2);
        story.appendChild(p);
        story.appendChild(div);
        col.appendChild(story);
    }
    else {
        columnList.forEach(function (colObj) {
            firebaseRef.child("project").child(currentBoard).once('value', function (data) {
                data.forEach(function (fireCol) {
                    if (fireCol.val().title == colObj.title) {
                        col = document.getElementById(fireCol.val().title);
                        fireCol.forEach(function (colEl) {
                                if (colEl.key == "story") {
                                    colEl.forEach(function (story) {
                                        title = story.val().title;
                                        desc = story.val().desc;
                                        //UI
                                        var story = document.createElement("div")
                                        story.className = "story";
                                        var h2 = document.createElement("h2");
                                        h2.innerHTML = title;
                                        var p = document.createElement("p");
                                        p.innerHTML = desc;
                                        var div = document.createElement("div");
                                        div.classList.add("storyButtons");
                                        var b1 = document.createElement("button");
                                        b1.innerHTML = "Details";
                                        b1.classList.add("Details");
                                        b1.classList.add("whiteButton");
                                        var b2 = document.createElement("button");
                                        b2.innerHTML = "Move";
                                        b2.classList.add("Move");
                                        b2.classList.add("whiteButton");
                                        b2.setAttribute("name", colObj.title)
                                        b2.onclick = openMoveScreen;
                                        div.appendChild(b1);
                                        div.appendChild(b2);
                                        story.appendChild(h2);
                                        story.appendChild(p);
                                        story.appendChild(div);
                                        col.appendChild(story);
                                    })
                                }
                            })
                    }
                })
            })
        })
        isNew = true;
    }
    document.getElementById("details").style.display = "none";
    document.getElementById("createStory").style.display = "flex";
}

function moveStory(){
    var targetCol = "";
    document.getElementById("moveToCol").childNodes.forEach(function(child){
        if(child.selected == true){
            targetCol = child.value;
            console.log(targetCol)
        }
    })
    
    
    document.getElementById("moveStory").style.display = "none";
}

//Btn functions
function openMoveScreen(){
    document.getElementById("moveStory").style.display = "flex";
    document.getElementById("moveToCol").innerHTML = "";
    var name = this.name;
    columnList.forEach(function(title){
        if(title.title != name){
            var option = document.createElement("option");
            option.value = title.title;
            option.innerHTML = title.title;
            document.getElementById("moveToCol").appendChild(option);
        }
    })
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
document.getElementById("closeMoveStory").onclick = function(){
    document.getElementById("moveStory").style.display = "none";
}
