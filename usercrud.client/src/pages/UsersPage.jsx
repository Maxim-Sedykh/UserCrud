
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import userService from '../services/userService';
import UserDetailModal from '../components/UserDetailModal';
import UserForm from '../components/UserForm';
import Pagination from '../components/Pagination';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false); // Для загрузки пользователя на редактирование
    const [isSubmitting, setIsSubmitting] = useState(false); // Для предотвращения двойной отправки формы
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers(currentPage, itemsPerPage);
            setUsers(response.data.items);
            setTotalUsers(response.data.totalCount);
        } catch (error) {
            console.error('Ошибка при загрузке списка пользователей:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, itemsPerPage]); // Перезагружаем список при смене страницы или кол-ва элементов

    const handleViewDetails = async (id) => {
        try {
            const response = await userService.getUserById(id);
            setSelectedUser(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Ошибка при загрузке деталей пользователя:', error);
        }
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedUser(null);
    };

    const handleCreateUser = () => {
        setUserToEdit(null); // Убеждаемся, что форма в режиме создания
        setShowForm(true);
    };

    // **********************************************
    // ИСПРАВЛЕНИЕ: Загружаем полные данные пользователя для редактирования
    // **********************************************
    const handleEditUser = async (id) => { // Теперь принимаем ID
        setIsLoadingUser(true); // Показываем, что идет загрузка
        setShowForm(true); // Открываем форму сразу, чтобы показать лоадер
        try {
            const response = await userService.getUserById(id);
            setUserToEdit(response.data); // Устанавливаем полные данные
        } catch (error) {
            console.error('Ошибка при загрузке пользователя для редактирования:', error);
            // Можно вывести сообщение об ошибке пользователю
            setShowForm(false); // Закрываем форму, если не удалось загрузить
        } finally {
            setIsLoadingUser(false); // Завершаем загрузку
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Ошибка при удалении пользователя:', error);
            }
        }
    };

    const handleActivateDeactivate = async (id, isActive) => {
        try {
            if (isActive) {
                await userService.deactivateUser(id);
            } else {
                await userService.activateUser(id);
            }
            fetchUsers();
        } catch (error) {
            console.error('Ошибка при изменении статуса пользователя:', error);
        }
    };

    // **********************************************
    // ИСПРАВЛЕНИЕ: Предотвращение двойного POST
    // **********************************************
    const handleFormSubmit = async (formData) => {
        if (isSubmitting) return; // Если уже отправляем, игнорируем повторный вызов

        setIsSubmitting(true); // Устанавливаем флаг отправки
        try {
            if (userToEdit) {
                await userService.updateUser(userToEdit.id, formData);
            } else {
                await userService.createUser(formData);
            }
            setShowForm(false);
            fetchUsers(); // Обновляем список пользователей
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            // Дополнительная обработка ошибок (например, показать сообщение пользователю)
        } finally {
            setIsSubmitting(false); // Снимаем флаг отправки
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setUserToEdit(null); // Сбрасываем userToEdit при отмене
    };

    const totalPages = Math.ceil(totalUsers / itemsPerPage) || 1;

    return (
        <div className="user-list">
            <h1>Управление пользователями</h1>
            <button onClick={handleCreateUser} style={{ marginBottom: '20px' }}>
                Создать пользователя
            </button>

            {showForm && (
                <UserForm 
                    userToEdit={userToEdit} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancelForm}
                    isLoadingUser={isLoadingUser} // Передаем состояние загрузки для формы
                    isSubmitting={isSubmitting} // Передаем состояние отправки для формы
                />
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Email</th>
                        <th>Активен</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.login}</td>
                        <td>{user.email}</td>
                        <td>{user.isActive ? 'Да' : 'Нет'}</td>
                        <td>
                            <button onClick={() => handleViewDetails(user.id)}>Детали</button>
                            {/* Передаем ID, а не весь объект user */}
                            <button className="edit" onClick={() => handleEditUser(user.id)}>Редактировать</button>
                            <button
                            className={user.isActive ? 'deactivate' : 'activate'}
                            onClick={() => handleActivateDeactivate(user.id, user.isActive)}
                            >
                            {user.isActive ? 'Деактивировать' : 'Активировать'}
                            </button>
                            <button className="delete" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {showDetailModal && <UserDetailModal user={selectedUser} onClose={handleCloseDetailModal} />}
        </div>
    );
};

export default UsersPage;
