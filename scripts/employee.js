var employee = {};
const apiUrl = "https://617f4f47055276001774fa1f.mockapi.io/emplyee"

employee.showEmployee = function () {
    $.ajax({
        url: apiUrl,
        dataType: "JSON",
        method: "GET",
        success: function (data) {
            data = data.sort(function (emp1, emp2) {
                return emp2.id - emp1.id;
            });
            $('#tbEmployee>tbody').empty();
            $.each(data, function (index, emp) {
                $('#tbEmployee>tbody').append(`
                    <tr>
                        <td>${emp.id}</td>
                        <td>${emp.fullname}</td>
                        <td class='text-center'><img class='img-sm' src='${emp.avatar}'></td>
                        <td>${moment(emp.dob).format("YYYY-MM-DD")}</td>
                        <td>${emp.email}</td>
                        <td>${emp.salary}</td>
                        <td>${emp.department}</td>
                        <td><span class="badge ${emp.status ? 'bg-success' : 'bg-warning'}">${emp.status ? 'active' : 'inactive'}</span></td>
                        <td>
                            <a href='javascript:;' class='btn btn-primary btn-sm' title='edit employee' onclick='employee.get(${emp.id})'>
                                <i class='fa fa-edit'></i>
                            </a>
                            <a href='javascript:;' class='btn ${emp.status ? 'btn-warning' : 'btn-secondary'} btn-sm'
                            title='${emp.status ? 'inactive' : 'active'} employee' onclick='employee.changeStatus(${emp.id}, ${emp.status})'>
                                <i class='fa ${emp.status ? 'fa-lock' : 'fa-lock-open'}'></i>
                            </a>
                            <a href='javascript:;' class='btn btn-danger btn-sm' title='remove employee' onclick='employee.remove(${emp.id})'>
                                <i class='fa fa-trash'></i>
                            </a>
                        </td>
                    </tr>
                `);
            })
        }
    });
}

employee.openModal = function () {
    $('#addEditModal').modal('show');
    employee.resetForm();
}

employee.save = function () {
    if ($('#addEditForm').valid()) {
        let id = Number($('#employeeId').val());
        if(id == 0){
            employee.createEmployee();
        }
        else{
            employee.modifyEmployee(id);
        }
    }
}

employee.createEmployee = function(){
    let createObj = {
        "fullname": $('#fullname').val(),
        "dob": $('#dob').val(),
        "email": $('#email').val(),
        "department": $('#department').val(),
        "status": $('#status').is(":checked"),
        "avatar": "https://cdn.fakercloud.com/avatars/alan_zhang__128.jpg",//$('#avatar').val(),
        "salary": Number($('#salary').val())
    };
    $.ajax({
        url: apiUrl,
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(createObj),
        success: function (result) {
            if (result) {
                employee.showEmployee();
                $('#addEditModal').modal('hide');
                $.notify("Employee has been created successfully!", "success");
            }
        }
    })
}

employee.modifyEmployee = function(id){
    let modifyObj = {
        "id": id,
        "fullname": $('#fullname').val(),
        "dob": $('#dob').val(),
        "email": $('#email').val(),
        "department": $('#department').val(),
        "status": $('#status').is(":checked"),
        "avatar": $('#avatar').val(),
        "salary": Number($('#salary').val())
    };
    $.ajax({
        url: `${apiUrl}/${id}`,
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modifyObj),
        success: function (result) {
            if (result) {
                employee.showEmployee();
                $('#addEditModal').modal('hide');
                $.notify("Employee has been modified successfully!", "success");
            }
        }
    })
}

employee.resetForm = function () {
    $('#addEditForm').validate().resetForm();
    $('#fullname').val('');
    $('#dob').val('');
    $('#email').val('');
    $('#department').val('');
    $('#salary').val('');
    $('#avatar').val('');
    $('#status').prop('checked', false);
    $('#addEditModal').find('.modal-title').text('Create new employee');
}

employee.remove = function (id) {
    bootbox.confirm({
        title: "Remove employee?",
        message: "Do you want to remove the employee now? This cannot be undone.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm'
            }
        },
        callback: function (confirmed) {
            if (confirmed) {
                $.ajax({
                    url: `${apiUrl}/${id}`,
                    method: "DELETE",
                    success: function (result) {
                        if (result) {
                            employee.showEmployee();
                            $.notify("Employee has been removed successfully", "success");
                        }
                        else {
                            $.notify("Something went wrong, please contact administrator", "error");
                        }
                    }
                })
            }
        }
    });
}


employee.changeStatus = function (id, status) {
    bootbox.confirm({
        title: `${status ? 'Inactive' : 'Active'}  employee?`,
        message: `Do you want to ${status ? 'inactive' : 'active'} the employee now?`,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> No'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Yes'
            }
        },
        callback: function (confirmed) {
            if (confirmed) {
                let changeStautsObj = {
                    id: id,
                    status: !status
                };
                $.ajax({
                    url: `${apiUrl}/${id}`,
                    method: "PUT",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(changeStautsObj),
                    success: function (result) {
                        if (result) {
                            employee.showEmployee();
                            $.notify(`Employee has been ${status ? 'inactived' : 'actived'} successfully`, "success");
                        }
                        else {
                            $.notify("Something went wrong, please contact administrator", "error");
                        }
                    }
                })
            }
        }
    });
}

employee.get = function (id) {
    $.ajax({
        url: `${apiUrl}/${id}`,
        dataType: "JSON",
        method: "GET",
        success: function (emp) {
            $('#addEditModal').modal('show');
            $('#addEditModal').find('.modal-title').text('Edit employee');
            $('#fullname').val(emp.fullname);
            $('#dob').val(emp.dob);
            $('#email').val(emp.email);
            $('#department').val(emp.department);
            $('#salary').val(emp.salary);
            $('#avatar').val(emp.avatar);
            $('#img-avatar').prop('src', emp.avatar);
            $('#status').prop('checked', emp.status);
            $('#employeeId').val(emp.id);
        }
    });
}

employee.init = function () {
    employee.showEmployee();
}
$(document).ready(function () {
    employee.init();
});