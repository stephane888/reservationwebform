var config={};
/**
 * Data to load setting module to drupal.
 */
(function ($) {
	  Drupal.behaviors.reservationwebform = {
	    attach: function (context, settings) { config = settings.reservationwebform; }
	  };
}(jQuery));

jQuery(document).ready(function($) {

	//console.log(config);
 	// ///////////////// stokage des données dans un objet
	var  datasave = new Object(); datasave.current_room='chambre ô de mer'; datasave.current_room_label='Chambre ô de mer'; datasave.periode =[]; datasave.options =[]; datasave.adultes =[];
	datasave.enfantmoins2ans = []; datasave.enfantplus2ans=[]; datasave.options.choix=[];
	datasave.html_periode = '';
	datasave.html_room = '';
	datasave.html_options = '';
	datasave.html_personnelinfo = '';
	datasave.html_totalprice = '';
	var position_date = '#edit-submitted-periode-date-darriver';
	/**
	 * Pour verifier si la date precedante etait libre
	 */
	var date_precedante=null;
	//$('.text-format-wrapper').css('display','block');

	/*
	 * //// Renvoit une date pour l'option maxDate function getDate( element ) {
	 * var date; try { date = $.datepicker.parseDate( dateFormat, element.value ); }
	 * catch( error ) { date = null; } return date; }
	 */
	// // ajoute les styles en entete permettant l'affichage du prix.
	var dynamicCSSRules = [];
	function addCSSRule(rule) {	if ($.inArray(rule, dynamicCSSRules) == -1) {$('head').append('<style>' + rule + '</style>'); dynamicCSSRules.push(rule);}	}
    	// // affiche le message d'attente
    	function add_loading_message(tagSelect){
		if (!$('body > div.customstyle').length){ $('body').append('<div class="customstyle"></div>');}
    		$(tagSelect).addClass('wait-loading'); var offset = $(tagSelect).offset();
    		var htmlplus='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+tagSelect+'::after{width:'+$(tagSelect).width()+'px; height:'+$(tagSelect).height()+'px; display: block;} </style>';
    		$('body > div.customstyle').html(htmlplus+' <style> div.customstyle{display: none;z-index: 50; left:'+offset.left+'px; top:'+offset.top+'px; margin-top:'+$(tagSelect).height()*0.45+'px; margin-left:'+$(tagSelect).width()*0.42+'px;} </style>');

    	}
    	// / enleve le message d'attente
     function remove_loading_message(tagSelect){
     	setTimeout(function () {
     		$(tagSelect).removeClass('wait-loading'); var offset = $(tagSelect).offset();
     		var htmlplus='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+tagSelect+'::after{width:'+$(tagSelect).width()+'px; height:'+$(tagSelect).height()+'px; display: none;} </style>';
    			$('body > div.customstyle').html(htmlplus+' <style> div.customstyle{display: none;z-index: -1; left:'+offset.left+'px; top:'+offset.top+'px; margin-top:'+$(tagSelect).height()*0.45+'px; margin-left:'+$(tagSelect).width()*0.42+'px;} </style>');

     		},2000);
     }
     // //////// récupère les informations tels que prix, label ...
     function load_general_info() {
    		var userUID =0, action='generalinfo', reponse='';
    		$.ajax({
           url: '/'+config.language+'/reservation/content/' + userUID+'/'+action+'/4/5/6', // url
           method: "GET",
           // dataType: "json", // format
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {	//console.log("exécution complete avec succes");
           }
         });
         return reponse;
    };
    // console.log(load_general_info());
    var generalinfo = load_general_info();
    //console.log(generalinfo);
    //generalinfo['data_chambre'][1]['data_order'] = 
    
     // ////// charge les dates non valide
    function load_days_not_valid() {
    		add_loading_message('#ui-datepicker-div');
    		var userUID =0, action='arraydaysnotvalid', reponse='';
    		$.ajax({
           url: '/reservation/content/' + userUID+'/'+action+'/4/5/6', // This
																		// is
																		// the
																		// AjAX
																		// URL
																		// set
																		// by
																		// the
																		// createupdatecontent
																		// Module
           method: "GET",
            // data: { numberOfItems : 10 }, // Set the number of Li items
			// requested
            // dataType: "json", // Type of the content we're expecting in the
			// response
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {
           remove_loading_message('#ui-datepicker-div');
           }
         });
         return reponse;
    };
	// console.log(load_days_not_valid()['data']);

    // /// Charge les prix pour les dates spécifiques.
    function load_date_by_price(annee, mois) {
    		var userUID =0, action='loaddateprice', reponse='';
    		$.ajax({
           url: '/reservation/content/' + userUID+'/'+action+'/'+annee+'/'+mois+'/6', // This
																						// is
																						// the
																						// AjAX
																						// URL
																						// set
																						// by
																						// the
																						// createupdatecontent
																						// Module
           method: "GET",
           // data: { numberOfItems : 10 }, // Set the number of Li items
			// requested
           // dataType: "json", // Type of the content we're expecting in the
			// response
           async: false,
           success: function(data) { reponse = data;  },
           error:function (errormessage) {	console.log(errormessage);},
           complete: function () {	/*
									 * console.log("exécution complete avec
									 * succes");
									 * remove_loading_message('#ui-datepicker-div');
									 */ }
         });
         return reponse;
    };
	// console.log(load_date_by_price());
    var d = new Date(),mois = d.getMonth() + 1;if(mois<10){mois= '0'+mois;}
    //console.log(d.getFullYear());
    //console.log(mois);
    var $datas = load_date_by_price(d.getFullYear(), mois);
    //console.log($datas);
	var cellContents  = $datas['data_chambre'];
	var cellContents_gite = $datas['data_gite'];
	var disableddates = [], $class_range ="";
	var load_days = load_days_not_valid(); //console.log(load_days);
    	disableddates = load_days['data_chambre'];
    var disableddates_gite = load_days['data_gite'];
    /**
	 * content array date
	 */
    var cellContentsObject={};
    	// $('#ui-datepicker-div ').on("click", ".ui-datepicker-header a",
		// function() { alert('click'); concole.log('log cclik');});

    // /////Désactive les dates specifiques : arrivée
    function DisableSpecificDatesArrive(date, popup=false, currentmonth='') { // console.log('date  arrive');
    	var chambre_select=true;
    	if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
    	var string = jQuery.datepicker.formatDate('dd-mm-yy', date );
    	// //////// pour ajouter un attribut à la balise a
		// ////////////////////////
  		// //////pour afficher les informations de manieres sécurisé

        	// Fill this with the data you want to insert (I use and AJAX
			// request). Key is day of month //NOTE* watch out for CSS special
			// characters in the value
        	// var cellContents = {1: '80 €', 15: '80 €', 28: '80 €'};
			// Select disabled days (span) for proper indexing but // apply the
			// rule only to enabled days(a)
			// var moisInt= {'Janvier':'01', 'Février':'02', 'Mars':'03',
			// 'Avril':'04', 'Mai':'05', 'Juin':'06', 'Juillet':'07',
			// 'Août':'08', 'Septembre':'09', 'Octobre':10, 'Novembre':11,
			// 'Décembre':12};
			if(popup){
				var container = '#ui-datepicker-div.ui-datepicker';
				var eachDate = container+' td';
			}else{
				var container = '#datepicker-static .ui-datepicker';
				var eachDate = container+' td';
			}
			if(currentmonth !=''){
				container = '#datepicker-static '+currentmonth+' .ui-datepicker ';
				eachDate  = '#datepicker-static '+currentmonth+' .ui-datepicker td';
				/*
				 * var n = date.getMonth();if(n<10){n= '0'+n;}// pas plus 1,
				 * car date le contient dejà if(!cellContentsObject[n]){
				 * cellContentsObject[n]=load_date_by_price(n)['data'];
				 * //console.log(date.getMonth());
				 * console.log(cellContentsObject); }
				 */
			}
			// var mois =$(container+' .ui-datepicker-month').text();
			// //console.log('mois : '+mois);
			// var annee=$(container+' .ui-datepicker-year').text();



			// create index for array
			var jour = date.getDate();
			jour = (jour < 10 )? '0'+jour : jour;
			var mois = date.getMonth() + 1;
			mois = (mois < 10) ? '0'+mois : mois;
			var annee = date.getFullYear();
			var indexDay = jour+'-'+mois+'-'+annee;
			// console.log(indexDay);
			// define default price
			var value =  (chambre_select) ? generalinfo['data_chambre'][1]['data_order'] : generalinfo['data_gite'][1]['data_order'];

			if(chambre_select){
    			if (cellContents && cellContents[indexDay]) {value =cellContents[indexDay]['montant'];}// /
																										// prix
																										// supplanter
    		}else{
    			if (cellContents_gite && cellContents_gite[indexDay]) { value = cellContents_gite[indexDay]['montant'];}
    			// value = cellContents_gite[indexDay]['montant'];
    		}
			//
			var className = 'datepicker-ar-' + CryptoJS.MD5(value).toString();
			if(value == 0){
				addCSSRule(eachDate+'.'+className + ' a:after {content: "\\a0";}'); // &nbsp;
				addCSSRule(eachDate+'.' + className + ' span:after {content: "\\a0";}'); // &nbsp;
			}
        	else{
        		addCSSRule(eachDate+'.'+className + ' a:after {content: "' + value + ' €";}');
            	addCSSRule(eachDate+'.'+className + ' span:after {content: "' + value + ' €";}');
            	// console.log(value);
        	}
			/*
			 *  // consomme plus de ressource
			 */
			/*
			 * $(eachDate+' > *').each(function (idx, elem) { var jour = idx +
			 * 1; if (jour<10){jour='0'+jour;} //if (mois<10){mois='0'+mois;}
			 * var indexDay=jour+'-'+moisInt[mois]+'-'+annee; var value =
			 * (chambre_select) ? generalinfo['data'][1]['data_order'] :
			 * generalinfo['data'][1]['data_order_gite'];///prix par défaut
			 * //console.log(generalinfo['data'][1]['data_order']);
			 * //console.log('cellContents : ' ); console.log(cellContents);
			 * //console.log(indexDay); //console.log(mois); if(chambre_select){
			 * if (cellContents && cellContents[indexDay]) {value
			 * =cellContents[indexDay]['montant'];}/// prix supplanter }else{
			 * //value =cellContents[indexDay]['montant']; }
			 * //console.log(value); // console.log('jour : '+$(this).text()); //
			 * dynamically create a css rule to add the contents //with the
			 * :after // selector so we don't break the datepicker
			 * //functionality var className = 'datepicker-content-' +
			 * CryptoJS.MD5(value).toString(); if(value == 0){
			 * addCSSRule(eachDate+' a.' + className + ':after {content:
			 * "\\a0";}'); //&nbsp; addCSSRule(eachDate+' span.' + className +
			 * ':after {content: "\\a0";}'); //&nbsp; } else{
			 * addCSSRule(eachDate+' a.' + className + ':after {content: "' +
			 * value + ' €";}'); addCSSRule(eachDate+' span.' + className +
			 * ':after {content: "' + value + ' €";}'); //console.log(value); }
			 *
			 * $(this).addClass(className); }); /*
			 */

  		// ///////////////////////////////////////////
    	// pour désactivez les dates déjà reverser
		// //////////////////////////////
    	$reserver=false;
    	if(chambre_select){// console.log(disableddates);
        	$.each(disableddates, function( key, elem ) {
        		if( elem.day== string && elem.arrive){$reserver=true;}
        	});
        }else{
        	$.each(disableddates_gite, function( key, elem ) {
        		if( elem.day== string && elem.arrive){$reserver=true;}
        	});
        }
    	if($reserver){
    		if(date_precedante){
    			date_precedante=false;
    			if ($datedepart.attr("date-plage") == 'auto') {
    				if($datedepart.val() == string) {
						$class_range="";
						//console.log('end date');
						return [false, "reservable plage-end plage-hover "+className, config['date-departure']];
					}
    			}
    			return [(position_date=='#edit-submitted-periode-date-darriver')?false:true, " reservable-depart occuper-arrive "+className, config['already-booked']];
    		}
    		return [false, "occuper "+className, config['already-booked']];// /occupé
    	}
    	else {
    		// permet de masquer les dates anterieurs à la date d'aujourdui.
			// pour kelle ne soit plus sélectionnable.
    		if (new Date() < date || jQuery.datepicker.formatDate('dd-mm-yy', new Date() ) == string) {
    			if ($datedepart.attr("date-plage") == 'auto') {
    				if ($datedepart.attr("date-complete") == 'encourt') {$class_range="";}
    				if ($datearriver.val() == string && ( $datedepart.val() != $datearriver.val() ) ) {
    					if ($datedepart.attr("date-complete") == 'complet') {
    						//console.log('date-complete - complet : '+string);
    						$class_range="plage-select";
    					}
    					date_precedante=true; //console.log('ddf'); //permet d'afficher les d'arriver suivants libre, sur la plage encours.
    					return [true, "reservable plage-begin plage-hover "+className, config['arrival-date']];
    				}else{
    					if($datedepart.val() == string) {
    						$class_range="";
    						//date_precedante=false; console.log('ffd');
    						//console.log('end date Clause normal ');
    						return [true, "reservable plage-end plage-hover "+className, config['date-departure']];
    					}
    				 	else{
    				 		//date_precedante=true; permet d'afficher les d'arriver suivants libre, sur toute la plage.
    				 		//console.log('plage-select : '+date.getDate() +' ==> : '+$class_range);
    						return [true, 'reservable '+$class_range+' '+className, config['reserve-now']];
    					}
    				}
    			}
    			else{
    				//date_precedante=true;
    				return [true, "reservable "+className, config['reserve-now']];
    			}
    		}else {
    			return [false, "nonreservable "+className, config['you-can-anymore']];
    		}
    	}
	}
	// /////Désactive les dates specifiques : départ
    	function DisableSpecificDatesDepart(date, popup=false, currentmonth='') {
    		var chambre_select=true;
        	if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
    		var string = jQuery.datepicker.formatDate('dd-mm-yy', date );
    		// //////// pour ajouter un attribut à la balise a
			// ////////////////////////
    		// //////pour afficher les informations de manieres sécurisé

			// var moisInt= {'Janvier':'01', 'Février':'02', 'Mars':'03',
			// 'Avril':'04', 'Mai':'05', 'Juin':'06', 'Juillet':'07',
			// 'Août':'08', 'Septembre':'09', 'Octobre':10, 'Novembre':11,
			// 'Décembre':12};
			if(popup){
				var container = '#ui-datepicker-div.ui-datepicker';
				var eachDate = container+' td';
			}else{
				var container = '#datepicker-static .ui-datepicker';
				var eachDate = container+' td';
			}
			if(currentmonth !=''){
				container = '#datepicker-static '+currentmonth+' .ui-datepicker ';
				eachDate  = '#datepicker-static '+currentmonth+' .ui-datepicker td';
			}
			// var mois =$(container+' .ui-datepicker-month').text();
			// //console.log('mois : '+mois);
			// var annee=$(container+' .ui-datepicker-year').text();

			// create index for array
			var jour = date.getDate();
			jour = (jour < 10 )? '0'+jour : jour;
			var mois = date.getMonth() + 1;
			mois = (mois < 10) ? '0'+mois : mois;
			var annee = date.getFullYear();
			var indexDay = jour+'-'+mois+'-'+annee;
			// console.log(eachDate);
			var value =  (chambre_select) ? generalinfo['data_chambre'][1]['data_order'] : generalinfo['data_gite'][1]['data_order'];
			if(chambre_select){
    			if (cellContents && cellContents[indexDay]) {value =cellContents[indexDay]['montant'];}// /
																										// prix
																										// supplanter
    		}else{
    			if (cellContents_gite && cellContents_gite[indexDay]) { value = cellContents_gite[indexDay]['montant'];}
    			// value = cellContents_gite[indexDay]['montant'];
    		}

			var className = 'datepicker-dp-' + CryptoJS.MD5(value).toString();
			if(value == 0){
				addCSSRule(eachDate+'.'+className + ' a:after {content: "\\a0";}'); // &nbsp;
				addCSSRule(eachDate+'.' + className + ' span:after {content: "\\a0";}'); // &nbsp;
			}
        	else{
        		addCSSRule(eachDate+'.'+className + ' a:after {content: "' + value + ' €";}');
            	addCSSRule(eachDate+'.'+className + ' span:after {content: "' + value + ' €";}');
            	// console.log(value);
        	}

			/*
			 * $(eachDate+' > *').each(function (idx, elem) { var jour = idx +
			 * 1;if (jour<10){jour='0'+jour;} if (mois<10){mois='0'+mois;} var
			 * indexDay=jour+'-'+moisInt[mois]+'-'+annee; var value =
			 * generalinfo['data'][1]['data_order'];///prix par défaut
			 * //console.log(generalinfo['data'][1]['data_order']);
			 * //console.log('cellContents : ' ); console.log(cellContents); if
			 * (cellContents && cellContents[indexDay]) {value
			 * =cellContents[indexDay]['montant'];}/// prix supplanter //
			 * console.log('jour : '+$(this).text()); // dynamically create a
			 * css rule to add the contents //with the :after // selector so we
			 * don't break the datepicker //functionality var className =
			 * 'datepicker-content-' + CryptoJS.MD5(value).toString(); if(value ==
			 * 0) addCSSRule(eachDate+' a.' + className + ':after {content:
			 * "\\a0";}'); //&nbsp; else addCSSRule(eachDate+' a.' + className +
			 * ':after {content: "' + value + ' €";}'); addCSSRule(eachDate+'
			 * span.' + className + ':after {content: "' + value + ' €";}');
			 * $(this).addClass(className); }); /*
			 */

  		// ///////////////////////////////////////////
    	// pour désactivez les dates déjà reverser
		// //////////////////////////////
    	$reserver=false;
    	$reserver=false;
    	if(chambre_select){
        	$.each(disableddates, function( key, elem ) {
        		if( elem.day== string && elem.arrive){$reserver=true;}
        	});
        }else{
        	$.each(disableddates_gite, function( key, elem ) {
        		if( elem.day== string && elem.arrive){$reserver=true;}
        	});
        }
    	if($reserver){

    		return [false, "occuper "+className, config['already-booked']];
    	}
    	else {
    		// permet de masquer les dates anterieurs à la date d'aujourdui.
			// pour kelle ne soit plus sélectionnable.
    		if (new Date() < date || jQuery.datepicker.formatDate('dd-mm-yy', new Date() ) == string) {
    			if ($datedepart.attr("date-plage") == 'auto') {
    				if ($datedepart.attr("date-complete") == 'encourt') {$class_range="";}
    				if ($datearriver.val() == string && ( $datedepart.val() != $datearriver.val() ) ) {
    					if ($datedepart.attr("date-complete") == 'complet') {$class_range="plage-select";}
    					return [true, "reservable plage-begin plage-hover "+className, config['arrival-date'] ];
    				}else{
    					if($datedepart.val() == string)
    					{
    						$class_range="";
    						return [true, "reservable plage-end plage-hover "+className, config['date-departure'] ];
    					}
    				 	else{
    				 		$class_range="";//error, find after
    						return [true, 'reservable '+$class_range+' '+className, config['reserve-now'] ];
    					}
    				}
    				// return [true, "reservable "+className,
					// config['reserve-now'] ];
    			}
    			else{
    				return [true, "reservable "+className, config['reserve-now'] ];
    			}
    		}else {
    			return [false, "nonreservable "+className, config['you-can-anymore'] ];
    		}
    	}
	}
	// /*
	// *******************************************************************************************
	// *////
	// Début Configuration de datepicker
	var minDate = "-12m", $jourSemaine ="";
	var $datedepart = $('#edit-submitted-periode-date-depart');
	var $datearriver = $('#edit-submitted-periode-date-darriver');
	$datearriver.datepicker({
	// altField: "#datepicker",
	closeText: config.closeText,
	prevText: config.prevText,
	nextText: config.nextText,
	currentText: config.currentText,
	monthNames: config.monthNames,
	monthNamesShort: config.monthNamesShort,
	dayNames: config.dayNames,
	dayNamesShort: config.dayNamesShort,
	dayNamesMin: config.dayNamesShort,
	weekHeader: 'Sem.',
	dateFormat: 'dd-mm-yy',
	showAnim: "drop",
	firstDay: 1,
	minDate:  minDate,
	//maxDate: "+12m",
	numberOfMonths: [ 1, 1 ],
	showButtonPanel: false,
	/*
	 * onChangeMonthYear:function(year, month, inst) { $('body >
	 * div.customstyle').css('display','block'); var load_days =
	 * load_days_not_valid(); disableddates = load_days['data_chambre'];
	 * disableddates_gite = load_days['data_gite']; }, /*
	 */
	// currentText: "Now",
	// showButtonPanel: true,
	// changeMonth: true,

	beforeShowDay: function(date){
		return DisableSpecificDatesArrive(date, true);
	},
	onSelect: function( selectedDate ) {
		// $(this).data('datepicker').inline = true;//pour maintenir la fenetre
		// ouverte apres selection

		minDate =  $datearriver.val();
        minDate =  minDate.split('-');
        // minDate[0] = minDate[0];
        minDate = new Date (minDate[2], minDate[1]-1 , minDate[0] );
        var tomorrowDate = new Date (minDate[2], minDate[1]-1 , minDate[0]+1 );
        $jourSemaine = minDate.getDay();
        var $condition_vend_sam = false; // / pour désactiver le test du
											// vendredi ==> samedi. remplacer
											// false par true
        if ( $condition_vend_sam && ($jourSemaine==5 || $jourSemaine==6) ){
                minDate = new Date(minDate.getTime() + (60*60*24*1000)*2 );
        }
        else {minDate = new Date(minDate.getTime() + (60*60*24*1000)*1 );}
        $datedepart.datepicker( "option", "minDate", minDate );
        // console.log( minDate );

        $datedepart.attr("date-plage",'auto');
        $datedepart.attr("date-complete",'encourt');
        recapitulatif();
        /* */
        setTimeout(function(){
        	// / verification de la date
            $datedepart.datepicker('show');
            refresh_static_date();
        }, 100);

    },
    onClose: function() {
    	// $(this).data('datepicker').inline = false;//pour maintenir la fenetre
		// ouverte apres selection
	}
    }).on( "click", function() {
    	position_date='#edit-submitted-periode-date-darriver';
    });
    /*
	 * .on( "change", function() { $datedepart.attr("date-plage",'auto'); })
	 */;
    var $datearriver_select ='', $datedepart_select = '', nombrejour =0, $datearriver_select2='', $datedepart_select2='' ;
    $datedepart.datepicker({
	// altField: "#datedepart",
		closeText: config.closeText,
		prevText: config.prevText,
		nextText: config.nextText,
		currentText: config.currentText,
		monthNames: config.monthNames,
		monthNamesShort: config.monthNamesShort,
		dayNames: config.dayNames,
		dayNamesShort: config.dayNamesShort,
		dayNamesMin: config.dayNamesShort,
	weekHeader: 'Sem.',
	dateFormat: 'dd-mm-yy',
	firstDay: 1,
	showAnim: "drop",
	minDate:  minDate,
	//maxDate: "+9m",
	numberOfMonths: [ 1, 1 ],
	/*
	 * onChangeMonthYear:function(year, month, inst) { $('body >
	 * div.customstyle').css('display','block'); var load_days =
	 * load_days_not_valid(); disableddates = load_days['data_chambre'];
	 * disableddates_gite = load_days['data_gite']; }, /*
	 */
	beforeShowDay: function(date){
		return DisableSpecificDatesDepart(date, true);
	},
	onSelect: function( selectedDate ) {
		$datedepart.attr("date-complete",'complet');
		$datearriver_select =  $datearriver.val();
		$datearriver_select =  $datearriver_select.split('-');
		$datearriver_select2 = new Date ($datearriver_select[2], $datearriver_select[1]-1 , $datearriver_select[0] );
		$jourSemaine = $datearriver_select2.getDay();
		$datearriver_select=$datearriver_select[2] + $datearriver_select[1]-1 + $datearriver_select[0];
		// ////
		$datedepart_select =  $datedepart.val();
		$datedepart_select =  $datedepart_select.split('-');
		$datedepart_select2 = new Date ($datedepart_select[2], $datedepart_select[1]-1 , $datedepart_select[0] );
		$datedepart_select = $datedepart_select[2] + $datedepart_select[1]-1 + $datedepart_select[0] ;
		// ////////////////////
		if (
				($jourSemaine==5 || $jourSemaine==6) &&
				($datearriver_select == $datedepart_select)
		   )
		{
			alert(' La sélection unique du vendredi ou du samedi est refusé. ');
			// console.log(' Ce format n\'est pas valide ' );
			$(this).data('datepicker').inline = true;// pour maintenir la
														// fenetre ouverte apres
														// selection
		}else{$(this).data('datepicker').inline = false;}
        // console.log($datearriver_select);
        // console.log($datedepart_select);
		refresh_static_date();
        recapitulatif();
    },
    onClose: function() {
    	$(this).data('datepicker').inline = false;// pour maintenir la fenetre
													// ouverte apres selection
	},
	// showButtonPanel: false,
	// changeMonth: true,
	})
	.on( "click", function() {
          position_date='#edit-submitted-periode-date-darriver';
      	if($(position_date).val().length > 1 ){
      		position_date='#edit-submitted-periode-date-depart';
      	}
    });
	// FIN : Configuration de datepicker
	// /*
	// *******************************************************************************************
	// *////


    // /////////////affiche la période et les options
    function recapitulatif() {
    	setTimeout(function () {
    		var chambre_select=true;
    		if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
    		if ($datedepart.val() && $datearriver.val()  ) {
    			// // vider le champ vide
    			$('#recapitulatif .vide').html(' ').css('display','none');

    				$datearriver_select =  $datearriver.val(); 
    				$datearriver_select =  $datearriver_select.split('-');
    				$datearriver_select2 = new Date ($datearriver_select[2], $datearriver_select[1]-1 , $datearriver_select[0] );
    				$datedepart_select =  $datedepart.val();
    				$datedepart_select =  $datedepart_select.split('-');
    				$datedepart_select2 = new Date ($datedepart_select[2], $datedepart_select[1]-1 , $datedepart_select[0] );

    			// display type piece
    			if(datasave.current_room){
    				datasave.html_room = '<strong>'+datasave.current_room_label+'</strong>';
    				$('#recapitulatif .type_piece').html(datasave.html_room);
    			}
    			    nombrejour = $datedepart_select2.getTime() - $datearriver_select2.getTime() ;
    			    nombrejour = (nombrejour/( 1000*60*60*24 )) ;
    			    //console.log(nombrejour);
    			    nombrejour = Math.round(nombrejour);
    			    if (nombrejour > 1) {
    			    	 var nbre_jr_free = Math.floor(nombrejour/6);
    			    	 var jours_free=[];
    			    	 var liste_jour_free='';
    			    		var pricejour=0;datasave.periode.label=config.nuits;
    			    		var it_jr_free=1;
    			    		for (var iter=0; iter < nombrejour; iter++) {
    			    			var dt = new Date($datearriver_select2.getTime() + (60*60*24*1000)*iter );
    			    			var string = jQuery.datepicker.formatDate('dd-mm-yy', dt );
    			    			if(it_jr_free != 6){
	    			    			if(chambre_select){
	    			    				if (cellContents && cellContents[string]) {pricejour=pricejour + parseInt(cellContents[string]['montant']);}else {pricejour= pricejour +parseInt(generalinfo['data_chambre'][1]['data_order']);}
	    			    			}else{
	    			    				if (cellContents_gite && cellContents_gite[string]) {pricejour=pricejour + parseInt(cellContents_gite[string]['montant']);}else {pricejour= pricejour +parseInt(generalinfo['data_gite'][1]['data_order']);}
	    			    			}
	    			    			it_jr_free++;
    			    			}else{
    			    				it_jr_free=1;
    			    				jours_free.push(string);
    			    			}
    			    		}
    			    		if(jours_free.length > 0){
    			    			liste_jour_free  = '<span>'+nbre_jr_free+'</span> '+config['free-nights']+' ';
    			    			//liste_jour_free +=jours_free.join(', ');
    			    		}
    			    		datasave.html_periode = ( '<span>'+nombrejour+'</span> '+config['nuits']+' '+config['from']+' '+$datearriver.val().replace(/\-/g, '/')+' '+config['au']+' '+$datedepart.val().replace(/\-/g, '/')+' <span>: <span class="price">'+ pricejour +'</span> €</span><div>'+liste_jour_free+'</div>');
    			    		display_days_recap(datasave.html_periode);
    				}
    				else {
    					var pricejour=0;datasave.periode.label=config.nuit;
    					var dt = new Date($datearriver_select2.getTime()  );
    					var string = jQuery.datepicker.formatDate('dd-mm-yy', dt );
    					if(chambre_select){
    						if (cellContents && cellContents[string]) { pricejour = pricejour + parseInt(cellContents[string]['montant']); }else { pricejour= pricejour +parseInt(generalinfo['data_chambre'][1]['data_order']); }
    					}else{
    						if (cellContents_gite && cellContents_gite[string]) {pricejour=pricejour + parseInt(cellContents_gite[string]['montant']);}else {pricejour= pricejour +parseInt(generalinfo['data_gite'][1]['data_order']);}
    					}
    					datasave.html_periode = ('<span> 1 </span> '+config['nuit']+' '+config['the']+' '+$datearriver.val().replace(/\-/g, '/')+' <br> <span>'+config['price']+' :</span> <span class="price">'+ pricejour +'</span> €  ');
    					display_days_recap(datasave.html_periode);
    				}

    				datasave.periode.nombre = nombrejour;
    				datasave.periode.price = pricejour;
    				datasave.periode.datedebut = $datearriver.val().replace(/\-/g, '/');
    				datasave.periode.datefin = $datedepart.val().replace(/\-/g, '/');

    				// console.log('date select');$('h1').text(
					// $('h1').text().replace(/\$/g, '€') );
    				// console.log($datearriver_select2);
    				// console.log($datedepart_select2);

    				// ///////////////////////////////////////////////////
    				// /////// les options
    				// nombre de liste
    				if(chambre_select){
    					var nbreListe = generalinfo['data_chambre'][16]['data_nb_select'], listesOptions=[],nbreAdultes=1,pricedejeuner=generalinfo['data_chambre'][16]['price'];
    				}else{
    					var nbreListe = generalinfo['data_gite'][16]['data_nb_select'], listesOptions=[],nbreAdultes=1,pricedejeuner=generalinfo['data_gite'][16]['price'];
    				}

    				// ' <option value="" >- Aucun(e) -</option><option
					// value="1" selected="selected">1</option> <option
					// value="2">2</option> <option value="3">3</option> <option
					// value="4">4</option> <option value="5">5</option>';
    				for (var i=0; i<=nbreListe; i++){ if(i==0){listesOptions.push('<option value="Aucun" > Aucun </option>');}else{ if(i==1){listesOptions.push('<option value="'+i+'" selected="selected">'+i+'</option>');}else {listesOptions.push('<option value="'+i+'">'+i+'</option>');} } }
    				if(chambre_select){
    					var PDJ_texte = config['pdj'];//generalinfo['data_chambre'][16]['texte_singulier'];
    				}else{
    					var PDJ_texte = config['pdj'];//generalinfo['data_gite'][16]['texte_singulier'];
    				}
    				var listes ='';
    				var string_date;
    				for (var iter=0; iter < nombrejour; iter++) {
    						var dt = new Date($datearriver_select2.getTime() + (60*60*24*1000)*(iter+1) );
    						string_date = jQuery.datepicker.formatDate('dd/mm', dt );
    						// console.log(dt);
    						listes += '<li class="form-item webform-component">';
  							listes += '		<label for="cbox'+iter+'" style="display: inline-block;"> '+PDJ_texte+' '+ string_date +' ('+pricedejeuner+' '+config['pdj_euros']+') </label>';
 							listes += '<select id="cbox'+iter+'" name="submitted[option_cbox_'+iter+']" class="form-select smallselect">'+ listesOptions.join('') +'</select>';
 							datasave.options.choix['choix_'+iter] = 1;
 							datasave.options.choix['day_'+iter] = string_date;
							listes += '</li>';
    				}
    				var valeur3 = $('.webform-component--setting-user .selectNombreAdultes').val();
    				if (valeur3>1) {nbreAdultes=valeur3;}else {nbreAdultes=1;}
    				$('form div #options ').html('<fieldset> <legend>'+config.options+'</legend> <div class="form-item webform-component"> <ul>'+listes+'</ul> </div> </fieldset>');
    				// $('#recapitulatif .option').html('<strong>
					// '+generalinfo['data'][16]['texte_singulier']+' :
					// </strong> <span class="price">'+
					// nbreAdultes*nombrejour*pricedejeuner +'</span> €');

    				datasave.options.price = nombrejour*pricedejeuner;// /nbreAdultes*nombrejour*pricedejeuner;
    				if(chambre_select){
    					datasave.options.label = config['pdj'];//generalinfo['data_chambre'][16]['texte_singulier'];
    				}else{
    					datasave.options.label = config['pdj'];//generalinfo['data_gite'][16]['texte_singulier'];
    				}
    				datasave.options.nombre = nombrejour; var optionhtml='';
    				if (datasave.options.choix) {
	  					for (var k=0; k<nombrejour; k++) {
	  						// html += '<strong>'+ elem.label +'</strong>
							// '+elem.choix['day_'+k]+' : '+elem.choix['choix_'+k]+'
							// <br>';
	  						optionhtml += '<span> '+datasave.options.label+' '+datasave.options.choix['day_'+k]+' </span> : '+ parseInt(datasave.options.choix['choix_'+k]) * parseInt(pricedejeuner) +' €<br> ';
	  					}
    				}
    				datasave.html_options = optionhtml;
    				$('#recapitulatif .option').html(datasave.html_options);
    				checkpersonnelinfo();
    				checktotal();
    				//console.log(datasave);
    		}
    	}, 150);
    }
    // // à decommenter si on utilise ajax
    // recapitulatif();
    // ////////////////////////////////////////////////////////////****************************
    // ////////////////// les options du petit-déjeuner
    function checkoptions() {
    	var chambre_select=true;
		if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
    		var checked =0, checkedtable=[], i=0,nbreAdultes=1, select=[],k=0,optionhtml='';
    		if(chambre_select){
    			var pricedejeuner=generalinfo['data_chambre'][16]['price'];
    		}else{
    			var pricedejeuner=generalinfo['data_gite'][16]['price'];
    		}

    		var atLeastOneIsChecked = $('form div #options li select ').length;/*
																				 * $('form
																				 * div
																				 * #options
																				 * li
																				 * input
																				 * ').each(function(
																				 * index ) {
																				 * if(
																				 * $(this).prop("checked")
																				 * ){checked++;}
																				 * });
																				 */
		$('form div #options li select ').each(function( index ) {
  			// if( $(this).prop("checked") ){checked++;}
  			var choix = parseInt($(this).val());
  			if( choix > 0 ){checkedtable[i] = choix; i++;}
  			select[index] = $(this).val();
		});
		//console.log(datasave);
		// console.log(checkedtable);
		// checked: nombre de jours réservés
		for( i=0; i<atLeastOneIsChecked; i++ ){ if(checkedtable[i]>0){checked = checkedtable[i] + checked; } }
		if (datasave.options.choix && datasave.options.choix['day_0']) {
			var optionhtml='';
			for (var k=0; k<datasave.options.nombre; k++) {

			  datasave.options.choix['choix_'+k]=select[k];
			  if(parseInt(datasave.options.choix['choix_'+k])){
			    optionhtml += '<span> '+datasave.options.label+' '+datasave.options.choix['day_'+k]+' </span> : '+ parseInt(datasave.options.choix['choix_'+k]) * parseInt(pricedejeuner) +' €<br> ';
			  }else{
			    optionhtml += '<span> '+datasave.options.label+' '+datasave.options.choix['day_'+k]+' </span> : 0 €<br> ';
			  }

			}
		}
		//
		var valeur3 = $('.webform-component--setting-user .selectNombreAdultes').val();
		if (valeur3>1) {nbreAdultes=valeur3;}else {nbreAdultes=1;}
		// $('#recapitulatif .option').html('<strong>
		// '+generalinfo['data'][16]['texte_singulier']+' : </strong> <span
		// class="price">'+ nbreAdultes*checked*pricedejeuner +'</span> €');
		datasave.html_options = optionhtml;
		$('#recapitulatif .option').html(datasave.html_options);
		datasave.options.price = checked*pricedejeuner;
		// console.log(datasave);
		checktotal();
    }

	 // ////////////////////////////////////////////////////////////****************************
    // ////////////////// paramettres du client
	function checkpersonnelinfo() {
		var chambre_select=true;
		if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
		var html ='',accord='',price2=0,price3=0, monnaie='€', priceadulte='';
		var valeur1 = $('.selectNombreEnf2moins').val();
		var valeur2 = $('.selectNombreEnf2plus ').val();
		var valeur3 = $('.selectNombreAdultes').val();

		// /modifications des options par rapport aux nombres adultes et
		// d’enfants plus de 2 ans.
		if (valeur3>=1 || valeur2>=1 ) {
				var nbre_personne=0, defaut_option=1;
				if(valeur3>=1){nbre_personne=parseInt(nbre_personne) + parseInt(valeur3);};
				if(valeur2>=1){nbre_personne=parseInt(nbre_personne) + parseInt(valeur2);};
				if (nbre_personne>=4) {defaut_option=4;}else {defaut_option=nbre_personne;}
				// console.log('nombre personne : '+ defaut_option);
				$('form div #options li select ').each(function( index ) {
  					$(this).val(defaut_option);
				});
				checkoptions();
		}
		// /
		if (valeur3) { 
			datasave.adultes.price=0; priceadulte='';
			if (valeur3>1){
				if(chambre_select){
					accord = config['Adults'];//generalinfo['data_chambre'][1]['texte_plurier'];
					var many_adult_price = generalinfo['data_chambre'][1]['price'];
				}else{
					accord= config['Adults'];//generalinfo['data_gite'][1]['texte_plurier'];
					var many_adult_price = generalinfo['data_gite'][1]['price'];
				}

				if (valeur3 >= 3) {
					var nobreJour = (datasave.options.nombre)?datasave.options.nombre:1; datasave.adultes.price=nobreJour*many_adult_price;

					var adult_supp = valeur3 - 2;
					datasave.adultes.price = datasave.adultes.price * adult_supp;

					priceadulte = ' : '+datasave.adultes.price+' '+monnaie;
				}

			}
			else{
				if(chambre_select){
					accord = config['Adult'];//generalinfo['data_chambre'][1]['texte_singulier'];
				}else{
					accord = config['Adults'];//generalinfo['data_gite'][1]['texte_singulier'];
				}
			}
      if(valeur3 >=3 ){
          var adult_supp = parseInt(valeur3)-2;
          if(adult_supp==1){
					          accord = config['Adult'];//generalinfo['data_chambre'][1]['texte_singulier'];
				          }else{
					          accord = config['Adult'];//generalinfo['data_gite'][1]['texte_singulier'];
				  }
          
          html +='<span> '+config['extra_cost']+' '+ ( parseInt(valeur3)-2 ) +'  '+lower_string(accord)+' </span> '+ priceadulte;
      }else{
          html +='<span>'+ valeur3 +' '+lower_string(accord)+' </span> '+priceadulte;
      }

			datasave.adultes.nombre =valeur3;
			datasave.adultes.label = accord;
			checkoptions();
		}
		if (valeur2) {
			if (valeur2>1){
				if(chambre_select){
					accord=config['kids'];//generalinfo['data_chambre'][3]['texte_plurier'];
				}else{
					accord=config['kids'];//generalinfo['data_gite'][3]['texte_plurier'];
				}
			}
			else{
				if(chambre_select){
					accord=config['kid'];//generalinfo['data_chambre'][3]['texte_singulier'];
				}else{
					accord=config['kid'];//generalinfo['data_gite'][3]['texte_singulier'];
				}
			}
			if(chambre_select){
				var display_price= generalinfo['data_chambre'][3]['display_price'];
				var price_3 = price_one = parseInt(generalinfo['data_chambre'][3]['price']);
			}else{
				var display_price=generalinfo['data_gite'][3]['display_price'];
				var price_3 = price_one = parseInt(generalinfo['data_gite'][3]['price']);
			}
			if (display_price && display_price > 0) {
				price3 = valeur2 * price_3; monnaie='€';
			}
			else {
				price3 = price_3; monnaie='';
			}
			var nobreJour = (datasave.options.nombre)?datasave.options.nombre:1;
			datasave.enfantplus2ans.price = (price3 > 0)?price3*nobreJour:0;
			datasave.enfantplus2ans.nombre =valeur2;
			datasave.enfantplus2ans.label = accord;
			datasave.enfantplus2ans.monnaie= monnaie;
			html +='<div > <span>'+ valeur2 +' '+lower_string(accord)+' ('+price_one+' '+config['reservation_supp_kids_euros']+')  :</span> <span class="price">'+ datasave.enfantplus2ans.price +'</span> '+ monnaie +' </div>';
		}else {datasave.enfantplus2ans.price =0;}

		if (valeur1) {
			if (valeur1>1){
				if(chambre_select){
					accord=config['children'];//generalinfo['data_chambre'][2]['texte_plurier'];
				}else{
					accord=config['children'];//generalinfo['data_gite'][2]['texte_plurier'];
				}
			}
			else{
				if(chambre_select){
					accord=config['child'];//generalinfo['data_chambre'][2]['texte_singulier'];
				}else{
					accord=config['child'];//generalinfo['data_gite'][2]['texte_singulier'];
				}
			}
			if(chambre_select){
				var display_price=generalinfo['data_chambre'][2]['display_price'];
				var price_2 = generalinfo['data_chambre'][2]['price'];
			}else{
				var display_price=generalinfo['data_gite'][2]['display_price'];
				var price_2 = generalinfo['data_gite'][2]['price'];
			}
			if (display_price && display_price > 0){
				monnaie='€';
				if( Number.isInteger(price_2) ){
					price2 = valeur1 * price_2;
				}else{
					price2 = price_2; monnaie='';
				}
			}
			else {
				price2 = price_2;monnaie='';
			}
			datasave.enfantmoins2ans.price = price2;// (price2 > 0)?price2:0;
			datasave.enfantmoins2ans.nombre =valeur1;
			datasave.enfantmoins2ans.label = accord;
			datasave.enfantmoins2ans.monnaie= monnaie;
			html +='<div > <span>'+ valeur1 +'  '+lower_string(accord)+'  :</span> <span class="price">'+ config['free'] +'</span> '+ monnaie +'</div>';
		}
		datasave.html_personnelinfo = html;
		$('#recapitulatif .personnelinfo').html(datasave.html_personnelinfo);
		$('#recapitulatif .vide').html(' ').css('display','none');
		checktotal();
	}


	// ////////////////////////////////////////////////////////////****************************
	// ////////////////////////////////// cacult total et affichage du
	// racapitulatif dans le champs hidden
	function checktotal() {
		var totale =0, price=0, html='<div style="padding: 10px;border: 1px solid #eee;">',m='€', n='',priceadulte='';
		var html_periode ='',html_options='',html_adultes='', html_enfantplus2ans='',html_enfantmoins2ans='';
		//console.log(datasave);
		$.each(datasave, function( key, elem ) {
			// display type chambre

			//if(key=="current_room"){ html_periode +='<p><strong>'+elem+'</strong>dfdff</p>'; }
  			if (elem.price && elem.price > 0 ) { totale=totale + elem.price; }
  			//if (key=='periode' && elem.label) {html_periode += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> : du '+elem.datedebut+' au '+elem.datefin+' : '+elem.price+' € </p>'; }
  			/*
  			if (key=='options' && elem.label) {
  				// html += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+
				// elem.label +'</strong> : '+elem.price+' € </p>'; ///total
				// petit déjeuner
  				html_options += '<p style="padding: 5px 0 5px 0; margin: 0;">';
  				if (elem.choix) {var nbre = (elem.nombre)?elem.nombre:0; // console.log(elem.choix);
																			// console.log('nbre
																			// :
																			// '+nbre);
  					for (var k=0; k<nbre; k++) {
  						html_options += '<strong>'+ elem.label +'</strong> '+elem.choix['day_'+k]+'  : '+elem.choix['choix_'+k]+'   <br>';
  					}
  				}
  				html_options += '</p>';
  			}
  			*/
			/*
  			if (key=='adultes' && elem.label) {
  				 if( elem.price && elem.price > 1 ){ priceadulte=' : '+elem.price+' '+m;}else {priceadulte='';}
  				html_adultes += '<p style="padding: 0 0 5px 0; margin: 0;"> <strong>'+ elem.nombre +' '+ elem.label +'</strong> '+ priceadulte +'</p>';

  			}
  			if (key=='enfantplus2ans' && elem.label) {html_enfantplus2ans += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> :  '+elem.price+' '+ elem.monnaie +' </p>'; }
  			if (key=='enfantmoins2ans' && elem.label) {html_enfantmoins2ans += '<p style="padding: 0 0 5px 0; margin: 0;"><strong>'+ elem.nombre +' '+ elem.label +'</strong> :  '+elem.price+' '+ elem.monnaie +' </p>'; }
  			 /* */
		});
		html +='<p>'+datasave.html_room+'</p>'+datasave.html_periode+' <div>'+datasave.html_personnelinfo+'</div> <p>'+datasave.html_options+'</p>';
		html += '<div style="padding: 10px 0px 5px 0; margin: 10px 0 0px 0;  font-size: +150%; border-top: 1px solid #ccc;"><strong>'+config['total']+'</strong> : '+totale+' € </div> </div>';
		/**
		 * Contenu du mail.
		 */
		$('#edit-submitted-recapitulatif2-value').html(html);
		/**
		 * Affichage du total sur la page
		 */
		$('#recapitulatif .totalprice').html('<strong> '+config['total']+' : </strong>'+ totale +' '+m +'<br>');
		// / ajout des données dans le champs texarea
		/*
		 * var datarecap = $('#recapitulatif').html();
		 * $('#edit-submitted-recapitulatif').html(datarecap);
		 */
	}


	// ////////////////////////////// les actions ****************************
	// // options
	$('form div #options').on( "change", "select", function() {
		//console.log('change');
		checkoptions();
	});
	// / à propos du client
	$(' .selectNombreEnf2moins, .selectNombreEnf2plus , .selectNombreAdultes').on("change",function() {
		checkpersonnelinfo();
	});

	/**
	 * display 3 mouths by default
	 */
	(function(){
		// add tag
		$('fieldset.webform-component--periode').before('<div id="datepicker-static" class="form-item webform-component webform-component-custom-js"><div class="mounth1"></div><div class="mounth2"></div><div class="mounth3"></div></div>');
		var minDate = "-12m";
		var maxDate = null;//"+24m";
		$('#datepicker-static > .mounth1').datepicker({
			// altField: "#datepicker",
			closeText: config.closeText,
			prevText: config.prevText,
			nextText: config.nextText,
			currentText: config.currentText,
			monthNames: config.monthNames,
			monthNamesShort: config.monthNamesShort,
			dayNames: config.dayNames,
			dayNamesShort: config.dayNamesShort,
			dayNamesMin: config.dayNamesShort,
			weekHeader: 'Sem.',
			dateFormat: 'dd-mm-yy',
			showAnim: "drop",
			firstDay: 1,
			minDate:  minDate,
			maxDate: maxDate,
			numberOfMonths: [ 1, 1 ],
			showButtonPanel: false,
			beforeShowDay:function(date){
				return DisableSpecificDatesArrive(date, false, '.mounth1');
			},
			onChangeMonthYear :function(year, month, inst){
				 //  console.log(inst);
				 //  change another calender
            },
            onSelect: function( selectedDate , inst) {
        		// $datedepart.attr("date-complete",'complet');
            	//console.log(inst);
            	putDateOnValidField(selectedDate);
            },
            /* */
		}).on('click',function(event){
			if($(event.target).hasClass('ui-datepicker-prev')){
				//console.log('prev action');
				d = $('#datepicker-static > .mounth2').datepicker("getDate"); //console.log(d);
				$('#datepicker-static > .mounth2').datepicker("setDate", new Date(d.getFullYear(), d.getMonth()-1,d.getDate()));

				// d2 = $('#datepicker-static >
				// .mounth3').datepicker("getDate"); console.log(2);
				$('#datepicker-static > .mounth3').datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()));
			}
		});
		$('#datepicker-static > .mounth2').datepicker({
			// altField: "#datepicker",
			closeText: config.closeText,
			prevText: config.prevText,
			nextText: config.nextText,
			currentText: config.currentText,
			monthNames: config.monthNames,
			monthNamesShort: config.monthNamesShort,
			dayNames: config.dayNames,
			dayNamesShort: config.dayNamesShort,
			dayNamesMin: config.dayNamesShort,
			weekHeader: 'Sem.',
			dateFormat: 'dd-mm-yy',
			showAnim: "drop",
			firstDay: 1,
			minDate:  minDate,
			maxDate: maxDate,
			numberOfMonths: [ 1, 1 ],
			showButtonPanel: false,
			beforeShowDay:function(date){
				return DisableSpecificDatesArrive(date, false, '.mounth2');
			},
			onSelect: function( selectedDate ) {
        		// $datedepart.attr("date-complete",'complet');
            	putDateOnValidField(selectedDate);
            },
			//
			// changeMonth: true,
			defaultDate: "+1m",
		});
		$('#datepicker-static > .mounth3').datepicker({
			// altField: "#datepicker",
			closeText: config.closeText,
			prevText: config.prevText,
			nextText: config.nextText,
			currentText: config.currentText,
			monthNames: config.monthNames,
			monthNamesShort: config.monthNamesShort,
			dayNames: config.dayNames,
			dayNamesShort: config.dayNamesShort,
			dayNamesMin: config.dayNamesShort,
			weekHeader: 'Sem.',
			dateFormat: 'dd-mm-yy',
			showAnim: "drop",
			firstDay: 1,
			minDate:  minDate,
			maxDate: maxDate,
			numberOfMonths: [ 1, 1 ],
			showButtonPanel: false,
			beforeShowDay:function(date){
				return DisableSpecificDatesArrive(date, false, '.mounth3');
			},
			onSelect: function( selectedDate ) {
        		// $datedepart.attr("date-complete",'complet');
            	putDateOnValidField(selectedDate);
            },
			//
			// changeMonth: true,
			defaultDate: "+2m",
			onChangeMonthYear :function(year, month, inst){
				// console.log(inst);
				// change another calender
				/*
				 * d = $('#datepicker-static > .mounth2').datepicker("getDate");
				 * $('#datepicker-static > .mounth2').datepicker("setDate", new
				 * Date(d.getFullYear(),d.getMonth()+1,d.getDate()));
				 *
				 * d2 = $('#datepicker-static >
				 * .mounth1').datepicker("getDate"); $('#datepicker-static >
				 * .mounth1').datepicker("setDate", new Date(d2.getFullYear(),
				 * d2.getMonth()+1, d2.getDate())); o-de-mer@2019#
				 */
            },
		}).on('click',function(event){
			if($(event.target).hasClass('ui-datepicker-next')){
				//console.log('next action');
				d = $('#datepicker-static > .mounth2').datepicker("getDate"); //console.log(d);
				$('#datepicker-static > .mounth2').datepicker("setDate", new Date(d.getFullYear(),d.getMonth()+1,d.getDate()));

				// d2 = $('#datepicker-static >
				// .mounth1').datepicker("getDate"); console.log(d2);
				$('#datepicker-static > .mounth1').datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()));
			}
		});
		/* */

		$('#datepicker-static .mounth1 ').off('click','.ui-datepicker-header *', function(event){
			//console.log('.ui-corner-all prev');
		});

		/**
		 * put current date on valid field
		 *
		 */
		function putDateOnValidField(selectedDate){
			setTimeout(function(){ refresh_static_date();  }, 300);
			var chambre_select=true;
			if( datasave.current_room != 'chambre ô de mer'){chambre_select=false; }
			if(position_date=='#edit-submitted-periode-date-darriver'){
        		// $(position_date).val(selectedDate);
				/**
				 * Check if next day is available
				 */
				var date_arrive =  selectedDate.split('-');
				var datearrive = new Date (date_arrive[2], date_arrive[1]-1 , date_arrive[0] );
				var nextDay = new Date(datearrive);
				nextDay.setDate(datearrive.getDate()+1);				
				var jour = nextDay.getDate();
				jour = (jour < 10 )? '0'+jour:jour;
				var mois = nextDay.getMonth() + 1;
				mois = (mois < 10)? '0'+mois:mois;
				var annee = nextDay.getFullYear();
				//console.log(jour+'-'+mois+'-'+annee);
				//date.getDate();
				//date.getFullYear();
				if(chambre_select ){
					if(disableddates[jour+'-'+mois+'-'+annee]){
						/**
						 * Plus necessaire, car la date suivante peu etre reserver.
						 */
						/*
						//selectionne la date de depart automatiquement.
						$(position_date).datepicker( "setDate", selectedDate );
						$('#edit-submitted-periode-date-depart').attr("date-plage",'auto');
						$('#edit-submitted-periode-date-depart').attr("date-complete",'encourt');
						$('#edit-submitted-periode-date-depart').datepicker( "setDate", jour+'-'+mois+'-'+annee );
						//$('#edit-submitted-periode-date-depart').attr("date-complete",'complet');
						//$('#edit-submitted-periode-date-depart').datepicker( "refresh" );
						checktotal();
		        		recapitulatif();
						return true;
						*/
					}
				}else{
					if(disableddates_gite[jour+'-'+mois+'-'+annee]){
						//return false;
					}
				}

				//
        		$(position_date).datepicker( "setDate", selectedDate );
        		$(position_date).datepicker( "refresh" );
        		position_date='#edit-submitted-periode-date-depart';
        		/**
				 * remove plage end
				 */
				$(position_date).val('');
        		$(position_date).attr("date-plage",'auto');
        		$(position_date).attr("date-complete",'encourt');
        		return true;
        	}else{
        		/**
    			 * test si la date d'arriver est > à la date de depart
    			 * return false, si le nombre de jour est inferieur 2 or la date d'arriver n'est pas definie.
    			 */
    			if ( $('#edit-submitted-periode-date-darriver').val().length > 1) {
    				var date_arriver =  ( $('#edit-submitted-periode-date-darriver').val() ).split('-');
    				var datearriver = new Date (date_arriver[2], date_arriver[1]-1 , date_arriver[0] );
    				//
    				var date_depart =  selectedDate.split('-');
    				var datedepart = new Date (date_depart[2], date_depart[1]-1 , date_depart[0] );

    				var diff_days = datedepart.getTime() - datearriver.getTime() ;
    				
    				if(diff_days<=1){
    					return false;
    				}
    				/**
        			 * Test si la plage ne contient pas de plage déjà bouclé.
        			 * elle peut contenir la date d'arriver de la plage suivante. soit 2 jours
        			 */
    				var ONE_DAY = 1000 * 60 * 60 * 24
    				var nbre_jour = diff_days/ONE_DAY;
    				//console.log(nbre_jour);
    				jour_next_plage=0;
    				for(var i=1; i<=nbre_jour; i++){
    					var nextDay = new Date(datearriver);
    					nextDay.setDate(datearriver.getDate()+i);
    					var jour = nextDay.getDate();
    					jour = (jour < 10 )? '0'+jour:jour;
    					var mois = nextDay.getMonth() + 1;
    					mois = (mois < 10)? '0'+mois:mois;
    					var annee = nextDay.getFullYear();
    					if(chambre_select){
	    					if(disableddates[jour+'-'+mois+'-'+annee] ){
	    						//console.log('contient le debut de la plage déjà suivante ');
	    						jour_next_plage++;
	    						if(jour_next_plage >=2){
	    							//console.log('contient une plage déjà bloucler');
	    							return false;
	    						}
	    					}
    					}else{
    						if(disableddates_gite[jour+'-'+mois+'-'+annee] ){
	    						//console.log('contient le debut de la plage déjà suivante ');
	    						jour_next_plage++;
	    						if(jour_next_plage >=2){
	    							//console.log('contient une plage déjà bloucler');
	    							return false;
	    						}
	    					}
    					}
    				}

    			}else{return false;}

        		$(position_date).attr("date-complete",'complet');
        		checktotal();
        		recapitulatif();
        		// $(position_date).val(selectedDate);
        		$(position_date).datepicker( "setDate", selectedDate );
            	$(position_date).datepicker( "refresh" );
            	position_date='#edit-submitted-periode-date-darriver';
        	}
    		return true;
		}




	})();

	/**
	 * Affiche du recapitulatif des dates
	 */
	function display_days_recap(datas){
		if( $('.webform-component--periode > .recap-periode').length > 0 ){
			$('.webform-component--periode > .recap-periode').html(datas);
		}else{
			$('.webform-component--periode > .fieldset-wrapper').after('<div class="recap-periode">'+datas+'</div>');
		}

		$('#recapitulatif .periode').html(datas);
	}

	/**
	 * Refresh static date
	 */
	function refresh_static_date(){
		$('#datepicker-static > .mounth1').datepicker( "refresh" );
		$('#datepicker-static > .mounth2').datepicker( "refresh" );
		$('#datepicker-static > .mounth3').datepicker( "refresh" );
	}

	/**
	 * 1/2 => permet de choisir ou definir au chargement la piece selectionnée.
	 */
	/*
	$(' .webform-component--selectionner .form-radios .form-item ').each(function(){
		if($('input:checked', this).val()){
			$(this).addClass('active');
			datasave.current_room_label = $('input:checked', this).next().text();
			datasave.current_room = 'chambre ô de mer';
			refesh_select();
		}
	});
	*/
	
	/**
	 * Par defaut on masque le reste du formulaire, sauf le selecteur chambre/gite.
	 */
	
	
	/**
	 * 2/2 => Change flux date on select
	 */
	$('.form-item-submitted-selectionner input').on('change', function(){
		// remove from all
		$('.webform-component--selectionner .form-radios .form-item').removeClass('active');
		// add class to parent
		$(this).parent().addClass('active');
		datasave.current_room_label = $(this).next().text();
		datasave.current_room = $(this).val();
		refesh_select();
		add_price_on_label();
		/**
		 * on retire le masque
		 */
		$('.webform-client-form-44 > div').addClass('remove_over');
		/**
		 * on met  ajour le nombre de select dans adulte
		 */
		overrride_select_adult();
	});

	/**
	 *  Ajoute le prix sur le label sur Enfants plus de 2 ans
	 */
	 var label_enfant_plus_2ans = $('.webform-component--setting-user--enfant-plus-de-3-ans-20euro label').text();
	 function add_price_on_label(){
		 	var chambre_select = true;
			if( datasave.current_room != 'chambre ô de mer'){
				chambre_select=false; 
			}
			var pricedejeuner = generalinfo['data_gite'][3]['price'];
			if(chambre_select){
			  pricedejeuner = generalinfo['data_chambre'][3]['price'];
			}
       $('.webform-component--setting-user--enfant-plus-de-3-ans-20euro label').text(label_enfant_plus_2ans+' ('+pricedejeuner+' '+config['reservation_supp_kids_euros']+')');
	 };
     add_price_on_label();


	/**
	 * Ajouter le bouton pour reinitialiser la selection.
	 */
	 (function(){
		 if($('.webform-component--periode > .fieldset-wrapper .reset-select').length < 1){
			 $('.webform-component--periode > .fieldset-wrapper').append('<div class="reset-select"> <span class="button2">'+config['reset']+'</span> </div>');
		 }
		 $('.webform-component--periode > .fieldset-wrapper .reset-select').click(function(){
			 refesh_select();
		 });

	 })();

	 /**
	  * refresh
	  */
	 function refesh_select(){
		 $('#edit-submitted-periode-date-darriver').val('');
		 $('#edit-submitted-periode-date-darriver').attr("date-plage",'');
		 $('#edit-submitted-periode-date-darriver').attr("date-complete",'');
		 $('#edit-submitted-periode-date-depart').val('');
		 position_date='#edit-submitted-periode-date-darriver';
		 display_days_recap('');
		 refresh_static_date();
		 checktotal();
		 recapitulatif();
		 $('#recapitulatif .totalprice',).html('');
		 $('#recapitulatif .type_piece').html('');
		 $('#recapitulatif .option').html('');
		 $('#recapitulatif .personnelinfo').html('');
		 $('form div #options ').html('');
	 }

	 /**
	  * check if filed required are Valid
	  */
	 var myForm = $('.form-actions .webform-submit');
	 myForm.click(function(event){
		 var status=false;
		 $('.webform-client-form-44 input').each(function(){			 
			 if(!$(this)[0].checkValidity() && $(this).hasClass('required')){
				 //console.log(this);
				 $(this).addClass('error');
				 status = true;
			 }
		 });
		 //console.log('Status input : ', status);
		 $('.webform-client-form-44 select').each(function(){
			 if(!$(this)[0].checkValidity()){
				 $(this).addClass('error');
			 }
		 });
		 //console.log('Status select : ', status);
		 $('.webform-client-form-44 textarea').each(function(){
			 if(!$(this)[0].checkValidity()){
				 $(this).addClass('error');
			 }
		 });
		 //console.log('Status input : ', status);
		 if(status){
			 console.log('error status false');
			 event.preventDefault();
		 }
	 });

	 /**
	  * remove class error on field form
	  */
	 $(' .webform-client-form-44 input, .webform-client-form-44 select, .webform-client-form-44 textarea ').click(function(){
		 $(this).removeClass('error');
	 });
	 
	 /**
	  * 
	  */
	 function capital_fisrt_letter(yourtext){
		return yourtext.substr(0,1).toUpperCase()+yourtext.substr(1)
	 }
	 
	 /**
	  * 
	  */
	 function lower_string(str){
			return str.toLowerCase();
	 }
	 
	 /**
	  * 
	  */
	 function overrride_select_adult(){
		 //console.log('update option length ')
		var chambre_select = true;
		if( datasave.current_room != 'chambre ô de mer'){
			chambre_select=false; 
		}
		if(chambre_select){
			$(' select.selectNombreAdultes option[value="4"]').remove();
		}else{
			if( jQuery(' select.selectNombreAdultes option ').length == 4 ){
				$(' select.selectNombreAdultes ').append( $("<option></option>") .attr("value",4) .text(4) );
			}
		}
	 }
	  
});






