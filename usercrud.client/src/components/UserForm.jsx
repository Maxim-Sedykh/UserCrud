/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

// Добавляем новые пропсы: isLoadingUser и isSubmitting
const UserForm = ({ userToEdit, onSubmit, onCancel, isLoadingUser, isSubmitting }) => {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        firstName: '',
        lastName: '',
        patronymic: '',
        age: 0,
    });

    useEffect(() => {
        // Если userToEdit есть и данные уже не загружаются
        if (userToEdit && !isLoadingUser) { 
            setFormData({
                login: userToEdit.login,
                email: userToEdit.email,
                firstName: userToEdit.firstName || '',
                lastName: userToEdit.lastName || '',
                patronymic: userToEdit.patronymic || '',
                age: userToEdit.age,
            });
        } else if (!userToEdit && !isLoadingUser) { // Если создаем нового пользователя
            setFormData({
                login: '', email: '', firstName: '', lastName: '', patronymic: '', age: 0,
            });
        }
    }, [userToEdit, isLoadingUser]); // Зависимость от isLoadingUser гарантирует, что мы ждем загрузки

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Если данные пользователя для редактирования еще загружаются, показываем лоадер
    if (isLoadingUser) {
        return (
            <div className="user-form">
                <h3>Загрузка данных пользователя...</h3>
                {/* Здесь можно добавить красивый спиннер или лоадер */}
            </div>
        );
    }

    return (
        <div className="user-form">
        <h3>{userToEdit ? 'Редактировать пользователя' : 'Создать нового пользователя'}</h3>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Логин:</label>
            <input 
                type="text" 
                name="login" 
                value={formData.login} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <div>
            <label>Email:</label>
            <input
            type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <div>
            <label>Имя:</label>
            <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <div>
            <label>Фамилия:</label>
            <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <div>
            <label>Отчество:</label>
            <input 
                type="text" 
                name="patronymic" 
                value={formData.patronymic} 
                onChange={handleChange} 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <div>
            <label>Возраст:</label>
            <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                required 
                min="0" 
                disabled={isSubmitting} // Отключаем поле во время отправки
            />
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : (userToEdit ? 'Сохранить изменения' : 'Создать')}
            </button>
            <button 
                type="button" 
                onClick={onCancel} 
                style={{ marginLeft: '10px', backgroundColor: '#6c757d' }} 
                disabled={isSubmitting} // Отключаем кнопку Отмена во время отправки
            >
                Отмена
            </button>
        </form>
        </div>
    );
};

export default UserForm;