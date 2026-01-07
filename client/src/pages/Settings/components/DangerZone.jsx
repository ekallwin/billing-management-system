import { Trash2 } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';

const DangerZone = ({ onDeleteStart, currentUser }) => {
    return (
        <div className="glass card animate-fade" style={{ borderColor: 'var(--danger)', borderWidth: '1px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Trash2 size={20} className="text-danger" style={{ color: 'var(--danger)' }} />
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--danger)' }}>Danger Zone</h4>
            </div>
            <div>
                <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Delete Business Account</h5>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Once you delete your account, there is no going back. Please be certain.
                    All your data including products, bills, and settings will be permanently deleted.
                </p>
                <button
                    className="btn"
                    style={{ background: 'var(--danger)', color: 'white', border: 'none' }}
                    onClick={() => {
                        const isPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');
                        if (!isPasswordProvider) {
                            confirmAlert({
                                title: 'Error',
                                message: 'You need to set an account password before you can delete your account. Please go to "Account Password" to set one.',
                                buttons: [{ label: 'OK', onClick: () => { } }]
                            });
                            return;
                        }

                        confirmAlert({
                            title: 'Delete Business?',
                            message: 'This action is irreversible. Are you sure you want to continue?',
                            buttons: [
                                {
                                    label: 'Cancel',
                                    onClick: () => { }
                                },
                                {
                                    label: 'Yes, Delete',
                                    onClick: onDeleteStart
                                }
                            ]
                        });
                    }}
                >
                    Delete Business
                </button>
            </div>
        </div>
    );
};

export default DangerZone;
