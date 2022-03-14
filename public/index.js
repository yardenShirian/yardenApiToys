window.onload = function () {
    Get();
    Post();
    Put();
    Delete();
}

const Get = () => {
    let btn = document.querySelector('#idGet');
    let showGet = document.querySelector("#showGet");
    let flag = 1;

    btn.addEventListener('click', () => {
        if (flag) {
            showGet.className = 'd-block ';
            flag = 0;
        }
        else {
            showGet.className = 'd-none';
            flag = 1;
        }
        if (!flag) {
            showPost.className = 'd-none';
            showPut.className = 'd-none';
            showDelete.className = 'd-none';
        }
    })

}

const Post = () => {
    let btn = document.querySelector('#idPost');
    let showPost = document.querySelector("#showPost");
    let flag = 1;

    btn.addEventListener('click', () => {
        if (flag) {
            showPost.className = 'd-block';
            flag = 0;
        }
        else {
            showPost.className = 'd-none';
            flag = 1;
        }
        if (!flag) {
            showGet.className = 'd-none';
            showPut.className = 'd-none';
            showDelete.className = 'd-none';
        }
    })
}

const Put = () => {
    let btn = document.querySelector('#idPut');
    let showPut = document.querySelector("#showPut");
    let flag = 1;

    btn.addEventListener('click', () => {
        if (flag) {
            showPut.className = 'd-block';
            flag = 0;
        }
        else {
            showPut.className = 'd-none';
            flag = 1;
        }
        if (!flag) {
            showGet.className = 'd-none';
            showPost.className = 'd-none';
            showDelete.className = 'd-none';
        }
    })
}
const Delete = () => {
    let btn = document.querySelector('#idDelete');
    let showDelete = document.querySelector("#showDelete");
    let flag = 1;

    btn.addEventListener('click', () => {
        if (flag) {
            showDelete.className = 'd-block';
            flag = 0;
        }
        else {
            showDelete.className = 'd-none';
            flag = 1;
        }
        if (!flag) {
            showGet.className = 'd-none';
            showPost.className = 'd-none';
            showPut.className = 'd-none';
        }
    })
}