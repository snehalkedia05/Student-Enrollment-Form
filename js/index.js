var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90931948|-31949300514940618|90960439";

$("#rollno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        no: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.name);
    $("#sclass").val(record.class);
    $("#dob").val(record.dob);
    $("#address").val(record.address);
    $("#enrdate").val(record.date);
}

function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#sclass").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrdate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function validateData() {
    var rollno, fullname, sclass, dob, address, enrdate;
    rollno = $("#rollno").val();
    fullname = $("#fullname").val();
    sclass = $("#sclass").val();
    dob = $("#dob").val();
    address = $("#address").val();
    enrdate = $("#enrdate").val();

    if (rollno === "") {
        alert("Roll No missing");
        $("#rollno").focus();
        return "";
    }
    if (fullname === "") {
        alert("Full Name missing");
        $("#fullname").focus();
        return "";
    }
    if (sclass === "") {
        alert("Class missing");
        $("#sclass").focus();
        return "";
    }
    if (dob === "") {
        alert("Date of Birth missing");
        $("#dob").focus();
        return "";
    }
    if (address === "") {
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if (enrdate === "") {
        alert("Enrollment Date missing");
        $("#enrdate").focus();
        return "";
    }

    var jsonStrObj = {
        no: rollno,
        name: fullname,
        class: sclass,
        dob: dob,
        address: address,
        date: enrdate
    };
    return JSON.stringify(jsonStrObj);
}

function getStu() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();

    } else if (resJsonObj.status === 200) {

        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();

    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#rollno").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true}); 
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}