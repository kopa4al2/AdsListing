const kinveyID = 'kid_HyOb6J3L';
const kinveyPWD  = '03818bb873914bb79b0a2dfdf3dd85f1';
const kinveyURL= "https://baas.kinvey.com/";
$(document).ready(function(){
    HideAll();
    LoggedInView();
    $("#registerForm").submit(function(e) {e.preventDefault(); register()});
    $("#loginForm").submit(function(e){e.preventDefault(); login()});
    $("#logoutLink").click(logout);
    $("#loginLink").click(loginClicked);
    $("#registerLink").click(registerClicked);
    $("#homeLink").click(homeClicked);
    $("#userPanelLink").click(userPanelClicked);
    $("#userPanelChangeSettings").bind('click', changeUserPanel);
    $("#saveChangeUserInterface").bind('click', saveChanges);

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
}
function register(){
    let url=kinveyURL + "user/" +kinveyID + "/";
    let data={
        username: $('#registerUsername').val(),
        password: $('#registerPassword').val(),
        email: $("#registerEmail").val(),
        firstName: $("#firstNameRegisters").val(),
        lastName: $("#lastNameRegister").val(),
        birthsday:$("#birthsdayRegister").val()
    };
    let headers={};
    headers['Authorization']="Basic" + " " + btoa(kinveyID + ":" + kinveyPWD);
    headers['Content-Type']="application/json";
    $.ajax({
        method : "POST",
        url:url,
        headers:headers,
        data:JSON.stringify(data),
        success: registered
    })
    function registered(){
        alert('Registration succesfull, please check your email');
        loginClicked();
    }
}
function login(){
    let username=$("#loginUsername").val();
    let password=$("#loginPassword").val();
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
        success:LoggedIn,
        error:CantLogIn
    });
    function LoggedIn(response){
    let userAuth=response._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    localStorage.setItem('username', username);
    localStorage.setItem('password',password);
    HideAll();
    LoggedInView();
    userPanelClicked();
    alert('Login succesfull') ;
}
    function  CantLogIn(response){
        let errorMsg=JSON.stringify(response);
        if(response.readyState === 0)
            errorMsg="Network problem";
        if(response.responseJSON && response.responseJSON.description)
            errorMsg=response.responseJSON.description;
        alert(errorMsg);
    }
}
function logout(){
    sessionStorage.clear();
    HideAll();
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
function userPanelClicked(){
    let url=kinveyURL+"user/"+ kinveyID +"/_me";
    let headers={};
    let username=localStorage.getItem('username');
    let password=localStorage.getItem('password');
    headers['Authorization']="Basic"+ " " + btoa(username + ":" + password);
    $.ajax({
        method:"GET",
        url:url,
        headers:headers,
        success : getInfo
    });
    HideAll();
    LoggedInView();
    $("#userInterface").show();
    $("#UserInterfaceForm > input").hide();
    function getInfo(response){
        let email=JSON.stringify(response.email);
        $("#emailLabel").empty();
        $("#emailLabel").append("Email: " + email);
        let firstName=JSON.stringify(response.firstName);
        $("#firstNameLabel").empty();
        $("#firstNameLabel").append("First Name: " + firstName);
        let lastName=JSON.stringify(response.lastName);
        $("#lastNameLabel").empty();
        $("#lastNameLabel").append("Last Name:" + lastName);
        let birthsday=JSON.stringify(response.birthsday);
        $("#birthsdayLabel").empty();
        $("#birthsdayLabel").append("Date of birth: " + birthsday);
    }

}
function changeUserPanel(){
    $("#UserInterfaceForm > label").hide();
    $("#UserInterfaceForm > input").show();
    $("#userPanelChangeSettings").hide();
}
function saveChanges(){

}