const kinveyID = 'kid_HyOb6J3L';
const kinveyPWD  = '03818bb873914bb79b0a2dfdf3dd85f1';
const kinveyURL= "https://baas.kinvey.com/";
var currentUserId="";
var currentUserEmail="";
var currentUserFirstName="";
var currentUserLastName="";
var currentUserBirthsday="";
$(document).ready(function(){
    HideAll();
    LoggedInView();
    homeClicked();
    $(".close").click(closeModal);
    $("#registerForm").submit(function(e) {e.preventDefault(); register()});
    $("#loginForm").submit(function(e){e.preventDefault(); login()});
    $("#viewAdsLink").bind('click',viewAdsClicked);
    $("#logoutLink").click(logout);
    $("#loginLink").click(loginClicked);
    $("#registerLink").click(registerClicked);
    $("#registerHomePageLink").bind('click', registerClicked);
    $("#registerAdsSectionLink").bind('click', registerClicked);
    $("#createAdd").bind('click',createAdd);
    $("#homeLink").click(homeClicked);
    $("#userPanelLink").click(userPanelClicked);
    $("#userPanelChangeSettings").bind('click', changeUserPanel);
    $("#saveChangeUserInterface").bind('click', saveChanges);
    $("#createAd").bind('click',createAd);
});

function closeModal(){
    $("#myModal").hide();
}
//DIALOG BOX
function openModal(headerInfo){
    $("#myModal").show();
    let inputText="<h1>" + headerInfo + "</h1>";
    $("#modalHeader").empty();
    $("#modalHeader").append(headerInfo);
    $("#myModal").delay(2000).fadeOut();

}
function LoggedInView(){
    $("#menuSect").show();
    if(sessionStorage.getItem('authToken')==null){
        $("#registerLink").show();
        $("#loginLink").show();
        $("#logoutLink").hide();
        $("#userPanelLink").hide();
        $("#createAdd").hide();
        $("#registerHomePage").show();
        $("#registerAdsSection").show();
    }
    else{
        $("#createAdd").show();
        $("#registerLink").hide();
        $("#loginLink").hide();
        $("#logoutLink").show();
        $("#userPanelLink").show();
        $("#registerHomePage").hide();
        $("#registerAdsSection").hide();
    }
}
function HideAll(view){
    $('main > section').hide();
}
function createAd(){

}//TODO
//Registration
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
        alert('Registration succesfull, please check your currentUserEmail');
        loginClicked();
    }
}
//LOGIN
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
    //localStorage.setItem('username', username);
    //localStorage.setItem('password',password);
    HideAll();
    LoggedInView();
    userPanelClicked();
    openModal("You have successfully logged in");
}
    function  CantLogIn(response){
        let errorMsg=JSON.stringify(response);
        if(response.readyState === 0)
            errorMsg="Network problem";
        if(response.responseJSON && response.responseJSON.description)
            errorMsg=response.responseJSON.description;
        openModal("Error: "+ errorMsg);
    }
}
function logout(){
    sessionStorage.clear();
    HideAll();
    LoggedInView();
    homeClicked();
    openModal("You have succesfully logged out!");

}
//AJAX GET ADS
function viewAdsClicked(){
    HideAll();
    LoggedInView();
    $("#adsSection").show();


    let headers={};
    headers['Authorization']= "Kinvey" + " " + sessionStorage.authToken;
    let listRealEstatesUrl = kinveyURL + "appdata/" + kinveyID + "/RealEstate";
    let listCarsUrl = kinveyURL + "appdata/" + kinveyID + "/Cars";
    let listPCUrl = kinveyURL + "appdata/" + kinveyID + "/PC";
    let listOtherUrl = kinveyURL + "appdata/" + kinveyID + "/other";
    AjaxCallAds(listRealEstatesUrl,headers);
    AjaxCallAds(listCarsUrl,headers);
    AjaxCallAds(listPCUrl,headers);
    AjaxCallAds(listOtherUrl,headers);
    $("#listAds").empty();
    let adsTable=$("<table>")
        .append($('<th>Title</th>'))
        .append($('<th>Description</th>'))
        .append($('<th>Price</th>'))
        .append($('<th>Currency</th>'));

function AjaxCallAds(URL,headers) {
    $.ajax({
        method : "GET",
        url : URL,
        headers : headers,
        success:listAds
        //error:CantLogIn
    });
};
    function listAds(data,status){
    console.log(data);
        for(let ad of data){
            adsTable.append($("<tr>"))
                    .append($('<td></td>').text(ad.Title))
                    .append($('<td></td>').text(ad.Description))
                    .append($('<td></td>').text(ad.Price))
                    .append($('<td></td>').text(ad.Currency))
        }
        $("#listAds").append(adsTable);
    };
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
    $("#homeSection").show();
}
//GET (AJAX) USER DATA
function userPanelClicked(){
    let url=kinveyURL+"user/"+ kinveyID +"/_me";
    let headers={};
   // let username=localStorage.getItem('username');
   // let password=localStorage.getItem('password');
    headers['Authorization']="Kinvey"+ " " + sessionStorage.authToken;
   // headers['Authorization']="Basic"+ " " + btoa(username + ":" + password);
    $.ajax({
        method:"GET",
        url:url,
        headers:headers,
        success : getInfo
    });
    HideAll();
    LoggedInView();
    $("#UserInterfaceForm > label").show();
    $("#UserInterfaceForm > input").hide();
    $("#userPanelChangeSettings").show();
    $("#userInterface").show();

    $("#UserInterfaceForm > input").hide();
    function getInfo(response){
        currentUserEmail=JSON.stringify(response.email);
        currentUserEmail=JSON.parse(currentUserEmail);
        $("#emailLabel").empty();
        $("#emailLabel").append("Email: " + currentUserEmail);
        currentUserFirstName=JSON.stringify(response.firstName);
        currentUserFirstName=JSON.parse(currentUserFirstName);
        $("#firstNameLabel").empty();
        $("#firstNameLabel").append("First Name: " + currentUserFirstName);
        currentUserLastName=JSON.parse(JSON.stringify(response.lastName));
        $("#lastNameLabel").empty();
        $("#lastNameLabel").append("Last Name: " + currentUserLastName);
        currentUserBirthsday=JSON.parse(JSON.stringify(response.birthsday));
        $("#birthsdayLabel").empty();
        $("#birthsdayLabel").append("Date of birth: " + currentUserBirthsday);
        currentUserId=JSON.parse(JSON.stringify(response._id));
    }
}
function changeUserPanel(){
    $("#UserInterfaceForm > label").hide();
    $("#UserInterfaceForm > input").show();
    $("#userPanelChangeSettings").hide();
}
//PUT AJAX CALL
function saveChanges(){
    //let username=localStorage.getItem('username');
    //let password=localStorage.getItem('password');
    let url=kinveyURL + "user/" +kinveyID + "/" + currentUserId;
    let headers={};
    headers['Authorization']="Kinvey"+" "+ sessionStorage.authToken;
    //headers['Authorization']="Basic" + " " + btoa(username + ":" + password);
    let email="";
    let firstName="";
    let lastName="";
    let birthsday="";
    if($("#emailUserInterface").val()!=0) {
        email = $("#emailUserInterface").val();
    }
    else{
        email=currentUserEmail;
    }
    if($("#firstNameUserInterface").val()!=0){
       firstName=$("#firstNameUserInterface").val();
    }
    else{
        firstName=currentUserFirstName;
    }
    if($("#lastNameUserInterface").val()!=0){
        lastName=$("#lastNameUserInterface").val();
    }
    else{
        lastName=currentUserLastName;
    }
    if($("#birthsdayUserInterface").val()!=0){
        birthsday=$("#birthsdayUserInterface").val();
    }
    else{
        birthsday=currentUserBirthsday;
    }
    let data={
        email: email,
        firstName: firstName,
        lastName: lastName,
        birthsday: birthsday
    };
    $.ajax({
        method: "PUT",
        url:url,
        headers:headers,
        data:data,
        success:showUserPanelLabels()
    });
        function showUserPanelLabels() {
            openModal("Succesfully changed your data");
            homeClicked();
        }

}
//CREATE AD
function createAd(){
    let collectionName=$("#categorySelectAdd").val();
    let auth=btoa(kinveyID + ":" + kinveyPWD);
    let data={
        Title: $('#adTitle').val(),
        Description: $('#adDescription').val(),
        Price: $('#price').val(),
        Currency: $('#currencySelect').val()
    };

    let headers={};
    headers['Authorization']= "Kinvey" + " " + sessionStorage.authToken;
    let adUrl=kinveyURL+"appdata/"+kinveyID +"/"+ collectionName;
    $.ajax({
        method : "POST",
        url : adUrl,
        headers : headers,
        data : data,
        //success:alert('wd'),
        //error:CantLogIn
    });
}