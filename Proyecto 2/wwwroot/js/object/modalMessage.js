$(document).ready(function () {
    clickActionModalSetup();
});
function clickActionModalSetup() {
    $(".backSetup").click(function () {
        $(".contentSetup.access,.contentSetup.privacy").removeClass("active");
    });
    $("#closeSetup").click(function () {
        $(".contentSetup.main").removeClass("active");
        setTimeout(() => {
            $("body").removeClass("block");
            $(".mainContentSetup").removeClass("active");
        }, 250);
    });
}