### 一、项目描述
本项目是用C++11编写的Web多线程高性能服务器，提供了HTTP协议中的get，head，post三种请求方式，支持HTTP长连接及管线化请求，并且实现双缓冲异步日志功能。
### 二、项目环境
- OS：Ubuntu 16.04
- Complier: g++ 5.4
### 三、项目说明
本项目是参考了陈硕的muduo高性能服务器框架，以一个本人编写的最简单的多路复用的单线程tcp微型服务器为基础，逐步加入muduo的Reactor模式而来的。
技术要点如下。
- 使用Epoll边沿触发的IO多路复用技术，非阻塞IO，使用Reactor模式
- 使用多线程充分利用多核CPU，并使用线程池避免线程频繁创建销毁的开销,使用eventfd实现了线程的异步唤醒
- 使用基于小根堆的定时器关闭超时请求
- 主线程只负责accept请求，并以轮询的方式分发给其它IO线程(兼计算线程)
- 使用双缓冲区技术实现了简单的异步日志系统，并进行压测，效果好于muduo
- 使用智能指针等RAII机制管理内存，并实现http的get，post请求
- 支持优雅关闭连接
- 对网络库进行了横向和纵向压测，结果良好
- 以这个网络库为后台服务器，搭建个人网站，并加入登录系统，使用数据库对登录身份进行验证，有兴趣的可以访问：[http://39.98.218.54:8080/](http://39.98.218.54:8080/)（要是感兴趣，账号密码可以私聊找我要，登录进去是我的一个个人简介）

项目框架图如下所示：
![框架图](https://github.com/water123dream/GuWebServer/tree/master/pic/model.png)
### 四、项目测试
##### 1、日志测试
日志测试以muduo服务器为对照，测试数据如下：

![日志测试数据表](https://github.com/water123dream/GuWebServer/tree/master/pic/logtest.png)

分析制作成折线图如下：
![日志短连接测试折线图](https://github.com/water123dream/GuWebServer/tree/master/pic/shortlog.png)

![日志长连接测试折线图](https://github.com/water123dream/GuWebServer/tree/master/pic/longlog.png)

##### 2、网络库压力测试
压力测试使用的是开源压测工具webbench。
###### ①横向压测
以muduo和另一个类muduo开源网络库WebServer(https://github.com/linyacool/WebServer) 作为比较对象，结果如下：

![压测数据表](https://github.com/water123dream/GuWebServer/tree/master/pic/pressuretest.png)

![压测柱状图](https://github.com/water123dream/GuWebServer/tree/master/pic/pressurepic.png)
###### ②纵向压测
测试自己所写库的最大qps
- 测试条件：
处理器：i5-4210M CPU
RAM：12G
系统类型：64位
- 结果：
短连接最大QPS：24577.4
长连接最大QPS：82834
![短连接最大连接图](https://github.com/water123dream/GuWebServer/blob/master/pic/%E7%9F%AD%E8%BF%9E%E6%8E%A5%E6%9C%80%E5%A4%A7%E8%BF%9E%E6%8E%A5%E6%95%B0.png)
![长连接最大连接图](https://github.com/water123dream/GuWebServer/blob/master/pic/%E9%95%BF%E8%BF%9E%E6%8E%A5%E6%9C%80%E5%A4%A7%E8%BF%9E%E6%8E%A5%E6%95%B0.png)
### 五、项目版本
##### 1、版本一
这个版本是最简单的版本，在我学习epoll函数时，写过一个单线程的echotcp服务器，我将这个程序按照muduo的结构改写成C++版本的，虽然很简单，但是通过这个版本，对于muduo中每个类的理解加深了许多。
##### 2、版本二
这一版本中，新加入定时器功能，定时器主要用于当长连接长时间没有请求时，到时就会自动断开。并且对Channel类进行了多一步的封装了，形成了HttpConnect类和HttpListen类，但是这两个类是面向Channel类，而非基于Channel类，因为这两个类都是把Channel类对象作为自己的成员对象，而不是自己的父类。
##### 3、版本三
第三版本中，主要加入了EventLoop多线程，每接受到一个新的请求连接，就将这个文件描述符放到EventLoopThreadPool中，并且也添加了一些基础类，比如锁，条件变量，带锁计数器等，现在这个库已经是一个比较完整的多线程Tcp回显服务器了
##### 4、版本四
第四版本中，首先加入了HTTP解析功能，能够解析GET，POST，HEAD方法，并且能够根据客户端发来的请求自动判断并实现长短连接。然后加入了异步日志库，并对异步日志库进行测试，性能和muduo的异步日志库进行对比，发现效果要优于muduo异步日志库。
##### 5、版本五
第五版本中，主要是用WebBench进行了横向和纵向压测，在测试中发现一些小bug，比如定时器分离忘记加了，并更改
并将所有挂在epoll上的文件描述符都改成了上边沿触发，之前socket描述符是设置的水平触发。对于这个网络库暂时先更新到这里。
##### 6、版本六
第六版本中，主要是加入了个人网站的业务代码，包括http对get，post解析的具体功能实现，并且加入MySQL数据库来对登录系统做一个验证，并且加入前端代码，并部署在云端服务器，能够实现一直访问。
后面还有值得更新的地方：
- 首先整个库缺少一个自定义的IO缓冲区，我的库中都是使用的string作为缓冲的
- 负载均衡只是采用很简单的轮寻的方式，可以采用更加先进的负载均衡方法
- 可以实现服务器缓存，加速性能
