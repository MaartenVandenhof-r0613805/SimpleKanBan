var columns = [];

function addColumns() {
    columns.push(document.getElementById("addColumn").value);
    document.getElementById("addColumn").value = "";
    document.getElementById("columns").innerHTML = "";
    columns.forEach(function(title){
        var p = document.createElement("p");
        p.innerHTML = title;
        document.getElementById("columns").appendChild(p); 
    }) 
}

document.getElementById("addToColumns").onclick = addColumns;