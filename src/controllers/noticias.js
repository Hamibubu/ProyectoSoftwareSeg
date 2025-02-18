const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f92715e980ad497f8e2bf61f37160ebb');

class Noticias{
    get_noticias(req,res){
        newsapi.v2.everything({
            q: 'sports',
            sources: 'espn',
            language: 'en',
            sortBy: 'relevancy',
            page: 2
        }).then(response => {
            res.send(response);
        });
    }
}

module.exports = new Noticias();