$(function() {
    $.ajax({
        method: 'GET',
        url: '/home',
        success: function(data) {
            console.log(data);
            $('#list').empty();
            let myHTML = "";
            if(data.articles) {
                data.articles.forEach((value, index)=> {
                    myHTML += `<li class="list-group-item"><a href= '/show/article/${value.count}'>${value.title}</a></li>`
                })
                $('#list').append(myHTML);
            }
            
        },
        error: function(err) {
            console.log(err);
        }
    })
})