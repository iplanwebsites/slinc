
/*


ON IE


the body class is hcanged ok.

the route is runned...

No transitions...

The content is appended AFTER , and old one never removed...
Maybe we should rather move out, then replace?



*/

$(document).ready(function() {

//redirection. - remove once site is live...
if(window.location.hostname == 'www.slincom.ca'){
	window.location = "http://slincom.ca/page2.php";
}

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
			}});
			
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
		
		
	/*	context.render('templates/portfolio.html', {lang: lang, projects:projects, cat:cat})
      .replace(context.$element('#pf_wrap')).then(function(content) {
			$('.lightboxlink').colorbox();
			});*/
			
} // eo function load pf
	
	
	
function loadSection(context, cat){
		//we set body class
		$('body').removeClass('home portfolio service contact equipe');
		$('body').addClass(cat);
	
		//we trigger page transition
		$('section.out').removeClass('out');//cleanup old animation leftover
		$('section.active').addClass('out');
		$('section.out').remove();
		$('section.active').removeClass('active').delay(300).queue(function(next){
			alert('callback! remove');
			$('section.out').remove(); //we remove the DOM node once anim is over...
		 	$('section.in').removeClass('in');
			
			next();
		}); //eo queue
		$('section.'+cat).addClass('active');
		
		//$('section:not(.active)').remove(); 
		
		//Once the anim is over, destroy the old sectoin node...
		//$('.graph_home.centered')
		
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
		
		this.get('/#/:lang', function (context) {// LOAD ROUTE (homepage)
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.render('templates/section_home.html', {lang: lang})
        .appendTo(context.$element('#sections')).then(function(content) {
					loadSection(context, 'home'); 
				

					$('.graph_home.centered').delay(1000).queue(function(next){
						$('.graph_home.centered').removeClass('centered'); //animate homepage circles to take their places...
						$('section.home p.invisible').removeClass('invisible');
						next();
					}); //eo queue
					//sortContent(context);
				});		
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
			
			if($('section.portfolio').length <= 0){// if main PF section isn't loaded yet...
				 context.render('templates/section_portfolio.html', {lang: lang})
	        .appendTo(context.$element('#sections')).then(function(content) {
						loadSection(context, 'portfolio'); 
				
						//sortContent(context);
						loadPortfolio(context, context.sub); //we then init the portfolio caroussel.

						//alert("pf = " + sammy.pf['test']['desc_fr']);

					});	// eo render
			}else{
				loadPortfolio(context, context.sub);
			}

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
			
			if($('section.equipe').length <= 0){// if main PF section isn't loaded yet...
				 context.render('templates/section_equipe.html', {lang: lang})
	        .appendTo(context.$element('#sections')).then(function(content) {
						loadSection(context, 'equipe'); 
						
						//sortContent(context);
						loadBio(context, context.sub); //we then init the portfolio caroussel.
					});	// eo render
			}else{
				loadBio(context, context.sub);
			}
		}); //eo route
		
		
		
		// SERVICE
		// --------------------------------------------

		this.get('/#/:lang/services', function (context) {// LOAD ROUTE (homepage)
			alert('services ROUTE!');
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			context.render('templates/section_service.html', {lang: lang})
        .appendTo(context.$element('#sections')).then(function(content) {
					loadSection(context, 'service'); 
				
					//sortContent(context);
					
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
						}, 2000); //2 seconds rotating anim
				
					
				});		
		});
		
		this.get('/#/:lang/contact', function (context) {  //CONTACT	
			if(lang != this.params['lang']){ 
				setLang(this.params['lang']);
				refreshHeader(context);
			}
			
			context.render('templates/section_contact.html', {lang: lang})
        .appendTo(context.$element('#sections')).then(function(content) {
					loadSection(context, 'contact'); 
					
						
					//sortContent(context);
					//TODO: bind event specefic to this section!
				});		
		}); //end "get #/"
	
		
		
	});//eo sammy routes



	//TODO: cgheck if cookie exists here, and redirect to right language page accordingly.
	setLang('undef'); //HARDCODED!
	sammy.run('/#/fr');

}); //eo doc ready


