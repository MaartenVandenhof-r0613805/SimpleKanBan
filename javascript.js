var columns = [];
var firebaseRef = firebase.database().ref();
var used = false;

function addFireData(child, text) {
    if (text != null && text != "") {
        used = false;
        var fData = [];
        var allData = [];
        firebaseRef.child(child).on('value', snap => {
            allData = snap.val();
            for (x in allData) {
                if (allData[x] == text) used = true;
            }
            if (!used) {
                firebaseRef.child(child).push(text)
            }
            else {}
        })
    }
}

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
    if (document.getElementById("none").selected == true) {
        addFireData("project", title);
        firebaseRef.child("project").on('value', snap => {
            var childName = "";
            for (x in snap.val()) {
                if (snap.val()[x] == title) childName = x;
            }
            columns.forEach(function (d) {
                addFireData(childName, d);
            })
        })
    }
    else {
        
        document.getElementById("existing").childNodes.forEach(function (x) {
            console.log(x.selected)
            if (x.selected == true) {
                firebaseRef.child('project').on('value', snap => {
                    var childName = "";
                    var allData = snap.val();
                    for (c in allData) {
                        if (allData[c] == x.value) childName = c;
                    }
                    console.log(childName)
                    firebaseRef.child(childName).on('value', snap2 => {
                        console.log(snap2.val())
                        for(el in snap2.val()){
                            columns.push(snap2.val()[el]);
                        }
                    })
                    
                })
            }
        })
    }
    //UI
    setTimeout(function () {
        console.log(columns)
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
    }, 3000);
}

function addStory() {
    var story = document.createElement("div")
    story.className = "story";
    var title = document.getElementById("title").value;
    var desc = document.getElementById("desc").value;
    console.log(document.getElementById("columnSelect").value)
    var col = document.getElementById(document.getElementById("columnSelect").value);
    
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
}

window.onload = function(){
    firebaseRef.child("project").on('value', snap => {
        var data = snap.val();
        for (x in data) {
            var option = document.createElement("option");
            option.value = data[x];
            option.innerHTML = data[x];
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