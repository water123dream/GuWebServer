create database GuUser DEFAULT CHARACTER SET utf8;
use GuUser；
create table User 
(id int primary key auto_increment, 
username varchar(100) not null, 
password varchar(100) not null)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
