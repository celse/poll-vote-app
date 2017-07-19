'use strict';

(function () {
   var id_info = document.getElementById('url-info') || null;
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var moreOptButton = document.querySelector('.btn-morstOption')|| null;
   var listOption = document.getElementById('list-option')|| null;
   var myForm = document.getElementById('myForm')|| null;
   var profile_Edit = document.getElementById('edit-profile')|| null;
   var btn_Edit = document.getElementById('edite')|| null;
   
   
   var apiUrl = appUrl + '/api/:id/clicks';

   function profileData(data){
      var userObject = JSON.parse(data)
      profileEdit(profile_Edit,userObject.userData)
   }
   
   function newpollLink(data){
      var userObject = JSON.parse(data)
      document.getElementById('create-theme').remove();
      if(id_info != null){
         //Gernerated liste of theme
         setMesgShare(id_info,appUrl,userObject['id']);
      }
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
   }
   
   if(moreOptButton != null){
      moreOptButton.addEventListener('click', function(){
         updateMoreOption();
      });
      
   };
   //profile_Edit dibtn_Edit
   if(btn_Edit != null){
      var myUrls = appUrl + '/api/profile';
      btn_Edit.addEventListener('click', function (){
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', myUrl, profileData));
         
      }, false);
   };
   
   if(addButton != null){
      var myUrl = appUrl + '/api/newpoll/';
      addButton.addEventListener('click', function () {
         btn_input_option(addButton,'POST',myUrl,newpollLink);
      }, false);
   };
   
   if(deleteButton != null){
      deleteButton.addEventListener('click', function () {
   
         ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
         });
   
      }, false);
   };
   
})();
  