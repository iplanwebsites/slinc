
/*


ON IE


the body class is hcanged ok.

the route is runned...

No transitions...

The content is appended AFTER , and old one never removed...
Maybe we should rather move out, then replace?

the OUT/active class isn't added...

maybe because the DOM isn't ready, since the templates files aren't cached in local???

quit using pushstate...

maybe load the sections directly in "section tags", all preloaded?
the use "replace", with the optional caching metod as in MD project...

TEST MD with the hash...
OK, the hast system on MD, and the loading in section is working well.

replicate this system:
 - loader function ,
 - transition classes (same than MD)
 - caching true, false for the portfolio
 - load all templates at the begining...
 - fade images on load... (after each loaded template... targeting images that has the "fading" class...)

imag fade on load does NOT work...
maybe it should be in the callback instead of loadsection
even is not binded......

Section buggy: PF and EQUIPE only... subsection problem??


*/

$(document).ready(function() {

//redirection. - remove once site is live...
/*
if(window.location.hostname == 'www.slincom.ca'){
	window.location = "http://slincom.ca/page2.php";
}*/

//fadeIn animation
$('#seo').remove();

$('#cache').addClass('invisible').delay(1200).queue(function(next){
	$('#cache').remove(); //we remove the DOM node once anim is over...
	next();
});


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
	/*
function sortContent(context){
	//alert('sorting! ='+ lang);
	if(lang == "fr"){
		$('#sections en').remove();
	}else{
		$('#sections fr').remove();
	}
}*/


function setLang(langParam){
	if(langParam == "fr"){
		lang = 'fr';
		$('body').addClass('fr');
		$('body').removeClass('en');
	}else{
		lang = 'en';
		$('body').addClass('en');
		$('body').removeClass('fr');
	}	
}



function initTemplates(context, callbackHome){  // !!!!!
	
	renderTemplate(context, 'footer', '/templates/footer.html', {lang: lang}, true);
	renderTemplate(context, 'header', '/templates/header.html', {lang: lang}, true, function(context){
		$('header .bt').unbind('click touch').bind('click touch', function() {//Adding action to header buttons (mindless of route changes)
			scrollBase();
		});
	});
	renderTemplate(context, 'section#info', '/templates/info.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#bio', '/templates/bio.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#credit', '/templates/credit.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#home', '/templates/home.html', {gal: Gallery.all()}, true, function(context){
		callbackHome(context);
		//bind action to next / prev bt
	
		$('#prev').unbind('click touch').bind('click touch', function(){
			//$(this).addClass('binded');
			pan(-5); //we want to return to menu, not just pan back...
			$('#prev').removeClass('off'); //just to bypass the throttle delay...
		});
		$('#next').unbind('click touch').bind('click touch', function(){
			$(this).addClass('binded');
			pan(1);
		});
	});
}

function bodyClass(context, section){  // !!!!!
if(! $('body').hasClass(section)){  //we make sure we don'T hcange class, if we remain in the same main section


	$('body').removeClass('home portfolio service contact equipe');
	$('body').addClass(section);
	
	//we trigger page transition
	$('section.out').removeClass('out');//cleanup old animation leftover
	
	$('section.active').removeClass('active in').addClass('out').delay(1000).queue(function(next){
	 		$('section.in').removeClass('in');  //let the new section animate to it's normal state.
			//also remove the 'out' class...
			$('section.out').removeClass('out'); 
		next();
	}); //eo queue
	$('section.'+section).addClass('in active');
	
	bindLoadingImages();
}//end if
}



function renderTemplate(context, elem, path, templateData, cache, callback){  // !!!!!
	if( $(elem).hasClass('inDom') && cache){
		if($.isFunction(callback)){
			callback(context); //if temlate already loaded, we just call the callBakc right away.
		}
	}else{
	  context.render(path, templateData)
	   .replace(context.$element(elem)).then(function(content) {
				$(elem).addClass('inDom');
				if($.isFunction(callback)){
					callback(context);
				}
	  });
	}
}


function refreshHeader(context){	
	
	renderTemplate(context, 'header', '/templates/header.html', {lang: lang}, true, function(context){
	/*	$('header .bt').unbind('click touch').bind('click touch', function() {//Adding action to header buttons (mindless of route changes)
			scrollBase();
		});*/
		//TODO: bind event specefic to HEADER!
	});
	/*
	context.render('templates/header.html', {lang: lang})
    .replace(context.$element('header')).then(function(content) {
			
		});*/
		renderTemplate(context, 'footer', '/templates/footer.html', {lang: lang}, true, function(context){
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
		
		//first, we update the nav...
		$('.portfolio nav a.active').removeClass('active');
		$('.portfolio nav a.'+cat).addClass('active');
		
		context.render('templates/portfolio.html', {lang: lang, projects:projects, cat:cat})
      .replace(context.$element('#pf_wrap')).then(function(content) {
				
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
			$('.lightboxlink').colorbox({
				returnFocus: false, 
				maxHeight: "100%",
				current: function(){
				if(lang == "fr"){
				return "{current} / {total}";
				}else{
					return "{current} / {total}";
				}
			}});// eo colorbox
			
			$('.lightboxlink').bind('click touch', function(){ /* so we can css-target color box current project */
				var name = $(this).children("img").attr('data-id');
				$('#cboxContent').removeClass(); //remove all previous project classes
				$('#cboxContent').addClass(name);

			})
			
			bindLoadingImages();
			
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
	
	// LOAD BIO
function loadBio(context, cat){
		//first, we update the nav...
		$('.equipe nav a.active').removeClass('active');
		
		$('.equipe nav a.'+cat).addClass('active');
		
		$('.equipe .box .bio.out').removeClass('out');//cleanup old animation leftover
		$('.equipe .box .bio.active').removeClass('active').addClass('out');
		$('.equipe .box .bio.'+cat).addClass('active');
		//alert($('.equipe .box .bio.'+cat).length + cat);
		
		bindLoadingImages();
		
	/*	context.render('templates/portfolio.html', {lang: lang, projects:projects, cat:cat})
      .replace(context.$element('#pf_wrap')).then(function(content) {
			$('.lightboxlink').colorbox();
			});*/
			
} // eo function load pf
	
	
	function bindLoadingImages(){
	
		//we fade images when they appear in CSS3.
		$('img.loading').one('load', function() {//FADE IMG on load...
		  $(this).removeClass('loading');
		}).each(function() {
		  if(this.complete) $(this).load().removeClass('loading');  //fix caching event not firing
		});
	}
	

function loadSection(context, cat){
	bodyClass(context, cat); //new versoin of function...
	/*
		//we set body class
		$('body').removeClass('home portfolio service contact equipe');
		$('body').addClass(cat);
	
		//we trigger page transition
		$('section.out').removeClass('out');//cleanup old animation leftover
		$('section.active').addClass('out');
		//$('section.out').empty().remove();
		$('section.active').removeClass('active').delay(300).queue(function(next){
			//alert('callback! remove');
		//	$('section.out').empty().remove(); //we remove the DOM node once anim is over...
		 	$('section.in').removeClass('in');
			
			next();
		}); //eo queue

		$('section.'+cat).addClass('active');
		
		bindLoadingImages();
		*/

} // eo function load section

	

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
		
		this.get('/#/:lang', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
			renderTemplate(context, 'section.home', '/templates/section_home.html', {lang: lang}, true, function(context){
				loadSection(context, 'home'); 
			
				$('.graph_home.centered').delay(1000).queue(function(next){
					$('.graph_home.centered').removeClass('centered'); //animate homepage circles to take their places...
					$('section.home p.invisible').removeClass('invisible');
					next();
				}); //eo queue
			}); //eo renterTemplate
			
			/*
			context.render('templates/section_home.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					loadSection(context, 'home'); 
				

					$('.graph_home.centered').delay(1000).queue(function(next){
						$('.graph_home.centered').removeClass('centered'); //animate homepage circles to take their places...
						$('section.home p.invisible').removeClass('invisible');
						next();
					}); //eo queue
					//sortContent(context);
				});
				*/
						
		});
		
		// PORTFOLIO
		// --------------------------------------------
	
		this.get('/#/:lang/portfolio', function (context) {// LOAD ROUTE (homepage)
			context.redirect('/#/'+this.params['lang']+'/portfolio/pub');
		});
		

		
		this.get('/#/:lang/portfolio/:sub', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.sub = this.params['sub'];
			
		//	if($('section.portfolio').hasClass('inDom') <= 0){// if main PF section isn't loaded yet...
				
			renderTemplate(context, 'section.portfolio', '/templates/section_portfolio.html', {lang: lang}, true, function(context){
				loadSection(context, 'portfolio'); 
				loadPortfolio(context, context.sub); //we then init the portfolio caroussel.
			}); //eo renterTemplate
			/*
				 context.render('templates/section_portfolio.html', {lang: lang})
	        .replace(context.$element('section.portfolio')).then(function(content) {
	
						loadSection(context, 'portfolio'); 

						loadPortfolio(context, context.sub); //we then init the portfolio caroussel.

					});	// eo render*/
		//	}else{
		//		loadPortfolio(context, context.sub);
		//	}

		}); //eo route
		// 
	
		
		// EQUIPE
		// --------------------------------------------
	
		this.get('/#/:lang/equipe', function (context) {// LOAD ROUTE (homepage)
			context.redirect('/#/'+this.params['lang']+'/equipe/marc');
		});
		
		this.get('/#/:lang/equipe/:sub', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.sub = this.params['sub'];
			
			
			
			//if($('section.equipe').length <= 0){// if main EQUIPE section isn't loaded yet...
				 
				renderTemplate(context, 'section.equipe', '/templates/section_equipe.html', {lang: lang}, true, function(context){
					loadSection(context, 'equipe'); 
					//sortContent(context);
					loadBio(context, context.sub); //we then init the specefic bio.			}); //eo renterTemplate
				}); //eo renterTemplate
				
				/*
				context.render('templates/section_equipe.html', {lang: lang})
	        .replace(context.$element('#sections')).then(function(content) {
						loadSection(context, 'equipe'); 
						
						//sortContent(context);
						loadBio(context, context.sub); //we then init the specefic bio.
					});	// eo render
					*/
					
		//	}else{
				loadBio(context, context.sub);
		//	}
			
			
		}); //eo route
		
		
		
		// SERVICE
		// --------------------------------------------

		this.get('/#/:lang/services', function (context) {// LOAD ROUTE (homepage)
		//	alert('services ROUTE!');
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
		/*	context.render('templates/section_service.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
	
	*/
		renderTemplate(context, 'section.service', '/templates/section_service.html', {lang: lang}, true, function(context){
			
					loadSection(context, 'service'); 
					
					if(typeof(graphInterval) != 'undefined'){
						clearInterval(graphInterval);
					} //so it doesn't double-up
					graphInterval = setInterval(function() {
					if($('.service_graph .circle.c1').hasClass('active')){
						$('.service_graph .circle.active').removeClass('active');
						$('.service_graph .circle.c2').addClass('active');
					}else	if($('.service_graph .circle.c2').hasClass('active')){
							$('.service_graph .circle.active').removeClass('active');
							$('.service_graph .circle.c3').addClass('active');
						}else	if($('.service_graph .circle.c3').hasClass('active')){
								$('.service_graph .circle.active').removeClass('active');
								$('.service_graph .circle.c4').addClass('active');
							}else	if($('.service_graph .circle.c4').hasClass('active')){
									$('.service_graph .circle.active').removeClass('active');
									$('.service_graph .circle.c5').addClass('active');
								}else	if($('.service_graph .circle.c5').hasClass('active')){
										$('.service_graph .circle.active').removeClass('active');
										$('.service_graph .circle.c6').addClass('active');
									}else	if($('.service_graph .circle.c6').hasClass('active')){
											$('.service_graph .circle.active').removeClass('active');
											$('.service_graph .circle.c1').addClass('active');
										}else{
											//We're not on the service page anymore... destroy interval!
											clearInterval(graphInterval);
										}
						}, 2000); //eo setinterval, 2 seconds rotating anim
									
				});		//eo render?
		});// eo route
		
		this.get('/#/:lang/contact', function (context) {  //CONTACT	
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			renderTemplate(context, 'section.contact', '/templates/section_contact.html', {lang: lang}, true, function(context){
				loadSection(context, 'contact'); 

			}); //eo renterTemplate
			// 
			/*
			context.render('templates/section_contact.html', {lang: lang})
        .replace(context.$element('#sections')).then(function(content) {
					loadSection(context, 'contact'); 
					
						
					//sortContent(context);
					//TODO: bind event specefic to this section!
				});		*/
		}); //end "get #/"
	
		
		
	});//eo sammy routes



	//TODO: cgheck if cookie exists here, and redirect to right language page accordingly.
	setLang('undef'); //HARDCODED!
	sammy.run('/#/fr');

}); //eo doc ready


