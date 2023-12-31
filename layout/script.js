$(document).ready(function(){
  $("#next").hide();
  
  $("#send").on("click", function() {
    $("form").hide(); // Nascondi il form
    $(".back").hide(); // Nascondi l'icona'
    $("#next").show(); // Mostro il promt
  });

  $("form").submit(function(event) {

    event.preventDefault(); // impedisci il comportamento di default del form

    var ipValue = $("#ip-input").val();
    var subnetValue = $("#subnet-input").val();
    convertToBinary(ipValue, "binary-result"); // chiamo la funzione convertToBinary
    convertToBinary(subnetValue, "subnet-result"); // chiamo la funzione convertToBinary
    convertToBinary(ipValue, "binary-result2"); // chiamo la funzione convertToBinary
    convertToBinary(subnetValue, "subnet-result2"); // chiamo la funzione convertToBinary
    var network = getNetwork(ipValue, subnetValue);
    $("#and-result").text(network);
    var hostid = getHost(ipValue, subnetValue);
    $("#host-id").text(hostid);

  });

});

function validateIP() {
  var ipInput = $("#ip-input");
  var ip = ipInput.val();

  var ipRegular = /^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])$/;
  var isValid = ipRegular.test(ip);

  // Modifica il colore del bordo in base alla validità
  if (isValid) {
    ipInput.css("border-color", "green");
    var subnetContainer = document.getElementById("subnet-container");
    subnetContainer.style.display = "block";
  } else {
    ipInput.css("border-color", "red");
    var subnetContainer = document.getElementById("subnet-container");
    subnetContainer.style.display = "none";
  }
  return isValid;
}

function validateSubnet() {
  var subnetInput = $("#subnet-input");
  var subnet = subnetInput.val().trim(); // rimuove gli spazi bianchi all'inizio e alla fine per evitare che l'utente inserisca uno spazio bianco prima o dopo l'indirizzo IP

  // Controllo se la subnet è valida
  var subnetRegular = /^(255\.(255|254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(255|254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)|\d{1,3}\.\d{1,3}\.\d{1,3}\.0|\d{1,3}\.\d{1,3}\.0\.0|\d{1,3}\.0\.0\.0|0\.0\.0\.0)$/;
  var isValid = subnetRegular.test(subnet);

  // Modifica il colore del bordo in base alla validità
  if (isValid) {
    subnetInput.css("border-color", "green");
  } else {
    subnetInput.css("border-color", "red");

  }
  return isValid;
}

function checkFields() {
  if (validateIP() && validateSubnet()) {
    $("#send").prop("disabled", false);
    $("#send").css("cursor", "pointer");
  } else {
    $("#send").prop("disabled", true);
    $("#send").css("cursor", "not-allowed", "background-color", "white");
  }
}

function convertToBinary(value, targetId) {
  // divido l'ip in ottetti
  var octets = value.split(".");

  // converto ogni ottetto in binario
  var binary = octets.map(function(octet) {
    return parseInt(octet, 10).toString(2).padStart(8, "0");
  }).join(".");

  // output
  $("#" + targetId).text(binary);
}

function getNetwork(ipAddress, subnetMask) {

  var ipOctets = ipAddress.split(".");
  var subnetOctets = subnetMask.split(".");

  var resultOctets = ipOctets.map(function (ipOctet, index) {
    var ipBinary = parseInt(ipOctet, 10).toString(2).padStart(8, "0");
    var subnetBinary = parseInt(subnetOctets[index], 10).toString(2).padStart(8, "0");
    
    var andResult = "";
    for (var i = 0; i < 8; i++) {
      andResult += ipBinary[i] === "1" && subnetBinary[i] === "1" ? "1" : "0";
    }
    
    return andResult;
  });

  var binaryResult = resultOctets.join(".");  
  return binaryResult;
}

function getHost(ipAddress, subnetMask) {
  var ipOctets = ipAddress.split(".");
  var subnetOctets = subnetMask.split(".");

  var hostIdOctets = ipOctets.map(function (ipOctet, index) {
    var ipBinary = parseInt(ipOctet, 10).toString(2).padStart(8, "0");
    var subnetBinary = parseInt(subnetOctets[index], 10).toString(2).padStart(8, "0");

    var hostIdResult = "";
    for (var i = 0; i < 8; i++) {
      hostIdResult += ipBinary[i] === "1" && subnetBinary[i] === "1" ? "0" : ipBinary[i];
    }

    return hostIdResult;
  });

  var binaryHostId = hostIdOctets.join(".");

  return binaryHostId;
}

function reduce() {
  $("form").show(); // Mostro il form
  $("#next").hide(); // Nascondo il promt
  $(".back").show(); // Mostro l'icona'
}
