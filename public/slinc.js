


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
	context.render('templates/header.html', {l: lang})
    .replace(context.$element('header')).then(function(content) {
		//	alert('headerRefreshed!');
			//TODO: bind event specefic to HEADER!
		});
}

	sammy = Sammy('body', function (context) {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);

		this.context = this;
		
		this.get('/#!/:lang', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.render('templates/section_home.html', {})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
					//TODO: bind event specefic to this section!
				});		
		});
		
		this.get('/#!/:lang/contact', function (context) {  //CONTACT	
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
			context.render('templates/section_contact.html', {})
        .replace(context.$element('#sections')).then(function(content) {
						
					sortContent(context);
					//TODO: bind event specefic to this section!
				});		
		}); //end "get #/"
		// 
		

/*
		this.get('/#!/fr', function (context) {

		}); //end "get #/"
*/
	});//eo sammy routes



	//TODO: cgheck if cookie exists here, and redirect to right language page accordingly.
	setLang('undef'); //HARDCODED!
	sammy.run('/#!/fr');

}); //eo doc ready


