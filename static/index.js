console.log("hi");

fetch('static/data.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        createLeftColumn(json);
    })
    .catch(function(err) {
        console.log('Error', err);
    });

function createLeftColumn(data) {
    //console.log(data[Object.keys(data)[0]]);

    //if(!localStorage.getItem('elements')) {
    //    for (let index in data) {
    //        createElement('left', index, data[index]);
    //    }
    //    localStorage.setItem('elements', 'raka');
    //}

    for (let index in data) {
        createElement('left', index, data[index]);
    }

    document.getElementsByClassName('left')[0].addEventListener("click", (event) => {
        console.log(event)
        let target = event.target;
        if (target.classList.contains('after')) {
            target.className = 'before';
            let div = event.path[1];
            document.getElementsByClassName('right')[0].appendChild(div);
        }
    });

    document.getElementsByClassName('right')[0].addEventListener("click", (event) => {
        console.log(event)
        let target = event.target;
        if (target.classList.contains('before')) {
            target.className = 'after';
            let div = event.path[1];
            document.getElementsByClassName('left')[0].appendChild(div);
        }
    });
}

function createElement(position, index, object) {
    let div_item = document.createElement('div');
    div_item.className = "item";

    // IMG
    let div_pic = document.createElement('div');
    div_pic.className = "pic";
    div_item.appendChild(div_pic);

    let span_pic = document.createElement('span');
    div_pic.appendChild(span_pic);

    let img = document.createElement('img');
    img.setAttribute('src', object['img']);
    span_pic.appendChild(img);
    // !IMG

    // INFO
    let div_title = document.createElement('div');
    div_title.className = "title";
    div_item.appendChild(div_title);

    let span_name = document.createElement('span');
    span_name.innerHTML = `<b>Название:</b> "${object['name']}"`;
    div_title.appendChild(span_name);

    let span_author = document.createElement('span');
    span_author.innerHTML = `<b>Автор:</b> ${object['author']}`;
    div_title.appendChild(span_author);
    // !INFO

    let div_arrow = document.createElement('div');
    div_arrow.className = position === "left" ? "after" : "before";
    //div_arrow.addEventListener("click", function(event) {
    //    console.log(event);
    //});
    div_item.appendChild(div_arrow);

    document.getElementsByClassName(position)[0].appendChild(div_item);
}