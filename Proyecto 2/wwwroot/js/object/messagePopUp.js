$(document).ready(function () {
    closeMessage();
});
function buildMessage(message,popUp) {
    /*$(".contentPopUp .boxPopUp .leftPopUp h5").remove();*/
    if (message.includes("\n")) {
        for (var i = 0; i < message.split("\n").length; i++) {
            if (i == 0)
                $(".contentPopUp-" + popUp + " .boxPopUp .leftPopUp").append("<h5>" + message.split("\n")[i] + "</h5>");
            else
                $(".contentPopUp-" + popUp + " .boxPopUp .leftPopUp h5:last-child").after("<h5>" + message.split("\n")[i] + "</h5>");
        }

    }
    else {
        $(".contentPopUp-" + popUp + " .boxPopUp .leftPopUp").append("<h5>" + message + "</h5>");
    }
    $(".contentPopUp-" + popUp + "").addClass("active");
    setTimeout(() => {
        $(".contentPopUp-" + popUp + "").removeClass("active");
        setTimeout(() => {
            $(".contentPopUp-" + popUp + " .boxPopUp .leftPopUp h5").remove();
        }, 250);
    }, 10000);
}
function closeMessage() {
    $(".contentPopUp.active .btnClosePopUp").click(function () {
        $(".contentPopUp.active").removeClass("active");
        setTimeout(() => {
            $(".contentPopUp .boxPopUp .leftPopUp h5").remove();
        }, 250);
    });
}