jQuery(document).ready(function(e){function t(t){-1==e.inArray(t,c)&&(e("head").append("<style>"+t+"</style>"),c.push(t))}function a(t){e("body > div.customstyle").length||e("body").append('<div class="customstyle"></div>'),e(t).addClass("wait-loading");var a=e(t).offset(),i='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+t+"::after{width:"+e(t).width()+"px; height:"+e(t).height()+"px; display: block;} </style>";e("body > div.customstyle").html(i+" <style> div.customstyle{display: none;z-index: 50; left:"+a.left+"px; top:"+a.top+"px; margin-top:"+.45*e(t).height()+"px; margin-left:"+.42*e(t).width()+"px;} </style>")}function i(t){setTimeout(function(){e(t).removeClass("wait-loading");var a=e(t).offset(),i='<img src="/sites/all/themes/stjoseph/less/sohohotel/images/Preloader_10.gif"><style>'+t+"::after{width:"+e(t).width()+"px; height:"+e(t).height()+"px; display: none;} </style>";e("body > div.customstyle").html(i+" <style> div.customstyle{display: none;z-index: -1; left:"+a.left+"px; top:"+a.top+"px; margin-top:"+.45*e(t).height()+"px; margin-left:"+.42*e(t).width()+"px;} </style>")},2e3)}function n(){a("#ui-datepicker-div");var t="";return e.ajax({url:"/reservation/content/0/arraydaysnotvalid/4/5/6",method:"GET",async:!1,success:function(e){t=e},error:function(e){console.log(e)},complete:function(){console.log("exécution complete avec succes"),i("#ui-datepicker-div")}}),t}function r(a){setTimeout(function(){e(".ui-datepicker td > *").each(function(a,i){var n="datepicker-content-"+CryptoJS.MD5("60 €").toString();t(".ui-datepicker td a."+n+':after {content: "60 €";}'),t(".ui-datepicker td span."+n+':after {content: "60 €";}'),e(this).addClass(n)})},0);var i=jQuery.datepicker.formatDate("dd-mm-yy",a);return-1!=jQuery.inArray(i,u)?[!1,"occuper","Déjà réservée "]:new Date<a||jQuery.datepicker.formatDate("dd-mm-yy",new Date)==i?"auto"==k.attr("date-plage")?("encourt"==k.attr("date-complete")&&(p=""),h.val()==i&&k.val()!=h.val()?("complet"==k.attr("date-complete")&&(p="plage-select"),[!0,"reservable plage-begin plage-hover"," Date d'arriver "]):k.val()==i?(p="",[!0,"reservable plage-end plage-hover"," Date de départ "]):[!0,"reservable plage-hover "+p,"réservez maintenant"]):[!0,"reservable","réservez maintenant"]:[!1,"nonreservable ","Vous ne pouvez plus réserver"]}function o(){e("#recapitulatif .vide").html(" ").css("display","none"),setTimeout(function(){if(k.val()&&h.val()){b=D.getTime()-x.getTime(),(b/=864e5)>1?e("#recapitulatif .periode").html("<strong>"+b+"</strong> nuits, du "+h.val().replace(/\-/g,"/")+" au "+k.val().replace(/\-/g,"/")+' <div class="price"><strong>Prix :</strong> <span class="price">'+60*b+"</span> €</div> "):e("#recapitulatif .periode").html("<strong> 1 </strong> nuit, le "+h.val().replace(/\-/g,"/")+' <br> <strong>Prix :</strong> <span class="price">60</span> €  ');for(var t=m.data[16].data_image_externe,a=[],i=1,n=0;n<=t;n++)0==n?a.push('<option value="" >- Non -</option>'):1==n?a.push('<option value="'+n+'" selected="selected">'+n+"</option>"):a.push('<option value="'+n+'">'+n+"</option>");for(var t=m.data[16].texte_singulier,r="",o=0;o<b;o++){var s=new Date(x.getTime()+864e5*o),l=jQuery.datepicker.formatDate("dd/mm/yy",s);r+='<li class="form-item webform-component">',r+='\t\t<label for="cbox'+o+'" style="display: inline-block;"> '+m.data[16].texte_singulier+" "+l+" ("+m.data[16].price+" euros) </label>",r+='<select id="cbox'+o+'" name="submitted[option_cbox_'+o+']" class="form-select smallselect">'+a.join("")+"</select>",r+="</li>"}var c=e("#edit-submitted-adultes").val();i=c>1?c:1,e("form div #options ").html('<fieldset> <legend>Options</legend> <ul class="form-item webform-component"> '+r+"</ul></fieldset>"),e("#recapitulatif .option").html('<strong> Petit-déjeuner : </strong> <span class="price">'+i*b*5+"</span> €"),d()}},150)}function s(){var t=0,a=[],i=0,n=1,r=e("form div #options li select ").length;for(e("form div #options li select ").each(function(t){var n=parseInt(e(this).val());n>0&&(a[i]=n,i++)}),i=0;i<r;i++)a[i]>0&&(t=a[i]+t);var o=e("#edit-submitted-adultes").val();n=o>1?o:1,e("#recapitulatif .option").html('<strong> Petit-déjeuner : </strong> <span class="price">'+n*t*5+"</span> €"),d()}function l(){var t="",a="",i=0,n=0,r="€",o=e("#edit-submitted-enfant-moins-de-3-ans-10-euros").val(),l=e("#edit-submitted-enfant-plus-de-3-ans-20euro").val(),c=e("#edit-submitted-adultes").val();c&&(t+="<strong>"+c+" "+(a=c>1?m.data[1].texte_plurier:m.data[1].texte_singulier)+" </strong>",s()),o&&(a=o>1?m.data[2].texte_plurier:m.data[2].texte_singulier,m.data[2].display_price&&m.data[2].price>0?(i=o*m.data[2].price,r="€"):(i=m.data[2].price,r=""),t+="<div > <strong>"+o+"  "+a+'  :</strong> <span class="price">'+i+"</span> "+r+"</div>"),l&&(a=l>1?m.data[3].texte_plurier:m.data[3].texte_singulier,m.data[3].display_price&&m.data[3].price>0?(n=l*m.data[3].price,r="€"):(n=m.data[3].price,r=""),t+="<div > <strong>"+l+" "+a+'  :</strong> <span class="price">'+n+"</span> "+r+" </div>"),e("#recapitulatif .personnelinfo").html(t),e("#recapitulatif .vide").html(" ").css("display","none"),d()}function d(){var t=0,a=0;e("#recapitulatif span.price").each(function(i){(a=parseInt(e(this).text()))>0&&(t+=a)}),e("#recapitulatif .totalprice").html("<strong> Total : </strong>"+t+" €");var i=e("#recapitulatif").html();e("#edit-submitted-recapitulatif").html(i)}var c=[],u=[],p="",m=function(){var t="";return e.ajax({url:"/reservation/content/0/generalinfo/4/5/6",method:"GET",async:!1,success:function(e){t=e},error:function(e){console.log(e)},complete:function(){console.log("exécution complete avec succes")}}),t}();u=n().data,e("#ui-datepicker-div ").on("click",".ui-datepicker-header a",function(){alert("click"),concole.log("log cclik")});var v="-12m",f="",h=e("#edit-submitted-periode-date-darriver").datepicker({closeText:"Fermer",prevText:"Précédent",nextText:"Suivant",currentText:"Aujourd'hui",monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],monthNamesShort:["Janv.","Févr.","Mars","Avril","Mai","Juin","Juil.","Août","Sept.","Oct.","Nov.","Déc."],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim.","Lun.","Mar.","Mer.","Jeu.","Ven.","Sam."],dayNamesMin:["Dim.","Lun.","Mar.","Mer.","Jeu.","Ven.","Sam."],weekHeader:"Sem.",dateFormat:"dd-mm-yy",showAnim:"drop",firstDay:1,minDate:v,maxDate:"+12m",numberOfMonths:[1,1],showButtonPanel:!1,onChangeMonthYear:function(t,a,i){e("body > div.customstyle").css("display","block"),u=n().data},beforeShowDay:r,onSelect:function(e){v=h.val(),(v=v.split("-"))[0]=v[0],v=new Date(v[2],v[1]-1,v[0]),k.datepicker("option","minDate",v),setTimeout(function(){k.datepicker("show")},16),k.attr("date-plage","auto"),k.attr("date-complete","encourt"),o()},onClose:function(){}}),g="",y="",b=0,x="",D="",k=e("#edit-submitted-periode-date-depart").datepicker({closeText:"Fermer",prevText:"Précédent",nextText:"Suivant",currentText:"Aujourd'hui",monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],monthNamesShort:["Janv.","Févr.","Mars","Avril","Mai","Juin","Juil.","Août","Sept.","Oct.","Nov.","Déc."],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim.","Lun.","Mar.","Mer.","Jeu.","Ven.","Sam."],dayNamesMin:["Dim.","Lun.","Mar.","Mer.","Jeu.","Ven.","Sam."],weekHeader:"Sem.",dateFormat:"dd-mm-yy",firstDay:1,showAnim:"drop",minDate:v,maxDate:"+9m",numberOfMonths:[1,1],onChangeMonthYear:function(t,a,i){e("body > div.customstyle").css("display","block"),u=n().data},beforeShowDay:r,onSelect:function(t){k.attr("date-complete","complet"),g=h.val(),g=g.split("-"),x=new Date(g[2],g[1]-1,g[0]),f=x.getDay(),g=g[2]+g[1]-1+g[0],y=k.val(),y=y.split("-"),D=new Date(y[2],y[1]-1,y[0]),y=y[2]+y[1]-1+y[0],5!=f&&6!=f||g!=y?e(this).data("datepicker").inline=!1:(alert(" La sélection unique du vendredi ou du samedi est refuser. "),e(this).data("datepicker").inline=!0),o()},onClose:function(){e(this).data("datepicker").inline=!1}}).on("change",function(){});e("form div #options").on("click","select",function(){s()}),e("#edit-submitted-enfant-moins-de-3-ans-10-euros, #edit-submitted-enfant-plus-de-3-ans-20euro, #edit-submitted-adultes").change(function(){l()})});