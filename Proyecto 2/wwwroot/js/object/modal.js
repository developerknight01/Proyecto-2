var flagClick = false;
var numItem = 0;
var lastProduct = 0;
$(document).ready(function () {
    actionClickModal();    
});
function actionClickModal() {    
    $(".closeModal").click(function () {        
        var modal = $(this).parent().parent().attr("class").split(" ")[0];             
        $("."+modal).addClass("close");
        $("."+modal).removeClass("active");        
        setTimeout(() => {             
            $("." + modal).removeClass("close");
            $("." + modal + " .contentBox").removeClass("right");
            $("." + modal + " .contentBox").removeClass("left");
            $("." + modal + " .contentBox-1 input").val(null);
            $("." + modal + " .contentBox-2, ." + modal + " .contentBox-3").addClass("right");                        
            $("." + modal + " .contentBox-2 .boxBody table tbody tr, ." + modal + " .contentBox-3 .boxBody table tbody tr").remove();  
            $("body").removeClass("block");
        }, 1000);
    });
    $(".btnNext").click(function () {        
        var boxVisible = $(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[0];
        var modalVisible = $(this).parent().parent().parent().parent().parent().attr("class").split(" ")[0];
        var numBoxVisible = parseInt($(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[1]) + 1;   
        if (checkField($("." + modalVisible + " ." + boxVisible + "-" + (numBoxVisible - 1)), (numBoxVisible - 1))) {
            if (numBoxVisible == 2) {
                if (modalVisible == "dialog2") {
                    $("." + modalVisible + " ." + boxVisible + "-" + numBoxVisible + " table tbody tr input").addClass("highInputAlt");
                    setTimeout(() => {
                        $("." + modalVisible + " ." + boxVisible + "-" + numBoxVisible + " table tbody tr input").removeClass("highInputAlt");
                    }, 2500);
                }
            }
            $(this).parent().parent().addClass("left");
            $("." + modalVisible + " ." + boxVisible + "-" + numBoxVisible).removeClass("right");
            copyData(modalVisible, (numBoxVisible - 1));
            $("." + modalVisible + " h2 .step").text(numBoxVisible + "-3");  
            if ($(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr:last-child td:first-child").text() == "0000") {
                $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr:last-child").remove();
            }
        }        
    });
    $(".btnPrev").click(function () {
        $(this).parent().parent().addClass("right");
        var boxVisible = $(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[0];
        var modalVisible = $(this).parent().parent().parent().parent().parent().attr("class").split(" ")[0];
        var numBoxVisible = parseInt($(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[1]) - 1;
        $("." + modalVisible + " ." + boxVisible + "-" + numBoxVisible).removeClass("left");
        $("dialog h2 .step").text(numBoxVisible + "-3");
    });
    $(".btnClean").click(function () {
        $(".contentBox-2 input").val(null);
        $(".contentBox-2 select").prop("selectedIndex", 0);
    });
    $(".dialog .btnAdd").click(function () {
        var boxVisible = $(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[0];
        var numBoxVisible = parseInt($(this).parent().parent().attr("class").split(" ")[1].split(" ")[0].split("-")[1]) + 1;
        if (checkField($("." + boxVisible + "-" + (numBoxVisible - 1)), (numBoxVisible - 1))) {
            checkNameOfProduct($("." + boxVisible + "-" + (numBoxVisible - 1) + " #productN").val(), (numBoxVisible - 1));
        }
    });
    $(".dialog .btnFinish").click(function () {
        if ($(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr").length > 0) {
            insertInvoice();
        }
        else {
            buildMessage("No hay productos que registrar",2);
        }
    });
    $(".dialog2 .btnFinish").click(function () {
        insertOrderDeliver();
    });
}
function insertOrderDeliver() {
    let orderDeliver = {
        id: null,
        cod: null,
        unit: null,
        price: null,
        countOut: null,
        dateOrder: null
    };
    var row = $(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody tr").length;
    var insert = 0;
    $(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody").find("tr").each(function () {
        orderDeliver.id = $(".dialog2 .contentBox-3 .boxBody:nth-child(1) table tbody td:nth-child(1)").text();
        orderDeliver.cod = $(this).children("td:nth-child(1)").text();
        orderDeliver.unit = $(this).children("td:nth-child(3)").text();
        orderDeliver.price = $(this).children("td:nth-child(5)").text().split("₡")[1];
        orderDeliver.countOut = $(this).children("td:nth-child(4)").text();
        orderDeliver.dateOrder = $(".dialog2 .contentBox-3 .boxBody:nth-child(1) table tbody td:nth-child(2)").text();
        $.ajax({
            url: "Object/InsertOrderDeliver",
            cache: "false",
            method: "post",
            data: {
                id: parseInt(orderDeliver.id),
                codP: parseInt(orderDeliver.cod),
                unit: orderDeliver.unit,
                price: parseInt(orderDeliver.price),
                countOut: parseInt(orderDeliver.countOut),
                date: orderDeliver.dateOrder
            },
            beforeSend: function () {
                loadPage();
                $(".dialog2").addClass("alt");
            },
            success: function (result) {
                if (result != "error") {
                    insert++;
                    if (insert >= row) {
                        $(".closeModal").click();
                        $(".dialog2").removeClass("alt");
                        loadProduct();
                    }
                }
            }
        });
    });
}
function insertInvoice() {
    let invoice = {
        id:"",
        dateOrder:"",
        dateDeliver:"",
        enterprise:"",
        nameDeliver: "",
        nameReceiver:""
    };
    $(".dialog .contentBox-3 .boxBody:nth-child(1) table tbody").find("tr").each(function () {
        invoice.dateOrder = $(this).children("td:nth-child(1)").text();
        invoice.dateDeliver = $(this).children("td:nth-child(2)").text();
        invoice.id = $(this).children("td:nth-child(3)").text();
        invoice.nameDeliver = $(this).children("td:nth-child(4)").text();
        invoice.enterprise = $(this).children("td:nth-child(5)").text();
        invoice.nameReceiver = $(this).children("td:nth-child(6)").text();
    });    
    $.ajax({
        url: "Object/InsertInvoice",
        method: "post",
        data: {
            id: invoice.id,
            dateOrder: invoice.dateOrder,
            dateDeliver: invoice.dateDeliver,
            enterprise: invoice.enterprise,
            nameDeliver: invoice.nameDeliver,
            nameReceiver: invoice.nameReceiver
        },
        beforeSend: function () {
            loadPage();
            $(".dialog.active").addClass("alt");
        },
        success: function (response) {
            if (response != 1) {
                hideLoadPage();
                buildMessage("El número de factura ya fue registrada\nCambie el número como sugerencia", 2);
                $(".btnPrev").click();
                setTimeout(() => {
                    $(".btnPrev").click();
                    $(".dialog .contentBox-3 .boxBody:nth-child(1) table tbody tr").remove()
                }, 250);
            }
            else {
                insertProduct();
            }
        }
    });
    
}
function insertProduct() {
    let product = {
        id: "",
        name: "",
        unit: "",
        price: "",
        minStock: "",
        maxStock: "",
        stock: "",
        mod:null
    };
    var count = $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr").length;
    var insert = 0;    
    $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody").find("tr").each(function () {
        product.id = $(this).children("td:nth-child(1)").text();
        product.name = $(this).children("td:nth-child(2)").text();
        product.unit = $(this).children("td:nth-child(3)").text();
        product.price = $(this).children("td:nth-child(4)").text();
        product.minStock = $(this).children("td:nth-child(6)").text();
        product.maxStock = $(this).children("td:nth-child(7)").text();
        product.stock = $(this).children("td:nth-child(5)").text();
        product.mod = 1;
        if ($(this).children("td:nth-child(6)").text() == "no requerido") {
            product.mod = 0;
            product.minStock = 0;
            product.maxStock = 0;
        }
        $.ajax({
            url: "Object/InsertProduct",
            cache: "false",
            method: "post",
            data: {
                id: product.id,
                name: product.name,
                unit: product.unit,
                price: product.price,
                minStock: product.minStock,
                maxStock: product.maxStock,
                stock: product.stock,
                mod: product.mod
            },
            success: function (response) {                
                if (response == 1) {
                    insert++;
                    if (count <= insert) {
                        insertDetailOrder();
                    }
                }
            }
        });
    });
}
function insertDetailOrder() {
    let detail = {
        invoice: $(".dialog .contentBox-3 .boxBody:nth-child(1) table tbody tr td:nth-child(3)").text(),
        codP: null,
        countIn:null
    }
    var count = $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr").length;
    var insert = 0;    
    $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody").find("tr").each(function () {
        detail.codP = $(this).children("td:nth-child(1)").text();
        detail.countIn = $(this).children("td:nth-child(5)").text()        
        $.ajax({
            url: "Object/InsertDetailOrder",
            cache: "false",
            method: "post",
            data: {
                invoice: detail.invoice,
                codP: detail.codP,
                countIn: detail.countIn
            },
            success: function () {
                insert++;
                if (count <= insert) {
                    buildMessage("Factura registrada correctamente", 1);
                    loadProduct();
                    $(".dialog.active").removeClass("alt");
                    $(".closeModal").click();
                }
            }
        });
    });
}
function checkNameOfProduct(product, row) {
    var cod = ['000', '00', '0'];    
    $.ajax({
        url: "Object/CheckNameProduct",
        method: "post",
        data: {
            name: product
        },
        success: function (result) {
            var codP = null;            
            //No existe el Producto, se genera el nuevo ID                                             
            if (lastProduct == 0) {
                lastProduct = result.split("+")[2];
                lastProduct++;              
            }            
            if (result.split("+")[1] == "not") {
                codP = cod[result.split("+")[0].length - 1] + "" + lastProduct;                                                    
                if ($(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field").hasClass("disabled")) {
                    $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field.disabled").addClass("highInput");
                    $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field.disabled").removeClass("disabled");
                    setTimeout(() => {
                        $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field.disabled").removeClass("highInput");
                    }, 2500);
                }
                else {
                    if ($(".dialog .contentBox-2 .boxBody input.countMin").val() > 0 && $(".dialog .contentBox-2 .boxBody input.countMax").val() > 0) {
                        copyData("dialog", row);
                        lastProduct++;
                        $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr:last-child td:first-child").text(codP);
                        $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field:nth-child(2)").addClass("disabled");
                        $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow .field:nth-child(3)").addClass("disabled");                        
                    }
                }
            }
            else if (result.split("+")[1] == "exist"){
                codP = cod[result.split("+")[0].length-1] + "" + parseInt(result.split("+")[0]);                
                copyData("dialog", row);
                $(".dialog .contentBox-3 .boxBody:nth-child(2) table tbody tr:last-child td:first-child").text(codP);                
            }
        }
    });
}
function copyData(modal,row) {    
    var values = [];
    var count = 0;    
    $("."+modal+" .contentBox-3 .boxBody:nth-child("+row+") table tbody").append(
        "<tr>"
    ); 
    $("." + modal + " .contentBox-" + row).find("input").each(function () {
        if (row == 1) {
            $("." + modal + " .contentBox-3 .boxBody:nth-child(" + row + ") table tbody tr:last-child").append(
                "<td>" + $(this).val() + "</td>"
            );
        }
        else {
            if ($(this).val() === "")
                values[count] = "no requerido";
            else
                values[count] = $(this).val();

            count++;
        }

    });
    if (row == 2 && modal == "dialog") {
        numItem++;
        $("." + modal + " .contentBox-" + row).find("select").each(function () {
            values[count] = $(this).val();
            count++;
        });
        values[6] = values[1]; values[1] = values[5]; values[7] = values[2];
        values[2] = values[6]; values[6] = values[3]; values[3] = values[7];
        values[7] = values[4]; values[4] = values[6]; values[5] = values[7];

        $("." + modal + " .contentBox-3 .boxBody:nth-child(" + row + ") table tbody tr:last-child").append(
            "<td>0000</td>"
        );
        for (var i = 0; i < count; i++) {
            $("." + modal + " .contentBox-3 .boxBody:nth-child(" + row + ") table tbody tr:last-child").append(
                "<td>" + values[i] + "</td>"
            );
        }
        $("." + modal + " .contentBox-3 .boxBody:nth-child(" + row + ") table tbody tr:last-child").append(
            "<td>" +
            "<span class='iconButton deleteItem'><i class='fa-solid fa-circle-minus'></i></span>" +
            "</td>"
        );
        buildMessage("Item agregado con exito", 2);
        $(".btnClean").click();
        $(".deleteItem").click(function () {
            if (numItem > 0)
                numItem--;
            $(this).parent().parent().remove();
        });
    }
    else if (modal == "dialog2") {
        var countTemp = 0;
        $("." + modal + " .contentBox-" + row + " table tbody").find("tr").each(function () {
            $(this).find("td").each(function () {
                if (product[[countTemp, 0]] == $(this).text() && product[[countTemp, 5]] == 1) {
                    product[[countTemp, 6]] = $(this).parent().find("input").val();
                }
            });
            countTemp++;
        });        
        $(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody tr").remove();
        for (var i = 0; ; i++) {            
            if (product[[i, 5]] == 1) {                
                $(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody").append(
                    "<tr>"+
                    "<td>" + product[[i, 0]] + "</td>" +
                    "<td>" + product[[i, 1]] + "</td>" +
                    "<td>" + product[[i, 2]] + "</td>" +
                    "<td>" + product[[i, 6]] + "</td>" +
                    "<td>" + product[[i, 3]] + "</td>" +
                    "<td>" +
                        "<span class='iconButton deleteItem'><i class='fa-solid fa-circle-minus'></i></span>" +
                    "</td>"                    
                );
                $(".deleteItem:last-child").click(function () {
                    $(this).parent().parent().remove();
                    if ($(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody tr").length == 0)
                        $(".closeModal").click();
                });
            }
            if (product[[i + 1, 0]] == null) {
                break;
            }
            else {
                $(".dialog2 .contentBox-3 .boxBody:nth-child(2) table tbody tr:last-child").append("</tr>");
            }
        }
    }
    $("." + modal +" .contentBox-3 .boxBody:nth-child(" + row +") table tbody tr:last-child").append(
        "</tr>"
    );
}
function checkField(field,row) {
    var result = false;
    let objectError = [
        ["Fecha de Pedido", "Fecha de Entrega", "#Factura", "Quien entrega el pedido", "la Empresa Proveedora", "Quien Recibe el Pedido"],
        ["Producto", "Precio", "Unidad", "Cantidad", "Cant/Mín", "Cant/Máx"]
    ];    
    var rowError = (row-1);
    var count = 0;    
    $(field).find("input").each(function () {                    
        if ($(this).val() !== "") {
            console.log($(this).val() + " " + $(this).attr("class"));
            $(this).removeClass("error")
            $(this).parent().find("span").removeClass("alert");            
            if ($(this).hasClass("invoice") || $(this).hasClass("price") || $(this).hasClass("countP") || $(this).hasClass("countMin") || $(this).hasClass("countMax") || $(this).hasClass("ticket")
                || $(this).hasClass("countOrder")) {                   
                if ($(this).attr("type") == "number") {                    
                    if ($(this).val() > 0) {
                        if ($(this).hasClass("countMax")) {                            
                            if (parseInt($(".dialog .contentBox-2 .boxBody input.countMin").val()) >= parseInt($(this).val())) {
                                buildMessage("La cantidad máxima debe ser superior a la cantidad mínima", 2);
                                console.log("error");
                                $(this).parent().children("span").addClass("alert");
                                return false;
                            }
                        }                        
                        else if ($(this).hasClass("countOrder") && $(this).val() > parseInt($(this).attr("placeholder").split(" ")[1])) {
                            $(this).addClass("error");
                            buildMessage("La cantidad no puede superar lo disponible que son " + $(this).attr("placeholder").split(" ")[1], 3);
                            result = false;
                            $(this).parent().children("span").addClass("alert");
                            console.log("error2");
                            return false;
                        }
                    }
                    else if ($(this).hasClass("countOrder") && $(this).val() == 0) {
                        $(this).addClass("error");
                        console.log("error3");
                        buildMessage("La cantidad no puede ser igual a 0 y tampoco superar lo disponible que son " + $(this).attr("placeholder").split(" ")[1], 3);
                        result = false;
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if ($(this).hasClass("nameP") || $(this).hasClass("nameE") || $(this).hasClass("nameR") || $(this).hasClass("productN") || $(this).hasClass("nameT")){
                if ($(this).attr("type") == "text") {                    
                    if (row == 2) {
                        $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1).toLowerCase());
                        if ($(this).val().length > 30) {
                            buildMessage("El nombre del Producto no puede superar los 32 caracteres", 2);
                            $(this).val(null);
                            $(this).parent().find("span").addClass("alert");
                            result = false;
                            console.log("error4");
                            return false;
                        }
                    }
                    else {                        
                        transformText($(this))
                    }
                }
            }                        
        }
        else {            
            if ($(this).hasClass("countMin") || $(this).hasClass("countMax")) {
                if (!$(this).parent().hasClass("disabled")) {
                    $(this).parent().find("span").addClass("alert");
                    buildMessage("Verifique el campo de " + objectError[rowError][count], 2) + " que esté resaltado el asterisco";
                    result = false;
                    console.log("error5");
                    return false;
                }
            }
            else if ($(this).hasClass("countOrder") && $(this).val() == 0) {
                $(this).addClass("error");
                buildMessage("La cantidad no puede ser igual a 0 y tampoco superar lo disponible que son " + $(this).attr("placeholder").split(" ")[1], 3);
                result = false;
                console.log("error6");
                return false;
            }
            else if (numItem == 0) {                    
                $(this).parent().find("span").addClass("alert");
                buildMessage("Verifique el campo de " + objectError[rowError][count], 2) + " que esté resaltado el asterisco";
                console.log("error7");
                result = false;
                return false;
            }
            
        }
        count++;
    });
    $(field).find("select").each(function () {
        if ($(this).val() != "u" && $(this).val() != "m" && $(this).val() != "l" && $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow #productN").val() !== "" &&
            $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow #price").val() !== "" && $(".dialog .contentBox-2 .boxBody:nth-child(3) .contentRow #countP").val() !== "") {
            $(this).parent().find("span").addClass("alert");
            buildMessage("Seleccione la unidad del cómo se venderá el producto");
        }
    })    
    if (!$(".contentBox-" + row + " .boxBody .iconRequire").hasClass("alert") && $(field).parent().parent().parent().hasClass("dialog"))
        result = true;
    else {
        if ($(field).parent().parent().parent().attr("class").split(" ")[0] == "dialog2") {
            if ($(field).attr("class").split(" ")[1] == "contentBox-1") {
                if (!$(".contentBox-" + row + " .boxBody .iconRequire").hasClass("alert"))
                    result = true;
            }
            else if ($(field).attr("class").split(" ")[1] == "contentBox-2") {
                if (!$(".contentBox-" + row + " .boxBody input").hasClass("error"))
                    result = true;
            }
        }
    }    
    return result;
}
function transformText(object) {
    var words = $(object).val().trim().split(/\s+/);
    var wordsResult = [];
    for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if (word !== "") {
            var wordTransform = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            wordsResult.push(wordTransform);
        }
    }
    return $(object).val(wordsResult.join(" "));
}