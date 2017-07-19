'use strict';

(function () {
   var themeItem =  document.getElementsByClassName('theme-item1')|| null;
   var id_info = document.getElementById('id_info') || null;
   var lsitBtn = document.body.querySelectorAll("button") || null;
   var addButton = document.querySelector('.btn-add');
   var voteButton = document.querySelector('.btn-vote');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr') || null;
   var moreOptButton = document.querySelector('.btn-morstOption')|| null;
   var listOption = document.getElementById('list-option')|| null;
   var myForm = document.getElementById('myForm')|| null;
   var profile_Edit = document.getElementById('edit-profile')|| null;
   var btn_Edit = document.getElementById('edite')|| null;
   var btn_profil = document.getElementById('btn-profile')|| null;
   
   if (btn_profil !== null) {
      console.log(btn_profil)  
   }
   console.log(btn_Edit);   
   console.log(themeItem); 
   console.log(voteButton); 
   var apiUrl = appUrl + '/api/:id/clicks';

   function updateClickCount (data) {
      console.log('### newpoll ##')
      if(data[0] == '<'){ return null }
      var clicksObject = JSON.parse(data);
      if(clickNbr != null){
         clickNbr.innerHTML = clicksObject.clicks;
      }
      
   }
   function updatNewpoll(data){
      console.log('### newpoll @@ ##')
      
      console.log(profile_Edit, JSON.parse(data))
   }
   function profileData(data){
      var userObject = JSON.parse(data)
      console.log(userObject.userData)
      profileEdit(profile_Edit,userObject.userData)
   }
   
   
   function newpollLink(data){
      console.log('### newpollLink @@ ##')
      var userObject = JSON.parse(data)
      document.getElementById('create-theme').remove();
      if(id_info != null){
         //Gernerated liste of theme
         setMesgShare(id_info,appUrl,userObject['id']);
         /*
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrlinfo, function(data_db){
            console.log('Poste Info');
            console.log(data_db);
            var userObject = JSON.parse(data_db)
            if(userObject != undefined){
               setMenu(userObject['userData'])
            }else{
               myLogout(navbarRight);
            }
            
            
            
            
      	}));*/
      }
      console.log(data)
   }
   function updateMoreOption(){
      var newInput = document.createElement("input"),
         nrbItems = listOption.children.length + 1,
         optName = 'option'+nrbItems;
      newInput.setAttribute("type", "text");
      newInput.setAttribute("placeholder", "Enter option description");
      newInput.setAttribute("name", optName);
      newInput.setAttribute("class", 'form-control');
      listOption.appendChild(newInput);
      console.log(listOption.children.length);
   }
   
   /*console.log('current LINK :'+apiUrl_init)*/
   //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));
   
   if(moreOptButton != null){
      moreOptButton.addEventListener('click', function(){
         console.log('### je siusi ici ##')
         updateMoreOption();
         
        
      });
      
   };//profile_Edit dibtn_Edit
   if(btn_Edit != null){
      console.log('### B ##')
      var myUrls = appUrl + '/api/profile';
      btn_Edit.addEventListener('click', function (){
         console.log('### B ##'+ myUrls)
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', myUrl, profileData));
         
      }, false);
   };
   
   if(addButton != null){
      console.log('### A ##')
      
      
      var myUrl = appUrl + '/api/newpoll/';
      addButton.addEventListener('click', function () {
         btn_input_option(addButton,'POST',myUrl,newpollLink);
         console.log('### A ##'+ myUrl)
      }, false);
   };
   /*
   if(addButton != null){
      console.log('### A ##')
      var myUrl = appUrl + '/api/newpoll/';
      btn_input_option(addButton,'POST',myUrl,updatNewpoll);
      
   };
   */
   if(deleteButton != null){
      deleteButton.addEventListener('click', function () {
   
         ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
         });
   
      }, false);
   };
   if(themeItem != null){
      console.log(typeof(themeItem))
      var element = Array.prototype.filter.call(themeItem, function(item){
         console.log(item)
        
         /*
         .addEventListener('click', function () {
            //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', myUrl, updatNewpoll));
            console.log('### A ##'+ apiUrl)
         }, false);*/
      });
      console.log(element)
   };
})();
  