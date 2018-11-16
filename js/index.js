
//this js for dean
(()=>{

    //显示登录/注册弹窗
    $(".J-login-show").on("click",function(){
        // $('.J-user-node').val('');
        // $(".J-pass-node").val('');
        $("form-wrap .form-group").removeClass('has-error');
    });

    //注册
    $(".J-res-btn").on({
        click(){
            $.ajax({
                url: 'http://localhost:8020/login/res',
                type: 'get',
                data: {
                    'user': $('.J-user-node').val(),
                    'pass': $(".J-pass-node").val(),
                },
                success: function(data){
                    if(data.ok == 1){
                        console.log(data.msg);
                        $("form-wrap .form-group").removeClass('has-error');
                    }else{
                        console.log(data.msg);
                        $("form-wrap .form-group").addClass('has-error');
                    }
                },
            });
        }
    });

    //登录
    $(".J-login-btn").on({
        click(){
    		var user = $('.J-user-node').val();
    		var pass = $(".J-pass-node").val();
            $.ajax({
                url: 'http://localhost:8020/login/login',
                type: 'get',
                data: {
                    'user': user,
                    'pass': pass,
                },
                success: function(data){
                    if(data.ok == 1){
                        console.log(data.msg);
                        $(".myModal1").modal('hide');
                        $("form-wrap .form-group").removeClass('has-error');
                        $(".file-container").removeClass('hide');
                        $("#userName").val(user);
                        createFileList(data.data);
                    }else{
                        console.log(data.msg);
                        $("form-wrap .form-group").addClass('has-error');
                    }
                },
            });
        }
    });

    //文件上传
    $(".J-upload-btn").on("click",function(){
        var oForm = new FormData();
        oForm.append('files', fileNode.files[0]);
        var userName = $('.J-user-node').val();
        oForm.append('userName', userName);
        if( window.XMLHttpRequest ){
            var xhr = new XMLHttpRequest();
        }else{
            var xhr = new ActiveXObject('Microsoft.XMPHTTP');
        }
        xhr.open('post','http://localhost:8020/file/upload', true);
        xhr.send(oForm);
        xhr.onload = ()=>{
            var data = JSON.parse(xhr.responseText);
            createFileList([data]);
        }
    });

    //文件列表添加记录
    function createFileList(data){
    	var str = '';
    	var num = $("#fileWrap tr").length;
    	data.forEach(function(ev,index){
    		str += '<tr><td>'+ (num + index + 1) +'</td><td>'+ ev.LastName +'</td><td>'+ ev.size +'</td><td>'+ ev.lastTime +'</td><td>0</td><td><button data-hash="'+ ev.hashName +'" class="btn btn-default btn-danger btn-xs J-delete-btn">删除</button></td></tr>';
    	});
    	$("#fileWrap").append(str);
    }

    //删除文件
    $("#fileWrap").on("click",'.J-delete-btn', function(){
    	var hashName = $(this).attr('data-hash');
    	console.log(hashName);
        $.ajax({
            url: 'http://localhost:8020/file/delete',
            type: 'get',
            data: {
            	'userName': $('.J-user-node').val(),
                'hashName': hashName,
            },
            success: function(data){
                if(data.ok == 1){
                    console.log(data.msg);
                }else{
                    console.log(data.msg);
                }
            },
        });
    });

})();