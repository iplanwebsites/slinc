


$(document).ready(function() {

function sortContent(context){
	//alert('sorting! ='+ lang);
	if(lang == "fr"){
		$('#sections en').remove();
	}else{
		$('#sections fr').remove();
	}
}

function setLang(langParam){
	lang = langParam;
	
	if(lang == "fr"){
		$('body').addClass('fr');
		$('body').removeClass('en');
	}else{
		$('body').addClass('en');
		$('body').removeClass('fr');
	}	
	//here, we also reload the header content...
	
	
}

function refreshHeader(context){	
	context.render('templates/header.html', {lang: lang})
    .replace(context.$element('header')).then(function(content) {
			//TODO: bind event specefic to HEADER!
		});
}


	sammy = Sammy('body', function (context) {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);
		this.use('GoogleAnalytics');
		

		this.context = this;
		
		this.get('/#!/:lang', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.render('templates/section_home.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
				});		
		});
		
		
		
		this.get('/#!/:lang/portfolio', function (context) {// LOAD ROUTE (homepage)
			context.redirect('/#!/'+this.params['lang']+'/portfolio/pub');
		});
		
		
		
		this.get('/#!/:lang/portfolio/:sub', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
			if($('section.portfolio').length <= 0){
				// main PF section isn't loaded yet...
			}
			context.render('templates/section_portfolio.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
					
					//init PF caroussel
					// //we then just toggle the visibility of the right bx caroussel.
					
					$('.pf.web').bxSlider({
					   displaySlideQty: 4,
							speed: 300, 
					   moveSlideQty: 1             
					});// eo bx init
				});		
		});
		
	
			
			
			/*
			context.render('templates/section_home.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
				});	*/	
				
		});
		
		
		this.get('/#!/:lang/services', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.render('templates/section_service.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
				});		
		});
		
		this.get('/#!/:lang/contact', function (context) {  //CONTACT	
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
			context.render('templates/section_contact.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
						
					sortContent(context);
					//TODO: bind event specefic to this section!
				});		
		}); //end "get #/"
	
		
		
	});//eo sammy routes



	//TODO: cgheck if cookie exists here, and redirect to right language page accordingly.
	setLang('undef'); //HARDCODED!
	sammy.run('/#!/fr');

}); //eo doc ready


