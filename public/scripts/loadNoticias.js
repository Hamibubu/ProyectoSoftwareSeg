let container = $('.main');
let template = $('#news-card').first();
template = Handlebars.compile(template.html());
let index = 0, valueReturned = 0, datos;

$.get('/showNoticias')
.done(function (data) {
    datos = data.articles;
    if(datos.length){
        valueReturned = show5(datos, index);
        index = valueReturned;
    }else{
        $('.list5more').hide();
        $('.main').append(`<h2>No hay noticias por el momento...</h2>`);
    }
    
})

$('.list5more').on('click', function(e){

    e.preventDefault();
    valueReturned = show5(datos, index);
    index = valueReturned;
});

function show5(arr, index){
    let i = index;
    while(arr[i] !== undefined && i < index+5){
        let element = arr[i];
        let card = template({
            img:element.urlToImage,
            name:element.title,
            description:element.description,
            url:element.url
        })
        container.append(card);
        i++;
    }
    return i;
}
