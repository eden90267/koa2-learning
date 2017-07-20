CREATE TABLE IF NOT EXISTS  `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT, # 用戶ID
  `email` varchar(255) DEFAULT NULL,    # 郵箱地址
  `password` varchar(255) DEFAULT NULL, # 密碼
  `name` varchar(255) DEFAULT NULL,     # 用戶名
  `nick` varchar(255) DEFAULT NULL,     # 用戶暱稱
  `detail_info` longtext DEFAULT NULL,  # 詳細信息
  `create_time` varchar(20) DEFAULT NULL,   # 創建時間
  `modified_time` varchar(20) DEFAULT NULL, # 修改時間
  `level` int(11) DEFAULT NULL, # 權限級別
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 插入默認信息
INSERT INTO `user_info` set name='admin001', email='admin001@example.com', password='123456';