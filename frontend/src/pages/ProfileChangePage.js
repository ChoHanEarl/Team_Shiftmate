import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import * as userApi from '../api/userApi';
import {
    Container, Header, BackBtn, PageTitle,
    Card, CardTitle, FieldRow, FieldLabel, FieldValue, FieldInput,
    EditBtn, SaveBtn, CancelBtn, BtnGroup,
    PasswordForm, PwInput, PwSaveBtn,
    DangerCard, DangerText, DeleteBtn,
    ErrorMsg, SuccessMsg
} from '../styles/ProfileChangePage.styles';

const ProfileChangePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const [editingField, setEditingField] = useState(null);
    const [nameVal, setNameVal] = useState(user?.name || '');
    const [phoneVal, setPhoneVal] = useState(user?.phoneNumber || '');
    const [fieldMsg, setFieldMsg] = useState({ text: '', ok: false });

    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: ''});
    const [pwMsg, setPwMsg] = useState({ text: '', ok: false});

    if (!user) return null;

    const refreshUser = async () => {
        try {
            const res = await userApi.getUserInfo(user.userNumber);
            const updatedUser = res.data.user;
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            useAuthStore.setState({ user: updatedUser });
        } catch (err) {
            console.error('ユーザー情報の変更に失敗:',err);
        }
    }

    const handleChangeName = async() => {
        try{
            await userApi.updateName(user.userNumber, nameVal);
            await refreshUser();
            setFieldMsg({ text: '名前を変更しました。', ok: true });
            setEditingField(null);
        } catch (err) {
            setFieldMsg({ text: err.response?.data?.message || '更新に失敗しました。', ok: false});
        }
    }

    const handleChangePhone = async() => {
        try {
            await userApi.updatePhoneNumber(user.userNumber, phoneVal);
            await refreshUser();
            setFieldMsg({ text: '電話番号を更新しました。', ok: true });
            setEditingField(null);
        } catch (err) {
            setFieldMsg({ text: err.response?.data?.message || '更新に失敗しました。'});
        }
    }

    const handleChangePassword = async () => {
        if (!pwForm.currentPassword || !pwForm.newPassword) {
            setPwMsg({ text: 'すべての項目を入力してください。', ok: false});
            return;
        }
        try {
            await userApi.updatePassword(user.userNumber, pwForm.currentPassword, pwForm.newPassword);
            setPwMsg({ text: 'パスワードを変更しました。', ok: true });
            setPwForm({ currentPassword: '', newPassword: '' });
             alert('パスワードを変更しました。\nセキュリティのため、再ログインしてください。');
            logout();
            navigate('/login');
        } catch (err) {
            setPwMsg({ text: err.response?.data?.message || '変更に失敗しました。', ok: false });
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('本当に退会しますか？\nこの操作は取り消せません。')) return;
        try {
            await userApi.deleteUser(user.userNumber);
            logout();
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || '退会処理に失敗しました。');
        }
    }

    return (
        <Container>
            <Header>
                <BackBtn onClick={() => navigate(-1)}>← 戻る</BackBtn>
                <PageTitle>プロフィール設定</PageTitle>
            </Header>

            <Card>
                <CardTitle>基本情報</CardTitle>
                {fieldMsg.text && (
                    fieldMsg.ok 
                        ? <SuccessMsg style={{ marginBottom: 12 }}>{fieldMsg.text}</SuccessMsg>
                        : <ErrorMsg style={{ marginBottom: 12 }}>{fieldMsg.text}</ErrorMsg>
                )}

                <FieldRow>
                    <FieldLabel>名前</FieldLabel>
                    {editingField === 'name' ? (
                        <>
                            <FieldInput value={nameVal} onChange={e => setNameVal(e.target.value)} autoFocus />
                            <BtnGroup>
                                <SaveBtn onClick={handleChangeName}>保存</SaveBtn>
                                <CancelBtn onClick={() => {setEditingField(null); setNameVal(user.name); }}>キャンセル</CancelBtn>
                            </BtnGroup>    
                        </>
                    ) : (
                        <>
                            <FieldValue>{user.name}</FieldValue>
                            <EditBtn onClick={() => { setEditingField('name'); setFieldMsg({ text: '', ok: false }); }}>変更</EditBtn>
                        </>
                    )}
                </FieldRow>

                <FieldRow>
                    <FieldLabel>電話番号</FieldLabel>
                    {editingField === 'phone' ? (
                        <>
                            <FieldInput value={phoneVal} onChange={e => setPhoneVal(e.target.value)} placeholder="090-1234-5678" autoFocus />
                            <BtnGroup>
                                <SaveBtn onClick={handleChangePhone}>保存</SaveBtn>
                            </BtnGroup>
                        </>
                    ) : (
                        <>
                            <FieldValue>{user.phoneNumber || '未設定'}</FieldValue>
                            <EditBtn onClick={() => { setEditingField('phone'); setFieldMsg({ text: '', ok: false }); }}>変更</EditBtn>
                        </>
                    )}
                </FieldRow>

                <FieldRow><FieldLabel>ユーザーID</FieldLabel><FieldValue>{user.userId}</FieldValue></FieldRow>
                <FieldRow><FieldLabel>権限</FieldLabel><FieldValue>{user.userType}</FieldValue></FieldRow>
                <FieldRow><FieldLabel>メール</FieldLabel><FieldValue>{user.email || '未設定'}</FieldValue></FieldRow>
                <FieldRow><FieldLabel>生年月日</FieldLabel><FieldValue>{user.birthDate || '未設定'}</FieldValue></FieldRow>
            </Card>

            <Card>
                <CardTitle>パスワード変更</CardTitle>
                <PasswordForm>
                    <PwInput type="password" placeholder="現在のパスワード"
                        value={pwForm.currentPassword}
                        onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                    <PwInput type="password" placeholder="新しいパスワード (8文字以上・英数字)"
                        value={pwForm.newPassword}
                        onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                    {pwMsg.text && (pwMsg.ok
                        ? <SuccessMsg>{pwMsg.text}</SuccessMsg>
                        : <ErrorMsg>{pwMsg.text}</ErrorMsg>)}
                    <PwSaveBtn onClick={handleChangePassword}>パスワードを変更する</PwSaveBtn>
                </PasswordForm>
            </Card>

            <DangerCard>
                <DangerText>
                    <h3>退会する</h3>
                    <p>退会するとアカウントは完全に削除され、復元できません。</p>
                </DangerText>
                <DeleteBtn onClick={handleDelete}>退会する</DeleteBtn>
            </DangerCard>
        </Container>
    )
}

export default ProfileChangePage;