var flagToResize = [false, false, false];
var flagToOrganize = [false, false, false, false, false, false, false];
var col = 0;
var product = [[]];
var xProduct = 0;
var yProduct = 0;
var modLoadProduct = 0;
$(document).ready(function () {
    checkLocation();
    $(".header .menuBar").click(function () {
        openMenu();
    })
    $.ajax({
        url: "../Object/ModalMessage",
        success: function (html) {
            $("body").append(html);
            $.ajax({
                url: "../Object/Modal",
                success: function (html) {
                    $("body").append(html);
                }
            });
        }
    });
    checkDimensions();
    actionClick();
    loadProduct();
});
$(window).resize(function () {
    checkDimensions();
});
$(window).scroll(function () {
    detectScroll();
});
function alertProduct() {
    var codP = ["000","00","0",""];
    $.ajax({
        url: "../Object/AlertProduct",
        cache: "false",
        method: "post",
        success: function (result) {            
            if (result != "empty") {
                $(".boxAlert .numMessage").text(result.split("*").length-1);
                $(".mainContentSetup .setupBody ul:nth-child(1) li"). remove()
                for (var i = 0; i < result.split("*").length - 1; i++) {                    
                    $(".mainContentSetup .setupBody ul:first-child").append(
                        "<li class='checkAlert alert-"+i+"'><label>" + codP[result.split("*")[i].split("+")[0].length] + "" + result.split("*")[i].split("+")[0] +
                            "</label><ul>" +
                                "<li>" + result.split("*")[i].split("+")[1] + "</li>" +
                                "<li>" + result.split("*")[i].split("+")[2] + "</li>" +
                            "</ul>" +
                        "</li>"
                    );
                }
                $(".mainContentSetup .setupBody ul:nth-child(1) .checkAlert").click(function () {
                    var item = $(this).children("label").text();
                    $(".table-concept table tbody").find("tr").each(function () {                        
                        if (parseInt($(this).children("td:nth-child(2)").text()) == parseInt(item)) {
                            $(this).addClass("highRow");
                            window.scrollTo(0, $(this).offset().top);
                            setTimeout(() => {
                                $(this).removeClass("highRow");
                            }, 4000);
                        }
                    });
                    $("#closeSetup").click();
                });
            }
            else {
                $(".boxAlert .numMessage").text(0);
            }

        }
    })
    setTimeout(() => {
        hideLoadPage();
    }, 550);
}
function loadProduct() {
    var row = 0;
    var codP = ['000','00','0',''];
    $.ajax({
        url: "../Object/CheckProduct",
        cache: "false",
        method: "post",
        data: { mod: modLoadProduct },
        success: function (result) {
            $(".table-concept table tbody tr").remove();
            for (var i = 0; i < result.split("*").length - 1; i++) {
                $(".table-concept table tbody").append(
                    "<tr><td>" +
                        "<input class='selectItem' type='checkbox' />"+
                    "</td>" +
                    "<td>" +
                        codP[result.split("*")[i].split("+")[0].length - 1] + "" + result.split("*")[i].split("+")[0] +
                    "</td>"+
                    "<td>" +
                        "<input type='text' class='nameProduct disabled' placeholder='" + result.split("*")[i].split("+")[1]+"' disabled/>" +
                    "</td>" +
                    "<td>" +
                        result.split("*")[i].split("+")[2] +
                    "</td>" +
                    "<td>" +
                        "<input type='number' class='priceProduct disabled' placeholder='₡" + result.split("*")[i].split("+")[3] + "' disabled/>" +
                    "</td>" +
                    "<td>" +
                        result.split("*")[i].split("+")[6]  +
                    "</td>" +
                    "<td>" +
                        "<input type='number' class='minProduct disabled' placeholder='" + result.split("*")[i].split("+")[4] + "' disabled/>" +
                    "</td>" +
                    "<td>" +
                        "<input type='number' class='maxProduct disabled' placeholder='" + result.split("*")[i].split("+")[5] + "' disabled/>" +
                    "</td>"+
                    "<td>" +
                        "<span class='iconButton iconAlt iconAlt2'><i class='fa-solid fa-info'></i></span>"+
                        "<span class='iconButton iconAlt iconAlt1'><i class='fa-solid fa-file-pen'></i></span>"+
                    "</td></tr>"
                );
                $(".table-concept table tbody tr:last-child .iconAlt2").click(function () {

                });
                $(".table-concept table tbody tr:last-child .iconAlt1").click(function () {                    
                    $(this).parent().parent().find("input").each(function () {
                        if ($(this).hasClass("disabled")) {
                            $(this).removeClass("disabled");
                            $(this).prop("disabled", false);
                            $(this).addClass("highInput");
                            if (!$(".contentPopUp-0").hasClass("active")) {
                                buildMessage("Se habilitaron los espacios por editar\nAl editar alguno de los campos presione ENTER para efectuar el cambio", 0);
                            }
                            setTimeout(() => {
                                $(this).removeClass("highInput");
                            }, 4000);
                        }
                        else {
                            $(this).addClass("disabled");
                            $(this).attr("disabled", "disabled");
                        }
                    });                    
                });
                $(".table-concept table tbody tr:last-child input").keypress(function (e) {
                    if (e.which === 13) {                        
                        if ($(this).val() !== "") {                            
                            checkFieldOnTableToUpdate($(this));
                        }                        
                    }
                });
                row++;
            }
            $(".table-concept table tbody .selectItem").click(function () {
                loadItem($(this));
            });
            alertProduct();
        }
    });
}
function checkFieldOnTableToUpdate(object) {
    var row = 0;
    var flagToUpdate = false;
    if ($(object).hasClass("minProduct")) {
        $(object).parent().parent().find("input").each(function () {
            if (parseInt($(object).val()) > parseInt($(this).attr("placeholder")) && $(this).hasClass("maxProduct")) {
                buildMessage("La cantidad mínima no puede superar la cantidad máxima", 0);
            }
            else {
                flagToUpdate = "minStock";
            }
        });        
    }
    else if ($(object).hasClass("maxProduct")) {
        $(object).parent().parent().find("input").each(function () {
            if (parseInt($(object).val()) <= parseInt($(this).attr("placeholder")) && $(this).hasClass("minProduct")) {
                buildMessage("La cantidad máxima no puede ser inferior a la cantidad mínima", 0);
            }
            else {
                flagToUpdate = "maxStock";
            }
        });
    }
    else if ($(object).hasClass("nameProduct")) {
        if ($(object).val().length > 30) {
            buildMessage("El nombre no puede superar los 30 caracteres", 0);
        }
        else {
            flagToUpdate = "nameProduct";
        }
    }
    else if ($(object).hasClass("priceProduct")) {
        if ($(object).val() <= 0) {            
            buildMessage("El precio no puede ser 0", 0);
        }
        else {
            flagToUpdate = "priceProduct";
        }
    }
    if (flagToUpdate != false) {
        $(object).parent().parent().find("td").each(function () {
            if (row == 1) {
                updateProduct($(this).text(), flagToUpdate, $(object).val());
                return false;
            }
            row++;
        });
    }
    else
        $(object).val(null);
}
function updateProduct(id, field, val) {
    if (field == "priceProduct" || field == "minStock" || field == "maxProduct") {
        val = parseInt(val);
    }
    id = parseInt(id);    
    $.ajax({
        url: "../Object/UpdateFieldProduct",
        method: "post",
        cache: "false",
        data: {
            cod: id,
            field: field,
            value:val
        },
        success: function (result) {            
            if (result == 1) {       
                buildMessage("Actualización exitosa",0);
                loadProduct();
            }
        }
    });
}
function checkDimensions() {
    if (window.innerWidth <= 1220 && !flagToResize[0]) {
        flagToResize[0] = true;
        setTimeout(() => {
            $(".header .boxHeaderAlt").addClass("disappear");
        }, 550);
    }
    else {
        flagToResize[0] = false;
        setTimeout(() => {
            $(".header .boxHeaderAlt").removeClass("disappear");
        }, 350);
    }
    if (window.innerWidth <= 550 & !flagToResize[1]) {
        $("header .btnFlag").addClass("mobile");
    }
    else {
        flagToResize[1] = false;
        setTimeout(() => {
            $("header .btnFlag").removeClass("mobile");
        }, 350);
    }

}
function checkLocation() {
    var result = [null, ""];
    if (window.location.href.includes("home/inicio")) {
        result[0] = ".headerpanel .menuLeft .navMenu .navOption:nth-child(1)";
        result[1] = "Inicio"
    }
    $(result[0]).addClass("active");
    $(document).attr("title", result[1] + " - " + $(document).attr("title"));
}
function openMenu() {
    if (!$(".header .menuBar").hasClass("active")) {
        $(".header .menuBar").addClass("active");
        $(".header").addClass("active");
        $("body").addClass("overflowOff");
        if ($(".btnFlag").hasClass("mobile")) {
            setTimeout(() => {
                $(".btnFlag").addClass("show");
            }, 500);
        }
    }
    else {
        $(".header .menuBar").removeClass("active");
        $(".header").removeClass("active");
        $("body").removeClass("overflowOff");
        if ($(".btnFlag").hasClass("mobile")) {
            $(".btnFlag").removeClass("show");
        }
    }
}
function detectScroll() {    
    if ($("html,body").scrollTop() == 0) {        
        $(".header,.headerlogo").removeClass("sticky");        
        $("#boxBtnUpPage").removeClass("visible");
        flagToResize[2] = false;
    }
    else if ($("html,body").scrollTop() > 100 && !flagToResize[2]) {
        $("#boxBtnUpPage").addClass("visible");        
        $(".header").addClass("sticky");
        if (window.innerWidth >= 1379) {            
            $(".headerlogo").addClass("sticky");
        }
        flagToResize[2] = true;
    }
    // console.log(text)
}
function actionClick() {
    $(".headerpanel .menuLeft .childOption").click(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).children("ul").addClass("active");
        }
        else {
            $(this).removeClass("active");
            $(this).children("ul").removeClass("active");
        }
    });
    //ABRE LOS SUBMENU DESDE TABLETS Y CELULARES
    $(".boxHeader .navMenu .navOption").click(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            if ($(this).children("ul").hasClass("subMenu")) {
                const titleMenu = $(this).children("span:nth-child(1)").text();
                $(this).children("ul").clone().appendTo(".header .boxOptionAlt .boxOption .headerLeft .menuLeft");
                $(".header .boxOptionAlt").addClass("active");
                $(".boxOptionAlt .menuLeft ul").attr("class", "navMenu");
                $(".boxOptionAlt .menuLeft ul li").attr("class", "navOption");
                $(".boxOptionAlt .menuLeft ul li").children("span").attr("class", "navItem");
                $(".header .menuBar").addClass("menuBack");
                $(".header .menuBack").removeClass("menuBar");
                $(".header .menuBack svg,.header .menuBack i").remove()
                $(".header .menuBack").append("<i class='fa-solid fa-chevron-left'></i>");
                setTimeout(() => {
                    $(".header .menuBack").after(
                        "<label class='titleMenu'>" + titleMenu + "</label>"
                    );
                    $(this).removeClass("active");
                }, 550);
                $(".header .menuBack").click(function () {
                    $(".header .boxOptionAlt").removeClass("active");
                    $(".header .menuBack").addClass("menuBar");
                    $(".header .menuBack").removeClass("menuBack");
                    $(".header .menuBar svg,.header .menuBar i").remove()
                    $(".header .menuBar").append("<i class='fa-solid fa-bars'></i>");
                    $(".header .titleMenu").remove();
                    setTimeout(() => {
                        $(".header .boxOptionAlt .menuLeft .navMenu").remove();
                    }, 450);
                });
                $(".boxOptionAlt .navMenu .navOption").click(function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active");
                    }
                    else {
                        $(this).removeClass("active");
                    }
                });
            }
        }
        else
            $(this).removeClass("active");
    });
    $("#btnUpPage").click(function () {
        $(window).scrollTop(0);
    });
    $(".boxAlert").click(function () {
        $(".mainContentSetup").addClass("active");
        $("body").addClass("block");
        setTimeout(() => {
            $(".contentSetup.main").addClass("active");
        }, 250);
    });
    $(".rowBody .button-container .primary").click(function () {
        $(".dialog").addClass("active");
        $("body").addClass("block");
    });
    $(".rowBody .button-container .secondary").click(function () {
        if (checkItemLoad()) {
            $(".dialog2").addClass("active");
            checkLastOrderDeliver();
            insertItemLoad();
            $("body").addClass("block");
        }            
        else {
            buildMessage("Primero seleccione productos con la palomilla que se realza a la izquierda", 0);
            $(".table-concept table tbody input").addClass("highInput");
            setTimeout(() => {
                $(".table-concept table tbody input").removeClass("highInput");
            }, 8000);
        }            
    });
    $(".rowBody .button-container .danger").click(function () {
        deleteProduct();
    });
    $(".rowBody .button-container .alert").click(function () {
        if (!$(".contentPopUp-0").hasClass("active"))
            buildMessage("Las búsquedas se realizan por medio del Código del Producto");

        searchCodeProduct();
    });
    $(".table-concept table tr th .iconTool").click(function () {
        var col = $(this).attr("class").split("-")[1];        
        if (col == 1 && !flagToOrganize[0]) {
            modLoadProduct = 14;
            flagToOrganize[0] = true;
        }
        else if (col == 1 && flagToOrganize[0]) {
            modLoadProduct = 13;
            flagToOrganize[0] = false;
        }
        else if (col == 2 && !flagToOrganize[1]) {
            modLoadProduct = 2;
            flagToOrganize[1] = true;
        }
        else if (col == 2 && flagToOrganize[1]) {
            modLoadProduct = 1;
            flagToOrganize[1] = false;
        }
        else if (col == 3 && !flagToOrganize[2]) {
            modLoadProduct = 12;
            flagToOrganize[2] = true;
        }
        else if (col == 3 && flagToOrganize[2]) {
            modLoadProduct = 11;
            flagToOrganize[2] = false;
        }
        else if (col == 4 && !flagToOrganize[3]) {
            modLoadProduct = 4;
            flagToOrganize[3] = true;
        }
        else if (col == 4 && flagToOrganize[3]) {
            modLoadProduct = 3;
            flagToOrganize[3] = false;
        }
        else if (col == 5 && !flagToOrganize[4]) {
            modLoadProduct = 6;
            flagToOrganize[4] = true;
        }
        else if (col == 5 && flagToOrganize[4]) {
            modLoadProduct = 5;
            flagToOrganize[4] = false;
        }
        else if (col == 6 && !flagToOrganize[5]) {
            modLoadProduct = 10;
            flagToOrganize[5] = true;
        }
        else if (col == 6 && flagToOrganize[5]) {
            modLoadProduct = 9;
            flagToOrganize[5] = false;
        }
        else if (col == 7 && !flagToOrganize[6]) {
            modLoadProduct = 8;
            flagToOrganize[6] = true;
        }
        else if (col == 7 && flagToOrganize[6]) {
            modLoadProduct = 7;
            flagToOrganize[6] = false;
        }
        loadProduct();
    });
}
function searchCodeProduct() {
    $(".table-concept table tbody").find("tr").each(function () {
        if (parseInt($(this).children("td:nth-child(2)").text()) == parseInt($(".button-container .tbSearch").val())) {
            $(this).addClass("highRow");
            window.scrollTo(0, $(this).offset().top);
            setTimeout(() => {
                $(this).removeClass("highRow");
            }, 4000);
        }
    });
}
function checkLastOrderDeliver() {
    $.ajax({
        url: "../Object/CheckLastOrderDeliver",
        cache: "false",
        method: "post",
        success: function (result) {
            if (result != "error") {
                $(".dialog2 .contentBox-1 .boxBody #ticket").val((parseInt(result)+1));
            }
        }
    });
}
function deleteProduct() {
    var flagToDelete = false;
    for (var i = 0; i < xProduct; i++) {
        if (product[[i, 5]] == 1) {
            $.ajax({
                url: "../Object/DeleteProduct",
                cache: "false",
                method: "post",
                data: {
                    cod: parseInt(product[[i,0]])
                },
                beforeSend: function () {
                    loadPage();
                },
                success: function (result) {
                    if (result == 1) {
                        flagToDelete = true;
                        
                        if ((i + 1) >= xProduct) {                            
                            if (flagToDelete) {
                                buildMessage("Productos eliminado exitosamente",0);
                                loadProduct();
                                xProduct = 0;
                                product = null;
                                product = [[]];
                            }
                        }
                    }                        
                }
            });
        }

    }
 
}
function insertItemLoad() {
    for (var i = 0; ; i++) {
        if (product[[i, 5]] == 1) {
            $(".dialog2 .contentBox-2 .boxBody table tbody").append(
                "<tr>" +
                    "<td>" +
                        product[[i,0]] +
                    "</td>" +
                    "<td>" +
                        product[[i, 1]] +
                    "</td>" +
                    "<td>" +
                        product[[i, 2]] +
                    "</td>" +
                    "<td>" +
                        "<input type='number' placeholder='Disponible " + product[[i, 4]] + "' class='countOrder' autocomplete='off'/>" +
                    "</td>" +
                    "<td>" +
                        product[[i, 3]] +
                    "</td>" +
                    "<td>" +
                        "<span class='iconButton deleteItem'><i class='fa-solid fa-circle-minus'></i></span>" +
                    "</td>"+
                "</tr>"
            );
            $(".deleteItem:last-child").click(function () {
                $(this).parent().parent().remove();
                if (!$(this).parent().parent().find("tr").length > 0) {
                    $(".closeModal").click();
                }
            });
        }
        if (product[[i + 1, 0]] == null) {
            if (!$(".dialog2 .contentBox-2 .boxBody table tbody tr").length > 0) {
                $(".closeModal").click();
            }
            break;
        }            
    }
}
function checkItemLoad() {
    var result = false;
    for (var i = 0; i < xProduct; i++) {
        if (product[[i, 0]] != null) {
            if (product[[i, 5]] == 1) {
                result = true;
                break;
            }
        }
    }
    return result;
}
function loadItem(object) {
    if ($(object).prop("checked")) {
        $(object).parent().parent().find("td").each(function () {
            if (col > 0 && col <= 5) {
                if(col == 1)
                    product[[xProduct, yProduct]] = $(this).text();
                else if (col == 2)
                    product[[xProduct, yProduct]] = $(this).children("input").attr("placeholder");
                else if (col == 3)
                    product[[xProduct, yProduct]] = $(this).text();
                else if (col == 4)
                    product[[xProduct, yProduct]] = $(this).children("input").attr("placeholder");
                else if (col == 5)
                    product[[xProduct, yProduct]] = $(this).text();
                
                yProduct++;
            }
            else if (col > 5) {
                product[[xProduct, yProduct]] = 1;
                yProduct = 0;
                xProduct++;
                col = 0;
                return false;
            }
            col++;
        });
    }
    else {
        $(object).parent().parent().find("td").each(function () {
            if (col == 1) {
                for (var i = 0; ; i++) {
                    for (var x = 0; ; x++) {
                        if (product[[i, x]] == $(this).text()) {
                            product[[i, 5]] = 0;                            
                            break;
                        }
                        else if (product[[i, x + 1]] == null)
                            break;
                    }
                    if (product[[i, 5]] == 0) {
                        col = 0;                        
                        return false;
                    }
                    if (product[[i + 1, 0]] == null)
                        break;
                }
            }
            col++;
        });
    }
}
function numberFormat(number, decimals, dec_point, thousands_point) {

    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}
function hideLoadPage() {
    $(".loadBox").removeClass("active");
}
function loadPage() {
    $(".loadBox").addClass("active");
}