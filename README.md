## 一键关停

实现直播频道的一键关停服务， 一键关停单个频道或者一键关停所有频道

#### 技术要求

- 操作系统：Ubuntu 18.04
- 编程语言：Python 3
- Web框架：Django 2

#### 采用docker部署
    1. 获取源代码并cd到项目目录
       git clone http://gitlab.ctzcdn.net/zhangyi/play_info.git
    
    2. 创建镜像（此步骤可以忽略，运行镜像的时候会直接拉取registry.ctzcdn.com中的镜像,当前镜像版本请查看CHANGELOG.md）
       docker build --no-cache -t "registry.ctzcdn.com/play_live:1.0.0" .
       
    3. 运行镜像(可根据需求修改第一个端口号)
       docker run -e LANG=zh_CN.UTF-8 -p 8080:8080 --privileged -d -v /var/play_live:/var/play_live registry.ctzcdn.com/play_live:1.0.0


#### 创建管理员账号
    注：只可以使用一次，请务必记住第一次操作的用户名和密码
    curl -X POST -H "Content-Type:application/json"  -d '{"username":"admin", "password":"admin@123"}' http://127.0.0.1:8080/api/play_live/v1/init_super_user

#### 访问路径
    用创建的管理员账户登录，如何可以正常访问并且登录成功，则说明部署成功
    http://127.0.0.1:8080/admin
