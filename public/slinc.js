


$(document).ready(function() {

	function getObjects(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getObjects(obj[i], key, val));
	        } else if (i == key && obj[key] == val) {
	            objects.push(obj);
	        }
	    }
	    return objects;
	}
	
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
		
		context.render('templates/footer.html', {lang: lang})
	    .replace(context.$element('footer')).then(function(content) {
				//TODO: bind event specefic to Footer!
			});
}


function loadPortfolio(context, cat){
	//	alert(cat + sammy.pf);
		var projects = getObjects(sammy.pf, 'cat', cat); // Returns an array of matching objects
		//alert("proj "+ projects[1]['desc_fr']);
		
		context.render('templates/portfolio.html', {lang: lang, projects:projects, cat:cat})
      .replace(context.$element('#pf_wrap')).then(function(content) {
				//sortContent(context);
				
				//todo: don't run this bit if there's no LI...
				
				
				theShow = $('ul.pf').bxSlider({
									   displaySlideQty: 4,
											speed: 300, 
											infiniteLoop: false,
											hideControlOnEnd: true, 
											randomStart: false,
											returnFocus: false,
									   moveSlideQty: 1             
				}).removeClass('hide');// eo bx init
			 // theShow.destroyShow();
			$('.lightboxlink').colorbox();
			
			/*
			$('ul.pf li img').click( function(){
				alert('open '+ $(this).attr('data-id'));
				//TODO: Lightbox init code here!
				
				//previous	"previous"	Text for the previous button in a shared relation group (same values for 'rel' attribute).
			//	next	"next"	Text for the next button in a shared relation group (same values for 'rel' attribute).
			//	close
				
			}); //eo click
			*/
			
			});
} // eo function load pf
	
	

$.getJSON('data/portfolio.json', function(data) { //cached...
		sammy.pf = data;  
});

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
			context.sub = this.params['sub'];
			
			
			
			if($('section.portfolio').length <= 0){// if main PF section isn't loaded yet...
				 context.render('templates/section_portfolio.html', {lang: lang})
	        .replace(context.$element('#sections')).then(function(content) {
						sortContent(context);
						loadPortfolio(context, context.sub); //we then init the portfolio caroussel.

						//alert("pf = " + sammy.pf['test']['desc_fr']);

					});	// eo render
			}else{
				loadPortfolio(context, context.sub);
			}
			
	//	}); //eo route
		
	
			
			
			/*
			context.render('templates/section_home.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					sortContent(context);
				});	*/	
				
		}); //eo route
		
		
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


