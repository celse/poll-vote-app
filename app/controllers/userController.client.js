'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var pullForm = document.getElementById('pull-form') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var displayName = document.querySelector('#display-name');
   var profileRepos = document.querySelector('#profile-repos') || null;
   
   var loginBtn = document.querySelector('#login-btn')|| null;
   var voteButton = document.querySelector('.btn-vote')|| null;
   var signupBtn = document.querySelector('.signup-btn')|| null;
   var navbarRight = document.querySelector('.visite') || null;
   var listTheme = document.getElementById('list-theme')|| null;
   var profile = document.getElementById('profile')|| null;
   var profile_title = document.getElementById('your-profile')|| null;
   
   if (profileId !== null) {
      var profile_data = {};   
   }
   
   var apiUrl = appUrl + '/api/:id';
   var apiUrllog = appUrl + '/api/login';
   
   var apiUrl_init = appUrl + '/api/polls';
   var apiUrl_poll_id = appUrl + '/api/polls/load';
   
   
   function mychart(doc){
     //set callback
      google.setOnLoadCallback (createChart(doc));

      //callback function
      function createChart(doc) {
         
         //create data table object
         var dataTable = new google.visualization.DataTable();
         
         //define columns
         dataTable.addColumn('string','options');
         dataTable.addColumn('number', 'Voting');
         
         //define rows of data
         
         var row_of_data =[]
         for(var i =0; i < doc['option'].length; i++){
            row_of_data.push([doc['option'][i]['label'],doc['option'][i]['vote']])
         }
         dataTable.addRows(row_of_data);
         
         
         //instantiate our chart object
         var chart = new google.visualization.ColumnChart (document.getElementById('chart'));
         
         //define options for visualization
         var options = {
            width: 600, 
            height:440, 
            is3D: true, 
            title: doc['theme'],
            animation: {
                        duration: 5000,
                        startup: true
                    }
         };
         
         
         var divChart = 
         chart.draw(dataTable, options);
         //chart.appendChild()
         //btnLink(document.getElementById('chart'),'', 'polls' );
         btnLink_simple(document.getElementById('chart'),'Home', 'polls' );
      }
  }
   
      
   function menuLogin(data, url){
      if(navbarRight != null){
         myLogout(navbarRight,url)
      }
      
   };
   function btnLink_simple(parent, label, redirec){
      var //p = document.createElement("p"),
         //txt = document.createTextNode(label),
         newLink = document.createElement("a"),
         //hr = document.createElement("hr"),
         btn = document.createElement("button"),
         txt_btn = document.createTextNode(capitalizeFirstLetter(label));
         
         newLink.setAttribute('href',  redirec);
         newLink.setAttribute('class',  'lang-logo');
         //newLink.appendChild(txt_a);
         btn.setAttribute('class','btn btn-warning btn-lg');
         btn.appendChild(txt_btn);
         
         newLink.appendChild(btn);
         //p.appendChild(txt);
         
         //parent.appendChild(hr);
         //parent.appendChild(p);
         parent.appendChild(newLink);
   }
   function btnLink(parent, label, redirec){
      var p = document.createElement("h3"),
         txt = document.createTextNode(label),
         
         newLink = document.createElement("a"),
         hr = document.createElement("hr"),
         btn = document.createElement("button"),
         txt_btn = document.createTextNode(capitalizeFirstLetter(redirec));
         
         //p.setAttribute('class','clementine-text');
         newLink.setAttribute('href',  redirec);
         newLink.setAttribute('class',  'lang-logo');
         //newLink.appendChild(txt_a);
         btn.setAttribute('class','btn btn-warning btn-lg');
         btn.appendChild(txt_btn);
         
         newLink.appendChild(btn);
         p.appendChild(txt);
         
         parent.appendChild(hr);
         parent.appendChild(p);
         parent.appendChild(newLink);
   }
   function sortArray(arrayOfObjects) {
      var byName = arrayOfObjects.slice(0);
      byName.sort(function(a,b) {
         if(a.theme != undefined & b.theme != undefined){
            var x = a.theme.toLowerCase();
         	var y = b.theme.toLowerCase();
      	   return x < y ? -1 : x > y ? 1 : 0;
         }
      	
      });
      return byName;
   }
   function updateListThemeUser(listOfTheme){
      if(listOfTheme.length == 0){
         btnLink(document.querySelector('#list-theme'),'Need to Create new theme', 'newpoll' );
      }else{
          listOfTheme.sort();
         var div_frb_group = document.createElement("div");
   	   div_frb_group.setAttribute('class','frb-group');
   	   div_frb_group.setAttribute('id','user_theme');
   		
   		for(var i = 0; i < listOfTheme.length; i++){
	      	var doc_theme = listOfTheme[i],
	      	div_frb = document.createElement("div");
	      	div_frb.setAttribute('class','frb frb-success');
	      	var div2 = document.createElement("div");
	      	div2.setAttribute('class','text-center');
	      	div2.setAttribute('id','btn_to_delet');
	      	
	      	var input = document.createElement("input");
	      	input.setAttribute('type','checkbox');
	      	input.setAttribute('id',doc_theme.id);
	      	input.setAttribute('name','checkbox');
	      	input.setAttribute('value',[i]);
	      	//input.setAttribute('name','frb-group');
	      	
	      	var label = document.createElement("label");
	      	label.setAttribute('for',doc_theme.id);
	      	
	      	
	      	
	      	var span = document.createElement("span"),
	      	txt_span = document.createTextNode(doc_theme.theme);
	      	span.setAttribute('class','frb-title');
	      	span.appendChild(txt_span);
	      	var span_vote = document.createElement("span"),
	      	txt_span_vote = document.createTextNode('vote: '+doc_theme.ip_vote.length);
	      	span_vote.setAttribute('class','frb-title');
	      	span_vote.appendChild(txt_span_vote);
	      	
	      	label.appendChild(span)
	      	label.appendChild(span_vote)
	      	var str = 'Option:',
	      	   option = doc_theme.option;
	      	for(var x = 0; x < option.length; x++){
	      	   str += ' '+option[x]['label']+' = '+option[x]['vote'];
	      	}
	      	var span2 = document.createElement("span"),
	      	txt_span2 = document.createTextNode(str);
	      	span2.setAttribute('class','frb-description');
	      	span2.appendChild(txt_span2);
	      	
	      	label.appendChild(span2)
	      	div_frb.appendChild(input)
	      	div_frb.appendChild(label);
	      	
	      	div_frb_group.appendChild(div_frb);
	      	listTheme.appendChild(div_frb_group);
          }
         var btn = document.createElement("button"),
         txt_btn = document.createTextNode('Remove');
         var url = appUrl + '/api/polls/' 
         btn_input_action(btn,'DELETE',url,delete_poll)
         btn.setAttribute('class','btn btn-warning btn-lg');
         btn.appendChild(txt_btn);
         div2.appendChild(btn)
         listTheme.appendChild(div2);
      }
   }
   function delete_poll(data){
      var userObject =JSON.parse(data);
      document.getElementById('user_theme').remove();
      document.getElementById('btn_to_delet').remove();
      updateListThemeUser(sortArray(userObject['theme']));
   }
   function updateListTheme(listOfTheme){
      
      if(listOfTheme.length == 0){
         btnLink(document.querySelector('#list-theme'), 'Need an login to Create new theme for voting', 'login' );
      }else{
         listOfTheme.sort();
   		for(var i = 0; i < listOfTheme.length; i++){
	      	var link = document.createElement("a");
	      		
	      	link.setAttribute('href',  '/polls/'+listOfTheme[i].id);
	      	link.setAttribute('class', 'theme-item list-group-item');
	      	link.innerHTML = listOfTheme[i].theme;
	      	
	      	listTheme.appendChild(link);
          }
   	}
    }
    
   function pollchart(data_Post){
      
      var data = JSON.parse(data_Post)
      document.getElementById('pull-form').remove();
      
      mychart(data);
   }
   function setMenu(userObject, url){
      document.getElementById("dashbd").innerHTML= "What would you like to do today ?"
      var head = document.getElementsByClassName("jumbotron text-center");
      btnLink_simple(head[0],'New poll', 'newpoll' );
      btnLink_simple(head[0],'My polls', 'polls' );
      
      if (userObject.displayName !== null) {
         updateHtmlElement(userObject, displayName, 'displayName', url);
      } else {
         updateHtmlElement(userObject, displayName, 'username', url);
      }
      
   };
   function updateHtmlElement (data, element, userProperty, url) {
      if(data.username != undefined){
         if(navbarRight != null){
            myLogin(navbarRight,data.username,url)
         }
      }else{
         if(navbarRight != null){
            myLogout(navbarRight)
         }
      }
      if (element != null) {
         element.innerHTML = data[userProperty];
      }
   };
   
   function pollSelect(data){
      var userObject = JSON.parse(data)
      if(userObject['userData'] != undefined){
         setMenu(userObject['userData'])
      }else{
         myLogout(navbarRight);
      }
      
      if(userObject['theme'].length != 0){
         if (userObject['ip'] != undefined){
            themeOptionUI(userObject['theme'][0], pullForm, pollchart,true);
            //console.log('je suis ici ossi')
         }else{
            themeOptionUI(userObject['theme'][0], pullForm, pollchart);} 
         }
   };
   
   function userProfil(data, url){
      var userObject = JSON.parse(data)
      profile_data = userObject['userData']
      
      if(userObject['userData'] != undefined){
         setMenu(userObject['userData'],url)
         if (profileId !== null) {
            profileId.innerHTML = userObject['userData']['id'];   
         }
   
         if (profileUsername !== null) {
            profileUsername.innerHTML = userObject['userData']['username'];   
         }
   
         if (profileRepos !== null) {
            profileRepos.innerHTML = userObject['userData']['publicRepos'];   
         }
      
         if (profile_title != null) {
            profile_title.innerHTML = userObject['userData']['displayName'];   
         }
      }else{
         myLogout(navbarRight);
      }
      
   };
   
   if(loginBtn != null || signupBtn != null){
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrllog, function(data){
         if(loginBtn != null){
            menuLogin(data, apiUrllog)   
         }else{
            var url = appUrl + '/api/signup';
            menuLogin(data, url)
         }
         
      })); 
   }else{
      if(listTheme != null){
         //Gernerated liste of theme
         var inti_load_url = apiUrl_init;
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', inti_load_url, function(data_db){
            
            var userObject = JSON.parse(data_db);
            
            if(userObject['userData'] != undefined){
               setMenu(userObject['userData'],inti_load_url)
               updateListThemeUser(sortArray(userObject['theme']));
            }else{
               myLogout(navbarRight,inti_load_url);
               
               if(userObject['theme'] != undefined ){
         			updateListTheme(userObject['theme']);
         		}
            }
         }));
      }else if(voteButton != null){
      	loadChart(userObject['vote']);
      }else if(profile != null){
         //Gernerated liste of theme
         var url = appUrl + '/api/profile' 
         
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', url, function(data){
            userProfil(data,url)
         } ));
      }else if(pullForm != null){
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl_poll_id, pollSelect));
      }else{
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
            
            if(data[0] != '<'){ 
               var userObject = JSON.parse(data);
            }else{
               var userObject = data;
            }
            
            if(userObject != undefined){
               setMenu(userObject['userData'],apiUrl)
            }else{
               myLogout(navbarRight,apiUrl);
            }
            
         }));
      }
   }
})();
