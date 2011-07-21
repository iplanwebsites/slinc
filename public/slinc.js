



$(document).ready(function() {

	
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


			});//eo sammy routes



	//TODO: cgheck if cookie exists here, and redirect to right language page accordingly.
	sammy.run('/#!/fr');

}); //eo doc ready


