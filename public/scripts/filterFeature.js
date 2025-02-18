function filter(category){
    let inputs = $('input[type=checkbox]');
    let gender = [];
    let price = 0;
    let brand = []; 
    for(let i = 0; i < inputs.length; i++){
        let bool = inputs[i].checked, value = inputs[i].value;
        if(bool && (value === 'Hombre' ||value === 'Mujer' || value ==='Unisex')){
            gender.push(value);
        }else if(bool && inputs[i].className.includes('price')){
            price = (price < parseInt(value))? parseInt(value):price;
            console.log(price);
        }else if(bool && (value === 'Nike' || value ==='Adidas' || value ==='Puma' || value ==='Under Armour')){
            brand.push(value)
        }
    }
    if(price == 0){
        price = undefined;
    }

    let postData = (category == '')?{genero:gender, precio:price, marca:brand}:{categoria:category,genero:gender, precio:price, marca:brand}

    $.post('/productosfiltrados', postData)
    .done(function(data){
        if(data.length){
            madeTemplate(data);
        }else{
            $('.product-container').addClass('text-center pt-4').html('<h1>No tenemos productos disponibles...</h1>')
        }
    });
}

