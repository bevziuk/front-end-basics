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
        let elements = {
            left: [],
            right: []
        };

        for (let key in data) {
            let parent = getElement('.left')[0];
            createItem(parent, 'left', key, data[key]);
            elements.left.push(key);
        }
        localStorage.setItem('elements', JSON.stringify(elements));
    }
    else {
        let elements = JSON.parse(localStorage.getItem('elements'));
        let parent = getElement('.left')[0];
        elements.left.forEach(elem => {
            createItem(parent, 'left', elem, data[elem]);
        });

        parent = getElement('.right')[0];
        elements.right.forEach(elem => {
            createItem(parent, 'right', elem, data[elem]);
        });
    }

    let elements = JSON.parse(localStorage.getItem('elements'));
    let amount_info = getElement('.amount-info');
    amount_info[0].innerHTML = elements.left.length;
    amount_info[1].innerHTML = elements.right.length;

    addLeftListener();
    addRightListener();

    // Search
    let input = document.getElementsByTagName('input')[0];
    input.oninput = () => {
        getElement('.left')[0].innerHTML = "";
        getElement('.right')[0].innerHTML = "";

        let amount = 0;

        let elements = JSON.parse(localStorage.getItem('elements'));
        let parent = getElement('.left')[0];

        elements.left.forEach(elem => {
            let author = data[elem]['author'].toLowerCase()
            let value = input.value.toLowerCase();
            if(author.includes(value)) {
                createItem(parent, 'left', elem, data[elem]);
                amount++;
            }
        });

        let amount_info = getElement('.amount-info');
        amount_info[0].innerHTML = amount;

        amount = 0;
        parent = getElement('.right')[0];

        elements.right.forEach(elem => {
            let author = data[elem]['author'].toLowerCase()
            let value = input.value.toLowerCase();
            if(author.includes(value)) {
                createItem(parent, 'right', elem, data[elem]);
                amount++;
            }
        });

        amount_info[1].innerHTML = amount;
    };
}

function createItem(parent, side, id, object) {
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
    div_arrow.className = side === "left" ? "after" : "before";
    div_arrow.id = id;
    div_item.appendChild(div_arrow);

    parent.appendChild(div_item);
    //document.getElementsByClassName(side)[0].appendChild(div_item);
}

function getElement(selector) {
    return document.querySelectorAll(selector);
}

function addLeftListener() {
    getElement('.left')[0].addEventListener("click", (event) => {
        let target = event.target;
        if (target.classList.contains('after')) {
            target.className = 'before';
            let div = event.path[1];
            getElement('.right')[0].appendChild(div);

            let elements = JSON.parse(localStorage.getItem('elements'));
            let index = elements.left.indexOf(target.id);

            elements.right.push(elements.left[index]);
            elements.left.splice(index, 1);

            let amount_info = getElement('.amount-info');
            amount_info[0].innerHTML = elements.left.length;
            amount_info[1].innerHTML = elements.right.length;

            localStorage.setItem('elements', JSON.stringify(elements));
        }
    });
}

function addRightListener() {
    getElement('.right')[0].addEventListener("click", (event) => {
        let target = event.target;
        if (target.classList.contains('before')) {
            target.className = 'after';
            let div = event.path[1];
            getElement('.left')[0].appendChild(div);

            let elements = JSON.parse(localStorage.getItem('elements'));
            let index = elements.right.indexOf(target.id);

            elements.left.push(elements.right[index]);
            elements.right.splice(index, 1);

            let amount_info = getElement('.amount-info');
            amount_info[0].innerHTML = elements.left.length;
            amount_info[1].innerHTML = elements.right.length;

            localStorage.setItem('elements', JSON.stringify(elements));
        }
    });
}