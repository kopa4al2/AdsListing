const kinveyID = 'kid_HyOb6J3L';
const kinveyPWD  = '03818bb873914bb79b0a2dfdf3dd85f1';
const kinveyURL= "https://baas.kinvey.com/";
/*$(function(){
    HideAll();
    LoggedInView();
    $("#registerForm").submit(function(e) {e.preventDefault(); register()});
    $("#loginForm").submit(function(e){e.preventDefault(); login()});
    $(document).readyWait($("#loginLink").click(loginClicked()));
    $("#logoutLink").click(logout);
    //$("#registerLink").click(registerClicked());

})*/
$(document).ready(function(){
    HideAll();
    LoggedInView();
    $("#registerForm").submit(function(e) {e.preventDefault(); register()});
    $("#loginForm").submit(function(e){e.preventDefault(); login()});
    $("#logoutLink").click(logout);
    $("#loginLink").click(loginClicked);
    $("#registerLink").click(registerClicked);
    $("#homeLink").click(homeClicked);

});
function LoggedInView(){
    $("#menuSect").show();
    if(sessionStorage.getItem('authToken')==null){
        $("#registerLink").show();
        $("#loginLink").show();
        $("#logoutLink").hide();
        $("#userPanelLink").hide();
    }
    else{
        $("#registerLink").hide();
        $("#loginLink").hide();
        $("#logoutLink").show();
        $("#userPanelLink").show();
    }
}
function HideAll(view){
    $('main > section').hide();
   // $('#'+view).show();
   // $("#menuSect").show();
}
function register(){
    let url=kinveyURL + "user/" +kinveyID + "/";
    let data={
        username: $('#registerUsername').val(),
        password: $('#registerPassword').val()
    };
    let headers={};
    headers['Authorization']="Basic" + " " + btoa(kinveyID + ":" + kinveyPWD);
    headers['Content-Type']="application/json";
    $.ajax({
        method : "POST",
        url:url,
        headers:headers,
        data:JSON.stringify(data)
    })
}
function login(){
    let auth=btoa(kinveyID + ":" + kinveyPWD);
    let data={
        username: $('#loginUsername').val(),
        password: $('#loginPassword').val()
    };
    let headers={};
    headers['Authorization']= "Basic" + " " + auth;
    //headers['Content-Type']= "application/json";
    let loginUrl=kinveyURL+"user/"+kinveyID + "/login";
    $.ajax({
        method : "POST",
        url : loginUrl,
        headers : headers,
        data : data,
        success:LoggedIn
    });
function LoggedIn(response){
    let userAuth=response._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth)
    LoggedInView();
}
}
function logout(){
    sessionStorage.clear();
    LoggedInView();
}
function registerClicked(){
    HideAll();
    LoggedInView();
    $("#registerInterface").show();
}
function loginClicked(){
    HideAll();
    LoggedInView();
    $("#loginInterface").show();
}
function homeClicked(){
    HideAll();
    LoggedInView();
}