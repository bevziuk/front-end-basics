console.log("hi");

fetch('static/data.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        fillContent(json);
    })
    .catch(function(err) {
        console.log('Error', err);
    });

function fillContent(data) {
    if(!localStorage.getItem('elements')) {
        let elements = {};
        elements.left = [];
        elements.right = [];

        for (let key in data) {
            createElement('left', key, data[key]);
            elements.left.push(key);
        }
        localStorage.setItem('elements', JSON.stringify(elements));
    }
    else {
        let elements = JSON.parse(localStorage.getItem('elements'));
        elements.left.forEach(elem => {
            createElement('left', elem, data[elem]);
        });

        elements.right.forEach(elem => {
            createElement('right', elem, data[elem]);
        });
    }

    let input = document.getElementsByTagName('input')[0];
    input.oninput = () => {
        document.getElementsByClassName('left')[0].innerHTML = "";
        document.getElementsByClassName('right')[0].innerHTML = "";

        let elements = JSON.parse(localStorage.getItem('elements'));
        elements.left.forEach(elem => {
            if(~data[elem]['author'].indexOf(input.value)) {
                console.log(input.value);
                createElement('left', elem, data[elem]);
            }
        });

        elements.right.forEach(elem => {
            if(~data[elem]['author'].indexOf(input.value)) {
                console.log(input.value);
                createElement('right', elem, data[elem]);
            }
        });
    };
}

function createElement(position, id, object) {
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
    div_arrow.id = id;
    position === "left" ? div_arrow.addEventListener("click", moveLeftCallback) :
        div_arrow.addEventListener("click", moveRightCallback);
    div_item.appendChild(div_arrow);

    document.getElementsByClassName(position)[0].appendChild(div_item);
}

function moveLeftCallback(event) {
    let target = event.target;
    if (target.classList.contains('after')) {
        target.className = 'before';
        target.removeEventListener("click", moveLeftCallback);
        target.addEventListener("click", moveRightCallback);

        let div = event.path[1];
        document.getElementsByClassName('right')[0].appendChild(div);

        let elements = JSON.parse(localStorage.getItem('elements'));
        let index = elements.left.indexOf(target.id);

        elements.right.push(elements.left[index]);
        elements.left.splice(index, 1);

        localStorage.setItem('elements', JSON.stringify(elements));
    }
}

function moveRightCallback(event) {
    let target = event.target;
    if (target.classList.contains('before')) {
        target.className = 'after';
        target.removeEventListener("click", moveRightCallback);
        target.addEventListener("click", moveLeftCallback);

        let div = event.path[1];
        document.getElementsByClassName('left')[0].appendChild(div);

        let elements = JSON.parse(localStorage.getItem('elements'));
        let index = elements.right.indexOf(target.id);

        elements.left.push(elements.right[index]);
        elements.right.splice(index, 1);

        localStorage.setItem('elements', JSON.stringify(elements));
    }
}