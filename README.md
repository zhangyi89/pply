## 一键关停

实现直播频道的一键关停服务， 一键关停单个频道或者一键关停所有频道

#### 技术要求

- 操作系统：Ubuntu 18.04
- 编程语言：Python 3
- Web框架：Django 2

#### 采用docker部署
    1. 获取源代码并cd到项目目录
       git clone http://gitlab.ctzcdn.net/zhangyi/mediacloud.stop_channel.git
       
    2. 修改配置文件  
       修改config.py文件中的DATABASE配置，默认会使用容器中的sqlite3数据库配置
    
    3. 创建镜像（此步骤可以忽略，运行镜像的时候会直接拉取registry.ctzcdn.com中的镜像,当前镜像版本请查看CHANGELOG.md）
       docker build --no-cache -t "registry.ctzcdn.com/mediacloud/stop_channel:0.1.1" .
       
    4. 复制配置文件config.py到宿主机的/var/stop_channel目录下
       cp config.py /var/stop_channel
    
    5. 运行镜像(可根据需求修改第一个端口号)
       docker run -e LANG=zh_CN.UTF-8 -p 8080:8080 --privileged -d -v /var/stop_channel:/var/stop_channel registry.ctzcdn.com/mediacloud/stop_channel:0.1.1


#### 创建管理员账号
    注：只可以使用一次，请务必记住第一次操作的用户名和密码
    curl -X POST -H "Content-Type:application/json"  -d '{"username":"admin", "password":"admin@123"}' http://127.0.0.1:8080/api/yjgt/v1/init_super_user

#### 访问路径
    用创建的管理员账户登录，如何可以正常访问并且登录成功，则说明部署成功
    http://127.0.0.1:8080/admin


#### 关停接口测试
    注：若可以正常返回结果，则说明部署成功，具体返回信息请参照API文档说明
    curl -X POST -H "Content-Type:application/json"  -d '{"area":"222222", "id":"222222", "operation":"start"}' http://127.0.0.1:8080/api/yjgt/v1/operation


