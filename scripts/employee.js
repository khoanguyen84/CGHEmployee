var employee = {};
const apiUrl = "https://617f4f47055276001774fa1f.mockapi.io/emplyee"

employee.showEmployee  = function(){
    $.ajax({
        url: apiUrl,
        dataType : "JSON",
        method: "GET",
        success : function(data){
            
            $.each(data, function(index, emp){
                $('#tbEmployee>tbody').append(`
                    <tr>
                        <td>${emp.id}</td>
                        <td>${emp.fullname}</td>
                        <td class='text-center'><img class='img-sm' src='${emp.avatar}'></td>
                        <td>${emp.dob}</td>
                        <td>${emp.email}</td>
                        <td>${emp.salary}</td>
                        <td>${emp.department}</td>
                        <td>${emp.status}</td>
                        <td></td>
                    </tr>
                `);
            })
        }
    });
}

employee.init = function(){
    employee.showEmployee();
}
$(document).ready(function(){
    employee.init();
});