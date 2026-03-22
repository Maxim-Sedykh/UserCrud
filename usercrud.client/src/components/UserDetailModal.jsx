import React from 'react';

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h3>Детали пользователя: {user.login}</h3>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Login:</strong> {user.login}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Имя:</strong> {user.firstName || 'Не указано'}</p>
                <p><strong>Фамилия:</strong> {user.lastName || 'Не указано'}</p>
                <p><strong>Отчество:</strong> {user.patronymic || 'Не указано'}</p>
                <p><strong>Возраст:</strong> {user.age}</p>
                <p><strong>Активен:</strong> {user.isActive ? 'Да' : 'Нет'}</p>
                <p><strong>Создан:</strong> {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}</p>
            </div>
        </div>
    );
};

export default UserDetailModal;