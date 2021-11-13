  jQuery(document).ready(function($) 
 {
 	///////////////////  stokage des données dans un objet
	var  datasave = new Object(); datasave.periode =[]; datasave.options =[]; datasave.adultes =[];
	datasave.enfantmoins2ans=[]; datasave.enfantplus2ans=[]; datasave.options.choix=[];
	
 	
	function getDate( element ) {
     	var date;
      	try {
        	date = $.datepicker.parseDate( dateFormat, element.value );
      	} 
      	catch( error ) {
        	date = null;
      	}
 		return date;
    }
    ////////////////////////
    var dynamicCSSRules = [];
	function addCSSRule(rule) {
    	if ($.inArray(rule, dynamicCSSRules) == -1) {
        	$('head').append('<style>' + rule + '</style>');
       		dynamicCSSRules.push(rule);
    	}
	}
    	////////////
    	var disableddates = [], $class_range ="";
    	function add_loading_message(tagSelect){ 
		if (!$('body > div.customstyle').length){ $('body').append('<div class="customstyle"></div>');}  		
    		$(tagSelect).addClass('wait-loading'); var offset = $(tagSelect).offset();
    		var htmlplus='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+tagSelect+'::after{width:'+$(tagSelect).width()+'px; height:'+$(tagSelect).height()+'px; display: block;} </style>';
    		$('body > div.customstyle').html(htmlplus+' <style> div.customstyle{display: none;z-index: 50; left:'+offset.left+'px; top:'+offset.top+'px; margin-top:'+$(tagSelect).height()*0.45+'px; margin-left:'+$(tagSelect).width()*0.42+'px;} </style>');
    		
    	}
     function remove_loading_message(tagSelect){	
     	setTimeout(function () {
     		$(tagSelect).removeClass('wait-loading'); var offset = $(tagSelect).offset();
     		var htmlplus='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+tagSelect+'::after{width:'+$(tagSelect).width()+'px; height:'+$(tagSelect).height()+'px; display: none;} </style>';
    			$('body > div.customstyle').html(htmlplus+' <style> div.customstyle{display: none;z-index: -1; left:'+offset.left+'px; top:'+offset.top+'px; margin-top:'+$(tagSelect).height()*0.45+'px; margin-left:'+$(tagSelect).width()*0.42+'px;} </style>');
     		
     		},2000);
     }
     //////////
     function load_general_info() {
    		var userUID =0, action='generalinfo', reponse=''; 
    		$.ajax({
           url: '/reservation/content/' + userUID+'/'+action+'/4/5/6', // This is the AjAX URL 
           method: "GET",
           //data: { numberOfItems : 10 }, // Set the number of Li items requested
           //dataType: "json",          // Type of the content we're expecting in the response
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {	console.log("exécution complete avec succes"); }
         });
         return reponse;
         };
         //console.log(load_general_info());
         var generalinfo = load_general_info();
     /////	
    	function load_days_not_valid() {
    		add_loading_message('#ui-datepicker-div');
    		var userUID =0, action='arraydaysnotvalid', reponse=''; 
    		$.ajax({
           url: '/reservation/content/' + userUID+'/'+action+'/4/5/6', // This is the AjAX URL set by the createupdatecontent Module
           method: "GET",
           //data: { numberOfItems : 10 }, // Set the number of Li items requested
           //dataType: "json",          // Type of the content we're expecting in the response
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {	console.log("exécution complete avec succes"); remove_loading_message('#ui-datepicker-div'); }
         });
         return reponse;
         };
    	///// Texte
    	//	console.log(load_days_not_valid()['data']);
    	/////	
    	function load_date_by_price(n) {
    		var userUID =0, action='loaddateprice', reponse=''; 
    		$.ajax({
           url: '/reservation/content/' + userUID+'/'+action+'/'+n+'/5/6', // This is the AjAX URL set by the createupdatecontent Module
           method: "GET",
           //data: { numberOfItems : 10 }, // Set the number of Li items requested
           //dataType: "json",          // Type of the content we're expecting in the response
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {	/* console.log("exécution complete avec succes"); remove_loading_message('#ui-datepicker-div');*/ }
         });
         return reponse;
         };
         //console.log(load_date_by_price());
         var d = new Date(),n = d.getMonth() + 1;if(n<10){n= '0'+n;}
	    var cellContents=load_date_by_price(n)['data'];
	    //console.log(cellContents);
      //////////////////////
    	disableddates=load_days_not_valid()['data'];
    	//console.log(disableddates);
    	$('#ui-datepicker-div ').on("click", ".ui-datepicker-header a", function() { alert('click'); concole.log('log cclik');});
    	/////////////////*******************************/////////////////////
    	function DisableSpecificDatesArrive(date) { 
    		
    		var string = jQuery.datepicker.formatDate('dd-mm-yy', date );
    	////////// pour ajouter un attribut à la balise a ////////////////////////
  		////////pour afficher les informations de manieres sécurisé
    	setTimeout(function () {
        	//Fill this with the data you want to insert (I use and AJAX request).  Key is day of month  //NOTE* watch out for CSS special characters in the value
        	//var cellContents = {1: '80 €', 15: '80 €', 28: '80 €'};
			//Select disabled days (span) for proper indexing but // apply the rule only to enabled days(a)
			var moisInt= {'Janvier':'01', 'Février':'02', 'Mars':'03', 'Avril':'04', 'Mai':'05', 'Juin':'06', 'Juillet':'07', 'Août':'08', 'Septembre':'09', 'Octobre':10, 'Novembre':11, 'Décembre':12};
			
			var mois =$('.ui-datepicker .ui-datepicker-month').text(); //console.log('mois : '+mois);
			var annee=$('.ui-datepicker .ui-datepicker-year').text();
        	$('.ui-datepicker td > *').each(function (idx, elem) {
        		var jour = idx + 1;if (jour<10){jour='0'+jour;} if (mois<10){mois='0'+5;}   var indexDay=jour+'-'+moisInt[mois]+'-'+annee;
        		var value =  generalinfo['data'][1]['data_order'];///prix par défaut
        		//console.log(generalinfo['data'][1]['data_order']);
        		//console.log('cellContents : ' ); console.log(cellContents);
        		if (cellContents && cellContents[indexDay]) {value =cellContents[indexDay]['montant'];}///	prix supplanter
            	// console.log('jour : '+$(this).text());
				// dynamically create a css rule to add the contents //with the :after                         
  				// selector so we don't break the datepicker //functionality 
            	var className = 'datepicker-content-' + CryptoJS.MD5(value).toString();
				if(value == 0)
                	addCSSRule('.ui-datepicker td a.' + className + ':after {content: "\\a0";}'); //&nbsp;
            	else
                	addCSSRule('.ui-datepicker td a.' + className + ':after {content: "' + value + ' €";}');
                	addCSSRule('.ui-datepicker td span.' + className + ':after {content: "' + value + ' €";}');
				$(this).addClass(className);
        	});
    	}, 0);
  		/////////////////////////////////////////////
    	// pour désactivez les dates déjà reverser //////////////////////////////
    	$reserver=false;
    	$.each(disableddates, function( key, elem ) {
    		if( elem.day== string && elem.arrive){$reserver=true;}
    	});
    	if($reserver)
    	{	return [false, "occuper", "Déjà réservée "];///occupé
    	}
    	else {
    		// permet de masquer les dates anterieurs à la date d'aujourdui. pour kelle ne soit plus sélectionnable.
    		if (new Date() < date || jQuery.datepicker.formatDate('dd-mm-yy', new Date() ) == string) {
    			if ($datedepart.attr("date-plage") == 'auto') {
    					if ($datedepart.attr("date-complete") == 'encourt') {$class_range="";}
    				if ($datearriver.val() == string && ( $datedepart.val() != $datearriver.val() ) ) { 
    					if ($datedepart.attr("date-complete") == 'complet') {$class_range="plage-select";}
    					return [true, "reservable plage-begin plage-hover", " Date d'arriver "];
    				}else
    				{
    					if($datedepart.val() == string)
    					{
    						$class_range="";
    						return [true, "reservable plage-end plage-hover", " Date de départ "];
    					}
    				 	else{
    						return [true, 'reservable plage-hover '+$class_range, "réservez maintenant"];
    					}
    				}
    			}
    			else{
    				return [true, "reservable", "réservez maintenant"];
    			}
    		}else {
    			return [false, "nonreservable ", "Vous ne pouvez plus réserver"];
    		}
    	}
	}
		/////////////////*******************************/////////////////////
    	function DisableSpecificDatesDepart(date) { 
    		
    		var string = jQuery.datepicker.formatDate('dd-mm-yy', date );
    	////////// pour ajouter un attribut à la balise a ////////////////////////
  		////////pour afficher les informations de manieres sécurisé
    	setTimeout(function () {
        	//Fill this with the data you want to insert (I use and AJAX request).  Key is day of month  //NOTE* watch out for CSS special characters in the value
        	//var cellContents = {1: '80 €', 15: '80 €', 28: '80 €'};
			//Select disabled days (span) for proper indexing but // apply the rule only to enabled days(a)
			var moisInt= {'Janvier':'01', 'Février':'02', 'Mars':'03', 'Avril':'04', 'Mai':'05', 'Juin':'06', 'Juillet':'07', 'Août':'08', 'Septembre':'09', 'Octobre':10, 'Novembre':11, 'Décembre':12};
			
			var mois =$('.ui-datepicker .ui-datepicker-month').text(); //console.log('mois : '+mois);
			var annee=$('.ui-datepicker .ui-datepicker-year').text();
        	$('.ui-datepicker td > *').each(function (idx, elem) {
        		var jour = idx + 1;if (jour<10){jour='0'+jour;} if (mois<10){mois='0'+5;}   var indexDay=jour+'-'+moisInt[mois]+'-'+annee;
        		var value =  generalinfo['data'][1]['data_order'];///prix par défaut
        		//console.log(generalinfo['data'][1]['data_order']);
        		//console.log('cellContents : ' ); console.log(cellContents);
        		if (cellContents && cellContents[indexDay]) {value =cellContents[indexDay]['montant'];}///	prix supplanter
            	// console.log('jour : '+$(this).text());
				// dynamically create a css rule to add the contents //with the :after                         
  				// selector so we don't break the datepicker //functionality 
            	var className = 'datepicker-content-' + CryptoJS.MD5(value).toString();
				if(value == 0)
                	addCSSRule('.ui-datepicker td a.' + className + ':after {content: "\\a0";}'); //&nbsp;
            	else
                	addCSSRule('.ui-datepicker td a.' + className + ':after {content: "' + value + ' €";}');
                	addCSSRule('.ui-datepicker td span.' + className + ':after {content: "' + value + ' €";}');
				$(this).addClass(className);
        	});
    	}, 0);
  		/////////////////////////////////////////////
    	// pour désactivez les dates déjà reverser //////////////////////////////
    	$reserver=false;
    	$.each(disableddates, function( key, elem ) {
    		if( elem.day== string && elem.depart){$reserver=true;}
    	});
    	if($reserver)
    	{	return [false, "occuper", "Déjà réservée "];///occupé
    	}
    	else {
    		// permet de masquer les dates anterieurs à la date d'aujourdui. pour kelle ne soit plus sélectionnable.
    		if (new Date() < date || jQuery.datepicker.formatDate('dd-mm-yy', new Date() ) == string) {
    			if ($datedepart.attr("date-plage") == 'auto') {
    					if ($datedepart.attr("date-complete") == 'encourt') {$class_range="";}
    				if ($datearriver.val() == string && ( $datedepart.val() != $datearriver.val() ) ) { 
    					if ($datedepart.attr("date-complete") == 'complet') {$class_range="plage-select";}
    					return [true, "reservable plage-begin plage-hover", " Date d'arriver "];
    				}else
    				{
    					if($datedepart.val() == string)
    					{
    						$class_range="";
    						return [true, "reservable plage-end plage-hover", " Date de départ "];
    					}
    				 	else{
    						return [true, 'reservable plage-hover '+$class_range, "réservez maintenant"];
    					}
    				}
    			}
    			else{
    				return [true, "reservable", "réservez maintenant"];
    			}
    		}else {
    			return [false, "nonreservable ", "Vous ne pouvez plus réserver"];
    		}
    	}
	}
	////////////////////////////////////////////////////////////////////////////
    var minDate = "-12m", $jourSemaine ="";
	var $datearriver = $('#edit-submitted-periode-date-darriver')
	.datepicker({
	//altField: "#datepicker",
	closeText: 'Fermer',
	prevText: 'Précédent',
	nextText: 'Suivant',
	currentText: 'Aujourd\'hui',
	monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
	dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
	dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
	dayNamesMin: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
	weekHeader: 'Sem.',
	dateFormat: 'dd-mm-yy',
	showAnim: "drop",
	firstDay: 1,
	minDate:  minDate,
	maxDate: "+12m",
	numberOfMonths: [ 1, 1 ],
	showButtonPanel: false,
	onChangeMonthYear:function(year, month, inst) {
		$('body > div.customstyle').css('display','block');
		disableddates=load_days_not_valid()['data'];
	},
	//currentText: "Now",
	//showButtonPanel: true,
	//changeMonth: true,
	beforeShowDay: DisableSpecificDatesArrive,
	onSelect: function( selectedDate ) {
		//$(this).data('datepicker').inline = true;//pour maintenir la fenetre ouverte apres selection
		
		minDate =  $datearriver.val();
        minDate =  minDate.split('-');
        minDate[0] = minDate[0];
        minDate = new Date (minDate[2], minDate[1]-1 , minDate[0] );
        $jourSemaine = minDate.getDay();
        if ($jourSemaine==5 || $jourSemaine==6) {minDate = new Date(minDate.getTime() + (60*60*24*1000)*2 );}
        else {minDate = new Date(minDate.getTime() + (60*60*24*1000)*1 );}
        $datedepart.datepicker( "option", "minDate", minDate );
        //console.log( minDate );
        setTimeout(function(){
        	/// verification de la date
            $datedepart.datepicker('show');
        }, 16);
        $datedepart.attr("date-plage",'auto');
        $datedepart.attr("date-complete",'encourt');
        recapitulatif();
        
    },
    onClose: function() {
    	//$(this).data('datepicker').inline = false;//pour maintenir la fenetre ouverte apres selection
	}
    })/*
	.on( "change", function() {
          $datedepart.attr("date-plage",'auto');
    })*/;
    var $datearriver_select ='', $datedepart_select = '', nombrejour =0, $datearriver_select2='', $datedepart_select2='' ;
    var $datedepart = $('#edit-submitted-periode-date-depart')
	.datepicker({
	//altField: "#datedepart",
	closeText: 'Fermer',
	prevText: 'Précédent',
	nextText: 'Suivant',
	currentText: 'Aujourd\'hui',
	monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
	dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
	dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
	dayNamesMin: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
	weekHeader: 'Sem.',
	dateFormat: 'dd-mm-yy',
	firstDay: 1,
	showAnim: "drop",
	minDate:  minDate,
	maxDate: "+9m",
	numberOfMonths: [ 1, 1 ],
	onChangeMonthYear:function(year, month, inst) {
		$('body > div.customstyle').css('display','block');
		disableddates=load_days_not_valid()['data'];
	},
	beforeShowDay: DisableSpecificDatesDepart,
	onSelect: function( selectedDate ) {
		$datedepart.attr("date-complete",'complet');
		$datearriver_select =  $datearriver.val();
		$datearriver_select =  $datearriver_select.split('-');
		$datearriver_select2 = new Date ($datearriver_select[2], $datearriver_select[1]-1 , $datearriver_select[0] );
		$jourSemaine = $datearriver_select2.getDay();
		$datearriver_select=$datearriver_select[2] + $datearriver_select[1]-1 + $datearriver_select[0];
		//////
		$datedepart_select =  $datedepart.val();
		$datedepart_select =  $datedepart_select.split('-');
		$datedepart_select2 = new Date ($datedepart_select[2], $datedepart_select[1]-1 , $datedepart_select[0] );
		$datedepart_select = $datedepart_select[2] + $datedepart_select[1]-1 + $datedepart_select[0] ;
		//////////////////////
		if (
				($jourSemaine==5 || $jourSemaine==6) &&
				($datearriver_select == $datedepart_select)
		   ) 
		{
			alert(' La sélection unique du vendredi ou du samedi est refuser. ');
			//console.log(' Ce format n\'est pas valide ' );
			$(this).data('datepicker').inline = true;//pour maintenir la fenetre ouverte apres selection
		}else{$(this).data('datepicker').inline = false;}
        //console.log($datearriver_select);
        //console.log($datedepart_select);
        recapitulatif();
    },
    onClose: function() {
    	$(this).data('datepicker').inline = false;//pour maintenir la fenetre ouverte apres selection
	},
	//showButtonPanel: false,
	//changeMonth: true,
	})
	.on( "change", function() {
          //$datearriver.datepicker( "option", "maxDate", getDate( this ) );
    });
    /////////////////////////////// ajout du background au rouge ///////////////////////
    ///////////////
    function recapitulatif() {
    	//// vider le champ vide 
    	$('#recapitulatif .vide').html(' ').css('display','none');
    	/// affiche la periode et les options
    	setTimeout(function () {
    		if ($datedepart.val() && $datearriver.val()  ) {
    			    nombrejour = $datedepart_select2.getTime() - $datearriver_select2.getTime() ; 
    			    nombrejour = (nombrejour/( 1000*60*60*24 )) ;
    			    if (nombrejour > 1) {
    			    		var pricejour=0;datasave.periode.label='nuits';
    			    		for (var iter=0; iter < nombrejour; iter++) {
    			    			var dt = new Date($datearriver_select2.getTime() + (60*60*24*1000)*iter );
    			    			var string = jQuery.datepicker.formatDate('dd-mm-yy', dt );
    			    			if (cellContents && cellContents[string]) {pricejour=pricejour + parseInt(cellContents[string]['montant']);}else {pricejour= pricejour +parseInt(generalinfo['data'][1]['data_order']);}
    			    			
    			    		}
    					$('#recapitulatif .periode').html('<strong>'+nombrejour+'</strong> nuits, du '+$datearriver.val().replace(/\-/g, '/')+' au '+$datedepart.val().replace(/\-/g, '/')+' <div class="price"><strong>Prix :</strong> <span class="price">'+ pricejour +'</span> €</div> ');
    					
    				}
    				else {var pricejour=0;datasave.periode.label='nuit';
    					var dt = new Date($datedepart_select2.getTime()  );
    					var string = jQuery.datepicker.formatDate('dd-mm-yy', dt );
    					if (cellContents && cellContents[string]) {pricejour=pricejour + parseInt(cellContents[string]['montant']);}else {pricejour= pricejour +parseInt(generalinfo['data'][1]['data_order']);}
    					$('#recapitulatif .periode').html('<strong> 1 </strong> nuit, le '+$datearriver.val().replace(/\-/g, '/')+' <br> <strong>Prix :</strong> <span class="price">'+ pricejour +'</span> €  ');
    				}
    				
    				
    				datasave.periode.nombre = nombrejour;
    				datasave.periode.price = pricejour;
    				datasave.periode.datedebut = $datearriver.val().replace(/\-/g, '/');
    				datasave.periode.datefin = $datedepart.val().replace(/\-/g, '/');
    				
    				//console.log('date select');$('h1').text( $('h1').text().replace(/\$/g, '€') );
    				//console.log($datearriver_select2);
    				//console.log($datedepart_select2); 
    				
    				/////////////////////////////////////////////////////
    				///////// les options
    				//nombre de liste    				
    				var nbreListe = generalinfo['data'][16]['data_image_externe'], listesOptions=[],nbreAdultes=1,pricedejeuner=generalinfo['data'][16]['price'];
    				//' <option value="" >- Aucun(e) -</option><option value="1" selected="selected">1</option> <option value="2">2</option> <option value="3">3</option>	<option value="4">4</option> <option value="5">5</option>';
    				for (var i=0; i<=nbreListe; i++){ if(i==0){listesOptions.push('<option value="Aucun" > Aucun </option>');}else{ if(i==1){listesOptions.push('<option value="'+i+'" selected="selected">'+i+'</option>');}else {listesOptions.push('<option value="'+i+'">'+i+'</option>');} } }
    				var nbreListe = generalinfo['data'][16]['texte_singulier'];///nombre de liste dans le select
    				var listes ='';
    				for (var iter=0; iter < nombrejour; iter++) {
    						var dt = new Date($datearriver_select2.getTime() + (60*60*24*1000)*iter );
    						var string = jQuery.datepicker.formatDate('dd/mm', dt );
    						//console.log(dt);
    						listes += '<li class="form-item webform-component">';
  							listes += '		<label for="cbox'+iter+'" style="display: inline-block;"> '+generalinfo['data'][16]['texte_singulier']+' '+ string +' ('+pricedejeuner+' euros) </label>';
 							//listes += '		<input type="checkbox" id="cbox'+iter+'" name="submitted[option_cbox_'+iter+']" value="checkbox'+iter+'" checked>';
							//var argsString = listes.join('/'); 							
 							//console.log(listesOptions.join(''));
 							listes += '<select id="cbox'+iter+'" name="submitted[option_cbox_'+iter+']" class="form-select smallselect">'+ listesOptions.join('') +'</select>';
 							datasave.options.choix['choix_'+iter]=1;
 							datasave.options.choix['day_'+iter]=string;
							listes += '</li>';
    					}
    					var valeur3 = $('.webform-component--setting-user .selectNombreAdultes').val();
    					if (valeur3>1) {nbreAdultes=valeur3;}else {nbreAdultes=1;}
    				$('form div #options ').html('<fieldset> <legend>Options</legend> <div class="form-item webform-component"> <ul>'+listes+'</ul> </div> </fieldset>');
    				//$('#recapitulatif .option').html('<strong> '+generalinfo['data'][16]['texte_singulier']+' : </strong> <span class="price">'+ nbreAdultes*nombrejour*pricedejeuner +'</span> €');
    				
    				datasave.options.price = nbreAdultes*nombrejour*pricedejeuner;
    				datasave.options.label = generalinfo['data'][16]['texte_singulier'];
    				datasave.options.nombre = nombrejour; var optionhtml='';
    				if (datasave.options.choix) {	
  					for (var k=0; k<nombrejour; k++) {
  						//html += '<strong>'+ elem.label +'</strong> '+elem.choix['day_'+k]+'  : '+elem.choix['choix_'+k]+'   <br>';
  						optionhtml += '<strong> '+datasave.options.label+' '+datasave.options.choix['day_'+k]+' </strong> : '+datasave.options.choix['choix_'+k]+' <br> ';
  					}
  				}
  				$('#recapitulatif .option').html(optionhtml);
  				checkpersonnelinfo();
    				//console.log(datasave);
    				checktotal();
    		}
    	}, 150);
    	//// affiche les opions
    	
    }
    //////////////////////////////////////////////////////////////****************************
    //////////////////// les options du petit-déjeuner
    function checkoptions() {
    		var checked =0, checkedtable=[], i=0,nbreAdultes=1,pricedejeuner=generalinfo['data'][16]['price'], select=[],k=0,optionhtml='';
    		
    		var atLeastOneIsChecked = $('form div #options li select ').length;/*
    		$('form div #options li input ').each(function( index ) {
  			if( $(this).prop("checked") ){checked++;}
		});*/ 
		$('form div #options li select ').each(function( index ) {
  			//if( $(this).prop("checked") ){checked++;}
  			var choix = parseInt($(this).val());
  			if( choix > 0 ){checkedtable[i] = choix; i++;}
  			select[index] = $(this).val();
		});
		//console.log(select);
		//console.log(checkedtable); 
		for( i=0; i<atLeastOneIsChecked; i++ ){ if(checkedtable[i]>0){checked = checkedtable[i] + checked; } }
		if (datasave.options.choix && datasave.options.choix['day_0']) {	var optionhtml='';
  					for (var k=0; k<datasave.options.nombre; k++) {datasave.options.choix['choix_'+k]=select[k];
  						//html += '<strong>'+ elem.label +'</strong> '+elem.choix['day_'+k]+'  : '+elem.choix['choix_'+k]+'   <br>';
  						optionhtml += '<strong> '+datasave.options.label+' '+datasave.options.choix['day_'+k]+' </strong> : '+datasave.options.choix['choix_'+k]+' <br> ';
  					}
  				}
    		//if(checked > 0){$('#recapitulatif .option').html('<strong> Petit-déjeuner : </strong>'+ nombrejour*5 +' €');}
    		var valeur3 = $('.webform-component--setting-user .selectNombreAdultes').val();
    		if (valeur3>1) {nbreAdultes=valeur3;}else {nbreAdultes=1;}
    		//$('#recapitulatif .option').html('<strong> '+generalinfo['data'][16]['texte_singulier']+' : </strong> <span class="price">'+ nbreAdultes*checked*pricedejeuner +'</span> €');
    		$('#recapitulatif .option').html(optionhtml);
    		datasave.options.price = nbreAdultes*checked*pricedejeuner;
    		//console.log(datasave);
    		checktotal();
    }
	
	 //////////////////////////////////////////////////////////////****************************
    //////////////////// paramettres du client
	function checkpersonnelinfo() {
		var html ='',accord='',price2=0,price3=0, monnaie='€';
		var valeur1 = $('.webform-component--setting-user .selectNombreEnf2moins').val();
		var valeur2 = $('.webform-component--setting-user .selectNombreEnf2plus ').val();
		var valeur3 = $('.webform-component--setting-user .selectNombreAdultes').val();
		
		if (valeur3) { 
			if (valeur3>1){accord=generalinfo['data'][1]['texte_plurier'];}
			else{accord=generalinfo['data'][1]['texte_singulier'];} 
			html +='<strong>'+ valeur3 +' '+accord+' </strong>'; 
			datasave.adultes.nombre =valeur3;
			datasave.adultes.label = accord;
			checkoptions();
			}
		if (valeur1) { 
			if (valeur1>1){accord=generalinfo['data'][2]['texte_plurier'];}
			else{accord=generalinfo['data'][2]['texte_singulier'];} 
			if (generalinfo['data'][2]['display_price'] && generalinfo['data'][2]['price'] > 0) 
			{ price2 = valeur1 * generalinfo['data'][2]['price']; monnaie='€';}
			else { price2 = generalinfo['data'][2]['price'];monnaie='';}
			datasave.enfantmoins2ans.price = price2;// (price2 > 0)?price2:0;
			datasave.enfantmoins2ans.nombre =valeur1;
			datasave.enfantmoins2ans.label = accord;
			datasave.enfantmoins2ans.monnaie= monnaie;
			html +='<div > <strong>'+ valeur1 +'  '+accord+'  :</strong> <span class="price">'+ price2 +'</span> '+ monnaie +'</div>';
		}
		if (valeur2) { 
			if (valeur2>1){accord=generalinfo['data'][3]['texte_plurier'];}
			else{accord=generalinfo['data'][3]['texte_singulier'];}
			if (generalinfo['data'][3]['display_price'] && generalinfo['data'][3]['price'] > 0) 
			{ price3 = valeur2 * generalinfo['data'][3]['price']; monnaie='€';} 
			else { price3 = generalinfo['data'][3]['price'];monnaie='';}
			datasave.enfantplus2ans.price = (price3 > 0)?price3:0;
			datasave.enfantplus2ans.nombre =valeur2;
			datasave.enfantplus2ans.label = accord;
			datasave.enfantplus2ans.monnaie= monnaie;
			html +='<div > <strong>'+ valeur2 +' '+accord+'  :</strong> <span class="price">'+ price3 +'</span> '+ monnaie +' </div>';}
			$('#recapitulatif .personnelinfo').html(html);
			$('#recapitulatif .vide').html(' ').css('display','none');
			checktotal();
		}
	//////////////////////////////////////////////////////////////****************************	
	//////////////////////////////////// cacult total
	function checktotal() {
		var totale =0, price=0, html='<div style="padding: 10px;border: 1px solid #eee;">',m='€', n=''; 
		 /// calcul du total avec les classes
		 /*
		$('#recapitulatif span.price').each( function (index) {
			//console.log('price : '+$(this).text());
			price =parseInt($(this).text());
			if (price > 0) { totale +=price;}
			console.log(totale);
		});
		totale =0; */
		$.each(datasave, function( key, elem ) {
  			if (elem.price && elem.price > 0 ) { totale=totale + elem.price; }
  			if (key=='periode' && elem.label) {html += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> : du '+elem.datedebut+' au '+elem.datefin+' : '+elem.price+' € </p>'; }
  			if (key=='options' && elem.label) {
  				
  				//html += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.label +'</strong> :  '+elem.price+' € </p>'; ///total petit déjeuner
  				html += '<p style="padding: 5px 0 5px 0; margin: 0;">';
  				if (elem.choix) {var nbre = (elem.nombre)?elem.nombre:0; //console.log(elem.choix); console.log('nbre : '+nbre);
  					for (var k=0; k<nbre; k++) {
  						html += '<strong>'+ elem.label +'</strong> '+elem.choix['day_'+k]+'  : '+elem.choix['choix_'+k]+'   <br>';
  					}
  				}
  				html += '</p>';
  			}
  			if (key=='adultes' && elem.label) {html += '<p style="padding: 0 0 5px 0; margin: 0;"> <strong>'+ elem.nombre +' '+ elem.label +'</strong> </p>'; } 
  			if (key=='enfantmoins2ans' && elem.label) {html += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> :  '+elem.price+' '+ elem.monnaie +' </p>'; }
  			if (key=='enfantplus2ans' && elem.label) {html += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> :  '+elem.price+' '+ elem.monnaie +' </p>'; }
  			 
		});
		html += '<p style="padding: 10px 0px 5px 0; margin: 10px 0 0px 0;  font-size: +150%; border-top: 1px solid #ccc;"><strong>Total</strong> : '+totale+' € </p> </div>';
		$('#edit-submitted-recapitulatif').html(html);
		$('#recapitulatif .totalprice').html('<strong> Total : </strong>'+ totale +' '+m +'<br>');
		/// ajout des données dans le champs texarea
		/*
		var datarecap = $('#recapitulatif').html();
		$('#edit-submitted-recapitulatif').html(datarecap);
		*/
		
	}
	
	
	//////////////////////////////// les actions  **************************** 
	//// options
	$('form div #options').on( "click", "select", function() {
		checkoptions();
	});
	/// à propos du client
	$('.webform-component--setting-user .selectNombreEnf2moins, .webform-component--setting-user .selectNombreEnf2plus , .webform-component--setting-user .selectNombreAdultes').on("change",function() {
		checkpersonnelinfo(); 
	});
	/// delete data into field dates
	$('#edit-submitted-periode-date-darriver').val(null);
	$('#edit-submitted-periode-date-depart').val(null);
	
	
});





