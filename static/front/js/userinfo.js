var userTemplate = '<el-card id="userinfo"><div slot="header" class="clearfix"><h3>用户信息</h3></div><el-row class="user_info"><el-col :sm="{span:\'2\', offset:\'1\'}" :xs="24"><img class="userImages" :src="userImage" alt="用户头像"></el-col><el-col :sm="18" :xs="24"><el-col :sm="{span:\'12\', offset:\'1\'}" :xs="12"><p class="userdetail">用户ID：[[userID]]</p><!--<p class="userdetail">用户名：[[userName]]</p>--></el-col><el-col :sm="{span:\'10\', offset:\'1\'}" :xs="12"><p class="userdetail">用户邮箱：[[userEmail]]</p></el-col><el-col :span="23" :offset="1"><el-form :model="user" label-width="70px" :inline="true"><el-form-item label="用户名："><span style="padding-right: 12px;" v-if="userShow">[[user.userName]]</span><el-input v-if="!userShow" v-model="user.userName" @blur="nameValidete" class="input userdetail userinfo_width"></el-input><el-button v-if="userShow" type="warning" @click="nameEdit" plain round><i class="fas fa-pencil-alt" ></i></el-button><el-button v-if="!userShow" type="warning" :loading="user.name_loading" @click="nameUpdate" round><i class="fas fa-check" ></i></el-button><el-button v-if="!userShow" type="warning" @click="nameClose" plain round><i class="fas fa-times" ></i></el-button></el-form-item></el-form></el-col></el-col></el-row><el-row><el-col class="userinfo_body" :span="24"><el-form :model="APIForm" label-width="150px" :inline="true"><el-form-item label="API-AccessKey："><el-input v-model="APIForm.AccessKey" class="input cursor_text userinfo_width" :disabled="true"></el-input></el-form-item><el-form-item label="API-SecretKey："><el-input v-model="APIForm.SecretKey" class="input cursor_text userinfo_width" :disabled="true"></el-input></el-form-item><el-form-item><el-button type="warning" :loading="obtainAPI_loading" @click="obtainAPI_AKSK">自动生成</el-button></el-form-item></el-form></el-col><el-col class="userinfo_body" :span="24" v-if="false"><el-form :model="OOSForm" :rules="OOSValidate" ref="OOSForm" label-width="150px" :inline="true"><el-form-item label="存储接入点：" prop="apn"><el-input v-model="OOSForm.apn" class="input userinfo_width"></el-input></el-form-item><el-form-item label="存储 AccessKey：" prop="AccessKey"><el-input v-model="OOSForm.AccessKey" class="input userinfo_width"></el-input></el-form-item><el-form-item label="存储 SecretKey：" prop="SecretKey"><el-input v-model="OOSForm.SecretKey" class="input userinfo_width"></el-input></el-form-item></el-form><el-button type="warning" :loading="OOS_loading" @click="update">保存</el-button></el-col></el-row></el-card>';

var userinfoVue = new Vue({
        el: '#userinfo',
        delimiters: ["[[", "]]"],
        template: userTemplate,
        data: function() {

            return {
                publicAPI: '/mc/api/live/v1/',
                userImage: '/static/front/images/user-head.png',
                userID:'',
                userEmail:'',
                userShow: true,
                userName: '',
                user: {
                    userName:'',
                    name_loading: false,
                },
                APIForm: {
                    AccessKey:'',
                    SecretKey:'',
                },
                obtainAPI_loading:false,
                OOSForm:{
                    apn:'',
                    AccessKey:'',
                    SecretKey:'',
                },
                OOS_loading:false,
                OOSValidate: {
                    apn: [
                        { required: true, message: '请输入存储接入点', trigger: 'blur' }
                    ],
                    AccessKey:[
                        { required: true, message: '请输入存储 AccessKey', trigger: 'blur' }
                    ],
                    SecretKey:[
                        { required: true, message: '请输入存储 SecretKey', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            nameValidete: function(){
                var vm = this;
                if(vm.user.userName == ''){
                    vm.$message.error('请输入用户名！');
                    return false;
                } else if(vm.user.userName.length < 33 && vm.user.userName.length > 1){
                     return true;
                } else {
                    vm.$message.error('用户名限制在32个字符内。');
                    return false;
                }
            },
            update: function() {
                var vm = this,
                data = {
                    'oss_host': vm.OOSForm.apn,
                    'oss_access_key': vm.OOSForm.AccessKey,
                    'oss_secret_key': vm.OOSForm.SecretKey
                };
                vm.OOS_loading = true;
                vm.$refs['OOSForm'].validate(function (valid) {
                    if (valid) {
                        ajax.post(vm.publicAPI + 'userinfo/',data)
                            .then(function (resdata) {
                                vm.OOS_loading = false;
                                if(resdata.data.code === 0){
                                    vm.$message.success('恭喜您，保存成功。');
                                } else if(resdata.data.code === 1){
                                    vm.$message.error(resdata.data.msg);
                                }else {
                                    vm.$message.error(resdata.data.msg);
                                }
                            }).catch(function (error) {
                                console.log(error.message);
                                vm.$message.error(error.message);
                                vm.OOS_loading = false;
                        });
                    }
                });
            },
            nameUpdate: function() {
                var vm = this,
                data = {
                    'username': vm.user.userName
                };
                vm.user.name_loading = true;
                    if (vm.nameValidete()) {
                        ajax.post(vm.publicAPI + 'userinfo/',data)
                            .then(function (resdata) {
                                vm.user.name_loading = false;
                                if(resdata.data.code === 0){
                                    vm.userShow = true;
                                    vm.$message.success('恭喜您，保存成功。');
                                } else if(resdata.data.code === 1){
                                    vm.$message.error(resdata.data.msg);
                                }else {
                                    vm.$message.error(resdata.data.msg);
                                }
                            }).catch(function (error) {
                                console.log(error.message);
                                vm.$message.error(error.message);
                                vm.user.name_loading = false;
                        });
                    } else{
                        vm.user.name_loading = false;
                    }
            },
            nameEdit: function() {
                var vm = this;
                vm.userName = vm.user.userName;
                vm.userShow = false;
            },
            nameClose: function() {
                var vm = this;
                vm.user.userName = vm.userName;
                vm.userShow = true;
            },
            obtainAPI_AKSK: function() {
                var vm = this;
                vm.obtainAPI_loading = true;
                ajax.post(vm.publicAPI + 'api_key/')
                        .then(function (resdata) {
                            vm.obtainAPI_loading = false;
                            if(resdata.data.code === 0){
                                vm.APIForm.AccessKey = resdata.data.data.API_AccessKey;
                                vm.APIForm.SecretKey = resdata.data.data.API_SecretKey;
                            } else if(resdata.data.code === 1){
                                vm.$message.error(resdata.data.msg);
                            } else {
                                vm.$message.error(resdata.data.msg);
                            }
                        }).catch(function (error) {
                            console.log(error.message);
                            vm.$message.error(error.message);
                            vm.obtainAPI_loading = false;
                    });
            }
        },
        mounted: function()  {
            var vm = this;
            ajax.get(vm.publicAPI + 'userinfo/')
                .then(function(resdata) {
                    if(resdata.data.code === 0){
                        // vm.userImage =resdata.data.userImage;
                        vm.userEmail = resdata.data.data.email;

                        vm.userID = resdata.data.data.ct_user_id;
                        vm.user.userName = resdata.data.data.username;
                        vm.APIForm.AccessKey = resdata.data.data.API_AccessKey;
                        vm.APIForm.SecretKey = resdata.data.data.API_SecretKey;

                        vm.OOSForm.apn = resdata.data.data.oss_host;
                        vm.OOSForm.AccessKey = resdata.data.data.oss_access_key;
                        vm.OOSForm.SecretKey = resdata.data.data.oss_secret_key;
                    } else if(resdata.data.code === 1){
                        vm.$message.error(resdata.data.msg);
                    } else {
                        vm.$message.error(resdata.data.msg);
                    }
                }).catch(function(error) {
                    console.log(error.message);
                    vm.$message.error(error.message);
            });
        }
    });