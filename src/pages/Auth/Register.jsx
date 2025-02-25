import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    clearError();
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/'); // 注册成功后重定向到首页
    } catch (err) {
      // 错误由 AuthContext 处理
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>创建账号</h2>
        <p className="auth-subtitle">请填写您的信息</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="firstName">名字</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="请输入名字"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">姓氏</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="请输入姓氏"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="请输入邮箱"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="请设置密码"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? '创建账号中...' : '注册'}
          </button>
        </form>

        <p className="auth-footer">
          已有账号？ <Link to="/login">立即登录</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
