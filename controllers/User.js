// const express = require('express');
const jwt = require('jsonwebtoken');
const db = require("../routes/db-config");
const mysql = require('mysql');
const JWT_SECRET = process.env.JWT_SECRET;

const user = async (req, res) => {
  // 从请求的cookie中获取token
  const token = req.cookies['userRegistered'];
  // 检查token是否存在
  if (token == null) {
    return res.sendStatus(401); // 没有token，返回401未授权
  }
  
  // 使用jwt.verify验证token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // token无效，返回403禁止
    }
    // token有效，从decoded中获取用户ID
    const userId = decoded.id;

    // 使用用户ID从数据库中查询用户信息
    db.query('SELECT * FROM Users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        // 处理查询错误
        console.error('Database query error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }

      if (results.length > 0) {
        // 找到用户，返回用户信息
        const userInfo = results[0];
        return res.status(200).json({ status: 'success', user: userInfo });
      } else {
        // 用户ID没有找到
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
    });
  });
};

module.exports = user;

