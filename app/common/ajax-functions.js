'use strict';

var appUrl = window.location.origin;
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            //console.log(xmlhttp.response)
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
};
function myLogout(navbarRight,url){
      console.log('url: '+url)
      var  page_attive ='';
      if (url != undefined){
         page_attive = url.split('/api/')[url.split('/api/').length-1]
      
      }
      var li_a = document.createElement("li"),
         newLink_a = document.createElement("a"),
         span_a = document.createElement("SPAN"),
         txt_a = document.createTextNode(' Sing up');
         
         if (page_attive == 'signup'){
            li_a.setAttribute('class','signup active');
         }else{
            li_a.setAttribute('class','signup');   
         }
         
         
         newLink_a.setAttribute('href',  '/signup');
         span_a.setAttribute('class','glyphicon glyphicon-edit')
         
         span_a.appendChild(txt_a);
         newLink_a.appendChild(span_a);
         li_a.appendChild(newLink_a)
         
      var li_b = document.createElement("li"),
         newLink_b = document.createElement("a"),
         span_b = document.createElement("SPAN"),
         txt_b = document.createTextNode(' Login');
         
         
         if (page_attive == 'login'){
            li_b.setAttribute('class','login active');
         }else{
            li_b.setAttribute('class','login');
         }
         newLink_b.setAttribute('href',  '/login');
         span_b.setAttribute('class','glyphicon glyphicon-log-in')
         
         span_b.appendChild(txt_b);
         newLink_b.appendChild(span_b);
         li_b.appendChild(newLink_b);
         navbarRight.appendChild(li_b)
         navbarRight.appendChild(li_a)
   }
      
function setMesgShare(element, path, id){
   var p = document.createElement("p"),
      txt_c = document.createTextNode('Congratulations!'),
      br = document.createElement("br"),
      h3 = document.createElement("h4"),
      txt_h = document.createTextNode('Your poll has been posted to'),
      link = document.createElement("a"),
      url = path+'/polls/'+id,
      linkText = document.createTextNode(url)
      ;
      p.setAttribute('class','pull-text')
       p.setAttribute('class','clementine-text')
      p.appendChild(txt_c);
      //h3.setAttribute('class', 'clementine-text')
      
      h3.appendChild(txt_h);
      h3.appendChild(br);
      
      link.setAttribute('href',url);
      link.appendChild(linkText)
      h3.appendChild(link);
      element.appendChild(p);
      element.appendChild(h3);
      //element.appendChild(link);
      
 }
function btn_input_option(btn, action ,urls, funct_back){
   var url_org =  urls;
   
   var listInput = document.getElementsByTagName('input')
   console.log(listInput.length)
   var url = urls
      
   console.log('############ URL  ###########')
   console.log(url)
   for(var i= 0; i < listInput.length; i++){
      if(listInput[i].value != ''){
         console.log(listInput[i].value);
         if(i == 0){
            url += listInput[i].value;
         }else{
            url += '-&'+listInput[i].value;
         }
      }
   }
   if(url_org != url){
      ajaxFunctions.ajaxRequest(action, url, funct_back);
   }
}
function btn_input_action(btn, action ,urls, funct_back){
   var url_org = urls;
   var url = urls
   btn.addEventListener('click', function(){
      //var url_org = urls;
      var listInput = document.getElementsByTagName('input')
      console.log(listInput.length)
      
         
      console.log('############ URL  ###########')
      console.log(url)
      if (action == 'DELETE'){
         for(var i= 0; i < listInput.length; i++){
            if(listInput[i].checked){
               console.log(listInput[i].getAttribute('id'));
               if(i == 0){
                  url += listInput[i].getAttribute('id');
               }else{
                  url += '-'+listInput[i].getAttribute('id');
               }
            }
         }
         if(url != url_org){
            ajaxFunctions.ajaxRequest('DELETE', url, function () {
               ajaxFunctions.ajaxRequest('GET', url_org, funct_back);
            });
         }
            
      }else{
         for(var i= 0; i < listInput.length; i++){
            if(listInput[i].checked){
               console.log(listInput[i].getAttribute('id'));
               url += this.getAttribute('id')+'-'+listInput[i].getAttribute('id');
              
            }
         }
         if(url != url_org){
             ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, funct_back));
         }
      }
   });
}
function updateback(data){
   console.log(data)
   
   document.querySelector('#upfste-field').remove();
   document.querySelector('#profile-username').innerHTML = JSON.parse(data).username; 
   document.querySelector('#display-name').innerHTML = JSON.parse(data).displayName;
   document.querySelector('#dprofile-repos').innerHTML = JSON.parse(data).publicRepos;
   
}
function themeOptionUI(element, parent, funt,verif){
      var form = document.createElement("form"),
      divradio = document.createElement("div"),
      theme = document.createTextNode(element['theme']),
      title = document.createElement("p"),
      btn = document.createElement("button"),
      btn_txt = document.createTextNode('Vote!'),
      hr = document.createElement("hr");
      
      btn.setAttribute('type','submit');
      btn.setAttribute('class','btn btn-primary btn-lg btn-vote');
      btn.setAttribute('id',element.id);
      btn.appendChild(btn_txt);
      
      var url = appUrl + '/api/polls/'
      btn_input_action(btn,'POST',url,funt)
      
      
      
      
      divradio.setAttribute('class','funkyradio');
     
      title.setAttribute('class','clementine-text pull-text');
      title.appendChild(theme);
      form.appendChild(title);
      console.log(element['option']);
      for(var i = 0; i < element['option'].length; i++){
         var div = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label"),
            lab_txt = document.createTextNode(element['option'][i]['label']);
            
            label.setAttribute("for",element['option'][i]['_id']),
            label.appendChild(lab_txt)
            
            div.setAttribute('class','funkyradio-success')
            input.setAttribute('type','radio')
            input.setAttribute('name','option')
            input.setAttribute('id',element['option'][i]['_id'])
            
            div.appendChild(input)
            div.appendChild(label)
            divradio.appendChild(div);
     }
      form.appendChild(divradio);
      parent.appendChild(form);
      parent.appendChild(hr);
      if(verif != undefined){
         btn.setAttribute('disabled','true')
         var link = document.createElement("a"),p = document.createElement("p"),
            span = document.createElement("SPAN"), txt_ = document.createTextNode('You have already voted for this poll'),
            txt = document.createTextNode('POLLS LIST    ');
         
         link.setAttribute('href',  '/polls');
         span.setAttribute('class','glyphicon glyphicon-log-out')
          p.appendChild(txt_);
         span.appendChild(txt);
         link.appendChild(span);
         parent.appendChild(p)
         parent.appendChild(link)
         parent.appendChild(btn)
      }else{
         parent.appendChild(btn);
      }
      
   } 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/*##### profile layout ####*/
function profileEdit (div_parent,data){
   var div_group = document.createElement("div"),
         hr = document.createElement("hr"),
         txt_bt = document.createTextNode('Update'),
         btn = document.createElement("button");
   div_group.setAttribute('id','upfste-field')      
   btn.setAttribute('class', 'btn btn-primary btn-lg btn-profile');
   btn.setAttribute('type','submit');
   btn.appendChild(txt_bt)
   console.log(data)
   if(data.username != undefined){
      var input = document.createElement("input"),
         h4 = document.createElement("h4"),
         txt = document.createTextNode('Username'); 
      h4.appendChild(txt);
      input.setAttribute('class', 'form-control');
      input.setAttribute('id','username');
      input.setAttribute('type','text');
      input.value = data.username
      div_group.appendChild(h4);
      div_group.appendChild(input);
   }
   if(data.displayName != undefined){
      var input = document.createElement("input"),
         h4 = document.createElement("h4"),
         txt = document.createTextNode('Display Name'); 
      h4.appendChild(txt);
      input.setAttribute('class', 'form-control');
      input.setAttribute('id','displayName');
      input.setAttribute('type','text');
      input.value = data.displayName
      div_group.appendChild(h4);
      div_group.appendChild(input);
   }
   if(data.password != undefined){
      var input = document.createElement("input"),
         h4 = document.createElement("h4"),
         txt = document.createTextNode('Password'); 
      h4.appendChild(txt);
      input.setAttribute('class', 'form-control');
      input.setAttribute('id','password');
      input.setAttribute('type','text');
      div_group.appendChild(h4);
      div_group.appendChild(input);
   }
    div_group.appendChild(hr);
    btn.addEventListener('click', function(){
      //var url_org = urls;
    var prt = document.getElementById('edit-profile');
    var listInput = document.getElementsByTagName('input'),
        h4 = document.createElement('h4');
    
    console.log(listInput.length);
    var test= true, fild_act = [];
      for(var i= 0; i < listInput.length; i++){
         if(listInput[i].value == ''){
            listInput[i].focus();
            break;
         }else{
            if(listInput[i].getAttribute('id') == 'username'){
                var p = document.querySelector('#profile-username');
               
                console.log(listInput[i].value)
                console.log(p.innerHTML)
                if(listInput[i].value != p.innerHTML){
                  test = false;
                  fild_act.push(listInput[i].getAttribute('id')+'-'+listInput[i].value);
                }  
            }
            if(listInput[i].getAttribute('id') == 'displayName'){
                if(listInput[i].value != document.querySelector('#display-name').innerHTML){
                  test = false;
                  fild_act.push(listInput[i].getAttribute('id')+'-'+listInput[i].value);
                }  
            }
            if(listInput[i].getAttribute('id') == 'password'){
               test = false
               fild_act.push(listInput[i].getAttribute('id')+'-'+listInput[i].value);
               break;
            }
         }
      }
      if(test != true ){
         if(fild_act.length != 0){
            console.log(fild_act);
            var params = ''
            for(var i= 0; i < fild_act.length; i++){
               
               if(params ==''){
                  params += fild_act[i]
               }else{
                  params += '-&'+fild_act[i]
               }
            }
            if(params != ''){
               var user_id = document.getElementById('profile-id').innerHTML;
               user_id.concat(params);
               var url = 'api/profile/'+params;
               console.log(params);
               ajaxFunctions.ajaxRequest('POST', url, updateback);
            }
            
         }
      }else{
         var msg = document.createTextNode('Nothing is changed, try again');
         
         //txt.fontcolor("red");
         h4.style.color = "red";
         h4.appendChild(msg)
         prt.insertBefore(h4, prt.childNodes[0])
      }
      
      /*   
      console.log('############ URL  ###########')
      if (action == 'DELETE'){
      for(var i= 0; i < listInput.length; i++){
         if(listInput[i].checked){
            console.log(listInput[i].getAttribute('id'));
            if(i == 0){
               url += listInput[i].getAttribute('id');
            }else{
               url += '-'+listInput[i].getAttribute('id');
            }
            
           
         }
      }
         if(url != url_org){
            ajaxFunctions.ajaxRequest('DELETE', url, function () {
               ajaxFunctions.ajaxRequest('GET', url_org, funct_back);
            });
         }
            
      }else{
         for(var i= 0; i < listInput.length; i++){
            if(listInput[i].checked){
               console.log(listInput[i].getAttribute('id'));
               url += this.getAttribute('id')+'-'+listInput[i].getAttribute('id');
              
            }
         }
         if(url != url_org){
             ajaxFunctions.ready(ajaxFunctions.ajaxRequest(action, url, funct_back));
         }
        
      }*/
      
        
   });
   div_group.appendChild(btn)
   div_parent.appendChild(div_group)
}
function myLogin(navbarRight, namew, url){
   
   var  page_attive = url.split('/api/')[url.split('/api/').length-1]
   
   
   var li_c = document.createElement("li"),
      newLink_c = document.createElement("a"),
      
      span_c = document.createElement("SPAN"),
      txt_c = document.createTextNode(' Profile');
      
      
      if (page_attive == 'profile'){
         //document.getElementsByClassName('active')[0].removeClass("active");
         li_c.setAttribute('class','profile active');
      }else{
         li_c.setAttribute('class','profile');   
      }
      newLink_c.setAttribute('href',  '/profile');
      span_c.setAttribute('class','glyphicon glyphicon-cog')
      
      span_c.appendChild(txt_c);
      newLink_c.appendChild(span_c);
      li_c.appendChild(newLink_c)
      
   var li_d = document.createElement("li"),
      newLink_d = document.createElement("a"),
      span_d = document.createElement("SPAN"),
      txt_d = document.createTextNode(' logout');
      
      
      if (page_attive == 'logout'){
         li_d.setAttribute('class','logout active');
      }else{
         li_d.setAttribute('class','logout');   
      }
      newLink_d.setAttribute('href',  '/logout');
      span_d.setAttribute('class','glyphicon glyphicon-log-out')
      
      span_d.appendChild(txt_d);
      newLink_d.appendChild(span_d);
      li_d.appendChild(newLink_d)
      
   var li_e = document.createElement("li"),
      newLink_e = document.createElement("a"),
      span_e = document.createElement("SPAN"),
      p = document.createElement("p"),
      txt_e = document.createTextNode('Welcome ');
      if(namew){
         var txt_name = document.createTextNode(namew);
         span_e.appendChild(txt_name);
      }
      
      li_e.setAttribute('class','profile');
      newLink_e.setAttribute('href',  '/polls');
      span_e.setAttribute('class','glyphicon glyphicon-user ');
      span_e.setAttribute('id','display-namew');
      p.appendChild(txt_e);
      p.appendChild(span_e);
      newLink_e.appendChild(p);
      li_e.appendChild(newLink_e); 
      navbarRight.appendChild(li_e)
      navbarRight.appendChild(li_c)
      navbarRight.appendChild(li_d)
      
   
}   