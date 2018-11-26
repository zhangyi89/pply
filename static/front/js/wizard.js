
var template = '<el-row><el-col :span="24"><el-card><div slot="header" class="clearfix"><h3>欢迎使用直播发布功能</h3></div><el-row class="wizard_body"><el-col :span="24"><el-steps :active="stepActive" finish-status="success"><el-step title="步骤 1"></el-step><el-step title="步骤 2"></el-step><el-step title="步骤 3"></el-step><el-step title="步骤 4"></el-step></el-steps></el-col></el-row><el-row class="wizard_from"><el-col :span="24" v-show="stepActive==0"><el-form :model="step1From" :rules="step1" ref="step1Form" label-width="100px"><el-form-item label="选择频道" prop="channel"><el-select v-model="step1From.channel" class="wizard_width" placeholder="请选择频道"><el-option v-for="itm in channel_list" :label="itm.name" :value="itm.name"></el-option></el-select></el-form-item><el-form-item label="房间号" prop="roomNo"><el-tooltip class="item" effect="dark" content="房间号只能是数字、字母" placement="top"><el-input v-model="step1From.roomNo" class="input" style="width: 264px;margin-right: 15px;" @keyup.native="roomKeys" placeholder="房间号只能是数字、字母"></el-input></el-tooltip><el-button type="warning" :loading="room_Loading" @click="room">是否可用</el-button></el-form-item></el-form></el-col><el-col :span="24" v-show="stepActive==1"><el-form :model="step2Form" :rules="step2" ref="step2Form" label-width="100px"><el-form-item label="TOKEN" prop="Token"><el-input v-model="step2Form.Token" class="input" style="width:260px; padding-right: 6px;" :disabled="true"></el-input><el-button type="warning" :loading="token_loading" @click="updateToken">生成Token</el-button></el-form-item><el-form-item label="过期时长" prop="expTime"><el-select v-model="step2Form.expTime" class="wizard_width" placeholder="请选择时长"><el-option v-for="itm in expTime_list" :label="itm[1]" :value="itm[0]"></el-option></el-select></el-form-item></el-form></el-col><el-col :span="24" v-show="stepActive==2"><p>请选择推流节点</p><el-form :model="step3Form" :rules="step3" ref="step3Form" label-width="100px"><el-form-item label="" prop="resource"><el-radio-group v-model="step3Form.resource"><el-radio v-for="itm in RTMPSrc_list" class="wizard_resource" :label="itm.id">[[ itm.location ]]</el-radio></el-radio-group></el-form-item></el-form></el-col><el-col :span="24" v-show="stepActive==3"><el-form :model="step4Form" :rules="step4" ref="step4Form" label-width="100px"><el-form-item label="转码模板" prop="template"><el-select v-model="step4Form.template" multiple class="wizard_width" placeholder="请选择转码模板"><el-option v-for="itm in template_list" :label="itm.streaming_protocol + \' \' + itm.name + \' \' + itm.video_codec_rate + \' \' + itm.video_codec_type + \' \' + itm.audio_codec_type" :value="itm.id"></el-option></el-select></el-form-item><el-form-item label="文件有效期" prop="validTime"><el-select v-model="step4Form.validTime" class="wizard_width" placeholder="转码后文件有效期"><el-option v-for="itm in validTime_list" :label="itm[1]" :value="itm[0]"></el-option></el-select></el-form-item></el-form></el-col><el-col :span="24" ><el-button type="warning" class="wizard_btn" v-if="stepActive==3" @click="finished" :loading="update_loading">提交</el-button><el-button type="warning" class="wizard_btn" v-if="stepActive<3" @click="next">下一步 <i class="fas fa-arrow-right" ></i></el-button><el-button type="warning" plain class="wizard_btn" v-if="stepActive>0" @click="prev"><i class="fas fa-arrow-left" ></i> 上一步</el-button></el-col></el-row></el-card></el-col></el-row>';




var wizardVue = new Vue({
        el: '#wizard',
        delimiters: ["[[", "]]"],
        template: template,
        data: function() {

            var roomNoValidate = function (rule, value, callback) {
                  var vm = wizardVue;
                    var expReg = /^[a-zA-Z0-9]*$/,
                    data = {'room':value};
                if (value == '') {
                    callback(new Error('请输入房间号'));
                    vm.room_success = false;
                } else if(!expReg.test(value)){
                    callback(new Error('房间号有非法字符'));
                    vm.room_success = false;
                } else if(value.length > 16){
                    callback(new Error('房间号限制在16个字符内。'));
                    vm.room_success = false;
                } else {
                    if(vm.room_success){
                        vm.room_Loading = true;
                    };
                    ajax.post(vm.publishAPI + 'publish/room_confirm/',data)
                        .then(function (resdata) {
                            vm.room_Loading = false;
                            if(resdata.data.code === 0){
                                callback();
                                if(vm.room_success){
                                    vm.$message.success('恭喜，房间号可以使用。');
                                }
                            } else if(resdata.data.code === 1){
                                callback(new Error(resdata.data.msg));
                            }else {
                                callback(new Error(resdata.data.msg));
                            }
                            vm.room_success = false;
                        }).catch(function (error) {
                            console.log(error.message);
                            callback(new Error(error.message));
                            vm.room_Loading = false;
                            vm.room_success = false;
                        });
                }
            };
            var templateValidate = function (rule, value, callback) {
                var vm = wizardVue;
                if (value == '') {
                    callback(new Error('请至少选择一个转码模板'));
                } else if (value.length > 4) {
                    callback(new Error('最懂能选 4 个转码模板'));
                } else{
                    callback();
                }
            };
            return {
                publishAPI: '/mc/api/live/v1/',
                room_success: false,
                visible: false,
                stepActive: 0,
                channel_list:[],
                expTime_list:[],
                template_list:[],
                RTMPSrc_list:[],
                validTime_list:[],
                step1From: {
                    channel: '',
                    roomNo: '',
                },
                room_Loading: false,
                step2Form: {
                    Token: '',
                    expTime: '',
                },
                token_loading: false,
                step3Form: {
                    resource: '',
                },
                step4Form: {
                    template: [],
                    validTime: '',
                },
                update_loading: false,
                step5Form: {
                    pushAddress: '',
                    playAddress1: '',
                    playAddress2: '',
                },
                step1: {
                    channel: [
                        { required: true, message: '请选择频道', trigger: 'change' }
                    ],
                    roomNo:[
                        { required: true, validator: roomNoValidate, trigger: 'blur'}
                    ],
                },
                step2: {
                    expTime: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    Token: [
                        { required: true, message: '请生成token', trigger: 'blur' }
                    ],
                },
                step3: {
                    resource: [
                        { required: true, message: '请选择推流节点', trigger: 'change' }
                    ],
                },
                step4: {
                    template: [
                        { type: 'array', required: true, validator:templateValidate , trigger: 'change' }
                    ],
                    validTime: [
                        { required: true, message: '请选择文件有效期', trigger: 'change' }
                    ],
                },
            };
        },
        methods: {
            roomKeys: function() {
                var vm = this,
                    expReg = /^[a-zA-Z0-9]*$/;
                if(!expReg.test(vm.step1From.roomNo)){
                    vm.step1From.roomNo = vm.step1From.roomNo.slice(0,vm.step1From.roomNo.length-1);
                }
            },
            finished: function() {
            var vm = this;
                vm.$refs['step4Form'].validate(function (valid) {
                    if (valid) {
                        vm.update();
                    }
                });
            },
            prev: function() {
                  if (this.stepActive > 0) this.stepActive --;
             },
            next: function() {
                 var vm = this, stepForm;
                 if(vm.stepActive < 3){
                    vm.room_success = false;
                    stepForm = vm.stepActive+1;
                    vm.$refs['step'+ stepForm +'Form'].validate(function (valid) {
                        if (valid) {
                            vm.stepActive ++;
                            return false;
                        }
                    });
                 }
            },
            update: function() {
                var vm = this,
                data = {
                    'id': vm.step3Form.resource,
                    'channel': vm.step1From.channel,
                    'room': vm.step1From.roomNo,
                    'token': vm.step2Form.Token,
                    'template_id': vm.step4Form.template,
                    'token_valid_period': vm.step2Form.expTime,
                    'storage_valid_period': vm.step4Form.validTime
                };
                vm.update_loading = true;
                ajax.post(vm.publishAPI + 'publish/confirm_info/',data)
                        .then(function (resdata) {
                            vm.update_loading = false;
                            if(resdata.data.code === 0){

                                window.location.href = "/mc/live/taskDetail/" + resdata.data.id + "/";
                            } else if(resdata.data.code === 1){
                                vm.$message.error(resdata.data.msg);
                            }else {
                                vm.$message.error(resdata.data.msg);
                            }
                        }).catch(function (error) {
                            console.log(error.message);
                            vm.$message.error(error.message);
                            vm.update_loading = false;
                    });
            },
            updateToken: function() {
                var vm = this;
                vm.token_loading = true;
                ajax.post(vm.publishAPI + 'publish/mgt_token/')
                        .then(function (resdata) {
                            vm.token_loading = false;
                            if(resdata.data.code === 0){
                                vm.step2Form.Token = resdata.data.token;
                            } else if(resdata.data.code === 1){
                                vm.$message.error(resdata.data.msg);
                            } else {
                                vm.$message.error(resdata.data.msg);
                            }
                        }).catch(function (error) {
                            console.log(error.message);
                            vm.$message.error(error.message);
                            vm.token_loading = false;
                    });
            },
            room: function() {
                var vm = this;
                vm.room_success = true;
                vm.$refs['step1Form'].validateField('roomNo');
            }
        },
        mounted: function()  {
            var vm = this;

            ajax.get(vm.publishAPI + 'publish/')
                .then(function(resdata) {
                    if(resdata.data.code === 0){
                        vm.channel_list =resdata.data.RTMPSrc_nodes.channel_list;
                        vm.expTime_list =resdata.data.TOKEN_VALID_PERIOD_CHOICES;
                        vm.RTMPSrc_list =resdata.data.RTMPSrc_nodes.RTMPSrc_list;
                        vm.template_list =resdata.data.codec_template.templates;
                        vm.validTime_list =resdata.data.codec_template.storage_valid_period_choice;

                        vm.step1From.channel =resdata.data.RTMPSrc_nodes.channel_list[0].name;
                        vm.step2Form.expTime =resdata.data.TOKEN_VALID_PERIOD_CHOICES[0][0];
                        if(resdata.data.RTMPSrc_nodes.RTMPSrc_list[0]){
                            vm.step3Form.resource =resdata.data.RTMPSrc_nodes.RTMPSrc_list[0].id;
                        } else {
                            vm.$message.error("没有可用的推流节点");
                        }
                        vm.step4Form.template.push(resdata.data.codec_template.templates[0].id);
                        vm.step4Form.validTime =resdata.data.codec_template.storage_valid_period_choice[0][0];

                    } else if(resdata.data.code === 1){
                        vm.$message.error(resdata.data.msg);
                    } else {
                        vm.$message.error(resdata.data.msg);
                    }
                }).catch(function(error) {
                    vm.$message.error(error.message);
            });
        }
    })