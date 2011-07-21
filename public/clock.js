/*

TODO

download a font package from font-squirrel (cachable)

Update time in clocks (setInterval, on seconds, we update GMT, and then refresh the clocks...)

make the separator (:) blink (toggle aclass?)

arrow cursor on text (bar is ugly)

re-order clock so they appear in chronologic order (past -present - future)

if the clock already exist, dont add it again...



position and stretch the clocks all dynamically, so they always fill all the screen: 
 - may not be possible to keep everything relative in size
 - can the canvas be stretched: yes, but there aliasing, it's not vector...

find a "slugify" function, and use it to generate IDS based on name (lowercase, and special_chars_cleanup)


Autocomplete: 
 - when user press enter on suggestion, submit!
 - maybe auto-fill the field (instead of simply suggesting under...)

set a BG image on the delete submit button..

On a mouse device only, we only show the delete option when the clock is overed (it shows option).
 - On touch device, options are always there, or just hidden (simpler app.)


12/24 format
 - bind js action onto these buttons
 - should it submit a form? no, just a post... can it be radios???
 - radio that autosubmit the form when changed...


*/

/*

function foo() {
	document.getElementById('clock').textContent = new Date();
	setTimeout(foo, 100);
}
*/

function removeDuplicateElement(arrayName)
  {
  var newArray=new Array();
  label:for(var i=0; i<arrayName.length;i++ )
  {  
  for(var j=0; j<newArray.length;j++ )
  {
  if(newArray[j]==arrayName[i]) 
  continue label;
  }
  newArray[newArray.length] = arrayName[i];
  }
  return newArray;
}



function updateTime(){
	var here = new Date();
	var offset = here.getTimezoneOffset(); //returns 120 for 2 hours.
	gmt = new Date();
	gmt.setTime(here.getTime() + (offset*60000) );
	
	if( gmt.getSeconds() == 0){
		$('.clock').trigger('minuteChange'); //TODO: only call when minute change!
	}
	
	if( gmt.getSeconds() % 2 == 0){
		$('.clock .sep').addClass('active');
	}else{
		$('.clock .sep').removeClass('active');
	}
	//TODO!! - debug this code...
	$('.city-time .format.active').removeClass('active');
	$('.city-time .format .ampm').addClass('active');
}



$(document).ready(function() {
	
	
	//sammy put route for the submit...
	
	
	
	//Load Json - init...
	$.getJSON('data/timezones.json', function(data) { //cached...
			sammy.tz = data;  
	});
	
	$.getJSON('data/cities.json', function(data) { //cached...
		sammy.cities = data;  
		var autocompleteItem = [];
	  $.each(data, function(key, val) {
	    autocompleteItem.push(val['ci']); //city name
			autocompleteItem.push(val['z']); //zone name
	  });
		autocompleteItem = removeDuplicateElement(autocompleteItem);
		
		// We init the auto-complete once we gathered all city + zones names.
		$("input#q").autocomplete({
			source: autocompleteItem,
			minLength: 1,
			delay: 0
		});
	});// eo get Json (init)
	
	
	setInterval(function() {
		updateTime();
	  // Do something every 1 seconds
	}, 1000);
	

updateTime();
	
	
	sammy = Sammy('body', function () {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);

		// LOAD ROUTE (homepage)
		this.get('/', function (context) {
			
			//rebuild clocks from cookie...
			
			CoolClock.findAndCreateClocks(); //create canvas for analog clocks.
			
		}); //end "get #/"
    
		
		this.put('#/put/format', function (context) {
				var time_format = this.param['format']; //either metric, or ampm
			$('.city-time .format.active').removeClass('active');
			$('.city-time .format .ampm').addClass('active');
			alert('setting 12/24 to');
			// !! TODO!
			// There are 2 things! the format, and the am and pm toggling, handle am-pm in time management
			
			
		}); //end format route
		
		
		
		
		/////ADD ROUTE
		this.post('#/post/q', function(context) {
			//sammy.trigger('show-page', {page: 'links'});
			str = this.params['q'];
			$('#q').val('').focus();
			
		//	var matchingItems = [];
			newCity = 0;
			possibleCities = [];
		  $.each(sammy.cities, function(key, val) {
				cityname = val['ci'];
				country = val['co'];
				
				//alert("str = "+ str);
				if(str.toLowerCase() == cityname.toLowerCase()){ //todo, lowercase the comparaison, replace the dashes...
					//perfect match!
					//alert("perfect!" + val);
					newCity = val;
				}else if(0){ //we find if it may be a possible match: clean comas...
					if(str){	//indexof, without coma...
						possibleCities.push(val); //!!TOOD correct it
					}
				}else{
					//else we display the found options...
					//let the user pick...?
				}
			});//eo cities for each
			
				if(newCity){ //flag: if we found a good match, good enought to add it without further disambiguation...
					//We find which TZ this city relates to, and add it to the object.
					
					 $.each(sammy.tz, function(index_tz, data_tz) {
							if(data_tz['name'] == newCity['z']){ 
								//alert('name matches!' + newCity);
								newCity['tz'] = data_tz; //we embed the timezone object within the city one
							}else{
								//No timezone found for this city...
							}
					});//eo each tz
					
					//setting the display name (top of the box)
					if(! newCity['accronym']){
						newCity['accronym'] = newCity['ci'].strReplace('TODO REGEX: everything after the coma', '');
						newCity['accronym'] = newCity['accronym'].slice(0,8); //TODO: 8 chars maximum...
					}
					
					
					cityTime = new Date();
					//TODO! We should take into account the daylight saving times!!
					cityTime.setTime(gmt.getTime() - ( newCity['tz']['off'] * 60000) );
					
					
					
					//Append to the clock DIV
					context.clocksDiv = context.$element('#clocks');
					//$(context.linkContainer).html('');
          context.render('templates/clock.html', {city: newCity, cityTime: cityTime})
            .prependTo(context.clocksDiv).then(function(content) {
							//TODO: init the analog clock here once the markup is there...
				
							
							$('.clock').bind('minuteChange', function() {
							  //alert('User clicked on "foo."');
								cityTime = new Date();
								//TODO! We should take into account the daylight saving times!!
								var offset = $(this).find('.offset').text();
								cityTime.setTime(gmt.getTime() - ( offset * 60000) );
								$(this).find('.hours').text(cityTime.getHours());
								var strMinutes = cityTime.getMinutes();

								if(strMinutes < 10){ strMinutes = '0'+strMinutes;	} //prepend a zero if 1 digit
								$(this).find('.minutes').text(strMinutes);
								$(this).find('.mili').text(cityTime.getTime());
								//todo: update Analog.
							});
							$('.clock').trigger('minuteChange');
							CoolClock.findAndCreateClocks();
							//init this clock's buttons
							//context.trigger('filter-item'); //if field is already populated (page refresh)
        	});
					
					
				//init the new clock...
				
				
				//alert('here = '+offset+ ':'+here.getHours() + ':'+here.getMinutes() );
					/*  
					var MS_PER_MINUTE = 60000;
					var myStartDate = new Date(myEndDateTime - durationInMinutes * MS_PER_MINUTE);
					
					var d1 = new Date();
					var d2 = new Date(2006, 6, 7);
					var day = 1000*60*60*24;
					var diff = Math.ceil((d2.getTime()-d1.getTime())/(day));
					document.write("Days until vacation: " + diff);
					*/
				}
		    //matchingItems.push(val['ci']); //city name
		 
			
			/*
			if( perfectMatch( str ) ) {	//check if there's a perfect matching city / zone name
				//sammy.trigger('add-url', {url: str});//add URL
				//this.title('added: "'+str+'"');
			}else{
				// this.title('filter: '+str);
				// sammy.trigger('filter-item');
			}*/
			return false; //event.preventDefault(); 
		});
		
		/////DELETE ROUTE
		this.del('#/del/clock', function (context) {
			var toDelete = this.params['clock_name'];
			//remove clock, according to hidden field value!
			alert(toDelete);
			
		}); //end "del #/del/clock"
		
		
	});//eo sammy routes
		
		sammy.run('/');
		
}); //eo doc ready