
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
                $.ajax({
                    url: 'http://localhost:8020/login/login',
                    type: 'get',
                    data: {
                        'user': $('.J-user-node').val(),
                        'pass': $(".J-pass-node").val(),
                    },
                    success: function(data){
                        if(data.ok == 1){
                            console.log(data.msg);
                            $(".myModal1").modal('hide');
                            $("form-wrap .form-group").removeClass('has-error');
                            $(".file-container").removeClass('hide');
                            $("#userName").val($('.J-user-node').val());
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
                console.log(xhr.responseText);
            }
        });

    })();