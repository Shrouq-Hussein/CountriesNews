var countriesSlider = {
    countries: [],
    currentCountry :{},
    init: function () {
        this.fetchCountries()
        this.chacheElements()
        this.bindEvents()
        this.render()
    },
    fetchCountries: function () {
        $.ajax({
            type: "GET"
            ,
            url: "https://restcountries.com/v3.1/all",
            success: function (data) {
                countriesSlider.countries = data 
                countriesSlider.$lds_roller.css("display","none")
                countriesSlider.render()
                currentCountryCard.init()
            }
        })
        console.log(this.countries)
    },
    chacheElements: function () {
        this.$carousel_inner_lg = $("#carousel-inner-lg")
        this.$lds_roller = $(".countriesSection .lds-roller")

        console.log(this.$carousel_inner_lg)
        console.log(this.$lds_roller)
    },
    bindEvents: function () {
        this.$carousel_inner_lg.on("click",".carousel-item .country_card ",this.changeCurrentCountry)
    },
    render: function () {
        console.log("render",this.countries)
       if(this.countries)
       {
        this.countries.forEach(function (country) {
            var active = countriesSlider.countries[0]==country? "active":""

            countriesSlider.$carousel_inner_lg.append(`<div class="carousel-item  border my-3 ${active}">
            <div class="row justify-content-center">
            <div class="col-lg-2 col-md-2  col-sm-10  align_text_center p-3 m-2 card country_card" data-country=${country["cca2"]}>
            <div class="country_img_container mb-3">
            <img src="${country["flags"]["png"]}" alt="" class="country_img">
            </div> 
            <div class="country_names_container">
            <h4 class="country_name"> ${country["name"]["official"]} </h4>
            <h5 class="country_capital"> ${country["capital"]}  </h5>
            </div>
           </div> 
           </div> </div>`
            )

        })
       }
   
    }
    ,
    changeCurrentCountry: function (e) {
        let data_country = $(this).attr("data-country")
        console.log(data_country)
        countriesSlider.countries.forEach(function(country){
            if(data_country === country["cca2"]){
                countriesSlider.setCurrentCountry(country)
            }
        })

        //emit   changeCurrentCountry
        // data 
        eventsMediator.emit("changeCurrentCountry",countriesSlider.currentCountry)
    },
    setCurrentCountry: function(obj){
            console.log(obj)
            this.currentCountry = obj
    },

}

////////////////////////////
var currentCountryCard = {
    data:{},
    init:function(){
        this.data = countriesSlider.countries[0]
       this.cacheElements()
       this.bindEvents()
       this.render()
    },
    cacheElements: function(){
        this.$countryCard =$("#currentCountryCard")
        this.template = $("#countryCard_template").html()
    },
    bindEvents: function(){
        eventsMediator.on("changeCurrentCountry",this.changeData.bind(this))
    },
    changeData : function(data){
       this.data = data
    var key =Object.keys(this.data.currencies)[0]
    console.log(this.data.currencies[key].name)
    this.data.currency= this.data.currencies[key].name
    var langKey = Object.keys(this.data.languages)[0]
    this.data.language= this.data.languages[langKey]
  
       this.render()
    },
    render:function(){
        this.$countryCard.addClass("border")
        this.$countryCard.html(
            Mustache.render(this.template,this.data)
        )
    },

}

// //////////////////////////
var currentCountryNews = {
    news:[],
    init:function(){
       this.cacheElements()
       this.bindEvents()
    //    this.render()
    },
    cacheElements: function(){
       this.$newsContainer = $("#newsContainer")
       this.template = $("#countryNewsCard").html()
       this.$loader =  $(".newsSection .lds-roller")
    },
    bindEvents: function(){
        eventsMediator.on("changeCurrentCountry",this.changeData.bind(this))

    },
    render:function(){
        this.news.forEach(function(article){
            console.log(article)
            if(article.description && article.author && article.urlToImage){
            currentCountryNews.$newsContainer.append(
                Mustache.render(currentCountryNews.template,article)
            )
            }
        })
        
    },
    changeData : function(obj){
        this.fetchNews(obj)
             
    },
    fetchNews: function(obj){
        console.log(obj)
        $.ajax({
            type: "GET"
            ,
            url: `https://newsapi.org/v2/top-headlines?country=ar&apiKey=a19552223d634010a1ff2550c20d7933`,
            success:function(data){
               console.log(data)
               currentCountryNews.news = data.articles
               currentCountryNews.$loader.css("display","none")
               currentCountryNews.render()
                // $.each(data.sources,function(i,article){
                //    console.log(article)
   
                //     var description = article.description
                //   $test.append(`<div>${description} </div>`)
                // })
            }
        })

    },

}
////////////////////////////
var eventsMediator ={
    events:{},
   //subscribe on event using  eventsMediator.on("eventName",cbf)
    on: function(eventName,cbf){
        this.events[eventName]=  this.events[eventName]? this.events[eventName]:[]
        this.events[eventName].push(cbf)
    },
      // emit event  (change in data)
    emit: function(eventName,data){
        console.log(data)
          if(this.events[eventName]){
            this.events[eventName].forEach(function(fun){
                fun(data)
            })
          }
    },

}

countriesSlider.init()
currentCountryNews.init()

